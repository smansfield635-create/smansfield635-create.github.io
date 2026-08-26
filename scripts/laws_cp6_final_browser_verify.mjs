import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import { pathToFileURL } from 'node:url';

const preservedVerifierBlob = '12c70a6a8fd5a110789025a61c1ec2c0e2219b0b';
const expectedCssHref = '/laws/room-carousel/room-carousel.v1.css?v=LAWS_GEN1738_FIVE_SCENE_CAROUSEL_20260826';
const expectedJsSrc = '/laws/room-carousel/room-carousel.v1.js?v=LAWS_GEN1738_FIVE_SCENE_CAROUSEL_20260826';
const cssTemplateLine = 'const roomCarouselCssHref = `/laws/room-carousel/room-carousel.v1.css?v=${roomCarouselAssetIdentity}`;';
const jsTemplateLine = 'const roomCarouselJsSrc = `/laws/room-carousel/room-carousel.v1.js?v=${roomCarouselAssetIdentity}`;';

const source = execFileSync('git', ['cat-file', 'blob', preservedVerifierBlob], { encoding: 'utf8' });
const observedBlob = execFileSync('git', ['hash-object', '--stdin'], { input: source, encoding: 'utf8' }).trim();
if (observedBlob !== preservedVerifierBlob) throw new Error(`PRESERVED_CP6_VERIFIER_BLOB_MISMATCH:${observedBlob}`);
if ((source.match(new RegExp(cssTemplateLine.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')) || []).length !== 1) throw new Error('CP6_CSS_TEMPLATE_BINDING_NOT_UNIQUE');
if ((source.match(new RegExp(jsTemplateLine.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')) || []).length !== 1) throw new Error('CP6_JS_TEMPLATE_BINDING_NOT_UNIQUE');

const executable = source
  .replace(cssTemplateLine, `const roomCarouselCssHref = '${expectedCssHref}';`)
  .replace(jsTemplateLine, `const roomCarouselJsSrc = '${expectedJsSrc}';`);

if (!executable.includes("complete bottom tab rail") || !executable.includes("ordinary lower page content missing")) {
  throw new Error('PRESERVED_CP6_INVARIANTS_MISSING');
}

// Keep the generated verifier inside the checkout so Node's ESM package
// resolution can reach this run's pinned ./node_modules/playwright install.
const tempPath = `${process.cwd()}/scripts/.laws_cp6_final_browser_verify.gen1740.mjs`;
fs.writeFileSync(tempPath, executable, 'utf8');
await import(`${pathToFileURL(tempPath).href}?candidate=${encodeURIComponent(process.env.EXECUTION_COMMIT || 'LOCAL')}`);
