#!/usr/bin/env node
import fs from 'node:fs';
const path=process.argv[2]; if(!path) throw new Error('MISSING_MAP_PATH');
const m=JSON.parse(fs.readFileSync(path,'utf8'));
if(m.schema!=='COMPASS_SHOT_RECOMPOSITION_MAP_v1') throw new Error('SCHEMA_MISMATCH');
const allowed=new Set(['REFRAME','PAN_SCAN','COMPOSITE']);
const ids=Array.from({length:12},(_,i)=>`S${String(i+1).padStart(2,'0')}`);
if(m.shots.length!==12) throw new Error('SHOT_COUNT_MISMATCH');
for(const id of ids){const s=m.shots.find(x=>x.id===id);if(!s)throw new Error(`MISSING_SHOT:${id}`);if(!allowed.has(s.treatment))throw new Error(`INVALID_TREATMENT:${id}`);for(const k of ['editorialBeat','sourceRange','focal','motion','acceptance'])if(!s[k])throw new Error(`MISSING_${k.toUpperCase()}:${id}`);if(!Array.isArray(s.preserve)||s.preserve.length<1)throw new Error(`MISSING_PRESERVE:${id}`);if(!Array.isArray(s.exclude)||s.exclude.length<1)throw new Error(`MISSING_EXCLUDE:${id}`);}
if(m.shots.some(s=>s.treatment==='FIT_WHOLE_PHONE_IN_BLACK_FIELD'))throw new Error('PROHIBITED_PHONE_FIT');
if(!m.globalRules?.openingDarkCanvasBeforeS01)throw new Error('OPENING_CANVAS_LAW_MISSING');
console.log(JSON.stringify({schema:'COMPASS_RECOMPOSITION_MAP_QUALIFICATION_RECEIPT_v1',result:'PASS_CLOSED',shotCount:12,allShotsMapped:true,allTreatmentsLawful:true,openingCanvasLaw:true,phoneFitProhibited:true}));
