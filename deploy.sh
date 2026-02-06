#!/bin/bash

#######################################################################
# Forge Service Delivery Portal - Linux Deployment Script
# 
# This script automates the deployment of the Forge Service Delivery
# Portal on Linux systems with Nginx.
#
# Usage: sudo ./deploy.sh [options]
#
# Options:
#   --nginx     Deploy with Nginx (default)
#   --apache    Deploy with Apache
#   --docker    Deploy with Docker
#   --ssl       Generate self-signed SSL certificate
#   --help      Show this help message
#
#######################################################################

set -e  # Exit on error

# Configuration
PORTAL_NAME="forge-portal"
PORTAL_DIR="/var/www/${PORTAL_NAME}"
NGINX_CONF="/etc/nginx/sites-available/${PORTAL_NAME}"
APACHE_CONF="/etc/apache2/sites-available/${PORTAL_NAME}.conf"
SERVER_NAME="portal.forge.local"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Functions
print_header() {
    echo -e "${BLUE}"
    echo "╔════════════════════════════════════════════════════════════╗"
    echo "║     Forge Service Delivery Portal - Deployment Script     ║"
    echo "╚════════════════════════════════════════════════════════════╝"
    echo -e "${NC}"
}

print_success() {
    echo -e "${GREEN}[✓]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[!]${NC} $1"
}

print_error() {
    echo -e "${RED}[✗]${NC} $1"
}

print_info() {
    echo -e "${BLUE}[i]${NC} $1"
}

check_root() {
    if [[ $EUID -ne 0 ]]; then
        print_error "This script must be run as root (use sudo)"
        exit 1
    fi
}

detect_os() {
    if [ -f /etc/os-release ]; then
        . /etc/os-release
        OS=$NAME
        VER=$VERSION_ID
    else
        print_error "Cannot detect OS. Please install manually."
        exit 1
    fi
    print_info "Detected OS: $OS $VER"
}

install_nginx() {
    print_info "Installing Nginx..."
    
    if command -v apt-get &> /dev/null; then
        apt-get update -qq
        apt-get install -y nginx
    elif command -v yum &> /dev/null; then
        yum install -y epel-release
        yum install -y nginx
    elif command -v dnf &> /dev/null; then
        dnf install -y nginx
    else
        print_error "Package manager not supported"
        exit 1
    fi
    
    systemctl enable nginx
    print_success "Nginx installed"
}

install_apache() {
    print_info "Installing Apache..."
    
    if command -v apt-get &> /dev/null; then
        apt-get update -qq
        apt-get install -y apache2
        a2enmod headers deflate rewrite ssl
    elif command -v yum &> /dev/null; then
        yum install -y httpd mod_ssl
    elif command -v dnf &> /dev/null; then
        dnf install -y httpd mod_ssl
    fi
    
    print_success "Apache installed"
}

create_portal_directory() {
    print_info "Creating portal directory..."
    
    mkdir -p "${PORTAL_DIR}"
    
    # Copy portal file
    if [ -f "${SCRIPT_DIR}/Forge_MSSP_ServiceDelivery_Portal.html" ]; then
        cp "${SCRIPT_DIR}/Forge_MSSP_ServiceDelivery_Portal.html" "${PORTAL_DIR}/index.html"
    elif [ -f "${SCRIPT_DIR}/../Forge_MSSP_ServiceDelivery_Portal.html" ]; then
        cp "${SCRIPT_DIR}/../Forge_MSSP_ServiceDelivery_Portal.html" "${PORTAL_DIR}/index.html"
    else
        print_error "Portal HTML file not found!"
        print_info "Please copy Forge_MSSP_ServiceDelivery_Portal.html to ${PORTAL_DIR}/index.html"
        exit 1
    fi
    
    # Set permissions
    chown -R www-data:www-data "${PORTAL_DIR}" 2>/dev/null || chown -R nginx:nginx "${PORTAL_DIR}"
    chmod -R 755 "${PORTAL_DIR}"
    
    print_success "Portal files deployed to ${PORTAL_DIR}"
}

configure_nginx() {
    print_info "Configuring Nginx..."
    
    # Copy nginx configuration
    if [ -f "${SCRIPT_DIR}/config/nginx.conf" ]; then
        cp "${SCRIPT_DIR}/config/nginx.conf" "${NGINX_CONF}"
    else
        # Create basic configuration
        cat > "${NGINX_CONF}" << EOF
server {
    listen 80;
    listen [::]:80;
    server_name ${SERVER_NAME};
    
    root ${PORTAL_DIR};
    index index.html;
    
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    
    location / {
        try_files \$uri \$uri/ /index.html;
    }
    
    access_log /var/log/nginx/${PORTAL_NAME}.access.log;
    error_log /var/log/nginx/${PORTAL_NAME}.error.log;
}
EOF
    fi
    
    # Enable site
    ln -sf "${NGINX_CONF}" "/etc/nginx/sites-enabled/${PORTAL_NAME}" 2>/dev/null || true
    
    # Test configuration
    nginx -t
    
    # Reload Nginx
    systemctl reload nginx
    
    print_success "Nginx configured and reloaded"
}

configure_apache() {
    print_info "Configuring Apache..."
    
    if [ -f "${SCRIPT_DIR}/config/apache.conf" ]; then
        cp "${SCRIPT_DIR}/config/apache.conf" "${APACHE_CONF}"
    fi
    
    # Enable site (Debian/Ubuntu)
    if command -v a2ensite &> /dev/null; then
        a2ensite "${PORTAL_NAME}.conf"
    fi
    
    # Test configuration
    apachectl configtest
    
    # Restart Apache
    systemctl restart apache2 2>/dev/null || systemctl restart httpd
    
    print_success "Apache configured and restarted"
}

deploy_docker() {
    print_info "Deploying with Docker..."
    
    # Check if Docker is installed
    if ! command -v docker &> /dev/null; then
        print_error "Docker is not installed. Please install Docker first."
        exit 1
    fi
    
    cd "${SCRIPT_DIR}"
    
    # Build and run
    if [ -f "docker-compose.yml" ]; then
        docker-compose up -d --build
    else
        docker build -t forge-portal:1.0 .
        docker run -d --name forge-portal -p 8080:80 --restart unless-stopped forge-portal:1.0
    fi
    
    print_success "Docker deployment complete"
    print_info "Portal available at http://localhost:8080"
}

generate_ssl() {
    print_info "Generating self-signed SSL certificate..."
    
    SSL_DIR="/etc/ssl"
    mkdir -p "${SSL_DIR}/private" "${SSL_DIR}/certs"
    
    openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
        -keyout "${SSL_DIR}/private/${PORTAL_NAME}.key" \
        -out "${SSL_DIR}/certs/${PORTAL_NAME}.crt" \
        -subj "/C=US/ST=Texas/L=McKinney/O=Forge Cyber Defense/CN=${SERVER_NAME}"
    
    chmod 600 "${SSL_DIR}/private/${PORTAL_NAME}.key"
    
    print_success "SSL certificate generated"
    print_warning "This is a self-signed certificate for testing only"
    print_info "Certificate: ${SSL_DIR}/certs/${PORTAL_NAME}.crt"
    print_info "Key: ${SSL_DIR}/private/${PORTAL_NAME}.key"
}

configure_firewall() {
    print_info "Configuring firewall..."
    
    if command -v ufw &> /dev/null; then
        ufw allow 'Nginx HTTP' 2>/dev/null || true
        ufw allow 'Nginx HTTPS' 2>/dev/null || true
        ufw allow 80/tcp 2>/dev/null || true
        ufw allow 443/tcp 2>/dev/null || true
    elif command -v firewall-cmd &> /dev/null; then
        firewall-cmd --permanent --add-service=http
        firewall-cmd --permanent --add-service=https
        firewall-cmd --reload
    fi
    
    print_success "Firewall configured"
}

add_hosts_entry() {
    print_info "Adding hosts entry..."
    
    if ! grep -q "${SERVER_NAME}" /etc/hosts; then
        echo "127.0.0.1    ${SERVER_NAME}" >> /etc/hosts
        print_success "Added ${SERVER_NAME} to /etc/hosts"
    else
        print_info "Hosts entry already exists"
    fi
}

show_help() {
    echo "Usage: sudo ./deploy.sh [options]"
    echo ""
    echo "Options:"
    echo "  --nginx     Deploy with Nginx (default)"
    echo "  --apache    Deploy with Apache"
    echo "  --docker    Deploy with Docker"
    echo "  --ssl       Generate self-signed SSL certificate"
    echo "  --help      Show this help message"
    echo ""
    echo "Examples:"
    echo "  sudo ./deploy.sh --nginx"
    echo "  sudo ./deploy.sh --nginx --ssl"
    echo "  sudo ./deploy.sh --docker"
}

print_completion() {
    echo ""
    echo -e "${GREEN}╔════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${GREEN}║            Deployment Complete!                            ║${NC}"
    echo -e "${GREEN}╚════════════════════════════════════════════════════════════╝${NC}"
    echo ""
    echo -e "Portal URL: ${BLUE}http://${SERVER_NAME}${NC}"
    echo ""
    echo "Next steps:"
    echo "  1. Update DNS or hosts file to point ${SERVER_NAME} to this server"
    echo "  2. Configure SSL certificate for production use"
    echo "  3. Set up authentication (SSO, Basic Auth, etc.)"
    echo "  4. Configure backup procedures"
    echo ""
}

# Main execution
main() {
    print_header
    check_root
    detect_os
    
    DEPLOY_TYPE="nginx"
    GENERATE_SSL=false
    
    # Parse arguments
    while [[ $# -gt 0 ]]; do
        case $1 in
            --nginx)
                DEPLOY_TYPE="nginx"
                shift
                ;;
            --apache)
                DEPLOY_TYPE="apache"
                shift
                ;;
            --docker)
                DEPLOY_TYPE="docker"
                shift
                ;;
            --ssl)
                GENERATE_SSL=true
                shift
                ;;
            --help)
                show_help
                exit 0
                ;;
            *)
                print_error "Unknown option: $1"
                show_help
                exit 1
                ;;
        esac
    done
    
    print_info "Deployment type: ${DEPLOY_TYPE}"
    
    case $DEPLOY_TYPE in
        nginx)
            install_nginx
            create_portal_directory
            configure_nginx
            configure_firewall
            add_hosts_entry
            ;;
        apache)
            install_apache
            create_portal_directory
            configure_apache
            configure_firewall
            add_hosts_entry
            ;;
        docker)
            deploy_docker
            ;;
    esac
    
    if [ "$GENERATE_SSL" = true ]; then
        generate_ssl
    fi
    
    print_completion
}

main "$@"
