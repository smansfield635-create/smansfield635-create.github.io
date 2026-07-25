import fs from 'node:fs';

const capacityPath = 'showroom/globe/h-earth/capacity.js';
const compositorPath = 'showroom/globe/h-earth/compositor.js';

let capacity = fs.readFileSync(capacityPath, 'utf8');
let compositor = fs.readFileSync(compositorPath, 'utf8');

function replaceExact(source, oldText, newText, label, expected = 1) {
  const occurrences = source.split(oldText).length - 1;
  if (occurrences !== expected) {
    throw new Error(`${label}_EXPECTED_${expected}:OBSERVED_${occurrences}`);
  }
  return source.replaceAll(oldText, newText);
}

capacity = replaceExact(
  capacity,
  'H_EARTH_3D_CAPACITY_FILE_RENEWAL_STEP_034O_3_FRAME_BASED_EXECUTION_CAPACITY_v4',
  'H_EARTH_3D_CAPACITY_FILE_RENEWAL_STEP_034O_3_GROUND_OBSERVER_CAMERA_CAPACITY_v5',
  'CAPACITY_CONTRACT_RENEWAL',
  2
);
capacity = replaceExact(
  capacity,
  'H_EARTH_3D_CAPACITY_FILE_RENEWAL_STEP_034O_3_FRAME_BASED_EXECUTION_CAPACITY_v3',
  'H_EARTH_3D_CAPACITY_FILE_RENEWAL_STEP_034O_3_FRAME_BASED_EXECUTION_CAPACITY_v4',
  'CAPACITY_RENEWS_ID'
);
capacity = replaceExact(
  capacity,
  'export const H_EARTH_3D_CAPACITY_SCHEMA_VERSION = 4;',
  'export const H_EARTH_3D_CAPACITY_SCHEMA_VERSION = 5;',
  'CAPACITY_SCHEMA_VERSION'
);
capacity = replaceExact(
  capacity,
  `      yMin: -1,
      yMax: 8,`,
  `      yMin: -32,
      yMax: 32,`,
  'CAMERA_TARGET_VERTICAL_BOUNDS'
);
capacity = replaceExact(
  capacity,
  `      minimum: -24,
      maximum: 12,`,
  `      minimum: -80,
      maximum: 80,`,
  'CAMERA_PITCH_BOUNDS'
);
capacity = replaceExact(
  capacity,
  "        'INITIAL_CAMERA_DISTANCE_MULTIPLIER'",
  "        'GROUND_OBSERVER_VERTICAL_FIELD_OF_VIEW_MULTIPLIER'",
  'ZOOM_INTERPRETATION'
);
capacity = replaceExact(
  capacity,
  "H_EARTH_LANDWARD_ESTATE_ENTRY_CAMERA_ENVELOPE_v3_SINGLE_MODULE",
  "H_EARTH_GROUND_OBSERVER_ESTATE_ENTRY_CAMERA_ENVELOPE_v4_SINGLE_MODULE",
  'CAMERA_ENVELOPE_ID'
);
capacity = replaceExact(
  capacity,
  "'SHORELINE_ENTRY_LOOKING_LANDWARD_TOWARD_ESTATE_CONTEXT'",
  "'GROUND_OBSERVER_ENTRY_LOOKING_LANDWARD_WITH_BOUNDED_YAW_PITCH_AND_FOV'",
  'CAMERA_COMPOSITION_ROLE'
);

compositor = replaceExact(
  compositor,
  `const GROUND_OBSERVER_LOOK_DISTANCE =
  Math.max(
    1,
    Math.min(
      INITIAL_DISTANCE,
      8
    )
  );`,
  `const GROUND_OBSERVER_LOOK_DISTANCE =
  Math.max(
    1,
    Math.min(
      INITIAL_DISTANCE,
      16
    )
  );`,
  'GROUND_OBSERVER_LOOK_DISTANCE'
);

for (const required of [
  'GROUND_OBSERVER_CAMERA_CAPACITY_v5',
  'H_EARTH_3D_CAPACITY_SCHEMA_VERSION = 5',
  'yMin: -32',
  'yMax: 32',
  'minimum: -80',
  'maximum: 80',
  'GROUND_OBSERVER_VERTICAL_FIELD_OF_VIEW_MULTIPLIER',
  'GROUND_OBSERVER_ESTATE_ENTRY_CAMERA_ENVELOPE_v4_SINGLE_MODULE'
]) {
  if (!capacity.includes(required)) {
    throw new Error(`CAPACITY_RENEWAL_MISSING:${required}`);
  }
}

if (!compositor.includes('Math.min(\n      INITIAL_DISTANCE,\n      16')) {
  throw new Error('BOUNDED_LOOK_DISTANCE_16_NOT_ESTABLISHED');
}

fs.writeFileSync(capacityPath, capacity, 'utf8');
fs.writeFileSync(compositorPath, compositor, 'utf8');
