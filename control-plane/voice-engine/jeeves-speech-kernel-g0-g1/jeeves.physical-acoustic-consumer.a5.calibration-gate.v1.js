'use strict';

const REQUIRED_MEASURED = Object.freeze([
  'vowelFormants',
  'formantBandwidths',
  'vocalTractLengthScale',
  'nasalPolesAndZeros',
  'glottalOpenQuotient',
  'glottalClosingQuotient',
  'spectralTilt',
  'aspirationByContext',
  'jitterStatistics',
  'shimmerStatistics'
]);

function isBoundOriginal(referenceAudio) {
  return !!referenceAudio &&
    referenceAudio.status === 'BOUND_AUTHORIZED_ORIGINAL' &&
    typeof referenceAudio.sha256 === 'string' && /^[a-f0-9]{64}$/.test(referenceAudio.sha256) &&
    typeof referenceAudio.provenanceId === 'string' && referenceAudio.provenanceId.trim().length > 0 &&
    typeof referenceAudio.transcript === 'string' && referenceAudio.transcript.trim().length > 0;
}

function evaluateCalibrationAdmission(profile, measurementPackage) {
  if (!profile || profile.characterId !== 'jeeves') return Object.freeze({result:'FAIL_PROFILE_INVALID'});
  if (!profile.acousticIdentity || profile.creativeDirection?.target !== 'ORIGINAL_DIAMOND_GATE_IDENTITY') {
    return Object.freeze({result:'FAIL_PROFILE_INVALID'});
  }
  if (!isBoundOriginal(measurementPackage?.referenceAudio)) {
    return Object.freeze({
      result:'FAIL_REFERENCE_REQUIRED',
      lawfulProfileOnlyUse:true,
      missingMeasuredParameters:REQUIRED_MEASURED
    });
  }
  const measured = measurementPackage.measuredParameters;
  if (!measured || typeof measured !== 'object') {
    return Object.freeze({result:'FAIL_MEASUREMENTS_REQUIRED', missingMeasuredParameters:REQUIRED_MEASURED});
  }
  const missing = REQUIRED_MEASURED.filter((key) => measured[key] == null);
  if (missing.length) return Object.freeze({result:'FAIL_MEASUREMENTS_REQUIRED', missingMeasuredParameters:missing});
  return Object.freeze({result:'PASS_CALIBRATION_ADMISSIBLE'});
}

module.exports=Object.freeze({REQUIRED_MEASURED,isBoundOriginal,evaluateCalibrationAdmission});
