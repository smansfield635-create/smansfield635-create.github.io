/* TNT — /assets/hel-tools.js
   HEL SYSTEM TOOLS — PERMANENT
   BUILD: HEL_TOOLS_v1

   PURPOSE
   - replaces hel-audit
   - replaces hel-report
   - replaces hel-lod
   - replaces runtime-test

   RULE
   This file is SYSTEM TOOLING ONLY.
   It NEVER draws graphics.
   It only observes and reports.

   SAFE
   - no gd_* writes
   - dev tools hidden by default
*/

(function(){

"use strict";

if(window.__HEL_TOOLS__) return;
window.__HEL_TOOLS__ = true;

/* ======================================================
   BASIC SYSTEM STATE
====================================================== */

const HEL_STATE={
version:"HEL_TOOLS_v1",
rafCount:0,
frameTimes:[],
maxFrames:120,
degradeLevel:0
};

/* ======================================================
   RAF MONITOR
====================================================== */

const _raf = window.requestAnimationFrame;

window.requestAnimationFrame=function(fn){

HEL_STATE.rafCount++;

return _raf(function(t){

const start=performance.now();

fn(t);

const dt=performance.now()-start;

HEL_STATE.frameTimes.push(dt);

if(HEL_STATE.frameTimes.length>HEL_STATE.maxFrames){
HEL_STATE.frameTimes.shift();
}

});

};

/* ======================================================
   FPS ESTIMATE
====================================================== */

function estimateFPS(){

if(!HEL_STATE.frameTimes.length) return 0;

let avg=0;

for(let t of HEL_STATE.frameTimes) avg+=t;

avg/=HEL_STATE.frameTimes.length;

return Math.round(1000/avg);

}

/* ======================================================
   REPORT GENERATOR
====================================================== */

function generateReport(){

return {
version:HEL_STATE.version,
rafCount:HEL_STATE.rafCount,
fpsEstimate:estimateFPS(),
framesObserved:HEL_STATE.frameTimes.length,
degradeLevel:HEL_STATE.degradeLevel,
timestamp:Date.now()
};

}

/* ======================================================
   REPORT EXPORT
====================================================== */

function exportReport(){

const data=generateReport();

console.log("HEL REPORT",data);

try{
navigator.clipboard.writeText(JSON.stringify(data,null,2));
}catch(e){}

return data;

}

/* ======================================================
   LOD / DEGRADE CONTROL
====================================================== */

function setDegrade(level){

HEL_STATE.degradeLevel=level;

console.log("HEL LOD SET",level);

}

/* ======================================================
   AUDIT PANEL
====================================================== */

function createAuditPanel(){

const panel=document.createElement("div");

panel.style.position="fixed";
panel.style.right="12px";
panel.style.bottom="12px";
panel.style.background="rgba(0,0,0,.65)";
panel.style.color="#fff";
panel.style.fontSize="12px";
panel.style.padding="10px";
panel.style.borderRadius="8px";
panel.style.zIndex="9999";
panel.style.pointerEvents="none";

panel.id="hel-audit";

document.body.appendChild(panel);

function update(){

const fps=estimateFPS();

panel.textContent=
"HEL TOOLS\n"+
"FPS: "+fps+"\n"+
"RAF: "+HEL_STATE.rafCount+"\n"+
"LOD: "+HEL_STATE.degradeLevel;

requestAnimationFrame(update);

}

update();

}

/* ======================================================
   SPEC RUN
====================================================== */

function specRun(){

const report=generateReport();

console.log("SPEC RUN",report);

return report;

}

/* ======================================================
   GLOBAL API
====================================================== */

window.HEL_TOOLS={
report:exportReport,
specRun:specRun,
setLOD:setDegrade,
audit:createAuditPanel
};

})();
