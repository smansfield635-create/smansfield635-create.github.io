#!/usr/bin/env node
const MAX=24;
const profiles=[
['D1',1,1],['D2',2,2],['D3',3,3],['D4',4,4],['D5',5,5],['D6',6,6],['D7',7,7],['D8',8,8],
['ABOVE',8,9],['OVERESTIMATE',8,3],['UNDERESTIMATE',1,7],
['ACCIDENTAL_MISS',5,5],['LUCKY_SUCCESS',5,4],['MIXED',5,5],['ASSISTED',5,5],['CONTRADICTORY',5,5]
];
function simulate(name,start,ability){
 let d=start,used=new Set(),e={},hi=null,lo=null,total=0,flip=0;
 const answer=(difficulty,n)=>{
   if(name==='ABOVE')return true;
   if(name==='ACCIDENTAL_MISS'&&total===0)return false;
   if(name==='LUCKY_SUCCESS'&&total===0)return true;
   if(name==='CONTRADICTORY')return n%2===0;
   if(name==='MIXED'&&difficulty===ability)return n%3!==0;
   return difficulty<=ability;
 };
 while(total<MAX){
   e[d]??={n:0,c:0}; const item=d+'-'+e[d].n;
   if(used.has(item))throw Error(name+' repeat');
   used.add(item);e[d].n++;total++;
   const ok=answer(d,e[d].n);if(ok)e[d].c++;
   const n=e[d].n,r=e[d].c/n;
   if(n>=2&&r===1){hi=Math.max(hi??0,d);if(d===8&&n>=5)return {name,result:'ABOVE_RANGE',total};d=Math.min(8,d+1);continue}
   if(n>=2&&r===0){lo=Math.min(lo??9,d);if(d===1&&n>=5)return {name,result:'D1',total};d=Math.max(1,d-1);continue}
   if(n>=5){
     if(r>=.8){hi=Math.max(hi??0,d);if(d===8)return {name,result:'D8',total};d=Math.min(8,d+1);continue}
     if(r<=.4){lo=Math.min(lo??9,d);if(d===1)return {name,result:'D1',total};d=Math.max(1,d-1);continue}
   }
   if(hi!==null&&lo!==null&&lo-hi<=1&&total>=5)return {name,result:'D'+hi,total};
   if(n>=8)return {name,result:'UNCERTAIN_BOUNDARY',total};
 }
 return {name,result:'UNCERTAIN_BOUNDARY',total};
}
const out=profiles.map(p=>simulate(...p));
for(const x of out){if(x.total>MAX)throw Error(x.name+' max');}
const by=Object.fromEntries(out.map(x=>[x.name,x]));
for(let d=1;d<=7;d++)if(!['D'+d,'D'+(d+1)].includes(by['D'+d].result))throw Error('true D'+d+' '+by['D'+d].result);
if(!['D8','ABOVE_RANGE'].includes(by.D8.result))throw Error('D8');
if(by.ABOVE.result!=='ABOVE_RANGE')throw Error('above');
if(!/^D[234]$/.test(by.OVERESTIMATE.result))throw Error('overestimate '+by.OVERESTIMATE.result);
if(!/^D[678]$/.test(by.UNDERESTIMATE.result)&&by.UNDERESTIMATE.result!=='ABOVE_RANGE')throw Error('underestimate '+by.UNDERESTIMATE.result);
if(by.CONTRADICTORY.result!=='UNCERTAIN_BOUNDARY')throw Error('contradictory');
console.log(JSON.stringify({schema:'EDUCATION_PROGRESSIVE_TRAVERSAL_SIMULATION_v1',result:'PASS',profiles:out},null,2));
