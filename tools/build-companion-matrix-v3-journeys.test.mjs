import assert from 'node:assert/strict';import fs from 'node:fs';import * as e from '../assets/build/build-engine.v3.mjs';
const m=JSON.parse(fs.readFileSync(new URL('../assets/build/build-matrix.v3.json',import.meta.url)));
const cases=[
['restaurant',['hospitality_01','rest_intent_01','catering_02','delivery_02'],['ENTRY','HOSPITALITY','REST.INTENT','CATERING','DELIVERY','CATERING_FIELDS']],
['professional',['entry_1','pro_activity_01','pro_intent_01','appointment_01'],['ENTRY','PRO.ACTIVITY','PRO.INTENT','APPOINTMENT','APPT_FIELDS']],
['commerce',['entry_6','shop_intent_01','fulfillment_01','payment_03'],['ENTRY','SHOP.INTENT','FULFILLMENT','PAYMENT']],
['application',['entry_7','app_intent_01','calculator_01','rule_source_01'],['ENTRY','APP.INTENT','CALCULATOR','RULE_SOURCE']],
['spatial',['entry_8','space_intent_04','world_01','visual_assets_03'],['ENTRY','SPACE.INTENT','WORLD','VISUAL_ASSETS']]];
function choose(n,id){return n.options.find(o=>o.id===id)||null;}
for(const [name,ids,expected] of cases){let s=e.initial(),seen=['ENTRY'],n=e.node(m,'ENTRY');let start=ids[0].startsWith('entry_')?ids.shift():({restaurant:'entry_4'}[name]);let o=choose(n,start);let next=e.applyOption(m,s,n,o);seen.push(next);for(const id of ids){n=e.node(m,next);o=choose(n,id);assert.ok(o,name+':'+next+':'+id);next=e.applyOption(m,s,n,o);if(next!=='RETURN'&&next!=='REVIEW')seen.push(next);}assert.deepEqual(seen.slice(0,expected.length),expected,name);assert.ok(s.records.length>=ids.length+1);}
console.log('BUILD_MATRIX_V3_RENDERED_ROUTE_MODEL_PASS');