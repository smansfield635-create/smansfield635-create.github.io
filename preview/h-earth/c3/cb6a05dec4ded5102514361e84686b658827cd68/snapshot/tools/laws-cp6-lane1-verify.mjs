import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const BASE = 'c009f2a03c19a6b54ebad62dfba658f808f0b4c1';
const BRANCH = 'agent/laws-cp6-compass-first-progressive-disclosure-001';
const CONTROL = 'laws/control-plane/cp6-lane1';
const mode = process.argv[2] || 'static';

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

const AUTHORIZED_STATEMENT = 'The Laws Chamber preserves not only law statements, but also their source history, methods, evidence boundaries, falsification conditions, unresolved tests, and research status.';

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

function sourceOrder(html) {
  const mainStart = html.indexOf('<main class="laws-estate" id="main">');
  const mainEnd = html.indexOf('</main>', mainStart);
  const main = html.slice(mainStart, mainEnd);
  const markers = [
    ['LAWS_COMPASS', 'data-laws-compass-primary=""'],
    ['PRACTICAL_OPENING', 'data-laws-practical-opening=""'],
    ['COMPACT_RESEARCH_COMES_FIRST', 'id="research-comes-first"'],
    ['COLLAPSED_ORIENTATION_PANELS', 'data-laws-progressive-disclosure=""']
  ];
  return markers.map(([name, marker]) => ({ name, position: main.indexOf(marker) }));
}

function staticVerification() {
  const html = fs.readFileSync('laws/index.html', 'utf8');
  const css = fs.readFileSync('laws/index.css', 'utf8');
  const receipt = JSON.parse(fs.readFileSync('laws/control-plane/cp6-4-5/verification-receipt.json', 'utf8'));
  const head = run('git', 'rev-parse', 'HEAD');
  const mergeBase = run('git', 'merge-base', 'HEAD', BASE);
  const changedPaths = lines(run('git', 'diff', '--name-only', BASE));
  const protectedDiff = lines(run('git', 'diff', '--name-only', BASE, '--', ...PROTECTED_PATHS));
  const destinationDiff = lines(run('git', 'diff', '--name-only', BASE, '--', ...DESTINATIONS.map(([, file]) => file)));
  const order = sourceOrder(html);
  const changedPathViolations = changedPaths.filter(file => {
    return !(
      file === 'laws/index.html' ||
      file === 'laws/index.css' ||
      file === 'tools/laws-cp6-lane1-transform.mjs' ||
      file === 'tools/laws-cp6-lane1-verify.mjs' ||
      file === 'tools/laws-cp6-lane1-browser-correction.mjs' ||
      file === '.github/workflows/laws-cp6-lane1-build-verify.yml' ||
      file === '.github/workflows/laws-cp6-lane1-pr-browser.yml' ||
      file.startsWith(`${CONTROL}/`)
    );
  });

  const routePresence = Object.fromEntries(
    DESTINATIONS.map(([route]) => [route, html.includes(route)])
  );
  const supportingPanelCount = count(html, 'data-laws-supporting-panel=');
  const openSupportingPanelMarkup = /<details class="laws-orientation-panel"[^>]*\sopen(?:\s|=|>)/i.test(html);
  const result = {
    contract: 'LAWS_CHAMBER_CP6_LANE_1_STATIC_VERIFICATION_v1',
    repository: 'smansfield635-create/smansfield635-create.github.io',
    branch: BRANCH,
    baseHead: BASE,
    inspectedHead: head,
    mergeBase,
    baseline: {
      acceptedMainPageBlockCount: receipt.main_page_after_block_count,
      migratedRecordCustody: receipt.cp6_3_migrated_rows_preserved,
      canonicalDestinationCount: receipt.canonical_destination_page_count,
      acceptedHorizontalOverflow: receipt.horizontal_overflow,
      acceptedActionableBrowserErrors: receipt.actionable_browser_errors,
      acceptedResponsiveResults: receipt.responsive_results
    },
    sourceDomOrder: order,
    sourceDomOrderPass: order.every(item => item.position >= 0) && order.every((item, index) => index === 0 || item.position > order[index - 1].position),
    immediateCapabilityRouteDeckCount: count(html, 'class="laws-value-deck"'),
    supportingPanelCount,
    defaultSupportingPanelMarkupClosed: supportingPanelCount === 3 && !openSupportingPanelMarkup,
    authorizedResearchStatementCount: count(html, AUTHORIZED_STATEMENT),
    osfMainPageInsertion: count(html, AUTHORIZED_STATEMENT) === 1 ? 'ONE_BOUNDED_STATEMENT_ONLY' : 'NONCONFORMING',
    routePresence,
    destinationRoutesReachableInSource: Object.values(routePresence).every(Boolean),
    migratedRecordCustody: destinationDiff.length === 0 && receipt.cp6_3_migrated_rows_preserved === '48_OF_48' ? '48_OF_48' : 'NOT_PROVEN',
    protectedPaths: PROTECTED_PATHS,
    protectedRuntimeDiff: protectedDiff,
    protectedRuntimeDiffCount: protectedDiff.length,
    destinationPageDiff: destinationDiff,
    destinationPageMutationCount: destinationDiff.length,
    changedPaths,
    changedPathViolations,
    lane2MutationCount: changedPaths.filter(file => file.includes('osf-laws-source-registry') || file.includes('cp6-lane-2') || file.includes('osf-source-registry')).length,
    cssSentinelPresent: css.includes('LAWS_CP6_LANE1_COMPASS_FIRST_PROGRESSIVE_DISCLOSURE_v1')
  };

  result.pass = Boolean(
    mergeBase === BASE &&
    result.sourceDomOrderPass &&
    result.immediateCapabilityRouteDeckCount === 0 &&
    result.defaultSupportingPanelMarkupClosed &&
    result.authorizedResearchStatementCount === 1 &&
    result.destinationRoutesReachableInSource &&
    result.migratedRecordCustody === '48_OF_48' &&
    result.protectedRuntimeDiffCount === 0 &&
    result.destinationPageMutationCount === 0 &&
    result.changedPathViolations.length === 0 &&
    result.lane2MutationCount === 0 &&
    result.cssSentinelPresent
  );

  writeJson(`${CONTROL}/static-verification.json`, result);
  if (!result.pass) {
    console.error(JSON.stringify(result, null, 2));
    process.exit(1);
  }
  console.log(JSON.stringify(result, null, 2));
  return result;
}

async function browserVerification() {
  const { chromium } = await import('playwright');
  const baseUrl = process.env.BASE_URL || 'http://127.0.0.1:4173';
  const candidateUrl = process.env.CANDIDATE_URL || 'http://127.0.0.1:4174';
  const candidateHead = process.env.CANDIDATE_HEAD || run('git', 'rev-parse', 'HEAD');
  const staticReport = JSON.parse(fs.readFileSync(`${CONTROL}/static-verification.json`, 'utf8'));
  const outputRoot = `${CONTROL}/browser-evidence`;
  ensureDir(outputRoot);

  const viewports = {
    phone: { width: 390, height: 844 },
    tablet: { width: 820, height: 1180 },
    desktop: { width: 1440, height: 1000 }
  };

  const browser = await chromium.launch({ headless: true });

  async function inspectState(state, origin, viewportName, viewport) {
    const context = await browser.newContext({ viewport, reducedMotion: 'reduce' });
    const page = await context.newPage();
    const consoleErrors = [];
    const pageErrors = [];
    page.on('console', message => {
      if (message.type() === 'error') consoleErrors.push(message.text());
    });
    page.on('pageerror', error => pageErrors.push(String(error)));

    await page.goto(`${origin}/laws/`, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(3500);

    const metrics = await page.evaluate(() => {
      const visible = element => {
        if (!(element instanceof HTMLElement)) return false;
        const style = getComputedStyle(element);
        const rect = element.getBoundingClientRect();
        return style.display !== 'none' && style.visibility !== 'hidden' && Number(style.opacity || 1) > 0.01 && rect.width > 0 && rect.height > 0;
      };
      const rectOf = element => {
        if (!element) return null;
        const rect = element.getBoundingClientRect();
        return {
          top: Number(rect.top.toFixed(2)),
          bottom: Number(rect.bottom.toFixed(2)),
          left: Number(rect.left.toFixed(2)),
          right: Number(rect.right.toFixed(2)),
          width: Number(rect.width.toFixed(2)),
          height: Number(rect.height.toFixed(2)),
          topViewportRatio: Number((rect.top / innerHeight).toFixed(4)),
          bottomViewportRatio: Number((rect.bottom / innerHeight).toFixed(4))
        };
      };
      const label = element => {
        if (!element) return 'UNKNOWN';
        if (element.hasAttribute('data-laws-compass-primary')) return 'LAWS_COMPASS';
        if (element.hasAttribute('data-laws-practical-opening')) return 'PRACTICAL_OPENING';
        if (element.id === 'research-comes-first') return 'COMPACT_RESEARCH_COMES_FIRST';
        if (element.hasAttribute('data-laws-progressive-disclosure')) return 'COLLAPSED_ORIENTATION_PANELS';
        return element.id || [...element.classList].slice(0, 2).join('.') || element.tagName;
      };

      const main = document.querySelector('main');
      const compassPrimary = document.querySelector('[data-laws-compass-primary]') || document.querySelector('#laws-orbit');
      const compassScene = document.querySelector('#laws-orbit');
      const header = document.querySelector('.laws-topbar');
      const directChildren = main ? [...main.children] : [];
      const compassIndex = directChildren.indexOf(compassPrimary);
      const visibleBefore = compassIndex >= 0 ? directChildren.slice(0, compassIndex).filter(visible).map(label) : [];
      const visibleAfter = compassIndex >= 0 ? directChildren.slice(compassIndex + 1).filter(visible).map(label) : [];
      const structuralBlocks = [...document.querySelectorAll('main section, main article, main nav, main aside, main details')].filter(visible);

      const visibleMainAnchors = [...document.querySelectorAll('main a[href]')].filter(visible);
      const hrefCounts = new Map();
      for (const anchor of visibleMainAnchors) {
        const href = anchor.getAttribute('href') || '';
        const normalized = href.trim();
        if (!normalized) continue;
        hrefCounts.set(normalized, (hrefCounts.get(normalized) || 0) + 1);
      }
      const duplicateRouteLinks = [...hrefCounts.entries()].filter(([, amount]) => amount > 1).map(([href, amount]) => ({ href, duplicateCount: amount - 1 }));

      const offscreenControls = [...document.querySelectorAll('a, button, summary')]
        .filter(visible)
        .map(element => ({
          label: (element.getAttribute('aria-label') || element.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 100),
          rect: rectOf(element)
        }))
        .filter(record => record.rect.left < -1 || record.rect.right > innerWidth + 1);

      const headerRect = header?.getBoundingClientRect();
      const compassRect = compassPrimary?.getBoundingClientRect();
      const headerOverlap = Boolean(
        headerRect && compassRect &&
        headerRect.left < compassRect.right &&
        headerRect.right > compassRect.left &&
        headerRect.top < compassRect.bottom &&
        headerRect.bottom > compassRect.top
      );

      return {
        viewport: { width: innerWidth, height: innerHeight },
        pageHeight: document.documentElement.scrollHeight,
        documentWidth: document.documentElement.scrollWidth,
        horizontalOverflowWidth: Math.max(0, document.documentElement.scrollWidth - document.documentElement.clientWidth),
        renderedStructuralBlockCount: structuralBlocks.length,
        sourceAndRenderedDomOrder: directChildren.map(label),
        visibleBlocksBeforeCompass: visibleBefore,
        visibleBlocksBelowCompass: visibleAfter,
        compassPrimaryBoundingBox: rectOf(compassPrimary),
        compassSceneBoundingBox: rectOf(compassScene),
        headerBoundingBox: rectOf(header),
        headerOverlap,
        initialExpandedSupportingPanelCount: document.querySelectorAll('[data-laws-supporting-panel][open]').length,
        supportingPanelCount: document.querySelectorAll('[data-laws-supporting-panel]').length,
        immediateCapabilityRouteDeckCount: document.querySelectorAll('.laws-value-deck').length,
        duplicateRouteDirectoryCount: document.querySelectorAll('.laws-value-deck').length,
        duplicateRouteLinks,
        duplicateRouteLinkCount: duplicateRouteLinks.reduce((total, item) => total + item.duplicateCount, 0),
        offscreenControls,
        offscreenControlCount: offscreenControls.length
      };
    });

    const screenshot = `${outputRoot}/${state}-${viewportName}.png`;
    await page.screenshot({ path: screenshot, fullPage: true });

    const linkReport = await page.evaluate(() => {
      return [...document.querySelectorAll('a[href]')].map(anchor => anchor.getAttribute('href')).filter(Boolean);
    });

    await context.close();
    return {
      state,
      viewportName,
      origin,
      metrics,
      consoleErrors,
      pageErrors,
      linkHrefs: [...new Set(linkReport)].sort(),
      screenshot
    };
  }

  async function checkLinks(origin, hrefs) {
    const context = await browser.newContext();
    const request = context.request;
    const records = [];
    for (const href of hrefs) {
      if (/^(mailto:|tel:|javascript:)/i.test(href)) continue;
      if (href.startsWith('#')) {
        records.push({ href, status: 'ANCHOR_CHECKED_IN_SOURCE', ok: true });
        continue;
      }
      let target;
      try {
        target = new URL(href, `${origin}/laws/`);
      } catch {
        records.push({ href, status: 'INVALID_URL', ok: false });
        continue;
      }
      if (target.origin !== new URL(origin).origin) {
        records.push({ href, status: 'EXTERNAL_NOT_FETCHED', ok: true });
        continue;
      }
      target.hash = '';
      try {
        const response = await request.get(target.toString(), { timeout: 15000, failOnStatusCode: false });
        records.push({ href, url: target.toString(), status: response.status(), ok: response.status() < 400 });
      } catch (error) {
        records.push({ href, url: target.toString(), status: String(error), ok: false });
      }
    }
    await context.close();
    return records;
  }

  const results = { base: {}, candidate: {} };
  for (const [viewportName, viewport] of Object.entries(viewports)) {
    results.base[viewportName] = await inspectState('base', baseUrl, viewportName, viewport);
    results.candidate[viewportName] = await inspectState('candidate', candidateUrl, viewportName, viewport);
  }

  const baseLinks = await checkLinks(baseUrl, results.base.desktop.linkHrefs);
  const candidateLinks = await checkLinks(candidateUrl, results.candidate.desktop.linkHrefs);
  const routeChecks = {};
  for (const [route] of DESTINATIONS) {
    const baseRecord = baseLinks.find(record => record.href === route);
    const candidateRecord = candidateLinks.find(record => record.href === route);
    routeChecks[route] = {
      base: baseRecord || { href: route, ok: false, status: 'NOT_FOUND_IN_PAGE' },
      candidate: candidateRecord || { href: route, ok: false, status: 'NOT_FOUND_IN_PAGE' }
    };
  }

  await browser.close();

  const comparisons = {};
  for (const viewportName of Object.keys(viewports)) {
    const before = results.base[viewportName].metrics;
    const after = results.candidate[viewportName].metrics;
    comparisons[viewportName] = {
      renderedBlockCountBefore: before.renderedStructuralBlockCount,
      renderedBlockCountAfter: after.renderedStructuralBlockCount,
      renderedBlockCountDirectionPass: after.renderedStructuralBlockCount <= before.renderedStructuralBlockCount,
      pageHeightBefore: before.pageHeight,
      pageHeightAfter: after.pageHeight,
      pageHeightDirectionPass: after.pageHeight <= before.pageHeight,
      visibleBlocksBeforeCompassBefore: before.visibleBlocksBeforeCompass,
      visibleBlocksBeforeCompassAfter: after.visibleBlocksBeforeCompass,
      compassBefore: before.compassSceneBoundingBox,
      compassAfter: after.compassSceneBoundingBox,
      headerBefore: before.headerBoundingBox,
      headerAfter: after.headerBoundingBox,
      initialExpandedPanelsBefore: before.initialExpandedSupportingPanelCount,
      initialExpandedPanelsAfter: after.initialExpandedSupportingPanelCount,
      duplicateRouteLinkCountBefore: before.duplicateRouteLinkCount,
      duplicateRouteLinkCountAfter: after.duplicateRouteLinkCount,
      duplicateRouteDirectoryCountBefore: before.duplicateRouteDirectoryCount,
      duplicateRouteDirectoryCountAfter: after.duplicateRouteDirectoryCount,
      offscreenControlsBefore: before.offscreenControlCount,
      offscreenControlsAfter: after.offscreenControlCount,
      horizontalOverflowBefore: before.horizontalOverflowWidth,
      horizontalOverflowAfter: after.horizontalOverflowWidth,
      headerOverlapAfter: after.headerOverlap,
      consoleErrorsAfter: results.candidate[viewportName].consoleErrors,
      pageErrorsAfter: results.candidate[viewportName].pageErrors
    };
  }

  const browserFailures = [];
  for (const [viewportName, comparison] of Object.entries(comparisons)) {
    if (!comparison.renderedBlockCountDirectionPass) browserFailures.push(`${viewportName}: rendered block count increased`);
    if (!comparison.pageHeightDirectionPass) browserFailures.push(`${viewportName}: initial rendered page height increased`);
    if (comparison.visibleBlocksBeforeCompassAfter.length !== 0) browserFailures.push(`${viewportName}: visible blocks remain before compass`);
    if (comparison.initialExpandedPanelsAfter !== 0) browserFailures.push(`${viewportName}: supporting panels initially expanded`);
    if (comparison.duplicateRouteDirectoryCountAfter !== 0) browserFailures.push(`${viewportName}: duplicate route directories`);
    if (comparison.offscreenControlsAfter !== 0) browserFailures.push(`${viewportName}: offscreen horizontal controls`);
    if (comparison.horizontalOverflowAfter !== 0) browserFailures.push(`${viewportName}: horizontal overflow`);
    if (comparison.headerOverlapAfter) browserFailures.push(`${viewportName}: header overlap`);
    if (comparison.consoleErrorsAfter.length) browserFailures.push(`${viewportName}: console errors`);
    if (comparison.pageErrorsAfter.length) browserFailures.push(`${viewportName}: page errors`);
  }

  const brokenCandidateLinks = candidateLinks.filter(record => !record.ok);
  if (brokenCandidateLinks.length) browserFailures.push('candidate: broken links');
  const unreachableRoutes = Object.entries(routeChecks).filter(([, record]) => !record.candidate.ok).map(([route]) => route);
  if (unreachableRoutes.length) browserFailures.push('candidate: canonical destination route unreachable');

  const report = {
    contract: 'LAWS_CHAMBER_CP6_LANE_1_BASE_AND_CANDIDATE_BROWSER_COMPARISON_v1',
    repository: 'smansfield635-create/smansfield635-create.github.io',
    branch: BRANCH,
    baseHead: BASE,
    candidateHead,
    browser: 'chromium-playwright',
    measurementMethod: {
      renderedBlockCount: 'Visible section, article, nav, aside, and details elements under main at initial load.',
      duplicateRouteLinkCount: 'Repeated visible main-page anchor hrefs at initial load; links inside closed disclosures are excluded as not rendered.',
      offscreenControls: 'Visible anchors, buttons, and summaries extending horizontally outside the viewport.',
      compassFirst: 'No visible direct main child precedes the Laws Compass wrapper. No cosmetic position threshold is imposed.'
    },
    staticVerification: staticReport,
    results,
    comparisons,
    links: {
      base: baseLinks,
      candidate: candidateLinks,
      brokenCandidateLinks
    },
    canonicalRouteChecks: routeChecks,
    reachableCanonicalDestinationRoutes: Object.values(routeChecks).filter(record => record.candidate.ok).length,
    protectedRuntimeDiff: staticReport.protectedRuntimeDiffCount,
    migratedRecordCustody: staticReport.migratedRecordCustody,
    failures: browserFailures,
    pass: staticReport.pass && browserFailures.length === 0 && brokenCandidateLinks.length === 0 && unreachableRoutes.length === 0
  };

  writeJson(`${CONTROL}/browser-comparison.json`, report);
  const summary = [
    '# Laws CP6 Lane 1 browser comparison',
    '',
    `- Base: \`${BASE}\``,
    `- Candidate: \`${candidateHead}\``,
    `- Result: **${report.pass ? 'PASS' : 'FAIL'}**`,
    `- Canonical destinations reachable: ${report.reachableCanonicalDestinationRoutes}/8`,
    `- Protected runtime diff: ${report.protectedRuntimeDiff}`,
    `- Migrated record custody: ${report.migratedRecordCustody}`,
    '',
    '## Viewport measurements',
    '',
    ...Object.entries(comparisons).map(([name, item]) => `- ${name}: blocks ${item.renderedBlockCountBefore} → ${item.renderedBlockCountAfter}; height ${item.pageHeightBefore} → ${item.pageHeightAfter}; visible blocks before compass ${item.visibleBlocksBeforeCompassAfter.length}; open panels ${item.initialExpandedPanelsAfter}; duplicate directories ${item.duplicateRouteDirectoryCountAfter}; repeated visible links reported ${item.duplicateRouteLinkCountAfter}; overflow ${item.horizontalOverflowAfter}px; off-screen controls ${item.offscreenControlsAfter}.`),
    '',
    '## Failures',
    '',
    ...(browserFailures.length ? browserFailures.map(item => `- ${item}`) : ['- None.'])
  ].join('\n');
  fs.writeFileSync(`${CONTROL}/browser-comparison.md`, `${summary}\n`, 'utf8');

  console.log(JSON.stringify(report, null, 2));
  if (!report.pass) process.exit(1);
}

if (mode === 'static') {
  staticVerification();
} else if (mode === 'browser') {
  await browserVerification();
} else {
  throw new Error(`Unknown mode: ${mode}`);
}
