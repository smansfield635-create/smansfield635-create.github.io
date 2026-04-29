// /showroom/showroom.render.js
export function renderShowroom({ root, canvas, runtime }) {
  if (!root) {
    throw new Error("renderShowroom requires a root element.");
  }

  if (!canvas) {
    throw new Error("renderShowroom requires a canvas element.");
  }

  if (!runtime || typeof runtime.getState !== "function") {
    throw new Error("renderShowroom requires a runtime with getState().");
  }

  const context = canvas.getContext("2d");

  if (!context) {
    throw new Error("Canvas 2D context is unavailable.");
  }

  let resizeHandle = 0;

  const drawCurrentState = (state) => {
    drawHexField(canvas, context, state);
  };

  const unsubscribe = runtime.subscribe(drawCurrentState);

  function handleResize() {
    window.cancelAnimationFrame(resizeHandle);
    resizeHandle = window.requestAnimationFrame(() => {
      drawHexField(canvas, context, runtime.getState());
    });
  }

  window.addEventListener("resize", handleResize);
  writeRenderReceipts(root, runtime.getState());

  return {
    destroy() {
      unsubscribe();
      window.cancelAnimationFrame(resizeHandle);
      window.removeEventListener("resize", handleResize);
    }
  };
}

function writeRenderReceipts(root, state) {
  root.dataset.renderReceipt = "SHOWROOM_RENDER=ACTIVE";
  root.dataset.renderAuthority = "VISIBLE_OBJECT_CONSTRUCTION";
  root.dataset.runtimeMode = state.mode || "controlled-baseline";
}

function drawHexField(canvas, context, state) {
  const rect = canvas.getBoundingClientRect();
  const dpr = clamp(window.devicePixelRatio || 1, 1, 2);

  const width = Math.max(320, Math.floor(rect.width || canvas.clientWidth || 900));
  const height = Math.max(320, Math.floor(rect.height || canvas.clientHeight || 560));

  canvas.width = Math.floor(width * dpr);
  canvas.height = Math.floor(height * dpr);

  context.setTransform(dpr, 0, 0, dpr, 0, 0);
  context.clearRect(0, 0, width, height);

  const reducedMotion = state.reducedMotion === true;
  const frameOffset = reducedMotion ? 0 : (state.frame % 360) * 0.002;

  drawBackground(context, width, height);
  drawHexGrid(context, width, height, frameOffset);
  drawOrbit(context, width, height, frameOffset);
}

function drawBackground(context, width, height) {
  const gradient = context.createRadialGradient(
    width * 0.5,
    height * 0.48,
    width * 0.1,
    width * 0.5,
    height * 0.48,
    width * 0.68
  );

  gradient.addColorStop(0, "rgba(116, 184, 255, 0.18)");
  gradient.addColorStop(0.5, "rgba(8, 20, 38, 0.34)");
  gradient.addColorStop(1, "rgba(2, 5, 12, 0.98)");

  context.fillStyle = gradient;
  context.fillRect(0, 0, width, height);
}

function drawHexGrid(context, width, height, frameOffset) {
  const size = Math.max(28, Math.min(width, height) / 13);
  const hexHeight = Math.sqrt(3) * size;
  const horizontal = size * 1.5;
  const vertical = hexHeight;

  context.save();
  context.translate(width * 0.5, height * 0.5);
  context.rotate(frameOffset * 0.18);
  context.translate(-width * 0.5, -height * 0.5);

  for (let row = -1; row < height / vertical + 2; row += 1) {
    for (let col = -1; col < width / horizontal + 2; col += 1) {
      const x = col * horizontal;
      const y = row * vertical + (col % 2) * (vertical / 2);
      const distance = Math.hypot(x - width * 0.5, y - height * 0.5);
      const alpha = Math.max(0.04, 0.22 - distance / Math.max(width, height) / 2.6);

      drawHex(context, x, y, size, alpha);
    }
  }

  context.restore();
}

function drawHex(context, x, y, size, alpha) {
  context.beginPath();

  for (let i = 0; i < 6; i += 1) {
    const angle = Math.PI / 6 + i * (Math.PI / 3);
    const px = x + size * Math.cos(angle);
    const py = y + size * Math.sin(angle);

    if (i === 0) {
      context.moveTo(px, py);
    } else {
      context.lineTo(px, py);
    }
  }

  context.closePath();
  context.strokeStyle = `rgba(245, 199, 107, ${alpha})`;
  context.lineWidth = 1;
  context.stroke();
}

function drawOrbit(context, width, height, frameOffset) {
  const centerX = width * 0.5;
  const centerY = height * 0.52;
  const radiusX = width * 0.28;
  const radiusY = height * 0.12;

  context.save();
  context.translate(centerX, centerY);
  context.rotate(-0.18);

  context.beginPath();
  context.ellipse(0, 0, radiusX, radiusY, 0, 0, Math.PI * 2);
  context.strokeStyle = "rgba(116, 184, 255, 0.26)";
  context.lineWidth = 1.5;
  context.stroke();

  const satelliteAngle = frameOffset * 48;
  const sx = Math.cos(satelliteAngle) * radiusX;
  const sy = Math.sin(satelliteAngle) * radiusY;

  context.beginPath();
  context.arc(sx, sy, 4, 0, Math.PI * 2);
  context.fillStyle = "rgba(245, 199, 107, 0.88)";
  context.fill();

  context.restore();
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}
