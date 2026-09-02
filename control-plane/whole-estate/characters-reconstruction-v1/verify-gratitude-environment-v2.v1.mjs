import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {execFileSync} from 'node:child_process';
import {GRATITUDE_COAST_NIGHT,NIGHT_FRAGMENT_SHADER,nightUniforms} from '../../../characters/night-renderer.mjs';
import {evaluateStep9RegionalBridge} from '../../../characters/step9-regional-geography.mjs';

const rendererSource=await readFile(new URL('../../../characters/night-renderer.mjs',import.meta.url),'utf8');
const appSource=await readFile(new URL('../../../characters/app.mjs',import.meta.url),'utf8');

assert.equal(GRATITUDE_COAST_NIGHT.rendererId,'CHARACTERS_GRATITUDE_ENVIRONMENT_RENDERER_V2');
assert.equal(GRATITUDE_COAST_NIGHT.atmosphere.basinMist,true);
assert.equal(GRATITUDE_COAST_NIGHT.atmosphere.distanceDesaturation,true);
assert.equal(GRATITUDE_COAST_NIGHT.atmosphere.horizonScattering,true);
assert.equal(GRATITUDE_COAST_NIGHT.performance.waterNormalSamples,3);
assert.equal(GRATITUDE_COAST_NIGHT.performance.mobileMeshUnchanged,true);

for(const token of [
  'vec2 warp(',
  'float waterField(',
  'vec3 waterNormal(',
  'float moonBand=',
  'float basin=',
  'float valleyMist=',
  'float hazeAmount=',
  'float nightDesaturate='
]) assert.ok(NIGHT_FRAGMENT_SHADER.includes(token),`ENVIRONMENT_V2_SHADER_TOKEN_MISSING:${token}`);

for(const forbidden of [
  'H_EARTH_TERRAIN_FIELD',
  'AUDRALIA_GRATITUDE_GEOGRAPHIC_TRANSFER',
  'MIRROR_MANOR',
  'GRATITUDE_DEVELOPMENT_ANCHOR_SPECS'
]) assert.equal(rendererSource.includes(forbidden),false,`ENVIRONMENT_RENDERER_AUTHORITY_OR_OBJECT_LEAK:${forbidden}`);

assert.ok(appSource.includes("const shorelineZ=x=>step9ShorelineZ(x);"),'CANONICAL_SHORELINE_DERIVATION_MISSING');
assert.ok(appSource.includes("function meshWater(){const S=compact?96:180,R=compact?4:6"),'SHORELINE_DERIVED_WATER_MESH_MISSING');
assert.ok(appSource.includes("shore=shorelineZ(x)+1.5"),'WATER_EDGE_NOT_DERIVED_FROM_CANONICAL_SHORELINE');
assert.equal(appSource.includes('marginZ=350'),false,'LEGACY_RECTANGULAR_WATER_MESH_RESTORED');

const uniforms=nightUniforms({environment:{}});
assert.ok(uniforms.lunarIntensity>=0.7&&uniforms.lunarIntensity<=1.1,'LUNAR_INTENSITY_OUT_OF_NIGHT_RANGE');
assert.ok(uniforms.horizonHaze>=0.2&&uniforms.horizonHaze<=0.6,'HORIZON_HAZE_OUT_OF_NIGHT_RANGE');
assert.ok(uniforms.waterMoonResponse>=0.7&&uniforms.waterMoonResponse<=1.2,'WATER_MOON_RESPONSE_OUT_OF_RANGE');

const step9=evaluateStep9RegionalBridge();
assert.equal(step9.status,'PASS',`STEP9_REGIONAL_BRIDGE_REGRESSION:${step9.issues.join(',')}`);
assert.equal(step9.geographyAuthority,'AUDRALIA_GRATITUDE_GEOGRAPHIC_TRANSFER_AUTHORITY_v1');
assert.equal(step9.terrainEquationsOwnedByCharacters,false);
assert.equal(step9.shorelineCoordinatesOwnedByCharacters,false);
assert.equal(step9.scenesConstructed,false);
assert.equal(step9.gameplayConstructed,false);

let changed=[];
try{
  changed=execFileSync('git',['diff','--name-only','origin/main...HEAD'],{encoding:'utf8'}).trim().split(/\r?\n/).filter(Boolean);
}catch{
  changed=execFileSync('git',['diff','--name-only','HEAD^...HEAD'],{encoding:'utf8'}).trim().split(/\r?\n/).filter(Boolean);
}
const normalizePath=value=>String(value||'').trim().replace(/^\.\//,'').replaceAll('\\','/').normalize('NFC');
changed=changed.map(normalizePath).filter(Boolean);
const allowed=[
  'characters/app.mjs',
  'characters/night-renderer.mjs',
  'control-plane/whole-estate/characters-reconstruction-v1/verify-gratitude-environment-v2.v1.mjs',
  'control-plane/whole-estate/characters-reconstruction-v1/verify-step10-browser.mjs',
  '.github/workflows/characters-environment-v2-qualification.yml'
].map(normalizePath);
const outOfScope=changed.filter(path=>!allowed.some(expected=>path===expected||path.endsWith(`/${expected}`)));
assert.deepEqual(outOfScope,[],`ENVIRONMENT_V2_SCOPE_LEAK:${outOfScope.join(',')}`);

console.log(JSON.stringify({
  schema:'CHARACTERS_GRATITUDE_ENVIRONMENT_V2_QUALIFICATION_RECEIPT_v1',
  result:'PASS',
  rendererId:GRATITUDE_COAST_NIGHT.rendererId,
  geographyAuthority:step9.geographyAuthority,
  geographyMutation:false,
  shorelineAuthorityCreated:false,
  waterMeshDerivedFromCanonicalShoreline:true,
  manorOrDestinationObjectConstruction:false,
  shaderFeatures:{domainWarpedWater:true,brokenMoonPath:true,multiscaleTerrain:true,basinMist:true,distanceDesaturation:true},
  changedFiles:changed
},null,2));
