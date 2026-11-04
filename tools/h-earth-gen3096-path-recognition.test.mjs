import test from 'node:test';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import {spawnSync} from 'node:child_process';
import {
  GEN3096_OPERATION_ID as OP,
  GEN3096_ORIGINAL_ALLOWED_PATHS as ORIGINAL,
  GEN3096_SCOPED_TEST_PATHS as TESTS,
  GEN3096_SUBJECT_HEAD as HEAD,
  gen3096TestPathAuthorized,
  verifyGen3096AdmissionEvidence,
  verifyGen3096LiveAdmission,
  resolveHEarthRepositoryRegistryPath
} from '../h-earth-3d/registry/accepted-amendments/h-earth.repository-registry.gen3096-admitted-candidate-scope.js';

const sha=s=>crypto.createHash('sha256').update(s).digest('hex');
const stable=v=>Array.isArray(v)?v.map(stable):v&&typeof v==='object'?
  Object.fromEntries(Object.keys(v).sort().map(k=>[k,stable(v[k])])):v;

// Synthetic data is used ONLY to test pure refusal conditions. It is never
// forwarded to the production admission activator (which fetches GitHub).
function fixture() {
  const req={operationId:OP,projectId:'H_EARTH',lockScope:'H_EARTH:SPATIAL_FRAME_SELECTION:20261104:V1',
    exactGoverningHead:HEAD,allowedPaths:[...ORIGINAL]};
  const proc={exactGoverningHead:HEAD,exactAllowedRepositoryPaths:[...ORIGINAL]};
  const body='CANONICAL_OPERATION_INTAKE_REQUEST_V1\n'+JSON.stringify({
    schema:'CANONICAL_OPERATION_INTAKE_TRANSPORT_REQUEST_v1',
    operationRequest:req,constructionProcedure:proc});
  const source={id:6637365749,issue_url:'https://api.github.com/repos/smansfield635-create/smansfield635-create.github.io/issues/6911',
    author_association:'OWNER',user:{login:'smansfield635-create'},body};
  const scopeHash=sha(req.lockScope.toUpperCase());
  const lock={operationId:OP,lockGeneration:3096,state:'ADMITTED_LOCKED',released:false,
    lockScope:req.lockScope,scopeHash,governingHead:HEAD,
    requestDigest:sha(JSON.stringify(stable(req))),
    procedureLocatorDigest:sha(JSON.stringify(stable(proc))),
    authorityProvenance:{invocation:{repository:'smansfield635-create/smansfield635-create.github.io',
      commentId:6637365749,commentBodySha256:sha(body),
      commentAuthorLogin:'smansfield635-create',commentAuthorAssociation:'OWNER'}}};
  return {source,ledger:{activeScopes:{[scopeHash]:lock}},
    lockRefHead:'a'.repeat(40)};
}
const check=fix=>verifyGen3096AdmissionEvidence(fix);

test('frozen 8 literals are exact, including 3 tools paths and unexpanded glob',()=>{
  assert.equal(ORIGINAL.length,8);
  assert.equal(new Set(ORIGINAL).size,8);
  assert.equal(TESTS.length,3);
  assert.equal(ORIGINAL.filter(p=>p.startsWith('tools/')).length,3);
  assert.ok(ORIGINAL.includes('h-earth-3d/evidence/spatial-diagnostics-v1/**'));
});

test('synthetic matching signed-source and active lock pass PURE structural checks only',()=>{
  const f=fixture();const r=check(f);
  assert.equal(r.eligible,true);
  assert.equal(r.authorityEffect,'NONE_PATH_RECOGNITION_ONLY');
  assert.equal(r.lockGeneration,3096);
});

test('forged owner, changed body and altered original scope all fail closed',()=>{
  const f=fixture();f.source.user.login='not-owner';
  assert.equal(check(f).eligible,false);
  const g=fixture();g.source.body+='\n';
  assert.equal(check(g).eligible,false);
  const h=fixture();const packet=JSON.parse(h.source.body.split('\n')[1]);
  packet.operationRequest.allowedPaths.pop();
  h.source.body='CANONICAL_OPERATION_INTAKE_REQUEST_V1\n'+JSON.stringify(packet);
  assert.equal(check(h).eligible,false);
});

test('released, wrong-generation, wrong-head, and nonunique locks all fail closed',()=>{
  for(const mutate of [
    l=>{l.released=true},
    l=>{l.lockGeneration=3098},
    l=>{l.governingHead='b'.repeat(40)},
    l=>{l.requestDigest='0'.repeat(64)}
  ]){
    const f=fixture();const l=Object.values(f.ledger.activeScopes)[0];mutate(l);
    assert.equal(check(f).eligible,false);
  }
  const f=fixture();const l=Object.values(f.ledger.activeScopes)[0];
  f.ledger.activeScopes.duplicate={...l};
  assert.equal(check(f).eligible,false);
});

test('three test paths do not get ambient global H-Earth registry resolution',()=>{
  for(const p of TESTS){
    assert.equal(gen3096TestPathAuthorized(p),false);
    assert.notEqual(resolveHEarthRepositoryRegistryPath(p).resolved,true);
  }
});

test('rooted candidates have truthful absent source occurrences, without prefix authority',()=>{
  const p='/showroom/globe/h-earth/vegetation-prototype/spatial-evidence.v1.js';
  const r=resolveHEarthRepositoryRegistryPath(p);
  assert.equal(r.resolved,true);
  const o=r.occurrences.find(x=>x.path===p);
  assert.equal(o.existenceStatus,'ABSENT');
  assert.equal(o.gitBlobSha,null);
  assert.notEqual(resolveHEarthRepositoryRegistryPath('/showroom/globe/h-earth/vegetation-prototype/unadmitted.js').resolved,true);
});

test('unadmitted ninth path is refused without contacting GitHub',async()=>{
  await assert.rejects(
    verifyGen3096LiveAdmission([...ORIGINAL,'tools/h-earth-unadmitted.test.mjs'],OP,true),
    /GEN3096_EXACT_EIGHT_INPUTS_REQUIRED/);
});

test('AI entry router blocks a ninth unregistered tools file',()=>{
  const r=spawnSync(process.execPath,['tools/repository-ai-entry-router.mjs',
    '--mutation-intent','--task',OP,'--path','tools/h-earth-unadmitted.test.mjs'],
    {encoding:'utf8'});
  assert.equal(r.status,1,r.stderr);
  const receipt=JSON.parse(r.stdout);
  assert.equal(receipt.disposition,'BLOCK');
  assert.equal(receipt.routes[0].routeClass,'UNREGISTERED');
});

test('native H-Earth preflight remains STOP for a wrong/unadmitted set',()=>{
  const r=spawnSync(process.execPath,['tools/h-earth-repository-registry-auto-preflight.mjs',
    '--mutation-intent','--task',OP,'--path',
    'showroom/globe/h-earth/vegetation-prototype/unadmitted.js'],
    {encoding:'utf8'});
  assert.equal(r.status,1,r.stderr);
  const receipt=JSON.parse(r.stdout);
  assert.equal(receipt.finalDisposition,'STOP');
  assert.equal(receipt.mutationMayProceed,false);
  assert.ok(receipt.failureCodes.includes('GEN3096_EXACT_EIGHT_INPUTS_REQUIRED'));
});
