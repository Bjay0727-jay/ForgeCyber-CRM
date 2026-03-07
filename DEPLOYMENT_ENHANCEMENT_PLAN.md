# ForgeCyber CRM - Deployment Enhancement Plan

**Date:** March 7, 2026
**Based on:** ForgeCyber_CRM_Production_Review.docx
**Status:** Draft - Ready for Team Review

---

## 1. Current State Summary

The ForgeCyber CRM has been successfully migrated from a 131KB monolithic HTML prototype to a modern **React 19 + TypeScript + Vite + Tailwind CSS v4** application. The build compiles cleanly with zero TypeScript errors, zero lint warnings, and 42 passing tests. A GitHub Actions CI pipeline is already in place.

### What's Working

| Area | Status |
|------|--------|
| React SPA with lazy-loaded routes (11 pages) | Operational |
| Component library (Badge, Card, Modal, ErrorBoundary, Pagination, etc.) | Operational |
| Form validation (React Hook Form + Zod) on Intake | Operational |
| Kanban drag-and-drop (dnd-kit) | Operational |
| Recharts analytics on Reports page | Operational |
| localStorage CRUD data layer (`forge-crm/src/lib/api.ts`) | Operational |
| GitHub Actions CI (lint, typecheck, test, build) | Operational |
| Tailwind CSS v4 design system with Forge branding | Operational |

### What's Missing (Production Blockers)

| Gap | Severity | Impact |
|-----|----------|--------|
| Zero authentication or authorization | **Critical** | Anyone with the URL has full access |
| Data in localStorage only | **Critical** | Per-device, no team sharing, lost on cache clear |
| Stale deployment artifacts (Dockerfile, deploy scripts) | **High** | Cannot deploy the React app via Docker |
| 3 npm audit vulnerabilities | **High** | Known security issues in dependencies |
| No root route redirect (`/` shows blank) | **Medium** | Poor first-load experience |
| Dead UI elements ("Add Customer" button, etc.) | **Medium** | Incomplete user flows |
| Hardcoded report metrics | **Medium** | Misleading data on Reports page |
| ~30% test coverage | **Medium** | Risk of regressions on core workflows |

---

## 2. Enhancement Phases

The plan is organized into 4 deployment phases. Each phase has a clear goal, deliverables, and acceptance criteria. Phases 1-3 map to the 7-day sprint from the production review; Phase 4 covers post-launch improvements.

---

### Phase 1: Security Foundation & Infrastructure (Days 1-2)

**Goal:** Lock down access, fix known vulnerabilities, establish a clean deployment pipeline.

#### 1.1 Authentication via Cloudflare Access (Zero Trust)

- Configure Cloudflare Access policy to gate the application domain
- Connect existing IdP (Azure AD, Okta, or Google Workspace)
- Set session duration to 8 hours with automatic re-authentication
- Test login flow with at least 2 team members

**Acceptance Criteria:** Unauthenticated users cannot reach any page.

#### 1.2 Client-Side Role Guard

- Create `src/context/AuthContext.tsx` that reads the Cloudflare Access JWT (`cf-access-jwt-assertion` header)
- Map email domains/groups to roles: `Admin`, `Consultant`, `Viewer`
- Create `<ProtectedRoute>` component wrapping each `<Route>` in `App.tsx`
- Redirect unauthorized users to a 403 page

**Files to create/modify:**
- `forge-crm/src/context/AuthContext.tsx` (new)
- `forge-crm/src/components/ProtectedRoute.tsx` (new)
- `forge-crm/src/App.tsx` (wrap routes)

#### 1.3 Fix npm Vulnerabilities

- Run `npm audit fix` in `forge-crm/` to resolve all 3 known vulnerabilities (rollup path traversal, minimatch ReDoS, ajv ReDoS)
- Add `npm audit --audit-level=high` step to CI pipeline
- Verify zero high/critical vulnerabilities

**Files to modify:**
- `forge-crm/package-lock.json` (auto-updated)
- `.github/workflows/ci.yml` (add audit step)

#### 1.4 Root Route Redirect

- Add `<Route path="/" element={<Navigate to="/dashboard" replace />} />` before the catch-all in `App.tsx`

**File to modify:** `forge-crm/src/App.tsx`

#### 1.5 Update Dockerfile for React Build

- Rewrite as multi-stage build: Node stage builds `forge-crm/`, Nginx stage serves `dist/`
- Update `docker-compose.yml` to match
- Update `nginx.conf` with `try_files $uri /index.html` for SPA routing
- Archive legacy deploy scripts to `/archive/`

**Files to modify/create:**
- `Dockerfile` (rewrite)
- `docker-compose.yml` (update)
- `docker-nginx.conf` (update for SPA)
- `archive/` (move legacy files)

#### 1.6 Archive Legacy Files

- Move root `index.html` (131KB monolith), `deploy.sh`, `deploy.ps1` to `/archive/legacy/`
- Keep `_headers`, `nginx.conf`, `apache.conf` (still relevant for deployment)
- Update `.gitignore` if needed

**Estimated Effort:** 2 days, 1-2 developers

---

### Phase 2: Shared Data Layer (Days 3-4)

**Goal:** Replace localStorage with a shared database so the team sees the same data.

#### 2.1 Provision Cloudflare D1 Database

**Recommended:** Cloudflare D1 (stays in-ecosystem with Cloudflare Pages hosting)

- Create D1 database with tables: `organizations`, `contacts`, `opportunities`, `engagements`, `assessments`, `findings`, `team_members`, `audit_log`
- Write SQL migration scripts based on existing TypeScript types in `forge-crm/src/types/`
- Seed with initial data ported from `buildSeedOrganizations()` in `api.ts`

**New files:**
- `worker/schema.sql`
- `worker/seed.sql`
- `worker/migrations/001_initial.sql`

#### 2.2 Build Cloudflare Worker API

- Create REST API using Hono framework, mirroring existing `api.ts` function signatures
- Endpoints: `GET/POST/PUT/DELETE` for each entity
- Add JWT validation middleware (validate Cloudflare Access token)
- Add audit logging on every write operation

**New files:**
- `worker/src/index.ts`
- `worker/src/routes/*.ts`
- `worker/wrangler.toml`
- `worker/package.json`

#### 2.3 Refactor `api.ts` to Network Calls

- Replace all `localStorage` calls in `forge-crm/src/lib/api.ts` with `fetch()` to Worker API
- Keep identical function signatures so page components require zero changes
- Add loading states, error handling, and retry logic
- Add toast notifications on API failures

**File to modify:** `forge-crm/src/lib/api.ts`

#### 2.4 Fix Intake Draft Persistence

- Change `Intake.tsx` draft saving from direct `localStorage` to use the `store` abstraction with `forge_crm_` prefix
- Ensure drafts are per-user once auth is in place

**File to modify:** `forge-crm/src/pages/Intake.tsx`

**Estimated Effort:** 2 days, 2 developers

---

### Phase 3: UX Polish & Feature Completion (Days 5-6)

**Goal:** Eliminate dead UI, fix stale data, and ensure all workflows complete end-to-end.

#### 3.1 Wire Dead UI Elements

| Element | Fix | File |
|---------|-----|------|
| "Add Customer" button in CRM | Navigate to `/intake` | `CRM.tsx` |
| Notification panel actions | Connect to audit log data | `NotificationPanel.tsx` |
| Template "Generate" buttons | Implement document generation stub | `Templates.tsx` |
| AuditLog page | Connect to audit_log database table | `AuditLog.tsx` |

#### 3.2 Fix Dashboard Stale Metrics

- Remove empty `[]` dependency arrays from `useMemo` calls in `Dashboard.tsx`
- Add a data refresh trigger when the route becomes active (use `useEffect` with location dependency or a version counter in context)

**File to modify:** `forge-crm/src/pages/Dashboard.tsx`

#### 3.3 Replace Hardcoded Report Values

- Replace "18 days" average engagement time, "94%" client retention, "397" reports generated with values computed from actual data layer
- If insufficient data exists, display "Demo Data" banner prominently

**File to modify:** `forge-crm/src/pages/Reports.tsx`

#### 3.4 Fix zodResolver Type Cast

- Verify `@hookform/resolvers` compatibility with zod v4
- If incompatible, pin to zod v3 with stable resolver support
- Remove the `as never` cast at `Intake.tsx:63`

**File to modify:** `forge-crm/src/pages/Intake.tsx`

#### 3.5 Accessibility Pass

Add `aria-label` attributes to:
- Sidebar toggle button
- Pipeline filter dropdown
- Notification bell icon
- Theme toggle
- All icon-only buttons

Ensure all modals trap focus and support Escape-to-close.

**Files to modify:** `Sidebar.tsx`, `TopBar.tsx`, `CRM.tsx`, `Modal.tsx`

#### 3.6 Bundle Size Optimization

| Optimization | Expected Impact |
|-------------|----------------|
| Lazy-load `templateStructures.ts` (75KB) | -22KB from Templates chunk |
| Use named recharts exports instead of full library | -50-100KB from Reports chunk |
| Add `rollupOptions.output.manualChunks` for vendor splitting | Better cache efficiency |

**Files to modify:** `vite.config.ts`, `Reports.tsx`, `Templates.tsx`

**Estimated Effort:** 2 days, 1-2 developers

---

### Phase 4: Testing, Deployment & Launch (Day 7)

**Goal:** Deploy to production with confidence.

#### 4.1 Add Integration Tests

Priority test scenarios:
1. **Intake form full submission** - fill form, submit, verify organization + lead created
2. **CRM Kanban drag-and-drop** - move opportunity between stages, verify persistence
3. **Assessment creation and rating** - create assessment, rate domains, verify saves
4. **Search functionality** - cross-entity search returns expected results
5. **Error boundaries** - graceful failure when API is unreachable

Target: raise coverage from ~30% to at least 60%.

**New files:** `forge-crm/src/pages/*.test.tsx`

#### 4.2 Deploy to Cloudflare Pages

- Connect GitHub repo to Cloudflare Pages
- Build command: `cd forge-crm && npm run build`
- Output directory: `forge-crm/dist`
- Configure environment variables for Worker API URL
- Verify preview deployments work on PRs

#### 4.3 DNS & SSL Configuration

- Point `crm.forgecyber.com` (or chosen domain) to Cloudflare Pages
- Verify HTTPS with Full (Strict) encryption mode
- Enable HSTS with 12-month max-age
- Set minimum TLS version to 1.2

#### 4.4 Version Bump

- Update `forge-crm/package.json` version from `0.0.0` to `1.0.0`
- Create Git tag `v1.0.0`

#### 4.5 Team Walkthrough

- 30-minute session: log in via SSO, create a test customer, move through pipeline, run an assessment
- Document any issues found during walkthrough
- Create follow-up tickets for non-blocking issues

**Estimated Effort:** 1 day, full team

---

## 3. Post-Launch Enhancements (Sprints 2+)

These items are not required for initial production launch but should be prioritized in subsequent sprints:

### Sprint 2: State Management & RBAC
- Integrate **TanStack Query** (React Query) for async state management with caching, background refetching, and optimistic updates
- Implement application-level **RBAC** (Admin / Consultant / Viewer roles) beyond Cloudflare Access authentication
- Build audit logging pipeline from Worker API to `audit_log` table

### Sprint 3: Document Generation & Export
- Implement PDF generation for Security Posture Assessment reports using assessment data
- Add Executive Summary Report generation
- CSV/JSON data export for backup and reporting
- Configure D1 time-travel automatic backups

### Sprint 4: Advanced Features
- Operations dashboards with real utilization data
- Team management with workload tracking
- Notification system with activity feeds
- E2E test suite with Playwright

---

## 4. Deployment Architecture (Target State)

```
                        Cloudflare Edge
  +----------------------------------------------------------+
  |                                                          |
  |  Cloudflare Access     WAF / DDoS        Cloudflare     |
  |  (Zero Trust SSO)     Protection         Workers (API)  |
  |       |                    |                  |          |
  |  +----+--------------------+------------------+------+   |
  |  |         Cloudflare Pages (Frontend)               |   |
  |  |         React SPA / Static Assets                 |   |
  |  +--------------------------------------------------+   |
  +-------------------------+--------------------------------+
                            |
                            v
                    Cloudflare D1
                    (SQLite at Edge)
```

**Key properties:**
- All components within Cloudflare ecosystem (single vendor, simplified management)
- Zero Trust authentication at the edge before traffic reaches the app
- Sub-millisecond cold starts on Workers (V8 isolates)
- Edge-local database queries via D1
- Automatic SSL, DDoS protection, and WAF

---

## 5. Risk Register

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| D1 database limitations at scale (10GB free limit) | Low | Medium | Monitor usage; migration path to Postgres exists via Hyperdrive |
| Cloudflare Access IdP integration issues | Medium | High | Test with 2+ team members in Phase 1; have manual email OTP as fallback |
| Zod v4 / hookform resolver incompatibility | Medium | Low | Pin to zod v3 if needed; isolated to Intake form |
| Bundle size growth with new features | Medium | Medium | CI budget check with `bundlesize`; enforce lazy loading |
| Data migration from localStorage seed data | Low | Low | SQL seed scripts created in Phase 2; one-time operation |

---

## 6. Production Launch Checklist

| # | Item | Phase | Priority | Status |
|---|------|-------|----------|--------|
| 1 | Cloudflare Access authentication configured | 1 | Critical | Not Started |
| 2 | npm audit fix - 0 known vulnerabilities | 1 | Critical | Not Started |
| 3 | Root route redirect (/ to /dashboard) | 1 | High | Not Started |
| 4 | CI pipeline enhanced (add audit step) | 1 | High | Not Started |
| 5 | Dockerfile rewritten for React build | 1 | High | Not Started |
| 6 | Legacy files archived | 1 | Medium | Not Started |
| 7 | Cloudflare D1 database provisioned | 2 | Critical | Not Started |
| 8 | Worker API built and deployed | 2 | Critical | Not Started |
| 9 | api.ts refactored to network calls | 2 | Critical | Not Started |
| 10 | Intake draft persistence fixed | 2 | Medium | Not Started |
| 11 | Dead UI elements wired up | 3 | Medium | Not Started |
| 12 | Dashboard metrics refresh on navigation | 3 | Medium | Not Started |
| 13 | Hardcoded report values replaced | 3 | Medium | Not Started |
| 14 | zodResolver type cast removed | 3 | Low | Not Started |
| 15 | Accessibility labels added | 3 | Medium | Not Started |
| 16 | Bundle size optimized | 3 | Medium | Not Started |
| 17 | Integration tests for core workflows | 4 | High | Not Started |
| 18 | Production deployment to Cloudflare Pages | 4 | Critical | Not Started |
| 19 | DNS & SSL verified | 4 | Critical | Not Started |
| 20 | Package version set to 1.0.0 | 4 | Low | Not Started |
| 21 | Team walkthrough completed | 4 | High | Not Started |

---

## 7. Resource Requirements

| Phase | Duration | Developers | Key Skills Needed |
|-------|----------|-----------|-------------------|
| Phase 1: Security & Infrastructure | 2 days | 1-2 | Cloudflare Access, Docker, CI/CD |
| Phase 2: Data Layer | 2 days | 2 | Cloudflare D1/Workers, SQL, Hono, REST APIs |
| Phase 3: UX Polish | 2 days | 1-2 | React, TypeScript, accessibility, Vite config |
| Phase 4: Testing & Launch | 1 day | Full team | Vitest, Cloudflare Pages, DNS |

**Total:** 7 working days with 2-3 developers

---

*This plan is derived from the ForgeCyber CRM Production-Readiness Review (March 2026). All recommendations align with staying within the Cloudflare ecosystem for hosting, authentication, database, and edge compute.*
