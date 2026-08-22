import fs from 'node:fs';

const path = 'showroom/globe/h-earth/functional-landscape/direct-manipulation.js';
let source = fs.readFileSync(path, 'utf8');
const from = `mount.addEventListener('pointerdown', (event) => {\n  pointers.set(event.pointerId, {`;
const to = `mount.addEventListener('pointerdown', (event) => {\n  event.preventDefault();\n  event.stopImmediatePropagation();\n  pointers.set(event.pointerId, {`;
if (!source.includes(from)) {
  if (source.includes("event.stopImmediatePropagation();\n  pointers.set(event.pointerId")) {
    console.log('Direct pointer authority already isolated.');
    process.exit(0);
  }
  throw new Error('DIRECT_POINTER_ISOLATION_SOURCE_NOT_FOUND');
}
source = source.replace(from, to);
fs.writeFileSync(path, source);
console.log('Direct pointer authority isolated from legacy pointer listeners.');
