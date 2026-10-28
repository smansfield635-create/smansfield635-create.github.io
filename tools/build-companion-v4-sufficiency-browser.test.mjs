import assert from 'node:assert/strict';import http from 'node:http';import fs from 'node:fs';import path from 'node:path';import * as engine from '../assets/build/build-engine.v3.mjs?v=7';
const matrix=JSON.parse(fs.readFileSync(new URL('../assets/build/build-matrix.v3.json',import.meta.url)));
const confirmed=n=>n.options.filter(o=>o.status==='confirmed'&&!o.exclusive);
// Same-context siblings must produce one question and must not overwrite its answer.
for(const [source,target] of [['PUBLISH','EDITOR'],['PRIVATE_EVENT','PRIVATE_FIELDS'],['FULFILLMENT','PAYMENT'],['PRODUCT_VIEW','VISUAL_ASSETS'],['WORLD','VISUAL_ASSETS']]){
 const state=engine.initial();state.route='TEST';state.deepMode=true;const n=engine.node(matrix,source);let next=engine.applyMulti(matrix,state,n,confirmed(n).filter(o=>o.next===target).map(o=>o.id));assert.equal(next,target,source);
 const q=engine.node(matrix,next),options=confirmed(q);next=q.multi?engine.applyMulti(matrix,state,q,[options[0].id]):engine.applyOption(matrix,state,q,options.find(o=>o.next==='RETURN')||options[0]);
 assert.notEqual(next,target,source+' must advance after one answer');assert.equal(state.records.filter(r=>r.node===target).length,1);
}
// Broad multi-capability paths exercise every intent branch, not only the seven happy paths.
for(const start of Object.keys(matrix.nodes).filter(id=>id.endsWith('.INTENT'))){
 const state=engine.initial();state.route=start.split('.')[0];state.deepMode=true;let next=start,steps=0;const seen=new Set();
 while(next!=='REVIEW'&&steps++<400){const n=engine.node(matrix,next);if(!n){next=engine.nextAfterReturn(matrix,state);continue;}
 const key=engine.recordKey(state,n);assert.ok(!seen.has(key),start+' repeated answered question '+key);seen.add(key);
 if(n.options){const options=confirmed(n);next=n.multi?engine.applyMulti(matrix,state,n,options.map(o=>o.id)):engine.applyOption(matrix,state,n,options.find(o=>o.next==='RETURN')||options[0]||n.options[0]);}
 else next=engine.recordAnswer(matrix,state,n,'Audit detail for '+next);
 }
 assert.equal(next,'REVIEW',start+' terminates');assert.ok(steps<400);
}
// Existing services and actual ordering rules remain separate and have intelligible prompts.
for(const [source,target] of [['EXISTING_SYSTEMS','SYSTEM'],['CATERING_RULES','INPUT.RULES']]){
 const state=engine.initial();state.route='TEST';state.deepMode=true;let next=engine.applyMulti(matrix,state,engine.node(matrix,source),confirmed(matrix.nodes[source]).map(o=>o.id));const prompts=[],values=[];
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
['restaurant',['Restaurant, food service or hospitality','Restaurant or cafe','Receive catering inquiries','Use these choices','Start a new website']],
['professional',['Professional practice','Consulting or advisory work','Request an initial consultation','Use these choices','Start a new website']],
['community',['Community / nonprofit / cause','A volunteer group or cause','Recruit volunteers','Use these choices','Start a new website']],
['commerce',['Online store / product business','Sell physical products','Use these choices','Start a new website']],
['application',['Browser tool / online service','Calculate a price or estimate','Use these choices','Start a new website']],
['spatial',['Interactive tour / explorable environment','Explore an imagined world','Use these choices','Start a new website']],
['help',['Help me identify the right starting point','I provide a service to customers','Work at their home or business','Receive quote requests','Use these choices','Start a new website']]];
async function click(page,t){await page.waitForFunction(x=>[...document.querySelectorAll('#build-companion button')].some(b=>b.textContent.trim()===x),{},t);await page.evaluate(x=>[...document.querySelectorAll('#build-companion button')].find(b=>b.textContent.trim()===x).click(),t);await page.waitForFunction(()=>!document.querySelector('.bc-choices').classList.contains('bc-waiting'));}
for(const [name,steps] of journeys){const page=await browser.newPage();await page.setViewport({width:768,height:1024});await page.goto('http://127.0.0.1:18115/build/',{waitUntil:'networkidle0'});await page.evaluate(()=>sessionStorage.clear());await page.reload({waitUntil:'networkidle0'});await page.evaluate(()=>document.querySelector('[data-open-build-companion],a[href="/build/intake/"]').click());for(const x of steps)await click(page,x);for(const x of ['I already own a domain','I need help preparing it','No fixed deadline'])await click(page,x);const body=await page.$eval('#build-companion',e=>e.innerText);assert.match(body,/I have enough to outline your website now/);assert.match(body,/Review what we have/);assert.match(body,/Keep shaping the project/);assert.ok(!body.includes('Who does this website need to serve first?'));assert.ok(!body.includes('What should the website accomplish for them and for you?'));const state=JSON.parse(await page.evaluate(()=>sessionStorage.getItem('dgb-build-companion-v4')));assert.equal(state.sufficiencyOffered,true,name);assert.equal(state.deepMode,false,name);assert.ok(!state.contact?.name&&!state.contact?.email,'no identity collection during discovery');assert.ok(state.queue.length>0||state.sharedIndex>0,'detailed requests remain available');await click(page,'Review what we have');const brief=await page.$eval('.bc-brief',e=>e.textContent);assert.ok(!/context\.route=|SPACE\.INTENT|Open decision: [A-Z]+\./.test(brief));for(const text of ['I already own a domain','I need help preparing it','No fixed deadline'])assert.ok(brief.includes(text),name+': captured '+text);await page.close();}
// In a redesign, requests for reservations do not imply appointment software.
// The companion must offer an early proposal while preserving detailed questions.
{
 const page=await browser.newPage();await page.goto('http://127.0.0.1:18115/build/',{waitUntil:'networkidle0'});
 await page.evaluate(()=>document.querySelector('[data-open-build-companion],a[href="/build/intake/"]').click());
 for(const t of ['Restaurant, food service or hospitality','Restaurant or cafe','Receive table reservation requests','Use these choices','Replace or redesign my current website','Its domain name','Existing ordering or reservation platforms','Use these choices','I need help preparing it','No fixed deadline'])await click(page,t);
 const state=JSON.parse(await page.evaluate(()=>sessionStorage.getItem('dgb-build-companion-v4')));
 assert.equal(state.sufficiencyOffered,true,'redesign has concise first-pass sufficiency');
 assert.ok(state.queue.some(x=>x.id==='RESERVATION'),'reservation handling is retained for optional detail');
 await click(page,'Review what we have');
 const summary=await page.$eval('.bc-brief',e=>e.textContent);
 assert.match(summary,/Confirm how table reservation requests will be handled/);
 assert.ok(!summary.includes('Booking or appointments'));
 await click(page,'Explore additional details');
 assert.match(await page.$eval('#build-companion',e=>e.innerText),/How do you handle table reservations/);
 await click(page,'We review requests ourselves');
 assert.ok(!await page.$eval('#build-companion',e=>e.innerText).then(x=>x.includes('Which existing services need to stay connected?')));
 await page.close();
}
// A terminal review with no unanswered questions must not offer a no-op
// continuation that routes back to the same screen indefinitely.
{
 const page=await browser.newPage();await page.goto('http://127.0.0.1:18115/build/',{waitUntil:'networkidle0'});
 await page.evaluate(()=>{
  sessionStorage.setItem('dgb-build-companion-v4',JSON.stringify({
   cursor:'REVIEW',view:'review',route:'REST',purposePath:'root',queue:[],sharedIndex:99,
   records:[],history:[],sufficiencyOffered:false,deepMode:false,
   contact:{name:'',email:'',phone:''}
  }));
 });await page.reload({waitUntil:'networkidle0'});
 await page.evaluate(()=>document.querySelector('[data-open-build-companion],a[href="/build/intake/"]').click());
 const actions=await page.$eval('#build-companion',e=>[...e.querySelectorAll('.bc-review-actions button')].map(x=>x.textContent));
 assert.ok(!actions.includes('Continue discovery'),'terminal review cannot loop to itself');
 assert.ok(!actions.includes('Explore additional details'),'no fabricated detail branch');
 assert.ok(actions.includes('Prepare email inquiry'),'inquiry remains available');
 await page.close();
}
await browser.close();server.close();console.log('BUILD_COMPANION_V4_SEVEN_SUFFICIENCY_JOURNEYS_PASS');