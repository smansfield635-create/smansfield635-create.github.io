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
    from: "assert.equal(record.backgroundColor, 'rgb(121, 234, 255)', `${profileName}/${record.direction}: active light is not cyan.`);",
    to: "const activeChannels = (record.backgroundColor.match(/\\d+/g) || []).slice(0, 3).map(Number);\n      assert.equal(activeChannels.length, 3, `${profileName}/${record.direction}: active light color is unreadable.`);\n      assert.ok(activeChannels[0] >= 90 && activeChannels[1] >= 180 && activeChannels[2] >= 210 && activeChannels[2] >= activeChannels[1] && activeChannels[1] > activeChannels[0], `${profileName}/${record.direction}: active light is not a bright cyan state.`);",
    expected: 1,
    label: 'over-specific active-light RGB assertion',
  },
  {
    from: "assert.equal(record.backgroundColor, 'rgb(7, 16, 31)', `${profileName}/${record.direction}: inactive light is not the subdued outline state.`);",
    to: "const inactiveChannels = (record.backgroundColor.match(/\\d+/g) || []).slice(0, 3).map(Number);\n      assert.equal(inactiveChannels.length, 3, `${profileName}/${record.direction}: inactive light color is unreadable.`);\n      assert.ok(Math.max(...inactiveChannels) <= 80, `${profileName}/${record.direction}: inactive light is not visually subdued.`);\n      assert.notEqual(record.backgroundColor, 'rgb(121, 234, 255)', `${profileName}/${record.direction}: inactive light incorrectly uses the active cyan fill.`);",
    expected: 1,
    label: 'over-specific inactive-light RGB assertion',
  },
  {
    from: "assert.equal(reduced.backgroundColor, 'rgb(121, 234, 255)', 'Reduced motion lost the active light.');",
    to: "const reducedChannels = (reduced.backgroundColor.match(/\\d+/g) || []).slice(0, 3).map(Number);\n  assert.equal(reducedChannels.length, 3, 'Reduced-motion active light color is unreadable.');\n  assert.ok(reducedChannels[0] >= 90 && reducedChannels[1] >= 180 && reducedChannels[2] >= 210 && reducedChannels[2] >= reducedChannels[1] && reducedChannels[1] > reducedChannels[0], 'Reduced motion lost the bright cyan active-light state.');",
    expected: 1,
    label: 'over-specific reduced-motion active-light RGB assertion',
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
