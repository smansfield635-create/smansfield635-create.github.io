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

  function polarToCartesian(cx, cy, radiusX, radiusY, angleDeg, tiltDeg) {
    const angle = (angleDeg * Math.PI) / 180;
    const tilt = (tiltDeg * Math.PI) / 180;

    const rawX = Math.cos(angle) * radiusX;
    const rawY = Math.sin(angle) * radiusY;

    const x = rawX * Math.cos(tilt) - rawY * Math.sin(tilt);
    const y = rawX * Math.sin(tilt) + rawY * Math.cos(tilt);

    return {
      x: cx + x,
      y: cy + y,
      depth: (Math.sin(angle) + 1) * 0.5,
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
        boxShadow: "0 0 10px rgba(255,255,255,0.32)",
      });

      stars.push({
        el: star,
        drift: 0.15 + random() * 0.3,
        phase: random() * Math.PI * 2,
      });
    }

    return stars;
  }

  class PlanetRuntime {
    constructor(options) {
      this.stage = options.stage;
      this.mount = options.mount;
      this.reducedMotion = !!options.reducedMotion;

      this.planets = [
        {
          title: "Energy",
          href: "/energy/",
          kicker: "Output",
          orbitOrder: 1,
          sizeDesktop: 30,
          sizeMobile: 24,
          speed: 0.030,
          angle: -88,
          color: "linear-gradient(145deg,#dff7ff 0%,#71d9ff 26%,#2d88d8 64%,#103667 100%)",
        },
        {
          title: "Platform",
          href: "/platform/",
          kicker: "Core",
          orbitOrder: 2,
          sizeDesktop: 38,
          sizeMobile: 30,
          speed: 0.024,
          angle: 8,
          color: "linear-gradient(145deg,#fff4d9 0%,#ffd572 28%,#d38c1e 62%,#6b3f0e 100%)",
        },
        {
          title: "Software",
          href: "/software/",
          kicker: "Runtime",
          orbitOrder: 3,
          sizeDesktop: 44,
          sizeMobile: 34,
          speed: 0.020,
          angle: -38,
          color: "linear-gradient(145deg,#f0f6ff 0%,#9ebcff 26%,#5c74da 60%,#27357b 100%)",
        },
        {
          title: "Nutrition",
          href: "/nutrition/",
          kicker: "Baseline",
          orbitOrder: 4,
          sizeDesktop: 52,
          sizeMobile: 40,
          speed: 0.017,
          angle: 28,
          color: "linear-gradient(145deg,#effff7 0%,#8de7c3 26%,#2e9d70 62%,#14452f 100%)",
        },
        {
          title: "On Your Side AI",
          href: "/ai/",
          kicker: "Intelligence",
          orbitOrder: 5,
          sizeDesktop: 62,
          sizeMobile: 48,
          speed: 0.014,
          angle: 102,
          color: "linear-gradient(145deg,#ffffff 0%,#b6d8ff 24%,#6fa1f2 58%,#234d93 100%)",
        },
        {
          title: "Agriculture",
          href: "/agriculture/",
          kicker: "Applied",
          orbitOrder: 6,
          sizeDesktop: 72,
          sizeMobile: 56,
          speed: 0.011,
          angle: 196,
          color: "linear-gradient(145deg,#f6ffe8 0%,#c9f27d 26%,#6ea033 62%,#2f4b16 100%)",
        },
        {
          title: "Diagnostics",
          href: "/diagnostics/",
          kicker: "Measurement",
          orbitOrder: 7,
          sizeDesktop: 82,
          sizeMobile: 64,
          speed: 0.009,
          angle: -146,
          color: "linear-gradient(145deg,#f8f8ff 0%,#d2d5ff 24%,#8b94f5 58%,#3b438f 100%)",
        },
        {
          title: "Education",
          href: "/education/",
          kicker: "Learning",
          orbitOrder: 8,
          sizeDesktop: 94,
          sizeMobile: 72,
          speed: 0.007,
          angle: 146,
          color: "linear-gradient(145deg,#fff2fb 0%,#ffb8dd 26%,#d85da4 60%,#6d2450 100%)",
        },
        {
          title: "Domains",
          href: "/domains/",
          kicker: "Identity",
          orbitOrder: 9,
          sizeDesktop: 106,
          sizeMobile: 82,
          speed: 0.006,
          angle: -118,
          color: "linear-gradient(145deg,#fff8df 0%,#f4d67d 26%,#c59321 62%,#6d4708 100%)",
        },
        {
          title: "Syntax",
          href: "/ssg/",
          kicker: "Language",
          orbitOrder: 10,
          sizeDesktop: 118,
          sizeMobile: 92,
          speed: 0.005,
          angle: 58,
          color: "linear-gradient(145deg,#f2fbff 0%,#8ad0ff 26%,#3a8dcf 60%,#16416d 100%)",
        },
        {
          title: "Games",
          href: "/games/",
          kicker: "Playable",
          orbitOrder: 11,
          sizeDesktop: 132,
          sizeMobile: 102,
          speed: 0.0042,
          angle: 212,
          color: "linear-gradient(145deg,#f5efff 0%,#c6a8ff 24%,#7b5de2 58%,#352267 100%)",
        },
        {
          title: "ArchCoin",
          href: "/archcoin/",
          kicker: "Value",
          orbitOrder: 12,
          sizeDesktop: 146,
          sizeMobile: 112,
          speed: 0.0036,
          angle: 18,
          color: "linear-gradient(145deg,#fff9ea 0%,#ffd87a 24%,#d89519 58%,#6b4107 100%)",
        },
      ];

      this.frame = 0;
      this.startTime = 0;
      this.resizeTimer = 0;
      this.stars = [];
      this.tokens = [];
      this.orbitRings = [];
      this.destroyed = false;

      this.onResize = this.onResize.bind(this);
      this.animate = this.animate.bind(this);
    }

    mountRuntime() {
      this.mount.innerHTML = "";
      this.mount.setAttribute("data-runtime", "products-solar-system-scale-law");

      setStyles(this.mount, {
        position: "absolute",
        inset: "0",
        overflow: "hidden",
        pointerEvents: "auto",
      });

      this.root = createElement("div", "products-runtime-root", this.mount);
      setStyles(this.root, {
        position: "absolute",
        inset: "0",
        overflow: "hidden",
      });

      this.glowLayer = createElement("div", "products-glow-layer", this.root);
      this.starLayer = createElement("div", "products-star-layer", this.root);
      this.axisLayer = createElement("div", "products-axis-layer", this.root);
      this.ringLayer = createElement("div", "products-ring-layer", this.root);
      this.tokenLayer = createElement("div", "products-token-layer", this.root);
      this.sunLayer = createElement("div", "products-sun-layer", this.root);

      [this.glowLayer, this.starLayer, this.axisLayer, this.ringLayer, this.tokenLayer, this.sunLayer].forEach((node) => {
        setStyles(node, {
          position: "absolute",
          inset: "0",
        });
      });

      setStyles(this.starLayer, { pointerEvents: "none" });
      setStyles(this.glowLayer, { pointerEvents: "none" });
      setStyles(this.axisLayer, { pointerEvents: "none" });
      setStyles(this.ringLayer, { pointerEvents: "none" });
      setStyles(this.tokenLayer, { pointerEvents: "auto" });
      setStyles(this.sunLayer, { pointerEvents: "auto" });

      this.glowA = createElement("div", "products-glow products-glow-a", this.glowLayer);
      this.glowB = createElement("div", "products-glow products-glow-b", this.glowLayer);

      setStyles(this.glowA, {
        position: "absolute",
        inset: "0",
      });

      setStyles(this.glowB, {
        position: "absolute",
        inset: "0",
      });

      this.horizontalAxis = createElement("div", "products-horizontal-axis", this.axisLayer);
      this.verticalAxis = createElement("div", "products-vertical-axis", this.axisLayer);

      setStyles(this.horizontalAxis, {
        position: "absolute",
        height: "2px",
        borderRadius: "999px",
        background: "linear-gradient(90deg, rgba(255,255,255,0), rgba(255,255,255,0.34), rgba(255,255,255,0))",
        boxShadow: "0 0 18px rgba(124,166,255,0.18)",
      });

      setStyles(this.verticalAxis, {
        position: "absolute",
        width: "2px",
        borderRadius: "999px",
        background: "linear-gradient(180deg, rgba(255,255,255,0), rgba(255,255,255,0.14), rgba(255,255,255,0))",
        boxShadow: "0 0 12px rgba(124,166,255,0.08)",
      });

      this.stars = createStarField(this.starLayer, 58);

      this.buildSun();
      this.buildOrbitRings();
      this.buildTokens();
      this.layoutStatic();

      window.addEventListener("resize", this.onResize, { passive: true });

      if (!this.reducedMotion) {
        this.frame = window.requestAnimationFrame(this.animate);
      }
    }

    buildSun() {
      this.sunAnchor = createElement("a", "products-sun-anchor", this.sunLayer);
      this.sunAnchor.href = "/products/";
      this.sunAnchor.setAttribute("aria-label", "Open the Products core page");

      setStyles(this.sunAnchor, {
        position: "absolute",
        left: "50%",
        top: "50%",
        transform: "translate(-50%, -50%)",
        display: "block",
        borderRadius: "50%",
        textDecoration: "none",
        zIndex: "20",
      });

      this.sunHalo = createElement("div", "products-sun-halo", this.sunAnchor);
      this.sunCorona = createElement("div", "products-sun-corona", this.sunAnchor);
      this.sunCore = createElement("div", "products-sun-core", this.sunAnchor);
      this.sunFlareA = createElement("div", "products-sun-flare flare-a", this.sunAnchor);
      this.sunFlareB = createElement("div", "products-sun-flare flare-b", this.sunAnchor);

      [this.sunHalo, this.sunCorona, this.sunCore, this.sunFlareA, this.sunFlareB].forEach((node) => {
        setStyles(node, {
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
          borderRadius: "50%",
        });
      });

      setStyles(this.sunHalo, {
        background: "radial-gradient(circle, rgba(255,220,122,0.26), rgba(255,177,73,0.12) 38%, rgba(94,143,255,0.08) 62%, transparent 76%)",
        filter: "blur(18px)",
      });

      setStyles(this.sunCorona, {
        border: "2px solid rgba(255,217,142,0.18)",
        boxShadow: "0 0 28px rgba(255,198,102,0.24)",
      });

      setStyles(this.sunCore, {
        overflow: "hidden",
        background: [
          "radial-gradient(circle at 34% 32%, rgba(255,255,255,0.98), rgba(255,244,201,0.95) 16%, #ffd88a 42%, #ff9c39 72%, #7e3f10 100%)",
        ].join(","),
        boxShadow: "0 0 28px rgba(255,198,102,0.72), 0 0 72px rgba(255,177,73,0.45), 0 0 120px rgba(114,166,255,0.18)",
      });

      setStyles(this.sunFlareA, {
        border: "1px solid rgba(122,179,255,0.16)",
      });

      setStyles(this.sunFlareB, {
        border: "1px solid rgba(255,217,142,0.14)",
      });

      this.sunAnchor.addEventListener("mouseenter", () => {
        this.sunAnchor.style.filter = "brightness(1.06)";
      });

      this.sunAnchor.addEventListener("mouseleave", () => {
        this.sunAnchor.style.filter = "brightness(1)";
      });
    }

    buildOrbitRings() {
      this.planets.forEach((planet) => {
        const ring = createElement("div", "products-orbit-ring", this.ringLayer);
        setStyles(ring, {
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%) rotate(-22deg)",
          borderRadius: "50%",
          border: "1px solid rgba(173,212,255,0.13)",
          boxShadow: "0 0 0 1px rgba(255,255,255,0.02), inset 0 0 24px rgba(140,188,255,0.03)",
          opacity: "0.92",
        });

        this.orbitRings.push({ el: ring, order: planet.orbitOrder });
      });
    }

    buildTokens() {
      this.tokens = this.planets.map((planet) => {
        const token = document.createElement("a");
        token.href = planet.href;
        token.className = "products-orbit-token";
        token.setAttribute("aria-label", planet.title);

        const kicker = document.createElement("span");
        kicker.textContent = planet.kicker;

        const title = document.createElement("strong");
        title.textContent = planet.title;

        const orb = document.createElement("div");
        orb.className = "products-planet-orb";

        token.appendChild(orb);
        token.appendChild(kicker);
        token.appendChild(title);
        this.tokenLayer.appendChild(token);

        setStyles(token, {
          position: "absolute",
          minWidth: "104px",
          maxWidth: "150px",
          padding: "10px 10px 12px",
          borderRadius: "22px",
          border: "1px solid rgba(255,255,255,0.14)",
          background: "linear-gradient(180deg, rgba(255,255,255,0.11), rgba(255,255,255,0.05))",
          color: "#f5f7ff",
          backdropFilter: "blur(10px)",
          boxShadow: "0 12px 30px rgba(0,0,0,0.22)",
          textAlign: "center",
          fontSize: "0.74rem",
          lineHeight: "1.2",
          transition: "transform 160ms ease, border-color 160ms ease, background 160ms ease, box-shadow 160ms ease",
          zIndex: "10",
        });

        setStyles(orb, {
          width: `${planet.sizeDesktop}px`,
          height: `${planet.sizeDesktop}px`,
          margin: "0 auto 8px",
          borderRadius: "50%",
          background: planet.color,
          border: "1px solid rgba(255,255,255,0.12)",
          boxShadow: "0 14px 24px rgba(0,0,0,0.22), inset -10px -12px 16px rgba(0,0,0,0.16), inset 10px 12px 14px rgba(255,255,255,0.16), 0 0 18px rgba(105,162,255,0.12)",
        });

        setStyles(kicker, {
          display: "block",
          marginBottom: "4px",
          fontSize: "0.56rem",
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          color: "rgba(245,247,255,0.6)",
        });

        setStyles(title, {
          display: "block",
          fontSize: "0.76rem",
          fontWeight: "700",
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
          planet,
          el: token,
          orb,
        };
      });
    }

    measure() {
      const rect = this.stage.getBoundingClientRect();
      const mobile = rect.width <= 760;
      const small = rect.width <= 480;

      const centerX = rect.width * 0.5;
      const centerY = rect.height * 0.54;

      const sunSize = clamp(rect.width * (mobile ? 0.22 : 0.18), 130, mobile ? 168 : 196);
      const horizontalRadiusBase = clamp(rect.width * (mobile ? 0.40 : 0.43), 150, mobile ? 250 : 390);
      const verticalRadiusBase = clamp(horizontalRadiusBase * 0.34, 44, mobile ? 92 : 140);
      const tiltDeg = mobile ? -18 : -22;

      return {
        width: rect.width,
        height: rect.height,
        centerX,
        centerY,
        sunSize,
        horizontalRadiusBase,
        verticalRadiusBase,
        tiltDeg,
        mobile,
        small,
      };
    }

    getOrbitRadius(order, m) {
      const t = order / this.planets.length;
      return {
        x: m.horizontalRadiusBase * (0.22 + t * 0.88),
        y: m.verticalRadiusBase * (0.28 + t * 0.82),
      };
    }

    layoutStatic() {
      const m = this.measure();

      setStyles(this.glowA, {
        background: "radial-gradient(circle at 50% 54%, rgba(124,166,255,0.18), transparent 58%)",
        filter: "blur(22px)",
      });

      setStyles(this.glowB, {
        background: "radial-gradient(circle at 46% 50%, rgba(111,255,219,0.1), transparent 62%)",
        filter: "blur(34px)",
      });

      setStyles(this.horizontalAxis, {
        left: `${m.centerX - m.horizontalRadiusBase * 1.12}px`,
        top: `${m.centerY}px`,
        width: `${m.horizontalRadiusBase * 2.24}px`,
      });

      setStyles(this.verticalAxis, {
        left: `${m.centerX}px`,
        top: `${m.centerY - m.verticalRadiusBase * 2.9}px`,
        height: `${m.verticalRadiusBase * 5.8}px`,
      });

      setStyles(this.sunAnchor, {
        width: `${m.sunSize}px`,
        height: `${m.sunSize}px`,
        left: `${m.centerX}px`,
        top: `${m.centerY}px`,
      });

      setStyles(this.sunHalo, {
        width: `${m.sunSize * 2.4}px`,
        height: `${m.sunSize * 2.4}px`,
      });

      setStyles(this.sunCorona, {
        width: `${m.sunSize * 1.28}px`,
        height: `${m.sunSize * 1.28}px`,
      });

      setStyles(this.sunCore, {
        width: `${m.sunSize}px`,
        height: `${m.sunSize}px`,
      });

      setStyles(this.sunFlareA, {
        width: `${m.sunSize * 1.56}px`,
        height: `${m.sunSize * 1.56}px`,
      });

      setStyles(this.sunFlareB, {
        width: `${m.sunSize * 1.9}px`,
        height: `${m.sunSize * 1.9}px`,
      });

      this.orbitRings.forEach((ring) => {
        const orbit = this.getOrbitRadius(ring.order, m);

        setStyles(ring.el, {
          width: `${orbit.x * 2}px`,
          height: `${orbit.y * 2}px`,
          left: `${m.centerX}px`,
          top: `${m.centerY}px`,
          transform: `translate(-50%, -50%) rotate(${m.tiltDeg}deg)`,
        });
      });

      this.tokens.forEach(({ planet, orb }) => {
        const size = m.mobile ? planet.sizeMobile : planet.sizeDesktop;
        setStyles(orb, {
          width: `${size}px`,
          height: `${size}px`,
        });
      });

      this.positionTokens(0);
    }

    positionTokens(timeDeg) {
      const m = this.measure();

      this.tokens.forEach(({ planet, el }) => {
        const orbit = this.getOrbitRadius(planet.orbitOrder, m);
        const point = polarToCartesian(
          m.centerX,
          m.centerY,
          orbit.x,
          orbit.y,
          planet.angle + timeDeg * planet.speed,
          m.tiltDeg
        );

        const width = el.offsetWidth || 120;
        const height = el.offsetHeight || 120;

        const safeLeft = 8;
        const safeRight = this.stage.clientWidth - width - 8;
        const safeTop = 8;
        const safeBottom = this.stage.clientHeight - height - 8;

        const left = clamp(point.x - width * 0.5, safeLeft, safeRight);
        const top = clamp(point.y - height * 0.5, safeTop, safeBottom);

        const scale = 0.86 + point.depth * 0.16;
        const transform = `translate3d(${left}px, ${top}px, 0) scale(${scale})`;

        el.dataset.transform = transform;
        el.style.transform = transform;
        el.style.opacity = `${0.78 + point.depth * 0.22}`;
        el.style.zIndex = `${10 + Math.round(point.depth * 20) + planet.orbitOrder}`;
      });
    }

    animate(time) {
      if (this.destroyed) return;
      if (!this.startTime) this.startTime = time;

      const elapsed = time - this.startTime;
      const timeDeg = elapsed * 0.06;
      const atmospherePulse = 1.038 + Math.sin(elapsed * 0.0011) * 0.008;
      const glowPulse = 1.16 + Math.cos(elapsed * 0.0008) * 0.02;
      const glowShiftA = Math.sin(elapsed * 0.00055) * 9;
      const glowShiftB = Math.cos(elapsed * 0.00042) * 7;

      this.sunHalo.style.transform = `translate(-50%, -50%) scale(${glowPulse})`;
      this.sunCore.style.transform = `translate(-50%, -50%) scale(${atmospherePulse})`;
      this.sunCorona.style.transform = `translate(-50%, -50%) rotate(${elapsed * 0.012}deg)`;
      this.sunFlareA.style.transform = `translate(-50%, -50%) rotate(${elapsed * 0.008}deg)`;
      this.sunFlareB.style.transform = `translate(-50%, -50%) rotate(${-elapsed * 0.006}deg)`;

      this.stars.forEach((star, index) => {
        const twinkle = 0.42 + (Math.sin(elapsed * 0.001 * star.drift + star.phase + index) + 1) * 0.2;
        star.el.style.opacity = `${twinkle}`;
      });

      this.glowA.style.transform = `translate(${glowShiftA}px, ${glowShiftB}px)`;
      this.glowB.style.transform = `translate(${-glowShiftB}px, ${glowShiftA * 0.6}px)`;

      this.positionTokens(timeDeg);

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
    },
  };
})();
