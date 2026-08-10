#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
const HERE=path.dirname(fileURLToPath(import.meta.url));
const REPO=path.resolve(HERE,"../../../..");
const REL_DIR="laws/control-plane/contextual-topology/laws-first-bounded-spatial-manifestation-experiment-v1";
const BASE="b79537c9a4541cebe634cb674caaba6bdf394f97";
const EXPECTED_PATHS=[
`${REL_DIR}/index.html`,
`${REL_DIR}/index.css`,
`${REL_DIR}/index.js`,
`${REL_DIR}/specimen-manifest.v1.json`,
`${REL_DIR}/verify.v1.mjs`
];
const checks=[];
function check(name,condition,details=null){
const passed=Boolean(condition);
checks.push({name,passed,...(details?{details}:{})});
if(!passed){
const error=new Error(name);
error.details=details;
throw error;
}
}
const read=rel=>fs.readFileSync(path.join(REPO,rel),"utf8");
const json=rel=>JSON.parse(read(rel));
const gitBlobSha=text=>{
const bytes=Buffer.from(text,"utf8");
return crypto.createHash("sha1").update(Buffer.from(`blob ${bytes.length}\0`)).update(bytes).digest("hex");
};
const stable=value=>{
if(Array.isArray(value)) return `[${value.map(stable).join(",")}]`;
if(value&&typeof value==="object") return `{${Object.keys(value).sort().map(k=>`${JSON.stringify(k)}:${stable(value[k])}`).join(",")}}`;
return JSON.stringify(value);
};
const sha256=text=>crypto.createHash("sha256").update(text).digest("hex");
try{
const manifest=json(`${REL_DIR}/specimen-manifest.v1.json`);
const html=read(`${REL_DIR}/index.html`);
const css=read(`${REL_DIR}/index.css`);
const js=read(`${REL_DIR}/index.js`);
check("MANIFEST_SCHEMA",manifest.schema==="LAWS_CONTEXTUAL_3D_EUCLIDEAN_SPECIMEN_MANIFEST_v1");
check("EXACT_OPERATION_AND_GENERATION",
manifest.operationId==="LAWS_CONTEXTUAL_3D_EUCLIDEAN_SPECIMEN_CURRENT_MAIN_V1_20260809_001_SUCCESSOR_001" &&
manifest.lockGeneration===1007 &&
manifest.exactGoverningHead===BASE);
check("IMPLEMENTATION_CLASS",manifest.implementationClass==="EXISTING_CONSTRUCT_ADOPTION");
const authorityPath=manifest.authorityBinding.authorityPath;
const authorityText=read(authorityPath);
const authority=JSON.parse(authorityText);
check("FROZEN_AUTHORITY_GIT_BLOB",gitBlobSha(authorityText)===manifest.authorityBinding.authorityGitBlob,
{actual:gitBlobSha(authorityText),expected:manifest.authorityBinding.authorityGitBlob});
check("FROZEN_AUTHORITY_SCOPE",
authority.authorizedExperimentId==="LAWS_FIRST_BOUNDED_SPATIAL_MANIFESTATION_EXPERIMENT_v1" &&
authority.authorizedConsumer?.consumerId==="LAWS_FIRST_BOUNDED_SPATIAL_CONSUMER_v1" &&
authority.authorityScope==="ONE_SPECIMEN_ONLY" &&
authority.constructionAuthority==="SPATIAL_MANIFESTATION_ONLY" &&
authority.mergeAuthority==="NONE" &&
authority.productionAuthority==="NONE");
check("FROZEN_AUTHORITY_DIGESTS",
authority.graphDigest===manifest.authorityBinding.graphDigest &&
authority.projectionDescriptionDigest===manifest.authorityBinding.projectionDescriptionDigest &&
authority.projectionPolicyBinding?.gitBlob===manifest.authorityBinding.projectionPolicyGitBlob &&
authority.projectionConformanceLrpv1ReceiptBinding?.lineageDigest===manifest.authorityBinding.projectionConformanceLrpv1LineageDigest);
const projection=json(manifest.authorityBinding.projectionDescriptionPath);
check("PROJECTION_DESCRIPTION_JCS_DIGEST",
sha256(stable(projection))===manifest.authorityBinding.projectionDescriptionDigest,
{actual:sha256(stable(projection)),expected:manifest.authorityBinding.projectionDescriptionDigest});
const expectedNodes=["METHODS","PROSPECTIVE_FINAL_REPORT_PORTFOLIO","ROUTE_OPERATOR_PLATFORM"];
check("VISIBLE_NODE_IDENTITY",
JSON.stringify(projection.visibleNodeIds)===JSON.stringify(expectedNodes) &&
JSON.stringify(manifest.semanticProjection.visibleNodeIds)===JSON.stringify(expectedNodes));
const expectedRelations=[
"METHODS__GOVERNS_PROCEDURE_FOR__PROSPECTIVE_FINAL_REPORT_PORTFOLIO",
"ROUTE_OPERATOR_PLATFORM__EXECUTES__PROSPECTIVE_FINAL_REPORT_PORTFOLIO"
];
check("VISIBLE_RELATION_IDENTITY",
JSON.stringify(projection.visibleRelationIds)===JSON.stringify(expectedRelations) &&
JSON.stringify(manifest.semanticProjection.visibleRelations.map(r=>r.relationId))===JSON.stringify(expectedRelations));
check("RELATION_SEMANTICS_EXACT",
manifest.semanticProjection.visibleRelations.every((r,i)=>{
const p=projection.relationPresentations[i];
return p &&
r.relationId===p.sourceRelationId &&
r.fromObjectId===p.fromObjectId &&
r.toObjectId===p.toObjectId &&
r.relationType===p.relationType &&
r.direction===p.direction &&
JSON.stringify(r.presentationChannels)===JSON.stringify(p.presentationChannels) &&
JSON.stringify(r.qualifiers)===JSON.stringify(p.qualifiers);
}));
check("NON_EDGE_RESOLUTION_STATES_EXACT",
JSON.stringify(manifest.semanticProjection.resolutionPresentations)===
JSON.stringify(projection.resolutionPresentations.map(r=>({
evaluatedObjectIdentity:r.evaluatedObjectIdentity,
resolutionState:r.resolutionState,
channelType:r.channelType,
presentationDisposition:r.presentationDisposition,
recoverable:r.recoverable
}))));
check("NO_SUPPRESSION_BUNDLING_OR_VISUAL_CLUSTER",
manifest.semanticProjection.suppressedNodeIds.length===0 &&
manifest.semanticProjection.suppressedRelations.length===0 &&
manifest.semanticProjection.relationBundles.length===0 &&
manifest.semanticProjection.visualClusters.length===0 &&
manifest.semanticProjection.nonSemanticVisuals.length===0);
for(const source of manifest.sourceConstructs){
const text=read(source.path);
check(`SOURCE_BLOB_${source.sourceId}`,gitBlobSha(text)===source.gitBlobSha,
{path:source.path,actual:gitBlobSha(text),expected:source.gitBlobSha});
}
check("SOURCE_GEOMETRY_EXACT",
JSON.stringify(manifest.spatialAdapter.sourceGeometry)===JSON.stringify({
horizontalRadius:1.68,verticalRadius:1.5008,depthRadius:1.2992,
slots:{yPlus:[0,1,0],xPlus:[1,0,0],yMinus:[0,-1,0],xMinus:[-1,0,0],zPlus:[0,0,1],zMinus:[0,0,-1]}
}));
check("NO_SOURCE_SEMANTIC_OR_FAILED_PHI1_INHERITANCE",
manifest.spatialAdapter.sourceSemanticIdentityInherited===false &&
manifest.spatialAdapter.failedPhi1DesignInherited===false &&
manifest.spatialAdapter.parallelRendererArchitectureIntroduced===false);
check("REAL_WEBGL_DEPTH_RENDERING",
/getContext\("webgl"/.test(js) &&
/DEPTH_TEST/.test(js) &&
/drawElements/.test(js) &&
/makeSphere/.test(js) &&
/makeCylinder/.test(js) &&
/makeCone/.test(js));
check("QUATERNION_DIRECT_MANIPULATION",
/const qRaw=/.test(js) && /const qm=/.test(js) && /const qRotate=/.test(js) &&
/pointerdown/.test(js) && /pointermove/.test(js) && /pointerup/.test(js) &&
/twoPointerRoll/.test(JSON.stringify(manifest.runtimeRequirements)) &&
/const roll=axisAngle/.test(js));
check("SOURCE_CAMERA_PROJECTION_ADOPTION",
/fieldOfViewDivisor:\s*4\.85/.test(js) &&
/normalEye:\s*Object\.freeze\(\[0,\s*0\.76,\s*6\.05\]\)/.test(js) &&
/mobileEye:\s*Object\.freeze\(\[0,\s*0\.76,\s*7\.10\]\)/.test(js) &&
/const perspective4=/.test(js) && /const lookAt4=/.test(js));
check("DEPTH_INFORMATION_CONSEQUENCE",
/data-depth/.test(css) && /centerView/.test(js) && /viewZ/.test(js) &&
manifest.runtimeRequirements.depthAndOrientationInformationallyConsequential===true);
for(const id of [...expectedNodes,...projection.resolutionPresentations.map(r=>r.evaluatedObjectIdentity)]){
check(`ACCESSIBLE_ID_${id}`,html.includes(id));
}
for(const relationId of expectedRelations){
check(`ACCESSIBLE_RELATION_${relationId}`,html.includes(relationId));
}
check("ACCESSIBLE_DIRECTION_AND_STATE_LITERALS",
html.includes("Direction: METHODS to PROSPECTIVE_FINAL_REPORT_PORTFOLIO") &&
html.includes("Direction: ROUTE_OPERATOR_PLATFORM to PROSPECTIVE_FINAL_REPORT_PORTFOLIO") &&
["CONFLICTED","NONE","UNEVALUABLE","UNKNOWN"].every(x=>html.includes(`: ${x}.`)));
check("REDUCED_MOTION_STATIC_EQUIVALENCE",
css.includes("@media(prefers-reduced-motion:reduce)") &&
html.includes('class="semantic-equivalent sr-only"'));
const sourceSemanticTokens=["data-direction=\"flow\"","data-direction=\"integrity\"","data-direction=\"reality\"","data-direction=\"structure\"","data-direction=\"test\"","data-direction=\"research\""];
check("NO_SOURCE_SCENE_SEMANTIC_IDENTITY_REUSE",
sourceSemanticTokens.every(token=>!html.includes(token) && !js.includes(token)));
check("NO_PSEUDO_SPATIAL_NAVIGATION",
!/\bcarousel\b/i.test(html+css+js) &&
!/data-(?:previous|next)/i.test(html+css+js));
let changed=[];
try{
changed=execFileSync("git",["diff","--name-only",`${BASE}...HEAD`],{cwd:REPO,encoding:"utf8"})
.trim().split(/\r?\n/).filter(Boolean).sort();
check("EXACT_FIVE_PATH_MUTATION_SURFACE",
JSON.stringify(changed)===JSON.stringify([...EXPECTED_PATHS].sort()),
{changed,expected:[...EXPECTED_PATHS].sort()});
}catch(error){
check("EXACT_FIVE_PATH_MUTATION_SURFACE",false,{error:String(error)});
}
const receipt={
schema:"LAWS_CONTEXTUAL_3D_SPECIMEN_VERIFICATION_RECEIPT_v1",
result:"PASS",
exactGoverningHead:BASE,
operationId:manifest.operationId,
lockGeneration:manifest.lockGeneration,
implementationClass:manifest.implementationClass,
checkCount:checks.length,
checks,
semanticDifferential:{
visibleNodeCount:projection.visibleNodeIds.length,
visibleRelationCount:projection.visibleRelationIds.length,
unresolvedStateCount:projection.resolutionPresentations.length,
suppressedNodeCount:projection.suppressedNodeIds.length,
suppressedRelationCount:projection.suppressedRelations.length,
relationBundleCount:projection.relationBundles.length,
visualClusterCount:projection.visualClusters.length,
nonSemanticVisualCount:projection.nonSemanticVisuals.length,
disposition:"SEMANTIC_IDENTITY_PRESERVED"
},
browserVerificationRequired:true,
browserVerificationDisposition:"PENDING_SEPARATE_RUNTIME_EXECUTION",
mergeAuthority:false,
productionAuthority:false,
visualAcceptanceAuthority:false
};
process.stdout.write(`${JSON.stringify(receipt,null,2)}\n`);
}catch(error){
const receipt={
schema:"LAWS_CONTEXTUAL_3D_SPECIMEN_VERIFICATION_RECEIPT_v1",
result:"FAIL_CLOSED",
errorCode:error?.message||"UNKNOWN_VERIFICATION_FAILURE",
details:error?.details||null,
checks,
mergeAuthority:false,
productionAuthority:false,
visualAcceptanceAuthority:false
};
process.stdout.write(`${JSON.stringify(receipt,null,2)}\n`);
process.exitCode=1;
}
