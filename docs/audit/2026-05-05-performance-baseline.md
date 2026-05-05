# Performance Baseline (Przed/Po)

## Metodyka
Pomiary wykonano lokalnie podczas audytu technicznego.

## Przed (stan zastany)
- Frontend:
  - `next build` nie przechodzil (bariery type/prerender), brak wiarygodnego baseline CWV.
- Backend:
  - Brak wymuszonej walidacji globalnej, co zawyzalo przepustowosc kosztem poprawnosci danych.

## Po (stan po stabilizacji)
- Frontend:
  - `npm run build --workspace apps/web` przechodzi.
  - Budowanie statycznych stron zakonczone poprawnie (41/41 tras).
  - `cd apps/web && npx playwright test`: 11/11 testow (auth + visual smoke + admin navigation + login-width guard, wieloresolucyjnie).
- Backend:
  - `npm run build --workspace apps/api` przechodzi.
  - `npm run test:e2e --workspace apps/api`: 18/18 testow.
  - Rozszerzone pokrycie E2E:
    - login/refresh/logout/revocation,
    - lockout anty brute-force,
    - reset hasla request/confirm,
    - RBAC dla endpointow admin/users/orders.

## Luki pomiarowe do domkniecia
- Brak twardych metryk runtime dla:
  - p95/p99 latency endpointow.
  - CWV (LCP/INP/CLS) z RUM.
  - throughput pod obciazeniem (k6/Locust).

## Nastepny krok baseline
1. Uruchomic k6 dla `/quotes`, `/orders`, `/tracking`.
2. Wlaczyc Web Vitals telemetry (staging + prod).
3. Raportowac tygodniowo trend p95 i error rate.
4. Dodac budzet wydajnosci frontend (LCP/INP/CLS) i gate w CI.
