# Change log – 07 May 2026

- Frontend: Dynamic sitemap.xml generation at /sitemap.xml and /api/sitemap route from CMS pages (slugs) via NestJS API integration.
- Admin: Added admin CMS pages index view at /admin/cms/pages with live fetch of CMS pages and JSON export functionality; ready for future editor UI.
- Security: Added helmet integration to API server; basic hardening of API responses and security headers; enabled trust proxy for IP detection.
- RBAC: Admin routes protected by RolesGuard, admin-only endpoints require admin role; proxy guards for admin and account routes.
- CI: Updated CI to run end-to-end tests with Playwright as part of CI pipeline; install browsers step added.
- UI/Assets: Added local assets for payment methods; improved admin UI responsiveness and mobile layout groundwork.
