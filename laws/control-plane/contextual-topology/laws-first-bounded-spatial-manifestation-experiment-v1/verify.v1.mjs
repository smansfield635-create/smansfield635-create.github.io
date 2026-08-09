#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import cp from 'node:child_process';
import { fileURLToPath } from 'node:url';

const HERE=path.dirname(fileURLToPath(import.meta.url));
const ROOT=path.resolve(HERE,'../../../..');
const MANIFEST=path.join(HERE,'specimen-manifest.v1.json');
const JS=path.join(HERE,'index.js');
const HTML=path.join(HERE,'index.html');
const AUTHORITY=path.join(ROOT,'laws/control-plane/contextual-topology/laws-bounded-spatial-manifestation-authority-v1.json');
const PROJECTION=path.join(ROOT,'laws/control-plane/contextual-topology/laws-bounded-spatial-manifestation-projection-description-v1.json');
const POLICY=path.join(ROOT,'laws/control-plane/contextual-topology/laws-semantics-preserving-projection-policy-v1.json');
const CONFORMANCE=path.join(ROOT,'laws/control-plane/contextual-topology/laws-bounded-spatial-manifestation-projection-conformance-receipt-v1.json');
const LRP=path.join(ROOT,'laws/control-plane/contextual-topology/laws-bounded-spatial-manifestation-projection-conformance-lrpv1-receipt-v1.json');

const stable=v=>Array.isArray(v)?v.map(stable):v&&typeof v==='object'?Object.fromEntries(Object.keys(v).sort().map(k=>[k,stable(v[k])])):v;
const canonical=v=>JSON.stringify(stable(v));
const sha256=b=>crypto.createHash('sha256').update(b).digest('hex');
const read=f=>JSON.parse(fs.readFileSync(f,'utf8'));
const git=(args,cwd=ROOT)=>cp.execFileSync('git',args,{cwd,encoding:'utf8',maxBuffer:32*1024*1024}).trim();
const blob=f=>git(['hash-object',f]);
const setEq=(a,b)=>canonical([...a].sort())===canonical([...b].sort());
function assert(ok,code,detail=null){if(!ok){const e=new Error(detail==null?code:`${code}:${detail}`);e.code=code;throw e}}
function parseArgs(argv){const o={};for(let i=0;i<argv.length;i++){assert(argv[i].startsWith('--'),'UNKNOWN_ARGUMENT',argv[i]);o[argv[i].slice(2)]=argv[++i]??null}return o}
function gitBlobAt(commit,p){return git(['rev-parse',`${commit}:${p}`])}

export function verify(){
  const manifest=read(MANIFEST),authority=read(AUTHORITY),projection=read(PROJECTION),policy=read(POLICY),conformance=read(CONFORMANCE),lrp=read(LRP);
  const js=fs.readFileSync(JS,'utf8'),html=fs.readFileSync(HTML,'utf8');
  const checks=[];
  const check=(name,fn)=>{try{fn();checks.push({name,passed:true})}catch(e){checks.push({name,passed:false,errorCode:e.code??'VERIFY_FAILURE',detail:e.message})}};

  check('SPECIMEN_SCHEMA_AND_ONE_SPECIMEN_ONLY',()=>{
    assert(manifest.schema==='LAWS_PHI1_SPATIAL_SPECIMEN_MANIFEST_v1','SPECIMEN_SCHEMA_MISMATCH');
    assert(manifest.specimenId==='LAWS_FIRST_BOUNDED_SPATIAL_MANIFESTATION_SPECIMEN_001','SPECIMEN_ID_MISMATCH');
    assert(manifest.authorityBoundary.specimenCount===1,'SPECIMEN_COUNT_NOT_ONE');
  });

  check('FROZEN_APHI_IDENTITY',()=>{
    assert(authority.authorityId===manifest.authorityBinding.authorityId,'AUTHORITY_ID_MISMATCH');
    assert(authority.authorityVersion===manifest.authorityBinding.authorityVersion,'AUTHORITY_VERSION_MISMATCH');
    assert(blob(AUTHORITY)===manifest.authorityBinding.authorityManifestBlob,'AUTHORITY_BLOB_MISMATCH');
    assert(authority.graphDigest===manifest.authorityBinding.graphDigest,'GRAPH_DIGEST_MISMATCH');
    assert(authority.authorizedExperimentId===manifest.experimentId,'EXPERIMENT_BINDING_MISMATCH');
    assert(authority.authorizedConsumer.consumerId===manifest.consumer.consumerId,'CONSUMER_BINDING_MISMATCH');
  });

  check('FROZEN_PROJECTION_POLICY_AND_DESCRIPTION_BYTES',()=>{
    assert(blob(PROJECTION)===manifest.authorityBinding.projectionDescriptionBlob,'PROJECTION_BLOB_MISMATCH');
    assert(sha256(Buffer.from(canonical(projection),'utf8'))===manifest.authorityBinding.projectionDescriptionDigest,'PROJECTION_CANONICAL_DIGEST_MISMATCH');
    assert(blob(POLICY)===manifest.authorityBinding.projectionPolicyBlob,'POLICY_BLOB_MISMATCH');
    assert(policy.schema==='LAWS_SEMANTICS_PRESERVING_PROJECTION_POLICY_v1','POLICY_SCHEMA_MISMATCH');
  });

  check('FROZEN_CONFORMANCE_RECEIPTS',()=>{
    assert(blob(CONFORMANCE)===manifest.authorityBinding.projectionConformanceReceiptBlob,'CONFORMANCE_RECEIPT_BLOB_MISMATCH');
    assert(conformance.disposition===manifest.authorityBinding.projectionConformanceDisposition,'CONFORMANCE_DISPOSITION_MISMATCH');
    assert(Array.isArray(conformance.violations)&&conformance.violations.length===0,'FROZEN_CONFORMANCE_HAS_VIOLATIONS');
    assert(blob(LRP)===manifest.authorityBinding.projectionConformanceLrpv1ReceiptBlob,'FROZEN_LRP_BLOB_MISMATCH');
    assert(authority.projectionConformanceLrpv1ReceiptBinding.lineageDigest===manifest.authorityBinding.projectionConformanceLrpv1LineageDigest,'FROZEN_LRP_LINEAGE_MISMATCH');
  });

  check('VISIBLE_NODE_IDENTITY_EXACT',()=>{
    const layout=manifest.spatialLayout.nodes.map(n=>n.objectId);
    assert(setEq(layout,projection.visibleNodeIds),'VISIBLE_NODE_SET_DRIFT');
    assert(new Set(layout).size===layout.length,'DUPLICATE_LAYOUT_NODE');
    for(const n of manifest.spatialLayout.nodes){
      assert(n.semanticClassification==='NON_SEMANTIC_PRESENTATION','LAYOUT_SEMANTIC_CLASSIFICATION_INVALID',n.objectId);
      assert(n.doesNotAssertRelation===true&&n.doesNotModifyStanding===true&&n.doesNotModifyClaimCeiling===true,'LAYOUT_NONSEMANTIC_DECLARATION_INCOMPLETE',n.objectId);
      assert(Array.isArray(n.position)&&n.position.length===3&&n.position.every(Number.isFinite),'LAYOUT_POSITION_INVALID',n.objectId);
    }
  });

  check('RELATION_IDENTITY_DIRECTION_TYPE_AND_CHANNELS_EXACT',()=>{
    assert(projection.relationPresentations.length===projection.visibleRelationIds.length,'RELATION_PRESENTATION_COUNT_DRIFT');
    assert(setEq(projection.relationPresentations.map(r=>r.sourceRelationId),projection.visibleRelationIds),'RELATION_IDENTITY_DRIFT');
    for(const r of projection.relationPresentations){
      assert(r.direction==='DIRECTED','RELATION_DIRECTION_DRIFT',r.sourceRelationId);
      assert(r.semanticProfile==='DIRECT_TYPED_RELATION_V1','RELATION_PROFILE_DRIFT',r.sourceRelationId);
      for(const channel of ['DIRECT_CONNECTION','DIRECTION_MARKER','RELATION_TYPE_LABEL','RELATION_QUALIFIER_DISPLAY','INSPECTION_DETAIL'])assert(r.presentationChannels.includes(channel),'RELATION_CHANNEL_MISSING',`${r.sourceRelationId}:${channel}`);
    }
  });

  check('UNRESOLVED_STATES_EXACT_AND_NON_EDGE',()=>{
    assert(Array.isArray(projection.resolutionPresentations)&&projection.resolutionPresentations.length>0,'RESOLUTION_PRESENTATIONS_MISSING');
    for(const r of projection.resolutionPresentations){
      assert(r.presentationDisposition==='INSPECTABLE_NON_EDGE_STATE','UNRESOLVED_STATE_EDGE_INFLATION',r.evaluatedObjectIdentity);
      assert(typeof r.resolutionState==='string'&&r.resolutionState.length>0,'UNRESOLVED_STATE_LITERAL_MISSING');
    }
  });

  check('NO_SUPPRESSION_BUNDLING_CLUSTER_OR_WRITEBACK',()=>{
    assert(projection.suppressedNodeIds.length===0,'SUPPRESSED_NODE_DRIFT');
    assert(projection.suppressedRelations.length===0,'SUPPRESSED_RELATION_DRIFT');
    assert(projection.relationBundles.length===0,'RELATION_BUNDLE_DRIFT');
    assert(projection.visualClusters.length===0,'VISUAL_CLUSTER_DRIFT');
    assert(projection.viewState.changesSemanticState===false,'VIEW_STATE_SEMANTIC_MUTATION');
    assert(projection.projectionWriteback.enabled===false,'PROJECTION_WRITEBACK_ENABLED');
    assert(manifest.semanticSourceRule.graphWritebackEnabled===false&&manifest.semanticSourceRule.projectionWritebackEnabled===false,'SPECIMEN_WRITEBACK_ENABLED');
  });

  check('RUNTIME_READS_FROZEN_SEMANTICS_DIRECTLY',()=>{
    assert(manifest.semanticSourceRule.runtimeSemanticSource==='../laws-bounded-spatial-manifestation-projection-description-v1.json','RUNTIME_SEMANTIC_SOURCE_MISMATCH');
    assert(js.includes("const PROJECTION_URL='../laws-bounded-spatial-manifestation-projection-description-v1.json';"),'FROZEN_PROJECTION_FETCH_BINDING_MISSING');
    for(const r of projection.relationPresentations)assert(!js.includes(`'${r.relationType}'`)&&!js.includes(`\"${r.relationType}\"`),'RELATION_LITERAL_DUPLICATED_IN_ADAPTER',r.relationType);
    for(const r of projection.resolutionPresentations)assert(!js.includes(`'${r.resolutionState}'`)&&!js.includes(`\"${r.resolutionState}\"`),'RESOLUTION_LITERAL_DUPLICATED_IN_ADAPTER',r.resolutionState);
  });

  check('IMPLEMENTATION_CLASS_AND_SOURCE_BOUNDARY',()=>{
    assert(manifest.implementationBinding.implementationClass==='EXISTING_CONSTRUCT_ADOPTION','IMPLEMENTATION_CLASS_DRIFT');
    assert(manifest.implementationBinding.contentAdapterMayDefineVisualArchitecture===false,'ADAPTER_VISUAL_ARCHITECTURE_AUTHORITY');
    assert(manifest.implementationBinding.adoptedSources.length===3,'ADOPTED_SOURCE_COUNT_DRIFT');
    for(const s of manifest.implementationBinding.adoptedSources){
      assert(gitBlobAt(s.commitSha,s.path)===s.gitBlobSha,'ADOPTED_SOURCE_IDENTITY_MISMATCH',s.sourceId);
      assert(s.semanticInheritance===false,'SOURCE_SEMANTIC_INHERITANCE',s.sourceId);
    }
  });

  check('REAL_WEBGL_DIRECT_MANIPULATION_AND_ACCESSIBLE_READBACK',()=>{
    assert(html.includes('id="spatial-canvas"'),'SPATIAL_CANVAS_MISSING');
    assert(html.includes('id="relation-list"')&&html.includes('id="resolution-list"'),'ACCESSIBLE_SEMANTIC_READBACK_MISSING');
    assert(js.includes("canvas.getContext('webgl2'"),'WEBGL2_CONTEXT_MISSING');
    assert(js.includes("canvas.addEventListener('pointerdown'"),'DIRECT_MANIPULATION_MISSING');
    assert(js.includes("canvas.addEventListener('wheel'"),'ZOOM_MANIPULATION_MISSING');
    assert(js.includes("matchMedia('(prefers-reduced-motion: reduce)')"),'REDUCED_MOTION_EQUIVALENCE_MISSING');
  });

  check('NO_AUTHORITY_INFLATION',()=>{
    const b=manifest.authorityBoundary;
    for(const k of ['semanticAuthorityCreated','graphMutationPerformed','projectionMutationPerformed','publicLawsMutationPerformed','mergeAuthority','productionAuthority','scientificClaimAuthority','visualAcceptanceAuthority'])assert(b[k]===false,'AUTHORITY_INFLATION',k);
  });

  const passCount=checks.filter(c=>c.passed).length;
  return stable({
    schema:'LAWS_PHI1_SEMANTIC_DIFFERENTIAL_RECEIPT_v1',
    result:passCount===checks.length?'PASS':'FAIL',
    specimenId:manifest.specimenId,
    experimentId:manifest.experimentId,
    operationId:manifest.operationBinding.operationId,
    lockGeneration:manifest.operationBinding.lockGeneration,
    authorityHead:manifest.authorityBinding.authorityHead,
    projectionDescriptionDigest:manifest.authorityBinding.projectionDescriptionDigest,
    implementationClass:manifest.implementationBinding.implementationClass,
    checkCount:checks.length,
    passCount,
    failCount:checks.length-passCount,
    visibleNodeCount:projection.visibleNodeIds.length,
    visibleRelationCount:projection.visibleRelationIds.length,
    unresolvedStateCount:projection.resolutionPresentations.length,
    repositoryWritesPerformed:false,
    semanticAuthorityCreated:false,
    graphMutationPerformed:false,
    projectionMutationPerformed:false,
    checks
  });
}

const invoked=process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url);
if(invoked){const args=parseArgs(process.argv.slice(2));const receipt=verify();if(args.output)fs.writeFileSync(path.resolve(args.output),`${JSON.stringify(receipt,null,2)}\n`);else process.stdout.write(`${JSON.stringify(receipt,null,2)}\n`);if(receipt.result!=='PASS')process.exitCode=1}
