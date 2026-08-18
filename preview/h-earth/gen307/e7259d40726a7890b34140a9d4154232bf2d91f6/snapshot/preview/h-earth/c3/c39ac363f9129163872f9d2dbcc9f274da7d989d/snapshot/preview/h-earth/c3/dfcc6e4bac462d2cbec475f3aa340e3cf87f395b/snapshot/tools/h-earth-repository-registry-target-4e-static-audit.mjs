import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import {
  H_EARTH_AUTOMATIC_PREFLIGHT_ACTIVATION_ID,
  H_EARTH_AUTOMATIC_PREFLIGHT_SCOPE_ROOTS,
  classifyAutomaticHEarthPaths
} from '../h-earth-3d/registry/activation/h-earth.repository-registry.auto-preflight.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (relativePath) => fs.readFileSync(path.join(root, relativePath), 'utf8');
const readJson = (relativePath) => JSON.parse(read(relativePath));
const hashObject = (relativePath) => execFileSync('git', ['hash-object', relativePath], { cwd: root, encoding: 'utf8' }).trim();
const unique = (values) => new Set(values).size === values.length;

const identity = readJson('h-earth-3d/registry/activation/h-earth.repository-registry.target-4e.identity-boundary.json');
const deferral = readJson('h-earth-3d/registry/portability/h-earth.repository-registry.target-4d.deferral-and-critical-path-reclassification.json');
const contract = readJson('h-earth-3d/registry/activation/h-earth.repository-registry.automatic-preflight.contract.json');
const scenarios = readJson('h-earth-3d/registry/activation/h-earth.repository-registry.target-4e.scenarios.json');
const rootAgents = read('AGENTS.md');
const cli = read('tools/h-earth-repository-registry-auto-preflight.mjs');
const workflow = read('.github/workflows/h-earth-repository-registry-preflight.yml');

const knownClassification = classifyAutomaticHEarthPaths(['/showroom/globe/h-earth/render/geometry-kernel.north.js']);
const unknownClassification = classifyAutomaticHEarthPaths(['/showroom/globe/h-earth/render/new-unregistered-source.js']);
const outsideClassification = classifyAutomaticHEarthPaths(['/README.md']);
const forbiddenPromptTerms = ['registry', 'validator', 'bootstrap', 'preflight'];
const scenarioIds = scenarios.scenarios.map((scenario) => scenario.scenarioId);

export function runHEarthRepositoryRegistryTarget4EStaticAudit() {
  const checks = {
    identityExact: identity.activationId === H_EARTH_AUTOMATIC_PREFLIGHT_ACTIVATION_ID,
    identityCandidateOnly: identity.accepted === false && identity.canonical === false,
    allExternalToolsClaimWithheld: identity.boundaries.allExternalToolsAutomaticallyControlled === false,
    noMutationAuthorityInIdentity: identity.boundaries.mutationAuthorityCreated === false,
    target4DDeferralExact: deferral.reclassification.remainingTarget4DStatus === 'OPTIONAL_DEFERRED_GENERALIZATION_LANE',
    target4DNonblocking: deferral.reclassification.hEarthCriticalPathBlocked === false,
    portabilityFindingPreserved: deferral.reclassification.findingValidityPreserved === true,
    target4BRefactorNotRequiredForHEarth: deferral.reclassification.target4BPortabilityRefactorRequiredForHEarth === false,
    activationContractExact: contract.contractId === 'H_EARTH_REPOSITORY_REGISTRY_AUTOMATIC_PREFLIGHT_CONTRACT_v1',
    activationContractReadOnlyDefault: contract.defaultOperation.operationClass === 'READ_ONLY_INSPECTION' && contract.defaultOperation.requestedMutation === false,
    scopeRootsExact: JSON.stringify(contract.scopeRoots) === JSON.stringify(H_EARTH_AUTOMATIC_PREFLIGHT_SCOPE_ROOTS),
    contractDoesNotAuthorizeMutation: contract.boundaries.preflightAuthorizesMutation === false,
    contractDoesNotClaimAllExternalTools: contract.coverage.allExternalTools === 'NOT_CLAIMED',
    rootAgentEntrypointPresent: rootAgents.includes('# Repository agent entrypoint'),
    rootAgentAutomaticLanguagePresent: rootAgents.includes('automatically execute the H-Earth registry preflight'),
    rootAgentCliCommandPresent: rootAgents.includes('tools/h-earth-repository-registry-auto-preflight.mjs'),
    rootAgentNoAuthorityBoundaryPresent: rootAgents.includes('grants no source, mutation, merge, canonicalization'),
    cliImportsAutomaticModule: cli.includes('runAutomaticHEarthPreflight'),
    cliSupportsPathInput: cli.includes("argument === '--path'"),
    cliSupportsPathsFile: cli.includes("argument === '--paths-file'"),
    cliSupportsMutationIntent: cli.includes("argument === '--mutation-intent'"),
    cliStopsOnBlockOrStop: cli.includes("receipt.finalDisposition === 'BLOCK'") && cli.includes("receipt.finalDisposition === 'STOP'"),
    workflowNameExact: workflow.includes('name: H-Earth Automatic Repository Registry Preflight'),
    workflowPullRequestTriggerPresent: workflow.includes('pull_request:'),
    workflowPushTriggerPresent: workflow.includes('push:'),
    workflowUsesReadOnlyPermission: workflow.includes('contents: read') && !workflow.includes('contents: write'),
    workflowDiscoversChangedPaths: workflow.includes('git diff --name-only'),
    workflowExcludesRegistryInfrastructure: workflow.includes("!h-earth-3d/registry/**"),
    workflowInvokesAutomaticCli: workflow.includes('tools/h-earth-repository-registry-auto-preflight.mjs'),
    workflowRecordsMutationIntent: workflow.includes('--mutation-intent'),
    workflowUploadsReceipt: workflow.includes('actions/upload-artifact@v4'),
    knownPathClassifiedRegistered: knownClassification.classifications[0]?.classification === 'REGISTERED_H_EARTH_PATH',
    unknownHEarthPathClassifiedScoped: unknownClassification.classifications[0]?.classification === 'UNREGISTERED_H_EARTH_SCOPED_PATH',
    outsidePathClassifiedOutside: outsideClassification.classifications[0]?.classification === 'OUTSIDE_H_EARTH_SCOPE',
    scenarioManifestExact: scenarios.scenarioManifestId === 'H_EARTH_REPOSITORY_REGISTRY_TARGET_4E_UNPROMPTED_SYSTEMIC_SCENARIOS_v1',
    scenarioCountExact: scenarios.scenarios.length === 8,
    scenarioIdsUnique: unique(scenarioIds),
    scenariosContainNoExplicitActivationInstruction: scenarios.scenarios.every((scenario) => forbiddenPromptTerms.every((term) => !scenario.taskText.toLowerCase().includes(term))),
    scenariosIncludeMutationIntent: scenarios.scenarios.some((scenario) => scenario.mutationIntent === true),
    scenariosIncludeUnregisteredStop: scenarios.scenarios.some((scenario) => scenario.expectedDisposition === 'STOP'),
    scenariosIncludeOutsideNotApplicable: scenarios.scenarios.some((scenario) => scenario.expectedDisposition === 'NOT_APPLICABLE'),
    target2RegistryExact: hashObject('h-earth-3d/registry/h-earth.repository-registry.candidate.js') === '10ab7b203e03fde419e526d0cce2c0af42860911',
    target3InstructionExact: hashObject('h-earth-3d/registry/h-earth.repository-registry.tool-instruction.json') === 'de421803f21808ce27b2ffff349af8756c4d9929',
    target4AContractExact: hashObject('h-earth-3d/registry/h-earth.repository-registry.validator-contract.json') === 'a6733c868cfee1abce172c0ac901fecf3dd209b2',
    target4BEngineExact: hashObject('h-earth-3d/registry/h-earth.repository-registry.validator-engine.js') === 'b2d7e0290a2032bef36205e1e1e5b0d3e72ca759',
    target4CCompletionExact: hashObject('h-earth-3d/registry/h-earth.repository-registry.target-4c-completion-receipt.json') === 'fc137bb499cd51b4031f671b071c835e6a0cff42',
    target4DBlockerExact: hashObject('h-earth-3d/registry/h-earth.repository-registry.target-4d-blocker-receipt.json') === '49e24b382a192b486f1d5cc5f4ed91f3378748ca'
  };
  const failedChecks = Object.entries(checks)
    .filter(([, passed]) => passed !== true)
    .map(([name]) => name)
    .sort();

  return {
    auditId: 'H_EARTH_REPOSITORY_REGISTRY_TARGET_4E_STATIC_ACTIVATION_AUDIT_v1',
    targetNumber: 4,
    targetSubtarget: '4E-11',
    result: failedChecks.length === 0 ? 'PASS' : 'FAIL',
    checks,
    totalChecks: Object.keys(checks).length,
    passedChecks: Object.values(checks).filter((value) => value === true).length,
    failedChecks,
    componentGitBlobs: {
      rootAgentEntrypoint: hashObject('AGENTS.md'),
      identityBoundary: hashObject('h-earth-3d/registry/activation/h-earth.repository-registry.target-4e.identity-boundary.json'),
      target4DDeferral: hashObject('h-earth-3d/registry/portability/h-earth.repository-registry.target-4d.deferral-and-critical-path-reclassification.json'),
      activationContract: hashObject('h-earth-3d/registry/activation/h-earth.repository-registry.automatic-preflight.contract.json'),
      activationModule: hashObject('h-earth-3d/registry/activation/h-earth.repository-registry.auto-preflight.js'),
      automaticCli: hashObject('tools/h-earth-repository-registry-auto-preflight.mjs'),
      automaticWorkflow: hashObject('.github/workflows/h-earth-repository-registry-preflight.yml'),
      scenarioManifest: hashObject('h-earth-3d/registry/activation/h-earth.repository-registry.target-4e.scenarios.json'),
      scenarioRunner: hashObject('h-earth-3d/registry/activation/h-earth.repository-registry.target-4e.runner.js')
    },
    boundaries: {
      workflowCandidateInstalledOnCurrentBranch: true,
      workflowActiveOnMain: false,
      branchProtectionCreated: false,
      allExternalToolsControlled: false,
      mutationAuthorityCreated: false,
      mergeAuthorityCreated: false,
      canonicalizationAuthorityCreated: false
    }
  };
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const result = runHEarthRepositoryRegistryTarget4EStaticAudit();
  process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
  if (result.result !== 'PASS') process.exitCode = 1;
}
