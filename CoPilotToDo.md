# Clock-o-matic Development Roadmap

## Completed ✅

- [x] Core clock UI with hour/minute/second hands
- [x] Visual time blocks rendered as conic-gradient segments
- [x] Colored segment progress (gray for elapsed, color for remaining)
- [x] Draggable labels with collision detection and stagger logic
- [x] Label position persistence and manual drag offset storage
- [x] Alarm chimes with Web Audio API
- [x] Sound toggle with icon feedback
- [x] Per-presentation state persistence via Chrome Storage
- [x] Minimal mode (hide controls) and fullscreen mode
- [x] Draggable container with resize handles
- [x] Base gray progress ring showing overall schedule progress
- [x] Schedule anchoring to prevent segment movement at double speed
- [x] Accessibility: focus outlines, ARIA labels, keyboard navigation
- [x] Performance: reuse single AudioContext to avoid spam creation

## Pre-Publishing Checklist 🚀

- [ ] **Icons & Assets**: Create icon variants (16px, 32px, 48px, 128px, color + grayscale) for Chrome Web Store
- [ ] **Manifest Polish**: Verify manifest v3 compliance, check all permissions are justified and minimal
- [ ] **Screenshots**: Capture 2–4 screenshots of the clock in action for Chrome Web Store listing (1280×800 minimum)
- [ ] **Short Description**: Write a punchy 132-character tagline for the Web Store
- [ ] **Long Description**: Finalize the full Chrome Web Store product description (with emoji, features, use cases)
- [ ] **Privacy Policy**: Create a simple privacy policy (we only store per-presentation data locally; no external tracking)
- [ ] **Branding**: Verify brand name consistency (Clock-o-matic vs. Time-o-matic) and finalize logo
- [ ] **Version Bump**: Set manifest version to 1.0.0 for first release
- [ ] **CHANGELOG**: Document all features and fixes for initial release
- [ ] **Test Across Slides Variants**: Test on edit, present, and embed URLs to ensure persistence works
- [ ] **Browser Compatibility**: Confirm Chrome 88+ support and test on Edge if targeting Chromium broadly
- [ ] **Offline Fallback**: Verify graceful behavior when `chrome.storage` unavailable
- [ ] **Error Messaging**: Replace console logs with subtle user-facing notifications where critical

## Outstanding Issues & Future Enhancements

### High Priority (Pre-Publishing)

- [ ] **Help Overlay**: Add an in-app tutorial or help icon explaining drag, minimize, and resize gestures
- [ ] **Keyboard Shortcuts**: Display the keyboard shortcut (Alt+Shift+C / Ctrl+Shift+C) in a small UI element
- [ ] **Edge Cases**: Test with very long labels, very small/large windows, and rapid schedule changes
- [ ] **Label Overlap Refinement**: Current stagger logic (3 tracks) may overflow on extreme label counts; add 4th+ fallback or improve algorithm
- [ ] **Dark Mode**: Offer optional dark theme option in controls

### Medium Priority (First Update)

- [ ] **Preset Schedules**: Allow saving/loading common time block patterns (e.g., "Standup 15min + Break 10min")
- [ ] **Custom Fonts**: Let users adjust label font size or family
- [ ] **Alarm Sounds**: Offer multiple chime options (bell, tone, buzzer, etc.)
- [ ] **Segment Editing**: Allow editing individual block times/labels without rebuilding entire schedule
- [ ] **Time Display**: Optional digital time readout overlay on the clock
- [ ] **Export**: Option to export schedule as image or share schedule URL

### Low Priority (Nice-to-Have)

- [ ] **Theming**: CSS variables for quick color scheme swaps
- [ ] **Localization**: Multi-language UI (French, Spanish, German, Mandarin, etc.)
- [ ] **Analytics**: Opt-in usage stats (purely voluntary, no PII) to guide roadmap
- [ ] **Animations**: Smoother hand transitions, label fade-in, alarm pulse effects
- [ ] **Mobile Companion**: Companion web app or mobile app for remote timer control

---

## Code Health & Refactoring

- [ ] **Modularization**: Split `content.js` (~900 lines) into modules:
	- `ui.js` – DOM creation and styling
	- `clock.js` – Time calculations and hand updates
	- `schedule.js` – Block management and drawing
	- `persistence.js` – Chrome Storage logic
	- `audio.js` – Chime and sound logic
	- `events.js` – Click, drag, resize handlers
  
- [ ] **Testing**: Add integration tests with Playwright for:
	- Toggle on/off
	- Schedule create/clear/persist
	- Label drag
	- Alarm trigger
	- Mode switching (minimal/fullscreen)

- [ ] **Linting & Formatting**: Configure ESLint + Prettier for consistent code style

- [ ] **Documentation**: Add inline comments to complex sections (stagger logic, rotation anchoring, persistence ID parsing)

- [ ] **Type Safety**: Consider migrating to TypeScript or adding JSDoc for better IDE support

---

## Known Limitations

- Labels may overlap if more than 3–4 segments are placed extremely close together; user can manually drag to adjust
- Audio autoplay may be blocked on first interaction; users need to click the speaker icon once to enable
- Schedule state is browser-specific; not synced across devices
- Persistence relies on Slides URL stability; custom/embedded URLs may fall back to global defaults

---

## Release Notes for v1.0.0

**Initial Release**
- Full clock UI with real-time hands
- Customizable time block scheduling with colors
- Visual progress tracking (gray elapsed, colored remaining)
- Smart label positioning with collision avoidance
- Per-presentation state persistence
- Sound alarms with toggle
- Minimal and fullscreen presentation modes
- Draggable and resizable UI
- Full accessibility support (ARIA, keyboard nav, focus outlines)
- Free, donation-supported distribution
