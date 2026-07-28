import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { build } from 'esbuild';

const SOURCE_HEAD = '548672ae99cd406805f0c8ca576cc650baf7ed18';
const PUBLIC_HTML_BLOB = '0daedf61f7e19af095f4db5fc47563a9cd786837';
const PUBLIC_ORCHESTRATOR_BLOB = '2b0a916b3a6d11da84316925f8abd8a3a1447445';
const FUNCTIONAL_CSS_BLOB = '481148416a8d0466e76c4cb2eca7a67d8932a242';
const PUBLIC_SHELL_CSS_BLOB = 'f208b7f11096a7bf5da282226903ac634c1eab01';
const PACKAGE_FILENAME = 'H_EARTH_RUN8E_R3F2_SIGNED_OFFLINE_REFERENCE_DEVICE_PACKAGE.html';

const sha256 = (value) => `sha256:${crypto.createHash('sha256').update(value).digest('hex')}`;
const escapeScript = (value) => value.replace(/<\/script/gi, '<\\/script');
const replaceOne = (value, pattern, replacement, code) => {
  if (!pattern.test(value)) throw new Error(code);
  return value.replace(pattern, replacement);
};

export async function buildHEarthRun8ER3F2SignedOfflinePackage(options = {}) {
  const outputDirectory = options.outputDirectory ?? process.env.H_EARTH_RUN8E_R3F2_OUTPUT ?? '/tmp/h-earth-run8e-r3f2';
  const packageHead = options.packageHead ?? process.env.H_EARTH_RUN8E_R3F2_PREVIEW_HEAD ?? process.env.GITHUB_SHA ?? 'UNRESOLVED';
  fs.mkdirSync(outputDirectory, { recursive: true });

  const routePath = 'showroom/globe/h-earth/index.html';
  const functionalCssPath = 'showroom/globe/h-earth/functional-landscape/index.css';
  const shellCssPath = 'showroom/globe/h-earth/index.css';
  const entryPath = 'showroom/globe/h-earth/functional-landscape/public-live-gpu-integration.run8e-r3e.js';
  const launcherHtmlPath = 'h-earth-3d/validation/run-8e-r3/h-earth.run8e-r3f2.reference-device-evidence-launcher.html';
  const launcherScriptPath = 'h-earth-3d/validation/run-8e-r3/h-earth.run8e-r3f2.reference-device-evidence-launcher.js';

  const routeSource = fs.readFileSync(routePath, 'utf8');
  const functionalCss = fs.readFileSync(functionalCssPath, 'utf8');
  const shellCss = fs.readFileSync(shellCssPath, 'utf8');
  const launcherHtml = fs.readFileSync(launcherHtmlPath, 'utf8');
  const launcherScript = fs.readFileSync(launcherScriptPath, 'utf8');

  const bundleResult = await build({
    entryPoints: [entryPath],
    bundle: true,
    write: false,
    format: 'iife',
    platform: 'browser',
    target: ['es2020'],
    legalComments: 'none',
    minify: false,
    sourcemap: false,
    charset: 'utf8',
    logLevel: 'silent'
  });
  if (bundleResult.outputFiles.length !== 1) throw new Error('R3F2_OFFLINE_BUNDLE_OUTPUT_COUNT_INVALID');
  const publicBundle = bundleResult.outputFiles[0].text;

  let routeDocument = routeSource;
  routeDocument = replaceOne(
    routeDocument,
    /<link rel="stylesheet" href="\.\/functional-landscape\/index\.css[^>]*>/,
    `<style data-r3f2-inlined-source="functional-landscape/index.css">\n${functionalCss}\n</style>`,
    'R3F2_FUNCTIONAL_CSS_LINK_NOT_FOUND'
  );
  routeDocument = replaceOne(
    routeDocument,
    /<link rel="stylesheet" href="\.\/index\.css[^>]*>/,
    `<style data-r3f2-inlined-source="index.css">\n${shellCss}\n</style>`,
    'R3F2_SHELL_CSS_LINK_NOT_FOUND'
  );
  routeDocument = replaceOne(
    routeDocument,
    /<script type="module" src="\.\/functional-landscape\/public-live-gpu-integration\.run8e-r3e\.js[^>]*><\/script>/,
    `<script data-r3f2-inlined-source="public-live-gpu-integration.run8e-r3e.js">\n${escapeScript(publicBundle)}\n</script>`,
    'R3F2_PUBLIC_MODULE_SCRIPT_NOT_FOUND'
  );
  routeDocument = routeDocument.replace(/href="\/index\.html"/g, 'href="#"').replace(/href="\/showroom\/globe\/h-earth\/diagnostic\/"/g, 'href="#"');
  routeDocument = routeDocument.replace('<head>', `<head>\n  <meta name="h-earth-r3f2-source-head" content="${SOURCE_HEAD}">\n  <meta name="h-earth-r3f2-public-html-blob" content="${PUBLIC_HTML_BLOB}">\n  <meta name="h-earth-r3f2-public-orchestrator-blob" content="${PUBLIC_ORCHESTRATOR_BLOB}">`);

  const packageMetadata = {
    packageClass: 'SIGNED_OFFLINE_PACKAGE',
    signatureClass: 'GIT_COMMIT_AND_SHA256_CONTENT_BINDING',
    packageHead,
    sourceHead: SOURCE_HEAD,
    publicHtmlGitBlob: PUBLIC_HTML_BLOB,
    publicOrchestratorGitBlob: PUBLIC_ORCHESTRATOR_BLOB,
    functionalCssGitBlob: FUNCTIONAL_CSS_BLOB,
    publicShellCssGitBlob: PUBLIC_SHELL_CSS_BLOB,
    productionDeployment: false,
    physicalAcceptanceEmbedded: false
  };
  const bootstrap = `window.H_EARTH_R3F2_OFFLINE_PACKAGE_METADATA=${JSON.stringify(packageMetadata)};\nwindow.H_EARTH_R3F2_ROUTE_SRCDOC=${JSON.stringify(routeDocument)};`;
  let packageDocument = launcherHtml;
  packageDocument = replaceOne(
    packageDocument,
    /<script src="\.\/h-earth\.run8e-r3f2\.reference-device-evidence-launcher\.js"><\/script>/,
    `<script>\n${escapeScript(bootstrap)}\n</script>\n<script>\n${escapeScript(launcherScript)}\n</script>`,
    'R3F2_LAUNCHER_SCRIPT_TAG_NOT_FOUND'
  );
  packageDocument = packageDocument.replace('<head>', `<head>\n  <meta name="h-earth-r3f2-package-class" content="SIGNED_OFFLINE_PACKAGE">\n  <meta name="h-earth-r3f2-package-head" content="${packageHead}">`);
  packageDocument = `<!-- H_EARTH_RUN8E_R3F2_SIGNED_OFFLINE_PACKAGE\n${JSON.stringify(packageMetadata)}\n-->\n${packageDocument}`;

  const packagePath = path.join(outputDirectory, PACKAGE_FILENAME);
  fs.writeFileSync(packagePath, packageDocument);
  const packageSha256 = sha256(packageDocument);
  const manifest = {
    manifestId: 'H_EARTH_RUN_8E_R3F2_SIGNED_OFFLINE_PACKAGE_MANIFEST_v1',
    ...packageMetadata,
    packageFilename: PACKAGE_FILENAME,
    packageByteCount: Buffer.byteLength(packageDocument),
    packageSha256,
    routeDocumentSha256: sha256(routeDocument),
    bundledJavaScriptSha256: sha256(publicBundle),
    inlinedCssSha256: {
      functionalLandscape: sha256(functionalCss),
      publicShell: sha256(shellCss)
    },
    generatedAt: new Date().toISOString(),
    boundaries: {
      publicSourceMutation: false,
      productionDeployment: false,
      physicalReferenceDeviceExecution: false,
      broaderMobileExecution: false,
      run8EPassClosed: false
    }
  };
  fs.writeFileSync(path.join(outputDirectory, 'h-earth.run8e-r3f2.signed-offline-package.manifest.json'), `${JSON.stringify(manifest, null, 2)}\n`);
  fs.writeFileSync(path.join(outputDirectory, `${PACKAGE_FILENAME}.sha256`), `${packageSha256.replace('sha256:', '')}  ${PACKAGE_FILENAME}\n`);
  return { packagePath, packageDocument, routeDocument, publicBundle, manifest };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const result = await buildHEarthRun8ER3F2SignedOfflinePackage();
  console.log(JSON.stringify(result.manifest, null, 2));
}
