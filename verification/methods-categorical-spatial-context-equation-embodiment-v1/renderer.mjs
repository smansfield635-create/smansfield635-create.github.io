const UNIT = 18;
const TRANSITION_MS = 720;

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>'"]/g, character => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "'": "&#39;",
    '"': "&quot;"
  })[character]);
}

function sceneTransform(camera) {
  const [targetX, targetY, targetZ] = camera.target;
  const x = -targetX * UNIT * camera.scale;
  const y = targetY * UNIT * camera.scale;
  const z = -targetZ * UNIT - camera.depth;
  return `translate3d(${x}px, ${y}px, ${z}px) rotateX(${camera.rotateX}deg) rotateY(${camera.rotateY}deg) scale(${camera.scale})`;
}

function nodeTransform(position) {
  return `translate3d(${position[0] * UNIT}px, ${-position[1] * UNIT}px, ${position[2] * UNIT}px) translate(-50%, -50%)`;
}

function transitionId() {
  return `mm-semantic-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function instrumentMarkup(formClass) {
  switch (formClass) {
    case "ENVELOPE":
      return `<div class="equation-instrument equation-instrument--envelope" aria-hidden="true"><i></i><i></i><i></i><i></i><b></b></div>`;
    case "GATE_OR_MINIMUM":
      return `<div class="equation-instrument equation-instrument--gate" aria-hidden="true"><i></i><i></i><i></i><b></b></div>`;
    case "MULTIPLICATIVE":
      return `<div class="equation-instrument equation-instrument--multiplicative" aria-hidden="true"><i></i><i></i><i></i><i></i><b></b></div>`;
    case "RATIO":
      return `<div class="equation-instrument equation-instrument--ratio" aria-hidden="true"><i></i><b></b><i></i></div>`;
    case "COMPLEMENT":
      return `<div class="equation-instrument equation-instrument--complement" aria-hidden="true"><i></i><i></i><b></b></div>`;
    case "LEDGER":
      return `<div class="equation-instrument equation-instrument--ledger" aria-hidden="true"><i></i><i></i><i></i><i></i><b></b></div>`;
    case "THRESHOLD":
      return `<div class="equation-instrument equation-instrument--threshold" aria-hidden="true"><i></i><b></b><i></i></div>`;
    case "SEQUENCE":
      return `<div class="equation-instrument equation-instrument--sequence" aria-hidden="true"><i></i><i></i><i></i><i></i><b></b></div>`;
    case "CYCLE":
      return `<div class="equation-instrument equation-instrument--cycle" aria-hidden="true"><i></i><i></i><i></i><i></i><b></b></div>`;
    case "DIAGNOSTIC_PATH":
      return `<div class="equation-instrument equation-instrument--diagnostic" aria-hidden="true"><i></i><i></i><i></i><i></i><b></b></div>`;
    case "FALSIFICATION_PATH":
      return `<div class="equation-instrument equation-instrument--falsification" aria-hidden="true"><i></i><i></i><i></i><b></b><em></em></div>`;
    case "BOUNDARY_OR_NO_MATCH":
      return `<div class="equation-instrument equation-instrument--boundary" aria-hidden="true"><i></i><b></b><em></em></div>`;
    default:
      throw new Error(`UNDECLARED_FORM_MAPPING:${formClass}`);
  }
}

function symbolsSignature(symbols) {
  if (!Array.isArray(symbols)) return "";
  return symbols.slice(0, 3).map(symbol => String(symbol).split("—")[0].trim()).join(" · ");
}

export class MethodsSemanticSpatialRenderer extends EventTarget {
  constructor({ stage, registry, catalog }) {
    super();
    this.stage = stage;
    this.registry = registry;
    this.catalog = catalog;
    this.models = new Map(registry.descriptors.map(descriptor => [descriptor.MODEL_ID, descriptor]));
    this.families = new Map(catalog.map(family => [family.id, family]));
    this.sceneRoot = stage.querySelector("[data-spatial-scene-root]");
    this.field = stage.querySelector("[data-spatial-field]");
    this.status = document.querySelector("[data-spatial-status]");
    this.coordinate = document.querySelector("[data-spatial-coordinate]");
    this.corpusSummary = document.querySelector("[data-corpus-summary]");
    this.receipts = [];
    this.current = null;
    this.reducedMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
    this.buildField();
    globalThis.__METHODS_SPATIAL_RECEIPTS = this.receipts;
  }

  buildField() {
    const fragment = document.createDocumentFragment();

    this.registry.families.forEach(familyDescriptor => {
      const family = this.families.get(familyDescriptor.familyId);
      const plane = document.createElement("section");
      plane.className = "spatial-family-plane";
      plane.dataset.familyId = familyDescriptor.familyId;
      plane.style.setProperty("--family-z", `${familyDescriptor.planePosition[2] * UNIT}px`);
      plane.style.transform = `translate3d(0, 0, ${familyDescriptor.planePosition[2] * UNIT}px) translate(-50%, -50%)`;
      plane.innerHTML = `
        <header class="spatial-family-plane__header">
          <span>${String(familyDescriptor.familyIndex + 1).padStart(2, "0")}</span>
          <div><strong>${escapeHtml(family?.title || familyDescriptor.label)}</strong><p>${escapeHtml(family?.question || "")}</p></div>
        </header>
        <div class="spatial-family-plane__map" aria-label="${escapeHtml(family?.title || familyDescriptor.label)} model destinations">
          ${family.models.map(model => {
            const descriptor = this.models.get(model.id);
            return `<div class="spatial-family-destination" data-destination-model="${escapeHtml(model.id)}" data-source-state="${escapeHtml(model.sourceState)}" data-form-class="${escapeHtml(descriptor.EQUATION_FORM_CLASS)}"><span>${escapeHtml(model.title)}</span><small>${model.equation}</small></div>`;
          }).join("")}
        </div>`;

      const rails = document.createElement("div");
      rails.className = "spatial-lens-rails";
      this.registry.lenses.forEach(lens => {
        const rail = document.createElement("div");
        rail.className = "spatial-lens-rail";
        rail.dataset.lensId = lens.id;
        rail.style.transform = `translate3d(-50%, ${-lens.relation[1] * UNIT}px, 6px)`;
        rail.innerHTML = `<span>${escapeHtml(lens.id)}</span>`;
        rails.append(rail);
      });
      plane.append(rails);
      fragment.append(plane);
    });

    this.registry.descriptors.forEach(descriptor => {
      const node = document.createElement("article");
      node.className = "spatial-model-node";
      node.dataset.modelId = descriptor.MODEL_ID;
      node.dataset.familyId = descriptor.FAMILY_ID;
      node.dataset.sourceState = descriptor.SOURCE_STATE;
      node.dataset.formClass = descriptor.EQUATION_FORM_CLASS;
      node.tabIndex = -1;
      node.style.transform = nodeTransform(descriptor.fieldPosition);
      node.innerHTML = `
        <div class="spatial-model-node__boundary" aria-hidden="true"></div>
        ${instrumentMarkup(descriptor.EQUATION_FORM_CLASS)}
        <div class="spatial-model-node__body">
          <div class="spatial-model-node__topline">
            <span class="spatial-model-node__family">${escapeHtml(this.families.get(descriptor.FAMILY_ID)?.label || descriptor.FAMILY_ID)}</span>
            <span class="spatial-model-node__source">${descriptor.SOURCE_STATE === "hold" ? "Source hold" : "Source confirmed"}</span>
          </div>
          <h2>${escapeHtml(descriptor.TITLE)}</h2>
          <p class="spatial-model-node__question">${escapeHtml(descriptor.QUESTION)}</p>
          <div class="spatial-model-node__equation-label">${escapeHtml(descriptor.EQUATION_LABEL)}</div>
          <div class="spatial-model-node__equation">${descriptor.EQUATION}</div>
          <p class="spatial-model-node__statement">${escapeHtml(descriptor.STATEMENT)}</p>
          <p class="spatial-model-node__lens" data-spatial-model-text>${escapeHtml(descriptor.PRACTICAL)}</p>
          <div class="spatial-model-node__signature"><span>${escapeHtml(descriptor.EQUATION_FORM_CLASS)}</span><span>${escapeHtml(symbolsSignature(descriptor.SYMBOLS))}</span></div>
          <span class="spatial-model-node__coordinate">X ${String(descriptor.modelIndex + 1).padStart(2, "0")} · Z ${String(descriptor.familyIndex + 1).padStart(2, "0")}</span>
        </div>`;
      fragment.append(node);
    });

    this.registry.families.forEach(family => {
      for (let index = 0; index < family.modelIds.length - 1; index += 1) {
        const left = this.registry.descriptors.find(item => item.MODEL_ID === family.modelIds[index]);
        const right = this.registry.descriptors.find(item => item.MODEL_ID === family.modelIds[index + 1]);
        const relation = document.createElement("div");
        relation.className = "spatial-relationship";
        relation.dataset.from = left.MODEL_ID;
        relation.dataset.to = right.MODEL_ID;
        relation.dataset.fromClass = left.EQUATION_FORM_CLASS;
        relation.dataset.toClass = right.EQUATION_FORM_CLASS;
        const midpoint = [(left.fieldPosition[0] + right.fieldPosition[0]) / 2, 0, left.fieldPosition[2]];
        relation.style.width = `${Math.abs(right.fieldPosition[0] - left.fieldPosition[0]) * UNIT}px`;
        relation.style.transform = nodeTransform(midpoint);
        fragment.append(relation);
      }
    });

    this.field.replaceChildren(fragment);
    if (this.corpusSummary) {
      const confirmed = this.registry.descriptors.filter(item => item.SOURCE_STATE === "confirmed").length;
      const held = this.registry.descriptors.filter(item => item.SOURCE_STATE === "hold").length;
      this.corpusSummary.textContent = `${this.registry.familyCount} families · ${this.registry.modelCount} canonical models · ${confirmed} source confirmed · ${held} source hold`;
    }
  }

  async update(resolved, options = {}) {
    const reason = options.reason || "state-change";
    const animate = options.animate !== false && !this.reducedMotion;
    const previous = this.current;
    const id = transitionId();
    const requestedAt = new Date().toISOString();
    this.stage.dataset.transitioning = String(animate);
    this.stage.dataset.cameraMode = resolved.cameraMode;
    this.stage.dataset.viewportClass = resolved.viewportClass;
    this.stage.dataset.activeFamily = resolved.native.familyId;
    this.stage.dataset.activeModel = resolved.native.modelId;
    this.stage.dataset.activeLens = resolved.native.lensId;
    this.sceneRoot.style.transitionDuration = animate ? `${TRANSITION_MS}ms` : "0ms";
    this.sceneRoot.style.transform = sceneTransform(resolved.camera);

    const nodeById = new Map(resolved.nodes.map(node => [node.modelId, node]));
    this.field.querySelectorAll(".spatial-model-node").forEach(element => {
      const node = nodeById.get(element.dataset.modelId);
      const descriptor = this.models.get(element.dataset.modelId);
      const overviewPresent = resolved.cameraMode === "overview";
      const present = overviewPresent || Boolean(node?.visible);
      element.hidden = !present;
      element.dataset.lifecycle = overviewPresent && !node?.visible ? "OVERVIEW_CORPUS" : (node?.lifecycle || "DISTANT_CORPUS");
      element.dataset.detailClass = overviewPresent && !node?.visible ? "SIGNATURE" : (node?.detailClass || "SILHOUETTE");
      element.dataset.active = String(Boolean(node?.active));
      element.dataset.lens = resolved.native.lensId;
      element.setAttribute("aria-hidden", String(!present));
      element.tabIndex = node?.active ? 0 : -1;
      if (node?.position) element.style.transform = nodeTransform(node.position);
      const text = element.querySelector("[data-spatial-model-text]");
      if (text) text.textContent = node?.active ? (descriptor?.[resolved.native.lensId.toUpperCase()] || descriptor?.STATEMENT || "") : (descriptor?.STATEMENT || "");
    });

    this.field.querySelectorAll(".spatial-family-plane").forEach(plane => {
      plane.dataset.active = String(plane.dataset.familyId === resolved.native.familyId);
      plane.dataset.overview = String(resolved.cameraMode === "overview");
      plane.querySelectorAll(".spatial-lens-rail").forEach(rail => {
        rail.dataset.active = String(rail.dataset.lensId === resolved.native.lensId && plane.dataset.familyId === resolved.native.familyId);
      });
    });

    this.field.querySelectorAll(".spatial-relationship").forEach(relation => {
      const from = nodeById.get(relation.dataset.from);
      const to = nodeById.get(relation.dataset.to);
      relation.hidden = resolved.cameraMode !== "overview" && !(from?.visible && to?.visible);
      relation.dataset.active = String(Boolean(from?.active || to?.active));
    });

    const activeModel = this.models.get(resolved.native.modelId);
    if (this.status) this.status.textContent = `${resolved.cameraMode.toUpperCase()} · ${resolved.activeFamily.label} · ${activeModel?.TITLE || resolved.native.modelId} · ${activeModel?.EQUATION_FORM_CLASS || ""}`;
    if (this.coordinate) this.coordinate.textContent = `X ${String(resolved.native.modelIndex + 1).padStart(2, "0")} · Y ${resolved.native.lensId.toUpperCase()} · Z ${String(resolved.native.familyIndex + 1).padStart(2, "0")}`;

    if (animate) await new Promise(resolve => setTimeout(resolve, TRANSITION_MS + 40));
    this.stage.dataset.transitioning = "false";
    this.current = resolved;

    const receipt = Object.freeze({
      contract: "METHODS_MODELS_RENDERER_TRANSITION_RECEIPT_v1",
      semanticContract: "METHODS_CATEGORICAL_SPATIAL_CONTEXT_AND_EQUATION_EMBODIMENT_PASS_v1",
      transitionId: id,
      reason,
      requestedAt,
      stableAt: new Date().toISOString(),
      requestedNativeState: Object.freeze({ ...resolved.native }),
      reachedNativeState: Object.freeze({ ...resolved.native }),
      previousCamera: previous ? Object.freeze({ ...previous.camera, target: Object.freeze([...previous.camera.target]) }) : null,
      reachedCamera: Object.freeze({ ...resolved.camera, target: Object.freeze([...resolved.camera.target]) }),
      centeredRenderTarget: resolved.activeDescriptor.modelId,
      visibleCluster: Object.freeze([...resolved.visibleCluster]),
      viewportClass: resolved.viewportClass,
      cameraMode: resolved.cameraMode,
      activeFormClass: activeModel?.EQUATION_FORM_CLASS || null,
      activeSourceState: activeModel?.SOURCE_STATE || null,
      productAcceptanceGranted: false
    });
    this.receipts.push(receipt);
    this.dispatchEvent(new CustomEvent("transitionreceipt", { detail: receipt }));
    globalThis.dispatchEvent(new CustomEvent("METHODS_MODELS_RENDERER_TRANSITION_RECEIPT", { detail: receipt }));
    return receipt;
  }

  activeNode() {
    return this.field.querySelector(`.spatial-model-node[data-model-id="${CSS.escape(this.current?.native?.modelId || "")}"]`);
  }
}
