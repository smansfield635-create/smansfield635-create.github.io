'use strict';

const PHONE=Object.freeze({
  N:{class:'nasal',durationMs:80,features:{voicing:1,nasalPoleHz:300,antiResonanceHz:1450}},
  AE:{class:'vowel',durationMs:120,features:{voicing:1,formant1Hz:660,formant2Hz:1720,formant3Hz:2410}},
  V:{class:'fricative',durationMs:78,features:{noise:1,spectralCenterHz:2500,spectralBandwidthHz:2300}},
  IH:{class:'vowel',durationMs:95,features:{voicing:1,formant1Hz:400,formant2Hz:1990,formant3Hz:2550}},
  G:{class:'stop',durationMs:68,features:{closureFraction:.48,burstCenterHz:2700,burstBandwidthHz:1000}},
  EY:{class:'vowel',durationMs:135,features:{voicing:1,formant1Hz:500,formant2Hz:1900,formant3Hz:2600}},
  SH:{class:'fricative',durationMs:90,features:{noise:1,spectralCenterHz:3600,spectralBandwidthHz:1400}},
  AH:{class:'vowel',durationMs:100,features:{voicing:1,formant1Hz:640,formant2Hz:1190,formant3Hz:2390}},
  R:{class:'approximant',durationMs:78,features:{voicing:1,formant1Hz:400,formant2Hz:1200,formant3Hz:1700}},
  K:{class:'stop',durationMs:66,features:{closureFraction:.50,burstCenterHz:3000,burstBandwidthHz:1100}},
  W:{class:'approximant',durationMs:72,features:{voicing:1,formant1Hz:300,formant2Hz:700,formant3Hz:2200}},
  AY:{class:'vowel',durationMs:135,features:{voicing:1,formant1Hz:650,formant2Hz:1500,formant3Hz:2500}},
  ER:{class:'vowel',durationMs:120,features:{voicing:1,formant1Hz:490,formant2Hz:1350,formant3Hz:1690}},
  Z:{class:'fricative',durationMs:82,features:{noise:1,spectralCenterHz:6500,spectralBandwidthHz:1700}},
  AO:{class:'vowel',durationMs:115,features:{voicing:1,formant1Hz:570,formant2Hz:840,formant3Hz:2410}},
  IY:{class:'vowel',durationMs:115,features:{voicing:1,formant1Hz:270,formant2Hz:2290,formant3Hz:3010}},
  EH:{class:'vowel',durationMs:100,features:{voicing:1,formant1Hz:530,formant2Hz:1840,formant3Hz:2480}},
  T:{class:'stop',durationMs:64,features:{closureFraction:.46,burstCenterHz:4300,burstBandwidthHz:1500}}
});

const WORDS=Object.freeze([
  ['Navigation',['N','AE','V','IH','G','EY','SH','AH','N']],
  ['requires',['R','IH','K','W','AY','ER','Z']],
  ['orientation',['AO','R','IY','EH','N','T','EY','SH','AH','N']]
]);

function realization(){
  const out=[];
  WORDS.forEach(([word,phones],wi)=>{
    for(const phone of phones) out.push(Object.freeze({type:'PHONE',word,phone,durationMs:PHONE[phone].durationMs,features:PHONE[phone].features}));
    if(wi<WORDS.length-1) out.push(Object.freeze({type:'WORD_GAP',durationMs:115}));
  });
  return Object.freeze(out);
}

module.exports=Object.freeze({PHONE,WORDS,realization});
