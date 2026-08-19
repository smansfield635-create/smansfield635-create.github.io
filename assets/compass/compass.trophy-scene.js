(()=>{
'use strict';
const scenes=new WeakMap();let primary=null;
function mount(canvas,{foreground=()=>true}={}){
  if(!canvas)return null;
  if(scenes.has(canvas))return scenes.get(canvas);
  const field=canvas.closest('[data-award-trophy]')||canvas.parentElement;
  const fallback=field?.querySelector('.compass-trophy-fallback');
  canvas.hidden=true;
  field?.classList.remove('is-webgl');
  field?.classList.add('is-fallback','is-trophy-emergency-static');
  if(fallback)fallback.hidden=false;
  const api=Object.freeze({canvas,fallback:true,activate:()=>false,capture:()=>null,restore:()=>false,inspect:()=>({fallback:true,foreground:foreground(),motion:'disabled-emergency-static'})});
  scenes.set(canvas,api);primary=api;return api;
}
window.CompassTrophyScene=Object.freeze({version:'emergency-static-fallback-v1',mount,activate:()=>false,capture:()=>null,restore:()=>false,inspect:()=>primary?.inspect()||{fallback:true,motion:'disabled-emergency-static'}});
})();
