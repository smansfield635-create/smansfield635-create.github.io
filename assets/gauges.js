/* TNT — /assets/gauges.js
   GEODIAMETRICS GAUGES — DEV AUDIT PANEL + SPEC-RUN DUMP (BGC SUPPORT)
   FULL FILE REPLACEMENT

   PURPOSE:
   - Provide a dev-only audit overlay (U3) + one-click spec-run dump (U4)
   - Show: build token, engine versions, canvas counts, RAF loop count (est), FPS avg/p95/p99, longtasks (if available)
   - Copy JSON report to clipboard

   ACTIVATION (DEV-ONLY):
   - URL: ?audit=1
   - OR localStorage key (NON-gd): cte_audit_v1 = "1"

   RULES:
   - NO new gd_* keys
   - NO external libs
   - MUST NOT change engine behavior (read-only + passive hooks)
*/
(function(){
  "use strict";

  // ---------- dev-only gate ----------
  function qsHas(name){
    try{ return new URLSearchParams(location.search).get(name); }catch(e){ return null; }
  }
  function lsGet(k){ try{ return localStorage.getItem(k); }catch(e){ return null; } }
  function lsSet(k,v){ try{ localStorage.setItem(k,String(v)); }catch(e){} }

  var AUDIT_KEY = "cte_audit_v1"; // allowed (non-gd)
  var enabled = (qsHas("audit")==="1") || (lsGet(AUDIT_KEY)==="1");
  if(!enabled) return;

  // persist if query used
  if(qsHas("audit")==="1") lsSet(AUDIT_KEY,"1");

  // ---------- minimal helpers ----------
  function nowISO(){ try{ return new Date().toISOString(); }catch(e){ return ""; } }
  function clamp(n,a,b){ return Math.max(a, Math.min(b, n)); }
  function px(n){ return (Math.round(n*10)/10); }

  // ---------- RAF counting (dev estimate) ----------
  // We do NOT block RAF. We only count calls.
  var rafCount = 0;
  var _raf = window.requestAnimationFrame;
  if(typeof _raf === "function"){
    window.requestAnimationFrame = function(cb){
      rafCount++;
      return _raf.call(window, cb);
    };
  }

  // ---------- longtask observer ----------
  var longtasks = {count:0, max:0};
  try{
    if(window.PerformanceObserver){
      var po = new PerformanceObserver(function(list){
        var entries = list.getEntries();
        for(var i=0;i<entries.length;i++){
          var d = entries[i].duration || 0;
          longtasks.count++;
          if(d > longtasks.max) longtasks.max = d;
        }
      });
      po.observe({entryTypes:["longtask"]});
    }
  }catch(e){}

  // ---------- FPS + frame stats ----------
  var frames = [];
  var lastTs = 0;

  function pushFrame(dtms){
    frames.push(dtms);
    if(frames.length > 600) frames.shift(); // rolling window
  }

  function pctl(arr, p){
    if(!arr.length) return 0;
    var a = arr.slice(0).sort(function(x,y){return x-y;});
    var idx = Math.floor((p/100) * (a.length-1));
    idx = clamp(idx, 0, a.length-1);
    return a[idx];
  }

  function tick(ts){
    if(!lastTs) lastTs = ts;
    var dt = ts - lastTs;
    lastTs = ts;
    pushFrame(dt);
    _raf.call(window, tick);
  }
  _raf.call(window, tick);

  // ---------- DOM overlay ----------
  function el(tag, cls, txt){
    var e = document.createElement(tag);
    if(cls) e.className = cls;
    if(txt != null) e.textContent = txt;
    return e;
  }

  var panel = el("div","gd_audit");
  panel.style.position = "fixed";
  panel.style.right = "12px";
  panel.style.bottom = "12px";
  panel.style.zIndex = "99999";
  panel.style.maxWidth = "360px";
  panel.style.pointerEvents = "auto";
  panel.style.fontFamily = "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', monospace";
  panel.style.fontSize = "12px";
  panel.style.color = "rgba(255,255,255,.92)";
  panel.style.background = "rgba(0,0,0,.62)";
  panel.style.border = "1px solid rgba(255,255,255,.14)";
  panel.style.borderRadius = "14px";
  panel.style.boxShadow = "0 18px 60px rgba(0,0,0,.55)";
  panel.style.backdropFilter = "blur(8px)";
  panel.style.padding = "10px 10px 8px";

  var title = el("div","gd_audit_t","BGC AUDIT");
  title.style.fontWeight = "900";
  title.style.letterSpacing = ".8px";
  title.style.marginBottom = "6px";
  panel.appendChild(title);

  var body = el("div","gd_audit_b");
  panel.appendChild(body);

  var rowWrap = el("div");
  rowWrap.style.display = "flex";
  rowWrap.style.gap = "8px";
  rowWrap.style.marginTop = "8px";

  function mkBtn(label){
    var b = document.createElement("button");
    b.type = "button";
    b.textContent = label;
    b.style.cursor = "pointer";
    b.style.padding = "8px 10px";
    b.style.borderRadius = "12px";
    b.style.border = "1px solid rgba(255,255,255,.14)";
    b.style.background = "rgba(0,0,0,.22)";
    b.style.color = "rgba(255,255,255,.92)";
    b.style.fontWeight = "900";
    b.style.letterSpacing = ".4px";
    return b;
  }

  var btnSpec = mkBtn("SPEC-RUN");
  var btnCopy = mkBtn("COPY JSON");
  var btnHide = mkBtn("HIDE");

  rowWrap.appendChild(btnSpec);
  rowWrap.appendChild(btnCopy);
  rowWrap.appendChild(btnHide);
  panel.appendChild(rowWrap);

  var note = el("div",null,"dev-only (?audit=1)");
  note.style.opacity = ".75";
  note.style.marginTop = "6px";
  panel.appendChild(note);

  document.body.appendChild(panel);

  // ---------- data collection ----------
  var lastReport = null;

  function getEngineVersions(){
    var bgV = (window.GD_BG && window.GD_BG.version) ? window.GD_BG.version : (window.GD_BG ? "BG_OK" : "BG?");
    var drV = (window.GD_DRAGON && window.GD_DRAGON.version) ? window.GD_DRAGON.version : (window.GD_DRAGON ? "DR_OK" : "DR?");
    var idxV = (window.__GD_BUILD__) ? String(window.__GD_BUILD__) : "IDX_UNKNOWN";
    return {idx: idxV, bg: bgV, dragon: drV};
  }

  function count(sel){
    try{ return document.querySelectorAll(sel).length; }catch(e){ return 0; }
  }

  function estimateFps(){
    if(frames.length < 10) return {avg:0,p95:0,p99:0};
    var avgMs = frames.reduce(function(a,b){return a+b;},0) / frames.length;
    var p95 = pctl(frames,95);
    var p99 = pctl(frames,99);
    return {
      avg: (avgMs>0) ? (1000/avgMs) : 0,
      p95: (p95>0) ? (1000/p95) : 0,
      p99: (p99>0) ? (1000/p99) : 0,
      ms_avg: avgMs,
      ms_p95: p95,
      ms_p99: p99
    };
  }

  function getMem(){
    try{
      if(performance && performance.memory && typeof performance.memory.usedJSHeapSize === "number"){
        return {used: performance.memory.usedJSHeapSize, total: performance.memory.totalJSHeapSize};
      }
    }catch(e){}
    return null;
  }

  function buildReport(scenarioId){
    var v = getEngineVersions();
    var fps = estimateFps();
    var mem = getMem();

    var rep = {
      ts: nowISO(),
      build_token: v.idx,
      page: location.pathname || "/",
      engines: { bg: v.bg, dragon: v.dragon },
      canvas_counts: {
        gd_bg_canvas: count("#gd_bg_canvas"),
        gd_dragon_canvas: count("#gd_dragon_canvas")
      },
      raf_call_count_est: rafCount,
      fps: {
        fps_avg: px(fps.avg),
        fps_p95: px(fps.p95),
        fps_p99: px(fps.p99),
        frame_ms_avg: px(fps.ms_avg),
        frame_ms_p95: px(fps.ms_p95),
        frame_ms_p99: px(fps.ms_p99)
      },
      longtasks: {
        count: longtasks.count,
        max_ms: px(longtasks.max)
      },
      viewport: {
        w: window.innerWidth || 0,
        h: window.innerHeight || 0,
        dpr: (function(){ try{ return window.devicePixelRatio||1; }catch(e){ return 1; } })()
      },
      memory: mem ? { used_bytes: mem.used, total_bytes: mem.total } : "UNKNOWN",
      scenario_id: scenarioId || "MANUAL_SPEC_RUN"
    };
    return rep;
  }

  function renderPanel(){
    var v = getEngineVersions();
    var fps = estimateFps();

    var lines = [];
    lines.push("IDX: " + v.idx);
    lines.push("BG : " + v.bg);
    lines.push("DR : " + v.dragon);
    lines.push("CANVAS bg/dr: " + count("#gd_bg_canvas") + " / " + count("#gd_dragon_canvas"));
    lines.push("FPS avg/p95/p99: " + px(fps.avg) + " / " + px(fps.p95) + " / " + px(fps.p99));
    lines.push("ms  avg/p95/p99: " + px(fps.ms_avg) + " / " + px(fps.ms_p95) + " / " + px(fps.ms_p99));
    lines.push("Longtasks c/max: " + longtasks.count + " / " + px(longtasks.max));
    lines.push("RAF calls est: " + rafCount);

    body.innerHTML = "";
    for(var i=0;i<lines.length;i++){
      var r = el("div",null,lines[i]);
      r.style.whiteSpace = "nowrap";
      r.style.overflow = "hidden";
      r.style.textOverflow = "ellipsis";
      r.style.opacity = (i<3) ? "1" : ".88";
      body.appendChild(r);
    }
  }

  // refresh UI
  setInterval(renderPanel, 500);

  // ---------- clipboard helpers ----------
  function copyText(txt){
    try{
      if(navigator.clipboard && navigator.clipboard.writeText){
        return navigator.clipboard.writeText(txt);
      }
    }catch(e){}
    try{
      var ta = document.createElement("textarea");
      ta.value = txt;
      ta.style.position = "fixed";
      ta.style.left = "-9999px";
      document.body.appendChild(ta);
      ta.focus();
      ta.select();
      document.execCommand("copy");
      ta.remove();
    }catch(e){}
    return Promise.resolve();
  }

  // ---------- buttons ----------
  btnSpec.addEventListener("click", function(){
    lastReport = buildReport("SPEC_RUN_BUTTON");
    copyText(JSON.stringify(lastReport, null, 2));
    note.textContent = "SPEC-RUN copied (" + nowISO() + ")";
  }, {passive:true});

  btnCopy.addEventListener("click", function(){
    if(!lastReport) lastReport = buildReport("COPY_JSON");
    copyText(JSON.stringify(lastReport, null, 2));
    note.textContent = "JSON copied (" + nowISO() + ")";
  }, {passive:true});

  btnHide.addEventListener("click", function(){
    panel.remove();
  }, {passive:true});

})();
