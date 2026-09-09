(()=>{
'use strict';
const CONTRACT='PRELUDE_THRESHOLD_v1';
const root=document.querySelector('[data-prelude-reads]');
if(!root)return;
const tabs=[...root.querySelectorAll('[data-prelude-read-tab]')];
const panels=[...root.querySelectorAll('[data-prelude-read-panel]')];
const keys=tabs.map(tab=>tab.dataset.preludeReadTab);
function select(key,{focus=false}={}){
  if(!keys.includes(key))return;
  root.dataset.activeRead=key;
  tabs.forEach(tab=>{
    const on=tab.dataset.preludeReadTab===key;
    tab.setAttribute('aria-selected',on?'true':'false');
    tab.tabIndex=on?0:-1;
    if(on&&focus)tab.focus();
  });
  panels.forEach(panel=>{
    const on=panel.dataset.preludeReadPanel===key;
    panel.hidden=!on;
  });
}
function step(current,delta){
  const index=keys.indexOf(current);
  const next=(index+delta+keys.length)%keys.length;
  select(keys[next],{focus:true});
}
tabs.forEach(tab=>{
  tab.addEventListener('click',()=>select(tab.dataset.preludeReadTab));
  tab.addEventListener('keydown',event=>{
    if(event.key==='ArrowRight'){event.preventDefault();step(tab.dataset.preludeReadTab,1)}
    if(event.key==='ArrowLeft'){event.preventDefault();step(tab.dataset.preludeReadTab,-1)}
    if(event.key==='Home'){event.preventDefault();select(keys[0],{focus:true})}
    if(event.key==='End'){event.preventDefault();select(keys[keys.length-1],{focus:true})}
  });
});
root.dataset.preludeReady='true';
root.dataset.preludeContract=CONTRACT;
})();
