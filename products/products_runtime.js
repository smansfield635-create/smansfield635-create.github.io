// /products/products_runtime.js
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
      this.stage = options.stage || null;
      this.mount = options.mount || options.stage || null;
      this.host = options.host || null;
      this.contract = options.contract || "unknown-contract";
      this.meta = options.meta || {};
      this.reducedMotion = !!options.reducedMotion;
      this.receipts = options.receipts || null;
      this.root = null;
    }

    write(level, text) {
      if (this.receipts && typeof this.receipts.write === "function") {
        this.receipts.write(level, text);
      }
    }

    mountRuntime() {
      if (!this.mount) {
        throw new Error("mount target missing");
      }

      this.mount.innerHTML = "";
      this.mount.setAttribute("data-runtime", "products-runtime-v3");

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
        inset: "0",
        overflow: "hidden",
        padding: "24px",
        background: [
          "radial-gradient(circle at 50% 36%, rgba(58,103,188,0.18), transparent 30%)",
          "radial-gradient(circle at 22% 22%, rgba(241,210,141,0.08), transparent 18%)",
          "linear-gradient(180deg, rgba(4,13,32,0.54), rgba(4,13,32,0.22))",
        ].join(","),
        color: "#edf5ff",
        fontFamily:
          'Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      });

      const orbit = createElement("div", "products-runtime-orbit", this.root);
      setStyles(orbit, {
        position: "absolute",
        width: "460px",
        height: "460px",
        left: "50%",
        top: "38%",
        transform: "translate(-50%, -50%)",
        borderRadius: "999px",
        border: "1px solid rgba(173,212,255,0.10)",
        boxShadow: "0 0 0 28px rgba(173,212,255,0.025), 0 0 0 56px rgba(173,212,255,0.015)",
        opacity: "0.95",
      });

      const core = createElement("div", "products-runtime-core", this.root);
      setStyles(core, {
        position: "absolute",
        width: "180px",
        height: "180px",
        left: "50%",
        top: "38%",
        transform: "translate(-50%, -50%) rotate(45deg)",
        borderRadius: "28px",
        background:
          "linear-gradient(180deg, rgba(20,38,82,0.95), rgba(11,23,52,0.84))",
        border: "1px solid rgba(241,210,141,0.20)",
        boxShadow:
          "0 20px 50px rgba(0,0,0,0.42), inset 0 0 40px rgba(255,255,255,0.03)",
        backdropFilter: "blur(6px)",
      });

      const coreInner = createElement("div", "", core);
      setStyles(coreInner, {
        position: "absolute",
        inset: "18px",
        borderRadius: "22px",
        border: "1px solid rgba(173,212,255,0.12)",
        display: "grid",
        placeItems: "center",
        transform: "rotate(-45deg)",
        textAlign: "center",
        padding: "16px",
      });

      const coreTitle = createElement("div", "", coreInner, "Products");
      setStyles(coreTitle, {
        fontFamily: 'Georgia, "Times New Roman", serif',
        fontSize: "2rem",
        color: "#f1d28d",
        lineHeight: "1",
        marginBottom: "8px",
      });

      const coreSub = createElement(
        "div",
        "",
        coreInner,
        "Runtime mounted successfully"
      );
      setStyles(coreSub, {
        fontSize: "0.9rem",
        color: "#9fb2d2",
        lineHeight: "1.5",
        maxWidth: "180px",
      });

      const shell = createElement("div", "products-runtime-shell", this.root);
      setStyles(shell, {
        position: "relative",
        zIndex: "1",
        maxWidth: "940px",
        margin: "300px auto 0",
        display: "grid",
        gap: "16px",
      });

      const hero = createElement("section", "products-runtime-hero", shell);
      setStyles(hero, {
        border: "1px solid rgba(173,212,255,0.14)",
        borderRadius: "28px",
        background:
          "linear-gradient(180deg, rgba(9,18,40,0.86), rgba(10,20,46,0.68))",
        boxShadow: "0 24px 60px rgba(0,0,0,0.42)",
        padding: "22px",
      });

      const eyebrow = createElement(
        "div",
        "products-runtime-eyebrow",
        hero,
        "Visible mount receipt"
      );
      setStyles(eyebrow, {
        color: "#f1d28d",
        fontWeight: "800",
        letterSpacing: ".14em",
        textTransform: "uppercase",
        fontSize: ".82rem",
        marginBottom: "10px",
      });

      const title = createElement(
        "h2",
        "products-runtime-title",
        hero,
        "Products runtime mounted successfully"
      );
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
        "The products page is no longer a blank surface. The runtime has taken visible stage ownership and is rendering directly from products_runtime.js."
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
        ["Contract", this.contract],
        ["Visible mount", "TRUE"],
        ["Reduced motion", this.reducedMotion ? "TRUE" : "FALSE"],
      ];

      receipts.forEach(([label, value]) => {
        const card = createElement("div", "products-runtime-card", receiptGrid);
        setStyles(card, {
          border: "1px solid rgba(173,212,255,0.12)",
          borderRadius: "22px",
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0.03))",
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
          wordBreak: "break-word",
        });
      });

      const trace = createElement("section", "products-runtime-trace", shell);
      setStyles(trace, {
        border: "1px solid rgba(173,212,255,0.12)",
        borderRadius: "24px",
        background:
          "linear-gradient(180deg, rgba(255,255,255,0.05), rgba(255,255,255,0.025))",
        padding: "18px",
      });

      const traceTitle = createElement(
        "h3",
        "products-runtime-trace-title",
        trace,
        "Boot trace"
      );
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
        "1. products_runtime.js evaluated successfully.",
        "2. window.ProductsPlanetRuntime was assigned.",
        "3. index.js discovered the runtime global.",
        "4. create({ stage, mount, contract, receipts }) was entered.",
        "5. The products stage was mounted from the runtime layer.",
        `6. Mount timestamp: ${formatNow()}.`,
      ].forEach((line) => {
        const row = createElement(
          "div",
          "products-runtime-trace-row",
          traceList,
          line
        );
        setStyles(row, {
          color: "#edf5ff",
          lineHeight: "1.55",
          padding: "10px 12px",
          borderRadius: "16px",
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.04), rgba(255,255,255,0.02))",
          border: "1px solid rgba(173,212,255,0.08)",
        });
      });

      this.write("good", "Runtime create() entered.");
      this.write("good", "Runtime stage ownership confirmed.");
      this.write("good", "Runtime visible mount rendered.");
    }

    destroy() {
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
