import crypto from 'node:crypto';
export const SOURCE_SHA256='fa6acc426c75c3b2292b3ed76a756157698d8e7a5562511ad7ced5af58e25dec';
export const ASSET_PREFIX='/__h-earth-corrected-material/';
export async function verifyAttributeCustody(specifications,canonicalIndices){
 const expected={positions:'342a2a788009410bf48a6b5889a55cad4afd97552ff02b72f98b1308f7f84b83',indices:'483f7693f29225e52fa90700837015741e78edb291de9adb785a8db3a74d616c',normals:'7d31e73c97939ad978982aeb5191d3ae8b99582eb32300aff9d569cae7e24b1b',coastDistances:'7f99de4403127ddcc48affe5206003c93049e0d19d276981db794ea1fa8cf49b'};
 const hashes={};
 for(const [name,want] of Object.entries(expected)){
  const data=name==='indices'?canonicalIndices:specifications.find(s=>s[0]===name)?.[1];
  if(!ArrayBuffer.isView(data))throw Error('CORRECTED_CUSTODY_MISSING:'+name);
  const bytes=new Uint8Array(data.buffer,data.byteOffset,data.byteLength);
  const digest=await globalThis.crypto.subtle.digest('SHA-256',bytes);
  hashes[name]=Array.from(new Uint8Array(digest),x=>x.toString(16).padStart(2,'0')).join('');
  if(hashes[name]!==want)throw Error('CORRECTED_ATTRIBUTE_CUSTODY:'+name);
 }
 return Object.freeze(hashes);
}
export function preparePresentation(specifications,canonicalIndices,manifest){
 const positions=specifications.find(s=>s[0]==='positions')?.[1];
 if(!(positions instanceof Float32Array)||positions.length%3||!(canonicalIndices instanceof Uint32Array)||canonicalIndices.length%3)throw Error('CORRECTED_SOURCE_SHAPE');
 if(!Array.isArray(manifest.charts)||manifest.stepMeters!==.25||manifest.atlases?.length!==2)throw Error('CORRECTED_MANIFEST_CONTRACT');
 const count=positions.length/3,charts=manifest.charts,extra=charts.length*3,total=count+extra;
 const map=new Map(),uv=new Float32Array(total*2),ids=new Uint8Array(total);let next=count;
 for(const chart of charts){
  const o=chart.sourceOffset;
  if(!Number.isInteger(o)||o<0||o%3||o+2>=canonicalIndices.length||map.has(o))throw Error('CORRECTED_PARENT_IDENTITY');
  const atlas=manifest.atlases[chart.atlasIndex];if(!Number.isInteger(chart.atlasIndex)||chart.atlasIndex<0||chart.atlasIndex>1||!atlas)throw Error('CORRECTED_ATLAS_IDENTITY');
  if(![atlas.width,atlas.height,chart.width,chart.height].every(n=>Number.isInteger(n)&&n>0)||![chart.atlasX,chart.atlasY].every(n=>Number.isInteger(n)&&n>=0)||chart.atlasX+chart.width>atlas.width||chart.atlasY+chart.height>atlas.height||!Array.isArray(chart.originXZ)||chart.originXZ.length!==2||!chart.originXZ.every(Number.isFinite))throw Error('CORRECTED_CHART_BOUNDS');
  const replacements=[];
  for(let j=0;j<3;j++){
   const src=canonicalIndices[o+j];if(src>=count)throw Error('CORRECTED_VERTEX_RANGE');
   const target=next++;replacements.push(target);ids[target]=chart.atlasIndex+1;
   uv[target*2]=((positions[src*3]-chart.originXZ[0])/manifest.stepMeters+chart.atlasX+.5)/atlas.width;
   uv[target*2+1]=((positions[src*3+2]-chart.originXZ[1])/manifest.stepMeters+chart.atlasY+.5)/atlas.height;
  }
  map.set(o,replacements);
 }
 const expanded=specifications.map(([name,data,location,size,type,integer])=>{
  if(location===10||location===11)throw Error('CORRECTED_ATTRIBUTE_LOCATION');
  if(data.length!==count*size)throw Error('CORRECTED_ATTRIBUTE_LENGTH:'+name);
  const out=new data.constructor(total*size);out.set(data);let target=count;
  for(const chart of charts)for(let j=0;j<3;j++){
   const src=canonicalIndices[chart.sourceOffset+j];out.set(data.subarray(src*size,(src+1)*size),target++*size);
  }
  return [name,out,location,size,type,integer];
 });
 // WebGL enums are stable; no geometry/attribute value changes, only duplicate vertices.
 expanded.push(['correctedUV',uv,10,2,0x1406,false],['correctedAtlas',ids,11,1,0x1401,true]);
 function remap(actual){
  if(!(actual instanceof Uint32Array)||actual.length!==canonicalIndices.length)throw Error('CORRECTED_INDEX_LENGTH');
  const out=new actual.constructor(actual);let applied=0,retired=0;
  for(const [o,replacements]of map){
   if(actual[o]===actual[o+1]&&actual[o+1]===actual[o+2]){retired++;continue;}
   if([0,1,2].some(j=>actual[o+j]!==canonicalIndices[o+j]))throw Error('CORRECTED_PARENT_INDEX_DRIFT:'+o);
   out.set(replacements,o);applied++;
  }
  return {indices:out,applied,retired};
 }
 return {specifications:expanded,remap,originalVertexCount:count,addedVertexCount:extra};
}
async function loadAtlases(gl,manifest,prefix){
 const textures=[];
 for(const atlas of manifest.atlases){
  if(atlas.width>gl.getParameter(gl.MAX_TEXTURE_SIZE)||atlas.height>gl.getParameter(gl.MAX_TEXTURE_SIZE))throw Error('CORRECTED_ATLAS_DEVICE_LIMIT');
  const response=await fetch(prefix+atlas.file);if(!response.ok)throw Error('CORRECTED_ASSET_HTTP');const bytes=await response.arrayBuffer();
  const hash=Array.from(new Uint8Array(await globalThis.crypto.subtle.digest('SHA-256',bytes)),x=>x.toString(16).padStart(2,'0')).join('');if(hash!==atlas.sha256)throw Error('CORRECTED_ASSET_HASH');
  const image=await createImageBitmap(new Blob([bytes],{type:'image/png'}),{colorSpaceConversion:'none',premultiplyAlpha:'none',imageOrientation:'none'});
  if(image.width!==atlas.width||image.height!==atlas.height)throw Error('CORRECTED_ASSET_DIMENSIONS');
  const texture=gl.createTexture();gl.bindTexture(gl.TEXTURE_2D,texture);gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL,false);gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL,false);gl.pixelStorei(gl.UNPACK_COLORSPACE_CONVERSION_WEBGL,gl.NONE);gl.texImage2D(gl.TEXTURE_2D,0,gl.RGB8,gl.RGB,gl.UNSIGNED_BYTE,image);
  gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);textures.push(texture);image.close();
 }
 gl.pixelStorei(gl.UNPACK_COLORSPACE_CONVERSION_WEBGL,gl.BROWSER_DEFAULT_WEBGL);return textures;
}
export function instrumentCorrectedRenderer(source,manifest){
 if(crypto.createHash('sha256').update(source).digest('hex')!==SOURCE_SHA256)throw Error('CORRECTED_RENDERER_SOURCE_HASH');
 if(manifest.schema!=='H_EARTH_CORRECTED_MATERIAL_ATLAS_v1'||manifest.stepMeters!==.25||manifest.boundaryWidthMeters!==12||manifest.atlases.length!==2)throw Error('CORRECTED_MANIFEST_CONTRACT');
 let out=source;
 const replace=(a,b)=>{if(out.split(a).length!==2)throw Error('CORRECTED_SOURCE_ANCHOR:'+a.slice(0,60));out=out.replace(a,b);};
 // Confine new varyings to the canonical VS/FS. Other VAOs leave atlas-id disabled/zero.
 replace('layout(location=9) in float aContactDistanceMeters;','layout(location=9) in float aContactDistanceMeters;\nlayout(location=10) in vec2 aCorrectedUV;\nlayout(location=11) in uint aCorrectedAtlas;\nout vec2 vCorrectedUV;\nflat out uint vCorrectedAtlas;');
 replace('  vWorldPosition=aPosition;','  vCorrectedUV=aCorrectedUV;vCorrectedAtlas=aCorrectedAtlas;\n  vWorldPosition=aPosition;');
 const fragmentHeader='#version 300 es\nin highp vec2 vCorrectedUV;\nflat in highp uint vCorrectedAtlas;\nuniform highp sampler2D uCorrectedNear;\nuniform highp sampler2D uCorrectedFar;';
 const correction='      if(vCorrectedAtlas>0u){vec3 encoded=vCorrectedAtlas==1u?texture(uCorrectedNear,vCorrectedUV).rgb:texture(uCorrectedFar,vCorrectedUV).rgb;palette+=(encoded*255.0-128.0)/1024.0;}\n      // H_EARTH_BROAD_GROUNDCOVER_V1_END';
 const fragmentExpression=`FS.replace('#version 300 es',${JSON.stringify(fragmentHeader)}).replace('      // H_EARTH_BROAD_GROUNDCOVER_V1_END',${JSON.stringify(correction)})`;
 replace("createShader(gl.FRAGMENT_SHADER, FS, 'GF')",`createShader(gl.FRAGMENT_SHADER, ${fragmentExpression}, 'GF')`);
 replace('    rendererTiming.phases.shadersAndVertexSetup=performance.now()-shaderStarted;',`    gl.vertexAttribI4ui(11,0,0,0,0);\n    const correctedCustody=await verifyAttributeCustody(specifications,uploadViews.indices);\n    const corrected=preparePresentation(specifications,uploadViews.indices,CORRECTED_MANIFEST);\n    specifications.splice(0,specifications.length,...corrected.specifications);resources.corrected=corrected;\n    resources.correctedTextures=await loadAtlases(gl,CORRECTED_MANIFEST,${JSON.stringify(ASSET_PREFIX)});\n    rendererTiming.phases.shadersAndVertexSetup=performance.now()-shaderStarted;`);
 replace("    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, resources.indexBuffer); await uploadChunked(gl.ELEMENT_ARRAY_BUFFER, resources.woodlandSuppressedIndices,resources.indexBuffer,'indices');","    const correctedIndices=resources.corrected.remap(resources.woodlandSuppressedIndices);resources.correctedReceipt=Object.freeze({applied:correctedIndices.applied,retired:correctedIndices.retired,attributeHashes:correctedCustody});globalThis.__hEarthCorrectedMaterialReceipt=resources.correctedReceipt;\n    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, resources.indexBuffer); await uploadChunked(gl.ELEMENT_ARRAY_BUFFER, correctedIndices.indices,resources.indexBuffer,'indices');");
 replace('// SHORELINE_SOIL_END binding\n    bindClearingTextures();',"// SHORELINE_SOIL_END binding\n    for(let i=0;i<2;i++){gl.activeTexture(gl.TEXTURE13+i);gl.bindTexture(gl.TEXTURE_2D,resources.correctedTextures[i]);gl.uniform1i(gl.getUniformLocation(resources.geometryProgram,i===0?'uCorrectedNear':'uCorrectedFar'),13+i);}gl.activeTexture(gl.TEXTURE0);\n    bindClearingTextures();");
 return `const CORRECTED_MANIFEST=${JSON.stringify(manifest)};\n${verifyAttributeCustody.toString()}\n${preparePresentation.toString()}\n${loadAtlases.toString()}\n`+out;
}
