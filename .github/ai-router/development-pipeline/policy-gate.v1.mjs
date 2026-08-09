#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const REQUEST_SCHEMA='DEVELOPMENT_PIPELINE_POLICY_DECISION_REQUEST_v1';
export const RECEIPT_SCHEMA='DEVELOPMENT_PIPELINE_POLICY_DECISION_RECEIPT_v1';
const KNOWN_AUTHORITY_CLASSES=new Set([
  'REPOSITORY_MUTATION_AUTHORITY','WORKFLOW_EXECUTION_AUTHORITY','READ_ONLY_OBSERVATION_AUTHORITY',
  'MERGE_AUTHORITY','DEPLOYMENT_AUTHORITY','PRODUCT_AUTHORITY','SEMANTIC_AUTHORITY',
  'SCIENTIFIC_CLAIM_AUTHORITY','PHYSICAL_RETIREMENT_AUTHORITY','GENERIC_COMMAND_AUTHORITY'
]);
const stable=v=>Array.isArray(v)?v.map(stable):v&&typeof v==='object'?Object.fromEntries(Object.keys(v).sort().map(k=>[k,stable(v[k])])):v;
const write=(p,v)=>fs.writeFileSync(p,JSON.stringify(stable(v),null,2)+'\n');
const isObj=v=>v&&typeof v==='object'&&!Array.isArray(v);
const prefixHit=(p,prefix)=>p===prefix.replace(/\/$/,'')||p.startsWith(prefix);

export function evaluatePolicy(input, registry) {
  const reasons=[];
  const matched=[];
  if(!isObj(input)||input.schema!==REQUEST_SCHEMA) return stable({schema:RECEIPT_SCHEMA,result:'DENY',decision:'DENY',errorCode:'POLICY_REQUEST_SCHEMA_INVALID',matchedRules:[],reasons:['REQUEST_SCHEMA_INVALID'],authorityCreated:false});
  if(!isObj(registry)||registry.schema!=='DEVELOPMENT_PIPELINE_POLICY_REGISTRY_v1'||registry.status!=='ACTIVE_FAIL_CLOSED') return stable({schema:RECEIPT_SCHEMA,result:'DENY',decision:'DENY',errorCode:'POLICY_REGISTRY_INVALID',matchedRules:[],reasons:['REGISTRY_INVALID'],authorityCreated:false});
  const paths=Array.isArray(input.requestedPaths)?input.requestedPaths:[];
  const authorities=Array.isArray(input.requestedAuthorityClasses)?input.requestedAuthorityClasses:[];
  if(typeof input.subjectHead!=='string'||typeof input.currentMainHead!=='string'||input.subjectHead!==input.currentMainHead){matched.push('P001_EXACT_HEAD');reasons.push('SUBJECT_HEAD_DIFFERS_FROM_CURRENT_MAIN');}
  const projectAuthorized=input.explicitProjectAuthority===true;
  const protectedHit=paths.find(p=>registry.protectedPathPrefixes.some(prefix=>prefixHit(p,prefix)));
  if(protectedHit&&!projectAuthorized){matched.push('P002_PROTECTED_PROJECT_PATH');reasons.push(`PROTECTED_PROJECT_PATH:${protectedHit}`);}
  const ledgerHit=paths.find(p=>registry.alwaysDeniedExactPaths.includes(p));
  if(ledgerHit){matched.push('P003_DIRECT_LEDGER_WRITE');reasons.push(`DIRECT_LEDGER_WRITE:${ledgerHit}`);}
  if(input.requestPhysicalRetirement===true&&input.separateRetirementAuthority!==true){matched.push('P004_PHYSICAL_RETIREMENT');reasons.push('PHYSICAL_RETIREMENT_REQUIRES_SEPARATE_AUTHORITY');}
  if(input.attestationUsedAsAuthoritySource===true){matched.push('P006_ATTESTATION_BOUNDARY');reasons.push('ATTESTATION_MAY_NOT_CREATE_AUTHORITY');}
  if(input.observerHistoricalConstructionScopeEnforcement===true){matched.push('P007_OBSERVER_SCOPE');reasons.push('OBSERVER_MAY_NOT_ENFORCE_HISTORICAL_CONSTRUCTION_SCOPE_ON_UNRELATED_OPERATION');}
  const unknown=authorities.filter(a=>!KNOWN_AUTHORITY_CLASSES.has(a));
  if(unknown.length){matched.push('P005_UNKNOWN_AUTHORITY');reasons.push(`UNKNOWN_AUTHORITY:${unknown.join(',')}`);}
  const neverCreated=new Set(registry.authorityClassesNeverCreatedByPolicy||[]);
  const forbiddenRequested=authorities.filter(a=>neverCreated.has(a));
  if(forbiddenRequested.length){reasons.push(`POLICY_CANNOT_CREATE_AUTHORITY:${forbiddenRequested.join(',')}`);}
  const hardDeny=matched.some(id=>['P001_EXACT_HEAD','P002_PROTECTED_PROJECT_PATH','P003_DIRECT_LEDGER_WRITE','P004_PHYSICAL_RETIREMENT','P006_ATTESTATION_BOUNDARY','P007_OBSERVER_SCOPE'].includes(id));
  const review=matched.includes('P005_UNKNOWN_AUTHORITY');
  let decision='ALLOW';
  if(hardDeny) decision='DENY'; else if(review) decision='REVIEW_REQUIRED'; else matched.push('P008_ALLOWED');
  return stable({
    schema:RECEIPT_SCHEMA,
    result:decision,
    decision,
    subjectHead:input.subjectHead??null,
    currentMainHead:input.currentMainHead??null,
    operationId:input.operationId??null,
    matchedRules:matched,
    reasons,
    requestedPaths:paths,
    requestedAuthorityClasses:authorities,
    policyRegistryId:registry.registryId,
    authorityCreated:false,
    mergeAuthorityCreated:false,
    productAuthorityCreated:false,
    semanticAuthorityCreated:false,
    scientificClaimAuthorityCreated:false,
    physicalRetirementAuthorityCreated:false
  });
}

function args(argv){const out={};for(let i=0;i<argv.length;i+=2){const k=argv[i],v=argv[i+1];if(!k?.startsWith('--')||v===undefined)throw new Error('CLI_ARGUMENT_INVALID');out[k.slice(2)]=v;}return out;}
function invoked(){return process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url);}
if(invoked()){
  try{
    const a=args(process.argv.slice(2));
    const input=JSON.parse(fs.readFileSync(a.input,'utf8'));
    const registry=JSON.parse(fs.readFileSync(a.registry,'utf8'));
    const receipt=evaluatePolicy(input,registry);
    write(a.output,receipt);
    if(receipt.decision==='DENY')process.exitCode=3;
    if(receipt.decision==='REVIEW_REQUIRED')process.exitCode=4;
  }catch(error){
    const receipt=stable({schema:RECEIPT_SCHEMA,result:'DENY',decision:'DENY',errorCode:error.message,authorityCreated:false});
    if(process.argv.includes('--output')){const i=process.argv.indexOf('--output');write(process.argv[i+1],receipt);}else process.stderr.write(JSON.stringify(receipt)+'\n');
    process.exitCode=1;
  }
}
