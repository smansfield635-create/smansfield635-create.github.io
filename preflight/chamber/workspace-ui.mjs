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
 host.innerHTML=`<p>Project information loads from this website. Refresh checks the latest published records; original source dates remain visible.</p><details><summary>Update published information</summary><p>Edit the display records in the website repository, then publish through the existing website release process. No Work Mode session or backup import is required. Source-linked evidence may require separate access at its original repository.</p><a href="https://github.com/smansfield635-create/smansfield635-create.github.io/tree/main/preflight/chamber/data" target="_blank" rel="noopener noreferrer">Open Chamber data in GitHub →</a></details>`;
}
