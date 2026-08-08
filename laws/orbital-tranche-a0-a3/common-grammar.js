((g)=>{
  const clamp=(v,min,max)=>Math.max(min,Math.min(max,v));
  const core={
    stepIndex(i,d,n,w='BOUNDED'){
      if(!Number.isInteger(i)||!Number.isInteger(d)||n<1)return i;
      const next=i+d;
      if(w==='CYCLIC')return((next%n)+n)%n;
      return Math.max(0,Math.min(n-1,next));
    },
    visibleOffsets(i,n,r=2){
      const out=[];
      for(let d=-r;d<=r;d++){
        const x=i+d;
        if(x>=0&&x<n)out.push({index:x,offset:d});
      }
      return out;
    },
    dragProgress(dx,spacing,index,count){
      let p=clamp(dx/Math.max(1,spacing),-1.15,1.15);
      if((index===0&&p>0)||(index===count-1&&p<0))p*=0.22;
      return p;
    },
    dragDirection(progress,velocity=0){
      if(progress<=-0.24||velocity<=-0.45)return 1;
      if(progress>=0.24||velocity>=0.45)return -1;
      return 0;
    }
  };
  g.DGBLawsOrbitalCore=core;
  if(typeof document==='undefined')return;

  const root=document.documentElement;
  const sequence=Number(root.dataset.lawsStorySequence);
  if(!Number.isInteger(sequence)||sequence<1)return;

  const manifestUrl='/laws/orbital-tranche-a0-a3/manifest.v1.json';
  const fail=()=>{root.dataset.lawsOrbitalStoryStatus='fail-closed'};

  fetch(manifestUrl,{credentials:'same-origin'})
    .then(r=>{if(!r.ok)throw new Error('manifest');return r.json()})
    .then(m=>{
      if(m.surface?.semanticType!=='NARRATIVE_SEQUENCE'||m.surface?.wrapPolicy!=='BOUNDED')throw new Error('surface');
      const stories=m.stories||[];
      const i=sequence-1;
      const current=stories[i];
      if(!current||current.position!==sequence)throw new Error('binding');
      const main=document.querySelector('main');
      if(!main)return fail();

      const shell=document.createElement('section');
      shell.className='laws-orbital-story';
      shell.dataset.orbitalSurface=m.surface.surfaceId;
      shell.dataset.semanticType=m.surface.semanticType;
      shell.dataset.wrapPolicy=m.surface.wrapPolicy;
      shell.dataset.selectedMember=current.memberId;
      shell.setAttribute('aria-label','Laws narrative orbit');

      const visible=core.visibleOffsets(i,stories.length);
      const members=visible.map(({index,offset})=>{
        const s=stories[index],selected=index===i;
        return `<a class="laws-orbital-story__member" style="--o:${offset}" data-orbit-offset="${offset}" href="${s.route}" data-member-id="${s.memberId}" data-selected="${selected?'true':'false'}" ${selected?'aria-current="page"':''}><small>Story ${s.position} of ${stories.length}</small><strong>${s.label}</strong></a>`;
      }).join('');
      const prev=i>0?stories[i-1]:null;
      const next=i<stories.length-1?stories[i+1]:null;
      shell.innerHTML=`<header class="laws-orbital-story__head"><div><p class="laws-orbital-story__eyebrow">Laws · canonical narrative</p><h2>${current.label}</h2></div><p class="laws-orbital-story__position">Story ${current.position} / ${stories.length}</p></header><div class="laws-orbital-story__stage" tabindex="0" aria-describedby="laws-orbital-cue"><div class="laws-orbital-story__ring">${members}</div></div><div class="laws-orbital-story__controls"><button class="laws-orbital-story__control" type="button" data-orbit-prev aria-disabled="${prev?'false':'true'}">← ${prev?prev.label:'Beginning'}</button><span class="laws-orbital-story__cue" id="laws-orbital-cue">Swipe / drag · wheel · arrow keys</span><button class="laws-orbital-story__control" type="button" data-orbit-next aria-disabled="${next?'false':'true'}">${next?next.label:'End'} →</button></div>`;
      main.insertBefore(shell,main.firstElementChild);

      const stage=shell.querySelector('.laws-orbital-story__stage');
      const cards=[...shell.querySelectorAll('.laws-orbital-story__member')];
      let suppressClickUntil=0;

      const spacing=()=>{
        const w=stage.clientWidth||window.innerWidth||320;
        return window.matchMedia('(max-width:720px)').matches?Math.max(150,w*0.54):Math.min(window.innerWidth*0.23,288);
      };

      const renderDrag=p=>{
        const gap=spacing();
        const mobile=window.matchMedia('(max-width:720px)').matches;
        let closest=null;
        let closestAbs=Infinity;
        cards.forEach(card=>{
          const base=Number(card.dataset.orbitOffset||0);
          const e=base+p;
          const abs=Math.abs(e);
          if(abs<closestAbs){closestAbs=abs;closest=card}
          const scale=Math.max(0.72,1-(e*e*0.075));
          const opacity=Math.max(0.28,1-(e*e*0.18));
          const z=-(e*e*28);
          const ry=e*(mobile?-10:-16);
          card.style.transform=`translate(-50%,-50%) translateX(${e*gap}px) translateZ(${z}px) rotateY(${ry}deg) scale(${scale})`;
          card.style.opacity=String(opacity);
          card.style.zIndex=String(20-Math.round(abs*5));
        });
        cards.forEach(card=>card.classList.toggle('is-gesture-front',card===closest));
        shell.style.setProperty('--gesture-progress',String(p));
      };

      const clearDrag=()=>{
        cards.forEach(card=>{
          card.style.removeProperty('transform');
          card.style.removeProperty('opacity');
          card.style.removeProperty('z-index');
          card.classList.remove('is-gesture-front');
        });
        shell.style.removeProperty('--gesture-progress');
        stage.classList.remove('is-dragging','is-settling');
      };

      const boundary=()=>{
        shell.classList.remove('is-boundary');
        void shell.offsetWidth;
        shell.classList.add('is-boundary');
      };

      const go=d=>{
        const ni=core.stepIndex(i,d,stories.length,'BOUNDED');
        if(ni===i){boundary();return}
        shell.classList.add(d>0?'is-traversing-forward':'is-traversing-back');
        setTimeout(()=>location.assign(stories[ni].route),180);
      };

      shell.querySelector('[data-orbit-prev]').addEventListener('click',()=>go(-1));
      shell.querySelector('[data-orbit-next]').addEventListener('click',()=>go(1));

      stage.addEventListener('keydown',e=>{
        if(e.key==='ArrowRight'){e.preventDefault();go(1)}
        if(e.key==='ArrowLeft'){e.preventDefault();go(-1)}
      });

      let wheel=0,cool=false;
      stage.addEventListener('wheel',e=>{
        if(cool)return;
        wheel+=Math.abs(e.deltaX)>Math.abs(e.deltaY)?e.deltaX:e.deltaY;
        if(Math.abs(wheel)>90){
          e.preventDefault();
          cool=true;
          go(wheel>0?1:-1);
          wheel=0;
          setTimeout(()=>cool=false,600);
        }
      },{passive:false});

      let drag=null;
      stage.addEventListener('pointerdown',e=>{
        if(e.pointerType==='mouse'&&e.button!==0)return;
        drag={
          id:e.pointerId,
          startX:e.clientX,
          startY:e.clientY,
          lastX:e.clientX,
          lastT:performance.now(),
          velocity:0,
          axis:null,
          progress:0,
          moved:false
        };
        stage.classList.remove('is-settling');
      });

      stage.addEventListener('pointermove',e=>{
        if(!drag||drag.id!==e.pointerId)return;
        const dx=e.clientX-drag.startX;
        const dy=e.clientY-drag.startY;
        if(!drag.axis&&(Math.abs(dx)>6||Math.abs(dy)>6)){
          drag.axis=Math.abs(dx)>Math.abs(dy)*1.1?'x':'y';
          if(drag.axis==='x'){
            stage.setPointerCapture?.(e.pointerId);
            stage.classList.add('is-dragging');
            renderDrag(0);
          }
        }
        if(drag.axis!=='x')return;
        e.preventDefault();
        const now=performance.now();
        const dt=Math.max(1,now-drag.lastT);
        drag.velocity=(e.clientX-drag.lastX)/dt;
        drag.lastX=e.clientX;
        drag.lastT=now;
        drag.moved=drag.moved||Math.abs(dx)>8;
        drag.progress=core.dragProgress(dx,spacing(),i,stories.length);
        renderDrag(drag.progress);
      },{passive:false});

      const finishDrag=(e,cancelled=false)=>{
        if(!drag||drag.id!==e.pointerId)return;
        const state=drag;
        drag=null;
        if(state.axis!=='x')return;
        if(state.moved)suppressClickUntil=performance.now()+650;
        const d=cancelled?0:core.dragDirection(state.progress,state.velocity);
        const ni=d?core.stepIndex(i,d,stories.length,'BOUNDED'):i;
        stage.classList.remove('is-dragging');
        stage.classList.add('is-settling');
        if(d&&ni!==i){
          renderDrag(d>0?-1:1);
          shell.classList.add(d>0?'is-traversing-forward':'is-traversing-back');
          setTimeout(()=>location.assign(stories[ni].route),240);
        }else{
          renderDrag(0);
          if(d&&ni===i)boundary();
          setTimeout(clearDrag,240);
        }
      };

      stage.addEventListener('pointerup',e=>finishDrag(e,false));
      stage.addEventListener('pointercancel',e=>finishDrag(e,true));
      stage.addEventListener('lostpointercapture',e=>{if(drag&&drag.id===e.pointerId)finishDrag(e,true)});
      stage.addEventListener('dragstart',e=>e.preventDefault());
      stage.addEventListener('click',e=>{
        if(performance.now()<suppressClickUntil){
          e.preventDefault();
          e.stopPropagation();
        }
      },true);

      window.addEventListener('resize',()=>{
        if(stage.classList.contains('is-dragging')&&drag)renderDrag(drag.progress);
      },{passive:true});

      document.querySelectorAll('[data-lr-tabs],.lr-tablist').forEach(el=>{
        el.dataset.orbitalSemanticType='PARALLEL_LENS';
        el.dataset.scientificSequence='false';
      });
      root.dataset.lawsOrbitalStoryStatus='ready';
      root.dataset.lawsOrbitalGestureMode='continuous-drag';
    })
    .catch(fail);
})(globalThis);
