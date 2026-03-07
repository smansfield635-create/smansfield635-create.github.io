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

  function bind(canvas, handlers) {
    canvas.addEventListener(
      "pointermove",
      function (e) {
        if (handlers.onPointerMove) {
          handlers.onPointerMove(getPointerPos(canvas, e), e);
        }
      },
      { passive: true }
    );

    canvas.addEventListener("pointerdown", function (e) {
      if (handlers.onPointerDown) {
        handlers.onPointerDown(getPointerPos(canvas, e), e);
      }
    });

    canvas.addEventListener("pointerup", function (e) {
      if (handlers.onPointerUp) {
        handlers.onPointerUp(getPointerPos(canvas, e), e);
      }
    });

    canvas.addEventListener(
      "touchstart",
      function (e) {
        const touch = e.changedTouches && e.changedTouches[0];
        if (!touch) return;
        if (handlers.onTouchStart) {
          handlers.onTouchStart(getTouchPos(canvas, touch), touch, e);
        }
      },
      { passive: true }
    );

    canvas.addEventListener(
      "touchmove",
      function (e) {
        const touch = e.changedTouches && e.changedTouches[0];
        if (!touch) return;
        if (handlers.onTouchMove) {
          handlers.onTouchMove(getTouchPos(canvas, touch), touch, e);
        }
      },
      { passive: true }
    );

    canvas.addEventListener(
      "touchend",
      function (e) {
        const touch = e.changedTouches && e.changedTouches[0];
        if (!touch) return;
        if (handlers.onTouchEnd) {
          handlers.onTouchEnd(getTouchPos(canvas, touch), touch, e);
        }
        e.preventDefault();
      },
      { passive: false }
    );

    canvas.addEventListener("pointerleave", function (e) {
      if (handlers.onPointerLeave) {
        handlers.onPointerLeave(e);
      }
    });

    document.addEventListener("compass:morph", function (e) {
      if (handlers.onMorphEvent) {
        handlers.onMorphEvent(e);
      }
    });

    document.addEventListener("scene:camera", function (e) {
      if (handlers.onSceneCamera) {
        handlers.onSceneCamera(e);
      }
    });

    document.addEventListener("scene:camera:cycle", function (e) {
      if (handlers.onSceneCameraCycle) {
        handlers.onSceneCameraCycle(e);
      }
    });
  }

  window.OPENWORLD_SCENE_INPUT = Object.freeze({
    version: "OPENWORLD_SCENE_INPUT_v1",
    pointInPoly,
    bind,
  });
})();
