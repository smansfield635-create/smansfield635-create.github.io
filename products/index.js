(function () {
  "use strict";

  var qs = new URLSearchParams(window.location.search);
  var LS = window.localStorage;

  function safeGet(key) {
    try { return LS.getItem(key); } catch (e) { return null; }
  }

  function safeSet(key, value) {
    try { LS.setItem(key, value); } catch (e) {}
  }

  var lang = qs.get("lang") || safeGet("gd_lang") || "en";
  var style = qs.get("style") || safeGet("gd_style") || "informal";
  var time = qs.get("time") || safeGet("gd_time") || "now";
  var depth = qs.get("depth") || safeGet("gd_depth") || "1";
  var lane = qs.get("lane") || "";
  var focus = qs.get("focus") || "nutrition";

  if (lang !== "en" && lang !== "zh" && lang !== "es") lang = "en";
  if (style !== "informal" && style !== "formal") style = "informal";
  if (time !== "origin" && time !== "now" && time !== "post") time = "now";

  var d = parseInt(depth, 10);
  if (!isFinite(d)) d = 1;
  if (d < 1) d = 1;
  if (d > 9) d = 9;
  depth = String(d);

  if (lane !== "platform" && lane !== "engineering") lane = "";

  safeSet("gd_lang", lang);
  safeSet("gd_style", style);
  safeSet("gd_time", time);
  safeSet("gd_depth", depth);

  document.documentElement.lang = lang === "zh" ? "zh" : (lang === "es" ? "es" : "en");

  function pick(en, zh, es) {
    if (lang === "zh") return zh;
    if (lang === "es") return es;
    return en;
  }

  function buildQuery(extra) {
    var p = new URLSearchParams();
    p.set("lang", extra && extra.lang ? extra.lang : lang);
    p.set("style", extra && extra.style ? extra.style : style);
    p.set("time", extra && extra.time ? extra.time : time);
    p.set("depth", extra && extra.depth ? String(extra.depth) : depth);

    var resolvedLane = extra && extra.lane ? extra.lane : lane;
    if (resolvedLane === "platform" || resolvedLane === "engineering") p.set("lane", resolvedLane);

    var resolvedFocus = extra && extra.focus ? extra.focus : focus;
    if (resolvedFocus) p.set("focus", resolvedFocus);

    return "?" + p.toString();
  }

  function withState(route, extra) {
    var glue = route.indexOf("?") >= 0 ? "&" : "?";
    return route + glue + buildQuery(extra).slice(1);
  }

  function navigateTo(path, extra) {
    window.location.href = withState(path, extra || null);
  }

  function wireRoutes() {
    var nodes = document.querySelectorAll("[data-route]");
    var i;
    var el;
    var route;
    for (i = 0; i < nodes.length; i += 1) {
      el = nodes[i];
      route = el.getAttribute("data-route") || "";
      if (!route) continue;
      if (el.tagName === "A") el.setAttribute("href", withState(route));
    }
  }

  var COPY = {
    heroTitle: pick("PRODUCTS", "产品", "PRODUCTOS"),
    heroTag: pick(
      "Five separate true-3D glass compass objects, each spinning in place with direct product routing.",
      "五个独立的真正三维玻璃指南针对象，各自原地旋转并直接跳转到对应产品。",
      "Cinco objetos brújula de vidrio realmente 3D, separados y girando en su propio lugar con ruta directa."
    ),
    scenePill: pick("TRUE 3D GLASS COMPASS", "真正 3D 玻璃指南针", "BRÚJULA DE VIDRIO 3D"),
    navCompass: pick("COMPASS", "指南针", "BRÚJULA"),
    navProducts: pick("PRODUCTS", "产品", "PRODUCTOS"),
    navExplore: pick("EXPLORE", "探索", "EXPLORAR"),
    navGauges: pick("GAUGES", "量规", "MEDIDORES"),
    focusPrefix: pick("FOCUS:", "聚焦：", "FOCO:"),
    products: [
      { key: "nutrition", title: pick("BASELINE NUTRITION", "基线营养", "NUTRICIÓN BASELINE"), sub: pick("SYSTEMS", "系统", "SISTEMAS"), route: "/products/nutrition/" },
      { key: "ai", title: pick("ON YOUR SIDE AI", "站你这边 AI", "ON YOUR SIDE AI"), sub: pick("INTELLIGENCE", "智能", "INTELIGENCIA"), route: "/products/on-your-side-ai/" },
      { key: "language", title: pick("EDUCATION & LANGUAGE", "教育与语言", "EDUCACIÓN Y LENGUAJE"), sub: pick("SYSTEMS", "系统", "SISTEMAS"), route: "/products/education/" },
      { key: "game", title: pick("FIVE FLAGS", "五旗", "FIVE FLAGS"), sub: pick("WHAT'S MY THEME?", "我的主题是什么？", "¿CUÁL ES MI TEMA?"), route: "/products/five-flags/" },
      { key: "coin", title: pick("ARCHCOIN", "ARCHCOIN", "ARCHCOIN"), sub: pick("PRODUCT LINE", "产品线", "LÍNEA DE PRODUCTO"), route: "/products/archcoin/" }
    ]
  };

  var heroTitle = document.getElementById("heroTitle");
  var heroTag = document.getElementById("heroTag");
  var scenePill = document.getElementById("scenePill");
  var navCompass = document.getElementById("navCompass");
  var navProducts = document.getElementById("navProducts");
  var navExplore = document.getElementById("navExplore");
  var navGauges = document.getElementById("navGauges");
  var focusPill = document.getElementById("focusPill");
  var chamber = document.getElementById("productChamber");
  var productNodes = Array.prototype.slice.call(document.querySelectorAll(".product-node"));
  var dockButtons = Array.prototype.slice.call(document.querySelectorAll(".dock-btn"));

  heroTitle.textContent = COPY.heroTitle;
  heroTag.textContent = COPY.heroTag;
  scenePill.textContent = COPY.scenePill;
  navCompass.textContent = COPY.navCompass;
  navProducts.textContent = COPY.navProducts;
  navExplore.textContent = COPY.navExplore;
  navGauges.textContent = COPY.navGauges;

  wireRoutes();

  function setNodeText(id, value) {
    var node = document.getElementById(id);
    if (node) node.textContent = value;
  }

  function syncCopy() {
    setNodeText("titleNutrition", COPY.products[0].title);
    setNodeText("subNutrition", COPY.products[0].sub);
    setNodeText("titleAI", COPY.products[1].title);
    setNodeText("subAI", COPY.products[1].sub);
    setNodeText("titleLanguage", COPY.products[2].title);
    setNodeText("subLanguage", COPY.products[2].sub);
    setNodeText("titleGame", COPY.products[3].title);
    setNodeText("subGame", COPY.products[3].sub);
    setNodeText("titleCoin", COPY.products[4].title);
    setNodeText("subCoin", COPY.products[4].sub);

    if (dockButtons[0]) dockButtons[0].textContent = pick("Nutrition", "营养", "Nutrición");
    if (dockButtons[1]) dockButtons[1].textContent = pick("AI", "AI", "AI");
    if (dockButtons[2]) dockButtons[2].textContent = pick("Education", "教育", "Educación");
    if (dockButtons[3]) dockButtons[3].textContent = pick("Five Flags", "五旗", "Five Flags");
    if (dockButtons[4]) dockButtons[4].textContent = COPY.products[4].title;
  }

  var STATE = {
    raf: 0,
    focusedIndex: 0,
    reducedMotion: false,
    paused: false,
    mobile: false,
    time: 0
  };

  try {
    var motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    STATE.reducedMotion = !!motionQuery.matches;
    if (typeof motionQuery.addEventListener === "function") {
      motionQuery.addEventListener("change", function () {
        STATE.reducedMotion = !!motionQuery.matches;
      });
    } else if (typeof motionQuery.addListener === "function") {
      motionQuery.addListener(function () {
        STATE.reducedMotion = !!motionQuery.matches;
      });
    }
  } catch (e) {
    STATE.reducedMotion = false;
  }

  function resolveFocusIndex() {
    var i;
    for (i = 0; i < COPY.products.length; i += 1) {
      if (COPY.products[i].key === focus) return i;
    }
    return 0;
  }

  function setFocus(index, updateUrl) {
    var i;
    var safeIndex = index;
    if (safeIndex < 0) safeIndex = 0;
    if (safeIndex >= COPY.products.length) safeIndex = COPY.products.length - 1;

    STATE.focusedIndex = safeIndex;
    focus = COPY.products[safeIndex].key;

    for (i = 0; i < productNodes.length; i += 1) {
      productNodes[i].classList.toggle("is-focus", i === safeIndex);
    }

    for (i = 0; i < dockButtons.length; i += 1) {
      dockButtons[i].classList.toggle("is-active", i === safeIndex);
    }

    focusPill.textContent = COPY.focusPrefix + " " + COPY.products[safeIndex].title;

    if (updateUrl) {
      window.history.replaceState({}, "", window.location.pathname + buildQuery({ focus: focus }));
    }
  }

  function getAnchors() {
    if (STATE.mobile) {
      return [
        { x: 0.50, y: 0.56, z: 64, spin: 0.020, tilt: -10 },
        { x: 0.24, y: 0.28, z: 22, spin: 0.017, tilt: -10 },
        { x: 0.76, y: 0.28, z: 22, spin: -0.017, tilt: -10 },
        { x: 0.26, y: 0.82, z: 10, spin: 0.015, tilt: -10 },
        { x: 0.74, y: 0.82, z: 10, spin: -0.015, tilt: -10 }
      ];
    }

    return [
      { x: 0.50, y: 0.56, z: 72, spin: 0.020, tilt: -10 },
      { x: 0.25, y: 0.28, z: 28, spin: 0.017, tilt: -10 },
      { x: 0.75, y: 0.28, z: 28, spin: -0.017, tilt: -10 },
      { x: 0.27, y: 0.82, z: 14, spin: 0.015, tilt: -10 },
      { x: 0.73, y: 0.82, z: 14, spin: -0.015, tilt: -10 }
    ];
  }

  function layoutProducts() {
    var anchors = getAnchors();
    var rect = chamber.getBoundingClientRect();
    var w = rect.width;
    var h = rect.height;
    var i;
    var node;
    var anchor;
    var x;
    var y;
    var z;
    var wrap;
    var shadow;
    var rotationY;
    var tiltX;
    var lift;
    var opacity;
    var focusScale;

    for (i = 0; i < productNodes.length; i += 1) {
      node = productNodes[i];
      anchor = anchors[i];
      x = w * anchor.x;
      y = h * anchor.y;
      z = anchor.z;

      rotationY = STATE.reducedMotion ? 0 : (STATE.time * anchor.spin);
      tiltX = STATE.reducedMotion ? anchor.tilt : (anchor.tilt + Math.sin((STATE.time * 0.001) + i) * 1.2);
      lift = i === STATE.focusedIndex ? 8 : 0;
      opacity = i === STATE.focusedIndex ? 1 : 0.96;
      focusScale = i === STATE.focusedIndex ? 1.06 : 1;

      node.style.left = x + "px";
      node.style.top = (y - lift) + "px";
      node.style.marginLeft = (-node.offsetWidth / 2) + "px";
      node.style.marginTop = (-node.offsetHeight / 2) + "px";
      node.style.zIndex = String(20 + Math.round(z));
      node.style.opacity = String(opacity);
      node.style.transform = "translate3d(0,0," + z + "px)";

      wrap = node.querySelector(".object-wrap");
      if (wrap) {
        wrap.style.transform =
          "rotateX(" + tiltX + "deg) " +
          "rotateY(" + rotationY + "deg) " +
          "scale(" + focusScale + ")";
      }

      shadow = node.querySelector(".product-shadow");
      if (shadow) {
        shadow.style.opacity = i === STATE.focusedIndex ? "0.94" : "0.78";
      }
    }
  }

  function animate(ts) {
    if (!STATE.paused) {
      STATE.time = ts || 0;
      layoutProducts();
    }
    STATE.raf = window.requestAnimationFrame(animate);
  }

  function bindNodes() {
    var i;
    var node;
    var index;
    var route;

    for (i = 0; i < productNodes.length; i += 1) {
      node = productNodes[i];
      index = parseInt(node.getAttribute("data-index") || "0", 10);
      route = node.getAttribute("data-route") || "/products/";

      (function (boundNode, boundIndex, boundRoute) {
        boundNode.addEventListener("mouseenter", function () {
          setFocus(boundIndex, true);
        }, { passive: true });

        boundNode.addEventListener("focus", function () {
          setFocus(boundIndex, true);
        }, { passive: true });

        boundNode.addEventListener("click", function () {
          navigateTo(boundRoute, { focus: COPY.products[boundIndex].key });
        }, { passive: true });
      })(node, index, route);
    }
  }

  function bindDock() {
    var i;
    for (i = 0; i < dockButtons.length; i += 1) {
      (function (boundIndex) {
        dockButtons[boundIndex].addEventListener("click", function () {
          setFocus(boundIndex, true);
        }, { passive: true });
      })(i);
    }
  }

  function updateResponsiveState() {
    STATE.mobile = window.innerWidth < 720;
    layoutProducts();
  }

  function bindSystem() {
    window.addEventListener("resize", updateResponsiveState, { passive: true });
    document.addEventListener("visibilitychange", function () {
      STATE.paused = !!document.hidden;
    }, false);
  }

  syncCopy();
  bindNodes();
  bindDock();
  bindSystem();
  setFocus(resolveFocusIndex(), false);
  updateResponsiveState();
  animate(0);
})();
