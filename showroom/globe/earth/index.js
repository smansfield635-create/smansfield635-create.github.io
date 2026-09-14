// /showroom/globe/earth/index.js
// ZIONTS_PASSIVE_ROTATING_PLANET_NARRATIVE_v1
// One passive WebGL planet. No user-input, navigation, camera, geography, weather, or world-simulation authority.

const CONTRACT = "ZIONTS_PASSIVE_ROTATING_PLANET_NARRATIVE_v1";
const ROUTE = "/showroom/globe/earth/";
const PARENT = "/showroom/globe/";
const REDUCED = matchMedia("(prefers-reduced-motion: reduce)");
const state = {
  initialized: false,
  renderer: "none",
  webglVersion: 0,
  reducedMotion: REDUCED.matches,
  frameCount: 0,
  contextLossCount: 0,
  contextRestoreCount: 0,
  failureReason: null,
  passiveRotation: true,
  inputAuthority: "NONE",
  generatedImage: false,
  audraliaRuntimeImport: false
};

let canvas = null;
let gl = null;
let resources = null;
let raf = 0;
let last = 0;
let angle = 0.35;
let visible = !document.hidden;

function exposeStatus() {
  window.DGBZiontsRoute = Object.freeze({
    status() {
      return Object.freeze({
        contract: CONTRACT,
        route: ROUTE,
        parent: PARENT,
        publicBody: "ZIONTS",
        renderer: state.renderer,
        webglVersion: state.webglVersion,
        initialized: state.initialized,
        reducedMotion: state.reducedMotion,
        frameCount: state.frameCount,
        contextLossCount: state.contextLossCount,
        contextRestoreCount: state.contextRestoreCount,
        failureReason: state.failureReason,
        passiveRotation: state.passiveRotation,
        inputAuthority: state.inputAuthority,
        generatedImage: state.generatedImage,
        audraliaRuntimeImport: state.audraliaRuntimeImport,
        groundEngine: false,
        inspectableWorld: false
      });
    }
  });
}

function markDocument() {
  const markers = {
    page: "zionts-public-child-route",
    route: ROUTE,
    contract: CONTRACT,
    publicBody: "ZIONTS",
    parent: PARENT,
    groundEngine: "false",
    inspectableWorld: "false",
    planetInputAuthority: "none",
    generatedImage: "false",
    audraliaIdentity: "false"
  };
  for (const [key, value] of Object.entries(markers)) {
    document.documentElement.dataset[key] = String(value);
    if (document.body) document.body.dataset[key] = String(value);
  }
}

function fail(reason) {
  state.failureReason = String(reason || "RENDERER_FAILURE");
  state.initialized = false;
  document.documentElement.dataset.ziontsRenderer = "failed";
  exposeStatus();
}

function shader(type, source) {
  const sh = gl.createShader(type);
  gl.shaderSource(sh, source);
  gl.compileShader(sh);
  if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
    const info = gl.getShaderInfoLog(sh) || "SHADER_COMPILE_FAILED";
    gl.deleteShader(sh);
    throw new Error(info);
  }
  return sh;
}

function program(vsSource, fsSource) {
  const vs = shader(gl.VERTEX_SHADER, vsSource);
  const fs = shader(gl.FRAGMENT_SHADER, fsSource);
  const p = gl.createProgram();
  gl.attachShader(p, vs);
  gl.attachShader(p, fs);
  gl.linkProgram(p);
  gl.deleteShader(vs);
  gl.deleteShader(fs);
  if (!gl.getProgramParameter(p, gl.LINK_STATUS)) {
    const info = gl.getProgramInfoLog(p) || "PROGRAM_LINK_FAILED";
    gl.deleteProgram(p);
    throw new Error(info);
  }
  return p;
}

function fract(v) { return v - Math.floor(v); }
function hash3(x, y, z) {
  return fract(Math.sin(x * 127.1 + y * 311.7 + z * 74.7) * 43758.5453123);
}
function norm3(x, y, z) {
  const n = Math.hypot(x, y, z) || 1;
  return [x / n, y / n, z / n];
}
function dot3(a, b) { return a[0]*b[0] + a[1]*b[1] + a[2]*b[2]; }

const CRATERS = [
  [-0.50, 0.25, 0.82, .16, .040], [0.31, .62, .72, .10, .033], [.58,-.48,.65,.12,.030],
  [-.72,-.35,.59,.09,.024], [.14,-.77,.62,.075,.020], [.82,.12,.55,.07,.018],
  [-.22,.84,.49,.055,.016], [.44,.14,-.89,.11,.031], [-.62,.51,-.59,.08,.022],
  [.71,-.16,-.69,.06,.018], [-.19,-.61,-.77,.09,.023], [.18,.92,-.34,.07,.019],
  [-.83,.04,-.55,.055,.016], [.54,.74,-.39,.05,.014]
].map(([x,y,z,r,d]) => ({ c:norm3(x,y,z), r, d }));

function relief(nx, ny, nz) {
  const broad =
    Math.sin(nx * 7.3 + ny * 2.1) * .008 +
    Math.sin(ny * 11.9 - nz * 4.7) * .006 +
    Math.sin((nx + nz) * 19.1) * .0035;
  const fine = (hash3(nx*23.0, ny*29.0, nz*31.0) - .5) * .0055;
  let h = broad + fine;
  const n = [nx, ny, nz];
  for (const q of CRATERS) {
    const d = Math.acos(Math.max(-1, Math.min(1, dot3(n, q.c))));
    if (d < q.r) {
      const t = d / q.r;
      const bowl = -(1 - t*t) * q.d;
      const rim = Math.exp(-Math.pow((t - .88) / .09, 2)) * q.d * .48;
      h += bowl + rim;
    }
  }
  const scar = Math.abs(Math.sin((nx * 2.7 + ny * 4.1 - nz * 1.8) * 8.0));
  if (scar < .025 && ny > -.65) h -= .008 * (1 - scar/.025);
  return Math.max(-.055, Math.min(.035, h));
}

function buildSphere(latSegments = 64, lonSegments = 96) {
  const positions = [];
  const tones = [];
  const indices = [];
  for (let y = 0; y <= latSegments; y++) {
    const v = y / latSegments;
    const theta = v * Math.PI;
    const sy = Math.cos(theta);
    const ring = Math.sin(theta);
    for (let x = 0; x <= lonSegments; x++) {
      const u = x / lonSegments;
      const phi = u * Math.PI * 2;
      const nx = ring * Math.cos(phi);
      const ny = sy;
      const nz = ring * Math.sin(phi);
      const h = relief(nx, ny, nz);
      const r = 1 + h;
      positions.push(nx*r, ny*r, nz*r);
      const strata = .5 + .5 * Math.sin(phi * 3.0 + theta * 8.0 + h * 180);
      tones.push(Math.max(0, Math.min(1, .5 + h * 8 + (strata-.5)*.22)));
    }
  }
  const row = lonSegments + 1;
  for (let y = 0; y < latSegments; y++) {
    for (let x = 0; x < lonSegments; x++) {
      const a = y*row + x;
      const b = a + row;
      indices.push(a,b,a+1, b,b+1,a+1);
    }
  }

  const normals = new Float32Array(positions.length);
  for (let i = 0; i < indices.length; i += 3) {
    const ia = indices[i]*3, ib = indices[i+1]*3, ic = indices[i+2]*3;
    const ax=positions[ia], ay=positions[ia+1], az=positions[ia+2];
    const bx=positions[ib], by=positions[ib+1], bz=positions[ib+2];
    const cx=positions[ic], cy=positions[ic+1], cz=positions[ic+2];
    const abx=bx-ax, aby=by-ay, abz=bz-az;
    const acx=cx-ax, acy=cy-ay, acz=cz-az;
    const nx=aby*acz-abz*acy, ny=abz*acx-abx*acz, nz=abx*acy-aby*acx;
    normals[ia]+=nx; normals[ia+1]+=ny; normals[ia+2]+=nz;
    normals[ib]+=nx; normals[ib+1]+=ny; normals[ib+2]+=nz;
    normals[ic]+=nx; normals[ic+1]+=ny; normals[ic+2]+=nz;
  }
  for (let i=0;i<normals.length;i+=3) {
    const n=norm3(normals[i],normals[i+1],normals[i+2]);
    normals[i]=n[0]; normals[i+1]=n[1]; normals[i+2]=n[2];
  }
  return {
    positions: new Float32Array(positions),
    normals,
    tones: new Float32Array(tones),
    indices: new Uint16Array(indices)
  };
}

function perspective(out, fovy, aspect, near, far) {
  const f = 1 / Math.tan(fovy / 2);
  out.fill(0);
  out[0] = f / aspect; out[5] = f;
  out[10] = (far + near) / (near - far);
  out[11] = -1;
  out[14] = (2 * far * near) / (near - far);
  return out;
}
function multiply(out, a, b) {
  const r = new Float32Array(16);
  for (let c=0;c<4;c++) for (let row=0;row<4;row++) {
    r[c*4+row] =
      a[0*4+row]*b[c*4+0] + a[1*4+row]*b[c*4+1] +
      a[2*4+row]*b[c*4+2] + a[3*4+row]*b[c*4+3];
  }
  out.set(r); return out;
}
function rotationTiltY(out, tilt, spin) {
  const cx=Math.cos(tilt), sx=Math.sin(tilt), cy=Math.cos(spin), sy=Math.sin(spin);
  out.set([
    cy, sx*sy, -cx*sy, 0,
    0, cx, sx, 0,
    sy, -sx*cy, cx*cy, 0,
    0, 0, 0, 1
  ]);
  return out;
}
function translationZ(out, z) {
  out.set([1,0,0,0, 0,1,0,0, 0,0,1,0, 0,0,z,1]); return out;
}

function createResources() {
  gl = canvas.getContext("webgl", {
    alpha:true, antialias:true, depth:true, powerPreference:"high-performance",
    premultipliedAlpha:true, preserveDrawingBuffer:false
  }) || canvas.getContext("experimental-webgl", {
    alpha:true, antialias:true, depth:true, powerPreference:"high-performance",
    premultipliedAlpha:true, preserveDrawingBuffer:false
  });
  if (!gl) throw new Error("WEBGL_UNAVAILABLE");

  state.webglVersion = 1;
  state.renderer = "webgl1";

  const vs = `
    precision highp float;
    attribute vec3 a_position;
    attribute vec3 a_normal;
    attribute float a_tone;
    uniform mat4 u_mvp;
    uniform mat4 u_model;
    varying vec3 v_normal;
    varying float v_tone;
    varying vec3 v_position;
    void main(){
      vec4 world = u_model * vec4(a_position,1.0);
      v_position = world.xyz;
      v_normal = normalize((u_model * vec4(a_normal,0.0)).xyz);
      v_tone = a_tone;
      gl_Position = u_mvp * vec4(a_position,1.0);
    }`;
  const fs = `
    precision highp float;
    varying vec3 v_normal;
    varying float v_tone;
    varying vec3 v_position;
    uniform vec3 u_light;
    void main(){
      vec3 n = normalize(v_normal);
      vec3 l = normalize(u_light);
      float ndl = max(dot(n,l),0.0);
      float halfLight = max(dot(n,normalize(l+vec3(0.0,0.0,1.0))),0.0);
      float rim = pow(1.0-max(n.z,0.0),3.2);
      float mineral = 0.5 + 0.5*sin((v_position.x*13.0 + v_position.y*17.0 - v_position.z*11.0) + v_tone*7.0);
      vec3 low = vec3(0.045,0.032,0.035);
      vec3 mid = vec3(0.19,0.075,0.060);
      vec3 high = vec3(0.39,0.18,0.135);
      vec3 albedo = mix(low,mid,clamp(v_tone*.9+.08,0.0,1.0));
      albedo = mix(albedo,high,pow(clamp(v_tone,0.0,1.0),2.2)*.42);
      albedo *= .86 + mineral*.13;
      vec3 color = albedo*(.12 + ndl*.92);
      color += vec3(.20,.07,.045)*pow(halfLight,18.0)*.15;
      color += vec3(.23,.055,.035)*rim*.09;
      float terminator = smoothstep(-.06,.08,dot(n,l));
      color *= .42 + terminator*.58;
      gl_FragColor = vec4(color,1.0);
    }`;
  const p = program(vs, fs);
  const mesh = buildSphere();

  function buffer(target, data) {
    const b = gl.createBuffer();
    gl.bindBuffer(target,b);
    gl.bufferData(target,data,gl.STATIC_DRAW);
    return b;
  }
  const position = buffer(gl.ARRAY_BUFFER,mesh.positions);
  const normal = buffer(gl.ARRAY_BUFFER,mesh.normals);
  const tone = buffer(gl.ARRAY_BUFFER,mesh.tones);
  const index = buffer(gl.ELEMENT_ARRAY_BUFFER,mesh.indices);

  return {
    program:p, position, normal, tone, index, count:mesh.indices.length,
    aPosition:gl.getAttribLocation(p,"a_position"),
    aNormal:gl.getAttribLocation(p,"a_normal"),
    aTone:gl.getAttribLocation(p,"a_tone"),
    uMvp:gl.getUniformLocation(p,"u_mvp"),
    uModel:gl.getUniformLocation(p,"u_model"),
    uLight:gl.getUniformLocation(p,"u_light")
  };
}

function destroyResources() {
  if (!gl || !resources) return;
  for (const key of ["position","normal","tone","index"]) if (resources[key]) gl.deleteBuffer(resources[key]);
  if (resources.program) gl.deleteProgram(resources.program);
  resources = null;
}

function resize() {
  if (!canvas || !gl) return;
  const rect = canvas.getBoundingClientRect();
  const mobile = matchMedia("(max-width: 640px)").matches;
  const cap = mobile ? 1.65 : 2.0;
  const dpr = Math.min(window.devicePixelRatio || 1, cap);
  const w = Math.max(2, Math.round(rect.width*dpr));
  const h = Math.max(2, Math.round(rect.height*dpr));
  if (canvas.width !== w || canvas.height !== h) {
    canvas.width = w; canvas.height = h;
    gl.viewport(0,0,w,h);
  }
}

function draw() {
  if (!gl || !resources) return;
  resize();
  gl.enable(gl.DEPTH_TEST);
  gl.depthFunc(gl.LEQUAL);
  gl.disable(gl.BLEND);
  gl.clearColor(0,0,0,0);
  gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);
  gl.useProgram(resources.program);

  const aspect = canvas.width / Math.max(1, canvas.height);
  const projection = perspective(new Float32Array(16), Math.PI/3.3, aspect, .1, 20);
  const view = translationZ(new Float32Array(16), -3.05);
  const model = rotationTiltY(new Float32Array(16), -0.18, angle);
  const pv = multiply(new Float32Array(16), projection, view);
  const mvp = multiply(new Float32Array(16), pv, model);

  gl.bindBuffer(gl.ARRAY_BUFFER,resources.position);
  gl.enableVertexAttribArray(resources.aPosition);
  gl.vertexAttribPointer(resources.aPosition,3,gl.FLOAT,false,0,0);
  gl.bindBuffer(gl.ARRAY_BUFFER,resources.normal);
  gl.enableVertexAttribArray(resources.aNormal);
  gl.vertexAttribPointer(resources.aNormal,3,gl.FLOAT,false,0,0);
  gl.bindBuffer(gl.ARRAY_BUFFER,resources.tone);
  gl.enableVertexAttribArray(resources.aTone);
  gl.vertexAttribPointer(resources.aTone,1,gl.FLOAT,false,0,0);
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,resources.index);

  gl.uniformMatrix4fv(resources.uMvp,false,mvp);
  gl.uniformMatrix4fv(resources.uModel,false,model);
  gl.uniform3f(resources.uLight,.74,.42,.58);
  gl.drawElements(gl.TRIANGLES,resources.count,gl.UNSIGNED_SHORT,0);
  state.frameCount++;
}

function tick(now) {
  raf = 0;
  if (!visible || !gl || !resources) return;
  const dt = Math.min(.05, Math.max(0,(now-last)/1000 || 0));
  last = now;
  if (!state.reducedMotion) angle = (angle + dt*.045) % (Math.PI*2);
  draw();
  if (!state.reducedMotion) raf = requestAnimationFrame(tick);
}

function start() {
  if (!visible || !gl || !resources) return;
  if (raf) cancelAnimationFrame(raf);
  last = performance.now();
  draw();
  if (!state.reducedMotion) raf = requestAnimationFrame(tick);
}

function onContextLost(event) {
  event.preventDefault();
  state.contextLossCount++;
  if (raf) cancelAnimationFrame(raf);
  raf = 0;
  state.initialized = false;
  document.documentElement.dataset.ziontsRenderer = "failed";
  exposeStatus();
}
function onContextRestored() {
  state.contextRestoreCount++;
  try {
    resources = createResources();
    state.initialized = true;
    state.failureReason = null;
    document.documentElement.dataset.ziontsRenderer = "ready";
    exposeStatus();
    start();
  } catch (error) {
    fail(error?.message || "CONTEXT_RESTORE_FAILED");
  }
}

function initRenderer() {
  canvas = document.getElementById("ziontsPlanet");
  if (!canvas) return fail("PLANET_CANVAS_MISSING");
  canvas.setAttribute("aria-hidden","true");
  canvas.style.pointerEvents = "none";
  canvas.addEventListener("webglcontextlost",onContextLost,false);
  canvas.addEventListener("webglcontextrestored",onContextRestored,false);

  try {
    resources = createResources();
    state.initialized = true;
    state.failureReason = null;
    document.documentElement.dataset.ziontsRenderer = "ready";
    exposeStatus();
    start();
  } catch (error) {
    fail(error?.message || "PLANET_INIT_FAILED");
  }
}

function init() {
  markDocument();
  exposeStatus();
  initRenderer();

  document.addEventListener("visibilitychange",() => {
    visible = !document.hidden;
    if (!visible && raf) {
      cancelAnimationFrame(raf);
      raf = 0;
    } else if (visible) {
      start();
    }
  },{passive:true});

  REDUCED.addEventListener?.("change",(event) => {
    state.reducedMotion = event.matches;
    exposeStatus();
    start();
  });

  addEventListener("resize",() => {
    if (state.reducedMotion) draw();
  },{passive:true});
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded",init,{once:true});
} else {
  init();
}

export default init;
