const crypto = require('crypto');

function canonical(v) {
  if (v === null || typeof v === 'boolean' || typeof v === 'number' || typeof v === 'string') return JSON.stringify(v);
  if (Array.isArray(v)) return '[' + v.map(canonical).join(',') + ']';
  const keys = Object.keys(v).sort();
  return '{' + keys.map((k) => JSON.stringify(k) + ':' + canonical(v[k])).join(',') + '}';
}

function digest(v) {
  return crypto.createHash('sha256').update(Buffer.from(canonical(v), 'utf8')).digest('hex');
}

const authorities = Object.freeze({
  controller: new Set(['SET_MODE', 'SET_VALUE']),
  renderer: new Set([]),
  verifier: new Set(['QUALIFY'])
});

function run(history) {
  let state = { mode: 'IDLE', value: 0 };
  const custody = [];
  let qualified = true;

  for (const event of history) {
    const allowed = authorities[event.actor]?.has(event.claim) || false;
    if (!allowed) qualified = false;

    if (event.claim === 'SET_MODE') state = { ...state, mode: event.payload };
    if (event.claim === 'SET_VALUE') state = { ...state, value: event.payload };
    if (event.claim === 'RENDERER_WRITE_VALUE') state = { ...state, value: event.payload };

    custody.push({
      actor: event.actor,
      claim: event.claim,
      allowed,
      stateDigest: digest(state)
    });
  }

  return {
    state,
    stateDigest: digest(state),
    qualified,
    custodyDigest: digest(custody),
    custody
  };
}

const lawfulHistory = [
  { actor: 'controller', claim: 'SET_MODE', payload: 'ACTIVE' },
  { actor: 'controller', claim: 'SET_VALUE', payload: 7 }
];

const unauthorizedHistory = [
  { actor: 'controller', claim: 'SET_MODE', payload: 'ACTIVE' },
  { actor: 'renderer', claim: 'RENDERER_WRITE_VALUE', payload: 7 },
  { actor: 'controller', claim: 'SET_VALUE', payload: 7 }
];

const lawful = run(lawfulHistory);
const unauthorized = run(unauthorizedHistory);

const result = {
  terminalStateEqual: canonical(lawful.state) === canonical(unauthorized.state),
  terminalDigestEqual: lawful.stateDigest === unauthorized.stateDigest,
  lawfulQualified: lawful.qualified,
  unauthorizedQualified: unauthorized.qualified,
  custodyDigestEqual: lawful.custodyDigest === unauthorized.custodyDigest,
  pass:
    canonical(lawful.state) === canonical(unauthorized.state) &&
    lawful.qualified === true &&
    unauthorized.qualified === false &&
    lawful.custodyDigest !== unauthorized.custodyDigest,
  lawful,
  unauthorized
};

console.log(JSON.stringify(result, null, 2));
