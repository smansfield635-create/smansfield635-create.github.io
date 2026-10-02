/* TARGET FILE: /products/auren/auren.session-context.js
   AUREN_SUCCESSOR_SEMANTIC_SESSION_CONTEXT_V1
   Authority: project-records/auren-successor-replacement-contract-immersive-relational-conversation-2026-10-02.md */
(()=>{"use strict";

const CONTRACT="AUREN_SUCCESSOR_SEMANTIC_SESSION_CONTEXT_V1";
const CHARACTER_ID="AUREN_VALE";
const LEDGER_LIMIT=96;
const DELIVERED_LIMIT=96;
const EVENT_TYPES=Object.freeze([
"TOPIC_OPENED","TOPIC_MEANINGFULLY_PURSUED","TOPIC_COMPLETED","TOPIC_REDIRECTED","TOPIC_REVISITED",
"AUTHORIZED_CONTEXT_VOLUNTEERED","DEEPER_AUTHORIZED_CONTEXT_SHARED","SELF_AUTHORITY_DEFERRED",
"BOUNDARY_ESTABLISHED","BOUNDARY_ACKNOWLEDGED","BOUNDED_CONTEXT_REQUESTED","BOUNDARY_PRESSURED","BOUNDARY_REASSERTED","BOUNDARY_THREAD_RELEASED",
"HANDOFF_OFFERED","HANDOFF_ACCEPTED","HANDOFF_RETURNED","HANDOFF_THREAD_RESUMED",
"CONTEXTUAL_ASSISTANCE_ACCEPTED","UNRESOLVED_THREAD_OPENED","UNRESOLVED_THREAD_RESUMED","UNRESOLVED_THREAD_RESOLVED",
"SESSION_RESET"
]);
const EVENT_SET=new Set(EVENT_TYPES);
const SUBJECT_REQUIRED=new Set(["BOUNDARY_ESTABLISHED","BOUNDARY_ACKNOWLEDGED","BOUNDED_CONTEXT_REQUESTED","BOUNDARY_PRESSURED","BOUNDARY_REASSERTED","BOUNDARY_THREAD_RELEASED"]);
const THREAD_REQUIRED=new Set(["UNRESOLVED_THREAD_OPENED","UNRESOLVED_THREAD_RESUMED","UNRESOLVED_THREAD_RESOLVED","HANDOFF_THREAD_RESUMED"]);
const HANDOFF_TYPES=new Set(["HANDOFF_OFFERED","HANDOFF_ACCEPTED","HANDOFF_RETURNED","HANDOFF_THREAD_RESUMED"]);

const clean=x=>typeof x==="string"?x.trim():"";
const freeze=x=>Object.freeze(x);
const copy=x=>x&&typeof x==="object"?JSON.parse(JSON.stringify(x)):x;
const sessionId=()=>["auren",Date.now().toString(36),Math.random().toString(36).slice(2,10)].join("-");

let sid=sessionId(),sequence=0,revision=0,ledger=[],delivered=[],activeSubject=null,activeThread=null,lastBeat=null,handoffContext=null;
let topics=new Map(),boundaries=new Map(),threads=new Map(),offers=new Map();

function reject(input,reason){
 return freeze({contract:CONTRACT,accepted:false,eventType:input?.eventType||null,reason,revision,sequence});
}
function topicState(id){
 if(!topics.has(id))topics.set(id,{subjectId:id,opened:0,pursued:0,revisited:0,completed:0,lastSequence:0});
 return topics.get(id);
}
function boundaryState(subjectId,boundaryId){
 const key=subjectId+"|"+boundaryId;
 if(!boundaries.has(key))boundaries.set(key,{key,subjectId,boundaryId,known:false,authoritySensitive:false,pressureCount:0,interactionCaution:false,recovery:"NONE",lastPressureSequence:null,lastSequence:0});
 return boundaries.get(key);
}
function threadState(id){
 if(!threads.has(id))threads.set(id,{threadId:id,status:"OPEN",subjectId:null,openedSequence:null,resumedCount:0,resolvedSequence:null,lastSequence:0});
 return threads.get(id);
}
function appendEvent(e){
 ledger=[...ledger,freeze(e)].slice(-LEDGER_LIMIT);
}
function apply(input={}){
 const eventType=clean(input.eventType);
 if(!EVENT_SET.has(eventType))return reject(input,"UNKNOWN_EVENT_FAIL_CLOSED");
 if(eventType==="SESSION_RESET"){reset();return freeze({contract:CONTRACT,accepted:true,eventType,reason:"SESSION_RESET_ACCEPTED",revision,sequence,sessionId:sid});}
 const subjectId=clean(input.subjectId)||null,threadId=clean(input.threadId)||null,boundaryId=clean(input.boundaryId)||null,destinationId=clean(input.destinationId)||null;
 if(SUBJECT_REQUIRED.has(eventType)&&(!subjectId||!boundaryId))return reject(input,"SUBJECT_AND_BOUNDARY_REQUIRED");
 if(THREAD_REQUIRED.has(eventType)&&!threadId)return reject(input,"THREAD_REQUIRED");
 if(HANDOFF_TYPES.has(eventType)&&eventType!=="HANDOFF_THREAD_RESUMED"&&!destinationId)return reject(input,"DESTINATION_REQUIRED");
 if(eventType==="BOUNDARY_PRESSURED"){
   const b=boundaryState(subjectId,boundaryId);
   if(!b.known)return reject(input,"BOUNDARY_NOT_KNOWN_PRESSURE_REJECTED");
 }
 sequence++;revision++;
 const e={contract:CONTRACT,eventType,characterId:CHARACTER_ID,sessionId:sid,sequence,subjectId,threadId,sourceBeat:clean(input.sourceBeat)||null,destinationId,boundaryId,metadata:copy(input.metadata||null)};
 if(subjectId){
   const t=topicState(subjectId);t.lastSequence=sequence;
   if(eventType==="TOPIC_OPENED")t.opened++;
   if(eventType==="TOPIC_MEANINGFULLY_PURSUED")t.pursued++;
   if(eventType==="TOPIC_REVISITED")t.revisited++;
   if(eventType==="TOPIC_COMPLETED")t.completed++;
 }
 if(eventType==="TOPIC_OPENED"||eventType==="TOPIC_REVISITED"||eventType==="TOPIC_MEANINGFULLY_PURSUED")activeSubject=subjectId||activeSubject;
 if(eventType==="TOPIC_COMPLETED"&&subjectId===activeSubject)activeSubject=null;
 if(eventType==="TOPIC_REDIRECTED"&&subjectId)activeSubject=subjectId;
 if(eventType==="UNRESOLVED_THREAD_OPENED"){
   const t=threadState(threadId);t.status="OPEN";t.subjectId=subjectId;t.openedSequence=t.openedSequence??sequence;t.lastSequence=sequence;activeThread=threadId;
 }
 if(eventType==="UNRESOLVED_THREAD_RESUMED"||eventType==="HANDOFF_THREAD_RESUMED"){
   const t=threadState(threadId);t.status="OPEN";t.resumedCount++;t.lastSequence=sequence;activeThread=threadId;activeSubject=t.subjectId||subjectId||activeSubject;
 }
 if(eventType==="UNRESOLVED_THREAD_RESOLVED"){
   const t=threadState(threadId);t.status="RESOLVED";t.resolvedSequence=sequence;t.lastSequence=sequence;if(activeThread===threadId)activeThread=null;
 }
 if(eventType==="BOUNDARY_ESTABLISHED"){
   const b=boundaryState(subjectId,boundaryId);b.known=true;b.authoritySensitive=input.metadata?.authoritySensitive!==false;b.lastSequence=sequence;
 }
 if(eventType==="BOUNDARY_ACKNOWLEDGED"||eventType==="BOUNDED_CONTEXT_REQUESTED"){
   const b=boundaryState(subjectId,boundaryId);b.known=true;b.recovery=b.interactionCaution?"UNDERWAY":"NOT_NEEDED";b.lastSequence=sequence;
 }
 if(eventType==="BOUNDARY_PRESSURED"){
   const b=boundaryState(subjectId,boundaryId);b.pressureCount++;b.interactionCaution=true;b.recovery="NONE";b.lastPressureSequence=sequence;b.lastSequence=sequence;
 }
 if(eventType==="BOUNDARY_REASSERTED"){const b=boundaryState(subjectId,boundaryId);b.known=true;b.lastSequence=sequence;}
 if(eventType==="BOUNDARY_THREAD_RELEASED"){
   const b=boundaryState(subjectId,boundaryId);b.known=true;if(b.interactionCaution)b.recovery="UNDERWAY";b.lastSequence=sequence;
 }
 if(eventType==="TOPIC_MEANINGFULLY_PURSUED"){
   for(const b of boundaries.values()){
     if(b.recovery==="UNDERWAY"&&b.subjectId!==subjectId){b.interactionCaution=false;b.recovery="ESTABLISHED";}
   }
 }
 if(eventType==="HANDOFF_OFFERED"){
   offers.set(destinationId,{destinationId,subjectId,threadId,sourceBeat:e.sourceBeat,sequence});
   handoffContext={destinationId,originatingSubjectId:subjectId,originatingThreadId:threadId,offeredSequence:sequence,accepted:false,returned:false};
 }
 if(eventType==="HANDOFF_ACCEPTED"&&handoffContext?.destinationId===destinationId)handoffContext={...handoffContext,accepted:true,acceptedSequence:sequence};
 if(eventType==="HANDOFF_RETURNED"&&handoffContext?.destinationId===destinationId)handoffContext={...handoffContext,returned:true,returnSequence:sequence};
 appendEvent(e);
 return freeze({contract:CONTRACT,accepted:true,eventType,reason:"SEMANTIC_EVENT_ACCEPTED",revision,sequence,sessionId:sid});
}
function recordDelivered(input={}){
 const beatId=clean(input.beatId),subjectId=clean(input.subjectId)||null,threadId=clean(input.threadId)||null;
 if(!beatId)return freeze({contract:CONTRACT,accepted:false,reason:"BEAT_ID_REQUIRED",revision});
 if(delivered.some(x=>x.beatId===beatId&&x.sessionId===sid))return freeze({contract:CONTRACT,accepted:false,reason:"BEAT_ALREADY_DELIVERED",revision,beatId});
 revision++;const d=freeze({beatId,subjectId,threadId,sessionId:sid,sequence,revision});delivered=[...delivered,d].slice(-DELIVERED_LIMIT);lastBeat=d;
 return freeze({contract:CONTRACT,accepted:true,reason:"BEAT_RECORDED",revision,beatId});
}
function hasDelivered(beatId){return delivered.some(x=>x.beatId===beatId&&x.sessionId===sid);}
function boundarySnapshot(subjectId,boundaryId){
 const b=boundaries.get(clean(subjectId)+"|"+clean(boundaryId));
 return b?freeze({...b}):freeze({subjectId:clean(subjectId)||null,boundaryId:clean(boundaryId)||null,known:false,authoritySensitive:false,pressureCount:0,interactionCaution:false,recovery:"NONE"});
}
function meaningfulHistory(){
 let pursued=0,revisited=0;for(const t of topics.values()){pursued+=t.pursued;revisited+=t.revisited;}
 const resumed=[...threads.values()].reduce((n,t)=>n+t.resumedCount,0),returns=ledger.filter(x=>x.eventType==="HANDOFF_RETURNED").length,assists=ledger.filter(x=>x.eventType==="CONTEXTUAL_ASSISTANCE_ACCEPTED").length;
 return freeze({distinctSubjects:[...topics.values()].filter(t=>t.pursued||t.revisited||t.completed).length,meaningfulPursuits:pursued,revisits:revisited,resumedThreads:resumed,handoffReturns:returns,contextualAssists:assists,established:Boolean(pursued+revisited+resumed+returns+assists)});
}
function momentum(){
 if(!activeThread)return freeze({active:false,threadId:null,condition:"NONE"});
 const t=threads.get(activeThread);if(!t||t.status!=="OPEN")return freeze({active:false,threadId:activeThread,condition:"NONE"});
 const recent=ledger.slice(-8),support=recent.filter(x=>["TOPIC_MEANINGFULLY_PURSUED","UNRESOLVED_THREAD_RESUMED","HANDOFF_THREAD_RESUMED","CONTEXTUAL_ASSISTANCE_ACCEPTED"].includes(x.eventType)&&(!x.threadId||x.threadId===activeThread)).length;
 const stalled=recent.some(x=>x.eventType==="BOUNDARY_PRESSURED"&&(!x.threadId||x.threadId===activeThread));
 return freeze({active:!stalled&&support>0,threadId:activeThread,condition:stalled?"STALLED":support>0?"ACTIVE":"OPEN"});
}
function predicates({subjectId=null,boundaryId=null,threadId=null,destinationId=null}={}){
 const s=clean(subjectId)||null,b=boundaryId?boundarySnapshot(s,boundaryId):null,t=clean(threadId)||activeThread,d=clean(destinationId)||null,topic=s?topics.get(s):null,th=t?threads.get(t):null;
 return freeze({
   isFirstPass:Boolean(s&&!topic),
   isRevisit:Boolean(topic&&(topic.revisited>0||topic.opened>1)),
   isBoundaryKnown:Boolean(b?.known),
   isPressureActive:Boolean(b?.interactionCaution&&b?.recovery!=="ESTABLISHED"),
   isRecovering:Boolean(b?.recovery==="UNDERWAY"),
   hasActiveMomentum:Boolean(t&&momentum().active&&momentum().threadId===t),
   hasResumableThread:Boolean(th&&th.status==="OPEN"),
   hasValidHandoffContext:Boolean(d&&handoffContext?.destinationId===d&&handoffContext.accepted)
 });
}
function snapshot(){
 return freeze({
   contract:CONTRACT,characterId:CHARACTER_ID,sessionId:sid,revision,sequence,
   ledger:freeze(ledger.map(x=>freeze({...x,metadata:copy(x.metadata)}))),
   deliveredBeats:freeze(delivered.map(x=>freeze({...x}))),
   activeSubject,activeThread,lastBeat:lastBeat?freeze({...lastBeat}):null,
   meaningfulHistory:meaningfulHistory(),momentum:momentum(),
   topics:freeze([...topics.values()].map(x=>freeze({...x}))),
   boundaries:freeze([...boundaries.values()].map(x=>freeze({...x}))),
   unresolvedThreads:freeze([...threads.values()].filter(x=>x.status==="OPEN").map(x=>freeze({...x}))),
   offers:freeze([...offers.values()].map(x=>freeze({...x}))),
   handoffContext:handoffContext?freeze({...handoffContext}):null
 });
}
function reset(){
 sid=sessionId();sequence=0;revision++;ledger=[];delivered=[];activeSubject=null;activeThread=null;lastBeat=null;handoffContext=null;topics=new Map();boundaries=new Map();threads=new Map();offers=new Map();
}
const api=freeze({contract:CONTRACT,eventTypes:EVENT_TYPES,ledgerLimit:LEDGER_LIMIT,apply,recordDelivered,hasDelivered,getState:snapshot,getBoundary:boundarySnapshot,predicates,reset});
Object.defineProperty(globalThis,"AUREN_SESSION_CONTEXT",{value:api,writable:false,configurable:false});
globalThis.dispatchEvent(new CustomEvent("auren:session-context-ready",{detail:{contract:CONTRACT}}));
})();
