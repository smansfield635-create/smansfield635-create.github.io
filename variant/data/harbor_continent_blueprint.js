export const HARBOR_CONTINENT_BLUEPRINT = {
  id: "harbor_continent",
  name: "Harbor Continent",
  scaleBasis: {
    continentMaxWidthUnits: 1000,
    continentMaxHeightUnits: 520,
    largestContinentOfSeven: true
  },
  globalShape: {
    silhouette: "wide_flattened_crescent_arc",
    mainlandSizeUnits: { width: 1000, height: 520 },
    reliefClass: "foothill_only",
    elevationBands: {
      shoreline: [0, 8],
      innerFoothills: [8, 28],
      highFoothillCrests: [28, 42]
    }
  },
  shorelineRule: {
    standardBeachWidth: 36,
    expandedBeachWidth: 54,
    narrowCoveBeachWidth: 63,
    harborFacingBeachesAreWidest: true,
    targets: {
      gratitudeSouthSoutheast: 54,
      generositySouthSouthwest: 54,
      pinchPointsAndCoves: 63
    }
  },
  mainlandRegions: {
    gratitude: {
      footprint: { width: 440, height: 300 },
      center: { x: 270, y: 300 },
      terrain: "soft_foothills_broad_beaches_inland_green"
    },
    generosity: {
      footprint: { width: 430, height: 280 },
      center: { x: 710, y: 215 },
      terrain: "soft_foothills_wide_coastal_shelf_resort_capable"
    },
    transitionBand: {
      width: 110,
      type: "low_ridge_valley_blend",
      hardBorder: false
    }
  },
  harborPlacement: {
    mainlandToNearestHarborIslandGap: {
      minimum: 150,
      target: 180
    },
    clusterEnvelope: { width: 420, height: 250 },
    clusterCenter: { x: 790, y: 365 }
  },
  harborIdentity: {
    class: "offshore_resort_cluster",
    elevation: {
      beachAndResortEdge: [0, 4],
      islandInteriorRise: [4, 10]
    }
  },
  islands: {
    mainResortIsland: {
      size: { width: 210, height: 120 },
      center: { x: 770, y: 360 }
    },
    secondaryLeisureIsland: {
      size: { width: 92, height: 58 },
      center: { x: 905, y: 330 }
    },
    tertiaryLeisureIsland: {
      size: { width: 78, height: 46 },
      center: { x: 940, y: 405 }
    },
    outerCay: {
      size: { width: 62, height: 34 },
      center: { x: 980, y: 455 }
    }
  },
  resortFootprint: {
    core: {
      size: { width: 82, height: 44 },
      offset: { x: -8, y: -8 }
    },
    marinaBungalowDistrict: {
      size: { width: 120, height: 52 },
      shoreline: "southeast"
    },
    lighthouse: {
      size: { width: 12, height: 12 },
      side: "west_or_northwest"
    },
    palmBandInset: [18, 30]
  },
  harborBeachRule: {
    mainIslandBeachRing: [42, 68],
    secondaryAndTertiaryIslands: [26, 44],
    lagoonEdgeBeaches: [34, 56],
    landUseRatio: {
      beachSand: 0.38,
      greeneryResortInterior: 0.47,
      structuresPathsMarina: 0.15
    }
  },
  waterGeometry: {
    lagoonWidth: [150, 220],
    waterBands: {
      beachShallows: [0, 8],
      lagoonShelf: [8, 20],
      outerChannel: [20, 40],
      openOcean: [40, 999]
    }
  },
  access: {
    luminousTravelArcs: [
      { from: "gratitude", to: "harbor_node" },
      { from: "generosity", to: "harbor_node" }
    ],
    optionalSecondaryArc: {
      from: "gratitude",
      to: "generosity",
      mode: "inland_or_coastal"
    }
  }
};
