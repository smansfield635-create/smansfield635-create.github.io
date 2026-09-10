# H-Earth OW01 Weather Simulation v1

Status: `NONPRODUCT_COMPUTABLE_ARCHITECTURE_CANDIDATE`

Product construction authority: `FALSE`

Governing governance parent: `c50d0a06a73ed149286508a15e697d8efa254865`

Protected visual parent: `8381f3323261b4facf70ec1f236c015b7d5df5a9`

Failed cloud lineage: PR #745 / `e17e28ae54f0b92573baf938d0fe2c5f04404d1a` — research evidence only, never a construction parent.

## Governing law

`WEATHER IS SIMULATED; CLOUDS ARE CONSEQUENCES; RENDERING IS OBSERVATION.`

One canonical atmospheric state evolves in planetary coordinates. Weather systems and cloud objects are derived from that state. Orbital and local renderers may use different numerical observation methods only when both resolve the same canonical weather/cloud identity.

Camera motion may never create, destroy, relocate, rotate, or reclassify canonical weather.

## Scientific/engineering boundary

This package does not claim to be a forecasting-grade numerical weather prediction system. It defines a physically constrained simulation suitable for a persistent interactive planet under phone/tablet budgets.

The model must preserve the causal ordering:

`planet/surface forcing -> dynamics/thermodynamics -> moisture/condensation -> weather systems -> cloud state -> rendering`.

Procedural noise may add bounded sub-grid visual structure after physical cloud support exists. Noise may not create weather.

## Horizontal core

The global topology is a gnomonic cubed sphere. This avoids latitude/longitude pole convergence and follows the same broad grid principle used by NOAA/GFDL FV3 while deliberately avoiding operational-NWP complexity.

Benchmark face resolutions are C16, C24, C32, and a C48 ceiling candidate.

## Vertical core

The cloud-bearing physical domain is approximately 0-18 km above canonical surface elevation. The accepted optical atmosphere extends much higher and remains a separate presentation envelope.

Dynamic layers are benchmarked at 3 and 5 layers. A diagnostic thermodynamic column samples eight canonical heights:

`0, 1, 2, 4, 7, 10, 14, 18 km`.

## Dynamic core

`LAYERED_MOIST_ROTATING_SHALLOW_WATER_PLUS_COLUMN_PHYSICS`

Each dynamic layer carries mass/thickness, horizontal momentum, thermal state, vapor, liquid condensate, and ice condensate. Surface and planet forcing are external canonical inputs. Vertical motion is diagnosed from convergence, orographic lift, convection, frontal support, and bounded layer exchange.

## WMO cloud taxonomy

All ten genera are supported as diagnostic outcomes of atmospheric state:

`Ci Cc Cs Ac As Ns Sc St Cu Cb`.

A connected cloud object receives one genus at a time. A column may contain multiple separated cloud objects/layers.

Cloud genus is never randomly selected for art direction.

## Hurricane / tropical cyclone architecture

Tropical cyclones are persistent mesoscale weather-system objects coupled to the global field. They are not visual vortices.

The QC-corrected raw TC-RADAR study from PR #735 is reused only as a storm-structure observer and regression suite. Its noncompensatory rapid-intensification hypothesis was not supported and is prohibited from becoming the storm engine.

## Rendering

One cloud density truth supplies two observation regimes:

1. orbital/continental column-integrated optical depth;
2. regional/local bounded volumetric integration of the same cloud state.

No spherical alpha shell is canonical cloud truth. No whole-planet local ray march is authorized.

## Performance

`SIMULATION_TICK_RATE != RENDER_FRAME_RATE`.

Final resolution, layer count, tick cadence, mesoscale patch size, cloud volume resolution, ray-step ceiling, memory ceiling, and allowed frame-time impact are selected only after measured execution on the actual target phone and tablet.

No configuration may reintroduce gesture hesitation.

## Package

- `simulation-contract.v1.json`
- `cloud-diagnostic-contract.v1.json`
- `hurricane-observer-adapter.v1.json`
- `rendering-contract.v1.json`
- `benchmark-matrix.v1.json`
- `construction-gates.v1.json`
- `source-ledger.v1.json`

## Construction stop

No successor cloud/weather product candidate is authorized until Gates A-G are frozen and Gate H has measured at least one viable phone/tablet configuration.
