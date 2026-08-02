import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const sourcePath = path.resolve('scripts/verify-laws-first-indicator-restoration.mjs');
const runtimeDir = path.resolve('artifacts/laws-first-indicator-restoration/runtime');
const runtimePath = path.join(runtimeDir, 'verify-laws-first-indicator-restoration.corrected.mjs');

const obsolete = `async function waitForRuntimeReady(page) {
  await page.waitForFunction(() => {
    const root = document.querySelector('[data-laws-root]');
    return Boolean(globalThis.DGB_LAWS_EXPERIENCE && globalThis.DGB_LAWS_CONTROLLER) &&
      root?.dataset.lawsControllerStatus === 'ready' &&
      root?.dataset.lawsInteractionsStatus === 'ready';
  });
}`;

const current = `async function waitForRuntimeReady(page) {
  await page.waitForFunction(() => {
    const root = document.querySelector('[data-laws-root]');
    return Boolean(
      globalThis.DGB_LAWS_EXPERIENCE &&
      globalThis.DGB_LAWS_CONTROLLER &&
      globalThis.DGB_LAWS_INTERACTIONS
    ) &&
      root?.dataset.lawsControllerStatus === 'available' &&
      root?.dataset.lawsInteractionsStatus === 'available';
  }, { timeout: 45000 });
}`;

const source = fs.readFileSync(sourcePath, 'utf8');
const replacementCount = source.split(obsolete).length - 1;
if (replacementCount !== 1) {
  throw new Error(`Expected exactly one obsolete FIRST runtime predicate; found ${replacementCount}`);
}

fs.mkdirSync(runtimeDir, { recursive: true });
fs.writeFileSync(runtimePath, source.replace(obsolete, current), 'utf8');

await import(`${pathToFileURL(runtimePath).href}?execution=${Date.now()}`);
