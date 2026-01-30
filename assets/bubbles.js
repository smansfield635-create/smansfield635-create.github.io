// FULL REWRITE — /assets/bubbles.js
(() => {
  const $ = (s,r=document)=>r.querySelector(s);
  const $$=(s,r=document)=>Array.from(r.querySelectorAll(s));

  function initTabs(){
    $$("[data-tabs]").forEach(w=>{
      const bs=$$("[role='tab']",w);
      const ps=$$("[role='tabpanel']",w);
      const open=id=>{
        bs.forEach(b=>b.setAttribute("aria-selected", String(b.dataset.tab===id)));
        ps.forEach(p=>p.dataset.open=String(p.dataset.panel===id));
      };
      bs.forEach(b=>b.addEventListener("click",()=>open(b.dataset.tab)));
      const first = bs.find(b=>b.getAttribute("aria-selected")==="true")?.dataset.tab || bs[0]?.dataset.tab;
      if(first) open(first);
    });
  }

  function initModal(){
    const m=$("#bubbleModal"); if(!m) return;
    const t=$("#bmTitle",m), b=$("#bmBody",m), l=$("#bmLinks",m);
    const close=()=>m.dataset.open="false";
    $("#bmClose",m)?.addEventListener("click",close);
    m.addEventListener("click",e=>{ if(e.target===m) close(); });
    document.addEventListener("keydown",e=>{ if(e.key==="Escape") close(); });

    function open(detail){
      t.textContent = detail.title || "?";
      b.innerHTML = (detail.body||"").split("\n").map(x=>`<p>${x}</p>`).join("");
      l.innerHTML = "";
      (detail.links||[]).forEach(x=>{
        const a=document.createElement("a");
        a.className="a"; a.href=x.href; a.textContent=x.label;
        l.appendChild(a);
      });
      m.dataset.open="true";
    }

    // Static bubbles via data-detail
    $$("button.bubble[data-detail]").forEach(btn=>{
      btn.addEventListener("click",()=>{
        try{ open(JSON.parse(btn.dataset.detail)); }
        catch{ open({title:"?", body:"Unavailable."}); }
      });
    });

    // Dynamic bubbles via data-fetch (optional)
    $$("button.bubble[data-fetch]").forEach(btn=>{
      btn.addEventListener("click", async ()=>{
        const url = btn.dataset.fetch;
        try{
          const res = await fetch(url, {cache:"no-store"});
          const j = await res.json();
          open(j);
        }catch{
          open({title:"?", body:"Data unavailable.\nNo verified source present."});
        }
      });
    });
  }

  document.addEventListener("DOMContentLoaded",()=>{ initTabs(); initModal(); });
})();
