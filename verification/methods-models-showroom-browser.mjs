import fs from "node:fs";
import puppeteer from "puppeteer-core";

const origin=process.env.METHODS_MODELS_ORIGIN||"http://127.0.0.1:4173";
const chrome=process.env.CHROME_PATH;
const head=process.env.EXECUTION_COMMIT||"UNKNOWN";
if(!chrome) throw new Error("CHROME_PATH_REQUIRED");
const browser=await puppeteer.launch({executablePath:chrome,headless:true,args:["--no-sandbox","--disable-dev-shm-usage"]});
const assertions=[];const errors=[];const check=(id,pass,detail=null)=>assertions.push({id,pass:Boolean(pass),detail});

async function run(label,viewport){
 const page=await browser.newPage();await page.setViewport(viewport);
 page.on("pageerror",e=>errors.push({label,type:"page",message:e.message}));
 page.on("console",m=>{if(m.type()==="error")errors.push({label,type:"console",message:m.text()})});
 await page.goto(`${origin}/laws/research/methods-and-models/`,{waitUntil:"networkidle0",timeout:45000});
 await page.waitForSelector('[data-mm-showroom][data-mm-euclidean-ready="true"]',{timeout:15000});
 const initial=await page.evaluate(()=>{const r=document.querySelector('[data-mm-showroom]');const c=r.querySelector('.mm-model-card[data-mm-x-position="active"]');const rect=c.getBoundingClientRect();const visible=s=>[...document.querySelectorAll(s)].filter(n=>getComputedStyle(n).display!=="none"&&n.getClientRects().length).length;return{model:r.dataset.mmModel,x:r.dataset.mmX,cards:r.querySelectorAll('.mm-model-card').length,previous:Boolean(r.querySelector('.mm-model-card[data-mm-x-position="previous"]')),next:Boolean(r.querySelector('.mm-model-card[data-mm-x-position="next"]')),arrows:visible('.mm-deck-controls,.mm-z-axis-controls,[data-mm-dock-previous],[data-mm-dock-next]'),overflow:document.documentElement.scrollWidth-innerWidth,rect:{left:rect.left,right:rect.right,width:rect.width,height:rect.height}}});
 check(`${label}_CAROUSEL_HAS_SIX_MODELS`,initial.cards===6,initial);
 check(`${label}_CAROUSEL_HAS_NEIGHBORS`,initial.previous&&initial.next,initial);
 check(`${label}_VISIBLE_ARROWS_ZERO`,initial.arrows===0,initial.arrows);
 check(`${label}_NO_HORIZONTAL_OVERFLOW`,initial.overflow<=2,initial.overflow);
 check(`${label}_ACTIVE_CARD_CONTAINED`,initial.rect.left>=-1&&initial.rect.right<=viewport.width+1,initial.rect);
 await page.click('[data-mm-lens-tab="engineering"]');
 const before=await page.evaluate(()=>({model:document.querySelector('[data-mm-showroom]').dataset.mmModel,x:document.querySelector('[data-mm-showroom]').dataset.mmX,lens:document.querySelector('[data-mm-lens-tab][aria-selected="true"]').dataset.mmLensTab}));
 const card=await page.$('.mm-model-card[data-mm-x-position="active"]');const b=await card.boundingBox();
 if(viewport.hasTouch){const client=await page.target().createCDPSession();await client.send('Emulation.setTouchEmulationEnabled',{enabled:true,maxTouchPoints:1});const y=Math.round(b.y+b.height*.48),x1=Math.round(b.x+b.width*.78),x2=Math.round(b.x+b.width*.22);await client.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:x1,y,id:1}]});await client.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:x2,y,id:1}]});await client.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});}else{const y=b.y+b.height*.48;await page.mouse.move(b.x+b.width*.78,y);await page.mouse.down();await page.mouse.move(b.x+b.width*.22,y,{steps:12});await page.mouse.up();}
 await page.waitForFunction(old=>document.querySelector('[data-mm-showroom]').dataset.mmModel!==old,{timeout:5000},before.model);await new Promise(r=>setTimeout(r,650));
 const after=await page.evaluate(()=>({model:document.querySelector('[data-mm-showroom]').dataset.mmModel,x:document.querySelector('[data-mm-showroom]').dataset.mmX,lens:document.querySelector('[data-mm-lens-tab][aria-selected="true"]').dataset.mmLensTab,active:document.querySelectorAll('.mm-model-card[data-mm-x-position="active"]').length}));
 check(`${label}_DIRECT_SWIPE_MOVES_CAROUSEL`,after.model!==before.model&&after.x!==before.x,{before,after});
 check(`${label}_LENS_CONTINUITY`,before.lens==="engineering"&&after.lens==="engineering",{before,after});
 check(`${label}_ONE_ACTIVE_MODEL`,after.active===1,after.active);
 const screenshot=await page.screenshot({type:"png",encoding:"base64"});await page.close();return{label,viewport,before,after,screenshotPngBase64:screenshot};
}

const desktop=await run("DESKTOP",{width:1440,height:1000,deviceScaleFactor:1});
const tablet=await run("TABLET",{width:800,height:1280,deviceScaleFactor:1.5,isMobile:true,hasTouch:true});
const mobile=await run("MOBILE",{width:430,height:932,deviceScaleFactor:2,isMobile:true,hasTouch:true});
await browser.close();check("RUNTIME_ERRORS_ZERO",errors.length===0,errors);
const failed=assertions.filter(a=>!a.pass);const receipt={schema:"METHODS_MODELS_TROPHY_CAROUSEL_EVIDENCE_v1",result:failed.length?"FAIL":"PASS_CLOSED",executionCommit:head,awardRequirements:{directManipulation:true,visibleArrowNavigation:false,desktopDrag:true,mobileSwipe:true,lensContinuity:true,neighborPlanes:true,noOverflow:true,zeroRuntimeErrors:true,visualEvidenceCaptured:true},assertions,errors,visualEvidence:{desktop,tablet,mobile}};
fs.writeFileSync("methods-models-showroom-exact-head.json",JSON.stringify(receipt,null,2)+"\n");console.log(JSON.stringify({result:receipt.result,executionCommit:head,failed:failed.map(x=>x.id)},null,2));if(failed.length)process.exit(1);
