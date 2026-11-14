/** Diamond Gate Graphics Engine — off-product four-view interactive sculpt studio.
 * Reuses existing E1/M1.1 GPU device, E2 frame submission, and E3 scene/camera.
 * All canvases show ONE mutable indexed session; no second renderer or modeler.
 */
import { createNativeWebGLDevice } from './dgb.native-webgl-device.v1.mjs';
import { createNativeFramePipeline } from './dgb.native-frame-pipeline.v1.mjs';
import { createNativeSpatialScene } from './dgb.native-scene-spatial.v1.mjs';
import { createSculptSession, sculptScreenRay } from './dgb.native-sculpt-session.v1.mjs';
const dot=(a,b)=>a.reduce((s,x,i)=>s+x*b[i],0);
const sub=(a,b)=>a.map((x,i)=>x-b[i]);
const cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
const norm=a=>{const d=Math.hypot(...a);if(d<1e-9)throw new Error('CAMERA_BASIS_INVALID');return a.map(x=>x/d);};
const names=['HERO','SIDE','FRONT','REAR THREE-QUARTER'];
const eyes=[[2.4,1.25,3.5],[4.8,.3,0],[0,.15,4.8],[-2.4,1.3,-3.5]];
function lookAtQuaternion(eye){
  const z=norm(eye),x=norm(cross([0,1,0],z)),y=cross(z,x);
  const m=[x[0],y[0],z[0],x[1],y[1],z[1],x[2],y[2],z[2]],t=m[0]+m[4]+m[8];
  let q;if(t>0){const s=Math.sqrt(t+1)*2;q=[(m[7]-m[5])/s,(m[2]-m[6])/s,(m[3]-m[1])/s,s/4];}
  else if(m[0]>m[4]&&m[0]>m[8]){const s=Math.sqrt(1+m[0]-m[4]-m[8])*2;q=[s/4,(m[1]+m[3])/s,(m[2]+m[6])/s,(m[7]-m[5])/s];}
  else if(m[4]>m[8]){const s=Math.sqrt(1+m[4]-m[0]-m[8])*2;q=[(m[1]+m[3])/s,s/4,(m[5]+m[7])/s,(m[2]-m[6])/s];}
  else{const s=Math.sqrt(1+m[8]-m[0]-m[4])*2;q=[(m[2]+m[6])/s,(m[5]+m[7])/s,s/4,(m[3]-m[1])/s];}
  return {rotation:q,right:x,up:y};
}
export function makeNeutralSculptRegionFixture(){
  // Non-rabbit, single connected open boundary surface, four abstract named zones.
  // Preserved characters, images, poses, textures and all rejected shapes excluded.
  const cols=21,rows=13,p=[],regions=[],protectedVertices=[],indices=[];
  for(let j=0;j<rows;j++)for(let i=0;i<cols;i++){
    const x=2.4*(i/(cols-1)-.5),y=1.55*(j/(rows-1)-.5);
    const shoulder=.35*Math.exp(-((x-.72)**2/.35+(y+.03)**2/.30));
    const cheek=.33*Math.exp(-((x+.5)**2/.24+(y-.12)**2/.18));
    const bridge=.13*Math.exp(-((x-.10)**2/.28+y*y/.4));
    const z=shoulder+cheek+bridge+.06*Math.sin(3*x)*Math.cos(3*y);
    p.push(x,y,z);
    regions.push(x<-.5?'skull':x<-.08?'cheek':x<.48?'nape':'shoulder');
    if(i===0||i===cols-1||j===0||j===rows-1)protectedVertices.push(j*cols+i);
  }
  for(let j=0;j<rows-1;j++)for(let i=0;i<cols-1;i++){
    const a=j*cols+i,b=a+1,c=a+cols,d=c+1;indices.push(a,b,d,a,d,c);
  }
  return {positions:new Float32Array(p),triangles:new Uint16Array(indices),regions,protectedVertices};
}
const shaders=backend=>{
  const two=backend==='WEBGL2',p=two?'#version 300 es\n':'',inV=two?'in':'attribute',outV=two?'out':'varying',inF=two?'in':'varying';
  return {vertexSource:p+inV+' vec3 aPosition;'+inV+' vec3 aNormal;uniform mat4 uMVP;'+outV+' vec3 vNormal;'+outV+' vec3 vPosition;void main(){vNormal=aNormal;vPosition=aPosition;gl_Position=uMVP*vec4(aPosition,1.0);}',
    fragmentSource:p+'precision mediump float;'+inF+' vec3 vNormal;'+inF+' vec3 vPosition;'+(two?'out vec4 outColor;':'')+'void main(){float diffuse=.55+.45*abs(dot(normalize(vNormal),normalize(vec3(.35,.4,.85))));vec3 clay=mix(vec3(.31,.48,.62),vec3(.75,.80,.81),diffuse);'+(two?'outColor':'gl_FragColor')+'=vec4(clay,1.0);}'};

};

/** Original M1.3 has one editing master per anatomical vertex, but separate
 * seam-expanded render vertices. The original archive/atlas is never embedded. */
function sourceGeometry(source,p,n){
  const map=source.renderToMaster;
  if(!(map instanceof Uint32Array)||map.length!==1409||!(source.uvs instanceof Float32Array)||source.uvs.length!==2818||
      !(source.renderTriangles instanceof Uint16Array)||source.renderTriangles.length!==6792||
      !(source.atlasPixels instanceof Uint8Array)||source.atlasPixels.length!==source.atlasWidth*source.atlasHeight*4||
      source.readOnlyOriginal!==true)throw new TypeError('M13_RENDER_SOURCE_INVALID');
  const positions=new Float32Array(map.length*3),normals=new Float32Array(map.length*3);
  for(let i=0;i<map.length;i++){const sourceIndex=map[i];
    if(sourceIndex>=p.length/3)throw new RangeError('M13_RENDER_MASTER_OUT_OF_RANGE');
    positions.set(p.subarray(sourceIndex*3,sourceIndex*3+3),i*3);
    normals.set(n.subarray(sourceIndex*3,sourceIndex*3+3),i*3);
  }
  return {positions,normals,uvs:source.uvs,indices:source.renderTriangles};
}
function originalTexturedShaders(backend){
  const is2=backend==='WEBGL2',h=is2?'#version 300 es\n':'',att=is2?'in':'attribute',
    vary=is2?'out':'varying',inside=is2?'in':'varying',texture=is2?'texture':'texture2D';
  return {vertexSource:h+att+' vec3 aPosition;'+att+' vec3 aNormal;'+att+' vec2 aUV;uniform mat4 uMVP;'
      +vary+' vec2 vUV;'+vary+' vec3 vNormal;void main(){vUV=aUV;vNormal=aNormal;gl_Position=uMVP*vec4(aPosition,1.0);}',
    fragmentSource:h+'precision mediump float;'+inside+' vec2 vUV;'+inside+' vec3 vNormal;uniform sampler2D uAtlas;'
      +(is2?'out vec4 outColor;':'')+'void main(){vec3 albedo='+texture+'(uAtlas,vUV).rgb;'
      +'float shade=.52+.48*max(dot(normalize(vNormal),normalize(vec3(-.35,.7,-.66))),0.0);'
      +(is2?'outColor':'gl_FragColor')+'=vec4(albedo*shade,1.0);}'};
}
function originalEyeShaders(backend){
  const is2=backend==='WEBGL2',h=is2?'#version 300 es\n':'',att=is2?'in':'attribute',
    vary=is2?'out':'varying',inside=is2?'in':'varying';
  return {vertexSource:h+att+' vec3 aPosition;'+att+' vec3 aNormal;'+att+' vec3 aColor;'
      +att+' float aFade;uniform mat4 uMVP;'+vary+' vec3 vNormal;'+vary+' vec3 vColor;'
      +vary+' float vFade;void main(){vNormal=aNormal;vColor=aColor;vFade=aFade;gl_Position=uMVP*vec4(aPosition,1.0);}',
    fragmentSource:h+'precision mediump float;'+inside+' vec3 vNormal;'+inside+' vec3 vColor;'+inside+' float vFade;'
      +(is2?'out vec4 outColor;':'')+'void main(){vec3 N=normalize(vNormal);'
      +'vec3 L=normalize(vec3(-.35,.9,.65));float diff=.65+.35*max(dot(N,L),0.0);'
      +'float spec=pow(max(dot(reflect(-L,N),vec3(0,0,1)),0.0),22.0);'
      +(is2?'outColor':'gl_FragColor')+'=vec4(vColor*diff+vec3(spec*vFade),1.0);}'};
}

const expectCanvas=(x,i)=>{if(!x||typeof x.getContext!=='function'||typeof x.addEventListener!=='function')throw new TypeError('CANVAS_'+i+'_REQUIRED');return x;};
export function createNativeSculptStudio({canvases,controls,fixture=makeNeutralSculptRegionFixture(),backend='AUTO',onStatus=()=>{}}={}){
  if(!Array.isArray(canvases)||canvases.length!==4)throw new TypeError('FOUR_CANVASES_REQUIRED');
  if(!['AUTO','WEBGL1','WEBGL2'].includes(backend)||typeof onStatus!=='function')throw new TypeError('STUDIO_OPTIONS_INVALID');
  if(!controls||!['radius','strength','falloff','mode','region','undo','redo','save','load'].every(k=>controls[k]))throw new TypeError('STUDIO_CONTROLS_REQUIRED');
  const session=createSculptSession(fixture),positions=session.getPositions(),triangles=session.getTriangles();
  const source=fixture.sourceRender?.readOnlyOriginal===true?fixture.sourceRender:null;
  const sourceData=source?sourceGeometry(source,positions,session.getNormals()):null;
  const drawIndices=source?sourceData.indices:triangles;
  if(Math.max(...drawIndices)>65535)throw new Error('WEBGL1_MESH_INDEX_LIMIT');
  let disposed=false,failed=false,active=null;const views=[];const listeners=[];
  function add(el,name,handler){el.addEventListener(name,handler);listeners.push(()=>el.removeEventListener(name,handler));}
  function status(message){onStatus(message,{...session.state(),failed,viewCount:views.length});}
  function assertReady(){if(disposed)throw new Error('SCULPT_STUDIO_DISPOSED');if(failed)throw new Error('SCULPT_STUDIO_QUARANTINED');}
  try{
    for(let i=0;i<4;i++){
      const canvas=expectCanvas(canvases[i],i),be=backend==='AUTO'?(canvas.getContext('webgl2')?'WEBGL2':'WEBGL1'):backend;
      const device=createNativeWebGLDevice(canvas,{backend:be,contextAttributes:{alpha:false,antialias:true,depth:true,preserveDrawingBuffer:true}}),pipeline=createNativeFramePipeline(device);
      const program=device.createProgram(source?originalTexturedShaders(be):shaders(be));
      const attributes=[{name:'aPosition',data:source?sourceData.positions:positions,size:3,dynamic:true},
        {name:'aNormal',data:source?sourceData.normals:session.getNormals(),size:3,dynamic:true}];
      if(source)attributes.push({name:'aUV',data:sourceData.uvs,size:2});
      const mesh=device.createMesh({attributes,indices:new Uint16Array(drawIndices),
        vertexCount:source?sourceData.positions.length/3:positions.length/3});
      const texture=source?device.createTexture2D({width:source.atlasWidth,height:source.atlasHeight,
        pixels:source.atlasPixels,filter:'LINEAR'}):null;
      const scene=createNativeSpatialScene(),eye=source?
        [[2.4,1.25,3.5],[0,.3,4.8],[4.8,.15,0],[-2.4,1.3,-3.5]][i]:eyes[i];
      const basis=lookAtQuaternion(eye),center=source?[.37,.48,-.03]:[0,0,0];
      const camera=scene.createCamera({position:eye.map((v,k)=>v+center[k]),rotation:basis.rotation,
        projection:'ORTHOGRAPHIC',near:.1,far:40,aspect:canvas.width/canvas.height,
        orthoHeight:source?2.05:3.15});
      const node=scene.createNode();scene.setRenderable(node,{program,mesh,pass:'OPAQUE',cull:'NONE',bounds:{center:[0,0,0],radius:3},
        beforeDraw:source?(gl,handle)=>{gl.activeTexture(gl.TEXTURE0);gl.bindTexture(gl.TEXTURE_2D,texture.gpu);
          gl.uniform1i(gl.getUniformLocation(handle,'uAtlas'),0);}:null});
      let eyeMesh=null;
      if(source?.eye){
        const e=source.eye;
        if(!(e.positions instanceof Float32Array)||!(e.normals instanceof Float32Array)||
          !(e.colors instanceof Float32Array)||!(e.fade instanceof Float32Array)||
          e.positions.length!==e.normals.length||e.positions.length!==e.colors.length||
          e.positions.length!==e.fade.length*3)throw new TypeError('M13_ORIGINAL_EYE_MESH_INVALID');
        const ep=device.createProgram(originalEyeShaders(be));
        eyeMesh=device.createMesh({vertexCount:e.positions.length/3,attributes:[
          {name:'aPosition',size:3,data:e.positions,dynamic:true},
          {name:'aNormal',size:3,data:e.normals},
          {name:'aColor',size:3,data:e.colors},
          {name:'aFade',size:1,data:e.fade}
        ]});
        const enode=scene.createNode();scene.setRenderable(enode,{program:ep,mesh:eyeMesh,pass:'OPAQUE',
          cull:'NONE',bounds:{center:[0,0,0],radius:3}});
      }
      const view={name:names[i],canvas,device,pipeline,program,mesh,scene,camera,basis,eyeMesh};views.push(view);
      add(canvas,'webglcontextlost',event=>{event.preventDefault();failed=true;status('WebGL context lost. Reload studio; no edit published.');});
    }
  }catch(e){for(const v of views){try{v.device.dispose();}catch{}}throw e;}
  function drawAll(){assertReady();
    for(const v of views){
      const {canvas,device,pipeline,scene,camera}=v;
      device.viewport(canvas.width,canvas.height);
      pipeline.beginFrame({target:null,clear:{color:[.085,.11,.15,1],depth:1},depthMode:'TEST_WRITE',cull:'NONE'});
      scene.submit(pipeline,camera,{bindMatrices:({gl,programHandle,modelViewProjection})=>{
        const uniform=gl.getUniformLocation(programHandle,'uMVP');if(uniform===null)throw new Error('MVP_UNIFORM_NOT_FOUND');gl.uniformMatrix4fv(uniform,false,modelViewProjection);
      }});
      pipeline.endFrame({presentToCanvas:true});
    }
    return {views:views.length,revision:session.state().revision};
  }
  function updateAll(){assertReady();const p=session.getPositions(),n=session.getNormals();
    const data=source?sourceGeometry(source,p,n):null;
    try{
      for(const view of views){view.device.updateMeshAttribute(view.mesh,'aPosition',source?data.positions:p);
        view.device.updateMeshAttribute(view.mesh,'aNormal',source?data.normals:n);}
      return drawAll();
    }catch(e){failed=true;status('GPU update failed; studio quarantined: '+e.message);throw e;}
  }
  function localPointer(event,canvas){const r=canvas.getBoundingClientRect();return {x:(event.clientX-r.left)*canvas.width/r.width,y:(event.clientY-r.top)*canvas.height/r.height};}
  function pointerDown(event,v){try{
    assertReady();if(source){status('Original M1.3 is read-only. Anatomical editing requires separate approval.');return;}if(event.button!==undefined&&event.button!==0||active)return;
    const local=localPointer(event,v.canvas),vp=v.scene.collect(v.camera).viewProjectionMatrix;
    const ray=sculptScreenRay({...local,width:v.canvas.width,height:v.canvas.height,viewProjection:vp});
    const hit=session.pick(ray.origin,ray.direction);if(!hit){status('No surface intersected.');return;}
    const mode=controls.mode.value, organic=mode.startsWith('ORGANIC_');
    const radius=Number(controls.radius.value);
    const fieldRadii=organic?['fieldX','fieldY','fieldZ'].map(k=>radius*Number(controls[k]?.value??1)):null;
    const response=session.beginStroke(hit,{radius,strength:Number(controls.strength.value),falloff:Number(controls.falloff.value),region:controls.region.value,fieldRadii});
    active={view:v,pointerId:event.pointerId,lastX:event.clientX,lastY:event.clientY};v.canvas.setPointerCapture?.(event.pointerId);
    status(v.name+': selected triangle '+hit.triangle+', '+response.affectedVertexIds.length+' editable vertices. Drag to sculpt.');
    event.preventDefault?.();
  }catch(e){status('Selection rejected: '+e.message);}}
  function pointerMove(event,v){if(!active||active.view!==v||active.pointerId!==event.pointerId)return;
    try{
      const dx=event.clientX-active.lastX,dy=event.clientY-active.lastY;active.lastX=event.clientX;active.lastY=event.clientY;
      if(dx===0&&dy===0)return;
      const mode=controls.mode.value;let update;
      if(mode==='MOVE'||mode==='ORGANIC_GRAB'){
        const size=v.canvas.getBoundingClientRect(),scale=3.15/Math.max(size.width,size.height);
        const right=v.basis.right,up=v.basis.up;
        update={mode:'MOVE',delta:right.map((x,k)=>x*dx*scale-up[k]*dy*scale)};
      }else update={mode,amount:Math.min(.18,Math.hypot(dx,dy)*.005)};
      session.applyStroke(update);updateAll();status(v.name+': live four-view update, revision '+session.state().revision);
    }catch(e){active=null;status('Stroke rejected: '+e.message);try{updateAll();}catch{}}}
  function pointerUp(event,v){if(!active||active.view!==v||active.pointerId!==event.pointerId)return;
    try{session.endStroke();status('Stroke committed; undo/redo available.');}catch(e){status(e.message);}active=null;}
  for(const v of views){add(v.canvas,'pointerdown',e=>pointerDown(e,v));add(v.canvas,'pointermove',e=>pointerMove(e,v));add(v.canvas,'pointerup',e=>pointerUp(e,v));add(v.canvas,'pointercancel',e=>{if(active?.view===v){session.cancelStroke();active=null;updateAll();}});}
  function operate(fn,label){try{assertReady();if(active){session.cancelStroke();active=null;}const changed=fn();if(changed)updateAll();status(label+(changed?' complete.':' no available edit.'));}catch(e){status(label+' failed: '+e.message);}}
  add(controls.undo,'click',()=>operate(()=>session.undo(),'Undo'));
  add(controls.redo,'click',()=>operate(()=>session.redo(),'Redo'));
  add(controls.save,'click',()=>{
    try{const data=session.serialize(),blob=new Blob([data],{type:'application/json'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='dgb-native-sculpt-mesh-v1.json';a.click();URL.revokeObjectURL(url);status('Saved deterministic editable mesh.');}catch(e){status('Save failed: '+e.message);}
  });
  add(controls.load,'change',async event=>{
    const file=event.target.files?.[0];if(!file)return;
    try{assertReady();const source=await file.text();session.restore(source);updateAll();status('Reloaded verified editable mesh.');}catch(e){status('Reload rejected: '+e.message);}finally{event.target.value='';}
  });
  drawAll();status(source?'Original M1.3 read-only source: four actual textured WebGL views.':'Ready: four actual synchronized engine WebGL views.');
  return Object.freeze({session,drawAll,updateAll,views:()=>views.map(v=>Object.freeze({name:v.name,backend:v.device.backend,width:v.canvas.width,height:v.canvas.height})),
    status:()=>Object.freeze({...session.state(),failed,disposed,views:views.length,
      originalM13ReadOnly:Boolean(source),originalPose:source?.originalPose??null,originalAtlasMapped:Boolean(source)}),
    dispose(){if(disposed)return;for(const f of listeners)f();for(const v of views){try{v.scene.dispose();v.device.dispose();}catch{}}disposed=true;}});
}
