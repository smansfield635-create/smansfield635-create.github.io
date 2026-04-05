DESTINATION: /assets/instruments.js
// /assets/instruments.js
// MODE: CONTRACT RENEWAL
// CONTRACT: INSTRUMENT_RUNTIME_ALIGNMENT_CONTRACT_G4
// STATUS: DIAGNOSTICS-ONLY | RUNTIME-ALIGNED | NON-DRIFT
// OWNER: SEAN

const INSTRUMENT_META=Object.freeze({
  name:"instruments",
  version:"G4",
  contract:"INSTRUMENT_RUNTIME_ALIGNMENT_CONTRACT_G4",
  role:"observation_only",
  deterministic:true,
  sourceOfTruth:false,
  mutatesState:false,
  platformOwned:true
});

function deepFreeze(value){
  if(value===null||typeof value!=="object"||Object.isFrozen(value)) return value;
  Object.getOwnPropertyNames(value).forEach((key)=>deepFreeze(value[key]));
  return Object.freeze(value);
}
function normalizeObject(value){return value&&typeof value==="object"&&!Array.isArray(value)?value:{}}
function normalizeString(value,fallback="—"){
  if(typeof value!=="string") return fallback;
  const trimmed=value.trim();
  return trimmed.length>0?trimmed:fallback;
}
function normalizeNumber(value,fallback=null){return Number.isFinite(value)?value:fallback}
function normalizeBoolean(value,fallback=null){return typeof value==="boolean"?value:fallback}
function stableRound(value,places=3){
  if(!Number.isFinite(value)) return null;
  const factor=10**places;
  return Math.round(value*factor)/factor;
}
function stringifyValue(value){
  if(value===null||value===undefined) return "—";
  if(typeof value==="number") return Number.isFinite(value)?String(value):"—";
  if(typeof value==="boolean") return value?"true":"false";
  if(typeof value==="string") return value.trim().length>0?value:"—";
  return "—";
}
function escapeHtml(value){
  return String(value)
    .replaceAll("&","&amp;")
    .replaceAll("<","&lt;")
    .replaceAll(">","&gt;")
    .replaceAll('"',"&quot;")
    .replaceAll("'","&#39;");
}

function normalizeProjectionState(runtime){
  const projection=normalizeString(runtime?.projectionState,"flat").toLowerCase();
  if(projection==="tree") return "tree";
  if(projection==="globe") return "globe";
  if(projection==="macro-universe-flat") return "macro-universe-flat";
  return "flat";
}

function normalizeProjectionKind(render){
  const kind=normalizeString(render?.projection?.selectedProjection?.kind,"flat").toLowerCase();
  if(kind==="tree") return "tree";
  if(kind==="globe") return "globe";
  if(kind==="macro-universe-flat") return "macro-universe-flat";
  return "flat";
}

function normalizeSceneClass(runtime,render){
  const candidates=[runtime?.sceneClass,render?.sceneClass,render?.scene?.class];
  for(let i=0;i<candidates.length;i+=1){
    const value=normalizeString(candidates[i],"");
    if(value!=="") return value.toUpperCase();
  }
  return "UNSPECIFIED";
}

function normalizeUniverseMode(runtime,render){
  const candidates=[runtime?.universeMode,render?.scene?.mode,render?.filters?.mode];
  for(let i=0;i<candidates.length;i+=1){
    const value=normalizeString(candidates[i],"");
    if(value!=="") return value.toUpperCase();
  }
  return "UNSPECIFIED";
}

function normalizeJsStamp(runtime,render){
  const candidates=[runtime?.jsStamp,render?.jsStamp,render?.diagnostics?.scene?.signature];
  for(let i=0;i<candidates.length;i+=1){
    const value=normalizeString(candidates[i],"");
    if(value!=="") return value;
  }
  return "—";
}

function normalizeHtmlStamp(runtime,render){
  const candidates=[runtime?.htmlStamp,render?.htmlStamp];
  for(let i=0;i<candidates.length;i+=1){
    const value=normalizeString(candidates[i],"");
    if(value!=="") return value;
  }
  return "—";
}

function normalizePrimarySystemCount(runtime,render){
  const candidates=[
    runtime?.primarySystemCount,
    render?.primarySystemCount,
    render?.scene?.primarySystems?.length
  ];
  for(let i=0;i<candidates.length;i+=1){
    if(Number.isFinite(candidates[i])) return candidates[i];
  }
  return null;
}

function normalizePrimaryProminence(runtime,render){
  const candidates=[runtime?.primaryProminence,render?.primaryProminence,render?.diagnostics?.metrics?.primaryProminence];
  for(let i=0;i<candidates.length;i+=1){
    const value=stableRound(normalizeNumber(candidates[i]),3);
    if(value!==null) return value;
  }
  return null;
}

function normalizeGalaxyBandState(runtime,render){
  const candidates=[runtime?.galaxyBandState,render?.galaxyBandState,render?.diagnostics?.metrics?.galaxyBandState];
  for(let i=0;i<candidates.length;i+=1){
    const value=normalizeString(candidates[i],"");
    if(value!=="") return value.toUpperCase();
  }
  return "UNSPECIFIED";
}

function normalizeCanvasAuthority(runtime,render){
  const candidates=[runtime?.canvasAuthority,render?.canvasAuthority];
  for(let i=0;i<candidates.length;i+=1){
    const value=normalizeString(candidates[i],"");
    if(value!=="") return value.toUpperCase();
  }
  return "UNSPECIFIED";
}

function normalizeCanvasActive(runtime,render){
  const candidates=[runtime?.canvasActive,render?.canvasActive];
  for(let i=0;i<candidates.length;i+=1){
    const value=normalizeBoolean(candidates[i],null);
    if(value!==null) return value;
  }
  return null;
}

function normalizeCssFallbackActive(runtime,render){
  const candidates=[runtime?.cssFallbackActive,render?.cssFallbackActive];
  for(let i=0;i<candidates.length;i+=1){
    const value=normalizeBoolean(candidates[i],null);
    if(value!==null) return value;
  }
  return null;
}

function normalizeControlRenderAlignment(runtime,render){
  return normalizeProjectionState(runtime)===normalizeProjectionKind(render)?"ALIGNED":"DESYNC";
}

function classifyState({runtime,render}){
  const receipt=normalizeString(runtime?.receipt?.timestamp,"—");
  const canvasActive=normalizeCanvasActive(runtime,render);
  const alignment=normalizeControlRenderAlignment(runtime,render);
  if(receipt==="—") return "PENDING";
  if(alignment!=="ALIGNED") return "DESYNC";
  if(canvasActive===false) return "FALLBACK";
  if(normalizePrimarySystemCount(runtime,render)===9) return "LIVE";
  return "ACTIVE";
}

function buildSummary({runtime,render,classifiedState}){
  const sceneClass=normalizeSceneClass(runtime,render);
  const universeMode=normalizeUniverseMode(runtime,render);
  const primarySystemCount=stringifyValue(normalizePrimarySystemCount(runtime,render));
  const jsStamp=normalizeJsStamp(runtime,render);
  return deepFreeze({
    state:classifiedState,
    node:normalizeString(runtime?.node?.label),
    region:normalizeString(runtime?.region?.label),
    sceneClass,
    universeMode,
    primarySystemCount,
    runtimeProjection:normalizeProjectionState(runtime),
    renderProjection:normalizeProjectionKind(render),
    jsStamp,
    line:[
      `STATE=${classifiedState}`,
      `SCENE=${sceneClass}`,
      `MODE=${universeMode}`,
      `SYSTEMS=${primarySystemCount}`,
      `JS=${jsStamp}`
    ].join(" | ")
  });
}

function buildDiagnostics({runtime,render}){
  const colorOutput=normalizeObject(render?.visible?.colorOutput);
  return deepFreeze({
    traversal:normalizeString(runtime?.traversalStatus?.action),
    receipt:normalizeString(runtime?.receipt?.timestamp),
    hue:stableRound(normalizeNumber(colorOutput.hue),3),
    saturation:stableRound(normalizeNumber(colorOutput.saturation),3),
    value:stableRound(normalizeNumber(colorOutput.value),3),
    jsStamp:normalizeJsStamp(runtime,render),
    htmlStamp:normalizeHtmlStamp(runtime,render),
    sceneClass:normalizeSceneClass(runtime,render),
    universeMode:normalizeUniverseMode(runtime,render),
    canvasAuthority:normalizeCanvasAuthority(runtime,render),
    canvasActive:normalizeCanvasActive(runtime,render),
    cssFallbackActive:normalizeCssFallbackActive(runtime,render),
    primarySystemCount:normalizePrimarySystemCount(runtime,render),
    primaryProminence:normalizePrimaryProminence(runtime,render),
    galaxyBandState:normalizeGalaxyBandState(runtime,render),
    controlRenderAlignment:normalizeControlRenderAlignment(runtime,render)
  });
}

function buildMeta({runtime,render}){
  return deepFreeze({
    runtime:deepFreeze({
      region:normalizeString(runtime?.region?.label),
      node:normalizeString(runtime?.node?.label),
      receipt:normalizeString(runtime?.receipt?.timestamp),
      projectionState:normalizeProjectionState(runtime),
      sceneClass:normalizeSceneClass(runtime,render),
      universeMode:normalizeUniverseMode(runtime,render),
      jsStamp:normalizeJsStamp(runtime,render),
      htmlStamp:normalizeHtmlStamp(runtime,render),
      canvasAuthority:normalizeCanvasAuthority(runtime,render),
      canvasActive:normalizeCanvasActive(runtime,render),
      cssFallbackActive:normalizeCssFallbackActive(runtime,render),
      primarySystemCount:normalizePrimarySystemCount(runtime,render),
      primaryProminence:normalizePrimaryProminence(runtime,render),
      galaxyBandState:normalizeGalaxyBandState(runtime,render),
      controlRenderAlignment:normalizeControlRenderAlignment(runtime,render)
    }),
    render:deepFreeze({
      projectionKind:normalizeProjectionKind(render),
      sceneClass:normalizeSceneClass(runtime,render),
      universeMode:normalizeUniverseMode(runtime,render),
      jsStamp:normalizeJsStamp(runtime,render),
      htmlStamp:normalizeHtmlStamp(runtime,render),
      canvasAuthority:normalizeCanvasAuthority(runtime,render),
      canvasActive:normalizeCanvasActive(runtime,render),
      cssFallbackActive:normalizeCssFallbackActive(runtime,render),
      primarySystemCount:normalizePrimarySystemCount(runtime,render),
      primaryProminence:normalizePrimaryProminence(runtime,render),
      galaxyBandState:normalizeGalaxyBandState(runtime,render),
      controlRenderAlignment:normalizeControlRenderAlignment(runtime,render)
    })
  });
}

export function buildInstrumentReceipt({runtimeState=null,renderState=null}={}){
  const runtime=normalizeObject(runtimeState);
  const render=normalizeObject(renderState);
  const classifiedState=classifyState({runtime,render});
  const summary=buildSummary({runtime,render,classifiedState});
  const diagnostics=buildDiagnostics({runtime,render});
  const meta=buildMeta({runtime,render});

  return deepFreeze({
    classifiedState,
    displayPayload:deepFreeze({
      summary,
      lines:deepFreeze([
        summary.line,
        `NODE=${stringifyValue(summary.node)} | REGION=${stringifyValue(summary.region)}`,
        `CANVAS=${stringifyValue(diagnostics.canvasActive)} | CSS_FALLBACK=${stringifyValue(diagnostics.cssFallbackActive)} | AUTHORITY=${stringifyValue(diagnostics.canvasAuthority)}`,
        `ALIGNMENT=${stringifyValue(diagnostics.controlRenderAlignment)} | BAND=${stringifyValue(diagnostics.galaxyBandState)} | PROMINENCE=${stringifyValue(diagnostics.primaryProminence)}`,
        `JS=${stringifyValue(diagnostics.jsStamp)} | HTML=${stringifyValue(diagnostics.htmlStamp)}`
      ])
    }),
    diagnosticsPayload:diagnostics,
    meta
  });
}

export function renderPanelHTML(packet=null){
  const instrument=normalizeObject(packet);
  const summary=normalizeObject(instrument?.displayPayload?.summary);
  const diagnostics=normalizeObject(instrument?.diagnosticsPayload);

  return `
    <section data-panel="instruments">
      <div><b>STATE:</b> ${escapeHtml(stringifyValue(instrument.classifiedState))}</div>
      <div><b>SCENE:</b> ${escapeHtml(stringifyValue(summary.sceneClass))}</div>
      <div><b>MODE:</b> ${escapeHtml(stringifyValue(summary.universeMode))}</div>
      <div><b>SYSTEMS:</b> ${escapeHtml(stringifyValue(summary.primarySystemCount))}</div>
      <div><b>NODE:</b> ${escapeHtml(stringifyValue(summary.node))}</div>
      <div><b>REGION:</b> ${escapeHtml(stringifyValue(summary.region))}</div>
      <div><b>RUNTIME PROJECTION:</b> ${escapeHtml(stringifyValue(summary.runtimeProjection))}</div>
      <div><b>RENDER PROJECTION:</b> ${escapeHtml(stringifyValue(summary.renderProjection))}</div>
      <div><b>ALIGNMENT:</b> ${escapeHtml(stringifyValue(diagnostics.controlRenderAlignment))}</div>
      <div><b>CANVAS ACTIVE:</b> ${escapeHtml(stringifyValue(diagnostics.canvasActive))}</div>
      <div><b>CSS FALLBACK:</b> ${escapeHtml(stringifyValue(diagnostics.cssFallbackActive))}</div>
      <div><b>AUTHORITY:</b> ${escapeHtml(stringifyValue(diagnostics.canvasAuthority))}</div>
      <div><b>PRIMARY PROMINENCE:</b> ${escapeHtml(stringifyValue(diagnostics.primaryProminence))}</div>
      <div><b>GALAXY BAND:</b> ${escapeHtml(stringifyValue(diagnostics.galaxyBandState))}</div>
      <div><b>TRAVERSAL:</b> ${escapeHtml(stringifyValue(diagnostics.traversal))}</div>
      <div><b>RECEIPT:</b> ${escapeHtml(stringifyValue(diagnostics.receipt))}</div>
      <div><b>JS STAMP:</b> ${escapeHtml(stringifyValue(diagnostics.jsStamp))}</div>
      <div><b>HTML STAMP:</b> ${escapeHtml(stringifyValue(diagnostics.htmlStamp))}</div>
    </section>
  `.trim();
}

export function renderPanelText(packet=null){
  const instrument=normalizeObject(packet);
  const summary=normalizeObject(instrument?.displayPayload?.summary);
  const diagnostics=normalizeObject(instrument?.diagnosticsPayload);

  return [
    `STATE=${stringifyValue(instrument.classifiedState)}`,
    `SCENE=${stringifyValue(summary.sceneClass)}`,
    `MODE=${stringifyValue(summary.universeMode)}`,
    `SYSTEMS=${stringifyValue(summary.primarySystemCount)}`,
    `NODE=${stringifyValue(summary.node)}`,
    `REGION=${stringifyValue(summary.region)}`,
    `RUNTIME_PROJECTION=${stringifyValue(summary.runtimeProjection)}`,
    `RENDER_PROJECTION=${stringifyValue(summary.renderProjection)}`,
    `ALIGNMENT=${stringifyValue(diagnostics.controlRenderAlignment)}`,
    `CANVAS_ACTIVE=${stringifyValue(diagnostics.canvasActive)}`,
    `CSS_FALLBACK=${stringifyValue(diagnostics.cssFallbackActive)}`,
    `CANVAS_AUTHORITY=${stringifyValue(diagnostics.canvasAuthority)}`,
    `PRIMARY_PROMINENCE=${stringifyValue(diagnostics.primaryProminence)}`,
    `GALAXY_BAND=${stringifyValue(diagnostics.galaxyBandState)}`,
    `JS_STAMP=${stringifyValue(diagnostics.jsStamp)}`,
    `HTML_STAMP=${stringifyValue(diagnostics.htmlStamp)}`
  ].join("\n");
}

export function createInstruments(){
  let last=null;
  return deepFreeze({
    meta:INSTRUMENT_META,
    update({runtimeState=null,renderState=null}={}){
      last=buildInstrumentReceipt({runtimeState,renderState});
      return last;
    },
    read(){return last},
    dispose(){last=null},
    buildInstrumentReceipt,
    renderPanelHTML,
    renderPanelText
  });
}

const DEFAULT=createInstruments();
export const meta=DEFAULT.meta;
export default DEFAULT;
