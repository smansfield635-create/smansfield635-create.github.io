/*
══════════════════════════════════════════════════════════════════════
FULL_FILE_TNT
FILE=/assets/showroom.globe.instrument.js
TNT_ID=SHOWROOM_GLOBE_INSTRUMENT_HARD_MOUNT_ACTUAL_BODIES_TNT_v2
MODE=FULL_FILE_REPLACEMENT
PRECINCT=DEMO_ACTUAL_UNIVERSE_CANONICAL_GLOBE_INSTRUMENT
JURISDICTION=EARTH_SUN_MOON_CANVAS_BODY_RENDERING_AND_ROUTE_CONTROL_API
NON_JURISDICTION=ROUTE_LAYOUT, ROUTE_COPY, GAUGES_SCORING, GLOBAL_NAV, PLANET_1, DEMO_UNIVERSE_DATA_MERGE
EARTH_RULE=ACTUAL_EARTH_BODY
SUN_RULE=ACTUAL_PHYSICAL_SUN_BODY
MOON_RULE=ACTUAL_PHYSICAL_MOON_BODY
GRAPHICBOX=FORBIDDEN
IMAGE_GENERATION=FORBIDDEN
ROUTE_REWRITE=FORBIDDEN
DATA_RULE=DEMO_UNIVERSE_AND_DEMO_ACTUAL_UNIVERSE_DATA_FLY_SEPARATELY
══════════════════════════════════════════════════════════════════════
*/

(function () {
  "use strict";

  var ROOT_SELECTORS = [
    "#showroomGlobeMount",
    "[data-showroom-globe-root]",
    "[data-showroom-globe-mount]",
    "[data-globe-root]",
    "[data-globe-mount]",
    "[data-planet-mount]"
  ];

  var INSTANCES = new WeakMap();

  function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
  }

  function noise(x, y, seed) {
    var n = Math.sin(x * 127.1 + y * 311.7 + seed * 74.7) * 43758.5453123;
    return n - Math.floor(n);
  }

  function findMount(input) {
    if (input && input.nodeType === 1) return input;

    for (var i = 0; i < ROOT_SELECTORS.length; i += 1) {
      var node = document.querySelector(ROOT_SELECTORS[i]);
      if (node) return node;
    }

    return null;
  }

  function empty(node) {
    while (node.firstChild) node.removeChild(node.firstChild);
  }

  function installStyle() {
    if (document.getElementById("dgb-actual-body-style")) return;

    var style = document.createElement("style");
    style.id = "dgb-actual-body-style";
    style.textContent =
      ".dgb-actual-body-shell{position:relative;width:100%;aspect-ratio:1;display:grid;place-items:center;overflow:visible;isolation:isolate}" +
      ".dgb-actual-body-shell:before{content:'';position:absolute;inset:-18%;border-radius:999px;z-index:-2;background:radial-gradient(circle,rgba(120,199,255,.20),transparent 48%),radial-gradient(circle,rgba(255,255,255,.08),transparent 68%);pointer-events:none}" +
      ".dgb-actual-body-shell[data-body='sun']:before{inset:-28%;background:radial-gradient(circle,rgba(255,226,120,.40),transparent 38%),radial-gradient(circle,rgba(255,95,24,.24),transparent 60%),radial-gradient(circle,rgba(255,125,30,.12),transparent 78%)}" +
      ".dgb-actual-body-shell[data-body='moon']:before{background:radial-gradient(circle,rgba(238,238,225,.22),transparent 46%),radial-gradient(circle,rgba(166,207,255,.08),transparent 72%)}" +
      ".dgb-actual-body-canvas{display:block;width:100%;height:100%;border-radius:50%;touch-action:none;filter:drop-shadow(0 32px 58px rgba(0,0,0,.66))}";

    document.head.appendChild(style);
  }

  function project(lon, lat, centerLon, cx, cy, r) {
    var lonRad = ((lon - centerLon) * Math.PI) / 180;
    var latRad = (lat * Math.PI) / 180;
    var x = Math.cos(latRad) * Math.sin(lonRad);
    var y = Math.sin(latRad);
    var z = Math.cos(latRad) * Math.cos(lonRad);

    return {
      x: cx + x * r,
      y: cy - y * r,
      z: z,
      visible: z > -0.08
    };
  }

  function polygon(ctx, points, centerLon, cx, cy, r, fill, stroke) {
    var started = false;
    ctx.beginPath();

    for (var i = 0; i < points.length; i += 1) {
      var p = project(points[i][0], points[i][1], centerLon, cx, cy, r);
      if (!p.visible) {
        started = false;
        continue;
      }

      if (!started) {
        ctx.moveTo(p.x, p.y);
        started = true;
      } else {
        ctx.lineTo(p.x, p.y);
      }
    }

    if (!started) return;

    ctx.closePath();
    ctx.fillStyle = fill;
    ctx.fill();

    if (stroke) {
      ctx.globalAlpha = 0.55;
      ctx.strokeStyle = stroke;
      ctx.lineWidth = Math.max(1, r * 0.006);
      ctx.stroke();
      ctx.globalAlpha = 1;
    }
  }

  function cloud(ctx, centerLon, cx, cy, r, lat, phase, alpha) {
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.strokeStyle = "rgba(255,255,255,.78)";
    ctx.lineWidth = Math.max(1, r * 0.018);
    ctx.lineCap = "round";
    ctx.beginPath();

    var started = false;
    for (var lon = -180; lon <= 180; lon += 3) {
      var wave = lat + Math.sin((lon + phase) * 0.05) * 4 + Math.sin((lon + phase) * 0.13) * 1.5;
      var p = project(lon, wave, centerLon, cx, cy, r);
      if (!p.visible) {
        started = false;
        continue;
      }

      if (!started) {
        ctx.moveTo(p.x, p.y);
        started = true;
      } else {
        ctx.lineTo(p.x, p.y);
      }
    }

    ctx.stroke();
    ctx.restore();
  }

  function drawEarth(ctx, cx, cy, r, rotation) {
    var centerLon = -82 + rotation * 26;

    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.clip();

    var ocean = ctx.createRadialGradient(cx - r * 0.35, cy - r * 0.34, r * 0.04, cx + r * 0.1, cy + r * 0.13, r * 1.08);
    ocean.addColorStop(0, "#92e8ff");
    ocean.addColorStop(0.2, "#2ca7df");
    ocean.addColorStop(0.48, "#0e559a");
    ocean.addColorStop(0.76, "#072962");
    ocean.addColorStop(1, "#010712");
    ctx.fillStyle = ocean;
    ctx.fillRect(cx - r, cy - r, r * 2, r * 2);

    var lands = [
      [[-168,72],[-132,70],[-104,62],[-70,57],[-55,45],[-68,22],[-88,15],[-102,18],[-118,31],[-128,48],[-160,55]],
      [[-104,22],[-84,20],[-78,12],[-84,8],[-96,14]],
      [[-82,12],[-61,8],[-44,-5],[-38,-24],[-51,-55],[-68,-48],[-78,-18]],
      [[-73,84],[-21,81],[-18,62],[-48,58],[-70,67]],
      [[-18,36],[11,37],[34,28],[50,10],[43,-34],[19,-35],[-5,-20],[-17,5]],
      [[-10,72],[38,70],[84,61],[132,55],[170,48],[154,20],[106,4],[66,18],[36,34],[8,45],[-10,55]],
      [[112,-11],[154,-12],[151,-39],[116,-42],[109,-24]],
      [[-180,-67],[-120,-72],[-60,-68],[0,-74],[70,-68],[140,-72],[180,-67],[180,-90],[-180,-90]]
    ];

    var colors = ["#5f8c4d", "#75a84f", "#4f8146", "#e7eadc", "#89703d", "#7f8b4c", "#9b7b3f", "#f1f2e9"];

    for (var i = 0; i < lands.length; i += 1) {
      polygon(ctx, lands[i], centerLon, cx, cy, r, colors[i], "rgba(246,238,193,.42)");
    }

    cloud(ctx, centerLon, cx, cy, r, 28, rotation * 42, 0.34);
    cloud(ctx, centerLon, cx, cy, r, 5, rotation * -55, 0.26);
    cloud(ctx, centerLon, cx, cy, r, -34, rotation * 46, 0.24);

    for (var c = 0; c < 80; c += 1) {
      var lon = -180 + noise(c, 3, 11) * 360;
      var lat = -62 + noise(c, 7, 19) * 124;
      var p = project(lon, lat, centerLon, cx, cy, r);
      if (!p.visible) continue;

      var size = r * (0.01 + noise(c, 9, 4) * 0.035);
      ctx.globalAlpha = 0.08 + noise(c, 6, 2) * 0.14;
      ctx.fillStyle = "rgba(255,255,255,.9)";
      ctx.beginPath();
      ctx.ellipse(p.x, p.y, size * 2.7, size * 0.8, noise(c, 1, 9) * Math.PI, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.globalAlpha = 1;

    var shade = ctx.createRadialGradient(cx - r * 0.38, cy - r * 0.35, r * 0.08, cx + r * 0.3, cy + r * 0.18, r * 1.12);
    shade.addColorStop(0, "rgba(255,255,255,.2)");
    shade.addColorStop(0.46, "rgba(255,255,255,.02)");
    shade.addColorStop(0.76, "rgba(0,17,55,.22)");
    shade.addColorStop(1, "rgba(0,0,0,.7)");
    ctx.fillStyle = shade;
    ctx.fillRect(cx - r, cy - r, r * 2, r * 2);

    ctx.restore();

    var atm = ctx.createRadialGradient(cx, cy, r * 0.72, cx, cy, r * 1.08);
    atm.addColorStop(0, "rgba(255,255,255,0)");
    atm.addColorStop(0.72, "rgba(121,199,255,.08)");
    atm.addColorStop(0.88, "rgba(117,202,255,.42)");
    atm.addColorStop(1, "rgba(49,119,255,0)");
    ctx.fillStyle = atm;
    ctx.beginPath();
    ctx.arc(cx, cy, r * 1.08, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = "rgba(142,215,255,.68)";
    ctx.lineWidth = Math.max(1, r * 0.012);
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.stroke();
  }

  function drawSun(ctx, cx, cy, r, rotation) {
    ctx.save();

    for (var layer = 0; layer < 4; layer += 1) {
      var radius = r * (1.12 + layer * 0.16);
      var alpha = 0.18 / (layer + 1);
      var corona = ctx.createRadialGradient(cx, cy, r * 0.82, cx, cy, radius);
      corona.addColorStop(0, "rgba(255,213,84," + alpha + ")");
      corona.addColorStop(0.58, "rgba(255,91,26," + alpha * 0.62 + ")");
      corona.addColorStop(1, "rgba(255,91,26,0)");
      ctx.fillStyle = corona;
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.fill();
    }

    for (var f = 0; f < 120; f += 1) {
      var a = (f / 120) * Math.PI * 2 + rotation * 0.16;
      var len = r * (0.08 + noise(f, 2, 30) * 0.34);
      ctx.strokeStyle = "rgba(255," + (142 + Math.floor(noise(f, 6, 2) * 88)) + ",42," + (0.08 + noise(f, 4, 5) * 0.14) + ")";
      ctx.lineWidth = Math.max(1, r * (0.004 + noise(f, 7, 7) * 0.012));
      ctx.beginPath();
      ctx.moveTo(cx + Math.cos(a) * r * 0.94, cy + Math.sin(a) * r * 0.94);
      ctx.lineTo(cx + Math.cos(a) * (r + len), cy + Math.sin(a) * (r + len));
      ctx.stroke();
    }

    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.clip();

    var base = ctx.createRadialGradient(cx - r * 0.32, cy - r * 0.34, r * 0.02, cx + r * 0.08, cy + r * 0.1, r);
    base.addColorStop(0, "#fff9b8");
    base.addColorStop(0.16, "#ffd85d");
    base.addColorStop(0.4, "#ff9b24");
    base.addColorStop(0.7, "#df3d13");
    base.addColorStop(1, "#4d0701");
    ctx.fillStyle = base;
    ctx.fillRect(cx - r, cy - r, r * 2, r * 2);

    for (var i = 0; i < 650; i += 1) {
      var angle = noise(i, 11, 5) * Math.PI * 2;
      var dist = Math.sqrt(noise(i, 17, 9)) * r * 0.98;
      var x = cx + Math.cos(angle) * dist;
      var y = cy + Math.sin(angle) * dist;
      var w = r * (0.006 + noise(i, 23, 2) * 0.024);
      var h = r * (0.003 + noise(i, 29, 6) * 0.01);
      var n = noise(i, 31, 4);

      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(angle + rotation * 0.5);
      ctx.globalAlpha = 0.1 + n * 0.38;
      ctx.fillStyle = n > 0.6 ? "#fff0a7" : n > 0.28 ? "#ffb13a" : "#c9290d";
      ctx.beginPath();
      ctx.ellipse(0, 0, w * (1.2 + n), h * (1 + n), 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    ctx.restore();

    var limb = ctx.createRadialGradient(cx, cy, r * 0.62, cx, cy, r * 1.03);
    limb.addColorStop(0, "rgba(255,255,255,0)");
    limb.addColorStop(0.72, "rgba(255,197,68,.08)");
    limb.addColorStop(0.89, "rgba(255,245,143,.42)");
    limb.addColorStop(1, "rgba(124,22,0,.48)");
    ctx.fillStyle = limb;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = "rgba(255,230,120,.7)";
    ctx.lineWidth = Math.max(1, r * 0.014);
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.stroke();
  }

  function drawCrater(ctx, x, y, radius, alpha, seed) {
    ctx.save();
    ctx.globalAlpha = alpha;

    var g = ctx.createRadialGradient(x - radius * 0.18, y - radius * 0.18, radius * 0.08, x, y, radius);
    g.addColorStop(0, "rgba(255,255,244,.28)");
    g.addColorStop(0.42, "rgba(68,70,76,.42)");
    g.addColorStop(0.76, "rgba(30,33,40,.22)");
    g.addColorStop(1, "rgba(255,255,239,.2)");
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.ellipse(x, y, radius * (1 + noise(seed, 2, 1) * 0.2), radius * (0.72 + noise(seed, 4, 2) * 0.24), noise(seed, 5, 3) * Math.PI, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = "rgba(255,255,235,.42)";
    ctx.lineWidth = Math.max(1, radius * 0.09);
    ctx.beginPath();
    ctx.ellipse(x - radius * 0.07, y - radius * 0.09, radius, radius * 0.74, 0.18, 0, Math.PI * 2);
    ctx.stroke();

    ctx.restore();
  }

  function drawMoon(ctx, cx, cy, r, rotation) {
    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.clip();

    var base = ctx.createRadialGradient(cx - r * 0.34, cy - r * 0.34, r * 0.05, cx + r * 0.14, cy + r * 0.17, r * 1.08);
    base.addColorStop(0, "#f7f3df");
    base.addColorStop(0.24, "#dbd8ca");
    base.addColorStop(0.54, "#a9a89f");
    base.addColorStop(0.82, "#737783");
    base.addColorStop(1, "#232837");
    ctx.fillStyle = base;
    ctx.fillRect(cx - r, cy - r, r * 2, r * 2);

    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(rotation * 0.025);

    var maria = [
      [-0.28, -0.27, 0.28, 0.18, -0.42, 0.38],
      [0.18, -0.24, 0.24, 0.15, 0.24, 0.31],
      [0.08, 0.04, 0.34, 0.2, -0.06, 0.32],
      [-0.36, 0.18, 0.2, 0.13, 0.42, 0.26],
      [0.35, 0.27, 0.18, 0.11, -0.3, 0.23],
      [-0.07, 0.39, 0.25, 0.11, 0.16, 0.2]
    ];

    for (var m = 0; m < maria.length; m += 1) {
      var item = maria[m];
      ctx.save();
      ctx.translate(item[0] * r, item[1] * r);
      ctx.rotate(item[4]);
      ctx.globalAlpha = item[5];
      var mg = ctx.createRadialGradient(0, 0, 0, 0, 0, item[2] * r);
      mg.addColorStop(0, "#484c54");
      mg.addColorStop(0.72, "#666a72");
      mg.addColorStop(1, "rgba(120,123,126,0)");
      ctx.fillStyle = mg;
      ctx.beginPath();
      ctx.ellipse(0, 0, item[2] * r, item[3] * r, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    var craters = [
      [-0.43, -0.43, 0.067, 0.66],
      [-0.18, -0.53, 0.042, 0.46],
      [0.16, -0.46, 0.054, 0.54],
      [0.43, -0.33, 0.078, 0.62],
      [-0.57, -0.08, 0.052, 0.44],
      [-0.18, -0.08, 0.092, 0.52],
      [0.26, -0.04, 0.047, 0.44],
      [0.5, 0.08, 0.046, 0.46],
      [-0.43, 0.34, 0.072, 0.52],
      [-0.06, 0.29, 0.057, 0.42],
      [0.29, 0.35, 0.078, 0.58]
    ];

    for (var c = 0; c < craters.length; c += 1) {
      drawCrater(ctx, craters[c][0] * r, craters[c][1] * r, craters[c][2] * r, craters[c][3], c);
    }

    for (var i = 0; i < 260; i += 1) {
      var a = noise(i, 4, 31) * Math.PI * 2;
      var dist = Math.sqrt(noise(i, 8, 22)) * r * 0.96;
      var x = Math.cos(a) * dist;
      var y = Math.sin(a) * dist;
      var size = r * (0.003 + noise(i, 1, 12) * 0.01);
      drawCrater(ctx, x, y, size, 0.04 + noise(i, 2, 18) * 0.1, i + 50);
    }

    ctx.restore();

    var shade = ctx.createRadialGradient(cx - r * 0.32, cy - r * 0.34, r * 0.08, cx + r * 0.26, cy + r * 0.24, r * 1.1);
    shade.addColorStop(0, "rgba(255,255,244,.28)");
    shade.addColorStop(0.42, "rgba(235,235,220,.08)");
    shade.addColorStop(0.74, "rgba(70,76,88,.12)");
    shade.addColorStop(1, "rgba(0,0,0,.58)");
    ctx.fillStyle = shade;
    ctx.fillRect(cx - r, cy - r, r * 2, r * 2);

    ctx.restore();

    ctx.strokeStyle = "rgba(245,243,226,.36)";
    ctx.lineWidth = Math.max(1, r * 0.012);
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.stroke();
  }

  function normalizeBody(body) {
    var value = String(body || "earth").toLowerCase();
    if (value.indexOf("sun") >= 0) return "sun";
    if (value.indexOf("moon") >= 0) return "moon";
    return "earth";
  }

  function createInstance(root, options) {
    installStyle();
    empty(root);

    root.dataset.instrumentMounted = "true";
    root.dataset.actualBodiesRestored = "true";

    var shell = document.createElement("div");
    shell.className = "dgb-actual-body-shell";

    var canvas = document.createElement("canvas");
    canvas.className = "dgb-actual-body-canvas";
    canvas.width = 1200;
    canvas.height = 1200;

    shell.appendChild(canvas);
    root.appendChild(shell);

    var ctx = canvas.getContext("2d", { alpha: true });

    var instance = {
      root: root,
      shell: shell,
      canvas: canvas,
      ctx: ctx,
      body: normalizeBody(options && options.body),
      speedName: "normal",
      speed: 1,
      direction: 1,
      running: true,
      rotation: 0,
      last: performance.now(),

      setBody: function (body) {
        this.body = normalizeBody(body);
        this.shell.dataset.body = this.body;
        this.root.dataset.activeBody = this.body;
        this.render();
        this.emit();
      },

      setSpeed: function (payload) {
        var name = typeof payload === "string" ? payload : payload && payload.speedName;
        if (name === "slow") {
          this.speedName = "slow";
          this.speed = 0.55;
        } else if (name === "fast") {
          this.speedName = "fast";
          this.speed = 1.9;
        } else {
          this.speedName = "normal";
          this.speed = 1;
        }
        this.emit();
      },

      setZoom: function (payload) {
        this.emit();
      },

      start: function () {
        this.running = true;
        this.emit();
      },

      pause: function () {
        this.running = false;
        this.emit();
      },

      resume: function () {
        this.running = true;
        this.emit();
      },

      reset: function () {
        this.rotation = 0;
        this.render();
        this.emit();
      },

      reverse: function () {
        this.direction *= -1;
        this.emit();
      },

      resize: function () {
        var rect = this.canvas.getBoundingClientRect();
        var dpr = clamp(window.devicePixelRatio || 1, 1, 2);
        var size = Math.max(900, Math.floor(Math.min(rect.width || 900, rect.height || 900) * dpr));
        if (this.canvas.width !== size || this.canvas.height !== size) {
          this.canvas.width = size;
          this.canvas.height = size;
        }
      },

      render: function () {
        this.resize();

        var w = this.canvas.width;
        var h = this.canvas.height;
        var cx = w / 2;
        var cy = h / 2;
        var r = Math.min(w, h) * 0.43;

        this.ctx.clearRect(0, 0, w, h);

        if (this.body === "sun") drawSun(this.ctx, cx, cy, r, this.rotation);
        else if (this.body === "moon") drawMoon(this.ctx, cx, cy, r, this.rotation);
        else drawEarth(this.ctx, cx, cy, r, this.rotation);
      },

      tick: function (now) {
        var dt = Math.min(50, now - this.last);
        this.last = now;

        if (this.running) {
          var factor = this.body === "sun" ? 0.0013 : this.body === "moon" ? 0.00052 : 0.00082;
          this.rotation += dt * factor * this.speed * this.direction;
          this.render();
        }

        var self = this;
        requestAnimationFrame(function (next) {
          self.tick(next);
        });
      },

      emit: function () {
        window.dispatchEvent(new CustomEvent("showroom:globe:mounted", {
          detail: {
            mounted: true,
            body: this.body,
            speedName: this.speedName,
            direction: this.direction > 0 ? "forward" : "reverse",
            actualBodiesRestored: true
          }
        }));
      }
    };

    INSTANCES.set(root, instance);
    instance.setBody(instance.body);
    instance.render();

    requestAnimationFrame(function (now) {
      instance.tick(now);
    });

    return instance;
  }

  function mount(options) {
    var root = findMount(options && (options.mount || options.root || options.target));
    if (!root) return null;

    var instance = INSTANCES.get(root);
    if (!instance) instance = createInstance(root, options || {});

    if (options && options.body) instance.setBody(options.body);
    if (options && options.speedName) instance.setSpeed(options.speedName);

    return instance;
  }

  function getInstance(payload) {
    var root = findMount(payload && (payload.mount || payload.root || payload.target));
    if (!root) return null;
    return INSTANCES.get(root) || mount({ mount: root });
  }

  var api = {
    version: "SHOWROOM_GLOBE_INSTRUMENT_HARD_MOUNT_ACTUAL_BODIES_TNT_v2",
    mount: mount,
    setBody: function (payload) {
      var instance = getInstance(payload || {});
      if (instance) instance.setBody(payload && payload.body ? payload.body : payload);
    },
    setSpeed: function (payload) {
      var instance = getInstance(payload || {});
      if (instance) instance.setSpeed(payload && payload.speedName ? payload.speedName : payload);
    },
    setZoom: function (payload) {
      var instance = getInstance(payload || {});
      if (instance) instance.setZoom(payload || {});
    },
    start: function (payload) {
      var instance = getInstance(payload || {});
      if (instance) instance.start();
    },
    pause: function (payload) {
      var instance = getInstance(payload || {});
      if (instance) instance.pause();
    },
    resume: function (payload) {
      var instance = getInstance(payload || {});
      if (instance) instance.resume();
    },
    reset: function (payload) {
      var instance = getInstance(payload || {});
      if (instance) instance.reset();
    },
    reverse: function (payload) {
      var instance = getInstance(payload || {});
      if (instance) instance.reverse();
    }
  };

  function eventDetail(event) {
    return event && event.detail ? event.detail : {};
  }

  window.ShowroomGlobeInstrument = api;
  window.DiamondGateBridgeShowroomGlobe = api;
  window.showroomGlobeInstrument = api;
  window.ShowroomGlobe = api;

  window.DiamondGateBridge = window.DiamondGateBridge || {};
  window.DiamondGateBridge.ShowroomGlobeInstrument = api;
  window.DiamondGateBridge.ShowroomGlobe = api;
  window.DiamondGateBridge.showroomGlobeInstrument = api;

  window.addEventListener("showroom:globe:mount", function (event) {
    mount(eventDetail(event));
  });

  window.addEventListener("showroom:globe:setBody", function (event) {
    api.setBody(eventDetail(event));
  });

  window.addEventListener("showroom:globe:setSpeed", function (event) {
    api.setSpeed(eventDetail(event));
  });

  window.addEventListener("showroom:globe:setZoom", function (event) {
    api.setZoom(eventDetail(event));
  });

  window.addEventListener("showroom:globe:start", function (event) {
    api.start(eventDetail(event));
  });

  window.addEventListener("showroom:globe:pause", function (event) {
    api.pause(eventDetail(event));
  });

  window.addEventListener("showroom:globe:resume", function (event) {
    api.resume(eventDetail(event));
  });

  window.addEventListener("showroom:globe:reset", function (event) {
    api.reset(eventDetail(event));
  });

  window.addEventListener("showroom:globe:reverse", function (event) {
    api.reverse(eventDetail(event));
  });

  function autoMount() {
    var root = findMount();
    if (root) mount({ mount: root, body: root.dataset.activeBody || "earth" });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", autoMount, { once: true });
  } else {
    autoMount();
  }

  window.addEventListener("load", autoMount, { once: true });
})();
