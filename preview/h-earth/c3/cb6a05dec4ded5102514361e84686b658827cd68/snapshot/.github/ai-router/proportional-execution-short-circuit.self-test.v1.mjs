#!/usr/bin/env node
import fs from 'node:fs';
const router = fs.readFileSync(new URL('../../tools/repository-ai-entry-router.mjs', import.meta.url), 'utf8');
const policy = JSON.parse(fs.readFileSync(new URL('./proportional-execution-short-circuit.v1.json', import.meta.url), 'utf8'));
const checks = [
  ['micro route excludes transport gate', router.includes("? ['PROJECT_ROUTE', 'EXACT_DIFF', 'STATIC_EDITORIAL_VERIFIER']")],
  ['packet compiler not applicable', policy.staticEditorialMicro.canonicalPacketCompiler === 'NOT_APPLICABLE'],
  ['canonical intake not applicable', policy.staticEditorialMicro.canonicalIntake === 'NOT_APPLICABLE'],
  ['resume reconstruction not applicable', policy.staticEditorialMicro.resumeReconstruction === 'NOT_APPLICABLE'],
  ['page excellence not applicable', policy.staticEditorialMicro.pageExcellence === 'NOT_APPLICABLE'],
  ['transport internal non-gating', policy.transportExecutionPolicy.role === 'INTERNAL_NON_GATING_EXECUTION_MECHANICS'],
  ['fallback preserved', policy.transportExecutionPolicy.preferredSurfaceIncapableDisposition === 'TRY_NEXT_ALREADY_AUTHORIZED_SURFACE_WITHOUT_SCOPE_OR_AUTHORITY_CHANGE'],
  ['transport cannot create product failure', policy.transportExecutionPolicy.executionTransportFailureMayManufactureProductFailure === false],
  ['transport cannot create generation/readmission', policy.transportExecutionPolicy.mayCreateSuccessorGeneration === false && policy.transportExecutionPolicy.mayRequireReadmissionSolelyForTransportFailure === false]
];
const failed = checks.filter(([, pass]) => !pass).map(([name]) => name);
process.stdout.write(`${JSON.stringify({schema:'PROPORTIONAL_EXECUTION_SHORT_CIRCUIT_SELF_TEST_v1',result:failed.length?'FAIL':'PASS_CLOSED',checks:checks.map(([name,pass])=>({name,pass})),failed},null,2)}\n`);
process.exit(failed.length ? 1 : 0);
