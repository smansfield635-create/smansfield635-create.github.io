/**
 * H-Earth spatial evidence candidate — off-product, source-compatible conceptual adapter.
 * No WebGL calls, no polling, no image reads, no scene writes. Integration requires canonical admission.
 */
export const SCHEMA='H_EARTH_SPATIAL_FRAME_EVIDENCE_v1';
const MAX_POINTS=64;
const finite=n=>typeof n==='number'&&Number.isFinite(n);
const positive=n=>finite(n)&&n>0;
function must(ok,code){if(!ok)throw new Error(code)}
function vector3(p){must(p&&['x','y','z'].every(k=>finite(p[k])),'CAMERA_POSITION_INVALID');return {x:p.x,y:p.y,z:p.z}}
function copyMatrix(m){must(Array.isArray(m)&&m.length===16&&m.every(finite),'VIEW_PROJECTION_INVALID');return [...m]}
function view(v){must(v&&positive(v.cssWidth)&&positive(v.cssHeight)&&Number.isInteger(v.bufferWidth)&&Number.isInteger(v.bufferHeight)&&v.bufferWidth>0&&v.bufferHeight>0,'VIEWPORT_INVALID');return {cssWidth:v.cssWidth,cssHeight:v.cssHeight,bufferWidth:v.bufferWidth,bufferHeight:v.bufferHeight,devicePixelRatio:finite(v.devicePixelRatio)?v.devicePixelRatio:null,offsetLeft:finite(v.offsetLeft)?v.offsetLeft:0,offsetTop:finite(v.offsetTop)?v.offsetTop:0}}
const clone=o=>JSON.parse(JSON.stringify(o));
const freeze=o=>{if(o&&typeof o==='object'){for(const v of Object.values(o))freeze(v);Object.freeze(o)}return o};
const unknown=(reason)=>({status:'UNKNOWN',reason});
export function recordSubmittedFrame({frameSequence,navigationState,packet,viewport,sourceIdentity={},rendererReceipt=null,submittedAt=new Date().toISOString(),frameEvidence=null}){
 must(Number.isSafeInteger(frameSequence)&&frameSequence>=0,'FRAME_SEQUENCE_INVALID');
 must(Number.isSafeInteger(navigationState?.sequence)&&navigationState.sequence>=0,'NAVIGATION_SEQUENCE_INVALID');
 must(packet?.camera&&packet.camera.position,'PACKET_CAMERA_MISSING');
 for(const k of ['yawDegrees','pitchDegrees','verticalFovDegrees'])must(finite(navigationState[k]),'ORIENTATION_MISSING_'+k);
 const frame= {
  schema:SCHEMA,
  frameId:`cpu-submit:${frameSequence}:nav:${navigationState.sequence}`,
  frameSequence,
  navigationSequence:navigationState.sequence,
  submittedAt,
  evidenceGrade:'CPU_DRAW_AND_PRESENT_RETURN_ONLY__GPU_SCANOUT_AND_PHYSICAL_SCREEN_UNVERIFIED',
  camera:{position:vector3(packet.camera.position),navigationPosition:vector3(navigationState.position),yawDegrees:navigationState.yawDegrees,pitchDegrees:navigationState.pitchDegrees,verticalFovDegrees:navigationState.verticalFovDegrees,viewProjectionMatrix:copyMatrix(packet.camera.viewProjectionMatrix)},
  viewport:view(viewport),
  sourceIdentity:clone(sourceIdentity),
  renderer:{id:rendererReceipt?.rendererId??null,package:clone(rendererReceipt?.package??null),context:clone(rendererReceipt?.context??null)},
  imageEvidence:frameEvidence?.kind==='ACTUAL_FRAME_IMAGE'&&frameEvidence?.sha256?clone(frameEvidence):null,
  imageEvidenceStatus:frameEvidence?.kind==='ACTUAL_FRAME_IMAGE'&&frameEvidence?.sha256?'ATTACHED_ACTUAL_FRAME_EVIDENCE':'NOT_ATTACHED_NO_ORIGINAL_PIXEL_PROOF'
 };
 must(Number.isFinite(Date.parse(submittedAt)),'SUBMITTED_TIME_INVALID');
 return freeze(frame);
}
export function viewportPoint(frame,{clientX,clientY}){
 must(finite(clientX)&&finite(clientY),'SELECTION_COORDINATE_INVALID');
 const v=frame.viewport,localX=clientX-v.offsetLeft,localY=clientY-v.offsetTop;
 must(localX>=0&&localY>=0&&localX<v.cssWidth&&localY<v.cssHeight,'SELECTION_OUTSIDE_VIEWPORT');
 const topLeftX=Math.min(v.bufferWidth-1,Math.floor(localX/v.cssWidth*v.bufferWidth));
 const topLeftY=Math.min(v.bufferHeight-1,Math.floor(localY/v.cssHeight*v.bufferHeight));
 return {clientX,clientY,topLeftX,topLeftY,glX:topLeftX,glY:v.bufferHeight-1-topLeftY};
}
export function selectBoundedPixels(frame,{kind,points,gridSize=3}){
 must(['point','contour','rectangle'].includes(kind),'SELECTION_SHAPE_INVALID');
 must(Array.isArray(points)&&points.length>=1&&points.length<=MAX_POINTS,'SELECTION_POINTS_LIMIT');
 if(kind==='point')must(points.length===1,'POINT_REQUIRES_ONE_VERTEX');
 if(kind==='rectangle')must(points.length===2,'RECTANGLE_REQUIRES_TWO_VERTICES');
 if(kind==='contour')must(points.length>=2,'CONTOUR_REQUIRES_MULTIPLE_VERTICES');
 const raw=kind==='rectangle'?(()=>{
   must(Number.isInteger(gridSize)&&gridSize>=2&&gridSize<=8,'RECTANGLE_GRID_LIMIT');
   const a=points[0],b=points[1],p=[];
   for(let y=0;y<gridSize;y++)for(let x=0;x<gridSize;x++)p.push({clientX:a.clientX+(b.clientX-a.clientX)*x/(gridSize-1),clientY:a.clientY+(b.clientY-a.clientY)*y/(gridSize-1)});
   return p;
 })():points;
 must(raw.length<=MAX_POINTS,'SELECTION_POINTS_LIMIT');
 const normalized=raw.map(p=>viewportPoint(frame,p));
 const unique=[...new Map(normalized.map(p=>[p.topLeftX+':'+p.topLeftY,p])).values()];
 return freeze({frameId:frame.frameId,kind,originalVertices:clone(points),sampleCount:unique.length,samples:unique,coordinates:'TOP_LEFT_FRAMEBUFFER_AND_BOTTOM_LEFT_OPENGL_ORIGINS_EXPLICIT'});
}
function normalizeEvidence(candidate,frameId,pt){
 if(!candidate||candidate.frameId!==frameId||candidate.topLeftX!==pt.topLeftX||candidate.topLeftY!==pt.topLeftY)return {sample:pt,firstHit:unknown('MISSING_OR_MISMATCHED_FRAME_OR_PIXEL_ATTRIBUTION'),materials:unknown('MISSING_OR_MISMATCHED_FRAME_OR_PIXEL_ATTRIBUTION')};
 const hit=candidate.firstHit;
 const measuredHit=hit?.status==='MEASURED'&&hit?.depthValid===true&&typeof hit.primitiveId==='number'&&Number.isInteger(hit.primitiveId)&&typeof hit.geometrySource==='string'&&hit.geometrySource.length>0;
 const m=candidate.materials;
 const measuredMat=measuredHit&&m?.status==='MEASURED'&&m?.shaderSource&&Array.isArray(m?.contributors)&&m.contributors.length>0&&m.contributors.every(v=>typeof v.name==='string'&&finite(v.value));
 return {sample:pt,firstHit:measuredHit?clone(hit):unknown(hit?.reason??'NO_VALID_FIRST_HIT_PRIMITIVE_DEPTH_AND_SOURCE'),materials:measuredMat?clone(m):unknown(m?.reason??'NO_QUALIFIED_MATERIAL_CONTRIBUTIONS')};
}
export async function scanSubmittedFrame({frame,selection,latestFrameId=frame?.frameId,inspector=null,budget={},scanAt=new Date().toISOString()}){
 must(frame?.schema===SCHEMA&&Object.isFrozen(frame),'FRAME_NOT_FROZEN');
 must(frame.frameId===latestFrameId,'FRAME_CHANGED_SCAN_NOT_SAME_FRAME');
 must(selection?.frameId===frame.frameId&&selection.samples?.length>0&&selection.samples.length<=MAX_POINTS,'SELECTION_FRAME_MISMATCH_OR_NOT_BOUNDED');
 const maxGpuPasses=budget.maxGpuPasses??0,maxSamples=budget.maxSamples??64;
 must(Number.isInteger(maxGpuPasses)&&maxGpuPasses>=0&&maxGpuPasses<=40,'GPU_PASS_BUDGET_INVALID');
 must(Number.isInteger(maxSamples)&&maxSamples>0&&maxSamples<=MAX_POINTS&&selection.samples.length<=maxSamples,'SAMPLE_BUDGET_EXCEEDED');
 must(Number.isFinite(Date.parse(scanAt)),'SCAN_TIME_INVALID');
 let rows,actualGpuPasses=0,mode='NO_ATTRIBUTION_ADAPTER';
 if(inspector){
  const out=await inspector({frame,selection,limits:freeze({maxGpuPasses,maxSamples})});
  must(out&&out.frameId===frame.frameId&&Array.isArray(out.samples)&&out.samples.length===selection.samples.length,'INSPECTOR_FRAME_OR_SAMPLE_MISMATCH');
  must(Number.isInteger(out.actualGpuPasses)&&out.actualGpuPasses>=0&&out.actualGpuPasses<=maxGpuPasses,'GPU_PASS_BUDGET_EXCEEDED_OR_UNKNOWN');
  actualGpuPasses=out.actualGpuPasses;
  rows=selection.samples.map((s,i)=>normalizeEvidence(out.samples[i],frame.frameId,s));
  mode='QUALIFIED_ADAPTER_RESULT_PARTIALLY_OR_FULLY_MEASURED';
 }else rows=selection.samples.map(s=>({sample:s,firstHit:unknown('NO_VERIFIED_PIXEL_FIRST_HIT_ADAPTER'),materials:unknown('NO_VERIFIED_MATERIAL_FACTOR_ADAPTER')}));
 return freeze({schema:'H_EARTH_SPATIAL_SCAN_RECEIPT_v1',scanAt,frame,selection,mode,samples:rows,budget:{maxGpuPasses,maxSamples,actualGpuPasses,accuracyNote:'Limits are caller-visible; GPU pass enforcement must also occur in the admitted renderer adapter.'},attributionPolicy:'DO_NOT_INFER_WORLD_SPACE_FROM_RGB_OR_UNREGISTERED_RECONSTRUCTION',originalVsReconstructed:'FRAME_IS_CPU_SUBMITTED_SOURCE__NO_OWNER_SCREENSHOT_PARITY_CLAIM',ownerDefectCorrespondence:'UNRESOLVED_PENDING_PIXEL_SOURCE_AND_OWNER_PHOTO_PARITY'});
}


/**
 * OFF-PRODUCT Gen3096 Copy Report integration bridge candidate.
 * 1. after successful renderer.renderFrame(packet) and renderer.presentColorFrame(), call rememberSubmittedFrame
 * 2. inside the existing report provider (only on copy), call getCopyReportFrameEvidence
 * No WebGL, DOM changes, timer, network, shader/material determination or automatic capture.
 */
const bridgeFinite=x=>typeof x==='number'&&Number.isFinite(x);
const bridgePositive=x=>bridgeFinite(x)&&x>0;
const bridgeUnavailable=reason=>Object.freeze({status:'UNAVAILABLE',reason});
const bridgeFreezeObject=o=>Object.freeze(o);

export function createHEarthCopyReportFrameBridge({sourceIdentity={}}={}){
  let submitted=null;
  function rememberSubmittedFrame({packet,navigationState,submittedAt=new Date().toISOString()}={}){
    // Called strictly after successful CPU render/present returns. No GL work.
    if(!Number.isSafeInteger(packet?.frameSequence)||!Number.isSafeInteger(navigationState?.sequence)){
      submitted=null;return bridgeUnavailable('SUBMITTED_FRAME_IDENTITY_MISSING');
    }
    const camera=packet?.camera;
    if(!camera||!Array.isArray(camera.viewProjectionMatrix)||camera.viewProjectionMatrix.length!==16||!camera.viewProjectionMatrix.every(finite)||
       !camera.position||!['x','y','z'].every(k=>bridgeFinite(camera.position[k]))||
       !navigationState.position||!['x','y','z'].every(k=>bridgeFinite(navigationState.position[k]))||
       !['yawDegrees','pitchDegrees','verticalFovDegrees'].every(k=>bridgeFinite(navigationState[k]))||
       !bridgePositive(packet?.viewport?.width)||!bridgePositive(packet?.viewport?.height)){
      submitted=null;return bridgeUnavailable('SUBMITTED_POSE_OR_PROJECTION_INCOMPLETE');
    }
    const nav=bridgeFreezeObject({sequence:navigationState.sequence,
      position:bridgeFreezeObject({x:navigationState.position.x,y:navigationState.position.y,z:navigationState.position.z}),
      yawDegrees:navigationState.yawDegrees,pitchDegrees:navigationState.pitchDegrees,
      verticalFovDegrees:navigationState.verticalFovDegrees});
    const frozenPacket=bridgeFreezeObject({frameSequence:packet.frameSequence,
      viewport:bridgeFreezeObject({width:packet.viewport.width,height:packet.viewport.height}),
      camera:bridgeFreezeObject({position:bridgeFreezeObject({x:camera.position.x,y:camera.position.y,z:camera.position.z}),
        viewProjectionMatrix:Object.freeze([...camera.viewProjectionMatrix])})});
    submitted=bridgeFreezeObject({packet:frozenPacket,navigationState:nav,submittedAt});
    return bridgeFreezeObject({status:'RECORDED_CPU_SUBMITTED_FRAME',frameSequence:packet.frameSequence,navigationSequence:nav.sequence});
  }
  function getCopyReportFrameEvidence({canvas,rendererReceipt=null}={}){
    if(!submitted)return bridgeUnavailable('NO_VALID_CPU_SUBMITTED_FRAME');
    if(!canvas)return bridgeUnavailable('RENDER_CANVAS_MISSING');
    try{
      const rect=canvas.getBoundingClientRect?.();
      const cssWidth=rect?.width??canvas.clientWidth;
      const cssHeight=rect?.height??canvas.clientHeight;
      const bufferWidth=canvas.width,bufferHeight=canvas.height;
      if(!bridgePositive(cssWidth)||!bridgePositive(cssHeight)||!Number.isInteger(bufferWidth)||!Number.isInteger(bufferHeight))
        return bridgeUnavailable('CURRENT_CANVAS_DIMENSIONS_MISSING');
      if(bufferWidth!==submitted.packet.viewport.width||bufferHeight!==submitted.packet.viewport.height)
        return bridgeUnavailable('FRAMEBUFFER_CHANGED_SINCE_SUBMITTED_FRAME');
      const evidence=recordSubmittedFrame({
        frameSequence:submitted.packet.frameSequence,
        navigationState:submitted.navigationState,
        packet:submitted.packet,
        submittedAt:submitted.submittedAt,
        viewport:{cssWidth,cssHeight,bufferWidth,bufferHeight,
          devicePixelRatio:canvas.ownerDocument?.defaultView?.devicePixelRatio??null,
          offsetLeft:rect?.left??0,offsetTop:rect?.top??0},
        sourceIdentity,
        rendererReceipt
      });
      return bridgeFreezeObject({status:'CAPTURED_CPU_SUBMITTED_FRAME',evidence,
        reporterNote:'CPU submission only. The owner photograph and selected screen edge are not yet registered to a GPU first hit.'});
    }catch(error){return bridgeUnavailable('FRAME_EVIDENCE_INVALID:'+String(error.message||error));}
  }
  return bridgeFreezeObject({rememberSubmittedFrame,getCopyReportFrameEvidence});
}
