#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';

export const WORK_PACKET_SCHEMA='FUNCTIONAL_BEARING_WORK_PACKET_v1';
export const RECEIPT_SCHEMA='FUNCTIONAL_BEARING_EXECUTION_RECEIPT_v1';
export const SELF_TEST_SCHEMA='FUNCTIONAL_BEARING_ROUTER_SELF_TEST_RECEIPT_v1';
export const EXPECTED_CONSTITUTION_BLOB='49e08bd13e09e70e9363e9c5e18c6f778288cbfe';
export const CONSTITUTION_PATH='control-plane/whole-estate/characters-reconstruction-v1/compass-functional-coordinate-constitution.v1.json';
export const REQUIRED_CLASS='MATERIAL_GOVERNED_ENGINEERING';
export const EXEMPT_CLASSES=new Set(['STATIC_EDITORIAL_MICRO','READ_ONLY_ADMINISTRATIVE','SOURCE_READBACK']);
const OPPOSING=new Set(['N:S','S:N','E:W','W:E']);

function fail(code,field,detail=null){const e=new Error(`${code}:${field}${detail?':'+detail:''}`);Object.assign(e,{code,field,detail});throw e;}
const obj=(v,f)=>{if(!v||typeof v!=='object'||Array.isArray(v))fail('SCHEMA_INVALID',f);return v;};
const str=(v,f)=>{if(typeof v!=='string'||!v)fail('SCHEMA_INVALID',f);return v;};
const arr=(v,f)=>{if(!Array.isArray(v))fail('SCHEMA_INVALID',f);return v;};

export function loadConstitution(root=process.cwd()){
  const p=path.join(root,CONSTITUTION_PATH);
  if(!fs.existsSync(p))fail('CONSTITUTION_MISSING_OR_CHANGED','constitutionPath');
  const c=JSON.parse(fs.readFileSync(p,'utf8'));
  if(c.schema!=='COMPASS_FUNCTIONAL_COORDINATE_CONSTITUTION_v1'||c.status!=='FROZEN')fail('CONSTITUTION_MISSING_OR_CHANGED','constitutionSchema');
  if(!Array.isArray(c.stations)||c.stations.length!==16)fail('CONSTITUTION_MISSING_OR_CHANGED','stations');
  const git=spawnSync('git',['hash-object',CONSTITUTION_PATH],{cwd:root,encoding:'utf8'});
  if(git.status===0&&git.stdout.trim()!==EXPECTED_CONSTITUTION_BLOB)fail('CONSTITUTION_MISSING_OR_CHANGED','constitutionBlob',git.stdout.trim());
  return c;
}

function validateApplicability(packet){
  const cls=str(packet.applicabilityClass,'applicabilityClass');
  if(cls!==REQUIRED_CLASS&&!EXEMPT_CLASSES.has(cls))fail('APPLICABILITY_UNCLASSIFIED','applicabilityClass',cls);
  const fb=obj(packet.functionalBearing,'functionalBearing');
  const mode=str(fb.mode,'functionalBearing.mode');
  const bearings=arr(fb.bearings,'functionalBearing.bearings');
  if(cls===REQUIRED_CLASS){
    if(mode==='EXEMPT'||bearings.length===0)fail('BEARING_REQUIRED_MISSING','functionalBearing');
    if(mode==='SINGLE'&&bearings.length!==1)fail('SCHEMA_INVALID','functionalBearing.bearings');
    if(mode==='ROUTE'&&bearings.length<2)fail('SCHEMA_INVALID','functionalBearing.bearings');
    if(!['SINGLE','ROUTE'].includes(mode))fail('SCHEMA_INVALID','functionalBearing.mode');
    if(fb.exemptionReason!==null)fail('SCHEMA_INVALID','functionalBearing.exemptionReason');
  }else{
    if(mode!=='EXEMPT'||bearings.length!==0||typeof fb.exemptionReason!=='string'||!fb.exemptionReason)fail('SCHEMA_INVALID','functionalBearing');
  }
  return {cls,mode,bearings};
}

function validatePrimitiveLaw(packet,route){
  const req=packet.primitiveRequirements??[];
  if(!Array.isArray(req))fail('SCHEMA_INVALID','primitiveRequirements');
  const unique=[...new Set(req)];
  if(unique.some(x=>!['N','E','S','W'].includes(x)))fail('SCHEMA_INVALID','primitiveRequirements');
  if(unique.length>=3&&route.length<2)fail('MULTI_PRIMITIVE_DECOMPOSITION_REQUIRED','primitiveRequirements');
  if(unique.length===2&&OPPOSING.has(`${unique[0]}:${unique[1]}`)&&route.length<2)fail('OSL1_VIOLATION','primitiveRequirements');
}

export function resolveWorkPacket(packet,{root=process.cwd(),constitution=null}={}){
  obj(packet,'packet');
  if(packet.schema!==WORK_PACKET_SCHEMA)fail('SCHEMA_INVALID','schema');
  for(const f of ['packetId','parentOperationId','objective','requiredOutput'])str(packet[f],f);
  for(const f of ['R','L','D','A','handoff'])obj(packet[f],f);
  for(const f of ['evidenceRefs','unresolvedConditions','prohibitedAuthority'])arr(packet[f],f);
  const {cls,bearings}=validateApplicability(packet);
  const c=constitution??loadConstitution(root);
  const allowed=new Set(c.stations.map(x=>x.bearing));
  for(const b of bearings)if(!allowed.has(b))fail('BEARING_NOT_IN_CONSTITUTION','functionalBearing.bearings',b);
  validatePrimitiveLaw(packet,bearings);
  const authorityBefore=JSON.stringify(packet.A);
  const receipt={
    schema:RECEIPT_SCHEMA,
    operationId:packet.parentOperationId,
    packetId:packet.packetId,
    constitutionBlob:EXPECTED_CONSTITUTION_BLOB,
    orderedRoute:[...bearings],
    participatingBearings:[...new Set(bearings)],
    handoffPreserved:{R:packet.R,L:packet.L,D:packet.D,A:packet.A,evidenceRefs:[...packet.evidenceRefs],unresolvedConditions:[...packet.unresolvedConditions]},
    authorityEffect:'NONE',
    A:packet.A,
    result:cls===REQUIRED_CLASS?'ROUTE_RESOLVED':'EXEMPT',
    heldOrRejectedWork:[],
    independentVerificationIdentity:null
  };
  if(JSON.stringify(receipt.A)!==authorityBefore||JSON.stringify(receipt.handoffPreserved.A)!==authorityBefore)fail('AUTHORITY_EFFECT_NONZERO','A');
  return receipt;
}

function packet(overrides={}){return {
  schema:WORK_PACKET_SCHEMA,packetId:'P1',parentOperationId:'O1',applicabilityClass:REQUIRED_CLASS,
  functionalBearing:{mode:'SINGLE',bearings:['ESE'],exemptionReason:null},R:{target:'x',relation:'MUTATES'},L:{stage:'BUILD'},D:{domain:'WEB'},A:{grant:'PATH_BOUNDED'},objective:'Implement approved spec',requiredOutput:'candidate',evidenceRefs:['e1'],unresolvedConditions:[],prohibitedAuthority:['MERGE'],handoff:{predecessorPacketId:null,successorRelation:'VERIFY'},primitiveRequirements:['E','S'],...overrides};}
function expectFailure(name,fn,code,checks){try{fn();checks.push({name,pass:false,detail:'NO_FAILURE'});}catch(e){checks.push({name,pass:e.code===code,detail:e.code||e.message});}}

export function selfTest(root=process.cwd()){
  const c=loadConstitution(root);const checks=[];
  const run=(name,fn)=>{try{fn();checks.push({name,pass:true});}catch(e){checks.push({name,pass:false,detail:e.code||e.message});}};
  run('single-bearing',()=>{const r=resolveWorkPacket(packet(),{root,constitution:c});if(r.orderedRoute.join(',')!=='ESE'||r.authorityEffect!=='NONE')throw new Error('BAD_SINGLE');});
  run('ordered-route',()=>{const r=resolveWorkPacket(packet({functionalBearing:{mode:'ROUTE',bearings:['N','SSW'],exemptionReason:null},primitiveRequirements:['N','S']}),{root,constitution:c});if(r.orderedRoute.join('>')!=='N>SSW')throw new Error('BAD_ROUTE');});
  for(const cls of EXEMPT_CLASSES)run(`exempt-${cls}`,()=>resolveWorkPacket(packet({applicabilityClass:cls,functionalBearing:{mode:'EXEMPT',bearings:[],exemptionReason:'FUNCTIONAL_ROUTING_NOT_APPLICABLE'},primitiveRequirements:[]}),{root,constitution:c}));
  expectFailure('material-bearing-required',()=>resolveWorkPacket(packet({functionalBearing:{mode:'EXEMPT',bearings:[],exemptionReason:'x'}}),{root,constitution:c}),'BEARING_REQUIRED_MISSING',checks);
  expectFailure('ambiguous-fails-closed',()=>resolveWorkPacket(packet({applicabilityClass:'UNKNOWN'}),{root,constitution:c}),'APPLICABILITY_UNCLASSIFIED',checks);
  expectFailure('invalid-bearing',()=>resolveWorkPacket(packet({functionalBearing:{mode:'SINGLE',bearings:['XYZ'],exemptionReason:null}}),{root,constitution:c}),'BEARING_NOT_IN_CONSTITUTION',checks);
  expectFailure('opposition-decomposes',()=>resolveWorkPacket(packet({functionalBearing:{mode:'SINGLE',bearings:['N'],exemptionReason:null},primitiveRequirements:['N','S']}),{root,constitution:c}),'OSL1_VIOLATION',checks);
  expectFailure('three-primitive-decomposes',()=>resolveWorkPacket(packet({functionalBearing:{mode:'SINGLE',bearings:['NE'],exemptionReason:null},primitiveRequirements:['N','E','S']}),{root,constitution:c}),'MULTI_PRIMITIVE_DECOMPOSITION_REQUIRED',checks);
  run('authority-invariance',()=>{const p=packet({A:{grant:'ONLY_X',merge:false}});const r=resolveWorkPacket(p,{root,constitution:c});if(JSON.stringify(r.A)!==JSON.stringify(p.A)||JSON.stringify(r.handoffPreserved.A)!==JSON.stringify(p.A))throw new Error('AUTHORITY_CHANGED');});
  run('handoff-preserved',()=>{const p=packet();const r=resolveWorkPacket(p,{root,constitution:c});for(const k of ['R','L','D','A'])if(JSON.stringify(r.handoffPreserved[k])!==JSON.stringify(p[k]))throw new Error(`HANDOFF_${k}`);});
  run('receipt-contract',()=>{const r=resolveWorkPacket(packet(),{root,constitution:c});if(r.schema!==RECEIPT_SCHEMA||r.constitutionBlob!==EXPECTED_CONSTITUTION_BLOB||r.authorityEffect!=='NONE')throw new Error('BAD_RECEIPT');});
  const failed=checks.filter(x=>!x.pass);
  return {schema:SELF_TEST_SCHEMA,result:failed.length?'FAIL_CLOSED':'PASS_CLOSED',checks:checks.length,passed:checks.length-failed.length,failed:failed.length,authorityEffect:'NONE',secondExecutorCreated:false,failures:failed};
}

function args(v){const o={};for(let i=0;i<v.length;i++){const x=v[i];if(x==='--self-test'){o.selfTest=true;continue;}if(!x.startsWith('--'))fail('SCHEMA_INVALID','argument',x);o[x.slice(2)]=v[++i]??null;}return o;}
async function main(){const a=args(process.argv.slice(2));try{if(a.selfTest){const r=selfTest();process.stdout.write(JSON.stringify(r,null,2)+'\n');if(r.result!=='PASS_CLOSED')process.exitCode=1;return;}if(!a.input)fail('SCHEMA_INVALID','input');const p=JSON.parse(fs.readFileSync(a.input,'utf8'));const r=resolveWorkPacket(p);const text=JSON.stringify(r,null,2)+'\n';if(a.output)fs.writeFileSync(a.output,text);else process.stdout.write(text);}catch(e){process.stdout.write(JSON.stringify({schema:'FUNCTIONAL_BEARING_ROUTER_FAILURE_v1',result:'FAIL_CLOSED',errorCode:e.code||'UNEXPECTED_ERROR',field:e.field||null,detail:e.detail||null},null,2)+'\n');process.exitCode=1;}}
if(process.argv[1]&&fileURLToPath(import.meta.url)===path.resolve(process.argv[1]))main();
