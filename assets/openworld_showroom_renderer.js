(function () {
  "use strict";

  function createState() {
    return {
      mode: "idle",
    };
  }

  function refreshTargets(state) {
    return state;
  }

  function update(state) {
    return state;
  }

  function drawDragonMarkers(ctx, sceneState) {
    if (!sceneState) return;

    ctx.save();
    ctx.globalAlpha = 0.82;

    if (sceneState.dragonFearActive && sceneState.moonLeftHot) {
      ctx.fillStyle = "rgba(255,158,112,0.92)";
      ctx.font = '700 11px system-ui,Segoe UI,Roboto,sans-serif';
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("FEAR ACTIVE", sceneState.moonLeftHot.x, sceneState.moonLeftHot.y - (sceneState.moonLeftHot.r + 18));
    }

    if (sceneState.dragonAlignActive && sceneState.moonRightHot) {
      ctx.fillStyle = "rgba(255,236,190,0.92)";
      ctx.font = '700 11px system-ui,Segoe UI,Roboto,sans-serif';
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("ALIGN ACTIVE", sceneState.moonRightHot.x, sceneState.moonRightHot.y - (sceneState.moonRightHot.r + 18));
    }

    ctx.restore();
  }

  window.OPENWORLD_SHOWROOM_RENDERER = Object.freeze({
    version: "OPENWORLD_SHOWROOM_RENDERER_vSANITY1",
    createState,
    refreshTargets,
    update,
    drawDragonMarkers,
  });
})();
