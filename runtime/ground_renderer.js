export function createGroundRenderer() {
  function render(context, payload) {
    const { width, height, projection } = payload;

    context.save();
    context.lineJoin = "round";
    context.lineCap = "round";

    drawWater(context, projection.waters);
    drawGround(context, projection.regions);
    drawGrid(context, projection.gridLines);
    drawPaths(context, projection.paths);
    drawMarkers(context, projection.markers);
    drawVignette(context, width, height);

    context.restore();
  }

  return { render };
}

function drawWater(context, waters) {
  waters.forEach((water) => {
    drawClosedPath(context, water.projected);
    const fill = context.createLinearGradient(0, 0, 0, context.canvas.height || 900);
    fill.addColorStop(0, "rgba(109,182,255,0.22)");
    fill.addColorStop(1, "rgba(34,104,182,0.42)");
    context.fillStyle = fill;
    context.fill();
    context.strokeStyle = "rgba(145,207,255,0.34)";
    context.lineWidth = 2;
    context.stroke();
  });
}

function drawGround(context, regions) {
  regions.forEach((region, index) => {
    drawClosedPath(context, region.projected);
    if (index === 0) {
      const fill = context.createLinearGradient(0, 0, 0, context.canvas.height || 900);
      fill.addColorStop(0, "rgba(86,143,103,0.92)");
      fill.addColorStop(1, "rgba(37,78,54,0.96)");
      context.fillStyle = fill;
    } else {
      const fill = context.createLinearGradient(0, 0, 0, context.canvas.height || 900);
      fill.addColorStop(0, "rgba(136,179,109,0.94)");
      fill.addColorStop(1, "rgba(72,104,54,0.98)");
      context.fillStyle = fill;
    }
    context.fill();
    context.strokeStyle = "rgba(255,255,255,0.12)";
    context.lineWidth = index === 0 ? 2 : 1.5;
    context.stroke();
  });
}

function drawGrid(context, gridLines) {
  context.save();
  context.strokeStyle = "rgba(255,255,255,0.10)";
  context.lineWidth = 1;

  gridLines.forEach((line) => {
    context.beginPath();
    context.moveTo(line.a.x, line.a.y);
    context.lineTo(line.b.x, line.b.y);
    context.stroke();
  });

  context.restore();
}

function drawPaths(context, paths) {
  context.save();
  context.strokeStyle = "rgba(242,214,143,0.95)";
  context.lineWidth = 3;

  paths.forEach((path, index) => {
    context.beginPath();
    path.projected.forEach((point, pointIndex) => {
      if (pointIndex === 0) {
        context.moveTo(point.x, point.y);
      } else {
        context.lineTo(point.x, point.y);
      }
    });
    context.stroke();

    if (index < 2) {
      context.strokeStyle = "rgba(255,255,255,0.18)";
      context.lineWidth = 1;
      context.stroke();
      context.strokeStyle = "rgba(242,214,143,0.95)";
      context.lineWidth = 3;
    }
  });

  context.restore();
}

function drawMarkers(context, markers) {
  context.save();
  context.font = "600 12px Inter, system-ui, sans-serif";
  context.textAlign = "center";
  context.textBaseline = "bottom";

  markers.forEach((marker) => {
    const x = marker.projected.x;
    const y = marker.projected.y;

    context.beginPath();
    context.arc(x, y, marker.size, 0, Math.PI * 2);
    context.fillStyle = "rgba(255,255,255,0.95)";
    context.fill();

    context.beginPath();
    context.arc(x, y, marker.size + 4, 0, Math.PI * 2);
    context.strokeStyle = "rgba(255,255,255,0.18)";
    context.lineWidth = 1;
    context.stroke();

    context.fillStyle = "rgba(255,255,255,0.88)";
    context.fillText(marker.label, x, y - 10);
  });

  context.restore();
}

function drawVignette(context, width, height) {
  context.save();
  const gradient = context.createRadialGradient(
    width * 0.5,
    height * 0.45,
    Math.min(width, height) * 0.2,
    width * 0.5,
    height * 0.55,
    Math.max(width, height) * 0.7
  );
  gradient.addColorStop(0, "rgba(0,0,0,0)");
  gradient.addColorStop(1, "rgba(0,0,0,0.28)");
  context.fillStyle = gradient;
  context.fillRect(0, 0, width, height);
  context.restore();
}

function drawClosedPath(context, points) {
  context.beginPath();
  points.forEach((point, index) => {
    if (index === 0) {
      context.moveTo(point.x, point.y);
    } else {
      context.lineTo(point.x, point.y);
    }
  });
  context.closePath();
}
