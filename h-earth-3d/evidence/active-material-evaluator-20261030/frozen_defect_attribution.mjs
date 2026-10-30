/**
 * Gen3000 exact-source, archive-only attribution for the Gen2998 15 profiles.
 * No GPU/texture generation, no new cameras or correction; no raster ownership claim.
 *
 * Usage (from a repository checkout):
 * node frozen_defect_attribution.mjs <ordered-material.json> <measurement.json>
 * Files are immutable GitHub versions:
 * ordered-material.json @ 49e2c2a951c2a77040b35a35e1d842b06b55c34e
 * measurement.json @ 11a4fd07b30be7f663ac6d698434ce32ebea875e
 */
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createHash} from 'node:crypto';

function source(path,expectedBlob) {
  const raw=fs.readFileSync(path);
  const blob=createHash('sha1').update('blob '+raw.byteLength+'\0').update(raw).digest('hex');
  assert.equal(blob,expectedBlob,'FROZEN_SOURCE_GIT_BLOB_DRIFT');
  return JSON.parse(raw);
}
export function analyze(ordered,measured) {
  assert.equal(ordered.schema,'H_EARTH_ORDERED_MATERIAL_COEFFICIENTS_v1');
  assert.equal(ordered.sourceHead,'3ea149e5b56e8cc0d5aac192bce0cdd47da7e626');
  assert.equal(measured.result,'MEASURED_FIFTEEN_PREDECLARED_PROFILES');
  assert.equal(measured.run,41083373434);
  assert.equal(measured.artifact,12991506650);
  const sourceRecords=ordered.records.filter(x=>x.kind==='CAPTURED_PIXEL');
  assert.equal(sourceRecords.length,15,'CAPTURE_RECORD_COUNT_DRIFT');
  assert.equal(measured.records.length,15,'MEASURED_RECORD_COUNT_DRIFT');
  const ids=new Set(),matches=[];
  const needed=['environmental-identity','groundcover','corrected-atlas','material-margin','manor-stone','manor-contact','manor-terrace','manor-additive','site-b','steep-bank','sand','shoreline-root-soil','woodland-litter','habitat','bank-gravel'];
  for(const row of measured.records) {
    assert.ok(!ids.has(row.id),'DUPLICATE_PROFILE_ID');ids.add(row.id);
    const peers=sourceRecords.filter(x=>Math.hypot(x.requestedWorld[0]-row.centerXZ[0],x.requestedWorld[2]-row.centerXZ[1])<1e-6);
    assert.equal(peers.length,1,'UNMATCHED_OR_AMBIGUOUS_PROFILE');
    const sample=peers[0], stages=sample.result.stages;
    assert.deepEqual(stages.map(s=>s.id),needed,'SOURCE_STAGE_ORDER_DRIFT');
    const stage=name=>stages.find(x=>x.id===name);
    assert.equal(row.baselineProfile.length,9,'FROZEN_TRANSECT_LENGTH');
    assert.equal(row.candidateProfile.length,9,'FROZEN_TRANSECT_LENGTH');
    assert.equal(row.pixelPoints.length,9,'FROZEN_SCREEN_PROJECTION_LENGTH');
    assert.ok(Number.isFinite(row.afterMaxSlope)&&Number.isFinite(row.beforeMaxSlope));
    assert.ok(['PARENT_TRIANGLE_INTERIOR_CPU_ONLY','EXTRAPOLATED_PARENT_PLANE'].includes(sample.supportStatus),'UNCLASSIFIED_SOURCE_SUPPORT');
    const imgDiff=row.candidateProfile.map((value,i)=>value-row.baselineProfile[i]);
    const beforeSlopes=row.baselineProfile.slice(1).map((value,i)=>(value-row.baselineProfile[i])/.25);
    const afterSlopes=row.candidateProfile.slice(1).map((value,i)=>(value-row.candidateProfile[i])/.25);
    const k=afterSlopes.reduce((best,value,i)=>Math.abs(value)>Math.abs(afterSlopes[best])?i:best,0);
    assert.ok(Math.abs(Math.abs(afterSlopes[k])-row.afterMaxSlope)<1e-8,'AFTER_SLOPE_REPRO_DRIFT');
    assert.ok(Math.abs(Math.max(...beforeSlopes.map(Math.abs))-row.beforeMaxSlope)<1e-8,'BEFORE_SLOPE_REPRO_DRIFT');
    const margin=stage('material-margin'), atlas=stage('corrected-atlas');
    const A=sample.result.coefficients.A,B=sample.result.coefficients.B;
    assert.equal(A.length,3);assert.equal(B.length,3);
    assert.ok(A.every(x=>Number.isFinite(x))&&B.every(x=>Number.isFinite(x)),'CONDITIONAL_RGB_INVALID');
    for(let channel=0;channel<3;channel++){
      assert.ok(Math.abs(A[channel]-stages.at(-1).A[channel])<1e-12,'END_STAGE_A_MISMATCH');
      assert.ok(Math.abs(B[channel]-stages.at(-1).B[channel])<1e-12,'END_STAGE_B_MISMATCH');
    }
    const marginSourceOnlyBound=margin.addB.map((delta,i)=>[Math.min(delta,delta+margin.addA[i]),Math.max(delta,delta+margin.addA[i])]);
    const maxImageSampleChange=Math.max(...imgDiff.map(Math.abs));
    matches.push({
      profileId:row.id,view:row.view,sourceXZ:row.centerXZ,sourceEvaluatedWorld:sample.inputs.world,
      sourceSupport:sample.supportStatus,sourceHelpersOutsideParent:sample.helpersOutsideParent,
      sourceCenterIsNotFullPixelTransect:true,
      afterMaxSlopeLevelsPerMetre:row.afterMaxSlope,
      beforeMaxSlopeLevelsPerMetre:row.beforeMaxSlope,
      afterLargestSlopeIntervalIndex:k,
      afterLargestSlopeIntervalPixelEnds:[row.pixelPoints[k],row.pixelPoints[k+1]],
      afterLargestSlopeLevelsPerMetre:afterSlopes[k],beforeSlopeAtSameInterval:beforeSlopes[k],
      imageLumaCorrectionAtMaxInterval:[imgDiff[k],imgDiff[k+1]],
      unchangedSampleCount:imgDiff.filter(x=>Math.abs(x)<1e-10).length,
      maximumSampleLumaCorrection:maxImageSampleChange,
      material:{
        affineA:A,affineB:B,
        environmentalIdentityWeight:stage('environmental-identity').weight,
        groundcoverWeight:stage('groundcover').weight,
        correctedAtlasRGB:atlas.bias,
        materialMarginDeltaA:margin.addA,materialMarginDeltaB:margin.addB,
        marginOnlyPreLightingRGBBoundsForUnknownP:marginSourceOnlyBound,
        habitatWeight:stage('habitat').weight,woodlandLitterWeight:stage('woodland-litter').weight,
        steepBankWeight:stage('steep-bank').weight,sandWeight:stage('sand').weight
      }
    });
  }
  const worst=matches.reduce((a,b)=>a.afterMaxSlopeLevelsPerMetre>b.afterMaxSlopeLevelsPerMetre?a:b);
  assert.equal(worst.profileId,42,'WORST_FROZEN_PROFILE_CHANGED');
  assert.equal(worst.material.groundcoverWeight,0,'WORST_SOURCE_GROUNDCOVER_NOT_ZERO');
  assert.equal(worst.unchangedSampleCount,5,'WORST_IMAGE_DELTA_COUNT_DRIFT');
  assert.ok(Math.abs(worst.maximumSampleLumaCorrection-0.0729291471602096)<1e-9,'WORST_PROFILE_IMAGE_DELTA_DRIFT');
  for(const k of ['habitatWeight','woodlandLitterWeight','steepBankWeight','sandWeight'])
    assert.ok(matches.every(x=>x.material[k]===0),'INACTIVE_STAGE_NEGATIVE_DRIFT:'+k);
  return {
    schema:'H_EARTH_GEN3000_FROZEN_DEFECT_PROFILE_STAGE_BOUNDARY_v1',
    disposition:'SOURCE_STAGE_AND_PAIRED_IMAGE_BOUNDED_REVIEW_COMPLETE_UNIQUE_CAUSE_HELD',
    evidence:{candidateProduct:'3ea149e5b56e8cc0d5aac192bce0cdd47da7e626',
      savedImageRun:41083373434,savedImageArtifact:12991506650},
    scope:{profiles:matches.length,model:'A*P+B, P unknown original soil substrate',
      measurement:'display RGB weighted luminance, not physical luminance',
      profileSamples:9,spacingMetres:.25,
      noVerifiedRasterDepthOwner:true,notPerPixelMaterialSampling:true},
    stageCounts:{identity:matches.filter(v=>v.material.environmentalIdentityWeight>0).length,
      groundcover:matches.filter(v=>v.material.groundcoverWeight>0).length,
      atlas:matches.filter(v=>v.material.correctedAtlasRGB.some(a=>a!==0)).length,
      materialMargin:matches.filter(v=>v.material.materialMarginDeltaA.some(a=>a!==0)||v.material.materialMarginDeltaB.some(a=>a!==0)).length,
      habitat:0,litter:0,steepBank:0,sand:0},
    worstSample:worst,
    maxSlopeReductionPercent:(1-worst.afterMaxSlopeLevelsPerMetre/worst.beforeMaxSlopeLevelsPerMetre)*100,
    allProfiles:matches.map(v=>({id:v.profileId,view:v.view,sourceXZ:v.sourceXZ,
      afterMaxSlope:v.afterMaxSlopeLevelsPerMetre,correctionPeak:v.maximumSampleLumaCorrection,
      imageUnchangedPoints:v.unchangedSampleCount,sourceGroundcover:v.material.groundcoverWeight,
      sourceIdentity:v.material.environmentalIdentityWeight,
      sourceSupport:v.sourceSupport})),
    firstUnresolvedAssertion:'PRE_IDENTITY_SOIL_SUBSTRATE_P_AND_HARDWARE_RASTER_STAGE_COLOR_UNOBSERVED',
    notAccepted:['UNIQUE_CAUSAL_STAGE','PIXEL_LEVEL_SOURCE_STAGE_MAPPING','FULL_MIP_FILTERING',
      'GPU_DERIVATIVE_AND_LIGHTING','MATERIAL_REPAIR','MAP_WIDE_VISUAL_ACCEPTANCE'],
    nextAction:'Read existing source and archives for shader stage-specific P/soil-mip readback at the two pixels on profile42 maximal residual interval; if absent, scope at most one new separately admitted targeted diagnostic, without a new full-world capture or product change.',
    noGPU:true,noNewCensus:true,noProductChange:true,noPublication:true
  };
}
if (process.argv[1]&&process.argv[1].endsWith('frozen_defect_attribution.mjs')) {
  assert.equal(process.argv.length,4,'PASS_EXACT_ORDERED_AND_MEASUREMENT_JSON');
  const x=source(process.argv[2],'ebb5f2cad7e7a433eef799548d946adac6e9eb5e');
  const y=source(process.argv[3],'b1c9f9f4f37cd3a844110fb8bbdd4e11c38ac2be');
  process.stdout.write(JSON.stringify(analyze(x,y),null,2)+'\n');
}
