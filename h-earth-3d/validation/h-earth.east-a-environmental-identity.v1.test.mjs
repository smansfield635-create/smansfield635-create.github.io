import test from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { gunzipSync } from 'node:zlib';
import { sampleHEarthTerrainElevation } from '../terrain/h-earth.terrain-field.js';

// Source-only Stage A checks. These do NOT constitute GLSL compilation,
// camera screenshots, physical-device validation or owner acceptance.
const renderPath = new URL('../../showroom/globe/h-earth/render/persistent-live-renderer.run8e-r3c.cp2-additive-bandlimited-relief-v2.js', import.meta.url);
const terrainPath = new URL('../terrain/h-earth.terrain-field.js', import.meta.url);
const surfacePath = new URL('../environment/h-earth.successor-surface-material.run8c.js', import.meta.url);
const source = readFileSync(renderPath, 'utf8');
const terrainBytes = readFileSync(terrainPath);
const surfaceBytes = readFileSync(surfacePath);
const blob = value => createHash('sha1').update('blob ' + value.byteLength + '\0').update(value).digest('hex');
const begin = '// H_EARTH_EAST_A_ENVIRONMENTAL_IDENTITY_GEN2823_STAGE_A_BEGIN';
const end = '// H_EARTH_EAST_A_ENVIRONMENTAL_IDENTITY_GEN2823_STAGE_A_END';
const occurrences = token => source.split(token).length - 1;

test('Stage A patch is one bounded real terrain shader insertion', () => {
  assert.equal(occurrences(begin), 1);
  assert.equal(occurrences(end), 1);
  assert.ok(source.indexOf(begin) < source.indexOf(end));
  assert.ok(source.indexOf('if(worldSoilTerrain)') < source.indexOf(begin));
  assert.ok(source.indexOf(end) < source.indexOf('base=palette;', source.indexOf(begin)));
  assert.match(source, /bool worldSoilTerrain=geologicalEarthRock\|\|vRoleCode==1u\|\|/);
  const stage = source.slice(source.indexOf(begin), source.indexOf(end));
  assert.match(stage, /if\(!geologicalEarthRock\)/);
  assert.match(stage, /inlandIdentity=smoothstep\(/);
  assert.match(stage, /protectedGrove=1\.0-smoothstep\(/);
  assert.match(stage, /identityWeight=inlandIdentity\*/);
  assert.match(stage, /vec3 ecologicalSoilSubstrate=palette;/);
  assert.match(stage, /float ecologicalDenominator=1\.0\+identityWeight\+groundcoverWeight;/);
  assert.doesNotMatch(stage, /palette=mix\(palette,identityBase,identityWeight\)/);
});

test('Visible ground identities use spatially continuous material mechanisms', () => {
  const stage = source.slice(source.indexOf(begin), source.indexOf(end));
  for (const signal of [
    'vCoastDistanceMeters', 'vWorldPosition.y',
    'macroField', 'mesoField', 'detailField',
    'rockExposure', 'slopeResponse', 'materialVariation',
    'shelteredBasin', 'fertilePatch', 'upperDry', 'mineralExposure'
  ]) assert.ok(stage.includes(signal), 'missing signal ' + signal);
  for (const material of [
    'compactEarth', 'coastalSilt', 'fertileEarth',
    'shelteredEarth', 'dryFoothill', 'erodedMineral'
  ]) assert.match(stage, new RegExp('vec3 ' + material + '=vec3\\('));
  assert.ok(stage.includes('not a claim of a new freshwater river'));
});

test('Approved real soil image and independent native shoreline/woodland/plant presentation survive', () => {
  for (const token of [
    'H_EARTH_ACTUAL_WORLD_SOIL_MATERIAL_20261010_V2',
    'vec3 worldSoilReference=pow(worldSoilTexel,vec3(2.2))*0.75;',
    'uClearingSoil,worldSoilXZ*0.28',
    'worldSoilAlbedoAuthority',
    '// SHORELINE_SOIL_BEGIN shade',
    'uShorelineSoilCoverage',
    'uWoodlandHabitatEnabled==1',
    'uLandscapeFloorFootprints',
    'vRoleCode==4u',
    'WOODLAND_FINE_GRASS_FS',
    'RENDERED_BEACH_GLSL'
  ]) assert.ok(source.includes(token), 'protected renderer marker missing: ' + token);
});

test('Stage A does not alter canonical B2 terrain or successor material source bytes', () => {
  assert.equal(blob(terrainBytes), '71a95053892140d792573587a6b82798663e3df1');
  assert.equal(blob(surfaceBytes), 'a510fa1da1a5d1852153c9d22d2df4f2a4d4efde');
});

// Next gates: WebGL2 shader link, actual source-to-pixel comparison, mobile
// performance and root/vegetation identity, then owner KEEP|ONE_REPAIR|REJECT.

// Qualified product boundary: the published Gen2666 mesh was not rebaked
// after the B2 canonical sampler changed. A passing witness verifies the
// discrepancy; it is NOT permission to use a second runtime elevation law.
test('B2 precomputed height identity mismatch is detected before Stage B', () => {
  const binary = new URL('../../showroom/globe/h-earth/render/assets/h-earth-canonical-base-world.v1.json.gz', import.meta.url);
  const precomputed = JSON.parse(gunzipSync(readFileSync(binary)).toString('utf8')).canonical;
  const positions = precomputed.buffers.positions;
  const terrainVertices = precomputed.primitiveSpans.find(span => span.role === 'TERRAIN').vertexCount;
  let nearest = -1, best = Infinity;
  for (let i=0; i<terrainVertices; i++) {
    const dx=positions[i*3]-208, dz=positions[i*3+2]+344;
    const distance=dx*dx+dz*dz;
    if(distance<best) {best=distance;nearest=i;}
  }
  assert.ok(nearest>=0 && best<.01, 'EXACT_EAST_A_PACKAGE_VERTEX_MISSING');
  const x=positions[nearest*3], y=positions[nearest*3+1], z=positions[nearest*3+2];
  const b2Elevation=sampleHEarthTerrainElevation(x,z);
  assert.ok(b2Elevation-y>5.5 && b2Elevation-y<6.1,
    'EXPECTED_PUBLISHED_G_WORLD_AND_GEN2666_MESH_DIVERGENCE_NOT_FOUND');
  const canon = readFileSync(new URL('../../showroom/globe/h-earth/render/live-render-package.run8e-r2.canonical.js',import.meta.url),'utf8');
  assert.ok(canon.includes('GEN2666_HYDRATION_BEGIN'));
  assert.ok(canon.includes('48f754ca1b11b8fe7eeb0e8d4573f6b6cb544cf438322a115eb52c44d3b29d5a'));
  assert.ok(source.includes('const elevation=surface.height+(t.elevation-surface.field)*smoothFade;'));
  // The local refinement's field-minus-interpolated-field subtraction
  // cancels B2 at old mesh vertices, and the initial patch is 128 m wide.
  // This recorded discrepancy must be reconciled before Stage B is accepted.
});

// Gen2823 owner ONE_REPAIR: source-bound weight budget, not visual acceptance.
test('Regional soil color preserves at least 34 percent of preceding approved photo-based albedo', () => {
  const begin = source.indexOf('// H_EARTH_EAST_A_ENVIRONMENTAL_IDENTITY_GEN2823_STAGE_A_BEGIN');
  const end = source.indexOf('// H_EARTH_EAST_A_ENVIRONMENTAL_IDENTITY_GEN2823_STAGE_A_END', begin);
  assert.ok(begin > 0 && end > begin, 'MATERIAL_SCOPE_MISSING');
  const stage = source.slice(begin, end);
  assert.match(stage, /0\.48\+0\.10\*abs\(fertilePatch-0\.5\)\*2\.0\+/);
  assert.match(stage, /0\.08\*mineralExposure,0\.0,0\.66/);
  assert.match(stage, /identityWeight=inlandIdentity\*/);
  assert.match(stage, /\(1\.0-protectedGrove\)\*identityContrast/);
  const weights = [];
  for (const fertilePatch of [0, 0.5, 1]) for (const mineralExposure of [0, 0.5, 1]) {
    const contrast = Math.min(0.66, Math.max(0, 0.48 + 0.10 * Math.abs(fertilePatch - 0.5) * 2 + 0.08 * mineralExposure));
    weights.push(contrast);
    assert.ok(contrast >= 0.48 && contrast <= 0.66, 'PHOTO_ALBEDO_BUDGET_EXCEEDED');
  }
  assert.ok(Math.max(...weights) - Math.min(...weights) > 0.15, 'REGIONAL_DIFFERENTIATION_COLLAPSED');
  assert.ok(source.indexOf('vec3 worldSoilActualAlbedo=') < begin, 'APPROVED_SOIL_TEXTURE_NOT_PRIOR');
  assert.match(stage, /if\(!geologicalEarthRock\)/);
  assert.match(stage, /inlandIdentity=smoothstep\(/);
});

// Gen2823 earth-tone follow-up: the terrain shader must not paint bare ground
// with the green colors already supplied by actual foliage.
test('Bare-ground regional palettes keep foliage green separate', () => {
  const stage = source.slice(source.indexOf(begin), source.indexOf(end));
  const soilColors = {
    compactEarth: [0.390, 0.248, 0.148],
    coastalSilt: [0.520, 0.440, 0.270],
    fertileEarth: [0.300, 0.235, 0.155],
    shelteredEarth: [0.235, 0.188, 0.130],
    dryFoothill: [0.480, 0.315, 0.140],
    erodedMineral: [0.355, 0.333, 0.305]
  };
  for (const [name, rgb] of Object.entries(soilColors)) {
    const declaration = 'vec3 ' + name + '=vec3(' + rgb.map(x => x.toFixed(3)).join(',') + ');';
    assert.ok(stage.includes(declaration), 'EARTH_PALETTE_IDENTITY_' + name);
    assert.ok(rgb[0] > rgb[1] && rgb[1] > rgb[2], 'FOLIAGE_GREEN_IN_BARE_TERRAIN_' + name);
  }
  assert.ok(Math.hypot(...soilColors.fertileEarth.map((x, i) => x - soilColors.shelteredEarth[i])) > 0.08,
    'FERTILE_AND_SHELTERED_SOIL_DIFFERENTIATION_LOST');
  assert.ok(stage.includes('float identityContrast=clamp('), 'COLOR_WEIGHT_CONTROL_MISSING');
  assert.ok(stage.includes('0.48+0.10*abs(fertilePatch-0.5)*2.0+'), 'PREVIOUS_ACCEPTED_BLEND_STRENGTH_CHANGED');
  assert.ok(stage.includes('(1.0-protectedGrove)*identityContrast'), 'GROVE_PROTECTION_CHANGED');
  assert.ok(source.includes('WOODLAND_FINE_GRASS_FS'), 'GREEN_FOLIAGE_SHADER_MISSING');
});


// Gen3313: source-only guard; WebGL2 visual proof and owner KEEP remain separate.
const gen3313Splices = [
  {
    "label": "identity",
    "original": "      float identityWeight=inlandIdentity*\n        (1.0-protectedGrove)*identityContrast;\n      palette=mix(palette,identityBase,identityWeight);",
    "replacement": "      float identityWeight=inlandIdentity*\n        (1.0-protectedGrove)*identityContrast;\n      // A03/A04: the current textured earth remains the common substrate.\n      vec3 ecologicalSoilSubstrate=palette;\n      float ecologicalIdentityLuma=max(\n        dot(identityBase,vec3(0.2126,0.7152,0.0722)),0.001\n      );\n      vec3 ecologicalIdentityHue=clamp(\n        identityBase/ecologicalIdentityLuma,vec3(0.60),vec3(1.60)\n      );\n      vec3 ecologicalIdentityTint=clamp(\n        mix(vec3(1.0),ecologicalIdentityHue,0.24),\n        vec3(0.86),vec3(1.14)\n      );"
  },
  {
    "label": "groundcover",
    "original": "      vec3 groundcoverTone=mix(\n        vec3(0.110,0.118,0.075),vec3(0.075,0.090,0.055),groundcoverMoisture\n      );\n      groundcoverTone=mix(\n        groundcoverTone,vec3(0.175,0.150,0.095),groundcoverDry\n      );\n      groundcoverTone*=0.88+0.24*materialVariation;\n      palette=mix(palette,groundcoverTone,groundcoverWeight);",
    "replacement": "      // Ecological pigment modifies local earth rather than painting olive.\n      vec3 ecologicalGroundcoverTint=mix(\n        vec3(0.965,0.975,0.945),vec3(0.890,0.960,0.900),groundcoverMoisture\n      );\n      ecologicalGroundcoverTint=mix(\n        ecologicalGroundcoverTint,vec3(1.015,0.990,0.965),groundcoverDry\n      );\n      vec3 ecologicalIdentityTarget=ecologicalSoilSubstrate*ecologicalIdentityTint;\n      vec3 ecologicalGroundcoverTarget=ecologicalSoilSubstrate*ecologicalGroundcoverTint;\n      // Nonnegative partition of unity: positive substrate share at every\n      // eligible pixel, including overlap; original supports stay unchanged.\n      float ecologicalDenominator=1.0+identityWeight+groundcoverWeight;\n      palette=(\n        ecologicalSoilSubstrate+\n        identityWeight*ecologicalIdentityTarget+\n        groundcoverWeight*ecologicalGroundcoverTarget\n      )/ecologicalDenominator;"
  },
  {
    "label": "habitat",
    "original": "    base=mix(base,habitatSoil,habitatColorCoverage*.68);",
    "replacement": "    // A03/A04: retain the resident soil grain through later habitat pigment.\n    float ecologicalHabitatLuma=max(\n      dot(habitatSoil,vec3(0.2126,0.7152,0.0722)),0.001\n    );\n    vec3 ecologicalHabitatHue=clamp(\n      habitatSoil/ecologicalHabitatLuma,vec3(0.60),vec3(1.60)\n    );\n    vec3 ecologicalHabitatTint=clamp(\n      mix(vec3(1.0),ecologicalHabitatHue,0.20),\n      vec3(0.88),vec3(1.12)\n    );\n    float ecologicalHabitatWeight=clamp(habitatColorCoverage*0.68,0.0,1.0);\n    base=(base+ecologicalHabitatWeight*(base*ecologicalHabitatTint))\n      /(1.0+ecologicalHabitatWeight);"
  }
];

// The candidate must invert to the exact accepted Git blob by changing only
// three color-composition outputs; roots, native R8, geology and roles are not edited.
test('Gen3313 only three source-relative color operators changed from Gen3259', () => {
  let recovered=source;
  for (const { label, original, replacement } of [...gen3313Splices].reverse()) {
    assert.equal(source.split(replacement).length-1,1,'CANDIDATE_OPERATOR_NONUNIQUE_'+label);
    assert.equal(recovered.split(replacement).length-1,1,'CANDIDATE_INVERSE_NONUNIQUE_'+label);
    recovered=recovered.replace(replacement,original);
  }
  assert.equal(blob(Buffer.from(recovered,'utf8')),'3471d386d720382b1b55b146fef6fa0af61f0d36','ACCEPTED_SOURCE_INVERSION_DRIFT');
  for(const marker of [
    'vec3 worldSoilActualAlbedo=', 'vec3 worldSoilFinal=',
    'float identityWeight=inlandIdentity*', 'float groundcoverWeight=0.88*groundcoverPatch*',
    'float gen3259OriginalHabitat=', 'float gen3259MeadowExcess=',
    'float gen3259RegionalFade=', 'float gen3259SoilStrength=',
    'habitatColorCoverage=gen3259OriginalHabitat',
    'texture(uMeadowGroundOccupancy,meadowUv).r'
  ]) assert.equal(source.split(marker).length-1,1,'GEN3259_GUARD_NOT_UNIQUE_'+marker);
  assert.ok(source.indexOf('habitatColorCoverage=gen3259OriginalHabitat') < source.indexOf('float ecologicalHabitatWeight='),'R8_COVERAGE_MUST_PRECEDE_HABITAT_COMPOSITION');
  assert.ok(source.indexOf('float ecologicalHabitatWeight=') < source.indexOf('terrainRoughnessForLighting=mix(terrainRoughnessForLighting,.94,habitatCoverage*.3);'),'NATIVE_LIGHTING_MUST_FOLLOW_COLOR');
});

test('Gen3313 normalized identity and groundcover retain nonnegative soil share', () => {
  assert.match(source,/float ecologicalDenominator=1\.0\+identityWeight\+groundcoverWeight;/);
  assert.match(source,/ecologicalSoilSubstrate\+\s*identityWeight\*ecologicalIdentityTarget\+\s*groundcoverWeight\*ecologicalGroundcoverTarget/);
  const minShare=1/(1+0.66+0.88);
  for(let i=0;i<=100;i++) for(let j=0;j<=100;j++) {
    const identityWeight=0.66*i/100, groundcoverWeight=0.88*j/100;
    const denominator=1+identityWeight+groundcoverWeight;
    const portions=[1/denominator,identityWeight/denominator,groundcoverWeight/denominator];
    assert.ok(portions.every(x=>x>=0));
    assert.ok(Math.abs(portions.reduce((a,b)=>a+b,0)-1)<1e-12);
    assert.ok(portions[0]>=minShare-1e-12,'SOIL_SHARE_BELOW_ACCEPTED_MINIMUM');
  }
});

test('Gen3313 native habitat/R8 zero and positive coverage cases remain eligible', () => {
  assert.match(source,/float gen3259MeadowExcess=max\(0\.0,meadowOccupancy\*meadowOuterWeight-gen3259OriginalHabitat\)/);
  assert.match(source,/habitatColorCoverage=gen3259OriginalHabitat\s*\+gen3259MeadowExcess\*gen3259SoilStrength\*gen3259RegionalFade/);
  assert.match(source,/float ecologicalHabitatWeight=clamp\(habitatColorCoverage\*0\.68,0\.0,1\.0\)/);
  const coverage=(originalHabitat,occupancy,outerWeight,strength,fade)=>
    originalHabitat+Math.max(0,occupancy*outerWeight-originalHabitat)*strength*fade;
  const weight=value=>Math.max(0,Math.min(1,value*.68));
  assert.equal(weight(coverage(0,0,1,.16,1)),0,'ZERO_OCCUPANCY_ZERO_HABITAT_MUST_NOT_PIGMENT');
  assert.equal(coverage(.4,0,1,.16,1),.4,'NATIVE_HABITAT_MUST_SURVIVE_ZERO_R8');
  assert.ok(weight(coverage(.4,0,1,.16,1))>0,'NATIVE_HABITAT_POSITIVE_ELIGIBILITY');
  assert.ok(weight(coverage(0,1,1,.16,1))>0,'GEN3259_R8_POSITIVE_ELIGIBILITY');
});
