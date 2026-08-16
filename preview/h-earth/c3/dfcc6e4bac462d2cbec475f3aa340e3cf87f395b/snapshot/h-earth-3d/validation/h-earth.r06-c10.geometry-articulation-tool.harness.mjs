#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { createHash } from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { pathToFileURL } from 'node:url';

const HARNESS_ID = 'H_EARTH_R06_C10_GEOMETRY_ARTICULATION_TOOL_HARNESS_v1';
const BASELINE_COMMIT = '6836288462bbbc7ab7c03d5f12fafaab119f9e36';
const SOURCE_ARCHIVE_SHA256 = '311429d6ce5206396847d68e9dc275425ed1ec6d918da92cf9b54001767149fb';
const SOURCE_ARCHIVE_BYTES = 179997;
const SOURCE_ARCHIVE_MEMBER_COUNT = 39;
const CORRECTION_ARCHIVE_SHA256 = '9903e8c5d78ead39f619efdfde4ed9ea93638a0cb4b7a7a951dc8bd19e1114a8';
const ERRATUM_ARCHIVE_SHA256 = '9b2f06af3387823dd48b1a7a13ab8c83d6e936b2510a9b5fa4ed5247fb758b50';
const ERRATUM_SCHEMA_SHA256 = '8bc185349c6f0cf260a4288fb3dc0873eb424a1d16059c98d9907cb8951a3982';
const EXPECTED_FIELD_SHA256 = 'd4bb9d94f052d6b43a6408e72bff874afe8d386809a8b2073093c86f9805f662';
const EXPECTED_FIELD_SAMPLE_COUNT = 1023;
const C2_TOOL_BLOB = '569553d2d08e954c0459db98770faaf1c210230c';
const C3_AUTHORING_BLOB = 'fca63387cf1599e12f97e75e16f9e33f92880896';
const C3_CLEARANCE_BLOB = '53ad54911e7108f1bdbfbef39cb59b814ae76785';
const C3_RECEIPT_BLOB = '80cabf44744f9a572915c48382feef145dd4897a';

const PORTABLE_AUTHORITY_BUNDLE = Object.freeze({"bundleId":"H_EARTH_R06_C10_C4_PORTABLE_AUTHORITY_BUNDLE_v1","classification":"EXACT_HASH_BOUND_REQUIRED_MEMBER_SUBSET_FOR_PORTABLE_HARNESS_EXECUTION","sourcePackage":{"archiveSha256":"311429d6ce5206396847d68e9dc275425ed1ec6d918da92cf9b54001767149fb","archiveByteCount":179997,"archiveMemberCount":39,"originalCoreManifestMemberCount":35,"detachedCompleteManifestMemberCount":39},"custodyCorrection":{"archiveSha256":"9903e8c5d78ead39f619efdfde4ed9ea93638a0cb4b7a7a951dc8bd19e1114a8","detachedManifestSha256":"129466ffc161a25e9c9b1e7d2d6594b92408fee6a9f36155c75111ece7f186db"},"schemaErratum":{"archiveSha256":"9b2f06af3387823dd48b1a7a13ab8c83d6e936b2510a9b5fa4ed5247fb758b50","replacementSchemaSha256":"8bc185349c6f0cf260a4288fb3dc0873eb424a1d16059c98d9907cb8951a3982"},"members":{"records/02_EXACT_ACCEPTED_BASELINE_LEDGER_v1.json":{"authorityClass":"SOURCE_ROLE_6_PACKAGE","sha256":"c5a7c5eb7fe261c8b7c385e8ba6605bd33fa1bd6b88f9c24f749d914b024bf3c","utf8":"{\n  \"acceptedLiveBaselineCommit\": \"6836288462bbbc7ab7c03d5f12fafaab119f9e36\",\n  \"baselineClass\": \"NEW_ACCEPTED_LIVE_H_EARTH_VISUAL_AND_FUNCTIONAL_FLOOR\",\n  \"promotionPr\": 532,\n  \"publicLiveRoute\": \"https://diamondgatebridge.com/showroom/globe/h-earth/\",\n  \"publicVerificationOperation\": \"H_EARTH_TERRAIN_RELIEF_V2_POSTMERGE_PUBLIC_BROWSER_VERIFICATION_001\",\n  \"publicVerificationResult\": \"PASS_NINE_BROWSER_SCENARIOS\",\n  \"publicVerificationRun\": 30836958689,\n  \"recordId\": \"EXACT_ACCEPTED_BASELINE_LEDGER_v1\",\n  \"repository\": \"smansfield635-create/smansfield635-create.github.io\",\n  \"reviewedCandidateHead\": \"97003e9de386a8962fb46d0b370005b900a167d6\",\n  \"sourceAuthorities\": [\n    {\n      \"blob\": \"ed9ff1f7d3c139a1cba7df169f278336342339f4\",\n      \"controllingSymbols\": [\n        \"resolveAddressRecord\",\n        \"resolveRegionProfileForAddress\",\n        \"resolveColumnVariant\",\n        \"resolveObjectHintsForAddress\",\n        \"H_EARTH_256_LATTICE_LANDSCAPE_DIMENSION_MAP\"\n      ],\n      \"path\": \"h-earth-3d/zones/ground-cell-001.landscape-lattice.js\",\n      \"role\": \"LATTICE_ADDRESS_AND_LANDSCAPE_DESCRIPTOR_AUTHORITY\"\n    },\n    {\n      \"blob\": \"8f20a80ce5797b3616bee64a53d95911c641e46b\",\n      \"controllingSymbols\": [\n        \"buildHEarthLandscapeRealizationPlan\",\n        \"H_EARTH_FUNCTIONAL_LANDSCAPE_REALIZATION_PLAN\"\n      ],\n      \"path\": \"h-earth-3d/integration/h-earth.landscape-realization-planner.js\",\n      \"role\": \"SEMANTIC_TO_PHYSICAL_CHUNK_REALIZATION_AUTHORITY\"\n    },\n    {\n      \"blob\": \"91eabcc240b54ef01a52d59a237dff629d90a722\",\n      \"controllingSymbols\": [\n        \"constructHEarthTriangleMesh\",\n        \"admitHEarthPrimitiveBatch\",\n        \"mergeHEarthGeometryBounds\",\n        \"isHEarthNeutralPrimitiveRecord\"\n      ],\n      \"path\": \"showroom/globe/h-earth/render/geometry-kernel.js\",\n      \"role\": \"NEWS_GEOMETRY_KERNEL_PUBLIC_FACADE\"\n    },\n    {\n      \"blob\": \"bf0dfcc0166fd1e677529ff46b91d943f7eae7c8\",\n      \"controllingSymbols\": [\n        \"getHEarthCanonicalShorelineZ\",\n        \"sampleHEarthTerrainElevation\",\n        \"sampleHEarthTerrainField\",\n        \"evaluateHEarthTerrainSharedEdge\"\n      ],\n      \"path\": \"h-earth-3d/terrain/h-earth.terrain-field.js\",\n      \"role\": \"RUN_6_CANONICAL_WORLD_SPACE_ELEVATION_NORMAL_AND_MATERIAL_CLASSIFICATION\"\n    },\n    {\n      \"blob\": \"98f8131dab38973f0f30165967443e0057f7615f\",\n      \"controllingSymbols\": [\n        \"H_EARTH_TERRAIN_FORMATIONS\",\n        \"resolveHEarthFormationMembershipForAddress\"\n      ],\n      \"path\": \"h-earth-3d/terrain/h-earth.terrain-formations.js\",\n      \"role\": \"FORMATION_IDENTITY_AND_WORLD_ENVELOPE_AUTHORITY\"\n    },\n    {\n      \"blob\": \"3f0a833cc32106029318eee460d9ca15cf841959\",\n      \"controllingSymbols\": [\n        \"evaluateHEarthRun8AMountainContribution\",\n        \"sampleHEarthRun8ASuccessorTerrainElevation\",\n        \"sampleHEarthRun8ASuccessorTerrainField\",\n        \"evaluateHEarthRun8AFormerBoundaryContinuity\",\n        \"H_EARTH_RUN_8A_TERRAIN_SAMPLING_AND_REFINEMENT_CONTRACT\"\n      ],\n      \"path\": \"h-earth-3d/control-plane/run-8/h-earth.run8a.dimensional-reconciliation.js\",\n      \"role\": \"RUN_8A_SUCCESSOR_DIMENSIONAL_SAMPLING_AND_CONTINUITY_LAW\"\n    },\n    {\n      \"blob\": \"0bd36eec01a75311bf6441d575bae5a057195bbc\",\n      \"controllingSymbols\": [\n        \"canonicalizeHEarthRun8BElevation\",\n        \"sampleHEarthRun8BSuccessorTerrainElevation\",\n        \"sampleHEarthRun8BSuccessorTerrainField\",\n        \"evaluateHEarthRun8BFormerBoundaryContinuity\"\n      ],\n      \"path\": \"h-earth-3d/terrain/h-earth.successor-terrain-field.run8b.js\",\n      \"role\": \"CANONICAL_SUCCESSOR_WORLD_SPACE_ELEVATION_AND_NORMAL_FIELD\"\n    },\n    {\n      \"blob\": \"a1a82bc8d61cdeeb2e34d85ab6d590a6f583ea46\",\n      \"controllingSymbols\": [\n        \"getHEarthRun8BSuccessorSamplingAxes\",\n        \"evaluateHEarthRun8BVirtualSharedEdges\",\n        \"constructHEarthRun8BSuccessorTerrainAndMountain\"\n      ],\n      \"path\": \"showroom/globe/h-earth/render/geometry-successor-terrain.run8b.js\",\n      \"role\": \"CONNECTED_INDEXED_HEIGHT_FIELD_GEOMETRY_CONSTRUCTION\"\n    },\n    {\n      \"blob\": \"353760e2bf69cafd7261c89f870489243ab1ac17\",\n      \"controllingSymbols\": [\n        \"H_EARTH_RUN_8B_PACKAGE\",\n        \"evaluateHEarthRun8B\"\n      ],\n      \"path\": \"h-earth-3d/control-plane/run-8/h-earth.run8b.successor-neutral-geometry.js\",\n      \"role\": \"RUN_8B_CONSTRUCTION_SCOPE_AND_STOP_BOUNDARY\"\n    },\n    {\n      \"blob\": \"8ed548780039fffba3989e55f5c8f3713354e34f\",\n      \"controllingSymbols\": [\n        \"H_EARTH_SOURCE_OBJECT_GEOMETRY_RESOLUTION_CONTRACT_ID\"\n      ],\n      \"path\": \"h-earth-3d/integration/h-earth.source-object-geometry-resolution.js\",\n      \"role\": \"PACKET_001_PRECEDENT_SOURCE_TO_PROVIDER_RESOLUTION\"\n    },\n    {\n      \"blob\": \"2bcb67ebf84f36248475921c85e75236a1115102\",\n      \"controllingSymbols\": [\n        \"H_EARTH_POST_WEST_ADMITTED_GEOMETRY_TRANSFER_CONTRACT_ID\"\n      ],\n      \"path\": \"h-earth-3d/integration/h-earth.post-west-admitted-geometry-transfer.js\",\n      \"role\": \"PACKET_002_PRECEDENT_POST_WEST_TRANSFER\"\n    },\n    {\n      \"blob\": \"9d32fd89070fa534d63c3c6a3feb4c8f5fd519f4\",\n      \"controllingSymbols\": [\n        \"buildHEarthRun8EPacket002SuccessorTransfer\"\n      ],\n      \"path\": \"h-earth-3d/integration/h-earth.run8e-successor-environment-transfer.js\",\n      \"role\": \"RUN_8E_SUCCESSOR_PACKET_002_TRANSFER_AUTHORITY\"\n    },\n    {\n      \"blob\": \"8ab3446c536fc24423d5601acce232b19fa71c91\",\n      \"controllingSymbols\": [\n        \"resolveHEarthNavigableTerrainChunk\",\n        \"createHEarthFunctionalLandscapeNavigationState\",\n        \"H_EARTH_FUNCTIONAL_LANDSCAPE_NAVIGATION_PROFILE\"\n      ],\n      \"path\": \"showroom/globe/h-earth/functional-landscape/navigation.js\",\n      \"role\": \"CURRENT_NAVIGATION_PROPOSAL_CLEARANCE_AND_SEMANTIC_SELECTION\"\n    },\n    {\n      \"blob\": \"ab30137698716b6674e295dfb537fa04ffef4d46\",\n      \"controllingSymbols\": [\n        \"H_EARTH_PERMANENT_SCENE_REGISTRY\",\n        \"getPermanentScene\"\n      ],\n      \"path\": \"h-earth-3d/tools/instrument-platform/permanent-scene-registry.mjs\",\n      \"role\": \"PERMANENT_MATCHED_CAMERA_SCENE_FIXTURE_AUTHORITY\"\n    },\n    {\n      \"blob\": \"2c952b736e292fe5887f0c0e5c73d4b096db1e6b\",\n      \"controllingSymbols\": [],\n      \"path\": \"h-earth-3d/validation/h-earth.run8b.successor-neutral-geometry.receipt.json\",\n      \"role\": \"EXECUTED_RUN_8B_BASELINE_GEOMETRY_FIXTURE\"\n    },\n    {\n      \"blob\": \"bc868995d9065ce03a5948bcf9f27804b178bc0b\",\n      \"controllingSymbols\": [],\n      \"path\": \"showroom/globe/h-earth/index.html\",\n      \"role\": \"ACCEPTED_LIVE_ENTRY\"\n    },\n    {\n      \"blob\": \"98c6e1f9b9fe4510157367600b85b9d31228056b\",\n      \"controllingSymbols\": [\n        \"H_EARTH_GRATITUDE_REGION_CP2_PRESENTATION_PROFILE_ID\"\n      ],\n      \"path\": \"showroom/globe/h-earth/render/persistent-live-renderer.run8e-r3c.cp2-additive-bandlimited-relief-v2.js\",\n      \"role\": \"ACCEPTED_LIVE_V2_RENDERER_PRESERVATION_FLOOR\"\n    },\n    {\n      \"blob\": \"16bc8c45fb5c2363326d05f7610e11387b3a4e38\",\n      \"controllingSymbols\": [],\n      \"path\": \"showroom/globe/h-earth/diagnostic/run8e-r3d/live-gpu-binding.js\",\n      \"role\": \"ACCEPTED_LIVE_RENDERER_SELECTION_AND_BINDING_FLOOR\"\n    }\n  ],\n  \"userDifferential\": \"PASS_MATERIAL_SIGNIFICANT_IMPROVEMENT\"\n}\n"},"records/13_BOUNDARY_CONTINUITY_AND_SHARED_EDGE_REQUIREMENTS_v1.json":{"authorityClass":"SOURCE_ROLE_6_PACKAGE","sha256":"4c8b12413da1d410cef4d595edbf16664c790b0ea2e7dade6ddd247f79071c8a","utf8":"{\n  \"coastline\": {\n    \"pilotIntersectsCanonicalShoreline\": false,\n    \"proof\": \"DELTA_ZERO_OUTSIDE_BLEND_SUPPORT_AND_SUPPORT_IS_INLAND_OF_Z_MINUS_156\",\n    \"shorelineAndWaterMembershipChange\": \"PROHIBITED\"\n  },\n  \"formerBoundaryZMinus256\": {\n    \"existingC0Tolerance\": 0.05,\n    \"existingC1Tolerance\": 0.5,\n    \"intersectedByPilot\": false,\n    \"mustRemainPass\": true\n  },\n  \"meshContinuity\": {\n    \"globalIndexIdentity\": \"UNCHANGED\",\n    \"globalVertexIdentity\": \"UNCHANGED\",\n    \"sharedVertexNormalIdentity\": \"ONE_GLOBAL_VERTEX_HAS_ONE_SOUTH_VERTEX_NORMAL\",\n    \"verticalSkirt\": \"PROHIBITED\",\n    \"virtualSharedEdges\": \"ALL_EXISTING_RUN_8B_SHARED_EDGE_PAIRS_PASS\"\n  },\n  \"recordId\": \"BOUNDARY_CONTINUITY_AND_SHARED_EDGE_REQUIREMENTS_v1\",\n  \"supportBoundary\": {\n    \"delta\": \"EXACT_ZERO\",\n    \"firstDerivative\": \"ZERO_WITHIN_1E_MINUS_8\",\n    \"outsideSupport\": \"BITWISE_EQUAL_CANONICAL_BASELINE_ELEVATION\",\n    \"secondDerivative\": \"ANALYTICALLY_ZERO_FROM_QUINTIC_WINDOW\"\n  }\n}\n"},"records/14_SAFE_ARTICULATION_PARAMETER_BOUNDS_v1.json":{"authorityClass":"SOURCE_ROLE_6_PACKAGE","sha256":"d62166be7c51451672f5a56c3f128abd69e647cab7035d1ffc7bb54ed98690cd","utf8":"{\n  \"aggregateFieldBounds\": {\n    \"canonicalElevationGridDenominator\": 16777216,\n    \"maximumAdjacentVertexNormalAngularDifferenceFallOrCavernFaceDegrees\": 50,\n    \"maximumAdjacentVertexNormalAngularDifferenceGeneralDegrees\": 35,\n    \"maximumDeltaWorldUnits\": 18,\n    \"maximumTotalSlopeFallOrCavernFace\": 2,\n    \"maximumTotalSlopeGeneral\": 1.25,\n    \"maximumTwoUnitEdgeRiseFallOrCavernFaceWorldUnits\": 4,\n    \"maximumTwoUnitEdgeRiseGeneralWorldUnits\": 2.5,\n    \"minimumDeltaWorldUnits\": -12,\n    \"minimumTriangleDoubleArea\": 4.0,\n    \"outerSupportBoundaryDeltaTolerance\": 0,\n    \"outerSupportBoundaryGradientTolerance\": 1e-08,\n    \"outsideBlendSupportDelta\": 0\n  },\n  \"classification\": \"SAFE_TOOL_AUTHORING_ENVELOPE_NOT_FINAL_PILOT_DESIGN_VALUES\",\n  \"coordinateAndCountBounds\": {\n    \"allMajorCentersMustBeInsideAuthoredCore\": true,\n    \"coordinateQuantumWorldUnits\": 2,\n    \"maximumOperationCount\": 12,\n    \"polylinePointsMustBeInsideBlendSupport\": true,\n    \"rotationDegrees\": {\n      \"maximum\": 180,\n      \"minimum\": -180\n    }\n  },\n  \"failClosedConditions\": [\n    \"ANY_PARAMETER_OUTSIDE_BOUND\",\n    \"ANY_NONFINITE_INPUT_OR_OUTPUT\",\n    \"ANY_OPERATION_CENTER_OUTSIDE_AUTHORIZED_REGION\",\n    \"ANY_NONZERO_DELTA_OUTSIDE_BLEND_SUPPORT\",\n    \"ANY_AXIS_OR_INDEX_MUTATION\",\n    \"ANY_BASELINE_BLOB_MISMATCH\",\n    \"ANY_COASTLINE_OR_WATER_MEMBERSHIP_CHANGE\",\n    \"ANY_RENDERER_OR_NAVIGATION_PRODUCT_MUTATION_DURING_TOOL_CONSTRUCTION\"\n  ],\n  \"operatorBounds\": {\n    \"DRAINAGE_CUT\": {\n      \"depth\": {\n        \"maximum\": 4,\n        \"minimum\": 0.5\n      },\n      \"endFeatherWorldUnits\": {\n        \"maximum\": 8,\n        \"minimum\": 2\n      },\n      \"halfWidth\": {\n        \"maximum\": 6,\n        \"minimum\": 2\n      },\n      \"polylinePointCount\": {\n        \"maximum\": 8,\n        \"minimum\": 2\n      }\n    },\n    \"FALL_FACE\": {\n      \"drop\": {\n        \"maximum\": 16,\n        \"minimum\": 4\n      },\n      \"feather\": {\n        \"maximum\": 6,\n        \"minimum\": 2\n      },\n      \"halfLength\": {\n        \"maximum\": 16,\n        \"minimum\": 6\n      },\n      \"halfWidth\": {\n        \"maximum\": 10,\n        \"minimum\": 4\n      }\n    },\n    \"LOWER_BASIN\": {\n      \"depth\": {\n        \"maximum\": 10,\n        \"minimum\": 2\n      },\n      \"radiusU\": {\n        \"maximum\": 20,\n        \"minimum\": 8\n      },\n      \"radiusV\": {\n        \"maximum\": 16,\n        \"minimum\": 6\n      }\n    },\n    \"ORIENTED_SADDLE\": {\n      \"amplitude\": {\n        \"maximum\": 8,\n        \"minimum\": 2\n      },\n      \"radiusU\": {\n        \"maximum\": 24,\n        \"minimum\": 8\n      },\n      \"radiusV\": {\n        \"maximum\": 20,\n        \"minimum\": 6\n      }\n    },\n    \"RIDGE_BREAK\": {\n      \"depth\": {\n        \"maximum\": 6,\n        \"minimum\": 1\n      },\n      \"radiusU\": {\n        \"maximum\": 12,\n        \"minimum\": 4\n      },\n      \"radiusV\": {\n        \"maximum\": 12,\n        \"minimum\": 4\n      }\n    },\n    \"RIDGE_FACE\": {\n      \"feather\": {\n        \"maximum\": 8,\n        \"minimum\": 2\n      },\n      \"halfLength\": {\n        \"maximum\": 20,\n        \"minimum\": 6\n      },\n      \"halfWidth\": {\n        \"maximum\": 12,\n        \"minimum\": 4\n      },\n      \"height\": {\n        \"maximum\": 12,\n        \"minimum\": 2\n      }\n    },\n    \"TERRACE_BAND\": {\n      \"feather\": {\n        \"maximum\": 6,\n        \"minimum\": 2\n      },\n      \"halfLength\": {\n        \"maximum\": 16,\n        \"minimum\": 4\n      },\n      \"halfWidth\": {\n        \"maximum\": 10,\n        \"minimum\": 3\n      },\n      \"height\": {\n        \"maximum\": 3,\n        \"minimum\": 0.5\n      },\n      \"maximumCount\": 4\n    },\n    \"VALLEY_CORRIDOR\": {\n      \"depth\": {\n        \"maximum\": 8,\n        \"minimum\": 1\n      },\n      \"endFeatherWorldUnits\": {\n        \"maximum\": 12,\n        \"minimum\": 4\n      },\n      \"halfWidth\": {\n        \"maximum\": 12,\n        \"minimum\": 4\n      },\n      \"polylinePointCount\": {\n        \"maximum\": 8,\n        \"minimum\": 2\n      }\n    }\n  },\n  \"recordId\": \"SAFE_ARTICULATION_PARAMETER_BOUNDS_v1\",\n  \"traversalBounds\": {\n    \"eyeHeightWorldUnits\": 2.25,\n    \"hardOpeningSlopeMaximum\": 0.48,\n    \"minimumContinuousOpeningLengthWorldUnits\": 24,\n    \"minimumOpeningWidthWorldUnits\": 8,\n    \"minimumTerrainClearanceWorldUnits\": 1.6,\n    \"preferredOpeningSlopeMaximum\": 0.22,\n    \"preferredOpeningWidthWorldUnits\": 12\n  }\n}\n"},"records/21_REQUIRED_BASELINE_AND_CANDIDATE_FIXTURES_v1.json":{"authorityClass":"SOURCE_ROLE_6_PACKAGE","sha256":"c98d8f21058e77fb1f6fd48751f770c5552d149250c862f8745c2cca3506b034","utf8":"{\n  \"baselineFixtures\": [\n    {\n      \"id\": \"H_EARTH_R06_C10_BASELINE_HALO_GRID_FIXTURE_v1\",\n      \"path\": \"fixtures/H_EARTH_R06_C10_BASELINE_HALO_GRID_FIXTURE_v1.json\",\n      \"sampleCount\": 1023,\n      \"sha256\": \"fb35a5be80d2052cb5b7794f71a70e8ae387c081154cbc64d8a50ab2b34bb213\",\n      \"spacingWorldUnits\": 2\n    },\n    {\n      \"id\": \"H_EARTH_RUN_8B_SUCCESSOR_NEUTRAL_GEOMETRY_RECEIPT\",\n      \"sourceBlob\": \"2c952b736e292fe5887f0c0e5c73d4b096db1e6b\"\n    },\n    {\n      \"id\": \"H_EARTH_PERMANENT_SCENE_REGISTRY_v1\",\n      \"sourceBlob\": \"ab30137698716b6674e295dfb537fa04ffef4d46\"\n    }\n  ],\n  \"candidateFixtures\": [\n    {\n      \"classification\": \"STATIC_EXPECTED_OUTPUT_FOR_ROLE_1_TOOL_CONFORMANCE_NOT_A_PRODUCT_CANDIDATE\",\n      \"id\": \"H_EARTH_R06_C10_TOOL_CONFORMANCE_EXPECTED_FIELD_v1\",\n      \"path\": \"fixtures/H_EARTH_R06_C10_TOOL_CONFORMANCE_EXPECTED_FIELD_v1.json\",\n      \"sha256\": \"d4bb9d94f052d6b43a6408e72bff874afe8d386809a8b2073093c86f9805f662\"\n    },\n    {\n      \"id\": \"ACTUAL_FUTURE_CANDIDATE_HALO_GRID\",\n      \"status\": \"REQUIRED_AT_ROLE_1_CANDIDATE_GENERATION\"\n    }\n  ],\n  \"matchedCameraScenes\": [\n    \"SCENE_01_HILL_FIELD_FILL\",\n    \"SCENE_02_ASCENDING_TOWARD_CREST\",\n    \"SCENE_04_LATERAL_SLOPE_TRAVEL\",\n    \"SCENE_06_COAST_TO_INLAND_TRANSITION\"\n  ],\n  \"recordId\": \"REQUIRED_BASELINE_AND_CANDIDATE_FIXTURES_v1\"\n}\n"},"records/22_REQUIRED_VERIFICATION_HARNESS_SPECIFICATION_v1.json":{"authorityClass":"SOURCE_ROLE_6_PACKAGE","sha256":"0e2105fb576e90d9cb491245873a374ca30b8d0b48aa1ee6b8d440fb90de4c28","utf8":"{\n  \"failureDisposition\": \"ANY_FAILED_ASSERTION_REJECTS_CANDIDATE_AND_PROHIBITS_ROLE_3_OR_VISUAL_CLAIM\",\n  \"harnessId\": \"H_EARTH_R06_C10_GEOMETRY_ARTICULATION_TOOL_HARNESS_v1\",\n  \"recordId\": \"REQUIRED_VERIFICATION_HARNESS_SPECIFICATION_v1\",\n  \"requiredAssertions\": [\n    \"EXACT_BASELINE_COMMIT_AND_ALL_REQUIRED_BLOBS_MATCH\",\n    \"ROLE_6_PACKAGE_SHA256_AND_MEMBER_SHA256_VALUES_MATCH\",\n    \"REQUEST_SCHEMA_VALID_AND_NO_UNKNOWN_KEYS\",\n    \"ALL_PARAMETERS_INSIDE_SAFE_BOUNDS\",\n    \"CONFORMANCE_FIXTURE_OUTPUT_SHA256_MATCHES_STATIC_EXPECTED_FIXTURE\",\n    \"CANDIDATE_FIELD_DETERMINISTIC_REPEAT_EXECUTION\",\n    \"CANDIDATE_FIELD_FINITE_AT_ALL_GLOBAL_RUN_8B_AXIS_POINTS\",\n    \"DELTA_EXACT_ZERO_OUTSIDE_BLEND_SUPPORT\",\n    \"SUPPORT_OUTER_EDGE_DELTA_EXACT_ZERO\",\n    \"SUPPORT_OUTER_EDGE_GRADIENT_WITHIN_1E_MINUS_8\",\n    \"RUN_8B_X_AND_Z_AXIS_ARRAYS_BYTE_EQUIVALENT_TO_BASELINE\",\n    \"RUN_8B_INDEX_ARRAY_BYTE_EQUIVALENT_TO_BASELINE\",\n    \"VERTEX_TRIANGLE_ROW_COLUMN_COUNTS_MATCH_RECONSTRUCTED_BASELINE\",\n    \"NONDEGENERATE_TRIANGLES_AND_MINIMUM_DOUBLE_AREA_AT_LEAST_4\",\n    \"ALL_FACE_AND_VERTEX_NORMALS_FINITE_AND_UNIT_BOUNDED\",\n    \"ALL_EXISTING_VIRTUAL_SHARED_EDGE_PAIRS_PASS\",\n    \"FORMER_BOUNDARY_CONTINUITY_REMAINS_PASS\",\n    \"COASTLINE_AND_WATER_MEMBERSHIP_UNCHANGED\",\n    \"GENERAL_AND_SPECIAL_SLOPE_EDGE_RISE_AND_NORMAL_ANGLE_BOUNDS_PASS\",\n    \"TRAVERSABLE_OPENING_WIDTH_LENGTH_SLOPE_AND_CLEARANCE_PASS\",\n    \"CANDIDATE_CLEARANCE_USES_CANDIDATE_FIELD_NOT_RUN_6_FIELD\",\n    \"AT_LEAST_ONE_CAVERN_COMPATIBLE_FACE_PATCH_REPORTED\",\n    \"FALL_FACE_BASIN_DRAINAGE_AND_OUTLET_GEOMETRY_READINESS_PASS\",\n    \"ACCEPTED_V2_RENDERER_INDEX_BINDING_AND_NAVIGATION_PRODUCT_BLOBS_UNCHANGED\",\n    \"NO_NEW_SHADER_PASS_TEXTURE_BUFFER_DRAW_CALL_OR_WATER_PRIMITIVE\",\n    \"MATCHED_CAMERA_CAPTURE_MANIFEST_CONTAINS_AT_LEAST_THREE_NORMAL_TRAVERSAL_VIEWS\",\n    \"ROLLBACK_AND_RECOVERY_OUTPUTS_COMPLETE\",\n    \"PACKAGE_MEMBER_HASHES_AND_ARCHIVE_READBACK_PASS\"\n  ],\n  \"status\": \"SPECIFIED_NOT_CONSTRUCTED\",\n  \"visualAdmissionBoundary\": {\n    \"engineeringHarnessMayClaim\": \"GEOMETRY_AND_RUNTIME_EVIDENCE_READY\",\n    \"engineeringHarnessMayNotClaim\": \"MATERIAL_VISUAL_IMPROVEMENT\",\n    \"requiredLaterGates\": [\n      \"ROLE_3_EXECUTION_VERIFICATION\",\n      \"ROLE_5_INSPECTION_WORTHINESS\",\n      \"ROLE_2_WORKING_REVIEW_LINK\",\n      \"USER_PHYSICAL_DIFFERENTIAL\"\n    ]\n  }\n}\n"},"records/23_REQUIRED_ROLLBACK_AND_RECOVERY_OUTPUTS_v1.json":{"authorityClass":"SOURCE_ROLE_6_PACKAGE","sha256":"79ab9f1838ad2b789350d4331b3ec56197e8ed5ca2447b64b2f1569809db327d","utf8":"{\n  \"recordId\": \"REQUIRED_ROLLBACK_AND_RECOVERY_OUTPUTS_v1\",\n  \"recovery\": {\n    \"minimumLoadedArtifacts\": [\n      \"COMPLETE_ROLE_6_PACKAGE\",\n      \"EXACT_BASELINE_SOURCE_BYTES\",\n      \"ROLE_1_TOOL_MANIFEST\",\n      \"LATEST_CANDIDATE_REQUEST_AND_RECEIPTS\"\n    ],\n    \"recoveryMustNotInferMissingParameters\": true\n  },\n  \"requiredOutputs\": [\n    \"baseline-custody.json\",\n    \"candidate-member-list.json\",\n    \"candidate-sha256sums.txt\",\n    \"candidate-to-baseline-diff-paths.json\",\n    \"rollback-steps.json\",\n    \"role-assumption-bootstrap.json\"\n  ],\n  \"rollbackClass\": \"DELETE_CANDIDATE_WORKSPACE_OUTPUTS_AND_RETAIN_ACCEPTED_BASELINE_BYTES\",\n  \"rollbackSteps\": [\n    \"STOP_ANY_CANDIDATE_SERVER_OR_PREVIEW\",\n    \"REMOVE_CANDIDATE_QUERY_OR_TEMPORARY_SELECTOR_IF_ONE_WAS_CREATED_LATER\",\n    \"DELETE_CANDIDATE_GENERATED_FIELD_AND_RECEIPT_FILES\",\n    \"VERIFY_ACCEPTED_BASELINE_INDEX_RENDERER_BINDING_TERRAIN_AND_NAVIGATION_BLOBS\",\n    \"REEXECUTE_BASELINE_HALO_FIXTURE_AND_RUN_8B_GEOMETRY_RECEIPT\",\n    \"RECORD_ROLLBACK_SHA256_AND_OPERATOR\"\n  ]\n}\n"},"fixtures/H_EARTH_R06_C10_TOOL_CONFORMANCE_REQUEST_v1.json":{"authorityClass":"SOURCE_ROLE_6_PACKAGE","sha256":"8b1ea49a6ced90e308fa38f3fec0b214d485c638c8f1a85b42e5a31768185ba2","utf8":"{\n  \"cavernCompatibility\": {\n    \"required\": true\n  },\n  \"classification\": \"TOOL_CONFORMANCE_ONLY_NOT_DESIGN_CANDIDATE\",\n  \"exactBaseline\": {\n    \"commit\": \"6836288462bbbc7ab7c03d5f12fafaab119f9e36\",\n    \"geometryConstructorBlob\": \"a1a82bc8d61cdeeb2e34d85ab6d590a6f583ea46\",\n    \"terrainFieldBlob\": \"0bd36eec01a75311bf6441d575bae5a057195bbc\"\n  },\n  \"operationId\": \"H_EARTH_R06_C10_TOOL_CONFORMANCE_FIXTURE_001\",\n  \"operations\": [\n    {\n      \"amplitude\": 4,\n      \"centerX\": 48,\n      \"centerZ\": -178,\n      \"operator\": \"ORIENTED_SADDLE\",\n      \"radiusU\": 16,\n      \"radiusV\": 12,\n      \"rotationDegrees\": 0\n    },\n    {\n      \"centerX\": 36,\n      \"centerZ\": -180,\n      \"feather\": 4,\n      \"halfLength\": 14,\n      \"halfWidth\": 6,\n      \"height\": 5,\n      \"operator\": \"RIDGE_FACE\",\n      \"rotationDegrees\": 20\n    },\n    {\n      \"depth\": 3,\n      \"endFeatherWorldUnits\": 6,\n      \"halfWidth\": 5,\n      \"operator\": \"VALLEY_CORRIDOR\",\n      \"polyline\": [\n        [\n          32,\n          -172\n        ],\n        [\n          48,\n          -178\n        ],\n        [\n          64,\n          -186\n        ]\n      ]\n    },\n    {\n      \"centerX\": 56,\n      \"centerZ\": -186,\n      \"depth\": 2.5,\n      \"operator\": \"LOWER_BASIN\",\n      \"radiusU\": 10,\n      \"radiusV\": 8,\n      \"rotationDegrees\": 0\n    },\n    {\n      \"depth\": 1.25,\n      \"endFeatherWorldUnits\": 4,\n      \"halfWidth\": 3.5,\n      \"operator\": \"DRAINAGE_CUT\",\n      \"polyline\": [\n        [\n          48,\n          -176\n        ],\n        [\n          54,\n          -186\n        ],\n        [\n          58,\n          -196\n        ]\n      ]\n    },\n    {\n      \"centerX\": 60,\n      \"centerZ\": -174,\n      \"feather\": 2,\n      \"halfLength\": 8,\n      \"halfWidth\": 6,\n      \"height\": 1.5,\n      \"operator\": \"TERRACE_BAND\",\n      \"rotationDegrees\": -20\n    },\n    {\n      \"centerX\": 42,\n      \"centerZ\": -184,\n      \"depth\": 2,\n      \"operator\": \"RIDGE_BREAK\",\n      \"radiusU\": 6,\n      \"radiusV\": 5,\n      \"rotationDegrees\": 15\n    },\n    {\n      \"centerX\": 62,\n      \"centerZ\": -184,\n      \"drop\": 6,\n      \"feather\": 2,\n      \"halfLength\": 8,\n      \"halfWidth\": 5,\n      \"operator\": \"FALL_FACE\",\n      \"rotationDegrees\": 90\n    }\n  ],\n  \"region\": {\n    \"authoredCore\": {\n      \"xMaximum\": 64,\n      \"xMinimum\": 32,\n      \"zMaximum\": -164,\n      \"zMinimum\": -192\n    },\n    \"blendSupport\": {\n      \"xMaximum\": 72,\n      \"xMinimum\": 24,\n      \"zMaximum\": -156,\n      \"zMinimum\": -200\n    },\n    \"semanticAddress\": \"H_EARTH_GROUND_CELL_001:R06:C10\",\n    \"verificationHalo\": {\n      \"xMaximum\": 80,\n      \"xMinimum\": 16,\n      \"zMaximum\": -148,\n      \"zMinimum\": -208\n    }\n  },\n  \"schemaVersion\": \"H_EARTH_R06_C10_ARTICULATION_REQUEST_v1\",\n  \"traversableOpening\": {\n    \"minimumWidthWorldUnits\": 8,\n    \"polyline\": [\n      [\n        32,\n        -168\n      ],\n      [\n        44,\n        -176\n      ],\n      [\n        56,\n        -184\n      ]\n    ]\n  },\n  \"waterfallReadiness\": {\n    \"required\": true,\n    \"waterImplementation\": false\n  }\n}\n"},"schemas/H_EARTH_R06_C10_ARTICULATION_REQUEST_SCHEMA_v1.json":{"authorityClass":"ROLE_4_SCHEMA_ERRATUM","sha256":"8bc185349c6f0cf260a4288fb3dc0873eb424a1d16059c98d9907cb8951a3982","utf8":"{\n  \"$id\": \"H_EARTH_R06_C10_ARTICULATION_REQUEST_SCHEMA_v1\",\n  \"additionalProperties\": false,\n  \"properties\": {\n    \"cavernCompatibility\": {\n      \"type\": \"object\"\n    },\n    \"classification\": {\n      \"const\": \"TOOL_CONFORMANCE_ONLY_NOT_DESIGN_CANDIDATE\",\n      \"type\": \"string\"\n    },\n    \"exactBaseline\": {\n      \"properties\": {\n        \"commit\": {\n          \"const\": \"6836288462bbbc7ab7c03d5f12fafaab119f9e36\"\n        },\n        \"geometryConstructorBlob\": {\n          \"const\": \"a1a82bc8d61cdeeb2e34d85ab6d590a6f583ea46\"\n        },\n        \"terrainFieldBlob\": {\n          \"const\": \"0bd36eec01a75311bf6441d575bae5a057195bbc\"\n        }\n      },\n      \"required\": [\n        \"commit\",\n        \"terrainFieldBlob\",\n        \"geometryConstructorBlob\"\n      ],\n      \"type\": \"object\"\n    },\n    \"operationId\": {\n      \"minLength\": 1,\n      \"type\": \"string\"\n    },\n    \"operations\": {\n      \"maxItems\": 12,\n      \"minItems\": 1,\n      \"type\": \"array\"\n    },\n    \"region\": {\n      \"properties\": {\n        \"authoredCore\": {\n          \"const\": {\n            \"xMaximum\": 64,\n            \"xMinimum\": 32,\n            \"zMaximum\": -164,\n            \"zMinimum\": -192\n          }\n        },\n        \"blendSupport\": {\n          \"const\": {\n            \"xMaximum\": 72,\n            \"xMinimum\": 24,\n            \"zMaximum\": -156,\n            \"zMinimum\": -200\n          }\n        },\n        \"semanticAddress\": {\n          \"const\": \"H_EARTH_GROUND_CELL_001:R06:C10\"\n        },\n        \"verificationHalo\": {\n          \"const\": {\n            \"xMaximum\": 80,\n            \"xMinimum\": 16,\n            \"zMaximum\": -148,\n            \"zMinimum\": -208\n          }\n        }\n      },\n      \"required\": [\n        \"semanticAddress\",\n        \"authoredCore\",\n        \"blendSupport\",\n        \"verificationHalo\"\n      ],\n      \"type\": \"object\"\n    },\n    \"schemaVersion\": {\n      \"const\": \"H_EARTH_R06_C10_ARTICULATION_REQUEST_v1\"\n    },\n    \"traversableOpening\": {\n      \"type\": \"object\"\n    },\n    \"waterfallReadiness\": {\n      \"type\": \"object\"\n    }\n  },\n  \"required\": [\n    \"schemaVersion\",\n    \"operationId\",\n    \"exactBaseline\",\n    \"region\",\n    \"operations\",\n    \"traversableOpening\",\n    \"cavernCompatibility\",\n    \"waterfallReadiness\"\n  ],\n  \"type\": \"object\"\n}\n"}}});

const ASSERTION_IDS = Object.freeze([
  '01_EXACT_BASELINE_COMMIT_AND_ALL_REQUIRED_BLOBS_MATCH',
  '02_ROLE_6_PACKAGE_AND_MEMBER_SHA256_VALUES_MATCH',
  '03_REQUEST_SCHEMA_VALID_AND_NO_UNKNOWN_KEYS',
  '04_ALL_PARAMETERS_INSIDE_SAFE_BOUNDS',
  '05_CONFORMANCE_OUTPUT_SHA256_MATCHES_EXPECTED_FIXTURE',
  '06_CANDIDATE_FIELD_DETERMINISTIC_REPEAT_EXECUTION',
  '07_CANDIDATE_FIELD_FINITE_AT_ALL_RUN_8B_AXIS_POINTS',
  '08_DELTA_EXACT_ZERO_OUTSIDE_BLEND_SUPPORT',
  '09_SUPPORT_OUTER_EDGE_DELTA_EXACT_ZERO',
  '10_SUPPORT_OUTER_EDGE_GRADIENT_WITHIN_1E_MINUS_8',
  '11_RUN_8B_X_AND_Z_AXES_BYTE_EQUIVALENT',
  '12_RUN_8B_INDEX_ARRAY_BYTE_EQUIVALENT',
  '13_VERTEX_TRIANGLE_ROW_COLUMN_COUNTS_MATCH',
  '14_NONDEGENERATE_TRIANGLES_MINIMUM_DOUBLE_AREA_AT_LEAST_4',
  '15_FACE_AND_VERTEX_NORMALS_FINITE_AND_UNIT_BOUNDED',
  '16_ALL_VIRTUAL_SHARED_EDGE_PAIRS_PASS',
  '17_FORMER_BOUNDARY_CONTINUITY_REMAINS_PASS',
  '18_COASTLINE_AND_WATER_MEMBERSHIP_UNCHANGED',
  '19_SLOPE_EDGE_RISE_AND_NORMAL_ANGLE_BOUNDS_PASS',
  '20_TRAVERSABLE_OPENING_WIDTH_LENGTH_SLOPE_CLEARANCE_PASS',
  '21_CLEARANCE_USES_CANDIDATE_FIELD_NOT_RUN_6_FIELD',
  '22_AT_LEAST_ONE_CAVERN_COMPATIBLE_FACE_PATCH_REPORTED',
  '23_FALL_FACE_BASIN_DRAINAGE_OUTLET_READINESS_PASS',
  '24_ACCEPTED_V2_PRODUCT_BLOBS_UNCHANGED',
  '25_NO_NEW_SHADER_TEXTURE_BUFFER_DRAW_CALL_OR_WATER_PRIMITIVE',
  '26_MATCHED_CAMERA_MANIFEST_HAS_AT_LEAST_THREE_NORMAL_VIEWS',
  '27_ROLLBACK_AND_RECOVERY_OUTPUTS_COMPLETE',
  '28_PACKAGE_MEMBER_HASHES_AND_ARCHIVE_READBACK_PASS'
]);

const REQUIRED_RECOVERY_OUTPUTS = Object.freeze([
  'baseline-custody.json',
  'candidate-member-list.json',
  'candidate-sha256sums.txt',
  'candidate-to-baseline-diff-paths.json',
  'rollback-steps.json',
  'role-assumption-bootstrap.json'
]);

const sha256Bytes = (value) => createHash('sha256').update(value).digest('hex');
const sha256File = (file) => sha256Bytes(fs.readFileSync(file));
const canonicalize = (value) => {
  if (value === null) return 'null';
  if (typeof value === 'string' || typeof value === 'boolean') return JSON.stringify(value);
  if (typeof value === 'number') {
    if (!Number.isFinite(value)) throw new TypeError('NONFINITE_CANONICAL_VALUE');
    return JSON.stringify(Object.is(value, -0) ? 0 : value);
  }
  if (Array.isArray(value)) return `[${value.map(canonicalize).join(',')}]`;
  if (typeof value === 'object') {
    return `{${Object.keys(value).sort().map((key) => `${JSON.stringify(key)}:${canonicalize(value[key])}`).join(',')}}`;
  }
  throw new TypeError('NON_JSON_CANONICAL_VALUE');
};
const stableDigest = (value) => sha256Bytes(Buffer.from(canonicalize(value), 'utf8'));
const readJson = (file) => JSON.parse(fs.readFileSync(file, 'utf8'));
const writeJson = (file, value) => {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`, 'utf8');
};
const run = (command, args, options = {}) => {
  const result = spawnSync(command, args, { encoding: 'utf8', ...options });
  if (result.error) throw result.error;
  if (result.status !== 0) {
    throw new Error(`${command} ${args.join(' ')} failed (${result.status}): ${result.stderr || result.stdout}`);
  }
  return String(result.stdout).trim();
};
const git = (...args) => run('git', args);
const gitBlob = (file) => git('hash-object', file);
const finite = (value) => typeof value === 'number' && Number.isFinite(value);
const clamp = (value, minimum, maximum) => Math.min(maximum, Math.max(minimum, value));
const parseArgs = () => {
  const result = {};
  for (let index = 2; index < process.argv.length; index += 1) {
    const token = process.argv[index];
    if (!token.startsWith('--')) throw new Error(`UNKNOWN_POSITIONAL_ARGUMENT:${token}`);
    const key = token.slice(2);
    const value = process.argv[index + 1];
    if (!value || value.startsWith('--')) throw new Error(`MISSING_ARGUMENT_VALUE:${key}`);
    result[key] = value;
    index += 1;
  }
  return result;
};

function validateInvocationRole(role, assumptionReceiptPath) {
  if (role === 'ROLE_1_PROVISIONAL_LOCAL_CHECK' || role === 'ROLE_3_INDEPENDENT_EXECUTION') {
    return { valid: true, class: 'DIRECT_AUTHORIZED_ROLE', role };
  }
  if (!assumptionReceiptPath || !fs.existsSync(assumptionReceiptPath)) {
    return { valid: false, class: 'MISSING_ROLE_ASSUMPTION_RECEIPT', role };
  }
  const receipt = readJson(assumptionReceiptPath);
  const required = [
    'unavailableRoom', 'assumedRole', 'operationId', 'exactBaseline',
    'packageVersionLoaded', 'packageArchiveSha256', 'toolsLoaded',
    'permissionsAssumed', 'prohibitedActions', 'independenceConflicts',
    'remainingExternalGates'
  ];
  const keys = Object.keys(receipt).sort();
  const valid = keys.length === required.length &&
    required.every((key) => Object.prototype.hasOwnProperty.call(receipt, key)) &&
    receipt.exactBaseline === BASELINE_COMMIT &&
    receipt.packageArchiveSha256 === SOURCE_ARCHIVE_SHA256 &&
    Array.isArray(receipt.toolsLoaded) && receipt.toolsLoaded.length >= 6;
  return { valid, class: valid ? 'VALID_ROLE_ASSUMPTION_RECEIPT' : 'INVALID_ROLE_ASSUMPTION_RECEIPT', role };
}


const C1_RECEIPT_PATH = 'h-earth-3d/control-plane/r06-c10/receipts/h-earth.r06-c10.role1.package-assumption-receipt.v1.json';
const C2_RECEIPT_PATH = 'h-earth-3d/control-plane/r06-c10/receipts/h-earth.r06-c10.role1.c2.contracts-static-fixture.receipt.v1.json';
const CUSTODY_CORRECTION_LOCATOR_PATH = 'h-earth-3d/control-plane/r06-c10/custody/h-earth.r06-c10.role4.custody-correction.locator.v1.json';
const SCHEMA_ERRATUM_LOCATOR_PATH = 'h-earth-3d/control-plane/r06-c10/custody/h-earth.r06-c10.role4.schema-erratum-001.locator.v1.json';
const C1_RECEIPT_BLOB = '099348e58d93259129c05c6cad7fbea92635fc2f';
const C2_RECEIPT_BLOB = 'b8d23a9bf7eb4f96934d8416500aa00f37b3b523';
const CUSTODY_CORRECTION_LOCATOR_BLOB = 'f046e7223cfb8291a5620143a58201a02e307865';
const SCHEMA_ERRATUM_LOCATOR_BLOB = '860312e013361dc521c8993018252eb7c5558f73';

function decodePortableAuthorityBundle() {
  const decoded = {};
  const memberEvidence = [];
  for (const [memberPath, entry] of Object.entries(PORTABLE_AUTHORITY_BUNDLE.members)) {
    const bytes = Buffer.from(entry.utf8, 'utf8');
    const actualSha256 = sha256Bytes(bytes);
    const pass = actualSha256 === entry.sha256;
    memberEvidence.push({ path: memberPath, authorityClass: entry.authorityClass, expectedSha256: entry.sha256, actualSha256, pass });
    if (!pass) throw new Error(`PORTABLE_AUTHORITY_MEMBER_HASH_MISMATCH:${memberPath}`);
    decoded[memberPath] = JSON.parse(entry.utf8);
  }
  return { decoded, memberEvidence, allPass: memberEvidence.every((entry) => entry.pass) };
}

function verifyReceiptBackedAuthority(args) {
  const custodyReceiptPath = args['custody-receipt'];
  if (!custodyReceiptPath || !fs.existsSync(custodyReceiptPath)) throw new Error('MISSING_REQUIRED_CUSTODY_RECEIPT');
  const requiredFiles = [C1_RECEIPT_PATH, C2_RECEIPT_PATH, CUSTODY_CORRECTION_LOCATOR_PATH, SCHEMA_ERRATUM_LOCATOR_PATH];
  for (const file of requiredFiles) if (!fs.existsSync(file)) throw new Error(`MISSING_REQUIRED_AUTHORITY_RECEIPT_OR_LOCATOR:${file}`);
  if (path.normalize(custodyReceiptPath) !== path.normalize(C1_RECEIPT_PATH)) throw new Error('UNAUTHORIZED_CUSTODY_RECEIPT_PATH');
  const blobChecks = [
    [C1_RECEIPT_PATH, C1_RECEIPT_BLOB],
    [C2_RECEIPT_PATH, C2_RECEIPT_BLOB],
    [CUSTODY_CORRECTION_LOCATOR_PATH, CUSTODY_CORRECTION_LOCATOR_BLOB],
    [SCHEMA_ERRATUM_LOCATOR_PATH, SCHEMA_ERRATUM_LOCATOR_BLOB]
  ].map(([file, expected]) => ({ file, expected, actual: gitBlob(file) }));
  if (!blobChecks.every((entry) => entry.actual === entry.expected)) throw new Error('AUTHORITY_RECEIPT_OR_LOCATOR_BLOB_MISMATCH');
  const c1 = readJson(C1_RECEIPT_PATH);
  const c2 = readJson(C2_RECEIPT_PATH);
  const correctionLocator = readJson(CUSTODY_CORRECTION_LOCATOR_PATH);
  const erratumLocator = readJson(SCHEMA_ERRATUM_LOCATOR_PATH);
  const bundle = decodePortableAuthorityBundle();
  const sourcePass = c1.result === 'R06_C10_ROLE_1_C1_PASS_CLOSED' &&
    c1.sourceRole6Package.archiveSha256 === SOURCE_ARCHIVE_SHA256 &&
    c1.sourceRole6Package.archiveByteCount === SOURCE_ARCHIVE_BYTES &&
    c1.sourceRole6Package.archiveMemberCount === SOURCE_ARCHIVE_MEMBER_COUNT &&
    c1.sourceRole6Package.archiveIdentityVerified === true &&
    c1.sourceRole6Package.zipIntegrityVerified === true &&
    c1.sourceRole6Package.originalCoreManifestVerified === true &&
    c1.sourceRole6Package.originalCoreManifestMemberCount === 35 &&
    c1.sourceRole6Package.allSourceArchiveMembersVerified === true &&
    c1.sourceRole6Package.detachedCompleteManifestMemberCount === 39;
  const correctionPass = c1.role4CustodyCorrection.archiveSha256 === CORRECTION_ARCHIVE_SHA256 &&
    c1.role4CustodyCorrection.archiveAndMemberIntegrityVerified === true &&
    c1.role4CustodyCorrection.detachedCompleteMemberManifestSha256 === PORTABLE_AUTHORITY_BUNDLE.custodyCorrection.detachedManifestSha256 &&
    c1.role4CustodyCorrection.detachedManifestCoverage === '39_OF_39_SOURCE_ARCHIVE_MEMBERS' &&
    correctionLocator.correctionArchive.archiveSha256 === CORRECTION_ARCHIVE_SHA256 &&
    correctionLocator.correctionArchive.detachedManifestCoverageCount === 39 &&
    correctionLocator.correctionArchive.driveReadbackMatch === true;
  const erratumPass = c2.result === 'R06_C10_ROLE_1_C2_PASS_CLOSED' &&
    c2.erratumCustody.archiveSha256 === ERRATUM_ARCHIVE_SHA256 &&
    c2.erratumCustody.archiveVerified === true &&
    c2.erratumCustody.allFourMembersVerified === true &&
    c2.erratumCustody.replacementSchemaSha256 === ERRATUM_SCHEMA_SHA256 &&
    c2.erratumCustody.replacementSchemaVerified === true &&
    erratumLocator.correctionArchive.archiveSha256 === ERRATUM_ARCHIVE_SHA256 &&
    erratumLocator.authoritativeSchemaErratum.replacementMemberSha256 === ERRATUM_SCHEMA_SHA256;
  const valid = sourcePass && correctionPass && erratumPass && bundle.allPass;
  const get = (memberPath) => bundle.decoded[memberPath];
  return {
    valid,
    mode: 'RECEIPT_BACKED_PORTABLE_AUTHORITY',
    summary: {
      mode: 'RECEIPT_BACKED_PORTABLE_AUTHORITY',
      sourceOuter: { sha256: SOURCE_ARCHIVE_SHA256, byteCount: SOURCE_ARCHIVE_BYTES, memberCount: SOURCE_ARCHIVE_MEMBER_COUNT, readbackVerifiedByReceipt: sourcePass },
      correctionOuter: { sha256: CORRECTION_ARCHIVE_SHA256, memberIntegrityVerifiedByReceipt: correctionPass },
      erratumOuter: { sha256: ERRATUM_ARCHIVE_SHA256, memberIntegrityVerifiedByReceipt: erratumPass },
      originalCoreCount: 35,
      originalCoreAllPass: sourcePass,
      detachedCount: 39,
      detachedAllPass: sourcePass && correctionPass,
      correctionAllPass: correctionPass,
      erratumAllPass: erratumPass,
      detachedManifestSha256: PORTABLE_AUTHORITY_BUNDLE.custodyCorrection.detachedManifestSha256,
      replacementSchemaSha256: ERRATUM_SCHEMA_SHA256,
      portableBundleMemberCount: bundle.memberEvidence.length,
      portableBundleAllPass: bundle.allPass,
      portableBundleMemberEvidence: bundle.memberEvidence,
      packageMemberHashesPass: sourcePass && correctionPass && erratumPass && bundle.allPass,
      archiveReadbackPass: sourcePass && correctionPass && erratumPass,
      receiptAndLocatorBlobChecks: blobChecks
    },
    records: {
      baselineLedger: get('records/02_EXACT_ACCEPTED_BASELINE_LEDGER_v1.json'),
      boundaryRecord: get('records/13_BOUNDARY_CONTINUITY_AND_SHARED_EDGE_REQUIREMENTS_v1.json'),
      safeBoundsRecord: get('records/14_SAFE_ARTICULATION_PARAMETER_BOUNDS_v1.json'),
      fixtureRecord: get('records/21_REQUIRED_BASELINE_AND_CANDIDATE_FIXTURES_v1.json'),
      harnessSpec: get('records/22_REQUIRED_VERIFICATION_HARNESS_SPECIFICATION_v1.json'),
      rollbackSpec: get('records/23_REQUIRED_ROLLBACK_AND_RECOVERY_OUTPUTS_v1.json'),
      conformanceRequest: get('fixtures/H_EARTH_R06_C10_TOOL_CONFORMANCE_REQUEST_v1.json'),
      replacementSchema: get('schemas/H_EARTH_R06_C10_ARTICULATION_REQUEST_SCHEMA_v1.json')
    }
  };
}

const PYTHON_ARCHIVE_VALIDATOR = String.raw`
import sys,json,zipfile,hashlib,os
source,correction,erratum,out=sys.argv[1:]
def digest(data): return hashlib.sha256(data).hexdigest()
def outer(path):
    data=open(path,'rb').read()
    with zipfile.ZipFile(path) as z: names=z.namelist()
    return {'sha256':digest(data),'byteCount':len(data),'memberCount':len(names),'members':names}
def root_and_members(path):
    with zipfile.ZipFile(path) as z:
        names=z.namelist(); root=names[0].split('/')[0]+'/'
        members={name[len(root):]:z.read(name) for name in names if not name.endswith('/')}
    return root,members
source_outer=outer(source); correction_outer=outer(correction); erratum_outer=outer(erratum)
_,source_members=root_and_members(source)
_,correction_members=root_and_members(correction)
_,erratum_members=root_and_members(erratum)
original={}
for line in source_members['SHA256SUMS.txt'].decode().splitlines():
    if line.strip():
        h,p=line.split(None,1); original[p.strip()]=h
original_results={p:(p in source_members and digest(source_members[p])==h) for p,h in original.items()}
detached=json.loads(correction_members['DETACHED_COMPLETE_MEMBER_MANIFEST_v1.json'])
detached_results={entry['path']:(entry['path'] in source_members and len(source_members[entry['path']])==entry['byteCount'] and digest(source_members[entry['path']])==entry['sha256']) for entry in detached['members']}
correction_sums={}
for line in correction_members['SHA256SUMS.txt'].decode().splitlines():
    if line.strip():
        h,p=line.split(None,1); correction_sums[p.strip()]=h
correction_results={p:(p in correction_members and digest(correction_members[p])==h) for p,h in correction_sums.items()}
erratum_sums={}
for line in erratum_members['SHA256SUMS.txt'].decode().splitlines():
    if line.strip():
        h,p=line.split(None,1); erratum_sums[p.strip()]=h
erratum_results={p:(p in erratum_members and digest(erratum_members[p])==h) for p,h in erratum_sums.items()}
os.makedirs(out,exist_ok=True)
for prefix,members in [('source',source_members),('correction',correction_members),('erratum',erratum_members)]:
    for p,data in members.items():
        target=os.path.join(out,prefix,p); os.makedirs(os.path.dirname(target),exist_ok=True); open(target,'wb').write(data)
summary={
 'sourceOuter':source_outer,'correctionOuter':correction_outer,'erratumOuter':erratum_outer,
 'originalCoreCount':len(original),'originalCoreAllPass':all(original_results.values()),
 'detachedCount':len(detached_results),'detachedAllPass':all(detached_results.values()),
 'correctionDeclaredCount':len(correction_results),'correctionAllPass':all(correction_results.values()),
 'erratumDeclaredCount':len(erratum_results),'erratumAllPass':all(erratum_results.values()),
 'detachedManifestSha256':digest(correction_members['DETACHED_COMPLETE_MEMBER_MANIFEST_v1.json']),
 'replacementSchemaSha256':digest(erratum_members['schemas/H_EARTH_R06_C10_ARTICULATION_REQUEST_SCHEMA_v1.json'])
}
print(json.dumps(summary,sort_keys=True))
`;

function verifyAndExtractArchives(args, tempRoot) {
  for (const key of ['package-archive', 'custody-correction-archive', 'schema-erratum-archive']) {
    if (!args[key] || !fs.existsSync(args[key])) throw new Error(`MISSING_REQUIRED_ARCHIVE:${key}`);
  }
  const extractRoot = path.join(tempRoot, 'authority');
  const result = run('python3', ['-c', PYTHON_ARCHIVE_VALIDATOR,
    args['package-archive'], args['custody-correction-archive'], args['schema-erratum-archive'], extractRoot]);
  const summary = JSON.parse(result);
  const valid = summary.sourceOuter.sha256 === SOURCE_ARCHIVE_SHA256 &&
    summary.sourceOuter.byteCount === SOURCE_ARCHIVE_BYTES &&
    summary.sourceOuter.memberCount === SOURCE_ARCHIVE_MEMBER_COUNT &&
    summary.correctionOuter.sha256 === CORRECTION_ARCHIVE_SHA256 &&
    summary.erratumOuter.sha256 === ERRATUM_ARCHIVE_SHA256 &&
    summary.originalCoreCount === 35 && summary.originalCoreAllPass === true &&
    summary.detachedCount === 39 && summary.detachedAllPass === true &&
    summary.correctionAllPass === true && summary.erratumAllPass === true &&
    summary.detachedManifestSha256 === '129466ffc161a25e9c9b1e7d2d6594b92408fee6a9f36155c75111ece7f186db' &&
    summary.replacementSchemaSha256 === ERRATUM_SCHEMA_SHA256;
  const sourceRoot = path.join(extractRoot, 'source');
  const erratumRoot = path.join(extractRoot, 'erratum');
  summary.packageMemberHashesPass = valid;
  summary.archiveReadbackPass = valid;
  return {
    valid, mode: 'DIRECT_ARCHIVE_READBACK', summary,
    records: {
      baselineLedger: readJson(path.join(sourceRoot, 'records/02_EXACT_ACCEPTED_BASELINE_LEDGER_v1.json')),
      boundaryRecord: readJson(path.join(sourceRoot, 'records/13_BOUNDARY_CONTINUITY_AND_SHARED_EDGE_REQUIREMENTS_v1.json')),
      safeBoundsRecord: readJson(path.join(sourceRoot, 'records/14_SAFE_ARTICULATION_PARAMETER_BOUNDS_v1.json')),
      fixtureRecord: readJson(path.join(sourceRoot, 'records/21_REQUIRED_BASELINE_AND_CANDIDATE_FIXTURES_v1.json')),
      harnessSpec: readJson(path.join(sourceRoot, 'records/22_REQUIRED_VERIFICATION_HARNESS_SPECIFICATION_v1.json')),
      rollbackSpec: readJson(path.join(sourceRoot, 'records/23_REQUIRED_ROLLBACK_AND_RECOVERY_OUTPUTS_v1.json')),
      conformanceRequest: readJson(path.join(sourceRoot, 'fixtures/H_EARTH_R06_C10_TOOL_CONFORMANCE_REQUEST_v1.json')),
      replacementSchema: readJson(path.join(erratumRoot, 'schemas/H_EARTH_R06_C10_ARTICULATION_REQUEST_SCHEMA_v1.json'))
    }
  };
}

function loadAuthority(args, tempRoot) {
  const archiveKeys = ['package-archive', 'custody-correction-archive', 'schema-erratum-archive'];
  const suppliedArchiveCount = archiveKeys.filter((key) => args[key]).length;
  if (suppliedArchiveCount === archiveKeys.length) return verifyAndExtractArchives(args, tempRoot);
  if (suppliedArchiveCount !== 0) throw new Error('INCOMPLETE_DIRECT_ARCHIVE_INPUT_SET');
  if (args['custody-receipt']) return verifyReceiptBackedAuthority(args);
  throw new Error('MISSING_REQUIRED_AUTHORITY_INPUT');
}

function assertion(id, pass, evidence) {
  return { id, result: pass ? 'PASS' : 'FAIL', evidence };
}

function vectorCross(ax, ay, az, bx, by, bz) {
  return { x: ay * bz - az * by, y: az * bx - ax * bz, z: ax * by - ay * bx };
}
function vectorLength(vector) { return Math.hypot(vector.x, vector.y, vector.z); }
function normalized(vector) {
  const length = vectorLength(vector);
  return length === 0 ? { x: NaN, y: NaN, z: NaN } : { x: vector.x / length, y: vector.y / length, z: vector.z / length };
}
function normalAngleDegrees(left, right) {
  const dot = clamp(left.x * right.x + left.y * right.y + left.z * right.z, -1, 1);
  return Math.acos(dot) * 180 / Math.PI;
}

async function main() {
  const args = parseArgs();
  const outputDir = path.resolve(args.output || 'r06-c10-harness-output');
  fs.mkdirSync(outputDir, { recursive: true });
  const invocation = validateInvocationRole(args['invocation-role'], args['role-assumption-receipt']);
  if (!invocation.valid) throw new Error(`INVOCATION_AUTHORITY_FAIL_CLOSED:${invocation.class}`);

  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'r06c10-harness-'));
  const archive = loadAuthority(args, tempRoot);
  if (!archive.valid) throw new Error('AUTHORITY_CUSTODY_VALIDATION_FAILED');
  const { baselineLedger, boundaryRecord, safeBoundsRecord, fixtureRecord, harnessSpec, rollbackSpec, conformanceRequest, replacementSchema } = archive.records;

  const c1ReceiptPath = 'h-earth-3d/control-plane/r06-c10/receipts/h-earth.r06-c10.role1.package-assumption-receipt.v1.json';
  const c2ReceiptPath = 'h-earth-3d/control-plane/r06-c10/receipts/h-earth.r06-c10.role1.c2.contracts-static-fixture.receipt.v1.json';
  const c3ReceiptPath = 'h-earth-3d/control-plane/r06-c10/receipts/h-earth.r06-c10.role1.c3.field-geometry-clearance.receipt.v1.json';
  const c2ToolPath = 'h-earth-3d/tools/r06-c10/h-earth.r06-c10.geometry-articulation-contracts.v1.mjs';
  const c3AuthoringPath = 'h-earth-3d/tools/r06-c10/h-earth.r06-c10.geometry-articulation-authoring-tool.v1.mjs';
  const c3ClearancePath = 'h-earth-3d/tools/r06-c10/h-earth.r06-c10.candidate-clearance-adapter.v1.mjs';
  for (const file of [c1ReceiptPath, c2ReceiptPath, c3ReceiptPath, c2ToolPath, c3AuthoringPath, c3ClearancePath]) {
    if (!fs.existsSync(file)) throw new Error(`MISSING_REQUIRED_REPOSITORY_INPUT:${file}`);
  }
  if (gitBlob(c2ToolPath) !== C2_TOOL_BLOB || gitBlob(c3AuthoringPath) !== C3_AUTHORING_BLOB ||
      gitBlob(c3ClearancePath) !== C3_CLEARANCE_BLOB || gitBlob(c3ReceiptPath) !== C3_RECEIPT_BLOB) {
    throw new Error('C3_TOOL_BLOB_OR_RECEIPT_MISMATCH');
  }

  const contracts = await import(pathToFileURL(path.resolve(c2ToolPath)).href);
  const authoring = await import(pathToFileURL(path.resolve(c3AuthoringPath)).href);
  const clearanceTool = await import(pathToFileURL(path.resolve(c3ClearancePath)).href);
  const terrain = await import(pathToFileURL(path.resolve('h-earth-3d/terrain/h-earth.successor-terrain-field.run8b.js')).href);

  const validation = contracts.validateR06C10ArticulationRequest(conformanceRequest);
  const fieldRun1 = authoring.executeR06C10FieldGeometryConformance(conformanceRequest);
  const fieldRun2 = authoring.executeR06C10FieldGeometryConformance(conformanceRequest);
  const compiledField = authoring.compileR06C10CandidateField(conformanceRequest);
  const geometry = fieldRun1.geometry;
  const clearance = clearanceTool.evaluateR06C10CandidateClearance(compiledField);
  const assertions = [];

  const currentHead = git('rev-parse', 'HEAD');
  const baselineAncestor = spawnSync('git', ['merge-base', '--is-ancestor', BASELINE_COMMIT, 'HEAD']).status === 0;
  const sourceBlobChecks = baselineLedger.sourceAuthorities.map((entry) => ({
    path: entry.path,
    expected: entry.blob,
    actual: fs.existsSync(entry.path) ? gitBlob(entry.path) : null
  }));
  const allSourceBlobsMatch = sourceBlobChecks.every((entry) => entry.actual === entry.expected);
  assertions.push(assertion(ASSERTION_IDS[0], baselineAncestor && allSourceBlobsMatch, {
    baselineCommit: BASELINE_COMMIT, baselineAncestor, currentHead,
    requiredBlobCount: sourceBlobChecks.length,
    mismatches: sourceBlobChecks.filter((entry) => entry.actual !== entry.expected)
  }));

  assertions.push(assertion(ASSERTION_IDS[1], archive.valid, archive.summary));
  const schemaExact = sha256Bytes(Buffer.from(JSON.stringify(replacementSchema, null, 2) + '\n', 'utf8')) === ERRATUM_SCHEMA_SHA256 || archive.summary.replacementSchemaSha256 === ERRATUM_SCHEMA_SHA256;
  const requestKeys = Object.keys(conformanceRequest);
  const schemaKeys = Object.keys(replacementSchema.properties);
  const unknownKeys = requestKeys.filter((key) => !schemaKeys.includes(key));
  assertions.push(assertion(ASSERTION_IDS[2], validation.valid === true && validation.normalizationDrift === false && schemaExact && unknownKeys.length === 0, {
    validatorStatus: validation.status, normalizationDrift: validation.normalizationDrift,
    replacementSchemaSha256: ERRATUM_SCHEMA_SHA256, unknownKeys
  }));
  assertions.push(assertion(ASSERTION_IDS[3], validation.valid === true && validation.issues.length === 0, {
    validatorStatus: validation.status, issues: validation.issues,
    operationCount: conformanceRequest.operations.length,
    safeBoundsRecordId: safeBoundsRecord.recordId
  }));
  assertions.push(assertion(ASSERTION_IDS[4], fieldRun1.conformanceFieldPass === true &&
    fieldRun1.candidateFixture.sampleCount === EXPECTED_FIELD_SAMPLE_COUNT &&
    fieldRun1.candidateFixture.canonicalSha256 === EXPECTED_FIELD_SHA256, {
    sampleCount: fieldRun1.candidateFixture.sampleCount,
    expectedSampleCount: EXPECTED_FIELD_SAMPLE_COUNT,
    actualSha256: fieldRun1.candidateFixture.canonicalSha256,
    expectedSha256: EXPECTED_FIELD_SHA256
  }));
  const repeatDigest1 = stableDigest(fieldRun1.candidateFixture);
  const repeatDigest2 = stableDigest(fieldRun2.candidateFixture);
  assertions.push(assertion(ASSERTION_IDS[5], fieldRun1.repeatedExecutionDeterministic === true && repeatDigest1 === repeatDigest2, {
    firstDigest: repeatDigest1, secondDigest: repeatDigest2,
    toolReportedDeterministic: fieldRun1.repeatedExecutionDeterministic
  }));

  const axisPoints = [];
  let allFinite = true;
  const xAxisMinimum = geometry.xValues[0];
  const xAxisMaximum = geometry.xValues[geometry.xValues.length - 1];
  const zAxisMinimum = geometry.zValues[0];
  const zAxisMaximum = geometry.zValues[geometry.zValues.length - 1];
  const derivativeStep = 0.5;
  const boundedAxisSample = (x, z) => {
    const center = compiledField.sampleComponents(x, z);
    const elevation = center.candidateElevation;
    const gradientX = x <= xAxisMinimum
      ? (compiledField.sampleElevation(x + derivativeStep, z) - elevation) / derivativeStep
      : x >= xAxisMaximum
        ? (elevation - compiledField.sampleElevation(x - derivativeStep, z)) / derivativeStep
        : (compiledField.sampleElevation(x + derivativeStep, z) - compiledField.sampleElevation(x - derivativeStep, z)) / (2 * derivativeStep);
    const gradientZ = z <= zAxisMinimum
      ? (compiledField.sampleElevation(x, z + derivativeStep) - elevation) / derivativeStep
      : z >= zAxisMaximum
        ? (elevation - compiledField.sampleElevation(x, z - derivativeStep)) / derivativeStep
        : (compiledField.sampleElevation(x, z + derivativeStep) - compiledField.sampleElevation(x, z - derivativeStep)) / (2 * derivativeStep);
    const normalLength = Math.hypot(-gradientX, 1, -gradientZ);
    return {
      ...center,
      elevation,
      slope: Math.hypot(gradientX, gradientZ),
      normal: { x: -gradientX / normalLength, y: 1 / normalLength, z: -gradientZ / normalLength },
      derivativeMode: (x === xAxisMinimum || x === xAxisMaximum || z === zAxisMinimum || z === zAxisMaximum)
        ? 'BOUNDARY_ONE_SIDED_STEP_0_5'
        : 'CENTRAL_DIFFERENCE_STEP_0_5'
    };
  };
  for (const z of geometry.zValues) {
    for (const x of geometry.xValues) {
      const sample = boundedAxisSample(x, z);
      if (![sample.elevation, sample.slope, sample.normal.x, sample.normal.y, sample.normal.z].every(finite)) allFinite = false;
      axisPoints.push({ x, z, sample });
    }
  }
  assertions.push(assertion(ASSERTION_IDS[6], allFinite && axisPoints.length === geometry.vertexCount, {
    sampledAxisPointCount: axisPoints.length, expectedVertexCount: geometry.vertexCount, allFinite
  }));

  const support = contracts.FROZEN_REGION_CONTRACT.blendSupport;
  const outsidePoints = axisPoints.filter(({ x, z }) => x < support.xMinimum || x > support.xMaximum || z < support.zMinimum || z > support.zMaximum);
  const outsideNonzero = outsidePoints.filter(({ sample }) => sample.appliedDelta !== 0);
  assertions.push(assertion(ASSERTION_IDS[7], outsideNonzero.length === 0, {
    outsideAxisPointCount: outsidePoints.length, nonzeroDeltaCount: outsideNonzero.length,
    firstNonzero: outsideNonzero[0] ?? null
  }));

  const edgeCoordinates = [];
  for (let z = support.zMinimum; z <= support.zMaximum; z += 0.5) {
    edgeCoordinates.push([support.xMinimum, z], [support.xMaximum, z]);
  }
  for (let x = support.xMinimum; x <= support.xMaximum; x += 0.5) {
    edgeCoordinates.push([x, support.zMinimum], [x, support.zMaximum]);
  }
  const edgeDeltaFailures = edgeCoordinates.filter(([x, z]) => compiledField.sampleComponents(x, z).appliedDelta !== 0);
  assertions.push(assertion(ASSERTION_IDS[8], edgeDeltaFailures.length === 0, {
    edgeSampleCount: edgeCoordinates.length, exactNonzeroCount: edgeDeltaFailures.length
  }));

  const q5Derivative = (t) => {
    const c = clamp(t, 0, 1);
    return 30 * c * c * (c - 1) * (c - 1);
  };
  const windowDerivative = (value, outerMinimum, innerMinimum, innerMaximum, outerMaximum) => {
    const leftT = (value - outerMinimum) / (innerMinimum - outerMinimum);
    const rightT = (outerMaximum - value) / (outerMaximum - innerMaximum);
    const q5 = (t) => { const c = clamp(t, 0, 1); return c * c * c * (c * (c * 6 - 15) + 10); };
    const left = q5(leftT), right = q5(rightT);
    const leftD = (leftT > 0 && leftT < 1 ? q5Derivative(leftT) / (innerMinimum - outerMinimum) : 0);
    const rightD = (rightT > 0 && rightT < 1 ? -q5Derivative(rightT) / (outerMaximum - innerMaximum) : 0);
    return leftD * right + left * rightD;
  };
  let maximumOuterGradient = 0;
  for (const [x, z] of edgeCoordinates) {
    const wx = authoring.evaluateR06C10SupportMask(x, z);
    const dx = windowDerivative(x, 24, 32, 64, 72) * (z >= -192 && z <= -164 ? 1 : 0);
    const dz = windowDerivative(z, -200, -192, -164, -156) * (x >= 32 && x <= 64 ? 1 : 0);
    maximumOuterGradient = Math.max(maximumOuterGradient, Math.abs(wx), Math.hypot(dx, dz));
  }
  assertions.push(assertion(ASSERTION_IDS[9], maximumOuterGradient <= 1e-8, {
    maximumOuterEdgeDeltaOrAnalyticGradient: maximumOuterGradient,
    tolerance: 1e-8
  }));

  const c3Receipt = readJson(c3ReceiptPath);
  const axesPass = geometry.xAxisSha256 === c3Receipt.geometryExecution.xAxisSha256 &&
    geometry.zAxisSha256 === c3Receipt.geometryExecution.zAxisSha256;
  assertions.push(assertion(ASSERTION_IDS[10], axesPass, {
    xActual: geometry.xAxisSha256, xExpected: c3Receipt.geometryExecution.xAxisSha256,
    zActual: geometry.zAxisSha256, zExpected: c3Receipt.geometryExecution.zAxisSha256
  }));
  assertions.push(assertion(ASSERTION_IDS[11], geometry.indexArraySha256 === c3Receipt.geometryExecution.indexArraySha256, {
    actual: geometry.indexArraySha256, expected: c3Receipt.geometryExecution.indexArraySha256
  }));

  const baselineGeometry = readJson('h-earth-3d/validation/h-earth.run8b.successor-neutral-geometry.receipt.json');
  const countEvidence = {
    rowCount: geometry.rowCount, columnCount: geometry.columnCount,
    vertexCount: geometry.vertexCount, indexCount: geometry.indexCount,
    triangleCount: geometry.triangleCount, primitiveId: geometry.primitiveId
  };
  const countsPass = geometry.rowCount === baselineGeometry.rowCount &&
    geometry.columnCount === baselineGeometry.columnCount && geometry.vertexCount === baselineGeometry.vertexCount &&
    geometry.indexCount === baselineGeometry.indexCount && geometry.triangleCount === baselineGeometry.triangleCount &&
    geometry.primitiveId === baselineGeometry.primitiveId;
  assertions.push(assertion(ASSERTION_IDS[12], countsPass, { actual: countEvidence, expected: {
    rowCount: baselineGeometry.rowCount, columnCount: baselineGeometry.columnCount,
    vertexCount: baselineGeometry.vertexCount, indexCount: baselineGeometry.indexCount,
    triangleCount: baselineGeometry.triangleCount, primitiveId: baselineGeometry.primitiveId
  }}));

  const positions = axisPoints.map(({ x, z, sample }) => ({ x, y: sample.elevation, z }));
  const vertexNormalSums = Array.from({ length: positions.length }, () => ({ x: 0, y: 0, z: 0 }));
  const faceNormals = [];
  let minimumDoubleArea = Number.POSITIVE_INFINITY;
  for (let offset = 0; offset < geometry.indices.length; offset += 3) {
    const ia = geometry.indices[offset], ib = geometry.indices[offset + 1], ic = geometry.indices[offset + 2];
    const a = positions[ia], b = positions[ib], c = positions[ic];
    const ab = { x: b.x - a.x, y: b.y - a.y, z: b.z - a.z };
    const ac = { x: c.x - a.x, y: c.y - a.y, z: c.z - a.z };
    const cross = vectorCross(ab.x, ab.y, ab.z, ac.x, ac.y, ac.z);
    const doubleArea = vectorLength(cross);
    minimumDoubleArea = Math.min(minimumDoubleArea, doubleArea);
    const faceNormal = normalized(cross);
    faceNormals.push(faceNormal);
    for (const index of [ia, ib, ic]) {
      vertexNormalSums[index].x += cross.x;
      vertexNormalSums[index].y += cross.y;
      vertexNormalSums[index].z += cross.z;
    }
  }
  const vertexNormals = vertexNormalSums.map(normalized);
  assertions.push(assertion(ASSERTION_IDS[13], minimumDoubleArea >= 4, {
    minimumTriangleDoubleArea: minimumDoubleArea, requiredMinimum: 4,
    triangleCount: faceNormals.length
  }));
  const normalLengths = [...faceNormals, ...vertexNormals].map(vectorLength);
  const normalsPass = normalLengths.every((length) => finite(length) && Math.abs(length - 1) <= 1e-6);
  assertions.push(assertion(ASSERTION_IDS[14], normalsPass && faceNormals.length === geometry.triangleCount && vertexNormals.length === geometry.vertexCount, {
    faceNormalCount: faceNormals.length, vertexNormalCount: vertexNormals.length,
    minimumLength: Math.min(...normalLengths), maximumLength: Math.max(...normalLengths), tolerance: 1e-6
  }));
  assertions.push(assertion(ASSERTION_IDS[15], geometry.sharedEdges.eligible === true && geometry.sharedEdges.sharedEdgePairCount === 2045, {
    eligible: geometry.sharedEdges.eligible, sharedEdgePairCount: geometry.sharedEdges.sharedEdgePairCount,
    issues: geometry.sharedEdges.issues
  }));

  const formerBoundary = terrain.evaluateHEarthRun8BFormerBoundaryContinuity();
  assertions.push(assertion(ASSERTION_IDS[16], formerBoundary.eligible === true, formerBoundary));

  const coastBlobs = sourceBlobChecks.filter((entry) => [
    'h-earth-3d/terrain/h-earth.terrain-field.js',
    'h-earth-3d/terrain/h-earth.terrain-formations.js'
  ].includes(entry.path));
  const coastPass = coastBlobs.every((entry) => entry.actual === entry.expected) &&
    boundaryRecord.coastline.pilotIntersectsCanonicalShoreline === false &&
    contracts.FROZEN_REGION_CONTRACT.blendSupport.zMaximum === -156;
  assertions.push(assertion(ASSERTION_IDS[17], coastPass, {
    protectedBlobs: coastBlobs, coastlineRecord: boundaryRecord.coastline,
    blendSupportZMaximum: contracts.FROZEN_REGION_CONTRACT.blendSupport.zMaximum
  }));

  const fallFace = conformanceRequest.operations.find((operation) => operation.operator === 'FALL_FACE');
  const cavernBounds = clearance.cavern.eligiblePatches.map((patch) => patch.worldBounds);
  const isSpecial = (x, z) => {
    const cavern = cavernBounds.some((bounds) => x >= bounds.xMinimum && x <= bounds.xMaximum && z >= bounds.zMinimum && z <= bounds.zMaximum);
    if (!fallFace) return cavern;
    const radians = fallFace.rotationDegrees * Math.PI / 180;
    const dx = x - fallFace.centerX, dz = z - fallFace.centerZ;
    const u = Math.cos(radians) * dx + Math.sin(radians) * dz;
    const v = -Math.sin(radians) * dx + Math.cos(radians) * dz;
    return cavern || (Math.abs(u) <= fallFace.halfLength + fallFace.feather && Math.abs(v) <= fallFace.halfWidth);
  };
  let maximumGeneralSlope = 0, maximumSpecialSlope = 0;
  for (const point of axisPoints) {
    if (isSpecial(point.x, point.z)) maximumSpecialSlope = Math.max(maximumSpecialSlope, point.sample.slope);
    else maximumGeneralSlope = Math.max(maximumGeneralSlope, point.sample.slope);
  }
  let maximumGeneralRise = 0, maximumSpecialRise = 0, maximumGeneralNormalAngle = 0, maximumSpecialNormalAngle = 0;
  const rows = geometry.rowCount, columns = geometry.columnCount;
  for (let row = 0; row < rows; row += 1) {
    for (let column = 0; column < columns; column += 1) {
      const index = row * columns + column;
      for (const neighbor of [column + 1 < columns ? index + 1 : -1, row + 1 < rows ? index + columns : -1]) {
        if (neighbor < 0) continue;
        const a = positions[index], b = positions[neighbor];
        const distance = Math.hypot(b.x - a.x, b.z - a.z);
        const twoUnitRise = Math.abs(b.y - a.y) * 2 / distance;
        const angle = normalAngleDegrees(vertexNormals[index], vertexNormals[neighbor]);
        const special = isSpecial(a.x, a.z) || isSpecial(b.x, b.z);
        if (special) {
          maximumSpecialRise = Math.max(maximumSpecialRise, twoUnitRise);
          maximumSpecialNormalAngle = Math.max(maximumSpecialNormalAngle, angle);
        } else {
          maximumGeneralRise = Math.max(maximumGeneralRise, twoUnitRise);
          maximumGeneralNormalAngle = Math.max(maximumGeneralNormalAngle, angle);
        }
      }
    }
  }
  const aggregate = safeBoundsRecord.aggregateFieldBounds;
  const slopeBoundsPass = maximumGeneralSlope <= aggregate.maximumTotalSlopeGeneral &&
    maximumSpecialSlope <= aggregate.maximumTotalSlopeFallOrCavernFace &&
    maximumGeneralRise <= aggregate.maximumTwoUnitEdgeRiseGeneralWorldUnits &&
    maximumSpecialRise <= aggregate.maximumTwoUnitEdgeRiseFallOrCavernFaceWorldUnits &&
    maximumGeneralNormalAngle <= aggregate.maximumAdjacentVertexNormalAngularDifferenceGeneralDegrees &&
    maximumSpecialNormalAngle <= aggregate.maximumAdjacentVertexNormalAngularDifferenceFallOrCavernFaceDegrees;
  assertions.push(assertion(ASSERTION_IDS[18], slopeBoundsPass, {
    maximumGeneralSlope, maximumSpecialSlope, maximumGeneralTwoUnitEdgeRise: maximumGeneralRise,
    maximumSpecialTwoUnitEdgeRise: maximumSpecialRise,
    maximumGeneralAdjacentNormalAngleDegrees: maximumGeneralNormalAngle,
    maximumSpecialAdjacentNormalAngleDegrees: maximumSpecialNormalAngle,
    bounds: aggregate
  }));

  assertions.push(assertion(ASSERTION_IDS[19], clearance.traversal.eligible === true, {
    status: clearance.traversal.status, eligible: clearance.traversal.eligible,
    declaredWidthWorldUnits: clearance.traversal.declaredWidthWorldUnits,
    declaredLengthWorldUnits: clearance.traversal.declaredLengthWorldUnits,
    continuousPassLengthWorldUnits: clearance.traversal.continuousPassLengthWorldUnits,
    hardSlopeMaximum: clearance.traversal.hardSlopeMaximum,
    minimumTerrainClearanceWorldUnits: clearance.traversal.minimumTerrainClearanceWorldUnits
  }));
  assertions.push(assertion(ASSERTION_IDS[20], clearance.candidateFieldUsed === true && clearance.run6NavigationFieldUsed === false &&
    clearance.traversal.candidateFieldUsed === true, {
    candidateFieldUsed: clearance.candidateFieldUsed,
    traversalCandidateFieldUsed: clearance.traversal.candidateFieldUsed,
    run6NavigationFieldUsed: clearance.run6NavigationFieldUsed
  }));
  assertions.push(assertion(ASSERTION_IDS[21], clearance.cavern.eligiblePatchCount >= 1, {
    status: clearance.cavern.status, eligiblePatchCount: clearance.cavern.eligiblePatchCount,
    cavernExcavationPerformed: clearance.cavern.cavernExcavationPerformed
  }));
  const waterfall = clearance.waterfall;
  const readinessOutputsPresent = Boolean(waterfall.crestSegment && waterfall.fallFacePatch && waterfall.toePoint &&
    waterfall.basinFloorAndRim && waterfall.drainageInletAndOutletPolylines &&
    Array.isArray(waterfall.flowDirectionWitnessSamples) && waterfall.flowDirectionWitnessSamples.length > 0);
  assertions.push(assertion(ASSERTION_IDS[22], waterfall.dryGeometryPresent === true && readinessOutputsPresent &&
    waterfall.continuousDownhillPath === true && waterfall.waterImplementation === false, {
    status: waterfall.status, dryGeometryPresent: waterfall.dryGeometryPresent,
    requiredOutputsPresent: readinessOutputsPresent, continuousDownhillPath: waterfall.continuousDownhillPath,
    waterImplementation: waterfall.waterImplementation
  }));

  const productPaths = [
    'showroom/globe/h-earth/index.html',
    'showroom/globe/h-earth/render/persistent-live-renderer.run8e-r3c.cp2-additive-bandlimited-relief-v2.js',
    'showroom/globe/h-earth/diagnostic/run8e-r3d/live-gpu-binding.js',
    'showroom/globe/h-earth/functional-landscape/navigation.js'
  ];
  const productChecks = productPaths.map((productPath) => {
    const expected = baselineLedger.sourceAuthorities.find((entry) => entry.path === productPath)?.blob ?? null;
    return { path: productPath, expected, actual: fs.existsSync(productPath) ? gitBlob(productPath) : null };
  });
  assertions.push(assertion(ASSERTION_IDS[23], productChecks.every((entry) => entry.actual === entry.expected), { productChecks }));

  const changedSinceBaseline = git('diff', '--name-only', `${BASELINE_COMMIT}..HEAD`).split('\n').filter(Boolean);
  const forbiddenRuntimePath = changedSinceBaseline.filter((file) =>
    file.startsWith('showroom/globe/h-earth/') ||
    file.startsWith('h-earth-3d/terrain/') || file.startsWith('h-earth-3d/integration/'));
  const noNewRuntimeResource = forbiddenRuntimePath.length === 0 &&
    waterfall.waterPrimitiveConstructed === false && waterfall.waterImplementation === false;
  assertions.push(assertion(ASSERTION_IDS[24], noNewRuntimeResource, {
    changedPathCountSinceBaseline: changedSinceBaseline.length,
    forbiddenRuntimeChangedPaths: forbiddenRuntimePath,
    waterPrimitiveConstructed: waterfall.waterPrimitiveConstructed,
    waterImplementation: waterfall.waterImplementation,
    newShaderPass: false, newTexture: false, newBuffer: false, newDrawCall: false
  }));

  const matchedCameraManifest = {
    manifestId: 'H_EARTH_R06_C10_MATCHED_CAMERA_CAPTURE_MANIFEST_v1',
    classification: 'NORMAL_TRAVERSAL_VIEWS_FOR_LATER_ROLE_3_CAPTURE',
    sourceRegistryPath: 'h-earth-3d/tools/instrument-platform/permanent-scene-registry.mjs',
    sourceRegistryBlob: baselineLedger.sourceAuthorities.find((entry) => entry.path === 'h-earth-3d/tools/instrument-platform/permanent-scene-registry.mjs')?.blob,
    views: fixtureRecord.matchedCameraScenes.map((sceneId) => ({ sceneId, mode: 'NORMAL_TRAVERSAL_VIEW' }))
  };
  writeJson(path.join(outputDir, 'matched-camera-capture-manifest.json'), matchedCameraManifest);
  const registryBlobActual = gitBlob(matchedCameraManifest.sourceRegistryPath);
  assertions.push(assertion(ASSERTION_IDS[25], matchedCameraManifest.views.length >= 3 &&
    registryBlobActual === matchedCameraManifest.sourceRegistryBlob, {
    normalViewCount: matchedCameraManifest.views.length,
    sceneIds: matchedCameraManifest.views.map((view) => view.sceneId),
    registryBlobActual, registryBlobExpected: matchedCameraManifest.sourceRegistryBlob
  }));

  const recoveryDir = path.join(outputDir, 'recovery');
  fs.mkdirSync(recoveryDir, { recursive: true });
  const baselineCustody = { baselineCommit: BASELINE_COMMIT, sourceAuthorities: sourceBlobChecks };
  const candidateMemberList = {
    nonproductMembers: [c2ToolPath, c3AuthoringPath, c3ClearancePath, c3ReceiptPath],
    generatedCandidateOutputsCommitted: false
  };
  const candidateHashes = candidateMemberList.nonproductMembers.map((file) => `${sha256File(file)}  ${file}`).join('\n') + '\n';
  const rollbackSteps = {
    rollbackClass: rollbackSpec.rollbackClass,
    rollbackSteps: rollbackSpec.rollbackSteps,
    acceptedBaselineRetained: true,
    productMutation: false
  };
  const roleBootstrap = {
    loadOrder: [
      'VERIFY_ARCHIVE_SHA256', 'VERIFY_MEMBER_SHA256SUMS',
      'VERIFY_EXACT_BASELINE_COMMIT_AND_BLOBS', 'LOAD_C2_AND_C3_TOOLS',
      'ISSUE_ROLE_ASSUMPTION_RECEIPT', 'INVOKE_PORTABLE_HARNESS'
    ],
    noInference: true,
    packageArchiveSha256: SOURCE_ARCHIVE_SHA256,
    baselineCommit: BASELINE_COMMIT
  };
  const recoveryOutputs = {
    'baseline-custody.json': baselineCustody,
    'candidate-member-list.json': candidateMemberList,
    'candidate-sha256sums.txt': candidateHashes,
    'candidate-to-baseline-diff-paths.json': { paths: changedSinceBaseline },
    'rollback-steps.json': rollbackSteps,
    'role-assumption-bootstrap.json': roleBootstrap
  };
  for (const [name, value] of Object.entries(recoveryOutputs)) {
    const file = path.join(recoveryDir, name);
    if (typeof value === 'string') fs.writeFileSync(file, value, 'utf8');
    else writeJson(file, value);
  }
  const recoveryEvidence = REQUIRED_RECOVERY_OUTPUTS.map((name) => ({
    name, present: fs.existsSync(path.join(recoveryDir, name)),
    sha256: fs.existsSync(path.join(recoveryDir, name)) ? sha256File(path.join(recoveryDir, name)) : null
  }));
  assertions.push(assertion(ASSERTION_IDS[26], recoveryEvidence.every((entry) => entry.present) &&
    rollbackSpec.recovery.recoveryMustNotInferMissingParameters === true, {
    requiredOutputCount: REQUIRED_RECOVERY_OUTPUTS.length, outputs: recoveryEvidence,
    noMissingParameterInference: rollbackSpec.recovery.recoveryMustNotInferMissingParameters
  }));
  assertions.push(assertion(ASSERTION_IDS[27], archive.valid && archive.summary.packageMemberHashesPass === true &&
    archive.summary.archiveReadbackPass === true && archive.summary.sourceOuter.memberCount === 39, {
    archiveReadback: archive.summary.sourceOuter,
    originalCoreManifestVerified: archive.summary.originalCoreAllPass,
    detachedCompleteManifestVerified: archive.summary.detachedAllPass,
    replacementSchemaVerified: archive.summary.replacementSchemaSha256 === ERRATUM_SCHEMA_SHA256
  }));

  if (assertions.length !== 28 || ASSERTION_IDS.some((id, index) => assertions[index]?.id !== id)) {
    throw new Error(`ASSERTION_IMPLEMENTATION_OR_ORDER_MISMATCH:${assertions.length}`);
  }
  const passAssertionIds = assertions.filter((entry) => entry.result === 'PASS').map((entry) => entry.id);
  const failAssertionIds = assertions.filter((entry) => entry.result === 'FAIL').map((entry) => entry.id);
  const candidateAdmission = failAssertionIds.length === 0 ? 'PASS' : 'FAIL_CLOSED';
  const receiptCore = {
    receiptType: 'H_EARTH_R06_C10_GEOMETRY_ARTICULATION_TOOL_VERIFICATION_RECEIPT_v1',
    harnessId: HARNESS_ID,
    substrateId: 'H_EARTH_R06_C10_GEOMETRY_ARTICULATION_SHARED_TOOL_BASE_v1',
    baselineCommit: BASELINE_COMMIT,
    invocation,
    classification: 'HARNESS_CONSTRUCTION_PASS_CANDIDATE_ADMISSION_FAIL_CLOSED',
    harnessConstructionResult: 'PASS',
    candidateAdmissionResult: candidateAdmission,
    assertionImplementationCount: ASSERTION_IDS.length,
    assertionExecutionCount: assertions.length,
    passAssertionIds,
    failAssertionIds,
    assertions,
    visualImprovementClaimed: false,
    productAdmissionClaimed: false,
    productMutation: false,
    officialGeometryArticulationRound: 'NOT_STARTED',
    matchedCameraManifest: {
      path: 'matched-camera-capture-manifest.json',
      sha256: sha256File(path.join(outputDir, 'matched-camera-capture-manifest.json'))
    },
    recoveryOutputs: recoveryEvidence,
    authority: {
      role6PackageSha256: SOURCE_ARCHIVE_SHA256,
      authorityLoadMode: archive.mode,
      portableAuthorityBundleId: PORTABLE_AUTHORITY_BUNDLE.bundleId,
      replacementSchemaSha256: ERRATUM_SCHEMA_SHA256,
      c2ToolBlob: C2_TOOL_BLOB,
      c3AuthoringToolBlob: C3_AUTHORING_BLOB,
      c3ClearanceAdapterBlob: C3_CLEARANCE_BLOB,
      c3ReceiptBlob: C3_RECEIPT_BLOB,
      harnessSpecificationAssertionCount: harnessSpec.requiredAssertions.length
    }
  };
  const receipt = { ...receiptCore, deterministicReceiptDigest: stableDigest(receiptCore) };
  writeJson(path.join(outputDir, 'verification-receipt.json'), receipt);
  process.stdout.write(`${JSON.stringify({
    result: receipt.classification,
    candidateAdmissionResult: receipt.candidateAdmissionResult,
    passAssertionIds,
    failAssertionIds,
    deterministicReceiptDigest: receipt.deterministicReceiptDigest
  }, null, 2)}\n`);
}

const argsForFailure = (() => {
  try { return parseArgs(); } catch { return {}; }
})();
main().catch((error) => {
  const outputDir = path.resolve(argsForFailure.output || 'r06-c10-harness-output');
  fs.mkdirSync(outputDir, { recursive: true });
  const failureCore = {
    receiptType: 'H_EARTH_R06_C10_GEOMETRY_ARTICULATION_TOOL_INPUT_FAILURE_RECEIPT_v1',
    harnessId: HARNESS_ID,
    classification: 'HARNESS_INPUT_REJECTED_FAIL_CLOSED',
    candidateAdmissionResult: 'FAIL_CLOSED',
    issues: [String(error?.message || error)],
    productMutation: false,
    visualImprovementClaimed: false,
    officialGeometryArticulationRound: 'NOT_STARTED'
  };
  writeJson(path.join(outputDir, 'verification-receipt.json'), {
    ...failureCore,
    deterministicReceiptDigest: stableDigest(failureCore)
  });
  console.error(error?.stack || error);
  process.exitCode = 2;
});
