/* DOOR_NATIVE_GEOMETRY_MIRROR_v6 */
(() => {
  'use strict';
  const reel = document.querySelector('[data-door-estate-reel]');
  const canvas = reel?.querySelector('[data-door-geometry-canvas]');
  const label = reel?.querySelector('[data-door-reel-label]');
  const count = reel?.querySelector('[data-door-reel-count]');
  if (!reel || !canvas || !label || !count) return;

  const ctx = canvas.getContext('2d', { alpha: false });
  if (!ctx) return;
  const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches ?? false;
  const HOLD = 4100;
  const TRANSITION = 950;
  const TAU = Math.PI * 2;
  const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
  const ease = v => { const x = clamp(v); return x * x * (3 - 2 * x); };
  const rgba = (r, g, b, a = 1) => `rgba(${r},${g},${b},${a})`;
  const scenes = Object.freeze([
    Object.freeze({ label: 'Mirrorland', draw: drawMirrorland }),
    Object.freeze({ label: 'Audralia', draw: drawAudralia }),
    Object.freeze({ label: 'Trophy', draw: drawTrophy }),
    Object.freeze({ label: 'Brain', draw: drawBrain }),
    Object.freeze({ label: 'Mirror Manor', draw: drawManor })
  ]);

  const stars = Array.from({ length: 54 }, (_, i) => ({
    x: ((i * 73) % 997) / 997,
    y: ((i * 181 + 47) % 991) / 991,
    r: .35 + ((i * 31) % 13) / 18,
    a: .10 + ((i * 19) % 17) / 80
  }));

  let index = 0;
  let phaseStart = performance.now();
  let visible = true;
  let raf = 0;
  let lastFrame = 0;
  let cssWidth = 1;
  let cssHeight = 1;

  function resize() {
    const rect = canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 1.55);
    cssWidth = Math.max(2, rect.width);
    cssHeight = Math.max(2, rect.height);
    const w = Math.max(2, Math.round(cssWidth * dpr));
    const h = Math.max(2, Math.round(cssHeight * dpr));
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w;
      canvas.height = h;
    }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function background(w, h, t) {
    const bg = ctx.createRadialGradient(w * .52, h * .42, 0, w * .52, h * .42, Math.max(w, h) * .72);
    bg.addColorStop(0, '#0a1521');
    bg.addColorStop(.46, '#040a12');
    bg.addColorStop(1, '#010307');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, w, h);
    for (let i = 0; i < stars.length; i++) {
      const s = stars[i];
      const twinkle = reduced ? 1 : .72 + .28 * Math.sin(t * .001 + i * 1.7);
      ctx.beginPath();
      ctx.arc(s.x * w, s.y * h, s.r, 0, TAU);
      ctx.fillStyle = rgba(196, 220, 235, s.a * twinkle);
      ctx.fill();
    }
    const halo = ctx.createRadialGradient(w * .5, h * .47, 0, w * .5, h * .47, Math.min(w, h) * .5);
    halo.addColorStop(0, rgba(79, 169, 194, .075));
    halo.addColorStop(.55, rgba(76, 83, 160, .025));
    halo.addColorStop(1, rgba(0, 0, 0, 0));
    ctx.fillStyle = halo;
    ctx.fillRect(0, 0, w, h);
  }

  function withAlpha(alpha, fn) {
    ctx.save();
    ctx.globalAlpha = clamp(alpha);
    fn();
    ctx.restore();
  }

  function path(points, close = true) {
    ctx.beginPath();
    points.forEach((p, i) => i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]));
    if (close) ctx.closePath();
  }

  function drawMirrorland(w, h, t, alpha, entering = 0) {
    withAlpha(alpha, () => {
      const cx = w * .51, cy = h * .43, rx = Math.min(w * .19, h * .34), ry = Math.min(h * .34, w * .29);
      const sway = reduced ? 0 : Math.sin(t * .00055) * .085;
      const breathe = 1 + (reduced ? 0 : Math.sin(t * .0011) * .014);
      const outer = [], inner = [], seg = 14;
      for (let i = 0; i < seg; i++) {
        const a = -Math.PI / 2 + i / seg * TAU;
        const z = Math.sin(a) * sway;
        outer.push([cx + Math.cos(a) * rx * breathe * (1 + z), cy + Math.sin(a) * ry * breathe]);
        inner.push([cx + Math.cos(a) * rx * .42 * (1 - z * .8), cy + Math.sin(a) * ry * .50]);
      }
      const glow = ctx.createRadialGradient(cx, cy, rx * .15, cx, cy, rx * 1.35);
      glow.addColorStop(0, rgba(89, 211, 230, .10));
      glow.addColorStop(.55, rgba(129, 97, 194, .08));
      glow.addColorStop(1, rgba(0, 0, 0, 0));
      ctx.fillStyle = glow; ctx.fillRect(cx - rx * 1.6, cy - ry * 1.2, rx * 3.2, ry * 2.4);
      const palette = [[88,184,206],[102,116,184],[149,97,166],[195,151,83],[87,160,154],[164,91,117]];
      for (let i = 0; i < seg; i++) {
        const n = (i + 1) % seg;
        path([outer[i], outer[n], inner[n], inner[i]]);
        const c = palette[i % palette.length];
        const g = ctx.createLinearGradient(outer[i][0], outer[i][1], inner[n][0], inner[n][1]);
        g.addColorStop(0, rgba(c[0] + 18, c[1] + 18, c[2] + 20, .72));
        g.addColorStop(.55, rgba(c[0], c[1], c[2], .36));
        g.addColorStop(1, rgba(18, 29, 42, .56));
        ctx.fillStyle = g; ctx.fill();
        ctx.strokeStyle = rgba(208, 228, 239, .16); ctx.lineWidth = 1; ctx.stroke();
      }
      path(inner);
      const voidG = ctx.createRadialGradient(cx - rx * .08, cy - ry * .08, 0, cx, cy, rx * .48);
      voidG.addColorStop(0, '#061019'); voidG.addColorStop(.58, '#02060a'); voidG.addColorStop(1, '#000205');
      ctx.fillStyle = voidG; ctx.fill();
      ctx.strokeStyle = rgba(132, 225, 238, .24); ctx.lineWidth = 1.2; ctx.stroke();
      ctx.save(); ctx.translate(cx, cy); ctx.rotate(sway * .7);
      for (let i = 0; i < 7; i++) {
        const a = i / 7 * TAU + t * .00006;
        const rr = rx * (1.25 + (i % 3) * .12);
        const x = Math.cos(a) * rr, y = Math.sin(a) * rr * .55;
        ctx.beginPath(); ctx.moveTo(x, y - 5); ctx.lineTo(x + 4, y + 2); ctx.lineTo(x - 3, y + 7); ctx.closePath();
        ctx.fillStyle = rgba(170, 220, 231, .10 + (i % 2) * .04); ctx.fill();
      }
      ctx.restore();
      ctx.strokeStyle = rgba(231, 210, 157, .20); ctx.lineWidth = 1;
      ctx.beginPath(); ctx.ellipse(cx, cy, rx * 1.02, ry * 1.02, 0, 0, TAU); ctx.stroke();
    });
  }

  function drawAudralia(w, h, t, alpha) {
    withAlpha(alpha, () => {
      const r = Math.min(w, h) * .28, cx = w * .51, cy = h * .44;
      const drift = reduced ? 0 : Math.sin(t * .00045) * r * .025;
      const halo = ctx.createRadialGradient(cx, cy, r * .55, cx, cy, r * 1.18);
      halo.addColorStop(0, rgba(52, 140, 198, 0)); halo.addColorStop(.75, rgba(59, 170, 225, .10)); halo.addColorStop(1, rgba(59, 170, 225, 0));
      ctx.fillStyle = halo; ctx.fillRect(cx-r*1.3, cy-r*1.3, r*2.6, r*2.6);
      const ocean = ctx.createRadialGradient(cx - r * .38, cy - r * .38, r * .05, cx, cy, r);
      ocean.addColorStop(0, '#1c77a5'); ocean.addColorStop(.46, '#0c496f'); ocean.addColorStop(1, '#031a31');
      ctx.beginPath(); ctx.arc(cx, cy, r, 0, TAU); ctx.fillStyle = ocean; ctx.fill();
      ctx.save(); ctx.beginPath(); ctx.arc(cx, cy, r * .985, 0, TAU); ctx.clip();
      ctx.strokeStyle = rgba(146, 213, 230, .13); ctx.lineWidth = 1;
      for (let i = -2; i <= 2; i++) { ctx.beginPath(); ctx.ellipse(cx, cy + i*r*.25, r*.94, r*(.12 + .025*Math.abs(i)), 0, 0, TAU); ctx.stroke(); }
      for (let i = -2; i <= 2; i++) { ctx.beginPath(); ctx.ellipse(cx + i*r*.03, cy, r*(.24 + .015*Math.abs(i)), r*.94, i*.34 + t*.000025, 0, TAU); ctx.stroke(); }
      ctx.save(); ctx.translate(drift, 0);
      const land = new Path2D();
      land.moveTo(cx-r*.72,cy-r*.48); land.bezierCurveTo(cx-r*.38,cy-r*.72,cx+r*.05,cy-r*.66,cx+r*.45,cy-r*.47);
      land.bezierCurveTo(cx+r*.67,cy-r*.26,cx+r*.58,cy-r*.02,cx+r*.72,cy+r*.18);
      land.bezierCurveTo(cx+r*.56,cy+r*.40,cx+r*.21,cy+r*.61,cx-r*.03,cy+r*.68);
      land.bezierCurveTo(cx-r*.34,cy+r*.54,cx-r*.62,cy+r*.43,cx-r*.72,cy+r*.18);
      land.bezierCurveTo(cx-r*.83,cy-r*.05,cx-r*.69,cy-r*.25,cx-r*.72,cy-r*.48); land.closePath();
      const landG = ctx.createLinearGradient(cx-r,cy-r,cx+r,cy+r);
      landG.addColorStop(0,'#5a8657'); landG.addColorStop(.52,'#477747'); landG.addColorStop(1,'#2f5b38');
      ctx.fillStyle = landG; ctx.fill(land);
      ctx.strokeStyle = rgba(181, 221, 159, .20); ctx.lineWidth = 1.1; ctx.stroke(land);
      ctx.beginPath(); ctx.ellipse(cx-r*.18,cy+r*.02,r*.19,r*.14,-.25,0,TAU);
      ctx.fillStyle = '#0a4568'; ctx.fill(); ctx.strokeStyle = rgba(72,168,198,.38); ctx.stroke();
      ctx.restore();
      for (let i=0;i<3;i++) {
        const yy=cy-r*.38+i*r*.32+(reduced?0:Math.sin(t*.0006+i)*r*.02);
        ctx.strokeStyle=rgba(220,238,239,.07); ctx.lineWidth=3;
        ctx.beginPath(); ctx.arc(cx-r*.18+i*r*.12,yy,r*.62,-2.8,-.35); ctx.stroke();
      }
      ctx.restore();
      ctx.beginPath(); ctx.arc(cx, cy, r, 0, TAU); ctx.strokeStyle = rgba(115, 211, 238, .34); ctx.lineWidth = 1.4; ctx.stroke();
      const shine = ctx.createLinearGradient(cx-r,cy-r,cx+r,cy+r);
      shine.addColorStop(0,rgba(255,255,255,.18)); shine.addColorStop(.22,rgba(255,255,255,.035)); shine.addColorStop(.55,rgba(255,255,255,0));
      ctx.beginPath(); ctx.arc(cx,cy,r*.98,0,TAU); ctx.fillStyle=shine; ctx.fill();
    });
  }

  function drawTrophy(w, h, t, alpha) {
    withAlpha(alpha, () => {
      const s = Math.min(w, h) * .30, cx = w * .51, cy = h * .43;
      const tilt = reduced ? 0 : Math.sin(t * .0007) * .045;
      ctx.save(); ctx.translate(cx, cy); ctx.transform(1, tilt, -tilt*.25, 1, 0, 0);
      const glow = ctx.createRadialGradient(0,-s*.05,0,0,-s*.05,s*.95); glow.addColorStop(0,rgba(238,186,78,.18)); glow.addColorStop(1,rgba(0,0,0,0)); ctx.fillStyle=glow; ctx.fillRect(-s,-s,s*2,s*2);
      const gold = ctx.createLinearGradient(-s*.45,-s*.65,s*.45,s*.55); gold.addColorStop(0,'#f4d77d'); gold.addColorStop(.22,'#9a661f'); gold.addColorStop(.48,'#e1b550'); gold.addColorStop(.73,'#6e4316'); gold.addColorStop(1,'#d7a844');
      ctx.beginPath(); ctx.moveTo(-s*.40,-s*.58); ctx.bezierCurveTo(-s*.42,-s*.22,-s*.28,s*.03,-s*.12,s*.15); ctx.bezierCurveTo(-s*.06,s*.20,s*.06,s*.20,s*.12,s*.15); ctx.bezierCurveTo(s*.28,s*.03,s*.42,-s*.22,s*.40,-s*.58); ctx.closePath(); ctx.fillStyle=gold; ctx.fill();
      ctx.strokeStyle=rgba(255,229,150,.45); ctx.lineWidth=1.2; ctx.stroke();
      ctx.lineWidth=s*.075; ctx.lineCap='round'; ctx.strokeStyle='#9e681f';
      ctx.beginPath(); ctx.arc(-s*.44,-s*.33,s*.22,-Math.PI*.55,Math.PI*.55); ctx.stroke();
      ctx.beginPath(); ctx.arc(s*.44,-s*.33,s*.22,Math.PI*.45,Math.PI*1.55); ctx.stroke();
      ctx.lineWidth=s*.038; ctx.strokeStyle=rgba(250,216,121,.72);
      ctx.beginPath(); ctx.arc(-s*.44,-s*.33,s*.22,-Math.PI*.55,Math.PI*.55); ctx.stroke();
      ctx.beginPath(); ctx.arc(s*.44,-s*.33,s*.22,Math.PI*.45,Math.PI*1.55); ctx.stroke();
      ctx.fillStyle=gold; ctx.fillRect(-s*.075,s*.12,s*.15,s*.35);
      ctx.beginPath(); ctx.moveTo(-s*.31,s*.49); ctx.lineTo(s*.31,s*.49); ctx.lineTo(s*.40,s*.63); ctx.lineTo(-s*.40,s*.63); ctx.closePath(); ctx.fillStyle=gold; ctx.fill();
      ctx.fillStyle='#2a1b0d'; ctx.fillRect(-s*.45,s*.63,s*.90,s*.14);
      const glintX = -s*.28 + (reduced ? .18 : (.5+.5*Math.sin(t*.0012))) * s*.56;
      const glint = ctx.createLinearGradient(glintX-s*.07,0,glintX+s*.07,0); glint.addColorStop(0,rgba(255,255,255,0)); glint.addColorStop(.5,rgba(255,246,194,.38)); glint.addColorStop(1,rgba(255,255,255,0)); ctx.fillStyle=glint; ctx.fillRect(-s*.42,-s*.58,s*.84,s*1.34);
      ctx.restore();
      ctx.beginPath(); ctx.ellipse(cx, h*.75, s*.52, s*.075, 0,0,TAU); ctx.fillStyle=rgba(208,166,77,.10); ctx.fill();
    });
  }

  function drawBrain(w, h, t, alpha) {
    withAlpha(alpha, () => {
      const cx=w*.51,cy=h*.43,rx=Math.min(w*.22,h*.32),ry=Math.min(h*.28,w*.20);
      const wobble=reduced?0:Math.sin(t*.00065)*.028;
      const brain = new Path2D();
      for(let i=0;i<=80;i++){
        const a=i/80*TAU;
        const mod=1+.055*Math.sin(a*6+.3)+.032*Math.sin(a*11-1.1)+.018*Math.sin(a*17+.6);
        const x=cx+Math.cos(a)*rx*mod*(1+wobble*Math.sin(a));
        const y=cy+Math.sin(a)*ry*mod;
        if(i===0)brain.moveTo(x,y);else brain.lineTo(x,y);
      }
      brain.closePath();
      const g=ctx.createRadialGradient(cx-rx*.35,cy-ry*.35,0,cx,cy,rx*1.15); g.addColorStop(0,'#e59a9e'); g.addColorStop(.38,'#ad646e'); g.addColorStop(.74,'#6c3847'); g.addColorStop(1,'#3b202b');
      ctx.fillStyle=g; ctx.fill(brain); ctx.strokeStyle=rgba(245,190,188,.28); ctx.lineWidth=1.2; ctx.stroke(brain);
      ctx.save(); ctx.clip(brain);
      ctx.strokeStyle=rgba(47,18,28,.48); ctx.lineWidth=1.25;
      for(let i=0;i<16;i++){
        const yy=cy-ry*.70+i*(ry*1.4/15);
        const wave=(i%2?1:-1)*(reduced?0:Math.sin(t*.00045+i)*rx*.025);
        ctx.beginPath(); ctx.moveTo(cx-rx*.72,yy); ctx.bezierCurveTo(cx-rx*.34,yy-ry*.13+wave,cx+rx*.12,yy+ry*.13-wave,cx+rx*.72,yy-ry*.04); ctx.stroke();
      }
      for(let i=0;i<7;i++){
        const xx=cx-rx*.58+i*(rx*1.16/6);
        ctx.beginPath(); ctx.moveTo(xx,cy-ry*.72); ctx.bezierCurveTo(xx-rx*.14,cy-ry*.34,xx+rx*.12,cy+ry*.22,xx,cy+ry*.72); ctx.stroke();
      }
      ctx.restore();
      ctx.strokeStyle=rgba(31,12,21,.68); ctx.lineWidth=2.2; ctx.beginPath(); ctx.moveTo(cx,cy-ry*.82); ctx.bezierCurveTo(cx-rx*.03,cy-ry*.35,cx+rx*.03,cy+ry*.38,cx,cy+ry*.78); ctx.stroke();
      const rim=ctx.createLinearGradient(cx-rx,cy-rx,cx+rx,cy+rx); rim.addColorStop(0,rgba(255,226,217,.20)); rim.addColorStop(.38,rgba(255,255,255,0)); rim.addColorStop(1,rgba(86,177,194,.10)); ctx.fillStyle=rim; ctx.fill(brain);
      ctx.beginPath(); ctx.ellipse(cx,h*.74,rx*.70,ry*.10,0,0,TAU); ctx.fillStyle=rgba(178,89,105,.08); ctx.fill();
    });
  }

  function drawManor(w, h, t, alpha) {
    withAlpha(alpha, () => {
      const cx=w*.51, base=h*.69, S=Math.min(w,h)*.27;
      const lift=reduced?0:Math.sin(t*.00055)*1.6;
      ctx.save(); ctx.translate(0,lift);
      const ground=ctx.createRadialGradient(cx,base,0,cx,base,S*1.35); ground.addColorStop(0,rgba(204,195,170,.14)); ground.addColorStop(1,rgba(0,0,0,0)); ctx.fillStyle=ground; ctx.fillRect(cx-S*1.5,base-S*.3,S*3,S*.7);
      function building(x,y,ww,hh,roofH){
        const stone=ctx.createLinearGradient(x,y,x+ww,y+hh); stone.addColorStop(0,'#777876'); stone.addColorStop(.48,'#565a5b'); stone.addColorStop(1,'#363b40'); ctx.fillStyle=stone; ctx.fillRect(x,y,ww,hh);
        ctx.beginPath(); ctx.moveTo(x-ww*.04,y); ctx.lineTo(x+ww*.5,y-roofH); ctx.lineTo(x+ww*1.04,y); ctx.closePath(); ctx.fillStyle='#20252b'; ctx.fill();
        ctx.strokeStyle=rgba(201,207,207,.12); ctx.lineWidth=1; ctx.strokeRect(x,y,ww,hh);
      }
      building(cx-S*.88,base-S*.62,S*.52,S*.47,S*.19);
      building(cx+S*.36,base-S*.62,S*.52,S*.47,S*.19);
      building(cx-S*.36,base-S*.74,S*.72,S*.59,S*.24);
      building(cx-S*.18,base-S*.98,S*.36,S*.83,S*.20);
      ctx.fillStyle='#262b31'; ctx.fillRect(cx-S*.22,base-S*1.02,S*.44,S*.08);
      ctx.beginPath(); ctx.moveTo(cx-S*.23,base-S*1.02); ctx.lineTo(cx,base-S*1.22); ctx.lineTo(cx+S*.23,base-S*1.02); ctx.closePath(); ctx.fillStyle='#171c22'; ctx.fill();
      const windows=[];
      for(const side of[-1,1]) for(let row=0;row<2;row++) for(let col=0;col<3;col++) windows.push([cx+side*(S*.42+col*S*.13),base-S*.50+row*S*.19]);
      for(let row=0;row<3;row++) for(let col=-2;col<=2;col++) windows.push([cx+col*S*.105,base-S*.60+row*S*.18]);
      const pulse=reduced?.72:.58+.22*(.5+.5*Math.sin(t*.001));
      for(const [x,y] of windows){ ctx.fillStyle=rgba(235,202,121,pulse); ctx.fillRect(x-S*.027,y-S*.047,S*.054,S*.094); ctx.strokeStyle=rgba(24,31,38,.65); ctx.strokeRect(x-S*.027,y-S*.047,S*.054,S*.094); }
      ctx.beginPath(); ctx.rect(cx-S*.075,base-S*.33,S*.15,S*.18); ctx.fillStyle='#11171d'; ctx.fill();
      ctx.strokeStyle=rgba(233,218,184,.22); ctx.lineWidth=1; ctx.beginPath(); ctx.moveTo(cx-S*1.05,base-S*.12); ctx.lineTo(cx+S*1.05,base-S*.12); ctx.stroke();
      for(let i=-5;i<=5;i++){ctx.beginPath();ctx.moveTo(cx+i*S*.16,base-S*.12);ctx.lineTo(cx+i*S*.11,base+S*.18);ctx.strokeStyle=rgba(181,177,166,.10);ctx.stroke();}
      ctx.restore();
      ctx.beginPath(); ctx.ellipse(cx,h*.77,S*.88,S*.10,0,0,TAU); ctx.fillStyle=rgba(120,171,184,.06); ctx.fill();
    });
  }

  function drawTransition(w, h, p) {
    const q = ease(p);
    ctx.save();
    ctx.globalCompositeOperation = 'screen';
    for (let i = 0; i < 4; i++) {
      ctx.beginPath();
      ctx.ellipse(w * .5, h * .44, w * (.08 + q * (.38 + i * .045)), h * (.04 + q * (.20 + i * .025)), 0, 0, TAU);
      ctx.strokeStyle = rgba(i % 2 ? 120 : 225, i % 2 ? 213 : 196, i % 2 ? 232 : 126, (.10 - i * .017) * (1 - Math.abs(q - .5) * 1.35));
      ctx.lineWidth = 1.2;
      ctx.stroke();
    }
    const sweep = ctx.createLinearGradient(0, 0, w, 0);
    const x = clamp(q);
    sweep.addColorStop(Math.max(0,x-.18),rgba(255,255,255,0));
    sweep.addColorStop(x,rgba(192,230,238,.08));
    sweep.addColorStop(Math.min(1,x+.18),rgba(255,255,255,0));
    ctx.fillStyle=sweep;ctx.fillRect(0,0,w,h);
    ctx.restore();
  }

  function updateCopy() {
    label.textContent = scenes[index].label;
    count.textContent = `${index + 1} / ${scenes.length}`;
    reel.dataset.doorEstateReelScene = scenes[index].label.toLowerCase().replace(/\s+/g,'-');
  }

  function render(now) {
    raf = 0;
    if (!visible || document.hidden) return;
    if (now - lastFrame < 28 && !reduced) { raf = requestAnimationFrame(render); return; }
    lastFrame = now;
    resize();
    const w = cssWidth, h = cssHeight;
    background(w, h, now);
    if (reduced) {
      scenes[0].draw(w, h, 0, 1, 0);
    } else {
      const elapsed = now - phaseStart;
      const transitionStart = HOLD;
      if (elapsed < transitionStart) {
        scenes[index].draw(w, h, now, 1, 0);
      } else {
        const p = clamp((elapsed - transitionStart) / TRANSITION);
        const next = (index + 1) % scenes.length;
        scenes[index].draw(w, h, now, 1 - ease(p), 0);
        scenes[next].draw(w, h, now, ease(p), p);
        drawTransition(w, h, p);
        if (p >= 1) {
          index = next;
          phaseStart = now;
          updateCopy();
        }
      }
    }
    raf = requestAnimationFrame(render);
  }

  function start() {
    resize();
    reel.dataset.doorEstateReelReady = 'true';
    reel.dataset.doorEstateReelState = reduced ? 'reduced-static' : 'ready';
    reel.dataset.doorEstateReelAutoplay = reduced ? 'reduced-static' : 'automatic';
    reel.dataset.doorEstateReelInteraction = 'none';
    reel.dataset.doorEstateReelSource = 'native-canvas-geometry';
    updateCopy();
    if (!raf) raf = requestAnimationFrame(render);
  }

  if ('IntersectionObserver' in window) {
    new IntersectionObserver(entries => {
      visible = entries.some(entry => entry.isIntersecting);
      if (visible && !raf) raf = requestAnimationFrame(render);
      if (!visible && raf) { cancelAnimationFrame(raf); raf = 0; }
    }, { rootMargin: '160px' }).observe(reel);
  }
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden && visible && !raf) raf = requestAnimationFrame(render);
  });
  window.addEventListener('resize', resize, { passive: true });

  window.DGBDoorEnvironment = Object.freeze({
    contract: 'DOOR_NATIVE_GEOMETRY_MIRROR_v6',
    ready: true,
    source: 'native-canvas-geometry',
    sceneCount: scenes.length,
    sceneOrder: scenes.map(scene => scene.label),
    automaticSequence: !reduced,
    manualControlsEnabled: false,
    filmFootageUsed: false,
    nativeGeometry: true,
    transition: 'vector-crossfade-plus-reflective-ripple',
    additionalWebGLContexts: 0,
    generatedArtwork: false,
    reducedMotion: reduced
  });
  start();
})();
