(() => {
  "use strict";
  const CONTRACT = "LAWS_FIVE_SCENE_CONTINUITY_CAROUSEL_v1";
  const SCENES = [
    ["identity-meaning", "Identity / Meaning"],
    ["primary-relationship", "Primary Relationship"],
    ["reading-evidence", "Reading / Evidence"],
    ["custody-limits", "Custody / Limits"],
    ["continuation-handoff", "Continuation / Handoff"]
  ];
  document.documentElement.classList.add("lr-js");
  const clamp=(v,a,b)=>Math.min(b,Math.max(a,v));
  const direct = (root, selector) => Array.from(root.children).filter(n => n.matches?.(selector));

  function sourceNodes(root){
    return direct(root,"section,article,aside,div").filter(n =>
      !n.matches("[data-lrc-viewport],[data-lrc-tabs],[data-lrc-continuation],.lr-story-nav,details.lr-audit") &&
      !n.hasAttribute("data-lrc-runtime")
    );
  }

  function makeScene(id,label,index){
    const scene=document.createElement("section");
    scene.dataset.lrcScene=id; scene.dataset.lrcRuntime="true"; scene.id=`lrc-scene-${id}`;
    scene.setAttribute("role","tabpanel"); scene.setAttribute("aria-label",`${label}, ${index+1} of 5`);
    const head=document.createElement("header"); head.dataset.lrcSceneHead="";
    head.innerHTML=`<p data-lrc-scene-count>${String(index+1).padStart(2,"0")} / 05</p><h2></h2>`;
    head.querySelector("h2").textContent=label;
    scene.append(head); return scene;
  }

  function distribute(nodes, scenes){
    if(!nodes.length) return;
    const last = nodes.length - 1;
    nodes.forEach((node,i)=>{
      let target;
      if(i===0) target=0;
      else if(i===1) target=1;
      else if(i===2) target=2;
      else if(i===last && nodes.length>=5) target=4;
      else target=3;
      node.dataset.lrcSourceScene=SCENES[target][0];
      scenes[target].append(node);
    });
    scenes.forEach((scene,i)=>{
      if(scene.children.length===1){
        const note=document.createElement("div"); note.dataset.lrcGeneratedBridge="";
        note.innerHTML=`<p class="lr-depth-label">${SCENES[i][1]}</p><p>This story state is intentionally compact on this route. Continue through the same carousel object for the complete page record.</p>`;
        scene.append(note);
      }
    });
  }

  function createTabs(root,viewport,scenes){
    const nav=document.createElement("nav"); nav.dataset.lrcTabs=""; nav.dataset.lrcRuntime="true";
    nav.setAttribute("aria-label","Story scenes"); nav.setAttribute("role","tablist");
    SCENES.forEach(([id,label],i)=>{
      const b=document.createElement("button"); b.type="button"; b.dataset.lrcTab=String(i); b.setAttribute("role","tab");
      b.setAttribute("aria-controls",scenes[i].id); b.innerHTML=`<span>${String(i+1).padStart(2,"0")}</span><strong></strong>`;
      b.querySelector("strong").textContent=label; nav.append(b);
    });
    viewport.after(nav); return nav;
  }

  function mount(root){
    if(root.dataset.lrcMounted==="true") return;
    const nodes=sourceNodes(root); if(!nodes.length) return;
    const storyNav=root.querySelector(":scope > .lr-story-nav");
    const audit=root.querySelector(":scope > details.lr-audit");
    const viewport=document.createElement("section"); viewport.dataset.lrcViewport=""; viewport.dataset.lrcRuntime="true";
    viewport.tabIndex=0; viewport.setAttribute("aria-roledescription","carousel"); viewport.setAttribute("aria-label","Five-scene Laws story");
    const track=document.createElement("div"); track.dataset.lrcTrack="";
    const scenes=SCENES.map(([id,label],i)=>makeScene(id,label,i)); distribute(nodes,scenes); scenes.forEach(s=>track.append(s)); viewport.append(track);
    root.insertBefore(viewport, root.firstChild);
    const tabs=createTabs(root,viewport,scenes);
    if(storyNav) tabs.after(storyNav);
    if(audit && audit.parentElement===root) root.append(audit);

    let index=clamp(Number(root.dataset.lrcInitial||0)||0,0,4), startX=0,startY=0,pointer=null;
    const buttons=Array.from(tabs.querySelectorAll("[data-lrc-tab]"));
    function render(reason="render"){
      scenes.forEach((scene,i)=>{ const active=i===index; scene.dataset.active=String(active); scene.hidden=!active; scene.setAttribute("aria-hidden",String(!active)); if("inert" in scene) scene.inert=!active; });
      buttons.forEach((b,i)=>{const active=i===index;b.setAttribute("aria-selected",String(active));b.tabIndex=active?0:-1;});
      root.dataset.lrcIndex=String(index); root.dataset.lrcScene=SCENES[index][0]; root.dataset.lrcMounted="true"; root.dataset.lrcSceneCount="5";
      dispatchEvent(new CustomEvent("LAWS_ROOM_CAROUSEL_CHANGED",{detail:Object.freeze({contract:CONTRACT,sceneCount:5,index,sceneId:SCENES[index][0],reason,bottomTabs:true,detachedSixthState:false,storyRouteNavigationExternal:true})}));
    }
    function select(i,reason,focus=false){index=(i+5)%5;render(reason); if(focus) buttons[index].focus({preventScroll:true});}
    tabs.addEventListener("click",e=>{const b=e.target.closest("[data-lrc-tab]");if(b)select(Number(b.dataset.lrcTab),"tab");});
    tabs.addEventListener("keydown",e=>{if(!["ArrowLeft","ArrowRight","Home","End"].includes(e.key))return;e.preventDefault(); if(e.key==="Home")select(0,"home",true); else if(e.key==="End")select(4,"end",true); else select(index+(e.key==="ArrowRight"?1:-1),"tab-key",true);});
    viewport.addEventListener("keydown",e=>{if(e.target.closest("a,button,input,textarea,select"))return;if(e.key==="ArrowLeft"||e.key==="ArrowRight"){e.preventDefault();select(index+(e.key==="ArrowRight"?1:-1),"viewport-key",true);}});
    viewport.addEventListener("pointerdown",e=>{if(e.target.closest("a,button,input,textarea,select,summary"))return;pointer=e.pointerId;startX=e.clientX;startY=e.clientY;viewport.setPointerCapture?.(pointer);});
    viewport.addEventListener("pointerup",e=>{if(pointer!==e.pointerId)return;const dx=e.clientX-startX,dy=e.clientY-startY;pointer=null;if(Math.abs(dx)>=36&&Math.abs(dx)>Math.abs(dy)*1.15)select(index+(dx<0?1:-1),"swipe");});
    viewport.addEventListener("pointercancel",()=>{pointer=null;});
    render("mount");
  }
  const run=()=>document.querySelectorAll("[data-laws-room-carousel]").forEach(mount);
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",run,{once:true});else run();
})();
