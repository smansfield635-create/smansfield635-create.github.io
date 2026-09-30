#!/usr/bin/env node
import {assert,parseArgs,readJson,writeJson,sha256,canonical} from './lib.v1.mjs';
if(import.meta.url===new URL(`file://${process.argv[1]}`).href){
 const a=parseArgs(process.argv.slice(2),['builder','verifier','certification','output']);
 try{const b=readJson(a.builder),v=readJson(a.verifier),c=readJson(a.certification);assert(b.result==='PASS_CLOSED_TOOLSET_CONFORMANT'&&v.result==='PASS_CLOSED_INDEPENDENTLY_REPRODUCED'&&c.result==='PASS_CLOSED_TOOLSET_REGISTERED_AND_REPRODUCED','TERMINATION_INPUT_NOT_PASS');writeJson(a.output,{schema:'CP9_OPERATION_A_AUTHORITY_TERMINATION_RECEIPT_v1',result:'PASS_CLOSED_OPERATION_A_AUTHORITY_TERMINATED',operationId:'H_EARTH_REGISTRY_TWO_PATH_SUCCESSOR_REPAIR_TOOLSET_REGISTRATION_A_002',builderDigest:sha256(canonical(b)),verifierDigest:sha256(canonical(v)),certificationDigest:sha256(canonical(c)),constructionAuthorityActive:false,verifierAuthorityActive:false,mergeAuthority:false,operationBAuthorityInherited:false,pr570Mutation:false});}
 catch(e){writeJson(a.output,{schema:'CP9_OPERATION_A_AUTHORITY_TERMINATION_RECEIPT_v1',result:'FAIL_CLOSED',errorCode:e.message});process.exitCode=1;}
}
