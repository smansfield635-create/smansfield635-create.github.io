import fs from 'node:fs';
import { executeFrontierPlainsCapacityRelationshipSection } from './h-earth.gratitude-region.frontier-plains-capacity-relationship-reconciliation.mjs';

const receipt = executeFrontierPlainsCapacityRelationshipSection();
const outputPath = process.env.H_EARTH_GR_FRONTIER_PLAINS_RECEIPT;
if (outputPath) fs.writeFileSync(outputPath, `${JSON.stringify(receipt, null, 2)}\n`);
console.log(JSON.stringify(receipt, null, 2));
if (!receipt.eligible) process.exitCode = 1;
