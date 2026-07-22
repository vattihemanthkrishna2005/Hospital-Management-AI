# AGENTS.md - Agent Working Context & Task Tracker

## Project Summary
- **App Name**: MediCare Hub - Hospital Management & Appointment Booking System
- **Tech Stack**:
  - Frontend: React 19 + Vite + Mandatory Login Gate + RBAC Authentication + Nginx Docker
  - Backend: Node.js + Express + JWT RBAC + Multi-Tenant Support + Docker
  - Database: SQLite / Azure SQL Database (Serverless with Auto-Pause)
- **Deployment Budget Strategy**: Azure $100 Student Account, zero cost when idle via Container App scale-to-zero and SQL Serverless auto-pause.
- **Azure Account Status**: Verified active **Azure for Students** subscription (`1ec988de-08ac-4ee6-8efd-64d4aed5e94c`).

---

## Agent Instructions & Rules
1. **Query Update Requirement**: Update this `AGENTS.md` file after significant steps or changes to keep track of project state across turns/queries.
2. **Code Quality**: Premium UI design system with vibrant gradients, glassmorphic patient portal, clean high-density professional Admin panel, and clean typography.
3. **Cost Sensitivity**: Ensure all cloud configs prioritize low cost / auto-pause / auto-scale to 0 for demo mode.

---

## Development Log & Query Updates

### Query 1 (2026-07-22)
- **User Request**: Create planning, architecture options, suggestions for Hospital Management System on Azure, create `.markdown` plan file, and create `AGENTS.md`.
- **Status**: Initial Planning Completed.

### Query 2 (2026-07-22)
- **User Selection**: Option A (Azure SQL Serverless ready), RBAC, AI Symptom Matcher & PDF download.
- **Status**: Completed.

### Query 3 (2026-07-22)
- **User Request**:
  - Backend login with RBAC, JWT enforcement, multi-tenant RBAC support.
  - Clean Admin dashboard with doctor picture uploads & gray person placeholder avatar fallback.
  - Full app Dockerization.
- **Status**: Completed.

### Query 4 (2026-07-22)
- **User Request**:
  - Mandatory Login Gate: No user can access the UI without logging in.
  - Hardcoded Testing Credentials: `admin` / `pass123!`.
  - Comprehensive Azure Deployment Strategy guide for Student Account.
- **Status**: Completed.

### Query 5 (2026-07-22)
- **User Request**: Check Azure CLI access and resolve Admin credentials.
- **Status**: Completed. Verified Azure CLI v2.88.0 & active Azure for Students subscription (`1ec988de-08ac-4ee6-8efd-64d4aed5e94c`). Resolved admin credential authentication for `admin` / `pass123!` and `admin@medicare.com` / `pass123!`.

### Query 6 (2026-07-22)
- **User Request**: 
  - Fix admin self-registration vulnerability where any user can register as `ADMIN`.
  - Split monolithic 434-line `AdminDashboard.jsx` into multi-page tabbed UI.
  - Role-based Navbar (hide Admin panel from Patients, hide Patient tabs from Admins).
  - Suggest & implement easy Azure deployment strategy (avoid manual container rebuilds).
- **Work Completed**:
  - **🔐 Security Fix**: Hardcoded `role = 'PATIENT'` on `/api/auth/register` (ignoring user input). Protected `/api/appointments/all` and `/:id/status` endpoints with `authenticateToken` + `authorizeRoles('ADMIN')`.
  - **🖥️ Admin Panel Restructure**: Created 4 clean sub-pages in `client/src/components/admin/`:
    - `AdminOverview.jsx`: Key metrics (total appointments, today's count, active doctors, revenue).
    - `AdminAppointments.jsx`: Interactive patient queue with status toggles.
    - `AdminDoctors.jsx`: Doctor directory + Add Doctor form with photo upload & gray placeholder fallback.
    - `AdminRecords.jsx`: Patient medical record history search.
    - `AdminDashboard.jsx`: Lightweight tab controller shell with sidebar navigation.
  - **👁️ Navbar RBAC**: Updated `Navbar.jsx` so `ADMIN` users see Admin Control Panel tab, and `PATIENT` users see booking, AI symptom matcher, and medical records tabs.
  - **⚡ Groq AI Symptom Matcher**: Integrated `groq-sdk` with `llama-3.1-8b-instant` Low Power Mode (120 max token cap, 0ms emergency filter, zero deep reasoning token burn).
  - **🔄 CI/CD Pipelines**: Created `.github/workflows/deploy-backend.yml` and `.github/workflows/deploy-frontend.yml` for automatic deployment on `git push`.
  - **📖 Azure Deployment Guide**: Created [AZURE_DEPLOY_GUIDE.md](file:///c:/Users/vatti%20hemanthkrishna/OneDrive/Desktop/INTERNSHIP/AZURE_DEPLOY_GUIDE.md) detailing scale-to-zero Container Apps + Static Web Apps setup.

### Query 7 (2026-07-22)
- **User Request**: Document everything in `AGENTS.md` and continue Azure CLI deployment.
- **Work Completed**:
  - **Azure Subscription Policy Discovery**: Identified Azure Student Account policy restriction (`sys.regionrestriction`), allowing deployments in `eastasia` (East Asia - closest allowed high-speed region to India).
  - **Resource Provisioning**: Created resource group `rg-medicare-hospital` in `eastasia`.
  - **Log Analytics Workspace**: Successfully provisioned `log-medicare-hospital` in `eastasia`.
  - **Container Apps Environment**: `container-env-hospital` successfully created and active in `eastasia`.
- **Status**: Completed & Fully Documented.


