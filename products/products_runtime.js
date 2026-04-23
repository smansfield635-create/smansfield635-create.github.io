(() => {
  "use strict";

  const GLOBAL_KEY = "ProductsPlanetRuntime";

  class ProductsPlanetRuntime {
    constructor(options = {}) {
      this.stage = options.stage || options.mount || null;
      this.mount = options.mount || options.stage || null;
      this.host = options.host || null;
      this.receipts = options.receipts || null;
      this.reducedMotion = !!options.reducedMotion;
      this.contract = "PRODUCTS_RUNTIME_RENEWAL_V3";
      this.status = "IDLE";
    }

    write(level, text) {
      if (this.receipts && typeof this.receipts.write === "function") {
        this.receipts.write(level, text);
      }
    }

    destroy() {
      if (this.mount && this.mount instanceof HTMLElement) {
        this.mount.removeAttribute("data-runtime");
        this.mount.removeAttribute("data-runtime-contract");
        this.mount.removeAttribute("data-runtime-owner");
      }
      this.status = "DESTROYED";
    }

    async mountRuntime() {
      const root = document.getElementById("productsPage");
      const grid = document.getElementById("productsGrid");
      const target = this.mount instanceof HTMLElement ? this.mount : grid || root || document.body;

      if (target && target instanceof HTMLElement) {
        target.setAttribute("data-runtime", "products-runtime-renewal-v3");
        target.setAttribute("data-runtime-contract", this.contract);
        target.setAttribute("data-runtime-owner", "index.js");
      }

      if (root) {
        root.setAttribute("data-products-runtime", "renewed");
      }

      this.status = "MOUNTED";
      this.write("info", "products runtime renewed to index.js ownership");

      return {
        status: this.status,
        contract: this.contract,
        owner: "index.js"
      };
    }
  }

  window[GLOBAL_KEY] = ProductsPlanetRuntime;
  window.ProductsPlanetRuntime = ProductsPlanetRuntime;
})();
