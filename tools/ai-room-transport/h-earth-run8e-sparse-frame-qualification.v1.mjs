#!/usr/bin/env node
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import cp from 'node:child_process';
import zlib from 'node:zlib';
import crypto from 'node:crypto';
import { pathToFileURL } from 'node:url';

const EXACT_CANDIDATE = '20802e02890e1be8b93c0f1b75fef0f973985e96';
const EXACT_MANIFEST_SHA256 = '555d1d815a834503c6ed97f27f330bae28341b242058663e371f36d7e056de16';
const ALLOWED_FRAMES = new Set([
  776,777,778,779,780,781,782,783,784,
  836,837,838,839,840,841,842,843,844,
  896,897,898,899,900,901,902,903,904
]);

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
  ihdr[10] = 0;
  ihdr[11] = 0;
  ihdr[12] = 0;
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

function writeReceipt(outputPath, receipt) {
  fs.mkdirSync(path.dirname(path.resolve(outputPath)), { recursive: true });
  fs.writeFileSync(path.resolve(outputPath), `${JSON.stringify(stable(receipt), null, 2)}\n`);
}

function repoStatus(root) {
  return run('git', ['status', '--porcelain=v1', '--untracked-files=all'], root, true).stdout.trim();
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

async function execute(args) {
  const candidateHead = args['candidate-head'];
  const masterFrame = Number(args['master-frame']);
  const executionHolder = args['execution-holder'];
  const output = args.output;

  if (candidateHead !== EXACT_CANDIDATE) throw new Error(`CANDIDATE_IDENTITY_DRIFT:${candidateHead}`);
  if (!Number.isInteger(masterFrame) || !ALLOWED_FRAMES.has(masterFrame)) throw new Error(`SPARSE_FRAME_NOT_AUTHORIZED:${args['master-frame']}`);
  if (!/^[A-Z0-9][A-Z0-9_.:-]{2,127}$/.test(executionHolder ?? '')) throw new Error('EXECUTION_HOLDER_INVALID');
  if (!output) throw new Error('OUTPUT_PATH_REQUIRED');

  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'run8e-sparse-frame-'));
  try {
    const toolRoot = process.cwd();
    const subjectRoot = materializeCandidate(toolRoot, tempRoot, candidateHead);
    const runtimePath = path.join(
      subjectRoot,
      'tools/h-earth-run8e-native-camera-feasibility/run8e-native-camera-feasibility-runtime.v1.mjs'
    );
    const runtime = await import(`${pathToFileURL(runtimePath).href}?candidate=${candidateHead}`);
    if (typeof runtime.renderHEarthRun8ENativeCameraFrame !== 'function') throw new Error('RUN8E_RENDER_ENTRYPOINT_MISSING');

    const rendered = runtime.renderHEarthRun8ENativeCameraFrame(masterFrame, {
      width: 1280,
      height: 720,
      pixelRatio: 1,
      timeOfDayHours: 15.25
    });

    if (rendered.inheritedManifestSha256 !== EXACT_MANIFEST_SHA256) {
      throw new Error(`MANIFEST_IDENTITY_DRIFT:${rendered.inheritedManifestSha256}`);
    }
    if (rendered.masterFrame !== masterFrame) throw new Error('MASTER_FRAME_IDENTITY_MISMATCH');
    if (rendered.alphaClosed !== true) throw new Error('ALPHA_NOT_CLOSED');
    if (rendered.singlePhysicalDepthDomainExecuted !== true) throw new Error('SINGLE_DEPTH_DOMAIN_NOT_EXECUTED');
    if (rendered.successorMountainIncluded !== true) throw new Error('SUCCESSOR_MOUNTAIN_NOT_INCLUDED');
    if (!(rendered.rgba instanceof Uint8Array) && !ArrayBuffer.isView(rendered.rgba)) throw new Error('RGBA_PAYLOAD_INVALID');
    if (repoStatus(subjectRoot) !== '') throw new Error('SUBJECT_WORKTREE_MUTATED_BY_RENDER');

    const png = encodePng(rendered.width, rendered.height, rendered.rgba);
    const imageSha256 = sha256(png);

    const receipt = {
      schema: 'H_EARTH_RUN8E_SPARSE_FRAME_QUALIFICATION_RECEIPT_v1',
      result: 'PASS',
      operationId: 'H_EARTH_RUN8E_EXACT_CANDIDATE_SPARSE_BOUNDARY_QUALIFICATION_20260916_001',
      executionHolder,
      candidateHead,
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
      height: rendered.height,
      subjectWorktreeCleanAfter: true,
      sourceMutationPerformed: false,
      productMutationPerformed: false,
      branchCreated: false,
      mergePerformed: false,
      deploymentPerformed: false,
      releasePerformed: false
    };
    writeReceipt(output, receipt);
    process.stdout.write(`RUN8E_SPARSE_FRAME_PASS frame=${masterFrame} imageSha256=${imageSha256}\n`);
    return 0;
  } finally {
    fs.rmSync(tempRoot, { recursive: true, force: true });
  }
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const output = args.output;
  try {
    const status = await execute(args);
    process.exitCode = status;
  } catch (error) {
    if (output) {
      writeReceipt(output, {
        schema: 'H_EARTH_RUN8E_SPARSE_FRAME_QUALIFICATION_RECEIPT_v1',
        result: 'FAIL',
        operationId: 'H_EARTH_RUN8E_EXACT_CANDIDATE_SPARSE_BOUNDARY_QUALIFICATION_20260916_001',
        executionHolder: args['execution-holder'] ?? null,
        candidateHead: args['candidate-head'] ?? null,
        masterFrame: Number.isFinite(Number(args['master-frame'])) ? Number(args['master-frame']) : null,
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
