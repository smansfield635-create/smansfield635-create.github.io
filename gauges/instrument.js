import { read, text, bool } from "./adapter.js";

function row(k,v){
  return `<div class="row"><div class="rk">${k}</div><div class="rv">${v}</div></div>`;
}

function drawMulti(canvas, seriesDefs){
  const ctx=canvas.getContext("2d");
  const w=canvas.width,h=canvas.height;
  ctx.clearRect(0,0,w,h);

  let all=[];
  for(const s of seriesDefs){ all = all.concat(s.data); }
  if(!all.length) return;

  let lo=Math.min(...all), hi=Math.max(...all);
  if(lo===hi){ lo-=1; hi+=1; }
  const span=hi-lo;

  for(const s of seriesDefs){
    ctx.beginPath();
    ctx.strokeStyle=s.color;
    s.data.forEach((v,i)=>{
      const x=(i/(s.data.length-1))*w;
      const y=h-((v-lo)/span)*h;
      if(i===0) ctx.moveTo(x,y);
      else ctx.lineTo(x,y);
    });
    ctx.stroke();
  }
}

export function renderInstrument(receipt){
  const root = document.getElementById("app");

  if(!receipt){
    root.innerHTML = `<div class="wrap">OFFLINE</div>`;
    return;
  }

  const classified = read(["instrument","classifiedState"], receipt);
  const phase = read(["phase"], receipt);
  const fps = read(["diagnosticsPayload","fps"], receipt);
  const age = read(["diagnosticsPayload","ageMs"], receipt);
  const verification = read(["verification","pass"], receipt);

  const history = read(["instrument","displayPayload","history"], receipt) || {};

  root.innerHTML = `
  <div class="wrap">
    <div class="topbar">
      <div class="kpi"><div class="k">State</div><div class="v">${verification ? "LIVE":"OFFLINE"}</div></div>
      <div class="kpi"><div class="k">Classified</div><div class="v">${text(classified)}</div></div>
      <div class="kpi"><div class="k">Phase</div><div class="v">${text(phase)}</div></div>
      <div class="kpi"><div class="k">FPS</div><div class="v">${text(fps)}</div></div>
      <div class="kpi"><div class="k">Age</div><div class="v">${text(age)}</div></div>
    </div>

    <div class="grid">
      <div class="panel">
        <div class="title">Runtime</div>
        ${row("phase",text(phase))}
        ${row("verification",bool(verification))}
      </div>

      <div class="panel">
        <div class="title">Render</div>
        ${row("visible",text(read(["topology","visibleCellCount"],receipt)))}
        ${row("emitted",text(read(["topology","emittedCellCount"],receipt)))}
        ${row("skipped",text(read(["topology","skippedCellCount"],receipt)))}
      </div>

      <div class="panel">
        <div class="title">World</div>
        ${row("variant",text(read(["worldVariantState","variant"],receipt)))}
        ${row("mode",text(read(["worldModeState","mode"],receipt)))}
      </div>
    </div>

    <canvas id="chart1" width="400" height="120"></canvas>
  </div>
  `;

  const chart = document.getElementById("chart1");
  drawMulti(chart,[
    {data: history.fps || [], color:"#7fffd4"}
  ]);
}
