# Deploying IntentWeave AI to Render

IntentWeave AI is fully prepared for one-click deployment on **[Render](https://render.com)**.

---

## Method 1: Deploy with Git (Recommended, 2 Minutes)

### Step 1: Push your code to GitHub
If you haven't already initialized git:
```bash
git init
git add .
git commit -m "Initial commit of IntentWeave AI"
git branch -M main
git remote add origin https://github.com/<YOUR_GITHUB_USERNAME>/intentweave-ai.git
git push -u origin main
```

### Step 2: Create a Web Service on Render
1. Go to your [Render Dashboard](https://dashboard.render.com/) and click **New +** &rarr; **Web Service**.
2. Connect your GitHub repository (`intentweave-ai`).
3. Fill in the following settings:
   - **Name**: `intentweave-ai`
   - **Region**: Any (e.g. `Oregon (US West)` or `Frankfurt (EU)`)
   - **Branch**: `main`
   - **Runtime**: `Node`
   - **Build Command**:
     ```bash
     pnpm install --frozen-lockfile=false && pnpm run build
     ```
   - **Start Command**:
     ```bash
     pnpm start
     ```
   - **Plan**: `Free`

### Step 3: Add Environment Variables on Render
Under the **Environment Variables** section, add:
- `NODE_VERSION` = `20.17.0`
- `PNPM_VERSION` = `10.24.0`
- `NODE_ENV` = `production`

*(Optional: If you want to connect cloud LLM keys instead of using the default built-in Demo Mode, you can also add `OPENAI_API_KEY` or `ANTHROPIC_API_KEY` here).*

4. Click **Deploy Web Service**!

---

## Method 2: Automatic Render Blueprint (`render.yaml`)

We have included a [`render.yaml`](file:///c:/IntentWeave%20AI/render.yaml) file in the root directory.
1. In the Render Dashboard, click **New +** &rarr; **Blueprint**.
2. Select your repository.
3. Render will automatically read `render.yaml`, configure the Node 20 runtime, build command, and start command, and deploy the service.

---

## Method 3: Deploy as Docker Container on Render

If you prefer containerized deployment, a multi-stage [`Dockerfile`](file:///c:/IntentWeave%20AI/Dockerfile) is also included:
1. Select **Docker** as the environment when creating the Web Service on Render.
2. Render will build the container using the included `Dockerfile` and expose port `10000`.
