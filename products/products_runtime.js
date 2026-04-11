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

      this.planetLinks = [
        { title: "Platform", href: "/platform/", angle: -86, ring: 0, kicker: "Core" },
        { title: "Software", href: "/software/", angle: -20, ring: 0, kicker: "Runtime" },
        { title: "On Your Side AI", href: "/ai/", angle: 48, ring: 0, kicker: "Intelligence" },
        { title: "Syntax", href: "/ssg/", angle: 116, ring: 0, kicker: "Language" },
        { title: "ArchCoin", href: "/archcoin/", angle: 184, ring: 1, kicker: "Value" },
        { title: "Nutrition", href: "/nutrition/", angle: 240, ring: 1, kicker: "Baseline" },
        { title: "Energy", href: "/energy/", angle: 296, ring: 1, kicker: "Output" },
        { title: "Education", href: "/education/", angle: 14, ring: 2, kicker: "Learning" },
        { title: "Games", href: "/games/", angle: 74, ring: 2, kicker: "Playable" },
        { title: "Agriculture", href: "/agriculture/", angle: 138, ring: 2, kicker: "Applied" },
        { title: "Domains", href: "/domains/", angle: 208, ring: 2, kicker: "Identity" },
        { title: "Diagnostics", href: "/diagnostics/", angle: 280, ring: 2, kicker: "Measurement" }
      ];

      this.frame = 0;
      this.startTime = 0;
      this.resizeTimer = 0;
      this.tokens = [];
      this.stars = [];
      this.destroyed = false;

      this.onResize = this.onResize.bind(this);
      this.animate = this.animate.bind(this);
    }

    mountRuntime() {
      this.mount.innerHTML = "";
      this.mount.setAttribute("data-runtime", "products-g2-planet");

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

      this.glowA = createElement("div", "products-glow products-glow-a", this.root);
      this.glowB = createElement("div", "products-glow products-glow-b", this.root);
      this.ringsLayer = createElement("div", "products-rings-layer", this.root);
      this.planetLayer = createElement("div", "products-planet-layer", this.root);
      this.tokenLayer = createElement("div", "products-token-layer", this.root);
      this.starLayer = createElement("div", "products-star-layer", this.root);

      [this.glowA, this.glowB, this.ringsLayer, this.planetLayer, this.tokenLayer, this.starLayer].forEach((node) => {
        setStyles(node, {
          position: "absolute",
          inset: "0"
        });
      });

      setStyles(this.starLayer, { pointerEvents: "none" });
      setStyles(this.ringsLayer, { pointerEvents: "none" });
      setStyles(this.planetLayer, { pointerEvents: "none" });
      setStyles(this.tokenLayer, { pointerEvents: "auto" });

      this.stars = createStarField(this.starLayer, 52);
      this.buildPlanet();
      this.buildTokens();
      this.layoutStatic();

      window.addEventListener("resize", this.onResize, { passive: true });

      if (!this.reducedMotion) {
        this.frame = window.requestAnimationFrame(this.animate);
      }
    }

    buildPlanet() {
      this.planetShell = createElement("div", "products-planet-shell", this.planetLayer);
      this.planetAtmosphere = createElement("div", "products-planet-atmosphere", this.planetShell);
      this.planetBody = createElement("div", "products-planet-body", this.planetShell);
      this.planetGlow = createElement("div", "products-planet-glow", this.planetShell);
      this.planetShadow = createElement("div", "products-planet-shadow", this.planetShell);

      this.continentA = createElement("div", "products-continent continent-a", this.planetBody);
      this.continentB = createElement("div", "products-continent continent-b", this.planetBody);
      this.continentC = createElement("div", "products-continent continent-c", this.planetBody);

      [this.planetShell, this.planetAtmosphere, this.planetBody, this.planetGlow, this.planetShadow].forEach((node) => {
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

      this.ringOuter = createElement("div", "products-ring ring-outer", this.ringsLayer);
      this.ringMid = createElement("div", "products-ring ring-mid", this.ringsLayer);
      this.ringInner = createElement("div", "products-ring ring-inner", this.ringsLayer);

      [this.ringOuter, this.ringMid, this.ringInner].forEach((ring, index) => {
        setStyles(ring, {
          position: "absolute",
          left: "50%",
          top: "50%",
          borderRadius: "50%",
          transform: "translate(-50%, -50%)",
          border: index === 0
            ? "1px solid rgba(124,166,255,0.24)"
            : index === 1
              ? "1px solid rgba(111,255,219,0.18)"
              : "1px solid rgba(255,255,255,0.14)",
          boxShadow: index === 0 ? "0 0 20px rgba(124,166,255,0.12)" : "none"
        });
      });
    }

    buildTokens() {
      this.tokens = this.planetLinks.map((item, index) => {
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
          minWidth: "100px",
          maxWidth: "136px",
          padding: "9px 10px",
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
          ring: item.ring,
          drift: index % 2 === 0 ? 6 : -6,
          speed: item.ring === 0 ? 0.017 : item.ring === 1 ? -0.012 : 0.009
        };
      });
    }

    measure() {
      const rect = this.stage.getBoundingClientRect();
      const mobile = rect.width <= 760;
      const small = rect.width <= 480;

      const centerX = rect.width * 0.5;
      const centerY = rect.height * 0.5;
      const planetSize = clamp(rect.width * (mobile ? 0.38 : 0.4), 168, mobile ? 238 : 288);

      const ringSet = small
        ? [
            { rx: rect.width * 0.24, ry: rect.height * 0.17 },
            { rx: rect.width * 0.33, ry: rect.height * 0.24 },
            { rx: rect.width * 0.4, ry: rect.height * 0.3 }
          ]
        : mobile
          ? [
              { rx: rect.width * 0.26, ry: rect.height * 0.18 },
              { rx: rect.width * 0.35, ry: rect.height * 0.25 },
              { rx: rect.width * 0.42, ry: rect.height * 0.31 }
            ]
          : [
              { rx: rect.width * 0.27, ry: rect.height * 0.19 },
              { rx: rect.width * 0.37, ry: rect.height * 0.27 },
              { rx: rect.width * 0.45, ry: rect.height * 0.33 }
            ];

      return {
        width: rect.width,
        height: rect.height,
        centerX,
        centerY,
        planetSize,
        ringSet
      };
    }

    layoutStatic() {
      const m = this.measure();

      setStyles(this.glowA, {
        background: "radial-gradient(circle at 50% 50%, rgba(124,166,255,0.18), transparent 58%)",
        filter: "blur(22px)"
      });

      setStyles(this.glowB, {
        background: "radial-gradient(circle at 46% 54%, rgba(111,255,219,0.1), transparent 62%)",
        filter: "blur(34px)"
      });

      [this.planetShell, this.planetAtmosphere, this.planetBody, this.planetGlow, this.planetShadow].forEach((node) => {
        setStyles(node, {
          width: `${m.planetSize}px`,
          height: `${m.planetSize}px`
        });
      });

      setStyles(this.ringOuter, {
        width: `${m.ringSet[2].rx * 2.15}px`,
        height: `${m.ringSet[2].ry * 2.15}px`
      });

      setStyles(this.ringMid, {
        width: `${m.ringSet[1].rx * 2.08}px`,
        height: `${m.ringSet[1].ry * 2.08}px`
      });

      setStyles(this.ringInner, {
        width: `${m.ringSet[0].rx * 2.03}px`,
        height: `${m.ringSet[0].ry * 2.03}px`
      });

      this.tokens.forEach((token) => {
        const angle = (token.angle * Math.PI) / 180;
        const ring = m.ringSet[token.ring];
        const x = m.centerX + Math.cos(angle) * ring.rx;
        const y = m.centerY + Math.sin(angle) * ring.ry;
        this.positionToken(token.el, x, y);
      });
    }

    positionToken(el, x, y) {
      const width = el.offsetWidth || 116;
      const height = el.offsetHeight || 46;
      const left = clamp(x - width / 2, 8, this.stage.clientWidth - width - 8);
      const top = clamp(y - height / 2, 8, this.stage.clientHeight - height - 8);
      const transform = `translate3d(${left}px, ${top}px, 0)`;
      el.dataset.transform = transform;
      el.style.transform = transform;
    }

    animate(time) {
      if (this.destroyed) return;
      if (!this.startTime) this.startTime = time;

      const elapsed = time - this.startTime;
      const m = this.measure();

      const swayA = Math.sin(elapsed * 0.00055) * 9;
      const swayB = Math.cos(elapsed * 0.00042) * 7;

      this.planetShell.style.transform = `translate(-50%, -50%) rotate(${elapsed * 0.0034}deg)`;
      this.planetAtmosphere.style.transform = `translate(-50%, -50%) scale(${1.038 + Math.sin(elapsed * 0.0011) * 0.008})`;
      this.planetGlow.style.transform = `translate(-50%, -50%) scale(${1.16 + Math.cos(elapsed * 0.0008) * 0.02})`;
      this.ringOuter.style.transform = `translate(-50%, -50%) rotate(${elapsed * 0.0052}deg)`;
      this.ringMid.style.transform = `translate(-50%, -50%) rotate(${-elapsed * 0.0039}deg)`;
      this.ringInner.style.transform = `translate(-50%, -50%) rotate(${elapsed * 0.0028}deg)`;

      this.tokens.forEach((token, index) => {
        const baseAngle = (token.angle * Math.PI) / 180;
        const ring = m.ringSet[token.ring];
        const phase = baseAngle + elapsed * token.speed * 0.001;
        const x = m.centerX + Math.cos(phase) * ring.rx;
        const y = m.centerY + Math.sin(phase) * ring.ry + Math.sin(elapsed * 0.0015 + index) * token.drift;
        this.positionToken(token.el, x, y);
      });

      this.stars.forEach((star, index) => {
        const twinkle = 0.42 + (Math.sin(elapsed * 0.001 * star.drift + star.phase + index) + 1) * 0.2;
        star.el.style.opacity = `${twinkle}`;
      });

      this.glowA.style.transform = `translate(${swayA}px, ${swayB}px)`;
      this.glowB.style.transform = `translate(${-swayB}px, ${swayA * 0.6}px)`;

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
