const clamp = (value, minimum = 0, maximum = 1) => Math.min(maximum, Math.max(minimum, value));
const clone = (value) => JSON.parse(JSON.stringify(value));

function normalizedPoint(canvas, event) {
  const rect = canvas.getBoundingClientRect();
  return {
    x: clamp((event.clientX - rect.left) / Math.max(1, rect.width)),
    y: clamp((event.clientY - rect.top) / Math.max(1, rect.height))
  };
}

function normalizedRectangle(start, end) {
  const xMinimum = Math.min(start.x, end.x);
  const yMinimum = Math.min(start.y, end.y);
  const xMaximum = Math.max(start.x, end.x);
  const yMaximum = Math.max(start.y, end.y);
  return {
    x: xMinimum,
    y: yMinimum,
    width: xMaximum - xMinimum,
    height: yMaximum - yMinimum
  };
}

function drawRegion(canvas, region, active = null) {
  const context = canvas.getContext('2d');
  context.clearRect(0, 0, canvas.width, canvas.height);
  const record = active ?? region;
  if (!record) return;
  context.save();
  context.fillStyle = 'rgba(255, 235, 84, 0.18)';
  context.strokeStyle = '#ffeb54';
  context.lineWidth = Math.max(2, canvas.width / 360);
  context.setLineDash([12, 7]);
  context.fillRect(record.x * canvas.width, record.y * canvas.height, record.width * canvas.width, record.height * canvas.height);
  context.strokeRect(record.x * canvas.width, record.y * canvas.height, record.width * canvas.width, record.height * canvas.height);
  context.restore();
}

function emptyRecord(sceneId) {
  return {
    sceneId,
    classification: null,
    markedRegion: null,
    distractionScore: null,
    selectedMaterialFamily: 'FAMILY_5',
    selectedDiagnosticPass: 'ORIENTATION_AND_LAG_OVERLAY',
    visibleReference: 'ACCEPTED_CP2_PASS_H'
  };
}

export function createPerceptualCorrespondenceController({ sceneIds, markCanvas, onChange = () => {} }) {
  if (!(markCanvas instanceof HTMLCanvasElement)) throw new Error('TERRAIN_WORKBENCH_MARK_CANVAS_REQUIRED');
  const records = new Map(sceneIds.map((sceneId) => [sceneId, emptyRecord(sceneId)]));
  let currentSceneId = sceneIds[0];
  let dragStart = null;
  let activeRegion = null;

  function current() {
    const record = records.get(currentSceneId);
    if (!record) throw new Error(`TERRAIN_WORKBENCH_UNKNOWN_CORRESPONDENCE_SCENE:${currentSceneId}`);
    return record;
  }

  function emit() {
    drawRegion(markCanvas, current().markedRegion, activeRegion);
    onChange(clone(current()), getProgress());
  }

  function setScene(sceneId, width, height) {
    if (!records.has(sceneId)) throw new Error(`TERRAIN_WORKBENCH_UNKNOWN_CORRESPONDENCE_SCENE:${sceneId}`);
    currentSceneId = sceneId;
    markCanvas.width = width;
    markCanvas.height = height;
    dragStart = null;
    activeRegion = null;
    emit();
  }

  function setClassification(value) {
    if (value !== 'YES' && value !== 'NO' && value !== null) throw new Error(`TERRAIN_WORKBENCH_INVALID_CLASSIFICATION:${value}`);
    const record = current();
    record.classification = value;
    if (value === 'YES') record.markedRegion = null;
    emit();
  }

  function setDistractionScore(value) {
    const score = Number(value);
    if (!Number.isInteger(score) || score < 0 || score > 4) throw new Error(`TERRAIN_WORKBENCH_INVALID_DISTRACTION_SCORE:${value}`);
    current().distractionScore = score;
    emit();
  }

  function setSelectedMaterialFamily(value) {
    current().selectedMaterialFamily = String(value);
    emit();
  }

  function setSelectedDiagnosticPass(value) {
    current().selectedDiagnosticPass = String(value);
    emit();
  }

  function setVisibleReference(value) {
    current().visibleReference = String(value);
    emit();
  }

  function clearMarkedRegion() {
    current().markedRegion = null;
    activeRegion = null;
    emit();
  }

  markCanvas.addEventListener('pointerdown', (event) => {
    if (current().classification !== 'NO') return;
    markCanvas.setPointerCapture(event.pointerId);
    dragStart = normalizedPoint(markCanvas, event);
    activeRegion = { x: dragStart.x, y: dragStart.y, width: 0, height: 0 };
    emit();
  });

  markCanvas.addEventListener('pointermove', (event) => {
    if (!dragStart || current().classification !== 'NO') return;
    activeRegion = normalizedRectangle(dragStart, normalizedPoint(markCanvas, event));
    emit();
  });

  const finishDrag = (event) => {
    if (!dragStart || current().classification !== 'NO') return;
    const region = normalizedRectangle(dragStart, normalizedPoint(markCanvas, event));
    dragStart = null;
    activeRegion = null;
    if (region.width >= 0.005 && region.height >= 0.005) current().markedRegion = region;
    emit();
  };
  markCanvas.addEventListener('pointerup', finishDrag);
  markCanvas.addEventListener('pointercancel', () => {
    dragStart = null;
    activeRegion = null;
    emit();
  });

  function validateRecord(record) {
    const issues = [];
    if (record.classification !== 'YES' && record.classification !== 'NO') issues.push('CLASSIFICATION_REQUIRED');
    if (!Number.isInteger(record.distractionScore) || record.distractionScore < 0 || record.distractionScore > 4) issues.push('DISTRACTION_SCORE_REQUIRED');
    if (record.classification === 'NO' && !record.markedRegion) issues.push('MARKED_REGION_REQUIRED_FOR_NO');
    return issues;
  }

  function getProgress() {
    const all = [...records.values()];
    const complete = all.filter((record) => validateRecord(record).length === 0).length;
    return Object.freeze({ complete, total: all.length, allComplete: complete === all.length });
  }

  function getRecords() {
    return sceneIds.map((sceneId) => clone(records.get(sceneId)));
  }

  function getCurrentRecord() {
    return clone(current());
  }

  function getValidation() {
    return Object.fromEntries(sceneIds.map((sceneId) => [sceneId, validateRecord(records.get(sceneId))]));
  }

  return Object.freeze({
    setScene,
    setClassification,
    setDistractionScore,
    setSelectedMaterialFamily,
    setSelectedDiagnosticPass,
    setVisibleReference,
    clearMarkedRegion,
    getCurrentRecord,
    getRecords,
    getProgress,
    getValidation
  });
}

export default createPerceptualCorrespondenceController;
