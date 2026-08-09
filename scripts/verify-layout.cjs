/* Layout verification via puppeteer-core + system Chromium (dev-only, not shipped). */
const puppeteer = require("puppeteer-core");

(async () => {
  const browser = await puppeteer.launch({
    executablePath: "/usr/bin/chromium",
    headless: "new",
    args: ["--no-sandbox", "--disable-gpu"],
  });
  const page = await browser.newPage();
  const errors = [];
  page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
  page.on("pageerror", (e) => errors.push(String(e)));

  await page.setViewport({ width: 1440, height: 900 });
  await page.goto("http://localhost:3000/", { waitUntil: "networkidle0", timeout: 30000 });
  await new Promise((r) => setTimeout(r, 1500));

  const m = await page.evaluate(() => {
    const rect = (sel) => {
      const el = document.querySelector(sel);
      if (!el) return null;
      const r = el.getBoundingClientRect();
      return { x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height) };
    };
    const h1 = document.querySelector("h1");
    const h1Style = getComputedStyle(h1);
    const links = [...document.querySelectorAll("footer a")].slice(0, 3).map((a) => getComputedStyle(a).minHeight);
    return {
      innerWidth: window.innerWidth,
      scrollWidth: document.documentElement.scrollWidth,
      hOverflow: document.documentElement.scrollWidth > window.innerWidth + 1,
      h1Font: h1Style.fontSize,
      h1Line: h1Style.lineHeight,
      h1Family: h1Style.fontFamily.slice(0, 60),
      h1Rect: rect("h1"),
      ctaRect: rect('[href="#work"]'),
      scrollCue: rect(".group[aria-label='Scroll down to see selected work']"),
      metrics: rect("main dl"),
      footerLinkMinHeight: links,
      bodyFamily: getComputedStyle(document.body).fontFamily.slice(0, 60),
    };
  });
  console.log(JSON.stringify(m, null, 1));
  console.log("console/page errors:", errors.length ? errors.slice(0, 5) : "none");

  // Mobile viewport check
  await page.setViewport({ width: 390, height: 844 });
  await page.goto("http://localhost:3000/", { waitUntil: "networkidle0", timeout: 30000 });
  await new Promise((r) => setTimeout(r, 1500));
  const mob = await page.evaluate(() => {
    const h1 = document.querySelector("h1");
    return {
      h1Present: !!h1,
      innerWidth: window.innerWidth,
      scrollWidth: document.documentElement.scrollWidth,
      hOverflow: document.documentElement.scrollWidth > window.innerWidth + 1,
      h1Font: h1 ? getComputedStyle(h1).fontSize : null,
    };
  });
  console.log("mobile:", JSON.stringify(mob));

  await browser.close();
})();
