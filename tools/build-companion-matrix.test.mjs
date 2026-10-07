import assert from 'node:assert/strict';import fs from 'node:fs';import {activeNodes,pruneAnswers,pruneDone,synthesizeBrief,emailDraft} from '../assets/build/build-engine.mjs';
const m=JSON.parse(fs.readFileSync(new URL('../assets/build/build-matrix.v2.json',import.meta.url)));
assert.equal(m.schema,'BUILD_COMPANION_MATRIX_v2');assert.ok(m.nodes.every(n=>n.id&&n.prompt&&n.record&&n.synthesis));
const ids=a=>activeNodes(m,a).map(n=>n.id);
// 1 professional practice: category must not manufacture office/hours/booking.
let a={type:'Professional practice',context:'Consulting practice',audience:'Business clients',outcome:'Establish expertise and collect qualified inquiries',content:'Three services and case studies'};
assert.ok(!ids(a).some(x=>/office|hours|booking|availability/i.test(x)));assert.match(synthesizeBrief(m,a),/Consulting practice/);
// 2 restaurant: menu+catering scopes website intake, never places an order.
a={type:'Restaurant / hospitality',restaurantNeeds:['Show the menu','Accept catering inquiries']};assert.ok(ids(a).includes('restaurantCatering'));assert.ok(!ids(a).some(x=>/order|food|guestCount|budget/i.test(x)));
// 3 commerce: informational catalog never asks fulfillment; transaction may.
assert.ok(!ids({type:'Commerce',commerceMode:'Present the catalog only'}).includes('fulfillment'));assert.ok(ids({type:'Commerce',commerceMode:'Complete purchases on the site'}).includes('fulfillment'));
// 4 app: workflow + I/O represented; accounts explicitly asked, not presumed.
a={type:'Interactive application'};assert.ok(ids(a).includes('appWorkflow')&&ids(a).includes('appIO')&&ids(a).includes('accounts'));
// 5 3D: spatial questions, no generic service actions.
a={type:'3D / spatial experience'};assert.ok(ids(a).includes('spatialWorld')&&ids(a).includes('spatialInteraction')&&ids(a).includes('spatialDevices'));assert.ok(!ids(a).includes('restaurantNeeds'));
// 6 rebuild: URL/strengths/problems are branch-specific discovery.
a={type:'Existing site rebuild'};const rebuild=ids(a);assert.ok(rebuild.indexOf('rebuildUrl')<rebuild.indexOf('rebuildWorks')&&rebuild.indexOf('rebuildWorks')<rebuild.indexOf('rebuildFails'));
// 7 help-me-decide accepts plain language before web terminology.
assert.ok(ids({type:'Help me decide'}).includes('decidePlain'));
// 8 upstream edit prunes invalid descendants, preserves shared facts.
a={type:'Commerce',audience:'Collectors',commerceMode:'Complete purchases on the site',fulfillment:'Ship',experience:['Warm']};a.commerceMode='Present the catalog only';const p=pruneAnswers(m,a);assert.equal(p.fulfillment,undefined);assert.equal(p.audience,'Collectors');assert.deepEqual(p.experience,['Warm']);
// 9 branch-specific facts isolate when type changes.
a=pruneAnswers(m,{type:'Restaurant / hospitality',restaurantNeeds:['Show the menu'],audience:'Local guests'});a.type='Professional practice';const q=pruneAnswers(m,a);assert.equal(q.restaurantNeeds,undefined);assert.equal(q.audience,'Local guests');
// 10 semantic prose sections + open questions, no raw implementation dump.
a={type:'Professional practice',context:'Consulting practice',audience:'Business clients',outcome:'Explain services',name:'A',email:'a@example.com'};const brief=synthesizeBrief(m,a);assert.match(brief,/Project\n/);assert.match(brief,/Audience\n/);assert.match(brief,/Website objective\n/);assert.match(brief,/Open questions\n/);assert.ok(!brief.includes('project.context'));assert.match(emailDraft(m,a),/Hello Sean/);
// pruning done mirrors active graph.
assert.ok(!pruneDone(m,{type:'Commerce',commerceMode:'Present the catalog only'},['type','commerceMode','fulfillment']).includes('fulfillment'));
console.log('BUILD_COMPANION_MATRIX_V2_PASS');
