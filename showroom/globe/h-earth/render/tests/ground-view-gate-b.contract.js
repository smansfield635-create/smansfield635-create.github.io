/** Independent Phase 4 Gate B contract tests. */
import {
  H_EARTH_GROUND_VIEW_PHASE_1_CONFIGURATION as CONFIG,
  H_EARTH_GROUND_VIEW_DOMAIN_LAW as DOMAIN,
  H_EARTH_GROUND_VIEW_GAMMA_28_AUTHORITY as SEAM
} from '../../environment.js';
import {
  H_EARTH_GROUND_VIEW_GATE_B_GEOMETRY_CONTRACT_ID as CONTRACT_ID,
  H_EARTH_GROUND_VIEW_GATE_B_GEOMETRY_SOURCE_FILE as SOURCE_FILE,
  H_EARTH_GROUND_VIEW_GATE_B_GEOMETRY_CONTRACT as CONTRACT,
  H_EARTH_GROUND_VIEW_GATE_B_PRIMITIVE_IDS as IDS,
  constructHEarthGroundViewGateBGeometry,
  evaluateHEarthGroundViewGateBDeterminism
} from '../ground-view-gate-b.js';

export const H_EARTH_GROUND_VIEW_GATE_B_CONTRACT_TEST_ID =
  'H_EARTH_GROUND_VIEW_GATE_B_CONTRACT_TEST_GB_S01_THROUGH_GB_S17_v1';
export const H_EARTH_GROUND_VIEW_GATE_B_CONTRACT_TEST_SOURCE_FILE =
  '/showroom/globe/h-earth/render/tests/ground-view-gate-b.contract.js';

const STATUS = Object.freeze({ PASS:'PASS', FAIL:'FAIL', NOT_PERFORMED:'NOT_PERFORMED' });
const GROUP = Object.freeze({ STATIC:'STATIC_CONTRACT_TESTS', LOCAL:'LOCAL_MODULE_EXECUTION_TESTS', CONCRETE:'CONCRETE_MESH_EXECUTION_TESTS', DEFERRED:'DEFERRED_BROWSER_OR_CORRIDOR_TESTS' });
const FUTURE_TARGETS = Object.freeze(['WET_SAND','DRY_SAND','BEACH_DETAIL','BLUFF_MATERIAL','TIDE_POOL_ECOLOGY','MANOR_GROUNDS','PATHS','VEGETATION','STRUCTURES','DIAGNOSTIC_OVERLAYS']);

function freeze(value, seen=new WeakSet()) { if (value===null || typeof value!=='object' || Object.isFrozen(value)) return value; if (seen.has(value)) return value; seen.add(value); for (const nested of Object.values(value)) freeze(nested,seen); return Object.freeze(value); }
function equalArray(a,b){ return Array.isArray(a)&&Array.isArray(b)&&a.length===b.length&&a.every((v,i)=>v===b[i]); }
function unique(a){ return new Set(a).size===a.length; }
function jsonEqual(a,b){ return JSON.stringify(a)===JSON.stringify(b); }
function primitive(c,id){ return c?.primitives?.find((p)=>p.primitiveId===id)??null; }
function metadata(p){ return p?.geometry?.metadata??null; }
function finiteVector(v){ return v&&Number.isFinite(v.x)&&Number.isFinite(v.y)&&Number.isFinite(v.z); }
function signedY(a,b,c){ return (b.z-a.z)*(c.x-a.x)-(b.x-a.x)*(c.z-a.z); }
function triangleCheck(p){ const v=p?.geometry?.vertices,i=p?.geometry?.indices; if(!Array.isArray(v)||!Array.isArray(i)||i.length%3) return {passed:false,triangleCount:0,nonPositiveCount:0}; let bad=0; for(let o=0;o<i.length;o+=3){const a=v[i[o]],b=v[i[o+1]],c=v[i[o+2]];if(!finiteVector(a)||!finiteVector(b)||!finiteVector(c)||signedY(a,b,c)<=1e-12)bad++;} return {passed:bad===0,triangleCount:i.length/3,nonPositiveCount:bad}; }
function normalsFinite(p){ const n=p?.geometry?.normals,f=p?.geometry?.faceNormals; return (n===null||(Array.isArray(n)&&n.every(finiteVector)))&&(f===null||(Array.isArray(f)&&f.every(finiteVector))); }
function tangentClaim(v,seen=new WeakSet()){ if(v===null||typeof v!=='object'||seen.has(v))return false;seen.add(v);for(const[k,n]of Object.entries(v)){if(k.toLowerCase().includes('tangent')&&(n===true||(typeof n==='string'&&!['FALSE','NONE','NOT_CLAIMED','NOT_ESTABLISHED','C0_ONLY'].includes(n.toUpperCase()))))return true;if(tangentClaim(n,seen))return true;}return false; }
function record(id,group,status,summary,details=null,blocking=status===STATUS.FAIL){ return freeze({id,group,status,summary,details,blocking}); }
function snapshot(c){ const t=metadata(primitive(c,IDS.terrain)),w=metadata(primitive(c,IDS.water)),r=metadata(primitive(c,IDS.diagnosticRibbon)); return {inventory:c.receipt.primitiveInventory,primitiveIds:c.primitives.map((p)=>p.primitiveId),terrainVertices:t.vertexTable.map((x)=>x.vertexKey),terrainEdges:t.edgeTable.map((x)=>x.edgeId),terrainCells:t.cellTable.map((x)=>x.cellKey),terrainFaces:t.faceTable.map((x)=>x.faceId),waterVertices:w.vertexTable.map((x)=>x.vertexKey),waterEdges:w.edgeTable.map((x)=>x.edgeId),waterCells:w.cellTable.map((x)=>x.cellKey),waterFaces:w.faceTable.map((x)=>x.faceId),ribbonVertices:r.vertexTable.map((x)=>x.vertexKey),ribbonFaces:r.faceTable.map((x)=>x.faceId),indices:c.primitives.map((p)=>p.geometry.indices),meshIds:[c.receipt.terrainMeshIdentity,c.receipt.waterMeshIdentity,c.diagnosticRibbon.receipt.meshIdentity],receiptIdentity:c.receipt.deterministicConstructionIdentity}; }
function groupSummary(records,group){const r=records.filter((x)=>x.group===group);return freeze({expected:r.length,passed:r.filter((x)=>x.status===STATUS.PASS).length,failed:r.filter((x)=>x.status===STATUS.FAIL).length,notPerformed:r.filter((x)=>x.status===STATUS.NOT_PERFORMED).length});}

export function runHEarthGroundViewGateBContractTests(){
  const tests=[];
  const add=(id,group,ok,passText,failText,details=null)=>tests.push(record(id,group,ok?STATUS.PASS:STATUS.FAIL,ok?passText:failText,details));
  const defer=(id,group,text,details=null)=>tests.push(record(id,group,STATUS.NOT_PERFORMED,text,details,false));

  add('GB-C01',GROUP.STATIC,CONTRACT.contractId===CONTRACT_ID&&CONTRACT.sourceFile===SOURCE_FILE,'Geometry contract identity and source path are exact.','Geometry contract identity or source path is incorrect.');
  add('GB-C02',GROUP.STATIC,CONTRACT.neutralPrimitiveCount===3&&Object.keys(IDS).length===3,'Exactly three neutral primitives are declared.','The primitive contract is not exactly three.');
  add('GB-C03',GROUP.STATIC,[CONTRACT.admissionAuthority,CONTRACT.frameAuthority,CONTRACT.compositorAuthority,CONTRACT.routeAuthority,CONTRACT.rendererAuthority,CONTRACT.runtimeClaim,CONTRACT.visualClaim].every((v)=>v===false),'All downstream authority and runtime/visual claims remain withheld.','The Phase 4 claim ceiling is exceeded.');
  add('GB-C04',GROUP.STATIC,CONFIG.finiteOpenWaterBoundR===12&&CONFIG.vertexBudget===4096&&equalArray(CONFIG.nearshoreDPartition,[0,4,8,12,16,20,24,28])&&equalArray(CONFIG.openWaterRPartition,[0,4,8,12]),'The fixed Phase 1 configuration is unchanged.','The fixed Phase 1 configuration changed.');
  add('GB-C05',GROUP.STATIC,SEAM.vertexCount===25&&SEAM.edgeCount===24&&SEAM.consumerLaw?.consumerLocalReconstructionPermitted===false,'Canonical seam authority shape is exact.','Canonical seam authority shape is invalid.');
  add('GB-C06',GROUP.STATIC,DOMAIN.constructedNearshoreD?.maximum===28&&DOMAIN.certificationOnlyReserveD?.minimumExclusive===28&&DOMAIN.certificationOnlyReserveD?.maximumInclusive===30&&DOMAIN.certificationReserveGeometryEmissionAuthorized===false,'Nearshore and reserve domain law is exact.','Nearshore or reserve domain law is invalid.');

  let first=null,second=null,det=null;
  try{first=constructHEarthGroundViewGateBGeometry();add('GB-L01',GROUP.LOCAL,first?.valid===true,'The construction entry point executed successfully.','The construction entry point returned invalid.');}catch(error){tests.push(record('GB-L01',GROUP.LOCAL,STATUS.FAIL,'The construction entry point threw.',{name:error?.name,message:error?.message}));}
  try{second=constructHEarthGroundViewGateBGeometry();add('GB-L02',GROUP.LOCAL,second?.valid===true&&Object.isFrozen(second),'A second frozen construction executed successfully.','The second construction was invalid or unfrozen.');}catch(error){tests.push(record('GB-L02',GROUP.LOCAL,STATUS.FAIL,'The second construction threw.',{name:error?.name,message:error?.message}));}
  try{det=evaluateHEarthGroundViewGateBDeterminism();add('GB-L03',GROUP.LOCAL,det?.passed===true,'The module determinism entry point executed and passed.','The module determinism entry point failed.');}catch(error){tests.push(record('GB-L03',GROUP.LOCAL,STATUS.FAIL,'The determinism entry point threw.',{name:error?.name,message:error?.message}));}

  if(!first?.valid){for(let i=1;i<=17;i++)defer(`GB-S${String(i).padStart(2,'0')}`,GROUP.CONCRETE,'Concrete mesh construction was unavailable.');defer('GB-M01',GROUP.CONCRETE,'Measured checks were unavailable.');}
  else{
    const terrain=primitive(first,IDS.terrain),water=primitive(first,IDS.water),ribbon=primitive(first,IDS.diagnosticRibbon);
    const tm=metadata(terrain),wm=metadata(water),rm=metadata(ribbon),corr=first.waterTopology.canonicalResourceCorrespondence;
    const nv=wm.vertexTable.filter((x)=>x.d!==null),nc=wm.cellTable.filter((x)=>x.regionId==='NEARSHORE');
    const maxD=Math.max(...nv.map((x)=>x.d));
    add('GB-S01',GROUP.CONCRETE,maxD===28&&!nv.some((x)=>x.d>28)&&!nc.some((x)=>x.coordinateRange[1]>28),'Nearshore geometry terminates exactly at d=28.','Nearshore geometry exceeds or fails to reach d=28.',{nearshoreMaximumD:maxD});
    const rv=nv.filter((x)=>x.d>28&&x.d<=30),rc=nc.filter((x)=>x.coordinateRange[1]>28&&x.coordinateRange[0]<30),rcids=new Set(rc.map((x)=>x.cellKey)),rf=wm.faceTable.filter((x)=>rcids.has(x.cellKey));
    add('GB-S02',GROUP.CONCRETE,rv.length===0&&rf.length===0&&first.receipt.certificationReserveEmissionCount===0,'The certification reserve emits no vertices or faces.','Certification-reserve geometry was emitted.',{certificationReserveVertexCount:rv.length,certificationReserveFaceCount:rf.length});
    const svid=SEAM.vertexTable.map((x)=>x.vertexId),spar=SEAM.parameterTable.map((x)=>x.s);
    add('GB-S03',GROUP.CONCRETE,svid.length===25&&unique(svid)&&unique(spar)&&corr.vertexRecords.length===25,'The canonical seam has 25 unique vertex identities.','Canonical seam vertex identities are incomplete or duplicated.');
    const nsrow=wm.nearshoreGrid.at(-1),owrow=wm.openWaterGrid[0];
    add('GB-S04',GROUP.CONCRETE,equalArray(nsrow,owrow)&&corr.nearshoreReferencesExactPhysicalRow===true&&corr.openWaterReferencesExactPhysicalRow===true&&corr.resourceIdentitySharingIsPhysical===true&&corr.vertexRecords.every((x,i)=>x.physicalIndex===nsrow[i]&&x.canonicalResource===SEAM.vertexTable[i]&&x.canonicalVertexId===svid[i]),'Nearshore and open water share exact canonical seam vertex resources.','Shared seam vertex identity failed.');
    const seid=SEAM.edgeTable.map((x)=>x.edgeId);
    add('GB-S05',GROUP.CONCRETE,corr.edgeRecords.length===24&&corr.edgeRecords.every((x,i)=>x.canonicalResource===SEAM.edgeTable[i]&&x.canonicalEdgeId===seid[i]),'Nearshore and open water share exact canonical seam edge resources.','Shared seam edge identity failed.');
    add('GB-S06',GROUP.CONCRETE,SEAM.edgeTable.length===24&&unique(seid)&&SEAM.edgeTable.every((x,i)=>x.ordinal===i&&x.startVertexId===svid[i]&&x.endVertexId===svid[i+1]&&x.orientation==='WEST_TO_EAST'),'All 24 seam intervals are unique, complete, and west-to-east.','The seam interval ledger is incomplete, duplicated, or misordered.');
    const se=wm.edgeTable.filter((x)=>x.canonicalSharedSeam),faceById=new Map(wm.faceTable.map((x)=>[x.faceId,x]));
    add('GB-S07',GROUP.CONCRETE,se.length===24&&se.every((x)=>x.incidentFaceIds.length===2&&equalArray(x.incidentFaceIds.map((id)=>faceById.get(id)?.regionId).sort(),['NEARSHORE','OPEN_WATER']))&&first.receipt.consumerLocalSeamResourceCount===0,'Every seam edge has matched incidence with no T-junction or local seam resource.','Seam incidence, T-junction, or local-resource validation failed.');
    let ordered=true;for(let r=1;r<wm.openWaterGrid.length;r++)for(let s=0;s<wm.openWaterGrid[r].length;s++)if(!(water.geometry.vertices[wm.openWaterGrid[r][s]].z>water.geometry.vertices[wm.openWaterGrid[r-1][s]].z))ordered=false;
    add('GB-S08',GROUP.CONCRETE,ordered,'Increasing r strictly increases waterward world-z.','Strict open-water ordering failed.');
    let noReturn=true;const seamSet=new Set(owrow);for(let r=1;r<wm.openWaterGrid.length;r++)for(let s=0;s<wm.openWaterGrid[r].length;s++){const pi=wm.openWaterGrid[r][s],x=wm.vertexTable[pi],p=water.geometry.vertices[pi],sp=water.geometry.vertices[owrow[s]];if(seamSet.has(pi)||x.canonicalSharedSeam===true||x.region!=='OPEN_WATER'||!(x.r>0)||!(p.z>sp.z))noReturn=false;}
    add('GB-S09',GROUP.CONCRETE,noReturn,'No positive-r vertex returns to or assumes Γ_28 identity.','A positive-r vertex returned to or assumed Γ_28 identity.');
    const ni=new Set(wm.nearshoreGrid.slice(0,-1).flat()),oi=new Set(wm.openWaterGrid.slice(1).flat()),iv=[...ni].filter((x)=>oi.has(x)),nf=new Set(wm.faceRegionTables.nearshore),of=new Set(wm.faceRegionTables.openWater),iff=[...nf].filter((x)=>of.has(x));
    add('GB-S10',GROUP.CONCRETE,iv.length===0&&iff.length===0&&wm.noNearshoreOpenWaterInteriorOverlap===true,'Nearshore and positive-r open-water interiors are disjoint.','Nearshore and open-water interiors overlap.',{sharedInteriorVertexCount:iv.length,sharedInteriorFaceCount:iff.length});
    const regions=first.terrainTopology.receipt.terrainRegionIds;
    add('GB-S11',GROUP.CONCRETE,first.terrainTopology.receipt.singlePhysicalTopology===true&&tm.topologyClass==='ONE_PHYSICAL_TERRAIN_TOPOLOGY'&&tm.overlappingSemanticGroundMeshes===false&&equalArray(regions,['BEACH','BLUFF','TIDE_POOL_001','TIDE_POOL_002','TIDE_POOL_003'])&&regions.every((id)=>Array.isArray(tm.faceRegionTable[id])),'All terrain fields address one physical topology.','Terrain semantics are not carried by one physical topology.');
    add('GB-S12',GROUP.CONCRETE,second?.valid===true&&jsonEqual(snapshot(first),snapshot(second)),'Two full constructions have identical resources, indices, mesh IDs, and receipt identity.','Full reconstruction is not deterministic.');
    defer('GB-S13',GROUP.CONCRETE,'No bounded refinement execution entry point exists; static declarations were not promoted to PASS.',{staticRefinementDeclarationsWereNotPromotedToPass:true});
    const orient=first.primitives.map(triangleCheck);
    add('GB-S14',GROUP.CONCRETE,tm.diagonalLaw==='LOWER_LEFT_TO_UPPER_RIGHT'&&wm.diagonalLaw==='LOWER_LEFT_TO_UPPER_RIGHT'&&first.primitives.every((p,i)=>second?.primitives[i]&&equalArray(p.geometry.indices,second.primitives[i].geometry.indices))&&orient.every((x)=>x.passed)&&first.primitives.every(normalsFinite),'Triangulation, winding, nonzero projected area, and generated normals are valid.','Triangulation, winding, area, or normals failed.',{orientationResults:orient});
    const outer=wm.openWaterGrid.at(-1),corners=[outer[0],outer.at(-1)],boundary=wm.edgeTable.filter((x)=>x.incidentFaceIds.length===1),inc=corners.map((pi)=>boundary.filter((x)=>x.endpointPhysicalIndices.includes(pi)).length);
    add('GB-S15',GROUP.CONCRETE,unique(corners)&&inc.every((x)=>x===2)&&!tangentClaim(wm),'Both finite outer corners are lawful C0-only corners with no tangent-continuity claim.','Outer-corner C0 classification or tangent-claim exclusion failed.',{classification:'C0_ONLY',outerCornerBoundaryIncidences:inc,tangentContinuityClaimed:tangentClaim(wm)});
    const distinction=wm.analyticalPhysicalDistinction??wm.physicalLinearizationClass??wm.analyticalMapRelationship??null;
    add('GB-S16',GROUP.CONCRETE,distinction==='PHYSICAL_LINEAR_TRIANGLES_APPROXIMATE_NONLINEAR_ANALYTICAL_IMAGE_SUBPATCHES'||distinction==='APPROXIMATION_OF_NONLINEAR_ANALYTICAL_MAP','Metadata explicitly preserves the analytical/physical distinction.','Mesh metadata does not explicitly state that physical linear triangles approximate nonlinear analytical image subpatches.',{requiredClassification:'PHYSICAL_LINEAR_TRIANGLES_APPROXIMATE_NONLINEAR_ANALYTICAL_IMAGE_SUBPATCHES',observedClassification:distinction});
    add('GB-S17',GROUP.CONCRETE,unique(tm.vertexTable.map((x)=>x.vertexKey))&&unique(tm.edgeTable.map((x)=>x.edgeId))&&unique(tm.cellTable.map((x)=>x.cellKey))&&unique(tm.faceTable.map((x)=>x.faceId))&&tm.terrainTruthAttachmentSeparation?.materialAttachment?.ownedHere===false&&tm.terrainTruthAttachmentSeparation?.objectAttachment?.ownedHere===false&&tm.terrainTruthAttachmentSeparation?.rendererPresentation?.ownedHere===false,'Stable terrain keys provide downstream attachment addresses without constructing later members.','Stable attachment addressing or truth/attachment separation failed.',{addressableTargets:FUTURE_TARGETS,constructedTargets:[]});
    add('GB-M01',GROUP.CONCRETE,first.receipt.neutralPrimitiveCount===3&&first.receipt.physicalVertexCount===2334&&first.receipt.physicalTriangleCount===4368&&first.receipt.physicalVertexCount<=4096&&first.receipt.canonicalSeamUniqueVertexCount===25&&first.receipt.canonicalSeamUniqueEdgeCount===24&&first.receipt.consumerLocalSeamResourceCount===0&&first.receipt.duplicateSeamIdentityCount===0&&first.diagnosticRibbon.receipt.ownsSeamResources===false&&rm.redefinesShorelineGeometry===false,'All required measured Phase 3 values match the executed mesh.','One or more measured Phase 3 values are incorrect.',{neutralPrimitiveCount:first.receipt.neutralPrimitiveCount,physicalVertexCount:first.receipt.physicalVertexCount,physicalTriangleCount:first.receipt.physicalTriangleCount,vertexBudget:first.receipt.vertexBudget,canonicalSeamUniqueVertexCount:first.receipt.canonicalSeamUniqueVertexCount,canonicalSeamUniqueEdgeCount:first.receipt.canonicalSeamUniqueEdgeCount,consumerLocalSeamResourceCount:first.receipt.consumerLocalSeamResourceCount,duplicateSeamIdentityCount:first.receipt.duplicateSeamIdentityCount,diagnosticOwnsSeamResources:first.diagnosticRibbon.receipt.ownsSeamResources,diagnosticRedefinesShoreline:rm.redefinesShorelineGeometry});
  }

  for(const [id,name] of [['GB-D01','PACKET_002_EXECUTION'],['GB-D02','WEST_ADMISSION_EXECUTION'],['GB-D03','ADMITTED_FRAME_EXECUTION'],['GB-D04','COMPOSITOR_EXECUTION'],['GB-D05','RENDERER_EXECUTION'],['GB-D06','BROWSER_ROUTE_EXECUTION'],['GB-D07','VISUAL_INSPECTION']])defer(id,GROUP.DEFERRED,`${name} is outside Phase 4.`);
  const blocking=tests.filter((x)=>x.status===STATUS.FAIL&&x.blocking===true);
  return freeze({testSuiteId:H_EARTH_GROUND_VIEW_GATE_B_CONTRACT_TEST_ID,occurrenceId:CONFIG.occurrenceId,executionClassification:'LOCAL_CONTRACT_AND_CONCRETE_MESH_EXECUTION_NO_CORRIDOR_OR_BROWSER',result:blocking.length?'FAIL':tests.some((x)=>x.status===STATUS.NOT_PERFORMED)?'PARTIAL':'PASS',groups:{staticContractTests:groupSummary(tests,GROUP.STATIC),localModuleExecutionTests:groupSummary(tests,GROUP.LOCAL),concreteMeshExecutionTests:groupSummary(tests,GROUP.CONCRETE),deferredBrowserOrCorridorTests:groupSummary(tests,GROUP.DEFERRED)},records:tests,blockingFindings:blocking,measurements:first?.valid?{physicalVertexCount:first.receipt.physicalVertexCount,physicalTriangleCount:first.receipt.physicalTriangleCount,vertexBudget:first.receipt.vertexBudget,vertexBudgetPassed:first.receipt.vertexBudgetPassed}:null,packet002Execution:'NOT_PERFORMED',admissionCorridorExecution:'NOT_PERFORMED',browserExecution:'NOT_PERFORMED',visualResult:'NOT_PRODUCED'});
}

export const H_EARTH_GROUND_VIEW_GATE_B_CONTRACT_TEST_DEFINITION = freeze({testSuiteId:H_EARTH_GROUND_VIEW_GATE_B_CONTRACT_TEST_ID,sourceFile:H_EARTH_GROUND_VIEW_GATE_B_CONTRACT_TEST_SOURCE_FILE,formalTestIds:Array.from({length:17},(_,i)=>`GB-S${String(i+1).padStart(2,'0')}`),measuredTestIds:['GB-M01'],constructionEntryPoint:'runHEarthGroundViewGateBContractTests',consumesCommittedEnvironmentAuthority:true,consumesCommittedGateBGeometryProvider:true,reproducesMathematics:false,reproducesTopologyConstructors:false,packet002Authority:false,admissionAuthority:false,frameAuthority:false,compositorAuthority:false,rendererAuthority:false,routeAuthority:false,visualClaim:false});
export default H_EARTH_GROUND_VIEW_GATE_B_CONTRACT_TEST_DEFINITION;
