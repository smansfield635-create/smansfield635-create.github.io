import {connection} from './connection.mjs';
import {readSharedWorkspace,chamberData,linkedProjectSummaries} from '../app/dist/workspace-bridge.mjs';
// Production reads use the authenticated service connection. Explicit storage is retained only for legacy import tests.
export async function localFetch(route,options={}){
 if(connection&&!Object.hasOwn(options,'storage'))return connection.read(route);
 const storage=options.storage??globalThis.localStorage;
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
 view?.addEventListener('chamber:connected',listener);view?.addEventListener('chamber:disconnected',listener);view?.addEventListener('storage',listener);view?.addEventListener('diamondgate:workspace-updated',listener);
 return ()=>{view?.removeEventListener('chamber:connected',listener);view?.removeEventListener('chamber:disconnected',listener);view?.removeEventListener('storage',listener);view?.removeEventListener('diamondgate:workspace-updated',listener);};
}
