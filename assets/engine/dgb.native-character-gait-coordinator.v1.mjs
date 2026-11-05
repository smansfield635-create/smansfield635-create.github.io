/** Diamond Gate Graphics Engine E10 / Gen3127: corrective CPU-only quadruped gait coordination.
 * Replaces rejected, unmerged Gen3122 candidate after source-review fail-closed.
 * Coordinates explicit ground anchors and stance/swing schedules for the adopted pose composer.
 * Right-handed +Y-up, absolute world-space foot anchors. No inferred anatomy, terrain, GPU, or visuals.
 */
import {createContactTrack} from './dgb.native-character-ik-contact.v1.mjs';
import {createPoseComposer} from './dgb.native-character-pose-composer.v1.mjs';

const finite=Number.isFinite;
const freeze=Object.freeze;
const copyVec=(v,name)=>{
  if(!Array.isArray(v)||v.length!==3||!v.every(finite))throw new TypeError(name+'_INVALID');
  return freeze([...v]);
};
const close=(a,b,epsilon=1e-8)=>a.every((v,i)=>Math.abs(v-b[i])<=epsilon);
const blend=(a,b,u)=>a+(b-a)*u;
function swingSegment(start,end,from,to,clearance){
  if(!(finite(start)&&finite(end)&&end>start))throw new RangeError('SWING_INTERVAL_INVALID');
  const dx=to[0]-from[0],dz=to[2]-from[2],distance=Math.hypot(dx,dz);
  if(!finite(dx)||!finite(dz)||!finite(distance))throw new RangeError('SWING_STEP_NONFINITE');
  if(distance<=1e-9)throw new RangeError('ZERO_LENGTH_SWING_STEP');
  return freeze({start,end,from,to,clearance});
}
function swingAt(span,time,groundY){
  const u=Math.max(0,Math.min(1,(time-span.start)/(span.end-span.start)));
  const smooth=u*u*(3-2*u),rise=Math.sin(Math.PI*u)**2;
  const target=[blend(span.from[0],span.to[0],smooth),
    groundY+span.clearance*rise,blend(span.from[2],span.to[2],smooth)];
  if(!target.every(finite))throw new RangeError('SWING_TARGET_NONFINITE');
  return freeze(target);
}

/** The inputs bind to the real adopted E10 skeleton, clip, contact tracks, IK, and pose composer.
 * Each leg must supply its own explicit world-ground contacts in ascending, non-overlapping order.
 * Loop seam can be STANCE/STANCE at one identical anchor, or SWING/SWING in one wrapping gap.
 * At phase boundaries the adopted composer rejects by default; DECLARE retains its diagnostics.
 */
export function createGaitCoordinator(skeleton,{clip,legs,groundY=0,clearance=.12}={}){
  if(!skeleton||typeof skeleton.samplePose!=='function'||!Array.isArray(skeleton.joints))
    throw new TypeError('SKELETON_REQUIRED');
  if(!clip||typeof clip.sample!=='function'||!finite(clip.duration)||clip.duration<=0||
      typeof clip.loop!=='boolean')throw new TypeError('CLIP_REQUIRED');
  if(clip.duration>Number.MAX_VALUE/2)throw new RangeError('GAIT_DURATION_RANGE_INVALID');
  if(!Array.isArray(legs)||![2,4].includes(legs.length))throw new TypeError('TWO_OR_FOUR_LEGS_REQUIRED');
  if(!finite(groundY)||!finite(clearance)||clearance<=0)throw new RangeError('GROUND_OR_CLEARANCE_INVALID');
  const duration=clip.duration,loop=clip.loop,ids=new Set();
  const prepared=legs.map((leg,index)=>{
    if(!leg||typeof leg.id!=='string'||!leg.id||ids.has(leg.id))
      throw new TypeError('LEG_ID_INVALID_'+index);
    ids.add(leg.id);
    if(!Array.isArray(leg.contacts)||!leg.contacts.length||leg.contacts.length>32)
      throw new TypeError('LEG_CONTACTS_REQUIRED_'+leg.id);
    const height=leg.clearance??clearance;
    if(!finite(height)||height<=0)throw new RangeError('LEG_CLEARANCE_INVALID_'+leg.id);
    if(!finite(groundY+height))throw new RangeError('SWING_CLEARANCE_NONFINITE_'+leg.id);
    const contacts=leg.contacts.map((x,i)=>{
      if(!x||!finite(x.start)||!finite(x.end)||x.start<0||x.end>duration||
          x.end<=x.start)throw new RangeError('CONTACT_INTERVAL_INVALID_'+leg.id+'_'+i);
      const target=copyVec(x.target,'CONTACT_TARGET');
      if(Math.abs(target[1]-groundY)>1e-8)throw new RangeError('CONTACT_OFF_GROUND_'+leg.id);
      return freeze({start:x.start,end:x.end,target});
    });
    for(let i=1;i<contacts.length;i++){
      if(contacts[i].start<contacts[i-1].end)throw new RangeError('CONTACT_OVERLAP_'+leg.id);
      if(contacts[i].start===contacts[i-1].end&&!close(contacts[i].target,contacts[i-1].target))
        throw new RangeError('CONTACT_ANCHOR_JUMP_'+leg.id);
    }
    const first=contacts[0],last=contacts.at(-1),segments=[];
    for(let i=0;i<contacts.length-1;i++){
      const a=contacts[i],b=contacts[i+1];
      if(b.start>a.end)segments.push(swingSegment(a.end,b.start,a.target,b.target,height));
    }
    if(loop){
      const firstPlanted=first.start===0,lastPlanted=last.end===duration;
      if(firstPlanted!==lastPlanted)throw new RangeError('CONTACT_LOOP_PHASE_SEAM_'+leg.id);
      if(firstPlanted){
        if(!close(first.target,last.target))throw new RangeError('CONTACT_LOOP_ANCHOR_SEAM_'+leg.id);
      }else{
        segments.push(swingSegment(last.end,first.start+duration,last.target,first.target,height));
      }
      if(Object.hasOwn(leg,'startTarget')||Object.hasOwn(leg,'endTarget'))
        throw new TypeError('LOOP_END_TARGET_FORBIDDEN_'+leg.id);
    }else{
      const start=Object.hasOwn(leg,'startTarget')?copyVec(leg.startTarget,'START_TARGET'):first.target;
      const end=Object.hasOwn(leg,'endTarget')?copyVec(leg.endTarget,'END_TARGET'):last.target;
      if(Math.abs(start[1]-groundY)>1e-8||Math.abs(end[1]-groundY)>1e-8)
        throw new RangeError('ENDPOINT_OFF_GROUND_'+leg.id);
      if(first.start===0&&!close(start,first.target)||last.end===duration&&!close(end,last.target))
        throw new RangeError('ENDPOINT_STANCE_ANCHOR_MISMATCH_'+leg.id);
      if(first.start>0){
        if(!Object.hasOwn(leg,'startTarget'))throw new TypeError('START_TARGET_REQUIRED_'+leg.id);
        segments.push(swingSegment(0,first.start,start,first.target,height));
      }
      if(last.end<duration){
        if(!Object.hasOwn(leg,'endTarget'))throw new TypeError('END_TARGET_REQUIRED_'+leg.id);
        segments.push(swingSegment(last.end,duration,last.target,end,height));
      }
    }
    if(!segments.length)throw new RangeError('NO_SWING_PHASE_'+leg.id);
    const contactTrack=createContactTrack({duration,groundY,loop,intervals:contacts});
    return freeze({id:leg.id,contacts:freeze(contacts),segments:freeze(segments),
      contactTrack,endTarget:!loop?(Object.hasOwn(leg,'endTarget')?
        copyVec(leg.endTarget,'END_TARGET'):last.target):null,
      composerLeg:freeze({id:leg.id,hipJoint:leg.hipJoint,kneeJoint:leg.kneeJoint,
        footJoint:leg.footJoint,ik:leg.ik,contactTrack})});
  });
  const composer=createPoseComposer(skeleton,{clip,legs:prepared.map(x=>x.composerLeg),
    loopPolicy:'REJECT'});
  function plan(time){
    if(!finite(time)||!loop&&(time<0||time>duration))throw new TypeError('GAIT_TIME_INVALID');
    const remainder=loop?time%duration:time;
    const normalized=loop&&remainder<0?remainder+duration:remainder;
    const t=Object.is(normalized,-0)?0:normalized;
    if(!finite(t))throw new RangeError('GAIT_PHASE_NONFINITE');
    const swingTargets=Object.create(null),records=[];
    for(const d of prepared){
      const contact=d.contactTrack.sample(t);
      if(contact.phase==='STANCE'){
        records.push(freeze({id:d.id,phase:'STANCE',target:contact.target}));
        continue;
      }
      let target=null;
      for(const span of d.segments){
        let instant=t;
        if(span.end>duration&&t<span.end-duration)instant=t+duration;
        if(instant>=span.start&&instant<=span.end){
          target=swingAt(span,instant,groundY);
          break;
        }
      }
      // A nonloop half-open contact track reports SWING exactly at t=duration.
      // Its declared final anchor is the sole lawful endpoint target.
      if(!target&&!loop&&t===duration)target=d.endTarget;
      if(!target)throw new RangeError('SWING_SCHEDULE_GAP_'+d.id);
      swingTargets[d.id]=target;
      records.push(freeze({id:d.id,phase:'SWING',target}));
    }
    return freeze({time:t,legs:freeze(records),swingTargets:freeze(swingTargets)});
  }
  function sample(time,{modes={},boundaryPolicy='REJECT'}={}){
    if(!['REJECT','DECLARE'].includes(boundaryPolicy))throw new TypeError('BOUNDARY_POLICY_INVALID');
    if(!modes||typeof modes!=='object'||Array.isArray(modes))throw new TypeError('GAIT_MODES_INVALID');
    // Copy only own mode keys into a prototype-free map. The adopted pose composer
    // must never read inherited Object.prototype members as leg modes.
    const safeModes=Object.create(null);
    for(const id of Object.keys(modes)){
      if(!ids.has(id))throw new TypeError('UNKNOWN_LEG_'+id);
      const value=modes[id];
      if(value!=='STRICT'&&value!=='CLAMP')throw new TypeError('IK_MODE_INVALID_'+id);
      safeModes[id]=value;
    }
    const planned=plan(time);
    const composed=composer.sample(planned.time,{swingTargets:planned.swingTargets,modes:safeModes,boundaryPolicy});
    return freeze({time:planned.time,plan:planned,pose:composed.pose,
      legs:composed.legs,loopDiscontinuities:composed.loopDiscontinuities});
  }
  return freeze({duration,loop,legCount:prepared.length,
    contactTracks:freeze(prepared.map(d=>freeze({id:d.id,track:d.contactTrack}))),plan,sample});
}
