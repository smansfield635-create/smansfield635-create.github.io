import { H_EARTH_RUN_8A_WORLD_DOMAIN_RECONCILIATION, H_EARTH_RUN_8A_MOUNTAIN_DIMENSIONAL_SURFACE_CONTRACT } from '../control-plane/run-8/h-earth.run8a.dimensional-reconciliation.js';
import { sampleHEarthTerrainElevation } from '../terrain/h-earth.terrain-field.js';

const DOMAIN = H_EARTH_RUN_8A_WORLD_DOMAIN_RECONCILIATION.successorWorldDomain;
const FORMER_BOUNDARY_Z = -256;
const EPSILON = 0.01;
const clamp = (value, minimum, maximum) => Math.min(maximum, Math.max(minimum, value));

function push(steps, name, value, expression) {
  steps.push({ index: steps.length, name, value, expression });
  return value;
}

export function traceCP3D1BMountainVertex72Y(x, z, runtime = 'UNKNOWN') {
  const steps = [];
  const b = H_EARTH_RUN_8A_MOUNTAIN_DIMENSIONAL_SURFACE_CONTRACT.transitionBounds;

  const boundaryHeight = push(steps, 'boundaryHeight', sampleHEarthTerrainElevation(x, FORMER_BOUNDARY_Z), 'sampleHEarthTerrainElevation(x,-256)');
  const boundaryPlus = push(steps, 'boundaryPlus', sampleHEarthTerrainElevation(x, FORMER_BOUNDARY_Z + EPSILON), 'sampleHEarthTerrainElevation(x,-255.99)');
  const derivativeNumerator = push(steps, 'derivativeNumerator', boundaryPlus - boundaryHeight, 'boundaryPlus-boundaryHeight');
  const boundaryDerivative = push(steps, 'boundaryDerivative', derivativeNumerator / EPSILON, 'derivativeNumerator/0.01');
  const zDelta = push(steps, 'zDelta', z - FORMER_BOUNDARY_Z, 'z-(-256)');
  const tangentProduct = push(steps, 'tangentProduct', boundaryDerivative * zDelta, 'boundaryDerivative*zDelta');
  const tangent = push(steps, 'tangent', boundaryHeight + tangentProduct, 'boundaryHeight+tangentProduct');
  const progressNumerator = push(steps, 'progressNumerator', FORMER_BOUNDARY_Z - z, '-256-z');
  const progressDenominator = push(steps, 'progressDenominator', FORMER_BOUNDARY_Z - DOMAIN.zMinimum, '-256-domain.zMinimum');
  const progress = push(steps, 'progress', progressNumerator / progressDenominator, 'progressNumerator/progressDenominator');
  const progressT = push(steps, 'progressT', clamp(progress, 0, 1), 'clamp(progress,0,1)');
  const smootherInner1 = push(steps, 'smootherInner1', progressT * 6 - 15, 'progressT*6-15');
  const smootherInner2 = push(steps, 'smootherInner2', progressT * smootherInner1 + 10, 'progressT*smootherInner1+10');
  const progressCube = push(steps, 'progressCube', progressT * progressT * progressT, 'progressT*progressT*progressT');
  const blend = push(steps, 'blend', progressCube * smootherInner2, 'progressCube*smootherInner2');
  const rearSin1Arg = push(steps, 'rearSin1Arg', (x + 40) / 76, '(x+40)/76');
  const rearSin1 = push(steps, 'rearSin1', Math.sin(rearSin1Arg), 'Math.sin(rearSin1Arg)');
  const rearSin2Arg = push(steps, 'rearSin2Arg', (x - 18) / 31, '(x-18)/31');
  const rearSin2 = push(steps, 'rearSin2', Math.sin(rearSin2Arg), 'Math.sin(rearSin2Arg)');
  const rearTerm1 = push(steps, 'rearTerm1', 3.5 * rearSin1, '3.5*rearSin1');
  const rearTerm2 = push(steps, 'rearTerm2', 1.5 * rearSin2, '1.5*rearSin2');
  const rearLevelPartial = push(steps, 'rearLevelPartial', 16 + rearTerm1, '16+rearTerm1');
  const rearLevel = push(steps, 'rearLevel', rearLevelPartial + rearTerm2, 'rearLevelPartial+rearTerm2');
  const tangentWeight = push(steps, 'tangentWeight', 1 - blend, '1-blend');
  const baseTangentPart = push(steps, 'baseTangentPart', tangent * tangentWeight, 'tangent*tangentWeight');
  const baseRearPart = push(steps, 'baseRearPart', rearLevel * blend, 'rearLevel*blend');
  const baseElevation = push(steps, 'baseElevation', baseTangentPart + baseRearPart, 'baseTangentPart+baseRearPart');

  const smooth = (name, edge0, edge1, value) => {
    const tRaw = push(steps, `${name}Raw`, (value - edge0) / (edge1 - edge0), `(value-${edge0})/(${edge1}-${edge0})`);
    const t = push(steps, `${name}T`, clamp(tRaw, 0, 1), `clamp(${name}Raw,0,1)`);
    const inner = push(steps, `${name}Inner`, 3 - 2 * t, `3-2*${name}T`);
    return push(steps, name, t * t * inner, `${name}T*${name}T*${name}Inner`);
  };
  const gaussian = (name, value, center, radius) => {
    const d = push(steps, `${name}D`, (value - center) / radius, `(value-${center})/${radius}`);
    const square = push(steps, `${name}Square`, d * d, `${name}D*${name}D`);
    const negativeSquare = push(steps, `${name}NegativeSquare`, -square, `-${name}Square`);
    return push(steps, name, Math.exp(negativeSquare), `Math.exp(${name}NegativeSquare)`);
  };

  const xLower = smooth('xLower', b.xMinimum, b.xMinimum + 24, x);
  const xUpperSmooth = smooth('xUpperSmooth', b.xMaximum - 24, b.xMaximum, x);
  const xUpper = push(steps, 'xUpper', 1 - xUpperSmooth, '1-xUpperSmooth');
  const xEnvelope = push(steps, 'xEnvelope', xLower * xUpper, 'xLower*xUpper');
  const zLower = smooth('zLower', b.zMinimum, b.zMinimum + 20, z);
  const zUpperSmooth = smooth('zUpperSmooth', b.zMaximum - 20, b.zMaximum, z);
  const zUpper = push(steps, 'zUpper', 1 - zUpperSmooth, '1-zUpperSmooth');
  const zEnvelope = push(steps, 'zEnvelope', zLower * zUpper, 'zLower*zUpper');
  const ridgeArg1 = push(steps, 'ridgeArg1', (x + 104) / 54, '(x+104)/54');
  const ridgeSin1 = push(steps, 'ridgeSin1', Math.sin(ridgeArg1), 'Math.sin(ridgeArg1)');
  const ridgeArg2 = push(steps, 'ridgeArg2', (x - 12) / 21, '(x-12)/21');
  const ridgeSin2 = push(steps, 'ridgeSin2', Math.sin(ridgeArg2), 'Math.sin(ridgeArg2)');
  const ridgePart1 = push(steps, 'ridgePart1', 7 * ridgeSin1, '7*ridgeSin1');
  const ridgePart2 = push(steps, 'ridgePart2', 3 * ridgeSin2, '3*ridgeSin2');
  const ridgePartial = push(steps, 'ridgePartial', -266 + ridgePart1, '-266+ridgePart1');
  const ridgeZ = push(steps, 'ridgeZ', ridgePartial + ridgePart2, 'ridgePartial+ridgePart2');
  const primaryGaussian = gaussian('primaryGaussian', z, ridgeZ, 22);
  const primaryScale = push(steps, 'primaryScale', 62 * xEnvelope, '62*xEnvelope');
  const primary = push(steps, 'primary', primaryScale * primaryGaussian, 'primaryScale*primaryGaussian');
  const summitX = gaussian('summitX', x, -92, 38);
  const summitZ = gaussian('summitZ', z, -271, 17);
  const summitScale = push(steps, 'summitScale', 27 * summitX, '27*summitX');
  const summit = push(steps, 'summit', summitScale * summitZ, 'summitScale*summitZ');
  const secondaryX = gaussian('secondaryX', x, -6, 52);
  const secondaryZ = gaussian('secondaryZ', z, -250, 20);
  const secondaryScale = push(steps, 'secondaryScale', 24 * secondaryX, '24*secondaryX');
  const secondary = push(steps, 'secondary', secondaryScale * secondaryZ, 'secondaryScale*secondaryZ');
  const foothillScale = push(steps, 'foothillScale', 13 * xEnvelope, '13*xEnvelope');
  const foothill = push(steps, 'foothill', foothillScale * zEnvelope, 'foothillScale*zEnvelope');
  const valleyX = gaussian('valleyX', x, -48, 26);
  const valleyZ = gaussian('valleyZ', z, -256, 13);
  const valleyScale = push(steps, 'valleyScale', 15 * valleyX, '15*valleyX');
  const valleyCut = push(steps, 'valleyCut', valleyScale * valleyZ, 'valleyScale*valleyZ');
  const mountainSum1 = push(steps, 'mountainSum1', primary + summit, 'primary+summit');
  const mountainSum2 = push(steps, 'mountainSum2', mountainSum1 + secondary, 'mountainSum1+secondary');
  const mountainSum3 = push(steps, 'mountainSum3', mountainSum2 + foothill, 'mountainSum2+foothill');
  const mountainRaw = push(steps, 'mountainRaw', mountainSum3 - valleyCut, 'mountainSum3-valleyCut');
  const mountainClamped = push(steps, 'mountainClamped', Math.max(0, mountainRaw), 'Math.max(0,mountainRaw)');
  const mountainContribution = push(steps, 'mountainContribution', zEnvelope * mountainClamped, 'zEnvelope*mountainClamped');
  const elevation = push(steps, 'elevation', baseElevation + mountainContribution, 'baseElevation+mountainContribution');

  return Object.freeze({ runtime, x, z, elevation, steps });
}
