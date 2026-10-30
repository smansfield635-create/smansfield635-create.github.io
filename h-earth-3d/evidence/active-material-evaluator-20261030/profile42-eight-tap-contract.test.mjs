/** H-Earth Gen3000 profile42 8-tap immutable-source contract; CPU-only tests. */
import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const contract=JSON.parse(readFileSync(new URL('./profile42-eight-tap-capture-contract.json',import.meta.url)));
const dot=(a,b)=>a.reduce((s,x,i)=>s+x*b[i],0);
const luma=[.2126,.7152,.0722];
export function verify(c){
  assert.equal(c.schema,'H_EARTH_GEN3000_PROFILE42_EIGHT_TAP_SOURCE_PREFLIGHT_v1');
  assert.equal(c.status,'EXACT_ORIGINAL_IMAGE_TAP_RECONSTRUCTION_PASS__FUTURE_SHADER_CAPTURE_NOT_ADMITTED');
  assert.equal(c.archiveCustody.savedRun,41083373434);
  assert.equal(c.archiveCustody.artifactId,12991506650);
  assert.equal(c.archiveCustody.zipSHA256,'c1ae9fd42efba75bcda13c49caac13539bbb3aed41f812e05a0d6f59f3eb1756');
  assert.equal(c.archiveCustody.baselinePngSHA256,'65b2e9e47b75484054ff6b1673857d117f9f9490f4c66f52e285d8ef9ed3e7b3');
  assert.equal(c.archiveCustody.candidatePngSHA256,'2e6829c10fbb14dc51828bdf2af3e8390dc6cd3be1dfcaa7af2f86dddf00ecc6');
  assert.equal(c.sourceContract.frozenCandidateHead,'3ea149e5b56e8cc0d5aac192bce0cdd47da7e626');
  assert.equal(c.savedCamera.worldPacketCanonicalSha256,'689a4c7898d07bfe049f1bf0de048f2f4d4f078e23a8fab39710b4c694e16da8');
  assert.equal(c.savedCamera.pose.name,'inland-remaining-west-tip');
  assert.equal(c.savedCamera.pose.expectedReconciledY,17.43697988986969);
  assert.equal(c.savedCamera.pose.y,16.77975559234619);
  assert.equal(c.savedCamera.pose.viewProjectionMatrix.length,16);
  assert.equal(c.viewport.width,384);assert.equal(c.viewport.height,688);
  assert.equal(c.profile.profileId,42);
  assert.deepEqual(c.profile.steepestQuarterMetreInterval,[4,5]);
  const points=c.profile.samplePoints;
  assert.equal(points.length,2);
  const seen=new Set();
  const results={};
  for(const [index,p] of points.entries()){
    assert.equal(p.virtualPoint,index===0?'A':'B');
    assert.equal(p.bilinearTaps.length,4);
    const [x,y]=p.projectedXYTopLeftPixelCenters;
    assert.ok(x>0&&x<384&&y>0&&y<688);
    assert.ok(Math.abs(p.imageArrayCoordinateXY[0]-(x-.5))<1e-12);
    assert.ok(Math.abs(p.imageArrayCoordinateXY[1]-(y-.5))<1e-12);
    let total=0;
    let baseline=[0,0,0],candidate=[0,0,0];
    for(const [k,t] of p.bilinearTaps.entries()){
      const col=Math.floor(x-.5)+(k%2);
      const top=Math.floor(y-.5)+Math.floor(k/2);
      assert.deepEqual(t.pixelTopLeftZeroIndex,[col,top]);
      assert.deepEqual(t.glReadPixelsBottomLeftZeroIndex,[col,687-top]);
      const rx=(x-.5)-Math.floor(x-.5),ry=(y-.5)-Math.floor(y-.5);
      const w=(k%2?rx:1-rx)*(k>1?ry:1-ry);
      assert.ok(Math.abs(t.bilinearWeight-w)<1e-14);
      assert.ok(t.bilinearWeight>=0);
      for(const vec of [t.baselineRGB8,t.candidateRGB8]){
        assert.equal(vec.length,3);
        assert.ok(vec.every(v=>Number.isInteger(v)&&v>=0&&v<=255));
      }
      const key=col+':'+top;assert.ok(!seen.has(key),'DUPLICATED_PIXEL_TAP');seen.add(key);
      total+=t.bilinearWeight;
      for(let ch=0;ch<3;ch++){baseline[ch]+=w*t.baselineRGB8[ch];candidate[ch]+=w*t.candidateRGB8[ch];}
    }
    assert.ok(Math.abs(total-1)<1e-13);
    assert.ok(Math.abs(dot(baseline,luma)-p.baseline.weightedDisplayLuma)<1e-10);
    assert.ok(Math.abs(dot(candidate,luma)-p.candidate.weightedDisplayLuma)<1e-10);
    results[p.virtualPoint]={baseline:dot(baseline,luma),candidate:dot(candidate,luma)};
  }
  assert.equal(seen.size,8,'NOT_EIGHT_PHYSICAL_PIXELS');
  const before=(results.B.baseline-results.A.baseline)/.25;
  const after=(results.B.candidate-results.A.candidate)/.25;
  assert.ok(Math.abs(before-c.reconstructedProof.baselineLumaSlopeLevelsPerMetre)<1e-9);
  assert.ok(Math.abs(after-c.reconstructedProof.candidateLumaSlopeLevelsPerMetre)<1e-9);
  assert.ok(Math.abs(before-9.772251558830305)<1e-9);
  assert.ok(Math.abs(after-9.74875428219815)<1e-9);
  const different=points.flatMap(p=>p.bilinearTaps.filter(t=>t.baselineRGB8.some((v,i)=>v!==t.candidateRGB8[i])));
  assert.equal(different.length,1);
  assert.deepEqual(different[0].pixelTopLeftZeroIndex,[209,340]);
  assert.deepEqual(different[0].baselineRGB8,[145,123,90]);
  assert.deepEqual(different[0].candidateRGB8,[144,123,90]);
  assert.equal(c.nextSeparateEngineeringOperation.requiresFreshCanonicalAdmission,true);
  assert.equal(c.nextSeparateEngineeringOperation.boundedViewerPoseCount,1);
  assert.equal(c.nextSeparateEngineeringOperation.executionBudget.gpuNotYetLaunched,true);
  assert.equal(c.nextSeparateEngineeringOperation.executionBudget.maxVerifiedRenders,1);
  for(const stage of ['pre-identity materialMarginSubstrate P in linear RGB','per-tap visible raster primitive/role, world position, depth, alpha and all co-covered surfaces']) {
    assert.ok(c.nextSeparateEngineeringOperation.necessaryOrderedCheckpoints.includes(stage));
  }
  assert.equal(c.firstUnresolvedAssertion,'EXACT_EIGHT_VISIBLE_FRAGMENTS_SOURCE_P_PRELIGHT_AND_DEPTH_NOT_OBSERVED');
  return {before,after,differentPixel: different[0].pixelTopLeftZeroIndex};
}
test('source contract and 8 original PNG taps are exact',()=>verify(contract));
test('reject shifted tap pixel instead of silently accepting different fragment',()=>{
  const c=structuredClone(contract);c.profile.samplePoints[1].bilinearTaps[0].pixelTopLeftZeroIndex[0]++;
  assert.throws(()=>verify(c));
});
test('reject inverted WebGL framebuffer row',()=>{
  const c=structuredClone(contract);c.profile.samplePoints[1].bilinearTaps[0].glReadPixelsBottomLeftZeroIndex[1]=340;
  assert.throws(()=>verify(c));
});
test('reject wrong interpolation weights',()=>{
  const c=structuredClone(contract);c.profile.samplePoints[0].bilinearTaps[2].bilinearWeight+=.01;
  assert.throws(()=>verify(c));
});
test('reject hidden raster pixel color drift',()=>{
  const c=structuredClone(contract);c.profile.samplePoints[1].bilinearTaps[1].candidateRGB8[0]++;
  assert.throws(()=>verify(c));
});
test('reject swapped camera source identity',()=>{
  const c=structuredClone(contract);c.savedCamera.worldPacketCanonicalSha256='bad';
  assert.throws(()=>verify(c));
});
test('reject attempted GPU dispatch without separate admission',()=>{
  const c=structuredClone(contract);c.nextSeparateEngineeringOperation.requiresFreshCanonicalAdmission=false;
  assert.throws(()=>verify(c));
});
test('reject excluded source owner/depth required stage',()=>{
  const c=structuredClone(contract);c.nextSeparateEngineeringOperation.necessaryOrderedCheckpoints=c.nextSeparateEngineeringOperation.necessaryOrderedCheckpoints.filter(s=>!s.includes('per-tap visible raster primitive/role'));
  assert.throws(()=>verify(c));
});
test('reject duplicate bilinear pixels',()=>{
  const c=structuredClone(contract);c.profile.samplePoints[0].bilinearTaps[3].pixelTopLeftZeroIndex=[191,343];
  assert.throws(()=>verify(c));
});
