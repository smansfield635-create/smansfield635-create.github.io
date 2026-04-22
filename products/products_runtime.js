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

  function formatNow() {
    try {
      return new Date().toLocaleString();
    } catch {
      return "timestamp unavailable";
    }
  }

  class ProductsPlanetRuntime {
    constructor(options) {
      this.stage = options.stage;
      this.mount = options.mount;
      this.reducedMotion = !!options.reducedMotion;
      this.destroyed = false;
      this.root = null;
    }

    mountRuntime() {
      if (!this.mount) {
        throw new Error("mount target missing");
      }

      this.mount.innerHTML = "";
      this.mount.setAttribute("data-runtime", "products-runtime-boot-diagnostic-v1");

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
        overflow: "auto",
        padding: "18px",
        background: [
          "radial-gradient(circle at 50% 38%, rgba(58,103,188,0.14), transparent 34%)",
          "linear-gradient(180deg, rgba(4,13,32,0.54), rgba(4,13,32,0.22))",
        ].join(","),
        color: "#edf5ff",
        fontFamily: 'Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      });

      const shell = createElement("div", "products-runtime-shell", this.root);
      setStyles(shell, {
        maxWidth: "860px",
        margin: "0 auto",
        display: "grid",
        gap: "16px",
      });

      const hero = createElement("section", "products-runtime-hero", shell);
      setStyles(hero, {
        border: "1px solid rgba(173,212,255,0.14)",
        borderRadius: "28px",
        background: "linear-gradient(180deg, rgba(9,18,40,0.86), rgba(10,20,46,0.68))",
        boxShadow: "0 24px 60px rgba(0,0,0,0.42)",
        padding: "22px",
      });

      const eyebrow = createElement("div", "products-runtime-eyebrow", hero, "Runtime diagnostic");
      setStyles(eyebrow, {
        color: "#f1d28d",
        fontWeight: "800",
        letterSpacing: ".14em",
        textTransform: "uppercase",
        fontSize: ".82rem",
        marginBottom: "10px",
      });

      const title = createElement("h2", "products-runtime-title", hero, "Products runtime boot receipts");
      setStyles(title, {
        margin: "0 0 12px",
        fontFamily: 'Georgia, "Times New Roman", serif',
        fontSize: "clamp(2rem, 4vw, 3.2rem)",
        lineHeight: ".95",
        color: "#f1d28d",
      });

      const summary = createElement(
        "p",
        "products-runtime-summary",
        hero,
        "Geometry remains frozen. This pass proves that the runtime file loaded, the global API registered, create() was entered, and visible mount succeeded."
      );
      setStyles(summary, {
        margin: "0",
        color: "#9fb2d2",
        fontSize: "1rem",
        lineHeight: "1.7",
      });

      const receiptGrid = createElement("section", "products-runtime-grid", shell);
      setStyles(receiptGrid, {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
        gap: "14px",
      });

      const receipts = [
        ["Runtime file loaded", "TRUE"],
        ["Global key", GLOBAL_KEY],
        ["Global API registered", "TRUE"],
        ["create() entered", "TRUE"],
        ["Visible mount", "TRUE"],
        ["Reduced motion", this.reducedMotion ? "TRUE" : "FALSE"],
      ];

      receipts.forEach(([label, value]) => {
        const card = createElement("div", "products-runtime-card", receiptGrid);
        setStyles(card, {
          border: "1px solid rgba(173,212,255,0.12)",
          borderRadius: "22px",
          background: "linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0.03))",
          padding: "16px",
          boxShadow: "0 12px 30px rgba(0,0,0,0.22)",
        });

        const k = createElement("div", "products-runtime-card-label", card, label);
        setStyles(k, {
          marginBottom: "8px",
          fontSize: ".74rem",
          letterSpacing: ".12em",
          textTransform: "uppercase",
          color: "#9fb2d2",
          fontWeight: "700",
        });

        const v = createElement("div", "products-runtime-card-value", card, value);
        setStyles(v, {
          fontSize: "1.02rem",
          fontWeight: "800",
          color: "#8ff0c5",
        });
      });

      const trace = createElement("section", "products-runtime-trace", shell);
      setStyles(trace, {
        border: "1px solid rgba(173,212,255,0.12)",
        borderRadius: "24px",
        background: "linear-gradient(180deg, rgba(255,255,255,0.05), rgba(255,255,255,0.025))",
        padding: "18px",
      });

      const traceTitle = createElement("h3", "products-runtime-trace-title", trace, "Boot trace");
      setStyles(traceTitle, {
        margin: "0 0 12px",
        color: "#f1d28d",
        fontSize: "1rem",
        letterSpacing: ".08em",
        textTransform: "uppercase",
      });

      const traceList = createElement("div", "products-runtime-trace-list", trace);
      setStyles(traceList, {
        display: "grid",
        gap: "10px",
      });

      [
        "1. products_runtime.js evaluated at top level.",
        "2. window.ProductsPlanetRuntime was assigned.",
        "3. index.js located the global API.",
        "4. index.js entered create({ stage, mount, reducedMotion }).",
        "5. create() mounted this visible diagnostic surface.",
        `6. Boot timestamp: ${formatNow()}.`,
      ].forEach((line) => {
        const row = createElement("div", "products-runtime-trace-row", traceList, line);
        setStyles(row, {
          color: "#edf5ff",
          lineHeight: "1.55",
          padding: "10px 12px",
          borderRadius: "16px",
          background: "linear-gradient(180deg, rgba(255,255,255,0.04), rgba(255,255,255,0.02))",
          border: "1px solid rgba(173,212,255,0.08)",
        });
      });

      const footer = createElement("section", "products-runtime-footer", shell);
      setStyles(footer, {
        border: "1px solid rgba(173,212,255,0.1)",
        borderRadius: "22px",
        background: "linear-gradient(180deg, rgba(255,255,255,0.05), rgba(255,255,255,0.025))",
        padding: "16px 18px",
        color: "#9fb2d2",
        lineHeight: "1.65",
      });
      footer.innerHTML =
        "<strong style='color:#edf5ff'>Current read:</strong> runtime registration and visible mount are now proven from inside the runtime file itself. The next pass can resume products work from a real boot receipt instead of a blind standby state.";
    }

    destroy() {
      this.destroyed = true;
      if (this.mount) {
        this.mount.innerHTML = "";
        this.mount.removeAttribute("data-runtime");
      }
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
