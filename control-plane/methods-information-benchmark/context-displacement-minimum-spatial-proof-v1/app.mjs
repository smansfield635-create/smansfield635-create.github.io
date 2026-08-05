import { CONTENT_VERSION, LENSES, STAGES } from './data.mjs';

const world = document.querySelector('#world');
const spatialView = document.querySelector('#spatial-view');
const linearView = document.querySelector('#linear-view');
const linearContent = document.querySelector('#linear-content');
const lensButtons = document.querySelector('#lens-buttons');
const statusText = document.querySelector('#status-text');
const proofStatus = document.querySelector('#proof-status');
const stateOutput = document.querySelector('#state-output');
const announcement = document.querySelector('#announcement');

const TRANSITION_MS = {
  stage: 900,
  model: 620,
  focus: 700,
  lens: 420,
  return: 700
};

let returnSequence = 0;
let settleTimer = 0;
let touchStart = null;

const state = {
  currentStage: 0,
  stagePosition: STAGES.map((stage, index) => ({ stageId: stage.id, euclideanIndex: index })),
  cameraOrViewTransform: 'stage:0|depth:0|yaw:0',
  modelOrder: STAGES.map((stage) => stage.models.map((model) => model.id)),
  activeModelByStage: STAGES.map(() => 0),
  focusedModel: null,
  activeLens: 'practical',
  priorSelection: null,
  inputMode: 'pointer',
  returnToken: null,
  contentVersion: CONTENT_VERSION,
  transition: 'SETTLED'
};

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function getStage() {
  return STAGES[state.currentStage];
}

function getActiveModelIndex(stageIndex = state.currentStage) {
  return state.activeModelByStage[stageIndex];
}

function getActiveModel() {
  return getStage().models[getActiveModelIndex()];
}

function normalizeIndex(index, length) {
  return (index + length) % length;
}

function createReturnToken(snapshot) {
  return `RETURN-${CONTENT_VERSION}-${String(++returnSequence).padStart(4, '0')}-${snapshot.currentStage}-${snapshot.activeModelByStage[snapshot.currentStage]}-${snapshot.activeLens}`;
}

function setTransition(kind, detail) {
  window.clearTimeout(settleTimer);
  state.transition = kind;
  proofStatus.classList.add('is-moving');
  statusText.textContent = detail;
  updateStatePanel();
}

function settle(detail = 'Spatial state settled', delay = 0) {
  window.clearTimeout(settleTimer);
  settleTimer = window.setTimeout(() => {
    state.transition = 'SETTLED';
    proofStatus.classList.remove('is-moving');
    statusText.textContent = detail;
    updateStatePanel();
  }, delay);
}

function setInputMode(mode) {
  state.inputMode = mode;
}

function announce(message) {
  announcement.textContent = '';
  window.requestAnimationFrame(() => {
    announcement.textContent = message;
  });
}

function renderWorld() {
  world.replaceChildren(...STAGES.map((stage, stageIndex) => createStageElement(stage, stageIndex)));
  renderLensButtons();
  renderLinearView();
  updateView();
}

function createStageElement(stage, stageIndex) {
  const section = document.createElement('section');
  section.className = 'stage';
  section.dataset.stageIndex = String(stageIndex);
  section.dataset.accent = stage.accent;
  section.setAttribute('aria-label', `Stage ${stage.ordinal}: ${stage.title}`);

  const shell = document.createElement('div');
  shell.className = 'stage-shell';

  const heading = document.createElement('header');
  heading.className = 'stage-heading';
  heading.innerHTML = `
    <div>
      <span class="stage-number">Stage ${String(stage.ordinal).padStart(2, '0')} · ${stage.kicker}</span>
      <h2>${stage.title}</h2>
      <p>${stage.description}</p>
    </div>
    <span class="stage-distance-label">${stageIndex === state.currentStage ? 'Current stage' : 'Visible destination'}</span>
  `;

  const field = document.createElement('div');
  field.className = 'model-field';
  field.append(...stage.models.map((model, modelIndex) => createModelElement(stageIndex, model, modelIndex)));

  const hit = document.createElement('button');
  hit.type = 'button';
  hit.className = 'distant-stage-hit';
  hit.textContent = `Travel to ${stage.title}`;
  hit.addEventListener('click', () => {
    setInputMode('pointer');
    travelToStage(stageIndex);
  });

  shell.append(heading, field, hit);
  section.append(shell);
  return section;
}

function createModelElement(stageIndex, model, modelIndex) {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'model-object';
  button.dataset.stageIndex = String(stageIndex);
  button.dataset.modelIndex = String(modelIndex);
  button.dataset.modelId = model.id;
  button.setAttribute('aria-label', `${model.title}. ${model.notation}. Select to focus.`);
  button.addEventListener('click', (event) => {
    event.stopPropagation();
    setInputMode('pointer');
    if (stageIndex !== state.currentStage) {
      travelToStage(stageIndex, modelIndex);
      return;
    }
    if (state.focusedModel === model.id) {
      returnFromFocus();
      return;
    }
    if (getActiveModelIndex() !== modelIndex) {
      moveToModel(modelIndex);
      return;
    }
    focusActiveModel();
  });

  button.innerHTML = modelMarkup(model, state.activeLens, false);
  return button;
}

function modelMarkup(model, lensId, focused) {
  const lens = model.lenses[lensId];
  return `
    <span class="model-topline">
      <span>${model.relationship}</span>
      <span class="source-badge">${model.sourceState}</span>
    </span>
    <h3>${model.title}</h3>
    <p class="notation">${model.notation}</p>
    <p class="relationship">Object identity: ${model.id}</p>
    <div class="expression" data-expression>
      <p class="expression-eyebrow">${lens.eyebrow}</p>
      <h4>${lens.title}</h4>
      <p class="expression-body">${lens.body}</p>
      ${lens.callout ? `<p class="expression-callout">${lens.callout}</p>` : ''}
      <p class="expression-footer">${lens.footer}</p>
    </div>
    <span class="focus-cue">${focused ? '' : 'Select centered object to pull it forward'}</span>
    <span class="return-button">Return to exact prior state</span>
  `;
}

function renderLensButtons() {
  lensButtons.replaceChildren(...LENSES.map((lens, index) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'lens-button';
    button.dataset.lens = lens.id;
    button.setAttribute('aria-pressed', String(state.activeLens === lens.id));
    button.textContent = `${index + 1} ${lens.short}`;
    button.title = lens.label;
    button.addEventListener('click', () => {
      setInputMode('pointer');
      changeLens(lens.id);
    });
    return button;
  }));
}

function updateView() {
  const currentStage = getStage();
  const activeModelIndex = getActiveModelIndex();
  const activeModel = getActiveModel();

  document.querySelectorAll('.stage').forEach((stageElement) => {
    const index = Number(stageElement.dataset.stageIndex);
    const relative = index - state.currentStage;
    stageElement.classList.toggle('is-current', relative === 0);
    stageElement.classList.toggle('is-distant-right', relative > 0);
    stageElement.classList.toggle('is-distant-left', relative < 0);
    stageElement.classList.toggle('is-focused', relative === 0 && Boolean(state.focusedModel));
    stageElement.querySelector('.stage-distance-label').textContent = relative === 0 ? 'Current stage' : 'Visible destination';
    stageElement.setAttribute('aria-hidden', String(Math.abs(relative) > 1));

    stageElement.querySelectorAll('.model-object').forEach((modelElement) => {
      const modelIndex = Number(modelElement.dataset.modelIndex);
      const model = STAGES[index].models[modelIndex];
      let slot = modelIndex - state.activeModelByStage[index];
      if (slot > 1) slot -= STAGES[index].models.length;
      if (slot < -1) slot += STAGES[index].models.length;
      modelElement.style.setProperty('--slot', String(slot));
      modelElement.style.setProperty('--slot-abs', String(Math.abs(slot)));
      const isActive = index === state.currentStage && modelIndex === activeModelIndex;
      const isFocused = isActive && state.focusedModel === model.id;
      modelElement.classList.toggle('is-active', isActive);
      modelElement.classList.toggle('is-focused', isFocused);
      modelElement.setAttribute('aria-current', isActive ? 'true' : 'false');
      modelElement.tabIndex = index === state.currentStage && modelIndex === activeModelIndex ? 0 : -1;
      modelElement.innerHTML = modelMarkup(model, state.activeLens, isFocused);
    });
  });

  document.querySelector('#current-stage-label').textContent = currentStage.title;
  document.querySelector('#stage-ordinal').textContent = `Stage ${String(currentStage.ordinal).padStart(2, '0')}`;
  document.querySelector('#stage-title').textContent = currentStage.title;
  document.querySelector('#stage-kicker').textContent = currentStage.kicker;
  document.querySelector('#model-position').textContent = `Object ${activeModelIndex + 1} of ${currentStage.models.length}`;

  const destinationIndex = state.currentStage === 0 ? 1 : 0;
  const destination = STAGES[destinationIndex];
  const travelButton = document.querySelector('#travel-button');
  travelButton.textContent = state.currentStage === 0 ? `Travel to ${destination.title} →` : `← Travel to ${destination.title}`;
  travelButton.onclick = () => travelToStage(destinationIndex);

  document.querySelectorAll('[data-route-stage]').forEach((node) => {
    node.classList.toggle('is-current', Number(node.dataset.routeStage) === state.currentStage);
  });

  document.querySelector('#previous-stage').disabled = STAGES.length < 2 || Boolean(state.focusedModel);
  document.querySelector('#next-stage').disabled = STAGES.length < 2 || Boolean(state.focusedModel);
  document.querySelector('#previous-model').disabled = Boolean(state.focusedModel);
  document.querySelector('#next-model').disabled = Boolean(state.focusedModel);

  state.cameraOrViewTransform = `stage:${state.currentStage}|depth:${state.focusedModel ? 180 : 0}|yaw:0|model:${activeModel.id}`;

  document.querySelectorAll('.lens-button').forEach((button) => {
    button.setAttribute('aria-pressed', String(button.dataset.lens === state.activeLens));
  });

  updateStatePanel();
}

function snapshotForReturn() {
  return {
    currentStage: state.currentStage,
    stagePosition: clone(state.stagePosition),
    cameraOrViewTransform: state.cameraOrViewTransform,
    modelOrder: clone(state.modelOrder),
    activeModelByStage: clone(state.activeModelByStage),
    focusedModel: null,
    activeLens: state.activeLens,
    priorSelection: clone(state.priorSelection),
    inputMode: state.inputMode,
    contentVersion: state.contentVersion
  };
}

function travelToStage(stageIndex, preferredModelIndex = null) {
  if (state.focusedModel || stageIndex === state.currentStage) return;
  const destination = normalizeIndex(stageIndex, STAGES.length);
  setTransition('INTER_STAGE_TRANSITION', `Travelling to ${STAGES[destination].title}`);
  state.priorSelection = {
    kind: 'stage',
    stage: state.currentStage,
    model: getActiveModel().id,
    lens: state.activeLens
  };
  state.currentStage = destination;
  if (Number.isInteger(preferredModelIndex)) {
    state.activeModelByStage[destination] = normalizeIndex(preferredModelIndex, STAGES[destination].models.length);
  }
  state.focusedModel = null;
  state.returnToken = null;
  updateView();
  announce(`Entered stage ${STAGES[destination].title}. Active object ${getActiveModel().title}.`);
  settle(`Arrived at ${STAGES[destination].title}`, TRANSITION_MS.stage);
}

function moveStage(delta) {
  travelToStage(state.currentStage + delta);
}

function moveToModel(modelIndex) {
  if (state.focusedModel) return;
  const stage = getStage();
  const destination = normalizeIndex(modelIndex, stage.models.length);
  if (destination === getActiveModelIndex()) return;
  setTransition('INTRA_STAGE_TRANSITION', `Repositioning ${stage.models[destination].title}`);
  state.priorSelection = {
    kind: 'model',
    stage: state.currentStage,
    model: getActiveModel().id,
    lens: state.activeLens
  };
  state.activeModelByStage[state.currentStage] = destination;
  state.returnToken = null;
  updateView();
  announce(`${stage.models[destination].title} moved to the active position.`);
  settle(`${stage.models[destination].title} centered`, TRANSITION_MS.model);
}

function moveModel(delta) {
  moveToModel(getActiveModelIndex() + delta);
}

function focusActiveModel() {
  if (state.focusedModel) return;
  const model = getActiveModel();
  const snapshot = snapshotForReturn();
  const token = createReturnToken(snapshot);
  state.priorSelection = snapshot;
  state.returnToken = token;
  state.focusedModel = model.id;
  setTransition('FOCUS_TRANSITION', `Pulling ${model.title} forward`);
  updateView();
  announce(`${model.title} focused. Lens ${LENSES.find((lens) => lens.id === state.activeLens).label}. Return token ${token}.`);
  settle(`${model.title} in focused inspection`, TRANSITION_MS.focus);
}

function changeLens(lensId) {
  if (!LENSES.some((lens) => lens.id === lensId) || lensId === state.activeLens) return;
  const model = getActiveModel();
  setTransition('LENS_TRANSITION', `Rotating ${model.title} to ${lensId} expression`);
  state.activeLens = lensId;
  updateView();
  announce(`${model.title}. ${LENSES.find((lens) => lens.id === lensId).label} lens active.`);
  settle(`${LENSES.find((lens) => lens.id === lensId).label} expression settled`, TRANSITION_MS.lens);
}

function returnFromFocus() {
  if (!state.focusedModel || !state.priorSelection || !state.returnToken) return;
  const token = state.returnToken;
  const snapshot = clone(state.priorSelection);
  setTransition('RETURN_TRANSITION', `Restoring ${token}`);

  state.currentStage = snapshot.currentStage;
  state.stagePosition = snapshot.stagePosition;
  state.cameraOrViewTransform = snapshot.cameraOrViewTransform;
  state.modelOrder = snapshot.modelOrder;
  state.activeModelByStage = snapshot.activeModelByStage;
  state.focusedModel = null;
  state.activeLens = snapshot.activeLens;
  state.inputMode = snapshot.inputMode;
  state.priorSelection = { restoredFrom: token };
  state.returnToken = token;
  updateView();
  announce(`Exact return complete. Restored ${getStage().title}, ${getActiveModel().title}, ${state.activeLens} lens.`);
  settle(`Exact return restored · ${token}`, TRANSITION_MS.return);
}

function updateStatePanel() {
  stateOutput.textContent = JSON.stringify({
    currentStage: getStage().id,
    stagePosition: state.stagePosition,
    cameraOrViewTransform: state.cameraOrViewTransform,
    modelOrder: state.modelOrder,
    focusedModel: state.focusedModel,
    activeModel: getActiveModel().id,
    activeLens: state.activeLens,
    priorSelection: state.priorSelection,
    inputMode: state.inputMode,
    returnToken: state.returnToken,
    contentVersion: state.contentVersion,
    transition: state.transition
  }, null, 2);
}

function renderLinearView() {
  linearContent.innerHTML = STAGES.map((stage) => `
    <section class="linear-stage">
      <p class="eyebrow">Stage ${String(stage.ordinal).padStart(2, '0')} · ${stage.kicker}</p>
      <h3>${stage.title}</h3>
      <p>${stage.description}</p>
      ${stage.models.map((model) => `
        <article class="linear-model">
          <h4>${model.title}</h4>
          <code>${model.notation}</code>
          <p>${model.relationship} · source ${model.sourceState}</p>
          <div class="linear-lenses">
            ${LENSES.map((lens) => {
              const content = model.lenses[lens.id];
              return `
                <section class="linear-lens">
                  <h5>${lens.label}: ${content.title}</h5>
                  <p>${content.body}</p>
                </section>
              `;
            }).join('')}
          </div>
        </article>
      `).join('')}
    </section>
  `).join('');
}

function togglePanel(panelId, trigger) {
  const panel = document.querySelector(`#${panelId}`);
  const opening = panel.hidden;
  document.querySelectorAll('.utility-panel').forEach((candidate) => {
    candidate.hidden = true;
  });
  document.querySelectorAll('[aria-controls="help-panel"], [aria-controls="state-panel"]').forEach((button) => {
    button.setAttribute('aria-expanded', 'false');
  });
  panel.hidden = !opening;
  trigger.setAttribute('aria-expanded', String(opening));
  if (opening) panel.querySelector('button')?.focus();
}

function toggleTextMode() {
  const textMode = !document.body.classList.contains('text-mode');
  document.body.classList.toggle('text-mode', textMode);
  linearView.hidden = !textMode;
  spatialView.hidden = textMode;
  const button = document.querySelector('#mode-button');
  button.setAttribute('aria-pressed', String(textMode));
  button.textContent = textMode ? 'Spatial mode' : 'Text mode';
  announce(textMode ? 'Linear document view active.' : 'Spatial view active.');
}

function handleKeydown(event) {
  if (document.body.classList.contains('text-mode')) {
    if (event.key === 'Escape') toggleTextMode();
    return;
  }
  if (event.target.closest('.utility-panel')) return;
  setInputMode('keyboard');

  if (event.key === 'ArrowLeft' && event.shiftKey) {
    event.preventDefault();
    moveStage(-1);
  } else if (event.key === 'ArrowRight' && event.shiftKey) {
    event.preventDefault();
    moveStage(1);
  } else if (event.key === 'ArrowLeft') {
    event.preventDefault();
    moveModel(-1);
  } else if (event.key === 'ArrowRight') {
    event.preventDefault();
    moveModel(1);
  } else if (event.key === 'Enter' && !state.focusedModel) {
    event.preventDefault();
    focusActiveModel();
  } else if (event.key === 'Escape' && state.focusedModel) {
    event.preventDefault();
    returnFromFocus();
  } else if (['1', '2', '3'].includes(event.key)) {
    event.preventDefault();
    changeLens(LENSES[Number(event.key) - 1].id);
  }
}

function handleTouchStart(event) {
  const touch = event.changedTouches[0];
  touchStart = { x: touch.clientX, y: touch.clientY, time: performance.now() };
  setInputMode('touch');
}

function handleTouchEnd(event) {
  if (!touchStart || state.focusedModel) return;
  const touch = event.changedTouches[0];
  const dx = touch.clientX - touchStart.x;
  const dy = touch.clientY - touchStart.y;
  const elapsed = performance.now() - touchStart.time;
  touchStart = null;
  if (elapsed > 650 || Math.abs(dx) < 48 || Math.abs(dx) < Math.abs(dy) * 1.25) return;
  moveModel(dx > 0 ? -1 : 1);
}

function bindControls() {
  document.querySelector('#previous-stage').addEventListener('click', () => { setInputMode('pointer'); moveStage(-1); });
  document.querySelector('#next-stage').addEventListener('click', () => { setInputMode('pointer'); moveStage(1); });
  document.querySelector('#previous-model').addEventListener('click', () => { setInputMode('pointer'); moveModel(-1); });
  document.querySelector('#next-model').addEventListener('click', () => { setInputMode('pointer'); moveModel(1); });
  document.querySelector('#help-button').addEventListener('click', (event) => togglePanel('help-panel', event.currentTarget));
  document.querySelector('#state-button').addEventListener('click', (event) => togglePanel('state-panel', event.currentTarget));
  document.querySelector('#mode-button').addEventListener('click', toggleTextMode);
  document.querySelectorAll('[data-close-panel]').forEach((button) => {
    button.addEventListener('click', () => {
      const panel = document.querySelector(`#${button.dataset.closePanel}`);
      panel.hidden = true;
      document.querySelector(`[aria-controls="${button.dataset.closePanel}"]`)?.setAttribute('aria-expanded', 'false');
    });
  });
  document.addEventListener('keydown', handleKeydown);
  spatialView.addEventListener('touchstart', handleTouchStart, { passive: true });
  spatialView.addEventListener('touchend', handleTouchEnd, { passive: true });
}

function runStateContractSelfCheck() {
  const required = [
    'currentStage',
    'stagePosition',
    'cameraOrViewTransform',
    'modelOrder',
    'focusedModel',
    'activeLens',
    'priorSelection',
    'inputMode',
    'returnToken',
    'contentVersion'
  ];
  const missing = required.filter((key) => !(key in state));
  if (missing.length) {
    throw new Error(`State contract missing: ${missing.join(', ')}`);
  }
  if (STAGES.length !== 2 || STAGES.some((stage) => stage.models.length !== 3)) {
    throw new Error('Proof fixture must contain exactly two stages and three models per stage.');
  }
  if (!STAGES.flatMap((stage) => stage.models).some((model) => model.fullyPopulated)) {
    throw new Error('Proof fixture requires one fully populated model.');
  }
}

runStateContractSelfCheck();
renderWorld();
bindControls();
settle('Spatial state settled');
