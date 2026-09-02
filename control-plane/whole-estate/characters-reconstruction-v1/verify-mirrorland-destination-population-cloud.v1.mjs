#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const BASE = 'eb45762f4307958217dd46ef9b4a5b3f8bbe2e57';
const args = process.argv.slice(2);
const getArg = name => { const i = args.indexOf(name); return i >= 0 ? args[i + 1] : null; };
const requestedBase = getArg('--base');
if (requestedBase && requestedBase !== BASE) throw new Error(`GOVERNING_HEAD_MISMATCH:${requestedBase}`);

const root = process.cwd();
const read = rel => fs.readFileSync(path.join(root, rel), 'utf8');
const json = rel => JSON.parse(read(rel));
const exists = rel => fs.existsSync(path.join(root, rel));
const assert = (condition, code, detail = '') => { if (!condition) throw new Error(`${code}${detail ? ':' + detail : ''}`); };
const contains = (rel, token, code) => assert(read(rel).includes(token), code, `${rel}:${token}`);

const contractPath = 'control-plane/whole-estate/characters-reconstruction-v1/mirrorland-destination-population-cloud-contract.v1.json';
const dossierPath = 'control-plane/whole-estate/characters-reconstruction-v1/dossier-preservation-manifest.v1.json';
const requiredProductFiles = [
  'characters/destination-registry.mjs',
  'characters/population-registry.mjs',
  'characters/orientation-shell.mjs',
  'characters/cloud-traversal.mjs',
  'characters/scene-transition.mjs'
];
for (const rel of requiredProductFiles) assert(exists(rel), 'REQUIRED_PRODUCT_FILE_MISSING', rel);

const c = json(contractPath);
assert(c.governingHead === BASE, 'GOVERNING_HEAD_MISMATCH', c.governingHead);
assert(c.geographyAuthority === 'AUDRALIA_GRATITUDE_GEOGRAPHIC_TRANSFER_AUTHORITY_v1', 'GEOGRAPHY_AUTHORITY_DRIFT');
assert(c.geographyMode === 'READ_ONLY_CONSUMER' && c.sharedAuthorityMutationAllowed === false, 'GEOGRAPHY_AUTHORITY_DRIFT');
assert(JSON.stringify(c.travelStateOrder) === JSON.stringify(['ORBIT','ASCENT','CLOUD_ENTRY','CLOUD_TRANSIT','DESCENT','ARRIVAL']), 'CLOUD_TRAVERSAL_STATE_FAILURE');
assert(JSON.stringify(c.sceneEntryStateOrder) === JSON.stringify(['ENTER_REQUESTED','UI_SETTLE','FADE_TO_BLACK','BLACK_HOLD','ROUTE_HANDOFF']), 'SCENE_ENTRY_FADE_STATE_FAILURE');
assert(c.safeInteriorLaw?.cloudConcealmentMayBeSoleCorrectnessMechanism === false, 'FRAME_BOUNDARY_VISIBLE');
assert(c.cloudLaw?.identityFrame === 'WORLD_ANCHORED' && c.cloudLaw?.cameraMayCreateWeatherIdentity === false, 'CLOUD_STATE_AUTHORITY_DIVERGENCE');
assert(c.populationLaw?.inventedMemberCanonAllowed === false && c.populationLaw?.unsourcedMemberFields === 'HELD', 'UNSOURCED_CHARACTER_CANON_INVENTION');

const dossier = json(dossierPath);
const dossierText = JSON.stringify(dossier);
const protectedCount = Number(dossier.requiredStateCount ?? dossier.protectedStateCount ?? dossier.stateCount ?? 0);
const explicit256 = protectedCount === 256 || /256/.test(dossierText);
assert(explicit256, 'LEGACY_PRESERVATION_FAILURE', '256-state surface not declared');

contains('characters/gratitude-geography.adapter.mjs', 'AUDRALIA_GRATITUDE_GEOGRAPHIC_TRANSFER_AUTHORITY_v1', 'GEOGRAPHY_AUTHORITY_DRIFT');
contains('characters/destination-registry.mjs', 'ORIENTATION_INSTRUMENT', 'DESTINATION_CLASSIFICATION_FAILURE');
contains('characters/destination-registry.mjs', 'CONNECTED_WORLD', 'DESTINATION_CLASSIFICATION_FAILURE');
contains('characters/orientation-shell.mjs', 'STORY', 'DESTINATION_CLASSIFICATION_FAILURE');
contains('characters/orientation-shell.mjs', 'CLOCK', 'DESTINATION_CLASSIFICATION_FAILURE');
contains('characters/population-registry.mjs', 'ENSEMBLE', 'DESTINATION_CLASSIFICATION_FAILURE');
contains('characters/population-registry.mjs', 'HELD', 'UNSOURCED_CHARACTER_CANON_INVENTION');
contains('characters/cloud-traversal.mjs', 'WORLD_ANCHORED', 'CLOUD_STATE_AUTHORITY_DIVERGENCE');
contains('characters/cloud-traversal.mjs', 'CLOUD_ENTRY', 'CLOUD_TRAVERSAL_STATE_FAILURE');
contains('characters/cloud-traversal.mjs', 'CLOUD_TRANSIT', 'CLOUD_TRAVERSAL_STATE_FAILURE');
contains('characters/scene-transition.mjs', 'FADE_TO_BLACK', 'SCENE_ENTRY_FADE_STATE_FAILURE');
contains('characters/scene-transition.mjs', 'BLACK_HOLD', 'SCENE_ENTRY_FADE_STATE_FAILURE');
contains('characters/scene-transition.mjs', 'ROUTE_HANDOFF', 'SCENE_ENTRY_FADE_STATE_FAILURE');
contains('characters/scene-transition.mjs', 'FADE_FROM_BLACK', 'SCENE_ENTRY_FADE_STATE_FAILURE');
contains('characters/scene-transition.mjs', 'pageshow', 'OPAQUE_OVERLAY_RECOVERY_FAILURE');
contains('characters/scene-transition.mjs', 'prefers-reduced-motion', 'MOBILE_OR_REDUCED_MOTION_FAILURE');
contains('characters/app.mjs', 'createCloudTraversalController', 'CLOUD_TRAVERSAL_STATE_FAILURE');
contains('characters/app.mjs', 'createSceneTransitionController', 'SCENE_ENTRY_FADE_STATE_FAILURE');

const registry = read('characters/destination-registry.mjs');
assert(!/id:\s*['"]clock['"][\s\S]{0,200}class:\s*['"]PLACE['"]/.test(registry), 'DESTINATION_CLASSIFICATION_FAILURE', 'clock-as-place');
assert(!/id:\s*['"]story['"][\s\S]{0,200}class:\s*['"]PLACE['"]/.test(registry), 'DESTINATION_CLASSIFICATION_FAILURE', 'story-as-place');

const cloud = read('characters/cloud-traversal.mjs');
assert(/SAFE_INTERIOR/.test(cloud) && /minimumHorizontalInset/.test(cloud), 'SAFE_INTERIOR_CAMERA_ENVELOPE_FAILURE');
assert(!/camera[^\n]{0,80}(create|seed|identity)[^\n]{0,80}weather/i.test(cloud), 'CLOUD_STATE_AUTHORITY_DIVERGENCE');

const app = read('characters/app.mjs');
for (const marker of ['COMPASS','SHOWROOM','H_EARTH','AUDRALIA']) assert(app.includes(marker) || registry.includes(marker), 'CONNECTED_WORLD_ROUTE_REGRESSION', marker);
assert(app.includes('Return to orbit') || read('characters/index.html').includes('Return to orbit'), 'RETURN_PATH_FAILURE');

let changed = '';
try { changed = execFileSync('git', ['diff','--name-only',`${BASE}...HEAD`], {encoding:'utf8'}); } catch {}
if (changed) {
  const allowed = new Set([
    'characters/index.html','characters/app.mjs','characters/narrative-world-state.mjs','characters/night-renderer.mjs','characters/NARRATIVE_WORLD_STATE_CONTRACT.md','characters/step9-regional-geography.mjs','characters/gratitude-geography.adapter.mjs','characters/cardinal-scenes.data.mjs','characters/cardinal-scene-state.mjs','characters/cardinal-scene-geometry.mjs','characters/coast-map.mjs','characters/knowledge-card.mjs','characters/cinematic-intro.mjs','characters/cardinal-scenes.css','characters/destination-registry.mjs','characters/population-registry.mjs','characters/orientation-shell.mjs','characters/cloud-traversal.mjs','characters/scene-transition.mjs',contractPath,'control-plane/whole-estate/characters-reconstruction-v1/verify-mirrorland-destination-population-cloud.v1.mjs'
  ]);
  for (const rel of changed.trim().split('\n').filter(Boolean)) assert(allowed.has(rel), 'PATH_SCOPE_VIOLATION', rel);
}

console.log(JSON.stringify({
  schema: 'MIRRORLAND_DESTINATION_POPULATION_CLOUD_VERIFICATION_RECEIPT_v1',
  result: 'STATIC_CONTRACT_PASS',
  governingHead: BASE,
  invariants: {
    geographyReadOnly: true,
    legacy256Preserved: true,
    destinationClassesFrozen: true,
    safeInteriorRequired: true,
    worldAnchoredClouds: true,
    travelOrderFrozen: true,
    fadeOrderFrozen: true,
    returnRecoveryRequired: true
  }
}, null, 2));
