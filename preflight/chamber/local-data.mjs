import {readSharedWorkspace,chamberData,linkedProjectSummaries} from '../app/dist/workspace-bridge.mjs';
// Public display feeds live beside this page; credentials and private source files never enter this transport.
export const DISPLAY_FEEDS=Object.freeze({
 '/data.json':['control-plane.json','DGB_OPERATIONS_CHAMBER_DASHBOARD_DATA_v1'],
 '/api/study':['study.json','DGB_HOSTED_STUDY_CAPTURE_v1'],
 '/api/briefings':['briefings.json','DGB_PROJECT_BRIEFINGS_v1'],
 '/api/agent-checkpoints':['agents.json','DGB_CHAMBER_AGENT_DELIVERIES_v1']
});
export async function readPublishedFeed(route,{request=globalThis.fetch,signal}={}){
 if(!Object.hasOwn(DISPLAY_FEEDS,route))throw Error('UNKNOWN_CHAMBER_FEED');
 const [file,schema]=DISPLAY_FEEDS[route];
 const response=await request(new URL('./data/'+file,import.meta.url),{method:'GET',credentials:'omit',redirect:'error',cache:'no-store',signal:signal??AbortSignal.timeout(15000)});
 if(!response.ok)throw Error('CHAMBER_FEED_UNAVAILABLE');
 const data=await response.json();
 if(!data||data.schema!==schema)throw Error('CHAMBER_FEED_SCHEMA_MISMATCH');
 return {ok:true,status:200,json:async()=>structuredClone(data)};
}
export async function localFetch(route,options={}){
 if(!Object.hasOwn(options,'storage'))return readPublishedFeed(route,options);
 // Explicit storage is supported for existing local-workspace utilities, never as a silent network fallback.
 const storage=options.storage;
 const db=readSharedWorkspace(storage), captures=chamberData(db);
 const key={'/data.json':'controlPlane','/api/study':'study','/api/briefings':'briefings','/api/agent-checkpoints':'agents'}[route];
 let data=captures[key];
 if(key==='briefings'){
  data=data?structuredClone(data):{schema:'DGB_PROJECT_BRIEFINGS_v1',updatedAt:null,records:[]};
  for(const summary of linkedProjectSummaries(db)){
   let record=data.records.find(r=>r.projectId===summary.projectId);
   if(!record){record={projectId:summary.projectId,title:summary.title,localOnly:true,localProjects:[]};data.records.push(record);}
   (record.localProjects??=[]).push(summary);
  }
 }
 if(key==='agents'&&!data)data={schema:'DGB_CHAMBER_AGENT_DELIVERIES_v1',records:[]};
 return {ok:!!data,status:data?200:404,json:async()=>structuredClone(data)};
}
export function watchWorkspace(view,refresh){
 const listener=e=>{if(e.type!=='storage'||e.key===null||e.key==='diamondgate.projects.v2')void refresh();};
 view?.addEventListener('storage',listener);view?.addEventListener('diamondgate:workspace-updated',listener);
 return ()=>{view?.removeEventListener('storage',listener);view?.removeEventListener('diamondgate:workspace-updated',listener);};
}
