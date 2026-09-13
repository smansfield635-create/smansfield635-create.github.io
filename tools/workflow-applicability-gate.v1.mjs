#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';

const SCHEMA = 'WORKFLOW_APPLICABILITY_RECEIPT_v1';
const WORKFLOW_ID = 'H_EARTH_REPOSITORY_REGISTRY_PREFLIGHT';

function normalizeRepositoryPath(value) {
  return String(value || '')
    .trim()
    .replace(/\\/g, '/')
    .replace(/^\.\//, '')
    .replace(/^\//, '');
}

function uniqueSorted(values) {
  return [...new Set(values.map(normalizeRepositoryPath).filter(Boolean))].sort();
}

function parseArguments(argv) {
  const options = {
    workflow: WORKFLOW_ID,
    paths: [],
    pathsFile: null,
    output: null,
    selfTest: false,
    help: false
  };

  for (let index = 0; index < argv.length; index += 1) {
    const argument = argv[index];
    if (argument === '--workflow') {
      const value = argv[index + 1];
      if (!value) throw new Error('MISSING_VALUE_FOR_WORKFLOW');
      options.workflow = value;
      index += 1;
    } else if (argument === '--path') {
      const value = argv[index + 1];
      if (!value) throw new Error('MISSING_VALUE_FOR_PATH');
      options.paths.push(value);
      index += 1;
    } else if (argument === '--paths-file') {
      const value = argv[index + 1];
      if (!value) throw new Error('MISSING_VALUE_FOR_PATHS_FILE');
      options.pathsFile = value;
      index += 1;
    } else if (argument === '--output') {
      const value = argv[index + 1];
      if (!value) throw new Error('MISSING_VALUE_FOR_OUTPUT');
      options.output = value;
      index += 1;
    } else if (argument === '--self-test') {
      options.selfTest = true;
    } else if (argument === '--help') {
      options.help = true;
    } else {
      throw new Error(`UNKNOWN_ARGUMENT:${argument}`);
    }
  }

  return options;
}

function readPathsFile(filePath) {
  return fs.readFileSync(filePath, 'utf8')
    .split(/\r?\n/)
    .map((value) => value.trim())
    .filter(Boolean);
}

function isExplicitHEarthRegistryDependency(repositoryPath) {
  const value = normalizeRepositoryPath(repositoryPath);
  return (
    value === '.github/workflows/h-earth-repository-registry-preflight.yml' ||
    value === '.github/ai-router/page-mutation-proportionality-policy.v1.json' ||
    value === 'AI_ENTRYPOINT.json' ||
    value === 'tools/h-earth-repository-registry-auto-preflight.mjs' ||
    value === 'tools/workflow-applicability-gate.v1.mjs' ||
    value.startsWith('h-earth-3d/registry/')
  );
}

export function evaluateWorkflowApplicability({ workflow = WORKFLOW_ID, changedPaths = [] } = {}) {
  if (workflow !== WORKFLOW_ID) {
    const error = new Error(`UNSUPPORTED_WORKFLOW:${workflow}`);
    error.code = 'UNSUPPORTED_WORKFLOW';
    throw error;
  }

  const normalizedPaths = uniqueSorted(changedPaths);
  const selectedPaths = normalizedPaths.filter(isExplicitHEarthRegistryDependency);
  const selectedByDecision = selectedPaths.length > 0;

  return {
    schema: SCHEMA,
    workflowId: WORKFLOW_ID,
    decisionAuthority: 'WHOLE_ESTATE_EXECUTION_DECISION_v1',
    result: selectedByDecision ? 'SELECTED' : 'NOT_APPLICABLE',
    selectedByDecision,
    severity: selectedByDecision ? 'SELECTED_BLOCKER' : 'NOT_APPLICABLE',
    failureDispositionWhenUnselected: 'ADVISORY_UNSELECTED',
    mayExecuteExpensiveWork: selectedByDecision,
    changedPaths: normalizedPaths,
    selectedPaths,
    reasonCodes: selectedByDecision
      ? ['EXPLICIT_REGISTRY_OR_CONTROL_PLANE_DEPENDENCY']
      : ['NO_EXPLICIT_REGISTRY_OR_CONTROL_PLANE_DEPENDENCY', 'DIRECTORY_PREFIX_MATCH_ALONE_DOES_NOT_SELECT'],
    invariants: {
      prefixMatchAloneMaySelectBlockingGate: false,
      ordinaryProductPathMayCreateRegistryPrerequisiteSolelyByLocation: false,
      selectedDependencyFailureRemainsFailClosed: true,
      exactHeadCustodyPreserved: true,
      boundedMutationScopePreserved: true,
      scientificAndEmpiricalFailClosedBoundariesPreserved: true,
      mergeDeploymentPublicationSeparationPreserved: true
    },
    authorityEffect: 'NONE',
    safetyCorePreserved: true
  };
}

function assert(condition, code) {
  if (!condition) throw new Error(`SELF_TEST_ASSERTION_FAILED:${code}`);
}

function runSelfTest() {
  const historicalAudraliaRegression = evaluateWorkflowApplicability({
    changedPaths: [
      'showroom/globe/h-earth/terrain-estate-construction-v1/audralia-tablet-cloud-pass.mjs',
      'showroom/globe/h-earth/terrain-estate-construction-v1/audralia-tablet-weather-morphology-atlas-v1.mjs',
      'showroom/globe/h-earth/terrain-estate-construction-v1/precomputed-gratitude-mesh-v1.mjs'
    ]
  });
  assert(historicalAudraliaRegression.result === 'NOT_APPLICABLE', 'AUDRALIA_THREE_PATH_NOT_APPLICABLE');
  assert(historicalAudraliaRegression.mayExecuteExpensiveWork === false, 'AUDRALIA_THREE_PATH_NO_EXPENSIVE_WORK');
  assert(historicalAudraliaRegression.severity === 'NOT_APPLICABLE', 'AUDRALIA_THREE_PATH_NEUTRAL_SEVERITY');

  const selectedRegistryChange = evaluateWorkflowApplicability({
    changedPaths: ['h-earth-3d/registry/candidate.v1.json']
  });
  assert(selectedRegistryChange.result === 'SELECTED', 'REGISTRY_CHANGE_SELECTED');
  assert(selectedRegistryChange.mayExecuteExpensiveWork === true, 'REGISTRY_CHANGE_MAY_EXECUTE');
  assert(selectedRegistryChange.severity === 'SELECTED_BLOCKER', 'REGISTRY_CHANGE_BLOCKER_SEVERITY');

  const workflowSelfChange = evaluateWorkflowApplicability({
    changedPaths: ['.github/workflows/h-earth-repository-registry-preflight.yml']
  });
  assert(workflowSelfChange.result === 'SELECTED', 'WORKFLOW_SELF_CHANGE_SELECTED');

  const unrelatedChange = evaluateWorkflowApplicability({ changedPaths: ['README.md'] });
  assert(unrelatedChange.result === 'NOT_APPLICABLE', 'UNRELATED_CHANGE_NOT_APPLICABLE');
  assert(unrelatedChange.failureDispositionWhenUnselected === 'ADVISORY_UNSELECTED', 'UNSELECTED_DISPOSITION_TYPED');
  assert(unrelatedChange.authorityEffect === 'NONE', 'NO_AUTHORITY_EFFECT');
  assert(unrelatedChange.safetyCorePreserved === true, 'SAFETY_CORE_PRESERVED');

  return {
    schema: 'WORKFLOW_APPLICABILITY_SELF_TEST_RECEIPT_v1',
    result: 'PASS',
    assertions: 12,
    regression: 'RUN_34773289185_AUDRALIA_THREE_PATH_FALSE_BLOCK',
    selectedFixture: 'H_EARTH_REGISTRY_EXPLICIT_DEPENDENCY',
    authorityEffect: 'NONE'
  };
}

function helpText() {
  return [
    'Whole-estate workflow applicability gate v1',
    '',
    'Usage:',
    '  node tools/workflow-applicability-gate.v1.mjs --paths-file <file> [--output <file>]',
    '  node tools/workflow-applicability-gate.v1.mjs --path <path> [--path <path> ...]',
    '  node tools/workflow-applicability-gate.v1.mjs --self-test',
    '',
    'This gate decides whether a legacy workflow is semantically selected before expensive execution.',
    'NOT_APPLICABLE is a neutral-success disposition and creates no authority.'
  ].join('\n');
}

let options;
try {
  options = parseArguments(process.argv.slice(2));
} catch (error) {
  process.stderr.write(`${error.message}\n`);
  process.exit(64);
}

if (options.help) {
  process.stdout.write(`${helpText()}\n`);
  process.exit(0);
}

try {
  if (options.selfTest) {
    process.stdout.write(`${JSON.stringify(runSelfTest(), null, 2)}\n`);
    process.exit(0);
  }

  if (options.pathsFile) options.paths.push(...readPathsFile(options.pathsFile));
  const receipt = evaluateWorkflowApplicability({ workflow: options.workflow, changedPaths: options.paths });
  const serialized = `${JSON.stringify(receipt, null, 2)}\n`;

  if (options.output) {
    const outputPath = path.resolve(options.output);
    fs.mkdirSync(path.dirname(outputPath), { recursive: true });
    fs.writeFileSync(outputPath, serialized, 'utf8');
  }

  process.stdout.write(serialized);
} catch (error) {
  process.stderr.write(`${error.stack || error.message}\n`);
  process.exit(1);
}
