# Culture Compass

Culture Compass is a lightweight GenAI travel guide built with Next.js 15, TypeScript, React, Tailwind CSS, and an API-backed generation flow. It generates a practical culture-first trip plan without a database.

For the Destination Discovery & Cultural Experiences challenge, user preferences are validated, sent to `/api/travel-plan`, and transformed into recommendations, hidden gems, immersive storytelling, heritage experiences, local events, and a checklist. If `OPENAI_API_KEY` is configured, the route calls the OpenAI Responses API. If no key is present or the provider is unavailable, the route falls back to the local generator in `src/lib/generate-plan.ts` so demos still work reliably.

## Features

- Clean landing page with "Discover Your Next Destination" and Get Started flow
- Shareable `/plan` route that accepts destination, budget, duration, style, and interests as query parameters
- Validated travel preference form for destination, budget, duration, style, and interests
- Generated attractions, hidden gems, local foods, cultural experiences, festivals, itinerary, travel tips, and estimated budget
- 150-200 word destination storytelling section
- Travel checklist for documents, clothes, medicines, and essentials
- Checklist completion saved in Local Storage
- Print itinerary and download PDF
- Loading, empty, and error states
- Responsive, accessible UI
- Docker image configured for Google Cloud Run

## Architecture

```text
src/
  app/                    Next.js App Router pages, API routes, and global CSS
    api/travel-plan/      Server-side travel-plan generation endpoint
    plan/                 Query-driven travel-plan page
  components/             Reusable UI and feature components
  data/                   Local JSON mock travel data
  lib/                    Validation, generation, and utility functions
  types/                  Shared TypeScript domain types
.github/workflows/        Docker build and Cloud Run deployment workflow
```

Generation is handled by `src/app/api/travel-plan/route.ts`. User input is validated with Zod before a plan is generated. React escapes rendered content by default, and the app does not use `dangerouslySetInnerHTML`.

## Assumptions

- Without `OPENAI_API_KEY`, GenAI behavior falls back to deterministic local data so the app runs without secrets or paid services.
- Estimated budgets are general planning ranges and exclude international flights.
- Festival suggestions are generic local-event ideas, not live event listings.
- PDF export is generated in the browser with `jspdf`.

## Setup

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Optional OpenAI configuration:

```bash
OPENAI_API_KEY=your_api_key
OPENAI_MODEL=gpt-4.1-mini
```

Example direct plan URL:

```text
http://localhost:3000/plan?destination=Japan&budget=medium&duration=3&travelStyle=couple&interests=Nature
```

## Quality Checks

```bash
npm run typecheck
npm run lint
npm run build
```

## Docker

Build and run locally:

```bash
docker build -t culture-compass .
docker run --rm -p 8080:8080 culture-compass
```

Open [http://localhost:8080](http://localhost:8080).

## Google Cloud Run Deployment

The included GitHub Actions workflow builds the Docker image, pushes it to Artifact Registry, and deploys it to Cloud Run.

Required GitHub secrets:

- `GCP_PROJECT_ID`
- `GCP_REGION`
- `GCP_WORKLOAD_IDENTITY_PROVIDER`
- `GCP_SERVICE_ACCOUNT`

One-time Google Cloud setup:

```bash
gcloud services enable run.googleapis.com artifactregistry.googleapis.com iamcredentials.googleapis.com
gcloud artifacts repositories create culture-compass \
  --repository-format=docker \
  --location=YOUR_REGION
```

Configure Workload Identity Federation for GitHub Actions and grant the service account these roles:

- `roles/artifactregistry.writer`
- `roles/run.admin`
- `roles/iam.serviceAccountUser`

Push to `main` or run the workflow manually from GitHub Actions.

## Repository Structure

```text
.
├── .github/workflows/cloud-run.yml
├── Dockerfile
├── README.md
├── next.config.ts
├── package.json
├── postcss.config.js
├── tailwind.config.ts
├── tsconfig.json
└── src
    ├── app
    ├── components
    ├── data
    ├── lib
    └── types
```
