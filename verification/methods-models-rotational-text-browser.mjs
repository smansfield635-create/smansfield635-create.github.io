import fs from "node:fs";
import puppeteer from "puppeteer-core";

const ORIGIN = process.env.METHODS_MODELS_ORIGIN || "http://127.0.0.1:4173";
const CHROME_PATH = process.env.CHROME_PATH;
const EXECUTION_COMMIT = process.env.EXECUTION_COMMIT || "UNKNOWN";
const route = `${ORIGIN}/laws/research/methods-and-models/`;
if (!CHROME_PATH) throw new Error("CHROME_PATH_REQUIRED");

const html = fs.readFileSync("laws/research/methods-and-models/index.html", "utf8");
const baseJs = fs.readFileSync("laws/research/methods-and-models/showroom.js", "utf8");
const entryJs = fs.readFileSync("laws/research/methods-and-models/showroom-euclidean.js", "utf8");
const entryCss = fs.readFileSync("laws/research/methods-and-models/showroom-euclidean-interaction.css", "utf8");
const orbitJs = fs.readFileSync("laws/research/methods-and-models/rotational-text.js", "utf8");
const orbitCss = fs.readFileSync("laws/research/methods-and-models/rotational-text.css", "utf8");

const sourceAssertions = {
  entryPathStillCanonical: html.includes('data-route="/laws/research/methods-and-models/"'),
  pageContentPreserved: baseJs.includes("451 = 256 + 192 + 3") && baseJs.includes("Pressure / Capacity") && baseJs.includes("Closure / Flow") && baseJs.includes("Method / Falsification"),
  loaderBound: entryJs.includes("rotational-text.js") && entryCss.includes("rotational-text.css"),
  exactCompassReference: orbitJs.includes('R_C_LAWS_COMPASS_SIX_AUTHORITY') && orbitJs.includes('LAWS_COMPASS_EXACT_TWO_OBJECT_FIELD_v2'),
  noGeometryReimplementationAuthority: orbitJs.includes("ADOPT_EXISTING_COMPASS_GEOMETRY_WITHOUT_REIMPLEMENTATION") && orbitJs.includes("ADOPT_EXISTING_COMPASS_MOTION_LAWS_WITHOUT_REDERIVATION"),
  fourPageLocalStates: ["Structural Envelope","Pressure / Capacity","Closure / Flow","Method / Falsification"].every(v => orbitJs.includes(v)),
  directManipulation: orbitJs.includes("pointerdown") && orbitJs.includes("pointermove") && orbitJs.includes("pointerup"),
  keyboardTraversal: ["ArrowRight","ArrowLeft","ArrowDown","ArrowUp","Home","End"].every(v => orbitJs.includes(v)),
  reducedMotion: orbitCss.includes("prefers-reduced-motion:reduce"),
  separateZControlsRemovedFromPresentation: orbitCss.includes(".mm-z-axis-controls{display:none!important}"),
  noCanvasOrWebgl: !/getContext\(|WebGL|THREE\.|three\.js/i.test(orbitJs + orbitCss),
  noCenterContentMass: !/center-content|center-mass-element|center-object/i.test(orbitJs + orbitCss)
};
const sourceFailures = Object.entries(sourceAssertions).filter(([,pass]) => !pass).map(([id]) => id);
if (sourceFailures.length) throw new Error(`ROTATIONAL_TEXT_SOURCE_FAILED:${sourceFailures.join("|")}`);

const browser = await puppeteer.launch({executablePath:CHROME_PATH,headless:true,args:["--no-sandbox","--disable-dev-shm-usage"]});
const profiles = [];

const PROFILE_SET = [
  ["DESKTOP",{width:1440,height:1000}],
  ["TABLET",{width:900,height:1100}],
  ["MOBILE",{width:390,height:844}]
];

async function waitReady(page){
  await page.waitForFunction(() => document.documentElement.dataset.mmRotationalTextStatus === "ready", {timeout:15000});
}

async function state(page){
  return page.evaluate(() => {
    const orbit=document.querySelector("[data-mm-family-tabs]");
    const tabs=[...orbit.querySelectorAll(".mm-family-tab")];
    const selected=tabs.findIndex(t=>t.getAttribute("aria-selected")==="true");
    const selectedTab=tabs[selected];
    const z=document.querySelector(".mm-z-axis-controls");
    const activeCard=document.querySelector('.mm-model-card[data-position="active"]');
    return {
      status:document.documentElement.dataset.mmRotationalTextStatus,
      active:document.documentElement.dataset.mmRotationalTextActive,
      family:document.body.dataset.mmFamily,
      tabCount:tabs.length,
      selectedCount:tabs.filter(t=>t.getAttribute("aria-selected")==="true").length,
      selected,
      selectedText:selectedTab?.textContent.trim()||"",
      selectedVector:selectedTab?.dataset.mmOrbitVector||"",
      selectedDepth:selectedTab?.dataset.mmOrbitDepth||"",
      reference:orbit.dataset.mmCompassReference,
      authorityField:orbit.dataset.mmCompassAuthorityField,
      geometryDisposition:orbit.dataset.mmCompassGeometryDisposition,
      physicsDisposition:orbit.dataset.mmCompassPhysicsDisposition,
      zDisplay:z?getComputedStyle(z).display:"missing",
      orbitRole:orbit.getAttribute("aria-roledescription"),
      horizontalOverflow:document.documentElement.scrollWidth-innerWidth,
      canvasCount:document.querySelectorAll("canvas").length,
      activeCardInert:Boolean(activeCard?.inert),
      activeCardHidden:activeCard?.getAttribute("aria-hidden"),
      viewport:{width:innerWidth,height:innerHeight},
      tabRects:tabs.map(t=>{const r=t.getBoundingClientRect();return {left:r.left,right:r.right,top:r.top,bottom:r.bottom,width:r.width,height:r.height};})
    };
  });
}

async function waitSelected(page,index){
  await page.waitForFunction(i => {
    const tabs=[...document.querySelectorAll("[data-mm-family-tabs] .mm-family-tab")];
    return tabs[i]?.getAttribute("aria-selected")==="true" && document.documentElement.dataset.mmRotationalTextActive===String(i);
  },{},index);
}

async function verifyProfile(profile, viewport){
  const page=await browser.newPage();
  await page.setViewport(viewport);
  await page.goto(route,{waitUntil:"networkidle0",timeout:45000});
  await waitReady(page);
  const failures=[];
  const initial=await state(page);
  if(initial.status!=="ready"||initial.tabCount!==4||initial.selectedCount!==1||initial.selected!==0) failures.push("initial_semantic_state");
  if(initial.reference!=="R_C_LAWS_COMPASS_SIX_AUTHORITY"||initial.authorityField!=="LAWS_COMPASS_EXACT_TWO_OBJECT_FIELD_v2") failures.push("compass_reference_identity");
  if(initial.geometryDisposition!=="ADOPT_EXISTING_COMPASS_GEOMETRY_WITHOUT_REIMPLEMENTATION"||initial.physicsDisposition!=="ADOPT_EXISTING_COMPASS_MOTION_LAWS_WITHOUT_REDERIVATION") failures.push("adoption_boundary");
  if(initial.selectedVector!=="0,1,0"||initial.selectedDepth!=="front") failures.push("front_cardinal_binding");
  if(initial.zDisplay!=="none") failures.push("legacy_z_controls_visible");
  if(initial.orbitRole!=="rotational tab navigation") failures.push("semantic_role");
  if(initial.horizontalOverflow>2) failures.push("horizontal_overflow");
  if(initial.canvasCount!==0) failures.push("unexpected_canvas");
  if(initial.activeCardInert||initial.activeCardHidden==="true") failures.push("active_content_inert");
  if(initial.tabRects.some(r=>r.left < -3 || r.right > viewport.width+3)) failures.push("tab_horizontal_containment");

  await page.click('[data-mm-family-tabs] .mm-family-tab:nth-child(2)');
  await waitSelected(page,1);
  const clicked=await state(page);
  if(clicked.selectedText!=="Pressure / Capacity"||clicked.family!=="pressure"||clicked.selectedVector!=="0,1,0") failures.push("click_state_binding");

  await page.focus('[data-mm-family-tabs] .mm-family-tab[aria-selected="true"]');
  await page.keyboard.press("ArrowRight");
  await waitSelected(page,2);
  const keyed=await state(page);
  if(keyed.selectedText!=="Closure / Flow"||keyed.family!=="closure") failures.push("keyboard_state_binding");

  for(let i=0;i<4;i++){
    await page.focus('[data-mm-family-tabs] .mm-family-tab[aria-selected="true"]');
    await page.keyboard.press("ArrowRight");
  }
  await waitSelected(page,2);
  const returned=await state(page);
  if(returned.selectedText!=="Closure / Flow"||returned.family!=="closure") failures.push("exact_four_step_return");

  const orbit=await page.$("[data-mm-family-tabs]");
  const box=await orbit.boundingBox();
  await page.mouse.move(box.x+box.width*.72,box.y+box.height*.5);
  await page.mouse.down();
  await page.mouse.move(box.x+box.width*.28,box.y+box.height*.5,{steps:8});
  await page.mouse.up();
  await waitSelected(page,3);
  const dragged=await state(page);
  if(dragged.selectedText!=="Method / Falsification"||dragged.family!=="method") failures.push("pointer_drag_state_binding");

  await page.emulateMediaFeatures([{name:"prefers-reduced-motion",value:"reduce"}]);
  await page.reload({waitUntil:"networkidle0"});
  await waitReady(page);
  await page.focus('[data-mm-family-tabs] .mm-family-tab[aria-selected="true"]');
  await page.keyboard.press("ArrowRight");
  await waitSelected(page,1);
  const reduced=await page.evaluate(() => ({
    selected:[...document.querySelectorAll("[data-mm-family-tabs] .mm-family-tab")].findIndex(t=>t.getAttribute("aria-selected")==="true"),
    transition:getComputedStyle(document.querySelector("[data-mm-family-tabs] .mm-family-tab")).transitionDuration,
    family:document.body.dataset.mmFamily
  }));
  if(reduced.selected!==1||reduced.family!=="pressure") failures.push("reduced_motion_semantic_equivalence");

  profiles.push({profile,viewport,initial,clicked,keyed,returned,dragged,reduced,failures});
  await page.close();
  return failures;
}

const failures=[];
for(const [name,viewport] of PROFILE_SET){
  for(const failure of await verifyProfile(name,viewport)) failures.push(`${name}:${failure}`);
}
await browser.close();

const receipt={
  schema:"METHODS_MODELS_ROTATIONAL_TEXT_BROWSER_QUALIFICATION_RECEIPT_v1",
  executionCommit:EXECUTION_COMMIT,
  sourceAssertions,
  inheritedReference:"R_C_LAWS_COMPASS_SIX_AUTHORITY",
  classId:"ROTATIONAL_TEXT_INFORMATION_INSTRUMENT",
  pageLocalBinding:true,
  compassGeometryReimplemented:false,
  centerContentMassRequired:false,
  profiles,
  result:failures.length?"FAIL":"PASS",
  failures
};
fs.writeFileSync("methods-models-rotational-text-browser.json",JSON.stringify(receipt,null,2)+"\n");
console.log(JSON.stringify(receipt,null,2));
if(failures.length) process.exit(1);
