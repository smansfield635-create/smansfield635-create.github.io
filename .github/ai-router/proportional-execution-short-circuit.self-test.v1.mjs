#!/usr/bin/env node
import fs from 'node:fs';

const router = fs.readFileSync(new URL('../../tools/repository-ai-entry-router.mjs', import.meta.url), 'utf8');
const policy = JSON.parse(fs.readFileSync(new URL('./proportional-execution-short-circuit.v1.json', import.meta.url), 'utf8'));
const checks = [
  ['micro route excludes transport gate', router.includes("? ['PROJECT_ROUTE', 'EXACT_DIFF', 'STATIC_EDITORIAL_VERIFIER']")],
  ['micro route excludes canonical intake', !router.includes("? ['CANONICAL_INTAKE', 'PROJECT_ROUTE', 'EXACT_DIFF', 'STATIC_EDITORIAL_VERIFIER']")],
  ['packet compiler explicitly not applicable', policy.staticEditorialMicro.canonicalPacketCompiler === 'NOT_APPLICABLE'],
  ['resume reconstruction explicitly not applicable', policy.staticEditorialMicro.resumeReconstruction === 'NOT_APPLICABLE'],
  ['page excellence explicitly not applicable', policy.staticEditorialMicro.pageExcellence === 'NOT_APPLICABLE'],
  ['transport is internal non-gating mechanics', policy.transportExecutionPolicy.role === 'INTERNAL_NON_GATING_EXECUTION_MECHANICS'],
  ['writer fallback preserved', policy.transportExecutionPolicy.preferredSurfaceIncapableDisposition === 'TRY_NEXT_ALREADY_AUTHORIZED_SURFACE_WITHOUT_SCOPE_OR_AUTHORITY_CHANGE'],
  ['whole-file replacement preserved', policy.transportExecutionPolicy.wholeFileReplacementAllowedWhenExactCompleteMaterializationIsSafe === true && policy.transportExecutionPolicy.patchPrimitiveRequired === false],
  ['transport failure cannot create product failure', policy.transportExecutionPolicy.executionTransportFailureMayManufactureProductFailure === false],
  ['transport failure cannot create generation or readmission', policy.transportExecutionPolicy.mayCreateSuccessorGeneration === false && policy.transportExecutionPolicy.mayRequireReadmissionSolelyForTransportFailure === false],
  ['escalation short-circuit frozen', policy.escalationLaw.includes('DO_NOT_ENTER_UNSELECTED_GOVERNANCE_OR_DISCOVERY_MECHANISMS')]
];
const failed = checks.filter(([, pass]) => !pass).map(([name]) => name);
const receipt = { schema: 'PROPORTIONAL_EXECUTION_SHORT_CIRCUIT_SELF_TEST_v1', result: failed.length ? 'FAIL' : 'PASS_CLOSED', checks: checks.map(([name, pass]) => ({name, pass})), failed };
process.stdout.write(`${JSON.stringify(receipt, null, 2)}\n`);
process.exit(failed.length ? 1 : 0);
