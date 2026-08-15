# Conversion audit — postaisociety.vercel.app

**Verdict up front: no.** The page converts an already-converted reader. It has exactly one CTA, it is a `mailto:` link 17.2 screens down on desktop and 20.4 screens down on mobile, and on mobile the nav that could shortcut to it is `display:none`. Measured, not estimated (see numbers below). Everything else — the writing, the typography, the plates — is genuinely good, which is precisely the problem: it's a beautifully bound book with no order form and no author's name.

---

## 1. The first 5 seconds

The hero is `min-height:100svh` with `justify-content:flex-end`, so the fold is bottom-aligned text on paper-white. What is actually in the first viewport (measured at 390×844):

- Wordmark "The Post-AI Society"
- `01 · MANIFESTO`
- H1: **"The machines will do the work. *We intend to do the living.*"**
- `BEGIN READING`
- "On a hill in Italy, we are assembling twenty people for an experiment: what does a good life look like once intelligence stops being scarce? Not a startup. Not a retreat. Not a religion. A place — stone, gardens, one long table — where technology serves life instead of consuming it."

**Understands:** essentially the correct thing, and fast. The sub-paragraph is the best-working copy on the page — "twenty people," "a hill in Italy," "not a startup, not a retreat, not a religion" does more definitional work in one sentence than most homepages do in five. Credit where due.

**Feels:** literary respect, then suspicion. "The machines will do the work. We intend to do the living" is a sentence about a *worldview*, not about a *thing you can join*. Paired with `MMXXVI`, `Plate I`, `Fig. 1` and roman numerals, the emotional read within 5 seconds is *"someone made a very tasteful zine."* The instruction the page literally gives is `BEGIN READING` — a 1,227-word, ~5.6-minute commitment. That is the page's own stated ask, and it is the wrong one.

**Thinks they should do:** scroll. There is no alternative — no CTA in the hero, no "who's behind this," no "what happens in spring," nothing clickable in the fold except the wordmark and (desktop only) six nav anchors, of which "Apply" is the sixth and smallest.

Three things a stranger cannot learn in 5 seconds and will not learn for 15 minutes: **who is asking, when it happens, and what it costs.** For a page whose ask is "move to a village with strangers," those are the first three questions, not the last.

---

## 2. The path to action

**The only CTA on the entire page:**

```html
<a class="apply-cta" href="mailto:hello@humancommons.org?subject=Residency%20—%20first%20twenty">
  Request an invitation →
</a>
```

That's it. One anchor. `grep -c '<form\|<input\|<textarea'` returns **0**.

**Measured distance:**

| Viewport | Page height | CTA position | Screens to CTA |
|---|---|---|---|
| 1440×900 desktop | 15,827 px | 15,478 px | **17.2** |
| 390×844 mobile | 17,711 px | — | **20.4** |

**Mobile has no shortcut.** The stylesheet contains:

```css
@media(max-width:760px){nav .menu{display:none}}
```

No hamburger, no replacement. Below 760px the "Apply" nav link — the only above-the-fold path to conversion — simply does not exist. A phone visitor must scroll twenty screens or leave.

**Desktop's shortcut hides itself.** The nav is `position:fixed` but the script adds `nav.hidden{transform:translateY(-100%)}` on downward scroll. So the single persistent route to "Apply" retracts during the exact action the page asks for (`BEGIN READING`).

**What happens if someone clicks it.** `mailto:` — the worst possible endpoint here:

- On desktop Chrome with no mail handler registered, nothing visibly happens. Silent failure. That is not a low conversion rate, that is a zero.
- Where it does fire, it opens a blank compose window prefilled only with `Subject: Residency — first twenty`, and the copy beneath it sets the bar: *"Tell us who you are, what you make, and what you would bring to the table."* You are asking a stranger to draft an unstructured personal essay, from a phone, cold, with no word count, no examples, no idea who reads it.
- You capture nothing on abandonment. Someone who is 90% convinced but not ready to write an essay tonight leaves no trace. No email, no list, no retargeting, no "notify me." Every hesitant visitor — the majority — is discarded.
- The reply address is on a **different domain** than the site. See §4.

The line *"There is no form."* is written as a virtue. It's the single most expensive sentence on the page.

**Also broken:** all three Journal CTAs are `href="#journal"` — they scroll to the section the reader is already in. Three visible "Read the note / Read the essay / Read the manifesto" links, zero destinations. Anyone who clicks one learns the page is a façade, and they learn it *one section before the ask*.

---

## 3. Trust signals — present vs. absent

**Present (real, and worth keeping):**
- A specific, falsifiable ask: "twenty people," "Italy," a defined daily rhythm with hours (`06—13`, `13—18`, `18—late`)
- Honest phase sequencing — "We are not launching. *We are beginning.*" and `Italy — First campus · in scouting` is admirably non-committal
- The masterplan (`Fig. 1`) is genuine evidence of thinking, not decoration
- Six real photographs with descriptive alt text
- "A person reads every letter" — good, human, but unverifiable because no person is named
- A stated principle set that would actually filter people (`№ 7 · Freedom & responsibility`, `№ 5 · Contribution`)

**Absent — every one of these is standard for anyone who has ever actually recruited humans to a place:**

1. **A single human name.** Zero. No founder, no bio, no face, no "I". The page says "we" 30+ times and never once says who. You are asking people to relocate and won't say who's asking.
2. **A photo of a real person involved.** All six plates are places. Not one is a human being connected to the project.
3. **A legal entity.** No company, no association, no foundation, no country of registration.
4. **Money.** No cost, no price band, no funding model, no "who pays for what." Whether this is a €2k/month residency or a philanthropic grant is unknowable. For a decision of this size, silence on money reads as either "we don't know" or "if you have to ask."
5. **Dates.** "Several months," `MMXXVI`, "spring" appears nowhere. The reader cannot tell if this is next year or a decade out.
6. **A location, even coarse.** "Italy," then Puglia in a caption, then "twelve villages in Puglia" in the Journal — but §10 lists only `Italy · in scouting`. Three different specificity levels, all unresolved.
7. **Proof anyone else is in.** No "142 people have written," no waitlist count, no advisor names, no partner village, no architect, no first resident. A stranger has no evidence they wouldn't be the only one.
8. **Social proof of existence.** The Instagram @postaisociety exists in the world and is **not linked anywhere on the page.** Free, real, verifiable — and omitted.
9. **A working domain.** Site lives on `postaisociety.vercel.app`.
10. **Privacy / data handling.** No policy, no "what we do with your letter," no GDPR line — while soliciting unstructured personal disclosure from EU residents.
11. **Any answer to "what am I actually committing to?"** Visa? Employment? Can I keep my job? Family? Pets? Cost of exit? Not one word.
12. **A press/mention/anything-external link.**

---

## 4. Credibility risks — what a sceptic catches

These are ordered by how badly they detonate.

**(a) The Journal describes fieldwork that has not happened.**

> **Field note · No. 03** — "What we learned walking twelve villages in Puglia"
> "Every village we loved had the same secret: the piazza was smaller than we expected, and the table was longer."

The scouting trip is planned for October 2026. Today is 7 August 2026. This is a dated-looking past-tense claim about twelve specific villages, with a specific empirical finding, describing a trip nobody has taken. Reinforced in §10:

> "We are walking these villages now — counting the steps from the church to the bakery, asking who still lives there, and why they stayed."

Present continuous. Not true today. If a single serious applicant — or a journalist, or a village mayor — asks "which twelve?", the whole page becomes retroactively suspect, including the parts that are honest. **This is the highest-risk object on the site and it sits directly above the CTA.** Delete or re-date before anything else.

**(b) The email domain is a different, blank domain.**
Site: `postaisociety.vercel.app`. Contact: `hello@humancommons.org`. A cautious person checks the domain before writing a personal letter to it. `humancommons.org` resolves and returns **a blank page** (GoDaddy MX records, no content). So the sequence is: preview-URL site → unexplained third-party brand → empty website. Three strikes on the one link you want clicked.

**(c) "We did not draw this plan; we inherited it."**
The masterplan was drawn — by you, by hand, this month. The sentence is intended poetically (villages inherit their logic from a thousand years of form). Read literally by a sceptic standing in front of a clean, rendered, labelled plan of `QUIET HOUSE`, `BATHS & SAUNA`, `OLIVE PRESS`, `AMPHITHEATRE`, `CAMPO` and an `OLIVE ORCHARD`, it says: *this is an existing place we acquired.* It is not. Caption `Fig. 1 — First campus, working plan` compounds it: "first campus" + a fully specified plan + `in scouting` = a site that reads as secured and isn't.

**(d) Plate captions imply photography that is documentation.**
`Plate I — The hill, at first light. Somewhere between Puglia and a decision.` The image is a misted hill town with umbrella pines — a fine photograph, and one that reads Tuscan/Lazio, not Pugliese. Whether stock or licensed, the caption invites the reader to believe they are looking at *the* hill. `Plate V — From the bell tower. Six hundred years of dinner, and counting.` Same move. One reverse image search converts "beautiful" into "staged."

**(e) The register outruns the substance.**
`MMXXVI`, `Plate I–VI`, `Fig. 1`, `№ 1–8`, `I–VI` roster numerals, `A prototype for a new way of living · MMXXVI`, `Italy, first`. This is the visual grammar of an institution with archives. The institution is eight days old with an Instagram account. The gap between the *implied* age and the *actual* age is the "brand before substance" tell, and a reader who spots it re-reads everything else as marketing. The writing is strong enough to survive without the costume.

**(f) Rhetorical certainty on contested claims, stated as settled.**

> "The spreadsheets will fill themselves. The emails will answer each other. The work that filled your calendar will quietly leave it — faster than anyone is prepared to admit."

Delivered as fact, unhedged, unsourced, in a page that then asks the reader to relocate on the strength of it. To a technically literate reader — precisely your `Founders / Scientists / Engineers` roster — this is the paragraph that reads as ideology rather than analysis. One clause of intellectual honesty ("we may be wrong about the timing; we are not wrong about the direction") buys more credibility than the whole certainty does.

**(g) Three dead "Read the…" links** (§2). A page that fakes three articles has, to a sceptic, admitted its method.

**(h) "Residents are not customers. *They are members.*"**
Stated where no price, no membership terms, and no legal entity exist. Combined with `Phase I · The Residency` being — per your own plan — a **paid** test residency, this line will later read as having concealed a commercial relationship. Say "paid" now, on your terms, or have it discovered later on someone else's.

---

## 5. The conversion moment — exact copy and placement

**Structural changes (three, all required):**

1. **Kill the `mailto:`.** Replace with a real form posting to a real inbox. Keep the letter — make it optional and second.
2. **Fix the mobile nav.** Delete `@media(max-width:760px){nav .menu{display:none}}` and instead keep one persistent element on mobile: a right-aligned nav button reading **`Register interest`** linking to `#register`. Remove `nav.hidden` on downward scroll, or exempt the button from it. This alone changes conversion more than any copy edit.
3. **Place the conversion block TWICE.** Not once. First instance goes **immediately after `Phase I · The Residency`** in §09 — that is the first moment a reader knows there is a specific thing with a specific size to join, and it is ~9 screens earlier than the current CTA. Second instance stays at §12 as written.

**Insert into §09, directly under the Phase I row:**

> `09a · Register`
>
> ## The first residency opens in spring 2027. Twenty places.
>
> Three months on a hill in Italy, testing the daily rhythm above by living it. Paid — we'll publish the figure once the building is real. We're choosing the village in October. If you want to be told when we do, leave your name; if you already know you want one of the twenty, write us a letter instead.
>
> **[ Field: Name ]**
> **[ Field: Email ]**
> **[ Field: What do you make? — one line ]**
> **[ Optional: Which of the three regions interests you? — Tuscia / Abruzzo / Puglia / no preference ]**
> **[ Checkbox: I'd consider one of the first twenty places — not just following along ]**
>
> **Button: `Keep me posted →`**
>
> Two or three emails a year. Nothing else, ever, and no list is sold or shared.
>
> *Or skip the form: [write us a letter](mailto:…) — tell us who you are, what you make, and what you'd bring to the table. A person reads every one, and replies.*

**What happens after submit — replace the page state in place, do not navigate away:**

> ### Noted. You're on the list — number 47.
>
> You'll hear from us next in October, from the road: three regions, roughly thirty villages, and whichever one we can't stop talking about at dinner. If we don't write by 15 November, the trip went badly and we'll tell you that too.
>
> Until then: [@postaisociety](https://instagram.com/postaisociety) — the plan, the villages, the arguments.

Then the confirmation email, same voice, within seconds:

> **Subject:** You're on the list — The Post-AI Society
>
> Thank you for writing.
>
> Here's where things honestly stand. The manifesto went up on 3 August 2026. There is a hand-drawn plan, a cost estimate, and no village yet. In October we walk Tuscia, Abruzzo and Puglia to fix that. The first residency — twenty people, paid, three months — is aimed at spring 2027, and it happens only if October goes well.
>
> You'll get two or three emails a year, and every one of them will contain something that actually happened.
>
> If you'd rather have a conversation than a newsletter, reply to this email. It goes to a person.
>
> — [NAME], [ROLE]

Three notes on why this copy and not the current copy:

- **"number 47"** (or whatever the real count is) is the cheapest trust signal you can build and you currently have none. It also converts the next visitor.
- **"if we don't write by 15 November, the trip went badly and we'll tell you that too"** — a falsifiable promise with a date. It costs nothing and it is the single strongest line you can write while owning nothing.
- The **letter is preserved but demoted.** "There is no form" was a beautiful principle that throws away every visitor who is interested-but-not-yet-committed. Keep the letter for the committed, catch everyone else.
- **Sign it with a human name.** No name, no conversion. This is not negotiable, and the whole page currently fails it.

---

## 6. The Log — replacing the Journal

**Rename `11 · Journal` → `11 · Log`.** A Journal implies essays that exist. A Log implies a record kept — which is what you have, and it converts *better*, because it is evidence rather than atmosphere. Delete all three current entries; `Field note · No. 03` in particular must go today (§4a).

**Rules for the section, enforced:**

- Reverse chronological, **every entry carries a real date** (`03.08.2026`, not `No. 03`)
- Every entry carries a status tag: `Done` / `Planned` / `Abandoned`. The `Abandoned` tag existing at all is what makes the other two believable.
- Every entry names **one thing that is not yet true.** That is the house rule and it is the entire credibility mechanism.
- No entry links anywhere unless the destination exists. If nothing to link, no link.
- Standing line under the section head: *"Everything below either happened or is dated. Nothing here is a plan wearing a past tense."*
- Cadence promise: *"Updated when something happens. Sometimes that means monthly, sometimes nothing for a season."*

**Five entries, in voice:**

---

**№ 05 · Planned — October 2026**
### Three regions, on foot
Tuscia, Abruzzo, Puglia — roughly thirty villages between them, walked rather than driven. We are counting the same four things in each: steps from the church to the bakery, how many houses are dark at nine at night, whether anyone under forty stayed, and what a ruin costs. We have not been yet. Everything on this page about Italian villages is, for now, a hypothesis with good manners.

---

**№ 04 · Done — August 2026**
### The numbers, written down for the first time
A briefing for investors and a first cost estimate: restoration, twenty beds, a kitchen that can actually feed twenty, and the boring half — insurance, permits, a road. Writing it down did what writing things down does, which is make the cheerful version impossible. We are not publishing the figure yet, because it is an estimate built on a building we have not stood in. When we have, we will publish both numbers side by side, including the gap.

---

**№ 03 · Done — August 2026**
### The plan, drawn by hand before we have the hill
A piazza in the middle, a long table beside it, work at the edges, gardens holding it together, everything inside a ten-minute walk. Drawn on paper, deliberately, before choosing a site — so that the site can argue with it. It will lose some of these arguments. The dotted circle is the only part we expect to survive intact.
*[Fig. 1 →]*

---

**№ 02 · Done — 05.08.2026**
### An account, and the first pictures
@postaisociety exists. It is not a marketing channel yet, because there is nothing to market — it is where the villages, the drawings and the arguments go while this is still being decided in public. Follow it if you want the unedited version; this page is the edited one.
*[@postaisociety →]*

---

**№ 01 · Done — 03.08.2026**
### The manifesto went up
This page is the first thing that exists. Not a village, not a company, not a lease — an argument, published under our own name so it can be held against us. What is true today: a plan on paper, a cost estimate, a trip booked for October, and two of us. What is not true today: everything else on this page. We would rather you knew that on the way in.

---

**Then, immediately after the Log and before the CTA, one line that does more for conversion than the entire manifesto:**

> The next entry should appear in November, after Italy. If it doesn't, ask us why — [hello@…]. We'd rather answer that than pretend.