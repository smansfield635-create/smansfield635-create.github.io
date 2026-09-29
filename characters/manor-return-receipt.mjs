import {getDestination,resolveSceneRoute} from './destination-registry.mjs';
import {deriveNarrativeWorldState} from './narrative-world-state.mjs';

export const MANOR_RETURN_RECEIPT_SCHEMA='AUREN_C4_1_MANOR_RETURN_RECEIPT_V1';
const freeze=v=>Object.freeze(v);
const exact=(id,route)=>{const d=getDestination(id);return Boolean(d?.enterable&&d.sceneRoute===route&&resolveSceneRoute(id)===route);};
const signalsFrom=state=>{const d=state?.destinations?.manor;if(!d||!d.visited)return null;return freeze({physicalExpression:d.physicalExpression,arrivalExpression:d.arrivalExpression,worldEffects:freeze([...(d.worldEffects||[])]),reveals:freeze([...(d.reveals||[])]),sensoryState:d.sensoryState});};
export function createManorReturnReceipt({sourceDestinationId='auren',offeredDestinationId='manor',offeredRoute=null,visitedDestinationIds=[],returnDestinationId=null,returnRoute=null}={}){
 const manorRoute=resolveSceneRoute('manor'),aurenRoute=resolveSceneRoute('auren'),offerValid=sourceDestinationId==='auren'&&offeredDestinationId==='manor'&&offeredRoute===manorRoute&&exact('manor',offeredRoute);
 const visited=Array.isArray(visitedDestinationIds)?visitedDestinationIds:[];const world=deriveNarrativeWorldState(visited,'manor');const destinationVisited=offerValid&&world.visited.includes('manor');const worldSignals=destinationVisited?signalsFrom(world):null;
 const returnValid=returnDestinationId==='auren'&&returnRoute===aurenRoute&&exact('auren',returnRoute);const returned=Boolean(destinationVisited&&returnValid);const complete=Boolean(offerValid&&destinationVisited&&worldSignals&&returned);
 const reason=!offerValid?'OFFER_PROVENANCE_INVALID':!destinationVisited?'MANOR_VISIT_NOT_PROVEN':!returnValid?'AUREN_RETURN_NOT_PROVEN':'COMPLETE_WORLD_RETURN_PROVEN';
 const semantic=[MANOR_RETURN_RECEIPT_SCHEMA,sourceDestinationId,offeredDestinationId,offeredRoute||'',destinationVisited?'1':'0',world.version,returnDestinationId||'',returnRoute||'',returned?'1':'0'].join('|');
 return freeze({schema:MANOR_RETURN_RECEIPT_SCHEMA,receiptId:semantic,sourceDestinationId,offeredDestinationId,offeredRoute,destinationRegistryValidated:offerValid,destinationVisited,visitedDestinationId:destinationVisited?'manor':null,worldStateVersion:world.version,worldSignals,returnDestinationId:returnValid?'auren':null,returnRoute:returnValid?aurenRoute:null,returnRegistryValidated:returnValid,returned,complete,reason});
}
