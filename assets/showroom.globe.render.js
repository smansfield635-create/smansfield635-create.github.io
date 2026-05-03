/*!
  SHOWROOM_GLOBE_RENDER_TRUE_WEBGL_SPHERE_RENEWAL_v2
  Target: /assets/showroom.globe.render.js
  Scope: render-owned celestial bodies only.
  Purpose: remove side-collapse by rendering Earth/Moon/Sun as real sphere geometry.
*/
(function () {
  'use strict';

  var VERSION = 'SHOWROOM_GLOBE_RENDER_TRUE_WEBGL_SPHERE_RENEWAL_v2';

  var BODY = {
    earth: {
      key: 'earth',
      title: 'EARTH',
      texture: 'https://eoimages.gsfc.nasa.gov/images/imagerecords/57000/57730/land_ocean_ice_2048.jpg',
      radius: 1.0,
      rotation: 0.0,
      speed: 0.00018,
      light: [0.42, 0.18, 0.88],
      ambient: 0.36,
      diffuse: 0.82,
      rim: [0.45, 0.78, 0.9],
      rimPower: 2.15,
      rimStrength: 0.22,
      exposure: 1.0,
      saturation: 1.06,
      emissive: 0.0
    },
    sun: {
      key: 'sun',
      title: 'SUN',
      texture: 'https://sdo.gsfc.nasa.gov/assets/img/latest/latest_2048_0171.jpg',
      radius: 1.0,
      rotation: 0.0,
      speed: 0.00008,
      light: [0.0, 0.0, 1.0],
      ambient: 1.0,
      diffuse: 0.0,
      rim: [1.0, 0.72, 0.16],
      rimPower: 1.4,
      rimStrength: 0.38,
      exposure: 1.22,
      saturation: 1.18,
      emissive: 1.0
    },
    moon: {
      key: 'moon',
      title: 'MOON',
      texture: 'https://svs.gsfc.nasa.gov/vis/a000000/a004700/a004720/moon.8192.jpg',
      radius: 1.0,
      rotation: 0.0,
      speed: 0.00007,
      light: [0.34, 0.22, 0.91],
      ambient: 0.42,
      diffuse: 0.72,
      rim: [0.82, 0.80, 0.72],
      rimPower: 2.35,
      rimStrength: 0.16,
      exposure: 0.92,
      saturation: 0.78,
      emissive: 0.0
    }
  };

  var state = {
    body: 'earth',
    playing: true,
    mount: null,
    titleNode: null,
    broadMount: false,
    stage: null,
    canvas: null,
    gl: null,
    program: null,
    buffers: null,
    textures: {},
    textureReady: {},
    textureFailed: {},
    uniforms: {},
    attribs: {},
    dpr: 1,
    width: 0,
    height: 0,
    angle: {
      earth: 0,
      sun: 0,
      moon: 0
    },
    last: 0,
    raf: 0
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

  function clamp(n, min, max) {
    return Math.max(min, Math.min(max, n));
  }

  function normalizeBody(value) {
    var v = String(value || '').toLowerCase().trim();
    if (v.indexOf('earth') !== -1) return 'earth';
    if (v.indexOf('sun') !== -1) return 'sun';
    if (v.indexOf('moon') !== -1) return 'moon';
    return '';
  }

  function bodyFromText(value) {
    return normalizeBody(String(value || '').replace(/\s+/g, ' ').trim());
  }

  function installCss() {
    if (document.getElementById('dgb-true-webgl-sphere-css')) return;

    var css = document.createElement('style');
    css.id = 'dgb-true-webgl-sphere-css';
    css.textContent = [
      '.dgb-true-sphere-stage{',
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
      '.dgb-true-sphere-stage::before,',
      '.dgb-true-sphere-stage::after{',
      '  content:"";',
      '  position:absolute;',
      '  pointer-events:none;',
      '  border-radius:50%;',
      '  z-index:0;',
      '}',
      '.dgb-true-sphere-stage::before{',
      '  inset:3.5%;',
      '  border:1px solid rgba(166,190,208,.11);',
      '  box-shadow:0 0 88px rgba(68,140,180,.08), inset 0 0 58px rgba(0,0,0,.42);',
      '}',
      '.dgb-true-sphere-stage::after{',
      '  inset:9%;',
      '  border:1px solid rgba(166,190,208,.075);',
      '  transform:rotate(-15deg) scaleX(1.18);',
      '}',
      '.dgb-true-sphere-canvas{',
      '  position:relative;',
      '  z-index:2;',
      '  width:100%;',
      '  height:100%;',
      '  display:block;',
      '  border-radius:50%;',
      '  background:transparent;',
      '  filter:drop-shadow(0 30px 52px rgba(0,0,0,.52));',
      '}',
      '.dgb-true-sphere-stage[data-body="sun"] .dgb-true-sphere-canvas{',
      '  filter:drop-shadow(0 0 38px rgba(255,192,44,.42)) drop-shadow(0 24px 48px rgba(0,0,0,.44));',
      '}',
      '.dgb-true-sphere-stage[data-body="moon"] .dgb-true-sphere-canvas{',
      '  filter:drop-shadow(0 24px 46px rgba(0,0,0,.50));',
      '}',
      '@media (max-width:520px){',
      '  .dgb-true-sphere-stage{width:min(86vw,430px);}',
      '}'
    ].join('\n');

    document.head.appendChild(css);
  }

  function findTitleNode(root) {
    var nodes = Array.prototype.slice.call((root || document).querySelectorAll('h1,h2,h3,h4,[data-body-title],.body-title,.globe-title,.celestial-title'));
    for (var i = 0; i < nodes.length; i += 1) {
      if (bodyFromText(nodes[i].textContent)) return nodes[i];
    }
    return null;
  }

  function findMount() {
    var exact = document.querySelector(EXACT_MOUNT_SELECTOR);
    if (exact) return { node: exact, broad: false, title: findTitleNode(exact) };

    var title = findTitleNode(document);
    if (title) {
      var card = title.closest('article,section,figure,.card,.panel,.globe-card,.showroom-card,.celestial-card') || title.parentElement;
      return { node: card || title.parentElement || document.body, broad: true, title: title };
    }

    return { node: document.querySelector('main') || document.body, broad: true, title: null };
  }

  function hideLegacyMedia() {
    if (!state.broadMount || !state.mount || !state.titleNode || !state.stage) return;

    var children = Array.prototype.slice.call(state.mount.children || []);
    var titleIndex = children.indexOf(state.titleNode);
    if (titleIndex < 0) return;

    for (var i = 0; i < titleIndex; i += 1) {
      var child = children[i];
      if (!child || child === state.stage || child.contains(state.stage)) continue;
      if (child.classList && child.classList.contains('dgb-true-sphere-stage')) continue;

      var hasBodyMedia =
        child.matches('canvas,img,svg,video,.body,.planet,.globe,.orb,.sphere,.visual,.globe-visual,.body-visual') ||
        child.querySelector('canvas,img,svg,video,.body,.planet,.globe,.orb,.sphere,.visual,.globe-visual,.body-visual');

      if (hasBodyMedia) {
        child.setAttribute('data-dgb-hidden-by-true-webgl-sphere', 'true');
        child.style.display = 'none';
      }
    }
  }

  function ensureStage() {
    installCss();

    var found = findMount();
    state.mount = found.node;
    state.titleNode = found.title;
    state.broadMount = found.broad;

    if (!state.mount) return false;

    var existing = state.mount.querySelector('.dgb-true-sphere-stage');
    if (existing) {
      state.stage = existing;
      state.canvas = existing.querySelector('canvas');
      return !!state.canvas;
    }

    var stage = document.createElement('div');
    stage.className = 'dgb-true-sphere-stage';
    stage.setAttribute('data-render-authority', 'render-owns-bodies');
    stage.setAttribute('data-render-version', VERSION);
    stage.setAttribute('data-body-geometry', 'true-webgl-sphere');

    var canvas = document.createElement('canvas');
    canvas.className = 'dgb-true-sphere-canvas';
    canvas.setAttribute('aria-hidden', 'true');

    stage.appendChild(canvas);

    if (state.broadMount && state.titleNode && state.titleNode.parentNode === state.mount) {
      state.mount.insertBefore(stage, state.titleNode);
    } else {
      state.mount.appendChild(stage);
    }

    state.stage = stage;
    state.canvas = canvas;
    hideLegacyMedia();

    return true;
  }

  function createShader(gl, type, source) {
    var shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      throw new Error(gl.getShaderInfoLog(shader) || 'Shader compile failed');
    }

    return shader;
  }

  function createProgram(gl, vertexSource, fragmentSource) {
    var vertex = createShader(gl, gl.VERTEX_SHADER, vertexSource);
    var fragment = createShader(gl, gl.FRAGMENT_SHADER, fragmentSource);
    var program = gl.createProgram();

    gl.attachShader(program, vertex);
    gl.attachShader(program, fragment);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      throw new Error(gl.getProgramInfoLog(program) || 'Program link failed');
    }

    gl.deleteShader(vertex);
    gl.deleteShader(fragment);

    return program;
  }

  function makeSphere(segments, rings) {
    var positions = [];
    var normals = [];
    var uvs = [];
    var indices = [];

    for (var y = 0; y <= rings; y += 1) {
      var v = y / rings;
      var theta = v * Math.PI;
      var sinTheta = Math.sin(theta);
      var cosTheta = Math.cos(theta);

      for (var x = 0; x <= segments; x += 1) {
        var u = x / segments;
        var phi = u * Math.PI * 2;

        var px = Math.sin(phi) * sinTheta;
        var py = Math.cos(theta);
        var pz = Math.cos(phi) * sinTheta;

        positions.push(px, py, pz);
        normals.push(px, py, pz);
        uvs.push(u, v);
      }
    }

    for (var yy = 0; yy < rings; yy += 1) {
      for (var xx = 0; xx < segments; xx += 1) {
        var a = yy * (segments + 1) + xx;
        var b = a + segments + 1;

        indices.push(a, b, a + 1);
        indices.push(b, b + 1, a + 1);
      }
    }

    return {
      positions: new Float32Array(positions),
      normals: new Float32Array(normals),
      uvs: new Float32Array(uvs),
      indices: new Uint16Array(indices)
    };
  }

  function identity() {
    return [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
  }

  function perspective(fovy, aspect, near, far) {
    var f = 1 / Math.tan(fovy / 2);
    var nf = 1 / (near - far);

    return [
      f / aspect, 0, 0, 0,
      0, f, 0, 0,
      0, 0, (far + near) * nf, -1,
      0, 0, (2 * far * near) * nf, 0
    ];
  }

  function translate(m, x, y, z) {
    var out = m.slice();
    out[12] = m[0] * x + m[4] * y + m[8] * z + m[12];
    out[13] = m[1] * x + m[5] * y + m[9] * z + m[13];
    out[14] = m[2] * x + m[6] * y + m[10] * z + m[14];
    out[15] = m[3] * x + m[7] * y + m[11] * z + m[15];
    return out;
  }

  function rotateY(m, angle) {
    var c = Math.cos(angle);
    var s = Math.sin(angle);

    return [
      m[0] * c + m[8] * s, m[1] * c + m[9] * s, m[2] * c + m[10] * s, m[3] * c + m[11] * s,
      m[4], m[5], m[6], m[7],
      m[8] * c - m[0] * s, m[9] * c - m[1] * s, m[10] * c - m[2] * s, m[11] * c - m[3] * s,
      m[12], m[13], m[14], m[15]
    ];
  }

  function rotateX(m, angle) {
    var c = Math.cos(angle);
    var s = Math.sin(angle);

    return [
      m[0], m[1], m[2], m[3],
      m[4] * c + m[8] * s, m[5] * c + m[9] * s, m[6] * c + m[10] * s, m[7] * c + m[11] * s,
      m[8] * c - m[4] * s, m[9] * c - m[5] * s, m[10] * c - m[6] * s, m[11] * c - m[7] * s,
      m[12], m[13], m[14], m[15]
    ];
  }

  function initWebGL() {
    if (state.gl) return true;
    if (!ensureStage()) return false;

    var gl =
      state.canvas.getContext('webgl', {
        alpha: true,
        antialias: true,
        depth: true,
        premultipliedAlpha: false,
        preserveDrawingBuffer: false
      }) ||
      state.canvas.getContext('experimental-webgl', {
        alpha: true,
        antialias: true,
        depth: true,
        premultipliedAlpha: false,
        preserveDrawingBuffer: false
      });

    if (!gl) return false;

    var vertexSource = [
      'attribute vec3 a_position;',
      'attribute vec3 a_normal;',
      'attribute vec2 a_uv;',
      'uniform mat4 u_projection;',
      'uniform mat4 u_model;',
      'varying vec3 v_normal;',
      'varying vec2 v_uv;',
      'varying vec3 v_world;',
      'void main(){',
      '  vec4 world = u_model * vec4(a_position, 1.0);',
      '  v_world = world.xyz;',
      '  v_normal = normalize((u_model * vec4(a_normal, 0.0)).xyz);',
      '  v_uv = a_uv;',
      '  gl_Position = u_projection * world;',
      '}'
    ].join('\n');

    var fragmentSource = [
      'precision highp float;',
      'uniform sampler2D u_texture;',
      'uniform vec3 u_light;',
      'uniform vec3 u_rimColor;',
      'uniform float u_ambient;',
      'uniform float u_diffuse;',
      'uniform float u_rimPower;',
      'uniform float u_rimStrength;',
      'uniform float u_exposure;',
      'uniform float u_saturation;',
      'uniform float u_emissive;',
      'varying vec3 v_normal;',
      'varying vec2 v_uv;',
      'varying vec3 v_world;',
      'vec3 saturateColor(vec3 color, float sat){',
      '  float gray = dot(color, vec3(0.299, 0.587, 0.114));',
      '  return mix(vec3(gray), color, sat);',
      '}',
      'void main(){',
      '  vec4 tex = texture2D(u_texture, v_uv);',
      '  vec3 n = normalize(v_normal);',
      '  vec3 viewDir = normalize(vec3(0.0, 0.0, 1.0));',
      '  float ndl = max(dot(n, normalize(u_light)), 0.0);',
      '  float light = u_ambient + ndl * u_diffuse;',
      '  float rim = pow(1.0 - max(dot(n, viewDir), 0.0), u_rimPower) * u_rimStrength;',
      '  vec3 color = tex.rgb;',
      '  color = saturateColor(color, u_saturation);',
      '  color = color * max(light, u_emissive) * u_exposure;',
      '  color += u_rimColor * rim;',
      '  float limb = smoothstep(1.0, 0.72, dot(n, viewDir));',
      '  if(u_emissive > 0.5){',
      '    color += u_rimColor * rim * 1.35;',
      '  } else {',
      '    color *= mix(0.82, 1.0, limb);',
      '  }',
      '  gl_FragColor = vec4(color, tex.a);',
      '}'
    ].join('\n');

    var program = createProgram(gl, vertexSource, fragmentSource);
    var sphere = makeSphere(128, 64);

    var positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, sphere.positions, gl.STATIC_DRAW);

    var normalBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, sphere.normals, gl.STATIC_DRAW);

    var uvBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, uvBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, sphere.uvs, gl.STATIC_DRAW);

    var indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, sphere.indices, gl.STATIC_DRAW);

    state.gl = gl;
    state.program = program;
    state.buffers = {
      position: positionBuffer,
      normal: normalBuffer,
      uv: uvBuffer,
      index: indexBuffer,
      count: sphere.indices.length
    };

    state.attribs = {
      position: gl.getAttribLocation(program, 'a_position'),
      normal: gl.getAttribLocation(program, 'a_normal'),
      uv: gl.getAttribLocation(program, 'a_uv')
    };

    state.uniforms = {
      projection: gl.getUniformLocation(program, 'u_projection'),
      model: gl.getUniformLocation(program, 'u_model'),
      texture: gl.getUniformLocation(program, 'u_texture'),
      light: gl.getUniformLocation(program, 'u_light'),
      rimColor: gl.getUniformLocation(program, 'u_rimColor'),
      ambient: gl.getUniformLocation(program, 'u_ambient'),
      diffuse: gl.getUniformLocation(program, 'u_diffuse'),
      rimPower: gl.getUniformLocation(program, 'u_rimPower'),
      rimStrength: gl.getUniformLocation(program, 'u_rimStrength'),
      exposure: gl.getUniformLocation(program, 'u_exposure'),
      saturation: gl.getUniformLocation(program, 'u_saturation'),
      emissive: gl.getUniformLocation(program, 'u_emissive')
    };

    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.CULL_FACE);
    gl.cullFace(gl.BACK);
    gl.clearColor(0, 0, 0, 0);

    return true;
  }

  function makePlaceholderTexture(gl) {
    var tex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texImage2D(
      gl.TEXTURE_2D,
      0,
      gl.RGBA,
      1,
      1,
      0,
      gl.RGBA,
      gl.UNSIGNED_BYTE,
      new Uint8Array([210, 206, 190, 255])
    );
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    return tex;
  }

  function ensureTexture(key) {
    if (!state.gl) return null;
    if (state.textures[key]) return state.textures[key];

    var gl = state.gl;
    var cfg = BODY[key] || BODY.earth;
    var texture = makePlaceholderTexture(gl);

    state.textures[key] = texture;
    state.textureReady[key] = false;
    state.textureFailed[key] = false;

    var img = new Image();
    img.crossOrigin = 'anonymous';
    img.decoding = 'async';
    img.referrerPolicy = 'no-referrer';

    img.onload = function () {
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      state.textureReady[key] = true;
      render(performance.now());
    };

    img.onerror = function () {
      state.textureFailed[key] = true;
    };

    img.src = cfg.texture;

    return texture;
  }

  function resize() {
    if (!state.canvas || !state.gl || !state.stage) return;

    var rect = state.stage.getBoundingClientRect();
    var size = Math.max(260, Math.round(Math.min(rect.width || 420, rect.height || rect.width || 420)));
    var dpr = clamp(window.devicePixelRatio || 1, 1, 3);
    var width = Math.round(size * dpr);
    var height = Math.round(size * dpr);

    if (state.canvas.width !== width || state.canvas.height !== height) {
      state.canvas.width = width;
      state.canvas.height = height;
      state.canvas.style.width = size + 'px';
      state.canvas.style.height = size + 'px';
      state.width = width;
      state.height = height;
      state.dpr = dpr;
      state.gl.viewport(0, 0, width, height);
    }
  }

  function render(now) {
    if (!initWebGL()) return;

    resize();

    var gl = state.gl;
    var cfg = BODY[state.body] || BODY.earth;
    var texture = ensureTexture(state.body);

    if (state.stage) {
      state.stage.setAttribute('data-body', state.body);
      state.stage.setAttribute('data-source-family', 'real-celestial-source');
      state.stage.setAttribute('data-body-geometry', 'true-webgl-sphere');
    }

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.useProgram(state.program);

    var projection = perspective(Math.PI / 5.8, 1, 0.1, 100);
    var model = identity();

    model = translate(model, 0, 0, -3.05);
    model = rotateX(model, state.body === 'earth' ? -0.21 : state.body === 'moon' ? -0.08 : 0.0);
    model = rotateY(model, state.angle[state.body] || 0);

    gl.uniformMatrix4fv(state.uniforms.projection, false, new Float32Array(projection));
    gl.uniformMatrix4fv(state.uniforms.model, false, new Float32Array(model));

    gl.uniform3fv(state.uniforms.light, new Float32Array(cfg.light));
    gl.uniform3fv(state.uniforms.rimColor, new Float32Array(cfg.rim));
    gl.uniform1f(state.uniforms.ambient, cfg.ambient);
    gl.uniform1f(state.uniforms.diffuse, cfg.diffuse);
    gl.uniform1f(state.uniforms.rimPower, cfg.rimPower);
    gl.uniform1f(state.uniforms.rimStrength, cfg.rimStrength);
    gl.uniform1f(state.uniforms.exposure, cfg.exposure);
    gl.uniform1f(state.uniforms.saturation, cfg.saturation);
    gl.uniform1f(state.uniforms.emissive, cfg.emissive);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.uniform1i(state.uniforms.texture, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, state.buffers.position);
    gl.enableVertexAttribArray(state.attribs.position);
    gl.vertexAttribPointer(state.attribs.position, 3, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, state.buffers.normal);
    gl.enableVertexAttribArray(state.attribs.normal);
    gl.vertexAttribPointer(state.attribs.normal, 3, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, state.buffers.uv);
    gl.enableVertexAttribArray(state.attribs.uv);
    gl.vertexAttribPointer(state.attribs.uv, 2, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, state.buffers.index);
    gl.drawElements(gl.TRIANGLES, state.buffers.count, gl.UNSIGNED_SHORT, 0);
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

    if (state.titleNode) {
      var fromTitle = bodyFromText(state.titleNode.textContent);
      if (fromTitle) return fromTitle;
    }

    return '';
  }

  function setBody(body, silent) {
    var next = normalizeBody(body);
    if (!next || !BODY[next]) return false;

    state.body = next;
    ensureTexture(next);
    render(performance.now());

    if (!silent) {
      window.dispatchEvent(new CustomEvent('dgb:showroom:render-body', {
        detail: {
          body: next,
          version: VERSION,
          authority: 'render-owns-bodies',
          geometry: 'true-webgl-sphere'
        }
      }));
    }

    return true;
  }

  function start() {
    state.playing = true;
  }

  function pause() {
    state.playing = false;
    render(performance.now());
  }

  function loop(now) {
    if (!state.last) state.last = now;
    var dt = clamp(now - state.last, 0, 80);
    state.last = now;

    var cfg = BODY[state.body] || BODY.earth;

    if (state.playing) {
      state.angle[state.body] += cfg.speed * dt;
      if (state.angle[state.body] > Math.PI * 2) state.angle[state.body] -= Math.PI * 2;
    }

    render(now);
    state.raf = window.requestAnimationFrame(loop);
  }

  function observeRouteControls() {
    document.addEventListener('click', function (event) {
      var control = event.target && event.target.closest
        ? event.target.closest('button,a,[role="button"],[data-body],[data-view-body],[data-globe-body]')
        : null;

      if (!control) return;

      var declared = normalizeBody(
        control.getAttribute('data-body') ||
        control.getAttribute('data-view-body') ||
        control.getAttribute('data-globe-body')
      );

      var text = bodyFromText(control.textContent || control.getAttribute('aria-label') || control.getAttribute('title'));
      var nextBody = declared || text;

      if (nextBody) {
        window.setTimeout(function () {
          setBody(readRouteBodyHint() || nextBody, true);
        }, 0);
        return;
      }

      var raw = String(control.textContent || control.getAttribute('aria-label') || '').toLowerCase();
      if (raw.indexOf('pause') !== -1) pause();
      if (raw.indexOf('start') !== -1 || raw.indexOf('play') !== -1) start();
    }, true);

    window.addEventListener('resize', function () {
      render(performance.now());
    }, { passive: true });

    ['dgb:body', 'dgb:showroom:body', 'dgb:showroom-globe:body', 'showroom:body', 'globe:body', 'bodychange'].forEach(function (name) {
      window.addEventListener(name, function (event) {
        var detail = event && event.detail ? event.detail : {};
        var next = normalizeBody(detail.body || detail.name || detail.target || detail.value || detail);
        if (next) setBody(next, true);
      });

      document.addEventListener(name, function (event) {
        var detail = event && event.detail ? event.detail : {};
        var next = normalizeBody(detail.body || detail.name || detail.target || detail.value || detail);
        if (next) setBody(next, true);
      });
    });

    window.setInterval(function () {
      var hinted = readRouteBodyHint();
      if (hinted && hinted !== state.body) setBody(hinted, true);
    }, 650);
  }

  function boot() {
    ensureStage();

    if (!initWebGL()) {
      if (state.stage) {
        state.stage.setAttribute('data-webgl-failed', 'true');
      }
      return;
    }

    ensureTexture('earth');
    ensureTexture('sun');
    ensureTexture('moon');

    setBody(readRouteBodyHint() || normalizeBody(window.location.hash) || 'earth', true);
    observeRouteControls();

    if (state.raf) window.cancelAnimationFrame(state.raf);
    state.raf = window.requestAnimationFrame(loop);
  }

  var api = {
    version: VERSION,
    setBody: function (body) { return setBody(body, false); },
    viewEarth: function () { return setBody('earth', false); },
    viewSun: function () { return setBody('sun', false); },
    viewMoon: function () { return setBody('moon', false); },
    start: start,
    pause: pause,
    refresh: function () { return render(performance.now()); },
    getState: function () {
      return {
        body: state.body,
        playing: state.playing,
        version: VERSION,
        authority: 'render-owns-bodies',
        geometry: 'true-webgl-sphere',
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
