/** One immutable-identity, opaque woodland tree comparison.
 * Leaves attach to twigs; no textures, transparency, random stream or extra batch.
 * The caller retains the accepted basal branch and ecological planning envelope.
 */
export const H_EARTH_WOODLAND_TREE_TRIAL_ID='P2_TREE_A_11';
const SEED='WOODLAND_ONE_TREE_REALISM_20261008';
const hash=(id,channel)=>{let h=2166136261;for(const c of `${SEED}:${id}:${channel}`)h=Math.imul(h^c.charCodeAt(0),16777619);return(h>>>0)/4294967296;};
const add=(a,b)=>a.map((q,i)=>q+b[i]);
const sub=(a,b)=>a.map((q,i)=>q-b[i]);
const scale=(a,t)=>a.map(q=>q*t);
const mix=(a,b,t)=>a.map((q,i)=>q+(b[i]-q)*t);
const unit=a=>{const n=Math.hypot(...a);return a.map(q=>q/n);};
const cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
const vertex=(m,p,c)=>{m.vertices.push({x:p[0],y:p[1],z:p[2]});m.colors.push(c.map((q,i)=>i===3?255:Math.max(0,Math.min(255,Math.round(q)))));return m.vertices.length-1;};
const face=(m,a,b,c)=>m.indices.push(a,b,c);
// Four-sided tapered, capped limbs: twelve triangles each. Tangent-relative
// cross sections keep narrow limbs narrow even when nearly horizontal.
function limb(m,a,b,r0,r1,color){
 const d=unit(sub(b,a)),u=unit(cross(d,Math.abs(d[1])<.9?[0,1,0]:[1,0,0])),w=cross(d,u),start=m.vertices.length;
 for(let k=0;k<2;k++)for(let j=0;j<4;j++){
  const angle=j*Math.PI/2,r=k?r1:r0,p=add(k?b:a,add(scale(u,r*Math.cos(angle)),scale(w,r*Math.sin(angle))));
  vertex(m,p,color.map((q,i)=>i===3?q:q*(.80+.20*Math.cos(angle-.6))));
 }
 for(let j=0;j<4;j++){const n=(j+1)%4;face(m,start+j,start+n,start+j+4);face(m,start+n,start+n+4,start+j+4);}
 face(m,start,start+2,start+1);face(m,start,start+3,start+2);face(m,start+4,start+5,start+6);face(m,start+4,start+6,start+7);
}
// A closed, shallow folded blade. Its two broad faces and two narrow fold
// faces stay opaque from either side, with no coplanar opposite-face normals.
function leaf(m,root,direction,width,length,fold,color){
 const d=unit(direction),side=unit(cross(d,Math.abs(d[1])<.9?[0,1,0]:[1,0,0])),normal=unit(cross(side,d));
 const middle=add(root,scale(d,length*.47)),start=m.vertices.length;
 for(const p of [root,add(root,scale(d,length)),add(middle,add(scale(side,width),scale(normal,fold))),add(middle,add(scale(side,-width),scale(normal,fold)))])vertex(m,p,color);
 face(m,start,start+1,start+2);face(m,start,start+3,start+1);face(m,start,start+2,start+3);face(m,start+1,start+3,start+2);
}
export function appendHEarthWoodlandTreeTrial({bark,foliage,p,height,leanX,leanZ,scaffold}){
 if(p.id!==H_EARTH_WOODLAND_TREE_TRIAL_ID)throw new Error('WOODLAND_TREE_TRIAL_ID_OUT_OF_SCOPE');
 const before=bark.indices.length+foliage.indices.length,{id,x,z,anchor}=p,y=anchor.y;
 const fork=[x+leanX*.7,y+height*.30,z+leanZ*.7];
 // The six original crown parts bound placement and floor ecology; they are
 // planning envelopes, not measurements of this new twig/leaf silhouette.
 for(let j=0;j<6;j++){
  const part=scaffold.crownParts[j],center=[part.x,part.y,part.z],radial=unit([center[0]-x,0,center[2]-z]);
  const elbow=mix(fork,center,.49);elbow[0]+=radial[2]*(hash(id,`elbow-${j}`)-.5)*.32;elbow[2]-=radial[0]*(hash(id,`elbow-${j}`)-.5)*.32;
  const hub=mix(elbow,center,.86);
  limb(bark,fork,elbow,.19-j*.014,.095,[94,76,53,255]);
  limb(bark,elbow,hub,.095,.036,[99,81,56,255]);
  for(let k=0;k<4;k++){
   const angle=Math.atan2(radial[2],radial[0])+(k-1.5)*1.12,reach=part.radius*(.63+.20*hash(id,`twig-reach-${j}-${k}`));
   const end=[center[0]+Math.cos(angle)*reach,center[1]+part.heightRadius*(-.8+1.7*hash(id,`twig-height-${j}-${k}`)),center[2]+Math.sin(angle)*reach];
   // Leave room for the longest blade inside the retained crown-radius bound.
   const radialDistance=Math.hypot(end[0]-x,end[2]-z),terminalLimit=p.radius-.97;
   if(radialDistance>terminalLimit){end[0]=x+(end[0]-x)*terminalLimit/radialDistance;end[2]=z+(end[2]-z)*terminalLimit/radialDistance;}
   limb(bark,hub,end,.034,.006,[109,89,59,255]);
   const twig=unit(sub(end,hub)),across=unit(cross(twig,Math.abs(twig[1])<.9?[0,1,0]:[1,0,0])),around=unit(cross(twig,across));
   for(let pair=0;pair<7;pair++)for(let side=-1;side<=1;side+=2){
    const channel=`leaf-${j}-${k}-${pair}-${side}`,t=Math.max(.08,Math.min(.96,.16+pair*.115+(hash(id,`${channel}-position`)-.5)*.15)),root=mix(hub,end,t);
    const roll=hash(id,`${channel}-roll`)*Math.PI*2,spread=add(scale(across,Math.cos(roll)*side),scale(around,Math.sin(roll)*side));
    const direction=add(scale(twig,.25+.40*hash(id,`${channel}-forward`)),add(scale(spread,.75+.25*hash(id,`${channel}-spread`)),[0,-.22+.44*hash(id,`${channel}-lift`),0]));
    const tint=hash(id,`${channel}-tint`),length=.65+.30*hash(id,`${channel}-length`),width=.17+.08*hash(id,`${channel}-width`);
    leaf(foliage,root,direction,width,length,.035,[54+tint*29,83+tint*32,28+tint*18,255]);
   }
  }
 }
 const triangles=(bark.indices.length+foliage.indices.length-before)/3+20; // retained basal branch
 if(triangles>2000)throw new Error(`WOODLAND_TREE_TRIAL_BUDGET_EXCEEDED:${triangles}`);
 return {recipe:'OPAQUE_ATTACHED_FOLDED_LEAVES_v1',seed:SEED,leafCount:336,triangleCount:triangles};
}
