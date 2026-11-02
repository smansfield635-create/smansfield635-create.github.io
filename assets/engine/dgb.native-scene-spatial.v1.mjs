/** Diamond Gate Graphics Engine E3: independent scene, spatial and camera math.
 * Pure CPU hierarchy/visibility and E2 command submission. This module owns no GL,
 * resources, RAF, shader dialect, consumer renderer or world data.
 * Right-handed, +Y up, camera -Z forward; column-major OpenGL matrices.
 */
const finite = n => typeof n === 'number' && Number.isFinite(n);
const vec = (v,n,name) => {
  if (!Array.isArray(v) || v.length !== n || !v.every(finite)) throw new TypeError(name+'_INVALID');
  return [...v];
};
const unitQuat = q => {
  const v=vec(q,4,'QUATERNION'), length=Math.hypot(...v);
  if (length < 1e-12) throw new RangeError('QUATERNION_ZERO');
  return v.map(x=>x/length);
};
const mask = v => {
  if (!Number.isSafeInteger(v) || v < 1 || v > 0xffffffff) throw new TypeError('LAYER_MASK_INVALID');
  return v >>> 0;
};
const identity = () => new Float64Array([1,0,0,0, 0,1,0,0, 0,0,1,0, 0,0,0,1]);
function multiply(a,b) {
  const out=new Float64Array(16);
  for (let col=0;col<4;col++) for(let row=0;row<4;row++)
    out[col*4+row]=a[row]*b[col*4]+a[4+row]*b[col*4+1]+a[8+row]*b[col*4+2]+a[12+row]*b[col*4+3];
  return out;
}
function compose(p,q,s) {
  const [x,y,z,w]=q,xx=x*x,yy=y*y,zz=z*z,xy=x*y,xz=x*z,yz=y*z,wx=w*x,wy=w*y,wz=w*z;
  return new Float64Array([
    (1-2*(yy+zz))*s[0],(2*(xy+wz))*s[0],(2*(xz-wy))*s[0],0,
    (2*(xy-wz))*s[1],(1-2*(xx+zz))*s[1],(2*(yz+wx))*s[1],0,
    (2*(xz+wy))*s[2],(2*(yz-wx))*s[2],(1-2*(xx+yy))*s[2],0,
    p[0],p[1],p[2],1
  ]);
}
function transformPoint(m,p) {return [m[0]*p[0]+m[4]*p[1]+m[8]*p[2]+m[12],m[1]*p[0]+m[5]*p[1]+m[9]*p[2]+m[13],m[2]*p[0]+m[6]*p[1]+m[10]*p[2]+m[14]];}
function inverse(m) {
  const a=Array.from({length:4},(_,r)=>Array.from({length:8},(_,c)=>c<4?m[c*4+r]:Number(c-4===r)));
  for(let k=0;k<4;k++){
    let pivot=k;
    for(let j=k+1;j<4;j++) if(Math.abs(a[j][k])>Math.abs(a[pivot][k])) pivot=j;
    if(Math.abs(a[pivot][k])<1e-12) throw new Error('CAMERA_NON_INVERTIBLE');
    [a[pivot],a[k]]=[a[k],a[pivot]];
    const d=a[k][k];for(let c=0;c<8;c++)a[k][c]/=d;
    for(let r=0;r<4;r++)if(r!==k){const f=a[r][k];for(let c=0;c<8;c++)a[r][c]-=f*a[k][c];}
  }
  const out=new Float64Array(16);
  for(let c=0;c<4;c++)for(let r=0;r<4;r++)out[c*4+r]=a[r][c+4];
  return out;
}
function projection(spec) {
  const {kind,near,far,aspect}=spec;
  if(!finite(near)||near<=0||!finite(far)||far<=near||!finite(aspect)||aspect<=0)throw new TypeError('CAMERA_RANGE_INVALID');
  const o=new Float64Array(16);
  if(kind==='PERSPECTIVE'){
    const fovY=spec.fovY;
    if(!finite(fovY)||fovY<=0||fovY>=Math.PI)throw new TypeError('CAMERA_FOV_INVALID');
    const f=1/Math.tan(fovY/2);
    o[0]=f/aspect;o[5]=f;o[10]=(far+near)/(near-far);o[11]=-1;o[14]=2*far*near/(near-far);
  }else if(kind==='ORTHOGRAPHIC'){
    if(!finite(spec.orthoHeight)||spec.orthoHeight<=0)throw new TypeError('CAMERA_ORTHO_INVALID');
    o[0]=2/(spec.orthoHeight*aspect);o[5]=2/spec.orthoHeight;o[10]=-2/(far-near);o[14]=-(far+near)/(far-near);o[15]=1;
  }else throw new TypeError('CAMERA_KIND_INVALID');
  return o;
}
function planes(vp){
  const r=i=>[vp[i],vp[4+i],vp[8+i],vp[12+i]],r0=r(0),r1=r(1),r2=r(2),r3=r(3);
  return [[r3,r0,1],[r3,r0,-1],[r3,r1,1],[r3,r1,-1],[r3,r2,1],[r3,r2,-1]].map(([a,b,sign])=>{
    const p=a.map((x,i)=>x+sign*b[i]),norm=Math.hypot(p[0],p[1],p[2]);
    if(!finite(norm)||norm<1e-12)throw new Error('FRUSTUM_PLANE_INVALID');
    return p.map(x=>x/norm);
  });
}
function conservativeRadiusScale(m){
  const maxCol=Math.max(Math.abs(m[0])+Math.abs(m[1])+Math.abs(m[2]),Math.abs(m[4])+Math.abs(m[5])+Math.abs(m[6]),Math.abs(m[8])+Math.abs(m[9])+Math.abs(m[10]));
  const maxRow=Math.max(Math.abs(m[0])+Math.abs(m[4])+Math.abs(m[8]),Math.abs(m[1])+Math.abs(m[5])+Math.abs(m[9]),Math.abs(m[2])+Math.abs(m[6])+Math.abs(m[10]));
  return Math.sqrt(maxCol*maxRow);
}
const inside=(p,c,r)=>p.every(q=>q[0]*c[0]+q[1]*c[1]+q[2]*c[2]+q[3]>=-r);
const detached=x=>Object.freeze(Array.from(x));
export function createNativeSpatialScene() {
  const internals=new WeakMap(), all=new Set(), roots=[];
  let nextId=1, disposed=false, collectionCount=0;
  function assertActive(){if(disposed)throw new Error('SCENE_DISPOSED');}
  function get(handle){assertActive();const d=internals.get(handle);if(!d||!all.has(handle))throw new TypeError('NODE_NOT_IN_SCENE');return d;}
  function removeFrom(array,value){const i=array.indexOf(value);if(i>=0)array.splice(i,1);}
  function setParent(node,parent=null){
    const d=get(node),pd=parent===null?null:get(parent);
    if(node===parent)throw new Error('SCENE_CYCLE');
    for(let q=pd;q;q=q.parent===null?null:get(q.parent))if(q===d)throw new Error('SCENE_CYCLE');
    if(d.parent===parent)return node;
    removeFrom(d.parent===null?roots:get(d.parent).children,node);
    (pd?pd.children:roots).push(node);d.parent=parent;return node;
  }
  function setTransform(node,{position,rotation,scale}={}){
    const d=get(node);
    const p=position===undefined?d.position:vec(position,3,'POSITION');
    const q=rotation===undefined?d.rotation:unitQuat(rotation);
    const s=scale===undefined?d.scale:vec(scale,3,'SCALE');
    if(s.some(x=>Math.abs(x)<1e-12))throw new TypeError('SCALE_ZERO');
    d.position=p;d.rotation=q;d.scale=s;return node;
  }
  function createNode({parent=null,position=[0,0,0],rotation=[0,0,0,1],scale=[1,1,1],visible=true,layers=0xffffffff}={}){
    assertActive();if(typeof visible!=='boolean')throw new TypeError('VISIBILITY_INVALID');
    const pa=parent===null?null:get(parent);
    const p=vec(position,3,'POSITION'),q=unitQuat(rotation),s=vec(scale,3,'SCALE'),bits=mask(layers);
    if(s.some(x=>Math.abs(x)<1e-12))throw new TypeError('SCALE_ZERO');
    const node=Object.freeze({id:nextId++});
    const d={parent,children:[],position:p,rotation:q,scale:s,visible,layers:bits,renderable:null,camera:null};
    all.add(node);internals.set(node,d);(pa?pa.children:roots).push(node);return node;
  }
  function cameraDefinition({kind='PERSPECTIVE',near=0.1,far=1000,aspect=1,fovY=Math.PI/3,orthoHeight=10,layers=0xffffffff}={}){
    const value={kind,near,far,aspect,fovY,orthoHeight,layers:mask(layers)};
    projection(value);return value;
  }
  function createCamera({parent=null,position=[0,0,0],rotation=[0,0,0,1],projection:kind='PERSPECTIVE',near=0.1,far=1000,aspect=1,fovY=Math.PI/3,orthoHeight=10,layers=0xffffffff}={}){
    const camera=cameraDefinition({kind,near,far,aspect,fovY,orthoHeight,layers});
    const node=createNode({parent,position,rotation});get(node).camera=camera;return node;
  }
  function setCamera(node,{projection:kind,near,far,aspect,fovY,orthoHeight,layers}={}){
    const d=get(node);if(!d.camera)throw new TypeError('NOT_A_CAMERA');
    d.camera=cameraDefinition({...d.camera,...(kind===undefined?{}:{kind}),...(near===undefined?{}:{near}),...(far===undefined?{}:{far}),...(aspect===undefined?{}:{aspect}),...(fovY===undefined?{}:{fovY}),...(orthoHeight===undefined?{}:{orthoHeight}),...(layers===undefined?{}:{layers})});return node;
  }
  function setVisibility(node,visible){const d=get(node);if(typeof visible!=='boolean')throw new TypeError('VISIBILITY_INVALID');d.visible=visible;return node;}
  function setLayers(node,layers){get(node).layers=mask(layers);return node;}
  function setRenderable(node,{program,mesh,pass='OPAQUE',cull='NONE',bounds,first=0,count=null,beforeDraw=null}={}){
    const d=get(node);
    if(d.camera)throw new TypeError('CAMERA_NOT_RENDERABLE');
    if(!['OPAQUE','TRANSPARENT'].includes(pass)||!['NONE','BACK','FRONT'].includes(cull))throw new TypeError('DRAW_SETTINGS_INVALID');
    if(!program?.gpu||!mesh?.gpu)throw new TypeError('DRAW_GPU_RESOURCES_REQUIRED');
    if(!bounds||!finite(bounds.radius)||bounds.radius<0)throw new TypeError('BOUNDING_SPHERE_INVALID');
    const center=vec(bounds.center,3,'BOUNDING_CENTER');
    if(!Number.isInteger(first)||first<0||count!==null&&(!Number.isInteger(count)||count<1))throw new TypeError('DRAW_RANGE_INVALID');
    if(beforeDraw!==null&&typeof beforeDraw!=='function')throw new TypeError('BEFORE_DRAW_INVALID');
    d.renderable={program,mesh,pass,cull,bounds:{center,radius:bounds.radius},first,count,beforeDraw};return node;
  }
  function removeNode(node){const d=get(node);removeFrom(d.parent===null?roots:get(d.parent).children,node);function remove(n){const x=internals.get(n);for(const c of x.children)remove(c);all.delete(n);internals.delete(n);}remove(node);}
  function collect(cameraNode){
    const cam=get(cameraNode);if(!cam.camera)throw new TypeError('NOT_A_CAMERA');
    const world=new Map(),effect=new Map();
    function visit(n,parentMatrix,visible,layers){const d=get(n),m=multiply(parentMatrix,compose(d.position,d.rotation,d.scale));
      const v=visible&&d.visible,l=layers&d.layers;
      world.set(n,m);effect.set(n,{visible:v,layers:l});
      for(const c of d.children)visit(c,m,v,l);
    }
    for(const root of roots)visit(root,identity(),true,0xffffffff);
    if(!effect.get(cameraNode)?.visible)throw new Error('CAMERA_NOT_VISIBLE');
    const cm=world.get(cameraNode),view=inverse(cm),proj=projection(cam.camera),vp=multiply(proj,view),planes6=planes(vp);
    const sceneCommands=[];let considered=0,culled=0;
    for(const [n,m] of world){const d=get(n),e=effect.get(n);if(!d.renderable)continue;considered++;
      if(!e.visible||!(e.layers&cam.camera.layers)){culled++;continue;}
      const sphere=d.renderable.bounds,center=transformPoint(m,sphere.center),radius=sphere.radius*conservativeRadiusScale(m);
      if(!inside(planes6,center,radius)){culled++;continue;}
      const md=multiply(view,m),mvp=multiply(proj,md),local=transformPoint(md,sphere.center);
      const r=d.renderable;
      sceneCommands.push(Object.freeze({node:n,pass:r.pass,cull:r.cull,program:r.program,mesh:r.mesh,first:r.first,count:r.count,beforeDraw:r.beforeDraw,depthKey:r.pass==='TRANSPARENT'?Math.max(0,-local[2]):null,modelMatrix:detached(m),modelViewProjection:detached(mvp)}));
    }
    collectionCount++;
    return Object.freeze({viewMatrix:detached(view),projectionMatrix:detached(proj),viewProjectionMatrix:detached(vp),commands:Object.freeze(sceneCommands),considered,culled,visible:sceneCommands.length});
  }
  function submit(pipeline,cameraNode,{bindMatrices}={}){
    assertActive();if(!pipeline||typeof pipeline.submit!=='function'||!pipeline.status?.().active)throw new TypeError('E2_ACTIVE_PIPELINE_REQUIRED');
    if(typeof bindMatrices!=='function')throw new TypeError('MATRIX_BINDING_REQUIRED');
    const result=collect(cameraNode);
    for(const command of result.commands){
      const {program,mesh,first,count,pass,cull,depthKey,modelMatrix,modelViewProjection,beforeDraw}=command;
      pipeline.submit({program,mesh,first,count,pass,cull,depthKey,beforeDraw(gl,programHandle){
        bindMatrices({gl,programHandle,modelMatrix:new Float32Array(modelMatrix),viewMatrix:new Float32Array(result.viewMatrix),projectionMatrix:new Float32Array(result.projectionMatrix),modelViewProjection:new Float32Array(modelViewProjection)});
        if(beforeDraw)beforeDraw(gl,programHandle);
      }});
    }
    return Object.freeze({submitted:result.visible,considered:result.considered,culled:result.culled});
  }
  function dispose(){all.clear();roots.length=0;disposed=true;}
  return Object.freeze({createNode,createCamera,setParent,setTransform,setCamera,setVisibility,setLayers,setRenderable,removeNode,collect,submit,dispose,status:()=>Object.freeze({nodes:all.size,collections:collectionCount,disposed})});
}
