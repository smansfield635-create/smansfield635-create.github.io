import { createRequire } from 'node:module';
import { spawn } from 'node:child_process';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { canonicalDigest, deepFreeze } from '../../tools/instrument-platform/platform-core.mjs';

const require = createRequire(import.meta.url);
const route = require('../../tools/imi-empirical-platform/routes/spontaneous-speech-current-repository-rerun-2026-route.v1.json');
const manifest = require('../../tools/imi-empirical-platform/generalizability/imi-phase3-parallel-external-tests-manifest.v1.json');
const track = manifest.tracks.find((entry) => entry.track === 'SPEECH_HELD_OUT_DATASET_REPRODUCTION');

function argValue(name, fallback = null) {
  const index = process.argv.indexOf(name);
  return index >= 0 && process.argv[index + 1] ? process.argv[index + 1] : fallback;
}
const outputDir = argValue('--output-dir', '/tmp/imi-phase3-speech-heldout-dataset');
const clockValue = argValue('--clock', '2026-08-05T19:45:00.000Z');
const clock = () => new Date(clockValue);
const probeDir = path.join(outputDir, 'clac-public-source-probe');

async function executeProbe() {
  await mkdir(probeDir, { recursive: true });
  return new Promise((resolve, reject) => {
    const child = spawn(process.env.PYTHON || 'python3', [
      'h-earth-3d/validation/imi-empirical-platform/imi.phase3.clac-source-probe.py',
      '--output-dir', probeDir,
      '--clock', clockValue
    ], { stdio: 'inherit' });
    child.once('error', reject);
    child.once('exit', (code) => code === 0 ? resolve() : reject(new Error(`CLAC_SOURCE_PROBE_EXIT_${code}`)));
  });
}

await mkdir(outputDir, { recursive: true });
let probe;
try {
  await executeProbe();
  probe = JSON.parse(await readFile(path.join(probeDir, 'clac-source-probe.v1.json'), 'utf8'));
} catch (error) {
  probe = {
    schemaVersion: 'IMI_PHASE_3_CLAC_SOURCE_PROBE_v2',
    result: 'HELD_CLAC_SOURCE_PROBE_PROCESS_FAILED',
    observedAt: clock().toISOString(),
    archiveUrl: 'https://data.csail.mit.edu/placesaudio/CLAC-Dataset.zip',
    error: String(error?.message || error)
  };
}
const packageBound = probe.result === 'PASS_CLAC_PUBLIC_TEXT_METADATA_PACKAGE_BOUND';
const body = {
  schemaVersion: 'IMI_PHASE_3_SPEECH_HELD_OUT_REPRODUCTION_RECEIPT_v1',
  operation: 'IMI_PARALLEL_EXTERNAL_TESTS_v1',
  track: track.track,
  result: packageBound
    ? 'HELD_PUBLIC_CLAC_TEXT_METADATA_PACKAGE_BOUND_EXACT_FIVE_FEATURE_EXECUTION_PENDING'
    : 'HELD_PUBLIC_CLAC_TEXT_METADATA_PACKAGE_NOT_COMPLETED',
  terminalDisposition: packageBound
    ? 'HELD_OPEN_PUBLIC_SOURCE_FEATURE_EXTRACTION'
    : 'HELD_OPEN_PUBLIC_SOURCE_ACCESS',
  observedAt: clock().toISOString(),
  routeId: route.routeId,
  routeDigest: canonicalDigest(route),
  sourceDigest: canonicalDigest(probe),
  executionDigest: null,
  summaryDigest: null,
  minimumEvidenceSatisfied: false,
  phase4Candidate: false,
  sourceIdentity: probe,
  admission: {
    independentPublicCorpusBound: true,
    archiveInventoryCompleted: packageBound,
    transcriptMetadataPackageBound: packageBound,
    extractedUsableTranscriptCount: probe.extractedUsableTranscriptCount || 0,
    minimumParticipantCountRequired: 100,
    minimumDeclaredGroupsRequired: 2,
    frozenFiveFeatureInputsRequired: true,
    exactFeatureExtractionCompleted: false
  },
  reason: packageBound
    ? 'THE_INDEPENDENT_PUBLIC_CLAC_TRANSCRIPT_AND_METADATA_PACKAGE_IS_BOUND; EXACT_FROZEN_FIVE_FEATURE_EXTRACTION_REMAINS_REQUIRED_BEFORE_EMPIRICAL_CREDIT'
    : 'THE_INDEPENDENT_PUBLIC_CLAC_SOURCE_WAS_BOUND_BUT_THE_BOUNDED_TRANSCRIPT_AND_METADATA_PACKAGE_DID_NOT_COMPLETE',
  boundaries: {
    protectedDataAccessAttempted: false,
    fullArchiveDownloaded: false,
    audioDownloaded: false,
    transcriptMetadataPackageBound: packageBound,
    newEmpiricalTestExecuted: false,
    routeRetuned: false,
    diagnosisOrClinicalScreeningClaimed: false,
    finalValidationClaimed: false
  }
};
const receipt = deepFreeze({ ...body, receiptDigest: canonicalDigest(body) });
await writeFile(path.join(outputDir, 'speech-phase3-source-availability.v1.json'), `${JSON.stringify(probe, null, 2)}\n`);
await writeFile(path.join(outputDir, 'speech-phase3-track-receipt.v1.json'), `${JSON.stringify(receipt, null, 2)}\n`);
console.log(JSON.stringify(receipt, null, 2));
