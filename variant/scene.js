(function(){
  "use strict";

  const PAGE = document.body.dataset.page || "index";
  const canvas = document.getElementById("bgCanvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d", { alpha:true });

  const FACE_DEFS = [
    { key:"N",  label:{en:"Governance",zh:"治理",es:"Gobernanza"}, code:"N",  route:"/governance/",          rx: 58, ry:   0 },
    { key:"E",  label:{en:"Finance",zh:"金融",es:"Finanzas"},      code:"E",  route:"/finance/",             rx:  0, ry:  90 },
    { key:"S",  label:{en:"Energy",zh:"能源",es:"Energía"},       code:"S",  route:"/energy/",              rx:-58, ry:   0 },
    { key:"W",  label:{en:"Medical",zh:"医疗",es:"Médico"},       code:"W",  route:"/medical/",             rx:  0, ry: -90 },

    { key:"NSTAR", label:{en:"Verification",zh:"核验",es:"Verificación"}, code:"N★", route:"/verification/",    rx: 58, ry:  90 },
    { key:"ESTAR", label:{en:"Software",zh:"软件",es:"Software"},          code:"E★", route:"/software/",        rx:  0, ry:  45 },
    { key:"SSTAR", label:{en:"Education",zh:"教育",es:"Educación"},        code:"S★", route:"/education/",       rx:-58, ry: -90 },
    { key:"WSTAR", label:{en:"Gauges",zh:"量规",es:"Medidores"},           code:"W★", route:"/gauges/",          rx:  0, ry:-135 },

    { key:"NE", label:{en:"Gov × Fin",zh:"治理×金融",es:"Gob × Fin"},      code:"NE", route:"/governance-finance/", rx: 30, ry:  45 },
    { key:"NW", label:{en:"Gov × Med",zh:"治理×医疗",es:"Gob × Med"},      code:"NW", route:"/governance-medical/", rx: 30, ry: -45 },
    { key:"SE", label:{en:"Fin × Energy",zh:"金融×能源",es:"Fin × Energía"}, code:"SE", route:"/finance-energy/", rx:-30, ry: 135 },
    { key:"SW", label:{en:"Energy × Med",zh:"能源×医疗",es:"Energía × Méd"}, code:"SW", route:"/energy-medical/", rx:-30, ry:-135 }
  ];

  const state = {
    tick: 0,
    spinning: true,
    rotX: -18,
    rotY: 0,
    targetRotX: -18,
    targetRotY: 0,
    selected: null,
    lang: (new URLSearchParams(location.search).get("lang") || localStorage.getItem("gd_lang") || "en")
  };

  let polyObject = null;
  let faceMap = new Map();

  function resize(){
    const dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
    canvas.width = Math.floor(window.innerWidth * dpr);
    canvas.height = Math.floor(window.innerHeight * dpr);
    canvas.style.width = window.innerWidth + "px";
    canvas.style.height = window.innerHeight + "px";
    ctx.setTransform(dpr,0,0,dpr,0,0);
  }

  function drawBg(w,h,t){
    const g = ctx.createLinearGradient(0,0,0,h);
    g.addColorStop(0,"#260b0b");
    g.addColorStop(0.30,"#7d1d15");
    g.addColorStop(0.68,"#d34e24");
    g.addColorStop(1,"#41130e");
    ctx.fillStyle = g;
    ctx.fillRect(0,0,w,h);

    const rg = ctx.createRadialGradient(w*0.52,h*0.35,0,w*0.52,h*0.35,Math.max(w,h)*0.72);
    rg.addColorStop(0,"rgba(255,228,180,0.18)");
    rg.addColorStop(0.30,"rgba(255,195,120,0.07)");
    rg.addColorStop(1,"rgba(0,0,0,0)");
    ctx.fillStyle = rg;
    ctx.fillRect(0,0,w,h);

    const moonX = w * 0.80;
    const moonY = h * 0.18;
    const moonR = Math.max(22, Math.min(w,h) * 0.034);

    const glow = ctx.createRadialGradient(moonX,moonY,0,moonX,moonY,moonR*2.6);
    glow.addColorStop(0,"rgba(255,245,215,.42)");
    glow.addColorStop(0.45,"rgba(255,228,170,.18)");
    glow.addColorStop(1,"rgba(255,220,170,0)");
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(moonX,moonY,moonR*2.6,0,Math.PI*2);
    ctx.fill();

    ctx.fillStyle = "rgba(220,220,205,.95)";
    ctx.beginPath();
    ctx.arc(moonX,moonY,moonR,0,Math.PI*2);
    ctx.fill();

    const y0 = h * 0.78;
    const wg = ctx.createLinearGradient(0,y0,0,h);
    wg.addColorStop(0,"rgba(255,225,185,.06)");
    wg.addColorStop(0.5,"rgba(230,175,128,.12)");
    wg.addColorStop(1,"rgba(90,30,18,.24)");
    ctx.fillStyle = wg;
    ctx.fillRect(0,y0,w,h-y0);

    for(let row=0; row<5; row++){
      const yy = y0 + row*18;
      ctx.beginPath();
      for(let x=0; x<=w; x+=12){
        const y = yy + Math.sin(x*0.015 + t*0.9 + row*0.5) * (5 + row*1.8);
        if(x===0) ctx.moveTo(x,y);
        else ctx.lineTo(x,y);
      }
      ctx.strokeStyle = "rgba(255,235,210," + (0.05 + row*0.02) + ")";
      ctx.lineWidth = 1.1;
      ctx.stroke();
    }
  }

  function buildPolyhedron(){
    if (PAGE !== "index") return;
    const mount = document.getElementById("polyObject");
    if (!mount) return;
    polyObject = mount;
    mount.innerHTML = "";
    faceMap.clear();

    FACE_DEFS.forEach(function(face){
      const el = document.createElement("button");
      el.type = "button";
      el.className = "face";
      el.dataset.key = face.key;
      el.innerHTML =
        '<div class="face-shell"></div>' +
        '<div class="face-label">' +
          '<div class="face-word"></div>' +
          '<div class="face-code">' + face.code + '</div>' +
        '</div>';

      const shell = el.querySelector(".face-shell");
      const label = el.querySelector(".face-word");
      label.textContent = face.label[state.lang] || face.label.en;

      const z = 142;
      el.style.transform =
        "translate(-50%,-50%) rotateY(" + face.ry + "deg) rotateX(" + face.rx + "deg) translateZ(" + z + "px)";

      el.addEventListener("click", function(){
        onFaceClick(face, el);
      });

      mount.appendChild(el);
      faceMap.set(face.key, { data:face, el:el, label:label, shell:shell });
    });
  }

  function updateFaceLabels(){
    faceMap.forEach(function(v){
      v.label.textContent = v.data.label[state.lang] || v.data.label.en;
    });
  }

  function onFaceClick(face, el){
    if (state.selected === face.key){
      window.dispatchEvent(new CustomEvent("dgb:face-enter", { detail:{ face:face } }));
      return;
    }

    state.selected = face.key;
    state.spinning = false;
    state.targetRotX = -face.rx;
    state.targetRotY = -face.ry;

    faceMap.forEach(function(v){
      v.el.classList.toggle("active", v.data.key === face.key);
    });

    window.dispatchEvent(new CustomEvent("dgb:face-focus", { detail:{ face:{
      key:face.key,
      label:face.label[state.lang] || face.label.en,
      route:face.route
    }}}));
  }

  function resume(){
    state.selected = null;
    state.spinning = true;
    faceMap.forEach(function(v){
      v.el.classList.remove("active");
    });
  }

  function stepPoly(){
    if (!polyObject) return;

    if (state.spinning){
      state.rotY += 0.18;
      state.rotX = -16 + Math.sin(state.tick * 0.008) * 6;
      state.targetRotX = state.rotX;
      state.targetRotY = state.rotY;
    }else{
      state.rotX += (state.targetRotX - state.rotX) * 0.10;
      state.rotY += (state.targetRotY - state.rotY) * 0.10;
    }

    polyObject.style.transform =
      "rotateX(" + state.rotX + "deg) rotateY(" + state.rotY + "deg)";
  }

  function frame(){
    state.tick += 1;
    drawBg(window.innerWidth, window.innerHeight, state.tick * 0.012);
    stepPoly();
    requestAnimationFrame(frame);
  }

  window.__DGB_RENDER__ = {
    resume
  };

  window.addEventListener("dgb:update-face-labels", function(e){
    state.lang = e.detail.lang || state.lang;
    updateFaceLabels();
    if (state.selected && faceMap.has(state.selected)){
      const face = faceMap.get(state.selected).data;
      window.dispatchEvent(new CustomEvent("dgb:face-focus", { detail:{ face:{
        key:face.key,
        label:face.label[state.lang] || face.label.en,
        route:face.route
      }}}));
    }
  });

  resize();
  window.addEventListener("resize", resize);
  buildPolyhedron();
  frame();
})();
