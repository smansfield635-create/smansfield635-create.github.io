// /assets/audralia/clean/runtime/audralia.planet-body.inspection-carrier.js
// AUDRALIA_G2_PLANET_BODY_GLOBE_LOGIC_INSPECTION_CARRIER_TNT_v1
// Full-file replacement.
// Purpose: route-local inspectable Audralia planet body carrier.
// Owns: /showroom/globe/audralia/planet/ inspection mount only.
// Does not own: template plate, cockpit, root globe, Runtime / Strength, final visual pass, generated image, GraphicBox, Earth substitution, or Australia drift.

(() => {
  "use strict";

  const CONTRACT = "AUDRALIA_G2_PLANET_BODY_GLOBE_LOGIC_INSPECTION_CARRIER_TNT_v1";
  const SPEC_OPS = "AUDRALIA_G2_PLANET_BODY_GLOBE_LOGIC_INSPECTION_CARRIER_SPEC_OPS_v1";
  const ROUTE = "/showroom/globe/audralia/planet/";
  const FILE = "/assets/audralia/clean/runtime/audralia.planet-body.inspection-carrier.js";

  const LENSES = Object.freeze([
    {
      key: "body",
      label: "Body View",
      state: "Datum Body",
      compass: "North",
      read: "One coherent Audralia body under inspection.",
      overlay: "body"
    },
    {
      key: "surface",
      label: "Surface View",
      state: "Terrain Mass",
      compass: "Northeast / East",
      read: "Terrain pressure and mineral surface are read together.",
      overlay: "surface"
    },
    {
      key: "hydration",
      label: "Hydration View",
      state: "Hydration / Ocean",
      compass: "Southeast / South",
      read: "Ocean basins, shelves, and coast pressure become the active read.",
      overlay: "hydration"
    },
    {
      key: "lattice",
      label: "Lattice View",
      state: "Inspection Lattice",
      compass: "West",
      read: "A light 256-style inspection field appears without replacing the body.",
      overlay: "lattice"
    },
    {
      key: "receipt",
      label: "Receipt View",
      state: "Inspection Receipt",
      compass: "Northwest",
      read: "Route-local carrier proof is shown while Runtime / Strength remains held.",
      overlay: "receipt"
    }
  ]);

  const STATES = Object.freeze([
    ["Datum Body", "North", "loaded"],
    ["Terrain Mass", "Northeast", "expressed"],
    ["Material Surface", "East", "expressed"],
    ["Hydration / Ocean", "Southeast", "expressed"],
    ["Coast / Edge Pressure", "South", "expressed"],
    ["Atmosphere Rim", "Southwest", "expressed"],
    ["Light Response", "West", "expressed"],
    ["Inspection Receipt", "Northwest", "ready"]
  ]);

  const state = {
    rotation: -18,
    tilt: 0,
    lens: "body",
    dragging: false,
    lastX: 0,
    lastY: 0,
    reducedMotion: false
  };

  function hasDOM() {
    return typeof window !== "undefined" && typeof document !== "undefined";
  }

  function routeAllowed() {
    if (!hasDOM()) return false;
    const htmlRoute = document.documentElement.getAttribute("data-route") || "";
    const path = window.location ? window.location.pathname : "";
    return htmlRoute === ROUTE || path === ROUTE;
  }

  function mount() {
    if (!routeAllowed()) return null;
    return document.querySelector("[data-audralia-planet-inspection-mount]");
  }

  function receipt(activeLens = state.lens) {
    return Object.freeze({
      contract: CONTRACT,
      specOps: SPEC_OPS,
      route: ROUTE,
      file: FILE,
      activeLens,
      carrier: "route-local inspectable planet body",
      mount: "data-audralia-planet-inspection-mount",
      globeLogicAdopted: true,
      dragRotation: true,
      stateWallRetired: true,
      templatePlateUntouched: true,
      cockpitUntouched: true,
      globeSelectorUntouched: true,
      runtimeStrengthHeld: true,
      finalVisualPassClaim: false,
      generatedImage: false,
      graphicBox: false,
      earthSubstitution: false,
      australiaNameDrift: false,
      deployMarker: "AUDRALIA_G2_PLANET_BODY_GLOBE_LOGIC_INSPECTION_CARRIER_DEPLOY_MARKER_v1"
    });
  }

  function publish(activeLens = state.lens) {
    if (!hasDOM()) return receipt(activeLens);
    const report = receipt(activeLens);
    document.documentElement.dataset.audraliaPlanetInspectionCarrierContract = CONTRACT;
    document.documentElement.dataset.audraliaPlanetInspectionCarrierLens = activeLens;
    document.documentElement.dataset.audraliaPlanetInspectionCarrierReceipt = JSON.stringify(report);
    document.documentElement.dataset.runtimeStrengthHeld = "true";
    document.documentElement.dataset.finalVisualPassClaim = "false";
    window.AUDRALIA_G2_PLANET_BODY_GLOBE_LOGIC_INSPECTION_CARRIER_RECEIPT = report;
    window.dispatchEvent(new CustomEvent("audralia:planet-inspection-carrier:receipt", { detail: report }));
    return report;
  }

  function installStyle() {
    if (!hasDOM() || document.getElementById("audralia-planet-inspection-carrier-style")) return;

    const style = document.createElement("style");
    style.id = "audralia-planet-inspection-carrier-style";
    style.textContent = `
      .apic-shell{
        position:relative;
        min-height:clamp(640px,84vw,880px);
        overflow:hidden;
        border:1px solid rgba(244,207,131,.18);
        border-radius:30px;
        background:
          radial-gradient(circle at 50% 45%,rgba(141,216,255,.16),transparent 29rem),
          radial-gradient(circle at 50% 78%,rgba(244,207,131,.07),transparent 31rem),
          linear-gradient(180deg,rgba(4,11,24,.94),rgba(1,5,13,.98));
        box-shadow:inset 0 0 80px rgba(141,216,255,.06),0 28px 90px rgba(0,0,0,.42);
        user-select:none;
        -webkit-user-select:none;
        touch-action:none;
      }

      .apic-shell::before{
        content:"";
        position:absolute;
        inset:-18%;
        pointer-events:none;
        background:
          radial-gradient(circle at 12% 22%,rgba(255,255,255,.34) 0 1px,transparent 1.7px),
          radial-gradient(circle at 32% 68%,rgba(255,255,255,.22) 0 1px,transparent 1.5px),
          radial-gradient(circle at 54% 14%,rgba(255,255,255,.28) 0 1px,transparent 1.6px),
          radial-gradient(circle at 74% 74%,rgba(255,255,255,.20) 0 1px,transparent 1.4px),
          radial-gradient(circle at 88% 36%,rgba(141,216,255,.28) 0 1px,transparent 1.7px);
        opacity:.34;
      }

      .apic-toolbar{
        position:absolute;
        left:clamp(12px,2vw,22px);
        right:clamp(12px,2vw,22px);
        top:clamp(12px,2vw,22px);
        z-index:8;
        display:flex;
        flex-wrap:wrap;
        gap:8px;
        justify-content:center;
        pointer-events:auto;
      }

      .apic-lens{
        min-height:36px;
        border:1px solid rgba(255,255,255,.11);
        border-radius:999px;
        padding:0 12px;
        color:rgba(239,247,255,.82);
        background:rgba(2,8,20,.64);
        backdrop-filter:blur(10px);
        font:850 .76rem/1 Inter,ui-sans-serif,system-ui,sans-serif;
        letter-spacing:.04em;
        text-transform:uppercase;
      }

      .apic-lens[aria-pressed="true"]{
        color:#06101c;
        background:linear-gradient(135deg,#fff0b8,#f4cf83);
        border-color:rgba(244,207,131,.72);
      }

      .apic-stage{
        position:absolute;
        inset:0;
        display:grid;
        place-items:center;
        padding:clamp(72px,10vw,112px) clamp(12px,4vw,44px) clamp(150px,20vw,180px);
      }

      .apic-planet{
        position:relative;
        width:min(76vw,620px);
        aspect-ratio:1/1;
        display:grid;
        place-items:center;
        cursor:grab;
        transform:translate3d(0,0,0);
      }

      .apic-planet:active{cursor:grabbing}

      .apic-svg{
        width:100%;
        height:auto;
        overflow:visible;
        filter:
          drop-shadow(-28px 32px 54px rgba(0,0,0,.64))
          drop-shadow(0 0 48px rgba(141,216,255,.14));
      }

      .apic-map-shift{
        transition:transform .18s ease;
      }

      .apic-lattice,
      .apic-receipt-layer{
        opacity:0;
        transition:opacity .22s ease;
      }

      .apic-shell[data-lens="lattice"] .apic-lattice{opacity:.64}
      .apic-shell[data-lens="receipt"] .apic-receipt-layer{opacity:.74}

      .apic-shell[data-lens="hydration"] .apic-ocean{filter:brightness(1.16) saturate(1.18)}
      .apic-shell[data-lens="surface"] .apic-land,
      .apic-shell[data-lens="surface"] .apic-mineral{filter:brightness(1.12) saturate(1.08)}
      .apic-shell[data-lens="body"] .apic-rim{opacity:.88}

      .apic-readout{
        position:absolute;
        left:clamp(12px,2vw,22px);
        right:clamp(12px,2vw,22px);
        bottom:clamp(12px,2vw,22px);
        z-index:9;
        display:grid;
        grid-template-columns:minmax(0,1fr) auto;
        gap:12px;
        align-items:end;
        border:1px solid rgba(244,207,131,.17);
        border-radius:22px;
        padding:14px;
        background:rgba(2,8,20,.70);
        backdrop-filter:blur(14px);
        pointer-events:auto;
      }

      .apic-copy{
        display:grid;
        gap:5px;
      }

      .apic-copy b{
        color:#f4cf83;
        font:900 .70rem/1.2 ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,monospace;
        letter-spacing:.14em;
        text-transform:uppercase;
      }

      .apic-copy strong{
        color:rgba(255,244,216,.96);
        font-size:clamp(1rem,2.4vw,1.25rem);
        line-height:1.1;
      }

      .apic-copy span{
        color:rgba(239,247,255,.72);
        font-size:.88rem;
        line-height:1.35;
      }

      .apic-state-strip{
        display:flex;
        flex-wrap:wrap;
        justify-content:flex-end;
        gap:6px;
        max-width:420px;
      }

      .apic-state-chip{
        border:1px solid rgba(255,255,255,.10);
        border-radius:999px;
        padding:6px 8px;
        color:rgba(239,247,255,.70);
        background:rgba(255,255,255,.035);
        font:850 .58rem/1 ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,monospace;
        letter-spacing:.08em;
        text-transform:uppercase;
      }

      .apic-state-chip.is-active{
        color:#06101c;
        background:linear-gradient(135deg,#fff0b8,#f4cf83);
        border-color:rgba(244,207,131,.72);
      }

      .apic-stage-label{
        position:absolute;
        left:50%;
        bottom:calc(clamp(12px,2vw,22px) + 138px);
        z-index:7;
        width:min(calc(100% - 44px),820px);
        transform:translateX(-50%);
        text-align:center;
        color:rgba(239,247,255,.76);
        font-weight:950;
        font-size:clamp(1rem,3.5vw,1.3rem);
        line-height:1.18;
        text-shadow:0 2px 16px rgba(0,0,0,.72);
        pointer-events:none;
      }

      .apic-stage-label strong{color:rgba(141,216,255,.96)}

      @media (max-width:760px){
        .apic-shell{border-radius:24px}
        .apic-stage{
          padding:112px 8px 250px;
          align-items:start;
        }
        .apic-planet{
          width:min(98vw,540px);
          margin-top:10px;
        }
        .apic-readout{
          grid-template-columns:1fr;
        }
        .apic-state-strip{
          justify-content:flex-start;
          max-width:none;
        }
        .apic-stage-label{
          bottom:238px;
        }
      }

      @media (prefers-reduced-motion:reduce){
        .apic-map-shift{transition:none!important}
      }
    `;
    document.head.appendChild(style);
  }

  function makeSvg() {
    return `
      <svg class="apic-svg" viewBox="0 0 1000 1000" role="img" aria-label="Inspectable Audralia planet body">
        <defs>
          <clipPath id="apic-disc"><circle cx="500" cy="500" r="430"></circle></clipPath>

          <radialGradient id="apic-ocean-gradient" cx="34%" cy="28%" r="82%">
            <stop offset="0%" stop-color="#75dfff" stop-opacity=".94"></stop>
            <stop offset="28%" stop-color="#237cbf" stop-opacity=".98"></stop>
            <stop offset="66%" stop-color="#092d68" stop-opacity="1"></stop>
            <stop offset="100%" stop-color="#020817" stop-opacity="1"></stop>
          </radialGradient>

          <linearGradient id="apic-land-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#d6d0ba" stop-opacity=".96"></stop>
            <stop offset="28%" stop-color="#8b9188" stop-opacity=".94"></stop>
            <stop offset="58%" stop-color="#465950" stop-opacity=".96"></stop>
            <stop offset="100%" stop-color="#222d35" stop-opacity=".98"></stop>
          </linearGradient>

          <linearGradient id="apic-mineral-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#fff4d8" stop-opacity=".24"></stop>
            <stop offset="30%" stop-color="#8dd8ff" stop-opacity=".18"></stop>
            <stop offset="62%" stop-color="#a7f3c6" stop-opacity=".15"></stop>
            <stop offset="100%" stop-color="#ad8cff" stop-opacity=".11"></stop>
          </linearGradient>

          <radialGradient id="apic-rim-gradient" cx="34%" cy="28%" r="72%">
            <stop offset="0%" stop-color="#ffffff" stop-opacity="0"></stop>
            <stop offset="72%" stop-color="#8dd8ff" stop-opacity=".04"></stop>
            <stop offset="92%" stop-color="#8dd8ff" stop-opacity=".30"></stop>
            <stop offset="100%" stop-color="#f4cf83" stop-opacity=".07"></stop>
          </radialGradient>
        </defs>

        <g clip-path="url(#apic-disc)">
          <circle class="apic-ocean" cx="500" cy="500" r="448" fill="url(#apic-ocean-gradient)"></circle>

          <g class="apic-map-shift" data-apic-map-shift>
            <path class="apic-land" fill="url(#apic-land-gradient)" opacity=".93"
              d="M156 358 C214 286 318 252 421 287 C493 312 531 376 510 449 C487 530 405 562 322 548 C231 533 166 481 143 416 C134 390 137 374 156 358 Z"></path>
            <path class="apic-land" fill="url(#apic-land-gradient)" opacity=".88"
              d="M575 224 C666 188 777 223 831 300 C887 380 854 472 774 505 C692 540 603 499 565 432 C526 363 513 248 575 224 Z"></path>
            <path class="apic-land" fill="url(#apic-land-gradient)" opacity=".86"
              d="M455 574 C536 522 638 550 700 628 C760 703 748 793 680 830 C606 869 494 831 442 754 C396 684 392 612 455 574 Z"></path>
            <path class="apic-land" fill="url(#apic-land-gradient)" opacity=".78"
              d="M225 648 C277 604 356 610 399 666 C439 720 411 790 342 806 C270 823 209 770 201 704 C198 681 206 662 225 648 Z"></path>

            <g class="apic-mineral" fill="none" stroke="url(#apic-mineral-gradient)" stroke-width="8" stroke-linecap="round">
              <path d="M198 391 C276 344 386 352 482 413"></path>
              <path d="M604 301 C692 272 778 315 822 386"></path>
              <path d="M492 652 C574 618 650 648 710 744"></path>
              <path d="M250 700 C294 665 360 680 394 748"></path>
            </g>

            <g fill="none" stroke="#a7f3c6" stroke-opacity=".30" stroke-width="5">
              <path d="M159 357 C215 287 318 253 421 287 C493 312 531 376 510 449 C487 529 405 562 322 548 C232 533 167 481 144 416"></path>
              <path d="M574 225 C667 190 776 223 831 300 C887 380 854 472 774 505 C692 540 603 499 566 432"></path>
              <path d="M455 575 C536 523 638 550 700 628 C760 703 748 793 680 830 C607 869 494 831 443 754"></path>
            </g>
          </g>

          <g fill="none" stroke="#cbd3dc" stroke-opacity=".13" stroke-width="2">
            <path d="M110 520 C270 486 440 500 610 568 C725 614 830 610 920 582"></path>
            <path d="M112 412 C278 462 426 448 570 406 C700 368 802 392 910 446"></path>
            <path d="M180 720 C346 648 520 650 742 744"></path>
          </g>

          <ellipse cx="620" cy="522" rx="455" ry="505" fill="#000818" opacity=".34"></ellipse>
          <ellipse cx="315" cy="300" rx="250" ry="180" fill="#ffffff" opacity=".075"></ellipse>
        </g>

        <g class="apic-lattice" fill="none" stroke="#f4cf83" stroke-width="2" stroke-opacity=".55">
          <circle cx="500" cy="500" r="430"></circle>
          <ellipse cx="500" cy="500" rx="430" ry="116"></ellipse>
          <ellipse cx="500" cy="500" rx="430" ry="235"></ellipse>
          <ellipse cx="500" cy="500" rx="116" ry="430"></ellipse>
          <ellipse cx="500" cy="500" rx="235" ry="430"></ellipse>
          <path d="M500 70 V930"></path>
          <path d="M70 500 H930"></path>
          <path d="M196 196 L804 804"></path>
          <path d="M804 196 L196 804"></path>
        </g>

        <g class="apic-receipt-layer">
          <rect x="322" y="374" width="356" height="252" rx="26" fill="#020814" opacity=".55" stroke="#f4cf83" stroke-opacity=".32"></rect>
          <text x="500" y="462" text-anchor="middle" fill="#f4cf83" font-size="34" font-family="monospace" font-weight="900">INSPECTION</text>
          <text x="500" y="516" text-anchor="middle" fill="#eaf2ff" font-size="24" font-family="monospace" font-weight="900">RUNTIME HELD</text>
          <text x="500" y="560" text-anchor="middle" fill="#8dd8ff" font-size="20" font-family="monospace" font-weight="900">NO FINAL VISUAL PASS</text>
        </g>

        <circle class="apic-rim" cx="500" cy="500" r="430" fill="url(#apic-rim-gradient)"></circle>
        <circle cx="500" cy="500" r="430" fill="none" stroke="#8dd8ff" stroke-opacity=".24" stroke-width="3"></circle>
        <circle cx="500" cy="500" r="456" fill="none" stroke="#8dd8ff" stroke-opacity=".10" stroke-width="8"></circle>
      </svg>
    `;
  }

  function lensButtons(active) {
    return LENSES.map((lens) => `
      <button class="apic-lens" type="button" data-apic-lens="${lens.key}" aria-pressed="${lens.key === active ? "true" : "false"}">${lens.label}</button>
    `).join("");
  }

  function stateChips(activeLens) {
    const lens = LENSES.find((item) => item.key === activeLens) || LENSES[0];
    return STATES.map(([name, compass, status]) => {
      const isActive = name === lens.state || (activeLens === "surface" && (name === "Terrain Mass" || name === "Material Surface")) || (activeLens === "hydration" && (name === "Hydration / Ocean" || name === "Coast / Edge Pressure"));
      return `<span class="apic-state-chip${isActive ? " is-active" : ""}">${compass} · ${name} · ${status}</span>`;
    }).join("");
  }

  function render(root) {
    const target = root || mount();
    if (!target) return null;

    installStyle();

    target.innerHTML = `
      <section class="apic-shell" data-lens="${state.lens}" data-contract="${CONTRACT}">
        <div class="apic-toolbar" role="group" aria-label="Audralia inspection lenses">
          ${lensButtons(state.lens)}
        </div>

        <div class="apic-stage">
          <div class="apic-planet" data-apic-planet aria-label="Drag to inspect Audralia planet body">
            ${makeSvg()}
          </div>
        </div>

        <div class="apic-stage-label">
          <strong>Body View</strong> → inspectable Audralia carrier · surface states available
        </div>

        <div class="apic-readout" aria-live="polite">
          <div class="apic-copy" data-apic-copy></div>
          <div class="apic-state-strip" data-apic-states></div>
        </div>
      </section>
    `;

    bind(target);
    update(target);
    publish(state.lens);

    return target;
  }

  function update(root) {
    const shell = root.querySelector(".apic-shell");
    const map = root.querySelector("[data-apic-map-shift]");
    const copy = root.querySelector("[data-apic-copy]");
    const chips = root.querySelector("[data-apic-states]");
    const label = root.querySelector(".apic-stage-label");
    const lens = LENSES.find((item) => item.key === state.lens) || LENSES[0];

    if (shell) shell.dataset.lens = lens.key;
    if (map) map.style.transform = `translateX(${state.rotation}px) translateY(${state.tilt}px)`;
    if (copy) {
      copy.innerHTML = `
        <b>${lens.compass} · ${lens.state}</b>
        <strong>${lens.label}</strong>
        <span>${lens.read} Drag the body to inspect rotation. Runtime / Strength remains held.</span>
      `;
    }
    if (chips) chips.innerHTML = stateChips(lens.key);
    if (label) label.innerHTML = `<strong>${lens.label}</strong> → inspectable Audralia carrier · surface states available`;

    root.querySelectorAll("[data-apic-lens]").forEach((button) => {
      button.setAttribute("aria-pressed", button.getAttribute("data-apic-lens") === lens.key ? "true" : "false");
    });
  }

  function bind(root) {
    const planet = root.querySelector("[data-apic-planet]");
    if (!planet) return;

    root.querySelectorAll("[data-apic-lens]").forEach((button) => {
      button.addEventListener("click", () => {
        state.lens = button.getAttribute("data-apic-lens") || "body";
        update(root);
        publish(state.lens);
      });
    });

    planet.addEventListener("pointerdown", (event) => {
      state.dragging = true;
      state.lastX = event.clientX;
      state.lastY = event.clientY;
      planet.setPointerCapture?.(event.pointerId);
    });

    planet.addEventListener("pointermove", (event) => {
      if (!state.dragging) return;
      const dx = event.clientX - state.lastX;
      const dy = event.clientY - state.lastY;
      state.lastX = event.clientX;
      state.lastY = event.clientY;
      state.rotation = Math.max(-180, Math.min(180, state.rotation + dx * 0.7));
      state.tilt = Math.max(-22, Math.min(22, state.tilt + dy * 0.18));
      update(root);
    });

    planet.addEventListener("pointerup", (event) => {
      state.dragging = false;
      planet.releasePointerCapture?.(event.pointerId);
      publish(state.lens);
    });

    planet.addEventListener("pointercancel", () => {
      state.dragging = false;
    });
  }

  function boot() {
    if (!routeAllowed()) return publish("route-blocked");
    const target = mount();
    if (!target) return publish("mount-missing");
    render(target);
  }

  if (hasDOM()) {
    window.AUDRALIA_G2_PLANET_BODY_GLOBE_LOGIC_INSPECTION_CARRIER = Object.freeze({
      contract: CONTRACT,
      route: ROUTE,
      file: FILE,
      receipt,
      publish,
      render
    });

    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", boot, { once: true });
    } else {
      boot();
    }
  }
})();
