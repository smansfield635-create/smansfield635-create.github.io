import puppeteer from 'puppeteer-core';

const url = 'https://diamondgatebridge.com/preview/bt4/entitlement-v1/';
const chromePath = process.env.CHROME_PATH;
if (!chromePath) throw new Error('CHROME_PATH_REQUIRED');

const browser = await puppeteer.launch({
  executablePath: chromePath,
  headless: true,
  args: ['--no-sandbox', '--disable-dev-shm-usage']
});

const results = [];
const check = (name, actual, expected) => {
  const pass = actual === expected;
  results.push({ name, actual, expected, pass });
  if (!pass) throw new Error(`${name}: expected ${expected}, got ${actual}`);
};

try {
  const page = await browser.newPage();
  page.setDefaultTimeout(30000);
  const response = await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });
  if (!response || !response.ok()) throw new Error(`LIVE_ROUTE_HTTP_${response?.status?.() ?? 'NO_RESPONSE'}`);

  await page.waitForSelector('#state');
  const text = async sel => (await page.$eval(sel, el => el.textContent)).trim();
  const click = async act => {
    await page.click(`[data-act="${act}"]`);
    await new Promise(r => setTimeout(r, 100));
  };

  check('baseline', await text('#state'), 'QUALIFIED');

  await click('corrupt');
  check('provenance contraction', await text('#state'), 'HELD');
  const blocked = await text('#presentation');
  if (!blocked.includes('QUALIFIED presentation BLOCKED') || !blocked.includes('HELD')) {
    throw new Error(`presentation override not blocked: ${blocked}`);
  }
  results.push({ name: 'presentation override blocked', actual: blocked, expected: 'blocked to HELD', pass: true });

  await click('repair');
  check('stale repair ceiling', await text('#state'), 'SUPPORTED');

  await click('fresh');
  check('fresh receipt recovery', await text('#state'), 'QUALIFIED');

  await click('adverse');
  check('adverse evidence contraction', await text('#state'), 'CONTRADICTED');

  await click('repair');
  check('post-adverse stale repair ceiling', await text('#state'), 'SUPPORTED');

  await click('fresh');
  check('post-adverse fresh recovery', await text('#state'), 'QUALIFIED');

  console.log(JSON.stringify({
    schema: 'BT4_LIVE_BROWSER_COUPLING_VERIFICATION_v1',
    url,
    checks: results.length,
    passed: results.filter(r => r.pass).length,
    result: 'PASS',
    results
  }, null, 2));
} finally {
  await browser.close();
}
