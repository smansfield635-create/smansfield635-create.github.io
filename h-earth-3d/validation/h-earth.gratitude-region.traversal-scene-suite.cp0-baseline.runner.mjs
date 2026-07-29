import { executeCp0Baseline } from './h-earth.gratitude-region.traversal-scene-suite.cp0-baseline.mjs';

const { receipt, receiptPath } = await executeCp0Baseline();

console.log(JSON.stringify({
  checkpoint: receipt.checkpoint,
  result: receipt.result,
  receiptPath,
  failures: receipt.failures,
  closure: receipt.closure
}, null, 2));

if (receipt.result !== 'PASS_CLOSED') {
  process.exitCode = 1;
}
