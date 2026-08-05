#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import {evaluateInterHillEstate,validateEvaluatorOutput} from '../../tools/h-earth-map-wide-terrain/inter-hill-estate/successor-evaluator.v1.mjs';

const args={};
for(let i=2;i<process.argv.length;i+=2){if(!process.argv[i].startsWith('--'))throw Error(`UNKNOWN_ARGUMENT:${process.argv[i]}`);args[process.argv[i].slice(2)]=process.argv[i+1]}
const root=path.resolve(args.root??'.');
const governingMain=args['governing-main']??'0d88fe21aba99c97b73fcdc68d44af57d55b68be';
const output=args.output;
if(!output)throw Error('OUTPUT_REQUIRED');
const result=await evaluateInterHillEstate({root,governingMain});
const schemaPath=path.join(root,'h-earth-3d/control-plane/map-wide-terrain-articulation-estate-reservation/inter-hill-estate-successor-evaluator/output-schema.v1.json');
const outputSchema=JSON.parse(fs.readFileSync(schemaPath,'utf8'));
validateEvaluatorOutput(result,outputSchema,{phase:'FINAL'});
const target=path.resolve(output),temporary=`${target}.validated-${process.pid}.tmp`;
fs.mkdirSync(path.dirname(target),{recursive:true});
fs.writeFileSync(temporary,JSON.stringify(result,null,2)+'\n');
fs.renameSync(temporary,target);
console.log(JSON.stringify({result:'PASS',inputSchemaEnforcedBeforeTerrainLoad:result.validationEvidence.inputSchemaValidatedBeforeTerrainLoad,outputSchemaEnforcedBeforeDigestFinalization:result.validationEvidence.outputSchemaValidatedBeforeDigestFinalization,outputSchemaEnforcedBeforeWrite:true,outputDigest:result.outputDigest,partitionDigest:result.sourceModeComparison.CURRENT_MAIN_PLUS_ACCEPTED_R06_C10_ANALYSIS_COMPOSITE.partitionDigest,adjacencyDigest:result.sourceModeComparison.CURRENT_MAIN_PLUS_ACCEPTED_R06_C10_ANALYSIS_COMPOSITE.adjacencyDigest,candidateSetDigest:result.sourceModeComparison.CURRENT_MAIN_PLUS_ACCEPTED_R06_C10_ANALYSIS_COMPOSITE.candidateSetDigest,paretoFrontierDigest:result.sourceModeComparison.CURRENT_MAIN_PLUS_ACCEPTED_R06_C10_ANALYSIS_COMPOSITE.paretoFrontierDigest,selectedArrangementDigest:result.sourceModeComparison.CURRENT_MAIN_PLUS_ACCEPTED_R06_C10_ANALYSIS_COMPOSITE.selectedArrangementDigest},null,2));
