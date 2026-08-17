import fs from 'node:fs';

const files={
  input:'assets/compass/compass.orbit-input.js',
  statement:'assets/compass/compass.statement-carousel.js',
  statementCss:'assets/compass/compass.statement-carousel.css',
  capability:'assets/compass/compass.capability-carousel.js',
  capabilityCss:'assets/compass/compass.capability-carousel.css',
  brain:'assets/compass/compass.brain-scene.js',
  index:'index.html'
};
const budgets={input:4096,statement:6144,statementCss:4096,capability:12288,capabilityCss:10240,brain:24576};
const text=Object.fromEntries(Object.entries(files).map(([k,p])=>[k,fs.readFileSync(p,'utf8')]));
const checks=[];const check=(id,pass,evidence)=>checks.push({id,pass:Boolean(pass),evidence});
for(const [key,max] of Object.entries(budgets))check(`BUDGET_${key.toUpperCase()}`,Buffer.byteLength(text[key])<=max,{bytes:Buffer.byteLength(text[key]),max});
check('LEGACY_BUNDLE_NOT_LOADED',!text.index.includes('compass.carousel.js')&&!text.index.includes('compass.carousel.css'),'legacy monolith absent from index');
for(const key of ['orbit-input','statement-carousel','brain-scene','capability-carousel'])check(`INDEX_${key.toUpperCase().replaceAll('-','_')}`,text.index.includes(`compass.${key}.js?v=compass-performance-successor-v1`),key);
for(const key of ['statement-carousel','capability-carousel'])check(`INDEX_${key.toUpperCase().replaceAll('-','_')}_CSS`,text.index.includes(`compass.${key}.css?v=compass-performance-successor-v1`),key);
check('BRAIN_VIEWPORT_SUSPENSION',text.brain.includes('IntersectionObserver')&&text.brain.includes('intersectionRatio'),true);
check('BRAIN_PAGE_SUSPENSION',text.brain.includes('visibilitychange')&&text.brain.includes('document.hidden'),true);
check('BRAIN_FOREGROUND_SUSPENSION',text.brain.includes('foreground()'),true);
check('BRAIN_WEBGL_VOLUME',text.brain.includes("getContext('webgl'")&&text.brain.includes('drawElements')&&text.brain.includes('DEPTH_TEST'),true);
check('STATEMENT_NO_BLUR_FIELD',!text.statementCss.includes('blur(')&&!text.statementCss.includes('will-change'),true);
check('STATEMENT_NO_SPARKLE_NODES',!text.statement.includes('createElement(\'i\')')&&!text.statement.includes('compass-statement-sparkles'),true);
check('HOUSE_PARENT_GUIDANCE',text.capability.includes('swipe to choose Jeeves, Elara, or Auren'),true);
check('HOUSE_NESTED_GUIDANCE',text.capability.includes('Swipe for another House guide. Tap the clear guide to talk.'),true);
check('ATOMIC_POINTER_GEOMETRY',!text.input.includes('style.transform')&&!text.input.includes('translate'),true);
const failures=checks.filter(x=>!x.pass);const receipt={schema:'COMPASS_PERFORMANCE_SUCCESSOR_STATIC_v1',result:failures.length?'FAIL_CLOSED':'PASS_CLOSED',checks,failures:failures.map(x=>x.id)};
console.log(JSON.stringify(receipt,null,2));if(failures.length)process.exit(1);
