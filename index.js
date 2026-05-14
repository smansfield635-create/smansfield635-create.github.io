// /index.js
// TNT FULL-FILE REPLACEMENT
// COMPASS_CUT_GEM_PREFACE_GATE_AUTHORITY_RENEWAL_TNT_v1
// Purpose:
// - Preserve the route model:
//   Flat -> /flat/
//   Round -> /products/
//   Universe -> /showroom/
// - Single tap/click changes lens.
// - Double tap/click opens route.
// - Enter opens active route from a focused lens control.
// - Space selects focused lens.
// - ArrowLeft / ArrowRight traverse lenses.
// - No generated image. No graphic box. No route mutation.

const COMPASS_STATE = Object.freeze({
  contract: "COMPASS_CUT_GEM_PREFACE_GATE_AUTHORITY_RENEWAL_TNT_v1",
  route: "/",
  role: "compass-cut-gem-preface-gate",
  defaultLens: "round",
  generatedImage: false,
  graphicBox: false,
  routeModelPreserved: true,
  singleTapChangesLens: true,
  doubleTapOpensRoute: true
});

const LENS_ORDER = Object.freeze(["flat", "round", "universe"]);
const DOUBLE_TAP_MS = 360;

const LENSES = Object.freeze({
  flat: Object.freeze({
    key: "flat",
    title: "World Is Flat",
    kicker: "Lens One",
    subtitle: "Investigation, map logic, and direct orientation.",
    text: "Flat is the investigation path: no center object, no orbit, no extra depth before the visitor understands the map.",
    route: "/flat/",
    button: "Open Flat"
  }),

  round: Object.freeze({
    key: "round",
    title: "World Is Round",
    kicker: "Default Lens",
    subtitle: "Movement, products, and revolving page logic.",
    text: "Round is the movement path: the message turns into usable product doors.",
    route: "/products/",
    button: "Open Round"
  }),

  universe: Object.freeze({
    key: "universe",
    title: "World Is a Universe",
    kicker: "Lens Three",
    subtitle: "Display world, Showroom, and wider visual proof.",
    text: "Universe is the display path: the visitor enters the Showroom before the deeper Globe Showcase opens.",
    route: "/showroom/",
    button: "Open Universe"
  })
});

const state = {
  lens: COMPASS_STATE.defaultLens,
  lastTapLens: "",
  lastTapAt: 0,
  booted: false
};

function byId(id) {
  return document.getElementById(id);
}

function getLens(key) {
  return LENSES[key] || LENSES[COMPASS_STATE.defaultLens];
}

function getCurrentLensIndex() {
  const index = LENS_ORDER.indexOf(state.lens);
  return index >= 0 ? index : LENS_ORDER.indexOf(COMPASS_STATE.defaultLens);
}

function markRoute(extra = {}) {
  const markers = {
    compassContract: COMPASS_STATE.contract,
    compassRoute: COMPASS_STATE.route,
    compassRole: COMPASS_STATE.role,
    compassLens: state.lens,
    generatedImage: "false",
    graphicBox: "false",
    routeModelPreserved: "true",
    singleTapChangesLens: "true",
    doubleTapOpensRoute: "true",
    ...extra
  };

  Object.entries(markers).forEach(([key, value]) => {
    document.documentElement.dataset[key] = String(value);
    if (document.body) document.body.dataset[key] = String(value);
  });
}

function setText(id, value) {
  const node = byId(id);
  if (node) node.textContent = value;
}

function setLensButtonState(lensKey) {
  document.querySelectorAll("[data-lens]").forEach((button) => {
    const buttonLens = getLens(button.dataset.lens).key;
    const active = buttonLens === lensKey;

    button.setAttribute("aria-pressed", String(active));
    button.setAttribute("aria-current", active ? "true" : "false");

    if (!button.getAttribute("type")) {
      button.setAttribute("type", "button");
    }

    if (!button.getAttribute("aria-label")) {
      button.setAttribute("aria-label", `${getLens(buttonLens).title} lens`);
    }
  });
}

function setPrimaryRoute(lens) {
  const primaryRoute = byId("primaryRoute");
  if (!primaryRoute) return;

  primaryRoute.href = lens.route;
  primaryRoute.textContent = lens.button;
  primaryRoute.dataset.activeLens = lens.key;
  primaryRoute.setAttribute("aria-label", `${lens.button}: ${lens.title}`);
}

function setLens(key, options = {}) {
  const lens = getLens(key);
  state.lens = lens.key;

  setText("activeLensTitle", lens.title);
  setText("activeLensKicker", lens.kicker);
  setText("activeLensSubtitle", lens.subtitle);
  setText("sceneText", lens.text);

  setPrimaryRoute(lens);
  setLensButtonState(lens.key);
  markRoute({
    compassLens: lens.key,
    activeRoute: lens.route
  });

  if (options.open === true) {
    window.location.href = lens.route;
  }

  return lens;
}

function openLensRoute(key = state.lens) {
  const lens = getLens(key);
  window.location.href = lens.route;
}

function handleLensPress(key) {
  const lens = getLens(key);
  const now = performance.now();
  const doubleTap =
    state.lastTapLens === lens.key &&
    now - state.lastTapAt < DOUBLE_TAP_MS;

  if (doubleTap) {
    state.lastTapLens = "";
    state.lastTapAt = 0;
    setLens(lens.key, { open: true });
    return;
  }

  setLens(lens.key);
  state.lastTapLens = lens.key;
  state.lastTapAt = now;
}

function bindLensButton(button) {
  if (button.dataset.compassBound === "true") return;

  button.dataset.compassBound = "true";

  button.addEventListener("click", () => {
    handleLensPress(button.dataset.lens);
  });

  button.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      openLensRoute(button.dataset.lens);
      event.preventDefault();
      return;
    }

    if (event.key === " ") {
      handleLensPress(button.dataset.lens);
      event.preventDefault();
    }
  });
}

function installGemControls() {
  document.querySelectorAll("[data-lens]").forEach(bindLensButton);
}

function installKeyboardTraversal() {
  if (document.documentElement.dataset.compassKeyboardBound === "true") return;

  document.documentElement.dataset.compassKeyboardBound = "true";

  document.addEventListener("keydown", (event) => {
    const target = event.target;
    const tagName = String(target?.tagName || "").toLowerCase();

    if (
      tagName === "input" ||
      tagName === "textarea" ||
      tagName === "select" ||
      target?.isContentEditable
    ) {
      return;
    }

    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;

    const index = getCurrentLensIndex();
    const direction = event.key === "ArrowLeft" ? -1 : 1;
    const nextIndex = (index + direction + LENS_ORDER.length) % LENS_ORDER.length;

    setLens(LENS_ORDER[nextIndex]);
    event.preventDefault();
  });
}

function publishPublicInterface() {
  window.DGBCompass = Object.freeze({
    ...COMPASS_STATE,

    lenses: LENSES,

    routes: Object.freeze({
      flat: LENSES.flat.route,
      round: LENSES.round.route,
      universe: LENSES.universe.route
    }),

    setLens,

    openLensRoute,

    status() {
      const lens = getLens(state.lens);

      return Object.freeze({
        ...COMPASS_STATE,
        ready: state.booted,
        activeLens: lens.key,
        activeTitle: lens.title,
        activeRoute: lens.route,
        lensOrder: [...LENS_ORDER],
        routeModel: Object.freeze({
          flat: "/flat/",
          round: "/products/",
          universe: "/showroom/"
        })
      });
    }
  });
}

function boot() {
  if (state.booted) return window.DGBCompass || null;

  state.booted = true;

  installGemControls();
  installKeyboardTraversal();
  setLens(COMPASS_STATE.defaultLens);
  publishPublicInterface();

  markRoute({
    booted: "true",
    compassLens: state.lens
  });

  return window.DGBCompass;
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", boot, { once: true });
} else {
  boot();
}

export {
  COMPASS_STATE,
  LENSES,
  LENS_ORDER,
  boot,
  getLens,
  setLens,
  openLensRoute
};

export default Object.freeze({
  model: "compass-cut-gem-preface-gate",
  contract: COMPASS_STATE.contract,
  routes: {
    flat: "/flat/",
    round: "/products/",
    universe: "/showroom/"
  },
  boot,
  setLens,
  openLensRoute
});
