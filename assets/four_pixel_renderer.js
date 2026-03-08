import {
  validateNibble,
  validateByte,
  decodeNibble,
  decodeByte,
  buildAccessibilityLabel
} from "./four_pixel_codec.js";

function resolvePalette(options = {}) {
  return {
    on: options.on ?? "rgba(255,232,186,0.96)",
    off: options.off ?? "rgba(28,26,42,0.42)",
    line: options.line ?? "rgba(255,245,220,0.22)",
    frame: options.frame ?? "rgba(255,220,170,0.22)",
    text: options.text ?? "rgba(255,239,210,0.96)"
  };
}

function drawBit(ctx, bit, x, y, size, palette) {
  ctx.beginPath();
  ctx.rect(x, y, size, size);
  ctx.fillStyle = bit === "1" ? palette.on : palette.off;
  ctx.fill();
  ctx.lineWidth = Math.max(1, size * 0.08);
  ctx.strokeStyle = palette.line;
  ctx.stroke();
}

export function buildGlyphPayload(byte, context = "absolute_world", options = {}) {
  validateByte(byte);
  return {
    byte,
    context,
    rotation: options.rotation ?? 0,
    size: options.size ?? 24,
    label: buildAccessibilityLabel(byte, options.metadata ?? null)
  };
}

export function drawNibble(ctx, nibble, x, y, size, options = {}) {
  validateNibble(nibble);
  const palette = resolvePalette(options);
  const bits = decodeNibble(nibble);
  const cell = size / 2;
  drawBit(ctx, bits.TL, x, y, cell, palette);
  drawBit(ctx, bits.TR, x + cell, y, cell, palette);
  drawBit(ctx, bits.BL, x, y + cell, cell, palette);
  drawBit(ctx, bits.BR, x + cell, y + cell, cell, palette);
}

export function drawByte(ctx, byte, x, y, size, options = {}) {
  validateByte(byte);
  const palette = resolvePalette(options);
  const { blockA, blockB } = decodeByte(byte);
  const gap = options.gap ?? Math.max(2, size * 0.1);
  const nibbleSize = (size - gap) / 2;
  const totalWidth = nibbleSize * 2 + gap;
  const totalHeight = nibbleSize;

  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(options.rotation ?? 0);
  ctx.translate(-totalWidth / 2, -totalHeight / 2);

  if (options.frame !== false) {
    ctx.beginPath();
    ctx.roundRect(-6, -6, totalWidth + 12, totalHeight + 12, 10);
    ctx.fillStyle = "rgba(10,14,24,0.42)";
    ctx.fill();
    ctx.lineWidth = 1;
    ctx.strokeStyle = palette.frame;
    ctx.stroke();
  }

  drawNibble(ctx, blockA, 0, 0, nibbleSize, options);
  drawNibble(ctx, blockB, nibbleSize + gap, 0, nibbleSize, options);

  ctx.restore();
}

export function projectByteToSector(byte, sector) {
  validateByte(byte);
  const sectorAngles = {
    N: -Math.PI * 0.5,
    NNE: -Math.PI * 0.375,
    NE: -Math.PI * 0.25,
    ENE: -Math.PI * 0.125,
    E: 0,
    ESE: Math.PI * 0.125,
    SE: Math.PI * 0.25,
    SSE: Math.PI * 0.375,
    S: Math.PI * 0.5,
    SSW: Math.PI * 0.625,
    SW: Math.PI * 0.75,
    WSW: Math.PI * 0.875,
    W: Math.PI,
    WNW: -Math.PI * 0.875,
    NW: -Math.PI * 0.75,
    NNW: -Math.PI * 0.625
  };
  return {
    byte,
    sector,
    rotation: sectorAngles[sector] ?? 0
  };
}

export function drawGlyphLabel(ctx, label, x, y, options = {}) {
  const palette = resolvePalette(options);
  ctx.save();
  ctx.fillStyle = palette.text;
  ctx.font = options.font ?? '600 12px system-ui, sans-serif';
  ctx.textAlign = options.textAlign ?? "center";
  ctx.textBaseline = options.textBaseline ?? "middle";
  ctx.fillText(label, x, y);
  ctx.restore();
}
