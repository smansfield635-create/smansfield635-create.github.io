import fs from 'node:fs';

const path = 'h-earth-3d/validation/h-earth.run8e-r1.profiling.harness.mjs';
let source = fs.readFileSync(path, 'utf8');
const replacements = [
  ["await page.click('#run-probes');", "await page.evaluate(() => document.getElementById('run-probes').click());"],
  ["await page.click('#start-physical');", "await page.evaluate(() => document.getElementById('start-physical').click());"],
  ["await page.click('#stop-physical');", "await page.evaluate(() => document.getElementById('stop-physical').click());"]
];
for (const [from, to] of replacements) {
  if (source.includes(from)) source = source.replace(from, to);
  else if (!source.includes(to)) throw new Error(`R1_HARNESS_CLICK_SOURCE_NOT_FOUND:${from}`);
}
fs.writeFileSync(path, source);
console.log('Run 8E R1 harness controls use asynchronous DOM dispatch.');
