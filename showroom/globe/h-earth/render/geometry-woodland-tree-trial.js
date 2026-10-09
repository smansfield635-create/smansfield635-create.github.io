/** Lightweight adaptation of the accepted opaque curved hierarchy.
 * Existing identities, basal ring and ecological envelope belong to the caller.
 * No textures, transparency, material attributes, placements or random stream.
 */
const SEED='WOODLAND_ALL_TREE_HIERARCHY_20261008';
const hash=(id,channel)=>{let h=2166136261;for(const c of `${SEED}:${id}:${channel}`)h=Math.imul(h^c.charCodeAt(0),16777619);return(h>>>0)/4294967296;};
const add=(a,b)=>a.map((q,i)=>q+b[i]),sub=(a,b)=>a.map((q,i)=>q-b[i]),scale=(a,t)=>a.map(q=>q*t),mix=(a,b,t)=>a.map((q,i)=>q+(b[i]-q)*t);
const unit=a=>{const length=Math.hypot(...a);if(length<1e-10)throw new Error('WOODLAND_VARIATION_ZERO_DIRECTION');return a.map(q=>q/length);};
const cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
const vertex=(m,p,c)=>{m.vertices.push({x:p[0],y:p[1],z:p[2]});m.colors.push(c.map((q,i)=>i===3?255:Math.max(0,Math.min(255,Math.round(q)))));return m.vertices.length-1;};
const face=(m,a,b,c)=>m.indices.push(a,b,c);
const onPath=(path,t)=>{const q=t*(path.length-1),i=Math.min(path.length-2,Math.floor(q));return mix(path[i],path[i+1],q-i);};
function sweep(m,points,radii,sides,color,key,retainedRing=null){
 const rings=[];
 for(let k=0;k<points.length;k++){
  if(k===0&&retainedRing){rings.push(retainedRing);continue;}
  const tangent=unit(sub(points[Math.min(k+1,points.length-1)],points[Math.max(0,k-1)]));
  let u;
  if(retainedRing){const first=m.vertices[retainedRing[0]],prior=sub([first.x,first.y,first.z],points[0]);u=unit(sub(prior,scale(tangent,prior.reduce((s,q,i)=>s+q*tangent[i],0))));}
  else u=unit(cross(tangent,Math.abs(tangent[1])<.9?[0,1,0]:[0,0,1]));
  const w=cross(tangent,u),ring=[];
  for(let j=0;j<sides;j++){
   const angle=j*Math.PI*2/sides,relief=1+.055*Math.sin(j*2.7+hash(key,'ridge')*6.28);
   const p=add(points[k],add(scale(u,radii[k]*relief*Math.cos(angle)),scale(w,radii[k]*relief*Math.sin(angle))));
   const tint=.82+.13*Math.cos(angle-.6)+.06*hash(key,`bark-${k}-${j}`);
   ring.push(vertex(m,p,color.map((q,i)=>i===3?q:q*tint)));
  }
  rings.push(ring);
 }
 for(let k=0;k<rings.length-1;k++)for(let j=0;j<sides;j++){const n=(j+1)%sides;face(m,rings[k][j],rings[k][n],rings[k+1][j]);face(m,rings[k][n],rings[k+1][n],rings[k+1][j]);}
 for(let j=1;j<sides-1;j++)face(m,rings[0][0],rings[0][j+1],rings[0][j]);
 const last=rings.at(-1);for(let j=1;j<sides-1;j++)face(m,last[0],last[j],last[j+1]);
}
// Closed shallow folded leaf, using the accepted four-vertex opaque recipe.
function leaf(m,root,direction,width,length,color){
 const d=unit(direction),side=unit(cross(d,Math.abs(d[1])<.9?[0,1,0]:[1,0,0])),normal=unit(cross(side,d));
 const middle=add(root,scale(d,length*.47)),start=m.vertices.length;
 for(const p of [root,add(root,scale(d,length)),add(middle,add(scale(side,width),scale(normal,.045))),add(middle,add(scale(side,-width),scale(normal,.045)))])vertex(m,p,color);
 face(m,start,start+1,start+2);face(m,start,start+3,start+1);face(m,start,start+2,start+3);face(m,start+1,start+3,start+2);
}
export function adaptHEarthWoodlandTreeHierarchy({bark,foliage,p,height,leanX,leanZ,barkVertexStart,barkIndexStart,canopyVertexStart,canopyIndexStart}){
 const {id,x,z,anchor,radius}=p,y=anchor.y;
 const oldVertices=bark.vertices.length-barkVertexStart+foliage.vertices.length-canopyVertexStart;
 const oldTriangles=(bark.indices.length-barkIndexStart+foliage.indices.length-canopyIndexStart)/3;
 const basal=bark.vertices.slice(barkVertexStart,barkVertexStart+6).map(v=>({...v})),basalColors=bark.colors.slice(barkVertexStart,barkVertexStart+6).map(c=>c.slice());
 if(basal.length!==6||basalColors.length!==6)throw new Error('WOODLAND_VARIATION_BASAL_RING_MISSING');
 bark.vertices.length=barkVertexStart;bark.colors.length=barkVertexStart;bark.indices.length=barkIndexStart;
 foliage.vertices.length=canopyVertexStart;foliage.colors.length=canopyVertexStart;foliage.indices.length=canopyIndexStart;
 bark.vertices.push(...basal);bark.colors.push(...basalColors);
 const retained=Array.from({length:6},(_,j)=>barkVertexStart+j),heading=hash(id,'heading')*Math.PI*2;
 const style=Math.floor(hash(id,'style')*4),bend=.13+.22*hash(id,'bend'),leaderTop=.83+.075*hash(id,'leader-height');
 const leader=[0,.27,.60,leaderTop].map(t=>[x+leanX*t+bend*Math.sin(t*4.5+heading)*t,y+height*t,z+leanZ*t+bend*Math.cos(t*4.2+heading)*t]);
 leader[0]=[x,y,z];
 sweep(bark,leader,[.32+height*.018,.19,.10,.012],6,[98,77,51,255],`${id}:leader`,retained);
 const majorCount=oldVertices>320?6:oldVertices>270?5:oldVertices>230?4:3+Math.floor(hash(id,'major-count')*2);
 const paths=[],forks=[],secondaries=[],majors=[];
 const centerMargin=1.34,boundCenter=Math.max(.70,radius-centerMargin);
 const limit=point=>{const radial=Math.hypot(point[0]-x,point[2]-z);if(radial>boundCenter){point[0]=x+(point[0]-x)*boundCenter/radial;point[2]=z+(point[2]-z)*boundCenter/radial;}point[1]=Math.min(y+height*.91,Math.max(y+height*.26,point[1]));return point;};
 for(let j=0;j<majorCount;j++){
  const t=.25+j*(.46/(majorCount-1))+.025*(hash(id,`fork-${j}`)-.5),base=onPath(leader,t);
  const angle=heading+j*2.399963229728653+(hash(id,`angle-${j}`)-.5)*.34;
  const radial=[Math.cos(angle),0,Math.sin(angle)],side=[-radial[2],0,radial[0]];
  const reach=boundCenter*(.72+.23*hash(id,`reach-${j}`))*(style===2&&j%2?.73:1);
  const end=limit(add(base,add(scale(radial,reach),[0,height*(.09+.045*hash(id,`rise-${j}`)),0])));
  const elbow=limit(add(mix(base,end,.48),add(scale(side,.13*(j%2?1:-1)),[0,.12,0])));
  const major=[base,elbow,end],r=.125-j*.010;sweep(bark,major,[r,r*.53,.018],4,[103,81,53,255],`${id}:major-${j}`);
  forks.push({heightFraction:(base[1]-y)/height,position:base,heading:angle});paths.push(major);majors.push(major);
  const attach=onPath(major,.39+.22*hash(id,`secondary-attach-${j}`)),a=angle+(j%2?-.85:.92);
  const tip=limit(add(attach,[Math.cos(a)*(.42+.23*hash(id,`secondary-reach-${j}`)),.16+.20*hash(id,`secondary-rise-${j}`),Math.sin(a)*(.42+.23*hash(id,`secondary-reach-${j}`))]));
  const secondary=[attach,tip];sweep(bark,secondary,[.036,.005],3,[108,85,54,255],`${id}:secondary-${j}`);paths.push(secondary);secondaries.push(secondary);
 }
 const woodVertices=bark.vertices.length-barkVertexStart,woodTriangles=(bark.indices.length-barkIndexStart)/3;
 const leafCount=Math.min(Math.floor((oldVertices-woodVertices)/4),Math.floor((oldTriangles-woodTriangles)/4));
 if(leafCount<24)throw new Error(`WOODLAND_VARIATION_LEAF_BUDGET_INSUFFICIENT:${id}`);
 // Layer crowns around the actual major limb ends rather than lining short
 // secondary twigs with isolated blades. The upper leader receives its own
 // overlapping cluster, using exactly the same leaf and vertex population.
 const leafPaths=majors.concat([leader]);
 for(let n=0;n<leafCount;n++){
  const pi=n%leafPaths.length,path=leafPaths[pi],ordinal=Math.floor(n/leafPaths.length),count=Math.ceil((leafCount-pi)/leafPaths.length);
  const t=pi===majors.length?.84+.15*(ordinal+.3)/count:.58+.40*(ordinal+.25+.40*hash(id,`leaf-position-${n}`))/count;
  const root=onPath(path,t),along=unit(sub(path.at(-1),path[0])),across=unit(cross(along,Math.abs(along[1])<.9?[0,1,0]:[1,0,0])),around=unit(cross(along,across));
  const roll=hash(id,`leaf-roll-${n}`)*Math.PI*2,direction=add(scale(along,.44),add(scale(across,Math.cos(roll)),add(scale(around,Math.sin(roll)),[0,.18,0])));
  const tint=hash(id,`leaf-tint-${n}`),length=1.58+.52*hash(id,`leaf-length-${n}`),width=.54+.22*hash(id,`leaf-width-${n}`);
  // Scale this blade only if its full extent would escape the old crown/height.
  const horizontalMargin=radius-Math.hypot(root[0]-x,root[2]-z),verticalMargin=y+height-root[1];
  const fit=Math.min(1,horizontalMargin/(length+width+.045),verticalMargin/(length+width+.045));
  leaf(foliage,root,direction,width*fit,length*fit,[46+tint*29,75+tint*35,24+tint*20,255]);
 }
 const vertices=bark.vertices.length-barkVertexStart+foliage.vertices.length-canopyVertexStart,triangles=(bark.indices.length-barkIndexStart+foliage.indices.length-canopyIndexStart)/3;
 if(vertices>oldVertices||triangles>oldTriangles)throw new Error(`WOODLAND_VARIATION_BASELINE_BUDGET_EXCEEDED:${id}`);
 return {recipe:'OPAQUE_CURVED_HIERARCHY_LIGHT_v1',seed:SEED,style:['STAGGERED_UPRIGHT','BENT_LAYERED_LEADER','ASYMMETRIC_OPEN_FORK','SPREAD_LAYERED_CROWN'][style],majorForks:forks,majorCount,secondaryCount:secondaries.length,leafCount,vertices,triangles,baselineVertices:oldVertices,baselineTriangles:oldTriangles};
}
