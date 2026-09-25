# H-Earth Depth Rendering Authority Audit v1

Status: FROZEN READ-ONLY AUDIT

## Active depth channels in R3C

1. **Vertex normals are present and consumed.**
   - GPU attribute location 1 carries canonical normals.
   - Fragment shader normalizes vNormal and computes one Lambert term against uSunDirection.

2. **Lighting exists but is minimal.**
   - Ambient term is hard-coded: 0.30 + 0.08 * max(normal.y, 0).
   - Direct diffuse is Lambert only: max(dot(normal, lightDirection), 0).
   - Direct contribution multiplier is sunIntensity * 0.72.
   - No secondary/bounce illumination, hemispheric terrain light, specular response, Fresnel, micro-normal response, or cast/self shadow term exists.

3. **Material parameter data is uploaded but unused by the active fragment shader.**
   - vMaterialParameters is declared and transported.
   - vMaterialModelCode and vSurfaceClassCode are transported.
   - Active FS does not use any of them in shading.
   - Consequently roughness/material class cannot presently alter light response.

4. **Base color dominates surface appearance.**
   - lit = baseColor * scalar illumination * sunColor * roleBias.
   - This makes large same-color terrain regions read as broad uniform sheets whenever normals vary slowly.

5. **Atmospheric depth exists.**
   - Distance fog uses fogStartDistance, fogFalloff, maximumFogFactor.
   - Fog drives distance desaturation.
   - Fog mixes sky/zenith atmosphere and ground haze.
   - R3A already naturalizes sky/horizon/haze colors and attenuates fog/desaturation strength.

6. **Atmospheric depth is distance-only, not terrain-aware.**
   - No height fog, horizon extinction, aerial perspective by view angle, or terrain occlusion contribution exists.

7. **No shadow channel exists.**
   - No shadow map, horizon shadow, screen-space contact shadow, or terrain self-occlusion term is present.
   - The depth texture is generated for diagnostic visualization, not used by the color shader for depth cues.

8. **No micro/meso normal channel exists.**
   - The shader uses only mesh vertex normals.
   - Therefore a broad slowly changing triangle field receives broad slowly changing illumination even if the material semantically represents soil/rock/grass.

9. **Antialiasing is disabled.**
   - WebGL2 context requests antialias:false.
   - Offscreen color/depth textures use NEAREST filtering.
   - This contributes to visibly hard/stair-stepped silhouettes but is not the source of terrain morphology.

## Authority finding

The renderer already has enough inputs to support a bounded depth upgrade without changing geography:
- world position
- mesh normal
- base color
- material parameters
- material model code
- surface class code
- camera position
- sun direction/intensity/color
- atmospheric colors and distance controls
- depth buffer

The largest unused depth opportunity is **material-aware normal/light response**. Material parameters and classes are already transported but ignored.

## Depth Pass D1 construction law

D1 may change presentation shading only. It must not change terrain XYZ, topology, canonical geography, navigation, coastline identity, or camera authority.

D1 should:
1. preserve current Lambert direct light but add bounded hemispheric ambient response;
2. consume existing material roughness/parameter channels rather than ignoring them;
3. add deterministic world-position-based micro-normal modulation for terrain classes only, with amplitude bounded so silhouettes and geography do not move;
4. add bounded slope/rock contrast from existing normals/material class;
5. strengthen aerial perspective progressively with distance while preserving near-field color;
6. add a cheap bounded contact/concavity cue only if derivable without new geography authority;
7. retain the existing immutable package and draw ranges.

D1 must NOT:
- alter vertex positions;
- invent new terrain elevation;
- use post-package topology subdivision;
- conceal coastline defects with fog;
- add textures/assets before the depth baseline is qualified;
- merge to production before immutable physical inspection.

## Separate unresolved lane

Coastline terracing remains a representation-resolution defect and is not authorized for repair inside D1.
