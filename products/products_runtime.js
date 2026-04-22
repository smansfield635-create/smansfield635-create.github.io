(() => {
  "use strict";

  const GLOBAL_KEY = "ProductsPlanetRuntime";

  function el(tag, className, parent, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (typeof text === "string") node.textContent = text;
    if (parent) parent.appendChild(node);
    return node;
  }

  function css(node, styles) {
    Object.assign(node.style, styles);
  }

  function money(value) {
    return `$${Number(value).toLocaleString()}`;
  }

  class ProductsPlanetRuntime {
    constructor(options) {
      this.stage = options.stage || options.mount || null;
      this.mount = options.mount || options.stage || null;
      this.host = options.host || null;
      this.contract = options.contract || "PRODUCTS_HOST_CONTRACT_V1";
      this.receipts = options.receipts || null;
      this.reducedMotion = !!options.reducedMotion;
      this.cleanup = [];
      this.catalog = [
        {
          id: "architecture",
          lane: "North",
          title: "Architecture Systems",
          price: 18000,
          signal: "Contract-first",
          body:
            "Execution architecture for products that need clean ownership, routing, and stable governing structure.",
          bullets: [
            "Authority and scope map",
            "Contract and boundary design",
            "Execution-lane cleanup",
          ],
        },
        {
          id: "runtime",
          lane: "East",
          title: "Runtime Builds",
          price: 24000,
          signal: "Live-stage",
          body:
            "Interactive product surfaces that move from proof-of-concept to visibly working runtime expression.",
          bullets: [
            "Interactive page systems",
            "Mounted visual stage",
            "State and handoff flow",
          ],
        },
        {
          id: "instrumentation",
          lane: "West",
          title: "Instrumentation",
          price: 15000,
          signal: "Evidence-first",
          body:
            "Diagnostic products built to expose hidden breaks, stale layers, and failure surfaces before they spread.",
          bullets: [
            "Audit and trace surfaces",
            "Break isolation",
            "Failure compression",
          ],
        },
        {
          id: "deployment",
          lane: "South",
          title: "Deployment Paths",
          price: 12000,
          signal: "Release-safe",
          body:
            "Stable release paths for moving from working code to public delivery without losing continuity.",
          bullets: [
            "Publish hardening",
            "Surface continuity",
            "Post-launch stabilization",
          ],
        },
      ];
      this.activeIndex = 0;
      this.nodes = {};
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
      if (this.mount) {
        this.mount.innerHTML = "";
        this.mount.removeAttribute("data-runtime");
      }
    }

    create(options) {
      this.mountRuntime(options);
      return this;
    }

    mountRuntime() {
      if (!this.mount) throw new Error("mount target missing");

      this.mount.innerHTML = "";
      this.mount.setAttribute("data-runtime", "products-runtime-live-v2");

      css(this.mount, {
        position: "relative",
        minHeight: "560px",
        overflow: "hidden",
        pointerEvents: "auto",
      });

      const root = el("div", "products-live-root", this.mount);
      css(root, {
        position: "relative",
        minHeight: "560px",
        overflow: "hidden",
        padding: "20px",
        color: "#edf5ff",
        fontFamily:
          'Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        background: [
          "radial-gradient(circle at 22% 30%, rgba(62,112,214,0.18), transparent 24%)",
          "radial-gradient(circle at 80% 18%, rgba(241,210,141,0.08), transparent 16%)",
          "radial-gradient(circle at 50% 100%, rgba(7,61,110,0.18), transparent 28%)",
          "linear-gradient(180deg, rgba(4,13,32,0.20), rgba(4,13,32,0.04))",
        ].join(","),
      });

      const stars = el("div", "", root);
      css(stars, {
        position: "absolute",
        inset: "0",
        pointerEvents: "none",
        backgroundImage: [
          "radial-gradient(2px 2px at 10% 20%, rgba(255,255,255,0.92) 40%, transparent 55%)",
          "radial-gradient(2px 2px at 24% 78%, rgba(255,255,255,0.86) 40%, transparent 55%)",
          "radial-gradient(1.5px 1.5px at 49% 36%, rgba(255,255,255,0.75) 40%, transparent 55%)",
          "radial-gradient(2px 2px at 69% 22%, rgba(255,255,255,0.88) 40%, transparent 55%)",
          "radial-gradient(2px 2px at 84% 72%, rgba(255,255,255,0.82) 40%, transparent 55%)",
        ].join(","),
        opacity: "0.9",
      });

      const grid = el("div", "", root);
      css(grid, {
        position: "relative",
        zIndex: "1",
        maxWidth: "1120px",
        margin: "0 auto",
        display: "grid",
        gridTemplateColumns: window.innerWidth <= 920 ? "1fr" : "1.08fr 0.92fr",
        gap: "18px",
        alignItems: "stretch",
      });

      const handleResize = () => {
        grid.style.gridTemplateColumns =
          window.innerWidth <= 920 ? "1fr" : "1.08fr 0.92fr";
      };
      window.addEventListener("resize", handleResize);
      this.cleanup.push(() => window.removeEventListener("resize", handleResize));

      const stagePanel = el("section", "", grid);
      css(stagePanel, {
        position: "relative",
        minHeight: "520px",
        border: "1px solid rgba(173,212,255,0.14)",
        borderRadius: "30px",
        overflow: "hidden",
        background:
          "linear-gradient(180deg, rgba(9,18,40,0.62), rgba(10,20,46,0.34))",
        boxShadow: "0 24px 60px rgba(0,0,0,0.34)",
      });

      const veil = el("div", "", stagePanel);
      css(veil, {
        position: "absolute",
        inset: "0",
        background:
          "linear-gradient(90deg, rgba(4,13,32,0.08), rgba(4,13,32,0.42) 38%, rgba(4,13,32,0.78) 70%, rgba(4,13,32,0.90))",
        pointerEvents: "none",
      });

      const orbitWrap = el("div", "", stagePanel);
      css(orbitWrap, {
        position: "absolute",
        left: window.innerWidth <= 920 ? "50%" : "26%",
        top: window.innerWidth <= 920 ? "27%" : "50%",
        transform: "translate(-50%, -50%)",
        width: window.innerWidth <= 920 ? "220px" : "360px",
        height: window.innerWidth <= 920 ? "220px" : "360px",
        pointerEvents: "none",
      });

      const ring = el("div", "", orbitWrap);
      css(ring, {
        position: "absolute",
        inset: "0",
        borderRadius: "999px",
        border: "1px solid rgba(173,212,255,0.10)",
        boxShadow:
          "0 0 0 24px rgba(173,212,255,0.02),0 0 0 48px rgba(173,212,255,0.012)",
      });

      const diamond = el("div", "", orbitWrap);
      css(diamond, {
        position: "absolute",
        left: "50%",
        top: "50%",
        width: window.innerWidth <= 920 ? "118px" : "158px",
        height: window.innerWidth <= 920 ? "118px" : "158px",
        transform: "translate(-50%, -50%) rotate(45deg)",
        borderRadius: "26px",
        border: "1px solid rgba(241,210,141,0.22)",
        background:
          "linear-gradient(180deg, rgba(18,36,78,0.96), rgba(10,22,48,0.88))",
        boxShadow:
          "0 18px 44px rgba(0,0,0,0.40), inset 0 0 30px rgba(255,255,255,0.03)",
      });

      const diamondInner = el("div", "", diamond);
      css(diamondInner, {
        position: "absolute",
        inset: "14px",
        borderRadius: "18px",
        border: "1px solid rgba(173,212,255,0.14)",
        transform: "rotate(-45deg)",
        display: "grid",
        placeItems: "center",
        textAlign: "center",
        padding: "12px",
        color: "#f1d28d",
        fontFamily: 'Georgia, "Times New Roman", serif',
        fontSize: window.innerWidth <= 920 ? "1.5rem" : "2rem",
        lineHeight: "0.95",
      });
      diamondInner.innerHTML = "Products";

      const orbiters = [];
      this.catalog.forEach((item, index) => {
        const orbiter = el("button", "", orbitWrap);
        orbiter.type = "button";
        orbiter.setAttribute("aria-label", item.title);
        orbiter.textContent = String(index + 1);
        css(orbiter, {
          position: "absolute",
          left: "50%",
          top: "50%",
          width: "48px",
          height: "48px",
          transform: "translate(-50%, -50%)",
          borderRadius: "999px",
          border: "1px solid rgba(241,210,141,0.24)",
          background:
            "linear-gradient(180deg, rgba(13,26,56,0.96), rgba(10,19,42,0.90))",
          color: "#f1d28d",
          fontWeight: "800",
          fontSize: "1rem",
          cursor: "pointer",
          pointerEvents: "auto",
          boxShadow: "0 10px 24px rgba(0,0,0,0.32)",
        });
        const onClick = () => this.activate(index);
        orbiter.addEventListener("click", onClick);
        this.cleanup.push(() => orbiter.removeEventListener("click", onClick));
        orbiters.push({ node: orbiter, phase: (Math.PI / 2) * index });
      });

      const hero = el("div", "", stagePanel);
      css(hero, {
        position: "relative",
        zIndex: "1",
        minHeight: "520px",
        display: "flex",
        justifyContent: "flex-end",
        alignItems: "stretch",
      });

      const heroCard = el("div", "", hero);
      css(heroCard, {
        width: "min(520px,100%)",
        margin: "22px",
        padding: "24px",
        borderRadius: "28px",
        border: "1px solid rgba(173,212,255,0.14)",
        background:
          "linear-gradient(180deg, rgba(9,18,40,0.90), rgba(10,20,46,0.74))",
        boxShadow: "0 24px 60px rgba(0,0,0,0.36)",
        backdropFilter: "blur(8px)",
      });

      const eyebrow = el("div", "", heroCard);
      css(eyebrow, {
        color: "#f1d28d",
        fontWeight: "800",
        fontSize: ".78rem",
        letterSpacing: ".14em",
        textTransform: "uppercase",
        marginBottom: "12px",
      });

      const title = el("h2", "", heroCard);
      css(title, {
        margin: "0 0 12px",
        color: "#edf5ff",
        fontFamily: 'Georgia, "Times New Roman", serif',
        fontSize: "clamp(2rem,4.4vw,3.6rem)",
        lineHeight: ".95",
      });

      const body = el("p", "", heroCard);
      css(body, {
        margin: "0 0 18px",
        color: "#9fb2d2",
        fontSize: "1rem",
        lineHeight: "1.72",
      });

      const metaGrid = el("div", "", heroCard);
      css(metaGrid, {
        display: "grid",
        gridTemplateColumns: window.innerWidth <= 560 ? "1fr" : "repeat(3,minmax(0,1fr))",
        gap: "12px",
        marginBottom: "18px",
      });

      const resizeMeta = () => {
        metaGrid.style.gridTemplateColumns =
          window.innerWidth <= 560 ? "1fr" : "repeat(3,minmax(0,1fr))";
        orbitWrap.style.left = window.innerWidth <= 920 ? "50%" : "26%";
        orbitWrap.style.top = window.innerWidth <= 920 ? "27%" : "50%";
        orbitWrap.style.width = window.innerWidth <= 920 ? "220px" : "360px";
        orbitWrap.style.height = window.innerWidth <= 920 ? "220px" : "360px";
        diamond.style.width = window.innerWidth <= 920 ? "118px" : "158px";
        diamond.style.height = window.innerWidth <= 920 ? "118px" : "158px";
        diamondInner.style.fontSize = window.innerWidth <= 920 ? "1.5rem" : "2rem";
      };
      window.addEventListener("resize", resizeMeta);
      this.cleanup.push(() => window.removeEventListener("resize", resizeMeta));

      const mkMeta = (label) => {
        const card = el("div", "", metaGrid);
        css(card, {
          border: "1px solid rgba(173,212,255,0.12)",
          borderRadius: "18px",
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0.03))",
          padding: "14px",
        });
        const k = el("div", "", card, label);
        css(k, {
          marginBottom: "8px",
          color: "#9fb2d2",
          fontWeight: "700",
          fontSize: ".72rem",
          letterSpacing: ".12em",
          textTransform: "uppercase",
        });
        const v = el("div", "", card);
        css(v, {
          color: "#8ff0c5",
          fontWeight: "800",
          fontSize: "1rem",
          lineHeight: "1.4",
        });
        return v;
      };

      const signalValue = mkMeta("Signal");
      const priceValue = mkMeta("Price");
      const contractValue = mkMeta("Lane");

      const bulletsTitle = el("div", "", heroCard, "Included lanes");
      css(bulletsTitle, {
        color: "#f1d28d",
        fontWeight: "800",
        fontSize: ".76rem",
        letterSpacing: ".12em",
        textTransform: "uppercase",
        marginBottom: "12px",
      });

      const bullets = el("div", "", heroCard);
      css(bullets, { display: "grid", gap: "10px" });

      const side = el("section", "", grid);
      css(side, {
        display: "grid",
        gap: "14px",
        alignContent: "start",
      });

      const sideHeader = el("div", "", side);
      css(sideHeader, {
        border: "1px solid rgba(173,212,255,0.14)",
        borderRadius: "24px",
        background:
          "linear-gradient(180deg, rgba(9,18,40,0.82), rgba(10,20,46,0.62))",
        padding: "18px",
        boxShadow: "0 18px 42px rgba(0,0,0,0.28)",
      });

      const sideEyebrow = el("div", "", sideHeader, "Products catalog");
      css(sideEyebrow, {
        color: "#f1d28d",
        fontWeight: "800",
        fontSize: ".76rem",
        letterSpacing: ".14em",
        textTransform: "uppercase",
        marginBottom: "8px",
      });

      const sideTitle = el("div", "", sideHeader, "Selectable product lanes");
      css(sideTitle, {
        color: "#edf5ff",
        fontFamily: 'Georgia, "Times New Roman", serif',
        fontSize: "1.65rem",
        lineHeight: "1.1",
        marginBottom: "8px",
      });

      const sideCopy = el(
        "div",
        "",
        sideHeader,
        "The products stage is now alive. This runtime controls what the products page actually looks like."
      );
      css(sideCopy, {
        color: "#9fb2d2",
        fontSize: ".96rem",
        lineHeight: "1.65",
      });

      const rail = el("div", "", side);
      css(rail, { display: "grid", gap: "12px" });

      const cards = this.catalog.map((item, index) => {
        const card = el("button", "", rail);
        card.type = "button";
        css(card, {
          width: "100%",
          textAlign: "left",
          border: "1px solid rgba(173,212,255,0.12)",
          borderRadius: "22px",
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.055), rgba(255,255,255,0.03))",
          padding: "16px",
          color: "#edf5ff",
          cursor: "pointer",
          boxShadow: "0 12px 30px rgba(0,0,0,0.22)",
        });
        const onClick = () => this.activate(index);
        card.addEventListener("click", onClick);
        this.cleanup.push(() => card.removeEventListener("click", onClick));

        const c1 = el("div", "", card, `${item.lane} line`);
        css(c1, {
          color: "#f1d28d",
          fontWeight: "800",
          fontSize: ".72rem",
          letterSpacing: ".12em",
          textTransform: "uppercase",
          marginBottom: "8px",
        });

        const c2 = el("div", "", card, item.title);
        css(c2, {
          fontSize: "1.18rem",
          fontWeight: "800",
          lineHeight: "1.25",
          marginBottom: "8px",
        });

        const c3 = el("div", "", card, item.body);
        css(c3, {
          color: "#9fb2d2",
          fontSize: ".92rem",
          lineHeight: "1.6",
          marginBottom: "12px",
        });

        const meta = el("div", "", card);
        css(meta, {
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "12px",
          flexWrap: "wrap",
        });

        const m1 = el("div", "", meta, item.signal);
        css(m1, {
          color: "#8ff0c5",
          fontWeight: "700",
          fontSize: ".9rem",
        });

        const m2 = el("div", "", meta, money(item.price));
        css(m2, {
          color: "#edf5ff",
          fontWeight: "800",
          fontSize: ".94rem",
        });

        return card;
      });

      const footer = el("div", "", root);
      css(footer, {
        position: "relative",
        zIndex: "1",
        maxWidth: "1120px",
        margin: "18px auto 0",
        border: "1px solid rgba(173,212,255,0.12)",
        borderRadius: "24px",
        background:
          "linear-gradient(180deg, rgba(9,18,40,0.78), rgba(10,20,46,0.58))",
        padding: "18px",
        boxShadow: "0 18px 42px rgba(0,0,0,0.22)",
      });

      const footerTop = el("div", "", footer);
      css(footerTop, {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: "12px",
        flexWrap: "wrap",
        marginBottom: "10px",
      });

      const footerA = el("div", "", footerTop, "Runtime status: products surface active");
      css(footerA, {
        color: "#f1d28d",
        fontWeight: "800",
        fontSize: ".78rem",
        letterSpacing: ".10em",
        textTransform: "uppercase",
      });

      const footerB = el("div", "", footerTop, this.contract);
      css(footerB, {
        color: "#8ff0c5",
        fontWeight: "800",
        fontSize: ".84rem",
      });

      const footerCopy = el(
        "div",
        "",
        footer,
        "Bootstrap is complete. The remaining work is now pure products design and catalog expression."
      );
      css(footerCopy, {
        color: "#9fb2d2",
        fontSize: ".95rem",
        lineHeight: "1.65",
      });

      this.nodes = {
        eyebrow,
        title,
        body,
        signalValue,
        priceValue,
        contractValue,
        bullets,
        cards,
        orbiters,
        diamond,
      };

      this.activate(0);

      if (!this.reducedMotion) {
        let raf = 0;
        const tick = (time) => {
          const t = (time || 0) * 0.001;
          const mobile = window.innerWidth <= 920;
          const rx = mobile ? 78 : 128;
          const ry = mobile ? 52 : 88;

          orbiters.forEach((item, index) => {
            const a = t * 0.55 + item.phase;
            const x = Math.cos(a) * rx;
            const y = Math.sin(a) * ry;
            item.node.style.transform = `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`;
          });

          const spin = Math.sin(t * 0.8) * 10;
          this.nodes.diamond.style.transform = `translate(-50%, -50%) rotate(${45 + spin}deg)`;
          raf = window.requestAnimationFrame(tick);
        };
        raf = window.requestAnimationFrame(tick);
        this.cleanup.push(() => window.cancelAnimationFrame(raf));
      }

      this.write("good", "Products live runtime entered.");
      this.write("good", "Products catalog surface rendered.");
      this.write("good", "Interactive products stage active.");
    }

    activate(index) {
      this.activeIndex = Math.max(0, Math.min(index, this.catalog.length - 1));
      const item = this.catalog[this.activeIndex];

      this.nodes.eyebrow.textContent = `${item.lane} line`;
      this.nodes.title.textContent = item.title;
      this.nodes.body.textContent = item.body;
      this.nodes.signalValue.textContent = item.signal;
      this.nodes.priceValue.textContent = money(item.price);
      this.nodes.contractValue.textContent = item.lane;

      this.nodes.bullets.innerHTML = "";
      item.bullets.forEach((bullet) => {
        const row = el("div", "", this.nodes.bullets);
        css(row, {
          display: "grid",
          gridTemplateColumns: "12px minmax(0,1fr)",
          gap: "12px",
          alignItems: "start",
          padding: "12px 14px",
          borderRadius: "16px",
          border: "1px solid rgba(173,212,255,0.10)",
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.05), rgba(255,255,255,0.025))",
        });

        const dot = el("span", "", row);
        css(dot, {
          width: "10px",
          height: "10px",
          borderRadius: "999px",
          marginTop: "6px",
          background: "#8ff0c5",
          boxShadow: "0 0 0 4px rgba(143,240,197,0.08)",
        });

        const text = el("div", "", row, bullet);
        css(text, {
          color: "#edf5ff",
          lineHeight: "1.55",
          fontSize: ".95rem",
        });
      });

      this.nodes.cards.forEach((card, i) => {
        const active = i === this.activeIndex;
        card.style.transform = active ? "translateY(-2px)" : "translateY(0)";
        card.style.borderColor = active
          ? "rgba(241,210,141,0.28)"
          : "rgba(173,212,255,0.12)";
        card.style.boxShadow = active
          ? "0 18px 42px rgba(0,0,0,0.30)"
          : "0 12px 30px rgba(0,0,0,0.22)";
      });

      this.nodes.orbiters.forEach((orbiter, i) => {
        const active = i === this.activeIndex;
        orbiter.node.style.opacity = active ? "1" : "0.82";
        orbiter.node.style.borderColor = active
          ? "rgba(241,210,141,0.36)"
          : "rgba(241,210,141,0.24)";
        orbiter.node.style.boxShadow = active
          ? "0 12px 30px rgba(0,0,0,0.34),0 0 0 6px rgba(241,210,141,0.05)"
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
