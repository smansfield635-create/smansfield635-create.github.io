/*
  SHOWROOM_GLOBE_INSTRUMENT_DEMO_PLANET_VISIBLE_TNT_v2
  OWNER=SEAN
  TARGET=/assets/showroom.globe.instrument.js
  PURPOSE=RENEW_SHOWROOM_GLOBE_INSTRUMENT_CONTRACT_AND_FORCE_VISIBLE_DEMO_PLANET_OUTPUT
  EXPECTED_GLOBAL=window.DGBShowroomGlobeInstrument
  EXPECTED_API=renderGlobe
  ROUTE_OWNER=/showroom/globe/
  VISUAL_OBJECT=DEMO_PLANET
*/

(function () {
  "use strict";

  var VERSION = "SHOWROOM_GLOBE_INSTRUMENT_DEMO_PLANET_VISIBLE_TNT_v2";
  var NS = "http://www.w3.org/2000/svg";

  function markDocument() {
    document.documentElement.dataset.showroomGlobeInstrument = VERSION;
    document.documentElement.dataset.dgbShowroomGlobeInstrument = "active";
    document.documentElement.dataset.demoPlanetVisualContract = "visible";
  }

  function removeFallback() {
    var fallback = document.getElementById("demo-planet-fallback");
    if (!fallback) return;

    fallback.dataset.active = "false";
    fallback.dataset.reason = "instrument-rendered-visible-demo-planet";
    fallback.style.display = "none";
    fallback.style.visibility = "hidden";
    fallback.style.opacity = "0";
  }

  function createEl(tag, className, text) {
    var el = document.createElement(tag);
    if (className) el.className = className;
    if (typeof text === "string") el.textContent = text;
    return el;
  }

  function svgEl(tag, attrs) {
    var el = document.createElementNS(NS, tag);
    Object.keys(attrs || {}).forEach(function (key) {
      el.setAttribute(key, attrs[key]);
    });
    return el;
  }

  function injectStyles() {
    if (document.getElementById("dgb-demo-planet-visible-style-v2")) return;

    var style = document.createElement("style");
    style.id = "dgb-demo-planet-visible-style-v2";
    style.textContent = [
      ".dgb-demo-planet-shell{",
      "position:relative;",
      "z-index:10;",
      "display:grid;",
      "justify-items:center;",
      "align-content:center;",
      "gap:18px;",
      "width:100%;",
      "min-height:440px;",
      "padding:18px;",
      "}",
      ".dgb-demo-planet-card{",
      "position:relative;",
      "display:grid;",
      "justify-items:center;",
      "gap:14px;",
      "width:min(430px,82vw);",
      "padding:18px;",
      "border:1px solid rgba(242,199,111,.38);",
      "border-radius:28px;",
      "background:radial-gradient(circle at 50% 12%,rgba(145,189,255,.16),transparent 16rem),rgba(3,7,14,.72);",
      "box-shadow:0 30px 90px rgba(0,0,0,.55),0 0 60px rgba(145,189,255,.12);",
      "}",
      ".dgb-demo-planet-svg{",
      "display:block;",
      "width:min(360px,72vw);",
      "height:auto;",
      "max-width:100%;",
      "filter:drop-shadow(0 24px 42px rgba(0,0,0,.68));",
      "}",
      ".dgb-demo-planet-caption{",
      "max-width:720px;",
      "color:rgba(244,247,255,.86);",
      "font-size:.78rem;",
      "font-weight:950;",
      "letter-spacing:.12em;",
      "line-height:1.35;",
      "text-align:center;",
      "text-transform:uppercase;",
      "}",
      ".dgb-demo-planet-telemetry{",
      "display:flex;",
      "flex-wrap:wrap;",
      "justify-content:center;",
      "gap:6px;",
      "max-width:820px;",
      "}",
      ".dgb-demo-planet-telemetry span{",
      "border:1px solid rgba(168,199,255,.18);",
      "border-radius:999px;",
      "padding:5px 8px;",
      "background:rgba(255,255,255,.05);",
      "color:rgba(244,247,255,.74);",
      "font-size:.66rem;",
      "font-weight:850;",
      "letter-spacing:.04em;",
      "text-transform:uppercase;",
      "}",
      ".dgb-demo-planet-mapkey{",
      "display:grid;",
      "grid-template-columns:repeat(2,minmax(0,1fr));",
      "gap:8px;",
      "width:min(620px,100%);",
      "}",
      ".dgb-demo-planet-mapkey div{",
      "border:1px solid rgba(168,199,255,.14);",
      "border-radius:14px;",
      "padding:8px 10px;",
      "background:rgba(255,255,255,.045);",
      "color:rgba(244,247,255,.78);",
      "font-size:.72rem;",
      "font-weight:800;",
      "line-height:1.25;",
      "}",
      ".dgb-demo-planet-mapkey strong{",
      "display:block;",
      "color:#f2c76f;",
      "font-size:.68rem;",
      "letter-spacing:.08em;",
      "text-transform:uppercase;",
      "margin-bottom:2px;",
      "}",
      "@media(max-width:620px){",
      ".dgb-demo-planet-shell{min-height:390px;padding:10px;}",
      ".dgb-demo-planet-card{width:100%;padding:12px;}",
      ".dgb-demo-planet-mapkey{grid-template-columns:1fr;}",
      "}",
      "@media(prefers-reduced-motion:no-preference){",
      ".dgb-demo-planet-svg .planet-surface{animation:dgbPlanetDrift 18s ease-in-out infinite alternate;transform-origin:200px 200px;}",
      "@keyframes dgbPlanetDrift{from{transform:rotate(-1.8deg) scale(1.01);}to{transform:rotate(1.8deg) scale(1.01);}}",
      "}"
    ].join("");

    document.head.appendChild(style);
  }

  function makeDemoPlanetSvg() {
    var svg = svgEl("svg", {
      class: "dgb-demo-planet-svg",
      viewBox: "0 0 400 400",
      role: "img",
      "aria-label": "Visible Demo Planet globe with seven-landmass vertical peeled-globe logic"
    });

    var defs = svgEl("defs");

    var ocean = svgEl("radialGradient", {
      id: "dgbOceanGradient",
      cx: "36%",
      cy: "26%",
      r: "76%"
    });
    ocean.appendChild(svgEl("stop", { offset: "0%", "stop-color": "#7fb8ff", "stop-opacity": "0.98" }));
    ocean.appendChild(svgEl("stop", { offset: "44%", "stop-color": "#236aa2", "stop-opacity": "0.98" }));
    ocean.appendChild(svgEl("stop", { offset: "78%", "stop-color": "#071a34", "stop-opacity": "1" }));
    ocean.appendChild(svgEl("stop", { offset: "100%", "stop-color": "#020712", "stop-opacity": "1" }));

    var glow = svgEl("radialGradient", {
      id: "dgbAtmosphereGlow",
      cx: "35%",
      cy: "22%",
      r: "72%"
    });
    glow.appendChild(svgEl("stop", { offset: "0%", "stop-color": "#ffffff", "stop-opacity": "0.44" }));
    glow.appendChild(svgEl("stop", { offset: "28%", "stop-color": "#91bdff", "stop-opacity": "0.18" }));
    glow.appendChild(svgEl("stop", { offset: "100%", "stop-color": "#000000", "stop-opacity": "0" }));

    var shadow = svgEl("radialGradient", {
      id: "dgbTerminator",
      cx: "72%",
      cy: "64%",
      r: "70%"
    });
    shadow.appendChild(svgEl("stop", { offset: "0%", "stop-color": "#000000", "stop-opacity": "0" }));
    shadow.appendChild(svgEl("stop", { offset: "48%", "stop-color": "#000000", "stop-opacity": "0.16" }));
    shadow.appendChild(svgEl("stop", { offset: "100%", "stop-color": "#000000", "stop-opacity": "0.72" }));

    var clip = svgEl("clipPath", { id: "dgbPlanetClip" });
    clip.appendChild(svgEl("circle", { cx: "200", cy: "200", r: "174" }));

    defs.appendChild(ocean);
    defs.appendChild(glow);
    defs.appendChild(shadow);
    defs.appendChild(clip);
    svg.appendChild(defs);

    svg.appendChild(svgEl("circle", {
      cx: "200",
      cy: "200",
      r: "184",
      fill: "rgba(145,189,255,.10)"
    }));

    svg.appendChild(svgEl("circle", {
      cx: "200",
      cy: "200",
      r: "176",
      fill: "url(#dgbOceanGradient)",
      stroke: "rgba(242,199,111,.45)",
      "stroke-width": "2"
    }));

    var surface = svgEl("g", {
      class: "planet-surface",
      "clip-path": "url(#dgbPlanetClip)"
    });

    surface.appendChild(svgEl("rect", {
      x: "26",
      y: "26",
      width: "348",
      height: "348",
      fill: "url(#dgbOceanGradient)"
    }));

    surface.appendChild(svgEl("ellipse", {
      cx: "200",
      cy: "57",
      rx: "70",
      ry: "23",
      fill: "#e8f3ff",
      opacity: "0.96"
    }));

    surface.appendChild(svgEl("ellipse", {
      cx: "200",
      cy: "105",
      rx: "96",
      ry: "42",
      fill: "#9fb2b9",
      opacity: "0.92"
    }));

    surface.appendChild(svgEl("ellipse", {
      cx: "200",
      cy: "202",
      rx: "104",
      ry: "72",
      fill: "#5f9c68",
      opacity: "0.96"
    }));

    surface.appendChild(svgEl("ellipse", {
      cx: "124",
      cy: "204",
      rx: "62",
      ry: "55",
      fill: "#6d6961",
      opacity: "0.94"
    }));

    surface.appendChild(svgEl("ellipse", {
      cx: "278",
      cy: "204",
      rx: "62",
      ry: "55",
      fill: "#75a989",
      opacity: "0.96"
    }));

    surface.appendChild(svgEl("ellipse", {
      cx: "200",
      cy: "289",
      rx: "92",
      ry: "46",
      fill: "#7f9b67",
      opacity: "0.94"
    }));

    surface.appendChild(svgEl("ellipse", {
      cx: "200",
      cy: "344",
      rx: "72",
      ry: "22",
      fill: "#dfe9f2",
      opacity: "0.96"
    }));

    surface.appendChild(svgEl("path", {
      d: "M31 61 C72 94 62 142 32 180 C68 204 72 245 33 308",
      fill: "none",
      stroke: "rgba(242,199,111,.28)",
      "stroke-width": "3",
      "stroke-linecap": "round"
    }));

    surface.appendChild(svgEl("path", {
      d: "M369 61 C328 94 338 142 368 180 C332 204 328 245 367 308",
      fill: "none",
      stroke: "rgba(242,199,111,.28)",
      "stroke-width": "3",
      "stroke-linecap": "round"
    }));

    surface.appendChild(svgEl("path", {
      d: "M200 33 L200 367",
      fill: "none",
      stroke: "rgba(242,199,111,.46)",
      "stroke-width": "2",
      "stroke-linecap": "round"
    }));

    surface.appendChild(svgEl("path", {
      d: "M48 200 H352",
      fill: "none",
      stroke: "rgba(255,255,255,.18)",
      "stroke-width": "1.5",
      "stroke-linecap": "round"
    }));

    svg.appendChild(surface);

    svg.appendChild(svgEl("circle", {
      cx: "200",
      cy: "200",
      r: "176",
      fill: "url(#dgbAtmosphereGlow)"
    }));

    svg.appendChild(svgEl("circle", {
      cx: "200",
      cy: "200",
      r: "176",
      fill: "url(#dgbTerminator)"
    }));

    svg.appendChild(svgEl("circle", {
      cx: "200",
      cy: "200",
      r: "176",
      fill: "none",
      stroke: "rgba(145,189,255,.38)",
      "stroke-width": "3"
    }));

    svg.appendChild(svgEl("path", {
      d: "M126 39 C174 95 174 305 126 361",
      fill: "none",
      stroke: "rgba(255,255,255,.12)",
      "stroke-width": "1"
    }));

    svg.appendChild(svgEl("path", {
      d: "M274 39 C226 95 226 305 274 361",
      fill: "none",
      stroke: "rgba(255,255,255,.12)",
      "stroke-width": "1"
    }));

    svg.appendChild(svgEl("path", {
      d: "M56 134 C132 158 268 158 344 134",
      fill: "none",
      stroke: "rgba(255,255,255,.10)",
      "stroke-width": "1"
    }));

    svg.appendChild(svgEl("path", {
      d: "M56 266 C132 242 268 242 344 266",
      fill: "none",
      stroke: "rgba(255,255,255,.10)",
      "stroke-width": "1"
    }));

    return svg;
  }

  function renderGlobe(mount, options) {
    if (!mount) {
      throw new Error("renderGlobe requires a mount element.");
    }

    markDocument();
    injectStyles();
    removeFallback();

    var config = options || {};
    var caption = config.caption || "DEMO PLANET · NINE SUMMITS UNIVERSE · VISIBLE INSPECTION";

    mount.innerHTML = "";
    mount.dataset.renderStatus = "mounted";
    mount.dataset.visibleGlobe = "true";
    mount.dataset.demoPlanet = "nine-summits-universe";
    mount.dataset.instrumentVersion = VERSION;
    mount.dataset.mapType = "vertical-peeled-globe-projection";
    mount.style.display = "grid";
    mount.style.placeItems = "center";
    mount.style.minHeight = "440px";
    mount.style.width = "100%";

    var shell = createEl("div", "dgb-demo-planet-shell");
    var card = createEl("div", "dgb-demo-planet-card");

    card.appendChild(makeDemoPlanetSvg());
    card.appendChild(createEl("div", "dgb-demo-planet-caption", caption));

    var telemetry = createEl("div", "dgb-demo-planet-telemetry");
    [
      "PLANET 1",
      "7 LANDMASSES",
      "MAINLAND CENTER",
      "NORTH/SOUTH CAPS",
      "OCEAN WRAP SEAM",
      "COHERENCE ACCESS",
      VERSION
    ].forEach(function (label) {
      telemetry.appendChild(createEl("span", "", label));
    });

    var key = createEl("div", "dgb-demo-planet-mapkey");
    [
      ["Top", "North Pole · upper coherence cap"],
      ["Center", "Mainland · first-entry civilization"],
      ["Left", "West Region · trial and proof"],
      ["Right", "East Region · learning and invention"],
      ["Lower", "South Region · restoration and roots"],
      ["Bottom", "South Pole · depth coherence cap"]
    ].forEach(function (item) {
      var row = createEl("div");
      row.appendChild(createEl("strong", "", item[0]));
      row.appendChild(document.createTextNode(item[1]));
      key.appendChild(row);
    });

    card.appendChild(telemetry);
    card.appendChild(key);
    shell.appendChild(card);
    mount.appendChild(shell);

    return {
      ok: true,
      version: VERSION,
      renderGlobe: true,
      visibleGlobe: true,
      demoPlanet: "nine-summits-universe"
    };
  }

  function autoBoot() {
    var mount = document.getElementById("demo-planet-mount");
    if (!mount) return;
    if (mount.dataset.renderStatus === "mounted" && mount.dataset.instrumentVersion === VERSION) return;

    try {
      renderGlobe(mount, {
        context: "auto",
        caption: "DEMO PLANET · OUR UNIVERSE → NINE SUMMITS UNIVERSE"
      });
    } catch (error) {
      document.documentElement.dataset.demoPlanetVisualContract = "render-error";
      document.documentElement.dataset.demoPlanetRenderError = error && error.message ? error.message : "unknown";
    }
  }

  window.DGBShowroomGlobeInstrument = {
    version: VERSION,
    renderGlobe: renderGlobe,
    autoBoot: autoBoot
  };

  markDocument();

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", autoBoot);
  } else {
    autoBoot();
  }

  window.setTimeout(autoBoot, 250);
  window.setTimeout(autoBoot, 900);
})();
