/** One immutable-identity, opaque woodland tree comparison.
 * Leaves attach to twigs; no textures, transparency, random stream or extra batch.
 * The caller retains the accepted basal branch and ecological planning envelope.
 */
import {H_EARTH_WOODLAND_CLEARING_TREE_IDS} from './woodland-clearing-trial.js';
export const H_EARTH_WOODLAND_TREE_TRIAL_ID='P2_TREE_A_11';
const SEED='WOODLAND_ONE_TREE_REALISM_20261008';
const hash=(id,channel)=>{let h=2166136261;for(const c of `${SEED}:${id}:${channel}`)h=Math.imul(h^c.charCodeAt(0),16777619);return(h>>>0)/4294967296;};
const add=(a,b)=>a.map((q,i)=>q+b[i]);
const sub=(a,b)=>a.map((q,i)=>q-b[i]);
const scale=(a,t)=>a.map(q=>q*t);
const mix=(a,b,t)=>a.map((q,i)=>q+(b[i]-q)*t);
const unit=a=>{const n=Math.hypot(...a);return a.map(q=>q/n);};
const cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
const vertex=(m,p,c)=>{m.vertices.push({x:p[0],y:p[1],z:p[2]});m.colors.push(c.map((q,i)=>i===3?255:Math.max(0,Math.min(255,Math.round(q)))));if(m.clearingAttributes)m.clearingAttributes.push([0,0,0]);return m.vertices.length-1;};
const face=(m,a,b,c)=>m.indices.push(a,b,c);
// Each curved limb shares its ring vertices between successive segments.
// Cross sections follow the local tangent; longitudinal ridges and color
// variation provide opaque bark relief without a texture or another batch.
function sweep(m,points,radii,sides,color,key,firstRing=null){
 const rings=[];
 for(let k=0;k<points.length;k++){
  if(k===0&&firstRing){rings.push(firstRing);continue;}
  const tangent=unit(sub(points[Math.min(k+1,points.length-1)],points[Math.max(0,k-1)]));
  const u=unit(cross(tangent,Math.abs(tangent[1])<.9?[0,1,0]:[0,0,1])),w=cross(tangent,u),ring=[];
  for(let j=0;j<sides;j++){
   const angle=j*Math.PI*2/sides,relief=1+.095*Math.sin(j*2.7+hash(key,'ridge')*6.28)+.035*Math.sin(k*1.6+j);
   const p=add(points[k],add(scale(u,radii[k]*relief*Math.cos(angle)),scale(w,radii[k]*relief*Math.sin(angle))));
   const tint=.80+.15*Math.cos(angle-.6)+.09*hash(key,`bark-${k}-${j}`);
   const index=vertex(m,p,color.map((q,i)=>i===3?q:q*tint));ring.push(index);
   if(m.clearingAttributes)m.clearingAttributes[index]=[j/sides,k/(points.length-1),1];
  }
  rings.push(ring);
 }
 for(let k=0;k<rings.length-1;k++)for(let j=0;j<sides;j++){
  const n=(j+1)%sides;face(m,rings[k][j],rings[k][n],rings[k+1][j]);face(m,rings[k][n],rings[k+1][n],rings[k+1][j]);
 }
 if(!firstRing)for(let j=1;j<sides-1;j++)face(m,rings[0][0],rings[0][j+1],rings[0][j]);
 const last=rings.at(-1);for(let j=1;j<sides-1;j++)face(m,last[0],last[j],last[j+1]);
}
const onPath=(path,t)=>{const q=t*(path.length-1),i=Math.min(path.length-2,Math.floor(q));return mix(path[i],path[i+1],q-i);};
// The original trial retains a closed shallow blade. Clearing leaves use only
// its two folded broad faces: both active passes draw with culling disabled,
// so leaf count, positions and silhouette persist without closing-face overdraw.
function leaf(m,root,direction,width,length,fold,color,thin=false){
 const d=unit(direction),side=unit(cross(d,Math.abs(d[1])<.9?[0,1,0]:[1,0,0])),normal=unit(cross(side,d));
 const middle=add(root,scale(d,length*.47)),start=m.vertices.length;
 for(const p of [root,add(root,scale(d,length)),add(middle,add(scale(side,width),scale(normal,fold))),add(middle,add(scale(side,-width),scale(normal,fold)))])vertex(m,p,color);
 if(m.clearingAttributes)for(let j=0;j<4;j++)m.clearingAttributes[start+j]=[[0,.5,2],[1,.5,2],[.47,0,2],[.47,1,2]][j];
 face(m,start,start+1,start+2);face(m,start,start+3,start+1);
 if(!thin){face(m,start,start+2,start+3);face(m,start+1,start+3,start+2);}
}
export function appendHEarthWoodlandTreeTrial({bark,foliage,p,height,leanX,leanZ,clearing=false}){
 if(p.id!==H_EARTH_WOODLAND_TREE_TRIAL_ID&&!(clearing&&H_EARTH_WOODLAND_CLEARING_TREE_IDS.includes(p.id)))throw new Error('WOODLAND_TREE_TRIAL_ID_OUT_OF_SCOPE');
 const before=bark.indices.length+foliage.indices.length,{id,x,z,anchor}=p,y=anchor.y;
 const basalFraction=id===H_EARTH_WOODLAND_TREE_TRIAL_ID?.30:[.38,.54,.30][Number(id.slice(-2))%3];
 const first=[x+leanX*.7,y+height*basalFraction,z+leanZ*.7],trunk=[first];
 if(clearing){
  for(const m of [bark,foliage]){if(!m.clearingAttributes)m.clearingAttributes=[];while(m.clearingAttributes.length<m.vertices.length)m.clearingAttributes.push([0,0,0]);}
  for(let k=0;k<12;k++)bark.clearingAttributes[bark.vertices.length-12+k]=[(k%6)/6,Math.floor(k/6),1];
 }
 for(let k=1;k<=6;k++){
  const t=k/6;trunk.push([first[0]+leanX*t*.4+.22*Math.sin(t*4.7),y+height*(basalFraction+(id===H_EARTH_WOODLAND_TREE_TRIAL_ID?.60:.90-basalFraction)*t),first[2]+leanZ*t*.4+.18*Math.sin(t*5.1)]);
 }
 // Continue the accepted six-vertex top ring, preserving the caller's basal
 // geometry. The central leader survives above every staggered lateral fork.
 const retainedTop=Array.from({length:6},(_,j)=>bark.vertices.length-6+j);
 sweep(bark,trunk,[.19,.18,.156,.129,.103,.067,.018],6,[99,78,52,255],`${id}:trunk`,retainedTop);
 const forks=[],paths=[],leafPaths=[];
 const boundCenter=p.radius-1.05;
 const limit=point=>{
  const d=Math.hypot(point[0]-x,point[2]-z);
  if(d>boundCenter){point[0]=x+(point[0]-x)*boundCenter/d;point[2]=z+(point[2]-z)*boundCenter/d;}
  return point;
 };
 for(let j=0;j<7;j++){
  const level=.08+j*.124,base=onPath(trunk,level),heading=j*2.399+hash(id,'branch-heading')*6.28;
  const radial=[Math.cos(heading),0,Math.sin(heading)],side=[-radial[2],0,radial[0]];
  const reach=boundCenter*(j<4?.85:.60)*( .87+.13*hash(id,`reach-${j}`));
  const end=limit(add(base,add(scale(radial,reach),[0,height*(.16+.045*hash(id,`rise-${j}`)),0])));
  const elbow=add(mix(base,end,.34),scale(side,.24*(j%2?1:-1)));
  const shoulder=add(mix(base,end,.72),add(scale(side,.14),[0,.20,0]));
  const major=[base,elbow,shoulder,end];if(clearing)leafPaths.push({path:major,count:72,key:`major-${j}`,primary:true});forks.push({heightFraction:(base[1]-y)/height,position:base});paths.push(major);
  const r=.14-j*.011;sweep(bark,major,[r,r*.72,r*.37,.022],6,[99,79,52,255],`${id}:major-${j}`);
  // Secondary forks originate part-way along the limb, rather than from
  // a terminal hub. Their paired twigs diverge at different positions too.
  for(let k=0;k<2;k++){
   const attach=onPath(major,.34+k*.30),angle=heading+(k?-.85:.92),direction=[Math.cos(angle),.30,Math.sin(angle)];
   const secondaryEnd=limit(add(attach,scale(direction,.92+.18*hash(id,`secondary-${j}-${k}`))));
   const secondary=[attach,add(mix(attach,secondaryEnd,.52),[0,.17,0]),secondaryEnd];
   sweep(bark,secondary,[r*(k?.32:.52),.026,.010],4,[106,84,54,255],`${id}:secondary-${j}-${k}`);paths.push(secondary);
   leafPaths.push({path:secondary,count:clearing?36:10,key:`secondary-${j}-${k}`});
   for(let n=0;n<2;n++){
    const root=onPath(secondary,.40+n*.39),a=angle+(n?-.73:.80),rise=n?.32:-.13;
    const tip=limit(add(root,[Math.cos(a)*.64,rise,Math.sin(a)*.64]));
    const twig=[root,tip];sweep(bark,twig,[.018,.004],4,[112,89,57,255],`${id}:twig-${j}-${k}-${n}`);paths.push(twig);
    leafPaths.push({path:twig,count:clearing?28:17,key:`twig-${j}-${k}-${n}`});
   }
  }
 }
 let leafCount=0;
 for(const {path,count,key,primary=false} of leafPaths){
  for(let n=0;n<count;n++){
   const channel=`${key}:leaf-${n}`,t=(primary?.22:.07)+(primary?.75:.90)*(n+.25+.5*hash(id,`${channel}-position`))/count;let root=onPath(path,t);
   const twig=unit(sub(path.at(-1),path[0])),across=unit(cross(twig,Math.abs(twig[1])<.9?[0,1,0]:[1,0,0])),around=unit(cross(twig,across));
   // Alternate overlapping leaf sprays along the branch, with a small
   // irregular attachment spread; primary limbs now carry intermediate
   // foliage instead of reading as strings between terminal rosettes.
   const roll=hash(id,`${channel}-roll`)*Math.PI*2,spread=add(scale(across,Math.cos(roll)),scale(around,Math.sin(roll)));
   if(clearing)root=add(root,scale(spread,.035+.13*hash(id,`${channel}-petiole`)));
   const direction=add(scale(twig,.10+.27*hash(id,`${channel}-forward`)),add(scale(spread,.90),[0,-.22+.45*hash(id,`${channel}-lift`),0]));
   const tint=hash(id,`${channel}-tint`),length=clearing?.38+.22*hash(id,`${channel}-length`):.66+.31*hash(id,`${channel}-length`),width=clearing?.105+.075*hash(id,`${channel}-width`):.24+.10*hash(id,`${channel}-width`);
   // The centerline margin accommodates each blade's farthest possible
   // vertex, so leaves stay inside the accepted horizontal crown footprint.
   leaf(foliage,root,direction,width,length,clearing?.020:.045,[46+tint*29,75+tint*35,24+tint*20,255],clearing);leafCount++;
  }
 }
 const triangles=(bark.indices.length+foliage.indices.length-before)/3+16;
 if(triangles>(clearing?9000:3600))throw new Error(`WOODLAND_TREE_TRIAL_BUDGET_EXCEEDED:${triangles}`);
 return {recipe:clearing?'BOUNDED_DISTRIBUTED_LEAF_SPRAYS_CURVED_HIERARCHY_v5':'OPAQUE_CURVED_HIERARCHY_v2',seed:SEED,leafCount,triangleCount:triangles,woodTriangleCount:triangles-16-leafCount*(clearing?2:4),structure:{trunk,majorForks:forks,branchPaths:paths,secondaryCount:14,twigCount:28}};
}
