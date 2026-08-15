'use strict';

const assert = require('assert');
const I = require('./jeeves.speech-performance-state.interface.v1.js');

const envelope = Object.freeze({
  characterId: 'jeeves',
  utteranceId: 'COMPASS_C01',
  text: 'Navigation requires orientation.',
  deliveryMode: 'compassNarration',
  semanticIntent: 'REFLECTIVE_ASSERTION',
  governanceStateId: 'JEEVES_GOV_TEST_001',
  contextStateId: 'COMPASS_CH01',
  historyStateId: null,
  semanticAnchors: ['Navigation', 'orientation'],
  pressureClass: 'LOW',
  coherenceState: 1
});

const state = Object.freeze({
  speechRateScale: 0.86,
  wordGapMs: 66,
  conceptPauseMs: 180,
  boundaryPauseMs: 420,
  stressStrength: 0.62,
  f0CenterHz: 118,
  f0ExcursionSemitones: 2.8,
  energyScale: 0.52,
  energyVariance: 0.06,
  attackMs: 12,
  urgency: 0.12,
  restraint: 0.90,
  terminalCadence: 'resolved',
  pauseLaw: 'meaning-first',
  theatricality: 'prohibited'
});

assert.equal(I.validatePerformanceTransition({envelope, originalText: envelope.text, performanceState: state}), 'PASS');
assert.equal(I.validateEnvelope({...envelope, characterId: 'elara'}), 'FAIL_IDENTITY');
assert.equal(I.validatePerformanceTransition({envelope: {...envelope, text: 'Changed.'}, originalText: envelope.text, performanceState: state}), 'FAIL_TEXT_MUTATION');
assert.equal(I.validatePerformanceState({...state, f0CenterHz: 240}), 'FAIL_RANGE');
assert.equal(I.validatePerformanceState({...state, waveformSamples: [0, 0]}), 'FAIL_PROHIBITED_FIELD');
assert.equal(I.validatePerformanceState({...state, theatricality: 'dramatic'}), 'FAIL_SCHEMA');
assert.equal(I.canonicalJson({b: 2, a: 1}), '{"a":1,"b":2}');

console.log('JEEVES_SPEECH_PERFORMANCE_STATE_INTERFACE_v1 PASS');
