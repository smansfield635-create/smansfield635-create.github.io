/** Off-product, exact-blob-bound first-hit *diagnostic* adapter. No production mutation. */
import { createHash } from 'node:crypto';

export const TARGETS = Object.freeze({
  published: Object.freeze({
    head: 'bcfb0650077323851f01f51d712c7f8b8ac39220',
    rendererBlob: '85ee835060d5106a670077a5f4352b7ad202b49b'
  }),
  candidate: Object.freeze({
    head: '7610827598eaadf4fbb92e7ec8b9371c8cd08581',
    rendererBlob: '9fe90b5c0e58fb3a121c910cb0110a0846bf07bc'
  })
});
export const MODES = Object.freeze({
  NORMAL:0, ROLE_PRIMITIVE_LOW:1, PRIMITIVE_HIGH_SURFACE:2,
  CORRECTED_ATLAS_GROUNDCOVER_ENTRY:3, WORLD_X:4, WORLD_Y:5,
  WORLD_Z:6, GROUNDCOVER_WEIGHT:7
});
export const MODE_MAGIC = Object.freeze([null,241,242,243,244,245,246,247]);
export const POSITION_MIN = -1024;
export const POSITION_MAX = 1024;

const once = (source, anchor, replacement) => {
  if (source.split(anchor).length !== 2) throw Error(`SOURCE_ANCHOR_NOT_UNIQUE:${anchor.slice(0,70)}`);
  return source.replace(anchor, replacement);
};
export function gitBlobSha(source){
  const bytes=Buffer.from(source,'utf8');
  return createHash('sha1').update(`blob ${bytes.length}\0`).update(bytes).digest('hex');
}

const fragmentProbeOutput=String.raw`  if(uMaterialProbeMode>0){
    uint roleCode=vRoleCode,primitiveCode=vPrimitiveIndex;
    if(uMaterialProbeMode==1){outColor=vec4(241.0,float(roleCode),float(primitiveCode&255u),255.0)/255.0;return;}
    if(uMaterialProbeMode==2){outColor=vec4(242.0,float((primitiveCode>>8u)&255u),float(vSurfaceClassCode),255.0)/255.0;return;}
    if(uMaterialProbeMode==3){outColor=vec4(243.0,float(vCorrectedAtlas),hEarthProbeGCEntered*255.0,255.0)/255.0;return;}
    if(uMaterialProbeMode>=4&&uMaterialProbeMode<=6){
      float coord=uMaterialProbeMode==4?vWorldPosition.x:(uMaterialProbeMode==5?vWorldPosition.y:vWorldPosition.z);
      float normalized=clamp((coord+1024.0)/2048.0,0.0,1.0);
      uint packed=uint(floor(normalized*65535.0+0.5));
      outColor=vec4(float(240+uMaterialProbeMode),float(packed&255u),float((packed>>8u)&255u),255.0)/255.0;
      return;
    }
    if(uMaterialProbeMode==7){outColor=vec4(247.0,floor(clamp(hEarthProbeGCWeight,0.0,1.0)*255.0+0.5),hEarthProbeGCEntered*255.0,255.0)/255.0;return;}
    discard;
  }
  outColor=vec4(lit,outputAlpha);`;
const body=String.raw`function heMaterialFirstHitGeometrySource(shaderSource){
  const probeOnce=(s,needle,replacement)=>{
    if(s.split(needle).length!==2)throw Error('FIRST_HIT_SHADER_ANCHOR_NOT_UNIQUE:'+needle.slice(0,75));
    return s.replace(needle,replacement);
  };
  let s=shaderSource;
  s=probeOnce(s,'out vec4 outColor;','uniform int uMaterialProbeMode;\nout vec4 outColor;');
  s=probeOnce(s,'float terrainRoughnessForLighting=0.72;',
    'float terrainRoughnessForLighting=0.72;\n  float hEarthProbeGCEntered=0.0, hEarthProbeGCWeight=0.0;');
  s=probeOnce(s,'      // H_EARTH_BROAD_GROUNDCOVER_V1_END',
    '      hEarthProbeGCEntered=1.0;hEarthProbeGCWeight=groundcoverWeight;\n      // H_EARTH_BROAD_GROUNDCOVER_V1_END');
  s=probeOnce(s,'  outColor=vec4(lit,outputAlpha);',${JSON.stringify(fragmentProbeOutput)});
  return s;
}`;
// The literal-function source above is inserted only into a diagnostic copy of the exact renderer.
const compilationAnchor='    resources.geometryFragmentShader = createShader(gl.FRAGMENT_SHADER, FS.replace(';
const compilationEnd="), 'GF');";
const drawAnchor='gl.enable(gl.DEPTH_TEST); gl.depthFunc(gl.LEQUAL); gl.disable(gl.CULL_FACE); gl.useProgram(resources.geometryProgram); gl.bindVertexArray(resources.vertexArray);';

export function transformExactRenderer(original,{target='published',allowFixture=false}={}){
  if(typeof original!=='string'||!TARGETS[target]) throw Error('FIRST_HIT_INPUT_OR_TARGET_INVALID');
  const sourceBlob=gitBlobSha(original);
  if(!allowFixture&&sourceBlob!==TARGETS[target].rendererBlob) throw Error(`FIRST_HIT_RENDERER_BLOB_MISMATCH:${target}:${sourceBlob}`);
  let modified=once(original,compilationAnchor,body+'\n'+
    '    resources.geometryFragmentShader = createShader(gl.FRAGMENT_SHADER, heMaterialFirstHitGeometrySource(FS.replace(');
  modified=once(modified,compilationEnd,")), 'GF');");
  modified=once(modified,drawAnchor,drawAnchor+String.raw`
    {const firstHitMode=globalThis.__hEarthFirstHitMaterialMode??0;
     if(!Number.isInteger(firstHitMode)||firstHitMode<0||firstHitMode>7)throw Error('FIRST_HIT_PROBE_MODE_INVALID');
     const location=gl.getUniformLocation(resources.geometryProgram,'uMaterialProbeMode');
     if(location===null)throw Error('FIRST_HIT_UNIFORM_UNAVAILABLE');
     gl.uniform1i(location,firstHitMode);
     globalThis.__hEarthFirstHitModeApplied=firstHitMode;}`);
  return Object.freeze({source:modified,sourceBlob,instrumentedSha256:createHash('sha256').update(modified).digest('hex'),target,productDiskMutation:false});
}

export function decodeModePixel(mode,bytes){
  if(!Number.isInteger(mode)||mode<1||mode>7||!Array.isArray(bytes)||bytes.length!==4||bytes.some(v=>!Number.isInteger(v)||v<0||v>255))throw Error('FIRST_HIT_READBACK_INVALID');
  if(bytes[0]!==MODE_MAGIC[mode]||bytes[3]!==255)return Object.freeze({status:'UNATTRIBUTED_PIXEL_NOT_FROM_PROBED_GEOMETRY',mode,rgba:bytes});
  if(mode===1)return Object.freeze({status:'VALID_PROBED_GEOMETRY',role:bytes[1],primitiveLow:bytes[2]});
  if(mode===2)return Object.freeze({status:'VALID_PROBED_GEOMETRY',primitiveHigh:bytes[1],surfaceClass:bytes[2]});
  if(mode===3)return Object.freeze({status:'VALID_PROBED_GEOMETRY',correctedAtlas:bytes[1],groundcoverBlockEntered:bytes[2]===255});
  if(mode>=4&&mode<=6)return Object.freeze({status:'VALID_PROBED_GEOMETRY',worldCoordinate:POSITION_MIN+(bytes[1]+256*bytes[2])*(POSITION_MAX-POSITION_MIN)/65535});
  return Object.freeze({status:'VALID_PROBED_GEOMETRY',groundcoverWeight:bytes[1]/255,groundcoverBlockEntered:bytes[2]===255});
}

export function combinePixelReceipts(receipts){
  if(!Array.isArray(receipts)||receipts.length!==7||new Set(receipts.map(x=>x.mode)).size!==7||receipts.some(x=>x.status!=='VALID_PROBED_GEOMETRY'))return Object.freeze({status:'PIXEL_FIRST_HIT_UNRESOLVED'});
  const by=new Map(receipts.map(x=>[x.mode,x]));
  return Object.freeze({status:'SOURCE_BOUND_GPU_PROBE_COMPLETE_NOT_ANDROID_FIRST_HIT',
    role:by.get(1).role, primitiveIndex:by.get(1).primitiveLow+256*by.get(2).primitiveHigh,
    surfaceClass:by.get(2).surfaceClass,correctedAtlas:by.get(3).correctedAtlas,
    x:by.get(4).worldCoordinate,y:by.get(5).worldCoordinate,z:by.get(6).worldCoordinate,
    groundcoverBlockEntered:by.get(7).groundcoverBlockEntered,
    groundcoverWeight:by.get(7).groundcoverWeight,
    physicalOwnerImageParity:false});
}
