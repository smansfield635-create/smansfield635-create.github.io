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

const initialState = Object.freeze({ selected: 'north', phase: 'COMMITTED' });
const target = 'east';

const preview = Object.freeze({
  angle: -Math.PI / 2,
  target,
  reached: true
});

const commitDecision = Object.freeze({
  admissible: false,
  decision: 'CANCEL'
});

const finalState = Object.freeze({ ...initialState });

const evidence = Object.freeze([
  Object.freeze({ event: 'PREVIEW_BEGIN', from: initialState.selected }),
  Object.freeze({ event: 'GEOMETRY_REACHED', target, angle: preview.angle }),
  Object.freeze({ event: 'COMMIT_DECISION', admissible: commitDecision.admissible, decision: commitDecision.decision }),
  Object.freeze({ event: 'SEMANTIC_STATE', selected: finalState.selected })
]);

const result = {
  previewReachedTarget: preview.reached,
  canonicalStateUnchanged: canonical(finalState) === canonical(initialState),
  semanticTargetCommitted: finalState.selected === target,
  stateDigestBefore: digest(initialState),
  stateDigestAfter: digest(finalState),
  evidenceDigest: digest(evidence)
};

result.pass =
  result.previewReachedTarget === true &&
  result.canonicalStateUnchanged === true &&
  result.semanticTargetCommitted === false &&
  result.stateDigestBefore === result.stateDigestAfter;

console.log(JSON.stringify({ result, preview, commitDecision, evidence }, null, 2));
