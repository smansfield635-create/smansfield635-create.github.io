/*
  PLANET_ONE_RENDER_TEAM_TNT_v2_REALISM
  OWNER=SEAN
  TARGET=/world/render/planet-one.render.js
  PURPOSE=REPLACE_CARTOON_BLOB_GLOBE_WITH_LAYERED_PLANET_ONE_REALISM_RENDER
  STATUS=ACTIVE
  planet-one-render-active=true
  planet-one-renderer=/world/render/planet-one.render.js
  globe-demo-status-retired=true
  tree-demo-mode=true
  render-lanes-separated=true
  no-render-lane-collapse=true
  no-generated-graphic=true
  no-external-image=true

  COMPATIBILITY_MARKERS_FOR_GAUGES:
  PLANET_ONE_RENDER_TEAM_TNT_v1
  window.DGBPlanetOneRenderTeam
  renderPlanetOne
*/

(function () {
  "use strict";

  var VERSION = "PLANET_ONE_RENDER_TEAM_TNT_v2_REALISM";
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
    if (document.getElementById("planet-one-render-team-style-v2")) return;

    var style = document.createElement("style");
    style.id = "planet-one-render-team-style-v2";
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
        width: min(620px, 100%);
        padding: clamp(12px, 3vw, 20px);
        border: 1px solid rgba(242, 199, 111, 0.38);
        border-radius: 30px;
        background:
          radial-gradient(circle at 50% 10%, rgba(145, 189, 255, 0.16), transparent 16rem),
          radial-gradient(circle at 50% 60%, rgba(143, 240, 198, 0.07), transparent 18rem),
          rgba(3, 7, 14, 0.78);
        box-shadow: 0 30px 90px rgba(0, 0, 0, 0.60), 0 0 70px rgba(145, 189, 255, 0.16);
      }

      .planet-one-svg {
        display: block;
        width: min(480px, 86vw);
        height: auto;
        max-width: 100%;
        filter: drop-shadow(0 30px 50px rgba(0, 0, 0, 0.78));
      }

      .planet-one-caption {
        max-width: 780px;
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
        max-width: 840px;
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
        width: min(700px, 100%);
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
          animation: planetOneSurfaceDrift 28s ease-in-out infinite alternate;
          transform-origin: 300px 300px;
        }

        .planet-one-clouds {
          animation: planetOneCloudDrift 34s ease-in-out infinite alternate;
          transform-origin: 300px 300px;
        }

        .planet-one-core-signal {
          animation: planetOneCorePulse 6.5s ease-in-out infinite alternate;
          transform-origin: 300px 300px;
        }

        @keyframes planetOneSurfaceDrift {
          from { transform: rotate(-0.9deg) scale(1.004); }
          to { transform: rotate(0.9deg) scale(1.004); }
        }

        @keyframes planetOneCloudDrift {
          from { transform: rotate(0.9deg) translateX(-3px); opacity: 0.58; }
          to { transform: rotate(-0.9deg) translateX(3px); opacity: 0.76; }
        }

        @keyframes planetOneCorePulse {
          from { opacity: 0.12; }
          to { opacity: 0.34; }
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

  function addPath(group, d, fill, opacity, extraAttrs) {
    var attrs = {
      d: d,
      fill: fill,
      opacity: opacity || "1"
    };

    Object.keys(extraAttrs || {}).forEach(function (key) {
      attrs[key] = extraAttrs[key];
    });

    group.appendChild(svg("path", attrs));
  }

  function addLine(group, d, stroke, width, opacity) {
    group.appendChild(svg("path", {
      d: d,
      fill: "none",
      stroke: stroke,
      "stroke-width": width,
      opacity: opacity || "1",
      "stroke-linecap": "round",
      "stroke-linejoin": "round"
    }));
  }

  function buildSvg() {
    var root = svg("svg", {
      class: "planet-one-svg",
      viewBox: "0 0 600 600",
      role: "img",
      "aria-label": "Planet 1 Nine Summits Universe realistic globe with seven landmasses"
    });

    var defs = svg("defs");

    var ocean = svg("radialGradient", { id: "p1v2Ocean", cx: "31%", cy: "23%", r: "82%" });
    ocean.appendChild(svg("stop", { offset: "0%", "stop-color": "#78d6ec", "stop-opacity": "1" }));
    ocean.appendChild(svg("stop", { offset: "28%", "stop-color": "#1b779d", "stop-opacity": "1" }));
    ocean.appendChild(svg("stop", { offset: "58%", "stop-color": "#073a63", "stop-opacity": "1" }));
    ocean.appendChild(svg("stop", { offset: "82%", "stop-color": "#03192f", "stop-opacity": "1" }));
    ocean.appendChild(svg("stop", { offset: "100%", "stop-color": "#01040a", "stop-opacity": "1" }));
    defs.appendChild(ocean);

    var limbLight = svg("radialGradient", { id: "p1v2LimbLight", cx: "27%", cy: "20%", r: "76%" });
    limbLight.appendChild(svg("stop", { offset: "0%", "stop-color": "#ffffff", "stop-opacity": ".42" }));
    limbLight.appendChild(svg("stop", { offset: "20%", "stop-color": "#ccf4ff", "stop-opacity": ".22" }));
    limbLight.appendChild(svg("stop", { offset: "52%", "stop-color": "#6db8d9", "stop-opacity": ".07" }));
    limbLight.appendChild(svg("stop", { offset: "100%", "stop-color": "#000000", "stop-opacity": "0" }));
    defs.appendChild(limbLight);

    var terminator = svg("radialGradient", { id: "p1v2Terminator", cx: "77%", cy: "61%", r: "78%" });
    terminator.appendChild(svg("stop", { offset: "0%", "stop-color": "#000000", "stop-opacity": "0" }));
    terminator.appendChild(svg("stop", { offset: "38%", "stop-color": "#000000", "stop-opacity": ".16" }));
    terminator.appendChild(svg("stop", { offset: "70%", "stop-color": "#000000", "stop-opacity": ".58" }));
    terminator.appendChild(svg("stop", { offset: "100%", "stop-color": "#000000", "stop-opacity": ".92" }));
    defs.appendChild(terminator);

    var polar = svg("linearGradient", { id: "p1v2Polar", x1: "0%", y1: "0%", x2: "100%", y2: "100%" });
    polar.appendChild(svg("stop", { offset: "0%", "stop-color": "#f7fbff" }));
    polar.appendChild(svg("stop", { offset: "45%", "stop-color": "#c9d7df" }));
    polar.appendChild(svg("stop", { offset: "100%", "stop-color": "#82969f" }));
    defs.appendChild(polar);

    var north = svg("linearGradient", { id: "p1v2North", x1: "0%", y1: "0%", x2: "100%", y2: "100%" });
    north.appendChild(svg("stop", { offset: "0%", "stop-color": "#9dadad" }));
    north.appendChild(svg("stop", { offset: "50%", "stop-color": "#647070" }));
    north.appendChild(svg("stop", { offset: "100%", "stop-color": "#2f3c40" }));
    defs.appendChild(north);

    var main = svg("linearGradient", { id: "p1v2Main", x1: "0%", y1: "0%", x2: "100%", y2: "100%" });
    main.appendChild(svg("stop", { offset: "0%", "stop-color": "#7fa765" }));
    main.appendChild(svg("stop", { offset: "35%", "stop-color": "#4d743f" }));
    main.appendChild(svg("stop", { offset: "72%", "stop-color": "#8e7b52" }));
    main.appendChild(svg("stop", { offset: "100%", "stop-color": "#c0ad78" }));
    defs.appendChild(main);

    var west = svg("linearGradient", { id: "p1v2West", x1: "0%", y1: "0%", x2: "100%", y2: "100%" });
    west.appendChild(svg("stop", { offset: "0%", "stop-color": "#98846a" }));
    west.appendChild(svg("stop", { offset: "44%", "stop-color": "#5d574d" }));
    west.appendChild(svg("stop", { offset: "100%", "stop-color": "#242b31" }));
    defs.appendChild(west);

    var east = svg("linearGradient", { id: "p1v2East", x1: "0%", y1: "0%", x2: "100%", y2: "100%" });
    east.appendChild(svg("stop", { offset: "0%", "stop-color": "#9bc889" }));
    east.appendChild(svg("stop", { offset: "44%", "stop-color": "#4e8857" }));
    east.appendChild(svg("stop", { offset: "100%", "stop-color": "#183f42" }));
    defs.appendChild(east);

    var south = svg("linearGradient", { id: "p1v2South", x1: "0%", y1: "0%", x2: "100%", y2: "100%" });
    south.appendChild(svg("stop", { offset: "0%", "stop-color": "#8a985d" }));
    south.appendChild(svg("stop", { offset: "45%", "stop-color": "#4c6c3f" }));
    south.appendChild(svg("stop", { offset: "100%", "stop-color": "#263730" }));
    defs.appendChild(south);

    var landTexture = svg("filter", { id: "p1v2LandTexture", x: "-25%", y: "-25%", width: "150%", height: "150%" });
    landTexture.appendChild(svg("feTurbulence", { type: "fractalNoise", baseFrequency: ".023 .041", numOctaves: "6", seed: "19", result: "noise" }));
    landTexture.appendChild(svg("feColorMatrix", {
      in: "noise",
      type: "matrix",
      values: ".62 0 0 0 0 0 .62 0 0 0 0 0 .62 0 0 0 0 0 .33 0",
      result: "grain"
    }));
    landTexture.appendChild(svg("feBlend", { in: "SourceGraphic", in2: "grain", mode: "multiply" }));
    defs.appendChild(landTexture);

    var waterTexture = svg("filter", { id: "p1v2WaterTexture", x: "-25%", y: "-25%", width: "150%", height: "150%" });
    waterTexture.appendChild(svg("feTurbulence", { type: "fractalNoise", baseFrequency: ".011 .028", numOctaves: "5", seed: "29", result: "waterNoise" }));
    waterTexture.appendChild(svg("feColorMatrix", {
      in: "waterNoise",
      type: "matrix",
      values: ".20 0 0 0 0 0 .30 0 0 0 0 0 .62 0 0 0 0 0 .22 0",
      result: "waterGrain"
    }));
    waterTexture.appendChild(svg("feBlend", { in: "SourceGraphic", in2: "waterGrain", mode: "screen" }));
    defs.appendChild(waterTexture);

    var clouds = svg("filter", { id: "p1v2Clouds", x: "-25%", y: "-25%", width: "150%", height: "150%" });
    clouds.appendChild(svg("feTurbulence", { type: "fractalNoise", baseFrequency: ".018 .032", numOctaves: "5", seed: "41", result: "cloudNoise" }));
    clouds.appendChild(svg("feColorMatrix", {
      in: "cloudNoise",
      type: "matrix",
      values: "1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 .42 -.08",
      result: "cloudAlpha"
    }));
    clouds.appendChild(svg("feGaussianBlur", { stdDeviation: "1.4" }));
    defs.appendChild(clouds);

    var blur = svg("filter", { id: "p1v2SoftBlur" });
    blur.appendChild(svg("feGaussianBlur", { stdDeviation: "1.1" }));
    defs.appendChild(blur);

    var clip = svg("clipPath", { id: "p1v2Clip" });
    clip.appendChild(svg("circle", { cx: "300", cy: "300", r: "252" }));
    defs.appendChild(clip);

    root.appendChild(defs);

    root.appendChild(svg("circle", { cx: "300", cy: "300", r: "272", fill: "rgba(145,189,255,.08)" }));
    root.appendChild(svg("circle", { cx: "300", cy: "300", r: "258", fill: "url(#p1v2Ocean)", stroke: "rgba(145,189,255,.30)", "stroke-width": "3", filter: "url(#p1v2WaterTexture)" }));

    var surface = svg("g", { class: "planet-one-surface", "clip-path": "url(#p1v2Clip)" });
    surface.appendChild(svg("rect", { x: "48", y: "48", width: "504", height: "504", fill: "url(#p1v2Ocean)", filter: "url(#p1v2WaterTexture)" }));

    addPath(surface, "M150 74 C186 47 247 45 303 57 C361 69 405 92 433 122 C391 143 342 147 292 141 C240 135 191 119 140 91 C141 85 145 79 150 74 Z", "url(#p1v2Polar)", ".92", { filter: "url(#p1v2LandTexture)" });
    addPath(surface, "M157 125 C202 96 270 94 333 115 C384 132 424 168 424 204 C373 218 320 218 270 204 C219 190 173 164 134 137 C139 133 147 128 157 125 Z", "url(#p1v2North)", ".83", { filter: "url(#p1v2LandTexture)" });

    addPath(surface, "M186 222 C221 181 300 170 359 206 C412 238 425 308 386 357 C345 408 268 415 210 381 C153 348 134 282 186 222 Z", "url(#p1v2Main)", ".96", { filter: "url(#p1v2LandTexture)" });
    addPath(surface, "M94 213 C125 168 190 171 228 210 C260 243 251 314 210 356 C164 403 84 386 55 329 C29 278 50 239 94 213 Z", "url(#p1v2West)", ".92", { filter: "url(#p1v2LandTexture)" });
    addPath(surface, "M376 212 C421 166 494 184 523 241 C548 292 515 360 458 390 C404 419 335 392 318 328 C303 272 329 243 376 212 Z", "url(#p1v2East)", ".94", { filter: "url(#p1v2LandTexture)" });
    addPath(surface, "M176 382 C221 348 302 345 371 373 C419 393 446 429 426 464 C379 498 298 508 232 488 C178 471 141 434 154 405 C160 395 167 388 176 382 Z", "url(#p1v2South)", ".94", { filter: "url(#p1v2LandTexture)" });
    addPath(surface, "M152 477 C203 449 288 447 360 466 C414 481 445 504 443 529 C386 558 287 566 210 548 C158 535 121 511 118 493 C127 487 139 482 152 477 Z", "url(#p1v2Polar)", ".88", { filter: "url(#p1v2LandTexture)" });

    addPath(surface, "M233 242 C257 232 288 235 304 251 C282 263 252 262 229 251 Z", "#a39a6f", ".72", { filter: "url(#p1v2LandTexture)" });
    addPath(surface, "M329 286 C355 273 388 279 407 301 C383 316 349 315 326 298 Z", "#6b8d59", ".76", { filter: "url(#p1v2LandTexture)" });
    addPath(surface, "M126 292 C151 277 184 282 201 305 C177 319 145 318 122 302 Z", "#514b42", ".72", { filter: "url(#p1v2LandTexture)" });

    addLine(surface, "M54 116 C103 158 95 220 55 267 C103 304 103 374 57 456", "rgba(242,199,111,.20)", "4", ".85");
    addLine(surface, "M546 116 C497 158 505 220 545 267 C497 304 497 374 543 456", "rgba(242,199,111,.20)", "4", ".85");
    addLine(surface, "M300 55 L300 545", "rgba(242,199,111,.26)", "2", ".76");
    addLine(surface, "M70 300 H530", "rgba(255,255,255,.10)", "1.5", ".70");

    addLine(surface, "M200 230 C238 247 294 250 348 232", "rgba(245,245,245,.32)", "2", ".76");
    addLine(surface, "M184 292 C248 312 333 311 403 281", "rgba(245,245,245,.20)", "2", ".62");
    addLine(surface, "M168 420 C241 438 349 437 416 403", "rgba(245,245,245,.21)", "2", ".62");
    addLine(surface, "M115 244 C145 222 181 223 214 248", "rgba(255,255,255,.18)", "1.6", ".60");
    addLine(surface, "M390 238 C428 220 472 235 501 271", "rgba(255,255,255,.18)", "1.6", ".60");

    root.appendChild(surface);

    var cloudsGroup = svg("g", { class: "planet-one-clouds", "clip-path": "url(#p1v2Clip)", opacity: ".66", filter: "url(#p1v2Clouds)" });
    addLine(cloudsGroup, "M88 154 C164 115 238 133 309 158 C378 183 443 170 512 132", "rgba(255,255,255,.82)", "15", ".82");
    addLine(cloudsGroup, "M62 330 C139 300 227 308 302 331 C390 358 467 334 541 298", "rgba(255,255,255,.72)", "15", ".78");
    addLine(cloudsGroup, "M120 450 C202 419 292 428 364 451 C419 469 470 458 524 430", "rgba(255,255,255,.72)", "12", ".72");
    addLine(cloudsGroup, "M132 82 C183 60 251 67 292 95", "rgba(255,255,255,.64)", "10", ".70");
    addLine(cloudsGroup, "M246 205 C304 187 375 195 423 226", "rgba(255,255,255,.58)", "9", ".65");
    root.appendChild(cloudsGroup);

    var core = svg("g", { class: "planet-one-core-signal", opacity: ".20" });
    core.appendChild(svg("circle", { cx: "300", cy: "300", r: "44", fill: "none", stroke: "rgba(143,240,198,.38)", "stroke-width": "2" }));
    core.appendChild(svg("circle", { cx: "300", cy: "300", r: "22", fill: "rgba(143,240,198,.10)", stroke: "rgba(242,199,111,.28)", "stroke-width": "1.5" }));
    core.appendChild(svg("path", { d: "M300 245 C335 273 335 327 300 355 C265 327 265 273 300 245 Z", fill: "rgba(143,240,198,.08)", stroke: "rgba(242,199,111,.24)", "stroke-width": "1.5" }));
    root.appendChild(core);

    root.appendChild(svg("circle", { cx: "300", cy: "300", r: "258", fill: "url(#p1v2LimbLight)" }));
    root.appendChild(svg("circle", { cx: "300", cy: "300", r: "258", fill: "url(#p1v2Terminator)" }));

    addLine(root, "M186 49 C252 139 252 461 186 551", "rgba(255,255,255,.08)", "1.2", ".80");
    addLine(root, "M414 49 C348 139 348 461 414 551", "rgba(255,255,255,.08)", "1.2", ".80");
    addLine(root, "M79 200 C185 233 415 233 521 200", "rgba(255,255,255,.07)", "1", ".80");
    addLine(root, "M79 400 C185 367 415 367 521 400", "rgba(255,255,255,.07)", "1", ".80");

    root.appendChild(svg("circle", { cx: "300", cy: "300", r: "258", fill: "none", stroke: "rgba(145,189,255,.42)", "stroke-width": "3" }));
    root.appendChild(svg("circle", { cx: "300", cy: "300", r: "265", fill: "none", stroke: "rgba(145,189,255,.18)", "stroke-width": "12" }));
    root.appendChild(svg("circle", { cx: "300", cy: "300", r: "272", fill: "none", stroke: "rgba(145,189,255,.08)", "stroke-width": "18" }));

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
    mount.dataset.realismPass = "v2";
    mount.dataset.cartoonBlobGlobeRetired = "true";

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
    document.documentElement.dataset.planetOneRealismPass = "v2";
    document.documentElement.dataset.cartoonBlobGlobeRetired = "true";

    return {
      ok: true,
      version: VERSION,
      planetOneRenderActive: true,
      renderer: "/world/render/planet-one.render.js",
      globeDemoStatusRetired: true,
      treeDemoMode: true,
      renderLanesSeparated: true,
      noRenderLaneCollapse: true,
      realismPass: "v2",
      cartoonBlobGlobeRetired: true
    };
  }

  window.DGBPlanetOneRenderTeam = {
    version: VERSION,
    render: renderPlanetOne,
    renderPlanetOne: renderPlanetOne
  };
})();
