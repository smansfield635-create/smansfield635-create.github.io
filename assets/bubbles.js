/* FULL REWRITE — /assets/ui.css */
:root{
  --bg:#070914;
  --fg:#e9eefc;
  --muted:rgba(233,238,252,.7);
  --glass:rgba(12,16,34,.55);
  --stroke:rgba(233,238,252,.14);
  --shadow:0 24px 80px rgba(0,0,0,.65);
  --r:28px;
  --pink:#ff7ac6;
  --blue:#7aa2ff;
  --mint:#5ccfbf;
}
*{box-sizing:border-box}
html,body{margin:0;height:100%}
body{
  color:var(--fg);
  font-family:system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial;
  background:
    radial-gradient(1200px 900px at 20% 10%,rgba(122,162,255,.25),transparent 60%),
    radial-gradient(900px 700px at 80% 20%,rgba(255,122,198,.18),transparent 60%),
    #070914;
  overflow-x:hidden;
}
main{max-width:1100px;margin:0 auto;padding:3rem 1.25rem 5rem}
h1{font-size:2.8rem;margin:.2rem 0}
p{color:var(--muted);line-height:1.65}
.nav{display:flex;gap:.6rem;flex-wrap:wrap;margin:1rem 0}
.nav a{padding:.55rem .9rem;border-radius:999px;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.14);color:#fff;text-decoration:none}
.panel{background:var(--glass);border:1px solid var(--stroke);border-radius:var(--r);box-shadow:var(--shadow);padding:1.25rem}
.tabs{display:flex;gap:.5rem;margin:1rem 0}
.tab{border:0;border-radius:999px;padding:.6rem 1rem;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.14);color:#fff;cursor:pointer}
.tab[aria-selected="true"]{background:rgba(255,255,255,.12)}
.tabpanel{display:none}
.tabpanel[data-open="true"]{display:block}

/* BUBBLES — THE BUTTON IS THE SHAPE */
.bubbles{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:1rem}
.bubble{
  appearance:none;border:0;cursor:pointer;
  width:100%;aspect-ratio:1/1;
  border-radius:999px;
  background:rgba(255,255,255,.08);
  border:1px solid rgba(255,255,255,.18);
  box-shadow:0 18px 60px rgba(0,0,0,.6), inset 0 0 0 1px rgba(255,255,255,.04);
  color:#fff;
  display:flex;align-items:center;justify-content:center;text-align:center;
}
.bubble:hover{transform:translateY(-2px);background:rgba(255,255,255,.12)}
.bubble .t{font-weight:700}
.bubble .s{font-size:.9rem;color:var(--muted)}
.bubble.pink{background:rgba(255,122,198,.14)}
.bubble.blue{background:rgba(122,162,255,.14)}
.bubble.mint{background:rgba(92,207,191,.14)}
.bubble.gray{background:rgba(233,238,252,.08)}

/* MODAL */
.modal{position:fixed;inset:0;display:none;background:rgba(0,0,0,.6);z-index:50}
.modal[data-open="true"]{display:block}
.sheet{position:absolute;left:50%;top:8%;transform:translateX(-50%);width:min(980px,92vw);
  background:rgba(10,14,30,.7);border:1px solid rgba(255,255,255,.18);border-radius:28px;
  box-shadow:0 40px 140px rgba(0,0,0,.75);padding:1.25rem}
.sheet h2{margin:.25rem 0}
.sheet .actions{display:flex;gap:.6rem;flex-wrap:wrap}
.sheet .a{padding:.6rem .9rem;border-radius:999px;background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.18);color:#fff;text-decoration:none}
.x{position:absolute;right:14px;top:14px;width:40px;height:40px;border-radius:12px;border:1px solid rgba(255,255,255,.18);background:rgba(255,255,255,.06);color:#fff;cursor:pointer}
footer{opacity:.6;text-align:center;margin-top:3rem}
