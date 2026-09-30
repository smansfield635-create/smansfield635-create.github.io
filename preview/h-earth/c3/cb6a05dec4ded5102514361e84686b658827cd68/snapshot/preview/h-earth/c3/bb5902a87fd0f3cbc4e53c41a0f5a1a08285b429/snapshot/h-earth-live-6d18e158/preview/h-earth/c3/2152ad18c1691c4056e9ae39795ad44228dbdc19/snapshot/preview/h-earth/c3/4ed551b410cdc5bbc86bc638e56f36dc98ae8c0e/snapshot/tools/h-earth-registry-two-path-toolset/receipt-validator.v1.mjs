#!/usr/bin/env node
import {parseArgs,readJson,writeJson} from './lib.v1.mjs';
if(import.meta.url===new URL(`file://${process.argv[1]}`).href){
 const a=parseArgs(process.argv.slice(2),['descriptor','receipt','output']),d=readJson(a.descriptor),r=readJson(a.receipt),reasons=[];
 if(r.schema!=='H_EARTH_REGISTRY_TWO_PATH_SUCCESSOR_REPRODUCTION_RECEIPT_v1')reasons.push('SCHEMA');
 if(r.result!=='PASS_CLOSED_TWO_PATH_SUCCESSOR_REPRODUCED')reasons.push('RESULT');
 if(r.subjectHead!==d.canonicalInputSchema.properties.subjectHead.const)reasons.push('SUBJECT');
 if(r.repairPerformed!==false||r.pr570Mutated!==false||r.mergePerformed!==false)reasons.push('SIDE_EFFECT');
 const out={schema:'H_EARTH_TWO_PATH_RECEIPT_VALIDATION_v1',valid:reasons.length===0,disposition:reasons.length?'INVALID_RECEIPT_STOP':'VALIDATED_PASS',reasonCodes:reasons};
 writeJson(a.output,out);if(reasons.length)process.exitCode=1;
}
