import { chromium } from 'playwright';

const base = process.env.COMPASS_TEST_URL || 'http://127.0.0.1:4173/';
const browser = await chromium.launch({headless:true});
const context = await browser.newContext({viewport:{width:900,height:1000},hasTouch:true,isMobile:false});
const page = await context.newPage();
await page.goto(base,{waitUntil:'networkidle'});
await page.waitForTimeout(1200);

const measure = async () => page.evaluate(() => {
  const rect = el => { const b=el.getBoundingClientRect(); return {x:b.x,y:b.y,width:b.width,height:b.height,cx:b.x+b.width/2,cy:b.y+b.height/2}; };
  const root=document.querySelector('[data-compass-root]');
  const header=document.querySelector('.compass-estate__header');
  const scene=document.querySelector('[data-compass-scene]');
  const center=innerWidth/2;
  return {
    viewport:{width:innerWidth,height:innerHeight,center},
    header:header?{rect:rect(header),centerError:rect(header).cx-center}:null,
    children:header?[...header.children].map((el,i)=>{const r=rect(el),cs=getComputedStyle(el);return {index:i,tag:el.tagName,id:el.id||'',className:String(el.className||''),text:(el.textContent||'').trim().slice(0,90),rect:r,centerError:r.cx-center,marginLeft:cs.marginLeft,marginRight:cs.marginRight,width:cs.width,position:cs.position,left:cs.left,right:cs.right,transform:cs.transform,textAlign:cs.textAlign};}):[],
    scene:scene?{rect:rect(scene),centerError:rect(scene).cx-center}:null,
    root:root?{orbitFocus:root.dataset.orbitFocus||'',orbitPreviewFocus:root.dataset.orbitPreviewFocus||'',phase:root.dataset.orbitPhase||'',readable:root.dataset.readableCardinal||'',foreground:root.dataset.renderedForegroundCardinal||''}:null,
    cardinals:[...document.querySelectorAll('[data-compass-cardinal]')].map(el=>({wing:el.dataset.wing,primary:el.dataset.primary||'',readableClass:el.classList.contains('is-readable-cardinal'),visible:[...el.querySelectorAll(':scope>span')].some(s=>{const c=getComputedStyle(s);return c.visibility!=='hidden'&&Number(c.opacity)>0.5})}))
  };
});

const before=await measure();
const scene=page.locator('[data-compass-scene]').first();
await scene.scrollIntoViewIfNeeded();
await page.waitForTimeout(150);
const box=await scene.boundingBox();
if(box){
  const cdp=await page.context().newCDPSession(page);
  const y=Math.min(990,Math.max(10,box.y+box.height*.55));
  const x1=box.x+box.width*.72, x2=box.x+box.width*.28;
  const p=(x,y)=>[{x,y,radiusX:1,radiusY:1,force:1,id:1}];
  await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:p(x1,y)});
  for(let i=1;i<=14;i++){const t=i/14;await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:p(x1+(x2-x1)*t,y)});await page.waitForTimeout(18);}
  await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
}
await page.waitForTimeout(900);
const afterRelease=await measure();
console.log(JSON.stringify({result:'COMPASS_VISIBLE_DELTA_BASELINE',before,afterRelease},null,2));
await browser.close();
