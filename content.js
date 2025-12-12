// --- CONFIGURATION ---
const DONATION_URL = "https://www.buymeacoffee.com/Robomatic"; 

// --- SVG ICONS ---
const ICON_SOUND_ON = `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/></svg>`;
const ICON_SOUND_OFF = `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73 4.27 3zM12 4L9.91 6.09 12 8.18V4z"/></svg>`;
const ICON_COFFEE = `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M20 3H4v10c0 2.21 1.79 4 4 4h6c2.21 0 4-1.79 4-4v-3h2c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 5h-2V5h2v3zM4 19h16v2H4z"/></svg>`;
const ICON_MAXIMIZE = `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"/></svg>`;
const ICON_MINIMIZE = `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z"/></svg>`;

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
        return `<div class="number" style="left:${x}%; top:${y}%;">${num}</div>`;
    }).join('');

    const ticksHTML = [...Array(60)].map((_, i) => {
        const isHour = i % 5 === 0;
        const className = isHour ? 'tick major' : 'tick minor';
        return `<div class="${className}" style="transform: rotate(${i * 6}deg)"></div>`;
    }).join('');

    return `
    <div id="slide-clock-container" style="display:none;">
      <!-- Resize Handles -->
      <div class="resize-handle corner top-left"></div>
      <div class="resize-handle corner top-right"></div>
      <div class="resize-handle corner bottom-left"></div>
      <div class="resize-handle corner bottom-right"></div>
      <div class="resize-handle edge top"></div>
      <div class="resize-handle edge bottom"></div>
      <div class="resize-handle edge left"></div>
      <div class="resize-handle edge right"></div>
      
      <!-- Icons -->
      <div id="donation-link" title="Buy me a coffee">${ICON_COFFEE}</div>
      <div id="btn-maximize" title="Fullscreen Mode">${ICON_MAXIMIZE}</div>
      <div id="case-sound-toggle" title="Toggle Sound"></div>
      
      <div class="clock-face">
        ${ticksHTML}
        ${numbersHTML}
        <div id="labels-container"></div>
        <div class="brand-logo"></div>
        <div class="timer-disk"></div>
        <div class="hand hour-hand"></div>
        <div class="hand min-hand"></div>
        <div class="hand second-hand"></div>
        <div class="center-dot"></div>
      </div>
      
      <div class="controls">
        <div style="font-size:11px; color:#aaa; margin-bottom:4px; display:flex; padding:0 5px;">
            <span style="width:40px; text-align:center;">Mins</span>
            <span style="flex:1; padding-left:5px;">Label</span>
            <span style="width:24px;">Color</span>
            <span style="width:20px;"></span>
        </div>
        
        <div id="rows-container"></div>
        
        <button id="btn-add-row" title="Add another block">+</button>

        <div class="row" style="margin-top:8px;">
             <button id="btn-set-block">Set Visual Schedule</button>
             <button id="btn-clear-block">Clear</button>
        </div>
      </div>
    </div>
    `;
};

document.body.insertAdjacentHTML('beforeend', createClockHTML());

// --- DOM ELEMENTS ---
const container = document.getElementById('slide-clock-container');
const clockFace = document.querySelector('.clock-face');
const timerDisk = document.querySelector('.timer-disk');
const labelsContainer = document.getElementById('labels-container');
const rowsContainer = document.getElementById('rows-container');
const btnAddRow = document.getElementById('btn-add-row');
const btnSetBlock = document.getElementById('btn-set-block');
const btnClearBlock = document.getElementById('btn-clear-block');
const caseIcon = document.getElementById('case-sound-toggle');
const donationIcon = document.getElementById('donation-link');
const maximizeIcon = document.getElementById('btn-maximize');

// Cache clock hand references
let secondHand = null;
let minHand = null;
let hourHand = null;

function initClockHands() {
    secondHand = document.querySelector('.second-hand');
    minHand = document.querySelector('.min-hand');
    hourHand = document.querySelector('.hour-hand');
}

// Accessibility labels for icon-only controls
[caseIcon, donationIcon, maximizeIcon].forEach((el) => {
    if (!el) return;
    el.setAttribute('tabindex', '0');
    el.setAttribute('role', 'button');
});
function attachKeyboardActivation(el, handler) {
    if (!el) return;
    el.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handler();
        }
    });
}
caseIcon?.setAttribute('aria-label', 'Toggle sound');
donationIcon?.setAttribute('aria-label', 'Open donation link');
maximizeIcon?.setAttribute('aria-label', 'Toggle fullscreen');
btnAddRow?.setAttribute('aria-label', 'Add block row');
btnSetBlock?.setAttribute('aria-label', 'Set visual schedule');
btnClearBlock?.setAttribute('aria-label', 'Clear visual schedule');

let intervalId = null;
let alarmQueue = []; 
let isSoundOn = true;  
let activeBlocks = []; 
let inputRows = [{ min: 15, label: '', color: PALETTE[0] }];
let currentScale = 1.0;
let labelOffsets = {}; // Store user-adjusted label positions by label text
let scheduleStartTime = null; // Track when schedule started
let scheduleEndTime = null;   // Track when schedule ends
let scheduleStartRotation = null; // Degrees of minute hand when schedule started
let lastBaseLabelPositions = {}; // Cache of the latest computed base label positions by index

// --- RENDER DYNAMIC ROWS ---
function renderInputRows() {
    rowsContainer.innerHTML = '';
    inputRows.forEach((row, index) => {
        const div = document.createElement('div');
        div.className = 'block-row';
        div.innerHTML = `
            <input type="number" class="inp-min" value="${row.min}" placeholder="Min" min="0" max="60">
            <input type="text" class="inp-label" value="${row.label}" placeholder="Label">
            <input type="color" class="inp-color" value="${row.color}">
            <button class="btn-remove" title="Remove">✕</button>
        `;
        const inpMin = div.querySelector('.inp-min');
        const inpLabel = div.querySelector('.inp-label');
        const inpColor = div.querySelector('.inp-color');
        const btnRemove = div.querySelector('.btn-remove');
        inpMin.oninput = (e) => { inputRows[index].min = e.target.value; };
        inpLabel.oninput = (e) => { inputRows[index].label = e.target.value; };
        inpColor.oninput = (e) => { inputRows[index].color = e.target.value; };
        btnRemove.onclick = () => { inputRows.splice(index, 1); renderInputRows(); };
        rowsContainer.appendChild(div);
    });
}
function addRow() {
    const nextColorIndex = inputRows.length % PALETTE.length;
    inputRows.push({ min: 10, label: '', color: PALETTE[nextColorIndex] });
    renderInputRows();
    container.scrollTop = container.scrollHeight;
}

// --- SOUND (BING!) ---
function getAudioContext() {
    if (!isSoundOn) return null;
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return null;
    if (!audioCtx) {
        audioCtx = new AudioContext();
    }
    // Resume if previously suspended by browser autoplay policies
    if (audioCtx.state === 'suspended') {
        audioCtx.resume().catch(() => {});
    }
    return audioCtx;
}

function playChime() {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.type = 'sine';

    // A5 (880Hz) - Bright and clear
    osc.frequency.setValueAtTime(880, now);
    osc.frequency.exponentialRampToValueAtTime(870, now + 1.0);

    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.2, now + 0.01); 
    gain.gain.exponentialRampToValueAtTime(0.001, now + 1.5); 

    osc.start(now);
    osc.stop(now + 1.5);
}

// --- PERSISTENCE ---
function getPresentationId() {
    // Handles /presentation/d/<id>/edit and embeds; falls back to global_default
    const match = window.location.pathname.match(/\/presentation\/d\/([^/]+)/);
    if (match && match[1]) return match[1];
    const parts = window.location.pathname.split('/');
    const dIndex = parts.indexOf('d');
    if (dIndex >= 0 && parts[dIndex + 1]) return parts[dIndex + 1];
    return 'global_default';
}

function storageGet(keys, cb) {
    if (!chrome?.storage?.local) {
        console.warn('Clock storage unavailable');
        cb({});
        return;
    }
    chrome.storage.local.get(keys, (result) => {
        if (chrome.runtime.lastError) {
            console.warn('Clock storage get failed', chrome.runtime.lastError);
            cb({});
            return;
        }
        cb(result || {});
    });
}

function storageSet(obj) {
    if (!chrome?.storage?.local) {
        console.warn('Clock storage unavailable');
        return;
    }
    chrome.storage.local.set(obj, () => {
        if (chrome.runtime.lastError) {
            console.warn('Clock storage set failed', chrome.runtime.lastError);
        }
    });
}

function saveState() {
    const id = getPresentationId();
    const state = {
        left: container.style.left,
        top: container.style.top,
        scale: currentScale,
        isVisible: container.style.display !== 'none',
        isMinimal: container.classList.contains('minimal-mode'),
        inputRows: inputRows, 
        activeBlocks: activeBlocks,
        alarmQueue: alarmQueue, 
        isSoundOn: isSoundOn,
        labelOffsets: labelOffsets,
        scheduleStartTime: scheduleStartTime,
        scheduleEndTime: scheduleEndTime,
        scheduleStartRotation: scheduleStartRotation
    };
    storageSet({ [`clock_state_${id}`]: state });
}

function restoreState() {
    const id = getPresentationId();
    storageGet([`clock_state_${id}`], (result) => {
        const state = result[`clock_state_${id}`];
        if (state) {
            if (state.left) container.style.left = state.left;
            if (state.top) container.style.top = state.top;
            if (state.scale) {
                currentScale = state.scale;
                container.style.transform = `scale(${currentScale})`;
            }
            
            if (state.isMinimal) container.classList.add('minimal-mode');
            else container.classList.remove('minimal-mode');

            if (state.isSoundOn !== undefined) {
                isSoundOn = state.isSoundOn;
            }
            updateSoundIcon();

            if (state.labelOffsets) {
                labelOffsets = state.labelOffsets;
            }
            
            if (state.scheduleStartTime) {
                scheduleStartTime = state.scheduleStartTime;
            }
            if (state.scheduleEndTime) {
                scheduleEndTime = state.scheduleEndTime;
            }
            if (state.scheduleStartRotation !== undefined) {
                scheduleStartRotation = state.scheduleStartRotation;
            }

            if (state.inputRows && Array.isArray(state.inputRows)) {
                inputRows = state.inputRows;
            }
            renderInputRows();

            if (state.alarmQueue && Array.isArray(state.alarmQueue)) {
                const now = Date.now();
                alarmQueue = state.alarmQueue.filter(time => time > (now - 2000));
                
                if (state.activeBlocks && state.activeBlocks.length > 0) {
                    activeBlocks = state.activeBlocks;
                    drawVisualBlocks(activeBlocks);
                }
            } else {
                alarmQueue = [];
                activeBlocks = [];
            }

            if (state.isVisible) {
                container.style.display = "flex";
                startClockLoop();
            }
        } else {
            renderInputRows();
            updateSoundIcon();
        }
    });
}

function updateSoundIcon() {
    if (isSoundOn) {
        caseIcon.innerHTML = ICON_SOUND_ON;
        caseIcon.style.opacity = "0.9";
    } else {
        caseIcon.innerHTML = ICON_SOUND_OFF;
        caseIcon.style.opacity = "0.5";
    }
}

// --- CLOCK LOOP ---
function updateClockHands() {
    if (!secondHand || !minHand || !hourHand) {
        initClockHands();
    }
    
    const now = new Date();
    const seconds = now.getSeconds();
    const mins = now.getMinutes();
    const hour = now.getHours();
    const secDeg = ((seconds / 60) * 360);
    const minDeg = ((mins / 60) * 360) + ((seconds/60)*6);
    const hourDeg = ((hour / 12) * 360) + ((mins/60)*30);
    
    try {
        if (secondHand) {
            secondHand.style.transform = `translateX(-50%) rotate(${secDeg}deg)`;
        }
        if (minHand) {
            minHand.style.transform = `translateX(-50%) rotate(${minDeg}deg)`;
        }
        if (hourHand) {
            hourHand.style.transform = `translateX(-50%) rotate(${hourDeg}deg)`;
        }
    } catch (e) {
        console.warn('Clock hands update error:', e);
    }

    // Update visual blocks to show progress (only if schedule is active)
    if (activeBlocks.length > 0 && alarmQueue.length > 0) {
        try {
            updateVisualBlocksProgress();
        } catch (e) {
            console.warn('Visual blocks update error:', e);
        }
    }

    // CHECK ALARM QUEUE
    if (alarmQueue.length > 0) {
        const nextAlarm = alarmQueue[0];
        const diff = nextAlarm - now.getTime();
        
        if (diff <= 0) {
            triggerAlarm();
            alarmQueue.shift();
            saveState(); 
        }
    }
}

function triggerAlarm() {
    playChime();
    clockFace.classList.add('alarm-active');
    setTimeout(() => { clockFace.classList.remove('alarm-active'); }, 5000);
}

function startClockLoop() {
    if (intervalId) clearInterval(intervalId);
    initClockHands();
    updateClockHands();
    intervalId = setInterval(updateClockHands, 1000);
}

// --- DRAWING WITH INTELLIGENT STAGGER ---
function drawVisualBlocks(blocks) {
    const startRotation = getStartRotation();
    let gradientStops = [];
    let labelsHTML = '';
    let currentRelativeDeg = 0;
    
    // TRACKING FOR STAGGER
    let lastLabelAngle = -999;
    let lastTrack = 0; // 0=Mid, 1=Out, 2=In

    blocks.forEach((block, index) => {
        const minVal = parseInt(block.min);
        if(!minVal || minVal <= 0) return;
        const span = minVal * 6; 
        const startDeg = currentRelativeDeg;
        const endDeg = currentRelativeDeg + span;
        gradientStops.push(`${block.color} ${startDeg}deg ${endDeg}deg`);
        
        if(block.label) {
            const absoluteMidAngle = startRotation + startDeg + (span / 2);
            
            // --- STAGGER LOGIC (reduced radii to fit within clock) ---
            // Radii (Percent from center)
            const R_MID = 50;
            const R_OUT = 62;
            const R_IN  = 38;
            
            let dist = R_MID; 
            let currentTrack = 0; // Track 0 is Middle
            
            // Check distance from previous label (Threshold: 22 degrees)
            if (Math.abs(absoluteMidAngle - lastLabelAngle) < 22) {
                // Collision detected! Move to a different track.
                if (lastTrack === 0) {
                    dist = R_OUT;
                    currentTrack = 1;
                } else if (lastTrack === 1) {
                    dist = R_IN;
                    currentTrack = 2;
                } else {
                    dist = R_OUT;
                    currentTrack = 1;
                }
            } else {
                dist = R_MID;
                currentTrack = 0;
            }
            
            lastLabelAngle = absoluteMidAngle;
            lastTrack = currentTrack;

            // Trig calculation
            const midRad = (absoluteMidAngle - 90) * (Math.PI / 180);
            const baseX = 50 + (dist * Math.cos(midRad));
            const baseY = 50 + (dist * Math.sin(midRad));
            let lx = baseX;
            let ly = baseY;

            // Apply user offset if exists (stored as delta; legacy absolute is converted)
            const offset = labelOffsets[block.label];
            if (offset) {
                if (offset.dx !== undefined && offset.dy !== undefined) {
                    lx += offset.dx;
                    ly += offset.dy;
                } else if (offset.x !== undefined && offset.y !== undefined) {
                    lx = offset.x;
                    ly = offset.y;
                }
            }
            
            labelsHTML += `<div class="block-label" data-label="${block.label}" data-idx="${index}" style="left:${lx}%; top:${ly}%;">${block.label}</div>`;
        }
        currentRelativeDeg += span;
    });

    if (currentRelativeDeg < 360) {
        gradientStops.push(`transparent ${currentRelativeDeg}deg 360deg`);
    }

    labelsContainer.innerHTML = labelsHTML;
    
    // Attach drag handlers to labels
    attachLabelDragHandlers();
    
    // Initial draw with progress
    updateVisualBlocksProgress();
}

// Update visual blocks to show elapsed (gray) vs remaining (colored) time
function updateVisualBlocksProgress() {
    if (!timerDisk) return;
    
    const now = new Date();
    const startRotation = getStartRotation();
    const currentTime = now.getTime();
    
    // Compute overall schedule progress for subtle base ring
    let baseGradient = 'transparent 0deg 360deg';
    if (scheduleStartTime && scheduleEndTime && scheduleEndTime > scheduleStartTime) {
        const totalDuration = scheduleEndTime - scheduleStartTime;
        const elapsed = Math.max(0, Math.min(totalDuration, currentTime - scheduleStartTime));
        const ratio = elapsed / totalDuration;
        const baseSpanDeg = 360 * ratio;
        baseGradient = `rgba(180, 180, 180, 0.2) 0deg ${baseSpanDeg}deg, transparent ${baseSpanDeg}deg 360deg`;
    }
    
    // Find which block we're in and how far through
    let cumulativeTime = scheduleStartTime || currentTime;
    let gradientStops = [];
    let currentRelativeDeg = 0;
    
    activeBlocks.forEach((block, index) => {
        const minVal = parseInt(block.min);
        if(!minVal || minVal <= 0) return;
        const span = minVal * 6;
        const blockEndTime = cumulativeTime + (minVal * 60 * 1000);
        
        const startDeg = currentRelativeDeg;
        const endDeg = currentRelativeDeg + span;
        
        // Determine if this block is past, current, or future
        if (currentTime >= blockEndTime) {
            // Past block - all gray
            gradientStops.push(`rgba(180, 180, 180, 0.4) ${startDeg}deg ${endDeg}deg`);
        } else if (currentTime >= cumulativeTime && currentTime < blockEndTime) {
            // Current block - split between gray (elapsed) and color (remaining)
            const blockElapsed = (currentTime - cumulativeTime) / 1000 / 60; // minutes
            const progressDeg = (blockElapsed / minVal) * span;
            const splitDeg = startDeg + progressDeg;
            
            if (progressDeg > 0) {
                gradientStops.push(`rgba(180, 180, 180, 0.4) ${startDeg}deg ${splitDeg}deg`);
            }
            gradientStops.push(`${block.color} ${splitDeg}deg ${endDeg}deg`);
        } else {
            // Future block - full color
            gradientStops.push(`${block.color} ${startDeg}deg ${endDeg}deg`);
        }
        
        cumulativeTime = blockEndTime;
        currentRelativeDeg += span;
    });
    
    if (currentRelativeDeg < 360) {
        gradientStops.push(`transparent ${currentRelativeDeg}deg 360deg`);
    }

    // Update label positions to stay aligned with segment centers
    updateLabelPositions(startRotation);

    const coloredGradient = `conic-gradient(from ${startRotation}deg, ${gradientStops.join(', ')})`;
    const baseRingGradient = `conic-gradient(from ${startRotation}deg, ${baseGradient})`;
    // Draw colored segments above the subtle base ring
    timerDisk.style.background = `${coloredGradient}, ${baseRingGradient}`;
}

// Keep labels aligned with their segment centers as time advances
function updateLabelPositions(startRotation) {
    const labelNodes = document.querySelectorAll('.block-label');
    if (!labelNodes.length) return;

    let currentRelativeDeg = 0;
    let lastLabelAngle = -999;
    let lastTrack = 0; // 0=Mid, 1=Out, 2=In

    lastBaseLabelPositions = {};

    activeBlocks.forEach((block, index) => {
        const labelEl = document.querySelector(`.block-label[data-idx="${index}"]`);
        const minVal = parseInt(block.min);
        if (!labelEl || !minVal || minVal <= 0) {
            currentRelativeDeg += (minVal || 0) * 6;
            return;
        }

        const span = minVal * 6;
        const startDeg = currentRelativeDeg;
        const absoluteMidAngle = startRotation + startDeg + (span / 2);

        // Stagger logic (same as drawVisualBlocks)
        const R_MID = 50;
        const R_OUT = 62;
        const R_IN  = 38;
        let dist = R_MID;
        let currentTrack = 0;
        if (Math.abs(absoluteMidAngle - lastLabelAngle) < 22) {
            if (lastTrack === 0) {
                dist = R_OUT; currentTrack = 1;
            } else if (lastTrack === 1) {
                dist = R_IN; currentTrack = 2;
            } else {
                dist = R_OUT; currentTrack = 1;
            }
        }
        lastLabelAngle = absoluteMidAngle;
        lastTrack = currentTrack;

        const midRad = (absoluteMidAngle - 90) * (Math.PI / 180);
        const baseX = 50 + (dist * Math.cos(midRad));
        const baseY = 50 + (dist * Math.sin(midRad));

        // Record base position so drags can store relative offsets
        lastBaseLabelPositions[index] = { x: baseX, y: baseY };

        let lx = baseX;
        let ly = baseY;

        // Apply manual offsets as deltas from the base position
        const labelKey = block.label;
        const offset = labelOffsets[labelKey];
        if (offset) {
            if (offset.dx !== undefined && offset.dy !== undefined) {
                lx += offset.dx;
                ly += offset.dy;
            } else if (offset.x !== undefined && offset.y !== undefined) {
                // Convert legacy absolute positions into deltas
                const dx = offset.x - baseX;
                const dy = offset.y - baseY;
                labelOffsets[labelKey] = { dx, dy };
                lx += dx;
                ly += dy;
            }
        }

        labelEl.style.left = `${lx}%`;
        labelEl.style.top = `${ly}%`;

        currentRelativeDeg += span;
    });
}

function attachLabelDragHandlers() {
    document.querySelectorAll('.block-label').forEach(label => {
        label.addEventListener('mousedown', (e) => {
            e.stopPropagation();
            const labelText = label.getAttribute('data-label');
            const labelIndex = parseInt(label.getAttribute('data-idx'), 10);
            const clockRect = clockFace.getBoundingClientRect();
            const startX = e.clientX;
            const startY = e.clientY;
            const startLeft = parseFloat(label.style.left);
            const startTop = parseFloat(label.style.top);
            
            function onMouseMove(event) {
                const dx = ((event.clientX - startX) / clockRect.width) * 100;
                const dy = ((event.clientY - startY) / clockRect.height) * 100;
                const newX = Math.max(5, Math.min(95, startLeft + dx));
                const newY = Math.max(5, Math.min(95, startTop + dy));
                
                label.style.left = newX + '%';
                label.style.top = newY + '%';
                
                // Store offset relative to the current base position (if known)
                const base = lastBaseLabelPositions[labelIndex];
                if (base) {
                    labelOffsets[labelText] = { dx: newX - base.x, dy: newY - base.y };
                } else {
                    // Fallback to absolute storage if base is unavailable
                    labelOffsets[labelText] = { x: newX, y: newY };
                }
            }
            
            function onMouseUp() {
                document.removeEventListener('mousemove', onMouseMove);
                document.removeEventListener('mouseup', onMouseUp);
                saveState();
            }
            
            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp);
        });
    });
}

function setSchedule() {
    activeBlocks = [];
    alarmQueue = []; 
    const nowTs = Date.now();
    scheduleStartTime = nowTs;
    scheduleStartRotation = computeRotationFromTimestamp(nowTs);
    let cumulativeTime = scheduleStartTime; 
    // Reset any manually dragged offsets so labels realign to their segments for the new schedule
    labelOffsets = {};
    lastBaseLabelPositions = {};
    
    inputRows.forEach(row => {
        const minVal = parseInt(row.min);
        if(minVal && minVal > 0) {
            activeBlocks.push({ min: minVal, label: row.label, color: row.color });
            cumulativeTime += (minVal * 60 * 1000);
            alarmQueue.push(cumulativeTime);
        }
    });
    scheduleEndTime = cumulativeTime;
    
    if(activeBlocks.length === 0) return;
    
    drawVisualBlocks(activeBlocks);
    container.classList.add('minimal-mode');
    saveState();
}

function toggleSound() {
    isSoundOn = !isSoundOn;
    updateSoundIcon();
    if(isSoundOn) playChime();
    saveState();
}

function toggleMaximize() {
    container.classList.toggle('maximized-mode');
    if(container.classList.contains('maximized-mode')) {
        maximizeIcon.innerHTML = ICON_MINIMIZE;
    } else {
        maximizeIcon.innerHTML = ICON_MAXIMIZE;
    }
}

// --- LISTENERS ---
caseIcon.addEventListener('click', (e) => { e.stopPropagation(); toggleSound(); });
donationIcon.addEventListener('click', (e) => { e.stopPropagation(); window.open(DONATION_URL, '_blank'); });
maximizeIcon.addEventListener('click', (e) => { e.stopPropagation(); toggleMaximize(); });

attachKeyboardActivation(caseIcon, toggleSound);
attachKeyboardActivation(donationIcon, () => window.open(DONATION_URL, '_blank'));
attachKeyboardActivation(maximizeIcon, toggleMaximize);

btnAddRow.addEventListener('click', addRow);
btnSetBlock.addEventListener('click', setSchedule);
btnClearBlock.addEventListener('click', () => { 
    timerDisk.style.background = 'none'; 
    labelsContainer.innerHTML = '';
    alarmQueue = []; 
    activeBlocks = [];
    scheduleStartTime = null;
    scheduleEndTime = null;
    scheduleStartRotation = null;
    clockFace.classList.remove('alarm-active'); 
    saveState();
});

// --- RESIZE & DRAG & TOGGLE ---
let isDragging = false;
let isResizing = false;
let hasMoved = false;
let resizeDirection = null;

// Resize logic
document.querySelectorAll('.resize-handle').forEach(handle => {
    handle.addEventListener('mousedown', (e) => {
        if(container.classList.contains('maximized-mode')) return;
        e.stopPropagation();
        isResizing = true;
        hasMoved = true;
        
        // Determine direction from classes
        if (handle.classList.contains('top-left')) resizeDirection = 'nw';
        else if (handle.classList.contains('top-right')) resizeDirection = 'ne';
        else if (handle.classList.contains('bottom-left')) resizeDirection = 'sw';
        else if (handle.classList.contains('bottom-right')) resizeDirection = 'se';
        else if (handle.classList.contains('top')) resizeDirection = 'n';
        else if (handle.classList.contains('bottom')) resizeDirection = 's';
        else if (handle.classList.contains('left')) resizeDirection = 'w';
        else if (handle.classList.contains('right')) resizeDirection = 'e';
        
        const startX = e.clientX;
        const startY = e.clientY;
        const startScale = currentScale;
        const rect = container.getBoundingClientRect();
        const startLeft = parseFloat(container.style.left) || rect.left;
        const startTop = parseFloat(container.style.top) || rect.top;
        
        function onMouseMove(event) {
            if (!isResizing) return;
            
            const dx = event.clientX - startX;
            const dy = event.clientY - startY;
            
            // Use diagonal distance for uniform scaling
            let scaleFactor = 1;
            if (resizeDirection.includes('e')) scaleFactor += dx / 260;
            else if (resizeDirection.includes('w')) scaleFactor -= dx / 260;
            if (resizeDirection.includes('s')) scaleFactor += dy / 260;
            else if (resizeDirection.includes('n')) scaleFactor -= dy / 260;
            
            currentScale = Math.max(0.5, Math.min(5, startScale * scaleFactor));
            container.style.transform = `scale(${currentScale})`;
            
            // Adjust position to keep the opposite corner fixed
            if (resizeDirection.includes('w') || resizeDirection.includes('n')) {
                const scaleDiff = currentScale - startScale;
                if (resizeDirection.includes('w')) {
                    container.style.left = (startLeft - (260 * scaleDiff)) + 'px';
                }
                if (resizeDirection.includes('n')) {
                    container.style.top = (startTop - (rect.height / startScale * scaleDiff)) + 'px';
                }
            }
        }
        
        function onMouseUp() {
            isResizing = false;
            resizeDirection = null;
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
            saveState();
        }
        
        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
    });
});

// Drag logic
container.addEventListener('mousedown', (e) => {
    if(container.classList.contains('maximized-mode')) return;
    if(isResizing) return;
    if(['BUTTON', 'INPUT'].includes(e.target.tagName) || e.target.closest('.block-row') || e.target.closest('#case-sound-toggle') || e.target.closest('#donation-link') || e.target.closest('#btn-maximize') || e.target.closest('.resize-handle')) return;
    
    isDragging = true;
    hasMoved = false; 
    let shiftX = e.clientX - container.getBoundingClientRect().left;
    let shiftY = e.clientY - container.getBoundingClientRect().top;
    
    function onMouseMove(event) {
        if (isDragging) {
            hasMoved = true;
            container.style.left = event.clientX - shiftX + 'px';
            container.style.top = event.clientY - shiftY + 'px';
        }
    }
    const targetArea = document.fullscreenElement || document;
    targetArea.addEventListener('mousemove', onMouseMove);
    container.onmouseup = function() {
        isDragging = false;
        targetArea.removeEventListener('mousemove', onMouseMove);
        container.onmouseup = null;
        if (hasMoved) {
            saveState();
        } else {
            if(!container.classList.contains('maximized-mode')) {
                container.classList.toggle('minimal-mode');
                saveState();
            }
        }
    };
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "toggle_clock") {
        const isHidden = container.style.display === "none";
        moveClockToFullscreen();
        if (isHidden) {
            container.style.display = "flex";
            startClockLoop();
        } else {
            container.style.display = "none";
            clearInterval(intervalId);
        }
        saveState();
    }
});

function moveClockToFullscreen() {
    const fsElement = document.fullscreenElement;
    if (fsElement) fsElement.appendChild(container);
    else document.body.appendChild(container);
}
document.addEventListener("fullscreenchange", moveClockToFullscreen);

// --- HELPERS ---
function computeRotationFromTimestamp(ts) {
    const d = new Date(ts);
    return (d.getMinutes() + (d.getSeconds() / 60)) * 6;
}

function getStartRotation() {
    if (scheduleStartRotation !== null && scheduleStartRotation !== undefined) return scheduleStartRotation;
    if (scheduleStartTime) return computeRotationFromTimestamp(scheduleStartTime);
    const now = new Date();
    return (now.getMinutes() + (now.getSeconds() / 60)) * 6;
}

restoreState();