#!/usr/bin/env node
import cp from 'node:child_process';
import crypto from 'node:crypto';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const OPERATION_ID = 'AUDRALIA_WEATHER_POPULATION_SECOND_FAILING_CORPUS_20260827_001_SUCCESSOR_001';
export const EXACT_TARGET_HEAD = '41a63ace8b540f2b3ce7f73b6395f90234c7dc3f';
export const NODE_VERSION = '22.23.2';
export const PUPPETEER_CORE_VERSION = '24.15.0';
export const BROWSER_VERSION = '151.0.7922.34';
export const BROWSER_ARCHIVE_URL = `https://storage.googleapis.com/chrome-for-testing-public/${BROWSER_VERSION}/linux64/chrome-headless-shell-linux64.zip`;
export const BROWSER_ARCHIVE_SHA256 = '3cfc2bd00d1bafcf8a68dc74c9c92bb7150ddc8d26ade948a776316e1cec4f14';
export const PASS_SCHEMA = 'THREE_TIER_CODESPACE_ENVIRONMENT_RECEIPT_v1';
export const PASS_RESULT = 'PASS_ENVIRONMENT_READY';

function fail(code, detail = null) {
  const error = new Error(`${code}${detail ? `:${detail}` : ''}`);
  Object.assign(error, { code, detail });
  throw error;
}

export function parseArgs(argv) {
  const out = {};
  for (let i = 0; i < argv.length; i += 2) {
    const key = argv[i];
    const value = argv[i + 1];
    if (!key?.startsWith('--') || value == null) fail('INVALID_ARGUMENTS', key ?? 'EOF');
    out[key.slice(2)] = value;
  }
  return out;
}

function run(command, args, options = {}) {
  const result = cp.spawnSync(command, args, {
    cwd: options.cwd,
    env: options.env ?? process.env,
    encoding: 'utf8',
    timeout: options.timeout ?? 300_000,
    maxBuffer: 32 * 1024 * 1024
  });
  return {
    status: result.status ?? 1,
    stdout: result.stdout ?? '',
    stderr: result.stderr ?? '',
    error: result.error?.message ?? null,
    signal: result.signal ?? null
  };
}

function requirePass(result, code) {
  if (result.status !== 0) {
    const detail = (result.stderr || result.stdout || result.error || `status=${result.status}`).trim().split(/\r?\n/).at(-1);
    fail(code, detail?.slice(0, 500) || null);
  }
  return result.stdout.trim();
}

function writeJson(file, value) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`);
}

function isOutside(root, candidate) {
  const relative = path.relative(path.resolve(root), path.resolve(candidate));
  return relative !== '' && relative !== '..' && !relative.startsWith(`..${path.sep}`) ? false : relative !== '';
}

export function sha256File(file) {
  const hash = crypto.createHash('sha256');
  hash.update(fs.readFileSync(file));
  return hash.digest('hex');
}

function sha256Text(value) {
  return crypto.createHash('sha256').update(value).digest('hex');
}

function commandVersion(command, args = ['--version']) {
  return requirePass(run(command, args, { timeout: 30_000 }), `COMMAND_UNAVAILABLE_${path.basename(command).toUpperCase().replaceAll('-', '_')}`);
}

function materializeExactRepository(root, exactTargetHead) {
  const repositoryTop = requirePass(run('git', ['rev-parse', '--show-toplevel'], { cwd: root }), 'REPOSITORY_NOT_MATERIALIZED');
  if (path.resolve(repositoryTop) !== root) fail('REPOSITORY_ROOT_MISMATCH', repositoryTop);

  if (requirePass(run('git', ['rev-parse', '--is-shallow-repository'], { cwd: root }), 'GIT_HISTORY_STATE_UNAVAILABLE') === 'true') {
    requirePass(run('git', ['fetch', '--unshallow', '--filter=blob:none', '--no-tags', 'origin'], { cwd: root, timeout: 600_000 }), 'FULL_HISTORY_MATERIALIZATION_FAILED');
  }

  let target = run('git', ['cat-file', '-e', `${exactTargetHead}^{commit}`], { cwd: root, timeout: 30_000 });
  if (target.status !== 0) {
    requirePass(run('git', ['fetch', '--filter=blob:none', '--no-tags', 'origin', exactTargetHead], { cwd: root, timeout: 300_000 }), 'EXACT_TARGET_MATERIALIZATION_FAILED');
    target = run('git', ['cat-file', '-e', `${exactTargetHead}^{commit}`], { cwd: root, timeout: 30_000 });
  }
  requirePass(target, 'EXACT_TARGET_OBJECT_UNAVAILABLE');

  const worktree = requirePass(run('git', ['status', '--porcelain=v1'], { cwd: root }), 'WORKTREE_STATE_UNAVAILABLE');
  if (worktree !== '') fail('WORKTREE_NOT_CLEAN', worktree.split(/\r?\n/)[0]);
  return {
    repositoryHead: requirePass(run('git', ['rev-parse', 'HEAD^{commit}'], { cwd: root }), 'REPOSITORY_HEAD_UNAVAILABLE'),
    exactTargetHead,
    fullHistory: requirePass(run('git', ['rev-parse', '--is-shallow-repository'], { cwd: root }), 'GIT_HISTORY_STATE_UNAVAILABLE') === 'false'
  };
}

function installNodeAndDependencies(installRoot) {
  const runtimeRoot = path.join(installRoot, 'node-runtime');
  const dependencyRoot = path.join(installRoot, 'dependency-probe');
  fs.rmSync(runtimeRoot, { recursive: true, force: true });
  fs.rmSync(dependencyRoot, { recursive: true, force: true });
  fs.mkdirSync(runtimeRoot, { recursive: true });
  fs.mkdirSync(dependencyRoot, { recursive: true });

  requirePass(run('npm', [
    'install', '--prefix', runtimeRoot, '--no-save', '--no-package-lock', '--no-audit', '--no-fund',
    `node@${NODE_VERSION}`
  ], { timeout: 300_000 }), 'NODE_RUNTIME_INSTALL_FAILED');
  const nodePath = path.join(runtimeRoot, 'node_modules', 'node', 'bin', 'node');
  const nodeVersion = commandVersion(nodePath);
  if (nodeVersion !== `v${NODE_VERSION}`) fail('NODE_VERSION_MISMATCH', nodeVersion);

  requirePass(run('npm', [
    'install', '--prefix', dependencyRoot, '--no-save', '--no-package-lock', '--no-audit', '--no-fund',
    `puppeteer-core@${PUPPETEER_CORE_VERSION}`
  ], { timeout: 300_000 }), 'PUPPETEER_CORE_INSTALL_FAILED');
  const packageJsonPath = path.join(dependencyRoot, 'node_modules', 'puppeteer-core', 'package.json');
  const puppeteerVersion = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8')).version;
  if (puppeteerVersion !== PUPPETEER_CORE_VERSION) fail('PUPPETEER_CORE_VERSION_MISMATCH', puppeteerVersion);

  return { nodePath, nodeVersion, puppeteerVersion, dependencyRoot };
}

function installBrowser(installRoot, suppliedArchive = null) {
  const browserRoot = path.join(installRoot, 'browser');
  const extractRoot = path.join(browserRoot, 'extracted');
  const archive = path.join(browserRoot, `chrome-headless-shell-linux64-${BROWSER_VERSION}.zip`);
  fs.mkdirSync(browserRoot, { recursive: true });
  fs.rmSync(extractRoot, { recursive: true, force: true });

  if (suppliedArchive) {
    const source = path.resolve(suppliedArchive);
    if (!fs.existsSync(source)) fail('SUPPLIED_BROWSER_ARCHIVE_UNAVAILABLE', source);
    if (source !== archive) fs.copyFileSync(source, archive);
  } else if (!fs.existsSync(archive) || sha256File(archive) !== BROWSER_ARCHIVE_SHA256) {
    const partial = `${archive}.partial`;
    fs.rmSync(partial, { force: true });
    requirePass(run('curl', [
      '--fail', '--location', '--silent', '--show-error', '--retry', '3', '--retry-all-errors',
      '--output', partial, BROWSER_ARCHIVE_URL
    ], { timeout: 900_000 }), 'BROWSER_ARCHIVE_DOWNLOAD_FAILED');
    fs.renameSync(partial, archive);
  }

  const archiveSha256 = sha256File(archive);
  if (archiveSha256 !== BROWSER_ARCHIVE_SHA256) fail('BROWSER_ARTIFACT_DIGEST_MISMATCH', archiveSha256);
  fs.mkdirSync(extractRoot, { recursive: true });
  requirePass(run('python3', ['-m', 'zipfile', '-e', archive, extractRoot], { timeout: 300_000 }), 'BROWSER_ARCHIVE_EXTRACTION_FAILED');

  const browserPath = path.join(extractRoot, 'chrome-headless-shell-linux64', 'chrome-headless-shell');
  if (!fs.existsSync(browserPath)) fail('BROWSER_EXECUTABLE_MISSING', browserPath);
  fs.chmodSync(browserPath, 0o755);
  try { fs.accessSync(browserPath, fs.constants.X_OK); }
  catch { fail('EXECUTABLE_PERMISSION_FAILURE', browserPath); }

  const browserReportedVersion = commandVersion(browserPath);
  if (!browserReportedVersion.includes(BROWSER_VERSION)) fail('BROWSER_VERSION_MISMATCH', browserReportedVersion);
  const probe = run(browserPath, [
    '--headless=new', '--no-sandbox', '--disable-setuid-sandbox', '--ignore-gpu-blocklist',
    '--enable-webgl', '--use-gl=angle', '--use-angle=swiftshader', '--dump-dom', 'about:blank'
  ], { timeout: 60_000 });
  requirePass(probe, 'NATIVE_BROWSER_PROBE_FAILURE');
  if (!probe.stdout.includes('<html')) fail('NATIVE_BROWSER_PROBE_OUTPUT_MISSING');
  return { archive, archiveSha256, browserPath, browserReportedVersion };
}

function installCommandLinks(installRoot, nodePath, browserPath) {
  const bin = path.join(installRoot, 'bin');
  fs.mkdirSync(bin, { recursive: true });
  const links = {
    node: path.join(bin, 'node'),
    chrome: path.join(bin, 'google-chrome-stable')
  };
  for (const [link, target] of [[links.node, nodePath], [links.chrome, browserPath]]) {
    fs.rmSync(link, { force: true });
    fs.symlinkSync(target, link);
  }
  const nativeProbe = requirePass(run(links.node, ['-e', "process.stdout.write('COMMAND_EXECUTION_AVAILABLE')"], { timeout: 30_000 }), 'COMMAND_EXECUTION_UNAVAILABLE');
  if (nativeProbe !== 'COMMAND_EXECUTION_AVAILABLE') fail('COMMAND_EXECUTION_PROBE_MISMATCH', nativeProbe);
  return { ...links, bin };
}

export function validatePassReceipt(receipt) {
  const required = ['schema', 'environmentId', 'backendId', 'operationId', 'exactTargetHead', 'worktreeCleanBeforeExecution', 'runtime', 'result'];
  for (const key of required) if (!(key in receipt)) fail('RECEIPT_SCHEMA_FAILURE', `missing=${key}`);
  if (receipt.schema !== PASS_SCHEMA || receipt.result !== PASS_RESULT) fail('RECEIPT_SCHEMA_FAILURE', 'identity');
  if (receipt.worktreeCleanBeforeExecution !== true) fail('RECEIPT_SCHEMA_FAILURE', 'worktreeCleanBeforeExecution');
  if (!['LOCAL_CLEAN_GIT', 'CODESPACE_DISPOSABLE_EXECUTION'].includes(receipt.backendId)) fail('RECEIPT_SCHEMA_FAILURE', 'backendId');
  if (!/^[0-9a-f]{40}$/.test(receipt.exactTargetHead)) fail('RECEIPT_SCHEMA_FAILURE', 'exactTargetHead');
  const ready = receipt.runtime?.readyConditions;
  if (ready?.REPOSITORY_MATERIALIZED !== true || ready?.DEPENDENCIES_READY !== true || ready?.COMMAND_EXECUTION_AVAILABLE !== true) {
    fail('RECEIPT_SCHEMA_FAILURE', 'readyConditions');
  }
  if (receipt.runtime?.githubActionsUsedAsAgentExecutionTransport !== false) fail('RECEIPT_SCHEMA_FAILURE', 'githubActionsUsedAsAgentExecutionTransport');
  return true;
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const root = path.resolve(args['repository-root'] ?? process.cwd());
  const installRoot = path.resolve(args['install-root'] ?? '');
  const output = path.resolve(args.output ?? '');
  const operationId = args['operation-id'];
  const exactTargetHead = args['exact-target-head'];
  const backendId = args['backend-id'] ?? 'LOCAL_CLEAN_GIT';
  const environmentId = args['environment-id'] ?? `audralia-work-${sha256Text(`${os.hostname()}:${process.pid}:${Date.now()}`).slice(0, 16)}`;
  let cleanConfirmed = false;

  try {
    if (!args['install-root']) fail('INSTALL_ROOT_REQUIRED');
    if (!args.output) fail('OUTPUT_REQUIRED');
    if (!isOutside(root, installRoot)) fail('INSTALL_ROOT_MUST_BE_OUTSIDE_REPOSITORY');
    if (!isOutside(root, output)) fail('OUTPUT_MUST_BE_OUTSIDE_REPOSITORY');
    if (operationId !== OPERATION_ID) fail('OPERATION_ID_MISMATCH', operationId ?? 'missing');
    if (exactTargetHead !== EXACT_TARGET_HEAD) fail('EXACT_TARGET_HEAD_MISMATCH', exactTargetHead ?? 'missing');
    if (!['LOCAL_CLEAN_GIT', 'CODESPACE_DISPOSABLE_EXECUTION'].includes(backendId)) fail('BACKEND_ID_INVALID', backendId);

    const repository = materializeExactRepository(root, exactTargetHead);
    cleanConfirmed = true;
    fs.mkdirSync(installRoot, { recursive: true });
    const node = installNodeAndDependencies(installRoot);
    const browser = installBrowser(installRoot, args['browser-archive'] ?? null);
    const commands = installCommandLinks(installRoot, node.nodePath, browser.browserPath);
    const receipt = {
      schema: PASS_SCHEMA,
      environmentId,
      backendId,
      operationId,
      exactTargetHead,
      worktreeCleanBeforeExecution: true,
      runtime: {
        bootstrapScript: '.github/ai-router/codespace-execution/bootstrap-audralia-work-executor.v1.mjs',
        repository,
        node: { version: node.nodeVersion, path: node.nodePath },
        puppeteerCore: { version: node.puppeteerVersion, probeRoot: node.dependencyRoot },
        browser: {
          product: 'CHROMIUM_HEADLESS_SHELL_FOR_TESTING',
          version: BROWSER_VERSION,
          reportedVersion: browser.browserReportedVersion,
          archiveUrl: BROWSER_ARCHIVE_URL,
          archiveSha256: browser.archiveSha256,
          path: browser.browserPath,
          executableMode: '0755',
          commandAlias: commands.chrome
        },
        commands: {
          pathPrefix: commands.bin,
          node: commands.node,
          chrome: commands.chrome,
          activation: `export PATH=${JSON.stringify(commands.bin)}:$PATH`
        },
        readyConditions: {
          REPOSITORY_MATERIALIZED: true,
          DEPENDENCIES_READY: true,
          COMMAND_EXECUTION_AVAILABLE: true
        },
        githubActionsUsedAsAgentExecutionTransport: false
      },
      result: PASS_RESULT
    };
    validatePassReceipt(receipt);
    writeJson(output, receipt);
    process.stdout.write(`${JSON.stringify(receipt)}\n`);
  } catch (error) {
    const diagnostic = {
      schema: 'AUDRALIA_WORK_EXECUTOR_BOOTSTRAP_DIAGNOSTIC_v1',
      result: 'FAIL_CLOSED',
      operationId: operationId ?? null,
      exactTargetHead: exactTargetHead ?? null,
      worktreeCleanBeforeExecution: cleanConfirmed,
      errorCode: error.code ?? 'UNEXPECTED_ERROR',
      detail: error.detail ?? error.message,
      githubActionsUsedAsAgentExecutionTransport: false
    };
    if (args.output && isOutside(root, output)) writeJson(output, diagnostic);
    process.stderr.write(`${JSON.stringify(diagnostic)}\n`);
    process.exitCode = 1;
  }
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main();
