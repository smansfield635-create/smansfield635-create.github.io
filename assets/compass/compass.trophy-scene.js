(()=>{
'use strict';
const M=Math,scenes=new WeakMap();let primary=null;
const norm=v=>{const l=M.hypot(...v)||1;return v.map(x=>x/l)};
function shader(gl,type,src){const s=gl.createShader(type);gl.shaderSource(s,src);gl.compileShader(s);if(!gl.getShaderParameter(s,gl.COMPILE_STATUS))throw Error(gl.getShaderInfoLog(s)||'shader');return s}
function program(gl){
  const vs=`attribute vec3 p,n,c;uniform float aspect;varying vec3 N,P,C;void main(){float yaw=-.18,cy=cos(yaw),sy=sin(yaw),cp=.992,sp=.125;vec3 q=vec3(cy*p.x+sy*p.z,p.y,-sy*p.x+cy*p.z);q=vec3(q.x,cp*q.y-sp*q.z,sp*q.y+cp*q.z);vec3 nn=vec3(cy*n.x+sy*n.z,n.y,-sy*n.x+cy*n.z);N=normalize(vec3(nn.x,cp*nn.y-sp*nn.z,sp*nn.y+cp*nn.z));P=q;C=c;gl_Position=vec4(q.x*1.08/max(aspect,.72),q.y*.95-.04,q.z*.08,1.);}`;
  const fs=`precision mediump float;varying vec3 N,P,C;void main(){vec3 n=normalize(N),key=normalize(vec3(-.52,.84,.36)),fill=normalize(vec3(.60,.18,.78)),view=normalize(vec3(0.,.12,2.)-P);float kd=max(dot(n,key),0.),fd=max(dot(n,fill),0.),nv=max(dot(n,view),0.),rim=pow(1.-nv,2.0),s1=pow(max(dot(reflect(-key,n),view),0.),58.),s2=pow(max(dot(reflect(-fill,n),view),0.),24.);float metal=clamp(dot(C,vec3(.333))*1.25,0.,1.);float age=.5+.5*sin((P.y*7.0+P.x*3.0-P.z*2.0));vec3 warm=vec3(1.,.86,.42),cool=vec3(.48,.72,.88),base=C*(.22+.66*kd+.18*fd);vec3 gold=base+warm*s1*(.46+.34*metal)+cool*rim*(.08+.12*metal)+vec3(.94,.62,.20)*s2*.12;gold*=.96+.04*age;gl_FragColor=vec4(gold,1.);}`;
  const q=gl.createProgram();gl.attachShader(q,shader(gl,gl.VERTEX_SHADER,vs));gl.attachShader(q,shader(gl,gl.FRAGMENT_SHADER,fs));gl.linkProgram(q);if(!gl.getProgramParameter(q,gl.LINK_STATUS))throw Error(gl.getProgramInfoLog(q)||'link');return q
}
function mesh(gl){
  const p=[],n=[],c=[],idx=[],parts=[];
  const gold=[.72,.43,.095],bright=[.98,.73,.24],aged=[.56,.31,.07],bronze=[.42,.22,.055],dark=[.22,.13,.045],black=[.065,.055,.045],plaque=[.63,.39,.11],plaqueEdge=[.88,.61,.19],letter=[.96,.82,.39];
  const V=(a,b,col)=>{const i=p.length/3;p.push(...a);n.push(...b);c.push(...col);return i},T=(a,b,d)=>idx.push(a,b,d);
  function lathe(name,profile,col=gold,seg=48){const start=idx.length,g=[];for(let j=0;j<profile.length;j++){const [r,y]=profile[j],prev=profile[Math.max(0,j-1)],next=profile[Math.min(profile.length-1,j+1)],dr=next[0]-prev[0],dy=next[1]-prev[1];for(let i=0;i<=seg;i++){const t=i/seg*M.PI*2,ct=M.cos(t),st=M.sin(t);g.push(V([r*ct,y,r*st],norm([dy*ct,-dr,dy*st]),col))}}for(let j=0;j<profile.length-1;j++)for(let i=0;i<seg;i++){const a=g[j*(seg+1)+i],b=a+1,d=g[(j+1)*(seg+1)+i],e=d+1;T(a,b,e);T(a,e,d)}parts.push({name,triangles:(idx.length-start)/3})}
  function torusArc(name,cx,cy,major,minor,a0,a1,col=gold,ringSeg=28,tubeSeg=10){const start=idx.length,g=[];for(let j=0;j<=ringSeg;j++){const a=a0+(a1-a0)*j/ringSeg,ca=M.cos(a),sa=M.sin(a);for(let i=0;i<=tubeSeg;i++){const b=i/tubeSeg*M.PI*2,cb=M.cos(b),sb=M.sin(b),rr=major+minor*cb;g.push(V([cx+rr*ca,cy+rr*sa,minor*sb],norm([cb*ca,cb*sa,sb]),col))}}for(let j=0;j<ringSeg;j++)for(let i=0;i<tubeSeg;i++){const a=g[j*(tubeSeg+1)+i],b=a+1,d=g[(j+1)*(tubeSeg+1)+i],e=d+1;T(a,b,e);T(a,e,d)}parts.push({name,triangles:(idx.length-start)/3})}
  function box(name,x0,x1,y0,y1,z0,z1,col){const start=idx.length;const faces=[[[x0,y0,z1],[x1,y0,z1],[x1,y1,z1],[x0,y1,z1],[0,0,1]],[[x1,y0,z0],[x0,y0,z0],[x0,y1,z0],[x1,y1,z0],[0,0,-1]],[[x0,y0,z0],[x0,y0,z1],[x0,y1,z1],[x0,y1,z0],[-1,0,0]],[[x1,y0,z1],[x1,y0,z0],[x1,y1,z0],[x1,y1,z1],[1,0,0]],[[x0,y1,z1],[x1,y1,z1],[x1,y1,z0],[x0,y1,z0],[0,1,0]],[[x0,y0,z0],[x1,y0,z0],[x1,y0,z1],[x0,y0,z1],[0,-1,0]]];for(const f of faces){const q=f.slice(0,4).map(v=>V(v,f[4],col));T(q[0],q[1],q[2]);T(q[0],q[2],q[3])}parts.push({name,triangles:(idx.length-start)/3})}
  function stroke(name,x0,y0,x1,y1,w,z0,z1,col=letter){const start=idx.length,dx=x1-x0,dy=y1-y0,len=M.hypot(dx,dy)||1,px=-dy/len*w*.5,py=dx/len*w*.5;const a=[x0+px,y0+py,z1],b=[x1+px,y1+py,z1],d=[x1-px,y1-py,z1],e=[x0-px,y0-py,z1],aa=[x0+px,y0+py,z0],bb=[x1+px,y1+py,z0],dd=[x1-px,y1-py,z0],ee=[x0-px,y0-py,z0];const q=[V(a,[0,0,1],col),V(b,[0,0,1],col),V(d,[0,0,1],col),V(e,[0,0,1],col),V(aa,[0,0,-1],col),V(bb,[0,0,-1],col),V(dd,[0,0,-1],col),V(ee,[0,0,-1],col)];T(q[0],q[1],q[2]);T(q[0],q[2],q[3]);T(q[4],q[6],q[5]);T(q[4],q[7],q[6]);T(q[0],q[4],q[5]);T(q[0],q[5],q[1]);T(q[1],q[5],q[6]);T(q[1],q[6],q[2]);T(q[2],q[6],q[7]);T(q[2],q[7],q[3]);T(q[3],q[7],q[4]);T(q[3],q[4],q[0]);parts.push({name,triangles:(idx.length-start)/3})}
  const glyph={
    A:[[0,0],[.5,1],[1,0],[.2,.42],[.8,.42]],B:[[0,0],[0,1],[.7,1],[1,.78],[.7,.54],[0,.54],[.7,.54],[1,.28],[.7,0],[0,0]],D:[[0,0],[0,1],[.62,1],[1,.72],[1,.28],[.62,0],[0,0]],E:[[1,1],[0,1],[0,0],[1,0],[0,.5],[.78,.5]],G:[[1,.82],[.78,1],[.28,1],[0,.72],[0,.28],[.28,0],[.82,0],[1,.22],[1,.48],[.58,.48]],I:[[0,1],[1,1],[.5,1],[.5,0],[0,0],[1,0]],M:[[0,0],[0,1],[.5,.48],[1,1],[1,0]],N:[[0,0],[0,1],[1,0],[1,1]],O:[[.25,0],[.02,.25],[.02,.75],[.25,1],[.75,1],[.98,.75],[.98,.25],[.75,0],[.25,0]],R:[[0,0],[0,1],[.7,1],[1,.76],[.72,.5],[0,.5],[.52,.5],[1,0]],T:[[0,1],[1,1],[.5,1],[.5,0]],'?':[[.08,.78],[.25,1],[.72,1],[.92,.8],[.92,.63],[.52,.42],[.52,.22],[.52,.05],[.52,0]]
  };
  function glyphStrokes(ch){const pts=glyph[ch];if(!pts)return[];const out=[];for(let i=0;i<pts.length-1;i++){const a=pts[i],b=pts[i+1];if(a===null||b===null)continue;out.push([a[0],a[1],b[0],b[1]])}return out}
  function textLine(name,text,cx,cy,width,height){const chars=[...text],advance=1.18,units=chars.reduce((s,ch)=>s+(ch===' '?advance*.65:advance),0)-.18,scale=width/units,gh=height,gw=scale;let x=cx-width*.5;for(const ch of chars){if(ch===' '){x+=gw*advance*.65;continue}for(const [x0,y0,x1,y1] of glyphStrokes(ch)){stroke(`${name}-${ch}`,x+x0*gw,cy-gh*.5+y0*gh,x+x1*gw,cy-gh*.5+y1*gh,gw*.14,.336,.351,letter)}x+=gw*advance}}

  lathe('cup-body',[[.095,.13],[.14,.18],[.18,.245],[.245,.315],[.35,.385],[.445,.48],[.515,.60],[.548,.70],[.535,.80],[.495,.88],[.455,.925]],gold,56);
  lathe('cup-shoulder-band',[[.455,.905],[.492,.918],[.515,.938],[.505,.956],[.472,.966]],aged,56);
  lathe('rim-crown',[[.465,.945],[.505,.955],[.535,.976],[.528,1.006],[.488,1.026],[.458,1.017]],bright,56);
  lathe('neck-collar',[[.18,.255],[.16,.225],[.132,.188],[.118,.142]],aged,44);
  lathe('stem',[[.118,.145],[.108,.065],[.104,-.12],[.112,-.225],[.135,-.305]],bright,44);
  lathe('foot-upper',[[.135,-.305],[.18,-.34],[.27,-.385],[.355,-.425],[.382,-.455]],gold,48);
  lathe('foot-lower',[[.382,-.455],[.365,-.485],[.30,-.515],[.215,-.53]],aged,48);

  torusArc('handle-left',-.55,.625,.285,.060,M.PI*.57,M.PI*1.43,gold,34,12);
  torusArc('handle-right',.55,.625,.285,.060,M.PI*1.57,M.PI*2.43,gold,34,12);
  box('handle-left-upper-mount',-.515,-.405,.755,.825,-.070,.070,bright);
  box('handle-left-lower-mount',-.535,-.420,.425,.505,-.070,.070,aged);
  box('handle-right-upper-mount',.405,.515,.755,.825,-.070,.070,bright);
  box('handle-right-lower-mount',.420,.535,.425,.505,-.070,.070,aged);

  box('plinth-crown',-.39,.39,-.585,-.515,-.245,.245,bronze);
  box('plinth-body',-.445,.445,-.69,-.575,-.285,.285,dark);
  box('plinth-foot',-.475,.475,-.735,-.685,-.305,.305,black);
  box('nameplate-mount',-.395,.395,-.692,-.525,.286,.310,black);
  box('nameplate-face',-.375,.375,-.677,-.54,.310,.336,plaque);
  box('nameplate-edge-top',-.385,.385,-.54,-.526,.306,.340,plaqueEdge);
  box('nameplate-edge-bottom',-.385,.385,-.692,-.677,.306,.340,plaqueEdge);
  box('nameplate-edge-left',-.389,-.375,-.677,-.54,.306,.340,plaqueEdge);
  box('nameplate-edge-right',.375,.389,-.677,-.54,.306,.340,plaqueEdge);
  textLine('nameplate-line-1','DIAMOND GATE',0,-.585,.66,.040);
  textLine('nameplate-line-2','BRIDGE ?',0,-.635,.48,.042);

  const B=(target,data)=>{const b=gl.createBuffer();gl.bindBuffer(target,b);gl.bufferData(target,data,gl.STATIC_DRAW);return b};return{p:B(gl.ARRAY_BUFFER,new Float32Array(p)),n:B(gl.ARRAY_BUFFER,new Float32Array(n)),c:B(gl.ARRAY_BUFFER,new Float32Array(c)),i:B(gl.ELEMENT_ARRAY_BUFFER,new Uint16Array(idx)),count:idx.length,triangles:idx.length/3,parts}
}
function mount(canvas,{foreground=()=>true}={}){
  if(!canvas)return null;if(scenes.has(canvas))return scenes.get(canvas);const field=canvas.closest('[data-award-trophy]')||canvas.parentElement,fallback=field?.querySelector('.compass-trophy-fallback');
  let gl;try{gl=canvas.getContext('webgl',{alpha:true,antialias:true,powerPreference:'low-power',preserveDrawingBuffer:true})}catch{}
  if(!gl){canvas.hidden=true;field?.classList.add('is-fallback');if(fallback){fallback.hidden=false;fallback.style.removeProperty('display')}const api=Object.freeze({canvas,fallback:true,activate:()=>false,capture:()=>null,restore:()=>false,inspect:()=>({fallback:true,foreground:foreground(),motion:'static'})});scenes.set(canvas,api);primary=api;return api}
  const pr=program(gl),m=mesh(gl),L={p:gl.getAttribLocation(pr,'p'),n:gl.getAttribLocation(pr,'n'),c:gl.getAttribLocation(pr,'c'),aspect:gl.getUniformLocation(pr,'aspect')};canvas.hidden=false;if(fallback){fallback.hidden=true;fallback.style.setProperty('display','none','important');fallback.setAttribute('aria-hidden','true')}field?.classList.remove('is-fallback','is-trophy-emergency-static');field?.classList.add('is-webgl','is-trophy-premium-static');Object.assign(canvas.dataset,{trophyRenderer:'procedural-webgl-v6-legible-nameplate',trophyGeometry:'qualified-boundary-material-plus-enlarged-mounted-nameplate-lettering',trophyMaterial:'differentiated-aged-polished-gold-bronze-nameplate',trophyTriangleCount:String(m.triangles),trophyMotion:'static-exhibit',trophyNameplate:'visibly-mounted-geometry:DIAMOND GATE BRIDGE ?'});
  const resize=()=>{const d=M.min(devicePixelRatio||1,2),r=canvas.getBoundingClientRect(),w=M.max(2,M.round(r.width*d)),h=M.max(2,M.round(r.height*d));if(w!==canvas.width||h!==canvas.height){canvas.width=w;canvas.height=h;gl.viewport(0,0,w,h)}};const bind=(b,l)=>{gl.bindBuffer(gl.ARRAY_BUFFER,b);gl.enableVertexAttribArray(l);gl.vertexAttribPointer(l,3,gl.FLOAT,false,0,0)};
  const draw=()=>{resize();gl.clearColor(0,0,0,0);gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);gl.enable(gl.DEPTH_TEST);gl.enable(gl.BLEND);gl.blendFunc(gl.SRC_ALPHA,gl.ONE_MINUS_SRC_ALPHA);gl.disable(gl.CULL_FACE);gl.useProgram(pr);gl.uniform1f(L.aspect,canvas.width/M.max(1,canvas.height));bind(m.p,L.p);bind(m.n,L.n);bind(m.c,L.c);gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,m.i);gl.drawElements(gl.TRIANGLES,m.count,gl.UNSIGNED_SHORT,0);canvas.dataset.trophyFrames='1'};draw();new ResizeObserver(draw).observe(canvas);
  const api=Object.freeze({canvas,fallback:false,activate:()=>false,capture:()=>{draw();return{triangles:m.triangles,parts:m.parts}},restore:()=>{draw();return true},inspect:()=>({fallback:false,foreground:foreground(),motion:'static-exhibit',triangles:m.triangles,parts:m.parts,material:'differentiated-aged-polished-gold-bronze-nameplate',nameplate:'visibly-mounted-geometry:DIAMOND GATE BRIDGE ?'})});scenes.set(canvas,api);primary=api;return api
}
window.CompassTrophyScene=Object.freeze({version:'procedural-webgl-trophy-v6-legible-nameplate',mount,activate:()=>false,capture:()=>primary?.capture?.()||null,restore:()=>primary?.restore?.()||false,inspect:()=>primary?.inspect?.()||null});
})();