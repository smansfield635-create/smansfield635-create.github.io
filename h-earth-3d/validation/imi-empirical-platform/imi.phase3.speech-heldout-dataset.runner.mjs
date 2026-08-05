import { createRequire } from 'node:module';
import { mkdir, writeFile } from 'node:fs/promises';
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
const clock = () => new Date(argValue('--clock', '2026-08-05T17:45:00.000Z'));
const providedPackage = argValue('--lawful-source-package', null);

async function inspectLocator(url) {
  try {
    const response = await fetch(url, { redirect: 'follow' });
    const text = await response.text();
    const normalized = text.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
    return {
      url,
      httpStatus: response.status,
      ok: response.ok,
      finalUrl: response.url,
      contentBytes: Buffer.byteLength(text, 'utf8'),
      contentDigest: canonicalDigest(text),
      accessSignals: {
        membershipRequired: /membership|member/i.test(normalized),
        registrationRequired: /register|registration/i.test(normalized),
        controlledOrApprovedAccess: /controlled access|approved access|password protected|restricted/i.test(normalized),
        directOpenFeaturePackageAdvertised: /open feature package|direct public csv|download without registration/i.test(normalized)
      }
    };
  } catch (error) {
    return { url, ok: false, error: String(error?.message || error) };
  }
}

await mkdir(outputDir, { recursive: true });
const locatorInspections = await Promise.all(track.lawfulSourceCandidates.map(inspectLocator));
const sourceIdentity = deepFreeze({
  schemaVersion: 'IMI_PHASE_3_SPEECH_HELD_OUT_SOURCE_AVAILABILITY_IDENTITY_v1',
  observedAt: clock().toISOString(),
  locators: locatorInspections,
  providedPackage: providedPackage ? { pathProvided: true, opaquePath: path.basename(providedPackage) } : { pathProvided: false },
  sourceAvailabilityDigest: canonicalDigest({ locatorInspections, providedPackage: Boolean(providedPackage) })
});

if (providedPackage) {
  throw new Error('SPEECH_EXTERNAL_PACKAGE_EXECUTION_REQUIRES_A_SEPARATELY_IMPLEMENTED_AND_REVIEWED_FEATURE_ADAPTER');
}

const body = {
  schemaVersion: 'IMI_PHASE_3_SPEECH_HELD_OUT_REPRODUCTION_RECEIPT_v1',
  operation: 'IMI_PARALLEL_EXTERNAL_TESTS_v1',
  track: track.track,
  result: 'HELD_LAWFUL_HELD_OUT_SPEECH_PACKAGE_NOT_AVAILABLE_TO_EXECUTION',
  terminalDisposition: 'HELD_OPEN_SOURCE_ACCESS_AND_FEATURE_ADAPTER_REQUIRED',
  observedAt: clock().toISOString(),
  routeId: route.routeId,
  routeDigest: canonicalDigest(route),
  sourceIdentity,
  admission: {
    independentPackageProvided: false,
    minimumParticipantCountRequired: 100,
    minimumDeclaredGroupsOrLanguagesRequired: 2,
    frozenFiveFeatureInputsRequired: true,
    minimumEvidenceSatisfied: false
  },
  reason: 'THE_IDENTIFIED_INDEPENDENT_SPEECH_CORPORA_REQUIRE_REGISTRATION_MEMBERSHIP_OR_APPROVED_ACCESS_AND_NO_LAWFULLY_ACCESSIBLE_FROZEN_FIVE_FEATURE_PACKAGE_WAS_PROVIDED_TO_THIS_EXECUTION',
  phase4Candidate: false,
  boundaries: {
    protectedDataAccessAttempted: false,
    authenticationBypassAttempted: false,
    participantRowsInspected: false,
    newEmpiricalTestExecuted: false,
    routeRetuned: false,
    diagnosisOrClinicalScreeningClaimed: false,
    finalValidationClaimed: false
  }
};
const receipt = deepFreeze({ ...body, receiptDigest: canonicalDigest(body) });
await writeFile(path.join(outputDir, 'speech-phase3-source-availability.v1.json'), `${JSON.stringify(sourceIdentity, null, 2)}\n`);
await writeFile(path.join(outputDir, 'speech-phase3-track-receipt.v1.json'), `${JSON.stringify(receipt, null, 2)}\n`);
console.log(JSON.stringify(receipt, null, 2));
