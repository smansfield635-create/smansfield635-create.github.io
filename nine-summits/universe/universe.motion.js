/* Universe first slice. Geometry: H-Earth kernel; motion: unchanged Compass physics.
 * Heart contour and dome proportions: nine-summits-of-love/index.html at 171a74bc.
 * Planet lighting is a visual metaphor; no physical simulation claims. */
const summits = [
  ['Gratitude','Joy','#d5aa66'],['Generosity','Love','#cb7584'],['Dependability','Stability','#749cab'],
  ['Accountability','Character','#b88360'],['Forgiveness','Peace','#a3b8aa'],['Self-Control','Balance','#8e8ead'],
  ['Patience','Structure','#9caa7d'],['Humility','Dignity','#ba9cae'],['Purity','Free Will','#b8c9d2']
];
// Teaching text follows the nine relationships on the book page; examples invite reflection.
const teachings = [
  {
    "title": "Joy begins with noticing.",
    "intro": "Gratitude makes room for joy in what is already here.",
    "teaching": "Joy does not begin with having everything. It begins with recognizing what is already alive, valuable, and worth receiving.",
    "choice": "After a difficult day, fear can narrow your attention to what is missing. Choosing love can begin with noticing one kindness without pretending the difficulty has disappeared.",
    "question": "What is worth appreciating in your life today?"
  },
  {
    "title": "Love becomes something we give.",
    "intro": "Generosity gives love a visible expression.",
    "teaching": "Love becomes visible when value moves outward without destroying the person giving it.",
    "choice": "Someone needs your help. You can offer time, attention, or support honestly, without promising more than you can give. A loving yes can live alongside a necessary boundary.",
    "question": "What can you offer someone today without neglecting yourself?"
  },
  {
    "title": "Trust grows through showing up.",
    "intro": "Dependability gives love something steady to stand on.",
    "teaching": "Stability is not a feeling. It is trustworthy action repeated long enough for others—and your future self—to stand on it.",
    "choice": "When keeping a promise becomes inconvenient, return to why you made it. Follow through, or speak honestly and make a new agreement. Conviction takes shape in what you do again tomorrow.",
    "question": "What promise can you honor today?"
  },
  {
    "title": "Our choices ask something of us.",
    "intro": "Accountability turns intention into responsibility.",
    "teaching": "Character begins when we stop asking only what we intended and become willing to answer for what our choices produced.",
    "choice": "When your words hurt someone, fear may urge you to defend your intentions. Choosing love means listening to the impact, owning your part, and taking a concrete step toward repair.",
    "question": "What can you take responsibility for and begin to repair?"
  },
  {
    "title": "Peace leaves room for truth.",
    "intro": "Forgiveness releases the fight without erasing what happened.",
    "teaching": "Forgiveness does not erase truth. It ends the unnecessary war so truth, boundaries, and repair can occupy the same room.",
    "choice": "You can choose to stop feeding resentment while keeping an honest boundary. Forgiveness does not require pretending trust has already been restored.",
    "question": "What would peace look like while keeping an honest boundary?"
  },
  {
    "title": "Feel deeply. Choose deliberately.",
    "intro": "Self-control creates room between an impulse and a response.",
    "teaching": "Balance is not the absence of emotion. It is the ability to feel deeply without surrendering authority over what happens next.",
    "choice": "In a tense conversation, pause before sending the message or raising your voice. You can acknowledge anger and still choose words that protect dignity—yours and theirs.",
    "question": "What response would express your convictions rather than your first impulse?"
  },
  {
    "title": "Give strong things time to form.",
    "intro": "Patience supports what cannot be built in a moment.",
    "teaching": "Anything built too quickly can collapse under the weight it was meant to carry. Patience gives strong things time to form.",
    "choice": "When progress feels slow, fear can push you to force an outcome. Choosing love may mean continuing the small, necessary work and allowing growth its own time.",
    "question": "What deserves your steady care instead of being rushed?"
  },
  {
    "title": "Honesty makes room for dignity.",
    "intro": "Humility lets us learn without denying our worth.",
    "teaching": "Humility is not becoming smaller. It is seeing yourself in honest proportion—without self-erasure or artificial superiority.",
    "choice": "When someone offers a perspective you have missed, you can listen without treating it as a threat to your worth. Admitting you do not know creates room to learn together.",
    "question": "Where can you acknowledge a limitation without denying your worth?"
  },
  {
    "title": "Make room for a freer choice.",
    "intro": "Purity asks what is influencing the choice we call our own.",
    "teaching": "A choice is not fully free when fear, coercion, resentment, or appetite is making it for us. Purity clears the field.",
    "choice": "Before a consequential decision, notice what is pressing you: approval, resentment, or an immediate urge. Make space to choose from love rather than simply obeying that pressure.",
    "question": "What would you choose if fear were not deciding for you?"
  }
];
const scene=document.querySelector('#universe-scene'), canvas=document.querySelector('#universe-canvas');
const panel=document.querySelector('#reflection'), status=document.querySelector('#status');
const approach=document.querySelector('#approach'), returnButton=document.querySelector('#return-view');
const media=matchMedia('(prefers-reduced-motion: reduce)');
let P, gl, program, meshes=[], labels=[], labelSizes=[], centers=[], projected=[], selected=-1, close=false;
let quaternion=[0,0,0,1], pointer=null, inertia=null, suppressUntil=0, raf=0, lastTime=0;
let width=1,height=1, viewWidth=3, viewHeight=3, zoom=1,targetZoom=1, offset=[0,0,0],targetOffset=[0,0,0];
// Ambient traversal uses the Compass delta-time clock and its slow 0.08 rad/s cadence.
// Gesture quaternions and release physics remain owned by the shared Compass module.
const ORBIT_RADIANS_PER_SECOND=.08;
let orbitPhase=0, orbitSpeed=0, motionPaused=false, sceneVisible=true, windowFocused=true, pageActive=true;
let ready=false, reduced=media.matches, receipt={status:'loading'}, disposed=false;
const $=s=>document.querySelector(s);
const color=hex=>[1,3,5].map(i=>parseInt(hex.slice(i,i+2),16)/255);
function requestFrame(){if(!raf && ready && !disposed && !document.hidden && sceneVisible && pageActive)raf=requestAnimationFrame(render);}
function orbitCanMove(){return !reduced&&!motionPaused&&!pointer&&!inertia&&selected<0&&sceneVisible&&windowFocused&&pageActive&&!document.hidden;}
function updateMotionControl(){const button=$('#toggle-motion');button.disabled=reduced||!ready;button.textContent=reduced?'Reduced motion':motionPaused?'Resume motion':'Pause motion';button.setAttribute('aria-pressed',String(motionPaused));}
$('#toggle-motion').addEventListener('click',()=>{motionPaused=!motionPaused;orbitSpeed=0;lastTime=0;updateMotionControl();requestFrame();});
function stopInertia(){if(inertia){quaternion=P.constellationReleaseQuaternionAt(inertia,Math.min(inertia.durationMs,performance.now()-inertia.startedAt));inertia=null;}}
function choose(index,scroll=true){
  if(pointer?.dragging || performance.now()<suppressUntil)return;
  stopInertia();$('#scene-note').textContent='Drag to turn the universe · Choose a planet to explore'; selected=index; close=false; targetZoom=1;targetOffset=[0,0,0];panel.style.setProperty('--world-accent',summits[index][2]);scene.style.setProperty('--world-accent',summits[index][2]);
  const [begin,summit]=summits[index], teaching=teachings[index];
  $('#reflection-path').textContent=`Summit ${index+1} of 9 · ${begin} → ${summit}`;
  $('#reflection-title').textContent=teaching.title;
  $('#reflection-copy').textContent=teaching.intro;
  $('#teaching-copy').textContent=teaching.teaching;
  $('#teaching-choice').textContent=teaching.choice;
  $('#reflection-question').textContent=teaching.question;
  $('#summit-teaching').hidden=true;
  panel.hidden=false;returnButton.hidden=false;approach.hidden=false;approach.disabled=false;approach.textContent='Look closer';
  approach.setAttribute('aria-expanded','false');
  labels.forEach((el,i)=>el.setAttribute('aria-pressed',String(i===index)));
  status.textContent=`${begin} leads to ${summit}.`;
  requestFrame();
  if(scroll){panel.scrollIntoView({behavior:reduced?'instant':'smooth',block:'nearest'});panel.focus({preventScroll:true});}
}
function returnToAll(){
  stopInertia();$('#scene-note').textContent='Drag to turn the universe · Choose a planet to explore'; const prior=selected; selected=-1;close=false;targetZoom=1;targetOffset=[0,0,0];panel.style.removeProperty('--world-accent');scene.style.removeProperty('--world-accent');
  panel.hidden=true;returnButton.hidden=true;status.textContent='All nine summits. One path. Your orientation is preserved.';
  $('#summit-teaching').hidden=true;approach.setAttribute('aria-expanded','false');
  labels.forEach(el=>el.setAttribute('aria-pressed','false'));requestFrame();
  if(prior>=0){const target=ready?labels[prior]:$(`[data-summit="${prior}"]`);target?.focus({preventScroll:true});scene.scrollIntoView({behavior:reduced?'instant':'smooth',block:'center'});}
}
document.querySelectorAll('[data-summit]').forEach(el=>el.addEventListener('click',()=>choose(Number(el.dataset.summit))));
returnButton.addEventListener('click',returnToAll);
$('#return-from-teaching').addEventListener('click',returnToAll);
approach.addEventListener('click',()=>{
  if(selected<0)return;stopInertia();close=true;
  if(ready){targetOffset=centers[selected].map(value=>value*(width<600?.12:.20));targetZoom=width<600?1.08:1.27;requestFrame();}
  approach.disabled=true;approach.textContent='Exploring this summit';approach.setAttribute('aria-expanded','true');
  $('#scene-note').textContent=`${summits[selected][0]} → ${summits[selected][1]} · Return to all nine to keep exploring`;
  const teaching=$('#summit-teaching');teaching.hidden=false;
  status.textContent=`${summits[selected][1]} teaching opened.`;
  const openedIndex=selected;const reveal=()=>{if(selected!==openedIndex||teaching.hidden)return;teaching.scrollIntoView({behavior:reduced?'instant':'smooth',block:'start'});teaching.focus({preventScroll:true});};if(reduced)reveal();else setTimeout(reveal,520);
});
$('#reset-view').addEventListener('click',()=>{if(!ready)return;cancelPointer();stopInertia();quaternion=[0,0,0,1];returnToAll();});
document.addEventListener('keydown',event=>{if(event.key==='Escape'&&selected>=0){returnToAll();event.preventDefault();}});

function heartDescriptor(K){
  // The book's eight cubic segments, unchanged. Scale and sampling adapt the mesh to this scene.
  const segments=[[[500,865],[444,805],[350,734],[255,645]],[[255,645],[153,550],[94,440],[100,330]],[[100,330],[106,215],[166,119],[270,101]],[[270,101],[361,85],[433,133],[500,238]],[[500,238],[567,133],[639,85],[730,101]],[[730,101],[834,119],[894,215],[900,330]],[[900,330],[906,440],[847,550],[745,645]],[[745,645],[650,734],[556,805],[500,865]]];
  const count=48, contour=[];
  for(let i=0;i<count;i++){
    const progress=i/count*8, s=segments[Math.floor(progress)], t=progress%1, u=1-t;
    const xy=[0,1].map(k=>u*u*u*s[0][k]+3*u*u*t*s[1][k]+3*u*t*t*s[2][k]+t*t*t*s[3][k]);
    contour.push([(xy[0]-500)*1.35/800,-(xy[1]-475)*1.35/800]);
  }
  let area=0;contour.forEach((v,i)=>{const n=contour[(i+1)%count];area+=v[0]*n[1]-n[0]*v[1];});if(area<0)contour.reverse();
  const vertices=[],indices=[],rings=[1,.786,.486,.236,.09], focusY=18*1.35/377;
  const v=(x,y,z)=>K.createHEarthVector3(x,y,z);
  for(const side of [1,-1])for(const scale of rings){
    const z=side*(13+31.5*Math.pow(Math.max(0,1-scale*scale),.72))*1.35/377;
    contour.forEach(p=>vertices.push(v(p[0]*scale,focusY+(p[1]-focusY)*scale,z)));
  }
  const frontCenter=vertices.push(v(0,focusY,44.5*1.35/377))-1;
  const rearCenter=vertices.push(v(0,focusY,-44.5*1.35/377))-1;
  const tri=(a,b,c,reverse)=>indices.push(a,reverse?c:b,reverse?b:c);
  for(let side=0;side<2;side++){
    const base=side*rings.length*count;
    for(let r=0;r<rings.length-1;r++)for(let i=0;i<count;i++){
      const n=(i+1)%count,a=base+r*count+i,b=base+r*count+n,c=base+(r+1)*count+i,d=base+(r+1)*count+n;
      tri(a,b,d,side===1);tri(a,d,c,side===1);
    }
    for(let i=0;i<count;i++)tri(base+(rings.length-1)*count+i,base+(rings.length-1)*count+(i+1)%count,side?rearCenter:frontCenter,side===1);
  }
  for(let i=0;i<count;i++){const n=(i+1)%count,b=rings.length*count;tri(i,b+i,b+n,false);tri(i,b+n,n,false);}
  return K.constructHEarthTriangleMesh({primitiveId:'universe-diamond-heart',vertices,indices,expectedClosure:'CLOSED_REQUIRED',semanticRole:'ILLUMINATED_CENTRAL_HEART'});
}
function buildGeometry(K){
  const results=[heartDescriptor(K),...summits.map((p,i)=>K.constructHEarthEllipsoidMesh({primitiveId:`universe-planet-${i}`,center:K.createHEarthVector3(0,0,0),radii:K.createHEarthVector3(1,1,1),longitudeSampleCount:24,latitudeSampleCount:13,semanticRole:`${p[0]}_TO_${p[1]}`}))];
  for(const result of results)if(!result.valid||K.hasHEarthBlockingIssues(result.issues))throw Error('Geometry construction: '+result.issues.map(x=>x.code).join(','));
  const admitted=K.admitHEarthPrimitiveBatch(results.map(x=>x.primitiveRecord),{frameId:'nine-summits-universe-first-slice'});
  if(!admitted.valid||!K.isHEarthAggregateFrameAdmissionRecord(admitted.frame)||K.hasHEarthBlockingIssues(admitted.issues))throw Error('Geometry admission failed');
  receipt={status:'ready',geometryKernel:'/showroom/globe/h-earth/render/geometry-kernel.js',westAdmitted:true,primitiveCount:admitted.frame.primitiveCount,triangleCount:0,physics:'/assets/compass/compass.orbit-physics.js',heartContourSource:'nine-summits-of-love/index.html@171a74bc3f1f170c36079b00407fb569b56992bf'};
  return admitted.frame.primitives.map((primitive,meshIndex)=>{
    const g=primitive.geometry, data=[];
    g.indices.forEach((index,j)=>{const p=g.vertices[index],n=meshIndex===0?g.faceNormals[Math.floor(j/3)]:g.normals[index];data.push(p.x,p.y,p.z,n.x,n.y,n.z);});
    receipt.triangleCount+=g.indices.length/3;
    const buffer=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,buffer);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(data),gl.STATIC_DRAW);
    return {buffer,count:g.indices.length};
  });
}
const vertexSource=`attribute vec3 aPosition;attribute vec3 aNormal;
uniform vec3 uCenter,uOffset;uniform float uRadius,uZoom;uniform vec2 uView;
varying vec3 vWorld,vNormal,vLocal;
void main(){vec3 world=aPosition*uRadius+uCenter;vec3 view=world-uOffset;float perspective=9.0/(9.0-view.z);gl_Position=vec4(view.xy/uView*uZoom*perspective,-view.z/20.0,1.0);vWorld=world;vNormal=aNormal;vLocal=aPosition;}`;
const fragmentSource=`precision mediump float;
varying vec3 vWorld,vNormal,vLocal;
uniform vec3 uColor;
uniform float uHeart,uSelected,uWorld;
float hash3(vec3 p) {
 p=fract(p*.1031);
 p+=dot(p,p.yzx+33.33);
 return fract((p.x+p.y)*p.z);
}
float noise3(vec3 p) {
 vec3 i=floor(p), f=fract(p);f=f*f*(3.0-2.0*f);
 float a=mix(hash3(i),hash3(i+vec3(1.,0.,0.)),f.x);
 float b=mix(hash3(i+vec3(0.,1.,0.)),hash3(i+vec3(1.,1.,0.)),f.x);
 float c=mix(hash3(i+vec3(0.,0.,1.)),hash3(i+vec3(1.,0.,1.)),f.x);
 float d=mix(hash3(i+vec3(0.,1.,1.)),hash3(i+vec3(1.,1.,1.)),f.x);
 return mix(mix(a,b,f.y),mix(c,d,f.y),f.z);
}
float fbm(vec3 p) {
 float r=0.,amp=.55;
 for(int k=0;k<3;k++){r+=amp*noise3(p);p=p*2.07+vec3(13.4,7.1,19.2);amp*=.5;}
 return r;
}
void main() {
 vec3 n=normalize(vNormal);
 vec3 light=normalize(-vWorld+vec3(-.2,.25,.15));
 float diffuse=max(0.,dot(n,light));
 float rim=pow(1.-max(0.,n.z),2.8);
 float rough=.65, glow=0., grain=0., metal=.05;
 vec3 p=normalize(vLocal);
 vec3 material=uColor;
 if(uHeart>.5) {
   float facet=max(0.,dot(n,normalize(vec3(-.5,.8,1.))));
   float glint=pow(max(0.,dot(n,normalize(vec3(.35,.65,1.)))),14.);
   vec3 ember=vec3(.86,.24,.075), pearl=vec3(1.,.92,.68);
   material=mix(ember,pearl,clamp(.19+facet*.72,0.,1.));
   material+=vec3(.75,.45,.16)*glint*.35;
   rough=.14;glow=.22;metal=.3;
 } else {
   float a=fbm(p*4.4+uWorld*3.11);
   float b=fbm(p*11.3+vec3(4.3,7.7,2.9)*uWorld);
   float c=fbm(p*24.7+vec3(10.1,3.3,5.9)*uWorld);
   if(uWorld<.5) { // Gratitude: amber mineral field and rare inclusions
     float mineral=smoothstep(.40,.76,a*.72+b*.32);
     material=mix(vec3(.30,.14,.055),uColor*1.22,mineral);
     glow=smoothstep(.82,.96,b*.75+c*.33)*.17;rough=.64;
   } else if(uWorld<1.5) { // Generosity: broad rose-violet atmospheric volumes
     float cloud=fbm(p*3.1+vec3(a*.8,b*.6,0.));
     material=mix(uColor*.52,vec3(.83,.45,.70),smoothstep(.3,.8,cloud));
     material+=vec3(.13,.08,.20)*smoothstep(.63,.81,a);rough=.37;
   } else if(uWorld<2.5) { // Dependability: blue-slate tectonic landmasses
     float plate=smoothstep(.42,.57,a+b*.12);
     material=mix(vec3(.09,.18,.23),uColor*1.18,plate);
     material*=.84+.23*b;rough=.84;
   } else if(uWorld<3.5) { // Accountability: fractured copper basalt
     float fault=abs(a-.51)+abs(b-.5)*.24;
     material=mix(vec3(.16,.09,.075),vec3(.79,.40,.22),smoothstep(.10,.35,fault));
     material*=.76+.38*c;rough=.81;metal=.13;
   } else if(uWorld<4.5) { // Forgiveness: sea glass and soft tidal layers
     float tidal=smoothstep(.29,.72,a*.75+b*.28);
     material=mix(vec3(.10,.32,.34),vec3(.69,.84,.73),tidal);
     rough=.3;glow=.045;
   } else if(uWorld<5.5) { // Self-control: disciplined blue-violet polar facets
     vec3 tile=floor(p*8.5+vec3(a*.8));
     grain=hash3(tile);
     material=mix(vec3(.14,.14,.30),uColor*1.32,grain*.70+a*.22);
     metal=.24;rough=.32;
   } else if(uWorld<6.5) { // Patience: organic old-growth geography
     float growth=fbm(p*2.5+vec3(b*.38,a*.24,0.));
     material=mix(vec3(.14,.21,.10),vec3(.60,.69,.34),smoothstep(.29,.75,growth));
     material*=.85+.27*c;rough=.79;
   } else if(uWorld<7.5) { // Humility: quiet, eroded rose-stone
     float weather=smoothstep(.27,.75,a*.60+b*.36);
     material=mix(vec3(.23,.16,.23),vec3(.73,.56,.62),weather);
     rough=.9;
   } else { // Purity: luminous opaline ice/mineral mosaic
     vec3 crystal=floor(p*10.2+vec3(a*.35));
     float facets=hash3(crystal);
     material=mix(vec3(.44,.58,.66),vec3(.90,.97,1.),clamp(facets*.63+a*.46,0.,1.));
     metal=.24;rough=.24;glow=.075;
   }
 }
 float halfLambert=.22+.83*diffuse;
 float spec=pow(max(0.,dot(reflect(-light,n),vec3(0.,0.,1.))),mix(8.,44.,1.-rough));
 vec3 shaded=material*halfLambert;
 shaded+=mix(vec3(.22,.14,.08),vec3(.91,.86,.77),metal)*spec*(.08+.42*(1.-rough));
 shaded+=material*rim*(.17+glow);
 shaded+=material*glow;
 if(uSelected>.5)shaded+=material*.14+vec3(.07,.07,.05);
 gl_FragColor=vec4(shaded,1.);
}`;
function shader(type,source){const s=gl.createShader(type);gl.shaderSource(s,source);gl.compileShader(s);if(!gl.getShaderParameter(s,gl.COMPILE_STATUS))throw Error(gl.getShaderInfoLog(s));return s;}
let loc={};
function setupGL(){
  gl=canvas.getContext('webgl',{alpha:true,antialias:true,powerPreference:'low-power'});if(!gl)throw Error('WebGL unavailable');
  program=gl.createProgram();const vs=shader(gl.VERTEX_SHADER,vertexSource),fs=shader(gl.FRAGMENT_SHADER,fragmentSource);gl.attachShader(program,vs);gl.attachShader(program,fs);gl.linkProgram(program);gl.deleteShader(vs);gl.deleteShader(fs);if(!gl.getProgramParameter(program,gl.LINK_STATUS))throw Error(gl.getProgramInfoLog(program));gl.useProgram(program);
  for(const name of ['aPosition','aNormal'])loc[name]=gl.getAttribLocation(program,name);
  for(const name of ['uCenter','uOffset','uRadius','uZoom','uView','uColor','uHeart','uSelected','uWorld'])loc[name]=gl.getUniformLocation(program,name);
  gl.enable(gl.DEPTH_TEST);gl.clearColor(0,0,0,0);
}
function basePosition(i){const a=Math.PI/2-i*Math.PI*2/9+orbitPhase;return [Math.cos(a)*(width<600?2.02:2.75),Math.sin(a)*(width<600?2.55:1.7),Math.sin(a*2)*.45];}
function project(center){const s=9/(9-center[2]+offset[2]);return {x:width/2+(center[0]-offset[0])/viewWidth*zoom*s*width/2,y:height/2-(center[1]-offset[1])/viewHeight*zoom*s*height/2,scale:s*zoom*width/(2*viewWidth)};}
function radius(i){return [.28,.3,.29,.26,.28,.27,.3,.25,.27][i];}
function draw(mesh,center,r,c,isHeart,isSelected,worldIndex=-1){
  gl.bindBuffer(gl.ARRAY_BUFFER,mesh.buffer);gl.vertexAttribPointer(loc.aPosition,3,gl.FLOAT,false,24,0);gl.vertexAttribPointer(loc.aNormal,3,gl.FLOAT,false,24,12);gl.enableVertexAttribArray(loc.aPosition);gl.enableVertexAttribArray(loc.aNormal);
  gl.uniform3fv(loc.uCenter,center);gl.uniform1f(loc.uRadius,r);gl.uniform3fv(loc.uColor,c);gl.uniform1f(loc.uHeart,isHeart?1:0);gl.uniform1f(loc.uSelected,isSelected?1:0);gl.uniform1f(loc.uWorld,worldIndex);gl.drawArrays(gl.TRIANGLES,0,mesh.count);
}

function placeLabels(){
  const items=projected.map((p,i)=>{
    if(p.hidden)return null;
    const size=labelSizes[i]||{width:94,height:43};
    const side=(centers[i][0]>=0)?1:-1;
    return {i,x:Math.max(size.width/2+7,Math.min(width-size.width/2-7,p.x)),
      y:Math.max(size.height/2+7,Math.min(height-size.height/2-7,p.y+radius(i)*p.scale+10)),
      desiredY:p.y+radius(i)*p.scale+10,
      w:size.width,h:size.height,side};
  });
  for(let pass=0;pass<10;pass++){
    let moved=false;
    for(let i=0;i<items.length;i++)for(let j=i+1;j<items.length;j++){
      const a=items[i],b=items[j];if(!a||!b)continue;
      const ox=(a.w+b.w)/2+8-Math.abs(a.x-b.x);
      const oy=(a.h+b.h)/2+6-Math.abs(a.y-b.y);
      if(ox<=0||oy<=0)continue;
      const direction=a.y===b.y?(a.i<b.i?-1:1):Math.sign(a.y-b.y);
      const shift=Math.min(15,oy/2+1);
      a.y+=direction*shift;b.y-=direction*shift;
      a.x-=a.side*Math.min(3,ox*.06);b.x+=b.side*Math.min(3,ox*.06);
      moved=true;
    }
    for(const item of items){if(!item)continue;
      item.x=Math.max(item.w/2+7,Math.min(width-item.w/2-7,item.x));
      item.y=Math.max(item.h/2+7,Math.min(height-item.h/2-7,item.y));
    }
    if(!moved)break;
  }
  items.forEach((item,i)=>{
    if(!item)return;
    labels[i].style.transform="translate("+item.x.toFixed(2)+"px,"+item.y.toFixed(2)+"px) translate(-50%,-50%)";
  });
}

function render(time){
  raf=0;if(!ready||disposed)return;const dt=lastTime?Math.min(.05,(time-lastTime)/1000):1/60;lastTime=time;
  if(inertia){const elapsed=Math.min(inertia.durationMs,time-inertia.startedAt);quaternion=P.constellationReleaseQuaternionAt(inertia,elapsed);if(elapsed>=inertia.durationMs)inertia=null;}
  const orbitActive=orbitCanMove();
  if(orbitActive){orbitSpeed+=(ORBIT_RADIANS_PER_SECOND-orbitSpeed)*(1-Math.exp(-P.GESTURE.settleSpeed*dt));orbitPhase=(orbitPhase+orbitSpeed*dt)%(Math.PI*2);}else orbitSpeed=0;
  const settle=reduced?1:1-Math.exp(-P.GESTURE.settleSpeed*dt);
  zoom+=(targetZoom-zoom)*settle;offset=offset.map((v,i)=>v+(targetOffset[i]-v)*settle);
  const moving=Math.abs(zoom-targetZoom)>.0001||offset.some((v,i)=>Math.abs(v-targetOffset[i])>.0001);
  if(!moving){zoom=targetZoom;offset=targetOffset.slice();}
  gl.viewport(0,0,canvas.width,canvas.height);gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);gl.useProgram(program);
  gl.uniform2f(loc.uView,viewWidth,viewHeight);gl.uniform3fv(loc.uOffset,offset);gl.uniform1f(loc.uZoom,zoom);
  centers=summits.map((_,i)=>P.quaternionRotateVector(quaternion,basePosition(i)));
  draw(meshes[0],[0,0,0],1,[1,.7,.3],true,false);
  projected=centers.map((center,i)=>{
    draw(meshes[i+1],center,radius(i),color(summits[i][2]),false,i===selected,i);
    const p=project(center),label=labels[i];
    const obscured=center[2]<-.1&&Math.hypot(center[0],center[1])<.75;
    const hidden=close&&i!==selected||obscured;
    label.style.visibility=hidden?'hidden':'visible';label.tabIndex=hidden?-1:0;
    label.style.opacity=String(Math.max(.68,Math.min(1,.86+center[2]*.1)));label.style.zIndex=String(Math.round(center[2]*10)+40);
    return {...p,radius:Math.max(22,radius(i)*p.scale),hidden};
  });
  placeLabels();
  const heart=project([0,0,0]), glow=$('.heart-glow');glow.style.left=heart.x+'px';glow.style.top=heart.y+'px';glow.style.transform=`translate(-50%,-50%) scale(${zoom})`;
  if(inertia||moving||orbitActive)requestFrame();else lastTime=0;
}
function resize(){if(!gl)return;const b=scene.getBoundingClientRect();width=b.width;height=b.height;labelSizes=labels.map(el=>({width:el.offsetWidth||96,height:el.offsetHeight||44}));const dpr=Math.min(devicePixelRatio||1,2);canvas.width=Math.round(width*dpr);canvas.height=Math.round(height*dpr);viewWidth=width<600?2.85:Math.max(3.9,width/height*2.5);viewHeight=viewWidth*height/width;if(close&&selected>=0)targetOffset=P.quaternionRotateVector(quaternion,basePosition(selected));requestFrame();}
function cancelPointer(){if(!pointer)return;const id=pointer.id;quaternion=pointer.startQuaternion.slice();pointer=null;try{if(scene.hasPointerCapture(id))scene.releasePointerCapture(id);}catch{}suppressUntil=performance.now()+P.GESTURE.suppressClickMs;requestFrame();}
function hitTest(x,y){const b=scene.getBoundingClientRect();return projected.map((p,i)=>({...p,i})).filter(p=>!p.hidden&&Math.hypot(x-b.left-p.x,y-b.top-p.y)<=p.radius).sort((a,b)=>centers[b.i][2]-centers[a.i][2])[0]?.i;}
function bindInput(){
  scene.addEventListener('pointerdown',event=>{
    if(!ready||event.button!==0||!event.isPrimary||pointer)return;
    stopInertia();const now=performance.now();pointer={id:event.pointerId,startX:event.clientX,startY:event.clientY,startTime:now,startQuaternion:quaternion.slice(),currentQuaternion:quaternion.slice(),samples:[],dragging:false,hit:event.target.closest('[data-planet]')?Number(event.target.closest('[data-planet]').dataset.planet):hitTest(event.clientX,event.clientY)};
    P.addPointerSample(pointer,event.clientX,event.clientY,now);scene.setPointerCapture(event.pointerId);orbitSpeed=0;requestFrame();
  });
  scene.addEventListener('pointermove',event=>{
    if(!pointer||event.pointerId!==pointer.id)return;P.addPointerSample(pointer,event.clientX,event.clientY,performance.now());
    if(close||!pointer.dragging&&P.pointerDistance(pointer,event.clientX,event.clientY)<P.GESTURE.minimumDragDistancePx)return;
    pointer.dragging=true;event.preventDefault();quaternion=P.dragQuaternionFromPointer(pointer,event.clientX,event.clientY,width,height);pointer.currentQuaternion=quaternion.slice();requestFrame();
  });
  scene.addEventListener('pointerup',event=>{
    if(!pointer||event.pointerId!==pointer.id)return;const p=pointer,now=performance.now(),metrics=P.gestureMetrics(p,event.clientX,event.clientY,now);pointer=null;
    try{if(scene.hasPointerCapture(event.pointerId))scene.releasePointerCapture(event.pointerId);}catch{}
    if(p.dragging){quaternion=p.currentQuaternion.slice();const params=P.releaseParameters(metrics,width,height,reduced);inertia=params?{...params,startedAt:now,releaseQuaternion:quaternion.slice()}:null;suppressUntil=now+P.GESTURE.suppressClickMs;event.preventDefault();requestFrame();}
    else if(metrics.distance<=P.GESTURE.maximumTapDistancePx&&p.hit!==undefined){choose(p.hit);suppressUntil=now+P.GESTURE.suppressClickMs;}
    lastTime=0;requestFrame();
  });
  scene.addEventListener('pointercancel',cancelPointer);scene.addEventListener('lostpointercapture',()=>{if(pointer)cancelPointer();});
  scene.addEventListener('click',event=>{if(performance.now()<suppressUntil){event.preventDefault();event.stopPropagation();}},true);
  window.addEventListener('blur',()=>{windowFocused=false;orbitSpeed=0;lastTime=0;cancelPointer();stopInertia();requestFrame();});
  window.addEventListener('focus',()=>{windowFocused=true;lastTime=0;requestFrame();});
  document.addEventListener('visibilitychange',()=>{if(document.hidden){orbitSpeed=0;lastTime=0;cancelPointer();stopInertia();if(raf)cancelAnimationFrame(raf);raf=0;}else{lastTime=0;requestFrame();}});
  media.addEventListener('change',()=>{reduced=media.matches;orbitSpeed=0;lastTime=0;cancelPointer();stopInertia();updateMotionControl();requestFrame();});
  window.addEventListener('pagehide',()=>{pageActive=false;orbitSpeed=0;lastTime=0;cancelPointer();stopInertia();if(raf)cancelAnimationFrame(raf);raf=0;});
  window.addEventListener('pageshow',()=>{pageActive=true;lastTime=0;requestFrame();});
}
function fallback(error){cancelPointer();stopInertia();if(raf)cancelAnimationFrame(raf);raf=0;$('#planet-labels').hidden=true;canvas.hidden=true;$('.heart-glow').hidden=true;ready=false;updateMotionControl();receipt={...receipt,status:'fallback',error:String(error.message||error)};scene.classList.remove('ready');$('.loading').textContent='The nine summits are available below.';$('#path-list').open=true;status.textContent='Explore the summit teachings below, or continue to the book.';approach.hidden=selected<0;$('#reset-view').disabled=true;console.error('Universe:',error);}
async function init(){
  P=globalThis.DGB_COMPASS_ORBIT_PHYSICS;if(!P)throw Error('Shared Compass physics unavailable');
  const K=await import('../../showroom/globe/h-earth/render/geometry-kernel.js');
  setupGL();meshes=buildGeometry(K);
  summits.forEach(([begin,summit],i)=>{const el=document.createElement('button');el.type='button';el.className='planet-label';el.dataset.planet=i;el.setAttribute('aria-label',`${begin} leads to ${summit}`);el.setAttribute('aria-pressed','false');el.innerHTML=`<strong>${begin}</strong><span>${summit}</span>`;el.addEventListener('click',event=>{if(event.detail===0)choose(i);});$('#planet-labels').append(el);labels.push(el);});
  ready=true;updateMotionControl();scene.classList.add('ready');resize();bindInput();new ResizeObserver(resize).observe(scene);
  new IntersectionObserver(entries=>{sceneVisible=entries[0].isIntersecting;orbitSpeed=0;lastTime=0;if(!sceneVisible&&raf){cancelAnimationFrame(raf);raf=0;}if(sceneVisible)requestFrame();}).observe(scene);
  canvas.addEventListener('webglcontextlost',event=>{event.preventDefault();if(raf)cancelAnimationFrame(raf);raf=0;fallback(Error('Graphics context interrupted'));});
  canvas.addEventListener('webglcontextrestored',()=>location.reload());
  globalThis.DGB_UNIVERSE=Object.freeze({readback:()=>({...receipt,quaternion:quaternion.slice(),selected,close,orbitPhase,orbitSpeed,motionPaused,orbitActive:orbitCanMove(),sceneVisible,reducedMotion:reduced,inertiaActive:Boolean(inertia),pointerActive:Boolean(pointer),zoom,canvasSize:[canvas.width,canvas.height],glError:gl?.getError()})});
}
init().catch(fallback);
