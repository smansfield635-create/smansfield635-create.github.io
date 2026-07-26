import fs from 'node:fs';

const path = 'h-earth-3d/validation/h-earth.run8e-direct-inspection-restoration.harness.mjs';
let source = fs.readFileSync(path, 'utf8');
const from = `    assert.equal(\n      final.scheduling.completedRenderCount < final.interaction.navigationIntentCount,\n      true\n    );`;
const to = `    const successorRenderDelta =\n      final.scheduling.completedRenderCount -\n      baseline.scheduling.completedRenderCount;\n    assert.equal(successorRenderDelta, 3);\n    assert.equal(final.interaction.navigationIntentCount >= 3, true);\n    assert.equal(\n      successorRenderDelta < final.interaction.pointerMoveCount,\n      true\n    );`;
if (!source.includes(from)) {
  if (source.includes('const successorRenderDelta =')) {
    console.log('Restoration harness accounting already corrected.');
    process.exit(0);
  }
  throw new Error('RESTORATION_HARNESS_ACCOUNTING_SOURCE_NOT_FOUND');
}
source = source.replace(from, to);
fs.writeFileSync(path, source);
console.log('Restoration harness accounting corrected.');
