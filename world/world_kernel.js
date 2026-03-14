import { byteToStateVector, validateByte } from "../assets/four_pixel_codec.js";

const DATA_FILES = {
  regions: new URL("./data/regions.json", import.meta.url),
  paths: new URL("./data/paths.json", import.meta.url),
  hazards: new URL("./data/hazards.json", import.meta.url),
  waters: new URL("./data/waters.json", import.meta.url),
  diamondGrid: new URL("./data/diamond_grid.json", import.meta.url),
  stateEncodings: new URL("./data/state_encodings.json", import.meta.url),

  terrain: new URL("./data/terrain_polygons.json", import.meta.url),
  substrates: new URL("./data/substrate_polygons.json", import.meta.url),
  regionBoundaries: new URL("./data/region_boundaries.json", import.meta.url),
  coastlines: new URL("./data/coastlines.json", import.meta.url),
  coastalBlueprint: new URL("./data/coastal_blueprint.json", import.meta.url),
  harborNavigationGraph: new URL("./data/harbor_navigation_graph.json", import.meta.url),
  harborInstances: new URL("./data/harbor_instances.json", import.meta.url),
  maritimeNetwork: new URL("./data/maritime_network.json", import.meta.url)
};

async function read(url){
  const r = await fetch(url);
  if(!r.ok) throw new Error("Missing dataset: "+url);
  return r.json();
}

function mapIndex(rows,key){
  const m=new Map();
  if(!rows) return m;
  for(const r of rows){
    const id=r[key];
    if(id) m.set(id,Object.freeze({...r}));
  }
  return m;
}

function nearestCell(cells,x,y){
  let best=null;
  let bestD=Infinity;

  for(const c of cells.values()){
    const dx=c.centerPoint[0]-x;
    const dy=c.centerPoint[1]-y;
    const d=dx*dx+dy*dy;

    if(d<bestD){
      best=c;
      bestD=d;
    }
  }

  return best;
}

export async function loadWorldKernel(){

  const [
    regions,
    paths,
    hazards,
    waters,
    diamondGrid,
    encodings,

    terrain,
    substrates,
    regionBoundaries,
    coastlines,
    coastalBlueprint,
    harborNavigationGraph,
    harborInstances,
    maritimeNetwork
  ] = await Promise.all([
    read(DATA_FILES.regions),
    read(DATA_FILES.paths),
    read(DATA_FILES.hazards),
    read(DATA_FILES.waters),
    read(DATA_FILES.diamondGrid),
    read(DATA_FILES.stateEncodings),

    read(DATA_FILES.terrain),
    read(DATA_FILES.substrates),
    read(DATA_FILES.regionBoundaries),
    read(DATA_FILES.coastlines),
    read(DATA_FILES.coastalBlueprint),
    read(DATA_FILES.harborNavigationGraph),
    read(DATA_FILES.harborInstances),
    read(DATA_FILES.maritimeNetwork)
  ]);

  const regionsById = mapIndex(regions.regionRows,"regionId");
  const pathsById = mapIndex(paths?.pathRows,"pathId");
  const hazardsById = mapIndex(hazards?.hazardRows,"hazardId");
  const watersById = mapIndex(waters?.waterRows,"waterId");
  const encodingsById = mapIndex(encodings?.encodingRows,"encodingId");
  const diamondCellsById = mapIndex(diamondGrid?.diamondCells,"diamondCellId");

  const terrainPolygonsById = mapIndex(terrain?.terrain,"terrainId");
  const substratePolygonsById = mapIndex(substrates?.substrates,"substrateId");
  const regionBoundariesById = mapIndex(regionBoundaries?.regions,"regionId");

  const harborNodes = mapIndex(harborNavigationGraph?.navigationNodes,"navNodeId");
  const harborEdges = mapIndex(harborNavigationGraph?.navigationEdges,"edgeId");

  const seaNodes = mapIndex(maritimeNetwork?.seaNodes,"seaNodeId");
  const seaRoutes = mapIndex(maritimeNetwork?.seaRoutes,"seaRouteId");
  const seaHazards = mapIndex(maritimeNetwork?.seaHazards,"hazardId");

  const kernel={

    worldMeta:{
      worldId:regions.worldId,
      encodingFamilyVersion:regions.encodingFamilyVersion
    },

    regionsById,
    pathsById,
    hazardsById,
    watersById,
    encodingsById,
    diamondCellsById,

    terrainPolygonsById,
    substratePolygonsById,
    regionBoundariesById,

    coastlineModel:coastlines,

    coastalBlueprint,

    harborNavigationGraph:{
      navigationNodesById:harborNodes,
      navigationEdgesById:harborEdges
    },

    maritimeNetwork:{
      seaNodesById:seaNodes,
      seaRoutesById:seaRoutes,
      seaHazardsById:seaHazards
    },

    harborInstances:harborInstances.instances ?? [],

    helpers:null
  };

  kernel.helpers={

    getRegion(id){
      return regionsById.get(id) ?? null;
    },

    getEncoding(id){
      return encodingsById.get(id) ?? null;
    },

    projectWorldPositionToCell({x,y,previousCellId=null}){

      const cell=nearestCell(diamondCellsById,x,y);
      const enc=encodingsById.get(cell.stateEncodingId);

      return Object.freeze({
        regionId:cell.regionId,
        pathId:cell.pathId,
        cellId:cell.diamondCellId,
        bandIndex:cell.bandIndex,
        sector:cell.sector,
        stateByte:enc.byte,
        stateEncodingId:cell.stateEncodingId,
        previousCellId
      });

    },

    decodeStateByte(byte){
      validateByte(byte);
      return byteToStateVector(byte);
    }

  };

  Object.freeze(kernel.helpers);
  Object.freeze(kernel);

  return kernel;
}
