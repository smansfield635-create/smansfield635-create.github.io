import fs from 'node:fs';

import {
  executeGratitudeRegionFinalPlacementBaseline
} from './h-earth.gratitude-region.final-spatial-placement-disposition.mjs';

const receipt = executeGratitudeRegionFinalPlacementBaseline();
const outputPath =
  process.env.H_EARTH_GRATITUDE_REGION_FINAL_PLACEMENT_BASELINE_RECEIPT;

if (outputPath) {
  fs.writeFileSync(outputPath, `${JSON.stringify(receipt, null, 2)}\n`);
}

console.log(JSON.stringify(receipt, null, 2));
if (!receipt.eligible) process.exitCode = 1;
