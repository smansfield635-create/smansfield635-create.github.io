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
export function sourceObjectId(source){
  const bytes=Buffer.from(source,'utf8');
  return createHash('sha1').update(`blob ${bytes.length}\0`).update(bytes).digest('hex');
}

const fragmentProbeOutput=String.raw`  if(uMaterialProbeMode>0){
    // Sentinel replaces the alpha-blended contributor without falsely coding it as opaque geometry.
    if(uMaterialProbeTranslucentPass!=0 || outputAlpha<1.0){
      outColor=vec4(249.0,0.0,0.0,255.0)/255.0;
      return;
    }
    uint roleCode=vRoleCode,primitiveCode=vPrimitiveIndex;
    if(uMaterialProbeMode==1){outColor=vec4(241.0,float(roleCode),float(primitiveCode&255u),255.0)/255.0;return;}
    if(uMaterialProbeMode==2){outColor=vec4(242.0,float((primitiveCode>>8u)&255u),float(vSurfaceClassCode),255.0)/255.0;return;}
    if(uMaterialProbeMode==3){outColor=vec4(243.0,float(vCorrectedAtlas),hEarthProbeGCEntered*255.0,255.0)/255.0;return;}
    if(uMaterialProbeMode>=4&&uMaterialProbeMode<=6){
      float coord=uMaterialProbeMode==4?vWorldPosition.x:(uMaterialProbeMode==5?vWorldPosition.y:vWorldPosition.z);
      if(!(coord > -1024.0 && coord < 1024.0)){
        outColor=vec4(248.0,float(uMaterialProbeMode),0.0,255.0)/255.0;
        return;
      }
      float normalized=(coord+1024.0)/2048.0;
      uint encodedCoordinate=uint(floor(normalized*65535.0+0.5));
      outColor=vec4(float(240+uMaterialProbeMode),float(encodedCoordinate&255u),float((encodedCoordinate>>8u)&255u),255.0)/255.0;
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
  s=probeOnce(s,'out vec4 outColor;','uniform int uMaterialProbeMode;\nuniform int uMaterialProbeTranslucentPass;\nout vec4 outColor;');
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
  if(typeof original!=='string'||!Object.hasOwn(TARGETS,target)) throw Error('FIRST_HIT_INPUT_OR_TARGET_INVALID');
  const sourceBlob=sourceObjectId(original);
  if(!allowFixture&&sourceBlob!==TARGETS[target].rendererBlob) throw Error(`FIRST_HIT_RENDERER_BLOB_MISMATCH:${target}:${sourceBlob}`);
  let modified=once(original,compilationAnchor,body+'\n'+
    '    resources.geometryFragmentShader = createShader(gl.FRAGMENT_SHADER, heMaterialFirstHitGeometrySource(FS.replace(');
  modified=once(modified,compilationEnd,")), 'GF');");
  modified=once(modified,drawAnchor,drawAnchor+String.raw`
    const firstHitMode=globalThis.__hEarthFirstHitMaterialMode??0;
    if(!Number.isInteger(firstHitMode)||firstHitMode<0||firstHitMode>7)throw Error('FIRST_HIT_PROBE_MODE_INVALID');
    const location=gl.getUniformLocation(resources.geometryProgram,'uMaterialProbeMode');
    const passLocation=gl.getUniformLocation(resources.geometryProgram,'uMaterialProbeTranslucentPass');
    if(location===null||passLocation===null)throw Error('FIRST_HIT_UNIFORM_UNAVAILABLE');
    gl.uniform1i(location,firstHitMode);
    gl.uniform1i(passLocation,0);
    globalThis.__hEarthFirstHitModeApplied=firstHitMode;`);
  // The main transparent ranges are drawn with blending and disabled depth writes.
  // Mark any sampled translucent fragment as unresolved, not as first-hit geometry.
  const translucentRangeAnchor='      const exclusions=resources.treeCollection?resources.collectionWoodlandSpans:[];';
  modified=once(modified,translucentRangeAnchor,
    "      gl.uniform1i(passLocation,range.transparencyClass==='TRANSLUCENT'?1:0);\n"+translucentRangeAnchor);
  const resetAnchor='    if(resources.refinement?.created){gl.uniform1i(resources.uniforms.clipBaseTerrain,0);';
  modified=once(modified,resetAnchor,"    gl.uniform1i(passLocation,0);\n"+resetAnchor);
  return Object.freeze({source:modified,sourceBlob,instrumentedSha256:createHash('sha256').update(modified).digest('hex'),target,productDiskMutation:false});
}

// Capture metadata comes from the existing WebGL2 comparator, not this module.
// A matching set of caller-reported receipts is NOT independent proof of a physical hit.
export const PROBE_READBACK_CLASS='WEBGL2_READPIXELS_RGBA8';
const EXPECTED_MODES=Object.freeze([1,2,3,4,5,6,7]);
const unresolved=(reason)=>Object.freeze({status:'PIXEL_FIRST_HIT_UNRESOLVED',reason});
const fourBytes=(input)=>{
  if(!(Array.isArray(input)||input instanceof Uint8Array)||input.length!==4||
     Array.from(input).some(x=>!Number.isInteger(x)||x<0||x>255))throw Error('FIRST_HIT_READBACK_INVALID');
  return Object.freeze(Array.from(input));
};
const isHex=(value,length)=>typeof value==='string'&&new RegExp(`^[a-f0-9]{${length}}$`).test(value);
const validVector=(a,n)=>Array.isArray(a)&&a.length===n&&a.every(Number.isFinite);
const equal=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
const stringId=(x)=>typeof x==='string'&&x.length>0&&x.length<=256;

// The input is fail-closed when later combined. The decoder remains useful
// for isolated readback inspection without artificially claiming capture provenance.
function validateCapture(c,mode){
  if(!c||typeof c!=='object'||Array.isArray(c)||!Object.hasOwn(TARGETS,c.target)||
     c.sourceHead!==TARGETS[c.target].head||c.rendererObjectId!==TARGETS[c.target].rendererBlob||
     !isHex(c.instrumentedSha256,64)||c.webgl2!==true||
     c.readbackClass!==PROBE_READBACK_CLASS||c.appliedMode!==mode||
     !stringId(c.poseId)||!stringId(c.assetSignature)||!stringId(c.drawSignature)||
     !validVector(c.cameraPosition,3)||!validVector(c.viewProjectionMatrix,16)||
     !Array.isArray(c.viewport)||c.viewport.length!==2||
     c.viewport.some(x=>!Number.isInteger(x)||x<=0)||
     !Array.isArray(c.pixel)||c.pixel.length!==2||
     c.pixel.some((x,i)=>!Number.isInteger(x)||x<0||x>=c.viewport[i])||
     !Array.isArray(c.webglErrors)||c.webglErrors.length!==0)return null;
  return Object.freeze({
    target:c.target,sourceHead:c.sourceHead,rendererObjectId:c.rendererObjectId,
    instrumentedSha256:c.instrumentedSha256,webgl2:true,readbackClass:c.readbackClass,
    appliedMode:mode,poseId:c.poseId,assetSignature:c.assetSignature,drawSignature:c.drawSignature,
    cameraPosition:Object.freeze([...c.cameraPosition]),
    viewProjectionMatrix:Object.freeze([...c.viewProjectionMatrix]),
    viewport:Object.freeze([...c.viewport]),pixel:Object.freeze([...c.pixel]),
    webglErrors:Object.freeze([])
  });
}

export function decodeModePixel(mode,input,capture=null){
  if(!EXPECTED_MODES.includes(mode))throw Error('FIRST_HIT_READBACK_INVALID');
  const bytes=fourBytes(input);
  const provenance=validateCapture(capture,mode);
  const base={mode,rgba:bytes,provenance};
  if(bytes[0]===249&&bytes[1]===0&&bytes[2]===0&&bytes[3]===255)
    return Object.freeze({...base,status:'PIXEL_TRANSLUCENT_CONTRIBUTOR'});
  if(mode>=4&&mode<=6&&bytes[0]===248){
    return Object.freeze({...base,status:bytes[1]===mode&&bytes[2]===0&&bytes[3]===255?
      'PIXEL_COORDINATE_OUT_OF_RANGE':'UNATTRIBUTED_PIXEL_NOT_FROM_PROBED_GEOMETRY'});
  }
  if(bytes[0]!==MODE_MAGIC[mode]||bytes[3]!==255)
    return Object.freeze({...base,status:'UNATTRIBUTED_PIXEL_NOT_FROM_PROBED_GEOMETRY'});
  if((mode===3||mode===7)&&bytes[2]!==0&&bytes[2]!==255)
    return Object.freeze({...base,status:'PIXEL_INVALID_GROUNDCOVER_FLAG'});
  if(mode===3&&bytes[1]>2)return Object.freeze({...base,status:'PIXEL_CORRECTED_ATLAS_INVALID'});
  if(mode===1)return Object.freeze({...base,status:'VALID_PROBED_GEOMETRY',role:bytes[1],primitiveLow:bytes[2]});
  if(mode===2)return Object.freeze({...base,status:'VALID_PROBED_GEOMETRY',primitiveHigh:bytes[1],surfaceClass:bytes[2]});
  if(mode===3)return Object.freeze({...base,status:'VALID_PROBED_GEOMETRY',correctedAtlas:bytes[1],groundcoverBlockEntered:bytes[2]===255});
  if(mode>=4&&mode<=6){
    const value=POSITION_MIN+(bytes[1]+256*bytes[2])*(POSITION_MAX-POSITION_MIN)/65535;
    // Edge bin values can be quantized or saturated. The shader never emits them
    // for legitimate in-range positions, but reject them regardless of source.
    if(bytes[1]+256*bytes[2]===0||bytes[1]+256*bytes[2]===65535)
      return Object.freeze({...base,status:'PIXEL_COORDINATE_RANGE_AMBIGUOUS'});
    return Object.freeze({...base,status:'VALID_PROBED_GEOMETRY',worldCoordinate:value});
  }
  return Object.freeze({...base,status:'VALID_PROBED_GEOMETRY',groundcoverWeight:bytes[1]/255,groundcoverBlockEntered:bytes[2]===255});
}

function sameCapture(left,right){
  if(!left||!right)return false;
  for(const key of ['target','sourceHead','rendererObjectId','instrumentedSha256','webgl2',
    'readbackClass','poseId','assetSignature','drawSignature','cameraPosition',
    'viewProjectionMatrix','viewport','pixel','webglErrors']){
      if(!equal(left[key],right[key]))return false;
  }
  return true;
}

export function combinePixelReceipts(receipts){
  if(!Array.isArray(receipts)||receipts.length!==EXPECTED_MODES.length||
     !equal([...receipts.map(x=>x?.mode)].sort((a,b)=>a-b),EXPECTED_MODES))
    return unresolved('SEVEN_EXACT_MODES_REQUIRED');
  const by=new Map();
  let common=null;
  for(const receipt of receipts){
    if(!receipt||receipt.status!=='VALID_PROBED_GEOMETRY'||!receipt.provenance)
      return unresolved('MISSING_VALID_READBACK_OR_PROVENANCE');
    const rec=decodeModePixel(receipt.mode,receipt.rgba,receipt.provenance);
    if(rec.status!=='VALID_PROBED_GEOMETRY'||!rec.provenance||
       !equal({...receipt,provenance:null},{...rec,provenance:null})||
       !equal(receipt.provenance,rec.provenance)||
       (common!==null&&!sameCapture(common,rec.provenance)))
      return unresolved('READBACK_OR_CAPTURE_INCONSISTENT');
    common=rec.provenance;
    by.set(rec.mode,rec);
  }
  const atlas=by.get(3),weight=by.get(7);
  if(atlas.groundcoverBlockEntered!==weight.groundcoverBlockEntered||
     (!weight.groundcoverBlockEntered&&weight.groundcoverWeight!==0))
    return unresolved('GROUNDCOVER_FACTOR_INCONSISTENT');
  // A validated complete mode set is a reproducibility step, not proof the
  // previously submitted Android screen pixel or first-hit geometry is matched.
  return Object.freeze({status:'SOURCE_BOUND_MATCHED_PIXEL_MODE_SET_NOT_ANDROID_FIRST_HIT',
    role:by.get(1).role,primitiveIndex:by.get(1).primitiveLow+256*by.get(2).primitiveHigh,
    surfaceClass:by.get(2).surfaceClass,correctedAtlas:atlas.correctedAtlas,
    x:by.get(4).worldCoordinate,y:by.get(5).worldCoordinate,z:by.get(6).worldCoordinate,
    groundcoverBlockEntered:weight.groundcoverBlockEntered,
    groundcoverWeight:weight.groundcoverWeight,
    capture:common,physicalOwnerImageParity:false,firstHitGeometryVerified:false});
}
