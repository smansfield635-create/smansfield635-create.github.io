const CONTRACT = Object.freeze({
  id: 'DGB_COMMUNITY_GEN2330_STATIC_VISUAL_ARCHITECTURE_V1',
  operationId: 'COMMUNITY_STATIC_VISUAL_ARCHITECTURE_PROOF_20260916_001',
  object: 'COMMUNITY_FOUR_PERMANENT_DOMAIN_STATIC_PROOF',
  checkpoint: 'PHYSICAL_REVIEW_A',
  seasons: Object.freeze(['SPRING', 'SUMMER', 'AUTUMN', 'WINTER']),
  permanentDomainCount: 4,
  portalCount: 4,
  visibleConnectorCount: 0,
  trackedLifecycleObjectCount: 0,
  trackedMotionEnabled: false,
  sourceDomainsPersistent: true,
  treeRole: 'DESTINATION_SHARED_CENTER',
  comprehensionTarget: 'FOUR_WORLDS_TO_SHARED_CENTER',
  inspectionYawLimitDegrees: 12,
  topologyRandomness: false
});

const root = document.querySelector('[data-community-lifecycle-mount]');
if (root) queueMicrotask(() => mount(root));

const V = (x, y, z) => ({ x, y, z });
const A = (a, b) => V(a.x + b.x, a.y + b.y, a.z + b.z);
const S = (a, b) => V(a.x - b.x, a.y - b.y, a.z - b.z);
const M = (a, s) => V(a.x * s, a.y * s, a.z * s);
const C = (a, b) => V(a.y*b.z-a.z*b.y, a.z*b.x-a.x*b.z, a.x*b.y-a.y*b.x);
const N = a => {
  const d = Math.hypot(a.x, a.y, a.z);
  if (d < 1e-9) return V(0, 1, 0);
  return V(a.x/d, a.y/d, a.z/d);
};
const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));

const KIND = Object.freeze({
  TREE: 1,
  DOMAIN_GROUND: 2,
  DOMAIN_DETAIL: 3,
  PORTAL_RIM: 4,
  PORTAL_VOID: 5,
  CENTRAL_GROUND: 6
});
const SEASON = Object.freeze({ NONE: -1, SPRING: 0, SUMMER: 1, AUTUMN: 2, WINTER: 3 });

const PALETTE = Object.freeze({
  wood: Object.freeze([0.24, 0.13, 0.065, 1]),
  woodDark: Object.freeze([0.14, 0.075, 0.04, 1]),
  centerEarth: Object.freeze([0.12, 0.14, 0.095, 1]),
  centerMoss: Object.freeze([0.16, 0.29, 0.16, 1]),
  springGround: Object.freeze([0.13, 0.34, 0.17, 1]),
  springBright: Object.freeze([0.43, 0.72, 0.35, 1]),
  springBlossom: Object.freeze([0.96, 0.55, 0.70, 1]),
  summerGround: Object.freeze([0.18, 0.36, 0.14, 1]),
  summerBright: Object.freeze([0.78, 0.67, 0.23, 1]),
  summerWater: Object.freeze([0.12, 0.52, 0.74, 0.90]),
  autumnGround: Object.freeze([0.43, 0.20, 0.07, 1]),
  autumnBright: Object.freeze([0.88, 0.42, 0.09, 1]),
  autumnRed: Object.freeze([0.68, 0.16, 0.06, 1]),
  winterGround: Object.freeze([0.66, 0.78, 0.80, 1]),
  winterBright: Object.freeze([0.86, 0.95, 1.00, 1]),
  winterEvergreen: Object.freeze([0.11, 0.28, 0.24, 1]),
  portalVoid: Object.freeze([0.008, 0.015, 0.025, 0.92])
});

const DOMAINS = Object.freeze([
  Object.freeze({ id: 'SPRING', season: SEASON.SPRING, center: V(-1.72, 1.23, -0.02), portal: V(-1.03, 0.79, 0.10), ground: PALETTE.springGround, bright: PALETTE.springBright }),
  Object.freeze({ id: 'WINTER', season: SEASON.WINTER, center: V(1.72, 1.23, -0.02), portal: V(1.03, 0.79, 0.10), ground: PALETTE.winterGround, bright: PALETTE.winterBright }),
  Object.freeze({ id: 'SUMMER', season: SEASON.SUMMER, center: V(-1.72, -1.04, -0.02), portal: V(-1.03, -0.61, 0.10), ground: PALETTE.summerGround, bright: PALETTE.summerBright }),
  Object.freeze({ id: 'AUTUMN', season: SEASON.AUTUMN, center: V(1.72, -1.04, -0.02), portal: V(1.03, -0.61, 0.10), ground: PALETTE.autumnGround, bright: PALETTE.autumnBright })
]);

function mesh() { return { p: [], n: [], c: [], k: [], s: [], i: [], domainRanges: [], portalRanges: [] }; }
function vert(g, p, n, color, kind, season = SEASON.NONE) {
  const i = g.p.length / 3;
  g.p.push(p.x, p.y, p.z); g.n.push(n.x, n.y, n.z); g.c.push(...color); g.k.push(kind); g.s.push(season);
  return i;
}
function tube(g, a, b, r0, r1, color, kind, season = SEASON.NONE, sides = 8, seed = 0) {
  const axis = N(S(b, a));
  const ref = Math.abs(axis.y) > 0.84 ? V(1, 0, 0) : V(0, 1, 0);
  const u = N(C(axis, ref)); const v = N(C(axis, u)); const base = g.p.length / 3;
  for (let end = 0; end < 2; end++) {
    const center = end ? b : a; const r = end ? r1 : r0;
    for (let side = 0; side < sides; side++) {
      const ang = Math.PI * 2 * side / sides;
      const wobble = 1 + 0.025 * Math.sin(seed * 1.91 + side * 1.37 + end * 0.7);
      const radial = A(M(u, Math.cos(ang)), M(v, Math.sin(ang)));
      vert(g, A(center, M(radial, r * wobble)), radial, color, kind, season);
    }
  }
  for (let side = 0; side < sides; side++) {
    const next = (side + 1) % sides;
    const a0 = base + side, a1 = base + next, b0 = base + sides + side, b1 = base + sides + next;
    g.i.push(a0, b0, a1, a1, b0, b1);
  }
}
function orb(g, o, r, color, kind, season = SEASON.NONE, lon = 10, lat = 6) {
  const base = g.p.length / 3;
  for (let y = 0; y <= lat; y++) {
    const ph = Math.PI * y / lat;
    for (let x = 0; x < lon; x++) {
      const th = Math.PI * 2 * x / lon;
      const nx = Math.sin(ph) * Math.cos(th), ny = Math.cos(ph), nz = Math.sin(ph) * Math.sin(th);
      const n = N(V(nx / Math.max(0.001, r.x), ny / Math.max(0.001, r.y), nz / Math.max(0.001, r.z)));
      vert(g, A(o, V(nx*r.x, ny*r.y, nz*r.z)), n, color, kind, season);
    }
  }
  for (let y = 0; y < lat; y++) for (let x = 0; x < lon; x++) {
    const next = (x + 1) % lon;
    const a = base + y*lon + x, b = base + y*lon + next, c = base + (y+1)*lon + x, d = base + (y+1)*lon + next;
    g.i.push(a, c, b, b, c, d);
  }
}
function flower(g, o, scale, season = SEASON.SPRING) {
  orb(g, o, V(0.035*scale,0.035*scale,0.03*scale), [1,0.78,0.30,1], KIND.DOMAIN_DETAIL, season, 7, 4);
  for (let i = 0; i < 5; i++) {
    const a = Math.PI*2*i/5;
    const p = A(o, V(Math.cos(a)*0.075*scale, Math.sin(a)*0.075*scale, 0.01));
    orb(g, p, V(0.055*scale,0.036*scale,0.025*scale), PALETTE.springBlossom, KIND.DOMAIN_DETAIL, season, 7, 4);
  }
}
function leaf(g, o, scale, color, season = SEASON.AUTUMN) { orb(g, o, V(0.09*scale,0.045*scale,0.028*scale), color, KIND.DOMAIN_DETAIL, season, 8, 4); }
function snowCrystal(g, o, scale) {
  for (let i = 0; i < 6; i++) {
    const a = Math.PI*i/3, e = A(o, V(Math.cos(a)*0.09*scale, Math.sin(a)*0.09*scale, 0));
    tube(g, o, e, 0.010*scale, 0.004*scale, PALETTE.winterBright, KIND.DOMAIN_DETAIL, SEASON.WINTER, 6, 80+i);
  }
}
function sapling(g, base, height, crownColor, season, snow = false) {
  const top = A(base, V(0, height, 0));
  tube(g, base, top, 0.035, 0.020, PALETTE.woodDark, KIND.DOMAIN_DETAIL, season, 7, 130 + season);
  const crownY = base.y + height*0.78;
  if (snow) {
    for (let tier = 0; tier < 3; tier++) {
      const y = crownY - tier*height*0.18;
      orb(g, V(base.x, y, base.z), V(0.16+0.05*tier,0.10,0.12+0.03*tier), PALETTE.winterEvergreen, KIND.DOMAIN_DETAIL, season, 8, 5);
      orb(g, V(base.x, y+0.045, base.z+0.015), V(0.13+0.04*tier,0.045,0.09+0.02*tier), PALETTE.winterBright, KIND.DOMAIN_DETAIL, season, 8, 4);
    }
  } else {
    orb(g, V(base.x, crownY, base.z), V(0.22,0.17,0.18), crownColor, KIND.DOMAIN_DETAIL, season, 9, 6);
    orb(g, V(base.x-0.12, crownY-0.05, base.z+0.02), V(0.15,0.12,0.13), crownColor, KIND.DOMAIN_DETAIL, season, 8, 5);
    orb(g, V(base.x+0.13, crownY-0.03, base.z-0.02), V(0.15,0.12,0.13), crownColor, KIND.DOMAIN_DETAIL, season, 8, 5);
  }
}
function portal(g, d) {
  const start = g.p.length / 3, p = d.portal;
  orb(g, V(p.x, p.y+0.15, p.z-0.055), V(0.19,0.29,0.075), PALETTE.portalVoid, KIND.PORTAL_VOID, d.season, 12, 7);
  const width = 0.42, height = 0.56, segments = 10;
  let prev = V(p.x-width/2, p.y-0.04, p.z);
  for (let i = 1; i <= segments; i++) {
    const t = i/segments, a = Math.PI * (1-t);
    const x = p.x + Math.cos(a)*width/2, y = p.y + Math.sin(a)*height/2 + 0.10;
    const next = V(x, y, p.z);
    tube(g, prev, next, 0.035, 0.035, d.bright, KIND.PORTAL_RIM, d.season, 7, 300+d.season*20+i); prev = next;
  }
  tube(g, V(p.x-width/2,p.y-0.04,p.z), V(p.x-width/2,p.y+0.10,p.z), 0.042,0.035,d.bright,KIND.PORTAL_RIM,d.season,7,350+d.season);
  tube(g, V(p.x+width/2,p.y-0.04,p.z), V(p.x+width/2,p.y+0.10,p.z), 0.042,0.035,d.bright,KIND.PORTAL_RIM,d.season,7,360+d.season);
  const inward = N(V(-p.x, -p.y, 0));
  orb(g, A(V(p.x-width*0.23,p.y-0.10,p.z), M(inward,0.05)), V(0.10,0.045,0.09), d.ground, KIND.PORTAL_RIM,d.season,8,4);
  orb(g, A(V(p.x+width*0.23,p.y-0.10,p.z), M(inward,0.05)), V(0.10,0.045,0.09), d.ground, KIND.PORTAL_RIM,d.season,8,4);
  g.portalRanges.push(Object.freeze({ id: d.id, season: d.season, startVertex: start, endVertex: g.p.length/3 }));
}
function springDomain(g, d) {
  orb(g, d.center, V(0.72,0.38,0.36), d.ground, KIND.DOMAIN_GROUND,d.season,12,7);
  orb(g, A(d.center,V(-0.16,0.16,0.04)), V(0.46,0.19,0.30), PALETTE.springBright,KIND.DOMAIN_GROUND,d.season,11,6);
  sapling(g,A(d.center,V(-0.28,0.20,0.04)),0.58,[0.30,0.56,0.25,1],d.season);
  for (const [x,y,s] of [[0.14,0.20,0.9],[0.34,0.10,0.7],[-0.05,-0.02,0.65],[-0.38,-0.04,0.7]]) flower(g,A(d.center,V(x,y,0.30)),s);
}
function winterDomain(g, d) {
  orb(g, d.center, V(0.73,0.38,0.36), d.ground, KIND.DOMAIN_GROUND,d.season,12,7);
  orb(g, A(d.center,V(0.08,0.13,0.06)), V(0.55,0.18,0.31), PALETTE.winterBright,KIND.DOMAIN_GROUND,d.season,11,6);
  sapling(g,A(d.center,V(-0.24,0.18,0.03)),0.64,PALETTE.winterEvergreen,d.season,true);
  sapling(g,A(d.center,V(0.25,0.14,-0.03)),0.48,PALETTE.winterEvergreen,d.season,true);
  snowCrystal(g,A(d.center,V(0.38,0.32,0.28)),0.8); snowCrystal(g,A(d.center,V(-0.45,0.35,0.24)),0.65);
}
function summerDomain(g, d) {
  orb(g, d.center, V(0.74,0.37,0.37), d.ground, KIND.DOMAIN_GROUND,d.season,12,7);
  orb(g, A(d.center,V(0.10,0.10,0.10)), V(0.43,0.11,0.28), PALETTE.summerWater,KIND.DOMAIN_DETAIL,d.season,12,5);
  sapling(g,A(d.center,V(-0.30,0.18,0.02)),0.56,[0.23,0.49,0.17,1],d.season);
  for (const [x,y] of [[0.36,0.22],[0.47,0.05],[0.25,-0.02],[-0.02,0.20]]) tube(g,A(d.center,V(x,y,0.29)),A(d.center,V(x+0.02,y+0.23,0.28)),0.012,0.005,PALETTE.summerBright,KIND.DOMAIN_DETAIL,d.season,6,440+Math.round(x*100));
  orb(g,A(d.center,V(0.44,0.34,0.17)),V(0.12,0.12,0.10),[0.98,0.76,0.22,1],KIND.DOMAIN_DETAIL,d.season,9,5);
}
function autumnDomain(g, d) {
  orb(g, d.center, V(0.74,0.38,0.36), d.ground, KIND.DOMAIN_GROUND,d.season,12,7);
  orb(g, A(d.center,V(-0.02,0.15,0.05)), V(0.52,0.17,0.30), [0.55,0.25,0.06,1],KIND.DOMAIN_GROUND,d.season,11,6);
  sapling(g,A(d.center,V(0.25,0.18,0.02)),0.59,PALETTE.autumnBright,d.season);
  for (const [x,y,s,c] of [[-0.36,0.19,0.85,PALETTE.autumnBright],[-0.17,0.05,0.65,PALETTE.autumnRed],[0.03,-0.02,0.8,PALETTE.autumnBright],[0.40,0.03,0.65,PALETTE.autumnRed],[-0.46,-0.04,0.55,PALETTE.autumnBright]]) leaf(g,A(d.center,V(x,y,0.30)),s,c);
}
function centralTree(g) {
  orb(g,V(0,-0.43,-0.02),V(0.48,0.16,0.33),PALETTE.centerEarth,KIND.CENTRAL_GROUND,SEASON.NONE,12,6);
  orb(g,V(0,-0.34,0.02),V(0.36,0.09,0.27),PALETTE.centerMoss,KIND.CENTRAL_GROUND,SEASON.NONE,10,5);
  const base = V(0,-0.34,0.03), fork = V(0,0.28,0.02);
  tube(g,base,fork,0.12,0.075,PALETTE.wood,KIND.TREE,SEASON.NONE,9,510);
  const branches = [[fork,V(-0.34,0.66,0.03)],[fork,V(0.34,0.66,-0.02)],[V(0,0.12,0.02),V(-0.46,0.37,-0.04)],[V(0,0.12,0.02),V(0.46,0.37,0.05)],[V(0,0.35,0.01),V(-0.18,0.83,0.01)],[V(0,0.35,0.01),V(0.18,0.83,-0.02)]];
  branches.forEach(([a,b],i)=>tube(g,a,b,0.055,0.018,PALETTE.wood,KIND.TREE,SEASON.NONE,7,520+i));
  [V(-0.35,0.66,0.02),V(0.35,0.66,0.00),V(-0.12,0.86,0.02),V(0.14,0.86,-0.02),V(0,0.58,0.06)].forEach((p,i)=>orb(g,p,V(0.22+(i%2)*0.03,0.16,0.18),[0.20,0.37,0.20,1],KIND.TREE,SEASON.NONE,9,6));
  orb(g,V(0,-0.24,0.28),V(0.10,0.10,0.06),[0.82,0.62,0.20,0.92],KIND.TREE,SEASON.NONE,9,5);
}
function build() {
  const g = mesh();
  for (const d of DOMAINS) {
    const start = g.p.length/3;
    if (d.season === SEASON.SPRING) springDomain(g,d); else if (d.season === SEASON.WINTER) winterDomain(g,d); else if (d.season === SEASON.SUMMER) summerDomain(g,d); else autumnDomain(g,d);
    portal(g,d); g.domainRanges.push(Object.freeze({ id:d.id, season:d.season, startVertex:start, endVertex:g.p.length/3 }));
  }
  centralTree(g);
  if (g.p.length/3 > 65535) throw Error('GEN2330_VERTEX_BUDGET');
  return g;
}

function vertexSource(webgl2) { return `${webgl2 ? '#version 300 es\n' : ''}precision highp float;
${webgl2 ? 'in' : 'attribute'} vec3 a_position,a_normal;
${webgl2 ? 'in' : 'attribute'} vec4 a_color;
${webgl2 ? 'in' : 'attribute'} float a_kind,a_season;
uniform float u_yaw,u_pitch,u_scale,u_aspect,u_camera;
${webgl2 ? 'out' : 'varying'} vec3 v_n;
${webgl2 ? 'out' : 'varying'} vec4 v_c;
${webgl2 ? 'out' : 'varying'} float v_k;
void main(){
  float cy=cos(u_yaw),sy=sin(u_yaw),cp=cos(u_pitch),sp=sin(u_pitch);
  vec3 p=a_position,n=a_normal;
  p=vec3(cy*p.x+sy*p.z,p.y,-sy*p.x+cy*p.z); n=vec3(cy*n.x+sy*n.z,n.y,-sy*n.x+cy*n.z);
  p=vec3(p.x,cp*p.y-sp*p.z,sp*p.y+cp*p.z); n=vec3(n.x,cp*n.y-sp*n.z,sp*n.y+cp*n.z);
  p.y-=0.02; p*=u_scale;
  float z=max(1.1,u_camera-p.z),nc=1.0,fc=12.0; float zc=((fc+nc)/(fc-nc))*z-(2.0*fc*nc)/(fc-nc);
  gl_Position=vec4(p.x*1.62/u_aspect,p.y*1.62,zc,z); v_n=normalize(n);v_c=a_color;v_k=a_kind;
}`; }
function fragmentSource(webgl2) { return `${webgl2 ? '#version 300 es\n' : ''}precision highp float;
${webgl2 ? 'in' : 'varying'} vec3 v_n;
${webgl2 ? 'in' : 'varying'} vec4 v_c;
${webgl2 ? 'in' : 'varying'} float v_k;
${webgl2 ? 'out vec4 lifecycleColor;' : ''}
void main(){
  vec3 N=normalize(v_n),K=normalize(vec3(-0.38,0.78,0.48)); float d=0.38+0.62*max(0.0,dot(N,K));
  float voidMask=step(4.5,v_k)*step(v_k,5.5); vec3 lit=mix(v_c.rgb*d+vec3(0.012),v_c.rgb,voidMask*0.72);
  ${webgl2 ? 'lifecycleColor' : 'gl_FragColor'}=vec4(lit,v_c.a);
}`; }
function shader(gl,type,src){ const s=gl.createShader(type);gl.shaderSource(s,src);gl.compileShader(s);if(!gl.getShaderParameter(s,gl.COMPILE_STATUS))throw Error(gl.getShaderInfoLog(s)||'GEN2330_SHADER');return s; }
function renderer(gl,g,webgl2){
  const p=gl.createProgram(),vs=shader(gl,gl.VERTEX_SHADER,vertexSource(webgl2)),fs=shader(gl,gl.FRAGMENT_SHADER,fragmentSource(webgl2));
  gl.attachShader(p,vs);gl.attachShader(p,fs);gl.linkProgram(p);if(!gl.getProgramParameter(p,gl.LINK_STATUS))throw Error(gl.getProgramInfoLog(p)||'GEN2330_LINK');
  const buffers={},upload=(key,data,T=Float32Array,target=gl.ARRAY_BUFFER)=>{const b=gl.createBuffer();gl.bindBuffer(target,b);gl.bufferData(target,new T(data),gl.STATIC_DRAW);buffers[key]=b;};
  upload('p',g.p);upload('n',g.n);upload('c',g.c);upload('k',g.k);upload('s',g.s);upload('i',g.i,Uint16Array,gl.ELEMENT_ARRAY_BUFFER);
  gl.useProgram(p);
  [['a_position','p',3],['a_normal','n',3],['a_color','c',4],['a_kind','k',1],['a_season','s',1]].forEach(([name,key,size])=>{const loc=gl.getAttribLocation(p,name);if(loc<0)return;gl.bindBuffer(gl.ARRAY_BUFFER,buffers[key]);gl.enableVertexAttribArray(loc);gl.vertexAttribPointer(loc,size,gl.FLOAT,false,0,0);});
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,buffers.i);gl.enable(gl.DEPTH_TEST);gl.enable(gl.BLEND);gl.blendFunc(gl.SRC_ALPHA,gl.ONE_MINUS_SRC_ALPHA);
  const U=name=>gl.getUniformLocation(p,name);return{p,count:g.i.length,u:{yaw:U('u_yaw'),pitch:U('u_pitch'),scale:U('u_scale'),aspect:U('u_aspect'),camera:U('u_camera')}};
}

const GEOMETRY = build();
const STATIC_RECEIPT = Object.freeze({
  schema:'COMMUNITY_STATIC_VISUAL_ARCHITECTURE_RECEIPT_v1', operationId:CONTRACT.operationId, candidateClass:'STATIC_VISUAL_ARCHITECTURE_PROOF',
  permanentDomainCount:GEOMETRY.domainRanges.length, distinctDomainIds:new Set(GEOMETRY.domainRanges.map(x=>x.id)).size,
  portalCount:GEOMETRY.portalRanges.length, distinctPortalIds:new Set(GEOMETRY.portalRanges.map(x=>x.id)).size,
  visibleConnectorCount:0, trackedLifecycleObjectCount:0, trackedMotionEnabled:false, sourceDomainsPersistent:true,
  treeRole:'DESTINATION_SHARED_CENTER', centralClearAir:true, labelsRequiredForComprehension:false, comprehensionTarget:'FOUR_WORLDS_TO_SHARED_CENTER',
  fullAuthoredStageMount:'[data-community-lifecycle-mount]',
  passed:GEOMETRY.domainRanges.length===4&&new Set(GEOMETRY.domainRanges.map(x=>x.id)).size===4&&GEOMETRY.portalRanges.length===4&&new Set(GEOMETRY.portalRanges.map(x=>x.id)).size===4
});
if(!STATIC_RECEIPT.passed) throw Error('GEN2330_STATIC_ARCHITECTURE_FAILURE');
globalThis.DGB_COMMUNITY_STATIC_VISUAL_ARCHITECTURE_RECEIPT = STATIC_RECEIPT;

function mount(host){
  const doc=host.ownerDocument||document,style=doc.createElement('style');style.dataset.communityLifecycleStyle='gen2330-static';
  style.textContent='[data-community-lifecycle-mount]{position:relative;isolation:isolate;overflow:hidden;min-height:22rem}.community-lifecycle3d-canvas{position:absolute;inset:0;display:block;width:100%;height:100%;touch-action:pan-y;cursor:grab}@media(max-width:720px){[data-community-lifecycle-mount]{min-height:25rem}}';doc.head.append(style);
  const c=doc.createElement('canvas');c.className='community-lifecycle3d-canvas';c.setAttribute('aria-hidden','true');host.append(c);
  const opts={alpha:true,antialias:true,depth:true,powerPreference:'low-power'};let gl=c.getContext('webgl2',opts),webgl2=true;if(!gl){gl=c.getContext('webgl',opts)||c.getContext('experimental-webgl',opts);webgl2=false}if(!gl){host.dataset.lifecycleStatus='webgl-unavailable';return}
  const R=renderer(gl,GEOMETRY,webgl2);let yaw=-0.07,targetYaw=yaw,pitch=-0.04,targetPitch=pitch,drag=null,last=performance.now(),raf=0,visible=true;
  const resize=()=>{const r=c.getBoundingClientRect(),cap=Math.min(r.width,r.height)<520?1.2:1.45,d=Math.min(cap,Math.max(1,globalThis.devicePixelRatio||1)),w=Math.max(1,Math.round(r.width*d)),h=Math.max(1,Math.round(r.height*d));if(c.width!==w||c.height!==h){c.width=w;c.height=h}gl.viewport(0,0,w,h);return w/Math.max(1,h)};
  const draw=now=>{const asp=resize(),dt=Math.min(40,Math.max(0,now-last));last=now;const e=1-Math.exp(-dt/130);yaw+=(targetYaw-yaw)*e;pitch+=(targetPitch-pitch)*e;const scale=asp<0.72?0.69:asp<1.0?0.86:asp<1.35?1.05:1.22;gl.useProgram(R.p);gl.clearColor(0.010,0.018,0.032,0.72);gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);gl.uniform1f(R.u.yaw,yaw);gl.uniform1f(R.u.pitch,pitch);gl.uniform1f(R.u.scale,scale);gl.uniform1f(R.u.aspect,asp);gl.uniform1f(R.u.camera,4.75);gl.drawElements(gl.TRIANGLES,R.count,gl.UNSIGNED_SHORT,0);host.dataset.lifecycleStatus='ready';host.dataset.gen2330Checkpoint='STATIC_VISUAL_ARCHITECTURE_PROOF';host.dataset.communityDomainModel='FOUR_PERMANENT_DOMAINS_TO_SHARED_CENTER';globalThis.DGB_COMMUNITY_LIFECYCLE_3D_RECEIPT=Object.freeze({contract:CONTRACT,qualification:STATIC_RECEIPT,checkpoint:'PHYSICAL_REVIEW_A',trackedMotionEnabled:false,visibleConnectorCount:0});};
  const tick=now=>{raf=0;if(!visible||doc.hidden)return;draw(now);if(Math.abs(targetYaw-yaw)>0.0003||Math.abs(targetPitch-pitch)>0.0003)raf=requestAnimationFrame(tick)};const kick=()=>{if(!raf&&visible&&!doc.hidden)raf=requestAnimationFrame(tick)};const yawLimit=CONTRACT.inspectionYawLimitDegrees*Math.PI/180;
  c.addEventListener('pointerdown',e=>{if(e.button!==0)return;drag={id:e.pointerId,x:e.clientX};c.setPointerCapture?.(e.pointerId)});
  c.addEventListener('pointermove',e=>{const r=c.getBoundingClientRect();if(drag&&e.pointerId===drag.id){const dx=e.clientX-drag.x;targetYaw=-0.07+clamp(dx/Math.max(1,r.width)*0.8,-yawLimit,yawLimit);kick();return}if(e.pointerType==='mouse'&&r.width){targetYaw=-0.07+(((e.clientX-r.left)/r.width)*2-1)*0.045;targetPitch=-0.04-(((e.clientY-r.top)/r.height)*2-1)*0.022;kick();}});
  const release=e=>{if(!drag||e.pointerId!==drag.id)return;drag=null;targetYaw=-0.07;targetPitch=-0.04;kick()};c.addEventListener('pointerup',release);c.addEventListener('pointercancel',release);
  if('IntersectionObserver'in globalThis){const io=new IntersectionObserver(entries=>{visible=entries.some(e=>e.isIntersecting&&e.intersectionRatio>0.02);if(!visible&&raf){cancelAnimationFrame(raf);raf=0}else if(visible){draw(performance.now());kick()}},{rootMargin:'120px 0px',threshold:[0,0.02]});io.observe(host)}
  doc.addEventListener('visibilitychange',()=>{if(!doc.hidden){draw(performance.now());kick()}},{passive:true});
  host.setAttribute('role','img');host.setAttribute('aria-label','Four distinct permanent seasonal environments surround an open shared center. Each environment has its own inward-facing portal, while a smaller central tree waits as the common destination. No connector lines or moving lifecycle cohort are present in this static architecture proof.');draw(performance.now());
}

export { CONTRACT as DGB_COMMUNITY_LIFECYCLE_3D_CONTRACT };
