/*
  Laws first bounded spatial manifestation experiment v1.
  Mechanical sources frozen by Page Excellence ARCHITECTURE:
  - laws/index.compositor.js @ 331284949940c95db80a332235492de4c80d3d43
    camera/view/projection, viewport, non-semantic depth and world-to-screen mechanics.
  - research/prototypes/laws-geometric-grammar-lab/renderer-webgl2.js @ 49d9890a0405c22aaac407e3724fbd5bae6ccafc
    WebGL2 program/buffer/depth/resize mechanics.
  - research/prototypes/laws-geometric-grammar-lab/app.js @ 49d9890a0405c22aaac407e3724fbd5bae6ccafc
    resize, visibility and reduced-motion lifecycle mechanics.
  No Laws relation taxonomy or unresolved-state values are defined here.
  Semantic state is read directly from the frozen projection description.
*/

const MANIFEST_URL='./specimen-manifest.v1.json';
const PROJECTION_URL='../laws-bounded-spatial-manifestation-projection-description-v1.json';
const canvas=document.querySelector('#spatial-canvas');
const overlay=document.querySelector('#semantic-overlay');
const relationList=document.querySelector('#relation-list');
const resolutionList=document.querySelector('#resolution-list');
const inspection=document.querySelector('#inspection-detail');
const runtimeStatus=document.querySelector('#runtime-status');
const resetButton=document.querySelector('#reset-view');

const state={manifest:null,projection:null,gl:null,program:null,buffer:null,lineCount:0,nodeCount:0,nodePositions:new Map(),nodeEls:new Map(),relationEls:new Map(),yaw:0,pitch:.09,distance:6.9,pointer:null,renderCount:0,reducedMotion:matchMedia('(prefers-reduced-motion: reduce)').matches};

const VS=`#version 300 es
precision highp float;
in vec3 aPosition;
uniform mat4 uVP;
uniform float uPointSize;
void main(){gl_Position=uVP*vec4(aPosition,1.0);gl_PointSize=uPointSize;}`;
const FS=`#version 300 es
precision highp float;
uniform vec4 uColor;
out vec4 outColor;
void main(){outColor=uColor;}`;

const norm=v=>{const n=Math.hypot(...v)||1;return v.map(x=>x/n)};
const sub=(a,b)=>a.map((v,i)=>v-b[i]);
const add=(a,b)=>a.map((v,i)=>v+b[i]);
const mul=(v,s)=>v.map(x=>x*s);
const dot=(a,b)=>a.reduce((s,v,i)=>s+v*b[i],0);
const cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
const mid=(a,b)=>a.map((v,i)=>(v+b[i])/2);

function matMul(a,b){const o=new Float32Array(16);for(let c=0;c<4;c++)for(let r=0;r<4;r++)o[c*4+r]=a[r]*b[c*4]+a[4+r]*b[c*4+1]+a[8+r]*b[c*4+2]+a[12+r]*b[c*4+3];return o}
function perspective(fovy,aspect,near,far){const f=1/Math.tan(fovy/2),nf=1/(near-far),o=new Float32Array(16);o[0]=f/aspect;o[5]=f;o[10]=(far+near)*nf;o[11]=-1;o[14]=2*far*near*nf;return o}
function lookAt(eye,target,up){const z=norm(sub(eye,target)),x=norm(cross(up,z)),y=cross(z,x);return new Float32Array([x[0],y[0],z[0],0,x[1],y[1],z[1],0,x[2],y[2],z[2],0,-dot(x,eye),-dot(y,eye),-dot(z,eye),1])}
function transform(m,p){const [x,y,z]=p;return[m[0]*x+m[4]*y+m[8]*z+m[12],m[1]*x+m[5]*y+m[9]*z+m[13],m[2]*x+m[6]*y+m[10]*z+m[14],m[3]*x+m[7]*y+m[11]*z+m[15]]}
function camera(){const rect=canvas.getBoundingClientRect(),aspect=Math.max(1,rect.width)/Math.max(1,rect.height),cp=Math.cos(state.pitch),eye=[Math.sin(state.yaw)*cp*state.distance,Math.sin(state.pitch)*state.distance,Math.cos(state.yaw)*cp*state.distance];return{vp:matMul(perspective(Math.PI/4.8,aspect,.1,40),lookAt(eye,[0,0,0],[0,1,0])),rect}}

function shader(gl,type,src){const s=gl.createShader(type);gl.shaderSource(s,src);gl.compileShader(s);if(!gl.getShaderParameter(s,gl.COMPILE_STATUS)){const m=gl.getShaderInfoLog(s)||'shader compile failure';gl.deleteShader(s);throw new Error(m)}return s}
function program(gl){const v=shader(gl,gl.VERTEX_SHADER,VS),f=shader(gl,gl.FRAGMENT_SHADER,FS),p=gl.createProgram();gl.attachShader(p,v);gl.attachShader(p,f);gl.linkProgram(p);gl.deleteShader(v);gl.deleteShader(f);if(!gl.getProgramParameter(p,gl.LINK_STATUS))throw new Error(gl.getProgramInfoLog(p)||'program link failure');return p}
function resize(){const r=canvas.getBoundingClientRect(),d=Math.min(devicePixelRatio||1,2),w=Math.max(1,Math.round(r.width*d)),h=Math.max(1,Math.round(r.height*d));if(canvas.width!==w||canvas.height!==h){canvas.width=w;canvas.height=h}state.gl.viewport(0,0,w,h)}

function arrowSegments(from,to){const d=norm(sub(to,from)),start=add(from,mul(d,.24)),tip=add(to,mul(d,-.27)),back=add(tip,mul(d,-.30));let side=norm(cross(d,[0,0,1]));if(Math.hypot(...side)<.2)side=norm(cross(d,[0,1,0]));const wing=.17;return[start,tip,tip,add(back,mul(side,wing)),tip,add(back,mul(side,-wing))]}
function buildGeometry(){state.nodePositions.clear();for(const n of state.manifest.spatialLayout.nodes)state.nodePositions.set(n.objectId,n.position);const lines=[];for(const r of state.projection.relationPresentations){const a=state.nodePositions.get(r.fromObjectId),b=state.nodePositions.get(r.toObjectId);if(!a||!b)throw new Error(`Missing presentation coordinate for ${r.sourceRelationId}`);lines.push(...arrowSegments(a,b).flat())}const nodes=state.projection.visibleNodeIds.flatMap(id=>state.nodePositions.get(id));const vertices=new Float32Array([...lines,...nodes]);const gl=state.gl;gl.bindBuffer(gl.ARRAY_BUFFER,state.buffer);gl.bufferData(gl.ARRAY_BUFFER,vertices,gl.STATIC_DRAW);state.lineCount=lines.length/3;state.nodeCount=nodes.length/3}

function button(cls,text){const e=document.createElement('button');e.type='button';e.className=`semantic-button ${cls}`;e.textContent=text;return e}
function inspectRelation(r){inspection.textContent=JSON.stringify({kind:'DIRECT_TYPED_RELATION_V1',relationId:r.sourceRelationId,fromObjectId:r.fromObjectId,toObjectId:r.toObjectId,direction:r.direction,relationType:r.relationType,qualifiers:r.qualifiers,standing:r.standing,claimCeiling:r.claimCeiling,authorityRefs:r.authorityRefs,provenanceRefs:r.provenanceRefs,presentationChannels:r.presentationChannels},null,2)}
function populateReadback(){overlay.replaceChildren();relationList.replaceChildren();resolutionList.replaceChildren();state.nodeEls.clear();state.relationEls.clear();for(const id of state.projection.visibleNodeIds){const e=button('node-label',id);e.dataset.objectId=id;e.addEventListener('click',()=>{inspection.textContent=JSON.stringify({kind:'OBJECT_IDENTITY',objectId:id},null,2)});overlay.append(e);state.nodeEls.set(id,e)}for(const r of state.projection.relationPresentations){const label=button('relation-label',r.relationType);label.dataset.relationId=r.sourceRelationId;label.addEventListener('click',()=>inspectRelation(r));overlay.append(label);state.relationEls.set(r.sourceRelationId,label);const card=button('relation-card','');const strong=document.createElement('strong');strong.textContent=r.relationType;const span=document.createElement('span');span.textContent=`${r.fromObjectId} → ${r.toObjectId} · ${r.sourceRelationId}`;card.append(strong,span);card.addEventListener('click',()=>inspectRelation(r));relationList.append(card)}for(const r of state.projection.resolutionPresentations){const card=document.createElement('article');card.className='resolution-card';const strong=document.createElement('strong');strong.textContent=r.resolutionState;const code=document.createElement('code');code.textContent=r.evaluatedObjectIdentity;card.append(strong,code);resolutionList.append(card)}if(state.projection.relationPresentations[0])inspectRelation(state.projection.relationPresentations[0])}

function place(el,p,vp,rect){const [x,y,z,w]=transform(vp,p),visible=w>0&&z/w>-1.1&&z/w<1.1;el.dataset.offscreen=visible?'false':'true';if(!visible)return;el.style.left=`${(x/w*.5+.5)*rect.width}px`;el.style.top=`${(-y/w*.5+.5)*rect.height}px`}
function placeOverlay(vp,rect){for(const[id,e]of state.nodeEls)place(e,state.nodePositions.get(id),vp,rect);for(const r of state.projection.relationPresentations)place(state.relationEls.get(r.sourceRelationId),mid(state.nodePositions.get(r.fromObjectId),state.nodePositions.get(r.toObjectId)),vp,rect)}
function render(){resize();const gl=state.gl,{vp,rect}=camera();gl.clearColor(.025,.055,.082,1);gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);gl.useProgram(state.program);gl.bindBuffer(gl.ARRAY_BUFFER,state.buffer);const loc=gl.getAttribLocation(state.program,'aPosition');gl.enableVertexAttribArray(loc);gl.vertexAttribPointer(loc,3,gl.FLOAT,false,0,0);gl.uniformMatrix4fv(gl.getUniformLocation(state.program,'uVP'),false,vp);gl.uniform4f(gl.getUniformLocation(state.program,'uColor'),.72,.84,.90,.94);gl.uniform1f(gl.getUniformLocation(state.program,'uPointSize'),1);gl.drawArrays(gl.LINES,0,state.lineCount);gl.uniform4f(gl.getUniformLocation(state.program,'uColor'),.86,.92,.95,1);gl.uniform1f(gl.getUniformLocation(state.program,'uPointSize'),22*Math.min(devicePixelRatio||1,1.6));gl.drawArrays(gl.POINTS,state.lineCount,state.nodeCount);placeOverlay(vp,rect);state.renderCount++;document.body.dataset.renderCount=String(state.renderCount)}

function bindInteraction(){canvas.addEventListener('pointerdown',e=>{canvas.setPointerCapture(e.pointerId);state.pointer={id:e.pointerId,x:e.clientX,y:e.clientY}});canvas.addEventListener('pointermove',e=>{if(!state.pointer||state.pointer.id!==e.pointerId)return;const dx=e.clientX-state.pointer.x,dy=e.clientY-state.pointer.y;state.pointer.x=e.clientX;state.pointer.y=e.clientY;state.yaw+=dx*.006;state.pitch=Math.max(-.78,Math.min(.78,state.pitch+dy*.0045));render()});const finish=e=>{if(state.pointer?.id===e.pointerId)state.pointer=null};canvas.addEventListener('pointerup',finish);canvas.addEventListener('pointercancel',finish);canvas.addEventListener('wheel',e=>{e.preventDefault();state.distance=Math.max(4.6,Math.min(10.5,state.distance*Math.exp(e.deltaY*.0011)));render()},{passive:false});resetButton.addEventListener('click',()=>{state.yaw=0;state.pitch=.09;state.distance=6.9;render()});addEventListener('resize',render,{passive:true});document.addEventListener('visibilitychange',()=>{if(!document.hidden)render()})}

function validateBindings(){const m=state.manifest,p=state.projection;if(m.schema!=='LAWS_PHI1_SPATIAL_SPECIMEN_MANIFEST_v1')throw new Error('Specimen manifest schema mismatch');if(p.schema!=='LAWS_ABSTRACT_PROJECTION_DESCRIPTION_v1')throw new Error('Frozen projection schema mismatch');if(m.authorityBinding.projectionDescriptionDigest!=='b1210d5e68c2337cbcd9a5d993b73f2563f45aa805e427e495e042785f5e8922')throw new Error('Projection identity mismatch');const layoutIds=m.spatialLayout.nodes.map(n=>n.objectId).sort(),visible=[...p.visibleNodeIds].sort();if(JSON.stringify(layoutIds)!==JSON.stringify(visible))throw new Error('Spatial layout identity set mismatch');if(m.implementationBinding.implementationClass!=='EXISTING_CONSTRUCT_ADOPTION')throw new Error('Implementation class mismatch');if(p.viewState?.changesSemanticState!==false)throw new Error('Frozen view state is not semantically immutable')}

async function boot(){const[mr,pr]=await Promise.all([fetch(MANIFEST_URL),fetch(PROJECTION_URL)]);if(!mr.ok||!pr.ok)throw new Error('Required frozen JSON input could not be loaded');state.manifest=await mr.json();state.projection=await pr.json();validateBindings();const gl=canvas.getContext('webgl2',{alpha:false,antialias:true,depth:true,powerPreference:'high-performance'});if(!gl)throw new Error('WebGL2 unavailable');state.gl=gl;state.program=program(gl);state.buffer=gl.createBuffer();gl.enable(gl.DEPTH_TEST);gl.depthFunc(gl.LEQUAL);document.body.dataset.webgl2='true';document.body.dataset.manifestLoaded='true';document.body.dataset.projectionLoaded='true';document.body.dataset.reducedMotion=state.reducedMotion?'true':'false';buildGeometry();populateReadback();bindInteraction();render();document.body.dataset.runtimeState='ready';runtimeStatus.textContent='WebGL2 ready · exact frozen projection loaded'}

boot().catch(error=>{document.body.dataset.runtimeState='failed';document.body.dataset.webgl2=state.gl?'true':'false';runtimeStatus.textContent=`Runtime failed: ${error.message}`;const failure=document.createElement('div');failure.className='fatal-runtime';failure.textContent=`FAIL_CLOSED: ${error.message}`;document.querySelector('.stage')?.append(failure);console.error(error)});
