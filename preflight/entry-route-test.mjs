import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
import {test} from 'node:test';

const read=p=>readFileSync(new URL(p,import.meta.url),'utf8');
const html=read('./index.html');
const script=html.match(/<script>([\s\S]*?)<\/script>/)[1];
for(const suffix of ['/', '/index.html', '/?project=sample#requirements', '/?chamberProject=DIAMONDGATE_PREFLIGHT', '/?next=https://example.com/#keep']){
  test(`main entry preserves supported context: ${suffix}`,()=>{
    const source=new URL('https://diamondgatebridge.com/preflight'+suffix);
    const anchor={};let destination;
    const location={href:source.href,search:source.search,hash:source.hash,replace:value=>{destination=new URL(value);}};
    vm.runInNewContext(script,{URL,window:{location},document:{getElementById:id=>{assert.equal(id,'open-workspace');return anchor;}}});
    assert.equal(destination.origin,source.origin);
    assert.equal(destination.pathname,'/preflight/app/');
    assert.equal(destination.search,source.search);
    assert.equal(destination.hash,source.hash);
    assert.equal(anchor.href,destination.href);
  });
}
test('entry has fallback, no competing form, no storage access or refresh race',()=>{
  assert.match(html,/href="\.\/app\/"/);
  assert.doesNotMatch(html,/<form|<textarea|http-equiv|localStorage|sessionStorage|studio\.js/i);
});
test('first visit starts new work; explicit existing preference survives',()=>{
  const source=read('./app/dist/app.mjs');
  const expression=source.match(/\$\('direction'\)\.value=(db\.entryMode[^;]+);menu\(\);template\(\)/)[1];
  for(const [entryMode,expected] of [[undefined,'start'],['start','start'],['existing','existing']]){
    const db={entryMode,selected:'saved-project',projects:[{id:'saved-project'}]};
    const before=JSON.stringify(db);
    assert.equal(vm.runInNewContext(expression,{db}),expected);
    assert.equal(JSON.stringify(db),before);
  }
});
test('registered entry assertions match actual page',()=>{
  const manifest=JSON.parse(read('../.github/ai-router/publication-surfaces/preflight.v1.json'));
  const check=manifest.checks.find(c=>c.path==='/preflight/index.html');
  for(const token of check.includes)assert.ok(html.includes(token),token);
  for(const token of check.excludes)assert.ok(!html.includes(token),token);
});
