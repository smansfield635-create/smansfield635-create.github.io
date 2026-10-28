import assert from 'node:assert/strict';import http from 'node:http';import fs from 'node:fs';import path from 'node:path';import {pathToFileURL} from 'node:url';
let puppeteer;try{puppeteer=(await import('puppeteer-core')).default}catch{throw Error('PUPPETEER_CORE_REQUIRED')}
const root=process.cwd(),mime={'.html':'text/html','.js':'text/javascript','.mjs':'text/javascript','.json':'application/json','.css':'text/css'};
const server=http.createServer((req,res)=>{let p=new URL(req.url,'http://x').pathname;if(p==='/build/'||p==='/build')p='/build/index.html';const f=path.join(root,p);if(!f.startsWith(root)||!fs.existsSync(f)){res.writeHead(404);return res.end('404')}res.setHeader('content-type',mime[path.extname(f)]||'application/octet-stream');res.end(fs.readFileSync(f))});await new Promise(r=>server.listen(18113,'127.0.0.1',r));
const chrome=process.env.CHROME_PATH||process.env.PUPPETEER_EXECUTABLE_PATH;assert.ok(chrome,'CHROME_PATH required');const browser=await puppeteer.launch({executablePath:chrome,headless:true,args:['--no-sandbox']});
const journeys=[
 {
  name:'restaurant',
  first:['Restaurant, food service or hospitality','Restaurant or cafe','Receive catering inquiries','Use these choices'],
  deep:['Delivery','Use these choices','I decide based on the event'],
  prompts:['Which guest business are we describing?','Beyond the starting essentials, what should this website help people do?','Which catering services do you actually offer?','How should the website describe your delivery coverage?','What should event hosts include in a catering inquiry?']
 },
 {
  name:'professional',
  first:['Professional practice','Consulting or advisory work','Request an initial consultation','Use these choices'],
  deep:['My team reviews requests'],
  prompts:['What kind of practice is this for?','Beyond the starting essentials, what should this website help people do?','How should appointment requests work?','What should the appointment request include?']
 },
 {
  name:'commerce',
  first:['Online store / product business','Sell physical products','Use these choices'],
  deep:['Shipping','Use these choices','A provider selected during scoping'],
  prompts:['Beyond the starting essentials, what should this website help people do?','How will customers receive physical products?']
 },
 {
  name:'application',
  first:['Browser tool / online service','Calculate a price or estimate','Use these choices'],
  deep:['An indicative estimate only','A spreadsheet or written rules I have'],
  prompts:['Beyond the starting essentials, what should this website help people do?','What does the calculator return?']
 },
 {
  name:'spatial',
  first:['Interactive tour / explorable environment','Explore an imagined world','Use these choices'],
  deep:['Explore a limited environment','Use these choices','Drawings or a written concept'],
  prompts:['Beyond the starting essentials, what should this website help people do?','What should visitors do in the first version of the world?']
 }
];
async function clickText(page,label){
 await page.waitForFunction(t=>[...document.querySelectorAll('#build-companion button')].some(b=>b.textContent.trim()===t),{},label);
 await page.evaluate(t=>[...document.querySelectorAll('#build-companion button')].find(b=>b.textContent.trim()===t).click(),label);
 await page.waitForFunction(()=>!document.querySelector('.bc-choices').classList.contains('bc-waiting'));
}
for(const journey of journeys){
 const page=await browser.newPage();
 await page.setViewport({width:768,height:1024});
 await page.goto('http://127.0.0.1:18113/build/',{waitUntil:'networkidle0'});
 await page.evaluate(()=>document.querySelector('[data-open-build-companion],a[href="/build/intake/"]').click());
 await page.waitForFunction(()=>!document.querySelector('.bc-choices').classList.contains('bc-waiting'));
 assert.equal(await page.$('#build-companion input'),null,journey.name+': discovery must start before contact');
 for(const action of [...journey.first,'Start a new website','I already own a domain','I need help preparing it','No fixed deadline'])await clickText(page,action);
 const first=await page.$eval('#build-companion',e=>e.innerText);
 assert.match(first,/I have enough to outline your website now/,journey.name+': stop when sufficient');
 assert.match(first,/Review what we have/,journey.name+': proposal review');
 assert.match(first,/Keep shaping the project/,journey.name+': optional deeper exploration');
 const state=await page.evaluate(()=>JSON.parse(sessionStorage.getItem('dgb-build-companion-v4')));
 assert.equal(state.deepMode,false,journey.name+': first pass is not forced deep discovery');
 assert.ok(!state.contact?.name&&!state.contact?.email,journey.name+': no contact in first pass');
 assert.ok(state.queue.length>0,journey.name+': deeper work remains queued');
 await clickText(page,'Review what we have');
 const brief=await page.$eval('.bc-brief',e=>e.textContent);
 assert.match(brief,/Proposed website/,journey.name+': synthesized proposal exists');
 assert.ok(!brief.includes('context.route='),journey.name+': no internal keys in proposal');
 await clickText(page,'Explore additional details');
 for(const action of journey.deep)await clickText(page,action);
 const current=await page.evaluate(()=>JSON.parse(sessionStorage.getItem('dgb-build-companion-v4')));
 const transcript=(current.history||[]).map(x=>x.text).join('\\n');
 for(const prompt of journey.prompts)assert.ok(transcript.includes(prompt),journey.name+' did not ask '+prompt);
 for(const bad of ['In a sentence, what is the organization','Who does this website need to serve first?','What should the website accomplish for them and for you?'])assert.ok(!transcript.includes(bad),journey.name+' unrequested generic prompt '+bad);
 assert.equal(current.deepMode,true,journey.name+': deep path chosen voluntarily');
 assert.ok(current.records.length>=state.records.length,journey.name+': collected answers preserved');
 await page.close();
}
await browser.close();server.close();console.log('BUILD_MATRIX_V3_ADAPTIVE_AND_DEEP_BROWSER_JOURNEYS_PASS');