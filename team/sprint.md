# Sprint 1 Plan — 2026-04-29

## Goal
Ship the five blockers standing between the current codebase and a Chrome Web Store submission so v1.0.0 can be submitted this sprint.

## Selected Items

### Icons & Assets — create and verify all icon variants
- **Why**: manifest.json already references icons/icon16.png through icon128.png and those files exist, but the Web Store reviewer will also check that the 128px icon renders cleanly at store resolution; a missing or broken icon is an instant rejection. This needs a visual QA pass before submission.
- **Acceptance criteria**:
  - [ ] All four sizes (16, 32, 48, 128 px) render without distortion or transparency artifacts at their native size
  - [ ] 128px icon looks acceptable as the store listing thumbnail (no clipping of key artwork)
  - [ ] Icons are referenced correctly in both `icons` and `action.default_icon` blocks of manifest.json (already the case — verify no regression)
- **Owner**: ux / qa

### Store Listing Copy — short description, long description, and branding check
- **Why**: These are required fields in the Chrome Web Store developer dashboard; the extension cannot be submitted without them. Branding inconsistency (Clock-o-matic vs Time-o-matic) must be resolved first so copy is consistent everywhere.
- **Acceptance criteria**:
  - [ ] Brand name is confirmed as "Clock-o-matic" and every occurrence of "Time-o-matic" in source files, README, and listing copy is updated
  - [ ] Short description is 132 characters or fewer and communicates the core value proposition
  - [ ] Long description (for Web Store) is drafted, covers key features and use cases, and is stored in a file ready to paste into the developer dashboard
  - [ ] README reflects the final brand name and description
- **Owner**: release / ux

### Privacy Policy — publish and link
- **Why**: PRIVACY.md already exists in the repo. The Chrome Web Store requires a publicly accessible privacy policy URL for any extension that uses storage. The file needs to be hosted (e.g., as a GitHub Pages page or raw GitHub URL) and that URL entered in the developer dashboard before submission.
- **Acceptance criteria**:
  - [ ] PRIVACY.md content is reviewed and accurately states that only local per-presentation data is stored and no data leaves the device
  - [ ] A stable public URL for the privacy policy is confirmed (GitHub raw link or hosted page)
  - [ ] That URL is noted in team documentation / release checklist so it can be pasted into the developer dashboard
- **Owner**: release

### Console Log Cleanup — remove debug logging before submission
- **Why**: content.js contains 9 console.log/warn/error calls added during recent debugging work (per git log: "Debug: Add detailed logs for gear toggle and settings panel state"). Shipping with debug logs looks unprofessional and can expose internal state to any user with DevTools open. Replace critical-path errors with a subtle silent-fail or, where appropriate, a user-visible toast.
- **Acceptance criteria**:
  - [ ] All `console.log` debug statements introduced in recent commits are removed or gated behind a `DEBUG` flag that is `false` by default
  - [ ] Any `console.error` calls that indicate a real failure either remain (acceptable) or are replaced with a non-intrusive user-facing indicator
  - [ ] No regressions in clock render, schedule persistence, or sound toggle after cleanup
- **Owner**: dev / qa

### Cross-URL Smoke Test — edit, present, and embed modes
- **Why**: The extension matches on `https://docs.google.com/presentation/*`, which covers edit (`/edit`), present (`/present`), and embed URLs. Persistence uses the URL as a key; untested URL variants are a common source of last-minute store rejection feedback and user one-star reviews.
- **Acceptance criteria**:
  - [ ] Clock loads and displays correctly on a `/edit` URL
  - [ ] Clock loads and displays correctly on a `/present` (fullscreen presentation) URL
  - [ ] Schedule state set in `/edit` persists and is readable when switching to `/present` for the same presentation
  - [ ] No JS errors in the console on any of the three URL types
  - [ ] Graceful no-op (no crash, no blank page) if `chrome.storage` is unavailable (incognito with storage blocked)
- **Owner**: qa

## Deferred

- **Help Overlay / in-app tutorial** — valuable for new users but not a store submission blocker; defer to v1.1.0
- **Keyboard Shortcut UI hint** — shortcut works today; surfacing it in the UI is a polish item for post-launch
- **Label Overlap Refinement (4th-track fallback)** — known limitation documented; acceptable for v1.0.0 given users can drag labels manually
- **Dark Mode** — medium-effort UX feature; schedule for first post-launch update
- **CHANGELOG file** — useful but not checked by store reviewers; can be created during release tagging
- **Browser Compatibility on Edge** — Chrome is the primary target; Edge Chromium compatibility is a stretch goal for v1.1.0
- **Modularization of content.js** — significant refactor with regression risk; defer to post-launch code health sprint
- **ESLint / Prettier setup** — tooling improvement; no user impact before launch
- **Playwright integration tests** — high value but takes more than one sprint to set up safely; defer to v1.1.0

## Dependencies & risks

- **Icons depend on UX sign-off before QA can verify**: if the 128px icon needs a redesign the asset work could slip; confirm current artwork is final before the sprint starts
- **Privacy policy URL depends on a hosting decision**: if GitHub Pages isn't already configured, someone needs to enable it or choose an alternative host; this is a 15-minute task but must not be forgotten
- **Console log cleanup must land before the cross-URL smoke test**: QA should run smoke tests against the cleaned build, not the debug build
- **Store listing copy is on the critical path for submission**: the developer dashboard cannot be completed without it, so this item gates the release owner's submission work
- **v1.0.0 version is already set in manifest.json**: no version bump needed, but double-check that the version in the developer dashboard matches before submitting
