/** Gen2969 archived GLSL scalar source parity at all 18 genuine NEAR/FAR overlaps.
 * Does not qualify final color, P(c,f0)/D(c,f0), global flux, GPU or publication. */
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createHash} from 'node:crypto';
import {sample,source,block} from '../../../../broad-groundcover-v1/sample-shader.mjs';
const blob=b=>createHash('sha1').update('blob '+Buffer.byteLength(b)+'\0').update(b).digest('hex');
assert.equal(blob(source),'2ae6c42f6febaada2cb2a240844b9fddc5b9ed8e','ORIGINAL_SHADER_BLOB_DRIFT');
const adapter=fs.readFileSync(new URL('../../../../broad-groundcover-v1/sample-shader.mjs',import.meta.url));
assert.equal(blob(adapter),'d17e1909a00565f111afe9b48269859bbcc2a652','GLSL_SCALAR_ADAPTER_DRIFT');
assert.match(block,/float groundcoverWeight=0\.88\*groundcoverPatch\*/);
assert.match(block,/palette=mix\(palette,groundcoverTone,groundcoverWeight\)/);
// Original artifact 12913811096: [near idx offset, far idx offset,
// overlap X,Z, interpolated normal-derived near/far slope,
// maximum raw baseColorsLinear channel delta, source-scalar expected weight].
// The full-precision uploaded buffers were checked separately by Python on the
// exact artifact SHA e1eb8a2fdbaacce663783440e2189b17e487eacb6c13fd50907d07cdb640bc4a.
const pairs=[
[90,74709,-257.655712304,-736.029442898,.000312563,.000312562,.087668051,.493184789],
[90,74712,-259.774009909,-736.029410576,.000334063,.000334063,.087119606,.488217758],
[90,73827,-257.655624120,-736.029442899,.000312562,.000312563,.087668061,.493184685],
[90,73836,-257.107163506,-736.029451268,.000307636,.000307638,.087739922,.491925637],
[96,73842,-249.400304794,-736.029513600,.000300843,.000300835,.087985453,.283100208],
[96,73839,-249.621836387,-736.029504349,.000300766,.000300764,.087944051,.295676930],
[96,73830,-249.848452796,-736.029511320,.000300687,.000300688,.087901731,.308307079],
[96,73872,-248.936769791,-736.029517136,.000301005,.000300998,.088090296,.256396346],
[96,73833,-251.902412727,-736.029495650,.000299976,.000299978,.087895700,.403484361],
[138,73878,-194.371432421,-736.027417782,.003080628,.003080621,.087210876,0],
[138,73875,-195.978626273,-736.027628263,.002960144,.002960139,.087587832,0],
[138,73905,-193.583297904,-736.027309556,.003140671,.003140666,.087114242,0],
[138,73848,-197.218271337,-736.027800480,.002869010,.002868985,.087878620,0],
[138,73851,-198.148137997,-736.027928168,.002801677,.002801657,.088187047,0],
[174,73908,-146.404358233,-736.024418139,.000338814,.000338814,.075504034,.66],
[174,73884,-146.404369847,-736.024418139,.000338814,.000338814,.075504040,.66],
[174,73917,-145.604502277,-736.024436446,.000340232,.000340232,.075050512,.66],
[174,73887,-148.271256852,-736.024375410,.000335555,.000335555,.076556628,.66]
];
assert.equal(pairs.length,18,'RAW_POSITIVE_OVERLAP_CENSUS');
assert.equal(new Set(pairs.map(p=>p[0])).size,4,'NEAR_SOURCE_FACE_CENSUS');
assert.equal(new Set(pairs.map(p=>p[1])).size,18,'FAR_SOURCE_FACE_CENSUS');
let maximumWeightDelta=0,maximumBaseColorDelta=0,minWeight=1,maxWeight=0;
for(const [near,far,x,z,slopeNear,slopeFar,rgbDelta,expected] of pairs){
  // Actual archived coast-distance attribute is 620 on both land surfaces;
  // computed rockExposure is below the .18 suitability cutoff here.
  // Moisture/dry target operands do NOT participate in groundcoverWeight.
  const n=sample({x,z,vCoastDistanceMeters:620,slope:slopeNear,rockExposure:0});
  const f=sample({x,z,vCoastDistanceMeters:620,slope:slopeFar,rockExposure:0});
  assert.ok(Math.abs(n.weight-expected)<2e-6,'SCALAR_VALUE_DRIFT:'+near+':'+far);
  assert.ok(Math.abs(n.weight-f.weight)<1e-10,'SOURCE_WEIGHT_DISCONTINUITY:'+near+':'+far);
  maximumWeightDelta=Math.max(maximumWeightDelta,Math.abs(n.weight-f.weight));
  maximumBaseColorDelta=Math.max(maximumBaseColorDelta,rgbDelta);
  minWeight=Math.min(minWeight,n.weight,f.weight);
  maxWeight=Math.max(maxWeight,n.weight,f.weight);
}
assert.equal(sample({x:-139.40268,z:-210.74617,rockExposure:0}).weight,0,'PROTECTED_GROVE_REGRESSION');
assert.equal(sample({vCoastDistanceMeters:0,rockExposure:0}).weight,0,'SOURCE_SHORE_REGRESSION');
assert.equal(sample({slope:.6,rockExposure:0}).weight,0,'SOURCE_STEEP_FACE_REGRESSION');
assert.ok(maximumBaseColorDelta>.08,'ORIGINAL_DIFFERING_BASE_COLORS_LOST');
assert.equal(minWeight,0);
assert.ok(maxWeight>=.659999&&maxWeight<=.66+1e-9,'WEIGHT_RANGE_DRIFT');
const receipt={
 schema:'H_EARTH_GEN2969_SOURCE_GROUNDCOVER_SCALAR_BOUNDARY_v1',
 result:'SOURCE_WEIGHT_EQUIVALENT_MATERIAL_SOURCE_DIFFERS',artifactId:12913811096,
 artifactSha256:'e1eb8a2fdbaacce663783440e2189b17e487eacb6c13fd50907d07cdb640bc4a',
 rendererBlob:'2ae6c42f6febaada2cb2a240844b9fddc5b9ed8e',
 adapterBlob:'d17e1909a00565f111afe9b48269859bbcc2a652',
 pairCount:18,maximumWeightDelta,maximumBaseColorDelta,minWeight,maxWeight,
 sourceScalarQualified:true,fullMaterialPaletteQualified:false,
 sourceMaterialOwnerAuthorized:false,openBoundaryFluxQualified:false,
 shorelineContactQualified:false,fullP_D_f0Evaluated:false,
 broadVisibleBandResolved:false,scientificClosure:false
};
process.stdout.write(process.argv.includes('--receipt')?JSON.stringify(receipt,null,2)+'\n':'PASS:SOURCE_GROUNDCOVER_SCALAR_18_PAIRS\n');
