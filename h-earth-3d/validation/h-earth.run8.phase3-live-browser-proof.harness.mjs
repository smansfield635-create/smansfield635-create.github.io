import fs from 'node:fs';
import fsp from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import crypto from 'node:crypto';
import { execFileSync, spawn } from 'node:child_process';
import { chromium } from 'playwright';

const repositoryRoot = process.cwd();
const sourceHead = '9ce2b2ef9078d99c93f847957479e37c41f83a53';
const branch = process.env.GITHUB_HEAD_REF || 'agent/h-earth-touch-motion-cp4-calibration-testing-001';
const sourceRoot = '/tmp/h-earth-cp4-0b-source';
const generatedRoot = '/tmp/h-earth-cp4-0b-generated';
const evidenceRoot = process.env.H_EARTH_PHASE3_OUTPUT || '/tmp/h-earth-run8-phase3-live-browser-proof';
const outputRelative = 'h-earth-3d/control-plane/touch-motion-calibration/cp4-0b-three-file-preview';
const workflowPath = '.github/workflows/h-earth-cp4-0b-three-file-materialization.yml';
const harnessPath = 'h-earth-3d/validation/h-earth.run8.phase3-live-browser-proof.harness.mjs';

const run = (command, args, options = {}) => execFileSync(command, args, {
  cwd: options.cwd ?? repositoryRoot,
  encoding: 'utf8',
  stdio: options.stdio ?? 'pipe',
  env: { ...process.env, ...(options.env ?? {}) }
});
const sha256 = (value) => crypto.createHash('sha256').update(value).digest('hex');
const read = (root, relative) => fs.readFileSync(path.join(root, relative), 'utf8');
const writeJson = async (name, value) => {
  await fsp.mkdir(evidenceRoot, { recursive: true });
  await fsp.writeFile(path.join(evidenceRoot, name), JSON.stringify(value, null, 2) + '\n');
};

console.log(`CP4_0B carrier branch: ${branch}`);
console.log(`CP4_0B exact source head: ${sourceHead}`);

run('git', ['fetch', 'origin', branch, '--quiet']);
const remoteHead = run('git', ['rev-parse', `origin/${branch}`]).trim();
const carrierDelta = run('git', ['diff', '--name-only', `${sourceHead}..${remoteHead}`]).trim().split('\n').filter(Boolean).sort();
const allowedCarrierDelta = [workflowPath, harnessPath].sort();
if (JSON.stringify(carrierDelta) !== JSON.stringify(allowedCarrierDelta)) {
  throw new Error(`CP4_0B_CARRIER_SCOPE_MISMATCH:${JSON.stringify(carrierDelta)}`);
}
run('git', ['cat-file', '-e', `${sourceHead}^{commit}`]);

fs.rmSync(sourceRoot, { recursive: true, force: true });
fs.rmSync(generatedRoot, { recursive: true, force: true });
await fsp.mkdir(generatedRoot, { recursive: true });
await fsp.mkdir(evidenceRoot, { recursive: true });
run('git', ['worktree', 'add', '--detach', sourceRoot, sourceHead], { stdio: 'inherit' });

try {
  const exactBlobs = {
    'showroom/globe/h-earth/index.html': 'a192e161149392fc2f849e6c2e6eb503d3ae90da',
    'showroom/globe/h-earth/functional-landscape/index.css': '481148416a8d0466e76c4cb2eca7a67d8932a242',
    'showroom/globe/h-earth/index.css': 'f208b7f11096a7bf5da282226903ac634c1eab01',
    'showroom/globe/h-earth/functional-landscape/public-live-gpu-integration.run8e-r3e.receipt.js': 'c9f5ad33bebcf13793c9a0ef37ac363f7b4391ce'
  };
  for (const [relative, expectedBlob] of Object.entries(exactBlobs)) {
    const actual = run('git', ['hash-object', relative], { cwd: sourceRoot }).trim();
    if (actual !== expectedBlob) throw new Error(`CP4_0B_EXACT_BLOB_MISMATCH:${relative}:${actual}`);
  }

  run('npm', ['install', '--no-save', '--package-lock=false', 'esbuild@0.25.6'], { stdio: 'inherit' });
  const { build } = await import('esbuild');

  const sourceHtmlPath = 'showroom/globe/h-earth/index.html';
  const functionalCssPath = 'showroom/globe/h-earth/functional-landscape/index.css';
  const routeCssPath = 'showroom/globe/h-earth/index.css';
  const wrapperPath = 'showroom/globe/h-earth/functional-landscape/public-live-gpu-integration.run8e-r3e.receipt.js';
  const sourceHtml = read(sourceRoot, sourceHtmlPath);
  const functionalCss = read(sourceRoot, functionalCssPath);
  const routeCss = read(sourceRoot, routeCssPath);
  const wrapperSource = read(sourceRoot, wrapperPath);

  const styleMatches = [...sourceHtml.matchAll(/<style>([\s\S]*?)<\/style>/gi)];
  if (styleMatches.length !== 1) throw new Error(`CP4_0B_INLINE_STYLE_COUNT_INVALID:${styleMatches.length}`);
  const inlineStyle = styleMatches[0][1].trim();
  const scriptMatches = [...sourceHtml.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/gi)];
  const diagnosticMonitor = scriptMatches.map((match) => match[1])
    .find((body) => body.includes('window.H_EARTH_RUNTIME_DIAGNOSTICS'));
  if (!diagnosticMonitor) throw new Error('CP4_0B_INLINE_DIAGNOSTIC_MONITOR_MISSING');

  for (const fragment of [
    "import '../diagnostic/renderer-startup-observer.v1.js';",
    "await import('./public-live-gpu-integration.run8e-r3e.js');",
    'window.H_EARTH_RENDERER_STARTUP_DIAGNOSTICS?.constructorReturned();',
    "await import('../diagnostic/run8e-r3d/interaction-acceptance.run8e.js');",
    "window.H_EARTH_RENDERER_STARTUP_DIAGNOSTICS?.fail('RENDERER_CONSTRUCTOR_RETURNED', error);",
    'throw error;'
  ]) {
    if (!wrapperSource.includes(fragment)) throw new Error(`CP4_0B_WRAPPER_BEHAVIOR_MISSING:${fragment}`);
  }

  let outputHtml = sourceHtml
    .replace(/<link\b[^>]*rel=["']stylesheet["'][^>]*>\s*/gi, '')
    .replace(/<style>[\s\S]*?<\/style>\s*/gi, '')
    .replace(/<script\b[\s\S]*?<\/script>\s*/gi, '');
  outputHtml = outputHtml.replace('</head>', '  <link rel="stylesheet" href="./preview.css">\n</head>');
  outputHtml = outputHtml.replace('</body>', '  <script src="./preview.js"></script>\n</body>');
  outputHtml = outputHtml.replace('<title>H-Earth · Ground-View Matrix</title>', '<title>H-Earth · CP4 Sealed Physical Preview</title>');
  outputHtml = outputHtml.replace(
    '<main id="h-earth-3d-route-root"',
    `<main data-cp4-source-head="${sourceHead}" data-cp4-materialization="CP4_0B_DETERMINISTIC_THREE_FILE_RUNTIME" id="h-earth-3d-route-root"`
  );
  outputHtml = `<!-- CP4_0B sealed preview. Source head: ${sourceHead}. No repository-relative runtime module graph. -->\n${outputHtml}`;

  const outputCss = [
    `/* CP4_0B sealed preview.css\n * Source head: ${sourceHead}\n * Order: functional-landscape/index.css -> index.css -> index.html inline style\n */`,
    functionalCss,
    routeCss,
    inlineStyle
  ].join('\n\n');

  const entryPath = path.join(sourceRoot, '.cp4-0b-materialization-entry.mjs');
  const entrySource = `/* CP4_0B synthetic execution entry derived from exact wrapper ${wrapperPath}. */\n${diagnosticMonitor.trim()}\n\n(async () => {\n  await import('./showroom/globe/h-earth/diagnostic/renderer-startup-observer.v1.js');\n  try {\n    await import('./showroom/globe/h-earth/functional-landscape/public-live-gpu-integration.run8e-r3e.js');\n    window.H_EARTH_RENDERER_STARTUP_DIAGNOSTICS?.constructorReturned();\n    await import('./showroom/globe/h-earth/diagnostic/run8e-r3d/interaction-acceptance.run8e.js');\n  } catch (error) {\n    window.H_EARTH_RENDERER_STARTUP_DIAGNOSTICS?.fail('RENDERER_CONSTRUCTOR_RETURNED', error);\n    throw error;\n  }\n})();\n`;
  await fsp.writeFile(entryPath, entrySource);

  const previewJsPath = path.join(generatedRoot, 'preview.js');
  const result = await build({
    absWorkingDir: sourceRoot,
    entryPoints: [entryPath],
    bundle: true,
    outfile: previewJsPath,
    format: 'iife',
    platform: 'browser',
    target: ['es2022'],
    charset: 'utf8',
    treeShaking: false,
    minify: false,
    legalComments: 'none',
    sourcemap: false,
    metafile: true,
    logLevel: 'info',
    banner: {
      js: `/* H_EARTH_CP4_0B_DETERMINISTIC_THREE_FILE_MATERIALIZATION_v1\n * SOURCE_HEAD=${sourceHead}\n * ORIGINAL_EXECUTABLE_MODULE_COUNT=53\n * ORIGINAL_HTML_ENTRY_COUNT=1\n * ORIGINAL_STYLESHEET_COUNT=2\n * ORIGINAL_WRAPPER_BLOB=c9f5ad33bebcf13793c9a0ef37ac363f7b4391ce\n */`
    }
  });
  fs.rmSync(entryPath, { force: true });

  const metafileInputs = Object.keys(result.metafile.inputs).map((value) => value.replaceAll('\\', '/'));
  const exactSourceInputs = metafileInputs.filter((value) => !value.endsWith('.cp4-0b-materialization-entry.mjs'));
  if (metafileInputs.length - exactSourceInputs.length !== 1) throw new Error('CP4_0B_SYNTHETIC_ENTRY_COUNT_INVALID');
  if (exactSourceInputs.length + 1 !== 53) {
    throw new Error(`CP4_0B_EXECUTABLE_SOURCE_REPRESENTATION_COUNT_INVALID:${exactSourceInputs.length + 1}`);
  }

  await fsp.writeFile(path.join(generatedRoot, 'index.html'), outputHtml);
  await fsp.writeFile(path.join(generatedRoot, 'preview.css'), outputCss);

  const html = outputHtml;
  const css = outputCss;
  const js = await fsp.readFile(previewJsPath, 'utf8');
  const count = (text, pattern) => [...text.matchAll(pattern)].length;
  const htmlSubresources = [...html.matchAll(/<(script|link|img|source|iframe)\b[^>]*(?:src|href)=["']([^"']+)["'][^>]*>/gi)]
    .map((match) => ({ tag: match[1].toLowerCase(), url: match[2] }));
  const allowedSubresources = new Set(['./preview.css', './preview.js']);
  const receipt = {
    outputEsmImportCount: count(js, /(^|[;{}\n])\s*import\s+(?!\s*\()/gm) + count(js, /(^|[;{}\n])\s*export\s+/gm),
    outputDynamicImportCount: count(js, /\bimport\s*\(/g),
    outputRepositoryRelativeRequestCount: htmlSubresources.filter(({ url }) => /^(?:\.\.?\/|\/)/.test(url) && !allowedSubresources.has(url)).length,
    outputExternalRequestCount: count(js, /\bfetch\s*\(/g) + count(js, /new\s+XMLHttpRequest\b/g) + count(js, /new\s+WebSocket\s*\(/g) + count(js, /new\s+EventSource\s*\(/g) + count(js, /sendBeacon\s*\(/g) + htmlSubresources.filter(({ url }) => /^(?:https?:)?\/\//i.test(url)).length,
    outputServiceWorkerCount: count(js, /serviceWorker\s*\.\s*register/g),
    outputUndeclaredAssetCount: htmlSubresources.filter(({ url }) => !allowedSubresources.has(url)).length + count(css, /@import\b/gi) + count(css, /url\s*\(/gi),
    htmlSubresources
  };
  const failures = Object.entries(receipt).filter(([key, value]) => key.startsWith('output') && value !== 0);
  if (failures.length) throw new Error(`CP4_0B_STATIC_ACCEPTANCE_FAILED:${JSON.stringify(failures)}`);
  run('node', ['--check', previewJsPath]);

  const servedRoot = path.join(sourceRoot, outputRelative);
  await fsp.mkdir(servedRoot, { recursive: true });
  for (const name of ['index.html', 'preview.css', 'preview.js']) {
    await fsp.copyFile(path.join(generatedRoot, name), path.join(servedRoot, name));
  }
  const serverLog = path.join(evidenceRoot, 'http-server.log');
  const server = spawn('python3', ['-m', 'http.server', '4173', '--bind', '127.0.0.1'], {
    cwd: sourceRoot,
    stdio: ['ignore', fs.openSync(serverLog, 'w'), fs.openSync(serverLog, 'a')]
  });
  try {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    const browser = await chromium.launch({
      headless: true,
      args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-webgl', '--ignore-gpu-blocklist', '--disable-dev-shm-usage']
    });
    const page = await browser.newPage({ viewport: { width: 412, height: 915 }, deviceScaleFactor: 1 });
    const consoleErrors = [];
    const pageErrors = [];
    page.on('console', (message) => { if (message.type() === 'error') consoleErrors.push(message.text()); });
    page.on('pageerror', (error) => pageErrors.push(error.stack ?? error.message));
    const url = `http://127.0.0.1:4173/${outputRelative}/index.html`;
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForFunction(() => window.H_EARTH_RUN8E_PUBLIC_ROUTE?.ready === true, null, { timeout: 30000 });
    await page.waitForFunction(() => window.H_EARTH_RENDERER_STARTUP_DIAGNOSTICS?.getReceipt?.()?.stages?.READY_PUBLISHED === 'PASS', null, { timeout: 30000 });
    const runtime = await page.evaluate(() => {
      const startup = window.H_EARTH_RENDERER_STARTUP_DIAGNOSTICS.getReceipt();
      const route = window.H_EARTH_RUN8E_PUBLIC_ROUTE.getReceipt();
      const liveGpu = window.H_EARTH_RUN8E_PUBLIC_ROUTE.getLiveGpuReceipt();
      const canvas = document.getElementById('h-earth-functional-landscape-canvas');
      return {
        startup,
        routeStatus: route.status,
        routeEligible: route.eligible,
        visibleFrames: liveGpu.counters.gpuFramebufferPresentationCount,
        contextCreationCount: liveGpu.resources.counters.contextCreationCount,
        rendererInitializationCount: liveGpu.counters.rendererInitializationCount,
        packageUploadedOnce: liveGpu.correspondence.packageUploadedOnce,
        resourceIdentityStable: liveGpu.correspondence.resourceIdentityStable,
        interactionAcceptanceMounted: [...document.querySelectorAll('section')].some((node) => node.getAttribute('aria-label') === 'Guided interaction acceptance'),
        canvasSize: { width: canvas.width, height: canvas.height }
      };
    });
    await page.screenshot({ path: path.join(evidenceRoot, 'sealed-preview.png'), fullPage: true });
    await browser.close();
    const browserReceipt = { url, consoleErrors, pageErrors, runtime };
    const issues = [];
    if (consoleErrors.length) issues.push('CONSOLE_ERRORS_PRESENT');
    if (pageErrors.length) issues.push('PAGE_ERRORS_PRESENT');
    if (runtime.startup.firstFailureStage !== null) issues.push(`STARTUP_FAILURE:${runtime.startup.firstFailureStage}`);
    if (runtime.startup.stages.READY_PUBLISHED !== 'PASS') issues.push('READY_NOT_PUBLISHED');
    if (runtime.routeEligible !== true) issues.push('ROUTE_NOT_ELIGIBLE');
    if (runtime.visibleFrames < 1) issues.push('NO_VISIBLE_FRAME');
    if (runtime.contextCreationCount !== 1) issues.push('WEBGL2_CONTEXT_COUNT_INVALID');
    if (runtime.rendererInitializationCount !== 1) issues.push('RENDERER_INITIALIZATION_COUNT_INVALID');
    if (runtime.packageUploadedOnce !== true) issues.push('PACKAGE_NOT_UPLOADED_ONCE');
    if (runtime.resourceIdentityStable !== true) issues.push('RESOURCE_IDENTITY_NOT_STABLE');
    if (runtime.interactionAcceptanceMounted !== true) issues.push('INTERACTION_ACCEPTANCE_NOT_INSTALLED');
    await writeJson('browser-validation.json', browserReceipt);
    if (issues.length) throw new Error(`CP4_0B_BROWSER_ACCEPTANCE_FAILED:${issues.join(',')}`);
  } finally {
    server.kill('SIGTERM');
  }

  const outputFiles = [];
  for (const name of ['index.html', 'preview.css', 'preview.js']) {
    const content = await fsp.readFile(path.join(generatedRoot, name));
    outputFiles.push({ name, byteLength: content.length, sha256: sha256(content) });
    await fsp.copyFile(path.join(generatedRoot, name), path.join(evidenceRoot, name));
  }
  const manifest = {
    artifactId: 'H_EARTH_CP4_0B_DETERMINISTIC_THREE_FILE_MATERIALIZATION_v1',
    sourceHead,
    carrierHead: remoteHead,
    originalSourceBlobCount: 56,
    originalExecutableJavaScriptModuleCount: 53,
    originalHtmlEntryCount: 1,
    originalStylesheetCount: 2,
    representedExecutableSourceCount: exactSourceInputs.length + 1,
    esbuildInputCount: metafileInputs.length,
    outputFiles,
    staticAcceptance: receipt,
    executionOrder: [
      'INLINE_DIAGNOSTIC_MONITOR',
      'STARTUP_OBSERVER_INSTALLATION',
      'COMPLETE_RENDERER_AND_PACKAGE_MODULE_BODY',
      'PUBLIC_INTEGRATION_EXECUTION',
      'WRAPPER_TRY_CATCH_BEHAVIOR',
      'CONSTRUCTOR_RETURNED_PUBLICATION',
      'INTERACTION_ACCEPTANCE_INSTALLATION'
    ]
  };
  await writeJson('materialization-manifest.json', manifest);
  await writeJson('esbuild-metafile.json', result.metafile);
  await writeJson('static-validation.json', receipt);
  console.log(JSON.stringify(manifest, null, 2));

  run('git', ['checkout', '-B', branch, `origin/${branch}`], { stdio: 'inherit' });
  const outputDir = path.join(repositoryRoot, outputRelative);
  await fsp.mkdir(outputDir, { recursive: true });
  for (const name of ['index.html', 'preview.css', 'preview.js']) {
    await fsp.copyFile(path.join(generatedRoot, name), path.join(outputDir, name));
  }
  run('git', ['checkout', sourceHead, '--', harnessPath], { stdio: 'inherit' });
  if (fs.existsSync(path.join(repositoryRoot, workflowPath))) run('git', ['rm', '-f', workflowPath], { stdio: 'inherit' });

  fs.rmSync(path.join(repositoryRoot, 'node_modules'), { recursive: true, force: true });
  const status = run('git', ['status', '--short', '--untracked-files=all']).trim().split('\n').filter(Boolean);
  const expectedPaths = [workflowPath, `${outputRelative}/index.html`, `${outputRelative}/preview.css`, `${outputRelative}/preview.js`, harnessPath].sort();
  const actualPaths = status.map((line) => line.slice(3)).sort();
  if (JSON.stringify(actualPaths) !== JSON.stringify(expectedPaths)) {
    throw new Error(`CP4_0B_FINAL_WORKTREE_SCOPE_INVALID:${JSON.stringify(actualPaths)}`);
  }
  run('git', ['config', 'user.name', 'github-actions[bot]']);
  run('git', ['config', 'user.email', '41898282+github-actions[bot]@users.noreply.github.com']);
  run('git', ['add', `${outputRelative}/index.html`, `${outputRelative}/preview.css`, `${outputRelative}/preview.js`]);
  run('git', ['add', '-u', workflowPath, harnessPath]);
  run('git', ['commit', '-m', 'Materialize CP4 0B sealed three-file preview'], { stdio: 'inherit' });
  run('git', ['push', 'origin', `HEAD:${branch}`], { stdio: 'inherit' });
  console.log('CP4_0B_MATERIALIZATION_PUSHED');
} finally {
  try { run('git', ['worktree', 'remove', '--force', sourceRoot], { stdio: 'inherit' }); } catch {}
}
