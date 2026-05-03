/* /assets/showroom.globe.instrument.js
   SHOWROOM_GLOBE_ACTUAL_BODIES_INSTRUMENT_RESTORE_TNT_v1

   ROLE:
   Canonical Demo Actual Universe body-render authority.

   PRECINCT:
   Earth, Sun, and Moon body rendering inside /showroom/globe/.

   JURISDICTION:
   Render the selected actual body into the provided mount.
   Expose renderGlobe/mount/render aliases required by the route.
   Support body selection, motion, speed, reverse, reset, and zoom.

   NON-JURISDICTION:
   Does not own route copy.
   Does not own global navigation.
   Does not own Gauges scoring.
   Does not own Product chamber.
   Does not own Planet 1 terrain chain.
   Does not rewrite /showroom/globe/index.html.

   RETURN RECEIPT:
   Earth, Sun, and Moon render visibly from this instrument.
   Blank canvas state is replaced by a live instrument canvas.
*/

(function attachShowroomGlobeActualBodiesInstrument(global) {
  "use strict";

  var VERSION = "SHOWROOM_GLOBE_ACTUAL_BODIES_INSTRUMENT_RESTORE_TNT_v1";
  var ACTIVE_ROUTE = "/showroom/globe/";
  var BODY_NAMES = ["earth", "sun", "moon"];

  var state = {
    active: true,
    body: "earth",
    running: true,
    speed: "normal",
    direction: "forward",
    zoom: 100,
    frame: 0,
    mount: null,
    shell: null,
    canvas: null,
    ctx: null,
    raf: null,
    lastReceipt: null,
    lastError: null,
    wiredControls: false
  };

  function now() {
    return new Date().toISOString();
  }

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function bodyTitle(body) {
    if (body === "sun") return "Sun";
    if (body === "moon") return "Moon";
    return "Earth";
  }

  function bodyDescription(body) {
    if (body === "sun") {
      return "Actual Sun body mounted from the canonical instrument.";
    }
    if (body === "moon") {
      return "Actual Moon body mounted from the canonical instrument.";
    }
    return "Actual Earth body mounted from the canonical instrument.";
  }

  function normalizeBody(body) {
    body = String(body || "").toLowerCase();
    return BODY_NAMES.indexOf(body) === -1 ? "earth" : body;
  }

  function resolveMount(target) {
    if (target && target.nodeType === 1) return target;

    if (typeof target === "string" && global.document) {
      var found = global.document.querySelector(target);
      if (found) return found;
    }

    if (!global.document) return null;

    return (
      global.document.getElementById("showroom-globe-mount") ||
      global.document.getElementById("actual-bodies-mount") ||
      global.document.getElementById("actualBodyMount") ||
      global.document.getElementById("planet-one-render") ||
      global.document.querySelector("[data-showroom-globe-mount='true']") ||
      global.document.querySelector("[data-actual-bodies-mount='true']") ||
      global.document.querySelector("[data-planet-one-mount='true']") ||
      global.document.querySelector(".showroom-globe-mount") ||
      global.document.querySelector(".actual-bodies-mount")
    );
  }

  function injectStyles() {
    if (!global.document) return;
    if (global.document.getElementById("dgb-actual-bodies-instrument-style")) return;

    var style = global.document.createElement("style");
    style.id = "dgb-actual-bodies-instrument-style";
    style.textContent = [
      ".dgb-actual-bodies-stage{",
      "width:min(100%,72rem);",
      "min-width:0;",
      "margin:0 auto;",
      "display:grid;",
      "place-items:center;",
      "overflow:hidden;",
      "contain:layout paint;",
      "}",

      ".dgb-actual-bodies-shell{",
      "position:relative;",
      "width:min(86vw,42rem);",
      "max-width:100%;",
      "aspect-ratio:1;",
      "display:grid;",
      "place-items:center;",
      "overflow:visible;",
      "isolation:isolate;",
      "}",

      ".dgb-actual-bodies-shell::before,",
      ".dgb-actual-bodies-shell::after{",
      "content:\"\";",
      "position:absolute;",
      "inset:9%;",
      "border:1px solid rgba(255,255,255,.12);",
      "border-radius:50%;",
      "transform:rotate(-20deg) scaleX(1.16);",
      "pointer-events:none;",
      "z-index:-1;",
      "}",

      ".dgb-actual-bodies-shell::after{",
      "inset:16%;",
      "opacity:.56;",
      "transform:rotate(18deg) scaleX(1.28);",
      "}",

      ".dgb-actual-bodies-canvas{",
      "display:block;",
      "width:100%;",
      "height:auto;",
      "max-width:100%;",
      "aspect-ratio:1;",
      "border-radius:50%;",
      "background:transparent;",
      "touch-action:none;",
      "}",

      ".dgb-actual-bodies-copy{",
      "width:min(100%,36rem);",
      "margin:.85rem auto 0;",
      "text-align:center;",
      "overflow-wrap:break-word;",
      "}",

      ".dgb-actual-bodies-title{",
      "margin:0;",
      "color:#f7f0df;",
      "font:900 clamp(1.45rem,7vw,2.2rem)/1 Inter,system-ui,sans-serif;",
      "letter-spacing:.13em;",
      "text-transform:uppercase;",
      "}",

      ".dgb-actual-bodies-description{",
      "width:min(100%,34rem);",
      "margin:.7rem auto 0;",
      "color:rgba(247,240,223,.72);",
      "font:600 clamp(.95rem,4vw,1.13rem)/1.42 Inter,system-ui,sans-serif;",
      "text-wrap:balance;",
      "}",

      ".dgb-actual-bodies-receipt{",
      "margin:.65rem auto 0;",
      "color:rgba(247,240,223,.48);",
      "font:700 .72rem/1.35 ui-monospace,SFMono-Regular,Menlo,monospace;",
      "letter-spacing:.04em;",
      "overflow-wrap:anywhere;",
      "text-align:center;",
      "}",

      "@media(max-width:430px){",
      ".dgb-actual-bodies-shell{width:min(82vw,23rem);}",
      "}",

      "@media(max-width:360px){",
      ".dgb-actual-bodies-shell{width:min(78vw,20rem);}",
      "}"
    ].join("");

    (global.document.head || global.document.documentElement).appendChild(style);
  }

  function createStage(mount) {
    injectStyles();

    mount = resolveMount(mount);
    if (!mount || !global.document) return null;

    state.mount = mount;
    mount.dataset.actualBodiesInstrument = VERSION;
    mount.dataset.bodyRenderAuthority = "/assets/showroom.globe.instrument.js";
    mount.dataset.routeAuthority = "layout-command-panel-zoom-wrapper";
    mount.dataset.blankCanvasRepair = "active";

    mount.replaceChildren();

    var stage = global.document.createElement("div");
    stage.className = "dgb-actual-bodies-stage";
    stage.setAttribute("data-actual-bodies-stage", "true");

    var shell = global.document.createElement("div");
    shell.className = "dgb-actual-bodies-shell";
    shell.setAttribute("data-actual-bodies-shell", "true");

    var canvas = global.document.createElement("canvas");
    canvas.className = "dgb-actual-bodies-canvas";
    canvas.setAttribute("data-actual-bodies-canvas", "true");
    canvas.setAttribute("aria-label", "Demo Actual Universe Earth Sun Moon instrument canvas");

    var copy = global.document.createElement("div");
    copy.className = "dgb-actual-bodies-copy";

    var title = global.document.createElement("h2");
    title.className = "dgb-actual-bodies-title";
    title.setAttribute("data-actual-bodies-title", "true");

    var description = global.document.createElement("p");
    description.className = "dgb-actual-bodies-description";
    description.setAttribute("data-actual-bodies-description", "true");

    var receipt = global.document.createElement("p");
    receipt.className = "dgb-actual-bodies-receipt";
    receipt.setAttribute("data-actual-bodies-receipt", "true");

    shell.appendChild(canvas);
    copy.appendChild(title);
    copy.appendChild(description);
    copy.appendChild(receipt);
    stage.appendChild(shell);
    stage.appendChild(copy);
    mount.appendChild(stage);

    state.shell = shell;
    state.canvas = canvas;
    state.ctx = canvas.getContext("2d", { alpha: true });

    resizeCanvas();
    wireCanvasDrag();

    return mount;
  }

  function resizeCanvas() {
    if (!state.canvas || !state.shell) return;

    var rect = state.shell.getBoundingClientRect();
    var cssSize = Math.max(280, Math.min(960, rect.width || 520));
    var dpr = clamp(global.devicePixelRatio || 1, 1, 2);

    state.canvas.width = Math.round(cssSize * dpr);
    state.canvas.height = Math.round(cssSize * dpr);
    state.canvas.style.width = cssSize + "px";
    state.canvas.style.height = cssSize + "px";
  }

  function clear(ctx) {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  }

  function sphereClip(ctx, cx, cy, r) {
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.closePath();
    ctx.clip();
  }

  function drawOuterGlow(ctx, cx, cy, r, body) {
    var glow = ctx.createRadialGradient(cx, cy, r * 0.7, cx, cy, r * 1.2);

    if (body === "sun") {
      glow.addColorStop(0, "rgba(255,199,66,0)");
      glow.addColorStop(0.72, "rgba(255,167,35,.18)");
      glow.addColorStop(1, "rgba(255,91,20,.42)");
    } else if (body === "moon") {
      glow.addColorStop(0, "rgba(255,255,244,0)");
      glow.addColorStop(0.8, "rgba(255,255,244,.13)");
      glow.addColorStop(1, "rgba(190,196,210,.22)");
    } else {
      glow.addColorStop(0, "rgba(118,215,255,0)");
      glow.addColorStop(0.78, "rgba(118,215,255,.2)");
      glow.addColorStop(1, "rgba(118,215,255,.42)");
    }

    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, r * 1.15, 0, Math.PI * 2);
    ctx.fillStyle = glow;
    ctx.fill();
    ctx.restore();
  }

  function drawEarth(ctx, cx, cy, r, t) {
    var ocean = ctx.createRadialGradient(cx - r * 0.32, cy - r * 0.38, r * 0.08, cx, cy, r * 1.08);
    ocean.addColorStop(0, "rgba(92,226,255,1)");
    ocean.addColorStop(0.28, "rgba(18,136,204,1)");
    ocean.addColorStop(0.62, "rgba(3,72,145,1)");
    ocean.addColorStop(1, "rgba(1,20,55,1)");

    drawOuterGlow(ctx, cx, cy, r, "earth");

    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fillStyle = ocean;
    ctx.fill();
    ctx.clip();

    ctx.translate(cx, cy);
    ctx.rotate(t * 0.00005 * (state.direction === "reverse" ? -1 : 1));
    ctx.translate(-cx, -cy);

    drawLand(ctx, [
      [cx - r * 0.55, cy - r * 0.1, r * 0.34, r * 0.72, -0.16, "green"],
      [cx + r * 0.18, cy - r * 0.3, r * 0.46, r * 0.76, 0.08, "tan"],
      [cx - r * 0.05, cy + r * 0.62, r * 0.62, r * 0.1, -0.02, "ice"]
    ]);

    drawCloudLine(ctx, cx, cy - r * 0.27, r * 0.72, -0.07);
    drawCloudLine(ctx, cx + r * 0.02, cy + r * 0.04, r * 0.82, 0.06);
    drawCloudLine(ctx, cx + r * 0.04, cy + r * 0.36, r * 0.63, -0.05);

    ctx.restore();

    drawLighting(ctx, cx, cy, r, "earth");
    drawRim(ctx, cx, cy, r, "rgba(126,219,255,.5)");
  }

  function drawLand(ctx, items) {
    items.forEach(function (item) {
      var x = item[0];
      var y = item[1];
      var w = item[2];
      var h = item[3];
      var rot = item[4];
      var type = item[5];

      ctx.save();
      ctx.translate(x + w / 2, y + h / 2);
      ctx.rotate(rot);
      ctx.translate(-w / 2, -h / 2);

      ctx.beginPath();
      ctx.moveTo(w * 0.12, h * 0.05);
      ctx.lineTo(w * 0.76, h * 0.0);
      ctx.lineTo(w * 1.0, h * 0.32);
      ctx.lineTo(w * 0.86, h * 0.82);
      ctx.lineTo(w * 0.5, h);
      ctx.lineTo(w * 0.15, h * 0.86);
      ctx.lineTo(0, h * 0.42);
      ctx.closePath();

      if (type === "tan") {
        ctx.fillStyle = "rgba(180,143,70,.92)";
      } else if (type === "ice") {
        ctx.fillStyle = "rgba(232,244,255,.92)";
      } else {
        ctx.fillStyle = "rgba(86,162,83,.92)";
      }

      ctx.fill();
      ctx.restore();
    });
  }

  function drawCloudLine(ctx, cx, cy, length, rot) {
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(rot);
    ctx.beginPath();
    ctx.moveTo(-length / 2, 0);
    ctx.bezierCurveTo(-length * 0.25, -length * 0.04, length * 0.2, length * 0.04, length / 2, 0);
    ctx.strokeStyle = "rgba(255,255,255,.32)";
    ctx.lineWidth = Math.max(2, length * 0.025);
    ctx.lineCap = "round";
    ctx.stroke();
    ctx.restore();
  }

  function drawSun(ctx, cx, cy, r, t) {
    var i;
    var angle;
    var px;
    var py;
    var plasma;

    drawOuterGlow(ctx, cx, cy, r, "sun");

    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(t * 0.00008 * (state.direction === "reverse" ? -1 : 1));
    ctx.translate(-cx, -cy);

    var body = ctx.createRadialGradient(cx - r * 0.34, cy - r * 0.38, r * 0.05, cx, cy, r);
    body.addColorStop(0, "rgba(255,255,210,1)");
    body.addColorStop(0.14, "rgba(255,215,67,1)");
    body.addColorStop(0.36, "rgba(255,132,28,1)");
    body.addColorStop(0.68, "rgba(217,61,18,1)");
    body.addColorStop(1, "rgba(89,20,7,1)");

    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fillStyle = body;
    ctx.fill();
    ctx.clip();

    for (i = 0; i < 90; i += 1) {
      angle = (i * 2.399963229728653) + t * 0.00003;
      px = cx + Math.cos(angle) * r * (0.12 + ((i * 37) % 80) / 100);
      py = cy + Math.sin(angle) * r * (0.12 + ((i * 53) % 78) / 100);
      plasma = r * (0.018 + ((i * 7) % 9) / 400);

      ctx.save();
      ctx.translate(px, py);
      ctx.rotate(angle);
      ctx.scale(2.8, 1);
      ctx.beginPath();
      ctx.arc(0, 0, plasma, 0, Math.PI * 2);
      ctx.fillStyle = i % 3 === 0 ? "rgba(255,236,139,.42)" : "rgba(255,185,73,.34)";
      ctx.fill();
      ctx.restore();
    }

    ctx.restore();

    drawLighting(ctx, cx, cy, r, "sun");
    drawRim(ctx, cx, cy, r, "rgba(255,225,123,.66)");
  }

  function drawMoon(ctx, cx, cy, r, t) {
    var i;
    var craters = [
      [-0.32, -0.35, 0.09],
      [0.18, -0.42, 0.05],
      [0.48, -0.22, 0.08],
      [-0.55, -0.02, 0.06],
      [0.0, 0.05, 0.11],
      [0.45, 0.24, 0.06],
      [-0.32, 0.36, 0.08],
      [0.25, 0.56, 0.1]
    ];

    drawOuterGlow(ctx, cx, cy, r, "moon");

    var surface = ctx.createRadialGradient(cx - r * 0.35, cy - r * 0.38, r * 0.06, cx, cy, r);
    surface.addColorStop(0, "rgba(255,255,235,1)");
    surface.addColorStop(0.28, "rgba(214,214,202,1)");
    surface.addColorStop(0.7, "rgba(154,160,158,1)");
    surface.addColorStop(1, "rgba(82,88,96,1)");

    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fillStyle = surface;
    ctx.fill();
    ctx.clip();

    drawMoonMaria(ctx, cx - r * 0.22, cy - r * 0.22, r * 0.27, r * 0.19);
    drawMoonMaria(ctx, cx + r * 0.28, cy - r * 0.05, r * 0.22, r * 0.16);
    drawMoonMaria(ctx, cx + r * 0.03, cy + r * 0.2, r * 0.31, r * 0.18);
    drawMoonMaria(ctx, cx - r * 0.18, cy + r * 0.48, r * 0.2, r * 0.11);

    for (i = 0; i < craters.length; i += 1) {
      drawCrater(ctx, cx + craters[i][0] * r, cy + craters[i][1] * r, craters[i][2] * r);
    }

    ctx.restore();

    drawLighting(ctx, cx, cy, r, "moon");
    drawRim(ctx, cx, cy, r, "rgba(236,235,219,.48)");
  }

  function drawMoonMaria(ctx, x, y, w, h) {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(1.45, 1);
    ctx.beginPath();
    ctx.arc(0, 0, Math.max(w, h) * 0.5, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(83,91,92,.2)";
    ctx.fill();
    ctx.restore();
  }

  function drawCrater(ctx, x, y, r) {
    ctx.save();
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(68,72,73,.12)";
    ctx.fill();
    ctx.strokeStyle = "rgba(255,255,244,.34)";
    ctx.lineWidth = Math.max(1, r * 0.16);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(x - r * 0.22, y - r * 0.2, r * 0.45, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(255,255,255,.16)";
    ctx.fill();
    ctx.restore();
  }

  function drawLighting(ctx, cx, cy, r, body) {
    ctx.save();
    sphereClip(ctx, cx, cy, r);

    var highlight = ctx.createRadialGradient(cx - r * 0.35, cy - r * 0.38, r * 0.04, cx, cy, r * 0.92);
    highlight.addColorStop(0, body === "sun" ? "rgba(255,255,210,.42)" : "rgba(255,255,255,.28)");
    highlight.addColorStop(0.34, "rgba(255,255,255,.06)");
    highlight.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = highlight;
    ctx.fillRect(cx - r, cy - r, r * 2, r * 2);

    var terminator = ctx.createLinearGradient(cx - r * 0.3, cy - r, cx + r, cy + r);
    terminator.addColorStop(0, "rgba(255,255,255,.02)");
    terminator.addColorStop(0.55, "rgba(255,255,255,0)");
    terminator.addColorStop(1, body === "sun" ? "rgba(60,5,0,.32)" : "rgba(0,0,0,.42)");
    ctx.fillStyle = terminator;
    ctx.fillRect(cx - r, cy - r, r * 2, r * 2);

    ctx.restore();
  }

  function drawRim(ctx, cx, cy, r, color) {
    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.strokeStyle = color;
    ctx.lineWidth = Math.max(2, r * 0.012);
    ctx.stroke();
    ctx.restore();
  }

  function draw() {
    if (!state.canvas || !state.ctx) return;

    var ctx = state.ctx;
    var size = Math.min(ctx.canvas.width, ctx.canvas.height);
    var cx = ctx.canvas.width / 2;
    var cy = ctx.canvas.height / 2;
    var zoom = clamp(state.zoom, 70, 240) / 100;
    var r = size * 0.405 * zoom;
    var speedScale = state.speed === "slow" ? 0.45 : state.speed === "fast" ? 1.75 : 1;

    state.frame += state.running ? speedScale : 0;

    clear(ctx);

    ctx.save();
    if (state.body === "sun") {
      drawSun(ctx, cx, cy, r, state.frame * 16);
    } else if (state.body === "moon") {
      drawMoon(ctx, cx, cy, r, state.frame * 16);
    } else {
      drawEarth(ctx, cx, cy, r, state.frame * 16);
    }
    ctx.restore();

    updateCopy();

    if (state.running) {
      state.raf = global.requestAnimationFrame(draw);
    }
  }

  function stopLoop() {
    if (state.raf) {
      global.cancelAnimationFrame(state.raf);
      state.raf = null;
    }
  }

  function startLoop() {
    stopLoop();
    draw();
  }

  function updateCopy() {
    if (!state.mount) return;

    var title = state.mount.querySelector("[data-actual-bodies-title='true']");
    var description = state.mount.querySelector("[data-actual-bodies-description='true']");
    var receipt = state.mount.querySelector("[data-actual-bodies-receipt='true']");

    if (title) title.textContent = bodyTitle(state.body);
    if (description) description.textContent = bodyDescription(state.body);
    if (receipt) {
      receipt.textContent =
        VERSION +
        " · activeBody=" +
        state.body +
        " · speed=" +
        state.speed +
        " · direction=" +
        state.direction +
        " · zoom=" +
        state.zoom +
        "%";
    }

    syncExternalText();
  }

  function syncExternalText() {
    if (!global.document) return;

    var possibleTitle =
      global.document.getElementById("bodyTitle") ||
      global.document.querySelector("[data-body-title='true']") ||
      global.document.querySelector(".body-title");

    var possibleDescription =
      global.document.getElementById("bodyDescription") ||
      global.document.querySelector("[data-body-description='true']") ||
      global.document.querySelector(".body-description");

    var statusLine =
      global.document.getElementById("statusLine") ||
      global.document.querySelector("[data-status-line='true']") ||
      global.document.querySelector(".status-line");

    if (possibleTitle) possibleTitle.textContent = bodyTitle(state.body);
    if (possibleDescription) possibleDescription.textContent = bodyDescription(state.body);
    if (statusLine) {
      statusLine.textContent =
        "Motion speed: " +
        state.speed +
        " · direction: " +
        state.direction +
        " · active body: " +
        bodyTitle(state.body) +
        " · zoom: " +
        state.zoom +
        "%";
    }
  }

  function setPressedButtons() {
    if (!global.document) return;

    Array.prototype.slice.call(global.document.querySelectorAll("button, [role='button']")).forEach(function (button) {
      var text = String(button.textContent || "").toLowerCase();
      var isBodyButton = text.indexOf("view earth") !== -1 || text.indexOf("view sun") !== -1 || text.indexOf("view moon") !== -1;
      var isSpeedButton = text === "slow" || text === "normal" || text === "fast";

      if (isBodyButton) {
        var active =
          (state.body === "earth" && text.indexOf("view earth") !== -1) ||
          (state.body === "sun" && text.indexOf("view sun") !== -1) ||
          (state.body === "moon" && text.indexOf("view moon") !== -1);

        button.classList.toggle("is-active", active);
        button.setAttribute("aria-pressed", String(active));
      }

      if (isSpeedButton) {
        var speedActive = text === state.speed;
        button.classList.toggle("is-active", speedActive);
        button.setAttribute("aria-pressed", String(speedActive));
      }
    });
  }

  function setActiveBody(body) {
    state.body = normalizeBody(body);
    setPressedButtons();
    startLoop();

    return writeReceipt("BODY_CHANGED");
  }

  function setMotion(options) {
    options = options || {};

    if (typeof options.running === "boolean") state.running = options.running;
    if (options.speed) state.speed = normalizeSpeed(options.speed);
    if (options.direction) state.direction = options.direction === "reverse" ? "reverse" : "forward";
    if (options.zoom != null) state.zoom = clamp(Number(options.zoom) || 100, 70, 240);
    if (options.activeBody || options.body) state.body = normalizeBody(options.activeBody || options.body);

    setPressedButtons();
    startLoop();

    return writeReceipt("MOTION_CHANGED");
  }

  function normalizeSpeed(speed) {
    speed = String(speed || "normal").toLowerCase();
    if (speed !== "slow" && speed !== "fast") return "normal";
    return speed;
  }

  function reset() {
    state.running = true;
    state.speed = "normal";
    state.direction = "forward";
    state.zoom = 100;
    setPressedButtons();
    startLoop();

    return writeReceipt("RESET");
  }

  function pause() {
    state.running = false;
    stopLoop();
    draw();

    return writeReceipt("PAUSE");
  }

  function resume() {
    state.running = true;
    startLoop();

    return writeReceipt("RESUME");
  }

  function reverse() {
    state.direction = state.direction === "forward" ? "reverse" : "forward";
    startLoop();

    return writeReceipt("REVERSE");
  }

  function setSpeed(speed) {
    state.speed = normalizeSpeed(speed);
    setPressedButtons();
    startLoop();

    return writeReceipt("SPEED_CHANGED");
  }

  function setZoom(zoom) {
    if (zoom === "in") state.zoom = clamp(state.zoom + 10, 70, 240);
    else if (zoom === "out") state.zoom = clamp(state.zoom - 10, 70, 240);
    else if (zoom === "reset") state.zoom = 100;
    else state.zoom = clamp(Number(zoom) || 100, 70, 240);

    startLoop();

    return writeReceipt("ZOOM_CHANGED");
  }

  function buttonIntent(node) {
    var raw = String((node && node.textContent) || "").trim().toLowerCase();
    var dataBody = node && (node.getAttribute("data-body-button") || node.getAttribute("data-body"));
    var dataMotion = node && node.getAttribute("data-motion");
    var dataSpeed = node && node.getAttribute("data-speed");
    var dataZoom = node && node.getAttribute("data-zoom");

    if (dataBody) return { type: "body", value: normalizeBody(dataBody) };
    if (dataMotion) return { type: "motion", value: dataMotion };
    if (dataSpeed) return { type: "speed", value: dataSpeed };
    if (dataZoom) return { type: "zoom", value: dataZoom };

    if (raw.indexOf("view earth") !== -1) return { type: "body", value: "earth" };
    if (raw.indexOf("view sun") !== -1) return { type: "body", value: "sun" };
    if (raw.indexOf("view moon") !== -1) return { type: "body", value: "moon" };

    if (raw === "start" || raw === "resume") return { type: "motion", value: "resume" };
    if (raw === "pause") return { type: "motion", value: "pause" };
    if (raw === "reset") return { type: "motion", value: "reset" };
    if (raw === "reverse") return { type: "motion", value: "reverse" };

    if (raw === "slow" || raw === "normal" || raw === "fast") return { type: "speed", value: raw };

    if (raw.indexOf("zoom") !== -1 && raw.indexOf("reset") !== -1) return { type: "zoom", value: "reset" };
    if (raw.indexOf("zoom") !== -1 && (raw.indexOf("+") !== -1 || raw.indexOf("in") !== -1)) return { type: "zoom", value: "in" };
    if (raw.indexOf("zoom") !== -1 && (raw.indexOf("−") !== -1 || raw.indexOf("-") !== -1 || raw.indexOf("out") !== -1)) return { type: "zoom", value: "out" };

    return null;
  }

  function wireExternalControls() {
    if (!global.document || state.wiredControls) return;
    state.wiredControls = true;

    global.document.addEventListener("click", function (event) {
      var node = event.target && event.target.closest ? event.target.closest("button, [role='button'], a") : null;
      var intent = buttonIntent(node);

      if (!intent) return;

      if (node && node.tagName === "A") event.preventDefault();

      if (intent.type === "body") setActiveBody(intent.value);
      if (intent.type === "speed") setSpeed(intent.value);

      if (intent.type === "zoom") {
        setZoom(intent.value);
      }

      if (intent.type === "motion") {
        if (intent.value === "pause") pause();
        else if (intent.value === "reset") reset();
        else if (intent.value === "reverse") reverse();
        else resume();
      }
    });
  }

  function wireCanvasDrag() {
    if (!state.canvas) return;

    var dragging = false;
    var lastX = 0;

    state.canvas.addEventListener("pointerdown", function (event) {
      dragging = true;
      lastX = event.clientX;
      state.canvas.setPointerCapture(event.pointerId);
    });

    state.canvas.addEventListener("pointermove", function (event) {
      if (!dragging) return;
      var dx = event.clientX - lastX;
      lastX = event.clientX;
      state.frame += dx * (state.direction === "reverse" ? -0.12 : 0.12);
      draw();
    });

    state.canvas.addEventListener("pointerup", function () {
      dragging = false;
    });

    state.canvas.addEventListener("pointercancel", function () {
      dragging = false;
    });
  }

  function writeReceipt(status, extra) {
    state.lastReceipt = Object.assign({
      ok: true,
      status: status || "RENDERED",
      version: VERSION,
      route: ACTIVE_ROUTE,
      role: "CANONICAL_ACTUAL_BODY_RENDER_AUTHORITY",
      activeBody: state.body,
      running: state.running,
      speed: state.speed,
      direction: state.direction,
      zoom: state.zoom,
      blankCanvasRepair: true,
      ownsBodyRendering: true,
      ownsRouteCopy: false,
      ownsGlobalNavigation: false,
      ownsGaugesScoring: false,
      ownsPlanetOneTerrainChain: false,
      visualPassClaimed: false,
      ownerVisualReceiptRequired: true,
      timestamp: now()
    }, extra || {});

    if (state.mount) {
      state.mount.dataset.actualBodiesReceipt = status || "RENDERED";
      state.mount.dataset.actualBodiesInstrumentVersion = VERSION;
      state.mount.dataset.activeBody = state.body;
      state.mount.dataset.blankCanvasRepair = "complete";
    }

    return state.lastReceipt;
  }

  function renderGlobe(target, options) {
    options = options || {};

    try {
      var mount = createStage(target);
      if (!mount) {
        state.lastError = "NO_MOUNT";
        return writeReceipt("FAILED_NO_MOUNT", { ok: false, reason: "NO_MOUNT" });
      }

      if (options.activeBody || options.body) {
        state.body = normalizeBody(options.activeBody || options.body);
      }

      if (options.zoom != null) {
        state.zoom = clamp(Number(options.zoom) || 100, 70, 240);
      }

      if (options.running != null) {
        state.running = Boolean(options.running);
      }

      if (options.speed) {
        state.speed = normalizeSpeed(options.speed);
      }

      if (options.direction) {
        state.direction = options.direction === "reverse" ? "reverse" : "forward";
      }

      wireExternalControls();
      setPressedButtons();
      startLoop();

      return writeReceipt("RENDERED", {
        context: options.context || "standalone",
        caption: options.caption || "DEMO ACTUAL UNIVERSE · EARTH SUN MOON · ACTIVE"
      });
    } catch (error) {
      state.lastError = String(error && error.message ? error.message : error);
      return writeReceipt("FAILED_EXCEPTION", {
        ok: false,
        reason: state.lastError
      });
    }
  }

  function mount(target, options) {
    return renderGlobe(target, options || {});
  }

  function render(target, options) {
    return renderGlobe(target, options || {});
  }

  function renderActualBody(target, options) {
    return renderGlobe(target, options || {});
  }

  function writeReceipts(mountTarget, context, extra) {
    if (mountTarget) state.mount = resolveMount(mountTarget) || state.mount;

    return writeReceipt("RECEIPT_WRITTEN", Object.assign({
      context: context || "standalone"
    }, extra || {}));
  }

  function getStatus() {
    return {
      ok: true,
      active: true,
      VERSION: VERSION,
      version: VERSION,
      route: ACTIVE_ROUTE,
      role: "CANONICAL_ACTUAL_BODY_RENDER_AUTHORITY",
      activeBody: state.body,
      running: state.running,
      speed: state.speed,
      direction: state.direction,
      zoom: state.zoom,
      mountPresent: Boolean(state.mount),
      canvasPresent: Boolean(state.canvas),
      ownsBodyRendering: true,
      ownsRouteCopy: false,
      ownsGlobalNavigation: false,
      ownsGaugesScoring: false,
      ownsPlanetOneTerrainChain: false,
      blankCanvasRepair: true,
      lastReceipt: state.lastReceipt,
      lastError: state.lastError,
      visualPassClaimed: false,
      ownerVisualReceiptRequired: true
    };
  }

  function status() {
    return getStatus();
  }

  function bootExistingMount() {
    var mount = resolveMount(null);
    if (!mount) return false;

    renderGlobe(mount, {
      context: "auto-boot",
      activeBody: state.body,
      running: state.running,
      speed: state.speed,
      direction: state.direction,
      zoom: state.zoom
    });

    return true;
  }

  function boot() {
    wireExternalControls();

    var booted = bootExistingMount();

    if (!booted) {
      var attempts = 0;
      var timer = global.setInterval(function () {
        attempts += 1;
        if (bootExistingMount() || attempts >= 30) {
          global.clearInterval(timer);
        }
      }, 100);
    }
  }

  var api = {
    VERSION: VERSION,
    version: VERSION,

    renderGlobe: renderGlobe,
    renderActualBody: renderActualBody,
    render: render,
    mount: mount,

    setActiveBody: setActiveBody,
    setMotion: setMotion,
    start: resume,
    pause: pause,
    resume: resume,
    reset: reset,
    reverse: reverse,
    setSpeed: setSpeed,
    setZoom: setZoom,

    writeReceipts: writeReceipts,
    getStatus: getStatus,
    status: status,

    visualPassClaimed: false,
    ownerVisualReceiptRequired: true
  };

  global.DGBShowroomGlobeInstrument = api;
  global.DGBActualBodiesInstrument = api;
  global.showroomGlobeInstrument = api;

  if (global.document) {
    if (global.document.readyState === "loading") {
      global.document.addEventListener("DOMContentLoaded", boot, { once: true });
    } else {
      boot();
    }

    global.addEventListener("resize", function () {
      resizeCanvas();
      draw();
    }, { passive: true });
  }

  try {
    global.dispatchEvent(new CustomEvent("dgb:showroom:actual-bodies-instrument-restored", {
      detail: getStatus()
    }));
  } catch (error) {}
})(typeof window !== "undefined" ? window : globalThis);
