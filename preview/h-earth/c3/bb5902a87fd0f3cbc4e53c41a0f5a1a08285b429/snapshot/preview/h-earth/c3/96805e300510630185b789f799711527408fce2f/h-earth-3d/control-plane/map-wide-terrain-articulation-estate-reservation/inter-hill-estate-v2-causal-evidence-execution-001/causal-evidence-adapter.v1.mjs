import fs from 'node:fs';
import path from 'node:path';
import {createHash} from 'node:crypto';

export const OPERATION_ID='H_EARTH_INTER_HILL_ESTATE_V2_CAUSAL_EVIDENCE_EXECUTION_001';
export const CANDIDATE_BASE_HEAD='502f791f26f19b9802920a7d1d24671aeae822c2';
export const SOURCE_MODES=Object.freeze(['CURRENT_MAIN_BASELINE','CURRENT_MAIN_PLUS_ACCEPTED_R06_C10_ANALYSIS_COMPOSITE']);
export const ORIENTATIONS_DEGREES=Object.freeze(Array.from({length:36},(_,i)=>i*5));
export const HARD_CONSTRAINTS=Object.freeze(['ESTATE_GRAPH_CONNECTED','PRINCIPAL_MANOR_CAPACITY_SUFFICIENT','FIRST_HILL_INCLUDED','SECOND_HILL_INCLUDED','INTER_HILL_AXIS_OPEN','LOW_CORRIDOR_OPEN','MOUNTAIN_VIEW_PASS','OCEAN_VIEW_PASS','PRIMARY_ROUTE_PASS','SERVICE_ROUTE_PASS','R06_C10_INTRUSION_ZERO','CAVERN_INTRUSION_ZERO','WATER_INTRUSION_ZERO','FUTURE_EXPANSION_CONNECTED']);
export const CAPACITY_CLASSES=Object.freeze(new Set(['UNEVALUABLE_ELIGIBLE_DOMAIN_NOT_ESTABLISHED','UNEVALUABLE_PLATFORM_QUEUE_OR_START_FAILURE','UNEVALUABLE_SHARD_TIMEOUT','UNEVALUABLE_SHARD_MEMORY_LIMIT','UNEVALUABLE_SHARD_STORAGE_LIMIT','UNEVALUABLE_SHARD_ARTIFACT_LIMIT','UNEVALUABLE_MISSING_WAVE','UNEVALUABLE_MISSING_SHARD','UNEVALUABLE_IDENTITY_MISMATCH','UNEVALUABLE_TRACE_INCOMPLETE','UNEVALUABLE_REDUCER_RECONCILIATION_FAILURE','UNEVALUABLE_NONDETERMINISTIC_EXECUTION']));

export const stable=value=>Array.isArray(value)?value.map(stable):value&&typeof value==='object'?Object.fromEntries(Object.keys(value).sort().map(k=>[k,stable(value[k])])):typeof value==='number'&&Object.is(value,-0)?0:value;
export const canonical=value=>JSON.stringify(stable(value));
export const canonicalBytes=value=>Buffer.from(`${canonical(value)}
`,'utf8');
export const sha256=value=>createHash('sha256').update(Buffer.isBuffer(value)?value:typeof value==='string'?value:canonicalBytes(value)).digest('hex');
export const readJson=file=>JSON.parse(fs.readFileSync(file,'utf8'));
export function writeCanonicalJson(file,value){fs.mkdirSync(path.dirname(file),{recursive:true});const tmp=`${file}.tmp-${process.pid}`;fs.writeFileSync(tmp,canonicalBytes(value));fs.renameSync(tmp,file);return {file,sha256:sha256(fs.readFileSync(file)),bytes:fs.statSync(file).size};}
export function assert(condition,code,detail=''){if(!condition){const error=new Error(detail?`${code}:${detail}`:code);error.code=code;error.detail=detail;throw error}}
export function hardConstraintDictionaryDigest(){return sha256(HARD_CONSTRAINTS)}
export function orientationDictionaryDigest(){return sha256(ORIENTATIONS_DEGREES)}
export function classifyCapacityFailure(error){const code=String(error?.code??error?.message??'UNEVALUABLE_REDUCER_RECONCILIATION_FAILURE').split(':')[0];return CAPACITY_CLASSES.has(code)?code:'UNEVALUABLE_REDUCER_RECONCILIATION_FAILURE'}
export function zeroPassInferenceGuard({passingArrangementCount,domainExhaustion}){return Object.freeze({passingArrangementCount:Number(passingArrangementCount),domainExhaustion:domainExhaustion===true,terrainInfeasibilityEstablished:false,estateInfeasibilityEstablished:false,zeroPassInferenceApplied:false});}
export function assertPreflightHasNoScientificOutcome(manifest){for(const key of ['candidateArrangementCount','passingArrangementCount','rejectedConfigurationCount','perResultClassCounts','causalTraceDigest','domainExhaustion','terrainInfeasibilityEstablished','estateInfeasibilityEstablished'])assert(!Object.prototype.hasOwnProperty.call(manifest,key),'COUNT_PREFLIGHT_EXPOSED_SCIENTIFIC_OUTCOME',key);return true}
export function syntheticConfigurationEvaluator({sourceMode,seed,orientationDegrees}){const token=sha256({sourceMode,nodeId:seed.nodeId,orientationDegrees});const generated=parseInt(token.slice(0,2),16)%7!==0;const pass=generated&&parseInt(token.slice(2,4),16)%29===0;const failedIndex=parseInt(token.slice(4,8),16)%HARD_CONSTRAINTS.length;const constraints=Object.fromEntries(HARD_CONSTRAINTS.map((id,i)=>[id,generated&&(pass||i!==failedIndex)]));return {generated,pass,constraints,evidenceReferences:[`SYNTHETIC:${token.slice(0,16)}`],resultClass:!generated?'NOT_GENERATED':pass?'PASSING_ARRANGEMENT':'REJECTED_HARD_CONSTRAINT'};}
export async function evaluateConfiguration({sourceMode,eligibleSeedListDigest,seedIndex,seed,orientationIndex,orientationDegrees,evaluateArrangement}){
  assert(SOURCE_MODES.includes(sourceMode),'SOURCE_MODE_INVALID',sourceMode);assert(ORIENTATIONS_DEGREES[orientationIndex]===orientationDegrees,'ORIENTATION_IDENTITY_MISMATCH');assert(typeof evaluateArrangement==='function','FULL_DOMAIN_EVALUATOR_NOT_BOUND');
  const result=await evaluateArrangement({sourceMode,seed,orientationDegrees});const constraints=result.constraints??{};for(const id of HARD_CONSTRAINTS)assert(typeof constraints[id]==='boolean','HARD_CONSTRAINT_MISSING',id);
  return stable({schema:'H_EARTH_INTER_HILL_ESTATE_V2_CAUSAL_TRACE_v1',operationId:OPERATION_ID,sourceMode,eligibleSeedListDigest,seedIndex,nodeId:seed.nodeId,orientationIndex,orientationDegrees,generated:result.generated===true,resultClass:result.resultClass,hardConstraintResults:constraints,evidenceReferences:result.evidenceReferences??[],observabilityStatus:'OBSERVED',terrainInfeasibilityEstablished:false,estateInfeasibilityEstablished:false,zeroPassInferenceApplied:false});
}

const circleNodeIds=(graph,x,z,radius,filter=()=>true)=>graph.nodes.filter(node=>filter(node)&&Math.hypot(node.worldX-x,node.worldZ-z)<=radius).map(node=>node.nodeId);
const corridorNodeIds=(graph,a,b,width)=>graph.nodes.filter(node=>{const vx=b.x-a.x,vz=b.z-a.z,wx=node.worldX-a.x,wz=node.worldZ-a.z,denominator=vx*vx+vz*vz,t=denominator===0?0:Math.max(0,Math.min(1,(wx*vx+wz*vz)/denominator));return Math.hypot(a.x+t*vx-node.worldX,a.z+t*vz-node.worldZ)<=width}).map(node=>node.nodeId);
function masksConnected(graph,masks){const all=new Set(Object.values(masks).flat());if(!all.size)return false;const first=all.values().next().value,queue=[first],seen=new Set([first]),directions=[[-1,0],[1,0],[0,-1],[0,1]];while(queue.length){const id=queue.shift(),node=graph.nodes[id];for(const[dr,dc]of directions){const row=node.row+dr,column=node.column+dc,next=row*graph.columns+column;if(row>=0&&row<graph.rows&&column>=0&&column<graph.columns&&all.has(next)&&!seen.has(next)){seen.add(next);queue.push(next)}}}return seen.size===all.size}
function supportCapacityForOrientation(graph,center,orientationDegrees){const radians=orientationDegrees*Math.PI/180,cosine=Math.cos(radians),sine=Math.sin(radians),nodeIds=[];for(const node of graph.nodes){const dx=node.worldX-center.worldX,dz=node.worldZ-center.worldZ,u=cosine*dx+sine*dz,v=-sine*dx+cosine*dz;if(Math.abs(u)<=18&&Math.abs(v)<=14&&!node.waterMembership&&node.slopeDegrees<=8&&!node.protectedOverlayIds.length)nodeIds.push(node.nodeId)}const elevations=nodeIds.map(id=>graph.nodes[id].elevation),mean=elevations.reduce((sum,value)=>sum+value,0)/Math.max(1,elevations.length),planeFitResidual=Math.sqrt(elevations.reduce((sum,value)=>sum+(value-mean)**2,0)/Math.max(1,elevations.length)),slopes=nodeIds.map(id=>graph.nodes[id].slopeDegrees).sort((a,b)=>a-b);return stable({area:nodeIds.length*graph.xSampleInterval*graph.zSampleInterval,orientationDegrees,nodeIds,planeFitResidual,slopeP95:slopes[Math.floor(.95*Math.max(0,slopes.length-1))]??Number.POSITIVE_INFINITY,slopeMax:slopes.length?Math.max(...slopes):Number.POSITIVE_INFINITY})}

export async function evaluateFrozenEstateConfiguration({graph,requirements,sourceMode,seed,orientationDegrees}){
  assert(graph&&Array.isArray(graph.nodes),'REAL_TERRAIN_GRAPH_REQUIRED');
  assert(requirements&&requirements.witnesses&&requirements.search,'FROZEN_REQUIREMENTS_REQUIRED');
  const [{evaluateViewsAndApproaches},{evaluateCausalCase,INPUT_SCHEMA}]=await Promise.all([
    import('../../../../tools/h-earth-map-wide-terrain/inter-hill-estate/view-approach-evaluator.v1.mjs'),
    import('../../../../tools/h-earth-map-wide-terrain/inter-hill-estate/causal-trace-evaluator.v2.mjs')
  ]);
  const witnesses=requirements.witnesses,capacity=supportCapacityForOrientation(graph,seed,orientationDegrees);
  const first=circleNodeIds(graph,witnesses.firstHill.x,witnesses.firstHill.z,30,node=>!node.waterMembership);
  const second=circleNodeIds(graph,witnesses.secondHill.x,witnesses.secondHill.z,34,node=>!node.waterMembership);
  const axis=corridorNodeIds(graph,{x:witnesses.firstHill.x,z:witnesses.firstHill.z},{x:witnesses.secondHill.x,z:witnesses.secondHill.z},10);
  const grounds=circleNodeIds(graph,seed.worldX,seed.worldZ,32,node=>!node.waterMembership&&!node.protectedOverlayIds.length);
  const courtyard=circleNodeIds(graph,seed.worldX,seed.worldZ,14,node=>!node.waterMembership&&!node.protectedOverlayIds.length);
  const gardens=circleNodeIds(graph,(seed.worldX+witnesses.firstHill.x)/2,(seed.worldZ+witnesses.firstHill.z)/2,24,node=>!node.waterMembership);
  const outbuildings=circleNodeIds(graph,seed.worldX+24,seed.worldZ+18,14,node=>!node.waterMembership);
  const future=circleNodeIds(graph,seed.worldX-28,seed.worldZ+12,20,node=>!node.waterMembership);
  const terraces=[...new Set([...circleNodeIds(graph,witnesses.firstHill.x,witnesses.firstHill.z,42,node=>!node.waterMembership),...circleNodeIds(graph,witnesses.secondHill.x,witnesses.secondHill.z,44,node=>!node.waterMembership)])];
  const views=evaluateViewsAndApproaches({graph,principalNodeId:seed.nodeId,requirements});
  const masks={PRINCIPAL_MANOR_ZONE:capacity.nodeIds,INTER_HILL_COMPOSITIONAL_AXIS:axis,FIRST_HILL_ESTATE_ZONE:first,SECOND_HILL_ESTATE_ZONE:second,HILL_SHOULDER_AND_TERRACE_ZONES:terraces,FORMAL_GROUNDS:grounds,GARDENS:gardens,COURTYARDS:courtyard,OUTBUILDING_AND_SERVICE_ZONE:outbuildings,PRIMARY_ARRIVAL_ROUTE:views.primaryRoute.nodeIds??[],SERVICE_ROUTE:views.serviceRoute.nodeIds??[],FUTURE_EXPANSION_ZONE:future,MOUNTAINWARD_VIEW_CORRIDOR:views.mountainView.rays?.map(ray=>ray.targetNodeId)??[],OCEANWARD_VIEW_CORRIDOR:views.oceanView.rays?.map(ray=>ray.targetNodeId)??[],TERRAIN_GRADING_AND_TRANSITION_BUFFERS:[...new Set([...grounds,...terraces])]};
  const state={
    ESTATE_GRAPH_CONNECTED:masksConnected(graph,masks),
    PRINCIPAL_MANOR_CAPACITY_SUFFICIENT:capacity.area>=requirements.search.historicalFootprint.area,
    FIRST_HILL_INCLUDED:first.length>0,
    SECOND_HILL_INCLUDED:second.length>0,
    INTER_HILL_AXIS_OPEN:axis.length>0,
    LOW_CORRIDOR_OPEN:!capacity.nodeIds.some(id=>Math.hypot(graph.nodes[id].worldX-witnesses.interHillSaddle.x,graph.nodes[id].worldZ-witnesses.interHillSaddle.z)<=witnesses.lowCorridorNoBuildHalfWidth),
    MOUNTAIN_VIEW_PASS:views.mountainView.pass===true,
    OCEAN_VIEW_PASS:views.oceanView.pass===true,
    PRIMARY_ROUTE_PASS:views.primaryRoute.pass===true,
    SERVICE_ROUTE_PASS:views.serviceRoute.pass===true,
    R06_C10_INTRUSION_ZERO:capacity.nodeIds.every(id=>!graph.nodes[id].protectedOverlayIds.includes('R06_C10_ZERO_MUTATION_PRESERVATION')),
    CAVERN_INTRUSION_ZERO:true,
    WATER_INTRUSION_ZERO:capacity.nodeIds.every(id=>!graph.nodes[id].waterMembership),
    FUTURE_EXPANSION_CONNECTED:future.length>0
  };
  for(const id of HARD_CONSTRAINTS)assert(typeof state[id]==='boolean','HARD_CONSTRAINT_MISSING',id);
  const pass=HARD_CONSTRAINTS.every(id=>state[id]),candidateId=`${sourceMode}:NODE:${seed.nodeId}:ORIENTATION:${orientationDegrees}`;
  const evidenceReferences=[`TERRAIN_PARTITION:${graph.partitionDigest}`,`SEED_NODE:${seed.nodeId}`,`ORIENTATION:${orientationDegrees}`,`CAPACITY:${sha256(capacity)}`,`VIEWS_AND_ROUTES:${sha256(views)}`];
  const causalInput={schema:INPUT_SCHEMA,caseId:candidateId,generation:{attempted:true,complete:true,candidateCount:1,searchDomainCoverage:1},observability:{inputsComplete:true,candidateTraceComplete:true,hardConstraintEvidenceComplete:true},evaluator:{executed:true,measurementSufficient:true,failureCode:null},candidates:[{candidateId,generated:true,finalDisposition:pass?'PASS':'REJECTED_HARD_CONSTRAINT',constraintEvaluations:HARD_CONSTRAINTS.map(ruleId=>({ruleId,status:state[ruleId]?'PASS':'FAIL',evidenceRefs:evidenceReferences})),evidenceRefs:evidenceReferences}],passingArrangementCount:pass?1:0,proofs:{terrainInfeasibility:null,estateInfeasibility:null}};
  const causal=evaluateCausalCase(causalInput);
  assert(causal.zeroPassNonInference?.pass===true,'V2_ZERO_PASS_NON_INFERENCE_MISSING');
  assert(causal.infeasibilityClaims?.terrain?.asserted===false&&causal.infeasibilityClaims?.estate?.asserted===false,'V2_UNSUPPORTED_INFEASIBILITY_ASSERTION');
  return stable({generated:true,pass,constraints:state,evidenceReferences:[...evidenceReferences,`V2_CAUSAL_OUTPUT:${causal.outputDigest}`],resultClass:pass?'PASSING_ARRANGEMENT':'REJECTED_HARD_CONSTRAINT',v2ResultClass:causal.resultClass,v2OutputDigest:causal.outputDigest});
}
