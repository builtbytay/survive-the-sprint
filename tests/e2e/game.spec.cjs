const { test, expect } = require('@playwright/test');
const AxeBuilder = require('@axe-core/playwright').default;

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('#modal')).toBeVisible();
});

async function start(page, { relaxed = false, hotkeys = true } = {}) {
  if (relaxed) await page.locator('#intro-accessibility-settings [data-setting="pace"]').check();
  if (!hotkeys) await page.locator('#intro-accessibility-settings [data-setting="hotkeys"]').uncheck();
  await page.locator('#modal-btn').click();
  await expect(page.locator('#overlay')).toBeHidden();
  await expect(page.locator('#office')).toBeFocused();
}

test('intro and board support keyboard focus, prioritization and dialog closure', async ({ page }) => {
  await expect(page.locator('#modal')).toHaveAttribute('aria-modal', 'true');
  await start(page);
  await page.locator('#board-button').click();
  await expect(page.locator('#board-overlay')).toBeVisible();
  await expect(page.locator('#board-close')).toBeFocused();
  const options = page.locator('[data-priority]');
  await expect(options).toHaveCount(3);
  await options.first().click();
  await expect(options.first()).toHaveAttribute('aria-pressed', 'true');
  await expect(options.nth(1)).toHaveAttribute('aria-pressed', 'false');
  await page.keyboard.press('Escape');
  await expect(page.locator('#board-overlay')).toBeHidden();
  await expect(page.locator('#board-button')).toBeFocused();
});

test('pause settings persist and do not change native checkbox keyboard operation', async ({ page }) => {
  await start(page);
  await page.locator('#pause').click();
  await expect(page.locator('#overlay')).toBeVisible();
  await page.locator('#modal [data-setting="pace"]').check();
  await page.locator('#modal [data-setting="hotkeys"]').uncheck();
  await page.locator('#modal-btn').click();
  await expect(page.locator('#overlay')).toBeHidden();
  await page.reload();
  await expect(page.locator('#intro-accessibility-settings [data-setting="pace"]')).toBeChecked();
  await expect(page.locator('#intro-accessibility-settings [data-setting="hotkeys"]')).not.toBeChecked();
});

test('meters and progress are exposed to assistive technology', async ({ page }) => {
  await start(page);
  for (const name of ['Caffeine', 'Morale', 'Patience']) {
    await expect(page.getByRole('meter', { name }).first()).toHaveAttribute('aria-valuenow', /^\d+$/);
  }
  await expect(page.getByRole('progressbar', { name: 'Workday elapsed' })).toHaveAttribute('aria-valuenow', /^\d+$/);
  await expect(page.locator('#hud-tickets')).toHaveAttribute('aria-label', /Today's mission:/);
});

test('keyboard shortcuts do not hijack controls and can be disabled', async ({ page }) => {
  await start(page, { hotkeys: false });
  await page.locator('#office').focus();
  await page.keyboard.press('b');
  await expect(page.locator('#board-overlay')).toBeHidden();
  await page.locator('#board-button').focus();
  await page.keyboard.press('Space');
  await expect(page.locator('#board-overlay')).toBeVisible();
});

test('browser accessibility scan of intro and sprintboard', async ({ page }) => {
  const intro = await new AxeBuilder({ page }).analyze();
  expect(intro.violations.map(v => v.id), JSON.stringify(intro.violations, null, 2)).toEqual([]);
  await start(page);
  await page.locator('#board-button').click();
  const board = await new AxeBuilder({ page }).analyze();
  expect(board.violations.map(v => v.id), JSON.stringify(board.violations, null, 2)).toEqual([]);
});

test('mobile portrait and landscape keep controls reachable without horizontal overflow', async ({ page }) => {
  for (const viewport of [{width:390,height:844},{width:844,height:390}]) {
    await page.setViewportSize(viewport);
    await expect(page.locator('#modal-btn')).toBeVisible();
    await start(page);
    await expect(page.locator('#mobile-board-button')).toBeVisible();
    await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1)).toBe(true);
    if (viewport.width > viewport.height) await expect(page.locator('#compact-goal')).toBeVisible();
    await page.reload();
  }
});

test('reduced-motion respects OS preference and scene still renders', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await start(page);
  await expect(page.locator('#office')).toBeVisible();
  await expect(page.locator('#office')).toHaveAttribute('tabindex','0');
});

test('all five days advance and weekly completion is reachable', async ({ page }) => {
  // Instrument the test response only; no test hooks are shipped in production game.js.
  await page.route('**/game.js', async route => {
    const response = await route.fetch();
    let body = await response.text();
    const marker = '})();';
    const index = body.lastIndexOf(marker);
    if (index < 0) throw new Error('Cannot instrument game loop');
    body = body.slice(0, index) +
      "window.__advanceTestDay=()=>{if(s.mode!=='playing')throw new Error('Not playing');s.t=s.duration-.01;tick(.02);update()};\\n" +
      body.slice(index);
    await route.fulfill({ response, body });
  });
  await page.reload();
  await start(page, { relaxed: true });
  for (let day = 0; day < 5; day++) {
    await expect(page.locator('#scene-day')).toContainText(['Monday','Tuesday','Wednesday','Thursday','Friday'][day]);
    await page.evaluate(() => window.__advanceTestDay());
    await expect(page.locator('#overlay')).toBeVisible();
    if (day < 4) await page.locator('#modal-btn').click();
  }
  await expect(page.locator('#modal')).toContainText(/WEEK 1 COMPLETE|Friday|FRIDAY/);
});
