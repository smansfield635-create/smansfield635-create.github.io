(()=>{
'use strict';
const M=Math,scenes=new WeakMap();let primary=null;
const norm=v=>{const l=M.hypot(...v)||1;return v.map(x=>x/l)};
function shader(gl,type,src){const s=gl.createShader(type);gl.shaderSource(s,src);gl.compileShader(s);if(!gl.getShaderParameter(s,gl.COMPILE_STATUS))throw Error(gl.getShaderInfoLog(s)||'shader');return s}
function program(gl){
  const vs=`attribute vec3 p,n,c;uniform float aspect;varying vec3 N,P,C;void main(){float yaw=-.22,cy=cos(yaw),sy=sin(yaw),cp=.975,sp=.22;vec3 q=vec3(cy*p.x+sy*p.z,p.y,-sy*p.x+cy*p.z);q=vec3(q.x,cp*q.y-sp*q.z,sp*q.y+cp*q.z);vec3 nn=vec3(cy*n.x+sy*n.z,n.y,-sy*n.x+cy*n.z);N=normalize(vec3(nn.x,cp*nn.y-sp*nn.z,sp*nn.y+cp*nn.z));P=q;C=c;float w=1.38+q.z*.18;gl_Position=vec4(q.x*.76/max(aspect,.72),q.y*.73-.08,q.z*.12,w);}`;
  const fs=`precision mediump float;varying vec3 N,P,C;void main(){vec3 n=normalize(N),key=normalize(vec3(-.58,.78,.38)),fill=normalize(vec3(.62,.12,.76)),view=normalize(vec3(0.,.18,2.)-P);float kd=max(dot(n,key),0.),fd=max(dot(n,fill),0.),rim=pow(1.-max(dot(n,view),0.),2.35),spec=pow(max(dot(reflect(-key,n),view),0.),36.);vec3 col=C*(.20+.72*kd+.16*fd)+vec3(.98,.76,.38)*spec*.24+vec3(.22,.74,.86)*rim*.15;gl_FragColor=vec4(col,1.);}`;
  const q=gl.createProgram();gl.attachShader(q,shader(gl,gl.VERTEX_SHADER,vs));gl.attachShader(q,shader(gl,gl.FRAGMENT_SHADER,fs));gl.linkProgram(q);if(!gl.getProgramParameter(q,gl.LINK_STATUS))throw Error(gl.getProgramInfoLog(q)||'link');return q
}
function mesh(gl){
  const p=[],n=[],c=[],idx=[],parts=[];const stone=[.11,.25,.30],stone2=[.08,.18,.23],bronze=[.44,.29,.12],gold=[.68,.48,.18],glass=[.12,.56,.67],glassLit=[.30,.82,.92],dark=[.055,.075,.085],step=[.16,.18,.18];
  const V=(a,b,col)=>{const q=p.length/3;p.push(...a);n.push(...b);c.push(...col);return q},T=(a,b,d)=>idx.push(a,b,d);
  function quad(name,a,b,d,e,col){const nn=norm([(b[1]-a[1])*(d[2]-a[2])-(b[2]-a[2])*(d[1]-a[1]),(b[2]-a[2])*(d[0]-a[0])-(b[0]-a[0])*(d[2]-a[2]),(b[0]-a[0])*(d[1]-a[1])-(b[1]-a[1])*(d[0]-a[0])]);const s=idx.length,A=V(a,nn,col),B=V(b,nn,col),D=V(d,nn,col),E=V(e,nn,col);T(A,B,D);T(A,D,E);parts.push({name,triangles:(idx.length-s)/3})}
  function box(name,x0,x1,y0,y1,z0,z1,col){quad(name+'-front',[x0,y0,z1],[x1,y0,z1],[x1,y1,z1],[x0,y1,z1],col);quad(name+'-back',[x1,y0,z0],[x0,y0,z0],[x0,y1,z0],[x1,y1,z0],col.map(v=>v*.58));quad(name+'-left',[x0,y0,z0],[x0,y0,z1],[x0,y1,z1],[x0,y1,z0],col.map(v=>v*.72));quad(name+'-right',[x1,y0,z1],[x1,y0,z0],[x1,y1,z0],[x1,y1,z1],col.map(v=>v*.84));quad(name+'-top',[x0,y1,z1],[x1,y1,z1],[x1,y1,z0],[x0,y1,z0],col.map(v=>M.min(1,v*1.12)))}
  box('foundation',-.86,.86,-.60,-.48,-.48,.48,step);box('main-body',-.73,.73,-.48,.31,-.38,.38,stone);box('front-projecting-bay',-.29,.29,-.45,.19,.37,.54,stone2);
  box('porch-deck',-.49,.49,-.52,-.43,.54,.79,step);box('step-1',-.38,.38,-.61,-.54,.64,.88,step);box('step-2',-.30,.30,-.68,-.61,.72,.94,step);
  box('left-column',-.43,-.37,-.43,.27,.61,.67,bronze);box('right-column',.37,.43,-.43,.27,.61,.67,bronze);box('porch-beam',-.47,.47,.24,.31,.59,.69,bronze);
  quad('roof-front-left',[-.88,.28,.50],[0,.28,.50],[0,.90,.08],[-.02,.90,.08],bronze);quad('roof-front-right',[0,.28,.50],[.88,.28,.50],[.02,.90,.08],[0,.90,.08],bronze.map(v=>v*1.12));quad('roof-back-left',[0,.28,-.50],[-.88,.28,-.50],[-.02,.90,-.08],[0,.90,-.08],bronze.map(v=>v*.68));quad('roof-back-right',[.88,.28,-.50],[0,.28,-.50],[0,.90,-.08],[.02,.90,-.08],bronze.map(v=>v*.82));
  box('roof-eave-front',-.92,.92,.25,.31,.47,.55,dark);box('roof-eave-back',-.92,.92,.25,.31,-.55,-.47,dark);
  box('door-recess',-.15,.15,-.45,.06,.535,.565,dark);box('door-frame-left',-.21,-.15,-.47,.10,.535,.575,gold);box('door-frame-right',.15,.21,-.47,.10,.535,.575,gold);box('door-frame-top',-.21,.21,.06,.13,.535,.575,gold);box('door-panel',-.13,.13,-.44,.04,.566,.59,stone2);
  const win=(name,x0,x1)=>{box(name+'-recess',x0,x1,-.22,.09,.385,.415,dark);box(name+'-glass',x0+.018,x1-.018,-.20,.07,.416,.438,glassLit);box(name+'-frame-left',x0-.025,x0+.012,-.24,.11,.432,.45,gold);box(name+'-frame-right',x1-.012,x1+.025,-.24,.11,.432,.45,gold);box(name+'-frame-top',x0-.025,x1+.025,.075,.12,.432,.45,gold);box(name+'-frame-bottom',x0-.025,x1+.025,-.25,-.205,.432,.45,gold);const mid=(x0+x1)/2;box(name+'-mullion-v',mid-.012,mid+.012,-.20,.07,.438,.455,gold);box(name+'-mullion-h',x0+.018,x1-.018,-.078,-.052,.438,.455,gold)};
  win('window-left',-.61,-.34);win('window-right',.34,.61);
  box('chimney',.38,.54,.41,.82,-.20,-.04,bronze);box('chimney-cap',.34,.58,.79,.86,-.24,0,step);
  box('ridge-cap',-.055,.055,.83,.93,-.10,.10,gold);box('plinth-shadow',-.60,.60,-.74,-.69,-.40,.72,dark);
  const B=(target,data)=>{const b=gl.createBuffer();gl.bindBuffer(target,b);gl.bufferData(target,data,gl.STATIC_DRAW);return b};return{p:B(gl.ARRAY_BUFFER,new Float32Array(p)),n:B(gl.ARRAY_BUFFER,new Float32Array(n)),c:B(gl.ARRAY_BUFFER,new Float32Array(c)),i:B(gl.ELEMENT_ARRAY_BUFFER,new Uint16Array(idx)),count:idx.length,triangles:idx.length/3,parts}
}
function mount(canvas,{foreground=()=>true}={}){
  if(!canvas||scenes.has(canvas))return scenes.get(canvas);let gl;try{gl=canvas.getContext('webgl',{alpha:true,antialias:true,powerPreference:'low-power',preserveDrawingBuffer:true})}catch{}
  if(!gl){canvas.dataset.houseRenderer='fallback-unavailable';const api={fallback:true,inspect:()=>({fallback:true})};scenes.set(canvas,api);primary=api;return api}
  const pr=program(gl),m=mesh(gl),L={p:gl.getAttribLocation(pr,'p'),n:gl.getAttribLocation(pr,'n'),c:gl.getAttribLocation(pr,'c'),aspect:gl.getUniformLocation(pr,'aspect')};Object.assign(canvas.dataset,{houseContract:'DGB_COMPASS_ARCHITECTURAL_HOUSE_3D_v2',houseRenderer:'procedural-webgl-v2',houseGeometry:'foundation,main-body,projecting-bay,pitched-roof,eaves,porch,columns,steps,recessed-door,framed-windows,mullions,chimney,ridge-cap',houseMaterial:'smoked-stone-aged-bronze-cyan-glass',houseTriangleCount:String(m.triangles),houseMotion:'static-exhibit'});
  const resize=()=>{const d=M.min(devicePixelRatio||1,2),r=canvas.getBoundingClientRect(),w=M.max(2,M.round(r.width*d)),h=M.max(2,M.round(r.height*d));if(w!==canvas.width||h!==canvas.height){canvas.width=w;canvas.height=h;gl.viewport(0,0,w,h)}};const bind=(b,l)=>{gl.bindBuffer(gl.ARRAY_BUFFER,b);gl.enableVertexAttribArray(l);gl.vertexAttribPointer(l,3,gl.FLOAT,false,0,0)};
  function draw(){resize();gl.clearColor(0,0,0,0);gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);gl.enable(gl.DEPTH_TEST);gl.disable(gl.CULL_FACE);gl.useProgram(pr);gl.uniform1f(L.aspect,canvas.width/M.max(1,canvas.height));bind(m.p,L.p);bind(m.n,L.n);bind(m.c,L.c);gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,m.i);gl.drawElements(gl.TRIANGLES,m.count,gl.UNSIGNED_SHORT,0);canvas.dataset.houseFrames='1'}draw();new ResizeObserver(draw).observe(canvas);
  const api={fallback:false,setForeground:on=>{if(on)draw()},inspect:()=>({fallback:false,frames:1,triangles:m.triangles,parts:m.parts,foreground:foreground(),motion:'static-exhibit',material:'smoked-stone-aged-bronze-cyan-glass'})};scenes.set(canvas,api);primary=api;return api
}
window.CompassHouseScene=Object.freeze({version:'procedural-webgl-house-v2',mount,setForeground:on=>primary?.setForeground?.(on),inspect:()=>primary?.inspect?.()||null});
})();
