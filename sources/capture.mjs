import puppeteer from 'puppeteer-core';
const [,, fichier, sortie, ...largeurs] = process.argv;
const b = await puppeteer.launch({ executablePath: '/usr/bin/google-chrome', args: ['--no-sandbox'] });
for (const w of largeurs.map(Number)) {
  const p = await b.newPage(); await p.setViewport({ width: w, height: 900, deviceScaleFactor: 2 });
  await p.goto('file://' + fichier, { waitUntil: 'networkidle0' }); await new Promise(r => setTimeout(r, 800));
  const h = await p.evaluate(() => document.body.scrollHeight); await p.setViewport({ width: w, height: h, deviceScaleFactor: 2 });
  await new Promise(r => setTimeout(r, 400));
  await p.screenshot({ path: `${sortie}_${w}.png` }); await p.close();
}
await b.close();
