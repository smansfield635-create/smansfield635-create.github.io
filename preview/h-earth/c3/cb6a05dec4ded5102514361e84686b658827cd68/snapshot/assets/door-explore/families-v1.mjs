/* products-cycle2 */
{
const PRODUCTS_CYCLE_MS = 10000;
const PRODUCTS_PHASES = Object.freeze(['REST','BREATHE','FACET','GLINT','ORBIT','RETURN']);
const clamp=x=>Math.max(0,Math.min(1,x));
const smooth=x=>{x=clamp(x);return x*x*(3-2*x)};
function getProductsCycleState(elapsedMs,reduced=false){
 if(reduced)return Object.freeze({phase:'INSPECTION',breathe:.55,facet:.72,glint:.68,orbit:.35,lift:.35,brightness:.72});
 const t=((elapsedMs%PRODUCTS_CYCLE_MS)+PRODUCTS_CYCLE_MS)%PRODUCTS_CYCLE_MS/PRODUCTS_CYCLE_MS;
 let phase='REST',breathe=0,facet=0,glint=0,orbit=0,lift=0,brightness=.18;
 if(t<.16){phase='REST';breathe=smooth(t/.16)*.28;}
 else if(t<.34){phase='BREATHE';const p=smooth((t-.16)/.18);breathe=.28+.72*p;lift=p;brightness=.18+.34*p;}
 else if(t<.52){phase='FACET';const p=smooth((t-.34)/.18);breathe=1-.18*p;facet=p;lift=1-.2*p;brightness=.52+.18*p;}
 else if(t<.69){phase='GLINT';const p=smooth((t-.52)/.17);facet=1;glint=p;orbit=.18*p;lift=.78;brightness=.7+.25*Math.sin(Math.PI*p);}
 else if(t<.88){phase='ORBIT';const p=smooth((t-.69)/.19);facet=1-.18*p;glint=1-p;orbit=.18+.82*p;lift=.78-.28*p;brightness=.7-.18*p;}
 else {phase='RETURN';const p=smooth((t-.88)/.12);facet=.82*(1-p);orbit=1-p;lift=.5*(1-p);brightness=.52-.34*p;breathe=.35*(1-p);}
 return Object.freeze({phase,breathe:clamp(breathe),facet:clamp(facet),glint:clamp(glint),orbit:clamp(orbit),lift:clamp(lift),brightness:clamp(brightness)});
}


const PRODUCTS_SPECIMEN_ID='DOOR_EXPLORE_PRODUCTS_CYCLE2_V1';
const NS='http://www.w3.org/2000/svg';
function el(tag,attrs={}){const n=document.createElementNS(NS,tag);for(const [k,v] of Object.entries(attrs))n.setAttribute(k,String(v));return n}
function mountProductsCycle2(root){
 if(!(root instanceof Element))return null;if(root.dataset.productsCycleMounted==='true')return root.__productsCycle2||null;
 const variant=root.dataset.productsVariant==='explore'?'explore':'door';
 const svg=el('svg',{viewBox:'0 0 400 260','aria-hidden':'true'});svg.classList.add('products-cycle2-svg');
 const defs=el('defs');const grad=el('linearGradient',{id:`gem-${variant}`,x1:'0',y1:'0',x2:'1',y2:'1'});grad.append(el('stop',{offset:'0%','stop-color':'#dfffee'}),el('stop',{offset:'46%','stop-color':'#57c8a2'}),el('stop',{offset:'100%','stop-color':'#173d42'}));defs.append(grad);svg.append(defs);
 const orbitA=el('ellipse',{cx:200,cy:123,rx:116,ry:42,fill:'none',stroke:'#72e9c4','stroke-opacity':.24,'stroke-width':1.2});
 const orbitB=el('ellipse',{cx:200,cy:123,rx:92,ry:67,fill:'none',stroke:'#8be6ff','stroke-opacity':.19,'stroke-width':1.1,transform:'rotate(54 200 123)'});svg.append(orbitA,orbitB);
 const g=el('g');const pts=['200,50 258,102 235,185 200,213 165,185 142,102','200,50 200,213 165,185 142,102','200,50 258,102 235,185 200,213','142,102 200,122 258,102 200,50','142,102 165,185 200,213 200,122','200,122 200,213 235,185 258,102'];
 pts.forEach((p,i)=>g.append(el('polygon',{points:p,fill:i===0?`url(#gem-${variant})`:i%2?'#164d48':'#2a7062','fill-opacity':i===0?.88:.58,stroke:'#bafbe5','stroke-opacity':.18,'stroke-width':.8})));svg.append(g);
 const glint=el('path',{d:'M145 190 L247 61',stroke:'#ffffff','stroke-width':5,'stroke-linecap':'round','stroke-opacity':0,filter:'none'});svg.append(glint);root.prepend(svg);
 const reduce=matchMedia?.('(prefers-reduced-motion: reduce)')?.matches??false;let raf=0,active=true,start=performance.now();
 function draw(now){const s=getProductsCycleState(now-start,reduce);const scale=1+.025*s.breathe;const rot=(variant==='door'?-4:3)+s.facet*(variant==='door'?10:-12);g.setAttribute('transform',`translate(200 132) translate(0 ${-8*s.lift}) rotate(${rot}) scale(${scale}) translate(-200 -132)`);g.style.filter=`brightness(${.84+.34*s.brightness}) drop-shadow(0 0 ${8+18*s.brightness}px rgba(100,235,192,${.1+.16*s.brightness}))`;orbitA.setAttribute('transform',`rotate(${s.orbit*360} 200 123)`);orbitB.setAttribute('transform',`rotate(${54-s.orbit*360} 200 123)`);glint.setAttribute('stroke-opacity',String(.72*Math.sin(Math.PI*s.glint)));glint.setAttribute('transform',`translate(${(s.glint-.5)*44} 0)`);root.dataset.productsPhase=s.phase;if(active&&!reduce)raf=requestAnimationFrame(draw)}
 const io=typeof IntersectionObserver==='function'?new IntersectionObserver(e=>{active=!!e[0]?.isIntersecting;if(active&&!reduce){cancelAnimationFrame(raf);raf=requestAnimationFrame(draw)}else cancelAnimationFrame(raf)},{threshold:.05}):null;io?.observe(root);if(reduce)draw(performance.now());else raf=requestAnimationFrame(draw);
 const api=Object.freeze({specimenId:PRODUCTS_SPECIMEN_ID,variant,cycleMs:PRODUCTS_CYCLE_MS,reducedMotion:reduce,destroy(){active=false;cancelAnimationFrame(raf);io?.disconnect();svg.remove();root.dataset.productsCycleMounted='false'}});root.dataset.productsCycleMounted='true';root.__productsCycle2=api;return api;
}
function auto(){document.querySelectorAll('[data-products-cycle2]').forEach(mountProductsCycle2)}if(typeof document!=='undefined'){document.readyState==='loading'?document.addEventListener('DOMContentLoaded',auto,{once:true}):auto()}

}

/* instrument-cycle3 */
{
const INSTRUMENT_CYCLE_MS=11000;
const INSTRUMENT_PHASES=Object.freeze(['SIGNAL','GAUGE','MEASURE','RULE','DISPOSITION','RESET']);
const clamp=x=>Math.max(0,Math.min(1,x));const smooth=x=>{x=clamp(x);return x*x*(3-2*x)};
function getInstrumentCycleState(ms,reduced=false){
 if(reduced)return Object.freeze({phase:'DISPOSITION',signal:.82,gauge:.76,measure:.7,rule:.78,disposition:.72,needle:.68,scan:.62});
 const t=((ms%INSTRUMENT_CYCLE_MS)+INSTRUMENT_CYCLE_MS)%INSTRUMENT_CYCLE_MS/INSTRUMENT_CYCLE_MS;let phase='SIGNAL',signal=0,gauge=0,measure=0,rule=0,disposition=0,needle=.18,scan=0;
 if(t<.18){const p=smooth(t/.18);signal=p;needle=.18+.24*p;}
 else if(t<.36){phase='GAUGE';const p=smooth((t-.18)/.18);signal=1;gauge=p;needle=.42+.38*p;scan=.25*p;}
 else if(t<.55){phase='MEASURE';const p=smooth((t-.36)/.19);signal=1;gauge=1;measure=p;needle=.8-.16*p;scan=.25+.55*p;}
 else if(t<.73){phase='RULE';const p=smooth((t-.55)/.18);signal=1;gauge=1;measure=1;rule=p;needle=.64+.08*p;scan=.8+.2*p;}
 else if(t<.9){phase='DISPOSITION';const p=smooth((t-.73)/.17);signal=1;gauge=1;measure=1;rule=1;disposition=p;needle=.72-.05*p;scan=1;}
 else {phase='RESET';const p=smooth((t-.9)/.1);signal=1-p;gauge=1-p;measure=1-p;rule=1-p;disposition=1-p;needle=.67-.49*p;scan=1-p;}
 return Object.freeze({phase,signal:clamp(signal),gauge:clamp(gauge),measure:clamp(measure),rule:clamp(rule),disposition:clamp(disposition),needle:clamp(needle),scan:clamp(scan)});
}


const INSTRUMENT_SPECIMEN_ID='DOOR_EXPLORE_INSTRUMENT_DECISION_CYCLE3_V1';
const LABELS={
 'door-gauges':['Entry instrument','Signal becomes readable.'],
 'explore-gauges':['Inspection instrument','Inspect the live signal.'],
 'measurement':['Measurement slice','Compare state to threshold.'],
 'governance':['Governance slice','Rule resolves disposition.']
};
function draw(ctx,w,h,s,variant){
 ctx.clearRect(0,0,w,h);const cx=w*.5,cy=h*.48,r=Math.min(w,h)*.28;
 const bg=ctx.createRadialGradient(cx,cy,0,cx,cy,r*1.8);bg.addColorStop(0,`rgba(45,111,139,${.08+.11*s.gauge})`);bg.addColorStop(1,'rgba(3,7,13,0)');ctx.fillStyle=bg;ctx.fillRect(0,0,w,h);
 ctx.strokeStyle='rgba(125,221,247,.15)';ctx.lineWidth=1;for(let i=0;i<5;i++){const y=h*(.22+i*.1);ctx.beginPath();ctx.moveTo(w*.12,y);ctx.lineTo(w*.88,y);ctx.stroke()}
 ctx.strokeStyle=`rgba(117,235,255,${.18+.68*s.signal})`;ctx.lineWidth=2;ctx.beginPath();for(let i=0;i<=80;i++){const x=w*(.1+.8*i/80);const amp=(8+16*s.signal)*Math.sin(i*.42+s.scan*6.28)*(variant==='measurement'?1.15:1);const y=h*.23+amp+(i>48?8*s.rule:0);i?ctx.lineTo(x,y):ctx.moveTo(x,y)}ctx.stroke();
 ctx.save();ctx.translate(cx,cy);ctx.strokeStyle=`rgba(190,237,250,${.18+.55*s.gauge})`;ctx.lineWidth=3;ctx.beginPath();ctx.arc(0,0,r,Math.PI*.78,Math.PI*2.22);ctx.stroke();for(let i=0;i<=8;i++){const a=Math.PI*.78+(Math.PI*1.44)*(i/8);ctx.strokeStyle='rgba(190,237,250,.2)';ctx.beginPath();ctx.moveTo(Math.cos(a)*r*.82,Math.sin(a)*r*.82);ctx.lineTo(Math.cos(a)*r*.98,Math.sin(a)*r*.98);ctx.stroke()}
 const a=Math.PI*.78+Math.PI*1.44*s.needle;ctx.strokeStyle=variant==='governance'?'rgba(243,200,111,.92)':'rgba(139,230,255,.92)';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(Math.cos(a)*r*.72,Math.sin(a)*r*.72);ctx.stroke();ctx.fillStyle='rgba(240,249,252,.85)';ctx.beginPath();ctx.arc(0,0,4,0,Math.PI*2);ctx.fill();ctx.restore();
 if(variant==='measurement'||variant==='governance'){const x=w*(.69+.05*s.measure);ctx.strokeStyle=`rgba(243,200,111,${.12+.7*s.measure})`;ctx.setLineDash([5,5]);ctx.beginPath();ctx.moveTo(x,h*.34);ctx.lineTo(x,h*.7);ctx.stroke();ctx.setLineDash([])}
 if(variant==='governance'){ctx.fillStyle=`rgba(185,156,255,${.08+.26*s.rule})`;ctx.fillRect(w*.72,h*.43,w*.13,h*.17);ctx.strokeStyle=`rgba(206,188,255,${.18+.62*s.rule})`;ctx.strokeRect(w*.72,h*.43,w*.13,h*.17)}
 if(s.disposition>.02){ctx.fillStyle=`rgba(${variant==='governance'?'243,200,111':'139,230,255'},${.08+.24*s.disposition})`;ctx.fillRect(w*.16,h*.72,w*.68,h*.035);ctx.fillStyle=`rgba(235,246,250,${.28+.58*s.disposition})`;ctx.font='700 10px system-ui';ctx.textAlign='center';ctx.fillText(variant==='governance'?'DISPOSITION RESOLVED':'STATE CLASSIFIED',cx,h*.78)}
}
function mountInstrumentCycle3(root){if(!(root instanceof Element))return null;if(root.dataset.instrumentCycleMounted==='true')return root.__instrumentCycle3||null;const variant=root.dataset.instrumentVariant||'door-gauges';const canvas=document.createElement('canvas');canvas.className='instrument-cycle3-canvas';canvas.setAttribute('aria-hidden','true');root.prepend(canvas);const ctx=canvas.getContext('2d');if(!ctx)throw new Error('INSTRUMENT_CANVAS_UNAVAILABLE');const reduce=matchMedia?.('(prefers-reduced-motion: reduce)')?.matches??false;let raf=0,active=true,start=performance.now();const dpr=()=>Math.min(1.5,devicePixelRatio||1);function frame(now){const rect=root.getBoundingClientRect(),ratio=dpr(),W=Math.max(1,Math.round(rect.width*ratio)),H=Math.max(1,Math.round(rect.height*ratio));if(canvas.width!==W||canvas.height!==H){canvas.width=W;canvas.height=H;canvas.style.width=`${rect.width}px`;canvas.style.height=`${rect.height}px`}ctx.setTransform(ratio,0,0,ratio,0,0);const s=getInstrumentCycleState(now-start,reduce);draw(ctx,rect.width,rect.height,s,variant);root.dataset.instrumentPhase=s.phase;if(active&&!reduce)raf=requestAnimationFrame(frame)}const io=typeof IntersectionObserver==='function'?new IntersectionObserver(e=>{active=!!e[0]?.isIntersecting;if(active&&!reduce){cancelAnimationFrame(raf);raf=requestAnimationFrame(frame)}else cancelAnimationFrame(raf)},{threshold:.05}):null;io?.observe(root);if(reduce)frame(performance.now());else raf=requestAnimationFrame(frame);const api=Object.freeze({specimenId:INSTRUMENT_SPECIMEN_ID,variant,cycleMs:INSTRUMENT_CYCLE_MS,reducedMotion:reduce});root.dataset.instrumentCycleMounted='true';root.__instrumentCycle3=api;return api}
function auto(){document.querySelectorAll('[data-instrument-cycle3]').forEach(mountInstrumentCycle3)}if(typeof document!=='undefined'){document.readyState==='loading'?document.addEventListener('DOMContentLoaded',auto,{once:true}):auto()}

}

/* laws-cycle4 */
{
const LAWS_CYCLE_MS=9000;
const LAWS_PHASES=Object.freeze(['ORBIT','SELECT','ALIGN','READ','RETURN']);
const clamp=x=>Math.max(0,Math.min(1,x));const smooth=x=>{x=clamp(x);return x*x*(3-2*x)};
function getLawsCycleState(ms,reduced=false){if(reduced)return Object.freeze({phase:'READ',orbit:.18,focus:1,align:1,read:1,returning:0});const t=((ms%LAWS_CYCLE_MS)+LAWS_CYCLE_MS)%LAWS_CYCLE_MS/LAWS_CYCLE_MS;let phase='ORBIT',orbit=0,focus=0,align=0,read=0,returning=0;if(t<.28){orbit=t/.28*.38}else if(t<.47){phase='SELECT';const p=smooth((t-.28)/.19);orbit=.38+.08*p;focus=p}else if(t<.64){phase='ALIGN';const p=smooth((t-.47)/.17);orbit=.46;focus=1;align=p}else if(t<.82){phase='READ';const p=smooth((t-.64)/.18);orbit=.46;focus=1;align=1;read=p}else{phase='RETURN';const p=smooth((t-.82)/.18);orbit=.46+.54*p;focus=1-p;align=1-p;read=1-p;returning=p}return Object.freeze({phase,orbit:clamp(orbit),focus:clamp(focus),align:clamp(align),read:clamp(read),returning:clamp(returning)})}

const LAWS_SPECIMEN_ID='DOOR_EXPLORE_LAWS_CYCLE4_V1';const NS='http://www.w3.org/2000/svg';const mk=(t,a={})=>{const n=document.createElementNS(NS,t);Object.entries(a).forEach(([k,v])=>n.setAttribute(k,String(v)));return n};
function mountLawsCycle4(root){if(!(root instanceof Element))return null;if(root.dataset.lawsCycleMounted==='true')return root.__lawsCycle4||null;const variant=root.dataset.lawsVariant==='explore'?'explore':'door',svg=mk('svg',{viewBox:'0 0 400 260','aria-hidden':'true'});svg.classList.add('laws-cycle4-svg');const center=mk('polygon',{points:'200,79 244,123 200,167 156,123',fill:'rgba(243,200,111,.08)',stroke:'#f3c86f','stroke-opacity':.42});svg.append(center);const ring=mk('ellipse',{cx:200,cy:123,rx:126,ry:71,fill:'none',stroke:'#e8c46d','stroke-opacity':.18});svg.append(ring);const relation=mk('line',{x1:200,y1:123,x2:200,y2:123,stroke:'#fff0b7','stroke-width':1.5,'stroke-opacity':0});svg.append(relation);const nodes=[0,1,2,3].map(i=>{const g=mk('g'),d=mk('polygon',{points:'0,-14 14,0 0,14 -14,0',fill:i===0?'#6a5525':'#20263a',stroke:i===0?'#f3c86f':'#9ccce0','stroke-opacity':.55}),l=mk('text',{x:0,y:4,'text-anchor':'middle',fill:'#f6f2e8','font-size':9,'font-family':'system-ui','font-weight':700});l.textContent=['F','I','R','S'][i];g.append(d,l);svg.append(g);return g});root.prepend(svg);const reduce=matchMedia?.('(prefers-reduced-motion: reduce)')?.matches??false;let raf=0,active=true,start=performance.now();function draw(now){const s=getLawsCycleState(now-start,reduce),base=(variant==='door'?-18:12)+s.orbit*360;nodes.forEach((g,i)=>{const a=(base+i*90)*Math.PI/180;let x=200+Math.cos(a)*126,y=123+Math.sin(a)*71;if(i===0){x=x+(200-x)*s.focus*.55;y=y+(123-y)*s.focus*.55;g.style.filter=`brightness(${1+.55*s.focus}) drop-shadow(0 0 ${12*s.focus}px rgba(243,200,111,.38))`}g.setAttribute('transform',`translate(${x} ${y}) rotate(${variant==='door'?s.focus*12:-s.focus*8})`)});const target=nodes[0].transform.baseVal.consolidate()?.matrix;const tx=target?.e??200,ty=target?.f??123;relation.setAttribute('x2',tx);relation.setAttribute('y2',ty);relation.setAttribute('stroke-opacity',String(.12+.68*s.align));center.setAttribute('fill',variant==='explore'?`rgba(139,230,255,${.04+.12*s.read})`:`rgba(243,200,111,${.05+.14*s.read})`);root.dataset.lawsPhase=s.phase;if(active&&!reduce)raf=requestAnimationFrame(draw)}const io=typeof IntersectionObserver==='function'?new IntersectionObserver(e=>{active=!!e[0]?.isIntersecting;if(active&&!reduce){cancelAnimationFrame(raf);raf=requestAnimationFrame(draw)}else cancelAnimationFrame(raf)},{threshold:.05}):null;io?.observe(root);if(reduce)draw(performance.now());else raf=requestAnimationFrame(draw);const api=Object.freeze({specimenId:LAWS_SPECIMEN_ID,variant,cycleMs:LAWS_CYCLE_MS,reducedMotion:reduce});root.dataset.lawsCycleMounted='true';root.__lawsCycle4=api;return api}function auto(){document.querySelectorAll('[data-laws-cycle4]').forEach(mountLawsCycle4)}if(typeof document!=='undefined'){document.readyState==='loading'?document.addEventListener('DOMContentLoaded',auto,{once:true}):auto()}

}

/* identity-cycle5 */
{
const IDENTITY_CYCLE_MS=10000;
const IDENTITY_PHASES=Object.freeze(['ROOT','ROOMS','LINKS','RESOLVE','RETURN']);
const clamp=x=>Math.max(0,Math.min(1,x));const smooth=x=>{x=clamp(x);return x*x*(3-2*x)};
function getIdentityCycleState(ms,reduced=false){if(reduced)return Object.freeze({phase:'RESOLVE',root:1,rooms:1,links:1,resolve:1,returning:0});const t=((ms%IDENTITY_CYCLE_MS)+IDENTITY_CYCLE_MS)%IDENTITY_CYCLE_MS/IDENTITY_CYCLE_MS;let phase='ROOT',root=0,rooms=0,links=0,resolve=0,returning=0;if(t<.2){root=smooth(t/.2)}else if(t<.4){phase='ROOMS';const p=smooth((t-.2)/.2);root=1;rooms=p}else if(t<.62){phase='LINKS';const p=smooth((t-.4)/.22);root=1;rooms=1;links=p}else if(t<.82){phase='RESOLVE';const p=smooth((t-.62)/.2);root=1;rooms=1;links=1;resolve=p}else{phase='RETURN';const p=smooth((t-.82)/.18);root=1-p*.35;rooms=1-p;links=1-p;resolve=1-p;returning=p}return Object.freeze({phase,root:clamp(root),rooms:clamp(rooms),links:clamp(links),resolve:clamp(resolve),returning:clamp(returning)})}

const IDENTITY_SPECIMEN_ID='DOOR_HOME_EXPLORE_IDENTITY_CYCLE5_V1';const NS='http://www.w3.org/2000/svg';const mk=(t,a={})=>{const n=document.createElementNS(NS,t);Object.entries(a).forEach(([k,v])=>n.setAttribute(k,String(v)));return n};
function mountIdentityCycle5(root){if(!(root instanceof Element))return null;if(root.dataset.identityCycleMounted==='true')return root.__identityCycle5||null;const variant=root.dataset.identityVariant==='identity'?'identity':'home',svg=mk('svg',{viewBox:'0 0 400 260','aria-hidden':'true'});svg.classList.add('identity-cycle5-svg');const links=mk('g'),house=mk('g'),nodes=mk('g');svg.append(links,house,nodes);const body=mk('rect',{x:146,y:100,width:108,height:78,rx:4,fill:'#3b2c1b','fill-opacity':.55,stroke:'#ffd899','stroke-opacity':.45});const roof=mk('polygon',{points:'132,106 200,54 268,106',fill:'#241b12',stroke:'#ffd899','stroke-opacity':.52});const door=mk('rect',{x:190,y:140,width:20,height:38,fill:'#0d0a07',stroke:'#8be6ff','stroke-opacity':.32});house.append(body,roof,door);const windows=[[162,120],[218,120],[162,145],[218,145]].map(([x,y])=>{const w=mk('rect',{x,y,width:18,height:13,fill:'#ffe8a8','fill-opacity':.08,stroke:'#ffd899','stroke-opacity':.22});house.append(w);return w});const pts=[[80,70],[320,72],[66,180],[334,182],[200,30]];const ns=pts.map(([x,y],i)=>{const n=mk('circle',{cx:x,cy:y,r:5,fill:i===4?'#ffd899':'#8be6ff','fill-opacity':.2,stroke:i===4?'#ffd899':'#8be6ff','stroke-opacity':.45});nodes.append(n);const l=mk('line',{x1:200,y1:116,x2:x,y2:y,stroke:i===4?'#ffd899':'#8be6ff','stroke-opacity':0,'stroke-width':1});links.append(l);return{n,l}});root.prepend(svg);const reduce=matchMedia?.('(prefers-reduced-motion: reduce)')?.matches??false;let raf=0,active=true,start=performance.now();function draw(now){const s=getIdentityCycleState(now-start,reduce);house.setAttribute('transform',`translate(200 120) scale(${.82+.18*s.root}) translate(-200 -120)`);house.setAttribute('opacity',String(.22+.78*s.root));windows.forEach((w,i)=>w.setAttribute('fill-opacity',String(.06+s.rooms*(variant==='home'?(.32+i*.08):.14))));ns.forEach(({n,l},i)=>{const level=s.links*(.55+.45*((i+1)/ns.length));l.setAttribute('stroke-opacity',String(.05+.5*level));n.setAttribute('fill-opacity',String(.1+.55*level));n.setAttribute('r',String(5+s.resolve*(variant==='identity'?3:1.4)))});if(variant==='identity'){body.setAttribute('fill-opacity',String(.22+.25*s.resolve));roof.setAttribute('stroke-opacity',String(.25+.35*s.resolve));links.setAttribute('transform',`rotate(${s.resolve*5} 200 116)`)}else{body.setAttribute('fill-opacity',String(.35+.34*s.rooms));roof.setAttribute('fill-opacity',String(.5+.25*s.rooms))}root.dataset.identityPhase=s.phase;if(active&&!reduce)raf=requestAnimationFrame(draw)}const io=typeof IntersectionObserver==='function'?new IntersectionObserver(e=>{active=!!e[0]?.isIntersecting;if(active&&!reduce){cancelAnimationFrame(raf);raf=requestAnimationFrame(draw)}else cancelAnimationFrame(raf)},{threshold:.05}):null;io?.observe(root);if(reduce)draw(performance.now());else raf=requestAnimationFrame(draw);const api=Object.freeze({specimenId:IDENTITY_SPECIMEN_ID,variant,cycleMs:IDENTITY_CYCLE_MS,reducedMotion:reduce});root.dataset.identityCycleMounted='true';root.__identityCycle5=api;return api}function auto(){document.querySelectorAll('[data-identity-cycle5]').forEach(mountIdentityCycle5)}if(typeof document!=='undefined'){document.readyState==='loading'?document.addEventListener('DOMContentLoaded',auto,{once:true}):auto()}

}
