// O1 owns this representation model. Names and large-scale relationships are adopted source evidence,
// not a copy of H-Earth renderer, camera, mesh, physics, or runtime.
export const WORLD = Object.freeze({
  id:'AUDRALIA',
  focus:Object.freeze({x:0,y:0,name:'Gratitude Basin'}),
  coastline:Object.freeze([[-11,-4],[-10,-7],[-7,-9],[-3,-10],[1,-9],[5,-8],[8,-5],[10,-1],[9,3],[7,6],[4,9],[0,10],[-4,9],[-8,7],[-10,3]]),
  sandbars:Object.freeze([
    Object.freeze([[-9.7,1.2],[-8.5,.3],[-7.2,-.1],[-6.1,.25],[-7.6,.7]]),
    Object.freeze([[7.6,-3.1],[8.7,-2.4],[9.2,-1.4],[8.4,-1.8],[7.2,-2.5]])
  ]),
  landmarks:Object.freeze([
    Object.freeze({name:'Gratitude',x:0,y:0,elevation:1.0,kind:'summit'}),
    Object.freeze({name:'Harbor',x:-6.8,y:1.1,elevation:.05,kind:'harbor'}),
    Object.freeze({name:'North Peaks',x:1.8,y:-5.1,elevation:.82,kind:'ridge'}),
    Object.freeze({name:'West Basin',x:-3.4,y:2.8,elevation:.22,kind:'basin'}),
    Object.freeze({name:'East Rise',x:4.7,y:1.7,elevation:.58,kind:'ridge'})
  ])
});
export function terrainHeight(x,y){
  const peak=Math.exp(-((x*x)*.12+(y*y)*.09));
  const north=.68*Math.exp(-(((x-2.0)**2)*.16+((y+5.0)**2)*.20));
  const east=.45*Math.exp(-(((x-4.7)**2)*.18+((y-1.6)**2)*.14));
  const basin=-.18*Math.exp(-(((x+3.3)**2)*.20+((y-2.8)**2)*.18));
  return Math.max(0,Math.min(1,peak+north+east+basin));
}
