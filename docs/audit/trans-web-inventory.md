# Audit: trans-web (PaletyBroker) – Inventory & Current State

Scope: This document captures the current state of the trans-web app within the monorepo at /apps/web, including tech stack, project structure, and immediate risk areas observed during a quick audit.

1) Repository structure (high level)
- Root is a Turborepo with workspaces: [apps/*, packages/*].
- Main web application located at: apps/web.
- Backend services and seeds under apps/api (e.g., apps/api/src/db/seed.ts).

2) Key tech stack observed
- Frontend: Next.js (Next 16.x), React (observed 19.x in package.json; verify compatibility with Next.js 16.x), TypeScript 5.x.
- Styling: Tailwind CSS (tailwindconfig implied by dependencies such as tailwindcss, postcss).
- State management: Zustand (as observed in dependencies).
- i18n: Custom i18n setup in apps/web (i18n-context.tsx, dictionaries/pl.ts, dictionaries/en.ts).
- Testing: Playwright for end-to-end tests (scripts in apps/web/package.json).
- Monitoring: @sentry/nextjs present in dependencies.
- Build tooling: Turbo (turbo) as the orchestrator for monorepo tasks.
- Other: lucide-react, framer-motion, zod, jwt-decode, etc.

3) Configuration & scripts (observed)
- Root package.json defines workspaces and top-level scripts: dev, build, start, lint (turbo-run-based).
- apps/web/package.json exposes: dev/build/start/lint/test:e2e/test:e2e:docker/test:e2e:visual:docker.
- next.config.ts in repo root (placeholder) and a Next app in apps/web.

4) Immediate findings (risk areas / opportunities)
- React version mismatch: Next.js 16.x typically targets React 18.x. The observed React version in apps/web/package.json is 19.x, which is non-standard and may cause runtime/build issues. Action: align to a supported React version (e.g., 18.x) that is compatible with Next.js 16.x.
- Next.js config is minimal (next.config.ts with an empty config). Consider enabling common optimizations (SWC, images, rewrites, i18n routing) once requirements are defined.
- i18n is implemented but ensure all translations exist for both pl and en and that keys are consistently used across code paths (privacy/terms content loaded via CMS hooks).
- Admin panel: existing code references to an admin panel in translations and routes. Ensure RBAC is robust and that access control is enforced server-side where needed.
- CI: There is now a basic CI workflow for lint/build. Consider adding unit tests (Jest/Vitest) and e2e tests (Playwright) in CI with caching and parallel steps.
- Documentation: A changelog entry exists in docs/audit and there is a dedicated inventory document here for audit traceability.

5) Suggestions for next steps (short-term)
- Normalize React version to a supported range for Next.js 16 (e.g., React 18.x). Update apps/web/package.json accordingly and run npm install to validate compatibility.
- Extend CI to run unit tests for web (if present), and add e2e tests in CI for critical flows (home, pricing, contact, etc.).
- Add or refine ESLint/Prettier rules to enforce consistent code style and catch common pitfalls early.
- Expand test coverage around the i18n layer and CMS integration (getCmsContent helper usage in privacy/terms pages).
- Begin a targeted refactor: ensure strict TypeScript types across CMS data loading paths (avoid any and vague types).
- Document a simple migration path for any potential data/model changes, especially in the CMS-driven sections (privacy/terms) and admin content areas.

6) Deliverables for-CI
- A clean CI workflow in GitHub Actions (already added: .github/workflows/ci.yml) that:
  - Lints the repository (turbo-based lint across workspaces)
  - Builds the monorepo (turbo build)
  - Optionally runs unit tests if available
  - Packages artifacts (optional)

7) Acceptance criteria for this audit doc
- Clear inventory of tech stack, repo structure, and potential risks.
- Actionable recommendations with rationale targeting stability and maintainability.
- Plan for immediate follow-ups (Phase 1 tasks) with defined owners and timelines.

Notes:
- If you want, I can convert this into a machine-readable JSON plan (with IDs, dependencies, acceptance criteria) suitable for ingestion by your agent/workflow system.
