/* /showroom/index.cosmos.js
   Showroom bounded luminous-atmosphere continuity loader.

   The accepted Showroom Cosmos engine remains byte-identical in
   /showroom/index.cosmos.source.js. This loader adds the scene-contained
   luminous field shared by Laws and ARCHCOIN, then executes the preserved
   Cosmos source without taking controller, crystal, interaction, planet,
   Diamond, Window, route, or content authority.
*/
(() => {
  "use strict";

  const CONTRACT = Object.freeze({
    id: "SHOWROOM_COSMOS_LUMINOUS_CONTINUITY_WRAPPER_v1",
    sourceUrl:
      "./index.cosmos.source.js?v=SHOWROOM_COSMOS_SOURCE_LUMINOUS_CONTINUITY_20260726G",
    styleId: "showroom-luminous-continuity-style",
    sourcePreservedByteIdentical: true,
    sceneContainedLuminousField: true,
    ownsController: false,
    ownsCrystals: false,
    ownsInteractions: false,
    ownsPlanet: false,
    ownsDiamond: false,
    ownsWindow: false,
    ownsNavigation: false,
    ownsContent: false,
    visualPassClaimed: false
  });

  const FAILURE_EVENT =
    "SHOWROOM_COSMOS_LUMINOUS_CONTINUITY_FAILURE";
  const READY_EVENT =
    "SHOWROOM_COSMOS_LUMINOUS_CONTINUITY_READY";
  const SCRIPT_ATTRIBUTE =
    "data-showroom-preserved-cosmos-source";

  function fail(code, details = null) {
    const root = document.querySelector("[data-showroom-root]");
    if (root) {
      root.dataset.showroomLuminousContinuity = "held";
      root.dataset.showroomLuminousContinuityFailure = code;
    }

    const failure = Object.freeze({
      contractId: CONTRACT.id,
      code,
      details
    });

    globalThis.SHOWROOM_COSMOS_LUMINOUS_CONTINUITY_FAILURE = failure;
    globalThis.dispatchEvent(
      new CustomEvent(FAILURE_EVENT, { detail: failure })
    );

    const error = new Error(code);
    error.code = code;
    error.details = details;
    throw error;
  }

  function installLuminousStyle() {
    let style = document.getElementById(CONTRACT.styleId);
    if (!style) {
      style = document.createElement("style");
      style.id = CONTRACT.styleId;
      document.head.append(style);
    }

    style.textContent = `
      [data-showroom-orbit-field] {
        isolation: isolate;
        background:
          radial-gradient(ellipse at 14% 12%, rgba(117, 233, 255, .16), transparent 25rem),
          radial-gradient(ellipse at 84% 16%, rgba(245, 213, 130, .12), transparent 28rem),
          radial-gradient(ellipse at 82% 76%, rgba(182, 151, 255, .11), transparent 30rem),
          radial-gradient(ellipse at 15% 78%, rgba(62, 154, 198, .12), transparent 26rem),
          radial-gradient(circle at 50% 49%, rgba(70, 124, 205, .20), rgba(7, 15, 34, .42) 30%, rgba(2, 5, 13, .92) 76%),
          linear-gradient(135deg, #02040a 0%, #050914 46%, #03050b 100%);
        box-shadow:
          inset 0 0 5.5rem rgba(0, 0, 0, .34),
          inset 0 0 3.8rem rgba(78, 154, 225, .055),
          0 0 3rem rgba(117, 233, 255, .04);
      }

      [data-showroom-orbit-field]::before {
        opacity: .94;
        mix-blend-mode: screen;
        background:
          radial-gradient(circle at 7% 11%, rgba(255, 248, 224, .82) 0 .75px, transparent 1.9px),
          radial-gradient(circle at 18% 30%, rgba(117, 233, 255, .66) 0 .7px, transparent 1.8px),
          radial-gradient(circle at 31% 8%, rgba(255, 255, 255, .56) 0 .6px, transparent 1.7px),
          radial-gradient(circle at 44% 25%, rgba(224, 184, 91, .66) 0 .8px, transparent 2px),
          radial-gradient(circle at 62% 13%, rgba(117, 233, 255, .72) 0 .8px, transparent 2px),
          radial-gradient(circle at 77% 37%, rgba(255, 248, 224, .62) 0 .72px, transparent 1.9px),
          radial-gradient(circle at 91% 18%, rgba(182, 151, 255, .62) 0 .7px, transparent 1.85px),
          radial-gradient(circle at 12% 68%, rgba(117, 233, 255, .58) 0 .72px, transparent 1.9px),
          radial-gradient(circle at 29% 85%, rgba(255, 248, 224, .70) 0 .88px, transparent 2.1px),
          radial-gradient(circle at 51% 64%, rgba(224, 184, 91, .58) 0 .72px, transparent 1.9px),
          radial-gradient(circle at 70% 80%, rgba(117, 233, 255, .62) 0 .78px, transparent 2px),
          radial-gradient(circle at 89% 88%, rgba(255, 255, 255, .60) 0 .68px, transparent 1.85px);
        background-size:
          233px 197px,
          347px 293px,
          491px 389px,
          673px 521px,
          419px 337px,
          587px 463px,
          761px 607px,
          389px 311px,
          557px 431px,
          701px 569px,
          467px 373px,
          823px 647px;
      }

      [data-showroom-orbit-field]::after {
        opacity: .92;
        mix-blend-mode: screen;
        background:
          radial-gradient(ellipse at 50% 43%, rgba(117, 233, 255, .10), transparent 25rem),
          radial-gradient(ellipse at 18% 72%, rgba(182, 151, 255, .12), transparent 20rem),
          radial-gradient(ellipse at 80% 23%, rgba(117, 233, 255, .12), transparent 22rem),
          radial-gradient(ellipse at 78% 80%, rgba(245, 213, 130, .07), transparent 20rem);
      }

      [data-showroom-cosmic-field] {
        z-index: 1;
        opacity: .92;
        mix-blend-mode: screen;
        background:
          radial-gradient(circle at 50% 50%, transparent 0 25.8%, rgba(117, 233, 255, .075) 26.2% 26.65%, transparent 27.1%),
          radial-gradient(circle at 50% 50%, transparent 0 38%, rgba(245, 213, 130, .055) 38.4% 38.85%, transparent 39.3%),
          radial-gradient(ellipse at 50% 48%, rgba(76, 154, 226, .095), transparent 48%);
      }

      [data-showroom-cosmic-field]::before {
        border-color: rgba(139, 213, 255, .09);
        box-shadow:
          0 0 2.4rem rgba(117, 233, 255, .035),
          inset 0 0 2.2rem rgba(117, 233, 255, .025);
      }

      [data-showroom-cosmic-field]::after {
        border-color: rgba(245, 213, 130, .085);
        box-shadow:
          0 0 2rem rgba(245, 213, 130, .025),
          inset 0 0 1.8rem rgba(182, 151, 255, .02);
      }

      #showroom-cosmos-layer,
      #showroom-cosmos-canvas {
        mix-blend-mode: screen;
      }

      @media (max-width: 820px) {
        [data-showroom-orbit-field]::before { opacity: .82; }
        [data-showroom-orbit-field]::after { opacity: .78; }
        [data-showroom-cosmic-field] { opacity: .84; }
      }

      @media (prefers-reduced-motion: reduce) {
        [data-showroom-orbit-field]::before,
        [data-showroom-orbit-field]::after,
        [data-showroom-cosmic-field] {
          animation: none !important;
        }
      }
    `;

    return style;
  }

  function loadSourceSynchronously(url) {
    const request = new XMLHttpRequest();
    request.open("GET", url, false);
    request.send(null);

    if (request.status < 200 || request.status >= 300) {
      fail(`SHOWROOM_COSMOS_SOURCE_LOAD_FAILED:${request.status}`, { url });
    }

    return request.responseText;
  }

  function executePreservedSource(source) {
    if (document.querySelector(`script[${SCRIPT_ATTRIBUTE}]`)) {
      return false;
    }

    const script = document.createElement("script");
    script.setAttribute(SCRIPT_ATTRIBUTE, "true");
    script.dataset.ready = "false";
    script.textContent =
      source +
      "\n//# sourceURL=/showroom/index.cosmos.preserved-source.js";
    document.head.append(script);
    script.dataset.ready = "true";
    return true;
  }

  function install() {
    const root = document.querySelector("[data-showroom-root]");
    const field = document.querySelector("[data-showroom-orbit-field]");
    const mount = document.querySelector("[data-showroom-cosmic-field]");

    if (!root || !field || !mount) {
      fail("SHOWROOM_LUMINOUS_CONTINUITY_SURFACE_MISSING", {
        root: Boolean(root),
        field: Boolean(field),
        mount: Boolean(mount)
      });
    }

    installLuminousStyle();

    let sourceExecuted = false;
    if (!(globalThis.SHOWROOM_COSMOS && globalThis.SHOWROOM_COSMOS.initialized)) {
      sourceExecuted = executePreservedSource(
        loadSourceSynchronously(CONTRACT.sourceUrl)
      );
    }

    root.dataset.showroomLuminousContinuity = "available";
    root.dataset.showroomLuminousContinuityContract = CONTRACT.id;
    root.dataset.showroomLuminousContinuitySource = CONTRACT.sourceUrl;
    root.dataset.showroomLuminousContinuitySceneContained = "true";

    const receipt = Object.freeze({
      contractId: CONTRACT.id,
      sourceUrl: CONTRACT.sourceUrl,
      sourcePreservedByteIdentical: true,
      sourceExecuted,
      preservedCosmosAvailable: Boolean(globalThis.SHOWROOM_COSMOS),
      sceneContainedLuminousField: true,
      styleId: CONTRACT.styleId,
      protectedAuthoritiesChanged: false,
      visualPassClaimed: false
    });

    globalThis.SHOWROOM_COSMOS_LUMINOUS_CONTINUITY_RECEIPT = receipt;
    globalThis.dispatchEvent(
      new CustomEvent(READY_EVENT, { detail: receipt })
    );
  }

  install();
})();
