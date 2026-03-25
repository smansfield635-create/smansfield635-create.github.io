// /assets/instruments.js
// MODE: CONTRACT EXECUTION
// CONTRACT: INSTRUMENT_BASELINE_CONTRACT_G1
// STATUS: OBSERVATION ONLY | NON-DRIFT

const INSTRUMENT_META = Object.freeze({
  name: "instruments",
  version: "G1",
  role: "observation_only",
  deterministic: true,
  sourceOfTruth: false,
  mutatesState: false
});

const deepFreeze = (v) => {
  if (!v || typeof v !== "object" || Object.isFrozen(v)) return v;
  Object.getOwnPropertyNames(v).forEach(k => deepFreeze(v[k]));
  return Object.freeze(v);
};

const normalizeObject = (v) =>
  v && typeof v === "object" && !Array.isArray(v) ? v : {};

const normalizePrimitive = (v) => {
  if (v === null || v === undefined) return "—";
  if (typeof v === "number") return Number.isFinite(v) ? String(v) : "—";
  if (typeof v === "boolean") return v ? "true" : "false";
  if (typeof v === "string" && v.trim().length > 0) return v;
  return "—";
};

const classifyState = (runtime, render) => {
  if (!render.validatorOk) return "INVALID";
  if (runtime.traversalStatus.action === "HALT") return "HALTED";
  if (runtime.boundary.classification === "BLOCK") return "BLOCKED";
  return "LIVE";
};

export function buildInstrumentReceipt({
  runtimeState = null,
  renderState = null
} = {}) {

  const runtime = normalizeObject(runtimeState);
  const render = normalizeObject(renderState);

  const validatorOk = render?.visible?.validatorStatus?.ok === true;

  const packet = deepFreeze({
    classifiedState: classifyState(runtime, { validatorOk }),

    displayPayload: deepFreeze({
      summary: deepFreeze({
        state: [
          `STATE=${classifyState(runtime, { validatorOk })}`,
          `NODE=${runtime?.node?.label || "—"}`,
          `REGION=${runtime?.region?.label || "—"}`,
          `BOUNDARY=${runtime?.boundary?.classification || "—"}`
        ].join(" | ")
      })
    }),

    diagnosticsPayload: deepFreeze({
      validatorOk,
      traversal: normalizePrimitive(runtime?.traversalStatus?.action),
      receipt: normalizePrimitive(runtime?.receipt?.timestamp)
    }),

    meta: deepFreeze({
      runtime: deepFreeze({
        i: runtime?.index?.i ?? null,
        j: runtime?.index?.j ?? null,
        x: runtime?.denseIndex?.x ?? null,
        y: runtime?.denseIndex?.y ?? null,
        region: runtime?.region?.label,
        node: runtime?.node?.label,
        boundary: runtime?.boundary?.classification
      }),
      render: deepFreeze({
        hue: render?.visible?.colorOutput?.hue ?? null,
        value: render?.visible?.colorOutput?.value ?? null,
        motion: render?.visible?.motionOutput?.delta ?? null
      })
    })
  });

  return packet;
}

export function renderPanelHTML(runtime = {}) {
  const instrument = normalizeObject(runtime.instrument || runtime);
  const meta = normalizeObject(instrument.meta);

  return `
    <div>
      <div><b>STATE:</b> ${normalizePrimitive(instrument.classifiedState)}</div>
      <div><b>NODE:</b> ${normalizePrimitive(meta.runtime?.node)}</div>
      <div><b>REGION:</b> ${normalizePrimitive(meta.runtime?.region)}</div>
      <div><b>BOUNDARY:</b> ${normalizePrimitive(meta.runtime?.boundary)}</div>
      <div><b>RECEIPT:</b> ${normalizePrimitive(instrument.diagnosticsPayload?.receipt)}</div>
      <div><b>VALID:</b> ${normalizePrimitive(instrument.diagnosticsPayload?.validatorOk)}</div>
    </div>
  `;
}

export function createInstruments() {
  let last = null;

  return deepFreeze({
    meta: INSTRUMENT_META,

    update(packet) {
      if (packet && typeof packet === "object") {
        last = packet;
      }
      return last;
    },

    read() {
      return last;
    },

    dispose() {
      last = null;
    },

    buildInstrumentReceipt,
    renderPanelHTML
  });
}

const DEFAULT = createInstruments();

export default DEFAULT;
