#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { selectFixture } from './dispatcher.v1.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../..');
const registry = JSON.parse(fs.readFileSync(path.join(root, '.github/ai-router/fixed-fixture-intake/registry.v1.json'), 'utf8'));
const fixtureId = 'P1_PROJECT_CONTINUATION_PUBLIC_TOPOLOGY_RETIREMENT_V1';
const checks = [];
const ok = (id, value) => { if (!value) throw new Error(`CHECK_FAILED:${id}`); checks.push(id); };
const rejects = (id, fn, code) => { try { fn(); throw new Error(`NEGATIVE_ACCEPTED:${id}`); } catch (e) { if (e.message === `NEGATIVE_ACCEPTED:${id}`) throw e; ok(id, e.code === code); } };

const selected = selectFixture({registry, fixtureId, action:'ADMIT'});
ok('POS_001_SELECTION_SCHEMA', selected.schema === 'FIXED_FIXTURE_INTAKE_SELECTION_RECEIPT_v1');
ok('POS_002_SELECTION_RESULT', selected.result === 'FIXTURE_SELECTED_FAIL_CLOSED');
ok('POS_003_EXACT_HEAD', selected.exactGoverningHead === 'e0c69d3f2581b0917dab882f5750a45403a523b9');
ok('POS_004_BRIDGE_HEAD', selected.bridgeImplementationHead === '9c3daa91a3624632a488853d029dabb25c5ce048');
ok('POS_005_NINE_PATH_SCOPE', selected.bridgeRequest.operationRequest.allowedPaths.length === 9 && selected.bridgeRequest.constructionProcedure.exactAllowedRepositoryPaths.length === 9);
ok('POS_006_SCOPE_EQUALITY', JSON.stringify(selected.bridgeRequest.operationRequest.allowedPaths) === JSON.stringify(selected.bridgeRequest.constructionProcedure.exactAllowedRepositoryPaths));
ok('POS_007_NO_ARBITRARY_PAYLOAD', selected.arbitraryPayloadAccepted === false);
ok('POS_008_NO_AUTHORITY_CREATED', selected.authorityCreated === false && selected.repositoryMutationPerformed === false);
rejects('NEG_001_UNKNOWN_FIXTURE', () => selectFixture({registry, fixtureId:'UNKNOWN_FIXTURE_V1', action:'ADMIT'}), 'FIXTURE_NOT_REGISTERED');
rejects('NEG_002_WRONG_ACTION', () => selectFixture({registry, fixtureId, action:'EXECUTE'}), 'ACTION_NOT_ALLOWED');
const widened = structuredClone(registry); widened.fixtures[fixtureId].bridgeRequest.operationRequest.allowedPaths.push('laws/');
rejects('NEG_003_HEAD_BINDING', () => { const x=structuredClone(registry); x.fixtures[fixtureId].bridgeRequest.exactGoverningHead='1111111111111111111111111111111111111111'; selectFixture({registry:x, fixtureId, action:'ADMIT'}); }, 'FIXTURE_HEAD_BINDING_MISMATCH');
rejects('NEG_004_REPOSITORY_SUBSTITUTION', () => { const x=structuredClone(registry); x.fixtures[fixtureId].bridgeRequest.repository='example/other'; selectFixture({registry:x, fixtureId, action:'ADMIT'}); }, 'REPOSITORY_SUBSTITUTION_PROHIBITED');
ok('NEG_005_WIDENING_NOT_FROM_EXTERNAL_INPUT', widened.fixtures[fixtureId].bridgeRequest.operationRequest.allowedPaths.length === 10 && selected.bridgeRequest.operationRequest.allowedPaths.length === 9);

const receipt = {schema:'FIXED_FIXTURE_INTAKE_SELF_TEST_RECEIPT_v1', result:'PASS_CLOSED', checkCount:checks.length, checks, fixtureId, externalInputSurface:['fixtureId','action'], arbitraryPayloadAccepted:false, canonicalGateModified:false};
process.stdout.write(JSON.stringify(receipt, null, 2) + '\n');
