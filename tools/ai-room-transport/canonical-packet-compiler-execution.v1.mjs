#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { compileCanonicalPacket } from '../operation-intake/canonical-packet-compiler.v1.mjs';

function decodeJson(value, field) {
  if (typeof value !== 'string' || !/^[A-Za-z0-9+/=]+$/.test(value)) throw new Error(`${field}_BASE64_INVALID`);
  return JSON.parse(Buffer.from(value, 'base64').toString('utf8'));
}
function parseArgs(argv) {
  const out={};
  for(let i=0;i<argv.length;i+=2){const k=argv[i],v=argv[i+1];if(!['--request-base64','--procedure-base64','--output'].includes(k)||v===undefined)throw new Error('CLI_ARGUMENTS_NOT_CLOSED');out[k.slice(2)]=v;}
  for(const k of ['request-base64','procedure-base64','output'])if(!out[k])throw new Error('CLI_ARGUMENTS_INCOMPLETE');
  return out;
}
function main(){
  const args=parseArgs(process.argv.slice(2));
  const before=process.cwd();
  const compiled=compileCanonicalPacket(decodeJson(args['request-base64'],'REQUEST'),decodeJson(args['procedure-base64'],'PROCEDURE'));
  const bundle={
    schema:'CANONICAL_PACKET_COMPILER_EXECUTION_BUNDLE_v1',
    result:'PACKET_READY',
    canonicalPacketReceipt:compiled.receipt,
    canonicalOperationRequest:compiled.request,
    canonicalConstructionProcedure:compiled.procedure,
    canonicalIntakeEnvelope:compiled.envelope,
    canonicalIntakeComment:compiled.comment,
    repositoryMutationPerformed:false,
    admissionAuthorityCreated:false,
    mutationAuthorityCreated:false,
    mergeAuthorityCreated:false,
    deploymentAuthorityCreated:false,
    releaseAuthorityCreated:false,
    publicationAuthorityCreated:false,
    authorityEffect:'NONE_PACKET_COMPILATION_ONLY'
  };
  if(process.cwd()!==before)throw new Error('WORKING_DIRECTORY_CHANGED');
  fs.writeFileSync(path.resolve(args.output),JSON.stringify(bundle,null,2)+'\n');
}
if(process.argv[1]&&fileURLToPath(import.meta.url)===path.resolve(process.argv[1])){try{main()}catch(e){process.stderr.write(JSON.stringify({schema:'CANONICAL_PACKET_COMPILER_EXECUTION_FAILURE_v1',result:'FAIL_CLOSED',errorCode:e.message})+'\n');process.exitCode=1;}}
