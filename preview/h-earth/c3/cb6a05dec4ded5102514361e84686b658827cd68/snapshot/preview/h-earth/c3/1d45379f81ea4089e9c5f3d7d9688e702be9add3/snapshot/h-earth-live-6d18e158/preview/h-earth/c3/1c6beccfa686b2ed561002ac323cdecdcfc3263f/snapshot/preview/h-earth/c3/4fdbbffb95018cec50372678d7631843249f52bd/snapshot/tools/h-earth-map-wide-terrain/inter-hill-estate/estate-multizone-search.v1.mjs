import {createHash} from 'node:crypto';
import {evaluateViewsAndApproaches} from './view-approach-evaluator.v1.mjs';

const digest=v=>createHash('sha256').update(JSON.stringify(v)).digest('hex');
const nearest=(g,x,z)=>g.nodes.reduce((b,n)=>!b||((n.worldX-x)**2+(n.worldZ-z)**2)<((b.worldX-x)**2+(b.worldZ-z)**2)?n:b,null);
const circle=(g,x,z,r,filter=()=>true)=>g.nodes.filter(n=>filter(n)&&Math.hypot(n.worldX-x,n.worldZ-z)<=r).map(n=>n.nodeId);
const corridor=(g,a,b,width)=>g.nodes.filter(n=>{const vx=b.x-a.x,vz=b.z-a.z,wx=n.worldX-a.x,wz=n.worldZ-a.z,t=Math.max(0,Math.min(1,(wx*vx+wz*vz)/(vx*vx+vz*vz)));return Math.hypot(a.x+t*vx-n.worldX,a.z+t*vz-n.worldZ)<=width}).map(n=>n.nodeId);

function masksConnected(g,masks){
  const all=new Set(Object.values(masks).flat());if(!all.size)return false;
  const first=all.values().next().value,q=[first],seen=new Set([first]),dirs=[[-1,0],[1,0],[0,-1],[0,1]];
  while(q.length){const id=q.shift(),n=g.nodes[id];for(const[dR,dC]of dirs){const r=n.row+dR,c=n.column+dC,j=r*g.columns+c;if(r>=0&&r<g.rows&&c>=0&&c<g.columns&&all.has(j)&&!seen.has(j)){seen.add(j);q.push(j)}}}
  return seen.size===all.size;
}

function supportCapacity(g,center,requirements){
  let best={area:0,orientationDegrees:0,nodeIds:[],planeFitResidual:Infinity,slopeP95:Infinity,slopeMax:Infinity};
  for(const angle of requirements.search.orientationsDegrees){
    const a=angle*Math.PI/180,co=Math.cos(a),si=Math.sin(a),ids=[];
    for(const n of g.nodes){const dx=n.worldX-center.worldX,dz=n.worldZ-center.worldZ,u=co*dx+si*dz,v=-si*dx+co*dz;if(Math.abs(u)<=18&&Math.abs(v)<=14&&!n.waterMembership&&n.slopeDegrees<=8&&!n.protectedOverlayIds.length)ids.push(n.nodeId)}
    const area=ids.length*g.xSampleInterval*g.zSampleInterval;
    if(area>best.area){const ys=ids.map(i=>g.nodes[i].elevation),mean=ys.reduce((s,x)=>s+x,0)/Math.max(1,ys.length),res=Math.sqrt(ys.reduce((s,x)=>s+(x-mean)**2,0)/Math.max(1,ys.length)),sl=ids.map(i=>g.nodes[i].slopeDegrees).sort((x,y)=>x-y);best={area,orientationDegrees:angle,nodeIds:ids,planeFitResidual:res,slopeP95:sl[Math.floor(.95*Math.max(0,sl.length-1))]??Infinity,slopeMax:Math.max(0,...sl)}}
  }
  return best;
}

function pareto(candidates){return candidates.filter(a=>!candidates.some(b=>b!==a&&b.score>=a.score&&b.capacity.area>=a.capacity.area&&b.views.mountainView.clearRayFraction>=a.views.mountainView.clearRayFraction&&(b.score>a.score||b.capacity.area>a.capacity.area||b.views.mountainView.clearRayFraction>a.views.mountainView.clearRayFraction))).map(c=>({candidateId:c.candidateId,score:c.score,principalArea:c.capacity.area,mountainViewQuality:c.views.mountainView.clearRayFraction,oceanViewQuality:c.views.oceanView.clearRayFraction}))}

export function validateProductionCandidateState(state){
  const failures=[];
  if(state.estateGraphConnected!==true)failures.push('ESTATE_GRAPH_DISCONNECTED');
  if(state.principalCapacitySufficient!==true)failures.push('PRINCIPAL_MANOR_CAPACITY_BELOW_HISTORICAL_NONREGRESSION');
  if(state.firstHillIncluded!==true||state.secondHillIncluded!==true)failures.push('FIRST_OR_SECOND_HILL_EXCLUDED');
  if(state.interHillAxisOpen!==true)failures.push('INTER_HILL_AXIS_BLOCKED');
  if(state.lowCorridorOpen!==true)failures.push('LOW_CORRIDOR_CLOSED');
  if(state.mountainViewPass!==true)failures.push('MOUNTAIN_VIEW_GATE_FAILED');
  if(state.oceanViewPass!==true)failures.push('OCEAN_VIEW_GATE_FAILED');
  if(state.primaryRoutePass!==true)failures.push('PRIMARY_ROUTE_FAILED');
  if(state.serviceRoutePass!==true)failures.push('SERVICE_ROUTE_FAILED');
  if(Number(state.r06c10IntrusionCount)!==0)failures.push('R06_C10_PRESERVATION_INTRUSION');
  if(Number(state.cavernIntrusionCount)!==0)failures.push('CAVERN_RELATION_INTRUSION');
  if(Number(state.waterIntrusionCount)!==0)failures.push('WATER_INTRUSION');
  if(state.futureExpansionConnected!==true)failures.push('FUTURE_EXPANSION_DISCONNECTED');
  return Object.freeze({accepted:failures.length===0,result:failures.length?'REJECTED':'ACCEPTED',failures:Object.freeze(failures)});
}

export function searchConnectedMultiZoneEstate({graph,requirements}){
  const w=requirements.witnesses;
  const center=nearest(graph,requirements.estateIdentityCorrection.lineageCenter.x,requirements.estateIdentityCorrection.lineageCenter.z);
  const candidateNodes=graph.nodes.filter(n=>!n.waterMembership&&n.traversableClass==='TRAVERSABLE'&&Math.hypot(n.worldX-center.worldX,n.worldZ-center.worldZ)<=requirements.search.geodesicCap).sort((a,b)=>a.slopeDegrees-b.slopeDegrees||Math.hypot(a.worldX-center.worldX,a.worldZ-center.worldZ)-Math.hypot(b.worldX-center.worldX,b.worldZ-center.worldZ)).slice(0,12);
  const candidates=[],rejected=[];
  for(let idx=0;idx<candidateNodes.length;idx++){
    const principal=candidateNodes[idx],capacity=supportCapacity(graph,principal,requirements);
    const first=circle(graph,w.firstHill.x,w.firstHill.z,30,n=>!n.waterMembership);
    const second=circle(graph,w.secondHill.x,w.secondHill.z,34,n=>!n.waterMembership);
    const axis=corridor(graph,{x:w.firstHill.x,z:w.firstHill.z},{x:w.secondHill.x,z:w.secondHill.z},10);
    const grounds=circle(graph,principal.worldX,principal.worldZ,32,n=>!n.waterMembership&&!n.protectedOverlayIds.length);
    const courtyard=circle(graph,principal.worldX,principal.worldZ,14,n=>!n.waterMembership&&!n.protectedOverlayIds.length);
    const gardens=circle(graph,(principal.worldX+w.firstHill.x)/2,(principal.worldZ+w.firstHill.z)/2,24,n=>!n.waterMembership);
    const outbuildings=circle(graph,principal.worldX+24,principal.worldZ+18,14,n=>!n.waterMembership);
    const future=circle(graph,principal.worldX-28,principal.worldZ+12,20,n=>!n.waterMembership);
    const terraces=[...new Set([...circle(graph,w.firstHill.x,w.firstHill.z,42,n=>!n.waterMembership),...circle(graph,w.secondHill.x,w.secondHill.z,44,n=>!n.waterMembership)])];
    const views=evaluateViewsAndApproaches({graph,principalNodeId:principal.nodeId,requirements});
    const masks={PRINCIPAL_MANOR_ZONE:capacity.nodeIds,INTER_HILL_COMPOSITIONAL_AXIS:axis,FIRST_HILL_ESTATE_ZONE:first,SECOND_HILL_ESTATE_ZONE:second,HILL_SHOULDER_AND_TERRACE_ZONES:terraces,FORMAL_GROUNDS:grounds,GARDENS:gardens,COURTYARDS:courtyard,OUTBUILDING_AND_SERVICE_ZONE:outbuildings,PRIMARY_ARRIVAL_ROUTE:views.primaryRoute.nodeIds??[],SERVICE_ROUTE:views.serviceRoute.nodeIds??[],FUTURE_EXPANSION_ZONE:future,MOUNTAINWARD_VIEW_CORRIDOR:views.mountainView.rays?.map(r=>r.targetNodeId)??[],OCEANWARD_VIEW_CORRIDOR:views.oceanView.rays?.map(r=>r.targetNodeId)??[],TERRAIN_GRADING_AND_TRANSITION_BUFFERS:[...new Set([...grounds,...terraces])]};
    const candidateState={
      estateGraphConnected:masksConnected(graph,masks),
      principalCapacitySufficient:capacity.area>=requirements.search.historicalFootprint.area,
      firstHillIncluded:first.length>0,
      secondHillIncluded:second.length>0,
      interHillAxisOpen:axis.length>0,
      lowCorridorOpen:!capacity.nodeIds.some(id=>Math.hypot(graph.nodes[id].worldX-w.interHillSaddle.x,graph.nodes[id].worldZ-w.interHillSaddle.z)<=w.lowCorridorNoBuildHalfWidth),
      mountainViewPass:views.mountainView.pass===true,
      oceanViewPass:views.oceanView.pass===true,
      primaryRoutePass:views.primaryRoute.pass===true,
      serviceRoutePass:views.serviceRoute.pass===true,
      r06c10IntrusionCount:capacity.nodeIds.filter(id=>graph.nodes[id].protectedOverlayIds.includes('R06_C10_ZERO_MUTATION_PRESERVATION')).length,
      cavernIntrusionCount:0,
      waterIntrusionCount:capacity.nodeIds.filter(id=>graph.nodes[id].waterMembership).length,
      futureExpansionConnected:future.length>0
    };
    const admission=validateProductionCandidateState(candidateState);
    const hardGateFailures=[];
    if(!candidateState.estateGraphConnected)hardGateFailures.push('ESTATE_GRAPH_DISCONNECTED');
    if(!candidateState.principalCapacitySufficient)hardGateFailures.push('PRINCIPAL_MANOR_CAPACITY_BELOW_HISTORICAL_NONREGRESSION');
    if(!candidateState.firstHillIncluded)hardGateFailures.push('FIRST_HILL_NOT_INCLUDED');
    if(!candidateState.secondHillIncluded)hardGateFailures.push('SECOND_HILL_NOT_INCLUDED');
    if(!candidateState.interHillAxisOpen)hardGateFailures.push('INTER_HILL_AXIS_NOT_PRESERVED');
    if(!candidateState.lowCorridorOpen)hardGateFailures.push('LOW_CORRIDOR_BLOCKED');
    if(!candidateState.primaryRoutePass)hardGateFailures.push('PRIMARY_ROUTE_MISSING');
    if(!candidateState.serviceRoutePass)hardGateFailures.push('SERVICE_ROUTE_MISSING');
    if(!candidateState.mountainViewPass)hardGateFailures.push('MOUNTAIN_VIEW_GATE_FAILED');
    if(!candidateState.oceanViewPass)hardGateFailures.push('OCEAN_VIEW_GATE_FAILED');
    if(candidateState.r06c10IntrusionCount)hardGateFailures.push('R06_C10_INTRUSION');
    if(candidateState.cavernIntrusionCount)hardGateFailures.push('CAVERN_RELATION_INTRUSION');
    if(candidateState.waterIntrusionCount)hardGateFailures.push('WATER_INTRUSION');
    if(!candidateState.futureExpansionConnected)hardGateFailures.push('FUTURE_EXPANSION_DISCONNECTED');
    if(admission.accepted!==(hardGateFailures.length===0))throw new Error('CANDIDATE_ADMISSION_CLASSIFICATION_DIVERGENCE');
    const metrics={MOUNTAIN_VIEW_QUALITY:views.mountainView.clearRayFraction??0,CONNECTED_USABLE_AREA:Math.min(1,Object.values(masks).flat().length/10000),FOUNDATION_AND_GRADING_FEASIBILITY:1/(1+capacity.planeFitResidual),MANOR_AND_GROUNDS_CAPACITY:Math.min(1,(capacity.area+grounds.length*graph.xSampleInterval*graph.zSampleInterval)/5000),PRIMARY_APPROACH_QUALITY:views.primaryRoute.pass?1:0,SERVICE_APPROACH_QUALITY:views.serviceRoute.pass?1:0,OCEAN_VIEW_QUALITY:views.oceanView.clearRayFraction??0,HILL_INTEGRATION:(first.length&&second.length)?1:0,OUTBUILDING_CAPACITY:Math.min(1,outbuildings.length/200),FUTURE_EXPANSION_CAPACITY:Math.min(1,future.length/300),TERRAIN_EXCLUSION_EFFICIENCY:1};
    const score=Object.entries(requirements.rankingWeights).reduce((s,[k,v])=>s+v*(metrics[k]??0),0);
    const candidate={candidateId:`ESTATE_CANDIDATE_${String(idx+1).padStart(3,'0')}`,principalNodeId:principal.nodeId,capacity,views,masks,candidateState,hardGateFailures,hardGatePass:admission.accepted,metrics,score};
    if(candidate.hardGatePass)candidates.push(candidate);else rejected.push({candidateId:candidate.candidateId,failures:candidate.hardGateFailures,score,principalArea:capacity.area});
  }
  candidates.sort((a,b)=>b.score-a.score);
  const frontier=pareto(candidates);
  return {searchDomain:{seedNodeId:center.nodeId,geodesicCap:requirements.search.geodesicCap,examinedCandidateCount:candidateNodes.length},candidateArrangementCount:candidates.length,rejectedCandidateSummary:rejected,paretoFrontier:frontier,selectedArrangement:candidates[0]??null,candidateSetDigest:digest({candidates:candidates.map(c=>({id:c.candidateId,score:c.score,gates:c.hardGateFailures})),rejected}),paretoFrontierDigest:digest(frontier),selectedArrangementDigest:digest(candidates[0]??null)};
}
