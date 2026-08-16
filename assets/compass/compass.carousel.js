(()=>{
  'use strict';
  const reduce=matchMedia('(prefers-reduced-motion: reduce)');
  const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
  const mod=(n,m)=>((n%m)+m)%m;

  function claimSwipe(stage,onResolve,{disabled=()=>false}={}){
    let active=false,startX=0,startY=0,id=null;
    stage.style.touchAction='pan-y';
    stage.addEventListener('pointerdown',e=>{
      if(disabled()||e.button>0)return;
      active=true;id=e.pointerId;startX=e.clientX;startY=e.clientY;
      stage.setPointerCapture?.(id);
    });
    stage.addEventListener('pointerup',e=>{
      if(!active||e.pointerId!==id)return;
      const dx=e.clientX-startX,dy=e.clientY-startY,w=Math.max(1,stage.getBoundingClientRect().width);
      active=false;stage.releasePointerCapture?.(id);
      if(Math.abs(dx)<36&&Math.abs(dx)<w*.08)return;
      if(Math.abs(dx)<Math.abs(dy)*1.25)return;
      onResolve(dx<0?1:-1);
    });
    stage.addEventListener('pointercancel',e=>{active=false;stage.releasePointerCapture?.(e.pointerId)});
  }

  function sparkle(sentence){
    if(reduce.matches){sentence.classList.remove('is-arriving');void sentence.offsetWidth;sentence.classList.add('is-arriving');setTimeout(()=>sentence.classList.remove('is-arriving'),260);return;}
    sentence.classList.remove('is-arriving');void sentence.offsetWidth;sentence.classList.add('is-arriving');
    const field=document.createElement('span');field.className='compass-statement-sparkles';field.setAttribute('aria-hidden','true');
    const count=10;
    for(let i=0;i<count;i++){
      const s=document.createElement('i');
      const angle=(i/count)*Math.PI*2+(i%2)*.23;
      const radius=38+(i%4)*11;
      s.style.setProperty('--sx',`${50+Math.cos(angle)*radius}%`);
      s.style.setProperty('--sy',`${50+Math.sin(angle)*radius*.42}%`);
      s.style.setProperty('--delay',`${i*26}ms`);
      field.append(s);
    }
    sentence.append(field);
    setTimeout(()=>{field.remove();sentence.classList.remove('is-arriving')},680);
  }

  function statementOrbit(){
    const header=document.querySelector('.compass-estate__header');
    if(!header||header.querySelector('[data-statement-orbit]'))return;
    const a=header.querySelector('.compass-estate__sentence');
    const b=header.querySelector('.compass-estate__epigraph');
    if(!a||!b)return;
    const stage=document.createElement('div');stage.className='compass-statement-orbit';stage.dataset.statementOrbit='true';stage.setAttribute('aria-label','Opening statements');
    const items=[a,b];let index=0,busy=false;
    items.forEach((el,i)=>{el.classList.add('compass-statement-object');el.removeAttribute('aria-hidden');stage.append(el);el.dataset.slot=i===0?'front':'rear';});
    const intro=header.querySelector('.compass-introduction');header.insertBefore(stage,intro);
    function render(arrival=false){items.forEach((el,i)=>{const front=i===index;el.dataset.slot=front?'front':'rear';el.setAttribute('aria-current',front?'true':'false');el.setAttribute('aria-hidden',front?'false':'true');});if(arrival)sparkle(items[index]);}
    function rotate(dir){if(busy)return;busy=true;index=mod(index+dir,2);stage.dataset.rotate=dir>0?'next':'prev';render(false);setTimeout(()=>{stage.dataset.rotate='';sparkle(items[index]);busy=false},reduce.matches?110:440);}
    claimSwipe(stage,rotate);
    stage.addEventListener('keydown',e=>{if(e.key==='ArrowRight'){e.preventDefault();rotate(1)}else if(e.key==='ArrowLeft'){e.preventDefault();rotate(-1)}});
    stage.tabIndex=0;render(true);
  }

  function makeMesh(){
    const parts=[];
    function ellipsoid(cx,cy,cz,rx,ry,rz,segU=18,segV=12,warp=.05,label='cerebrum'){
      const v=[],f=[];
      for(let j=0;j<=segV;j++){
        const ph=-Math.PI/2+j/segV*Math.PI;
        for(let i=0;i<segU;i++){
          const th=i/segU*Math.PI*2;
          const relief=1+warp*(Math.sin(th*5+ph*3)+.55*Math.sin(th*9-ph*4));
          v.push([cx+rx*Math.cos(ph)*Math.cos(th)*relief,cy+ry*Math.sin(ph)*relief,cz+rz*Math.cos(ph)*Math.sin(th)*relief]);
        }
      }
      for(let j=0;j<segV;j++)for(let i=0;i<segU;i++){
        const n=(i+1)%segU,a=j*segU+i,b=j*segU+n,c=(j+1)*segU+n,d=(j+1)*segU+i;
        f.push([a,b,c,label],[a,c,d,label]);
      }
      parts.push({v,f,label});
    }
    function cylinder(cx,cy,cz,r,halfH,seg=14,label='stem'){
      const v=[],f=[];
      for(let y of[-halfH,halfH])for(let i=0;i<seg;i++){const th=i/seg*Math.PI*2;v.push([cx+r*Math.cos(th)*(y<0?.78:1),cy+y,cz+r*Math.sin(th)*(y<0?.78:1)]);}
      for(let i=0;i<seg;i++){const n=(i+1)%seg;f.push([i,n,seg+n,label],[i,seg+n,seg+i,label]);}
      parts.push({v,f,label});
    }
    ellipsoid(-.38,.10,.02,.62,.78,.82,20,13,.055,'left');
    ellipsoid(.38,.10,.02,.62,.78,.82,20,13,.055,'right');
    ellipsoid(-.42,-.30,.23,.48,.38,.55,16,10,.045,'temporal');
    ellipsoid(.42,-.30,.23,.48,.38,.55,16,10,.045,'temporal');
    ellipsoid(0,-.47,-.70,.50,.34,.38,18,10,.075,'cerebellum');
    cylinder(0,-.82,-.18,.17,.34,14,'stem');
    return parts;
  }

  const BRAIN_MESH=makeMesh();
  function mountBrain(root){
    if(!root||root.dataset.brainMounted)return;
    root.dataset.brainMounted='true';
    const canvas=document.createElement('canvas');canvas.className='compass-brain-human';canvas.setAttribute('role','img');canvas.setAttribute('aria-label','Rotating three-dimensional human brain with visible hemispheres, cerebellum, and brainstem');root.append(canvas);
    const ctx=canvas.getContext('2d',{alpha:true});let yaw=.52,targetYaw=.52,drag=false,lastX=0,lastT=performance.now(),raf=0;
    function resize(){const r=root.getBoundingClientRect(),d=Math.min(devicePixelRatio||1,2);canvas.width=Math.max(1,Math.round(r.width*d));canvas.height=Math.max(1,Math.round(r.height*d));ctx.setTransform(d,0,0,d,0,0)}
    const ro=new ResizeObserver(resize);ro.observe(root);resize();
    function rotate3(p,y){const c=Math.cos(y),s=Math.sin(y);return[p[0]*c+p[2]*s,p[1],-p[0]*s+p[2]*c];}
    function project(p,w,h,s){const z=p[2],f=1/(3.45-z*.38);return[w*.5+p[0]*s*f,h*.48-p[1]*s*f,z];}
    function faceNormal(a,b,c){const u=[b[0]-a[0],b[1]-a[1],b[2]-a[2]],v=[c[0]-a[0],c[1]-a[1],c[2]-a[2]];const n=[u[1]*v[2]-u[2]*v[1],u[2]*v[0]-u[0]*v[2],u[0]*v[1]-u[1]*v[0]];const L=Math.hypot(...n)||1;return n.map(x=>x/L)}
    function color(label,light,z){const base=label==='cerebellum'?[174,102,111]:label==='stem'?[159,91,102]:[206,132,132];const k=.58+.42*clamp(light,0,1)+.08*clamp(z+1,0,2);return`rgb(${base.map(v=>Math.round(clamp(v*k,0,255))).join(',')})`;}
    function draw(now){
      const dt=Math.min(40,now-lastT);lastT=now;if(!drag&&!reduce.matches)targetYaw+=dt*(8*Math.PI/180/1000);yaw+=(targetYaw-yaw)*.07;
      const w=canvas.clientWidth,h=canvas.clientHeight,s=Math.min(w,h)*1.38;ctx.clearRect(0,0,w,h);
      const glow=ctx.createRadialGradient(w*.5,h*.47,10,w*.5,h*.47,Math.min(w,h)*.48);glow.addColorStop(0,'rgba(115,210,226,.10)');glow.addColorStop(1,'rgba(115,210,226,0)');ctx.fillStyle=glow;ctx.fillRect(0,0,w,h);
      const tris=[];
      for(const part of BRAIN_MESH){const rv=part.v.map(p=>rotate3(p,yaw));for(const face of part.f){const a=rv[face[0]],b=rv[face[1]],c=rv[face[2]],n=faceNormal(a,b,c);if(n[2]<-.08)continue;tris.push({a,b,c,n,label:face[3],z:(a[2]+b[2]+c[2])/3});}}
      tris.sort((A,B)=>A.z-B.z);
      for(const t of tris){const A=project(t.a,w,h,s),B=project(t.b,w,h,s),C=project(t.c,w,h,s);const light=clamp(t.n[0]*-.2+t.n[1]*.46+t.n[2]*.78,0,1);ctx.beginPath();ctx.moveTo(A[0],A[1]);ctx.lineTo(B[0],B[1]);ctx.lineTo(C[0],C[1]);ctx.closePath();ctx.fillStyle=color(t.label,light,t.z);ctx.fill();ctx.strokeStyle='rgba(76,36,52,.10)';ctx.lineWidth=.45;ctx.stroke();}
      ctx.save();ctx.globalCompositeOperation='screen';ctx.strokeStyle='rgba(111,210,231,.22)';ctx.lineWidth=1.1;ctx.beginPath();const p1=project(rotate3([0,.78,.02],yaw),w,h,s),p2=project(rotate3([0,-.40,.04],yaw),w,h,s);ctx.moveTo(p1[0],p1[1]);ctx.lineTo(p2[0],p2[1]);ctx.stroke();ctx.restore();
      raf=requestAnimationFrame(draw);
    }
    canvas.addEventListener('pointerdown',e=>{e.stopPropagation();drag=true;lastX=e.clientX;canvas.setPointerCapture?.(e.pointerId)});
    canvas.addEventListener('pointermove',e=>{if(!drag)return;e.stopPropagation();targetYaw+=(e.clientX-lastX)*.012;lastX=e.clientX});
    const up=e=>{e.stopPropagation();drag=false;canvas.releasePointerCapture?.(e.pointerId)};canvas.addEventListener('pointerup',up);canvas.addEventListener('pointercancel',up);
    if(reduce.matches){yaw=targetYaw=.52;}raf=requestAnimationFrame(draw);
    root._brainDestroy=()=>{cancelAnimationFrame(raf);ro.disconnect()};
  }

  function capabilityOrbit(){
    const old=document.querySelector('[data-compass-capability-switcher]');
    if(!old||document.querySelector('[data-capability-orbit]'))return;
    const stage=document.createElement('section');stage.className='compass-capability-orbit';stage.dataset.capabilityOrbit='true';stage.dataset.capabilityMode='orbit';stage.setAttribute('aria-label','Signature Diamond Gate capabilities');stage.tabIndex=0;
    const coherence=document.createElement('article');coherence.className='compass-orbit-plaque';coherence.dataset.capability='coherence';
    coherence.innerHTML=`<div class="compass-plaque-copy"><p class="compass-estate__kicker">Diagnostic</p><h2>Coherence Diagnostic</h2><p>Compare what matters to you with how you are actually living and deciding. See areas of alignment, tension, and repeated mismatch.</p><div class="compass-plaque-actions"><a class="compass-orbit-action" href="/coherence-diagnostic/">ENTER</a><button class="compass-orbit-action compass-orbit-action--secondary" type="button" data-return-parent>RETURN TO ORBIT</button></div></div><div class="compass-brain-shell" data-human-brain></div>`;
    const house=document.createElement('article');house.className='compass-orbit-plaque';house.dataset.capability='house';
    house.innerHTML=`<div class="compass-house-parent" data-house-parent><div class="compass-plaque-copy"><p class="compass-estate__kicker">Ask for directions</p><h2>Talk to the House</h2><p>Ask the House where to begin, which room fits your question, or what part of the estate can help.</p><div class="compass-plaque-actions"><button class="compass-orbit-action" type="button" data-enter-house>ENTER</button><button class="compass-orbit-action compass-orbit-action--secondary" type="button" data-return-parent>RETURN TO ORBIT</button></div></div></div><div class="house-orbit" data-house-orbit hidden aria-label="House members"></div>`;
    stage.append(coherence,house);old.replaceWith(stage);
    mountBrain(coherence.querySelector('[data-human-brain]'));
    const cards=[coherence,house];let index=0,busy=false,mode='ORBIT',memberIndex=0,memberBusy=false;

    const houseParent=house.querySelector('[data-house-parent]');
    const houseOrbit=house.querySelector('[data-house-orbit]');
    const memberDefs=[
      {id:'jeeves',name:'Jeeves',status:'Available now',body:'The currently bound House guide.',href:'/showroom/globe/hearth/jeeves/'},
      {id:'elara',name:'Elara',status:'Identity reserved',body:'House-member position preserved until website-backed identity and route authority are recovered.'},
      {id:'auren',name:'Auren',status:'Identity reserved',body:'House-member position preserved until website-backed identity and route authority are recovered.'}
    ];
    const members=memberDefs.map(d=>{const el=document.createElement('article');el.className='house-orbit-member';el.dataset.member=d.id;el.innerHTML=`<span class="house-member-status">${d.status}</span><h3>${d.name}</h3><p>${d.body}</p><div class="compass-plaque-actions">${d.href?`<a class="compass-orbit-action" href="${d.href}">ENTER</a>`:`<button class="compass-orbit-action" type="button" disabled aria-disabled="true">ENTER</button>`}<button class="compass-orbit-action compass-orbit-action--secondary" type="button" data-return-house>RETURN TO ORBIT</button></div>`;houseOrbit.append(el);return el;});

    function renderParent(){cards.forEach((el,i)=>{const front=i===index;el.dataset.slot=front?'front':'rear';el.setAttribute('aria-hidden',front?'false':'true');});}
    function rotateParent(dir){if(busy||mode==='HOUSE_MEMBERS')return;busy=true;index=mod(index+dir,2);stage.dataset.rotate=dir>0?'next':'prev';renderParent();setTimeout(()=>{stage.dataset.rotate='';busy=false},reduce.matches?110:440)}
    function renderMembers(){members.forEach((el,i)=>{const d=mod(i-memberIndex,3);el.dataset.slot=d===0?'front':d===1?'rear-right':'rear-left';el.setAttribute('aria-hidden',d===0?'false':'true');});}
    function rotateMember(dir){if(memberBusy||mode!=='HOUSE_MEMBERS')return;memberBusy=true;memberIndex=mod(memberIndex+dir,3);houseOrbit.dataset.rotate=dir>0?'next':'prev';renderMembers();setTimeout(()=>{houseOrbit.dataset.rotate='';memberBusy=false},reduce.matches?110:440)}
    function enterHouse(){
      if(index!==1)return;
      mode='HOUSE_MEMBERS';
      stage.dataset.capabilityMode='house-members';
      house.classList.add('is-house-members');
      houseParent.hidden=true;houseParent.setAttribute('aria-hidden','true');houseParent.style.display='none';
      houseOrbit.hidden=false;houseOrbit.removeAttribute('hidden');houseOrbit.setAttribute('aria-hidden','false');houseOrbit.style.display='grid';
      renderMembers();
    }
    function leaveHouse(){
      mode='ORBIT';
      stage.dataset.capabilityMode='orbit';
      house.classList.remove('is-house-members');
      houseOrbit.hidden=true;houseOrbit.setAttribute('hidden','');houseOrbit.setAttribute('aria-hidden','true');houseOrbit.style.display='none';
      houseParent.hidden=false;houseParent.removeAttribute('hidden');houseParent.setAttribute('aria-hidden','false');houseParent.style.removeProperty('display');
      renderParent();
    }

    stage.querySelectorAll('[data-return-parent]').forEach(btn=>btn.addEventListener('click',e=>{e.stopPropagation();rotateParent(1)}));
    house.querySelector('[data-enter-house]').addEventListener('click',e=>{e.stopPropagation();enterHouse()});
    houseOrbit.addEventListener('click',e=>{const btn=e.target.closest('[data-return-house]');if(btn){e.stopPropagation();leaveHouse();}});
    claimSwipe(stage,rotateParent,{disabled:()=>mode==='HOUSE_MEMBERS'});
    claimSwipe(houseOrbit,rotateMember,{disabled:()=>mode!=='HOUSE_MEMBERS'});
    stage.addEventListener('keydown',e=>{if(e.key!=='ArrowLeft'&&e.key!=='ArrowRight')return;e.preventDefault();const dir=e.key==='ArrowRight'?1:-1;if(mode==='HOUSE_MEMBERS')rotateMember(dir);else rotateParent(dir)});
    renderParent();renderMembers();
  }

  function boot(){statementOrbit();capabilityOrbit();}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
  window.CompassEditorialCarousel={boot,version:'successor-v3'};
})();