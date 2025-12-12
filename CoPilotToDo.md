# CoPilot To-Do

- [x] Performance: reuse a single `AudioContext` (or debounce creation) to avoid creating one per chime; consider fallback when autoplay is blocked.
- [ ] UX polish: add explicit on-screen help/tooltips for drag/minimize gestures; document keyboard shortcut inside UI.
- [x] Persistence: harden presentation-id parsing for Slides variants and handle offline/embedded cases gracefully.
- [x] Error handling: guard `chrome.storage` and messaging calls with user-facing notifications instead of silent console logs.
- [x] Accessibility: ensure focus outlines, keyboard navigation to controls, and ARIA labels for icons; provide high-contrast option.
- [ ] Styling: move inline SVG/icon sizing and inline styles into CSS; consider CSS variables for theming.
- [ ] Code health: modularize `content.js` into smaller files (UI build, state, audio, schedule logic) and add comments/tests around the staggered label logic.
- [ ] Testing: add basic integration tests (e.g., playwright) for toggle, schedule set/clear, and persistence across reloads; add linting/formatting (ESLint + Prettier).
- [ ] Packaging: add icons at multiple sizes and a short publish checklist (versioning, changelog, Chrome Web Store assets).
- [ ] Security/permissions: confirm `activeTab` and `scripting` are the minimal required; avoid unnecessary host permissions.
