# Azure Deployment Strategy & Cost Optimization Guide
## For MediCare Hub - Azure $100 Student Credit Account

This guide provides the complete step-by-step blueprint to deploy **MediCare Hub** to Azure using **Azure Container Apps** and **Azure SQL Database (Serverless)**, optimized to consume **$0 when idle** and fit well within your $100 Student Credit budget.

---

## 💡 Cost Protection Strategy (Zero Cost When Idle)

| Component | Target Azure Resource | Azure Pricing Tier | Cost Strategy |
| :--- | :--- | :--- | :--- |
| **Frontend Web App** | **Azure Static Web Apps** | **Free Tier ($0/mo)** | Global CDN, SSL, and custom domain are 100% free forever. |
| **Backend API** | **Azure Container Apps (ACA)** | **Consumption Plan** | Configured with `minReplicas: 0`. Compute scales to zero when traffic stops. Free tier includes 2 Million execution seconds/month. |
| **Database Engine** | **Azure SQL Database** | **General Purpose (Serverless)** | Configured with **Auto-pause** (pauses compute after 1 hour of inactivity). Pays only cents for storage (~$0.11/GB/month). |
| **Container Registry** | **GitHub Container Registry (GHCR)** | **Free Public/Private Tier** | $0 hosting for your Docker images. |

---

## 🏗️ Architecture & Deployment Flow

```
[ User Browser ]
       │
       ▼
Azure Static Web Apps (Free Tier: https://medicare-demo.azurestaticapps.net)
       │
       ▼ HTTPS REST API
Azure Container Apps (Consumption: minReplicas = 0)
       │
       ▼ T-SQL Driver
Azure SQL Database (General Purpose Serverless - Auto-Pause Enabled)
```

---

## 🛠️ Step-by-Step Azure CLI Deployment Script

### Prerequisites
- Install [Azure CLI](https://learn.microsoft.com/en-us/cli/azure/install-azure-cli)
- Log in to your Azure Student Account:
  ```bash
  az login
  ```

---

### Step 1: Create Azure Resource Group
```bash
az group create \
  --name rg-medicare-demo \
  --location eastus
```

---

### Step 2: Create Azure SQL Database (Serverless with Auto-Pause)

```bash
# 1. Create SQL Logical Server
az sql server create \
  --name medicare-sql-server-demo \
  --resource-group rg-medicare-demo \
  --location eastus \
  --admin-user medicareadmin \
  --admin-password "AzureSecretPass123!"

# 2. Allow Azure services to access SQL server
az sql server firewall-rule create \
  --resource-group rg-medicare-demo \
  --server medicare-sql-server-demo \
  --name AllowAzureServices \
  --start-ip-address 0.0.0.0 \
  --end-ip-address 0.0.0.0

# 3. Create General Purpose Serverless DB with 60-minute Auto-Pause
az sql db create \
  --resource-group rg-medicare-demo \
  --server medicare-sql-server-demo \
  --name hospitaldb \
  --edition GeneralPurpose \
  --family Gen5 \
  --capacity 0.5 \
  --compute-model Serverless \
  --auto-pause-delay 60
```

---

### Step 3: Build & Push Docker Container to GitHub Container Registry (Free)

```bash
# Login to GitHub Container Registry
echo $GITHUB_TOKEN | docker login ghcr.io -u <YOUR_GITHUB_USERNAME> --password-stdin

# Build and Push Backend Docker Image
docker build -t ghcr.io/<YOUR_GITHUB_USERNAME>/medicare-backend-api:latest ./server
docker push ghcr.io/<YOUR_GITHUB_USERNAME>/medicare-backend-api:latest
```

---

### Step 4: Deploy Backend API to Azure Container Apps (Scale-to-Zero)

```bash
# 1. Create Container Apps Environment
az containerapp env create \
  --name env-medicare \
  --resource-group rg-medicare-demo \
  --location eastus

# 2. Deploy Backend API Container App with minReplicas: 0
az containerapp create \
  --name medicare-backend-api \
  --resource-group rg-medicare-demo \
  --environment env-medicare \
  --image ghcr.io/<YOUR_GITHUB_USERNAME>/medicare-backend-api:latest \
  --target-port 5000 \
  --ingress external \
  --min-replicas 0 \
  --max-replicas 2 \
  --env-vars \
    NODE_ENV=production \
    JWT_SECRET="medicare_super_jwt_production_key_2026" \
    AZURE_SQL_CONNECTION_STRING="Server=tcp:medicare-sql-server-demo.database.windows.net,1433;Initial Catalog=hospitaldb;Persist Security Info=False;User ID=medicareadmin;Password=AzureSecretPass123!;MultipleActiveResultSets=False;Encrypt=True;TrustServerCertificate=False;Connection Timeout=30;"
```

---

### Step 5: Deploy Frontend React App to Azure Static Web Apps

```bash
# Build React application
cd client
npm run build

# Deploy to Azure Static Web Apps
az staticwebapp create \
  --name medicare-frontend-web \
  --resource-group rg-medicare-demo \
  --source ./dist \
  --location "eastus2"
```

---

## 📊 Estimated Monthly Budget Breakdown

| Azure Service | Active Demo Cost | Idle Cost (95% of time) | Monthly Student Credit Usage |
| :--- | :--- | :--- | :--- |
| **Azure Static Web Apps** | $0.00 | $0.00 | **$0.00** |
| **Azure Container Apps** | ~$0.000012 / sec | **$0.00** (scaled to 0) | **$0.00 - $0.50** |
| **Azure SQL Serverless** | ~$0.000145 / sec | **$0.00** (auto-paused) | **$0.15 - $1.00** (storage only) |
| **Total Estimated Spend** | — | — | **<$2.00 / month out of $100!** |

---

## 🎯 Hardcoded Testing Credentials
For quick demo presentations and testing:
- **Admin Login**: Username/Email: `admin` | Password: `pass123!`
- **Patient Login**: Username/Email: `rahul@example.com` | Password: `patient123`
