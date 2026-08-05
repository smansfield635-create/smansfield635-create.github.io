import { createRequire } from 'node:module';
import { spawn } from 'node:child_process';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { canonicalDigest, deepFreeze } from '../../tools/instrument-platform/platform-core.mjs';
import { runStudy } from '../../tools/imi-empirical-platform/imi-core-and-empirical-portfolio-engine.v1.mjs';

const require = createRequire(import.meta.url);
const route = require('../../tools/imi-empirical-platform/routes/cms-hospital-refresh-2026-route.v1.json');
const manifest = require('../../tools/imi-empirical-platform/generalizability/imi-phase3-parallel-external-tests-manifest.v1.json');
const track = manifest.tracks.find((entry) => entry.track === 'HOSPITAL_EXTERNAL_OR_NEXT_RELEASE_REPLICATION');

function argValue(name, fallback = null) {
  const index = process.argv.indexOf(name);
  return index >= 0 && process.argv[index + 1] ? process.argv[index + 1] : fallback;
}
const outputDir = argValue('--output-dir', '/tmp/imi-phase3-hospital-external-or-next-release');
const clockValue = argValue('--clock', '2026-08-05T19:05:00.000Z');
const clock = () => new Date(clockValue);
const adapterDir = path.join(outputDir, 'datasus-public-package');

async function executeAdapter() {
  await mkdir(adapterDir, { recursive: true });
  const script = 'h-earth-3d/validation/imi-empirical-platform/imi.phase3.datasus-hospital-package-adapter.py';
  return new Promise((resolve, reject) => {
    const child = spawn(process.env.PYTHON || 'python3', [
      script,
      '--output-dir', adapterDir,
      '--clock', clockValue
    ], { stdio: 'inherit' });
    child.once('error', reject);
    child.once('exit', (code) => code === 0
      ? resolve()
      : reject(new Error(`DATASUS_HOSPITAL_ADAPTER_EXIT_${code}`)));
  });
}

function validatePackage(pack) {
  if (pack?.schemaVersion !== 'IMI_PHASE_3_NON_CMS_HOSPITAL_PACKAGE_v1') {
    throw new Error('NON_CMS_HOSPITAL_PACKAGE_SCHEMA_MISMATCH');
  }
  if (!Array.isArray(pack.rows) || pack.rows.length < 500) {
    throw new Error(`NON_CMS_HOSPITAL_PACKAGE_MINIMUM_NOT_MET:${pack?.rows?.length ?? 0}`);
  }
  const ids = pack.rows.map((row) => String(row.facility_id || ''));
  if (ids.some((id) => !id)) throw new Error('NON_CMS_HOSPITAL_PACKAGE_EMPTY_ID');
  if (new Set(ids).size !== ids.length) throw new Error('NON_CMS_HOSPITAL_PACKAGE_DUPLICATE_ID');
  for (const row of pack.rows) {
    for (const field of ['mortality_worse', 'mortality_reported', 'safety_worse', 'safety_reported']) {
      if (!Number.isFinite(row[field]) || row[field] < 0) {
        throw new Error(`NON_CMS_HOSPITAL_PACKAGE_INVALID_COUNT:${field}:${row.facility_id}`);
      }
    }
    if (row.mortality_worse > row.mortality_reported || row.safety_worse > row.safety_reported) {
      throw new Error(`NON_CMS_HOSPITAL_PACKAGE_WORSE_EXCEEDS_REPORTED:${row.facility_id}`);
    }
  }
}

function buildHoldReceipt(error) {
  const sourceIdentity = {
    schemaVersion: 'IMI_PHASE_3_DATASUS_HOSPITAL_SOURCE_ATTEMPT_v1',
    observedAt: clock().toISOString(),
    sourceId: 'BRAZIL_DATASUS_SIH_SUS_SAO_PAULO_Q1_2024_v1',
    error: String(error?.message || error)
  };
  const body = {
    schemaVersion: 'IMI_PHASE_3_HOSPITAL_EXTERNAL_REPLICATION_RECEIPT_v1',
    operation: 'IMI_PARALLEL_EXTERNAL_TESTS_v1',
    track: track.track,
    result: 'HELD_PUBLIC_DATASUS_PACKAGE_EXECUTION_NOT_COMPLETED',
    terminalDisposition: 'HELD_OPEN_PUBLIC_SOURCE_PACKAGE_EXECUTION',
    observedAt: clock().toISOString(),
    routeId: route.routeId,
    routeDigest: canonicalDigest(route),
    sourceDigest: canonicalDigest(sourceIdentity),
    executionDigest: null,
    summaryDigest: null,
    minimumEvidenceSatisfied: false,
    phase4Candidate: false,
    sourceIdentity,
    reason: 'THE_PUBLIC_NON_CMS_SOURCE_WAS_BOUND_BUT_THE_FROZEN_PACKAGE_EXECUTION_DID_NOT_COMPLETE',
    boundaries: {
      routeRetuned: false,
      cmsDevelopmentRowsReused: false,
      causalClaimMade: false,
      clinicalDiagnosisClaimed: false,
      finalValidationClaimed: false
    }
  };
  return deepFreeze({ ...body, receiptDigest: canonicalDigest(body) });
}

await mkdir(outputDir, { recursive: true });
let receipt;
try {
  await executeAdapter();
  const pack = JSON.parse(await readFile(path.join(adapterDir, 'datasus-hospital-package.v1.json'), 'utf8'));
  validatePackage(pack);
  const sourceIdentity = deepFreeze(pack.sourceIdentity);
  const studyRun = runStudy({
    studyMeta: {
      studyId: 'IMI_PHASE_3_HOSPITAL_PUBLIC_DATASUS_REPLICATION_v1',
      studyVersion: '1.0.0',
      validationClass: 'PHASE_3_EXTERNAL_PUBLIC_SOURCE_REPLICATION',
      backupStatus: 'GITHUB_ACTIONS_ARTIFACT_AND_PR_BRANCH_RECEIPT',
      notes: [
        'Independent Brazil SIH/SUS source; no CMS development rows reused.',
        'Frozen mortality and safety count mapping declared before execution.'
      ]
    },
    datasetMeta: {
      datasetId: sourceIdentity.sourceId,
      datasetVersion: '2024-Q1-SP',
      datasetFingerprint: pack.packageSha256
    },
    routeSpec: route,
    rows: pack.rows,
    clock
  });
  const validCases = studyRun.receipt.summary.validCases;
  const summary = deepFreeze({
    schemaVersion: 'IMI_PHASE_3_HOSPITAL_PUBLIC_DATASUS_SUMMARY_v1',
    result: 'PASS_CLOSED_PHASE_3_HOSPITAL_PUBLIC_DATASUS_REPLICATION_EXECUTED',
    sourceIdentity,
    institutionRows: pack.rows.length,
    validCases,
    unevaluableCases: studyRun.receipt.summary.unevaluableCases,
    hardCollapseCases: studyRun.receipt.summary.hardCollapseCases,
    imiSummary: studyRun.receipt.summary.imiSummary,
    weakestFactorCounts: studyRun.receipt.summary.weakestFactorCounts,
    minimumEvidenceSatisfied: pack.rows.length >= 500 && validCases >= 500,
    phase4Candidate: false,
    boundaries: {
      nonCmsIndependentSource: true,
      sourceCountryDifferentFromDevelopmentSource: true,
      outcomeTestExecuted: false,
      routeRetuned: false,
      causalClaimMade: false,
      finalValidationClaimed: false
    }
  });
  if (!summary.minimumEvidenceSatisfied) {
    throw new Error(`DATASUS_HOSPITAL_VALID_MINIMUM_NOT_MET:${validCases}`);
  }
  const body = {
    schemaVersion: 'IMI_PHASE_3_HOSPITAL_EXTERNAL_REPLICATION_RECEIPT_v1',
    operation: 'IMI_PARALLEL_EXTERNAL_TESTS_v1',
    track: track.track,
    result: summary.result,
    terminalDisposition: 'PASS_CLOSED_PUBLIC_NON_CMS_EXTERNAL_REPLICATION',
    observedAt: clock().toISOString(),
    routeId: route.routeId,
    routeDigest: canonicalDigest(route),
    sourceDigest: canonicalDigest(sourceIdentity),
    executionDigest: canonicalDigest(studyRun),
    summaryDigest: canonicalDigest(summary),
    minimumEvidenceSatisfied: true,
    phase4Candidate: false,
    admission: {
      nonCmsPackageProvided: true,
      independentInstitutionCount: pack.rows.length,
      minimumIndependentInstitutionsRequired: 500,
      sourceOverlapExcluded: true
    },
    empiricalSummary: summary,
    boundaries: summary.boundaries
  };
  receipt = deepFreeze({ ...body, receiptDigest: canonicalDigest(body) });
  await writeFile(path.join(outputDir, 'hospital-phase3-public-datasus-summary.v1.json'), `${JSON.stringify(summary, null, 2)}\n`);
  await writeFile(path.join(outputDir, 'hospital-phase3-public-datasus-study-run.v1.json'), `${JSON.stringify(studyRun, null, 2)}\n`);
} catch (error) {
  receipt = buildHoldReceipt(error);
}
await writeFile(path.join(outputDir, 'hospital-phase3-track-receipt.v1.json'), `${JSON.stringify(receipt, null, 2)}\n`);
console.log(JSON.stringify(receipt, null, 2));
