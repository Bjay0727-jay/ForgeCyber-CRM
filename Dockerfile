# Forge Service Delivery Portal - Dockerfile
# Build: docker build -t forge-portal:1.0 .
# Run: docker run -d -p 8080:80 --name forge-portal forge-portal:1.0

FROM nginx:1.25-alpine

LABEL maintainer="Forge Cyber Defense <it@forgecyber.com>"
LABEL version="1.0"
LABEL description="Forge MSSP Service Delivery Portal"

# Install curl for healthcheck
RUN apk add --no-cache curl

# Remove default nginx content
RUN rm -rf /usr/share/nginx/html/*

# Copy application files
COPY Forge_MSSP_ServiceDelivery_Portal.html /usr/share/nginx/html/index.html

# Copy custom nginx configuration
COPY config/docker-nginx.conf /etc/nginx/conf.d/default.conf

# Set proper permissions
RUN chown -R nginx:nginx /usr/share/nginx/html && \
    chmod -R 755 /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost/ || exit 1

# Run nginx in foreground
CMD ["nginx", "-g", "daemon off;"]
