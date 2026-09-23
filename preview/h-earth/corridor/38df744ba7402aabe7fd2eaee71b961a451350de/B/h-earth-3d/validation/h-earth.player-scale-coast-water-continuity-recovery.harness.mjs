#!/usr/bin/env node
import fs from 'node:fs';
import { execFileSync } from 'node:child_process';

const KNOWN_GOOD = '108dd921f54ff14d99c515f945e67c799cef1065';
const LAND_PARENT = '5763b582d41a4d0b2f1a3d6c28da29dba3a722f2';
const ATMOSPHERE = 'showroom/globe/h-earth/render/environment-atmosphere.js';
const MATERIAL = 'h-earth-3d/environment/h-earth.successor-surface-material.run8c.js';
const LIGHTING = 'showroom/globe/h-earth/render/lighting-material-successor-terrain.run8c.js';

const protectedKnownGood = [
  'showroom/globe/h-earth/render/geometry-water.js',
  'showroom/globe/h-earth/render/environment-water.js',
  'showroom/globe/h-earth/render/live-render-package.run8e-r2.js',
  'showroom/globe/h-earth/render/gpu-upload-views.run8e-r2d.js',
  'showroom/globe/h-earth/render/geometry-shoreline.js',
  'showroom/globe/h-earth/render/geometry-distant-context.js',
  'showroom/globe/h-earth/render/planetary-world-frame.js',
  'h-earth-3d/environment/h-earth.water-state.js',
  'showroom/globe/h-earth/functional-landscape/navigation.js'
];

const results = [];
const test = (id, ok, detail = '') => results.push({ id, pass: Boolean(ok), detail });
const git = (...args) => execFileSync('git', args, { encoding: 'utf8' }).trim();
const blob = (ref, path) => git('rev-parse', `${ref}:${path}`);

try {
  test('KNOWN_GOOD_ATMOSPHERE_PRESENTATION_EXACT', blob('HEAD', ATMOSPHERE) === blob(KNOWN_GOOD, ATMOSPHERE));
  test('PLAYER_SCALE_LAND_MATERIAL_5763_EXACT', blob('HEAD', MATERIAL) === blob(LAND_PARENT, MATERIAL));
  test('PLAYER_SCALE_FORM_LIGHTING_5763_EXACT', blob('HEAD', LIGHTING) === blob(LAND_PARENT, LIGHTING));

  for (const path of protectedKnownGood) {
    test(`PROTECTED_EXACT:${path}`, blob('HEAD', path) === blob(KNOWN_GOOD, path));
  }

  const materialSource = fs.readFileSync(MATERIAL, 'utf8');
  test('BEACH_CLASS_PRESENT:WET_SAND', materialSource.includes("'WET_SAND'"));
  test('BEACH_CLASS_PRESENT:DRY_SAND', materialSource.includes("'DRY_SAND'"));
  test('WATER_CLASS_PRESENT:OPEN_WATER', materialSource.includes("'OPEN_WATER'"));
  test('WATER_CLASS_PRESENT:NEARSHORE_WATER', materialSource.includes("'NEARSHORE_WATER'"));
  test('OFFSHORE_DEPTH_GRADIENT_PRESENT', materialSource.includes('function offshoreWaterColor'));
  test('SHALLOW_COLOR_PRESENT', /shallow=\{linearR:\.058,linearG:\.285,linearB:\.325\}/.test(materialSource));
  test('SHELF_COLOR_PRESENT', /shelf=\{linearR:\.032,linearG:\.165,linearB:\.235\}/.test(materialSource));
  test('DEEP_COLOR_PRESENT', /deep=\{linearR:\.014,linearG:\.067,linearB:\.142\}/.test(materialSource));
  test('SHALLOW_TO_SHELF_TRANSITION_PRESENT', materialSource.includes('shelfT=smooth01(offshore/72)'));
  test('SHELF_TO_DEEP_TRANSITION_PRESENT', materialSource.includes('deepT=smooth01((offshore-72)/168)'));
  test('DEPTH_GRADIENT_PROFILE_PRESENT', materialSource.includes("profileId:'H_EARTH_OFFSHORE_DEPTH_VISUAL_GRADIENT_v1'"));
  test('WATER_USES_DEPTH_GRADIENT', materialSource.includes("if(c.includes('WATER'))return offshoreWaterColor(source,d)"));

  const atmosphereSource = fs.readFileSync(ATMOSPHERE, 'utf8');
  test('PLAYER_SCALE_ATMOSPHERE_OVERRIDE_REMOVED', !atmosphereSource.includes('H_EARTH_PLAYER_SCALE_ATMOSPHERE_PRESENTATION_PROFILE'));
  test('KNOWN_GOOD_PRESENTATION_REVISION', atmosphereSource.includes('presentationRevision: 1'));
  test('FRAME_CLOSURE_REMAINS_OPAQUE', atmosphereSource.includes('fullViewportSkyCoverageRequired: true') && atmosphereSource.includes('transparentFallbackPermitted: false'));

  const failures = results.filter((entry) => !entry.pass);
  const receipt = {
    receiptType: 'H_EARTH_PLAYER_SCALE_COAST_WATER_CONTINUITY_RECOVERY_RECEIPT_V1',
    knownGoodEnvironmentParent: KNOWN_GOOD,
    playerScaleLandParent: LAND_PARENT,
    total: results.length,
    passed: results.length - failures.length,
    failed: failures.length,
    status: failures.length === 0 ? 'PASS_CLOSED' : 'FAIL_CLOSED',
    results
  };
  process.stdout.write(`${JSON.stringify(receipt, null, 2)}\n`);
  if (failures.length) process.exitCode = 1;
} catch (error) {
  process.stderr.write(`${error?.stack || error}\n`);
  process.exitCode = 1;
}
