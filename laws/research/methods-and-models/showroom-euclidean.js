(() => {
  "use strict";

  const contract = "METHODS_MODELS_ROTATIONAL_TEXT_INSTRUMENT_v1";
  document.documentElement.dataset.methodsModelsEuclideanShowroom = "active";

  const stylesheet = document.createElement("link");
  stylesheet.rel = "stylesheet";
  stylesheet.href = "/laws/research/methods-and-models/rotational-text.css?v=METHODS_MODELS_ROTATIONAL_TEXT_INSTRUMENT_V1";
  stylesheet.dataset.mmRotationalTextLoader = contract;
  stylesheet.addEventListener("load", () => dispatchEvent(new Event("resize")));

  const interaction = document.createElement("style");
  interaction.dataset.mmRotationalTextInteraction = contract;
  interaction.textContent = 'html[data-methods-models-euclidean-showroom="active"] .mm-family-tabs[data-mm-rotational-text-orbit] .mm-family-tab{pointer-events:auto!important}';

  const script = document.createElement("script");
  script.src = "/laws/research/methods-and-models/rotational-text.js?v=METHODS_MODELS_ROTATIONAL_TEXT_INSTRUMENT_V1";
  script.dataset.mmRotationalTextLoader = contract;
  script.addEventListener("load", () => dispatchEvent(new Event("resize")));

  document.head.append(stylesheet, interaction, script);
})();
