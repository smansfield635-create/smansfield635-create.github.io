(()=>{
'use strict';
const cues=Object.freeze([
Object.freeze({key:'arrival',renderer:'ARRIVAL',start:0,end:4500,authority:'CINEMATIC_NATIVE'}),
Object.freeze({key:'orientation',renderer:'ORIENTATION',start:4500,end:9500,authority:'COMPASS'}),
Object.freeze({key:'chapter-one',renderer:'CHAPTER_ONE',start:9500,end:14500,authority:'CHAPTER_ONE'}),
Object.freeze({key:'choice-readiness',renderer:'CHOICE_READINESS',start:14500,end:19500,authority:'READINESS_CAPABILITY'}),
Object.freeze({key:'threshold',renderer:'THRESHOLD',start:19500,end:27000,authority:'MIRRORLAND_21_PANE'}),
Object.freeze({key:'elsewhere',renderer:'ELSEWHERE',start:27000,end:33000,authority:'AUDRALIA_ESTABLISHED_WORLD_SOURCE'}),
Object.freeze({key:'return-handoff',renderer:'RETURN_HANDOFF',start:33000,end:38000,authority:'LIVE_COMPASS_HANDOFF'})]);
const sources=Object.freeze({mirrorlandGeometry:'/assets/shared/mirrorland-window.geometry.js?v=canonical',audraliaWorld:'/products/archcoin/index.planet.source.js?v=about-precedent',renderer:'/assets/compass/compass.orientation-cinematic.render.js?v=about-differential-repair-3'});
function matchesScenes(scenes){return Array.isArray(scenes)&&scenes.length===cues.length&&cues.every((c,i)=>{const s=scenes[i];return s&&s.key===c.key&&s.renderer===c.renderer&&s.start===c.start&&s.end===c.end;});}
Object.defineProperty(window,'DGB_COMPASS_CINEMATIC_MEDIA',{value:Object.freeze({version:'1.0.0-definitive-successor',ready:true,durationMs:38000,cues,sources,derivedMediaRequired:false,matchesScenes}),configurable:true});
})();
