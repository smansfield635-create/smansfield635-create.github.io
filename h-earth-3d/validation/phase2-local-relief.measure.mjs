import{pathToFileURL}from'node:url';const root=process.argv[2]||'.',imp=p=>import(pathToFileURL(root+'/'+p).href+'?m='+Date.now());
const T=await imp('h-earth-3d/terrain/h-earth.terrain-field.js');
const relief=(x,z,r)=>{const v=[];for(const [dx,dz]of [[0,0],[r,0],[-r,0],[0,r],[0,-r],[r,r],[r,-r],[-r,r],[-r,-r]])v.push(T.sampleHEarthTerrainElevation(x+dx,z+dz));return Math.max(...v)-Math.min(...v)};
const point=(role,x,z)=>{const s=T.sampleHEarthTerrainField(x,z);return{role,x,z,elevation:s.elevation,slope:s.slope,curvature:s.curvature,relief:{r2:relief(x,z,2),r4:relief(x,z,4),r8:relief(x,z,8)}}};
const targets=[point('LOWLAND',-92,-152),point('DRAINAGE_BANK',-48,-150),point('FOOTHILL_BENCH',-42,-184)];
const preserved=[point('MOUNTAIN',86,-235),point('COAST',0,-96)];
const shore=T.getHEarthCanonicalShorelineZ(0),shoreline=[-8,0,8,18,38].map(d=>point('SHORE_'+d,0,shore-d));
const issues=[];for(const p of targets){if(!(p.relief.r8>=p.relief.r4&&p.relief.r4>=p.relief.r2))issues.push(p.role+':RELIEF_SCALE_ORDER_INVALID');if(p.relief.r8<=0)issues.push(p.role+':LOCAL_RELIEF_MISSING');}
if(shoreline.some(p=>!Number.isFinite(p.elevation)))issues.push('SHORELINE_INVALID');
console.log(JSON.stringify({receiptType:'H_EARTH_PHASE2_LOCAL_RELIEF_MEASUREMENT_v1',eligible:issues.length===0,targets,preserved,shoreline,issues},null,2));if(issues.length)process.exitCode=1;
