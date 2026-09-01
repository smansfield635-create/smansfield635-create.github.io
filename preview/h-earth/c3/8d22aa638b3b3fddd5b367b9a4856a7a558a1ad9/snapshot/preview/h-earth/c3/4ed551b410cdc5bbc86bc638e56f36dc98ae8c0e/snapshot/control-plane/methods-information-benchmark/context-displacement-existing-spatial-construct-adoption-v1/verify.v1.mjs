#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import cp from 'node:child_process';
import { fileURLToPath } from 'node:url';
const args=process.argv.slice(2); const get=(k,d=null)=>{const i=args.indexOf(k);return i>=0?args[i+1]:d};
const repo=path.resolve(get('--repository','.')); const output=get('--output',null);
const base='control-plane/methods-information-benchmark/context-displacement-existing-spatial-construct-adoption-v1';
const read=(p)=>JSON.parse(fs.readFileSync(path.join(repo,p),'utf8'));
const stable=v=>Array.isArray(v)?v.map(stable):v&&typeof v==='object'?Object.fromEntries(Object.keys(v).sort().map(k=>[k,stable(v[k])])):v;
const canonical=v=>JSON.stringify(stable(v)); const sha=v=>crypto.createHash('sha256').update(v).digest('hex');
const fail=(code,detail=null)=>{const e=new Error(code);e.detail=detail;throw e};
const manifest=read(`${base}/source-identity-manifest.v1.json`); const discovery=read(`${base}/component-discovery.v1.json`); const findings=read(`${base}/contextual-architecture-findings.v1.json`); const matrix=read(`${base}/adoption-matrix.v1.json`); const prohibited=read(`${base}/prohibited-substitute-architectures.v1.json`); const runtime=read(`${base}/required-runtime-conditions.v1.json`); const bundle=read(`${base}/architecture-receipt-bundle.v1.json`);
if(manifest.governingHead!=='3b21d30763ca0368110811351bb3d3c8a042af47')fail('GOVERNING_HEAD_MISMATCH');
for(const group of Object.values(manifest.sourceGroups)) for(const s of group){let actual;try{actual=cp.execFileSync('git',['rev-parse',`${s.commit}:${s.path}`],{cwd:repo,encoding:'utf8'}).trim()}catch(e){fail('SOURCE_IDENTITY_UNRESOLVED',{path:s.path,commit:s.commit})}if(actual!==s.blob)fail('SOURCE_IDENTITY_MISMATCH',{path:s.path,expected:s.blob,actual});}
if(discovery.status!=='DISCOVERY_COMPLETE'||!String(discovery.composition).includes('H_EARTH'))fail('COMPONENT_DISCOVERY_INCOMPLETE');
if(findings.status!=='PASS_CONTEXTUAL_ARCHITECTURE_BOUND'||findings.findings.some(x=>!['PASS','PASS_WITH_BOUNDARY','FAIL_CLOSED_EXCLUSION'].includes(x.result)))fail('CONTEXTUAL_ARCHITECTURE_CONFORMANCE_FAILURE');
if(matrix.inspirationOnlyRowCount!==0||matrix.rows.some(r=>r.disposition==='INSPIRATION_ONLY'))fail('INSPIRATION_ONLY_ADOPTION_ROW');
if(!matrix.rows.some(r=>r.capabilityId==='PERSISTENT_WEBGL2_SCENE'&&r.disposition==='ADOPT_RUNTIME_CORRIDOR'))fail('REAL_3D_RUNTIME_NOT_BOUND');
if(!matrix.rows.some(r=>r.capabilityId==='REJECTED_2044_PRESENTATION'&&r.disposition==='EXCLUDE_VISUAL_FOUNDATION'))fail('REJECTED_VISUAL_FOUNDATION_ADMITTED');
const requiredRuntime=['REAL_3D_GPU_SCENE','PRIMARY_DIRECT_MANIPULATION','GESTURE_GRAMMAR','STABLE_EUCLIDEAN_STAGE_GEOMETRY','TRAVEL_THROUGH_SPACE','EXACT_RETURN','MOBILE_SITE_PARITY','EARLY_USER_PERCEPTUAL_GATE'];
for(const id of requiredRuntime){const c=runtime.conditions.find(x=>x.id===id);if(!c||c.required!==true)fail('RUNTIME_CONDITION_INCOMPLETE',id)}
if(!prohibited.prohibitedPrimaryArchitectures.some(x=>x.id==='VISIBLE_PREVIOUS_NEXT_OR_TRAVEL_BUTTONS'))fail('PROHIBITED_SUBSTITUTE_ARCHITECTURE_MISSING');
if(bundle.authorityBoundary.pageImplementationExecuted!==false||bundle.authorityBoundary.publicOrVisualMutation!==false||bundle.authorityBoundary.mergeAuthorized!==false)fail('AUTHORITY_BOUNDARY_FAILURE');
const fingerprintDomain={governingHead:manifest.governingHead,sourceIdentities:manifest.sourceGroups,componentCapabilities:discovery.components,adoptionMatrix:matrix.rows,prohibitedSubstitutes:prohibited.prohibitedPrimaryArchitectures,runtimeConditions:runtime.conditions,authorityBoundaries:bundle.authorityBoundary};
const fingerprint=sha(canonical(fingerprintDomain));
for(const name of ['builder.receipt.v1.json','fresh-verifier.receipt.v1.json','independent-equality.receipt.v1.json','operation-closure.receipt.v1.json']){const r=read(`${base}/receipts/${name}`);if(!r.schema||!r.status)fail('RECEIPT_INVALID',name);if(r.status==='PASS_CLOSED'||r.status==='PASS'){if(r.fingerprint&&r.fingerprint!==fingerprint)fail('RECEIPT_FINGERPRINT_MISMATCH',name);}}
const receipt=stable({schema:'METHODS_SPATIAL_ADOPTION_VERIFICATION_RECEIPT_v1',result:'PASS',operationId:'METHODS_CONTEXT_DISPLACEMENT_EXISTING_SPATIAL_CONSTRUCT_ADOPTION_v1',governingHead:manifest.governingHead,fingerprint,sourceIdentityCount:Object.values(manifest.sourceGroups).flat().length,componentCount:discovery.components.length,adoptionRowCount:matrix.rows.length,inspirationOnlyRowCount:matrix.inspirationOnlyRowCount,runtimeConditionCount:runtime.conditions.length,rejectedVisualFoundationExcluded:true,pageImplementationExecuted:false,publicOrVisualMutation:false,mergeAuthorized:false});
const text=JSON.stringify(receipt,null,2)+'\n'; if(output){fs.mkdirSync(path.dirname(path.resolve(output)),{recursive:true});fs.writeFileSync(path.resolve(output),text)}else process.stdout.write(text);
