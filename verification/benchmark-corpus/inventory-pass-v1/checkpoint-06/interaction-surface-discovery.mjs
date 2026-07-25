import fs from "node:fs/promises";
import puppeteer from "puppeteer-core";

const OUTPUT = "cp6-interaction-surface-discovery.json";
const ORIGIN = "https://smansfield635-create.github.io";
const ROUTES = [
  ["MAIN_COMPASS", "/"],
  ["HOMEPAGE_COMPASS", "/home/"],
  ["ARCHCOIN_COMPASS", "/products/archcoin/"],
  ["SHOWROOM", "/showroom/"],
  ["LAWS_CHAMBER_POST_PR128", "/laws/"]
];

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

function launchOptions() {
  const executablePath = process.env.CHROME_PATH || "/usr/bin/google-chrome";
  return {
    executablePath,
    headless: "new",
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--disable-gpu",
      "--window-size=1440,1100"
    ]
  };
}

async function settle(page) {
  await page.waitForNetworkIdle({ idleTime: 800, timeout: 15000 }).catch(() => {});
  await sleep(1200);
  await page.evaluate(async () => {
    const height = Math.max(document.body.scrollHeight, document.documentElement.scrollHeight);
    for (const ratio of [0, 0.35, 0.7, 1]) {
      scrollTo(0, Math.floor(height * ratio));
      await new Promise(resolve => setTimeout(resolve, 450));
    }
    scrollTo(0, 0);
  });
  await sleep(1000);
}

async function inspect(page) {
  return page.evaluate(() => {
    const relevantData = element => {
      const out = {};
      for (const attribute of element.attributes || []) {
        if (!attribute.name.startsWith("data-")) continue;
        if (/compass|archcoin|showroom|laws|orbit|cluster|room|cardinal|return|selection|state|mode|action|route|panel|controller|interaction|gesture/i.test(attribute.name)) {
          out[attribute.name] = attribute.value;
        }
      }
      return out;
    };

    const visible = element => {
      const rect = element.getBoundingClientRect();
      const style = getComputedStyle(element);
      return rect.width > 0 && rect.height > 0 && style.display !== "none" && style.visibility !== "hidden" && style.pointerEvents !== "none";
    };

    const descriptor = element => {
      const rect = element.getBoundingClientRect();
      const text = (element.innerText || element.textContent || "").replace(/\s+/g, " ").trim().slice(0, 180);
      return {
        tag: element.tagName.toLowerCase(),
        id: element.id || "",
        className: typeof element.className === "string" ? element.className : "",
        role: element.getAttribute("role") || "",
        type: element.getAttribute("type") || "",
        href: element.getAttribute("href") || "",
        ariaLabel: element.getAttribute("aria-label") || "",
        ariaSelected: element.getAttribute("aria-selected") || "",
        ariaExpanded: element.getAttribute("aria-expanded") || "",
        disabled: Boolean(element.disabled || element.getAttribute("aria-disabled") === "true"),
        text,
        data: relevantData(element),
        rect: {
          x: Math.round(rect.x),
          y: Math.round(rect.y),
          width: Math.round(rect.width),
          height: Math.round(rect.height)
        }
      };
    };

    const all = Array.from(document.querySelectorAll("*"));
    const dataSurfaces = all
      .filter(element => Object.keys(relevantData(element)).length > 0)
      .map(descriptor);

    const interactive = Array.from(document.querySelectorAll([
      "button",
      "a[href]",
      "summary",
      "input",
      "select",
      "textarea",
      "[role='button']",
      "[role='tab']",
      "[tabindex]"
    ].join(",")))
      .filter(visible)
      .map(descriptor);

    const roots = all
      .filter(element => Array.from(element.attributes || []).some(attribute => /data-(compass|archcoin|showroom|laws)-root/.test(attribute.name)))
      .map(descriptor);

    const globals = Object.keys(globalThis)
      .filter(key => /DGB|COMPASS|ARCHCOIN|SHOWROOM|LAWS/i.test(key))
      .sort();

    return {
      finalUrl: location.href,
      title: document.title,
      documentReadyState: document.readyState,
      roots,
      interactive,
      dataSurfaces,
      globals
    };
  });
}

const browser = await puppeteer.launch(launchOptions());
const result = {
  artifactId: "METAVERSE_3D_GOVERNED_BENCHMARK_CORPUS_CP6_INTERACTION_SURFACE_DISCOVERY_v1",
  generatedAt: new Date().toISOString(),
  browserVersion: await browser.version(),
  routes: []
};

try {
  for (const [benchmarkId, route] of ROUTES) {
    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 1100, deviceScaleFactor: 1 });
    const consoleMessages = [];
    const pageErrors = [];
    page.on("console", message => consoleMessages.push({ type: message.type(), text: message.text() }));
    page.on("pageerror", error => pageErrors.push(String(error?.message || error)));
    const response = await page.goto(`${ORIGIN}${route}`, { waitUntil: "domcontentloaded", timeout: 30000 });
    await settle(page);
    const surface = await inspect(page);
    result.routes.push({
      benchmarkId,
      route,
      navigationStatus: response?.status() ?? null,
      consoleMessages,
      pageErrors,
      ...surface
    });
    await page.close();
  }
} finally {
  await browser.close();
}

await fs.writeFile(OUTPUT, JSON.stringify(result, null, 2));
console.log(`CP6_DISCOVERY_OUTPUT=${OUTPUT}`);
console.log(`CP6_DISCOVERY_ROUTE_COUNT=${result.routes.length}`);
