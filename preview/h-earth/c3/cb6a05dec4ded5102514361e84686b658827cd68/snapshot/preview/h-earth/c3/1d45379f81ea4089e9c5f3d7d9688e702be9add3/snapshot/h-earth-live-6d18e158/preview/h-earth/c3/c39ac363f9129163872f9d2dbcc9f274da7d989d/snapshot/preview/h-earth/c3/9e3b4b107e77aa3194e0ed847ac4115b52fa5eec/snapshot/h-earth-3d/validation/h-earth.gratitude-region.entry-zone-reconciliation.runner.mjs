import fs from 'node:fs';
import { executeGRCREntryZoneSection } from './h-earth.gratitude-region.entry-zone-reconciliation.mjs';

const receipt = executeGRCREntryZoneSection();
const outputPath = process.env.H_EARTH_GR_CR_ENTRY_RECEIPT;
if (outputPath) fs.writeFileSync(outputPath, `${JSON.stringify(receipt, null, 2)}\n`);
console.log(JSON.stringify(receipt));
if (!receipt.eligible) process.exitCode = 1;
