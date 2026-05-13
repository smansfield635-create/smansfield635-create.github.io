// /showroom/globe/h-earth/index.js
// TNT FULL-FILE REPLACEMENT
// H_EARTH_LIVE_WORLD_FAILSAFE_HTML_SHELL_TNT_v6
// Owns: enhancement-only live-world boot for the H-Earth visible HTML shell.
// Rule: never replace the full body; never cause white-page collapse.

const CONTRACT = "H_EARTH_LIVE_WORLD_FAILSAFE_HTML_SHELL_TNT_v6";
const GROUND_RENDER_CACHE_KEY = "H_EARTH_WESTERN_GOLDEN_SHELF_LIVE_WORLD_RENDER_TNT_v5";

function setStatus(text) {
  const node = document.querySelector("[data-render-status]");
  if (node) node.textContent = text;
}

function markDocument(extra = {}) {
  const markers = {
    page: "h-earth-live-world-failsafe-shell",
    route: "/showroom/globe/h-earth/",
    contract: CONTRACT,
    renderer: "live-procedural-world",
    staticImageDependency: "false",
    pngDependency: "false",
    waterBehindManor: "true",
    cameraFacing: "west-southwest",
    finalArchitectureAuthorized: "false",
    ...extra
  };

  Object.entries(markers).forEach(([key, value]) => {
    document.documentElement.dataset[key] = String(value);
    document.body.dataset[key] = String(value);
  });
}

function seed(index, salt = 0) {
  return ((Math.sin(index * 12.9898 + salt * 78.233) * 43758.5453123) % 1 + 1) % 1;
}

function drawFailsafeLiveWorld(canvas, time = performance.now() / 1000) {
  const ctx = canvas?.getContext?.("2d", { alpha: false });
  if (!canvas || !ctx) return null;

  const box = canvas.getBoundingClientRect();
  const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
  const w = Math.max(720, Math.floor((box.width || 900) * dpr));
  const h = Math.max(900, Math.floor((box.height || 1120) * dpr));

  if (canvas.width !== w || canvas.height !== h) {
    canvas.width = w;
    canvas.height = h;
  }

  ctx.clearRect(0, 0, w, h);
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";

  const sky = ctx.createLinearGradient(0, 0, 0, h);
  sky.addColorStop(0, "rgb(104,128,145)");
  sky.addColorStop(0.25, "rgb(183,187,175)");
  sky.addColorStop(0.48, "rgb(218,197,158)");
  sky.addColorStop(0.78, "rgb(86,112,101)");
  sky.addColorStop(1, "rgb(35,54,44)");
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, w, h);

  const sun = ctx.createRadialGradient(w * .78, h * .14, 0, w * .78, h * .14, w * .58);
  sun.addColorStop(0, "rgba(255,238,194,.48)");
  sun.addColorStop(.22, "rgba(255,221,151,.28)");
  sun.addColorStop(1, "rgba(255,205,125,0)");
  ctx.fillStyle = sun;
  ctx.fillRect(0, 0, w, h);

  ctx.fillStyle = "rgba(22,32,34,.58)";
  for (const island of [[.10,.36,.06,.04],[.62,.35,.05,.03],[.86,.34,.06,.04]]) {
    const [cx, cy, sx, sy] = island;
    ctx.beginPath();
    ctx.moveTo(w*(cx-sx), h*cy);
    ctx.lineTo(w*(cx-sx*.4), h*(cy-sy*.5));
    ctx.lineTo(w*cx, h*(cy-sy));
    ctx.lineTo(w*(cx+sx*.5), h*(cy-sy*.25));
    ctx.lineTo(w*(cx+sx), h*cy);
    ctx.closePath();
    ctx.fill();
  }

  const waterTop = h * .365;
  const waterBottom = h * .585;
  const ocean = ctx.createLinearGradient(0, waterTop, 0, waterBottom);
  ocean.addColorStop(0, "rgba(79,130,139,.98)");
  ocean.addColorStop(.45, "rgba(43,103,128,.97)");
  ocean.addColorStop(1, "rgba(19,68,94,.98)");
  ctx.fillStyle = ocean;
  ctx.fillRect(0, waterTop, w, waterBottom - waterTop);

  ctx.strokeStyle = "rgba(255,236,178,.20)";
  ctx.lineWidth = Math.max(1, w * .001);
  for (let j = 0; j < 24; j += 1) {
    const y = waterTop + h * .025 + j * h * .007;
    ctx.globalAlpha = Math.max(.035, .16 - j * .004);
    ctx.beginPath();
    for (let i = 0; i <= 72; i += 1) {
      const x = (i / 72) * w;
      const wave = Math.sin(i * .92 + j * .5 + time * .9) * h * .0022;
      if (i === 0) ctx.moveTo(x, y + wave);
      else ctx.lineTo(x, y + wave);
    }
    ctx.stroke();
  }
  ctx.globalAlpha = 1;

  const landTop = h * .555;
  const ground = ctx.createLinearGradient(0, landTop, 0, h);
  ground.addColorStop(0, "rgb(137,126,70)");
  ground.addColorStop(.35, "rgb(75,95,58)");
  ground.addColorStop(.72, "rgb(36,57,40)");
  ground.addColorStop(1, "rgb(19,31,26)");
  ctx.fillStyle = ground;
  ctx.beginPath();
  ctx.moveTo(0, landTop);
  for (let i = 0; i <= 80; i += 1) {
    const x = (i / 80) * w;
    const y = landTop + Math.sin(i * .47) * h * .011 + Math.sin(i * 1.3) * h * .006;
    ctx.lineTo(x, y);
  }
  ctx.lineTo(w, h);
  ctx.lineTo(0, h);
  ctx.closePath();
  ctx.fill();

  drawFailsafeManor(ctx, w, h);
  drawFailsafeVegetation(ctx, w, h, time);
  drawFailsafeWildlife(ctx, w, h, time);

  const haze = ctx.createLinearGradient(0, h * .34, 0, h * .63);
  haze.addColorStop(0, "rgba(255,244,219,.06)");
  haze.addColorStop(.45, "rgba(255,235,186,.08)");
  haze.addColorStop(1, "rgba(255,235,186,0)");
  ctx.fillStyle = haze;
  ctx.fillRect(0, h * .32, w, h * .34);

  return {
    contract: CONTRACT,
    renderer: "failsafe-live-world",
    rendered: true,
    staticImageDependency: false,
    waterBehindManor: true
  };
}

function drawFailsafeManor(ctx, w, h) {
  const cx = w * .5;
  const baseY = h * .615;
  const width = w * .4;
  const height = h * .2;
  const bodyTop = baseY - height * .58;
  const bodyH = height * .55;

  const wall = ctx.createLinearGradient(cx - width * .55, bodyTop, cx + width * .55, baseY);
  wall.addColorStop(0, "rgb(71,63,52)");
  wall.addColorStop(.45, "rgb(180,146,88)");
  wall.addColorStop(1, "rgb(40,36,34)");
  ctx.fillStyle = wall;
  ctx.strokeStyle = "rgba(235,203,137,.38)";
  ctx.lineWidth = Math.max(1, w * .0014);

  function rect(x, y, rw, rh) {
    ctx.beginPath();
    ctx.roundRect(x, y, rw, rh, Math.max(2, w * .004));
    ctx.fill();
    ctx.stroke();
  }

  rect(cx - width * .31, bodyTop + bodyH * .16, width * .62, bodyH * .86);
  rect(cx - width * .16, bodyTop - bodyH * .02, width * .32, bodyH * 1.06);
  rect(cx - width * .51, bodyTop + bodyH * .32, width * .22, bodyH * .70);
  rect(cx + width * .29, bodyTop + bodyH * .32, width * .22, bodyH * .70);

  ctx.fillStyle = "rgb(48,39,35)";
  for (const roof of [
    [[cx-width*.36,bodyTop+bodyH*.16],[cx,bodyTop-height*.22],[cx+width*.36,bodyTop+bodyH*.16]],
    [[cx-width*.18,bodyTop-bodyH*.02],[cx,bodyTop-height*.29],[cx+width*.18,bodyTop-bodyH*.02]]
  ]) {
    ctx.beginPath();
    ctx.moveTo(roof[0][0], roof[0][1]);
    ctx.lineTo(roof[1][0], roof[1][1]);
    ctx.lineTo(roof[2][0], roof[2][1]);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  }

  ctx.fillStyle = "rgba(255,214,137,.78)";
  for (let floor = 0; floor < 3; floor += 1) {
    const y = bodyTop + bodyH * (.28 + floor * .21);
    for (let i = -4; i <= 4; i += 1) {
      if (i === 0 && floor > 0) continue;
      const x = cx + i * width * .065;
      ctx.beginPath();
      ctx.roundRect(x - width*.012, y, width*.024, bodyH*.082, 2);
      ctx.fill();
    }
  }
}

function drawFailsafeVegetation(ctx, w, h, time) {
  for (let i = 0; i < 120; i += 1) {
    const x = seed(i, 110) * w;
    const y = h * (.58 + seed(i, 111) * .38);
    const scale = h * (.004 + seed(i, 112) * .014);
    const sway = Math.sin(time * .75 + i * .7) * scale * .7;

    ctx.fillStyle = seed(i, 114) > .45 ? "rgba(73,133,75,.30)" : "rgba(166,172,94,.24)";
    ctx.beginPath();
    ctx.ellipse(x + sway, y, scale * 2.2, scale * .55, seed(i, 115), 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawFailsafeWildlife(ctx, w, h, time) {
  ctx.strokeStyle = "rgba(21,29,31,.46)";
  ctx.lineWidth = Math.max(1, w * .001);
  for (let i = 0; i < 7; i += 1) {
    const x = ((seed(i, 210) + ((time * .025) % 1) * (.06 + seed(i, 211) * .05)) % 1) * w;
    const y = h * (.12 + seed(i, 212) * .17);
    const s = w * (.004 + seed(i, 213) * .004);
    const flap = Math.sin(time * 2.2 + i) * s * .35;
    ctx.beginPath();
    ctx.moveTo(x - s, y);
    ctx.quadraticCurveTo(x - s*.5, y - s*.5 - flap, x, y);
    ctx.quadraticCurveTo(x + s*.5, y - s*.5 + flap, x + s, y);
    ctx.stroke();
  }
}

async function startRenderer() {
  const canvas = document.querySelector("[data-manor-ground-canvas]");
  if (!canvas) {
    setStatus("Canvas mount missing. HTML shell remains visible.");
    return null;
  }

  try {
    const mod = await import(`/assets/h-earth/h-earth.western-golden-shelf.ground.render.js?v=${GROUND_RENDER_CACHE_KEY}`);

    if (mod?.createWesternGoldenShelfGroundRenderer) {
      const renderer = mod.createWesternGoldenShelfGroundRenderer(canvas, {
        dpr: Math.min(window.devicePixelRatio || 1, 2),
        targetFrameMs: 50
      }).start();

      setStatus("Live procedural renderer active.");
      markDocument({ rendererActive: "true", fallbackRenderer: "false" });
      return renderer;
    }

    throw new Error("createWesternGoldenShelfGroundRenderer export missing.");
  } catch (error) {
    setStatus(`Module renderer unavailable. Failsafe live renderer active. ${error?.message || ""}`);
    markDocument({ rendererActive: "true", fallbackRenderer: "true" });

    let raf = 0;
    let lastReceipt = null;

    function draw(time) {
      lastReceipt = drawFailsafeLiveWorld(canvas, time / 1000);
      raf = requestAnimationFrame(draw);
    }

    raf = requestAnimationFrame(draw);

    return {
      status() {
        return {
          contract: CONTRACT,
          renderer: "failsafe-live-world",
          running: Boolean(raf),
          lastReceipt
        };
      }
    };
  }
}

async function init() {
  markDocument({ boot: "started" });

  let renderer = null;
  let error = null;

  try {
    renderer = await startRenderer();
  } catch (err) {
    error = err?.message || "Unexpected renderer boot failure.";
    setStatus(`Renderer boot failed. HTML shell remains visible. ${error}`);
    markDocument({ rendererActive: "false", bootError: error });
  }

  window.DGBHEarthGroundScout = Object.freeze({
    status() {
      return Object.freeze({
        contract: CONTRACT,
        route: "/showroom/globe/h-earth/",
        renderer: renderer?.status?.() || null,
        bootError: error,
        htmlShellVisible: true,
        staticImageDependency: false,
        pngDependency: false,
        waterBehindManor: true,
        cameraFacing: "west-southwest",
        finalArchitectureAuthorized: false
      });
    }
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init, { once: true });
} else {
  init();
}

export default init;
