'use strict';
const V1=require('./jeeves.c01.realization-plan.v1.js');
const PHONE=Object.freeze(Object.fromEntries(Object.entries(V1.PHONE).map(([k,v])=>[k,Object.freeze({...v,features:Object.freeze({...v.features,...(['V','G','Z'].includes(k)?{voicing:1}:{})})})])));
const WORDS=V1.WORDS;
function realization(){const out=[];WORDS.forEach(([word,phones],wi)=>{for(const phone of phones)out.push(Object.freeze({type:'PHONE',word,phone,durationMs:PHONE[phone].durationMs,features:PHONE[phone].features}));if(wi<WORDS.length-1)out.push(Object.freeze({type:'WORD_GAP',durationMs:115}));});return Object.freeze(out);}
module.exports=Object.freeze({PHONE,WORDS,realization});
