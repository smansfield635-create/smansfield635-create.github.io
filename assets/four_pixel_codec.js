export const FOUR_PIXEL_ENCODING_FAMILY_VERSION = "FOUR_PIXEL_STATE_ENCODING_MASTER_AUTHORITY_v1";

export const SLOT_ORDER = Object.freeze(["TL", "TR", "BL", "BR"]);
export const AXIS_ORDER = Object.freeze(["I", "P", "G", "S", "R", "L", "Y", "F"]);
export const BLOCK_A_AXES = Object.freeze(["I", "P", "G", "S"]);
export const BLOCK_B_AXES = Object.freeze(["R", "L", "Y", "F"]);

function assertBinary(value, length, label) {
  if (typeof value !== "string" || !new RegExp(`^[01]{${length}}$`).test(value)) {
    throw new Error(`${label} must be a binary string of length ${length}`);
  }
}

function assertAxisObject(vector) {
  for (const axis of AXIS_ORDER) {
    if (!(axis in vector)) throw new Error(`Missing axis ${axis}`);
    const value = String(vector[axis]);
    if (value !== "0" && value !== "1") throw new Error(`Axis ${axis} must be 0 or 1`);
  }
}

export function validateNibble(binary4) {
  assertBinary(binary4, 4, "Nibble");
  return true;
}

export function validateByte(binary8) {
  assertBinary(binary8, 8, "Byte");
  return true;
}

export function encodeNibble(bits4) {
  validateNibble(bits4);
  return bits4;
}

export function decodeNibble(binary4) {
  validateNibble(binary4);
  return Object.freeze({
    TL: binary4[0],
    TR: binary4[1],
    BL: binary4[2],
    BR: binary4[3]
  });
}

export function nibbleToHex(binary4) {
  validateNibble(binary4);
  return parseInt(binary4, 2).toString(16).toUpperCase();
}

export function hexToNibble(hex4) {
  if (typeof hex4 !== "string" || !/^[0-9A-Fa-f]{1}$/.test(hex4)) {
    throw new Error("Hex nibble must be a single hex character");
  }
  return parseInt(hex4, 16).toString(2).padStart(4, "0");
}

export function encodeByte(blockA, blockB) {
  validateNibble(blockA);
  validateNibble(blockB);
  return `${blockA}${blockB}`;
}

export function decodeByte(binary8) {
  validateByte(binary8);
  const blockA = binary8.slice(0, 4);
  const blockB = binary8.slice(4, 8);
  return Object.freeze({
    byte: binary8,
    blockA,
    blockB,
    A: decodeNibble(blockA),
    B: decodeNibble(blockB)
  });
}

export function byteToHex(binary8) {
  validateByte(binary8);
  return parseInt(binary8, 2).toString(16).toUpperCase().padStart(2, "0");
}

export function hexToByte(hex8) {
  if (typeof hex8 !== "string" || !/^[0-9A-Fa-f]{2}$/.test(hex8)) {
    throw new Error("Hex byte must be two hex characters");
  }
  return parseInt(hex8, 16).toString(2).padStart(8, "0");
}

export function byteToStateVector(binary8) {
  validateByte(binary8);
  return Object.freeze({
    I: binary8[0],
    P: binary8[1],
    G: binary8[2],
    S: binary8[3],
    R: binary8[4],
    L: binary8[5],
    Y: binary8[6],
    F: binary8[7]
  });
}

export function stateVectorToByte(vector) {
  assertAxisObject(vector);
  return `${vector.I}${vector.P}${vector.G}${vector.S}${vector.R}${vector.L}${vector.Y}${vector.F}`;
}

export function roundTripNibble(binary4) {
  validateNibble(binary4);
  const hex = nibbleToHex(binary4);
  const back = hexToNibble(hex);
  if (back !== binary4) throw new Error("Nibble roundtrip failure");
  return true;
}

export function roundTripByte(binary8) {
  validateByte(binary8);
  const hex = byteToHex(binary8);
  const back = hexToByte(hex);
  if (back !== binary8) throw new Error("Byte roundtrip failure");
  return true;
}

export function buildAccessibilityLabel(binary8, metadata = null) {
  validateByte(binary8);
  const vector = byteToStateVector(binary8);
  const parts = AXIS_ORDER.map((axis) => `${axis}:${vector[axis]}`);
  if (metadata?.label) parts.unshift(metadata.label);
  return parts.join(" ");
}

export function decodeNamedEncoding(encodingRow) {
  if (!encodingRow || typeof encodingRow !== "object") {
    throw new Error("Encoding row is required");
  }
  if (encodingRow.byte) validateByte(encodingRow.byte);
  return Object.freeze({
    ...encodingRow,
    hex: byteToHex(encodingRow.byte),
    vector: byteToStateVector(encodingRow.byte)
  });
}
