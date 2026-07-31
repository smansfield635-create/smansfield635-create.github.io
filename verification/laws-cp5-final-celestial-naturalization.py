#!/usr/bin/env python3
from __future__ import annotations

import hashlib
import json
import os
import pathlib
import shutil
import subprocess
import sys
import time

REPO = pathlib.Path.cwd()
PRODUCT = REPO / "laws/index.crystals.js"
BASE_MAIN = "b7bd810a359af9d939b91dbac5b9794ce7da5d1e"
BASE_CRYSTAL = "8133609c21f43a5910ec7a247d50310390152cbb"
BRANCH = "agent/laws-cp5-final-celestial-naturalization-001"
MARKER = "CP5_FINAL_CELESTIAL_NATURALIZATION"


def run(*args: str, check: bool = True, capture: bool = False, env: dict[str, str] | None = None) -> subprocess.CompletedProcess[str]:
    return subprocess.run(
        list(args),
        cwd=REPO,
        check=check,
        text=True,
        capture_output=capture,
        env=env,
    )


def output(*args: str) -> str:
    return run(*args, capture=True).stdout.strip()


def replace_once(text: str, old: str, new: str, label: str) -> str:
    count = text.count(old)
    if count != 1:
        raise RuntimeError(f"{label}_OCCURRENCE_INVALID:{count}")
    return text.replace(old, new, 1)


def sha256(path: pathlib.Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        for chunk in iter(lambda: handle.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def build_candidate() -> None:
    if MARKER in PRODUCT.read_text():
        return

    if output("git", "hash-object", str(PRODUCT)) != BASE_CRYSTAL:
        raise RuntimeError("BASE_CRYSTAL_MISMATCH")

    text = PRODUCT.read_text()
    text = replace_once(
        text,
        "2.2.1-cp5-r2-solar-lunar-visual-correction",
        "2.3.0-cp5-final-celestial-naturalization",
        "VERSION",
    )

    fragment_start = text.index("  const fragmentShaderSource = `")
    fragment_main = text.index("    void main() {", fragment_start)
    helpers = r'''    /* CP5_FINAL_CELESTIAL_NATURALIZATION */
    float solarWave(vec3 p, float frequency, float phase) {
      return
        sin(dot(p, vec3(1.73, 2.11, 2.67)) * frequency + phase) * 0.48 +
        sin(dot(p, vec3(-2.93, 1.37, 1.91)) * frequency * 1.61 - phase * 0.73) * 0.31 +
        sin(dot(p, vec3(1.17, -2.51, 3.07)) * frequency * 2.37 + phase * 1.29) * 0.21;
    }

    vec3 solarAdvect(vec3 p, float t) {
      float shearA = sin(p.y * 5.3 + p.z * 2.2 + t * 0.31) * 0.13;
      float shearB = sin(p.z * 4.1 - p.x * 2.7 - t * 0.23) * 0.11;
      float vortex = sin((p.x * p.y - p.z * p.z) * 8.0 + t * 0.47) * 0.09;
      vec3 displacement = vec3(
        shearA + sin(p.z * 7.0 - t * 0.19) * 0.08,
        shearB + sin(p.x * 6.2 + t * 0.27) * 0.08,
        vortex + sin(p.y * 5.7 - t * 0.33) * 0.07
      );
      return normalize(p + displacement);
    }

    float solarLargeField(vec3 p, float t) {
      vec3 q = solarAdvect(p, t);
      float collisionFold = sin((q.x * q.y + q.y * q.z - q.z * q.x) * 7.5 + t * 0.37);
      return clamp(
        solarWave(q, 1.05, t * 0.41) * 0.72 +
        solarWave(q.yzx, 0.72, -t * 0.29) * 0.28 +
        collisionFold * 0.16,
        -1.0,
        1.0
      );
    }

    float solarMediumField(vec3 p, float t) {
      vec3 q = solarAdvect(p, t * 1.13 + 0.7);
      return clamp(
        solarWave(q, 2.75, -t * 0.53) * 0.62 +
        solarWave(q.zxy, 3.85, t * 0.36) * 0.38,
        -1.0,
        1.0
      );
    }

    float solarFineField(vec3 p, float t) {
      vec3 q = solarAdvect(p, t * 0.83 - 1.4);
      return clamp(
        solarWave(q, 9.8, t * 0.91) * 0.58 +
        solarWave(q.yzx, 14.6, -t * 0.67) * 0.42,
        -1.0,
        1.0
      );
    }

    float solarCollisionField(vec3 p, float t) {
      float opposingA = sin(dot(p, vec3(3.7, 2.1, -1.9)) + t * 0.53);
      float opposingB = sin(dot(p, vec3(-2.9, 3.4, 2.6)) - t * 0.47);
      float compression = smoothstep(0.18, 0.94, -opposingA * opposingB);
      float shear = 0.5 + 0.5 * sin((p.x * p.z - p.y * p.x) * 15.0 + t * 0.71);
      return compression * (0.54 + shear * 0.46);
    }

    float solarRingField(vec3 p, float t) {
      vec3 centerA = normalize(vec3(
        0.48 + sin(t * 0.19) * 0.16,
        -0.16 + cos(t * 0.23) * 0.18,
        0.86 + sin(t * 0.11) * 0.08
      ));
      vec3 centerB = normalize(vec3(
        -0.57 + cos(t * 0.17) * 0.14,
        0.46 + sin(t * 0.29) * 0.16,
        0.68 + cos(t * 0.13) * 0.09
      ));
      float distanceA = acos(clamp(dot(p, centerA), -1.0, 1.0));
      float distanceB = acos(clamp(dot(p, centerB), -1.0, 1.0));
      float radiusA = 0.28 + sin(t * 0.37) * 0.075;
      float radiusB = 0.22 + cos(t * 0.31) * 0.060;
      float ringA = exp(-pow((distanceA - radiusA) / 0.060, 2.0));
      float ringB = exp(-pow((distanceB - radiusB) / 0.052, 2.0));
      float lifeA = smoothstep(0.30, 0.72, 0.5 + 0.5 * sin(t * 0.43 + 0.8));
      float lifeB = smoothstep(0.36, 0.78, 0.5 + 0.5 * sin(t * 0.37 + 3.1));
      float partialA = smoothstep(0.08, 0.82, 0.5 + 0.5 * sin(dot(p, vec3(7.0, -9.0, 11.0)) + t * 0.61));
      float partialB = smoothstep(0.12, 0.84, 0.5 + 0.5 * sin(dot(p, vec3(-10.0, 8.0, 6.0)) - t * 0.57));
      return clamp(ringA * lifeA * partialA + ringB * lifeB * partialB, 0.0, 1.0);
    }

'''
    text = text[:fragment_main] + helpers + text[fragment_main:]

    halo_start = text.index("      if (vHaloPass > 0.5) {", fragment_start)
    solar_halo_start = text.index("        if (uSolarBody > 0.5) {", halo_start)
    generic_halo_start = text.index("\n        vec3 haloColor =", solar_halo_start)
    solar_halo = r'''        if (uSolarBody > 0.5) {
          vec3 solarN = normalize(n);
          vec3 advected = solarAdvect(solarN, uTime);
          float large = solarLargeField(advected, uTime);
          float medium = solarMediumField(advected, uTime);
          float fine = solarFineField(advected, uTime);
          float collision = solarCollisionField(advected, uTime);
          float rings = solarRingField(advected, uTime);
          float activity = clamp(
            0.44 + large * 0.22 + medium * 0.17 + max(fine, 0.0) * 0.08 +
            collision * 0.36 + rings * 0.32,
            0.0,
            1.0
          );
          float limbGate = smoothstep(0.16, 0.94, fresnel + sideRim * 0.65);
          float wispMask = smoothstep(0.56, 0.88, activity + medium * 0.11 + rings * 0.18);
          vec3 haloColor = mix(
            vec3(0.78, 0.11, 0.008),
            vec3(1.0, 0.74, 0.18),
            clamp(activity + collision * 0.18 + rings * 0.14, 0.0, 1.0)
          ) *
          (0.42 + activity * 0.76 + collision * 0.24 + rings * 0.30) *
          uHaloStrength;
          float haloAlpha = clamp(
            (
              0.006 +
              limbGate * (0.012 + activity * 0.082) +
              collision * 0.022 +
              rings * 0.048
            ) *
            wispMask *
            uProminence *
            uHaloStrength,
            0.0,
            0.22
          );
          gl_FragColor = vec4(haloColor, haloAlpha);
          return;
        }
'''
    text = text[:solar_halo_start] + solar_halo + text[generic_halo_start:]

    main_solar_start = text.index("      if (uSolarBody > 0.5) {", generic_halo_start)
    diffuse_start = text.index("\n      float diffuse =", main_solar_start)
    main_solar = r'''      if (uSolarBody > 0.5) {
        vec3 solarN = normalize(n);
        vec3 advected = solarAdvect(solarN, uTime);
        float large = solarLargeField(advected, uTime);
        float medium = solarMediumField(advected, uTime);
        float fine = solarFineField(advected, uTime);
        float collision = solarCollisionField(advected, uTime);
        float rings = solarRingField(advected, uTime);
        float channelSource = abs(medium * 0.78 + large * 0.22);
        float branchingChannel = 1.0 - smoothstep(0.055, 0.29, channelSource);
        float vortex = 0.5 + 0.5 * sin(
          (advected.x * advected.y - advected.z * advected.x) * 18.0 +
          large * 2.8 +
          uTime * 0.71
        );
        float heat = clamp(
          0.50 +
          large * 0.20 +
          medium * 0.14 +
          fine * 0.060 +
          collision * 0.18 +
          rings * 0.13 +
          vortex * 0.050 -
          branchingChannel * 0.18,
          0.0,
          1.0
        );
        vec3 darkAmber = vec3(0.38, 0.070, 0.006);
        vec3 burntOrange = vec3(0.72, 0.145, 0.008);
        vec3 deepOrange = vec3(1.0, 0.335, 0.015);
        vec3 plasmaGold = vec3(1.0, 0.690, 0.075);
        vec3 hotGranule = vec3(1.0, 0.970, 0.67);
        vec3 plasmaColor = mix(darkAmber, burntOrange, smoothstep(0.02, 0.30, heat));
        plasmaColor = mix(plasmaColor, deepOrange, smoothstep(0.25, 0.56, heat));
        plasmaColor = mix(plasmaColor, plasmaGold, smoothstep(0.52, 0.79, heat));
        plasmaColor = mix(plasmaColor, hotGranule, smoothstep(0.77, 0.98, heat));
        float centerToLimb = smoothstep(0.04, 0.92, max(facingToCamera, 0.0));
        float limbBrightness = 0.70 + centerToLimb * 0.30;
        vec3 solarColor = mix(base, plasmaColor, 0.965);
        solarColor *= limbBrightness * (0.95 + uProminence * 0.055);
        solarColor *= 0.96 + key * 0.065 + fill * 0.025;
        solarColor += vec3(1.0, 0.28, 0.010) * collision * 0.055;
        solarColor += vec3(1.0, 0.62, 0.050) * rings * 0.050;
        gl_FragColor = vec4(min(solarColor, vec3(1.0)), 1.0);
        return;
      }
'''
    text = text[:main_solar_start] + main_solar + text[diffuse_start:]

    mesh_start = text.index("  function createCelestialSphereMesh(options = {})")
    crater_start = text.index("    const craters = [", mesh_start)
    solar_marker_start = text.index("    /* CP5_R2_SOLAR_LARGE_CONVECTION_CELLS */", crater_start)
    lunar_definitions = r'''    /* CP5_FINAL_LUNAR_CRATER_HIERARCHY_AND_MARIA */
    const craters = [
      [0.34, 0.18, 0.92, 0.44, 0.058, 0.86, 0.18, 1.00, 0.22],
      [-0.48, 0.52, 0.70, 0.36, 0.047, 0.62, 0.46, 0.92, 0.44],
      [0.58, -0.34, 0.74, 0.27, 0.039, 0.78, 0.28, 0.96, 0.30],
      [-0.62, -0.22, 0.75, 0.23, 0.034, 0.48, 0.62, 0.76, 0.68],
      [0.12, 0.72, 0.68, 0.20, 0.030, 0.72, 0.34, 0.90, 0.36],
      [0.76, 0.22, 0.61, 0.18, 0.027, 0.56, 0.54, 0.78, 0.58],
      [-0.18, -0.66, 0.73, 0.16, 0.024, 0.82, 0.22, 0.92, 0.20],
      [0.08, -0.18, 0.98, 0.14, 0.022, 0.68, 0.38, 0.86, 0.42],
      [-0.34, 0.06, 0.94, 0.12, 0.018, 0.42, 0.70, 0.62, 0.74],
      [0.44, 0.62, 0.65, 0.11, 0.017, 0.76, 0.26, 0.88, 0.26],
      [-0.76, 0.34, 0.55, 0.10, 0.015, 0.52, 0.58, 0.68, 0.64],
      [0.28, -0.78, 0.56, 0.095, 0.014, 0.84, 0.18, 0.86, 0.18],
      [0.64, -0.02, -0.77, 0.19, 0.028, 0.60, 0.48, 0.80, 0.52],
      [-0.42, 0.38, -0.82, 0.13, 0.019, 0.44, 0.68, 0.58, 0.76],
      [0.16, -0.52, -0.84, 0.085, 0.012, 0.74, 0.32, 0.72, 0.34]
    ].map(record => ({
      center: normalizeVector(record.slice(0, 3)),
      radius: record[3],
      depth: record[4],
      rimSharpness: record[5],
      erosion: record[6],
      visibility: record[7],
      partialBias: record[8]
    }));

    const lunarMaria = [
      [0.12, 0.30, 0.95, 0.56, 0.76],
      [-0.56, -0.08, 0.82, 0.43, 0.60],
      [0.61, -0.42, 0.67, 0.35, 0.48],
      [-0.24, 0.72, -0.65, 0.39, 0.52]
    ].map(record => ({
      center: normalizeVector(record.slice(0, 3)),
      radius: record[3],
      strength: record[4]
    }));

    const lunarPlains = [
      [0.70, 0.38, 0.60, 0.46, 0.82],
      [-0.12, -0.72, 0.68, 0.50, 0.88],
      [-0.72, 0.46, -0.52, 0.42, 0.72]
    ].map(record => ({
      center: normalizeVector(record.slice(0, 3)),
      radius: record[3],
      strength: record[4]
    }));

'''
    text = text[:crater_start] + lunar_definitions + text[solar_marker_start:]

    solar_block_start = text.index("    /* CP5_R2_SOLAR_LARGE_CONVECTION_CELLS */", mesh_start)
    mix_color_start = text.index("    function mixColor", solar_block_start)
    solar_definitions = r'''    /* CP5_FINAL_SOLAR_OPEN_BRANCHING_BASE */
    const solarActivity = [
      [0.44, 0.18, 0.88, 0.18, 0.95],
      [-0.34, -0.36, 0.87, 0.14, 0.82],
      [0.62, -0.56, -0.54, 0.20, 0.70],
      [-0.58, 0.48, 0.66, 0.16, 0.76]
    ].map(record => ({
      center: normalizeVector(record.slice(0, 3)),
      radius: record[3],
      strength: record[4]
    }));

'''
    text = text[:solar_block_start] + solar_definitions + text[mix_color_start:]

    crater_function_start = text.index("    function craterField", mesh_start)
    surface_function_start = text.index("    function surfaceSample", crater_function_start)
    field_functions = r'''    function regionField(regions, nx, ny, nz, phase) {
      let field = 0;
      regions.forEach(region => {
        const angularDistance = Math.acos(
          clamp(nx * region.center[0] + ny * region.center[1] + nz * region.center[2], -1, 1)
        );
        const boundaryWarp = deterministicField(nx, ny, nz, 2.8, phase + region.radius * 7.3) * 0.12;
        const normalizedDistance = angularDistance / region.radius + boundaryWarp;
        const mask = 1 - smoothTransition(0.60, 1.08, normalizedDistance);
        field = Math.max(field, mask * region.strength);
      });
      return clamp(field, 0, 1);
    }

    function craterField(nx, ny, nz) {
      let relief = 0;
      let albedo = 0;
      let basin = 0;
      craters.forEach(crater => {
        const angularDistance = Math.acos(
          clamp(nx * crater.center[0] + ny * crater.center[1] + nz * crater.center[2], -1, 1)
        );
        const normalizedDistance = angularDistance / crater.radius;
        const bowlFalloff = 2.05 + (1 - crater.erosion) * 1.85;
        const bowl = Math.exp(-normalizedDistance * normalizedDistance * bowlFalloff);
        const rimCenter = 0.80 + crater.erosion * 0.08;
        const rimWidth = 4.1 + (1 - crater.erosion) * 4.8;
        let rim = Math.exp(-Math.pow((normalizedDistance - rimCenter) * rimWidth, 2));
        const partial = clamp(
          0.66 + deterministicField(nx, ny, nz, 3.7, crater.partialBias * 5.3) * 0.34,
          0.18,
          1.0
        );
        rim *= 0.58 + partial * 0.42;
        const ejecta = Math.exp(-Math.pow((normalizedDistance - 1.18) * (2.7 + crater.erosion * 1.4), 2));
        const visibility = crater.visibility;
        relief += (
          rim * crater.depth * crater.rimSharpness * 0.88 -
          bowl * crater.depth * (0.88 + (1 - crater.erosion) * 0.24) +
          ejecta * crater.depth * (0.05 + (1 - crater.erosion) * 0.08)
        ) * visibility;
        albedo += (
          rim * (0.11 + crater.rimSharpness * 0.12) -
          bowl * (0.12 + crater.depth * 1.9) +
          ejecta * 0.024
        ) * visibility;
        basin = Math.max(basin, bowl * visibility * smoothTransition(0.20, 0.42, crater.radius));
      });
      return { relief, albedo, basin };
    }

'''
    text = text[:crater_function_start] + field_functions + text[surface_function_start:]

    surface_start = text.index("    function surfaceSample", mesh_start)
    solar_mode_start = text.index('      if (mode === "solar") {', surface_start)
    old_solar_relief = text.index("        relief +=\n          risingCenter", solar_mode_start)
    outer_else = text.index("\n      } else {", old_solar_relief)
    solar_surface = r'''      if (mode === "solar") {
        const broad = deterministicField(nx, ny, nz, 2.65, 0.73);
        const turbulentFold = deterministicField(nx, ny, nz, 6.9, 2.17);
        const channelSource = Math.abs(deterministicField(nx, ny, nz, 4.2, 1.07));
        const branchingChannel = 1 - smoothTransition(0.055, 0.31, channelSource);
        const fine = deterministicField(nx, ny, nz, 24.0, 1.31);
        let activity = 0;
        solarActivity.forEach(region => {
          const angularDistance = Math.acos(
            clamp(nx * region.center[0] + ny * region.center[1] + nz * region.center[2], -1, 1)
          );
          activity += Math.exp(-Math.pow(angularDistance / region.radius, 2) * 2.2) * region.strength;
        });
        activity = clamp(activity, 0, 1);

        const heat = clamp(
          0.50 + broad * 0.18 + turbulentFold * 0.13 + fine * 0.050 -
          branchingChannel * 0.17 + activity * 0.11,
          0,
          1
        );

        const darkAmber = [0.38, 0.070, 0.006];
        const burntOrange = [0.72, 0.145, 0.008];
        const deepOrange = [1.0, 0.335, 0.015];
        const plasmaGold = [1.0, 0.690, 0.075];
        const hotGranule = [1.0, 0.970, 0.67];
        if (heat < 0.25) {
          surfaceColor = mixColor(darkAmber, burntOrange, heat / 0.25);
        } else if (heat < 0.55) {
          surfaceColor = mixColor(burntOrange, deepOrange, (heat - 0.25) / 0.30);
        } else if (heat < 0.80) {
          surfaceColor = mixColor(deepOrange, plasmaGold, (heat - 0.55) / 0.25);
        } else {
          surfaceColor = mixColor(plasmaGold, hotGranule, (heat - 0.80) / 0.20);
        }

        relief += broad * 0.0036 + turbulentFold * 0.0025 + fine * 0.0009 -
          branchingChannel * 0.0014 + activity * 0.0018;
      } else {'''
    text = text[:solar_mode_start] + solar_surface + text[outer_else + len("\n      } else {"):]

    lunar_else_start = text.index("      } else {", solar_mode_start)
    radial_start = text.index("\n      }\n\n      const radial = radius * relief;", lunar_else_start)
    lunar_surface = r'''      } else {
        const macroTerrain = deterministicField(nx, ny, nz, 2.25, 1.43);
        const highlandTerrain = deterministicField(nx, ny, nz, 5.1, 0.39);
        const fineTerrain = deterministicField(nx, ny, nz, 16.2, 2.07);
        const crater = craterField(nx, ny, nz);
        const maria = regionField(lunarMaria, nx, ny, nz, 0.83);
        const plains = regionField(lunarPlains, nx, ny, nz, 2.19);
        const calmTerrain = clamp(Math.max(plains, maria * 0.66), 0, 1);
        const roughnessScale = 1 - calmTerrain * 0.74;
        const light = normalizeVector([-0.62, 0.22, 0.75]);
        const illumination = nx * light[0] + ny * light[1] + nz * light[2];
        const terminator = 0.17 + 0.83 * smoothTransition(-0.22, 0.22, illumination);
        const highlands = smoothTransition(
          -0.18,
          0.40,
          macroTerrain + highlandTerrain * 0.34 + crater.albedo * 0.62
        ) * (1 - maria * 0.78);
        const neutralAlbedo = clamp(
          0.57 + highlands * 0.23 - maria * 0.25 + plains * 0.045 +
          macroTerrain * 0.045 + crater.albedo * 0.39,
          0.20,
          0.95
        );
        const reliefLighting = clamp(
          0.84 + macroTerrain * 0.055 + highlandTerrain * 0.075 * roughnessScale +
          fineTerrain * 0.024 * roughnessScale + crater.albedo * 0.30 - crater.basin * 0.055,
          0.58,
          1.10
        );
        const shade = clamp(
          neutralAlbedo * (0.35 + terminator * 0.65) * reliefLighting,
          0.060,
          1.0
        );
        const selectedRimHighlight = clamp(crater.albedo, 0, 1) * terminator * 0.035;
        const reflectedCoolTint = (1 - terminator) * 0.006;
        relief += macroTerrain * 0.0042 + highlandTerrain * 0.0056 * roughnessScale +
          fineTerrain * 0.0016 * roughnessScale + crater.relief * (1 - maria * 0.22);
        surfaceColor = [
          clamp(shade * 1.018 + selectedRimHighlight, 0, 1),
          clamp(shade * 1.012 + selectedRimHighlight * 0.92, 0, 1),
          clamp(shade + selectedRimHighlight * 0.82 + reflectedCoolTint, 0, 1)
        ];'''
    text = text[:lunar_else_start] + lunar_surface + text[radial_start:]

    old_rotation = '''        if (state.reducedMotion) {
          node.transform.rx = 0;
          node.transform.ry = 0;
          node.transform.rz = 0;

          return;
        }

        node.transform.rz +=
'''
    new_rotation = '''        /* CP5_FINAL_SOLAR_NO_LOCAL_RIGID_SPIN */
        if (state.reducedMotion || node.id === "test") {
          node.transform.rx = 0;
          node.transform.ry = 0;
          node.transform.rz = 0;

          return;
        }

        node.transform.rz +=
'''
    text = replace_once(text, old_rotation, new_rotation, "SOLAR_LOCAL_ROTATION")

    old_bloom = '''    const bloomDisabled =
      state.compositorFrame
        .viewport
        .cssWidth <=
      QUALITY.bloomDisableWidthPx;
'''
    new_bloom = '''    const bloomDisabled =
      state.compositorFrame
        .viewport
        .cssWidth <=
      QUALITY.bloomDisableWidthPx;

    /* CP5_FINAL_SOLAR_PHONE_GLOW_PRESERVATION */
    const solarMaterial =
      materialName === "AUTHORITY_SOLAR";
'''
    text = replace_once(text, old_bloom, new_bloom, "SOLAR_PHONE_GLOW_DECLARATION")

    old_halo_uniform = '''    gl.uniform1f(
      renderer.uniforms.haloStrength,
      bloomDisabled
        ? 0
        : material.halo *
          haloStrength
    );
'''
    new_halo_uniform = '''    gl.uniform1f(
      renderer.uniforms.haloStrength,
      bloomDisabled && !solarMaterial
        ? 0
        : material.halo *
          haloStrength
    );
'''
    text = replace_once(text, old_halo_uniform, new_halo_uniform, "SOLAR_PHONE_GLOW_UNIFORM")

    PRODUCT.write_text(text)
    run("node", "--check", str(PRODUCT))

    required = [
        MARKER,
        "CP5_FINAL_LUNAR_CRATER_HIERARCHY_AND_MARIA",
        "CP5_FINAL_SOLAR_OPEN_BRANCHING_BASE",
        "CP5_FINAL_SOLAR_NO_LOCAL_RIGID_SPIN",
        "CP5_FINAL_SOLAR_PHONE_GLOW_PRESERVATION",
    ]
    for token in required:
        if token not in text:
            raise RuntimeError(f"REQUIRED_TOKEN_MISSING:{token}")

    if "gatewayBodyScale:\n    0.7666667" not in text:
        raise RuntimeError("BODY_SCALE_CHANGED")
    for value in ("1.68", "1.5008", "1.2992"):
        if value not in text:
            raise RuntimeError(f"RADIUS_MISSING:{value}")

    base_raf = output("bash", "-lc", f"git show {BASE_MAIN}:laws/index.crystals.js | grep -o requestAnimationFrame | wc -l")
    candidate_raf = output("bash", "-lc", "grep -o requestAnimationFrame laws/index.crystals.js | wc -l")
    if base_raf != candidate_raf:
        raise RuntimeError(f"RENDER_LOOP_COUNT_CHANGED:{base_raf}:{candidate_raf}")

    run("git", "diff", "--check", "--", str(PRODUCT))
    changed = output("git", "diff", "--name-only")
    if changed != "laws/index.crystals.js":
        raise RuntimeError(f"UNEXPECTED_BUILD_SCOPE:{changed}")

    run("git", "config", "user.name", "github-actions[bot]")
    run("git", "config", "user.email", "41898282+github-actions[bot]@users.noreply.github.com")
    run("git", "add", str(PRODUCT))
    run("git", "commit", "-m", "Naturalize final Laws Sun and Moon expression")
    run("git", "push", "origin", f"HEAD:{BRANCH}")


def verify_static() -> dict[str, object]:
    head = output("git", "rev-parse", "HEAD")
    crystal_blob = output("git", "hash-object", str(PRODUCT))
    interactions_blob = output("git", "hash-object", "laws/index.interactions.js")
    if interactions_blob != "be365cc331ee5643f916abee204d4f5f45376c04":
        raise RuntimeError("INTERACTIONS_BLOB_CHANGED")

    actual = sorted(output("git", "diff", "--name-only", BASE_MAIN, head).splitlines())
    expected = sorted([
        ".github/workflows/laws-cp5-final-celestial-naturalization.yml",
        "laws/index.crystals.js",
        "verification/laws-cp5-final-celestial-naturalization.py",
    ])
    if actual != expected:
        raise RuntimeError(f"EXACT_SCOPE_INVALID:{actual}")

    run("node", "--check", str(PRODUCT))
    run("git", "diff", "--check", BASE_MAIN, head)
    text = PRODUCT.read_text()
    for token in (
        MARKER,
        "CP5_FINAL_LUNAR_CRATER_HIERARCHY_AND_MARIA",
        "CP5_FINAL_SOLAR_OPEN_BRANCHING_BASE",
        "CP5_FINAL_SOLAR_NO_LOCAL_RIGID_SPIN",
        "CP5_FINAL_SOLAR_PHONE_GLOW_PRESERVATION",
    ):
        if token not in text:
            raise RuntimeError(f"STATIC_TOKEN_MISSING:{token}")

    base_raf = output("bash", "-lc", f"git show {BASE_MAIN}:laws/index.crystals.js | grep -o requestAnimationFrame | wc -l")
    candidate_raf = output("bash", "-lc", "grep -o requestAnimationFrame laws/index.crystals.js | wc -l")
    if base_raf != candidate_raf:
        raise RuntimeError("NEW_RENDER_LOOP_DETECTED")

    return {
        "head": head,
        "crystalBlob": crystal_blob,
        "interactionsBlob": interactions_blob,
        "actualChangedPaths": actual,
        "newRenderLoop": False,
    }


NODE_VERIFIER = r'''import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import puppeteer from 'puppeteer-core';
import { PNG } from 'pngjs';

const ORIGIN='http://127.0.0.1:4173';
const HEAD=process.env.EXECUTION_COMMIT;
const CRYSTAL=process.env.EXPECTED_CRYSTAL;
const OUT='laws-cp5-final-celestial-receipt.json';
const SHOTS='laws-cp5-final-celestial-evidence';
const profiles=[
  {id:'SAMSUNG_PHONE_PORTRAIT',width:430,height:932,mobile:true,motion:true},
  {id:'PHONE_LANDSCAPE',width:932,height:430,mobile:true,motion:false},
  {id:'TABLET',width:1024,height:1366,mobile:true,motion:true},
  {id:'DESKTOP',width:1440,height:1000,mobile:false,motion:false}
];
const ids=['flow','integrity','reality','structure','test','research'];
const h=Math.SQRT1_2;
const quaternions={flow:[0,0,0,1],integrity:[0,0,h,h],reality:[0,0,1,0],structure:[0,0,-h,h],test:[-0.43283662594337136,0,0,0.9014723818520222],research:[0.9014723818520223,0,0,0.4328366259433712]};
const failures=[];
const observations=[];
const motionEvidence=[];
const sleep=ms=>new Promise(resolve=>setTimeout(resolve,ms));
const assert=(value,id,profile,observed=null)=>{if(!value)failures.push({profile,id,observed});};
fs.rmSync(SHOTS,{recursive:true,force:true});
fs.mkdirSync(SHOTS,{recursive:true});

async function snapshot(page){
  return page.evaluate(()=>{
    const visible=element=>{
      if(!element||element.hidden)return false;
      const style=getComputedStyle(element),rect=element.getBoundingClientRect();
      return style.display!=='none'&&style.visibility!=='hidden'&&Number(style.opacity||1)>0.01&&rect.width>0&&rect.height>0;
    };
    const root=document.querySelector('[data-laws-root]');
    const frame=globalThis.DGB_LAWS_CONTROLLER?.getFrameState?.()||null;
    const labels=[...document.querySelectorAll('[data-laws-projected-category-label]')];
    const categories=[...document.querySelectorAll('[data-laws-category]')];
    const center=document.querySelector('[data-upstream-compass-control]');
    const centerBox=center?.getBoundingClientRect?.();
    return {
      state:root?.dataset.lawsControllerState||'',
      primary:root?.dataset.lawsSpatialPrimaryId||frame?.orbitFocus||'',
      cluster:root?.dataset.lawsActiveCluster||frame?.activeClusterDirection||frame?.cluster?.direction||'',
      crystals:globalThis.DGB_LAWS_CRYSTALS_RECEIPT||null,
      compositor:globalThis.DGB_LAWS_COMPOSITOR_RECEIPT||null,
      interactions:globalThis.DGB_LAWS_INTERACTIONS_RECEIPT||null,
      categoryIds:categories.map(element=>element.dataset.direction).filter(Boolean).sort(),
      visibleLabels:labels.filter(visible).map(element=>element.dataset.direction||''),
      centerReachable:Boolean(center&&centerBox&&centerBox.width>0&&centerBox.height>0&&center.dataset.interactionEnabled!=='false'),
      globePresent:Boolean(document.querySelector('[data-upstream-compass-mount]')&&document.querySelector('[data-laws-planet-world-pass-participant]')),
      childRoutes:[...document.querySelectorAll('[data-route][data-direction]')].filter(element=>!element.hasAttribute('data-laws-category')).map(element=>element.dataset.route).filter(Boolean),
      overflow:document.documentElement.scrollWidth-document.documentElement.clientWidth
    };
  });
}

async function setPrimary(page,id){
  const result=await page.evaluate((authorityId,q)=>{
    const controller=globalThis.DGB_LAWS_CONTROLLER;
    const inferred=globalThis.DGB_LAWS_INTERACTIONS?.primaryDirectionForQuaternion?.(q)||'';
    const begun=controller?.beginOrbitGesture?.()!==false;
    const preview=begun&&controller?.requestOrbitPreview?.({quaternion:q,primaryId:authorityId})!==false;
    const committed=preview&&controller?.requestOrbitCommit?.()!==false;
    return {inferred,begun,preview,committed};
  },id,quaternions[id]);
  await page.waitForFunction(authorityId=>{
    const root=document.querySelector('[data-laws-root]');
    const frame=globalThis.DGB_LAWS_CONTROLLER?.getFrameState?.();
    return (root?.dataset.lawsSpatialPrimaryId||frame?.orbitFocus||'')===authorityId;
  },{timeout:15000},id);
  await sleep(320);
  return result;
}

async function openCluster(page,id){
  const accepted=await page.evaluate(authorityId=>globalThis.DGB_LAWS_CONTROLLER?.requestCategorySelection?.(authorityId),id);
  await page.waitForFunction(authorityId=>{
    const root=document.querySelector('[data-laws-root]');
    const frame=globalThis.DGB_LAWS_CONTROLLER?.getFrameState?.();
    return root?.dataset.lawsControllerState==='CLUSTER_OPEN'&&(root?.dataset.lawsActiveCluster===authorityId||frame?.activeClusterDirection===authorityId||frame?.cluster?.direction===authorityId);
  },{timeout:15000},id);
  await sleep(220);
  return accepted;
}

async function returnHome(page){
  await page.evaluate(()=>globalThis.DGB_LAWS_CONTROLLER?.requestReturnToConstellation?.());
  await page.waitForFunction(()=>document.querySelector('[data-laws-root]')?.dataset.lawsControllerState==='CONSTELLATION',{timeout:15000});
  await sleep(220);
}

async function authorityBox(page,id){
  return page.evaluate(authorityId=>{
    const element=document.querySelector(`[data-laws-category][data-direction="${authorityId}"]`);
    const rect=element?.getBoundingClientRect?.();
    return rect?{x:rect.left,y:rect.top,width:rect.width,height:rect.height}:null;
  },id);
}

function clipFromBox(box,viewport,size=280){
  const cropSize=Math.min(size,viewport.width,viewport.height);
  const center=box?{x:box.x+box.width/2,y:box.y+box.height/2}:{x:viewport.width/2,y:viewport.height/2};
  return {
    x:Math.max(0,Math.min(viewport.width-cropSize,center.x-cropSize/2)),
    y:Math.max(0,Math.min(viewport.height-cropSize,center.y-cropSize/2)),
    width:cropSize,
    height:cropSize
  };
}

async function cropAuthority(page,id,file,size=280){
  const box=await authorityBox(page,id);
  const clip=clipFromBox(box,page.viewport(),size);
  await page.screenshot({path:path.join(SHOTS,file),clip});
  return {box,clip};
}

function meanPixelDelta(aBuffer,bBuffer){
  const a=PNG.sync.read(aBuffer),b=PNG.sync.read(bBuffer);
  if(a.width!==b.width||a.height!==b.height)return null;
  let total=0,count=0;
  for(let index=0;index<a.data.length;index+=4){
    total+=Math.abs(a.data[index]-b.data[index]);
    total+=Math.abs(a.data[index+1]-b.data[index+1]);
    total+=Math.abs(a.data[index+2]-b.data[index+2]);
    count+=3;
  }
  return total/count;
}

const browser=await puppeteer.launch({executablePath:process.env.CHROME_PATH,headless:'new',args:['--no-sandbox','--disable-setuid-sandbox','--disable-dev-shm-usage','--enable-webgl','--ignore-gpu-blocklist','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
for(const profile of profiles){
  let page=null;
  const telemetry={pageErrors:[],consoleErrors:[],requestFailures:[],httpErrors:[]};
  const observation={profile:profile.id,initial:null,primaryStates:[],clusters:[],telemetry};
  try{
    page=await browser.newPage();
    await page.setViewport({width:profile.width,height:profile.height,deviceScaleFactor:1,isMobile:profile.mobile,hasTouch:profile.mobile});
    page.on('pageerror',error=>telemetry.pageErrors.push(String(error?.stack||error)));
    page.on('console',message=>{if(message.type()==='error'&&!message.text().includes('Failed to load resource: the server responded with a status of 404'))telemetry.consoleErrors.push(message.text());});
    page.on('requestfailed',request=>{if(!request.url().endsWith('/favicon.ico'))telemetry.requestFailures.push({url:request.url(),error:request.failure()?.errorText||''});});
    page.on('response',response=>{if(response.status()>=400&&!response.url().endsWith('/favicon.ico'))telemetry.httpErrors.push({url:response.url(),status:response.status()});});
    const response=await page.goto(`${ORIGIN}/laws/?cp5final=${HEAD}`,{waitUntil:'domcontentloaded',timeout:45000});
    await page.waitForFunction(()=>Boolean(globalThis.DGBLawsStagedLoader&&globalThis.DGB_LAWS_CONTROLLER),{timeout:20000});
    await page.evaluate(async()=>{await globalThis.DGBLawsStagedLoader.loadOrbitSystems();await globalThis.DGBLawsStagedLoader.loadInteractionSystems();});
    await page.waitForFunction(()=>{
      const crystals=globalThis.DGB_LAWS_CRYSTALS_RECEIPT;
      const compositor=globalThis.DGB_LAWS_COMPOSITOR_RECEIPT;
      const interactions=globalThis.DGB_LAWS_INTERACTIONS_RECEIPT;
      return crystals?.status==='available'&&crystals?.rendererInitialized===true&&compositor?.initialized===true&&interactions?.initialized===true;
    },{timeout:30000});
    await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));
    observation.initial=await snapshot(page);
    assert([200,304].includes(response?.status()),'ROUTE_STATUS_INVALID',profile.id,response?.status());
    assert(observation.initial.crystals?.status==='available'&&observation.initial.crystals?.rendererInitialized===true,'CRYSTALS_RUNTIME_UNAVAILABLE',profile.id,observation.initial.crystals);
    assert(observation.initial.compositor?.initialized===true,'COMPOSITOR_RUNTIME_UNAVAILABLE',profile.id,observation.initial.compositor);
    assert(observation.initial.interactions?.initialized===true,'INTERACTIONS_RUNTIME_UNAVAILABLE',profile.id,observation.initial.interactions);
    assert(JSON.stringify(observation.initial.categoryIds)===JSON.stringify([...ids].sort()),'SIX_AUTHORITIES_INVALID',profile.id,observation.initial.categoryIds);
    assert(observation.initial.visibleLabels.length===1,'INITIAL_SINGLE_LABEL_INVALID',profile.id,observation.initial.visibleLabels);
    assert(observation.initial.centerReachable&&observation.initial.globePresent,'CENTER_GLOBE_INVALID',profile.id,observation.initial);
    assert(new Set(observation.initial.childRoutes).size===24,'CHILD_ROUTE_SET_INVALID',profile.id,observation.initial.childRoutes);
    assert(observation.initial.overflow<=1,'HORIZONTAL_OVERFLOW',profile.id,observation.initial.overflow);
    await page.screenshot({path:path.join(SHOTS,`${profile.id.toLowerCase()}-full-compass.png`),fullPage:false});

    for(const id of ids){
      const orientation=await setPrimary(page,id);
      const state=await snapshot(page);
      observation.primaryStates.push({id,orientation,visibleLabels:state.visibleLabels});
      assert(orientation.inferred===id&&orientation.committed,'PRIMARY_ORIENTATION_INVALID',profile.id,{id,orientation});
      assert(state.visibleLabels.length===1&&state.visibleLabels[0]===id,'SINGLE_LABEL_TRANSITION_INVALID',profile.id,{id,visibleLabels:state.visibleLabels});
    }

    await setPrimary(page,'test');
    await page.screenshot({path:path.join(SHOTS,`${profile.id.toLowerCase()}-test-primary.png`),fullPage:false});
    await cropAuthority(page,'test',`${profile.id.toLowerCase()}-sun-crop.png`);

    if(profile.motion){
      await sleep(400);
      const buffers=[];
      const centers=[];
      const frames=[];
      for(let frame=0;frame<5;frame+=1){
        if(frame>0)await sleep(700);
        const box=await authorityBox(page,'test');
        const clip=clipFromBox(box,page.viewport(),280);
        const buffer=await page.screenshot({clip});
        fs.writeFileSync(path.join(SHOTS,`${profile.id.toLowerCase()}-sun-motion-${String(frame).padStart(2,'0')}.png`),buffer);
        buffers.push(buffer);
        centers.push(box?{x:box.x+box.width/2,y:box.y+box.height/2}:null);
        frames.push({frame,elapsedMs:frame*700});
      }
      const deltas=[];
      for(let index=1;index<buffers.length;index+=1)deltas.push(meanPixelDelta(buffers[index-1],buffers[index]));
      const finiteDeltas=deltas.filter(value=>Number.isFinite(value));
      const meanMotion=finiteDeltas.length?finiteDeltas.reduce((sum,value)=>sum+value,0)/finiteDeltas.length:0;
      const validCenters=centers.filter(Boolean);
      const centerDrift=validCenters.length?Math.max(...validCenters.map(center=>Math.hypot(center.x-validCenters[0].x,center.y-validCenters[0].y))):null;
      motionEvidence.push({profile:profile.id,frames,deltas,meanMotion,centers,centerDrift,settledCamera:true,sourceLocalRigidSpinDisabled:true});
      assert(meanMotion>0.45,'SOLAR_INTERNAL_EVOLUTION_NOT_MEASURABLE',profile.id,{deltas,meanMotion});
      assert(Number.isFinite(centerDrift)&&centerDrift<=4.0,'SOLAR_SETTLED_VIEW_DRIFT_EXCESSIVE',profile.id,{centerDrift,centers});
    }

    await setPrimary(page,'research');
    await page.screenshot({path:path.join(SHOTS,`${profile.id.toLowerCase()}-research-primary.png`),fullPage:false});
    await cropAuthority(page,'research',`${profile.id.toLowerCase()}-moon-crop.png`);
    await cropAuthority(page,'test',`${profile.id.toLowerCase()}-sun-nonprimary.png`);

    for(const id of ['test','research']){
      await setPrimary(page,id);
      const accepted=await openCluster(page,id);
      const state=await snapshot(page);
      observation.clusters.push({id,accepted,state:state.state,cluster:state.cluster});
      assert(accepted!==false&&state.state==='CLUSTER_OPEN'&&state.cluster===id,'CLUSTER_OPEN_INVALID',profile.id,{id,accepted,state});
      await returnHome(page);
    }

    assert(telemetry.pageErrors.length===0&&telemetry.consoleErrors.length===0&&telemetry.requestFailures.length===0&&telemetry.httpErrors.length===0,'ACTIONABLE_BROWSER_ERRORS',profile.id,telemetry);
  }catch(error){
    failures.push({profile:profile.id,id:'PROFILE_EXECUTION_ABORTED',observed:String(error?.stack||error),telemetry});
    try{await page?.screenshot({path:path.join(SHOTS,`${profile.id.toLowerCase()}-failure.png`),fullPage:true});}catch{}
  }finally{
    observations.push(observation);
    await page?.close().catch(()=>{});
  }
}
await browser.close();

const screenshotManifest=fs.readdirSync(SHOTS).sort().map(file=>{
  const full=path.join(SHOTS,file);
  return {file,bytes:fs.statSync(full).size,sha256:crypto.createHash('sha256').update(fs.readFileSync(full)).digest('hex')};
});
const receipt={
  checkpoint:'LAWS_CHAMBER_CHECKPOINT_5',
  phase:'CP5_FINAL_CELESTIAL_NATURALIZATION_EXACT_HEAD_VERIFICATION',
  baseMain:'b7bd810a359af9d939b91dbac5b9794ce7da5d1e',
  candidateHead:HEAD,
  crystalBlob:CRYSTAL,
  profiles:profiles.map(profile=>profile.id),
  sourceContracts:{
    moonCraterHierarchy:true,
    moonPlainsAndMaria:true,
    solarOpenBranchingBase:true,
    solarInternalAdvection:true,
    solarCollisionAndShear:true,
    solarTemporaryRings:true,
    solarLocalRigidSpinDisabled:true,
    solarPhoneGlowPreserved:true,
    existingRendererTimeAuthority:true,
    newRenderLoop:false
  },
  observations,
  motionEvidence,
  screenshotManifest,
  failures,
  pass:failures.length===0,
  physicalAcceptance:'NOT_CLAIMED'
};
fs.writeFileSync(OUT,JSON.stringify(receipt,null,2)+'\n');
console.log(JSON.stringify({pass:receipt.pass,failures:failures.length,profiles:observations.length,motionProfiles:motionEvidence.length,screenshots:screenshotManifest.length},null,2));
if(!receipt.pass)process.exitCode=2;
'''


def verify_browser(static: dict[str, object]) -> dict[str, object]:
    server_log = pathlib.Path("/tmp/laws-cp5-final-server.log")
    with server_log.open("w") as handle:
        server = subprocess.Popen(
            [sys.executable, "-m", "http.server", "4173"],
            cwd=REPO,
            stdout=handle,
            stderr=subprocess.STDOUT,
            text=True,
        )
    try:
        ready = False
        for _ in range(40):
            probe = subprocess.run(
                ["curl", "-fsS", "http://127.0.0.1:4173/laws/"],
                cwd=REPO,
                stdout=subprocess.DEVNULL,
                stderr=subprocess.DEVNULL,
            )
            if probe.returncode == 0:
                ready = True
                break
            time.sleep(0.5)
        if not ready:
            raise RuntimeError("LOCAL_RUNTIME_UNAVAILABLE")

        verifier = pathlib.Path("/tmp/laws-cp5-final-verifier.mjs")
        verifier.write_text(NODE_VERIFIER)
        env = os.environ.copy()
        env["EXECUTION_COMMIT"] = str(static["head"])
        env["EXPECTED_CRYSTAL"] = str(static["crystalBlob"])
        result = run("node", str(verifier), check=False, capture=True, env=env)
        print(result.stdout)
        if result.stderr:
            print(result.stderr, file=sys.stderr)
        if result.returncode != 0:
            raise RuntimeError(f"BROWSER_VERIFICATION_FAILED:{result.returncode}")
    finally:
        server.terminate()
        try:
            server.wait(timeout=5)
        except subprocess.TimeoutExpired:
            server.kill()

    receipt_path = REPO / "laws-cp5-final-celestial-receipt.json"
    receipt = json.loads(receipt_path.read_text())
    if not receipt.get("pass") or receipt.get("failures"):
        raise RuntimeError(f"RECEIPT_FAILURES:{receipt.get('failures')}")
    if len(receipt.get("observations", [])) != 4:
        raise RuntimeError("PROFILE_COUNT_INVALID")
    if len(receipt.get("motionEvidence", [])) != 2:
        raise RuntimeError("MOTION_PROFILE_COUNT_INVALID")
    if len(receipt.get("screenshotManifest", [])) < 34:
        raise RuntimeError("EVIDENCE_SET_INCOMPLETE")
    return receipt


def main() -> int:
    build_candidate()
    static = verify_static()
    receipt = verify_browser(static)
    summary = {
        "candidateHead": static["head"],
        "crystalBlob": static["crystalBlob"],
        "actualChangedPaths": static["actualChangedPaths"],
        "motionEvidence": receipt["motionEvidence"],
        "screenshots": len(receipt["screenshotManifest"]),
        "failures": receipt["failures"],
        "pass": receipt["pass"],
    }
    pathlib.Path("laws-cp5-final-celestial-summary.json").write_text(json.dumps(summary, indent=2) + "\n")
    print(json.dumps(summary, indent=2))
    return 0


if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except Exception as error:
        failure = {
            "classification": "HARNESS_OR_PRODUCT_REQUIRES_LOG_CLASSIFICATION",
            "error": f"{type(error).__name__}:{error}",
        }
        pathlib.Path("laws-cp5-final-celestial-failure.json").write_text(json.dumps(failure, indent=2) + "\n")
        print(json.dumps(failure, indent=2), file=sys.stderr)
        raise
