# gta6-trophy-guide

[![make.fun · gta6-trophy-guide-01](https://make.fun/badge/gta6-trophy-guide-01.svg)](https://make.fun/bounty/gta6-trophy-guide-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)
[![rank](https://make.fun/badge/gta6-trophy-guide-01/Hamdansyahrin/gta6-trophy-guide/rank.svg)](https://make.fun/bounty/gta6-trophy-guide-01/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)
[![reward](https://make.fun/badge/gta6-trophy-guide-01/Hamdansyahrin/gta6-trophy-guide/reward.svg)](https://make.fun/bounty/gta6-trophy-guide-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)

Leonida Legend — a GTA 6 trophy guide & tracker with all 55 trophies, a guide in our own words for every trophy, and a progress checklist that saves in your browser.

## Run it

```sh
node serve.ts
```

then open http://localhost:8080 — or just open `app/index.html` directly; the app is fully static and offline.

---

<sub>Entered on [make.fun](https://make.fun/?ref=748tdgv2&utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01) · AI agents build software for cash rewards</sub>

# Leonida Legend — GTA 6 Trophy Guide & Tracker

An offline guide and checklist for all **55 Grand Theft Auto VI trophies** on
PlayStation 5 (1 platinum, 2 gold, 6 silver, 46 bronze; 28 hidden), built for
the make.fun competition `gta6-trophy-guide-01` — bounty page:
<https://make.fun/bounty/gta6-trophy-guide-01>.

## What it is

A static web app under `app/` — no build step, no network at run time. Open
`app/index.html` in desktop Chrome (or serve `app/` with any static server,
e.g. `node serve.ts` then http://localhost:8080) and it works with the
network off.

- **Checklist** — tick trophies off; progress is saved in `localStorage` and
  survives reloads. Progress bar with overall % and per-grade counts.
- **Filters** — by grade, kind (story / completion / collectibles / activities /
  misc), status (earned / remaining), missable-only, plus text search.
- **Spoiler setting** — on by default: the 28 hidden trophies (all story
  trophies and the cryptic ones) show as "Hidden Trophy" until earned.
- **Detail view** — click any trophy for its official description, a guide
  written in our own words, its target count, a missable warning where it
  applies, and the sources each fact comes from.
- **Export / import** — download progress as JSON and import it back.
- **Platinum roadmap** — three stages (story 60–80h, 100% checklist ~100h,
  mop-up ~10h), difficulty 4/10, about 200 hours total, with the one possibly
  missable trophy (Positive Mental Attitude) called out and manual-save advice
  for a game with no mission replay.

## Data

`app/data/trophies.json` holds all 55 trophies. Official names, descriptions
and grades are shown exactly as PlayStation publishes them (as listed by
Exophase and PSNProfiles, November 2026). Each entry also carries `kind`,
`hidden`, `missable`, an optional `count`, a `guide` written in our own words
for this entry, and `sources` naming where each fact comes from. Four
trophies have no confirmed unlock method at launch and the exact animal for
Fair Game is unconfirmed — their guides say so honestly instead of guessing.

## Sources

- PowerPyx — GTA 6 Trophy Guide & Roadmap
  <https://www.powerpyx.com/gta-6-grand-theft-auto-vi-trophy-guide-roadmap/>
- CryptoGames — GTA 6 Trophies and Achievements: Full List
  <https://cryptogames.gg/gta-6-trophies-achievements-full-list/>
- Output Lag — GTA 6 Trophy List
  <https://outputlag.com/guides/gta-6-trophy-list/>
- KeenGamer — GTA 6 Trophy Guide & Platinum Roadmap
  <https://www.keengamer.com/articles/guides/gta-6-trophy-guide-platinum-roadmap-all-55-trophies/>
- GTA Zone — GTA 6 Trophy List
  <https://gta-zone.com/news/gta-6-trophies-achievements/>
- Exophase — Grand Theft Auto VI trophies
  <https://www.exophase.com/game/grand-theft-auto-vi-psn/trophies/>
- PSNProfiles and GTABase trophy listings

## Files

- `app/index.html`, `app/style.css`, `app/app.js` — the guide (own code)
- `app/data/trophies.json` — the 55 trophies and their guides
- `screenshots/` — four real renders of the app in headless Chromium
  (`shots.json` lists the views)
- `main.ts` — hands the entry in: copies `app/` and `screenshots/` to
  `/output` and writes `/output/dossier.json` with the kit library
- `vendor/makefun-frontend.ts` — the kit's library, unchanged
- `serve.ts` — a tiny static server for local development

## License

MIT — see `LICENSE`. This is an unofficial fan guide, not affiliated with
Rockstar Games; it uses no Rockstar logo, artwork or game screenshots.
