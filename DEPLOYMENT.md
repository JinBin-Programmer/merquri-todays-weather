# Deploying the Backend to GCP Cloud Run

The GitHub Actions workflow (`.github/workflows/deploy-backend.yml`) automatically builds and deploys the backend whenever you push to `main`.

This is a one-time setup guide.

---

## Prerequisites

- GCP project created (note your **Project ID**)
- [`gcloud` CLI](https://cloud.google.com/sdk/docs/install) installed locally
- Admin access to your GitHub repository

---

## Step 1 — Enable required GCP APIs

Run these once in your terminal (replace `YOUR_PROJECT_ID`):

```bash
gcloud config set project YOUR_PROJECT_ID

gcloud services enable \
  run.googleapis.com \
  artifactregistry.googleapis.com \
  cloudbuild.googleapis.com \
  iam.googleapis.com
```

---

## Step 2 — Create an Artifact Registry repository

```bash
gcloud artifacts repositories create weather-app \
  --repository-format=docker \
  --location=asia-southeast1 \
  --description="Weather app Docker images"
```

---

## Step 3 — Create a Service Account for GitHub Actions

```bash
# Create the service account
gcloud iam service-accounts create github-actions-deployer \
  --display-name="GitHub Actions Deployer"

# Grant the required roles
PROJECT_ID=$(gcloud config get-value project)

gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member="serviceAccount:github-actions-deployer@$PROJECT_ID.iam.gserviceaccount.com" \
  --role="roles/run.admin"

gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member="serviceAccount:github-actions-deployer@$PROJECT_ID.iam.gserviceaccount.com" \
  --role="roles/artifactregistry.writer"

gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member="serviceAccount:github-actions-deployer@$PROJECT_ID.iam.gserviceaccount.com" \
  --role="roles/iam.serviceAccountUser"

# Export the JSON key
gcloud iam service-accounts keys create gcp-sa-key.json \
  --iam-account="github-actions-deployer@$PROJECT_ID.iam.gserviceaccount.com"
```

> **Important:** `gcp-sa-key.json` contains credentials — never commit it. Delete it after adding it to GitHub Secrets.

---

## Step 4 — Add GitHub Secrets

Go to your repository → **Settings → Secrets and variables → Actions → New repository secret** and add:

| Secret name           | Value |
|-----------------------|-------|
| `GCP_PROJECT_ID`      | Your GCP project ID (e.g. `my-project-123`) |
| `GCP_SA_KEY`          | Full contents of `gcp-sa-key.json` |
| `OPENWEATHER_API_KEY` | Your OpenWeatherMap API key |
| `MONGODB_URL`         | Your MongoDB Atlas connection string |
| `MONGODB_DB`          | Your database name (e.g. `weather-app`) |

After adding, delete the local key file:

```bash
rm gcp-sa-key.json
```

---

## Step 5 — Push to trigger the first deployment

```bash
git add .
git commit -m "Add Cloud Run deployment workflow"
git push origin main
```

Watch the deployment at: **GitHub → Actions tab**

---

## Step 6 — Get your Cloud Run URL

After the workflow succeeds, the URL is printed in the "Show service URL" step.
It looks like: `https://weather-backend-xxxxxxxxxx-as.a.run.app`

You can also find it in the GCP Console → **Cloud Run → weather-backend → URL**.

---

## Step 7 — Update the frontend to use the Cloud Run URL

Once you have the Cloud Run URL, update the frontend's `BACKEND_URL` environment variable so the Next.js proxy points to it.

For local Docker Compose, update `.env`:
```
BACKEND_URL=https://weather-backend-xxxxxxxxxx-as.a.run.app
```

When you deploy the frontend (e.g. Vercel), set `BACKEND_URL` in the platform's environment variable settings.

Also add the frontend URL to the backend's `ALLOWED_ORIGINS` in Cloud Run:

```bash
gcloud run services update weather-backend \
  --region asia-southeast1 \
  --update-env-vars "ALLOWED_ORIGINS=https://your-frontend-url.com"
```

---

## Changing the region

The workflow defaults to `asia-southeast1` (Singapore). To change it, edit the `REGION` env var at the top of `.github/workflows/deploy-backend.yml` and update the `REGISTRY` host to match (e.g. `us-central1-docker.pkg.dev`).
