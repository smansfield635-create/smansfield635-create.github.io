(function () {
  "use strict";

  const TAU = Math.PI * 2;

  const DRAGON_RULES = Object.freeze({
    BODY_SCALE: 0.35,
    GLOW_INTENSITY: 0.4,
    WAKE_INTENSITY: 0.3,
    REFLECTION_INTENSITY: 0.2,
    DISTANCE_FACTOR: 0.55,
    COLOR_DIM: 0.72,
  });

  const DRAGON_CYCLE_FRAMES = 1890;
  const WISDOM_DELAY = 0.12;
  const DRAGON_SEGMENTS = 44;
  const DRAGON_LAG = 0.0092;

  const PHRASE_ROLE_BY_DRAGON = Object.freeze({
    fear: "control",
    wisdom: "alignment",
  });

  const BANNER_PHRASES = Object.freeze({
    zh: {
      alignment: ["道生一，一生二，二生三，三生萬物", "上善若水", "天知地知我知", "苦盡甘來", "德定命"],
      control: ["少說多做", "一時之利，千古之恨", "當機立斷", "性格決定命運"],
    },
    en: {
      alignment: ["The Dao Gives Birth", "Be Like Water", "Heaven Earth I Know", "After Bitterness Sweetness", "Virtue Determines Fate"],
      control: ["Speak Less Do More", "Momentary Gain Lasting Regret", "Act Decisively", "Character Determines Destiny"],
    },
    es: {
      alignment: ["El Dao Da Origen", "Se Como El Agua", "Cielo Tierra Y Yo", "Tras Amargura Dulzura", "La Virtud Define El Destino"],
      control: ["Habla Menos Haz Mas", "Ganancia Breve Arrepentimiento Largo", "Decide Sin Vacilar", "El Carácter Decide El Destino"],
    },
  });

  function clamp(v, min, max) {
    return Math.max(min, Math.min(max, v));
  }

  function lerp(a, b, t) {
    return a + (b - a) * t;
  }

  function angleBetween(a, b) {
    return Math.atan2(b.y - a.y, b.x - a.x);
  }

  function getCycleIndex(state) {
    if (!state.dragonLoop) return 0;
    return Math.floor(Math.max(0, state.tick - state.dragonStart) / DRAGON_CYCLE_FRAMES);
  }

  function getBannerPair(dragonType, sceneLanguage, state) {
    const role = PHRASE_ROLE_BY_DRAGON[dragonType] || "alignment";
    const cycle = getCycleIndex(state);
    const secondaryLang = sceneLanguage === "es" ? "es" : "en";
    const zhList = BANNER_PHRASES.zh[role] || BANNER_PHRASES.zh.alignment;
    const secList =
      (BANNER_PHRASES[secondaryLang] && BANNER_PHRASES[secondaryLang][role]) ||
      BANNER_PHRASES.en.alignment;
    const zhPhrase = zhList[cycle % zhList.length];
    const secPhrase = secList[cycle % secList.length];
    const swap = cycle % 2 === 1;
    const text =
      dragonType === "fear" ? (swap ? secPhrase : zhPhrase) : swap ? zhPhrase : secPhrase;
    return {
      text,
      isChinese: dragonType === "fear" ? !swap : swap,
    };
  }

  function getCycleProgress(state) {
    if (!state.dragonLoop) return null;
    return ((state.tick - state.dragonStart) % DRAGON_CYCLE_FRAMES) / DRAGON_CYCLE_FRAMES;
  }

  function dragonOrbit(geo, t, dragonType, state) {
    const center = state.motion.dragons.orbitCenter;
    const moonWeight = dragonType === "wisdom" ? 0.85 : 0.7;
    const moonAnchorX = state.background.moon.x || window.innerWidth * 0.8;
    const moonAnchorY =
      (state.background.moon.y || window.innerHeight * 0.15) + geo.size * 0.1;
    const cubeAnchorX = geo.centerX;
    const cubeAnchorY = geo.centerY - geo.size * 0.18;
    const anchorX = lerp(cubeAnchorX, moonAnchorX, moonWeight);
    const anchorY = lerp(cubeAnchorY, moonAnchorY, moonWeight);
    const corridorBiasX = (center.x || 0) * 0.08 * DRAGON_RULES.DISTANCE_FACTOR;
    const corridorBiasY = (center.y || 240) * -0.04 * DRAGON_RULES.DISTANCE_FACTOR;
    const shell =
      geo.size *
      4.6 *
      (((state.motion.dragons.orbitRadius || 420) / 420) * DRAGON_RULES.DISTANCE_FACTOR);
    const phase = dragonType === "fear" ? 0 : Math.PI;
    const a = t * TAU * (0.86 + (state.motion.dragons.orbitSpeed || 0.0019) * 380) + phase;
    const bend = Math.sin(a) * Math.cos(a);
    const northPull = state.camera.requested === "travel_projection" ? 1.18 : 1;
    const x = Math.cos(a) * shell + Math.sin(a * 2.0) * shell * 0.14;
    const y = bend * shell * 0.24 * northPull - Math.cos(a * 0.5) * shell * 0.06;
    const z =
      Math.sin(a) * shell * 0.3 +
      Math.cos(a * 2.0) * shell * 0.1 +
      (dragonType === "fear" ? -0.1 : 0.1);

    return {
      x: anchorX + corridorBiasX + x,
      y: anchorY + corridorBiasY + y,
      z: z / (shell * 0.4),
      a,
    };
  }

  function buildDragonBody(geo, dragonType, delay, state) {
    const prog = getCycleProgress(state);
    if (prog === null) return null;

    const points = [];
    for (let i = 0; i < DRAGON_SEGMENTS; i++) {
      const raw = prog - delay - i * DRAGON_LAG;
      const t = ((raw % 1) + 1) % 1;
      const p = dragonOrbit(geo, t, dragonType, state);
      const cross = 1 - Math.min(1, Math.abs(Math.sin(p.a + (dragonType === "fear" ? 0 : Math.PI))));
      const crossThin = 1 - cross * 0.22;

      const wavePrimary =
        Math.sin(state.tick * 0.018 + i * 0.37 + (dragonType === "fear" ? 0 : Math.PI)) *
        geo.size *
        0.01;
      const waveSecondary =
        Math.sin(
          state.tick * 0.031 +
            i * 0.71 +
            (dragonType === "fear" ? 0.4 : Math.PI + 0.4)
        ) *
        geo.size *
        0.006;
      const waveTertiary =
        Math.cos(
          state.tick * 0.013 +
            i * 0.23 +
            (dragonType === "fear" ? 0.9 : Math.PI + 0.9)
        ) *
        geo.size *
        0.0035;
      const wave = wavePrimary * 0.62 + waveSecondary * 0.28 + waveTertiary * 0.1;

      const liftPrimary =
        Math.cos(state.tick * 0.012 + i * 0.28 + (dragonType === "fear" ? 0 : Math.PI)) *
        geo.size *
        0.007;
      const liftSecondary =
        Math.sin(
          state.tick * 0.022 +
            i * 0.49 +
            (dragonType === "fear" ? 0.6 : Math.PI + 0.6)
        ) *
        geo.size *
        0.004;
      const waveY = liftPrimary * 0.72 + liftSecondary * 0.28;

      const nx = -Math.sin(p.a);
      const ny = Math.cos(p.a) * 0.18;

      points.push({
        x: p.x + nx * wave,
        y: p.y + ny * wave + waveY,
        z: p.z,
        a: p.a,
        crossThin,
        t,
      });
    }

    return { points };
  }

  function getDragonBundles(geo, state) {
    return {
      fear: buildDragonBody(geo, "fear", 0, state),
      wisdom: buildDragonBody(geo, "wisdom", WISDOM_DELAY, state),
    };
  }

  function drawPortalAt(ctx, x, y, r, colorA, colorB, tick) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(Math.sin(tick * 0.01 + x * 0.01) * 0.12);
    ctx.globalAlpha = 0.34 * DRAGON_RULES.GLOW_INTENSITY;
    ctx.strokeStyle = colorA;
    ctx.lineWidth = 1.6;
    ctx.shadowBlur = 10;
    ctx.shadowColor = colorB;
    ctx.beginPath();
    ctx.ellipse(0, 0, r * 0.22, r * 0.07, 0, 0, TAU);
    ctx.stroke();
    ctx.beginPath();
    ctx.ellipse(0, 0, r * 0.14, r * 0.04, 0, 0, TAU);
    ctx.stroke();
    ctx.restore();
  }

  function drawScalePatch(ctx, x, y, a, sx, sy, color, alpha) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(a);
    ctx.globalAlpha = alpha;
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(-sx, 0);
    ctx.quadraticCurveTo(0, -sy, sx, 0);
    ctx.quadraticCurveTo(0, sy, -sx, 0);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  function drawWhiskerSet(ctx, x, y, angle, len, color, alpha, flip) {
    const dir = flip ? -1 : 1;
    for (let i = 0; i < 2; i++) {
      const localLen = len * (i === 0 ? 1 : 0.72);
      ctx.save();
      ctx.translate(x, y + (i === 0 ? 0 : dir * 3.2));
      ctx.rotate(angle + dir * (0.22 + i * 0.12));
      ctx.globalAlpha = alpha * (i === 0 ? 1 : 0.8);
      ctx.strokeStyle = color;
      ctx.lineWidth = i === 0 ? 1.5 : 1.1;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.quadraticCurveTo(localLen * 0.16, dir * localLen * 0.08, localLen * 0.58, dir * localLen * 0.2);
      ctx.quadraticCurveTo(localLen * 0.84, dir * localLen * 0.28, localLen, dir * localLen * 0.42);
      ctx.stroke();
      ctx.restore();
    }
  }

  function drawDragonWake(ctx, bundle, color) {
    if (!bundle || !bundle.points || bundle.points.length < 8) return;
    ctx.save();
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.shadowBlur = 8;
    ctx.shadowColor = color;
    ctx.strokeStyle = color;
    ctx.globalAlpha = 0.18 * DRAGON_RULES.WAKE_INTENSITY;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(bundle.points[0].x, bundle.points[0].y);
    for (let i = 1; i < Math.min(bundle.points.length, 16); i++) {
      ctx.lineTo(bundle.points[i].x, bundle.points[i].y);
    }
    ctx.stroke();
    ctx.restore();
  }

  function drawDragonSpines(ctx, points, a, color) {
    const max = Math.min(points.length - 2, points.length);
    for (let i = 1; i < max; i += 2) {
      const p = points[i];
      const t = p.t;
      const size = t < 0.16 ? 6 : t < 0.45 ? 4.5 : t < 0.75 ? 3.2 : 2;
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(a);
      ctx.globalAlpha = 0.3 * DRAGON_RULES.COLOR_DIM;
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.moveTo(-size * 0.35, -size * 0.05);
      ctx.lineTo(0, -size);
      ctx.lineTo(size * 0.35, -size * 0.05);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    }
  }

  function drawFearFire(ctx, head, next, tick) {
    const a = angleBetween(head, next);
    const pulse = 0.78 + Math.sin(tick * 0.16) * 0.12 + Math.sin(tick * 0.05) * 0.08;
    const len = 24 * pulse;
    const width = 7 * pulse;

    ctx.save();
    ctx.translate(head.x, head.y);
    ctx.rotate(a);
    ctx.globalAlpha = 0.42 * DRAGON_RULES.GLOW_INTENSITY;
    const g = ctx.createLinearGradient(0, 0, len, 0);
    g.addColorStop(0, "rgba(255,244,200,0.86)");
    g.addColorStop(0.28, "rgba(255,182,84,0.78)");
    g.addColorStop(0.72, "rgba(228,82,38,0.54)");
    g.addColorStop(1, "rgba(160,24,16,0)");
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.moveTo(16, -width * 0.55);
    ctx.quadraticCurveTo(24, -width * 0.8, 16 + len, 0);
    ctx.quadraticCurveTo(24, width * 0.8, 16, width * 0.55);
    ctx.closePath();
    ctx.fill();

    ctx.globalAlpha = 0.28 * DRAGON_RULES.GLOW_INTENSITY;
    ctx.fillStyle = "rgba(255,220,140,0.80)";
    ctx.beginPath();
    ctx.moveTo(16, -width * 0.2);
    ctx.quadraticCurveTo(22, -width * 0.35, 16 + len * 0.58, 0);
    ctx.quadraticCurveTo(22, width * 0.35, 16, width * 0.2);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  function drawDragonHead(ctx, head, next, baseFill, glowColor, accentFill, dragonType, tick) {
    const a = angleBetween(head, next);
    const headScale = dragonType === "fear" ? 0.98 : 0.94;

    ctx.save();
    ctx.translate(head.x, head.y);
    ctx.rotate(a);
    ctx.shadowBlur = 10 * DRAGON_RULES.GLOW_INTENSITY;
    ctx.shadowColor = glowColor;
    ctx.fillStyle = baseFill;
    ctx.beginPath();
    ctx.moveTo(26 * headScale, 0);
    ctx.lineTo(17 * headScale, -6 * headScale);
    ctx.lineTo(8 * headScale, -14 * headScale);
    ctx.lineTo(-3 * headScale, -16 * headScale);
    ctx.lineTo(-17 * headScale, -10 * headScale);
    ctx.lineTo(-27 * headScale, -3 * headScale);
    ctx.lineTo(-31 * headScale, 0);
    ctx.lineTo(-27 * headScale, 3 * headScale);
    ctx.lineTo(-17 * headScale, 10 * headScale);
    ctx.lineTo(-3 * headScale, 16 * headScale);
    ctx.lineTo(8 * headScale, 14 * headScale);
    ctx.lineTo(17 * headScale, 6 * headScale);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = accentFill;
    ctx.beginPath();
    ctx.moveTo(17 * headScale, 0);
    ctx.lineTo(8 * headScale, -6 * headScale);
    ctx.lineTo(-3 * headScale, -5 * headScale);
    ctx.lineTo(-8 * headScale, 0);
    ctx.lineTo(-3 * headScale, 5 * headScale);
    ctx.lineTo(8 * headScale, 6 * headScale);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = "rgba(255,248,224,0.92)";
    ctx.beginPath();
    ctx.arc(7 * headScale, -4.5 * headScale, 2.1 * headScale, 0, TAU);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(7 * headScale, 4.5 * headScale, 0.95 * headScale, 0, TAU);
    ctx.fill();

    ctx.fillStyle = "rgba(255,232,170,0.84)";
    ctx.beginPath();
    ctx.moveTo(3 * headScale, -12 * headScale);
    ctx.lineTo(-7 * headScale, -22 * headScale);
    ctx.lineTo(-2 * headScale, -9 * headScale);
    ctx.closePath();
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(3 * headScale, 12 * headScale);
    ctx.lineTo(-7 * headScale, 22 * headScale);
    ctx.lineTo(-2 * headScale, 9 * headScale);
    ctx.closePath();
    ctx.fill();
    ctx.restore();

    drawWhiskerSet(
      ctx,
      head.x + 3 * headScale,
      head.y - 2 * headScale,
      a,
      34 * headScale,
      "rgba(255,238,205,0.60)",
      0.72,
      false
    );
    drawWhiskerSet(
      ctx,
      head.x + 3 * headScale,
      head.y + 2 * headScale,
      a,
      34 * headScale,
      "rgba(255,238,205,0.60)",
      0.72,
      true
    );

    if (dragonType === "fear") {
      drawFearFire(ctx, head, next, tick);
    }
  }

  function drawDragonHair(ctx, points, glowColor) {
    if (points.length < 6) return;
    const head = points[0];
    const neck = points[4];
    const a = angleBetween(head, neck);

    for (let i = 0; i < 5; i++) {
      const len = 18 + i * 6;
      const offset = i * 2.2;
      ctx.save();
      ctx.translate(head.x - 4 - offset, head.y);
      ctx.rotate(a + Math.PI);
      ctx.globalAlpha = 0.1 + i * 0.03;
      ctx.strokeStyle = glowColor;
      ctx.lineWidth = i < 2 ? 1.2 : 0.9;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.quadraticCurveTo(-len * 0.18, -len * 0.22, -len * 0.66, -len * 0.16);
      ctx.quadraticCurveTo(-len, -len * 0.02, -len * 1.1, len * 0.08);
      ctx.stroke();
      ctx.restore();
    }
  }

  function drawBanner(ctx, bundle, dragonType, sceneLanguage, state) {
    if (!bundle || !bundle.points || bundle.points.length < 18) return;

    const pts = bundle.points;
    const start = 5;
    const end = 17;
    const baseColor =
      dragonType === "fear" ? "rgba(120,26,24,0.54)" : "rgba(154,118,34,0.52)";
    const edgeColor =
      dragonType === "fear" ? "rgba(220,132,110,0.52)" : "rgba(236,214,160,0.54)";
    const textColor =
      dragonType === "fear" ? "rgba(255,230,218,0.72)" : "rgba(58,30,12,0.74)";
    const wavePhase = state.tick * 0.08 + (dragonType === "fear" ? 0 : 1.4);
    const phrase = getBannerPair(dragonType, sceneLanguage, state);
    const upper = [];
    const lower = [];

    for (let i = start; i <= end; i++) {
      const p = pts[i];
      const prev = pts[Math.max(0, i - 1)];
      const next = pts[Math.min(pts.length - 1, i + 1)];
      const a = angleBetween(prev, next);
      const nx = -Math.sin(a);
      const ny = Math.cos(a);
      const width =
        (i === start ? 9.4 : lerp(8.6, 3.4, (i - start) / (end - start))) * p.crossThin;
      const flutter = Math.sin(wavePhase + i * 0.55) * (i === start ? 1.0 : 1.5);
      upper.push({
        x: p.x + nx * (width + flutter * 0.18),
        y: p.y + ny * (width + flutter * 0.28),
      });
      lower.push({
        x: p.x - nx * (width * 0.66 + flutter * 0.2),
        y: p.y - ny * (width * 0.66 + flutter * 0.3),
      });
    }

    ctx.save();
    ctx.globalAlpha = 0.54;
    ctx.beginPath();
    ctx.moveTo(upper[0].x, upper[0].y);
    for (let i = 1; i < upper.length; i++) ctx.lineTo(upper[i].x, upper[i].y);
    for (let i = lower.length - 1; i >= 0; i--) ctx.lineTo(lower[i].x, lower[i].y);
    ctx.closePath();
    const grad = ctx.createLinearGradient(
      upper[0].x,
      upper[0].y,
      lower[lower.length - 1].x,
      lower[lower.length - 1].y
    );
    grad.addColorStop(0, edgeColor);
    grad.addColorStop(0.16, baseColor);
    grad.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = grad;
    ctx.fill();
    ctx.restore();

    const textAnchor = pts[11];
    const leftAnchor = pts[8];
    const rightAnchor = pts[14];
    const textDir = angleBetween(leftAnchor, rightAnchor);

    ctx.save();
    ctx.translate(textAnchor.x, textAnchor.y);
    ctx.rotate(textDir);
    ctx.fillStyle = textColor;
    ctx.font = phrase.isChinese
      ? 'italic 700 7.8px "Georgia","Times New Roman",serif'
      : 'italic 700 6.8px "Georgia","Times New Roman",serif';
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(phrase.text, 0, 0);
    ctx.restore();
  }

  function drawDragonHalf(
    ctx,
    bundle,
    dragonType,
    baseFill,
    glowColor,
    accent,
    front,
    tick,
    sceneLanguage,
    state
  ) {
    if (!bundle || !bundle.points || bundle.points.length < 6) return;

    const points = bundle.points;
    let spineAngle = 0;

    for (let i = points.length - 1; i >= 1; i--) {
      const p = points[i];
      if (front ? p.z < 0 : p.z >= 0) continue;

      const prev = points[Math.max(0, i - 1)];
      const next = points[Math.min(points.length - 1, i + 1)];
      const t = i / (points.length - 1);
      const depthScale = lerp(1.06, 0.82, (p.z + 1) / 2);

      let baseRadius;
      if (t < 0.08) baseRadius = 18;
      else if (t < 0.2) baseRadius = lerp(18, 9, (t - 0.08) / 0.12);
      else if (t < 0.7) baseRadius = lerp(9, 6, (t - 0.2) / 0.5);
      else baseRadius = lerp(6, 2, (t - 0.7) / 0.3);

      const radius = baseRadius * DRAGON_RULES.BODY_SCALE * depthScale * p.crossThin;
      const a = angleBetween(prev, next);
      spineAngle = a;

      ctx.save();
      ctx.globalAlpha = (0.72 - t * 0.14) * clamp(1 + p.z * 0.1, 0.66, 1.08) * DRAGON_RULES.COLOR_DIM;
      ctx.shadowBlur = 8 * DRAGON_RULES.GLOW_INTENSITY;
      ctx.shadowColor = glowColor;
      ctx.fillStyle = baseFill;
      ctx.translate(p.x, p.y);
      ctx.rotate(a);
      ctx.beginPath();
      ctx.ellipse(0, 0, radius * 1.16, radius, 0, 0, TAU);
      ctx.fill();
      ctx.restore();

      drawScalePatch(ctx, p.x, p.y - radius * 0.08, a, radius * 0.42, radius * 0.18, accent, 0.22);
      if (i % 3 === 0) {
        drawScalePatch(
          ctx,
          p.x + radius * 0.1,
          p.y - radius * 0.16,
          a,
          radius * 0.12,
          radius * 0.06,
          "rgba(255,244,210,0.20)",
          0.12
        );
      }
    }

    if (front) {
      drawBanner(ctx, bundle, dragonType, sceneLanguage, state);
      drawDragonHair(ctx, points, glowColor);
      drawDragonSpines(ctx, points, spineAngle, accent);
      drawDragonHead(ctx, points[0], points[3], baseFill, glowColor, accent, dragonType, tick);
    }
  }

  function drawDragonReflections(ctx, geo, preset, bundles, tick) {
    const horizon = window.innerHeight * preset.horizon;
    const reflectionSets = [
      { bundle: bundles.fear, color: "rgba(255,100,76,0.16)" },
      { bundle: bundles.wisdom, color: "rgba(255,214,126,0.14)" },
    ];

    for (let b = 0; b < reflectionSets.length; b++) {
      const bundle = reflectionSets[b].bundle;
      if (!bundle || !bundle.points || bundle.points.length < 2) continue;

      ctx.save();
      ctx.shadowBlur = 6;
      ctx.shadowColor = reflectionSets[b].color;

      for (let i = bundle.points.length - 1; i >= 1; i -= 2) {
        const p = bundle.points[i];
        const prev = bundle.points[Math.max(0, i - 1)];
        const next = bundle.points[Math.min(bundle.points.length - 1, i + 1)];
        const t = i / (bundle.points.length - 1);
        const a = angleBetween(prev, next);
        const ry = horizon + (horizon - p.y);
        const rippleX = Math.sin(tick * 0.028 + i * 0.8) * 1.2;
        const rippleY = Math.sin(tick * 0.017 + i * 0.55) * 0.5;
        const radius = (8 * Math.pow(1 - t, 1.18) + 1.2) * 0.58 * DRAGON_RULES.REFLECTION_INTENSITY;

        ctx.save();
        ctx.globalAlpha = 0.4 * DRAGON_RULES.REFLECTION_INTENSITY;
        ctx.translate(p.x + rippleX, ry + rippleY);
        ctx.rotate(-a);
        ctx.fillStyle = reflectionSets[b].color;
        ctx.beginPath();
        ctx.ellipse(0, 0, radius * 1.22, radius * 0.48, 0, 0, TAU);
        ctx.fill();
        ctx.restore();
      }

      ctx.restore();
    }
  }

  function drawBack(ctx, geo, bundles, tick) {
    if (bundles.fear && bundles.fear.points.length) {
      drawPortalAt(
        ctx,
        bundles.fear.points[0].x,
        bundles.fear.points[0].y,
        geo.size,
        "rgba(180,72,48,0.54)",
        "rgba(180,72,48,0.28)",
        tick
      );
      drawDragonWake(ctx, bundles.fear, "rgba(150,72,54,0.40)");
      drawDragonHalf(
        ctx,
        bundles.fear,
        "fear",
        "rgba(92,20,18,0.82)",
        "rgba(148,58,34,0.34)",
        "rgba(176,98,62,0.48)",
        false,
        tick,
        "en",
        { tick, dragonLoop: true, dragonStart: 0 }
      );
    }

    if (bundles.wisdom && bundles.wisdom.points.length) {
      drawPortalAt(
        ctx,
        bundles.wisdom.points[0].x,
        bundles.wisdom.points[0].y,
        geo.size,
        "rgba(180,154,84,0.54)",
        "rgba(180,154,84,0.22)",
        tick
      );
      drawDragonWake(ctx, bundles.wisdom, "rgba(170,150,84,0.34)");
      drawDragonHalf(
        ctx,
        bundles.wisdom,
        "wisdom",
        "rgba(112,92,24,0.78)",
        "rgba(190,168,84,0.26)",
        "rgba(212,188,112,0.42)",
        false,
        tick,
        "en",
        { tick, dragonLoop: true, dragonStart: 0 }
      );
    }
  }

  function drawFront(ctx, geo, bundles, tick, sceneLanguage, state) {
    if (bundles.fear) {
      drawDragonHalf(
        ctx,
        bundles.fear,
        "fear",
        "rgba(92,20,18,0.82)",
        "rgba(148,58,34,0.34)",
        "rgba(176,98,62,0.48)",
        true,
        tick,
        sceneLanguage,
        state
      );
    }

    if (bundles.wisdom) {
      drawDragonHalf(
        ctx,
        bundles.wisdom,
        "wisdom",
        "rgba(112,92,24,0.78)",
        "rgba(190,168,84,0.26)",
        "rgba(212,188,112,0.42)",
        true,
        tick,
        sceneLanguage,
        state
      );
    }
  }

  window.OPENWORLD_DRAGON_RENDERER = Object.freeze({
    version: "OPENWORLD_DRAGON_RENDERER_v1",
    DRAGON_RULES,
    getDragonBundles,
    drawDragonReflections,
    drawBack,
    drawFront,
  });
})();
