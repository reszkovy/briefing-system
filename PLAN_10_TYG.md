# regional.fit — Plan 10 tygodni

**Ścieżka A + LLM** · Sprint do pilot-ready dla Benefit Systems (20 lokalizacji)

> Living document. Aktualizuj checkboxy w trakcie sprintu. Niedzielne retro 30 min nieprzesuwalne.

---

## 🎯 Cele główne

| Co | Kiedy |
|---|---|
| **Demo-ready** (pierwsze realne demo z buyerem) | Koniec tyg 8 |
| **Go-live** (pilot na app.regional.fit, 5+ userów aktywnych) | Koniec tyg 10 |
| **Pierwszy podpisany kontrakt** | Tyg 11-14 (po pilocie) |

**Buyer #1**: Group Marketing Manager, Benefit Systems
**Pricing**: pilot 50-100k PLN, invoice manualnie
**Architektura**: single-tenant w v1, multi-tenant po pilocie #1 (2-tyg sprint)

---

## ⏰ Profil tygodnia (10h)

```
Pon   1.5h   21:00-22:30   wieczór
Wto   1.5h   21:00-22:30   wieczór
Śro   rest   (odzysk energii)
Czw   1.5h   21:00-22:30   wieczór
Pt    rest
Sob   2.5h    9:00-11:30   poranek
Nd    3.0h    9:00-12:00   poranek + retro 12:00-12:30
                       ─────
                       10h/tydz
```

**Anti-abandonment trigger**: niedziela 12-12:30 = retro tygodnia (co shipped, co slipped, co poniedziałek). Jeśli pomijasz drugie z rzędu — flag ze mną, modyfikujemy plan.

---

## 🏗️ Architektura LLM (referencja)

**Stack**: Anthropic Claude API (Sonnet do scoringu, Haiku do reasoning per flag) + pgvector w Neon Postgres + Voyage embeddings. Zero nowej infrastruktury.

**Pliki kodu**:
```
src/lib/
├── policy-engine.ts        (zostaje — rule fallback)
├── ai-auditor.ts           (zostaje — completeness/consistency)
├── llm-auditor.ts          (NOWY — semantic alignment + reasoning)
├── embeddings.ts           (NOWY — chunk + embed strategy docs)
└── llm-config.ts           (NOWY — providers, models, prompts)
```

**3 funkcje LLM** (kolejność implementacji wg user value):

1. **Semantic Alignment Score** — zastępuje hardkodowane keywords dla zdrofit. Brief content → embedding → cosine similarity z StrategyDocument chunkami scoped do brandu → score 0-100 + 1-zdaniowy rationale (Claude Sonnet)
2. **Flag reasoning** — każdy rule violation z policy-engine.ts → Claude Haiku generuje human-friendly „dlaczego to jest problem dla tej marki"
3. **Brief quality check** — „czy kontekst jest meaningful" → LLM check (rozmyty cel, KPI nieliczalne, brak konkretu lokalnego)

**Koszty**: ~$0.014 per brief (~$0.70/mc per klient przy 50 briefach). Negligible.

**Patrz**: `LLM_INTEGRATION_SPEC.md` po pełen tech spec + ready-to-paste skeletons.

---

# 📅 TYGODNIE 1-10

---

## TYDZIEŃ 1 · LLM foundation + Sentry

**Cel tygodnia**: embeddingi w bazie, Sentry łapie błędy.

- [ ] **Sob** (2.5h)
  - [ ] Anthropic API account + key w `.env.local`
  - [ ] `npm i @anthropic-ai/sdk voyageai`
  - [ ] pgvector extension w Neon (Console → SQL Editor → `CREATE EXTENSION vector;`)
- [ ] **Nd** (3h)
  - [ ] `src/lib/llm-config.ts` — providers, models, cost caps
  - [ ] `src/lib/embeddings.ts` — `embedText()` + `embedDocument()` + `findSimilar()`
- [ ] **Pon** (1.5h)
  - [ ] Sentry setup (`@sentry/nextjs`) + DSN w env
  - [ ] Test: throw new Error() → email do Ciebie <60s
- [ ] **Wto** (1.5h)
  - [ ] Prisma migration: `embedding vector(1536)` na `StrategyDocument`
  - [ ] HNSW index na vector column
- [ ] **Czw** (1.5h)
  - [ ] Script `scripts/embed-strategy-docs.ts` — embed istniejące dokumenty
  - [ ] Sanity check: cosine similarity query w psql

**🚦 Bramka tygodnia 1**:
- [ ] `node scripts/embed-strategy-docs.ts` przechodzi bez błędu
- [ ] Test cosine query zwraca top-3 najbardziej podobne chunki
- [ ] Sentry pokazuje test error w dashboardzie

---

## TYDZIEŃ 2 · LLM Alignment Score MVP

**Cel tygodnia**: `getAlignmentScore(briefId)` zwraca `{ score, rationale }` w <3s.

- [ ] **Sob** (2.5h)
  - [ ] `src/lib/llm-auditor.ts` — funkcja `computeAlignmentScore(brief)`
  - [ ] System prompt dla Claude Sonnet (PL, focused na marketing strategy)
  - [ ] Test na 5 historycznych briefach z seed
- [ ] **Nd** (3h)
  - [ ] Cache layer: `Brief.aiAuditResult` JSON z timestamp
  - [ ] Recompute trigger tylko gdy `brief.context` lub `brief.title` zmienia się
  - [ ] Storage: `aiAuditResult: { alignment: { score, rationale, model, cost, timestamp }, ... }`
- [ ] **Pon** (1.5h)
  - [ ] Edge case: brief bez strategy docs → score = null + reason
  - [ ] Edge case: brief <50 znaków → score = null + reason
- [ ] **Wto** (1.5h)
  - [ ] Try/catch + fallback do rule engine (alignment scoring v1)
  - [ ] Exponential backoff dla Anthropic rate limits
- [ ] **Czw** (1.5h)
  - [ ] Bench: 20 briefs przepuszczone przez LLM, mierzysz latency + cost
  - [ ] Tuning prompta jeśli accuracy <80%

**🚦 Bramka tygodnia 2**:
- [ ] `getAlignmentScore(briefId)` działa w <3s
- [ ] Cost <$0.02/brief verified w Anthropic dashboard
- [ ] 20 testowych briefów: scoring brzmi sensownie (manualny review)

---

## TYDZIEŃ 3 · LLM w UI + Flag reasoning

**Cel tygodnia**: demo wygląda jak na landingu. Alignment score badge widoczny.

- [ ] **Sob** (2.5h)
  - [ ] Brief detail page: alignment score badge (87% zielony / 52% żółty / 31% czerwony)
  - [ ] Validator inbox: sortowanie po alignment score asc
- [ ] **Nd** (2.5h)
  - [ ] Flag reasoning: Claude Haiku per rule violation
  - [ ] Display: hover tooltip + expandable card pod każdym flagiem
- [ ] **Pon** (1.5h)
  - [ ] Loading states: skeleton dla alignment calc (max 5s timeout)
- [ ] **Wto** (1.5h)
  - [ ] Empty state: brak strategy docs dla brandu → CTA „Dodaj strategy doc dla [brand]"
- [ ] **Czw** (1.5h)
  - [ ] Sanity check 3 personas (CM/V/A) widzą alignment poprawnie
  - [ ] Mobile-ish check (1024px+ desktop only, mniejsze odpuszczamy)

**🚦 Bramka tygodnia 3**:
- [ ] Validator widzi inbox z 5 briefami, każdy ma alignment score badge
- [ ] On-hover Claude reasoning po polsku, sensowne
- [ ] Czas od „submit brief" do „validator widzi score" <5s

---

## TYDZIEŃ 4 · Email notifications (Resend) + Brief form accordion

**Cel tygodnia**: validator dostaje email po submit. Brief form skraca się wizualnie.

- [ ] **Sob** (2.5h)
  - [ ] Resend account + API key + `.env.local`
  - [ ] `src/lib/email/client.ts` — Resend wrapper
  - [ ] React Email lub plain HTML templates dir
- [ ] **Nd** (3h)
  - [ ] Template: „Nowy brief czeka na akceptację" (do validator)
  - [ ] Template: „Brief zatwierdzony/odrzucony" (do CM)
  - [ ] Template: „Twój daily digest" (do validator, 9:00 codziennie)
- [ ] **Pon** (1.5h)
  - [ ] Wpięcie maili w server actions: `submitBrief`, `processApproval`
- [ ] **Wto** (1.5h)
  - [ ] Brief form: 5 sekcji accordion zamiast monolitu
  - [ ] Default: pierwsza sekcja open, reszta collapsed
- [ ] **Czw** (1.5h)
  - [ ] Inline validation feedback (red border + msg pod polem)

**🚦 Bramka tygodnia 4**:
- [ ] Submit brief → 30s później email w skrzynce validator z linkiem
- [ ] Brief form: subiektywny test = wypełnienie w <7 min (na stoperze!)
- [ ] Linki w mailach prowadzą do właściwych stron z prepoulated state

---

## TYDZIEŃ 5 · Microcopy review + Landing fixes

**Cel tygodnia**: zero enum w UI, Google indexuje landing, demo na LinkedIn działa.

- [ ] **Sob** (2.5h)
  - [ ] Audit wszystkich enum w UI → ludzki tekst (zrób grep'em listę)
  - [ ] REVENUE_ACQUISITION → „Pozyskanie nowych klientów"
  - [ ] RETENTION_ENGAGEMENT → „Retencja i zaangażowanie"
  - [ ] etc.
- [ ] **Nd** (3h)
  - [ ] Empty states: briefs, approvals, production (każdy z CTA)
  - [ ] Error states: 404, 500, „no permission" z brand voice
- [ ] **Pon** (1.5h)
  - [ ] Landing: `<meta name="robots" content="index, follow">`
  - [ ] Landing: og:image 1200×630 (Figma, hero + tagline)
  - [ ] Landing: Calendly link „Książka 20-min" w stopce
- [ ] **Wto** (1h)
  - [ ] Landing: usuń pustą sekcję „ZAUFALI NAM LIDERZY BRANŻY"
  - [ ] Landing: update „Q2 2026" na coś nieobjawiającego się terminem
- [ ] **Wto** (0.5h)
  - [ ] Privacy policy: PL + EN (template z TermsFeed lub własny)
  - [ ] Link w stopce landing
- [ ] **Czw** (1.5h)
  - [ ] Stats na landingu: honest source attribution („Dane z pilotu Benefit Systems × 50 lokalizacji")

**🚦 Bramka tygodnia 5**:
- [ ] `site:regional.fit` w Google zaczyna pokazywać wyniki (dni-tygodnie)
- [ ] LinkedIn preview: hero image + sensowny opis
- [ ] Wszystkie ekrany app: human readable, zero ENUM_VALUES

---

## TYDZIEŃ 6 · GDPR minimum + Onboarding skrypt

**Cel tygodnia**: legal CYA dla EU client, onboard nowej organizacji w 30 min.

- [ ] **Sob** (3h)
  - [ ] Data export endpoint: `/api/account/export` (CSV + JSON)
  - [ ] Account deletion endpoint: `/api/account/delete` (soft delete + 30-day hard delete cron)
- [ ] **Nd** (3h)
  - [ ] Onboarding skrypt: `scripts/onboard-org.ts`
  - [ ] Input args: `--name`, `--clubs-csv`, `--admin-email`, `--brand-assets-dir`
  - [ ] Output: seed all tables, welcome emails do admin
- [ ] **Pon** (1.5h)
  - [ ] Privacy policy: PL + EN (Notion link z dynamicznym datą update)
  - [ ] Link w stopce app + landing
- [ ] **Wto** (1h)
  - [ ] DPA template (Notion shareable link, ready dla EU clients)
- [ ] **Czw** (1.5h)
  - [ ] Cookie banner (jeśli używasz PostHog/analytics)
  - [ ] Logging consent w bazie

**🚦 Bramka tygodnia 6**:
- [ ] `node scripts/onboard-org.ts --name=benefit --clubs-csv=clubs.csv` w 5 min stawia całą organizację
- [ ] Privacy policy + DPA dostępne publicznie
- [ ] Data export endpoint zwraca pełny dump usera w <10s

---

## TYDZIEŃ 7 · Smoke testy + Reliability

**Cel tygodnia**: zero foot-guns. Możesz spokojnie ship'ować do prod.

- [ ] **Sob** (3h)
  - [ ] Playwright setup + auth helper (login as CM/V/PROD)
  - [ ] **Test 1**: CM tworzy brief → submit → status zmienia się na SUBMITTED
- [ ] **Nd** (3h)
  - [ ] **Test 2**: V dostaje email → klika link → akceptuje → ProductionTask powstaje
  - [ ] **Test 3**: PROD designer marks DELIVERED → CM widzi notyfikację
- [ ] **Pon** (0.5h)
  - [ ] UptimeRobot dla `app.regional.fit` + `www.regional.fit`
  - [ ] Alert email + Slack webhook
- [ ] **Wto** (1.5h)
  - [ ] NextAuth 5β → 4.x stable migration
  - [ ] Lock wszystkich deps w package.json (exact versions, nie ^)
- [ ] **Czw** (1.5h)
  - [ ] Database backup script (Neon ma built-in, ale dodaj weekly export do S3/R2)
  - [ ] **Restore drill**: kasujesz testową org, odtwarzasz z backupu, mierzysz czas

**🚦 Bramka tygodnia 7**:
- [ ] `npm run test:e2e` przechodzi 3 happy paths w <2 min
- [ ] Restore drill udowadnia odzyskanie DB w <10 min
- [ ] UptimeRobot pokazuje 99.9% uptime za ostatnie 7 dni

---

## TYDZIEŃ 8 · Seed Benefit demo data + dry run

**Cel tygodnia**: demo gotowe do pokazania GMM-owi z realistic danymi.

- [ ] **Sob** (2.5h)
  - [ ] Seed: 25 realnych klubów Benefit (extract z OTWARCIA_SYSTEM)
  - [ ] Seed: 5 users (3 CM, 1 V Warszawa, 1 PROD)
- [ ] **Nd** (3h)
  - [ ] Seed: 3 strategy documents (Zdrofit / My Fitness Place / Fabryka Formy)
  - [ ] Seed: 30 historycznych briefów (realistic mix DRAFT/SUBMITTED/APPROVED/DELIVERED)
- [ ] **Pon** (1h)
  - [ ] Embed wszystkie 3 strategy docs
  - [ ] Verify w bazie: chunks + embeddings exist
- [ ] **Wto** (1.5h)
  - [ ] Test path: nowy brief w Benefit → LLM score → V akceptuje
  - [ ] Mierzysz: latency, cost, accuracy
- [ ] **Czw** (2h)
  - [ ] Bug fix runda na podstawie testu
  - [ ] Polish: animacje, transitions, kosmetyka

**🚦 Bramka tygodnia 8** (DEMO-READY):
- [ ] LLM alignment score działa na 20+ historycznych briefach
- [ ] Validator inbox sortuje wg score, flag reasoning po polsku
- [ ] Email notification po submit verified
- [ ] Brief form wypełniany w <7 min (test na stoperze!)
- [ ] Sentry: 0 unresolved errors w ostatnich 7 dniach
- [ ] Landing: noindex off, og:image, Calendly działa

---

## TYDZIEŃ 9 · Production deploy + soft launch

**Cel tygodnia**: app.regional.fit działa prod, pierwsze realne demo z GMM.

- [ ] **Sob** (3h)
  - [ ] Domain `app.regional.fit` w Vercel
  - [ ] Production env vars + Anthropic prod key
  - [ ] Neon production branch (oddzielne od staging)
- [ ] **Nd** (3h)
  - [ ] Migrate seed do prod
  - [ ] Manual smoke test prod (30 min checklist)
  - [ ] k6 stress test: 10 concurrent users
- [ ] **Pon** (1h)
  - [ ] Outreach do GMM Benefit: „mam coś gotowego do pokazania, masz 30 min?"
  - [ ] Wysłany przed 18:00 = większa szansa odpowiedzi tego dnia
- [ ] **Wto** (2h)
  - [ ] Demo z GMM + 1-2 RM (zoom call)
  - [ ] **Format**: 5 min discovery, 15 min demo na ich realnych klubach, 10 min Q&A
  - [ ] Cel: get them excited, nie sell
- [ ] **Czw** (1h)
  - [ ] Bug fixes z feedbacku
  - [ ] Follow-up mail do GMM: „next step = onboarding 3-5 RM-ów w przyszłym tyg?"

**🚦 Bramka tygodnia 9**:
- [ ] app.regional.fit działa publicznie z realnymi danymi Benefit
- [ ] Pierwsze realne demo z buyerem odbyło się
- [ ] Mam follow-up scheduled na onboarding workshop

---

## TYDZIEŃ 10 · Onboarding workshop + go-live

**Cel tygodnia**: 5 RM-ów Benefit aktywnych, GMM widzi alignment scores na realnych briefach.

- [ ] **Sob** (2.5h)
  - [ ] Workshop content: slidy (10 max) + Loom 5-min „getting started"
  - [ ] FAQ doc (Notion shareable, 15 najczęstszych pytań)
- [ ] **Nd** (2.5h)
  - [ ] Dry-run workshopu nagrany jako tutorial dla nowych RM
  - [ ] 1-pager „Jak zacząć w 5 min" (PDF)
- [ ] **Pon** (1h)
  - [ ] Workshop live z 3-5 RM Benefit (60 min Zoom)
  - [ ] Format: 15 min context, 30 min hands-on (każdy tworzy real brief), 15 min Q&A
- [ ] **Wto** (1.5h)
  - [ ] Day-1 support: monitor Sentry + Slack channel z GMM
  - [ ] Odpowiedz na pytania <2h
- [ ] **Czw** (2.5h)
  - [ ] Day-3 retrospect z GMM (30 min call)
  - [ ] Co działa / co nie / co dorobić
  - [ ] Bug fix sprint na podstawie feedbacku

**🚦 Bramka tygodnia 10** (GO-LIVE):
- [ ] 5 RM-ów Benefit aktywnych w app
- [ ] Każdy wypełnił ≥1 brief w pierwszym tygodniu
- [ ] GMM widzi alignment scores na realnych briefach
- [ ] Sentry: 0 critical errors w pierwszym tygodniu
- [ ] **Invoice za pilot wysłany** (50-100k PLN)

---

# ✅ Pilot-ready master checklist (do odhaczania koniec tyg 10)

## Tech
- [ ] LLM alignment score działa produkcyjnie
- [ ] Email notifications wszystkich kluczowych eventów
- [ ] Sentry + UptimeRobot + backupy
- [ ] 3 e2e tests przechodzą
- [ ] Database restore drill udowodniony
- [ ] NextAuth na stable version
- [ ] Brief form wypełniany w <7 min

## Onboarding
- [ ] Skrypt `scripts/onboard-org.ts` testowany
- [ ] 25 klubów Benefit zaseedowanych
- [ ] 5 userów Benefit zaproszonych i aktywnych
- [ ] Workshop nagrany + FAQ + 1-pager

## Legal
- [ ] Privacy policy PL + EN publicznie
- [ ] DPA template gotowy do wysłania
- [ ] Cookie consent (jeśli analytics)
- [ ] Data export endpoint działa

## Commercial
- [ ] Landing: indexowana, og:image, Calendly
- [ ] Pricing/invoice template
- [ ] Day-1 support kanał (Slack z GMM)
- [ ] SLA: <4h response w godz. 9-18 PL
- [ ] Outreach plan post-pilot (5 next prospects)

---

# 🚨 Ryzyka i mitigacje

| Ryzyko | Prawdopodobieństwo | Mitigacja |
|---|:---:|---|
| Porzucenie w tyg 5-6 (dip energii) | **WYSOKIE** | Niedzielne retro 30 min nieprzesuwalne. Jeśli pomijasz drugie z rzędu — flag, modyfikujemy plan |
| GMM Benefit nie odpowiada w tyg 9 | Średnie | Soft heads-up w tyg 7: „za 3 tyg będę miał coś gotowego" |
| LLM cost spike (duże strategy docs) | Niskie | Hard cap $50/mc w llm-config.ts, alert email przy 80%, fallback do rule engine |
| Bug w prod w pierwszym tyg pilota | Średnie | Day-1 monitoring, hot-fix capability, communication channel z GMM otwarty |
| Multi-tenant debt po pilocie #1 | Świadomy | Sprint 2-tyg na MT zaraz po podpisaniu pilot invoice |

---

# 🔄 Świadomie odpuszczone w v1

| Co | Wraca w… | Dlaczego można |
|---|---|---|
| Multi-tenancy (Organization model) | Po pilocie #1 (2-tyg sprint) | Single-tenant OK dla 1 klienta |
| Stripe billing | Po pilocie #1 | Invoice manual 50-100k PLN |
| Self-serve onboarding | Po pilocie #3 | Manual przez 3 klientów = insight |
| CMO executive dashboard | Po 4 tyg use | Zobaczysz co realnie chcą |
| Wizard (zamiast accordion) | Po feedbacku z pilotu | Accordion = 80% wartości za 20% pracy |
| Mobile responsive | Po pilocie #1 | Desktop-first, nikt nie wypełnia briefu z telefonu |
| Help center (Intercom) | Po pilocie #3 | 1:1 Slack daje lepsze insighty |
| Comment threads w briefach | Po pilocie #1 | Email + Slack wystarczy na pilot |

---

# 📊 Tracking — wypełnij co tydzień w retro

| Tyg | Plan h | Real h | Bramka | Slipy | Notes |
|:---:|:---:|:---:|:---:|---|---|
| 1 | 10 | __ | ☐ | | |
| 2 | 10 | __ | ☐ | | |
| 3 | 10 | __ | ☐ | | |
| 4 | 10 | __ | ☐ | | |
| 5 | 10 | __ | ☐ | | |
| 6 | 10 | __ | ☐ | | |
| 7 | 10 | __ | ☐ | | |
| 8 | 10 | __ | ☐ | | DEMO-READY |
| 9 | 10 | __ | ☐ | | |
| 10 | 10 | __ | ☐ | | GO-LIVE |

---

**Last updated**: 2026-05-17
**Owner**: Reszek (solo)
**Strategic partner**: Claude (Sunday 18:00 check-ins)
