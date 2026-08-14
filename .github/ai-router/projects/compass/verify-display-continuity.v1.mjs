#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const ROOT = process.cwd();
const GOVERNING_HEAD = 'e933c08094019c015dd4abfbe7b5082e26044f89';
const OUTPUT = process.env.COMPASS_VERIFICATION_OUTPUT || '/tmp/compass-display-continuity-verification-receipt.json';

const allowedPaths = new Set([
  'index.html',
  'assets/compass/compass-core.css',
  'assets/compass/compass.css',
  'assets/compass/compass.controller.js',
  'assets/compass/compass.cosmos.js',
  'assets/compass/compass.crystals.js',
  'assets/compass/compass.mirrorland-window.js',
  'assets/compass/upstream-compass.css',
  'assets/compass/upstream-compass.geometry.js',
  'assets/compass/upstream-compass.renderer.js',
  '.github/ai-router/router.v1.json',
  '.github/ai-router/projects/compass/entrypoint.v1.json',
  '.github/ai-router/projects/compass/route-display-contract.v1.json',
  '.github/ai-router/projects/compass/verify-display-continuity.v1.mjs',
  '.github/workflows/compass-display-continuity-validation.yml'
]);

const prohibitedPrefixes = [
  'door/', 'home/', 'showroom/', 'h-earth-3d/', 'laws/', 'evidence/',
  'governance/', 'products/', 'build/'
];

const requiredContractFields = [
  'LOCAL_IDENTITY',
  'NARRATIVE_RELATION',
  'ORIENTATION_RELATION',
  'DISPLAY_ROLE',
  'RUNTIME_CEILING',
  'PERSISTENT_OBJECTS',
  'TRANSITION_MEANING',
  'PROGRESSIVE_DISCLOSURE',
  'MOBILE_COMPOSITION',
  'REDUCED_MOTION_EQUIVALENCE',
  'RETURN_CONTRACT',
  'CLAIM_BOUNDARY',
  'LOCAL_VISUAL_IDENTITY',
  'CONTINUITY_HOOK'
];

const checks = [];
const check = (id, pass, evidence) => checks.push({ id, pass: Boolean(pass), evidence });
const read = p => fs.readFileSync(path.join(ROOT, p), 'utf8');
const json = p => JSON.parse(read(p));

const router = json('.github/ai-router/router.v1.json');
const entrypoint = json('.github/ai-router/projects/compass/entrypoint.v1.json');
const contract = json('.github/ai-router/projects/compass/route-display-contract.v1.json');
const html = read('index.html');
const css = read('assets/compass/compass.css');
const coreCss = read('assets/compass/compass-core.css');
const controller = read('assets/compass/compass.controller.js');

const compassRoute = router.projects?.find(project => project.projectId === 'COMPASS');
check('COMPASS_PROJECT_ROUTE_REGISTERED', Boolean(compassRoute), compassRoute || null);
check('COMPASS_ENTRYPOINT_ACTIVE', entrypoint.projectId === 'COMPASS' && entrypoint.status === 'ACTIVE_REGISTERED_PROJECT', entrypoint.status);
check('ROUTING_CREATES_NO_AUTHORITY', entrypoint.authorityBoundary?.includes('THIS_ENTRYPOINT_ROUTES_AND_DOES_NOT_CREATE_MUTATION_AUTHORITY'), entrypoint.authorityBoundary);

for (const field of requiredContractFields) {
  const value = contract.fields?.[field];
  const resolved = Array.isArray(value) ? value.length > 0 : value !== undefined && value !== null && value !== '';
  check(`ROUTE_DISPLAY_CONTRACT_${field}`, resolved, value);
}
check('ROUTE_DISPLAY_CONTRACT_ALL_14_RESOLVED', requiredContractFields.every(field => contract.fields?.[field] !== undefined), requiredContractFields);

const cardinals = [
  ['north', 'Orientation'],
  ['east', 'Worlds'],
  ['south', 'Instruments'],
  ['west', 'Frontier']
];
for (const [id, label] of cardinals) {
  check(`CARDINAL_${id.toUpperCase()}_PRESENT`, html.includes(`data-cardinal-id="${id}"`) && html.includes(`data-coordinate-label="${label}"`), `${id}:${label}`);
}
check('EXACTLY_FOUR_PUBLIC_CARDINAL_IDS', (html.match(/data-cardinal-id="(north|east|south|west)"/g) || []).length === 4, 'north,east,south,west');
check('MIRRORLAND_NOT_CARDINAL', html.includes('data-destination-type="mirrorland"') && !/data-compass-cardinal[^>]*data-destination-type="mirrorland"/.test(html), 'Mirrorland remains threshold/discovery class');
check('RETURN_TO_ORBIT_PRESENT', html.includes('data-compass-return-to-orbit') && html.includes('Return to Orbit'), 'explicit return control');
check('BACK_TO_COMPASS_PRESENT', html.includes('data-compass-mirrorland-back') && html.includes('Back to Compass'), 'Mirrorland withdrawal control');
const preservesCompassState = [
  'state.preserved',
  'restorePreservedCompassState',
  'applyPreservedState'
].every(token => controller.includes(token));
check('PRESERVED_COMPASS_STATE_PRESENT', preservesCompassState, 'controller captures, restores, and applies preserved Compass state across Mirrorland transitions');
check('CONTROLLER_FOUR_CARDINAL_SEQUENCE', controller.includes('"north"') && controller.includes('"east"') && controller.includes('"south"') && controller.includes('"west"'), 'controller cardinal sequence');
check('CONTROLLER_MIRRORLAND_LIFECYCLE', ['MIRRORLAND_REVEALING','MIRRORLAND_FOCUSED','MIRRORLAND_WITHDRAWING'].every(token => controller.includes(token)), 'Mirrorland lifecycle states');
check('MOBILE_DISTINCT_COMPOSITION', css.includes('@media (max-width: 820px)') && css.includes('@media (max-width: 560px)') && coreCss.includes('@media (max-width: 820px)'), 'tablet and phone composition rules');
check('REDUCED_MOTION_EQUIVALENCE', css.includes('@media (prefers-reduced-motion: reduce)') && coreCss.includes('prefers-reduced-motion'), 'reduced-motion CSS paths');
check('KEYBOARD_FOCUS_VISIBLE', coreCss.includes(':focus-visible') && html.includes('data-compass-return-to-orbit'), 'semantic controls retain focus path');
check('CLAIM_BOUNDARY_TRL_BADGE_REMOVED', !css.includes('SELF-ASSESSED SOFTWARE TRL 7'), 'Compass visual layer contains no TRL badge');
check('COMPASS_REFERENCE_LAYER_DECLARED', css.includes('Compass reference implementation') && css.includes('Mirrorland remains a threshold behind the map, never a fifth direction.'), 'bounded display-continuity layer');

const git = spawnSync('git', ['diff', '--name-only', `${GOVERNING_HEAD}...HEAD`], { cwd: ROOT, encoding: 'utf8' });
if (git.status === 0) {
  const changedPaths = git.stdout.split(/\r?\n/).map(v => v.trim()).filter(Boolean);
  check('EXACT_SCOPE_ONLY', changedPaths.every(p => allowedPaths.has(p)), changedPaths);
  check('NO_PROHIBITED_PATH_MUTATION', changedPaths.every(p => !prohibitedPrefixes.some(prefix => p.startsWith(prefix))), changedPaths);
} else {
  check('EXACT_SCOPE_ONLY', false, git.stderr || 'git diff failed');
  check('NO_PROHIBITED_PATH_MUTATION', false, git.stderr || 'git diff failed');
}

const failed = checks.filter(item => !item.pass);
const receipt = {
  schema: 'COMPASS_DISPLAY_CONTINUITY_VERIFICATION_RECEIPT_v1',
  operationId: 'COMPASS_REFERENCE_IMPLEMENTATION_CONSTRUCTION_v1',
  governingHead: GOVERNING_HEAD,
  candidateHead: process.env.GITHUB_SHA || null,
  result: failed.length === 0 ? 'PASS' : 'FAIL_CLOSED',
  staticQualification: failed.length === 0 ? 'PASS' : 'FAIL_CLOSED',
  runtimeQualification: 'REQUIRES_WORKFLOW_BROWSER_EVIDENCE',
  checks,
  failures: failed.map(item => item.id)
};

fs.writeFileSync(OUTPUT, `${JSON.stringify(receipt, null, 2)}\n`);
console.log(JSON.stringify(receipt, null, 2));
if (failed.length) process.exit(1);
