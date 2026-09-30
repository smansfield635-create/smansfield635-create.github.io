import { createTerrainAtlasModel, B1_BASELINE_DIGEST, B2_PROTECTION_DIGEST } from './terrain-atlas.mjs';
import { createSceneLab, MATERIAL_FAMILIES, SCENES, DIAGNOSTIC_PASS_KEYS } from './scene-lab.mjs';
import { createPerceptualCorrespondenceController } from './perceptual-correspondence.mjs';
import {
  buildPerceptualCorrespondencePacket,
  serializePerceptualCorrespondencePacket,
  downloadPerceptualCorrespondencePacket
} from './export-packet.mjs';

const byId = (id) => document.getElementById(id);
const status = byId('status');
const progress = byId('progress');
const exportButton = byId('export-packet');
const sceneSelect = byId('scene-select');
const familySelect = byId('family-select');
const diagnosticSelect = byId('diagnostic-select');
const scoreInput = byId('distraction-score');
const scoreOutput = byId('distraction-output');
const mainHead = new URLSearchParams(location.search).get('head') || 'accdec74088120446bfc28f4441fc08a8210813f';

function setStatus(message, className = '') {
  status.className = className;
  status.textContent = message;
}

function formatInspection(record) {
  return JSON.stringify({
    WORLD_X: record.worldX,
    WORLD_Z: record.worldZ,
    ELEVATION: record.elevation,
    RESIDUAL_ELEVATION: record.residualElevation,
    DIRECTIONAL_SLOPE: record.directionalSlope,
    SLOPE: record.slope,
    ASPECT_DEGREES: record.aspectDegrees,
    PROFILE_CURVATURE: record.profileCurvature,
    PLAN_CURVATURE: record.planCurvature,
    LANDFORM_CLASS: `${record.landformClass}:${record.landformLabel}`,
    RIDGE_DISTANCE: record.ridgeDistance,
    VALLEY_DISTANCE: record.valleyDistance,
    FLOW_ACCUMULATION: record.flowAccumulation,
    TPI: record.tpi,
    OPENNESS: record.openness,
    REPETITION_HOTSPOT_WEIGHT: record.repetitionHotspotWeight,
    PROTECTION_CLASS: record.protectionClass,
    HARDNESS: record.hardness,
    EDITABLE_WEIGHT: record.editableWeight
  }, null, 2);
}

function initializeAtlas() {
  const atlas = createTerrainAtlasModel();
  const layerSelect = byId('layer-select');
  for (const layer of atlas.layers) layerSelect.add(new Option(layer.label, layer.key));
  layerSelect.value = 'heights';
  const canvas = byId('terrain-map');
  const draw = () => atlas.draw(canvas, layerSelect.value, {
    P0: byId('overlay-p0').checked,
    P1: byId('overlay-p1').checked,
    P2: byId('overlay-p2').checked,
    FREE: byId('overlay-free').checked,
    opacity: Number(byId('overlay-opacity').value)
  });
  layerSelect.addEventListener('change', draw);
  for (const id of ['overlay-p0', 'overlay-p1', 'overlay-p2', 'overlay-free', 'overlay-opacity']) byId(id).addEventListener('input', draw);
  canvas.addEventListener('click', (event) => {
    byId('terrain-inspection').textContent = formatInspection(atlas.inspectCanvasPoint(canvas, event.clientX, event.clientY));
  });
  draw();
  return atlas;
}

function renderCanvasRegistry() {
  return {
    official: byId('render-official'),
    G: byId('render-g'),
    H: byId('render-h'),
    FAMILY_1: byId('render-family-1'),
    FAMILY_2: byId('render-family-2'),
    FAMILY_3: byId('render-family-3'),
    FAMILY_4: byId('render-family-4'),
    FAMILY_5: byId('render-family-5'),
    FAMILY_6: byId('render-family-6'),
    FAMILY_7: byId('render-family-7')
  };
}

function viewCanvasRegistry() {
  return {
    H: byId('accepted-view'),
    G: byId('g-view'),
    metric: byId('metric-view'),
    family: byId('family-view')
  };
}

function populateSceneControls() {
  for (const scene of SCENES) sceneSelect.add(new Option(scene.id, scene.id));
  for (const family of MATERIAL_FAMILIES) familySelect.add(new Option(`${family.key} — ${family.label ?? family.name ?? 'material family'}`, family.key));
  familySelect.value = 'FAMILY_5';
}

function syncForm(record) {
  document.querySelectorAll('input[name="classification"]').forEach((input) => { input.checked = input.value === record.classification; });
  familySelect.value = record.selectedMaterialFamily;
  diagnosticSelect.value = record.selectedDiagnosticPass;
  if (Number.isInteger(record.distractionScore)) {
    scoreInput.value = String(record.distractionScore);
    scoreOutput.value = String(record.distractionScore);
    scoreOutput.textContent = String(record.distractionScore);
  } else {
    scoreInput.value = '0';
    scoreOutput.value = 'not recorded';
    scoreOutput.textContent = 'not recorded';
  }
}

async function initializeSceneConsole() {
  populateSceneControls();
  const sceneLab = await createSceneLab({ renderCanvases: renderCanvasRegistry(), viewCanvases: viewCanvasRegistry() });
  const sceneRecords = new Map();
  let currentSceneIndex = 0;

  const correspondence = createPerceptualCorrespondenceController({
    sceneIds: sceneLab.sceneIds,
    markCanvas: byId('mark-region'),
    onChange: (record, state) => {
      progress.textContent = `${state.complete} / ${state.total} complete`;
      exportButton.disabled = !state.allComplete;
      if (record) syncForm(record);
    }
  });

  function updateFamilyCaption() {
    const family = MATERIAL_FAMILIES.find((entry) => entry.key === familySelect.value);
    byId('family-caption').textContent = `${family?.key ?? familySelect.value} — ${family?.label ?? family?.name ?? 'selected material-family ablation'}`;
  }

  function renderSceneAt(index) {
    currentSceneIndex = (index + sceneLab.sceneIds.length) % sceneLab.sceneIds.length;
    const sceneId = sceneLab.sceneIds[currentSceneIndex];
    sceneSelect.value = sceneId;
    const existing = correspondence.getRecords().find((record) => record.sceneId === sceneId);
    sceneLab.setSelectedFamily(existing.selectedMaterialFamily);
    const record = sceneLab.renderScene(sceneId);
    sceneRecords.set(sceneId, record);
    correspondence.setScene(sceneId, byId('accepted-view').width, byId('accepted-view').height);
    syncForm(correspondence.getCurrentRecord());
    updateFamilyCaption();
    setStatus(`SCENE_READY = ${sceneId}\nRENDERED_SCENES = ${sceneLab.getRenderedSceneCount()}_OF_8\nDIAGNOSTIC_PASS_AUTHORITY = ${DIAGNOSTIC_PASS_KEYS.join('_THROUGH_')}\nLIVE_MUTATION = FALSE`, 'ok');
    return record;
  }

  sceneSelect.addEventListener('change', () => renderSceneAt(sceneLab.sceneIds.indexOf(sceneSelect.value)));
  byId('previous-scene').addEventListener('click', () => renderSceneAt(currentSceneIndex - 1));
  byId('next-scene').addEventListener('click', () => renderSceneAt(currentSceneIndex + 1));

  familySelect.addEventListener('change', () => {
    sceneLab.setSelectedFamily(familySelect.value);
    correspondence.setSelectedMaterialFamily(familySelect.value);
    updateFamilyCaption();
  });
  diagnosticSelect.addEventListener('change', () => correspondence.setSelectedDiagnosticPass(diagnosticSelect.value));
  document.querySelectorAll('input[name="classification"]').forEach((input) => {
    input.addEventListener('change', () => { if (input.checked) correspondence.setClassification(input.value); });
  });
  scoreInput.addEventListener('input', () => {
    scoreOutput.value = scoreInput.value;
    scoreOutput.textContent = scoreInput.value;
  });
  scoreInput.addEventListener('change', () => correspondence.setDistractionScore(Number(scoreInput.value)));
  byId('clear-region').addEventListener('click', () => correspondence.clearMarkedRegion());

  function buildPacket() {
    const validation = correspondence.getValidation();
    const incomplete = Object.entries(validation).filter(([, issues]) => issues.length).map(([sceneId, issues]) => `${sceneId}:${issues.join('+')}`);
    if (incomplete.length) throw new Error(`TERRAIN_WORKBENCH_CORRESPONDENCE_INCOMPLETE:${incomplete.join(',')}`);
    if (sceneRecords.size !== sceneLab.sceneIds.length) throw new Error(`TERRAIN_WORKBENCH_ALL_SCENES_NOT_RENDERED:${sceneRecords.size}`);
    return buildPerceptualCorrespondencePacket({
      records: correspondence.getRecords(),
      sceneRecords,
      atlasDigests: { b1: B1_BASELINE_DIGEST, b2: B2_PROTECTION_DIGEST },
      sourceHead: mainHead
    });
  }

  exportButton.addEventListener('click', () => {
    try {
      const packet = buildPacket();
      downloadPerceptualCorrespondencePacket(packet);
      setStatus(`PACKET_EXPORTED = TRUE\nCANONICAL_PACKET_DIGEST = ${packet.canonicalPacketDigest}\nSCENE_COUNT = ${packet.sceneCount}\nLIVE_MUTATION = FALSE`, 'ok');
    } catch (error) {
      setStatus(String(error?.stack || error), 'danger');
    }
  });

  function completeVerificationFixture() {
    for (let index = 0; index < sceneLab.sceneIds.length; index += 1) {
      renderSceneAt(index);
      correspondence.setClassification('YES');
      correspondence.setDistractionScore(index % 5);
      correspondence.setSelectedMaterialFamily(MATERIAL_FAMILIES[index % MATERIAL_FAMILIES.length].key);
      correspondence.setSelectedDiagnosticPass(index % 2 === 0 ? 'ORIENTATION_AND_LAG_OVERLAY' : 'G_FLAT_LIGHTING');
    }
    const packet = buildPacket();
    const first = serializePerceptualCorrespondencePacket(packet);
    const second = serializePerceptualCorrespondencePacket(buildPacket());
    return {
      packet,
      deterministic: first === second,
      diagnostics: sceneLab.finalizeDiagnostics(),
      validation: correspondence.getValidation()
    };
  }

  renderSceneAt(0);
  return Object.freeze({ sceneLab, correspondence, sceneRecords, renderSceneAt, buildPacket, completeVerificationFixture });
}

try {
  const atlas = initializeAtlas();
  const consoleController = await initializeSceneConsole();
  const api = Object.freeze({
    atlas,
    ...consoleController,
    fixedGates: Object.freeze({
      b1BaselineDigest: B1_BASELINE_DIGEST,
      b2ProtectionDigest: B2_PROTECTION_DIGEST,
      cp2HFrameEquivalence: '8_OF_8',
      cp2DepthEquivalence: '8_OF_8',
      diagnosticPasses: DIAGNOSTIC_PASS_KEYS,
      materialFamilyAblations: MATERIAL_FAMILIES.length,
      liveHostChanged: false,
      liveBindingChanged: false,
      acceptedRendererChanged: false,
      publicHEarthRouteChanged: false
    })
  });
  window.H_EARTH_TERRAIN_WORKBENCH = api;
  document.documentElement.dataset.terrainWorkbenchReady = 'true';
} catch (error) {
  document.documentElement.dataset.terrainWorkbenchError = 'true';
  setStatus(String(error?.stack || error), 'danger');
  console.error(error);
}
