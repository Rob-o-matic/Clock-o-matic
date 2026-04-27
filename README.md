
# Clock-o-matic


Clock-o-matic is available as both a Chrome extension for Google Slides **and** as a standalone web app you can use in any browser!

**Note:** The Chrome extension is not published on the Chrome Web Store yet. You can use the web version immediately, or load the extension manually as described below.

## Web Version

Try the web version instantly at:

**https://rob-o-matic.github.io/Clock-o-matic/**

No installation required. All features work in your browser, and your settings are saved locally.

## Chrome Extension

A Chrome extension that brings a beautiful, interactive visual timer to Google Slides. Perfect for presentations, training sessions, workshops, and any scenario where you need to display time blocks with visual progress tracking.


## Features (Both Versions)

✨ **Visual Time Blocks**
- Create a schedule with labeled time segments, each with its own color
- Watch as colored blocks rotate around the clock face, showing elapsed time in gray and remaining time in color
- Perfect for presenting agendas, lesson plans, or workshop itineraries

⏰ **Real-Time Clock**
- Displays hour, minute, and second hands synchronized to your system time
- Visual base ring shows overall schedule progress at a glance
- Draggable, resizable, and toggles between minimal and fullscreen modes

🔔 **Smart Alarms**
- Plays a pleasant chime at the end of each time block
- Toggle sound on/off with a single click
- Alarms fire even if you switch tabs or scroll your slides

💾 **Per-Presentation Persistence**
- All settings (position, size, blocks, alarms) auto-save and restore per Google Slides deck
- Switch between presentations and find your clock exactly where you left it
- Label positions are preserved across sessions

📱 **Flexible Display Modes**
- **Minimal mode**: Hide controls to focus on the clock display during presentation
- **Fullscreen mode**: Maximize the clock to dominate your screen for large rooms
- **Draggable**: Reposition anywhere on the slide with smooth drag-and-drop
- **Resizable**: Scale from compact to large with corner/edge resize handles


## How to Use

### Web App
1. Go to [https://rob-o-matic.github.io/Clock-o-matic/](https://rob-o-matic.github.io/Clock-o-matic/)
2. Enter your time blocks:
   - **Minutes**: Duration of each segment
   - **Label**: Name of the segment (e.g., "Intro", "Q&A", "Break")
   - **Color**: Click the color box to choose a segment color
3. Click **Set Visual Schedule** to start the timer
4. Watch the clock! Each segment will pulse with color as time advances
5. All your settings are saved in your browser (localStorage)

### Chrome Extension
1. Clone or download this repository
2. Open Chrome and navigate to `chrome://extensions`
3. Enable **Developer Mode** (toggle in the top right)
4. Click **Load unpacked** and select the `Clock-o-matic` folder
5. The extension icon will appear in your toolbar; pin it for easy access
6. Open any Google Slides presentation
7. Click the Clock-o-matic icon in your toolbar to toggle the clock

### Tips (Both Versions)
- **Dragging labels**: Click and drag labels to reposition them if they overlap or need adjustment
- **Sound**: Use the speaker icon to toggle alarm chimes on/off
- **Minimal mode**: Click the clock face itself to quickly hide controls during presentation
- **Clear schedule**: Use the Clear button to reset everything and start fresh

## Support the Project

If Clock-o-matic helps make your presentations better, consider supporting development:

☕ **[Buy me a coffee](https://www.buymeacoffee.com/Robomatic)** — Your small donation helps fuel ongoing improvements, new features, and free tools for educators and presenters.

## Technical Details

**Built with:**
- Chrome Manifest V3
- Vanilla JavaScript (no frameworks)
- Web Audio API for chimes
- CSS conic-gradients for visual segments
- Chrome Storage API for persistence

**Permissions:**
- `activeTab`: Detect when you're on Google Slides
- `scripting`: Inject the clock UI
- `storage`: Save your settings per presentation

**Browser Support:**
- Chrome/Chromium 88+

## Files

| File | Purpose |
|------|---------|
| `manifest.json` | Chrome extension configuration (V3) |
| `background.js` | Handles toolbar clicks and keyboard shortcuts |
| `content.js` | Main clock logic, UI rendering, and state management |
| `styles.css` | All styling for the clock interface |
| `icon128.png` | Extension icon |

## Limitations & Notes

- This extension works only on Google Slides (`docs.google.com/presentation/*`)
- Alarms require audio permissions; some browsers may block audio on first interaction
- Settings are stored per presentation in browser local storage
- Works best on Chrome and Chromium-based browsers

## Roadmap

See `CoPilotToDo.md` for planned improvements and known issues.

## License

Distributed freely. If you modify and redistribute, please credit the original.

---

**Questions or feedback?** Create an issue on the GitHub repository or reach out via the donation link.

Happy presenting! 🎉
# Clock-o-matic

A Chrome extension that brings a beautiful, interactive visual timer to Google Slides. Perfect for presentations, training sessions, workshops, and any scenario where you need to display time blocks with visual progress tracking.

## Features

✨ **Visual Time Blocks**
- Create a schedule with labeled time segments, each with its own color
- Watch as colored blocks rotate around the clock face, showing elapsed time in gray and remaining time in color
- Perfect for presenting agendas, lesson plans, or workshop itineraries

⏰ **Real-Time Clock**
- Displays hour, minute, and second hands synchronized to your system time
- Visual base ring shows overall schedule progress at a glance
- Draggable, resizable, and toggles between minimal and fullscreen modes

🔔 **Smart Alarms**
- Plays a pleasant chime at the end of each time block
- Toggle sound on/off with a single click
- Alarms fire even if you switch tabs or scroll your slides

💾 **Per-Presentation Persistence**
- All settings (position, size, blocks, alarms) auto-save and restore per Google Slides deck
- Switch between presentations and find your clock exactly where you left it
- Label positions are preserved across sessions

📱 **Flexible Display Modes**
- **Minimal mode**: Hide controls to focus on the clock display during presentation
- **Fullscreen mode**: Maximize the clock to dominate your screen for large rooms
- **Draggable**: Reposition anywhere on the slide with smooth drag-and-drop
- **Resizable**: Scale from compact to large with corner/edge resize handles

## How to Use

### Installation
1. Clone or download this repository
2. Open Chrome and navigate to `chrome://extensions`
3. Enable **Developer Mode** (toggle in the top right)
4. Click **Load unpacked** and select the `Clock-o-matic` folder
5. The extension icon will appear in your toolbar; pin it for easy access

### Getting Started
1. Open any Google Slides presentation
2. Click the Clock-o-matic icon in your toolbar to toggle the clock
3. Enter your time blocks:
   - **Minutes**: Duration of each segment
   - **Label**: Name of the segment (e.g., "Intro", "Q&A", "Break")
   - **Color**: Click the color box to choose a segment color
4. Click **Set Visual Schedule** to start the timer
5. Watch the clock! Each segment will pulse with color as time advances

### Tips
- **Dragging labels**: Click and drag labels to reposition them if they overlap or need adjustment
- **Sound**: Use the speaker icon to toggle alarm chimes on/off
- **Minimal mode**: Click the clock face itself to quickly hide controls during presentation
- **Clear schedule**: Use the Clear button to reset everything and start fresh

## Support the Project

If Clock-o-matic helps make your presentations better, consider supporting development:

☕ **[Buy me a coffee](https://www.buymeacoffee.com/Robomatic)** — Your small donation helps fuel ongoing improvements, new features, and free tools for educators and presenters.

## Technical Details

**Built with:**
- Chrome Manifest V3
- Vanilla JavaScript (no frameworks)
- Web Audio API for chimes
- CSS conic-gradients for visual segments
- Chrome Storage API for persistence

**Permissions:**
- `activeTab`: Detect when you're on Google Slides
- `scripting`: Inject the clock UI
- `storage`: Save your settings per presentation

**Browser Support:**
- Chrome/Chromium 88+

## Files

| File | Purpose |
|------|---------|
| `manifest.json` | Chrome extension configuration (V3) |
| `background.js` | Handles toolbar clicks and keyboard shortcuts |
| `content.js` | Main clock logic, UI rendering, and state management |
| `styles.css` | All styling for the clock interface |
| `icon128.png` | Extension icon |

## Limitations & Notes

- This extension works only on Google Slides (`docs.google.com/presentation/*`)
- Alarms require audio permissions; some browsers may block audio on first interaction
- Settings are stored per presentation in browser local storage
- Works best on Chrome and Chromium-based browsers

## Roadmap

See `CoPilotToDo.md` for planned improvements and known issues.

## License

Distributed freely. If you modify and redistribute, please credit the original.

---

**Questions or feedback?** Create an issue on the GitHub repository or reach out via the donation link.

Happy presenting! 🎉
