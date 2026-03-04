/* ============================================================
   GEODIAMETRICS COMPASS ENGINE
   FILE: /assets/compass-engine.js
   PURPOSE:
   - Render compass navigation diamonds
   - Two-layer structure (PER SEAN):
        LAYER 1 → CORE + N + S + E + W  (5 total)
        LAYER 2 → remaining 12 nodes
   - Clean diamond geometry
   - No gd_* drift
   - No animation logic here (handled by other engines)
   ============================================================ */

(function(){

"use strict";

/* ------------------------------------------
   Canvas container
------------------------------------------ */

const compassLayer = document.createElement("div");
compassLayer.style.position = "fixed";
compassLayer.style.top = "0";
compassLayer.style.left = "0";
compassLayer.style.width = "100%";
compassLayer.style.height = "100%";
compassLayer.style.pointerEvents = "none";
compassLayer.style.zIndex = "20";

document.body.appendChild(compassLayer);


/* ------------------------------------------
   Diamond Builder
------------------------------------------ */

function createDiamond(label,x,y,size){

  const d = document.createElement("div");

  d.style.position = "absolute";
  d.style.left = x + "px";
  d.style.top = y + "px";
  d.style.width = size + "px";
  d.style.height = size + "px";

  d.style.transform = "rotate(45deg)";
  d.style.borderRadius = "8px";

  d.style.background =
  "linear-gradient(145deg,#111,#050505)";

  d.style.border =
  "1px solid rgba(212,175,55,.35)";

  d.style.boxShadow =
  "0 0 20px rgba(212,175,55,.25), inset 0 0 20px rgba(0,0,0,.6)";

  d.style.pointerEvents = "auto";
  d.style.cursor = "pointer";

  const text = document.createElement("div");
  text.innerText = label;

  text.style.position = "absolute";
  text.style.transform = "rotate(-45deg)";
  text.style.width = "100%";
  text.style.height = "100%";

  text.style.display = "flex";
  text.style.alignItems = "center";
  text.style.justifyContent = "center";

  text.style.color = "#d4af37";
  text.style.fontWeight = "bold";
  text.style.fontSize = "12px";

  d.appendChild(text);

  compassLayer.appendChild(d);

  return d;
}


/* ------------------------------------------
   Layout
------------------------------------------ */

let currentLayer = 1;

function buildLayer(){

  compassLayer.innerHTML = "";

  const cx = window.innerWidth/2;
  const cy = window.innerHeight/2;

  const spacing = 180;

  if(currentLayer === 1){

    /* CORE */

    createDiamond(
      "CORE",
      cx-70,
      cy-70,
      140
    );

    /* CARDINALS */

    createDiamond("N",cx-40,cy-spacing,80);
    createDiamond("S",cx-40,cy+spacing,80);
    createDiamond("E",cx+spacing,cy-40,80);
    createDiamond("W",cx-spacing,cy-40,80);

  }

  else{

    const nodes = [
      "NE","NW","SE","SW",
      "NNE","NNW","ENE","ESE",
      "SSE","SSW","WSW","WNW"
    ];

    const radius = 260;

    nodes.forEach((label,i)=>{

      const angle = (i/nodes.length)*Math.PI*2;

      const x = cx + Math.cos(angle)*radius;
      const y = cy + Math.sin(angle)*radius;

      createDiamond(label,x-40,y-40,80);

    });

  }

}


/* ------------------------------------------
   Layer Switch UI
------------------------------------------ */

const toggle = document.createElement("div");

toggle.style.position = "fixed";
toggle.style.top = "30px";
toggle.style.right = "40px";
toggle.style.zIndex = "30";
toggle.style.pointerEvents = "auto";

toggle.style.padding = "8px 14px";
toggle.style.background = "#111";
toggle.style.border = "1px solid #d4af37";
toggle.style.color = "#d4af37";
toggle.style.cursor = "pointer";
toggle.style.fontFamily = "monospace";

toggle.innerText = "LAYER 2";

toggle.onclick = function(){

  currentLayer = currentLayer === 1 ? 2 : 1;

  toggle.innerText = currentLayer === 1 ? "LAYER 2" : "LAYER 1";

  buildLayer();

};

document.body.appendChild(toggle);


/* ------------------------------------------
   Init
------------------------------------------ */

buildLayer();

window.addEventListener("resize",buildLayer);

})();
