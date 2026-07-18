import { pathToFileURL } from 'node:url';
import path from 'node:path';

const root = process.cwd();
const url = (p) => pathToFileURL(path.join(root, p)).href;

const governed = [
  'showroom/globe/h-earth/render/geometry-preview.js',
  'h-earth-3d/integration/h-earth.source-object-geometry-resolution.js',
  'showroom/globe/h-earth/environment.js',
  'showroom/globe/h-earth/render/geometry-ground.js',
  'h-earth-3d/objects/ground-cell-001.objects.js',
  'h-earth-3d/zones/ground-cell-001.zones.js',
  'h-earth-3d/zones/ground-cell-001.landscape-lattice.js',
  'showroom/globe/h-earth/capacity.js',
  'showroom/globe/h-earth/render/geometry-kernel.js',
  'h-earth-3d/cells/ground-cell-001.js',
  'h-earth-3d/h-earth.matrix.js',
  'showroom/globe/h-earth/render/geometry-kernel.north.js',
  'showroom/globe/h-earth/render/geometry-kernel.east.js',
  'showroom/globe/h-earth/render/geometry-kernel.south.js',
  'showroom/globe/h-earth/render/geometry-kernel.west.js',
  'h-earth-3d/integration/h-earth.post-west-admitted-geometry-transfer.js',
  'showroom/globe/h-earth/admitted-geometry-frame.js',
  'showroom/globe/h-earth/compositor.js',
  'showroom/globe/h-earth/renderer.js'
];

const importResults = [];
for (const p of governed) {
  try {
    await import(url(p));
    importResults.push({ path: p, fulfilled: true });
  } catch (error) {
    importResults.push({
      path: p,
      fulfilled: false,
      errorName: error?.name,
      errorMessage: error?.message
    });
  }
}
if (importResults.some((entry) => !entry.fulfilled)) {
  console.error(JSON.stringify({ importResults }, null, 2));
  throw new Error('One or more governed roots failed to import.');
}

class MockClassList {
  constructor() { this.values = new Set(); }
  add(...names) { for (const name of names) this.values.add(String(name)); }
  remove(...names) { for (const name of names) this.values.delete(String(name)); }
  contains(name) { return this.values.has(String(name)); }
}

function dataNameToKey(name) {
  return name
    .slice(5)
    .split('-')
    .map((part, index) => index === 0 ? part : part.charAt(0).toUpperCase() + part.slice(1))
    .join('');
}

function selectorMatches(node, selector) {
  const dataParts = [...selector.matchAll(/\[data-([a-z0-9-]+)(?:="([^"]*)")?\]/g)];
  if (dataParts.length > 0) {
    return dataParts.every((match) => {
      const key = dataNameToKey(`data-${match[1]}`);
      if (!(key in node.dataset)) return false;
      return match[2] === undefined || String(node.dataset[key]) === match[2];
    });
  }
  return false;
}

class MockNode {
  constructor(tagName = 'DIV', ownerDocument = null, fragment = false) {
    this.tagName = tagName;
    this.ownerDocument = ownerDocument;
    this.isFragment = fragment;
    this.children = [];
    this.parentNode = null;
    this.style = {};
    this.dataset = {};
    this.attributes = {};
    this.classList = new MockClassList();
    this.className = '';
    this.textContent = '';
    this.id = '';
    this.type = '';
    this.tabIndex = 0;
    this.clientWidth = 0;
    this.clientHeight = 0;
    this.listeners = new Map();
  }
  appendChild(node) {
    if (node?.isFragment) {
      for (const child of [...node.children]) this.appendChild(child);
      node.children = [];
      return node;
    }
    if (!node) throw new TypeError('node required');
    if (node.parentNode) node.parentNode.removeChild(node);
    this.children.push(node);
    node.parentNode = this;
    return node;
  }
  append(...nodes) { for (const node of nodes) this.appendChild(node); }
  replaceChildren(...nodes) {
    for (const child of this.children) child.parentNode = null;
    this.children = [];
    for (const node of nodes) this.appendChild(node);
  }
  removeChild(node) {
    const index = this.children.indexOf(node);
    if (index < 0) throw new Error('NotFoundError');
    this.children.splice(index, 1);
    node.parentNode = null;
    return node;
  }
  remove() { if (this.parentNode) this.parentNode.removeChild(this); }
  setAttribute(name, value) {
    this.attributes[name] = String(value);
    if (name.startsWith('data-')) this.dataset[dataNameToKey(name)] = String(value);
  }
  getAttribute(name) {
    if (name.startsWith('data-')) {
      const key = dataNameToKey(name);
      return key in this.dataset ? String(this.dataset[key]) : null;
    }
    return this.attributes[name] ?? null;
  }
  addEventListener(type, callback) { this.listeners.set(type, callback); }
  querySelectorAll(selector) {
    const output = [];
    const visit = (node) => {
      for (const child of node.children) {
        if (selectorMatches(child, selector)) output.push(child);
        visit(child);
      }
    };
    visit(this);
    return output;
  }
  querySelector(selector) { return this.querySelectorAll(selector)[0] ?? null; }
  getBoundingClientRect() {
    return {
      width: this.clientWidth,
      height: this.clientHeight,
      x: 0,
      y: 0,
      top: 0,
      left: 0,
      right: this.clientWidth,
      bottom: this.clientHeight
    };
  }
  get childElementCount() { return this.children.length; }
  get firstElementChild() { return this.children[0] ?? null; }
}

class MockDocument {
  constructor() {
    this.ids = new Map();
    this.body = new MockNode('BODY', this);
  }
  createElement(tag) { return new MockNode(String(tag).toUpperCase(), this); }
  createDocumentFragment() { return new MockNode(null, this, true); }
  createTextNode(value) {
    const node = new MockNode('#TEXT', this);
    node.textContent = String(value);
    return node;
  }
  register(id, node = this.createElement('div')) {
    node.id = id;
    node.ownerDocument = this;
    this.ids.set(id, node);
    this.body.appendChild(node);
    return node;
  }
  getElementById(id) { return this.ids.get(id) ?? null; }
  querySelectorAll(selector) { return this.body.querySelectorAll(selector); }
}

const initialDocument = new MockDocument();
globalThis.document = initialDocument;
globalThis.devicePixelRatio = 1;

const indexModule = await import(url('showroom/globe/h-earth/index.js'));
const previewModule = await import(url('showroom/globe/h-earth/render/geometry-preview.js'));
const kernelModule = await import(url('showroom/globe/h-earth/render/geometry-kernel.js'));
const transferModule = await import(url('h-earth-3d/integration/h-earth.post-west-admitted-geometry-transfer.js'));
const admittedModule = await import(url('showroom/globe/h-earth/admitted-geometry-frame.js'));

function buildPacket(suffix) {
  const preview = previewModule.previewHEarthWetSandGeometry({
    sourceObjectId: 'OBJ_002_FOREGROUND_WET_SAND',
    requestedPurpose: 'WET_SAND_GEOMETRY_PREVIEW',
    requestId: `INDEX_VIEWPORT_${suffix}`
  });
  const west = kernelModule.admitHEarthPrimitiveBatch(
    preview.primitives,
    {
      frameId: `INDEX_VIEWPORT_FRAME_${suffix}`,
      metadata: Object.freeze({
        requestId: preview.requestId,
        providerRequestId: preview.providerRequestId,
        resolutionReceiptId: preview.resolutionReceiptId,
        sourceObjectIds: Object.freeze([preview.sourceObjectId]),
        sourceZoneIds: preview.sourceZoneIds,
        latticeRegionIds: preview.latticeRegionIds
      })
    }
  );
  const packet002 = transferModule.buildHEarthPostWestAdmittedGeometryTransfer({
    previewResult: preview,
    westBatchAdmissionResult: west
  });
  if (!preview.ok || !west.valid || !packet002.ok) {
    throw new Error(`Upstream corridor failed for ${suffix}.`);
  }
  return packet002;
}

function makeDocument(width, height) {
  const document = new MockDocument();
  for (const id of Object.values(indexModule.H_EARTH_3D_PUBLIC_MOUNT_IDS)) {
    document.register(id);
  }
  const mount = document.getElementById(
    indexModule.H_EARTH_3D_PUBLIC_MOUNT_IDS.rendererMount
  );
  mount.clientWidth = width;
  mount.clientHeight = height;
  return { document, mount };
}

async function runSuccess(label, width, height, pixelRatio) {
  const { document, mount } = makeDocument(width, height);
  globalThis.document = document;
  globalThis.devicePixelRatio = pixelRatio;
  const packet002 = buildPacket(label);
  const immediate = indexModule.initializeHEarthRoute({
    document,
    packet002Transfer: packet002,
    packet002TransferOccurrenceId: `P2_${label}`,
    compositorFrameOccurrenceId: `CFO_${label}`,
    presentationMode: admittedModule.H_EARTH_3D_FIRST_ADMITTED_WET_SAND_PROOF_MODE,
    skipLayer4DescriptorImport: true
  });
  const completion = await indexModule.getRouteBootstrapCompletion();
  const bootstrap = completion.rendererBootstrapReceipt;
  const getter = indexModule.getRendererBootstrapReceipt();
  const status = indexModule.getRouteBootstrapStatus();
  const result = {
    label,
    immediateStatus: immediate.status,
    completionStatus: completion.status,
    rendererStatus: bootstrap?.status,
    mounted: bootstrap?.mounted,
    viewportResolution: bootstrap?.compositorViewportResolution,
    viewportReceipt: bootstrap?.compositorViewportReceipt,
    getterViewportReceipt: getter?.compositorViewportReceipt,
    sourcePreviewStatus: status?.sourcePreviewStatus,
    mountChildren: mount.childElementCount,
    previewExists: Boolean(mount.querySelector('[data-h-earth-source-preview-owned="true"]'))
  };
  if (bootstrap?.mounted !== true) throw new Error(`${label}: renderer did not mount`);
  if (bootstrap?.status !== 'RENDERER_MOUNTED') throw new Error(`${label}: renderer status invalid`);
  if (bootstrap?.compositorViewportResolution?.eligible !== true) throw new Error(`${label}: viewport resolution not eligible`);
  if (bootstrap?.compositorViewportReceipt?.accepted !== true) throw new Error(`${label}: viewport receipt not accepted`);
  if (bootstrap?.compositorViewportReceipt?.viewport?.capacityStatus !== 'WITHIN_CAPACITY') throw new Error(`${label}: viewport not within capacity`);
  if (status?.sourcePreviewStatus !== 'SOURCE_PREVIEW_TAKEN_OVER_BY_RENDERER') throw new Error(`${label}: preview not taken over`);
  if (result.previewExists) throw new Error(`${label}: preview remained after mount`);
  indexModule.destroyHEarthRoute();
  return result;
}

async function runFailure() {
  const { document, mount } = makeDocument(0, 337);
  globalThis.document = document;
  globalThis.devicePixelRatio = 2.75;
  const packet002 = buildPacket('INVALID_WIDTH');
  indexModule.initializeHEarthRoute({
    document,
    packet002Transfer: packet002,
    packet002TransferOccurrenceId: 'P2_INVALID_WIDTH',
    compositorFrameOccurrenceId: 'CFO_INVALID_WIDTH',
    presentationMode: admittedModule.H_EARTH_3D_FIRST_ADMITTED_WET_SAND_PROOF_MODE,
    skipLayer4DescriptorImport: true
  });
  const completion = await indexModule.getRouteBootstrapCompletion();
  const bootstrap = completion.rendererBootstrapReceipt;
  const status = indexModule.getRouteBootstrapStatus();
  const result = {
    completionStatus: completion.status,
    rendererStatus: bootstrap?.status,
    mounted: bootstrap?.mounted,
    failureVariant: bootstrap?.failureVariant,
    viewportResolution: bootstrap?.compositorViewportResolution,
    viewportReceipt: bootstrap?.compositorViewportReceipt,
    sourcePreviewStatus: status?.sourcePreviewStatus,
    previewExists: Boolean(mount.querySelector('[data-h-earth-source-preview-owned="true"]'))
  };
  if (bootstrap?.mounted !== false) throw new Error('failure path unexpectedly mounted');
  if (bootstrap?.status !== 'COMPOSITOR_VIEWPORT_INITIALIZATION_REJECTED') throw new Error('failure path status invalid');
  if (bootstrap?.failureVariant !== 'COMPOSITOR_VIEWPORT_MEASUREMENT_REJECTED') throw new Error('failure path variant invalid');
  if (result.previewExists !== true) throw new Error('failure path did not retain preview');
  indexModule.destroyHEarthRoute();
  return result;
}

const desktop = await runSuccess('DESKTOP', 640, 480, 1);
const mobile = await runSuccess('MOBILE', 332, 337, 2.75);
const failure = await runFailure();

console.log(JSON.stringify({
  governedImports: {
    total: importResults.length,
    fulfilled: importResults.filter((entry) => entry.fulfilled).length,
    rejected: importResults.filter((entry) => !entry.fulfilled).length
  },
  desktop,
  mobile,
  failure
}, null, 2));
