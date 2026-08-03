(() => {
  "use strict";
  const CONTRACT = "METHODS_MODELS_EUCLIDEAN_SHOWROOM_v3";
  const CAMERA_CONTRACT = "METHODS_MODELS_CAMERA_STATE_v1";
  const familyDefs = [
    ["structure","STRUCTURAL_ENVELOPE_AND_COLLAPSE","Structural Envelope","Structural Envelope and Collapse","What must be present, saturated, and functionally failed before collapse is qualified?",[
      ["envelope-451","451 Structural Envelope","451 = 256 + 192 + 3"],
      ["gate-448","448 Saturation Gate","448 = 256 + 192"],
      ["spine-minimum","E / I / V Minimum Principle","W = min(E, I, V)"],
      ["collapse-qualified","Qualified Collapse Predicate","B256 ∧ P192 ∧ W ≤ ε"],
      ["membrane-61","61 Admissibility Membrane","61 ∉ 451"],
      ["anchors-9","Nine Basin Anchors","9 ∉ 451"]
    ]],
    ["pressure","PRESSURE_CAPACITY_AND_STABILITY","Pressure / Capacity","Pressure, Capacity and Stability","How does pressure relate to usable capacity without hiding a required zero?",[
      ["pressure-field","Pressure Field","Π = G · X"],
      ["capacity-field","Usable Capacity","K = P · R · A · C"],
      ["pcr","Pressure-to-Capacity Ratio","PCR = Π / max(K, εK)"],
      ["stability","Stability Complement","S* = 1 / (1 + PCR)"],
      ["hazard","Hazard Complement","H* = PCR / (1 + PCR)"],
      ["complement","Stability–Hazard Identity","S* + H* = 1"],
      ["zero-aware","Zero-Aware Multiplication","any required zero ⇒ product zero"]
    ]],
    ["closure","CLOSURE_AND_SYSTEM_FLOW","Closure / Flow","Closure and System Flow","What must be accounted for before a system can be called closed?",[
      ["mass-ledger","Industrial Closure Equation","Min = Mout + Mdest + ΔMinv ± ε"],
      ["residual-u","Unaccounted Residual","U = Min − (Mout + Mdest + ΔMinv)"],
      ["closure-threshold","Closure Threshold","closed iff |U| ≤ 3ε"],
      ["energy-loop","Energy Loop Law","storage → release → operate → recover → storage"],
      ["useful-output","Useful Output Condition","useful output ≥ input + losses + reset"]
    ]],
    ["method","METHOD_RESOLUTION_AND_FALSIFICATION","Method / Falsification","Method Resolution and Falsification","How does a method remain reversible, falsifiable, and bounded by evidence?",[
      ["first","F.I.R.S.T. Research Method","Flow → Integrity → Reality → Structure → Test"],
      ["integral-method","Integral Scientific Method","observe → reduce → falsify → iterate → terminate → compress"],
      ["diagnostic-five","Five-Diagnostic Classification Set","C.A.D. · C.T.D. · C.F.D. · I.M.D. · T.D."],
      ["abcd","A–B–C–D Diagnostic Procedure","A → B → C → D"],
      ["falsification","Formal Falsification Path","define → measure → freeze → score → compare"],
      ["no-match","No-Match Discipline","no admissible match ⇒ NO_MATCH"],
      ["fixtures","Synthetic Fixtures","fixture pass ≠ empirical validation"]
    ]]
  ];
  const families = familyDefs.map(([id,instrument,label,title,question,models]) => ({
    id,instrument,label,title,question,
    models: models.map(([id,title,equation]) => ({
      id,title,equation,status: id.includes("61") || id.includes("anchors") || id.includes("448") ? "Source hold" : "Source confirmed",
      statement: `${title} preserves its declared terms, boundaries, and noncompensatory role.`,
      question: `What does ${title} require the reader to preserve?`,
      purpose: `Present ${title} without allowing transformed geometry or nearby controls to obscure its meaning.`,
      architecture: `${title} remains one bounded coordinate inside its declared model family.`,
      operation: `Use ${title} only through its declared variables, state identity, and evidence boundary.`,
      failure: `The model fails its contract when a required term, boundary, or state is omitted or silently compensated.`,
      evidence: `Current nonproduct candidate preserves the existing evidence standing and does not upgrade it.`,
      limits: `This candidate evaluates interaction and visual coherence; it does not establish public acceptance.`,
      lenses: {
        practical: `${title} is presented in plain language on a reading surface outside the transformed stage.`,
        engineering: `${title} is bound to one native X/Y/Z coordinate with stable controls and exact return.`,
        evidence: `${title} retains its existing source standing and explicit limits.`
      }
    }))
  }));
  const root = document.querySelector("[data-mm-showroom]");
  const deck = root.querySelector("[data-mm-model-deck]");
  const familyTabsHost = root.querySelector("[data-mm-family-tabs]");
  const lensButtons = [...root.querySelectorAll("[data-mm-lens-tab]")];
  const support = document.querySelector(".mm-support");
  const dialog = document.querySelector("[data-mm-dialog]");
  const closeButton = document.querySelector("[data-mm-dialog-close]");
  const state = { familyIndex:0, modelIndex:0, lensIndex:0, cameraState:"OVERVIEW", transitionTimer:0, restoreFocus:null, scrollX:0, scrollY:0, inspectionLock:false };
  const lensIds = ["practical","engineering","evidence"];
  const lensTitles = ["Practical","Engineering","Evidence and limits"];
  const normalize = (value,length) => ((value % length) + length) % length;
  const family = () => families[state.familyIndex];
  const model = () => family().models[state.modelIndex];

  function setTransition(axis,direction) {
    clearTimeout(state.transitionTimer);
    root.dataset.mmTransitioning = "true";
    root.dataset.mmTransitionAxis = axis;
    root.dataset.mmTransitionDirection = direction;
    root.dataset.methodTransitionPhase = "TRANSITIONING";
    state.transitionTimer = setTimeout(() => {
      root.dataset.mmTransitioning = "false";
      root.dataset.methodTransitionPhase = "STABLE";
      delete root.dataset.mmTransitionAxis;
      delete root.dataset.mmTransitionDirection;
    }, matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 180);
  }
  function setCamera(next,source="camera") {
    if (!["OVERVIEW","BROWSE"].includes(next)) return;
    if (state.cameraState !== next) setTransition("camera",next.toLowerCase());
    state.cameraState = next;
    root.dataset.mmCamera = next;
    root.dataset.methodCameraState = next;
    document.documentElement.dataset.mmCamera = next;
    root.querySelectorAll("[data-mm-camera-control]").forEach(button => button.setAttribute("aria-pressed",String(button.dataset.mmCameraControl === next)));
    dispatchEvent(new CustomEvent("METHODS_MODELS_CAMERA_STATE_CHANGED",{detail:Object.freeze({contract:CAMERA_CONTRACT,source,cameraState:next,transitionPhase:root.dataset.methodTransitionPhase || "STABLE"})}));
  }
  function positionFor(index,active,length) {
    const forward = normalize(index-active,length), backward = normalize(active-index,length);
    if (forward === 0) return "active";
    if (backward === 1) return "previous";
    if (forward === 1) return "next";
    return "far";
  }
  function renderFamilyTabs() {
    familyTabsHost.replaceChildren(...families.map((entry,index) => {
      const button = document.createElement("button");
      button.type="button"; button.className="mm-family-tab"; button.dataset.familyIndex=String(index); button.dataset.mmControlId=`family-${entry.id}`;
      button.setAttribute("aria-selected",String(index===state.familyIndex)); button.setAttribute("role","tab"); button.tabIndex=index===state.familyIndex?0:-1; button.textContent=entry.label;
      return button;
    }));
  }
  function renderDeck() {
    deck.replaceChildren(...family().models.map((entry,index) => {
      const position = positionFor(index,state.modelIndex,family().models.length);
      const article = document.createElement("article");
      article.className="mm-model-card"; article.dataset.modelId=entry.id; article.dataset.position=position; article.dataset.mmXPosition=position; article.dataset.methodObjectId=entry.id;
      article.setAttribute("aria-hidden",String(position==="far")); article.inert=position!=="active";
      article.innerHTML=`<div class="card-meta"><strong>${String(index+1).padStart(2,"0")} / ${String(family().models.length).padStart(2,"0")}</strong><span>${entry.status}</span></div><h3>${entry.title}</h3><p class="mm-model-card__statement">${position==="active"?`Active coordinate · ${lensTitles[state.lensIndex]}`:"Neighboring model"}</p><button type="button" class="mm-inspect" data-mm-inspect="${entry.id}" data-mm-control-id="inspect-${entry.id}">Inspect model</button>`;
      return article;
    }));
  }
  function renderReading() {
    const active=model();
    document.querySelector("[data-reading-status]").textContent=active.status;
    document.querySelector("[data-reading-title]").textContent=active.title;
    document.querySelector("[data-reading-statement]").textContent=active.statement;
    document.querySelector("[data-reading-equation]").textContent=active.equation;
    document.querySelector("[data-reading-lens-title]").textContent=lensTitles[state.lensIndex];
    document.querySelector("[data-mm-lens-panel]").textContent=active.lenses[lensIds[state.lensIndex]];
    document.querySelector("[data-reading-question]").textContent=active.question;
  }
  function publish(source) {
    const f=family(), m=model();
    Object.assign(root.dataset,{mmX:String(state.modelIndex),mmY:String(state.lensIndex),mmZ:String(state.familyIndex),mmFamily:f.id,mmModel:m.id,mmEuclideanReady:"true",methodCoordinateId:`${f.instrument}__${m.id}__${lensIds[state.lensIndex]}`,methodModelId:m.id,methodLensId:lensIds[state.lensIndex],methodFamilyId:f.instrument,methodDisplayMode:dialog.open?"INSPECTION":"STAGE",methodTransitionPhase:root.dataset.mmTransitioning==="true"?"TRANSITIONING":"STABLE"});
    document.body.dataset.mmFamily=f.id;
    document.querySelector("[data-mm-family-title]").textContent=f.title;
    document.querySelector("[data-mm-family-question]").textContent=f.question;
    document.querySelector("[data-mm-progress]").textContent=`${f.label} · Model ${state.modelIndex+1} of ${f.models.length}`;
    document.querySelector("[data-mm-coordinate-z]").textContent=`Z ${String(state.familyIndex+1).padStart(2,"0")}/04`;
    document.querySelector("[data-mm-coordinate-x]").textContent=`X ${String(state.modelIndex+1).padStart(2,"0")}/${String(f.models.length).padStart(2,"0")}`;
    document.querySelector("[data-mm-coordinate-y]").textContent=`Y ${lensIds[state.lensIndex].toUpperCase()}`;
    lensButtons.forEach((button,index)=>{button.setAttribute("aria-selected",String(index===state.lensIndex));button.tabIndex=index===state.lensIndex?0:-1;});
    dispatchEvent(new CustomEvent("METHODS_MODELS_EUCLIDEAN_STATE_CHANGED",{detail:Object.freeze({contract:CONTRACT,source,x:{index:state.modelIndex,modelId:m.id},y:{index:state.lensIndex,lens:lensIds[state.lensIndex]},z:{index:state.familyIndex,familyId:f.id},camera:state.cameraState,display:dialog.open?"inspection":"expanded",productAcceptanceGranted:false,sourceCompletenessClaimed:false})}));
  }
  function render(source="render") { renderFamilyTabs(); renderDeck(); renderReading(); publish(source); }
  function selectFamily(next,source) { const old=state.familyIndex; state.familyIndex=normalize(next,families.length); state.modelIndex=0; setTransition("z",state.familyIndex>old?"next":"previous"); render(source); }
  function selectModel(next,source) { const old=state.modelIndex; state.modelIndex=normalize(next,family().models.length); state.lensIndex=0; setTransition("x",state.modelIndex>old?"next":"previous"); render(source); }
  function selectLens(next,source) { const old=state.lensIndex; state.lensIndex=normalize(next,lensButtons.length); setTransition("y",state.lensIndex>old?"next":"previous"); renderReading(); publish(source); }

  root.addEventListener("click",event=>{
    const familyButton=event.target.closest("[data-family-index]"); if(familyButton) selectFamily(Number(familyButton.dataset.familyIndex),"family-tab");
    if(event.target.closest("[data-mm-family-previous]")) selectFamily(state.familyIndex-1,"family-previous");
    if(event.target.closest("[data-mm-family-next]")) selectFamily(state.familyIndex+1,"family-next");
    if(event.target.closest("[data-mm-previous]")) selectModel(state.modelIndex-1,"model-previous");
    if(event.target.closest("[data-mm-next]")) selectModel(state.modelIndex+1,"model-next");
    const lensButton=event.target.closest("[data-mm-lens-tab]"); if(lensButton) selectLens(lensButtons.indexOf(lensButton),"lens-tab");
    const cameraButton=event.target.closest("[data-mm-camera-control]"); if(cameraButton) setCamera(cameraButton.dataset.mmCameraControl,"camera-control");
    const inspect=event.target.closest("[data-mm-inspect]"); if(inspect) openInspection(inspect);
  });
  deck.addEventListener("keydown",event=>{
    if(dialog.open)return;
    if(event.key==="ArrowRight"){event.preventDefault();selectModel(state.modelIndex+1,"x-keyboard");}
    if(event.key==="ArrowLeft"){event.preventDefault();selectModel(state.modelIndex-1,"x-keyboard");}
    if(event.key==="ArrowDown"){event.preventDefault();selectLens(state.lensIndex+1,"y-keyboard");}
    if(event.key==="ArrowUp"){event.preventDefault();selectLens(state.lensIndex-1,"y-keyboard");}
    if(event.key==="PageDown"||event.key==="]"){event.preventDefault();selectFamily(state.familyIndex+1,"z-keyboard");}
    if(event.key==="PageUp"||event.key==="["){event.preventDefault();selectFamily(state.familyIndex-1,"z-keyboard");}
  });
  deck.addEventListener("focusin",()=>{if(!state.inspectionLock)setCamera("BROWSE","deck-focus");});
  deck.addEventListener("focusout",event=>{if(!state.inspectionLock&&!deck.contains(event.relatedTarget))setCamera("OVERVIEW","deck-blur");});
  function section(title,content){const node=document.createElement("section");node.innerHTML=`<h3>${title}</h3><p>${content}</p>`;return node;}
  function openInspection(trigger){
    const active=model(); state.restoreFocus=trigger; state.inspectionLock=true; state.scrollX=scrollX; state.scrollY=scrollY;
    document.documentElement.dataset.methodsModelsInspection="open"; root.dataset.methodDisplayMode="INSPECTION"; support.inert=true;
    Object.assign(document.body.style,{position:"fixed",left:"0",right:"0",top:`${-state.scrollY}px`,width:"100%"});
    document.querySelector("[data-mm-dialog-kicker]").textContent=`${family().title} · ${active.status}`;
    document.querySelector("[data-mm-dialog-title]").textContent=active.title;
    document.querySelector("[data-mm-dialog-equation]").textContent=active.equation;
    document.querySelector("[data-mm-dialog-grid]").replaceChildren(section("Purpose",active.purpose),section("Architecture",active.architecture),section("Operation",active.operation),section("Failure behavior",active.failure),section("Evidence standing",active.evidence),section("Limits",active.limits));
    dialog.showModal(); closeButton.focus({preventScroll:true});
  }
  function closeInspection(){if(!dialog.open)return;document.documentElement.dataset.methodsModelsInspection="restoring";dialog.close();}
  closeButton.addEventListener("click",closeInspection);
  dialog.addEventListener("cancel",event=>{event.preventDefault();closeInspection();});
  dialog.addEventListener("close",()=>{
    ["position","left","right","top","width"].forEach(property=>document.body.style.removeProperty(property)); support.inert=false; scrollTo(state.scrollX,state.scrollY);
    root.dataset.methodDisplayMode="STAGE"; document.documentElement.dataset.methodsModelsInspection="closed"; state.inspectionLock=false; state.restoreFocus?.focus({preventScroll:true}); setCamera("BROWSE","inspection-return");
  });
  globalThis.METHODS_MODELS_EUCLIDEAN_SHOWROOM_V3=Object.freeze({contract:CONTRACT,getState:()=>Object.freeze({familyIndex:state.familyIndex,modelIndex:state.modelIndex,lensIndex:state.lensIndex,cameraState:state.cameraState}),moveModel:delta=>selectModel(state.modelIndex+delta,"api-model"),moveLens:delta=>selectLens(state.lensIndex+delta,"api-lens"),moveFamily:delta=>selectFamily(state.familyIndex+delta,"api-family"),setCamera});
  render("initialization"); setCamera("OVERVIEW","initialization");
})();
