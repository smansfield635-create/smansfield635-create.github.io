// /showroom/globe/earth/index.js
const EARTH_ROUTE_STATE = Object.freeze({
  protocol: "TIC_TAC_TOE_DYNAMIC_PROTOCOL_v2",
  route: "/showroom/globe/earth/",
  body: "Earth",
  authority: "NASA_BLUE_MARBLE_REFERENCE",
  authorityPath: "/assets/earth/earth_canvas.js",
  mountId: "earthRenderMount",
  nasaBlueMarbleImage:
    "https://www.nasa.gov/wp-content/uploads/2023/03/618486main_earth_full.jpg?w=1041",
  publicReceiptRendering: false,
  mutatesRenderAsset: false,
  visualPassClaimed: false
});

function writeMountMessage(mount, message) {
  mount.innerHTML = "";

  const fallback = document.createElement("div");
  fallback.className = "mount-fallback";
  fallback.textContent = message;
  mount.appendChild(fallback);
}

function installEarthRouteStyles() {
  if (document.getElementById("earth-nasa-reference-route-style")) return;

  const style = document.createElement("style");
  style.id = "earth-nasa-reference-route-style";
  style.textContent = `
    .earth-nasa-reference-stage {
      width: min(100%, 760px);
      min-height: min(68vh, 760px);
      display: grid;
      place-items: center;
      position: relative;
      isolation: isolate;
    }

    .earth-nasa-orbit {
      width: min(82vw, 680px);
      aspect-ratio: 1 / 1;
      border-radius: 999px;
      position: relative;
      display: grid;
      place-items: center;
      overflow: hidden;
      background:
        radial-gradient(circle at 32% 28%, rgba(255,255,255,0.24), transparent 0.8rem),
        radial-gradient(circle at 50% 50%, rgba(97, 165, 255, 0.26), transparent 62%),
        #020714;
      box-shadow:
        0 0 1.5rem rgba(117, 184, 255, 0.28),
        0 0 4rem rgba(54, 109, 255, 0.22),
        inset -2rem -1.4rem 3.4rem rgba(0, 0, 0, 0.48),
        inset 1.3rem 1.1rem 2.2rem rgba(255, 255, 255, 0.16);
    }

    .earth-nasa-orbit::before {
      content: "";
      position: absolute;
      inset: -1px;
      border-radius: inherit;
      background:
        radial-gradient(circle at 35% 26%, rgba(255,255,255,0.30), transparent 19%),
        radial-gradient(circle at 71% 73%, rgba(0,0,0,0.34), transparent 43%);
      z-index: 3;
      pointer-events: none;
      mix-blend-mode: screen;
    }

    .earth-nasa-orbit::after {
      content: "";
      position: absolute;
      inset: 0;
      border-radius: inherit;
      box-shadow:
        inset -2.2rem -1.6rem 4rem rgba(0, 0, 0, 0.62),
        inset 0.75rem 0.75rem 1.3rem rgba(255, 255, 255, 0.18);
      z-index: 4;
      pointer-events: none;
    }

    .earth-nasa-blue-marble {
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: inherit;
      display: block;
      transform-origin: center;
      animation: earthNasaReferenceSpin 44s linear infinite;
      filter: saturate(1.08) contrast(1.04);
    }

    .earth-nasa-reference-label {
      position: absolute;
      left: 50%;
      bottom: 1rem;
      transform: translateX(-50%);
      z-index: 5;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: max-content;
      max-width: calc(100% - 2rem);
      border: 1px solid rgba(180, 212, 255, 0.38);
      border-radius: 999px;
      background: rgba(3, 7, 18, 0.72);
      color: rgba(244, 248, 255, 0.9);
      padding: 0.58rem 0.82rem;
      font-size: 0.82rem;
      font-weight: 900;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      backdrop-filter: blur(10px);
    }

    @keyframes earthNasaReferenceSpin {
      from { transform: scale(1.06) rotate(0deg); }
      to { transform: scale(1.06) rotate(360deg); }
    }

    @media (max-width: 760px) {
      .earth-nasa-reference-stage {
        min-height: 28rem;
      }

      .earth-nasa-orbit {
        width: min(88vw, 30rem);
      }

      .earth-nasa-reference-label {
        font-size: 0.72rem;
      }
    }
  `;

  document.head.appendChild(style);
}

function renderNasaEarthReference(mount) {
  installEarthRouteStyles();

  mount.innerHTML = "";
  mount.dataset.body = "Earth";
  mount.dataset.route = EARTH_ROUTE_STATE.route;
  mount.dataset.protocol = "TIC_TAC_TOE_DYNAMIC_PROTOCOL_v2";
  mount.dataset.authority = "NASA_BLUE_MARBLE_REFERENCE";
  mount.dataset.pending = "false";
  mount.dataset.publicReceiptRendering = "false";
  mount.dataset.visualPassClaimed = "false";
  mount.dataset.pairProof = "js-nasa-reference-mounted";

  const stage = document.createElement("div");
  stage.className = "earth-nasa-reference-stage";
  stage.dataset.body = "Earth";

  const orbit = document.createElement("div");
  orbit.className = "earth-nasa-orbit";

  const img = document.createElement("img");
  img.className = "earth-nasa-blue-marble";
  img.src = EARTH_ROUTE_STATE.nasaBlueMarbleImage;
  img.alt = "NASA Blue Marble Earth reference";
  img.decoding = "async";
  img.loading = "eager";
  img.dataset.source = "NASA_BLUE_MARBLE_2012";
  img.dataset.visualPassClaimed = "false";

  const label = document.createElement("div");
  label.className = "earth-nasa-reference-label";
  label.textContent = "NASA Blue Marble Reference";

  orbit.appendChild(img);
  orbit.appendChild(label);
  stage.appendChild(orbit);
  mount.appendChild(stage);

  img.addEventListener(
    "load",
    () => {
      document.documentElement.dataset.earthNasaReference = "visible";
      window.ShowroomEarthRoute = {
        ...EARTH_ROUTE_STATE,
        imported: true,
        rendered: true,
        held: false,
        pending: false,
        api: "NASA Blue Marble route image"
      };
    },
    { once: true }
  );

  img.addEventListener(
    "error",
    () => {
      writeMountMessage(
        mount,
        "NASA Blue Marble reference image failed to load from NASA. Earth route remains held."
      );

      window.ShowroomEarthRoute = {
        ...EARTH_ROUTE_STATE,
        imported: false,
        rendered: false,
        held: true,
        pending: false,
        reason: "NASA_BLUE_MARBLE_IMAGE_LOAD_FAILED"
      };
    },
    { once: true }
  );
}

async function bootEarthRoute() {
  document.documentElement.dataset.ticTacToeDynamicProtocol = "v2";
  document.documentElement.dataset.globeRoute = "earth";
  document.documentElement.dataset.publicReceipts = "hidden";
  document.documentElement.dataset.earthRouteScript = "executed";
  document.documentElement.dataset.earthPairProof = "html-js-paired";
  document.documentElement.dataset.earthAuthority = "NASA_BLUE_MARBLE_REFERENCE";

  const mount = document.getElementById(EARTH_ROUTE_STATE.mountId);

  if (!mount) {
    console.error("Earth mount not found.", EARTH_ROUTE_STATE.mountId);
    return;
  }

  renderNasaEarthReference(mount);

  try {
    await import(`${EARTH_ROUTE_STATE.authorityPath}?earth_reference_probe=${Date.now()}`);
    document.documentElement.dataset.earthLocalAuthorityReachable = "true";
  } catch (error) {
    document.documentElement.dataset.earthLocalAuthorityReachable = "false";
    console.warn("Earth local authority probe held. NASA reference remains active.", error);
  }
}

bootEarthRoute();
