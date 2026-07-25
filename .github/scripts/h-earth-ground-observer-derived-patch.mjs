import fs from 'node:fs';

const path = 'showroom/globe/h-earth/compositor.js';
let source = fs.readFileSync(path, 'utf8');

const oldText = `    derived:
      deepFreeze({
        distance:
          fit.derived.distance,

        position:
          deepFreeze(
            cloneVector(
              fit.derived.position
            )
          )
      }),`;

const newText = `    derived:
      deepFreeze({
        distance:
          fit.derived.distance,

        position:
          deepFreeze(
            cloneVector(
              fit.derived.position
            )
          ),

        lookTarget:
          deepFreeze(
            cloneVector(
              fit.derived.lookTarget
            )
          ),

        forward:
          deepFreeze(
            cloneVector(
              fit.derived.forward
            )
          ),

        effectiveVerticalFovDegrees:
          fit.derived.effectiveVerticalFovDegrees
      }),`;

const occurrences = source.split(oldText).length - 1;
if (occurrences !== 2) {
  throw new Error(`DERIVED_RECEIPT_SURFACE_EXPECTED_TWICE:${occurrences}`);
}

source = source.replaceAll(oldText, newText);
fs.writeFileSync(path, source, 'utf8');
