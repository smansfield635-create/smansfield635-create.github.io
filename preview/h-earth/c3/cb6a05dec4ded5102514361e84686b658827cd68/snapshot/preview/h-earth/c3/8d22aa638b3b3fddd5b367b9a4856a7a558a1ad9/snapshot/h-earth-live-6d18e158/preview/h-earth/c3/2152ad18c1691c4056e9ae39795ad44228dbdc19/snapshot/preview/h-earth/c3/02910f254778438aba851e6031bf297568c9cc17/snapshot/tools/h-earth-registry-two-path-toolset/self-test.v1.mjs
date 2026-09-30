#!/usr/bin/env node
import {assert,parseArgs,writeJson,showText,showJson,blobAt,TOOLING_PATHS,DESCRIPTOR_PATH,REGISTRY_PATH,ROUTED_PATHS,NEGATIVE_ROUTES,verifySynthetic,route,sha256,canonical} from './lib.v1.mjs';
export function selfTest({toolingHead,registrationHead,executionHolder}){
  const blobs={};for(const p of TOOLING_PATHS){showText(toolingHead,p);blobs[p]=blobAt(toolingHead,p);}
  let absent=false;try{showText(toolingHead,DESCRIPTOR_PATH);}catch{absent=true;}assert(absent,'DESCRIPTOR_PRESENT_AT_TOOLING_HEAD');
  const descriptor=showJson(registrationHead,DESCRIPTOR_PATH),registry=showJson(registrationHead,REGISTRY_PATH);
  assert(descriptor.exactToolingHead===toolingHead,'EXACT_TOOLING_HEAD_MISMATCH');
  const matches=(registry.tools??[]).filter(x=>x.descriptorId===descriptor.descriptorId);
  assert(matches.length===1,'DESCRIPTOR_MATCH_COUNT_NOT_ONE');
  assert(JSON.stringify(matches[0])===JSON.stringify(descriptor),'REGISTRY_DESCRIPTOR_MISMATCH');
  const fixtures=JSON.parse(showText(toolingHead,'tools/h-earth-registry-two-path-toolset/fixtures.v1.json'));
  assert(verifySynthetic(fixtures.positive).pass,'POSITIVE_FIXTURE_FAILED');
  for(const f of fixtures.negative){
    const x=JSON.parse(JSON.stringify(fixtures.positive));
    if(f.field==='changedPaths')x.changedPaths.push('h-earth-3d/registry/unexpected.js');
    if(f.field==='overlayImport')x.overlaySource=x.overlaySource.replace('h-earth.repository-registry.c2-r1-candidate-path-disposition.js','missing.js');
    if(f.field==='overlayGuard')x.overlaySource=x.overlaySource.replace('requireC2R1BaseRegistryNode','noGuard');
    if(f.field==='loaderImport')x.loaderSource=x.loaderSource.replace('h-earth.repository-registry.c2-r1-material-only-binding-exact-head.js','missing.js');
    if(f.field==='loaderEntry')x.loaderSource=x.loaderSource.replace('loadHEarthRepositoryRegistryValidatorDependencies','noEntry');
    assert(!verifySynthetic(x).pass,`NEGATIVE_DID_NOT_FAIL:${f.id}`);
  }
  for(const p of ROUTED_PATHS){const r=route(p,0);assert(r.disposition==='PASS'&&r.routes?.[0]?.projectId==='H_EARTH',`POSITIVE_ROUTE:${p}`);}
  for(const p of NEGATIVE_ROUTES){const r=route(p,1);assert(r.disposition==='BLOCK'&&r.routes?.[0]?.routeClass==='UNREGISTERED',`NEGATIVE_ROUTE:${p}`);}
  const out={schema:'H_EARTH_TWO_PATH_TOOLSET_CONFORMANCE_RECEIPT_v1',result:'PASS_CLOSED_TOOLSET_CONFORMANT',executionHolder,toolingHead,registrationHead,toolingBlobs:blobs,descriptorId:descriptor.descriptorId,descriptorMatchCount:1,descriptorAbsentAtToolingHead:true,positiveFixturePass:true,negativeFixtureCount:fixtures.negative.length,negativeFixturesPassed:true,routePositiveCount:ROUTED_PATHS.length,routeNegativeCount:NEGATIVE_ROUTES.length,routeVerificationPass:true,subjectHead:descriptor.canonicalInputSchema.properties.subjectHead.const,productMutationPerformed:false,pr570Mutated:false,mergePerformed:false,packageFingerprint:null};
  out.packageFingerprint=sha256(canonical({...out,executionHolder:null,packageFingerprint:null}));return out;
}
if(import.meta.url===new URL(`file://${process.argv[1]}`).href){
 const a=parseArgs(process.argv.slice(2),['tooling-head','registration-head','execution-holder','output']);
 try{writeJson(a.output,selfTest({toolingHead:a['tooling-head'],registrationHead:a['registration-head'],executionHolder:a['execution-holder']}));}
 catch(e){writeJson(a.output,{schema:'H_EARTH_TWO_PATH_TOOLSET_CONFORMANCE_RECEIPT_v1',result:'FAIL_CLOSED',errorCode:e.message});process.exitCode=1;}
}
