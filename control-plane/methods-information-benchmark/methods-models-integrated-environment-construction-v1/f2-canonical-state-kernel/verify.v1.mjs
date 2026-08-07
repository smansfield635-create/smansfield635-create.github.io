import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const ROOT = 'control-plane/methods-information-benchmark/methods-models-integrated-environment-construction-v1/f2-canonical-state-kernel';
const TEMP_WORKFLOW = '.github/workflows/temporary-methods-models-final-f2-verify.yml';
const F1_HEAD = '82ad9ca532003bb66845ab4002d395ec4c630ca3';
const FROZEN_MAIN = 'a8ef9e4b4701bd15d09ad14c829e2f4b10f9ccfc';
const AXES = ['SYSTEM','SCIENTIFIC_OBJECT','MODEL','METHOD_STAGE','EVIDENCE','EXECUTION','CUSTODY','CLAIM_CEILING','SUPPORT_MODE','LENS','VIEW_MODE','ROUTE_HISTORY','CONTENT_VERSION'];
const STATUSES = ['DECLARED','UNSET','UNEVALUABLE','NOT_APPLICABLE'];
const CUSTODY = ['SOURCE_SIDE','ANALYST_SIDE','OUTCOME_SIDE','SCORING_SIDE'];
const SUPPORT = ['INTRINSIC','SUPPORTED','SUBSTITUTED','MIXED'];

function fail(message) { throw new Error(message); }
function assert(condition, message) { if (!condition) fail(message); }
function readJson(name) { return JSON.parse(fs.readFileSync(path.join(ROOT, name), 'utf8')); }
function git(args) { return execFileSync('git', args, { encoding: 'utf8' }).trim(); }
function sorted(v) { return [...v].sort(); }
function exactArray(actual, expected, label) {
  assert(Array.isArray(actual), `${label}: expected array`);
  assert(JSON.stringify(actual) === JSON.stringify(expected), `${label}: mismatch`);
}
function exactSet(actual, expected, label) {
  assert(JSON.stringify(sorted(actual)) === JSON.stringify(sorted(expected)), `${label}: set mismatch`);
}
function exactKeys(obj, keys, label) { exactSet(Object.keys(obj), keys, `${label} keys`); }
function nonEmptyString(v) { return typeof v === 'string' && v.length > 0; }
function object(v) { return v !== null && typeof v === 'object' && !Array.isArray(v); }
function clone(v) { return JSON.parse(JSON.stringify(v)); }

const sources = readJson('source-bindings.v1.json');
const kernel = readJson('canonical-state-kernel.v1.json');
const registry = readJson('axis-registry.v1.json');
const schema = readJson('state-envelope.schema.v1.json');
const authority = readJson('authority-and-plane-contract.v1.json');
const fixtures = readJson('conformance-fixtures.v1.json');
const receipt = readJson('f2-terminal-receipt.v1.json');

// F1 ancestry and frozen-governing-input checks.
git(['cat-file','-e',`${F1_HEAD}^{commit}`]);
execFileSync('git', ['merge-base','--is-ancestor',F1_HEAD,'HEAD']);
assert(git(['rev-parse','origin/main']) === FROZEN_MAIN, 'governing main drifted from F1 frozen baseline');
assert(sources.inputF1.finalHead === F1_HEAD, 'source binding F1 head mismatch');
assert(sources.governingMainFrozenByF1.commit === FROZEN_MAIN, 'source binding main mismatch');
assert(git(['rev-parse',`${F1_HEAD}:${sources.inputF1.terminalReceiptPath}`]) === sources.inputF1.terminalReceiptBlob, 'F1 terminal receipt blob mismatch');
for (const src of sources.sources) {
  const actual = git(['rev-parse',`${FROZEN_MAIN}:${src.path}`]);
  assert(actual === src.blob, `source blob mismatch: ${src.id}`);
}

// Scope fail-closed: F2 package plus temporary verifier only.
const changed = git(['diff','--name-only',`${F1_HEAD}..HEAD`]).split('\n').filter(Boolean);
assert(changed.length >= 1, 'no F2 changes found');
for (const p of changed) {
  assert(p.startsWith(`${ROOT}/`) || p === TEMP_WORKFLOW, `unauthorized F2 path mutation: ${p}`);
}
for (const prohibited of ['laws/research/methods-and-models/','laws/','showroom/','assets/','.github/ai-router/']) {
  assert(!changed.some(p => p.startsWith(prohibited)), `protected path mutated: ${prohibited}`);
}

// Required 13-axis kernel and no unauthorized fourteenth authority axis.
exactArray(kernel.axisOrder, AXES, 'kernel.axisOrder');
assert(kernel.axisCount === 13, 'kernel axisCount must equal 13');
assert(!kernel.axisOrder.includes('AUTHORITY'), 'AUTHORITY may not become a fourteenth axis');
exactArray(registry.axisOrder, AXES, 'registry.axisOrder');
assert(registry.axisCount === 13, 'registry axisCount must equal 13');
exactSet(Object.keys(registry.axes), AXES, 'registry axes');
exactArray(registry.axisStatusVocabulary, STATUSES, 'axis status vocabulary');

const planeAxes = Object.values(kernel.statePlanes).flat();
assert(planeAxes.length === 13, 'state planes must contain 13 axis placements');
exactSet(planeAxes, AXES, 'state plane partition');
assert(new Set(planeAxes).size === 13, 'state plane partition contains duplicates');
exactArray(kernel.representationOnlyAxes, ['LENS','VIEW_MODE'], 'representation-only axes');
exactArray(kernel.navigationOnlyAxes, ['ROUTE_HISTORY'], 'navigation-only axes');
exactArray(kernel.restorationBindingAxes, ['CONTENT_VERSION'], 'restoration-binding axes');
assert(kernel.cp6CanonicalIdentityTupleReconciliation.AUTHORITY === 'EACH_AXIS.authorityRef', 'CP6 AUTHORITY reconciliation mismatch');
assert(kernel.cp6CanonicalIdentityTupleReconciliation.OBJECT_CLASS === 'SCIENTIFIC_OBJECT.value.objectClass', 'CP6 OBJECT_CLASS reconciliation mismatch');

// F2/F3 boundary.
const forbiddenF2 = ['DEFAULTS','PRECEDENCE','CROSS_AXIS_VALIDITY_COMBINATIONS','INVALID_STATE_RESOLUTION','CANONICALIZATION_ALGORITHM','SILENT_FALLBACK','URL_CODEC','RUNTIME_RESTORATION','SCIENTIFIC_CONTENT_BINDINGS'];
exactSet(kernel.f2DoesNotDefine, forbiddenF2, 'F2 excluded behavior');
assert(kernel.nextGateOwnerForExcludedBehavior === 'F3_RESOLUTION_AND_VALIDITY_ENGINE', 'F3 ownership mismatch');
exactSet(authority.f3ReservedAuthority, ['DEFAULT_SELECTION','PRECEDENCE','CROSS_AXIS_VALIDITY','INVALID_COMBINATION_HANDLING','UNEVALUABLE_RESOLUTION','DETERMINISTIC_CANONICALIZATION','NO_SILENT_FALLBACK_ENFORCEMENT'], 'F3 reserved authority');
assert(authority.publicMutationAuthorized === false && authority.scientificClaimUpgradeAuthorized === false && authority.geometryAuthorized === false, 'F2 authority boundary inflated');

function assertNoDefaultKeys(value, label = 'root') {
  if (Array.isArray(value)) return value.forEach((v, i) => assertNoDefaultKeys(v, `${label}[${i}]`));
  if (!object(value)) return;
  for (const [k, v] of Object.entries(value)) {
    assert(k !== 'default', `silent default key forbidden at ${label}`);
    assertNoDefaultKeys(v, `${label}.${k}`);
  }
}
assertNoDefaultKeys(kernel);
assertNoDefaultKeys(registry);
assertNoDefaultKeys(schema);

function assertValueObject(value, keys, label) {
  assert(object(value), `${label}: value must be object`);
  exactKeys(value, keys, label);
  for (const key of keys) {
    if (key === 'prohibitions') continue;
    if (key === 'order') continue;
    assert(nonEmptyString(value[key]), `${label}.${key}: nonempty string required`);
  }
}

function validateState(state) {
  try {
    assert(object(state), 'state must be object');
    exactKeys(state, ['schema','kernelVersion','axes'], 'state');
    assert(state.schema === 'METHODS_MODELS_CANONICAL_ENVIRONMENT_STATE_v1', 'state schema mismatch');
    assert(state.kernelVersion === 'TEXT_FIRST_STATEFUL_METHODS_MODELS_CANONICAL_STATE_v1', 'kernel version mismatch');
    assert(object(state.axes), 'axes must be object');
    exactSet(Object.keys(state.axes), AXES, 'state axes');
    for (const axis of AXES) {
      const a = state.axes[axis];
      assert(object(a), `${axis}: axis envelope must be object`);
      exactKeys(a, ['status','authorityRef','sourceRef','value'], `${axis} envelope`);
      assert(STATUSES.includes(a.status), `${axis}: unknown status`);
      assert(nonEmptyString(a.authorityRef), `${axis}: authorityRef required`);
      assert(nonEmptyString(a.sourceRef), `${axis}: sourceRef required`);
      if (a.status !== 'DECLARED') {
        assert(a.value === null, `${axis}: nondeclared value must be null`);
        continue;
      }
      assert(a.value !== null, `${axis}: declared value may not be null`);
      switch (axis) {
        case 'SYSTEM': assertValueObject(a.value, ['systemId','boundaryRef'], axis); break;
        case 'SCIENTIFIC_OBJECT': assertValueObject(a.value, ['objectClass','objectId'], axis); break;
        case 'MODEL': assertValueObject(a.value, ['modelId','role'], axis); break;
        case 'METHOD_STAGE':
          assertValueObject(a.value, ['stageId','order','custodyDomain'], axis);
          assert(Number.isInteger(a.value.order) && a.value.order >= 1, 'METHOD_STAGE.order invalid');
          assert(CUSTODY.includes(a.value.custodyDomain), 'METHOD_STAGE.custodyDomain invalid');
          break;
        case 'EVIDENCE': assertValueObject(a.value, ['evidenceObjectId','evidenceStatus','classification','disposition','independenceStatus','contaminationStatus'], axis); break;
        case 'EXECUTION': assertValueObject(a.value, ['executionId','executionStatus','scientificResultStatus'], axis); break;
        case 'CUSTODY':
          assertValueObject(a.value, ['custodyDomain','custodyStatus'], axis);
          assert(CUSTODY.includes(a.value.custodyDomain), 'CUSTODY.custodyDomain invalid');
          break;
        case 'CLAIM_CEILING':
          assertValueObject(a.value, ['ceilingId','scopeRef','prohibitions'], axis);
          assert(Array.isArray(a.value.prohibitions), 'CLAIM_CEILING.prohibitions must be array');
          assert(a.value.prohibitions.every(nonEmptyString), 'CLAIM_CEILING.prohibitions invalid');
          assert(new Set(a.value.prohibitions).size === a.value.prohibitions.length, 'CLAIM_CEILING.prohibitions must be unique');
          break;
        case 'SUPPORT_MODE':
          assertValueObject(a.value, ['mode'], axis);
          assert(SUPPORT.includes(a.value.mode), 'SUPPORT_MODE token invalid');
          break;
        case 'LENS': assertValueObject(a.value, ['lensId'], axis); break;
        case 'VIEW_MODE': assertValueObject(a.value, ['viewModeId'], axis); break;
        case 'ROUTE_HISTORY':
          assert(Array.isArray(a.value), 'ROUTE_HISTORY value must be array');
          assert(a.value.every(nonEmptyString), 'ROUTE_HISTORY entries invalid');
          break;
        case 'CONTENT_VERSION': assertValueObject(a.value, ['contentVersionId','contentFingerprint'], axis); break;
        default: fail(`unexpected axis ${axis}`);
      }
    }
    return true;
  } catch {
    return false;
  }
}

for (const fixture of fixtures.valid) {
  assert(validateState(fixture.state), `valid fixture rejected: ${fixture.id}`);
}

const baseline = fixtures.valid[0].state;
function invalidMutation(id) {
  const s = clone(baseline);
  switch (id) {
    case 'REMOVE_CONTENT_VERSION': delete s.axes.CONTENT_VERSION; break;
    case 'ADD_AUTHORITY_AS_FOURTEENTH_AXIS': s.axes.AUTHORITY = {status:'DECLARED',authorityRef:'X',sourceRef:'X',value:{authorityId:'X'}}; break;
    case 'SET_MODEL_STATUS_DECLARED_WITH_NULL_VALUE': s.axes.MODEL = {...s.axes.MODEL, status:'DECLARED', value:null}; break;
    case 'SET_EVIDENCE_STATUS_UNEVALUABLE_WITH_NON_NULL_VALUE': s.axes.EVIDENCE = {...s.axes.EVIDENCE, status:'UNEVALUABLE'}; break;
    case 'SET_SYSTEM_STATUS_UNKNOWN': s.axes.SYSTEM = {...s.axes.SYSTEM, status:'UNKNOWN'}; break;
    case 'SET_SUPPORT_MODE_TO_OUTPUT_SUCCESS': s.axes.SUPPORT_MODE.value.mode = 'OUTPUT_SUCCESS'; break;
    default: fail(`unknown invalid mutation: ${id}`);
  }
  return s;
}
for (const fixture of fixtures.invalid) {
  assert(fixture.expected === 'REJECT', `invalid fixture expectation changed: ${fixture.id}`);
  assert(!validateState(invalidMutation(fixture.mutation)), `invalid fixture accepted: ${fixture.id}`);
}

// Schema structure is itself fail-closed on the 13 axes.
exactSet(schema.properties.axes.required, AXES, 'JSON schema required axes');
assert(schema.properties.axes.additionalProperties === false, 'JSON schema must reject extra axes');
assert(schema.properties.schema.const === 'METHODS_MODELS_CANONICAL_ENVIRONMENT_STATE_v1', 'JSON schema state id mismatch');
assert(schema.properties.kernelVersion.const === 'TEXT_FIRST_STATEFUL_METHODS_MODELS_CANONICAL_STATE_v1', 'JSON schema kernel id mismatch');

// Terminal candidate cannot claim downstream execution or scientific/public advancement.
assert(receipt.status === 'CANDIDATE_PENDING_EXACT_VERIFICATION', 'receipt status mismatch');
assert(receipt.candidateDisposition === 'PASS_F2_CANONICAL_STATE_KERNEL_v1', 'receipt disposition mismatch');
assert(receipt.scientificClaimUpgrade === false && receipt.publicMutation === false, 'terminal receipt authority inflation');
assert(receipt.f3ConstructionAuthorityBeforeVerification === false, 'F3 authority exists before F2 verification');
assert(receipt.f3ConstructionAuthorityAfterEffectivePass === true, 'F3 post-pass authority missing');
assert(receipt.f3ExecutionAfterEffectivePass === 'NOT_STARTED_UNTIL_SEPARATE_CONTINUATION', 'F3 execution boundary mismatch');
assert(receipt.f4ThroughF12Authority === false, 'F4-F12 authority inflated');

console.log(JSON.stringify({
  result: 'PASS_F2_CANONICAL_STATE_KERNEL_v1',
  f1Head: F1_HEAD,
  frozenMain: FROZEN_MAIN,
  axisCount: AXES.length,
  validFixtures: fixtures.valid.length,
  rejectedInvalidFixtures: fixtures.invalid.length,
  changedPaths: changed,
  f3Execution: 'NOT_STARTED'
}, null, 2));
