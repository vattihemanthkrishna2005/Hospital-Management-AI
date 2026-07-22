# Hospital Management & Appointment System (MediCare Hub)
## Complete Architecture, Feature Breakdown & Azure Deployment Strategy

---

## 1. Executive Summary & Azure Student Budget Optimization

This project is a full-stack **Hospital Management & Appointment Booking System** built with **React + Vite**, **Node.js + Express**, **Docker**, and **Azure SQL Database**.

### How we keep Azure costs virtually $0 when idle (Perfect for $100 Student Credit):

| Component | Target Azure Service | Cost Strategy when Idle / Testing |
| :--- | :--- | :--- |
| **Frontend** | **Azure Static Web Apps** | **Free Tier ($0/mo)**. Hosting, SSL, CDN are completely free. |
| **Backend API** | **Azure Container Apps (ACA)** | **Consumption Plan (`minReplicas: 0`)**. Scaled down to 0 instances when inactive. 2 Million free execution seconds/mo. |
| **Database** | **Azure SQL Database** | **General Purpose (Serverless Tier)** with **Auto-pause enabled** (e.g. auto-pauses after 60 min inactivity). Pays only for minimal storage (~$0.11/GB/month). |
| **Container Registry** | **Azure Container Registry (ACR)** | **Basic Tier** (~$0.16/day) or use public GitHub Container Registry (ghcr.io) for **$0**. |

---

## 2. Core Features Breakdown

### 🌟 1. Home Page & Public Portal
- **Hero Section**: Sleek call-to-action ("Find a Doctor & Book in 60 Seconds").
- **Department Showcase**: Cards for Cardiology, Neurology, Orthopedics, Pediatrics, Dermatology, General Medicine, etc.
- **Top Doctors Showcase**: Displaying doctor profile, experience, rating, consultation fee, and next available slot.
- **Emergency Helpline & Quick Stats**: Instant contact numbers, operating hours, hospital location map preview.

### 📅 2. Easy Online Appointment Booking
- **Doctor Search & Filter**: Filter by specialty, doctor name, fee range, and available date.
- **Dynamic Slot Selector**: Interactive visual grid showing available time slots (Morning / Afternoon / Evening).
- **Patient Detail Form**: Easy input for patient name, contact info, reason for visit, and insurance/symptom notes.
- **Instant Booking Confirmation**: Generates a unique Appointment Reference ID & downloadable ticket summary.

### 📋 3. Admin & Staff Dashboard
- **Patient Queue & Status Tracker**: Live table showing patients scheduled for today with real-time status toggles:
  - 🟡 `Scheduled`
  - 🔵 `Checked-in`
  - 🟣 `In Consultation`
  - 🟢 `Completed`
  - 🔴 `Cancelled`
- **Analytics Cards**: Total appointments today, completed appointments, active doctors, daily revenue.
- **Doctor Schedule Manager**: Admin can add new doctors, edit specialization, set working hours and slot durations.

### 📜 4. Previous Records & Patient History Page
- **Medical History Lookup**: Search patient records by Patient ID / Phone / Email.
- **Prescription & Diagnosis Records**: Timeline of past doctor visits, diagnoses, prescribed medications, and doctor notes.
- **Downloadable PDF Summary**: One-click export of medical record summary.

---

## 3. Creative & Smart Features (Ideas for Wow Factor)

1. **AI Symptom Matcher (Widget)**:
   - Patients can describe symptoms (e.g., *"fever, headache, stiff neck"*).
   - Smart recommendation engine suggests the right specialty (e.g., General Physician or Neurologist) and lists recommended doctors.

2. **Automated Notification Simulator (Email / SMS / WhatsApp)**:
   - Simulates sending appointment confirmation & reminder alerts to the patient.

3. **Emergency Quick-Book Mode**:
   - One-click priority booking for urgent consultations with on-duty doctors.

4. **Multi-Role Switcher (Demo Friendly)**:
   - Top banner toggle allowing instantaneous switching between **Patient View**, **Doctor View**, and **Admin View** for effortless demo presentations.

---

## 4. Azure Deployment Blueprint

### Step 1: Push Container to Registry
```bash
# Build & Push Docker container to GHCR or ACR
docker build -t containerapps-hospital-api:v1 ./server
docker tag containerapps-hospital-api:v1 ghcr.io/<your-github-username>/hospital-api:v1
docker push ghcr.io/<your-github-username>/hospital-api:v1
```

### Step 2: Deploy Backend to Azure Container Apps (Scale-to-Zero)
```bash
az containerapp create \
  --name hospital-backend-api \
  --resource-group rg-hospital-demo \
  --environment container-env-hospital \
  --image ghcr.io/<your-github-username>/hospital-api:v1 \
  --target-port 5000 \
  --ingress external \
  --min-replicas 0 \
  --max-replicas 2 \
  --env-vars DB_HOST="hospital-sql-server.database.windows.net" DB_NAME="hospitaldb" DB_USER="adminuser" DB_PASS="<SecretPassword>"
```

### Step 3: Deploy Frontend to Azure Static Web Apps
```bash
# Deployed via GitHub Actions or Azure CLI
az staticwebapp create \
  --name hospital-frontend \
  --resource-group rg-hospital-demo \
  --source ./client \
  --location "eastus2"
```

---

## 5. Next Action Items & Suggestions for Selection

Please review the proposed plan and let me know your preferred selections:
1. **Database preference**: Azure SQL Serverless (MSSQL) vs PostgreSQL / SQLite for local dev.
2. **Auth Preference**: JWT with Role-based Access Control (Patient, Doctor, Admin).
3. **Smart Features**: Include AI Symptom Matcher & PDF Export?

When you approve, we will initiate Phase 1 & 2 project code scaffolding!
