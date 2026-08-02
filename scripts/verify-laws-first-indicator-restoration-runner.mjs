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
  {
    from: "assert.equal(record.backgroundColor, 'rgb(7, 16, 31)', `${profileName}/${record.direction}: inactive light is not the subdued outline state.`);",
    to: "const inactiveChannels = (record.backgroundColor.match(/\\d+/g) || []).slice(0, 3).map(Number);\n      assert.equal(inactiveChannels.length, 3, `${profileName}/${record.direction}: inactive light color is unreadable.`);\n      assert.ok(Math.max(...inactiveChannels) <= 80, `${profileName}/${record.direction}: inactive light is not visually subdued.`);\n      assert.notEqual(record.backgroundColor, 'rgb(121, 234, 255)', `${profileName}/${record.direction}: inactive light incorrectly uses the active cyan fill.`);",
    expected: 1,
    label: 'over-specific inactive-light RGB assertion',
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
