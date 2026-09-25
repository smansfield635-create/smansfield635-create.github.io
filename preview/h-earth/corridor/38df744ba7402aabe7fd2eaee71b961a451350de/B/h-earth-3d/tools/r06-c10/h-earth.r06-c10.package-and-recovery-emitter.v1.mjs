#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { createHash } from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

export const H_EARTH_R06_C10_PACKAGE_AND_RECOVERY_EMITTER_ID =
  'H_EARTH_R06_C10_PACKAGE_AND_RECOVERY_EMITTER_v1';
export const PACKAGE_ID = 'H_EARTH_R06_C10_GEOMETRY_ARTICULATION_SHARED_TOOL_BASE_v1';
export const PACKAGE_VERSION = '0.3.2_ROLE_1_RECOVERY_ROOT_GENERALIZED';
export const ARCHIVE_ROOT = 'H_EARTH_R06_C10_ROLE_1_NONPRODUCT_TOOL_CONSTRUCTION_COMPLETE_v1_0_3_2_RECOVERY_ROOT_GENERALIZED';
export const FIXED_ZIP_TIMESTAMP = Object.freeze([1980, 1, 1, 0, 0, 0]);
export const FIXED_FILE_MODE = 0o100644;

const TEXT_EXTENSIONS = new Set([
  '.cjs', '.css', '.csv', '.glsl', '.html', '.js', '.json', '.md', '.mjs', '.txt', '.yml', '.yaml'
]);

const sha256 = (bytes) => createHash('sha256').update(bytes).digest('hex');
const sha256File = (file) => sha256(fs.readFileSync(file));
const canonicalize = (value) => {
  if (value === null) return 'null';
  if (typeof value === 'string' || typeof value === 'boolean') return JSON.stringify(value);
  if (typeof value === 'number') {
    if (!Number.isFinite(value)) throw new TypeError('NONFINITE_CANONICAL_VALUE');
    return JSON.stringify(Object.is(value, -0) ? 0 : value);
  }
  if (Array.isArray(value)) return `[${value.map(canonicalize).join(',')}]`;
  if (typeof value === 'object') {
    return `{${Object.keys(value).sort().map((key) => `${JSON.stringify(key)}:${canonicalize(value[key])}`).join(',')}}`;
  }
  throw new TypeError('NON_JSON_CANONICAL_VALUE');
};
export const digestCanonicalJson = (value) => sha256(Buffer.from(canonicalize(value), 'utf8'));

const run = (command, args, options = {}) => {
  const result = spawnSync(command, args, { encoding: 'utf8', ...options });
  if (result.error) throw result.error;
  if (result.status !== 0) {
    throw new Error(`${command} ${args.join(' ')} failed (${result.status}): ${result.stderr || result.stdout}`);
  }
  return String(result.stdout || '').trim();
};

const parseArgs = (argv = process.argv.slice(2)) => {
  const command = argv[0];
  const values = {};
  for (let index = 1; index < argv.length; index += 1) {
    const token = argv[index];
    if (!token.startsWith('--')) throw new Error(`UNKNOWN_POSITIONAL_ARGUMENT:${token}`);
    const key = token.slice(2);
    const value = argv[index + 1];
    if (!value || value.startsWith('--')) throw new Error(`MISSING_ARGUMENT_VALUE:${key}`);
    values[key] = value;
    index += 1;
  }
  return { command, values };
};

const normalizeArchivePath = (archivePath) => {
  const normalized = archivePath.replaceAll('\\', '/').replace(/^\/+/, '');
  if (!normalized || normalized.endsWith('/') || normalized.includes('../') || normalized === '..') {
    throw new Error(`INVALID_ARCHIVE_MEMBER_PATH:${archivePath}`);
  }
  return normalized;
};

const normalizeTextBytes = (sourcePath, bytes) => {
  const extension = path.extname(sourcePath).toLowerCase();
  if (!TEXT_EXTENSIONS.has(extension)) return bytes;
  const text = new TextDecoder('utf-8', { fatal: true }).decode(bytes);
  return Buffer.from(text.replace(/\r\n?/g, '\n'), 'utf8');
};

const loadBuildSpec = (specPath) => {
  const spec = JSON.parse(fs.readFileSync(specPath, 'utf8'));
  if (spec.schema !== 'H_EARTH_R06_C10_DETERMINISTIC_PACKAGE_BUILD_SPEC_v1') {
    throw new Error('INVALID_PACKAGE_BUILD_SPEC_SCHEMA');
  }
  if (spec.archiveRoot !== ARCHIVE_ROOT) throw new Error('ARCHIVE_ROOT_MISMATCH');
  if (!Array.isArray(spec.members) || spec.members.length === 0) throw new Error('EMPTY_PACKAGE_MEMBER_SET');
  const seen = new Set();
  const members = spec.members.map((entry) => {
    const archivePath = normalizeArchivePath(entry.archivePath);
    const sourcePath = path.resolve(entry.sourcePath);
    if (archivePath === 'SHA256SUMS.txt') throw new Error('SHA256SUMS_IS_EMITTER_MANAGED');
    if (seen.has(archivePath)) throw new Error(`DUPLICATE_ARCHIVE_MEMBER:${archivePath}`);
    seen.add(archivePath);
    if (!fs.statSync(sourcePath).isFile()) throw new Error(`PACKAGE_SOURCE_NOT_FILE:${sourcePath}`);
    return { archivePath, sourcePath, normalizeText: entry.normalizeText !== false };
  });
  members.sort((left, right) => left.archivePath.localeCompare(right.archivePath, 'en'));
  return { spec, members };
};

const PYTHON_ZIP_BUILDER = String.raw`
import json,sys,zipfile,hashlib,os
spec_path,output_path=sys.argv[1:]
spec=json.load(open(spec_path,encoding='utf-8'))
root=spec['archiveRoot'].rstrip('/')+'/'
fixed=(1980,1,1,0,0,0)
mode=(0o100644 << 16)
def make_info(name):
    info=zipfile.ZipInfo(root+name,fixed)
    info.create_system=3
    info.external_attr=mode
    info.compress_type=zipfile.ZIP_DEFLATED
    info.flag_bits |= 0x800
    return info
entries=[(member['archivePath'],open(member['stagedPath'],'rb').read()) for member in spec['members']]
entries.append(('SHA256SUMS.txt',open(spec['sha256SumsPath'],'rb').read()))
entries.sort(key=lambda entry: entry[0])
with zipfile.ZipFile(output_path,'w',compression=zipfile.ZIP_DEFLATED,compresslevel=9,strict_timestamps=True) as z:
    for name,data in entries:
        z.writestr(make_info(name),data,compress_type=zipfile.ZIP_DEFLATED,compresslevel=9)
`;

export function buildDeterministicPackage({ specPath, outputPath, repeatOutputPath = null }) {
  const { spec, members } = loadBuildSpec(specPath);
  const temporary = fs.mkdtempSync(path.join(os.tmpdir(), 'r06c10-emitter-'));
  const stagedRoot = path.join(temporary, 'staged');
  fs.mkdirSync(stagedRoot, { recursive: true });
  const stagedMembers = [];
  for (const member of members) {
    const raw = fs.readFileSync(member.sourcePath);
    const bytes = member.normalizeText ? normalizeTextBytes(member.sourcePath, raw) : raw;
    const stagedPath = path.join(stagedRoot, member.archivePath);
    fs.mkdirSync(path.dirname(stagedPath), { recursive: true });
    fs.writeFileSync(stagedPath, bytes);
    stagedMembers.push({ archivePath: member.archivePath, stagedPath, sha256: sha256(bytes), byteCount: bytes.length });
  }
  const sums = stagedMembers.map((entry) => `${entry.sha256}  ${entry.archivePath}`).join('\n') + '\n';
  const sumsPath = path.join(temporary, 'SHA256SUMS.txt');
  fs.writeFileSync(sumsPath, sums, 'utf8');
  const pythonSpec = {
    archiveRoot: spec.archiveRoot,
    members: stagedMembers.map(({ archivePath, stagedPath }) => ({ archivePath, stagedPath })),
    sha256SumsPath: sumsPath
  };
  const pythonSpecPath = path.join(temporary, 'python-build-spec.json');
  fs.writeFileSync(pythonSpecPath, `${JSON.stringify(pythonSpec)}\n`, 'utf8');
  fs.mkdirSync(path.dirname(path.resolve(outputPath)), { recursive: true });
  run('python3', ['-c', PYTHON_ZIP_BUILDER, pythonSpecPath, path.resolve(outputPath)]);
  const repeat = repeatOutputPath || path.join(temporary, 'repeat.zip');
  run('python3', ['-c', PYTHON_ZIP_BUILDER, pythonSpecPath, path.resolve(repeat)]);
  const firstBytes = fs.readFileSync(outputPath);
  const secondBytes = fs.readFileSync(repeat);
  if (!firstBytes.equals(secondBytes)) throw new Error('ARCHIVE_REPEAT_SHA256_MISMATCH');
  const verification = verifyArchiveReadback({ archivePath: outputPath });
  return {
    emitterId: H_EARTH_R06_C10_PACKAGE_AND_RECOVERY_EMITTER_ID,
    packageId: PACKAGE_ID,
    packageVersion: PACKAGE_VERSION,
    archivePath: path.resolve(outputPath),
    archiveSha256: sha256(firstBytes),
    archiveByteCount: firstBytes.length,
    archiveMemberCount: verification.memberCount,
    internalManifestCoverageCount: stagedMembers.length,
    deterministicRepeat: true,
    members: verification.members
  };
}

const PYTHON_ZIP_VERIFIER = String.raw`
import json,sys,zipfile,hashlib,os,tempfile
archive=sys.argv[1]
data=open(archive,'rb').read()
with zipfile.ZipFile(archive) as z:
    bad=z.testzip()
    infos=sorted(z.infolist(),key=lambda i:i.filename)
    files=[i for i in infos if not i.is_dir()]
    if not files: raise SystemExit('ZERO_ARCHIVE_ROOTS')
    normalized=[]
    roots=set()
    for info in files:
        name=info.filename.replace('\\','/')
        parts=name.split('/')
        if len(parts)<2 or not parts[0] or not parts[-1]:
            raise SystemExit('ARCHIVE_MEMBER_OUTSIDE_SINGLE_ROOT')
        roots.add(parts[0])
        normalized.append((info,name))
    if len(roots)==0: raise SystemExit('ZERO_ARCHIVE_ROOTS')
    if len(roots)>1: raise SystemExit('MULTIPLE_ARCHIVE_ROOTS')
    root_name=next(iter(roots))
    root=root_name+'/'
    members=[]
    raw={}
    for info,name in normalized:
        if not name.startswith(root): raise SystemExit('ARCHIVE_MEMBER_OUTSIDE_SINGLE_ROOT')
        rel=name[len(root):]
        if not rel: raise SystemExit('ARCHIVE_MEMBER_EMPTY_RELATIVE_PATH')
        b=z.read(info.filename); raw[rel]=b
        members.append({'path':rel,'sha256':hashlib.sha256(b).hexdigest(),'byteCount':len(b)})
    if 'SHA256SUMS.txt' not in raw: raise SystemExit('MISSING_SHA256SUMS')
    declared={}
    for line in raw['SHA256SUMS.txt'].decode('utf-8').splitlines():
        if line.strip():
            h,p=line.split(None,1); declared[p.strip()]=h
    actual={m['path']:m['sha256'] for m in members if m['path']!='SHA256SUMS.txt'}
    if declared != actual: raise SystemExit('INTERNAL_SHA256SUMS_MISMATCH')
print(json.dumps({'outerSha256':hashlib.sha256(data).hexdigest(),'byteCount':len(data),'memberCount':len(members),'archiveRoot':root[:-1],'zipIntegrity':bad is None,'internalManifestCoverageCount':len(declared),'members':members},sort_keys=True))
`;

export function verifyArchiveReadback({ archivePath }) {
  if (!fs.existsSync(archivePath)) throw new Error('ARCHIVE_NOT_FOUND');
  return JSON.parse(run('python3', ['-c', PYTHON_ZIP_VERIFIER, path.resolve(archivePath)]));
}

export function writeCompleteMemberManifest({ archivePath, outputPath, driveFileId = null }) {
  const verification = verifyArchiveReadback({ archivePath });
  const manifest = {
    schema: 'H_EARTH_R06_C10_ROLE_1_COMPLETE_MEMBER_MANIFEST_v1',
    manifestId: 'H_EARTH_R06_C10_ROLE_1_COMPLETE_MEMBER_MANIFEST_v1',
    packageId: PACKAGE_ID,
    packageVersion: PACKAGE_VERSION,
    archiveName: `${ARCHIVE_ROOT}.zip`,
    driveFileId,
    source: 'RAW_DRIVE_READBACK_ARCHIVE',
    archiveSha256: verification.outerSha256,
    archiveByteCount: verification.byteCount,
    archiveMemberCount: verification.memberCount,
    zipIntegrity: verification.zipIntegrity,
    internalManifestCoverageCount: verification.internalManifestCoverageCount,
    completeManifestCoverageCount: verification.members.length,
    includesInternalSha256SumsMember: verification.members.some((entry) => entry.path === 'SHA256SUMS.txt'),
    members: verification.members
  };
  fs.mkdirSync(path.dirname(path.resolve(outputPath)), { recursive: true });
  fs.writeFileSync(outputPath, `${JSON.stringify(manifest, null, 2)}\n`, 'utf8');
  return { ...manifest, manifestSha256: sha256File(outputPath) };
}

const PYTHON_EXTRACTOR = String.raw`
import sys,zipfile,os
archive,out=sys.argv[1:]
os.makedirs(out,exist_ok=True)
with zipfile.ZipFile(archive) as z:
    z.extractall(out)
`;

export function extractArchive({ archivePath, outputDirectory }) {
  const verification = verifyArchiveReadback({ archivePath });
  fs.rmSync(outputDirectory, { recursive: true, force: true });
  run('python3', ['-c', PYTHON_EXTRACTOR, path.resolve(archivePath), path.resolve(outputDirectory)]);
  const packageRoot = path.join(path.resolve(outputDirectory), verification.archiveRoot);
  if (!fs.existsSync(packageRoot) || !fs.statSync(packageRoot).isDirectory()) {
    throw new Error('VERIFIED_ARCHIVE_ROOT_NOT_EXTRACTED');
  }
  return { packageRoot, archiveRoot: verification.archiveRoot, verification };
}

export function loadRecoveredPackageIdentity({ packageRoot, archiveRoot }) {
  const identityPath = path.join(packageRoot, 'PACKAGE_BUILD_RECEIPT.json');
  if (!fs.existsSync(identityPath)) throw new Error('RECOVERED_PACKAGE_IDENTITY_MISSING');
  const identity = JSON.parse(fs.readFileSync(identityPath, 'utf8'));
  if (identity.schema !== 'H_EARTH_R06_C10_ROLE_1_PACKAGE_BUILD_RECEIPT_v1') {
    throw new Error('RECOVERED_PACKAGE_IDENTITY_SCHEMA_MISMATCH');
  }
  if (identity.packageId !== PACKAGE_ID) throw new Error('RECOVERED_PACKAGE_ID_MISMATCH');
  if (typeof identity.packageVersion !== 'string' || identity.packageVersion.trim() === '') {
    throw new Error('RECOVERED_PACKAGE_VERSION_MISSING');
  }
  if (identity.archiveName !== `${archiveRoot}.zip`) {
    throw new Error('RECOVERED_PACKAGE_ARCHIVE_ROOT_IDENTITY_MISMATCH');
  }
  return Object.freeze({
    identityPath,
    packageId: identity.packageId,
    packageVersion: identity.packageVersion,
    archiveName: identity.archiveName,
    archiveRoot
  });
}

export function replayRecoveryPackage({ archivePath, outputDirectory }) {
  const extractionDirectory = path.join(path.resolve(outputDirectory), 'extracted');
  const extraction = extractArchive({ archivePath, outputDirectory: extractionDirectory });
  const { packageRoot, archiveRoot } = extraction;
  const recoveredPackageIdentity = loadRecoveredPackageIdentity({ packageRoot, archiveRoot });
  const repositoryRoot = path.join(packageRoot, 'recovery/repository-substrate');
  const manifestPath = path.join(packageRoot, 'manifests/completed-eight-tool-manifest.json');
  const assumptionPath = path.join(packageRoot, 'recovery/role-assumption-bootstrap.json');
  if (!fs.existsSync(manifestPath) || !fs.existsSync(repositoryRoot) || !fs.existsSync(assumptionPath)) {
    throw new Error('RECOVERY_PACKAGE_REQUIRED_MEMBER_MISSING');
  }
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  if (manifest.toolCount !== 8 || !Array.isArray(manifest.tools) || manifest.tools.length !== 8) {
    throw new Error('RECOVERY_TOOL_MANIFEST_NOT_COMPLETE');
  }
  if (manifest.packageId !== recoveredPackageIdentity.packageId) {
    throw new Error('RECOVERY_MANIFEST_PACKAGE_ID_MISMATCH');
  }
  if (manifest.packageVersion !== recoveredPackageIdentity.packageVersion) {
    throw new Error('RECOVERY_MANIFEST_PACKAGE_VERSION_MISMATCH');
  }
  for (const tool of manifest.tools) {
    const file = path.join(repositoryRoot, tool.path);
    if (!fs.existsSync(file)) throw new Error(`RECOVERY_TOOL_PATH_MISSING:${tool.path}`);
    if (sha256File(file) !== tool.sha256) throw new Error(`RECOVERY_TOOL_SHA256_MISMATCH:${tool.toolId}`);
  }
  const harness = 'h-earth-3d/validation/h-earth.r06-c10.geometry-articulation-tool.harness.mjs';
  const custody = 'h-earth-3d/control-plane/r06-c10/receipts/h-earth.r06-c10.role1.package-assumption-receipt.v1.json';
  const role1a = path.join(outputDirectory, 'role1-run-a');
  const role1b = path.join(outputDirectory, 'role1-run-b');
  const role3 = path.join(outputDirectory, 'role3-simulation');
  const failover = path.join(outputDirectory, 'role6-failover');
  const missing = path.join(outputDirectory, 'missing-authority');
  const invoke = (role, out, extra = []) => run('node', [harness, '--custody-receipt', custody, '--invocation-role', role, ...extra, '--output', out], { cwd: repositoryRoot });
  invoke('ROLE_1_PROVISIONAL_LOCAL_CHECK', role1a);
  invoke('ROLE_1_PROVISIONAL_LOCAL_CHECK', role1b);
  invoke('ROLE_3_INDEPENDENT_EXECUTION', role3);
  invoke('ROLE_6_FAILOVER', failover, ['--role-assumption-receipt', assumptionPath]);
  const first = JSON.parse(fs.readFileSync(path.join(role1a, 'verification-receipt.json'), 'utf8'));
  const second = JSON.parse(fs.readFileSync(path.join(role1b, 'verification-receipt.json'), 'utf8'));
  const role3Receipt = JSON.parse(fs.readFileSync(path.join(role3, 'verification-receipt.json'), 'utf8'));
  const failoverReceipt = JSON.parse(fs.readFileSync(path.join(failover, 'verification-receipt.json'), 'utf8'));
  const missingResult = spawnSync('node', [harness, '--custody-receipt', path.join(repositoryRoot, 'missing.json'), '--invocation-role', 'ROLE_1_PROVISIONAL_LOCAL_CHECK', '--output', missing], { cwd: repositoryRoot, encoding: 'utf8' });
  const missingReceipt = JSON.parse(fs.readFileSync(path.join(missing, 'verification-receipt.json'), 'utf8'));
  const exactFailures = [
    '19_SLOPE_EDGE_RISE_AND_NORMAL_ANGLE_BOUNDS_PASS',
    '20_TRAVERSABLE_OPENING_WIDTH_LENGTH_SLOPE_CLEARANCE_PASS',
    '23_FALL_FACE_BASIN_DRAINAGE_OUTLET_READINESS_PASS'
  ];
  const equal = (left, right) => JSON.stringify(left) === JSON.stringify(right);
  const pass = first.assertionExecutionCount === 28 &&
    first.assertionImplementationCount === 28 &&
    first.candidateAdmissionResult === 'FAIL_CLOSED' &&
    equal(first.failAssertionIds, exactFailures) &&
    first.deterministicReceiptDigest === second.deterministicReceiptDigest &&
    role3Receipt.harnessConstructionResult === 'PASS' &&
    failoverReceipt.harnessConstructionResult === 'PASS' &&
    missingResult.status !== 0 && missingReceipt.classification === 'HARNESS_INPUT_REJECTED_FAIL_CLOSED';
  const receipt = {
    schema: 'H_EARTH_R06_C10_C5_CLEAN_RECOVERY_REPLAY_RECEIPT_v1',
    result: pass ? 'PASS' : 'FAIL_CLOSED',
    packageId: PACKAGE_ID,
    packageVersion: recoveredPackageIdentity.packageVersion,
    archiveRoot,
    packageIdentityValidated: true,
    completedToolManifestLoads: true,
    requiredSourceIdentitiesVerified: first.assertions?.[0]?.result === 'PASS',
    role1ProvisionalHarnessPass: first.harnessConstructionResult === 'PASS',
    role3IndependentModeSimulationPass: role3Receipt.harnessConstructionResult === 'PASS',
    validRole6FailoverAssumptionReceiptLoads: failoverReceipt.harnessConstructionResult === 'PASS',
    missingAuthorityFailsClosed: missingResult.status !== 0 && missingReceipt.classification === 'HARNESS_INPUT_REJECTED_FAIL_CLOSED',
    deterministicRepeat: first.deterministicReceiptDigest === second.deterministicReceiptDigest,
    exactCandidateAdmissionFailures: first.failAssertionIds,
    conversationStateRequired: false,
    productMutation: false,
    officialGeometryArticulationRound: 'NOT_STARTED'
  };
  fs.mkdirSync(outputDirectory, { recursive: true });
  const receiptPath = path.join(outputDirectory, 'clean-recovery-replay-receipt.json');
  fs.writeFileSync(receiptPath, `${JSON.stringify(receipt, null, 2)}\n`, 'utf8');
  if (!pass) throw new Error('CLEAN_RECOVERY_REPLAY_FAILED');
  return { ...receipt, receiptPath, receiptSha256: sha256File(receiptPath) };
}

async function cli() {
  const { command, values } = parseArgs();
  if (command === 'build') {
    const result = buildDeterministicPackage({ specPath: values.spec, outputPath: values.output, repeatOutputPath: values.repeat });
    process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
    return;
  }
  if (command === 'verify') {
    process.stdout.write(`${JSON.stringify(verifyArchiveReadback({ archivePath: values.archive }), null, 2)}\n`);
    return;
  }
  if (command === 'manifest') {
    process.stdout.write(`${JSON.stringify(writeCompleteMemberManifest({ archivePath: values.archive, outputPath: values.output, driveFileId: values['drive-file-id'] || null }), null, 2)}\n`);
    return;
  }
  if (command === 'replay') {
    process.stdout.write(`${JSON.stringify(replayRecoveryPackage({ archivePath: values.archive, outputDirectory: values.output }), null, 2)}\n`);
    return;
  }
  throw new Error(`UNKNOWN_COMMAND:${command || '<missing>'}`);
}

const isMain = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isMain) {
  cli().catch((error) => {
    console.error(error?.stack || error);
    process.exitCode = 2;
  });
}
