// /assets/world_ui.js
// MODE: WORLD UI CONTRACT RENEWAL
// STATUS: UI SHELL AUTHORITY v2
// ROLE:
// - mount world-facing UI shell only
// - no render authority
// - no diagnostics authority
// - no truth mutation
// - support current round / flat / observe modes
// - keep UI under-expressed but structurally complete
// - remain compatible with /assets/ui.css and /assets/instruments.js

const INLINE_STYLE_ID = "world-ui-inline-style-v2";

function ensureInlineWorldUiStyle() {
  if (document.getElementById(INLINE_STYLE_ID)) return;

  const style = document.createElement("style");
  style.id = INLINE_STYLE_ID;
  style.textContent = `
html,body{
  margin:0;
  width:100%;
  height:100%;
  overflow:hidden;
  background:#030712;
  color:#fff;
  font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif;
}
body::before,body::after{pointer-events:none!important}

:root{
  --ink:rgba(255,255,255,.96);
  --mut:rgba(255,255,255,.84);
  --mut2:rgba(255,255,255,.68);
  --stroke:rgba(255,255,255,.12);
  --shadowA:0 18px 52px rgba(0,0,0,.30);
  --shadowB:0 24px 90px rgba(0,0,0,.42);
  --gold:rgba(226,191,92,.92);
  --panel:rgba(8,12,20,.38);
  --heroDim:1;
  --uiAlpha:1;
  --shellAtmosAlpha:.82;
  --starAlpha:1;
  --overlayAlpha:1;
  --flatAlpha:0;
  --heroShiftY:0px;
  --heroScale:1;
}

#app-shell{
  position:fixed;
  inset:0;
  overflow:hidden;
  isolation:isolate;
  background:
    radial-gradient(circle at 50% 42%, rgba(44,92,164,.08), transparent 34%),
    linear-gradient(180deg, #030712 0%, #071225 52%, #08101f 100%);
}

#world-canvas{
  position:fixed;
  inset:0;
  width:100%;
  height:100%;
  display:block;
  z-index:1;
  touch-action:none;
}

#runtime-root{
  position:fixed;
  inset:0;
  z-index:2;
  pointer-events:none;
}

#universe-layer,
#atmosphere-layer,
#hero-layer,
#flat-layer,
#orbital-overlay{
  position:fixed;
  inset:0;
}

#universe-layer{
  z-index:2;
  pointer-events:none;
  overflow:hidden;
  transition:opacity 220ms ease, filter 220ms ease, transform 220ms ease;
  opacity:var(--starAlpha);
}
.star-band{
  position:absolute;
  inset:-10%;
  opacity:.34;
  mix-blend-mode:screen;
  animation:starDrift 44s linear infinite;
}
.star-band.near{
  opacity:.48;
  animation-duration:26s;
}
.star-band.far{
  opacity:.16;
  animation-duration:70s;
}
.star-band::before,
.star-band::after{
  content:"";
  position:absolute;
  inset:0;
  background-repeat:repeat;
  background-size:320px 320px;
  filter:blur(.15px);
}
.star-band::before{
  background-image:
    radial-gradient(circle at 20px 24px, rgba(255,255,255,.96) 0 .9px, transparent 1.6px),
    radial-gradient(circle at 118px 78px, rgba(255,255,255,.60) 0 .8px, transparent 1.5px),
    radial-gradient(circle at 242px 194px, rgba(255,255,255,.82) 0 1px, transparent 1.7px),
    radial-gradient(circle at 286px 42px, rgba(255,255,255,.42) 0 .7px, transparent 1.3px),
    radial-gradient(circle at 68px 214px, rgba(255,255,255,.68) 0 .8px, transparent 1.4px),
    radial-gradient(circle at 168px 262px, rgba(255,255,255,.50) 0 .7px, transparent 1.4px);
}
.star-band::after{
  background-image:
    radial-gradient(circle at 78px 48px, rgba(120,180,255,.18) 0 1px, transparent 2px),
    radial-gradient(circle at 204px 158px, rgba(255,215,120,.16) 0 1.1px, transparent 2px),
    radial-gradient(circle at 300px 258px, rgba(180,140,255,.12) 0 1px, transparent 1.8px);
  filter:blur(.55px);
}

#atmosphere-layer{
  z-index:3;
  pointer-events:none;
  overflow:hidden;
  transition:opacity 220ms ease, transform 220ms ease;
  opacity:var(--shellAtmosAlpha);
}
.atmo-glow{
  position:absolute;
  left:50%;
  top:58%;
  width:min(92vw,1040px);
  height:min(92vw,1040px);
  transform:translate(-50%,-50%);
  border-radius:50%;
  background:
    radial-gradient(circle at 50% 50%, rgba(108,162,236,.10), transparent 34%),
    radial-gradient(circle at 50% 56%, rgba(255,255,255,.03), transparent 56%),
    radial-gradient(circle at 50% 50%, rgba(30,90,170,.07), transparent 70%);
  filter:blur(12px);
  animation:glowPulse 8s ease-in-out infinite;
}
.mist-veil{
  position:absolute;
  left:0;
  right:0;
  bottom:-4%;
  height:40%;
  background:
    linear-gradient(
      to bottom,
      transparent 0%,
      rgba(130,190,255,.04) 18%,
      rgba(170,220,255,.07) 54%,
      rgba(255,255,255,.02) 100%
    );
  mask-image:linear-gradient(to bottom, transparent 0%, rgba(0,0,0,.25) 18%, rgba(0,0,0,.95) 84%, transparent 100%);
  -webkit-mask-image:linear-gradient(to bottom, transparent 0%, rgba(0,0,0,.25) 18%, rgba(0,0,0,.95) 84%, transparent 100%);
  opacity:.18;
  transform:translateY(8%);
  animation:veilDrift 9s ease-in-out infinite;
}

#hero-layer{
  z-index:8;
  pointer-events:none;
  transition:opacity 180ms ease, transform 180ms ease;
  opacity:var(--heroDim);
}
.hero-panel{
  position:absolute;
  left:50%;
  top:12.8vh;
  transform:translateX(-50%) translateY(var(--heroShiftY)) scale(var(--heroScale));
  width:min(92vw,980px);
  display:flex;
  flex-direction:column;
  align-items:center;
  gap:12px;
  text-align:center;
}
.hero-title{
  margin:0;
  font-size:clamp(42px,7vw,96px);
  font-weight:950;
  letter-spacing:.05em;
  line-height:.9;
  text-shadow:0 10px 30px rgba(0,0,0,.54);
}
.hero-sub{
  margin:0;
  font-size:clamp(18px,2.2vw,26px);
  color:rgba(255,255,255,.90);
}
.hero-tag{
  margin:0;
  font-size:clamp(13px,1.5vw,16px);
  color:rgba(255,255,255,.64);
  letter-spacing:.02em;
}

#flat-layer{
  z-index:9;
  display:flex;
  align-items:center;
  justify-content:center;
  pointer-events:none;
  opacity:var(--flatAlpha);
  transition:opacity 180ms ease, transform 180ms ease;
}
.flat-menu{
  width:min(92vw,720px);
  display:grid;
  grid-template-columns:repeat(2,minmax(0,1fr));
  gap:18px;
  pointer-events:auto;
}
.flat-card{
  position:relative;
  min-height:132px;
  border-radius:28px;
  border:1px solid rgba(255,255,255,.16);
  background:
    radial-gradient(circle at 22% 18%, rgba(255,255,255,.12), transparent 22%),
    linear-gradient(145deg, rgba(10,14,22,.88), rgba(5,8,12,.96));
  box-shadow:
    0 18px 48px rgba(0,0,0,.32),
    inset 0 0 18px rgba(255,255,255,.03);
  display:flex;
  align-items:center;
  justify-content:center;
  text-align:center;
  font-weight:900;
  font-size:clamp(18px,2.2vw,24px);
  letter-spacing:.06em;
  cursor:pointer;
  overflow:hidden;
  transition:transform .18s ease, border-color .18s ease, background .18s ease, opacity .18s ease;
}
.flat-card:hover{
  transform:translateY(-2px);
  border-color:rgba(255,255,255,.24);
}
.flat-card::before{
  content:"";
  position:absolute;
  left:50%;
  top:50%;
  width:86px;
  height:86px;
  margin:-43px 0 0 -43px;
  transform:rotate(45deg);
  border-radius:14px;
  border:1px solid rgba(255,255,255,.10);
  box-shadow:inset 0 0 12px rgba(255,255,255,.05);
}

.top-ui{
  position:absolute;
  inset:0 0 auto 0;
  z-index:16;
  pointer-events:none;
  opacity:var(--uiAlpha);
  transition:opacity 180ms ease, transform 180ms ease;
}
.top-ui-row{
  width:100%;
  display:flex;
  justify-content:center;
  pointer-events:none;
}
.top-ui-row--home{
  position:absolute;
  top:12px;
  left:0;
  right:0;
}
.top-ui-row--modes{
  position:absolute;
  top:12px;
  right:12px;
  left:auto;
  width:auto;
}

.home-pill{
  min-width:132px;
  padding:7px 16px;
  border-radius:999px;
  border:1px solid rgba(255,255,255,.09);
  background:rgba(0,0,0,.18);
  box-shadow:0 12px 28px rgba(0,0,0,.18);
  backdrop-filter:blur(8px);
  color:rgba(255,255,255,.92);
  font-size:11px;
  font-weight:900;
  letter-spacing:.12em;
  text-transform:uppercase;
  text-align:center;
  pointer-events:none;
}

.mode-cluster{
  display:flex;
  gap:8px;
  pointer-events:auto;
}
.mode-btn{
  min-height:42px;
  padding:0 16px;
  border-radius:999px;
  border:1px solid rgba(255,255,255,.12);
  background:rgba(10,12,20,.32);
  box-shadow:0 14px 34px rgba(0,0,0,.24);
  backdrop-filter:blur(8px);
  color:rgba(255,255,255,.92);
  font-size:12px;
  font-weight:900;
  letter-spacing:.06em;
  text-transform:uppercase;
  cursor:pointer;
}
.mode-btn:active{transform:translateY(1px)}
.mode-btn.is-active{
  border-color:rgba(226,191,92,.50);
  box-shadow:
    0 14px 34px rgba(0,0,0,.24),
    0 0 0 1px rgba(226,191,92,.10),
    0 0 16px rgba(226,191,92,.10);
  color:#fff5cf;
}

#orbital-overlay{
  z-index:12;
  pointer-events:none;
  transition:opacity 180ms ease, transform 180ms ease;
  opacity:var(--overlayAlpha);
}
.orbital-marker{
  position:absolute;
  left:0;
  top:0;
  width:132px;
  height:132px;
  transform:translate(-50%,-50%);
  border:0;
  background:transparent;
  padding:0;
  pointer-events:auto;
  cursor:pointer;
  touch-action:manipulation;
  -webkit-tap-highlight-color:transparent;
}
.orbital-marker[hidden]{display:none}

.orbital-core{
  position:absolute;
  left:50%;
  top:50%;
  width:88px;
  height:88px;
  transform:translate(-50%,-50%);
  border-radius:50%;
  background:
    radial-gradient(circle at 50% 50%, rgba(255,255,255,.06) 0 14%, rgba(255,255,255,0) 54%),
    radial-gradient(circle at 50% 50%, rgba(226,191,92,.18), rgba(226,191,92,.08) 28%, rgba(226,191,92,0) 58%);
  opacity:.94;
}
.orbital-core::before,
.orbital-core::after{
  content:"";
  position:absolute;
  left:50%;
  top:50%;
  transform:translate(-50%,-50%);
  border-radius:999px;
  background:linear-gradient(180deg, rgba(255,247,208,.88), rgba(255,228,142,.84), rgba(255,214,98,.22));
  box-shadow:
    0 0 16px rgba(255,225,140,.28),
    0 0 28px rgba(255,219,126,.14);
}
.orbital-core::before{
  width:10px;
  height:78px;
}
.orbital-core::after{
  width:78px;
  height:10px;
}
.orbital-diag-a,
.orbital-diag-b{
  position:absolute;
  left:50%;
  top:50%;
  width:70px;
  height:2px;
  transform-origin:center;
  background:linear-gradient(90deg, rgba(255,227,132,0), rgba(255,233,160,.76), rgba(255,227,132,0));
  opacity:.54;
}
.orbital-diag-a{transform:translate(-50%,-50%) rotate(45deg)}
.orbital-diag-b{transform:translate(-50%,-50%) rotate(-45deg)}
.orbital-glow{
  position:absolute;
  left:50%;
  top:50%;
  width:118px;
  height:118px;
  transform:translate(-50%,-50%);
  border-radius:50%;
  background:
    radial-gradient(circle at 50% 50%, rgba(255,227,132,.10), rgba(255,227,132,.05) 26%, rgba(255,227,132,0) 68%);
  filter:blur(8px);
  opacity:.84;
}
.orbital-code{
  position:absolute;
  left:50%;
  top:22px;
  transform:translateX(-50%);
  font-size:11px;
  font-weight:950;
  letter-spacing:.26em;
  color:rgba(255,246,214,.82);
  text-transform:uppercase;
  text-shadow:0 0 10px rgba(0,0,0,.50);
  white-space:nowrap;
}
.orbital-name{
  position:absolute;
  left:50%;
  top:50%;
  transform:translate(-50%,-50%);
  min-width:84px;
  padding:3px 10px;
  border-radius:999px;
  background:rgba(6,10,18,.18);
  color:rgba(255,255,255,.92);
  font-size:11px;
  font-weight:950;
  letter-spacing:.10em;
  text-transform:uppercase;
  text-align:center;
  text-shadow:0 0 10px rgba(0,0,0,.56);
  box-shadow:0 6px 20px rgba(0,0,0,.14);
  backdrop-filter:blur(6px);
}

.boot-status{
  position:fixed;
  left:50%;
  top:88px;
  transform:translateX(-50%);
  width:min(760px,92vw);
  z-index:40;
  display:none;
  padding:14px 16px;
  border-radius:18px;
  border:1px solid rgba(255,255,255,.14);
  background:rgba(14,18,28,.86);
  box-shadow:0 20px 60px rgba(0,0,0,.44);
  backdrop-filter:blur(10px);
  white-space:pre-wrap;
  line-height:1.45;
  font-size:13px;
  color:rgba(255,255,255,.90);
}
.boot-status.is-visible{display:block}

body[data-mode="round"]{
  --heroDim:1;
  --uiAlpha:1;
  --shellAtmosAlpha:.82;
  --starAlpha:1;
  --overlayAlpha:1;
  --flatAlpha:0;
  --heroShiftY:0px;
  --heroScale:1;
}
body[data-mode="flat"]{
  --heroDim:.86;
  --uiAlpha:1;
  --shellAtmosAlpha:.54;
  --starAlpha:.72;
  --overlayAlpha:0;
  --flatAlpha:1;
  --heroShiftY:-10px;
  --heroScale:.96;
}
body[data-mode="observe"]{
  --heroDim:.78;
  --uiAlpha:.88;
  --shellAtmosAlpha:.58;
  --starAlpha:.12;
  --overlayAlpha:0;
  --flatAlpha:0;
  --heroShiftY:-14px;
  --heroScale:.94;
}
body[data-mode="observe"] #orbital-overlay{
  opacity:0;
}

@keyframes starDrift{
  from{transform:translate3d(-1.5%,-1%,0)}
  to{transform:translate3d(1.5%,1%,0)}
}
@keyframes glowPulse{
  0%,100%{opacity:.82;transform:translate(-50%,-50%) scale(1)}
  50%{opacity:1;transform:translate(-50%,-50%) scale(1.04)}
}
@keyframes veilDrift{
  0%,100%{transform:translateY(8%);opacity:.18}
  50%{transform:translateY(2%);opacity:.28}
}

@media (max-width:700px){
  .top-ui-row--home{top:10px}
  .top-ui-row--modes{
    top:58px;
    left:0;
    right:0;
    width:100%;
    justify-content:center;
  }
  .mode-cluster{gap:6px}
  .mode-btn{
    min-height:38px;
    padding:0 12px;
    font-size:11px;
  }
  .home-pill{
    min-width:108px;
    padding:6px 12px;
    font-size:10px;
    letter-spacing:.10em;
  }
  .hero-panel{
    top:19.5vh;
    gap:12px;
  }
  .flat-menu{
    grid-template-columns:1fr;
    width:min(92vw,420px);
    gap:12px;
  }
  .flat-card{min-height:98px}
}

@media (max-width:420px){
  .hero-panel{top:21vh}
  .hero-title{font-size:clamp(34px,11vw,54px)}
  .hero-sub{font-size:clamp(16px,5.8vw,22px)}
  .hero-tag{font-size:clamp(12px,4vw,14px)}
  .mode-btn{
    padding:0 10px;
    min-height:36px;
    letter-spacing:.04em;
  }
}
  `;
  document.head.appendChild(style);
}

function normalizeObject(value) {
  return value && typeof value === "object" && !Array.isArray(value) ? value : {};
}

function normalizeString(value, fallback = "") {
  return typeof value === "string" && value.trim().length > 0 ? value.trim() : fallback;
}

function buildQueryString(extra = {}) {
  const current = new URLSearchParams(window.location.search);
  const next = new URLSearchParams();

  const lang = normalizeString(extra.lang, normalizeString(current.get("lang"), "en"));
  const style = normalizeString(extra.style, normalizeString(current.get("style"), "informal"));
  const time = normalizeString(extra.time, normalizeString(current.get("time"), "now"));
  const depth = normalizeString(extra.depth, normalizeString(current.get("depth"), "1"));
  const lane = normalizeString(extra.lane, normalizeString(current.get("lane"), ""));
  const mode = normalizeString(extra.mode, normalizeString(current.get("mode"), ""));

  next.set("lang", lang);
  next.set("style", style);
  next.set("time", time);
  next.set("depth", depth);

  if (lane === "platform" || lane === "engineering") {
    next.set("lane", lane);
  }

  if (mode.length > 0) {
    next.set("mode", mode);
  }

  return `?${next.toString()}`;
}

function routeTo(path, extra = {}) {
  window.location.href = `${path}${buildQueryString(extra)}`;
}

function createMarkerNode(id, code, label, route) {
  const button = document.createElement("button");
  button.className = "orbital-marker";
  button.id = id;
  button.type = "button";
  button.hidden = true;
  button.dataset.route = route;
  button.innerHTML = `
    <div class="orbital-glow"></div>
    <div class="orbital-core"></div>
    <div class="orbital-diag-a"></div>
    <div class="orbital-diag-b"></div>
    <div class="orbital-code">${code}</div>
    <div class="orbital-name">${label}</div>
  `;
  return button;
}

function applyModeToBody(nextMode) {
  const safeMode =
    nextMode === "flat" || nextMode === "observe" || nextMode === "round"
      ? nextMode
      : "round";

  document.body.setAttribute("data-mode", safeMode);
  return safeMode;
}

function applyActiveModeButton(nodes, mode) {
  const map = {
    flat: nodes.btnFlat,
    round: nodes.btnRound,
    observe: nodes.btnObserve
  };

  Object.values(map).forEach((node) => {
    if (!node) return;
    node.classList.remove("is-active");
  });

  if (map[mode]) {
    map[mode].classList.add("is-active");
  }
}

function wireFlatCards(flatLayer) {
  const cards = flatLayer.querySelectorAll("[data-route]");
  cards.forEach((node) => {
    node.addEventListener("click", () => {
      const route = normalizeString(node.dataset.route, "/");
      routeTo(route);
    });
  });
}

function wireOrbitalMarkers(overlayMap) {
  Object.values(overlayMap).forEach((node) => {
    if (!node) return;
    node.addEventListener("click", () => {
      const route = normalizeString(node.dataset.route, "/");
      routeTo(route);
    });
  });
}

function resolveBootTone(message) {
  const lower = normalizeString(message, "").toLowerCase();
  if (lower.includes("error") || lower.includes("failed") || lower.includes("timeout")) return "danger";
  if (lower.includes("running") || lower.includes("imported") || lower.includes("ok")) return "ok";
  return "warn";
}

export function createWorldUI(runtimeRoot) {
  ensureInlineWorldUiStyle();

  runtimeRoot.innerHTML = `
    <div id="universe-layer" aria-hidden="true">
      <div class="star-band far"></div>
      <div class="star-band"></div>
      <div class="star-band near"></div>
    </div>

    <div id="atmosphere-layer" aria-hidden="true">
      <div class="atmo-glow"></div>
      <div class="mist-veil"></div>
    </div>

    <div id="hero-layer">
      <div class="hero-panel" id="hero-panel">
        <h1 class="hero-title">NINE SUMMITS</h1>
        <p class="hero-sub">Learn to live, to love.</p>
        <p class="hero-tag">Enter simply. Discover power. Choose depth.</p>
      </div>
    </div>

    <div id="flat-layer">
      <div class="flat-menu">
        <button class="flat-card" data-route="/explore/" type="button">EXPLORE</button>
        <button class="flat-card" data-route="/products/" type="button">PRODUCTS</button>
        <button class="flat-card" data-route="/laws/" type="button">LAWS</button>
        <button class="flat-card" data-route="/gauges/" type="button">GAUGES</button>
      </div>
    </div>

    <div id="orbital-overlay" aria-label="Index markers"></div>

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
  `;

  const orbitalOverlay = runtimeRoot.querySelector("#orbital-overlay");
  orbitalOverlay.appendChild(createMarkerNode("marker-north", "N", "PRODUCTS", "/products/"));
  orbitalOverlay.appendChild(createMarkerNode("marker-east", "E", "GAUGES", "/gauges/"));
  orbitalOverlay.appendChild(createMarkerNode("marker-south", "S", "LAWS", "/laws/"));
  orbitalOverlay.appendChild(createMarkerNode("marker-west", "W", "EXPLORE", "/explore/"));

  const nodes = Object.freeze({
    universeLayer: runtimeRoot.querySelector("#universe-layer"),
    atmosphereLayer: runtimeRoot.querySelector("#atmosphere-layer"),
    heroLayer: runtimeRoot.querySelector("#hero-layer"),
    heroPanel: runtimeRoot.querySelector("#hero-panel"),
    flatLayer: runtimeRoot.querySelector("#flat-layer"),
    orbitalOverlay,
    modeCluster: runtimeRoot.querySelector("#mode-cluster"),
    homePill: runtimeRoot.querySelector("#home-pill"),
    btnFlat: runtimeRoot.querySelector("#btn-flat"),
    btnRound: runtimeRoot.querySelector("#btn-round"),
    btnObserve: runtimeRoot.querySelector("#btn-observe"),
    bootStatus: runtimeRoot.querySelector("#boot-status"),
    bootStatusCopy: runtimeRoot.querySelector("#boot-status-copy"),
    overlayMap: Object.freeze({
      "north-products": runtimeRoot.querySelector("#marker-north"),
      "east-gauges": runtimeRoot.querySelector("#marker-east"),
      "south-laws": runtimeRoot.querySelector("#marker-south"),
      "west-explore": runtimeRoot.querySelector("#marker-west")
    })
  });

  wireFlatCards(nodes.flatLayer);
  wireOrbitalMarkers(nodes.overlayMap);

  return Object.freeze({
    ...nodes,

    setMode(nextMode) {
      const mode = applyModeToBody(nextMode);
      applyActiveModeButton(nodes, mode);
      return mode;
    },

    syncModeFromDocument() {
      const mode = normalizeString(document.body.getAttribute("data-mode"), "round");
      const applied = applyModeToBody(mode);
      applyActiveModeButton(nodes, applied);
      return applied;
    },

    wireModeButtons(handler) {
      if (typeof handler !== "function") return;

      nodes.btnFlat?.addEventListener("click", () => handler("flat"));
      nodes.btnRound?.addEventListener("click", () => handler("round"));
      nodes.btnObserve?.addEventListener("click", () => handler("observe"));
    },

    setBootStatus(message, visible = true) {
      const text = normalizeString(message, "");
      nodes.bootStatusCopy.textContent = text;
      nodes.bootStatus.classList.toggle("is-visible", visible && text.length > 0);

      const tone = resolveBootTone(text);
      nodes.bootStatus.style.borderColor =
        tone === "danger"
          ? "rgba(255,120,120,.34)"
          : tone === "ok"
            ? "rgba(130,220,170,.30)"
            : "rgba(255,220,120,.26)";
    },

    hideBootStatus() {
      nodes.bootStatus.classList.remove("is-visible");
      nodes.bootStatusCopy.textContent = "";
    }
  });
}
