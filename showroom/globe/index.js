<!DOCTYPE html>
<html
  lang="en"
  data-page-id="showroom-globe-inspect"
  data-page="showroom-globe-inspect"
  data-generation="single-file-globe-inspection-v1"
  data-estate="rich-manor-and-estate"
  data-manor-skin="active"
  data-house-field="true"
  data-gauges-truth="live-authority"
  data-construct-class="inspection"
  data-parent-route="/showroom/"
  data-earth-canvas-spine="/assets/earth/earth_canvas.js"
  data-earth-material="/assets/earth/earth_material.css"
  data-earth-surface="/assets/earth/earth_surface_2048.jpg"
  data-earth-clouds="/assets/earth/earth_clouds_2048.jpg"
  data-earth-standard="centered-satellite-earth-no-external-rings"
>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>Inspect Globe · Diamond Gate Bridge</title>

  <meta
    name="description"
    content="Dedicated globe inspection page for Diamond Gate Bridge. Loads the existing Earth canvas asset spine without Showroom cards, text blocks, or bubbles covering the globe."
  />

  <link rel="stylesheet" href="/assets/earth/earth_material.css?v=single-file-globe-inspection-v1" />

  <style>
    :root {
      color-scheme: dark;
      --ink: #f4f7ff;
      --soft: rgba(244, 247, 255, .72);
      --muted: rgba(244, 247, 255, .48);
      --gold: #f2c76f;
      --line: rgba(244, 247, 255, .14);
      --line-gold: rgba(242, 199, 111, .42);
      --black: #02050a;
      --panel: rgba(2, 5, 10, .72);
    }

    * {
      box-sizing: border-box;
    }

    html,
    body {
      margin: 0;
      width: 100%;
      height: 100%;
      min-height: 100%;
      overflow: hidden;
      background: var(--black);
      color: var(--ink);
      font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    }

    body {
      background:
        radial-gradient(circle at 50% 48%, rgba(67, 115, 198, .18), transparent 34%),
        radial-gradient(circle at 78% 18%, rgba(242, 199, 111, .08), transparent 24%),
        radial-gradient(circle at 22% 82%, rgba(92, 151, 238, .10), transparent 26%),
        linear-gradient(180deg, #000209 0%, #020713 56%, #000107 100%);
    }

    body::before {
      content: "";
      position: fixed;
      inset: 0;
      z-index: 0;
      pointer-events: none;
      opacity: .78;
      background-image:
        radial-gradient(circle, rgba(255,255,255,.82) 0 1px, transparent 1.35px),
        radial-gradient(circle, rgba(255,255,255,.30) 0 1px, transparent 1.8px),
        radial-gradient(circle, rgba(242,199,111,.24) 0 1px, transparent 1.7px);
      background-size: 84px 84px, 156px 156px, 238px 238px;
      background-position: 0 0, 42px 66px, 88px 130px;
    }

    body::after {
      content: "";
      position: fixed;
      inset: 0;
      z-index: 1;
      pointer-events: none;
      background:
        radial-gradient(circle at 50% 48%, rgba(255,255,255,.035), transparent 30%),
        radial-gradient(circle at 50% 48%, transparent 0 38%, rgba(0,0,0,.38) 78%, rgba(0,0,0,.80) 100%);
    }

    a,
    button {
      font: inherit;
      color: inherit;
      -webkit-tap-highlight-color: transparent;
    }

    a {
      text-decoration: none;
    }

    a:focus-visible,
    button:focus-visible {
      outline: 2px solid var(--gold);
      outline-offset: 4px;
    }

    .inspect-page {
      position: relative;
      z-index: 2;
      width: 100vw;
      height: 100svh;
      min-height: 100svh;
      overflow: hidden;
      display: grid;
      place-items: center;
    }

    .return-link {
      position: fixed;
      top: clamp(12px, 2.5vh, 24px);
      left: clamp(12px, 2.5vw, 24px);
      z-index: 50;
      border: 1px solid var(--line-gold);
      border-radius: 999px;
      padding: 10px 14px;
      background: rgba(3, 7, 12, .58);
      color: var(--ink);
      backdrop-filter: blur(12px);
      box-shadow:
        0 14px 46px rgba(0,0,0,.34),
        inset 0 0 0 1px rgba(255,255,255,.04);
      font-size: clamp(.82rem, 2.4vw, 1rem);
      font-weight: 800;
      opacity: .56;
      transition: opacity .16s ease, background .16s ease;
    }

    .return-link:hover,
    .return-link:focus-visible {
      opacity: 1;
      background: rgba(242, 199, 111, .16);
    }

    #globe-inspect-mount {
      position: relative;
      z-index: 10;
      width: 100vw;
      height: 100svh;
      min-height: 100svh;
      display: grid;
      place-items: center;
      padding: clamp(42px, 8vh, 78px) clamp(10px, 3vw, 32px) clamp(24px, 5vh, 46px);
    }

    .inspect-earth-shell {
      width: 100%;
      height: 100%;
      display: grid;
      grid-template-rows: 1fr auto;
      align-items: center;
      justify-items: center;
      gap: clamp(10px, 2vh, 18px);
    }

    [data-dgb-earth-mount] {
      width: min(82vmin, 920px) !important;
      max-width: 94vw !important;
      min-height: auto !important;
      height: auto !important;
      margin: 0 auto !important;
      display: grid !important;
      place-items: center !important;
      isolation: isolate !important;
    }

    .dgb-earth-stage {
      width: min(82vmin, 920px) !important;
      max-width: 94vw !important;
      min-height: auto !important;
      height: auto !important;
      display: grid !important;
      place-items: center !important;
      margin: 0 auto !important;
      transform: none !important;
    }

    .dgb-earth-tilt,
    .dgb-earth-sphere {
      width: 100% !important;
      max-width: 100% !important;
      margin: 0 auto !important;
      transform: none !important;
    }

    .dgb-earth-sphere {
      filter:
        drop-shadow(0 0 34px rgba(97, 153, 236, .34))
        drop-shadow(0 0 92px rgba(242, 199, 111, .10));
    }

    [data-dgb-earth-canvas] {
      display: block !important;
      width: 100% !important;
      height: auto !important;
      max-width: 100% !important;
    }

    .inspect-controls {
      z-index: 20;
      width: min(560px, 88vw);
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 10px;
      opacity: .18;
      filter: grayscale(.72);
      transform: scale(.94);
      transition: opacity .18s ease, filter .18s ease, transform .18s ease;
    }

    .inspect-controls:hover,
    .inspect-controls:focus-within {
      opacity: .92;
      filter: none;
      transform: scale(1);
    }

    .inspect-controls button,
    .inspect-readout {
      min-height: clamp(42px, 6.8vh, 62px);
      border: 1px solid rgba(255,255,255,.13);
      border-radius: 999px;
      display: grid;
      place-items: center;
      background: rgba(0, 3, 9, .68);
      color: rgba(255,255,255,.94);
      font-size: clamp(.9rem, 3.2vw, 1.18rem);
      font-weight: 850;
      box-shadow:
        inset 0 0 0 1px rgba(255,255,255,.035),
        0 10px 32px rgba(0,0,0,.24);
    }

    .inspect-controls button {
      cursor: pointer;
    }

    .inspect-controls button:hover {
      border-color: var(--line-gold);
      background: rgba(242,199,111,.16);
    }

    .inspect-readout {
      grid-column: 1 / -1;
      color: rgba(211, 215, 238, .82);
      letter-spacing: .03em;
    }

    .load-state {
      position: fixed;
      left: 50%;
      bottom: clamp(16px, 4vh, 32px);
      z-index: 5;
      transform: translateX(-50%);
      color: var(--muted);
      font-size: .74rem;
      letter-spacing: .14em;
      text-transform: uppercase;
      pointer-events: none;
    }

    .error-card {
      position: relative;
      z-index: 20;
      width: min(720px, calc(100vw - 34px));
      border: 1px solid rgba(255, 140, 140, .44);
      border-radius: 28px;
      padding: 24px;
      background: rgba(18, 4, 6, .78);
      box-shadow: 0 28px 90px rgba(0,0,0,.44);
    }

    .error-card .kicker {
      margin: 0 0 10px;
      color: #ff9d9d;
      font-size: .74rem;
      letter-spacing: .15em;
      text-transform: uppercase;
    }

    .error-card h1 {
      margin: 0 0 12px;
      font-size: clamp(1.8rem, 5vw, 3.4rem);
      letter-spacing: -.05em;
    }

    .error-card p {
      margin: 0;
      color: var(--soft);
      line-height: 1.45;
    }

    .error-card code {
      color: var(--gold);
      overflow-wrap: anywhere;
    }

    .audit-source,
    .sr-only {
      position: absolute !important;
      width: 1px !important;
      height: 1px !important;
      overflow: hidden !important;
      clip: rect(0 0 0 0) !important;
      clip-path: inset(50%) !important;
      white-space: nowrap !important;
      border: 0 !important;
      padding: 0 !important;
      margin: -1px !important;
    }

    @media (max-width: 760px) {
      #globe-inspect-mount {
        padding-top: 54px;
        padding-bottom: 18px;
      }

      [data-dgb-earth-mount],
      .dgb-earth-stage {
        width: min(78vmin, 92vw) !important;
      }

      .inspect-controls {
        width: min(440px, 86vw);
      }

      .return-link {
        font-size: .86rem;
        padding: 9px 12px;
      }
    }
  </style>
</head>

<body>
  <main
    class="inspect-page"
    data-page-id="showroom-globe-inspect"
    data-page="showroom-globe-inspect"
    data-estate="rich-manor-and-estate"
    data-manor-skin="active"
    data-house-field="true"
    data-gauges-truth="live-authority"
    data-construct-class="inspection"
    data-parent-route="/showroom/"
  >
    <a class="return-link" href="/showroom/">Return to Showroom</a>

    <section
      id="globe-inspect-mount"
      aria-label="Dedicated globe inspection field"
      data-earth-canvas-spine="/assets/earth/earth_canvas.js"
      data-earth-surface="/assets/earth/earth_surface_2048.jpg"
      data-earth-clouds="/assets/earth/earth_clouds_2048.jpg"
      data-earth-standard="centered-satellite-earth-no-external-rings"
    >
      <p class="load-state">Loading Earth inspection field</p>
    </section>

    <section class="audit-source" aria-label="Globe inspection audit source">
      <a href="/showroom/">Showroom</a>
      <a href="/">Compass</a>
      <a href="/gauges/">Gauges</a>
      <span>route-exists</span>
      <span>estate=rich-manor-and-estate</span>
      <span>manor-skin=active</span>
      <span>house-field=true</span>
      <span>gauges-truth=live-authority</span>
      <span>construct-class=inspection</span>
      <span>parent-route=/showroom/</span>
      <span>earth-canvas-spine=/assets/earth/earth_canvas.js</span>
      <span>earth-surface=/assets/earth/earth_surface_2048.jpg</span>
      <span>earth-clouds=/assets/earth/earth_clouds_2048.jpg</span>
      <span>earth-standard=centered-satellite-earth-no-external-rings</span>
      <span>SHOWROOM_GLOBE_SINGLE_FILE_INSPECTION_TNT_v1</span>
    </section>
  </main>

  <script src="/assets/earth/earth_canvas.js?v=single-file-globe-inspection-v1" defer></script>

  <script>
    (function () {
      "use strict";

      var SURFACE = "/assets/earth/earth_surface_2048.jpg";
      var CLOUDS = "/assets/earth/earth_clouds_2048.jpg";
      var mount = null;
      var api = null;
      var attempts = 0;
      var maxAttempts = 40;

      function create(tag, attrs, children) {
        var node = document.createElement(tag);

        Object.keys(attrs || {}).forEach(function (key) {
          var value = attrs[key];
          if (value === null || value === undefined || value === false) return;

          if (key === "className") node.className = value;
          else if (key === "text") node.textContent = value;
          else node.setAttribute(key, String(value));
        });

        (children || []).forEach(function (child) {
          if (typeof child === "string") node.appendChild(document.createTextNode(child));
          else if (child) node.appendChild(child);
        });

        return node;
      }

      function renderError(title, message) {
        if (!mount) return;

        mount.replaceChildren(
          create("article", { className: "error-card" }, [
            create("p", { className: "kicker", text: "Globe inspection failure" }),
            create("h1", { text: title }),
            create("p", {}, [message])
          ])
        );

        mount.dataset.renderStatus = "error";
      }

      function updateReadout() {
        var readout = document.querySelector("[data-inspect-readout]");
        var pause = document.querySelector("[data-action='toggle-spin']");

        if (!api || typeof api.getStatus !== "function") return;

        var status = api.getStatus();

        if (readout) {
          readout.textContent = "Zoom " + Math.round(Number(status.zoom || 1) * 100) + "%";
        }

        if (pause) {
          pause.textContent = status.paused ? "Resume Spin" : "Pause Spin";
        }

        mount.dataset.renderStatus = status.runtimeStatus || "mounted";
        mount.dataset.earthProjection = status.projection || "full-globe-inverse-orthographic";
        mount.dataset.earthCameraMode = status.cameraMode || "full-globe-orbital";
      }

      function bindControls(shell) {
        shell.querySelectorAll("[data-action]").forEach(function (button) {
          button.addEventListener("click", function () {
            if (!api) return;

            var action = button.getAttribute("data-action");

            if (action === "zoom-in" && typeof api.zoomIn === "function") api.zoomIn();
            if (action === "zoom-out" && typeof api.zoomOut === "function") api.zoomOut();
            if (action === "reset" && typeof api.resetView === "function") api.resetView();
            if (action === "toggle-spin" && typeof api.toggleSpin === "function") api.toggleSpin();

            updateReadout();
          });
        });
      }

      function build() {
        mount = document.getElementById("globe-inspect-mount");
        if (!mount) return;

        if (!window.DGBEarthCanvas || typeof window.DGBEarthCanvas.create !== "function") {
          attempts += 1;

          if (attempts < maxAttempts) {
            window.setTimeout(build, 100);
            return;
          }

          renderError(
            "Earth canvas is unavailable.",
            create("span", {}, [
              "Expected ",
              create("code", { text: "window.DGBEarthCanvas.create" }),
              " from ",
              create("code", { text: "/assets/earth/earth_canvas.js" }),
              "."
            ])
          );
          return;
        }

        var canvas = create("canvas", {
          "data-dgb-earth-canvas": "true",
          "aria-label": "Inspectable Earth canvas"
        });

        var earthMount = create("section", {
          "data-dgb-earth-mount": "true",
          "data-earth-canvas-spine": "/assets/earth/earth_canvas.js",
          "data-earth-surface": SURFACE,
          "data-earth-clouds": CLOUDS,
          "data-earth-standard": "centered-satellite-earth-no-external-rings",
          "aria-label": "Centered inspectable Earth"
        }, [
          create("div", { className: "dgb-earth-stage" }, [
            create("div", { className: "dgb-earth-tilt" }, [
              create("div", { className: "dgb-earth-sphere" }, [canvas])
            ])
          ])
        ]);

        var controls = create("div", { className: "inspect-controls", "data-inspect-controls": "true" }, [
          create("button", { type: "button", "data-action": "zoom-out", text: "Zoom Out" }),
          create("button", { type: "button", "data-action": "zoom-in", text: "Zoom In" }),
          create("button", { type: "button", "data-action": "reset", text: "Reset Earth" }),
          create("button", { type: "button", "data-action": "toggle-spin", text: "Pause Spin" }),
          create("div", { className: "inspect-readout", "data-inspect-readout": "true", text: "Zoom 100%" })
        ]);

        var shell = create("section", { className: "inspect-earth-shell" }, [
          earthMount,
          controls
        ]);

        mount.replaceChildren(shell);
        mount.dataset.renderStatus = "mounting";

        api = window.DGBEarthCanvas.create({
          mount: earthMount,
          canvas: canvas,
          surface: SURFACE,
          clouds: CLOUDS
        });

        if (!api) {
          renderError("Earth canvas did not initialize.", "The Earth renderer returned no API object.");
          return;
        }

        bindControls(shell);
        updateReadout();

        window.setTimeout(updateReadout, 300);
        window.setTimeout(updateReadout, 1200);

        mount.dataset.renderStatus = "complete";
      }

      if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", build, { once: true });
      } else {
        build();
      }
    })();
  </script>
</body>
</html>
