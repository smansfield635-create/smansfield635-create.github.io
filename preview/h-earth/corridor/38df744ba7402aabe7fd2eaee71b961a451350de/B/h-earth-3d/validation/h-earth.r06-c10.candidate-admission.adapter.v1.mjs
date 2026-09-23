#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const ADAPTER_ID = 'H_EARTH_R06_C10_CANDIDATE_ADMISSION_ADAPTER_v1';
const MANIFEST_PATH = 'h-earth-3d/control-plane/r06-c10/candidate-admission/h-earth.r06-c10.current-candidate-admission.manifest.v1.json';

function fail(message) {
  process.stderr.write(`${message}\n`);
  process.exit(1);
}

function parseArgs(argv) {
  const result = { candidateHead: null, output: null };
  for (let i = 0; i < argv.length; i += 1) {
    if (argv[i] === '--candidate-head') result.candidateHead = argv[++i] ?? null;
    else if (argv[i] === '--output') result.output = argv[++i] ?? null;
    else fail(`UNKNOWN_ARGUMENT:${argv[i]}`);
  }
  if (!result.candidateHead || !result.output) fail('REQUIRED_ARGUMENTS_MISSING');
  return result;
}

function git(args) {
  const result = spawnSync('git', args, { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
  if (result.error) throw result.error;
  if (result.status !== 0) throw new Error(`git ${args.join(' ')} failed: ${result.stderr || result.stdout}`);
  return (result.stdout ?? '').trim();
}

const args = parseArgs(process.argv.slice(2));
try {
  if (process.env.H_EARTH_R06_C10_GATE_PRIVATE_STATE_ALLOWED !== 'false') {
    throw new Error('GATE_PRIVATE_STATE_LAW_MISSING');
  }
  const head = git(['rev-parse', 'HEAD^{commit}']);
  const requested = git(['rev-parse', `${args.candidateHead}^{commit}`]);
  if (head !== requested) throw new Error('CANDIDATE_HEAD_MISMATCH');
  const status = git(['status', '--porcelain=v1', '--untracked-files=all']);
  if (status) throw new Error(`CANDIDATE_WORKTREE_DIRTY:${status.replaceAll('\n', '|')}`);
  if (!fs.existsSync(MANIFEST_PATH)) throw new Error('CANDIDATE_ADMISSION_MANIFEST_MISSING');
  const manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf8'));
  if (manifest.schema !== 'H_EARTH_R06_C10_EXACT_CANDIDATE_ADMISSION_MANIFEST_v1') {
    throw new Error('CANDIDATE_ADMISSION_MANIFEST_SCHEMA_MISMATCH');
  }
  if (manifest.adapterPath !== 'h-earth-3d/validation/h-earth.r06-c10.candidate-admission.adapter.v1.mjs') {
    throw new Error('CANDIDATE_ADMISSION_ADAPTER_PATH_MISMATCH');
  }
  if (typeof manifest.evaluatorPath !== 'string' || !fs.existsSync(manifest.evaluatorPath)) {
    throw new Error('CANDIDATE_ADMISSION_EVALUATOR_MISSING');
  }
  const output = path.resolve(args.output);
  fs.mkdirSync(path.dirname(output), { recursive: true });
  const command = [
    'node', manifest.evaluatorPath,
    '--candidate-head', head,
    '--output', output
  ];
  const execution = spawnSync(command[0], command.slice(1), {
    encoding: 'utf8',
    maxBuffer: 64 * 1024 * 1024,
    env: {
      ...process.env,
      H_EARTH_R06_C10_ADAPTER_ID: ADAPTER_ID,
      H_EARTH_R06_C10_ADAPTER_CANDIDATE_HEAD: head,
      H_EARTH_R06_C10_ADAPTER_OUTPUT: output,
      H_EARTH_R06_C10_PRIVATE_STATE_ALLOWED: 'false'
    }
  });
  if (execution.error) throw execution.error;
  if (!fs.existsSync(output)) {
    throw new Error(`EVALUATOR_DID_NOT_WRITE_RECEIPT:exit=${execution.status}`);
  }
  process.stdout.write(execution.stdout ?? '');
  process.stderr.write(execution.stderr ?? '');
  process.exitCode = execution.status ?? 1;
} catch (error) {
  const failure = {
    schema: 'H_EARTH_R06_C10_CANDIDATE_ADMISSION_ADAPTER_FAILURE_v1',
    adapterId: ADAPTER_ID,
    candidateArgument: args.candidateHead,
    result: 'FAIL_CLOSED',
    error: error instanceof Error ? error.message : String(error),
    privateStateUsed: false,
    conversationMemoryRequired: false
  };
  fs.mkdirSync(path.dirname(path.resolve(args.output)), { recursive: true });
  fs.writeFileSync(path.resolve(args.output), `${JSON.stringify(failure, null, 2)}\n`, 'utf8');
  process.exitCode = 1;
}
