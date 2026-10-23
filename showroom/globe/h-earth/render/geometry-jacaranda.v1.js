/** Gratitude Gen2857 — exact, owner-approved Jacaranda: isolated, fail-open overlay.
 * The existing four-tree hydrated presentation remains the fallback until the
 * approved GLB and all nine embedded images are validated and GPU resident.
 * No world regeneration, per-frame geometry construction, or global material edits.
 */
export const JACARANDA_APPROVED_SHA256='46b65326f75c29b1f076fdd161213a226bae3f519c92a3ac9d9a1972398b7189';
export const JACARANDA_APPROVED_LENGTH=33184612;
export const JACARANDA_FOCUS_ID='PROPOSED_OASIS_01';
export const JACARANDA_TARGET=Object.freeze({x:55.5,z:-307.5,scale:0.61,minimumCrownGapMeters:1.25});
export const JACARANDA_MODEL_CONTRACT='H_EARTH_JACARANDA_APPROVED_GLB_RUNTIME_v1';
const fmt=value=>String(value??'UNKNOWN').replace(/\s+/g,' ').slice(0,180);
const must=(ok,code)=>{if(!ok)throw Error(`JACARANDA_${code}`);};
const finite=x=>typeof x==='number'&&Number.isFinite(x);
const norm=v=>{const n=Math.hypot(v.x,v.y,v.z);must(n>1e-9,'INVALID_BASIS');return [v.x/n,v.y/n,v.z/n];};

export function parseApprovedJacarandaGLB(raw,contract=null) {
  must(raw instanceof ArrayBuffer,'ARRAYBUFFER_REQUIRED');
  must(raw.byteLength===(contract?.bytes??JACARANDA_APPROVED_LENGTH),'ASSET_LENGTH_MISMATCH');
  const dv=new DataView(raw);
  must(dv.getUint32(0,true)===0x46546c67&&dv.getUint32(4,true)===2&&dv.getUint32(8,true)===raw.byteLength,'INVALID_GLB_HEADER');
  const jsonLen=dv.getUint32(12,true),jsonType=dv.getUint32(16,true);
  must(jsonType===0x4e4f534a&&jsonLen>500&&jsonLen<500000&&jsonLen%4===0,'INVALID_JSON_CHUNK');
  const binHeader=20+jsonLen;
  must(binHeader+8<=raw.byteLength,'INVALID_CHUNK_OFFSET');
  const binLen=dv.getUint32(binHeader,true),binType=dv.getUint32(binHeader+4,true),binStart=binHeader+8;
  must(binType===0x004e4942&&binStart+binLen===raw.byteLength,'INVALID_BIN_CHUNK');
  let gltf;
  try{gltf=JSON.parse(new TextDecoder('utf-8',{fatal:true}).decode(new Uint8Array(raw,20,jsonLen)));}
  catch{throw Error('JACARANDA_INVALID_GLTF_JSON');}
  must(gltf.asset?.version==='2.0'&&gltf.nodes?.length===1&&gltf.nodes[0]?.mesh===0,'SCENE_IDENTITY_DRIFT');
  must(!gltf.nodes[0].matrix&&!gltf.nodes[0].translation&&!gltf.nodes[0].rotation&&!gltf.nodes[0].scale,'UNBAKED_NODE_TRANSFORM');
  must(gltf.meshes?.length===1&&gltf.meshes[0].primitives?.length===(contract?.materials??3),'PRIMITIVE_CENSUS_DRIFT');
  must(gltf.materials?.length===(contract?.materials??3)&&gltf.images?.length===(contract?.images??9)&&gltf.textures?.length===(contract?.textures??9),'MATERIAL_CENSUS_DRIFT');
  const view=id=>{
    const x=gltf.bufferViews?.[id];must(x&&x.buffer===0&&Number.isSafeInteger(x.byteOffset??0)&&Number.isSafeInteger(x.byteLength)&&x.byteOffset>=0&&x.byteLength>0&&x.byteOffset+x.byteLength<=binLen,'BUFFER_VIEW_RANGE');
    return new Uint8Array(raw,binStart+(x.byteOffset??0),x.byteLength);
  };
  const accessor=(id,type,componentType)=>{
    const a=gltf.accessors?.[id];must(a?.type===type&&a.componentType===componentType&&Number.isSafeInteger(a.count)&&a.count>0&&!a.sparse&&(a.byteOffset??0)===0,'ACCESSOR_TYPE');
    const b=gltf.bufferViews?.[a.bufferView],n=type==='VEC3'?3:type==='VEC2'?2:1;
    const width=componentType===5123?2:4;
    must(b&&!(b.byteStride)&&b.byteLength===a.count*n*width,'ACCESSOR_STRIDE');
    const bytes=view(a.bufferView);
    must(bytes.byteOffset%width===0,'ACCESSOR_ALIGNMENT');
    return componentType===5126?new Float32Array(raw,bytes.byteOffset,a.count*n):componentType===5123?Uint32Array.from(new Uint16Array(raw,bytes.byteOffset,a.count)):new Uint32Array(raw,bytes.byteOffset,a.count);
  };
  const parts=[];
  let vertexCount=0,triangleCount=0,minX=Infinity,minY=Infinity,minZ=Infinity,maxX=-Infinity,maxY=-Infinity,maxZ=-Infinity;
  for(const [i,p] of gltf.meshes[0].primitives.entries()){
    must(p.material===i&&(p.mode===undefined||p.mode===4),'MATERIAL_PRIMITIVE_IDENTITY');
    const indexType=gltf.accessors[p.indices]?.componentType;
    must(indexType===5125||(contract&&indexType===5123),'INDEX_COMPONENT_TYPE');
    const positions=accessor(p.attributes.POSITION,'VEC3',5126),normals=accessor(p.attributes.NORMAL,'VEC3',5126),uvs=accessor(p.attributes.TEXCOORD_0,'VEC2',5126),indices=accessor(p.indices,'SCALAR',indexType);
    const n=positions.length/3;
    must(normals.length===positions.length&&uvs.length===n*2&&indices.length%3===0,'GEOMETRY_CARDINALITY');
    for(let j=0;j<positions.length;j+=3){const x=positions[j],y=positions[j+1],z=positions[j+2];must(finite(x)&&finite(y)&&finite(z),'POSITION_NOT_FINITE');minX=Math.min(minX,x);minY=Math.min(minY,y);minZ=Math.min(minZ,z);maxX=Math.max(maxX,x);maxY=Math.max(maxY,y);maxZ=Math.max(maxZ,z);}
    for(let j=0;j<normals.length;j++)must(finite(normals[j]),'NORMAL_NOT_FINITE');
    for(let j=0;j<uvs.length;j++)must(finite(uvs[j]),'UV_NOT_FINITE');
    for(let j=0;j<indices.length;j++)must(indices[j]<n,'INDEX_OUT_OF_RANGE');
    vertexCount+=n;triangleCount+=indices.length/3;
    parts.push({materialId:i,positions,normals,uvs,indices,vertexCount:n,triangleCount:indices.length/3});
  }
  must(vertexCount===(contract?.vertices??651794)&&triangleCount===(contract?.triangles??454746),'APPROVED_GEOMETRY_CENSUS_DRIFT');
  if(!contract)must(gltf.materials[2].alphaMode==='MASK'&&gltf.materials[2].alphaCutoff===0.45,'LEAF_ALPHA_IDENTITY_DRIFT');
  const alphaCutoffs=gltf.materials.map(m=>{must(!m.alphaMode||['OPAQUE','MASK'].includes(m.alphaMode),'UNSUPPORTED_ALPHA_MODE');return m.alphaMode==='MASK'?(m.alphaCutoff??.5):0;});
  if(contract)must(JSON.stringify(alphaCutoffs)===JSON.stringify(contract.alphaCutoffs),'LEAF_ALPHA_IDENTITY_DRIFT');
  const textures=gltf.materials.map((m,i)=>{
    const pbr=m.pbrMetallicRoughness;
    must(m.doubleSided===true&&pbr?.baseColorTexture&&m.normalTexture&&pbr?.metallicRoughnessTexture,'SOURCE_MATERIAL_INVALID');
    const ids=[pbr.baseColorTexture.index,m.normalTexture.index,pbr.metallicRoughnessTexture.index];
    return ids.map((id,k)=>{
      const texture=gltf.textures[id],img=gltf.images[texture?.source];
      must(texture&&img?.bufferView!==undefined&&['image/png','image/jpeg'].includes(img.mimeType),'IMAGE_DEPENDENCY_INVALID');
      return {materialId:i,alphaCutoff:alphaCutoffs[i],imageId:texture.source,role:['baseColor','normal','orm'][k],mimeType:img.mimeType,bytes:view(img.bufferView)};
    });
  });
  for(let i=0;i<textures.length;i++)if(alphaCutoffs[i]>0)must(textures[i][0].mimeType==='image/png','LEAF_ALPHA_IMAGE_NOT_PNG');
  const tBounds={min:[minX,minY,minZ],max:[maxX,maxY,maxZ]};
  let trunkMinY=Infinity;const trunk=parts[contract?.trunkMaterial??1].positions;for(let i=1;i<trunk.length;i+=3)trunkMinY=Math.min(trunkMinY,trunk[i]);
  if(!contract)must(trunkMinY<0&&maxY>19&&minX< -12&&maxX>11,'APPROVED_SPATIAL_IDENTITY_DRIFT');
  return {schema:JACARANDA_MODEL_CONTRACT,parts,textures,alphaCutoffs,triangleCount,vertexCount,trunkMinY,bounds:tBounds,leafAlphaCutoff:0.45,assetLength:raw.byteLength};
}

export function planApprovedJacarandaPlacement(model,decoded,companions,options=JACARANDA_TARGET){
  must(model?.sampleOutdoorAt&&model?.sampleWaterAt,'TERRAIN_SAMPLERS_REQUIRED');
  must(decoded?.schema===JACARANDA_MODEL_CONTRACT,'DECODED_ASSET_REQUIRED');
  const {x,z,scale,minimumCrownGapMeters=1.25}=options;
  must([x,z,scale,minimumCrownGapMeters].every(finite)&&scale>=0.55&&scale<=0.8,'PLACEMENT_SCALE_OR_ANCHOR_INVALID');
  must(x===JACARANDA_TARGET.x&&z===JACARANDA_TARGET.z,'TARGET_ANCHOR_DRIFT');
  // The accepted authored geometry is 19.4m high and 24.3m wide.
  // 0.61 maps it to an approx. 11.9m tall, 14.8m-wide tree; it does NOT
  // reuse the rejected 9m-crown procedural prototype.
  const ground=model.sampleOutdoorAt(x,z);
  must(finite(ground?.y),'GROUND_CONTACT_MISSING');
  const water=model.sampleWaterAt(x,z);
  must(!water||!finite(water.y)||water.y<ground.y-.03,'TARGET_IN_WATER');
  for(const [ox,oz] of [[-1,0],[1,0],[0,-1],[0,1]]){
    const soil=model.sampleOutdoorAt(x+ox,z+oz),w=model.sampleWaterAt(x+ox,z+oz);
    must(finite(soil?.y)&&(!w||!finite(w.y)||w.y<soil.y-.03),'ROOT_SUPPORT_NOT_DRY');
    must(Math.abs(soil.y-ground.y)<.9,'ROOT_GROUND_SLOPE_UNSUPPORTED');
  }
  const b=decoded.bounds;
  const canopy={minX:x+b.min[0]*scale,maxX:x+b.max[0]*scale,minZ:z+b.min[2]*scale,maxZ:z+b.max[2]*scale};
  const gaps=[];
  must(Array.isArray(companions)&&companions.length===3,'THREE_COMPANIONS_REQUIRED');
  for(const other of companions){
    must(other.id!==JACARANDA_FOCUS_ID&&other.spans?.CANOPY?.bounds,'COMPANION_BOUNDS_REQUIRED');
    const c=other.spans.CANOPY.bounds,{min,max}=c;
    const dx=Math.max(0,min[0]-canopy.maxX,canopy.minX-max[0]);
    const dz=Math.max(0,min[2]-canopy.maxZ,canopy.minZ-max[2]);
    const gap=Math.hypot(dx,dz);
    must(gap>=minimumCrownGapMeters,`CROWN_SPACING_${other.id}`);
    gaps.push({id:other.id,gapMeters:gap});
  }
  return Object.freeze({id:JACARANDA_FOCUS_ID,anchor:{x,y:ground.y-.08,z},scale,sourceBaseY:decoded.trunkMinY,
    heightMeters:(b.max[1]-decoded.trunkMinY)*scale,crownWidthMeters:(b.max[0]-b.min[0])*scale,
    canopy,gaps,minimumCrownGapMeters,grounding:'OUTDOOR_DRY_FOUR_POINT_WITNESS',companionsPreserved:true});
}

export const JACARANDA_VS=`#version 300 es
precision highp float;
layout(location=0) in vec3 aPosition;
layout(location=1) in vec3 aNormal;
layout(location=2) in vec2 aTexCoord;
uniform mat4 uViewProjection;
uniform vec3 uWorldRoot;
uniform vec3 uAxisX;
uniform vec3 uAxisY;
uniform vec3 uAxisZ;
uniform float uScale;
uniform float uSourceBaseY;
out vec2 vUV;
out vec3 vNormal;
out vec3 vWorld;
void main(){
 vec3 p=vec3(aPosition.x,aPosition.y-uSourceBaseY,aPosition.z)*uScale;
 vWorld=uWorldRoot+uAxisX*p.x+uAxisY*p.y+uAxisZ*p.z;
 vNormal=normalize(uAxisX*aNormal.x+uAxisY*aNormal.y+uAxisZ*aNormal.z);
 vUV=aTexCoord;
 gl_Position=uViewProjection*vec4(vWorld,1.0);
}`;
export const JACARANDA_FS=`#version 300 es
precision highp float;
in vec2 vUV;
in vec3 vNormal;
in vec3 vWorld;
uniform sampler2D uDiffuse;
uniform sampler2D uNormalMap;
uniform sampler2D uOrmMap;
uniform vec3 uSunDirection;
uniform vec3 uCameraWorld;
uniform float uAlphaCutoff;
out vec4 color;
void main(){
 vec4 texel=texture(uDiffuse,vUV);
 if(texel.a<uAlphaCutoff)discard;
 vec3 n=normalize(vNormal);
 vec3 dp1=dFdx(vWorld),dp2=dFdy(vWorld);
 vec2 duv1=dFdx(vUV),duv2=dFdy(vUV);
 float det=duv1.x*duv2.y-duv1.y*duv2.x;
 if(abs(det)>0.0000001){
  vec3 t=normalize((dp1*duv2.y-dp2*duv1.y)/det);
  t=normalize(t-n*dot(t,n));
  vec3 b=normalize(cross(n,t))*sign(det);
  vec3 map=texture(uNormalMap,vUV).xyz*2.0-1.0;
  n=normalize(mix(n,mat3(t,b,n)*map,0.70));
 }
 if(!gl_FrontFacing)n=-n;
 vec3 sun=normalize(uSunDirection);
 vec3 orm=texture(uOrmMap,vUV).rgb;
 float direct=max(dot(n,sun),0.0);
 float rough=clamp(orm.g,.12,1.0);
 vec3 eye=normalize(uCameraWorld-vWorld);
 float spec=pow(max(dot(reflect(-sun,n),eye),0.0),mix(52.0,7.0,rough))*(.08+.10*(1.0-rough));
 vec3 lit=texel.rgb*((.38+.62*direct)*mix(.7,1.0,orm.r))+vec3(spec*direct);
 color=vec4(pow(max(lit,vec3(0.0)),vec3(1.0/2.2)),1.0);
}`;

async function digestSha256(raw){
  must(globalThis.crypto?.subtle,'CRYPTO_SUBTLE_REQUIRED');
  return Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',raw)),x=>x.toString(16).padStart(2,'0')).join('');
}
const to3=x=>x&&[x.x,x.y,x.z].every(finite);
const duration=()=>globalThis.performance?.now?.()??0;
const yieldFrame=()=>new Promise(resolve=>setTimeout(resolve,0));

// Same alpha coverage and averaging arithmetic as the accepted loader. Yield
// only between bounded pixel blocks; upload callbacks must restore GL bindings.
export async function buildAlphaCoverageMipmaps({pixels,width,height,yieldWork=yieldFrame,now=duration,checkActive=()=>{},onLevel}){
  let current=pixels,sliceStarted=now();
  const pause=async()=>{checkActive();await yieldWork();checkActive();sliceStarted=now();};
  checkActive();
      let covered=0;for(let i=3;i<current.length;i+=4){if(current[i]>=115)covered++;if((i&4095)===4095&&now()-sliceStarted>=4)await pause();}
      const targetCoverage=covered/(current.length/4);
      let w=width,h=height,level=0;
      while(w>1||h>1){
        const nw=Math.max(1,w>>1),nh=Math.max(1,h>>1),next=new Uint8Array(nw*nh*4);
        for(let y=0;y<nh;y++)for(let x=0;x<nw;x++){
          const accum=[0,0,0,0];let count=0;
          for(let dy=0;dy<2;dy++)for(let dx=0;dx<2;dx++){
            const sx=Math.min(w-1,2*x+dx),sy=Math.min(h-1,2*y+dy),a=(sy*w+sx)*4;
            for(let c=0;c<4;c++)accum[c]+=current[a+c];count++;
          }
          for(let c=0;c<4;c++)next[(y*nw+x)*4+c]=Math.round(accum[c]/count);
          if(((y*nw+x)&1023)===1023&&now()-sliceStarted>=4)await pause();
        }
        // Find a bounded multiplier retaining approximately the source alpha coverage.
        // One-bit case cannot encode fractional coverage; favor keeping a distant crown.
        const needed=Math.max(1,Math.round(targetCoverage*nw*nh));
        const histogram=new Uint32Array(256);for(let i=3;i<next.length;i+=4){histogram[next[i]]++;if((i&4095)===4095&&now()-sliceStarted>=4)await pause();}
        let running=0,threshold=0;for(let v=255;v>=0;v--){running+=histogram[v];if(running>=needed){threshold=v;break;}}
        const mult=threshold>0?Math.min(12,Math.max(1,116/threshold)):1;
        for(let i=3;i<next.length;i+=4){next[i]=Math.min(255,Math.round(next[i]*mult));if((i&4095)===4095&&now()-sliceStarted>=4)await pause();}
        checkActive();level++;onLevel({level,width:nw,height:nh,pixels:next});
        if(now()-sliceStarted>=4)await pause();
        current=next;w=nw;h=nh;
      }
}

/** The overlay is opt-in after the first world frame and distance-gated. */
export function createApprovedJacarandaOverlay(gl,{model,projectWorld,companions,assetURL,sunDirection,fetchAsset=globalThis.fetch,
  imageDecoder=globalThis.createImageBitmap,alphaCanvasFactory=()=>new OffscreenCanvas(1,1),yieldWork=yieldFrame,
  onSettled=()=>{},approvedAsset=null,planPlacement=null,target=JACARANDA_TARGET,focusId=JACARANDA_FOCUS_ID}={}){
  must(gl&&typeof projectWorld==='function'&&Array.isArray(companions)&&assetURL,'OVERLAY_INPUTS_REQUIRED');
  let state='IDLE',failure=null,loaded=null,startedAt=0,loadPromise=null,dead=false,epoch=0,draws=0,shadowDraws=0;
  const phaseMilliseconds={};
  const gpu={program:null,shaders:[],parts:[],buffers:[],textures:[],resourceBytes:0};
  const discard=()=>{
    // Includes buffers still being uploaded when a context is disposed.
    for(const b of gpu.buffers)gl.deleteBuffer(b);
    for(const part of gpu.parts)gl.deleteVertexArray(part.vao);
    for(const t of gpu.textures)gl.deleteTexture(t);
    for(const s of gpu.shaders)gl.deleteShader(s);
    if(gpu.program)gl.deleteProgram(gpu.program);
    gpu.parts.length=0;gpu.buffers.length=0;gpu.textures.length=0;gpu.shaders.length=0;gpu.program=null;gpu.resourceBytes=0;
  };
  const shader=(kind,body)=>{
    const s=gl.createShader(kind);must(s,'SHADER_CREATE_FAILED');gpu.shaders.push(s);
    gl.shaderSource(s,body);gl.compileShader(s);
    must(gl.getShaderParameter(s,gl.COMPILE_STATUS),`SHADER_COMPILE_${fmt(gl.getShaderInfoLog(s))}`);
    return s;
  };
  const uploadBuffer=async(target,typed,currentEpoch,vao)=>{
    const b=gl.createBuffer();must(b,'BUFFER_CREATE_FAILED');gpu.buffers.push(b);
    const bind=()=>{gl.bindVertexArray(vao);gl.bindBuffer(target,b);};
    bind();gl.bufferData(target,typed.byteLength,gl.STATIC_DRAW);
    const stride=Math.max(1,Math.floor(512*1024/typed.BYTES_PER_ELEMENT));
    let sliceStarted=duration();
    for(let i=0;i<typed.length;i+=stride){must(!dead&&epoch===currentEpoch,'LOAD_CANCELLED');
      bind();gl.bufferSubData(target,i*typed.BYTES_PER_ELEMENT,typed.subarray(i,Math.min(i+stride,typed.length)));
      if(duration()-sliceStarted>=4){await yieldWork();sliceStarted=duration();}
    }
    gpu.resourceBytes+=typed.byteLength;return b;
  };
  const imageTexture=async(desc,currentEpoch)=>{
    must(typeof imageDecoder==='function','IMAGE_DECODER_UNAVAILABLE');
    let bitmap;
    const resize=approvedAsset?.runtimeTextureSize?{resizeWidth:approvedAsset.runtimeTextureSize,resizeHeight:approvedAsset.runtimeTextureSize,resizeQuality:'high'}:{};
    try{bitmap=await imageDecoder(new Blob([desc.bytes],{type:desc.mimeType}),{premultiplyAlpha:'none',colorSpaceConversion:'none',...resize});}
    catch{bitmap=await imageDecoder(new Blob([desc.bytes],{type:desc.mimeType}),resize);}
    try{
    must(!dead&&epoch===currentEpoch,'LOAD_CANCELLED');
    const bmpWidth=bitmap.width,bmpHeight=bitmap.height;
    const max=gl.getParameter(gl.MAX_TEXTURE_SIZE);
    must(bmpWidth>0&&bitmap.height>0&&bitmap.width<=max&&bitmap.height<=max,'IMAGE_SIZE_UNSUPPORTED');
    const tex=gl.createTexture();must(tex,'TEXTURE_CREATE_FAILED');gpu.textures.push(tex);
    gl.activeTexture(gl.TEXTURE0);gl.bindTexture(gl.TEXTURE_2D,tex);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL,true);
    gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR_MIPMAP_LINEAR);
    gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.REPEAT);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.REPEAT);
    gl.texImage2D(gl.TEXTURE_2D,0,desc.role==='baseColor'?gl.SRGB8_ALPHA8:gl.RGBA8,gl.RGBA,gl.UNSIGNED_BYTE,bitmap);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL,false);
    // Keep authored leaf transparency visible through distance minification.
    if(desc.alphaCutoff>0&&desc.role==='baseColor'){
      const canvas=alphaCanvasFactory();must(canvas&&typeof canvas.getContext==='function','ALPHA_CANVAS_REQUIRED');
      canvas.width=bitmap.width;canvas.height=bitmap.height;
      const ctx=canvas.getContext('2d',{willReadFrequently:true});must(ctx,'ALPHA_CONTEXT_UNAVAILABLE');
      ctx.drawImage(bitmap,0,0);
      let current=ctx.getImageData(0,0,bitmap.width,bitmap.height).data;
      await buildAlphaCoverageMipmaps({pixels:current,width:bitmap.width,height:bitmap.height,yieldWork,
        checkActive:()=>must(!dead&&epoch===currentEpoch,'LOAD_CANCELLED'),
        onLevel:({level,width,height,pixels})=>{
          // A frame may have changed the active unit and binding while we yielded.
          gl.activeTexture(gl.TEXTURE0);gl.bindTexture(gl.TEXTURE_2D,tex);
          gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL,true);
          gl.texImage2D(gl.TEXTURE_2D,level,gl.SRGB8_ALPHA8,width,height,0,gl.RGBA,gl.UNSIGNED_BYTE,pixels);
          gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL,false);
        }});
    }else gl.generateMipmap(gl.TEXTURE_2D);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL,false);
    gpu.resourceBytes+=Math.floor(bmpWidth*bmpHeight*4*4/3);
    return tex;
    }finally{gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL,false);bitmap.close?.();}
  };
  async function start(){
    if(state!=='IDLE'||dead)return loadPromise;
    state='LOADING';startedAt=duration();const currentEpoch=++epoch;
    loadPromise=(async()=>{
      const response=await fetchAsset(assetURL,{cache:'force-cache'});
      must(response?.ok,'ASSET_FETCH_'+fmt(response?.status));
      const bytes=await response.arrayBuffer();
      phaseMilliseconds.fetch=duration()-startedAt;const decodeStarted=duration();
      must(bytes.byteLength===(approvedAsset?.bytes??JACARANDA_APPROVED_LENGTH),'ASSET_BYTE_COUNT_MISMATCH');
      must(await digestSha256(bytes)===(approvedAsset?.sha256??JACARANDA_APPROVED_SHA256),'ASSET_SHA256_MISMATCH');
      must(!dead&&epoch===currentEpoch,'LOAD_CANCELLED');
      const decoded=parseApprovedJacarandaGLB(bytes,approvedAsset);
      const placement=planPlacement?planPlacement(decoded):planApprovedJacarandaPlacement(model,decoded,companions);
      must(gl.getParameter(gl.MAX_TEXTURE_IMAGE_UNITS)>=15,'TEXTURE_UNITS_UNSUPPORTED');
      phaseMilliseconds.decode=duration()-decodeStarted;const uploadStarted=duration();
      const vs=shader(gl.VERTEX_SHADER,JACARANDA_VS),fs=shader(gl.FRAGMENT_SHADER,JACARANDA_FS);
      gpu.program=gl.createProgram();must(gpu.program,'PROGRAM_CREATE_FAILED');
      gl.attachShader(gpu.program,vs);gl.attachShader(gpu.program,fs);gl.linkProgram(gpu.program);
      must(gl.getProgramParameter(gpu.program,gl.LINK_STATUS),`PROGRAM_LINK_${fmt(gl.getProgramInfoLog(gpu.program))}`);
      // Three original materials, nine embedded color/normal/ORM images.
      const mats=[],imageCache=new Map();
      for(const material of decoded.textures){const refs=[];for(const desc of material){
        const key=`${desc.imageId}:${desc.role}:${desc.role==='baseColor'?desc.alphaCutoff:0}`;
        if(!imageCache.has(key))imageCache.set(key,await imageTexture(desc,currentEpoch));
        refs.push(imageCache.get(key));
      }mats.push(refs);}
      for(const part of decoded.parts){
        must(!dead&&epoch===currentEpoch,'LOAD_CANCELLED');
        const vao=gl.createVertexArray();must(vao,'VAO_CREATE_FAILED');
        const resources={vao,buffers:[],indexBuffer:null,indexCount:part.indices.length,materialId:part.materialId};
        gpu.parts.push(resources);gl.bindVertexArray(vao);
        for(const [index,data,size] of [[0,part.positions,3],[1,part.normals,3],[2,part.uvs,2]]){
          const b=await uploadBuffer(gl.ARRAY_BUFFER,data,currentEpoch,vao);resources.buffers.push(b);
          gl.bindVertexArray(vao);gl.bindBuffer(gl.ARRAY_BUFFER,b);gl.enableVertexAttribArray(index);gl.vertexAttribPointer(index,size,gl.FLOAT,false,0,0);
        }
        resources.indexBuffer=await uploadBuffer(gl.ELEMENT_ARRAY_BUFFER,part.indices,currentEpoch,vao);
      }
      must(gl.getError()===gl.NO_ERROR,'GL_UPLOAD_ERROR');
      const base=projectWorld(placement.anchor),x=projectWorld({...placement.anchor,x:placement.anchor.x+1}),y=projectWorld({...placement.anchor,y:placement.anchor.y+1}),z=projectWorld({...placement.anchor,z:placement.anchor.z+1});
      const axisX=norm({x:x.x-base.x,y:x.y-base.y,z:x.z-base.z});
      const axisY=norm({x:y.x-base.x,y:y.y-base.y,z:y.z-base.z});
      const axisZ=norm({x:z.x-base.x,y:z.y-base.y,z:z.z-base.z});
      const uniforms={};for(const name of ['uViewProjection','uWorldRoot','uAxisX','uAxisY','uAxisZ','uScale','uSourceBaseY','uDiffuse','uNormalMap','uOrmMap','uSunDirection','uCameraWorld','uAlphaCutoff'])uniforms[name]=gl.getUniformLocation(gpu.program,name);
      must(!dead&&epoch===currentEpoch,'LOAD_CANCELLED');
      gl.bindVertexArray(null);gl.bindTexture(gl.TEXTURE_2D,null);gl.activeTexture(gl.TEXTURE0);
      const angle=placement.rotation??0,c=Math.cos(angle),s=Math.sin(angle);
      const rotatedX=axisX.map((v,i)=>c*v-s*axisZ[i]),rotatedZ=axisZ.map((v,i)=>c*v+s*axisX[i]);
      loaded={placement,decodedPlacement:{bounds:decoded.bounds,trunkMinY:decoded.trunkMinY},axisX:rotatedX,axisY,axisZ:rotatedZ,origin:[base.x,base.y,base.z],uniforms,mats,alphaCutoffs:decoded.alphaCutoffs,assetSha256:approvedAsset?.sha256??JACARANDA_APPROVED_SHA256,
        triangleCount:decoded.triangleCount,vertexCount:decoded.vertexCount,loadMilliseconds:duration()-startedAt};
      phaseMilliseconds.upload=duration()-uploadStarted;state='READY';return true;
    })().catch(e=>{failure=fmt(e?.message);state=dead?'DISPOSED':'FALLBACK';discard();return false;}).then(result=>{if(!dead)onSettled();return result;});
    return loadPromise;
  }
  function requestIfNear(camera){
    if(state!=='IDLE'||!to3(camera))return false;
    // A distant woodland spawn must not download the 33MB imported tree.
    if(Math.hypot(camera.x-target.x,camera.z-target.z)>180)return false;
    void start();return true;
  }
  function draw(packet,instance=null,shadow=false){
    if(state!=='READY'||!loaded)return false;
    try{
      const U=loaded.uniforms,P=gpu.program,position=packet.camera.position;
      gl.useProgram(P);gl.depthMask(true);gl.disable(gl.BLEND);gl.disable(gl.CULL_FACE);
      gl.uniformMatrix4fv(U.uViewProjection,false,Float32Array.from(packet.camera.viewProjectionMatrix));
      const frame=instance??loaded;
      gl.uniform3fv(U.uWorldRoot,frame.origin);
      gl.uniform3fv(U.uAxisX,frame.axisX);gl.uniform3fv(U.uAxisY,frame.axisY);gl.uniform3fv(U.uAxisZ,frame.axisZ);
      gl.uniform1f(U.uScale,frame.placement.scale);gl.uniform1f(U.uSourceBaseY,frame.placement.sourceBaseY);
      const cam=projectWorld(position),sun=to3(sunDirection)?sunDirection:{x:.5,y:1,z:.4};
      gl.uniform3f(U.uCameraWorld,cam.x,cam.y,cam.z);gl.uniform3fv(U.uSunDirection,norm(sun));
      gl.uniform1i(U.uDiffuse,12);gl.uniform1i(U.uNormalMap,13);gl.uniform1i(U.uOrmMap,14);
      for(const part of gpu.parts){
        gl.uniform1f(U.uAlphaCutoff,loaded.alphaCutoffs[part.materialId]);
        for(let i=0;i<3;i++){gl.activeTexture(gl.TEXTURE0+12+i);gl.bindTexture(gl.TEXTURE_2D,loaded.mats[part.materialId][i]);}
        gl.bindVertexArray(part.vao);gl.drawElements(gl.TRIANGLES,part.indexCount,gl.UNSIGNED_INT,0);
      }
      must(gl.getError()===gl.NO_ERROR,'DRAW_GL_ERROR');if(shadow)shadowDraws++;else draws++;return true;
    }catch(e){failure=fmt(e.message);state='FALLBACK';discard();return false;}
    finally{gl.activeTexture(gl.TEXTURE0);gl.bindVertexArray(null);}
  }
  function dispose(){if(dead)return;dead=true;epoch++;state='DISPOSED';discard();loaded=null;}
  function getReceipt(){return {schema:JACARANDA_MODEL_CONTRACT,assetSha256:approvedAsset?.sha256??JACARANDA_APPROVED_SHA256,
    state,ready:state==='READY',failure,focusId,targetAnchor:{x:target.x,z:target.z},source:approvedAsset?'APPROVED_IMPORTED_GLB':'APPROVED_IMPORTED_CC0_GLB',fallbackUsed:false,
    originalHydratedWorldUnchanged:true,threeCompanionsPreserved:!approvedAsset,perFrameGeometryConstruction:false,
    loadedGeometry:loaded?{triangles:loaded.triangleCount,vertices:loaded.vertexCount,assetLength:approvedAsset?.bytes??JACARANDA_APPROVED_LENGTH}:null,
    placement:loaded?.placement??null,drawCount:draws,gpuResourceBytes:gpu.resourceBytes,
    programCount:gpu.program?1:0,textureCount:gpu.textures.length,vertexArrayCount:gpu.parts.length,
    noClaimOfMeasuredMobilePerformance:true,shadowDrawCount:shadowDraws,phaseMilliseconds:{...phaseMilliseconds},noClaimOfNewShadowCaster:shadowDraws===0,loadMilliseconds:loaded?.loadMilliseconds??null};}
  // Additional approved Jacarandas share the original buffers, textures and program.
  // Instance disposal never deletes the owner's resources.
  function createInstance(id,planner){
    let frame=null,instanceDraws=0,instanceDead=false,instanceFailure=null;
    const prepare=()=>{
      if(frame||state!=='READY'||instanceDead)return;
      try{
        const placement=planner(loaded.decodedPlacement),a=placement.anchor,base=projectWorld(a);
        const axes=['x','y','z'].map(key=>{const p=projectWorld({...a,[key]:a[key]+1});return norm({x:p.x-base.x,y:p.y-base.y,z:p.z-base.z});});
        const c=Math.cos(placement.rotation??0),s=Math.sin(placement.rotation??0);
        frame={placement,origin:[base.x,base.y,base.z],axisX:axes[0].map((v,i)=>c*v-s*axes[2][i]),axisY:axes[1],axisZ:axes[2].map((v,i)=>c*v+s*axes[0][i])};
      }catch(e){instanceFailure=fmt(e.message);}
    };
    return {
      async start(){await start();prepare();return !!frame&&!instanceFailure;},
      draw(packet){prepare();if(frame&&!instanceDead&&!instanceFailure&&draw(packet,frame)){instanceDraws++;return true;}return false;},
      drawShadow(packet,matrix){prepare();return !!frame&&!instanceDead&&!instanceFailure&&draw({...packet,camera:{...packet.camera,viewProjectionMatrix:Array.from(matrix)}},frame,true);},
      dispose(){instanceDead=true;frame=null;},
      get ready(){prepare();return state==='READY'&&!!frame&&!instanceDead&&!instanceFailure;},
      getReceipt(){prepare();const r=getReceipt(),ready=state==='READY'&&!!frame&&!instanceDead&&!instanceFailure;
        return {...r,focusId:id,state:instanceDead?'DISPOSED':instanceFailure?'FALLBACK':r.state,ready,fallbackUsed:false,failure:instanceFailure??r.failure,
          placement:frame?.placement??null,drawCount:instanceDraws,threeCompanionsPreserved:false,gpuResourceBytes:0,sharedGpuResources:true,resourceOwner:JACARANDA_FOCUS_ID};}
    };
  }
  return {start,requestIfNear,draw,drawShadow:(packet,matrix)=>draw({...packet,camera:{...packet.camera,viewProjectionMatrix:Array.from(matrix)}},null,true),dispose,getReceipt,createInstance,get ready(){return state==='READY';}};
}
