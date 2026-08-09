import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { chromium, firefox, webkit } from 'playwright';

const args = process.argv.slice(2);
const valueOf = (flag, fallback = null) => {
  const i = args.indexOf(flag);
  return i >= 0 && i + 1 < args.length ? args[i + 1] : fallback;
};

const BASE_URL = valueOf('--base-url', process.env.LAWS_RUNTIME_BASE_URL || 'http://127.0.0.1:4173').replace(/\/$/, '');
const BROWSER_ARG = valueOf('--browser', 'all');
const PROFILE_ARG = valueOf('--profile', 'phone-tablet-desktop');
const ROLE = valueOf('--role', process.env.LAWS_RUNTIME_ROLE || 'builder');
const OUTPUT = valueOf('--output', process.env.LAWS_RUNTIME_OUTPUT || `/tmp/laws-persistent-stage-${ROLE}.json`);
const SUBJECT_HEAD = process.env.EXECUTION_COMMIT || process.env.GITHUB_SHA || 'LOCAL';

const browserTypes = { chromium, firefox, webkit };
const browserNames = BROWSER_ARG === 'all'
  ? ['chromium', 'firefox', 'webkit']
  : BROWSER_ARG.split(',').map(v => v.trim()).filter(Boolean);

const profileCatalog = {
  phone: { width: 390, height: 844 },
  tablet: { width: 820, height: 1180 },
  desktop: { width: 1440, height: 1000 }
};
const profileNames = PROFILE_ARG === 'phone-tablet-desktop' || PROFILE_ARG === 'all'
  ? ['phone', 'tablet', 'desktop']
  : PROFILE_ARG.split(',').map(v => v.trim()).filter(Boolean);

const assert = (condition, message) => {
  if (!condition) throw new Error(message);
};
const ensureMatrix = () => {
  for (const name of browserNames) assert(browserTypes[name], `UNKNOWN_BROWSER:${name}`);
  for (const name of profileNames) assert(profileCatalog[name], `UNKNOWN_PROFILE:${name}`);
};

const collectErrors = page => {
  const errors = [];
  page.on('pageerror', error => errors.push(`pageerror:${error.message}`));
  page.on('console', message => {
    if (message.type() === 'error' && !message.text().startsWith('Failed to load resource:')) {
      errors.push(`console:${message.text()}`);
    }
  });
  page.on('response', response => {
    if (response.status() >= 400) {
      const url = new URL(response.url());
      if (url.pathname !== '/favicon.ico') errors.push(`response:${response.status()}:${url.pathname}`);
    }
  });
  return errors;
};

async function waitForStory(page, memberId) {
  await page.waitForFunction(
    id => document.documentElement.dataset.lawsSpatialActiveStory === id &&
      document.querySelector('[data-stage-content] .laws-spatial-stage__mount')?.dataset.storyMember === id &&
      !document.querySelector('.laws-spatial-environment')?.classList.contains('is-stage-loading'),
    memberId,
    { timeout: 15000 }
  );
}

async function assertShellIdentity(page, label) {
  const preserved = await page.evaluate(() =>
    Boolean(globalThis.__lawsRuntimeShell) &&
    globalThis.__lawsRuntimeShell === document.querySelector('.laws-spatial-environment') &&
    globalThis.__lawsRuntimeDocument === document
  );
  assert(preserved, `${label}:PERSISTENT_SHELL_IDENTITY_LOST`);
}

async function assertHitTarget(page, selector, label) {
  const locator = page.locator(selector).first();
  await locator.waitFor({ state: 'visible', timeout: 8000 });
  await locator.scrollIntoViewIfNeeded();
  const hit = await locator.evaluate((control, selectorValue) => {
    const rect = control.getBoundingClientRect();
    const x = Math.min(innerWidth - 1, Math.max(0, rect.left + rect.width / 2));
    const y = Math.min(innerHeight - 1, Math.max(0, rect.top + rect.height / 2));
    const target = document.elementFromPoint(x, y);
    return {
      width: rect.width,
      height: rect.height,
      disabled: Boolean(control.disabled),
      hit: Boolean(target && (target === control || control.contains(target) || target.closest?.(selectorValue) === control))
    };
  }, selector);
  assert(hit.width > 0 && hit.height > 0, `${label}:ZERO_SIZE_CONTROL`);
  assert(!hit.disabled, `${label}:DISABLED_CONTROL`);
  assert(hit.hit, `${label}:CONTROL_NOT_HIT_TESTABLE`);
}

async function shellSnapshot(page) {
  return page.evaluate(() => {
    const viewport = document.querySelector('[data-stage-viewport]');
    const style = viewport ? getComputedStyle(viewport) : null;
    const html = document.documentElement;
    return {
      shellCount: document.querySelectorAll('.laws-spatial-environment').length,
      shellReady: html.dataset.lawsSpatialShell,
      story: html.dataset.lawsSpatialActiveStory,
      family: html.dataset.lawsSpatialActiveFamily,
      lifecycle: html.dataset.lawsSpatialStageLifecycle,
      stageSource: html.dataset.lawsSpatialStageSource || '',
      path: location.pathname,
      search: location.search,
      bodyPosition: getComputedStyle(document.body).position,
      horizontalOverflow: Math.max(document.documentElement.scrollWidth, document.body?.scrollWidth || 0) - document.documentElement.clientWidth,
      stageOverflowY: style?.overflowY || '',
      stageClientHeight: viewport?.clientHeight || 0,
      stageScrollHeight: viewport?.scrollHeight || 0
    };
  });
}

function assertNoNestedStageTrap(snapshot, label) {
  const trappingOverflow = ['auto', 'scroll'].includes(snapshot.stageOverflowY) &&
    snapshot.stageScrollHeight > snapshot.stageClientHeight + 2;
  assert(!trappingOverflow, `${label}:NESTED_STAGE_SCROLL_TRAP`);
  assert(snapshot.horizontalOverflow <= 2, `${label}:HORIZONTAL_OVERFLOW:${snapshot.horizontalOverflow}`);
}

async function verifyReading(page, storyId, label) {
  await waitForStory(page, storyId);
  const group = page.locator('[data-stage-content] [data-lr-tabs]').first();
  await group.waitFor({ state: 'attached', timeout: 8000 });
  const buttons = group.locator('.lr-tab');
  const panels = group.locator('.lr-panel');
  const count = await buttons.count();
  assert(count > 0, `${label}:READING_BUTTONS_MISSING`);
  assert(await panels.count() === count, `${label}:READING_PANEL_COUNT_MISMATCH`);
  assert(await group.locator('.lr-tab[aria-expanded="true"]').count() === 0, `${label}:READING_NOT_COLLAPSED_ON_ENTRY`);

  const selector = `[data-stage-content] [data-lr-tabs] .lr-tab`;
  await assertHitTarget(page, selector, `${label}:READING`);
  await buttons.nth(0).click();
  assert(await buttons.nth(0).getAttribute('aria-expanded') === 'true', `${label}:READING_CLICK_NO_STATE_CHANGE`);
  assert(await panels.nth(0).isVisible(), `${label}:READING_PANEL_NOT_VISIBLE`);
  await buttons.nth(0).click();
  assert(await buttons.nth(0).getAttribute('aria-expanded') === 'false', `${label}:READING_COLLAPSE_FAILED`);

  if (count > 1) {
    await buttons.nth(1).focus();
    await page.keyboard.press('Enter');
    assert(await buttons.nth(1).getAttribute('aria-expanded') === 'true', `${label}:READING_KEYBOARD_ACTIVATION_FAILED`);
    assert(await panels.nth(1).isVisible(), `${label}:READING_KEYBOARD_PANEL_NOT_VISIBLE`);
  }
}

async function waitForMethodsState(page, expected) {
  await page.waitForFunction(value => {
    const root = document.querySelector('[data-stage-content] [data-mm-showroom]');
    if (!root) return false;
    return Object.entries(value).every(([key, target]) => root.dataset[key] === String(target));
  }, expected, { timeout: 10000 });
}

async function verifyMethods(page, label) {
  await waitForStory(page, 'STORY_03');
  await page.waitForFunction(() =>
    document.querySelector('[data-stage-content] .laws-spatial-stage__mount')?.dataset.methodsHydrated === 'true' &&
    document.documentElement.dataset.methodsModelsShowroom === 'active' &&
    document.documentElement.dataset.methodsModelsEuclideanShowroom === 'active',
    null,
    { timeout: 15000 }
  );

  const initial = await page.evaluate(() => {
    const root = document.querySelector('[data-stage-content] [data-mm-showroom]');
    return {
      exists: Boolean(root),
      staged: root?.dataset.lawsStagedInstrument,
      x: root?.dataset.mmX,
      y: root?.dataset.mmY,
      z: root?.dataset.mmZ,
      bodyPosition: getComputedStyle(document.body).position,
      refinementScriptPresent: [...document.scripts].some(s => s.src.includes('showroom-refinement.js'))
    };
  });
  assert(initial.exists && initial.staged === 'true', `${label}:METHODS_STAGE_NOT_READY`);
  assert(initial.x === '0' && initial.y === '0' && initial.z === '0', `${label}:METHODS_INITIAL_XYZ`);
  assert(initial.bodyPosition !== 'fixed', `${label}:METHODS_BODY_LOCK_CONTAMINATION`);
  assert(!initial.refinementScriptPresent, `${label}:REFINEMENT_RUNTIME_LEAKED_INTO_STAGE`);

  await assertHitTarget(page, '[data-stage-content] [data-mm-next]', `${label}:METHODS_X_NEXT`);
  await page.locator('[data-stage-content] [data-mm-next]').click();
  await waitForMethodsState(page, { mmX: '1' });

  const deck = page.locator('[data-stage-content] [data-mm-model-deck]').first();
  await deck.focus();
  await page.keyboard.press('ArrowDown');
  await waitForMethodsState(page, { mmY: '1' });

  await assertHitTarget(page, '[data-stage-content] [data-mm-family-next]', `${label}:METHODS_Z_NEXT`);
  await page.locator('[data-stage-content] [data-mm-family-next]').click();
  await waitForMethodsState(page, { mmZ: '1', mmX: '0' });

  const inspectSelector = '[data-stage-content] .mm-model-card[data-mm-x-position="active"] [data-mm-inspect]';
  await assertHitTarget(page, inspectSelector, `${label}:METHODS_INSPECT`);
  await page.locator(inspectSelector).click();
  await page.locator('dialog[open]').waitFor({ state: 'visible', timeout: 5000 });
  assert(await page.locator('dialog[open] [data-mm-dialog-title]').count() === 1, `${label}:METHODS_DIALOG_TITLE_MISSING`);
  await assertHitTarget(page, 'dialog[open] [data-mm-dialog-close]', `${label}:METHODS_DIALOG_CLOSE`);
  await page.locator('dialog[open] [data-mm-dialog-close]').click();
  await page.waitForFunction(() => !document.querySelector('dialog')?.open, null, { timeout: 5000 });

  await page.evaluate(() => {
    globalThis.__lawsRuntimeMethodsHolder = document.querySelector('[data-stage-content] .laws-spatial-stage__mount[data-story-member="STORY_03"]');
  });
}

async function verifyProfile(browserName, browser, profileName, viewport) {
  const context = await browser.newContext({ viewport });
  const page = await context.newPage();
  const errors = collectErrors(page);
  const response = await page.goto(`${BASE_URL}/laws/?story=1`, { waitUntil: 'domcontentloaded', timeout: 45000 });
  assert(response && response.status() === 200, `${browserName}/${profileName}:LAWS_ENTRY_HTTP`);
  await page.waitForSelector('html[data-laws-spatial-shell="ready"]', { timeout: 15000 });
  await waitForStory(page, 'STORY_01');

  await page.evaluate(() => {
    globalThis.__lawsRuntimeShell = document.querySelector('.laws-spatial-environment');
    globalThis.__lawsRuntimeDocument = document;
  });

  const initial = await shellSnapshot(page);
  assert(initial.shellCount === 1 && initial.shellReady === 'ready', `${browserName}/${profileName}:SHELL_NOT_READY`);
  assert(initial.lifecycle === 'retained-mount', `${browserName}/${profileName}:RETAINED_MOUNT_NOT_DECLARED`);
  assert(initial.path === '/laws/', `${browserName}/${profileName}:WRONG_ENTRY_PATH`);
  assertNoNestedStageTrap(initial, `${browserName}/${profileName}:STORY1`);
  await verifyReading(page, 'STORY_01', `${browserName}/${profileName}:STORY1`);

  await assertHitTarget(page, '[data-sequence-next]', `${browserName}/${profileName}:SEQUENCE_NEXT_1`);
  await page.locator('[data-sequence-next]').click();
  await waitForStory(page, 'STORY_02');
  await assertShellIdentity(page, `${browserName}/${profileName}:STORY2`);
  assert(new URL(page.url()).searchParams.get('story') === '2', `${browserName}/${profileName}:STORY2_HISTORY_STATE`);
  await verifyReading(page, 'STORY_02', `${browserName}/${profileName}:STORY2`);

  await page.locator('[data-sequence-next]').click();
  await waitForStory(page, 'STORY_03');
  await assertShellIdentity(page, `${browserName}/${profileName}:STORY3`);
  await verifyMethods(page, `${browserName}/${profileName}:STORY3`);
  const methodsSnapshot = await shellSnapshot(page);
  assertNoNestedStageTrap(methodsSnapshot, `${browserName}/${profileName}:STORY3`);

  await assertHitTarget(page, '[data-category-members] button[data-family="FLOW"]', `${browserName}/${profileName}:FLOW_CATEGORY`);
  await page.locator('[data-category-members] button[data-family="FLOW"]').click();
  await page.waitForFunction(() => document.querySelector('[data-category-core]')?.textContent.trim() === 'Flow', null, { timeout: 5000 });
  await assertHitTarget(page, '[data-family-members] [data-member-id="STORY_04"]', `${browserName}/${profileName}:STORY4_MEMBER`);
  await page.locator('[data-family-members] [data-member-id="STORY_04"]').click();
  await waitForStory(page, 'STORY_04');
  await assertShellIdentity(page, `${browserName}/${profileName}:STORY4`);

  const story4 = await shellSnapshot(page);
  assert(story4.path === '/laws/', `${browserName}/${profileName}:STORY4_DOCUMENT_NAVIGATION_OCCURRED`);
  assert(new URL(page.url()).searchParams.get('story') === '4', `${browserName}/${profileName}:STORY4_HISTORY_STATE`);
  assert(story4.stageSource.includes('/laws/categories/flow/signals'), `${browserName}/${profileName}:STORY4_STAGE_SOURCE`);
  assert(story4.bodyPosition !== 'fixed', `${browserName}/${profileName}:STORY4_BODY_LOCK`);
  assertNoNestedStageTrap(story4, `${browserName}/${profileName}:STORY4`);

  await page.evaluate(() => history.back());
  await waitForStory(page, 'STORY_03');
  await assertShellIdentity(page, `${browserName}/${profileName}:BACK_TO_STORY3`);
  const retainedMethods = await page.evaluate(() =>
    Boolean(globalThis.__lawsRuntimeMethodsHolder) &&
    globalThis.__lawsRuntimeMethodsHolder === document.querySelector('[data-stage-content] .laws-spatial-stage__mount[data-story-member="STORY_03"]')
  );
  assert(retainedMethods, `${browserName}/${profileName}:METHODS_MOUNT_NOT_RETAINED`);

  const beforeReentryX = await page.locator('[data-stage-content] [data-mm-showroom]').getAttribute('data-mm-x');
  assert(beforeReentryX === '0', `${browserName}/${profileName}:METHODS_REENTRY_STATE_DRIFT`);
  await page.locator('[data-stage-content] [data-mm-next]').click();
  await waitForMethodsState(page, { mmX: '1' });
  const afterReentryX = await page.locator('[data-stage-content] [data-mm-showroom]').getAttribute('data-mm-x');
  assert(afterReentryX === '1', `${browserName}/${profileName}:METHODS_REENTRY_CONTROL_DEAD_OR_DUPLICATED`);

  assert(errors.length === 0, `${browserName}/${profileName}:BROWSER_ERRORS:${errors.join('|')}`);

  const live = await shellSnapshot(page);
  assertNoNestedStageTrap(live, `${browserName}/${profileName}:FINAL_LIVE`);

  await page.goto(`${BASE_URL}/laws/?story=24`, { waitUntil: 'domcontentloaded', timeout: 45000 });
  await page.waitForSelector('html[data-laws-spatial-shell="ready"]', { timeout: 15000 });
  await waitForStory(page, 'STORY_24');
  assert(await page.locator('[data-sequence-next]').isDisabled(), `${browserName}/${profileName}:STORY24_NEXT_NOT_BOUNDED`);
  assert(!(await page.locator('[data-sequence-prev]').isDisabled()), `${browserName}/${profileName}:STORY24_PREV_DISABLED`);
  const terminal = await shellSnapshot(page);
  assertNoNestedStageTrap(terminal, `${browserName}/${profileName}:STORY24`);
  assert(errors.length === 0, `${browserName}/${profileName}:TERMINAL_BROWSER_ERRORS:${errors.join('|')}`);

  await context.close();
  return {
    browser: browserName,
    profile: profileName,
    persistentShell: true,
    readingStory1: true,
    readingStory2: true,
    methodsX: true,
    methodsY: true,
    methodsZ: true,
    methodsDialog: true,
    retainedMethodsMount: true,
    categoryStory4InShell: true,
    historyBackInShell: true,
    boundedStory24: true,
    nestedStageScrollTrap: false,
    bodyLockContamination: false,
    browserErrors: 0
  };
}

async function main() {
  ensureMatrix();
  const matrix = [];
  for (const browserName of browserNames) {
    const browser = await browserTypes[browserName].launch({ headless: true });
    try {
      for (const profileName of profileNames) {
        matrix.push(await verifyProfile(browserName, browser, profileName, profileCatalog[profileName]));
      }
    } finally {
      await browser.close();
    }
  }

  const normalized = {
    contract: 'LAWS_PERSISTENT_STAGE_BROWSER_FUNCTIONAL_RECEIPT_v2',
    subjectHead: SUBJECT_HEAD,
    browserNames,
    profileNames,
    matrix
  };
  const normalizedFingerprint = crypto.createHash('sha256').update(JSON.stringify(normalized)).digest('hex');
  const receipt = {
    ...normalized,
    role: ROLE,
    status: 'PASS',
    normalizedFingerprint
  };
  fs.mkdirSync(path.dirname(OUTPUT), { recursive: true });
  fs.writeFileSync(OUTPUT, JSON.stringify(receipt, null, 2) + '\n');
  console.log(JSON.stringify(receipt, null, 2));
}

main().catch(error => {
  const failure = {
    contract: 'LAWS_PERSISTENT_STAGE_BROWSER_FUNCTIONAL_RECEIPT_v2',
    subjectHead: SUBJECT_HEAD,
    role: ROLE,
    status: 'FAIL',
    message: error.stack || String(error)
  };
  fs.mkdirSync(path.dirname(OUTPUT), { recursive: true });
  fs.writeFileSync(OUTPUT, JSON.stringify(failure, null, 2) + '\n');
  console.error(error.stack || String(error));
  process.exit(1);
});
