import fs from 'node:fs';import vm from 'node:vm';import crypto from 'node:crypto';
const [root,rendererPath,seamPath,outputPrefix,capturePath]=process.argv.slice(2);
if(!capturePath)throw Error('usage: mesh renderer seam outputPrefix captureReceipt');
const source=fs.readFileSync(rendererPath,'utf8');
if(crypto.createHash('sha256').update(source).digest('hex')!=='fa6acc426c75c3b2292b3ed76a756157698d8e7a5562511ad7ced5af58e25dec')throw Error('source custody');
const read=(n,T)=>{const b=fs.readFileSync(root+'/'+n);return new T(b.buffer.slice(b.byteOffset,b.byteOffset+b.byteLength));};
const views={positions:read('upload-positions.bin',Float32Array),indices:read('upload-indices.bin',Uint32Array),normals:read('upload-normals.bin',Float32Array),coastDistances:read('upload-coastDistances.bin',Float32Array)};
const spans=JSON.parse(fs.readFileSync(root+'/package.json')).primitiveSpans;
const start=source.indexOf('function* createExposedWaterContactFieldSteps('),end=source.indexOf('\n\nasync function yieldToBrowserPaint',start);
const fn=vm.runInNewContext('('+source.slice(start,end).trim()+')',{performance,Float32Array});const gen=fn(views,spans);let r;do{r=gen.next();}while(!r.done);
const seamSrc=fs.readFileSync(seamPath,'utf8');
const seam=vm.runInNewContext(seamSrc.replaceAll('export function','function')+'\ncreateTerrainSeamPresentation',{Float32Array})({...views,contactDistances:r.value.packageDistances,primitiveSpans:spans});
fs.writeFileSync(outputPrefix+'.bin',Buffer.from(seam.contactDistances.buffer));fs.writeFileSync(outputPrefix+'-receipt.json',JSON.stringify({sourceSha256:crypto.createHash('sha256').update(source).digest('hex'),stats:r.value.stats,seam:seam.receipt,contactSha256:crypto.createHash('sha256').update(Buffer.from(seam.contactDistances.buffer)).digest('hex')},null,2));console.log(JSON.stringify(r.value.stats));

const receipt=JSON.parse(fs.readFileSync(outputPrefix+'-receipt.json')),capture=JSON.parse(fs.readFileSync(capturePath));const keys=Object.keys(receipt.stats).filter(k=>k!=='initializationMilliseconds');
if(!capture.views.every(v=>keys.every(k=>v.resources.contactField[k]===receipt.stats[k])))throw Error('SAVED_CONTACT_STATISTICS_MISMATCH');
receipt.captureComparison={views:capture.views.length,nonTimingFieldsMatched:keys,allMatched:true};fs.writeFileSync(outputPrefix+'-receipt.json',JSON.stringify(receipt,null,2));
