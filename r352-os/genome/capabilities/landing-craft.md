---
id: "cap:landing-craft"
type: "capability"
title: "Skill /landing-craft"
status: "available"
created: "2026-08-15"
updated: "2026-08-15"
version: 1
owner: "przemek"
relations: {"related":["cap:mechanism-router","cap:project-postmortem","mech:single-source-compiler","mech:seo-aeo-foundation"]}
tags: ["frontend","design","copy"]
---

Metoda budowy landingu/onepagera od pustej strony do freeze. Wyekstrahowana z realnej
budowy `genome.r352.com` (WAVE 2026): ~30 iteracji, 3 rundy zewnętrznego audytu.

**Każda reguła ma za sobą konkretny błąd albo konkretny pomiar**, 17 z nich oznaczono ★ jako
źródła realnych regresji. To odróżnia ten skill od listy dobrych praktyk: jest zapisem
incydentów, nie teorii.

Rdzeń metody, w kolejności:

1. **Kompilator z danych** — `build.mjs` + template, zero liczb w HTML. Strona fizycznie
   nie może skłamać, bo nie zna liczb spoza źródła. Build pada, gdy źródło zniknie.
2. **Guardy budowane z incydentów** — każdy błąd, który przeszedł do produkcji, zamienia się
   w guard. Guard bez testu negatywnego (przywróć błąd, zobacz czerwony build) nie jest guardem.
3. **Pomiar przed opinią** — kontrast, przepełnienie, liczba słów, LCP: wszystko mierzalne
   puppeteerem w 30 sekund. Dotyczy też zgłoszeń od ludzi; zgłoszenie „mobile ucina" nie
   potwierdziło się na sześciu szerokościach, a prawdziwą przyczyną była afordancja karuzeli.
4. **Język publiczny vs systemowy** — rygor schodzi warstwę niżej, nie znika. Widz OGLĄDA
   rygor w surowych artefaktach, ale CZYTA po ludzku.
5. **Protokół audytu i freeze** — zewnętrzny audytor bez kontekstu budowy, rozliczenie
   z każdego znaleziska pomiarem, freeze na realnym telefonie przez QR.

Wejście: `/mechanism-router` na brief. Wyjście: `/project-postmortem` + propozycje do kanonu.

Plik: `~/.claude/skills/landing-craft/SKILL.md` (globalny, nie projektowy — metoda działa
na wszystkich landingach, więc jedna kopia zamiast kopii per projekt).
