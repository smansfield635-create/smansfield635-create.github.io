/** A08-only mature-tree presentation. Ecology envelopes remain with the caller. */
import {clearingLeafAtlasUV} from './woodland-clearing-trial.js';
export const H_EARTH_AGED_WOODLAND_TREE_ID='P2_TREE_A_08';
const SEED='AGED_WOODLAND_A08_20261021';
const hash=(id,c)=>{let h=2166136261;for(const q of `${SEED}:${id}:${c}`)h=Math.imul(h^q.charCodeAt(0),16777619);return(h>>>0)/4294967296;};
const add=(a,b)=>a.map((v,i)=>v+b[i]),sub=(a,b)=>a.map((v,i)=>v-b[i]),mul=(a,s)=>a.map(v=>v*s),mix=(a,b,t)=>a.map((v,i)=>v+(b[i]-v)*t);
const cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
const unit=a=>{const n=Math.hypot(...a);if(n<1e-9)throw Error('AGED_TREE_ZERO_DIRECTION');return mul(a,1/n);};
const onPath=(p,t)=>{const q=t*(p.length-1),i=Math.min(p.length-2,Math.floor(q));return mix(p[i],p[i+1],q-i);};
const face=(m,...v)=>m.indices.push(...v);
function prepare(m){if(!m.clearingAttributes)m.clearingAttributes=[];while(m.clearingAttributes.length<m.vertices.length)m.clearingAttributes.push([0,0,0]);}
function vertex(m,p,color,uv,type){const i=m.vertices.length;m.vertices.push({x:p[0],y:p[1],z:p[2]});m.colors.push(color.map((q,i)=>i===3?255:Math.max(0,Math.min(255,Math.round(q)))));m.clearingAttributes.push([...uv,type]);return i;}
function sweep(m,points,radii,sides,key,{basalRing=null}={}){
 const tangents=points.map((_,i)=>unit(sub(points[Math.min(points.length-1,i+1)],points[Math.max(0,i-1)])));
 const axis=[0,1,2].sort((a,b)=>Math.max(...tangents.map(t=>Math.abs(t[a])))-Math.max(...tangents.map(t=>Math.abs(t[b]))))[0],ref=[0,0,0];ref[axis]=1;
 const rings=points.map((p,k)=>{if(k===0&&basalRing)return basalRing;const u=unit(cross(tangents[k],ref)),v=cross(tangents[k],u);return Array.from({length:sides},(_,j)=>{
  const a=j*Math.PI*2/sides,r=radii[k]*(1+.075*Math.sin(j*2.7+hash(key,'ridge')*6.28)+.025*Math.sin(k+j)),shade=.82+.13*Math.cos(a-.5)+.07*hash(key,`${k}:${j}`);
  return vertex(m,add(p,add(mul(u,r*Math.cos(a)),mul(v,r*Math.sin(a)))),[99*shade,78*shade,52*shade,255],[j/sides,k/(points.length-1)],1);
 });});
 for(let k=1;k<rings.length;k++)for(let j=0;j<sides;j++){const n=(j+1)%sides;face(m,rings[k-1][j],rings[k-1][n],rings[k][j]);face(m,rings[k-1][n],rings[k][n],rings[k][j]);}
 for(let j=1;j<sides-1;j++){face(m,rings[0][0],rings[0][j+1],rings[0][j]);face(m,rings.at(-1)[0],rings.at(-1)[j],rings.at(-1)[j+1]);}
 return rings;
}
function supportedEdges(m,edges,ground){
 // Every lower contact edge is checked, including crossings between terrain
 // triangles; only its buried endpoints move when extra burial is needed.
 for(let pass=0;pass<3;pass++)for(const [ia,ib] of edges){const a=m.vertices[ia],b=m.vertices[ib];let shift=0;
  for(let k=0;k<=4;k++){const t=k/4,x=a.x+(b.x-a.x)*t,z=a.z+(b.z-a.z)*t,g=ground(x,z);if(!g)throw Error('AGED_TREE_ROOT_SUPPORT_MISSING');shift=Math.max(shift,a.y+(b.y-a.y)*t-g.y+.12);}
  if(shift>0){a.y-=shift;b.y-=shift;}
 }
 return edges.flatMap(([ia,ib])=>Array.from({length:5},(_,k)=>{const t=k/4,a=m.vertices[ia],b=m.vertices[ib],x=a.x+(b.x-a.x)*t,z=a.z+(b.z-a.z)*t,g=ground(x,z),meshY=a.y+(b.y-a.y)*t;return{x,z,surfaceY:g.y,meshY,groundTriangle:g.triangle,burial:g.y-meshY,edge:[ia,ib],t};}));
}
function leaf(m,root,direction,width,length,color){
 const d=unit(direction),side=unit(cross(d,Math.abs(d[1])<.9?[0,1,0]:[1,0,0])),normal=unit(cross(side,d));
 // Same FULLER_SINGLE_LEAF proportions and atlas as the retained clearing trees.
 const l=length/1.35,w=width*1.35,mid=add(root,mul(d,l*.47)),start=m.vertices.length;
 const points=[root,add(root,mul(d,l)),add(mid,add(mul(side,w),mul(normal,.020))),add(mid,add(mul(side,-w),mul(normal,.020)))];
 const uv=[[0,.5],[1,.5],[.47,0],[.47,1]];
 points.forEach((p,i)=>vertex(m,p,color,[clearingLeafAtlasUV(uv[i][0],'FULLER_SINGLE_LEAF'),uv[i][1]],2));
 face(m,start,start+1,start+2);face(m,start,start+3,start+1);
}
export function appendHEarthAgedWoodlandTree({bark,foliage,p,ground}){
 if(p?.id!==H_EARTH_AGED_WOODLAND_TREE_ID||typeof ground!=='function')throw Error('AGED_TREE_SCOPE_REQUIRED');
 prepare(bark);prepare(foliage);
 const {id,x,z,anchor}=p,y=anchor.y,barkStart=bark.vertices.length,leafStart=foliage.vertices.length,indexBefore=bark.indices.length+foliage.indices.length;
 const contactEdges=[],roots=[],rootRing=[];
 for(let j=0;j<12;j++){const a=j*Math.PI/6,r=.88*(1+.13*Math.sin(j*2.2)),xx=x+Math.cos(a)*r,zz=z+Math.sin(a)*r,g=ground(xx,zz);if(!g)throw Error('AGED_TREE_ROOT_SUPPORT_MISSING');rootRing.push(vertex(bark,[xx,g.y-.14,zz],[91,72,48,255],[j/12,0],1));}
 for(let j=0;j<12;j++)contactEdges.push([rootRing[j],rootRing[(j+1)%12]]);
 for(let j=2;j<11;j++)contactEdges.push([rootRing[0],rootRing[j]]);
 const trunk=[[x,y,z],[x+.07,y+1.1,z-.04],[x+.16,y+2.3,z+.03],[x+.10,y+3.45,z+.12],[x-.12,y+4.7,z+.18],[x-.31,y+6.4,z+.05],[x-.18,y+8.4,z-.18],[x+.10,y+10.5,z-.26],[x+.24,y+12.45,z-.12]];
 sweep(bark,trunk,[.88,.71,.62,.55,.46,.34,.23,.13,.035],12,id+':trunk',{basalRing:rootRing});
 const rootIndexStart=bark.indices.length;
 for(let n=0;n<6;n++){
  const a=n*Math.PI/3+.13*Math.sin(n*2),d=[Math.cos(a),0,Math.sin(a)],side=[-d[2],0,d[0]],reach=1.55+.25*hash(id,'root'+n),rings=[];
  for(let k=0;k<5;k++){
   const t=k/4,c=add([x,0,z],add(mul(d,.26+(reach-.26)*t),mul(side,.10*Math.sin(t*Math.PI)))),w=.25*(1-t)+.045,ring=[];
   for(const sign of [-1,1]){const q=add(c,mul(side,w*sign)),g=ground(q[0],q[2]);if(!g)throw Error('AGED_TREE_ROOT_SUPPORT_MISSING');ring.push(vertex(bark,[q[0],g.y-.14,q[2]],[91,72,48,255],[sign===1?1:0,t],1));}
   const g=ground(c[0],c[2]);if(!g)throw Error('AGED_TREE_ROOT_SUPPORT_MISSING');ring.push(vertex(bark,[c[0],g.y+.06+.98*Math.pow(1-t,1.7),c[2]],[102,80,53,255],[.5,t],1));rings.push(ring);
  }
  for(let k=1;k<rings.length;k++)for(let j=0;j<3;j++){const next=(j+1)%3;face(bark,rings[k-1][j],rings[k-1][next],rings[k][j]);face(bark,rings[k-1][next],rings[k][next],rings[k][j]);}
  face(bark,rings[0][0],rings[0][2],rings[0][1]);face(bark,...rings.at(-1));
  for(let k=1;k<rings.length;k++){for(const j of [0,1])contactEdges.push([rings[k-1][j],rings[k][j]]);contactEdges.push([rings[k-1][1],rings[k][0]]);}
  for(const ring of rings)contactEdges.push([ring[0],ring[1]]);
  roots.push({id:n,reach,lowerEdgeIndices:rings.map(r=>r.slice(0,2)),crestIndices:rings.map(r=>r[2])});
 }
 for(let i=rootIndexStart;i<bark.indices.length;i+=3){const a=bark.indices[i+1];bark.indices[i+1]=bark.indices[i+2];bark.indices[i+2]=a;}
 const witnesses=supportedEdges(bark,contactEdges,ground),primaryPaths=[],secondaryPaths=[],twigPaths=[],leafPaths=[];
 // The western neighbors already lean toward A08: shift the visual crown east
 // and trim its western reach, independently of the unchanged ecology radius.
 const limit=q=>{const cx=x+.55,r=Math.hypot((q[0]-cx)/4.45,(q[2]-z)/4.65);if(r>1){q[0]=cx+(q[0]-cx)/r;q[2]=z+(q[2]-z)/r;}return q;};
 for(let j=0;j<5;j++){
  const a=j*Math.PI*2/5+.19+(.12*hash(id,'heading'+j)),d=[Math.cos(a),0,Math.sin(a)],side=[-d[2],0,d[0]],h=3.15+j*.15;
  const segment=trunk.findIndex((q,k)=>k<trunk.length-1&&q[1]<=y+h&&trunk[k+1][1]>=y+h),base=mix(trunk[segment],trunk[segment+1],(y+h-trunk[segment][1])/(trunk[segment+1][1]-trunk[segment][1])),reach=3.4+.55*hash(id,'reach'+j),tipY=[8.2,9.4,10.55,8.65,9.65][j];
  const path=[base,add(base,add(mul(d,.70),[0,.32,0])),[x+d[0]*1.65+side[0]*.22,y+h+1.1,z+d[2]*1.65+side[2]*.22],[x+d[0]*2.55+side[0]*.32,y+h+2.7,z+d[2]*2.55+side[2]*.32],[x+d[0]*reach,y+tipY-.7,z+d[2]*reach],[x+d[0]*(reach+.18),y+tipY,z+d[2]*(reach+.18)]];
  path.forEach(limit);
  sweep(bark,path,[.37,.33,.27,.18,.09,.022],8,id+':primary'+j);primaryPaths.push(path);leafPaths.push({path,count:30,start:.72,key:'primary'+j});
  for(let k=0;k<3;k++){
   const root=onPath(path,.48+k*.18),angle=a+(k-1)*.80+.15,dir=[Math.cos(angle),0,Math.sin(angle)],end=limit(add(root,[dir[0]*(1.15+k*.12),.75+.18*k,dir[2]*(1.15+k*.12)]));
   const branch=[root,add(mix(root,end,.34),[0,.17,0]),add(mix(root,end,.72),[0,.13,0]),end];
   sweep(bark,branch,[.12-.018*k,.075,.038,.009],5,id+':secondary'+j+':'+k);secondaryPaths.push(branch);leafPaths.push({path:branch,count:60,start:.14,key:`secondary${j}:${k}`});
   for(let n=0;n<3;n++){
    const base=onPath(branch,.30+n*.27),angle2=angle+(n-1)*1.05,rad=.65+.16*hash(id,`twig${j}:${k}:${n}`),tip=limit(add(base,[Math.cos(angle2)*rad,.25+(n===1?.32:-.10),Math.sin(angle2)*rad]));
    const twig=[base,add(mix(base,tip,.55),[0,.09,0]),tip];sweep(bark,twig,[.030,.015,.004],4,id+':twig'+j+':'+k+':'+n);twigPaths.push(twig);leafPaths.push({path:twig,count:40,start:.05,key:`twig${j}:${k}:${n}`});
   }
  }
 }
 // A small irregular upper tier connects the domed crown to its retained leader.
 leafPaths.push({path:trunk.slice(-3),count:90,start:.05,key:'leader'});
 let leafCount=0;
 for(const {path,count,start,key} of leafPaths)for(let n=0;n<count;n++){
  const channel=key+':'+n,t=start+(1-start)*(n+.25+.45*hash(id,channel+'t'))/count,root=onPath(path,t),tangent=unit(sub(path.at(-1),path[0])),u=unit(cross(tangent,Math.abs(tangent[1])<.9?[0,1,0]:[1,0,0])),v=cross(tangent,u),roll=hash(id,channel+'roll')*Math.PI*2,spread=add(mul(u,Math.cos(roll)),mul(v,Math.sin(roll)));
  const direction=add(mul(tangent,.16+.15*hash(id,channel+'forward')),add(mul(spread,.90),[0,-.16+.38*hash(id,channel+'lift'),0])),shade=hash(id,channel+'tint');
  leaf(foliage,root,direction,.105+.075*hash(id,channel+'width'),.38+.22*hash(id,channel+'length'),[46+shade*29,75+shade*35,24+shade*20,255]);leafCount++;
 }
 const triangleCount=(bark.indices.length+foliage.indices.length-indexBefore)/3;
 if(triangleCount>9000)throw Error('AGED_TREE_TRIANGLE_BUDGET:'+triangleCount);
 const points=[...bark.vertices.slice(barkStart),...foliage.vertices.slice(leafStart)],lo=['x','y','z'].map(k=>Math.min(...points.map(v=>v[k]))),hi=['x','y','z'].map(k=>Math.max(...points.map(v=>v[k])));
 for(const root of roots){root.lowerEdgeIndices=root.lowerEdgeIndices.map(pair=>pair.map(i=>i-barkStart));root.crestIndices=root.crestIndices.map(i=>i-barkStart);}
 for(const witness of witnesses)witness.edge=witness.edge.map(i=>i-barkStart);
 return {support:{indexSpace:'TREE_LOCAL_BARK_VERTICES',minimumBurial:.12,minimumMeasuredBurial:Math.min(...witnesses.map(w=>w.burial)),downwardShift:0,witnesses,contactEdges:contactEdges.map(pair=>pair.map(i=>i-barkStart)),rootRing:rootRing.map(i=>i-barkStart)},visualTree:{schema:'H_EARTH_AGED_TREE_A08_v1',recipe:'AGED_CURVED_FORKED_DOME_v1',seed:SEED,crownEnvelope:{centerX:x+.55,centerZ:z,radiusX:4.45,radiusZ:4.65,westernNeighborBias:true},leafStyle:'FULLER_SINGLE_LEAF',leafCount,triangleCount,visualHeight:hi[1]-y,crownSpanX:hi[0]-lo[0],crownSpanZ:hi[2]-lo[2],bounds:{min:lo,max:hi},roots,structure:{trunk,primaryPaths,secondaryPaths,twigPaths},perFrameGeneration:false,ecologyEnvelopeChanged:false}};
}
