#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const REGISTRY_PATH = '.github/ai-router/fixed-fixture-intake/registry.v1.json';
const ALLOWED_ACTION = 'ADMIT';
const fail = (code, detail = null) => { const e = new Error(code); e.code = code; e.detail = detail; throw e; };
const stable = value => Array.isArray(value) ? value.map(stable) : value && typeof value === 'object' ? Object.fromEntries(Object.keys(value).sort().map(k => [k, stable(value[k])])) : value;
const text = value => JSON.stringify(stable(value), null, 2) + '\n';

function parseArgs(argv) {
  const out = {};
  for (let i = 0; i < argv.length; i += 2) {
    const key = argv[i], value = argv[i + 1];
    if (!['--fixture-id','--action','--output'].includes(key) || value === undefined) fail('CLI_ARGUMENTS_NOT_FIXED', key);
    out[key.slice(2)] = value;
  }
  if (Object.keys(out).length !== 3 || !out['fixture-id'] || !out.action || !out.output) fail('CLI_ARGUMENTS_INCOMPLETE');
  return out;
}

function root() { return path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../..'); }
function runtimeOutput(value) {
  const base = path.resolve(process.env.RUNNER_TEMP || '/tmp');
  const resolved = path.resolve(value);
  if (!(resolved === base || resolved.startsWith(base + path.sep))) fail('OUTPUT_OUTSIDE_RUNTIME_TEMP');
  return resolved;
}

export function selectFixture({registry, fixtureId, action}) {
  if (!registry || registry.schema !== 'FIXED_FIXTURE_INTAKE_REGISTRY_v1' || registry.closedWorld !== true || registry.arbitraryPayloadAccepted !== false) fail('REGISTRY_IDENTITY_INVALID');
  if (action !== ALLOWED_ACTION) fail('ACTION_NOT_ALLOWED', action);
  if (!/^[A-Z0-9][A-Z0-9_.:-]{2,127}$/.test(fixtureId)) fail('FIXTURE_ID_INVALID');
  const fixture = registry.fixtures?.[fixtureId];
  if (!fixture) fail('FIXTURE_NOT_REGISTERED', fixtureId);
  if (fixture.fixtureId !== fixtureId || fixture.action !== action) fail('FIXTURE_BINDING_MISMATCH');
  if (!/^[0-9a-f]{40}$/.test(fixture.exactGoverningHead ?? '')) fail('FIXTURE_GOVERNING_HEAD_INVALID');
  if (!/^[0-9a-f]{40}$/.test(fixture.bridgeImplementationHead ?? '')) fail('BRIDGE_IMPLEMENTATION_HEAD_INVALID');
  const request = fixture.bridgeRequest;
  if (!request || request.schema !== 'PRE_REGISTRATION_INTAKE_BRIDGE_REQUEST_v1') fail('BRIDGE_REQUEST_SCHEMA_INVALID');
  if (request.exactGoverningHead !== fixture.exactGoverningHead || request.operationRequest?.exactGoverningHead !== fixture.exactGoverningHead || request.constructionProcedure?.exactGoverningHead !== fixture.exactGoverningHead) fail('FIXTURE_HEAD_BINDING_MISMATCH');
  if (request.repository !== 'smansfield635-create/smansfield635-create.github.io') fail('REPOSITORY_SUBSTITUTION_PROHIBITED');
  return stable({
    schema: 'FIXED_FIXTURE_INTAKE_SELECTION_RECEIPT_v1',
    result: 'FIXTURE_SELECTED_FAIL_CLOSED',
    fixtureId,
    action,
    exactGoverningHead: fixture.exactGoverningHead,
    bridgeImplementationHead: fixture.bridgeImplementationHead,
    bridgeRequest: request,
    arbitraryPayloadAccepted: false,
    authorityCreated: false,
    repositoryMutationPerformed: false
  });
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const registry = JSON.parse(fs.readFileSync(path.join(root(), REGISTRY_PATH), 'utf8'));
  const receipt = selectFixture({registry, fixtureId: args['fixture-id'], action: args.action});
  const output = runtimeOutput(args.output);
  fs.mkdirSync(path.dirname(output), {recursive: true});
  fs.writeFileSync(output, text(receipt));
}

const invoked = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (invoked) main().catch(error => {
  process.stderr.write(text({schema:'FIXED_FIXTURE_INTAKE_DISPATCH_FAILURE_v1', result:'FAIL_CLOSED', errorCode:error.code ?? 'UNEXPECTED_ERROR', detail:error.detail ?? error.message}));
  process.exitCode = 1;
});
