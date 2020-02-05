const playwright = require('playwright');

(async () => {
  //for (const browserType of ['chromium', 'firefox', 'webkit']) {
    for (const browserType of ['webkit']) {      
    const browser = await playwright[browserType].launch();
    const page = await browser.newPage('http://whatsmyuseragent.org/');
    await page.screenshot({ path: `example-${browserType}.png` });
    await browser.close();
  }
})();