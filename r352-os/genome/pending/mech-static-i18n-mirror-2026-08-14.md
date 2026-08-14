# PROPOZYCJA KARTY MECHANIZMU (pending — czeka na zatwierdzenie i ingest)

id: mech:static-i18n-mirror
nazwa: Lustro językowe na statycznym generatorze
status: proposed
confidence: medium (1 wdrożenie pełne: thehermeticum PL; 1 wdrożenie wariantowe wcześniejsze: DiMedical EN)
data: 2026-08-14
autor propozycji: Claude (sesja thehermeticum), decyduje: Przemek

## Trigger
Serwis statyczny (własny generator build.py / SSG) ma dostać drugą wersję językową
bez przepisywania architektury i bez CMS-a. Powtarzalne w projektach klienckich
(DiMedical: PL→EN; thehermeticum: EN→PL).

## Mechanizm
1. **Rama per język, treść per plik.** Rama serwisu (header/footer/nav) ma po jednym
   źródle prawdy na język (index.html / index-pl.html); generator wycina ją slice'em.
   Treść stron: katalog `content-<lang>/` z JSON-ami o TYCH SAMYCH kluczach co strony
   bazowe — tłumaczenie jest nakładką (override), nie kopią systemu.
2. **Słownik UI w generatorze.** Etykiety renderera (Key facts, FAQ, Sources, TL;DR,
   podpisy portretów, wstęga CTA) w jednym dict UI[lang] — zero rozjazdów.
3. **Adresacja prefiksem** (`/pl/...`), slugi bez tłumaczenia — linki wewnętrzne w treści
   tłumaczonej dostają prefiks mechanicznie, co eliminuje mapę slugów i martwe linki.
   (Wariant DiMedical z tłumaczonymi slugami = lepszy long-tail SEO, droższy w utrzymaniu;
   wybór zależy od tego, czy klient będzie sam dodawał strony.)
4. **SEO od pierwszego builda:** hreflang (en/pl/x-default) na KAŻDEJ parze stron,
   per-język canonical, og:locale, JSON-LD inLanguage, wpisy obu wersji w sitemap,
   nota w llms.txt.
5. **Tłumaczenie = fan-out agentów ze specyfikacją.** Jedna SPEC (głos, glosariusz
   terminów kanonicznych, zasady HTML: nie ruszać tagów/encji/URL-i zewnętrznych,
   prefiksować wewnętrzne), partie po 4-8 stron, walidacja `json.load` po każdym pliku,
   agenci raportują wątpliwości terminologiczne 1-linijkowo → integrator normalizuje.

## Evidence
- thehermeticum: 44 strony EN → PL w jednej sesji; 8 agentów równolegle;
  rekordy: records/routing/hermetica-serwis-2026-08-14.md (projekt-nośnik)
- DiMedical: dimedical-redesign/i18n.py (SLUGI/KANON/UI + kontekst()) — wariant
  z tłumaczonymi slugami i płaską strukturą plików
- Znane pułapki: (a) sekcje generowane f-stringiem wymagają parametru lang, nie
  literałów; (b) 404/wstążki poza render() łatwo przeoczyć; (c) glosariusz MUSI
  przesądzać odmianę nazw własnych (Trismegistus/Trismegistos), inaczej partie
  się rozjeżdżają; (d) treści okresowe (newsletter) — uczciwa nota o języku
  oryginału zamiast udawania pełnej lokalizacji.

## Kiedy NIE używać
- Serwisy z treścią szybkozmienną bez pipeline'u publikacji per język (lustro
  natychmiast się rozjedzie — patrz koszt stały ×2 na każdą publikację).
- Gdy klient oczekuje lokalizacji kulturowej, nie tłumaczenia (inne case studies,
  inne przykłady) — to osobny mechanizm, nie lustro.

## Wpływ na decyzje (decision_impact)
changes: [mechanism, workflow]
targets: ["mech:static-i18n-mirror (nowa karta)", "workflow: fan-out tłumaczeniowy ze SPEC"]
note: "Wyceniane dotąd ad hoc; karta daje powtarzalny szablon wyceny (infra 0,5 sesji + ~6 stron/agenta/partię + QA integracyjne)."
