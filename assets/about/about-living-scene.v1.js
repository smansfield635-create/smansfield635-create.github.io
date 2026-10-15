/* Owner-approved About cinematic ambient runtime. Exact bounded scope: persistent hero only. */

(() => {
  const SRC_W = 908, SRC_H = 1313;
  const WATER = { x: 428, y: 905, w: 480, h: 378 };
  const BRIDGE_LIGHTS = [
    {x: 555, y: 1018, h: 45},
    {x: 640, y: 985, h: 52},
    {x: 716, y: 969, h: 48},
    {x: 822, y: 1008, h: 54},
    {x: 765, y: 1132, h: 38}
  ];
  const WATER_MASK = [
    [520, 920], [610, 870], [740, 856], [908, 870], [908, 1313], [430, 1313], [430, 997], [470, 948]
  ];

  'use strict';
  const root = document.documentElement;
  const hero = document.querySelector('.stage > .living-estate');
  if (!hero || hero.querySelector('[data-about-living-scene="v1"]')) return;
  const plane = document.createElement('div');
  plane.dataset.aboutLivingScene = 'v1';
  plane.setAttribute('aria-hidden', 'true');
  Object.assign(plane.style, {
    position:'absolute', inset:'0', zIndex:'1', pointerEvents:'none',
    visibility:'hidden', opacity:'0', overflow:'hidden'
  });
  const planeStyle=document.createElement('style');
  planeStyle.textContent = `
    html[data-film-state="settled"] .stage > .living-estate > [data-about-living-scene="v1"] {
      visibility:visible !important; opacity:1 !important;
    }
    .stage > .living-estate > [data-about-living-scene="v1"] canvas {
      position:absolute; inset:0; width:100%; height:100%;
      pointer-events:none; user-select:none;
    }
    .stage > .living-estate > [data-about-living-scene="v1"] [data-about-layer="fog"] {
      mix-blend-mode:normal;
    }
    .stage > .living-estate > [data-about-living-scene="v1"] [data-about-layer="water"],
    .stage > .living-estate > [data-about-living-scene="v1"] [data-about-layer="sky"],
    .stage > .living-estate > [data-about-living-scene="v1"] [data-about-layer="nebula"] {
      mix-blend-mode:screen;
    }
    @media(min-width:900px) {
      .stage > .living-estate > [data-about-living-scene="v1"] {
        left:auto !important; right:0 !important;
        width:auto !important; height:100% !important;
        aspect-ratio:908/1313;
      }
    }
    @media(prefers-reduced-motion:reduce){
      .stage > .living-estate > [data-about-living-scene="v1"]{display:none !important}
    }
  `;
  document.head.append(planeStyle);
  const canvasFor=(name,mix='screen')=>{
    const el=document.createElement('canvas');
    el.dataset.aboutLayer=name;
    el.setAttribute('aria-hidden','true');
    if(name!=='water'){el.width=908;el.height=1313;}
    plane.append(el);
    return el;
  };
  const canvas=canvasFor('water');
  const fogCanvas=canvasFor('fog');
  const nebulaCanvas=canvasFor('nebula');
  const skyCanvas=canvasFor('sky');
  hero.append(plane);
  const ctx=canvas.getContext('2d');
  const fctx=fogCanvas.getContext('2d', {willReadFrequently:false});
  const nctx=nebulaCanvas.getContext('2d');
  const sctx=skyCanvas.getContext('2d', {willReadFrequently:false});
  if(!ctx || !fctx || !nctx || !sctx){plane.remove();return;}
  const img=new Image();
  img.decoding='async';
  img.crossOrigin='anonymous';
  // Match the exact accepted artwork already referenced by the page CSS.
  // The query tag is for cache continuity, not a new image.
  const artUrl='/assets/about/about-hero-cinematic-20261014.webp?rev=2c85bdc70904';
  const defaults=(value)=>({value,addEventListener(){}});
  const statusEl={textContent:''};
  const intensityEl=defaults('95'), glowEl=defaults('85');
  const fogIntensity=defaults('165'), fogSpeed=defaults('100');
  const starStrengthEl=defaults('155'),nebulaStrengthEl=defaults('105');
  const fogToggle=defaults(''), skyToggle=defaults('');
  const liveBtn=defaults(''),animBtn=defaults(''),nudgeBtn=defaults('');
  const SKY_BOX = {x:395,y:36,w:365,h:425};
  let nebulaSource = null, nebulaFrame = null, nebulaPixels = null;
  let skyLastFrame = 0, nebulaLastFrame = 0;
  function prepNebula(){
    if(!img.complete || !img.naturalWidth) return;
    const c=document.createElement('canvas');c.width=SKY_BOX.w;c.height=SKY_BOX.h;
    const cx=c.getContext('2d',{willReadFrequently:true});
    cx.drawImage(img,SKY_BOX.x,SKY_BOX.y,SKY_BOX.w,SKY_BOX.h,0,0,SKY_BOX.w,SKY_BOX.h);
    nebulaSource=cx.getImageData(0,0,SKY_BOX.w,SKY_BOX.h).data;
    nebulaFrame=nctx.createImageData(SKY_BOX.w,SKY_BOX.h);
    nebulaPixels=nebulaFrame.data;
  }
  img.addEventListener('load',prepNebula);
  if(img.complete && img.naturalWidth)prepNebula();
  const STAR_FIELD = [{"x": 52.0, "y": 171.8, "r": 1.78, "a": 0.4, "p": 4.013, "s": 1.483}, {"x": 146.9, "y": 171.1, "r": 2.03, "a": 0.4, "p": 6.192, "s": 0.627}, {"x": 421.8, "y": 248.8, "r": 1.88, "a": 0.397, "p": 4.954, "s": 0.683}, {"x": 267.7, "y": 1.7, "r": 1.61, "a": 0.376, "p": 0.256, "s": 1.012}, {"x": 434.6, "y": 56.4, "r": 2.22, "a": 0.4, "p": 6.156, "s": 1.243}, {"x": 165.5, "y": 189.9, "r": 2.25, "a": 0.395, "p": 2.489, "s": 1.285}, {"x": 317.5, "y": 108.0, "r": 1.74, "a": 0.359, "p": 3.775, "s": 0.647}, {"x": 67.5, "y": 74.5, "r": 1.58, "a": 0.346, "p": 0.205, "s": 0.772}, {"x": 860.3, "y": 240.3, "r": 1.56, "a": 0.351, "p": 0.034, "s": 1.276}, {"x": 887.8, "y": 192.4, "r": 1.67, "a": 0.349, "p": 3.761, "s": 0.667}, {"x": 405.7, "y": 102.3, "r": 1.43, "a": 0.318, "p": 2.583, "s": 0.69}, {"x": 423.0, "y": 144.5, "r": 1.3, "a": 0.306, "p": 2.225, "s": 0.719}, {"x": 692.8, "y": 30.6, "r": 1.56, "a": 0.314, "p": 2.673, "s": 1.097}, {"x": 620.4, "y": 131.8, "r": 1.91, "a": 0.347, "p": 2.033, "s": 1.075}, {"x": 116.0, "y": 148.5, "r": 1.18, "a": 0.273, "p": 4.235, "s": 0.812}, {"x": 687.9, "y": 198.0, "r": 2.48, "a": 0.369, "p": 6.255, "s": 1.225}, {"x": 454.7, "y": 147.3, "r": 1.26, "a": 0.271, "p": 1.412, "s": 1.231}, {"x": 95.7, "y": 204.3, "r": 1.22, "a": 0.265, "p": 4.912, "s": 0.589}, {"x": 123.0, "y": 267.5, "r": 1.15, "a": 0.264, "p": 1.213, "s": 1.2}, {"x": 872.0, "y": 11.5, "r": 1.15, "a": 0.263, "p": 2.606, "s": 1.06}, {"x": 860.0, "y": 177.5, "r": 1.14, "a": 0.259, "p": 4.179, "s": 1.058}, {"x": 179.0, "y": 111.5, "r": 1.13, "a": 0.25, "p": 3.664, "s": 0.94}, {"x": 202.0, "y": 63.0, "r": 1.03, "a": 0.239, "p": 1.372, "s": 1.355}, {"x": 715.4, "y": 224.8, "r": 1.48, "a": 0.278, "p": 5.342, "s": 1.079}, {"x": 112.5, "y": 24.0, "r": 1.13, "a": 0.242, "p": 2.212, "s": 1.46}, {"x": 319.5, "y": 242.0, "r": 1.28, "a": 0.254, "p": 3.926, "s": 1.277}, {"x": 66.0, "y": 146.5, "r": 1.13, "a": 0.24, "p": 1.668, "s": 1.156}, {"x": 159.0, "y": 91.0, "r": 1.03, "a": 0.239, "p": 0.497, "s": 1.326}, {"x": 611.0, "y": 196.2, "r": 1.31, "a": 0.257, "p": 3.402, "s": 1.189}, {"x": 380.3, "y": 176.3, "r": 1.2, "a": 0.239, "p": 4.478, "s": 0.774}, {"x": 330.5, "y": 258.0, "r": 1.26, "a": 0.248, "p": 2.335, "s": 0.668}, {"x": 715.0, "y": 0.0, "r": 1.03, "a": 0.243, "p": 0.339, "s": 0.774}, {"x": 623.8, "y": 159.4, "r": 2.14, "a": 0.312, "p": 2.562, "s": 0.602}, {"x": 473.0, "y": 4.0, "r": 1.03, "a": 0.233, "p": 0.312, "s": 0.697}, {"x": 338.0, "y": 270.0, "r": 1.03, "a": 0.233, "p": 1.222, "s": 1.026}, {"x": 186.0, "y": 159.0, "r": 1.03, "a": 0.225, "p": 6.203, "s": 0.933}, {"x": 497.0, "y": 247.0, "r": 1.03, "a": 0.229, "p": 6.267, "s": 0.619}, {"x": 285.0, "y": 199.0, "r": 1.03, "a": 0.229, "p": 2.182, "s": 0.985}, {"x": 235.0, "y": 99.0, "r": 1.03, "a": 0.221, "p": 2.421, "s": 1.48}, {"x": 246.0, "y": 221.0, "r": 1.03, "a": 0.22, "p": 0.467, "s": 0.887}, {"x": 251.0, "y": 159.0, "r": 1.03, "a": 0.223, "p": 5.101, "s": 0.762}, {"x": 875.5, "y": 47.0, "r": 1.13, "a": 0.223, "p": 3.737, "s": 0.752}, {"x": 288.0, "y": 271.0, "r": 1.03, "a": 0.219, "p": 4.105, "s": 1.432}, {"x": 601.0, "y": 102.7, "r": 1.45, "a": 0.25, "p": 0.437, "s": 1.291}, {"x": 678.7, "y": 228.9, "r": 1.63, "a": 0.277, "p": 5.637, "s": 0.639}, {"x": 550.0, "y": 97.5, "r": 1.13, "a": 0.237, "p": 5.302, "s": 0.453}, {"x": 311.0, "y": 230.5, "r": 1.36, "a": 0.232, "p": 0.462, "s": 0.915}, {"x": 449.0, "y": 19.0, "r": 1.03, "a": 0.216, "p": 6.175, "s": 0.668}, {"x": 474.0, "y": 27.5, "r": 1.13, "a": 0.222, "p": 5.236, "s": 1.203}, {"x": 189.0, "y": 104.0, "r": 1.03, "a": 0.212, "p": 0.3, "s": 0.926}, {"x": 298.0, "y": 214.0, "r": 1.03, "a": 0.22, "p": 4.949, "s": 1.484}, {"x": 273.0, "y": 186.0, "r": 1.03, "a": 0.216, "p": 4.169, "s": 0.541}, {"x": 352.0, "y": 210.0, "r": 1.03, "a": 0.209, "p": 0.918, "s": 1.073}, {"x": 220.0, "y": 135.0, "r": 1.03, "a": 0.21, "p": 1.859, "s": 0.917}];
  const maskImg = new Image();
  maskImg.src = 'data:image/png;base64,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18fZnA/BO7m/WdOuN5vtZr1u27oOIXjvS78e751bHtYQs5xMU3939erlqze3ZWOWgRHfKYz6toy/btquW683m+327Pzi0cXZ+oMsqssui0rZ1VD9aO2+ivNNd/bobpT6OEzTPM1Rs4idvlBV1XUdvOQ4juMUYxbRUHdnl0+f//T86Vkrdbxbd00d3Affq5iKieWcTaTcFg/LN2HZO8lxThpWx2guVJX3WvZ/XdV0m+12s+5WdR2Cd84tTxO4Mps9DfiS8ni4fvXbry/e3BxOt+yAPz6M+naoqup2td5sd9vdZrPZbDbbbenSr+/PP9WZiVgWMzPn8sdLN9TX3dmTSZrdoR/6vu/HKWY77YI27Wq1ausgaezLVTYTX612j5799PPzJ482ddahW61KawB79w+N8u9O72/RlDnmkiTnxHJK5pptH82Hqip3Ts3U1W232WzWq7YOwZdKSNVSEqnvlBFbjv3d699++eWfr2+Ow8yCEd8njKfCBedDqOu2W293Z+e73Xbdde2qXTXNh7X5JQVmprnsp7qPH3Cor7rzKPXu9tAfD/vb2/1xjEnUhbpddesSiyDzsL+9vdsPU5bQbM6fPP/5p6eXu86n1LTLicO709ul245qKGNrXZfSw/tv0gWxbFqv90M0V1XlArhlUV833brr2qbyS5MpLQvgZVBcdpNynA7XL375+99/eXlzGJdSEOAPDuP9hk2o67ptu/Vmd3Z+drbdrNumrquq+mhtfolENivvhX9iP1XFVatsvrs49MNxf331+s3NYYziQrva7M7OdrvtZtUEi/3dzfX17WFMUq22F0+ePX96ebauNdZNu+q6tqnmctT4Ti2xiWjVrjfbzbpbtXVZMJ7GTi+NqW/W/ZjM+VLoZWbifFW3q7Yplxf0vT+PTkkUsxTH/dVvf//b3/7x4vo4Miziu4RxOU4sd6W71Xq92ex2u12JYvDeu2Uu95ElpuWUzNT5bKru40eN6mvTen0xTGO/v361W69uDrOFdr07f3Rxcb7drNvKWxz2t9fXN4chStVtLy4fX17s1k0QrdvVZrvdlJutUvp8V3UVnFjOolW3u3z06Hy3buvw7nep4ipxodmMcxJ1pZuymYj6UNV1OcL43R8ep/eJzXKah/31i7//z//799+uD1NkWMT3COPy4He7Wq3Xm3VZJG7Wm65r69p759TdT+De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';
  const cloudRegions = [
    {name:'left-existing-clouds', x:24, y:1000, w:317, h:91},
    {name:'right-existing-clouds', x:802, y:645, w:106, h:90}
  ];
  let fogSource = null, fogMask = null;
  let fogOn = true, fogTime = 0, fogLastFrame = 0, fogLastNow = 0;
  let skyOn = true, skyTime = 0, skyLastNow = 0;
  function prepFog() {
    if(!img.complete || !img.naturalWidth || !maskImg.complete || !maskImg.naturalWidth)return;
    const off = document.createElement('canvas');off.width=908;off.height=1313;
    const oc = off.getContext('2d', {willReadFrequently:true});
    oc.drawImage(img,0,0,908,1313);
    fogSource = oc.getImageData(0,0,908,1313).data;
    oc.clearRect(0,0,908,1313);oc.drawImage(maskImg,0,0);
    fogMask = oc.getImageData(0,0,908,1313).data;
    for(const region of cloudRegions) {
      region.frame=fctx.createImageData(region.w,region.h);
      region.pixels=region.frame.data;
    }
  }
  img.addEventListener('load',prepFog);
  maskImg.addEventListener('load',prepFog);
  if(img.complete && maskImg.complete)prepFog();
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  const state = { running: !reduce.matches, live: true, demo: false, t0: performance.now() };
  let raf = 0;

  function fitCanvas() {
    const r = canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.max(1, Math.round(r.width * dpr));
    canvas.height = Math.max(1, Math.round(r.height * dpr));
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function sx(x) { return x / SRC_W * canvas.clientWidth; }
  function sy(y) { return y / SRC_H * canvas.clientHeight; }

  function clipWaterPath() {
    ctx.beginPath();
    WATER_MASK.forEach(([x, y], i) => {
      const px = sx(x), py = sy(y);
      if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
    });
    ctx.closePath();
    ctx.clip();
  }

  function drawReflections(t, glowAmt) {
    const g = glowAmt / 100;
    BRIDGE_LIGHTS.forEach((p, i) => {
      const pulse = 0.55 + 0.45 * Math.sin(t * 0.0012 + i * 1.4);
      const x = sx(p.x) + Math.sin(t * 0.0009 + i) * 2.2 * g;
      const y = sy(p.y);
      const w = 8 + pulse * 7 * g;
      const h = p.h * (0.8 + pulse * 0.35 * g) * (canvas.clientHeight / SRC_H);
      const grad = ctx.createLinearGradient(x, y - 3, x, y + h);
      grad.addColorStop(0, `rgba(255,224,170,${0.18 + pulse*0.16*g})`);
      grad.addColorStop(0.35, `rgba(192,233,255,${0.08 + pulse*0.10*g})`);
      grad.addColorStop(1, 'rgba(120,190,230,0)');
      ctx.fillStyle = grad;
      ctx.fillRect(x - w/2, y, w, h);
    });
  }

  // Fixed stars extracted from the source artwork and source-pixel nebula lighting.
  // All coordinates remain stationary; no backdrop/pan/parallax primitives.
  function renderSky(now) {
    if (!skyOn || !state.live || reduce.matches || !img.complete || !img.naturalWidth) {
      sctx.clearRect(0, 0, 908, 1313);
      nctx.clearRect(0, 0, 908, 1313);
      skyLastNow = now;
      return;
    }
    const dt=skyLastNow?Math.min(60,now-skyLastNow):0;
    skyLastNow=now;
    if (state.running || state.demo) skyTime+=dt;
    const seconds=skyTime/1000;
    const twinkle=Number(starStrengthEl.value)/100;
    const nebulaStrength=Number(nebulaStrengthEl.value)/100;
    if (now-skyLastFrame>33 || skyLastFrame===0) {
      skyLastFrame=now;
      sctx.clearRect(0,0,908,1313);
      if (twinkle>0){
        sctx.save();
        sctx.globalCompositeOperation='screen';
        for (const star of STAR_FIELD){
          // Independent phases: dark-to-bright modulation is visible at phone scale.
          const p1=Math.sin(seconds * (star.s*1.8) + star.p);
          const p2=Math.sin(seconds * (star.s*0.73) + star.p*1.4+star.x*.009);
          const pulse=Math.pow(Math.max(0,(p1+.20*p2+1)/2.2),1.75);
          const alpha=Math.min(1,twinkle*star.a*(.10+2.4*pulse));
          const r=star.r*(1.45+1.0*pulse);
          const haloR=r*3.0;
          const halo=sctx.createRadialGradient(star.x,star.y,0,star.x,star.y,haloR);
          halo.addColorStop(0,`rgba(244,252,255,${alpha*.93})`);
          halo.addColorStop(.24,`rgba(190,224,255,${alpha*.40})`);
          halo.addColorStop(.62,`rgba(124,184,255,${alpha*.10})`);
          halo.addColorStop(1,'rgba(100,175,255,0)');
          sctx.fillStyle=halo;
          sctx.beginPath();sctx.arc(star.x,star.y,haloR,0,Math.PI*2);sctx.fill();
          sctx.fillStyle=`rgba(255,251,239,${alpha*.95})`;
          sctx.beginPath();sctx.arc(star.x,star.y,Math.max(0.7,star.r*.6),0,Math.PI*2);sctx.fill();
        }
        sctx.restore();
      }
    }
    // Restrict nebula luminance modulation to pixels of the *existing* cloudy sky.
    // Render a locally varying light field derived from those pixels. Moon, beam,
    // arc linework, stars, trees and mountains never translate or deform.
    if(now-nebulaLastFrame<70 && nebulaLastFrame!==0)return;
    nebulaLastFrame=now;
    nctx.clearRect(0,0,908,1313);
    if(!nebulaSource || !nebulaFrame || nebulaStrength<.01)return;
    const w=SKY_BOX.w,h=SKY_BOX.h;
    const frame=nebulaPixels, source=nebulaSource;
    const t=seconds;
    for(let y=0;y<h;y+=2){
      for(let x=0;x<w;x+=2){
        const i=(y*w+x)*4;
        const r=source[i],g=source[i+1],b=source[i+2];
        const luma=.2126*r+.7152*g+.0722*b;
        // Only visibly luminous, blue-dominant original cloud texture.
        const blue=Math.max(0,Math.min(1,(b-r-11)/27));
        const lumMask=Math.max(0,Math.min(1,(luma-20)/41));
        // Source-local field with no synthetic ellipse/polygon shapes.
        const edge=Math.min(1,x/44,(w-1-x)/44,y/42,(h-1-y)/65);
        const mask=blue*lumMask*Math.max(0,edge);
        const wave1=Math.sin(x*.026 + y*.018 + t*.70);
        const wave2=Math.sin(x*.013 - y*.041 - t*.43);
        const wave3=Math.sin(x*.054 + y*.009 + t*.93);
        const light=(.28 + .72*Math.max(0,(wave1*.52+wave2*.32+wave3*.16+1)/2));
        const a=Math.max(0,Math.min(235,mask*nebulaStrength*190*light));
        if(a<2){for(let dy=0;dy<2;dy++)for(let dx=0;dx<2;dx++){if(y+dy<h&&x+dx<w)frame[((y+dy)*w+x+dx)*4+3]=0;}continue;}
        frame[i]=Math.min(255,Math.round(r*.55+18));
        frame[i+1]=Math.min(255,Math.round(g*.68+24));
        frame[i+2]=Math.min(255,Math.round(b*.95+32));
        frame[i+3]=Math.round(a);
        // Fill the adjacent cell with the same source-derived shading;
        // neighboring cells average visually at device scale.
        for(let dy=0;dy<2;dy++)for(let dx=0;dx<2;dx++){
          if(!dx&&!dy)continue;
          if(y+dy>=h||x+dx>=w)continue;
          const j=((y+dy)*w+x+dx)*4;
          frame[j]=frame[i];frame[j+1]=frame[i+1];frame[j+2]=frame[i+2];frame[j+3]=frame[i+3];
        }
      }
    }
    nctx.putImageData(nebulaFrame,SKY_BOX.x,SKY_BOX.y);
  }

  function render(now) {
    if (!visible() || !img.complete || !img.naturalWidth) {
      raf=requestAnimationFrame(render);
      return;
    }
    const t = now - state.t0;
    ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);
    if (!state.live) {
      fctx.clearRect(0,0,908,1313);
      sctx.clearRect(0,0,908,1313);
      nctx.clearRect(0,0,908,1313);
      statusEl.textContent = state.running ? 'ORIGINAL STILL · PAUSED IMAGE' : 'ORIGINAL STILL';
      raf = requestAnimationFrame(render); return;
    }
    const sceneLabel = skyOn ? 'LIVE WATER + SOURCE CLOUDS + STARS' : 'LIVE WATER + SOURCE CLOUDS';
    statusEl.textContent = state.running ? (state.demo ? sceneLabel + ' · DEMO SWEEP' : sceneLabel + ' · RUNNING') : sceneLabel + ' · PAUSED';
    if (!state.running && !state.demo) {
      // frozen last frame appearance
    }
    const intensity = Number(intensityEl.value) / 100;
    const glowAmt = Number(glowEl.value);
    ctx.save();
    clipWaterPath();
    ctx.globalAlpha = 0.85;
    const stripH = 3;
    const destX = sx(WATER.x), destY = sy(WATER.y), destW = sx(WATER.w), destH = sy(WATER.h);
    const verticalScale = canvas.clientHeight / SRC_H;
    const motionPhase = state.running || state.demo ? t : 0;
    for (let sySrc = WATER.y; sySrc < WATER.y + WATER.h; sySrc += stripH) {
      const row = sySrc - WATER.y;
      const n = row / WATER.h;
      const amp = (1.6 + 2.8 * (1 - Math.abs(n - 0.55) * 1.2)) * intensity;
      let sweep = 0;
      if (state.demo) {
        sweep = Math.sin(t * 0.0012) * 4.2 * (0.2 + n * 0.8);
      }
      const dx = (
        Math.sin(motionPhase * 0.0014 + row * 0.105) * amp +
        Math.sin(motionPhase * 0.00063 + row * 0.032 + 1.4) * amp * 0.55 +
        Math.sin(motionPhase * 0.00195 + row * 0.15 + 2.2) * amp * 0.25 + sweep
      ) * (canvas.clientWidth / SRC_W);
      const alpha = 0.22 + 0.42 * (1 - Math.abs(n - 0.55));
      ctx.globalAlpha = alpha;
      const dy = destY + (sySrc - WATER.y) * verticalScale;
      const dh = Math.max(1.2, stripH * verticalScale + 0.35);
      ctx.drawImage(img, WATER.x, sySrc, WATER.w, stripH, destX + dx, dy, destW, dh);
    }

    // water glow and low-frequency shimmer
    ctx.globalAlpha = 0.16 + glowAmt / 900;
    const grad1 = ctx.createRadialGradient(sx(690), sy(1070), 4, sx(690), sy(1070), sx(260));
    grad1.addColorStop(0, 'rgba(175,221,245,.52)');
    grad1.addColorStop(0.35, 'rgba(136,198,234,.20)');
    grad1.addColorStop(1, 'rgba(120,180,220,0)');
    ctx.fillStyle = grad1;
    ctx.fillRect(destX, destY, destW, destH);

    drawReflections(motionPhase, glowAmt);
    ctx.restore();
    renderExtractedFog(now);
    renderSky(now);

    raf = requestAnimationFrame(render);
  }


  // Source-native cloud advection: each pixel is sampled from the existing image.
  // Per-pixel source-derived cloud masks prevent mountains, trees, bridge and
  // angular graphic art from being translated. No visual primitives are painted.
  function renderExtractedFog(now) {
    if (!fogOn || reduce.matches || document.hidden || !fogSource || !fogMask) {
      fctx.clearRect(0,0,908,1313);
      fogLastNow=now;
      return;
    }
    const dt = fogLastNow ? Math.min(60,now-fogLastNow) : 0;
    fogLastNow=now;
    if(state.running)fogTime += dt*Number(fogSpeed.value)/100;
    if(now-fogLastFrame<42 && fogLastFrame) return; // ~23Hz ceiling on source-native fog
    fogLastFrame=now;
    if (!state.running && !state.demo) return; // preserve the last fog frame when paused
    fctx.clearRect(0,0,908,1313);
    const seconds=fogTime/1000;
    const strength=Number(fogIntensity.value)/100;
    for(const r of cloudRegions) {
      const {x,y,w,h,pixels}=r;
      for(let row=0;row<h;row++){
        const py=y+row;
        for(let col=0;col<w;col++){
          const px=x+col, i=(py*908+px)*4, o=(row*w+col)*4;
          const mask=fogMask[i]/255;
          if(mask<0.009){pixels[o+3]=0;continue;}
          // Divergent, low-frequency phase fields morph real cloud wisps in place.
          // The initial displacement is exactly zero, and nothing moves as one sheet.
          const a=py*.040+px*.013;
          const b=px*.037-py*.022;
          const shiftX= (Math.sin(a+seconds*.75)-Math.sin(a))*6.4 +
                        (Math.sin(b-seconds*.41)-Math.sin(b))*4.8;
          const shiftY= (Math.sin(b*.75+seconds*.52)-Math.sin(b*.75))*2.6 +
                        (Math.sin(a*.5-seconds*.63)-Math.sin(a*.5))*2.3;
          const fx=Math.max(0,Math.min(907.001,px+shiftX));
          const fy=Math.max(0,Math.min(1312.001,py+shiftY));
          const ix=Math.floor(fx), iy=Math.floor(fy), tx=fx-ix, ty=fy-iy;
          const ix1=Math.min(907,ix+1),iy1=Math.min(1312,iy+1);
          const p00=(iy*908+ix)*4,p10=(iy*908+ix1)*4;
          const p01=(iy1*908+ix)*4,p11=(iy1*908+ix1)*4;
          const w00=(1-tx)*(1-ty),w10=tx*(1-ty),w01=(1-tx)*ty,w11=tx*ty;
          // Vary the density of genuine cloud wisps using their own sampled color,
          // not a synthetic cloud-shaped overlay. The source mask stays fixed.
          const vapor=(Math.sin(a*.58+seconds*.62)-Math.sin(a*.58))*.22 +
                      (Math.sin(b*.43-seconds*.37)-Math.sin(b*.43))*.10;
          for(let c=0;c<3;c++){
            const sample=fogSource[p00+c]*w00 + fogSource[p10+c]*w10 +
              fogSource[p01+c]*w01 + fogSource[p11+c]*w11;
            pixels[o+c]=Math.round(Math.max(0,Math.min(255,sample*(1+vapor))));
          }
          pixels[o+3]=Math.round(Math.min(255,mask*strength*240));
        }
      }
      fctx.putImageData(r.frame,x,y);
    }
  }
  const reduced=()=>reduce.matches;
  const visible=()=>root.dataset.filmState==='settled' && !document.hidden && !reduced();
  const onVisibility=()=>{
    state.running=visible();
    if(!state.running){
      ctx.clearRect(0,0,canvas.clientWidth,canvas.clientHeight);
      fctx.clearRect(0,0,908,1313);
      nctx.clearRect(0,0,908,1313);
      sctx.clearRect(0,0,908,1313);
    }
  };
  const onResize=()=>fitCanvas();
  document.addEventListener('visibilitychange',onVisibility,{passive:true});
  window.addEventListener('resize',onResize,{passive:true});
  reduce.addEventListener?.('change',onVisibility);
  const observer=new MutationObserver(onVisibility);
  observer.observe(root,{attributes:true,attributeFilter:['data-film-state']});
  const resizeObserver=typeof ResizeObserver==='function'?new ResizeObserver(onResize):null;
  resizeObserver?.observe(plane);
  const teardown=()=>{
    cancelAnimationFrame(raf);
    observer.disconnect();resizeObserver?.disconnect();
    document.removeEventListener('visibilitychange',onVisibility);
    window.removeEventListener('resize',onResize);
    reduce.removeEventListener?.('change',onVisibility);
  };
  window.addEventListener('pagehide',teardown,{once:true});
  img.addEventListener('error',()=>{state.running=false;plane.remove();});
  img.addEventListener('load',()=>{fitCanvas();onVisibility();});
  img.src=artUrl;
  fitCanvas();onVisibility();
  raf=requestAnimationFrame(render);
})();