import assert from 'node:assert/strict';import http from 'node:http';import fs from 'node:fs';import path from 'node:path';let puppeteer;try{puppeteer=(await import('puppeteer-core')).default}catch{throw Error('PUPPETEER_CORE_REQUIRED')}
const root=process.cwd(),mime={'.html':'text/html','.js':'text/javascript','.mjs':'text/javascript','.json':'application/json','.css':'text/css'};const server=http.createServer((req,res)=>{let p=new URL(req.url,'http://x').pathname;if(p==='/build/'||p==='/build')p='/build/index.html';const f=path.join(root,p);if(!f.startsWith(root)||!fs.existsSync(f)){res.writeHead(404);return res.end('404')}res.setHeader('content-type',mime[path.extname(f)]||'application/octet-stream');res.end(fs.readFileSync(f))});await new Promise(r=>server.listen(18114,'127.0.0.1',r));const chrome=process.env.CHROME_PATH||process.env.PUPPETEER_EXECUTABLE_PATH;assert.ok(chrome);const browser=await puppeteer.launch({executablePath:chrome,headless:true,args:['--no-sandbox']});
const page=await browser.newPage();await page.setViewport({width:768,height:1024});await page.goto('http://127.0.0.1:18114/build/',{waitUntil:'networkidle0'});await page.evaluate(()=>document.querySelector('[data-open-build-companion],a[href="/build/intake/"]').click());
const body=()=>page.$eval('#build-companion',e=>e.innerText);const input=()=>page.$('#build-companion input');async function set(v){const x=await input();await x.click({clickCount:3});await x.type(v)}async function cont(){await page.evaluate(()=>[...document.querySelectorAll('#build-companion button')].find(b=>b.textContent.trim()==='Continue').click());await page.waitForFunction(()=>!document.querySelector('.bc-choices').classList.contains('bc-waiting'));}async function click(t){await page.waitForFunction(x=>[...document.querySelectorAll('#build-companion button')].some(b=>b.textContent.trim()===x),{},t);await page.evaluate(x=>[...document.querySelectorAll('#build-companion button')].find(b=>b.textContent.trim()===x).click(),t);await page.waitForFunction(()=>!document.querySelector('.bc-choices').classList.contains('bc-waiting'));}
assert.equal(await page.$eval('.bc-pending',e=>e.hidden),false,'typing status precedes first question');assert.equal(await page.$eval('.bc-choices',e=>getComputedStyle(e).display),'none','choices wait for the response');await page.waitForFunction(()=>!document.querySelector('.bc-choices').classList.contains('bc-waiting'));assert.match(await body(),/Diamond Gate Build companion/);assert.match(await body(),/Who am I speaking with\?/);assert.equal(await page.$eval('#build-companion input',e=>e.getAttribute('aria-label')),'Your name');
await set('A');await cont();assert.match(await body(),/at least two characters/);await set('Alex');await cont();assert.match(await body(),/best email/);assert.equal(await page.$eval('#build-companion input',e=>e.getAttribute('aria-label')),'Your email');
await set('x@x');await cont();assert.match(await body(),/email looks incomplete/);await set('alex@example.com');await cont();assert.match(await body(),/10-digit phone/);assert.equal(await page.$eval('#build-companion input',e=>e.getAttribute('aria-label')),'Your phone');
await set('5551234');await cont();assert.match(await body(),/full 10-digit/);await set('8175551234');await cont();assert.match(await body(),/What kind of business or project is this website for\?/);
await click('Community / nonprofit / cause');assert.match(await body(),/What brings your organization together\?/);await click('A volunteer group or cause');assert.match(await body(),/Beyond the starting essentials/);
const stored=await page.evaluate(()=>sessionStorage.getItem('dgb-build-companion-v4'));assert.ok(stored&&stored.includes('alex@example.com')&&stored.includes('(817) 555-1234'));
await page.reload({waitUntil:'networkidle0'});await page.evaluate(()=>document.querySelector('[data-open-build-companion],a[href="/build/intake/"]').click());const resumed=await body();assert.ok(!resumed.endsWith('Who am I speaking with?'));assert.ok(!resumed.includes('In a sentence, what is the organization'));
const originalHistory=JSON.parse(stored).history;
const readHistory=()=>page.evaluate(()=>JSON.parse(sessionStorage.getItem('dgb-build-companion-v4')).history);
assert.deepEqual(await readHistory(),originalHistory,'reloading did not mutate stored history');
const bubbles=await page.evaluate(()=>[...document.querySelectorAll('#build-companion .bc-bubble')].map(e=>e.textContent));assert.equal(bubbles.length,originalHistory.length,'no duplicate transcript bubbles');
await page.click('#build-companion .bc-close');
const reopen=()=>page.evaluate(()=>document.querySelector('[data-open-build-companion],a[href="/build/intake/"]').click());
await reopen();assert.deepEqual(await readHistory(),originalHistory,'close and reopen preserve stored history');assert.deepEqual(await page.evaluate(()=>[...document.querySelectorAll('#build-companion .bc-bubble')].map(e=>e.textContent)),bubbles);
await page.waitForFunction(()=>{const b=document.querySelector('.bc-body'),q=document.querySelector('.bc-log .bc-bubble:last-child');return q.getBoundingClientRect().top>=b.getBoundingClientRect().top-1&&q.getBoundingClientRect().top<b.getBoundingClientRect().bottom;});
await page.click('#build-companion [data-review]');await click('Prepare email draft');
assert.equal(await page.$eval('#build-companion .bc-email-draft',e=>e.getAttribute('aria-label')),'Email draft');
await page.$eval('#build-companion .bc-email-draft',e=>{e.value='Edited by the visitor after discovery';e.dispatchEvent(new Event('input',{bubbles:true}));});
assert.match(await page.$eval('#build-companion a[href^="mailto:"]',e=>e.href),/Edited%20by%20the%20visitor/);
await page.click('#build-companion .bc-close');await page.reload({waitUntil:'networkidle0'});await reopen();
assert.equal(await page.$eval('#build-companion .bc-email-draft',e=>e.value),'Edited by the visitor after discovery');
assert.deepEqual(await readHistory(),originalHistory,'draft editing and reload preserve stored history');
await click('Cancel email draft');assert.equal(await page.evaluate(()=>document.querySelectorAll('#build-companion .bc-email-draft').length),0);
assert.equal(await page.evaluate(()=>document.querySelectorAll('#build-companion a[href^="mailto:"]').length),0);
assert.equal(await page.evaluate(()=>Object.hasOwn(JSON.parse(sessionStorage.getItem('dgb-build-companion-v4')),'emailDraft')),false);
await click('Prepare email draft');assert.match(await page.$eval('#build-companion .bc-email-draft',e=>e.value),/Hello Sean,/);
await page.click('#build-companion [data-reset]');
assert.equal(await page.$eval('.bc-pending',e=>e.hidden),false);
await page.click('#build-companion .bc-close');
const resetHistory=await readHistory();await reopen();
assert.deepEqual(await readHistory(),resetHistory,'closing a pending turn preserves history');
assert.equal(await page.$eval('.bc-pending',e=>e.hidden),true,'reopen does not replay typing');
await page.emulateMediaFeatures([{name:'prefers-reduced-motion',value:'reduce'}]);
await page.click('#build-companion [data-reset]');
await page.waitForFunction(()=>!document.querySelector('.bc-choices').classList.contains('bc-waiting'),{timeout:1000});
assert.equal(await page.$eval('#build-companion input',e=>e.getAttribute('aria-label')),'Your name');

// Reproduce the owner-observed private-event repetition with all compatible offers.
await page.click('#build-companion .bc-close');
await page.evaluate(()=>{sessionStorage.setItem('dgb-build-companion-v4',JSON.stringify({cursor:'PRIVATE_EVENT',route:'REST',purposePath:'root',queue:[],records:[],history:[],sharedIndex:0,contact:{name:'Alex',email:'alex@example.com',phone:'8175551234'},deepMode:true}));});
await page.reload({waitUntil:'networkidle0'});await reopen();
for(const label of ['A private room or event space','Exclusive use of the venue','Space with food or catering'])await click(label);
await click('Use these choices');
for(const label of ['Occasion and guest count','Date and duration','Food or drink needs','Budget range'])await click(label);
await click('Use these choices');
assert.match(await body(),/Are we starting fresh or changing a website/);
const eventHistory=await readHistory();assert.equal(eventHistory.filter(x=>x.role==='host'&&x.text.includes('What should the event inquiry include?')).length,1,'event inquiry is asked once');
const eventState=await page.evaluate(()=>sessionStorage.getItem('dgb-build-companion-v4'));
await page.click('#build-companion .bc-close');await reopen();
assert.equal(await page.evaluate(()=>sessionStorage.getItem('dgb-build-companion-v4')),eventState,'reopen preserves records and queue as well as transcript');

await browser.close();server.close();console.log('BUILD_COMPANION_V4_CONTACT_CONVERSATION_R3_PASS');