/* /laws/index.crystals.js
   Laws-owned exact two-object reconciliation.
   Page identity remains Laws-owned: controller, compositor, planet,
   semantic records, labels, palettes, content, and routes are retained.
   Four existing Law stars retain baseline meshes, materials, scales, and positions.
   Test and Research share one sphere topology at opposed depth poles.
*/

(() => {
  "use strict";

  const CONTRACT = Object.freeze({
    id:
      "DGB_LAWS_CRYSTALS_EXACT_TWO_OBJECT_RECONCILIATION_v2",

    version:
      "2.3.1-cp5-final-public-moon-definition",

    file:
      "/laws/index.crystals.js",

    controllerModuleId:
      "DGB_LAWS_CONTROLLER",

    controllerModuleVersion:
      "1.0.0-law-compass-controller-authority",

    compositorModuleId:
      "DGB_LAWS_COMPOSITOR",

    compositorModuleVersion:
      "1.0.0-camera-depth-layer-orchestration",

    planetParticipantModuleId:
      "DGB_LAWS_PLANET_WORLD_PARTICIPANT",

    planetParticipantModuleVersion:
      "1.0.0-laws-world-pass-participant",

    planetParticipantNodeType:
      "compass-planet",

    planetParticipantNodeId:
      "main-compass-planet",

    visualPassClaimed:
      false,

    productionAuthorized:
      false,

    deploymentAuthorized:
      false,

    crystalsContainLawContent:
      false,

    crystalsOwnPlanetAuthority:
      false
  });

  const CARDINAL_IDS = Object.freeze([
    "flow",
    "integrity",
    "reality",
    "structure"
  ]);

  const GATEWAY_IDS = Object.freeze(["test", "research"]);
  const DIRECTIONS = Object.freeze([...CARDINAL_IDS, ...GATEWAY_IDS]);
  const AUXILIARY_IDS = Object.freeze([]);

  const NODE_TYPES = Object.freeze({
    CATEGORY:
      "category",

    LAW:
      "law",

    MEMBER:
      "member",

    AUXILIARY:
      "auxiliary",

    PLANET:
      "compass-planet"
  });

  const SCENE_PROJECTIONS = Object.freeze({
    CONSTELLATION:
      "CONSTELLATION",

    CLUSTER:
      "CLUSTER",

    HELD:
      "HELD"
  });

  const DEPTH_LAYERS = Object.freeze({
    FRONT:
      "FRONT",

    REAR:
      "REAR"
  });

  const SPHERE = Object.freeze({
  coordinateSystem:
    "RIGHT_HANDED_EUCLIDEAN_XYZ",

  orientationRepresentation:
    "UNIT_QUATERNION",

  constellation:
    Object.freeze({
      horizontalRadius:
        1.68,

      verticalRadius:
        1.5008,

      depthRadius:
        1.2992,

      primaryAnchor:
        Object.freeze([
          0,
          0.78,
          0.625
        ]),

      vectors:
        Object.freeze({
          flow: Object.freeze([0, 1, 0]),
          integrity: Object.freeze([1, 0, 0]),
          reality: Object.freeze([0, -1, 0]),
          structure: Object.freeze([-1, 0, 0]),
          test: Object.freeze([0, 0, 1]),
          research: Object.freeze([0, 0, -1])
        })
    }),

  cluster:
    Object.freeze({
      model:
        "CANONICAL_MAIN_SPHERICAL_XYZ_CLUSTER",

      memberCount:
        4,

      horizontalRadius:
        1.36,

      verticalRadius:
        1.18,

      depthRadius:
        1.04,

      primaryAnchor:
        Object.freeze([
          0,
          0.70,
          0.714
        ]),

      latitudeAmplitude:
        0.48,

      latitudeFrequency:
        1.73,

      projectedClearanceMarginPx:
        8
    })
});

  const QUALITY = Object.freeze({
  categorySegments:
    8,

  lawSegments:
    6,

  categoryScale:
    0.96,

  focusedCategoryScale:
    1.30,

  auxiliaryScale:
    1.10,

  gatewayBodyScale:
    0.7666667,

  lawScale:
    0.88,

  primaryLawScale:
    1.12,

  selectedLawScale:
    1.18,

  visualSettleSpeed:
    7.4,

  transformSettleSpeed:
    6.2,

  maximumDeltaSeconds:
    0.05,

  maximumYaw:
    0.22,

  maximumPitch:
    0.14,

  bloomDisableWidthPx:
    420,

  normalEpsilon:
    1e-7,

  projectionVisibilityThreshold:
    0.08
});

  const PALETTE = Object.freeze({
    flow:
      Object.freeze([
        0.79,
        0.84,
        1.0
      ]),

    integrity:
      Object.freeze([
        0.48,
        0.88,
        0.96
      ]),

    reality:
      Object.freeze([
        1.0,
        0.73,
        0.42
      ]),

    structure:
      Object.freeze([
        0.98,
        0.58,
        0.40
      ]),

    test:
      Object.freeze([
        1.0,
        0.92,
        0.48
      ]),

    research:
      Object.freeze([
        0.82,
        0.83,
        0.86
      ]),

    lawFlow:
      Object.freeze([
        0.72,
        0.80,
        1.0
      ]),

    lawIntegrity:
      Object.freeze([
        0.44,
        0.82,
        0.92
      ]),

    lawReality:
      Object.freeze([
        0.98,
        0.68,
        0.38
      ]),

    lawStructure:
      Object.freeze([
        0.94,
        0.52,
        0.34
      ])
  });

  const MATERIALS = Object.freeze({
    CATEGORY_IDLE:
      Object.freeze({
        specular:
          1.18,
        rim:
          1.02,
        emissive:
          0.17,
        alpha:
          0.90,
        sparkle:
          0.26,
        halo:
          0.82,
        contrast:
          1.16
      }),
    CATEGORY_FOCUSED:
      Object.freeze({
        specular:
          1.50,
        rim:
          1.30,
        emissive:
          0.24,
        alpha:
          0.96,
        sparkle:
          0.36,
        halo:
          1.18,
        contrast:
          1.24
      }),
    AUTHORITY_IDLE:
      Object.freeze({
        specular:
          1.58,
        rim:
          1.36,
        emissive:
          0.27,
        alpha:
          0.98,
        sparkle:
          0.42,
        halo:
          1.24,
        contrast:
          1.34
      }),
    AUTHORITY_SOLAR:
      Object.freeze({specular:0.03,rim:0.10,emissive:0.22,alpha:1.00,sparkle:0.00,halo:0.78,contrast:1.94}),

    AUTHORITY_LUNAR:
      Object.freeze({specular:0.06,rim:0.14,emissive:0.003,alpha:1.00,sparkle:0.00,halo:0.025,contrast:1.98}),

    LAW_IDLE:
       Object.freeze({
        specular:
          1.04,
        rim:
          0.90,
        emissive:
          0.15,
        alpha:
          0.88,
        sparkle:
          0.22,
        halo:
          0.64,
        contrast:
          1.10
      }),
    LAW_PRIMARY:
      Object.freeze({
        specular:
          1.24,
        rim:
          1.08,
        emissive:
          0.21,
        alpha:
          0.94,
        sparkle:
          0.30,
        halo:
          0.86,
        contrast:
          1.17
      }),
    LAW_SELECTED:
      Object.freeze({
        specular:
          1.34,
        rim:
          1.14,
        emissive:
          0.24,
        alpha:
          0.95,
        sparkle:
          0.34,
        halo:
          0.96,
        contrast:
          1.20
      })
  });

  const RECEIPT = {
    contractId:
      CONTRACT.id,

    contractVersion:
      CONTRACT.version,

    status:
      "pending",

    controllerModuleId:
      "",

    controllerModuleVersion:
      "",

    compositorModuleId:
      "",

    compositorModuleVersion:
      "",

    planetParticipantModuleId:
      "",

    planetParticipantModuleVersion:
      "",

    planetParticipantAvailable:
      false,

    planetParticipantAccepted:
      false,

    planetParticipantNodeAvailable:
      false,

    planetParticipantNodeAdmitted:
      false,

    planetParticipantNodeType:
      CONTRACT.planetParticipantNodeType,

    planetParticipantNodeId:
      CONTRACT.planetParticipantNodeId,

    planetDrawDelegated:
      false,

    planetDrawCallsLastFrame:
      0,

    planetVisibleObjectCount:
      0,

    planetRegistryMember:
      false,

    planetCategoryMember:
      false,

    planetLawMember:
      false,

    planetAuthorityOwned:
      false,

    planetGeometryOwned:
      false,

    planetRotationOwned:
      false,

    rendererInitialized:
      false,

    sceneProjection:
      SCENE_PROJECTIONS.HELD,

    categoryCount:
      0,

    auxiliaryCount:
      0,

    lawCount:
      0,

    memberCount:
      0,

    canonicalSemanticLawCount:
      0,

    canonicalSemanticMemberCount:
      0,

    relocatedCanonicalLawCount:
      0,

    canonicalLawControlsRelocated:
      false,

    rearWebGlInitialized:
      false,

    frontWebGlInitialized:
      false,

    rearDrawCallsLastFrame:
      0,

    frontDrawCallsLastFrame:
      0,

    rearVisibleObjectCount:
      0,

    frontVisibleObjectCount:
      0,

    semanticProjectionRecordCount:
      0,

    semanticProjectionSubmitted:
      false,

    activeClusterDirection:
      "",

    primaryDirection:
      "flow",

    primaryLaw:
      "",

    reducedMotion:
      false,

    generatedLawProxyCount:
      0,

    clonedLawControlCount:
      0,

    pointerInterpreterOwned:
      false,

    swipeInterpreterOwned:
      false,

    clusterExitOwned:
      false,

    semanticInteractionAuthorityOwned:
      false,

    labelPresentationOwned:
      false,

    compassOverlapPolicyOwned:
      false,

    cameraOwned:
      false,

    depthClassificationOwned:
      false,

    layerConstructionOwned:
      false,

    crystalGeometryOwned:
      true,

    semanticAssociationOwned:
      true,

    routeAuthorityOwned:
      false,

    navigationStateOwned:
      false,

    humanLawContentOwned:
      false,

    softwareLawContentOwned:
      false,

    doctrineOwned:
      false,

    visualPassClaimed:
      false
  };

  const state = {
    root:
      null,

    scene:
      null,

    field:
      null,

    semanticLayer:
      null,

    receiptOutput:
      null,

    controller:
      null,

    compositor:
      null,

    planetParticipant:
      null,

    planetNode:
      null,

    planetNodeAdmitted:
      false,

    planetDrawCallsLastFrame:
      0,

    compositorInitializedHere:
      false,

    registry:
      new Map(),

    canonicalLawElements:
      [],

    relocatedLawElements:
      [],

    lawControlSnapshots:
      [],

    renderers:
      new Map(),

    frame:
      null,

    compositorFrame:
      null,

    sceneProjection:
      SCENE_PROJECTIONS.HELD,

    constellationQuaternion:
      [
        0,
        0,
        0,
        1
      ],

    constellationTargetQuaternion:
      [
        0,
        0,
        0,
        1
      ],

    clusterQuaternions:
      new Map(),

    clusterTargetQuaternions:
      new Map(),

    visualPrimaryDirection:
      "flow",

    visualPrimaryLaws:
      new Map(),

    reducedMotion:
      false,

    time:
      0,

    lastTime:
      0,

    raf:
      0,

    running:
      false,

    disposed:
      false
  };

  const vertexShaderSource = `
    precision mediump float;

    attribute vec3 aPosition;
    attribute vec3 aNormal;
    attribute vec3 aColor;

    uniform mat4 uModel;
    uniform mat4 uView;
    uniform mat4 uProjection;
    uniform mat3 uNormalMatrix;
    uniform float uHaloPass;
    uniform float uHaloExpansion;
    uniform float uTime;
    uniform float uSolarBody;

    varying vec3 vNormal;
    varying vec3 vColor;
    varying vec3 vViewPosition;
    varying vec3 vWorldPosition;
    varying float vHaloPass;

    void main() {
      vec3 pos = aPosition;

      if (uHaloPass > 0.5) {
        float expansionScale = 1.0;
        if (uSolarBody > 0.5) {
          vec3 direction = normalize(aPosition);
          float plume =
            sin(direction.x * 8.7 + direction.y * 5.1 + uTime * 0.31) * 0.46 +
            sin(direction.y * 11.3 - direction.z * 6.4 - uTime * 0.23) * 0.32 +
            sin(direction.z * 15.7 + direction.x * 4.9 + uTime * 0.17) * 0.22;
          expansionScale = 0.10 + smoothstep(0.02, 0.76, plume) * 1.76;
        }
        pos += normalize(aNormal) * uHaloExpansion * expansionScale;
      }

      vec4 world = uModel * vec4(pos, 1.0);
      vec4 view = uView * world;

      vNormal = normalize(uNormalMatrix * aNormal);
      vColor = aColor;
      vViewPosition = view.xyz;
      vWorldPosition = world.xyz;
      vHaloPass = uHaloPass;

      gl_Position = uProjection * view;
    }
  `;

  const fragmentShaderSource = `
    precision mediump float;

    varying vec3 vNormal;
    varying vec3 vColor;
    varying vec3 vViewPosition;
    varying vec3 vWorldPosition;
    varying float vHaloPass;

    uniform float uTime;
    uniform float uProminence;
    uniform float uSpecular;
    uniform float uRim;
    uniform float uEmissive;
    uniform float uAlpha;
    uniform float uSparkle;
    uniform float uTwinkle;
    uniform float uContrast;
    uniform float uHaloStrength;
    uniform float uSaturation;
    uniform float uSolarBody;

    uniform vec3 uKeyLight;
    uniform vec3 uFillLight;
    uniform vec3 uRimLight;
    uniform vec3 uAmbientColor;

    float hash31(vec3 p) {
      return fract(
        sin(
          dot(
            p,
            vec3(
              12.9898,
              78.233,
              37.719
            )
          )
        ) *
        43758.5453
      );
    }

    /* CP5_FINAL_CELESTIAL_NATURALIZATION */
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

    void main() {
      vec3 n =
        normalize(vNormal);

      vec3 viewDir =
        normalize(-vViewPosition);

      vec3 sourceBase =
        max(
          vColor,
          vec3(0.02)
        );

      float luminance =
        dot(
          sourceBase,
          vec3(
            0.2126,
            0.7152,
            0.0722
          )
        );

      vec3 base =
        mix(
          vec3(luminance),
          sourceBase,
          clamp(
            uSaturation,
            0.0,
            1.0
          )
        );

      float facingToCamera =
        dot(
          n,
          viewDir
        );

      float rearSuppression =
        smoothstep(
          -0.18,
          0.34,
          facingToCamera
        );

      float sideRim =
        pow(
          1.0 -
          abs(facingToCamera),
          2.4
        );

      float key =
        max(
          dot(
            n,
            normalize(
              -uKeyLight
            )
          ),
          0.0
        );

      float fill =
        max(
          dot(
            n,
            normalize(
              -uFillLight
            )
          ),
          0.0
        );

      float rear =
        max(
          dot(
            n,
            normalize(
              -uRimLight
            )
          ),
          0.0
        );

      float fresnel =
        pow(
          1.0 -
          max(
            facingToCamera,
            0.0
          ),
          2.05
        );

      float facing =
        pow(
          max(
            dot(
              reflect(
                normalize(
                  uKeyLight
                ),
                n
              ),
              viewDir
            ),
            0.0
          ),
          28.0
        );

      float facetBand =
        pow(
          abs(
            dot(
              n,
              normalize(
                vec3(
                  0.45,
                  0.72,
                  0.53
                )
              )
            )
          ),
          5.0
        );

      float sparkleSeed =
        hash31(
          floor(
            (
              n +
              vWorldPosition
            ) *
            18.0
          )
        );

      float sparklePhase =
        sin(
          uTime *
          1.85 +
          sparkleSeed *
          6.28318
        );

      float sparkle =
        smoothstep(
          0.74,
          1.0,
          facing +
          facetBand *
          0.34
        ) *
        (
          0.76 +
          sparklePhase *
          0.24
        ) *
        uSparkle *
        rearSuppression;

      float twinkle =
        1.0 +
        sin(
          uTime *
          0.70 +
          sparkleSeed *
          6.28318
        ) *
        0.045 *
        uTwinkle;

      if (vHaloPass > 0.5) {
        if (uSolarBody > 0.5) {
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

        vec3 haloColor =
          base *
          (
            0.70 +
            fresnel * 1.18 +
            sideRim * 0.42 +
            rear * 0.24
          ) *
          uHaloStrength *
          twinkle;

        float haloAlpha =
          clamp(
            (
              0.040 +
              fresnel * 0.18 +
              sideRim * 0.08
            ) *
            uProminence *
            uHaloStrength,
            0.0,
            0.34
          );

        gl_FragColor = vec4(haloColor, haloAlpha);
        return;
      }

      if (uSolarBody > 0.5) {
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

      float diffuse =
        0.24 +
        key *
        0.82 +
        fill *
        0.30 +
        rear *
        0.14;

      diffuse =
        mix(
          diffuse,
          pow(
            diffuse,
            0.68
          ),
          clamp(
            uContrast -
            1.0,
            0.0,
            0.7
          )
        );

      vec3 lit =
        base *
        diffuse *
        twinkle;

      vec3 spec =
        vec3(
          1.0,
          0.96,
          0.82
        ) *
        facing *
        uSpecular *
        rearSuppression;

      vec3 rim =
        base *
        (
          fresnel *
          0.72 +
          sideRim *
          0.38
        ) *
        uRim;

      vec3 coolRim =
        vec3(
          0.68,
          0.86,
          1.0
        ) *
        (
          fresnel *
          0.22 +
          sideRim *
          0.14
        ) *
        uRim;

      vec3 emissive =
        base *
        uEmissive;

      vec3 spark =
        vec3(
          1.0,
          0.96,
          0.78
        ) *
        sparkle;

      float rearDim =
        mix(
          0.62,
          1.0,
          rearSuppression
        );

      vec3 color =
        (
          (
            lit +
            spec +
            rim +
            coolRim +
            emissive +
            spark
          ) *
          uProminence +
          uAmbientColor *
          base *
          0.20
        ) *
        rearDim;

      float alpha =
        clamp(
          uAlpha *
          (
            0.70 +
            uProminence *
            0.30 +
            fresnel *
            0.08
          ),
          0.12,
          1.0
        );

      gl_FragColor =
        vec4(
          color,
          alpha
        );
    }
  `;

  function invariant(
    condition,
    code,
    details = null
  ) {
    if (condition) {
      return;
    }

    const error =
      new Error(code);

    error.code =
      code;

    error.details =
      details;

    throw error;
  }

  function qs(
    selector,
    root = document
  ) {
    return root.querySelector(
      selector
    );
  }

  function qsa(
    selector,
    root = document
  ) {
    return Array.from(
      root.querySelectorAll(
        selector
      )
    );
  }

  function clamp(
    value,
    minimum,
    maximum
  ) {
    return Math.max(
      minimum,
      Math.min(
        maximum,
        value
      )
    );
  }

  function finiteNumber(
    value,
    fallback = 0
  ) {
    const number =
      Number(value);

    return Number.isFinite(
      number
    )
      ? number
      : fallback;
  }

  function normalizeDirection(value) {
    const direction =
      String(value || "")
        .trim()
        .toLowerCase();

    return DIRECTIONS.includes(
      direction
    )
      ? direction
      : "";
  }

  function normalizeLawId(value) {
    return String(
      value || ""
    ).trim();
  }

  function vectorLength(vector) {
    return Math.hypot(
      vector[0],
      vector[1],
      vector[2]
    );
  }

  function normalizeVector(
    vector,
    fallback = [
      0,
      0,
      1
    ]
  ) {
    const length =
      vectorLength(
        vector
      );

    if (
      !Number.isFinite(
        length
      ) ||
      length <=
        1e-12
    ) {
      return fallback.slice();
    }

    return [
      vector[0] / length,
      vector[1] / length,
      vector[2] / length
    ];
  }

  function dot(a, b) {
    return (
      a[0] * b[0] +
      a[1] * b[1] +
      a[2] * b[2]
    );
  }

  function cross(a, b) {
    return [
      a[1] * b[2] -
        a[2] * b[1],

      a[2] * b[0] -
        a[0] * b[2],

      a[0] * b[1] -
        a[1] * b[0]
    ];
  }

  function subtract(a, b) {
    return [
      a[0] - b[0],
      a[1] - b[1],
      a[2] - b[2]
    ];
  }

  function quaternionNormalize(
    value,
    fallback = [
      0,
      0,
      0,
      1
    ]
  ) {
    const source =
      Array.isArray(value) ||
      ArrayBuffer.isView(value)
        ? Array.from(value)
        : [];

    if (source.length !== 4) {
      return fallback.slice();
    }

    const quaternion = [
      finiteNumber(source[0], fallback[0]),
      finiteNumber(source[1], fallback[1]),
      finiteNumber(source[2], fallback[2]),
      finiteNumber(source[3], fallback[3])
    ];

    const length =
      Math.hypot(
        quaternion[0],
        quaternion[1],
        quaternion[2],
        quaternion[3]
      );

    if (
      !Number.isFinite(length) ||
      length <= 1e-12
    ) {
      return fallback.slice();
    }

    return quaternion.map(
      component =>
        component / length
    );
  }

  function quaternionMultiplyRaw(a, b) {
    return [
      a[3] * b[0] +
        a[0] * b[3] +
        a[1] * b[2] -
        a[2] * b[1],

      a[3] * b[1] -
        a[0] * b[2] +
        a[1] * b[3] +
        a[2] * b[0],

      a[3] * b[2] +
        a[0] * b[1] -
        a[1] * b[0] +
        a[2] * b[3],

      a[3] * b[3] -
        a[0] * b[0] -
        a[1] * b[1] -
        a[2] * b[2]
    ];
  }

  function quaternionConjugate(quaternion) {
    return [
      -quaternion[0],
      -quaternion[1],
      -quaternion[2],
      quaternion[3]
    ];
  }

  function quaternionMultiply(a, b) {
    return quaternionNormalize(
      quaternionMultiplyRaw(
        quaternionNormalize(a),
        quaternionNormalize(b)
      )
    );
  }

  function quaternionRotateVector(
    quaternion,
    vector
  ) {
    const normalized =
      quaternionNormalize(
        quaternion
      );

    const pure = [
      vector[0],
      vector[1],
      vector[2],
      0
    ];

    const rotated =
      quaternionMultiplyRaw(
        quaternionMultiplyRaw(
          normalized,
          pure
        ),
        quaternionConjugate(
          normalized
        )
      );

    return [
      rotated[0],
      rotated[1],
      rotated[2]
    ];
  }

  function quaternionSlerp(
    fromValue,
    toValue,
    amount
  ) {
    const from =
      quaternionNormalize(
        fromValue
      );

    let to =
      quaternionNormalize(
        toValue
      );

    let cosine =
      from[0] * to[0] +
      from[1] * to[1] +
      from[2] * to[2] +
      from[3] * to[3];

    if (cosine < 0) {
      to = [
        -to[0],
        -to[1],
        -to[2],
        -to[3]
      ];

      cosine =
        -cosine;
    }

    const interpolation =
      clamp(
        amount,
        0,
        1
      );

    if (cosine > 0.9995) {
      return quaternionNormalize([
        from[0] +
          (to[0] - from[0]) *
          interpolation,

        from[1] +
          (to[1] - from[1]) *
          interpolation,

        from[2] +
          (to[2] - from[2]) *
          interpolation,

        from[3] +
          (to[3] - from[3]) *
          interpolation
      ]);
    }

    const theta =
      Math.acos(
        clamp(
          cosine,
          -1,
          1
        )
      );

    const sineTheta =
      Math.sin(theta);

    if (
      Math.abs(sineTheta) <=
      1e-12
    ) {
      return from;
    }

    const weightFrom =
      Math.sin(
        (1 - interpolation) *
        theta
      ) /
      sineTheta;

    const weightTo =
      Math.sin(
        interpolation *
        theta
      ) /
      sineTheta;

    return quaternionNormalize([
      from[0] * weightFrom +
        to[0] * weightTo,

      from[1] * weightFrom +
        to[1] * weightTo,

      from[2] * weightFrom +
        to[2] * weightTo,

      from[3] * weightFrom +
        to[3] * weightTo
    ]);
  }

  function orientationQuaternion(
    orientation,
    fallback
  ) {
    if (
      orientation &&
      (
        Array.isArray(
          orientation.quaternion
        ) ||
        ArrayBuffer.isView(
          orientation.quaternion
        )
      )
    ) {
      return quaternionNormalize(
        orientation.quaternion,
        fallback
      );
    }

    return quaternionNormalize(
      fallback
    );
  }

  function identity4() {
    return [
      1, 0, 0, 0,
      0, 1, 0, 0,
      0, 0, 1, 0,
      0, 0, 0, 1
    ];
  }

  function multiply4(a, b) {
    const output =
      new Array(16).fill(0);

    for (let row = 0; row < 4; row += 1) {
      for (let column = 0; column < 4; column += 1) {
        for (let index = 0; index < 4; index += 1) {
          output[column * 4 + row] +=
            a[index * 4 + row] *
            b[column * 4 + index];
        }
      }
    }

    return output;
  }

  function translate4(x, y, z) {
    const matrix =
      identity4();

    matrix[12] = x;
    matrix[13] = y;
    matrix[14] = z;

    return matrix;
  }

  function scale4(x, y, z) {
    const matrix =
      identity4();

    matrix[0] = x;
    matrix[5] = y;
    matrix[10] = z;

    return matrix;
  }

  function rotateX4(angle) {
    const cosine =
      Math.cos(angle);

    const sine =
      Math.sin(angle);

    return [
      1, 0, 0, 0,
      0, cosine, sine, 0,
      0, -sine, cosine, 0,
      0, 0, 0, 1
    ];
  }

  function rotateY4(angle) {
    const cosine =
      Math.cos(angle);

    const sine =
      Math.sin(angle);

    return [
      cosine, 0, -sine, 0,
      0, 1, 0, 0,
      sine, 0, cosine, 0,
      0, 0, 0, 1
    ];
  }

  function rotateZ4(angle) {
    const cosine =
      Math.cos(angle);

    const sine =
      Math.sin(angle);

    return [
      cosine, sine, 0, 0,
      -sine, cosine, 0, 0,
      0, 0, 1, 0,
      0, 0, 0, 1
    ];
  }

  function inverseTransposeNormalMatrix3(
    modelView
  ) {
    const a00 = modelView[0];
    const a01 = modelView[4];
    const a02 = modelView[8];
    const a10 = modelView[1];
    const a11 = modelView[5];
    const a12 = modelView[9];
    const a20 = modelView[2];
    const a21 = modelView[6];
    const a22 = modelView[10];

    const b01 =
      a22 * a11 -
      a12 * a21;

    const b11 =
      -a22 * a10 +
      a12 * a20;

    const b21 =
      a21 * a10 -
      a11 * a20;

    let determinant =
      a00 * b01 +
      a01 * b11 +
      a02 * b21;

    if (
      !Number.isFinite(determinant) ||
      Math.abs(determinant) <=
        QUALITY.normalEpsilon
    ) {
      return [
        a00, a10, a20,
        a01, a11, a21,
        a02, a12, a22
      ];
    }

    determinant =
      1 / determinant;

    const inverse = [
      b01 * determinant,

      (-a22 * a01 + a02 * a21) *
        determinant,

      (a12 * a01 - a02 * a11) *
        determinant,

      b11 * determinant,

      (a22 * a00 - a02 * a20) *
        determinant,

      (-a12 * a00 + a02 * a10) *
        determinant,

      b21 * determinant,

      (-a21 * a00 + a01 * a20) *
        determinant,

      (a11 * a00 - a01 * a10) *
        determinant
    ];

    return [
      inverse[0],
      inverse[3],
      inverse[6],
      inverse[1],
      inverse[4],
      inverse[7],
      inverse[2],
      inverse[5],
      inverse[8]
    ];
  }

  function compileShader(
    gl,
    type,
    source
  ) {
    const shader =
      gl.createShader(type);

    invariant(
      shader,
      "LAWS_CRYSTAL_SHADER_CREATION_FAILED"
    );

    gl.shaderSource(
      shader,
      source
    );

    gl.compileShader(shader);

    if (
      !gl.getShaderParameter(
        shader,
        gl.COMPILE_STATUS
      )
    ) {
      const information =
        gl.getShaderInfoLog(shader) ||
        "UNKNOWN_SHADER_ERROR";

      gl.deleteShader(shader);

      throw new Error(information);
    }

    return shader;
  }

  function createProgram(gl) {
    const vertexShader =
      compileShader(
        gl,
        gl.VERTEX_SHADER,
        vertexShaderSource
      );

    const fragmentShader =
      compileShader(
        gl,
        gl.FRAGMENT_SHADER,
        fragmentShaderSource
      );

    const program =
      gl.createProgram();

    invariant(
      program,
      "LAWS_CRYSTAL_PROGRAM_CREATION_FAILED"
    );

    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    gl.deleteShader(vertexShader);
    gl.deleteShader(fragmentShader);

    if (
      !gl.getProgramParameter(
        program,
        gl.LINK_STATUS
      )
    ) {
      const information =
        gl.getProgramInfoLog(program) ||
        "UNKNOWN_PROGRAM_LINK_ERROR";

      gl.deleteProgram(program);

      throw new Error(information);
    }

    return program;
  }

  function createBuffer(gl, data) {
    const buffer =
      gl.createBuffer();

    invariant(
      buffer,
      "LAWS_CRYSTAL_BUFFER_CREATION_FAILED"
    );

    gl.bindBuffer(
      gl.ARRAY_BUFFER,
      buffer
    );

    gl.bufferData(
      gl.ARRAY_BUFFER,
      data,
      gl.STATIC_DRAW
    );

    return buffer;
  }

  function bindAttrib(
    gl,
    buffer,
    location,
    size
  ) {
    invariant(
      location >= 0,
      "LAWS_CRYSTAL_ATTRIBUTE_INVALID"
    );

    gl.bindBuffer(
      gl.ARRAY_BUFFER,
      buffer
    );

    gl.enableVertexAttribArray(location);

    gl.vertexAttribPointer(
      location,
      size,
      gl.FLOAT,
      false,
      0,
      0
    );
  }

  function createDiamondStarMesh(
    options = {}
  ) {
    const points =
      options.points ||
      8;

    const radius =
      options.radius ||
      0.62;

    const inner =
      options.inner ||
      radius * 0.46;

    const depth =
      options.depth ||
      0.42;

    const crown =
      options.crown ||
      0.22;

    const color =
      options.color ||
      PALETTE.flow;

    const warmth =
      options.warmth ||
      0;

    const vertices = [];
    const faces = [];

    function add(
      point
    ) {
      vertices.push(
        point
      );

      return vertices.length -
        1;
    }

    function face(
      a,
      b,
      c
    ) {
      faces.push([
        a,
        b,
        c
      ]);
    }

    const frontApex =
      add([
        0,
        0,
        depth
      ]);

    const rearApex =
      add([
        0,
        0,
        -depth
      ]);

    const frontCrown =
      add([
        0,
        0,
        depth +
        crown
      ]);

    const rearCrown =
      add([
        0,
        0,
        -depth -
        crown * 0.72
      ]);

    const outer = [];
    const innerRing = [];
    const frontBevel = [];
    const rearBevel = [];

    for (
      let index = 0;
      index < points * 2;
      index += 1
    ) {
      const isPoint =
        index % 2 ===
        0;

      const angle =
        (
          Math.PI *
          2 *
          index
        ) /
        (
          points *
          2
        ) -
        Math.PI / 2;

      const activeRadius =
        isPoint
          ? radius
          : inner;

      const yScale =
        0.78;

      const ridge =
        isPoint
          ? 0.05
          : -0.02;

      outer.push(
        add([
          Math.cos(angle) *
            activeRadius,

          Math.sin(angle) *
            activeRadius *
            yScale,

          ridge
        ])
      );

      innerRing.push(
        add([
          Math.cos(angle) *
            activeRadius *
            0.38,

          Math.sin(angle) *
            activeRadius *
            yScale *
            0.38,

          depth * 0.14
        ])
      );

      frontBevel.push(
        add([
          Math.cos(angle) *
            activeRadius *
            0.72,

          Math.sin(angle) *
            activeRadius *
            yScale *
            0.72,

          depth * 0.52
        ])
      );

      rearBevel.push(
        add([
          Math.cos(angle) *
            activeRadius *
            0.68,

          Math.sin(angle) *
            activeRadius *
            yScale *
            0.68,

          -depth * 0.48
        ])
      );
    }

    const count =
      outer.length;

    for (
      let index = 0;
      index < count;
      index += 1
    ) {
      const next =
        (
          index +
          1
        ) %
        count;

      face(
        frontApex,
        innerRing[index],
        innerRing[next]
      );

      face(
        frontCrown,
        frontBevel[next],
        frontBevel[index]
      );

      face(
        frontBevel[index],
        outer[index],
        outer[next]
      );

      face(
        frontBevel[index],
        outer[next],
        frontBevel[next]
      );

      face(
        innerRing[index],
        frontBevel[index],
        frontBevel[next]
      );

      face(
        innerRing[index],
        frontBevel[next],
        innerRing[next]
      );

      face(
        rearApex,
        rearBevel[next],
        rearBevel[index]
      );

      face(
        rearCrown,
        rearBevel[index],
        rearBevel[next]
      );

      face(
        rearBevel[index],
        outer[next],
        outer[index]
      );

      face(
        rearBevel[index],
        rearBevel[next],
        outer[next]
      );
    }

    const positions = [];
    const normals = [];
    const colors = [];

    faces.forEach(
      (
        triangle,
        faceIndex
      ) => {
        const a =
          vertices[
            triangle[0]
          ];

        const b =
          vertices[
            triangle[1]
          ];

        const c =
          vertices[
            triangle[2]
          ];

        const normal =
          normalizeVector(
            cross(
              subtract(
                b,
                a
              ),
              subtract(
                c,
                a
              )
            )
          );

        const lift =
          0.84 +
          (
            faceIndex % 7
          ) *
          0.034;

        const sparkleLift =
          faceIndex % 5 === 0
            ? 0.13
            : 0;

        [a, b, c].forEach(
          point => {
            positions.push(
              point[0],
              point[1],
              point[2]
            );

            normals.push(
              normal[0],
              normal[1],
              normal[2]
            );

            colors.push(
              Math.min(
                color[0] *
                  lift +
                  warmth * 0.06 +
                  sparkleLift,
                1
              ),

              Math.min(
                color[1] *
                  lift +
                  warmth * 0.04 +
                  sparkleLift,
                1
              ),

              Math.min(
                color[2] *
                  lift +
                  warmth * 0.02 +
                  sparkleLift,
                1
              )
            );
          }
        );
      }
    );

    return Object.freeze({
      positions:
        new Float32Array(
          positions
        ),

      normals:
        new Float32Array(
          normals
        ),

      colors:
        new Float32Array(
          colors
        ),

      vertexCount:
        positions.length / 3
    });
  }


  function createCelestialSphereMesh(options = {}) {
    const segments = Math.max(24, options.segments || 48);
    const rings = Math.max(16, options.rings || 32);
    const radius = options.radius || 0.66;
    const color = options.color || [1, 1, 1];
    const mode = options.mode === "solar" ? "solar" : "lunar";
    const positions = [];
    const normals = [];
    const colors = [];
    /* CP5_FINAL_PUBLIC_MOON_DEFINITION */
    const craters = [
      [0.34, 0.18, 0.92, 0.46, 0.072, 0.94, 0.12, 1.00, 0.18],
      [-0.48, 0.52, 0.70, 0.37, 0.054, 0.64, 0.48, 0.94, 0.48],
      [0.58, -0.34, 0.74, 0.29, 0.046, 0.84, 0.22, 0.98, 0.26],
      [-0.62, -0.22, 0.75, 0.24, 0.034, 0.42, 0.70, 0.74, 0.72],
      [0.12, 0.72, 0.68, 0.205, 0.032, 0.76, 0.30, 0.92, 0.34],
      [0.76, 0.22, 0.61, 0.175, 0.026, 0.52, 0.60, 0.78, 0.64],
      [-0.18, -0.66, 0.73, 0.158, 0.025, 0.88, 0.16, 0.94, 0.16],
      [0.08, -0.18, 0.98, 0.137, 0.021, 0.70, 0.40, 0.88, 0.44],
      [-0.34, 0.06, 0.94, 0.116, 0.017, 0.36, 0.78, 0.62, 0.80],
      [0.44, 0.62, 0.65, 0.108, 0.016, 0.80, 0.22, 0.90, 0.22],
      [-0.76, 0.34, 0.55, 0.098, 0.014, 0.46, 0.66, 0.66, 0.70],
      [0.28, -0.78, 0.56, 0.091, 0.013, 0.88, 0.14, 0.88, 0.14],
      [0.64, -0.02, -0.77, 0.195, 0.028, 0.62, 0.48, 0.82, 0.52],
      [-0.42, 0.38, -0.82, 0.132, 0.019, 0.40, 0.72, 0.60, 0.78],
      [0.16, -0.52, -0.84, 0.083, 0.011, 0.74, 0.34, 0.74, 0.34]
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
      [0.12, 0.30, 0.95, 0.57, 0.88],
      [-0.56, -0.08, 0.82, 0.44, 0.75],
      [0.61, -0.42, 0.67, 0.36, 0.62],
      [-0.24, 0.72, -0.65, 0.40, 0.58]
    ].map(record => ({
      center: normalizeVector(record.slice(0, 3)),
      radius: record[3],
      strength: record[4]
    }));

    const lunarPlains = [
      [0.70, 0.38, 0.60, 0.47, 0.90],
      [-0.12, -0.72, 0.68, 0.52, 0.94],
      [-0.72, 0.46, -0.52, 0.43, 0.82]
    ].map(record => ({
      center: normalizeVector(record.slice(0, 3)),
      radius: record[3],
      strength: record[4]
    }));

    /* CP5_FINAL_SOLAR_OPEN_BRANCHING_BASE */
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

    function mixColor(a, b, amount) {
      const t = clamp(amount, 0, 1);
      return [
        a[0] + (b[0] - a[0]) * t,
        a[1] + (b[1] - a[1]) * t,
        a[2] + (b[2] - a[2]) * t
      ];
    }

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

    function regionField(regions, nx, ny, nz, phase) {
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
        const bowlFalloff = 2.30 + (1 - crater.erosion) * 2.35;
        const bowl = Math.exp(-normalizedDistance * normalizedDistance * bowlFalloff);
        const wallCenter = 0.57 + crater.erosion * 0.10;
        const wallWidth = 2.9 + (1 - crater.erosion) * 3.2;
        const wall = Math.exp(-Math.pow((normalizedDistance - wallCenter) * wallWidth, 2));
        const rimCenter = 0.82 + crater.erosion * 0.06;
        const rimWidth = 4.3 + (1 - crater.erosion) * 6.7;
        let rim = Math.exp(-Math.pow((normalizedDistance - rimCenter) * rimWidth, 2));
        const partial = clamp(
0.58 + deterministicField(nx, ny, nz, 3.7, crater.partialBias * 5.3) * 0.42,
0.10,
1.0
        );
        rim *= 0.44 + partial * 0.56;
        const ejecta = Math.exp(-Math.pow((normalizedDistance - 1.19) * (2.6 + crater.erosion * 1.6), 2));
        const visibility = crater.visibility;
        relief += (
rim * crater.depth * crater.rimSharpness * 1.08 +
wall * crater.depth * (0.12 + (1 - crater.erosion) * 0.09) -
bowl * crater.depth * (1.02 + (1 - crater.erosion) * 0.30) +
ejecta * crater.depth * (0.05 + (1 - crater.erosion) * 0.09)
        ) * visibility;
        albedo += (
rim * (0.14 + crater.rimSharpness * 0.18) +
wall * 0.035 -
bowl * (0.15 + crater.depth * 2.10) +
ejecta * 0.030
        ) * visibility;
        basin = Math.max(basin, bowl * visibility * smoothTransition(0.20, 0.44, crater.radius));
      });
      return { relief, albedo, basin };
    }

    function surfaceSample(phi, theta) {
      const nx = Math.sin(phi) * Math.cos(theta);
      const ny = Math.cos(phi);
      const nz = Math.sin(phi) * Math.sin(theta);
      let relief = 1;
      let surfaceColor;

      if (mode === "solar") {
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
      } else {
        const macroTerrain = deterministicField(nx, ny, nz, 2.10, 1.43);
        const highlandTerrain = deterministicField(nx, ny, nz, 5.4, 0.39);
        const ridgeTerrain = deterministicField(nx, ny, nz, 8.6, 1.17);
        const fineTerrain = deterministicField(nx, ny, nz, 18.8, 2.07);
        const crater = craterField(nx, ny, nz);
        const maria = regionField(lunarMaria, nx, ny, nz, 0.83);
        const plains = regionField(lunarPlains, nx, ny, nz, 2.19);
        const calmTerrain = clamp(Math.max(plains, maria * 0.70), 0, 1);
        const roughnessScale = 1 - calmTerrain * 0.82;
        const light = normalizeVector([-0.62, 0.22, 0.75]);
        const illumination = nx * light[0] + ny * light[1] + nz * light[2];
        const terminator = 0.14 + 0.86 * smoothTransition(-0.20, 0.22, illumination);
        const highlands = smoothTransition(
-0.20,
0.34,
macroTerrain + highlandTerrain * 0.43 + ridgeTerrain * 0.14 + crater.albedo * 0.68
        ) * (1 - maria * 0.84);
        const neutralAlbedo = clamp(
0.54 + highlands * 0.30 - maria * 0.32 + plains * 0.055 +
macroTerrain * 0.050 + crater.albedo * 0.45,
0.16,
0.97
        );
        const reliefLighting = clamp(
0.82 + macroTerrain * 0.060 + highlandTerrain * 0.100 * roughnessScale +
ridgeTerrain * 0.055 * roughnessScale + fineTerrain * 0.018 * roughnessScale +
crater.albedo * 0.36 - crater.basin * 0.075,
0.50,
1.16
        );
        const shade = clamp(
neutralAlbedo * (0.31 + terminator * 0.69) * reliefLighting,
0.045,
1.0
        );
        const selectedRimHighlight =
clamp(crater.albedo, 0, 1) * smoothTransition(-0.02, 0.55, illumination) * 0.065;
        const bowlShadow = clamp(-crater.albedo, 0, 1) * (0.018 + terminator * 0.024);
        const reflectedCoolTint = (1 - terminator) * 0.003;
        relief += macroTerrain * 0.0048 + highlandTerrain * 0.0068 * roughnessScale +
ridgeTerrain * 0.0034 * roughnessScale + fineTerrain * 0.0013 * roughnessScale +
crater.relief * (1 - maria * 0.16);
        surfaceColor = [
clamp(shade * 1.018 + selectedRimHighlight - bowlShadow, 0, 1),
clamp(shade * 1.012 + selectedRimHighlight * 0.92 - bowlShadow * 0.98, 0, 1),
clamp(shade + selectedRimHighlight * 0.82 - bowlShadow * 0.96 + reflectedCoolTint, 0, 1)
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
  }

  function lawColorForDirection(direction) {
    if (direction === "flow") return PALETTE.lawFlow;
    if (direction === "integrity") return PALETTE.lawIntegrity;
    if (direction === "reality") return PALETTE.lawReality;
    if (direction === "structure") return PALETTE.lawStructure;
    if (direction === "test") return PALETTE.test;
    return PALETTE.research;
  }

  function createCpuMeshes() {
    const meshes = new Map();

    DIRECTIONS.forEach(direction => {
      const gateway=GATEWAY_IDS.includes(direction);
      const warm=direction === "reality" || direction === "structure" || direction === "test";
      meshes.set(`category-${direction}`, gateway ? createCelestialSphereMesh({segments:direction === "research" ? 64 : 48,rings:direction === "research" ? 44 : 32,radius:0.66,color:PALETTE[direction],mode:direction === "test" ? "solar" : "lunar"}) : createDiamondStarMesh({points:QUALITY.categorySegments,radius:0.72,inner:0.30,depth:0.42,crown:0.20,color:PALETTE[direction],warmth:warm ? 0.10 : 0.02}));
      meshes.set(`law-${direction}`,createDiamondStarMesh({points:gateway?8:QUALITY.lawSegments,radius:gateway?0.48:0.42,inner:gateway?0.21:0.20,depth:gateway?0.29:0.25,crown:gateway?0.13:0.10,color:lawColorForDirection(direction),warmth:warm?0.08:0.02}));
    });

    AUXILIARY_IDS.forEach(id => {
      meshes.set(
        `auxiliary-${id}`,
        createDiamondStarMesh({
          points: QUALITY.categorySegments,
          radius: 0.79,
          inner: 0.31,
          depth: 0.46,
          crown: 0.22,
          color: PALETTE[id],
          warmth: id === "test" ? 0.14 : 0.01
        })
      );
    });

    return meshes;
  }

  function createRenderer(
    layer,
    cpuMeshes
  ) {
    const gl =
      layer.canvas.getContext(
        "webgl",
        {
          antialias:
            true,

          alpha:
            true,

          depth:
            true,

          premultipliedAlpha:
            true,

          preserveDrawingBuffer:
            false
        }
      );

    invariant(
      gl,
      `LAWS_CRYSTALS_${layer.id}_WEBGL_UNAVAILABLE`
    );

    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);
    gl.enable(gl.BLEND);

    gl.blendFunc(
      gl.SRC_ALPHA,
      gl.ONE_MINUS_SRC_ALPHA
    );

    gl.disable(gl.CULL_FACE);

    const program =
      createProgram(gl);

    const attribs =
      Object.freeze({
        position:
          gl.getAttribLocation(
            program,
            "aPosition"
          ),

        normal:
          gl.getAttribLocation(
            program,
            "aNormal"
          ),

        color:
          gl.getAttribLocation(
            program,
            "aColor"
          )
      });

    const uniforms =
      Object.freeze({
        model:
          gl.getUniformLocation(
            program,
            "uModel"
          ),

        view:
          gl.getUniformLocation(
            program,
            "uView"
          ),

        projection:
          gl.getUniformLocation(
            program,
            "uProjection"
          ),

        normalMatrix:
          gl.getUniformLocation(
            program,
            "uNormalMatrix"
          ),

        time:
          gl.getUniformLocation(
            program,
            "uTime"
          ),

        prominence:
          gl.getUniformLocation(
            program,
            "uProminence"
          ),

        specular:
          gl.getUniformLocation(
            program,
            "uSpecular"
          ),

        rim:
          gl.getUniformLocation(
            program,
            "uRim"
          ),

        emissive:
          gl.getUniformLocation(
            program,
            "uEmissive"
          ),

        alpha:
          gl.getUniformLocation(
            program,
            "uAlpha"
          ),

        sparkle:
          gl.getUniformLocation(
            program,
            "uSparkle"
          ),

        twinkle:
          gl.getUniformLocation(
            program,
            "uTwinkle"
          ),

        contrast:
          gl.getUniformLocation(
            program,
            "uContrast"
          ),

        haloStrength:
          gl.getUniformLocation(
            program,
            "uHaloStrength"
          ),

        saturation:
          gl.getUniformLocation(
            program,
            "uSaturation"
          ),

        haloPass:
          gl.getUniformLocation(
            program,
            "uHaloPass"
          ),

        haloExpansion:
          gl.getUniformLocation(
            program,
            "uHaloExpansion"
          ),

        solarBody:
          gl.getUniformLocation(
            program,
            "uSolarBody"
          ),

        keyLight:
          gl.getUniformLocation(
            program,
            "uKeyLight"
          ),

        fillLight:
          gl.getUniformLocation(
            program,
            "uFillLight"
          ),

        rimLight:
          gl.getUniformLocation(
            program,
            "uRimLight"
          ),

        ambientColor:
          gl.getUniformLocation(
            program,
            "uAmbientColor"
          )
      });

    const meshes =
      new Map();

    for (
      const [key, mesh]
      of cpuMeshes.entries()
    ) {
      meshes.set(
        key,
        Object.freeze({
          vertexCount:
            mesh.vertexCount,

          position:
            createBuffer(
              gl,
              mesh.positions
            ),

          normal:
            createBuffer(
              gl,
              mesh.normals
            ),

          color:
            createBuffer(
              gl,
              mesh.colors
            )
        })
      );
    }

    const contextLost =
      event => {
        event.preventDefault();

        emitFailure(
          `LAWS_CRYSTALS_${layer.id}_CONTEXT_LOST`
        );
      };

    layer.canvas.addEventListener(
      "webglcontextlost",
      contextLost
    );

    return {
      id:
        layer.id,

      canvas:
        layer.canvas,

      gl,
      program,
      attribs,
      uniforms,
      meshes,
      contextLost
    };
  }

  function destroyRenderer(renderer) {
    if (!renderer) {
      return;
    }

    renderer.canvas.removeEventListener(
      "webglcontextlost",
      renderer.contextLost
    );

    for (const mesh of renderer.meshes.values()) {
      renderer.gl.deleteBuffer(mesh.position);
      renderer.gl.deleteBuffer(mesh.normal);
      renderer.gl.deleteBuffer(mesh.color);
    }

    renderer.meshes.clear();

    renderer.gl.deleteProgram(
      renderer.program
    );
  }

  function clusterBaseVector(
  index,
  count
) {
  const safeCount = Math.max(1, count);
  const longitude =
    Math.PI * 2 * index / safeCount -
    Math.PI / 2;
  const latitude =
    Math.sin(
      (index + 0.5) *
      SPHERE.cluster.latitudeFrequency
    ) *
    SPHERE.cluster.latitudeAmplitude;
  const cosineLatitude = Math.cos(latitude);

  return normalizeVector([
    Math.cos(longitude) * cosineLatitude,
    Math.sin(latitude),
    Math.sin(longitude) * cosineLatitude
  ]);
}

function validateClusterSphereContract() {
  const vectors = Array.from(
    { length: SPHERE.cluster.memberCount },
    (_, index) =>
      clusterBaseVector(index, SPHERE.cluster.memberCount)
  );

  invariant(
    vectors.length === 4,
    "LAWS_CRYSTALS_CLUSTER_SPHERE_REQUIRES_FOUR_MEMBERS"
  );

  const edgeA = subtract(vectors[1], vectors[0]);
  const edgeB = subtract(vectors[2], vectors[0]);
  const edgeC = subtract(vectors[3], vectors[0]);
  const determinant =
    edgeA[0] * (edgeB[1] * edgeC[2] - edgeB[2] * edgeC[1]) -
    edgeA[1] * (edgeB[0] * edgeC[2] - edgeB[2] * edgeC[0]) +
    edgeA[2] * (edgeB[0] * edgeC[1] - edgeB[1] * edgeC[0]);

  invariant(
    Math.abs(determinant) > 1e-4,
    "LAWS_CRYSTALS_NONCOPLANAR_DISTRIBUTION_INVALID",
    { determinant }
  );

  RECEIPT.clusterGeometryModel = SPHERE.cluster.model;
  RECEIPT.clusterMemberCount = SPHERE.cluster.memberCount;
  RECEIPT.clusterNoncoplanar = true;
  RECEIPT.clusterFullXyzRotation = true;
  return true;
}

  function makeNode(options) {
    return {
      id:
        options.id,

      type:
        options.type,

      direction:
        options.direction,

      label:
        options.label,

      semanticElement:
        options.semanticElement,

      lawIndex:
        options.lawIndex || 0,

      lawCount:
        options.lawCount || 0,

      meshKey:
        options.meshKey,

      baseMaterial:
        options.material,

      material:
        options.material,

      phase:
        options.phase || 0,

      visible:
        false,

      depthLayer:
        DEPTH_LAYERS.REAR,

      previousDepthLayer:
        DEPTH_LAYERS.REAR,

      viewDepth:
        -Infinity,

      depthOffsetFromCompassPlane:
        -Infinity,

      sphereVector:
        options.type === NODE_TYPES.CATEGORY
          ? SPHERE
              .constellation
              .vectors[
                options.direction
              ]
              .slice()
          : options.type === NODE_TYPES.AUXILIARY
            ? SPHERE
                .constellation
                .vectors[
                  options.id
                ]
                .slice()
            : clusterBaseVector(
                options.lawIndex,
                options.lawCount
              ),

      depthScore:
        0,

      primaryScore:
        0,

      projectedScreen:
        null,

      transform:
        {
          x:
            0,

          y:
            0,

          z:
            0,

          rx:
            0,

          ry:
            0,

          rz:
            0,

          sx:
            1,

          sy:
            1,

          sz:
            1,

          prominence:
            0,

          halo:
            0,

          rotationSpeed:
            0.12,

          float:
            0
        },

      target:
        {
          x:
            0,

          y:
            0,

          z:
            -1,

          sx:
            0.5,

          sy:
            0.5,

          sz:
            0.5,

          prominence:
            0,

          halo:
            0,

          rotationSpeed:
            0.06,

          float:
            0
        }
    };
  }

  function requireController() {
    const controller =
      globalThis.DGB_LAWS_CONTROLLER;

    invariant(
      controller,
      "LAWS_CRYSTALS_CONTROLLER_REQUIRED"
    );

    invariant(
      controller.moduleId ===
        CONTRACT.controllerModuleId,
      "LAWS_CRYSTALS_CONTROLLER_MODULE_INVALID"
    );

    invariant(
      controller.moduleVersion ===
        CONTRACT.controllerModuleVersion,
      "LAWS_CRYSTALS_CONTROLLER_VERSION_INVALID"
    );

    [
      "getFrameState",
      "updateSemanticProjection",
      "getCanonicalLawRecords",
      "getCanonicalLawRoutes",
      "getCanonicalMemberRecords",
      "getCanonicalMemberRoutes"
    ].forEach(
      surface => {
        invariant(
          typeof controller[surface] ===
            "function",
          `LAWS_CRYSTALS_CONTROLLER_SURFACE_REQUIRED:${surface}`
        );
      }
    );

    const records =
      controller.getCanonicalLawRecords();

    invariant(
      Array.isArray(records) &&
        records.length === 16,
      "LAWS_CRYSTALS_CONTROLLER_LAW_REGISTRY_INVALID"
    );

    const members = controller.getCanonicalMemberRecords();
    invariant(
      Array.isArray(members) && members.length === 8,
      "LAWS_CRYSTALS_CONTROLLER_MEMBER_REGISTRY_INVALID"
    );

    return controller;
  }

  function requireCompositor() {
    const compositor =
      globalThis.DGB_LAWS_COMPOSITOR;

    invariant(
      compositor,
      "LAWS_CRYSTALS_COMPOSITOR_REQUIRED"
    );

    invariant(
      compositor.moduleId ===
        CONTRACT.compositorModuleId,
      "LAWS_CRYSTALS_COMPOSITOR_MODULE_INVALID"
    );

    invariant(
      compositor.moduleVersion ===
        CONTRACT.compositorModuleVersion,
      "LAWS_CRYSTALS_COMPOSITOR_VERSION_INVALID"
    );

    [
      "initialize",
      "beginFrame",
      "getViewMatrix",
      "getProjectionMatrix",
      "projectWorldPoint",
      "renderComposite",
      "getRearLayer",
      "getFrontLayer",
      "receipt"
    ].forEach(
      surface => {
        invariant(
          typeof compositor[surface] ===
            "function",
          `LAWS_CRYSTALS_COMPOSITOR_SURFACE_REQUIRED:${surface}`
        );
      }
    );

    return compositor;
  }

  function resolvePlanetParticipant() {
    const participant =
      globalThis
        .DGB_LAWS_PLANET_WORLD_PARTICIPANT;

    if (
      !participant ||
      typeof participant !== "object"
    ) {
      state.planetParticipant =
        null;

      return null;
    }

    if (
      participant.moduleId !==
        CONTRACT.planetParticipantModuleId
    ) {
      state.planetParticipant =
        null;

      return null;
    }

    if (
      participant.moduleVersion !==
        CONTRACT.planetParticipantModuleVersion
    ) {
      state.planetParticipant =
        null;

      return null;
    }

    [
      "getNode",
      "getWorldCenter",
      "isPlanetNode",
      "draw"
    ].forEach(
      surface => {
        invariant(
          typeof participant[surface] ===
            "function",
          `LAWS_CRYSTALS_PLANET_PARTICIPANT_SURFACE_REQUIRED:${surface}`
        );
      }
    );

    state.planetParticipant =
      participant;

    return participant;
  }

  function resolveDom() {
    state.root =
      qs("[data-laws-root]");

    invariant(
      state.root,
      "LAWS_CRYSTALS_ROOT_NOT_FOUND"
    );

    state.scene =
      qs(
        "[data-laws-scene]",
        state.root
      );

    invariant(
      state.scene,
      "LAWS_CRYSTALS_SCENE_NOT_FOUND"
    );

    state.field =
      qs(
        "[data-laws-scene-field]",
        state.scene
      ) ||
      qs(
        ".laws-scene__field",
        state.scene
      ) ||
      state.scene;

    state.semanticLayer =
      qs(
        "[data-laws-objects]",
        state.root
      );

    invariant(
      state.semanticLayer,
      "LAWS_CRYSTALS_SEMANTIC_LAYER_NOT_FOUND"
    );

    state.receiptOutput =
      qs(
        "[data-laws-crystals-receipt]",
        state.root
      );
  }

  function captureAttribute(element, name) {
    return Object.freeze({
      present:
        element.hasAttribute(name),

      value:
        element.getAttribute(name)
    });
  }

  function restoreAttribute(
    element,
    name,
    snapshot
  ) {
    if (
      snapshot &&
      snapshot.present
    ) {
      element.setAttribute(
        name,
        snapshot.value
      );

      return;
    }

    element.removeAttribute(name);
  }

  function captureLawControlSnapshot(element) {
    return Object.freeze({
      element,

      parent:
        element.parentNode,

      nextSibling:
        element.nextSibling,

      canonicalMarker:
        captureAttribute(
          element,
          "data-laws-canonical-law-control"
        ),

      relocationMarker:
        captureAttribute(
          element,
          "data-laws-relocated-to-semantic-layer"
        )
    });
  }

  function canonicalLawElements() {
    return qsa(
      "[data-laws-law], [data-laws-member]",
      state.root
    );
  }

  function relocateCanonicalLawControls() {
    const controls =
      canonicalLawElements();

    invariant(
      controls.length === 24,
      "LAWS_CRYSTALS_LAW_CONTROL_COUNT_INVALID",
      {
        expected: 24,
        actual: controls.length
      }
    );

    const ids =
      new Set();

    state.lawControlSnapshots =
      controls.map(
        captureLawControlSnapshot
      );

    controls.forEach(
      element => {
        const lawId =
               normalizeLawId(
                 element.dataset.lawId ||
                 element.dataset.memberId
               );

        invariant(
          lawId,
          "LAWS_CRYSTALS_LAW_ID_REQUIRED"
        );

        invariant(
          !ids.has(lawId),
          `LAWS_CRYSTALS_DUPLICATE_LAW_ID:${lawId}`
        );

        ids.add(lawId);

        state.semanticLayer.appendChild(
          element
        );

        element.dataset.lawsCanonicalLawControl =
          "true";

        element.dataset.lawsRelocatedToSemanticLayer =
          "true";
      }
    );

    state.canonicalLawElements =
      controls.slice();

    state.relocatedLawElements =
      controls.filter(
        element =>
          element.parentElement ===
          state.semanticLayer
      );

    invariant(
      state.relocatedLawElements.length === 24,
      "LAWS_CRYSTALS_LAW_RELOCATION_FAILED"
    );

    state.semanticLayer.dataset
      .lawsCanonicalLawControlsRelocated =
      "true";

    state.semanticLayer.dataset
      .lawsCanonicalLawControlCount =
      "16";
  }

  function restoreCanonicalLawControls() {
    for (
      const snapshot
      of state
        .lawControlSnapshots
        .slice()
        .reverse()
    ) {
      if (
        snapshot.parent &&
        snapshot.element
      ) {
        if (
          snapshot.nextSibling &&
          snapshot.nextSibling.parentNode ===
            snapshot.parent
        ) {
          snapshot.parent.insertBefore(
            snapshot.element,
            snapshot.nextSibling
          );
        } else {
          snapshot.parent.appendChild(
            snapshot.element
          );
        }
      }

      restoreAttribute(
        snapshot.element,
        "data-laws-canonical-law-control",
        snapshot.canonicalMarker
      );

      restoreAttribute(
        snapshot.element,
        "data-laws-relocated-to-semantic-layer",
        snapshot.relocationMarker
      );
    }

    state.lawControlSnapshots = [];
    state.canonicalLawElements = [];
    state.relocatedLawElements = [];
  }

  function buildRegistry() {
    const registry =
      new Map();

    const lawElements =
      canonicalLawElements();

    DIRECTIONS.forEach(
      (
        direction,
        directionIndex
      ) => {
        const categoryElement =
          qs(
            `[data-laws-category][data-direction="${direction}"]`,
            state.root
          );

        invariant(
          categoryElement,
          `LAWS_CRYSTALS_CATEGORY_CONTROL_REQUIRED:${direction}`
        );

        registry.set(
          direction,
          makeNode({
            id:
              direction,

            type:
              NODE_TYPES.CATEGORY,

            direction,

            label:
              categoryElement.dataset
                .categoryLabel ||
              categoryElement.dataset
                .label ||
              direction,

            semanticElement:
              categoryElement,

            meshKey:
              `category-${direction}`,

            material:
              "CATEGORY_IDLE",

            phase:
              directionIndex *
                1.37 +
              0.22
          })
        );

        const directionLaws =
          lawElements.filter(
            element =>
              normalizeDirection(
                element.dataset.direction
              ) === direction
          );

        invariant(
          directionLaws.length === 4,
          `LAWS_CRYSTALS_DIRECTION_LAW_COUNT_INVALID:${direction}`
        );

        directionLaws.forEach(
          (
            element,
            lawIndex
          ) => {
            const id =
              normalizeLawId(
                element.dataset.lawId ||
                element.dataset.memberId
              );

            invariant(
              id,
              `LAWS_CRYSTALS_LAW_ID_MISSING:${direction}:${lawIndex}`
            );

            invariant(
              !registry.has(id),
              `LAWS_CRYSTALS_DUPLICATE_LAW_ID:${id}`
            );

            registry.set(
              id,
              makeNode({
                id,
                 type:
                   element.matches("[data-laws-law]")
                     ? NODE_TYPES.LAW
                     : NODE_TYPES.MEMBER,

                direction,
                 label:
                   element.dataset.memberLabel ||
                   element.dataset.lawLabel ||
                   element.dataset.label ||
                   element.textContent.trim(),

                semanticElement:
                  element,

                lawIndex,

                lawCount:
                  directionLaws.length,
                 meshKey:
                   `law-${direction}`,

                material:
                  "LAW_IDLE",

                phase:
                  directionIndex *
                    1.13 +
                  lawIndex *
                    0.47
              })
            );
          }
        );
      }
    );

    RECEIPT.categoryCount =
      Array.from(registry.values())
        .filter(
          node =>
            node.type === NODE_TYPES.CATEGORY
        ).length;

    RECEIPT.auxiliaryCount =
      Array.from(registry.values())
        .filter(
          node =>
            node.type === NODE_TYPES.AUXILIARY
        ).length;

    RECEIPT.lawCount =
      Array.from(registry.values())
        .filter(
          node =>
            node.type === NODE_TYPES.LAW
        ).length;

    RECEIPT.memberCount =
      Array.from(registry.values())
        .filter(node => node.type === NODE_TYPES.MEMBER).length;

    RECEIPT.canonicalSemanticLawCount =
      lawElements.filter(element => element.matches("[data-laws-law]")).length;

    RECEIPT.canonicalSemanticMemberCount =
      lawElements.filter(element => element.matches("[data-laws-member]")).length;

    return registry;
  }

  function constellationAnchorVector() {
    return normalizeVector(
      SPHERE.constellation.primaryAnchor
    );
  }

  function clusterAnchorVector() {
    return normalizeVector(
      SPHERE.cluster.primaryAnchor
    );
  }

  function constellationQuaternionFromFrame(frame) {
    return orientationQuaternion(
      frame && frame.orbitOrientation,
      state.constellationTargetQuaternion
    );
  }

  function quaternionFromAxisAngleVector(
    axis,
    angle
  ) {
    const normalizedAxis =
      normalizeVector(
        axis,
        [1, 0, 0]
      );
    const half =
      angle * 0.5;
    const sine =
      Math.sin(half);

    return quaternionNormalize([
      normalizedAxis[0] * sine,
      normalizedAxis[1] * sine,
      normalizedAxis[2] * sine,
      Math.cos(half)
    ]);
  }

  function boundClusterQuaternion(value) {
  return quaternionNormalize(value);
}

  function clusterQuaternionFromFrame(
    frame,
    direction
  ) {
    const fallback =
      state.clusterTargetQuaternions
        .get(direction) ||
      [0, 0, 0, 1];

    if (
      frame &&
      frame.cluster &&
      frame.cluster.direction === direction &&
      frame.cluster.orientation
    ) {
      return boundClusterQuaternion(
        orientationQuaternion(
          frame.cluster.orientation,
          fallback
        )
      );
    }

    return boundClusterQuaternion(
      fallback
    );
  }

  function rotatedCategoryUnitVector(
    direction,
    quaternion =
      state.constellationQuaternion
  ) {
    return normalizeVector(
      quaternionRotateVector(
        quaternion,
        SPHERE.constellation
          .vectors[direction]
      )
    );
  }

  function rotatedLawUnitVector(
    node,
    localQuaternion
  ) {
    return normalizeVector(
      quaternionRotateVector(
        localQuaternion,
        node.sphereVector
      )
    );
  }

  function nearestPrimaryDirection(
    quaternion =
      state.constellationQuaternion
  ) {
    const anchor =
      constellationAnchorVector();

    let bestDirection =
      "flow";

    let bestScore =
      -Infinity;

    DIRECTIONS.forEach(
      direction => {
        const score =
          dot(
            rotatedCategoryUnitVector(
              direction,
              quaternion
            ),
            anchor
          );

        if (score > bestScore) {
          bestScore = score;
          bestDirection = direction;
        }
      }
    );

    return bestDirection;
  }

  function activeLawNodes(direction) {
    return Array.from(
      state.registry.values()
    ).filter(
      node =>
        (node.type === NODE_TYPES.LAW ||
         node.type === NODE_TYPES.MEMBER) &&
        node.direction === direction
    );
  }

  function nearestPrimaryLaw(
    direction,
    localQuaternion
  ) {
    const anchor =
      clusterAnchorVector();

    let bestLaw =
      "";

    let bestScore =
      -Infinity;

    activeLawNodes(direction).forEach(
      node => {
        const score =
          dot(
            rotatedLawUnitVector(
              node,
              localQuaternion
            ),
            anchor
          );

        if (score > bestScore) {
          bestScore = score;
          bestLaw = node.id;
        }
      }
    );

    return bestLaw;
  }

  function sphericalCategoryPosition(direction) {
    const unit =
      rotatedCategoryUnitVector(
        direction
      );

    return {
      x:
        unit[0] *
        SPHERE.constellation
          .horizontalRadius,

      y:
        unit[1] *
        SPHERE.constellation
          .verticalRadius,

      z:
        unit[2] *
        SPHERE.constellation
          .depthRadius,

      depth:
        (unit[2] + 1) / 2,

      primary:
        clamp(
          (
            dot(
              unit,
              constellationAnchorVector()
            ) +
            1
          ) /
            2,
          0,
          1
        )
    };
  }

  function sphericalLawPosition(
  node,
  localQuaternion
) {
  const unit = rotatedLawUnitVector(
    node,
    localQuaternion
  );

  return {
    x: unit[0] * SPHERE.cluster.horizontalRadius,
    y: unit[1] * SPHERE.cluster.verticalRadius,
    z: unit[2] * SPHERE.cluster.depthRadius,
    depth: (unit[2] + 1) / 2,
    primary:
      clamp(
        (dot(unit, clusterAnchorVector()) + 1) / 2,
        0,
        1
      )
  };
}

  function setUniformScale(
    target,
    scale
  ) {
    target.sx = scale;
    target.sy = scale;
    target.sz = scale;

    return target;
  }

  function resetNodeTargets() {
    state.registry.forEach(
      node => {
        node.visible = false;
        node.material = node.baseMaterial;

        Object.assign(
          node.target,
          {
            x:
              0,

            y:
              0,

            z:
              -1,

            sx:
              0.5,

            sy:
              0.5,

            sz:
              0.5,

            prominence:
              0,

            halo:
              0,

            rotationSpeed:
              0.06,

            float:
              0
          }
        );
      }
    );
  }

  function updateConstellationTargets() {
    state.visualPrimaryDirection =
      nearestPrimaryDirection();

    DIRECTIONS.forEach(
      direction => {
        const node =
          state.registry.get(direction);

        const sphere =
          sphericalCategoryPosition(
            direction
          );

        const primary =
          direction ===
          state.visualPrimaryDirection;

        node.visible = true;
        node.depthScore = sphere.depth;
        node.primaryScore = sphere.primary;

        const gateway=GATEWAY_IDS.includes(direction);
        node.material=direction === "test" ? "AUTHORITY_SOLAR" : direction === "research" ? "AUTHORITY_LUNAR" : primary ? "CATEGORY_FOCUSED" : "CATEGORY_IDLE";
        const scale = gateway
          ? QUALITY.gatewayBodyScale
          : (primary ? QUALITY.focusedCategoryScale : QUALITY.categoryScale) *
            (0.72 + sphere.depth * 0.42);

        Object.assign(
          node.target,
          setUniformScale(
            {
              x:
                sphere.x,

              y:
                sphere.y,

              z:
                sphere.z,

              prominence:
                clamp(
                  0.34 +
                    sphere.depth *
                      0.46 +
                    sphere.primary *
                      0.30,
                  0.10,
                  1.16
                ),

              halo:
                clamp(
                  0.24 +
                    sphere.depth *
                      0.34 +
                    sphere.primary *
                      0.54,
                  0,
                  1.28
                ),

              rotationSpeed:
                primary
                  ? 0.15
                  : 0.08 +
                    sphere.depth *
                      0.05,

              float:
                primary
                  ? 0.012
                  : 0.004 +
                    sphere.depth *
                      0.005
            },
            scale
          )
        );
      }
    );

    AUXILIARY_IDS.forEach(
      id => {
        const node =
          state.registry.get(id);

        const sphere =
          sphericalCategoryPosition(id);

        node.visible = true;
        node.depthScore = sphere.depth;
        node.primaryScore = 0;
        node.material = "AUTHORITY_IDLE";

        const scale =
          QUALITY.auxiliaryScale *
          (
            0.78 +
            sphere.depth *
              0.34
          );

        Object.assign(
          node.target,
          setUniformScale(
            {
              x:
                sphere.x,

              y:
                sphere.y,

              z:
                sphere.z,

              prominence:
                clamp(
                  0.56 +
                    sphere.depth *
                      0.48,
                  0.22,
                  1.18
                ),

              halo:
                clamp(
                  0.48 +
                    sphere.depth *
                      0.52,
                  0.24,
                  1.30
                ),

              rotationSpeed:
                0.13 +
                sphere.depth *
                  0.04,

              float:
                0.010
            },
            scale
          )
        );
      }
    );
  }

  function updateClusterTargets(
    frame,
    direction
  ) {
    const localQuaternion =
      state.clusterQuaternions
        .get(direction) ||
      [0, 0, 0, 1];

    const primaryLaw =
      nearestPrimaryLaw(
        direction,
        localQuaternion
      );

    state.visualPrimaryLaws.set(
      direction,
      primaryLaw
    );

    activeLawNodes(direction).forEach(
      node => {
        const sphere =
          sphericalLawPosition(
            node,
            localQuaternion
          );

        const selected =
          frame.state === "LAW_SELECTED" &&
          frame.selectedLaw === node.id;

        const primary =
          node.id === primaryLaw;

        node.visible = true;
        node.depthScore = sphere.depth;
        node.primaryScore = sphere.primary;

        node.material =
          selected
            ? "LAW_SELECTED"
            : primary
              ? "LAW_PRIMARY"
              : "LAW_IDLE";

        const gatewayCluster=GATEWAY_IDS.includes(direction);
        const scale=(selected ? QUALITY.selectedLawScale : primary ? QUALITY.primaryLawScale : QUALITY.lawScale) * (gatewayCluster ? 1.18 : 1);

        Object.assign(
          node.target,
          setUniformScale(
            {
              x:
                sphere.x,

              y:
                sphere.y,

              z:
                sphere.z,

              prominence:
                clamp(
                  0.30 +
                    sphere.depth *
                      0.48 +
                    sphere.primary *
                      0.28 +
                    (selected ? 0.08 : 0),
                  0.10,
                  1.14
                ),

              halo:
                clamp(
                  0.20 +
                    sphere.depth *
                      0.30 +
                    sphere.primary *
                      0.44 +
                    (selected ? 0.18 : 0),
                  0,
                  1.12
                ),

              rotationSpeed:
                primary || selected
                  ? 0.13
                  : 0.07 +
                    sphere.depth *
                      0.04,

              float:
                primary || selected
                  ? 0.012
                  : 0.004 +
                    sphere.depth *
                      0.004
            },
            scale
          )
        );
      }
    );
  }

  function updateTargets() {
    resetNodeTargets();

    const frame =
      state.frame;

    if (
      !frame ||
      frame.held
    ) {
      state.sceneProjection =
        SCENE_PROJECTIONS.HELD;

      return;
    }

    if (
      frame.presentation &&
      frame.presentation.outerCategoriesActive === true
    ) {
      state.sceneProjection =
        SCENE_PROJECTIONS.CONSTELLATION;

      updateConstellationTargets();

      return;
    }

    const activeDirection =
      normalizeDirection(
        frame.activeClusterDirection
      );

    if (
      frame.presentation &&
      frame.presentation.activeLawCluster === true &&
      activeDirection
    ) {
      state.sceneProjection =
        SCENE_PROJECTIONS.CLUSTER;

      updateClusterTargets(
        frame,
        activeDirection
      );

      return;
    }

    state.sceneProjection =
      SCENE_PROJECTIONS.HELD;
  }

  /*
   * The controller is the only authoritative quaternion owner.
   *
   * This renderer keeps interpolated visual copies only. It never creates,
   * previews, commits, cancels, or settles gesture state.
   */
  function updateQuaternionTargets(deltaSeconds) {
    const frameConstellation =
      constellationQuaternionFromFrame(
        state.frame
      );

    state.constellationTargetQuaternion =
      frameConstellation.slice();

    state.constellationQuaternion =
      state.reducedMotion
        ? frameConstellation.slice()
        : quaternionSlerp(
            state.constellationQuaternion,
            state.constellationTargetQuaternion,
            Math.min(
              1,
              deltaSeconds *
                QUALITY.visualSettleSpeed
            )
          );

    DIRECTIONS.forEach(
      direction => {
        const frameLocal =
          clusterQuaternionFromFrame(
            state.frame,
            direction
          );

        state.clusterTargetQuaternions.set(
          direction,
          frameLocal.slice()
        );

        const current =
          state.clusterQuaternions.get(
            direction
          ) ||
          frameLocal.slice();

        state.clusterQuaternions.set(
          direction,
          state.reducedMotion
            ? frameLocal.slice()
            : quaternionSlerp(
                current,
                frameLocal,
                Math.min(
                  1,
                  deltaSeconds *
                    QUALITY.visualSettleSpeed
                )
              )
        );
      }
    );
  }

  function updateTransforms(deltaSeconds) {
    const interpolation =
      state.reducedMotion
        ? 1
        : Math.min(
            1,
            deltaSeconds *
              QUALITY.transformSettleSpeed
          );

    state.registry.forEach(
      node => {
        [
          "x",
          "y",
          "z",
          "sx",
          "sy",
          "sz",
          "prominence",
          "halo",
          "rotationSpeed",
          "float"
        ].forEach(
          key => {
            node.transform[key] =
              node.transform[key] +
              (
                node.target[key] -
                node.transform[key]
              ) *
                interpolation;
          }
        );

        /* CP5_FINAL_SOLAR_NO_LOCAL_RIGID_SPIN */
        if (state.reducedMotion || node.id === "test") {
          node.transform.rx = 0;
          node.transform.ry = 0;
          node.transform.rz = 0;

          return;
        }

        node.transform.rz +=
          deltaSeconds *
          node.transform.rotationSpeed;

        node.transform.ry =
          Math.sin(
            state.time *
              0.42 +
            node.phase
          ) *
          QUALITY.maximumYaw *
          Math.max(
            0.35,
            node.transform.prominence
          );

        node.transform.rx =
          Math.sin(
            state.time *
              0.31 +
            node.phase *
              0.73
          ) *
          QUALITY.maximumPitch *
          Math.max(
            0.35,
            node.transform.prominence
          );
      }
    );
  }

  function nodeFloatY(node) {
    return state.reducedMotion
      ? 0
      : Math.sin(
          state.time *
            0.95 +
          node.lawIndex *
            0.72 +
          node.phase
        ) *
          node.transform.float;
  }

  function modelMatrix(
    node,
    haloPass
  ) {
    const transform =
      node.transform;

    const haloScale =
      haloPass
        ? node.id === "test"
          ? 1
          : 1 + transform.halo * 0.10
        : 1;

    return multiply4(
      translate4(
        transform.x,
        transform.y +
          nodeFloatY(node),
        transform.z
      ),
      multiply4(
        rotateZ4(transform.rz),
        multiply4(
          rotateY4(transform.ry),
          multiply4(
            rotateX4(transform.rx),
            scale4(
              transform.sx *
                haloScale,
              transform.sy *
                haloScale,
              transform.sz *
                haloScale
            )
          )
        )
      )
    );
  }

  function isPlanetNode(node) {
    const participant =
      state.planetParticipant ||
      resolvePlanetParticipant();

    if (
      participant &&
      typeof participant.isPlanetNode === "function"
    ) {
      return Boolean(
        participant.isPlanetNode(node)
      );
    }

    return Boolean(
      node &&
      node.type === NODE_TYPES.PLANET &&
      node.id === CONTRACT.planetParticipantNodeId
    );
  }

  function worldCenter(node) {
    if (isPlanetNode(node)) {
      const participant =
        state.planetParticipant ||
        resolvePlanetParticipant();

      if (
        participant &&
        typeof participant.getWorldCenter === "function"
      ) {
        return participant.getWorldCenter(node);
      }

      return [
        0,
        0,
        0
      ];
    }

    return [
      node.transform.x,

      node.transform.y +
        nodeFloatY(node),

      node.transform.z
    ];
  }

  function configureSharedUniforms(renderer) {
    const gl =
      renderer.gl;

    gl.useProgram(renderer.program);

    gl.uniform3f(
      renderer.uniforms.keyLight,
      -0.42,
      -0.82,
      -0.68
    );

    gl.uniform3f(
      renderer.uniforms.fillLight,
      0.72,
      -0.24,
      -0.54
    );

    gl.uniform3f(
      renderer.uniforms.rimLight,
      0.08,
      0.46,
      1
    );

    gl.uniform3f(
      renderer.uniforms.ambientColor,
      0.10,
      0.12,
      0.18
    );
  }

  function applyMaterial(
    renderer,
    materialName,
    prominence,
    haloStrength
  ) {
    const gl =
      renderer.gl;

    const material =
      MATERIALS[materialName] ||
      MATERIALS.CATEGORY_IDLE;

    const bloomDisabled =
      state.compositorFrame
        .viewport
        .cssWidth <=
      QUALITY.bloomDisableWidthPx;

    /* CP5_FINAL_SOLAR_PHONE_GLOW_PRESERVATION */
    const solarMaterial =
      materialName === "AUTHORITY_SOLAR";

    gl.uniform1f(
      renderer.uniforms.twinkle,
      state.reducedMotion ? 0 : 1
    );

    gl.uniform1f(
      renderer.uniforms.sparkle,
      state.reducedMotion
        ? 0
        : material.sparkle
    );

    gl.uniform1f(
      renderer.uniforms.prominence,
      prominence
    );

    gl.uniform1f(
      renderer.uniforms.specular,
      material.specular
    );

    gl.uniform1f(
      renderer.uniforms.rim,
      material.rim
    );

    gl.uniform1f(
      renderer.uniforms.emissive,
      material.emissive
    );

    gl.uniform1f(
      renderer.uniforms.alpha,
      material.alpha
    );

    gl.uniform1f(
      renderer.uniforms.contrast,
      material.contrast
    );

    gl.uniform1f(
      renderer.uniforms.haloStrength,
      bloomDisabled && !solarMaterial
        ? 0
        : material.halo *
          haloStrength
    );

    gl.uniform1f(
      renderer.uniforms.saturation,
      1
    );
  }

  function drawPlanetNode(
    renderer,
    node,
    haloPass
  ) {
    const participant =
      state.planetParticipant ||
      resolvePlanetParticipant();

    if (
      !participant ||
      typeof participant.draw !== "function"
    ) {
      return 0;
    }

    const drawCalls =
      participant.draw({
        renderer,
        node,
        haloPass:
          Boolean(haloPass),

        viewMatrix:
          state.compositor
            .getViewMatrix(),

        projectionMatrix:
          state.compositor
            .getProjectionMatrix(),

        time:
          state.time,

        deltaSeconds:
          state.compositorFrame
            ? state.compositorFrame.deltaSeconds
            : 0.016,

        frame:
          state.frame,

        compositorFrame:
          state.compositorFrame,

        reducedMotion:
          state.reducedMotion
      }) || 0;

    state.planetDrawCallsLastFrame +=
      drawCalls;

    return drawCalls;
  }

  function drawNode(
    renderer,
    node,
    haloPass
  ) {
    if (isPlanetNode(node)) {
      return drawPlanetNode(
        renderer,
        node,
        haloPass
      );
    }

    const mesh =
      renderer.meshes.get(
        node.meshKey
      );

    if (!mesh) {
      return 0;
    }

    const gl =
      renderer.gl;

    bindAttrib(
      gl,
      mesh.position,
      renderer.attribs.position,
      3
    );

    bindAttrib(
      gl,
      mesh.normal,
      renderer.attribs.normal,
      3
    );

    bindAttrib(
      gl,
      mesh.color,
      renderer.attribs.color,
      3
    );

    const model =
      modelMatrix(
        node,
        haloPass
      );

    const view =
      state.compositor
        .getViewMatrix();

    const projection =
      state.compositor
        .getProjectionMatrix();

    const normalMatrix =
      inverseTransposeNormalMatrix3(
        multiply4(
          view,
          model
        )
      );

    gl.useProgram(
      renderer.program
    );

    gl.uniformMatrix4fv(
      renderer.uniforms.model,
      false,
      new Float32Array(model)
    );

    gl.uniformMatrix4fv(
      renderer.uniforms.view,
      false,
      new Float32Array(view)
    );

    gl.uniformMatrix4fv(
      renderer.uniforms.projection,
      false,
      new Float32Array(projection)
    );

    gl.uniformMatrix3fv(
      renderer.uniforms.normalMatrix,
      false,
      new Float32Array(normalMatrix)
    );

    gl.uniform1f(
      renderer.uniforms.time,
      state.time
    );

    gl.uniform1f(
      renderer.uniforms.haloPass,
      haloPass ? 1 : 0
    );

    gl.uniform1f(
      renderer.uniforms.solarBody,
      node.id === "test" ? 1 : 0
    );

    gl.uniform1f(
      renderer.uniforms.haloExpansion,
      node.id === "test" ? 0.14 : 0.075
    );

    applyMaterial(
      renderer,
      node.material,
      node.transform.prominence,
      node.transform.halo
    );

    gl.drawArrays(
      gl.TRIANGLES,
      0,
      mesh.vertexCount
    );

    return 1;
  }

  function drawCrystalNodes(
    renderer,
    nodes
  ) {
    const gl =
      renderer.gl;

    const layer =
      renderer.id === DEPTH_LAYERS.REAR
        ? state.compositor.getRearLayer()
        : state.compositor.getFrontLayer();

    gl.viewport(
      0,
      0,
      layer.width,
      layer.height
    );

    gl.clearColor(0, 0, 0, 0);

    gl.clear(
      gl.COLOR_BUFFER_BIT |
      gl.DEPTH_BUFFER_BIT
    );

    configureSharedUniforms(renderer);

    let drawCalls =
      0;

    const bloomDisabled =
      layer.cssWidth <=
      QUALITY.bloomDisableWidthPx;

    const haloNodes =
      bloomDisabled
        ? nodes.filter(node => node.id === "test")
        : nodes;

    /* CP5_R2_SOLAR_IRREGULAR_GASEOUS_CORONA */
    if (haloNodes.length) {
      gl.depthMask(false);
      gl.blendFunc(gl.SRC_ALPHA, gl.ONE);
      haloNodes.forEach(node => {
        drawCalls += drawNode(renderer, node, true);
      });
    }

    gl.depthMask(true);

    gl.blendFunc(
      gl.SRC_ALPHA,
      gl.ONE_MINUS_SRC_ALPHA
    );

    nodes.forEach(
      node => {
        drawCalls +=
          drawNode(
            renderer,
            node,
            false
          );
      }
    );

    const error =
      gl.getError();

    invariant(
      error === gl.NO_ERROR,
      `LAWS_CRYSTALS_${renderer.id}_DRAW_FAILURE`,
      {
        error
      }
    );

    return Object.freeze({
      drawCalls,
      visibleNodeCount:
        nodes.length
    });
  }

  function projectedRadiusForNode(node) {
    const base =
      node.type === NODE_TYPES.AUXILIARY
        ? 88
        : node.type === NODE_TYPES.CATEGORY
          ? 78
          : 48;

    return Math.max(
      18,
      base *
        node.transform.sx
    );
  }

  /*
   * Crystals supplies identity and world position for law/category nodes.
   * Compositor supplies screen position, depth, and overlap facts.
   * Controller supplies interaction authorization.
   * CSS supplies visible label presentation.
   *
   * Planet nodes are intentionally excluded from semantic law/category
   * projection records. The semantic Main Compass control remains
   * [data-upstream-compass-control].
   */
  function buildSemanticProjectionRecords(
    visibleNodes
  ) {
    const records = [];

    visibleNodes
      .filter(
        node =>
          node &&
          (
            node.type === NODE_TYPES.CATEGORY ||
             node.type === NODE_TYPES.AUXILIARY ||
             node.type === NODE_TYPES.LAW ||
             node.type === NODE_TYPES.MEMBER
          )
      )
      .forEach(
        node => {
          const projected =
            state.compositor
              .projectWorldPoint(
                worldCenter(node),
                {
                  projectedRadius:
                    projectedRadiusForNode(
                      node
                    ),

                  nodeId:
                    node.id,

                  nodeType:
                    node.type
                }
              );

          node.projectedScreen =
            projected || null;

          if (!projected) {
            records.push({
              id:
                node.id,

              kind:
                node.type,

              x:
                0,

              y:
                0,

              depthLayer:
                node.depthLayer
                  .toLowerCase(),

              compassOverlap:
                false,

              visible:
                false
            });

            return;
          }

          records.push({
            id:
              node.id,

            kind:
              node.type,

            x:
              finiteNumber(
                projected.x,
                0
              ),

            y:
              finiteNumber(
                projected.y,
                0
              ),

            radiusPx:
              projectedRadiusForNode(
                node
              ),

            depthLayer:
              node.depthLayer
                .toLowerCase(),

            compassOverlap:
              Boolean(
                projected.compassOverlap
              ),

            visible:
              node.visible &&
              node.transform.prominence >=
                QUALITY.projectionVisibilityThreshold &&
              projected.visible !== false
          });
        }
      );

    return records;
  }

  function submitSemanticProjection(records) {
    const accepted =
      state.controller
        .updateSemanticProjection(
          records
        );

    RECEIPT.semanticProjectionRecordCount =
      records.length;

    RECEIPT.semanticProjectionSubmitted =
      accepted !== false;
  }

  function visibleRegistryNodes() {
    return Array.from(
      state.registry.values()
    ).filter(
      node =>
        node.visible &&
        node.transform.prominence >=
          0.04
    );
  }

  function resolvePlanetNode(deltaSeconds) {
    const participant =
      state.planetParticipant ||
      resolvePlanetParticipant();

    if (!participant) {
      state.planetNode =
        null;

      state.planetNodeAdmitted =
        false;

      return null;
    }

    let node =
      null;

    try {
      node =
        participant.getNode({
          time:
            state.time,

          nowSeconds:
            state.time,

          deltaSeconds,

          frame:
            state.frame,

          compositorFrame:
            state.compositorFrame,

          reducedMotion:
            state.reducedMotion
        });
    } catch (error) {
      state.planetNode =
        null;

      state.planetNodeAdmitted =
        false;

      emitFailure(
        "LAWS_CRYSTALS_PLANET_NODE_REQUEST_FAILED",
        {
          code:
            error && error.code
              ? error.code
              : "",

          message:
            error && error.message
              ? error.message
              : String(error),

          details:
            error && error.details
              ? error.details
              : null
        }
      );

      return null;
    }

    if (
      node &&
      participant.isPlanetNode(node)
    ) {
      state.planetNode =
        node;

      state.planetNodeAdmitted =
        true;

      return node;
    }

    state.planetNode =
      null;

    state.planetNodeAdmitted =
      false;

    return null;
  }

  function emitReceipt(extra = {}) {
    const participant =
      state.planetParticipant ||
      null;

    Object.assign(
      RECEIPT,
      {
        controllerModuleId:
          state.controller
            ? state.controller.moduleId
            : "",

        controllerModuleVersion:
          state.controller
            ? state.controller.moduleVersion
            : "",

        compositorModuleId:
          state.compositor
            ? state.compositor.moduleId
            : "",

        compositorModuleVersion:
          state.compositor
            ? state.compositor.moduleVersion
            : "",

        planetParticipantModuleId:
          participant
            ? participant.moduleId || ""
            : "",

        planetParticipantModuleVersion:
          participant
            ? participant.moduleVersion || ""
            : "",

        planetParticipantAvailable:
          Boolean(participant),

        planetParticipantAccepted:
          Boolean(
            participant &&
            participant.moduleId ===
              CONTRACT.planetParticipantModuleId &&
            participant.moduleVersion ===
              CONTRACT.planetParticipantModuleVersion
          ),

        planetParticipantNodeAvailable:
          Boolean(state.planetNode),

        planetParticipantNodeAdmitted:
          Boolean(state.planetNodeAdmitted),

        planetDrawDelegated:
          state.planetDrawCallsLastFrame > 0,

        planetDrawCallsLastFrame:
          state.planetDrawCallsLastFrame,

        planetVisibleObjectCount:
          state.planetNodeAdmitted ? 1 : 0,

        planetRegistryMember:
          false,

        planetCategoryMember:
          false,

        planetLawMember:
          false,

        planetAuthorityOwned:
          false,

        planetGeometryOwned:
          false,

        planetRotationOwned:
          false,

        sceneProjection:
          state.sceneProjection,

        activeClusterDirection:
          state.frame
            ? normalizeDirection(
                state.frame
                  .activeClusterDirection
              )
            : "",

        primaryDirection:
          state.visualPrimaryDirection,

        primaryLaw:
          state.frame &&
          state.frame.activeClusterDirection
            ? state.visualPrimaryLaws.get(
                state.frame
                  .activeClusterDirection
              ) || ""
            : "",

        reducedMotion:
          state.reducedMotion,

        canonicalLawControlsRelocated:
          state.relocatedLawElements.length === 24,

        relocatedCanonicalLawCount:
          state.relocatedLawElements.length,

        generatedLawProxyCount:
          0,

        clonedLawControlCount:
          0,

        pointerInterpreterOwned:
          false,

        swipeInterpreterOwned:
          false,

        clusterExitOwned:
          false,

        semanticInteractionAuthorityOwned:
          false,

        labelPresentationOwned:
          false,

        compassOverlapPolicyOwned:
          false,

        cameraOwned:
          false,

        depthClassificationOwned:
          false,

        layerConstructionOwned:
          false,

        crystalGeometryOwned:
          true,

        semanticAssociationOwned:
          true,

        routeAuthorityOwned:
          false,

        navigationStateOwned:
          false,

        humanLawContentOwned:
          false,

        softwareLawContentOwned:
          false,

        doctrineOwned:
          false,

        visualPassClaimed:
          false
      },
      extra
    );

    const serialized =
      JSON.stringify(RECEIPT);

    if (state.root) {
      state.root.dataset
        .lawsCrystalsReceipt =
        serialized;

      state.root.dataset
        .lawsCrystalsStatus =
        RECEIPT.status;

      state.root.dataset
        .lawsCrystalsVersion =
        CONTRACT.version;

      state.root.dataset
        .lawsCrystalsPointerInterpreterOwned =
        "false";

      state.root.dataset
        .lawsCrystalsSwipeInterpreterOwned =
        "false";

      state.root.dataset
        .lawsCrystalsClusterExitOwned =
        "false";

      state.root.dataset
        .lawsCrystalsLabelPresentationOwned =
        "false";

      state.root.dataset
        .lawsCrystalsSemanticInteractionAuthorityOwned =
        "false";

      state.root.dataset
        .lawsCrystalsCameraOwned =
        "false";

      state.root.dataset
        .lawsCrystalsDepthClassificationOwned =
        "false";

      state.root.dataset
        .lawsCrystalsLayerConstructionOwned =
        "false";

      state.root.dataset
        .lawsCrystalsCrystalGeometryOwned =
        "true";

      state.root.dataset
        .lawsCrystalsContainLawContent =
        "false";

      state.root.dataset
        .lawsCrystalsPlanetParticipantAvailable =
        participant ? "true" : "false";

      state.root.dataset
        .lawsCrystalsPlanetParticipantAdmitted =
        state.planetNodeAdmitted ? "true" : "false";

      state.root.dataset
        .lawsCrystalsPlanetAuthorityOwned =
        "false";

      state.root.dataset
        .lawsCrystalsPlanetGeometryOwned =
        "false";

      state.root.dataset
        .lawsCrystalsPlanetRotationOwned =
        "false";

      state.root.dataset
        .lawsCrystalsPlanetRegistryMember =
        "false";

      state.root.dataset
        .visualPassClaimed =
        "false";
    }

    if (state.receiptOutput) {
      if ("value" in state.receiptOutput) {
        state.receiptOutput.value =
          serialized;
      }

      state.receiptOutput.textContent =
        serialized;
    }

    globalThis
      .DGB_LAWS_CRYSTALS_RECEIPT =
      Object.freeze({
        ...RECEIPT
      });
  }

  function emitFailure(
    reason,
    details = null
  ) {
    state.running = false;

    if (state.raf) {
      cancelAnimationFrame(state.raf);
      state.raf = 0;
    }

    emitReceipt({
      status:
        "held",

      rendererInitialized:
        false,

      lastError:
        String(
          reason ||
          "UNKNOWN_ERROR"
        )
    });

    globalThis.dispatchEvent(
      new CustomEvent(
        "LAWS_CRYSTALS_RENDER_FAILURE",
        {
          detail:
            Object.freeze({
              reason:
                String(
                  reason ||
                  "UNKNOWN_ERROR"
                ),

              details
            })
        }
      )
    );
  }

  function render(now) {
    if (
      !state.running ||
      state.disposed
    ) {
      return;
    }

    const seconds =
      now * 0.001;

    const deltaSeconds =
      state.lastTime
        ? Math.min(
            QUALITY.maximumDeltaSeconds,
            Math.max(
              0,
              seconds -
                state.lastTime
            )
          )
        : 0.016;

    state.lastTime = seconds;
    state.time = seconds;

    state.planetDrawCallsLastFrame =
      0;

    try {
      state.frame =
        state.controller
          .getFrameState();

      state.reducedMotion =
        Boolean(
          state.frame.reducedMotion
        );

      state.compositorFrame =
        state.compositor
          .beginFrame({
            frame:
              state.frame,

            nowSeconds:
              seconds,

            deltaSeconds
          });

      updateQuaternionTargets(
        deltaSeconds
      );

      updateTargets();

      updateTransforms(
        deltaSeconds
      );

      const lawAndCategoryNodes =
        visibleRegistryNodes();

      const planetNode =
        resolvePlanetNode(
          deltaSeconds
        );

      const visibleNodes =
        [
          ...lawAndCategoryNodes,
          planetNode
        ].filter(Boolean);

      const result =
        state.compositor
          .renderComposite({
            nodes:
              visibleNodes,

            getWorldCenter:
              worldCenter,

            getPreviousLayer:
              node =>
                node.previousDepthLayer ||
                DEPTH_LAYERS.REAR,

            setClassification:
              (
                node,
                classification
              ) => {
                node.depthLayer =
                  classification.layer;

                node.previousDepthLayer =
                  classification.layer;

                node.viewDepth =
                  classification.viewDepth;

                node.depthOffsetFromCompassPlane =
                  classification
                    .offsetFromCompassPlane;
              },

            sort:
              (a, b) =>
                a.viewDepth -
                b.viewDepth,

            drawRear:
              nodes =>
                drawCrystalNodes(
                  state.renderers.get(
                    DEPTH_LAYERS.REAR
                  ),
                  nodes
                ),

            drawFront:
              nodes =>
                drawCrystalNodes(
                  state.renderers.get(
                    DEPTH_LAYERS.FRONT
                  ),
                  nodes
                )
          });

      const projectionRecords =
        buildSemanticProjectionRecords(
          lawAndCategoryNodes
        );

      submitSemanticProjection(
        projectionRecords
      );

      emitReceipt({
        status:
          "available",

        rendererInitialized:
          true,

        rearDrawCallsLastFrame:
          result.rearResult
            ? result.rearResult.drawCalls
            : 0,

        frontDrawCallsLastFrame:
          result.frontResult
            ? result.frontResult.drawCalls
            : 0,

        rearVisibleObjectCount:
          result.rearNodes.length,

        frontVisibleObjectCount:
          result.frontNodes.length,

        semanticProjectionRecordCount:
          projectionRecords.length,

        semanticProjectionSubmitted:
          true
      });

      state.raf =
        requestAnimationFrame(render);
    } catch (error) {
      emitFailure(
        "LAWS_CRYSTALS_FRAME_FAILURE",
        {
          code:
            error && error.code
              ? error.code
              : "",

          message:
            error && error.message
              ? error.message
              : String(error),

          details:
            error && error.details
              ? error.details
              : null
        }
      );
    }
  }

  function initializeOrientations() {
    state.frame =
      state.controller
        .getFrameState();

    const constellation =
      constellationQuaternionFromFrame(
        state.frame
      );

    state.constellationQuaternion =
      constellation.slice();

    state.constellationTargetQuaternion =
      constellation.slice();

    state.visualPrimaryDirection =
      nearestPrimaryDirection(
        constellation
      );

    DIRECTIONS.forEach(
      direction => {
        const local =
          clusterQuaternionFromFrame(
            state.frame,
            direction
          );

        state.clusterQuaternions.set(
          direction,
          local.slice()
        );

        state.clusterTargetQuaternions.set(
          direction,
          local.slice()
        );

        state.visualPrimaryLaws.set(
          direction,
          nearestPrimaryLaw(
            direction,
            local
          )
        );
      }
    );

    updateTargets();
  }

  function initializeRenderers() {
    const cpuMeshes =
      createCpuMeshes();

    state.renderers.set(
      DEPTH_LAYERS.REAR,
      createRenderer(
        state.compositor
          .getRearLayer(),
        cpuMeshes
      )
    );

    state.renderers.set(
      DEPTH_LAYERS.FRONT,
      createRenderer(
        state.compositor
          .getFrontLayer(),
        cpuMeshes
      )
    );
  }

  function exposeApi() {
    globalThis
      .DGB_LAWS_CRYSTALS =
      Object.freeze({
        moduleId:
          "DGB_LAWS_CRYSTALS",

        moduleVersion:
          CONTRACT.version,

        contract:
          CONTRACT,

        sphere:
          SPHERE,

        clusterOrbit:
          SPHERE.cluster,

        getClusterOrbitContract:
          () => Object.freeze({
            ...SPHERE.cluster,
            planeNormal:
              Object.freeze(
                SPHERE.cluster
                  .planeNormal
                  .slice()
              )
          }),

        nodeTypes:
          NODE_TYPES,

        receipt:
          () =>
            Object.freeze({
              ...RECEIPT
            }),

        getSceneProjection:
          () =>
            state.sceneProjection,

        getRelocatedLawControls:
          () =>
            Object.freeze(
              state.relocatedLawElements.map(
                element =>
                  element.dataset.lawId ||
                  element.dataset.memberId ||
                  ""
              )
            ),

        getDepthAssignments:
          () =>
            Object.freeze(
              Array.from(
                state.registry.values()
              ).reduce(
                (
                  result,
                  node
                ) => {
                  result[node.id] =
                    Object.freeze({
                      layer:
                        node.depthLayer,

                      viewDepth:
                        node.viewDepth,

                      offsetFromCompassPlane:
                        node
                          .depthOffsetFromCompassPlane
                    });

                  return result;
                },
                state.planetNode
                  ? {
                      [state.planetNode.id]:
                        Object.freeze({
                          layer:
                            state.planetNode
                              .depthLayer,

                          viewDepth:
                            state.planetNode
                              .viewDepth,

                          offsetFromCompassPlane:
                            state.planetNode
                              .depthOffsetFromCompassPlane
                        })
                    }
                  : {}
              )
            ),

        getPlanetParticipantState:
          () =>
            Object.freeze({
              available:
                Boolean(
                  state.planetParticipant
                ),

              admitted:
                Boolean(
                  state.planetNodeAdmitted
                ),

              nodeId:
                state.planetNode
                  ? state.planetNode.id
                  : "",

              nodeType:
                state.planetNode
                  ? state.planetNode.type
                  : "",

              registryMember:
                false,

              categoryMember:
                false,

              lawMember:
                false,

              authorityOwned:
                false
            }),

        stop:
          () => {
            state.running = false;

            if (state.raf) {
              cancelAnimationFrame(
                state.raf
              );

              state.raf = 0;
            }

            emitReceipt({
              status:
                "stopped"
            });

            return true;
          },

        start:
          () => {
            if (
              !state.running &&
              !state.disposed
            ) {
              state.running = true;
              state.lastTime = 0;

              state.raf =
                requestAnimationFrame(
                  render
                );
            }

            return state.running;
          },

        dispose
      });
  }

  function dispose() {
    if (state.disposed) {
      return true;
    }

    state.disposed = true;
    state.running = false;

    if (state.raf) {
      cancelAnimationFrame(state.raf);
      state.raf = 0;
    }

    try {
      state.controller
        .updateSemanticProjection([]);
    } catch (_) {}

    for (
      const renderer
      of state.renderers.values()
    ) {
      destroyRenderer(renderer);
    }

    state.renderers.clear();

    restoreCanonicalLawControls();

    emitReceipt({
      status:
        "disposed",

      rendererInitialized:
        false,

      rearWebGlInitialized:
        false,

      frontWebGlInitialized:
        false,

      rearVisibleObjectCount:
        0,

      frontVisibleObjectCount:
        0,

      planetVisibleObjectCount:
        0,

      planetParticipantNodeAdmitted:
        false,

      semanticProjectionRecordCount:
        0,

      semanticProjectionSubmitted:
        true
    });

    return true;
  }

  function rollbackInitialization() {
    for (
      const renderer
      of state.renderers.values()
    ) {
      try {
        destroyRenderer(renderer);
      } catch (_) {}
    }

    state.renderers.clear();

    restoreCanonicalLawControls();

    if (
      state.compositorInitializedHere &&
      state.compositor &&
      typeof state.compositor.dispose ===
        "function"
    ) {
      try {
        state.compositor.dispose();
      } catch (_) {}
    }
  }

  function initializeCompositor() {
    const receiptBefore =
      typeof state.compositor.receipt ===
        "function"
        ? state.compositor.receipt()
        : null;

    const alreadyInitialized =
      Boolean(
        receiptBefore &&
        receiptBefore.initialized
      );

    state.compositor.initialize();

    state.compositorInitializedHere =
      !alreadyInitialized;
  }

  function init() {
    try {
      resolveDom();

      state.controller =
        requireController();

      state.compositor =
        requireCompositor();

      try {
        resolvePlanetParticipant();
      } catch (_) {
        state.planetParticipant =
          null;
      }

      initializeCompositor();

      relocateCanonicalLawControls();

      state.registry =
        buildRegistry();

      validateClusterSphereContract();

      initializeRenderers();

      initializeOrientations();

      exposeApi();

      state.running = true;

      emitReceipt({
        status:
          "available",

        rendererInitialized:
          true,

        rearWebGlInitialized:
          true,

        frontWebGlInitialized:
          true,

        canonicalLawControlsRelocated:
          true,

        relocatedCanonicalLawCount:
          16,

        pointerInterpreterOwned:
          false,

        swipeInterpreterOwned:
          false,

        clusterExitOwned:
          false,

        labelPresentationOwned:
          false,

        semanticInteractionAuthorityOwned:
          false,

        routeAuthorityOwned:
          false,

        navigationStateOwned:
          false,

        humanLawContentOwned:
          false,

        softwareLawContentOwned:
          false,

        doctrineOwned:
          false,

        planetParticipantAvailable:
          Boolean(
            state.planetParticipant
          ),

        planetParticipantAccepted:
          Boolean(
            state.planetParticipant
          ),

        planetAuthorityOwned:
          false,

        planetGeometryOwned:
          false,

        planetRotationOwned:
          false,

        planetRegistryMember:
          false,

        planetCategoryMember:
          false,

        planetLawMember:
          false
      });

      state.raf =
        requestAnimationFrame(render);
    } catch (error) {
      rollbackInitialization();

      emitFailure(
        "LAWS_CRYSTALS_INIT_FAILURE",
        {
          code:
            error && error.code
              ? error.code
              : "",

          message:
            error && error.message
              ? error.message
              : String(error),

          details:
            error && error.details
              ? error.details
              : null
        }
      );
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener(
      "DOMContentLoaded",
      init,
      {
        once: true
      }
    );
  } else {
    init();
  }
})();

/*
DGB_LAWS_CRYSTALS_CONTROLLER_DECOUPLING_WITH_PLANET_PARTICIPANT_RESULT_v1

Artifact:
 /laws/index.crystals.js

Module:
 DGB_LAWS_CRYSTALS
 1.1.0-controller-decoupled-crystal-renderer-with-planet-participant

Controller dependency:
 DGB_LAWS_CONTROLLER
 1.0.0-law-compass-controller-authority

Compositor dependency:
 DGB_LAWS_COMPOSITOR
 1.0.0-camera-depth-layer-orchestration

Optional planet participant dependency:
 DGB_LAWS_PLANET_WORLD_PARTICIPANT
 1.0.0-laws-world-pass-participant

Renewal:
- adds NODE_TYPES.PLANET = "compass-planet"
- admits optional DGB_LAWS_PLANET_WORLD_PARTICIPANT node into shared compositor pass
- delegates planet draw to DGB_LAWS_PLANET_WORLD_PARTICIPANT.draw()
- uses participant.getWorldCenter() for planet world center
- uses participant.isPlanetNode() for participant identification
- preserves crystal renderer as shared pass consumer, not planet authority
- keeps semantic projection records limited to law/category nodes
- emits planet participant receipt fields
- preserves category count at 4
- preserves law count at 16
- preserves canonical law-control relocation
- preserves controller authority boundary
- preserves compositor camera/depth/layer authority boundary

Retained:
- crystal meshes
- crystal materials
- shader programs
- WebGL buffers
- controller-frame quaternion consumption
- nonauthoritative visual quaternion interpolation
- crystal target calculation
- crystal motion
- rear crystal drawing
- front crystal drawing
- canonical control association
- canonical law-control relocation
- visible-node delivery to compositor
- renderer lifecycle
- failure reporting
- bounded semantic projection records
- projected screen position forwarding
- compositor depth result forwarding
- compositor Compass-overlap result forwarding
- controller.updateSemanticProjection(records)

Not owned:
- planet identity
- Audralia geometry source
- planet terrain source
- planet material source
- planet rotation state
- planet receipt authority
- pointerdown handling
- pointermove handling
- pointerup handling
- pointercancel handling
- pointer capture
- drag dead-zone interpretation
- swipe classification
- drag quaternion generation
- orbit gesture begin calls
- orbit gesture preview calls
- orbit gesture commit calls
- orbit gesture cancel calls
- cluster gesture begin calls
- cluster gesture preview calls
- cluster gesture commit calls
- cluster gesture cancel calls
- cluster-exit classification
- cluster-exit transition calls
- post-drag click suppression
- pointer-territory classification
- Compass bounding-rectangle measurement
- Compass-overlap policy decisions
- semantic pointer-event authorization
- semantic tabindex authorization
- semantic aria-hidden authorization
- inline label position styling
- inline label transform styling
- inline label scale styling
- inline label opacity styling
- inline label size styling
- inline label typography styling
- canonical navigation state
- transition legality
- route authority
- human-law statements
- software-law statements
- failure-pattern statements
- audit-question statements
- page doctrine
- contextual narrative

Runtime authority:
- interactions owns swipe classification
- controller owns accepted state and navigation transition
- compositor owns camera, projection, depth, and layer ordering
- planet participant owns planet identity, geometry adaptation, and rotation state
- crystals owns shared world-pass consumption and law/category crystal rendering

Crystals contains human-law statements:
 FALSE

Crystals contains software-law statements:
 FALSE

Crystals contains failure-pattern statements:
 FALSE

Crystals contains audit-question statements:
 FALSE

Crystals contains doctrine:
 FALSE

Crystals owns planet authority:
 FALSE

Controller modified:
 FALSE

Compositor modified:
 FALSE

HTML modified:
 FALSE

CSS modified:
 FALSE

Runtime execution:
 NOT PERFORMED

Visual acceptance:
 NOT CLAIMED

Production authorization:
 FALSE

Deployment authorization:
 FALSE
*/
