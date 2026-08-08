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
  const initialSequence=Number(root.dataset.lawsStorySequence);
  if(!Number.isInteger(initialSequence)||initialSequence<1)return;

  const manifestUrl='/laws/orbital-tranche-a0-a3/manifest.v1.json';
  const PERSISTENT_START=0;
  const PERSISTENT_END=2;
  const fail=()=>{root.dataset.lawsOrbitalStoryStatus='fail-closed'};
  const delay=ms=>new Promise(resolve=>setTimeout(resolve,ms));
  const normalizePath=value=>{
    try{return new URL(value,location.href).pathname.replace(/\/+/g,'/')}catch{return value||''}
  };

  fetch(manifestUrl,{credentials:'same-origin'})
    .then(r=>{if(!r.ok)throw new Error('manifest');return r.json()})
    .then(m=>{
      if(m.surface?.semanticType!=='NARRATIVE_SEQUENCE'||m.surface?.wrapPolicy!=='BOUNDED')throw new Error('surface');
      const stories=m.stories||[];
      const initialIndex=initialSequence-1;
      if(!stories[initialIndex]||stories[initialIndex].position!==initialSequence)throw new Error('binding');

      const state={
        index:initialIndex,
        mounting:false,
        drag:null,
        suppressClickUntil:0,
        mountSerial:0,
        cache:new Map()
      };

      const shell=document.createElement('section');
      shell.className='laws-orbital-story';
      shell.dataset.orbitalSurface=m.surface.surfaceId;
      shell.dataset.semanticType=m.surface.semanticType;
      shell.dataset.wrapPolicy=m.surface.wrapPolicy;
      shell.setAttribute('aria-label','Laws narrative orbit');
      shell.innerHTML=`<header class="laws-orbital-story__head"><div><p class="laws-orbital-story__eyebrow">Laws · canonical narrative</p><h2 data-orbit-title></h2></div><p class="laws-orbital-story__position" data-orbit-position></p></header><div class="laws-orbital-story__stage" tabindex="0" aria-describedby="laws-orbital-cue"><div class="laws-orbital-story__ring"></div></div><div class="laws-orbital-story__controls"><button class="laws-orbital-story__control" type="button" data-orbit-prev></button><span class="laws-orbital-story__cue" id="laws-orbital-cue">Drag the story field · release to settle</span><button class="laws-orbital-story__control" type="button" data-orbit-next></button></div>`;

      const stage=shell.querySelector('.laws-orbital-story__stage');
      const ring=shell.querySelector('.laws-orbital-story__ring');
      const titleEl=shell.querySelector('[data-orbit-title]');
      const positionEl=shell.querySelector('[data-orbit-position]');
      const prevButton=shell.querySelector('[data-orbit-prev]');
      const nextButton=shell.querySelector('[data-orbit-next]');

      const currentPageShell=()=>document.querySelector('.lr-shell,.mm-shell');
      const currentTopbar=()=>document.querySelector('.lr-topbar,.mm-topbar');
      const currentSkip=()=>document.querySelector('.lr-skip,.mm-skip');
      const attachOrbit=()=>{
        const topbar=currentTopbar();
        const pageShell=currentPageShell();
        if(!topbar||!pageShell)return false;
        topbar.insertAdjacentElement('afterend',shell);
        return true;
      };
      if(!attachOrbit())throw new Error('page-shell');

      const spacing=()=>{
        const w=stage.clientWidth||window.innerWidth||320;
        return window.matchMedia('(max-width:720px)').matches?Math.max(150,w*0.54):Math.min(window.innerWidth*0.23,288);
      };

      const cardMarkup=(story,index,offset)=>`<a class="laws-orbital-story__member" style="--o:${offset}" data-orbit-offset="${offset}" href="${story.route}" data-story-index="${index}" data-member-id="${story.memberId}" data-selected="${index===state.index?'true':'false'}" ${index===state.index?'aria-current="page"':''}><small>Story ${story.position} of ${stories.length}</small><strong>${story.label}</strong></a>`;

      const renderMembers=()=>{
        const current=stories[state.index];
        const visible=core.visibleOffsets(state.index,stories.length);
        ring.innerHTML=visible.map(({index,offset})=>cardMarkup(stories[index],index,offset)).join('');
        shell.dataset.selectedMember=current.memberId;
        titleEl.textContent=current.label;
        positionEl.textContent=`Story ${current.position} / ${stories.length}`;
        const prev=state.index>0?stories[state.index-1]:null;
        const next=state.index<stories.length-1?stories[state.index+1]:null;
        prevButton.textContent=`← ${prev?prev.label:'Beginning'}`;
        nextButton.textContent=`${next?next.label:'End'} →`;
        prevButton.setAttribute('aria-disabled',String(!prev));
        nextButton.setAttribute('aria-disabled',String(!next));
      };

      const renderDrag=p=>{
        const cards=[...ring.querySelectorAll('.laws-orbital-story__member')];
        const gap=spacing();
        const mobile=window.matchMedia('(max-width:720px)').matches;
        let closest=null,closestAbs=Infinity;
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
        ring.querySelectorAll('.laws-orbital-story__member').forEach(card=>{
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

      const isPersistentIndex=index=>index>=PERSISTENT_START&&index<=PERSISTENT_END;
      const storyIndexForPath=path=>stories.findIndex(s=>normalizePath(s.route)===normalizePath(path));

      const fetchStoryText=async index=>{
        if(state.cache.has(index))return state.cache.get(index);
        const promise=fetch(stories[index].route,{credentials:'same-origin',headers:{'X-Laws-Orbital-Mount':'1'}})
          .then(r=>{if(!r.ok)throw new Error(`story-fetch-${r.status}`);return r.text()});
        state.cache.set(index,promise);
        try{return await promise}catch(err){state.cache.delete(index);throw err}
      };

      const syncStyles=async doc=>{
        const targets=[...doc.querySelectorAll('link[rel="stylesheet"][href]')].map(source=>new URL(source.getAttribute('href'),location.href));
        const targetPaths=new Set(targets.map(abs=>abs.pathname));
        document.querySelectorAll('link[rel="stylesheet"][href]').forEach(link=>{
          const path=new URL(link.href,location.href).pathname;
          const familyScoped=path.startsWith('/assets/laws-destination/renewal')||path.startsWith('/laws/research/methods-and-models/showroom');
          if(familyScoped&&!targetPaths.has(path))link.remove();
        });
        const existing=new Set([...document.querySelectorAll('link[rel="stylesheet"][href]')].map(link=>new URL(link.href,location.href).pathname));
        const pending=[];
        targets.forEach(abs=>{
          if(existing.has(abs.pathname))return;
          const link=document.createElement('link');
          link.rel='stylesheet';
          link.href=abs.href;
          link.dataset.lawsOrbitalMountedAsset='true';
          pending.push(new Promise(resolve=>{link.onload=resolve;link.onerror=resolve}));
          document.head.appendChild(link);
          existing.add(abs.pathname);
        });
        if(pending.length)await Promise.all(pending);
      };

      const executeScript=src=>new Promise((resolve,reject)=>{
        const abs=new URL(src,location.href);
        if(abs.pathname.endsWith('/laws/orbital-tranche-a0-a3/common-grammar.js'))return resolve();
        const script=document.createElement('script');
        script.src=abs.pathname+abs.search+(abs.search?'&':'?')+`orbitalMount=${++state.mountSerial}`;
        script.async=false;
        script.dataset.lawsOrbitalMountedAsset='true';
        script.onload=()=>{script.remove();resolve()};
        script.onerror=()=>{script.remove();reject(new Error(`script-${abs.pathname}`))};
        document.head.appendChild(script);
      });

      const executeTargetScripts=async doc=>{
        const sources=[...doc.querySelectorAll('head script[src]')].map(script=>script.getAttribute('src')).filter(Boolean);
        for(const src of sources)await executeScript(src);
      };

      const syncRootMetadata=doc=>{
        const target=doc.documentElement;
        const keys=['data-route','data-narrative-route','data-page-family','data-laws-story-sequence','data-laws-orbital-surface','data-laws-orbital-member','data-laws-wrap-policy','data-methods-models-contract','data-canonical-archive','data-source-completeness','data-product-acceptance'];
        keys.forEach(name=>{
          if(target.hasAttribute(name))root.setAttribute(name,target.getAttribute(name));
          else root.removeAttribute(name);
        });
        [...document.body.attributes].filter(a=>a.name.startsWith('data-mm-')).forEach(a=>document.body.removeAttribute(a.name));
        [...doc.body.attributes].filter(a=>a.name.startsWith('data-mm-')).forEach(a=>document.body.setAttribute(a.name,a.value));
        document.title=doc.title;
        const targetCanonical=doc.querySelector('link[rel="canonical"]');
        const canonical=document.querySelector('link[rel="canonical"]');
        if(targetCanonical&&canonical)canonical.href=targetCanonical.href;
      };

      const extractPageNodes=doc=>{
        const pageShell=doc.querySelector('.lr-shell,.mm-shell');
        if(!pageShell)throw new Error('target-shell');
        const skip=doc.querySelector('.lr-skip,.mm-skip');
        return {pageShell,skip};
      };

      const mountStory=async(index,{historyMode='push'}={})=>{
        if(!isPersistentIndex(index))throw new Error('outside-persistent-tranche');
        const text=await fetchStoryText(index);
        const doc=new DOMParser().parseFromString(text,'text/html');
        const targetSequence=Number(doc.documentElement.dataset.lawsStorySequence);
        if(targetSequence!==stories[index].position)throw new Error('target-binding');
        await syncStyles(doc);
        const {pageShell:sourceShell,skip:sourceSkip}=extractPageNodes(doc);
        const newShell=document.importNode(sourceShell,true);
        const newSkip=sourceSkip?document.importNode(sourceSkip,true):null;
        const oldShell=currentPageShell();
        const oldSkip=currentSkip();
        if(!oldShell)throw new Error('current-shell');

        shell.remove();
        if(newSkip){
          if(oldSkip)oldSkip.replaceWith(newSkip);
          else document.body.insertBefore(newSkip,oldShell);
        }else if(oldSkip){oldSkip.remove()}
        oldShell.replaceWith(newShell);
        syncRootMetadata(doc);
        if(!attachOrbit())throw new Error('reattach-orbit');

        state.index=index;
        renderMembers();
        clearDrag();
        root.dataset.lawsOrbitalPersistentState=stories[index].memberId;
        root.dataset.lawsOrbitalDocumentReload='false';
        if(historyMode==='push')history.pushState({lawsStoryIndex:index},'',stories[index].route);
        if(historyMode==='replace')history.replaceState({lawsStoryIndex:index},'',stories[index].route);

        await executeTargetScripts(doc);
        document.querySelectorAll('[data-lr-tabs],.lr-tablist').forEach(el=>{
          el.dataset.orbitalSemanticType='PARALLEL_LENS';
          el.dataset.scientificSequence='false';
        });
        currentPageShell()?.classList.add('laws-orbital-content-enter');
        setTimeout(()=>currentPageShell()?.classList.remove('laws-orbital-content-enter'),320);
        document.dispatchEvent(new CustomEvent('laws:story-mounted',{detail:{index,story:stories[index]}}));
      };

      const commitToIndex=async(targetIndex,{historyMode='push',source='gesture'}={})=>{
        if(state.mounting||targetIndex===state.index)return;
        if(targetIndex<0||targetIndex>=stories.length)return boundary();
        const direction=targetIndex>state.index?1:-1;
        const next=core.stepIndex(state.index,direction,stories.length,'BOUNDED');
        if(next===state.index)return boundary();
        targetIndex=next;
        state.mounting=true;
        stage.classList.remove('is-dragging');
        stage.classList.add('is-settling','is-committing');
        renderDrag(direction>0?-1:1);
        root.dataset.lawsOrbitalTransitionSource=source;
        try{
          if(isPersistentIndex(targetIndex)){
            await Promise.all([fetchStoryText(targetIndex),delay(230)]);
            await mountStory(targetIndex,{historyMode});
          }else{
            await delay(230);
            location.assign(stories[targetIndex].route);
            return;
          }
        }catch(err){
          root.dataset.lawsOrbitalMountError=String(err?.message||err);
          location.assign(stories[targetIndex].route);
          return;
        }finally{
          state.mounting=false;
          stage.classList.remove('is-committing');
        }
      };

      prevButton.addEventListener('click',()=>commitToIndex(state.index-1,{source:'control'}));
      nextButton.addEventListener('click',()=>commitToIndex(state.index+1,{source:'control'}));
      stage.addEventListener('keydown',e=>{
        if(e.key==='ArrowRight'){e.preventDefault();commitToIndex(state.index+1,{source:'keyboard'})}
        if(e.key==='ArrowLeft'){e.preventDefault();commitToIndex(state.index-1,{source:'keyboard'})}
      });

      let wheel=0,cool=false;
      stage.addEventListener('wheel',e=>{
        if(cool||state.mounting)return;
        wheel+=Math.abs(e.deltaX)>Math.abs(e.deltaY)?e.deltaX:e.deltaY;
        if(Math.abs(wheel)>90){
          e.preventDefault();
          cool=true;
          commitToIndex(state.index+(wheel>0?1:-1),{source:'wheel'});
          wheel=0;
          setTimeout(()=>cool=false,600);
        }
      },{passive:false});

      stage.addEventListener('pointerdown',e=>{
        if(state.mounting)return;
        if(e.pointerType==='mouse'&&e.button!==0)return;
        state.drag={id:e.pointerId,startX:e.clientX,startY:e.clientY,lastX:e.clientX,lastT:performance.now(),velocity:0,axis:null,progress:0,moved:false};
        stage.classList.remove('is-settling');
      });
      stage.addEventListener('pointermove',e=>{
        const drag=state.drag;
        if(!drag||drag.id!==e.pointerId||state.mounting)return;
        const dx=e.clientX-drag.startX,dy=e.clientY-drag.startY;
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
        const now=performance.now(),dt=Math.max(1,now-drag.lastT);
        drag.velocity=(e.clientX-drag.lastX)/dt;
        drag.lastX=e.clientX;drag.lastT=now;
        drag.moved=drag.moved||Math.abs(dx)>8;
        drag.progress=core.dragProgress(dx,spacing(),state.index,stories.length);
        renderDrag(drag.progress);
      },{passive:false});

      const finishDrag=(e,cancelled=false)=>{
        const drag=state.drag;
        if(!drag||drag.id!==e.pointerId)return;
        state.drag=null;
        if(drag.axis!=='x')return;
        if(drag.moved)state.suppressClickUntil=performance.now()+650;
        const direction=cancelled?0:core.dragDirection(drag.progress,drag.velocity);
        stage.classList.remove('is-dragging');
        if(direction){
          commitToIndex(state.index+direction,{source:'gesture'});
        }else{
          stage.classList.add('is-settling');
          renderDrag(0);
          setTimeout(clearDrag,240);
        }
      };
      stage.addEventListener('pointerup',e=>finishDrag(e,false));
      stage.addEventListener('pointercancel',e=>finishDrag(e,true));
      stage.addEventListener('lostpointercapture',e=>{if(state.drag&&state.drag.id===e.pointerId)finishDrag(e,true)});
      stage.addEventListener('dragstart',e=>e.preventDefault());

      shell.addEventListener('click',e=>{
        const card=e.target.closest?.('.laws-orbital-story__member');
        if(!card)return;
        const targetIndex=Number(card.dataset.storyIndex);
        if(performance.now()<state.suppressClickUntil){e.preventDefault();e.stopPropagation();return}
        e.preventDefault();
        if(Number.isInteger(targetIndex)&&targetIndex!==state.index)commitToIndex(targetIndex,{source:'card'});
      },true);

      document.addEventListener('click',e=>{
        const anchor=e.target.closest?.('a[href]');
        if(!anchor||shell.contains(anchor)||e.defaultPrevented)return;
        if(e.metaKey||e.ctrlKey||e.shiftKey||e.altKey||anchor.target==='_blank')return;
        const targetIndex=storyIndexForPath(anchor.href);
        if(isPersistentIndex(targetIndex)){
          e.preventDefault();
          commitToIndex(targetIndex,{source:'in-page-link'});
        }
      },true);

      window.addEventListener('popstate',()=>{
        const targetIndex=storyIndexForPath(location.pathname);
        if(isPersistentIndex(targetIndex)&&targetIndex!==state.index){
          commitToIndex(targetIndex,{historyMode:'none',source:'history'});
        }
      });
      window.addEventListener('resize',()=>{
        if(stage.classList.contains('is-dragging')&&state.drag)renderDrag(state.drag.progress);
      },{passive:true});

      renderMembers();
      history.replaceState({lawsStoryIndex:state.index},'',location.pathname+location.search+location.hash);
      root.dataset.lawsOrbitalStoryStatus='ready';
      root.dataset.lawsOrbitalGestureMode='persistent-spatial-state';
      root.dataset.lawsOrbitalPersistentRange='STORY_01_TO_STORY_03';
      root.dataset.lawsOrbitalDocumentReload='false';
      [state.index-1,state.index+1].filter(isPersistentIndex).forEach(index=>fetchStoryText(index).catch(()=>{}));
    })
    .catch(fail);
})(globalThis);
