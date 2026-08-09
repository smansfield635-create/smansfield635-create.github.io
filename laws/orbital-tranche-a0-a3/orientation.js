(()=>{
  const MANIFEST='/laws/orbital-tranche-a0-a3/manifest.v1.json';
  const root=document.documentElement;
  if(!root||root.dataset.route!='/laws/')return;

  const clamp=(v,min,max)=>Math.max(min,Math.min(max,v));
  const wrap=(i,n)=>((i%n)+n)%n;
  const normalizePath=value=>{
    try{return new URL(value,location.href).pathname.replace(/\/+/g,'/')}catch{return value||''}
  };
  const ensureStyle=href=>{
    const path=new URL(href,location.href).pathname;
    if([...document.querySelectorAll('link[rel="stylesheet"][href]')].some(l=>new URL(l.href,location.href).pathname===path))return;
    const link=document.createElement('link');link.rel='stylesheet';link.href=href;link.dataset.lawsSpatialAsset='true';document.head.appendChild(link);
  };
  const sourceCandidates=route=>{
    const clean=normalizePath(route);
    const out=[clean];
    if(clean.endsWith('/'))out.push(clean.slice(0,-1)+'.html');
    return [...new Set(out)];
  };

  fetch(MANIFEST,{credentials:'same-origin'})
    .then(r=>{if(!r.ok)throw new Error('manifest');return r.json()})
    .then(m=>{
      const nav=m.navigationTopology;
      const stories=m.stories||[];
      const families=nav?.category?.families||[];
      if(nav?.persistentEnvironment?.semanticType!=='PERSISTENT_STAGE'||families.length!==6||stories.length!==24)throw new Error('navigation-contract');

      ensureStyle('/assets/laws-destination/renewal.css?v=LAWS_COMPLETE_RENEWAL_V3');
      ensureStyle('/assets/laws-destination/renewal-navigation.css?v=LAWS_COMPLETE_RENEWAL_COLLAPSIBLE_NAVIGATION_V1');
      ensureStyle('/assets/laws-destination/renewal-batch.css?v=LAWS_COMPLETE_RENEWAL_BATCH_V1');

      const estate=document.querySelector('.laws-estate');
      if(!estate)throw new Error('laws-estate');

      const shell=document.createElement('section');
      shell.className='laws-spatial-environment';
      shell.dataset.semanticType='PERSISTENT_STAGE';
      shell.dataset.navigationModel=nav.model;
      shell.innerHTML=`
        <header class="laws-spatial-environment__head">
          <div>
            <p class="laws-spatial-environment__kicker">Laws · persistent environment</p>
            <h1>One stage. Multiple lawful ways to move.</h1>
          </div>
          <p class="laws-spatial-environment__status" data-stage-status>Loading position…</p>
        </header>

        <section class="laws-spatial-stage" aria-live="polite">
          <header class="laws-spatial-stage__head">
            <div>
              <p class="laws-spatial-stage__meta"><span data-stage-family></span> · <span data-stage-position></span></p>
              <h2 data-stage-title></h2>
            </div>
          </header>
          <div class="laws-spatial-stage__viewport" data-stage-viewport>
            <div class="laws-spatial-stage__content" data-stage-content></div>
          </div>
        </section>

        <section class="laws-category-field" aria-label="Laws category constellation">
          <header class="laws-category-field__head">
            <div>
              <p class="laws-spatial-environment__kicker">Semantic traversal</p>
              <h2>Category constellation</h2>
            </div>
            <p>Drag the constellation to change category focus.</p>
          </header>
          <div class="laws-category-orbit" data-category-orbit tabindex="0" aria-label="Drag between Laws categories">
            <div class="laws-category-orbit__core"><span>RELATED</span><strong data-category-core></strong></div>
            <div class="laws-category-orbit__members" data-category-members></div>
          </div>
          <div class="laws-family-members" data-family-members aria-label="Positions in selected category"></div>
        </section>

        <section class="laws-sequence-context" aria-label="Canonical Laws narrative sequence">
          <div class="laws-sequence-context__copy">
            <p class="laws-spatial-environment__kicker">Narrative traversal</p>
            <strong data-sequence-label></strong>
          </div>
          <div class="laws-sequence-context__controls">
            <button type="button" data-sequence-prev>← Previous</button>
            <div class="laws-sequence-context__track" data-sequence-track aria-hidden="true"></div>
            <button type="button" data-sequence-next>Next →</button>
          </div>
        </section>`;
      estate.insertBefore(shell,estate.firstElementChild);

      const els={
        status:shell.querySelector('[data-stage-status]'),
        stageFamily:shell.querySelector('[data-stage-family]'),
        stagePosition:shell.querySelector('[data-stage-position]'),
        stageTitle:shell.querySelector('[data-stage-title]'),
        stageViewport:shell.querySelector('[data-stage-viewport]'),
        stageContent:shell.querySelector('[data-stage-content]'),
        categoryOrbit:shell.querySelector('[data-category-orbit]'),
        categoryMembers:shell.querySelector('[data-category-members]'),
        categoryCore:shell.querySelector('[data-category-core]'),
        familyMembers:shell.querySelector('[data-family-members]'),
        sequenceLabel:shell.querySelector('[data-sequence-label]'),
        sequenceTrack:shell.querySelector('[data-sequence-track]'),
        sequencePrev:shell.querySelector('[data-sequence-prev]'),
        sequenceNext:shell.querySelector('[data-sequence-next]')
      };

      const familyIndexById=new Map(families.map((f,i)=>[f.id,i]));
      const storyIndexByPosition=new Map(stories.map((s,i)=>[s.position,i]));
      const storyIndexByRoute=new Map(stories.map((s,i)=>[normalizePath(s.route),i]));
      const cache=new Map();
      const mountCache=new Map();
      const state={storyIndex:0,familyIndex:0,familyRotation:0,familyDrag:null,memberFocus:0,memberDrag:null,serial:0};

      const storyFamilyId=story=>story.categoryMembership?.[0]||'';
      const familyStories=family=>family.members.map(p=>stories[storyIndexByPosition.get(p)]).filter(Boolean);
      const parseInitialStory=()=>{
        const q=new URLSearchParams(location.search);
        const n=Number(q.get('story'));
        if(Number.isInteger(n)&&n>=1&&n<=stories.length)return n-1;
        return 0;
      };

      const fetchStory=async story=>{
        if(cache.has(story.memberId))return cache.get(story.memberId);
        const task=(async()=>{
          let lastError=null;
          for(const url of sourceCandidates(story.route)){
            try{
              const r=await fetch(url,{credentials:'same-origin'});
              if(!r.ok){lastError=new Error(`HTTP ${r.status}`);continue}
              const text=await r.text();
              const doc=new DOMParser().parseFromString(text,'text/html');
              const main=doc.querySelector('main');
              if(!main){lastError=new Error('main not found');continue}
              return {doc,main,url};
            }catch(err){lastError=err}
          }
          throw lastError||new Error('story unavailable');
        })();
        cache.set(story.memberId,task);
        try{return await task}catch(err){cache.delete(story.memberId);throw err}
      };

      const hydrateReadingMount=holder=>{
        if(holder.dataset.readingHydrated==='true')return;
        holder.dataset.readingHydrated='true';
        holder.querySelectorAll('[data-lr-tabs]').forEach((group,groupIndex)=>{
          const tablist=group.querySelector('[role="tablist"]');
          const buttons=Array.from(group.querySelectorAll('[role="tab"],.lr-tab'));
          const panels=Array.from(group.querySelectorAll('[role="tabpanel"],.lr-panel'));
          if(!tablist||!buttons.length||buttons.length!==panels.length)return;
          tablist.setAttribute('role','group');
          const collapse=()=>{buttons.forEach(button=>button.setAttribute('aria-expanded','false'));panels.forEach(panel=>{panel.hidden=true;panel.tabIndex=-1})};
          const expand=index=>{collapse();const button=buttons[index],panel=panels[index];if(!button||!panel)return;button.setAttribute('aria-expanded','true');panel.hidden=false;panel.tabIndex=0};
          buttons.forEach((button,index)=>{
            const buttonId=button.id||`laws-stage-reading-${groupIndex}-${index}`;
            const panelId=panels[index].id||`laws-stage-reading-panel-${groupIndex}-${index}`;
            button.id=buttonId;panels[index].id=panelId;button.removeAttribute('role');button.removeAttribute('aria-selected');button.removeAttribute('tabindex');button.setAttribute('aria-controls',panelId);button.setAttribute('aria-expanded','false');panels[index].setAttribute('role','region');panels[index].setAttribute('aria-labelledby',buttonId);
            button.addEventListener('click',()=>{const wasOpen=button.getAttribute('aria-expanded')==='true';collapse();if(!wasOpen)expand(index)});
            button.addEventListener('keydown',event=>{let next=index;if(event.key==='ArrowRight'||event.key==='ArrowDown')next=(index+1)%buttons.length;else if(event.key==='ArrowLeft'||event.key==='ArrowUp')next=(index-1+buttons.length)%buttons.length;else if(event.key==='Home')next=0;else if(event.key==='End')next=buttons.length-1;else return;event.preventDefault();buttons[next]?.focus()});
          });
          collapse();
        });
      };

      const hydrateMethodsMount=async holder=>{
        if(holder.dataset.methodsHydrated==='true')return;
        holder.dataset.methodsHydrated='pending';
        ensureStyle('/laws/research/methods-and-models/showroom.css?v=METHODS_MODELS_DUAL_AXIS_SHOWROOM_V1');
        if(root.dataset.methodsModelsShowroom!=='active')await import('/laws/research/methods-and-models/showroom.js?stage=LAWS_PERSISTENT_STAGE_V2');
        if(root.dataset.methodsModelsEuclideanShowroom!=='active')await import('/laws/research/methods-and-models/showroom-euclidean.js?stage=LAWS_PERSISTENT_STAGE_V2');
        const showroom=holder.querySelector('[data-mm-showroom]');
        if(!showroom||root.dataset.methodsModelsShowroom!=='active'||root.dataset.methodsModelsEuclideanShowroom!=='active'){holder.dataset.methodsHydrated='fail-closed';throw new Error('methods-runtime-not-ready')}
        holder.dataset.methodsHydrated='true';showroom.dataset.lawsStagedInstrument='true';
      };

      const buildStageMount=(story,result)=>{
        const holder=document.createElement('div');holder.className='laws-spatial-stage__mount';holder.dataset.storyMember=story.memberId;holder.dataset.experienceType=story.experienceType||'UNCLASSIFIED';holder.dataset.stageSource=result.url;
        const view=document.createElement('div');view.className=`laws-stage-view ${result.main.className||''}`.trim();
        if(story.experienceType==='MULTI_AXIS_INSTRUMENT'){
          view.classList.add('laws-stage-view--methods');const showroom=result.main.querySelector('[data-mm-showroom]');if(!showroom)throw new Error('methods-showroom-missing');view.replaceChildren(document.importNode(showroom,true));result.main.querySelectorAll('.mm-support').forEach(node=>view.appendChild(document.importNode(node,true)));const dialog=result.doc.querySelector('[data-mm-dialog]');if(dialog)holder.appendChild(document.importNode(dialog,true));
        }else{
          view.classList.add(story.experienceType==='PARALLEL_LENS_READING'?'laws-stage-view--reading':'laws-stage-view--canonical');Array.from(result.main.children).forEach(node=>{if(node.matches?.('.lr-story-nav,.mm-story-nav'))return;view.appendChild(document.importNode(node,true))});
        }
        view.querySelectorAll('.lr-story-nav,.mm-story-nav').forEach(node=>node.remove());holder.prepend(view);if(story.experienceType==='PARALLEL_LENS_READING')hydrateReadingMount(holder);return holder;
      };

      const getStageMount=async story=>{
        if(mountCache.has(story.memberId))return mountCache.get(story.memberId);
        const task=(async()=>{const result=await fetchStory(story);return {holder:buildStageMount(story,result),result,hydrated:false}})();mountCache.set(story.memberId,task);try{return await task}catch(error){mountCache.delete(story.memberId);throw error}
      };

      const renderSequence=()=>{
        const story=stories[state.storyIndex];
        els.sequenceLabel.textContent=`Canonical position ${story.position} of ${stories.length}`;
        els.sequenceTrack.innerHTML=stories.map(s=>`<span data-active="${s.position===story.position?'true':'false'}"></span>`).join('');
        els.sequencePrev.disabled=state.storyIndex===0;
        els.sequenceNext.disabled=state.storyIndex===stories.length-1;
      };

      const renderFamilyOrbit=(rotation=state.familyRotation)=>{
        const step=(Math.PI*2)/families.length;
        const orbitWidth=Math.max(280,els.categoryOrbit.clientWidth||window.innerWidth||320);
        const orbitHeight=Math.max(144,els.categoryOrbit.clientHeight||144);
        const radiusX=Math.max(74,Math.min(orbitWidth*.34,250));
        const radiusY=Math.max(34,Math.min(orbitHeight*.31,78));
        els.categoryMembers.innerHTML='';
        families.forEach((family,i)=>{
          const angle=(i-state.familyIndex)*step+rotation;
          const x=Math.sin(angle)*radiusX;
          const y=-Math.cos(angle)*radiusY;
          const depth=(Math.cos(angle)+1)/2;
          const btn=document.createElement('button');
          btn.type='button';
          btn.className='laws-category-orbit__member';
          btn.dataset.family=family.id;
          btn.dataset.front=String(Math.abs(Math.atan2(Math.sin(angle),Math.cos(angle)))<step*.48);
          btn.style.transform=`translate(-50%,-50%) translate(${x}px,${y}px) scale(${.72+depth*.28})`;
          btn.style.opacity=String(.42+depth*.58);
          btn.style.zIndex=String(10+Math.round(depth*20));
          btn.innerHTML=`<small>${family.members.length} positions</small><strong>${family.label}</strong>`;
          btn.addEventListener('click',()=>setFamily(i,{animate:true}));
          els.categoryMembers.appendChild(btn);
        });
        els.categoryCore.textContent=families[state.familyIndex].label;
      };

      const renderFamilyMembers=()=>{
        const family=families[state.familyIndex];
        const members=familyStories(family);
        const activeStory=stories[state.storyIndex];
        const activeWithin=members.findIndex(s=>s.memberId===activeStory.memberId);
        if(activeWithin>=0)state.memberFocus=activeWithin;
        state.memberFocus=clamp(state.memberFocus,0,Math.max(0,members.length-1));
        els.familyMembers.innerHTML=`
          <div class="laws-family-members__viewport" data-member-viewport>
            <div class="laws-family-members__track" data-member-track>
              ${members.map((s,i)=>`<button type="button" data-member-index="${i}" data-member-id="${s.memberId}" data-active="${s.memberId===activeStory.memberId?'true':'false'}"><small>${s.position}</small><strong>${s.label.replace(/^.*? \/ /,'')}</strong></button>`).join('')}
            </div>
          </div>
          <p class="laws-family-members__hint">Swipe these related positions. This does not change canonical order.</p>`;
        const viewport=els.familyMembers.querySelector('[data-member-viewport]');
        const track=els.familyMembers.querySelector('[data-member-track]');
        const renderTrack=(dragPx=0,settling=false)=>{
          const width=viewport.clientWidth||window.innerWidth||320;
          const card=Math.min(280,width*.72);
          const gap=14;
          const center=(width-card)/2;
          const x=center-state.memberFocus*(card+gap)+dragPx;
          track.style.setProperty('--member-card-width',`${card}px`);
          track.style.setProperty('--member-gap',`${gap}px`);
          track.classList.toggle('is-settling',settling);
          track.style.transform=`translate3d(${x}px,0,0)`;
        };
        requestAnimationFrame(()=>renderTrack(0,false));

        track.querySelectorAll('button').forEach(btn=>{
          btn.addEventListener('click',()=>{
            const i=Number(btn.dataset.memberIndex);
            state.memberFocus=i;
            const story=members[i];
            if(story)selectStory(stories.indexOf(story),{historyMode:'push',source:'category'});
          });
        });

        viewport.addEventListener('pointerdown',e=>{
          if(e.pointerType==='mouse'&&e.button!==0)return;
          state.memberDrag={id:e.pointerId,startX:e.clientX,startY:e.clientY,dx:0,axis:null};
        });
        viewport.addEventListener('pointermove',e=>{
          const d=state.memberDrag;if(!d||d.id!==e.pointerId)return;
          const dx=e.clientX-d.startX,dy=e.clientY-d.startY;
          if(!d.axis&&(Math.abs(dx)>6||Math.abs(dy)>6))d.axis=Math.abs(dx)>Math.abs(dy)*1.1?'x':'y';
          if(d.axis!=='x')return;
          e.preventDefault();
          d.dx=dx;
          renderTrack(dx,false);
        },{passive:false});
        const finish=e=>{
          const d=state.memberDrag;if(!d||d.id!==e.pointerId)return;
          state.memberDrag=null;
          if(d.axis!=='x')return;
          const width=viewport.clientWidth||320;
          const threshold=Math.min(54,width*.14);
          let next=state.memberFocus;
          if(d.dx<-threshold)next=Math.min(members.length-1,next+1);
          if(d.dx>threshold)next=Math.max(0,next-1);
          state.memberFocus=next;
          renderTrack(0,true);
          setTimeout(()=>track.classList.remove('is-settling'),260);
          const story=members[next];
          if(story&&story.memberId!==stories[state.storyIndex].memberId)selectStory(stories.indexOf(story),{historyMode:'push',source:'category-swipe'});
        };
        viewport.addEventListener('pointerup',finish);
        viewport.addEventListener('pointercancel',finish);
      };

      const setFamily=(index,{animate=false}={})=>{
        state.familyIndex=wrap(index,families.length);
        state.familyRotation=0;
        state.memberFocus=0;
        shell.classList.toggle('is-family-settling',animate);
        renderFamilyOrbit(0);
        renderFamilyMembers();
        if(animate)setTimeout(()=>shell.classList.remove('is-family-settling'),280);
      };

      const selectStory=async(index,{historyMode='push',source='unknown'}={})=>{
        index=clamp(index,0,stories.length-1);const story=stories[index];const serial=++state.serial;state.storyIndex=index;const familyId=storyFamilyId(story);const fi=familyIndexById.get(familyId);if(Number.isInteger(fi))state.familyIndex=fi;
        shell.dataset.transitionSource=source;shell.classList.add('is-stage-loading');els.status.textContent='Loading staged position…';els.stageFamily.textContent=families[state.familyIndex]?.label||familyId;els.stagePosition.textContent=`Canonical ${story.position} / ${stories.length}`;els.stageTitle.textContent=story.label;renderFamilyOrbit(0);renderFamilyMembers();renderSequence();
        try{
          const record=await getStageMount(story);if(serial!==state.serial)return;const holder=record.holder;holder.classList.remove('is-entered');els.stageContent.replaceChildren(holder);
          if(story.experienceType==='MULTI_AXIS_INSTRUMENT'&&!record.hydrated){await hydrateMethodsMount(holder);record.hydrated=true}
          if(serial!==state.serial)return;requestAnimationFrame(()=>holder.classList.add('is-entered'));els.status.textContent=`${families[state.familyIndex]?.label||familyId} · position ${story.position}`;root.dataset.lawsSpatialActiveStory=story.memberId;root.dataset.lawsSpatialActiveFamily=familyId;root.dataset.lawsSpatialStageSource=record.result.url;root.dataset.lawsSpatialStageLifecycle='retained-mount';
          if(historyMode==='push'){const u=new URL(location.href);u.searchParams.set('story',String(story.position));history.pushState({lawsSpatialStory:story.position},'',u.pathname+u.search+u.hash)}else if(historyMode==='replace'){const u=new URL(location.href);u.searchParams.set('story',String(story.position));history.replaceState({lawsSpatialStory:story.position},'',u.pathname+u.search+u.hash)}
          const currentFamilyMembers=familyStories(families[state.familyIndex]);const mi=currentFamilyMembers.findIndex(s=>s.memberId===story.memberId);if(mi>=0)state.memberFocus=mi;renderFamilyMembers();
        }catch(err){if(serial!==state.serial)return;els.stageContent.innerHTML=`<div class="laws-spatial-stage__error"><strong>${story.label}</strong><p>This canonical view could not be staged in the persistent shell.</p><code>${String(err?.message||err)}</code></div>`;els.status.textContent='Stage source unavailable';root.dataset.lawsSpatialStageError=String(err?.message||err)}finally{if(serial===state.serial)shell.classList.remove('is-stage-loading')}
      };

      els.stageContent.addEventListener('click',e=>{
        const a=e.target.closest?.('a[href]');if(!a)return;
        const idx=storyIndexByRoute.get(normalizePath(a.href));
        if(Number.isInteger(idx)){
          e.preventDefault();
          selectStory(idx,{historyMode:'push',source:'staged-link'});
        }
      });

      els.sequencePrev.addEventListener('click',()=>{if(state.storyIndex>0)selectStory(state.storyIndex-1,{historyMode:'push',source:'sequence'})});
      els.sequenceNext.addEventListener('click',()=>{if(state.storyIndex<stories.length-1)selectStory(state.storyIndex+1,{historyMode:'push',source:'sequence'})});

      els.categoryOrbit.addEventListener('keydown',e=>{
        if(e.key==='ArrowRight'){e.preventDefault();setFamily(state.familyIndex+1,{animate:true})}
        if(e.key==='ArrowLeft'){e.preventDefault();setFamily(state.familyIndex-1,{animate:true})}
      });
      els.categoryOrbit.addEventListener('pointerdown',e=>{
        if(e.pointerType==='mouse'&&e.button!==0)return;
        state.familyDrag={id:e.pointerId,startX:e.clientX,startY:e.clientY,dx:0,axis:null};
        shell.classList.remove('is-family-settling');
      });
      els.categoryOrbit.addEventListener('pointermove',e=>{
        const d=state.familyDrag;if(!d||d.id!==e.pointerId)return;
        const dx=e.clientX-d.startX,dy=e.clientY-d.startY;
        if(!d.axis&&(Math.abs(dx)>6||Math.abs(dy)>6))d.axis=Math.abs(dx)>Math.abs(dy)*1.1?'x':'y';
        if(d.axis!=='x')return;
        e.preventDefault();d.dx=dx;
        const step=(Math.PI*2)/families.length;
        const width=els.categoryOrbit.clientWidth||window.innerWidth||320;
        state.familyRotation=clamp(dx/width*step*2.2,-step*1.35,step*1.35);
        renderFamilyOrbit(state.familyRotation);
      },{passive:false});
      const finishFamily=e=>{
        const d=state.familyDrag;if(!d||d.id!==e.pointerId)return;
        state.familyDrag=null;
        if(d.axis!=='x'){state.familyRotation=0;renderFamilyOrbit(0);return}
        const step=(Math.PI*2)/families.length;
        const shift=Math.round(-state.familyRotation/step);
        setFamily(state.familyIndex+shift,{animate:true});
      };
      els.categoryOrbit.addEventListener('pointerup',finishFamily);
      els.categoryOrbit.addEventListener('pointercancel',finishFamily);

      window.addEventListener('popstate',()=>{
        const q=new URLSearchParams(location.search);
        const n=Number(q.get('story'));
        if(Number.isInteger(n)&&n>=1&&n<=stories.length&&n-1!==state.storyIndex)selectStory(n-1,{historyMode:'none',source:'history'});
      });

      state.storyIndex=parseInitialStory();
      const initialFamily=familyIndexById.get(storyFamilyId(stories[state.storyIndex]));
      state.familyIndex=Number.isInteger(initialFamily)?initialFamily:0;
      root.dataset.lawsSpatialShell='ready';
      root.dataset.lawsOrbitalOrientationStatus='superseded-by-persistent-stage-v2';
      selectStory(state.storyIndex,{historyMode:'replace',source:'initial'});
    })
    .catch(err=>{
      root.dataset.lawsSpatialShell='fail-closed';
      root.dataset.lawsSpatialFailure=String(err?.message||err);
    });
})();
