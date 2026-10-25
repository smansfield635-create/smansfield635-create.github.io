import {KEYS,uid,validateProject,projectName} from './packet.mjs';
import {workspaceStorage} from './storage.mjs';
import {ensureFlow,requestDirection} from './progression.mjs';

export const WORKSPACE_KEY='diamondgate.projects.v2';
export const WORKSPACE_EVENT='diamondgate:workspace-updated';
const MAX_BYTES=32000000;
const clone=x=>structuredClone(x);
const object=x=>x&&typeof x==='object'&&!Array.isArray(x);
const stamp=x=>typeof x==='string'&&Number.isFinite(Date.parse(x));
const captureSchemas={controlPlane:'DGB_OPERATIONS_CHAMBER_DASHBOARD_DATA_v1',study:'DGB_HOSTED_STUDY_CAPTURE_v1',briefings:'DGB_PROJECT_BRIEFINGS_v1',agents:'DGB_CHAMBER_AGENT_DELIVERIES_v1'};
const emptyChamber=()=>({schema:'diamondgate.chamber-local.v1',captures:{controlPlane:null,study:null,briefings:null,agents:null},links:[]});
export function createEmptyWorkspace(){return {projects:[],selected:'',inbox:'',newIntent:'',updates:{},localOwnerId:uid(),chamber:emptyChamber()};}
function validateCapture(key,c){
 if(c===null)return;
 if(!object(c)||c.schema!==captureSchemas[key])throw Error('Invalid '+key+' capture schema.');
 if(key==='controlPlane'){
  if(!stamp(c.observedAt)||!Array.isArray(c.projects)||!Array.isArray(c.repositories)||!Array.isArray(c.instruments?.records)||!object(c.study)||c.commandsEnabled!==false)throw Error('Invalid operational activity capture.');
  for(const p of c.projects)if(!object(p)||typeof p.id!=='string'||typeof p.repository!=='string'||!['operations','recentOperations','pullRequests','workflowRuns'].every(k=>Array.isArray(p[k])&&p[k].every(object))||!Number.isSafeInteger(p.activeCount)||p.activeCount<0||!Number.isSafeInteger(p.totalRecorded))throw Error('Invalid operational project record.');
  if(c.repositories.some(r=>!object(r)||typeof r.name!=='string')||c.instruments.records.some(r=>!object(r)||typeof r.name!=='string'))throw Error('Invalid operational source record.');
  if(c.study.status==='AVAILABLE'&&(!stamp(c.study.cutoff)||['PARAMOUNT','STANDARD','SUPPORT','materialUnits','total'].some(k=>!Number.isSafeInteger(c.study.totals?.[k])||c.study.totals[k]<0)))throw Error('Invalid historical study record.');
 }
 if(key==='study'){
  const s=c.rollingStudy;
  if(!stamp(c.capturedAt)||!object(s)||!stamp(s.through)||!Array.isArray(s.cohorts)||!Array.isArray(c.auditFlags)||!object(s.checkpoint)||s.checkpoint.savedThrough!==s.through||!/^([a-f0-9]{40})$/.test(s.checkpoint.commit))throw Error('Invalid continuing-study capture.');
  for(const row of s.cohorts)if(!object(row)||['total','materialUnits','SUPPORT','UNRESOLVED'].some(k=>!Number.isSafeInteger(row[k])||row[k]<0))throw Error('Invalid continuing-study totals.');
  for(const f of c.auditFlags)if(!object(f)||typeof f.repository!=='string'||!f.repository.match(/^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/)||!Number.isSafeInteger(f.number)||f.number<1||typeof f.reason!=='string')throw Error('Invalid study audit flag.');
 }
 if(key==='agents'){
  if(!Array.isArray(c.records))throw Error('Invalid agent report capture.');
  for(const r of c.records){const e=r?.event;let safe=false;try{const u=new URL(e?.githubEvidenceUrl);safe=u.protocol==='https:'&&u.hostname==='github.com'&&!u.username&&!u.password;}catch{}
   if(!object(r)||!stamp(r.receivedAt)||!object(e)||!['projectId','operationId','phase','summary'].every(k=>typeof e[k]==='string')||!stamp(e.occurredAt)||!safe)throw Error('Invalid agent report or evidence URL.');
  }
 }
 if(key==='briefings'){
  if(!Array.isArray(c.records)||c.records.length>100||(c.updatedAt!==null&&!stamp(c.updatedAt)))throw Error('Invalid project briefing capture.');
  const ids=new Set();
  for(const r of c.records){
   if(!object(r)||typeof r.projectId!=='string'||!r.projectId.match(/^[A-Z][A-Z0-9_]{1,79}$/)||ids.has(r.projectId)||!stamp(r.observedAt)||!Array.isArray(r.sourceHeads)||!Array.isArray(r.instruments))throw Error('Invalid project briefing identity.');
   ids.add(r.projectId);
   for(const key of ['accomplishment','publication','unfinished','blocker','nextStep'])if(!object(r[key])||typeof r[key].text!=='string'||!['VERIFIED_RECORD','REPORTED_RESULT','PROPOSED_NEXT_STEP','NOT_ESTABLISHED'].includes(r[key].basis)||!Array.isArray(r[key].sources))throw Error('Invalid project briefing fact.');
  }
 }
}
export function validateWorkspace(db){
 if(!object(db)||!Array.isArray(db.projects)||db.projects.length>100||typeof db.selected!=='string'||typeof db.inbox!=='string'||typeof db.newIntent!=='string'||!object(db.updates))throw Error('Invalid combined workspace.');
 if(db.projects.filter(p=>!p.deletedAt).length>20)throw Error('This workspace exceeds the 20 active-project limit.');
 const ids=new Set();for(const p of db.projects){validateProject(p);if(ids.has(p.id))throw Error('Duplicate DiamondGate project identity.');ids.add(p.id);}
 if(db.selected&&!ids.has(db.selected))throw Error('Selected project is not present in the workspace.');
 for(const [id,draft]of Object.entries(db.updates))if(!ids.has(id)||typeof draft!=='string'||draft.length>MAX_BYTES)throw Error('Invalid saved project draft.');
 if(db.chamber!==undefined){
  const c=db.chamber;
  if(!object(c)||c.schema!=='diamondgate.chamber-local.v1'||!object(c.captures)||!Array.isArray(c.links)||c.links.length>100)throw Error('Invalid Chamber workspace.');
  if(Object.keys(c.captures).some(k=>!(k in captureSchemas)))throw Error('Unknown Chamber capture type.');
  for(const k of Object.keys(captureSchemas))validateCapture(k,c.captures[k]??null);
  const linked=new Set(),targets=new Set();
  for(const link of c.links){if(!object(link)||typeof link.projectId!=='string'||!link.projectId.match(/^[A-Z][A-Z0-9_]{1,79}$/)||linked.has(link.projectId)||targets.has(link.diamondgateId)||!ids.has(link.diamondgateId))throw Error('Invalid Chamber project link.');linked.add(link.projectId);targets.add(link.diamondgateId);}
 }
 if(JSON.stringify(db).length>MAX_BYTES)throw Error('The combined workspace exceeds the 32 MB import limit.');
 return db;
}
export function readSharedWorkspace(storage){const raw=storage.getItem(WORKSPACE_KEY);return raw===null?createEmptyWorkspace():validateWorkspace(JSON.parse(raw));}
export function writeSharedWorkspace(storage,db,{expectedRaw}={}){
 validateWorkspace(db);
 const saved=workspaceStorage(()=>storage,WORKSPACE_KEY),raw=saved.read();
 if(expectedRaw!==undefined&&raw!==expectedRaw)throw Error('Another tab changed the workspace. Reload before saving; your existing data was kept.');
 saved.write(db);return db;
}
export function chamberData(db){validateWorkspace(db);return {...emptyChamber().captures,...db.chamber?.captures};}
export function workspaceBackup(db){validateWorkspace(db);return JSON.stringify({schema:'diamondgate.workspace-backup.v1',exportedAt:new Date().toISOString(),workspace:db},null,2);}
export function decodeWorkspaceBackup(raw){
 if(typeof raw!=='string'||raw.length>MAX_BYTES)throw Error('Combined backup is too large (maximum 32 MB).');
 const input=JSON.parse(raw);let db;
 if(input.schema==='diamondgate.workspace-backup.v1'){if(!stamp(input.exportedAt))throw Error('Invalid backup date.');db=input.workspace;}
 else if(input.schema==='diamondgate.chamber-capture.v1'){
  if(!stamp(input.capturedAt)||!object(input.captures))throw Error('Invalid Chamber snapshot.');
  db=createEmptyWorkspace();db.chamber.captures={...db.chamber.captures,...input.captures};
 }else throw Error('This file is not a combined workspace backup or Chamber snapshot. Use DiamondGate to restore an individual project backup.');
 return clone(validateWorkspace(db));
}
function captureTime(key,c){if(!c)return -Infinity;if(key==='controlPlane')return Date.parse(c.observedAt);if(key==='study')return Date.parse(c.rollingStudy.through);if(key==='briefings')return c.updatedAt?Date.parse(c.updatedAt):-Infinity;return Math.max(-Infinity,...c.records.map(r=>Date.parse(r.receivedAt)));}
function same(a,b){return JSON.stringify(a)===JSON.stringify(b);}
export function mergeWorkspaceBackup(current,incoming){
 validateWorkspace(current);validateWorkspace(incoming);const db=clone(current),addedProjects=[],updatedCaptures=[];
 const existing=new Map(db.projects.map(p=>[p.id,p]));
 for(const p of incoming.projects){if(existing.has(p.id)){if(!same(existing.get(p.id),p))throw Error('Project '+p.title+' has a different saved version. Import cancelled; no local project was overwritten.');}else{db.projects.push(clone(p));existing.set(p.id,p);addedProjects.push(p.id);}}
 for(const [id,draft]of Object.entries(incoming.updates)){if(db.updates[id]&&draft&&db.updates[id]!==draft)throw Error('A saved response draft conflicts with this backup. Import cancelled; keep both backups.');if(!db.updates[id]&&draft)db.updates[id]=draft;}
 for(const key of ['inbox','newIntent']){if(db[key]&&incoming[key]&&db[key]!==incoming[key])throw Error('Unfinished intake text conflicts with this backup. Import cancelled; your local text was kept.');if(!db[key]&&incoming[key])db[key]=incoming[key];}
 if(!db.selected&&incoming.selected)db.selected=incoming.selected;
 db.chamber||=emptyChamber();
 for(const key of Object.keys(captureSchemas)){
  const fresh=incoming.chamber?.captures[key],prior=db.chamber.captures[key];if(!fresh)continue;
  if(key==='briefings'&&prior){
   const records=new Map(prior.records.map(r=>[r.projectId,r]));let changed=false;
   for(const record of fresh.records){const old=records.get(record.projectId);if(!old||Date.parse(record.observedAt)>Date.parse(old.observedAt)){records.set(record.projectId,clone(record));changed=true;}else if(record.observedAt===old.observedAt&&!same(record,old))throw Error('Conflicting briefing records have the same source observation time. Import cancelled.');}
   if(changed){db.chamber.captures[key]={...clone(prior),updatedAt:captureTime(key,fresh)>captureTime(key,prior)?fresh.updatedAt:prior.updatedAt,records:[...records.values()]};updatedCaptures.push(key);}
  }else if(!prior||captureTime(key,fresh)>captureTime(key,prior)){db.chamber.captures[key]=clone(fresh);updatedCaptures.push(key);}
  else if(captureTime(key,fresh)===captureTime(key,prior)&&!same(fresh,prior))throw Error('Conflicting '+key+' captures have the same source observation time. Import cancelled.');
 }
 for(const link of incoming.chamber?.links||[]){const prior=db.chamber.links.find(l=>l.projectId===link.projectId||l.diamondgateId===link.diamondgateId);if(prior&&!same(prior,link))throw Error('A Chamber project link conflicts with this backup. Import cancelled.');if(!prior)db.chamber.links.push(clone(link));}
 validateWorkspace(db);return {workspace:db,addedProjects,updatedCaptures};
}
const titles={DIAMONDGATE_PREFLIGHT:'DiamondGate Preflight',H_EARTH:'H-Earth',AUDRALIA:'Audralia',OPERATIONS_CHAMBER:'Operations Chamber',PRIVATE_PUBLIC_BRIDGE:'Operations Chamber',RELEASE_PROOF:'Release Proof'};
export function openChamberProject(current,projectId,{now=new Date().toISOString(),idFactory=uid}={}){
 validateWorkspace(current);const db=clone(current);db.chamber||=emptyChamber();
 const sourceId=projectId==='PRIVATE_PUBLIC_BRIDGE'?'OPERATIONS_CHAMBER':projectId;
 const linked=db.chamber.links.find(l=>l.projectId===projectId||l.projectId===sourceId);
 if(linked){const p=db.projects.find(p=>p.id===linked.diamondgateId);if(p.deletedAt)throw Error('This linked project is in Trash. Restore it in DiamondGate before opening it.');db.selected=p.id;return {workspace:db,projectId:p.id,created:false};}
 const briefing=db.chamber.captures.briefings?.records.find(r=>r.projectId===sourceId)||db.chamber.captures.briefings?.records.find(r=>r.projectId===projectId);
 if(!briefing)throw Error('No source-reviewed briefing is imported for this project. Import a Chamber snapshot first.');
 const title=titles[projectId]||projectId.replaceAll('_',' '),fields=Object.fromEntries(KEYS.map(k=>[k,'']));
 Object.assign(fields,{project:title,source:'Imported Operations Chamber source-reviewed briefing; source assertions are not independently verified by DiamondGate.',captured:briefing.observedAt,workOrigin:'EXISTING WORK',state:briefing.accomplishment.text+'\nPublication report: '+briefing.publication.text+'\nHistorical source blocker (not established for a current task): '+briefing.blocker.text+'\nSource-proposed next step (not adopted): '+briefing.nextStep.text,completed:briefing.accomplishment.text,remaining:briefing.unfinished.text,blockers:'',artifacts:JSON.stringify({sourceHeads:briefing.sourceHeads,instruments:briefing.instruments}),next:'',authorization:'Context transfer only. No new implementation, publication, requirement adoption or result acceptance is granted.',unknown:'Current user intent has not been established in this DiamondGate record.',phase:'INVESTIGATION'});
 const p={id:idFactory(),title,request:'',automaticTracking:true,checkpoints:[{id:idFactory(),parent:null,at:now,raw:JSON.stringify(briefing,null,2),fields,note:'Source briefing imported for context; no requirements or results adopted.'}]};
 ensureFlow(p,db.localOwnerId||'local-workspace');requestDirection(p);
 db.projects.push(p);db.selected=p.id;db.updates[p.id]='';db.chamber.links.push({projectId:briefing.projectId,diamondgateId:p.id});validateWorkspace(db);return {workspace:db,projectId:p.id,created:true};
}
export function linkedProjectSummaries(db){
 validateWorkspace(db);return db.projects.filter(p=>!p.deletedAt).map(p=>{const f=p.checkpoints.at(-1).fields,link=db.chamber?.links.find(l=>l.diamondgateId===p.id);return {projectId:link?.projectId||'LOCAL_'+p.id,diamondgateId:p.id,title:projectName(p),local:true,source:'BROWSER_LOCAL_DIAMONDGATE',updatedAt:p.checkpoints.at(-1).at,goal:f.goal,state:f.state,next:f.next,blockers:f.blockers,phase:f.phase,adoptedRequirementCount:new Set((p.progress?.adoptions||[]).flatMap(a=>a.requirements)).size,humanAcceptanceCount:(p.progress?.decisions||[]).filter(d=>d.value==='ACCEPTED').length};});
}
