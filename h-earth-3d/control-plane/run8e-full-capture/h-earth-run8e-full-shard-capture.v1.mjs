#!/usr/bin/env node
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import cp from 'node:child_process';
import zlib from 'node:zlib';
import crypto from 'node:crypto';
import { pathToFileURL } from 'node:url';

const EXACT_CANDIDATE = 'aabc3b8866836b82408ce639b16d25f6daf7ec8e';
const EXACT_MANIFEST_SHA256 = '226fdb529f27e4f6f6dfe37b88effbdcbe0d9ff0f9e3c8e1723bfcf6db2e7c92';
const OPERATION_ID = 'H_EARTH_RUN8E_FULL_240_FRAME_CAPTURE_20260916_001';
const RECEIPT_SCHEMA = 'H_EARTH_RUN8E_FULL_SHARD_CAPTURE_RECEIPT_v1';
const SHARDS = Object.freeze({
  S01: Object.freeze({ start: 720, end: 749 }),
  S02: Object.freeze({ start: 750, end: 779 }),
  S03: Object.freeze({ start: 780, end: 809 }),
  S04: Object.freeze({ start: 810, end: 839 }),
  S05: Object.freeze({ start: 840, end: 869 }),
  S06: Object.freeze({ start: 870, end: 899 }),
  S07: Object.freeze({ start: 900, end: 929 }),
  S08: Object.freeze({ start: 930, end: 959 })
});

function parseArgs(argv) {
  const out = {};
  for (let i = 0; i < argv.length; i += 2) {
    const key = argv[i];
    const value = argv[i + 1];
    if (!key?.startsWith('--') || value == null) throw new Error(`ARGUMENT_INVALID:${key ?? 'EOF'}`);
    out[key.slice(2)] = value;
  }
  return out;
}

function run(command, args, cwd, allowFailure = false) {
  const result = cp.spawnSync(command, args, {
    cwd,
    env: process.env,
    encoding: 'utf8',
    maxBuffer: 64 * 1024 * 1024
  });
  if (!allowFailure && (result.status !== 0 || result.error)) {
    throw new Error(`COMMAND_FAILED:${command} ${args.join(' ')}:${result.stderr || result.error?.message || 'UNKNOWN'}`);
  }
  return result;
}

function sha256(bytes) {
  return crypto.createHash('sha256').update(bytes).digest('hex');
}

let crcTable;
function crc32(buffer) {
  if (!crcTable) {
    crcTable = new Uint32Array(256);
    for (let n = 0; n < 256; n++) {
      let c = n;
      for (let k = 0; k < 8; k++) c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1);
      crcTable[n] = c >>> 0;
    }
  }
  let c = 0xffffffff;
  for (const byte of buffer) c = crcTable[(c ^ byte) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

function pngChunk(type, data) {
  const typeBytes = Buffer.from(type, 'ascii');
  const length = Buffer.alloc(4);
  length.writeUInt32BE(data.length, 0);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(Buffer.concat([typeBytes, data])), 0);
  return Buffer.concat([length, typeBytes, data, crc]);
}

function encodePng(width, height, rgba) {
  const stride = width * 4;
  const raw = Buffer.alloc((stride + 1) * height);
  const pixels = Buffer.from(rgba.buffer, rgba.byteOffset, rgba.byteLength);
  for (let y = 0; y < height; y++) {
    const dst = y * (stride + 1);
    raw[dst] = 0;
    pixels.copy(raw, dst + 1, y * stride, (y + 1) * stride);
  }
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8;
  ihdr[9] = 6;
  return Buffer.concat([
    Buffer.from([137,80,78,71,13,10,26,10]),
    pngChunk('IHDR', ihdr),
    pngChunk('IDAT', zlib.deflateSync(raw, { level: 9 })),
    pngChunk('IEND', Buffer.alloc(0))
  ]);
}

function stable(value) {
  if (Array.isArray(value)) return value.map(stable);
  if (value && typeof value === 'object' && !Buffer.isBuffer(value) && !ArrayBuffer.isView(value)) {
    return Object.fromEntries(Object.keys(value).sort().map(key => [key, stable(value[key])]));
  }
  return value;
}

function stableJson(value) {
  return JSON.stringify(stable(value));
}

function writeReceipt(outputPath, receipt) {
  fs.mkdirSync(path.dirname(path.resolve(outputPath)), { recursive: true });
  fs.writeFileSync(path.resolve(outputPath), `${JSON.stringify(stable(receipt), null, 2)}\n`);
}

function repoStatus(root) {
  return run('git', ['status', '--porcelain=v1', '--untracked-files=all'], root, true).stdout.trim();
}

function framesForShard(shardId) {
  const shard = SHARDS[shardId];
  if (!shard) throw new Error(`SHARD_NOT_AUTHORIZED:${shardId ?? 'NULL'}`);
  return Array.from({ length: shard.end - shard.start + 1 }, (_, index) => shard.start + index);
}

function selfTest() {
  const ids = Object.keys(SHARDS);
  if (ids.length !== 8 || ids.join(',') !== 'S01,S02,S03,S04,S05,S06,S07,S08') throw new Error('SHARD_ID_SET_INVALID');
  const flattened = ids.flatMap(framesForShard);
  if (flattened.length !== 240) throw new Error(`FRAME_CARDINALITY_INVALID:${flattened.length}`);
  if (new Set(flattened).size !== 240) throw new Error('FRAME_DUPLICATION_DETECTED');
  for (let index = 0; index < 240; index++) {
    if (flattened[index] !== 720 + index) throw new Error(`FRAME_PARTITION_GAP_OR_REORDER:${index}:${flattened[index]}`);
  }
  for (const id of ids) if (framesForShard(id).length !== 30) throw new Error(`SHARD_CARDINALITY_INVALID:${id}`);
  if (!/^[0-9a-f]{40}$/.test(EXACT_CANDIDATE)) throw new Error('CANDIDATE_CONSTANT_INVALID');
  if (!/^[0-9a-f]{64}$/.test(EXACT_MANIFEST_SHA256)) throw new Error('MANIFEST_CONSTANT_INVALID');
  process.stdout.write('RUN8E_FULL_SHARD_CAPTURE_SELF_TEST_PASS shards=8 frames=240 domain=720..959\n');
}

function materializeCandidate(toolRoot, tempRoot, candidateHead) {
  const subjectRoot = path.join(tempRoot, 'subject');
  fs.mkdirSync(subjectRoot, { recursive: true });
  const origin = run('git', ['config', '--get', 'remote.origin.url'], toolRoot).stdout.trim();
  if (!origin) throw new Error('ORIGIN_URL_UNAVAILABLE');
  run('git', ['init', '.'], subjectRoot);
  run('git', ['remote', 'add', 'origin', origin], subjectRoot);
  run('git', ['-c', 'protocol.version=2', 'fetch', '--no-tags', '--depth=1', '--filter=blob:none', 'origin', candidateHead], subjectRoot);
  run('git', ['sparse-checkout', 'init', '--cone', '--sparse-index'], subjectRoot);
  run('git', [
    'sparse-checkout', 'set',
    'tools/h-earth-run8e-native-camera-feasibility',
    'showroom/globe/h-earth',
    'h-earth-3d'
  ], subjectRoot);
  run('git', ['checkout', '--detach', 'FETCH_HEAD'], subjectRoot);
  const actual = run('git', ['rev-parse', 'HEAD^{commit}'], subjectRoot).stdout.trim();
  if (actual !== candidateHead) throw new Error(`CANDIDATE_HEAD_MISMATCH:${candidateHead}:${actual}`);
  if (repoStatus(subjectRoot) !== '') throw new Error('SUBJECT_WORKTREE_NOT_CLEAN_BEFORE_RENDER');
  return subjectRoot;
}

function validateRendered(rendered, masterFrame) {
  if (rendered.inheritedManifestSha256 !== EXACT_MANIFEST_SHA256) {
    throw new Error(`MANIFEST_IDENTITY_DRIFT:${rendered.inheritedManifestSha256}`);
  }
  if (rendered.masterFrame !== masterFrame) throw new Error(`MASTER_FRAME_IDENTITY_MISMATCH:${masterFrame}:${rendered.masterFrame}`);
  if (rendered.alphaClosed !== true) throw new Error(`ALPHA_NOT_CLOSED:${masterFrame}`);
  if (rendered.singlePhysicalDepthDomainExecuted !== true) throw new Error(`SINGLE_DEPTH_DOMAIN_NOT_EXECUTED:${masterFrame}`);
  if (rendered.successorMountainIncluded !== true) throw new Error(`SUCCESSOR_MOUNTAIN_NOT_INCLUDED:${masterFrame}`);
  if (!(rendered.rgba instanceof Uint8Array) && !ArrayBuffer.isView(rendered.rgba)) throw new Error(`RGBA_PAYLOAD_INVALID:${masterFrame}`);
  if (rendered.width !== 1280 || rendered.height !== 720) throw new Error(`RASTER_DIMENSION_MISMATCH:${masterFrame}:${rendered.width}x${rendered.height}`);
}

async function execute(args) {
  const candidateHead = args['candidate-head'];
  const shardId = args['shard-id'];
  const executionHolder = args['execution-holder'];
  const output = args.output;

  if (candidateHead !== EXACT_CANDIDATE) throw new Error(`CANDIDATE_IDENTITY_DRIFT:${candidateHead}`);
  const frames = framesForShard(shardId);
  if (!/^[A-Z0-9][A-Z0-9_.:-]{2,127}$/.test(executionHolder ?? '')) throw new Error('EXECUTION_HOLDER_INVALID');
  if (!output) throw new Error('OUTPUT_PATH_REQUIRED');

  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), `run8e-full-${shardId.toLowerCase()}-`));
  try {
    const toolRoot = process.cwd();
    const subjectRoot = materializeCandidate(toolRoot, tempRoot, candidateHead);
    const runtimePath = path.join(subjectRoot, 'tools/h-earth-run8e-native-camera-feasibility/run8e-native-camera-feasibility-runtime.v1.mjs');
    const runtime = await import(`${pathToFileURL(runtimePath).href}?candidate=${candidateHead}&shard=${shardId}`);
    if (typeof runtime.renderHEarthRun8ENativeCameraFrame !== 'function') throw new Error('RUN8E_RENDER_ENTRYPOINT_MISSING');

    const frameReceipts = [];
    for (const masterFrame of frames) {
      const rendered = runtime.renderHEarthRun8ENativeCameraFrame(masterFrame, {
        width: 1280,
        height: 720,
        pixelRatio: 1,
        timeOfDayHours: 15.25
      });
      validateRendered(rendered, masterFrame);
      if (repoStatus(subjectRoot) !== '') throw new Error(`SUBJECT_WORKTREE_MUTATED_BY_RENDER:${masterFrame}`);
      const png = encodePng(rendered.width, rendered.height, rendered.rgba);
      const imageSha256 = sha256(png);
      frameReceipts.push({
        masterFrame,
        inheritedManifestSha256: rendered.inheritedManifestSha256,
        inheritedCameraState: rendered.inheritedCameraState,
        resolvedCompositorPose: rendered.resolvedPose,
        worldFrameId: rendered.worldFrameId,
        worldContractId: rendered.worldContractId,
        imageSha256,
        imageMimeType: 'image/png',
        imageByteCount: png.length,
        imagePngBase64: png.toString('base64'),
        primitiveCount: rendered.primitiveCount,
        plannedTriangleCount: rendered.plannedTriangleCount,
        rejectedFragmentCount: rendered.rejectedFragmentCount,
        writtenPixelCount: rendered.writtenPixelCount,
        skyPixelCount: rendered.skyPixelCount,
        alphaClosed: rendered.alphaClosed,
        singlePhysicalDepthDomainExecuted: rendered.singlePhysicalDepthDomainExecuted,
        successorMountainIncluded: rendered.successorMountainIncluded,
        width: rendered.width,
        height: rendered.height
      });
      process.stdout.write(`RUN8E_FULL_SHARD_FRAME_PASS shard=${shardId} frame=${masterFrame} imageSha256=${imageSha256}\n`);
    }

    if (frameReceipts.length !== 30) throw new Error(`SHARD_FRAME_COUNT_MISMATCH:${frameReceipts.length}`);
    if (repoStatus(subjectRoot) !== '') throw new Error('SUBJECT_WORKTREE_MUTATED_BY_SHARD');
    const frameIdentitySet = frameReceipts.map(frame => ({
      masterFrame: frame.masterFrame,
      imageSha256: frame.imageSha256,
      imageByteCount: frame.imageByteCount,
      inheritedManifestSha256: frame.inheritedManifestSha256,
      width: frame.width,
      height: frame.height
    }));
    const shardSha256 = sha256(Buffer.from(stableJson(frameIdentitySet), 'utf8'));

    const receipt = {
      schema: RECEIPT_SCHEMA,
      result: 'PASS',
      operationId: OPERATION_ID,
      executionHolder,
      candidateHead,
      exactManifestSha256: EXACT_MANIFEST_SHA256,
      shardId,
      firstMasterFrame: frames[0],
      lastMasterFrame: frames[frames.length - 1],
      frameCount: frameReceipts.length,
      frameReceipts,
      shardSha256,
      subjectWorktreeCleanAfter: true,
      sourceMutationPerformed: false,
      productMutationPerformed: false,
      branchCreated: false,
      mergePerformed: false,
      deploymentPerformed: false,
      releasePerformed: false
    };
    writeReceipt(output, receipt);
    process.stdout.write(`RUN8E_FULL_SHARD_PASS shard=${shardId} frameCount=30 shardSha256=${shardSha256}\n`);
    return 0;
  } finally {
    fs.rmSync(tempRoot, { recursive: true, force: true });
  }
}

async function main() {
  if (process.argv.length === 3 && process.argv[2] === '--self-test') {
    try {
      selfTest();
      return;
    } catch (error) {
      process.stderr.write(`${error.stack || error.message}\n`);
      process.exitCode = 1;
      return;
    }
  }

  let args = {};
  let output;
  try {
    args = parseArgs(process.argv.slice(2));
    output = args.output;
    process.exitCode = await execute(args);
  } catch (error) {
    if (output) {
      writeReceipt(output, {
        schema: RECEIPT_SCHEMA,
        result: 'FAIL',
        operationId: OPERATION_ID,
        executionHolder: args['execution-holder'] ?? null,
        candidateHead: args['candidate-head'] ?? null,
        shardId: args['shard-id'] ?? null,
        exactManifestSha256: EXACT_MANIFEST_SHA256,
        firstAssertion: error.message,
        sourceMutationPerformed: false,
        productMutationPerformed: false,
        branchCreated: false,
        mergePerformed: false,
        deploymentPerformed: false,
        releasePerformed: false
      });
    }
    process.stderr.write(`${error.stack || error.message}\n`);
    process.exitCode = 1;
  }
}

await main();
