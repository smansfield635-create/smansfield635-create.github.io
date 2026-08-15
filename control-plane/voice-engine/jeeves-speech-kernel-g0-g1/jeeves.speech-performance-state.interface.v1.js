'use strict';

const CONTRACT = Object.freeze({
  characterId: 'jeeves',
  deliveryModes: new Set(['conversation', 'orientation', 'compassNarration']),
  numeric: Object.freeze({
    speechRateScale: [0.65, 1.35],
    wordGapMs: [20, 180],
    conceptPauseMs: [0, 900],
    boundaryPauseMs: [80, 1400],
    stressStrength: [0, 1],
    f0CenterHz: [90, 150],
    f0ExcursionSemitones: [0, 8],
    energyScale: [0.45, 0.80],
    energyVariance: [0, 0.25],
    attackMs: [4, 80],
    urgency: [0, 1],
    restraint: [0, 1]
  }),
  enums: Object.freeze({
    terminalCadence: new Set(['resolved', 'open', 'questioning']),
    pauseLaw: new Set(['meaning-first']),
    theatricality: new Set(['prohibited'])
  }),
  prohibitedFields: new Set([
    'waveform', 'waveformSamples', 'phonemeSubstitutions', 'formants',
    'formantFrequencies', 'formantBandwidths', 'glottalParameters',
    'turbulenceSpectrum', 'nasalCoupling', 'coarticulationTrajectory',
    'learnedResidual', 'referenceEmbedding', 'voiceIdentityEmbedding',
    'thirdPartyVoiceIdentity'
  ])
});

function isNonEmptyString(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

function stable(value) {
  if (Array.isArray(value)) return value.map(stable);
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.keys(value).sort().map((key) => [key, stable(value[key])]));
  }
  return value;
}

function canonicalJson(value) {
  return JSON.stringify(stable(value));
}

function validateEnvelope(envelope) {
  if (!envelope || typeof envelope !== 'object' || Array.isArray(envelope)) return 'FAIL_SCHEMA';
  if (envelope.characterId !== CONTRACT.characterId) return 'FAIL_IDENTITY';
  for (const key of ['utteranceId', 'text', 'semanticIntent', 'governanceStateId']) {
    if (!isNonEmptyString(envelope[key])) return 'FAIL_SCHEMA';
  }
  if (!CONTRACT.deliveryModes.has(envelope.deliveryMode)) return 'FAIL_SCHEMA';
  if (envelope.semanticAnchors != null) {
    if (!Array.isArray(envelope.semanticAnchors) || envelope.semanticAnchors.some((v) => !isNonEmptyString(v))) return 'FAIL_SCHEMA';
    for (const span of envelope.semanticAnchors) if (!envelope.text.includes(span)) return 'FAIL_TEXT_MUTATION';
  }
  if (envelope.coherenceState != null && !Number.isFinite(envelope.coherenceState)) return 'FAIL_SCHEMA';
  return 'PASS';
}

function validatePerformanceState(state) {
  if (!state || typeof state !== 'object' || Array.isArray(state)) return 'FAIL_SCHEMA';
  for (const key of Object.keys(state)) if (CONTRACT.prohibitedFields.has(key)) return 'FAIL_PROHIBITED_FIELD';
  for (const [key, [min, max]] of Object.entries(CONTRACT.numeric)) {
    const value = state[key];
    if (!Number.isFinite(value)) return 'FAIL_SCHEMA';
    if (value < min || value > max) return 'FAIL_RANGE';
  }
  for (const [key, values] of Object.entries(CONTRACT.enums)) {
    if (!values.has(state[key])) return 'FAIL_SCHEMA';
  }
  return 'PASS';
}

function validatePerformanceTransition({ envelope, originalText, performanceState }) {
  const envelopeResult = validateEnvelope(envelope);
  if (envelopeResult !== 'PASS') return envelopeResult;
  if (originalText != null && envelope.text !== originalText) return 'FAIL_TEXT_MUTATION';
  return validatePerformanceState(performanceState);
}

module.exports = Object.freeze({
  CONTRACT,
  canonicalJson,
  validateEnvelope,
  validatePerformanceState,
  validatePerformanceTransition
});
