export function product(values) {
  if (!Array.isArray(values) || values.length === 0) {
    throw new TypeError("product requires a non-empty array");
  }
  return values.reduce((accumulator, value) => {
    if (!Number.isFinite(value)) {
      throw new TypeError("all factors must be finite numbers");
    }
    return accumulator * value;
  }, 1);
}

export function pressureField(G, X) {
  return product([G, X]);
}

export function usableCapacity(P, R, A, C) {
  return product([P, R, A, C]);
}

export function protectedPcr(pressure, capacity, epsilonK) {
  for (const value of [pressure, capacity, epsilonK]) {
    if (!Number.isFinite(value)) {
      throw new TypeError("pressure, capacity, and epsilonK must be finite");
    }
  }
  if (epsilonK <= 0) {
    throw new RangeError("epsilonK must be greater than zero");
  }
  const floorUsed = capacity <= epsilonK;
  const kUsed = Math.max(capacity, epsilonK);
  return Object.freeze({
    pressure,
    capacity,
    epsilonK,
    kUsed,
    floorUsed,
    safeMode: floorUsed,
    pcr: pressure / kUsed
  });
}

export function stableJson(value) {
  if (Array.isArray(value)) {
    return `[${value.map(stableJson).join(",")}]`;
  }
  if (value && typeof value === "object") {
    const keys = Object.keys(value).sort();
    return `{${keys.map((key) => `${JSON.stringify(key)}:${stableJson(value[key])}`).join(",")}}`;
  }
  return JSON.stringify(value);
}

export async function sha256Hex(value) {
  const bytes = new TextEncoder().encode(typeof value === "string" ? value : stableJson(value));
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
}
