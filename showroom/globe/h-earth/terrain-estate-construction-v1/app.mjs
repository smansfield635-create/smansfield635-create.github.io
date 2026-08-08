const canvas=document.querySelector('[data-h-earth-map-wide-canvas]');
const statusNode=document.querySelector('[data-h-earth-status]');
const diagnosticNode=document.querySelector('[data-h-earth-diagnostic]');
const focusButton=document.querySelector('[data-fit-world]');
const brandNode=document.querySelector('.preview-brand');

const OP='H_EARTH_AUDRALIA_OPEN_WORLD_SPATIAL_MIGRATION_v1';
const COH='H_EARTH_V2_COASTAL_INTEGRATION_AND_POSITIONAL_IDENTITY_CLOSURE';
const ATMOSPHERE_BASE_HEAD='91a2b3b8ffbe1d14605f19ffefd68f4dee161597';
const setStatus=(text,state=text)=>{if(statusNode){statusNode.textContent=text;statusNode.dataset.status=state;}};
const setDiagnostic=text=>{if(diagnosticNode)diagnosticNode.textContent=text;};
const fail=(stage,error)=>{const message=error instanceof Error?error.message:String(error);console.error(`AUDRALIA_OW01_${stage}_FAILED`,error);setStatus('ERROR',`${stage}_FAILED`);setDiagnostic(`${stage}_FAILED: ${message}`);window.__H_EARTH_AUDRALIA_OPEN_WORLD_OW01_PREVIEW_ERROR__=Object.freeze({operationId:OP,coherenceOperation:COH,stage,message});};

function updateScaleUI(renderer){
  const scale=renderer.getViewScale();
  if(brandNode)brandNode.textContent=`Audralia · Gratitude · OW01 · ${scale.toLowerCase()}`;
  if(focusButton)focusButton.textContent=scale==='LOCAL'?'reset view':'focus Gratitude';
  const descriptions={
    LOCAL:'LOCAL · frozen Gratitude visual-map baseline · tuned atmosphere fades below the horizon regime · canonical coast, terrain, opacity, and gestures remain protected.',
    REGION:'REGION · tuned planet-centered atmosphere · horizon scattering retained while broad dark-shell presentation is suppressed.',
    CONTINENT:'CONTINENT · concentrated Rayleigh-like limb over the frozen continent · inspect atmospheric depth without a visible secondary sphere.',
    PLANETARY:'PLANETARY · tuned atmosphere checkpoint · thin illuminated limb above one opaque Audralia ocean · clouds intentionally not constructed yet.'
  };
  setDiagnostic(descriptions[scale]||descriptions.LOCAL);
}

function createAtmosphereLayer(renderer){
  const PLANET_RADIUS=6200;
  const PLANET_CENTER=[0,-PLANET_RADIUS,0];
  const SHELL_HEIGHT=120;
  const SHELL_RADIUS=PLANET_RADIUS+SHELL_HEIGHT;
  const SUN=[.42,.78,.46];
  const norm=v=>{const l=Math.hypot(...v)||1;return v.map(x=>x/l);};
  const add=(a,b)=>a.map((v,i)=>v+b[i]);
  const sub=(a,b)=>a.map((v,i)=>v-b[i]);
  const scale=(a,s)=>a.map(v=>v*s);
  const cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
  const dot=(a,b)=>a[0]*b[0]+a[1]*b[1]+a[2]*b[2];
  const clamp=(v,a,b)=>Math.min(b,Math.max(a,v));
  const smooth=(a,b,v)=>{const t=clamp((v-a)/(b-a||1),0,1);return t*t*(3-2*t);};
  const overlay=document.createElement('canvas');
  overlay.setAttribute('aria-hidden','true');
  overlay.dataset.hEarthAtmosphere='true';
  const parent=canvas.parentElement;
  if(!(parent instanceof HTMLElement))throw Error('H_EARTH_ATMOSPHERE_PARENT_MISSING');
  if(getComputedStyle(parent).position==='static')parent.style.position='relative';
  Object.assign(overlay.style,{position:'absolute',pointerEvents:'none',zIndex:'3',background:'transparent'});
  parent.appendChild(overlay);
  const gl=overlay.getContext('webgl2',{alpha:true,antialias:true,premultipliedAlpha:false,powerPreference:'high-performance'});
  if(!gl)throw Error('H_EARTH_ATMOSPHERE_WEBGL2_UNAVAILABLE');

  const VS=`#version 300 es\nprecision highp float;\nlayout(location=0) in vec3 aPosition;\nlayout(location=1) in vec3 aNormal;\nuniform mat4 uVP;\nout vec3 vPos;\nout vec3 vNormal;\nvoid main(){vPos=aPosition;vNormal=aNormal;gl_Position=uVP*vec4(aPosition,1.0);}`;
  const FS=`#version 300 es\nprecision highp float;\nin vec3 vPos;\nin vec3 vNormal;\nuniform vec3 uEye;\nuniform vec3 uSunDir;\nuniform float uOpacity;\nout vec4 outColor;\nvoid main(){vec3 n=normalize(vNormal);vec3 viewDir=normalize(uEye-vPos);vec3 sun=normalize(uSunDir);float facing=abs(dot(n,viewDir));float tangent=1.0-clamp(facing,0.0,1.0);float limb=pow(tangent,5.4);float daylight=.38+.62*clamp(dot(n,sun)*.5+.5,0.0,1.0);float mie=pow(max(dot(sun,-viewDir),0.0),20.0);vec3 rayleigh=vec3(.26,.66,1.0);vec3 horizon=vec3(.70,.90,1.0);float glow=clamp(limb*1.28+mie*.12,0.0,1.0);vec3 c=mix(rayleigh,horizon,glow)*(.82+.18*daylight);float a=uOpacity*clamp(limb*.24+mie*.018,0.0,.18);outColor=vec4(c,a);}`;
  const compile=(type,source)=>{const shader=gl.createShader(type);gl.shaderSource(shader,source);gl.compileShader(shader);if(!gl.getShaderParameter(shader,gl.COMPILE_STATUS))throw Error(`ATMOSPHERE_SHADER_COMPILE_FAILED:${gl.getShaderInfoLog(shader)}`);return shader;};
  const program=gl.createProgram();gl.attachShader(program,compile(gl.VERTEX_SHADER,VS));gl.attachShader(program,compile(gl.FRAGMENT_SHADER,FS));gl.linkProgram(program);if(!gl.getProgramParameter(program,gl.LINK_STATUS))throw Error(`ATMOSPHERE_PROGRAM_LINK_FAILED:${gl.getProgramInfoLog(program)}`);

  const lon=128,lat=80,vertices=[],indices=[],at=(r,c)=>r*(lon+1)+c;
  for(let r=0;r<=lat;r++){
    const latitude=-Math.PI/2+r/lat*Math.PI,cosLat=Math.cos(latitude),sinLat=Math.sin(latitude);
    for(let c=0;c<=lon;c++){
      const longitude=-Math.PI+c/lon*Math.PI*2,n=norm([cosLat*Math.cos(longitude),sinLat,cosLat*Math.sin(longitude)]);
      vertices.push(PLANET_CENTER[0]+n[0]*SHELL_RADIUS,PLANET_CENTER[1]+n[1]*SHELL_RADIUS,PLANET_CENTER[2]+n[2]*SHELL_RADIUS,...n);
    }
  }
  for(let r=0;r<lat;r++)for(let c=0;c<lon;c++){const a=at(r,c),b=at(r,c+1),d=at(r+1,c),e=at(r+1,c+1);indices.push(a,d,b,b,d,e);}
  const vao=gl.createVertexArray();gl.bindVertexArray(vao);
  const vb=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,vb);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(vertices),gl.STATIC_DRAW);
  gl.enableVertexAttribArray(0);gl.vertexAttribPointer(0,3,gl.FLOAT,false,24,0);
  gl.enableVertexAttribArray(1);gl.vertexAttribPointer(1,3,gl.FLOAT,false,24,12);
  const ib=gl.createBuffer();gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,ib);gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,new Uint32Array(indices),gl.STATIC_DRAW);

  const perspective=(fov,aspect,near,far)=>{const f=1/Math.tan(fov/2),inv=1/(near-far);return new Float32Array([f/aspect,0,0,0,0,f,0,0,0,0,(far+near)*inv,-1,0,0,2*far*near*inv,0]);};
  const lookAt=(eye,target,up)=>{const z=norm(sub(eye,target));let x=cross(up,z);if(Math.hypot(...x)<1e-5)x=[1,0,0];x=norm(x);const y=cross(z,x);return new Float32Array([x[0],y[0],z[0],0,x[1],y[1],z[1],0,x[2],y[2],z[2],0,-dot(x,eye),-dot(y,eye),-dot(z,eye),1]);};
  const multiply=(left,right)=>{const output=new Float32Array(16);for(let c=0;c<4;c++)for(let r=0;r<4;r++)output[c*4+r]=left[r]*right[c*4]+left[4+r]*right[c*4+1]+left[8+r]*right[c*4+2]+left[12+r]*right[c*4+3];return output;};
  const tangentDirection=(u,v)=>{const radius=Math.hypot(u,v);if(radius<1e-9)return[0,1,0];const angle=radius/PLANET_RADIUS,sine=Math.sin(angle),cosine=Math.cos(angle);return norm([sine*u/radius,cosine,sine*v/radius]);};
  const surfacePosition=(direction,elevation=0)=>[PLANET_CENTER[0]+direction[0]*(PLANET_RADIUS+elevation),PLANET_CENTER[1]+direction[1]*(PLANET_RADIUS+elevation),PLANET_CENTER[2]+direction[2]*(PLANET_RADIUS+elevation)];
  const tangentPosition=(u,v)=>surfacePosition(tangentDirection(u,v),0);
  const cameraFrame=snapshot=>{
    const pitch=clamp(snapshot.pitch,.46,1.49),distance=clamp(snapshot.distance,95,5600),yaw=snapshot.yaw,targetU=snapshot.targetU,targetV=snapshot.targetV,direction=tangentDirection(targetU,targetV),target=surfacePosition(direction,0),pU1=tangentPosition(targetU+1,targetV),pU0=tangentPosition(targetU-1,targetV),pV1=tangentPosition(targetU,targetV+1),pV0=tangentPosition(targetU,targetV-1),eU=norm(sub(pU1,pU0)),eV=norm(sub(pV1,pV0)),horizontal=norm(add(scale(eU,Math.sin(yaw)),scale(eV,Math.cos(yaw)))),eye=add(add(target,scale(direction,distance*Math.sin(pitch)+18)),scale(horizontal,distance*Math.cos(pitch)));return{eye,target,up:direction};
  };
  const resize=()=>{
    const rect=canvas.getBoundingClientRect(),parentRect=parent.getBoundingClientRect();
    overlay.style.left=`${rect.left-parentRect.left}px`;overlay.style.top=`${rect.top-parentRect.top}px`;overlay.style.width=`${rect.width}px`;overlay.style.height=`${rect.height}px`;
    const dpr=Math.min(1.35,window.devicePixelRatio||1),w=Math.max(1,Math.round(rect.width*dpr)),h=Math.max(1,Math.round(rect.height*dpr));if(overlay.width!==w||overlay.height!==h){overlay.width=w;overlay.height=h;}gl.viewport(0,0,w,h);
  };
  const render=()=>{
    resize();const snapshot=renderer.getSnapshot(),cam=cameraFrame(snapshot),altitude=Math.max(0,Math.hypot(...sub(cam.eye,PLANET_CENTER))-PLANET_RADIUS),entry=smooth(700,2600,altitude),distant=1-smooth(5200,7600,altitude),opacity=.74*entry*distant;
    gl.clearColor(0,0,0,0);gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);if(opacity<=.002)return;
    const vp=multiply(perspective(55*Math.PI/180,overlay.width/overlay.height,2,PLANET_RADIUS*4.5),lookAt(cam.eye,cam.target,cam.up));
    gl.disable(gl.DEPTH_TEST);gl.depthMask(false);gl.enable(gl.BLEND);gl.blendFunc(gl.SRC_ALPHA,gl.ONE_MINUS_SRC_ALPHA);gl.enable(gl.CULL_FACE);gl.cullFace(altitude<SHELL_HEIGHT?gl.FRONT:gl.BACK);
    gl.useProgram(program);gl.uniformMatrix4fv(gl.getUniformLocation(program,'uVP'),false,vp);gl.uniform3fv(gl.getUniformLocation(program,'uEye'),cam.eye);gl.uniform3fv(gl.getUniformLocation(program,'uSunDir'),SUN);gl.uniform1f(gl.getUniformLocation(program,'uOpacity'),opacity);gl.bindVertexArray(vao);gl.drawElements(gl.TRIANGLES,indices.length,gl.UNSIGNED_INT,0);
    gl.disable(gl.CULL_FACE);gl.disable(gl.BLEND);gl.depthMask(true);
    overlay.dataset.altitude=altitude.toFixed(2);overlay.dataset.opacity=opacity.toFixed(4);
  };
  const evidence=Object.freeze({schema:'H_EARTH_OW01_ATMOSPHERE_PRESENTATION_CHECKPOINT_v2',protectedBaseHead:ATMOSPHERE_BASE_HEAD,planetCentered:true,cameraCentered:false,geographicAuthority:false,shellHeightAuthoringUnits:SHELL_HEIGHT,analyticScattering:true,limbConcentrationExponent:5.4,broadShellDarkeningRemoved:true,descentFade:true,cloudSystemConstructed:false,separatePresentationCanvas:true,rendererMutation:false});
  return Object.freeze({overlay,render,getEvidence:()=>evidence,destroy:()=>overlay.remove()});
}

function wire(renderer,atmosphere){
  const pointers=new Map();
  let gesture=null;
  const safe=value=>Math.max(-64,Math.min(64,value));
  const distance=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y);
  const midpoint=(a,b)=>({x:(a.x+b.x)*.5,y:(a.y+b.y)*.5});
  const vectorLength=vector=>Math.hypot(vector.x,vector.y);
  const orderedPoints=()=>[...pointers.entries()].sort((a,b)=>Number(a[0])-Number(b[0]));
  const beginTwoFingerGesture=()=>{
    const entries=orderedPoints();
    if(entries.length!==2){gesture=null;return;}
    const a={...entries[0][1]},b={...entries[1][1]},mid=midpoint(a,b),dist=Math.max(1,distance(a,b));
    gesture={ids:[entries[0][0],entries[1][0]],startA:a,startB:b,startMid:mid,startDistance:dist,lastMid:mid,lastDistance:dist,mode:'PENDING'};
  };
  const refreshGesture=()=>{if(pointers.size===2)beginTwoFingerGesture();else gesture=null;};
  const after=()=>{updateScaleUI(renderer);atmosphere.render();};

  canvas.addEventListener('pointerdown',event=>{
    canvas.setPointerCapture(event.pointerId);
    pointers.set(event.pointerId,{x:event.clientX,y:event.clientY});
    if(pointers.size===2)beginTwoFingerGesture();
    else if(pointers.size>2)gesture=null;
  });

  canvas.addEventListener('pointermove',event=>{
    const previous=pointers.get(event.pointerId);if(!previous)return;
    const next={x:event.clientX,y:event.clientY};pointers.set(event.pointerId,next);
    if(pointers.size===1){renderer.orbit(safe(next.x-previous.x),safe(next.y-previous.y));after();return;}
    if(pointers.size!==2)return;
    if(!gesture)beginTwoFingerGesture();
    if(!gesture)return;

    const a=pointers.get(gesture.ids[0]),b=pointers.get(gesture.ids[1]);
    if(!a||!b){beginTwoFingerGesture();return;}
    const mid=midpoint(a,b),dist=Math.max(1,distance(a,b));
    const d1={x:a.x-gesture.startA.x,y:a.y-gesture.startA.y};
    const d2={x:b.x-gesture.startB.x,y:b.y-gesture.startB.y};
    const common={x:(d1.x+d2.x)*.5,y:(d1.y+d2.y)*.5};
    const opposing={x:(d1.x-d2.x)*.5,y:(d1.y-d2.y)*.5};
    const commonMagnitude=vectorLength(common),opposingMagnitude=vectorLength(opposing);
    const pinchMagnitude=Math.abs(dist-gesture.startDistance)*.5;
    const zoomEvidence=Math.max(opposingMagnitude,pinchMagnitude);

    if(gesture.mode==='PENDING'){
      if(commonMagnitude>=2.2&&commonMagnitude>zoomEvidence*1.28)gesture.mode='TRAVEL';
      else if(zoomEvidence>=2.0&&zoomEvidence>commonMagnitude*1.20)gesture.mode='ZOOM';
      else return;
      gesture.lastMid=mid;
      gesture.lastDistance=dist;
      return;
    }

    if(gesture.mode==='TRAVEL'){
      const dx=mid.x-gesture.lastMid.x,dy=mid.y-gesture.lastMid.y;
      if(Math.abs(dx)>0.01||Math.abs(dy)>0.01)renderer.panScreen(safe(dx*1.45),safe(dy*1.45));
    }else if(gesture.mode==='ZOOM'){
      const ratio=dist/Math.max(1,gesture.lastDistance);
      if(Math.abs(Math.log(Math.max(.001,ratio)))>=.00035)renderer.zoomByFactor(ratio);
    }
    gesture.lastMid=mid;
    gesture.lastDistance=dist;
    after();
  });

  const clear=event=>{pointers.delete(event.pointerId);refreshGesture();};
  canvas.addEventListener('pointerup',clear);
  canvas.addEventListener('pointercancel',clear);
  canvas.addEventListener('lostpointercapture',clear);
  canvas.addEventListener('wheel',event=>{event.preventDefault();renderer.zoom(event.deltaY);after();},{passive:false});
  canvas.addEventListener('dblclick',()=>{renderer.focusGratitude();after();});
  focusButton?.addEventListener('click',()=>{renderer.focusGratitude();after();});
  window.addEventListener('resize',()=>{renderer.render();atmosphere.render();});
}

async function observerAfterPaint(renderer,atmosphere){
  try{
    await new Promise(resolve=>setTimeout(resolve,0));
    const module=await import('./observer.mjs'),receipt=module.buildHEarthMapWideEnvironmentPreviewObserverReceipt(renderer),pos=receipt?.canonicalPositionalIdentity?.canonicalPositionalIdentityPassed===true,corr=receipt?.surfaceCorrespondence?.pass===true;
    if(receipt.mechanicalChecksPassed===true&&pos&&corr){setStatus('REVIEW','OW01_ATMOSPHERE_TUNING_USER_REVIEW_REQUIRED');setDiagnostic(`MECHANICAL BASE PASS · 12/12 geographic anchors · tuned atmosphere is planet-centered and nongeographic · judge thin limb, horizon depth, descent fade, and confirm Mirage, opacity, coast, water, and touch travel remain unchanged.`);}else{setStatus('FAIL','OW01_MECHANICAL_FAIL');setDiagnostic(`MECHANICAL_FAIL · ${(receipt.failedChecks||['unknown']).join(', ')}`);}
    window.__H_EARTH_AUDRALIA_OPEN_WORLD_OW01_PREVIEW__=Object.freeze({operationId:OP,coherenceOperation:COH,renderer,observerReceipt:receipt,atmosphereEvidence:atmosphere.getEvidence()});
    window.__H_EARTH_OW01_ATMOSPHERE_LAYER__=atmosphere;
  }catch(error){console.warn('AUDRALIA_OW01_OBSERVER_FAILED',error);setStatus('REVIEW','VISUAL_READY_OBSERVER_DEFERRED');setDiagnostic(`ATMOSPHERE_VISUAL_READY · observer deferred: ${error instanceof Error?error.message:String(error)}`);}
}

async function initialize(){
  try{
    if(!(canvas instanceof HTMLCanvasElement))throw Error('H_EARTH_OW01_CANVAS_MISSING');
    setStatus('world…','IMPORTING_FROZEN_GRATITUDE_BASELINE');
    setDiagnostic('Loading the frozen Gratitude visual-map baseline before applying the tuned independent atmosphere presentation layer…');
    await new Promise(resolve=>requestAnimationFrame(resolve));
    const module=await import('./renderer.mjs');
    setStatus('building…','BUILDING_TUNED_ATMOSPHERE_CHECKPOINT');
    await new Promise(resolve=>requestAnimationFrame(resolve));
    const renderer=module.createMapWideEnvironmentRenderer(canvas);renderer.render();
    const atmosphere=createAtmosphereLayer(renderer);atmosphere.render();
    wire(renderer,atmosphere);updateScaleUI(renderer);setStatus('REVIEW','ATMOSPHERE_TUNING_VISUAL_READY_USER_REVIEW_REQUIRED');requestAnimationFrame(()=>observerAfterPaint(renderer,atmosphere));
  }catch(error){fail('INITIALIZATION',error);}
}
setStatus('boot…','BOOTSTRAP_ACTIVE');setDiagnostic('Starting tuned atmosphere checkpoint over the frozen Gratitude visual-map baseline…');initialize();
