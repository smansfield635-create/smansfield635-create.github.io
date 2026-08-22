import fs from 'node:fs';
import { executeGRCRMirrorManorSection } from './h-earth.gratitude-region.mirror-manor-reconciliation.mjs';

const receipt = executeGRCRMirrorManorSection();
const outputPath = process.env.H_EARTH_GR_CR_MANOR_RECEIPT;
if (outputPath) fs.writeFileSync(outputPath, `${JSON.stringify(receipt, null, 2)}\n`);
console.log(JSON.stringify(receipt));
if (!receipt.eligible) process.exitCode = 1;
