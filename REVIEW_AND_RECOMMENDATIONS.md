# Forge Cyber Defense CRM Portal - Review & Recommendations

**Review Date:** February 2026
**Reviewer:** Architecture Review
**Version Reviewed:** 1.0.0 (January 2026)

---

## 1. Executive Summary

The Forge MSSP Service Delivery Portal is a well-designed **static prototype** of an internal CRM/service delivery tool for Forge Cyber Defense's managed security services. The UI demonstrates strong visual design with a professional color system, clean layout, and comprehensive feature coverage across 8 functional areas (Dashboard, CRM, Intake, Assessments, Workflow, Templates, Operations, Team).

However, the application is currently a **single monolithic HTML file (131 KB, ~2,800 lines)** with hardcoded demo data and no backend, persistence, or authentication. To become a production system, it requires significant architectural work.

---

## 2. Current State Assessment

### Strengths

| Area | Assessment |
|------|-----------|
| **UI/UX Design** | Professional, cohesive design system with well-chosen typography (Montserrat/Open Sans/JetBrains Mono) and color palette |
| **Feature Coverage** | Comprehensive scope covering CRM pipeline, assessments, workflows, templates, operations, and team management |
| **Domain Relevance** | Strong alignment with MSSP operations - compliance frameworks (CMMC, NIST, HIPAA), 7-domain maturity model, and consulting phases are well-mapped |
| **Documentation** | Thorough deployment guides for multiple platforms (IIS, Nginx, Apache, Docker, Cloudflare) |
| **Security Headers** | Pre-configured security headers (`_headers` file, nginx.conf, apache.conf) show security awareness |

### Weaknesses

| Area | Issue | Severity |
|------|-------|----------|
| **Architecture** | Single monolithic HTML file with inline CSS/JS - unmaintainable at scale | Critical |
| **Data Persistence** | Zero backend - all data is hardcoded HTML. No API, no database | Critical |
| **Authentication** | No auth implemented. Documentation mentions SSO but nothing is wired up | Critical |
| **State Management** | No client-side state management. Navigation is basic DOM show/hide | High |
| **Form Handling** | Forms render but don't validate, submit, or persist data | High |
| **Interactivity** | Kanban drag-and-drop, search, filtering - all non-functional | High |
| **JavaScript** | ~50 lines of basic DOM manipulation. No error handling or modularity | Medium |
| **Testing** | No test framework, no tests of any kind | Medium |
| **Build System** | No package.json, no bundler, no CI/CD pipeline | Medium |
| **Accessibility** | No ARIA labels, no keyboard navigation, no screen reader support | Medium |

---

## 3. Architecture Recommendations

### 3.1 Recommended Technology Stack

For a cybersecurity MSSP portal handling sensitive client data, I recommend:

**Frontend:**
- **Framework:** React 18+ with TypeScript
  - Why: Mature ecosystem, strong typing for security-critical apps, large talent pool
  - Alternative: Next.js if SSR/SEO matters (unlikely for an internal tool)
- **Build Tool:** Vite
  - Fast HMR, tree-shaking, modern ESM-first approach
- **State Management:** Zustand or TanStack Query
  - Zustand for UI state, TanStack Query for server state/caching
- **Styling:** Tailwind CSS
  - Matches the existing utility-first design patterns. The current CSS variables can map directly to Tailwind's config
- **Component Library:** shadcn/ui
  - Accessible, composable components built on Radix UI primitives
  - Gives you the dashboard cards, tables, forms, modals, tabs already needed
- **Forms:** React Hook Form + Zod
  - Type-safe form validation critical for assessment data entry
- **Drag & Drop:** dnd-kit (for Kanban pipeline board)
- **Charts/Analytics:** Recharts or Tremor (for dashboard metrics)

**Backend:**
- **Runtime:** Node.js with Express or Fastify, OR Python with FastAPI
- **Database:** PostgreSQL (relational data fits CRM/assessments well)
- **ORM:** Prisma (Node.js) or SQLAlchemy (Python)
- **Authentication:** Auth0, Clerk, or Azure AD B2C (for SSO integration)
- **File Generation:** For report/document generation, use a service like Puppeteer (PDF) or docx-templates (Word)

**Infrastructure:**
- **CI/CD:** GitHub Actions
- **Testing:** Vitest (unit), Playwright (E2E)
- **Monitoring:** Sentry for error tracking

### 3.2 Recommended Project Structure

```
forge-crm/
├── apps/
│   ├── web/                    # React frontend
│   │   ├── src/
│   │   │   ├── components/     # Reusable UI components
│   │   │   ├── features/       # Feature modules
│   │   │   │   ├── dashboard/
│   │   │   │   ├── crm/
│   │   │   │   ├── assessments/
│   │   │   │   ├── intake/
│   │   │   │   ├── workflow/
│   │   │   │   ├── templates/
│   │   │   │   ├── operations/
│   │   │   │   └── team/
│   │   │   ├── hooks/
│   │   │   ├── lib/
│   │   │   └── types/
│   │   └── package.json
│   └── api/                    # Backend API
│       ├── src/
│       │   ├── routes/
│       │   ├── services/
│       │   ├── models/
│       │   └── middleware/
│       └── package.json
├── packages/
│   └── shared/                 # Shared types/utilities
└── package.json                # Monorepo root
```

### 3.3 Data Model (Core Entities)

The portal needs at minimum these database tables:

- **Organizations** - Customer companies (the 24 active customers)
- **Contacts** - People at customer orgs
- **Opportunities** - Pipeline deals with stage tracking
- **Engagements** - Active service engagements with hours/budget
- **Assessments** - Security assessments with domain ratings
- **Findings** - Individual findings per assessment
- **Templates** - Document template metadata
- **Users** - Internal Forge employees
- **ActivityLog** - Audit trail of all actions

### 3.4 Migration Path (Incremental)

Rather than a full rewrite, consider an incremental approach:

**Phase 1 - Foundation (Weeks 1-2)**
- Initialize React + Vite + TypeScript project
- Port the existing CSS design system to Tailwind config
- Build layout shell (sidebar nav, top bar)
- Set up routing (React Router)

**Phase 2 - Core Features (Weeks 3-6)**
- Dashboard with real metrics (connect to API)
- CRM pipeline with working Kanban drag-and-drop
- Customer list with search and filtering
- Customer intake form with validation and submission

**Phase 3 - Assessments & Workflow (Weeks 7-10)**
- Assessment creation and editing
- 7-domain rating system with persistence
- Findings management
- Consulting workflow phase tracking

**Phase 4 - Backend & Auth (Weeks 5-8, parallel)**
- PostgreSQL schema and migrations
- REST or GraphQL API endpoints
- Authentication with SSO provider
- Role-based access control (RBAC)

**Phase 5 - Advanced Features (Weeks 11-14)**
- Document/report generation (PDF/DOCX export)
- Operations dashboards with real data
- Team management and utilization tracking
- Notifications and activity feeds

---

## 4. Hosting Comparison: Cloudflare Pages vs Netlify

This is the key decision for where to host the frontend. Both are excellent static/JAMstack hosting platforms. Here's how they compare for Forge's specific needs:

### 4.1 Feature Comparison

| Feature | Cloudflare Pages | Netlify |
|---------|-----------------|---------|
| **CDN Edge Locations** | 300+ (larger network) | 150+ |
| **Build Minutes (Free)** | 500/month | 300/month |
| **Bandwidth (Free)** | Unlimited | 100 GB/month |
| **Concurrent Builds** | 1 (free), 5 (pro) | 1 (free), 3 (pro) |
| **Deploy Previews** | Yes | Yes |
| **Custom Domains** | Unlimited | Unlimited |
| **SSL/TLS** | Automatic | Automatic |
| **Serverless Functions** | Workers (V8 isolates) | Netlify Functions (AWS Lambda) |
| **Edge Functions** | Workers (native, fast) | Edge Functions (Deno) |
| **Form Handling** | None (use Workers) | Built-in Netlify Forms |
| **Identity/Auth** | Cloudflare Access (Zero Trust) | Netlify Identity (basic) |
| **WAF/DDoS Protection** | Enterprise-grade (native) | Basic (relies on AWS) |
| **Split Testing** | No native A/B | Built-in A/B testing |
| **Analytics** | Built-in (privacy-first) | Built-in + integrations |
| **Git Integration** | GitHub, GitLab | GitHub, GitLab, Bitbucket |
| **Monorepo Support** | Limited | Better |

### 4.2 Pricing Comparison

| Tier | Cloudflare Pages | Netlify |
|------|-----------------|---------|
| **Free** | 500 builds/mo, unlimited bandwidth, 1 concurrent build | 300 builds/mo, 100 GB bandwidth, 1 concurrent build |
| **Pro** | $20/mo (5 concurrent builds, enhanced support) | $19/mo per member (more builds, bandwidth, analytics) |
| **Business** | $200/mo (WAF, advanced features) | $99/mo per member (RBAC, SAML SSO) |
| **Enterprise** | Custom | Custom |

### 4.3 Recommendation: **Cloudflare Pages** (Winner for Forge)

Cloudflare is the better choice for Forge Cyber Defense for these specific reasons:

#### Security Alignment
- **Forge is a cybersecurity company.** Using Cloudflare's enterprise-grade security stack (WAF, DDoS protection, Bot Management) for your own portal demonstrates you practice what you preach. This matters when clients ask "what do you use?"
- **Cloudflare Access (Zero Trust)** provides proper SSO-backed authentication gating without building a custom auth layer. This is critical since the portal handles sensitive client assessment data. Netlify Identity is far more basic by comparison.
- Native **IP restriction, mTLS, and access policies** at the edge - before traffic even reaches your app.

#### Performance
- 300+ edge locations vs Netlify's ~150. For an internal tool this matters less, but Cloudflare's network is objectively faster for most regions.
- **Workers** run at the edge in V8 isolates with sub-millisecond cold starts, compared to Netlify Functions running on AWS Lambda with noticeable cold starts. If you build API endpoints (e.g., for form submissions, report generation), Workers will be more performant.

#### Cost
- **Unlimited bandwidth on the free tier** - Netlify caps at 100 GB. While an internal tool won't hit this, it removes a surprise billing vector.
- The free tier is more generous overall (500 vs 300 build minutes).

#### Ecosystem
- If Forge uses or plans to use Cloudflare for DNS, CDN, or DDoS protection for client-facing services, keeping the portal in the same ecosystem simplifies management.
- Cloudflare R2 (S3-compatible storage) can store generated assessment reports without egress fees.

#### When Netlify Would Be Better
- If you need **built-in form handling** without writing backend code (Netlify Forms is plug-and-play)
- If your team is already deeply invested in the **Netlify ecosystem**
- If you need **native A/B testing** for UI experiments
- If you need **better monorepo support** out of the box
- If the per-member pricing of Netlify Pro is prohibitive (Cloudflare Pro is flat-rate)

### 4.4 Hosting Architecture Recommendation

For a production CRM portal, the frontend-only hosting (Cloudflare Pages or Netlify) is only part of the picture. You also need a backend. Recommended architecture:

```
┌─────────────────────────────────────────────────────┐
│                   Cloudflare Edge                     │
│  ┌──────────────┐  ┌──────────┐  ┌───────────────┐  │
│  │  Cloudflare   │  │   WAF /  │  │  Cloudflare   │  │
│  │    Access     │  │   DDoS   │  │    Workers    │  │
│  │  (Zero Trust) │  │Protection│  │  (API proxy)  │  │
│  └──────┬───────┘  └────┬─────┘  └───────┬───────┘  │
│         │               │                │           │
│  ┌──────┴───────────────┴────────────────┴───────┐  │
│  │           Cloudflare Pages (Frontend)          │  │
│  │              React SPA / Static Assets         │  │
│  └────────────────────────────────────────────────┘  │
└─────────────────────────┬───────────────────────────┘
                          │ API Calls
                          ▼
┌─────────────────────────────────────────────────────┐
│              Backend (Choose One)                     │
│                                                       │
│  Option A: Cloudflare Workers + D1 (SQLite)          │
│            All-in-one, no separate server              │
│                                                       │
│  Option B: Railway/Render + PostgreSQL                │
│            Traditional API server                      │
│                                                       │
│  Option C: AWS/Azure (if enterprise compliance        │
│            requires specific cloud providers)          │
└─────────────────────────────────────────────────────┘
```

---

## 5. Security Recommendations

Given that this portal will handle sensitive cybersecurity assessment data for defense contractors, healthcare organizations, and financial institutions:

1. **Authentication:** Implement Cloudflare Access with Azure AD or Okta SSO. Do not rely on basic auth or custom login forms.
2. **Authorization:** Implement RBAC - not all consultants should see all client data. Minimum roles: Admin, Consultant, Viewer.
3. **Data Encryption:** Encrypt assessment data at rest (database-level encryption) and in transit (TLS 1.2+ enforced).
4. **Audit Logging:** Every data access and modification must be logged with user identity, timestamp, and action.
5. **Session Management:** Short session timeouts (4-8 hours), secure cookie flags (HttpOnly, Secure, SameSite=Strict).
6. **Input Validation:** All form inputs must be validated server-side. The intake form and assessment forms handle data that flows into client reports.
7. **CSP Policy:** Tighten the Content-Security-Policy. The current policy allows `unsafe-inline` for scripts - this should be replaced with nonces or hashes in production.
8. **Dependency Scanning:** Once a package.json exists, run `npm audit` in CI and use Dependabot/Renovate for automated updates.

---

## 6. Priority Action Items

### Immediate (Before Any Further Development)
1. **Set up a proper project with package.json** - Initialize React + Vite + TypeScript
2. **Port the design system** - Extract CSS variables into Tailwind config
3. **Implement authentication** - Cloudflare Access or equivalent before any real data enters the system
4. **Set up CI/CD** - GitHub Actions for build/test/deploy to Cloudflare Pages

### Short-Term (First Production Release)
5. **Build the data model** - PostgreSQL schema for core entities
6. **Implement CRUD APIs** - For customers, assessments, and engagements
7. **Working forms** - Intake form and assessment form with validation and persistence
8. **Dashboard with real data** - Replace hardcoded metrics with API calls

### Medium-Term (Feature Parity with Prototype)
9. **Kanban drag-and-drop** - Working pipeline management
10. **Report generation** - PDF/DOCX export from assessment data
11. **Search and filtering** - Across customers, assessments, engagements
12. **Team utilization tracking** - Real hours and workload data

---

## 7. Summary

The Forge MSSP Service Delivery Portal has a strong foundation as a **design prototype**. The UI design is professional and the feature scope is well-aligned with MSSP operations. To make it production-ready:

- **Host on Cloudflare Pages** for the security story, Zero Trust auth, and edge performance
- **Rebuild in React + TypeScript** with a proper component architecture
- **Add a backend** (Cloudflare Workers + D1, or a traditional API server) for data persistence
- **Prioritize authentication and authorization** before handling any real client data
- Follow an **incremental migration path** rather than attempting a big-bang rewrite

The existing HTML prototype serves as an excellent specification document and can guide the UI implementation directly.

---

*This review covers architecture, hosting, and build recommendations for the Forge Cyber Defense CRM Portal.*
