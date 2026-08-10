#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../..');
const DIR = path.join(ROOT, '.github/ai-router/project-continuation');
const args = new Set(process.argv.slice(2));
const requiredFiles = [
  'README.md',
  'protocol.v1.json',
  'strategy-index.v1.json',
  'h-earth.continuation.v1.json',
  'laws-contextual-3d.continuation.v1.json',
  'instrumentation.continuation.v1.json'
];
const laneFiles = [
  'h-earth.continuation.v1.json',
  'laws-contextual-3d.continuation.v1.json',
  'instrumentation.continuation.v1.json'
];

function stable(value) {
  if (Array.isArray(value)) return value.map(stable);
  if (value && typeof value === 'object') return Object.fromEntries(Object.keys(value).sort().map(k => [k, stable(value[k])]));
  return value;
}
function digest(value) {
  return crypto.createHash('sha256').update(JSON.stringify(stable(value))).digest('hex');
}
function fail(errorCode, field = null) {
  const receipt = {schema:'PROJECT_CONTINUATION_STATIC_VERIFICATION_RECEIPT_v1', result:'FAIL_CLOSED', errorCode, field, authorityCreated:false};
  process.stdout.write(`${JSON.stringify(receipt, null, 2)}\n`);
  process.exit(1);
}
function readJson(file) {
  try { return JSON.parse(fs.readFileSync(file, 'utf8')); } catch { fail('MANIFEST_SCHEMA_OR_LANE_MISMATCH', path.relative(ROOT, file)); }
}
function walk(value, visit, pointer = '$') {
  visit(value, pointer);
  if (Array.isArray(value)) value.forEach((v, i) => walk(v, visit, `${pointer}[${i}]`));
  else if (value && typeof value === 'object') for (const [k, v] of Object.entries(value)) walk(v, visit, `${pointer}.${k}`);
}

if (!args.has('--verify-static') || args.size !== 1) fail('STATIC_VERIFICATION_FAIL', 'EXPECTED_EXACT_--verify-static_ARGUMENT');
for (const name of requiredFiles) if (!fs.existsSync(path.join(DIR, name))) fail('EXACT_PATH_SET_MISMATCH', name);

const protocol = readJson(path.join(DIR, 'protocol.v1.json'));
const index = readJson(path.join(DIR, 'strategy-index.v1.json'));
if (protocol.schema !== 'PROJECT_CONTINUATION_PROTOCOL_v1' || protocol.authorityEffect !== 'NONE') fail('MANIFEST_SCHEMA_OR_LANE_MISMATCH', 'protocol');
if (protocol.continuityLaw !== 'CONVERSATION_MEMORY_OPTIONAL_REPOSITORY_CONTINUITY_MANDATORY') fail('MISSING_LIVE_REVALIDATION_RULE', 'continuityLaw');
if (protocol.roomDependencyLaw !== 'OTHER_ROOMS_ARE_NOT_CONTINUITY_DEPENDENCIES') fail('MISSING_LIVE_REVALIDATION_RULE', 'roomDependencyLaw');
if (protocol.staleStatePolicy?.liveRevalidationRequiredAtEveryColdStart !== true || protocol.staleStatePolicy?.manifestMayHardcodeNextMutation !== false) fail('MISSING_LIVE_REVALIDATION_RULE', 'staleStatePolicy');
if (Object.values(protocol.authorityBoundary ?? {}).some(v => v !== false)) fail('STALE_NEXT_ACTION_AUTHORITY_LEAK', 'protocol.authorityBoundary');

if (index.schema !== 'PROJECT_CONTINUATION_STRATEGY_INDEX_v1' || index.authorityEffect !== 'NONE' || index.liveRevalidationRequired !== true || index.otherRoomsAreContinuityDependencies !== false) fail('MANIFEST_SCHEMA_OR_LANE_MISMATCH', 'strategy-index');
if (!Array.isArray(index.lanes) || index.lanes.length !== 3) fail('MANIFEST_SCHEMA_OR_LANE_MISMATCH', 'strategy-index.lanes');
const expected = new Map([
  ['S26 Ultra', ['H_EARTH_PRODUCT', '.github/ai-router/project-continuation/h-earth.continuation.v1.json']],
  ['A19 tablet', ['INSTRUMENTATION_PLATFORM', '.github/ai-router/project-continuation/instrumentation.continuation.v1.json']],
  ['S25 Ultra', ['LAWS_CONTEXTUAL_3D', '.github/ai-router/project-continuation/laws-contextual-3d.continuation.v1.json']]
]);
for (const lane of index.lanes) {
  const e = expected.get(lane.device);
  if (!e || lane.laneId !== e[0] || lane.manifest !== e[1]) fail('MANIFEST_SCHEMA_OR_LANE_MISMATCH', `strategy-index:${lane.device}`);
}
if (new Set(index.lanes.map(x => x.device)).size !== 3 || new Set(index.lanes.map(x => x.laneId)).size !== 3) fail('MANIFEST_SCHEMA_OR_LANE_MISMATCH', 'strategy-index.uniqueness');

const manifests = laneFiles.map(name => readJson(path.join(DIR, name)));
for (const manifest of manifests) {
  if (manifest.schema !== 'PROJECT_CONTINUATION_LANE_MANIFEST_v1' || manifest.authorityEffect !== 'NONE') fail('MANIFEST_SCHEMA_OR_LANE_MISMATCH', manifest.laneId ?? 'unknown');
  if (manifest.frontierDerivation?.liveRevalidationRequired !== true || manifest.frontierDerivation?.staticFrontierStored !== false) fail('MISSING_LIVE_REVALIDATION_RULE', manifest.laneId);
  if (!Array.isArray(manifest.frontierDerivation?.orderedMethod) || !manifest.frontierDerivation.orderedMethod.some(x => String(x).includes('STOP_IF_NO_UNIQUE_PROVEN_FRONTIER_EXISTS'))) fail('MISSING_LIVE_REVALIDATION_RULE', `${manifest.laneId}.frontierDerivation`);
  if (manifest.actionAuthorityAndConstraints?.manifestCreatesMutationAuthority !== false || manifest.actionAuthorityAndConstraints?.manifestCreatesMergeAuthority !== false) fail('STALE_NEXT_ACTION_AUTHORITY_LEAK', `${manifest.laneId}.authority`);
  if (manifest.writeBackRequirements?.privateRoomSummaryIsSufficientWriteBack !== false) fail('MANIFEST_SCHEMA_OR_LANE_MISMATCH', `${manifest.laneId}.writeBack`);
  walk(manifest, (value, pointer) => {
    const key = pointer.split('.').at(-1)?.toLowerCase();
    if (['nextaction','nextoperation','nextgeneration','frozenfrontier','staticnextaction'].includes(key)) fail('STALE_NEXT_ACTION_AUTHORITY_LEAK', `${manifest.laneId}:${pointer}`);
    if (typeof value === 'string' && /lost\s+laws/i.test(value)) fail('MANIFEST_SCHEMA_OR_LANE_MISMATCH', `${manifest.laneId}:LOST_LAWS_TYPO`);
  });
}

const laws = manifests.find(x => x.laneId === 'LAWS_CONTEXTUAL_3D');
if (!laws || !String(laws.projectIdentity?.label ?? '').includes('Laws chamber')) fail('MANIFEST_SCHEMA_OR_LANE_MISMATCH', 'LAWS_CHAMBER_LABEL');

const agents = fs.readFileSync(path.join(ROOT, 'AGENTS.md'), 'utf8');
const root = readJson(path.join(ROOT, 'AI_ENTRYPOINT.json'));
if (!agents.includes('.github/ai-router/project-continuation/strategy-index.v1.json') || !agents.includes('Other rooms are not continuity dependencies')) fail('ROOT_DISCOVERY_BINDING_MISSING', 'AGENTS.md');
const pc = root.projectContinuation;
if (!pc || pc.protocol !== '.github/ai-router/project-continuation/protocol.v1.json' || pc.strategyIndex !== '.github/ai-router/project-continuation/strategy-index.v1.json') fail('ROOT_DISCOVERY_BINDING_MISSING', 'AI_ENTRYPOINT.json');
if (pc.authorityEffect !== 'NONE' || pc.liveRevalidationRequired !== true || pc.otherRoomsAreContinuityDependencies !== false || pc.manifestMayAuthorizeMutation !== false) fail('STALE_NEXT_ACTION_AUTHORITY_LEAK', 'AI_ENTRYPOINT.json.projectContinuation');

const receipt = {
  schema: 'PROJECT_CONTINUATION_STATIC_VERIFICATION_RECEIPT_v1',
  result: 'PASS',
  errorCode: null,
  laneCount: 3,
  exactDeviceMappingsVerified: true,
  lawsChamberNamingVerified: true,
  liveRevalidationRequired: true,
  staleNextActionAuthorityObserved: false,
  otherRoomsContinuityDependencies: false,
  rootDiscoveryBindingVerified: true,
  authorityCreated: false,
  manifestDigest: digest({protocol, index, manifests})
};
process.stdout.write(`${JSON.stringify(receipt, null, 2)}\n`);
