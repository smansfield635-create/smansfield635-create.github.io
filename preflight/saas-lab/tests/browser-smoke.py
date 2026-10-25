"""Manual/optional read-only local Playwright smoke. No publish or external request."""
import json, pathlib, subprocess, tempfile, time, urllib.request
from playwright.sync_api import sync_playwright

root=pathlib.Path(__file__).resolve().parent.parent
server=subprocess.Popen(['python3','-m','http.server','8765','--bind','127.0.0.1','--directory',str(root)],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL)
try:
    for _ in range(20):
        try:
            urllib.request.urlopen('http://127.0.0.1:8765/',timeout=1)
            break
        except Exception:
            time.sleep(.1)
    with sync_playwright() as p:
        browser=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox','--disable-gpu'])
        page=browser.new_page(viewport={'width':412,'height':915})
        outbound=[]
        page.on('request',lambda r:outbound.append(r.url) if not r.url.startswith('http://127.0.0.1:8765/') else None)
        page.goto('http://127.0.0.1:8765/',wait_until='load')
        page.locator('#project-input').fill((root/'fixtures/sample-world-before.json').read_text())
        page.locator('#report-input').fill((root/'fixtures/sample-world-result.json').read_text())
        page.locator('#preview').click()
        page.locator('#advanced').get_by_text('3.75').wait_for(timeout=5000)
        assert 'Final camera correction qualification' in page.locator('#continuation').inner_text()
        assert page.locator('#advanced').locator('.entry').count()==2
        assert 'unassigned evidence' in page.locator('#status').inner_text().lower()
        page.locator('#apply').click()
        assert 'Updated in this tab only' in page.locator('#status').inner_text()
        assert page.locator('#report-input').input_value()==''
        assert not outbound, outbound
        page.reload(wait_until='load')
        assert page.locator('#project-input').input_value()==''
        assert not outbound, outbound
        print('BROWSER PASS: mobile viewport, two findings, final milestone continuation, memory-only, no external network, reload clears.');
        browser.close()
finally:
    server.terminate();server.wait(timeout=5)
