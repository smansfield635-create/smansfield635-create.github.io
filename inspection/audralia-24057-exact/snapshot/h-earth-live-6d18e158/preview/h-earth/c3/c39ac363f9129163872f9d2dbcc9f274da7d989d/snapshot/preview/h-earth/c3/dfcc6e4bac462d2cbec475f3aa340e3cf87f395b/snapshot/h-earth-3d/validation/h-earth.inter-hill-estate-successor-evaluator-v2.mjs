#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {evaluateCausalCase,canonical} from '../../tools/h-earth-map-wide-terrain/inter-hill-estate/causal-trace-evaluator.v2.mjs';

function args(argv){const out={};for(let i=0;i<argv.length;i+=2){const k=argv[i],v=argv[i+1];if(!['--input','--output'].includes(k)||v===undefined)throw Error(`UNKNOWN_OR_INCOMPLETE_ARGUMENT:${k}`);out[k.slice(2)]=v}if(!out.input)throw Error('INPUT_REQUIRED');return out}
const invoked=process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url);
if(invoked){
  const a=args(process.argv.slice(2));
  const input=JSON.parse(fs.readFileSync(path.resolve(a.input),'utf8'));
  const output=evaluateCausalCase(input);
  const text=JSON.stringify(output,null,2)+'\n';
  if(a.output){fs.mkdirSync(path.dirname(path.resolve(a.output)),{recursive:true});fs.writeFileSync(path.resolve(a.output),text)}
  process.stdout.write(text);
  if(canonical(JSON.parse(text))!==canonical(output))throw Error('OUTPUT_SERIALIZATION_MISMATCH');
}
