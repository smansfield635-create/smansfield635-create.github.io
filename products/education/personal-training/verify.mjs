import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
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
const passed=checks.filter(x=>x.result==='PASS').length;
const result={schema:'PERSONAL_TRAINING_STUDIO_STATIC_VERIFICATION_v1',result:passed===checks.length?'PASS':'FAIL',passed,total:checks.length,checks};
console.log(JSON.stringify(result,null,2));
if(result.result!=='PASS')process.exitCode=1;
