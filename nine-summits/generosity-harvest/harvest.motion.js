/**
 * Generosity Harvest / Gen3442: held native source-construction candidate.
 * E1 owns the only WebGL context; E2 submits; E3 owns scene/camera; E4 owns materials.
 * No original illustration, rabbit atlas, rabbit geometry or private evidence is embedded.
 * This scene is a procedural spatial construction for evaluation, NOT an accepted
 * replacement for the 1672x941 original pastoral artwork. Artistic C1 remains HOLD.
 */
import {createNativeWebGLDevice} from '../../assets/engine/dgb.native-webgl-device.v1.mjs';
import {createNativeFramePipeline} from '../../assets/engine/dgb.native-frame-pipeline.v1.mjs';
import {createNativeSpatialScene} from '../../assets/engine/dgb.native-scene-spatial.v1.mjs';
import {createNativeMaterialLibrary} from '../../assets/engine/dgb.native-material-light.v1.mjs';

const ID = new Float32Array([1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1]);
const PALETTE = Object.freeze({
  grass:[.27,.46,.24,1], grassLight:[.37,.56,.32,1], grassDeep:[.17,.34,.24,1],
  bank:[.54,.60,.31,1], path:[.64,.49,.33,1], pathLight:[.80,.65,.43,1],
  water:[.22,.54,.57,1], waterLight:[.44,.73,.70,1],
  bridge:[.49,.31,.20,1], bridgeLight:[.76,.53,.31,1],
  bark:[.35,.23,.16,1], leaves:[.21,.42,.26,1], leavesLight:[.40,.56,.28,1],
  blossom:[.91,.63,.72,1], blossomLight:[.99,.85,.81,1],
  flowerWhite:[.96,.92,.76,1], flowerGold:[.98,.72,.31,1],
  fruit:[.77,.26,.19,1], fruitGold:[.94,.61,.22,1],
  stone:[.48,.52,.44,1], hill:[.26,.41,.36,1],
  wings:[.88,.80,.63,1]
});
const finite = n=>typeof n==='number'&&Number.isFinite(n);
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const ground=(x,z)=>.07*Math.sin(x*.55+z*.16)+.06*Math.cos(z*.35);
function seeded(seed=7163){return ()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};}
function vector(a,b){return [a[0]-b[0],a[1]-b[1],a[2]-b[2]];}
function cross(a,b){return [a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];}
function unit(v){const l=Math.hypot(...v)||1;return v.map(x=>x/l);}
function geometryBuilder(){
  const batches=new Map();
  function batch(name){if(!PALETTE[name])throw Error('UNKNOWN_HARVEST_MATERIAL');if(!batches.has(name))batches.set(name,{p:[],n:[],uv:[],i:[]});return batches.get(name);}
  function tri(name,a,b,c){
    const data=batch(name),normal=unit(cross(vector(b,a),vector(c,a))),start=data.p.length/3;
    for(const v of [a,b,c]){data.p.push(...v);data.n.push(...normal);data.uv.push(0,0);}
    data.i.push(start,start+1,start+2);
  }
  function quad(name,a,b,c,d){
    const n=cross(vector(b,a),vector(c,a));
    if(['grass','grassLight','water','waterLight','path','pathLight','bank'].includes(name)&&n[1]<0){tri(name,a,d,c);tri(name,a,c,b);}
    else {tri(name,a,b,c);tri(name,a,c,d);}
  }
  function box(name,c,s){
    const [x,y,z]=c,[w,h,d]=s,lo=[x-w/2,y-h/2,z-d/2],hi=[x+w/2,y+h/2,z+d/2];
    const p=(X,Y,Z)=>[X?hi[0]:lo[0],Y?hi[1]:lo[1],Z?hi[2]:lo[2]];
    quad(name,p(0,0,1),p(1,0,1),p(1,1,1),p(0,1,1));
    quad(name,p(1,0,0),p(0,0,0),p(0,1,0),p(1,1,0));
    quad(name,p(0,0,0),p(0,0,1),p(0,1,1),p(0,1,0));
    quad(name,p(1,0,1),p(1,0,0),p(1,1,0),p(1,1,1));
    quad(name,p(0,1,1),p(1,1,1),p(1,1,0),p(0,1,0));
    quad(name,p(0,0,0),p(1,0,0),p(1,0,1),p(0,0,1));
  }
  function ellipsoid(name,c,r,lat=6,lon=9){
    for(let j=0;j<lat;j++){
      const t0=-Math.PI/2+j*Math.PI/lat,t1=-Math.PI/2+(j+1)*Math.PI/lat;
      for(let k=0;k<lon;k++){
        const p0=k*2*Math.PI/lon,p1=(k+1)*2*Math.PI/lon;
        const at=(t,p)=>[c[0]+r[0]*Math.cos(t)*Math.cos(p),c[1]+r[1]*Math.sin(t),c[2]+r[2]*Math.cos(t)*Math.sin(p)];
        quad(name,at(t0,p0),at(t1,p0),at(t1,p1),at(t0,p1));
      }
    }
  }
  function rod(name,a,b,r0,r1=r0,sides=7){
    const dir=unit(vector(b,a));let across=unit(cross(dir,[0,0,1]));
    if(Math.hypot(...across)<.01)across=[1,0,0];
    const other=unit(cross(dir,across));
    const ring=(c,r,t)=>[c[0]+r*(Math.cos(t)*across[0]+Math.sin(t)*other[0]),c[1]+r*(Math.cos(t)*across[1]+Math.sin(t)*other[1]),c[2]+r*(Math.cos(t)*across[2]+Math.sin(t)*other[2])];
    for(let i=0;i<sides;i++){const t=i*2*Math.PI/sides,u=(i+1)*2*Math.PI/sides;
      quad(name,ring(a,r0,t),ring(a,r0,u),ring(b,r1,u),ring(b,r1,t));
    }
  }
  return {batches,tri,quad,box,ellipsoid,rod};
}
function buildPastoral(){
  const g=geometryBuilder(),rnd=seeded(20261120);
  // One continuous ground; river, banks, bridge and path are distinct native surfaces.
  for(let x=-13;x<13;x+=1)for(let z=-24;z<10;z+=1){
    const p=(X,Z)=>[X,ground(X,Z),Z];
    g.quad(Math.sin(x*.8+z*.6)>0?'grassLight':'grass',p(x,z),p(x+1,z),p(x+1,z+1),p(x,z+1));
  }
  const riverZ=x=>-7.0+.63*Math.sin(x*.23);
  for(let x=-13;x<13;x+=.50){
    const z=riverZ(x),q=riverZ(x+.50);
    g.quad('water',[x,.14,z-1.14],[x+.5,.14,q-1.14],[x+.5,.14,q+1.14],[x,.14,z+1.14]);
    for(const side of [-1,1])g.quad('bank',
      [x,ground(x,z+side*1.22)+.024,z+side*1.22],
      [x+.5,ground(x+.5,q+side*1.22)+.024,q+side*1.22],
      [x+.5,ground(x+.5,q+side*1.53)+.026,q+side*1.53],
      [x,ground(x,z+side*1.53)+.026,z+side*1.53]);
    if(Math.round(x*2)%7===0)g.quad('waterLight',[x,.153,z-.7],[x+.25,.153,q-.7],[x+.28,.153,q-.63],[x,.153,z-.63]);
  }
  // The walkway is interrupted by a raised wooden footbridge at the crossing.
  for(let z=-23;z<8;z+=.42){
    if(z>-8.8&&z< -5.0)continue;
    const cx=.72+.34*Math.sin(z*.20),next=.72+.34*Math.sin((z+.42)*.20);
    const y=ground(cx,z)+.04,yn=ground(next,z+.42)+.04;
    g.quad('path',[cx-1.10,y,z],[cx+1.10,y,z],[next+1.10,yn,z+.42],[next-1.10,yn,z+.42]);
    if(Math.floor((z+23)*2)%5===0)g.quad('pathLight',[cx-.5,y+.012,z],[cx+.4,y+.012,z],[next+.4,yn+.012,z+.11],[next-.5,yn+.012,z+.11]);
  }
  for(let z=-9.25;z<-4.62;z+=.38){
    g.box('bridgeLight',[.92,.32,z],[2.80,.24,.32]);
  }
  for(const s of [-1,1]){
    for(let z=-9.3;z<=-4.45;z+=1.15){
      const x=.92+s*1.42;
      g.rod('bridge',[x,.20,z],[x,1.27,z],.085,.069);
    }
    g.rod('bridge',[.92+s*1.42,.95,-9.2],[.92+s*1.42,.95,-4.55],.063);
  }
  // Approach fences: open paths, no artificial rectangular stage border.
  for(const side of [-1,1]){
    for(let z=-3.7;z<7.6;z+=1.44){
      const x=.72+.34*Math.sin(z*.2)+side*2.1;
      g.rod('bridge',[x,ground(x,z),z],[x,ground(x,z)+1.02,z],.075,.065);
    }
    for(let z=-3.65;z<6.7;z+=1.44){
      const x=.72+.34*Math.sin(z*.2)+side*2.1,zz=z+1.44;
      const xx=.72+.34*Math.sin(zz*.2)+side*2.1;
      for(const h of [.48,.83])g.rod('bridgeLight',[x,ground(x,z)+h,z],[xx,ground(xx,zz)+h,zz],.038);
    }
  }
  // Orchard on either side; tree canopies, flowers and fruit are actual geometry.
  const locations=[[-10,-3],[-8,-12],[-11,-18],[-5,-16],[-6,2],
    [7,-11],[10,-15],[6,4],[11,1],[8,-21],[3,-19],[-11,6]];
  for(let t=0;t<locations.length;t++){
    const [x,z]=locations[t],y=ground(x,z),h=2.45+1.2*rnd();
    g.rod('bark',[x,y,z],[x+.12,y+h,z],.24,.12,9);
    for(let j=0;j<4;j++){
      const angle=(j/4)*Math.PI*2+0.45,xx=x+Math.cos(angle)*1.10,zz=z+Math.sin(angle)*.92;
      g.rod('bark',[x+.08,y+h*.68,z],[xx,y+h*.96,zz],.11,.046);
      g.ellipsoid((t+j)%4===0?'blossom':'leaves',[xx,y+h+(.15*j),zz],[1.05,.87,.89],5,9);
    }
    g.ellipsoid(t%3===0?'blossomLight':'leavesLight',[x+.13,y+h+.46,z],[1.25,1.03,1.1],6,10);
    for(let f=0;f<4;f++){
      const angle=f*1.93+t*.42;
      const xx=x+Math.cos(angle)*.9,zz=z+Math.sin(angle)*.74;
      g.ellipsoid(f%3===0?'fruitGold':'fruit',[xx,y+h+.15+Math.sin(angle)*.27,zz],[.14,.17,.14],4,7);
    }
  }
  // Wildflower banks, clumps and gold/white/pink blossoms.
  for(let k=0;k<95;k++){
    let x=-12+24*rnd(),z=-18+25*rnd(),y=ground(x,z);
    if(Math.abs(x-.72)<1.8||Math.abs(z-riverZ(x))<1.8)continue;
    const height=.26+.28*rnd(),col=k%4===0?'blossom':k%4===1?'blossomLight':k%4===2?'flowerWhite':'flowerGold';
    g.rod('grassDeep',[x,y,z],[x+.05,y+height,z],.022,.011,5);
    const cy=y+height;
    for(let i=0;i<5;i++){
      const a=i*2*Math.PI/5;
      g.ellipsoid(col,[x+Math.cos(a)*.085,cy,z+Math.sin(a)*.085],[.078,.035,.078],3,5);
    }
    g.ellipsoid('flowerGold',[x,cy+.026,z],[.038,.041,.038],3,5);
  }
  // Low rolling distant ridges, in native depth rather than a picture-plane facade.
  for(let k=0;k<16;k++){
    const x=-15+k*2.1,y=ground(x,-22);
    g.ellipsoid(k%3===0?'hill':'grassDeep',[x,y-.65,-24.0],[2.65,2.2+(k%5)*.2,4.4],6,9);
  }
  return g.batches;
}
function typed(v,Type,label,max=4000000){
  if(!(v instanceof Type)||v.length===0||v.length>max)throw new TypeError(label+'_INVALID');
  if(Type===Float32Array)for(const n of v)if(!finite(n))throw new TypeError(label+'_NONFINITE');
  return v;
}
function bounds(positions){
  const lo=[Infinity,Infinity,Infinity],hi=[-Infinity,-Infinity,-Infinity];
  for(let i=0;i<positions.length;i+=3)for(let k=0;k<3;k++){
    lo[k]=Math.min(lo[k],positions[i+k]);hi[k]=Math.max(hi[k],positions[i+k]);
  }
  const center=lo.map((v,i)=>(v+hi[i])/2);
  let radius=0;
  for(let i=0;i<positions.length;i+=3)radius=Math.max(radius,Math.hypot(positions[i]-center[0],positions[i+1]-center[1],positions[i+2]-center[2]));
  return {center,radius:radius+.01,lo,hi};
}
function createPrivateRabbit(device,library,scene,data){
  if(!data||data.schema!=='PRIVATE_A4_M13_17_FRAME_BINDING_V1')throw Error('PRIVATE_RABBIT_CONTRACT_REQUIRED');
  if(!Array.isArray(data.frames)||data.frames.length!==17||!Array.isArray(data.normalFrames)||data.normalFrames.length!==17)
    throw Error('PRIVATE_A4_EXACT_17_FRAMES_REQUIRED');
  const p=typed(data.frames[0],Float32Array,'A4_POSITIONS'),n=typed(data.normalFrames[0],Float32Array,'A4_NORMALS');
  const vertexCount=p.length/3;
  if(!Number.isInteger(vertexCount)||vertexCount<3||n.length!==p.length)throw Error('PRIVATE_A4_TOPOLOGY_INVALID');
  const uv=typed(data.uvs,Float32Array,'A4_UV'),indices=typed(data.indices,Uint16Array,'A4_INDICES');
  if(uv.length!==vertexCount*2||indices.length%3)throw Error('PRIVATE_A4_ATTRIBUTE_COUNTS_INVALID');
  if([...indices].some(v=>v>=vertexCount))throw Error('PRIVATE_A4_INDEX_OUT_OF_RANGE');
  for(let i=0;i<17;i++){
    if(typed(data.frames[i],Float32Array,'A4_FRAME').length!==p.length||
      typed(data.normalFrames[i],Float32Array,'A4_NORMAL_FRAME').length!==n.length)throw Error('PRIVATE_A4_FRAME_TOPOLOGY_DRIFT');
  }
  const atlas=data.coatAtlas;
  if(!atlas||!Number.isSafeInteger(atlas.width)||!Number.isSafeInteger(atlas.height)||atlas.width<1||atlas.height<1)
    throw Error('PRIVATE_A4_COAT_REQUIRED');
  typed(atlas.pixels,Uint8Array,'A4_COAT_RGBA8',16000000);
  if(atlas.pixels.length!==atlas.width*atlas.height*4)throw Error('PRIVATE_A4_COAT_BYTES_INVALID');
  // Memory-only injection: no private URL, fetch, file upload, logging or persistence.
  const texture=library.createTexture2D({width:atlas.width,height:atlas.height,pixels:atlas.pixels,filter:'LINEAR'});
  const material=library.createMaterial({kind:'TEXTURED',texture,baseColor:[1,1,1,1]});
  const mesh=device.createMesh({vertexCount,indices,attributes:[
    {name:'aPosition',size:3,data:p,dynamic:true},
    {name:'aNormal',size:3,data:n,dynamic:true},
    {name:'aUV',size:2,data:uv}
  ]});
  const range=bounds(p),height=range.hi[1]-range.lo[1];
  if(height<.01||height>1000)throw Error('PRIVATE_A4_HEIGHT_INVALID');
  const s=2.15/height,footY=ground(5.1,-1.4);
  const node=scene.createNode({position:[5.1-range.center[0]*s,footY-range.lo[1]*s,-1.4-range.center[2]*s],scale:[s,s,s]});
  const initial=library.makeDrawBinding(material,{modelMatrix:ID,modelViewProjection:ID});
  scene.setRenderable(node,{mesh,program:initial.program,bounds:{center:range.center,radius:range.radius},cull:'NONE'});
  function frame(i){const k=clamp(Math.round(i),0,16);device.updateMeshAttribute(mesh,'aPosition',data.frames[k]);device.updateMeshAttribute(mesh,'aNormal',data.normalFrames[k]);}
  return {material,mesh,node,frame,descriptor:'PRIVATE_IN_MEMORY_A4_ONLY_UNVERIFIED_ART'};
}
export function createHarvestScene(canvas,{backend='AUTO',reducedMotion=false,onStatus=()=>{}}={}){
  if(!canvas||typeof canvas.getContext!=='function'||!['AUTO','WEBGL1','WEBGL2'].includes(backend)||typeof onStatus!=='function')
    throw new TypeError('HARVEST_OPTIONS_INVALID');
  let device;
  if(backend==='AUTO'){try{device=createNativeWebGLDevice(canvas,{backend:'WEBGL2'});}catch{device=createNativeWebGLDevice(canvas,{backend:'WEBGL1'});}}
  else device=createNativeWebGLDevice(canvas,{backend});
  const pipeline=createNativeFramePipeline(device),scene=createNativeSpatialScene(),library=createNativeMaterialLibrary(device);
  const camera=scene.createCamera({position:[0,4.5,18.8],rotation:[Math.sin(-.10),0,0,Math.cos(-.10)],fovY:.91,near:.1,far:110,aspect:16/9});
  const materials=new Map(),renderMaterials=new Map();
  const batches=buildPastoral();
  for(const [key,b] of batches){
    if(!b.i.length)continue;
    if(b.p.length/3>65535)throw Error('HARVEST_BATCH_WEBGL1_VERTEX_BUDGET_EXCEEDED_'+key);
    const mesh=device.createMesh({vertexCount:b.p.length/3,indices:new Uint16Array(b.i),attributes:[
      {name:'aPosition',size:3,data:new Float32Array(b.p)},
      {name:'aNormal',size:3,data:new Float32Array(b.n)}
    ]});
    const material=library.createMaterial({kind:'LIT',baseColor:PALETTE[key],light:{
      direction:[-.45,.88,.45],ambient:.49,intensity:.60,color:[1,.94,.82]
    }});
    const initial=library.makeDrawBinding(material,{modelMatrix:ID,modelViewProjection:ID});
    const node=scene.createNode(),range=bounds(b.p);
    scene.setRenderable(node,{mesh,program:initial.program,bounds:{center:range.center,radius:range.radius},cull:'NONE'});
    materials.set(node,material);
    renderMaterials.set(mesh,material);
  }
  // Separate first-party native bird meshes; reversible motion never writes world source.
  const birds=[];
  for(let k=0;k<3;k++){
    const g=geometryBuilder(),size=.25+k*.06;
    g.tri('wings',[0,0,0],[-size,.09,-.11],[-size*1.75,.02,.14]);
    g.tri('wings',[0,0,0],[size,.09,-.11],[size*1.75,.02,.14]);
    const b=g.batches.get('wings');
    const mesh=device.createMesh({vertexCount:b.p.length/3,indices:new Uint16Array(b.i),attributes:[
      {name:'aPosition',size:3,data:new Float32Array(b.p)},
      {name:'aNormal',size:3,data:new Float32Array(b.n)}
    ]});
    const material=library.createMaterial({kind:'UNLIT',baseColor:PALETTE.wings});
    const initial=library.makeDrawBinding(material,{modelMatrix:ID,modelViewProjection:ID});
    const node=scene.createNode({position:[-4.5+k*1.05,4.0+k*.32,-14.0-k*.5]});
    scene.setRenderable(node,{mesh,program:initial.program,bounds:{center:[0,0,0],radius:1},cull:'NONE'});
    materials.set(node,material);renderMaterials.set(mesh,material);birds.push(node);
  }
  let rabbit=null,disposed=false,playing=!reducedMotion,raf=0,last=0,time=0,frameNo=0,renderCount=0;
  function report(){onStatus({backend:device.backend,frames:renderCount,playing,privateRabbitAttached:Boolean(rabbit),artisticAcceptance:'HOLD'});}
  function resize(width,height,scale=1){
    if(disposed)throw Error('HARVEST_DISPOSED');
    if(!finite(width)||!finite(height)||width<1||height<1)throw Error('HARVEST_SIZE_INVALID');
    const w=Math.min(1920,Math.max(1,Math.round(width*clamp(scale,1,2))));
    const h=Math.min(1080,Math.max(1,Math.round(height*clamp(scale,1,2))));
    if(canvas.width!==w)canvas.width=w;if(canvas.height!==h)canvas.height=h;
    device.viewport(w,h);scene.setCamera(camera,{aspect:w/h});
    render();
  }
  function render(){
    if(disposed)return;
    const view=scene.collect(camera);
    pipeline.beginFrame({clear:{color:[.68,.79,.77,1],depth:1},depthMode:'TEST_WRITE',cull:'NONE'});
    for(const cmd of view.commands){
      const material=renderMaterials.get(cmd.mesh);
      if(!material)throw Error('HARVEST_MATERIAL_BINDING_MISSING');
      const draw=library.makeDrawBinding(material,{modelMatrix:cmd.modelMatrix,modelViewProjection:cmd.modelViewProjection});
      pipeline.submit({mesh:cmd.mesh,program:draw.program,first:cmd.first,count:cmd.count,pass:cmd.pass,cull:cmd.cull,
        beforeDraw:draw.beforeDraw,afterDraw:draw.afterDraw});
    }
    pipeline.endFrame();renderCount++;
  }
  function tick(now){
    if(disposed||!playing)return;
    const dt=last?Math.min(80,now-last):0;last=now;time+=dt;
    for(let k=0;k<birds.length;k++){
      const v=Math.sin(time*.0011+k*1.2);
      scene.setTransform(birds[k],{position:[-4.5+k*1.05+time*.00008,4+k*.32+v*.11,-14-k*.5],
        rotation:[0,0,Math.sin(v*.18),Math.cos(v*.18)]});
    }
    if(rabbit){
      const next=Math.floor(time/135)%17;
      if(next!==frameNo){rabbit.frame(next);frameNo=next;}
    }
    render();raf=requestAnimationFrame(tick);
  }
  function pause(){playing=false;cancelAnimationFrame(raf);last=0;report();}
  function play(){if(disposed)throw Error('HARVEST_DISPOSED');if(playing&&raf)return;playing=true;last=0;raf=requestAnimationFrame(tick);report();}
  function attachPrivateA4(data){
    if(disposed||rabbit)throw Error('HARVEST_PRIVATE_BINDING_NOT_AVAILABLE');
    const attachment=createPrivateRabbit(device,library,scene,data);
    rabbit=attachment;materials.set(attachment.node,attachment.material);renderMaterials.set(attachment.mesh,attachment.material);
    frameNo=0;render();report();
    return 'PRIVATE_A4_IN_MEMORY_BOUND_ARTISTIC_C1_HOLD';
  }
  function dispose(){if(disposed)return;pause();disposed=true;scene.dispose();library.dispose();device.dispose();}
  report();
  return Object.freeze({backend:device.backend,resize,render,pause,play,attachPrivateA4,dispose,
    status:()=>Object.freeze({backend:device.backend,playing,frames:renderCount,privateRabbitAttached:Boolean(rabbit),
      artisticAcceptance:'HOLD',sceneType:'NATIVE_PASTORAL_CONSTRUCTION_CANDIDATE',publicationAuthorized:false})});
}
