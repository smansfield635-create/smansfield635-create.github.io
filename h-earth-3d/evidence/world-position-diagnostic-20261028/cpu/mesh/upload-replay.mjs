import fs from 'node:fs';import crypto from 'node:crypto';
import {createHEarthRun8ER2DCanonicalGPUUploadViews,getHEarthSignedCoastDistanceMeters} from '/tmp/h-earth-scene-cb57/showroom/globe/h-earth/render/gpu-upload-views.run8e-r2d.js';
import {createTerrainSeamPresentation} from '/tmp/h-earth-scene-cb57/showroom/globe/h-earth/render/terrain-seam-normal.v1.js';
const freeze=x=>{if(x&&typeof x==='object'){for(const v of Object.values(x))freeze(v);Object.freeze(x)}return x};
const p=freeze(JSON.parse(fs.readFileSync('/tmp/mesh-cpu/package.json','utf8')));
const u=createHEarthRun8ER2DCanonicalGPUUploadViews(p,{enableWoodlandClearing:true});const coast=new Float32Array(p.vertexCount);
for(const s of p.primitiveSpans){if(s.role!=='TERRAIN'&&s.primitiveId!=='H_EARTH_WORLD_MANIFOLD:FAR_LAND_CONTINUATION')continue;
for(let i=s.vertexStart;i<s.vertexStart+s.vertexCount;i++){let [x,y,z]=u.positions.slice(i*3,i*3+3);const h=Math.hypot(x,z),k=h>Number.EPSILON?Math.atan2(h,y+420000)*420000/h:0;coast[i]=getHEarthSignedCoastDistanceMeters(x*k,z*k);}}
const seam=createTerrainSeamPresentation({...u,coastDistances:coast,contactDistances:new Float32Array(p.vertexCount),primitiveSpans:p.primitiveSpans});
const hashes={};for(const [n,a] of Object.entries({positions:u.positions,normals:seam.normals,coastDistances:seam.coastDistances,indices:u.indices})){const b=Buffer.from(a.buffer);fs.writeFileSync('/tmp/mesh-cpu/upload-'+n+'.bin',b);hashes[n]=crypto.createHash('sha256').update(b).digest('hex');}
const r={result:'EXACT_UPLOAD_AND_NORMAL_COAST_SEAM_REPLAY',packageIdentity:p.packageIdentity,uploadReceipt:u.canonicalizationReceipt,seam:seam.receipt,hashes,limits:['Contact-distance placeholder zero only for normal/coast seam operation; contact distances are not reconstructed or used here.','Indices are pre-retirement; selected geometry support must be checked separately against runtime retirement.']};fs.writeFileSync('/tmp/mesh-cpu/upload-replay.json',JSON.stringify(r,null,2));console.log(JSON.stringify(r,null,2));
