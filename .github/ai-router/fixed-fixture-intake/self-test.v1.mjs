#!/usr/bin/env node
import { loadClosedWorldRegistry, selectFixture } from './dispatcher.v1.mjs';

const registry = loadClosedWorldRegistry();
const p1 = 'P1_PROJECT_CONTINUATION_PUBLIC_TOPOLOGY_RETIREMENT_V1';
const p2 = 'P2_PAGE_EXCELLENCE_PUBLIC_CONSUMER_CUT_A_V1';
const checks = [];
const ok = (id, value) => { if (!value) throw new Error(`CHECK_FAILED:${id}`); checks.push(id); };
const rejects = (id, fn, code) => { try { fn(); throw new Error(`NEGATIVE_ACCEPTED:${id}`); } catch (e) { if (e.message === `NEGATIVE_ACCEPTED:${id}`) throw e; ok(id, e.code === code); } };

const selectedP1 = selectFixture({registry, fixtureId:p1, action:'ADMIT'});
ok('POS_001_P1_SELECTION_SCHEMA', selectedP1.schema === 'FIXED_FIXTURE_INTAKE_SELECTION_RECEIPT_v1');
ok('POS_002_P1_EXACT_HEAD', selectedP1.exactGoverningHead === 'e0c69d3f2581b0917dab882f5750a45403a523b9');
ok('POS_003_P1_NINE_PATH_SCOPE', selectedP1.bridgeRequest.operationRequest.allowedPaths.length === 9);

const selectedP2 = selectFixture({registry, fixtureId:p2, action:'ADMIT'});
ok('POS_004_P2_SELECTION_RESULT', selectedP2.result === 'FIXTURE_SELECTED_FAIL_CLOSED');
ok('POS_005_P2_EXACT_HEAD', selectedP2.exactGoverningHead === '3684c3fecf47d1ee4213a9c636cfa15606087cb5');
ok('POS_006_P2_FIVE_PATH_SCOPE', selectedP2.bridgeRequest.operationRequest.allowedPaths.length === 5 && selectedP2.bridgeRequest.constructionProcedure.exactAllowedRepositoryPaths.length === 5);
ok('POS_007_P2_SCOPE_EQUALITY', JSON.stringify(selectedP2.bridgeRequest.operationRequest.allowedPaths) === JSON.stringify(selectedP2.bridgeRequest.constructionProcedure.exactAllowedRepositoryPaths));
ok('POS_008_NO_ARBITRARY_PAYLOAD', selectedP2.arbitraryPayloadAccepted === false);
ok('POS_009_NO_AUTHORITY_CREATED', selectedP2.authorityCreated === false && selectedP2.repositoryMutationPerformed === false);
ok('POS_010_P2_PRODUCT_AUTHORITY_FALSE', selectedP2.bridgeRequest.operationRequest.requestingAuthority.productAuthority === false);
ok('POS_011_HISTORICAL_BRIDGE_IDENTITY_NOT_LIVE', !Object.hasOwn(selectedP2, 'bridgeImplementationHead'));
rejects('NEG_001_UNKNOWN_FIXTURE', () => selectFixture({registry, fixtureId:'UNKNOWN_FIXTURE_V1', action:'ADMIT'}), 'FIXTURE_NOT_REGISTERED');
rejects('NEG_002_WRONG_ACTION', () => selectFixture({registry, fixtureId:p2, action:'EXECUTE'}), 'ACTION_NOT_ALLOWED');
rejects('NEG_003_HEAD_BINDING', () => { const x=structuredClone(registry); x.fixtures[p2].bridgeRequest.exactGoverningHead='1111111111111111111111111111111111111111'; selectFixture({registry:x, fixtureId:p2, action:'ADMIT'}); }, 'FIXTURE_HEAD_BINDING_MISMATCH');
rejects('NEG_004_REPOSITORY_SUBSTITUTION', () => { const x=structuredClone(registry); x.fixtures[p2].bridgeRequest.repository='example/other'; selectFixture({registry:x, fixtureId:p2, action:'ADMIT'}); }, 'REPOSITORY_SUBSTITUTION_PROHIBITED');
ok('NEG_005_EXTERNAL_INPUT_CANNOT_ADD_FIXTURE', !Object.hasOwn(registry.fixtures,'CALLER_SUPPLIED_FIXTURE'));

const receipt = {schema:'FIXED_FIXTURE_INTAKE_SELF_TEST_RECEIPT_v2', result:'PASS_CLOSED', checkCount:checks.length, checks, fixtureIds:[p1,p2], externalInputSurface:['fixtureId','action'], arbitraryPayloadAccepted:false, historicalBridgeIdentityRequired:false, canonicalGateModified:false};
process.stdout.write(JSON.stringify(receipt, null, 2) + '\n');
