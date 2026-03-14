function drawShellBackground(ctx, width, height, viewState) {
  const bg = ctx.createLinearGradient(0, 0, 0, height);
  bg.addColorStop(0, "#02050d");
  bg.addColorStop(0.18, "#050a18");
  bg.addColorStop(0.52, "#081124");
  bg.addColorStop(1, viewState === "PLANET_LAYER" ? "#091427" : "#04070f");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, width, height);

  const vignette = ctx.createRadialGradient(
    width * 0.5,
    height * 0.42,
    Math.min(width, height) * 0.10,
    width * 0.5,
    height * 0.5,
    Math.max(width, height) * 0.72
  );
  vignette.addColorStop(0, "rgba(20,44,82,0)");
  vignette.addColorStop(1, "rgba(0,0,0,0.28)");
  ctx.fillStyle = vignette;
  ctx.fillRect(0, 0, width, height);
}

function drawPlanetAtmosphereShell(ctx, body) {
  const shell = ctx.createRadialGradient(
    body.centerX,
    body.centerY,
    body.radius * 0.90,
    body.centerX,
    body.centerY,
    body.radius * 1.18
  );
  shell.addColorStop(0, "rgba(255,255,255,0)");
  shell.addColorStop(0.56, "rgba(114,188,255,0.10)");
  shell.addColorStop(0.82, "rgba(84,162,255,0.12)");
  shell.addColorStop(1, "rgba(84,162,255,0)");
  ctx.fillStyle = shell;
  ctx.beginPath();
  ctx.arc(body.centerX, body.centerY, body.radius * 1.18, 0, Math.PI * 2);
  ctx.fill();
}

export function createEnvironmentRenderer({ renderRouter }) {
  return {
    draw(ctx, snapshot, projector, viewState) {
      const width = ctx.canvas.width;
      const height = ctx.canvas.height;
      const body = projector.getBody();

      drawShellBackground(ctx, width, height, viewState);

      renderRouter.drawActiveLayer(ctx, snapshot, projector, viewState, {
        width,
        height,
        tick: snapshot.tick ?? 0,
        viewState
      });

      if (viewState === "PLANET_LAYER") {
        drawPlanetAtmosphereShell(ctx, body);
      }
    }
  };
}
