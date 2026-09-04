#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import {spawnSync} from 'node:child_process';

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
const SOURCE_BLOBS=Object.freeze({
  cosmos:'4fe781df1a8876218c6f081b6ec88d5d2d6044c7',
  crystals:'cd2cbad0494852cc80c51959a6827407d037b8fb',
  homepage:'aa476ee5f6e74f56f2415bd8d36edfe1fa7a85ec',
  chapterContract:'9813c60f8ca9b5f27fccbf44cade7bb08c2f0f2e'
});
const root=process.cwd();
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
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
for(const id of ['S01','S02','S03','S04','S05','S06','S07','S08'])check(`SHOT_${id}_DECLARED`,host.includes(`id:'${id}'`)&&media.includes(`id:'${id}'`));
check('NO_NAVIGATION_WRITE',!/(location\.(assign|replace)|history\.(pushState|replaceState)|window\.open\s*\()/u.test(combined));
const protectedRuntimeImport=/import\s*\(\s*['"][^'"]*(?:compass\.controller|compass\.crystals|mirrorland-window|readiness-context|capability-carousel)[^'"]*['"]\s*\)/u;
check('NO_PROTECTED_RUNTIME_IMPORT',!protectedRuntimeImport.test(combined));
check('NO_ANALYTICS_DELTA',!/analytics\s*\(/iu.test(combined));
check('IDEMPOTENT_RESTORATION',host.includes('if(session.settled||session.restoring)return;')&&host.includes('restoreProductSurface()')&&host.includes("window.removeEventListener('keydown',onKey,true)"));
check('REDUCED_COMPLETION_ROUTE',host.includes("restore('reduced-motion-complete')"));
check('PREVIEW_FAIL_OPEN_DEFAULT',host.includes("if(!previewEnabled())return;"));
check('NO_GENERIC_BINARY_MEDIA',Array.isArray(custody.binaryMedia)&&custody.binaryMedia.length===0&&custody.rule==='REPOSITORY_NATIVE_SOURCE_OBJECTS_ONLY_NO_GENERIC_SUBSTITUTE_IMAGERY');
check('SOURCE_RECONSTRUCTION_COUNT',Array.isArray(custody.sourceReconstructions)&&custody.sourceReconstructions.length===3);
for(const [key,blob] of Object.entries(SOURCE_BLOBS))check(`SOURCE_${key.toUpperCase()}_BOUND`,render.includes(blob)||media.includes(blob)||JSON.stringify(custody).includes(blob),blob);
check('S01_NATIVE_FIBONACCI_RECONSTRUCTION',render.includes('const GOLDEN_ANGLE=Math.PI*(3-Math.sqrt(5))')&&render.includes('const FIELD_SEED=0x44474243')&&render.includes("['255,248,224','154,217,225','234,208,131','170,155,224']"));
check('S01_EXACT_IDENTITY_COPY',render.includes('DIAMOND GATE BRIDGE')&&render.includes('Independent Interactive Experience & Research Studio')&&render.includes('Find Your Way'));
check('S02_CARDINAL_SOURCE_GEOMETRY',render.includes('function buildDiamondStarMesh()')&&render.includes('const points=8,radius=.72,inner=.30,depth=.42,crown=.20')&&render.includes('primaryAnchor:[0,.625,.78]'));
check('S02_CARDINAL_LABELS',render.includes("north:'Orientation'")&&render.includes("east:'Worlds'")&&render.includes("south:'Instruments'")&&render.includes("west:'Frontier'"));
check('S03_CHAPTER_EXACT_COPY',render.includes('For thousands of years, people have searched for better ways to understand themselves, each other, and the systems they inhabit.'));
for(const label of ['INTRODUCTION','THE STUDIO','HOW THE ESTATE WORKS','ABOUT','COMMUNITY','MEET SEAN'])check(`S03_TAB_${label.replaceAll(' ','_')}`,render.includes(label));
check('S01_S03_MEDIA_STATUS',[...['S01','S02','S03']].every(id=>media.includes(`id:'${id}'`)&&media.includes('CONSTRUCTED_SOURCE_RECONSTRUCTION')));
check('REJECTED_GENERIC_RENDERER_REMOVED',!render.includes('Follow curiosity')&&!render.includes('cinematic-audralia-fallback')&&!render.includes('<svg'));

const args=process.argv.slice(2),baseIndex=args.indexOf('--base'),headIndex=args.indexOf('--head');
if(baseIndex!==-1&&headIndex!==-1){
  const base=args[baseIndex+1],head=args[headIndex+1];
  check('VERIFIER_BASE_MATCH',base===EXPECTED_BASE,base);
  const diff=spawnSync('git',['diff','--name-only',`${base}...${head}`],{cwd:root,encoding:'utf8'});
  if(diff.status===0){const changed=diff.stdout.split(/\r?\n/).filter(Boolean).sort();check('DECLARED_PATHS_ONLY',JSON.stringify(changed)===JSON.stringify(EXPECTED_PATHS),JSON.stringify(changed));}
  else check('DECLARED_PATHS_ONLY',false,diff.stderr||'git diff failed');
}

const result=checks.every(item=>item.pass)?'PASS':'FAIL';
process.stdout.write(`${JSON.stringify({schema:'COMPASS_MAIN_HOMEPAGE_CINEMATIC_CONSTRUCTION_VERIFIER_v2',result,expectedBase:EXPECTED_BASE,expectedSpecificationCommit:EXPECTED_SPEC,checks},null,2)}\n`);
process.exit(result==='PASS'?0:1);
