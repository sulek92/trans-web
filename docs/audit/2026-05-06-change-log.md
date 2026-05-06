# Lista Zmian (Przed/Po) – 06 May 2026

Frontend
- Dodano middleware RBAC na warstwie Next.js do ochrony sekcji /admin oraz wzmocniono wymóg logowania przy użyciu tokenu pb_auth_token. Zabezpieczenie opiera się na cookiesach i roli użytkownika.
- Dodano konfigurację i18n w Next.js (pl/en) w next.config.ts, co ułatwi wprowadzenie wielojęzycznych treści i tłumaczeń na całej stronie.
- Dodano publiczne pliki SEO: robots.txt i sitemap.xml (wstępna implementacja).
- Wykonano rozszerzenie root layoutu aby objąć LanguageProvider i ThemeProvider (już w layout.tsx) – zapewnia to spójne zarządzanie językiem i motywem.

Backend/API
- Kontynuacja prac nad auth JWT i RBAC: rozszerzono guardy i endpointy, aby lepiej chronić zasoby admina oraz logiki powiązanej z CMS i raportowaniem. Zaktualizowano pliki proxy/redirect, aby wymuszać autoryzację przy dostępie do sekcji admin.
- Kontynuacja migracji typów i ulepszeń typowania w back-endzie API (drizzle-orm, guardy rolowe).

QA/CI
- Dodatkowy krok w CI: uruchamianie lintów i testów na PR (CI YAML w .github/workflows/ci.yml) – stabilizacja procesu weryfikacyjnego.

Uwagi implementacyjne
- Upewnij się, że domena produkcyjna jest wprowadzona do sitemap.xml i robots.txt, a także zaktualizowane zostaną RSS/SEO meta jeśli potrzebne.
- Rozszerzenia w planie audytu i implementacji będą kontynuowane zgodnie z priorytetami z fazy 2–4 (to-do list w JSON/Markdown).
