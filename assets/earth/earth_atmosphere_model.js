/* /assets/earth/earth_atmosphere_model.js
   EARTH_G6_ATMOSPHERE_MODEL_TNT_v1
   Atmosphere / scatter / haze authority only.
*/

(function () {
  "use strict";

  const VERSION = "EARTH_G6_ATMOSPHERE_MODEL_TNT_v1";

  function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
  }

  function lerp(a, b, t) {
    return a + (b - a) * t;
  }

  function mixColor(a, b, t) {
    return [
      lerp(a[0], b[0], t),
      lerp(a[1], b[1], t),
      lerp(a[2], b[2], t)
    ];
  }

  function dot(a, b) {
    return a.x * b.x + a.y * b.y + a.z * b.z;
  }

  function shade(sample, normal, telemetry) {
    const lightRaw = dot(normal, telemetry.lightVector);
    const light = clamp(lightRaw * 0.72 + 0.34, 0.14, 1.08);
    const limb = clamp(1 - normal.z, 0, 1);
    const limbGlow = Math.pow(limb, 1.85);
    const haze = Math.pow(limb, 2.4);

    let color = sample.color.slice();

    color[0] *= light;
    color[1] *= light;
    color[2] *= light;

    if (sample.water > 0.5) {
      const specular = Math.pow(clamp(lightRaw, 0, 1), 18) * Math.pow(1 - limb, 3.4);
      color[0] += specular * 42;
      color[1] += specular * 68;
      color[2] += specular * 98;
    }

    const atmosphereBlue = [82, 154, 230];
    color = mixColor(color, atmosphereBlue, haze * 0.20);

    if (sample.cloudAlpha > 0) {
      const cloud = [230, 236, 232];
      const cloudLight = clamp(0.44 + light * 0.58, 0, 1);
      color = mixColor(color, cloud, sample.cloudAlpha * cloudLight);
    }

    color[0] += limbGlow * 22;
    color[1] += limbGlow * 46;
    color[2] += limbGlow * 86;

    return [
      clamp(Math.round(color[0]), 0, 255),
      clamp(Math.round(color[1]), 0, 255),
      clamp(Math.round(color[2]), 0, 255),
      255
    ];
  }

  function edgeGlow(normal) {
    const limb = clamp(1 - normal.z, 0, 1);
    return Math.pow(limb, 3.0);
  }

  function getStatus() {
    return {
      version: VERSION,
      contract: VERSION,
      owns: [
        "rayleigh_style_blue_scatter_approximation",
        "haze",
        "cloud_opacity_blend",
        "day_night_falloff",
        "atmospheric_edge_glow"
      ],
      doesNotOwn: [
        "surface_lattice",
        "canvas_projection",
        "runtime_lifecycle",
        "material_css",
        "image_generation",
        "GraphicBox"
      ],
      generatedImage: false,
      graphicBox: false,
      visualPassClaimed: false
    };
  }

  window.DGBEarthAtmosphereModel = Object.freeze({
    version: VERSION,
    shade,
    edgeGlow,
    getStatus
  });
})();
