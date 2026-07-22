# MediCare Hub — Azure Deployment Guide (Student Account $100 Credit)

## Quick Summary: You Do NOT Rebuild Containers Manually!

| What You Do | What Happens Automatically |
|------------|---------------------------|
| `git push` to `main` with server changes | GitHub Actions builds Docker image → pushes to GHCR → deploys to Azure Container Apps |
| `git push` to `main` with client changes | GitHub Actions builds Vite → deploys to Azure Static Web Apps |
| Nothing (idle) | Azure auto-pauses everything → **$0 cost** |

---

## Architecture on Azure

```
┌─────────────────────────────────┐
│  Azure Static Web Apps (FREE)   │ ← Frontend (React + Vite)
│  SSL, CDN, Global Edge          │
└──────────────┬──────────────────┘
               │ /api/* proxy
               ▼
┌─────────────────────────────────┐
│  Azure Container Apps           │ ← Backend (Node.js + Express)
│  Scale-to-Zero (minReplicas: 0) │
│  Consumption Plan = $0 idle     │
└──────────────┬──────────────────┘
               │
               ▼
┌─────────────────────────────────┐
│  SQLite (in-container volume)   │ ← Database (for demo)
│  OR Azure SQL Serverless        │ ← (for production, auto-pause)
└─────────────────────────────────┘
```

---

## Step-by-Step Azure CLI Deployment

### Prerequisites
- Azure CLI installed (`az --version`)
- Logged in (`az login`)
- Active subscription (`az account show`)

### Step 1: Create Resource Group
```bash
az group create --name rg-medicare-hospital --location eastasia
```

### Step 2: Create Container Apps Environment
```bash
az containerapp env create \
  --name container-env-hospital \
  --resource-group rg-medicare-hospital \
  --location eastasia
```

### Step 3: Build & Push Backend Docker Image
```bash
# Build locally
docker build -t medicare-backend:latest ./server

# Tag for GHCR (replace YOUR_GITHUB_USERNAME)
docker tag medicare-backend:latest ghcr.io/YOUR_GITHUB_USERNAME/medicare-backend:latest

# Login to GHCR
echo $GITHUB_TOKEN | docker login ghcr.io -u YOUR_GITHUB_USERNAME --password-stdin

# Push
docker push ghcr.io/YOUR_GITHUB_USERNAME/medicare-backend:latest
```

### Step 4: Deploy Backend to Azure Container Apps (Scale-to-Zero)
```bash
az containerapp create \
  --name medicare-backend-api \
  --resource-group rg-hospital-demo \
  --environment container-env-hospital \
  --image ghcr.io/YOUR_GITHUB_USERNAME/medicare-backend:latest \
  --target-port 5000 \
  --ingress external \
  --min-replicas 0 \
  --max-replicas 2 \
  --cpu 0.25 \
  --memory 0.5Gi \
  --env-vars \
    PORT=5000 \
    NODE_ENV=production \
    JWT_SECRET=medicare_hub_azure_student_secret_2026 \
    GROQ_API_KEY=your_groq_key_here \
    AI_MODE=low_power
```

### Step 5: Deploy Frontend to Azure Static Web Apps
```bash
# Build the frontend first
cd client && npm run build

# Create Static Web App
az staticwebapp create \
  --name medicare-frontend \
  --resource-group rg-hospital-demo \
  --source ./client \
  --location centralindia \
  --sku Free
```

### Step 6: Get Your Live URLs
```bash
# Backend URL
az containerapp show --name medicare-backend-api --resource-group rg-hospital-demo --query properties.configuration.ingress.fqdn -o tsv

# Frontend URL
az staticwebapp show --name medicare-frontend --resource-group rg-hospital-demo --query defaultHostname -o tsv
```

---

## Cost Breakdown (Student Account)

| Resource | Monthly Cost (Idle) | Monthly Cost (Active Demo) |
|----------|-------------------|---------------------------|
| Static Web Apps (Free Tier) | **$0** | **$0** |
| Container Apps (Consumption, 0 replicas) | **$0** | ~$0.50-2.00 |
| Total when idle | **$0** | — |
| Total during demo | — | **< $3/month** |

---

## Setting Up GitHub Actions CI/CD (One-Time)

### 1. Create Azure Service Principal
```bash
az ad sp create-for-rbac \
  --name "medicare-github-deploy" \
  --role contributor \
  --scopes /subscriptions/1ec988de-08ac-4ee6-8efd-64d4aed5e94c/resourceGroups/rg-hospital-demo \
  --sdk-auth
```
Copy the JSON output.

### 2. Add GitHub Secrets
Go to your GitHub repo → Settings → Secrets → Actions:
- `AZURE_CREDENTIALS` → Paste the JSON from step 1
- `AZURE_STATIC_WEB_APPS_API_TOKEN` → Get from Azure Portal (Static Web Apps → Manage Deployment Token)

### 3. Push and Deploy!
```bash
git add .
git commit -m "Deploy MediCare Hub to Azure"
git push origin main
```
That's it! GitHub Actions will automatically build and deploy both frontend and backend.

---

## Updating Your App (No Manual Container Rebuild!)

```bash
# Make your code changes
# ...

# Commit and push
git add .
git commit -m "Updated doctor management UI"
git push origin main

# GitHub Actions automatically:
# 1. Detects which files changed (server/ or client/)
# 2. Builds only what changed
# 3. Deploys to Azure
# 4. Zero downtime
```
