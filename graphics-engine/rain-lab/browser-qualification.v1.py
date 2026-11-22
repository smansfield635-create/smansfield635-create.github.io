#!/usr/bin/env python3
"""Exact-candidate browser qualification. Real WebGL framebuffers only; fail closed.
Requires: pip install playwright; playwright install chromium.
Execute from repository root. Does not publish, merge or mutate the website.
"""
import argparse, hashlib, http.server, json, pathlib, sys, threading
from playwright.sync_api import sync_playwright

def run(root, out):
    out.mkdir(parents=True,exist_ok=True)
    class Handler(http.server.SimpleHTTPRequestHandler):
        def __init__(self,*a,**k): super().__init__(*a,directory=str(root),**k)
        def log_message(self,*a): pass
    server=http.server.ThreadingHTTPServer(('127.0.0.1',0),Handler)
    thread=threading.Thread(target=server.serve_forever,daemon=True);thread.start()
    url=f'http://127.0.0.1:{server.server_port}/graphics-engine/rain-lab/index.html'
    records=[];failed=False
    try:
        with sync_playwright() as p:
            browser=p.chromium.launch(headless=True,args=[
                '--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader',
                '--enable-webgl','--no-sandbox'
            ])
            try:
                for label,width,height in [('phone',390,844),('tablet',1024,768),('desktop',1440,900)]:
                    page=browser.new_page(viewport={'width':width,'height':height},device_scale_factor=1)
                    errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
                    record={'viewport':label,'width':width,'height':height}
                    try:
                        page.goto(url,wait_until='domcontentloaded',timeout=25000)
                        page.wait_for_function('window.__DGB_RAIN_LAB__ !== undefined',timeout=18000)
                        page.wait_for_timeout(300)
                        a=page.evaluate('''()=>({state:window.__DGB_RAIN_LAB__?.inspect?.(),pixels:window.__DGB_RAIN_LAB__?.readback?.(),error:window.__DGB_RAIN_LAB__?.error??null,overflow:document.documentElement.scrollWidth>innerWidth})''')
                        record['native']=a
                        assert not a['error'],f'NATIVE_CONTEXT_UNAVAILABLE:{a["error"]}'
                        assert a['state']['frames']>0,'NO_NATIVE_FRAMES'
                        assert a['pixels']['pixels']>0 and a['pixels']['glError']==0,'NO_VALID_FRAMEBUFFER'
                        assert a['state']['field']['total']==635,'WRONG_DROP_POPULATION'
                        assert a['state']['lastFrame']['executed']==4,'E2_DRAW_PASSES_MISSING'
                        assert not a['overflow'],'HORIZONTAL_OVERFLOW'
                        page.locator('.chapter').nth(0).locator('summary').first.click()
                        assert page.locator('.chapter').nth(0).evaluate('(x)=>x.open')
                        page.locator('.chapter').nth(1).locator('summary').first.click()
                        assert page.locator('.chapter').nth(1).evaluate('(x)=>x.open')
                        assert not page.locator('.chapter').nth(0).evaluate('(x)=>x.open')
                        page.locator('.chapter').nth(2).locator('summary').first.click()
                        page.screenshot(path=str(out/f'{label}.png'),full_page=True)
                        record['screenshotSha256']=hashlib.sha256((out/f'{label}.png').read_bytes()).hexdigest()
                        record['errors']=errors;record['passed']=len(errors)==0
                    except Exception as exc:
                        record['passed']=False;record['error']=str(exc);failed=True
                    finally: page.close()
                    records.append(record)
                page=browser.new_page(viewport={'width':390,'height':844},reduced_motion='reduce')
                try:
                    page.goto(url,wait_until='domcontentloaded',timeout=25000)
                    page.wait_for_function('window.__DGB_RAIN_LAB__ !== undefined',timeout=18000)
                    page.wait_for_timeout(250)
                    reduced=page.evaluate('''()=>({frames:window.__DGB_RAIN_LAB__?.inspect?.()?.frames,error:window.__DGB_RAIN_LAB__?.error})''')
                    records.append({'control':'reduced_motion','result':reduced,'passed':bool(reduced['frames'] and not reduced['error'])})
                except Exception as exc: failed=True;records.append({'control':'reduced_motion','passed':False,'error':str(exc)})
                finally: page.close()
                page=browser.new_page(viewport={'width':390,'height':844})
                page.add_init_script('''HTMLCanvasElement.prototype.getContext=function(kind){if(kind==='webgl'||kind==='webgl2')return null;return undefined;}''')
                try:
                    page.goto(url,wait_until='domcontentloaded',timeout=25000)
                    page.wait_for_function('window.__DGB_RAIN_LAB__ !== undefined',timeout=18000)
                    fallback=page.evaluate('''()=>({hidden:document.querySelector('#rain').hidden,error:window.__DGB_RAIN_LAB__?.error})''')
                    ok=bool(fallback['hidden'] and fallback['error'])
                    records.append({'control':'no_webgl_fallback','result':fallback,'passed':ok})
                    if not ok:failed=True
                except Exception as exc:failed=True;records.append({'control':'no_webgl_fallback','passed':False,'error':str(exc)})
                finally:page.close()
            finally: browser.close()
    finally:server.shutdown()
    for entry in records:
        if not entry.get('passed'):failed=True
    report={'schema':'DGB_SPATIAL_RAIN_BROWSER_QUALIFICATION_v1','result':'FAIL_CLOSED' if failed else 'REAL_WEBGL_RENDER_PASS_VISUAL_ACCEPTANCE_PENDING',
            'tests':records,'realFramebufferRequired':True,'visualAcceptance':False,'productionIntegration':False,'published':False}
    (out/'browser-qualification.json').write_text(json.dumps(report,indent=2)+'\n')
    return 1 if failed else 0

if __name__=='__main__':
    arg=argparse.ArgumentParser()
    arg.add_argument('--root',default='.')
    arg.add_argument('--out',default='/tmp/dgb-spatial-rain-qualification')
    a=arg.parse_args()
    sys.exit(run(pathlib.Path(a.root).resolve(),pathlib.Path(a.out).resolve()))
