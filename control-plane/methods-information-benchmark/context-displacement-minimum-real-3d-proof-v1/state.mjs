const clone = value => globalThis.structuredClone ? structuredClone(value) : JSON.parse(JSON.stringify(value));
const encoder = new TextEncoder();

function canonical(value) {
  if (Array.isArray(value)) return `[${value.map(canonical).join(',')}]`;
  if (value && typeof value === 'object') return `{${Object.keys(value).sort().map(k => `${JSON.stringify(k)}:${canonical(value[k])}`).join(',')}}`;
  return JSON.stringify(value);
}

async function sha256(value) {
  const bytes = encoder.encode(canonical(value));
  const digest = await crypto.subtle.digest('SHA-256', bytes);
  return [...new Uint8Array(digest)].map(b=>b.toString(16).padStart(2,'0')).join('');
}

export function createState(corpus) {
  return {
    currentStage: 0,
    stagePosition: corpus.stages.map((stage,index)=>({stageId:stage.id,euclideanIndex:index})),
    cameraOrViewTransform: { yaw:0, pitch:-0.08, distance:10.5, target:[-3.8,0,0] },
    modelOrder: corpus.stages.map(stage=>stage.models.map(model=>model.id)),
    activeModelByStage: corpus.stages.map(()=>1),
    focusedModel: null,
    activeLens: 'practical',
    priorSelection: null,
    inputMode: 'pointer',
    returnToken: null,
    contentVersion: corpus.version,
    transition: 'SETTLED',
    corpusId: corpus.corpusId
  };
}

export function snapshot13(state) {
  return {
    currentStage: state.currentStage,
    stagePosition: clone(state.stagePosition),
    cameraOrViewTransform: clone(state.cameraOrViewTransform),
    modelOrder: clone(state.modelOrder),
    activeModelByStage: clone(state.activeModelByStage),
    focusedModel: state.focusedModel,
    activeLens: state.activeLens,
    priorSelection: clone(state.priorSelection),
    inputMode: state.inputMode,
    returnToken: null,
    contentVersion: state.contentVersion,
    transition: 'SETTLED',
    corpusId: state.corpusId
  };
}

export async function createReturnEnvelope(state) {
  const snapshot = snapshot13(state);
  const token = await sha256(snapshot);
  return { snapshot, token };
}

export async function verifyAndRestore(state, envelope) {
  if (!envelope?.snapshot || !envelope?.token) throw new Error('RETURN_ENVELOPE_MISSING');
  const computed = await sha256(envelope.snapshot);
  if (computed !== envelope.token) throw new Error('RETURN_TOKEN_MISMATCH');
  if (envelope.snapshot.contentVersion !== state.contentVersion || envelope.snapshot.corpusId !== state.corpusId) throw new Error('RETURN_CONTENT_VERSION_MISMATCH');
  const restored = clone(envelope.snapshot);
  restored.returnToken = envelope.token;
  restored.priorSelection = { restoredFrom: envelope.token };
  restored.transition = 'SETTLED';
  return restored;
}

export function assertStateContract(state) {
  const fields=['currentStage','stagePosition','cameraOrViewTransform','modelOrder','activeModelByStage','focusedModel','activeLens','priorSelection','inputMode','returnToken','contentVersion','transition','corpusId'];
  const missing=fields.filter(field=>!(field in state));
  if (missing.length) throw new Error(`STATE_CONTRACT_MISSING:${missing.join(',')}`);
  return true;
}
