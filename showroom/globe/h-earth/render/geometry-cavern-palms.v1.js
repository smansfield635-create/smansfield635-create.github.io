/** Standalone authoring-space palm. Runtime placement is a separate checkpoint. */
import {constructHEarthTriangleMesh, admitHEarthPrimitiveRecord} from './geometry-kernel.js';

const add=(a,b)=>a.map((v,i)=>v+b[i]);
const mul=(a,s)=>a.map(v=>v*s);
const sub=(a,b)=>a.map((v,i)=>v-b[i]);
const cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
const unit=a=>mul(a,1/Math.hypot(...a));
const mesh=()=>({vertices:[],indices:[],colors:[]});
function vertex(m,p,color){m.vertices.push({x:p[0],y:p[1],z:p[2]});m.colors.push(color);return m.vertices.length-1;}
const face=(m,a,b,c)=>m.indices.push(a,b,c);
function noise(id,n){let h=2166136261;for(const c of `${id}:${n}`)h=Math.imul(h^c.charCodeAt(0),16777619);return(h>>>0)/4294967296;}

// Tangent-aligned rings with shared vertices; caps preserve a closed manifold.
function sweep(m,points,radii,sides,color){
 const rings=[];
 const tangents=points.map((_,k)=>unit(sub(points[Math.min(k+1,points.length-1)],points[Math.max(0,k-1)])));
 // One axis per sweep avoids a discontinuous frame switch mid-trunk.
 const axis=[0,1,2].sort((a,b)=>Math.max(...tangents.map(t=>Math.abs(t[a])))-Math.max(...tangents.map(t=>Math.abs(t[b]))))[0];
 const reference=[0,0,0];reference[axis]=1;
 for(let k=0;k<points.length;k++){
  const t=tangents[k];
  const u=unit(cross(t,reference)),v=cross(t,u),ring=[];
  for(let j=0;j<sides;j++){
   const a=j*2*Math.PI/sides;
   const p=add(points[k],add(mul(u,Math.cos(a)*radii[k]),mul(v,Math.sin(a)*radii[k])));
   const shade=.87+.10*Math.sin(k*2.1)+.03*Math.cos(j*3);
   ring.push(vertex(m,p,color.map(q=>q*shade)));
  }
  rings.push(ring);
 }
 for(let k=0;k<rings.length-1;k++)for(let j=0;j<sides;j++){
  const n=(j+1)%sides,a=rings[k][j],b=rings[k][n],c=rings[k+1][j],d=rings[k+1][n];
  face(m,a,b,c);face(m,b,d,c);
 }
 const first=rings[0],last=rings.at(-1);
 for(let j=1;j<sides-1;j++){face(m,first[0],first[j+1],first[j]);face(m,last[0],last[j],last[j+1]);}
}
function admit(id,m,closure,role){
 const built=constructHEarthTriangleMesh({primitiveId:id,vertices:m.vertices,indices:m.indices,expectedClosure:closure,
  semanticRole:role,attributes:{colors:m.colors},metadata:{palmPrototype:true,authoringSpace:'LOCAL_METERS'}});
 if(!built.valid)throw new Error(`PALM_KERNEL_CONSTRUCTION:${id}:${JSON.stringify(built.issues)}`);
 const result=admitHEarthPrimitiveRecord(built.primitiveRecord);
 if(!result.valid)throw new Error(`PALM_KERNEL_ADMISSION:${id}:${JSON.stringify(result.issues)}`);
 return result;
}

export function buildCavernPalm({id='CAVERN_PALM_PROTOTYPE',height=7,lean=2.1,heading=0,radius=.30,frondLength=3.4}={}){
 if(typeof id!=='string'||!id.length||![height,lean,heading,radius,frondLength].every(Number.isFinite)||height<3||height>12||Math.abs(lean)>height*.6||radius<.15||radius>.6||frondLength<1.5||frondLength>5)throw new Error('PALM_PARAMETERS_INVALID');
 const bark=mesh(),stems=mesh(),leaves=mesh();
 const inward=[Math.cos(heading),0,Math.sin(heading)];
 const trunkPoint=t=>add(mul(inward,lean*t*t),[0,height*t,0]);
 const points=[],radii=[];
 // Alternating narrow ridges form actual ring relief, not painted stripes.
 for(let i=0;i<=96;i++){
  const t=i/96;points.push(trunkPoint(t));
  radii.push(radius*(1-.30*t)*(1+.20*Math.exp(-t*18))*(i%3===1?1.07:1));
 }
 sweep(bark,points,radii,16,[.40,.29,.18]);
 const crown=trunkPoint(1),fronds=[];
 for(let f=0;f<15;f++){
  const tier=Math.floor(f/5),a=f*2.3999632297+(noise(id,f)-.5)*.18;
  const d=[Math.cos(a),0,Math.sin(a)],side=[-Math.sin(a),0,Math.cos(a)];
  const length=frondLength*(tier===2?.73:1)*(.92+noise(id,100+f)*.16);
  const rise=[.75,1.65,2.65][tier],drop=[1.95,1.65,1.25][tier];
  const origin=add(crown,[0,(f%5)*.045,0]);
  const at=t=>add(origin,add(mul(d,length*t),[0,rise*t-drop*t*t,0]));
  const spine=Array.from({length:13},(_,i)=>at(i/12));
  sweep(stems,spine,spine.map((_,i)=>.038*(1-i/14)),5,[.38,.43,.13]);
  let leafletCount=0;
  for(let k=0;k<24;k++)for(const sign of [-1,1]){
   const t=.14+k*.034+(sign===1?.008:0),root=at(t);
   const reach=(.15+.68*Math.sin(Math.PI*t))*(length/3.4);
   const direction=unit(add(mul(side,sign),mul(d,.33)));
   const tip=add(root,add(mul(direction,reach),[0,-.20*reach,0]));
   const mid=add(root,mul(sub(tip,root),.48)),width=.045*(.65+Math.sin(Math.PI*t));
   const color=[.10+.035*noise(id,f*60+k),.25+.10*noise(id,f*70+k),.065];
   const base=vertex(leaves,root,color),end=vertex(leaves,tip,color);
   const left=vertex(leaves,add(mid,add(mul(d,width),[0,.035,0])),color);
   const right=vertex(leaves,add(mid,add(mul(d,-width),[0,.035,0])),color);
   face(leaves,base,end,left);face(leaves,base,right,end);leafletCount++;
  }
  fronds.push({index:f,tier,origin,tip:at(1),leafletCount});
 }
 // Short retained leaf bases give the crown/trunk junction a rough collar.
 for(let j=0;j<10;j++){
  const a=j*2.3999632297,d=[Math.cos(a),0,Math.sin(a)],p=trunkPoint(.94);
  sweep(bark,[add(p,mul(d,radius*.5)),add(p,add(mul(d,radius*1.55),[0,.28,0]))],[.085,.045],5,[.34,.23,.12]);
 }
 const parts=[admit(id+':TRUNK',bark,'CLOSED_REQUIRED','PALM_TRUNK'),admit(id+':RACHISES',stems,'CLOSED_REQUIRED','PALM_RACHISES'),admit(id+':LEAFLETS',leaves,'OPEN_ALLOWED','PALM_LEAFLETS')];
 return Object.freeze({id,parameters:{height,lean,heading,radius,frondLength},crown,fronds,parts,
  triangleCount:(bark.indices.length+stems.indices.length+leaves.indices.length)/3,
  leafletCount:fronds.reduce((n,f)=>n+f.leafletCount,0),runtimeIntegrated:false});
}
