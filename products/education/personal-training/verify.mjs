import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const dir=path.dirname(fileURLToPath(import.meta.url));
const html=fs.readFileSync(path.join(dir,'index.html'),'utf8');
const checks=[];
function verify(name,fn){try{fn();checks.push({name,result:'PASS'});}catch(error){checks.push({name,result:'FAIL',detail:error.message});}}
verify('HTML document and responsive layout',()=>{assert.match(html,/^<!doctype html>/i);assert.match(html,/name="viewport"/);assert.match(html,/mobile-nav/);});
verify('Generic non-employer title',()=>assert.match(html,/<title>Personal Training Studio/));
verify('No employer identifiers or example prices',()=>{for(const word of ['Everything Breaks','everythingbreaks','Insignia Staffing','Brigitte Reynolds','Ford F-150','149.88','179.00','Senior Coverage Specialist'])assert.equal(html.toLowerCase().includes(word.toLowerCase()),false,word);});
verify('Private pack is not embedded',()=>assert.match(html,/<script id="privatePack" type="application\/json"><\/script>/));
verify('No external script or stylesheet dependencies',()=>{assert.doesNotMatch(html,/<script[^>]+src=/i);assert.doesNotMatch(html,/<link[^>]+rel="stylesheet"/i);});
verify('All six progressive teaching phases',()=>{for(const x of ['Understand','Hear & echo','Reconstruct','Put in order','Recall from cues','Independent delivery'])assert.ok(html.includes(x),x);});
verify('Product and phone instruction paths',()=>{for(const x of ['Product knowledge','Call skills','Knowledge check'])assert.ok(html.includes(x),x);});
verify('Integrated training and performance modes',()=>{for(const x of ['Script course','Flashcards','Role-play','Mock call','Progress'])assert.ok(html.includes(x),x);});
verify('Explicit private import and progress export',()=>{for(const x of ['Import private lesson pack','Export progress','Replace private lesson pack'])assert.ok(html.includes(x),x);});
verify('Browser-local storage only',()=>{assert.ok(html.includes('localStorage'));assert.doesNotMatch(html,/fetch\s*\(|XMLHttpRequest|navigator\.sendBeacon/i);});
verify('Client-controlled rendering and bounded inputs',()=>{assert.ok(html.includes('function render('));assert.ok(html.includes('function save('));assert.ok(html.includes('const esc='));});
verify('No dynamic code execution or unsafe external redirects',()=>{assert.doesNotMatch(html,/\beval\s*\(|new Function\s*\(|window\.location\s*=|location\.href\s*=/);});
verify('Inline JavaScript parses',()=>{const scripts=[...html.matchAll(/<script(?:\s+[^>]*)?>([\s\S]*?)<\/script>/gi)].map(x=>x[1]).filter(x=>x.trim());assert.equal(scripts.length,1);new vm.Script(scripts[0],{filename:'personal-training-studio-inline.js'});});
verify('Readability and reduced-motion accommodation',()=>{assert.ok(html.includes('prefers-reduced-motion'));assert.ok(html.includes('focus-visible'));assert.ok(html.includes('aria-label'));});

const course=fs.readFileSync(path.join(dir,'course.html'),'utf8');
const dataMatch=course.match(/<script id="study-data" type="application\/json">([\s\S]*?)<\/script>/);
const courseData=dataMatch?JSON.parse(dataMatch[1]):null;
verify('Published course HTML has the first-class learner UI',()=>{
 assert.match(course,/Monday, November 9/);
 assert.match(course,/name="viewport"/);
 assert.match(course,/Download progress backup/);
 assert.match(course,/Review missed passages/);
 assert.match(course,/prefers-reduced-motion/);
 assert.doesNotMatch(course,/<script[^>]+src=/i);
 assert.doesNotMatch(course,/<link[^>]+rel="stylesheet"/i);
});
verify('All original course data bytes remain unchanged from v9',()=>{
 assert.ok(dataMatch,'Embedded employer-supplied study data missing');
 const digest=crypto.createHash('sha256').update(dataMatch[1],'utf8').digest('hex');
 assert.equal(digest,'a775f6de35d978985e204beedb964b0cfe388974433071c9bf9da0b68c8e8cca');
 assert.equal(courseData.script.length,6);
 assert.equal(courseData.script.flatMap(s=>s.segments).length,19);
 assert.equal(courseData.terms.length,20);
 assert.equal(courseData.product.flatMap(s=>s.segments).length,10);
 assert.equal(courseData.phone.flatMap(s=>s.segments).length,28);
 assert.equal(courseData.practice.scenarios.length,20);
});
const courseCode=course.match(/<\/script><script>([\s\S]*?)<\/script><\/body>/)?.[1];
verify('Real course inline JavaScript parses',()=>{
 assert.ok(courseCode,'Course application code missing');
 new vm.Script(courseCode,{filename:'everything-breaks-course.js'});
});
function courseHarness(){
 const store=new Map(), downloads=[], revoked=[];
 const area=()=>({innerHTML:'',listeners:{},addEventListener(type,fn){this.listeners[type]=fn}});
 const nav=area(),main=area(),body={appendChild(){}};
 const document={
  getElementById:id=>id==='study-data'?{textContent:dataMatch[1]}:null,
  querySelector:sel=>sel==='#nav'?nav:sel==='#main'?main:null,
  createElement:tag=>{assert.equal(tag,'a');return {click(){downloads.push(this.download)},remove(){}}},
  body
 };
 const localStorage={getItem:k=>store.get(k)??null,setItem:(k,v)=>store.set(k,v)};
 const window={scrollTo(){},__mock:null};
 const URL={createObjectURL:blob=>{downloads.push(blob);return 'blob:progress-backup'},revokeObjectURL:url=>revoked.push(url)};
 const ctx=vm.createContext({document,window,localStorage,URL,Blob,confirm:()=>true,setTimeout:fn=>fn(),console});
 new vm.Script(courseCode).runInContext(ctx,{timeout:5000});
 const evaluate=x=>vm.runInContext(x,ctx,{timeout:5000});
 const act=(action,id='')=>evaluate('doAction({dataset:{action:'+JSON.stringify(action)+',id:'+JSON.stringify(String(id))+'}})');
 return {evaluate,act,main,nav,store,downloads,revoked};
}
verify('Incorrect order answer displays feedback without crashing',()=>{
 const t=courseHarness();
 t.evaluate("section='script';stage=0;phase=4;part=0;render()");
 t.act('order-choice',1);
 assert.match(t.main.innerHTML,/This phrase belongs elsewhere in the source sequence/);
 t.act('order-choice',0);
 assert.equal(t.evaluate('part'),1);
});
verify('Speech-disabled devices receive visible fallback feedback',()=>{
 const t=courseHarness();
 t.evaluate("section='script';stage=0;phase=1;part=0;render()");
 t.act('listen');
 assert.match(t.main.innerHTML,/Audio unavailable/);
});
verify('Missed passages are saved, accessible and cleared by self-check',()=>{
 const t=courseHarness();
 t.evaluate("section='script';stage=0;phase=2;part=0;render()");
 t.act('mark-miss');
 assert.equal(t.evaluate("progress.missedParts['0:0']"),1);
 t.evaluate("stage=-1;section='script';render()");
 assert.match(t.main.innerHTML,/Review missed passages/);
 t.act('review-miss','0:0');
 assert.equal(t.evaluate('stage'),0);
 assert.equal(t.evaluate('part'),0);
 t.act('reveal');t.act('part-next');
 assert.equal(t.evaluate("progress.missedParts['0:0']"),undefined);
});
verify('Failed script assessment returns to reteaching, not next section',()=>{
 const t=courseHarness();
 t.evaluate("section='script';stage=5;phase=5;part=0;show=true;render()");
 t.act('stage-fail');
 assert.equal(t.evaluate('stage'),5);
 assert.equal(t.evaluate('phase'),2);
 assert.ok(t.evaluate("progress.missedParts['5:0']")>0);
});
verify('Sixth-section completion gives clear summary',()=>{
 const t=courseHarness();
 t.evaluate("section='script';stage=5;phase=5;part=0;for(const p of progress.stages)p.complete=true;render()");
 t.act('stage-pass');
 assert.equal(t.evaluate('stage'),-1);
 assert.match(t.main.innerHTML,/All six sections self-checked/);
 assert.match(t.main.innerHTML,/Start full mock call/);
});
verify('Full mock call qualifies Monday only after all six accurate sections',()=>{
 const t=courseHarness();
 t.evaluate('for(const p of progress.stages)p.complete=true');
 assert.equal(t.evaluate('tracking().mondayReady'),false);
 t.act('nav','mock');t.act('mock-start');
 for(let i=0;i<6;i++){t.act('reveal');t.act('mock-grade-yes')}
 assert.equal(t.evaluate('tracking().mondayReady'),true);
 t.act('nav','terms');
 t.evaluate("progress.known[0]=true;save()");
 assert.equal(t.evaluate('tracking().mondayReady'),true);
});
verify('Progress backup preserves existing v7 state and rejects mismatched formats',()=>{
 const t=courseHarness();
 t.evaluate('progress.stages[0].complete=true;progress.missedParts={"0:1":2};save()');
 const x=t.evaluate("parseProgressBackup(JSON.parse(JSON.stringify({schema:'EVERYTHING_BREAKS_PROGRESS_BACKUP_v1',state:progress})))");
 assert.equal(x.version,7);
 assert.equal(x.stages[0].complete,true);
 assert.equal(x.missedParts['0:1'],2);
 assert.throws(()=>t.evaluate("parseProgressBackup({version:99,stages:[]})"),/Backup does not match/);
 t.act('nav','progress');t.act('progress-export');
 assert.ok(t.downloads.includes('everything-breaks-training-progress.json'));
 assert.ok(t.store.has('everything-breaks-public-progress-v7'));
});
const passed=checks.filter(x=>x.result==='PASS').length;
const result={schema:'PERSONAL_TRAINING_STUDIO_STATIC_VERIFICATION_v1',result:passed===checks.length?'PASS':'FAIL',passed,total:checks.length,checks};
console.log(JSON.stringify(result,null,2));
if(result.result!=='PASS')process.exitCode=1;
