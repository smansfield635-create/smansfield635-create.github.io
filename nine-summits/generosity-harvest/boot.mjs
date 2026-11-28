import {authenticateAssets} from './integrity.mjs';
import {loadArticulatedSource} from './articulated-hop.private.mjs';
import {mountPreview} from './preview.mjs';
const view=document.querySelector('#view'),play=document.querySelector('#play'),reset=document.querySelector('#reset'),status=document.querySelector('#status');
function closed(){view.style.visibility='hidden';play.disabled=reset.disabled=true;status.textContent='Harvest unavailable — asset validation or graphics initialization failed. Reload to retry.';}
try{const a=await authenticateAssets(new URL('./',location.href));const source=await loadArticulatedSource(a.fetchVerified);await mountPreview({source,artBytes:a.artBytes,placement:a.placement});view.style.visibility='visible';play.disabled=reset.disabled=false;status.textContent='Ready';}catch(error){closed();console.error('HARVEST_STARTUP_FAILED',error);}
