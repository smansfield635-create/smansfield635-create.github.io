#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const EXPECTED_CORPUS_SHA256 = '6b237426c06518daa2fe7e274ae3901af2d450a9131bab0e64cfd8b19fd7df67';
const EXPECTED_KEY_COMMITMENT_SHA256 = 'c76c578e9d07f66036c901ad563a7f84ef53ce516b4d2c55aec4dbb326299add';
const BEARINGS = ['N','NNE','NE','ENE','E','ESE','SE','SSE','S','SSW','SW','WSW','W','WNW','NW','NNW'];
const IDS = Array.from({length: 28}, (_, i) => `AH${String(i + 1).padStart(2, '0')}`);
const REQUIRED_OUTPUTS = ['primitiveRequirements','dominance','adjacency','opposition','decomposition','bearing','route','domain','authority','independentReviewBearing','ambiguity'];

function stable(value) {
  if (Array.isArray(value)) return value.map(stable);
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.keys(value).sort().map(key => [key, stable(value[key])]));
  }
  return value;
}
function canonical(value) {
  return JSON.stringify(stable(value));
}
function sha256(text) {
  return crypto.createHash('sha256').update(text, 'utf8').digest('hex');
}
function readJson(name) {
  return JSON.parse(fs.readFileSync(path.join(HERE, name), 'utf8'));
}
function equal(a, b) {
  return canonical(a) === canonical(b);
}
function add(checks, id, pass, detail = null) {
  checks.push({id, pass: Boolean(pass), detail});
}

function phase1SelfTest() {
  const corpus = readJson('compass-adversarial-holdout-corpus.v1.1.json');
  const commitment = readJson('compass-adversarial-holdout-key-commitment.v1.1.json');
  const schema = readJson('compass-adversarial-holdout-classification-schema.v1.1.json');
  const template = readJson('compass-adversarial-holdout-submission-template.v1.1.json');
  const checks = [];

  const observedCorpusSha256 = sha256(canonical(corpus));
  add(checks, 'CORPUS_SHA256_MATCH', observedCorpusSha256 === EXPECTED_CORPUS_SHA256, {expected: EXPECTED_CORPUS_SHA256, observed: observedCorpusSha256});
  add(checks, 'KEY_COMMITMENT_MATCH', commitment?.sealedKeyCanonicalSha256 === EXPECTED_KEY_COMMITMENT_SHA256 && commitment?.publicCorpusCanonicalSha256 === EXPECTED_CORPUS_SHA256 && commitment?.keyMaterialPresent === false);

  const cases = Array.isArray(corpus?.cases) ? corpus.cases : [];
  const ids = cases.map(x => x?.id);
  add(checks, 'AH01_AH28_PRESENT', cases.length === 28 && equal(ids, IDS));
  add(checks, 'DIRECT_16_BEARINGS_PRESENT', cases.slice(0,16).length === 16 && equal(corpus?.instructions?.allowedBearings, BEARINGS) && commitment?.directBearingCount === 16);
  add(checks, 'NNE_PRIMARY_PRESENT', corpus?.instructions?.allowedBearings?.includes('NNE') && commitment?.directBearingCount === 16);
  add(checks, 'AH17_AH20_OPPOSITION_PRESENT', equal(ids.slice(16,20), ['AH17','AH18','AH19','AH20']));
  add(checks, 'AH21_AH24_DOMAIN_PAIRS_PRESENT', equal(ids.slice(20,24), ['AH21','AH22','AH23','AH24']));
  add(checks, 'AH25_AH26_AUTHORITY_PAIR_PRESENT', equal(ids.slice(24,26), ['AH25','AH26']));
  add(checks, 'AH27_AH28_MULTISTAGE_PRESENT', equal(ids.slice(26,28), ['AH27','AH28']));
  add(checks, 'SCHEMA_ALLOWED_BEARINGS_ONLY', equal(schema?.properties?.classifications?.items?.properties?.bearing?.enum, [...BEARINGS, null]) && equal(corpus?.instructions?.requiredOutputs, REQUIRED_OUTPUTS));

  const allowedCaseKeys = new Set(['id','prompt']);
  const noAnswerFields = cases.every(c => c && Object.keys(c).every(k => allowedCaseKeys.has(k)) && typeof c.id === 'string' && typeof c.prompt === 'string' && c.prompt.length > 0);
  const serializedCases = canonical(cases).toLowerCase();
  const noSuspiciousAnswerMarkers = !['expectedbearing','expectedroute','answerkey','goldlabel','goldbearing','goldroute'].some(x => serializedCases.includes(x));
  add(checks, 'NO_KEY_LEAKAGE', noAnswerFields && noSuspiciousAnswerMarkers && commitment?.keyMaterialPresent === false);

  add(checks, 'SUBMISSION_TEMPLATE_BLIND', template?.keyAccessedBeforeSubmission === false && template?.corpusSha256 === EXPECTED_CORPUS_SHA256 && Array.isArray(template?.classifications) && template.classifications.length === 0);
  add(checks, 'CLASSIFIER_OUTPUT_SCHEMA_COMPLETE', REQUIRED_OUTPUTS.every(k => schema?.properties?.classifications?.items?.required?.includes(k)) && schema?.properties?.classifications?.items?.required?.includes('caseId'));

  const failed = checks.filter(x => !x.pass);
  return {
    schema: 'COMPASS_ADVERSARIAL_HOLDOUT_PHASE1_SELF_TEST_RECEIPT_v1',
    result: failed.length === 0 ? 'PASS_CLOSED' : 'FAIL_CLOSED',
    expectedCorpusSha256: EXPECTED_CORPUS_SHA256,
    observedCorpusSha256,
    sealedKeyCommitmentSha256: EXPECTED_KEY_COMMITMENT_SHA256,
    keyMaterialRead: false,
    caseCount: cases.length,
    checkCount: checks.length,
    failedCheckIds: failed.map(x => x.id),
    checks
  };
}

if (process.argv.length !== 3 || process.argv[2] !== '--phase1-self-test') {
  process.stderr.write('usage: node compass-adversarial-holdout-evaluator.v1.1.mjs --phase1-self-test\n');
  process.exit(2);
}

try {
  const receipt = phase1SelfTest();
  process.stdout.write(JSON.stringify(receipt, null, 2) + '\n');
  process.exit(receipt.result === 'PASS_CLOSED' ? 0 : 1);
} catch (error) {
  process.stdout.write(JSON.stringify({schema:'COMPASS_ADVERSARIAL_HOLDOUT_PHASE1_SELF_TEST_RECEIPT_v1', result:'FAIL_CLOSED', error:error.message}, null, 2) + '\n');
  process.exit(1);
}
