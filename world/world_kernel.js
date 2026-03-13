import { byteToStateVector, validateByte } from "../assets/four_pixel_codec.js";
import { terrainSubstrateRebuildTool } from "./terrain_substrate_rebuild_tool.js";
import { validateLoadedWorldKernel } from "./kernel_boot_validator.js";

const DEV_VALIDATE_ON_BOOT = false;

const DATA_FILES = {
  regions: new URL("./data/regions.json", import.meta.url),
  graphs: new URL("./data/graphs.json", import.meta.url),
  paths: new URL("./data/paths.json", import.meta.url),
  hazards: new URL("./data/hazards.json", import.meta.url),
  waters: new URL("./data/waters.json", import.meta.url),
  environment: new URL("./data/environment.json", import.meta.url),
  diamondGrid: new URL("./data/diamond_grid.json", import.meta.url),
  stateEncodings: new URL("./data/state_encodings.json", import.meta.url),
  latticeMap: new URL("./data/lattice_encoding_map.json", import.meta.url),
  coastlines: new URL("./data/coastlines.json", import.meta.url),
  coastalBlueprint: new URL("./data/coastal_blueprint.json", import.meta.url),
  regionBoundaries: new URL("./data/region_boundaries.json", import.meta.url),
  terrainPolygons: new URL("./data/terrain_polygons.json", import.meta.url),
  substratePolygons: new URL("./data/substrate_polygons.json", import.meta.url),
  harborNavigationGraph: new URL("./data/harbor_navigation_graph.json", import.meta.url),
  harborInstances: new URL("./data/harbor_instances.json", import.meta.url),
  maritimeNetwork: new URL("./data/maritime_network.json", import.meta.url),
  terrainTemplates: new URL("./templates/terrain_templates.json", import.meta.url),
  substrateTemplates: new URL("./templates/substrate_templates.json", import.meta.url),
  regionTemplates: new URL("./templates/region_templates.json", import.meta.url)
};

function shallowFreeze(v){
  if(v && typeof v==="object" && !Object.isFrozen(v)){
    Object.freeze(v);
  }
  return v;
}

async function readJsonSafe(url,label){

  try{

    const r=await fetch(url);

    if(!r.ok){
      console.warn("Kernel data missing:",label);
      return null;
    }

    return await r.json();

  }catch(e){

    console.warn("Kernel load failed:",label,e);
    return null;

  }

}

function indexBy(rows,key){

  if(!rows) return new Map();

  const map=new Map();

  for(const row of rows){

    const id=row?.[key];

    if(typeof id!=="string" || id.length===0){
      continue;
    }

    map.set(id,shallowFreeze({...row}));

  }

  return shallowFreeze(map);

}

function nearestCell(cells,x,y){

  let best=null;
  let bestD=Infinity;

  for(const c of cells.values()){

    const dx=c.centerPoint[0]-x;
    const dy=c.centerPoint[1]-y;
    const d=dx*dx+dy*dy;

    if(d<bestD){
      bestD=d;
      best=c;
    }

  }

  return best;

}

export async function loadWorldKernel(){

  const [
    regions,
    graphs,
    paths,
    hazards,
    waters,
    environment,
    diamondGrid,
    stateEncodings
  ] = await Promise.all([
    readJsonSafe(DATA_FILES.regions,"regions"),
    readJsonSafe(DATA_FILES.graphs,"graphs"),
    readJsonSafe(DATA_FILES.paths,"paths"),
    readJsonSafe(DATA_FILES.hazards,"hazards"),
    readJsonSafe(DATA_FILES.waters,"waters"),
    readJsonSafe(DATA_FILES.environment,"environment"),
    readJsonSafe(DATA_FILES.diamondGrid,"diamondGrid"),
    readJsonSafe(DATA_FILES.stateEncodings,"stateEncodings")
  ]);

  if(!regions) throw new Error("Critical kernel file missing: regions");

  const regionsById=indexBy(regions.regionRows,"regionId");
  const pathsById=indexBy(paths?.pathRows,"pathId");
  const hazardsById=indexBy(hazards?.hazardRows,"hazardId");
  const watersById=indexBy(waters?.waterRows,"waterId");
  const encodingsById=indexBy(stateEncodings?.encodingRows,"encodingId");
  const diamondCellsById=indexBy(diamondGrid?.diamondCells,"diamondCellId");

  const kernel={

    worldMeta:shallowFreeze({
      worldId:regions.worldId,
      encodingFamilyVersion:regions.encodingFamilyVersion
    }),

    regionsById,
    pathsById,
    hazardsById,
    watersById,
    encodingsById,
    diamondCellsById,

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

      return shallowFreeze({

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

    },

    assertValidWorld(){
      return validateLoadedWorldKernel(kernel);
    }

  };

  shallowFreeze(kernel.helpers);
  shallowFreeze(kernel);

  if(DEV_VALIDATE_ON_BOOT){
    kernel.helpers.assertValidWorld();
  }

  return kernel;

}
