import assert from 'node:assert/strict';

const LEVEL = Object.freeze({ HELD:0, CANDIDATE:1, SUPPORTED:2, QUALIFIED:3, CONTRADICTED:0 });

function deriveEntitlement(input) {
  const reasons = [];
  if (!input.authorityValid) reasons.push('AUTHORITY_INVALID');
  if (!input.provenanceValid) reasons.push('PROVENANCE_INVALID');
  if (!input.evidencePresent) reasons.push('EVIDENCE_MISSING');
  if (!input.reproductionPass) reasons.push('REPRODUCTION_FAILED');
  if (input.adverseEvidence) reasons.push('ADVERSE_EVIDENCE');
  if (reasons.includes('ADVERSE_EVIDENCE')) return {state:'CONTRADICTED', level:0, reasons};
  if (reasons.length) return {state:'HELD', level:0, reasons};
  if (input.qualificationPass && input.qualificationReceiptEpoch >= input.requiredReceiptEpoch) {
    return {state:'QUALIFIED', level:3, reasons:[]};
  }
  return {state:'SUPPORTED', level:2, reasons:['FRESH_QUALIFICATION_REQUIRED']};
}

function renderPublicClaim(entitlement, requestedState) {
  const requestedLevel = LEVEL[requestedState] ?? -1;
  if (requestedLevel > entitlement.level) {
    return {state: entitlement.state, blockedOverride:true, reason:'PRESENTATION_CANNOT_EXCEED_ENTITLEMENT'};
  }
  return {state: requestedState, blockedOverride:false};
}

const baseline = {
  evidencePresent:true,
  reproductionPass:true,
  provenanceValid:true,
  authorityValid:true,
  adverseEvidence:false,
  qualificationPass:true,
  qualificationReceiptEpoch:10,
  requiredReceiptEpoch:10
};

const results = [];
function check(name, fn) { fn(); results.push({name, pass:true}); }

check('baseline qualified', () => {
  const e = deriveEntitlement(baseline);
  assert.equal(e.state,'QUALIFIED');
  assert.equal(renderPublicClaim(e,'QUALIFIED').state,'QUALIFIED');
});

check('A source/provenance mutation forces hold and blocks stale qualified presentation', () => {
  const e = deriveEntitlement({...baseline, provenanceValid:false, requiredReceiptEpoch:11});
  assert.equal(e.state,'HELD');
  const r = renderPublicClaim(e,'QUALIFIED');
  assert.equal(r.state,'HELD');
  assert.equal(r.blockedOverride,true);
});

check('B reproduction failure forces hold', () => {
  const e = deriveEntitlement({...baseline, reproductionPass:false, requiredReceiptEpoch:11});
  assert.equal(e.state,'HELD');
});

check('C adverse evidence forces contradicted', () => {
  const e = deriveEntitlement({...baseline, adverseEvidence:true, requiredReceiptEpoch:11});
  assert.equal(e.state,'CONTRADICTED');
});

check('D presentation drift cannot preserve qualified representation', () => {
  const e = deriveEntitlement({...baseline, provenanceValid:false, requiredReceiptEpoch:11});
  const r = renderPublicClaim(e,'QUALIFIED');
  assert.equal(r.blockedOverride,true);
  assert.equal(r.state,'HELD');
});

check('recovery without fresh receipt cannot requalify', () => {
  const e = deriveEntitlement({...baseline, qualificationReceiptEpoch:10, requiredReceiptEpoch:11});
  assert.equal(e.state,'SUPPORTED');
  const r = renderPublicClaim(e,'QUALIFIED');
  assert.equal(r.state,'SUPPORTED');
  assert.equal(r.blockedOverride,true);
});

check('recovery with fresh admissible qualification restores qualified', () => {
  const e = deriveEntitlement({...baseline, qualificationReceiptEpoch:11, requiredReceiptEpoch:11});
  assert.equal(e.state,'QUALIFIED');
});

console.log(JSON.stringify({schema:'BT4_ENTITLEMENT_HARNESS_RESULT_v1', checks:results.length, passed:results.every(x=>x.pass), results}, null, 2));
