# Forge CRM - Multi-stage Dockerfile
# Build: docker build -t forge-crm:1.0 .
# Run: docker run -d -p 8080:80 --name forge-crm forge-crm:1.0

# ── Stage 1: Build the React app ─────────────────────────────────────────────
FROM node:20-alpine AS build

WORKDIR /app

COPY forge-crm/package.json forge-crm/package-lock.json ./
RUN npm ci

COPY forge-crm/ ./
RUN npm run build

# ── Stage 2: Serve with Nginx ────────────────────────────────────────────────
FROM nginx:1.27-alpine

LABEL maintainer="Forge Cyber Defense <it@forgecyber.com>"
LABEL version="1.0"
LABEL description="Forge CRM - Service Delivery Portal"

RUN apk add --no-cache curl

RUN rm -rf /usr/share/nginx/html/*

COPY --from=build /app/dist /usr/share/nginx/html
COPY docker-nginx.conf /etc/nginx/conf.d/default.conf

RUN chown -R nginx:nginx /usr/share/nginx/html && \
    chmod -R 755 /usr/share/nginx/html

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost/health || exit 1

CMD ["nginx", "-g", "daemon off;"]
