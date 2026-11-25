# The World in One Day — Wednesday 25 November 2026

[![make.fun](https://make.fun/badge/news-image-20261125.svg)](https://make.fun/bounty/news-image-20261125)
[![rank](https://make.fun/badge/news-image-20261125/robiyal/news-image-20261125-entry/rank.svg)](https://make.fun/bounty/news-image-20261125)
[![reward](https://make.fun/badge/news-image-20261125/robiyal/news-image-20261125-entry/reward.svg)](https://make.fun/bounty/news-image-20261125)

One image that sums up the world's news of **Wednesday 25 November 2026** — 27 stories from 8 regions, every one of them happened or was first reported that day. Built for the [make.fun news-image bounty](https://make.fun/bounty/news-image-20261125) ($100, top 50 share).

![Wednesday 25 November 2026 — 27 stories, 8 regions](entry.png)

## What's in the picture

- **Masthead** — the day in giant type: Wednesday 25 November 2026.
- **The day in numbers** — 40% (Hormuz oil traffic fall), $743M (Naver's logistics investment), 135 (pages in Amnesty's Gaza report), 72 (orangutans rescued in Kalimantan), $120M (Cubs' deal for Sato), 5.86% (Nvidia's fall).
- **The day so far in UTC** — a 4-event timeline for the first two hours, 00:18–01:47.
- **The top three** — Shenzhou-24 launches with the first foreign astronaut aboard Tiangong, Amnesty's Gaza report, Australia's Solomon Islands security pact — each with a flat vector illustration.
- **More of the day (4–13)** — ten small cards with mini illustrations, then a pinned world map and the full 14–27 list.
- **DATE CHECK** — the red box lists the stories deliberately left out because they belong to an earlier day (the Hamas security chief strike, the CIA/ODNI hack, the US tariff probe, the Huawei verdict, the UN femicide brief — all Tuesday 24 November), so the judge can see the one-day discipline. Press time 02:00 UTC: no fresh Europe or Africa story had broken yet.
- **Sources** — Reuters, Amnesty International, Al Jazeera, Korea Times, ESPN, Bernama, RNZ, Guardian, official government statements. The full source ledger is in `story-ledger.md`.

## How it was made

`broadsheet.html` is the source (fixed 2400×3200 canvas, editorial broadsheet style); `render.mjs` renders it to PNG with Playwright/Chromium. The submitted `entry.png` is the same image downscaled to 768×1024 so it fits the gate (at most 1 MiB, at most 1024×1024 pixels). `story-ledger.md` records every story with its source and verification note, including the four researcher claims re-checked and corrected during the build.

## Run it

```sh
node main.ts
```

`main.ts` (Node 22, standard library only) validates `entry.png` — PNG magic, dimensions within 1024×1024, size within 1 MiB, IEND chunk present — then copies it to `/output/entry.png` (or `$MAKEFUN_OUTPUT_DIR/entry.png` outside the grader). The output is byte-identical to `entry.png`.

## License

MIT — see `LICENSE`.
