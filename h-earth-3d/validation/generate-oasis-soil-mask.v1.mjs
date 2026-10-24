import {readFile,writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {gunzipSync} from 'node:zlib';
import {fileURLToPath} from 'node:url';
import {applyHEarthVerifiedPlantingPackage} from '../../showroom/globe/h-earth/render/live-render-package.run8e-r2.js';
import {buildHEarthOasisFoliagePresentation,buildHEarthOasisGrassSoilCoverage} from '../../showroom/globe/h-earth/render/grass-lowland-trial.js';
const root=new URL('../../',import.meta.url),hash=x=>createHash('sha256').update(x).digest('hex');
const sources=['showroom/globe/h-earth/render/oasis-bank-field.v1.js','h-earth-3d/evidence/oasis-bank-naturalization-v1/addition-witnesses.json','showroom/globe/h-earth/render/grass-lowland-trial.js','showroom/globe/h-earth/render/geometry-kernel.js','h-earth-3d/environment/h-earth.successor-surface-material.run8c.js','h-earth-3d/environment/h-earth.gen2514-qualified-placement-authority.js','showroom/globe/h-earth/render/live-render-package.run8e-r2.js'];
export async function generate(){
 const compressed=await readFile(new URL('showroom/globe/h-earth/render/assets/h-earth-canonical-base-world.v1.json.gz',root));
 if(hash(compressed)!=='48f754ca1b11b8fe7eeb0e8d4573f6b6cb544cf438322a115eb52c44d3b29d5a')throw Error('BASE_WORLD_IDENTITY');
 const pkg=applyHEarthVerifiedPlantingPackage(JSON.parse(gunzipSync(compressed)).raw);
 const supplemental=JSON.parse(await readFile(new URL('h-earth-3d/evidence/oasis-bank-naturalization-v1/addition-witnesses.json',root),'utf8'));
 const started=performance.now(),oasis=buildHEarthOasisFoliagePresentation(pkg),mask=buildHEarthOasisGrassSoilCoverage(oasis.primitives,supplemental.map(p=>p.local));
 const {pixels,...summary}=mask;
 const sourceHashes=Object.fromEntries(await Promise.all(sources.map(async p=>[p,hash(await readFile(new URL(p,root)))])));
 const value={schema:'H_EARTH_PRECOMPUTED_OASIS_SOIL_v1',packageIdentity:pkg.packageIdentity,summary,pixelSha256:hash(pixels),pixelsBase64:Buffer.from(pixels).toString('base64'),provenance:{baseWorldSha256:hash(compressed),sourceHashes,inputSha256:hash(JSON.stringify({positions:pkg.buffers.positions,indices:pkg.buffers.indices,primitiveSpans:pkg.primitiveSpans}))}};
 return {value,milliseconds:performance.now()-started};
}
if(process.argv[1]===fileURLToPath(import.meta.url)){
 const {value,milliseconds}=await generate(),destination=new URL('showroom/globe/h-earth/render/assets/oasis-soil-mask.v1.json',root);
 const bytes=JSON.stringify(value)+'\n';
 if(process.argv.includes('--check')){if(await readFile(destination,'utf8')!==bytes)throw Error('OASIS_MASK_EQUIVALENCE_FAILED');}
 else await writeFile(destination,bytes);
 console.log(JSON.stringify({mode:process.argv.includes('--check')?'EXACT_EQUAL':'GENERATED',assetSha256:hash(bytes),pixelSha256:value.pixelSha256,summary:value.summary,packageIdentity:value.packageIdentity,milliseconds}));
}
