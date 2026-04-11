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

  function createStarField(container, count) {
    const stars = [];
    for (let i = 0; i < count; i += 1) {
      const star = createElement("span", "products-star", container);
      const size = Math.random() * 2.2 + 0.8;
      setStyles(star, {
        position: "absolute",
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        width: `${size}px`,
        height: `${size}px`,
        borderRadius: "50%",
        background: "rgba(255,255,255,0.88)",
        opacity: `${0.3 + Math.random() * 0.5}`,
        boxShadow: "0 0 10px rgba(255,255,255,0.35)"
      });
      stars.push({
        el: star,
        drift: 0.1 + Math.random() * 0.35,
        phase: Math.random() * Math.PI * 2
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
        { title: "Platform", href: "/platform/", angle: -82, ring: 0, kicker: "Core" },
        { title: "Software", href: "/software/", angle: -18, ring: 0, kicker: "Runtime" },
        { title: "On Your Side AI", href: "/ai/", angle: 52, ring: 0, kicker: "Intelligence" },
        { title: "Syntax", href: "/ssg/", angle: 118, ring: 0, kicker: "Language" },
        { title: "ArchCoin", href: "/archcoin/", angle: 182, ring: 1, kicker: "Value" },
        { title: "Nutrition", href: "/nutrition/", angle: 238, ring: 1, kicker: "Baseline" },
        { title: "Energy", href: "/energy/", angle: 294, ring: 1, kicker: "Output" },
        { title: "Education", href: "/education/", angle: 10, ring: 2, kicker: "Learning" },
        { title: "Games", href: "/games/", angle: 74, ring: 2, kicker: "Playable" },
        { title: "Agriculture", href: "/agriculture/", angle: 140, ring: 2, kicker: "Applied" },
        { title: "Domains", href: "/domains/", angle: 208, ring: 2, kicker: "Identity" },
        { title: "Diagnostics", href: "/diagnostics/", angle: 278, ring: 2, kicker: "Measurement" }
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

      this.stars = createStarField(this.starLayer, 42);
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
      this.continentA = createElement("div", "products-continent continent-a", this.planetBody);
      this.continentB = createElement("div", "products-continent continent-b", this.planetBody);
      this.continentC = createElement("div", "products-continent continent-c", this.planetBody);

      [this.planetShell, this.planetAtmosphere, this.planetBody, this.planetGlow].forEach((node) => {
        setStyles(node, {
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)"
        });
      });

      setStyles(this.planetShell, {
        borderRadius: "50%",
        filter: "drop-shadow(0 18px 40px rgba(0,0,0,0.28))"
      });

      setStyles(this.planetAtmosphere, {
        borderRadius: "50%",
        background: "radial-gradient(circle at 35% 35%, rgba(255,255,255,0.18), rgba(127,183,255,0.14) 30%, rgba(47,87,177,0.12) 55%, rgba(13,22,50,0.02) 75%, transparent 78%)",
        boxShadow: "0 0 42px rgba(119,176,255,0.18)"
      });

      setStyles(this.planetBody, {
        overflow: "hidden",
        borderRadius: "50%",
        border: "1px solid rgba(255,255,255,0.1)",
        background: [
          "radial-gradient(circle at 30% 28%, rgba(255,255,255,0.18), transparent 20%)",
          "radial-gradient(circle at 62% 72%, rgba(111,255,219,0.12), transparent 24%)",
          "linear-gradient(145deg, #173069 0%, #214f9b 34%, #1e6d8d 58%, #12315f 100%)"
        ].join(",")
      });

      setStyles(this.planetGlow, {
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(124,166,255,0.14), transparent 65%)",
        filter: "blur(14px)"
      });

      const continentBase = {
        position: "absolute",
        background: "linear-gradient(145deg, rgba(111,255,219,0.38), rgba(127,208,255,0.12))",
        border: "1px solid rgba(255,255,255,0.06)",
        filter: "blur(0.2px)"
      };

      setStyles(this.continentA, {
        ...continentBase,
        left: "12%",
        top: "24%",
        width: "34%",
        height: "22%",
        borderRadius: "48% 52% 42% 58% / 52% 38% 62% 48%",
        transform: "rotate(-18deg)"
      });

      setStyles(this.continentB, {
        ...continentBase,
        right: "18%",
        top: "34%",
        width: "26%",
        height: "18%",
        borderRadius: "46% 54% 62% 38% / 45% 62% 38% 55%",
        transform: "rotate(22deg)"
      });

      setStyles(this.continentC, {
        ...continentBase,
        left: "32%",
        bottom: "18%",
        width: "24%",
        height: "16%",
        borderRadius: "54% 46% 55% 45% / 52% 44% 56% 48%",
        transform: "rotate(8deg)"
      });

      this.ringOuter = createElement("div", "products-ring ring-outer", this.ringsLayer);
      this.ringMid = createElement("div", "products-ring ring-mid", this.ringsLayer);
      this.ringInner = createElement("div", "products-ring ring-inner", this.ringsLayer);

      [this.ringOuter, this.ringMid, this.ringInner].forEach((ring) => {
        setStyles(ring, {
          position: "absolute",
          left: "50%",
          top: "50%",
          borderRadius: "50%",
          transform: "translate(-50%, -50%)",
          border: "1px solid rgba(255,255,255,0.08)"
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
          minWidth: "98px",
          maxWidth: "132px",
          padding: "8px 10px",
          borderRadius: "999px",
          border: "1px solid rgba(255,255,255,0.12)",
          background: "linear-gradient(180deg, rgba(255,255,255,0.08), rgba(255,255,255,0.04))",
          color: "#f5f7ff",
          backdropFilter: "blur(10px)",
          boxShadow: "0 12px 30px rgba(0,0,0,0.2)",
          textAlign: "center",
          fontSize: "0.74rem",
          lineHeight: "1.2",
          transition: "transform 160ms ease, border-color 160ms ease, background 160ms ease"
        });

        setStyles(kicker, {
          display: "block",
          marginBottom: "4px",
          fontSize: "0.56rem",
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          color: "rgba(245,247,255,0.58)"
        });

        setStyles(title, {
          display: "block",
          fontSize: "0.76rem",
          fontWeight: "700"
        });

        token.addEventListener("mouseenter", () => {
          token.style.transform = `${token.dataset.transform || ""} translateY(-2px)`;
          token.style.borderColor = "rgba(124,166,255,0.35)";
          token.style.background = "linear-gradient(180deg, rgba(255,255,255,0.12), rgba(255,255,255,0.05))";
        });

        token.addEventListener("mouseleave", () => {
          token.style.transform = token.dataset.transform || "";
          token.style.borderColor = "rgba(255,255,255,0.12)";
          token.style.background = "linear-gradient(180deg, rgba(255,255,255,0.08), rgba(255,255,255,0.04))";
        });

        return {
          el: token,
          angle: item.angle,
          ring: item.ring,
          drift: index % 2 === 0 ? 5 : -5,
          speed: item.ring === 0 ? 0.015 : item.ring === 1 ? -0.011 : 0.008
        };
      });
    }

    measure() {
      const rect = this.stage.getBoundingClientRect();
      const mobile = rect.width <= 760;
      const small = rect.width <= 480;

      const centerX = rect.width * 0.5;
      const centerY = rect.height * (mobile ? 0.5 : 0.5);
      const planetSize = clamp(rect.width * (mobile ? 0.34 : 0.36), 150, mobile ? 220 : 260);

      const ringSet = small
        ? [
            { rx: rect.width * 0.23, ry: rect.height * 0.16 },
            { rx: rect.width * 0.32, ry: rect.height * 0.23 },
            { rx: rect.width * 0.39, ry: rect.height * 0.28 }
          ]
        : mobile
          ? [
              { rx: rect.width * 0.24, ry: rect.height * 0.17 },
              { rx: rect.width * 0.34, ry: rect.height * 0.24 },
              { rx: rect.width * 0.41, ry: rect.height * 0.3 }
            ]
          : [
              { rx: rect.width * 0.25, ry: rect.height * 0.18 },
              { rx: rect.width * 0.36, ry: rect.height * 0.25 },
              { rx: rect.width * 0.44, ry: rect.height * 0.31 }
            ];

      return {
        width: rect.width,
        height: rect.height,
        mobile,
        centerX,
        centerY,
        planetSize,
        ringSet
      };
    }

    layoutStatic() {
      const m = this.measure();

      setStyles(this.glowA, {
        background: "radial-gradient(circle at 50% 50%, rgba(124,166,255,0.14), transparent 58%)",
        filter: "blur(20px)"
      });

      setStyles(this.glowB, {
        background: "radial-gradient(circle at 46% 54%, rgba(111,255,219,0.08), transparent 62%)",
        filter: "blur(30px)"
      });

      [this.planetShell, this.planetAtmosphere, this.planetBody, this.planetGlow].forEach((node) => {
        setStyles(node, {
          width: `${m.planetSize}px`,
          height: `${m.planetSize}px`
        });
      });

      setStyles(this.ringOuter, {
        width: `${m.ringSet[2].rx * 2.08}px`,
        height: `${m.ringSet[2].ry * 2.08}px`
      });

      setStyles(this.ringMid, {
        width: `${m.ringSet[1].rx * 2.04}px`,
        height: `${m.ringSet[1].ry * 2.04}px`
      });

      setStyles(this.ringInner, {
        width: `${m.ringSet[0].rx * 2.02}px`,
        height: `${m.ringSet[0].ry * 2.02}px`
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

      const swayA = Math.sin(elapsed * 0.00055) * 8;
      const swayB = Math.cos(elapsed * 0.00042) * 6;

      this.planetShell.style.transform = `translate(-50%, -50%) rotate(${elapsed * 0.0032}deg)`;
      this.planetBody.style.transform = `translate(-50%, -50%) scale(1)`;
      this.planetAtmosphere.style.transform = `translate(-50%, -50%) scale(${1.035 + Math.sin(elapsed * 0.0012) * 0.006})`;
      this.planetGlow.style.transform = `translate(-50%, -50%) scale(${1.12 + Math.cos(elapsed * 0.0009) * 0.014})`;

      this.ringOuter.style.transform = `translate(-50%, -50%) rotate(${elapsed * 0.005}deg)`;
      this.ringMid.style.transform = `translate(-50%, -50%) rotate(${-elapsed * 0.0038}deg)`;
      this.ringInner.style.transform = `translate(-50%, -50%) rotate(${elapsed * 0.0026}deg)`;

      this.tokens.forEach((token, index) => {
        const baseAngle = (token.angle * Math.PI) / 180;
        const ring = m.ringSet[token.ring];
        const phase = baseAngle + elapsed * token.speed * 0.001;
        const x = m.centerX + Math.cos(phase) * ring.rx;
        const y = m.centerY + Math.sin(phase) * ring.ry + Math.sin(elapsed * 0.0016 + index) * token.drift;
        this.positionToken(token.el, x, y);
      });

      this.stars.forEach((star, index) => {
        const twinkle = 0.38 + (Math.sin(elapsed * 0.0011 * star.drift + star.phase + index) + 1) * 0.22;
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
