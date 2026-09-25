import fs from 'node:fs';
import { executeGRCRCavernPrecinctSection } from './h-earth.gratitude-region.cavern-precinct-reconciliation.mjs';

const receipt = executeGRCRCavernPrecinctSection();
const outputPath = process.env.H_EARTH_GR_CR_CAVERN_RECEIPT;
if (outputPath) fs.writeFileSync(outputPath, `${JSON.stringify(receipt, null, 2)}\n`);
console.log(JSON.stringify(receipt, null, 2));
if (!receipt.eligible) process.exitCode = 1;
