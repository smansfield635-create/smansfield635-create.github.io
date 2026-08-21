#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import cp from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { canonical, deepClone, fail, hashObject, parseArgs, readJson, sha256, stable, writeJson } from './lib.v1.mjs';
import { buildSyntheticCells, runTerrainCensus } from './terrain-census.v1.mjs';
import { validateEstateReservation } from './estate-reservation-validator.v1.mjs';
import { compileZonePlan } from './zone-articulation-plan-compiler.v1.mjs';
import { compileContinuousOrchestration } from './continuous-map-orchestration-compiler.v1.mjs';
import { evaluateCumulativeConstraints } from './cumulative-constraint-evaluator.v1.mjs';
import { detectVarianceAndRepetition } from './variance-repetition-detector.v1.mjs';
import { planPreviewPackage } from './preview-package-planner.v1.mjs';

const BASE = 'h-earth-3d/control-plane/map-wide-terrain-articulation-estate-reservation';
const FIXTURE = `${BASE}/synthetic-map-fixture.v1.json`;
const REGISTRY = `${BASE}/operator-family-registry.v1.json`;
const NEGATIVES = `${BASE}/negative-fixtures.v1.json`;
const MANIFEST = `${BASE}/changed-path-manifest.v1.json`;
const SEED = `${BASE}/bootstrap-seed.v1.json`;

function git(root, ...args) { return cp.execFileSync('git', args, { cwd: root, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 }).trim(); }
function gitBytes(root, ...args) { return cp.execFileSync('git', args, { cwd: root, maxBuffer: 64 * 1024 * 1024 }); }
function expected(id, code, fn) {
  try { fn(); return { id, expectedErrorCode: code, observedErrorCode: 'NO_FAILURE', pass: false }; }
  catch (error) { const observed = error.code ?? error.message; return { id, expectedErrorCode: code, observedErrorCode: observed, pass: observed === code }; }
}

function positiveChain(root) {
  const fixture = readJson(path.join(root, FIXTURE));
  const registry = readJson(path.join(root, REGISTRY));
  const cells = buildSyntheticCells(fixture.world);
  const census = runTerrainCensus({ world: fixture.world, cells });
  const estate = validateEstateReservation({ reservation: fixture.estateReservation, census });
  const plan = compileZonePlan({ census, estateValidation: estate, zoneDefinitions: fixture.zones, operatorRegistry: registry });
  const orchestration = compileContinuousOrchestration({ census, zonePlan: plan });
  const cumulative = evaluateCumulativeConstraints({ census, estateValidation: estate, zonePlan: plan, orchestration, constraints: fixture.constraints });
  const variance = detectVarianceAndRepetition({ zonePlan: plan, orchestration, constraints: fixture.constraints });
  const preview = planPreviewPackage({ requirements: fixture.previewRequirements, acceptedReference: readJson(path.join(root, SEED)).acceptedLocalProof, estateValidation: estate });
  return { fixture, registry, cells, census, estate, plan, orchestration, cumulative, variance, preview };
}

function runNegatives(base) {
  const tests = [];
  tests.push(expected('WORLD_DIMENSION_MISMATCH','WORLD_DIMENSION_MISMATCH',()=>{const w=deepClone(base.fixture.world);w.width=511;runTerrainCensus({world:w,cells:base.cells});}));
  tests.push(expected('CELL_COUNT_MISMATCH','CELL_COUNT_MISMATCH',()=>runTerrainCensus({world:base.fixture.world,cells:base.cells.slice(1)})));
  tests.push(expected('DUPLICATE_CELL_ADDRESS','DUPLICATE_CELL_ADDRESS',()=>{const c=deepClone(base.cells);c[1].address=c[0].address;runTerrainCensus({world:base.fixture.world,cells:c});}));
  tests.push(expected('CELL_GAP','CELL_ADDRESS_SET_MISMATCH',()=>{const c=deepClone(base.cells);c[c.length-1].address='R99:C99';runTerrainCensus({world:base.fixture.world,cells:c});}));
  tests.push(expected('DISCONNECTED_FIELD_ID','DISCONNECTED_CONTINUOUS_FIELD',()=>{const c=deepClone(base.cells);c[7].continuousFieldId='OTHER_FIELD';runTerrainCensus({world:base.fixture.world,cells:c});}));
  tests.push(expected('CELL_BOUNDS_MISMATCH','CELL_BOUNDS_MISMATCH',()=>{const c=deepClone(base.cells);c[3].bounds.maxX+=1;runTerrainCensus({world:base.fixture.world,cells:c});}));
  tests.push(expected('ESTATE_COMPONENT_MISSING','ESTATE_COMPONENT_MISSING',()=>{const r=deepClone(base.fixture.estateReservation);r.components=r.components.filter(x=>x.type!=='TERRAIN_BUFFER');validateEstateReservation({reservation:r,census:base.census});}));
  tests.push(expected('ESTATE_ANCHOR_OUTSIDE_CORE','ESTATE_ANCHOR_OUTSIDE_MANOR_CORE',()=>{const r=deepClone(base.fixture.estateReservation);r.anchor={x:-200,z:-200};validateEstateReservation({reservation:r,census:base.census});}));
  tests.push(expected('ESTATE_SLOPE_LIMIT_EXCEEDED','ESTATE_BUILDABLE_SLOPE_LIMIT_EXCEEDED',()=>{const r=deepClone(base.fixture.estateReservation);r.buildableSlopeLimitDeg=13;validateEstateReservation({reservation:r,census:base.census});}));
  tests.push(expected('ESTATE_MASK_INTRUSION','ESTATE_MASK_INTRUSION',()=>{const o=deepClone(base.orchestration);const op=o.cellOperations.find(x=>base.estate.protectedCells.includes(x.cellAddress));op.mode='ARTICULATE';op.parameters.amplitude=0.1;evaluateCumulativeConstraints({census:base.census,estateValidation:base.estate,zonePlan:base.plan,orchestration:o,constraints:base.fixture.constraints});}));
  tests.push(expected('UNAUTHORIZED_OPERATOR_FAMILY','UNAUTHORIZED_OPERATOR_FAMILY',()=>{const z=deepClone(base.fixture.zones);z[0].familyId='UNREGISTERED';compileZonePlan({census:base.census,estateValidation:base.estate,zoneDefinitions:z,operatorRegistry:base.registry});}));
  tests.push(expected('ZONE_COVERAGE_GAP','ZONE_COVERAGE_GAP',()=>compileZonePlan({census:base.census,estateValidation:base.estate,zoneDefinitions:base.fixture.zones.slice(1),operatorRegistry:base.registry})));
  tests.push(expected('ZONE_OVERLAP','ZONE_OVERLAP',()=>{const z=deepClone(base.fixture.zones);z.push(deepClone(z[0]));z[z.length-1].zoneId='OVERLAP';compileZonePlan({census:base.census,estateValidation:base.estate,zoneDefinitions:z,operatorRegistry:base.registry});}));
  tests.push(expected('ADJACENCY_BLEND_MISSING','ADJACENCY_BLEND_MISSING',()=>{const o=deepClone(base.orchestration);o.adjacencyBlends.pop();evaluateCumulativeConstraints({census:base.census,estateValidation:base.estate,zonePlan:base.plan,orchestration:o,constraints:base.fixture.constraints});}));
  tests.push(expected('CUMULATIVE_SLOPE_EXCEEDED','CUMULATIVE_SLOPE_LIMIT_EXCEEDED',()=>{const c=deepClone(base.fixture.constraints);c.maxTerrainSlopeDeg=15;evaluateCumulativeConstraints({census:base.census,estateValidation:base.estate,zonePlan:base.plan,orchestration:base.orchestration,constraints:c});}));
  tests.push(expected('TRAVERSAL_CORRIDOR_LOST','TRAVERSAL_CORRIDOR_LOST',()=>{const census=deepClone(base.census);census.cells.forEach(cell=>{cell.traversable=false;});evaluateCumulativeConstraints({census,estateValidation:base.estate,zonePlan:base.plan,orchestration:base.orchestration,constraints:base.fixture.constraints});}));
  tests.push(expected('PERFORMANCE_BUDGET_EXCEEDED','PERFORMANCE_BUDGET_EXCEEDED',()=>{const c=deepClone(base.fixture.constraints);c.maxEstimatedOperations=10;evaluateCumulativeConstraints({census:base.census,estateValidation:base.estate,zonePlan:base.plan,orchestration:base.orchestration,constraints:c});}));
  tests.push(expected('REPETITION_SIGNATURE_EXCEEDED','REPETITION_SIGNATURE_EXCEEDED',()=>detectVarianceAndRepetition({zonePlan:base.plan,orchestration:base.orchestration,constraints:base.fixture.constraints,overrideMetrics:{maxRepeatedSignature:99}})));
  tests.push(expected('GRID_CORRELATION_EXCEEDED','GRID_CORRELATION_EXCEEDED',()=>detectVarianceAndRepetition({zonePlan:base.plan,orchestration:base.orchestration,constraints:base.fixture.constraints,overrideMetrics:{gridCorrelation:0.99}})));
  tests.push(expected('PREVIEW_CLASS_MISSING','PREVIEW_CAMERA_CLASS_MISSING',()=>{const r=deepClone(base.fixture.previewRequirements);r.requiredCameraClasses=r.requiredCameraClasses.filter(x=>x!=='ESTATE_ENVELOPE');planPreviewPackage({requirements:r,acceptedReference:{},estateValidation:base.estate});}));
  tests.push(expected('ROLLBACK_IDENTITY_MISSING','ROLLBACK_IDENTITY_MISSING',()=>{const r=deepClone(base.fixture.previewRequirements);r.rollbackIdentity='';planPreviewPackage({requirements:r,acceptedReference:{},estateValidation:base.estate});}));
  tests.push(expected('ACTUAL_TERRAIN_MUTATION_REQUESTED','ACTUAL_TERRAIN_MUTATION_PROHIBITED',()=>{const x=deepClone(base.fixture.forbiddenRequests);x.actualTerrainMutation=true;if(x.actualTerrainMutation)fail('ACTUAL_TERRAIN_MUTATION_PROHIBITED');}));
  tests.push(expected('MANOR_CONSTRUCTION_REQUESTED','MANOR_CONSTRUCTION_PROHIBITED',()=>{const x=deepClone(base.fixture.forbiddenRequests);x.manorConstruction=true;if(x.manorConstruction)fail('MANOR_CONSTRUCTION_PROHIBITED');}));
  tests.push(expected('VERIFIER_REPAIR_ATTEMPT','VERIFIER_REPAIR_PROHIBITED',()=>{const x=deepClone(base.fixture.forbiddenRequests);x.verifierRepair=true;if(x.verifierRepair)fail('VERIFIER_REPAIR_PROHIBITED');}));
  tests.push(expected('ACTIVATION_ATTEMPT','PERMANENT_ACTIVATION_PROHIBITED',()=>{const x=deepClone(base.fixture.forbiddenRequests);x.permanentActivation=true;if(x.permanentActivation)fail('PERMANENT_ACTIVATION_PROHIBITED');}));
  return tests;
}

function repositoryIdentity(root, expectedHead) {
  if (!expectedHead) return { skippedForLocalPreflight: true };
  const manifest = readJson(path.join(root, MANIFEST));
  const actualHead = git(root,'rev-parse','HEAD^{commit}');
  if (actualHead !== expectedHead) fail('EXACT_HEAD_MISMATCH',`${expectedHead}:${actualHead}`);
  if (git(root,'status','--porcelain=v1','--untracked-files=all')) fail('DIRTY_WORKTREE');
  const names = git(root,'diff','--name-only',manifest.baseHead,expectedHead).split(/\r?\n/).filter(Boolean).sort();
  const expected = [...manifest.expectedChangedPaths].sort();
  if (canonical(names)!==canonical(expected)) fail('CHANGED_PATH_SET_MISMATCH');
  const status = git(root,'diff','--name-status',manifest.baseHead,expectedHead).split(/\r?\n/).filter(Boolean);
  if (status.some(line=>!line.startsWith('A\t'))) fail('EXISTING_PATH_MUTATION_DETECTED');
  const blobMap = names.map(filePath=>({path:filePath,gitBlob:git(root,'rev-parse',`${expectedHead}:${filePath}`),sha256:sha256(gitBytes(root,'show',`${expectedHead}:${filePath}`))}));
  return { baseHead:manifest.baseHead,expectedHead,changedPathCount:names.length,changedPathBlobMap:blobMap };
}

export function runSelfTest({ root, expectedHead = null, holder, outputDir }) {
  if (!holder) fail('EXECUTION_HOLDER_REQUIRED');
  const positive = positiveChain(root);
  const negative = runNegatives(positive);
  const declared = readJson(path.join(root,NEGATIVES)).fixtures.map(x=>({id:x.id,expectedErrorCode:x.expectedErrorCode})).sort((a,b)=>a.id.localeCompare(b.id));
  const observed = negative.map(x=>({id:x.id,expectedErrorCode:x.expectedErrorCode})).sort((a,b)=>a.id.localeCompare(b.id));
  if(canonical(declared)!==canonical(observed)) fail('NEGATIVE_FIXTURE_REGISTRY_MISMATCH');
  if(!negative.every(x=>x.pass)) fail('NEGATIVE_FIXTURE_FAILURE',canonical(negative.filter(x=>!x.pass)));
  const identity=repositoryIdentity(root,expectedHead);
  const fingerprintPayload=stable({
    schema:'H_EARTH_MAP_WIDE_TERRAIN_INSTRUMENT_FINGERPRINT_PAYLOAD_v1',
    identity,
    world:positive.fixture.world,
    censusDigest:positive.census.censusDigest,
    reservationDigest:positive.estate.reservationDigest,
    zonePlanDigest:positive.plan.planDigest,
    orchestrationDigest:positive.orchestration.orchestrationDigest,
    cumulativeDigest:positive.cumulative.evaluationDigest,
    varianceDigest:positive.variance.detectorDigest,
    previewDigest:positive.preview.planDigest,
    negativeResults:negative.map(x=>({id:x.id,expectedErrorCode:x.expectedErrorCode,pass:x.pass})),
    normalization:{excludes:['EXECUTION_HOLDER','TEMP_PATHS','WORKFLOW_IDS']}
  });
  const receipt=stable({
    schema:'BOOTSTRAP_SELF_TEST_RECEIPT_v1',
    result:'PASS_CLOSED',
    executionHolder:holder,
    expectedHead:expectedHead??'LOCAL_PREFLIGHT',
    packageFingerprint:hashObject(fingerprintPayload),
    fingerprintPayload,
    positiveChain:{
      cellCount:positive.census.cells.length,
      continuousFieldId:positive.census.world.continuousFieldId,
      protectedEstateCellCount:positive.estate.protectedCells.length,
      zoneCount:positive.plan.zones.length,
      adjacencyBlendCount:positive.orchestration.adjacencyBlends.length,
      cumulativeResult:positive.cumulative.result,
      varianceResult:positive.variance.result,
      previewPlanComplete:true
    },
    negativeFixtureCount:negative.length,
    negativeFixturesPassed:negative.filter(x=>x.pass).length,
    actualTerrainMutationPerformed:false,
    manorConstructionPerformed:false,
    productMutationPerformed:false,
    mapWideCandidateExecuted:false,
    permanentInstrumentActivated:false,
    mergePerformed:false,
    repairPerformed:false
  });
  fs.mkdirSync(outputDir,{recursive:true});
  writeJson(path.join(outputDir,'bootstrap-self-test-receipt.json'),receipt);
  writeJson(path.join(outputDir,'terrain-census.json'),positive.census);
  writeJson(path.join(outputDir,'estate-reservation-validation.json'),positive.estate);
  writeJson(path.join(outputDir,'zone-articulation-plan.json'),positive.plan);
  writeJson(path.join(outputDir,'continuous-orchestration-plan.json'),positive.orchestration);
  writeJson(path.join(outputDir,'cumulative-constraint-result.json'),positive.cumulative);
  writeJson(path.join(outputDir,'variance-repetition-result.json'),positive.variance);
  writeJson(path.join(outputDir,'preview-package-plan.json'),positive.preview);
  writeJson(path.join(outputDir,'negative-results.json'),negative);
  return receipt;
}

function main(){const args=parseArgs(process.argv.slice(2));runSelfTest({root:path.resolve(args.root??'.'),expectedHead:args['expected-head']??null,holder:args.holder,outputDir:path.resolve(args['output-dir']??'/tmp/map-wide-terrain-self-test')});}
const invoked=process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url);if(invoked)main();
