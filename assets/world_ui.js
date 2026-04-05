DESTINATION: /assets/world_ui.js
// /assets/world_ui.js
// MODE: WORLD UI CONTRACT RENEWAL
// STATUS: UI SHELL AUTHORITY v4 | STRUCTURAL ONLY | NON-DRIFT
// OWNER: SEAN

function normalizeObject(value){return value&&typeof value==="object"&&!Array.isArray(value)?value:{}}
function normalizeString(value,fallback=""){return typeof value==="string"&&value.trim().length>0?value.trim():fallback}
function resolveMode(value){
  const mode=normalizeString(value,"round").toLowerCase();
  return mode==="flat"||mode==="observe"||mode==="round"?mode:"round";
}

function buildQueryString(extra={}){
  const current=new URLSearchParams(window.location.search);
  const next=new URLSearchParams();
  const lang=normalizeString(extra.lang,normalizeString(current.get("lang"),"en"));
  const style=normalizeString(extra.style,normalizeString(current.get("style"),"informal"));
  const time=normalizeString(extra.time,normalizeString(current.get("time"),"now"));
  const depth=normalizeString(extra.depth,normalizeString(current.get("depth"),"1"));
  const lane=normalizeString(extra.lane,normalizeString(current.get("lane"),""));
  const mode=normalizeString(extra.mode,normalizeString(current.get("mode"),""));
  next.set("lang",lang);
  next.set("style",style);
  next.set("time",time);
  next.set("depth",depth);
  if(lane==="platform"||lane==="engineering") next.set("lane",lane);
  if(mode.length>0) next.set("mode",mode);
  return `?${next.toString()}`;
}

function routeTo(path,extra={}){
  window.location.href=`${path}${buildQueryString(extra)}`;
}

function applyModeToBody(nextMode){
  const safeMode=resolveMode(nextMode);
  document.body.setAttribute("data-mode",safeMode);
  return safeMode;
}

function applyActiveModeButton(nodes,mode){
  const map={flat:nodes.btnFlat,round:nodes.btnRound,observe:nodes.btnObserve};
  Object.values(map).forEach((node)=>{if(node)node.classList.remove("is-active")});
  if(map[mode]) map[mode].classList.add("is-active");
}

function resolveBootTone(message){
  const lower=normalizeString(message,"").toLowerCase();
  if(lower.includes("error")||lower.includes("failed")||lower.includes("timeout")) return "danger";
  if(lower.includes("running")||lower.includes("imported")||lower.includes("ok")) return "ok";
  return "warn";
}

function setBootTone(node,tone){
  if(!node) return;
  node.style.borderColor=
    tone==="danger"?"rgba(255,120,120,.34)":
    tone==="ok"?"rgba(130,220,170,.30)":
    "rgba(255,220,120,.26)";
}

function buildShellMarkup(){
  return `
    <div id="universe-overlay-root" class="universe-overlay-root" aria-hidden="true"></div>

    <div class="top-ui">
      <div class="top-ui-row top-ui-row--home">
        <div class="home-pill" id="home-pill">HOME</div>
      </div>
      <div class="top-ui-row top-ui-row--modes">
        <div class="mode-cluster" id="mode-cluster">
          <button id="btn-flat" class="mode-btn" type="button">FLAT</button>
          <button id="btn-round" class="mode-btn" type="button">ROUND</button>
          <button id="btn-observe" class="mode-btn" type="button">OBSERVE</button>
        </div>
      </div>
    </div>

    <div id="boot-status" class="boot-status" aria-live="polite">
      <div id="boot-status-copy"></div>
    </div>
  `.trim();
}

export function createWorldUI(runtimeRoot,options={}){
  const root=runtimeRoot instanceof HTMLElement?runtimeRoot:document.getElementById("runtime-root");
  if(!root) throw new Error("WORLD_UI_REQUIRES_RUNTIME_ROOT");

  const opts=normalizeObject(options);
  root.innerHTML=buildShellMarkup();

  const nodes=Object.freeze({
    runtimeRoot:root,
    universeOverlayRoot:root.querySelector("#universe-overlay-root"),
    modeCluster:root.querySelector("#mode-cluster"),
    homePill:root.querySelector("#home-pill"),
    btnFlat:root.querySelector("#btn-flat"),
    btnRound:root.querySelector("#btn-round"),
    btnObserve:root.querySelector("#btn-observe"),
    bootStatus:root.querySelector("#boot-status"),
    bootStatusCopy:root.querySelector("#boot-status-copy")
  });

  function setMode(nextMode){
    const mode=applyModeToBody(nextMode);
    applyActiveModeButton(nodes,mode);
    return mode;
  }

  function syncModeFromDocument(){
    const mode=resolveMode(document.body.getAttribute("data-mode"));
    return setMode(mode);
  }

  function wireModeButtons(handler){
    if(typeof handler!=="function") return;
    nodes.btnFlat?.addEventListener("click",()=>handler("flat"));
    nodes.btnRound?.addEventListener("click",()=>handler("round"));
    nodes.btnObserve?.addEventListener("click",()=>handler("observe"));
  }

  function setBootStatus(message,visible=true){
    const text=normalizeString(message,"");
    if(nodes.bootStatusCopy) nodes.bootStatusCopy.textContent=text;
    if(nodes.bootStatus){
      nodes.bootStatus.classList.toggle("is-visible",visible&&text.length>0);
      setBootTone(nodes.bootStatus,resolveBootTone(text));
    }
  }

  function hideBootStatus(){
    if(nodes.bootStatus) nodes.bootStatus.classList.remove("is-visible");
    if(nodes.bootStatusCopy) nodes.bootStatusCopy.textContent="";
  }

  function setHomeLabel(label="HOME"){
    if(!nodes.homePill) return "HOME";
    const next=normalizeString(label,"HOME").toUpperCase();
    nodes.homePill.textContent=next;
    return next;
  }

  function routeHome(){
    routeTo("/");
  }

  function wireHome(handler){
    if(nodes.homePill){
      nodes.homePill.style.pointerEvents="auto";
      nodes.homePill.style.cursor="pointer";
      nodes.homePill.addEventListener("click",()=>{
        if(typeof handler==="function") handler();
        else routeHome();
      });
    }
  }

  function read(){
    return Object.freeze({
      mode:resolveMode(document.body.getAttribute("data-mode")),
      bootStatusVisible:!!nodes.bootStatus?.classList.contains("is-visible"),
      homeLabel:normalizeString(nodes.homePill?.textContent,"HOME"),
      hasUniverseOverlayRoot:!!nodes.universeOverlayRoot
    });
  }

  setMode(resolveMode(opts.initialMode||document.body.getAttribute("data-mode")));
  setHomeLabel(normalizeString(opts.homeLabel,"HOME"));
  wireHome(opts.onHome);

  return Object.freeze({
    ...nodes,
    setMode,
    syncModeFromDocument,
    wireModeButtons,
    setBootStatus,
    hideBootStatus,
    setHomeLabel,
    routeHome,
    wireHome,
    read
  });
}

export default Object.freeze({createWorldUI});
