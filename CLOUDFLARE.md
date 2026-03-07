# Forge CRM - Cloudflare Pages Deployment

## Why Cloudflare Pages?

Cloudflare Pages is the **recommended deployment option** for Forge web assets because:

- Enterprise-grade security (DDoS protection, WAF)
- Global CDN with 300+ edge locations
- Free SSL/TLS certificates (automatic)
- Zero server maintenance
- Demonstrates security-first approach to clients
- Free tier available

---

## Current Project: `forge-reporter`

- **Production URL:** `https://forge-reporter.pages.dev`
- **Production branch:** `main`
- **Framework:** React 19 + Vite + TypeScript
- **Root directory:** `forge-crm`
- **Build command:** `npm run build`
- **Build output directory:** `dist`

---

## Build Configuration (Required Settings)

The build settings must be configured in the Cloudflare dashboard under
**Workers & Pages > forge-reporter > Settings > Builds & deployments**:

| Setting | Value |
|---------|-------|
| Production branch | `main` |
| Root directory (path) | `forge-crm` |
| Build command | `npm run build` |
| Build output directory | `dist` |

A `wrangler.jsonc` file is also included in `forge-crm/` as the source-of-truth
for Pages Functions configuration.

### Environment Variables (optional)

| Variable | Value | Notes |
|----------|-------|-------|
| `NODE_VERSION` | `20` | Ensures Node 20 is used in the build |

---

## Custom Domain Setup

### Option A: Subdomain (Recommended for Internal Tools)

Use a subdomain like `portal.forgecyberdefense.com`:

1. Go to your Pages project → **Custom domains**
2. Click **Set up a custom domain**
3. Enter: `portal.forgecyberdefense.com`
4. Cloudflare will auto-configure DNS if domain is on Cloudflare
5. SSL certificate provisions automatically (2-5 minutes)

### Option B: If Domain is Not on Cloudflare

1. Add your domain to Cloudflare first (free plan works)
2. Update nameservers at your registrar
3. Wait for domain to become active
4. Then add custom domain to Pages project

---

## Security Configuration

After deployment, configure these security settings:

### SSL/TLS Settings

1. Go to your domain in Cloudflare Dashboard
2. Navigate to **SSL/TLS** → **Overview**
3. Set encryption mode to **Full (strict)**

### Edge Certificates

1. Go to **SSL/TLS** → **Edge Certificates**
2. Enable **Always Use HTTPS**
3. Enable **HTTP Strict Transport Security (HSTS)**
   - Max Age: 12 months
   - Include subdomains: Yes
4. Set **Minimum TLS Version** to **TLS 1.2**

### Security Headers

Create a `_headers` file and upload with your site:

```
/*
  X-Frame-Options: SAMEORIGIN
  X-Content-Type-Options: nosniff
  X-XSS-Protection: 1; mode=block
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: geolocation=(), microphone=(), camera=()
```

---

## Access Control (Important!)

Since this is an **internal portal**, you should restrict access:

### Option 1: Cloudflare Access (Recommended)

Cloudflare Access provides Zero Trust security:

1. Go to **Cloudflare Zero Trust** dashboard
2. Navigate to **Access** → **Applications**
3. Click **Add an application**
4. Select **Self-hosted**
5. Configure:
   - Application name: `Forge Service Delivery Portal`
   - Session duration: 24 hours
   - Application domain: `portal.forgecyberdefense.com`
6. Add policy:
   - Policy name: `Forge Employees`
   - Action: Allow
   - Include: Emails ending in `@forgecyber.com`
   
**Or integrate with identity provider:**
- Azure AD
- Okta
- Google Workspace
- OneLogin

### Option 2: IP Restrictions

Restrict access to office IP addresses:

1. Go to **Security** → **WAF**
2. Create a custom rule:
   - Name: `Allow Office Only`
   - Expression: `(ip.src ne YOUR.OFFICE.IP.ADDRESS)`
   - Action: Block

---

## Deployment via Git (CI/CD)

The project is connected to GitHub for automatic deployments:

- Every push to `main` triggers a **production deployment**
- Every push to a non-main branch triggers a **preview deployment**

### Updating Build Settings

If the build settings need to be reconfigured:

1. Go to **Workers & Pages** > **forge-reporter** > **Settings** > **Builds & deployments**
2. Set **Root directory (path)** to `forge-crm`
3. Set **Build command** to `npm run build`
4. Set **Build output directory** to `dist`
5. Click **Save**
6. Trigger a new deployment: **Deployments** > **Create deployment** > select `main`

---

## Updating the CRM

### Git Method (Recommended)

```bash
# Make changes in forge-crm/
# Commit and push to main
git push origin main

# Cloudflare automatically builds and deploys!
```

### Manual Retry

If a deployment fails or doesn't trigger:

1. Go to **Workers & Pages** > **forge-reporter** > **Deployments**
2. Click **Create deployment**
3. Select the `main` branch
4. Click **Begin deployment**

---

## Rollback

If something goes wrong:

1. Go to your Pages project
2. Click **Deployments**
3. Find the previous working version
4. Click the three dots (⋮) menu
5. Select **Rollback to this deployment**

---

## Monitoring

### Analytics

Cloudflare provides built-in analytics:

1. Go to your Pages project
2. Click **Analytics** tab
3. View:
   - Total requests
   - Unique visitors
   - Bandwidth usage
   - Geographic distribution

### Web Analytics (Optional)

For more detailed analytics:

1. Go to **Analytics & Logs** → **Web Analytics**
2. Click **Add a site**
3. Add the tracking script to your HTML (or use automatic setup)

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Build fails | Check root directory is set to `forge-crm` in build settings |
| 404 on page refresh | Ensure `_redirects` file (`/* /index.html 200`) is in `public/` |
| Old version showing | Clear browser cache, or purge via Caching > Purge Everything |
| Custom domain not working | Check DNS propagation (can take 24-48h) |
| SSL certificate pending | Wait 5-15 minutes for auto-provisioning |
| Access denied | Check Cloudflare Access policies |

### Force Cache Clear

After deployment, you can purge the cache:

1. Go to **Caching** > **Configuration**
2. Click **Purge Everything**

---

## Cost

| Plan | Features | Price |
|------|----------|-------|
| **Free** | 500 builds/month, 100K requests/day | $0 |
| **Pro** | Unlimited builds, advanced analytics | $20/month |
| **Business** | WAF, advanced security | $200/month |

The Free plan is sufficient for the Service Delivery Portal.

---

## Summary

Cloudflare Pages deployment:

```
1. Create Cloudflare account
2. Go to Workers & Pages → Create → Pages → Upload assets
3. Upload index.html (renamed from Forge_MSSP_ServiceDelivery_Portal.html)
4. Deploy
5. Add custom domain (optional)
6. Configure Cloudflare Access for authentication (recommended)
7. Enable security headers
```

**Your portal will be live at:** `https://your-project.pages.dev`

---

*For additional help, refer to the Cloudflare Pages documentation: https://developers.cloudflare.com/pages/*
