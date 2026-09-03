import fs from 'node:fs';
import {execFileSync} from 'node:child_process';
import {createHash} from 'node:crypto';

const contractPath='control-plane/whole-estate/characters-reconstruction-v1/predecessor-continuity-s1-s2-s3-contract.v1.json';
const contract=JSON.parse(fs.readFileSync(contractPath,'utf8'));
const git=(...args)=>execFileSync('git',args,{encoding:'utf8'}).trim();
const blob=(rev,path)=>git('rev-parse',`${rev}:${path}`);
const read=path=>fs.readFileSync(path,'utf8');
const assertions=[];
const check=(id,ok,detail='')=>{assertions.push({id,ok,detail});if(!ok)process.exitCode=1;};
const head=git('rev-parse','HEAD^{commit}');
const base=contract.governingBase;

const changed=git('diff','--name-only',`${base}..${head}`).split(/\r?\n/).filter(Boolean);
const allowed=new Set([
 'characters/app.mjs','characters/forest-system.mjs','characters/cloud-system.mjs','characters/cloud-traversal.mjs',
 contractPath,'control-plane/whole-estate/characters-reconstruction-v1/verify-predecessor-continuity-s1-s2-s3.v1.mjs',
 '.github/workflows/characters-predecessor-continuity-s1-s2-s3-v1.yml'
]);
check('PATH_SCOPE',changed.every(p=>allowed.has(p)),changed.join(','));
for(const path of contract.protectedS1Paths)check(`S1_IDENTITY:${path}`,blob(head,path)===blob(base,path),`${blob(base,path)} -> ${blob(head,path)}`);
for(const [path,spec] of Object.entries(contract.qualifiedSubsystems))check(`QUALIFIED_BLOB:${path}`,blob(head,path)===spec.blob,`${blob(head,path)} expected ${spec.blob}`);

const app=read('characters/app.mjs');
const required=[
 "import {createForestSystem} from './forest-system.mjs';",
 "import {createCloudSystem} from './cloud-system.mjs';",
 "const forest=createForestSystem(gl,{compact});",
 "const cloudSystem=createCloudSystem({gl,compact,reducedMotion});",
 "forest.draw(vp,reducedMotion?0:now*.001);cloudSystem.draw({vp,time:reducedMotion?0:now*.001,state:document.documentElement.dataset.cloudTravel||'ORBIT'});"
];
for(const token of required)check(`APP_COMPOSITION:${token.slice(0,48)}`,app.includes(token));
const s2App=git('show',`${contract.sourceHeads.s2}:characters/app.mjs`);
const strip=s=>s
 .replace("import {createCloudSystem} from './cloud-system.mjs';\n",'')
 .replace("const cloudSystem=createCloudSystem({gl,compact,reducedMotion});\n",'')
 .replace("forest.draw(vp,reducedMotion?0:now*.001);cloudSystem.draw({vp,time:reducedMotion?0:now*.001,state:document.documentElement.dataset.cloudTravel||'ORBIT'});","forest.draw(vp,reducedMotion?0:now*.001);");
check('APP_ONLY_AUTHORIZED_SEAMS',strip(app)===s2App,'Combined app must reduce byte-exactly to S2 app after removing S3 seams.');
check('DRAW_ORDER_FOREST_BEFORE_CLOUDS',app.indexOf('forest.draw(')<app.indexOf('cloudSystem.draw('));

const receipt={schema:'MIRRORLAND_PREDECESSOR_CONTINUITY_RECEIPT_v1',operationId:contract.operationId,head,base,result:assertions.every(a=>a.ok)?'PASS':'FAIL',assertions,fingerprint:createHash('sha256').update(JSON.stringify({head,changed,assertions})).digest('hex')};
fs.writeFileSync('predecessor-continuity-s1-s2-s3-receipt.json',JSON.stringify(receipt,null,2)+'\n');
console.log(JSON.stringify(receipt,null,2));
if(receipt.result!=='PASS')process.exit(1);
