// Prépare src/data.json : fond Natural Earth 10 m (world-atlas), Mercator centré sur 158° E (traverse l'antiméridien)
import fs from 'fs';
import { geoMercator, geoPath, geoOrthographic, geoGraticule } from 'd3-geo';
import { feature, mesh } from 'topojson-client';
import { presimplify, simplify } from 'topojson-simplify';
let topo = JSON.parse(fs.readFileSync('node_modules/world-atlas/countries-10m.json'));
topo = simplify(presimplify(topo), 0.0004);
const S = 100 * 180 / Math.PI;           // 1° de longitude = 100 unités
const LON0 = 158;
const proj = geoMercator().rotate([-LON0, 0]).scale(S).translate([0, 0]).precision(0.2);
const [ax, ay] = proj([118, 16]), [bx, by] = proj([-160, -52]);
proj.clipExtent([[ax, ay], [bx, by]]);
const path = geoPath(proj).digits(1);
const geoms = topo.objects.countries.geometries;
const PART = { PNG: 'Papua New Guinea', SLB: 'Solomon Is.', VUT: 'Vanuatu', FJI: 'Fiji', NRU: 'Nauru', TUV: 'Tuvalu' };
const nomVersCode = Object.fromEntries(Object.entries(PART).map(([k, v]) => [v, k]));
const data = { S, lon0: LON0, partners: {}, land: '' };
let land = '';
for (const g of geoms) {
  const f = feature(topo, g); const d = path(f); if (!d) continue;
  const code = nomVersCode[g.properties.name];
  if (code) data.partners[code] = d; else land += d;
}
data.land = land;
// frontières terrestres lissées (Chaikin, 2 passes)
const m = mesh(topo, topo.objects.countries, (a, b) => a !== b);
const chaikin = (pts) => { for (let k = 0; k < 2; k++) { const o = [pts[0]]; for (let i = 0; i < pts.length - 1; i++) { const [p, q] = [pts[i], pts[i + 1]]; o.push([0.75 * p[0] + 0.25 * q[0], 0.75 * p[1] + 0.25 * q[1]], [0.25 * p[0] + 0.75 * q[0], 0.25 * p[1] + 0.75 * q[1]]); } o.push(pts[pts.length - 1]); pts = o; } return pts; };
const bd = path(m) || '';
data.borders = bd.split('M').filter(Boolean).map((s) => {
  const pts = s.split('L').map((c) => c.split(',').map(Number));
  return 'M' + chaikin(pts).map((p) => p[0].toFixed(1) + ',' + p[1].toFixed(1)).join('L');
}).join('');
fs.writeFileSync('src/data.json', JSON.stringify(data));
console.log('data.json', fs.statSync('src/data.json').size, Object.fromEntries(Object.entries(data.partners).map(([k, v]) => [k, v.length])), 'land', land.length, 'borders', data.borders.length);
// globe de situation
const t110 = JSON.parse(fs.readFileSync('node_modules/world-atlas/countries-110m.json'));
const o = geoOrthographic().rotate([-160, 16]).scale(100).translate([0, 0]).clipAngle(90).precision(0.4);
const gp = geoPath(o).digits(1);
const dens = (lo0, lo1, la0, la1) => { const r = []; for (let i = 0; i <= 20; i++) r.push([lo0 + (lo1 - lo0) * i / 20, la1]); for (let i = 0; i <= 20; i++) r.push([lo1, la1 + (la0 - la1) * i / 20]); for (let i = 0; i <= 20; i++) r.push([lo1 - (lo1 - lo0) * i / 20, la0]); for (let i = 0; i <= 20; i++) r.push([lo0, la0 + (la1 - la0) * i / 20]); return r.map(([a, b]) => [a > 180 ? a - 360 : a, b]); };
const cadre = { type: 'LineString', coordinates: dens(130, 186, -38, 4) };
fs.writeFileSync('src/globe.json', JSON.stringify({ land: gp(feature(t110, t110.objects.land)), grille: gp(geoGraticule().step([15, 15])()), cadre: gp(cadre) }));
console.log('globe ok');
