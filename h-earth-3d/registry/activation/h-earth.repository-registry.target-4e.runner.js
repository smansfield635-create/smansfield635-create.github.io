import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { runAutomaticHEarthPreflight } from './h-earth.repository-registry.auto-preflight.js';
import { deepFreeze } from '../h-earth.repository-registry.validator-engine.identity.js';

const directory = path.dirname(fileURLToPath(import.meta.url));
const manifest = JSON.parse(fs.readFileSync(
  path.join(directory, 'h-earth.repository-registry.target-4e.scenarios.json'),
  'utf8'
));

const forbiddenPromptTerms = Object.freeze(['registry', 'validator', 'bootstrap', 'preflight']);

function taskIsUnprompted(taskText) {
  const lower = taskText.toLowerCase();
  return forbiddenPromptTerms.every((term) => !lower.includes(term));
}

function runScenario(scenario) {
  const input = {
    paths: scenario.paths,
    taskText: scenario.taskText,
    mutationIntent: scenario.mutationIntent
  };
  const first = runAutomaticHEarthPreflight(input);
  const second = runAutomaticHEarthPreflight(input);
  const deterministic = JSON.stringify(first) === JSON.stringify(second);
  const affectedNodeCount = first.validatorReceipt?.affectedNodes?.length ?? 0;
  const traceLength = first.validatorReceipt?.derivationTrace?.length ?? 0;
  const activatedTraceExpected = first.activationStatus === 'ACTIVATED' ? 14 : 0;

  const checks = deepFreeze({
    taskContainsNoExplicitActivationInstruction: taskIsUnprompted(scenario.taskText),
    activationStatusExact: first.activationStatus === scenario.expectedActivationStatus,
    dispositionExact: first.finalDisposition === scenario.expectedDisposition,
    continuationExact: first.continuation === scenario.expectedContinuation,
    affectedNodeMinimumMet: affectedNodeCount >= scenario.minimumAffectedNodes,
    traceLengthExact: traceLength === activatedTraceExpected,
    deterministicReceipt: scenario.deterministicRepeatRequired ? deterministic : true,
    dependenciesVerified: first.dependenciesVerified === true,
    mutationNeverAuthorized: first.mutationMayProceed === false,
    mutationIntentPreserved: first.mutationIntentDetected === scenario.mutationIntent,
    receiptIdentityStable: first.receiptId === second.receiptId
  });
  const failedChecks = Object.entries(checks)
    .filter(([, passed]) => passed !== true)
    .map(([name]) => name)
    .sort();

  return deepFreeze({
    scenarioReceiptId: `${scenario.scenarioId}_SYSTEMIC_COMPREHENSION_RECEIPT_v1`,
    scenarioId: scenario.scenarioId,
    taskText: scenario.taskText,
    paths: Object.freeze([...scenario.paths].sort()),
    mutationIntent: scenario.mutationIntent,
    expectedActivationStatus: scenario.expectedActivationStatus,
    actualActivationStatus: first.activationStatus,
    expectedDisposition: scenario.expectedDisposition,
    actualDisposition: first.finalDisposition,
    expectedContinuation: scenario.expectedContinuation,
    actualContinuation: first.continuation,
    affectedNodeCount,
    traceLength,
    checks,
    failedChecks: Object.freeze(failedChecks),
    result: failedChecks.length === 0 ? 'PASS' : 'FAIL',
    automaticPreflightReceipt: first
  });
}

export function runHEarthRepositoryRegistryTarget4ESystemicScenarios({
  writeReceipts = false,
  receiptsDirectory = path.join(directory, 'receipts')
} = {}) {
  const scenarioResults = manifest.scenarios
    .map(runScenario)
    .sort((a, b) => a.scenarioId.localeCompare(b.scenarioId));

  if (writeReceipts) {
    fs.mkdirSync(receiptsDirectory, { recursive: true });
    for (const result of scenarioResults) {
      fs.writeFileSync(
        path.join(receiptsDirectory, `${result.scenarioId}.receipt.json`),
        `${JSON.stringify(result, null, 2)}\n`,
        'utf8'
      );
    }
  }

  const activatedCount = scenarioResults.filter((result) => result.actualActivationStatus === 'ACTIVATED').length;
  const notApplicableCount = scenarioResults.filter((result) => result.actualActivationStatus === 'NOT_APPLICABLE').length;
  const dispositionCounts = Object.fromEntries(
    ['PASS', 'REVIEW_REQUIRED', 'BLOCK', 'STOP', 'NOT_APPLICABLE'].map((disposition) => [
      disposition,
      scenarioResults.filter((result) => result.actualDisposition === disposition).length
    ])
  );
  const failedScenarioIds = scenarioResults
    .filter((result) => result.result !== 'PASS')
    .map((result) => result.scenarioId)
    .sort();

  return deepFreeze({
    auditId: 'H_EARTH_REPOSITORY_REGISTRY_TARGET_4E_UNPROMPTED_SYSTEMIC_SCENARIO_EXECUTION_v1',
    targetNumber: 4,
    targetSubtarget: '4E-10',
    scenarioManifestId: manifest.scenarioManifestId,
    executedScenarioCount: scenarioResults.length,
    passedScenarioCount: scenarioResults.length - failedScenarioIds.length,
    failedScenarioCount: failedScenarioIds.length,
    activatedScenarioCount: activatedCount,
    notApplicableScenarioCount: notApplicableCount,
    dispositionCounts: deepFreeze(dispositionCounts),
    allTasksUnprompted: scenarioResults.every((result) => result.checks.taskContainsNoExplicitActivationInstruction),
    allReceiptsDeterministic: scenarioResults.every((result) => result.checks.deterministicReceipt),
    mutationAuthorityCreated: false,
    failedScenarioIds: Object.freeze(failedScenarioIds),
    scenarioResults: Object.freeze(scenarioResults),
    finalResult: failedScenarioIds.length === 0 ? 'PASS' : 'FAIL'
  });
}

export default runHEarthRepositoryRegistryTarget4ESystemicScenarios;
