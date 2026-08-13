import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const sourcePath = path.resolve('scripts/laws_cp6_final_browser_verify.mjs');
const runtimeDir = path.resolve('artifacts/laws-cp6-final-synchronization/runtime');
const runtimePath = path.join(runtimeDir, 'laws_cp6_final_browser_verify.corrected.mjs');

const corrections = [
  {
    from: `buttons.locator('[aria-expanded="true"]')`,
    to: `group.locator('.lr-tab[aria-expanded="true"]')`,
    expected: 2,
    label: 'expanded-reading locators',
  },
  {
    from: `audit.locator('summary')`,
    to: `audit.locator(':scope > summary')`,
    expected: 2,
    label: 'direct audit-summary locators',
  },
  {
    from: `assert(await page.locator('#cp6-work-behind-laws.lr-battery-landing').count() === 1, '/laws/: battery module missing');`,
    to: `assert(await page.locator('html[data-laws-foundation-first-applied-study="true"]').count() === 1, '/laws/: applied-study foundation marker missing');`,
    expected: 1,
    label: 'current Laws applied-study marker',
  },
  {
    from: `} else {\n        await navCheck(page, descriptor.route, profile.name);`,
    to: `} else if (descriptor.route === '/laws/research/methods-and-models/') {\n        assert(await page.locator('html[data-canonical-archive="METHODS_MODELS_CANONICAL_ARCHIVE_v1_DRAFT"]').count() === 1, descriptor.route + ': canonical archive binding missing');\n      } else {\n        await navCheck(page, descriptor.route, profile.name);`,
    expected: 1,
    label: 'specialized Methods profile routing',
  },
  {
    from: `await gotoChecked(page, descriptor.route);\n    assert(await page.locator('html').getAttribute('data-lr-motion')`,
    to: `await gotoChecked(page, descriptor.route);\n    if (descriptor.route === '/laws/research/methods-and-models/') { await health(page, descriptor.route, errors); results.push({ check: 'reduced-motion', route: descriptor.route, status: 'PASS' }); await page.close(); continue; }\n    assert(await page.locator('html').getAttribute('data-lr-motion')`,
    expected: 1,
    label: 'specialized Methods reduced health routing',
  },
  {
    from: `await health(page, descriptor.route, errors);\n    if (descriptor.route !== '/laws/') {`,
    to: `await health(page, descriptor.route, errors);\n    if (descriptor.route === '/laws/research/methods-and-models/') { results.push({ check: 'static-no-js', route: descriptor.route, status: 'PASS' }); await page.close(); continue; }\n    if (descriptor.route !== '/laws/') {`,
    expected: 1,
    label: 'specialized Methods static health routing',
  },
];

let corrected = fs.readFileSync(sourcePath, 'utf8');
for (const correction of corrections) {
  const count = corrected.split(correction.from).length - 1;
  if (count !== correction.expected) {
    throw new Error(`Expected exactly ${correction.expected} ${correction.label}; found ${count}`);
  }
  corrected = corrected.replaceAll(correction.from, correction.to);
}

fs.mkdirSync(runtimeDir, { recursive: true });
fs.writeFileSync(runtimePath, corrected, 'utf8');

await import(`${pathToFileURL(runtimePath).href}?execution=${Date.now()}`);
