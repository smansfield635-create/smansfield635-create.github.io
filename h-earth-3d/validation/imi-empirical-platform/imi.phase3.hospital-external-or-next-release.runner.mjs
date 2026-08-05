import { createRequire } from 'node:module';
import { spawn } from 'node:child_process';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { canonicalDigest, deepFreeze } from '../../tools/instrument-platform/platform-core.mjs';

const require = createRequire(import.meta.url);
const route = require('../../tools/imi-empirical-platform/routes/cms-hospital-refresh-2026-route.v1.json');
const manifest = require('../../tools/imi-empirical-platform/generalizability/imi-phase3-parallel-external-tests-manifest.v1.json');
const track = manifest.tracks.find((entry) => entry.track === 'HOSPITAL_EXTERNAL_OR_NEXT_RELEASE_REPLICATION');

const DATASETS = Object.freeze({
  complications: { id: 'ynj2-r877', name: 'Complications and Deaths - Hospital' },
  general: { id: 'xubh-q36u', name: 'Hospital General Information' }
});

function argValue(name, fallback = null) {
  const index = process.argv.indexOf(name);
  return index >= 0 && process.argv[index + 1] ? process.argv[index + 1] : fallback;
}
const outputDir = argValue('--output-dir', '/tmp/imi-phase3-hospital-external-or-next-release');
const clockValue = argValue('--clock', '2026-08-05T17:45:00.000Z');
const clock = () => new Date(clockValue);

async function fetchMeta(dataset) {
  const url = `https://data.cms.gov/provider-data/api/1/metastore/schemas/dataset/items/${dataset.id}`;
  const response = await fetch(url);
  if (!response.ok) throw new Error(`CMS_METADATA_FETCH_FAILED:${dataset.id}:${response.status}`);
  const meta = await response.json();
  const downloadUrl = meta?.distribution?.find?.((entry) => entry.mediaType === 'text/csv')?.downloadURL || meta?.distribution?.[0]?.downloadURL || null;
  return {
    id: dataset.id,
    name: dataset.name,
    metadataUrl: url,
    released: meta.released || null,
    modified: meta.modified || null,
    title: meta.title || dataset.name,
    downloadUrl
  };
}

function laterDate(observed, baseline) {
  if (!observed || !baseline) return false;
  const a = Date.parse(observed);
  const b = Date.parse(baseline);
  return Number.isFinite(a) && Number.isFinite(b) && a > b;
}

async function executeCurrentHospitalRunner(studyDir) {
  await new Promise((resolve, reject) => {
    const child = spawn(process.execPath, [
      'h-earth-3d/validation/imi-empirical-platform/imi.cms-hospital-refresh-2026.runner.mjs',
      '--output-dir', studyDir,
      '--clock', clockValue
    ], { stdio: 'inherit' });
    child.once('error', reject);
    child.once('exit', (code) => code === 0 ? resolve() : reject(new Error(`HOSPITAL_CHILD_RUNNER_EXIT_${code}`)));
  });
  return JSON.parse(await readFile(path.join(studyDir, 'cms-hospital-refresh-summary.v1.json'), 'utf8'));
}

await mkdir(outputDir, { recursive: true });
const [complications, general] = await Promise.all([
  fetchMeta(DATASETS.complications),
  fetchMeta(DATASETS.general)
]);
const sourceIdentity = deepFreeze({
  schemaVersion: 'IMI_PHASE_3_HOSPITAL_SOURCE_AVAILABILITY_IDENTITY_v1',
  observedAt: clock().toISOString(),
  baselineRelease: track.baselineRelease,
  datasets: { complications, general },
  sourceDigest: canonicalDigest({ complications, general })
});

const complicationsEligible = laterDate(complications.released, track.baselineRelease.complicationsReleased);
const generalEligible = laterDate(general.released, track.baselineRelease.generalReleased);
const nextReleaseEligible = complicationsEligible && generalEligible;
let receipt;

if (!nextReleaseEligible) {
  const body = {
    schemaVersion: 'IMI_PHASE_3_HOSPITAL_EXTERNAL_REPLICATION_RECEIPT_v1',
    operation: 'IMI_PARALLEL_EXTERNAL_TESTS_v1',
    track: track.track,
    result: 'HELD_NO_ELIGIBLE_NEXT_RELEASE_OR_NON_CMS_PACKAGE',
    terminalDisposition: 'HELD_OPEN_SOURCE_NOT_AVAILABLE',
    observedAt: clock().toISOString(),
    routeId: route.routeId,
    routeDigest: canonicalDigest(route),
    sourceIdentity,
    admission: {
      nextCmsReleaseEligible,
      complicationsEligible,
      generalEligible,
      nonCmsPackageProvided: false,
      minimumEvidenceSatisfied: false
    },
    reason: 'THE_REQUIRED_CMS_DATASET_PAIR_HAS_NOT_ADVANCED_BEYOND_THE_FROZEN_BASELINE_RELEASE_AND_NO_SEPARATELY_BOUND_NON_CMS_PACKAGE_WAS_PROVIDED',
    phase4Candidate: false,
    boundaries: {
      sourceMetadataInspectedOnly: true,
      hospitalRowsDownloaded: false,
      newEmpiricalTestExecuted: false,
      routeRetuned: false,
      clinicalDiagnosisClaimed: false,
      causalClaimMade: false,
      finalValidationClaimed: false
    }
  };
  receipt = deepFreeze({ ...body, receiptDigest: canonicalDigest(body) });
} else {
  const studyDir = path.join(outputDir, 'study');
  const summary = await executeCurrentHospitalRunner(studyDir);
  if (summary.transformedHospitalRows < 500) throw new Error(`HOSPITAL_PHASE3_MINIMUM_EVIDENCE_NOT_MET:${summary.transformedHospitalRows}`);
  const body = {
    schemaVersion: 'IMI_PHASE_3_HOSPITAL_EXTERNAL_REPLICATION_RECEIPT_v1',
    operation: 'IMI_PARALLEL_EXTERNAL_TESTS_v1',
    track: track.track,
    result: 'PASS_CLOSED_HOSPITAL_NEXT_RELEASE_REPLICATION_EXECUTED',
    terminalDisposition: 'PASS_CLOSED',
    observedAt: clock().toISOString(),
    routeId: route.routeId,
    routeDigest: canonicalDigest(route),
    sourceIdentity,
    admission: {
      nextCmsReleaseEligible: true,
      minimumEvidenceSatisfied: true,
      institutionCount: summary.transformedHospitalRows
    },
    empiricalSummary: summary,
    phase4Candidate: false,
    boundaries: {
      nextReleaseOnly: true,
      routeRetuned: false,
      clinicalDiagnosisClaimed: false,
      causalClaimMade: false,
      finalValidationClaimed: false
    }
  };
  receipt = deepFreeze({ ...body, receiptDigest: canonicalDigest(body) });
}

await writeFile(path.join(outputDir, 'hospital-phase3-source-identity.v1.json'), `${JSON.stringify(sourceIdentity, null, 2)}\n`);
await writeFile(path.join(outputDir, 'hospital-phase3-track-receipt.v1.json'), `${JSON.stringify(receipt, null, 2)}\n`);
console.log(JSON.stringify(receipt, null, 2));
