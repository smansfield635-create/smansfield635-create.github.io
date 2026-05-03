/*!
  SHOWROOM_GLOBE_RENDER_REAL_BODY_4K_RENEWAL_v1
  Target: /assets/showroom.globe.render.js
  Scope: render-owned celestial bodies only.
  Route controls and instrument state remain external authority.
*/
(function () {
  'use strict';

  var VERSION = 'SHOWROOM_GLOBE_RENDER_REAL_BODY_4K_RENEWAL_v1';

  var BODY = {
    earth: {
      name: 'earth',
      title: 'EARTH',
      kind: 'equirect',
      texture: 'https://eoimages.gsfc.nasa.gov/images/imagerecords/57000/57730/land_ocean_ice_2048.jpg',
      rotationSeed: 0.59,
      speed: 0.0000038,
      radiusScale: 0.445,
      rim: 'rgba(168, 224, 235, 0.55)',
      rimSoft: 'rgba(168, 224, 235, 0.16)',
      lift: 1.035,
      contrast: 1.08,
      saturation: 1.06,
      shadow: 0.42,
      shine: 0.22
    },
    sun: {
      name: 'sun',
      title: 'SUN',
      kind: 'disk',
      texture: 'https://sdo.gsfc.nasa.gov/assets/img/latest/latest_2048_0171.jpg',
      rotationSeed: 0,
      speed: 0.0000012,
      radiusScale: 0.448,
      crop: { x: 0.075, y: 0.075, w: 0.85, h: 0.85 },
      rim: 'rgba(255, 224, 109, 0.82)',
      rimSoft: 'rgba(255, 182, 35, 0.24)',
      lift: 1.02,
      contrast: 1.16,
      saturation: 1.08,
      corona: 0.88
    },
    moon: {
      name: 'moon',
      title: 'MOON',
      kind: 'equirect',
      texture: 'https://svs.gsfc.nasa.gov/vis/a000000/a004700/a004720/moon.8192.jpg',
      rotationSeed: 0.21,
      speed: 0.0000011,
      radiusScale: 0.445,
      rim: 'rgba(231, 227, 211, 0.44)',
      rimSoft: 'rgba(231, 227, 211, 0.12)',
      lift: 0.98,
      contrast: 1.18,
      saturation: 0.82,
      shadow: 0.34,
      shine: 0.16
    }
  };

  var EXACT_MOUNT_SELECTOR = [
    '[data-dgb-real-body-slot]',
    '[data-dgb-globe-body]',
    '[data-showroom-globe-body]',
    '[data-render-body]',
    '[data-body-render]',
    '#dgb-globe-body',
    '#showroom-globe-body',
    '#showroom-body-render',
    '.showroom-globe-body',
    '.globe-body-render',
    '.globe-body'
  ].join(',');

  var state = {
    body: 'earth',
    playing: true,
    mount: null,
    broadMount: false,
    titleNode: null,
    stage: null,
    canvas: null,
    ctx: null,
    cssSize: 0,
    dpr: 1,
    raf: 0,
    last: 0,
    lastDraw: 0,
    images: {},
    rotation: {
      earth: BODY.earth.rotationSeed,
      sun: BODY.sun.rotationSeed,
      moon: BODY.moon.rotationSeed
    }
  };

  function normalizeBody(value) {
    var v = String(value || '').toLowerCase().trim();
    if (v.indexOf('earth') !== -1) return 'earth';
    if (v.indexOf('sun') !== -1) return 'sun';
    if (v.indexOf('moon') !== -1) return 'moon';
    return '';
  }

  function bodyFromText(value) {
    var text = String(value || '').replace(/\s+/g, ' ').trim();
    return normalizeBody(text);
  }

  function installCss() {
    if (document.getElementById('dgb-real-body-render-css')) return;

    var css = document.createElement('style');
    css.id = 'dgb-real-body-render-css';
    css.textContent = [
      '.dgb-real-body-stage{',
      '  position:relative;',
      '  width:min(82vw,560px);',
      '  max-width:100%;',
      '  aspect-ratio:1/1;',
      '  margin:0 auto clamp(1rem,3vw,1.45rem);',
      '  display:grid;',
      '  place-items:center;',
      '  isolation:isolate;',
      '  contain:layout paint;',
      '}',
      '.dgb-real-body-stage::before, .dgb-real-body-stage::after{',
      '  content:"";',
      '  position:absolute;',
      '  inset:3.8%;',
      '  border-radius:50%;',
      '  pointer-events:none;',
      '  z-index:0;',
      '}',
      '.dgb-real-body-stage::before{',
      '  border:1px solid rgba(164,190,208,.10);',
      '  box-shadow:0 0 80px rgba(92,151,190,.08), inset 0 0 52px rgba(0,0,0,.38);',
      '}',
      '.dgb-real-body-stage::after{',
      '  inset:8%;',
      '  border:1px solid rgba(164,190,208,.075);',
      '  transform:rotate(-15deg) scaleX(1.18);',
      '}',
      '.dgb-real-body-canvas{',
      '  position:relative;',
      '  z-index:2;',
      '  width:100%;',
      '  height:100%;',
      '  display:block;',
      '  border-radius:50%;',
      '  filter:drop-shadow(0 30px 48px rgba(0,0,0,.48));',
      '}',
      '.dgb-real-body-stage[data-body="sun"] .dgb-real-body-canvas{',
      '  filter:drop-shadow(0 0 34px rgba(255,190,37,.36)) drop-shadow(0 24px 48px rgba(0,0,0,.42));',
      '}',
      '.dgb-real-body-stage[data-body="moon"] .dgb-real-body-canvas{',
      '  filter:drop-shadow(0 24px 44px rgba(0,0,0,.48));',
      '}',
      '@media (max-width:520px){',
      '  .dgb-real-body-stage{width:min(86vw,430px);}',
      '}',
      '@media (prefers-reduced-motion:reduce){',
      '  .dgb-real-body-stage{animation:none!important;}',
      '}'
    ].join('\n');
    document.head.appendChild(css);
  }

  function findTitleNode(root) {
    var nodes = Array.prototype.slice.call((root || document).querySelectorAll('h1,h2,h3,h4,[data-body-title],.body-title,.globe-title,.celestial-title'));
    for (var i = 0; i < nodes.length; i += 1) {
      var b = bodyFromText(nodes[i].textContent);
      if (b) return nodes[i];
    }
    return null;
  }

  function findMount() {
    var exact = document.querySelector(EXACT_MOUNT_SELECTOR);
    if (exact) {
      return { node: exact, broad: false, title: findTitleNode(exact) };
    }

    var title = findTitleNode(document);
    if (title) {
      var card = title.closest('article,section,figure,.card,.panel,.globe-card,.showroom-card,.celestial-card') || title.parentElement;
      return { node: card || title.parentElement || document.body, broad: true, title: title };
    }

    var main = document.querySelector('main') || document.body;
    return { node: main, broad: true, title: null };
  }

  function hideLegacyMedia() {
    if (!state.broadMount || !state.mount || !state.stage || !state.titleNode) return;

    var children = Array.prototype.slice.call(state.mount.children || []);
    var titleIndex = children.indexOf(state.titleNode);
    if (titleIndex < 0) return;

    for (var i = 0; i < titleIndex; i += 1) {
      var child = children[i];
      if (!child || child === state.stage || child.contains(state.stage)) continue;
      if (child.classList && child.classList.contains('dgb-real-body-stage')) continue;

      var hasBodyMedia = child.matches('canvas,img,svg,video,.body,.planet,.globe,.orb,.sphere,.visual,.globe-visual,.body-visual') ||
        child.querySelector('canvas,img,svg,video,.body,.planet,.globe,.orb,.sphere,.visual,.globe-visual,.body-visual');

      if (hasBodyMedia) {
        child.setAttribute('data-dgb-hidden-by-real-body-render', 'true');
        child.style.display = 'none';
      }
    }
  }

  function ensureStage() {
    installCss();

    var found = findMount();
    state.mount = found.node;
    state.broadMount = found.broad;
    state.titleNode = found.title;

    if (!state.mount) return false;

    var existing = state.mount.querySelector('.dgb-real-body-stage');
    if (existing) {
      state.stage = existing;
      state.canvas = existing.querySelector('canvas');
      state.ctx = state.canvas && state.canvas.getContext ? state.canvas.getContext('2d', { alpha: true }) : null;
      return !!state.ctx;
    }

    var stage = document.createElement('div');
    stage.className = 'dgb-real-body-stage';
    stage.setAttribute('data-render-authority', 'render-owns-bodies');
    stage.setAttribute('data-render-version', VERSION);

    var canvas = document.createElement('canvas');
    canvas.className = 'dgb-real-body-canvas';
    canvas.setAttribute('aria-hidden', 'true');
    stage.appendChild(canvas);

    if (state.broadMount && state.titleNode && state.titleNode.parentNode === state.mount) {
      state.mount.insertBefore(stage, state.titleNode);
    } else {
      state.mount.appendChild(stage);
    }

    state.stage = stage;
    state.canvas = canvas;
    state.ctx = canvas.getContext('2d', { alpha: true });
    hideLegacyMedia();
    return !!state.ctx;
  }

  function imageRecord(name) {
    var cfg = BODY[name] || BODY.earth;
    if (state.images[name]) return state.images[name];

    var record = { img: new Image(), ready: false, failed: false, promise: null };
    record.img.decoding = 'async';
    record.img.referrerPolicy = 'no-referrer';
    record.promise = new Promise(function (resolve) {
      record.img.onload = function () {
        record.ready = true;
        resolve(record);
      };
      record.img.onerror = function () {
        record.failed = true;
        resolve(record);
      };
    });
    record.img.src = cfg.texture;
    state.images[name] = record;
    return record;
  }

  function resizeCanvas() {
    if (!state.stage || !state.canvas || !state.ctx) return false;

    var rect = state.stage.getBoundingClientRect();
    var cssSize = Math.max(240, Math.round(Math.min(rect.width || 420, rect.height || rect.width || 420)));
    var body = BODY[state.body] || BODY.earth;
    var maxDpr = body.name === 'sun' ? 2.75 : 3.1;
    var dpr = Math.max(1, Math.min(window.devicePixelRatio || 1, maxDpr));
    var px = Math.max(512, Math.round(cssSize * dpr));

    if (state.canvas.width !== px || state.canvas.height !== px) {
      state.canvas.width = px;
      state.canvas.height = px;
      state.canvas.style.width = cssSize + 'px';
      state.canvas.style.height = cssSize + 'px';
      state.cssSize = cssSize;
      state.dpr = dpr;
      state.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      return true;
    }

    if (state.cssSize !== cssSize || state.dpr !== dpr) {
      state.canvas.style.width = cssSize + 'px';
      state.canvas.style.height = cssSize + 'px';
      state.cssSize = cssSize;
      state.dpr = dpr;
      state.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      return true;
    }

    return false;
  }

  function clear(ctx, size) {
    ctx.save();
    ctx.setTransform(state.dpr, 0, 0, state.dpr, 0, 0);
    ctx.clearRect(0, 0, size, size);
    ctx.restore();
  }

  function drawWrappedStrip(ctx, img, sx, sy, sw, sh, dx, dy, dw, dh) {
    var texW = img.naturalWidth || img.width;
    sx = ((sx % texW) + texW) % texW;

    if (sx + sw <= texW) {
      ctx.drawImage(img, sx, sy, sw, sh, dx, dy, dw, dh);
      return;
    }

    var first = texW - sx;
    var frac = first / sw;
    ctx.drawImage(img, sx, sy, first, sh, dx, dy, dw * frac, dh);
    ctx.drawImage(img, 0, sy, sw - first, sh, dx + dw * frac, dy, dw * (1 - frac), dh);
  }

  function applyColorGrade(ctx, cfg) {
    var filter = [];
    filter.push('brightness(' + (cfg.lift || 1) + ')');
    filter.push('contrast(' + (cfg.contrast || 1) + ')');
    filter.push('saturate(' + (cfg.saturation || 1) + ')');
    ctx.filter = filter.join(' ');
  }

  function drawSphere(ctx, img, cfg, cx, cy, r, phase) {
    var texW = img.naturalWidth || img.width;
    var texH = img.naturalHeight || img.height;
    var diameter = r * 2;
    var sourceW = texW * 0.5;
    var centerX = (((phase % 1) + 1) % 1) * texW;

    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.clip();
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    applyColorGrade(ctx, cfg);

    var step = window.devicePixelRatio >= 2.5 ? 0.7 : 1;
    for (var row = 0; row <= diameter; row += step) {
      var v = (row - r) / r;
      var rowRadius = Math.sqrt(Math.max(0, 1 - v * v)) * r;
      if (rowRadius <= 0.01) continue;

      var lat = Math.asin(-v);
      var sy = Math.max(0, Math.min(texH - 1, (0.5 - lat / Math.PI) * texH));
      var dx = cx - rowRadius;
      var dy = cy - r + row;
      var dw = rowRadius * 2;
      var sx = centerX - sourceW / 2;

      drawWrappedStrip(ctx, img, sx, sy, sourceW, 1, dx, dy, dw, step + 0.55);
    }

    ctx.filter = 'none';
    ctx.restore();
  }

  function drawDisk(ctx, img, cfg, cx, cy, r, phase) {
    var texW = img.naturalWidth || img.width;
    var texH = img.naturalHeight || img.height;
    var crop = cfg.crop || { x: 0, y: 0, w: 1, h: 1 };
    var sx = texW * crop.x;
    var sy = texH * crop.y;
    var sw = texW * crop.w;
    var sh = texH * crop.h;

    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.clip();
    ctx.translate(cx, cy);
    ctx.rotate(phase * Math.PI * 2 * 0.035);
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    applyColorGrade(ctx, cfg);
    ctx.drawImage(img, sx, sy, sw, sh, -r, -r, r * 2, r * 2);
    ctx.filter = 'none';
    ctx.restore();
  }

  function drawSunCorona(ctx, cx, cy, r, cfg, t) {
    ctx.save();
    var pulse = 1 + Math.sin(t * 0.0017) * 0.018;
    var glow = ctx.createRadialGradient(cx, cy, r * 0.72, cx, cy, r * 1.48 * pulse);
    glow.addColorStop(0, 'rgba(255, 214, 67, 0.30)');
    glow.addColorStop(0.34, 'rgba(255, 180, 32, 0.22)');
    glow.addColorStop(0.7, 'rgba(255, 120, 20, 0.08)');
    glow.addColorStop(1, 'rgba(255, 120, 20, 0)');
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(cx, cy, r * 1.56 * pulse, 0, Math.PI * 2);
    ctx.fill();

    ctx.globalCompositeOperation = 'screen';
    ctx.strokeStyle = 'rgba(255, 229, 111, 0.30)';
    ctx.lineWidth = Math.max(1, r * 0.006);
    for (var i = 0; i < 22; i += 1) {
      var a = (Math.PI * 2 * i) / 22 + Math.sin(t * 0.0007 + i) * 0.018;
      var inner = r * (0.96 + ((i % 3) * 0.012));
      var outer = r * (1.07 + ((i % 5) * 0.018));
      ctx.beginPath();
      ctx.moveTo(cx + Math.cos(a) * inner, cy + Math.sin(a) * inner);
      ctx.lineTo(cx + Math.cos(a) * outer, cy + Math.sin(a) * outer);
      ctx.stroke();
    }
    ctx.restore();
  }

  function applyBodyLighting(ctx, cfg, cx, cy, r) {
    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.clip();

    if (cfg.kind !== 'sun') {
      var shade = ctx.createRadialGradient(cx - r * 0.38, cy - r * 0.42, r * 0.12, cx + r * 0.45, cy + r * 0.35, r * 1.12);
      shade.addColorStop(0, 'rgba(255,255,255,' + (cfg.shine || 0.16) + ')');
      shade.addColorStop(0.42, 'rgba(255,255,255,0.02)');
      shade.addColorStop(0.73, 'rgba(0,0,0,' + ((cfg.shadow || 0.35) * 0.52) + ')');
      shade.addColorStop(1, 'rgba(0,0,0,' + (cfg.shadow || 0.35) + ')');
      ctx.globalCompositeOperation = 'source-over';
      ctx.fillStyle = shade;
      ctx.fillRect(cx - r, cy - r, r * 2, r * 2);
    } else {
      var limb = ctx.createRadialGradient(cx, cy, r * 0.58, cx, cy, r * 1.02);
      limb.addColorStop(0, 'rgba(255,255,255,0.04)');
      limb.addColorStop(0.72, 'rgba(255,221,91,0.02)');
      limb.addColorStop(1, 'rgba(74,31,0,0.24)');
      ctx.fillStyle = limb;
      ctx.fillRect(cx - r, cy - r, r * 2, r * 2);
    }

    ctx.restore();
  }

  function drawRim(ctx, cfg, cx, cy, r) {
    ctx.save();
    var soft = ctx.createRadialGradient(cx, cy, r * 0.94, cx, cy, r * 1.1);
    soft.addColorStop(0, 'rgba(255,255,255,0)');
    soft.addColorStop(0.78, cfg.rimSoft || 'rgba(255,255,255,.10)');
    soft.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = soft;
    ctx.beginPath();
    ctx.arc(cx, cy, r * 1.12, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = cfg.rim || 'rgba(255,255,255,.45)';
    ctx.lineWidth = Math.max(1, r * 0.006);
    ctx.beginPath();
    ctx.arc(cx, cy, r + ctx.lineWidth, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }

  function drawSourceHold(ctx, ctxSize, cfg) {
    var cx = ctxSize / 2;
    var cy = ctxSize / 2;
    var r = ctxSize * (cfg.radiusScale || 0.445);
    ctx.save();
    ctx.fillStyle = 'rgba(229,224,205,0.055)';
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = 'rgba(229,224,205,0.22)';
    ctx.lineWidth = Math.max(1, r * 0.006);
    ctx.stroke();
    ctx.restore();
  }

  function drawFrame(now) {
    if (!ensureStage()) return;
    resizeCanvas();

    var ctx = state.ctx;
    var cssSize = state.cssSize || 420;
    var cfg = BODY[state.body] || BODY.earth;
    var rec = imageRecord(state.body);
    var cx = cssSize / 2;
    var cy = cssSize / 2;
    var r = cssSize * (cfg.radiusScale || 0.445);

    clear(ctx, cssSize);
    if (state.stage) {
      state.stage.setAttribute('data-body', state.body);
      state.stage.setAttribute('data-source-family', 'real-nasa-celestial-source');
    }

    if (cfg.kind === 'sun') {
      drawSunCorona(ctx, cx, cy, r, cfg, now || 0);
    }

    if (!rec.ready) {
      drawSourceHold(ctx, cssSize, cfg);
      return;
    }

    if (cfg.kind === 'disk') {
      drawDisk(ctx, rec.img, cfg, cx, cy, r, state.rotation[state.body] || 0);
    } else {
      drawSphere(ctx, rec.img, cfg, cx, cy, r, state.rotation[state.body] || 0);
    }

    applyBodyLighting(ctx, cfg, cx, cy, r);
    drawRim(ctx, cfg, cx, cy, r);
  }

  function readRouteBodyHint() {
    var attrs = [
      document.documentElement && document.documentElement.getAttribute('data-active-body'),
      document.body && document.body.getAttribute('data-active-body'),
      document.documentElement && document.documentElement.getAttribute('data-current-body'),
      document.body && document.body.getAttribute('data-current-body'),
      document.documentElement && document.documentElement.getAttribute('data-globe-body'),
      document.body && document.body.getAttribute('data-globe-body')
    ];

    for (var i = 0; i < attrs.length; i += 1) {
      var b = normalizeBody(attrs[i]);
      if (b) return b;
    }

    var active = document.querySelector('[aria-pressed="true"], .active, .is-active, .selected, [data-active="true"]');
    if (active) {
      var fromActive = bodyFromText(active.textContent || active.getAttribute('aria-label') || active.getAttribute('title'));
      if (fromActive) return fromActive;
    }

    var titleBody = state.titleNode ? bodyFromText(state.titleNode.textContent) : '';
    if (titleBody) return titleBody;

    return '';
  }

  function setBody(name, options) {
    var b = normalizeBody(name);
    if (!b || !BODY[b]) return false;
    state.body = b;
    imageRecord(b);
    if (state.stage) state.stage.setAttribute('data-body', b);
    drawFrame(performance.now());
    if (!options || !options.silent) {
      window.dispatchEvent(new CustomEvent('dgb:showroom:render-body', {
        detail: { body: b, version: VERSION, authority: 'render-owns-bodies' }
      }));
    }
    return true;
  }

  function start() {
    state.playing = true;
  }

  function pause() {
    state.playing = false;
    drawFrame(performance.now());
  }

  function loop(now) {
    if (!state.last) state.last = now;
    var dt = Math.min(64, Math.max(0, now - state.last));
    state.last = now;

    var cfg = BODY[state.body] || BODY.earth;
    if (state.playing) {
      state.rotation[state.body] = ((state.rotation[state.body] || 0) + cfg.speed * dt) % 1;
    }

    var targetInterval = state.body === 'sun' ? 42 : 55;
    if (state.playing || now - state.lastDraw > 240) {
      if (now - state.lastDraw >= targetInterval) {
        drawFrame(now);
        state.lastDraw = now;
      }
    }

    state.raf = window.requestAnimationFrame(loop);
  }

  function observeRouteControls() {
    document.addEventListener('click', function (event) {
      var control = event.target && event.target.closest ? event.target.closest('button,a,[role="button"],[data-body],[data-view-body],[data-globe-body]') : null;
      if (!control) return;

      var declared = normalizeBody(control.getAttribute('data-body') || control.getAttribute('data-view-body') || control.getAttribute('data-globe-body'));
      var text = bodyFromText(control.textContent || control.getAttribute('aria-label') || control.getAttribute('title'));
      var nextBody = declared || text;

      if (nextBody) {
        window.setTimeout(function () {
          var routeBody = readRouteBodyHint() || nextBody;
          setBody(routeBody, { silent: true });
        }, 0);
        return;
      }

      var raw = String(control.textContent || control.getAttribute('aria-label') || '').toLowerCase();
      if (raw.indexOf('pause') !== -1) pause();
      if (raw.indexOf('start') !== -1 || raw.indexOf('play') !== -1) start();
    }, true);

    window.addEventListener('resize', function () {
      drawFrame(performance.now());
    }, { passive: true });

    var events = [
      'dgb:body',
      'dgb:showroom:body',
      'dgb:showroom-globe:body',
      'showroom:body',
      'globe:body',
      'bodychange'
    ];

    events.forEach(function (name) {
      window.addEventListener(name, function (event) {
        var detail = event && event.detail ? event.detail : {};
        var b = normalizeBody(detail.body || detail.name || detail.target || detail.value || detail);
        if (b) setBody(b, { silent: true });
      });
      document.addEventListener(name, function (event) {
        var detail = event && event.detail ? event.detail : {};
        var b = normalizeBody(detail.body || detail.name || detail.target || detail.value || detail);
        if (b) setBody(b, { silent: true });
      });
    });

    window.setInterval(function () {
      var hinted = readRouteBodyHint();
      if (hinted && hinted !== state.body) setBody(hinted, { silent: true });
    }, 650);
  }

  function boot() {
    ensureStage();
    var initial = readRouteBodyHint() || normalizeBody(window.location.hash) || 'earth';
    setBody(initial, { silent: true });
    imageRecord('earth');
    imageRecord('sun');
    imageRecord('moon');
    observeRouteControls();
    if (state.raf) window.cancelAnimationFrame(state.raf);
    state.raf = window.requestAnimationFrame(loop);
  }

  var api = {
    version: VERSION,
    setBody: setBody,
    viewEarth: function () { return setBody('earth'); },
    viewSun: function () { return setBody('sun'); },
    viewMoon: function () { return setBody('moon'); },
    start: start,
    pause: pause,
    refresh: function () { return drawFrame(performance.now()); },
    getState: function () {
      return {
        body: state.body,
        playing: state.playing,
        version: VERSION,
        authority: 'render-owns-bodies',
        routeControlsOwnedHere: false,
        instrumentStateOwnedHere: false
      };
    }
  };

  window.DGBShowroomGlobeRender = api;
  window.ShowroomGlobeRender = api;
  window.showroomGlobeRender = api;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot, { once: true });
  } else {
    boot();
  }
}());
