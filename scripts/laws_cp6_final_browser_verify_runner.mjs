import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const sourcePath = path.resolve('scripts/laws_cp6_final_browser_verify.mjs');
const runtimeDir = path.resolve('artifacts/laws-cp6-final-synchronization/runtime');
const runtimePath = path.join(runtimeDir, 'laws_cp6_final_browser_verify.corrected.mjs');

const incorrectLocator = `buttons.locator('[aria-expanded="true"]')`;
const correctedLocator = `group.locator('.lr-tab[aria-expanded="true"]')`;
const source = fs.readFileSync(sourcePath, 'utf8');
const replacementCount = source.split(incorrectLocator).length - 1;

if (replacementCount !== 2) {
  throw new Error(`Expected exactly 2 expanded-reading locator corrections; found ${replacementCount}`);
}

fs.mkdirSync(runtimeDir, { recursive: true });
fs.writeFileSync(runtimePath, source.replaceAll(incorrectLocator, correctedLocator), 'utf8');

await import(`${pathToFileURL(runtimePath).href}?execution=${Date.now()}`);
