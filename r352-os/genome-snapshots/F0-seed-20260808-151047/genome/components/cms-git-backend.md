---
id: "comp:cms-git-backend"
type: "component"
title: "CMS git-as-backend"
status: "active"
created: "2026-08-08"
updated: "2026-08-08"
version: 1
owner: "przemek"
relations: {"born_from": ["proj:dailyfruits-cms-v6"], "used_by": ["proj:dailyfruits-cms-v6"]}
tags: []
---

Rodzina lekkich CMS-ów bez bazy danych: treść, kosz i historia = commity przez GitHub Git Data API (atomic multi-file commit), auth HMAC, moduły włączane flagami MODULES.

**Wdrożenia:** DailyFruits /admin (v6, najbogatsze: Blog/Strony/Produkty/Menu/Kosz/Historia) → port bees-knees (dowód przenośności na 2. markę) → subset betterguide → szablon `cms/` w r352-framework (kanoniczna wersja produktowa).

**Kuracja (zgłoszone przez Przemka 08.08):** wymaga jednego kanonicznego repo szablonu + changelogu portów; znany gap: MODULES niespójne między cms.html a _config.js we frameworku.
