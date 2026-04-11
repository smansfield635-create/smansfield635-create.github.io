(() => {
  const GLOBAL_KEY = "ProductsPlanetRuntime";

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function createElement(tag, className, parent) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (parent) parent.appendChild(node);
    return node;
  }

  function setStyles(node, styles) {
    Object.assign(node.style, styles);
  }

  function createSeededRandom(seed) {
    let value = seed >>> 0;
    return function next() {
      value = (1664525 * value + 1013904223) >>> 0;
      return value / 4294967296;
    };
  }

  function polarToCartesian(cx, cy, radius, angleDeg) {
    const angle = (angleDeg * Math.PI) / 180;
    return {
      x: cx + Math.cos(angle) * radius,
      y: cy + Math.sin(angle) * radius
    };
  }

  function createStarField(container, count) {
    const random = createSeededRandom(256451);
    const stars = [];
    for (let i = 0; i < count; i += 1) {
      const star = createElement("span", "products-star", container);
      const size = random() * 2 + 0.8;
      setStyles(star, {
        position: "absolute",
        left: `${random() * 100}%`,
        top: `${random() * 100}%`,
        width: `${size}px`,
        height: `${size}px`,
        borderRadius: "50%",
        background: "rgba(255,255,255,0.88)",
        opacity: `${0.34 + random() * 0.44}`,
        boxShadow: "0 0 10px rgba(255,255,255,0.32)"
      });
      stars.push({
        el: star,
        drift: 0.15 + random() * 0.3,
        phase: random() * Math.PI * 2
      });
    }
    return stars;
  }

  class PlanetRuntime {
    constructor(options) {
      this.stage = options.stage;
      this.mount = options.mount;
      this.reducedMotion = !!options.reducedMotion;

      this.nodes = [
        { title: "Platform", href: "/platform/", kicker: "Core", angle: 0, group: "outer", priority: "E" },
        { title: "Diagnostics", href: "/diagnostics/", kicker: "Measurement", angle: -30, group: "outer", priority: "NE" },
        { title: "Energy", href: "/energy/", kicker: "Output", angle: -60, group: "inner", priority: "NNE" },
        { title: "Domains", href: "/domains/", kicker: "Identity", angle: -120, group: "outer", priority: "NNW" },
        { title: "Nutrition", href: "/nutrition/", kicker: "Baseline", angle: -150, group: "inner", priority: "NW" },
        { title: "Agriculture", href: "/agriculture/", kicker: "Applied", angle: 150, group: "outer", priority: "W" },
        { title: "Games", href: "/games/", kicker: "Playable", angle: 120, group: "inner", priority: "SW" },
        { title: "On Your Side AI", href: "/ai/", kicker: "Intelligence", angle: 90, group: "outer", priority: "S" },
        { title: "Education", href: "/education/", kicker: "Learning", angle: 45, group: "outer", priority: "SE" },
        { title: "Software", href: "/software/", kicker: "Runtime", angle: 30, group: "inner", priority: "ESE" },
        { title: "Syntax", href: "/ssg/", kicker: "Language", angle: -210, group: "inner", priority: "WSW" },
        { title: "ArchCoin", href: "/archcoin/", kicker: "Value", angle: 210, group: "outer", priority: "SSW" }
      ];

      this.frame = 0;
      this.startTime = 0;
      this.resizeTimer = 0;
      this.tokens = [];
      this.spokes = [];
      this.stars = [];
      this.destroyed = false;

      this.onResize = this.onResize.bind(this);
      this.animate = this.animate.bind(this);
    }

    mountRuntime() {
      this.mount.innerHTML = "";
      this.mount.setAttribute("data-runtime", "products-g2-axis-snowflake");

      setStyles(this.mount, {
        position: "absolute",
        inset: "0",
        overflow: "hidden",
        pointerEvents: "auto"
      });

      this.root = createElement("div", "products-runtime-root", this.mount);
      setStyles(this.root, {
        position: "absolute",
        inset: "0",
        overflow: "hidden"
      });

      this.glowLayer = createElement("div", "products-glow-layer", this.root);
      this.starLayer = createElement("div", "products-star-layer", this.root);
      this.snowflakeLayer = createElement("div", "products-snowflake-layer", this.root);
      this.tokenLayer = createElement("div", "products-token-layer", this.root);
      this.planetLayer = createElement("div", "products-planet-layer", this.root);

      [this.glowLayer, this.starLayer, this.snowflakeLayer, this.tokenLayer, this.planetLayer].forEach((node) => {
        setStyles(node, {
          position: "absolute",
          inset: "0"
        });
      });

      setStyles(this.starLayer, { pointerEvents: "none" });
      setStyles(this.glowLayer, { pointerEvents: "none" });
      setStyles(this.snowflakeLayer, { pointerEvents: "none" });
      setStyles(this.tokenLayer, { pointerEvents: "auto" });
      setStyles(this.planetLayer, { pointerEvents: "auto" });

      this.glowA = createElement("div", "products-glow products-glow-a", this.glowLayer);
      this.glowB = createElement("div", "products-glow products-glow-b", this.glowLayer);
      this.snowflakeShell = createElement("div", "products-snowflake-shell", this.snowflakeLayer);
      this.verticalAxis = createElement("div", "products-vertical-axis", this.snowflakeLayer);
      this.axisCapsuleTop = createElement("div", "products-axis-cap top", this.snowflakeLayer);
      this.axisCapsuleBottom = createElement("div", "products-axis-cap bottom", this.snowflakeLayer);

      setStyles(this.glowA, { position: "absolute", inset: "0" });
      setStyles(this.glowB, { position: "absolute", inset: "0" });

      setStyles(this.snowflakeShell, {
        position: "absolute",
        left: "50%",
        top: "50%",
        transform: "translate(-50%, -50%)",
        transformOrigin: "50% 50%"
      });

      setStyles(this.verticalAxis, {
        position: "absolute",
        left: "50%",
        top: "50%",
        transform: "translate(-50%, -50%)",
        width: "2px",
        borderRadius: "999px",
        background: "linear-gradient(180deg, rgba(255,255,255,0), rgba(255,255,255,0.28), rgba(255,255,255,0))",
        boxShadow: "0 0 16px rgba(124,166,255,0.12)"
      });

      [this.axisCapsuleTop, this.axisCapsuleBottom].forEach((cap) => {
        setStyles(cap, {
          position: "absolute",
          left: "50%",
          width: "12px",
          height: "12px",
          borderRadius: "50%",
          transform: "translateX(-50%)",
          background: "linear-gradient(135deg, rgba(124,166,255,0.52), rgba(111,255,219,0.24))",
          boxShadow: "0 0 18px rgba(124,166,255,0.18)"
        });
      });

      this.stars = createStarField(this.starLayer, 52);
      this.buildPlanet();
      this.buildSnowflake();
      this.buildTokens();
      this.layoutStatic();

      window.addEventListener("resize", this.onResize, { passive: true });

      if (!this.reducedMotion) {
        this.frame = window.requestAnimationFrame(this.animate);
      }
    }

    buildPlanet() {
      this.planetLink = createElement("a", "products-planet-link", this.planetLayer);
      this.planetLink.href = "/products/";
      this.planetLink.setAttribute("aria-label", "Open the Products core page");

      setStyles(this.planetLink, {
        position: "absolute",
        left: "50%",
        top: "50%",
        transform: "translate(-50%, -50%)",
        display: "block",
        borderRadius: "50%",
        textDecoration: "none",
        zIndex: "3"
      });

      this.planetShell = createElement("div", "products-planet-shell", this.planetLink);
      this.planetAtmosphere = createElement("div", "products-planet-atmosphere", this.planetShell);
      this.planetGlow = createElement("div", "products-planet-glow", this.planetShell);
      this.planetShadow = createElement("div", "products-planet-shadow", this.planetShell);
      this.planetBody = createElement("div", "products-planet-body", this.planetShell);
      this.equatorBand = createElement("div", "products-equator-band", this.planetBody);
      this.surfaceLayer = createElement("div", "products-surface-layer", this.planetBody);

      this.continentA = createElement("div", "products-continent continent-a", this.surfaceLayer);
      this.continentB = createElement("div", "products-continent continent-b", this.surfaceLayer);
      this.continentC = createElement("div", "products-continent continent-c", this.surfaceLayer);

      [this.planetShell, this.planetAtmosphere, this.planetGlow, this.planetShadow, this.planetBody].forEach((node) => {
        setStyles(node, {
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)"
        });
      });

      setStyles(this.planetShell, {
        borderRadius: "50%",
        filter: "drop-shadow(0 24px 52px rgba(0,0,0,0.34))"
      });

      setStyles(this.planetAtmosphere, {
        borderRadius: "50%",
        background: "radial-gradient(circle at 34% 32%, rgba(255,255,255,0.22), rgba(127,183,255,0.16) 28%, rgba(54,105,210,0.15) 54%, rgba(13,22,50,0.03) 76%, transparent 80%)",
        boxShadow: "0 0 58px rgba(119,176,255,0.24)"
      });

      setStyles(this.planetGlow, {
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(124,166,255,0.18), transparent 65%)",
        filter: "blur(18px)"
      });

      setStyles(this.planetShadow, {
        borderRadius: "50%",
        background: "radial-gradient(circle at 66% 66%, rgba(2,5,18,0.42), transparent 44%)",
        mixBlendMode: "multiply",
        opacity: "0.85"
      });

      setStyles(this.planetBody, {
        overflow: "hidden",
        borderRadius: "50%",
        border: "1px solid rgba(255,255,255,0.12)",
        background: [
          "radial-gradient(circle at 30% 24%, rgba(255,255,255,0.22), transparent 18%)",
          "radial-gradient(circle at 66% 72%, rgba(111,255,219,0.16), transparent 22%)",
          "linear-gradient(145deg, #152d63 0%, #2352a8 30%, #1a7d9f 58%, #10284f 100%)"
        ].join(",")
      });

      setStyles(this.equatorBand, {
        position: "absolute",
        left: "-10%",
        top: "50%",
        width: "120%",
        height: "20%",
        transform: "translateY(-50%)",
        borderRadius: "999px",
        background: "linear-gradient(180deg, rgba(93,198,255,0.06), rgba(255,255,255,0.18), rgba(41,111,255,0.08))",
        boxShadow: "0 0 20px rgba(90,170,255,0.12)"
      });

      setStyles(this.surfaceLayer, {
        position: "absolute",
        inset: "0",
        willChange: "transform"
      });

      const continentBase = {
        position: "absolute",
        background: "linear-gradient(145deg, rgba(111,255,219,0.42), rgba(127,208,255,0.14))",
        border: "1px solid rgba(255,255,255,0.06)"
      };

      setStyles(this.continentA, {
        ...continentBase,
        left: "10%",
        top: "22%",
        width: "36%",
        height: "24%",
        borderRadius: "48% 52% 42% 58% / 52% 38% 62% 48%",
        transform: "rotate(-18deg)"
      });

      setStyles(this.continentB, {
        ...continentBase,
        right: "14%",
        top: "34%",
        width: "28%",
        height: "18%",
        borderRadius: "46% 54% 62% 38% / 45% 62% 38% 55%",
        transform: "rotate(22deg)"
      });

      setStyles(this.continentC, {
        ...continentBase,
        left: "34%",
        bottom: "18%",
        width: "24%",
        height: "17%",
        borderRadius: "54% 46% 55% 45% / 52% 44% 56% 48%",
        transform: "rotate(8deg)"
      });

      this.planetLink.addEventListener("mouseenter", () => {
        this.planetLink.style.filter = "brightness(1.06)";
      });

      this.planetLink.addEventListener("mouseleave", () => {
        this.planetLink.style.filter = "brightness(1)";
      });
    }

    buildSnowflake() {
      for (let i = 0; i < 6; i += 1) {
        const spoke = createElement("div", "products-snowflake-spoke", this.snowflakeShell);
        const branchA = createElement("div", "products-snowflake-branch branch-a", spoke);
        const branchB = createElement("div", "products-snowflake-branch branch-b", spoke);
        const crystal = createElement("div", "products-snowflake-crystal", spoke);

        setStyles(spoke, {
          position: "absolute",
          left: "50%",
          top: "50%",
          width: "2px",
          transformOrigin: "50% 0%"
        });

        setStyles(branchA, {
          position: "absolute",
          top: "30%",
          left: "50%",
          width: "2px",
          transformOrigin: "50% 0%"
        });

        setStyles(branchB, {
          position: "absolute",
          top: "30%",
          left: "50%",
          width: "2px",
          transformOrigin: "50% 0%"
        });

        setStyles(crystal, {
          position: "absolute",
          left: "50%",
          top: "0",
          transform: "translate(-50%, -50%) rotate(45deg)",
          borderRadius: "4px",
          background: "linear-gradient(135deg, rgba(124,166,255,0.42), rgba(111,255,219,0.22))",
          boxShadow: "0 0 16px rgba(124,166,255,0.14)"
        });

        this.spokes.push({ spoke, branchA, branchB, crystal, rotation: i * 60 });
      }

      this.outerRing = createElement("div", "products-snowflake-ring outer", this.snowflakeShell);
      this.innerRing = createElement("div", "products-snowflake-ring inner", this.snowflakeShell);
      this.crossRing = createElement("div", "products-snowflake-ring cross", this.snowflakeShell);

      [this.outerRing, this.innerRing, this.crossRing].forEach((ring, index) => {
        setStyles(ring, {
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
          borderRadius: "50%",
          border: index === 0
            ? "1px solid rgba(124,166,255,0.2)"
            : index === 1
              ? "1px solid rgba(255,255,255,0.12)"
              : "1px dashed rgba(111,255,219,0.16)",
          boxShadow: index === 0 ? "0 0 20px rgba(124,166,255,0.1)" : "none"
        });
      });
    }

    buildTokens() {
      this.tokens = this.nodes.map((item) => {
        const token = document.createElement("a");
        token.href = item.href;
        token.className = "products-orbit-token";
        token.setAttribute("aria-label", item.title);

        const kicker = document.createElement("span");
        kicker.textContent = item.kicker;
        const title = document.createElement("strong");
        title.textContent = item.title;

        token.appendChild(kicker);
        token.appendChild(title);
        this.tokenLayer.appendChild(token);

        setStyles(token, {
          position: "absolute",
          minWidth: "104px",
          maxWidth: "142px",
          padding: "10px 11px",
          borderRadius: "999px",
          border: "1px solid rgba(255,255,255,0.14)",
          background: "linear-gradient(180deg, rgba(255,255,255,0.11), rgba(255,255,255,0.05))",
          color: "#f5f7ff",
          backdropFilter: "blur(10px)",
          boxShadow: "0 12px 30px rgba(0,0,0,0.22)",
          textAlign: "center",
          fontSize: "0.74rem",
          lineHeight: "1.2",
          transition: "transform 160ms ease, border-color 160ms ease, background 160ms ease, box-shadow 160ms ease",
          zIndex: "4"
        });

        setStyles(kicker, {
          display: "block",
          marginBottom: "4px",
          fontSize: "0.56rem",
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          color: "rgba(245,247,255,0.6)"
        });

        setStyles(title, {
          display: "block",
          fontSize: "0.76rem",
          fontWeight: "700"
        });

        token.addEventListener("mouseenter", () => {
          token.style.transform = `${token.dataset.transform || ""} translateY(-2px) scale(1.02)`;
          token.style.borderColor = "rgba(124,166,255,0.42)";
          token.style.background = "linear-gradient(180deg, rgba(255,255,255,0.16), rgba(255,255,255,0.06))";
          token.style.boxShadow = "0 16px 36px rgba(0,0,0,0.28)";
        });

        token.addEventListener("mouseleave", () => {
          token.style.transform = token.dataset.transform || "";
          token.style.borderColor = "rgba(255,255,255,0.14)";
          token.style.background = "linear-gradient(180deg, rgba(255,255,255,0.11), rgba(255,255,255,0.05))";
          token.style.boxShadow = "0 12px 30px rgba(0,0,0,0.22)";
        });

        return {
          el: token,
          angle: item.angle,
          group: item.group,
          priority: item.priority
        };
      });
    }

    measure() {
      const rect = this.stage.getBoundingClientRect();
      const mobile = rect.width <= 760;
      const small = rect.width <= 480;

      const centerX = rect.width * 0.5;
      const centerY = rect.height * 0.54;
      const planetSize = clamp(rect.width * (mobile ? 0.34 : 0.36), 164, mobile ? 224 : 270);
      const shellRadius = clamp(rect.width * (mobile ? 0.43 : 0.46), 164, mobile ? 224 : 310);
      const spokeLength = shellRadius * 0.86;
      const branchLength = shellRadius * 0.24;
      const outerRadius = shellRadius;
      const innerRadius = shellRadius * 0.78;
      const outerAmplitude = shellRadius * 0.16;
      const innerAmplitude = shellRadius * 0.16;

      return {
        width: rect.width,
        height: rect.height,
        centerX,
        centerY,
        planetSize,
        shellRadius,
        spokeLength,
        branchLength,
        outerRadius,
        innerRadius,
        outerAmplitude,
        innerAmplitude,
        mobile,
        small
      };
    }

    layoutStatic() {
      const m = this.measure();

      setStyles(this.glowA, {
        background: "radial-gradient(circle at 50% 58%, rgba(124,166,255,0.18), transparent 58%)",
        filter: "blur(22px)"
      });

      setStyles(this.glowB, {
        background: "radial-gradient(circle at 46% 54%, rgba(111,255,219,0.1), transparent 62%)",
        filter: "blur(34px)"
      });

      setStyles(this.verticalAxis, {
        height: `${m.shellRadius * 2.2}px`
      });

      setStyles(this.axisCapsuleTop, {
        top: `${m.centerY - m.shellRadius - 22}px`
      });

      setStyles(this.axisCapsuleBottom, {
        top: `${m.centerY + m.shellRadius + 10}px`
      });

      setStyles(this.planetLink, {
        width: `${m.planetSize}px`,
        height: `${m.planetSize}px`
      });

      [this.planetShell, this.planetAtmosphere, this.planetGlow, this.planetShadow, this.planetBody].forEach((node) => {
        setStyles(node, {
          width: `${m.planetSize}px`,
          height: `${m.planetSize}px`
        });
      });

      setStyles(this.snowflakeShell, {
        width: `${m.shellRadius * 2.5}px`,
        height: `${m.shellRadius * 2.5}px`
      });

      setStyles(this.outerRing, {
        width: `${m.outerRadius * 2.02}px`,
        height: `${m.outerRadius * 2.02}px`
      });

      setStyles(this.innerRing, {
        width: `${m.innerRadius * 2.02}px`,
        height: `${m.innerRadius * 2.02}px`
      });

      setStyles(this.crossRing, {
        width: `${m.shellRadius * 1.64}px`,
        height: `${m.shellRadius * 1.64}px`
      });

      this.spokes.forEach(({ spoke, branchA, branchB, crystal, rotation }) => {
        setStyles(spoke, {
          height: `${m.spokeLength}px`,
          transform: `translate(-50%, 0) rotate(${rotation}deg)`,
          background: "linear-gradient(180deg, rgba(255,255,255,0.24), rgba(124,166,255,0.1))"
        });

        setStyles(branchA, {
          height: `${m.branchLength}px`,
          background: "linear-gradient(180deg, rgba(255,255,255,0.22), rgba(124,166,255,0.08))",
          transform: "translate(-50%, 0) rotate(32deg)"
        });

        setStyles(branchB, {
          height: `${m.branchLength}px`,
          background: "linear-gradient(180deg, rgba(255,255,255,0.22), rgba(124,166,255,0.08))",
          transform: "translate(-50%, 0) rotate(-32deg)"
        });

        setStyles(crystal, {
          width: `${m.small ? 12 : 14}px`,
          height: `${m.small ? 12 : 14}px`
        });
      });

      this.positionTokens(0);
    }

    positionTokens(shellRotationDeg) {
      const m = this.measure();

      this.tokens.forEach((token, index) => {
        const phase = (shellRotationDeg + token.angle) * Math.PI / 180;
        const breathing = Math.sin(phase);
        const radius = token.group === "outer"
          ? m.outerRadius - m.outerAmplitude * breathing
          : m.innerRadius + m.innerAmplitude * breathing;

        const anchor = polarToCartesian(m.centerX, m.centerY, radius, token.angle + shellRotationDeg);
        this.positionToken(token.el, anchor.x, anchor.y, token.priority);
      });

      this.verticalAxis.style.left = `${m.centerX}px`;
      this.verticalAxis.style.top = `${m.centerY}px`;
    }

    positionToken(el, x, y, priority) {
      const width = el.offsetWidth || 122;
      const height = el.offsetHeight || 50;
      const left = clamp(x - width / 2, 8, this.stage.clientWidth - width - 8);
      const top = clamp(y - height / 2, 8, this.stage.clientHeight - height - 8);

      const boost = priority === "N" || priority === "S" || priority === "E" || priority === "W"
        ? " scale(1.03)"
        : "";

      const transform = `translate3d(${left}px, ${top}px, 0)${boost}`;
      el.dataset.transform = `translate3d(${left}px, ${top}px, 0)`;
      el.style.transform = transform;
    }

    animate(time) {
      if (this.destroyed) return;
      if (!this.startTime) this.startTime = time;

      const elapsed = time - this.startTime;
      const shellRotation = elapsed * 0.0018;
      const globeSpin = elapsed * 0.009;
      const atmospherePulse = 1.038 + Math.sin(elapsed * 0.0011) * 0.008;
      const glowPulse = 1.16 + Math.cos(elapsed * 0.0008) * 0.02;
      const glowShiftA = Math.sin(elapsed * 0.00055) * 9;
      const glowShiftB = Math.cos(elapsed * 0.00042) * 7;

      this.snowflakeShell.style.transform = `translate(-50%, -50%) rotate(${shellRotation}deg)`;
      this.planetAtmosphere.style.transform = `translate(-50%, -50%) scale(${atmospherePulse})`;
      this.planetGlow.style.transform = `translate(-50%, -50%) scale(${glowPulse})`;
      this.surfaceLayer.style.transform = `translateX(${Math.sin(globeSpin * Math.PI / 180) * 10}px)`;
      this.equatorBand.style.transform = `translateY(-50%) scaleX(${1 + Math.cos(globeSpin * Math.PI / 180) * 0.04})`;

      this.stars.forEach((star, index) => {
        const twinkle = 0.42 + (Math.sin(elapsed * 0.001 * star.drift + star.phase + index) + 1) * 0.2;
        star.el.style.opacity = `${twinkle}`;
      });

      this.glowA.style.transform = `translate(${glowShiftA}px, ${glowShiftB}px)`;
      this.glowB.style.transform = `translate(${-glowShiftB}px, ${glowShiftA * 0.6}px)`;

      this.positionTokens(shellRotation);

      this.frame = window.requestAnimationFrame(this.animate);
    }

    onResize() {
      window.clearTimeout(this.resizeTimer);
      this.resizeTimer = window.setTimeout(() => {
        this.layoutStatic();
      }, 60);
    }

    destroy() {
      this.destroyed = true;
      window.clearTimeout(this.resizeTimer);
      window.removeEventListener("resize", this.onResize);
      if (this.frame) {
        window.cancelAnimationFrame(this.frame);
        this.frame = 0;
      }
      if (this.mount) {
        this.mount.innerHTML = "";
      }
    }
  }

  window[GLOBAL_KEY] = {
    create(options) {
      const runtime = new PlanetRuntime(options);
      runtime.mountRuntime();
      return runtime;
    }
  };
})();
