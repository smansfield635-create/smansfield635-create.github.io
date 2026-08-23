import { chromium } from 'playwright';

const base=process.env.COMPASS_TEST_URL||'http://127.0.0.1:4173/';
const AUDIT_TABLET_SCENE_CENTER_ERROR=-160;
const LEGACY_TABLET_SCENE_CENTER_ERROR=0;
const TABLET_SCENE_CENTER_TOLERANCE=18;
const browser=await chromium.launch({headless:true});
const context=await browser.newContext({viewport:{width:900,height:1000},hasTouch:true});
const page=await context.newPage();
const errors=[];page.on('pageerror',e=>errors.push(String(e)));
await page.goto(base,{waitUntil:'networkidle'});await page.waitForTimeout(1400);

const snapshot=async()=>page.evaluate(()=>{
  const box=e=>{const r=e.getBoundingClientRect();return{x:r.x,y:r.y,width:r.width,height:r.height,cx:r.x+r.width/2}};
  const root=document.querySelector('[data-compass-root]');
  const scene=document.querySelector('[data-compass-scene]');
  const header=document.querySelector('.compass-estate__header');
  const center=innerWidth/2;
  const cardinals=[...document.querySelectorAll('[data-compass-cardinal]')].map(el=>({
    wing:el.dataset.wing,
    primary:el.dataset.primary==='true',
    readableClass:el.classList.contains('is-readable-cardinal'),
    visible:[...el.querySelectorAll(':scope>span')].some(s=>{const cs=getComputedStyle(s);return cs.visibility!=='hidden'&&Number(cs.opacity)>.5})
  }));
  return{
    viewportCenter:center,
    headerCenterError:header?box(header).cx-center:null,
    scene:scene?box(scene):null,
    sceneCenterError:scene?box(scene).cx-center:null,
    tabletContextPolicy:globalThis.DGB_COMPASS_GEN1591_BOUNDS?.tabletContextPolicy||'',
    focus:root?.dataset.orbitFocus||'',
    phase:root?.dataset.orbitPhase||'',
    primary:cardinals.filter(x=>x.primary).map(x=>x.wing),
    visible:cardinals.filter(x=>x.visible).map(x=>x.wing),
    cardinals,
    labelBinding:globalThis.DGB_COMPASS_LAWS_LABEL_BINDING||null
  };
});

const initial=await snapshot();
if(initial.headerCenterError===null||Math.abs(initial.headerCenterError)>1)throw new Error(`tablet header is not centered ${JSON.stringify(initial)}`);
if(initial.sceneCenterError===null)throw new Error('tablet scene missing');
const requiredTabletSceneCenterError=initial.tabletContextPolicy==='AUDIT_CONTEXT_TEXT_CENTERED_SCENE_COLUMN_PRESERVED'
  ?AUDIT_TABLET_SCENE_CENTER_ERROR
  :LEGACY_TABLET_SCENE_CENTER_ERROR;
const sceneCenterDrift=Math.abs(initial.sceneCenterError-requiredTabletSceneCenterError);
if(sceneCenterDrift>TABLET_SCENE_CENTER_TOLERANCE)throw new Error(`tablet scene column violates declared geometry policy ${JSON.stringify({policy:initial.tabletContextPolicy||'LEGACY_CENTERED',required:requiredTabletSceneCenterError,tolerance:TABLET_SCENE_CENTER_TOLERANCE,after:initial.sceneCenterError,drift:sceneCenterDrift})}`);
if(initial.labelBinding?.observer!==false||!String(initial.labelBinding?.source||'').includes('data-primary'))throw new Error(`settled label authority is not direct controller data-primary presentation ${JSON.stringify(initial.labelBinding)}`);

const scene=page.locator('[data-compass-scene]').first();await scene.scrollIntoViewIfNeeded();await page.waitForTimeout(150);
const b=await scene.boundingBox();if(!b)throw new Error('scene has no bounds');
const cdp=await context.newCDPSession(page);
const p=(x,y)=>[{x,y,radiusX:1,radiusY:1,force:1,id:1}];
const gestures=[
  [0.84,0.50,0.16,0.50],
  [0.50,0.80,0.50,0.20],
  [0.16,0.50,0.84,0.50],
  [0.50,0.20,0.50,0.80]
];
let released=null;
for(const [sx,sy,ex,ey] of gestures){
  const before=await snapshot();
  const x1=b.x+b.width*sx,y1=b.y+b.height*sy,x2=b.x+b.width*ex,y2=b.y+b.height*ey;
  await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:p(x1,y1)});
  for(let i=1;i<=18;i++){const t=i/18;await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:p(x1+(x2-x1)*t,y1+(y2-y1)*t)});await page.waitForTimeout(24)}
  await page.waitForTimeout(100);
  await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
  await page.waitForTimeout(1050);
  const after=await snapshot();
  if(after.phase==='COMMITTED'&&after.focus&&after.focus!==before.focus){released={before,after};break;}
}
if(!released)throw new Error(`controlled release never changed committed cardinal ${JSON.stringify(await snapshot())}`);
const settled=released.after;
if(settled.primary.length!==1||settled.primary[0]!==settled.focus)throw new Error(`controller committed primary mismatch ${JSON.stringify(settled)}`);
if(settled.visible.length!==1||settled.visible[0]!==settled.focus)throw new Error(`committed cardinal is not sole readable label owner ${JSON.stringify(settled)}`);
if(errors.length)throw new Error(`browser errors ${errors.join(' | ')}`);

console.log(JSON.stringify({
  result:'COMPASS_VISIBLE_DELTA_PREMERGE_PASS',
  tablet:{policy:initial.tabletContextPolicy||'LEGACY_CENTERED',requiredSceneCenterError:requiredTabletSceneCenterError,tolerance:TABLET_SCENE_CENTER_TOLERANCE,afterSceneCenterError:initial.sceneCenterError,sceneCenterDrift,headerCenterError:initial.headerCenterError},
  constellation:{outgoing:released.before.focus,settled:settled.focus,incomingVisible:settled.visible[0],soleReadableCount:settled.visible.length,primary:settled.primary[0],phase:settled.phase,labelBinding:settled.labelBinding}
},null,2));
await browser.close();