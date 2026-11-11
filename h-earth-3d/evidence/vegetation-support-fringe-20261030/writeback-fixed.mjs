#!/usr/bin/env node
// H-Earth Gen3010 only: deterministic three-file candidate materialization.
// The Gen3021 staged artifact is the byte-identity authority. This fixed
// generator refuses writeback if a fresh source-authentic compilation differs.
// Execution/commit authorization is external to this script; it never pushes.
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';
import {spawnSync} from 'node:child_process';
import {gunzipSync} from 'node:zlib';

const repo = fileURLToPath(new URL('../../../', import.meta.url));
const sourceDir = fileURLToPath(new URL('.', import.meta.url));
const targetRoot = 'showroom/globe/h-earth/render/';
const compiler = path.join(sourceDir, 'compile.mjs');
const sha256 = bytes => createHash('sha256').update(bytes).digest('hex');
const gitBlobSha = bytes => createHash('sha1')
 .update(Buffer.from(`blob ${bytes.length}\0`)).update(bytes).digest('hex');
const must = (condition, code) => {if (!condition) throw new Error(code);};
const expected = Object.freeze({
 compilerBlob: 'e90843a51dcb34fda360c5b8c29bfd1495d53802',
 originalGzip: '4a2ff2a135984d67d68d3df7c3212236894c75b66826f256a60130c87b73e800',
 originalManifest: '9d452a0906094e6e5ed828753e547ef24269afa173896453637b77832c6c3edf',
 originalLoaderBlob: '02f2fe39ef6c1f8e1ba1a51398ca9fa0512e19f4',
 stagedGzip: '03dc3b07e53d8425d4a3e29e32d6511bdc4cddcb30ea5a2e27ca78c8e5cc2851',
 stagedManifest: 'b89713280767ad083d4b2deadafebc7f296300fd84c6677f4e5d7f14a2010b9c',
 stagedLoader: '97e60540f39bdf780a5bad477f6c38ce0cf0e3ab56b308a8708d2e1dd49f0cf5',
 stagedRaw: '351c8a09bce94af2c022303a4b86f303e991a1db291e393b780b5ae5773f9728',
 newRoots: 2879698,
 addedRoots: 20960,
 censusDigest: '64e435129dc5ca0b8bd38409339ec8393cfa8752d8aec6b98e6b7b5558dc3bf7',
 packedLimit: 46607296,
 packedExpected: 46075168
});
const bindings = [
 ['precomputed-grass.v1.bin.gz', `${targetRoot}assets/precomputed-grass.v1.bin.gz`, 'originalGzip', 'stagedGzip'],
 ['precomputed-grass.v1.json', `${targetRoot}assets/precomputed-grass.v1.json`, 'originalManifest', 'stagedManifest'],
 ['precomputed-grass.v1.js', `${targetRoot}precomputed-grass.v1.js`, 'originalLoaderBlob', 'stagedLoader']
];

function main() {
 const args = process.argv.slice(2);
 must(args.length === 2 && args[0] === '--receipt' && path.isAbsolute(args[1]),
  'FIXED_RECEIPT_ARGUMENT_REQUIRED');
 const receiptPath = args[1];
 must(gitBlobSha(fs.readFileSync(compiler)) === expected.compilerBlob,
  'GEN3010_COMPILER_BLOB_DRIFT');
 for (const [, target, priorKey] of bindings) {
  const bytes = fs.readFileSync(path.join(repo, target));
  const digest = priorKey === 'originalLoaderBlob' ? gitBlobSha(bytes) : sha256(bytes);
  must(digest === expected[priorKey], `GEN3010_ORIGINAL_ASSET_DRIFT:${target}`);
 }
 const staging = fs.mkdtempSync(path.join(os.tmpdir(), 'gen3010-asset-writeback-'));
 let completed = false;
 try {
  const child = spawnSync(process.execPath, [compiler], {
   cwd: repo,
   env: {...process.env, H_EARTH_GEN3010_STAGING_DIR: staging},
   encoding: 'utf8', maxBuffer: 4 * 1024 * 1024
  });
  must(!child.error && child.status === 0,
   `GEN3010_COMPILER_FAILED:${child.status ?? 'NO_STATUS'}:${String(child.stderr || child.error).slice(-1200)}`);
  const sources = bindings.map(([staged, target, , updated]) => {
   const bytes = fs.readFileSync(path.join(staging, staged));
   must(sha256(bytes) === expected[updated], `STAGED_BYTE_IDENTITY_DRIFT:${staged}`);
   return {bytes, target};
  });
  const manifest = JSON.parse(sources[1].bytes.toString('utf8'));
  const compilerReceipt = JSON.parse(fs.readFileSync(path.join(staging,'compiler-report.json'), 'utf8'));
  must(manifest.rootCount === expected.newRoots && compilerReceipt.newSavedRoots === expected.newRoots,
   'ROOT_COUNT_DRIFT');
  must(compilerReceipt.originalSavedRoots === 2858738 && compilerReceipt.newRoots === expected.addedRoots,
   'ADD_ONLY_ROOT_COUNT_DRIFT');
  must(compilerReceipt.sourceCensusDigest === expected.censusDigest,
   'SOURCE_CENSUS_HASH_DRIFT');
  must(compilerReceipt.originalRecordsByteIdentical === true &&
   compilerReceipt.habitatAtlasByteIdentical === true, 'ORIGINAL_RECORD_ATLAS_NOT_PRESERVED');
  must(compilerReceipt.packedBytes === expected.packedExpected &&
   compilerReceipt.packedBytes <= expected.packedLimit &&
   compilerReceipt.maximumCombinedTileRoots <= 1600,
   'GPU_ALLOCATION_BUDGET_EXCEEDED');
  must(manifest.compressedSha256 === expected.stagedGzip &&
   manifest.rawSha256 === expected.stagedRaw, 'MANIFEST_BINARY_IDENTITY_DRIFT');
  must(sha256(gunzipSync(sources[0].bytes)) === expected.stagedRaw,
   'GZIP_ROUNDTRIP_DRIFT');
  must(sources[2].bytes.toString('utf8').includes(expected.stagedManifest),
   'LOADER_MANIFEST_BINDING_DRIFT');
  // All pre-write checks passed. The registered dispatcher, not this script,
  // validates the exact changed-path set and performs the single atomic commit.
  for (const {bytes, target} of sources) fs.writeFileSync(path.join(repo,target), bytes);
  const receipt = {
   schema: 'H_EARTH_GEN3010_THREE_FILE_WRITEBACK_READY_v1',
   result: 'EXACT_STAGE_IDENTITIES_REPRODUCED_AND_FILES_STAGED_FOR_DISPATCHER',
   operationId: 'H_EARTH_NATURAL_GRASS_SUPPORT_FRINGE_20261030_001',
   sourceCompilerBlob: expected.compilerBlob,
   stagedArtifactId: 13047972959,
   frozenStagedHashes: {gzip: expected.stagedGzip, manifest: expected.stagedManifest, loader: expected.stagedLoader},
   originalSavedRoots: 2858738, addedRoots: expected.addedRoots, newSavedRoots: expected.newRoots,
   sourceCensusDigest: expected.censusDigest,
   changedPaths: sources.map(x=>x.target),
   binaryVerifiedBeforeWriteback: true, noMergeOrDeploy: true,
   gpuEvidence: 'NOT_RUN', ownerAcceptance: 'NOT_CLAIMED'
  };
  fs.writeFileSync(receiptPath, JSON.stringify(receipt,null,2)+'\n');
  completed = true;
  console.log('GEN3010_FIXED_WRITEBACK_STAGED_FOR_REGISTERED_DISPATCHER',JSON.stringify(receipt));
 } finally {
  fs.rmSync(staging,{recursive:true,force:true});
  if(!completed)console.error('GEN3010_FIXED_WRITEBACK_FAIL_CLOSED_NO_COMMIT');
 }
}
try {main();} catch (error) {console.error('GEN3010_FIXED_WRITEBACK_STOP',error.message);process.exitCode=1;}
