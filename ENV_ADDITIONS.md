# Dodatki do .env.local (regional.fit v1)

Dodaj poniższe do swojego `.env.local`. Wartości pobierzesz z dashboardów odpowiednich serwisów.

```bash
# ─────────────────────────────────────────────────
# LLM / AI (tyg 1-3)
# ─────────────────────────────────────────────────

# Anthropic Claude API
# Pobierz: https://console.anthropic.com/settings/keys
ANTHROPIC_API_KEY=sk-ant-...

# Voyage AI embeddings (free tier: 50M tokens/mc)
# Pobierz: https://dash.voyageai.com/api-keys
VOYAGE_API_KEY=pa-...


# ─────────────────────────────────────────────────
# Email (tyg 4)
# ─────────────────────────────────────────────────

# Resend (free tier: 3000 emails/mc, 100/dzień)
# Pobierz: https://resend.com/api-keys
RESEND_API_KEY=re_...

# Domena wysyłki (musi być zweryfikowana w Resend)
EMAIL_FROM=noreply@regional.fit
EMAIL_REPLY_TO=support@regional.fit


# ─────────────────────────────────────────────────
# Monitoring (tyg 1, 7)
# ─────────────────────────────────────────────────

# Sentry DSN
# Pobierz: https://sentry.io/settings/projects/regional-fit/keys/
SENTRY_DSN=https://...@sentry.io/...
SENTRY_AUTH_TOKEN=sntrys_...  # for source maps upload

# UptimeRobot — konfigurujesz w dashboardzie, brak env var
# https://uptimerobot.com


# ─────────────────────────────────────────────────
# Existing (już masz)
# ─────────────────────────────────────────────────

# DATABASE_URL="postgresql://..."
# NEXTAUTH_URL="..."
# NEXTAUTH_SECRET="..."
```

## Setup notes per service

### Anthropic (5 min)
1. Załóż account: https://console.anthropic.com
2. Dodaj kartę i kup credits ($20 starter wystarczy na 2 miesiące pilota)
3. Settings → API Keys → Create Key → nazwa "regional.fit dev"
4. Skopiuj klucz do `.env.local`

### Voyage AI (3 min)
1. Załóż account: https://www.voyageai.com (Google OAuth)
2. Dashboard → API Keys → Create
3. Free tier: 50M tokens/mc (wystarczy na pilot, jeden klient = ~5M)
4. Skopiuj klucz do `.env.local`

### Resend (5 min)
1. Załóż account: https://resend.com
2. Domains → Add Domain → regional.fit
3. Dodaj DNS records (SPF, DKIM, DMARC) w Twoim DNS provider
4. Poczekaj na verification (max 24h, zwykle <1h)
5. API Keys → Create → skopiuj do `.env.local`

### Sentry (10 min)
1. Załóż account: https://sentry.io
2. Create Project → Next.js → nazwa "regional-fit"
3. Skopiuj DSN do `.env.local`
4. Następnie w app: `npx @sentry/wizard@latest -i nextjs` (zrobi sentry.client.config.ts + sentry.server.config.ts)
5. Test: dodaj `throw new Error("Test Sentry")` w jakimś page → email do Ciebie <60s

### UptimeRobot (5 min, free)
1. Załóż account: https://uptimerobot.com (free dla 50 monitorów)
2. Add Monitor → HTTPS → URL = `https://app.regional.fit/api/health` (musisz dodać ten endpoint)
3. Interval: 5 min
4. Alert contacts → Twój email + opcjonalnie Slack webhook

## Estymowane koszty miesięczne (pierwsze 6 mc, 1 klient)

| Serwis | Plan | Koszt |
|---|---|---|
| Vercel | Hobby (free) | $0 |
| Neon | Free (do 0.5 GB) | $0 |
| Anthropic | pay-as-you-go | ~$3-5/mc |
| Voyage | Free tier | $0 |
| Resend | Free tier | $0 |
| Sentry | Developer (free) | $0 |
| UptimeRobot | Free | $0 |
| **TOTAL** | | **~$5/mc** |

Po przekroczeniu free tierów (zwykle ~5 klientów): ~$50-100/mc.
