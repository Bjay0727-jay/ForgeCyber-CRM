# Forge Service Delivery Portal - Installation Guide

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Deployment Options](#deployment-options)
3. [Option A: IIS (Windows Server)](#option-a-iis-windows-server)
4. [Option B: Nginx (Linux)](#option-b-nginx-linux)
5. [Option C: Apache (Linux)](#option-c-apache-linux)
6. [Option D: Docker](#option-d-docker)
7. [SSL/TLS Configuration](#ssltls-configuration)
8. [Authentication Integration](#authentication-integration)
9. [Troubleshooting](#troubleshooting)

---

## Prerequisites

### Minimum Requirements
- Web server (IIS, Nginx, Apache, or Docker)
- Modern web browser for testing
- Network access to internal intranet

### Recommended Requirements
- SSL/TLS certificate for HTTPS
- Active Directory or SSO integration
- Reverse proxy for authentication

---

## Deployment Options

| Option | Best For | Complexity |
|--------|----------|------------|
| IIS | Windows Server environments | Low |
| Nginx | Linux servers, high performance | Medium |
| Apache | Linux servers, .htaccess support | Medium |
| Docker | Container orchestration, CI/CD | Medium |

---

## Option A: IIS (Windows Server)

### Step 1: Install IIS

```powershell
# Run PowerShell as Administrator
Install-WindowsFeature -Name Web-Server -IncludeManagementTools
```

### Step 2: Create Website Directory

```powershell
# Create directory
New-Item -Path "C:\inetpub\wwwroot\forge-portal" -ItemType Directory

# Copy files
Copy-Item "Forge_MSSP_ServiceDelivery_Portal.html" -Destination "C:\inetpub\wwwroot\forge-portal\index.html"
```

### Step 3: Create IIS Site

1. Open **IIS Manager**
2. Right-click **Sites** → **Add Website**
3. Configure:
   - Site name: `Forge Service Delivery Portal`
   - Physical path: `C:\inetpub\wwwroot\forge-portal`
   - Binding: 
     - Type: `http` (or `https` with certificate)
     - IP: `All Unassigned`
     - Port: `80` (or `443`)
     - Host name: `portal.forge.local`

### Step 4: Configure Default Document

1. Select your site in IIS Manager
2. Double-click **Default Document**
3. Add `index.html` if not present

### Step 5: Set Permissions

```powershell
# Grant IIS_IUSRS read access
icacls "C:\inetpub\wwwroot\forge-portal" /grant "IIS_IUSRS:(OI)(CI)R"
```

### Step 6: Test

Navigate to `http://portal.forge.local` in browser.

---

## Option B: Nginx (Linux)

### Step 1: Install Nginx

```bash
# Ubuntu/Debian
sudo apt update
sudo apt install nginx -y

# CentOS/RHEL
sudo yum install epel-release -y
sudo yum install nginx -y

# Start and enable
sudo systemctl start nginx
sudo systemctl enable nginx
```

### Step 2: Create Website Directory

```bash
# Create directory
sudo mkdir -p /var/www/forge-portal

# Copy files
sudo cp Forge_MSSP_ServiceDelivery_Portal.html /var/www/forge-portal/index.html

# Set ownership
sudo chown -R www-data:www-data /var/www/forge-portal
sudo chmod -R 755 /var/www/forge-portal
```

### Step 3: Create Nginx Configuration

```bash
sudo nano /etc/nginx/sites-available/forge-portal
```

Add the following configuration:

```nginx
server {
    listen 80;
    listen [::]:80;
    
    server_name portal.forge.local;
    
    root /var/www/forge-portal;
    index index.html;
    
    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    
    # Gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    # Cache static assets
    location ~* \.(jpg|jpeg|png|gif|ico|css|js|svg|woff|woff2)$ {
        expires 7d;
        add_header Cache-Control "public, immutable";
    }
    
    # Deny access to hidden files
    location ~ /\. {
        deny all;
    }
    
    # Logging
    access_log /var/log/nginx/forge-portal.access.log;
    error_log /var/log/nginx/forge-portal.error.log;
}
```

### Step 4: Enable Site

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/forge-portal /etc/nginx/sites-enabled/

# Test configuration
sudo nginx -t

# Reload Nginx
sudo systemctl reload nginx
```

### Step 5: Configure Firewall

```bash
# UFW (Ubuntu)
sudo ufw allow 'Nginx HTTP'
sudo ufw allow 'Nginx HTTPS'

# firewalld (CentOS)
sudo firewall-cmd --permanent --add-service=http
sudo firewall-cmd --permanent --add-service=https
sudo firewall-cmd --reload
```

---

## Option C: Apache (Linux)

### Step 1: Install Apache

```bash
# Ubuntu/Debian
sudo apt update
sudo apt install apache2 -y

# CentOS/RHEL
sudo yum install httpd -y

# Start and enable
sudo systemctl start apache2  # or httpd on CentOS
sudo systemctl enable apache2
```

### Step 2: Create Website Directory

```bash
# Create directory
sudo mkdir -p /var/www/forge-portal

# Copy files
sudo cp Forge_MSSP_ServiceDelivery_Portal.html /var/www/forge-portal/index.html

# Set ownership
sudo chown -R www-data:www-data /var/www/forge-portal
```

### Step 3: Create Virtual Host

```bash
sudo nano /etc/apache2/sites-available/forge-portal.conf
```

Add configuration:

```apache
<VirtualHost *:80>
    ServerName portal.forge.local
    ServerAdmin admin@forge.local
    DocumentRoot /var/www/forge-portal
    
    <Directory /var/www/forge-portal>
        Options -Indexes +FollowSymLinks
        AllowOverride All
        Require all granted
    </Directory>
    
    # Security headers
    Header always set X-Frame-Options "SAMEORIGIN"
    Header always set X-Content-Type-Options "nosniff"
    Header always set X-XSS-Protection "1; mode=block"
    
    # Compression
    <IfModule mod_deflate.c>
        AddOutputFilterByType DEFLATE text/html text/css application/javascript
    </IfModule>
    
    # Logging
    ErrorLog ${APACHE_LOG_DIR}/forge-portal-error.log
    CustomLog ${APACHE_LOG_DIR}/forge-portal-access.log combined
</VirtualHost>
```

### Step 4: Enable Site and Modules

```bash
# Enable required modules
sudo a2enmod headers
sudo a2enmod deflate
sudo a2enmod rewrite

# Enable site
sudo a2ensite forge-portal.conf

# Disable default site (optional)
sudo a2dissite 000-default.conf

# Test configuration
sudo apache2ctl configtest

# Restart Apache
sudo systemctl restart apache2
```

---

## Option D: Docker

### Step 1: Create Dockerfile

```dockerfile
FROM nginx:alpine

# Copy application files
COPY Forge_MSSP_ServiceDelivery_Portal.html /usr/share/nginx/html/index.html

# Copy custom nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s \
  CMD wget --quiet --tries=1 --spider http://localhost/ || exit 1
```

### Step 2: Create nginx.conf for Docker

```nginx
server {
    listen 80;
    server_name localhost;
    
    root /usr/share/nginx/html;
    index index.html;
    
    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    # Gzip
    gzip on;
    gzip_types text/plain text/css application/json application/javascript;
}
```

### Step 3: Build and Run

```bash
# Build image
docker build -t forge-portal:1.0 .

# Run container
docker run -d \
  --name forge-portal \
  -p 8080:80 \
  --restart unless-stopped \
  forge-portal:1.0

# Verify
docker ps
curl http://localhost:8080
```

### Step 4: Docker Compose (Optional)

Create `docker-compose.yml`:

```yaml
version: '3.8'

services:
  forge-portal:
    build: .
    container_name: forge-portal
    ports:
      - "8080:80"
    restart: unless-stopped
    networks:
      - forge-network
    healthcheck:
      test: ["CMD", "wget", "-q", "--spider", "http://localhost/"]
      interval: 30s
      timeout: 10s
      retries: 3

networks:
  forge-network:
    driver: bridge
```

Run with:
```bash
docker-compose up -d
```

---

## SSL/TLS Configuration

### Generate Self-Signed Certificate (Testing Only)

```bash
# Generate certificate
sudo openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout /etc/ssl/private/forge-portal.key \
  -out /etc/ssl/certs/forge-portal.crt \
  -subj "/C=US/ST=Texas/L=McKinney/O=Forge Cyber Defense/CN=portal.forge.local"
```

### Nginx HTTPS Configuration

```nginx
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    
    server_name portal.forge.local;
    
    ssl_certificate /etc/ssl/certs/forge-portal.crt;
    ssl_certificate_key /etc/ssl/private/forge-portal.key;
    
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256;
    ssl_prefer_server_ciphers off;
    
    # HSTS
    add_header Strict-Transport-Security "max-age=31536000" always;
    
    root /var/www/forge-portal;
    index index.html;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
}

# Redirect HTTP to HTTPS
server {
    listen 80;
    server_name portal.forge.local;
    return 301 https://$server_name$request_uri;
}
```

---

## Authentication Integration

### Option 1: Nginx Basic Auth

```bash
# Install htpasswd utility
sudo apt install apache2-utils

# Create password file
sudo htpasswd -c /etc/nginx/.htpasswd admin

# Add to nginx config
location / {
    auth_basic "Forge Service Delivery Portal";
    auth_basic_user_file /etc/nginx/.htpasswd;
    try_files $uri $uri/ /index.html;
}
```

### Option 2: Integrate with SSO (Azure AD / Okta)

For enterprise SSO, consider using:
- **OAuth2 Proxy**: https://oauth2-proxy.github.io/oauth2-proxy/
- **Vouch Proxy**: For nginx auth_request module

Example with OAuth2 Proxy:
```bash
docker run -d \
  -p 4180:4180 \
  --name oauth2-proxy \
  quay.io/oauth2-proxy/oauth2-proxy \
  --provider=azure \
  --client-id=YOUR_CLIENT_ID \
  --client-secret=YOUR_CLIENT_SECRET \
  --email-domain=forge.local \
  --upstream=http://forge-portal:80
```

---

## Troubleshooting

### Common Issues

| Issue | Solution |
|-------|----------|
| 403 Forbidden | Check file permissions and ownership |
| 502 Bad Gateway | Verify upstream server is running |
| Page not loading | Check browser console for errors |
| Fonts not rendering | Verify Google Fonts CDN access |

### Log Locations

| Server | Access Log | Error Log |
|--------|------------|-----------|
| Nginx | `/var/log/nginx/forge-portal.access.log` | `/var/log/nginx/forge-portal.error.log` |
| Apache | `/var/log/apache2/forge-portal-access.log` | `/var/log/apache2/forge-portal-error.log` |
| IIS | `%SystemDrive%\inetpub\logs\LogFiles` | Event Viewer |

### Testing Connectivity

```bash
# Test HTTP response
curl -I http://portal.forge.local

# Test from specific IP
curl -H "Host: portal.forge.local" http://SERVER_IP/

# Check open ports
netstat -tlnp | grep -E '80|443'
```

---

## Post-Installation Checklist

- [ ] Portal accessible via browser
- [ ] HTTPS configured with valid certificate
- [ ] Authentication mechanism in place
- [ ] Firewall rules configured
- [ ] DNS entry created (or hosts file updated)
- [ ] Backup procedure documented
- [ ] Monitoring/alerting configured
- [ ] User access communicated to team

---

## Support

For technical support, contact:
- **IT Department**: it@forgecyber.com
- **Documentation**: https://docs.forge.local

---

*Document Version: 1.0 | Last Updated: January 2026*
