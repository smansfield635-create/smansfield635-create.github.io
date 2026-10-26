import {connection} from './connection.mjs';
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
 host.innerHTML=`<style>#workspace-controls{border:1px solid #344f55;border-radius:14px;background:#13252d;padding:16px 18px;color:#d9e7ea}#workspace-controls button{background:#19383c;color:#e2f6ed;border:1px solid #567b75;border-radius:9px;padding:10px 16px;min-height:44px;cursor:pointer;font:inherit;margin-right:10px}#workspace-controls button:focus-visible{outline:3px solid #a4e2d0;outline-offset:3px}#workspace-controls p{color:#b3c9d0;font-size:13px}</style><button id="connect-chamber">Connect Chamber</button><button id="disconnect-chamber">Disconnect</button><p id="connection-status" role="status" aria-live="polite">Connect to load your saved project information.</p><p>Sign in to your existing private Chamber in the connection tab and keep it open. Refresh retrieves saved source records; their original observation dates remain visible.</p>`;
 document.getElementById('connect-chamber').onclick=()=>connection.connect();
 document.getElementById('disconnect-chamber').onclick=()=>connection.disconnect();
}
