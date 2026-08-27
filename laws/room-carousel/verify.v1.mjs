#!/usr/bin/env node
import fs from 'node:fs';
import { execFileSync } from 'node:child_process';

const CONTRACT_PATH = 'laws/room-carousel/preconstruction-contract.v1.json';
const CSS_PATH = 'laws/room-carousel/room-carousel.v1.css';
const JS_PATH = 'laws/room-carousel/room-carousel.v1.js';
const STATIC_VERIFIER = 'scripts/verify-laws-cp6-final-synchronization.py';
const BROWSER_VERIFIER = 'scripts/laws_cp6_final_browser_verify.mjs';
const EXPECTED_SCHEMA = 'LAWS_CAROUSEL_PRODUCT_ROLLBACK_CONTRACT_v1';
const EXPECTED_OPERATION = 'LAWS_CAROUSEL_PRODUCT_ROLLBACK_CURRENT_HARNESS_20260827_001';
const EXPECTED_GENERATION = 1746;
const EXPECTED_BASE = 'eab4c7c57667e6ab285c4bc16c45f26e238cadef';
const EXPECTED_DONOR = 'd583e033392c306f6dab55cabc22055a0f216219';
const EXPECTED_ASSET = 'LAWS_GEN1746_D583_PRODUCT_ROLLBACK_20260827B';
const DONOR_ASSET = 'LAWS_BACK_PAGE_CAROUSEL_CORRECTION_20260825A';
const CURRENT_SHELL_OVERLAY_FIX = `html[data-lrc-inspection-open="true"] .lr-topbar {
  visibility: hidden;
  pointer-events: none;
}`;

const contract = JSON.parse(fs.readFileSync(CONTRACT_PATH, 'utf8'));
const failures = [];
const fail = message => failures.push(message);
const git = (...args) => execFileSync('git', args, { encoding: 'utf8' }).trim();
const gitRaw = (...args) => execFileSync('git', args, { encoding: 'utf8' });
const source = path => fs.readFileSync(path, 'utf8');

if (contract.schema !== EXPECTED_SCHEMA || contract.status !== 'ACTIVE_FAIL_CLOSED') fail('CONTRACT_SCHEMA_OR_STATUS');
if (contract.operationId !== EXPECTED_OPERATION || contract.lockGeneration !== EXPECTED_GENERATION) fail('OPERATION_BINDING');
if (contract.exactGoverningHead !== EXPECTED_BASE || contract.knownGoodProductBaseline !== EXPECTED_DONOR) fail('COMMIT_BINDING');
if (contract.assetIdentity !== EXPECTED_ASSET) fail('ASSET_IDENTITY_BINDING');
if (!Array.isArray(contract.routeInventory) || contract.routeInventory.length !== 29 || new Set(contract.routeInventory).size !== 29) fail('ROUTE_INVENTORY');
if (!Array.isArray(contract.storyRouteInventory) || contract.storyRouteInventory.length !== 23 || new Set(contract.storyRouteInventory).size !== 23) fail('STORY_ROUTE_INVENTORY');
if (contract.navigationHierarchy?.greaterLawsCarousel !== 'BOTTOM_PREVIOUS_NEXT_ROUTE_HANDOFF') fail('GREATER_CAROUSEL_CONTRACT');
if (contract.navigationHierarchy?.pageCarousel !== 'TOP_NUMBERED_RAIL_PLUS_SWIPE_DRAG_KEYBOARD') fail('PAGE_CAROUSEL_CONTRACT');
if (contract.navigationHierarchy?.openedCard !== 'INTERNAL_READING_TABS_ONLY_INSIDE_ACTIVE_CARD') fail('OPENED_CARD_CONTRACT');
if (contract.navigationHierarchy?.return !== 'RETURN_TO_ORBIT_RESTORES_SAME_PAGE_CAROUSEL_INDEX') fail('RETURN_CONTRACT');
if (contract.productBindings?.sharedCarouselCss !== 'D583_PLUS_CURRENT_STICKY_HEADER_INSPECTION_COMPATIBILITY') fail('CSS_LINEAGE_CONTRACT');
if (contract.productBindings?.currentShellCompatibility !== 'HIDE_STICKY_LAWS_TOPBAR_ONLY_WHILE_CARD_INSPECTION_IS_OPEN') fail('CURRENT_SHELL_COMPATIBILITY_CONTRACT');

const actualHead = git('rev-parse', 'HEAD');
const actualParent = git('rev-parse', 'HEAD^');
if (actualParent !== EXPECTED_BASE) fail(`CANDIDATE_PARENT:${actualParent}`);

const harnessPaths = [CONTRACT_PATH, 'laws/room-carousel/verify.v1.mjs', STATIC_VERIFIER, BROWSER_VERIFIER];
const expectedChangedPaths = new Set([...contract.routeInventory, CSS_PATH, JS_PATH, ...harnessPaths]);
const changedPaths = git('diff', '--name-only', `${EXPECTED_BASE}..${actualHead}`).split('\n').filter(Boolean);
const unrelated = changedPaths.filter(path => !expectedChangedPaths.has(path));
const missingChanges = [...expectedChangedPaths].filter(path => !changedPaths.includes(path));
if (changedPaths.length !== 35 || unrelated.length || missingChanges.length) fail(`CHANGED_PATHS:${changedPaths.length}:${unrelated.join(',')}:${missingChanges.join(',')}`);

const expectedJsBlob = git('rev-parse', `${EXPECTED_DONOR}:${JS_PATH}`);
const actualJsBlob = git('hash-object', JS_PATH);
if (actualJsBlob !== expectedJsBlob) fail(`D583_PRODUCT_BLOB:${JS_PATH}:${actualJsBlob}:${expectedJsBlob}`);

const css = source(CSS_PATH);
if ((css.match(/html\[data-lrc-inspection-open="true"\] \.lr-topbar/g) || []).length !== 1) fail('CURRENT_SHELL_OVERLAY_FIX_COUNT');
const normalizedCss = css.replace(`${CURRENT_SHELL_OVERLAY_FIX}\n\n`, '');
if (normalizedCss !== gitRaw('show', `${EXPECTED_DONOR}:${CSS_PATH}`)) fail('D583_CSS_LINEAGE_WITH_CURRENT_SHELL_FIX');

const expectedCssHref = `/laws/room-carousel/room-carousel.v1.css?v=${EXPECTED_ASSET}`;
const expectedJsSrc = `/laws/room-carousel/room-carousel.v1.js?v=${EXPECTED_ASSET}`;
const storyRoutes = new Set(contract.storyRouteInventory);
for (const path of contract.routeInventory) {
  const html = source(path);
  if ((html.match(/data-laws-room-carousel/g) || []).length !== 1) fail(`CAROUSEL_ROOT:${path}`);
  if ((html.match(new RegExp(expectedCssHref.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')) || []).length !== 1) fail(`CAROUSEL_CSS_IDENTITY:${path}`);
  if ((html.match(new RegExp(expectedJsSrc.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')) || []).length !== 1) fail(`CAROUSEL_JS_IDENTITY:${path}`);
  if (html.includes('information-depth.v1.css')) fail(`INERT_INFORMATION_DEPTH_REFERENCED:${path}`);
  const normalized = html.split(EXPECTED_ASSET).join(DONOR_ASSET);
  if (normalized !== gitRaw('show', `${EXPECTED_DONOR}:${path}`)) fail(`D583_HTML_LINEAGE:${path}`);
  const rootStart = html.indexOf('data-laws-room-carousel');
  const rootEnd = html.indexOf('</main>', rootStart);
  const internalTabs = html.indexOf('data-lr-tabs');
  if (internalTabs >= 0 && !(rootStart >= 0 && rootEnd > rootStart && internalTabs > rootStart && internalTabs < rootEnd)) fail(`INTERNAL_TABS_OUTSIDE_CAROUSEL_ROOT:${path}`);
  if (storyRoutes.has(path)) {
    const nav = html.match(/<nav class="lr-story-nav"[^>]*>([\s\S]*?)<\/nav>/)?.[1] || '';
    if (!nav || (nav.match(/<a href=/g) || []).length !== 2 || !nav.includes('Previous')) fail(`BOTTOM_PREVIOUS_NEXT:${path}`);
  }
}

const runtime = source(JS_PATH);
for (const [marker, code] of [
  ['const CONTRACT = "LAWS_ROOM_CAROUSEL_BACK_PAGE_PARITY_v3"', 'RUNTIME_CONTRACT'],
  ['root.insertBefore(tabs, viewport)', 'TOP_NUMBERED_RAIL'],
  [':scope > [data-lrc-source-child]', 'CARD_INTERNAL_SOURCE'],
  ['↶ Return to Orbit', 'RETURN_TO_ORBIT_LABEL'],
  ['[data-lrc-return]', 'RETURN_TO_ORBIT_CONTROL'],
  ['details.lr-audit,.lr-story-nav,[data-lrc-depth]', 'BOTTOM_NAV_EXCLUSION'],
  ['state.index = wrap(next, cards.length)', 'PAGE_CAROUSEL_SELECTION'],
  ['pointermove', 'DRAG_NAVIGATION']
]) if (!runtime.includes(marker)) fail(code);
if (runtime.includes('viewport.after(tabs)')) fail('NUMBERED_RAIL_BELOW_CAROUSEL');

if (!css.includes('[data-lrc-tabs]') || !css.includes('[data-lrc-card][data-inspecting="true"] > [data-lrc-source-child]')) fail('CAROUSEL_STYLE_HIERARCHY');
if (!css.includes(CURRENT_SHELL_OVERLAY_FIX)) fail('RETURN_TO_ORBIT_STICKY_HEADER_PROTECTION');
for (const protectedPath of ['laws/research/methods-and-models', 'laws/room-carousel/information-depth.v1.css', 'laws/index.html', 'assets/laws-destination']) {
  if (git('diff', '--name-only', `${EXPECTED_BASE}..${actualHead}`, '--', protectedPath)) fail(`PROTECTED_PATH_DRIFT:${protectedPath}`);
}

const receipt = {
  schema: 'LAWS_CAROUSEL_PRODUCT_ROLLBACK_STATIC_RECEIPT_v1',
  result: failures.length ? 'FAIL_CLOSED' : 'PASS',
  operationId: EXPECTED_OPERATION,
  lockGeneration: EXPECTED_GENERATION,
  exactBase: EXPECTED_BASE,
  exactHead: actualHead,
  knownGoodProductBaseline: EXPECTED_DONOR,
  changedPathCount: changedPaths.length,
  routeCount: contract.routeInventory.length,
  storyRouteCount: contract.storyRouteInventory.length,
  topNumberedPageCarousel: failures.includes('TOP_NUMBERED_RAIL') ? 'FAIL' : 'PASS',
  bottomPreviousNextGreaterCarousel: failures.some(item => item.startsWith('BOTTOM_PREVIOUS_NEXT')) ? 'FAIL' : 'PASS',
  internalTabsInsideOpenedCard: failures.some(item => item.includes('INTERNAL_')) ? 'FAIL' : 'PASS',
  returnToOrbitControl: failures.some(item => item.startsWith('RETURN_TO_ORBIT')) ? 'FAIL' : 'PASS',
  currentShellReturnOverlay: failures.some(item => item.includes('CURRENT_SHELL') || item.includes('STICKY_HEADER')) ? 'FAIL' : 'PASS',
  failures
};
console.log(JSON.stringify(receipt, null, 2));
if (failures.length) process.exit(1);
