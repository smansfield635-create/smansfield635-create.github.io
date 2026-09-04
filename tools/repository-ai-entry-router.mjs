#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const LEGACY_RELATIVE = 'tools/repository-ai-entry-router.v3-legacy.mjs';
const STATIC_VERIFIER = 'tools/static-editorial-micro-verifier.v1.mjs';
const STATIC_CONTENT_EXTENSIONS = new Set(['.html', '.htm', '.md', '.txt']);
const STATIC_PRESENTATION_EXTENSIONS = new Set(['.css']);
const EXECUTABLE_EXTENSIONS = new Set(['.js', '.mjs', '.cjs', '.ts', '.tsx', '.jsx', '.wasm', '.py', '.rb', '.php', '.sh', '.bash', '.zsh', '.ps1']);
const AUTHORITY_PREFIXES = ['.github/', 'tools/', 'control-plane/', 'governance/', 'evidence/'];
const STATIC_TASK_TOKENS = ['COPY', 'TEXT', 'EDITORIAL', 'WORDING', 'LABEL', 'INSTRUCTION', 'INSTRUCTIONS', 'TYPO', 'PUNCTUATION', 'CONTENT', 'HEADLINE', 'DESCRIPTION'];
const PRESENTATION_TASK_TOKENS = ['STATIC', 'PRESENTATION', 'ORDER', 'SPACING', 'TYPOGRAPHY', 'COLOR', 'MARGIN', 'PADDING', 'LAYOUT', 'VISUAL'];
const RUNTIME_TASK_TOKENS = ['RUNTIME', 'BEHAVIOR', 'BEHAVIOUR', 'NAVIGATION', 'STATE MACHINE', 'STATE-MACHINE', 'EVENT', 'HANDLER', 'GESTURE', 'ROUTING', 'ROUTE', 'CONTROLLER', 'RENDERER', 'AUTHORITY', 'DOM REPARENT', 'REPARENT', 'POINTER', 'HIT TARGET', 'HIT-TARGET', 'KEYBOARD', 'FOCUS'];
const CSS_RUNTIME_TOKENS = ['POINTER-EVENTS', 'DISPLAY', 'VISIBILITY', 'Z-INDEX', 'POSITION:FIXED', 'POSITION: FIXED', 'TOUCH-ACTION', 'USER-SELECT'];

const CINEMATIC_TASK_TOKENS = ['CINEMATIC', 'FILM', 'VIDEO', 'PLAYBACK'];
const NON_INTERACTIVE_TASK_TOKENS = ['NON-INTERACTIVE', 'NONINTERACTIVE', 'PRESENTATION-ONLY', 'PRESENTATION ONLY'];
const WEBSITE_AUTHORITY_TASK_TOKENS = [
  'NAVIGATION', 'ROUTING', 'ROUTE', 'CONTROLLER', 'AUTHORITY',
  'DOM REPARENT', 'REPARENT', 'GESTURE', 'POINTER', 'HIT TARGET', 'HIT-TARGET',
  'KEYBOARD', 'FOCUS', 'ANALYTICS', 'APPLICATION STATE', 'SHARED STATE', 'GLOBAL STATE'
];
const WEBSITE_AUTHORITY_PATH_TOKENS = [
  'controller.', '/navigation/', 'navigation.', '/router/', 'router.',
  '/analytics/', 'analytics.', 'readiness-context', 'capability-carousel',
  'mirrorland-window', 'compass.crystals'
];

function die(message, code = 1) { process.stderr.write(`${message}\n`); process.exit(code); }
function discoverRoot(start) { let current = path.resolve(start); while (true) { if (fs.existsSync(path.join(current, 'AI_ENTRYPOINT.json'))) return current; const parent = path.dirname(current); if (parent === current) die('REPOSITORY_ENTRYPOINT_NOT_FOUND:AI_ENTRYPOINT.json'); current = parent; } }
function consumeValue(argv, index, token) { const value = argv[index + 1]; if (typeof value !== 'string' || value === '' || value.startsWith('--')) die(`MISSING_ARGUMENT_VALUE:${token}`); return value; }
function parseArgs(argv) { const parsed = { paths: [], pathsFile: null, task: '', mutationIntent: false, output: null, selfTest: false }; for (let i = 0; i < argv.length; i += 1) { const token = argv[i]; if (token === '--path') { parsed.paths.push(consumeValue(argv, i, token)); i += 1; } else if (token === '--paths-file') { parsed.pathsFile = consumeValue(argv, i, token); i += 1; } else if (token === '--task') { parsed.task = consumeValue(argv, i, token); i += 1; } else if (token === '--mutation-intent') parsed.mutationIntent = true; else if (token === '--output') { parsed.output = consumeValue(argv, i, token); i += 1; } else if (token === '--self-test') parsed.selfTest = true; else if (token === '--intake-availability-receipt') i += 1; else die(`UNKNOWN_ARGUMENT:${token}`); } return parsed; }
function normalizeRepositoryPath(value) { const slash = String(value ?? '').trim().replaceAll('\\', '/').replace(/^\.\/+/, ''); if (!slash || slash.startsWith('/') || slash === '..' || slash.startsWith('../') || slash.includes('/../')) die(`INVALID_REPOSITORY_PATH:${value}`); return slash.replace(/\/+/g, '/'); }
function collectPaths(root, parsed) { const paths = [...parsed.paths]; if (parsed.pathsFile) { const text = fs.readFileSync(path.resolve(root, parsed.pathsFile), 'utf8'); paths.push(...text.split(/\r?\n/).filter(Boolean)); } return [...new Set(paths.map(normalizeRepositoryPath))].sort(); }
function containsAny(text, tokens) { return tokens.some((token) => text.includes(token)); }
function isCinematicScopedPath(filePath) {
  const lower = filePath.toLowerCase();
  return lower.includes('cinematic') || lower.includes('/orientation-cinematic/');
}
function isBoundedCinematicPathSet(normalizedPaths, extensions, upperTask) {
  if (!containsAny(upperTask, CINEMATIC_TASK_TOKENS)) return false;
  if (!containsAny(upperTask, NON_INTERACTIVE_TASK_TOKENS)) return false;
  if (containsAny(upperTask, WEBSITE_AUTHORITY_TASK_TOKENS)) return false;
  if (normalizedPaths.some((filePath) => AUTHORITY_PREFIXES.some((prefix) => filePath.startsWith(prefix)))) return false;
  if (normalizedPaths.some((filePath) => containsAny(filePath.toLowerCase(), WEBSITE_AUTHORITY_PATH_TOKENS))) return false;
  let cinematicScoped = false;
  for (let i = 0; i < normalizedPaths.length; i += 1) {
    const filePath = normalizedPaths[i];
    const extension = extensions[i];
    const scoped = isCinematicScopedPath(filePath);
    if (scoped) cinematicScoped = true;
    if (EXECUTABLE_EXTENSIONS.has(extension) && !scoped) return false;
    if (!EXECUTABLE_EXTENSIONS.has(extension)
      && !STATIC_CONTENT_EXTENSIONS.has(extension)
      && !STATIC_PRESENTATION_EXTENSIONS.has(extension)
      && !scoped) return false;
  }
  return cinematicScoped;
}
function classifyPageMutation(paths, task = '') {
  const normalizedPaths = [...new Set(paths.map(normalizeRepositoryPath))].sort();
  const upperTask = String(task || '').toUpperCase();
  const extensions = normalizedPaths.map((filePath) => path.extname(filePath).toLowerCase());
  const governed = (reasonCode) => ({ mutationClass: 'RUNTIME_OR_AUTHORITY', reasonCode, canonicalAdmissionRequired: true, pageExcellenceRequired: true });
  if (normalizedPaths.length === 0) return governed('NO_DECLARED_PATHS_FAIL_CLOSED');
  if (normalizedPaths.some((filePath) => AUTHORITY_PREFIXES.some((prefix) => filePath.startsWith(prefix)))) return governed('CONTROL_OR_AUTHORITY_SURFACE');
  if (isBoundedCinematicPathSet(normalizedPaths, extensions, upperTask)) return {
    mutationClass: 'BOUNDED_PAGE_RELEASE',
    reasonCode: 'BOUNDED_NON_INTERACTIVE_CINEMATIC_PRESENTATION',
    canonicalAdmissionRequired: false,
    pageExcellenceRequired: false,
    requiredProofs: [
      'EXACT_HEAD',
      'DECLARED_PATHS_ONLY',
      'NO_NAVIGATION_DELTA',
      'NO_APPLICATION_STATE_AUTHORITY_DELTA',
      'NO_SHARED_DOM_AUTHORITY_DELTA',
      'NO_ANALYTICS_DELTA',
      'IDEMPOTENT_PRESENTATION_RESTORATION',
      'NO_UNRELATED_DIFF'
    ]
  };
  if (extensions.some((extension) => EXECUTABLE_EXTENSIONS.has(extension))) return governed('EXECUTABLE_SURFACE_PRESENT');
  if (containsAny(upperTask, RUNTIME_TASK_TOKENS)) return governed('RUNTIME_SEMANTICS_DECLARED');
  const contentOnly = extensions.every((extension) => STATIC_CONTENT_EXTENSIONS.has(extension));
  const staticPresentationOnly = extensions.every((extension) => STATIC_CONTENT_EXTENSIONS.has(extension) || STATIC_PRESENTATION_EXTENSIONS.has(extension));
  const hasCss = extensions.some((extension) => STATIC_PRESENTATION_EXTENSIONS.has(extension));
  if (contentOnly && containsAny(upperTask, STATIC_TASK_TOKENS)) return { mutationClass: 'STATIC_EDITORIAL_MICRO', reasonCode: 'STATIC_CONTENT_ONLY_WITH_EDITORIAL_INTENT', canonicalAdmissionRequired: false, pageExcellenceRequired: false, verifier: STATIC_VERIFIER, requiredProofs: ['EXACT_HEAD', 'DECLARED_PATHS_ONLY', 'NO_EXECUTABLE_RUNTIME_DELTA', 'NO_UNRELATED_DIFF'] };
  if (staticPresentationOnly && hasCss && containsAny(upperTask, PRESENTATION_TASK_TOKENS) && !containsAny(upperTask, CSS_RUNTIME_TOKENS)) return { mutationClass: 'STATIC_EDITORIAL_MICRO', reasonCode: 'BOUNDED_STATIC_PRESENTATION_INTENT', canonicalAdmissionRequired: false, pageExcellenceRequired: false, verifier: STATIC_VERIFIER, requiredProofs: ['EXACT_HEAD', 'DECLARED_PATHS_ONLY', 'NO_EXECUTABLE_RUNTIME_DELTA', 'NO_UNRELATED_DIFF', 'STATIC_PRESENTATION_ONLY'] };
  return governed('AMBIGUOUS_MUTATION_FAIL_CLOSED');
}
function stripMutationOnlyArgs(argv) { const stripped = []; for (let i = 0; i < argv.length; i += 1) { const token = argv[i]; if (token === '--mutation-intent') continue; if (token === '--intake-availability-receipt') { i += 1; continue; } if (token === '--output') { i += 1; continue; } stripped.push(token); } return stripped; }
function runLegacy(root, argv) { return spawnSync(process.execPath, [path.join(root, LEGACY_RELATIVE), ...argv], { cwd: root, encoding: 'utf8' }); }
function writeReceipt(output, receipt) { const text = `${JSON.stringify(receipt, null, 2)}\n`; if (output) { const absolute = path.resolve(output); fs.mkdirSync(path.dirname(absolute), { recursive: true }); fs.writeFileSync(absolute, text); } process.stdout.write(text); }
function selfTest(root) {
  const cases = [
    ['HTML_INSTRUCTION_COPY_IS_MICRO',['index.html'],'add approved instructions copy','STATIC_EDITORIAL_MICRO'],
    ['HTML_TYPO_IS_MICRO',['laws/index.html'],'fix typo in page text','STATIC_EDITORIAL_MICRO'],
    ['CSS_ORDER_IS_MICRO',['assets/compass/compass.capability-carousel.css'],'static presentation order change','STATIC_EDITORIAL_MICRO'],
    ['BOUNDED_CINEMATIC_JS_IS_PAGE_RELEASE',['index.html','assets/compass/compass.orientation-cinematic.js','assets/compass/compass.orientation-cinematic.css','assets/compass/compass.orientation-cinematic.render.js','assets/compass/compass.orientation-cinematic.media.js','scripts/verify-compass-orientation-cinematic.mjs'],'bounded non-interactive cinematic presentation playback','BOUNDED_PAGE_RELEASE'],
    ['CINEMATIC_CONTROLLER_MIX_REMAINS_RUNTIME',['index.html','assets/compass/compass.orientation-cinematic.js','assets/compass/compass.controller.js'],'bounded non-interactive cinematic presentation playback','RUNTIME_OR_AUTHORITY'],
    ['CINEMATIC_NAVIGATION_DECLARATION_REMAINS_RUNTIME',['index.html','assets/compass/compass.orientation-cinematic.js'],'non-interactive cinematic presentation with navigation change','RUNTIME_OR_AUTHORITY'],
    ['GENERIC_JS_REMAINS_RUNTIME',['assets/compass/example.js'],'bounded non-interactive cinematic presentation playback','RUNTIME_OR_AUTHORITY'],
    ['JS_CHANGE_IS_RUNTIME',['assets/compass/compass.controller.js'],'change guidance behavior','RUNTIME_OR_AUTHORITY'],
    ['HTML_NAVIGATION_CHANGE_IS_RUNTIME',['index.html'],'change navigation routing behavior','RUNTIME_OR_AUTHORITY'],
    ['AMBIGUOUS_HTML_FAILS_CLOSED',['index.html'],'update page','RUNTIME_OR_AUTHORITY'],
    ['CONTROL_PLANE_ALWAYS_GOVERNED',['.github/workflows/test.yml'],'edit copy','RUNTIME_OR_AUTHORITY']
  ].map(([id,paths,task,expected]) => {
    const actual = classifyPageMutation(paths,task);
    return {id,expected,actual:actual.mutationClass,pass:actual.mutationClass===expected};
  });
  const legacy = runLegacy(root,['--self-test']);
  let legacyReceipt=null;
  try { legacyReceipt=JSON.parse(legacy.stdout||'{}'); } catch {}
  const legacyPass=legacy.status===0&&legacyReceipt?.result==='PASS';
  return { schema:'PAGE_MUTATION_CLASSIFICATION_INSTRUMENT_SELF_TEST_v1', instrumentId:'PAGE_MUTATION_CLASSIFICATION_INSTRUMENT_v1', result:cases.every((c)=>c.pass)&&legacyPass?'PASS':'FAIL', scenarios:cases, legacyRouterSelfTest:legacyPass?'PASS':'FAIL' };
}
const root = discoverRoot(process.cwd());
const argv = process.argv.slice(2);
const parsed = parseArgs(argv);
if (parsed.selfTest) { const receipt=selfTest(root); writeReceipt(parsed.output,receipt); process.exit(receipt.result==='PASS'?0:1); }
if (!parsed.mutationIntent) { const legacy=runLegacy(root,argv); process.stdout.write(legacy.stdout||''); process.stderr.write(legacy.stderr||''); process.exit(legacy.status??1); }
const paths=collectPaths(root,parsed);
const classification=classifyPageMutation(paths,parsed.task);
const proportionalBypass = classification.mutationClass==='STATIC_EDITORIAL_MICRO' || classification.mutationClass==='BOUNDED_PAGE_RELEASE';
if (!proportionalBypass) { const legacy=runLegacy(root,argv); process.stdout.write(legacy.stdout||''); process.stderr.write(legacy.stderr||''); process.exit(legacy.status??1); }
const legacy=runLegacy(root,stripMutationOnlyArgs(argv));
let routeReceipt=null;
try { routeReceipt=JSON.parse(legacy.stdout||'{}'); } catch { die(`LEGACY_ROUTE_RECEIPT_INVALID:${legacy.stderr||legacy.stdout}`); }
const blocked=legacy.status!==0||routeReceipt.disposition!=='PASS';
const isStatic = classification.mutationClass==='STATIC_EDITORIAL_MICRO';
const passResult = isStatic ? 'PASS_STATIC_EDITORIAL_MICRO' : 'PASS_BOUNDED_PAGE_RELEASE';
const executionResult = isStatic ? 'NOT_REQUIRED_STATIC_EDITORIAL_MICRO' : 'NOT_REQUIRED_BOUNDED_PAGE_RELEASE';
const reasonCode = isStatic ? 'STATIC_EDITORIAL_MICRO_BYPASS_BY_DETERMINISTIC_CLASSIFIER' : 'BOUNDED_PAGE_RELEASE_BYPASS_BY_DETERMINISTIC_CLASSIFIER';
const successReason = isStatic ? 'STATIC_EDITORIAL_MICRO_CLASSIFIED_NO_CANONICAL_INTAKE_REQUIRED' : 'BOUNDED_PAGE_RELEASE_CLASSIFIED_NO_CANONICAL_INTAKE_REQUIRED';
const blockedReason = isStatic ? 'STATIC_EDITORIAL_ROUTE_NOT_PASS' : 'BOUNDED_PAGE_RELEASE_ROUTE_NOT_PASS';
const receipt={
  ...routeReceipt,
  schema:'REPOSITORY_AI_ENTRY_ROUTER_RECEIPT_v3',
  mutationIntent:true,
  pageMutationClassification:{
    schema:'PAGE_MUTATION_CLASSIFICATION_RECEIPT_v1',
    instrumentId:'PAGE_MUTATION_CLASSIFICATION_INSTRUMENT_v1',
    result:blocked?'BLOCK':passResult,
    ...classification,
    declaredPaths:paths,
    task:parsed.task||null,
    ambiguityPolicy:'RUNTIME_OR_AUTHORITY'
  },
  operationIntakeExecution:blocked?null:{
    schema:'REPOSITORY_AI_EXECUTION_ROUTE_RESOLUTION_RECEIPT_v1',
    result:executionResult,
    backendId:null,
    canonicalAdmissionRequired:false,
    reasonCode
  },
  disposition:blocked?routeReceipt.disposition:'PASS',
  reasonCodes:[...new Set([...(routeReceipt.reasonCodes??[]),blocked?blockedReason:successReason])]
};
writeReceipt(parsed.output,receipt);
process.exit(blocked?1:0);
