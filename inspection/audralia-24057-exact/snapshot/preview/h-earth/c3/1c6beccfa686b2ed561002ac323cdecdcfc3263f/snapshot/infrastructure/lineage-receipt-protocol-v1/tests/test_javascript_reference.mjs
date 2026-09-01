import assert from 'node:assert/strict';
import fs from 'node:fs';
import {MAX_SAFE_INTEGER, canonicalizeText, createReceipt, verifyReceipt} from '../javascript/lineage_receipt_protocol_v1.mjs';

const vectors=JSON.parse(fs.readFileSync(new URL('../vectors/lrpv1_conformance_vectors.json',import.meta.url),'utf8')).vectors;
for(const v of vectors){
  const r=await createReceipt(v.payload);
  const body={protocol:r.protocol,protocol_version:r.protocol_version,canonicalization:r.canonicalization,digest_algorithm:r.digest_algorithm,payload:r.payload};
  assert.equal(canonicalizeText(body),v.canonical_body,v.id); assert.equal(r.lineage_digest,v.lineage_digest,v.id); assert.equal((await verifyReceipt(r)).state,'VALID',v.id);
}
const p={nested:{value:1},items:[1,2,3]}, r=await createReceipt(p); p.nested.value=99; assert.equal(r.payload.nested.value,1);
for(const mutate of [x=>x.payload.value=2,x=>x.protocol_version='9.9.9',x=>x.surprise=true,x=>delete x.digest_algorithm]){
  const x=await createReceipt({value:1}); mutate(x); assert.equal((await verifyReceipt(x)).state,'INVALID');
}
for(const v of [1.5,Number.NaN,Number.POSITIVE_INFINITY,MAX_SAFE_INTEGER+1,new Date(),new Set([1])]) await assert.rejects(()=>createReceipt(v));
assert.throws(()=>canonicalizeText('\ud800'));
console.log(JSON.stringify({status:'PASS',vectors:vectors.length}));
