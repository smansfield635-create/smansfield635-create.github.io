import{pathToFileURL}from'node:url';import{performance}from'node:perf_hooks';
const root=process.argv[2]||'.',imp=p=>import(pathToFileURL(root+'/'+p).href+'?m='+Date.now());
const N=await imp('showroom/globe/h-earth/functional-landscape/visible-terrain-clearance.js');
const before=N.getHEarthVisibleTerrainClearancePerformanceCounters();
const cases=[{x:0,z:-96,yaw:0},{x:72,z:-172,yaw:18},{x:88,z:-88,yaw:12},{x:96,z:-80,yaw:0},{x:104,z:-80,yaw:0}];
const rows=[];for(const q of cases){const b=N.getHEarthVisibleTerrainClearancePerformanceCounters(),t=performance.now(),r=N.sampleHEarthVisibleTerrainClearanceEnvelope(q.x,q.z,{yawDegrees:q.yaw,lookAheadDistance:6,lateralRadius:1.25}),ms=performance.now()-t,a=N.getHEarthVisibleTerrainClearancePerformanceCounters();rows.push({...q,valid:r.valid,elapsedMs:ms,surfaceQueries:a.surfaceQueries-b.surfaceQueries,triangleCandidatesTested:a.triangleCandidatesTested-b.triangleCandidatesTested,triangleHits:a.triangleHits-b.triangleHits,candidatesPerSurfaceQuery:(a.triangleCandidatesTested-b.triangleCandidatesTested)/Math.max(1,a.surfaceQueries-b.surfaceQueries)});}
const after=N.getHEarthVisibleTerrainClearancePerformanceCounters();console.log(JSON.stringify({receiptType:'H_EARTH_ADAPTIVE_C_CLEARANCE_HOTPATH_MEASUREMENT_v1',before,after,cases:rows,productMutation:false},null,2));
