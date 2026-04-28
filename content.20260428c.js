// This is a direct copy of content.js for cache busting.
// --- CONFIGURATION ---
const DONATION_URL = "https://www.buymeacoffee.com/Robomatic"; 

// --- SVG ICONS ---
const ICON_SOUND_ON = `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/></svg>`;
const ICON_SOUND_OFF = `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73 4.27 3zM12 4L9.91 6.09 12 8.18V4z"/></svg>`;
const ICON_COFFEE = `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M20 3H4v10c0 2.21 1.79 4 4 4h6c2.21 0 4-1.79 4-4v-3h2c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 5h-2V5h2v3zM4 19h16v2H4z"/></svg>`;

const ICON_MAXIMIZE = `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"/></svg>`;
const ICON_MINIMIZE = `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z"/></svg>`;
const ICON_GEAR = `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M19.14,12.94a7.07,7.07,0,0,0,.05-1,7.07,7.07,0,0,0-.05-1l2.11-1.65a.5.5,0,0,0,.12-.64l-2-3.46a.5.5,0,0,0-.6-.22l-2.49,1a7.28,7.28,0,0,0-1.73-1l-.38-2.65A.5.5,0,0,0,13,2h-4a.5.5,0,0,0-.5.42l-.38,2.65a7.28,7.28,0,0,0-1.73,1l-2.49-1a.5.5,0,0,0-.6.22l-2,3.46a.5.5,0,0,0,.12.64l2.11,1.65a7.07,7.07,0,0,0-.05,1,7.07,7.07,0,0,0,.05,1L2.86,14.59a.5.5,0,0,0-.12.64l2,3.46a.5.5,0,0,0,.6.22l2.49-1a7.28,7.28,0,0,0,1.73,1l.38,2.65A.5.5,0,0,0,9,22h4a.5.5,0,0,0,.5-.42l.38-2.65a7.28,7.28,0,0,0,1.73-1l2.49,1a.5.5,0,0,0,.6-.22l2-3.46a.5.5,0,0,0-.12-.64ZM12,15.5A3.5,3.5,0,1,1,15.5,12,3.5,3.5,0,0,1,12,15.5Z"/></svg>`;

const PALETTE = ['#66BB6A', '#FFCA28', '#EF5350', '#42A5F5', '#AB47BC', '#26C6DA']; 

let audioCtx = null; // reused to avoid creating a new AudioContext per chime

// 1. Create HTML

const createClockHTML = () => {
    const numbersHTML = [...Array(12)].map((_, i) => {
        const num = i + 1;
        const angleDeg = (num * 30) - 90;
        const angleRad = angleDeg * (Math.PI / 180);
        const radius = 35;
        const x = 50 + (radius * Math.cos(angleRad));
        const y = 50 + (radius * Math.sin(angleRad));
        return `<div class=\"number\" style=\"left:${x}%; top:${y}%\">${num}</div>`;
    }).join('');

    const ticksHTML = [...Array(60)].map((_, i) => {
        const isHour = i % 5 === 0;
        const className = isHour ? 'tick major' : 'tick minor';
        return `<div class=\"${className}\" style=\"transform: rotate(${i * 6}deg)\"></div>`;
    }).join('');

    return `
    <div id=\"slide-clock-container\" style=\"display:none;\">\n      <!-- Resize Handles -->\n      <div class=\"resize-handle corner top-left\"></div>\n      <div class=\"resize-handle corner top-right\"></div>\n      <div class=\"resize-handle corner bottom-left\"></div>\n      <div class=\"resize-handle corner bottom-right\"></div>\n      <div class=\"resize-handle edge top\"></div>\n      <div class=\"resize-handle edge bottom\"></div>\n      <div class=\"resize-handle edge left\"></div>\n      <div class=\"resize-handle edge right\"></div>\n\n      <!-- Icons -->\n      <div id=\"donation-link\" title=\"Buy me a coffee\">${ICON_COFFEE}</div>\n      <div id=\"case-sound-toggle\" title=\"Toggle Sound\"></div>\n      <div id=\"settings-gear\" title=\"Settings\">${ICON_GEAR}</div>\n\n      <div class=\"clock-face\">\n        ${ticksHTML}\n        ${numbersHTML}\n        <div id=\"labels-container\"></div>\n        <div class=\"brand-logo\"></div>\n        <div class=\"timer-disk\"></div>\n        <div class=\"hand hour-hand\"></div>\n        <div class=\"hand min-hand\"></div>\n        <div class=\"hand second-hand\"></div>\n        <div class=\"center-dot\"></div>\n      </div>\n\n      <div class=\"controls\">\n        <div style=\"font-size:11px; color:#aaa; margin-bottom:4px; display:flex; padding:0 5px;\">\n            <span style=\"width:40px; text-align:center;\">Mins</span>\n            <span style=\"flex:1; padding-left:5px;\">Label</span>\n            <span style=\"width:24px;\">Color</span>\n            <span style=\"width:20px;\"></span>\n        </div>\n\n        <div id=\"rows-container\"></div>\n\n        <button id=\"btn-add-row\" title=\"Add another block\">+</button>\n\n        <div class=\"row\" style=\"margin-top:8px;\">\n             <button id=\"btn-set-block\">Set Visual Schedule</button>\n             <button id=\"btn-clear-block\">Clear</button>\n        </div>\n      </div>\n    </div>\n    `;
};

document.body.insertAdjacentHTML('beforeend', createClockHTML());

// Show clock by default on web
const container = document.getElementById('slide-clock-container');
container.style.display = 'flex';

// ...existing code...
