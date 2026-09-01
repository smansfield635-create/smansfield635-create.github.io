import assert from 'node:assert/strict';
import {initialEntitlementState,serveRequestedState,applyIntervention} from './entitlement-engine.v1.mjs';

function served(state){return serveRequestedState('QUALIFIED',state).served;}
let s=initialEntitlementState();
assert.equal(served(s),'QUALIFIED');

s=applyIntervention(s,'corrupt');
assert.equal(served(s),'HELD');

s=initialEntitlementState();
s=applyIntervention(s,'reprofail');
assert.equal(served(s),'HELD');

s=initialEntitlementState();
s=applyIntervention(s,'adverse');
assert.equal(served(s),'CONTRADICTED');

s=initialEntitlementState();
s=applyIntervention(s,'corrupt');
assert.equal(serveRequestedState('QUALIFIED',s).blocked,true);

s=applyIntervention(s,'repair');
assert.equal(served(s),'SUPPORTED');

s=applyIntervention(s,'fresh');
assert.equal(served(s),'QUALIFIED');

console.log(JSON.stringify({schema:'BT4_ENTITLEMENT_PREVIEW_VERIFICATION_v1',checks:7,passed:7,result:'PASS'},null,2));
