import fs from 'node:fs';

const path = 'showroom/globe/h-earth/compositor.js';
let source = fs.readFileSync(path, 'utf8');

const oldText = `const GROUND_OBSERVER_LOOK_DISTANCE =
  Math.max(
    INITIAL_DISTANCE,
    1
  );`;

const newText = `const GROUND_OBSERVER_LOOK_DISTANCE =
  Math.max(
    1,
    Math.min(
      INITIAL_DISTANCE,
      8
    )
  );`;

const occurrences = source.split(oldText).length - 1;
if (occurrences !== 1) {
  throw new Error(`GROUND_OBSERVER_LOOK_DISTANCE_EXPECTED_ONCE:${occurrences}`);
}

source = source.replace(oldText, newText);
fs.writeFileSync(path, source, 'utf8');
