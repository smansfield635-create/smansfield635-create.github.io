const CONNECTED_MASSIF_SHOULDERS='ONE_CONNECTED_RANGE_WITH_NINE_VISUALLY_SEPARABLE_SUMMIT_EVENTS';
const CONTRACT=Object.freeze({
  id:'AWARDS_TRUST_LIVING_OBJECT_TRUE_3D_V5_MOUNTAIN_RECOGNITION',
  cycle:'D_TRUST',
  claim:'Software should have to earn the right to say it worked.',
  recognizableObject:'NINE_SUMMITS',
  renderer:'WEBGL_3D_CONNECTED_MOUNTAIN_RANGE',
  signatureEvent:'EARNED_ASCENT_REVEAL',
  eventCount:1,
  summitCount:9,
  compositionProfile:Object.freeze({
    reference:'BROAD_CONNECTED_RANGE_NINE_SUMMIT_EVENTS',
    distinctSummitCount:9,
    cameraMode:'PERSPECTIVE_ALPINE_RANGE',
    fovDegrees:38,
    targetFrameOccupancy:.91,
    hostShape:'PANORAMIC_MOUNTAIN_RANGE',
    broadShoulders:true,
    visibleSaddles:true,
    foregroundFoothills:true
  }),
  sourceBinding:Object.freeze({
    nineSummits:Object.freeze({path:'/nine-summits/index.html',blob:'99ae0cdafe5ad649d04d381ccbb2aa565aff86cd',coreMessage:'the-climb-becomes-a-world'}),
    literalMountainDonorGeometryPresent:false,
    boundedConstructionException:'ONE_TRUE_3D_NINE_SUMMIT_MASSIF_IN_AWARDS_MODULE_ONLY'
  }),
  lifecycle:Object.freeze(['REAR_INERT','APPROACHING','FOREGROUND_REST','SIGNATURE_PLAY','FOREGROUND_IDLE','SELECT_RESPONSE','READER_OPEN','RETURN_RESTORING'])
});

const SUMMITS=Object.freeze([
  [-1.72,.10,.64,.42,.48],[-1.30,-.06,.82,.39,.43],[-.91,.13,.72,.38,.44],[-.50,-.10,.95,.42,.46],
  [-.06,.02,1.18,.47,.50],[.39,-.08,.88,.42,.45],[.80,.13,1.00,.43,.46],[1.22,-.04,.79,.40,.44],[1.62,.10,.66,.42,.48]
]);
const VS=`attribute vec3 a_position;
attribute vec3 a_normal;
attribute vec4 a_color;
uniform mat4 u_view;
uniform mat4 u_proj;
uniform float u_lift;
varying vec3 v_n;
varying vec4 v_c;
varying float v_depth;
void main(){
  vec3 p=a_position;p.y+=u_lift*(.02+.07*smoothstep(.10,1.0,p.y+.46));
  vec4 vp=u_view*vec4(p,1.0);gl_Position=u_proj*vp;
  v_n=normalize(mat3(u_view)*a_normal);v_c=a_color;v_depth=clamp((-vp.z-2.2)/5.5,0.0,1.0);
}`;
const FS=`precision mediump float;
varying vec3 v_n;
varying vec4 v_c;
varying float v_depth;
void main(){
  vec3 L=normalize(vec3(-.42,.76,.38));float d=.26+.74*max(0.0,dot(normalize(v_n),L));
  vec3 fog=vec3(.075,.105,.115);vec3 lit=v_c.rgb*d;gl_FragColor=vec4(mix(lit,fog,v_depth*.30),v_c.a);
}`;
function sh(gl,t,s){const q=gl.createShader(t);gl.shaderSource(q,s);gl.compileShader(q);if(!gl.getShaderParameter(q,gl.COMPILE_STATUS))throw new Error('SUMMITS_SHADER:'+gl.getShaderInfoLog(q));return q}
function prog(gl){const p=gl.createProgram();gl.attachShader(p,sh(gl,gl.VERTEX_SHADER,VS));gl.attachShader(p,sh(gl,gl.FRAGMENT_SHADER,FS));gl.linkProgram(p);if(!gl.getProgramParameter(p,gl.LINK_STATUS))throw new Error('SUMMITS_LINK:'+gl.getProgramInfoLog(p));return p}
function ridge(x,z){
  const axial=.18*Math.exp(-(z*z/.52))*Math.exp(-(x*x/7.4));
  const fore=.10*Math.exp(-((z+.52)*(z+.52)/.34))*Math.exp(-(x*x/6.8));
  const rear=.085*Math.exp(-((z-.48)*(z-.48)/.42))*Math.exp(-(x*x/6.0));
  return axial+fore+rear;
}
function bridge(x,z,a,b){
  const vx=b[0]-a[0],vz=b[1]-a[1],l2=vx*vx+vz*vz,t=Math.max(0,Math.min(1,((x-a[0])*vx+(z-a[1])*vz)/(l2||1))),px=a[0]+vx*t,pz=a[1]+vz*t,dx=x-px,dz=z-pz;
  return .085*Math.exp(-(dx*dx/.22+dz*dz/.24));
}
function height(x,z){
  let h=.035+ridge(x,z);
  for(const[sx,sz,a,wx,wz]of SUMMITS){
    const dx=x-sx,dz=z-sz;
    const shoulder=a*.25*Math.exp(-(dx*dx/(wx*wx)+dz*dz/(wz*wz)));
    const crown=a*.34*Math.exp(-(dx*dx/(wx*wx*.34)+dz*dz/(wz*wz*.40)));
    h+=shoulder+crown;
  }
  for(let i=0;i<SUMMITS.length-1;i++)h+=bridge(x,z,SUMMITS[i],SUMMITS[i+1]);
  h+=.045*Math.exp(-((z+.80)*(z+.80)/.18))*Math.exp(-(x*x/8.0));
  h+=.013*Math.sin(x*3.0+z*2.1)*Math.exp(-(z*z/.95));
  return Math.max(.02,h);
}
function normal(x,z){const e=.018,hx=height(x+e,z)-height(x-e,z),hz=height(x,z+e)-height(x,z-e),nx=-hx/(2*e),ny=1,nz=-hz/(2*e),l=Math.hypot(nx,ny,nz)||1;return[nx/l,ny/l,nz/l]}
function build(){
  const NX=92,NZ=48,x0=-2.08,x1=2.08,z0=-1.05,z1=1.12,verts=[],norms=[],cols=[],idx=[];
  for(let j=0;j<NZ;j++){
    const z=z0+(z1-z0)*j/(NZ-1);
    for(let i=0;i<NX;i++){
      const x=x0+(x1-x0)*i/(NX-1),y=height(x,z),n=normal(x,z),snow=Math.max(0,Math.min(1,(y-.61)/.38)),rock=Math.max(0,Math.min(1,(y-.24)/.52)),front=Math.max(0,Math.min(1,(-z+.55)/1.65));
      const r=.10*(1-rock)+.29*rock+.64*snow,g=.18*(1-rock)+.28*rock+.62*snow,b=.14*(1-rock)+.24*rock+.60*snow;
      verts.push(x,y-.52,z);norms.push(...n);cols.push(r+.025*front,g+.018*front,b+.012*front,1);
    }
  }
  for(let j=0;j<NZ-1;j++)for(let i=0;i<NX-1;i++){const a=j*NX+i,b=a+1,c=a+NX,d=c+1;idx.push(a,c,b,b,c,d)}
  return{verts,norms,cols,idx,rows:NZ,columns:NX};
}
function upload(gl,g){const o={count:g.idx.length};for(const[k,d]of[['p',g.verts],['n',g.norms],['c',g.cols]]){o[k]=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,o[k]);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(d),gl.STATIC_DRAW)}o.i=gl.createBuffer();gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,o.i);gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,new Uint16Array(g.idx),gl.STATIC_DRAW);return o}
function bind(gl,p,o){for(const[n,k,s]of[['a_position','p',3],['a_normal','n',3],['a_color','c',4]]){const l=gl.getAttribLocation(p,n);gl.bindBuffer(gl.ARRAY_BUFFER,o[k]);gl.enableVertexAttribArray(l);gl.vertexAttribPointer(l,s,gl.FLOAT,false,0,0)}gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,o.i)}
function perspective(fov,aspect,near,far){const f=1/Math.tan(fov/2),nf=1/(near-far);return new Float32Array([f/aspect,0,0,0,0,f,0,0,0,0,(far+near)*nf,-1,0,0,2*far*near*nf,0])}
function n3(v){const l=Math.hypot(v[0],v[1],v[2])||1;return[v[0]/l,v[1]/l,v[2]/l]}
function cross(a,b){return[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]]}
function lookAt(eye,target,up=[0,1,0]){const z=n3([eye[0]-target[0],eye[1]-target[1],eye[2]-target[2]]),x=n3(cross(up,z)),y=cross(z,x);return new Float32Array([x[0],y[0],z[0],0,x[1],y[1],z[1],0,x[2],y[2],z[2],0,-(x[0]*eye[0]+x[1]*eye[1]+x[2]*eye[2]),-(y[0]*eye[0]+y[1]*eye[1]+y[2]*eye[2]),-(z[0]*eye[0]+z[1]*eye[1]+z[2]*eye[2]),1])}
export function mountTrustLivingObject(root,options={}){
  if(!root||typeof root.replaceChildren!=='function')throw new TypeError('TRUST_ROOT_REQUIRED');
  const doc=root.ownerDocument||document,canvas=doc.createElement('canvas');canvas.className='awards-true3d-canvas awards-nine-summits-true3d';canvas.style.cssText='display:block;width:100%;height:100%;min-height:220px;pointer-events:none';canvas.setAttribute('aria-hidden','true');root.replaceChildren(canvas);
  const gl=canvas.getContext('webgl2',{alpha:true,antialias:true})||canvas.getContext('webgl',{alpha:true,antialias:true});if(!gl)throw new Error('TRUST_WEBGL_REQUIRED');
  const built=build(),p=prog(gl),gpu=upload(gl,built);gl.useProgram(p);gl.enable(gl.DEPTH_TEST);gl.enable(gl.CULL_FACE);bind(gl,p,gpu);
  const uv=gl.getUniformLocation(p,'u_view'),up=gl.getUniformLocation(p,'u_proj'),ul=gl.getUniformLocation(p,'u_lift');
  let state='FOREGROUND_REST',phase='rest',destroyed=false,raf=0,start=performance.now(),sig=-1;const reduced=options.reducedMotion??matchMedia?.('(prefers-reduced-motion: reduce)')?.matches??false;
  function resize(){const d=Math.min(2,devicePixelRatio||1),w=Math.max(1,Math.round(canvas.clientWidth*d)),h=Math.max(1,Math.round(canvas.clientHeight*d));if(w!==canvas.width||h!==canvas.height){canvas.width=w;canvas.height=h}gl.viewport(0,0,w,h);return w/h}
  function frame(t){
    if(destroyed)return;const asp=resize(),st=sig<0?99:(t-sig)/1000,asc=reduced?(sig>=0?.75:0):(sig>=0?Math.min(1,st/.95)*Math.max(0,Math.min(1,(3.25-st)/.72)):0);
    if(sig>=0&&st>3.52){sig=-1;phase='rest';state='FOREGROUND_IDLE'}
    const drift=.025*Math.sin((t-start)/5200),eye=[-.05+drift,1.04+asc*.10,-3.68+asc*.18],target=[0,.16+asc*.06,.14+asc*.20];
    gl.clearColor(.006,.012,.016,0);gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);gl.uniformMatrix4fv(uv,false,lookAt(eye,target));gl.uniformMatrix4fv(up,false,perspective(CONTRACT.compositionProfile.fovDegrees*Math.PI/180,asp,.08,24));gl.uniform1f(ul,asc*.10);gl.drawElements(gl.TRIANGLES,gpu.count,gl.UNSIGNED_SHORT,0);raf=requestAnimationFrame(frame);
  }
  raf=requestAnimationFrame(frame);
  function S(x){if(!CONTRACT.lifecycle.includes(x))throw new Error('TRUST_INVALID_STATE');state=x;return x}
  function playSignature(){S('SIGNATURE_PLAY');phase='earned-ascent';sig=performance.now();return sig}
  function selectResponse(){S('SELECT_RESPONSE')}
  function readerOpen(){S('READER_OPEN')}
  function restore(){S('RETURN_RESTORING');sig=-1;phase='rest';setTimeout(()=>{if(!destroyed)S('FOREGROUND_REST')},reduced?0:260)}
  function setLifecycle(x){S(x)}
  function inspect(){return Object.freeze({contract:CONTRACT.id,state,phase,reducedMotion:!!reduced,webglContexts:1,renderer:CONTRACT.renderer,recognizableObject:'NINE_SUMMITS',summitCount:9,distinctSummitCount:9,connectedMassif:CONNECTED_MASSIF_SHOULDERS,broadShoulders:true,visibleSaddles:true,foregroundFoothills:true,perspectiveProjection:true,terrainRows:built.rows,terrainColumns:built.columns,compositionProfile:CONTRACT.compositionProfile,signatureEvent:CONTRACT.signatureEvent,eventCount:1,sourceBinding:CONTRACT.sourceBinding})}
  function destroy(){destroyed=true;cancelAnimationFrame(raf);for(const k of['p','n','c','i'])gl.deleteBuffer(gpu[k]);gl.deleteProgram(p);gl.getExtension('WEBGL_lose_context')?.loseContext();root.replaceChildren()}
  return Object.freeze({contract:CONTRACT,setState:setLifecycle,playSignature,selectResponse,readerOpen,restore,inspect,destroy,element:canvas});
}
export{CONTRACT as AWARDS_TRUST_CYCLE_D_CONTRACT};
