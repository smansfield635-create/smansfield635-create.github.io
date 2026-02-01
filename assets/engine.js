/* Geodiametrics UI runtime (site-wide)
   - nav active highlighting
   - segmented lens toggles (Human/Scientific/Software-correct)
   - safe, no dependencies
*/

(function(){
  function qs(sel, root=document){ return root.querySelector(sel); }
  function qsa(sel, root=document){ return Array.from(root.querySelectorAll(sel)); }

  function normPath(p){
    try{
      // remove query/hash, normalize trailing slash for folder routes
      p = (p || "/").split("?")[0].split("#")[0];
      if (!p.startsWith("/")) p = "/" + p;
      // treat /home and /home/ same
      if (p.length > 1 && !p.endsWith("/")) p = p + "/";
      return p;
    }catch(e){ return "/"; }
  }

  function setActiveNav(){
    const here = normPath(location.pathname);
    const links = qsa('a.btn[href^="/"]');
    // choose best match by longest prefix
    let best = null;
    let bestLen = 0;

    for (const a of links){
      const href = a.getAttribute("href");
      if (!href) continue;
      const hp = normPath(href);

      // exact match
      if (hp === here && hp.length > bestLen){
        best = a; bestLen = hp.length;
        continue;
      }
      // prefix match for subpages
      if (here.startsWith(hp) && hp.length > bestLen){
        best = a; bestLen = hp.length;
      }
    }

    if (best){
      best.classList.add("is-active");
      best.setAttribute("aria-current","page");
    }
  }

  function wireSegControls(){
    // Expected markup:
    // <div class="seg" data-seg>
    //   <div class="seg-row">
    //     <button class="seg-btn" data-lens="human">Human</button>
    //     <button class="seg-btn" data-lens="scientific">Scientific</button>
    //   </div>
    // </div>
    // <section class="lens" data-lens-pane="human">...</section>
    // <section class="lens" data-lens-pane="scientific" hidden>...</section>

    const segs = qsa('[data-seg]');
    for (const seg of segs){
      const btns = qsa('[data-lens]', seg);
      if (!btns.length) continue;

      // panes can be anywhere on page
      const panes = qsa('[data-lens-pane]');

      function setLens(name){
        // update buttons
        for (const b of btns){
          const on = (b.getAttribute("data-lens") === name);
          b.setAttribute("aria-selected", on ? "true" : "false");
        }
        // update panes
        for (const p of panes){
          const match = (p.getAttribute("data-lens-pane") === name);
          if (match) p.removeAttribute("hidden");
          else p.setAttribute("hidden","hidden");
        }
        // persist per-page
        try{ sessionStorage.setItem("gd_lens", name); }catch(e){}
      }

      // init from sessionStorage or default first button
      let initial = null;
      try{ initial = sessionStorage.getItem("gd_lens"); }catch(e){}
      const defaultName = btns[0].getAttribute("data-lens") || "human";
      const wanted = initial || defaultName;

      // if wanted lens not present, fall back
      const exists = btns.some(b => (b.getAttribute("data-lens") === wanted));
      setLens(exists ? wanted : defaultName);

      // click
      for (const b of btns){
        b.addEventListener("click", (e) => {
          e.preventDefault();
          const name = b.getAttribute("data-lens");
          if (!name) return;
          setLens(name);
        }, {passive:false});
      }
    }
  }

  function preventDeadAnchors(){
    // Make empty href="#" safe; prevent jump to top.
    qsa('a[href="#"]').forEach(a=>{
      a.addEventListener("click",(e)=>e.preventDefault(),{passive:false});
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    setActiveNav();
    wireSegControls();
    preventDeadAnchors();
  });
})();
