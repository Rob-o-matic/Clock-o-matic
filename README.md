# Time-o-matic (Google Slides Clock)

A Chrome extension that overlays a visual schedule clock directly inside Google Slides. Click the toolbar icon or use the shortcut to toggle a draggable clock that shows colored time blocks, ticking hands, alarms, and a minimal or fullscreen presentation mode.

## What it does
- Injects a floating clock UI on Slides (`docs.google.com/presentation/*`).
- Lets you add labeled time blocks (minutes + color) that render as a conic gradient ring on the clock face.
- Plays a short chime when each block completes; sound can be toggled on/off.
- Supports quick modes: minimal mode (hide controls), maximized mode (fullscreen overlay), and drag-to-reposition with per-presentation persistence.
- Saves state (position, visibility, mode, rows, active blocks, alarms, sound) per presentation via `chrome.storage.local`.
- Provides a "Buy me a coffee" link and toggleable sound icon with hover auto-hide.

## Controls
- **Toggle extension**: Click the extension icon or press the command shortcut (`Alt+Shift+C`, macOS `Ctrl+Shift+C`).
- **Add blocks**: Use `+` to insert rows (minutes, label, color), then **Set Visual Schedule**.
- **Clear**: Removes current blocks/alarms.
- **Sound toggle**: Speaker icon on the clock case.
- **Fullscreen**: Maximize icon (toggles maximize/minimize).
- **Minimal mode**: Click the clock body (when not dragged) to hide controls.
- **Drag**: Drag the container (not while maximized) to reposition; position persists per deck.

## Installation (unpacked)
1. Clone or download this repo.
2. Open Chrome → `chrome://extensions`.
3. Enable **Developer mode** (top right).
4. Click **Load unpacked** and select the project folder.
5. Pin the extension if desired. Use the icon or shortcut to toggle on a Slides deck.

## Files
- `manifest.json` — Manifest V3, permissions (`activeTab`, `scripting`, `storage`), background service worker, command binding.
- `background.js` — Handles toolbar click and keyboard command; sends `toggle_clock` to the active Slides tab.
- `content.js` — Injected UI, clock logic, alarms, schedule drawing, persistence, drag/minimize/maximize behaviors.
- `styles.css` — Styling for the clock, labels, controls, modes, and animations.

## Notes & limitations
- Designed specifically for Google Slides pages; ignored elsewhere.
- Audio uses the Web Audio API per alarm; some browsers may block autoplay if the page has never received user interaction.
- Storage is per presentation id; if Slides URL format changes, persistence may fall back to a global default.
- No tests or linting are currently included.
