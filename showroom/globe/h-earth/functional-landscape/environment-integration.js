import {
  H_EARTH_FUNCTIONAL_ENVIRONMENT_COMPOSITE_CONTRACT_ID,
  buildHEarthFunctionalEnvironmentComposite,
  evaluateHEarthFunctionalEnvironmentComposite
} from '../../../../h-earth-3d/integration/h-earth.functional-environment-composite.js';

const root = document.getElementById('h-earth-functional-landscape-route');
const canvas = document.getElementById('h-earth-functional-landscape-canvas');
const frameHud = document.getElementById('hud-frame');
const telemetry = root?.querySelector('.telemetry');
const context = canvas?.getContext('2d', { alpha: false });

const finite = (value) => typeof value === 'number' && Number.isFinite(value);
const clamp = (value, minimum, maximum) => Math.min(maximum, Math.max(minimum, value));
const clamp01 = (value) => clamp(value, 0, 1);
const round = (value, precision = 2) => {
  const factor = 10 ** precision;
  return Math.round(value * factor) / factor;
};
const clonePlain = (value) => value == null ? value : JSON.parse(JSON.stringify(value));
const mix = (a, b, amount) => Math.round(a + (b - a) * amount);

const hud = {};
function ensureHudField(key, label) {
  const id = `hud-${key}`;
  let node = document.getElementById(id);
  if (!node && telemetry) {
    const wrapper = document.createElement('div');
    const term = document.createElement('dt');
    node = document.createElement('dd');
    term.textContent = label;
    node.id = id;
    node.textContent = '—';
    wrapper.append(term, node);
    telemetry.append(wrapper);
  }
  hud[key] = node;
}

ensureHudField('surface', 'Surface');
ensureHudField('water', 'Water');
ensureHudField('biome', 'Biome');
ensureHudField('traversal', 'Traversal');
ensureHudField('lifecycle', 'Lifecycle');
ensureHudField('population', 'Population');

const OLD_SKY_TOP = [48, 83, 105];
const OLD_SKY_HORIZON = [173, 194, 190];
let refreshPromise = null;
let refreshPending = false;
let previousLifecycleState = null;
let lastComposite = null;
let lastReceipt = null;
let refreshSequence = 0;

function sampleGradient(stops, normalizedY) {
  const y = clamp01(normalizedY);
  for (let index = 1; index < stops.length; index += 1) {
    const left = stops[index - 1];
    const right = stops[index];
    if (y <= right.offset) {
      const span = Math.max(Number.EPSILON, right.offset - left.offset);
      const amount = clamp01((y - left.offset) / span);
      return [
        mix(left.rgba[0], right.rgba[0], amount),
        mix(left.rgba[1], right.rgba[1], amount),
        mix(left.rgba[2], right.rgba[2], amount),
        255
      ];
    }
  }
  return [...stops[stops.length - 1].rgba];
}

function isOriginalSkyPixel(r, g, b, y, height) {
  const amount = y / Math.max(1, height - 1);
  const expected = [
    mix(OLD_SKY_TOP[0], OLD_SKY_HORIZON[0], amount),
    mix(OLD_SKY_TOP[1], OLD_SKY_HORIZON[1], amount),
    mix(OLD_SKY_TOP[2], OLD_SKY_HORIZON[2], amount)
  ];
  return Math.abs(r - expected[0]) <= 2 &&
    Math.abs(g - expected[1]) <= 2 &&
    Math.abs(b - expected[2]) <= 2;
}

function surfaceColor(composite) {
  const profile = composite.surface.baseColorProfile;
  return [
    Math.round(clamp01(profile.linearR) * 255),
    Math.round(clamp01(profile.linearG) * 255),
    Math.round(clamp01(profile.linearB) * 255)
  ];
}

function materializeEnvironment(composite) {
  const width = canvas.width;
  const height = canvas.height;
  const image = context.getImageData(0, 0, width, height);
  const pixels = image.data;
  const skyStops = composite.presentation.atmosphere.skyGradientStops;
  const waterColor = composite.presentation.water.surfaceColor ?? [38, 113, 145, 226];
  const groundColor = surfaceColor(composite);
  let skyPixelCount = 0;
  let waterPixelCount = 0;
  let surfacePixelCount = 0;
  let grayFallbackPixelCount = 0;

  for (let y = 0; y < height; y += 1) {
    const skyColor = sampleGradient(skyStops, y / Math.max(1, height - 1));
    for (let x = 0; x < width; x += 1) {
      const offset = (y * width + x) * 4;
      const r = pixels[offset];
      const g = pixels[offset + 1];
      const b = pixels[offset + 2];
      const originalSky = isOriginalSkyPixel(r, g, b, y, height);
      if (originalSky) {
        pixels[offset] = skyColor[0];
        pixels[offset + 1] = skyColor[1];
        pixels[offset + 2] = skyColor[2];
        pixels[offset + 3] = 255;
        skyPixelCount += 1;
        continue;
      }

      const waterLike = y > height * 0.28 && b > r * 1.15 && b > g * 1.02;
      if (waterLike) {
        const blend = 0.5;
        pixels[offset] = mix(r, waterColor[0], blend);
        pixels[offset + 1] = mix(g, waterColor[1], blend);
        pixels[offset + 2] = mix(b, waterColor[2], blend);
        pixels[offset + 3] = 255;
        waterPixelCount += 1;
      } else {
        const earthy = y > height * 0.32 && r >= b * 0.72;
        if (earthy) {
          const blend = 0.12;
          pixels[offset] = mix(r, groundColor[0], blend);
          pixels[offset + 1] = mix(g, groundColor[1], blend);
          pixels[offset + 2] = mix(b, groundColor[2], blend);
          surfacePixelCount += 1;
        }
      }

      if (Math.abs(pixels[offset] - pixels[offset + 1]) < 3 &&
          Math.abs(pixels[offset + 1] - pixels[offset + 2]) < 3 &&
          pixels[offset] > 70 && pixels[offset] < 190) {
        grayFallbackPixelCount += 1;
      }
    }
  }

  context.putImageData(image, 0, 0);

  const population = composite.population.instances;
  let populationMarkerCount = 0;
  if (population.length > 0) {
    context.save();
    const radius = Math.max(48, composite.population.bounds.xMaximum -
      composite.population.bounds.xMinimum);
    for (const instance of population.slice(0, 32)) {
      const dx = instance.world.x - composite.world.x;
      const dz = instance.world.z - composite.world.z;
      const screenX = width * 0.5 + dx / radius * width * 0.44;
      const screenY = height * 0.72 + dz / radius * height * 0.28;
      if (screenX < 2 || screenX > width - 2 || screenY < height * 0.36 || screenY > height - 2) {
        continue;
      }
      const size = clamp(1.2 + instance.uniformScale * 1.1, 1.5, 4.5);
      context.beginPath();
      context.arc(screenX, screenY, size, 0, Math.PI * 2);
      context.fillStyle = instance.instanceClass.includes('SHRUB')
        ? 'rgba(56,92,57,0.92)'
        : instance.instanceClass.includes('LICHEN')
          ? 'rgba(135,144,84,0.9)'
          : 'rgba(78,128,68,0.9)';
      context.fill();
      populationMarkerCount += 1;
    }
    context.restore();
  }

  return {
    skyPixelCount,
    waterPixelCount,
    surfacePixelCount,
    populationMarkerCount,
    grayFallbackPixelCount,
    alphaClosed: true
  };
}

function updateHud(composite) {
  hud.surface.textContent = `${composite.surface.surfaceClass} · wet ${round(composite.surface.wetness)}`;
  hud.water.textContent = `${composite.water.waterClass} · depth ${round(composite.water.depth)}`;
  hud.biome.textContent = composite.biome.biomeClass;
  hud.traversal.textContent = `${composite.traversal.traversalClass} · cost ${round(composite.traversal.movementCost)}`;
  hud.lifecycle.textContent = composite.lifecycle.state;
  hud.population.textContent = `${composite.population.instanceCount} instances`;
}

async function performRefresh({ lifecycleSubjectWorld = null } = {}) {
  const run6f = window.H_EARTH_FUNCTIONAL_LANDSCAPE_RUN6F;
  if (!run6f?.ready || !canvas || !context) return null;
  const snapshot = run6f.getSnapshot();
  if (!snapshot?.ready || !snapshot.state || !snapshot.receipt) return null;

  const started = performance.now();
  refreshSequence += 1;
  const state = snapshot.state;
  const composite = buildHEarthFunctionalEnvironmentComposite({
    worldX: state.position.x,
    worldZ: state.position.z,
    observerWorld: state.position,
    lifecycleSubjectWorld,
    previousLifecycleState: lifecycleSubjectWorld ? null : previousLifecycleState,
    viewportWidth: canvas.width,
    viewportHeight: canvas.height,
    cameraFarPlane: 512,
    renderSequence: snapshot.receipt.renderSequence,
    populationRadius: 96,
    populationSampleStep: 24,
    populationSeed: 'H_EARTH_RUN_7H_PUBLIC_ROUTE_POPULATION_v1'
  });
  const evaluation = evaluateHEarthFunctionalEnvironmentComposite(composite);
  if (!evaluation.eligible) {
    throw new Error(`Run 7H composite failed: ${evaluation.issues.join(', ')}`);
  }
  if (!lifecycleSubjectWorld) previousLifecycleState = composite.lifecycle.state;

  const materialization = materializeEnvironment(composite);
  updateHud(composite);
  const durationMilliseconds = performance.now() - started;
  lastComposite = composite;
  lastReceipt = {
    receiptType: 'H_EARTH_FUNCTIONAL_ENVIRONMENT_RUN_7H_BROWSER_RECEIPT',
    eligible: true,
    status: 'RUN_7H_PUBLIC_ROUTE_INTEGRATION_COMPLETE',
    compositeContractId: H_EARTH_FUNCTIONAL_ENVIRONMENT_COMPOSITE_CONTRACT_ID,
    refreshSequence,
    renderSequence: snapshot.receipt.renderSequence,
    semanticAddressId: composite.correspondence.semanticAddressId,
    chunkId: composite.correspondence.chunkId,
    surfaceClass: composite.surface.surfaceClass,
    waterClass: composite.water.waterClass,
    biomeClass: composite.biome.biomeClass,
    traversalClass: composite.traversal.traversalClass,
    lifecycleState: composite.lifecycle.state,
    populationInstanceCount: composite.population.instanceCount,
    populationMarkerCount: materialization.populationMarkerCount,
    atmosphereVisible: materialization.skyPixelCount > 0,
    waterPresentationApplied: materialization.waterPixelCount > 0 || composite.water.waterPresent === false,
    surfacePresentationApplied: materialization.surfacePixelCount > 0,
    skyAlphaClosed: materialization.alphaClosed,
    grayFallbackPixelCount: materialization.grayFallbackPixelCount,
    integrationDurationMilliseconds: durationMilliseconds,
    materialization,
    authorityCollapse: false,
    rendererAuthorityReplaced: false,
    cameraAuthorityReplaced: false,
    navigationAuthorityReplaced: false,
    issues: []
  };
  root.dataset.run7hReady = 'true';
  root.dataset.run7hError = 'false';
  root.dataset.lifecycleState = composite.lifecycle.state;
  return clonePlain(lastReceipt);
}

async function refresh(options = {}) {
  if (refreshPromise) {
    refreshPending = true;
    return refreshPromise;
  }
  refreshPromise = performRefresh(options)
    .catch((error) => {
      root.dataset.run7hReady = 'false';
      root.dataset.run7hError = 'true';
      throw error;
    })
    .finally(() => {
      refreshPromise = null;
      if (refreshPending) {
        refreshPending = false;
        queueMicrotask(() => refresh());
      }
    });
  return refreshPromise;
}

const frameObserver = new MutationObserver(() => {
  queueMicrotask(() => refresh());
});
if (frameHud) frameObserver.observe(frameHud, { childList: true, characterData: true, subtree: true });

window.H_EARTH_FUNCTIONAL_ENVIRONMENT_RUN7H = {
  ready: false,
  async refresh() {
    const receipt = await refresh();
    this.ready = receipt?.eligible === true;
    return receipt;
  },
  getSnapshot() {
    return {
      ready: root.dataset.run7hReady === 'true',
      receipt: clonePlain(lastReceipt),
      composite: lastComposite ? {
        contractId: lastComposite.contractId,
        world: clonePlain(lastComposite.world),
        surfaceClass: lastComposite.surface.surfaceClass,
        waterClass: lastComposite.water.waterClass,
        biomeClass: lastComposite.biome.biomeClass,
        traversalClass: lastComposite.traversal.traversalClass,
        lifecycleState: lastComposite.lifecycle.state,
        populationInstanceCount: lastComposite.population.instanceCount,
        sourceIdentities: clonePlain(lastComposite.sourceIdentities)
      } : null
    };
  },
  async gotoWaypoint(waypointId) {
    const result = await window.H_EARTH_FUNCTIONAL_LANDSCAPE_RUN6F.gotoWaypoint(waypointId);
    const environmentReceipt = await refresh();
    return { result, environmentReceipt };
  },
  async runGeographicPath() {
    const results = [];
    for (const waypointId of ['COAST', 'BERM', 'LOWLAND', 'HILL', 'RIDGE']) {
      results.push(await this.gotoWaypoint(waypointId));
    }
    return results;
  },
  async runLifecycleDistanceProof() {
    const snapshot = window.H_EARTH_FUNCTIONAL_LANDSCAPE_RUN6F.getSnapshot();
    const observer = snapshot.state.position;
    const distances = [32, 120, 260, 420];
    const receipts = [];
    for (const distance of distances) {
      const receipt = await refresh({
        lifecycleSubjectWorld: {
          x: observer.x + distance,
          y: observer.y,
          z: observer.z
        }
      });
      receipts.push({ distance, state: receipt.lifecycleState, populationInstanceCount: receipt.populationInstanceCount });
    }
    await refresh();
    return receipts;
  },
  getBrowserReceipt() {
    return clonePlain(lastReceipt);
  }
};

async function initialize() {
  for (let attempt = 0; attempt < 240; attempt += 1) {
    if (window.H_EARTH_FUNCTIONAL_LANDSCAPE_RUN6F?.ready === true) {
      const receipt = await refresh();
      window.H_EARTH_FUNCTIONAL_ENVIRONMENT_RUN7H.ready = receipt?.eligible === true;
      return;
    }
    await new Promise((resolve) => setTimeout(resolve, 25));
  }
  root.dataset.run7hError = 'true';
  throw new Error('Run 7H initialization timed out waiting for Run 6F route');
}

initialize().catch((error) => console.error(error));
