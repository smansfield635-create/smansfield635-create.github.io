import {
  AUDRALIA_GRATITUDE_GEOGRAPHIC_TRANSFER_CONTRACT_ID,
  sampleAudraliaGratitudeTerrain
} from '../h-earth-3d/integration/audralia.gratitude-geographic-transfer.v1.js';

export const VEGETATION_ECOLOGY_AUTHORITY=Object.freeze({
  schema:'MIRRORLAND_CANONICAL_VEGETATION_ECOLOGY_AUTHORITY_v1',
  sourceModule:'h-earth-3d/integration/audralia.gratitude-geographic-transfer.v1.js',
  sourceExport:'sampleAudraliaGratitudeTerrain',
  sourceContractId:AUDRALIA_GRATITUDE_GEOGRAPHIC_TRANSFER_CONTRACT_ID,
  readOnly:true,
  geographyDeterminesExistence:true,
  rendererDeterminesRepresentation:true,
  duplicateEcologyEquations:false
});

export function sampleCanonicalVegetationEcology(worldX,worldZ){
  const source=sampleAudraliaGratitudeTerrain(worldX,worldZ);
  if(source?.valid!==true){
    return Object.freeze({
      schema:'MIRRORLAND_CANONICAL_VEGETATION_ECOLOGY_SAMPLE_v1',
      valid:false,
      status:'MIRRORLAND_CANONICAL_VEGETATION_ECOLOGY_SOURCE_INVALID',
      worldX,
      worldZ,
      sourceStatus:source?.status??null,
      sourceContractId:AUDRALIA_GRATITUDE_GEOGRAPHIC_TRANSFER_CONTRACT_ID
    });
  }

  return Object.freeze({
    schema:'MIRRORLAND_CANONICAL_VEGETATION_ECOLOGY_SAMPLE_v1',
    valid:true,
    status:'MIRRORLAND_CANONICAL_VEGETATION_ECOLOGY_SAMPLE_COMPLETE',
    sourceContractId:AUDRALIA_GRATITUDE_GEOGRAPHIC_TRANSFER_CONTRACT_ID,
    geographyAuthority:source.geographyAuthority,
    worldX:source.worldX,
    worldZ:source.worldZ,
    world:source.world,
    elevation:source.elevation,
    normal:source.normal,
    slope:source.slope,
    slopeClass:source.slopeClass,
    curvature:source.curvature,
    curvatureClass:source.curvatureClass,
    materialProfile:source.materialProfile,
    shorelineZ:source.shorelineZ,
    shorelineDistance:source.shorelineDistance,
    coastline:source.coastline,
    hydrology:source.hydrology,
    biome:source.biome
  });
}
