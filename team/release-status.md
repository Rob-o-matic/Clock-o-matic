# Release Status — v1.0.0 — 2026-04-29

## Pre-Publishing Checklist

- [x] **Core features complete** — clock hands, colored segments, progress ring, alarms, drag/resize, minimal/fullscreen modes, per-presentation persistence
- [x] **Manifest version** — set to 1.0.0 in manifest.json
- [x] **Manifest V3 compliance** — service worker, correct permissions (activeTab, scripting, storage)
- [x] **Icon assets present** — icons/icon16.png, icon32.png, icon48.png, icon128.png all exist and are referenced correctly in both `icons` and `action.default_icon` blocks
- [x] **Privacy Policy drafted** — PRIVACY.md exists and content is accurate (see Privacy Policy section below)
- [x] **Branding consistency** — README.md contains no "Time-o-matic" occurrences; all references use "Clock-o-matic"; manifest name is "Clock-o-matic"
- [x] **Accessibility** — ARIA labels, keyboard navigation, focus outlines implemented
- [ ] **Icon visual QA** — 128px icon needs sign-off that it renders cleanly at store listing thumbnail resolution — owner: ux / qa
- [ ] **Screenshots** — 2–4 store screenshots at 1280×800 minimum not yet captured — owner: ux
- [ ] **Short description** — drafted below, needs final approval before pasting into developer dashboard — owner: release
- [ ] **Long description** — drafted below, needs final approval before pasting into developer dashboard — owner: release
- [ ] **Privacy policy URL** — PRIVACY.md must be hosted at a stable public URL and that URL entered in the developer dashboard — owner: release (15-minute task; see Privacy Policy section)
- [ ] **Console log cleanup** — debug logs added in "Debug: Add detailed logs for gear toggle…" commit must be removed or gated behind a `DEBUG = false` flag before submission — owner: dev / qa
- [ ] **Cross-URL smoke test** — clock must be verified on `/edit`, `/present`, and embed URLs; state must persist between edit and present modes; incognito/no-storage graceful no-op — owner: qa
- [ ] **CHANGELOG** — document all v1.0.0 features and fixes (can be done during release tagging, not a store blocker) — owner: release

---

## Store Listing Copy

### Short description (≤132 chars)

```
Visual timer for Google Slides. Colored time blocks, live countdown, and alarms — draggable, resizable, free.
```

Character count: 106 — within the 132-character limit.

### Long description

**Clock-o-matic — Visual Timer and Schedule for Google Slides**

Keep your presentations, workshops, and training sessions on time with Clock-o-matic, a lightweight Chrome extension that overlays a beautiful visual clock directly on any Google Slides presentation.

**Visual Schedule at a Glance**
Build a timed agenda in seconds: add blocks for each segment of your session (Intro, Activity, Break, Q&A), choose a color for each, and hit Start. The clock face fills with colored arcs representing your schedule. As time passes, each arc transitions to gray so you always know at a glance how much time remains in the current block and across the whole session.

**Live Countdown and Smart Alarms**
Clock-o-matic runs in real time against your system clock, so it stays perfectly in sync whether you are presenting or preparing. A chime plays automatically at the end of each block — no more watching the clock yourself. Toggle sound on or off with a single click.

**Flexible Overlay**
The clock floats above your slides and stays out of the way until you need it. Drag it anywhere on screen, resize it from compact to large with corner handles, and switch to minimal mode to hide controls during a live presentation. A fullscreen mode fills the display for large-room use.

**Per-Presentation Persistence**
Every setting — block durations, labels, colors, position, size, sound preference — is saved automatically per Google Slides deck using Chrome's local storage. Switch between decks and find each clock exactly where you left it.

**Free and Donation-Supported**
Clock-o-matic is free to use. If it saves your sessions, consider buying the developer a coffee to support continued development.

**Perfect for:**
- Teachers and educators managing lesson time
- Facilitators running workshops or retrospectives
- Conference speakers tracking talk segments
- Trainers with structured agenda blocks
- Anyone who presents with Google Slides and needs visible time management

No account required. No data leaves your device. Works offline.

---

## Privacy Policy

**Accuracy review:** PRIVACY.md is accurate. It correctly states that:
- All data (clock position, size, display mode, time block configurations, alarm schedule, sound preferences, label positions) is stored **locally on the device only** — Chrome extension uses `storage.local`; web app uses `localStorage`.
- Data is **never transmitted** to any server or third party.
- The only external interaction is the optional "Buy me a coffee" link, which navigates to a third-party site under their own privacy policy.
- Permissions listed (`activeTab`, `scripting`, `storage`) match those declared in manifest.json.

No changes to PRIVACY.md are required.

**Stable public URL (action required):**
The Chrome Web Store developer dashboard requires a publicly accessible privacy policy URL. The recommended approach is to use the raw GitHub URL:

```
https://raw.githubusercontent.com/Rob-o-matic/Clock-o-matic/main/PRIVACY.md
```

If the GitHub repository is hosted under a different owner or organisation, replace `Rob-o-matic` with the correct username. If GitHub Pages is enabled for the repo, a cleaner rendered URL is:

```
https://rob-o-matic.github.io/Clock-o-matic/PRIVACY
```

**Action:** Confirm the correct public URL and paste it into the Privacy Policy field of the Chrome Web Store developer dashboard before submission.

---

## Blockers before submission

1. **Console log cleanup** (dev / qa) — debug `console.log` calls from the gear-toggle debugging commit must be removed or gated. QA smoke tests should run against the cleaned build.
2. **Privacy policy URL** (release) — PRIVACY.md must be reachable at a stable public URL and entered in the developer dashboard. ~15 minutes to resolve once hosting is confirmed.
3. **Icon visual QA** (ux / qa) — 128px icon needs a final visual pass at store thumbnail resolution. A broken or clipped icon causes instant rejection.
4. **Screenshots** (ux) — at least 2 store screenshots at 1280×800 are required by the Web Store; none are in the submission package yet.
5. **Cross-URL smoke test** (qa) — must pass on `/edit`, `/present`, and embed URLs before submission; also requires a graceful no-op test in incognito with storage blocked.

## Ready to ship

- [x] Manifest v1.0.0, MV3 compliant
- [x] All core features implemented and functional
- [x] Privacy policy content accurate — hosting URL to be confirmed
- [x] Brand name consistent across all source files (Clock-o-matic)
- [x] Store listing copy drafted (short + long description above)
- [ ] Console logs cleaned — pending dev
- [ ] Icon QA passed — pending ux / qa
- [ ] Screenshots captured — pending ux
- [ ] Privacy policy URL confirmed and entered in dashboard — pending release
- [ ] Cross-URL smoke test passed — pending qa
