const SCHEMA='AUDRALIA_CLOUD_SPATIAL_INTEGRATION_v1';
const statusNode=document.querySelector('[data-h-earth-status]');
const diagnosticNode=document.querySelector('[data-h-earth-diagnostic]');

const fail=(stage,error)=>{
  const message=error instanceof Error?error.message:String(error);
  console.error(`AUDRALIA_CLOUD_SPATIAL_${stage}_FAILED`,error);
  if(statusNode){statusNode.textContent='ERROR';statusNode.dataset.status=`${stage}_FAILED`;}
  if(diagnosticNode)diagnosticNode.textContent=`${stage}_FAILED: ${message}`;
  window.__AUDRALIA_CLOUD_SPATIAL_ERROR__=Object.freeze({schema:SCHEMA,stage,message});
};

const fetchText=async url=>{
  const response=await fetch(url,{cache:'no-store'});
  if(!response.ok)throw new Error(`FETCH_FAILED:${response.status}:${url}`);
  return response.text();
};

const replaceRequired=(source,pattern,replacement,label)=>{
  const next=source.replace(pattern,replacement);
  if(next===source)throw new Error(`TRANSFORM_MISSING:${label}`);
  return next;
};

function transformRenderer(source,rendererUrl){
  const terrainUrl=new URL('../../../../h-earth-3d/terrain/h-earth.terrain-estate-construction-v1.candidate.js',rendererUrl).href;
  let next=replaceRequired(
    source,
    '../../../../h-earth-3d/terrain/h-earth.terrain-estate-construction-v1.candidate.js',
    terrainUrl,
    'RENDERER_TERRAIN_IMPORT'
  );
  next=replaceRequired(
    next,
    'planetaryVantage,getViewScale:viewScale,',
    "planetaryVantage,getCameraFrame:()=>{const frame=camera(),forward=norm(sub(frame.target,frame.eye));let right=cross(forward,frame.up);if(Math.hypot(...right)<1e-5)right=[1,0,0];right=norm(right);const up=norm(cross(right,forward));return{eye:frame.eye,target:frame.target,forward,right,up,surfaceUp:frame.up};},getViewScale:viewScale,",
    'RENDERER_EXACT_CAMERA_FRAME_EXPORT'
  );
  return next;
}

function transformApp(source,appUrl,rendererBlobUrl){
  const observerUrl=new URL('./observer.mjs',appUrl).href;
  let next=replaceRequired(source,"'./renderer.mjs'",`'${rendererBlobUrl}'`,'APP_RENDERER_IMPORT');
  next=next.replaceAll("'./observer.mjs'",`'${observerUrl}'`);

  const cameraBindings=(next.match(/cam=cameraFrame\(snapshot\)/g)||[]).length;
  if(cameraBindings!==2)throw new Error(`TRANSFORM_CAMERA_BINDINGS:${cameraBindings}`);
  next=replaceRequired(next,'cam=cameraFrame(snapshot)',"cam=(()=>{const frame=renderer.getCameraFrame();return{...frame,up:frame.surfaceUp};})()",'ATMOSPHERE_EXACT_CAMERA_FRAME');
  next=replaceRequired(next,'cam=cameraFrame(snapshot)','cam=renderer.getCameraFrame()','CLOUD_EXACT_CAMERA_FRAME');

  next=replaceRequired(next,'const BASE_CLEARANCE=30;','const BASE_CLEARANCE=66;','CLOUD_BASE_CLEARANCE');
  next=replaceRequired(next,'const CLOUD_OUTER_ALTITUDE=108;','const CLOUD_OUTER_ALTITUDE=136;','CLOUD_OUTER_ALTITUDE');
  next=replaceRequired(next,'const PLANET_OCCLUSION_ALTITUDE=27;','const PLANET_OCCLUSION_ALTITUDE=0;','PLANET_OCCLUSION_ALTITUDE');
  next=replaceRequired(next,'const float OUTER=6308.0;','const float OUTER=6336.0;','SHADER_OUTER_RADIUS');
  next=replaceRequired(next,'const float OCCLUDER=6227.0;','const float OCCLUDER=6200.0;','SHADER_PLANET_OCCLUDER');

  next=replaceRequired(
    next,
    'float low=smoothstep(30.0,35.0,h)*(1.0-smoothstep(54.0,65.0,h));',
    'float low=smoothstep(66.0,71.0,h)*(1.0-smoothstep(90.0,101.0,h));',
    'GLOBAL_LOW_CLOUD_ALTITUDE'
  );
  next=replaceRequired(
    next,
    'float middle=smoothstep(44.0,51.0,h)*(1.0-smoothstep(75.0,86.0,h));',
    'float middle=smoothstep(80.0,87.0,h)*(1.0-smoothstep(111.0,122.0,h));',
    'GLOBAL_MIDDLE_CLOUD_ALTITUDE'
  );
  next=replaceRequired(
    next,
    'float high=smoothstep(67.0,76.0,h)*(1.0-smoothstep(99.0,108.0,h));',
    'float high=smoothstep(102.0,110.0,h)*(1.0-smoothstep(126.0,136.0,h));',
    'GLOBAL_HIGH_CLOUD_ALTITUDE'
  );
  next=replaceRequired(next,'subtropical*low*.42','subtropical*low*.30','SUBTROPICAL_LOW_DECK_STRENGTH');
  next=replaceRequired(next,'background*smoothstep(66.0,96.0,h)*.78','background*smoothstep(102.0,132.0,h)*.78','BACKGROUND_ICE_ALTITUDE');
  next=replaceRequired(next,'background*(1.0-smoothstep(58.0,82.0,h))*.10','background*(1.0-smoothstep(94.0,118.0,h))*.10','BACKGROUND_PRECIP_ALTITUDE');

  next=replaceRequired(
    next,
    "Object.freeze({id:'SC_SUBTROPICAL_GRATITUDE',seed:.17,genus:'Sc',lat:30.0,lon:-12.0,base:0.8,top:2.3,major:1450,minor:820,orientation:-18,windE:35,windN:5,shearE:2.0,shearN:-1.0,density:.62,ice:.03,precip:.14,support:.76,phase:.36,lifetime:320})",
    "Object.freeze({id:'SC_SUBTROPICAL_GRATITUDE',seed:.17,genus:'Sc',lat:30.0,lon:-12.0,base:0.8,top:2.3,major:1120,minor:620,orientation:-18,windE:35,windN:5,shearE:2.0,shearN:-1.0,density:.50,ice:.03,precip:.14,support:.76,phase:.36,lifetime:320})",
    'GRATITUDE_STRATOCUMULUS_WALL_REDUCTION'
  );

  next=replaceRequired(
    next,
    'uniform float uFullDetail;\nuniform vec4 uSysA[8];',
    'uniform float uFullDetail;\nuniform mat4 uVP;\nuniform vec4 uSysA[8];',
    'CLOUD_SHADER_VP_UNIFORM'
  );
  next=replaceRequired(
    next,
    '  vec3 premul=vec3(0.0);\n  float alpha=0.0;',
    '  vec3 premul=vec3(0.0);\n  float alpha=0.0;\n  float firstCloudT=-1.0;',
    'CLOUD_FIRST_DEPTH_TRACKER'
  );
  next=replaceRequired(
    next,
    '    if(den>.003){\n      vec3 radial=normalize(p-CENTER);',
    '    if(den>.003){\n      if(firstCloudT<0.0)firstCloudT=t;\n      vec3 radial=normalize(p-CENTER);',
    'CLOUD_FIRST_DEPTH_CAPTURE'
  );
  next=replaceRequired(
    next,
    '  if(alpha<.003){outColor=vec4(0.0);return;}\n  outColor=vec4(premul/max(alpha,.0001),clamp(alpha,0.0,.94));',
    '  if(alpha<.003||firstCloudT<0.0)discard;\n  vec4 cloudClip=uVP*vec4(uEye+rd*firstCloudT,1.0);\n  gl_FragDepth=clamp((cloudClip.z/cloudClip.w)*.5+.5,0.0,1.0);\n  outColor=vec4(premul/max(alpha,.0001),clamp(alpha,0.0,.94));',
    'CLOUD_FRAGMENT_DEPTH_OUTPUT'
  );

  const depthSetup=`
  const DEPTH_VS=\`#version 300 es
precision highp float;
layout(location=0) in vec3 aPosition;
uniform mat4 uVP;
void main(){gl_Position=uVP*vec4(aPosition,1.0);}\`;
  const DEPTH_FS=\`#version 300 es
precision highp float;
out vec4 outColor;
void main(){outColor=vec4(0.0);}\`;
  const depthProgram=gl.createProgram();gl.attachShader(depthProgram,compile(gl.VERTEX_SHADER,DEPTH_VS));gl.attachShader(depthProgram,compile(gl.FRAGMENT_SHADER,DEPTH_FS));gl.linkProgram(depthProgram);if(!gl.getProgramParameter(depthProgram,gl.LINK_STATUS))throw Error(\`CLOUD_DEPTH_PROGRAM_LINK_FAILED:\${gl.getProgramInfoLog(depthProgram)}\`);
  const terrainDepthVao=gl.createVertexArray();gl.bindVertexArray(terrainDepthVao);
  const terrainDepthVertexBuffer=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,terrainDepthVertexBuffer);gl.bufferData(gl.ARRAY_BUFFER,renderer.gratitudeMesh.vertices,gl.STATIC_DRAW);gl.enableVertexAttribArray(0);gl.vertexAttribPointer(0,3,gl.FLOAT,false,40,0);
  const terrainDepthIndexBuffer=gl.createBuffer();gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,terrainDepthIndexBuffer);gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,renderer.gratitudeMesh.indices,gl.STATIC_DRAW);
  const terrainDepthIndexCount=renderer.gratitudeMesh.indices.length;
  const terrainDepthVP=gl.getUniformLocation(depthProgram,'uVP');
`;
  const cloudVaoAnchor='  const vao=gl.createVertexArray();gl.bindVertexArray(vao);';
  const firstVaoIndex=next.indexOf(cloudVaoAnchor);
  const cloudVaoIndex=firstVaoIndex<0?-1:next.indexOf(cloudVaoAnchor,firstVaoIndex+cloudVaoAnchor.length);
  if(firstVaoIndex<0||cloudVaoIndex<0)throw new Error('TRANSFORM_MISSING:CLOUD_TERRAIN_DEPTH_RESOURCES');
  next=next.slice(0,cloudVaoIndex)+`${cloudVaoAnchor}${depthSetup}`+next.slice(cloudVaoIndex+cloudVaoAnchor.length);

  const cameraMath=`
  const perspective=(fov,aspect,near,far)=>{const f=1/Math.tan(fov/2),inv=1/(near-far);return new Float32Array([f/aspect,0,0,0,0,f,0,0,0,0,(far+near)*inv,-1,0,0,2*far*near*inv,0]);};
  const lookAt=(eye,target,up)=>{const z=norm(sub(eye,target));let x=cross(up,z);if(Math.hypot(...x)<1e-5)x=[1,0,0];x=norm(x);const y=cross(z,x);return new Float32Array([x[0],y[0],z[0],0,x[1],y[1],z[1],0,x[2],y[2],z[2],0,-dot(x,eye),-dot(y,eye),-dot(z,eye),1]);};
  const multiply=(left,right)=>{const output=new Float32Array(16);for(let c=0;c<4;c++)for(let r=0;r<4;r++)output[c*4+r]=left[r]*right[c*4]+left[4+r]*right[c*4+1]+left[8+r]*right[c*4+2]+left[12+r]*right[c*4+3];return output;};
`;
  next=replaceRequired(
    next,
    '  const directionFromLatLon=(latDeg,lonDeg)=>{',
    `${cameraMath}  const directionFromLatLon=(latDeg,lonDeg)=>{`,
    'CLOUD_CAMERA_MATRIX_HELPERS'
  );

  next=replaceRequired(
    next,
    "    eye:uniform('uEye'),forward:uniform('uForward'),right:uniform('uRight'),up:uniform('uUp'),sun:uniform('uSunDir'),",
    "    eye:uniform('uEye'),forward:uniform('uForward'),right:uniform('uRight'),up:uniform('uUp'),sun:uniform('uSunDir'),vp:uniform('uVP'),",
    'CLOUD_VP_UNIFORM_LOCATION'
  );

  const oldRenderStart=`    gl.clearColor(0,0,0,0);gl.clear(gl.COLOR_BUFFER_BIT);
    gl.disable(gl.DEPTH_TEST);gl.disable(gl.BLEND);gl.useProgram(program);gl.bindVertexArray(vao);
    gl.uniform3fv(U.eye,cam.eye);`;
  const newRenderStart=`    const vp=multiply(perspective(55*Math.PI/180,overlay.width/Math.max(1,overlay.height),2,PLANET_RADIUS*4.5),lookAt(cam.eye,cam.target,cam.up));
    gl.clearColor(0,0,0,0);gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);
    const terrainDepthActive=snapshot.viewScale==='LOCAL'||snapshot.viewScale==='REGION';
    if(terrainDepthActive&&terrainDepthIndexCount>0){gl.enable(gl.DEPTH_TEST);gl.depthFunc(gl.LESS);gl.depthMask(true);gl.colorMask(false,false,false,false);gl.useProgram(depthProgram);gl.uniformMatrix4fv(terrainDepthVP,false,vp);gl.bindVertexArray(terrainDepthVao);gl.drawElements(gl.TRIANGLES,terrainDepthIndexCount,gl.UNSIGNED_INT,0);gl.colorMask(true,true,true,true);}
    gl.enable(gl.DEPTH_TEST);gl.depthFunc(gl.LEQUAL);gl.depthMask(false);gl.disable(gl.BLEND);gl.useProgram(program);gl.bindVertexArray(vao);gl.uniformMatrix4fv(U.vp,false,vp);
    gl.uniform3fv(U.eye,cam.eye);`;
  next=replaceRequired(next,oldRenderStart,newRenderStart,'CLOUD_TERRAIN_DEPTH_PREPASS');
  next=replaceRequired(
    next,
    '    gl.drawArrays(gl.TRIANGLES,0,3);\n    overlay.dataset.timeHours=',
    '    gl.drawArrays(gl.TRIANGLES,0,3);gl.depthMask(true);gl.disable(gl.DEPTH_TEST);\n    overlay.dataset.timeHours=',
    'CLOUD_DEPTH_STATE_RESTORE'
  );

  next=replaceRequired(
    next,
    'analyticPlanetOcclusion:true,',
    'analyticPlanetOcclusion:true,planetOcclusionAltitudeAuthoringUnits:PLANET_OCCLUSION_ALTITUDE,exactRendererCameraFrame:true,gratitudeTerrainDepthPrepass:true,lowDeckClearanceRaisedForSurfaceView:true,',
    'CLOUD_EVIDENCE_SPATIAL_REPAIR'
  );
  next=replaceRequired(
    next,
    "schema:'H_EARTH_OW01_EVOLVING_VOLUMETRIC_CLOUD_PERFORMANCE_CHECKPOINT_v1'",
    "schema:'H_EARTH_OW01_CLOUD_SPATIAL_INTEGRATION_CANDIDATE_v1'",
    'CLOUD_EVIDENCE_SCHEMA'
  );
  return next;
}

async function initialize(){
  try{
    const appUrl=new URL('../h-earth/terrain-estate-construction-v1/app.mjs',import.meta.url);
    const rendererUrl=new URL('../h-earth/terrain-estate-construction-v1/renderer.mjs',import.meta.url);
    const [appOriginal,rendererOriginal]=await Promise.all([fetchText(appUrl),fetchText(rendererUrl)]);
    const rendererSource=transformRenderer(rendererOriginal,rendererUrl);
    const rendererBlobUrl=URL.createObjectURL(new Blob([rendererSource],{type:'text/javascript'}));
    const appSource=transformApp(appOriginal,appUrl,rendererBlobUrl);
    const appBlobUrl=URL.createObjectURL(new Blob([appSource],{type:'text/javascript'}));
    await import(appBlobUrl);
    window.__AUDRALIA_CLOUD_SPATIAL_INTEGRATION__=Object.freeze({
      schema:SCHEMA,
      functionalRuntimeParent:'798d3b034ed9814574e5cbe189ef280eb857602e',
      repositoryBase:'9eb936918ce063cef6c6f5d800f39ae966f3d3aa',
      cameraSemanticsMutated:false,
      zoomSemanticsMutated:false,
      travelSemanticsMutated:false,
      geographyMutated:false,
      terrainMutated:false,
      coastlineMutated:false,
      cloudCameraRegistration:'EXACT_RENDERER_FRAME',
      atmosphereUsesRendererSurfaceUp:true,
      cloudUsesRendererCameraBasis:true,
      gratitudeTerrainDepthPrepass:true,
      cloudDepthViewMatrixLength:16,
      lowCloudBaseClearanceAuthoringUnits:66,
      cloudOuterAltitudeAuthoringUnits:136,
      planetOcclusionAltitudeAuthoringUnits:0,
      separateGratitudeCloudLayerAdded:false,
      orographicCloudContributionAdded:false,
      runtimeSourceTransformDiagnostic:true,
      finalDirectIntegrationRequiredAfterAcceptance:true
    });
  }catch(error){fail('BOOTSTRAP',error);}
}

initialize();
