// /index.js
// Compass cut-gem preface gate.
// Preserves the route model:
// Flat -> /flat/
// Round -> /products/
// Universe -> /showroom/
// Single tap/click changes lens. Double tap/click opens route.

const LENSES = Object.freeze({
  flat: {
    key: "flat",
    title: "World Is Flat",
    kicker: "Lens One",
    subtitle: "Investigation, map logic, and direct orientation.",
    text: "Flat is the investigation path: no center object, no orbit, no extra depth before the visitor understands the map.",
    route: "/flat/",
    button: "Open Flat"
  },
  round: {
    key: "round",
    title: "World Is Round",
    kicker: "Default Lens",
    subtitle: "Movement, products, and revolving page logic.",
    text: "Round is the movement path: the message turns into usable product doors.",
    route: "/products/",
    button: "Open Round"
  },
  universe: {
    key: "universe",
    title: "World Is a Universe",
    kicker: "Lens Three",
    subtitle: "Display world, Showroom, and wider visual proof.",
    text: "Universe is the display path: the visitor enters the Showroom before the deeper Globe Showcase opens.",
    route: "/showroom/",
    button: "Open Universe"
  }
});

const state = {
  lens: "round",
  lastTapLens: "",
  lastTapAt: 0
};

function $(id) {
  return document.getElementById(id);
}

function getLens(key) {
  return LENSES[key] || LENSES.round;
}

function setLens(key, options = {}) {
  const lens = getLens(key);
  state.lens = lens.key;

  document.documentElement.dataset.compassLens = lens.key;

  document.querySelectorAll("[data-lens]").forEach((button) => {
    const active = button.dataset.lens === lens.key;
    button.setAttribute("aria-pressed", String(active));
  });

  const title = $("activeLensTitle");
  const kicker = $("activeLensKicker");
  const subtitle = $("activeLensSubtitle");
  const sceneText = $("sceneText");
  const primaryRoute = $("primaryRoute");

  if (title) title.textContent = lens.title;
  if (kicker) kicker.textContent = lens.kicker;
  if (subtitle) subtitle.textContent = lens.subtitle;
  if (sceneText) sceneText.textContent = lens.text;

  if (primaryRoute) {
    primaryRoute.href = lens.route;
    primaryRoute.textContent = lens.button;
  }

  if (options.open === true) {
    window.location.href = lens.route;
  }
}

function handleLensPress(key) {
  const now = performance.now();
  const doubleTap = state.lastTapLens === key && now - state.lastTapAt < 360;

  if (doubleTap) {
    setLens(key, { open: true });
    state.lastTapLens = "";
    state.lastTapAt = 0;
    return;
  }

  setLens(key);
  state.lastTapLens = key;
  state.lastTapAt = now;
}

function installGemControls() {
  document.querySelectorAll("[data-lens]").forEach((button) => {
    button.addEventListener("click", () => {
      handleLensPress(button.dataset.lens);
    });

    button.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        const lens = getLens(button.dataset.lens);
        window.location.href = lens.route;
        event.preventDefault();
      }

      if (event.key === " ") {
        handleLensPress(button.dataset.lens);
        event.preventDefault();
      }
    });
  });
}

function installKeyboardTraversal() {
  document.addEventListener("keydown", (event) => {
    const order = ["flat", "round", "universe"];
    const index = order.indexOf(state.lens);

    if (event.key === "ArrowLeft") {
      const next = order[(index + order.length - 1) % order.length];
      setLens(next);
    }

    if (event.key === "ArrowRight") {
      const next = order[(index + 1) % order.length];
      setLens(next);
    }
  });
}

function boot() {
  installGemControls();
  installKeyboardTraversal();
  setLens("round");
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", boot, { once: true });
} else {
  boot();
}

export default {
  model: "compass-cut-gem-preface-gate",
  routes: {
    flat: "/flat/",
    round: "/products/",
    universe: "/showroom/"
  },
  setLens
};
