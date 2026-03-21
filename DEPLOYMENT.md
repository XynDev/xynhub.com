# Deployment Guide

Complete guide for deploying XYNHub to production with Vercel and Supabase Cloud.

## Table of Contents

1. [OAuth Setup (Google & GitHub)](#1-oauth-setup)
2. [Supabase Cloud Setup](#2-supabase-cloud-setup)
3. [Vercel Deployment](#3-vercel-deployment)
4. [Post-Deployment](#4-post-deployment)

---

## 1. OAuth Setup

### Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Navigate to **APIs & Services > Credentials**
4. Click **Create Credentials > OAuth 2.0 Client ID**
5. Configure the consent screen:
   - App name: `XYNHub Admin`
   - User support email: your email
   - Authorized domains: your domain (e.g., `xynhub.com`)
6. Create OAuth Client ID:
   - Application type: **Web application**
   - Name: `XYNHub Admin`
   - Authorized JavaScript origins:
     ```
     http://localhost:3001
     https://your-admin-domain.vercel.app
     ```
   - Authorized redirect URIs:
     ```
     http://127.0.0.1:54321/auth/v1/callback
     https://<your-supabase-project>.supabase.co/auth/v1/callback
     ```
7. Copy the **Client ID** and **Client Secret**

### GitHub OAuth

1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Click **New OAuth App**
3. Fill in:
   - Application name: `XYNHub Admin`
   - Homepage URL: `https://your-domain.com`
   - Authorization callback URL:
     ```
     https://<your-supabase-project>.supabase.co/auth/v1/callback
     ```
   For local development, create a separate OAuth app with:
     ```
     http://127.0.0.1:54321/auth/v1/callback
     ```
4. Copy the **Client ID** and generate a **Client Secret**

### Configure OAuth in Local Supabase

Create `packages/supabase/supabase/.env`:

```env
SUPABASE_AUTH_EXTERNAL_GOOGLE_CLIENT_ID=your-google-client-id
SUPABASE_AUTH_EXTERNAL_GOOGLE_SECRET=your-google-client-secret
SUPABASE_AUTH_EXTERNAL_GITHUB_CLIENT_ID=your-github-client-id
SUPABASE_AUTH_EXTERNAL_GITHUB_SECRET=your-github-client-secret
```

Then restart Supabase:

```bash
cd packages/supabase
npx supabase stop
npx supabase start
```

---

## 2. Supabase Cloud Setup

### Create Project

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Choose a region close to your users
3. Set a strong database password
4. Wait for the project to initialize

### Get Credentials

From your Supabase project dashboard, go to **Settings > API**:

- **Project URL**: `https://<project-id>.supabase.co`
- **anon (public) key**: for frontend/public API access
- **service_role key**: for admin API access (keep secret!)

### Configure OAuth Providers

1. Go to **Authentication > Providers** in the Supabase dashboard
2. Enable **Google**:
   - Paste your Google Client ID and Client Secret
   - Redirect URL is auto-generated: `https://<project-id>.supabase.co/auth/v1/callback`
3. Enable **GitHub**:
   - Paste your GitHub Client ID and Client Secret
   - Update your GitHub OAuth app's callback URL to match Supabase's redirect URL

### Run Migrations

#### Option A: Link and Push (recommended)

```bash
cd packages/supabase

# Login to Supabase CLI
npx supabase login

# Link to your cloud project
npx supabase link --project-ref <your-project-id>

# Push migrations to cloud
npx supabase db push

# Seed data (optional - run seed.sql manually in SQL Editor)
# Go to Supabase Dashboard > SQL Editor > paste contents of supabase/seed.sql > Run
```

#### Option B: Manual SQL

1. Go to Supabase Dashboard > **SQL Editor**
2. Copy the contents of `packages/supabase/supabase/migrations/20260320000000_initial_schema.sql`
3. Run the migration
4. Copy the contents of `packages/supabase/supabase/seed.sql`
5. Run the seed data

### Configure Storage

The migration automatically creates a `media` storage bucket. Verify it exists:

1. Go to **Storage** in the Supabase dashboard
2. You should see a `media` bucket with public access
3. If not, create it manually:
   - Name: `media`
   - Public: Yes
   - File size limit: 10MB
   - Allowed MIME types: `image/jpeg, image/png, image/webp, image/svg+xml, image/gif, application/pdf`

### Configure Auth Redirect URLs

1. Go to **Authentication > URL Configuration**
2. Set **Site URL**: `https://your-admin-domain.vercel.app`
3. Add **Redirect URLs**:
   ```
   https://your-admin-domain.vercel.app/auth/callback
   http://localhost:3001/auth/callback
   ```

---

## 3. Vercel Deployment

This monorepo deploys as 3 separate Vercel projects.

### Deploy API (`apps/api`)

1. Go to [vercel.com](https://vercel.com) > **Add New Project**
2. Import your GitHub repository
3. Configure:
   - **Framework Preset**: Other
   - **Root Directory**: `apps/api`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Add environment variables:
   ```
   SUPABASE_URL=https://<project-id>.supabase.co
   SUPABASE_ANON_KEY=<your-anon-key>
   SUPABASE_SERVICE_ROLE_KEY=<your-service-role-key>
   ALLOWED_ADMIN_EMAILS=ilhamram332@gmail.com
   CORS_ORIGINS=https://your-web-domain.vercel.app,https://your-admin-domain.vercel.app
   PORT=3000
   ```
5. Deploy

> **Note**: For Vercel serverless deployment, you may need to add a `vercel.json` in `apps/api/`:
> ```json
> {
>   "buildCommand": "npm run build",
>   "outputDirectory": "dist",
>   "installCommand": "npm install"
> }
> ```

### Deploy Admin CMS (`apps/admin`)

1. **Add New Project** on Vercel
2. Import the same repository
3. Configure:
   - **Framework Preset**: Next.js
   - **Root Directory**: `apps/admin`
4. Add environment variables:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://<project-id>.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key>
   NEXT_PUBLIC_API_URL=https://your-api-domain.vercel.app
   ALLOWED_ADMIN_EMAILS=ilhamram332@gmail.com
   ```
5. Deploy

### Deploy Landing Page (`apps/web`)

1. **Add New Project** on Vercel
2. Import the same repository
3. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: `apps/web`
4. Add environment variables:
   ```
   VITE_API_URL=https://your-api-domain.vercel.app
   ```
5. Deploy

### Custom Domains

After deployment, configure custom domains in each Vercel project:

- `xynhub.com` → Landing page
- `api.xynhub.com` → API
- `admin.xynhub.com` → Admin CMS

Update `CORS_ORIGINS` in the API project to include the custom domains.

---

## 4. Post-Deployment

### Verify Everything Works

1. Visit your landing page and ensure all content loads
2. Visit the API Swagger docs at `https://your-api-domain/api/docs`
3. Visit the admin panel and test login with your whitelisted email
4. Test creating/editing content in the admin panel
5. Verify changes appear on the landing page

### Add More Admin Users

Update the `ALLOWED_ADMIN_EMAILS` environment variable in both the API and Admin Vercel projects:

```
ALLOWED_ADMIN_EMAILS=ilhamram332@gmail.com,newadmin@gmail.com
```

Redeploy both projects after updating.

### Monitor

- **Supabase Dashboard**: Monitor database, auth, and storage usage
- **Vercel Dashboard**: Monitor deployment logs and analytics
- **API Health**: `GET /health` endpoint returns server status

---

## Environment Variables Reference

### API (`apps/api/.env`)

| Variable | Description | Example |
|----------|-------------|---------|
| `SUPABASE_URL` | Supabase project URL | `https://xxx.supabase.co` |
| `SUPABASE_ANON_KEY` | Supabase anon/public key | `eyJhbG...` |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key | `eyJhbG...` |
| `ALLOWED_ADMIN_EMAILS` | Comma-separated admin emails | `user@gmail.com` |
| `CORS_ORIGINS` | Comma-separated allowed origins | `https://xynhub.com` |
| `PORT` | API server port | `3000` |

### Admin (`apps/admin/.env.local`)

| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | `https://xxx.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key | `eyJhbG...` |
| `NEXT_PUBLIC_API_URL` | API base URL | `https://api.xynhub.com` |
| `ALLOWED_ADMIN_EMAILS` | Admin email whitelist | `user@gmail.com` |

### Web (`apps/web`)

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_URL` | API base URL | `https://api.xynhub.com` |
