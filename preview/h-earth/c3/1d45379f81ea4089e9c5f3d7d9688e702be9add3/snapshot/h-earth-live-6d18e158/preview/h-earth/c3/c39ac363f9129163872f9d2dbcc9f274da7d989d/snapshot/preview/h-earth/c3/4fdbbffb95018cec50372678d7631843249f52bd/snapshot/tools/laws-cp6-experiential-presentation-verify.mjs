import { execFileSync } from 'node:child_process';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const mode = process.argv[2] || 'static';
const root = process.cwd();
const evidenceDir = path.resolve(process.env.EVIDENCE_DIR || 'cp6-experience-evidence');
const baseUrl = process.env.BASE_URL || 'http://127.0.0.1:4173';

function run(command, args) {
  return execFileSync(command, args, { cwd: root, encoding: 'utf8' }).trim();
}

function assert(condition, message, details = null) {
  if (condition) return;
  const suffix = details ? `\n${JSON.stringify(details, null, 2)}` : '';
  throw new Error(`${message}${suffix}`);
}

function count(source, token) {
  return source.split(token).length - 1;
}

async function verifyStatic() {
  await mkdir(evidenceDir, { recursive: true });

  const html = await readFile('laws/index.html', 'utf8');
  const css = await readFile('laws/index.experience.css', 'utf8');
  const js = await readFile('laws/index.experience.js', 'utf8');
  const baseline = run('git', ['show', 'origin/main:laws/index.html']);
  const changed = run('git', ['diff', '--name-only', 'origin/main...HEAD'])
    .split('\n')
    .map(value => value.trim())
    .filter(Boolean);

  const allowed = new Set([
    '.github/workflows/laws-cp6-experiential-presentation.yml',
    'laws/index.html',
    'laws/index.experience.css',
    'laws/index.experience.js',
    'tools/laws-cp6-experiential-presentation-transform.mjs',
    'tools/laws-cp6-experiential-presentation-verify.mjs'
  ]);

  const unexpected = changed.filter(file => !allowed.has(file));
  assert(unexpected.length === 0, 'Unexpected changed paths.', unexpected);

  const protectedPaths = [
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
    assert(diff === '', `Protected runtime changed: ${file}`);
  }

  assert(html.includes('data-cp6-experiential-presentation="candidate"'), 'Experiential root marker missing.');
  assert(html.includes('/laws/index.experience.css?v=LAWS_CP6_EXPERIENTIAL_PRESENTATION_20260801A'), 'Experience CSS link missing.');
  assert(html.includes('/laws/index.experience.js?v=LAWS_CP6_EXPERIENTIAL_PRESENTATION_20260801A'), 'Experience JS link missing.');
  assert(html.includes('Research comes <span>F.I.R.S.T.</span>'), 'Modern FIRST headline missing.');
  assert(html.includes('Before a conclusion is accepted'), 'Direct opening copy missing.');
  assert(html.includes('Explore the five questions'), 'FIRST control missing.');
  assert(!/<details class="laws-first__disclosure"[^>]*\sopen(?:=|\s|>)/.test(html), 'FIRST disclosure must be collapsed initially.');

  for (const label of [
    'What changed?',
    'What remained intact?',
    'What does the evidence show?',
    'What conditions shaped the result?',
    'What was actually tested?'
  ]) {
    assert(html.includes(label), `Plain-language question missing: ${label}`);
  }

  for (const label of ['Understand the laws', 'Examine the evidence', 'Inspect the system']) {
    assert(html.includes(label), `Visitor path missing: ${label}`);
  }

  const registryTokens = [
    'data-laws-category=""',
    'data-laws-law=""',
    'data-laws-member=""'
  ];

  for (const token of registryTokens) {
    assert(count(html, token) === count(baseline, token), `Registry count changed for ${token}`, {
      baseline: count(baseline, token),
      candidate: count(html, token)
    });
  }

  assert(count(html, 'data-laws-category=""') === 6, 'Six authorities not preserved.');
  assert(count(html, 'data-laws-law=""') === 16, 'Sixteen law records not preserved.');
  assert(count(html, 'data-laws-member=""') === 8, 'Eight destination members not preserved.');

  const bindings = [
    'data-laws-root',
    'data-laws-scene',
    'data-laws-scene-field',
    'data-laws-panel',
    'data-upstream-compass-control',
    'data-laws-controller-receipt',
    'data-laws-controller-validation',
    'data-laws-objects',
    'data-upstream-compass-mount'
  ];

  for (const binding of bindings) {
    assert(count(html, binding) === count(baseline, binding), `Compatibility binding count changed: ${binding}`, {
      baseline: count(baseline, binding),
      candidate: count(html, binding)
    });
  }

  const destinationRoutes = [
    '/laws/test/admission-and-baseline/',
    '/laws/test/forward-construction/',
    '/laws/test/reverse-audit/',
    '/laws/test/result-and-record/',
    '/laws/research/evidence-and-sources/',
    '/laws/research/methods-and-models/',
    '/laws/research/applied-investigations/',
    '/laws/research/findings-and-boundaries/'
  ];

  for (const route of destinationRoutes) {
    assert(html.includes(route), `Canonical destination route missing: ${route}`);
  }

  for (const boundary of [
    'EvidenceIncluded ≠ ValidationClaimed',
    'CandidateOutput ≠ ActiveBound',
    'RuntimeReceipt ≠ ProductionValidation',
    'RouteExists ≠ RouteMaturity'
  ]) {
    assert(html.includes(boundary), `Claim boundary missing: ${boundary}`);
  }

  assert(css.includes('prefers-reduced-motion: reduce'), 'Reduced-motion CSS missing.');
  assert(css.includes('grid-template-columns: repeat(5'), 'Desktop five-question sequence missing.');
  assert(css.includes('border-left: 1px solid var(--laws-experience-line)'), 'Mobile illuminated path missing.');
  assert(js.includes('subscribeCompassState'), 'Controller-published Compass subscription missing.');
  assert(js.includes('navigationAuthority: false'), 'Presentation navigation boundary missing.');
  assert(!js.includes('location.assign'), 'Presentation layer must not navigate.');
  assert(!js.includes('requestSelected'), 'Presentation layer must not call route selection methods.');

  const receipt = {
    contract: 'LAWS_CP6_EXPERIENTIAL_PRESENTATION_STATIC_VERIFY_v1',
    result: 'PASS',
    changed,
    protectedPaths,
    registry: {
      authorities: count(html, 'data-laws-category=""'),
      laws: count(html, 'data-laws-law=""'),
      members: count(html, 'data-laws-member=""'),
      compatibilityBindings: bindings.length,
      destinations: destinationRoutes.length
    },
    presentation: {
      modernFirstHero: true,
      compassSameHeroStage: true,
      directQuestions: 5,
      visitorPaths: 3,
      controllerStateReadOnly: true,
      navigationAuthority: false,
      reducedMotion: true,
      staticFallback: true
    }
  };

  await writeFile(path.join(evidenceDir, 'static.json'), JSON.stringify(receipt, null, 2));
  console.log(JSON.stringify(receipt, null, 2));
}

async function verifyBrowser() {
  const { chromium } = await import('playwright');
  await mkdir(evidenceDir, { recursive: true });

  const viewports = [
    { name: 'phone', width: 390, height: 844 },
    { name: 'tablet', width: 820, height: 1180 },
    { name: 'desktop', width: 1440, height: 1000 }
  ];

  const browser = await chromium.launch({ headless: true });
  const results = [];

  for (const viewport of viewports) {
    const context = await browser.newContext({ viewport: { width: viewport.width, height: viewport.height } });
    const page = await context.newPage();
    const pageErrors = [];
    page.on('pageerror', error => pageErrors.push(error.message));

    await page.goto(`${baseUrl}/laws/`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(700);

    const metrics = await page.evaluate(() => {
      const hero = document.querySelector('[data-laws-experience-stage="hero"]');
      const heading = document.querySelector('#research-comes-first-title');
      const orbit = document.querySelector('#laws-orbit');
      const header = document.querySelector('.laws-topbar');
      const first = document.querySelector('[data-laws-first-disclosure]');
      const speaker = document.querySelector('[data-laws-experience-speaker-title]');
      const html = document.documentElement;
      const body = document.body;
      const headingStyle = heading ? getComputedStyle(heading) : null;
      return {
        hero: hero?.getBoundingClientRect().toJSON() || null,
        heading: heading?.getBoundingClientRect().toJSON() || null,
        orbit: orbit?.getBoundingClientRect().toJSON() || null,
        header: header?.getBoundingClientRect().toJSON() || null,
        firstOpen: Boolean(first?.open),
        speaker: speaker?.textContent?.trim() || '',
        overflow: Math.max(html.scrollWidth, body.scrollWidth) - innerWidth,
        fontFamily: headingStyle?.fontFamily || '',
        experience: html.dataset.lawsExperience || '',
        direction: html.dataset.lawsExperienceDirection || ''
      };
    });

    assert(metrics.hero && metrics.heading && metrics.orbit, `${viewport.name}: hero composition missing.`, metrics);
    assert(metrics.firstOpen === false, `${viewport.name}: FIRST disclosure opened initially.`);
    assert(metrics.header.height < (viewport.name === 'phone' ? 92 : 110), `${viewport.name}: header dominates initial experience.`, metrics.header);
    assert(metrics.heading.top < viewport.height * 0.48, `${viewport.name}: headline is not in the initial experience.`, metrics.heading);
    assert(metrics.orbit.top < viewport.height * (viewport.name === 'phone' ? 1.15 : 0.82), `${viewport.name}: Compass is too far below the opening.`, metrics.orbit);
    assert(metrics.overflow <= 2, `${viewport.name}: horizontal overflow detected.`, metrics);
    assert(!/serif/i.test(metrics.fontFamily), `${viewport.name}: display typography still resolves to serif.`, metrics.fontFamily);
    assert(metrics.experience === 'active', `${viewport.name}: presentation choreography did not initialize.`);
    assert(metrics.speaker === 'Choose a direction', `${viewport.name}: default Compass speaker copy is wrong.`, metrics.speaker);

    await page.locator('[data-laws-first-disclosure] > summary').click();
    const reveal = await page.evaluate(() => {
      const details = document.querySelector('[data-laws-first-disclosure]');
      const questions = Array.from(document.querySelectorAll('[data-laws-experience-question]'));
      const firstQuestion = questions[0];
      const firstStyle = firstQuestion ? getComputedStyle(firstQuestion) : null;
      return {
        open: Boolean(details?.open),
        questions: questions.length,
        firstBorder: firstStyle?.borderStyle || '',
        firstBackground: firstStyle?.backgroundColor || ''
      };
    });

    assert(reveal.open, `${viewport.name}: FIRST disclosure did not open.`);
    assert(reveal.questions === 6, `${viewport.name}: five questions plus Research were not preserved.`, reveal);
    assert(reveal.firstBorder === 'none', `${viewport.name}: question sequence still uses document-card borders.`, reveal);

    await page.evaluate(() => {
      const flow = document.querySelector('[data-laws-category][data-direction="flow"]');
      if (!flow) throw new Error('Flow control missing');
      flow.click();
    });
    await page.waitForTimeout(250);

    const correspondence = await page.evaluate(() => ({
      title: document.querySelector('[data-laws-experience-speaker-title]')?.textContent?.trim() || '',
      direction: document.documentElement.dataset.lawsExperienceDirection || '',
      activeFlow: document.querySelector('[data-laws-experience-question="flow"]')?.dataset.lawsExperienceActive || '',
      api: globalThis.DGB_LAWS_EXPERIENCE ? {
        navigationAuthority: globalThis.DGB_LAWS_EXPERIENCE.navigationAuthority,
        controllerAuthority: globalThis.DGB_LAWS_EXPERIENCE.controllerAuthority,
        evidenceAuthority: globalThis.DGB_LAWS_EXPERIENCE.evidenceAuthority
      } : null
    }));

    assert(correspondence.title === 'What changed?', `${viewport.name}: Compass selection did not update plain-language copy.`, correspondence);
    assert(correspondence.direction === 'flow', `${viewport.name}: ambient direction did not follow Compass state.`, correspondence);
    assert(correspondence.activeFlow === 'true', `${viewport.name}: five-question sequence did not correspond to Flow.`, correspondence);
    assert(correspondence.api && correspondence.api.navigationAuthority === false && correspondence.api.controllerAuthority === false && correspondence.api.evidenceAuthority === false, `${viewport.name}: presentation authority boundary failed.`, correspondence);

    const paths = await page.locator('.laws-orientation-panel > summary span').allTextContents();
    assert(paths.map(value => value.trim()).join('|') === 'Understand the laws|Examine the evidence|Inspect the system', `${viewport.name}: visitor path labels incorrect.`, paths);

    await page.screenshot({ path: path.join(evidenceDir, `${viewport.name}.png`), fullPage: true });
    results.push({ viewport, metrics, reveal, correspondence, pageErrors });
    await context.close();
  }

  const reducedContext = await browser.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' });
  const reducedPage = await reducedContext.newPage();
  await reducedPage.goto(`${baseUrl}/laws/`, { waitUntil: 'networkidle' });
  const reduced = await reducedPage.evaluate(() => {
    const atmosphere = document.querySelector('.laws-experience-atmosphere span');
    const stage = document.querySelector('[data-laws-experience-stage="paths"]');
    return {
      animationName: atmosphere ? getComputedStyle(atmosphere).animationName : '',
      animationDuration: atmosphere ? getComputedStyle(atmosphere).animationDuration : '',
      stageOpacity: stage ? getComputedStyle(stage).opacity : ''
    };
  });
  assert(reduced.animationName === 'none' || reduced.animationDuration === '0.001ms', 'Reduced-motion atmosphere remains animated.', reduced);
  assert(reduced.stageOpacity === '1', 'Reduced-motion stage content is hidden.', reduced);
  await reducedPage.screenshot({ path: path.join(evidenceDir, 'phone-reduced-motion.png'), fullPage: true });
  await reducedContext.close();

  const staticContext = await browser.newContext({ viewport: { width: 390, height: 844 }, javaScriptEnabled: false });
  const staticPage = await staticContext.newPage();
  await staticPage.goto(`${baseUrl}/laws/`, { waitUntil: 'domcontentloaded' });
  const staticState = await staticPage.evaluate(() => ({
    heading: document.querySelector('#research-comes-first-title')?.textContent?.trim() || '',
    orbitDisplay: getComputedStyle(document.querySelector('#laws-orbit')).display,
    detailsOpen: Boolean(document.querySelector('[data-laws-first-disclosure]')?.open),
    paths: Array.from(document.querySelectorAll('.laws-orientation-panel > summary span')).map(node => node.textContent.trim())
  }));
  assert(staticState.heading.includes('Research comes F.I.R.S.T.'), 'Static presentation lost the main headline.', staticState);
  assert(staticState.orbitDisplay !== 'none', 'Static presentation hides the Compass stage.', staticState);
  assert(staticState.detailsOpen === false, 'Static presentation opens detail by default.', staticState);
  assert(staticState.paths.length === 3, 'Static presentation lost visitor paths.', staticState);
  await staticPage.screenshot({ path: path.join(evidenceDir, 'phone-static.png'), fullPage: true });
  await staticContext.close();

  await browser.close();

  const receipt = {
    contract: 'LAWS_CP6_EXPERIENTIAL_PRESENTATION_BROWSER_VERIFY_v1',
    result: 'PASS',
    fullMotion: results,
    reducedMotion: reduced,
    staticPresentation: staticState
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
