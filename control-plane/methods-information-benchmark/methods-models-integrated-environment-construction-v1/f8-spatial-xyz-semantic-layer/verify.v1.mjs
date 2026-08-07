import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {execFileSync} from 'node:child_process';
import {projectScene,authorizeScientificRelation,authorizeProjection,validateCameraRequest,loadAuthority} from './scene-projector.v1.mjs';

const here=path.dirname(fileURLToPath(import.meta.url));
const root=path.dirname(here);
const pre=path.join(root,'pre-f8-corrective-construction-v1');
const repoRoot=process.cwd();
const read=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const local=n=>read(path.join(here,n));
const upstream=n=>read(path.join(pre,n));
const ok=(v,m)=>{if(!v)throw new Error(m)};
const eq=(a,b,m)=>ok(JSON.stringify(a)===JSON.stringify(b),m);
const gitBlob=(repoPath)=>execFileSync('git',['rev-parse',`HEAD:${repoPath}`],{cwd:repoRoot,encoding:'utf8'}).trim();

const source=local('source-bindings.v1.json');
const semantic=local('spatial-semantic-contract.v1.json');
const nodeRegistry=local('spatial-node-registry.v1.json');
const relationContract=local('spatial-relation-contract.v1.json');
const geometry=local('geometry-contract.v1.json');
const text=local('text-first-equivalence-contract.v1.json');
const controls=local('spatial-control-binding.v1.json');
const fixtures=local('conformance-fixtures.v1.json');
const receipt=local('f8-terminal-receipt.v1.json');
const authority=loadAuthority();
const scene=projectScene();

const THREE=['CANONICAL_SCIENTIFIC_OBJECTS','TYPED_SCIENTIFIC_RELATIONS','GOVERNED_CROSS_ESTATE_PROJECTIONS'];
eq(source.authoritativeInputClasses,THREE,'source input-class drift');
eq(semantic.authoritativeInputClasses,THREE,'semantic input-class drift');
eq(receipt.authoritativeInputClasses,THREE,'receipt input-class drift');
eq(scene.authoritativeInputClasses,THREE,'scene input-class drift');
ok(authority.preF8Receipt.status==='PASS_PRE_F8_CORRECTIVE_CONSTRUCTION_v1','pre-F8 receipt not PASS');
ok(authority.preF8Receipt.laneA.portfolioStudyCount===22,'study count drift');
ok(authority.preF8Receipt.laneA.levelAStatefulCount===16,'Level-A count drift');
ok(authority.preF8Receipt.laneB.canonicalClaimCount===19,'claim count drift');
ok(authority.preF8Receipt.laneB.typedResultRelationCount===38,'relation count drift');
ok(authority.studies.index.totalStudyCount===22 && authority.studies.items.length===22,'study registry mismatch');
ok(authority.relations.index.totalRelationCount===38 && authority.relations.items.length===38,'typed relation registry mismatch');
ok(authority.coherence.claims.length===19,'canonical claim registry mismatch');

const f5=upstream('f5-successor-entrypoint-delta.v1.json');
const f6=upstream('f6-successor-depth-profile-delta.v1.json');
const f7=upstream('f7-successor-accessibility-binding.v1.json');
ok(f5.entryPoints.length===14 && f5.existingEntriesPreserved.length===2,'F5 successor stateful universe drift');
ok(f6.contentIds.length===14,'F6 successor depth coverage drift');
ok(f7.contentIds.length===14 && f7.objectSpecificControlSemanticsCreated===false,'F7 successor accessibility drift');
eq(f7.modalities,['POINTER','KEYBOARD','TOUCH','ASSISTIVE_TECHNOLOGY'],'F7 modality drift');

const expectedProjectionCount=authority.projections.matrix.reduce((n,row)=>n+row.allowed.length,0);
ok(scene.counts.studies===22,'scene study count drift');
ok(scene.counts.claims===19,'scene claim count drift');
ok(scene.counts.typedRelations===38,'scene relation count drift');
ok(scene.counts.governedProjections===expectedProjectionCount,'scene projection count drift');
ok(scene.counts.destinations===authority.projections.destinations.length,'scene destination count drift');

const nodeIds=new Set(scene.nodes.map(v=>v.id));
const edgeIds=new Set(scene.edges.map(v=>v.id));
ok(nodeIds.size===scene.nodes.length,'duplicate spatial node id');
ok(edgeIds.size===scene.edges.length,'duplicate spatial edge id');
for(const n of scene.nodes){
  ok(Number.isFinite(n.xyz.x)&&Number.isFinite(n.xyz.y)&&Number.isFinite(n.xyz.z),'non-finite coordinate '+n.id);
  ok(Math.abs(n.xyz.x)<=1&&Math.abs(n.xyz.y)<=1&&Math.abs(n.xyz.z)<=1,'out-of-bounds coordinate '+n.id);
  ok(n.visualWeight===1,'node visual-weight authority leak '+n.id);
  ok(typeof n.textEquivalentId==='string'&&n.textEquivalentId.length>0,'missing text equivalent '+n.id);
}
for(const e of scene.edges){
  ok(nodeIds.has(e.source)&&nodeIds.has(e.target),'edge endpoint missing '+e.id);
  ok(e.visualWeight===1,'edge visual-weight authority leak '+e.id);
  ok(e.navigationAuthority===false,'edge gained navigation authority '+e.id);
  ok(e.inferred===false,'inferred edge admitted '+e.id);
  ok(typeof e.textEquivalentId==='string'&&e.textEquivalentId.length>0,'missing edge text equivalent '+e.id);
}

const scientificEdges=scene.edges.filter(v=>v.edgeKind==='SCIENTIFIC_RELATION_EDGE');
const projectionEdges=scene.edges.filter(v=>v.edgeKind==='GOVERNED_PROJECTION_EDGE');
ok(scientificEdges.length===38,'scientific relation edge count drift');
ok(projectionEdges.length===expectedProjectionCount,'projection edge count drift');
for(const e of scientificEdges){
  ok(authorizeScientificRelation({relationId:e.relationId,studyId:e.source.slice(6),claimId:e.target.slice(6),type:e.relationType,direction:e.direction,standing:e.standing},authority),'unregistered scientific edge '+e.id);
}
for(const e of projectionEdges)ok(authorizeProjection(e.claimId,e.destination,authority),'unregistered projection edge '+e.id);

const validRelation=fixtures.fixtures.find(v=>v.fixtureId==='VALID_DECLARED_RELATION');
const badRelation=fixtures.fixtures.find(v=>v.fixtureId==='INVALID_INFERRED_PROXIMITY_RELATION');
const validProjection=fixtures.fixtures.find(v=>v.fixtureId==='VALID_GOVERNED_PROJECTION');
const badProjection=fixtures.fixtures.find(v=>v.fixtureId==='INVALID_UNAUTHORIZED_PROJECTION');
const validCamera=fixtures.fixtures.find(v=>v.fixtureId==='VALID_FIXED_CAMERA');
const badCamera=fixtures.fixtures.find(v=>v.fixtureId==='INVALID_USER_CAMERA');
ok(authorizeScientificRelation(validRelation.candidate,authority),'valid declared relation rejected');
ok(!authorizeScientificRelation(badRelation.candidate,authority),'proximity relation admitted');
ok(authorizeProjection(validProjection.claimId,validProjection.destination,authority),'valid projection rejected');
ok(!authorizeProjection(badProjection.claimId,badProjection.destination,authority),'unauthorized projection admitted');
ok(validateCameraRequest(validCamera.camera),'fixed camera rejected');
ok(!validateCameraRequest(badCamera.camera),'user-controlled camera admitted');

ok(geometry.camera.mode==='FIXED_NON_USER_CONTROLLED'&&!geometry.camera.orbit&&!geometry.camera.pan&&!geometry.camera.zoom,'camera contract drift');
ok(geometry.visualWeight===1&&geometry.edgeWeight===1,'geometry weight drift');
ok(nodeRegistry.prohibitedMappings.includes('EVIDENCE_STANDING_TO_SIZE'),'evidence-size prohibition missing');
ok(nodeRegistry.prohibitedMappings.includes('CLAIM_CEILING_TO_HEIGHT'),'claim-height prohibition missing');
ok(relationContract.edgeWeightMayEncodeEvidenceStrength===false,'edge evidence-strength encoding admitted');
ok(controls.f8CreatesNewSemanticControls===false&&controls.cameraControl==='PROHIBITED','F7 semantic-control boundary drift');
ok(text.spatialLayerRequiredForScientificInterpretation===false&&text.spatialLayerRequiredForOperation===false,'spatial layer became controlling');
ok(scene.textFirstComplete===true&&scene.spatialLayerRequiredForScientificInterpretation===false,'scene text-first boundary drift');
ok(scene.scienceDigest!==scene.presentationDigest,'science and presentation digest conflated');
eq(scene.focusOrder,[...scene.nodes].sort((a,b)=>a.focusOrder-b.focusOrder).map(v=>v.id),'focus order not semantic order');

const expectedBlobs={
  'control-plane/methods-information-benchmark/methods-models-integrated-environment-construction-v1/pre-f8-corrective-construction-v1/f8-consumable-synchronized-delivery-receipt.v1.json':source.exactUpstreamBlobs.preF8Receipt,
  'control-plane/methods-information-benchmark/methods-models-integrated-environment-construction-v1/pre-f8-corrective-construction-v1/scientific-object-inventory.v1.json':source.exactUpstreamBlobs.scientificObjectInventory,
  'control-plane/methods-information-benchmark/methods-models-integrated-environment-construction-v1/pre-f8-corrective-construction-v1/canonical-coherence-object.v1.json':source.exactUpstreamBlobs.canonicalCoherenceObject,
  'control-plane/methods-information-benchmark/methods-models-integrated-environment-construction-v1/pre-f8-corrective-construction-v1/versioned-study-registry-index.v1.json':source.exactUpstreamBlobs.studyRegistryIndex,
  'control-plane/methods-information-benchmark/methods-models-integrated-environment-construction-v1/pre-f8-corrective-construction-v1/typed-relation-registry-index.v1.json':source.exactUpstreamBlobs.typedRelationRegistryIndex,
  'control-plane/methods-information-benchmark/methods-models-integrated-environment-construction-v1/pre-f8-corrective-construction-v1/claim-to-estate-projection-matrix.v1.json':source.exactUpstreamBlobs.claimProjectionMatrix,
  'control-plane/methods-information-benchmark/methods-models-integrated-environment-construction-v1/pre-f8-corrective-construction-v1/f5-successor-entrypoint-delta.v1.json':source.exactUpstreamBlobs.f5SuccessorEntrypoints,
  'control-plane/methods-information-benchmark/methods-models-integrated-environment-construction-v1/pre-f8-corrective-construction-v1/f6-successor-depth-profile-delta.v1.json':source.exactUpstreamBlobs.f6SuccessorDepthProfiles,
  'control-plane/methods-information-benchmark/methods-models-integrated-environment-construction-v1/pre-f8-corrective-construction-v1/f7-successor-accessibility-binding.v1.json':source.exactUpstreamBlobs.f7SuccessorAccessibility,
  'control-plane/methods-information-benchmark/methods-models-integrated-environment-construction-v1/f7-interaction-and-accessibility/semantic-control-registry.v1.json':source.exactUpstreamBlobs.f7SemanticControls,
  '.github/ai-router/projects/methods-information-benchmark/spatial-database-text-first-interaction-contract-v2-permanent-ratification.v1.json':source.exactUpstreamBlobs.textFirstRatification
};
for(const [p,sha] of Object.entries(expectedBlobs))ok(gitBlob(p)===sha,'upstream blob drift '+p);
execFileSync('git',['merge-base','--is-ancestor',source.acceptedInputHead,'HEAD'],{cwd:repoRoot});

ok(semantic.scientificAuthorityCreatedByF8===false,'F8 scientific authority creation');
ok(semantic.newF2Axis===false&&semantic.newResolverRule===false&&semantic.newClaimCeiling===false,'upstream ontology/resolver/claim mutation');
ok(receipt.f8CreatesScientificMeaning===false&&receipt.f8CreatesNavigationRelation===false,'receipt authority inflation');
ok(receipt.f9ExecutionAfterEffectivePass==='NOT_STARTED_REQUIRES_SEPARATE_AUTHORIZATION','F9 execution leaked into F8');
ok(receipt.f10ThroughF12Authority===false,'F10+ authority leak');
ok(['F8_CONSTRUCTION_CANDIDATE_PENDING_EXACT_HEAD_VERIFICATION','PASS_F8_SPATIAL_XYZ_SEMANTIC_LAYER_v1'].includes(receipt.status),'unexpected F8 receipt status');

console.log(JSON.stringify({status:'PASS_F8_SPATIAL_XYZ_SEMANTIC_LAYER_v1',sceneCounts:scene.counts,scienceDigest:scene.scienceDigest,presentationDigest:scene.presentationDigest,inputHead:source.acceptedInputHead,f9Execution:'NOT_STARTED'},null,2));
