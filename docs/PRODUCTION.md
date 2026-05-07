# Produkcja — Instrukcja wdrożenia

## Wymagane zmienne środowiskowe

Skopiuj `.env.example` do `.env.production` i ustaw **wszystkie** poniższe zmienne:

### Aplikacja
```bash
APP_URL=https://twoja-domena.pl       # URL aplikacji web
NODE_ENV=production
NEXT_PUBLIC_SITE_URL=https://twoja-domena.pl
```

### Baza danych
```bash
DATABASE_URL=postgresql://user:haslo@host:5432/palety_db
```

### Redis
```bash
REDIS_URL=redis://host:6379
AUTH_REDIS_PREFIX=auth
```

### Auth — KRYTYCZNE
```bash
NEXTAUTH_SECRET=<generuj: openssl rand -hex 64>
JWT_SECRET=<generuj: openssl rand -hex 64>
JWT_ACCESS_TTL=30m
JWT_REFRESH_TTL=7d
MAX_LOGIN_ATTEMPTS=5
LOGIN_LOCK_WINDOW_MS=900000
SUPERADMIN_PASSWORD=<silne-haslo-superadmina>
ADMIN_EMAIL=admin@twoja-domena.pl
ADMIN_PASSWORD=<silne-haslo-admina>
DEMO_USER_EMAIL=user@twoja-domena.pl
DEMO_USER_PASSWORD=<silne-haslo-demo>
LEGACY_AUTH_FALLBACK_ENABLED=false
CORS_ORIGIN=https://twoja-domena.pl
```

### API (frontend)
```bash
NEXT_PUBLIC_API_URL=https://api.twoja-domena.pl
```

### Rate Limiting
```bash
RATE_LIMIT_TTL_MS=60000
RATE_LIMIT_MAX=120
RATE_LIMIT_BLOCK_MS=60000
```

### Storage (S3)
```bash
S3_ENDPOINT=https://s3.region.amazonaws.com
S3_BUCKET=palety-uploads
S3_ACCESS_KEY=<access-key>
S3_SECRET_KEY=<secret-key>
```

### Płatności
```bash
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

### Email
```bash
RESEND_API_KEY=re_...
EMAIL_FROM=noreply@twoja-domena.pl
```

### Kurierzy
```bash
DHL_API_KEY=<klucz>
DPD_API_KEY=<klucz>
FEDEX_API_KEY=<klucz>
AMBRO_API_KEY=<klucz>
```

### Monitoring
```bash
SENTRY_DSN=https://...@sentry.io/...
```

---

## Wdrożenie z Docker Compose

```bash
# 1. Przygotuj plik .env z powyższymi zmiennymi
cp .env.example .env
# Edytuj .env

# 2. Zbuduj i uruchom
docker compose up -d --build

# 3. Zseeduj bazę danych
docker compose exec api npx ts-node src/db/seed.ts

# 4. Sprawdź status
docker compose ps
curl http://localhost:3000/api/health
```

## Wdrożenie bez Dockera

```bash
# 1. Zainstaluj zależności
npm ci

# 2. Zbuduj
npm run build

# 3. Uruchom backend
cd apps/api
npm run start:prod &

# 4. Uruchom frontend
cd apps/web
npm run start &
```

---

## Health check

```bash
# API
curl https://api.twoja-domena.pl/health
# Oczekiwana odpowiedź: { "status": "ok" }

# Web
curl https://twoja-domena.pl
# Oczekiwana odpowiedź: HTML 200
```

---

## Backup bazy danych

```bash
# PostgreSQL dump
docker compose exec postgres pg_dump -U user palety_db > backup_$(date +%Y%m%d).sql

# Restore
docker compose exec -T postgres psql -U user palety_db < backup.sql
```

---

## Monitorowanie

- **Sentry**: Dashboard błędów dla web i API (SENTRY_DSN)
- **Docker**: `docker compose logs -f api web`
- **Database**: `docker compose exec postgres psql -U user palety_db`
