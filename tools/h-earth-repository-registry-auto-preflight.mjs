import fs from 'node:fs';
import path from 'node:path';
import { runAutomaticHEarthPreflight } from '../h-earth-3d/registry/activation/h-earth.repository-registry.auto-preflight.js';
import { GEN3096_OPERATION_ID, withGen3096VerifiedScope } from '../h-earth-3d/registry/accepted-amendments/h-earth.repository-registry.gen3096-admitted-candidate-scope.js';

function parseArguments(argv) {
  const options = {
    paths: [],
    pathsFile: null,
    taskText: '',
    mutationIntent: false,
    output: null
  };

  for (let index = 0; index < argv.length; index += 1) {
    const argument = argv[index];
    if (argument === '--path') {
      const value = argv[index + 1];
      if (!value) throw new Error('MISSING_VALUE_FOR_PATH');
      options.paths.push(value);
      index += 1;
    } else if (argument === '--paths-file') {
      const value = argv[index + 1];
      if (!value) throw new Error('MISSING_VALUE_FOR_PATHS_FILE');
      options.pathsFile = value;
      index += 1;
    } else if (argument === '--task') {
      const value = argv[index + 1];
      if (value === undefined) throw new Error('MISSING_VALUE_FOR_TASK');
      options.taskText = value;
      index += 1;
    } else if (argument === '--mutation-intent') {
      options.mutationIntent = true;
    } else if (argument === '--output') {
      const value = argv[index + 1];
      if (!value) throw new Error('MISSING_VALUE_FOR_OUTPUT');
      options.output = value;
      index += 1;
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

function helpText() {
  return [
    'H-Earth automatic repository-registry preflight',
    '',
    'Usage:',
    '  node tools/h-earth-repository-registry-auto-preflight.mjs --path <path> [--path <path> ...]',
    '  node tools/h-earth-repository-registry-auto-preflight.mjs --paths-file <file>',
    '',
    'Options:',
    '  --task <text>          Record the natural-language task context.',
    '  --mutation-intent      Record that the task proposes a change. This grants no authority.',
    '  --output <file>        Write the deterministic receipt to a file.',
    '  --help                 Show this help.'
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

if (options.pathsFile) options.paths.push(...readPathsFile(options.pathsFile));

const nativeRun = () => runAutomaticHEarthPreflight({
  paths: options.paths,
  taskText: options.taskText,
  mutationIntent: options.mutationIntent
});
let receipt;
try {
  if (options.taskText === GEN3096_OPERATION_ID && options.mutationIntent) {
    const verified = await withGen3096VerifiedScope(
      options.paths, options.taskText, options.mutationIntent, nativeRun);
    receipt = {
      ...verified.receipt,
      admissionProvenance: verified.proof,
      operationScopedCandidateRecognition: true
    };
  } else {
    receipt = nativeRun();
  }
} catch (error) {
  // An absent, mismatched or unreachable canonical owner/lock readback never
  // turns an otherwise blocked native request into an authorized operation.
  receipt = {
    receiptId: 'H_EARTH_GEN3096_ADMISSION_VERIFICATION_STOP_v1',
    activationId: 'H_EARTH_REPOSITORY_REGISTRY_AUTOMATIC_PREFLIGHT_ACTIVATION_v1',
    activationStatus: 'ADMISSION_VERIFICATION_FAILED_CLOSED',
    dependenciesVerified: false,
    taskText: options.taskText,
    mutationIntentDetected: options.mutationIntent,
    pathClassification: {
      normalizedPaths: [...new Set(options.paths)].sort().map(p =>
        p.startsWith('/') ? p : '/' + p),
      classifications: [],
      hEarthPaths: [],
      outsidePaths: []
    },
    failureCodes: [String(error.code ?? 'GEN3096_ADMISSION_PROOF_UNAVAILABLE')],
    finalDisposition: 'STOP',
    mutationMayProceed: false,
    continuation: 'REVALIDATE_AUTHENTIC_CANONICAL_ADMISSION',
    boundaries: {
      readOnlyPreflight: true,
      sourceAuthorityCreated: false,
      mutationAuthorityCreated: false,
      mergeAuthorityCreated: false,
      canonicalizationAuthorityCreated: false
    }
  };
}
const serialized = `${JSON.stringify(receipt, null, 2)}\n`;

if (options.output) {
  const outputPath = path.resolve(options.output);
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, serialized, 'utf8');
}

process.stdout.write(serialized);

if (receipt.finalDisposition === 'BLOCK' || receipt.finalDisposition === 'STOP') {
  process.exitCode = 1;
}
