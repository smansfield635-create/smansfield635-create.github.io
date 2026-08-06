import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const args=process.argv.slice(2);
const get=name=>args[args.indexOf(name)+1];
const repo=path.resolve(get('--repository')||'.');
const output=get('--output');
const C='control-plane/methods-information-benchmark/context-displacement-minimum-real-3d-proof-v1';
const required=[
  '.github/workflows/methods-context-displacement-minimum-real-3d-proof-v1.yml',
  `${C}/README.md`,`${C}/index.html`,`${C}/styles.css`,`${C}/data.mjs`,`${C}/math.mjs`,`${C}/state.mjs`,
  `${C}/renderer.mjs`,`${C}/navigation.mjs`,`${C}/app.mjs`,`${C}/proof-contract.v1.json`,
  `${C}/smaller-corpus.fixture.v1.json`,`${C}/verify.v1.mjs`,`${C}/receipts/builder.receipt.v1.json`,
  `${C}/receipts/fresh-verifier.receipt.v1.json`,`${C}/receipts/independent-equality.receipt.v1.json`,
  `${C}/receipts/operation-closure.receipt.v1.json`
];
const errors=[];
for(const file of required)if(!fs.existsSync(path.join(repo,file)))errors.push(`MISSING:${file}`);
if(errors.length)finish();
const read=file=>fs.readFileSync(path.join(repo,file),'utf8');
const contract=JSON.parse(read(`${C}/proof-contract.v1.json`));
const fixture=JSON.parse(read(`${C}/smaller-corpus.fixture.v1.json`));
if(required.length!==17||contract.registeredPathCount!==17)errors.push('REGISTERED_PATH_COUNT_MISMATCH');
if(contract.minimumReference.stages!==2||contract.minimumReference.modelsPerStage!==3||contract.minimumReference.fullyPopulatedModel!=='pcr')errors.push('MINIMUM_REFERENCE_MISMATCH');
if(contract.authorityBoundary.publicPageMutation!==false||contract.authorityBoundary.mergeAuthorized!==false)errors.push('AUTHORITY_BOUNDARY_MISMATCH');
if(fixture.stages.length!==1||fixture.stages[0].models.length!==2)errors.push('SMALLER_CORPUS_FIXTURE_MISMATCH');
const html=read(`${C}/index.html`);
const css=read(`${C}/styles.css`);
const renderer=read(`${C}/renderer.mjs`);
const navigation=read(`${C}/navigation.mjs`);
const state=read(`${C}/state.mjs`);
const app=read(`${C}/app.mjs`);
for(const token of ['Practical','Engineering','Evidence'])if(!html.includes(token))errors.push(`VISIBLE_LENS_MISSING:${token}`);
if(!renderer.includes("getContext('webgl2'"))errors.push('WEBGL2_CONTEXT_MISSING');
for(const token of ['pointerdown','pointermove','pointerup','wheel'])if(!navigation.includes(token))errors.push(`NAVIGATION_INPUT_MISSING:${token}`);
for(const token of ['createReturnEnvelope','verifyAndRestore','SHA-256'])if(!state.includes(token))errors.push(`EXACT_RETURN_MISSING:${token}`);
if(!css.includes('prefers-reduced-motion'))errors.push('REDUCED_MOTION_MISSING');
if(!app.includes('renderer.render(state)'))errors.push('PERSISTENT_FRAME_LOOP_MISSING');
for(const token of ['modal','previous-model','next-model','travel-button'])if(html.includes(token))errors.push(`PROHIBITED_PRIMARY_CONTROL:${token}`);
const domain={
  schema:'METHODS_MINIMUM_REAL_3D_PROOF_FINGERPRINT_DOMAIN_v1',
  paths:required.map(file=>({path:file,sha256:crypto.createHash('sha256').update(read(file)).digest('hex')})),
  contract,
  fixture
};
const fingerprint=crypto.createHash('sha256').update(JSON.stringify(domain)).digest('hex');
finish({schema:'METHODS_MINIMUM_REAL_3D_PROOF_VERIFICATION_RECEIPT_v1',result:errors.length?'FAIL':'PASS',fingerprint,registeredPathCount:required.length,conditionsChecked:14,errors});

function finish(value={schema:'METHODS_MINIMUM_REAL_3D_PROOF_VERIFICATION_RECEIPT_v1',result:'FAIL',errors}){
  const text=JSON.stringify(value,null,2)+'\n';
  if(output)fs.writeFileSync(output,text);else process.stdout.write(text);
  if(value.result!=='PASS')process.exitCode=1;
}
