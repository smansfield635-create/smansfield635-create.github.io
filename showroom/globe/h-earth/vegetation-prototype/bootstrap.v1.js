import {createHEarthLoadingScreen} from './loading-screen.v1.js?rev=gen2815-fast-start-v1';
// The HTML intro is already visible. Attach its lifecycle before importing the world.
const loader=createHEarthLoadingScreen({startedAt:0,onEnter:()=>document.dispatchEvent(new Event('gratitude-enter'))});
globalThis.H_EARTH_STARTUP_LOADER=loader;
loader.beginStage('world','Opening the landscape');
requestAnimationFrame(()=>requestAnimationFrame(async()=>{
 try{
  const route=document.getElementById('h-earth-current-run8e-module').dataset.route;
  await import(new URL(route,document.baseURI).href);
 }catch(error){
  loader.fail(error);
  document.getElementById('h-earth-functional-landscape-route').dataset.run8eError='true';
  document.getElementById('prototype-status').textContent='Gratitude could not finish preparing';
 }
}));
