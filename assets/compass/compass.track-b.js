(()=>{
'use strict';
const CONTRACT='COMPASS_TRACK_B_UPPER_PRESENTATION_v2';
if(globalThis.__DGB_TRACK_B?.contract===CONTRACT)return;
const qs=(s,r=document)=>r.querySelector(s);
const textNodes=(root=document)=>[...root.querySelectorAll('h1,h2,h3,h4,p,strong,span,summary,a')];
const exactText=(text,root=document)=>textNodes(root).find(n=>n.textContent.trim()===text);
const includesText=(text,root=document)=>textNodes(root).find(n=>n.textContent.includes(text));
function meaningfulBlock(node,predicate=()=>true){if(!node)return null;let cur=node;while(cur&&cur!==document.body){if(/^(SECTION|ARTICLE|ASIDE|DETAILS|DIV)$/.test(cur.tagName)&&predicate(cur))return cur;cur=cur.parentElement}return null}
function ensureCss(){if(qs('link[data-track-b-style]'))return;const l=document.createElement('link');l.rel='stylesheet';l.href='/assets/compass/compass.track-b.css?v=track-b-v2';l.dataset.trackBStyle='true';document.head.append(l)}
function brandHeader(){const title=exactText('The Compass');const header=qs('.compass-estate__header')||meaningfulBlock(title,n=>!n.querySelector('[data-compass-scene]'))||qs('main header')||qs('header');if(!header||qs('.compass-track-b-brand',header))return header;const b=document.createElement('div');b.className='compass-track-b-brand';b.textContent='DiamondGateBridge.com';header.prepend(b);return header}
function findIntroBlock(){const heading=exactText('Why Diamond Gate exists')||includesText('Why Diamond Gate exists');if(!heading)return null;return meaningfulBlock(heading,n=>{const t=n.textContent||'';return t.includes('Why Diamond Gate exists')&&n.querySelectorAll('p').length>=2&&!n.querySelector('[data-compass-scene]')})||heading.parentElement}
function buildIntro(header){const intro=findIntroBlock();if(!header||!intro||qs('.compass-track-b-intro'))return;
  const oldHeading=exactText('Why Diamond Gate exists',intro)||includesText('Why Diamond Gate exists',intro);if(oldHeading)oldHeading.remove();
  intro.classList.add('compass-track-b-original-intro');
  const outer=document.createElement('details');outer.className='compass-track-b-intro';outer.dataset.trackBIntroduction='true';
  const summary=document.createElement('summary');summary.textContent='New here? Open the introduction.';
  const body=document.createElement('div');body.className='compass-track-b-intro__body';
  const film=document.createElement('div');film.className='compass-track-b-film';
  const video=document.createElement('video');video.controls=true;video.preload='metadata';video.playsInline=true;video.setAttribute('aria-label','Diamond Gate Bridge — Chapter One');
  const source=document.createElement('source');source.src='/showroom/globe/h-earth/awards/media/diamond-gate-compass-mirrorland-36s.mp4';source.type='video/mp4';video.append(source);film.append(video);
  const about=document.createElement('details');about.className='compass-track-b-about';const aboutSummary=document.createElement('summary');aboutSummary.textContent='What is Diamond Gate Bridge?';about.append(aboutSummary,intro);
  body.append(film,about);outer.append(summary,body);header.after(outer);
}
function blockWithText(text,required=[]){const node=exactText(text)||includesText(text);if(!node)return null;return meaningfulBlock(node,n=>{const content=n.textContent||'';return required.every(x=>content.includes(x))})||node.parentElement}
function relocateCarousel(){const orbit=qs('[data-capability-orbit]');if(!orbit)return;
  const orbitBlock=meaningfulBlock(orbit,n=>n!==orbit&&n.contains(orbit)&&!n.querySelector('[data-proof-orbit]'))||orbit.parentElement;
  const built=blockWithText('Built as one connected system.',['Software TRL 7','Experience Checked'])||blockWithText('Built Different',['Software TRL 7','Experience Checked']);
  const build=blockWithText('Build Your Own Custom Site',['Explore custom construction'])||blockWithText('Build something of your own',['Explore custom construction']);
  if(!orbitBlock||!built)return;
  if(build&&build!==built&&!built.contains(build)){built.after(build);build.after(orbitBlock)}else{built.after(orbitBlock)}
  orbitBlock.classList.add('compass-track-b-relocated-orbit');
}
function annotateScene(){const scene=qs('[data-compass-scene]');if(scene)scene.dataset.trackBPresentation='context-dominant'}
function init(){ensureCss();const header=brandHeader();buildIntro(header);relocateCarousel();annotateScene();document.documentElement.dataset.trackB='constructed-v2';globalThis.__DGB_TRACK_B=Object.freeze({contract:CONTRACT,chapterOne:'owner-approved-live-master',trackAFrozen:true});}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
