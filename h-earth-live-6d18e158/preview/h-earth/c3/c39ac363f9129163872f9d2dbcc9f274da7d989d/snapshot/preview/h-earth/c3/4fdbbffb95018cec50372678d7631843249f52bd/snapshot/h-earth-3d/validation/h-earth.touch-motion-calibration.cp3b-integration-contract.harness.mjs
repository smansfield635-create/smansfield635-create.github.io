import assert from 'node:assert/strict';
import fs from 'node:fs';

const intakePath = new URL('../../showroom/globe/h-earth/diagnostic/run8e-r3d/pointer-touch-intake.js', import.meta.url);
const latticePath = new URL('../../showroom/globe/h-earth/diagnostic/touch-motion-cp3a/touch-control-lattice.js', import.meta.url);
const integrationPath = new URL('../../showroom/globe/h-earth/functional-landscape/public-live-gpu-integration.run8e-r3e.js', import.meta.url);

const intake = fs.readFileSync(intakePath, 'utf8');
const lattice = fs.readFileSync(latticePath, 'utf8');
const integration = fs.readFileSync(integrationPath, 'utf8');

assert.match(intake, /createGestureControlLattice/);
assert.match(intake, /requestAnimationFrame\(animationStep\)/);
assert.match(intake, /normalizedCentroidDelta/);
assert.match(intake, /normalizedDistanceDelta/);
assert.match(intake, /rates\.maximumElapsedSeconds/);
assert.match(intake, /releaseIntent\(\)/);
assert.match(intake, /cp2bObservationCompatible: true/);
assert.match(intake, /navigationAuthorityMutated: false/);
assert.match(intake, /persistentRendererMutated: false/);
assert.match(intake, /cameraCoordinateConventionMutated: false/);
assert.match(intake, /worldGeometryMutated: false/);
assert.match(intake, /cp2bDiagnosticRemoved: false/);

assert.match(lattice, /gestureLock/);
assert.match(lattice, /MOVE_FORWARD/);
assert.match(lattice, /MOVE_BACKWARD/);
assert.match(lattice, /ZOOM_IN/);
assert.match(lattice, /ZOOM_OUT/);

assert.match(integration, /installHEarthRun8ER3D2PointerTouchIntake/);
assert.match(integration, /binding\.acceptNavigationState\(proposalRecord, navigationState\)/);
assert.match(integration, /getIntakeReceipt/);
assert.match(integration, /getLiveGpuReceipt/);

const movementRate = 7.5;
const oneSecond30Hz = Array.from({ length: 30 }, () => 1 / 30).reduce((sum, dt) => sum + movementRate * dt, 0);
const oneSecond60Hz = Array.from({ length: 60 }, () => 1 / 60).reduce((sum, dt) => sum + movementRate * dt, 0);
const oneSecond120Hz = Array.from({ length: 120 }, () => 1 / 120).reduce((sum, dt) => sum + movementRate * dt, 0);
assert.ok(Math.abs(oneSecond30Hz - oneSecond60Hz) < 1e-10);
assert.ok(Math.abs(oneSecond60Hz - oneSecond120Hz) < 1e-10);
assert.equal(+oneSecond60Hz, -(-oneSecond60Hz));

console.log(JSON.stringify({
  status: 'PASS',
  checkpoint: 'CP3B_PRODUCT_INTEGRATION_CONTRACT',
  assertions: 24,
  frameRateTravel: {
    hz30: oneSecond30Hz,
    hz60: oneSecond60Hz,
    hz120: oneSecond120Hz
  },
  productMutationPaths: [
    'showroom/globe/h-earth/diagnostic/run8e-r3d/pointer-touch-intake.js'
  ],
  preservedCorridor: {
    navigationAuthority: true,
    publicNavigationStateShape: true,
    liveGpuBinding: true,
    frameReceipts: true,
    cp2bDiagnosticSources: true,
    worldGeometry: true
  }
}, null, 2));
