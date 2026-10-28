import assert from 'node:assert/strict';import http from 'node:http';import fs from 'node:fs';import path from 'node:path';import * as engine from '../assets/build/build-engine.v3.mjs';
const matrix=JSON.parse(fs.readFileSync(new URL('../assets/build/build-matrix.v3.json',import.meta.url)));
const confirmed=n=>n.options.filter(o=>o.status==='confirmed'&&!o.exclusive);
// Same-context siblings must produce one question and must not overwrite its answer.
for(const [source,target] of [['PUBLISH','EDITOR'],['PRIVATE_EVENT','PRIVATE_FIELDS'],['FULFILLMENT','PAYMENT'],['PRODUCT_VIEW','VISUAL_ASSETS'],['WORLD','VISUAL_ASSETS']]){
 const state=engine.initial();state.route='TEST';const n=engine.node(matrix,source);let next=engine.applyMulti(matrix,state,n,confirmed(n).filter(o=>o.next===target).map(o=>o.id));assert.equal(next,target,source);
 const q=engine.node(matrix,next),options=confirmed(q);next=q.multi?engine.applyMulti(matrix,state,q,[options[0].id]):engine.applyOption(matrix,state,q,options.find(o=>o.next==='RETURN')||options[0]);
 assert.notEqual(next,target,source+' must advance after one answer');assert.equal(state.records.filter(r=>r.node===target).length,1);
}
// Broad multi-capability paths exercise every intent branch, not only the seven happy paths.
for(const start of Object.keys(matrix.nodes).filter(id=>id.endsWith('.INTENT'))){
 const state=engine.initial();state.route=start.split('.')[0];let next=start,steps=0;const seen=new Set();
 while(next!=='REVIEW'&&steps++<400){const n=engine.node(matrix,next);if(!n){next=engine.nextAfterReturn(matrix,state);continue;}
 const key=engine.recordKey(state,n);assert.ok(!seen.has(key),start+' repeated answered question '+key);seen.add(key);
 if(n.options){const options=confirmed(n);next=n.multi?engine.applyMulti(matrix,state,n,options.map(o=>o.id)):engine.applyOption(matrix,state,n,options.find(o=>o.next==='RETURN')||options[0]||n.options[0]);}
 else next=engine.recordAnswer(matrix,state,n,'Audit detail for '+next);
 }
 assert.equal(next,'REVIEW',start+' terminates');assert.ok(steps<400);
}
// Existing services and actual ordering rules remain separate and have intelligible prompts.
for(const [source,target] of [['EXISTING_SYSTEMS','SYSTEM'],['CATERING_RULES','INPUT.RULES']]){
 const state=engine.initial();state.route='TEST';let next=engine.applyMulti(matrix,state,engine.node(matrix,source),confirmed(matrix.nodes[source]).map(o=>o.id));const prompts=[],values=[];
 while(next===target){const n=engine.node(matrix,next);prompts.push(engine.contextualPrompt(n,state));
 if(target==='SYSTEM'){next=engine.applyOption(matrix,state,n,n.options.find(o=>o.next==='INPUT.SYSTEM'));const input=engine.node(matrix,next);const value='Service '+prompts.length;values.push(value);next=engine.recordAnswer(matrix,state,input,value);}
 else {const value='Rule '+prompts.length;values.push(value);next=engine.recordAnswer(matrix,state,n,value);}}
 assert.equal(prompts.length,confirmed(matrix.nodes[source]).filter(o=>o.next===target).length);assert.equal(new Set(prompts).size,prompts.length);assert.ok(prompts.every(p=>!p.includes('{')));for(const v of values)assert.ok(engine.brief(state,matrix).includes(v));
}

// Partial reuse preserves shared requirements without equating event duration and serving time.
{
 const state=engine.initial();state.route='REST';state.purposePath='rootprivate_event_01';
 engine.applyMulti(matrix,state,engine.node(matrix,'PRIVATE_FIELDS'),['private_fields_01','private_fields_02','private_fields_03','private_fields_04']);
 state.purposePath='rootcatering';const n=engine.node(matrix,'CATERING_FIELDS'),proposal=engine.reusableAnswer(matrix,state,n);
 assert.ok(proposal?.partial);assert.deepEqual(proposal.optionIds,['catering_fields_01','catering_fields_02','catering_fields_04','catering_fields_05']);
 assert.equal(engine.reuseAnswer(matrix,state,n,proposal),null);assert.equal(engine.reusableAnswer(matrix,state,n),null);
 engine.applyMulti(matrix,state,n,['catering_fields_06']);const record=state.records.find(r=>r.node==='CATERING_FIELDS');
 assert.ok(record.reusedFrom);assert.ok(record.optionIds.includes('catering_fields_06'));assert.ok(!record.optionIds.includes('catering_fields_03'),'serving time is not inferred from duration');
 assert.equal(state.records.filter(r=>r.node==='PRIVATE_FIELDS').length,1);
}
// Legacy duplicates are normalized on advancement, without rewriting historical answers.
{
 const state=engine.initial();state.route='REST';state.records=[{key:'REST/rootprivate_event_01/PRIVATE_FIELDS',node:'PRIVATE_FIELDS',purposePath:'rootprivate_event_01',status:'confirmed',label:'Budget range',optionIds:['private_fields_04']}];
 state.queue=[{id:'PRIVATE_FIELDS',purpose:'rootprivate_event_02'},{id:'PRIVATE_FIELDS',purpose:'rootprivate_event_03'}];const before=JSON.stringify(state.records);
 assert.equal(engine.nextAfterReturn(matrix,state),'SH.EXISTING');assert.equal(JSON.stringify(state.records),before);
}
console.log('BUILD_MATRIX_SEMANTIC_QUEUE_REGRESSIONS_PASS');

let puppeteer;try{puppeteer=(await import('puppeteer-core')).default}catch{throw Error('PUPPETEER_CORE_REQUIRED')}
const root=process.cwd(),mime={'.html':'text/html','.js':'text/javascript','.mjs':'text/javascript','.json':'application/json','.css':'text/css'};const server=http.createServer((req,res)=>{let p=new URL(req.url,'http://x').pathname;if(p==='/build/'||p==='/build')p='/build/index.html';const f=path.join(root,p);if(!f.startsWith(root)||!fs.existsSync(f)){res.writeHead(404);return res.end('404')}res.setHeader('content-type',mime[path.extname(f)]||'application/octet-stream');res.end(fs.readFileSync(f))});await new Promise(r=>server.listen(18115,'127.0.0.1',r));const chrome=process.env.CHROME_PATH||process.env.PUPPETEER_EXECUTABLE_PATH;assert.ok(chrome);const browser=await puppeteer.launch({executablePath:chrome,headless:true,args:['--no-sandbox']});
const journeys=[
['restaurant',['Restaurant, food service or hospitality','Restaurant or cafe','Receive catering inquiries','Use these choices','Pickup','Use these choices','Guest count','Use these choices','Start a new website']],
['professional',['Professional practice','Consulting or advisory work','Request an initial consultation','Use these choices','My team reviews requests','Service or appointment type','Use these choices','Start a new website']],
['community',['Community / nonprofit / cause','A volunteer group or cause','Recruit volunteers','Use these choices','Send an interest form for review','Roles they are interested in','Use these choices','Start a new website']],
['commerce',['Online store / product business','Sell physical products','Use these choices','Shipping','Use these choices','A provider selected during scoping','Start a new website']],
['application',['Browser tool / online service','Calculate a price or estimate','Use these choices','An indicative estimate only','A spreadsheet or written rules I have','Start a new website']],
['spatial',['Interactive tour / explorable environment','Explore an imagined world','Use these choices','Explore a limited environment','Use these choices','Drawings or a written concept','Start a new website']],
['help',['Help me identify the right starting point','I provide a service to customers','Work at their home or business','Receive quote requests','Use these choices','Service needed','Use these choices','Start a new website']]];
async function click(page,t){await page.waitForFunction(x=>[...document.querySelectorAll('#build-companion button')].some(b=>b.textContent.trim()===x),{},t);await page.evaluate(x=>[...document.querySelectorAll('#build-companion button')].find(b=>b.textContent.trim()===x).click(),t);await page.waitForFunction(()=>!document.querySelector('.bc-choices').classList.contains('bc-waiting'));}
async function contact(page){for(const v of ['Alex','alex@example.com','8175551234']){await page.waitForSelector('#build-companion input',{visible:true});await page.$eval('#build-companion input',e=>e.value='');await page.type('#build-companion input',v);await click(page,'Continue')}}
for(const [name,steps] of journeys){const page=await browser.newPage();await page.setViewport({width:768,height:1024});await page.goto('http://127.0.0.1:18115/build/',{waitUntil:'networkidle0'});await page.evaluate(()=>sessionStorage.clear());await page.reload({waitUntil:'networkidle0'});await page.evaluate(()=>document.querySelector('[data-open-build-companion],a[href="/build/intake/"]').click());await contact(page);for(const x of steps)await click(page,x);for(const x of ['I already own a domain','I need help preparing it','No fixed deadline'])await click(page,x);const body=await page.$eval('#build-companion',e=>e.innerText);assert.match(body,/I have enough to give Sean a useful picture of the project now/);assert.match(body,/Review what we have/);assert.match(body,/Keep shaping the project/);assert.ok(!body.includes('Who does this website need to serve first?'));assert.ok(!body.includes('What should the website accomplish for them and for you?'));const state=JSON.parse(await page.evaluate(()=>sessionStorage.getItem('dgb-build-companion-v4')));assert.equal(state.sufficiencyOffered,true,name);assert.equal(state.deepMode,false,name);await click(page,'Review what we have');const brief=await page.$eval('.bc-brief',e=>e.textContent);assert.ok(!/context\.route=|SPACE\.INTENT|Open decision: [A-Z]+\./.test(brief));for(const text of ['I already own a domain','I need help preparing it','No fixed deadline'])assert.ok(brief.includes(text),name+': captured '+text);await page.close();}
await browser.close();server.close();console.log('BUILD_COMPANION_V4_SEVEN_SUFFICIENCY_JOURNEYS_PASS');