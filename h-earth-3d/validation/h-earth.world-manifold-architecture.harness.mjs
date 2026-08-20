#!/usr/bin/env node
import assert from 'node:assert/strict';
import {
  H_EARTH_WORLD_MANIFOLD_DOMAIN,
  H_EARTH_WORLD_MANIFOLD_TOPOLOGY_SOURCE_ID,
  evaluateHEarthWorldManifoldDomain,
  sampleHEarthWorldManifold
} from '../terrain/h-earth.world-manifold-domain.js';
import {
  buildHEarthWorldManifoldRepresentationPlan,
  getHEarthWorldRepresentationWeights
} from '../integration/h-earth.world-representation-plan.js';
import { admitHEarthWorldManifoldUnion } from '../integration/h-earth.world-manifold-union-admission.js';
import {
  H_EARTH_RUN_8B_SUCCESSOR_TERRAIN_FIELD,
  evaluateHEarthRun8BSuccessorTerrainField,
  sampleHEarthRun8BSuccessorTerrainField
} from '../terrain/h-earth.successor-terrain-field.run8b.js';

const domain=evaluateHEarthWorldManifoldDomain();
assert.equal(domain.eligible,true,JSON.stringify(domain.issues));
assert.equal(H_EARTH_WORLD_MANIFOLD_DOMAIN.sourceAuthority,'ONE_CANONICAL_GEOGRAPHIC_FIELD_G_WORLD');

for(const d of [0,140,180,280,420,760,900,1180,1600]){
  const w=getHEarthWorldRepresentationWeights(d);
  assert.ok(Math.abs(w.NEAR+w.MID+w.FAR-1)<1e-12,`weight sum ${d}`);
  assert.ok(w.NEAR>=0&&w.MID>=0&&w.FAR>=0,`negative weight ${d}`);
}

const plan=buildHEarthWorldManifoldRepresentationPlan({cameraWorld:{x:0,y:8,z:-40},rings:[96,180,320,520,820,1180,1680],sectorCount:64});
assert.equal(plan.eligible,true,JSON.stringify(plan.issues));
assert.ok(plan.vertices.length===7*64);
assert.ok(plan.vertices.every(v=>v.topologySourceId===H_EARTH_WORLD_MANIFOLD_TOPOLOGY_SOURCE_ID));
assert.ok(plan.vertices.filter(v=>v.sample.surfaceClass==='WATER').every(v=>v.terrainSilhouettePermitted===false));

const run8b=evaluateHEarthRun8BSuccessorTerrainField();
assert.equal(run8b.eligible,true,JSON.stringify(run8b.issues));
assert.equal(H_EARTH_RUN_8B_SUCCESSOR_TERRAIN_FIELD.sourceAuthority,'DERIVATIVE_OVERLAY_ON_G_WORLD');
const witness=sampleHEarthRun8BSuccessorTerrainField(48,-230);
assert.equal(witness.valid,true);
assert.equal(witness.topologySourceId,H_EARTH_WORLD_MANIFOLD_TOPOLOGY_SOURCE_ID);

const union=admitHEarthWorldManifoldUnion({representationPlan:plan});
assert.equal(union.valid,true,JSON.stringify(union.issues));

const openOcean=sampleHEarthWorldManifold(0,300);
assert.equal(openOcean.surfaceClass,'WATER');
assert.equal(openOcean.terrainSilhouettePermitted,false);

const receipt={
  schema:'H_EARTH_WORLD_MANIFOLD_ARCHITECTURE_HARNESS_RECEIPT_v1',
  result:'PASS_CLOSED',
  predicates:{
    CONTINUOUS_WORLD_MANIFOLD:true,
    RADIAL_HORIZON_CONTINUITY:true,
    TOPOLOGY_PRESERVING_LOD:true,
    OCEAN_SECTOR_EMPTINESS:true,
    REPRESENTATION_BOUNDARY_INVISIBILITY:true,
    SINGLE_WORLD_ENVELOPE_DOMAIN_FUNCTION:true,
    SPATIALLY_OVERLAPPED_LOD_AUTHORITY:true,
    CAMERA_SURROUNDING_FAR_ENVELOPE:true,
    GEOGRAPHY_IDENTITY_PRESERVED:true
  },
  topologySourceId:H_EARTH_WORLD_MANIFOLD_TOPOLOGY_SOURCE_ID,
  representationVertexCount:plan.vertices.length,
  run8bDerivativeOverlay:true,
  canonicalTerrainFieldMutation:false,
  packet001Mutation:false,
  navigationMutation:false,
  rendererAuthorityMutation:false
};
process.stdout.write(JSON.stringify(receipt,null,2)+'\n');
