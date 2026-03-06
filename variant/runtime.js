(function(){
  "use strict";

  const PAGE = document.body.dataset.page || "index";

  const STATE = {
    lang: "en"
  };

  const TEXT = {
    en: {
      "common.door":"Door",
      "common.home":"Home",
      "common.navigator":"Navigator",
      "common.products":"Products",
      "common.explore":"Explore",
      "common.laws":"Laws",
      "common.gauges":"Gauges",

      "index.kicker":"Primary Navigator",
      "index.heroKicker":"Rhombic Navigator",
      "index.heroTitle":"Stop the globe and choose a face",
      "index.heroBody":"A twelve-face navigator. Let it rotate. Tap once to stop and focus a face. Tap the same face again to enter it.",
      "index.resume":"Resume Spin",
      "index.readoutKicker":"Selection",
      "index.readoutIdle":"No face selected",
      "index.readoutBody":"Tap any face to stop rotation and bring it forward.",

      "home.kicker":"Launchpad",
      "home.title":"Where do you want to go next?",
      "home.heroKicker":"Home Surface",
      "home.heroTitle":"Where do you want to go next?",
      "home.heroBody":"Home is the readable bridge. The navigator is the immersive first impression.",
      "home.band":"Surfaces"
    },
    zh: {
      "common.door":"门",
      "common.home":"主页",
      "common.navigator":"导航器",
      "common.products":"产品",
      "common.explore":"探索",
      "common.laws":"法则",
      "common.gauges":"量规",

      "index.kicker":"主导航器",
      "index.heroKicker":"菱形十二面导航器",
      "index.heroTitle":"停住球体并选择一个面",
      "index.heroBody":"十二个面。让它缓慢旋转。点一次停住并聚焦。再点同一面进入。",
      "index.resume":"恢复旋转",
      "index.readoutKicker":"选择",
      "index.readoutIdle":"尚未选择面",
      "index.readoutBody":"点击任意一个面让它停止并来到前方。",

      "home.kicker":"发射台",
      "home.title":"你下一步想去哪？",
      "home.heroKicker":"主页表面",
      "home.heroTitle":"你下一步想去哪？",
      "home.heroBody":"主页是可读桥梁。导航器是沉浸式第一印象。",
      "home.band":"入口"
    },
    es: {
      "common.door":"Puerta",
      "common.home":"Inicio",
      "common.navigator":"Navegador",
      "common.products":"Productos",
      "common.explore":"Explorar",
      "common.laws":"Leyes",
      "common.gauges":"Medidores",

      "index.kicker":"Navegador Primario",
      "index.heroKicker":"Navegador Rómbico",
      "index.heroTitle":"Detén el globo y elige una cara",
      "index.heroBody":"Un navegador de doce caras. Déjalo girar. Toca una vez para detener y enfocar una cara. Toca la misma cara otra vez para entrar.",
      "index.resume":"Reanudar giro",
      "index.readoutKicker":"Selección",
      "index.readoutIdle":"Ninguna cara seleccionada",
      "index.readoutBody":"Toca cualquier cara para detener la rotación y traerla al frente.",

      "home.kicker":"Lanzadera",
      "home.title":"¿A dónde quieres ir ahora?",
      "home.heroKicker":"Superficie Home",
      "home.heroTitle":"¿A dónde quieres ir ahora?",
      "home.heroBody":"Home es el puente legible. El navegador es la primera impresión inmersiva.",
      "home.band":"Superficies"
    }
  };

  const ROUTES = {
    door:"/door/",
    home:"/home/",
    index:"/index.html",
    products:"/products/",
    explore:"/explore/",
    laws:"/laws/",
    gauges:"/gauges/"
  };

  const HOME_CARDS = {
    en:[
      ["Start at the big table?","Door is the intro hub.","Use Door when you want the intro posture.","Open: Door",ROUTES.door],
      ["Need the immersive navigator?","The twelve-face globe is the primary entrance.","Use the Navigator when you want the visual instrument first.","Open: Navigator",ROUTES.index],
      ["Want deployable things?","Products is the catalog.","Use Products when you want direct entry to product pages.","Open: Products",ROUTES.products],
      ["Want boundaries first?","Laws is doctrine.","Use Laws when you want constraints and allowed claims.","Open: Laws",ROUTES.laws],
      ["Want signals, not speeches?","Gauges is measurement only.","Use Gauges when you want numbers and trend direction.","Open: Gauges",ROUTES.gauges],
      ["Want frontier ideas safely labeled?","Explore is organized shells.","Use Explore when you want direction with controlled claims.","Open: Explore",ROUTES.explore]
    ],
    zh:[
      ["从总桌面开始？","Door 是入门枢纽。","想要入门姿态就用 Door。","打开：Door",ROUTES.door],
      ["需要沉浸式导航器？","十二面球体是主入口。","想先看视觉仪器就用导航器。","打开：Navigator",ROUTES.index],
      ["想看可落地的东西？","Products 是目录。","想直接进入产品页，就用 Products。","打开：Products",ROUTES.products],
      ["先看边界？","Laws 是教义。","想看系统约束就用 Laws。","打开：Laws",ROUTES.laws],
      ["想看信号而不是讲话？","Gauges 只做测量。","想要数字和趋势方向就用 Gauges。","打开：Gauges",ROUTES.gauges],
      ["想看前沿但要标注就绪度？","Explore 是有序壳。","想要方向但不夸口就用 Explore。","打开：Explore",ROUTES.explore]
    ],
    es:[
      ["¿Empezar por la mesa grande?","Door es el hub de intro.","Usa Door para postura de inicio.","Abrir: Door",ROUTES.door],
      ["¿Necesitas el navegador inmersivo?","El globo de doce caras es la entrada primaria.","Usa el Navegador para ver primero el instrumento visual.","Abrir: Navigator",ROUTES.index],
      ["¿Quieres cosas desplegables?","Products es catálogo.","Usa Products para entrada directa.","Abrir: Products",ROUTES.products],
      ["¿Límites primero?","Laws es doctrina.","Usa Laws para restricciones.","Abrir: Laws",ROUTES.laws],
      ["¿Señales, no discursos?","Gauges es medición solamente.","Usa Gauges para números y tendencia.","Abrir: Gauges",ROUTES.gauges],
      ["¿Ideas frontera con postura clara?","Explore es caparazón organizado.","Usa Explore para dirección controlada.","Abrir: Explore",ROUTES.explore]
    ]
  };

  function readState(){
    const qs = new URLSearchParams(window.location.search);
    const savedLang = localStorage.getItem("gd_lang");
    STATE.lang = qs.get("lang") || savedLang || "en";
    if (!["en","zh","es"].includes(STATE.lang)) STATE.lang = "en";
    localStorage.setItem("gd_lang", STATE.lang);
  }

  function withState(path){
    return path + "?lang=" + encodeURIComponent(STATE.lang);
  }

  function t(key){
    return (TEXT[STATE.lang] && TEXT[STATE.lang][key]) || TEXT.en[key] || key;
  }

  function applyI18n(){
    document.querySelectorAll("[data-i18n]").forEach(function(el){
      el.textContent = t(el.dataset.i18n);
    });
  }

  function markActiveLang(){
    document.querySelectorAll("[data-lang]").forEach(function(el){
      el.classList.toggle("active", el.dataset.lang === STATE.lang);
    });
  }

  function bindLang(){
    document.querySelectorAll("[data-lang]").forEach(function(el){
      el.addEventListener("click", function(){
        STATE.lang = el.dataset.lang;
        localStorage.setItem("gd_lang", STATE.lang);
        applyI18n();
        markActiveLang();
        if (PAGE === "home") renderHome();
        if (PAGE === "index") window.dispatchEvent(new CustomEvent("dgb:update-face-labels", { detail:{ lang:STATE.lang } }));
      });
    });
  }

  function bindBasicRoutes(){
    document.querySelectorAll("[data-route]").forEach(function(el){
      el.addEventListener("click", function(){
        window.location.href = withState(el.dataset.route);
      });
    });
  }

  function renderHome(){
    if (PAGE !== "home") return;
    const accordion = document.getElementById("accordion");
    const cards = HOME_CARDS[STATE.lang] || HOME_CARDS.en;
    accordion.innerHTML = "";

    cards.forEach(function(item, idx){
      const card = document.createElement("div");
      card.className = "card";
      card.innerHTML =
        '<button class="card-head" type="button" aria-expanded="' + (idx === 0 ? 'true' : 'false') + '">' +
          '<span class="card-mark"></span>' +
          '<span class="card-text">' +
            '<span class="card-q">' + item[0] + '</span>' +
            '<span class="card-s">' + item[1] + '</span>' +
          '</span>' +
          '<span class="card-chev">' + (idx === 0 ? '▾' : '▸') + '</span>' +
        '</button>' +
        '<div class="card-body' + (idx === 0 ? ' open' : '') + '">' +
          '<p>' + item[2] + '</p>' +
          '<div class="card-actions"><button class="action-btn" type="button">' + item[3] + '</button></div>' +
        '</div>';

      const head = card.querySelector(".card-head");
      const body = card.querySelector(".card-body");
      const chev = card.querySelector(".card-chev");
      const action = card.querySelector(".action-btn");

      head.addEventListener("click", function(){
        const open = body.classList.contains("open");
        accordion.querySelectorAll(".card-body").forEach(function(el){ el.classList.remove("open"); });
        accordion.querySelectorAll(".card-head").forEach(function(el){ el.setAttribute("aria-expanded","false"); });
        accordion.querySelectorAll(".card-chev").forEach(function(el){ el.textContent = "▸"; });
        if (!open){
          body.classList.add("open");
          head.setAttribute("aria-expanded","true");
          chev.textContent = "▾";
        }
      });

      action.addEventListener("click", function(){
        window.location.href = withState(item[4]);
      });

      accordion.appendChild(card);
    });
  }

  function bindSceneBridge(){
    if (PAGE !== "index") return;

    const resumeBtn = document.getElementById("resumeSpinBtn");
    const readoutName = document.getElementById("selectedFaceName");
    const readoutHint = document.getElementById("selectedFaceHint");

    if (resumeBtn){
      resumeBtn.addEventListener("click", function(){
        if (window.__DGB_RENDER__) window.__DGB_RENDER__.resume();
        readoutName.textContent = t("index.readoutIdle");
        readoutHint.textContent = t("index.readoutBody");
      });
    }

    window.addEventListener("dgb:face-focus", function(e){
      const face = e.detail.face;
      readoutName.textContent = face.label;
      readoutHint.textContent = "Tap the same face again to enter.";
    });

    window.addEventListener("dgb:face-enter", function(e){
      const face = e.detail.face;
      window.location.href = withState(face.route);
    });
  }

  function bootRender(){
    const script = document.createElement("script");
    script.src = "/variant/scene.js";
    script.defer = true;
    document.body.appendChild(script);
  }

  readState();
  applyI18n();
  markActiveLang();
  bindLang();
  bindBasicRoutes();
  renderHome();
  bindSceneBridge();
  bootRender();
})();
