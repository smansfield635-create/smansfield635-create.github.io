(() => {
  "use strict";

  const GLOBAL_KEY = "ProductsPlanetRuntime";
  const GRAPHICS_SCRIPT_SRC = "/products/products_graphics.js";

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

  function ensureGraphicsScript() {
    return new Promise((resolve, reject) => {
      if (window.ProductsGraphics && typeof window.ProductsGraphics.renderScene === "function") {
        resolve(window.ProductsGraphics);
        return;
      }

      const existing = document.querySelector(`script[src="${GRAPHICS_SCRIPT_SRC}"]`);
      if (existing) {
        existing.addEventListener("load", () => resolve(window.ProductsGraphics), { once: true });
        existing.addEventListener("error", () => reject(new Error("graphics script failed to load")), { once: true });
        return;
      }

      const script = document.createElement("script");
      script.src = GRAPHICS_SCRIPT_SRC;
      script.defer = true;
      script.onload = () => resolve(window.ProductsGraphics);
      script.onerror = () => reject(new Error("graphics script failed to load"));
      document.head.appendChild(script);
    });
  }

  function createIcon(kind, theme) {
    if (kind === "archcoin" || kind === "aai") {
      const medallion = document.createElement("div");
      css(medallion, {
        width: "92px",
        height: "92px",
        borderRadius: "999px",
        display: "grid",
        placeItems: "center",
        marginBottom: "14px",
        border: "1px solid rgba(255,255,255,.14)",
        background:
          "radial-gradient(circle at 34% 30%, rgba(255,255,255,.08), transparent 18%), linear-gradient(180deg, rgba(15,22,40,.96), rgba(7,11,18,.92))",
        boxShadow:
          theme === "gold"
            ? "inset 0 0 0 1px rgba(255,255,255,.04),0 0 0 1px rgba(242,211,145,.12),0 0 26px rgba(242,211,145,.10)"
            : "inset 0 0 0 1px rgba(255,255,255,.04),0 0 0 1px rgba(135,184,255,.12),0 0 26px rgba(135,184,255,.12)",
        overflow: "hidden",
        position: "relative",
        zIndex: "2",
      });

      const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      svg.setAttribute("viewBox", "0 0 64 64");
      svg.setAttribute("width", "54");
      svg.setAttribute("height", "54");
      svg.setAttribute("aria-hidden", "true");

      const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      circle.setAttribute("cx", "32");
      circle.setAttribute("cy", "32");
      circle.setAttribute("r", "25");
      circle.setAttribute("fill", "none");
      circle.setAttribute("stroke", kind === "archcoin" ? "rgba(242,211,145,.86)" : "rgba(189,215,255,.88)");
      circle.setAttribute("stroke-width", "1.8");

      const path1 = document.createElementNS("http://www.w3.org/2000/svg", "path");
      path1.setAttribute("d", "M18 44 32 16 46 44");
      path1.setAttribute("fill", "none");
      path1.setAttribute("stroke", kind === "archcoin" ? "rgba(242,211,145,.96)" : "rgba(189,215,255,.96)");
      path1.setAttribute("stroke-width", "3.2");
      path1.setAttribute("stroke-linecap", "round");
      path1.setAttribute("stroke-linejoin", "round");

      const path2 = document.createElementNS("http://www.w3.org/2000/svg", "path");
      path2.setAttribute("d", "M23 34h18");
      path2.setAttribute("fill", "none");
      path2.setAttribute("stroke", kind === "archcoin" ? "rgba(242,211,145,.96)" : "rgba(189,215,255,.96)");
      path2.setAttribute("stroke-width", "3.2");
      path2.setAttribute("stroke-linecap", "round");

      svg.append(circle, path1, path2);
      medallion.appendChild(svg);
      return medallion;
    }

    const box = document.createElement("div");
    css(box, {
      width: "58px",
      height: "58px",
      marginBottom: "12px",
      borderRadius: "999px",
      border: "1px solid rgba(255,255,255,.12)",
      display: "grid",
      placeItems: "center",
      color: "rgba(244,247,255,.56)",
      background: "rgba(255,255,255,.02)",
      position: "relative",
      zIndex: "2",
    });

    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("viewBox", "0 0 24 24");
    svg.setAttribute("width", "24");
    svg.setAttribute("height", "24");
    svg.setAttribute("fill", "none");
    svg.setAttribute("stroke", "currentColor");
    svg.setAttribute("stroke-width", "1.8");
    svg.setAttribute("stroke-linecap", "round");
    svg.setAttribute("stroke-linejoin", "round");
    svg.setAttribute("aria-hidden", "true");

    if (kind === "leaf") {
      svg.innerHTML =
        '<path d="M18 3c-5.5 0-10 4.5-10 10v8"/><path d="M18 3c0 8-4 12-10 12"/><path d="M8 13c-2.8 0-5-2.2-5-5 2.8 0 5 2.2 5 5Z"/>';
    } else if (kind
