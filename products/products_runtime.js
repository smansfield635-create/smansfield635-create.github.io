(() => {
  "use strict";

  const GLOBAL_KEY = "ProductsPlanetRuntime";

  function createElement(tag, className, parent, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (typeof text === "string") node.textContent = text;
    if (parent) parent.appendChild(node);
    return node;
  }

  function setStyles(node, styles) {
    Object.assign(node.style, styles);
  }

  function formatMoney(value) {
    return `$${Number(value).toLocaleString()}`;
  }

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  class ProductsPlanetRuntime {
    constructor(options) {
      this.stage = options.stage || null;
      this.mount = options.mount || options.stage || null;
      this.host = options.host || null;
      this.contract = options.contract || "unknown-contract";
      this.meta = options.meta || {};
      this.reducedMotion = !!options.reducedMotion;
      this.receipts = options.receipts || null;
      this.root = null;
      this.frame = null;
      this.orbiters = [];
      this.cleanup = [];
      this.cards = [];
      this.activeIndex = 0;
      this.activeCard = null;
      this.catalog = [
        {
          id: "architecture",
          eyebrow: "North line",
          title: "Architecture Systems",
          blurb:
            "Structured products for organizations that need a governing model, runtime order, and clean execution surfaces.",
          metric: "Contract-first",
          price: 18000,
          signal: "High structure",
          bullets: [
            "Operating architecture",
            "Decision and authority map",
            "Execution-lane cleanup",
          ],
        },
        {
          id: "runtime",
          eyebrow: "East line",
          title: "Runtime Builds",
          blurb:
            "Interactive runtime surfaces that convert abstract structure into visible, working experiences.",
          metric: "Stage-ready",
          price: 24000,
          signal: "Live motion",
          bullets: [
            "Landing/runtime surfaces",
            "Page-state orchestration",
            "Visible stage ownership",
          ],
        },
        {
          id: "instrumentation",
          eyebrow: "West line",
          title: "Instrumentation",
          blurb:
            "Audit and diagnostic products built to expose what is live, what is stale, and what is drifting.",
          metric: "Evidence-first",
          price: 15000,
          signal: "Audit depth",
          bullets: [
            "Break isolation",
            "Behavior traces",
            "Failure-surface reduction",
          ],
        },
        {
          id: "deployment",
          eyebrow: "South line",
          title: "Deployment Paths",
          blurb:
            "Practical release products for moving from proof to stable public delivery without losing the contract.",
          metric: "Release-safe",
          price: 12000,
          signal: "Stability",
          bullets: [
            "Publish flow cleanup",
            "Surface continuity",
            "Post-launch hardening",
          ],
        },
      ];
    }

    write(level, text) {
      if (this.receipts && typeof this.receipts.write === "function") {
        this.receipts.write(level, text);
      }
    }

    destroy() {
      this.cleanup.forEach((fn) => {
        try {
          fn();
        } catch (_) {}
      });
      this.cleanup = [];
      this.orbiters = [];
      this.cards = [];
      this.activeCard = null;
      if (this.mount) {
        this.mount.innerHTML = "";
        this.mount.removeAttribute("data-runtime");
      }
    }

    mountRuntime() {
      if (!this.mount) {
        throw new Error("mount target missing");
      }

      this.mount.innerHTML = "";
      this.mount.setAttribute("data-runtime", "products-runtime-live-v1");

      setStyles(this.mount, {
        position: "relative",
        minHeight: "560px",
        overflow: "hidden",
        pointerEvents: "auto",
      });

      this.root = createElement("div", "products-runtime-root", this.mount);
      setStyles(this.root, {
        position: "relative",
        minHeight: "560px",
        overflow: "hidden",
        padding: "24px",
        background: [
          "radial-gradient(circle at 50% 24%, rgba(58,103,188,0.22), transparent 26%)",
          "radial-gradient(circle at 18% 82%, rgba(13, 110, 140, 0.16), transparent 22%)",
          "linear-gradient(180deg, rgba(4,13,32,0.54), rgba(4,13,32,0.22))",
        ].join(","),
        color: "#edf5ff",
        fontFamily:
          'Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      });

      this.buildRuntimeShell();
      this.buildCosmicField();
      this.buildHeroPanel();
      this.buildCatalogRail();
      this.buildActionFooter();
      this.activateCard(0);
      this.startMotion();

      this.write("good", "Products live runtime entered.");
      this.write("good", "Products showcase surface rendered.");
      this.write("good", "Interactive products stage active.");
    }

    buildRuntimeShell() {
      this.frame = createElement("div", "products-runtime-frame", this.root);
      setStyles(this.frame, {
        position: "relative",
        minHeight: "560px",
        maxWidth: "1120px",
        margin: "0 auto",
        display: "grid",
        gridTemplateColumns: "minmax(0, 1.1fr) minmax(300px, 0.9fr)",
        gap: "18px",
        zIndex: "1",
      });

      if (window.innerWidth <= 920) {
        this.frame.style.gridTemplateColumns = "1fr";
      }

      const resize = () => {
        this.frame.style.gridTemplateColumns =
          window.innerWidth <= 920
            ? "1fr"
            : "minmax(0, 1.1fr) minmax(300px, 0.9fr)";
      };

      window.addEventListener("resize", resize);
      this.cleanup.push(() => window.removeEventListener("resize", resize));
    }

    buildCosmicField() {
      const field = createElement("div", "products-cosmic-field", this.root);
      setStyles(field, {
        position: "absolute",
        inset: "0",
        overflow: "hidden",
        pointerEvents: "none",
      });

      const ring = createElement("div", "products-cosmic-ring", field);
      setStyles(ring, {
        position: "absolute",
        width: "420px",
        height: "420px",
        left: "23%",
        top: "45%",
        transform: "translate(-50%, -50%)",
        borderRadius: "999px",
        border: "1px solid rgba(173,212,255,0.10)",
        boxShadow:
          "0 0 0 28px rgba(173,212,255,0.022), 0 0 0 56px rgba(173,212,255,0.012)",
        opacity: "0.95",
      });

      const core = createElement("div", "products-cosmic-core", field);
      setStyles(core, {
        position: "absolute",
        width: "164px",
        height: "164px",
        left: "23%",
        top: "45%",
        transform: "translate(-50%, -50%) rotate(45deg)",
        borderRadius: "26px",
        background:
          "linear-gradient(180deg, rgba(18,36,78,0.95), rgba(10,22,48,0.86))",
        border: "1px solid rgba(241,210,141,0.20)",
        boxShadow:
          "0 24px 60px rgba(0,0,0,0.42), inset 0 0 34px rgba(255,255,255,0.03)",
      });

      const coreInner = createElement("div", "", core);
      setStyles(coreInner, {
        position: "absolute",
        inset: "16px",
        transform: "rotate(-45deg)",
        borderRadius: "18px",
        border: "1px solid rgba(173,212,255,0.14)",
        display: "grid",
        placeItems: "center",
        textAlign: "center",
        padding: "12px",
      });

      const coreTitle = createElement("div", "", coreInner, "Products");
      setStyles(coreTitle, {
        fontFamily: 'Georgia, "Times New Roman", serif',
        color: "#f1d28d",
        fontSize: "1.75rem",
        lineHeight: "1",
        marginBottom: "6px",
      });

      const coreSub = createElement("div", "", coreInner, "Live stage");
      setStyles(coreSub, {
        color: "#9fb2d2",
        fontSize: ".88rem",
        lineHeight: "1.5",
      });

      const orbitSpecs = [
        { angle: 0, label: "Architecture", x: 210, y: 0 },
        { angle: 90, label: "Runtime", x: 0, y: 210 },
        { angle: 180, label: "Instrumentation", x: -210, y: 0 },
        { angle: 270, label: "Deployment", x: 0, y: -210 },
      ];

      orbitSpecs.forEach((spec, index) => {
        const orbiter = createElement("button", "products-orbiter", field);
        orbiter.type = "button";
        orbiter.setAttribute("aria-label", spec.label);
        orbiter.textContent = String(index + 1);

        setStyles(orbiter, {
          position: "absolute",
          width: "52px",
          height: "52px",
          left: "23%",
          top: "45%",
          transform: "translate(-50%, -50%)",
          borderRadius: "999px",
          border: "1px solid rgba(241,210,141,0.22)",
          background:
            "linear-gradient(180deg, rgba(13,26,56,0.96), rgba(10,19,42,0.90))",
          color: "#f1d28d",
          fontWeight: "800",
          fontSize: "1rem",
          boxShadow: "0 10px 24px rgba(0,0,0,0.32)",
          pointerEvents: "auto",
          cursor: "pointer",
        });

        orbiter.addEventListener("click", () => this.activateCard(index));
        this.cleanup.push(() =>
          orbiter.removeEventListener("click", () => this.activateCard(index))
        );

        this.orbiters.push({
          node: orbiter,
          radiusX: spec.x,
          radiusY: spec.y,
          phase: (Math.PI / 2) * index,
          speed: 0.00075 + index * 0.00012,
          label: spec.label,
        });
      });
    }

    buildHeroPanel() {
      const left = createElement("section", "products-left-panel", this.frame);
      setStyles(left, {
        position: "relative",
        minHeight: "560px",
        border: "1px solid rgba(173,212,255,0.14)",
        borderRadius: "30px",
        background:
          "linear-gradient(180deg, rgba(9,18,40,0.48), rgba(9,18,40,0.22))",
        boxShadow: "0 24px 60px rgba(0,0,0,0.34)",
        overflow: "hidden",
      });

      const overlay = createElement("div", "", left);
      setStyles(overlay, {
        position: "absolute",
        inset: "0",
        background:
          "linear-gradient(90deg, rgba(4,13,32,0.10) 0%, rgba(4,13,32,0.48) 28%, rgba(4,13,32,0.78) 56%, rgba(4,13,32,0.90) 100%)",
        pointerEvents: "none",
      });

      const content = createElement("div", "", left);
      setStyles(content, {
        position: "relative",
        zIndex: "1",
        minHeight: "560px",
        display: "flex",
        alignItems: "stretch",
        justifyContent: "flex-end",
      });

      this.heroCard = createElement("div", "products-hero-card", content);
      setStyles(this.heroCard, {
        width: "min(520px, 100%)",
        margin: "22px",
        border: "1px solid rgba(173,212,255,0.14)",
        borderRadius: "28px",
        background:
          "linear-gradient(180deg, rgba(9,18,40,0.90), rgba(10,20,46,0.72))",
        boxShadow: "0 24px 60px rgba(0,0,0,0.36)",
        padding: "24px",
        backdropFilter: "blur(8px)",
      });

      this.heroEyebrow = createElement("div", "", this.heroCard);
      setStyles(this.heroEyebrow, {
        color: "#f1d28d",
        fontWeight: "800",
        letterSpacing: ".14em",
        textTransform: "uppercase",
        fontSize: ".82rem",
        marginBottom: "12px",
      });

      this.heroTitle = createElement("h2", "", this.heroCard);
      setStyles(this.heroTitle, {
        margin: "0 0 12px",
        fontFamily: 'Georgia, "Times New Roman", serif',
        fontSize: "clamp(2rem, 4.2vw, 3.6rem)",
        lineHeight: ".95",
        color: "#edf5ff",
      });

      this.heroBlurb = createElement("p", "", this.heroCard);
      setStyles(this.heroBlurb, {
        margin: "0 0 18px",
        color: "#9fb2d2",
        fontSize: "1rem",
        lineHeight: "1.7",
      });

      this.heroMetaGrid = createElement("div", "", this.heroCard);
      setStyles(this.heroMetaGrid, {
        display: "grid",
        gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
        gap: "12px",
        marginBottom: "18px",
      });

      const responsive = () => {
        this.heroMetaGrid.style.gridTemplateColumns =
          window.innerWidth <= 560 ? "1fr" : "repeat(3, minmax(0, 1fr))";
      };
      responsive();
      window.addEventListener("resize", responsive);
      this.cleanup.push(() => window.removeEventListener("resize", responsive));

      this.heroMetaA = this.createMetaCard(this.heroMetaGrid, "Signal");
      this.heroMetaB = this.createMetaCard(this.heroMetaGrid, "Price");
      this.heroMetaC = this.createMetaCard(this.heroMetaGrid, "Contract");

      const bulletTitle = createElement("div", "", this.heroCard, "Included lanes");
      setStyles(bulletTitle, {
        color: "#f1d28d",
        fontWeight: "800",
        letterSpacing: ".12em",
        textTransform: "uppercase",
        fontSize: ".76rem",
        marginBottom: "12px",
      });

      this.heroBulletList = createElement("div", "", this.heroCard);
      setStyles(this.heroBulletList, {
        display: "grid",
        gap: "10px",
      });
    }

    createMetaCard(parent, label) {
      const card = createElement("div", "", parent);
      setStyles(card, {
        border: "1px solid rgba(173,212,255,0.12)",
        borderRadius: "18px",
        background:
          "linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0.03))",
        padding: "14px",
      });

      const k = createElement("div", "", card, label);
      setStyles(k, {
        marginBottom: "8px",
        color: "#9fb2d2",
        fontWeight: "700",
        fontSize: ".72rem",
        letterSpacing: ".12em",
        textTransform: "uppercase",
      });

      const v = createElement("div", "", card, "");
      setStyles(v, {
        color: "#8ff0c5",
        fontWeight: "800",
        fontSize: "1rem",
        lineHeight: "1.4",
      });

      return v;
    }

    buildCatalogRail() {
      const right = createElement("section", "products-right-panel", this.frame);
      setStyles(right, {
        display: "grid",
        gap: "14px",
        alignContent: "start",
      });

      const railHeader = createElement("div", "", right);
      setStyles(railHeader, {
        border: "1px solid rgba(173,212,255,0.14)",
        borderRadius: "24px",
        background:
          "linear-gradient(180deg, rgba(9,18,40,0.82), rgba(10,20,46,0.62))",
        padding: "18px",
        boxShadow: "0 18px 42px rgba(0,0,0,0.28)",
      });

      const railEyebrow = createElement("div", "", railHeader, "Products catalog");
      setStyles(railEyebrow, {
        color: "#f1d28d",
        fontWeight: "800",
        letterSpacing: ".14em",
        textTransform: "uppercase",
        fontSize: ".76rem",
        marginBottom: "8px",
      });

      const railTitle = createElement("div", "", railHeader, "Selectable product lanes");
      setStyles(railTitle, {
        color: "#edf5ff",
        fontFamily: 'Georgia, "Times New Roman", serif',
        fontSize: "1.65rem",
        lineHeight: "1.1",
        marginBottom: "8px",
      });

      const railCopy = createElement(
        "div",
        "",
        railHeader,
        "The runtime is now stable enough to hold real product cards instead of a diagnostic shell."
      );
      setStyles(railCopy, {
        color: "#9fb2d2",
        fontSize: ".96rem",
        lineHeight: "1.65",
      });

      this.cardRail = createElement("div", "", right);
      setStyles(this.cardRail, {
        display: "grid",
        gap: "12px",
      });

      this.catalog.forEach((item, index) => {
        const card = createElement("button", "", this.cardRail);
        card.type = "button";

        setStyles(card, {
          textAlign: "left",
          width: "100%",
          border: "1px solid rgba(173,212,255,0.12)",
          borderRadius: "22px",
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.055), rgba(255,255,255,0.03))",
          padding: "16px",
          color: "#edf5ff",
          cursor: "pointer",
          boxShadow: "0 12px 30px rgba(0,0,0,0.22)",
          transition: "transform 160ms ease, border-color 160ms ease, box-shadow 160ms ease",
        });

        card.addEventListener("click", () => this.activateCard(index));
        card.addEventListener("mouseenter", () => {
          if (this.activeIndex !== index) {
            card.style.transform = "translateY(-2px)";
            card.style.borderColor = "rgba(241,210,141,0.24)";
          }
        });
        card.addEventListener("mouseleave", () => {
          if (this.activeIndex !== index) {
            card.style.transform = "translateY(0)";
            card.style.borderColor = "rgba(173,212,255,0.12)";
          }
        });

        const eyebrow = createElement("div", "", card, item.eyebrow);
        setStyles(eyebrow, {
          color: "#f1d28d",
          fontWeight: "800",
          fontSize: ".72rem",
          letterSpacing: ".12em",
          textTransform: "uppercase",
          marginBottom: "8px",
        });

        const title = createElement("div", "", card, item.title);
        setStyles(title, {
          fontSize: "1.22rem",
          fontWeight: "800",
          lineHeight: "1.25",
          marginBottom: "8px",
        });

        const blurb = createElement("div", "", card, item.blurb);
        setStyles(blurb, {
          color: "#9fb2d2",
          fontSize: ".92rem",
          lineHeight: "1.6",
          marginBottom: "12px",
        });

        const meta = createElement("div", "", card);
        setStyles(meta, {
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "12px",
          flexWrap: "wrap",
        });

        const signal = createElement("div", "", meta, item.signal);
        setStyles(signal, {
          color: "#8ff0c5",
          fontWeight: "700",
          fontSize: ".9rem",
        });

        const price = createElement("div", "", meta, formatMoney(item.price));
        setStyles(price, {
          color: "#edf5ff",
          fontWeight: "800",
          fontSize: ".94rem",
        });

        this.cards.push(card);
      });
    }

    buildActionFooter() {
      this.footer = createElement("div", "", this.root);
      setStyles(this.footer, {
        position: "relative",
        zIndex: "1",
        maxWidth: "1120px",
        margin: "18px auto 0",
        border: "1px solid rgba(173,212,255,0.12)",
        borderRadius: "24px",
        background:
          "linear-gradient(180deg, rgba(9,18,40,0.78), rgba(10,20,46,0.58))",
        padding: "18px",
        display: "grid",
        gap: "12px",
        boxShadow: "0 18px 42px rgba(0,0,0,0.22)",
      });

      const top = createElement("div", "", this.footer);
      setStyles(top, {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: "12px",
        flexWrap: "wrap",
      });

      const title = createElement("div", "", top, "Runtime status: products surface active");
      setStyles(title, {
        color: "#f1d28d",
        fontWeight: "800",
        letterSpacing: ".10em",
        textTransform: "uppercase",
        fontSize: ".78rem",
      });

      this.footerTag = createElement("div", "", top, this.contract);
      setStyles(this.footerTag, {
        color: "#8ff0c5",
        fontWeight: "800",
        fontSize: ".84rem",
      });

      this.footerCopy = createElement(
        "div",
        "",
        this.footer,
        "The runtime is now rendering the products experience rather than the boot proof card."
      );
      setStyles(this.footerCopy, {
        color: "#9fb2d2",
        fontSize: ".95rem",
        lineHeight: "1.65",
      });
    }

    activateCard(index) {
      this.activeIndex = clamp(index, 0, this.catalog.length - 1);
      const item = this.catalog[this.activeIndex];
      this.activeCard = item;

      this.heroEyebrow.textContent = item.eyebrow;
      this.heroTitle.textContent = item.title;
      this.heroBlurb.textContent = item.blurb;

      this.heroMetaA.textContent = item.signal;
      this.heroMetaB.textContent = formatMoney(item.price);
      this.heroMetaC.textContent = item.metric;

      this.heroBulletList.innerHTML = "";
      item.bullets.forEach((bullet) => {
        const row = createElement("div", "", this.heroBulletList);
        setStyles(row, {
          display: "grid",
          gridTemplateColumns: "12px minmax(0, 1fr)",
          gap: "12px",
          alignItems: "start",
          padding: "12px 14px",
          borderRadius: "16px",
          border: "1px solid rgba(173,212,255,0.10)",
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.05), rgba(255,255,255,0.025))",
        });

        const dot = createElement("span", "", row);
        setStyles(dot, {
          width: "10px",
          height: "10px",
          borderRadius: "999px",
          marginTop: "6px",
          background: "#8ff0c5",
          boxShadow: "0 0 0 4px rgba(143,240,197,0.08)",
        });

        const text = createElement("div", "", row, bullet);
        setStyles(text, {
          color: "#edf5ff",
          lineHeight: "1.55",
          fontSize: ".95rem",
        });
      });

      this.cards.forEach((card, cardIndex) => {
        const active = cardIndex === this.activeIndex;
        card.style.transform = active ? "translateY(-2px)" : "translateY(0)";
        card.style.borderColor = active
          ? "rgba(241,210,141,0.28)"
          : "rgba(173,212,255,0.12)";
        card.style.boxShadow = active
          ? "0 18px 42px rgba(0,0,0,0.30)"
          : "0 12px 30px rgba(0,0,0,0.22)";
      });
    }

    startMotion() {
      if (this.reducedMotion) {
        this.positionOrbiters(0);
        return;
      }

      let raf = 0;
      const tick = (time) => {
        this.positionOrbiters(time || 0);
        raf = window.requestAnimationFrame(tick);
      };
      raf = window.requestAnimationFrame(tick);
      this.cleanup.push(() => window.cancelAnimationFrame(raf));
    }

    positionOrbiters(time) {
      const cx = this.root && window.innerWidth <= 920 ? 50 : 23;
      const cy = this.root && window.innerWidth <= 920 ? 22 : 45;

      this.orbiters.forEach((orbiter, index) => {
        const t = time * orbiter.speed + orbiter.phase;
        const x = Math.cos(t) * 118;
        const y = Math.sin(t) * 118 * 0.68;

        orbiter.node.style.left = `${cx}%`;
        orbiter.node.style.top = `${cy}%`;
        orbiter.node.style.transform = `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`;
        orbiter.node.style.opacity = index === this.activeIndex ? "1" : "0.82";
        orbiter.node.style.borderColor =
          index === this.activeIndex
            ? "rgba(241,210,141,0.36)"
            : "rgba(241,210,141,0.22)";
        orbiter.node.style.boxShadow =
          index === this.activeIndex
            ? "0 12px 30px rgba(0,0,0,0.34), 0 0 0 6px rgba(241,210,141,0.05)"
            : "0 10px 24px rgba(0,0,0,0.32)";
      });
    }
  }

  window[GLOBAL_KEY] = {
    create(options) {
      const runtime = new ProductsPlanetRuntime(options || {});
      runtime.mountRuntime();
      return runtime;
    },
  };
})();
