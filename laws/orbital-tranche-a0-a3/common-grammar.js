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

  const MANIFEST='/laws/orbital-tranche-a0-a3/manifest.v1.json';
  const CALIBRATION_START=0;
  const CALIBRATION_END=1;
  const delay=ms=>new Promise(resolve=>setTimeout(resolve,ms));
  const normalizePath=value=>{
    try{return new URL(value,location.href).pathname.replace(/\/+/g,'/')}catch{return value||''}
  };
  const fail=err=>{
    root.dataset.lawsOrbitalStoryStatus='fail-closed';
    if(err)root.dataset.lawsOrbitalFailure=String(err?.message||err);
  };

  fetch(MANIFEST,{credentials:'same-origin'})
    .then(r=>{if(!r.ok)throw new Error('manifest');return r.json()})
    .then(m=>{
      if(m.surface?.semanticType!=='NARRATIVE_SEQUENCE'||m.surface?.wrapPolicy!=='BOUNDED')throw new Error('surface');
      const stories=m.stories||[];
      const initialIndex=initialSequence-1;
      if(!stories[initialIndex]||stories[initialIndex].position!==initialSequence)throw new Error('binding');

      const isCalibration=index=>index>=CALIBRATION_START&&index<=CALIBRATION_END;
      const storyIndexForPath=path=>stories.findIndex(s=>normalizePath(s.route)===normalizePath(path));
      const currentPageShell=()=>document.querySelector('.lr-shell,.mm-shell');
      const currentTopbar=()=>document.querySelector('.lr-topbar,.mm-topbar');
      const currentSkip=()=>document.querySelector('.lr-skip,.mm-skip');
      const currentMain=()=>currentPageShell()?.querySelector('main');

      const state={
        index:initialIndex,
        mounting:false,
        drag:null,
        suppressClickUntil:0,
        cache:new Map(),
        docs:new Map(),
        scenes:new Map(),
        viewport:null
      };

      const shell=document.createElement('section');
      shell.className='laws-orbital-story';
      shell.dataset.orbitalSurface=m.surface.surfaceId;
      shell.dataset.semanticType=m.surface.semanticType;
      shell.dataset.wrapPolicy=m.surface.wrapPolicy;
      shell.setAttribute('aria-label','Laws narrative orbit');
      shell.innerHTML=`<header class="laws-orbital-story__head"><div><p class="laws-orbital-story__eyebrow">Laws · canonical narrative</p><h2 data-orbit-title></h2></div><p class="laws-orbital-story__position" data-orbit-position></p></header><div class="laws-orbital-story__stage" tabindex="0" aria-describedby="laws-orbital-cue"><div class="laws-orbital-story__ring"></div></div><div class="laws-orbital-story__controls"><button class="laws-orbital-story__control" type="button" data-orbit-prev></button><span class="laws-orbital-story__cue" id="laws-orbital-cue">Drag the story field · page moves with your hand</span><button class="laws-orbital-story__control" type="button" data-orbit-next></button></div>`;

      const stage=shell.querySelector('.laws-orbital-story__stage');
      const ring=shell.querySelector('.laws-orbital-story__ring');
      const titleEl=shell.querySelector('[data-orbit-title]');
      const positionEl=shell.querySelector('[data-orbit-position]');
      const prevButton=shell.querySelector('[data-orbit-prev]');
      const nextButton=shell.querySelector('[data-orbit-next]');

      const attachOrbit=()=>{
        const topbar=currentTopbar();
        if(!topbar)return false;
        topbar.insertAdjacentElement('afterend',shell);
        return true;
      };
      if(!attachOrbit())throw new Error('page-shell');

      const setupSceneViewport=()=>{
        if(!isCalibration(state.index))return;
        const main=currentMain();
        if(!main)throw new Error('main');
        const viewport=document.createElement('div');
        viewport.className='laws-orbital-scene-viewport';
        viewport.dataset.lawsSpatialViewport='A1_A2_CALIBRATION';
        const scene=document.createElement('div');
        scene.className='laws-orbital-scene is-current';
        scene.dataset.storyIndex=String(state.index);
        main.parentNode.insertBefore(viewport,main);
        scene.appendChild(main);
        viewport.appendChild(scene);
        state.viewport=viewport;
        state.scenes.set(state.index,{node:scene,doc:null});
      };
      setupSceneViewport();

      const spacing=()=>{
        const w=stage.clientWidth||window.innerWidth||320;
        return window.matchMedia('(max-width:720px)').matches?Math.max(150,w*0.54):Math.min(window.innerWidth*0.23,288);
      };

      const cardMarkup=(story,index,offset)=>`<a class="laws-orbital-story__member" style="--o:${offset}" data-orbit-offset="${offset}" href="${story.route}" data-story-index="${index}" data-member-id="${story.memberId}" data-selected="${index===state.index?'true':'false'}" ${index===state.index?'aria-current="page"':''}><small>Story ${story.position} of ${stories.length}</small><strong>${story.label}</strong></a>`;

      const renderMembers=()=>{
        const current=stories[state.index];
        ring.innerHTML=core.visibleOffsets(state.index,stories.length).map(({index,offset})=>cardMarkup(stories[index],index,offset)).join('');
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

      const fetchStoryText=async index=>{
        if(state.cache.has(index))return state.cache.get(index);
        const promise=fetch(stories[index].route,{credentials:'same-origin'})
          .then(r=>{if(!r.ok)throw new Error(`story-fetch-${r.status}`);return r.text()});
        state.cache.set(index,promise);
        try{return await promise}catch(err){state.cache.delete(index);throw err}
      };

      const parseStory=async index=>{
        if(state.docs.has(index))return state.docs.get(index);
        const text=await fetchStoryText(index);
        const doc=new DOMParser().parseFromString(text,'text/html');
        if(Number(doc.documentElement.dataset.lawsStorySequence)!==stories[index].position)throw new Error('target-binding');
        state.docs.set(index,doc);
        return doc;
      };

      const prepareScene=async index=>{
        if(!state.viewport||!isCalibration(index)||state.scenes.has(index))return state.scenes.get(index)||null;
        const doc=await parseStory(index);
        const sourceMain=doc.querySelector('main');
        if(!sourceMain)throw new Error('target-main');
        const scene=document.createElement('div');
        scene.className='laws-orbital-scene';
        scene.dataset.storyIndex=String(index);
        scene.appendChild(document.importNode(sourceMain,true));
        state.viewport.appendChild(scene);
        const record={node:scene,doc};
        state.scenes.set(index,record);
        layoutScenes(0);
        return record;
      };

      const layoutScenes=(progress=0,settling=false)=>{
        if(!state.viewport)return;
        state.viewport.classList.toggle('is-settling',settling);
        state.scenes.forEach((record,index)=>{
          const offset=(index-state.index)+progress;
          record.node.style.transform=`translate3d(${offset*100}%,0,0) scale(${Math.max(.965,1-Math.abs(offset)*.018)})`;
          record.node.style.opacity=String(Math.max(.48,1-Math.abs(offset)*.28));
          record.node.style.pointerEvents=Math.abs(offset)<.01?'auto':'none';
          record.node.setAttribute('aria-hidden',Math.abs(offset)<.01?'false':'true');
        });
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
        if(state.viewport)layoutScenes(p,false);
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
        if(state.viewport){state.viewport.classList.remove('is-dragging','is-settling');layoutScenes(0,false)}
      };

      const boundary=()=>{
        shell.classList.remove('is-boundary');
        void shell.offsetWidth;
        shell.classList.add('is-boundary');
      };

      const executeRenewal=()=>new Promise((resolve,reject)=>{
        const script=document.createElement('script');
        script.src=`/assets/laws-destination/renewal.js?v=LAWS_COMPLETE_RENEWAL_COLLAPSIBLE_NAVIGATION_V1&orbitalMount=${Date.now()}`;
        script.onload=()=>{script.remove();resolve()};
        script.onerror=()=>{script.remove();reject(new Error('renewal-runtime'))};
        document.head.appendChild(script);
      });

      const syncMetadata=doc=>{
        const target=doc.documentElement;
        ['data-route','data-narrative-route','data-page-family','data-laws-story-sequence','data-laws-orbital-surface','data-laws-orbital-member','data-laws-wrap-policy'].forEach(name=>{
          if(target.hasAttribute(name))root.setAttribute(name,target.getAttribute(name));
          else root.removeAttribute(name);
        });
        document.title=doc.title;
        const targetCanonical=doc.querySelector('link[rel="canonical"]');
        const canonical=document.querySelector('link[rel="canonical"]');
        if(targetCanonical&&canonical)canonical.href=targetCanonical.href;
      };

      const promoteCalibrationScene=async(index,{historyMode='push'}={})=>{
        const record=await prepareScene(index);
        const doc=record?.doc||await parseStory(index);
        const sourceTopbar=doc.querySelector('.lr-topbar');
        const sourceSkip=doc.querySelector('.lr-skip');
        if(!sourceTopbar)throw new Error('target-topbar');
        const oldTopbar=currentTopbar();
        if(!oldTopbar)throw new Error('current-topbar');
        oldTopbar.replaceWith(document.importNode(sourceTopbar,true));
        const oldSkip=currentSkip();
        if(sourceSkip){
          const newSkip=document.importNode(sourceSkip,true);
          if(oldSkip)oldSkip.replaceWith(newSkip);
          else document.body.insertBefore(newSkip,currentPageShell());
        }
        syncMetadata(doc);
        state.index=index;
        state.scenes.forEach((entry,sceneIndex)=>{
          if(sceneIndex===index){
            entry.node.classList.add('is-current');
            entry.node.style.position='relative';
          }else{
            entry.node.remove();
            state.scenes.delete(sceneIndex);
          }
        });
        layoutScenes(0,false);
        renderMembers();
        clearDrag();
        if(historyMode==='push')history.pushState({lawsStoryIndex:index},'',stories[index].route);
        if(historyMode==='replace')history.replaceState({lawsStoryIndex:index},'',stories[index].route);
        root.dataset.lawsOrbitalPersistentState=stories[index].memberId;
        root.dataset.lawsOrbitalDocumentReload='false';
        root.dataset.lawsOrbitalSceneCommit='in-document';
        await executeRenewal();
        document.querySelectorAll('[data-lr-tabs],.lr-tablist').forEach(el=>{
          el.dataset.orbitalSemanticType='PARALLEL_LENS';
          el.dataset.scientificSequence='false';
        });
        const neighbor=index===0?1:0;
        prepareScene(neighbor).catch(()=>{});
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
        if(state.viewport)state.viewport.classList.add('is-settling');
        root.dataset.lawsOrbitalTransitionSource=source;
        try{
          if(isCalibration(state.index)&&isCalibration(targetIndex)){
            await prepareScene(targetIndex);
            renderDrag(direction>0?-1:1);
            layoutScenes(direction>0?-1:1,true);
            await delay(280);
            await promoteCalibrationScene(targetIndex,{historyMode});
          }else{
            renderDrag(direction>0?-1:1);
            await delay(240);
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
        if(state.viewport)state.viewport.classList.remove('is-settling');
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
            if(state.viewport)state.viewport.classList.add('is-dragging');
            const candidate=dx<0?state.index+1:state.index-1;
            if(isCalibration(state.index)&&isCalibration(candidate))prepareScene(candidate).catch(()=>{});
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
        if(state.viewport)state.viewport.classList.remove('is-dragging');
        if(direction){
          commitToIndex(state.index+direction,{source:'gesture'});
        }else{
          stage.classList.add('is-settling');
          if(state.viewport)state.viewport.classList.add('is-settling');
          renderDrag(0);
          setTimeout(clearDrag,280);
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
        if(isCalibration(state.index)&&isCalibration(targetIndex)){
          e.preventDefault();
          commitToIndex(targetIndex,{source:'in-page-link'});
        }
      },true);

      window.addEventListener('popstate',()=>{
        const targetIndex=storyIndexForPath(location.pathname);
        if(isCalibration(state.index)&&isCalibration(targetIndex)&&targetIndex!==state.index){
          commitToIndex(targetIndex,{historyMode:'none',source:'history'});
        }
      });

      window.addEventListener('resize',()=>{
        if(stage.classList.contains('is-dragging')&&state.drag)renderDrag(state.drag.progress);
      },{passive:true});

      renderMembers();
      history.replaceState({lawsStoryIndex:state.index},'',location.pathname+location.search+location.hash);
      root.dataset.lawsOrbitalStoryStatus='ready';
      root.dataset.lawsOrbitalGestureMode=isCalibration(state.index)?'A1_A2_FULL_SCENE_DRAG':'ORBIT_STAGE_ONLY';
      root.dataset.lawsOrbitalPersistentRange='STORY_01_TO_STORY_02';
      root.dataset.lawsOrbitalDocumentReload='false';
      if(isCalibration(state.index)){
        const neighbor=state.index===0?1:0;
        prepareScene(neighbor).then(()=>{root.dataset.lawsOrbitalNeighborScene='ready'}).catch(()=>{root.dataset.lawsOrbitalNeighborScene='unavailable'});
      }
    })
    .catch(fail);
})(globalThis);
