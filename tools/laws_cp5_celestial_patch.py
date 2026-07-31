from pathlib import Path
import re

path = Path('laws/index.crystals.js')
text = path.read_text()

required = [
    'horizontalRadius:\n        1.68,',
    'verticalRadius:\n        1.5008,',
    'depthRadius:\n        1.2992,',
    'gatewayBodyScale:\n    0.7666667,'
]
missing = [fragment for fragment in required if fragment not in text]
if missing:
    raise SystemExit(f'ACCEPTED_GEOMETRY_GUARD_FAILED:{missing}')

old_solar = 'Object.freeze({specular:0.72,rim:1.16,emissive:0.68,alpha:1.00,sparkle:0.04,halo:0.86,contrast:1.38})'
new_solar = 'Object.freeze({specular:0.18,rim:0.42,emissive:0.88,alpha:1.50,sparkle:0.00,halo:0.58,contrast:1.70})'
old_lunar = 'Object.freeze({specular:0.24,rim:0.72,emissive:0.035,alpha:0.99,sparkle:0.00,halo:0.34,contrast:1.48})'
new_lunar = 'Object.freeze({specular:0.08,rim:0.18,emissive:0.018,alpha:1.50,sparkle:0.00,halo:0.10,contrast:1.85})'
if text.count(old_solar) != 1 or text.count(old_lunar) != 1:
    raise SystemExit('MATERIAL_BASELINE_GUARD_FAILED')
text = text.replace(old_solar, new_solar, 1).replace(old_lunar, new_lunar, 1)

new_function = r'''  function createCelestialSphereMesh(options = {}) {
    const segments = Math.max(24, options.segments || 48);
    const rings = Math.max(16, options.rings || 32);
    const radius = options.radius || 0.66;
    const color = options.color || [1, 1, 1];
    const mode = options.mode === "solar" ? "solar" : "lunar";
    const positions = [];
    const normals = [];
    const colors = [];
    const craters = [
      [0.42, 0.26, 0.86, 0.24, 0.052],
      [-0.36, 0.54, 0.76, 0.19, 0.043],
      [0.18, -0.48, 0.86, 0.16, 0.038],
      [-0.58, -0.20, 0.79, 0.21, 0.046],
      [0.64, -0.12, 0.76, 0.14, 0.033],
      [-0.08, 0.78, 0.62, 0.13, 0.030],
      [0.16, 0.08, 0.98, 0.09, 0.024],
      [-0.28, -0.62, 0.73, 0.11, 0.027]
    ].map(record => ({
      center: normalizeVector(record.slice(0, 3)),
      radius: record[3],
      depth: record[4]
    }));

    function deterministicField(x, y, z, frequency, phase) {
      return (
        Math.sin((x * 1.73 + y * 2.11 + z * 2.67) * frequency + phase) * 0.50 +
        Math.sin((x * 2.93 - y * 1.37 + z * 1.91) * frequency * 1.61 - phase * 0.73) * 0.30 +
        Math.sin((-x * 1.17 + y * 2.51 + z * 3.07) * frequency * 2.37 + phase * 1.29) * 0.20
      );
    }

    function smoothTransition(edge0, edge1, value) {
      const amount = clamp((value - edge0) / (edge1 - edge0), 0, 1);
      return amount * amount * (3 - 2 * amount);
    }

    function craterField(nx, ny, nz) {
      let relief = 0;
      let albedo = 0;
      craters.forEach(crater => {
        const angularDistance = Math.acos(
          clamp(nx * crater.center[0] + ny * crater.center[1] + nz * crater.center[2], -1, 1)
        );
        const normalizedDistance = angularDistance / crater.radius;
        const bowl = Math.exp(-normalizedDistance * normalizedDistance * 3.2);
        const rim = Math.exp(-Math.pow((normalizedDistance - 0.84) * 6.2, 2));
        const ejecta = Math.exp(-Math.pow((normalizedDistance - 1.18) * 3.4, 2));
        relief += rim * crater.depth * 0.92 - bowl * crater.depth * 1.18 + ejecta * crater.depth * 0.12;
        albedo += rim * 0.22 - bowl * 0.25 + ejecta * 0.035;
      });
      return { relief, albedo };
    }

    function surfaceSample(phi, theta) {
      const nx = Math.sin(phi) * Math.cos(theta);
      const ny = Math.cos(phi);
      const nz = Math.sin(phi) * Math.sin(theta);
      let relief = 1;
      let surfaceColor;

      if (mode === "solar") {
        const broad = deterministicField(nx, ny, nz, 4.6, 0.73);
        const cells = deterministicField(nx, ny, nz, 13.6, 2.17);
        const fine = deterministicField(nx, ny, nz, 31.0, 1.31);
        const spotCenterA = normalizeVector([0.44, 0.18, 0.88]);
        const spotCenterB = normalizeVector([-0.34, -0.36, 0.87]);
        const spotA = Math.exp(-Math.pow(Math.acos(clamp(nx * spotCenterA[0] + ny * spotCenterA[1] + nz * spotCenterA[2], -1, 1)) / 0.14, 2) * 2.8);
        const spotB = Math.exp(-Math.pow(Math.acos(clamp(nx * spotCenterB[0] + ny * spotCenterB[1] + nz * spotCenterB[2], -1, 1)) / 0.11, 2) * 3.2);
        const shade = clamp(0.82 + broad * 0.09 + cells * 0.15 + fine * 0.055 - spotA * 0.24 - spotB * 0.18, 0.48, 1.10);
        relief += broad * 0.0055 + cells * 0.0036 + fine * 0.0014;
        surfaceColor = [
          clamp(0.93 + shade * 0.12, 0, 1),
          clamp(color[1] * (0.70 + shade * 0.30), 0, 1),
          clamp(color[2] * (0.38 + shade * 0.50), 0, 1)
        ];
      } else {
        const terrain = deterministicField(nx, ny, nz, 5.8, 1.43);
        const fineTerrain = deterministicField(nx, ny, nz, 15.8, 0.39);
        const crater = craterField(nx, ny, nz);
        const light = normalizeVector([-0.62, 0.22, 0.75]);
        const illumination = nx * light[0] + ny * light[1] + nz * light[2];
        const terminator = 0.14 + 0.86 * smoothTransition(-0.20, 0.16, illumination);
        const shade = clamp((0.66 + terrain * 0.11 + fineTerrain * 0.055 + crater.albedo) * terminator, 0.09, 1.02);
        relief += terrain * 0.013 + fineTerrain * 0.0055 + crater.relief;
        surfaceColor = [
          clamp(color[0] * shade * 0.92, 0, 1),
          clamp(color[1] * shade * 0.78, 0, 1),
          clamp(color[2] * shade * 1.08, 0, 1)
        ];
      }

      const radial = radius * relief;
      return {
        radialNormal: [nx, ny, nz],
        position: [nx * radial, ny * radial, nz * radial],
        color: surfaceColor
      };
    }

    function localCross(a, b) {
      return [
        a[1] * b[2] - a[2] * b[1],
        a[2] * b[0] - a[0] * b[2],
        a[0] * b[1] - a[1] * b[0]
      ];
    }

    function localSubtract(a, b) {
      return [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
    }

    function point(ring, segment) {
      const phi = ring / rings * Math.PI;
      const theta = segment / segments * Math.PI * 2;
      const sample = surfaceSample(phi, theta);
      const phiStep = Math.PI / rings * 0.32;
      const thetaStep = Math.PI * 2 / segments * 0.32;
      const phiMinus = Math.max(0.0001, phi - phiStep);
      const phiPlus = Math.min(Math.PI - 0.0001, phi + phiStep);
      const tangentTheta = localSubtract(
        surfaceSample(phi, theta + thetaStep).position,
        surfaceSample(phi, theta - thetaStep).position
      );
      const tangentPhi = localSubtract(
        surfaceSample(phiPlus, theta).position,
        surfaceSample(phiMinus, theta).position
      );
      let normal = normalizeVector(localCross(tangentTheta, tangentPhi), sample.radialNormal);
      const outward = normal[0] * sample.radialNormal[0] + normal[1] * sample.radialNormal[1] + normal[2] * sample.radialNormal[2];
      if (outward < 0) normal = normal.map(value => -value);
      return { position: sample.position, normal, color: sample.color };
    }

    function push(vertex) {
      positions.push(...vertex.position);
      normals.push(...vertex.normal);
      colors.push(...vertex.color);
    }

    for (let ring = 0; ring < rings; ring += 1) {
      for (let segment = 0; segment < segments; segment += 1) {
        const next = (segment + 1) % segments;
        const a = point(ring, segment);
        const b = point(ring + 1, segment);
        const c = point(ring + 1, next);
        const d = point(ring, next);
        push(a); push(b); push(c); push(a); push(c); push(d);
      }
    }

    return Object.freeze({
      positions: new Float32Array(positions),
      normals: new Float32Array(normals),
      colors: new Float32Array(colors),
      vertexCount: positions.length / 3
    });
  }'''

pattern = r'  function createCelestialSphereMesh\(options = \{\}\) \{.*?\n  \}\n\n  function lawColorForDirection'
text, replacements = re.subn(pattern, new_function + '\n\n  function lawColorForDirection', text, count=1, flags=re.S)
if replacements != 1:
    raise SystemExit(f'CELESTIAL_FUNCTION_REPLACEMENT_FAILED:{replacements}')

old_mesh = 'createCelestialSphereMesh({segments:30,rings:20,radius:0.66'
new_mesh = 'createCelestialSphereMesh({segments:48,rings:32,radius:0.66'
if text.count(old_mesh) != 1:
    raise SystemExit(f'CELESTIAL_MESH_CALL_GUARD_FAILED:{text.count(old_mesh)}')
text = text.replace(old_mesh, new_mesh, 1)

for fragment in required:
    if fragment not in text:
        raise SystemExit(f'ACCEPTED_GEOMETRY_MUTATED:{fragment}')
if text.count('alpha:1.50') != 2:
    raise SystemExit('OPAQUE_MATERIAL_ASSERTION_FAILED')
if 'localCross(tangentTheta, tangentPhi)' not in text:
    raise SystemExit('RELIEF_NORMAL_ASSERTION_FAILED')

path.write_text(text)
