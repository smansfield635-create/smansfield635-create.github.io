/**
 * /showroom/globe/h-earth/render/renderer.functional-landscape.js
 * H_EARTH_FUNCTIONAL_LANDSCAPE_RENDERER_COASTAL_CONTINUITY_v2
 *
 * Single physical depth-domain renderer. Coastal continuity v2 adds optional
 * per-vertex RGBA interpolation so shoreline/water mesh boundaries cannot own
 * visible water-color boundaries. Camera/world/admission authority is unchanged.
 */

const freeze=(value,seen=new WeakSet())=>{if(value===null||typeof value!=='object'||Object.isFrozen(value))return value;if(seen.has(value))return value;seen.add(value);Object.values(value).forEach(v=>freeze(v,seen));return Object.freeze(value)};
const finite=value=>typeof value==='number'&&Number.isFinite(value);
const vector=(x=0,y=0,z=0)=>({x,y,z});
const subtract=(a,b)=>vector(a.x-b.x,a.y-b.y,a.z-b.z);
const scale=(a,n)=>vector(a.x*n,a.y*n,a.z*n);
const dot=(a,b)=>a.x*b.x+a.y*b.y+a.z*b.z;
const cross=(a,b)=>vector(a.y*b.z-a.z*b.y,a.z*b.x-a.x*b.z,a.x*b.y-a.y*b.x);
const length=a=>Math.hypot(a.x,a.y,a.z);
const normalize=a=>{const m=length(a);return m>Number.EPSILON?scale(a,1/m):vector(0,0,0)};
const rgbaValid=c=>Array.isArray(c)&&c.length===4&&c.every(finite);
const mixRgba=(a,b,t)=>a.map((v,i)=>v+(b[i]-v)*t);
const interpolate=(a,b,t)=>{
  const out=vector(a.x+(b.x-a.x)*t,a.y+(b.y-a.y)*t,a.z+(b.z-a.z)*t);
  if(rgbaValid(a.rgba)&&rgbaValid(b.rgba))out.rgba=mixRgba(a.rgba,b.rgba,t);
  return out;
};

export const H_EARTH_FUNCTIONAL_LANDSCAPE_RENDERER_CONTRACT_ID='H_EARTH_FUNCTIONAL_LANDSCAPE_RENDERER_COASTAL_CONTINUITY_v2';
export const H_EARTH_FUNCTIONAL_LANDSCAPE_RENDERER=freeze({
  contractId:H_EARTH_FUNCTIONAL_LANDSCAPE_RENDERER_CONTRACT_ID,
  backend:'CANVAS_2D_CPU_DEPTH_BUFFER_WITH_DOM_SEMANTIC_OVERLAY',
  physicalDepthDomainCount:1,
  semanticStackingControlsPhysicalDepth:false,
  preserves:['CAMERA_SPACE_TRANSFORM','NEAR_FAR_CLIPPING','VIEWPORT_FRUSTUM_CLIPPING','PRIMITIVE_IDENTITY','FRAME_IDENTITY','SEMANTIC_SELECTION_DATA'],
  owns:{cameraState:false,worldState:false,admission:false,compositorVisibility:false,physicalDepth:true,clipping:true,windingPolicy:true,degeneracyRejection:true,nonfiniteRejection:true,skyMaterialization:true,semanticOverlayMaterialization:true,vertexColorInterpolation:true},
  held:{gpuBackend:true,animationLoop:true,runtimeStreaming:true,variableLod:true,productionPromotion:true}
});

export function createHEarthFunctionalLandscapeCameraBasis(camera){
  const position=camera?.position,target=camera?.target,upInput=camera?.up??vector(0,1,0);
  if(![position,target,upInput].every(item=>item&&finite(item.x)&&finite(item.y)&&finite(item.z)))return null;
  const forward=normalize(subtract(target,position)),right=normalize(cross(forward,upInput)),up=normalize(cross(right,forward));
  if(length(forward)<=Number.EPSILON||length(right)<=Number.EPSILON||length(up)<=Number.EPSILON)return null;
  const verticalFovDegrees=finite(camera.verticalFovDegrees)?camera.verticalFovDegrees:56;
  const nearPlane=finite(camera.nearPlane)?camera.nearPlane:0.25;
  const farPlane=finite(camera.farPlane)?camera.farPlane:512;
  if(nearPlane<=0||farPlane<=nearPlane||verticalFovDegrees<=1||verticalFovDegrees>=179)return null;
  return freeze({position:freeze({...position}),forward:freeze(forward),right:freeze(right),up:freeze(up),nearPlane,farPlane,verticalFovDegrees,focalLength:1/Math.tan(verticalFovDegrees*Math.PI/360)});
}

export function transformHEarthWorldPointToCamera(point,basis){
  if(!point||!basis||!finite(point.x)||!finite(point.y)||!finite(point.z))return null;
  const relative=subtract(point,basis.position);
  return vector(dot(relative,basis.right),dot(relative,basis.up),dot(relative,basis.forward));
}

const planeDistance=(point,plane,context)=>{const{basis,aspectRatio}=context;switch(plane){case'NEAR':return point.z-basis.nearPlane;case'FAR':return basis.farPlane-point.z;case'LEFT':return point.x+point.z*aspectRatio/basis.focalLength;case'RIGHT':return point.z*aspectRatio/basis.focalLength-point.x;case'BOTTOM':return point.y+point.z/basis.focalLength;case'TOP':return point.z/basis.focalLength-point.y;default:return Number.NaN}};
function clipPolygonAgainstPlane(points,plane,context){
  if(!points.length)return[];const output=[];let previous=points.at(-1),previousDistance=planeDistance(previous,plane,context),previousInside=finite(previousDistance)&&previousDistance>=0;
  for(const current of points){const currentDistance=planeDistance(current,plane,context),currentInside=finite(currentDistance)&&currentDistance>=0;if(currentInside!==previousInside){const denominator=previousDistance-currentDistance;if(finite(denominator)&&Math.abs(denominator)>Number.EPSILON){const t=Math.max(0,Math.min(1,previousDistance/denominator));output.push(interpolate(previous,current,t))}}if(currentInside)output.push(current);previous=current;previousDistance=currentDistance;previousInside=currentInside}return output;
}
export function clipHEarthCameraPolygon(points,context){let clipped=[...points];for(const plane of['NEAR','FAR','LEFT','RIGHT','BOTTOM','TOP']){clipped=clipPolygonAgainstPlane(clipped,plane,context);if(!clipped.length)break}return clipped}

function projectCameraPoint(point,context){const{basis,width,height,aspectRatio}=context;if(!point||point.z<=0)return null;const ndcX=point.x*basis.focalLength/(point.z*aspectRatio),ndcY=point.y*basis.focalLength/point.z;if(![ndcX,ndcY,point.z].every(finite))return null;const out={x:(ndcX+1)*0.5*width,y:(1-ndcY)*0.5*height,z:point.z};if(rgbaValid(point.rgba))out.rgba=[...point.rgba];return out}
export function signedAreaHEarthProjectedTriangle(points){if(!Array.isArray(points)||points.length!==3)return Number.NaN;const[a,b,c]=points;return(b.x-a.x)*(c.y-a.y)-(b.y-a.y)*(c.x-a.x)}

const materialDefaults=primitive=>{const intent=primitive?.materialHint?.materialIntent??primitive?.materialHint?.materialReference??'DEFAULT';if(String(intent).includes('WATER'))return{rgba:[46,118,144,210],transparencyClass:'TRANSLUCENT'};if(String(intent).includes('FOAM'))return{rgba:[232,242,235,190],transparencyClass:'TRANSLUCENT'};if(String(intent).includes('HIGHLAND')||String(intent).includes('DISTANT'))return{rgba:[68,83,79,255],transparencyClass:'OPAQUE'};return{rgba:[116,103,73,255],transparencyClass:'OPAQUE'}};

function sourceTriangles(primitive){
  const vertices=primitive?.geometry?.vertices,indices=primitive?.geometry?.indices,vertexRgba=primitive?.renderMaterial?.vertexRgba;
  if(!Array.isArray(vertices)||!Array.isArray(indices))return[];
  const hasVertexColor=Array.isArray(vertexRgba)&&vertexRgba.length===vertices.length&&vertexRgba.every(rgbaValid),result=[];
  for(let index=0;index+2<indices.length;index+=3){const ids=[indices[index],indices[index+1],indices[index+2]];result.push({points:ids.map(i=>vertices[i]),colors:hasVertexColor?ids.map(i=>vertexRgba[i]):null})}
  return result;
}

export function prepareHEarthFunctionalLandscapeRenderPlan(frame,viewport){
  const issues=[],width=Math.max(1,Math.floor(viewport?.width??1)),height=Math.max(1,Math.floor(viewport?.height??1)),basis=createHEarthFunctionalLandscapeCameraBasis(frame?.camera);
  if(!basis)return freeze({eligible:false,status:'FUNCTIONAL_LANDSCAPE_RENDER_PLAN_REJECTED',triangles:[],rejected:[{reason:'CAMERA_INVALID'}],issues:['CAMERA_INVALID']});
  const context={basis,width,height,aspectRatio:width/height},triangles=[],rejected=[];
  for(const primitive of frame?.primitives??[]){
    const primitiveId=primitive?.primitiveId??null;if(!primitiveId){rejected.push({primitiveId,reason:'PRIMITIVE_ID_MISSING'});continue}
    const renderMaterial=primitive.renderMaterial??{};
    const material={...materialDefaults(primitive),...renderMaterial};delete material.vertexRgba;
    const windingPolicy=primitive?.metadata?.windingPolicy??'NORMALIZE_CLOCKWISE_DOUBLE_SIDED';
    sourceTriangles(primitive).forEach(({points:worldTriangle,colors},sourceTriangleIndex)=>{
      if(!worldTriangle.flatMap(point=>[point?.x,point?.y,point?.z]).every(finite)){rejected.push({primitiveId,sourceTriangleIndex,reason:'NONFINITE_VERTEX'});return}
      const cameraTriangle=worldTriangle.map((point,i)=>{const q=transformHEarthWorldPointToCamera(point,basis);if(q&&colors)q.rgba=[...colors[i]];return q});
      const clipped=clipHEarthCameraPolygon(cameraTriangle,context);if(clipped.length<3){rejected.push({primitiveId,sourceTriangleIndex,reason:'OUTSIDE_FRUSTUM'});return}
      for(let fan=1;fan+1<clipped.length;fan++){
        const cameraPoints=[clipped[0],clipped[fan],clipped[fan+1]],projected=cameraPoints.map(point=>projectCameraPoint(point,context));
        if(projected.some(point=>point===null)){rejected.push({primitiveId,sourceTriangleIndex,reason:'NONFINITE_PROJECTION'});continue}
        let area=signedAreaHEarthProjectedTriangle(projected);if(!finite(area)||Math.abs(area)<1e-7){rejected.push({primitiveId,sourceTriangleIndex,reason:'DEGENERATE_PROJECTED_TRIANGLE'});continue}
        if(windingPolicy==='CULL_COUNTERCLOCKWISE'&&area<0){rejected.push({primitiveId,sourceTriangleIndex,reason:'BACKFACE_CULLED'});continue}
        if(windingPolicy==='NORMALIZE_CLOCKWISE_DOUBLE_SIDED'&&area<0){projected.reverse();area=-area}
        triangles.push(freeze({primitiveId,sourceTriangleIndex,points:projected,cameraDepth:projected.reduce((sum,p)=>sum+p.z,0)/3,signedArea:area,material,vertexColorInterpolated:projected.every(p=>rgbaValid(p.rgba)),semanticRole:primitive.semanticRole??null,sourceObjectIds:primitive.metadata?.sourceObjectIds??primitive.metadata?.memberAddressIds??[],clipped:clipped.length!==3}));
      }
    });
  }
  const opaque=triangles.filter(t=>t.material.transparencyClass!=='TRANSLUCENT'),translucent=triangles.filter(t=>t.material.transparencyClass==='TRANSLUCENT').sort((a,b)=>b.cameraDepth-a.cameraDepth);
  return freeze({eligible:issues.length===0,status:'FUNCTIONAL_LANDSCAPE_RENDER_PLAN_COMPLETE',contractId:H_EARTH_FUNCTIONAL_LANDSCAPE_RENDERER_CONTRACT_ID,frameId:frame?.frameId??null,viewport:{width,height},environment:frame?.environment??{skyTop:[48,83,105,255],skyHorizon:[173,194,190,255],groundHaze:[116,139,132,255]},triangles,opaqueTriangles:opaque,translucentTriangles:translucent,rejected,issues});
}

function edgeFunction(a,b,x,y){return(x-a.x)*(b.y-a.y)-(y-a.y)*(b.x-a.x)}
function pixelSourceRgba(triangle,w0,w1,w2){
  const[a,b,c]=triangle.points;
  if(triangle.vertexColorInterpolated&&rgbaValid(a.rgba)&&rgbaValid(b.rgba)&&rgbaValid(c.rgba))return[0,1,2,3].map(i=>w0*a.rgba[i]+w1*b.rgba[i]+w2*c.rgba[i]);
  return triangle.material.rgba;
}
function rasterizeTriangle(triangle,width,height,rgba,depth,translucent){
  const[a,b,c]=triangle.points,minX=Math.max(0,Math.floor(Math.min(a.x,b.x,c.x))),maxX=Math.min(width-1,Math.ceil(Math.max(a.x,b.x,c.x))),minY=Math.max(0,Math.floor(Math.min(a.y,b.y,c.y))),maxY=Math.min(height-1,Math.ceil(Math.max(a.y,b.y,c.y))),area=edgeFunction(a,b,c.x,c.y);if(!finite(area)||Math.abs(area)<1e-7)return 0;let written=0;
  for(let y=minY;y<=maxY;y++)for(let x=minX;x<=maxX;x++){
    const px=x+0.5,py=y+0.5,w0=edgeFunction(b,c,px,py)/area,w1=edgeFunction(c,a,px,py)/area,w2=edgeFunction(a,b,px,py)/area;if(w0< -1e-8||w1< -1e-8||w2< -1e-8)continue;
    const z=w0*a.z+w1*b.z+w2*c.z,pixel=y*width+x;if(z>=depth[pixel])continue;const offset=pixel*4,source=pixelSourceRgba(triangle,w0,w1,w2);
    if(translucent){const alpha=Math.max(0,Math.min(1,source[3]/255));rgba[offset]=Math.round(source[0]*alpha+rgba[offset]*(1-alpha));rgba[offset+1]=Math.round(source[1]*alpha+rgba[offset+1]*(1-alpha));rgba[offset+2]=Math.round(source[2]*alpha+rgba[offset+2]*(1-alpha));rgba[offset+3]=255}else{rgba[offset]=Math.round(source[0]);rgba[offset+1]=Math.round(source[1]);rgba[offset+2]=Math.round(source[2]);rgba[offset+3]=255;depth[pixel]=z}written++;
  }
  return written;
}

export function rasterizeHEarthFunctionalLandscapePlan(plan){
  if(plan?.eligible!==true)return freeze({ok:false,status:'RASTER_REJECTED',writtenPixelCount:0});
  const{width,height}=plan.viewport,rgba=new Uint8ClampedArray(width*height*4),depth=new Float64Array(width*height);depth.fill(Number.POSITIVE_INFINITY);
  const top=plan.environment.skyTop??[48,83,105,255],horizon=plan.environment.skyHorizon??[173,194,190,255];
  for(let y=0;y<height;y++){const t=y/Math.max(1,height-1);for(let x=0;x<width;x++){const o=(y*width+x)*4;rgba[o]=Math.round(top[0]+(horizon[0]-top[0])*t);rgba[o+1]=Math.round(top[1]+(horizon[1]-top[1])*t);rgba[o+2]=Math.round(top[2]+(horizon[2]-top[2])*t);rgba[o+3]=255}}
  let writtenPixelCount=0;plan.opaqueTriangles.forEach(t=>writtenPixelCount+=rasterizeTriangle(t,width,height,rgba,depth,false));plan.translucentTriangles.forEach(t=>writtenPixelCount+=rasterizeTriangle(t,width,height,rgba,depth,true));
  return{ok:true,status:'FUNCTIONAL_LANDSCAPE_RASTER_COMPLETE',width,height,rgba,depth,writtenPixelCount};
}

export function mountHEarthFunctionalLandscapeRenderer({mount,frame,width,height}){
  if(typeof document==='undefined'||!mount)return freeze({mounted:false,status:'BROWSER_DOM_UNAVAILABLE'});
  const internalWidth=Math.max(160,Math.min(960,Math.floor(width??mount.clientWidth??640))),internalHeight=Math.max(120,Math.min(540,Math.floor(height??mount.clientHeight??360))),plan=prepareHEarthFunctionalLandscapeRenderPlan(frame,{width:internalWidth,height:internalHeight}),raster=rasterizeHEarthFunctionalLandscapePlan(plan);
  if(!raster.ok)return freeze({mounted:false,status:raster.status,plan});
  const root=document.createElement('div');root.className='h-earth-functional-landscape-renderer';root.dataset.rendererContractId=H_EARTH_FUNCTIONAL_LANDSCAPE_RENDERER_CONTRACT_ID;root.style.position='relative';root.style.width='100%';root.style.height='100%';root.style.overflow='hidden';
  const canvas=document.createElement('canvas');canvas.width=raster.width;canvas.height=raster.height;canvas.style.width='100%';canvas.style.height='100%';canvas.style.display='block';canvas.setAttribute('aria-hidden','true');const context=canvas.getContext('2d',{alpha:false}),image=new ImageData(raster.rgba,raster.width,raster.height);context.putImageData(image,0,0);
  const semanticOverlay=document.createElement('div');semanticOverlay.className='h-earth-functional-landscape-semantic-overlay';semanticOverlay.style.position='absolute';semanticOverlay.style.inset='0';semanticOverlay.style.pointerEvents='none';semanticOverlay.dataset.physicalDepthAuthority='false';semanticOverlay.dataset.semanticIdentityPreserved='true';root.append(canvas,semanticOverlay);mount.replaceChildren(root);
  return freeze({mounted:true,status:'FUNCTIONAL_LANDSCAPE_RENDERER_MOUNTED',contractId:H_EARTH_FUNCTIONAL_LANDSCAPE_RENDERER_CONTRACT_ID,frameId:plan.frameId,triangleCount:plan.triangles.length,rejectedCount:plan.rejected.length,writtenPixelCount:raster.writtenPixelCount});
}
