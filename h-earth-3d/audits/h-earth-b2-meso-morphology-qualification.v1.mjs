import { sampleHEarthTerrainField } from '../terrain/h-earth.terrain-field.js';

const sample=(x,z)=>sampleHEarthTerrainField(x,z).elevation;
const features={
  ridgeBranches:[
    {id:'MESO_RIDGE_NE',peak:[126,-251],flanks:[[126,-231],[126,-271]],minProminence:1.5},
    {id:'MESO_RIDGE_CENTRAL',peak:[74,-263],flanks:[[74,-243],[74,-283]],minProminence:1.25}
  ],
  spurs:[
    {id:'SPUR_EAST',axis:[142,-194],flanks:[[124,-194],[160,-194]],minProminence:1.0},
    {id:'SPUR_CENTRAL_EAST',axis:[94,-191],flanks:[[77,-191],[111,-191]],minProminence:0.8},
    {id:'SPUR_CENTRAL_WEST',axis:[45,-187],flanks:[[27,-187],[63,-187]],minProminence:0.7},
    {id:'SPUR_WEST',axis:[-8,-181],flanks:[[-28,-181],[12,-181]],minProminence:0.5}
  ],
  drainage:[
    {id:'DRAINAGE_EAST',channel:[116,-190],banks:[[103,-190],[129,-190]],minIncision:0.8},
    {id:'DRAINAGE_CENTRAL',channel:[69,-184],banks:[[56,-184],[82,-184]],minIncision:0.8},
    {id:'DRAINAGE_WEST',channel:[20,-179],banks:[[6,-179],[34,-179]],minIncision:0.6}
  ],
  saddles:[
    {id:'SADDLE_EAST',saddle:[109,-245],shoulders:[[94,-245],[124,-245]],minDrop:0.5},
    {id:'SADDLE_WEST',saddle:[58,-248],shoulders:[[43,-248],[73,-248]],minDrop:0.5}
  ]
};
const results=[];
for(const f of features.ridgeBranches){const p=sample(...f.peak), fs=f.flanks.map(v=>sample(...v)), prominence=p-Math.max(...fs);results.push({type:'RIDGE_BRANCH',id:f.id,value:prominence,threshold:f.minProminence,pass:prominence>=f.minProminence});}
for(const f of features.spurs){const a=sample(...f.axis), fs=f.flanks.map(v=>sample(...v)), prominence=a-Math.max(...fs);results.push({type:'SPUR',id:f.id,value:prominence,threshold:f.minProminence,pass:prominence>=f.minProminence});}
for(const f of features.drainage){const c=sample(...f.channel),bs=f.banks.map(v=>sample(...v)),incision=Math.min(...bs)-c;results.push({type:'DRAINAGE',id:f.id,value:incision,threshold:f.minIncision,pass:incision>=f.minIncision});}
for(const f of features.saddles){const s=sample(...f.saddle),sh=f.shoulders.map(v=>sample(...v)),drop=Math.min(...sh)-s;results.push({type:'SADDLE',id:f.id,value:drop,threshold:f.minDrop,pass:drop>=f.minDrop});}
const pass=results.every(r=>r.pass);
console.log(JSON.stringify({schema:'H_EARTH_B2_MESO_MORPHOLOGY_QUALIFICATION_v1',result:pass?'PASS':'FAIL',featureCount:results.length,passed:results.filter(r=>r.pass).length,results},null,2));
if(!pass) process.exitCode=1;
