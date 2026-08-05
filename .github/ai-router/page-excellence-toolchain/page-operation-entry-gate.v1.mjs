#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { spawnSync } from 'node:child_process';

const TOOL_ROOT = '.github/ai-router/page-excellence-toolchain';
const BUNDLE = `${TOOL_ROOT}/toolset.bundle.v1.json`;
const ROUTER = 'tools/repository-ai-entry-router.mjs';

function die(message, code = 1, extra = {}) {
  const receipt = { schema: 'MANDATORY_PAGE_OPERATION_GATE_FAILURE_v1', result: 'BLOCK', error: message, ...extra };
  process.stderr.write(`${JSON.stringify(receipt, null, 2)}\n`);
  process.exit(code);
}

function parseArgs(argv) {
  const result = { paths: [], pathsFile: null, task: '', mutationIntent: false, output: null, pagePhase: null, receiptBundle: null, selfTest: false, delegateArgs: [] };
  for (let i = 0; i < argv.length; i += 1) {
    const token = argv[i];
    if (token === '--path') { const value = argv[++i] ?? ''; result.paths.push(value); result.delegateArgs.push('--path', value); }
    else if (token === '--paths-file') { const value = argv[++i] ?? ''; result.pathsFile = value; result.delegateArgs.push('--paths-file', value); }
    else if (token === '--task') { const value = argv[++i] ?? ''; result.task = value; result.delegateArgs.push('--task', value); }
    else if (token === '--mutation-intent') { result.mutationIntent = true; result.delegateArgs.push(token); }
    else if (token === '--output') { const value = argv[++i] ?? ''; result.output = value; result.delegateArgs.push('--output', value); }
    else if (token === '--page-phase') result.pagePhase = (argv[++i] ?? '').toUpperCase();
    else if (token === '--page-receipt-bundle') result.receiptBundle = argv[++i] ?? null;
    else if (token === '--self-test') result.selfTest = true;
    else if (token === '--help') {
      process.stdout.write('Usage: node page-operation-entry-gate.v1.mjs --mutation-intent --path <path> --page-phase <ARCHITECTURE|IMPLEMENTATION|RUNTIME|ADOPTION> --page-receipt-bundle <bundle.json> [router options]\n');
      process.exit(0);
    } else die(`UNKNOWN_ARGUMENT:${token}`);
  }
  return result;
}

function discoverRoot(start) {
  let current = path.resolve(start);
  while (true) {
    if (fs.existsSync(path.join(current, 'AI_ENTRYPOINT.json'))) return current;
    const parent = path.dirname(current);
    if (parent === current) throw new Error('REPOSITORY_ROOT_NOT_FOUND');
    current = parent;
  }
}

function readJson(root, relative) {
  const absolute = path.join(root, relative);
  if (!fs.existsSync(absolute)) throw new Error(`MISSING_REQUIRED_FILE:${relative}`);
  return JSON.parse(fs.readFileSync(absolute, 'utf8'));
}

function normalize(value) {
  return value.trim().replaceAll('\\', '/').replace(/^\.\/+/, '').replace(/\/+/g, '/');
}

function sha256(value) { return crypto.createHash('sha256').update(value).digest('hex'); }

function pageClassification(paths, task, standard) {
  const detection = standard.pageOperationDetection;
  const upperTask = String(task || '').toUpperCase();
  const taskMatch = detection.taskTokens.some(token => upperTask.includes(token));
  const matches = [];
  for (const raw of paths) {
    const filePath = normalize(raw);
    if (detection.excludedPrefixes.some(prefix => filePath.startsWith(prefix))) continue;
    const extensionMatch = detection.extensions.some(ext => filePath.toLowerCase().endsWith(ext));
    const prefixMatch = detection.interfacePrefixes.some(prefix => filePath.startsWith(prefix));
    const scriptUnderInterface = prefixMatch && /\.(?:js|mjs|cjs|ts)$/.test(filePath.toLowerCase());
    const namedSurface = /(?:^|\/)(?:index|page|showroom|interface|dashboard|app)\.(?:js|mjs|ts)$/.test(filePath.toLowerCase());
    if (extensionMatch || scriptUnderInterface || namedSurface || (taskMatch && prefixMatch)) matches.push(filePath);
  }
  return { isPageOperation: matches.length > 0 || (taskMatch && paths.some(p => !detection.excludedPrefixes.some(prefix => normalize(p).startsWith(prefix)))), matchedPaths: [...new Set(matches)].sort(), taskMatch };
}

function validateToolset(root) {
  const bundle = readJson(root, BUNDLE);
  if (bundle.status !== 'ACTIVE_VERSION_BOUND') throw new Error(`TOOLSET_NOT_ACTIVE:${bundle.status}`);
  const locator = bundle.locator;
  const registry = bundle.instrumentRegistry;
  const gates = bundle.phaseGates;
  const scoring = bundle.scoringModel;
  const standard = bundle.universalStandard;
  if (locator.status !== 'ACTIVE_VERSION_BOUND' || locator.version !== bundle.version) throw new Error('LOCATOR_VERSION_BINDING_MISMATCH');
  if (registry.status !== 'ACTIVE_VERSION_BOUND' || registry.toolsetVersion !== bundle.version) throw new Error('TOOLSET_VERSION_BINDING_MISMATCH');
  if (!registry.closedWorld || registry.instruments.length !== registry.requiredInstrumentCount || registry.requiredInstrumentCount !== 8) throw new Error('TOOLSET_NOT_CLOSED_WORLD');
  for (const instrument of registry.instruments) {
    if (instrument.status !== 'ACTIVE_VERSION_BOUND') throw new Error(`INSTRUMENT_NOT_ACTIVE:${instrument.id}`);
    if (instrument.version !== bundle.version) throw new Error(`INSTRUMENT_VERSION_MISMATCH:${instrument.id}`);
    if (!instrument.thresholdsRef) throw new Error(`MISSING_REQUIRED_THRESHOLDS:${instrument.id}`);
  }
  if (scoring.status !== 'FROZEN_BEFORE_EVALUATION') throw new Error('SCORING_MODD_NOT_FROZEN');
  return { bundle, locator, registry, gates, scoring, standard };
}

function validateBundle(root, filePath, subjectHead, phase, toolset) {
  if (!filePath) throw new Error('MISSING_A_VALID_RECEIPT');
  const absolute = path.resolve(root, filePath);
  if (!fs.existsSync(absolute)) throw new Error(`MISSING_A_VALID_RECEIPT:${filePath}`);
  const text = fs.readFileSync(absolute, 'utf8');
  const bundle = JSON.parse(text);
  if (bundle.schema !== 'MANDATORY_PAGE_PHASE_RECEIPT_BUNDLE_v1') throw new Error('INVALID_RECEIPT_SCHEMA');
  if (bundle.toolsetId !== toolset.locator.toolsetId || bundle.toolsetVersion !== toolset.locator.version) throw new Error('RECEIPT_TOOLSET_VERSION_MISMATCH');
  if (subjectHead && bundle.subjectHead !== subjectHead) throw new Error('RECEIPT_SUBJECT_HEAD_MISMATCH');
  const gate = toolset.gates.gates[phase];
  if (!gate) throw new Error(`UNKNOWN_PAGE_PHASE:${phase}`);
  const byPhase = new Map(bundle.phaseReceipts.map(receipt => [receipt.phase, receipt]));
  for (const required of gate.requiredReceiptPhases) {
    const receipt = byPhase.get(required);
    if (!receipt) throw new Error(`MISSING_PHASE_RECEIPT:${required}`);
    if (!toolset.gates.allowedReceiptResults.includes(receipt.result)) throw new Error(`PHASE_RECEIPT_NOT_PASSING:${required}:${receipt.result}`);
    if (!receipt.receiptDigest || receipt.receiptDigest.length < 16) throw new Error(`INVALID_PHASE_RECEIPT_DIGEST":${required}`);
  }
  return { bundleDigest: sha256(text), receiptPhases: gate.requiredReceiptPhases };
}

function runSelfTest(root) {
  const toolset = validateToolset(root);
  const standard = toolset.standard;
  const cases = [
    { paths: ['laws/research/methods-and-models/index.html'], task: 'update page', expected: true },
    { paths: ['showroom/globe/h-earth/render.js'], task: 'interface work', expected: true },
    { paths: ['control-plane/page-excellence-toolchain/test.json'], task: 'page tool self test', expected: false },
    { paths: ['README.md'], task: 'documentation correction', expected: false }
  ];
  const results = cases.map(test => ({ ...test, actual: pageClassification(test.paths, test.task, standard).isPageOperation }));
  const pass = results.every(result => result.actual === result.expected);
  return { schema: 'MANDATORY_PAGE_OPERATION_GATE_SELF_TEST_v1', result: pass ? 'PASS' : 'FAIL', toolsetVersion: toolset.locator.version, instrumentCount: toolset.registry.instruments.length, cases: results };
}

const args = parseArgs(process.argv.slice(2));
const root = discoverRoot(process.cwd());
try {
  if (args.selfTest) {
    const result = runSelfTest(root);
    process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
    process.exit(result.result === 'PASS' ? 0 : 1);
  }
  if (args.pathsFile) args.paths.push(...fs.readFileSync(path.resolve(args.pathsFile), 'utf8').split(/\r?\n/).filter(Boolean));
  if (!args.paths.length) die('NO_PATHS_SUPPLIED');
  const toolset = validateToolset(root);
  const standard = toolset.standard;
  const classification = pageClassification(args.paths, args.task, standard);
  let mandatoryReceipt = null;
  if (args.mutationIntent && classification.isPageOperation) {
    if (!args.pagePhase) throw new Error('NO_MANDATORY_TOOLSET_ROUTE');
    const subjectHead = process.env.PAGE_OPERATION_SUBJECT_HEAD || '';
    mandatoryReceipt = validateBundle(root, args.receiptBundle, subjectHead, args.pagePhase, toolset);
  }
  const delegated = spawnSync(process.execPath, [path.join(root, ROUTER), ...args.delegateArgs], { cwd: root, encoding: 'utf8', env: process.env });
  const gateReceipt = {
    schema: 'MANDATORY_PAGE_OPERATION_GATE_RECEIPT_v1', result: delegated.status === 0 ? 'PASS' : 'BLOCK',
    toolsetId: toolset.locator.toolsetId, toolsetVersion: toolset.locator.version,
    pageOperation: classification.isPageOperation, matchedPaths: classification.matchedPaths,
    phase: classification.isPageOperation ? args.pagePhase : null,
    mandatoryReceipt,
    delegatedRouterStatus: delegated.status,
    delegatedRouterReceipt: delegated.stdout ? JSON.parse(delegated.stdout) : null,
    errors: delegated.stderr ? [delegated.stderr.trim()] : []
  };
  process.stdout.write(`${JSON.stringify(gateReceipt, null, 2)}\n`);
  process.exit(delegated.status ?? 1);
} catch (error) {
  die(error instanceof Error ? error.message : String(error), 1, { pagePhase: args.pagePhase, paths: args.paths });
}
