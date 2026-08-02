import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const sourcePath = path.resolve('scripts/verify-laws-first-indicator-restoration.mjs');
const runtimeDir = path.resolve('artifacts/laws-first-indicator-restoration/runtime');
const runtimePath = path.join(runtimeDir, 'verify-laws-first-indicator-restoration.corrected.mjs');

const corrections = [
  {
    from: `async function waitForRuntimeReady(page) {
  await page.waitForFunction(() => {
    const root = document.querySelector('[data-laws-root]');
    return Boolean(globalThis.DGB_LAWS_EXPERIENCE && globalThis.DGB_LAWS_CONTROLLER) &&
      root?.dataset.lawsControllerStatus === 'ready' &&
      root?.dataset.lawsInteractionsStatus === 'ready';
  });
}`,
    to: `async function waitForRuntimeReady(page) {
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
}`,
    expected: 1,
    label: 'obsolete FIRST runtime predicate',
  },
  {
    from: `await page.waitForTimeout(260);`,
    to: `await page.waitForTimeout(500);`,
    expected: 1,
    label: 'premature FIRST transition sample',
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
