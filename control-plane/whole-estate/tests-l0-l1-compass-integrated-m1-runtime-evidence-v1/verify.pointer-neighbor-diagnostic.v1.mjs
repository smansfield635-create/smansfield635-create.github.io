import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';

const BASE_URL = process.env.M1_BASE_URL || 'http://127.0.0.1:4173';
const ROUTE = '/control-plane/whole-estate/tests-l0-l1-compass-integrated-m1-v1/';
const OUT = process.env.M1_RUNTIME_EVIDENCE_DIR || '/tmp/m1-compass-integrated-runtime-diagnostic';
const SUBJECT = '0c84cc4bb5b75245d225a47fde68d3de879cdaed';
const TARGETS = ['METHODS', 'ROUTE_OPERATOR_PLATFORM', 'PROSPECTIVE_FINAL_REPORT_PORTFOLIO'];
const REPEATS = 6;

fs.mkdirSync(OUT, { recursive: true });
const checks = [];
const failures = [];
let assertions = 0;

function record(name, condition, details = null) {
  assertions += 1;
  const entry = { name, status: condition ? 'PASS' : 'FAIL', details };
  checks.push(entry);
  if (!condition) failures.push(entry);
}

async function settle(page) {
  await page.evaluate(() => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve))));
  await page.waitForTimeout(220);
}

async function capture(page) {
  return page.evaluate(() => {
    const viewport = document.querySelector('#spatial-viewport');
    const viewportRect = viewport.getBoundingClientRect();
    const nodes = [...document.querySelectorAll('.object-node')].map((node) => {
      const rect = node.getBoundingClientRect();
      const style = getComputedStyle(node);
      return {
        id: node.dataset.objectId,
        active: node.dataset.active,
        pressed: node.getAttribute('aria-pressed'),
        tabIndex: node.tabIndex,
        opacity: Number(style.opacity),
        display: style.display,
        visibility: style.visibility,
        width: rect.width,
        height: rect.height,
        left: rect.left - viewportRect.left,
        top: rect.top - viewportRect.top,
        visible: rect.width > 0 && rect.height > 0 && style.display !== 'none' && style.visibility !== 'hidden' && Number(style.opacity) > 0.1,
      };
    });
    const relations = [...document.querySelectorAll('#relation-paths path[data-relation-id]')].map((node) => ({
      id: node.dataset.relationId,
      d: node.getAttribute('d') || '',
    }));
    const nav = globalThis.__M1_COMPASS_INTEGRATED_API__?.getNavigationState?.() ?? null;
    const receipt = globalThis.__M1_COMPASS_INTEGRATED_RECEIPT__ ?? null;
    return {
      nav,
      receipt,
      nodes,
      relations,
      counts: {
        nodes: nodes.length,
        visible: nodes.filter((node) => node.visible).length,
        active: nodes.filter((node) => node.active === 'true').length,
        pressed: nodes.filter((node) => node.pressed === 'true').length,
        tabStops: nodes.filter((node) => node.tabIndex === 0).length,
      },
    };
  });
}

let browser;
try {
  browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
  const page = await context.newPage();
  const consoleErrors = [];
  const pageErrors = [];
  page.on('console', (message) => { if (message.type() === 'error') consoleErrors.push(message.text()); });
  page.on('pageerror', (error) => pageErrors.push(String(error)));

  await page.goto(BASE_URL + ROUTE, { waitUntil: 'domcontentloaded' });
  await page.waitForFunction(() => Boolean(globalThis.__M1_COMPASS_INTEGRATED_API__), null, { timeout: 15000 });
  await page.waitForFunction(() => document.querySelectorAll('.object-node').length === 3, null, { timeout: 15000 });
  await settle(page);

  for (let repeat = 1; repeat <= REPEATS; repeat += 1) {
    for (const target of TARGETS) {
      await page.locator(`[data-object-id="${target}"]`).click();
      await settle(page);
      const snapshot = await capture(page);
      const prefix = `R${repeat}:${target}`;
      record(`${prefix}:TARGET_ACTIVE`, snapshot.nav?.activeObject === target, snapshot);
      record(`${prefix}:THREE_NODES`, snapshot.counts.nodes === 3, snapshot.counts);
      record(`${prefix}:THREE_VISIBLE`, snapshot.counts.visible === 3, snapshot.nodes);
      record(`${prefix}:ONE_ACTIVE`, snapshot.counts.active === 1, snapshot.counts);
      record(`${prefix}:ONE_PRESSED`, snapshot.counts.pressed === 1, snapshot.counts);
      record(`${prefix}:ONE_TAB_STOP`, snapshot.counts.tabStops === 1, snapshot.counts);
      record(`${prefix}:TARGET_NODE_ACTIVE`, snapshot.nodes.find((node) => node.id === target)?.active === 'true', snapshot.nodes);
      record(`${prefix}:NEIGHBORS_VISIBLE`, snapshot.nodes.filter((node) => node.id !== target).every((node) => node.visible), snapshot.nodes);
      record(`${prefix}:RELATIONS_VALID`, snapshot.relations.length === 2 && snapshot.relations.every((relation) => relation.d.startsWith('M ') && !relation.d.includes('NaN')), snapshot.relations);
      record(`${prefix}:SEMANTIC_MUTATION_FALSE`, snapshot.receipt?.semanticMutation === false && snapshot.receipt?.scientificStateMutation === false, snapshot.receipt);
    }
  }

  record('RUNTIME:NO_CONSOLE_ERRORS', consoleErrors.length === 0, consoleErrors);
  record('RUNTIME:NO_PAGE_ERRORS', pageErrors.length === 0, pageErrors);
  if (failures.length) await page.screenshot({ path: path.join(OUT, 'pointer-neighbor-diagnostic-failure.png'), fullPage: true });
  await context.close();
} catch (error) {
  failures.push({ name: 'HARNESS_FATAL', status: 'FAIL', details: String(error?.stack || error) });
} finally {
  if (browser) await browser.close();
}

const result = {
  schema: 'M1_COMPASS_INTEGRATED_POINTER_NEIGHBOR_DIAGNOSTIC_RECEIPT_v1',
  subject: SUBJECT,
  status: failures.length === 0 ? 'PASS_POINTER_NEIGHBOR_DIAGNOSTIC' : 'FAIL_POINTER_NEIGHBOR_DIAGNOSTIC',
  repeats: REPEATS,
  targetCount: TARGETS.length,
  assertions,
  passed: checks.filter((entry) => entry.status === 'PASS').length,
  failed: failures.length,
  checks,
  failures,
  purpose: 'RETEST_THE_SINGLE_INTERNALLY_INCONSISTENT_NEIGHBOR_RETENTION_ASSERTION_FROM_RUNTIME_REVIEW_ATTEMPT_1_WITH_SETTLED_FRAMES_AND_INDEPENDENT_PREDICATES',
  candidateMutation: false,
};

fs.writeFileSync(path.join(OUT, 'pointer-neighbor-diagnostic-receipt.v1.json'), JSON.stringify(result, null, 2) + '\n');
console.log(JSON.stringify(result, null, 2));
if (failures.length) process.exit(1);
