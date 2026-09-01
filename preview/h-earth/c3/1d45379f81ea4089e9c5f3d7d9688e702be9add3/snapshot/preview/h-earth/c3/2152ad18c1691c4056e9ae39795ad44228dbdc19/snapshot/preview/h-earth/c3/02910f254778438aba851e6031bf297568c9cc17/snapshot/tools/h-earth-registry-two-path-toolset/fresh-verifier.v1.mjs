#!/usr/bin/env node
import {assert,parseArgs,readJson,writeJson} from './lib.v1.mjs';
import {selfTest} from './self-test.v1.mjs';
if(import.meta.url===new URL(`file://${process.argv[1]}`).href){
 const a=parseArgs(process.argv.slice(2),['tooling-head','registration-head','builder-receipt','execution-holder','output']);
 try{const b=readJson(a['builder-receipt']),r=selfTest({toolingHead:a['tooling-head'],registrationHead:a['registration-head'],executionHolder:a['execution-holder']});assert(b.executionHolder!==r.executionHolder,'HOLDERS_NOT_DISTINCT');assert(b.packageFingerprint===r.packageFingerprint,'FINGERPRINT_MISMATCH');writeJson(a.output,{...r,schema:'H_EARTH_TWO_PATH_TOOLSET_INDEPENDENT_REPRODUCTION_RECEIPT_v1',result:'PASS_CLOSED_INDEPENDENTLY_REPRODUCED',builderHolder:b.executionHolder,distinctExecutionHolders:true});}
 catch(e){writeJson(a.output,{schema:'H_EARTH_TWO_PATH_TOOLSET_INDEPENDENT_REPRODUCTION_RECEIPT_v1',result:'FAIL_CLOSED',errorCode:e.message});process.exitCode=1;}
}
