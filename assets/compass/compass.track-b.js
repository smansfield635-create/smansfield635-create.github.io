(()=>{
'use strict';
const CONTRACT='COMPASS_TRACK_B_UPPER_PRESENTATION_v1';
if(globalThis.__DGB_TRACK_B?.contract===CONTRACT)return;
const qs=(s,r=document)=>r.querySelector(s);
const exactText=(root,text)=>[...root.querySelectorAll('h1,h2,h3,h4,p,strong,span')].find(n=>n.textContent.trim()===text);
function ensureCss(){if(qs('link[data-track-b-style]'))return;const l=document.createElement('link');l.rel='stylesheet';l.href='/assets/compass/compass.track-b.css?v=track-b-v1';l.dataset.trackBStyle='true';document.head.append(l)}
function brandHeader(){const header=qs('.compass-estate__header')||qs('main header')||qs('header');if(!header||qs('.compass-track-b-brand',header))return header;const b=document.createElement('div');b.className='compass-track-b-brand';b.textContent='DiamondGateBridge.com';header.prepend(b);return header}
function buildIntro(header){const intro=qs('.compass-introduction');if(!header||!intro||qs('.compass-track-b-intro'))return;
  const oldHeading=exactText(intro,'Why Diamond Gate exists');if(oldHeading)oldHeading.remove();
  const outer=document.createElement('details');outer.className='compass-track-b-intro';outer.dataset.trackBIntroduction='true';
  const summary=document.createElement('summary');summary.textContent='New here? Open the introduction.';
  const body=document.createElement('div');body.className='compass-track-b-intro__body';
  const film=document.createElement('div');film.className='compass-track-b-film';
  const video=document.createElement('video');video.controls=true;video.preload='metadata';video.playsInline=true;video.setAttribute('aria-label','Diamond Gate Bridge — Chapter One');
  const source=document.createElement('source');source.src='/showroom/globe/h-earth/awards/media/diamond-gate-compass-mirrorland-36s.mp4';source.type='video/mp4';video.append(source);film.append(video);
  const about=document.createElement('details');about.className='compass-track-b-about';const aboutSummary=document.createElement('summary');aboutSummary.textContent='What is Diamond Gate Bridge?';about.append(aboutSummary,intro);
  body.append(film,about);outer.append(summary,body);header.after(outer);
}
function relocateCarousel(){const orbit=qs('[data-capability-orbit]');const built=qs('.compass-built');if(!orbit||!built)return;const section=orbit.closest('section')||orbit.parentElement;if(!section||built.contains(section))return;section.classList.add('compass-track-b-relocated-orbit');built.after(section)}
function annotateScene(){const scene=qs('[data-compass-scene]');if(scene)scene.dataset.trackBPresentation='context-dominant'}
function init(){ensureCss();const header=brandHeader();buildIntro(header);relocateCarousel();annotateScene();document.documentElement.dataset.trackB='constructed-v1';globalThis.__DGB_TRACK_B=Object.freeze({contract:CONTRACT,chapterOne:'owner-approved-live-master',trackAFrozen:true});}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
