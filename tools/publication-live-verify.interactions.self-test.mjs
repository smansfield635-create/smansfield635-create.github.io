import fs from 'node:fs';
import assert from 'node:assert/strict';
import {validateDeclaredInteractions,runDeclaredInteractions} from './publication-live-verify.mjs';

const validClick=[{
  name:'click changes state',
  action:{type:'click',selector:'#next'},
  assertions:[{type:'attributeEquals',selector:'#state',name:'data-active',value:'true'}]
}];
const validKey=[{
  name:'keyboard changes state',
  action:{type:'key',selector:'#root',key:'ArrowRight'},
  assertions:[{type:'textContains',selector:'#state',value:'ready'}]
}];

assert.equal(validateDeclaredInteractions(undefined).length,0);
assert.equal(validateDeclaredInteractions(validClick).length,1);
assert.equal(validateDeclaredInteractions(validKey).length,1);

assert.throws(
  ()=>validateDeclaredInteractions([{name:'bad',action:{type:'hover',selector:'#x'},assertions:[{type:'exists',selector:'#x'}]}]),
  /unsupported type/
);
assert.throws(
  ()=>validateDeclaredInteractions([{name:'script',action:{type:'script',selector:'#x',code:'alert(1)'},assertions:[{type:'exists',selector:'#x'}]}]),
  /unsupported type/
);
assert.throws(
  ()=>validateDeclaredInteractions([{name:'extra',action:{type:'click',selector:'#x',eval:'1+1'},assertions:[{type:'exists',selector:'#x'}]}]),
  /unsupported field/
);

const makePage=({assertionPass=true}={})=>{
  const calls=[];
  return {
    calls,
    keyboard:{press:async key=>calls.push(['key',key])},
    waitForSelector:async selector=>calls.push(['wait',selector]),
    click:async selector=>calls.push(['click',selector]),
    focus:async selector=>calls.push(['focus',selector]),
    waitForFunction:async()=>{calls.push(['assert']);if(!assertionPass)throw new Error('assertion failed');}
  };
};

const clickPage=makePage();
const clickResult=await runDeclaredInteractions(clickPage,validClick);
assert.equal(clickResult[0].ok,true);
assert.deepEqual(clickPage.calls.slice(0,2),[['wait','#next'],['click','#next']]);

const keyPage=makePage();
const keyResult=await runDeclaredInteractions(keyPage,validKey);
assert.equal(keyResult[0].ok,true);
assert.deepEqual(keyPage.calls.slice(0,3),[['wait','#root'],['focus','#root'],['key','ArrowRight']]);

const failingPage=makePage({assertionPass:false});
const failingResult=await runDeclaredInteractions(failingPage,validClick);
assert.equal(failingResult[0].ok,false);
assert.match(failingResult[0].error,/assertion failed/);

const verifierSource=fs.readFileSync(new URL('./publication-live-verify.mjs',import.meta.url),'utf8');
assert.match(verifierSource,/requireEvidenceCarouselInteraction/);
assert.match(verifierSource,/verifyEvidenceCarousel/);
assert.match(verifierSource,/EVIDENCE_CAROUSEL_INTERACTION_FAILED/);

console.log(JSON.stringify({
  schema:'PUBLICATION_INTERACTION_VERIFIER_SELF_TEST_v1',
  result:'PASS',
  checks:[
    'VALID_CLICK_PASS',
    'VALID_KEY_PASS',
    'FAILED_ASSERTION_FAIL_CLOSED',
    'UNSUPPORTED_ACTION_REJECTED',
    'EXECUTABLE_ACTION_REJECTED',
    'LEGACY_NO_INTERACTIONS_ACCEPTED',
    'EVIDENCE_INTERACTION_COMPATIBILITY_PRESERVED'
  ]
},null,2));
