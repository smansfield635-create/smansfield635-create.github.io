(()=>{"use strict";
function bind(){
  const link=document.querySelector('.dgb-trl7-link');
  if(!link)return;
  link.href='/evidence/readiness/';
  link.textContent='Inspect the TRL 7 closure matrix →';
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(bind,0),{once:true});else setTimeout(bind,0);
})();
