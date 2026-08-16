'use strict';

const SENTENCE=Object.freeze([
  {word:'Navigation',phones:['N','AE','V','IH','G','EY','SH','AH','N']},
  {word:'requires',phones:['R','IH','K','W','AY','ER','Z']},
  {word:'orientation',phones:['AO','R','IY','EH','N','T','EY','SH','AH','N']}
]);

const CLASS=Object.freeze({
  N:'nasal',AE:'vowel',V:'fricative',IH:'vowel',G:'stop',EY:'vowel',SH:'fricative',AH:'vowel',
  R:'approximant',K:'stop',W:'approximant',AY:'vowel',ER:'vowel',Z:'fricative',AO:'vowel',IY:'vowel',EH:'vowel',T:'stop'
});

const REQUIRED_CLASS_FEATURES=Object.freeze({
  vowel:['voicing','formant1Hz','formant2Hz','formant3Hz'],
  nasal:['voicing','nasalPoleHz','antiResonanceHz'],
  fricative:['noise','spectralCenterHz','spectralBandwidthHz'],
  stop:['closureFraction','burstCenterHz','burstBandwidthHz'],
  approximant:['voicing','formant1Hz','formant2Hz','formant3Hz']
});

function canonicalPhoneSequence(){return SENTENCE.flatMap((w,wi)=>[
  ...w.phones.map(phone=>({type:'PHONE',word:w.word,phone,class:CLASS[phone]})),
  ...(wi<SENTENCE.length-1?[{type:'WORD_GAP',durationMs:115}]:[])
]);}

function validateRealization(realization){
  const expected=canonicalPhoneSequence();
  if(!Array.isArray(realization)) return {result:'FAIL_REALIZATION_REQUIRED'};
  if(realization.length!==expected.length) return {result:'FAIL_SEQUENCE_LENGTH',expected:expected.length,observed:realization.length};
  const failures=[];
  const signatures=new Map();
  for(let i=0;i<expected.length;i++){
    const e=expected[i],r=realization[i];
    if(e.type==='WORD_GAP'){
      if(r?.type!=='WORD_GAP'||!Number.isFinite(r.durationMs)||r.durationMs<90) failures.push({i,reason:'WORD_GAP_NOT_PRESERVED'});
      continue;
    }
    if(r?.type!=='PHONE'||r.phone!==e.phone||r.word!==e.word) failures.push({i,reason:'PHONE_OR_WORD_IDENTITY_MISMATCH',expected:e,observed:r});
    if(!Number.isFinite(r?.durationMs)||r.durationMs<35) failures.push({i,reason:'PHONE_DURATION_INVALID'});
    const f=r?.features||{};
    for(const key of REQUIRED_CLASS_FEATURES[e.class]||[]) if(!Number.isFinite(f[key])) failures.push({i,reason:`MISSING_${e.class}_${key}`});
    const signature=JSON.stringify([e.class,...Object.entries(f).filter(([k])=>k!=='voicing').sort((a,b)=>a[0].localeCompare(b[0])).map(([,v])=>Math.round(v))]);
    if(!signatures.has(e.class)) signatures.set(e.class,new Set());
    signatures.get(e.class).add(signature);
  }
  const classDiversity={};
  for(const [k,v] of signatures) classDiversity[k]=v.size;
  if((classDiversity.vowel||0)<6) failures.push({reason:'VOWEL_INVENTORY_COLLAPSE',distinct:classDiversity.vowel||0});
  if((classDiversity.fricative||0)<3) failures.push({reason:'FRICATIVE_INVENTORY_COLLAPSE',distinct:classDiversity.fricative||0});
  if((classDiversity.stop||0)<3) failures.push({reason:'STOP_INVENTORY_COLLAPSE',distinct:classDiversity.stop||0});
  return failures.length?{result:'FAIL_INTERNAL_INTELLIGIBILITY_THRESHOLD',failures,classDiversity}:{result:'PASS_INTERNAL_INTELLIGIBILITY_THRESHOLD',classDiversity};
}

module.exports=Object.freeze({SENTENCE,CLASS,REQUIRED_CLASS_FEATURES,canonicalPhoneSequence,validateRealization});
