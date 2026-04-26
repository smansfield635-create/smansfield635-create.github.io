/* TNT — GAUGES OPTIMAL RUNTIME v1
   OWNER=/gauges/gauges-runtime.js
   MODEL=Single Engine / Deterministic / No Drift
*/

(function () {
  "use strict";

  const scene = document.getElementById("universeScene");
  const hud = document.getElementById("hud");
  if (!scene) return;

  function el(tag, cls) {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    return e;
  }

  function injectStyles() {
    if (document.getElementById("gauges-opt-style")) return;

    const style = document.createElement("style");
    style.id = "gauges-opt-style";

    style.textContent = `
      .sun {
        position:absolute;
        left:7%;
        top:50%;
        width:320px;
        height:320px;
        border-radius:50%;
        transform:translate(-50%,-50%);
        background:
          radial-gradient(circle at 60% 35%,
            #fffbd2 0%,
            #ffd86a 25%,
            #ff9a1f 50%,
            #d13b00 100%);
        box-shadow:
          0 0 50px rgba(255,200,100,.9),
          0 0 140px rgba(255,80,20,.6);
        isolation:isolate;
      }

      .sun::before {
        content:"";
        position:absolute;
        inset:-35%;
        border-radius:50%;
        background:
          radial-gradient(circle, rgba(255,200,120,.4), transparent 70%);
        filter:blur(14px);
        z-index:-1;
      }

      .sun::after {
        content:"";
        position:absolute;
        inset:0;
        border-radius:50%;
        background:
          repeating-radial-gradient(circle,
            rgba(255,255,255,.08) 0 2px,
            transparent 2px 10px),
          conic-gradient(from 0deg,
            rgba(255,255,255,.08),
            rgba(255,200,80,.15),
            rgba(255,90,20,.10),
            transparent 40%);
        mix-blend-mode:screen;
        opacity:.6;
      }

      .orbit {
        position:absolute;
        left:7%;
        top:50%;
        border-radius:50%;
        border:2px solid rgba(180,220,255,.2);
        transform:translate(-50%,-50%) rotate(-13deg);
      }

      .planet {
        position:absolute;
        border-radius:50%;
        transform:translate(-50%,-50%);
        background:radial-gradient(circle at 35% 30%, var(--hi), var(--mid) 55%, var(--low));
        box-shadow:0 0 14px var(--glow);
      }

      .label {
        position:absolute;
        top:calc(100% + 6px);
        left:50%;
        transform:translateX(-50%);
        font-size:10px;
        font-weight:800;
        letter-spacing:.08em;
        color:#dce8ff;
      }
    `;

    document.head.appendChild(style);
  }

  function distance(au) {
    const t = Math.log(1 + au) / Math.log(1 + 30);
    return 120 + t * 520;
  }

  function place(angle, dist) {
    const rawX = Math.cos(angle) * dist;
    const rawY = Math.sin(angle) * dist * 0.44;
    const tilt = -13 * Math.PI / 180;

    return {
      x: rawX * Math.cos(tilt) - rawY * Math.sin(tilt),
      y: rawX * Math.sin(tilt) + rawY * Math.cos(tilt)
    };
  }

  const planets = [
    { n:"Mercury", au:.39, s:14, c:["#d6c6a9","#8c826f","#2d2a25"] },
    { n:"Venus",   au:.72, s:18, c:["#ffe4a3","#c88435","#42210d"] },
    { n:"Earth",   au:1,   s:20, c:["#d9fbff","#187bc2","#041738"] },
    { n:"Mars",    au:1.5, s:16, c:["#ffb083","#b94b28","#36120d"] },
    { n:"Jupiter", au:5.2, s:40, c:["#fff0c8","#b88758","#422819"] },
    { n:"Saturn",  au:9.5, s:36, c:["#fff0bd","#b99b61","#3c2f1a"] }
  ];

  function render() {
    scene.innerHTML = "";

    const sun = el("div","sun");
    scene.appendChild(sun);

    planets.forEach((p,i) => {
      const d = distance(p.au);

      const orbit = el("div","orbit");
      orbit.style.width = (d*2)+"px";
      orbit.style.height = (d*2*0.44)+"px";
      scene.appendChild(orbit);

      const pos = place(i*0.9, d);

      const planet = el("div","planet");
      planet.style.width = p.s+"px";
      planet.style.height = p.s+"px";
      planet.style.left = `calc(7% + ${pos.x}px)`;
      planet.style.top = `calc(50% + ${pos.y}px)`;

      planet.style.setProperty("--hi", p.c[0]);
      planet.style.setProperty("--mid", p.c[1]);
      planet.style.setProperty("--low", p.c[2]);
      planet.style.setProperty("--glow", "rgba(142,197,255,.4)");

      const label = el("div","label");
      label.textContent = p.n;
      planet.appendChild(label);

      scene.appendChild(planet);
    });

    if (hud) {
      hud.innerHTML = "<strong>GAUGES</strong> · HEALTH OPTIMAL · RUNTIME LOCKED";
    }

    console.log("GAUGES=OPTIMAL");
  }

  injectStyles();
  render();

})();
