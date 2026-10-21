/** Deterministic local-metre foliage, constructed and admitted by the public kernel. */
import {constructHEarthTriangleMesh,admitHEarthPrimitiveRecord} from './geometry-kernel.js';
const add=(a,b)=>a.map((v,i)=>v+b[i]),sub=(a,b)=>a.map((v,i)=>v-b[i]),mul=(a,s)=>a.map(v=>v*s);
const cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
const unit=a=>mul(a,1/Math.hypot(...a));
const mesh=()=>({vertices:[],indices:[],colors:[]});
const vertex=(m,p,c)=>{m.vertices.push({x:p[0],y:p[1],z:p[2]});m.colors.push(c);return m.vertices.length-1;};
const face=(m,...v)=>m.indices.push(...v);
const tint=(c,s)=>c.map(v=>Math.max(0,Math.min(1,v*s)));
function hash(id,n){let h=2166136261;for(const c of `${id}:${n}`)h=Math.imul(h^c.charCodeAt(0),16777619);return(h>>>0)/4294967296;}

// A fixed reference for each complete stem avoids a frame flip between rings.
function stem(m,points,radius,color,sides=4){
 const tangents=points.map((_,i)=>unit(sub(points[Math.min(i+1,points.length-1)],points[Math.max(0,i-1)])));
 const axis=[0,1,2].sort((a,b)=>Math.max(...tangents.map(t=>Math.abs(t[a])))-Math.max(...tangents.map(t=>Math.abs(t[b]))))[0];
 const ref=[0,0,0];ref[axis]=1;
 const rings=points.map((p,k)=>{const u=unit(cross(tangents[k],ref)),v=cross(tangents[k],u),r=radius*(1-.55*k/(points.length-1));
  return Array.from({length:sides},(_,i)=>{const a=i*2*Math.PI/sides;return vertex(m,add(p,add(mul(u,r*Math.cos(a)),mul(v,r*Math.sin(a)))),tint(color,.92+.06*i));});});
 for(let k=1;k<rings.length;k++)for(let i=0;i<sides;i++){const j=(i+1)%sides;face(m,rings[k-1][i],rings[k-1][j],rings[k][i]);face(m,rings[k-1][j],rings[k][j],rings[k][i]);}
 for(let i=1;i<sides-1;i++){face(m,rings[0][0],rings[0][i+1],rings[0][i]);face(m,rings.at(-1)[0],rings.at(-1)[i],rings.at(-1)[i+1]);}
}

// Actual curved blade: shared left/midrib/right rows, pointed ends and a raised rib.
function blade(m,at,side,width,color,{segments=4,cup=.05,phase=0,roundness=.8}={}){
 const root=vertex(m,at(0),tint(color,.70)),tip=vertex(m,at(1),tint(color,1.04)),rows=[];
 for(let i=1;i<segments;i++){
  const t=i/segments,shape=Math.pow(Math.sin(Math.PI*t),roundness),p=at(t),w=width*shape*(1+.045*Math.sin(t*13+phase));
  const edgeLift=cup*shape,twist=.025*width*Math.sin(t*5+phase);
  rows.push([vertex(m,add(p,add(mul(side,-w),[0,edgeLift-twist,0])),tint(color,.88+.14*t)),
   vertex(m,add(p,[0,edgeLift+width*.12*shape,0]),tint(color,1.12)),
   vertex(m,add(p,add(mul(side,w),[0,edgeLift+twist,0])),tint(color,.92+.10*t))]);
 }
 face(m,root,rows[0][1],rows[0][0]);face(m,root,rows[0][2],rows[0][1]);
 for(let i=1;i<rows.length;i++)for(let j=0;j<2;j++){face(m,rows[i-1][j],rows[i-1][j+1],rows[i][j]);face(m,rows[i-1][j+1],rows[i][j+1],rows[i][j]);}
 face(m,...[rows.at(-1)[0],rows.at(-1)[1],tip]);face(m,...[rows.at(-1)[1],rows.at(-1)[2],tip]);
}

export function buildCavernUnderstoryPlant({id='CAVERN_UNDERSTORY',kind,scale=1,heading=0}={}){
 if(typeof id!=='string'||!id||!['groundcover','broadleaf','fern','flower'].includes(kind)||!Number.isFinite(scale)||scale<.25||scale>2||!Number.isFinite(heading))throw Error('UNDERSTORY_PARAMETERS_INVALID');
 const stems=mesh(),leaves=mesh(),flowers=mesh(),attachments=[];
 const rnd=n=>hash(id,n),green=[.20,.38,.12],stemColor=[.25,.34,.10];
 if(kind==='groundcover'||kind==='broadleaf'){
  const broad=kind==='broadleaf',count=broad?7:9;
  for(let i=0;i<count;i++){
   const a=i*2.3999632297+(rnd(i)-.5)*.24,d=[Math.cos(a),0,Math.sin(a)],side=[-d[2],0,d[0]];
   const length=(broad?.78:.48)*(.82+.22*rnd(20+i)),height=broad?.55+.45*rnd(40+i):.04+.05*rnd(40+i);
   const root=[0,.015+i*.004,0],base=add(mul(d,broad?.18:.055),[0,height,0]);
   stem(stems,[root,add(mul(d,broad?.07:.025),[0,height*.60,0]),base],broad?.018:.009,stemColor);
   const at=t=>add(base,add(mul(d,length*t),[0,(broad?.95:.30)*t-(broad?.45:.25)*t*t,0]));
   blade(leaves,at,side,broad?.21:.14,tint(green,.83+.34*rnd(60+i)),{cup:broad?.025:.012,phase:a,roundness:broad?.7:.65});
   attachments.push({kind:'LEAF',stemTip:base,leafRoot:at(0)});
  }
 }else if(kind==='fern'){
  for(let f=0;f<4;f++){
   const a=f*2.3999632297+(rnd(f)-.5)*.2,d=[Math.cos(a),0,Math.sin(a)],side=[-d[2],0,d[0]],length=.8+.13*rnd(10+f);
   const at=t=>add(mul(d,length*t),[0,.025+1.65*t-1.0*t*t,0]);
   const points=Array.from({length:7},(_,i)=>at(i/6));stem(stems,points,.013,stemColor);
   for(let k=1;k<=5;k++)for(const sign of [-1,1]){
    // Attach precisely at the rendered stem's ring, not between analytic samples.
    const t=k/6,root=points[k],reach=.27*Math.pow(Math.sin(Math.PI*t),.65),dir=unit(add(mul(side,sign),mul(d,.33)));
    const leafAt=u=>add(root,add(mul(dir,reach*u),[0,.055*Math.sin(Math.PI*u)-.045*u,0]));
    blade(leaves,leafAt,unit(cross([0,1,0],dir)),.045*(1-.35*t),tint(green,.88+.22*rnd(f*20+k)),{segments:2,cup:.008,roundness:.8});
    attachments.push({kind:'PINNA',stemTip:root,leafRoot:leafAt(0)});
   }
   const root=points[6];blade(leaves,t=>add(root,add(mul(d,.15*t),[0,-.04*t,0])),side,.035,green,{segments:2,cup:.004});
   attachments.push({kind:'TERMINAL_PINNA',stemTip:root,leafRoot:root});
  }
 }else{
  const top=[.08,.91,0],points=[[0,0,0],[.018,.30,0],[.045,.59,0],top];stem(stems,points,.015,stemColor,5);
  for(let i=1;i<=2;i++){
   const root=points[i],sign=i===1?-1:1,dir=[sign*.8,.3,.25],side=unit(cross([0,1,0],dir));
   const at=t=>add(root,add(mul(dir,.32*t),[0,.09*Math.sin(Math.PI*t),0]));blade(leaves,at,side,.105,green,{cup:.012});
   attachments.push({kind:'LEAF',stemTip:root,leafRoot:root});
  }
  // Five cupped petals share the central receptacle; upright enough to read on approach.
  const color=rnd(90)>.45?[.76,.12,.23]:[.88,.28,.43];
  for(let i=0;i<5;i++){
   const a=i*2*Math.PI/5+.15,d=[Math.cos(a),0,Math.sin(a)],side=[-d[2],0,d[0]];
   const at=t=>add(top,add(mul(d,.25*t),[0,.13*t-.10*t*t+.035*d[2]*t,0]));
   blade(flowers,at,side,.115,color,{segments:5,cup:.018,roundness:.55,phase:a});attachments.push({kind:'PETAL',stemTip:top,leafRoot:at(0)});
  }
  stem(stems,[top,add(top,[0,.13,0])],.016,[.81,.60,.16],5);
  // Small closed golden pollen head.
  stem(flowers,[add(top,[0,.12,0]),add(top,[0,.15,0])],.035,[.93,.73,.25],6);
 }
 const transform=p=>{const c=Math.cos(heading),s=Math.sin(heading);return [scale*(p[0]*c-p[2]*s),scale*p[1],scale*(p[0]*s+p[2]*c)];};
 const parts=[];
 for(const [part,m,leaflets,closure] of [['STEMS',stems,false,'CLOSED_REQUIRED'],['LEAVES',leaves,true,'OPEN_ALLOWED'],['FLOWERS',flowers,true,'OPEN_ALLOWED']]){
  if(!m.indices.length)continue;
  m.vertices=m.vertices.map(p=>{const q=transform([p.x,p.y,p.z]);return{x:q[0],y:q[1],z:q[2]};});
  const built=constructHEarthTriangleMesh({primitiveId:id+':'+part,vertices:m.vertices,indices:m.indices,expectedClosure:closure,semanticRole:'CAVERN_UNDERSTORY_'+part,attributes:{colors:m.colors},metadata:{authoringSpace:'LOCAL_METERS',kind,deterministic:true}});
  if(!built.valid)throw Error('UNDERSTORY_KERNEL_CONSTRUCTION:'+JSON.stringify(built.issues));
  const admitted=admitHEarthPrimitiveRecord(built.primitiveRecord);if(!admitted.valid)throw Error('UNDERSTORY_KERNEL_ADMISSION:'+JSON.stringify(admitted.issues));
  parts.push({part,geometry:admitted.geometry,leaflets});
 }
 const vertices=parts.flatMap(p=>p.geometry.vertices),bounds={min:[Infinity,Infinity,Infinity],max:[-Infinity,-Infinity,-Infinity]};
 for(const p of vertices)for(const [i,key] of ['x','y','z'].entries()){bounds.min[i]=Math.min(bounds.min[i],p[key]);bounds.max[i]=Math.max(bounds.max[i],p[key]);}
 return Object.freeze({id,kind,scale,heading,parts,triangleCount:parts.reduce((n,p)=>n+p.geometry.indices.length/3,0),bounds,attachments:attachments.map(a=>({...a,stemTip:transform(a.stemTip),leafRoot:transform(a.leafRoot)}))});
}
