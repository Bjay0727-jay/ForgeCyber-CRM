# Forge Service Delivery Portal - Cloudflare Pages Deployment

## Why Cloudflare Pages?

Cloudflare Pages is the **recommended deployment option** for Forge web assets because:

- ✅ Enterprise-grade security (DDoS protection, WAF)
- ✅ Global CDN with 300+ edge locations
- ✅ Free SSL/TLS certificates (automatic)
- ✅ Zero server maintenance
- ✅ Demonstrates security-first approach to clients
- ✅ Free tier available

---

## Quick Deployment (5 Minutes)

### Step 1: Create Cloudflare Account

1. Go to [dash.cloudflare.com/sign-up](https://dash.cloudflare.com/sign-up)
2. Create account with your business email
3. Verify your email address

### Step 2: Create Pages Project

1. In Cloudflare Dashboard, click **Workers & Pages** in left sidebar
2. Click **Create** button
3. Select **Pages** tab
4. Click **Upload assets**

### Step 3: Upload Portal

1. **Project name:** `forge-service-delivery` (or your preference)
2. Click **Create project**
3. Drag and drop `Forge_MSSP_ServiceDelivery_Portal.html` into the upload area
4. **Important:** Rename the file to `index.html` before uploading, OR upload and set up a redirect

### Step 4: Deploy

1. Click **Deploy site**
2. Wait 30-60 seconds
3. Your portal is live at: `https://forge-service-delivery.pages.dev`

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

For automated deployments when the portal is updated:

### Step 1: Create GitHub Repository

```bash
# Create repo structure
mkdir forge-service-delivery-portal
cd forge-service-delivery-portal

# Add portal file (renamed to index.html)
cp Forge_MSSP_ServiceDelivery_Portal.html index.html

# Initialize git
git init
git add .
git commit -m "Initial commit"

# Push to GitHub
git remote add origin https://github.com/your-org/forge-service-delivery-portal.git
git push -u origin main
```

### Step 2: Connect to Cloudflare Pages

1. In Cloudflare Pages, click **Create a project**
2. Select **Connect to Git**
3. Authorize Cloudflare to access your GitHub
4. Select the repository
5. Configure build settings:
   - Build command: (leave empty)
   - Build output directory: `/`
6. Click **Save and Deploy**

Now every push to `main` triggers automatic deployment!

---

## Updating the Portal

### Manual Upload Method

1. Go to Workers & Pages in Cloudflare Dashboard
2. Select your project
3. Click **Create new deployment**
4. Upload the updated `index.html`
5. Click **Deploy**

### Git Method

```bash
# Update the file
cp new-version.html index.html

# Commit and push
git add index.html
git commit -m "Update portal v1.1"
git push origin main

# Cloudflare automatically deploys!
```

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
| 404 Not Found | Ensure file is named `index.html` |
| Custom domain not working | Check DNS propagation (can take 24-48h) |
| SSL certificate pending | Wait 5-15 minutes for auto-provisioning |
| Access denied | Check Cloudflare Access policies |
| Old version showing | Clear browser cache or wait for CDN propagation |

### Force Cache Clear

After deployment, you can purge the cache:

1. Go to **Caching** → **Configuration**
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
