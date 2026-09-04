#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const EXPECTED_BASE='46c56e0519fc875eac877b4bc921e3151b019a2f';
const EXPECTED_SPEC='88473442959299d6f6af82396917f0578074cab2';
const EXPECTED_PATHS=[
  'assets/compass/compass.orientation-cinematic.js',
  'assets/compass/compass.orientation-cinematic.css',
  'assets/compass/compass.orientation-cinematic.render.js',
  'assets/compass/compass.orientation-cinematic.media.js',
  'assets/compass/cinematic-media/manifest.v1.json',
  'assets/compass/compass.homepage-cinematic.verify.mjs'
].sort();
const root=process.cwd();
const read=(p)=>fs.readFileSync(path.join(root,p),'utf8');
const checks=[];
const check=(id,pass,detail='')=>checks.push({id,pass:Boolean(pass),detail});

const host=read('assets/compass/compass.orientation-cinematic.js');
const css=read('assets/compass/compass.orientation-cinematic.css');
const render=read('assets/compass/compass.orientation-cinematic.render.js');
const media=read('assets/compass/compass.orientation-cinematic.media.js');
const custody=JSON.parse(read('assets/compass/cinematic-media/manifest.v1.json'));
const combined=[host,css,render,media].join('\n');

check('EXACT_HEAD_BINDING',host.includes(EXPECTED_BASE)&&custody.sourceMain===EXPECTED_BASE);
check('SPEC_BINDING',host.includes(EXPECTED_SPEC)&&custody.specificationCommit===EXPECTED_SPEC);
check('MASTER_DURATION_38000',host.includes('const MASTER_DURATION_MS=38000')&&custody.masterDurationMs===38000);
for(const id of ['S01','S02','S03','S04','S05','S06','S07','S08'])check(`SHOT_${id}_DECLARED`,host.includes(`id:'${id}'`)&&media.includes(`id: '${id}'`));
check('NO_NAVIGATION_WRITE',!/(location\.(assign|replace)|history\.(pushState|replaceState)|window\.open\s*\()/u.test(combined));
check('NO_PROTECTED_RUNTIME_IMPORT',!/(compass\.controller|compass\.crystals|mirrorland-window|readiness-context|capability-carousel)/u.test(combined));
check('NO_ANALYTICS_DELTA',!/analytics\s*\(/iu.test(combined));
check('IDEMPOTENT_RESTORATION',host.includes('if(session.settled||session.restoring)return;')&&host.includes('restoreProductSurface()'));
check('PREVIEW_FAIL_OPEN_DEFAULT',host.includes("if(!previewEnabled())return;"));
check('NO_GENERIC_MEDIA',Array.isArray(custody.media)&&custody.media.length===0&&custody.rule==='REPOSITORY_NATIVE_SOURCE_OBJECTS_ONLY_NO_GENERIC_SUBSTITUTE_IMAGERY');

const args=process.argv.slice(2);
const baseIndex=args.indexOf('--base');
const headIndex=args.indexOf('--head');
if(baseIndex!==-1&&headIndex!==-1){
  const base=args[baseIndex+1];
  const head=args[headIndex+1];
  check('VERIFIER_BASE_MATCH',base===EXPECTED_BASE,base);
  const diff=spawnSync('git',['diff','--name-only',`${base}...${head}`],{cwd:root,encoding:'utf8'});
  if(diff.status===0){
    const changed=diff.stdout.split(/\r?\n/).filter(Boolean).sort();
    check('DECLARED_PATHS_ONLY',JSON.stringify(changed)===JSON.stringify(EXPECTED_PATHS),JSON.stringify(changed));
  }else check('DECLARED_PATHS_ONLY',false,diff.stderr||'git diff failed');
}

const result=checks.every((item)=>item.pass)?'PASS':'FAIL';
process.stdout.write(`${JSON.stringify({schema:'COMPASS_MAIN_HOMEPAGE_CINEMATIC_SHELL_VERIFIER_v1',result,expectedBase:EXPECTED_BASE,expectedSpecificationCommit:EXPECTED_SPEC,checks},null,2)}\n`);
process.exit(result==='PASS'?0:1);
