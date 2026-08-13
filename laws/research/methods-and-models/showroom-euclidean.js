(() => {
  "use strict";

  const contract = "METHODS_MODELS_ROTATIONAL_TEXT_INSTRUMENT_v1";
  document.documentElement.dataset.methodsModelsEuclideanShowroom = "active";

  const stylesheet = document.createElement("link");
  stylesheet.rel = "stylesheet";
  stylesheet.href = "/laws/research/methods-and-models/rotational-text.css?v=METHODS_MODELS_ROTATIONAL_TEXT_INSTRUMENT_V1";
  stylesheet.dataset.mmRotationalTextLoader = contract;

  const script = document.createElement("script");
  script.src = "/laws/research/methods-and-models/rotational-text.js?v=METHODS_MODELS_ROTATIONAL_TEXT_INSTRUMENT_V1";
  script.dataset.mmRotationalTextLoader = contract;

  document.head.append(stylesheet, script);
})();
