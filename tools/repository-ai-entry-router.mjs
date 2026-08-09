#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const ENTRYPOINT_PATH = 'AI_ENTRYPOINT.json';
const BRIDGE_CAPABILITY_ID = 'CANONICAL_REPOSITORY_OPERATION_INTAKE_PRE_REGISTRATION_EXECUTION_BRIDGE_v1';
const BRIDGE_STATUS = 'ACTIVE_PERMANENT_PRE_REGISTRATION_CAPABILITY';
const BRIDGE_MARKER = 'PRE_REGISTRATION_INTAKE_BRIDGE_REQUEST_V1';
const BRIDGE_BACKEND_ID = 'PRE_REGISTRATION_INTAKE_BRIDGE_EXECUTION';
const BRIDGE_TRANSITION_ID = 'OPERATION_INTAKE_LOCAL_AUTH_UNAVAILABLE_TO_PRE_REGISTRATION_BRIDGE_v1';

function die(message, code = 1) {
  process.stderr.write(`${message}\n`);
  process.exit(code);
}

function parseArgs(argv) {
  const result = {
    paths: [],
    pathsFile: null,
    task: null,
    mutationIntent: false,
    output: null,
    selfTest: false
  };
  for (let i = 0; i < argv.length; i += 1) {
    const token = argv[i];
    if (token === '--path') result.paths.push(argv[++i] ?? '');
    else if (token === '--paths-file') result.pathsFile = argv[++i] ?? null;
    else if (token === '--task') result.task = argv[++i] ?? null;
    else if (token === '--mutation-intent') result.mutationIntent = true;
    else if (token === '--output') result.output = argv[++i] ?? null;
    else if (token === '--self-test') result.selfTest = true;
    else if (token === '--help') {
      process.stdout.write(
        'Usage: node tools/repository-ai-entry-router.mjs --path <path> [--path <path> ...] ' +
        '[--paths-file <file>] [--task <text>] [--mutation-intent] [--output <receipt.json>] [--self-test]\n'
      );
      process.exit(0);
    } else die(`UNKNOWN_ARGUMENT:${token}`);
  }
  return result;
}

function run(command, args, cwd, allowFailure = false) {
  const result = spawnSync(command, args, { cwd, encoding: 'utf8' });
  if (result.error) {
    if (allowFailure) return { status: 1, stdout: '', stderr: result.error.message };
    throw result.error;
  }
  if (!allowFailure && result.status !== 0) {
    throw new Error(`${command} ${args.join(' ')} failed (${result.status})\n${result.stderr || result.stdout}`);
  }
  return { status: result.status ?? 1, stdout: result.stdout ?? '', stderr: result.stderr ?? '' };
}

function discoverRoot(start) {
  let current = path.resolve(start);
  while (true) {
    if (fs.existsSync(path.join(current, ENTRYPOINT_PATH))) return current;
    const parent = path.dirname(current);
    if (parent === current) throw new Error(`REPOSITORY_ENTRYPOINT_NOT_FOUND:${ENTRYPOINT_PATH}`);
    current = parent;
  }
}

function readJson(root, relativePath) {
  const absolute = path.join(root, relativePath);
  if (!fs.existsSync(absolute)) throw new Error(`MISSING_ROUTER_FILE:${relativePath}`);
  try {
    return JSON.parse(fs.readFileSync(absolute, 'utf8'));
  } catch (error) {
    throw new Error(`INVALID_ROUTER_JSON:${relativePath}:${error.message}`);
  }
}

function normalizeRepositoryPath(value) {
  if (typeof value !== 'string' || value.trim() === '') throw new Error('EMPTY_PATH');
  const slash = value.trim().replaceAll('\\', '/').replace(/^\.\/+/, '');
  if (slash.startsWith('/') || slash === '..' || slash.startsWith('../') || slash.includes('/../')) {
    throw new Error(`INVALID_REPOSITORY_PATH:${value}`);
  }
  return slash.replace(/\/+/g, '/');
}

function matchesRegistration(filePath, registration) {
  const exact = (registration.ownedExactPaths ?? []).includes(filePath);
  const prefixLengths = (registration.ownedPathPrefixes ?? [])
    .filter((prefix) => filePath.startsWith(prefix))
    .map((prefix) => prefix.length);
  const longestPrefix = prefixLengths.length ? Math.max(...prefixLengths) : -1;
  return { match: exact || longestPrefix >= 0, specificity: exact ? Number.MAX_SAFE_INTEGER : longestPrefix };
}

function routeOne(root, router, filePath, mutationIntent) {
  const infrastructure = matchesRegistration(filePath, router.routerInfrastructure);
  const projectMatches = router.projects
    .map((project) => ({ project, ...matchesRegistration(filePath, project) }))
    .filter((entry) => entry.match);

  if (infrastructure.match) {
    return {
      path: filePath,
      routeClass: 'ROUTER_INFRASTRUCTURE',
      projectId: router.routerInfrastructure.projectId,
      entrypoint: router.routerInfrastructure.validationCommand,
      disposition: 'PASS',
      requiredInstructions: [ENTRYPOINT_PATH, router.routerInfrastructure.validationCommand],
      registries: [router.sharedProcedureRegistry, router.executionBackendRegistry],
      procedures: { validationCommand: router.routerInfrastructure.validationCommand }
    };
  }

  if (projectMatches.length) {
    const maximumPriority = Math.max(...projectMatches.map((entry) => entry.project.priority ?? 0));
    const priorityMatches = projectMatches.filter((entry) => (entry.project.priority ?? 0) === maximumPriority);
    const maximumSpecificity = Math.max(...priorityMatches.map((entry) => entry.specificity));
    const finalists = priorityMatches.filter((entry) => entry.specificity === maximumSpecificity);
    if (finalists.length !== 1) {
      return {
        path: filePath,
        routeClass: 'AMBIGUOUS',
        projectId: null,
        entrypoint: null,
        disposition: router.ambiguityPolicy.disposition,
        requiredInstructions: [],
        registries: [],
        procedures: {}
      };
    }
    const selected = finalists[0].project;
    const entrypoint = readJson(root, selected.entrypoint);
    return {
      path: filePath,
      routeClass: 'REGISTERED_PROJECT',
      projectId: selected.projectId,
      entrypoint: selected.entrypoint,
      disposition: selected.status === 'ACTIVE_REGISTERED_PROJECT' ? 'PASS' : 'BLOCK',
      requiredInstructions: entrypoint.requiredInstructions ?? [],
      registries: entrypoint.registries ?? [],
      procedures: entrypoint.procedures ?? {}
    };
  }

  const policy = router.unregisteredPathPolicy;
  return {
    path: filePath,
    routeClass: 'UNREGISTERED',
    projectId: null,
    entrypoint: null,
    disposition: mutationIntent ? policy.mutationDisposition : policy.readOnlyDisposition,
    requiredInstructions: [policy.registrationTemplate],
    registries: [router.sharedProcedureRegistry, router.executionBackendRegistry],
    procedures: {}
  };
}

function aggregateDisposition(routes) {
  const rank = { STOP: 5, BLOCK: 4, REVIEW_REQUIRED: 3, PASS: 2, NOT_APPLICABLE: 1 };
  return routes.reduce((current, route) => rank[route.disposition] > rank[current] ? route.disposition : current, 'NOT_APPLICABLE');
}

function repositoryState(root) {
  const headResult = run('git', ['rev-parse', 'HEAD^{commit}'], root, true);
  const statusResult = run('git', ['status', '--porcelain=v1', '--untracked-files=all'], root, true);
  return {
    governingHead: headResult.status === 0 ? headResult.stdout.trim() : null,
    workingTreeClean: statusResult.status === 0 ? statusResult.stdout.trim() === '' : null
  };
}

function validateExecutionBackendRegistry(registry) {
  if (!registry || registry.schema !== 'REPOSITORY_AI_EXECUTION_BACKEND_REGISTRY_v1' || registry.status !== 'ACTIVE') {
    throw new Error('EXECUTION_BACKEND_REGISTRY_INVALID');
  }
  if (!Array.isArray(registry.backends)) throw new Error('EXECUTION_BACKEND_REGISTRY_BACKENDS_INVALID');
  return registry;
}

function bridgeIdentityValid(bridge) {
  return bridge &&
    bridge.status === BRIDGE_STATUS &&
    bridge.capabilityId === BRIDGE_CAPABILITY_ID &&
    bridge.invocationMarker === BRIDGE_MARKER &&
    typeof bridge.executionWorkflow === 'string' && bridge.executionWorkflow.length > 0 &&
    typeof bridge.fixedCommand === 'string' && bridge.fixedCommand.length > 0 &&
    typeof bridge.activationFingerprint === 'string' && /^[0-9a-f]{64}$/.test(bridge.activationFingerprint) &&
    typeof bridge.canonicalGateBlob === 'string' && /^[0-9a-f]{40}$/.test(bridge.canonicalGateBlob) &&
    bridge.generalRepositoryMutationAuthorityCreated === false &&
    bridge.mergeAuthorityCreated === false &&
    bridge.prMutationAuthorityCreated === false;
}

function resolveOperationIntakeExecution(entrypoint, backendRegistry, localAuthenticatedExecutionAvailable) {
  validateExecutionBackendRegistry(backendRegistry);
  const transition = (backendRegistry.routeTransitions ?? []).find((item) => item.transitionId === BRIDGE_TRANSITION_ID) ?? null;
  if (localAuthenticatedExecutionAvailable) {
    return {
      schema: 'REPOSITORY_AI_EXECUTION_ROUTE_RESOLUTION_RECEIPT_v1',
      result: 'LOCAL_CANONICAL_INTAKE_ROUTE',
      backendId: 'LOCAL_CLEAN_GIT',
      canonicalGate: entrypoint.operationIntakeGate?.gateCli ?? null,
      terminalInabilityAllowed: false,
      genericWorkflowDispatchAllowed: false,
      reasonCode: 'LOCAL_AUTHENTICATED_EXECUTION_AVAILABLE'
    };
  }

  const bridge = entrypoint.preRegistrationIntakeBridge;
  if (!bridgeIdentityValid(bridge)) {
    return {
      schema: 'REPOSITORY_AI_EXECUTION_ROUTE_RESOLUTION_RECEIPT_v1',
      result: 'STOP',
      backendId: null,
      errorCode: 'CERTIFIED_PRE_REGISTRATION_BRIDGE_UNAVAILABLE_OR_IDENTITY_INVALID',
      terminalInabilityAllowed: true,
      genericWorkflowDispatchAllowed: false,
      reasonCode: 'LOCAL_AUTHENTICATED_EXECUTION_UNAVAILABLE_AND_CERTIFIED_BRIDGE_INVALID'
    };
  }

  const transitionValid = transition &&
    transition.requiredBackend === BRIDGE_BACKEND_ID &&
    transition.requiredCapabilityId === BRIDGE_CAPABILITY_ID &&
    transition.requiredInvocationMarker === BRIDGE_MARKER &&
    transition.genericWorkflowDispatchAllowed === false &&
    transition.terminalInabilityAllowedWhenBridgeValid === false &&
    transition.invalidBridgeDisposition === 'STOP_FAIL_CLOSED';
  const backend = backendRegistry.backends.find((item) => item.backendId === BRIDGE_BACKEND_ID) ?? null;
  if (!transitionValid || !backend) {
    return {
      schema: 'REPOSITORY_AI_EXECUTION_ROUTE_RESOLUTION_RECEIPT_v1',
      result: 'STOP',
      backendId: null,
      errorCode: 'CERTIFIED_PRE_REGISTRATION_BRIDGE_TRANSITION_NOT_REGISTERED',
      terminalInabilityAllowed: true,
      genericWorkflowDispatchAllowed: false,
      reasonCode: 'DECLARED_BRIDGE_EXISTS_BUT_BACKEND_TRANSITION_IS_NOT_EXECUTABLE'
    };
  }

  return {
    schema: 'REPOSITORY_AI_EXECUTION_ROUTE_RESOLUTION_RECEIPT_v1',
    result: 'CERTIFIED_PRE_REGISTRATION_BRIDGE_REQUIRED',
    backendId: BRIDGE_BACKEND_ID,
    capabilityId: bridge.capabilityId,
    invocationMarker: bridge.invocationMarker,
    executionWorkflow: bridge.executionWorkflow,
    fixedCommand: bridge.fixedCommand,
    activationFingerprint: bridge.activationFingerprint,
    canonicalGateBlob: bridge.canonicalGateBlob,
    lockRef: bridge.lockRef,
    terminalInabilityAllowed: false,
    genericWorkflowDispatchAllowed: false,
    reasonCode: 'LOCAL_AUTHENTICATED_EXECUTION_UNAVAILABLE_USES_DECLARED_CERTIFIED_BRIDGE'
  };
}

function validateRegistry(root, entrypoint, router) {
  const requiredFiles = [
    ENTRYPOINT_PATH,
    entrypoint.rootAgentInstruction,
    entrypoint.routerRegistry,
    entrypoint.routerCli,
    entrypoint.sharedProcedureRegistry,
    entrypoint.executionBackendRegistry,
    entrypoint.projectRegistrationSchema,
    entrypoint.entryReceiptSchema,
    ...router.projects.map((project) => project.entrypoint)
  ];
  const missing = [...new Set(requiredFiles)].filter((relativePath) => !fs.existsSync(path.join(root, relativePath)));
  if (missing.length) throw new Error(`SELF_TEST_MISSING_FILES:${missing.join(',')}`);
  const ids = new Set();
  for (const project of router.projects) {
    if (ids.has(project.projectId)) throw new Error(`SELF_TEST_DUPLICATE_PROJECT_ID:${project.projectId}`);
    ids.add(project.projectId);
    readJson(root, project.entrypoint);
  }
}

function executeSelfTest(root, entrypoint, router) {
  validateRegistry(root, entrypoint, router);
  const backendRegistry = validateExecutionBackendRegistry(readJson(root, entrypoint.executionBackendRegistry));
  const scenarios = [
    ['h-earth-3d/terrain/example.js', 'H_EARTH', 'PASS'],
    ['showroom/globe/h-earth/index.html', 'H_EARTH', 'PASS'],
    ['AI_ENTRYPOINT.json', 'REPOSITORY_AI_ROUTER_INFRASTRUCTURE', 'PASS'],
    ['future-project/example.txt', null, 'REVIEW_REQUIRED']
  ];
  const results = scenarios.map(([filePath, expectedProject, expectedDisposition]) => {
    const actual = routeOne(root, router, filePath, false);
    const pass = actual.projectId === expectedProject && actual.disposition === expectedDisposition;
    return { filePath, expectedProject, expectedDisposition, actualProject: actual.projectId, actualDisposition: actual.disposition, pass };
  });
  const mutationGuard = routeOne(root, router, 'future-project/example.txt', true);
  results.push({
    filePath: 'future-project/example.txt',
    expectedProject: null,
    expectedDisposition: 'BLOCK',
    actualProject: mutationGuard.projectId,
    actualDisposition: mutationGuard.disposition,
    pass: mutationGuard.disposition === 'BLOCK'
  });

  const localRoute = resolveOperationIntakeExecution(entrypoint, backendRegistry, true);
  results.push({
    scenario: 'LOCAL_AUTHENTICATED_OPERATION_INTAKE',
    expectedResult: 'LOCAL_CANONICAL_INTAKE_ROUTE',
    actualResult: localRoute.result,
    pass: localRoute.result === 'LOCAL_CANONICAL_INTAKE_ROUTE' && localRoute.terminalInabilityAllowed === false
  });

  const bridgeRoute = resolveOperationIntakeExecution(entrypoint, backendRegistry, false);
  results.push({
    scenario: 'LOCAL_AUTHENTICATED_EXECUTION_UNAVAILABLE',
    expectedResult: 'CERTIFIED_PRE_REGISTRATION_BRIDGE_REQUIRED',
    actualResult: bridgeRoute.result,
    pass: bridgeRoute.result === 'CERTIFIED_PRE_REGISTRATION_BRIDGE_REQUIRED' &&
      bridgeRoute.backendId === BRIDGE_BACKEND_ID &&
      bridgeRoute.invocationMarker === BRIDGE_MARKER &&
      bridgeRoute.terminalInabilityAllowed === false &&
      bridgeRoute.genericWorkflowDispatchAllowed === false
  });

  const invalidBridgeEntrypoint = { ...entrypoint, preRegistrationIntakeBridge: { ...entrypoint.preRegistrationIntakeBridge, status: 'INACTIVE' } };
  const invalidBridgeRoute = resolveOperationIntakeExecution(invalidBridgeEntrypoint, backendRegistry, false);
  results.push({
    scenario: 'CERTIFIED_BRIDGE_INACTIVE_FAIL_CLOSED',
    expectedResult: 'STOP',
    actualResult: invalidBridgeRoute.result,
    pass: invalidBridgeRoute.result === 'STOP' && invalidBridgeRoute.errorCode === 'CERTIFIED_PRE_REGISTRATION_BRIDGE_UNAVAILABLE_OR_IDENTITY_INVALID'
  });

  const missingTransitionRegistry = { ...backendRegistry, routeTransitions: [] };
  const missingTransitionRoute = resolveOperationIntakeExecution(entrypoint, missingTransitionRegistry, false);
  results.push({
    scenario: 'BRIDGE_DECLARED_WITHOUT_EXECUTABLE_TRANSITION_FAIL_CLOSED',
    expectedResult: 'STOP',
    actualResult: missingTransitionRoute.result,
    pass: missingTransitionRoute.result === 'STOP' && missingTransitionRoute.errorCode === 'CERTIFIED_PRE_REGISTRATION_BRIDGE_TRANSITION_NOT_REGISTERED'
  });

  const failures = results.filter((result) => !result.pass);
  return {
    schema: 'REPOSITORY_AI_ENTRY_ROUTER_SELF_TEST_RECEIPT_v1',
    routerId: router.routerId,
    result: failures.length ? 'FAIL' : 'PASS',
    scenarioCount: results.length,
    passedCount: results.length - failures.length,
    failedCount: failures.length,
    scenarios: results
  };
}

function writeReceipt(output, receipt) {
  const text = `${JSON.stringify(receipt, null, 2)}\n`;
  if (output) {
    const absolute = path.resolve(output);
    fs.mkdirSync(path.dirname(absolute), { recursive: true });
    fs.writeFileSync(absolute, text);
  }
  process.stdout.write(text);
}

try {
  const args = parseArgs(process.argv.slice(2));
  const root = discoverRoot(process.cwd());
  const entrypoint = readJson(root, ENTRYPOINT_PATH);
  const router = readJson(root, entrypoint.routerRegistry);
  const backendRegistry = validateExecutionBackendRegistry(readJson(root, entrypoint.executionBackendRegistry));

  if (args.selfTest) {
    const selfTest = executeSelfTest(root, entrypoint, router);
    writeReceipt(args.output, selfTest);
    process.exit(selfTest.result === 'PASS' ? 0 : 1);
  }

  if (args.pathsFile) {
    const text = fs.readFileSync(path.resolve(args.pathsFile), 'utf8');
    args.paths.push(...text.split(/\r?\n/).filter(Boolean));
  }
  if (!args.paths.length) die('NO_PATHS_SUPPLIED');

  const normalizedPaths = [...new Set(args.paths.map(normalizeRepositoryPath))].sort();
  const routes = normalizedPaths.map((filePath) => routeOne(root, router, filePath, args.mutationIntent));
  let disposition = aggregateDisposition(routes);
  const state = repositoryState(root);
  const operationIntakeExecution = args.mutationIntent
    ? resolveOperationIntakeExecution(entrypoint, backendRegistry, Boolean(process.env.GITHUB_TOKEN))
    : null;
  if (operationIntakeExecution?.result === 'STOP') disposition = 'STOP';
  const reasonCodes = [...new Set([
    ...routes.map((route) => {
      if (route.routeClass === 'UNREGISTERED') return 'NO_REGISTERED_PROJECT_AUTHORITY';
      if (route.routeClass === 'AMBIGUOUS') return 'MULTIPLE_EQUAL_PRIORITY_PROJECT_ROUTES';
      if (route.routeClass === 'ROUTER_INFRASTRUCTURE') return 'ROUTER_INFRASTRUCTURE_VALIDATION_REQUIRED';
      return 'REGISTERED_PROJECT_ROUTE_RESOLVED';
    }),
    ...(operationIntakeExecution ? [operationIntakeExecution.reasonCode] : [])
  ])];

  const receipt = {
    schema: 'REPOSITORY_AI_ENTRY_ROUTER_RECEIPT_v1',
    routerId: router.routerId,
    repository: router.repository,
    governingHead: state.governingHead,
    task: args.task,
    mutationIntent: args.mutationIntent,
    workingTreeClean: state.workingTreeClean,
    routes,
    operationIntakeExecution,
    disposition,
    reasonCodes,
    conversationMemoryRequired: false
  };
  writeReceipt(args.output, receipt);
  process.exit(disposition === 'STOP' || disposition === 'BLOCK' ? 1 : 0);
} catch (error) {
  const failure = {
    schema: 'REPOSITORY_AI_ENTRY_ROUTER_FAILURE_v1',
    result: 'STOP',
    error: error instanceof Error ? error.message : String(error),
    conversationMemoryRequired: false
  };
  process.stderr.write(`${JSON.stringify(failure, null, 2)}\n`);
  process.exit(1);
}
