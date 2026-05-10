# Implementation Plan

## Goal Description
Finalize production-ready stability for the PaletBroker CMS by:
- Verifying the production configuration (Web on port 3000, API on port 4000) and internal network communication.
- Ensuring all administrative panels (Leads, Orders, Newsletter, Users) are fully connected to the backend and covered by automated E2E regression tests.
- Adding any missing API controllers (e.g., audit‑log, internal‑tunnel) needed for complete audit logging.
- Integrating the test suite into the CI pipeline.

## User Review Required
> [!IMPORTANT]
> Review the plan, especially the scope of test coverage and any code changes (e.g., adding missing controllers). Approve before we start execution.

## Open Questions
- Do you want the new `AuditLogController` to expose endpoints for exporting or viewing logs, or only internal usage?
- Should the CI pipeline run the Playwright tests on every PR, or only on the `main` branch?
- Are there any additional admin panels not listed that need test coverage?

## Proposed Changes
---
### 1. Verify Production Configuration
- Review `docker-compose.prod.yml` to confirm Web service maps to port `3000` and API to `4000`.
- Ensure `API_URL_INTERNAL` environment variable is set for inter‑container communication.

### 2. Audit Log Controller (if missing)
- **File**: `apps/api/src/modules/audit-log/audit-log.controller.ts`
- Add a basic controller with endpoints:
  - `GET /audit-log` – fetch recent audit entries (admin only).
  - `POST /audit-log/export` – export logs as CSV.
- Protect with `JwtAuthGuard` and `RolesGuard` (admin role).

### 3. Expand E2E Test Suite (`cms-audit.spec.ts`)
- Add test sections for each admin panel:
  - **Leads**: verify list, status update, note edit, bulk actions.
  - **Orders**: verify order creation, status bulk update, CSV export.
  - **Newsletter**: verify subscriber list, add/delete subscriber, stats view.
  - **Users**: verify user list, role change, bulk deactivation.
- Use authenticated Playwright context with JWT token.
- Add proper waiting for 60‑second CMS cache revalidation where needed.

### 4. Update CI Configuration
- Add a GitHub Actions workflow (`ci-e2e.yml`) that:
  - Installs dependencies, builds Docker images.
  - Spins up containers using `docker-compose -f docker-compose.prod.yml up -d`.
  - Runs `npm run test:e2e` inside the `web` container.
  - Fails the job on any test failure.

### 5. Run and Verify Tests Locally
- Execute `npm run dev` and run Playwright tests.
- Fix any failing selectors or API mismatches.
- Confirm all admin UI actions trigger appropriate API calls (observed via network tab or logs).

### 6. Documentation Updates
- Update `README.md` with instructions for running the full E2E suite.
- Document new `AuditLogController` endpoints in API docs.

## Verification Plan
- **Automated Tests**: All Playwright scenarios pass (`npm run test:e2e`).
- **Manual Checks**: Spot‑check each admin panel in the browser to ensure UI elements are functional.
- **CI Pass**: GitHub Actions workflow completes without errors.
- **Port Confirmation**: `docker ps` shows correct port mappings.

---
**Prepared by Antigravity**
