# GCP Distributed System

## Test

## Guide

1. Create a GCP Project

   ```sh
   gcloud projects create system-design-123 \
   --name="System Design" \
   --set-as-default
   ```

2. Set Your Active Project

   ```sh
   gcloud config set project system-design-123
   ```

3. Link Billing (if not done yet)

```sh
gcloud billing accounts list
```

```sh
gcloud billing projects link system-design-123 \
  --billing-account=XXXXXX-XXXXXX-XXXXXX
```

4. Enable Required Cloud APIs

```sh
gcloud services enable \
  run.googleapis.com \
  containerregistry.googleapis.com \
  logging.googleapis.com \
  monitoring.googleapis.com
```

1. Build Image & Push

Setup Environment Variables

```sh
export PROJECT_ID=system-design-123
export SERVICE_NAME=system-design-distributed-service
export IMAGE=gcr.io/$PROJECT_ID/$SERVICE_NAME
```

Build image and push

```sh
# Windows
docker build -t gcr.io/system-design-123/system-design-distributed-service .

# Mac
docker buildx build \
  --platform linux/amd64 \
  -t gcr.io/system-design-123/system-design-distributed-service \
  --push .

# Push to GCP 
docker push gcr.io/system-design-123/system-design-distributed-service
```

6. Build & Deploy to Cloud Run

```sh
IMAGE=gcr.io/system-design-123/system-design-distributed-service
SERVICE_NAME=system-design-distributed-service
REGION=us-central1

gcloud run deploy $SERVICE_NAME \
  --image $IMAGE \
  --platform managed \
  --region $REGION \
  --allow-unauthenticated
```

## Test

```sh
docker run -p 8080:8080 gcr.io/system-design-123/system-design-distributed-service
```

## Deploy

# Conclusion
