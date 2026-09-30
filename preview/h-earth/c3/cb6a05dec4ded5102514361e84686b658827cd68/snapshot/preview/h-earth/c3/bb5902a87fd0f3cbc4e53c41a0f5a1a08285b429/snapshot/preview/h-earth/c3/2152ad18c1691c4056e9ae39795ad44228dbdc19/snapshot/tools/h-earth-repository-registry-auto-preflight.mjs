import fs from 'node:fs';
import path from 'node:path';
import { runAutomaticHEarthPreflight } from '../h-earth-3d/registry/activation/h-earth.repository-registry.auto-preflight.js';

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
    '  node --experimental-default-type=module tools/h-earth-repository-registry-auto-preflight.mjs --path <path> [--path <path> ...]',
    '  node --experimental-default-type=module tools/h-earth-repository-registry-auto-preflight.mjs --paths-file <file>',
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

const receipt = runAutomaticHEarthPreflight({
  paths: options.paths,
  taskText: options.taskText,
  mutationIntent: options.mutationIntent
});
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
