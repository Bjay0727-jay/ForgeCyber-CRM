# Forge MSSP Service Delivery Portal

## Overview

The Forge MSSP Service Delivery Portal is an internal employee web application designed to manage customer engagements, security assessments, consulting workflows, and document generation for Forge Cyber Defense's managed security services.

---

## Features

### 1. Dashboard
- Real-time metrics: Active customers, assessments in progress, pending reports, pipeline value
- Active engagements table with status tracking
- Recent activity feed

### 2. CRM / Pipeline Management
- **Pipeline View**: Kanban-style board with 5 stages (Lead → Assessment → Proposal → Negotiation → Closed Won)
- **Customer List**: Searchable customer database with sector filtering
- **Opportunity Tracking**: Deal values and stage progression

### 3. Customer Intake
- Comprehensive intake form capturing:
  - Organization information (name, sector, address, employee count)
  - Primary contact details
  - Compliance frameworks (CMMC, NIST, HIPAA, FedRAMP, PCI-DSS, SOX, SOC 2)
  - Current security tools inventory
  - Services of interest and timeline

### 4. Security Assessments
- Active assessment tracking with progress indicators
- New assessment creation workflow
- **Security Posture Assessment** form with:
  - 7-domain maturity ratings (1-5 scale)
  - Finding documentation with severity levels
  - NIST control mapping
  - Remediation recommendations

### 5. Consulting Workflow
- Visual 5-phase timeline:
  - Phase 1: Initial Discovery & Intake (1-2 days)
  - Phase 2: Technical Discovery & Scanning (3-5 days)
  - Phase 3: Security Posture Assessment (5-10 days)
  - Phase 4: Report & Recommendations (3-5 days)
  - Phase 5: Presentation & Transition (1-2 days)
- Progress tracking per customer engagement

### 6. Document Templates
- 9 pre-built templates:
  - Security Posture Assessment
  - Executive Summary Report
  - CMMC 2.0 Gap Analysis
  - Vulnerability Assessment Report
  - Incident Response Plan
  - Customer Onboarding Package
  - HIPAA Gap Analysis
  - Monthly Security Report
  - POA&M Template

### 7. Operations Management
- Active engagement tracking with hours used/budgeted
- Consultant assignment and utilization
- Engagement health indicators (On Track / At Risk / Blocked)
- Revenue tracking

### 8. Team Management
- Team member directory
- Role and specialization tags
- Workload and utilization metrics
- Availability status

---

## Technical Specifications

### Technology Stack
- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **Styling**: Custom CSS with CSS Variables
- **Fonts**: 
  - Montserrat (headings)
  - Open Sans (body text)
  - JetBrains Mono (data/code)
- **Icons**: Inline SVG

### Browser Support
- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

### Design System
- **Primary Navy**: #0F2A4A
- **Primary Teal**: #0D9488
- **Teal Light**: #14b8a6
- **Background**: #f8fafc
- **Card Background**: #ffffff
- **Border**: #e2e8f0

---

## File Structure

```
forge-service-delivery-portal/
├── README.md                           # This file
├── INSTALL.md                          # Installation instructions
├── Forge_MSSP_ServiceDelivery_Portal.html  # Main application
├── config/
│   ├── nginx.conf                      # Nginx configuration
│   └── apache.conf                     # Apache configuration
├── docs/
│   ├── Forge_MSSP_Process_Documentation.docx
│   └── Forge_Installation_Guide.docx
└── scripts/
    ├── deploy.sh                       # Linux deployment script
    └── deploy.ps1                      # Windows deployment script
```

---

## Quick Start

### Option 1: Local Development
```bash
# Simply open the HTML file in a browser
open Forge_MSSP_ServiceDelivery_Portal.html
```

### Option 2: Simple HTTP Server
```bash
# Python 3
python -m http.server 8080

# Node.js
npx serve .
```

### Option 3: Production Deployment
See `INSTALL.md` for detailed server deployment instructions.

---

## Security Considerations

This portal is designed for **internal/intranet use only**. Before deployment:

1. **Authentication**: Implement SSO or authentication layer (not included)
2. **HTTPS**: Always use TLS/SSL in production
3. **Access Control**: Restrict to internal network or VPN
4. **Data Storage**: Currently client-side only; integrate with backend for persistence

---

## Customization

### Changing Logo
Replace the base64 image data in the `.logo-icon img` src attribute.

### Modifying Colors
Update CSS variables in the `:root` selector:
```css
:root {
  --forge-navy: #0F2A4A;
  --forge-teal: #0D9488;
  /* ... */
}
```

### Adding New Templates
Add new template cards in the `#templates` section following the existing pattern.

---

## Support

For questions or issues, contact Forge Cyber Defense IT Department.

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | January 2026 | Initial release |

---

## License

Proprietary - Forge Cyber Defense Internal Use Only
