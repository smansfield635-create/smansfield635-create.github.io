import { pathToFileURL } from 'node:url';
import { performance } from 'node:perf_hooks';
const [aRoot,bRoot,cRoot]=process.argv.slice(2);
if(!aRoot||!bRoot||!cRoot)throw new Error('USAGE: node observer-scale-abc.performance.mjs <A_ROOT> <B_ROOT> <C_ROOT>');
const imp=async(root,p)=>import(pathToFileURL(root+'/'+p).href+'?perf='+Date.now()+Math.random());
const paths={geom:'showroom/globe/h-earth/render/geometry-successor-terrain.run8b.js',preview:'showroom/globe/h-earth/render/landscape-preview.js',pkg:'showroom/globe/h-earth/render/live-render-package.run8e-r2.js',gpu:'showroom/globe/h-earth/render/gpu-upload-views.run8e-r2d.js'};
async function measure(root,label){
 const G=await imp(root,paths.geom),L=await imp(root,paths.preview),P=await imp(root,paths.pkg),U=await imp(root,paths.gpu);
 const samples={terrainConstructionMs:[],landscapePreviewMs:[],immutablePackageMs:[],gpuUploadViewPreparationMs:[]};
 let geom,preview,pkg,gpu;
 for(let i=0;i<3;i++){let t=performance.now();geom=G.constructHEarthRun8BSuccessorTerrainAndMountain();samples.terrainConstructionMs.push(performance.now()-t);
 t=performance.now();preview=L.previewHEarthFunctionalLandscape();samples.landscapePreviewMs.push(performance.now()-t);
 t=performance.now();pkg=P.buildHEarthRun8ER2ImmutableLiveRenderPackage({packageOccurrenceId:'H_EARTH_PERF_'+label+'_'+i});samples.immutablePackageMs.push(performance.now()-t);
 t=performance.now();gpu=U.createHEarthRun8ER2DCanonicalGPUUploadViews(pkg);samples.gpuUploadViewPreparationMs.push(performance.now()-t);}
 const span=pkg.primitiveSpans.find(s=>s.role==='TERRAIN');
 const bytes={positions:gpu.positions.byteLength,normals:gpu.normals.byteLength,indices:gpu.indices.byteLength,allGpuViews:['positions','normals','baseColorsLinear','materialParameters','materialModelCodes','surfaceClassCodes','primitiveIndices','roleCodes','indices'].reduce((n,k)=>n+(gpu[k]?.byteLength||0),0)};
 const stat=a=>({min:Math.min(...a),median:[...a].sort((x,y)=>x-y)[1],max:Math.max(...a)});
 return {label,terrain:{vertices:span.vertexCount,triangles:span.triangleCount,indices:span.indexCount},timing:Object.fromEntries(Object.entries(samples).map(([k,v])=>[k,stat(v)])),gpuBytes:bytes,browserOnly:{rendererInitializationMs:'MISSING_BROWSER_MEASUREMENT',firstDrawMs:'MISSING_BROWSER_MEASUREMENT',firstFramePresentedMs:'MISSING_BROWSER_MEASUREMENT',steadyStateFrameTiming:'MISSING_BROWSER_MEASUREMENT',watchdogThreshold:'MISSING_BROWSER_MEASUREMENT'}};
}
const receipt={receiptType:'H_EARTH_OBSERVER_SCALE_ABC_PERFORMANCE_STATIC_v1',A:await measure(aRoot,'A_8U'),B:await measure(bRoot,'B_4U'),C:await measure(cRoot,'C_ADAPTIVE_4U_8U'),productMutation:false};
console.log(JSON.stringify(receipt,null,2));
