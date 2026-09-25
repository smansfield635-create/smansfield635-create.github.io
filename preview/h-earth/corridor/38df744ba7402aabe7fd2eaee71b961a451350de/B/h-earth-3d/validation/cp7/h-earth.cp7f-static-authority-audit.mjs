import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';
import authority from '../../control-plane/post-cp2-round2/cp7/h-earth.cp7f-static-authority-audit.v1.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '../../..');
const outputPath = process.argv[2]
  ? path.resolve(ROOT, process.argv[2])
  : path.join(ROOT, 'h-earth-3d/validation/cp7/h-earth.cp7f-static-authority-audit.receipt.v1.json');
const git = (...args) => execFileSync('git', args, { cwd: ROOT, encoding: 'utf8' }).trim();
const checks = [];
const failures = [];
const check = (id, passed, detail = null) => {
  checks.push({ id, status: passed ? 'PASS' : 'FAIL', passed, detail });
  if (!passed) failures.push({ id, detail });
};
const count = (source, token) => source.split(token).length - 1;
const sha256 = (value) => crypto.createHash('sha256').update(value).digest('hex');

const base = authority.controllingBasis.cp7eMergeHead;
const head = git('rev-parse', 'HEAD');
const changedPaths = git('diff', '--name-only', `${base}..${head}`).split(/\r?\n/).filter(Boolean).sort();
const expectedPaths = [...authority.exactSubcheckpoint7FPathScope].sort();
check('EXACT_CP7E_BASE', git('merge-base', base, head) === base, { base, head });
check('EXACT_7F_PATH_SCOPE', JSON.stringify(changedPaths) === JSON.stringify(expectedPaths), { changedPaths, expectedPaths });
check('NO_7F_PRODUCT_MUTATION', changedPaths.every((entry) => !entry.startsWith('showroom/')), { productPaths: changedPaths.filter((entry) => entry.startsWith('showroom/')) });

for (const [id, record] of Object.entries({
  ACCEPTED_RENDERER: { path: authority.controllingBasis.acceptedRendererPath, blob: authority.controllingBasis.acceptedRendererBlob },
  GENERATOR: { path: authority.controllingBasis.generatorPath, blob: authority.controllingBasis.generatorBlob },
  CANDIDATE_RENDERER: { path: authority.controllingBasis.candidateRendererPath, blob: authority.controllingBasis.candidateRendererBlob },
  TERRAIN: { path: authority.controllingBasis.terrainPath, blob: authority.controllingBasis.terrainBlob },
  LIVE_HOST: { path: authority.controllingBasis.liveHostPath, blob: authority.controllingBasis.liveHostBlob },
  LIVE_BINDING: { path: authority.controllingBasis.liveBindingPath, blob: authority.controllingBasis.liveBindingBlob }
})) {
  const actual = git('hash-object', record.path);
  check(`${id}_BLOB_EXACT`, actual === record.blob, { path: record.path, expected: record.blob, actual });
}

const cp7ProductPaths = git('diff', '--name-only', `${authority.controllingBasis.cp7aMergeHead}..${head}`)
  .split(/\r?\n/).filter((entry) => entry.startsWith('showroom/')).sort();
const expectedProductPaths = [...authority.authorizedProductPathsAcrossCheckpoint7].sort();
check('WHOLE_CP7_PRODUCT_SCOPE_EXACT', JSON.stringify(cp7ProductPaths) === JSON.stringify(expectedProductPaths), { cp7ProductPaths, expectedProductPaths });

const candidatePath = path.join(ROOT, authority.controllingBasis.candidateRendererPath);
const generatorPath = path.join(ROOT, authority.controllingBasis.generatorPath);
const candidateSource = fs.readFileSync(candidatePath, 'utf8');
const generatorSource = fs.readFileSync(generatorPath, 'utf8');
execFileSync(process.execPath, ['--check', candidatePath], { cwd: ROOT, stdio: 'pipe' });
execFileSync(process.execPath, ['--check', generatorPath], { cwd: ROOT, stdio: 'pipe' });
check('PRODUCT_SOURCES_PARSE', true);

const prohibitedTokens = [
  'SCENE_01','SCENE_02','SCENE_03','SCENE_04','SCENE_05','SCENE_06','SCENE_07','SCENE_08',
  'cameraId','targetName','gl_FragCoord','uTime','Date.now','performance.now','Math.random','requestAnimationFrame',
  'texSubImage2D','HEIGHTFIELD_MUTATION','GEOMETRY_MUTATION'
];
const foundProhibited = prohibitedTokens.filter((token) => candidateSource.includes(token));
check('NO_PROHIBITED_TECHNIQUE_TOKENS', foundProhibited.length === 0, { foundProhibited });
check('ACCEPTED_RENDERER_IS_WRAPPED_NOT_COPIED', candidateSource.includes("from './persistent-live-renderer.run8e-r3c.cp2-round1-1f520809.js'") && !candidateSource.includes('const FS = `#version'));
check('CANONICAL_CONTROL_FIELD_CONSUMED', candidateSource.includes("from './terrain-control-field.cp2-round2.v1.js'") && candidateSource.includes('getHEarthTerrainControlFieldReceipt'));
check('FIXED_WEIGHT_WITHIN_BOUND', candidateSource.includes('H_EARTH_CP7E_MATERIAL_MODULATION_WEIGHT = 0.72') && authority.resourceBudget.textureSamplesPerTerrainFragmentMaximum === 3);
check('EXACT_THREE_SHADER_TEXTURE_SAMPLES', count(candidateSource, 'texture(uTerrainControl,') === 3, { actual: count(candidateSource, 'texture(uTerrainControl,') });
check('NO_DYNAMIC_PROCEDURAL_OCTAVE_LOOPS', candidateSource.includes('H_EARTH_CP7E_DYNAMIC_PROCEDURAL_OCTAVE_LOOPS = 0'));
check('ONE_CONTROL_TEXTURE_CREATION_SITE', count(candidateSource, 'gl.createTexture()') === 1, { actual: count(candidateSource, 'gl.createTexture()') });
check('ONE_CONTROL_TEXTURE_UPLOAD_SITE', count(candidateSource, 'gl.texImage2D(') === 1, { actual: count(candidateSource, 'gl.texImage2D(') });
check('MIPMAP_AND_CLAMP_CONFIGURATION_PRESENT', candidateSource.includes('gl.generateMipmap(gl.TEXTURE_2D)') && count(candidateSource, 'gl.CLAMP_TO_EDGE') === 2);
check('PHASE_WARP_LOCALIZED_TO_ACCEPTED_SIGNALS', ['CONTROL_FIELD_PHASE_WARP','CONTROL_FIELD_CONTOUR_AND_RAKE','acceptedCp2PaletteAndAmplitudeTermsPreserved: true','manorCavernRavineAndContactTermsPreserved: true'].every((token) => candidateSource.includes(token)));
check('FLOW_DRAINAGE_CURVATURE_INPUTS_PRESENT', ['downslope','crossSlope','drainage','landform','flowDelta','curvatureDelta','alongFlow','acrossFlow'].every((token) => candidateSource.includes(token)));

const generatorModule = await import(`${pathToFileURL(generatorPath).href}?audit=${head.slice(0, 12)}`);
const fieldReceipt = generatorModule.getHEarthTerrainControlFieldReceipt();
check('CONTROL_FIELD_BASE_BYTES_WITHIN_BUDGET', fieldReceipt.baseByteLength === authority.resourceBudget.controlFieldBaseBytesMaximum, { actual: fieldReceipt.baseByteLength, maximum: authority.resourceBudget.controlFieldBaseBytesMaximum });
check('CONTROL_FIELD_FORMAT_EXACT', fieldReceipt.width === 256 && fieldReceipt.height === 256 && fieldReceipt.storage === 'RGBA8_UNORM');
check('CONTROL_FIELD_DIGEST_EXACT', fieldReceipt.canonicalSha256 === authority.controllingBasis.canonicalControlFieldSha256, { actual: fieldReceipt.canonicalSha256, expected: authority.controllingBasis.canonicalControlFieldSha256 });
check('CONTROL_FIELD_IMMUTABLE_AND_DETERMINISTIC', fieldReceipt.immutablePrivateStorage === true && fieldReceipt.deterministicGeneration === true && fieldReceipt.strictLowerReceiverLaw === true);
check('GENERATOR_SOURCE_HAS_NO_RENDERER_OR_LIVE_AUTHORITY', !generatorSource.includes('live-gpu-binding') && !generatorSource.includes('index.html') && !generatorSource.includes('createHEarthRun8ER3CPersistentRenderer'));
check('BOUNDARY_REMAINS_NONLIVE', authority.boundaries.productMutationPerformed === false && authority.boundaries.browserAcceptancePerformed === false && authority.boundaries.liveAdmissionAuthorized === false && authority.boundaries.liveDefaultPromotionAuthorized === false && authority.boundaries.liveRouteChanged === false);

const stable = {
  receiptType: 'H_EARTH_CP7F_STATIC_AUTHORITY_AUDIT_RECEIPT_v1',
  programCheckpoint: 7,
  boundedSubcheckpoint: '7F',
  result: failures.length === 0 ? authority.result : 'CP7F_STATIC_AUTHORITY_AUDIT_FAIL',
  pass: failures.length === 0,
  exactBaseHead: base,
  executedHead: head,
  changedPaths,
  checkpoint7ProductPaths: cp7ProductPaths,
  candidateRendererBlob: git('hash-object', authority.controllingBasis.candidateRendererPath),
  candidateSourceSha256: sha256(candidateSource),
  generatorBlob: git('hash-object', authority.controllingBasis.generatorPath),
  generatorSourceSha256: sha256(generatorSource),
  canonicalControlFieldSha256: fieldReceipt.canonicalSha256,
  resourceBudget: authority.resourceBudget,
  productMutationPerformed: false,
  liveRouteChanged: false,
  checkpoint7GAuthorized: failures.length === 0,
  checks,
  failureCount: failures.length,
  failures
};
const receipt = { ...stable, canonicalReceiptSha256: sha256(JSON.stringify(stable)) };
fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, `${JSON.stringify(receipt, null, 2)}\n`);
console.log(JSON.stringify(receipt, null, 2));
if (!receipt.pass) process.exitCode = 1;
