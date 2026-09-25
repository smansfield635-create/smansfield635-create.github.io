const crypto = require('crypto');

function canonical(v) {
  if (v === null || typeof v === 'boolean' || typeof v === 'number' || typeof v === 'string') return JSON.stringify(v);
  if (Array.isArray(v)) return '[' + v.map(canonical).join(',') + ']';
  const keys = Object.keys(v).sort();
  return '{' + keys.map(k => JSON.stringify(k) + ':' + canonical(v[k])).join(',') + '}';
}
function digest(v) { return crypto.createHash('sha256').update(Buffer.from(canonical(v), 'utf8')).digest('hex'); }

const jurisdictions = Object.freeze({
  scanner: new Set(['OBSERVE_BIN_COUNT']),
  inventoryLedger: new Set(['ESTABLISH_BIN_COUNT']),
  shipmentService: new Set(['ESTABLISH_SHIPMENT_STATUS']),
  auditor: new Set(['QUALIFY_CUSTODY'])
});

function apply(history) {
  let state = { binCount: 10, shipmentStatus: 'PENDING' };
  let qualified = true;
  const custody = [];

  for (const e of history) {
    const allowed = jurisdictions[e.actor]?.has(e.claimType) || false;
    if (!allowed) qualified = false;

    if (e.claimType === 'OBSERVE_BIN_COUNT') {
      // observation only; no canonical mutation
    } else if (e.claimType === 'ESTABLISH_BIN_COUNT') {
      state = { ...state, binCount: e.value };
    } else if (e.claimType === 'UNAUTHORIZED_ESTABLISH_BIN_COUNT') {
      state = { ...state, binCount: e.value };
    } else if (e.claimType === 'ESTABLISH_SHIPMENT_STATUS') {
      state = { ...state, shipmentStatus: e.value };
    }

    custody.push({ actor: e.actor, claimType: e.claimType, allowed, value: e.value, stateDigest: digest(state) });
  }

  return { state, stateDigest: digest(state), qualified, custody, custodyDigest: digest(custody) };
}

const lawful = apply([
  { actor: 'scanner', claimType: 'OBSERVE_BIN_COUNT', value: 7 },
  { actor: 'inventoryLedger', claimType: 'ESTABLISH_BIN_COUNT', value: 7 },
  { actor: 'shipmentService', claimType: 'ESTABLISH_SHIPMENT_STATUS', value: 'READY' }
]);

const adversarial = apply([
  { actor: 'scanner', claimType: 'OBSERVE_BIN_COUNT', value: 7 },
  { actor: 'scanner', claimType: 'UNAUTHORIZED_ESTABLISH_BIN_COUNT', value: 7 },
  { actor: 'inventoryLedger', claimType: 'ESTABLISH_BIN_COUNT', value: 7 },
  { actor: 'shipmentService', claimType: 'ESTABLISH_SHIPMENT_STATUS', value: 'READY' }
]);

const result = {
  lawChangedForImplementationC: false,
  domain: 'warehouse_inventory_custody',
  terminalStateEqual: canonical(lawful.state) === canonical(adversarial.state),
  terminalDigestEqual: lawful.stateDigest === adversarial.stateDigest,
  lawfulQualified: lawful.qualified,
  adversarialQualified: adversarial.qualified,
  custodyDigestEqual: lawful.custodyDigest === adversarial.custodyDigest,
  crossLineageGeneralityPass:
    canonical(lawful.state) === canonical(adversarial.state) &&
    lawful.qualified === true &&
    adversarial.qualified === false &&
    lawful.custodyDigest !== adversarial.custodyDigest,
  lawful,
  adversarial
};

console.log(JSON.stringify(result, null, 2));
