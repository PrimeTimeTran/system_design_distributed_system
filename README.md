# GCP Distributed System

[Demo](https://system-design-distributed-service-890407456021.us-central1.run.app/increment)

## GCP Setup

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

Build image and run on your local

```sh
docker buildx build \
  --platform linux/amd64 \
  -t gcr.io/system-design-123/system-design-distributed-service

docker run -p 8080:8080 gcr.io/system-design-123/system-design-distributed-service
```

## Deploy

Deploy a new version to GCP Cloud run by pushing to Github.

Push to Github

# Conclusion

## Test the number of instances from CLI

```sh
for i in {1..100}; do curl -s https://system-design-distributed-service-890407456021.us-central1.run.app/increment | jq .instance & done; wait
```

```sh
seq 1 100 | xargs -n1 -P100 -I{} bash -c 'curl -s https://system-design-distributed-service-890407456021.us-central1.run.app/increment | jq -r ".instance" 2>/dev/null || echo "INVALID"' | sort | uniq -c


seq 1 100 | xargs -n1 -P100 -I{} bash -c '
  res=$(curl -s -w "%{http_code}" -o tmp_response.json https://system-design-distributed-service-890407456021.us-central1.run.app/increment)
  if [ "$res" = "200" ]; then
    jq -r ".instance" < tmp_response.json
  else
    echo "HTTP $res"
  fi
' | sort | uniq -c
```

## Describe service metrics

```sh
gcloud run services describe system-design-distributed-service \
  --platform=managed \
  --region=us-central1 \
  --format="yaml"
```
