# QA Report — Sprint 1 (2026-04-29)

## 1. Coverage Summary

### Automated (Playwright — `tests/clock.spec.js`)

| Area | Tests | Status |
|---|---|---|
| Clock face visibility & dimensions | 2 | Automated |
| Hand presence (hour, minute, second) | 5 | Automated |
| Hand rotation on load | 1 | Automated |
| Second-hand updates after tick | 1 | Automated |
| Debug readout (test_clock.html) | 1 | Automated |
| Schedule: conic-gradient appears on disk | 1 | Automated |
| Schedule: label rendered on clock face | 1 | Automated |
| Clear: timer disk background reset | 1 | Automated |
| Clear: block labels removed | 1 | Automated |
| Sound toggle: ARIA label | 1 | Automated |
| Sound toggle: icon switches on click | 1 | Automated |
| Sound toggle: icon restores on double-click | 1 | Automated |
| Sound toggle: keyboard (Enter) activation | 1 | Automated |
| Gear icon: ARIA label | 1 | Automated |
| Gear icon: toggles `minimal-mode` class | 1 | Automated |
| Gear icon: settings hidden in minimal-mode | 1 | Automated |
| Minimal mode: controls visible in full mode | 1 | Automated |
| Minimal mode: entering hides controls | 1 | Automated |
| Minimal mode: exiting reveals controls | 1 | Automated |
| Resize handles: total count = 8 | 1 | Automated |
| Resize handles: all 4 corners present | 1 | Automated |
| Resize handles: all 4 edges present | 1 | Automated |
| Add Row: appends new input row | 1 | Automated |
| Start button default label "Start!" | 1 | Automated |
| localStorage written after schedule set | 1 | Automated |

**Total automated tests: 27**

### Not yet automated (requires a real Chrome extension context or manual interaction)

- Extension load/unload lifecycle (content-script injection)
- `chrome.commands` keyboard shortcut (Alt+Shift+C)
- Cross-URL persistence (edit → present → embed URLs)
- Incognito mode with storage blocked
- Drag and resize with mouse (integration-level)
- Alarm/chime audio firing after block expires
- Label drag and offset persistence

---

## 2. Edge Cases Identified

### Cross-URL Persistence (manual testing required in Chrome)

`getPresentationId()` in `content.js` extracts the presentation ID from the URL path and uses it as the `localStorage` key prefix (`clock_state_<id>`).

**Identified edge cases:**

1. **`/edit` vs `/present` share the same ID** — both URL patterns contain `/d/<id>/`, so the same state key is used. This is the correct behaviour (one clock state per presentation), but must be verified end-to-end: set a schedule on `/edit`, then switch to `/present` and confirm the arc and alarmQueue survive.

2. **Embed URL (`/embed/...`)** — embed URLs do not always use the `/d/<id>/` pattern. The fallback in `getPresentationId()` attempts a generic `parts.indexOf('d')` search; this may match an unrelated path segment and produce a spurious ID, or fall through to `'global_default'`, which collides across presentations. **This should be tested against at least two different embed URLs.**

3. **`global_default` collision** — when the URL does not match any known pattern (e.g., a local `file://` URL used during development), all state is keyed under `'global_default'`. Opening `index.html` in a browser and setting a schedule will write to this key; if the extension is later installed and used without a matching presentation URL it will also hit `global_default`. This could surface stale schedule data unexpectedly.

4. **Very long presentation IDs** — Google sometimes issues presentation IDs that are 44+ characters. Combined with the key prefix, the `localStorage` key can reach ~60 characters. No known limit issue, but worth noting for completeness.

### Incognito with Storage Blocked

The extension requests the `"storage"` permission (Manifest V3 `chrome.storage`), but `content.js` as shipped falls back to `localStorage` (the `storageGet`/`storageSet` wrapper). `localStorage` is available in incognito by default, so state will persist for the lifetime of the incognito window. However:

- If a user has blocked cookies/site data for Google Docs, `localStorage` throws. The `try/catch` inside `storageGet`/`storageSet` silently swallows the error, which is the correct behaviour — the clock still works, state just is not persisted. **This silent-fail should be confirmed manually:** open an incognito window, block storage for `docs.google.com`, load a presentation, and verify the clock renders without JS errors.

- The `chrome.storage` API (used in the background service worker) is *not* blocked by the incognito storage toggle, but `content.js` does not use it directly, so there is no risk of a hard crash. Confirm this is still the case after any future refactor that might try to call `chrome.storage.local` from the content script.

### Other Edge Cases Found During Code Review

| # | Finding | Severity |
|---|---|---|
| E1 | `alarmQueue` timestamps are filtered to `> (now - 2000)` on restore, but a schedule restored immediately after a tab reload could fire a stale chime within the 2-second window. | Low |
| E2 | `toggleMinimalModeWithScaling()` auto-shrinks the container if it overflows `window.innerHeight - 24px`. On very short screens (< ~400 px tall) this could push `currentScale` to the minimum of 0.5, making the clock extremely small with no way to grow it back other than refreshing. | Low |
| E3 | `setSchedule()` sets `btnSetBlock.textContent` to `'Reset!'` on subsequent calls, but `'Start!'` is also set unconditionally on line 781 (`btnSetBlock.textContent = 'Start!'`). After calling `setSchedule()` a second time the label correctly becomes `'Reset!'` because `isActive` is truthy; however if the page reloads between calls the label reverts to `'Start!'` regardless of saved state, which may confuse users who had an active schedule. | Low |
| E4 | `getStartRotation()` reads `scheduleStartRotation` from module state; if `restoreState()` completes asynchronously (it is callback-based) and the clock loop fires before the callback, the first tick draws with the wrong start rotation. The `setTimeout(() => toggleMinimalModeWithScaling(false), 0)` at the bottom of `content.js` partially mitigates this by deferring UI updates, but the race window still exists. | Medium |
| E5 | Label stagger logic uses a hardcoded threshold of 22 degrees. When multiple short blocks (< 4 minutes each) are adjacent, the algorithm only has three tracks (Mid, Out, In) before it cycles back to Out. A fourth overlapping label will still collide. This is a known deferred issue per `sprint.md`. | Low (documented) |
| E6 | `console.log` and `console.warn` calls remain in `content.js` (lines 188, 198, 202, etc.). Per Sprint 1 acceptance criteria these must be removed or gated before submission. | Medium |
| E7 | `maximizeIcon` is referenced in the DOM setup code but is always `null` because no element with `id="btn-maximize"` exists in `createClockHTML()`. The code guards against this with `if (!el) return`, so there is no crash, but the dead code adds maintenance noise. | Low |

---

## 3. Manual Test Checklist — Chrome Extension Behaviour

Run these tests in Chrome with the unpacked extension loaded (`chrome://extensions` → Load unpacked).

### 3.1 Extension Load

- [ ] Navigate to any `https://docs.google.com/presentation/*` URL
- [ ] Clock widget appears at top-right of the page within 1 second
- [ ] No JS errors in the DevTools console on load
- [ ] Widget does **not** appear on non-matching URLs (e.g., Google Drive home)

### 3.2 Clock Display

- [ ] Clock face shows hour, minute, and second hands
- [ ] Second hand advances every second
- [ ] Hour and minute hands are positioned correctly for the current time
- [ ] Clock numbers 1–12 are all legible at default scale

### 3.3 Schedule Workflow

- [ ] Open settings panel via gear icon
- [ ] Add at least two blocks with labels and distinct colours
- [ ] Click "Start!" — coloured arcs appear on the clock face, settings panel collapses
- [ ] Block labels are visible on the clock face
- [ ] A label can be dragged to a new position; position is preserved after page reload
- [ ] When a block expires the clock face flashes red and a chime plays (if sound is on)
- [ ] Click "Clear" — arcs and labels are removed, timer disk resets

### 3.4 Sound Toggle

- [ ] Sound icon defaults to "on" state
- [ ] Clicking the icon switches to "off" state (muted icon, reduced opacity)
- [ ] Clicking again restores "on" state
- [ ] With sound on, clicking the toggle plays a brief chime

### 3.5 Gear / Settings Panel

- [ ] Clicking the gear icon collapses the settings panel (minimal mode)
- [ ] Clicking again expands it
- [ ] Pressing Enter or Space while the gear is focused has the same effect (keyboard navigation)

### 3.6 Drag & Resize

- [ ] Widget can be dragged to any screen position
- [ ] Position is restored after page reload
- [ ] Dragging a corner resize handle scales the widget up and down
- [ ] Scale is restored after page reload
- [ ] Widget cannot be scaled below 0.5× or above 5×

### 3.7 Cross-URL Persistence

- [ ] Set a schedule on the `/edit` URL of a presentation
- [ ] Reload the same `/edit` URL — schedule state and arc are restored
- [ ] Open the same presentation on a `/present` URL — schedule state is present
- [ ] Open the same presentation on an `/embed` URL — schedule state is present (or note if `global_default` is used instead)
- [ ] Open a **different** presentation — clock starts fresh with no previous schedule

### 3.8 Incognito / Storage Edge Cases

- [ ] Open an incognito window and navigate to a Google Slides presentation
- [ ] Clock appears and functions normally
- [ ] Set a schedule; verify it persists within the same incognito session
- [ ] Close and reopen the incognito window — state should **not** persist (incognito localStorage is cleared on window close)
- [ ] Block site data for `docs.google.com` (Settings → Privacy → Site Settings → `docs.google.com` → Delete data / Block) and confirm no JS errors when the clock loads

### 3.9 Keyboard Shortcut

- [ ] Press Alt+Shift+C (Windows/Linux) or Ctrl+Shift+C (Mac) while on a matching page
- [ ] Clock toggles visible/hidden

### 3.10 Console Log Cleanup (Sprint 1 item)

- [ ] Open DevTools Console on a matching page
- [ ] Confirm **no** `console.log` debug output appears during normal use (clock tick, gear toggle, schedule set)
- [ ] Any remaining `console.warn` or `console.error` calls indicate genuine errors, not debug traces

---

## 4. Accessibility Gaps

The following gaps were identified by reading `index.html`, `content.js`, and `styles.css`. None are store-submission blockers today, but they are worth addressing before a wider rollout.

### 4.1 Missing `role` and `aria-label` on resize handles

All eight `.resize-handle` elements are interactive (they listen for `mousedown` to trigger resize logic) but have no `role`, `aria-label`, `tabindex`, or keyboard event handlers. A keyboard-only user cannot resize the widget at all.

**Recommendation:** Add `role="separator"` or `role="button"` with appropriate `aria-label` (e.g., "Resize from top-left corner") and keyboard handlers to each handle, consistent with the pattern already applied to the gear, sound, and donation icons.

### 4.2 Icon-only controls have `role="button"` but the click target is small

`#case-sound-toggle`, `#donation-link`, and `#settings-gear` are 28×28 px. WCAG 2.5.5 (AAA) recommends 44×44 px touch targets; WCAG 2.5.8 (AA in WCAG 2.2) recommends 24×24 px minimum. The icons meet the 24 px floor but fall short of the 44 px recommendation. This matters on touchscreen Chromebooks.

**Recommendation:** Increase the clickable area via padding or a pseudo-element, or bump the icon container to at least 36×36 px as a middle ground.

### 4.3 Color-only schedule segments

Colored arcs on the timer disk are the sole visual indicator of which block is active. Users with color-vision deficiencies (affecting roughly 8% of males) may not be able to distinguish adjacent blocks.

**Recommendation:** Consider adding a subtle pattern fill (hatching or dotted overlay) per segment, or ensure the text label is always visible (not optional) so the arc color is not the only differentiator.

### 4.4 Clock face lacks an `aria-label` or `role="img"`

The `.clock-face` div renders the analog clock but has no accessible name. Screen readers will announce it as an unnamed group.

**Recommendation:** Add `role="img"` and a dynamic `aria-label` that announces the current time (e.g., `aria-label="Clock showing 3:42 PM"`), updated each tick by `updateClockHands()`.

### 4.5 `<input type="color">` has no visible label

Each `.block-row` contains a color picker (`<input type="color" class="inp-color">`) with no `<label>` element and no `aria-label` attribute. Screen readers will announce it as an unnamed color input.

**Recommendation:** Add `aria-label="Block colour"` (or associate a `<label>` element) to each color input when a row is rendered in `renderInputRows()`.

### 4.6 Focus styles on icons are only triggered by `:focus-visible`

The CSS rule `#case-sound-toggle:focus-visible { outline: 2px solid #42A5F5; }` is correct for pointer users, but the opacity of these icons defaults to `0` (only becoming visible on container hover). A keyboard user who tabs to the sound toggle without hovering will see the focus ring but the icon itself may be invisible.

**Recommendation:** Ensure icon opacity is forced to a visible level (e.g., 0.6 minimum) whenever the element receives focus, not only when the parent is hovered.

### 4.7 No `lang` attribute on `index.html`

`index.html` has `<html lang="en">` — this is correct. However the dynamically injected widget HTML (generated by `createClockHTML()`) is inserted into the host page's DOM, which for Google Slides is `<html lang="en">`. No action needed; this is a note confirming the host page sets the language correctly.

### 4.8 `<noscript>` message in `index.html` only

The `<noscript>` tag in `index.html` tells users that JavaScript is required. The Chrome extension version does not have this fallback path (the content script either runs or doesn't), so this is only relevant to the standalone web page. No gap; noted for completeness.

---

## 5. Summary of Sprint 1 QA Findings

| Priority | Item | Action |
|---|---|---|
| Must fix before submission | `console.log` debug statements remain in `content.js` (E6) | Dev to remove or gate behind `DEBUG` flag |
| Must fix before submission | Cross-URL smoke test for `/present` and `/embed` not yet run | QA to run Section 3.7 checklist in Chrome |
| Must fix before submission | Incognito + blocked storage test not yet run | QA to run Section 3.8 checklist |
| Should fix soon | Missing accessible names on resize handles (4.1) | Dev / UX |
| Should fix soon | Race condition in `restoreState` + clock loop start (E4) | Dev |
| Nice to have | Color-only block differentiation (4.3) | UX |
| Nice to have | Small icon touch targets (4.2) | UX |
| Low / deferred | `global_default` localStorage key collision (E2, E3) | Dev v1.1 |
| Low / deferred | Dead code: `maximizeIcon` always null (E7) | Dev cleanup |
