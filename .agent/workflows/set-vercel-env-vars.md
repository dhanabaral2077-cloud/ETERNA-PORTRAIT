---
description: How to set environment variables in Vercel
---

# Setting Environment Variables in Vercel

To add API keys or other secrets (like `GELATO_API_KEY`) to your Vercel deployment:

## Option 1: Vercel Dashboard (Recommended)

1.  Log in to your [Vercel Dashboard](https://vercel.com/dashboard).
2.  Select your project (`eternaportrait`).
3.  Navigate to **Settings** > **Environment Variables**.
4.  Add a new variable:
    *   **Key**: `GELATO_API_KEY`
    *   **Value**: `your_gelato_api_key_here` (Copy this from your local `.env` file or Gelato Dashboard)
5.  Select the **Environments** where this variable should be available (usually **Production**, **Preview**, and **Development**).
6.  Click **Save**.
7.  **Redeploy**: For the changes to take effect on a running deployment, you usually need to redeploy the application. Go to **Deployments**, click the three dots on the latest deployment, and select **Redeploy**.

## Option 2: Vercel CLI

If you have the Vercel CLI installed globally:

```bash
vercel env add GELATO_API_KEY
```

1.  Enter the value when prompted.
2.  Select the environments (Production, Preview, Development).

## Verification
To verify the variable is set, you can check the project settings again or log `process.env.GELATO_API_KEY` (be careful not to expose the actual secret in logs) in a server-side route.
