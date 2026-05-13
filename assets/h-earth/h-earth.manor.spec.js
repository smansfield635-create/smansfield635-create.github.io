// /assets/h-earth/h-earth.manor.spec.js
// TNT FULL-FILE REPLACEMENT
// H_EARTH_WESTERN_GOLDEN_SHELF_MANOR_GROUND_PLACEMENT_TNT_v1
// Owns: local placement adapter for the already-defined Rich Manor.
// Does not redefine: room count, acreage canon, vault canon, internal room map, or final architecture.

export const H_EARTH_MANOR_SPEC_VERSION = "h-earth-manor-spec-placement-adapter-v1";
export const H_EARTH_MANOR_SPEC_CONTRACT = "H_EARTH_WESTERN_GOLDEN_SHELF_MANOR_GROUND_PLACEMENT_TNT_v1";

export const RICH_MANOR_SOURCE_AUTHORITY = Object.freeze({
  sourceObject: "Rich Manor and Estate",
  existingDefinitionExternal: true,
  redefineManor: false,
  inventRoomCount: false,
  inventInternalStructure: false,
  preserveDefinedRooms: true,
  preserveDefinedAcreage: true,
  preserveDefinedVault: true,
  preserveDefinedFloorLogic: true
});

export const RICH_MANOR_KNOWN_CANON = Object.freeze({
  estateAcres: 256,
  floors: 4,
  vaultKnown: true,
  basementKnown: true,
  atticKnown: true,
  roomCount: "DEFINED_OUTSIDE_THIS_FILE",
  internalRoomMap: "DEFINED_OUTSIDE_THIS_FILE",
  vaultStructure: "DEFINED_OUTSIDE_THIS_FILE",
  publicPlacementUse: "PLACEMENT_MASSING_ONLY"
});

export const WESTERN_GOLDEN_SHELF_MANOR_PLACEMENT = Object.freeze({
  targetPlanet: "H-Earth",
  selectedRegion: "Western Golden Shelf",
  placementStatus: "CONTROLLED_MANOR_GROUND_PLACEMENT_AUTHORIZED",
  finalArchitectureStatus: "HOLD",
  estateFinalizationStatus: "HOLD",
  bridgeFinalizationStatus: "HOLD",

  viewRule: Object.freeze({
    cameraSide: "landward / eastern highland side",
    cameraFacing: "west-southwest",
    waterBehindManor: true,
    manorMidground: true,
    foreground: "dry elevated shelf terrain",
    background: "western waterline and horizon",
    lightAxis: "warm western light behind and across the Manor"
  }),

  groundRelationship: Object.freeze({
    foundationZone: "upper dry shelf terrace",
    lowerCoastalTransition: "behind and below the Manor",
    protectedWaterEdge: true,
    wetFoundationRiskAccepted: false,
    developAroundAndWithinAfterPlacement: true
  }),

  visualEnvelope: Object.freeze({
    massingOnly: true,
    useAlreadyDefinedManor: true,
    facadeRead: "large formal manor mass on elevated shelf",
    roofRead: "multi-wing manor roofline",
    centralAxis: true,
    vaultVisible: false,
    vaultPreservedBelowGround: true,
    acreageBoundaryVisible: "future estate boundary field only"
  })
});

export function getRichManorPlacementSpec() {
  return Object.freeze({
    version: H_EARTH_MANOR_SPEC_VERSION,
    contract: H_EARTH_MANOR_SPEC_CONTRACT,
    sourceAuthority: RICH_MANOR_SOURCE_AUTHORITY,
    knownCanon: RICH_MANOR_KNOWN_CANON,
    placement: WESTERN_GOLDEN_SHELF_MANOR_PLACEMENT,

    manorGroundPlacementAuthorized: true,
    finalManorArchitectureAuthorized: false,
    estateFinalizationAuthorized: false,
    bridgeFinalizationAuthorized: false,
    roadPlacementAuthorized: false,
    cityPlacementAuthorized: false,

    waterBehindManor: true,
    cameraFacing: "west-southwest",
    redefineManor: false
  });
}

export default getRichManorPlacementSpec;
