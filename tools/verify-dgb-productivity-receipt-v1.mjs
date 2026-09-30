#!/usr/bin/env node
import fs from 'node:fs';
const p=process.argv[2]; if(!p)throw new Error('receipt path required');
const r=JSON.parse(fs.readFileSync(p,'utf8'));
const req=['schema','periodStart','periodEnd','measuredHead','commitCount','meaningfulActivityCount','productSignals','qualificationSignals','repairSignals','governanceSignals','publicationClosureSignals','limitations','disposition'];
for(const k of req)if(!(k in r))throw new Error('missing '+k);
if(r.schema!=='DGB_PRODUCTIVITY_RECEIPT_v1')throw new Error('schema');
if(!['PASS_MEASURED','PASS_MEASURED_WITH_LIMITATIONS','FAIL_INCOMPLETE_EVIDENCE'].includes(r.disposition))throw new Error('disposition');
for(const k of ['commitCount','meaningfulActivityCount','productSignals','qualificationSignals','repairSignals','governanceSignals','publicationClosureSignals'])if(!Number.isInteger(r[k])||r[k]<0)throw new Error(k);
for(const k of ['productShare','qualificationDensity','repairBurden','governanceCost'])if(r[k]!==null&&(typeof r[k]!=='number'||r[k]<0||r[k]>1))throw new Error(k);
console.log('PASS_PRODUCTIVITY_RECEIPT_V1_SCHEMA');

if('humanLeverageEvidence' in r){const h=r.humanLeverageEvidence;if(!h||!['UNKNOWN','OBSERVED'].includes(h.status))throw new Error('humanLeverageEvidence.status');if(h.status==='UNKNOWN'&&h.substantiveHumanInterventions!==null)throw new Error('humanLeverageEvidence unknown count');if(h.status==='OBSERVED'&&(!Number.isInteger(h.substantiveHumanInterventions)||h.substantiveHumanInterventions<0))throw new Error('humanLeverageEvidence observed count');for(const k of ['meaningfulActivitiesPerIntervention','publicationClosuresPerIntervention'])if(h[k]!==null&&(typeof h[k]!=='number'||h[k]<0))throw new Error('humanLeverageEvidence '+k);}
