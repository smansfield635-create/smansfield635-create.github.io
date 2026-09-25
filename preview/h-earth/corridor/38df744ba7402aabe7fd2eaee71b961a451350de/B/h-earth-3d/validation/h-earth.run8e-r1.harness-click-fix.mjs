import fs from 'node:fs';

const path = 'h-earth-3d/validation/h-earth.run8e-r1.profiling.harness.mjs';
const source = fs.readFileSync(path, 'utf8');

const forbidden = [
  "args: ['--use-gl=swiftshader', '--enable-webgl', '--ignore-gpu-blocklist']",
  "await page.click('#run-probes');",
  "await page.evaluate(() => document.getElementById('run-probes').click());",
  "assert(architecture.candidateC.available === true, 'R1_CANDIDATE_C_WEBGL2_UNAVAILABLE');"
];

for (const snippet of forbidden) {
  if (source.includes(snippet)) {
    throw new Error(`R1_PROFILING_ENVIRONMENT_OBSOLETE_SOURCE:${snippet}`);
  }
}

const required = [
  "'--use-gl=angle'",
  "'--use-angle=swiftshader-webgl'",
  "'--enable-unsafe-swiftshader'",
  "window.setTimeout(() => button.click(), 0);",
  "ciWebGL2Capability",
  "ciWebGL2Classification",
  "ENVIRONMENT_UNAVAILABLE",
  "IMPLEMENTATION_FAILURE",
  "h-earth.run8e-r1.harness-failure.json"
];

for (const snippet of required) {
  if (!source.includes(snippet)) {
    throw new Error(`R1_PROFILING_ENVIRONMENT_REQUIRED_SOURCE_MISSING:${snippet}`);
  }
}

console.log('Run 8E R1 profiling environment is current, classified, and evidence-preserving.');
