import { execFileSync } from 'node:child_process';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const mode = process.argv[2] || 'static';
const root = process.cwd();
const evidenceDir = path.resolve(process.env.EVIDENCE_DIR || 'laws-stellar-continuity-evidence');
const baseUrl = process.env.BASE_URL || 'http://127.0.0.1:4173';

function run(command, args) {
  return execFileSync(command, args, { cwd: root, encoding: 'utf8' }).trim();
}

function assert(condition, message, details = null) {
  if (condition) return;
  const suffix = details ? `\n${JSON.stringify(details, null, 2)}` : '';
  throw new Error(`${message}${suffix}`);
}

async function verifyStatic() {
  await mkdir(evidenceDir, { recursive: true });

  const changed = run('git', ['diff', '--name-only', 'origin/main...HEAD'])
    .split('\n')
    .map(value => value.trim())
    .filter(Boolean);

  const allowed = new Set([
    '.github/workflows/laws-post-merge-stellar-continuity.yml',
    'laws/index.background-cosmos.js',
    'laws/index.experience.js',
    'laws/index.experience.polish.css',
    'laws/index.stellar-continuity.css',
    'tools/laws-post-merge-stellar-continuity-verify.mjs'
  ]);

  const unexpected = changed.filter(file => !allowed.has(file));
  assert(unexpected.length === 0, 'Unexpected changed paths.', unexpected);

  const protectedPaths = [
    'laws/index.html',
    'laws/index.controller.js',
    'laws/index.compositor.js',
    'laws/index.cosmos.js',
    'laws/index.crystals.js',
    'laws/index.interactions.js',
    'laws/index.planet.js',
    'assets/audralia/audralia.planet.js'
  ];

  for (const file of protectedPaths) {
    const diff = run('git', ['diff', '--name-only', 'origin/main...HEAD', '--', file]);
    assert(diff === '', `Protected source changed: ${file}`);
  }

  const experience = await readFile('laws/index.experience.js', 'utf8');
  const polish = await readFile('laws/index.experience.polish.css', 'utf8');
  const stellarCss = await readFile('laws/index.stellar-continuity.css', 'utf8');
  const cosmos = await readFile('laws/index.background-cosmos.js', 'utf8');

  assert(experience.includes('/laws/index.background-cosmos.js?v=LAWS_BACKGROUND_COSMOS_20260801A'), 'Background cosmos loader missing.');
  assert(experience.includes('/laws/index.stellar-continuity.css?v=LAWS_STELLAR_CONTINUITY_20260801A'), 'Stellar continuity stylesheet loader missing.');
  assert(polish.includes('@import url("/laws/index.stellar-continuity.css?v=LAWS_STELLAR_CONTINUITY_20260801A")'), 'Static stylesheet import missing.');
  assert(stellarCss.includes('body::before'), 'Legacy star-field suppression missing.');
  assert(stellarCss.includes('content: none !important'), 'Legacy pseudo-star field is not disabled.');
  assert(stellarCss.includes('min-height: min(126vw, 40rem) !important'), 'Portrait compact framing rule missing.');
  assert(stellarCss.includes('min-height: max(40rem, 105svh) !important'), 'Landscape compact framing rule missing.');
  assert(stellarCss.includes('transform: none !important'), 'Legacy phone transform override missing.');

  for (const token of [
    'ownsNavigation: false',
    'ownsControllerState: false',
    'ownsRoutes: false',
    'ownsEvidence: false',
    'ownsRecords: false',
    'ownsClaims: false',
    'continuousAnimation: false'
  ]) {
    assert(cosmos.includes(token), `Background cosmos authority boundary missing: ${token}`);
  }

  for (const forbidden of ['location.assign', 'location.href =', 'requestSelected', 'requestEnterSelection']) {
    assert(!cosmos.includes(forbidden), `Background cosmos contains prohibited authority call: ${forbidden}`);
  }

  const receipt = {
    contract: 'LAWS_POST_MERGE_STELLAR_CONTINUITY_STATIC_VERIFY_v1',
    result: 'PASS',
    changed,
    protectedPaths,
    backgroundCosmos: {
      fullViewport: true,
      presentationOnly: true,
      continuousAnimation: false
    },
    sceneFraming: {
      portraitCompactRule: true,
      landscapeCompactRule: true,
      legacyPhoneScaleRemoved: true
    }
  };

  await writeFile(path.join(evidenceDir, 'static.json'), JSON.stringify(receipt, null, 2));
  console.log(JSON.stringify(receipt, null, 2));
}

async function verifyBrowser() {
  const { chromium } = await import('playwright');
  await mkdir(evidenceDir, { recursive: true });

  const viewports = [
    { name: 'phone-portrait', width: 390, height: 844, compact: true },
    { name: 'phone-landscape', width: 844, height: 390, compact: true },
    { name: 'tablet-portrait', width: 820, height: 1180, compact: false },
    { name: 'desktop', width: 1440, height: 1000, compact: false }
  ];

  const browser = await chromium.launch({ headless: true });
  const results = [];

  for (const viewport of viewports) {
    const context = await browser.newContext({ viewport: { width: viewport.width, height: viewport.height } });
    const page = await context.newPage();
    const pageErrors = [];
    page.on('pageerror', error => pageErrors.push(error.message));

    await page.goto(`${baseUrl}/laws/`, { waitUntil: 'networkidle' });
    await page.waitForSelector('#laws-background-cosmos-layer canvas', { state: 'attached' });
    await page.waitForTimeout(1400);

    const metrics = await page.evaluate(() => {
      const bodyBefore = getComputedStyle(document.body, '::before');
      const layer = document.querySelector('#laws-background-cosmos-layer');
      const canvas = layer?.querySelector('canvas');
      const field = document.querySelector('[data-laws-scene-field]');
      const fieldRect = field?.getBoundingClientRect();
      const canvasRect = canvas?.getBoundingClientRect();
      const html = document.documentElement;
      const body = document.body;
      const receipt = globalThis.DGB_LAWS_BACKGROUND_COSMOS_RECEIPT || null;
      const compositor = globalThis.DGB_LAWS_COMPOSITOR_RECEIPT || null;

      return {
        bodyBefore: {
          content: bodyBefore.content,
          display: bodyBefore.display,
          backgroundImage: bodyBefore.backgroundImage,
          opacity: bodyBefore.opacity
        },
        layer: layer ? {
          pointerEvents: getComputedStyle(layer).pointerEvents,
          zIndex: getComputedStyle(layer).zIndex
        } : null,
        canvas: canvasRect ? {
          width: canvasRect.width,
          height: canvasRect.height,
          pixelWidth: canvas.width,
          pixelHeight: canvas.height,
          pointerEvents: getComputedStyle(canvas).pointerEvents
        } : null,
        field: fieldRect ? {
          width: fieldRect.width,
          height: fieldRect.height,
          aspect: fieldRect.width / Math.max(1, fieldRect.height)
        } : null,
        overflow: Math.max(html.scrollWidth, body.scrollWidth) - innerWidth,
        receipt,
        compositor
      };
    });

    assert(metrics.layer && metrics.canvas && metrics.field, `${viewport.name}: stellar continuity surfaces missing.`, metrics);
    assert(['none', 'normal'].includes(metrics.bodyBefore.content), `${viewport.name}: legacy body pseudo-star field remains.`, metrics.bodyBefore);
    assert(metrics.bodyBefore.display === 'none', `${viewport.name}: legacy body pseudo-star field is still displayed.`, metrics.bodyBefore);
    assert(metrics.layer.pointerEvents === 'none' && metrics.canvas.pointerEvents === 'none', `${viewport.name}: background cosmos captures interaction.`, metrics);
    assert(metrics.canvas.width >= viewport.width - 1 && metrics.canvas.height >= viewport.height - 1, `${viewport.name}: background cosmos does not cover the viewport.`, metrics.canvas);
    assert(metrics.receipt && metrics.receipt.fullViewportLayer === true, `${viewport.name}: background cosmos receipt missing full-viewport status.`, metrics.receipt);
    assert(metrics.receipt.ownsNavigation === false && metrics.receipt.ownsControllerState === false && metrics.receipt.ownsRoutes === false && metrics.receipt.ownsEvidence === false && metrics.receipt.ownsRecords === false && metrics.receipt.ownsClaims === false, `${viewport.name}: background cosmos authority boundary failed.`, metrics.receipt);
    assert(metrics.overflow <= 2, `${viewport.name}: horizontal overflow detected.`, metrics);
    assert(pageErrors.length === 0, `${viewport.name}: page errors detected.`, pageErrors);

    if (viewport.compact) {
      assert(metrics.field.aspect < 0.82, `${viewport.name}: compact scene did not enter the existing mobile camera envelope.`, metrics.field);
      assert(metrics.compositor && metrics.compositor.cameraEye && metrics.compositor.cameraEye[2] > 6.8, `${viewport.name}: compositor did not use the compact camera distance.`, metrics.compositor);
    }

    await page.evaluate(() => {
      const structure = document.querySelector('[data-laws-category][data-direction="structure"]');
      structure?.click();
    });
    await page.waitForTimeout(300);

    const direction = await page.evaluate(() => globalThis.DGB_LAWS_BACKGROUND_COSMOS_RECEIPT?.direction || '');
    assert(direction === 'structure', `${viewport.name}: background cosmos did not follow presentation color state.`, direction);

    await page.screenshot({ path: path.join(evidenceDir, `${viewport.name}.png`), fullPage: true });
    results.push({ viewport, metrics, direction, pageErrors });
    await context.close();
  }

  const staticContext = await browser.newContext({ viewport: { width: 390, height: 844 }, javaScriptEnabled: false });
  const staticPage = await staticContext.newPage();
  await staticPage.goto(`${baseUrl}/laws/`, { waitUntil: 'domcontentloaded' });
  await staticPage.waitForTimeout(300);
  const staticState = await staticPage.evaluate(() => {
    const pseudo = getComputedStyle(document.body, '::before');
    const field = document.querySelector('[data-laws-scene-field]')?.getBoundingClientRect();
    return {
      pseudoContent: pseudo.content,
      pseudoDisplay: pseudo.display,
      heading: document.querySelector('#research-comes-first-title')?.textContent?.trim() || '',
      fieldAspect: field ? field.width / Math.max(1, field.height) : null
    };
  });
  assert(['none', 'normal'].includes(staticState.pseudoContent) && staticState.pseudoDisplay === 'none', 'Static fallback retains the redundant star texture.', staticState);
  assert(staticState.heading.includes('Research comes F.I.R.S.T.'), 'Static fallback lost the main content.', staticState);
  assert(staticState.fieldAspect !== null && staticState.fieldAspect < 0.82, 'Static compact scene framing is not preserved.', staticState);
  await staticPage.screenshot({ path: path.join(evidenceDir, 'phone-static.png'), fullPage: true });
  await staticContext.close();

  await browser.close();

  const receipt = {
    contract: 'LAWS_POST_MERGE_STELLAR_CONTINUITY_BROWSER_VERIFY_v1',
    result: 'PASS',
    viewports: results,
    staticFallback: staticState
  };

  await writeFile(path.join(evidenceDir, 'browser.json'), JSON.stringify(receipt, null, 2));
  console.log(JSON.stringify(receipt, null, 2));
}

if (mode === 'static') {
  await verifyStatic();
} else if (mode === 'browser') {
  await verifyBrowser();
} else {
  throw new Error(`Unknown mode: ${mode}`);
}
