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

The preferred global topology is a gnomonic cubed sphere.

Reason: a latitude/longitude grid produces pole convergence and strongly nonuniform cell size. NOAA/GFDL FV3 uses a gnomonic cubed-sphere grid for improved grid uniformity and finite-volume atmospheric dynamics. Audralia adopts the topology principle, not FV3's full operational complexity.

The global dynamic core is a conservative layered finite-volume atmospheric model on six cube faces. The benchmark matrix determines the final face resolution.

## Vertical core

The cloud-bearing physical domain is approximately 0-18 km above canonical surface elevation. The accepted optical atmosphere extends much higher and remains a separate presentation envelope.

Dynamic layers are benchmarked at 3 and 5 layers. A diagnostic thermodynamic column samples eight canonical heights:

`0, 1, 2, 4, 7, 10, 14, 18 km`.

The 3-layer case is the minimum viable global dynamics candidate; the 5-layer case is preferred if target devices remain inside the frozen budget.

## Prognostic atmospheric state

At minimum, each dynamic layer carries:

- layer mass/thickness;
- horizontal wind vector;
- potential-temperature/thermal state;
- water-vapor mixing ratio;
- cloud-liquid mixing ratio;
- cloud-ice mixing ratio.

Each column also carries surface pressure/mass and surface forcing.

Vertical motion is diagnosed from horizontal convergence/divergence, terrain lifting, convective transport, and layer exchange rather than stored as an unconstrained independent authority.

## Dynamics

The computational core is a `LAYERED_MOIST_ROTATING_SHALLOW_WATER_PLUS_COLUMN_PHYSICS` model.

For each layer k the required conservation structure is conceptually:

`d(h_k)/dt + div(h_k * u_k) = vertical_mass_exchange`

`d(h_k*u_k)/dt + div(momentum_flux) + pressure_gradient + coriolis = drag + mixing + vertical_exchange`

`d(theta_k)/dt + advection = radiative + surface + latent + mixing terms`

`d(qv_k)/dt + advection = evaporation - condensation + mixing`

`d(ql_k, qi_k)/dt + advection = phase_change - precipitation + mixing`

This is not a claim of full primitive-equation fidelity. It is the bounded dynamic layer that must generate persistent pressure/wind/moisture structures instead of scripted weather graphics.

## Rotation and forcing

The simulation exposes planet parameters rather than inventing hidden constants:

- rotation rate `Omega`;
- gravity/effective gravity `g`;
- solar direction/flux;
- surface albedo;
- land/ocean heat capacity;
- sea-surface or water-surface temperature;
- moisture availability;
- canonical terrain elevation and slope.

Coriolis forcing is latitude dependent from the planet rotation state.

No Audralia-specific rotation period or gravity value is frozen by this package unless already established by upstream canonical planet truth.

## Moist thermodynamics

The column physics must support:

- saturation diagnosis from temperature and pressure;
- condensation/deposition when vapor exceeds saturation;
- evaporation/sublimation when condensate becomes unsupported;
- latent heating/cooling feedback;
- liquid/ice phase partition by thermal state;
- precipitation removal and bounded re-evaporation;
- surface evaporation/moisture flux;
- convective transport under buoyant instability;
- stable-layer suppression/capping;
- orographic ascent from wind crossing canonical terrain;
- convergence/frontal ascent;
- dry-air intrusion and vertical shear.

## WMO cloud taxonomy

All ten WMO cloud genera are supported as diagnoses of connected cloud objects:

`Ci Cc Cs Ac As Ns Sc St Cu Cb`.

A connected cloud object receives one genus at a time, consistent with WMO classification. A vertical atmospheric column may contain multiple separated cloud objects/layers of different genera.

Cloud genus is diagnosed from base/top altitude, vertical extent, condensate phase, stability/convective support, vertical motion, precipitation, horizontal coverage/organization, and lifecycle origin. Genus is never randomly selected for art direction.

## Hurricane / tropical-cyclone architecture

Tropical cyclones are persistent mesoscale weather-system objects coupled to the global field. They are not visual vortices.

Their state must respond to:

- ocean heat/moisture support;
- low-level convergence/vorticity;
- deep moist convection;
- vertically organized circulation;
- upper-level outflow;
- vertical wind shear;
- dry-air intrusion;
- land interaction and surface-flux loss;
- bounded ocean-cooling/cold-wake response.

The project's QC-corrected raw TC-RADAR study is reused only as a storm-structure observer/validation suite. Its preregistered noncompensatory rapid-intensification predictor was not supported and is prohibited from becoming the hurricane engine.

## Rendering

One cloud density truth supplies two observation regimes:

1. Orbital/continental: low-cost column-integrated optical depth/cloud cover derived from canonical density.
2. Regional/local: bounded local volumetric integration only where view rays intersect supported cloud volume.

The local regime must use empty-space skipping, a reduced-resolution volume pass initially, bounded/adaptive ray steps, bounded light sampling, and no whole-planet ray march.

Cloud opacity is derived from density/condensate path and Beer-Lambert-style extinction, not directly from arbitrary procedural alpha.

## Performance

`SIMULATION_TICK_RATE != RENDER_FRAME_RATE`.

Weather can evolve at a lower fixed cadence while rendering interpolates canonical states.

Final resolution, layer count, tick cadence, volumetric resolution, ray-step ceiling, memory ceiling, and allowed frame-time impact are not guessed here. They are selected from `benchmark-matrix.v1.json` after measured execution on the actual target phone and tablet.

No configuration may reintroduce gesture hesitation.

## Package files

- `simulation-contract.v1.json` — dynamic/state contract.
- `cloud-diagnostic-contract.v1.json` — cloud genera and lifecycle diagnosis.
- `hurricane-observer-adapter.v1.json` — bounded reuse of canonical hurricane research.
- `rendering-contract.v1.json` — orbital/local cloud observation law.
- `benchmark-matrix.v1.json` — device-measured candidate configurations and gates.
- `construction-gates.v1.json` — authorization state.
- `source-ledger.v1.json` — evidence provenance.

## Construction stop

No successor cloud/weather product candidate is authorized until all architecture gates A-G pass and device gate H has measured at least one viable configuration.
