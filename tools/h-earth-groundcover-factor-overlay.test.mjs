import test from 'node:test';
import assert from 'node:assert/strict';
import {transformPublishedRenderer,transformGen3008HabitatStages,transformGen3030HabitatAB,GEN3030_HABITAT_AB_MODES,GEN3030_HABITAT_BASELINE_BLOB,GEN3030_HABITAT_CANDIDATE_BLOB,GEN3008_HABITAT_STAGE_MODES,GEN3008_FROZEN_RENDERER_SHA256,verifyFramePairs,MODES,MODES_MINIMUM} from './h-earth-groundcover-factor-overlay.mjs';
const fixture=[
 'const FS = '+String.fromCharCode(96)+'#version 300 es',
 'precision highp float;',
 'out vec4 outColor;',
 'float noise2(vec2 x){return 0.5;}',
 'void main(){',
 ' float terrainRoughnessForLighting=0.72;',
 ' bool worldSoilTerrain=true;',
 ' vec3 base=vec3(0.1),lit=base,palette=base;',
 ' float groundcoverOrganic=0.4,groundcoverPatch=0.3,groundcoverSuitability=0.6,groundcoverProtection=0.9,groundcoverWeight=0.2;',
 ' float vCoastDistanceMeters=70.0,slope=0.1,rockExposure=0.2;',
 ' vec3 groundcoverTone=vec3(0.05);',
 '      palette=mix(palette,groundcoverTone,groundcoverWeight);',
 '  lit=pow(clamp(lit*1.12,0.0,1.0),vec3(1.0/2.2));',
 ' outColor=vec4(lit,1.0);',
 '}'+String.fromCharCode(96)+';',
 '// Ordered screen-door coverage',
 'const unrelated=3;',
 'function draw(gl,resources){gl.enable(gl.DEPTH_TEST); gl.depthFunc(gl.LEQUAL); gl.disable(gl.CULL_FACE); gl.useProgram(resources.geometryProgram); gl.bindVertexArray(resources.vertexArray);}'
].join('\n');
test('unrecognized renderer bytes fail closed',()=>assert.throws(()=>transformPublishedRenderer(fixture),/PUBLISHED_RENDERER_HASH_MISMATCH/));
test('diagnostic response retains original mix and preserves unrelated JS',()=>{
 const t=transformPublishedRenderer(fixture,{strictHash:false});
 assert.equal(t.modeCount,15);assert.equal(t.productDiskMutation,false);
 assert.ok(t.source.includes('probeGCBefore=palette;')&&t.source.includes('probeGCWeight=groundcoverWeight;'));
 assert.ok(t.source.includes('probeGCSuitability=groundcoverSuitability;'));
 assert.ok(t.source.includes('const unrelated=3;'));
 assert.ok(t.source.includes('uGroundcoverFactorMode==13||uGroundcoverFactorMode==14'));
 assert.ok(t.source.includes('globalThis.__groundcoverFactorModeApplied=mode'));
 assert.equal(t.source.split('palette=mix(palette,groundcoverTone,groundcoverWeight);').length,2);
});
test('ambiguous or altered anchors fail closed',()=>{
 assert.throws(()=>transformPublishedRenderer(fixture.replace('      palette=mix(palette,groundcoverTone,groundcoverWeight);','      palette=mix(palette,groundcoverTone,groundcoverWeight);\n      palette=mix(palette,groundcoverTone,groundcoverWeight);'),{strictHash:false}),/NON_UNIQUE_SOURCE_ANCHOR/);
 assert.throws(()=>transformPublishedRenderer(fixture.replace('groundcoverTone,groundcoverWeight);','groundcoverTone,groundcoverWeight*0.7);'),{strictHash:false}),/NON_UNIQUE_SOURCE_ANCHOR/);
});
test('matched source, camera, mode, viewport and assets enforced',()=>{
 const pose={name:'inland'},lastFrame={cameraPosition:{x:1,y:2,z:3}};
 const views=MODES_MINIMUM.map(modeId=>({pose,modeId,diagnosticApplied:modeId,sourceHead:'a'.repeat(40),rendererHash:'sha256',assetSignature:'assets',lastFrame,imageWidth:529,imageHeight:980}));
 assert.equal(verifyFramePairs(views,['inland']),true);
 assert.throws(()=>verifyFramePairs(views.slice(1),['inland']),/FRAME_COUNT_MISMATCH/);
 assert.throws(()=>verifyFramePairs(views.map((x,i)=>i===2?{...x,assetSignature:'different'}:x),['inland']),/NONMATCHED_SOURCE_CAMERA_ASSETS/);
});
test('closed factor mode set has counterfactual and controls',()=>{
 assert.equal(MODES[0],'reference-lit');assert.equal(MODES[13],'final-unlit-no-groundcover');
 assert.equal(MODES_MINIMUM.length,9);
 for(const id of [5,6,7,11,13])assert.ok(MODES_MINIMUM.includes(id));
});

test('Gen3029 adds exactly two habitat snapshots without changing original fifteen source modes',()=>{
 assert.equal(MODES.length,15);
 assert.deepEqual(GEN3008_HABITAT_STAGE_MODES,['before-habitat-unlit','after-habitat-unlit']);
 assert.equal(GEN3008_FROZEN_RENDERER_SHA256,'10f73ef961299e5834f3956d6a08771edd050beebf5fa6a29cb31dc8130f935c');
 const anchor='  lit=pow(clamp(lit*1.12,0.0,1.0),vec3(1.0/2.2));';
 assert.equal(fixture.split(anchor).length,2);
 const habitat='    base=mix(base,habitatSoil,habitatColorCoverage*.68);';
 const withHabitat=fixture.replace(anchor,habitat+'\\n'+anchor);
 assert.throws(()=>transformGen3008HabitatStages(withHabitat),/GEN3008_FROZEN_RENDERER_SOURCE_MISMATCH/);
 const t=transformGen3008HabitatStages(withHabitat,{strictHash:false});
 assert.equal(t.modeCount,17);
 assert.equal(t.productDiskMutation,false);
 assert.ok(t.source.includes('probeHabitatBefore=base;'));
 assert.ok(t.source.includes('probeHabitatAfter=mix(base,habitatSoil,habitatColorCoverage*.68);'));
 assert.ok(t.source.includes('if(m==15)albedo=probeHabitatSeen>0.5?probeHabitatBefore:base;'));
 assert.ok(t.source.includes('if(m==16)albedo=probeHabitatSeen>0.5?probeHabitatAfter:base;'));
 assert.ok(t.source.includes('mode>=17'));
 assert.equal(t.source.split('base=mix(base,habitatSoil,habitatColorCoverage*.68);').length,2);
 assert.equal(transformPublishedRenderer(fixture,{strictHash:false}).modeCount,15);
 assert.throws(()=>transformGen3008HabitatStages(withHabitat.replace(habitat,habitat+'\\n'+habitat),{strictHash:false}),/NON_UNIQUE_SOURCE_ANCHOR/);
});

test('Gen3032 exact source A/B exposes true before/after habitat material with no product edits',()=>{
 assert.deepEqual(GEN3030_HABITAT_AB_MODES,['before-habitat-unlit','after-habitat-unlit']);
 assert.equal(GEN3030_HABITAT_BASELINE_BLOB,'85ee835060d5106a670077a5f4352b7ad202b49b');
 assert.equal(GEN3030_HABITAT_CANDIDATE_BLOB,'91aa866e3a6b216c6d260e855f4a7e7cd9b7930b');
 const gamma='  lit=pow(clamp(lit*1.12,0.0,1.0),vec3(1.0/2.2));';
 const blendB='    base=mix(base,habitatSoil,habitatColorCoverage*.68);';
 const blendC='    base=mix(base,soilRelativeHabitat,habitatSupportC1*.68);';
 const b=fixture.replace(gamma,blendB+'\n'+gamma);
 const c=fixture.replace(gamma,blendC+'\n'+gamma);
 assert.throws(()=>transformGen3030HabitatAB(b,{label:'baseline'}),/GEN3030_AB_RENDERER_BLOB_MISMATCH/);
 assert.throws(()=>transformGen3030HabitatAB(c,{label:'candidate'}),/GEN3030_AB_RENDERER_BLOB_MISMATCH/);
 assert.throws(()=>transformGen3030HabitatAB(b,{label:'unknown',strictHash:false}),/GEN3030_AB_LABEL_INVALID/);
 const outB=transformGen3030HabitatAB(b,{label:'baseline',strictHash:false});
 const outC=transformGen3030HabitatAB(c,{label:'candidate',strictHash:false});
 assert.equal(outB.modeCount,17);assert.equal(outC.modeCount,17);
 for(const out of [outB,outC]){
  assert.equal(out.productDiskMutation,false);
  assert.ok(out.source.includes('if(m==15)albedo=probeHabitatSeen>0.5?probeHabitatBefore:base;'));
  assert.ok(out.source.includes('if(m==16)albedo=probeHabitatSeen>0.5?probeHabitatAfter:base;'));
  assert.ok(out.source.includes('mode>=17'));
  assert.ok(out.source.includes('const unrelated=3;'));
 }
 assert.ok(outB.source.includes('probeHabitatAfter=mix(base,habitatSoil,habitatColorCoverage*.68);'));
 assert.ok(outC.source.includes('probeHabitatAfter=mix(base,soilRelativeHabitat,habitatSupportC1*.68);'));
 assert.throws(()=>transformGen3030HabitatAB(b.replace(blendB,blendB+'\n'+blendB),{label:'baseline',strictHash:false}),/NON_UNIQUE_SOURCE_ANCHOR/);
 assert.throws(()=>transformGen3030HabitatAB(c.replace(blendC,blendC+'\n'+blendC),{label:'candidate',strictHash:false}),/NON_UNIQUE_SOURCE_ANCHOR/);
});
