import fs from 'node:fs';

const path = 'showroom/globe/h-earth/diagnostic/run8e-r1/profiler.js';
let source = fs.readFileSync(path, 'utf8');
const from = `    worker.postMessage({
      positions: flattened.positions.buffer,
      indices: flattened.indices.buffer,
      matrices,
      width: 160,
      height: 100
    }, [flattened.positions.buffer.slice(0), flattened.indices.buffer.slice(0)]);`;
const to = `    const positionsBuffer = flattened.positions.buffer.slice(0);
    const indicesBuffer = flattened.indices.buffer.slice(0);
    worker.postMessage({
      positions: positionsBuffer,
      indices: indicesBuffer,
      matrices,
      width: 160,
      height: 100
    }, [positionsBuffer, indicesBuffer]);`;
if (source.includes(from)) {
  source = source.replace(from, to);
  fs.writeFileSync(path, source);
  console.log('Run 8E R1 worker transfer corrected.');
} else if (source.includes(to)) {
  console.log('Run 8E R1 worker transfer already correct.');
} else {
  throw new Error('RUN_8E_R1_WORKER_TRANSFER_SOURCE_NOT_FOUND');
}
