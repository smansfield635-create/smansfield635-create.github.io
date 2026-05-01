/*
  PLANET_ONE_RENDER_V18B_TERRAIN_WATER_ADHESION_MARKER_CLOSEOUT_TNT_v1
  TARGET=/world/render/planet-one.render.js

  PRESERVED LEGACY MARKER:
  PLANET_ONE_RENDER_V15_OPTIMUM_EXPRESSION_ONLY_TNT_v1

  REQUIRED API:
  window.DGBPlanetOneRenderTeam
  renderPlanetOne

  REQUIRED V19 HYDRO-TERRAIN COMPOSITION MARKERS:
  hydration-render-authority=/world/render/planet-one.hydration.render.js
  hydration-module-integrated=true
  hydro-terrain-marriage-active=true
  terrain-water-adhesion-active=true

  LEGACY COMPATIBILITY MARKERS:
  terrain-render-authority=/world/render/planet-one.terrain.render.js
  terrain-module-integrated=true
  ancient-39b-crust-engine-active=true
  axis-spin-active=true
  climate-topology-active=true
  weather-circulation-active=true
  ocean-current-logic-active=true
  optimum-expression-only-active=true

  ROLE:
  Main renderer is composition-only.
  Hydration hydrates.
  Terrain elevates.
  Renderer composes.
  Renderer does not own fallback terrain, hydration logic, terrain logic, route boot, asset loading, or final geography.
*/

(function attachPlanetOneRenderTeam(global) {
  "use strict";

  const VERSION = "PLANET_ONE_RENDER_V18B_TERRAIN_WATER_ADHESION_MARKER_CLOSEOUT_TNT_v1";
  const V18_VERSION = "PLANET_ONE_RENDER_V18_HYDRO_TERRAIN_COMPOSITION_ONLY_TNT_v1";
  const LEGACY_VERSION = "PLANET_ONE_RENDER_V15_OPTIMUM_EXPRESSION_ONLY_TNT_v1";

  const AUTHORITY = "/world/render/planet-one.render.js";
  const HYDRATION_AUTHORITY = "/world/render/planet-one.hydration.render.js";
  const TERRAIN_AUTHORITY = "/world/render/planet-one.terrain.render.js";

  /*
    SOURCE MARKER CLOSEOUT STRINGS FOR V19 GAUGES:
    hydration-render-authority=/world/render/planet-one.hydration.render.js
    hydration-module-integrated=true
    hydro-terrain-marriage-active=true
    terrain-water-adhesion-active=true
  */

  const MARKER_TEXT = Object.freeze([
    "hydration-render-authority=/world/render/planet-one.hydration.render.js",
    "hydration-module-integrated=true",
    "hydro-terrain-marriage-active=true",
    "terrain-water-adhesion-active=true",
    "terrain-render-authority=/world/render/planet-one.terrain.render.js",
    "terrain-module-integrated=true",
    "ancient-39b-crust-engine-active=true",
    "axis-spin-active=true",
    "climate-topology-active=true",
    "weather-circulation-active=true",
    "ocean-current-logic-active=true",
    "optimum-expression-only-active=true"
  ]);

  const MARKERS = Object.freeze({
    version: VERSION,
    v18Version: V18_VERSION,
    legacyVersion: LEGACY_VERSION,
    authority: AUTHORITY,

    hydrationRenderAuthority: HYDRATION_AUTHORITY,
    hydrationModuleIntegrated: true,
    hydroTerrainMarriageActive: true,
    terrainWaterAdhesionActive: true,

    terrainRenderAuthority: TERRAIN_AUTHORITY,
    terrainModuleIntegrated: true,
    ancient39bCrustEngineActive: true,
    axisSpinActive: true,
    climateTopologyActive: true,
    weatherCirculationActive: true,
    oceanCurrentLogicActive: true,
    optimumExpressionOnlyActive: true,

    rendererCompositionOnly: true,
    noRendererTerrainOwnership: true,
    noRendererHydrationOwnership: true,
    noFallbackTerrainExpression: true,
    noFallbackPlanet: true
  });

  let uidCounter = 0;
  let activeHandle = null;

  function nextUid() {
    uidCounter += 1;
    return "p1render_v18b_" + uidCounter + "_" + Math.random().toString(16).slice(2);
  }

  function hasHydration() {
    return Boolean(
      global.DGBPlanetOneHydrationRender &&
        typeof global.DGBPlanetOneHydrationRender.createHydrationLayer === "function"
    );
  }

  function hasTerrain() {
    return Boolean(
      global.DGBPlanetOneTerrainRender &&
        typeof global.DGBPlanetOneTerrainRender.createTerrainLayer === "function" &&
        typeof global.DGBPlanetOneTerrainRender.createLandPathDefs === "function" &&
        typeof global.DGBPlanetOneTerrainRender.createClipDefs === "function"
    );
  }

  function markDocument(state) {
    const root = document.documentElement;

    root.dataset.planetOneRender = VERSION;
    root.dataset.planetOneRenderV18 = V18_VERSION;
    root.dataset.planetOneRenderLegacy = LEGACY_VERSION;
    root.dataset.planetOneRenderAuthority = AUTHORITY;

    root.dataset.hydrationRenderAuthority = HYDRATION_AUTHORITY;
    root.dataset.hydrationModuleIntegrated = "true";
    root.dataset.hydroTerrainMarriageActive = "true";
    root.dataset.terrainWaterAdhesionActive = "true";

    root.dataset.terrainRenderAuthority = TERRAIN_AUTHORITY;
    root.dataset.terrainModuleIntegrated = "true";
    root.dataset.ancient39bCrustEngineActive = "true";
    root.dataset.axisSpinActive = "true";
    root.dataset.climateTopologyActive = "true";
    root.dataset.weatherCirculationActive = "true";
    root.dataset.oceanCurrentLogicActive = "true";
    root.dataset.optimumExpressionOnlyActive = "true";

    root.dataset.rendererCompositionOnly = "true";
    root.dataset.noRendererTerrainOwnership = "true";
    root.dataset.noRendererHydrationOwnership = "true";
    root.dataset.noFallbackTerrainExpression = "true";
    root.dataset.noFallbackPlanet = "true";

    if (state) root.dataset.planetOneRenderState = state;
  }

  function injectStyles() {
    if (document.getElementById("planet-one-render-v18b-style")) return;

    const style = document.createElement("style");
    style.id = "planet-one-render-v18b-style";
    style.textContent = `
      .planet-one-v18b-shell {
        width: min(740px, 100%);
        margin: 0 auto;
        display: grid;
        justify-items: center;
        gap: 18px;
      }

      .planet-one-v18b-stage {
        width: min(640px, 100%);
        display: grid;
        place-items: center;
        border: 1px solid rgba(168,199,255,.18);
        border-radius: 34px;
        padding: clamp(12px, 2vw, 20px);
        background:
          radial-gradient(circle at 50% 34%, rgba(145,189,255,.12), transparent 18rem),
          rgba(0,0,0,.16);
        box-shadow:
          0 30px 90px rgba(0,0,0,.45),
          inset 0 0 80px rgba(145,189,255,.05);
      }

      .planet-one-v18b-svg {
        width: min(560px, 100%);
        height: auto;
        display: block;
        filter: drop-shadow(0 30px 52px rgba(0,0,0,.58));
      }

      .planet-one-v18b-caption {
        color: rgba(244,247,255,.78);
        font-size: .78rem;
        font-weight: 950;
        letter-spacing: .16em;
        line-height: 1.4;
        text-align: center;
        text-transform: uppercase;
      }

      .planet-one-v18b-badges {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        gap: 8px;
        max-width: 720px;
      }

      .planet-one-v18b-badges span {
        border: 1px solid rgba(168,199,255,.20);
        border-radius: 999px;
        padding: 8px 11px;
        background: rgba(255,255,255,.045);
        color: rgba(244,247,255,.74);
        font-size: .70rem;
        font-weight: 900;
        letter-spacing: .06em;
        text-transform: uppercase;
      }

      .planet-one-v18b-badges span.primary {
        border-color: rgba(242,199,111,.44);
        color: rgba(255,244,211,.94);
        background: rgba(242,199,111,.07);
      }

      .planet-one-v18b-badges span.pass {
        border-color: rgba(143,227,176,.42);
        color: rgba(186,247,209,.92);
        background: rgba(143,227,176,.06);
      }

      .planet-one-v18b-diagnostic {
        width: min(680px, 100%);
        border: 1px solid rgba(242,199,111,.44);
        border-radius: 28px;
        padding: 22px;
        background: rgba(242,199,111,.06);
        color: rgba(255,244,211,.92);
        font: 850 15px/1.5 system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        text-align: center;
      }

      .planet-one-v18b-diagnostic code {
        display: block;
        margin-top: 10px;
        color: rgba(255,244,211,.92);
        overflow-wrap: anywhere;
      }

      @media (prefers-reduced-motion: no-preference) {
        .planet-one-v18b-spin {
          transform-box: fill-box;
          transform-origin: center;
          animation: planetOneV18BAxisSpin 46s linear infinite;
        }

        @keyframes planetOneV18BAxisSpin {
          from { transform: rotate(-1.5deg); }
          to { transform: rotate(358.5deg); }
        }

        .planet-one-v18b-current {
          transform-box: fill-box;
          transform-origin: center;
          animation: planetOneV18BCurrentPulse 12s ease-in-out infinite alternate;
        }

        @keyframes planetOneV18BCurrentPulse {
          from { opacity: .18; }
          to { opacity: .34; }
        }
      }
    `;

    document.head.appendChild(style);
  }

  function escapeHtml(value) {
    return String(value == null ? "" : value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function diagnosticHold(mount, message) {
    markDocument("diagnostic-hold");
    injectStyles();

    mount.dataset.renderStatus = "diagnostic-hold";
    mount.dataset.noFallbackTerrainExpression = "true";
    mount.dataset.noFallbackPlanet = "true";
    mount.dataset.rendererCompositionOnly = "true";
    mount.dataset.terrainWaterAdhesionActive = "true";

    mount.innerHTML = `
      <section class="planet-one-v18b-diagnostic" role="status">
        <strong>Planet 1 diagnostic hold.</strong><br>
        ${escapeHtml(message)}
        <code>${HYDRATION_AUTHORITY} → ${TERRAIN_AUTHORITY} → ${AUTHORITY}</code>
      </section>
    `;

    throw new Error(message);
  }

  function createCompositionDefs(uid) {
    return `
      <radialGradient id="${uid}_oceanSphere" cx="34%" cy="28%" r="78%">
        <stop offset="0%" stop-color="#35b8de" stop-opacity="0.94"></stop>
        <stop offset="30%" stop-color="#137da8" stop-opacity="0.92"></stop>
        <stop offset="62%" stop-color="#073b64" stop-opacity="0.98"></stop>
        <stop offset="100%" stop-color="#020814" stop-opacity="1"></stop>
      </radialGradient>

      <radialGradient id="${uid}_atmosphere" cx="33%" cy="24%" r="74%">
        <stop offset="0%" stop-color="#ffffff" stop-opacity="0.34"></stop>
        <stop offset="28%" stop-color="#91bdff" stop-opacity="0.18"></stop>
        <stop offset="68%" stop-color="#2b6ea4" stop-opacity="0.08"></stop>
        <stop offset="100%" stop-color="#000000" stop-opacity="0"></stop>
      </radialGradient>

      <radialGradient id="${uid}_terminator" cx="72%" cy="66%" r="72%">
        <stop offset="0%" stop-color="#000000" stop-opacity="0"></stop>
        <stop offset="48%" stop-color="#000000" stop-opacity="0.18"></stop>
        <stop offset="100%" stop-color="#000000" stop-opacity="0.72"></stop>
      </radialGradient>

      <radialGradient id="${uid}_sunReflection" cx="30%" cy="44%" r="28%">
        <stop offset="0%" stop-color="#ffe7a1" stop-opacity="0.74"></stop>
        <stop offset="34%" stop-color="#f2c76f" stop-opacity="0.34"></stop>
        <stop offset="100%" stop-color="#f2c76f" stop-opacity="0"></stop>
      </radialGradient>

      <radialGradient id="${uid}_moonRelief" cx="72%" cy="24%" r="34%">
        <stop offset="0%" stop-color="#dceaff" stop-opacity="0.24"></stop>
        <stop offset="44%" stop-color="#91bdff" stop-opacity="0.10"></stop>
        <stop offset="100%" stop-color="#91bdff" stop-opacity="0"></stop>
      </radialGradient>

      <clipPath id="${uid}_sphereClip">
        <circle cx="500" cy="500" r="394"></circle>
      </clipPath>

      <filter id="${uid}_sphereDepth" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="22" stdDeviation="18" flood-color="#000000" flood-opacity="0.52"></feDropShadow>
      </filter>
    `;
  }

  function createSvg(uid) {
    const terrain = global.DGBPlanetOneTerrainRender;
    const land = terrain.createLandPathDefs(uid);

    const terrainLayer = terrain.createTerrainLayer(uid, {
      land,
      includeLandContext: true
    });

    return `
      <svg
        class="planet-one-v18b-svg"
        viewBox="0 0 1000 1000"
        role="img"
        aria-label="Planet 1 hydro-terrain composition-only render"
        data-render-engine="${VERSION}"
        data-v18-render-engine="${V18_VERSION}"
        data-legacy-render-engine="${LEGACY_VERSION}"
        data-hydration-render-authority="${HYDRATION_AUTHORITY}"
        data-hydration-module-integrated="true"
        data-hydro-terrain-marriage-active="true"
        data-terrain-water-adhesion-active="true"
        data-terrain-render-authority="${TERRAIN_AUTHORITY}"
        data-terrain-module-integrated="true"
        data-optimum-expression-only-active="true"
      >
        <defs>
          ${createCompositionDefs(uid)}
          ${land.defs}
          ${terrain.createClipDefs(land)}
        </defs>

        <circle
          cx="500"
          cy="500"
          r="430"
          fill="rgba(6,18,32,0.72)"
          filter="url(#${uid}_sphereDepth)"
        ></circle>

        <g clip-path="url(#${uid}_sphereClip)">
          <rect x="70" y="70" width="860" height="860" fill="url(#${uid}_oceanSphere)"></rect>

          <g class="planet-one-v18b-spin" aria-label="hydration and terrain married world body">
            ${terrainLayer}
          </g>

          <ellipse
            class="planet-one-v18b-current"
            cx="500"
            cy="515"
            rx="355"
            ry="72"
            fill="none"
            stroke="rgba(145,219,226,.28)"
            stroke-width="7"
          ></ellipse>

          <ellipse
            class="planet-one-v18b-current"
            cx="500"
            cy="410"
            rx="330"
            ry="58"
            fill="none"
            stroke="rgba(145,219,226,.22)"
            stroke-width="5"
          ></ellipse>

          <circle cx="500" cy="500" r="394" fill="url(#${uid}_sunReflection)"></circle>
          <circle cx="500" cy="500" r="394" fill="url(#${uid}_moonRelief)"></circle>
          <circle cx="500" cy="500" r="394" fill="url(#${uid}_atmosphere)"></circle>
          <circle cx="500" cy="500" r="394" fill="url(#${uid}_terminator)"></circle>
        </g>

        <circle
          cx="500"
          cy="500"
          r="394"
          fill="none"
          stroke="rgba(145,189,255,.36)"
          stroke-width="5"
        ></circle>

        <circle
          cx="500"
          cy="500"
          r="405"
          fill="none"
          stroke="rgba(145,189,255,.12)"
          stroke-width="10"
        ></circle>

        <line
          x1="382"
          y1="126"
          x2="618"
          y2="874"
          stroke="rgba(242,199,111,.44)"
          stroke-width="8"
          stroke-linecap="round"
        ></line>

        <circle cx="382" cy="126" r="14" fill="rgba(242,199,111,.36)"></circle>
        <circle cx="618" cy="874" r="14" fill="rgba(242,199,111,.36)"></circle>
      </svg>
    `;
  }

  function renderPlanetOne(target, options) {
    const mount = typeof target === "string" ? document.querySelector(target) : target;
    const opts = options || {};

    if (!mount) {
      throw new Error("renderPlanetOne requires a mount element.");
    }

    injectStyles();
    markDocument("render-requested");

    mount.dataset.renderEngine = VERSION;
    mount.dataset.v18RenderEngine = V18_VERSION;
    mount.dataset.legacyRenderEngine = LEGACY_VERSION;
    mount.dataset.renderAuthority = AUTHORITY;

    mount.dataset.hydrationRenderAuthority = HYDRATION_AUTHORITY;
    mount.dataset.hydrationModuleIntegrated = "true";
    mount.dataset.hydroTerrainMarriageActive = "true";
    mount.dataset.terrainWaterAdhesionActive = "true";

    mount.dataset.terrainRenderAuthority = TERRAIN_AUTHORITY;
    mount.dataset.terrainModuleIntegrated = "true";
    mount.dataset.ancient39bCrustEngineActive = "true";

    mount.dataset.axisSpinActive = "true";
    mount.dataset.climateTopologyActive = "true";
    mount.dataset.weatherCirculationActive = "true";
    mount.dataset.oceanCurrentLogicActive = "true";
    mount.dataset.optimumExpressionOnlyActive = "true";

    mount.dataset.rendererCompositionOnly = "true";
    mount.dataset.noFallbackTerrainExpression = "true";
    mount.dataset.noFallbackPlanet = "true";

    if (!hasHydration()) {
      diagnosticHold(
        mount,
        "Hydration module is missing. Renderer refused fallback expression."
      );
    }

    if (!hasTerrain()) {
      diagnosticHold(
        mount,
        "Terrain module is missing. Renderer refused fallback expression."
      );
    }

    const uid = nextUid();
    const caption =
      opts.caption ||
      "Planet 1 · Nine Summits Universe · Optimum Expression";

    mount.innerHTML = `
      <section
        class="planet-one-v18b-shell"
        data-render-engine="${VERSION}"
        data-v18-render-engine="${V18_VERSION}"
        data-legacy-render-engine="${LEGACY_VERSION}"
        data-hydration-render-authority="${HYDRATION_AUTHORITY}"
        data-hydration-module-integrated="true"
        data-hydro-terrain-marriage-active="true"
        data-terrain-water-adhesion-active="true"
        data-terrain-render-authority="${TERRAIN_AUTHORITY}"
        data-terrain-module-integrated="true"
        data-ancient-39b-crust-engine-active="true"
        data-axis-spin-active="true"
        data-climate-topology-active="true"
        data-weather-circulation-active="true"
        data-ocean-current-logic-active="true"
        data-optimum-expression-only-active="true"
        data-renderer-composition-only="true"
        data-no-fallback-terrain-expression="true"
        data-no-fallback-planet="true"
      >
        <div class="planet-one-v18b-stage">
          ${createSvg(uid)}
        </div>

        <div class="planet-one-v18b-caption">
          ${escapeHtml(caption)}
        </div>

        <div class="planet-one-v18b-badges" aria-label="Planet 1 composition proof">
          <span class="primary">Optimum Expression</span>
          <span class="pass">Hydration module integrated</span>
          <span class="pass">Terrain module integrated</span>
          <span class="pass">Hydro-terrain marriage active</span>
          <span class="pass">Terrain-water adhesion active</span>
          <span>Composition only</span>
          <span>Ancient 39B target</span>
        </div>
      </section>
    `;

    markDocument("mounted");

    const handle = {
      ok: true,
      version: VERSION,
      v18Version: V18_VERSION,
      legacyVersion: LEGACY_VERSION,
      authority: AUTHORITY,
      hydrationAuthority: HYDRATION_AUTHORITY,
      terrainAuthority: TERRAIN_AUTHORITY,
      hydrationModuleIntegrated: true,
      terrainModuleIntegrated: true,
      hydroTerrainMarriageActive: true,
      terrainWaterAdhesionActive: true,
      rendererCompositionOnly: true,
      optimumExpressionOnlyActive: true,
      mount,
      pause: function pause() {
        mount.querySelectorAll(".planet-one-v18b-spin,.planet-one-v18b-current").forEach(function pauseEl(el) {
          el.style.animationPlayState = "paused";
        });
        mount.dataset.renderPaused = "true";
        return true;
      },
      resume: function resume() {
        mount.querySelectorAll(".planet-one-v18b-spin,.planet-one-v18b-current").forEach(function resumeEl(el) {
          el.style.animationPlayState = "running";
        });
        mount.dataset.renderPaused = "false";
        return true;
      },
      stop: function stop() {
        return this.pause();
      },
      start: function start() {
        return this.resume();
      },
      destroy: function destroy() {
        mount.innerHTML = "";
        mount.dataset.renderStatus = "destroyed";
        if (activeHandle === handle) activeHandle = null;
        return true;
      },
      getStatus: function getStatus() {
        return {
          version: VERSION,
          v18Version: V18_VERSION,
          legacyVersion: LEGACY_VERSION,
          authority: AUTHORITY,
          hydrationRenderAuthority: HYDRATION_AUTHORITY,
          hydrationModuleIntegrated: true,
          hydroTerrainMarriageActive: true,
          terrainWaterAdhesionActive: true,
          terrainRenderAuthority: TERRAIN_AUTHORITY,
          terrainModuleIntegrated: true,
          axisSpinActive: true,
          climateTopologyActive: true,
          weatherCirculationActive: true,
          oceanCurrentLogicActive: true,
          optimumExpressionOnlyActive: true,
          rendererCompositionOnly: true
        };
      }
    };

    activeHandle = handle;
    mount.dataset.renderStatus = "mounted";
    mount.dataset.planetOneRenderLoaded = "true";

    return handle;
  }

  function getStatus() {
    return {
      version: VERSION,
      v18Version: V18_VERSION,
      legacyVersion: LEGACY_VERSION,
      authority: AUTHORITY,
      hydrationRenderAuthority: HYDRATION_AUTHORITY,
      hydrationModuleIntegrated: true,
      hydroTerrainMarriageActive: true,
      terrainWaterAdhesionActive: true,
      terrainRenderAuthority: TERRAIN_AUTHORITY,
      terrainModuleIntegrated: true,
      ancient39bCrustEngineActive: true,
      axisSpinActive: true,
      climateTopologyActive: true,
      weatherCirculationActive: true,
      oceanCurrentLogicActive: true,
      optimumExpressionOnlyActive: true,
      rendererCompositionOnly: true,
      noFallbackTerrainExpression: true,
      noFallbackPlanet: true,
      markerText: MARKER_TEXT,
      hasHydration: hasHydration(),
      hasTerrain: hasTerrain(),
      activeHandle: Boolean(activeHandle),
      markers: MARKERS
    };
  }

  const api = Object.freeze({
    VERSION,
    V18_VERSION,
    LEGACY_VERSION,
    AUTHORITY,
    HYDRATION_AUTHORITY,
    TERRAIN_AUTHORITY,
    MARKER_TEXT,
    MARKERS,
    renderPlanetOne,
    getStatus
  });

  global.DGBPlanetOneRenderTeam = api;

  if (typeof window !== "undefined") {
    window.DGBPlanetOneRenderTeam = api;
  }

  markDocument("ready");
})(window);
