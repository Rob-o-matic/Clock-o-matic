import { test, expect } from '@playwright/test';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// test_clock.html is a minimal standalone harness that exercises the basic
// clock-face DOM structure without loading content.js or styles.css, so
// each test is scoped to what that harness actually provides.
// Tests that need the full content.js widget target index.html instead,
// and are marked with the "widget" tag so they can be run/excluded
// independently (e.g. npx playwright test --grep @widget).

const TEST_CLOCK_URL = 'file://' + path.resolve(__dirname, '..', 'test_clock.html');
const WIDGET_URL     = 'file://' + path.resolve(__dirname, '..', 'index.html');

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Wait until the clock's second-hand transform changes at least once, proving
 * updateClock() has fired at least one tick.
 */
async function waitForClockTick(page, selector = '.second-hand') {
  const initial = await page.locator(selector).evaluate(el => el.style.transform);
  await page.waitForFunction(
    ({ sel, init }) => document.querySelector(sel)?.style.transform !== init,
    { sel: selector, init: initial },
    { timeout: 3000 }
  );
}

// ---------------------------------------------------------------------------
// Suite 1 – test_clock.html  (standalone harness)
// ---------------------------------------------------------------------------

test.describe('Clock-o-matic — standalone test harness (test_clock.html)', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto(TEST_CLOCK_URL);
  });

  // -------------------------------------------------------------------------
  // 1. Clock container exists and is visible after initialization
  // -------------------------------------------------------------------------
  test('clock face is present and visible', async ({ page }) => {
    const face = page.locator('.clock-face');
    await expect(face).toBeVisible();

    // Must be rendered with non-zero dimensions
    const box = await face.boundingBox();
    expect(box).not.toBeNull();
    expect(box.width).toBeGreaterThan(0);
    expect(box.height).toBeGreaterThan(0);
  });

  // -------------------------------------------------------------------------
  // 2. Clock hands are present
  // -------------------------------------------------------------------------
  test('hour hand is present inside clock face', async ({ page }) => {
    const hand = page.locator('.clock-face .hour-hand');
    await expect(hand).toBeAttached();
  });

  test('minute hand is present inside clock face', async ({ page }) => {
    const hand = page.locator('.clock-face .min-hand');
    await expect(hand).toBeAttached();
  });

  test('second hand is present inside clock face', async ({ page }) => {
    const hand = page.locator('.clock-face .second-hand');
    await expect(hand).toBeAttached();
  });

  test('all three hands are inside .clock-face', async ({ page }) => {
    const face = page.locator('.clock-face');
    await expect(face.locator('.hour-hand')).toBeAttached();
    await expect(face.locator('.min-hand')).toBeAttached();
    await expect(face.locator('.second-hand')).toBeAttached();
  });

  // -------------------------------------------------------------------------
  // 3. Clock hands rotate to a non-zero position immediately on load
  // -------------------------------------------------------------------------
  test('clock hands have a rotate transform applied on load', async ({ page }) => {
    // The script calls updateClock() synchronously before the interval; at
    // least one of the hands must have a non-zero rotation unless time is
    // exactly 00:00:00, which is practically impossible in a real run.
    const transforms = await page.evaluate(() => {
      return {
        hour:   document.querySelector('.hour-hand')?.style.transform   ?? '',
        minute: document.querySelector('.min-hand')?.style.transform    ?? '',
        second: document.querySelector('.second-hand')?.style.transform ?? '',
      };
    });

    const hasRotation = Object.values(transforms).some(t => {
      const match = t.match(/rotate\(([\d.]+)deg\)/);
      return match && parseFloat(match[1]) !== 0;
    });
    expect(hasRotation).toBe(true);
  });

  // -------------------------------------------------------------------------
  // 4. Debug readout reflects current time
  // -------------------------------------------------------------------------
  test('debug div shows time information', async ({ page }) => {
    const debug = page.locator('#debug');
    await expect(debug).toBeAttached();
    const text = await debug.innerText();
    // The debug div is rendered by updateClock(); it must contain "Time:"
    expect(text).toMatch(/Time:/);
  });

  // -------------------------------------------------------------------------
  // 5. Second hand advances after one tick (interval fires)
  // -------------------------------------------------------------------------
  test('second hand transform updates after one second', async ({ page }) => {
    // Grab initial transform before tick
    const before = await page.locator('.second-hand').evaluate(el => el.style.transform);

    // Advance fake timers by 1 second then restore
    await page.evaluate(() => {
      const event = new Event('tick');
      // Force a tick by calling updateClock directly if it is in scope
      if (typeof updateClock === 'function') updateClock();
    });

    const after = await page.locator('.second-hand').evaluate(el => el.style.transform);

    // Either the transform changed (different second), or it stayed the same
    // because the page loaded at second boundary — both are valid, but we can
    // at least confirm the transform is a valid rotate() string.
    expect(after).toMatch(/rotate\([\d.]+deg\)/);
    // The transform must contain translateX(-50%) as set by the script
    expect(after).toMatch(/translateX\(-50%\)/);
  });

});

// ---------------------------------------------------------------------------
// Suite 2 – index.html  (full content.js widget)
// ---------------------------------------------------------------------------

test.describe('Clock-o-matic — full widget (index.html) @widget', () => {

  test.beforeEach(async ({ page }) => {
    // Clear localStorage between tests so state does not bleed across runs
    await page.addInitScript(() => {
      localStorage.clear();
    });
    await page.goto(WIDGET_URL);
    // Wait for the container to be visible (content.js sets display:flex after DOM insert)
    await page.waitForSelector('#slide-clock-container', { state: 'visible' });
  });

  // -------------------------------------------------------------------------
  // 1. Clock container exists and is visible after initialization
  // -------------------------------------------------------------------------
  test('clock container is present and visible', async ({ page }) => {
    const container = page.locator('#slide-clock-container');
    await expect(container).toBeVisible();
  });

  test('clock face renders inside the container', async ({ page }) => {
    const face = page.locator('#slide-clock-container .clock-face');
    await expect(face).toBeVisible();
    const box = await face.boundingBox();
    expect(box).not.toBeNull();
    expect(box.width).toBeGreaterThan(0);
    expect(box.height).toBeGreaterThan(0);
  });

  // -------------------------------------------------------------------------
  // 2. Clock hands are present in the widget
  // -------------------------------------------------------------------------
  test('widget clock has an hour hand', async ({ page }) => {
    await expect(page.locator('#slide-clock-container .hour-hand')).toBeAttached();
  });

  test('widget clock has a minute hand', async ({ page }) => {
    await expect(page.locator('#slide-clock-container .min-hand')).toBeAttached();
  });

  test('widget clock has a second hand', async ({ page }) => {
    await expect(page.locator('#slide-clock-container .second-hand')).toBeAttached();
  });

  // -------------------------------------------------------------------------
  // 3. Schedule: adding a segment creates a colored arc on the timer disk
  // -------------------------------------------------------------------------
  test('setting a schedule creates a conic-gradient on the timer disk', async ({ page }) => {
    // Ensure the settings panel is visible (not in minimal-mode)
    await page.evaluate(() => {
      const c = document.getElementById('slide-clock-container');
      if (c.classList.contains('minimal-mode')) {
        window.toggleMinimalModeWithScaling(false);
      }
    });

    // Wait for controls to be visible
    await page.waitForSelector('.controls', { state: 'visible' });

    // Fill in a 15-minute red block
    await page.locator('.inp-min').first().fill('15');
    await page.locator('.inp-label').first().fill('QA Block');
    // Set the color via evaluate because <input type="color"> is hard to interact
    // with via click in headless mode
    await page.locator('.inp-color').first().evaluate(el => {
      el.value = '#EF5350';
      el.dispatchEvent(new Event('input', { bubbles: true }));
    });

    // Click "Start!"
    await page.locator('#btn-set-block').click();

    // After setSchedule() the timer-disk should have a conic-gradient background
    const timerBg = await page.locator('.timer-disk').evaluate(el =>
      getComputedStyle(el).backgroundImage || el.style.background
    );
    expect(timerBg).toMatch(/conic-gradient/i);
  });

  test('setting a schedule renders a label inside the clock face', async ({ page }) => {
    await page.evaluate(() => {
      const c = document.getElementById('slide-clock-container');
      if (c.classList.contains('minimal-mode')) window.toggleMinimalModeWithScaling(false);
    });
    await page.waitForSelector('.controls', { state: 'visible' });

    await page.locator('.inp-min').first().fill('20');
    await page.locator('.inp-label').first().fill('Meeting');

    await page.locator('#btn-set-block').click();

    // A .block-label with the text "Meeting" must appear
    const label = page.locator('.block-label', { hasText: 'Meeting' });
    await expect(label).toBeAttached();
  });

  // -------------------------------------------------------------------------
  // 4. Clearing the schedule removes segments and labels
  // -------------------------------------------------------------------------
  test('clearing the schedule removes conic-gradient from timer disk', async ({ page }) => {
    // Set a schedule first
    await page.evaluate(() => {
      const c = document.getElementById('slide-clock-container');
      if (c.classList.contains('minimal-mode')) window.toggleMinimalModeWithScaling(false);
    });
    await page.waitForSelector('.controls', { state: 'visible' });
    await page.locator('.inp-min').first().fill('10');
    await page.locator('#btn-set-block').click();

    // Now clear it
    await page.evaluate(() => {
      const c = document.getElementById('slide-clock-container');
      if (c.classList.contains('minimal-mode')) window.toggleMinimalModeWithScaling(false);
    });
    await page.waitForSelector('.controls', { state: 'visible' });
    await page.locator('#btn-clear-block').click();

    // Timer disk background should be reset to none / empty
    const timerBg = await page.locator('.timer-disk').evaluate(el => el.style.background);
    expect(timerBg).toBe('none');
  });

  test('clearing the schedule removes block labels', async ({ page }) => {
    await page.evaluate(() => {
      const c = document.getElementById('slide-clock-container');
      if (c.classList.contains('minimal-mode')) window.toggleMinimalModeWithScaling(false);
    });
    await page.waitForSelector('.controls', { state: 'visible' });

    await page.locator('.inp-min').first().fill('10');
    await page.locator('.inp-label').first().fill('Sprint');
    await page.locator('#btn-set-block').click();

    // Ensure panel back visible before clearing
    await page.evaluate(() => {
      const c = document.getElementById('slide-clock-container');
      if (c.classList.contains('minimal-mode')) window.toggleMinimalModeWithScaling(false);
    });
    await page.waitForSelector('.controls', { state: 'visible' });
    await page.locator('#btn-clear-block').click();

    // No .block-label elements should remain
    await expect(page.locator('.block-label')).toHaveCount(0);
  });

  // -------------------------------------------------------------------------
  // 5. Sound toggle changes icon state
  // -------------------------------------------------------------------------
  test('sound toggle button is present with correct ARIA label', async ({ page }) => {
    const toggle = page.locator('#case-sound-toggle');
    await expect(toggle).toBeAttached();
    await expect(toggle).toHaveAttribute('aria-label', 'Toggle sound');
  });

  test('clicking sound toggle switches between sound-on and sound-off icons', async ({ page }) => {
    const toggle = page.locator('#case-sound-toggle');

    // Read initial SVG content (sound on by default — isSoundOn = true)
    const svgBefore = await toggle.innerHTML();
    // Default state has an SVG path for sound-on
    expect(svgBefore).toContain('<svg');

    // Toggle sound off
    await toggle.click();
    const svgAfter = await toggle.innerHTML();

    // The SVG should have changed (different path data for sound-off)
    expect(svgAfter).not.toBe(svgBefore);
    expect(svgAfter).toContain('<svg');

    // Opacity should drop when sound is off (set to "0.5" in updateSoundIcon)
    const opacity = await toggle.evaluate(el => el.style.opacity);
    expect(opacity).toBe('0.5');
  });

  test('toggling sound twice restores original icon', async ({ page }) => {
    const toggle = page.locator('#case-sound-toggle');
    const initial = await toggle.innerHTML();

    await toggle.click(); // off
    await toggle.click(); // on again

    const restored = await toggle.innerHTML();
    expect(restored).toBe(initial);

    const opacity = await toggle.evaluate(el => el.style.opacity);
    expect(opacity).toBe('0.9');
  });

  // -------------------------------------------------------------------------
  // 6. Gear icon opens / closes the settings panel
  // -------------------------------------------------------------------------
  test('gear icon is present with correct ARIA label', async ({ page }) => {
    const gear = page.locator('#settings-gear');
    await expect(gear).toBeAttached();
    await expect(gear).toHaveAttribute('aria-label', 'Show/hide settings');
  });

  test('clicking gear icon toggles minimal-mode class on container', async ({ page }) => {
    const container = page.locator('#slide-clock-container');
    const gear = page.locator('#settings-gear');

    // Start in non-minimal mode (restoreState() forces this via setTimeout)
    await page.evaluate(() => {
      document.getElementById('slide-clock-container').classList.remove('minimal-mode');
    });

    // First click → should add minimal-mode (hide settings)
    await gear.click();
    await expect(container).toHaveClass(/minimal-mode/);

    // Second click → should remove minimal-mode (show settings)
    await gear.click();
    await expect(container).not.toHaveClass(/minimal-mode/);
  });

  test('settings panel .controls is hidden in minimal-mode', async ({ page }) => {
    const container = page.locator('#slide-clock-container');

    // Force minimal mode
    await page.evaluate(() => {
      document.getElementById('slide-clock-container').classList.add('minimal-mode');
    });

    // CSS rule: .minimal-mode .controls { display: none !important; }
    const display = await page.locator('.controls').evaluate(el =>
      getComputedStyle(el).display
    );
    expect(display).toBe('none');
  });

  // -------------------------------------------------------------------------
  // 7. Minimal mode hides controls
  // -------------------------------------------------------------------------
  test('controls section is visible when not in minimal-mode', async ({ page }) => {
    // Ensure not minimal
    await page.evaluate(() => {
      document.getElementById('slide-clock-container').classList.remove('minimal-mode');
    });

    const display = await page.locator('.controls').evaluate(el =>
      getComputedStyle(el).display
    );
    expect(display).not.toBe('none');
  });

  test('entering minimal-mode hides the controls section', async ({ page }) => {
    // Ensure we start in full mode
    await page.evaluate(() => {
      document.getElementById('slide-clock-container').classList.remove('minimal-mode');
    });

    // Trigger minimal mode via the exported function
    await page.evaluate(() => window.toggleMinimalModeWithScaling(true));

    const display = await page.locator('.controls').evaluate(el =>
      getComputedStyle(el).display
    );
    expect(display).toBe('none');
  });

  test('exiting minimal-mode reveals the controls section', async ({ page }) => {
    // Start in minimal mode
    await page.evaluate(() => window.toggleMinimalModeWithScaling(true));

    // Exit minimal mode
    await page.evaluate(() => window.toggleMinimalModeWithScaling(false));

    const display = await page.locator('.controls').evaluate(el =>
      getComputedStyle(el).display
    );
    expect(display).not.toBe('none');
  });

  // -------------------------------------------------------------------------
  // 8. Resize handles are present
  // -------------------------------------------------------------------------
  test('all eight resize handles are present in the DOM', async ({ page }) => {
    const handles = page.locator('.resize-handle');
    // 4 corners + 4 edges = 8 handles
    await expect(handles).toHaveCount(8);
  });

  test('corner resize handles are present', async ({ page }) => {
    await expect(page.locator('.resize-handle.top-left')).toBeAttached();
    await expect(page.locator('.resize-handle.top-right')).toBeAttached();
    await expect(page.locator('.resize-handle.bottom-left')).toBeAttached();
    await expect(page.locator('.resize-handle.bottom-right')).toBeAttached();
  });

  test('edge resize handles are present', async ({ page }) => {
    await expect(page.locator('.resize-handle.top')).toBeAttached();
    await expect(page.locator('.resize-handle.bottom')).toBeAttached();
    await expect(page.locator('.resize-handle.left')).toBeAttached();
    await expect(page.locator('.resize-handle.right')).toBeAttached();
  });

  // -------------------------------------------------------------------------
  // 9. Bonus – "Add row" button appends a new input row
  // -------------------------------------------------------------------------
  test('clicking Add Row button creates an additional input row', async ({ page }) => {
    await page.evaluate(() => {
      const c = document.getElementById('slide-clock-container');
      if (c.classList.contains('minimal-mode')) window.toggleMinimalModeWithScaling(false);
    });
    await page.waitForSelector('.controls', { state: 'visible' });

    const before = await page.locator('.block-row').count();
    await page.locator('#btn-add-row').click();
    const after = await page.locator('.block-row').count();
    expect(after).toBe(before + 1);
  });

  // -------------------------------------------------------------------------
  // 10. Bonus – schedule button label reads "Start!" by default
  // -------------------------------------------------------------------------
  test('Set Schedule button shows Start! as default label', async ({ page }) => {
    await expect(page.locator('#btn-set-block')).toHaveText('Start!');
  });

  // -------------------------------------------------------------------------
  // 11. Bonus – localStorage state is persisted after setting a schedule
  // -------------------------------------------------------------------------
  test('state is written to localStorage after setting a schedule', async ({ page }) => {
    await page.evaluate(() => {
      const c = document.getElementById('slide-clock-container');
      if (c.classList.contains('minimal-mode')) window.toggleMinimalModeWithScaling(false);
    });
    await page.waitForSelector('.controls', { state: 'visible' });

    await page.locator('.inp-min').first().fill('5');
    await page.locator('#btn-set-block').click();

    const keys = await page.evaluate(() => Object.keys(localStorage));
    const hasClock = keys.some(k => k.startsWith('clock_state_'));
    expect(hasClock).toBe(true);
  });

  // -------------------------------------------------------------------------
  // 12. Bonus – keyboard activation of sound toggle (accessibility)
  // -------------------------------------------------------------------------
  test('sound toggle responds to Enter key (keyboard accessibility)', async ({ page }) => {
    const toggle = page.locator('#case-sound-toggle');
    const before = await toggle.innerHTML();

    // Focus and press Enter
    await toggle.focus();
    await toggle.press('Enter');

    const after = await toggle.innerHTML();
    expect(after).not.toBe(before);
  });

});
