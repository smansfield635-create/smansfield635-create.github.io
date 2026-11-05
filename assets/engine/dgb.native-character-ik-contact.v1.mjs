/** Diamond Gate Graphics Engine E10 - native two-bone IK and stance/swing contact (Gen3114).
 * Adopted E10-compatible CPU mathematics; no GPU, automatic gait, animal anatomy, scene collision, or world integration.
 * Right-handed +Y-up; bone rest directions -Y; explicit bend pole and finite reach rules.
 */
const finite = Number.isFinite;
function vec(v, name){
  if(!Array.isArray(v)||v.length!==3||!v.every(finite))throw new TypeError(`${name}_INVALID`);
  return [...v];
}
const add=(a,b)=>a.map((v,i)=>v+b[i]);
const sub=(a,b)=>a.map((v,i)=>v-b[i]);
const scale=(a,s)=>a.map(v=>v*s);
const dot=(a,b)=>a[0]*b[0]+a[1]*b[1]+a[2]*b[2];
const cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
const norm=a=>Math.hypot(...a);
const normalize=(a,name)=>{const l=norm(a);if(!finite(l)||l<1e-10)throw new RangeError(`${name}_DEGENERATE`);return scale(a,1/l);};
const clamp=(x,lo,hi)=>Math.max(lo,Math.min(hi,x));
const freezeVec=a=>Object.freeze([...a]);
function unitQuat(q){return freezeVec(scale(q,1/norm(q)));}
function rotationFromDown(to){
  const a=[0,-1,0], b=normalize(to,'BONE_DIRECTION');
  const d=clamp(dot(a,b),-1,1);
  if(d>1-1e-12)return freezeVec([0,0,0,1]);
  if(d< -1+1e-12)return freezeVec([0,0,1,0]);
  const v=cross(a,b);return unitQuat([v[0],v[1],v[2],1+d]);
}
const qConj=q=>[-q[0],-q[1],-q[2],q[3]];
function qMul([x,y,z,w],[u,v,t,s]){return unitQuat([w*u+x*s+y*t-z*v,w*v-x*t+y*s+z*u,w*t+x*v-y*u+z*s,w*s-x*u-y*v-z*t]);}
function qRotate([x,y,z,w],p){
  const t=scale(cross([x,y,z],p),2);
  return add(add(p,scale(t,w)),cross([x,y,z],t));
}
export function createTwoBoneIK({upperLength,lowerLength,pole=[0,0,1],epsilon=1e-7}={}){
  if(!finite(upperLength)||upperLength<=0||!finite(lowerLength)||lowerLength<=0)throw new RangeError('BONE_LENGTH_INVALID');
  const fixedPole=vec(pole,'POLE');
  if(norm(fixedPole)<1e-9)throw new RangeError('POLE_DEGENERATE');
  if(!finite(epsilon)||epsilon<=0||epsilon>=Math.min(upperLength,lowerLength)*0.01)throw new RangeError('IK_EPSILON_INVALID');
  const minReach=Math.abs(upperLength-lowerLength)+epsilon,maxReach=upperLength+lowerLength-epsilon;
  function solve({hip,target,mode='STRICT'}={}){
    const h=vec(hip,'HIP'),t=vec(target,'TARGET');
    if(mode!=='STRICT'&&mode!=='CLAMP')throw new TypeError('IK_MODE_INVALID');
    const diff=sub(t,h),length=norm(diff);
    if(length<epsilon)throw new RangeError('IK_ZERO_DIRECTION');
    const unreachable=length<minReach||length>maxReach;
    if(unreachable&&mode==='STRICT')throw new RangeError('IK_TARGET_UNREACHABLE');
    const d=clamp(length,minReach,maxReach),dir=scale(diff,1/length);
    const pperp=sub(fixedPole,scale(dir,dot(fixedPole,dir)));
    const bend=normalize(pperp,'POLE_PROJECTED');
    const center=(upperLength**2-lowerLength**2+d*d)/(2*d);
    const height=Math.sqrt(Math.max(0,upperLength**2-center**2));
    const foot=add(h,scale(dir,d));
    const knee=add(add(h,scale(dir,center)),scale(bend,height));
    const upperQuat=rotationFromDown(sub(knee,h));
    const lowerWorldQuat=rotationFromDown(sub(foot,knee));
    const kneeLocalQuat=qMul(qConj(upperQuat),lowerWorldQuat);
    return Object.freeze({hip:freezeVec(h),knee:freezeVec(knee),foot:freezeVec(foot),target:freezeVec(t),
      upperRotation:upperQuat,kneeRotation:kneeLocalQuat,reachable:!unreachable,
      clampDistance:Math.abs(length-d),kneeBend:Math.acos(clamp(dot(normalize(sub(knee,h),'UPPER'),normalize(sub(foot,knee),'LOWER')),-1,1))});
  }
  return Object.freeze({upperLength,lowerLength,minReach,maxReach,solve});
}
export function createContactTrack({duration,groundY=0,intervals,loop=false}={}){
  if(!finite(duration)||duration<=0||!finite(groundY)||!Array.isArray(intervals))throw new TypeError('CONTACT_TRACK_INVALID');
  const entries=intervals.map((x,i)=>{
    if(!x||!finite(x.start)||!finite(x.end)||x.start<0||x.end>duration||x.end<=x.start)throw new RangeError(`CONTACT_INTERVAL_INVALID_${i}`);
    const target=vec(x.target,'CONTACT_TARGET');
    if(Math.abs(target[1]-groundY)>1e-8)throw new RangeError(`CONTACT_OFF_GROUND_${i}`);
    return Object.freeze({start:x.start,end:x.end,target:freezeVec(target)});
  });
  if(entries.some((x,i)=>i>0&&x.start<entries[i-1].end))throw new RangeError('CONTACT_OVERLAP');
  function sample(t){
    if(!finite(t))throw new TypeError('CONTACT_TIME_INVALID');
    const local=loop?((t%duration)+duration)%duration:clamp(t,0,duration);
    const interval=entries.find(x=>local>=x.start&&local<x.end);
    return interval?Object.freeze({phase:'STANCE',target:interval.target}):Object.freeze({phase:'SWING',target:null});
  }
  return Object.freeze({duration,groundY,loop,sample,intervalCount:entries.length});
}
export function solveGroundedLeg(ik,contact,hip,{mode='STRICT'}={}){
  if(!ik||typeof ik.solve!=='function')throw new TypeError('IK_REQUIRED');
  if(!contact||contact.phase!=='STANCE'||!Array.isArray(contact.target))throw new TypeError('STANCE_REQUIRED');
  return ik.solve({hip,target:contact.target,mode});
}
export const IKMath=Object.freeze({qRotate,qMul});
