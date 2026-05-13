// /assets/showroom.globe.controls.js
// TNT NEW FILE
// SHOWROOM_GLOBE_CONTROLS_PANEL_TNT_v1
// Owns: small public control panel for runtime behavior.
// Does not own: planet material, geography, private engines.

export const GLOBE_CONTROLS_VERSION = "showroom-globe-controls-panel-v1";

function installStyle() {
  if (document.getElementById("dgb-globe-controls-style")) return;

  const style = document.createElement("style");
  style.id = "dgb-globe-controls-style";
  style.textContent = `
    .dgb-globe-controls{
      position:absolute;
      left:clamp(.8rem,3vw,1.5rem);
      right:clamp(.8rem,3vw,1.5rem);
      top:clamp(.8rem,3vw,1.4rem);
      z-index:5;
      display:flex;
      flex-wrap:wrap;
      align-items:center;
      justify-content:center;
      gap:.42rem;
      pointer-events:auto;
    }

    .dgb-globe-controls button{
      min-height:2rem;
      border:1px solid rgba(255,255,255,.13);
      border-radius:999px;
      padding:.38rem .66rem;
      background:rgba(3,9,20,.62);
      color:rgba(236,242,255,.78);
      font:inherit;
      font-size:.62rem;
      font-weight:950;
      letter-spacing:.06em;
      text-transform:uppercase;
      cursor:pointer;
      box-shadow:inset 0 1px 0 rgba(255,255,255,.055),0 .45rem 1.3rem rgba(0,0,0,.22);
      backdrop-filter:blur(10px);
    }

    .dgb-globe-controls button[aria-pressed="true"]{
      border-color:rgba(244,201,111,.72);
      color:#060811;
      background:linear-gradient(135deg,#fff1aa,#f4c96f);
    }

    .dgb-globe-controls button[data-kind="mint"][aria-pressed="true"]{
      border-color:rgba(158,242,196,.60);
      color:#03100b;
      background:linear-gradient(135deg,#baffdd,#7feeb6);
    }

    @media (max-width:720px){
      .dgb-globe-controls{
        justify-content:flex-start;
        top:.62rem;
      }

      .dgb-globe-controls button{
        min-height:1.85rem;
        padding:.34rem .54rem;
        font-size:.56rem;
      }
    }
  `;
  document.head.appendChild(style);
}

export function createGlobeControls(options = {}) {
  installStyle();

  const mount = options.mount;
  const runtime = options.runtime;
  const onChange = typeof options.onChange === "function" ? options.onChange : () => {};
  const onReset = typeof options.onReset === "function" ? options.onReset : () => {};

  const state = {
    autoSpin: true,
    detail: "stable",
    glide: "soft"
  };

  const panel = document.createElement("div");
  panel.className = "dgb-globe-controls";
  panel.setAttribute("aria-label", "Globe runtime controls");

  const auto = document.createElement("button");
  auto.type = "button";
  auto.dataset.control = "auto";
  auto.dataset.kind = "mint";
  auto.textContent = "Auto";
  auto.setAttribute("aria-pressed", "true");

  const detail = document.createElement("button");
  detail.type = "button";
  detail.dataset.control = "detail";
  detail.textContent = "Detail: Stable";
  detail.setAttribute("aria-pressed", "false");

  const glide = document.createElement("button");
  glide.type = "button";
  glide.dataset.control = "glide";
  glide.textContent = "Glide: Soft";
  glide.setAttribute("aria-pressed", "false");

  const reset = document.createElement("button");
  reset.type = "button";
  reset.dataset.control = "reset";
  reset.textContent = "Reset";
  reset.setAttribute("aria-pressed", "false");

  panel.append(auto, detail, glide, reset);

  function sync() {
    auto.setAttribute("aria-pressed", String(state.autoSpin));
    detail.setAttribute("aria-pressed", String(state.detail === "high"));
    glide.setAttribute("aria-pressed", String(state.glide === "firm"));

    auto.textContent = state.autoSpin ? "Auto" : "Hold";
    detail.textContent = state.detail === "high" ? "Detail: High" : "Detail: Stable";
    glide.textContent = state.glide === "firm" ? "Glide: Firm" : "Glide: Soft";

    runtime?.setConfig?.({
      autoSpin: state.autoSpin,
      detail: state.detail,
      glide: state.glide
    });

    onChange({ ...state });
  }

  auto.addEventListener("click", () => {
    state.autoSpin = !state.autoSpin;
    sync();
  });

  detail.addEventListener("click", () => {
    state.detail = state.detail === "high" ? "stable" : "high";
    sync();
  });

  glide.addEventListener("click", () => {
    state.glide = state.glide === "firm" ? "soft" : "firm";
    sync();
  });

  reset.addEventListener("click", () => {
    runtime?.reset?.();
    onReset();
    sync();
  });

  if (mount) {
    mount.appendChild(panel);
  }

  sync();

  return {
    version: GLOBE_CONTROLS_VERSION,
    panel,
    getState() {
      return { ...state };
    },
    setState(next = {}) {
      if (typeof next.autoSpin === "boolean") state.autoSpin = next.autoSpin;
      if (next.detail === "stable" || next.detail === "high") state.detail = next.detail;
      if (next.glide === "soft" || next.glide === "firm") state.glide = next.glide;
      sync();
    }
  };
}
