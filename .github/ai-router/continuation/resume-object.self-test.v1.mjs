#!/usr/bin/env node
import fs from 'node:fs';

const SCHEMA_PATH = new URL('./resume-object.schema.v1.json', import.meta.url);
const schema = JSON.parse(fs.readFileSync(SCHEMA_PATH, 'utf8'));
const SHA40 = /^[0-9a-f]{40}$/;
const BRANCH = /^refs\/heads\/[A-Za-z0-9._/-]+$/;
const ACTION_CLASSES = new Set(['CONSTRUCTION','REGISTERED_WRITEBACK','QUALIFICATION','PHYSICAL_REVIEW','MERGE','PUBLICATION','TERMINAL_CLOSE']);

function uniqueStrings(value, { nonEmpty = false } = {}) {
  return Array.isArray(value) && (!nonEmpty || value.length > 0) && value.every(x => typeof x === 'string' && x.length > 0) && new Set(value).size === value.length;
}

export function validateResumeObject(value) {
  const errors = [];
  if (!value || typeof value !== 'object' || Array.isArray(value)) return { ok: false, errors: ['OBJECT_REQUIRED'] };
  const required = ['schema','status','operationId','authorityGeneration','projectId','exactBranch','exactHead','allowedPaths','completedCheckpoints','preservedEvidence','nextAction','requiredVerifier','stopCondition','authorityEffect'];
  for (const key of required) if (!Object.hasOwn(value, key)) errors.push(`MISSING:${key}`);
  if (value.schema !== 'CONTROL_PLANE_RESUME_OBJECT_v1') errors.push('SCHEMA_INVALID');
  if (!['ACTIVE_RESUMABLE','BLOCKED_EXACT_BINDING','TERMINAL'].includes(value.status)) errors.push('STATUS_INVALID');
  if (typeof value.operationId !== 'string' || value.operationId.length < 3) errors.push('OPERATION_INVALID');
  if (!Number.isInteger(value.authorityGeneration) || value.authorityGeneration < 1) errors.push('AUTHORITY_GENERATION_INVALID');
  if (typeof value.projectId !== 'string' || value.projectId.length < 2) errors.push('PROJECT_INVALID');
  if (!BRANCH.test(value.exactBranch || '')) errors.push('BRANCH_INVALID');
  if (!SHA40.test(value.exactHead || '')) errors.push('HEAD_INVALID');
  if (!uniqueStrings(value.allowedPaths, { nonEmpty: true })) errors.push('ALLOWED_PATHS_INVALID');
  if (!uniqueStrings(value.completedCheckpoints)) errors.push('CHECKPOINTS_INVALID');
  if (!uniqueStrings(value.preservedEvidence, { nonEmpty: true })) errors.push('EVIDENCE_INVALID');
  if (!value.nextAction || typeof value.nextAction !== 'object' || Array.isArray(value.nextAction)) errors.push('NEXT_ACTION_INVALID');
  else {
    if (typeof value.nextAction.actionId !== 'string' || !value.nextAction.actionId) errors.push('NEXT_ACTION_ID_INVALID');
    if (!ACTION_CLASSES.has(value.nextAction.actionClass)) errors.push('NEXT_ACTION_CLASS_INVALID');
    if (typeof value.nextAction.binding !== 'string' || !value.nextAction.binding) errors.push('NEXT_ACTION_BINDING_INVALID');
    if (typeof value.nextAction.expectedResult !== 'string' || !value.nextAction.expectedResult) errors.push('NEXT_ACTION_RESULT_INVALID');
  }
  if (!value.requiredVerifier || typeof value.requiredVerifier !== 'object' || Array.isArray(value.requiredVerifier)) errors.push('VERIFIER_INVALID');
  else for (const key of ['verifierId','binding','successResult']) if (typeof value.requiredVerifier[key] !== 'string' || !value.requiredVerifier[key]) errors.push(`VERIFIER_${key.toUpperCase()}_INVALID`);
  if (!value.stopCondition || typeof value.stopCondition !== 'object' || Array.isArray(value.stopCondition)) errors.push('STOP_CONDITION_INVALID');
  else for (const key of ['conditionId','disposition']) if (typeof value.stopCondition[key] !== 'string' || !value.stopCondition[key]) errors.push(`STOP_${key.toUpperCase()}_INVALID`);
  if (value.authorityEffect !== 'NONE_RESUME_OBJECT_ONLY') errors.push('AUTHORITY_EFFECT_INVALID');
  const allowedTop = new Set(required);
  for (const key of Object.keys(value)) if (!allowedTop.has(key)) errors.push(`UNDECLARED_TOP_LEVEL:${key}`);
  return { ok: errors.length === 0, errors };
}

const gen2286 = {
  schema: 'CONTROL_PLANE_RESUME_OBJECT_v1',
  status: 'ACTIVE_RESUMABLE',
  operationId: 'AUDRALIA_CANONICAL_GEOGRAPHY_REBIND_20260915_001',
  authorityGeneration: 2286,
  projectId: 'H_EARTH',
  exactBranch: 'refs/heads/audralia-canonical-geography-rebind-20260915-001',
  exactHead: 'ab675886e494a36849b23eb842d2bd6cd42009da',
  allowedPaths: [
    'showroom/globe/audralia/index.html',
    'showroom/globe/h-earth/terrain-estate-construction-v1/audralia-tablet-single-context-clouds-runtime.mjs',
    'showroom/globe/h-earth/terrain-estate-construction-v1/renderer.precomputed.mjs',
    'showroom/globe/h-earth/terrain-estate-construction-v1/gratitude-mesh-v1.bin.gz',
    'showroom/globe/h-earth/terrain-estate-construction-v1/gratitude-mesh-v1.part-00.gz',
    'showroom/globe/h-earth/terrain-estate-construction-v1/gratitude-mesh-v1.part-01.gz',
    'showroom/globe/h-earth/terrain-estate-construction-v1/gratitude-mesh-v1.part-02.gz',
    'showroom/globe/h-earth/terrain-estate-construction-v1/gratitude-mesh-v1.part-03.gz',
    'showroom/globe/h-earth/terrain-estate-construction-v1/gratitude-mesh-v1.part-04.gz',
    'showroom/globe/h-earth/terrain-estate-construction-v1/gratitude-mesh-v1.part-05.gz',
    'showroom/globe/h-earth/terrain-estate-construction-v1/gratitude-mesh-v1.part-06.gz',
    'showroom/globe/h-earth/terrain-estate-construction-v1/gratitude-mesh-v1.part-07.gz',
    'showroom/globe/h-earth/terrain-estate-construction-v1/gratitude-mesh-v1.provenance.json',
    'h-earth-3d/experience-anchor/receipts/AUDRALIA_CANONICAL_GEOGRAPHY_REBIND_20260915_v1.json'
  ],
  completedCheckpoints: [
    'CANONICAL_ADMISSION_PRESERVED',
    'EXACT_CONSTRUCTION_BRANCH_BOUND',
    'FINISHED_GENERATOR_REGISTERED',
    'WRITEBACK_DESCRIPTOR_ACTIVE_CERTIFIED'
  ],
  preservedEvidence: [
    'ISSUE_3510_CANONICAL_REVIEW_CARRIER',
    'ISSUE_3511_REGISTERED_WRITEBACK_AUTHORITY',
    'DESCRIPTOR_AUDRALIA_GEN2286_CANONICAL_GEOGRAPHY_GENERATOR_WRITEBACK_DESCRIPTOR_V1'
  ],
  nextAction: {
    actionId: 'GEN2286_REGISTERED_GENERATOR_WRITEBACK',
    actionClass: 'REGISTERED_WRITEBACK',
    binding: 'AUDRALIA_GEN2286_CANONICAL_GEOGRAPHY_GENERATOR_WRITEBACK_DESCRIPTOR_V1',
    expectedResult: 'NEW_EXACT_GEN2286_CANDIDATE_HEAD'
  },
  requiredVerifier: {
    verifierId: 'GEN2286_FROZEN_VERIFIER',
    binding: 'EXACT_NEW_CANDIDATE_READ_ONLY_QUALIFICATION',
    successResult: 'PASS_BEFORE_PHYSICAL_REVIEW'
  },
  stopCondition: {
    conditionId: 'PHYSICAL_DEVICE_REVIEW_REQUIRED',
    disposition: 'STOP_FOR_OWNER_KEEP_ONE_REPAIR_REJECT'
  },
  authorityEffect: 'NONE_RESUME_OBJECT_ONLY'
};

const cases = [];
function check(name, predicate) { cases.push({ name, pass: Boolean(predicate) }); }

const valid = validateResumeObject(gen2286);
check('schema containment baseline fixed', schema?.['x-containment']?.comparisonBaseline === 'a4778f219b37efba7d25534fca9f3128b9ec9a26');
check('schema governing head fixed', schema?.['x-containment']?.governingHead === 'aa1d21773715cf5c320f17c8dfc50f77a5eff869');
check('single successor room authority', schema?.['x-containment']?.singleSuccessorRoomAuthority === true);
check('supporting mechanisms internal', schema?.['x-containment']?.supportingMechanismsAreInternalInputs === true);
check('systemic defect stop threshold two', schema?.['x-containment']?.systemicDefectStopThreshold === 2);
check('Gen2286 positive resume object', valid.ok);
check('Gen2286 exact branch preserved', gen2286.exactBranch === 'refs/heads/audralia-canonical-geography-rebind-20260915-001');
check('Gen2286 exact head preserved', gen2286.exactHead === 'ab675886e494a36849b23eb842d2bd6cd42009da');
check('Gen2286 one next action', !Array.isArray(gen2286.nextAction) && gen2286.nextAction.actionClass === 'REGISTERED_WRITEBACK');
check('Gen2286 physical stop preserved', gen2286.stopCondition.conditionId === 'PHYSICAL_DEVICE_REVIEW_REQUIRED');

const missingHead = structuredClone(gen2286); delete missingHead.exactHead;
check('missing exact head fails closed', !validateResumeObject(missingHead).ok);
const movingHead = structuredClone(gen2286); movingHead.exactHead = 'main';
check('moving/non-SHA head fails closed', !validateResumeObject(movingHead).ok);
const noPaths = structuredClone(gen2286); noPaths.allowedPaths = [];
check('empty allowed paths fails closed', !validateResumeObject(noPaths).ok);
const authorityLeak = structuredClone(gen2286); authorityLeak.authorityEffect = 'MERGE_ALLOWED';
check('resume object cannot create authority', !validateResumeObject(authorityLeak).ok);
const secondAuthority = structuredClone(gen2286); secondAuthority.secondaryContinuationAuthority = 'HISTORY_RECONSTRUCTION';
check('second continuation authority rejected', !validateResumeObject(secondAuthority).ok);

const pass = cases.every(x => x.pass);
const receipt = {
  schema: 'CONTROL_PLANE_RESUME_OBJECT_SELF_TEST_v1',
  result: pass ? 'PASS_CLOSED' : 'FAIL_CLOSED',
  operationId: 'CONTROL_PLANE_CONTAINMENT_AND_CONTINUATION_REDUCTION_20260915_001',
  lockGeneration: 2303,
  comparisonBaseline: 'a4778f219b37efba7d25534fca9f3128b9ec9a26',
  governingHead: 'aa1d21773715cf5c320f17c8dfc50f77a5eff869',
  caseCount: cases.length,
  passCount: cases.filter(x => x.pass).length,
  failureCount: cases.filter(x => !x.pass).length,
  cases,
  gen2286ResumeObject: gen2286,
  newExecutionBackendCreated: false,
  newFallbackClassCreated: false,
  newClassifierClassCreated: false,
  authorityCreated: false
};

process.stdout.write(`${JSON.stringify(receipt, null, 2)}\n`);
process.exit(pass ? 0 : 1);
