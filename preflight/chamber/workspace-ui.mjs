import {WORKSPACE_KEY,WORKSPACE_EVENT,readSharedWorkspace,writeSharedWorkspace,workspaceBackup,decodeWorkspaceBackup,mergeWorkspaceBackup,openChamberProject} from '../app/dist/workspace-bridge.mjs';
const SOURCE_SCHEMAS=Object.freeze({
 DGB_OPERATIONS_CHAMBER_DASHBOARD_DATA_v1:'controlPlane',
 DGB_HOSTED_STUDY_CAPTURE_v1:'study',
 DGB_PROJECT_BRIEFINGS_v1:'briefings',
 DGB_CHAMBER_AGENT_DELIVERIES_v1:'agents'
});
export function sourceResponseToSnapshot(raw,capturedAt=new Date().toISOString()){
 if(typeof raw!=='string'||!raw.trim()||raw.length>16000000)throw Error('Paste one current Operations Chamber data response (maximum 16 MB).');
 if(typeof capturedAt!=='string'||!Number.isFinite(Date.parse(capturedAt)))throw Error('Snapshot handling time is invalid.');
 let source;try{source=JSON.parse(raw);}catch{throw Error('The response is not valid JSON.');}
 if(!source||typeof source!=='object'||Array.isArray(source)||!Object.prototype.hasOwnProperty.call(SOURCE_SCHEMAS,source.schema))
  throw Error('This is not one of the four supported Operations Chamber source captures.');
 return JSON.stringify({schema:'diamondgate.chamber-capture.v1',capturedAt,captures:{[SOURCE_SCHEMAS[source.schema]]:source}});
}
const host=typeof document==='undefined'?null:document.getElementById('workspace-controls');
if(host){
 host.innerHTML=\`<style>
 #workspace-controls{border:1px solid #344f55;border-radius:14px;background:#13252d;padding:16px 18px;color:#d9e7ea}
 #workspace-controls .chamber-actions{display:flex;gap:10px;flex-wrap:wrap;align-items:center}
 #workspace-controls button{background:#19383c;color:#e2f6ed;border:1px solid #567b75;border-radius:9px;padding:10px 13px;min-height:44px;cursor:pointer;font:inherit;font-size:13px}
 #workspace-controls button:hover{background:#245048}
 #workspace-controls button:focus-visible,#workspace-controls textarea:focus-visible{outline:3px solid #a4e2d0;outline-offset:3px}
 #workspace-controls textarea{display:block;width:100%;min-height:120px;resize:vertical;background:#0b1820;color:#f1f7f7;border:1px solid #547079;border-radius:9px;padding:12px;font:12px/1.5 ui-monospace,monospace}
 #workspace-controls details{margin-top:10px;border-top:1px solid #34505a;padding-top:8px}
 #workspace-controls small,#workspace-controls p{color:#b3c9d0;font-size:12px}
 </style><div class="chamber-actions"><button id="workspace-import">Import workspace backup</button><button id="workspace-export">Download combined backup</button><a href="../app/">Open DiamondGate</a><input id="workspace-file" type="file" accept=".json,application/json" hidden></div>
 <details id="source-response-panel"><summary>Update from a current Chamber source response</summary><p>Copy the complete JSON payload from a connected Operations Chamber read in ordinary ChatGPT. Supports project briefings, activity capture, continuing study or agent reports, one at a time. Source dates are preserved.</p><label for="source-response-input">Operations Chamber response JSON</label><textarea id="source-response-input" spellcheck="false" maxlength="16000000" placeholder='{"schema":"DGB_PROJECT_BRIEFINGS_v1",...}'></textarea><p><button id="source-response-apply">Validate and import response</button></p></details>
 <p>Saved only in this browser. Reload reopens saved data; it does not fetch new observations. This unlisted website route is not authenticated, and browser storage is not account-private. Do not use a shared browser profile.</p><p id="workspace-message" role="status" aria-live="polite"></p>\`;
 const message=document.getElementById('workspace-message'),input=document.getElementById('workspace-file');
 const report=text=>message.textContent=text;
 document.getElementById('workspace-import').onclick=()=>input.click();
 function updateFromIncoming(incoming){
  const expectedRaw=localStorage.getItem(WORKSPACE_KEY),current=readSharedWorkspace(localStorage);
  const merged=mergeWorkspaceBackup(current,incoming);
  writeSharedWorkspace(localStorage,merged.workspace,{expectedRaw});
  window.dispatchEvent(new Event(WORKSPACE_EVENT));
  document.getElementById('refresh')?.click();
  return merged;
 }
 input.onchange=async()=>{const file=input.files[0];if(!file)return;try{if(file.size>32000000)throw Error('Backup exceeds the 32 MB limit.');const merged=updateFromIncoming(decodeWorkspaceBackup(await file.text()));report('Imported safely. '+merged.addedProjects.length+' projects added; '+merged.updatedCaptures.length+' observation feeds updated. Existing project records were preserved.');}catch(e){report('Import cancelled: '+e.message);}finally{input.value='';}};
 document.getElementById('source-response-apply').onclick=()=>{
  try{
   const incoming=decodeWorkspaceBackup(sourceResponseToSnapshot(document.getElementById('source-response-input').value));
   const merged=updateFromIncoming(incoming);
   document.getElementById('source-response-input').value='';
   report(merged.updatedCaptures.length?'Current source response imported. '+merged.updatedCaptures.join(', ')+' updated; other records preserved.':'No newer source observation. Existing saved records preserved.');
  }catch(e){report('Source response not imported: '+e.message);}
 };
 document.getElementById('workspace-export').onclick=()=>{try{const blob=new Blob([workspaceBackup(readSharedWorkspace(localStorage))],{type:'application/json'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='DiamondGate-Chamber-workspace-'+new Date().toISOString().slice(0,10)+'.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);report('Combined backup downloaded, including projects, drafts, history and Chamber observations.');}catch(e){report('Backup could not be created: '+e.message);}};
 const container=document.getElementById('detail-content');
 function attach(){const detail=document.getElementById('project-briefing');if(!detail)return;const id=detail.dataset.briefProject;if(!id||id.startsWith('LOCAL_')||detail.querySelector('[data-open-diamondgate]'))return;const b=document.createElement('button');b.dataset.openDiamondgate=id;b.textContent='Continue this project in DiamondGate →';b.onclick=()=>{try{const expectedRaw=localStorage.getItem(WORKSPACE_KEY),result=openChamberProject(readSharedWorkspace(localStorage),id);writeSharedWorkspace(localStorage,result.workspace,{expectedRaw});location.href='../app/?project='+encodeURIComponent(result.projectId);}catch(e){report(e.message);}};detail.append(b);}
 if(container){new MutationObserver(attach).observe(container,{subtree:true,childList:true,attributes:true,attributeFilter:['data-brief-project']});attach();}
 window.addEventListener('storage',e=>{if(e.key===WORKSPACE_KEY)document.getElementById('refresh')?.click();});
}
