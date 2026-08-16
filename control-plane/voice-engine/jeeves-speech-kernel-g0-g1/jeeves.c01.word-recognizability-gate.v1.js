'use strict';
const R=require('./jeeves.c01.acoustic-separability-renderer.v1.js');
const P=require('./jeeves.c01.realization-plan.v1.js');

function phoneVector(seg,audio){
  const f=R.featureVector(audio,seg.startSample,seg.endSample);
  const spec=P.PHONE[seg.phone];
  const cls=spec.class;
  let anchorA=0,anchorB=0,anchorC=0;
  if(cls==='vowel'||cls==='approximant'){
    anchorA=spec.features.formant1Hz||0;anchorB=spec.features.formant2Hz||0;anchorC=spec.features.formant3Hz||0;
  }else if(cls==='fricative'){
    anchorA=spec.features.spectralCenterHz||0;anchorB=spec.features.spectralBandwidthHz||0;
  }else if(cls==='stop'){
    anchorA=spec.features.burstCenterHz||0;anchorB=spec.features.burstBandwidthHz||0;anchorC=spec.features.closureFraction||0;
  }else if(cls==='nasal'){
    anchorA=spec.features.nasalPoleHz||0;anchorB=spec.features.antiResonanceHz||0;
  }
  return {phone:seg.phone,class:cls,durationMs:seg.durationMs,rms:f.rms,zcr:f.zcr,hfRatio:f.hfRatio,anchorA,anchorB,anchorC};
}
function wordVectors(){
  const x=R.render();
  const byWord=new Map();
  for(const seg of x.segments){
    if(seg.type!=='PHONE') continue;
    if(!byWord.has(seg.word)) byWord.set(seg.word,[]);
    byWord.get(seg.word).push(phoneVector(seg,x.audio));
  }
  return {render:x,words:Object.fromEntries(byWord)};
}
function dist(a,b){
  const n=Math.max(a.length,b.length);let s=0;
  for(let i=0;i<n;i++){
    const A=a[i]||{},B=b[i]||{};
    const cls=A.class===B.class?0:2;
    const pd=A.phone===B.phone?0:1.5;
    const dur=Math.abs((A.durationMs||0)-(B.durationMs||0))/120;
    const z=Math.abs((A.zcr||0)-(B.zcr||0))*4;
    const h=Math.abs((A.hfRatio||0)-(B.hfRatio||0));
    const aa=Math.abs((A.anchorA||0)-(B.anchorA||0))/4000;
    const ab=Math.abs((A.anchorB||0)-(B.anchorB||0))/4000;
    s+=cls+pd+dur+z+h+aa+ab;
  }
  return s/n;
}
function evaluate(){
  const {render,words}=wordVectors();
  const expected=P.WORDS.map(([word,phones])=>({word,phones,vector:words[word]}));
  const scores={};
  for(const e of expected){
    scores[e.word]={};
    for(const c of expected) scores[e.word][c.word]=dist(e.vector,c.vector);
  }
  const selfZero=expected.every(e=>scores[e.word][e.word]===0);
  const mismatchPositive=expected.every(e=>expected.filter(c=>c.word!==e.word).every(c=>scores[e.word][c.word]>1));
  const uniquePhoneSequences=new Set(expected.map(e=>e.phones.join('-'))).size===expected.length;
  const gapSegments=render.segments.filter(s=>s.type==='WORD_GAP');
  const gapsValid=gapSegments.length===2&&gapSegments.every(g=>g.durationMs>=100&&R.featureVector(render.audio,g.startSample,g.endSample).rms===0);
  return Object.freeze({pass:selfZero&&mismatchPositive&&uniquePhoneSequences&&gapsValid,selfZero,mismatchPositive,uniquePhoneSequences,gapsValid,scores,wordPhoneCounts:Object.fromEntries(expected.map(e=>[e.word,e.phones.length]))});
}
module.exports=Object.freeze({wordVectors,dist,evaluate});
