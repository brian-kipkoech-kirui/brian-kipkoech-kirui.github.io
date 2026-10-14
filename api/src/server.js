import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { GoogleGenAI } from "@google/genai";
import { z } from "zod";

const app = express();
app.disable("x-powered-by");
app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));
app.use(express.json({ limit: "2mb" }));

const allowedOrigins = (process.env.ALLOWED_ORIGINS || "https://chatgpt.com")
  .split(",").map((s) => s.trim()).filter(Boolean);
app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error("Origin not allowed by CORS"));
  }
}));

app.use("/v1", rateLimit({
  windowMs: 60_000,
  limit: Number(process.env.MAX_REQUESTS_PER_MINUTE || 20),
  standardHeaders: "draft-8",
  legacyHeaders: false
}));

const apiKey = process.env.GEMINI_API_KEY;
const actionKey = process.env.CHATGPT_ACTIONS_API_KEY;
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

function requireConfig(req, res, next) {
  if (!ai || !actionKey) return res.status(503).json({ error: "Service is not configured. Set GEMINI_API_KEY and CHATGPT_ACTIONS_API_KEY." });
  const supplied = (req.get("authorization") || "").replace(/^Bearer\s+/i, "");
  if (!supplied || supplied.length !== actionKey.length ||
      !cryptoSafeEqual(supplied, actionKey)) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  next();
}
function cryptoSafeEqual(a, b) {
  // Constant-time comparison without exposing secret values.
  return Buffer.from(a).length === Buffer.from(b).length &&
    timingSafeEqual(Buffer.from(a), Buffer.from(b));
}
import { timingSafeEqual } from "node:crypto";

const imageSchema = z.object({
  prompt: z.string().trim().min(8).max(4000),
  aspectRatio: z.enum(["1:1", "3:4", "4:3", "9:16", "16:9"]).default("9:16"),
  numberOfImages: z.number().int().min(1).max(2).default(1),
  referenceImageBase64: z.string().max(8_000_000).optional(),
  referenceMimeType: z.enum(["image/png", "image/jpeg", "image/webp"]).optional()
}).strict();

const videoSchema = z.object({
  prompt: z.string().trim().min(8).max(4000),
  aspectRatio: z.enum(["9:16", "16:9"]).default("9:16"),
  durationSeconds: z.union([z.literal(4), z.literal(6), z.literal(8)]).default(8),
  resolution: z.enum(["720p", "1080p"]).default("720p"),
  imageBase64: z.string().max(8_000_000).optional(),
  imageMimeType: z.enum(["image/png", "image/jpeg", "image/webp"]).optional()
}).strict();

app.get("/health", (_req, res) => res.json({ status: "ok", service: "gemini-media-api" }));

app.post("/v1/images/generate", requireConfig, async (req, res) => {
  const parsed = imageSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Invalid request", details: parsed.error.issues });
  try {
    const { prompt, aspectRatio, numberOfImages, referenceImageBase64, referenceMimeType } = parsed.data;
    const parts = [{ text: `${prompt}\n\nComposition aspect ratio: ${aspectRatio}. Create polished, legible product imagery. Do not invent real app functionality or claim a prototype is released.` }];
    if (referenceImageBase64) {
      if (!referenceMimeType) return res.status(400).json({ error: "referenceMimeType is required with referenceImageBase64" });
      parts.push({ inlineData: { mimeType: referenceMimeType, data: referenceImageBase64 } });
    }
    const response = await ai.models.generateContent({
      model: process.env.IMAGE_MODEL || "gemini-2.5-flash-image",
      contents: [{ role: "user", parts }],
      config: { responseModalities: ["IMAGE"], imageConfig: { aspectRatio } }
    });
    const images = [];
    for (const candidate of response.candidates || []) {
      for (const part of candidate.content?.parts || []) {
        if (part.inlineData?.data) images.push({
          mimeType: part.inlineData.mimeType || "image/png",
          base64: part.inlineData.data,
          dataUrl: `data:${part.inlineData.mimeType || "image/png"};base64,${part.inlineData.data}`
        });
      }
    }
    if (!images.length) return res.status(502).json({ error: "Gemini returned no image. Try a revised prompt." });
    return res.json({ model: process.env.IMAGE_MODEL || "gemini-2.5-flash-image", images: images.slice(0, numberOfImages) });
  } catch (error) {
    console.error("Image generation failed:", error.message);
    return res.status(502).json({ error: "Image generation failed", message: error.message });
  }
});

app.post("/v1/videos/generate", requireConfig, async (req, res) => {
  const parsed = videoSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Invalid request", details: parsed.error.issues });
  try {
    const { prompt, aspectRatio, durationSeconds, resolution, imageBase64, imageMimeType } = parsed.data;
    if (imageBase64 && !imageMimeType) return res.status(400).json({ error: "imageMimeType is required with imageBase64" });
    const instance = { prompt };
    if (imageBase64) instance.image = { bytesBase64Encoded: imageBase64, mimeType: imageMimeType };
    const operation = await ai.models.generateVideos({
      model: process.env.VIDEO_MODEL || "veo-3.1-generate-preview",
      prompt: instance.prompt,
      image: imageBase64 ? { imageBytes: imageBase64, mimeType: imageMimeType } : undefined,
      config: { aspectRatio, durationSeconds, resolution, numberOfVideos: 1 }
    });
    return res.status(202).json({
      operationName: operation.name,
      done: Boolean(operation.done),
      statusUrl: `/v1/videos/operations/${encodeURIComponent(operation.name || "")}`,
      message: "Video generation started. Poll statusUrl until done is true."
    });
  } catch (error) {
    console.error("Video generation failed:", error.message);
    return res.status(502).json({ error: "Video generation failed", message: error.message });
  }
});

app.get("/v1/videos/operations/:operationName(*)", requireConfig, async (req, res) => {
  try {
    const operationName = decodeURIComponent(req.params.operationName);
    if (!operationName.startsWith("operations/")) return res.status(400).json({ error: "Invalid operation name" });
    const operation = await ai.operations.getVideosOperation({ operation: { name: operationName } });
    const samples = operation.response?.generatedVideos || operation.response?.generateVideoResponse?.generatedSamples || [];
    const videos = samples.map((sample) => ({
      uri: sample.video?.uri || sample.uri || null,
      mimeType: sample.video?.mimeType || "video/mp4"
    })).filter((v) => v.uri);
    return res.json({
      operationName,
      done: Boolean(operation.done),
      error: operation.error || null,
      videos,
      message: operation.done ? "Generation finished. Use the returned video URI to retrieve the output." : "Generation is still running."
    });
  } catch (error) {
    console.error("Video status lookup failed:", error.message);
    return res.status(502).json({ error: "Could not retrieve video status", message: error.message });
  }
});

app.use((err, _req, res, _next) => {
  console.error(err.message);
  res.status(400).json({ error: "Request rejected" });
});

const port = Number(process.env.PORT || 10000);
app.listen(port, "0.0.0.0", () => console.log(`Gemini media API listening on ${port}`));
