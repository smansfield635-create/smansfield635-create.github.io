(() => {
  const stage = document.getElementById("products-stage");
  const lanesRoot = document.getElementById("stage-lanes");

  if (!stage || !lanesRoot) return;

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  const laneData = [
    { title: "Platform", href: "/platform/", subtitle: "Core platform lane", kicker: "Core", ring: 0, angle: -90 },
    { title: "Software", href: "/software/", subtitle: "Runtime-facing tools", kicker: "Runtime", ring: 0, angle: 25 },
    { title: "On Your Side AI", href: "/ai/", subtitle: "Intelligence lane", kicker: "Intelligence", ring: 0, angle: 145 },

    { title: "Syntax", href: "/ssg/", subtitle: "SSG language lane", kicker: "Language", ring: 1, angle: -62 },
    { title: "ArchCoin", href: "/archcoin/", subtitle: "Governed coin lane", kicker: "Value", ring: 1, angle: 5 },
    { title: "Nutrition", href: "/nutrition/", subtitle: "Baseline lane", kicker: "Baseline", ring: 1, angle: 72 },
    { title: "Energy", href: "/energy/", subtitle: "Output lane", kicker: "Output", ring: 1, angle: 155 },

    { title: "Education", href: "/education/", subtitle: "Learning lane", kicker: "Learning", ring: 2, angle: -70 },
    { title: "Games", href: "/games/", subtitle: "Playable lane", kicker: "Playable", ring: 2, angle: -5 },
    { title: "Agriculture", href: "/agriculture/", subtitle: "Applied growth lane", kicker: "Applied", ring: 2, angle: 60 },
    { title: "Domains", href: "/domains/", subtitle: "Identity lane", kicker: "Identity", ring: 2, angle: 130 },
    { title: "Diagnostics", href: "/diagnostics/", subtitle: "Measurement lane", kicker: "Measurement", ring: 2, angle: 198 }
  ];

  const tokenState = [];
  let animationFrame = 0;
  let animationStart = 0;

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function degToRad(deg) {
    return (deg * Math.PI) / 180;
  }

  function stageMetrics() {
    const rect = stage.getBoundingClientRect();
    const w = rect.width;
    const h = rect.height;
    const mobile = w <= 760;

    return {
      width: w,
      height: h,
      centerX: w * 0.5,
      centerY: h * (mobile ? 0.48 : 0.5),
      tokenW: mobile ? 132 : 152,
      tokenH: mobile ? 74 : 84,
      radii: mobile
        ? [
            { rx: w * 0.2, ry: h * 0.12 },
            { rx: w * 0.31, ry: h * 0.2 },
            { rx: w * 0.38, ry: h * 0.28 }
          ]
        : [
            { rx: w * 0.24, ry: h * 0.14 },
            { rx: w * 0.35, ry: h * 0.22 },
            { rx: w * 0.43, ry: h * 0.31 }
          ]
    };
  }

  function buildToken(item) {
    const a = document.createElement("a");
    a.className = "lane-token";
    a.href = item.href;
    a.setAttribute("aria-label", `${item.title} — ${item.subtitle}`);

    const kicker = document.createElement("span");
    kicker.className = "kicker";
    kicker.textContent = item.kicker;

    const strong = document.createElement("strong");
    strong.textContent = item.title;

    const sub = document.createElement("span");
    sub.textContent = item.subtitle;

    a.appendChild(kicker);
    a.appendChild(strong);
    a.appendChild(sub);

    lanesRoot.appendChild(a);

    return {
      el: a,
      item,
      baseAngle: item.angle,
      ring: item.ring,
      drift: item.ring === 0 ? 8 : item.ring === 1 ? 5 : 3.5,
      speed: item.ring === 0 ? 0.022 : item.ring === 1 ? -0.014 : 0.009
    };
  }

  function ensureTokens() {
    if (tokenState.length) return;
    laneData.forEach((item) => {
      tokenState.push(buildToken(item));
    });
  }

  function layoutStatic() {
    const m = stageMetrics();
    tokenState.forEach((token) => {
      const ring = m.radii[token.ring];
      const angle = degToRad(token.baseAngle);
      const x = m.centerX + Math.cos(angle) * ring.rx;
      const y = m.centerY + Math.sin(angle) * ring.ry;
      placeToken(token.el, x, y, m.tokenW, m.tokenH);
    });
  }

  function placeToken(el, cx, cy, tokenW, tokenH) {
    const left = clamp(cx - tokenW / 2, 8, stage.clientWidth - tokenW - 8);
    const top = clamp(cy - tokenH / 2, 8, stage.clientHeight - tokenH - 8);
    el.style.left = `${left}px`;
    el.style.top = `${top}px`;
  }

  function animate(timestamp) {
    if (!animationStart) animationStart = timestamp;
    const elapsed = timestamp - animationStart;
    const m = stageMetrics();

    tokenState.forEach((token) => {
      const ring = m.radii[token.ring];
      const phase = degToRad(token.baseAngle) + elapsed * token.speed * 0.001;
      const yWave = Math.sin(elapsed * 0.0012 + token.baseAngle) * token.drift;
      const x = m.centerX + Math.cos(phase) * ring.rx;
      const y = m.centerY + Math.sin(phase) * ring.ry + yWave;
      placeToken(token.el, x, y, m.tokenW, m.tokenH);
    });

    animationFrame = window.requestAnimationFrame(animate);
  }

  function stopAnimation() {
    if (animationFrame) {
      window.cancelAnimationFrame(animationFrame);
      animationFrame = 0;
    }
  }

  function startMode() {
    stopAnimation();
    if (prefersReducedMotion.matches) {
      layoutStatic();
      return;
    }
    animationStart = 0;
    animationFrame = window.requestAnimationFrame(animate);
  }

  function rebuild() {
    ensureTokens();
    startMode();
  }

  let resizeTimer = 0;
  function onResize() {
    window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(rebuild, 60);
  }

  rebuild();

  window.addEventListener("resize", onResize, { passive: true });

  if (typeof prefersReducedMotion.addEventListener === "function") {
    prefersReducedMotion.addEventListener("change", startMode);
  } else if (typeof prefersReducedMotion.addListener === "function") {
    prefersReducedMotion.addListener(startMode);
  }
})();
