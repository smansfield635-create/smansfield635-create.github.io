import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (relativePath) => fs.readFileSync(path.join(repoRoot, relativePath), 'utf8');
const digest = (value) => crypto.createHash('sha256').update(value, 'utf8').digest('hex');

const contractPath = 'h-earth-3d/registry/h-earth.repository-registry.tool-instruction.json';
const detailedPath = 'h-earth-3d/registry/H_EARTH_REPOSITORY_REGISTRY_GITHUB_TOOL_INSTRUCTION_v1.md';
const githubPath = 'h-earth-3d/registry/h-earth.repository-registry.github-instruction.md';
const hEarthAgentsPath = 'h-earth-3d/AGENTS.md';
const showroomAgentsPath = 'showroom/globe/h-earth/AGENTS.md';
const bootstrapPath = 'h-earth-3d/registry/h-earth.repository-registry.bootstrap.json';

const contractText = read(contractPath);
const contract = JSON.parse(contractText);
const detailed = read(detailedPath);
const githubInstruction = read(githubPath);
const hEarthAgents = read(hEarthAgentsPath);
const showroomAgents = read(showroomAgentsPath);
const bootstrap = JSON.parse(read(bootstrapPath));

const exactConsumers = [
  'GITHUB_CONNECTED_AGENTS',
  'REPOSITORY_SEARCH_TOOLS',
  'CODE_REVIEW_TOOLS',
  'PACKAGE_AWARE_VALIDATORS',
  'WORKFLOW_ENFORCEMENT',
  'AUDIT_AND_RECEIPT_GENERATORS'
];

const checks = {
  targetIdentity: contract.instructionId === 'H_EARTH_REPOSITORY_REGISTRY_GITHUB_TOOL_INSTRUCTION_v1' && contract.targetNumber === 3,
  candidateStatusPreserved: contract.status === 'COMPLETE_CANDIDATE_NOT_ACCEPTED' && contract.accepted === false && contract.canonical === false,
  exactRegistryIdentity: contract.sourceRegistry.registryId === 'H_EARTH_REPOSITORY_REGISTRY_CANDIDATE_v1' && contract.sourceRegistry.registryVersion === '1.0.0-candidate.1',
  exactCandidateIdentity: contract.sourceRegistry.candidateByteCount === 140320 && contract.sourceRegistry.candidateContentSha256 === '5c71aba5ff60f7d8838fa4571ec18e72eafe04f01130ad146de4376279735dfe' && contract.sourceRegistry.candidateGitBlobSha === '10ab7b203e03fde419e526d0cce2c0af42860911',
  consumerCoverage: JSON.stringify(contract.consumerClasses) === JSON.stringify(exactConsumers),
  precedencePresent: Array.isArray(contract.precedence) && contract.precedence.length === 5 && contract.precedence.at(-1) === 'TOOL_INFERENCE',
  sevenPreflightSteps: contract.preflightSteps.length === 7,
  eightOperatingRules: contract.operatingRules.length === 8,
  sixReportingDuties: contract.reportingDuties.length === 6,
  failureTaxonomyPresent: contract.failureTaxonomy.length >= 10,
  kernelCardinalsExact: JSON.stringify(contract.cardinalStructure.explicitKernelSequence) === JSON.stringify(['NORTH', 'EAST', 'SOUTH', 'WEST']),
  facadeDoesNotOwnAuthority: contract.cardinalStructure.publicFacadeOwnsMemberAuthority === false,
  compositeDoesNotOwnAuthority: contract.cardinalStructure.compositeOwnsMemberAuthority === false,
  gateBRemainsCandidate: contract.cardinalStructure.gateBCardinalStatus === 'OBSERVED_CANDIDATE_NONCANONICAL',
  readOnlyOnly: contract.operationDecision.readOnlyDiscoveryAndAnalysisPermitted === true && contract.operationDecision.mutationAuthorizedByInstruction === false && contract.operationDecision.mergeAuthorizedByInstruction === false,
  targetFourPreserved: contract.boundaries.targetFourStillRequired === true && contract.boundaries.validatorInstalled === false && contract.boundaries.workflowEnforcementInstalled === false,
  detailedInstructionComplete: detailed.includes('Mandatory preflight') && detailed.includes('Gate B West adapter remains orchestration only') && detailed.includes('Target 4 remains required'),
  githubInstructionSurfacePresent: githubInstruction.startsWith('# H-Earth GitHub instruction surface') && githubInstruction.includes('GitHub-connected tools'),
  githubInstructionBounded: Buffer.byteLength(githubInstruction, 'utf8') < 4000 && githubInstruction.includes('grants no mutation, merge, canonicalization, workflow, runtime, renderer, deployment, or production authority'),
  scopedAgentEntrypoints: hEarthAgents.includes('load `registry/h-earth.repository-registry.bootstrap.json` first') && showroomAgents.includes('Gate B West adapter is orchestration only'),
  bootstrapRegistersTarget3: bootstrap.toolInstruction?.instructionId === contract.instructionId && bootstrap.toolInstruction?.contractPath === '/h-earth-3d/registry/h-earth.repository-registry.tool-instruction.json',
  bootstrapRemainsCandidate: bootstrap.accepted === false && bootstrap.canonical === false && bootstrap.controlsRepositoryScope === false,
  noAuthorityOverreach: Object.entries(contract.boundaries).filter(([key]) => key !== 'targetFourStillRequired').every(([, value]) => value === false),
  deterministicSurfaces: Object.values(contract.instructionSurfaces).flat().every((value) => typeof value === 'string' && value.startsWith('/'))
};

const failedChecks = Object.entries(checks).filter(([, value]) => value !== true).map(([key]) => key);
const receipt = {
  auditId: 'H_EARTH_REPOSITORY_REGISTRY_TARGET_3_INSTRUCTION_AUDIT_v1',
  result: failedChecks.length === 0 ? 'PASS' : 'FAIL',
  checks,
  totalChecks: Object.keys(checks).length,
  passedChecks: Object.keys(checks).length - failedChecks.length,
  failedChecks,
  instructionIdentity: {
    instructionId: contract.instructionId,
    instructionVersion: contract.instructionVersion,
    status: contract.status,
    accepted: contract.accepted,
    canonical: contract.canonical
  },
  contractCounts: {
    consumerClasses: contract.consumerClasses.length,
    precedenceEntries: contract.precedence.length,
    preflightSteps: contract.preflightSteps.length,
    operatingRules: contract.operatingRules.length,
    reportingDuties: contract.reportingDuties.length,
    failureCodes: contract.failureTaxonomy.length
  },
  digests: {
    machineContractSha256: digest(contractText),
    detailedInstructionSha256: digest(detailed),
    githubInstructionSha256: digest(githubInstruction),
    hEarthAgentsSha256: digest(hEarthAgents),
    showroomAgentsSha256: digest(showroomAgents)
  },
  boundaries: contract.boundaries
};

assert.deepEqual(failedChecks, []);
process.stdout.write(`${JSON.stringify(receipt, null, 2)}\n`);
