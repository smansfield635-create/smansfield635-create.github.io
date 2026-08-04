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

function modelMap(catalog) {
  return new Map(catalog.flatMap(family => family.models.map(model => [model.id, Object.freeze({ ...model, familyId: family.id, familyLabel: family.label })])));
}

function familyMap(catalog) {
  return new Map(catalog.map(family => [family.id, family]));
}

function sceneTransform(camera) {
  const [targetX, targetY, targetZ] = camera.target;
  const x = -targetX * UNIT;
  const y = targetY * UNIT;
  const z = -targetZ * UNIT - camera.depth;
  return `translate3d(${x}px, ${y}px, ${z}px) rotateX(${camera.rotateX}deg) rotateY(${camera.rotateY}deg) scale(${camera.scale})`;
}

function nodeTransform(position) {
  return `translate3d(${position[0] * UNIT}px, ${-position[1] * UNIT}px, ${position[2] * UNIT}px) translate(-50%, -50%)`;
}

function transitionId() {
  return `mm-spatial-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export class MethodsSpatialRenderer extends EventTarget {
  constructor({ stage, registry, catalog }) {
    super();
    this.stage = stage;
    this.registry = registry;
    this.catalog = catalog;
    this.models = modelMap(catalog);
    this.families = familyMap(catalog);
    this.sceneRoot = stage.querySelector("[data-spatial-scene-root]");
    this.field = stage.querySelector("[data-spatial-field]");
    this.status = document.querySelector("[data-spatial-status]");
    this.coordinate = document.querySelector("[data-spatial-coordinate]");
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
      plane.innerHTML = `<header><span>${String(familyDescriptor.familyIndex + 1).padStart(2, "0")}</span><strong>${escapeHtml(family?.label || familyDescriptor.familyId)}</strong></header>`;

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
      const model = this.models.get(descriptor.modelId);
      const node = document.createElement("article");
      node.className = "spatial-model-node";
      node.dataset.modelId = descriptor.modelId;
      node.dataset.familyId = descriptor.familyId;
      node.tabIndex = -1;
      node.style.transform = nodeTransform(descriptor.fieldPosition);
      node.innerHTML = `
        <div class="spatial-model-node__marker" aria-hidden="true"></div>
        <div class="spatial-model-node__body">
          <span class="spatial-model-node__family">${escapeHtml(model?.familyLabel || descriptor.familyId)}</span>
          <h2>${escapeHtml(model?.title || descriptor.modelId)}</h2>
          <div class="spatial-model-node__equation">${model?.equation || ""}</div>
          <p>${escapeHtml(model?.statement || "")}</p>
          <span class="spatial-model-node__coordinate">X ${String(descriptor.modelIndex + 1).padStart(2, "0")} · Z ${String(descriptor.familyIndex + 1).padStart(2, "0")}</span>
        </div>`;
      fragment.append(node);
    });

    this.registry.families.forEach(family => {
      for (let index = 0; index < family.modelIds.length - 1; index += 1) {
        const left = this.registry.descriptors.find(item => item.modelId === family.modelIds[index]);
        const right = this.registry.descriptors.find(item => item.modelId === family.modelIds[index + 1]);
        const relation = document.createElement("div");
        relation.className = "spatial-relationship";
        relation.dataset.from = left.modelId;
        relation.dataset.to = right.modelId;
        const midpoint = [(left.fieldPosition[0] + right.fieldPosition[0]) / 2, 0, left.fieldPosition[2]];
        relation.style.width = `${Math.abs(right.fieldPosition[0] - left.fieldPosition[0]) * UNIT}px`;
        relation.style.transform = nodeTransform(midpoint);
        fragment.append(relation);
      }
    });

    this.field.replaceChildren(fragment);
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
      element.hidden = !node?.visible;
      element.dataset.lifecycle = node?.lifecycle || "DISTANT_CORPUS";
      element.dataset.detailClass = node?.detailClass || "SILHOUETTE";
      element.dataset.active = String(Boolean(node?.active));
      element.setAttribute("aria-hidden", String(!node?.visible));
      element.tabIndex = node?.active ? 0 : -1;
      if (node?.position) element.style.transform = nodeTransform(node.position);
    });

    this.field.querySelectorAll(".spatial-family-plane").forEach(plane => {
      plane.dataset.active = String(plane.dataset.familyId === resolved.native.familyId);
      plane.querySelectorAll(".spatial-lens-rail").forEach(rail => {
        rail.dataset.active = String(rail.dataset.lensId === resolved.native.lensId && plane.dataset.familyId === resolved.native.familyId);
      });
    });

    this.field.querySelectorAll(".spatial-relationship").forEach(relation => {
      const from = nodeById.get(relation.dataset.from);
      const to = nodeById.get(relation.dataset.to);
      relation.hidden = !(from?.visible && to?.visible);
      relation.dataset.active = String(Boolean(from?.active || to?.active));
    });

    const activeModel = this.models.get(resolved.native.modelId);
    if (this.status) this.status.textContent = `${resolved.cameraMode.toUpperCase()} · ${resolved.activeFamily.label} · ${activeModel?.title || resolved.native.modelId}`;
    if (this.coordinate) this.coordinate.textContent = `X ${String(resolved.native.modelIndex + 1).padStart(2, "0")} · Y ${resolved.native.lensId.toUpperCase()} · Z ${String(resolved.native.familyIndex + 1).padStart(2, "0")}`;

    if (animate) await new Promise(resolve => setTimeout(resolve, TRANSITION_MS + 40));
    this.stage.dataset.transitioning = "false";
    this.current = resolved;

    const receipt = Object.freeze({
      contract: "METHODS_MODELS_RENDERER_TRANSITION_RECEIPT_v1",
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
