import { readFile, writeFile } from 'node:fs/promises';

const target = 'laws/index.html';
const previous = '/laws/index.css?v=LAWS_CELESTIAL_GATEWAY_AUXILIARY_CLUSTERS_20260729A';
const next = '/laws/index.css?v=LAWS_CP6_DIRECT_FIRST_HIERARCHY_20260801B';

const source = await readFile(target, 'utf8');
const matches = source.split(previous).length - 1;

if (matches === 0 && source.includes(next)) {
  console.log('Laws CSS cache key already current.');
  process.exit(0);
}

if (matches !== 1) {
  throw new Error(`Expected exactly one prior Laws CSS cache key; found ${matches}.`);
}

const updated = source.replace(previous, next);
await writeFile(target, updated, 'utf8');
console.log(`Updated Laws CSS cache key: ${next}`);
