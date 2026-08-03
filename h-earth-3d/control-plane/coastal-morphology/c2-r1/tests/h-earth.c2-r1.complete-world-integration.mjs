import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import zlib from 'node:zlib';

const args = new Set(process.argv.slice(2));
if (!args.has('--materialize')) throw new Error('MATERIALIZE_MODE_REQUIRED');
const repo = process.env.GITHUB_WORKSPACE;
const out = path.join(process.env.RUNNER_TEMP, 'material-only');
const START = '4f0491f00fae794ecdefbae36f4ee86c8a1bd21a';
const BRANCH = process.env.CANDIDATE_BRANCH;
const ROLLBACK = 'rollback/h-earth-c2-r1-material-only-binding-start-001';
const OP = 'H_EARTH_C2_R1_MATERIAL_ONLY_BINDING_RECOVERY_001';
const PACKET = 'H_EARTH_C2_R1_MATERIAL_ONLY_BINDING_IMPLEMENTATION_APPLICATION_PACKET_v1';
const SCHEMA = 'H_EARTH_C2_R1_COMPLETE_WORLD_EXACT_BINDING_CACHE_v2';
const ID = 'H_EARTH_C2_R1_COMPLETE_WORLD_PACKAGE_773DAE4E';
const DIGEST = 'fnv1a32:773dae4e';
const JSON_SHA = 'sha256:2262fe92c43f8980113bc7482253bbbb785a96679b15156541165bc46713e7b5';
const GZIP_SHA = 'sha256:8a22a0edec87ef25c763722b8be55fa457b7cfcddd1cdc21ffba1abfbd35709b';
const CACHE_ARCHIVE_SHA = 'sha256:5a2fb743de644c4c12b3c8b7ed79394ca60602848f2011bb29f46923d193cf04';
const ARTIFACT_ID = 8827148247;
const ARTIFACT_SHA = 'sha256:8162da59a38abe5381bd0e16381c9a772d72c84a5cdc912bc9700a2e9e992690';
const sha = bytes => `sha256:${crypto.createHash('sha256').update(bytes).digest('hex')}`;
const read = name => fs.readFileSync(path.join(out, name));
const receipt = JSON.parse(read('material-only-static-receipt.json'));
const cacheBytes = read('complete-world-material-only-cache-v2.json');
const gzipBytes = read('complete-world-material-only-cache-v2.json.gz');
const cache = JSON.parse(cacheBytes);
const part1 = read('cache-carrier-part-1.txt').toString('utf8');
const part2 = read('cache-carrier-part-2.txt').toString('utf8');
const fail = (code, value) => { if (!value) throw new Error(code); };
fail('CACHE_JSON_DIGEST_MISMATCH', sha(cacheBytes) === JSON_SHA);
fail('CACHE_GZIP_DIGEST_MISMATCH', sha(gzipBytes) === GZIP_SHA);
fail('CACHE_SCHEMA_MISMATCH', cache.cacheType === SCHEMA && receipt.cacheSchema === SCHEMA);
fail('PACKAGE_IDENTITY_MISMATCH', cache.completeWorldPackageIdentity === ID && receipt.newPackageIdentity === ID);
fail('PACKAGE_DIGEST_MISMATCH', cache.completeWorldPackageContentDigest === DIGEST && receipt.newPackageDigest === DIGEST);
fail('CACHE_CARRIER_MISMATCH', Buffer.from(part1 + part2, 'base64').equals(gzipBytes));
fail('CACHE_GZIP_JSON_MISMATCH', zlib.gunzipSync(gzipBytes).equals(cacheBytes));
fail('MATERIAL_ONLY_INVARIANT_FAILED', receipt.canonicalPositionsPreserved === true && receipt.canonicalNormalsPreserved === true && receipt.terrainPositionMutationCount === 0 && receipt.terrainNormalMutationCount === 0 && receipt.inlandWaterMembershipViolationCount === 0);
fail('BINDING_COUNTS_MISMATCH', receipt.boundTerrainVertexCount === 10419 && receipt.boundShorelineVertexCount === 154);

const writeJson = (relative, value) => {
  const target = path.join(repo, relative);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, `${JSON.stringify(value, null, 2)}\n`);
};
const replaceOnce = (text, oldValue, newValue, label) => {
  const count = text.split(oldValue).length - 1;
  if (count !== 1) throw new Error(`REPLACE_COUNT_INVALID:${label}:${count}`);
  return text.replace(oldValue, newValue);
};
const replaceAllRequired = (text, oldValue, newValue, label) => {
  const count = text.split(oldValue).length - 1;
  if (count < 1) throw new Error(`REPLACE_COUNT_INVALID:${label}:${count}`);
  return text.split(oldValue).join(newValue);
};

const identity = {
  manifestType: 'H_EARTH_C2_R1_MATERIAL_ONLY_BINDING_IDENTITY_v1',
  operationId: OP,
  controllingPacket: PACKET,
  startingHead: START,
  resultingHeadBinding: 'EXACT_COMMIT_CONTAINING_THIS_RECORD',
  candidateBranch: BRANCH,
  rollback: { branch: ROLLBACK, head: START },
  cacheSchema: SCHEMA,
  cacheJsonSha256: JSON_SHA,
  cacheGzipSha256: GZIP_SHA,
  cacheArchiveSha256: CACHE_ARCHIVE_SHA,
  packageIdentity: ID,
  packageContentDigest: DIGEST,
  boundTerrainVertexCount: 10419,
  boundShorelineVertexCount: 154,
  canonicalPositionsPreserved: true,
  canonicalNormalsPreserved: true,
  inlandWaterMembershipViolationCount: 0,
  publicDefaultMutation: false,
  mergeAuthorized: false,
  role1SelfCertification: false,
  role3IndependentVerificationRequired: true
};
writeJson('h-earth-3d/control-plane/coastal-morphology/c2-r1/review/complete-world/identity.json', identity);

writeJson('h-earth-3d/control-plane/coastal-morphology/c2-r1/evidence/complete-world/h-earth.c2-r1.complete-world-source-custody.json', {
  recordType: 'H_EARTH_C2_R1_MATERIAL_ONLY_BINDING_SOURCE_CUSTODY_v1',
  operationId: OP, startingHead: START, resultingHeadBinding: identity.resultingHeadBinding,
  rollback: identity.rollback, exactPathCount: 12, allOtherPathsProtected: true,
  cacheSchema: SCHEMA, cacheJsonSha256: JSON_SHA, cacheGzipSha256: GZIP_SHA,
  cacheArchiveSha256: CACHE_ARCHIVE_SHA, newPackageIdentity: ID, newPackageDigest: DIGEST,
  canonicalPositionsByteIdentical: true, canonicalNormalsByteIdentical: true,
  indicesPrimitiveSpansDrawRangesPreserved: true,
  terrainPositionMutationCount: 0, terrainNormalMutationCount: 0,
  inlandWaterMembershipViolationCount: 0, canonicalWorldRebuild: false,
  coastalComponentRebuild: false, closedCheckpointReopening: false,
  publicDefaultMutation: false, mainMutation: false
});
const common = {
  operationId: OP, controllingPacket: PACKET, startingHead: START,
  resultingHeadBinding: identity.resultingHeadBinding, candidateBranch: BRANCH,
  rollbackBranch: ROLLBACK, rollbackHead: START, cacheSchema: SCHEMA,
  cacheJsonSha256: JSON_SHA, cacheGzipSha256: GZIP_SHA, cacheArchiveSha256: CACHE_ARCHIVE_SHA,
  generationArtifactId: ARTIFACT_ID, generationArtifactDigest: ARTIFACT_SHA,
  completeWorldPackageIdentity: ID, completeWorldPackageContentDigest: DIGEST,
  boundTerrainVertexCount: 10419, boundShorelineVertexCount: 154,
  canonicalPositionsPreserved: true, canonicalNormalsPreserved: true,
  terrainPositionMutationCount: 0, terrainNormalMutationCount: 0,
  inlandWaterMembershipViolationCount: 0,
  x0ZMinus96TerrainY: receipt.x0ZMinus96TerrainY,
  x0ZMinus96CameraY: receipt.x0ZMinus96CameraY,
  x0ZMinus96CameraClearance: receipt.x0ZMinus96CameraClearance,
  initialTurquoiseSampleRequiredResult: '0_OF_9', role1SelfCertification: false,
  status: 'ROLE_1_IMPLEMENTATION_READY_FOR_EXACT_HEAD_WORKFLOWS'
};
writeJson('h-earth-3d/control-plane/coastal-morphology/c2-r1/evidence/complete-world/h-earth.c2-r1.complete-world-operation-ledger.json', {
  ledgerType: 'H_EARTH_C2_R1_MATERIAL_ONLY_BINDING_OPERATION_LEDGER_v1', ...common,
  exactBindingCacheCarrier: { partIndex: 1, partCount: 2, encoding: 'BASE64_GZIP_JSON', value: part1 }
});
writeJson('h-earth-3d/control-plane/coastal-morphology/c2-r1/evidence/complete-world/h-earth.c2-r1.complete-world-role3-entry.json', {
  entryType: 'H_EARTH_C2_R1_MATERIAL_ONLY_BINDING_ROLE_3_ENTRY_v1', ...common,
  nextRole: 'ROLE_3_EXECUTION_VERIFICATION_AND_RECEIPT_CUSTODY',
  exactBindingCacheCarrier: { partIndex: 2, partCount: 2, encoding: 'BASE64_GZIP_JSON', value: part2 }
});

const updateText = (relative, transform) => {
  const target = path.join(repo, relative);
  fs.writeFileSync(target, transform(fs.readFileSync(target, 'utf8')));
};
updateText('h-earth-3d/control-plane/coastal-morphology/c2-r1/review/complete-world/complete-world.js', text => {
  text = replaceOnce(text, 'sha256:0c01a65ce7a8304874fc9ec43ce1972a5f0e828b2ceb369c3d4faf603f1ff0d1', JSON_SHA, 'complete-world-cache');
  text = replaceOnce(text, "operationId: 'H_EARTH_C2_R1_COMPLETE_WORLD_INTEGRATION_001'", `operationId: '${OP}'`, 'complete-world-ready');
  return replaceOnce(text, "operationId: 'H_EARTH_C2_R1_COMPLETE_WORLD_STARTUP_PERFORMANCE_CORRECTION_001'", `operationId: '${OP}'`, 'complete-world-failure');
});
updateText('showroom/globe/h-earth/functional-landscape/public-live-gpu-integration.run8e-r3e.js', text => {
  text = replaceAllRequired(text, 'H_EARTH_C2_R1_INTEGRATED_ENVIRONMENT_COHERENCE_CORRECTION_001', OP, 'public-operation');
  text = replaceAllRequired(text, 'sha256:0c01a65ce7a8304874fc9ec43ce1972a5f0e828b2ceb369c3d4faf603f1ff0d1', JSON_SHA, 'public-cache');
  text = replaceAllRequired(text, 'H_EARTH_C2_R1_COMPLETE_WORLD_PACKAGE_218F37AE', ID, 'public-id');
  text = replaceAllRequired(text, 'fnv1a32:218f37ae', DIGEST, 'public-digest');
  return replaceAllRequired(text, 'selectionReceipt.boundShorelineVertexCount !== 299', 'selectionReceipt.boundShorelineVertexCount !== 154', 'public-count');
});
updateText('showroom/globe/h-earth/render/live-render-package.run8e-r2.canonical.js', text => {
  text = replaceOnce(text, 'packageRecord?.completeWorldBinding?.counters?.boundShorelineVertexCount !== 299', 'packageRecord?.completeWorldBinding?.counters?.boundShorelineVertexCount !== 154', 'canonical-count');
  const anchor = `  if (!packageRecord?.buffers || !Array.isArray(packageRecord?.drawRanges)) {\n    issues.push('R2_RUNTIME_OVERRIDE_RENDER_DATA_MISSING');\n  }`;
  const addition = `${anchor}\n  if (packageRecord?.completeWorldBinding?.materialOnlyBinding !== true) {\n    issues.push('R2_RUNTIME_OVERRIDE_NOT_MATERIAL_ONLY');\n  }\n  if (packageRecord?.completeWorldBinding?.exactBindingCacheSchema !== '${SCHEMA}') {\n    issues.push('R2_RUNTIME_OVERRIDE_CACHE_SCHEMA_MISMATCH');\n  }\n  if (packageRecord?.completeWorldBinding?.counters?.terrainPositionMutationCount !== 0 ||\n      packageRecord?.completeWorldBinding?.counters?.terrainNormalMutationCount !== 0 ||\n      packageRecord?.completeWorldBinding?.counters?.inlandWaterMembershipViolationCount !== 0) {\n    issues.push('R2_RUNTIME_OVERRIDE_MATERIAL_ONLY_INVARIANT_FAILED');\n  }`;
  return replaceOnce(text, anchor, addition, 'canonical-assertions');
});
console.log(JSON.stringify({ operationId: OP, status: 'MATERIALIZED', packageIdentity: ID, packageDigest: DIGEST, changedWorkingPaths: 7 }, null, 2));
