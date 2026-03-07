(function () {
  "use strict";

  function getPointerPos(canvas, e) {
    const rect = canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  }

  function getTouchPos(canvas, touch) {
    const rect = canvas.getBoundingClientRect();
    return {
      x: touch.clientX - rect.left,
      y: touch.clientY - rect.top,
    };
  }

  function pointInPoly(x, y, poly) {
    let inside = false;
    for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
      const xi = poly[i].x;
      const yi = poly[i].y;
      const xj = poly[j].x;
      const yj = poly[j].y;
      const hit = yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
      if (hit) inside = !inside;
    }
    return inside;
  }

  function bind(canvas, api) {
    if (!canvas || !api) return;

    canvas.addEventListener(
      "pointermove",
      function (e) {
        const p = getPointerPos(canvas, e);
        if (typeof api.onPointerMove === "function") api.onPointerMove(p, e);
      },
      { passive: true }
    );

    canvas.addEventListener("pointerdown", function (e) {
      const p = getPointerPos(canvas, e);
      if (typeof api.onPointerDown === "function") api.onPointerDown(p, e);
    });

    canvas.addEventListener("pointerup", function (e) {
      const p = getPointerPos(canvas, e);
      if (typeof api.onPointerUp === "function") api.onPointerUp(p, e);
    });

    canvas.addEventListener(
      "touchstart",
      function (e) {
        const touch = e.changedTouches && e.changedTouches[0];
        if (!touch) return;
        const p = getTouchPos(canvas, touch);
        if (typeof api.onTouchStart === "function") api.onTouchStart(p, touch, e);
      },
      { passive: true }
    );

    canvas.addEventListener(
      "touchmove",
      function (e) {
        const touch = e.changedTouches && e.changedTouches[0];
        if (!touch) return;
        const p = getTouchPos(canvas, touch);
        if (typeof api.onTouchMove === "function") api.onTouchMove(p, touch, e);
      },
      { passive: true }
    );

    canvas.addEventListener(
      "touchend",
      function (e) {
        const touch = e.changedTouches && e.changedTouches[0];
        if (!touch) return;
        const p = getTouchPos(canvas, touch);
        if (typeof api.onTouchEnd === "function") api.onTouchEnd(p, touch, e);
        e.preventDefault();
      },
      { passive: false }
    );

    canvas.addEventListener("pointerleave", function (e) {
      if (typeof api.onPointerLeave === "function") api.onPointerLeave(e);
    });

    if (typeof api.onMorphEvent === "function") {
      document.addEventListener("compass:morph", function (e) {
        api.onMorphEvent(e);
      });
    }

    if (typeof api.onSceneCamera === "function") {
      document.addEventListener("scene:camera", function (e) {
        api.onSceneCamera(e);
      });
    }

    if (typeof api.onSceneCameraCycle === "function") {
      document.addEventListener("scene:camera:cycle", function (e) {
        api.onSceneCameraCycle(e);
      });
    }
  }

  window.OPENWORLD_SCENE_INPUT = Object.freeze({
    version: "OPENWORLD_SCENE_INPUT_v1",
    getPointerPos,
    getTouchPos,
    pointInPoly,
    bind,
  });
})();
