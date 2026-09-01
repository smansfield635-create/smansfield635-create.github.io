(()=>{
'use strict';
const root=document.querySelector('[data-compass-root]');
if(!root)return;
globalThis.DGB_COMPASS_DISABLE_LOCAL_SPACECRAFT=true;
const style=document.createElement('style');
style.id='compass-laws-spacecraft-adapter-style';
style.textContent=`
#laws-spacecraft-background-host{position:fixed;inset:0;z-index:12;overflow:hidden;pointer-events:none;user-select:none;contain:strict;isolation:isolate}
#laws-spacecraft-background-canvas{position:absolute;inset:0;display:block;width:100%;height:100%;pointer-events:none;opacity:.86;mix-blend-mode:screen}
@media (prefers-reduced-motion:reduce){#laws-spacecraft-background-host{display:none!important}}
`;
document.head.append(style);
const alreadyLawsRoot=root.hasAttribute('data-laws-root');
if(!alreadyLawsRoot)root.setAttribute('data-laws-root','');
import('/laws/index.spacecraft.background.js?v=LAWS_CP6_TRUE_3D_SPACECRAFT_BACKGROUND_20260801A')
  .then(()=>{
    const api=globalThis.DGB_LAWS_SPACECRAFT;
    api?.initialize?.();
    api?.start?.();
    root.dataset.compassSpacecraftSource='LAWS_CP6_TRUE_3D_SPACECRAFT_PAGE_BACKGROUND_v2';
    root.dataset.compassSpacecraftAdoption='DIRECT_LAWS_PRESENTATION_OWNER';
    root.dataset.compassSpacecraftAuthority='ambient-presentation-and-bounded-hit-response-only';
  })
  .catch(error=>{
    root.dataset.compassSpacecraftSource='laws-background-load-failed';
    console.error(error);
  })
  .finally(()=>{
    if(!alreadyLawsRoot)root.removeAttribute('data-laws-root');
  });
})();
