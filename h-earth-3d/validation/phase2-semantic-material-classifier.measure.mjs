import{pathToFileURL}from'node:url';const root=process.argv[2]||'.',M=await import(pathToFileURL(root+'/h-earth-3d/environment/h-earth.semantic-material-field.phase2.js').href+'?m='+Date.now());
const W=[['WET_SHORELINE_SAND',0,-82],['DRY_SAND_BACKSHORE',0,-104],['LOWLAND_SOIL_GROUNDCOVER',-92,-152],['DRAINAGE_SEDIMENT_MOIST_GROUND',-48,-150],['FOOTHILL_SOIL_STONE',-42,-184],['EXPOSED_MOUNTAIN_ROCK',86,-235]];
const rows=W.map(([expected,x,z])=>({expected,...M.sampleHEarthPhase2SemanticMaterial(x,z)}));
const dist=(a,b)=>Math.hypot(...a.map((v,i)=>v-b[i]));const separations=[];for(let i=0;i<rows.length;i++)for(let j=i+1;j<rows.length;j++)separations.push({a:rows[i].expected,b:rows[j].expected,rgbDistance:dist(rows[i].rgb,rows[j].rgb)});
const transitions=[...Array(17)].map((_,i)=>{const inland=i*6,x=0,z=-82-inland,s=M.sampleHEarthPhase2SemanticMaterial(x,z);return{inland,family:s.family,weights:s.weights,rgb:s.rgb}});
const issues=[];for(const r of rows){if(r.family!==r.expected)issues.push('WITNESS_FAMILY_MISMATCH:'+r.expected+':'+r.family);if((r.weights[r.expected]??0)<.34)issues.push('WITNESS_WEIGHT_WEAK:'+r.expected);}
if(Math.min(...separations.map(x=>x.rgbDistance))<.045)issues.push('FAMILY_RGB_SEPARATION_WEAK');
for(let i=1;i<transitions.length;i++)if(dist(transitions[i-1].rgb,transitions[i].rgb)>.38)issues.push('TRANSITION_DISCONTINUITY:'+i);
console.log(JSON.stringify({receiptType:'H_EARTH_PHASE2_SEMANTIC_MATERIAL_CLASSIFIER_MEASUREMENT_v1',eligible:issues.length===0,witnesses:rows,separations,transitions,issues},null,2));if(issues.length)process.exitCode=1;
