import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const dir = path.dirname(fileURLToPath(import.meta.url));
const index = fs.readFileSync(path.join(dir, 'index.html'), 'utf8');
const course = fs.readFileSync(path.join(dir, 'course.html'), 'utf8');
const sourceMatch = course.match(/<script id="study-data" type="application\/json">([\s\S]*?)<\/script>/);
const learningMatch = course.match(/<script id="learning-data" type="application\/json">([\s\S]*?)<\/script>/);
const SOURCE = sourceMatch && JSON.parse(sourceMatch[1]);
const LEARNING = learningMatch && JSON.parse(learningMatch[1]);
const appCode = course.match(/<\/script><script>([\s\S]*?)<\/script><\/body>/)?.[1];
const checks = [];
const check = (name, fn) => {try {fn();checks.push({name,result:'PASS'});}catch(error){checks.push({name,result:'FAIL',detail:error?.stack||String(error)});}};
const digest = s => crypto.createHash('sha256').update(s, 'utf8').digest('hex');

check('Entry redirects to actual course and retains accessible layout',()=>{assert.match(index,/http-equiv="refresh" content="0; url=course.html"/);assert.match(course,/name="viewport"/);assert.match(course,/prefers-reduced-motion/);assert.match(course,/focus-visible/);assert.match(course,/Script-first v11/);});
check('No external JS or CSS dependencies',()=>{assert.doesNotMatch(course,/<script[^>]+src=/i);assert.doesNotMatch(course,/<link[^>]+rel="stylesheet"/i);});
check('No network tracking and v7 progress storage remains unchanged',()=>{assert.match(course,/everything-breaks-public-progress-v7/);assert.doesNotMatch(appCode,/\bfetch\s*\(|XMLHttpRequest|sendBeacon\s*\(/);});
check('Original source and authored learning policy are separate',()=>{assert.ok(SOURCE&&LEARNING);assert.equal(SOURCE.practice,undefined);assert.equal(LEARNING.schema,'EVERYTHING_BREAKS_INSTRUCTIONAL_POLICY_V11');assert.equal(LEARNING.policyVersion,11);});
check('Original source-only bytes pinned independently of exercises',()=>{assert.equal(digest(sourceMatch[1]),'e92062d468471ef555416de9be647abde15846aaedbf68d648bb60197937cf06');});
check('All 77 original source units preserved',()=>{assert.equal(SOURCE.script.length,6);assert.equal(SOURCE.script.flatMap(x=>x.segments).length,19);assert.equal(SOURCE.terms.length,20);assert.equal(SOURCE.product.flatMap(x=>x.segments).length,10);assert.equal(SOURCE.phone.flatMap(x=>x.segments).length,28);});
check('Each of the 19 representative passages has governed learning metadata',()=>{assert.equal(LEARNING.passages.length,SOURCE.script.length);for(let st=0;st<SOURCE.script.length;st++){assert.equal(LEARNING.passages[st].length,SOURCE.script[st].segments.length);for(let i=0;i<SOURCE.script[st].segments.length;i++){const meta=LEARNING.passages[st][i];assert.ok(Array.isArray(meta.types)&&meta.types.length>0);assert.ok(meta.note);assert.ok(meta.types.every(x=>['FIXED','VARIABLE','CONDITIONAL','DELIVERY','CONTRACT_DEPENDENT'].includes(x)));for(const [needle,value] of meta.slots||[]){assert.equal(SOURCE.script[st].segments[i].split(needle).length,2);assert.match(value,/^\[.+\]$/);}}}});
check('Variable fields are not fixed cloze targets',()=>{for(let st=0;st<SOURCE.script.length;st++)for(let i=0;i<SOURCE.script[st].segments.length;i++){const target=LEARNING.practice.cloze[st][i],line=SOURCE.script[st].segments[i];assert.ok(line.includes(target),`target not original ${st}:${i}`);for(const [literal] of LEARNING.passages[st][i].slots||[])assert.ok(!target.includes(literal)&&!literal.includes(target),`variable cloze ${st}:${i}`);}});
check('No example mileage, model or sample amount appears as quiz answer or distractor',()=>{const regex=/28013|2024 Ford F-150|\$179\.00|\$149\.88|AVERAGE \$100|\$100/;for(const q of LEARNING.practice.scenarios){assert.doesNotMatch(q.answer,regex);for(const option of q.options)assert.doesNotMatch(option,regex);assert.ok(q.options.includes(q.answer));}});
check('Authored quiz answers grounded in exact source excerpts',()=>{for(const q of LEARNING.practice.scenarios){let source;if(q.sourceType==='script')source=SOURCE.script[q.sourceIndex].segments[q.segmentIndex];else if(q.sourceType==='term')source=SOURCE.terms[q.sourceIndex].name+' — '+SOURCE.terms[q.sourceIndex].definition;else source=SOURCE[q.sourceType][q.sourceIndex].segments[q.segmentIndex];assert.ok(source.includes(q.answer),`${q.id}: answer not exact source substring`);}});
check('Application code parses and does not use dynamic code evaluation',()=>{assert.ok(appCode);new vm.Script(appCode,{filename:'training-v11.js'});assert.doesNotMatch(appCode,/\beval\s*\(|new Function\s*\(/);});

function harness(initialState=null){
 const store=new Map();if(initialState)store.set('everything-breaks-public-progress-v7',JSON.stringify(initialState));
 const nav={innerHTML:'',listeners:{},addEventListener(name,fn){this.listeners[name]=fn}};
 const main={innerHTML:'',listeners:{},addEventListener(name,fn){this.listeners[name]=fn}};
 const downloads=[];
 const document={getElementById(id){if(id==='study-data')return {textContent:sourceMatch[1]};if(id==='learning-data')return {textContent:learningMatch[1]};return null},querySelector(id){return id==='#nav'?nav:id==='#main'?main:null},createElement(tag){assert.equal(tag,'a');return {download:'',click(){downloads.push(this.download)},remove(){}}},body:{appendChild(){}}};
 const storage={getItem:k=>store.get(k)??null,setItem:(k,v)=>store.set(k,v)};
 const window={scrollTo(){},__mock:null};
 const URL={createObjectURL:()=> 'blob:backup',revokeObjectURL(){}};
 const ctx=vm.createContext({document,window,localStorage:storage,URL,Blob,confirm:()=>true,setTimeout:fn=>fn(),console});
 new vm.Script(appCode).runInContext(ctx,{timeout:6000});
 const evaluate=expression=>vm.runInContext(expression,ctx,{timeout:6000});
 const act=(action,id='')=>evaluate('doAction({dataset:{action:'+JSON.stringify(action)+',id:'+JSON.stringify(String(id))+'}})');
 return {evaluate,act,main,nav,store,downloads};
}
check('Source-only original display marks example mileage as variable',()=>{const x=harness();x.evaluate("section='script';stage=1;phase=0;part=0;render()");assert.match(x.main.innerHTML,/28013 miles/);assert.match(x.main.innerHTML,/class="variable"/);assert.match(x.main.innerHTML,/Memorize the mileage-confirmation sentence, not 28,013/);});
check('Adaptable practice has mileage placeholder and no model-number target',()=>{const x=harness();assert.match(x.evaluate('practiceLine(1,0)'),/\[verified customer mileage\]/);assert.doesNotMatch(x.evaluate('practiceLine(1,0)'),/28013/);assert.match(x.evaluate('practiceLine(0,1)'),/\[verified vehicle year, make and model\]/);assert.doesNotMatch(x.evaluate('practiceLine(5,0)'),/179\.00|149\.88/);});
check('All source highlights avoid slot and fixed-target overlap',()=>{const x=harness();x.evaluate('for(let i=0;i<DATA.script.length;i++)for(let j=0;j<DATA.script[i].segments.length;j++)sourceMarked(i,j)');});
check('Long passages are segmented into source-order phrases without text loss',()=>{const x=harness();for(let st=0;st<SOURCE.script.length;st++)for(let i=0;i<SOURCE.script[st].segments.length;i++){const chunks=x.evaluate(`phraseList(${st},${i})`);const text=x.evaluate(`practiceLine(${st},${i})`);assert.equal(chunks.join(' '),text,`phrase mismatch ${st}:${i}`)}assert.ok(x.evaluate('phraseList(3,0).length')>=4);});
check('Incorrect order receives feedback and can then be corrected',()=>{const x=harness();x.evaluate("section='script';stage=1;phase=4;part=0;render()");x.act('order-choice',1);assert.match(x.main.innerHTML,/belongs elsewhere/);x.act('order-choice',0);assert.equal(x.evaluate('part'),1);});
check('Wrong fixed cloze answer cannot advance until correct reattempt',()=>{const x=harness();x.evaluate("section='script';stage=1;phase=3;part=0;render()");const wrong=x.evaluate("clozeOptions(1,0).findIndex(x=>x!==DATA.practice.cloze[1][0])");x.act('gap-choice',wrong);assert.match(x.main.innerHTML,/Try this phrase again/);assert.doesNotMatch(x.main.innerHTML,/data-action="part-next"/);x.act('gap-retry');assert.equal(x.evaluate('choiceResult'),null);const correct=x.evaluate("clozeOptions(1,0).indexOf(DATA.practice.cloze[1][0])");x.act('gap-choice',correct);assert.match(x.main.innerHTML,/Next question/);x.act('part-next');assert.equal(x.evaluate('part'),1);});
check('Phrase miss requires retry and is tracked separately',()=>{const x=harness();x.evaluate("section='script';stage=3;phase=2;part=0;render()");x.act('reveal');x.act('phrase-miss');assert.equal(x.evaluate("progress.missedPhrases['3:0:0']"),1);assert.equal(x.evaluate('part'),0);x.act('reveal');x.act('phrase-pass');assert.equal(x.evaluate("progress.missedPhrases['3:0:0']"),undefined);assert.equal(x.evaluate('progress.stages[3].phraseIndex'),1);});
check('Legacy missed passages remain reviewable',()=>{const x=harness();x.evaluate("section='script';stage=5;recordMiss(5,0);stage=-1;render()");assert.match(x.main.innerHTML,/Review missed passages and phrases/);x.act('review-miss','5:0');assert.equal(x.evaluate('stage'),5);assert.equal(x.evaluate('phase'),2);});
check('Unresolved missed wording blocks section self-check',()=>{const x=harness();x.evaluate("section='script';stage=1;phase=5;part=0;show=true;recordMiss(1,0);progress.stages[1].rubric={wording:true,variables:true,delivery:true};render()");assert.equal(x.evaluate('gradeReady(1)'),false);assert.match(x.main.innerHTML,/disabled>Complete V11 section self-check/);});
check('Section self-check requires all applicable rubric items',()=>{const x=harness();x.evaluate("section='script';stage=1;phase=5;part=0;show=true;render()");assert.equal(x.evaluate('gradeReady(1)'),false);x.act('rubric-toggle','wording');x.act('rubric-toggle','variables');x.act('rubric-toggle','delivery');assert.equal(x.evaluate('gradeReady(1)'),true);x.act('stage-pass');assert.equal(x.evaluate('progress.stages[1].verifiedV11'),true);});
check('Failed section restarts phrase practice and clears v11 verification',()=>{const x=harness();x.evaluate("section='script';stage=5;phase=5;show=true;progress.stages[5].verifiedV11=true;render()");x.act('stage-fail');assert.equal(x.evaluate('stage'),5);assert.equal(x.evaluate('phase'),2);assert.equal(x.evaluate('progress.stages[5].verifiedV11'),false);});
check('V10 progress is preserved but cannot silently confer V11 readiness',()=>{const temp=harness();const legacy=JSON.parse(temp.store.get('everything-breaks-public-progress-v7')||'null')||temp.evaluate('initial()');for(const st of legacy.stages){st.complete=true;st.phase=5;st.part=0}legacy.mockCalls=[{at:'2026-11-04',passed:6,durationSeconds:200}];const x=harness(legacy);assert.equal(x.evaluate('tracking().scriptDone'),0);assert.equal(x.evaluate('tracking().mondayReady'),false);assert.ok(x.evaluate('progress.stages.every(p=>p.complete===true)'));assert.ok(x.evaluate('progress.stages.every(p=>p.phase===0)'));});
check('Prior v7 record and current v11 fields survive export/import',()=>{const x=harness();x.evaluate("progress.stages[0].complete=true;progress.stages[0].verifiedV11=true;progress.stages[0].rubric={wording:true,variables:true,delivery:true};progress.missedPhrases={'0:0:0':2};save()");const backup=x.evaluate("parseProgressBackup({schema:'EVERYTHING_BREAKS_PROGRESS_BACKUP_v1',state:progress})");assert.equal(backup.version,7);assert.equal(backup.stages[0].verifiedV11,true);assert.equal(backup.missedPhrases['0:0:0'],2);x.act('nav','progress');x.act('progress-export');assert.ok(x.downloads.includes('everything-breaks-training-progress.json'));});
check('Full mock remains truly continuous until retrospective stage review',()=>{const x=harness();x.act('nav','mock');x.act('mock-start');assert.match(x.main.innerHTML,/Speak the entire script without prompts/);assert.doesNotMatch(x.main.innerHTML,/Commitment &amp; Coverage/);assert.equal(x.evaluate('window.__mock.spokenAll'),false);x.act('mock-grade-yes');assert.equal(x.evaluate('window.__mock.index'),0);x.act('mock-review-start');assert.equal(x.evaluate('window.__mock.spokenAll'),true);});
check('Only a six-section version-11 continuous mock supports deadline self-check',()=>{const x=harness();x.evaluate("for(const p of progress.stages)p.verifiedV11=true");assert.equal(x.evaluate('tracking().mondayReady'),false);x.act('nav','mock');x.act('mock-start');x.act('mock-review-start');for(let i=0;i<6;i++){x.act('reveal');x.act('mock-grade-yes')}assert.equal(x.evaluate('tracking().mondayReady'),true);x.evaluate('progress.known[0]=false;progress.reviewed["product:0"]=true');assert.equal(x.evaluate('tracking().mondayReady'),true);});
check('Unresolved misses disallow a nominal 6/6 mastery score',()=>{const x=harness();x.evaluate("for(const p of progress.stages)p.verifiedV11=true;progress.mockCalls.unshift({passed:6,mode:'continuous',trainingVersion:11});progress.missedParts['2:0']=1");assert.equal(x.evaluate('tracking().mondayReady'),false);});
check('All script display functions and policy routes render without throwing',()=>{const x=harness();x.evaluate('for(let st=0;st<DATA.script.length;st++)for(let phase=0;phase<6;phase++){section="script";stage=st;window.phase=phase;this.phase=phase;render()}');});

const passed=checks.filter(x=>x.result==='PASS').length;
const result={schema:'EVERYTHING_BREAKS_V11_INSTRUCTIONAL_VERIFICATION_v1',result:passed===checks.length?'PASS':'FAIL',passed,total:checks.length,checks};
console.log(JSON.stringify(result,null,2));
if(result.result!=='PASS')process.exitCode=1;
