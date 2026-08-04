import crypto from 'node:crypto';
export const stable=(v)=>Array.isArray(v)?v.map(stable):(v&&typeof v==='object'?Object.fromEntries(Object.keys(v).sort().map(k=>[k,stable(v[k])])):v);
export const canonical=(v)=>JSON.stringify(stable(v));
export const hashObject=(v)=>crypto.createHash('sha256').update(canonical(v),'utf8').digest('hex');
export function fail(code,detail=''){throw new Error(detail?`${code}:${detail}`:code)}
export const ACCEPTED_SCHEMAS=['METHODS_INFORMATION_BENCHMARK_BOUNDED_OPERATION_PACKET_v1','METHODS_INFORMATION_BENCHMARK_BOUNDED_OPERATION_PACKET_SUCCESSOR_v1'];
export const CANONICAL_ROLE_ID='ROLE_6_REQUIREMENTS_AND_CAUSAL_AUTHORITY';
export const CANONICAL_OPERATION_ID='METHODS_FORMAL_RECORD_TYPE_DEPENDENCY_THREE_ANCHOR_AND_DEVELOPMENTAL_BASELINE_AUDIT_v1';
export const SUPERSEDED_OPERATION_ALIAS='METHODS_FORMAL_RECORD_TYPE_DEPENDENCY_AND_THREE_ANCHOR_REQUIREMENTS_AUDIT_v1';
export const EXACT_PACKET_SUCCESSOR_HEAD='fa7e74403ff43e017bccef7462f4e001918cf0a3';
export const EXACT_PACKET_PATH='control-plane/methods-information-benchmark/role6-developmental-baseline-successor/methods-role6-developmental-baseline-successor.packet.v1.json';
export const EXACT_PACKET_CANONICAL_SHA256='5c93a8ebe638b9f06a4e14fc42f8ee202c8801e940527aa4fb987006a04e0cdc';
export function successorPacketHash(packet){const projected=structuredClone(packet);projected.packetSha256=null;return hashObject(projected)}
function common(packet){if(packet.returnRequired!==true)fail('RETURN_OR_TERMINATION_LAW_MISSING','returnRequired');if(packet.productMutationAllowed!==false)fail('PACKET_PRODUCT_MUTATION_FORBIDDEN');if(packet.mergeAllowed!==false)fail('PACKET_MERGE_FORBIDDEN')}
export function adaptPacket(packet,context={}){
 if(!packet||typeof packet!=='object'||Array.isArray(packet))fail('UNSUPPORTED_PACKET_SCHEMA');
 if(!ACCEPTED_SCHEMAS.includes(packet.schema))fail('UNSUPPORTED_PACKET_SCHEMA',String(packet.schema));
 common(packet);
 if(packet.operationId===SUPERSEDED_OPERATION_ALIAS)fail('OPERATION_ALIAS_USED_INSTEAD_OF_CANONICAL_ID');
 if(packet.schema==='METHODS_INFORMATION_BENCHMARK_BOUNDED_OPERATION_PACKET_v1'){
   if(!packet.packetId||!packet.roleId||!packet.operationId||!Array.isArray(packet.outputs)||packet.outputs.length===0)fail('UNSUPPORTED_PACKET_SCHEMA','v1-invariants');
   return stable({schema:packet.schema,packetId:packet.packetId,roleId:packet.roleId,operationId:packet.operationId,returnRequired:true,terminationLaw:packet.terminationLaw??null,canonicalSha256:hashObject(packet),adapter:'GENERIC_V1_INVARIANTS'});
 }
 if(packet.roleId!==CANONICAL_ROLE_ID)fail('CANONICAL_ROLE_ID_MISMATCH');
 if(packet.operationId!==CANONICAL_OPERATION_ID)fail('CANONICAL_OPERATION_ID_MISMATCH',String(packet.operationId));
 if(!packet.terminationLaw||packet.terminationLaw.residualGeneralRoleAuthorityAllowed!==false||packet.terminationLaw.postTerminationRoleState!=='INACTIVE'||!Array.isArray(packet.terminationLaw.terminatesAtFirstOf)||packet.terminationLaw.terminatesAtFirstOf.length===0)fail('RETURN_OR_TERMINATION_LAW_MISSING','terminationLaw');
 const computed=successorPacketHash(packet);
 if(packet.packetSha256!==EXACT_PACKET_CANONICAL_SHA256||computed!==EXACT_PACKET_CANONICAL_SHA256)fail('PACKET_HASH_MISMATCH',`${packet.packetSha256}:${computed}`);
 if(context.packetSuccessorHead!=null&&context.packetSuccessorHead!==EXACT_PACKET_SUCCESSOR_HEAD)fail('PACKET_HEAD_MISMATCH');
 if(context.packetPath!=null&&context.packetPath!==EXACT_PACKET_PATH)fail('PACKET_PATH_MISMATCH');
 return stable({schema:packet.schema,packetId:packet.packetId,roleId:packet.roleId,operationId:packet.operationId,returnRequired:true,returnDestination:packet.returnDestination,terminationLaw:packet.terminationLaw,requiredSubstantiveOutputs:packet.requiredSubstantiveOutputs,canonicalSha256:computed,adapter:'PR_557_PACKET_SUCCESSOR_ADAPTER_v1',exactPacketSuccessorHead:EXACT_PACKET_SUCCESSOR_HEAD,exactPacketPath:EXACT_PACKET_PATH});
}
