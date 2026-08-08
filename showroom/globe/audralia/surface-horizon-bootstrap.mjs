const SCHEMA = 'AUDRALIA_SURFACE_HORIZON_TRAVERSAL_v1';
const statusNode = document.querySelector('[data-h-earth-status]');
const diagnosticNode = document.querySelector('[data-h-earth-diagnostic]');

const setFailure = (stage, error) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`AUDRALIA_SURFACE_HORIZON_${stage}_FAILED`, error);
  if (statusNode) {
    statusNode.textContent = 'ERROR';
    statusNode.dataset.status = `${stage}_FAILED`;
  }
  if (diagnosticNode) diagnosticNode.textContent = `${stage}_FAILED: ${message}`;
  window.__AUDRALIA_SURFACE_HORIZON_ERROR__ = Object.freeze({ schema: SCHEMA, stage, message });
};

const fetchText = async url => {
  const response = await fetch(url, { cache: 'no-store' });
  if (!response.ok) throw new Error(`FETCH_FAILED:${response.status}:${url}`);
  return response.text();
};

const replaceRequired = (source, pattern, replacement, label) => {
  const next = source.replace(pattern, replacement);
  if (next === source) throw new Error(`TRANSFORM_MISSING:${label}`);
  return next;
};

function transformRenderer(source, rendererUrl) {
  const terrainUrl = new URL('../../../../h-earth-3d/terrain/h-earth.terrain-estate-construction-v1.candidate.js', rendererUrl).href;
  let next = replaceRequired(
    source,
    '../../../../h-earth-3d/terrain/h-earth.terrain-estate-construction-v1.candidate.js',
    terrainUrl,
    'RENDERER_TERRAIN_IMPORT'
  );

  next = replaceRequired(
    next,
    "state={yaw:-.62,pitch:.88,distance:720,targetU:0,targetV:-4,renderedFrames:0}",
    "state={yaw:-.62,pitch:-.90,distance:570,targetU:-266,targetV:369,renderedFrames:0}",
    'RENDERER_INITIAL_CAMERA_STATE'
  );

  const cameraReplacement = `function camera(){
    state.pitch=clamp(state.pitch,-1.45,.80);
    state.distance=clamp(state.distance,4,5600);
    limitTarget();
    const direction=tangentDirection(state.targetU,state.targetV),groundSample=sampleCanonicalGratitude(state.targetU,state.targetV),ground=groundSample.inside?groundSample.elevation:HYDRO.seaLevelY,surface=surfacePositionFromDirection(direction,ground),pU1=tangentPosition(state.targetU+1,state.targetV),pU0=tangentPosition(state.targetU-1,state.targetV),pV1=tangentPosition(state.targetU,state.targetV+1),pV0=tangentPosition(state.targetU,state.targetV-1),eU=norm(sub(pU1,pU0)),eV=norm(sub(pV1,pV0)),outward=norm(add(scale(eU,Math.sin(state.yaw)),scale(eV,Math.cos(state.yaw)))),heading=scale(outward,-1),eye=add(surface,scale(direction,state.distance)),cosPitch=Math.cos(state.pitch),forward=norm(add(scale(heading,cosPitch),scale(direction,Math.sin(state.pitch))));
    let right=cross(forward,direction);
    if(Math.hypot(...right)<1e-5)right=eU;
    right=norm(right);
    const up=norm(cross(right,forward)),sight=Math.max(160,Math.min(PLANET_RADIUS*2,state.distance*2.4+420)),target=add(eye,scale(forward,sight));
    return{eye,target,up,forward,right,localUp:direction,surfaceElevation:ground,clearance:state.distance};
  }`;

  next = replaceRequired(
    next,
    /function camera\(\)\{state\.pitch=clamp\(state\.pitch,\.46,1\.49\);[\s\S]*?return\{eye,target,up:direction\};\}/,
    cameraReplacement,
    'RENDERER_CAMERA_FRAME'
  );

  next = replaceRequired(
    next,
    /function orbit\(dx,dy\)\{[\s\S]*?render\(\);\}/,
    "function orbit(dx,dy){state.yaw=Math.atan2(Math.sin(state.yaw+clamp(Number(dx)||0,-64,64)*.0052),Math.cos(state.yaw+clamp(Number(dx)||0,-64,64)*.0052));state.pitch=clamp(state.pitch-clamp(Number(dy)||0,-64,64)*.0032,-1.45,.80);render();}",
    'RENDERER_ORBIT'
  );

  next = replaceRequired(
    next,
    /function zoom\(delta\)\{[\s\S]*?render\(\);\}/,
    "function zoom(delta){state.distance=clamp(state.distance*Math.exp(clamp(Number(delta)||0,-900,900)*.00115),4,5600);render();}",
    'RENDERER_ZOOM'
  );

  next = replaceRequired(
    next,
    /function zoomByFactor\(factor\)\{[\s\S]*?render\(\);\}/,
    "function zoomByFactor(factor){state.distance=clamp(state.distance*clamp(Number(factor)||1,.72,1.38),4,5600);render();}",
    'RENDERER_PINCH_ALTITUDE'
  );

  next = replaceRequired(
    next,
    /function focusGratitude\(\)\{[\s\S]*?render\(\);\}/,
    "function focusGratitude(){Object.assign(state,{yaw:-.62,pitch:-.90,distance:570,targetU:-266,targetV:369});render();}",
    'RENDERER_FOCUS_GRATITUDE'
  );

  next = replaceRequired(
    next,
    /function planetaryVantage\(\)\{[\s\S]*?render\(\);\}/,
    "function planetaryVantage(){state.distance=5000;state.pitch=-1.02;render();}",
    'RENDERER_PLANETARY_VANTAGE'
  );

  next = replaceRequired(
    next,
    'distanceSafe:state.distance>=95&&state.distance<=5600',
    'distanceSafe:state.distance>=4&&state.distance<=5600',
    'RENDERER_CAMERA_SAFETY'
  );

  next = replaceRequired(
    next,
    'planetaryVantage,getViewScale:viewScale,',
    'planetaryVantage,getCameraFrame:camera,getViewScale:viewScale,',
    'RENDERER_CAMERA_FRAME_EXPORT'
  );

  return next;
}

function transformApp(source, appUrl, rendererBlobUrl) {
  const observerUrl = new URL('./observer.mjs', appUrl).href;
  let next = replaceRequired(source, "'./renderer.mjs'", `'${rendererBlobUrl}'`, 'APP_RENDERER_IMPORT');
  next = next.replaceAll("'./observer.mjs'", `'${observerUrl}'`);
  const cameraMatches = (next.match(/cam=cameraFrame\(snapshot\)/g) || []).length;
  if (cameraMatches < 2) throw new Error(`TRANSFORM_MISSING:APP_CAMERA_FRAME_BINDINGS:${cameraMatches}`);
  next = next.replaceAll('cam=cameraFrame(snapshot)', 'cam=renderer.getCameraFrame?.()??cameraFrame(snapshot)');
  return next;
}

function transformCelestial(source) {
  return replaceRequired(
    source,
    'const frame = cameraFrame(snapshot);',
    'const frame = renderer.getCameraFrame?.() ?? cameraFrame(snapshot);',
    'CELESTIAL_CAMERA_FRAME_BINDING'
  );
}

function wireHelpAccordion() {
  const buttons = [...document.querySelectorAll('[data-help-step]')];
  const panel = document.querySelector('[data-help-panel]');
  const title = document.querySelector('[data-help-panel-title]');
  const copy = document.querySelector('[data-help-panel-copy]');
  if (!buttons.length || !panel || !title || !copy) return;

  const touchCopy = Object.freeze({
    '1': ['1 · LOOK', 'Use one finger and drag to turn your view. This changes where you are looking without moving you across Audralia.'],
    '2': ['2 · TRAVEL', 'Put two fingers on the world and slide both fingers together in the same direction. Keep about the same gap between them. This moves you across the surface.'],
    '3': ['3 · GO LOWER', 'With two fingers down, move them toward each other. This lowers your surface-relative altitude so you can descend from aerial view toward the ocean, land, and beneath appropriate cloud layers.'],
    '4': ['4 · GO HIGHER', 'With two fingers down, move them apart. This raises your altitude from local and surface-horizon views back toward regional, continental, and planetary views.']
  });
  const pointerCopy = Object.freeze({
    '1': ['1 · LOOK', 'Hold the mouse button and drag to change your viewing direction without changing altitude.'],
    '2': ['2 · TRAVEL', 'Use W A S D or the arrow keys to travel across Audralia while keeping your viewing direction independent.'],
    '3': ['3 · GO LOWER', 'Scroll toward the surface to lower your surface-relative altitude. Nearby terrain remains the clearance authority.'],
    '4': ['4 · GO HIGHER', 'Scroll away from the surface to rise back toward regional, continental, and planetary scale.']
  });
  const pointer = matchMedia('(hover:hover) and (pointer:fine)').matches;
  const source = pointer ? pointerCopy : touchCopy;
  let openStep = null;

  const close = () => {
    openStep = null;
    panel.hidden = true;
    for (const button of buttons) button.setAttribute('aria-expanded', 'false');
  };

  const open = step => {
    const entry = source[step];
    if (!entry) return;
    openStep = step;
    title.textContent = entry[0];
    copy.textContent = entry[1];
    panel.hidden = false;
    for (const button of buttons) button.setAttribute('aria-expanded', String(button.dataset.helpStep === step));
  };

  for (const button of buttons) {
    button.addEventListener('click', () => {
      const step = button.dataset.helpStep;
      if (openStep === step) close();
      else open(step);
    });
  }
}

async function initialize() {
  try {
    const appUrl = new URL('../h-earth/terrain-estate-construction-v1/app.mjs', import.meta.url);
    const rendererUrl = new URL('../h-earth/terrain-estate-construction-v1/renderer.mjs', import.meta.url);
    const celestialUrl = new URL('./celestial-checkpoint-1.mjs', import.meta.url);

    const [rendererOriginal, appOriginal, celestialOriginal] = await Promise.all([
      fetchText(rendererUrl),
      fetchText(appUrl),
      fetchText(celestialUrl)
    ]);

    const rendererSource = transformRenderer(rendererOriginal, rendererUrl);
    const rendererBlobUrl = URL.createObjectURL(new Blob([rendererSource], { type: 'text/javascript' }));
    const appSource = transformApp(appOriginal, appUrl, rendererBlobUrl);
    const appBlobUrl = URL.createObjectURL(new Blob([appSource], { type: 'text/javascript' }));
    const celestialSource = transformCelestial(celestialOriginal);
    const celestialBlobUrl = URL.createObjectURL(new Blob([celestialSource], { type: 'text/javascript' }));

    wireHelpAccordion();
    await import(appBlobUrl);
    await import(celestialBlobUrl);

    window.__AUDRALIA_SURFACE_HORIZON_TRAVERSAL__ = Object.freeze({
      schema: SCHEMA,
      baseHead: '798d3b034ed9814574e5cbe189ef280eb857602e',
      cameraPositionAuthority: 'SURFACE_RELATIVE_CLEARANCE',
      cameraOrientationAuthority: 'INDEPENDENT_YAW_AND_LOOK_ELEVATION',
      minimumSurfaceClearanceAuthoringUnits: 4,
      maximumSurfaceClearanceAuthoringUnits: 5600,
      lookElevationRangeRadians: Object.freeze([-1.45, 0.80]),
      offshoreResetAnchor: Object.freeze({ u: -266, v: 369 }),
      cloudShaderMutated: false,
      cloudDensityMutated: false,
      cloudRenderTargetMutated: false,
      additionalCanvasCreatedByTraversal: false,
      canonicalGeographyMutated: false,
      runtimeSourceTransformDiagnostic: true,
      finalIntegrationRequiredAfterAcceptance: true
    });
  } catch (error) {
    setFailure('BOOTSTRAP', error);
  }
}

initialize();
