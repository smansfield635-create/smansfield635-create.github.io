import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const BASE = '6a9b35100bd0207187ce07d3155db9eebd757922';
const BRANCH = 'agent/laws-cp6-direct-language-hierarchy-correction-001';
const mode = process.argv[2] || 'static';
const EVIDENCE_DIR = process.env.EVIDENCE_DIR || 'cp6-direct-evidence';

const PROTECTED_PATHS = [
  'laws/index.compositor.js',
  'laws/index.controller.js',
  'laws/index.cosmos.js',
  'laws/index.crystals.js',
  'laws/index.interactions.js',
  'laws/index.planet.js',
  'assets/audralia/audralia.planet.js'
];

const DESTINATIONS = [
  ['/laws/test/admission-and-baseline/', 'laws/test/admission-and-baseline/index.html'],
  ['/laws/test/forward-construction/', 'laws/test/forward-construction/index.html'],
  ['/laws/test/reverse-audit/', 'laws/test/reverse-audit/index.html'],
  ['/laws/test/result-and-record/', 'laws/test/result-and-record/index.html'],
  ['/laws/research/evidence-and-sources/', 'laws/research/evidence-and-sources/index.html'],
  ['/laws/research/methods-and-models/', 'laws/research/methods-and-models/index.html'],
  ['/laws/research/applied-investigations/', 'laws/research/applied-investigations/index.html'],
  ['/laws/research/findings-and-boundaries/', 'laws/research/findings-and-boundaries/index.html']
];

function run(...args) {
  return execFileSync(args[0], args.slice(1), { encoding: 'utf8' }).trim();
}

function lines(value) {
  return value ? value.split(/\r?\n/).filter(Boolean) : [];
}

function count(source, needle) {
  return source.split(needle).length - 1;
}

function ensureDir(directory) {
  fs.mkdirSync(directory, { recursive: true });
}

function writeJson(file, value) {
  ensureDir(path.dirname(file));
  fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`, 'utf8');
}

function extractBalanced(source, marker, tagName) {
  const start = source.indexOf(marker);
  if (start < 0) throw new Error(`missing marker: ${marker}`);
  const token = new RegExp(`<${tagName}\\b[^>]*>|<\\/${tagName}\\s*>`, 'gi');
  token.lastIndex = start;
  let depth = 0;
  let match;
  while ((match = token.exec(source))) {
    if (match[0].toLowerCase().startsWith(`</${tagName}`)) {
      depth -= 1;
      if (depth === 0) return source.slice(start, token.lastIndex);
    } else {
      depth += 1;
    }
  }
  throw new Error(`unbalanced ${tagName} block at ${marker}`);
}

function staticVerification() {
  const html = fs.readFileSync('laws/index.html', 'utf8');
  const css = fs.readFileSync('laws/index.css', 'utf8');
  const cp61 = JSON.parse(fs.readFileSync('laws/control-plane/cp6-1/verification-receipt.json', 'utf8'));
  const cp645 = JSON.parse(fs.readFileSync('laws/control-plane/cp6-4-5/verification-receipt.json', 'utf8'));
  const mergeBase = run('git', 'merge-base', 'HEAD', BASE);
  const head = run('git', 'rev-parse', 'HEAD');
  const changedPaths = lines(run('git', 'diff', '--name-only', BASE));
  const protectedDiff = lines(run('git', 'diff', '--name-only', BASE, '--', ...PROTECTED_PATHS));
  const destinationDiff = lines(run('git', 'diff', '--name-only', BASE, '--', ...DESTINATIONS.map(([, file]) => file)));
  const canonicalRecordDiff = lines(run('git', 'diff', '--name-only', BASE, '--', 'laws/research', 'laws/test', 'laws/categories'));
  const compatibilityReceiptDiff = lines(run('git', 'diff', '--name-only', BASE, '--', 'laws/control-plane/cp6-1/verification-receipt.json', 'laws/control-plane/cp6-1/cp6-2-route-contract.json'));

  const allowed = new Set([
    '.github/workflows/laws-cp6-direct-language-hierarchy.yml',
    'laws/index.html',
    'laws/index.css',
    'tools/laws-cp6-direct-language-hierarchy-transform.mjs',
    'tools/laws-cp6-direct-language-hierarchy-verify.mjs'
  ]);
  const changedPathViolations = changedPaths.filter(file => !allowed.has(file));

  const first = extractBalanced(html, '<section aria-labelledby="research-comes-first-title"', 'section');
  const mainStart = html.indexOf('<main class="laws-estate" id="main">');
  const mainEnd = html.indexOf('</main>', mainStart);
  const main = html.slice(mainStart, mainEnd);
  const order = [
    ['DIRECT_RESEARCH_COMES_FIRST', 'id="research-comes-first"'],
    ['LAWS_COMPASS', 'data-laws-compass-primary=""'],
    ['PRACTICAL_EXPLANATION', 'data-laws-practical-opening=""'],
    ['SUPPORTING_CONTENT', 'data-laws-progressive-disclosure=""']
  ].map(([name, marker]) => ({ name, position: main.indexOf(marker) }));

  const requiredFirstText = [
    'Research comes F.I.R.S.T.',
    'Research begins with five questions:',
    'What changed?',
    'What remained intact?',
    'What does the evidence show?',
    'What structures or limits shaped the result?',
    'What was actually tested?',
    'What changed, moved, or developed?',
    'What remained consistent, complete, and traceable?',
    'What does the available evidence actually establish?',
    'What conditions, boundaries, and limitations shaped the result?',
    'What was tested, how was it tested, and what happened?',
    'Research brings those records together, preserves uncertainty, and distinguishes findings from conclusions that have not yet been established.'
  ];
  const prohibitedFirstTerms = [
    'geometric grammar',
    'crossing narrative',
    'relational field',
    'tether',
    'lattice',
    'spatial object',
    'rendering controls',
    'lens controls',
    'motion controls',
    'prototype status'
  ];

  const routePresence = Object.fromEntries(DESTINATIONS.map(([route]) => [route, html.includes(route)]));
  const directDetailsClosed = /<details class="laws-first__disclosure"[^>]*>/i.test(first) && !/<details class="laws-first__disclosure"[^>]*\sopen(?:\s|=|>)/i.test(first);
  const supportPanelCount = count(html, 'data-laws-supporting-panel=');
  const openSupportingMarkup = /<details class="laws-orientation-panel"[^>]*\sopen(?:\s|=|>)/i.test(html);

  const report = {
    contract: 'LAWS_CP6_DIRECT_LANGUAGE_AND_HIERARCHY_STATIC_VERIFICATION_v1',
    repository: 'smansfield635-create/smansfield635-create.github.io',
    branch: BRANCH,
    baseHead: BASE,
    inspectedHead: head,
    mergeBase,
    sourceOrder: order,
    sourceOrderPass: order.every(item => item.position >= 0) && order.every((item, index) => index === 0 || item.position > order[index - 1].position),
    firstDisclosureCount: count(html, 'data-laws-first-disclosure='),
    firstDisclosureDefaultClosed: directDetailsClosed,
    firstRequiredLanguage: Object.fromEntries(requiredFirstText.map(text => [text, first.includes(text)])),
    firstProhibitedLanguage: Object.fromEntries(prohibitedFirstTerms.map(text => [text, first.toLowerCase().includes(text)])),
    formerCompactSequenceCount: count(html, 'laws-first__compact-sequence'),
    rawJsonReceiptDisclosureCount: count(html, 'laws-raw-receipt-disclosure'),
    compassCount: count(html, 'id="laws-orbit"'),
    practicalHeadingLevel: first.includes('laws-practical-opening-title') ? 'INVALID_NESTING' : html.includes('<h2 id="laws-practical-opening-title">') ? 'H2' : 'MISSING',
    supportPanelCount,
    supportPanelsDefaultClosed: supportPanelCount === 3 && !openSupportingMarkup,
    routePresence,
    canonicalDestinationCount: cp645.canonical_destination_page_count,
    migratedRecordCustody: cp645.cp6_3_migrated_rows_preserved,
    compatibilityBindingCount: cp61.compatibility_review.compatibility_binding_count,
    completeCompatibilityBindings: cp61.compatibility_review.complete_compatibility_bindings,
    incompleteCompatibilityBindings: cp61.compatibility_review.incomplete_compatibility_bindings,
    protectedRuntimeDiff: protectedDiff,
    destinationPageDiff: destinationDiff,
    canonicalRecordDiff,
    compatibilityReceiptDiff,
    changedPaths,
    changedPathViolations,
    htmlSentinel: html.includes('data-cp6-direct-language-hierarchy="true"'),
    cssSentinel: css.includes('LAWS_CP6_DIRECT_LANGUAGE_AND_HIERARCHY_CORRECTION_v1')
  };

  report.pass = Boolean(
    mergeBase === BASE &&
    report.sourceOrderPass &&
    report.firstDisclosureCount === 1 &&
    report.firstDisclosureDefaultClosed &&
    Object.values(report.firstRequiredLanguage).every(Boolean) &&
    !Object.values(report.firstProhibitedLanguage).some(Boolean) &&
    report.formerCompactSequenceCount === 0 &&
    report.rawJsonReceiptDisclosureCount === 0 &&
    report.compassCount === 1 &&
    report.practicalHeadingLevel === 'H2' &&
    report.supportPanelsDefaultClosed &&
    Object.values(routePresence).every(Boolean) &&
    report.canonicalDestinationCount === 8 &&
    report.migratedRecordCustody === '48_OF_48' &&
    report.compatibilityBindingCount === 9 &&
    report.completeCompatibilityBindings === 9 &&
    report.incompleteCompatibilityBindings === 0 &&
    protectedDiff.length === 0 &&
    destinationDiff.length === 0 &&
    canonicalRecordDiff.length === 0 &&
    compatibilityReceiptDiff.length === 0 &&
    changedPathViolations.length === 0 &&
    report.htmlSentinel &&
    report.cssSentinel
  );

  writeJson(`${EVIDENCE_DIR}/static-verification.json`, report);
  console.log(JSON.stringify(report, null, 2));
  if (!report.pass) process.exit(1);
  return report;
}

async function browserVerification() {
  const { chromium } = await import('playwright');
  const baseUrl = process.env.BASE_URL || 'http://127.0.0.1:4173';
  const viewports = {
    phone: { width: 390, height: 844 },
    tablet: { width: 820, height: 1180 },
    desktop: { width: 1440, height: 1000 }
  };
  const browser = await chromium.launch({ headless: true });
  const results = [];
  const failures = [];
  ensureDir(EVIDENCE_DIR);

  for (const [id, viewport] of Object.entries(viewports)) {
    const context = await browser.newContext({ viewport, reducedMotion: 'reduce' });
    const page = await context.newPage();
    const consoleErrors = [];
    const pageErrors = [];
    page.on('console', message => {
      if (message.type() === 'error') consoleErrors.push(message.text());
    });
    page.on('pageerror', error => pageErrors.push(String(error)));

    await page.goto(`${baseUrl}/laws/`, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(3500);

    const initial = await page.evaluate(expectedRoutes => {
      const rect = element => {
        const value = element?.getBoundingClientRect();
        return value ? {
          top: Number(value.top.toFixed(2)),
          bottom: Number(value.bottom.toFixed(2)),
          left: Number(value.left.toFixed(2)),
          right: Number(value.right.toFixed(2)),
          width: Number(value.width.toFixed(2)),
          height: Number(value.height.toFixed(2))
        } : null;
      };
      const first = document.querySelector('[data-laws-first-disclosure]');
      const firstSection = document.querySelector('#research-comes-first');
      const compass = document.querySelector('[data-laws-compass-primary]');
      const practical = document.querySelector('[data-laws-practical-opening]');
      const support = document.querySelector('[data-laws-progressive-disclosure]');
      const header = document.querySelector('.laws-topbar');
      const scripts = [...document.querySelectorAll('script[src]')].map(script => script.getAttribute('src'));
      const hrefs = new Set([...document.querySelectorAll('a[href]')].map(anchor => anchor.getAttribute('href')));
      const skip = document.querySelector('.skip');
      const skipRect = rect(skip);
      const firstRect = rect(firstSection);
      const compassRect = rect(compass);
      const order = [...document.querySelector('main').children].map(element => {
        if (element.id === 'research-comes-first') return 'RESEARCH_COMES_FIRST';
        if (element.hasAttribute('data-laws-compass-primary')) return 'LAWS_COMPASS';
        if (element.hasAttribute('data-laws-practical-opening')) return 'PRACTICAL_EXPLANATION';
        if (element.hasAttribute('data-laws-progressive-disclosure')) return 'SUPPORTING_CONTENT';
        return element.tagName;
      });
      return {
        order,
        firstOpen: Boolean(first?.open),
        firstRect,
        compassRect,
        practicalRect: rect(practical),
        supportRect: rect(support),
        headerRect: rect(header),
        compassVisibleInInitialViewport: Boolean(compassRect && compassRect.top < innerHeight && compassRect.bottom > 0),
        firstVerticalShare: firstRect ? Number((firstRect.height / innerHeight).toFixed(4)) : null,
        horizontalOverflow: Math.max(0, document.documentElement.scrollWidth - document.documentElement.clientWidth),
        supportOpenCount: document.querySelectorAll('[data-laws-supporting-panel][open]').length,
        rawReceiptCount: document.querySelectorAll('.laws-raw-receipt-disclosure').length,
        routePresence: Object.fromEntries(expectedRoutes.map(route => [route, hrefs.has(route)])),
        protectedScriptsPresent: [
          '/laws/index.controller.js',
          '/laws/index.compositor.js',
          '/laws/index.crystals.js',
          '/laws/index.interactions.js',
          '/laws/index.cosmos.js',
          '/laws/index.planet.js'
        ].every(required => scripts.some(src => src?.startsWith(required))),
        skipInitiallyHidden: Boolean(skipRect && (skipRect.left < -1000 || skipRect.width <= 1))
      };
    }, DESTINATIONS.map(([route]) => route));

    await page.locator('[data-laws-first-disclosure] > summary').click();
    await page.waitForTimeout(150);
    const expanded = await page.evaluate(() => ({
      open: document.querySelector('[data-laws-first-disclosure]')?.open === true,
      visibleQuestionCount: [...document.querySelectorAll('[data-laws-first-disclosure] [data-first-entry]')].filter(element => {
        const rect = element.getBoundingClientRect();
        const style = getComputedStyle(element);
        return rect.width > 0 && rect.height > 0 && style.display !== 'none' && style.visibility !== 'hidden';
      }).length
    }));
    await page.locator('[data-laws-first-disclosure] > summary').click();

    await page.screenshot({ path: `${EVIDENCE_DIR}/candidate-${id}.png`, fullPage: true });

    const expectedOrder = ['RESEARCH_COMES_FIRST', 'LAWS_COMPASS', 'PRACTICAL_EXPLANATION', 'SUPPORTING_CONTENT'];
    const filteredOrder = initial.order.filter(item => expectedOrder.includes(item));
    const pass = Boolean(
      JSON.stringify(filteredOrder) === JSON.stringify(expectedOrder) &&
      initial.firstOpen === false &&
      initial.compassVisibleInInitialViewport &&
      initial.firstVerticalShare !== null && initial.firstVerticalShare <= 0.42 &&
      initial.horizontalOverflow === 0 &&
      initial.supportOpenCount === 0 &&
      initial.rawReceiptCount === 0 &&
      Object.values(initial.routePresence).every(Boolean) &&
      initial.protectedScriptsPresent &&
      initial.skipInitiallyHidden &&
      expanded.open && expanded.visibleQuestionCount === 6 &&
      consoleErrors.length === 0 && pageErrors.length === 0
    );

    const record = { id, viewport, pass, initial, expanded, consoleErrors, pageErrors };
    results.push(record);
    if (!pass) failures.push(record);
    await context.close();
  }

  await browser.close();
  const report = {
    contract: 'LAWS_CP6_DIRECT_LANGUAGE_AND_HIERARCHY_BROWSER_VERIFICATION_v1',
    result: failures.length === 0 ? 'PASS' : 'FAIL',
    baseUrl,
    results,
    failures
  };
  writeJson(`${EVIDENCE_DIR}/browser-verification.json`, report);
  console.log(JSON.stringify(report, null, 2));
  if (failures.length) process.exit(1);
}

if (mode === 'static') {
  staticVerification();
} else if (mode === 'browser') {
  await browserVerification();
} else {
  throw new Error(`Unknown mode: ${mode}`);
}
