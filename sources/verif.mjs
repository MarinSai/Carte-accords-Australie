import puppeteer from 'puppeteer-core';
const fichiers = process.argv.slice(2);
const largeurs = [360, 390, 430, 480, 540, 599, 600, 650, 700, 760, 820, 900, 980, 1040, 1200];
const b = await puppeteer.launch({ executablePath: '/usr/bin/google-chrome', args: ['--no-sandbox'] });
let pb = 0;
for (const f of fichiers) for (const w of largeurs) for (const emb of [false, true]) {
  const p = await b.newPage(); await p.setViewport({ width: w, height: 1200 });
  await p.goto('file://' + f, { waitUntil: 'networkidle0' });
  if (emb) await p.evaluate(() => document.documentElement.classList.add('embarque'));
  await new Promise(r => setTimeout(r, 600));
  const res = await p.evaluate(() => {
    const sc = document.querySelector('.scene').getBoundingClientRect();
    const svg = document.querySelector('svg.textes');
    const items = [], filets = [], points = [];
    let dernier = null;
    for (const el of svg.children) {
      if (el.tagName === 'polyline' && !el.classList.contains('fond')) dernier = el;
      if (el.tagName === 'g' && el.querySelector('text')) {
        const it = { n: el.textContent.trim().slice(0, 14), r: el.getBoundingClientRect() }; items.push(it);
        if (dernier) { const m = dernier.getScreenCTM(); const pts = [...dernier.points].map((q) => { const t = q.matrixTransform(m); return [t.x, t.y]; }); filets.push({ n: it.n, pts }); dernier = null; }
      } else if (el.tagName === 'text') items.push({ n: el.textContent.trim().slice(0, 14), r: el.getBoundingClientRect() });
    }
    for (const c of document.querySelectorAll('circle.ilot, circle.bout')) points.push({ n: 'cercle', r: c.getBoundingClientRect() });
    for (const s of ['.globe', '.echelle']) items.push({ n: s, r: document.querySelector(s).getBoundingClientRect() });
    const out = [], m = 2;
    const inter = (a, c) => a.left < c.right - m && c.left < a.right - m && a.top < c.bottom - m && c.top < a.bottom - m;
    for (let i = 0; i < items.length; i++) {
      const a = items[i].r; if (!a.width) continue;
      if (a.left < sc.left - 0.5 || a.right > sc.right + 0.5 || a.top < sc.top - 0.5 || a.bottom > sc.bottom + 0.5) out.push('coupé: ' + items[i].n);
      for (let j = i + 1; j < items.length; j++) { const c = items[j].r; if (c.width && inter(a, c)) out.push(items[i].n + ' × ' + items[j].n); }
      for (const q of points) if (inter(a, q.r)) out.push(items[i].n + ' × cercle');
    }
    const segRect = (p, q, r) => { for (let k = 0; k <= 40; k++) { const x = p[0] + (q[0] - p[0]) * k / 40, y = p[1] + (q[1] - p[1]) * k / 40; if (x > r.left + 1 && x < r.right - 1 && y > r.top + 1 && y < r.bottom - 1) return true; } return false; };
    for (const f of filets) for (const it of items) for (let k = 0; k < f.pts.length - 1; k++) if (segRect(f.pts[k], f.pts[k + 1], it.r)) { out.push('filet ' + f.n + ' traverse ' + it.n); break; }
    return [...new Set(out)];
  });
  if (res.length) { pb++; console.log(f.split('/').slice(-2).join('/'), w, emb ? 'embarqué' : '', res.join(' | ')); }
  await p.close();
}
await b.close(); console.log('problèmes', pb);
