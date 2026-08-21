import fs from 'node:fs';
import crypto from 'node:crypto';
import {
  AUDRALIA_GRATITUDE_GEOGRAPHIC_TRANSFER_CONTRACT_ID,
  AUDRALIA_GRATITUDE_FIXED_GEOGRAPHIC_CONTROLS,
  describeAudraliaGratitudeGeographicTransfer,
  resolveAudraliaGratitudeShorelineZ,
  sampleAudraliaGratitudeTerrain
} from '../integration/audralia.gratitude-geographic-transfer.v1.js';
import {
  H_EARTH_TERRAIN_FIELD,
  getHEarthCanonicalShorelineZ
} from '../terrain/h-earth.terrain-field.js';

const OPERATION_ID = 'AUDRALIA_PC1_ABC_GRATITUDE_GEOGRAPHIC_SUCCESSOR_CONSTRUCTION_20260820_002';
const GOVERNING_HEAD = '6ba7ae760ed71a434c0a11717293195feabc7625';
const TRANSFER_PATH = 'h-earth-3d/integration/audralia.gratitude-geographic-transfer.v1.js';
const RENDERER_PATH = 'showroom/globe/h-earth/terrain-estate-construction-v1/renderer.mjs';
const APP_PATH = 'showroom/globe/audralia/weather-presentation-reconciliation/app.mjs';
const VERIFIER_PATH = 'h-earth-3d/validation/audralia.gratitude-geographic-convergence.v1.mjs';
const EXPECTED_PATHS = [TRANSFER_PATH, RENDERER_PATH, APP_PATH, VERIFIER_PATH];
const TRANSFER_IMPORT = '../../../../h-earth-3d/integration/audralia.gratitude-geographic-transfer.v1.js';
const issues = [];
const diagnostics = {
  operationId: OPERATION_ID,
  governingHead: GOVERNING_HEAD,
  fixedCoastalOrder: [],
  canonicalShorelineChecks: 0,
  extendedDomainChecks: 0,
  continuationChecks: 0,
  terrainChecks: 0,
  consumerChecks: 0,
  forbiddenScopeChecks: 0
};
const fail = (condition, code) => { if (!condition) issues.push(code); };
const sha256 = text => crypto.createHash('sha256').update(text).digest('hex');

const description = describeAudraliaGratitudeGeographicTransfer();
fail(AUDRALIA_GRATITUDE_GEOGRAPHIC_TRANSFER_CONTRACT_ID === 'AUDRALIA_GRATITUDE_GEOGRAPHIC_TRANSFER_AUTHORITY_v1', 'TRANSFER_CONTRACT_ID_MISMATCH');
fail(description.worldIdentity === 'AUDRALIA', 'WORLD_IDENTITY_MISMATCH');
fail(description.continentIdentity === 'GRATITUDE', 'CONTINENT_IDENTITY_MISMATCH');
fail(description.proximityExpression === 'H_EARTH', 'PROXIMITY_IDENTITY_MISMATCH');
fail(description.otherContinentsCanonical === false, 'OTHER_CONTINENTS_CANONIZATION_LEAK');
fail(description.hEarthQualifiedPresentationRadiusMutated === false, 'H_EARTH_PRESENTATION_RADIUS_AUTHORITY_LEAK');
fail(description.weatherAuthorityCreated === false && description.cloudAuthorityCreated === false, 'WEATHER_OR_CLOUD_SCOPE_LEAK');
fail(description.cameraAuthorityCreated === false && description.zoomAuthorityCreated === false, 'ZOOM_OR_CAMERA_AUTHORITY_LEAK');

diagnostics.fixedCoastalOrder = [...AUDRALIA_GRATITUDE_FIXED_GEOGRAPHIC_CONTROLS.coastalOrder];
const expectedOrder = [
  'GRATITUDE_WESTERN_PENINSULA',
  'GRATITUDE_WESTERN_GULF',
  'GRATITUDE_CENTRAL_HEADLAND',
  'GRATITUDE_SANCTUARY_BAY',
  'GRATITUDE_HARBOR_HEADLAND',
  'GRATITUDE_BAY',
  'GRATITUDE_EASTERN_HEADLAND',
  'GRATITUDE_EASTERN_PENINSULA'
];
fail(JSON.stringify(diagnostics.fixedCoastalOrder) === JSON.stringify(expectedOrder), 'GEOGRAPHIC_FEATURE_ORDER_MISMATCH');

for (const x of [-256, -220, -170, -125, -82, 0, 48, 118, 198, 232, 256]) {
  const canonical = getHEarthCanonicalShorelineZ(x);
  const transfer = resolveAudraliaGratitudeShorelineZ(x);
  diagnostics.canonicalShorelineChecks += 1;
  fail(Math.abs(canonical - transfer) <= 1e-9, `CANONICAL_SHORELINE_DRIFT:${x}`);
}

for (const x of [-1024, -768, -512, 512, 768, 1024]) {
  const canonical = getHEarthCanonicalShorelineZ(x);
  const transfer = resolveAudraliaGratitudeShorelineZ(x);
  diagnostics.extendedDomainChecks += 1;
  fail(Math.abs(canonical - transfer) <= 1e-9, `EXTENDED_DOMAIN_SHORELINE_DRIFT:${x}`);
}

for (const x of [-1700, -1300, 1300, 1700]) {
  const z = resolveAudraliaGratitudeShorelineZ(x);
  diagnostics.continuationChecks += 1;
  fail(Number.isFinite(z), `UNSEEN_COMPLETION_NONFINITE:${x}`);
}

for (const [x, z] of [[-220,-100],[-170,-120],[-82,-120],[118,-140],[148,-224],[86,-235],[18,-192]]) {
  const sample = sampleAudraliaGratitudeTerrain(x, z);
  diagnostics.terrainChecks += 1;
  fail(sample?.valid === true, `TRANSFER_SAMPLE_INVALID:${x}:${z}`);
  fail(sample?.geographyAuthority === AUDRALIA_GRATITUDE_GEOGRAPHIC_TRANSFER_CONTRACT_ID, `TRANSFER_AUTHORITY_MISMATCH:${x}:${z}`);
  fail(Number.isFinite(sample?.presentationElevation), `TRANSFER_ELEVATION_NONFINITE:${x}:${z}`);
}

fail(H_EARTH_TERRAIN_FIELD.worldDomain.xMinimum === -1024 && H_EARTH_TERRAIN_FIELD.worldDomain.xMaximum === 1024, 'CANONICAL_WORLD_X_DOMAIN_MISMATCH');
fail(H_EARTH_TERRAIN_FIELD.worldDomain.zMinimum === -1024 && H_EARTH_TERRAIN_FIELD.worldDomain.zMaximum === 768, 'CANONICAL_WORLD_Z_DOMAIN_MISMATCH');

const rendererSource = fs.readFileSync(RENDERER_PATH, 'utf8');
const appSource = fs.readFileSync(APP_PATH, 'utf8');
for (const [path, source] of [[RENDERER_PATH, rendererSource], [APP_PATH, appSource]]) {
  diagnostics.consumerChecks += 1;
  fail(source.includes(TRANSFER_IMPORT), `CONSUMER_NOT_REBOUND:${path}`);
  fail(!source.includes("../../../../h-earth-3d/terrain/h-earth.terrain-estate-construction-v1.candidate.js"), `LEGACY_GEOGRAPHY_IMPORT_RETAINED:${path}`);
}

const forbiddenTokens = [
  'exterior-weather.mjs',
  'ow01-evolving-cloud-state-v1',
  'planetary-world-frame.js',
  'functional-landscape/'
];
for (const token of forbiddenTokens) {
  diagnostics.forbiddenScopeChecks += 1;
  fail(!rendererSource.includes(`MUTATE:${token}`) && !appSource.includes(`MUTATE:${token}`), `FORBIDDEN_SCOPE_MARKER:${token}`);
}

const sourceFingerprint = sha256(EXPECTED_PATHS.map(path => `${path}:${fs.existsSync(path) ? sha256(fs.readFileSync(path)) : 'MISSING'}`).join('\n'));
const receipt = {
  schema: 'AUDRALIA_GRATITUDE_GEOGRAPHIC_CONVERGENCE_RECEIPT_v1',
  operationId: OPERATION_ID,
  governingHead: GOVERNING_HEAD,
  result: issues.length === 0 ? 'PASS' : 'FAIL',
  transferContractId: AUDRALIA_GRATITUDE_GEOGRAPHIC_TRANSFER_CONTRACT_ID,
  expectedPathSet: EXPECTED_PATHS,
  geographyAuthorityCount: 1,
  otherContinentsCanonical: false,
  weatherCloudAtmosphereMutated: false,
  hEarthProximityBaselineMutated: false,
  zoomCameraSemanticsMutated: false,
  sourceFingerprint,
  diagnostics,
  issues
};
receipt.receiptSha256 = sha256(JSON.stringify(receipt));
process.stdout.write(JSON.stringify(receipt, null, 2));
if (issues.length) process.exitCode = 1;
