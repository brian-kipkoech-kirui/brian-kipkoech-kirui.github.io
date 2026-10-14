# Gemini Media API

A small Node.js service for generating portfolio images and videos through Google's Gemini API. Designed to run on Render and be called from a ChatGPT GPT Action.

## Endpoints

- `GET /health` — public health check.
- `POST /v1/images/generate` — generate an image; optionally provide a reference image for editing.
- `POST /v1/videos/generate` — start a Veo video generation job (returns HTTP 202 and an operation name).
- `GET /v1/videos/operations/{operationName}` — poll a video job until complete.

All `/v1` endpoints require `Authorization: Bearer <CHATGPT_ACTIONS_API_KEY>`.

## Local development

Requires Node.js 20+.

```sh
cd api
cp .env.example .env
# Set GEMINI_API_KEY and CHATGPT_ACTIONS_API_KEY in .env
npm install
npm run dev
```

## Deploy to Render

1. Create a new **Blueprint** in Render and select this repository.
2. Render detects `api/render.yaml`; if prompted, use the repository root and the blueprint path `api/render.yaml`.
3. Add `GEMINI_API_KEY` in the Render service environment. Do not put it in GitHub.
4. Keep the generated `CHATGPT_ACTIONS_API_KEY`; copy it securely for the ChatGPT Action authentication setup.
5. Deploy and verify `https://YOUR-SERVICE.onrender.com/health`.

## Connect ChatGPT

1. Create a GPT in ChatGPT and open its **Actions** configuration.
2. Import `api/openapi.yaml`.
3. Replace the OpenAPI server URL with your actual Render URL.
4. Configure API Key authentication using **Bearer** and the value of `CHATGPT_ACTIONS_API_KEY`.
5. Save and test `generateImage`, then test video generation and polling.

The API key for Google belongs only in Render. The ChatGPT Action receives a separate service key. Do not commit either secret.

## Notes and limitations

- Image responses include base64 data. GPT Actions may not render large binary payloads as inline images; for a production workflow, add durable object storage (for example Cloudinary or an S3-compatible bucket) and return hosted asset URLs.
- Video generation is asynchronous. Poll the operation endpoint until `done: true`; the returned Google video URI is temporary and should be copied into durable storage before publishing.
- Render's local filesystem is ephemeral. This initial milestone does not persist generated assets or publish to GitHub automatically.
- Model availability, quotas, supported resolutions, and billing depend on the Google project and region. Confirm the selected image and Veo model IDs in Google AI Studio before deployment.
- Use actual emulator captures when the portfolio needs to demonstrate working app behavior. AI-generated imagery should be labelled as illustrative concept artwork.
