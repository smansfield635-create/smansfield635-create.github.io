/*
  PLANET_ONE_RENDER_TEAM_TNT_v1
  OWNER=SEAN
  TARGET=/world/render/planet-one.render.js
  PURPOSE=CREATE_REAL_PLANET_ONE_RENDER_TEAM_FOR_NINE_SUMMITS_UNIVERSE
  STATUS=ACTIVE
  planet-one-render-active=true
  planet-one-renderer=/world/render/planet-one.render.js
  globe-demo-status-retired=true
  tree-demo-mode=true
  render-lanes-separated=true
  no-render-lane-collapse=true
  no-generated-graphic=true
  no-external-image=true
*/

(function () {
  "use strict";

  var VERSION = "PLANET_ONE_RENDER_TEAM_TNT_v1";
  var NS = "http://www.w3.org/2000/svg";

  function el(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (typeof text === "string") node.textContent = text;
    return node;
  }

  function svg(tag, attrs) {
    var node = document.createElementNS(NS, tag);
    Object.keys(attrs || {}).forEach(function (key) {
      node.setAttribute(key, attrs[key]);
    });
    return node;
  }

  function injectStyles() {
    if (document.getElementById("planet-one-render-team-style")) return;

    var style = document.createElement("style");
    style.id = "planet-one-render-team-style";
    style.textContent = `
      .planet-one-render-shell {
        display: grid;
        justify-items: center;
        gap: 18px;
        width: 100%;
      }

      .planet-one-render-card {
        display: grid;
        justify-items: center;
        gap: 14px;
        width: min(580px, 100%);
        padding: clamp(12px, 3vw, 20px);
        border: 1px solid rgba(242, 199, 111, 0.38);
        border-radius: 30px;
        background:
          radial-gradient(circle at 50% 10%, rgba(145, 189, 255, 0.15), transparent 15rem),
          rgba(3, 7, 14, 0.76);
        box-shadow: 0 30px 90px rgba(0, 0, 0, 0.58), 0 0 60px rgba(145, 189, 255, 0.14);
      }

      .planet-one-svg {
        display: block;
        width: min(460px, 84vw);
        height: auto;
        max-width: 100%;
        filter: drop-shadow(0 26px 46px rgba(0, 0, 0, 0.72));
      }

      .planet-one-caption {
        max-width: 760px;
        color: rgba(244, 247, 255, 0.86);
        font-size: 0.78rem;
        font-weight: 950;
        letter-spacing: 0.12em;
        line-height: 1.35;
        text-align: center;
        text-transform: uppercase;
      }

      .planet-one-telemetry {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        gap: 8px;
        max-width: 820px;
      }

      .planet-one-telemetry span {
        border: 1px solid rgba(168, 199, 255, 0.18);
        border-radius: 999px;
        padding: 6px 9px;
        background: rgba(255, 255, 255, 0.05);
        color: rgba(244, 247, 255, 0.74);
        font-size: 0.66rem;
        font-weight: 850;
        letter-spacing: 0.04em;
        text-transform: uppercase;
      }

      .planet-one-mapkey {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 8px;
        width: min(680px, 100%);
      }

      .planet-one-mapkey div {
        border: 1px solid rgba(168, 199, 255, 0.14);
        border-radius: 14px;
        padding: 8px 10px;
        background: rgba(255, 255, 255, 0.045);
        color: rgba(244, 247, 255, 0.78);
        font-size: 0.72rem;
        font-weight: 800;
        line-height: 1.25;
      }

      .planet-one-mapkey strong {
        display: block;
        color: #f2c76f;
        font-size: 0.68rem;
        letter-spacing: 0.08em;
        text-transform: uppercase;
        margin-bottom: 2px;
      }

      @media (prefers-reduced-motion: no-preference) {
        .planet-one-surface {
          animation: planetOneDrift 24s ease-in-out infinite alternate;
          transform-origin: 250px 250px;
        }

        .planet-one-clouds {
          animation: planetOneCloudDrift 32s ease-in-out infinite alternate;
          transform-origin: 250px 250px;
        }

        .planet-one-core-signal {
          animation: planetOneCorePulse 5.5s ease-in-out infinite alternate;
          transform-origin: 250px 250px;
        }

        @keyframes planetOneDrift {
          from { transform: rotate(-1.1deg) scale(1.006); }
          to { transform: rotate(1.1deg) scale(1.006); }
        }

        @keyframes planetOneCloudDrift {
          from { transform: rotate(0.7deg) translateX(-2px); opacity: 0.54; }
          to { transform: rotate(-0.7deg) translateX(2px); opacity: 0.72; }
        }

        @keyframes planetOneCorePulse {
          from { opacity: 0.18; }
          to { opacity: 0.42; }
        }
      }

      @media (max-width: 620px) {
        .planet-one-mapkey {
          grid-template-columns: 1fr;
        }
      }
    `;
    document.head.appendChild(style);
  }

  function buildSvg() {
    var root = svg("svg", {
      class: "planet-one-svg",
      viewBox: "0 0 500 500",
      role: "img",
      "aria-label": "Planet 1, Nine Summits Universe, realistic globe render with seven landmasses"
    });

    var defs = svg("defs");

    var ocean = svg("radialGradient", { id: "p1Ocean", cx: "34%", cy: "24%", r: "78%" });
    ocean.appendChild(svg("stop", { offset: "0%", "stop-color": "#6bb9d9", "stop-opacity": "1" }));
    ocean.appendChild(svg("stop", { offset: "36%", "stop-color": "#14618a", "stop-opacity": "1" }));
    ocean.appendChild(svg("stop", { offset: "68%", "stop-color": "#06294a", "stop-opacity": "1" }));
    ocean.appendChild(svg("stop", { offset: "100%", "stop-color": "#02050b", "stop-opacity": "1" }));
    defs.appendChild(ocean);

    var glow = svg("radialGradient", { id: "p1Glow", cx: "30%", cy: "22%", r: "76%" });
    glow.appendChild(svg("stop", { offset: "0%", "stop-color": "#ffffff", "stop-opacity": ".36" }));
    glow.appendChild(svg("stop", { offset: "24%", "stop-color": "#b8e9ff", "stop-opacity": ".18" }));
    glow.appendChild(svg("stop", { offset: "58%", "stop-color": "#5ca7d0", "stop-opacity": ".06" }));
    glow.appendChild(svg("stop", { offset: "100%", "stop-color": "#000000", "stop-opacity": "0" }));
    defs.appendChild(glow);

    var terminator = svg("radialGradient", { id: "p1Terminator", cx: "74%", cy: "60%", r: "76%" });
    terminator.appendChild(svg("stop", { offset: "0%", "stop-color": "#000000", "stop-opacity": "0" }));
    terminator.appendChild(svg("stop", { offset: "44%", "stop-color": "#000000", "stop-opacity": ".18" }));
    terminator.appendChild(svg("stop", { offset: "78%", "stop-color": "#000000", "stop-opacity": ".62" }));
    terminator.appendChild(svg("stop", { offset: "100%", "stop-color": "#000000", "stop-opacity": ".88" }));
    defs.appendChild(terminator);

    var polar = svg("linearGradient", { id: "p1PolarIce", x1: "0%", y1: "0%", x2: "100%", y2: "100%" });
    polar.appendChild(svg("stop", { offset: "0%", "stop-color": "#ffffff", "stop-opacity": ".96" }));
    polar.appendChild(svg("stop", { offset: "42%", "stop-color": "#c8d8df", "stop-opacity": ".86" }));
    polar.appendChild(svg("stop", { offset: "100%", "stop-color": "#8aa1aa", "stop-opacity": ".78" }));
    defs.appendChild(polar);

    var main = svg("linearGradient", { id: "p1MainTerrain", x1: "0%", y1: "0%", x2: "100%", y2: "100%" });
    main.appendChild(svg("stop", { offset: "0%", "stop-color": "#5f8a58" }));
    main.appendChild(svg("stop", { offset: "42%", "stop-color": "#4c6e43" }));
    main.appendChild(svg("stop", { offset: "70%", "stop-color": "#7c704f" }));
    main.appendChild(svg("stop", { offset: "100%", "stop-color": "#c7b98a" }));
    defs.appendChild(main);

    var west = svg("linearGradient", { id: "p1WestTerrain", x1: "0%", y1: "0%", x2: "100%", y2: "100%" });
    west.appendChild(svg("stop", { offset: "0%", "stop-color": "#9b8a6b" }));
    west.appendChild(svg("stop", { offset: "46%", "stop-color": "#625b52" }));
    west.appendChild(svg("stop", { offset: "100%", "stop-color": "#2f3439" }));
    defs.appendChild(west);

    var east = svg("linearGradient", { id: "p1EastTerrain", x1: "0%", y1: "0%", x2: "100%", y2: "100%" });
    east.appendChild(svg("stop", { offset: "0%", "stop-color": "#8fbf8e" }));
    east.appendChild(svg("stop", { offset: "46%", "stop-color": "#477454" }));
    east.appendChild(svg("stop", { offset: "100%", "stop-color": "#1f3b3d" }));
    defs.appendChild(east);

    var south = svg("linearGradient", { id: "p1SouthTerrain", x1: "0%", y1: "0%", x2: "100%", y2: "100%" });
    south.appendChild(svg("stop", { offset: "0%", "stop-color": "#7d9460" }));
    south.appendChild(svg("stop", { offset: "44%", "stop-color": "#4b6841" }));
    south.appendChild(svg("stop", { offset: "100%", "stop-color": "#283a31" }));
    defs.appendChild(south);

    var landTexture = svg("filter", { id: "p1LandTexture", x: "-20%", y: "-20%", width: "140%", height: "140%" });
    landTexture.appendChild(svg("feTurbulence", { type: "fractalNoise", baseFrequency: ".018 .034", numOctaves: "5", seed: "7", result: "noise" }));
    landTexture.appendChild(svg("feColorMatrix", {
      in: "noise",
      type: "matrix",
      values: ".55 0 0 0 0 0 .55 0 0 0 0 0 .55 0 0 0 0 0 .24 0",
      result: "grain"
    }));
    landTexture.appendChild(svg("feBlend", { in: "SourceGraphic", in2: "grain", mode: "multiply" }));
    defs.appendChild(landTexture);

    var oceanTexture = svg("filter", { id: "p1OceanTexture", x: "-20%", y: "-20%", width: "140%", height: "140%" });
    oceanTexture.appendChild(svg("feTurbulence", { type: "fractalNoise", baseFrequency: ".012 .025", numOctaves: "4", seed: "11", result: "waterNoise" }));
    oceanTexture.appendChild(svg("feColorMatrix", {
      in: "waterNoise",
      type: "matrix",
      values: ".25 0 0 0 0 0 .32 0 0 0 0 0 .55 0 0 0 0 0 .20 0",
      result: "waterGrain"
    }));
    oceanTexture.appendChild(svg("feBlend", { in: "SourceGraphic", in2: "waterGrain", mode: "screen" }));
    defs.appendChild(oceanTexture);

    var clouds = svg("filter", { id: "p1Clouds", x: "-20%", y: "-20%", width: "140%", height: "140%" });
    clouds.appendChild(svg("feTurbulence", { type: "fractalNoise", baseFrequency: ".022 .035", numOctaves: "4", seed: "21", result: "cloudNoise" }));
    clouds.appendChild(svg("feColorMatrix", {
      in: "cloudNoise",
      type: "matrix",
      values: "1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 .34 -.02",
      result: "cloudAlpha"
    }));
    clouds.appendChild(svg("feGaussianBlur", { stdDeviation: "1.2" }));
    defs.appendChild(clouds);

    var clip = svg("clipPath", { id: "p1Clip" });
    clip.appendChild(svg("circle", { cx: "250", cy: "250", r: "212" }));
    defs.appendChild(clip);

    root.appendChild(defs);

    root.appendChild(svg("circle", { cx: "250", cy: "250", r: "230", fill: "rgba(145,189,255,.08)" }));
    root.appendChild(svg("circle", { cx: "250", cy: "250", r: "218", fill: "url(#p1Ocean)", stroke: "rgba(145,189,255,.32)", "stroke-width": "3", filter: "url(#p1OceanTexture)" }));

    var surface = svg("g", { class: "planet-one-surface", "clip-path": "url(#p1Clip)" });
    surface.appendChild(svg("rect", { x: "38", y: "38", width: "424", height: "424", fill: "url(#p1Ocean)", filter: "url(#p1OceanTexture)" }));

    surface.appendChild(svg("path", {
      d: "M160 58 C194 36 254 38 303 53 C340 65 370 82 382 106 C339 126 290 126 251 121 C206 116 167 103 132 84 C136 73 146 64 160 58 Z",
      fill: "url(#p1PolarIce)",
      opacity: ".94",
      filter: "url(#p1LandTexture)"
    }));

    surface.appendChild(svg("path", {
      d: "M160 108 C196 88 246 88 291 102 C333 116 362 144 356 174 C322 192 272 193 231 185 C190 177 150 157 131 132 C137 122 146 114 160 108 Z",
      fill: "#8ca3a7",
      opacity: ".82",
      filter: "url(#p1LandTexture)"
    }));

    surface.appendChild(svg("path", {
      d: "M176 183 C205 159 267 151 313 176 C353 198 372 242 352 275 C331 311 276 319 229 307 C182 295 146 263 146 226 C146 207 157 193 176 183 Z",
      fill: "url(#p1MainTerrain)",
      opacity: ".96",
      filter: "url(#p1LandTexture)"
    }));

    surface.appendChild(svg("path", {
      d: "M86 181 C115 149 169 152 196 182 C220 209 214 257 186 286 C153 321 95 311 68 273 C45 239 54 204 86 181 Z",
      fill: "url(#p1WestTerrain)",
      opacity: ".93",
      filter: "url(#p1LandTexture)"
    }));

    surface.appendChild(svg("path", {
      d: "M310 184 C343 151 401 160 425 200 C446 235 430 281 395 305 C358 330 305 316 288 276 C273 240 281 211 310 184 Z",
      fill: "url(#p1EastTerrain)",
      opacity: ".95",
      filter: "url(#p1LandTexture)"
    }));

    surface.appendChild(svg("path", {
      d: "M164 306 C204 287 262 287 312 302 C349 313 373 338 361 366 C329 389 277 395 230 388 C185 381 146 360 135 334 C141 322 150 313 164 306 Z",
      fill: "url(#p1SouthTerrain)",
      opacity: ".95",
      filter: "url(#p1LandTexture)"
    }));

    surface.appendChild(svg("path", {
      d: "M158 392 C197 375 263 375 315 390 C350 400 371 414 371 431 C325 453 258 461 201 451 C162 444 134 431 123 414 C131 404 142 397 158 392 Z",
      fill: "url(#p1PolarIce)",
      opacity: ".9",
      filter: "url(#p1LandTexture)"
    }));

    surface.appendChild(svg("path", { d: "M45 95 C82 129 75 177 46 214 C83 247 84 303 48 367", fill: "none", stroke: "rgba(242,199,111,.22)", "stroke-width": "4", "stroke-linecap": "round" }));
    surface.appendChild(svg("path", { d: "M455 95 C418 129 425 177 454 214 C417 247 416 303 452 367", fill: "none", stroke: "rgba(242,199,111,.22)", "stroke-width": "4", "stroke-linecap": "round" }));
    surface.appendChild(svg("path", { d: "M250 45 L250 455", fill: "none", stroke: "rgba(242,199,111,.32)", "stroke-width": "2", "stroke-linecap": "round" }));
    surface.appendChild(svg("path", { d: "M64 250 H436", fill: "none", stroke: "rgba(255,255,255,.12)", "stroke-width": "1.5", "stroke-linecap": "round" }));

    surface.appendChild(svg("path", { d: "M188 190 C220 202 260 203 298 192", fill: "none", stroke: "rgba(245,245,245,.38)", "stroke-width": "2", "stroke-linecap": "round" }));
    surface.appendChild(svg("path", { d: "M170 240 C214 252 282 255 332 236", fill: "none", stroke: "rgba(245,245,245,.22)", "stroke-width": "1.8", "stroke-linecap": "round" }));
    surface.appendChild(svg("path", { d: "M156 340 C205 352 286 354 345 331", fill: "none", stroke: "rgba(245,245,245,.24)", "stroke-width": "1.8", "stroke-linecap": "round" }));

    root.appendChild(surface);

    var cloudLayer = svg("g", { class: "planet-one-clouds", "clip-path": "url(#p1Clip)", opacity: ".58", filter: "url(#p1Clouds)" });
    cloudLayer.appendChild(svg("path", { d: "M84 132 C141 102 202 118 250 136 C301 155 352 144 412 116", fill: "none", stroke: "rgba(255,255,255,.88)", "stroke-width": "13", "stroke-linecap": "round" }));
    cloudLayer.appendChild(svg("path", { d: "M61 275 C128 247 202 253 257 271 C319 291 380 279 441 247", fill: "none", stroke: "rgba(255,255,255,.72)", "stroke-width": "12", "stroke-linecap": "round" }));
    cloudLayer.appendChild(svg("path", { d: "M108 370 C173 345 247 350 304 365 C348 377 390 371 430 352", fill: "none", stroke: "rgba(255,255,255,.74)", "stroke-width": "11", "stroke-linecap": "round" }));
    cloudLayer.appendChild(svg("path", { d: "M114 72 C160 57 207 63 238 82", fill: "none", stroke: "rgba(255,255,255,.7)", "stroke-width": "10", "stroke-linecap": "round" }));
    root.appendChild(cloudLayer);

    var core = svg("g", { class: "planet-one-core-signal", opacity: ".28" });
    core.appendChild(svg("circle", { cx: "250", cy: "250", r: "32", fill: "none", stroke: "rgba(143,240,198,.42)", "stroke-width": "2" }));
    core.appendChild(svg("path", { d: "M250 205 C278 226 278 274 250 295 C222 274 222 226 250 205 Z", fill: "rgba(143,240,198,.12)", stroke: "rgba(242,199,111,.30)", "stroke-width": "1.5" }));
    root.appendChild(core);

    root.appendChild(svg("circle", { cx: "250", cy: "250", r: "218", fill: "url(#p1Glow)" }));
    root.appendChild(svg("circle", { cx: "250", cy: "250", r: "218", fill: "url(#p1Terminator)" }));
    root.appendChild(svg("path", { d: "M155 43 C211 116 212 382 155 457", fill: "none", stroke: "rgba(255,255,255,.10)", "stroke-width": "1.2" }));
    root.appendChild(svg("path", { d: "M345 43 C289 116 288 382 345 457", fill: "none", stroke: "rgba(255,255,255,.10)", "stroke-width": "1.2" }));
    root.appendChild(svg("path", { d: "M67 165 C155 193 345 193 433 165", fill: "none", stroke: "rgba(255,255,255,.09)", "stroke-width": "1" }));
    root.appendChild(svg("path", { d: "M67 335 C155 307 345 307 433 335", fill: "none", stroke: "rgba(255,255,255,.09)", "stroke-width": "1" }));
    root.appendChild(svg("circle", { cx: "250", cy: "250", r: "218", fill: "none", stroke: "rgba(145,189,255,.42)", "stroke-width": "3" }));
    root.appendChild(svg("circle", { cx: "250", cy: "250", r: "224", fill: "none", stroke: "rgba(145,189,255,.18)", "stroke-width": "10" }));

    return root;
  }

  function buildTelemetry() {
    var telemetry = el("div", "planet-one-telemetry");
    [
      "Planet 1",
      "Real globe lane",
      "7 landmasses",
      "Mainland center",
      "North / South caps",
      "Ocean wrap seam",
      "Coherence access",
      "Tree demo mode"
    ].forEach(function (item) {
      telemetry.appendChild(el("span", "", item));
    });
    return telemetry;
  }

  function buildMapKey() {
    var key = el("div", "planet-one-mapkey");
    [
      ["Top", "North Pole · upper coherence cap"],
      ["Upper", "North Main Region · law and clarity"],
      ["Center", "Mainland · first-entry civilization"],
      ["Left", "West Region · trial and proof"],
      ["Right", "East Region · learning and invention"],
      ["Lower", "South Region · restoration and roots"],
      ["Bottom", "South Pole · depth coherence cap"],
      ["Edges", "Ocean seam · wraparound globe logic"]
    ].forEach(function (pair) {
      var row = el("div");
      row.appendChild(el("strong", "", pair[0]));
      row.appendChild(document.createTextNode(pair[1]));
      key.appendChild(row);
    });
    return key;
  }

  function renderPlanetOne(mount, options) {
    if (!mount) {
      throw new Error("DGBPlanetOneRenderTeam.renderPlanetOne requires a mount element.");
    }

    injectStyles();

    var config = options || {};
    var caption = config.caption || "Planet 1 · Nine Summits Universe · real globe render lane";

    mount.innerHTML = "";
    mount.dataset.renderStatus = "mounted";
    mount.dataset.planetOneRenderActive = "true";
    mount.dataset.planetOneRenderer = "/world/render/planet-one.render.js";
    mount.dataset.globeDemoStatusRetired = "true";
    mount.dataset.treeDemoMode = "true";
    mount.dataset.renderLanesSeparated = "true";
    mount.dataset.noRenderLaneCollapse = "true";

    var shell = el("div", "planet-one-render-shell");
    var card = el("div", "planet-one-render-card");

    card.appendChild(buildSvg());
    card.appendChild(el("div", "planet-one-caption", caption));
    card.appendChild(buildTelemetry());
    card.appendChild(buildMapKey());

    shell.appendChild(card);
    mount.appendChild(shell);

    document.documentElement.dataset.planetOneRenderActive = "true";
    document.documentElement.dataset.planetOneRenderer = "/world/render/planet-one.render.js";
    document.documentElement.dataset.globeDemoStatusRetired = "true";
    document.documentElement.dataset.treeDemoMode = "true";
    document.documentElement.dataset.renderLanesSeparated = "true";
    document.documentElement.dataset.noRenderLaneCollapse = "true";

    return {
      ok: true,
      version: VERSION,
      planetOneRenderActive: true,
      renderer: "/world/render/planet-one.render.js",
      globeDemoStatusRetired: true,
      treeDemoMode: true,
      renderLanesSeparated: true,
      noRenderLaneCollapse: true
    };
  }

  window.DGBPlanetOneRenderTeam = {
    version: VERSION,
    render: renderPlanetOne,
    renderPlanetOne: renderPlanetOne
  };
})();
