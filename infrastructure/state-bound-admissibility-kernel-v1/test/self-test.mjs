#!/usr/bin/env node
import crypto from 'node:crypto';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { adaptCedarDecision, adaptGenericEvidence, adaptInTotoStatementEvidence, adaptOidcIdentity, adaptSpiffeIdentity } from '../src/adapters.mjs';
import { createStatement, generateEd25519Signer, signStatement, verifyEnvelope } from '../src/dsse.mjs';
import { MemoryReplayStore, StateBoundAdmissibilityKernel } from '../src/kernel.mjs';

const results = [];
async function test(name, fn) {
  try { await fn(); results.push({ name, result: 'PASS' }); }
  catch (error) { results.push({ name, result: 'FAIL', error: `${error.code ?? error.name}:${error.message}` }); }
}
function expect(condition, message) { if (!condition) throw new Error(message); }
function expectCode(fn, code) { try { fn(); } catch (e) { expect(e.code === code, `expected ${code}, got ${e.code}`); return; } throw new Error(`expected ${code}`); }
function baseContext(overrides = {}) {
  const principal = adaptSpiffeIdentity({ spiffeId: 'spiffe://example.org/agent/test', verified: true, verifier: 'test-verifier' });
  const authority = adaptCedarDecision({ decision: 'Allow', verified: true, evaluator: 'test', request: { principal: principal.subject, action: 'write', resource: 'repo', context: { head: 'a'.repeat(40) } } });
  return {
    principal,
    operation: { id: 'op-1', action: 'write' },
    resource: { repository: 'example/repo', paths: ['a.txt'] },
    state: { gitHead: 'a'.repeat(40) },
    authority,
    policy: { id: 'policy', version: 1 },
    procedure: { id: 'procedure', version: 1 },
    evidence: [adaptGenericEvidence('tests', { head: 'a'.repeat(40), result: 'PASS' })],
    ...overrides
  };
}
function freshKernel(signer = null) { signer ??= generateEd25519Signer(); let tick = 0; return new StateBoundAdmissibilityKernel({ replayStore: new MemoryReplayStore(), signer, clock: () => `2026-08-09T19:30:${String(tick++).padStart(2,'0')}-05:00` }); }
function admit(kernel, ctx = baseContext(), nonce = 'self-test-nonce-0000001') { return kernel.admit(ctx, { nonce }).capability; }

await test('valid exact context executes', () => { const k=freshKernel(), c=baseContext(), cap=admit(k,c); expect(k.enforce(cap,c).result==='EXECUTE','execute'); });
await test('stale state denied', () => { const k=freshKernel(), c=baseContext(), cap=admit(k,c); const n=baseContext({state:{gitHead:'b'.repeat(40)}}); expect(k.evaluate(cap,n).result==='DENY_STALE_STATE','state'); });
await test('stale authority denied', () => { const k=freshKernel(), c=baseContext(), cap=admit(k,c); const n=baseContext({authority:{...c.authority,policySetDigest:'changed'}}); expect(k.evaluate(cap,n).result==='DENY_STALE_AUTHORITY','authority'); });
await test('stale evidence denied', () => { const k=freshKernel(), c=baseContext(), cap=admit(k,c); const n=baseContext({evidence:[adaptGenericEvidence('tests',{head:'a'.repeat(40),result:'PASS',build:2})]}); expect(k.evaluate(cap,n).result==='DENY_STALE_EVIDENCE','evidence'); });
await test('operation drift denied', () => { const k=freshKernel(), c=baseContext(), cap=admit(k,c); expect(k.evaluate(cap,baseContext({operation:{id:'op-2',action:'write'}})).result==='DENY_OPERATION_DRIFT','operation'); });
await test('scope drift denied', () => { const k=freshKernel(), c=baseContext(), cap=admit(k,c); expect(k.evaluate(cap,baseContext({resource:{repository:'example/repo',paths:['b.txt']}})).result==='DENY_SCOPE_DRIFT','scope'); });
await test('principal drift denied', () => { const k=freshKernel(), c=baseContext(), cap=admit(k,c); const p=adaptSpiffeIdentity({spiffeId:'spiffe://example.org/agent/other',verified:true,verifier:'test-verifier'}); expect(k.evaluate(cap,baseContext({principal:p})).result==='DENY_PRINCIPAL_DRIFT','principal'); });
await test('policy drift denied', () => { const k=freshKernel(), c=baseContext(), cap=admit(k,c); expect(k.evaluate(cap,baseContext({policy:{id:'policy',version:2}})).result==='DENY_POLICY_DRIFT','policy'); });
await test('procedure drift denied', () => { const k=freshKernel(), c=baseContext(), cap=admit(k,c); expect(k.evaluate(cap,baseContext({procedure:{id:'procedure',version:2}})).result==='DENY_PROCEDURE_DRIFT','procedure'); });
await test('tampered capability denied', () => { const k=freshKernel(), c=baseContext(), cap=admit(k,c); const tampered=structuredClone(cap); tampered.bindings.stateDigest='0'.repeat(64); expect(k.evaluate(tampered,c).result==='DENY_TAMPERED_CAPABILITY','tamper'); });
await test('replay after successful enforcement denied', () => { const k=freshKernel(), c=baseContext(), cap=admit(k,c); expect(k.enforce(cap,c).result==='EXECUTE','first'); expect(k.enforce(cap,c).result==='DENY_REPLAY','replay'); });
await test('denied stale attempt does not consume capability', () => { const k=freshKernel(), c=baseContext(), cap=admit(k,c); expect(k.enforce(cap,baseContext({state:{gitHead:'b'.repeat(40)}})).result==='DENY_STALE_STATE','stale'); expect(k.enforce(cap,c).result==='EXECUTE','fresh exact still works'); });
await test('successor has fresh identity and predecessor link', () => { const k=freshKernel(), a=baseContext(), ca=admit(k,a), b=baseContext({state:{gitHead:'b'.repeat(40)}}); const cb=k.admitSuccessor(ca,b,{nonce:'successor-nonce-000002',inheritedAuthority:false}).capability; expect(cb.capabilityId!==ca.capabilityId,'fresh id'); expect(cb.predecessorCapabilityId===ca.capabilityId,'link'); expect(cb.authorityInherited===false,'no inheritance'); });
await test('implicit successor authority inheritance forbidden', () => { const k=freshKernel(), c=baseContext(), cap=admit(k,c); expectCode(()=>k.admitSuccessor(cap,c,{nonce:'successor-nonce-000003',inheritedAuthority:true}),'IMPLICIT_AUTHORITY_INHERITANCE_FORBIDDEN'); });
await test('old capability does not become valid for successor state', () => { const k=freshKernel(), a=baseContext(), ca=admit(k,a), b=baseContext({state:{gitHead:'b'.repeat(40)}}); k.admitSuccessor(ca,b,{nonce:'successor-nonce-000004'}); expect(k.evaluate(ca,b).result==='DENY_STALE_STATE','old stale'); });
await test('DSSE signed receipt verifies', () => { const signer=generateEd25519Signer(), k=freshKernel(signer), c=baseContext(), cap=admit(k,c); const r=k.enforce(cap,c); expect(r.envelope && verifyEnvelope(r.envelope,signer.publicKey),'signature'); });
await test('DSSE tampered payload rejected', () => { const signer=generateEd25519Signer(), s=createStatement({subjectName:'x',subjectDigest:'a'.repeat(64),predicate:{result:'PASS'}}), env=signStatement(s,signer.privateKey); const tampered=structuredClone(env); const p=JSON.parse(Buffer.from(tampered.payload,'base64')); p.predicate.result='FAIL'; tampered.payload=Buffer.from(JSON.stringify(p)).toString('base64'); expect(!verifyEnvelope(tampered,signer.publicKey),'tamper reject'); });
await test('DSSE wrong public key rejected', () => { const a=generateEd25519Signer(), b=generateEd25519Signer(), s=createStatement({subjectName:'x',subjectDigest:'a'.repeat(64),predicate:{result:'PASS'}}), env=signStatement(s,a.privateKey); expect(!verifyEnvelope(env,b.publicKey),'wrong key'); });
await test('SPIFFE adapter requires external verification', () => expectCode(()=>adaptSpiffeIdentity({spiffeId:'spiffe://example.org/a',verified:false,verifier:'v'}),'IDENTITY_NOT_VERIFIED'));
await test('OIDC adapter requires external verification', () => expectCode(()=>adaptOidcIdentity({issuer:'https://issuer',subject:'u',verified:false,verifier:'v'}),'IDENTITY_NOT_VERIFIED'));
await test('Cedar Deny does not become authority', () => expectCode(()=>adaptCedarDecision({decision:'Deny',request:{principal:'p',action:'a',resource:'r'}}),'AUTHORIZATION_DENIED'));
await test('unverified Cedar Allow is rejected', () => expectCode(()=>adaptCedarDecision({decision:'Allow',verified:false,request:{principal:'p',action:'a',resource:'r'}}),'AUTHORIZATION_NOT_VERIFIED'));
await test('unverified in-toto statement is rejected', () => { const s=createStatement({subjectName:'artifact',subjectDigest:'a'.repeat(64),predicate:{result:'PASS'}}); expectCode(()=>adaptInTotoStatementEvidence(s,{verified:false,verifier:'none'}),'EVIDENCE_NOT_VERIFIED'); });
await test('in-toto Statement v1 evidence adapter accepts exact schema', () => { const s=createStatement({subjectName:'artifact',subjectDigest:'a'.repeat(64),predicate:{result:'PASS'}}); const e=adaptInTotoStatementEvidence(s,{verified:true,verifier:'test-dsse-verifier'}); expect(/^[0-9a-f]{64}$/.test(e.digest),'digest'); });
await test('in-toto wrong statement schema rejected', () => expectCode(()=>adaptInTotoStatementEvidence({_type:'wrong',subject:[{}],predicateType:'x',predicate:{}},{verified:true,verifier:'test'}),'EVIDENCE_ASSERTION_INVALID'));
await test('canonical evidence ordering is stable', () => { const k=freshKernel(), c=baseContext({evidence:[adaptGenericEvidence('z',{v:1}),adaptGenericEvidence('a',{v:2})]}), cap=admit(k,c); const reversed={...c,evidence:[...c.evidence].reverse()}; expect(k.evaluate(cap,reversed).result==='EXECUTE','order'); });
await test('fresh nonce changes capability identity', () => { const k=freshKernel(), c=baseContext(); const a=admit(k,c,'nonce-aaaaaaaaaaaaaaa'), b=admit(k,c,'nonce-bbbbbbbbbbbbbbb'); expect(a.capabilityId!==b.capabilityId,'nonce'); });
await test('short nonce rejected', () => { const k=freshKernel(); expectCode(()=>k.admit(baseContext(),{nonce:'short'}),'INVALID_NONCE'); });
await test('missing required context rejected', () => { const k=freshKernel(); expectCode(()=>k.admit({principal:{}},{nonce:'long-enough-nonce-1'}),'INVALID_INPUT'); });
await test('capability digest is deterministic for fixed clock and nonce', () => { const c=baseContext(), s1=generateEd25519Signer(), s2=generateEd25519Signer(), k1=new StateBoundAdmissibilityKernel({signer:s1,clock:()=> '2026-01-01T00:00:00Z'}), k2=new StateBoundAdmissibilityKernel({signer:s2,clock:()=> '2026-01-01T00:00:00Z'}); const a=k1.admit(c,{nonce:'deterministic-nonce-1'}).capability, b=k2.admit(c,{nonce:'deterministic-nonce-1'}).capability; expect(a.capabilityDigest===b.capabilityDigest,'deterministic'); });
await test('receipt subject binds exact capability digest', () => { const k=freshKernel(), c=baseContext(), a=k.admit(c,{nonce:'receipt-binding-nonce'}); expect(a.receipt.statement.subject[0].digest.sha256===a.capability.capabilityDigest,'subject'); });
await test('admission without signer is rejected', () => { const k=new StateBoundAdmissibilityKernel(); expectCode(()=>k.admit(baseContext(),{nonce:'signer-required-nonce'}),'SIGNER_REQUIRED'); });
await test('capability from untrusted signing key is denied', () => { const a=generateEd25519Signer(), b=generateEd25519Signer(), c=baseContext(); const cap=new StateBoundAdmissibilityKernel({signer:a}).admit(c,{nonce:'untrusted-key-nonce-01'}).capability; const verifier=new StateBoundAdmissibilityKernel({trustedPublicKeys:[b.publicKey]}); expect(verifier.evaluate(cap,c).result==='DENY_UNTRUSTED_CAPABILITY','untrusted'); });
await test('recomputed digest cannot forge capability signature', () => { const signer=generateEd25519Signer(), c=baseContext(), k=new StateBoundAdmissibilityKernel({signer}); const cap=k.admit(c,{nonce:'signature-forgery-nonce'}).capability; const forged=structuredClone(cap); forged.bindings.stateDigest='f'.repeat(64); const core=structuredClone(forged); delete core.capabilityDigest; delete core.proof; const stableLocal=(v)=>Array.isArray(v)?v.map(stableLocal):v&&typeof v==='object'?Object.fromEntries(Object.keys(v).sort().map(x=>[x,stableLocal(v[x])])):v; forged.capabilityDigest=crypto.createHash('sha256').update(JSON.stringify(stableLocal(core))).digest('hex'); expect(k.evaluate(forged,c).result==='DENY_INVALID_CAPABILITY_SIGNATURE','signature'); });
await test('external CLI consumes capability once across processes', () => {
  const signer=generateEd25519Signer(), c=baseContext(), issuer=new StateBoundAdmissibilityKernel({signer}), cap=issuer.admit(c,{nonce:'cli-replay-nonce-00001'}).capability;
  const tmp=fs.mkdtempSync(path.join(os.tmpdir(),'diamond-gate-cli-'));
  const input=path.join(tmp,'input.json'), key=path.join(tmp,'public.pem'), replay=path.join(tmp,'replay'), out1=path.join(tmp,'out1.json'), out2=path.join(tmp,'out2.json');
  fs.writeFileSync(input,JSON.stringify({capability:cap,currentContext:c}));
  fs.writeFileSync(key,signer.publicKey.export({type:'spki',format:'pem'}));
  const cli=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../src/enforce.mjs');
  const first=spawnSync(process.execPath,[cli,'--input',input,'--trusted-key',key,'--replay-store',replay,'--output',out1],{encoding:'utf8'});
  const second=spawnSync(process.execPath,[cli,'--input',input,'--trusted-key',key,'--replay-store',replay,'--output',out2],{encoding:'utf8'});
  expect(first.status===0,`first status ${first.status} ${first.stderr}`); expect(JSON.parse(fs.readFileSync(out1)).result==='EXECUTE','first execute');
  expect(second.status===3,`second status ${second.status}`); expect(JSON.parse(fs.readFileSync(out2)).result==='DENY_REPLAY','second replay');
});
await test('random mutation fuzz fails closed', () => { const k=freshKernel(), c=baseContext(), cap=admit(k,c), fields=['principal','operation','resource','state','authority','policy','procedure']; for (const field of fields) { const n=structuredClone(c); n[field]={...n[field], fuzz:crypto.randomBytes(4).toString('hex')}; expect(k.evaluate(cap,n).result!=='EXECUTE',`fuzz ${field}`); } });

const passed=results.filter(x=>x.result==='PASS').length;
const receipt={
  schema:'STATE_BOUND_ADMISSIBILITY_KERNEL_V1_SELF_TEST_RECEIPT',
  result:passed===results.length && results.length>=36 ? 'PASS_CLOSED':'FAIL_CLOSED',
  testCount:results.length,
  passed,
  failed:results.length-passed,
  invariantsCovered:['EXACT_STATE_BINDING','AUTHORITY_NON_INHERITANCE','EVIDENCE_APPLICABILITY','SCOPE_BINDING','REPLAY_REJECTION','CAPABILITY_INTEGRITY','DSSE_SIGNATURE_VERIFICATION','FAIL_CLOSED_ADAPTER_BOUNDARIES'],
  tests:results
};
const text=JSON.stringify(receipt,null,2)+'\n';
const oi=process.argv.indexOf('--output');
if(oi>=0){const target=process.argv[oi+1];if(!target)throw Error('--output requires path');fs.mkdirSync(path.dirname(path.resolve(target)),{recursive:true});fs.writeFileSync(target,text);}else process.stdout.write(text);
if(receipt.result!=='PASS_CLOSED')process.exitCode=1;
