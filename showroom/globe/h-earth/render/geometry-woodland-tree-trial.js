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
// A closed six-vertex foliage volume. Differently oriented, overlapping
// volumes replace the nearly coplanar fans; no renderer/material change.
function crownCluster(m,center,direction,width,length,depth,color,fit,key){
 const d=unit(direction),side=unit(cross(d,Math.abs(d[1])<.9?[0,1,0]:[1,0,0])),normal=unit(cross(side,d));
 const offsets=[scale(d,-length*.50),scale(d,length*.58),
  add(scale(side,width),scale(d,length*.10)),
  add(scale(normal,depth),scale(d,-length*.09)),
  add(scale(side,-width*.88),scale(d,-length*.15)),
  add(scale(normal,-depth*.86),scale(d,length*.13))];
 const amount=fit(center,offsets),start=m.vertices.length;
 for(let i=0;i<offsets.length;i++){
  const tint=.88+.20*hash(key,`cluster-face-${i}`);
  vertex(m,add(center,scale(offsets[i],amount)),color.map((v,k)=>k===3?v:v*tint));
 }
 for(let i=0;i<4;i++){
  const a=start+2+i,b=start+2+(i+1)%4;
  face(m,start,a,b);face(m,start+1,b,a);
 }
}
export function adaptHEarthWoodlandTreeHierarchy({bark,foliage,p,height,leanX,leanZ,barkVertexStart,barkIndexStart,canopyVertexStart,canopyIndexStart}){
 if(p.id==='P2_TREE_A_11')return economicalReferenceTree({bark,foliage,p,height,leanX,leanZ,barkVertexStart,barkIndexStart,canopyVertexStart,canopyIndexStart});
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
  const t=.38+j*(.45/(majorCount-1))+.025*(hash(id,`fork-${j}`)-.5),base=onPath(leader,t);
  const angle=heading+j*2.399963229728653+(hash(id,`angle-${j}`)-.5)*.34;
  const radial=[Math.cos(angle),0,Math.sin(angle)],side=[-radial[2],0,radial[0]];
  const reach=boundCenter*(.72+.23*hash(id,`reach-${j}`))*(style===2&&j%2?.73:1);
  const end=limit(add(base,add(scale(radial,reach),[0,height*(.12+.045*hash(id,`rise-${j}`)),0])));
  const elbow=limit(add(mix(base,end,.48),add(scale(side,.13*(j%2?1:-1)),[0,.12,0])));
  const major=[base,elbow,end],r=.125-j*.010;sweep(bark,major,[r,r*.53,.018],4,[103,81,53,255],`${id}:major-${j}`);
  forks.push({heightFraction:(base[1]-y)/height,position:base,heading:angle});paths.push(major);majors.push(major);
  const attach=onPath(major,.39+.22*hash(id,`secondary-attach-${j}`)),a=angle+(j%2?-.85:.92);
  const tip=limit(add(attach,[Math.cos(a)*(.42+.23*hash(id,`secondary-reach-${j}`)),.16+.20*hash(id,`secondary-rise-${j}`),Math.sin(a)*(.42+.23*hash(id,`secondary-reach-${j}`))]));
  const secondary=[attach,tip];sweep(bark,secondary,[.036,.005],3,[108,85,54,255],`${id}:secondary-${j}`);paths.push(secondary);secondaries.push(secondary);
 }
 const woodVertices=bark.vertices.length-barkVertexStart,woodTriangles=(bark.indices.length-barkIndexStart)/3;
 const clusterCount=Math.min(Math.floor((oldVertices-woodVertices)/6),Math.floor((oldTriangles-woodTriangles)/8));
 if(clusterCount<16)throw new Error(`WOODLAND_VARIATION_CLUSTER_BUDGET_INSUFFICIENT:${id}`);
 // Fit the actual six vertices, rather than shrinking every upward or
 // outward blade by an unrelated worst-case length+width bound.
 const fit=(center,offsets)=>{
  let amount=1;
  for(const q of offsets){
   const cx=center[0]-x,cz=center[2]-z,a=q[0]*q[0]+q[2]*q[2],b=2*(cx*q[0]+cz*q[2]),c=cx*cx+cz*cz-radius*radius;
   if(a>1e-12)amount=Math.min(amount,(-b+Math.sqrt(Math.max(0,b*b-4*a*c)))/(2*a));
   if(q[1]>0)amount=Math.min(amount,(y+height-center[1])/q[1]);
   if(q[1]<0)amount=Math.min(amount,(y+height*.26-center[1])/q[1]);
  }
  if(!(amount>0))throw new Error(`WOODLAND_VARIATION_CLUSTER_FIT:${id}`);
  return amount;
 };
 const leafPaths=majors.concat([leader]);
 for(let n=0;n<clusterCount;n++){
  const pi=n%leafPaths.length,path=leafPaths[pi],ordinal=Math.floor(n/leafPaths.length),count=Math.ceil((clusterCount-pi)/leafPaths.length);
  const t=pi===majors.length?.62+.37*(ordinal+.35)/count:.32+.67*(ordinal+.20+.25*hash(id,`cluster-position-${n}`))/count;
  const along=unit(sub(path.at(-1),path[0])),across=unit(cross(along,Math.abs(along[1])<.9?[0,1,0]:[1,0,0])),around=unit(cross(along,across));
  const roll=hash(id,`cluster-roll-${n}`)*Math.PI*2;
  let center=onPath(path,t);
  // Alternate between actual secondary forks and major limbs. Centers spread
  // in three dimensions; the leaf silhouettes no longer share a stem line.
  if(pi<majors.length&&ordinal%2)center=onPath(secondaries[pi],.45+.45*hash(id,`cluster-secondary-${n}`));
  center=limit(add(center,add(scale(across,.30*Math.cos(roll)),scale(around,.24*Math.sin(roll)))));
  const direction=add(scale(along,.58),add(scale(across,.48*Math.cos(roll)),add(scale(around,.48*Math.sin(roll)),[0,.22,0])));
  const tint=hash(id,`cluster-tint-${n}`),length=1.55+.65*hash(id,`cluster-length-${n}`),width=.76+.28*hash(id,`cluster-width-${n}`),depth=.54+.26*hash(id,`cluster-depth-${n}`);
  crownCluster(foliage,center,direction,width,length,depth,[46+tint*29,75+tint*35,24+tint*20,255],fit,`${id}:${n}`);
 }
 const vertices=bark.vertices.length-barkVertexStart+foliage.vertices.length-canopyVertexStart,triangles=(bark.indices.length-barkIndexStart+foliage.indices.length-canopyIndexStart)/3;
 if(vertices>oldVertices||triangles>oldTriangles)throw new Error(`WOODLAND_VARIATION_BASELINE_BUDGET_EXCEEDED:${id}`);
 return {recipe:'OPAQUE_CURVED_HIERARCHY_LIGHT_v1',seed:SEED,style:['STAGGERED_UPRIGHT','BENT_LAYERED_LEADER','ASYMMETRIC_OPEN_FORK','SPREAD_LAYERED_CROWN'][style],majorForks:forks,majorCount,secondaryCount:secondaries.length,leafCount:0,clusterCount,foliageForm:'OVERLAPPING_CLOSED_VOLUMES',vertices,triangles,baselineVertices:oldVertices,baselineTriangles:oldTriangles};
}

// Representative-only experiment: accepted c313 folded blades and layered
// branch attachments. Other 64 trees retain checkpoint290856 geometry.
// Taper to one actual tip vertex; never emit a collapsed terminal ring.
function taperedReferenceBranch(m,points,radii,color,key){
 const rings=[];
 for(let k=0;k<points.length-1;k++){
  const tangent=unit(sub(points[k+1],points[Math.max(0,k-1)])),u=unit(cross(tangent,Math.abs(tangent[1])<.9?[0,1,0]:[0,0,1])),w=cross(tangent,u),ring=[];
  for(let j=0;j<3;j++){const angle=j*Math.PI*2/3,tint=.82+.13*Math.cos(angle-.6)+.06*hash(key,`bark-${k}-${j}`);ring.push(vertex(m,add(points[k],add(scale(u,radii[k]*Math.cos(angle)),scale(w,radii[k]*Math.sin(angle)))),color.map((q,i)=>i===3?q:q*tint)));}
  rings.push(ring);
 }
 face(m,rings[0][0],rings[0][2],rings[0][1]);
 for(let k=0;k<rings.length-1;k++)for(let j=0;j<3;j++){const n=(j+1)%3;face(m,rings[k][j],rings[k][n],rings[k+1][j]);face(m,rings[k][n],rings[k+1][n],rings[k+1][j]);}
 const tip=vertex(m,points.at(-1),color),last=rings.at(-1);for(let j=0;j<3;j++)face(m,last[j],last[(j+1)%3],tip);
}
function economicalReferenceTree({bark,foliage,p,height,leanX,leanZ,barkVertexStart,barkIndexStart,canopyVertexStart,canopyIndexStart}){
 const {id,x,z,anchor,radius}=p,y=anchor.y;
 const capV=bark.vertices.length-barkVertexStart+foliage.vertices.length-canopyVertexStart;
 const capT=(bark.indices.length-barkIndexStart+foliage.indices.length-canopyIndexStart)/3;
 const basal=bark.vertices.slice(barkVertexStart,barkVertexStart+6),colors=bark.colors.slice(barkVertexStart,barkVertexStart+6);
 bark.vertices.length=barkVertexStart;bark.colors.length=barkVertexStart;bark.indices.length=barkIndexStart;
 foliage.vertices.length=canopyVertexStart;foliage.colors.length=canopyVertexStart;foliage.indices.length=canopyIndexStart;
 bark.vertices.push(...basal);bark.colors.push(...colors);
 const leader=[0,.30,.60,.90].map(t=>[x+leanX*t+.22*Math.sin(t*4.7)*t,y+height*t,z+leanZ*t+.18*Math.sin(t*5.1)*t]);leader[0]=[x,y,z];
 sweep(bark,leader,[.32+height*.018,.19,.103,.018],6,[99,78,52,255],`${id}:reference-leader`,Array.from({length:6},(_,j)=>barkVertexStart+j));
 const bound=radius-1.05,limit=a=>{const r=Math.hypot(a[0]-x,a[2]-z);if(r>bound){a[0]=x+(a[0]-x)*bound/r;a[2]=z+(a[2]-z)*bound/r;}a[1]=Math.min(y+height*.97,Math.max(y+height*.30,a[1]));return a;};
 const forks=[],attachments=[];
 for(let j=0;j<7;j++){
  const base=onPath(leader,(.348+j*.0744)/.90),heading=j*2.399+hash(id,'branch-heading')*6.28,radial=[Math.cos(heading),0,Math.sin(heading)],side=[-radial[2],0,radial[0]];
  const end=limit(add(base,add(scale(radial,bound*(j<4?.78:.60)),[0,height*.16,0]))),elbow=limit(add(mix(base,end,.52),add(scale(side,.16*(j%2?1:-1)),[0,.10,0]))),major=[base,elbow,end],r=.14-j*.011;
  taperedReferenceBranch(bark,major,[r,r*.37],[99,79,52,255],`${id}:stagger-major-${j}`);forks.push({heightFraction:(base[1]-y)/height,position:base});
  attachments.push({path:major,t:.40,key:`stagger-inner-${j}`},{path:major,t:.79,key:`stagger-outer-${j}`});
  if(j===0||j===3||j===5){
   const root=onPath(major,.55),angle=heading+(j%2?-.85:.92),tip=limit(add(root,[Math.cos(angle)*.65,.25,Math.sin(angle)*.65])),secondary=[root,tip];
   taperedReferenceBranch(bark,secondary,[.030],[106,84,54,255],`${id}:stagger-secondary-${j}`);
   attachments.push({path:secondary,t:.65,key:`stagger-secondary-${j}`});
  }
 }
 const apexRoot=onPath(leader,.82/.90),apexTip=limit([x+leanX*.96+.14,y+height*.97,z+leanZ*.96-.10]),apex=[apexRoot,apexTip];
 taperedReferenceBranch(bark,apex,[.022],[112,89,57,255],`${id}:allocation-apex`);
 for(let n=0;n<5;n++)attachments.push({path:apex,t:.10+n*.19,key:`allocation-apex-${n}`});
 const woodV=bark.vertices.length-barkVertexStart,woodT=(bark.indices.length-barkIndexStart)/3;
 const leafCount=Math.min(Math.floor((capV-woodV-attachments.length)/3),Math.floor((capT-woodT)/4));
 if(leafCount<attachments.length)throw Error('REPRESENTATIVE_FOLDED_LEAF_BUDGET');
 let emitted=0;const leafAttachments=[];
 for(let i=0;i<attachments.length;i++){
  const {path,t,key}=attachments[i],root=onPath(path,t),twig=unit(sub(path.at(-1),path[0])),across=unit(cross(twig,Math.abs(twig[1])<.9?[0,1,0]:[1,0,0])),around=unit(cross(twig,across));
  const tint=hash(id,`${key}:tint`),color=[46+tint*29,75+tint*35,24+tint*20,255],rootIndex=vertex(foliage,root,color),count=i>=attachments.length-5?4:Math.floor((leafCount-20)/(attachments.length-5))+(i<(leafCount-20)%(attachments.length-5)?1:0);
  leafAttachments.push({key,position:root,heightFraction:(root[1]-y)/height,count});
  for(let n=0;n<count;n++){
   const channel=`${key}:leaf-${n}`,roll=hash(id,`${channel}-roll`)*Math.PI*2,spread=add(scale(across,Math.cos(roll)),scale(around,Math.sin(roll))),d=unit(add(scale(twig,.10+.27*hash(id,`${channel}-forward`)),add(scale(spread,.90),[0,-.22+.45*hash(id,`${channel}-lift`),0]))),side=unit(cross(d,Math.abs(d[1])<.9?[0,1,0]:[1,0,0])),normal=unit(cross(side,d));
   const length=.66+.31*hash(id,`${channel}-length`),width=.24+.10*hash(id,`${channel}-width`),middle=scale(d,length*.47),offsets=[scale(d,length),add(middle,add(scale(side,width),scale(normal,.045))),add(middle,add(scale(side,-width),scale(normal,.045)))];
   let fit=1;
   for(const q of offsets){const cx=root[0]-x,cz=root[2]-z,a=q[0]*q[0]+q[2]*q[2],b=2*(cx*q[0]+cz*q[2]),c=cx*cx+cz*cz-radius*radius;if(a>1e-12)fit=Math.min(fit,(-b+Math.sqrt(Math.max(0,b*b-4*a*c)))/(2*a));if(q[1]>0)fit=Math.min(fit,(y+height-root[1])/q[1]);if(q[1]<0)fit=Math.min(fit,(y+height*.26-root[1])/q[1]);}
   if(!(fit>0))throw Error('REPRESENTATIVE_FOLDED_LEAF_ENVELOPE');
   const ids=offsets.map(q=>vertex(foliage,add(root,scale(q,fit)),color));
   face(foliage,rootIndex,ids[0],ids[1]);face(foliage,rootIndex,ids[2],ids[0]);face(foliage,rootIndex,ids[1],ids[2]);face(foliage,ids[0],ids[2],ids[1]);emitted++;
  }
 }
 const vertices=woodV+foliage.vertices.length-canopyVertexStart,triangles=woodT+(foliage.indices.length-canopyIndexStart)/3;
 if(vertices>capV||triangles>capT)throw Error('REPRESENTATIVE_BUDGET_EXCEEDED');
 return {recipe:'OPAQUE_CURVED_HIERARCHY_LIGHT_v1',seed:SEED,experiment:'REPRESENTATIVE_AUDIT_GUIDED_STAGGERED_INNER_FOLIAGE',reference:'c313922b22cb76c64d35297c6bc9dec1b6578188',majorForks:forks,majorCount:7,secondaryCount:3,twigCount:0,apexTwigCount:1,woodVertices:woodV,woodTriangles:woodT,apexLeafRoots:5,leafCount:emitted,leafAttachments,tuftRootCount:attachments.length,foliageForm:'SMALL_CLOSED_FOLDED_LEAVES',vertices,triangles,baselineVertices:capV,baselineTriangles:capT};
}
