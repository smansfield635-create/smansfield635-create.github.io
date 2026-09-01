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
