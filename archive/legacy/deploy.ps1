<#
.SYNOPSIS
    Forge Service Delivery Portal - Windows Deployment Script

.DESCRIPTION
    Automates deployment of the Forge Service Delivery Portal on Windows Server with IIS.

.PARAMETER SiteName
    Name for the IIS website (default: "Forge Service Delivery Portal")

.PARAMETER PortalPath
    Path to deploy portal files (default: C:\inetpub\wwwroot\forge-portal)

.PARAMETER HostName
    Hostname for the website (default: portal.forge.local)

.PARAMETER Port
    HTTP port (default: 80)

.PARAMETER InstallIIS
    Install IIS if not present

.PARAMETER GenerateSSL
    Generate self-signed SSL certificate

.EXAMPLE
    .\deploy.ps1 -InstallIIS -GenerateSSL

.EXAMPLE
    .\deploy.ps1 -HostName "portal.mycompany.com" -Port 8080

.NOTES
    Requires Administrator privileges
    Author: Forge Cyber Defense
    Version: 1.0
#>

[CmdletBinding()]
param(
    [string]$SiteName = "Forge Service Delivery Portal",
    [string]$PortalPath = "C:\inetpub\wwwroot\forge-portal",
    [string]$HostName = "portal.forge.local",
    [int]$Port = 80,
    [switch]$InstallIIS,
    [switch]$GenerateSSL,
    [switch]$AddHostsEntry
)

# Ensure running as Administrator
function Test-Administrator {
    $currentUser = [Security.Principal.WindowsIdentity]::GetCurrent()
    $principal = New-Object Security.Principal.WindowsPrincipal($currentUser)
    return $principal.IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
}

if (-not (Test-Administrator)) {
    Write-Host "ERROR: This script must be run as Administrator" -ForegroundColor Red
    Write-Host "Right-click PowerShell and select 'Run as Administrator'" -ForegroundColor Yellow
    exit 1
}

# Banner
Write-Host ""
Write-Host "╔════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║     Forge Service Delivery Portal - Windows Deployment    ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

# Function to write status messages
function Write-Status {
    param(
        [string]$Message,
        [string]$Type = "Info"
    )
    
    switch ($Type) {
        "Success" { Write-Host "[✓] $Message" -ForegroundColor Green }
        "Warning" { Write-Host "[!] $Message" -ForegroundColor Yellow }
        "Error"   { Write-Host "[✗] $Message" -ForegroundColor Red }
        "Info"    { Write-Host "[i] $Message" -ForegroundColor Cyan }
    }
}

# Install IIS
function Install-IISFeatures {
    Write-Status "Installing IIS and required features..." -Type Info
    
    $features = @(
        "Web-Server",
        "Web-WebServer",
        "Web-Common-Http",
        "Web-Default-Doc",
        "Web-Dir-Browsing",
        "Web-Http-Errors",
        "Web-Static-Content",
        "Web-Http-Logging",
        "Web-Stat-Compression",
        "Web-Dyn-Compression",
        "Web-Filtering",
        "Web-Mgmt-Tools",
        "Web-Mgmt-Console"
    )
    
    foreach ($feature in $features) {
        $installed = Get-WindowsFeature -Name $feature
        if (-not $installed.Installed) {
            Install-WindowsFeature -Name $feature -IncludeManagementTools | Out-Null
        }
    }
    
    Write-Status "IIS installed successfully" -Type Success
}

# Create portal directory and copy files
function Deploy-PortalFiles {
    Write-Status "Deploying portal files to $PortalPath..." -Type Info
    
    # Create directory
    if (-not (Test-Path $PortalPath)) {
        New-Item -Path $PortalPath -ItemType Directory -Force | Out-Null
    }
    
    # Find and copy the HTML file
    $scriptPath = Split-Path -Parent $MyInvocation.ScriptName
    $possiblePaths = @(
        (Join-Path $scriptPath "Forge_MSSP_ServiceDelivery_Portal.html"),
        (Join-Path $scriptPath "..\Forge_MSSP_ServiceDelivery_Portal.html"),
        (Join-Path (Get-Location) "Forge_MSSP_ServiceDelivery_Portal.html")
    )
    
    $sourceFile = $null
    foreach ($path in $possiblePaths) {
        if (Test-Path $path) {
            $sourceFile = $path
            break
        }
    }
    
    if ($sourceFile) {
        Copy-Item -Path $sourceFile -Destination (Join-Path $PortalPath "index.html") -Force
        Write-Status "Portal files deployed" -Type Success
    } else {
        Write-Status "Portal HTML file not found. Please copy it manually to $PortalPath\index.html" -Type Warning
    }
}

# Configure IIS Website
function Configure-IISSite {
    Write-Status "Configuring IIS website..." -Type Info
    
    Import-Module WebAdministration
    
    # Check if site already exists
    $existingSite = Get-Website -Name $SiteName -ErrorAction SilentlyContinue
    if ($existingSite) {
        Write-Status "Website '$SiteName' already exists. Removing..." -Type Warning
        Remove-Website -Name $SiteName
    }
    
    # Create application pool
    $appPoolName = "ForgePortalAppPool"
    if (-not (Test-Path "IIS:\AppPools\$appPoolName")) {
        New-WebAppPool -Name $appPoolName | Out-Null
        Set-ItemProperty "IIS:\AppPools\$appPoolName" -Name "managedRuntimeVersion" -Value ""
    }
    
    # Create website
    New-Website -Name $SiteName `
                -PhysicalPath $PortalPath `
                -ApplicationPool $appPoolName `
                -Port $Port `
                -HostHeader $HostName | Out-Null
    
    # Set default document
    Set-WebConfigurationProperty -Filter "//defaultDocument/files" `
                                 -PSPath "IIS:\Sites\$SiteName" `
                                 -Name "." `
                                 -Value @{value="index.html"}
    
    # Enable compression
    Set-WebConfigurationProperty -Filter "system.webServer/httpCompression" `
                                 -PSPath "IIS:\Sites\$SiteName" `
                                 -Name "staticTypes" `
                                 -Value @{mimeType="text/html";enabled="true"}
    
    Write-Status "IIS website configured" -Type Success
}

# Set file permissions
function Set-PortalPermissions {
    Write-Status "Setting file permissions..." -Type Info
    
    $acl = Get-Acl $PortalPath
    $identity = "IIS_IUSRS"
    $fileSystemRights = [System.Security.AccessControl.FileSystemRights]::ReadAndExecute
    $inheritanceFlags = [System.Security.AccessControl.InheritanceFlags]"ContainerInherit, ObjectInherit"
    $propagationFlags = [System.Security.AccessControl.PropagationFlags]::None
    $accessControlType = [System.Security.AccessControl.AccessControlType]::Allow
    
    $rule = New-Object System.Security.AccessControl.FileSystemAccessRule(
        $identity, $fileSystemRights, $inheritanceFlags, $propagationFlags, $accessControlType
    )
    
    $acl.SetAccessRule($rule)
    Set-Acl -Path $PortalPath -AclObject $acl
    
    Write-Status "Permissions configured" -Type Success
}

# Generate self-signed SSL certificate
function New-SelfSignedSSL {
    Write-Status "Generating self-signed SSL certificate..." -Type Info
    
    $cert = New-SelfSignedCertificate `
        -DnsName $HostName `
        -CertStoreLocation "Cert:\LocalMachine\My" `
        -NotAfter (Get-Date).AddYears(1) `
        -FriendlyName "Forge Portal SSL Certificate"
    
    # Add HTTPS binding
    Import-Module WebAdministration
    New-WebBinding -Name $SiteName -Protocol "https" -Port 443 -HostHeader $HostName
    
    # Assign certificate to binding
    $binding = Get-WebBinding -Name $SiteName -Protocol "https"
    $binding.AddSslCertificate($cert.Thumbprint, "My")
    
    Write-Status "SSL certificate generated and bound to website" -Type Success
    Write-Status "Note: This is a self-signed certificate for testing only" -Type Warning
}

# Add hosts file entry
function Add-HostsEntry {
    Write-Status "Adding hosts file entry..." -Type Info
    
    $hostsPath = "C:\Windows\System32\drivers\etc\hosts"
    $entry = "127.0.0.1    $HostName"
    
    $content = Get-Content $hostsPath -Raw
    if ($content -notmatch [regex]::Escape($HostName)) {
        Add-Content -Path $hostsPath -Value "`n$entry"
        Write-Status "Added $HostName to hosts file" -Type Success
    } else {
        Write-Status "Hosts entry already exists" -Type Info
    }
}

# Configure Windows Firewall
function Configure-Firewall {
    Write-Status "Configuring Windows Firewall..." -Type Info
    
    # Allow HTTP
    $httpRule = Get-NetFirewallRule -DisplayName "Forge Portal HTTP" -ErrorAction SilentlyContinue
    if (-not $httpRule) {
        New-NetFirewallRule -DisplayName "Forge Portal HTTP" `
                           -Direction Inbound `
                           -Protocol TCP `
                           -LocalPort $Port `
                           -Action Allow | Out-Null
    }
    
    # Allow HTTPS
    $httpsRule = Get-NetFirewallRule -DisplayName "Forge Portal HTTPS" -ErrorAction SilentlyContinue
    if (-not $httpsRule) {
        New-NetFirewallRule -DisplayName "Forge Portal HTTPS" `
                           -Direction Inbound `
                           -Protocol TCP `
                           -LocalPort 443 `
                           -Action Allow | Out-Null
    }
    
    Write-Status "Firewall rules configured" -Type Success
}

# Main execution
try {
    # Install IIS if requested
    if ($InstallIIS) {
        Install-IISFeatures
    }
    
    # Check if IIS is available
    if (-not (Get-Module -ListAvailable -Name WebAdministration)) {
        Write-Status "IIS is not installed. Run with -InstallIIS parameter." -Type Error
        exit 1
    }
    
    # Deploy files
    Deploy-PortalFiles
    
    # Configure IIS
    Configure-IISSite
    
    # Set permissions
    Set-PortalPermissions
    
    # Generate SSL if requested
    if ($GenerateSSL) {
        New-SelfSignedSSL
    }
    
    # Add hosts entry if requested
    if ($AddHostsEntry) {
        Add-HostsEntry
    }
    
    # Configure firewall
    Configure-Firewall
    
    # Start website
    Start-Website -Name $SiteName
    
    # Print completion message
    Write-Host ""
    Write-Host "╔════════════════════════════════════════════════════════════╗" -ForegroundColor Green
    Write-Host "║              Deployment Complete!                          ║" -ForegroundColor Green
    Write-Host "╚════════════════════════════════════════════════════════════╝" -ForegroundColor Green
    Write-Host ""
    Write-Host "Portal URL: " -NoNewline
    Write-Host "http://$HostName" -ForegroundColor Cyan
    if ($GenerateSSL) {
        Write-Host "Secure URL: " -NoNewline
        Write-Host "https://$HostName" -ForegroundColor Cyan
    }
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Yellow
    Write-Host "  1. Update DNS or hosts file on client machines"
    Write-Host "  2. Configure production SSL certificate"
    Write-Host "  3. Set up Windows Authentication or SSO"
    Write-Host "  4. Test portal access from client workstation"
    Write-Host ""
    
} catch {
    Write-Status "Deployment failed: $_" -Type Error
    exit 1
}
