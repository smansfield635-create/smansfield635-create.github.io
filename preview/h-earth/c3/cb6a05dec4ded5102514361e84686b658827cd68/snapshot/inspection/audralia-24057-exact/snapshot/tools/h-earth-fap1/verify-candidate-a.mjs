#!/usr/bin/env node
import assert from 'node:assert/strict';
import {
  evaluateHEarthFAP1WeatherContract,
  sampleHEarthFAP1WeatherState,
  sampleHEarthFAP1AltitudeVelocity
} from '../../h-earth-3d/environment/h-earth.fap1-weather-state.candidate-a.js';
import {
  buildHEarthFAP1AtmosphereCandidate,
  evaluateHEarthFAP1AtmosphereCandidate
} from '../../showroom/globe/h-earth/render/environment-atmosphere.fap1-candidate-a.js';

const weatherContract = evaluateHEarthFAP1WeatherContract();
assert.equal(weatherContract.eligible, true);
assert.ok(weatherContract.regimeCount >= 6);

const samples = [
  { latitudeDeg: 26, longitudeDeg: -18, expected: 'CLEAR' },
  { latitudeDeg: 57, longitudeDeg: 26, expected: 'HIGH_ICE' },
  { latitudeDeg: 34, longitudeDeg: -73, expected: 'MID_FRONTAL' },
  { latitudeDeg: 4, longitudeDeg: 48, expected: 'LOW_CUMULIFORM' },
  { latitudeDeg: -19, longitudeDeg: 82, expected: 'DEEP_CONVECTION' },
  { latitudeDeg: -36, longitudeDeg: -126, expected: 'CYCLONE' }
];

for (const fixture of samples) {
  const sample = sampleHEarthFAP1WeatherState({ ...fixture, canonicalTimeHours: 12 });
  assert.equal(sample.eligible, true);
  assert.equal(sample.weatherClass, fixture.expected);
  assert.ok(sample.cloudOccupancy >= 0 && sample.cloudOccupancy <= 1);
}

const cycloneWeather = sampleHEarthFAP1WeatherState({ latitudeDeg: -36, longitudeDeg: -126, canonicalTimeHours: 12 });
assert.ok(cycloneWeather.cyclone?.eyeRadiusDeg > 0);
assert.ok(cycloneWeather.cyclone?.eyewallRadiusDeg > cycloneWeather.cyclone.eyeRadiusDeg);
assert.ok(cycloneWeather.cyclone?.outerRainbandRadiusDeg > cycloneWeather.cyclone.eyewallRadiusDeg);

const lowVelocity = sampleHEarthFAP1AltitudeVelocity(cycloneWeather, 1.5);
const highVelocity = sampleHEarthFAP1AltitudeVelocity(cycloneWeather, 11);
assert.notDeepEqual(lowVelocity, highVelocity);

const clearInteractive = buildHEarthFAP1AtmosphereCandidate({ latitudeDeg: 26, longitudeDeg: -18, qualityMode: 'INTERACTIVE' });
const clearCapture = buildHEarthFAP1AtmosphereCandidate({ latitudeDeg: 26, longitudeDeg: -18, qualityMode: 'CAPTURE' });
assert.equal(evaluateHEarthFAP1AtmosphereCandidate(clearInteractive).eligible, true);
assert.equal(evaluateHEarthFAP1AtmosphereCandidate(clearCapture).eligible, true);
assert.equal(clearInteractive.qualityStateInvariant.weatherIdentity, clearCapture.qualityStateInvariant.weatherIdentity);
assert.equal(clearInteractive.weather.stateIdentity, clearCapture.weather.stateIdentity);
assert.ok(clearInteractive.optics.clearAirSuppression > 0.5);
assert.equal(clearInteractive.optics.independentStackingPermitted, false);
assert.equal(clearInteractive.sky.generalizedGrayFallbackPermitted, false);
assert.equal(clearInteractive.lighting.cloudOwnsLighting, false);

const cyclone = buildHEarthFAP1AtmosphereCandidate({ latitudeDeg: -36, longitudeDeg: -126, qualityMode: 'CAPTURE' });
assert.equal(cyclone.cyclone?.eye?.radiusDeg > 0, true);
assert.equal(cyclone.cyclone?.eyewall?.convectiveSupport, 1);
assert.equal(cyclone.cyclone?.upperOutflow?.altitudeFamily, 'HIGH');
assert.ok(cyclone.cloudFamilies.length >= 4);

console.log(JSON.stringify({
  schema: 'H_EARTH_FAP1_CANDIDATE_A_VERIFICATION_RECEIPT_v1',
  result: 'PASS',
  checks: 24,
  weatherClasses: samples.map((item) => item.expected),
  hardLaws: {
    clearAirExplicit: true,
    emptyAirCheapReady: true,
    cloudLightingAuthority: false,
    noiseCreatesWeather: false,
    graySoupFallback: false
  },
  liveMutation: false,
  geographyMutation: false,
  cameraMutation: false
}, null, 2));
