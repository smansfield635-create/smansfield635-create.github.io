import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {spawn,execFileSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import {transformPublishedRenderer,transformRavineHabitatRenderer,transformWestFlankMaterialRenderer,transformNearFarStraightRenderer,WEST_FLANK_STAGE_MODES,NEAR_FAR_STRAIGHT_STAGE_MODES,RAVINE_HABITAT_PROBE_MODES,MODES,MODES_MINIMUM} from './h-earth-groundcover-factor-overlay.mjs';


// REV2 G1 prerequisite: source-only closure. This never runs WebGL or upgrades
// an archival source witness into an actual GPU first-hit observation.
export const REV2_G1_STATIC_PREFLIGHT=Object.freeze({
 schema:'H_EARTH_REV2_G1_STATIC_PREFLIGHT_v1',
 baseline:'7a21f465fc58cc1dbdda02a3807a4bf344440589',
 product:'11afdc5278564728ea9eef6ffb525601ce4362a7',
 governing:'8371931a761944bf08c3bc517a56f0e3d2a3d7fa',
 blobs:Object.freeze({
  'showroom/globe/h-earth/index.html':'c86274de31cfacea8b1f7e0ad742462bba46e6f6',
  'showroom/globe/h-earth/vegetation-prototype/bootstrap.v1.js':'59c77d100d793f9dd28e9db7bd357ef078de0165',
  'showroom/globe/h-earth/vegetation-prototype/route.js':'8e8df594b8968f6bb17f32dc4ed7025bd2488bd0',
  'showroom/globe/h-earth/render/persistent-live-renderer.run8e-r3c.cp2-additive-bandlimited-relief-v2.js':'85ee835060d5106a670077a5f4352b7ad202b49b',
  'showroom/globe/h-earth/render/planetary-world-frame.js':'0938daa8586715c3636b373894bd7e6e28c1ea91',
  'showroom/globe/h-earth/render/live-renderer-contract.run8e-r3a.js':'d360e92c575be0c52254f454e7f57c1b87693b13',
  'showroom/globe/h-earth/functional-landscape/navigation.js':'3912671a7d6fe380a3605e33fd6547e2f672f319',
  'showroom/globe/h-earth/render/live-render-package.run8e-r2.canonical.js':'98ef78138aa6104f707832eabfa64bf1958a7312',
  'h-earth-3d/control-plane/run-8/recovery/h-earth.run8e-r3.live-gpu-presentation-recovery.js':'dbab15717f754b2dc9cedd75ab6835d3f4328a15',
  'h-earth-3d/terrain/h-earth.successor-terrain-field.run8b.js':'4f929cd467edb447e2116de745d9b02c28daf219',
  'h-earth-3d/environment/h-earth.atmosphere-state.js':'d3c8472529b4b8e5b34a3aa100240ca69bf4fef1',
  'showroom/globe/h-earth/render/gpu-upload-views.run8e-r2d.js':'ca4b239cfa9332a41b4adb7ccc76530beea10e77',
  'showroom/globe/h-earth/render/corrected-material-v1/near-atlas.png':'4fc4e24098c144d251f949a58a520bfd27983ad7',
  'showroom/globe/h-earth/render/corrected-material-v1/far-atlas.png':'3a5220e90c91d511e2f554023dc16823affd0058'
 }),
 atlases:Object.freeze({
  'showroom/globe/h-earth/render/corrected-material-v1/near-atlas.png':'b955d44ec908cdc1ea3ca18fc51f6dc513bbad5d5d8823da95a78e9c9bc83da7',
  'showroom/globe/h-earth/render/corrected-material-v1/far-atlas.png':'78a1031c9cdcf9d9649bede330e50f18b192ccba40d49ec5af1f293fc70a8d5f'
 }),
 baselineToProductFingerprint:Object.freeze({count:18,sha256:'b61e6533fd4247e85d9db544874d8bd84b46a34e9f9c63f64b5c05ff53b92798'}),
 baselineToGoverningFingerprint:Object.freeze({count:24,sha256:'ded60b56bfeb616e9de06662ce9d2231899ae4d86fae5d27db243c2b1a75fee7'})
});
export function validateRev2G1StaticEvidence(evidence){
 const c=REV2_G1_STATIC_PREFLIGHT,failed=(code)=>{throw Error('REV2_G1_'+code);};
 if(!evidence||evidence.baseline!==c.baseline||evidence.product!==c.product||
    evidence.governing!==c.governing)failed('EXACT_HEAD_DRIFT');
 const sameFingerprint=(actual,expected)=>actual?.count===expected.count&&
    actual?.sha256===expected.sha256;
 if(!sameFingerprint(evidence.baselineToProductFingerprint,c.baselineToProductFingerprint)||
    !sameFingerprint(evidence.baselineToGoverningFingerprint,c.baselineToGoverningFingerprint))
   failed('TRANSITIVE_DEPENDENCY_DELTA_UNCLOSED');
 for(const [file,want] of Object.entries(c.blobs)){
   if(['baseline','product','governing'].some(ref=>evidence.blobs?.[ref]?.[file]!==want))
     failed('SOURCE_OR_ASSET_BLOB_DRIFT:'+file);
 }
 for(const [file,want] of Object.entries(c.atlases))
   if(evidence.atlasDigests?.[file]!==want)failed('ASSET_SHA256_DRIFT:'+file);
 if(evidence.importMapCount!==36||evidence.importMapTargetsLocal!==true||
    evidence.importMapPathsExist!==true||evidence.newEngineRuntimeImport!==false)
   failed('IMPORT_GRAPH_UNCLOSED');
 if(evidence.cameraContractBlob!==c.blobs['showroom/globe/h-earth/render/live-renderer-contract.run8e-r3a.js']||
    evidence.planetaryFrameBlob!==c.blobs['showroom/globe/h-earth/render/planetary-world-frame.js']||
    evidence.navigationBlob!==c.blobs['showroom/globe/h-earth/functional-landscape/navigation.js'])
   failed('CAMERA_SOURCE_CONTRACT_DRIFT');
 return Object.freeze({schema:c.schema,result:'G1_SOURCE_DEPENDENCY_ASSET_CAMERA_PARITY_SOURCE_ONLY_PASS',
   baseline:c.baseline,product:c.product,governing:c.governing,
   verifiedBlobPaths:Object.keys(c.blobs).length,importMapCount:36,atlasCount:2,
   actualG1CameraUniformReadback:false,g1TwelveFirstHitsMeasured:false,
   float32FramebufferCalibrated:false,gpuExecuted:false,productionMutation:false,
   gpuAuthorizationCreated:false,ownerVisualAcceptanceCreated:false});
}
// The adapter reads committed git objects and locally materialized immutable
// product assets. A shallow checkout without all three exact commits fails closed.
export function isRev2G1LocalImportTarget(value){
 return typeof value==='string'&&
   (value.startsWith('/showroom/globe/h-earth/')||value.startsWith('/h-earth-3d/'))&&
   !value.includes('..')&&!/[\r\n]/.test(value)&&
   /\.m?js(?:\?.*)?$/.test(value);
}
// Verify the exact complete Git delta without disclosing unrelated
// historical control-plane filenames in the public diagnostic source.
export function fingerprintRev2PathDelta(paths){
 if(!Array.isArray(paths)||paths.some(p=>typeof p!=='string'||!p||/[\r\n]/.test(p)))
   throw Error('REV2_G1_CHANGED_PATHS_INVALID');
 const sorted=[...paths].sort();
 if(new Set(sorted).size!==sorted.length)throw Error('REV2_G1_CHANGED_PATHS_DUPLICATE');
 return Object.freeze({count:sorted.length,
   sha256:crypto.createHash('sha256').update(sorted.join('\n'),'utf8').digest('hex')});
}
export function collectRev2G1StaticPreflight(productDirectory){
 const c=REV2_G1_STATIC_PREFLIGHT;
 if(typeof productDirectory!=='string'||!productDirectory.trim())throw Error('REV2_G1_PRODUCT_DIRECTORY_REQUIRED');
 const dir=path.resolve(productDirectory);
 const git=(...args)=>execFileSync('git',['-C',dir,...args],{encoding:'utf8',timeout:10000,maxBuffer:2097152}).trim();
 if(git('rev-parse','HEAD')!==c.product)throw Error('REV2_G1_PRODUCT_HEAD_DRIFT');
 if(git('status','--porcelain','--untracked-files=no'))throw Error('REV2_G1_PRODUCT_CHECKOUT_DIRTY');
 for(const ref of [c.baseline,c.product,c.governing])git('cat-file','-e',ref+'^{commit}');
 const changed=ref=>git('diff','--name-only',c.baseline,ref).split('\n').filter(Boolean);
 const blobs={baseline:{},product:{},governing:{}};
 for(const refName of Object.keys(blobs)){
   const ref=c[refName];
   for(const file of Object.keys(c.blobs))
     blobs[refName][file]=git('rev-parse',ref+':'+file);
 }
 const atlasDigests={};
 for(const file of Object.keys(c.atlases))
   atlasDigests[file]=crypto.createHash('sha256').update(fs.readFileSync(path.join(dir,file))).digest('hex');
 const html=fs.readFileSync(path.join(dir,'showroom/globe/h-earth/index.html'),'utf8');
 const open='<script type="importmap">',start=html.indexOf(open),end=html.indexOf('</script>',start);
 if(start<0||end<0)throw Error('REV2_G1_IMPORT_MAP_MISSING');
 const importMap=JSON.parse(html.slice(start+open.length,end)).imports;
 if(!importMap||typeof importMap!=='object'||Array.isArray(importMap))throw Error('REV2_G1_IMPORT_MAP_INVALID');
 const targets=Object.values(importMap);
 const local=targets.every(isRev2G1LocalImportTarget);
 let exist=local;
 if(local)for(const u of new Set(targets)){
   const f=u.slice(1).split('?')[0];
   try{git('cat-file','-e',c.product+':'+f);}catch{exist=false;break;}
 }
 const sourceFiles=Object.keys(c.blobs).filter(f=>f.endsWith('.js')||f.endsWith('.html'));
 const engineImport=sourceFiles.some(f=>/\b(?:import|from)\b[^\n]*dgb\.native-/.test(fs.readFileSync(path.join(dir,f),'utf8')));
 return validateRev2G1StaticEvidence({
  baseline:c.baseline,product:c.product,governing:c.governing,
  baselineToProductFingerprint:fingerprintRev2PathDelta(changed(c.product)),
   baselineToGoverningFingerprint:fingerprintRev2PathDelta(changed(c.governing)),
  blobs,atlasDigests,importMapCount:targets.length,importMapTargetsLocal:local,
  importMapPathsExist:exist,newEngineRuntimeImport:engineImport,
  cameraContractBlob:blobs.product['showroom/globe/h-earth/render/live-renderer-contract.run8e-r3a.js'],
  planetaryFrameBlob:blobs.product['showroom/globe/h-earth/render/planetary-world-frame.js'],
  navigationBlob:blobs.product['showroom/globe/h-earth/functional-landscape/navigation.js']
 });
}


// REV2 numeric interpretation is independent of GPU dispatch. No values may be
// inferred from RGB8 PNGs; calibrated RGBA32F samples only.
export const REV2_NUMERIC_MODES=Object.freeze([
 'role_primitive_depth_valid','corrected_normal_slope',
 'exposure_eligibility_weight_authority','pre_soil_and_shelter','K_and_region',
 'uv_ddx','ddy_lod_valid','implicit_T_coast',
 ...Array.from({length:9},(_,i)=>'fixed_lod_'+i),'post_soil_C'
]);
export const REV2_NUMERIC_SEAMS=Object.freeze([
 [330,838,-457],[317,700,-456],[308,605,-455],[301,536,-454],
 [296,484,-453],[287,382,-450],[283,340,-448],[279,298,-445],
 [274,254,-440],[271,228,-435],[268,200,-425],[266,184,-415],
 [265,175,-405],[265,168,-395],[264,161,-385]
].map(([x,y,z])=>Object.freeze({x,y,z,topLeft:true})));
export const REV2_G1_FIXED_PIXELS=Object.freeze(
 [128,264,400].flatMap(x=>[250,430,610,790].map(y=>Object.freeze({x,y})))
);
export const REV2_CAPTURE_LIMITS=Object.freeze({
 poses:2,channels:4,modesPerPose:18,modeDraws:36,
 floatCalibrationDraws:2,referenceParityDraws:2,
 maximumGpuDrawReadbacks:40,warmupFramesPerPose:60,
 maximumWarmupFrames:120,maximumSubmittedFrames:160,
 width:529,height:980,float32RoundtripCeiling:0.000002,
 linearReconstructionCeiling:0.0001,firstHitDepthCeiling:0.005,
 observationPixelsPerStation:32,controlEdgesPerStation:30,
 seamCount:15,g1ControlPixels:12
});
export function rev2GlY(y,height=REV2_CAPTURE_LIMITS.height){
 if(!Number.isInteger(y)||y<0||y>=height||height!==980)
   throw Error('REV2_PIXEL_ORIGIN_INVALID');
 return height-1-y;
}
export function rev2StationPixelSpan(station){
 if(!station||!REV2_NUMERIC_SEAMS.some(s=>s.x===station.x&&s.y===station.y&&s.z===station.z))
   throw Error('REV2_UNFROZEN_STATION');
 if(station.x-16<0||station.x+15>=529)throw Error('REV2_PIXEL_SPAN_INVALID');
 return Object.freeze({x:station.x-16,y:rev2GlY(station.y),width:32,height:1,
  topLeftCenter:station.x,crossingLeftIndex:15,crossingRightIndex:16});
}
export function validateRev2FrameBudget(accounting){
 const c=REV2_CAPTURE_LIMITS;
 if(!accounting||!Array.isArray(accounting.poses)||accounting.poses.length!==2||
    accounting.poses.some(q=>!q||!Number.isInteger(q.warmup)||q.warmup<0||
      q.warmup>c.warmupFramesPerPose||q.modes!==18)||
    !Number.isInteger(accounting.floatCalibrationDraws)||accounting.floatCalibrationDraws!==2||
    !Number.isInteger(accounting.referenceParityDraws)||accounting.referenceParityDraws!==2||
    !Number.isInteger(accounting.totalFrameSubmissions)||
    accounting.totalFrameSubmissions<0)throw Error('REV2_GPU_ACCOUNTING_INCOMPLETE');
 const warm=accounting.poses.reduce((n,q)=>n+q.warmup,0),numeric=36,total=warm+numeric+2+2;
 if(warm>120||numeric+2+2!==40||total>160||accounting.totalFrameSubmissions!==total)
   throw Error('REV2_GPU_PASS_OR_FRAME_CEILING');
 return Object.freeze({result:'REV2_GPU_ACCOUNTING_VALID',totalFrameSubmissions:total,
  warmupFrames:warm,numericDraws:numeric,calibrationDraws:2,parityDraws:2});
}
const rev2Bound=REV2_CAPTURE_LIMITS.float32RoundtripCeiling;
const rev2Interval=(v,e=rev2Bound)=>{
 if(!Number.isFinite(v)||!Number.isFinite(e)||e<0)throw Error('REV2_UNCALIBRATED_COMPONENT');
 return Object.freeze([v-e,v+e]);
};
const rev2Add=(a,b)=>[a[0]+b[0],a[1]+b[1]];
const rev2Neg=a=>[-a[1],-a[0]];
const rev2Sub=(a,b)=>rev2Add(a,rev2Neg(b));
const rev2Mul=(a,b)=>{
 const v=[a[0]*b[0],a[0]*b[1],a[1]*b[0],a[1]*b[1]];
 return [Math.min(...v),Math.max(...v)];
};
function rev2Power(t){
 if(t[0]<0||t[1]>1+rev2Bound)throw Error('REV2_TEXTURE_RANGE_INVALID');
 return [Math.pow(Math.max(0,t[0]),2.2),Math.pow(Math.min(1,t[1]),2.2)];
}
export function decodeRev2FloatPixel(rows,{calibratedError=rev2Bound}={}){
 if(!Array.isArray(rows)||rows.length!==18||
    rows.some(x=>!Array.isArray(x)||x.length!==4||x.some(v=>!Number.isFinite(v))))
   throw Error('REV2_RGBA32F_NUMERIC_ROWS_INCOMPLETE');
 if(!Number.isFinite(calibratedError)||calibratedError<0||
    calibratedError>rev2Bound)throw Error('REV2_FLOAT_CALIBRATION_UNPROVEN');
 const first=rows[0],valid=Math.abs(first[3]-1)<=rev2Bound;
 if(!Number.isInteger(first[0])||!Number.isInteger(first[1])||
    first[2]<0||first[2]>1||!valid||
    !((first[0]===1&&first[1]===0)||(first[0]===5&&first[1]===8)))
   throw Error('REV2_FIRST_HIT_ROLE_PRIMITIVE_INVALID');
 const p=rows[3].slice(0,3),k=rows[4].slice(0,3),
       w=rows[2][2],a=rows[2][3],c=rows[17].slice(0,3);
 if(w<0||w>1||a<0||a>1||p.some(v=>v<0)||k.some(v=>v<0)||
    c.some(v=>v<0)||Math.abs(rows[17][3]-1)>rev2Bound)
   throw Error('REV2_SOIL_NUMERIC_RANGE_INVALID');
 const active=w>0.001;
 if(active && (Math.abs(rows[6][3]-1)>rev2Bound||
   rows.slice(8,17).some(v=>Math.abs(v[3]-1)>rev2Bound)||
   rows[7].slice(0,3).some(t=>t<0||t>1)))
   throw Error('REV2_TEXTURE_OR_DERIVATIVE_UNOBSERVED');
 if(!active){
  if(Math.abs(rows[6][3])>rev2Bound||
     rows.slice(8,17).some(v=>Math.abs(v[3])>rev2Bound))
   throw Error('REV2_W_ZERO_TEXTURE_MUST_REMAIN_UNOBSERVED');
  return Object.freeze({role:first[0],primitive:first[1],depth:first[2],
   p,w,a,k,c,t:null,active:false,error:calibratedError,
   reason:'NO_ORIGINAL_IMPLICIT_T_OR_DERIVATIVES_AT_ZERO_WEIGHT'});
 }
 return Object.freeze({role:first[0],primitive:first[1],depth:first[2],
  p,w,a,k,c,t:rows[7].slice(0,3),active:true,error:calibratedError,
  lods:rows.slice(8,17).map(v=>v.slice(0,3)),estimatedLod:rows[6][2],
  driverSelectedMipKnown:false});
}
function rev2Evaluate(sample,tSample){
 const e=sample.error;
 const w=rev2Interval(sample.w,e),a=rev2Interval(sample.a,e);
 return [0,1,2].map(i=>{
  const p=rev2Interval(sample.p[i],e),k=rev2Interval(sample.k[i],e);
  const t=rev2Power(rev2Interval(tSample.t[i],tSample.error));
  return rev2Add(p,rev2Mul(rev2Mul(w,a),rev2Sub(rev2Mul(t,k),p)));
 });
}
function rev2Signed(intervals){
 const value=intervals.map(q=>(q[0]+q[1])/2);
 const errors=intervals.map(q=>(q[1]-q[0])/2);
 return Object.freeze({value,errors,norm:value.reduce((n,v)=>n+Math.abs(v),0),
  numericErrorBound:errors.reduce((n,v)=>n+v,0)});
}
function rev2MeanPair(a,b){
 return a.map((v,i)=>rev2Mul(rev2Add(v,b[i]),[0.5,0.5]));
}
export function computeRev2SignedAttribution(left,right){
 if(!left||!right||left.active!==true||right.active!==true)
   throw Error('REV2_TEXTURE_UNOBSERVED_NO_COUNTERFACTUAL');
 const ll=rev2Evaluate(left,left),lr=rev2Evaluate(left,right);
 const rl=rev2Evaluate(right,left),rr=rev2Evaluate(right,right);
 const tex=rev2MeanPair(lr.map((v,i)=>rev2Sub(v,ll[i])),
                           rr.map((v,i)=>rev2Sub(v,rl[i])));
 const other=rev2MeanPair(rl.map((v,i)=>rev2Sub(v,ll[i])),
                             rr.map((v,i)=>rev2Sub(v,lr[i])));
 const reconstruction=tex.map((v,i)=>rev2Add(v,other[i]));
 const observed=left.c.map((v,i)=>rev2Sub(rev2Interval(right.c[i],right.error),
                                             rev2Interval(v,left.error)));
 const tol=REV2_CAPTURE_LIMITS.linearReconstructionCeiling;
 for(let i=0;i<3;i++){
  const ideal=right.c[i]-left.c[i];
  if(ideal<reconstruction[i][0]-tol||ideal>reconstruction[i][1]+tol)
    throw Error('REV2_SIGNED_RECONSTRUCTION_FAIL');
 }
 for(const [point,actual] of [[left,ll],[right,rr]]){
  for(let i=0;i<3;i++)
    if(point.c[i]<actual[i][0]-tol||point.c[i]>actual[i][1]+tol)
      throw Error('REV2_ORIGINAL_C_RECONSTRUCTION_FAIL');
 }
 return Object.freeze({texture:rev2Signed(tex),nonTexture:rev2Signed(other),
  observed:rev2Signed(observed),reconstructed:rev2Signed(reconstruction),
  separability:'COMPOSED_P_W_A_K_VS_IMPLICIT_TEXTURE_NOT_ISOLATED_NORMAL',
  mipSelectionKnown:false});
}
export function classifyRev2Station(crossing,controls){
 if(!crossing||!Array.isArray(controls)||controls.length!==30||
    controls.some(x=>!x||!x.texture||!x.nonTexture))
   throw Error('REV2_STATION_CONTROLS_INCOMPLETE');
 const threshold=key=>{
  const norm=controls.map(c=>c[key].norm);
  if(norm.some(v=>!Number.isFinite(v)||v<0))throw Error('REV2_CONTROL_NONFINITE');
  return norm.sort((a,b)=>a-b)[28]; // 29th ascending of 30, nearest rank p95
 };
 const classify=key=>{
  const factor=crossing[key],control=threshold(key);
  if(!factor||!Number.isFinite(factor.norm)||!Number.isFinite(factor.numericErrorBound)||
     factor.numericErrorBound<0)throw Error('REV2_CROSSING_NONFINITE');
  return Object.freeze({supported:factor.norm>factor.numericErrorBound&&
    factor.norm>control,controlP95:control,numericErrorBound:factor.numericErrorBound,
    signedRgb:factor.value,norm:factor.norm});
 };
 const t=classify('texture'),n=classify('nonTexture');
 const result=t.supported&&n.supported?'BOTH_CONTRIBUTE':
   t.supported?'TEXTURE_SAMPLING_SUPPORTED':
   n.supported?'NON_TEXTURE_BLEND_FACTORS_SUPPORTED':'UNRESOLVED';
 return Object.freeze({result,texture:t,nonTexture:n,controlCount:30,
  comparison:'STRICTLY_ABOVE_NUMERIC_BOUND_AND_29TH_ASCENDING_CONTROL'});
}
export function rev2ValidateSameRoleControl(left,right,{depthCeiling=0.005}={}){
 if(!left||!right||left.role!==right.role||left.primitive!==right.primitive||
    !Number.isFinite(left.depth)||!Number.isFinite(right.depth)||
    Math.abs(right.depth-left.depth)>depthCeiling)
   throw Error('REV2_CONTROL_FIRST_HIT_OR_DEPTH_MISMATCH');
 return true;
}

// Gen3074 is a distinct source-only extension. It does not select any
// historical comparison/G1 profile, nor authorize a fabricated camera pose.
export const RAVINE_HABITAT_TARGET=Object.freeze({
  schema:'H_EARTH_RAVINE_SOURCE_TARGET_v1',
  exactRendererBlob:'85ee835060d5106a670077a5f4352b49b',
  publishedSourceHead:'11afdc5278564728ea9eef6ffb525601ce4362a7',
  z:-546,xStart:-304,xEnd:-292,ravineWestEdge:-298,
  withinNavigableDomain:false,
  ownerPhotoMatchEstablished:false,
  cameraPoseQualified:false
});
export const RAVINE_HABITAT_MODES=RAVINE_HABITAT_PROBE_MODES;
export const RAVINE_HABITAT_CAPTURE_CEILING=Object.freeze({
  maximumPoses:2,maximumModesPerPose:10,maximumFrames:20,
  cameraRequirement:'EXACT_SOURCE_DERIVED_OBSERVER_WITH_FIRST_HIT_AND_WORLD_COORDINATES',
  status:'REQUIRES_CAMERA_AND_PIXEL_READBACK_QUALIFICATION'
});
// Observer provenance comes from the actual emitted ERODED_TERRAIN and
// MOUNTAIN_OVERBURDEN triangles, never from the walkable-domain resolver.
// A source-derived proposal is not a pixel first-hit certificate.
export function deriveRavineEmittedSurfaceObserver(sampleSurfaceAt,{name,x,z}){
  if(typeof sampleSurfaceAt!=='function'||!Number.isFinite(x)||!Number.isFinite(z)||
     !['ravine-west','outside-habitat-control'].includes(name)||
     z!==RAVINE_HABITAT_TARGET.z||
     (name==='ravine-west'&&x!==RAVINE_HABITAT_TARGET.ravineWestEdge)||
     (name==='outside-habitat-control'&&x!==RAVINE_HABITAT_TARGET.xStart+2))
    throw Error('RAVINE_OBSERVER_TARGET_NOT_FROZEN');
  const sample=(sx,sz)=>{
    const result=sampleSurfaceAt(sx,sz);
    if(!result||!Number.isFinite(result.y)||
       !['ERODED_TERRAIN','MOUNTAIN_OVERBURDEN'].includes(result.role))
      throw Error('RAVINE_EMITTED_TRIANGLE_SURFACE_NOT_AVAILABLE');
    return result;
  };
  const hit=sample(x,z);
  // Six metres is the frozen source material-filter support, and -42 degrees
  // is the published navigation camera's lower pitch bound. This is a detached
  // observer, not a traversable camera or a claim that the photograph matches.
  const horizontalDistance=6,pitch=-42,yaw=0;
  const rise=horizontalDistance*Math.tan(-pitch*Math.PI/180);
  const camera={x,y:hit.y+rise,z:z+horizontalDistance};
  const raySamples=[];
  for(let i=0;i<=24;i++){
    const t=i/24,point={x,y:camera.y-rise*t,z:camera.z-horizontalDistance*t};
    const terrain=sample(point.x,point.z),clearance=point.y-terrain.y;
    if(i===0&&clearance<1.6||i>0&&i<24&&clearance<0.06)
      throw Error('RAVINE_OBSERVER_RAY_OCCLUDED');
    if(i===24&&Math.abs(clearance)>1e-6)
      throw Error('RAVINE_OBSERVER_FINAL_HIT_MISMATCH');
    raySamples.push({t,clearance,role:terrain.role});
  }
  return Object.freeze({name,x:camera.x,y:camera.y,z:camera.z,yaw,pitch,
    diagnosticObserver:true,sourceDerived:true,sourceEvidenceId:'ACTUAL_EMITTED_GEOLOGICAL_TRIANGLES',
    referenceTarget:{x,y:hit.y,z,role:hit.role},
    ray:{horizontalDistance,rise,raySamples},
    firstHitAttributionAvailable:false,
    navigationEligible:false,canonicalCameraStateAuthority:false,
    ownerPhotoCorrespondence:false,requiresGpuFirstHitReadback:true});
}
export function instrumentRavineHabitatRenderer(original){
  const injected=instrumentRenderer(transformRavineHabitatRenderer(original).source);
  return replaceExactlyOnce(injected,
    'if(!globalThis.__groundComparisonHideGrass)resources.singleOwnerVegetation?.draw(packet);',
    'globalThis.__ravinePublishedGeologicalSurfaceAt=(x,z)=>resources.geologicalRuntime?.sampleSurfaceAt(x,z)??null;'+
    'if(!globalThis.__groundComparisonHideGrass)resources.singleOwnerVegetation?.draw(packet);');
}
export function validateRavineHabitatCapture(views,poses){
  if(!Array.isArray(poses)||poses.length!==2||
     !Array.isArray(views)||views.length!==poses.length*RAVINE_HABITAT_MODES.length)
    throw Error('RAVINE_CAPTURE_CENSUS_INCOMPLETE');
  for(const pose of poses){
    if(!pose||pose.sourceDerived!==true||!pose.firstHitAttributionAvailable||
       !pose.sourceEvidenceId||!['x','y','z','yaw','pitch'].every(k=>Number.isFinite(pose[k])))
      throw Error('RAVINE_CAMERA_NOT_SOURCE_DERIVED');
    const group=views.filter(v=>v.pose?.name===pose.name);
    if(group.length!==RAVINE_HABITAT_MODES.length||
       new Set(group.map(v=>v.mode)).size!==RAVINE_HABITAT_MODES.length)
      throw Error('RAVINE_MODES_INCOMPLETE');
    const reference=group[0];
    for(const mode of RAVINE_HABITAT_MODES){
      const v=group.find(x=>x.mode===mode);
      if(!v||v.sourceHead!==RAVINE_HABITAT_TARGET.publishedSourceHead||
         v.sourceRendererBlob!==RAVINE_HABITAT_TARGET.exactRendererBlob||
         v.rendererHash!==reference.rendererHash||v.assetSignature!==reference.assetSignature||
         JSON.stringify(v.lastFrame?.cameraPosition)!==JSON.stringify(reference.lastFrame?.cameraPosition)||
         v.diagnosticApplied!==RAVINE_HABITAT_MODES.indexOf(mode)||
         !/^[a-f0-9]{64}$/.test(v.imageSha256||''))
        throw Error('RAVINE_STAGE_SOURCE_CAMERA_IDENTITY_MISMATCH');
    }
  }
  return Object.freeze({result:'STAGE_MECHANICAL_ONLY_VISUAL_ATTRIBUTION_UNPROVEN',
    modes:RAVINE_HABITAT_MODES.length,views:views.length,ownerPhotoMatch:false,
    productionMutation:false,releaseAuthorized:false});
}

export const DIAGNOSTIC_MODES=Object.freeze(MODES_MINIMUM.map(i=>MODES[i]));
const MODE_ID_BY_NAME=new Map(MODES.map((name,index)=>[name,index]));
export const DIAGNOSTIC_STAGE_MEANINGS=Object.freeze(Object.fromEntries(DIAGNOSTIC_MODES.map(name=>[name,'GPU source-interception read-only factor visualization; product bytes unchanged'])));
export const SEARCH_PROVENANCE=Object.freeze({kind:'PUBLISHED_RENDERER_KNOWN_INLAND_BAND_PLUS_HEALTHY_COAST_CONTROL',exactScreenshotMatchProven:false,operationId:'H_EARTH_GROUNDCOVER_FACTOR_GPU_DIAGNOSTIC_20261026_001',priorStageAttributionRun:40411050366,expectedPublishedRendererSha256:'7ac013645110fc91ac9d454916e30f3cc526b716b0c0ffad4c702e1e44b8bec2'});
export const RENDERER_SHA256='7ac013645110fc91ac9d454916e30f3cc526b716b0c0ffad4c702e1e44b8bec2';
export const MATERIAL_BASELINE_HEAD='60b3c07f0216645119a1b92b16dac82cae739145';
/* Gen3042: three independent immutable source checkouts. */
export const GEN3042_PROFILE=process.env.H_EARTH_COMPARISON_PROFILE==='GEN3042_SOIL_TRIAD_AB_V1';
export const GEN3042_HEADS=Object.freeze({baseline:'28da29ce01f26bf5eb73db2d75b09741b22ab40b',candidate:'724efeb1db3d3e8e5309a9aa779acefb7c53fed9',habitat:'cb15de477f9b8e39b9dc688ecc452ba44e42e6c1'});
export const GEN3042_BLOBS=Object.freeze({baseline:'85ee835060d5106a670077a5f4352b7ad202b49b',candidate:'40034a16c36a43cb02682564784328ddb7ac48a7',habitat:'03bc45e034e9894494d9120782c714ae78890ab8'});
export const GEN3042_MODES=Object.freeze(['reference-lit','before-groundcover-unlit','after-groundcover-unlit','groundcover-weight-raw']);
// Explicit, closed-world G1 diagnostic, independent from the legacy survey.
export const RAVINE_OBSERVER_PROFILE='RAVINE_EMITTED_SURFACE_OBSERVER_PREFLIGHT_V1';
export const RAVINE_PIXEL_PROFILE='RAVINE_VERIFIED_OBSERVER_PIXEL_STAGES_V1';
export const RAVINE_PIXEL_ACTIVE=process.env.H_EARTH_COMPARISON_PROFILE===RAVINE_PIXEL_PROFILE;
export const RAVINE_OBSERVER_ACTIVE=process.env.H_EARTH_COMPARISON_PROFILE===RAVINE_OBSERVER_PROFILE;
export const WEST_FLANK_PROFILE='WEST_FLANK_OWNER_CLASS_MATERIAL_STAGES_V1';
export const WEST_FLANK_ACTIVE=process.env.H_EARTH_COMPARISON_PROFILE===WEST_FLANK_PROFILE;
export const NEAR_FAR_STRAIGHT_PROFILE='SOURCE_NEAR_FAR_STRAIGHT_BASELINE_V1';
export const NEAR_FAR_STRAIGHT_ACTIVE=process.env.H_EARTH_COMPARISON_PROFILE===NEAR_FAR_STRAIGHT_PROFILE;
export const RAVINE_ANY_ACTIVE=RAVINE_PIXEL_ACTIVE||RAVINE_OBSERVER_ACTIVE||WEST_FLANK_ACTIVE||NEAR_FAR_STRAIGHT_ACTIVE;
export const WEST_FLANK_FROZEN_POSE=Object.freeze({name:'west_flank',x:110,y:8.346905947403934,z:-310,yaw:153.434948822922,pitch:20.264510304722066,diagnosticObserver:true,ownerPhotoMatch:false,sourceHead:'3ea149e5b56e8cc0d5aac192bce0cdd47da7e626'});
export const WEST_FLANK_PIXELS=Object.freeze([{x:300,y:625},{x:300,y:650}].map(Object.freeze));
export const WEST_FLANK_SOURCE_TARGET=Object.freeze({x:145,y:36.24194177261537,z:-240});
export const WEST_FLANK_STAGE_SOURCE_BINDING=Object.freeze({frozenGen3008PlanHead:'aaddea3ad332d347041a5476d97ab27b6e0e7367',sourceProductHead:'11afdc5278564728ea9eef6ffb525601ce4362a7',currentRendererBlob:'85ee835060d5106a670077a5f4352b7ad202b49b',originalNearGroundTriangle11650FromHistoricalReconstruction:true,actualCurrentTriangleProven:false,ownerPhonePhotoMatch:false,healthyControlProven:false});

/* Gen3087: successor to terminal Gen3084 (FAIL_CLOSED). These 30
   spherical, original-indexed-mesh FIRST-HIT WITNESSES come from immutable
   Gen3085 source-only archive SHA256 bb5c825f4323895802ad7fa0ccb1e204f69d4cdc07e25402ed8e2815d07e5569;
   complete 30-row receipt SHA256 a8df23deded300604ae018044a8064ec67e12c99c4e911ea2ab0d2f2dac07cee.
   Spherical source qualification is NOT GPU pixel, Android-camera or material proof. */
export const NEAR_FAR_STRAIGHT_POSE=Object.freeze({
 name:'source_near_far_straight_planetary',x:-383.7,y:12,z:-460,
 yaw:180.26444018162007,pitch:-25,sourceLookDistanceMetres:18,
 diagnosticObserver:true,sourceDerived:true,ownerPhotoMatch:false,
 navigationEligible:false,firstHitGpuUnverified:true
});
export const NEAR_FAR_STRAIGHT_SOURCE_BINDING=Object.freeze({
 sourcePackage:'H_EARTH_RUN_8E_R2_LIVE_RENDER_PACKAGE_4F1B7FF2',
 archiveSha256:'5bfce62703c70fd5b68e894fca8634e5206c1ca681d7a127c192312a8e06aa3c',
 sourceArchiveSha256:'bb5c825f4323895802ad7fa0ccb1e204f69d4cdc07e25402ed8e2815d07e5569',
 preflightJsonSha256:'a8df23deded300604ae018044a8064ec67e12c99c4e911ea2ab0d2f2dac07cee',
 historicalPreflightJsonSha256:'a40f8f4c6e9241163bd658220f92bb468f3dc9a5c83533f5a573dcdb036ceb04',
 predecessorHead:'558ddc927296afb14574e3ee05a65b165f65467b',
 inheritedGen3079Head:'069f35028039f543fa39dfd255b70ac5fcac9c92',
 productHead:'11afdc5278564728ea9eef6ffb525601ce4362a7',
 rendererBlob:'85ee835060d5106a670077a5f4352b49b',
 planetaryFrameBlob:'0938daa8586715c3636b373894bd7e6e28c1ea91',
 r3aCameraContractBlob:'d360e92c575be0c52254f454e7f57c1b87693b13',
 navigationBlob:'3912671a7d6fe380a3605e33fd6547e2f672f319',
 planetaryRadiusMetres:420000,
 expectedPlanetaryPosition:Object.freeze([-383.7108327689559,11.572814426966943,-460.01298690049447]),
 expectedPlanetaryTarget:Object.freeze([-383.77918166282757,3.983175041677896,-443.69112993191413]),
 expectedPlanetaryUp:Object.freeze([-0.0009135711188464994,0.9999989829205522,-0.001095237723923351]),
 pairedSourceStations:15,sourceFirstHitCount:30,viewport:Object.freeze([529,980]),
 originalSourceNearRole:1,originalSourceNearPrimitive:0,
 originalSourceFarRole:5,originalSourceFarPrimitive:8,
 sourceFirstHitMaxErrorMetres:0.565815,sourceFirstHitErrorCeilingMetres:1.5,
 priorFailedGpuRun:41570553401,priorTerminalGeneration:3084,
 successorAdmittedGeneration:3087,
 ownerPhotoCorrespondence:false,productMutation:false,
 gpuFrameEvidence:false
});
export const NEAR_FAR_STRAIGHT_STATIONS=Object.freeze([
 {z:-457,far:{pixel:[436,909],world:[-384.5,8.48294,-457],depth:0.940610946729,triangle:24558},near:{pixel:[217,909],world:[-383.5,8.49223,-457],depth:0.940496273266,triangle:6528}},
 {z:-456,far:{pixel:[404,763],world:[-384.5,8.45491,-456],depth:0.951249077008,triangle:24559},near:{pixel:[225,761],world:[-383.5,8.46982,-456],depth:0.951149153088,triangle:6720}},
 {z:-455,far:{pixel:[382,661],world:[-384.5,8.4213,-455],depth:0.958671749413,triangle:24559},near:{pixel:[230,660],world:[-383.5,8.43622,-455],depth:0.958599924299,triangle:6720}},
 {z:-454,far:{pixel:[366,587],world:[-384.5,8.3877,-454],depth:0.964133205191,triangle:24559},near:{pixel:[234,586],world:[-383.5,8.40261,-454],depth:0.964079138341,triangle:6720}},
 {z:-453,far:{pixel:[354,530],world:[-384.5,8.35409,-453],depth:0.968320062051,triangle:24559},near:{pixel:[237,528],world:[-383.5,8.36901,-453],depth:0.968277867915,triangle:6720}},
 {z:-450,far:{pixel:[329,417],world:[-384.5,8.25328,-450],depth:0.976537978232,triangle:24559},near:{pixel:[243,416],world:[-383.5,8.26819,-450],depth:0.976514846664,triangle:6720}},
 {z:-448,far:{pixel:[319,371],world:[-384.5,8.17815,-448],depth:0.980003239718,triangle:24560},near:{pixel:[245,369],world:[-383.5,8.20088,-448],depth:0.97998113317,triangle:6912}},
 {z:-445,far:{pixel:[308,323],world:[-384.5,8.04562,-445],depth:0.983639627733,triangle:24560},near:{pixel:[248,322],world:[-383.5,8.06835,-445],depth:0.983624829268,triangle:6912}},
 {z:-440,far:{pixel:[297,274],world:[-384.5,7.81576,-440],depth:0.987448345544,triangle:24561},near:{pixel:[250,272],world:[-383.5,7.84738,-440],depth:0.987437257348,triangle:7104}},
 {z:-435,far:{pixel:[290,244],world:[-384.5,7.56192,-435],depth:0.989823700666,triangle:24552},near:{pixel:[252,243],world:[-383.5,7.58127,-435],depth:0.989818565784,triangle:7104}},
 {z:-425,far:{pixel:[281,211],world:[-384.5,6.98059,-425],depth:0.992626030617,triangle:24543},near:{pixel:[254,210],world:[-383.5,7.00119,-425],depth:0.992623217005,triangle:7296}},
 {z:-415,far:{pixel:[277,193],world:[-384.5,6.34169,-415],depth:0.994222647278,triangle:24545},near:{pixel:[255,193],world:[-383.5,6.36265,-415],depth:0.994220898351,triangle:7680}},
 {z:-405,far:{pixel:[274,182],world:[-384.5,5.69648,-405],depth:0.995251960139,triangle:24546},near:{pixel:[256,182],world:[-383.5,5.7166,-405],depth:0.995250810074,triangle:7872}},
 {z:-395,far:{pixel:[271,173],world:[-384.5,5.09283,-395],depth:0.995969392576,triangle:24547},near:{pixel:[257,173],world:[-383.5,5.10996,-395],depth:0.99596864572,triangle:8064}},
 {z:-385,far:{pixel:[270,166],world:[-384.5,4.57033,-385],depth:0.99649721531,triangle:24541},near:{pixel:[257,166],world:[-383.5,4.58148,-385],depth:0.996496775669,triangle:8256}}
].map(q=>Object.freeze({z:q.z,
 far:Object.freeze({...q.far,pixel:Object.freeze(q.far.pixel),world:Object.freeze(q.far.world),role:5,primitive:8}),
 near:Object.freeze({...q.near,pixel:Object.freeze(q.near.pixel),world:Object.freeze(q.near.world),role:1,primitive:0})
})));
export function validateNearFarPlanetaryPacket(packet,pose=NEAR_FAR_STRAIGHT_POSE,binding=NEAR_FAR_STRAIGHT_SOURCE_BINDING){
 const close=(a,b,t)=>Number.isFinite(a)&&Number.isFinite(b)&&Math.abs(a-b)<=t;
 const vector=(object,expected,t)=>object&&expected.every((v,i)=>close(object[['x','y','z'][i]],v,t));
 const c=packet?.camera,n=packet?.navigationState;
 if(packet?.status!=='RUN_8E_R3A_FRAME_UNIFORM_PACKET_COMPLETE'||
    packet?.singleSphericalPresentationManifold!==true||
    packet?.cameraAndWorldSharePlanetaryFrame!==true||
    packet?.successorTerrainCameraReconciled!==true||
    packet?.worldRecenteredForCamera!==false||
    packet?.planetRelativeUp!==true)
   throw Error('NEAR_FAR_R3A_PLANETARY_FRAME_INVALID');
 if(!packet?.viewport||packet.viewport.width!==529||packet.viewport.height!==980||
    packet.viewport.pixelRatio!==1||!Number.isInteger(packet.frameSequence)||
    packet.frameSequence!==packet.navigationSequence)
   throw Error('NEAR_FAR_R3A_FRAME_VIEWPORT_INVALID');
 if(!n||!close(n.yawDegrees,pose.yaw,1e-9)||!close(n.pitchDegrees,pose.pitch,1e-9)||
    !vector(n.position,[pose.x,pose.y,pose.z],1e-9))
   throw Error('NEAR_FAR_R3A_NAVIGATION_POSE_MISMATCH');
 if(!close(packet.navigationCameraY,pose.y,1e-9)||
    !close(packet.presentationCameraY,pose.y,1e-6)||
    !close(packet.r3aPresentationCameraYDelta,0,1e-6))
   throw Error('NEAR_FAR_R3A_CAMERA_HEIGHT_RECONCILED_DRIFT');
 if(!c||!vector(c.localAuthoringPosition,[pose.x,pose.y,pose.z],1e-6)||
    !vector(c.position,binding.expectedPlanetaryPosition,1e-4)||
    !vector(c.target,binding.expectedPlanetaryTarget,1e-4)||
    !vector(c.up,binding.expectedPlanetaryUp,1e-6)||
    !close(packet.projectedCameraY,c.position.y,1e-6)||
    !close(c.verticalFovDegrees,56,1e-9)||
    !close(c.nearPlane,.25,1e-9)||c.farPlane<20000)
   throw Error('NEAR_FAR_R3A_CAMERA_PROJECTION_DRIFT');
 if(!Array.isArray(c.viewProjectionMatrix)||c.viewProjectionMatrix.length!==16||
    !c.viewProjectionMatrix.every(Number.isFinite))
   throw Error('NEAR_FAR_R3A_MATRIX_NOT_AVAILABLE');
 return true;
}
export function validateNearFarGpuUniforms(uniforms,packet,observedFrame){
 const close=(a,b,t)=>Number.isFinite(a)&&Number.isFinite(b)&&Math.abs(a-b)<=t;
 const target=packet?.camera?.position,view=packet?.camera?.viewProjectionMatrix;
 if(!uniforms||uniforms.error!==0||
    !Array.isArray(uniforms.camera)||uniforms.camera.length!==3||
    ![target?.x,target?.y,target?.z].every((v,i)=>close(uniforms.camera[i],v,0.001))||
    !Array.isArray(uniforms.viewProjection)||uniforms.viewProjection.length!==16||
    !uniforms.viewProjection.every((v,i)=>close(v,view?.[i],0.02))||
    !observedFrame?.cameraPosition||
    ![target?.x,target?.y,target?.z].every((v,i)=>close(observedFrame.cameraPosition[['x','y','z'][i]],v,1e-6)))
   throw Error('NEAR_FAR_GPU_CAMERA_UNIFORM_READBACK_MISMATCH');
 return true;
}

export const G1_BASELINE_PROFILE='G1_SOIL_BASELINE_ONLY_V1';
export const G1_A03_PROFILE='G1_SOIL_A03_CANDIDATE_ONLY_V1';
// Additive use of the existing comparator at the prior GPU-positive inland FAR band.
export const INLAND_BAND_BASELINE_PROFILE='INLAND_BAND_BASELINE_ONLY_V1';
export const INLAND_BAND_A03_PROFILE='INLAND_BAND_A03_CANDIDATE_ONLY_V1';
export const INLAND_BAND_PROFILE=[INLAND_BAND_BASELINE_PROFILE,INLAND_BAND_A03_PROFILE].includes(process.env.H_EARTH_COMPARISON_PROFILE);
export const G1_PROFILE=[G1_BASELINE_PROFILE,G1_A03_PROFILE,INLAND_BAND_BASELINE_PROFILE,INLAND_BAND_A03_PROFILE].includes(process.env.H_EARTH_COMPARISON_PROFILE);
export const G1_HEADS=Object.freeze({
 baseline:'7a21f465fc58cc1dbdda02a3807a4bf344440589',
 candidate:'7d55ca9707bfef75a9ddf9fb078747ba79eef19a'
});
export const G1_BLOBS=Object.freeze({
 baseline:'85ee835060d5106a670077a5f4352b7ad202b49b',
 candidate:'62dc1e62f417f2b8eb7b4b08240f231d52d0c54e'
});
export const G1_POSES=Object.freeze(INLAND_BAND_PROFILE?[Object.freeze({
 // Source-derived positive inland band from Gen2917/Gen2925, not an owner-photo camera.
 name:'inland-seam-near',x:-200,y:18.361431,z:-728,
 yaw:0,pitch:-14,diagnosticObserver:true
})]:[Object.freeze({
 name:'G1-straight-mask-source-probe',x:132,y:12.988637259823408,z:-165,
 yaw:11.309932474020213,pitch:0.9839390159552497,diagnosticObserver:true
})]);
export const G1_MODES=GEN3042_MODES;
export const G1_ACTIVE_LABEL=[G1_A03_PROFILE,INLAND_BAND_A03_PROFILE].includes(process.env.H_EARTH_COMPARISON_PROFILE)?'candidate':'baseline';
const candidateCapture=process.env.H_EARTH_COMPARISON_PROFILE==='MAPWIDE_CANDIDATE_V1';
const candidateHead=process.env.H_EARTH_COMPARISON_CANDIDATE_SHA||'';
if(candidateCapture&&!/^[a-f0-9]{40}$/.test(candidateHead))throw Error('CANDIDATE_EXACT_SHA_REQUIRED');
export const HEADS=Object.freeze(RAVINE_ANY_ACTIVE?{baseline:RAVINE_HABITAT_TARGET.publishedSourceHead}:(G1_PROFILE?{[G1_ACTIVE_LABEL]:G1_HEADS[G1_ACTIVE_LABEL]}:(GEN3042_PROFILE?GEN3042_HEADS:{baseline:MATERIAL_BASELINE_HEAD,candidate:candidateCapture?candidateHead:MATERIAL_BASELINE_HEAD})));
export const POSES=Object.freeze([{name:'river-overlook',x:18,z:-226,yaw:210,pitch:-14},{name:'bare-mountain',x:88,z:-260,yaw:95,pitch:-10},{name:'coast-oblique',x:0,z:-110,yaw:170,pitch:-8},{name:'foothill-west',x:-52,z:-208,yaw:180,pitch:-12},
{name:'inland-seam-near',x:-200,z:-728,y:18.361431,yaw:0,pitch:-14,diagnosticObserver:true},
{name:'inland-seam-mid',x:-200,z:-704,y:18.272624,yaw:0,pitch:-4,diagnosticObserver:true},
{name:'inland-seam-far',x:-200,z:-656,y:18.793665,yaw:0,pitch:-2,diagnosticObserver:true},
{name:'coastal-seam-east',x:376,z:-96,y:2.603263,yaw:90,pitch:-14,diagnosticObserver:true},
{name:'coastal-seam-west',x:-376,z:-96,y:2.518974,yaw:270,pitch:-14,diagnosticObserver:true},
{name:'patch-close-south',x:88,z:-236,yaw:180,pitch:-17.72},
{name:'patch-east',x:92,z:-232,yaw:270,pitch:-6.69},
{name:'patch-west',x:84,z:-232,yaw:90,pitch:-13.5}].map(Object.freeze));
export const DIAGNOSTIC_POSES=Object.freeze([POSES.find(p=>p.name==='inland-seam-near'),POSES.find(p=>p.name==='coast-oblique')]);
// Additive Gen2928 source-bound survey; the original Gen2925 18-frame profile remains unchanged.
export const SURVEY_POSES=Object.freeze(['inland-seam-near','inland-seam-far','coastal-seam-east','coast-oblique'].map(name=>POSES.find(p=>p.name===name)));
export const SURVEY_MODES=Object.freeze(['reference-lit','before-groundcover-unlit','after-groundcover-unlit','patch-weight-raw','groundcover-weight-raw']);
export const GEN3042_POSES=Object.freeze(['inland-seam-near','coast-oblique','foothill-west'].map(name=>{
 const p=POSES.find(p=>p.name===name);if(!p)throw Error('GEN3042_POSE_MISSING');return p;
}));
export function comparisonState(nav,pose,sequence,action){
  if(pose.diagnosticObserver===true){
    if(!['x','y','z','yaw','pitch'].every(k=>Number.isFinite(pose[k])))throw Error('DIAGNOSTIC_POSE_INVALID');
    return {contractId:nav.H_EARTH_FUNCTIONAL_LANDSCAPE_NAVIGATION_CONTRACT_ID,position:{x:pose.x,y:pose.y,z:pose.z},yawDegrees:pose.yaw,pitchDegrees:pose.pitch,verticalFovDegrees:56,sequence,action,accepted:false,terrainSupported:false,geologicalPhysicalSupport:false,diagnosticObserver:true,canonicalCameraStateAuthority:false,collisionOrPhysicsClaim:false};
  }
  const r=nav.auditResolvePosition(pose.x,pose.z,pose.yaw,'SURFACE');if(!r.eligible)throw Error('POSE_INELIGIBLE');
  return nav.auditStateFrom(r,{yaw:pose.yaw,pitch:pose.pitch,fov:56,sequence,action});
}
const ROOT='/showroom/globe/h-earth/';
const RENDERER=ROOT+'render/persistent-live-renderer.run8e-r3c.cp2-additive-bandlimited-relief-v2.js';
const ROUTE=ROOT+'vegetation-prototype/route.js';
const sha=value=>crypto.createHash('sha256').update(value).digest('hex');
export function replaceExactlyOnce(source,needle,replacement){if(source.split(needle).length!==2)throw Error('INSTRUMENTATION_ANCHOR_NOT_UNIQUE:'+needle);return source.replace(needle,replacement);}
export function instrumentRoute(source){return replaceExactlyOnce(source,'const cssWidth=','globalThis.__HEarthAuditPresent=present;globalThis.__HEarthAuditPacket=createHEarthRun8ER3AFrameUniformPacket;\nconst cssWidth=');}
export function instrumentRenderer(source){return replaceExactlyOnce(source,'resources.singleOwnerVegetation?.draw(packet);','if(!globalThis.__groundComparisonHideGrass)resources.singleOwnerVegetation?.draw(packet);');}
export const ORIGINAL_BLEND_EXPRESSION='float groundcoverWeight=0.88*groundcoverPatch*\\n        groundcoverSuitability*groundcoverProtection;'.replace('\\n','\n');
export const CANDIDATE_BLEND_EXPRESSION='float groundcoverPatchContinuity=smoothstep(0.30,0.85,groundcoverPatch);\\n      float groundcoverWeight=0.88*groundcoverPatch*\\n        (1.0-0.25*groundcoverPatchContinuity)*\\n        groundcoverSuitability*groundcoverProtection;'.replaceAll('\\n','\n');
export function verifyExactMaterialCandidate(source){
 if(source.split(CANDIDATE_BLEND_EXPRESSION).length!==2)throw Error('GEN2928_BLEND_EXPRESSION_NOT_UNIQUE');
 const reconstructed=source.replace(CANDIDATE_BLEND_EXPRESSION,ORIGINAL_BLEND_EXPRESSION);
 if(sha(reconstructed)!==RENDERER_SHA256)throw Error('GEN2928_CANDIDATE_NOT_EXACT_ONE_FORMULA_DIFF');
 return sha(source);
}
export function instrumentCandidateRenderer(source){
 verifyExactMaterialCandidate(source);
 return instrumentRenderer(transformPublishedRenderer(source,{strictHash:false}).source);
}
export function instrumentDiagnosticRenderer(source){
 if(sha(source)!==RENDERER_SHA256)throw Error('DIAGNOSTIC_SOURCE_HASH_MISMATCH');
 return instrumentRenderer(transformPublishedRenderer(source).source);
}
export function instrumentG1(source,label,dir){
 if(!G1_PROFILE||!['baseline','candidate'].includes(label)||
   label!==G1_ACTIVE_LABEL)throw Error('G1_LABEL_PROFILE_UNBOUND');
 const actual=execFileSync('git',['-C',dir,'hash-object',RENDERER.slice(1)],{encoding:'utf8'}).trim();
 if(actual!==G1_BLOBS[label])throw Error('G1_RENDERER_BLOB_MISMATCH:'+label+':'+actual);
 if(label==='candidate'){
  if(source.includes('palette=mix(palette,groundcoverTone,groundcoverWeight);'))throw Error('G1_A03_LEGACY_ANCHOR_PRESENT');
  return instrumentRenderer(transformPublishedRenderer(source,{strictHash:false,variant:'A03_A04'}).source);
 }
 if(source.split('palette=mix(palette,groundcoverTone,groundcoverWeight);').length!==2)
   throw Error('G1_BASELINE_ANCHOR_MISSING');
 return instrumentRenderer(transformPublishedRenderer(source,{strictHash:false}).source);
}
export function instrumentGen3042(source,label,dir){
 if(!GEN3042_BLOBS[label]||source.split('palette=mix(palette,groundcoverTone,groundcoverWeight);').length!==2)throw Error('GEN3042_SOURCE_UNBOUND');
 const actual=execFileSync('git',['-C',dir,'hash-object',RENDERER.slice(1)],{encoding:'utf8'}).trim();
 if(actual!==GEN3042_BLOBS[label])throw Error('GEN3042_BLOB_MISMATCH:'+label+':'+actual);
 return instrumentRenderer(transformPublishedRenderer(source,{strictHash:false}).source);
}
export function validateGen3042(views){
 const labels=Object.keys(GEN3042_HEADS),modes=GEN3042_MODES,poses=GEN3042_POSES;
 if(views.length!==labels.length*modes.length*poses.length)throw Error('GEN3042_FRAME_CENSUS');
 for(const pose of poses){
  for(const mode of modes){
   const group=labels.map(label=>{
    const matches=views.filter(v=>v.label===label&&v.pose?.name===pose.name&&v.mode===mode);
    if(matches.length!==1)throw Error('GEN3042_STAGE_CARDINALITY');
    const v=matches[0];
    if(v.sourceHead!==GEN3042_HEADS[label]||v.modeId!==MODE_ID_BY_NAME.get(mode)||
       v.diagnosticApplied!==v.modeId||v.grassHidden!==(mode!=='reference-lit')||
       v.imageWidth!==529||v.imageHeight!==980||!/^[a-f0-9]{64}$/.test(v.imageSha256||'')||
       !/^[a-f0-9]{64}$/.test(v.rendererHash||''))throw Error('GEN3042_SOURCE_STAGE_INVALID:'+label);
    return v;
   });
   const base=group[0];
   for(const v of group.slice(1))if(v.assetSignature!==base.assetSignature||
      JSON.stringify(v.state.position)!==JSON.stringify(base.state.position)||
      !['x','y','z'].every(k=>Number.isFinite(v.lastFrame.cameraPosition[k])&&
        Math.abs(v.lastFrame.cameraPosition[k]-base.lastFrame.cameraPosition[k])<1e-6))
     throw Error('GEN3042_CAMERA_ASSET_MISMATCH:'+mode+':'+pose.name);
  }
  for(const label of labels){
   const a=views.filter(v=>v.label===label&&v.pose?.name===pose.name);
   if(a.length!==modes.length||new Set(a.map(v=>v.assetSignature)).size!==1||
      new Set(a.map(v=>JSON.stringify(v.lastFrame.cameraPosition))).size!==1)throw Error('GEN3042_STAGE_DRIFT:'+label);
  }
  for(const mode of ['before-groundcover-unlit','groundcover-weight-raw']){
   const base=views.find(v=>v.label==='baseline'&&v.pose.name===pose.name&&v.mode===mode);
   for(const label of ['candidate','habitat']){
    const v=views.find(v=>v.label===label&&v.pose.name===pose.name&&v.mode===mode);
    if(base.imageSha256!==v.imageSha256)throw Error('GEN3042_UNCHANGED_STAGE_DIFF:'+label+':'+mode);
   }
  }
 }
 return {poses:poses.map(p=>p.name),modes,labels,images:views.length,sourceStagesVerified:true};
}
export function validateG1Set(views,labels=Object.keys(HEADS)){
 if(!G1_PROFILE)throw Error('G1_PROFILE_NOT_SELECTED');
 if(views.length!==4*labels.length)throw Error('G1_FRAME_CENSUS');
 for(const label of labels){
  const group=views.filter(v=>v.label===label);
  if(group.length!==4)throw Error('G1_LABEL_FRAME_CENSUS:'+label);
  const ref=group[0];
  for(const mode of G1_MODES){
   const items=group.filter(v=>v.mode===mode);
   if(items.length!==1)throw Error('G1_MODE_CARDINALITY:'+mode);
   const v=items[0];
   if(v.sourceHead!==G1_HEADS[label]||v.modeId!==MODE_ID_BY_NAME.get(mode)||
     v.diagnosticApplied!==v.modeId||v.rendererHash!==ref.rendererHash||
     v.grassHidden!==(mode!=='reference-lit')||
     v.imageWidth!==529||v.imageHeight!==980||
     !/^[a-f0-9]{64}$/.test(v.imageSha256||'')||
     v.assetSignature!==ref.assetSignature||
     JSON.stringify(v.state.position)!==JSON.stringify(ref.state.position)||
     JSON.stringify(v.lastFrame.cameraPosition)!==JSON.stringify(ref.lastFrame.cameraPosition))
      throw Error('G1_SOURCE_FRAME_STAGE_DRIFT:'+label+':'+mode);
  }
 }
 return {result:'G1_CAPTURE_MECHANICAL_COMPLETE_VISUAL_REVIEW_REQUIRED',
   images:views.length,labels,ownerImageCorrespondence:false,
   runtimeDepthOrPrimitiveIdCaptured:false,physicalDevicePerformanceProven:false};
}
export function validateDiagnosticSet(views,poses=DIAGNOSTIC_POSES,modes=DIAGNOSTIC_MODES){
 if(views.length!==poses.length*modes.length)throw Error('DIAGNOSTIC_INCOMPLETE');
 for(const pose of poses){
  const group=views.filter(v=>v.pose.name===pose.name);
  if(group.length!==modes.length||new Set(group.map(v=>v.mode)).size!==modes.length||!modes.every(m=>group.some(v=>v.mode===m)))throw Error('DIAGNOSTIC_MODE_SET');
  const ref=group[0];
  for(const v of group){
   if(!v.grassHidden||v.diagnosticApplied!==MODE_ID_BY_NAME.get(v.mode)||v.assetSignature!==ref.assetSignature||JSON.stringify(v.state.position)!==JSON.stringify(ref.state.position)||JSON.stringify(v.lastFrame.cameraPosition)!==JSON.stringify(ref.lastFrame.cameraPosition)||v.sourceHead!==ref.sourceHead||v.rendererHash!==ref.rendererHash)throw Error('DIAGNOSTIC_MATCH_MISMATCH');
  }
 }
 return true;
}
export function sameHeading(a,b){return Number.isFinite(a)&&Number.isFinite(b)&&Math.abs(((a-b)%360+540)%360-180)<1e-8;}
export function validateFrame(value,pose,sequence){
  const {state,lastFrame,canvas,expectedCameraPosition}=value;
  if(pose.diagnosticObserver&&(state?.diagnosticObserver!==true||state.accepted!==false||state.terrainSupported!==false||state.geologicalPhysicalSupport!==false||state.position?.y!==pose.y))throw Error('DIAGNOSTIC_AUTHORITY_MISMATCH');
  if(!state||!lastFrame||state.sequence!==sequence||lastFrame.navigationSequence!==sequence)throw Error('FRAME_NAVIGATION_MISMATCH');
  if(!Number.isInteger(lastFrame.frameSequence)||lastFrame.frameSequence<1)throw Error('FRAME_SEQUENCE_INVALID');
  if(state.position.x!==pose.x||state.position.z!==pose.z||!sameHeading(state.yawDegrees,pose.yaw)||state.pitchDegrees!==pose.pitch||state.verticalFovDegrees!==56)throw Error('POSE_MISMATCH');
  if(!Number.isFinite(state.position.y)||!expectedCameraPosition||!['x','y','z'].every(k=>Number.isFinite(expectedCameraPosition[k])&&Number.isFinite(lastFrame.cameraPosition?.[k])&&Math.abs(expectedCameraPosition[k]-lastFrame.cameraPosition[k])<1e-8))throw Error('FRAME_CAMERA_MISMATCH');
  if(canvas.width!==529||canvas.height!==980||canvas.cssWidth!==540||canvas.cssHeight!==1000)throw Error('RESOLUTION_MISMATCH');
  return true;
}
export function assetReadiness(resources,camera){
  const tree=resources?.treeCollection,jac=resources?.jacaranda;
  if(!tree?.queue||!Array.isArray(tree.entries)||!jac||!Number.isFinite(camera?.x)||!Number.isFinite(camera?.z))throw Error('ASSET_RECEIPT_MISSING');
  const all=[jac,...tree.entries];
  if(all.some(x=>!['IDLE','LOADING','READY'].includes(x.state)||x.failure)||Object.keys(tree.queue.failures??{}).length)throw Error('ASSET_FAILURE');
  const near=(e,inclusive)=>{const a=inclusive?e.targetAnchor:e;if(!Number.isFinite(a.x)||!Number.isFinite(a.z))throw Error('ASSET_ANCHOR_MISSING');const d=Math.hypot(camera.x-a.x,camera.z-a.z);return inclusive?d<=180:d<180;};
  const pending=tree.queue.loading||all.some(x=>x.state==='LOADING')||(jac.state==='IDLE'&&near(jac,true))||tree.entries.some(e=>e.state==='IDLE'&&near(e,false));
  return {ready:!pending,signature:JSON.stringify(all.map(e=>({id:e.focusId??e.id,state:e.state,ready:e.ready}))),queue:tree.queue};
}
export function decodeCanvasCapture(capture,expectedFrame){
  for(const frame of [capture.before,capture.after])if(!frame||frame.navigationSequence!==expectedFrame.navigationSequence||frame.frameSequence!==expectedFrame.frameSequence)throw Error('CAPTURE_FRAME_CHANGED');
  if(!/^data:image\/png;base64,[A-Za-z0-9+/]+={0,2}$/.test(capture.dataUrl??''))throw Error('CAPTURE_PNG_INVALID');
  const bytes=Buffer.from(capture.dataUrl.split(',')[1],'base64');
  if(bytes.length<1024)throw Error('EMPTY_CAPTURE');
  if(!bytes.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10]))||bytes.toString('ascii',12,16)!=='IHDR'||bytes.readUInt32BE(16)!==529||bytes.readUInt32BE(20)!==980)throw Error('CAPTURE_PNG_DIMENSIONS_INVALID');
  return bytes;
}
export function assertCheckout(dir,expected){const head=execFileSync('git',['-C',dir,'rev-parse','HEAD'],{encoding:'utf8'}).trim();if(head!==expected)throw Error('CHECKOUT_HEAD_MISMATCH');if(execFileSync('git',['-C',dir,'status','--porcelain','--untracked-files=no'],{encoding:'utf8'}).trim())throw Error('CHECKOUT_TRACKED_BYTES_CHANGED');}
export function parseArgs(argv){const a={},keys=RAVINE_ANY_ACTIVE?['--baseline-dir','--output']:(G1_PROFILE?['--'+G1_ACTIVE_LABEL+'-dir','--output']:(GEN3042_PROFILE?['--baseline-dir','--candidate-dir','--habitat-dir','--output']:['--baseline-dir','--candidate-dir','--output']));for(let i=0;i<argv.length;i+=2){if(!keys.includes(argv[i])||!argv[i+1]||a[argv[i]])throw Error('CLI_NOT_CLOSED');a[argv[i]]=path.resolve(argv[i+1]);}if(Object.keys(a).length!==keys.length||keys.some(k=>!a[k]))throw Error('CLI_INCOMPLETE');if(new Set(Object.values(a)).size!==keys.length)throw Error('DIRECTORIES_NOT_DISTINCT');return a;}
export async function run(argv){
  const a=parseArgs(argv),out=a['--output'];fs.mkdirSync(out,{recursive:true});
  const profile=process.env.H_EARTH_COMPARISON_PROFILE||'FACTOR_18_V1';
  if(!['FACTOR_18_V1','MAPWIDE_SCOUT_V1','MAPWIDE_CANDIDATE_V1','GEN3042_SOIL_TRIAD_AB_V1',G1_BASELINE_PROFILE,G1_A03_PROFILE,INLAND_BAND_BASELINE_PROFILE,INLAND_BAND_A03_PROFILE,RAVINE_OBSERVER_PROFILE,RAVINE_PIXEL_PROFILE,WEST_FLANK_PROFILE,NEAR_FAR_STRAIGHT_PROFILE].includes(profile))throw Error('COMPARISON_PROFILE_NOT_REGISTERED');
  const poses=RAVINE_ANY_ACTIVE?[]:(G1_PROFILE?G1_POSES:(GEN3042_PROFILE?GEN3042_POSES:(profile==='MAPWIDE_SCOUT_V1'||profile==='MAPWIDE_CANDIDATE_V1'?SURVEY_POSES:DIAGNOSTIC_POSES)));
  const modes=RAVINE_ANY_ACTIVE?[]:(G1_PROFILE?G1_MODES:(GEN3042_PROFILE?GEN3042_MODES:(profile==='MAPWIDE_SCOUT_V1'||profile==='MAPWIDE_CANDIDATE_V1'?SURVEY_MODES:DIAGNOSTIC_MODES)));
  if(poses.length*modes.length>20)throw Error('DIAGNOSTIC_FRAME_CAP_EXCEEDED');
  const receipt={schema:'H_EARTH_GROUND_MATERIAL_FIXED_COMPARISON_v1',result:'INCOMPLETE',heads:HEADS,profile,poses,modes,repairOperationId:GEN3042_PROFILE?'H_EARTH_GEN3042_SOIL_TRIAD_POSITIVE_BAND_QUALIFICATION_20261101_001':'H_EARTH_GROUNDCOVER_BAND_CONTINUITY_REPAIR_20261026_001',baselineProductSha256:GEN3042_PROFILE?null:RENDERER_SHA256,diagnosticOnly:true,searchProvenance:SEARCH_PROVENANCE,stageMeanings:DIAGNOSTIC_STAGE_MEANINGS,sourceProductSha256:GEN3042_PROFILE?null:RENDERER_SHA256,sourceRenderers:{},gen3042ClaimCeiling:'HISTORIC_INLAND_BAND_ONLY_OWNER_ANDROID_STRAIGHT_AND_CURVED_NOT_CLOSED',colorTransform:'ORIGINAL_EXPOSURE_1.12_AND_GAMMA_1_OVER_2.2_EXCEPT_RAW_COVERAGE_MODE',viewport:{cssWidth:540,cssHeight:1000,backingWidth:529,backingHeight:980,fov:56},evidenceScope:'READ_ONLY_DIAGNOSTIC_FIXED_VIEWS_SOFTWARE_GPU',physicalAndroidPerformanceProven:false,ownerVisualAcceptance:false,releaseAuthorized:false,productDiskMutation:false,views:[],runs:[],errors:[]};
  if(G1_PROFILE){receipt.g1EvidenceClass=INLAND_BAND_PROFILE?'GPU_POSITIVE_INLAND_FAR_BAND_NOT_OWNER_PHOTO':'SOURCE_DERIVED_G1_OBSERVER_NOT_OWNER_WITNESS';receipt.firstHitDepthReadback=false;receipt.ownerPhotoClassMatchProven=false;receipt.claimCeiling=INLAND_BAND_PROFILE?'PROVEN_INLAND_BAND_MATERIAL_RESPONSE_ONLY_OWNER_STRAIGHT_AND_CURVED_NOT_PROVEN':'SOURCE_PINNED_G1_DIAGNOSTIC_ONLY_VISUAL_REVIEW_PENDING';receipt.repairOperationId=null;receipt.diagnosticAdmissionIdentity=null;receipt.baselineProductSha256=null;receipt.sourceProductSha256=null;receipt.gen3042ClaimCeiling=null;receipt.searchProvenance=INLAND_BAND_PROFILE?{kind:'GEN2917_GEN2925_GPU_POSITIVE_INLAND_BAND',sourceRun:40411050366,sourceReceipt:'6428986452',ownerClassCorrespondence:false}:{kind:'G1_SOURCE_DERIVED_ESTATE_PROTECTION_TRANSITION',sourceReceipt:'6561935591',ownerClassCorrespondence:false};}
   const persist=()=>{fs.writeFileSync(out+'/receipt.tmp',JSON.stringify(receipt,null,2)+'\n');fs.renameSync(out+'/receipt.tmp',out+'/receipt.json');};
  let browser=null,server=null;
  const interrupt=signal=>{receipt.result='INTERRUPTED';receipt.errors.push(signal);persist();server?.kill();process.exit(signal==='SIGTERM'?143:130);};
  const onTerm=()=>interrupt('SIGTERM'),onInt=()=>interrupt('SIGINT');
  process.once('SIGTERM',onTerm);process.once('SIGINT',onInt);persist();
  try{
    for(const label of Object.keys(HEADS))assertCheckout(a['--'+label+'-dir'],HEADS[label]);
    const {chromium}=await import('playwright');
    browser=await chromium.launch({headless:true,args:['--no-sandbox','--enable-unsafe-swiftshader','--use-angle=swiftshader','--disable-dev-shm-usage']});
    for(const [index,label] of ((RAVINE_ANY_ACTIVE||GEN3042_PROFILE||G1_PROFILE)?Object.keys(HEADS):['candidate']).entries()){
      const dir=a['--'+label+'-dir'],port=18767+index,base='http://127.0.0.1:'+port;
      const runRecord={label,head:HEADS[label],errors:[],instrumentation:[],startedAt:new Date().toISOString()};receipt.runs.push(runRecord);persist();
      server=spawn('python3',['-m','http.server',String(port),'--bind','127.0.0.1','--directory',dir],{stdio:['ignore','ignore','ignore']});
      const serverError=[];server.on('error',e=>serverError.push(e.message));
      let listening=false;for(let n=0;n<50;n++){try{const r=await fetch(base+ROOT);if(r.ok){listening=true;break;}}catch{}await new Promise(r=>setTimeout(r,100));}if(!listening)throw Error('SERVER_UNAVAILABLE:'+serverError.join(';'));
      const context=await browser.newContext({viewport:{width:540,height:1000},deviceScaleFactor:1});const page=await context.newPage();page.setDefaultTimeout(30000);
      await page.addInitScript({content:'globalThis.__groundcoverFactorMode=0;globalThis.__groundAssetReadiness='+assetReadiness.toString()+';globalThis.__groundComparisonState='+comparisonState.toString()+';'+(RAVINE_ANY_ACTIVE?'const RAVINE_HABITAT_TARGET='+JSON.stringify(RAVINE_HABITAT_TARGET)+';globalThis.__deriveRavineEmittedSurfaceObserver='+deriveRavineEmittedSurfaceObserver.toString()+';globalThis.__ravineHabitatProbeMode=0;':'')});
      const errors=runRecord.errors;page.on('pageerror',e=>errors.push('PAGE:'+e.message));page.on('console',m=>{if(m.type()==='error')errors.push('CONSOLE:'+m.text());});page.on('response',r=>{if(r.status()>=400)errors.push('HTTP:'+r.status()+':'+r.url());});page.on('requestfailed',r=>errors.push('REQUEST:'+r.url()+':'+r.failure()?.errorText));
      for(const [pathname,transform] of [[ROUTE,instrumentRoute],[RENDERER,NEAR_FAR_STRAIGHT_ACTIVE?(src=>instrumentRenderer(transformNearFarStraightRenderer(src).source)):(WEST_FLANK_ACTIVE?(src=>instrumentRenderer(transformWestFlankMaterialRenderer(src).source)):(RAVINE_ANY_ACTIVE?instrumentRavineHabitatRenderer:(G1_PROFILE?(src=>instrumentG1(src,label,dir)):(GEN3042_PROFILE?(src=>instrumentGen3042(src,label,dir)):(profile==='MAPWIDE_CANDIDATE_V1'?instrumentCandidateRenderer:instrumentDiagnosticRenderer)))))]] ){
        const original=fs.readFileSync(path.join(dir,pathname),'utf8'),transformed=transform(original);runRecord.instrumentation.push({path:pathname,sourceSha256:sha(original),observedSha256:sha(transformed)});
        await page.route(url=>url.pathname===pathname,route=>route.fulfill({status:200,contentType:'text/javascript',body:transformed}));
      }
      const rendererHash=runRecord.instrumentation.find(x=>x.path===RENDERER)?.sourceSha256;if(!rendererHash)throw Error('GEN3042_RENDERER_HASH_MISSING');if(GEN3042_PROFILE)receipt.sourceRenderers[label]=rendererHash;else receipt.sourceProductSha256=rendererHash;
      persist();
      await page.goto(base+ROOT+'?arrival=approved-four-trees',{waitUntil:'domcontentloaded',timeout:120000});
      await page.waitForFunction(()=>document.querySelector('#h-earth-functional-landscape-route')?.dataset.run8eError==='true'||!!window.H_EARTH_RUN8E_PUBLIC_ROUTE?.getLiveGpuReceipt()?.resources?.geologicalFormation?.physicalNavigationInstalled,null,{timeout:600000});
      if(await page.evaluate(()=>document.querySelector('#h-earth-functional-landscape-route')?.dataset.run8eError==='true'))throw Error('RENDERER_STARTUP_FAILED');
      await page.waitForFunction(()=>['test','ready'].includes(document.querySelector('#h-earth-loading-screen')?.dataset.mode),null,{timeout:180000});
      await page.mouse.move(270,350);await page.mouse.down();await page.mouse.move(320,350,{steps:8});await page.mouse.up();
      await page.waitForFunction(()=>!document.querySelector('[data-enter]')?.disabled);await page.click('[data-enter]');
       if(GEN3042_PROFILE||G1_PROFILE)await page.waitForFunction(()=>{
         const shell=document.getElementById('h-earth-loading-screen'),root=document.getElementById('h-earth-functional-landscape-route');
         return shell?.hidden===true&&window.H_EARTH_STARTUP_LOADER?.getReceipt?.()?.mode==='entered'&&root?.dataset.run8eReady==='true'&&root?.dataset.run8eError!=='true';
       },null,{timeout:30000});


      // Gen3087 successor of terminal Gen3084: ONE unchanged published
      // baseline pose, 16 staged frames, 30 source-pinned first-hit pixels.
      // No prior Gen3084 GPU rerun and no A03 candidate capture.
      if(NEAR_FAR_STRAIGHT_ACTIVE){
        await page.evaluate(async()=>{const urls=performance.getEntriesByType('resource').map(x=>x.name).filter(x=>/\/navigation\.js\?/.test(x));const unique=[...new Set(urls)];if(unique.length!==1)throw Error('NAVIGATION_MODULE_IDENTITY_AMBIGUOUS:'+JSON.stringify(unique));const url=unique[0];let src=await(await fetch(url)).text();src=src.replace(/from\s*(['"])(\.[^'"]+)\1/g,(_,q,p)=>'from '+JSON.stringify(new URL(p,url).href));src+='\nexport {resolvePosition as auditResolvePosition,stateFrom as auditStateFrom};';globalThis.__groundComparisonNav=await import(URL.createObjectURL(new Blob([src],{type:'text/javascript'})));});
        const pose=NEAR_FAR_STRAIGHT_POSE;
        const samples=NEAR_FAR_STRAIGHT_STATIONS.flatMap((station,i)=>[
          {...station.far,side:'far',station:i,z:station.z},
          {...station.near,side:'near',station:i,z:station.z}
        ]);
        let seq=308700,rows=[];
        for(let mode=0;mode<NEAR_FAR_STRAIGHT_STAGE_MODES.length;mode++){
          const sampled=await page.evaluate(({pose,mode,seq,samples})=>{
            globalThis.__ravineHabitatProbeMode=mode;
            globalThis.__ravineExpectedLocalTarget={x:-384.00515163,y:5.39056176,z:-400.00536627};
            globalThis.__groundComparisonHideGrass=false;
            const state=globalThis.__groundComparisonState(globalThis.__groundComparisonNav,pose,seq,'GEN3087_NEAR_FAR_PLANETARY');
            globalThis.__HEarthAuditPresent(state);
            const canvas=document.querySelector('#h-earth-functional-landscape-canvas');
            if(!canvas||canvas.width!==529||canvas.height!==980)throw Error('NEAR_FAR_VIEWPORT_MISMATCH');
            const packet=globalThis.__HEarthAuditPacket({
              deferVegetation:true,navigationState:state,
              viewport:{width:canvas.width,height:canvas.height,pixelRatio:1},frameSequence:seq
            });
            if(!packet?.camera?.localAuthoringPosition||!globalThis.__ravineProjectTarget)
              throw Error('NEAR_FAR_CAMERA_READBACK_UNAVAILABLE');
            const actualLocal=packet.camera.localAuthoringPosition;
            // Packet: R3A CPU source truth; GPU readback below independently
            // verifies the bound geometry program's actual camera uniforms.
            const cameraAudit={
              status:packet.status,frameSequence:packet.frameSequence,
              navigationSequence:packet.navigationSequence,
              navigationCameraY:packet.navigationCameraY,
              presentationCameraY:packet.presentationCameraY,
              r3aPresentationCameraYDelta:packet.r3aPresentationCameraYDelta,
              projectedCameraY:packet.projectedCameraY,
              successorTerrainCameraReconciled:packet.successorTerrainCameraReconciled,
              singleSphericalPresentationManifold:packet.singleSphericalPresentationManifold,
              cameraAndWorldSharePlanetaryFrame:packet.cameraAndWorldSharePlanetaryFrame,
              planetRelativeUp:packet.planetRelativeUp,
              worldRecenteredForCamera:packet.worldRecenteredForCamera,
              viewport:packet.viewport,camera:packet.camera,
              navigationState:{position:state.position,yawDegrees:state.yawDegrees,pitchDegrees:state.pitchDegrees}
            };
            const gpuUniform=globalThis.__nearFarGpuUniformReadback?.()??null;
            const projected=samples.map(sample=>{
              const point={x:sample.world[0],y:sample.world[1],z:sample.world[2]};
              const hit=globalThis.__ravineProjectTarget(point,packet);
              return {screen:[hit.x,canvas.height-1-hit.y],expectedDepth:(hit.ndc[2]+1)/2};
            });
            const receipt=H_EARTH_RUN8E_PUBLIC_ROUTE.getLiveGpuReceipt();
            const before=receipt.frameRecords.at(-1);
            const rgba=samples.map(sample=>globalThis.__ravineReadGeometryPixel(sample.pixel[0],canvas.height-1-sample.pixel[1]));
            const dataUrl=canvas.toDataURL('image/png');
            const after=H_EARTH_RUN8E_PUBLIC_ROUTE.getLiveGpuReceipt().frameRecords.at(-1);
            return {rgba,projected,actualLocal,cameraAudit,gpuUniform,before,after,dataUrl,
              modeApplied:globalThis.__ravineHabitatProbeModeApplied,
              asset:receipt.resources?.geologicalFormation};
          },{pose,mode,seq:++seq,samples});
          if(sampled.modeApplied!==mode)throw Error('NEAR_FAR_MODE_NOT_APPLIED:'+mode);
          validateNearFarPlanetaryPacket(sampled.cameraAudit,pose);
          validateNearFarGpuUniforms(sampled.gpuUniform,sampled.cameraAudit,sampled.after);
          if(sampled.before?.navigationSequence!==seq||sampled.after?.navigationSequence!==seq||
             sampled.before?.frameSequence!==sampled.after?.frameSequence)
            throw Error('NEAR_FAR_FRAME_CHANGED:'+mode);
          if(!sampled.asset?.physicalNavigationInstalled)throw Error('NEAR_FAR_SOURCE_GEOMETRY_NOT_INSTALLED');
          if(!['x','y','z'].every(k=>Number.isFinite(sampled.actualLocal[k])&&Math.abs(sampled.actualLocal[k]-pose[k])<0.01))
            throw Error('NEAR_FAR_ACTUAL_GPU_CAMERA_DRIFT');
          if(sampled.projected.length!==30||sampled.projected.some((p,i)=>
            Math.abs(p.screen[0]-samples[i].pixel[0])>1||Math.abs(p.screen[1]-samples[i].pixel[1])>1||
            !Number.isFinite(p.expectedDepth)||p.expectedDepth<0||p.expectedDepth>1||
            Math.abs(p.expectedDepth-samples[i].depth)>0.001))
            throw Error('NEAR_FAR_SOURCE_PROJECTED_PIXEL_OR_DEPTH_DRIFT');
          const png=decodeCanvasCapture({before:sampled.before,after:sampled.after,dataUrl:sampled.dataUrl},sampled.before);
          const name='source_near_far_straight-'+String(mode).padStart(2,'0')+'-'+NEAR_FAR_STRAIGHT_STAGE_MODES[mode]+'.png';
          fs.writeFileSync(path.join(out,name),png);
          rows.push({mode,stage:NEAR_FAR_STRAIGHT_STAGE_MODES[mode],
            sourceHead:HEADS[label],rgba:sampled.rgba,projected:sampled.projected,
            actualLocalCamera:sampled.actualLocal,frameCamera:sampled.after.cameraPosition,
            actualGpuCameraUniform:sampled.gpuUniform.camera,
            r3aProjectionVerified:true,gpuUniformReadbackVerified:true,
            frameSequence:sampled.after.frameSequence,image:name,imageSha256:sha(png),imageBytes:png.length});
          receipt.nearFarStraight={
            schema:'H_EARTH_SOURCE_NEAR_FAR_PLANETARY_BASELINE_STAGE_RECEIPT_v1',
            result:'IN_PROGRESS',operationId:'H_EARTH_STRAIGHT_NEAR_FAR_PLANETARY_BASELINE_WEBGL_20261102_001',
            sourcePlan:NEAR_FAR_STRAIGHT_SOURCE_BINDING,sourcePose:pose,
            sourceStationCount:15,originalSourceMatches:30,planetarySourceMatches:30,frames:rows.length,
            sphericalSourceOnlyArchiveVerified:true,actualR3aCameraAndGpuUniformReadbackVerified:true,
            sourceFirstHitsExpectedOnly:true,ownerPhonePhotoMatch:false,
            candidateGpu:false,productMutation:false,publicationAuthorized:false
          };
          persist();
        }
        if(rows.length!==16||rows.some(r=>r.rgba.length!==30||r.sourceHead!==HEADS[label]||
           JSON.stringify(r.actualLocalCamera)!==JSON.stringify(rows[0].actualLocalCamera)||
           JSON.stringify(r.frameCamera)!==JSON.stringify(rows[0].frameCamera)))
          throw Error('NEAR_FAR_STAGE_OR_CAMERA_CENSUS_INVALID');
        const role=rows[6].rgba.map(q=>q[0]);
        const primitive=rows[7].rgba.map(q=>((q[0]<<16)|(q[1]<<8)|q[2])>>>0);
        const measuredDepth=rows[8].rgba.map(q=>((q[0]<<16)|(q[1]<<8)|q[2])/16777215);
        const depthResidual=measuredDepth.map((v,i)=>Math.abs(v-rows[8].projected[i].expectedDepth));
        const mismatched=samples.flatMap((p,i)=>
          role[i]!==p.role||primitive[i]!==p.primitive||depthResidual[i]>0.005
          ? [{station:p.station,side:p.side,role:role[i],expectedRole:p.role,
              primitive:primitive[i],expectedPrimitive:p.primitive,depthResidual:depthResidual[i]}]:[]);
        const lit=rows[0].rgba;
        const perStation=NEAR_FAR_STRAIGHT_STATIONS.map((p,i)=>({
          z:p.z,farPixel:p.far.pixel,nearPixel:p.near.pixel,
          farSourceTriangle:p.far.triangle,nearSourceTriangle:p.near.triangle,
          sourceTriangleIdentityGpuProven:false,
          farLit:lit[2*i].slice(0,3),nearLit:lit[2*i+1].slice(0,3),
          litFarMinusNear:lit[2*i].slice(0,3).map((v,k)=>v-lit[2*i+1][k])
        }));
        receipt.nearFarStraight={...receipt.nearFarStraight,
          rows,actualSourceRoles:role,actualSourcePrimitives:primitive,
          actualDepth24:measuredDepth,sourceDepthResiduals:depthResidual,
          mismatchCount:mismatched.length,mismatched,
          perStation,sourceFirstHitsExpectedOnly:false,
          result:mismatched.length?'INSTRUMENTATION_GAP':'STAGES_CAPTURED_VISUAL_REVIEW_REQUIRED',
          ownerStraightCutoffVisuallyProven:false,ownerCurvedWedgeProven:false,
          finalLitVisualClassificationRequired:true};
        receipt.result=receipt.nearFarStraight.result;
        persist();
        if(mismatched.length)throw Error('NEAR_FAR_FIRST_HIT_OR_DEPTH_MISMATCH');
        runRecord.completedAt=new Date().toISOString();
        await context.close();server.kill();server=null;
        assertCheckout(dir,HEADS[label]);
        if(errors.length)throw Error('NEAR_FAR_BROWSER_ERRORS:'+errors.join(';'));
        continue;
      }

      if(WEST_FLANK_ACTIVE){
      await page.evaluate(async()=>{const urls=performance.getEntriesByType('resource').map(x=>x.name).filter(x=>/\/navigation\.js\?/.test(x));const unique=[...new Set(urls)];if(unique.length!==1)throw Error('NAVIGATION_MODULE_IDENTITY_AMBIGUOUS:'+JSON.stringify(unique));const url=unique[0];let src=await(await fetch(url)).text();src=src.replace(/from\s*(['"])(\.[^'"]+)\1/g,(_,q,p)=>'from '+JSON.stringify(new URL(p,url).href));src+='\nexport {resolvePosition as auditResolvePosition,stateFrom as auditStateFrom};';globalThis.__groundComparisonNav=await import(URL.createObjectURL(new Blob([src],{type:'text/javascript'})));});
        const pose=WEST_FLANK_FROZEN_POSE;
        let seq=24000;
        const stageRows=[];
        for(let mode=0;mode<WEST_FLANK_STAGE_MODES.length;mode++){
          const sample=await page.evaluate(async ({pose,mode,seq,target,pixels})=>{
            globalThis.__ravineHabitatProbeMode=mode;
            globalThis.__ravineExpectedLocalTarget=target;
            globalThis.__groundComparisonHideGrass=false;
            const state=globalThis.__groundComparisonState(globalThis.__groundComparisonNav,pose,seq,'GEN3079_WEST_FLANK_STAGE');
            globalThis.__HEarthAuditPresent(state);
            const canvas=document.querySelector('#h-earth-functional-landscape-canvas');
            if(!canvas||canvas.width!==529||canvas.height!==980)throw Error('WEST_FLANK_VIEWPORT_DRIFT');
            const receipt=H_EARTH_RUN8E_PUBLIC_ROUTE.getLiveGpuReceipt();
            const before=receipt.frameRecords.at(-1);
            const rgba=pixels.map(p=>globalThis.__ravineReadGeometryPixel(p.x,canvas.height-1-p.y));
            const dataUrl=canvas.toDataURL('image/png');
            const after=H_EARTH_RUN8E_PUBLIC_ROUTE.getLiveGpuReceipt().frameRecords.at(-1);
            return {state,rgba,before,after,dataUrl,modeApplied:globalThis.__ravineHabitatProbeModeApplied,
              asset:receipt.resources?.geologicalFormation};
          },{pose,mode,seq:++seq,target:WEST_FLANK_SOURCE_TARGET,pixels:WEST_FLANK_PIXELS});
          if(sample.modeApplied!==mode)throw Error('WEST_FLANK_MODE_NOT_APPLIED:'+mode);
          if(sample.before?.navigationSequence!==seq||sample.after?.navigationSequence!==seq||
             sample.before?.frameSequence!==sample.after?.frameSequence)
            throw Error('WEST_FLANK_FRAME_MISMATCH:'+mode);
          if(!sample.asset?.physicalNavigationInstalled)throw Error('WEST_FLANK_GEOMETRY_NOT_LOADED');
          const png=decodeCanvasCapture({before:sample.before,after:sample.after,dataUrl:sample.dataUrl},sample.before);
          const name='west_flank-'+String(mode).padStart(2,'0')+'-'+WEST_FLANK_STAGE_MODES[mode]+'.png';
          fs.writeFileSync(path.join(out,name),png);
          stageRows.push({mode,stage:WEST_FLANK_STAGE_MODES[mode],rgba:sample.rgba,
            sourceFrame:sample.after.frameSequence,sourceNavigation:sample.after.navigationSequence,
            frameCamera:sample.after.cameraPosition,sourceHead:HEADS[label],
            image:name,imageSha256:sha(png),imageBytes:png.length});
          receipt.westFlankPixelStages={schema:'H_EARTH_WEST_FLANK_PIXEL_STAGES_GEN3079_v1',
            status:'STAGES_CAPTURED_SAME_TRIANGLE_NOT_VERIFIED',camera:pose,
            targets:WEST_FLANK_PIXELS,stageRows,originalSourceTriangle11650NotRevalidated:true,
            noOwnerAndroidPhotoMatch:true,healthyControlNotVerified:true,productMutation:false};
          persist();
        }
        if(stageRows.length!==16||stageRows.some(q=>q.rgba.length!==2||
           q.rgba.some(p=>p.length!==4)||q.sourceHead!==HEADS[label]))
          throw Error('WEST_FLANK_STAGE_CENSUS_INCOMPLETE');
        const firstHitRole=stageRows[6].rgba.map(p=>p[0]);
        const firstHitPrimitive=stageRows[7].rgba.map(p=>(p[0]<<16)|(p[1]<<8)|p[2]);
        const sameGeom=firstHitRole.every(v=>v===1)&&firstHitPrimitive[0]===firstHitPrimitive[1];
        const delta=(before,after)=>before.rgba.map((px,i)=>after.rgba[i].slice(0,3).map((c,j)=>c-px[j]));
        receipt.westFlankPixelStages={...receipt.westFlankPixelStages,
          sameUploadedPrimitiveClass:sameGeom,exactOriginalTriangleIdentityProven:false,
          actualRoleCodes:firstHitRole,actualPrimitiveCodes:firstHitPrimitive,
          worldSoilDelta:delta(stageRows[10],stageRows[11]),
          environmentalIdentityDelta:delta(stageRows[12],stageRows[13]),
          groundcoverDelta:delta(stageRows[14],stageRows[15]),
          habitatDelta:delta(stageRows[4],stageRows[5]),
          litWithoutHabitatDelta:delta(stageRows[9],stageRows[0]),
          status:sameGeom?'PIXEL_STAGE_READBACK_COMPLETE_TRIANGLE_ID_PENDING':'FIRST_HIT_CLASS_DISAGREEMENT'};
        receipt.result=receipt.westFlankPixelStages.status;
        persist();
        if(!sameGeom)throw Error('WEST_FLANK_PIXEL_FIRST_HIT_ROLE_OR_PRIMITIVE_MISMATCH');
        runRecord.completedAt=new Date().toISOString();
        await context.close();server.kill();server=null;assertCheckout(dir,HEADS[label]);
        if(errors.length)throw Error('WEST_FLANK_BROWSER_ERRORS:'+errors.join(';'));
        continue;
      }
      if(RAVINE_ANY_ACTIVE){
        await page.waitForFunction(()=>typeof globalThis.__ravinePublishedGeologicalSurfaceAt==='function',null,{timeout:30000});
        const probe=await page.evaluate(()=>{
          const at=globalThis.__ravinePublishedGeologicalSurfaceAt;
          const derive=globalThis.__deriveRavineEmittedSurfaceObserver;
          if(typeof at!=='function'||typeof derive!=='function')
            throw Error('RAVINE_SAMPLER_OR_DERIVATION_MISSING');
          const candidates=[
            {name:'ravine-west',x:-298,z:-546},
            {name:'outside-habitat-control',x:-302,z:-546}
          ].map(q=>derive(at,q));
          const live=globalThis.H_EARTH_RUN8E_PUBLIC_ROUTE?.getLiveGpuReceipt();
          if(!live?.resources?.geologicalFormation?.physicalNavigationInstalled)
            throw Error('RAVINE_LIVE_EMITTED_FORMATION_NOT_INSTALLED');
          return {schema:'RAVINE_EMITTED_SURFACE_OBSERVER_EVIDENCE_v1',
            result:'TWO_EMITTED_TRIANGLE_OBSERVERS_DERIVED_GPU_FIRST_HIT_UNPROVEN',
            provenance:'EXACT_INSTALLED_GEOLOGICAL_RUNTIME_EMITTED_TRIANGLE_SAMPLER',
            candidates,geologicalFormation:live.resources.geologicalFormation,
            observerOnly:true,firstHitPixelReadback:false,ownerPhotoCorrespondence:false,
            productMutation:false,releaseAuthorized:false};
        });
        receipt.ravineObserverPreflight=probe;

        if(RAVINE_PIXEL_ACTIVE){
      await page.evaluate(async()=>{const urls=performance.getEntriesByType('resource').map(x=>x.name).filter(x=>/\/navigation\.js\?/.test(x));const unique=[...new Set(urls)];if(unique.length!==1)throw Error('NAVIGATION_MODULE_IDENTITY_AMBIGUOUS:'+JSON.stringify(unique));const url=unique[0];let src=await(await fetch(url)).text();src=src.replace(/from\s*(['"])(\.[^'"]+)\1/g,(_,q,p)=>'from '+JSON.stringify(new URL(p,url).href));src+='\nexport {resolvePosition as auditResolvePosition,stateFrom as auditStateFrom};';globalThis.__groundComparisonNav=await import(URL.createObjectURL(new Blob([src],{type:'text/javascript'})));});
          let sequence=22000;const evidence=[];
          for(const pose of probe.candidates){
            for(let mode=0;mode<RAVINE_HABITAT_MODES.length;mode++){
              const v=await page.evaluate(({pose,mode,sequence})=>{
                globalThis.__ravineHabitatProbeMode=mode;
                globalThis.__ravineExpectedLocalTarget=pose.referenceTarget;
                globalThis.__groundComparisonHideGrass=true;
                const state=globalThis.__groundComparisonState(globalThis.__groundComparisonNav,pose,sequence,'GEN3074_PIXEL');
                globalThis.__HEarthAuditPresent(state);
                const canvas=document.querySelector('#h-earth-functional-landscape-canvas');
                if(!canvas||!globalThis.__ravineProjectTarget||!globalThis.__ravineReadGeometryPixel)
                  throw Error('RAVINE_GPU_STAGE_INSTRUMENTATION_MISSING');
                const packet=globalThis.__HEarthAuditPacket({deferVegetation:true,navigationState:state,viewport:{width:canvas.width,height:canvas.height,pixelRatio:1},frameSequence:sequence});
                const pixel=globalThis.__ravineProjectTarget(pose.referenceTarget,packet);
                const rgba=globalThis.__ravineReadGeometryPixel(pixel.x,pixel.y);
                const live=H_EARTH_RUN8E_PUBLIC_ROUTE.getLiveGpuReceipt(),before=live.frameRecords.at(-1);
                const dataUrl=canvas.toDataURL('image/png');
                const after=H_EARTH_RUN8E_PUBLIC_ROUTE.getLiveGpuReceipt().frameRecords.at(-1);
                return {pixel,rgba,camera:packet.camera.position,localCamera:packet.camera.localAuthoringPosition,
                  applied:globalThis.__ravineHabitatProbeModeApplied,geology:live.resources?.geologicalFormation,
                  before,after,dataUrl};
              },{pose,mode,sequence:++sequence});
              if(v.applied!==mode)throw Error('RAVINE_MODE_NOT_APPLIED:'+mode);
              if(v.before?.navigationSequence!==sequence||v.after?.navigationSequence!==sequence||
                 v.before?.frameSequence!==v.after?.frameSequence)
                throw Error('RAVINE_FRAME_CORRESPONDENCE_MISMATCH');
              if(!v.geology?.physicalNavigationInstalled||v.geology?.attachedMeshCount<2)
                throw Error('RAVINE_GEOLOGY_NOT_INSTALLED_AT_CAPTURE');
              const png=decodeCanvasCapture({before:v.before,after:v.after,dataUrl:v.dataUrl},v.before);
              const name=pose.name+'-'+RAVINE_HABITAT_MODES[mode]+'.png';
              fs.writeFileSync(path.join(out,name),png);
              receipt.views.push({pose:{name:pose.name,sourceDerived:true,sourceEvidenceId:pose.sourceEvidenceId,
                firstHitAttributionAvailable:false},mode:RAVINE_HABITAT_MODES[mode],
                diagnosticApplied:mode,sourceHead:HEADS[label],
                sourceRendererBlob:RAVINE_HABITAT_TARGET.exactRendererBlob,
                rendererHash:runRecord.instrumentation.find(x=>x.path===RENDERER)?.sourceSha256,
                camera:v.camera,localCamera:v.localCamera,pixel:v.pixel,rgba:v.rgba,
                frame:v.after,sourceTarget:pose.referenceTarget,firstHitPixelReadback:true,
                assetSignature:JSON.stringify(v.geology),image:name,imageSha256:sha(png),imageBytes:png.length});
              persist();
            }
            const group=receipt.views.filter(v=>v.pose.name===pose.name);
            if(group.length!==10||group.some(v=>v.camera.x!==group[0].camera.x||
               v.camera.y!==group[0].camera.y||v.camera.z!==group[0].camera.z||
               v.pixel.x!==group[0].pixel.x||v.pixel.y!==group[0].pixel.y||
               v.assetSignature!==group[0].assetSignature))
              throw Error('RAVINE_CAMERA_PIXEL_OR_SOURCE_DRIFT');
            const rgba=mode=>group.find(x=>x.mode===mode).rgba;
            const role=rgba('first-hit-role-byte'),id=rgba('first-hit-primitive-24bit');
            const primitive=((id[0]<<16)|(id[1]<<8)|id[2])>>>0;
            const distance=role[1]*2/255,firstHitPass=role[0]===1&&primitive===62000&&distance<=0.65;
            const before=rgba('before-habitat-unlit'),after=rgba('after-habitat-unlit');
            const lit=rgba('reference-lit'),counter=rgba('final-lit-without-habitat-color');
            const unlitDelta=before.slice(0,3).map((v,i)=>after[i]-v);
            const finalDelta=lit.slice(0,3).map((v,i)=>v-counter[i]);
            const effect=Math.max(...unlitDelta.map(Math.abs),...finalDelta.map(Math.abs));
            const result=!firstHitPass?'INSTRUMENTATION_GAP':effect>=2?'SUPPORTED_AT_VIEW':'NOT_SUPPORTED_AT_VIEW';
            evidence.push({name:pose.name,result,roleCode:role[0],primitive,worldDistanceMeters:distance,
              firstHitPass,unlitDelta,finalDelta,effectiveHabitatWeight:rgba('effective-habitat-color-weight')[0]/255,
              pixel:group[0].pixel,camera:group[0].camera,sourceTarget:pose.referenceTarget});
            receipt.pixelAttribution={schema:'RAVINE_HABITAT_PIXEL_ATTRIBUTION_v1',
              result,firstHit:evidence,firstHitPixelReadback:true,
              mapWideAcceptance:false,ownerPhotoCorrespondence:false,publicationAuthorized:false};
            persist();
            if(!firstHitPass)throw Error('RAVINE_FIRST_HIT_NOT_SOURCE_BOUND:'+pose.name);
          }
          receipt.result=evidence.every(x=>x.result==='SUPPORTED_AT_VIEW')?'SUPPORTED_AT_VIEW':
            evidence.some(x=>x.result==='NOT_SUPPORTED_AT_VIEW')?'NOT_SUPPORTED_AT_VIEW':'INSTRUMENTATION_GAP';
          receipt.pixelAttribution={...receipt.pixelAttribution,result:receipt.result,modeCount:10,captureCount:receipt.views.length};
          persist();
        }else receipt.result=probe.result;
        runRecord.completedAt=new Date().toISOString();persist();
        await context.close();server.kill();server=null;
        assertCheckout(dir,HEADS[label]);
        if(errors.length)throw Error('RAVINE_OBSERVER_BROWSER_ERRORS:'+errors.join(';'));
        continue;
      }
      await page.evaluate(async()=>{const urls=performance.getEntriesByType('resource').map(x=>x.name).filter(x=>/\/navigation\.js\?/.test(x));const unique=[...new Set(urls)];if(unique.length!==1)throw Error('NAVIGATION_MODULE_IDENTITY_AMBIGUOUS:'+JSON.stringify(unique));const url=unique[0];let src=await(await fetch(url)).text();src=src.replace(/from\s*(['"])(\.[^'"]+)\1/g,(_,q,p)=>'from '+JSON.stringify(new URL(p,url).href));src+='\nexport {resolvePosition as auditResolvePosition,stateFrom as auditStateFrom};';globalThis.__groundComparisonNav=await import(URL.createObjectURL(new Blob([src],{type:'text/javascript'})));});
      let sequence=10000,previousFrame=0;
      for(const pose of poses)for(const mode of modes){
        const hidden=(GEN3042_PROFILE||G1_PROFILE)?mode!=='reference-lit':true;await page.evaluate(value=>{globalThis.__groundcoverFactorMode=value;},MODE_ID_BY_NAME.get(mode));
        const settleDeadline=Date.now()+180000;let stable=0,signature=null;
        while(stable<2){
          const settled=await page.evaluate(async({pose,hidden,sequence})=>{
            globalThis.__groundComparisonHideGrass=hidden;const state=globalThis.__groundComparisonState(globalThis.__groundComparisonNav,pose,sequence,'READ_ONLY_GROUND_COMPARISON_SETTLE');
            globalThis.__HEarthAuditPresent(state);await new Promise(requestAnimationFrame);await new Promise(requestAnimationFrame);
            const gpu=H_EARTH_RUN8E_PUBLIC_ROUTE.getLiveGpuReceipt(),canvas=document.querySelector('#h-earth-functional-landscape-canvas');const expected=globalThis.__HEarthAuditPacket({deferVegetation:true,navigationState:state,viewport:{width:canvas.width,height:canvas.height,pixelRatio:1},frameSequence:sequence});return {asset:globalThis.__groundAssetReadiness(gpu.resources,expected.camera.position),frame:gpu.frameRecords.at(-1)};
          },{pose,hidden,sequence:sequence+1});
          receipt.lastSettle={label,pose,...settled};persist();
          stable=settled.frame.navigationSequence===sequence+1&&settled.asset.ready&&settled.asset.signature===signature?stable+1:0;signature=settled.asset.signature;
          if(Date.now()>settleDeadline)throw Error('ASSETS_NOT_SETTLED');
          if(stable<2)await new Promise(r=>setTimeout(r,250));
        }

        const view=await page.evaluate(async({pose,hidden,sequence})=>{
          globalThis.__groundComparisonHideGrass=hidden;const state=globalThis.__groundComparisonState(globalThis.__groundComparisonNav,pose,sequence,'READ_ONLY_GROUND_COMPARISON');
          globalThis.__HEarthAuditPresent(state);await new Promise(requestAnimationFrame);await new Promise(requestAnimationFrame);
          const costs=[];for(let i=0;i<12;i++){const t=performance.now();globalThis.__HEarthAuditPresent(state);costs.push(performance.now()-t);await new Promise(requestAnimationFrame);}
          const gpu=H_EARTH_RUN8E_PUBLIC_ROUTE.getLiveGpuReceipt(),canvas=document.querySelector('#h-earth-functional-landscape-canvas');
          const expectedPacket=globalThis.__HEarthAuditPacket({deferVegetation:true,navigationState:state,viewport:{width:canvas.width,height:canvas.height,pixelRatio:1},frameSequence:sequence});
          return {state,expectedCameraPosition:expectedPacket.camera.position,lastFrame:gpu.frameRecords.at(-1),canvas:{width:canvas.width,height:canvas.height,cssWidth:canvas.clientWidth,cssHeight:canvas.clientHeight},cpuSubmitMilliseconds:costs,resources:gpu.resources,grassHidden:hidden,diagnosticApplied:globalThis.__groundcoverFactorModeApplied};
        },{pose,hidden,sequence:++sequence});
        receipt.lastAttempt={label,pose,mode,...view};persist();
        if(view.diagnosticApplied!==MODE_ID_BY_NAME.get(mode))throw Error('DIAGNOSTIC_MODE_NOT_APPLIED');
        const assets=assetReadiness(view.resources,view.lastFrame.cameraPosition);if(!assets.ready||assets.signature!==signature)throw Error('ASSETS_CHANGED_DURING_CAPTURE');view.assetSignature=assets.signature;
        validateFrame(view,pose,sequence);if(view.lastFrame.frameSequence<=previousFrame)throw Error('FRAME_DID_NOT_ADVANCE');previousFrame=view.lastFrame.frameSequence;
        const name=label+'-'+pose.name+'-'+mode+'.png';const capture=await page.evaluate(()=>{const canvas=document.querySelector('#h-earth-functional-landscape-canvas');const gl=canvas?.getContext('webgl2');if(!gl||gl.isContextLost()||gl.getContextAttributes()?.preserveDrawingBuffer!==true)throw Error('CAPTURE_CONTEXT_NOT_PRESERVED');const before=H_EARTH_RUN8E_PUBLIC_ROUTE.getLiveGpuReceipt().frameRecords.at(-1);const dataUrl=canvas.toDataURL('image/png');const after=H_EARTH_RUN8E_PUBLIC_ROUTE.getLiveGpuReceipt().frameRecords.at(-1);return {dataUrl,before,after};});const bytes=decodeCanvasCapture(capture,view.lastFrame);fs.writeFileSync(path.join(out,name),bytes);
        const after=await page.evaluate(()=>H_EARTH_RUN8E_PUBLIC_ROUTE.getLiveGpuReceipt().frameRecords.at(-1));if(after.navigationSequence!==sequence||after.frameSequence!==view.lastFrame.frameSequence)throw Error('CAPTURE_FRAME_CHANGED');
        receipt.views.push({label,pose,mode,instrumentation:runRecord.instrumentation,...view,modeId:MODE_ID_BY_NAME.get(mode),sourceHead:HEADS[label],rendererHash:GEN3042_PROFILE?receipt.sourceRenderers[label]:receipt.sourceProductSha256,captureMethod:'PRESERVED_WEBGL_CANVAS_PNG',imageWidth:529,imageHeight:980,image:name,imageSha256:sha(bytes),imageBytes:bytes.length});persist();
      }
      runRecord.transfers=await page.evaluate(()=>performance.getEntriesByType('resource').map(x=>({name:x.name,transferSize:x.transferSize,duration:x.duration})));runRecord.completedAt=new Date().toISOString();persist();
      await context.close();server.kill();server=null;assertCheckout(dir,HEADS[label]);if(errors.length)throw Error('BROWSER_ERRORS:'+label);
    }
    if(WEST_FLANK_ACTIVE){if(!receipt.westFlankPixelStages||receipt.westFlankPixelStages.stageRows.length!==16)throw Error('WEST_FLANK_RECEIPT_INCOMPLETE');}
    else if(RAVINE_ANY_ACTIVE){if(!receipt.ravineObserverPreflight||(RAVINE_OBSERVER_ACTIVE&&receipt.views.length!==0))throw Error('RAVINE_OBSERVER_RECEIPT_INCOMPLETE');}
     else if(G1_PROFILE){receipt.g1=validateG1Set(receipt.views);receipt.result=INLAND_BAND_PROFILE?'INLAND_BAND_CAPTURE_COMPLETE_OWNER_CLASS_UNQUALIFIED':'G1_SOURCE_DERIVED_CAPTURE_COMPLETE_OWNER_CLASS_UNQUALIFIED';}
     else if(GEN3042_PROFILE){receipt.triad=validateGen3042(receipt.views);receipt.result='GEN3042_SOIL_TRIAD_CAPTURE_COMPLETE_VISUAL_REVIEW_PENDING';}
    else{validateDiagnosticSet(receipt.views,poses,modes);receipt.result='DIAGNOSTIC_CAPTURE_COMPLETE_FACTOR_REVIEW_PENDING';}
  }catch(e){receipt.result='INCOMPLETE_OR_FAILED';receipt.errors.push(String(e?.stack??e));throw e;}
  finally{persist();server?.kill();if(browser)await browser.close();process.removeListener('SIGTERM',onTerm);process.removeListener('SIGINT',onInt);}
  return receipt;
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url))run(process.argv.slice(2)).catch(e=>{console.error(e);process.exitCode=1;});



// REV2 source-only evidence transport contract. All 18 numeric modes must
// read the SAME 12 G1 locations and 15 exact 32-pixel seam windows. This
// cannot certify GPU evidence, an original camera, or G1 reference custody.
export function rev2FrozenReadbackPlan(){
 const g1=REV2_G1_FIXED_PIXELS.map(({x,y})=>Object.freeze([x,rev2GlY(y),1,1]));
 const seam=REV2_NUMERIC_SEAMS.map(s=>{
  const r=rev2StationPixelSpan(s);return Object.freeze([r.x,r.y,r.width,r.height]);
 });
 return Object.freeze({schema:'H_EARTH_REV2_FROZEN_READBACK_PLAN_v1',
  viewport:Object.freeze([529,980]),g1Count:12,seamCount:15,
  regions:Object.freeze([...g1,...seam])});
}
export function validateRev2FrozenModeCapture(capture,{pose,mode}={}){
 const fail=code=>{throw Error('REV2_READBACK_'+code);};
 if(!Number.isInteger(pose)||pose<0||pose>1||
    !Number.isInteger(mode)||mode<1||mode>18)fail('POSE_OR_MODE_INVALID');
 const plan=rev2FrozenReadbackPlan();
 if(!capture||capture.pose!==pose||capture.mode!==mode||
    capture.sourceCameraUniformVerified!==true||
    !Array.isArray(capture.regions)||!Array.isArray(capture.rgbaFloat32)||
    capture.regions.length!==plan.regions.length||
    capture.rgbaFloat32.length!==plan.regions.length)fail('CAPTURE_OR_CAMERA_INCOMPLETE');
 for(let i=0;i<plan.regions.length;i++){
  const expected=plan.regions[i],got=capture.regions[i],pixels=capture.rgbaFloat32[i];
  if(!Array.isArray(got)||got.length!==4||got.some((v,j)=>v!==expected[j]))
   fail('REGION_ORDER_OR_ORIGIN_MISMATCH');
  if(!(pixels instanceof Float32Array)||pixels.length!==expected[2]*expected[3]*4||
     pixels.some(v=>!Number.isFinite(v)))fail('PIXEL_FORMAT_OR_COVERAGE_INVALID');
 }
 return Object.freeze({schema:'H_EARTH_REV2_FROZEN_MODE_READBACK_v1',
  pose,mode,capture,sourceCameraUniformVerified:true,
  hardwareEvidenceAuthenticated:false});
}
export function compareRev2G1FirstHits(mode1,reference,{pose}={}){
 const fail=code=>{throw Error('REV2_G1_FIRST_HIT_'+code);};
 const read=validateRev2FrozenModeCapture(mode1,{pose,mode:1});
 const plan=rev2FrozenReadbackPlan();
 if(!reference||reference.pose!==pose||
    reference.productHead!==REV2_G1_STATIC_PREFLIGHT.product||
    reference.rendererBlob!==REV2_G1_STATIC_PREFLIGHT.blobs['showroom/globe/h-earth/render/persistent-live-renderer.run8e-r3c.cp2-additive-bandlimited-relief-v2.js']||
    reference.origin!=='TOP_LEFT'||!Array.isArray(reference.observations)||
    reference.observations.length!==12)fail('INDEPENDENT_REFERENCE_REQUIRED');
 const matched=[];
 for(let i=0;i<12;i++){
  const expected=reference.observations[i],p=read.capture.rgbaFloat32[i],
   frozen=REV2_G1_FIXED_PIXELS[i];
  if(!expected||expected.x!==frozen.x||expected.y!==frozen.y||
     !Number.isInteger(expected.role)||!Number.isInteger(expected.primitive)||
     expected.role<0||expected.primitive<0||
     expected.role>16777216||expected.primitive>16777216||
     !Number.isFinite(expected.depth)||expected.depth<0||expected.depth>1||
     ![0,1].includes(expected.ordinary))fail('REFERENCE_VALUE_INVALID');
  if(!Number.isInteger(p[0])||!Number.isInteger(p[1])||
     p[0]!==expected.role||p[1]!==expected.primitive||
     p[2]<0||p[2]>1||Math.abs(p[2]-expected.depth)>REV2_CAPTURE_LIMITS.firstHitDepthCeiling||
     Math.abs(p[3]-expected.ordinary)>REV2_CAPTURE_LIMITS.float32RoundtripCeiling)
   fail('ROLE_PRIMITIVE_DEPTH_OR_ORIGIN_MISMATCH');
  matched.push(Object.freeze({x:frozen.x,y:frozen.y,role:p[0],
    primitive:p[1],depth:p[2],ordinary:p[3]}));
 }
 return Object.freeze({schema:'H_EARTH_REV2_G1_FIRST_HIT_COMPARISON_v1',
  pose,matchedCount:12,matched:Object.freeze(matched),
  result:'REFERENCE_NUMERIC_COMPARISON_ONLY',
  independentReferenceAuthenticated:false,
  gpuEvidenceAuthenticated:false,ownerVisualAcceptance:false});
}
export function analyzeRev2FrozenSeamControls(captures,reference,{pose}={}){
 const fail=code=>{throw Error('REV2_SEAM_'+code);};
 if(!Array.isArray(captures)||captures.length!==18)fail('EIGHTEEN_MODES_REQUIRED');
 const modes=captures.map((r,i)=>validateRev2FrozenModeCapture(r,{pose,mode:i+1}));
 const firstHits=compareRev2G1FirstHits(captures[0],reference,{pose});
 const stations=REV2_NUMERIC_SEAMS.map((station,j)=>{
  const pixels=Array.from({length:32},(_,i)=>{
   const rows=modes.map(r=>Array.from(r.capture.rgbaFloat32[12+j].subarray(i*4,i*4+4)));
   return decodeRev2FloatPixel(rows);
  });
  const paired=(i)=>{
   const left=pixels[i],right=pixels[i+1];
   rev2ValidateSameRoleControl(left,right);
   return computeRev2SignedAttribution(left,right);
  };
  let crossing;
  try{crossing=paired(15);}catch(e){fail('CROSSING_UNINTERPRETABLE_'+e.message);}
  const controls=[];
  for(let i=0;i<31;i++){
   if(i===15)continue;
   try{controls.push(paired(i));}catch(e){fail('CONTROL_UNINTERPRETABLE_'+e.message);}
  }
  if(controls.length!==30)fail('CONTROL_COUNT_INVALID');
  const result=classifyRev2Station(crossing,controls);
  return Object.freeze({station,topLeft:true,width:32,crossingIndex:15,
    controlCount:30,result,authenticatedGpuObservation:false});
 });
 return Object.freeze({schema:'H_EARTH_REV2_SEAM_CONTROL_SOURCE_VALIDATION_v1',
  pose,firstHits,stationCount:stations.length,controlsPerStation:30,
  totalWithinRoleControls:stations.length*30,stations:Object.freeze(stations),
  sourceNumericsValidated:true,hardwareEvidenceAuthenticated:false,
  ownerVisualAcceptance:false});
}
