<script>
  import D from './data.json';
  import G from './globe.json';
  import { T } from './textes.js';

  /* ------------------------------------------------------------------
     Projection : Mercator centré sur 158° E (identique à donnees/prep.mjs)
     ------------------------------------------------------------------ */
  const P = (lon, lat) => {
    const l = ((lon - D.lon0 + 540) % 360) - 180;
    return [l * 100, -D.S * Math.log(Math.tan(Math.PI / 4 + (lat * Math.PI) / 360))];
  };
  const boite = (lonO, lonE, latS, latN) => {
    const [x0, y1] = P(lonO, latS), [x1, y0] = P(lonE, latN);
    return { x: x0, y: y0, w: x1 - x0, h: y1 - y0 };
  };
  const CADRE_LARGE = boite(132, 186, -33.5, 4);
  const CADRE_ETROIT = boite(140.8, 183.6, -46, 8);
  const KM = 100 / 111.32 / Math.cos((15 * Math.PI) / 180); // unités carte par km vers 15° S

  let cw = 0;
  $: etroit = cw > 0 && cw < 600;
  $: ratio = etroit ? 7 / 10 : 7 / 5;
  function cadrer(b, r) {
    let { x, y, w, h } = b;
    if (w / h < r) { const nw = h * r; x -= (nw - w) / 2; w = nw; }
    else { const nh = w / r; y -= (nh - h) / 2; h = nh; }
    return { x, y, w, h };
  }
  $: vb = cadrer(etroit ? CADRE_ETROIT : CADRE_LARGE, ratio);
  $: upp = cw > 0 ? vb.w / cw : 1;
  $: vbTxt = `${vb.x.toFixed(2)} ${vb.y.toFixed(2)} ${vb.w.toFixed(2)} ${vb.h.toFixed(2)}`;

  /* ------------------------------------------------------------------
     Traités : nature de l'engagement (typologie du Lowy Institute ; Îles Salomon : article 5 du traité)
     ------------------------------------------------------------------ */
  const TYPE = { PNG: 'alliance', FJI: 'alliance', TUV: 'accord', NRU: 'accord', VUT: 'consult', SLB: 'consult' };
  const ORDRE = ['TUV', 'NRU', 'PNG', 'VUT', 'FJI', 'SLB'];
  // petits États : un cercle signale leur position
  const ILOTS = { NRU: [166.93, -0.53], TUV: [179.1, -8.3] };

  /* ------------------------------------------------------------------
     Étiquettes
     ------------------------------------------------------------------ */
  const PAYS_NOMS = [
    { t: T.pays.AUS, p: [135.5, -24], etroit: [146.2, -24.5] },
    { t: T.pays.IDN, p: [136.2, -3.6], large: true },
    { t: T.pays.NCL, p: [165.3, -23.4], etroit: [164.6, -23.4] },
    { t: T.pays.NZL, p: [174.4, -37.6], etroite: true, etroit: [174.4, -37.6] }
  ].map((e) => ({ ...e, xy: P(...e.p), xyE: P(...(e.etroit || e.p)) }));
  const MERS = [
    { t: T.mers[0], p: [155.2, -18.2], etroit: [155.6, -17.6] },
    { t: T.mers[1], p: [176, -29], etroit: [174.5, -30.5] },
    { t: T.mers[2], p: [159, -30.5], etroit: [158.5, -36.5] }
  ].map((e) => ({ ...e, xy: P(...e.p), xyE: P(...(e.etroit || e.p)) }));
  const CANBERRA = P(149.13, -35.28);
  const etoile = (r) => {
    let d = '';
    for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + (i * Math.PI) / 5, q = i % 2 ? r * 0.42 : r; d += (i ? 'L' : 'M') + (Math.cos(a) * q).toFixed(3) + ',' + (Math.sin(a) * q).toFixed(3); }
    return d + 'Z';
  };

  // encadrés : position du texte (large / étroit), ancrage, point visé
  const NOTES = [
    { c: 'PNG', p: [139.5, 1.6], e: [141.9, 3.6], a: 'middle', aE: 'start', cible: [144.6, -6.2] },
    { c: 'NRU', p: [164.6, 1.2], e: [166.9, 4.4], a: 'end', aE: 'middle', h: true, cible: [166.93, -0.53] },
    { c: 'TUV', p: [176, -4.8], e: [182.9, -3.6], a: 'end', aE: 'end', h: true, cible: [179.1, -8.3] },
    { c: 'SLB', p: [153.4, -11.2], e: [153.2, -11.4], a: 'middle', aE: 'middle', cible: [159.9, -9.5] },
    { c: 'VUT', p: [172.3, -11.6], e: [172.3, -11.8], a: 'start', aE: 'middle', cible: [167.6, -15.6] },
    { c: 'FJI', p: [178.2, -22.2], e: [178.2, -22.2], a: 'middle', aE: 'middle', cible: [177.9, -17.9] }
  ].map((n) => ({ ...n, xy: P(...n.p), xyE: P(...n.e), cxy: P(...n.cible) }));

  // boîtes des blocs de texte, mesurées après chargement des polices
  let boites = {};
  function mesure(node, opt) {
    let { cb, cle } = opt, prec = '';
    const lire = () => {
      try {
        const b = node.getBBox(); if (!b.width) return;
        const k = [b.x, b.y, b.width, b.height].map((v) => v.toFixed(2)).join();
        if (k !== prec) { prec = k; cb({ x: b.x, y: b.y, width: b.width, height: b.height }); }
      } catch (e) {}
    };
    requestAnimationFrame(lire); if (document.fonts) document.fonts.ready.then(lire);
    return { update(n) { cb = n.cb; if (n.cle !== cle) { cle = n.cle; requestAnimationFrame(lire); } } };
  }
  // filet coudé : part du milieu du bloc (bas ou haut selon la cible), descend ou monte, puis rejoint la cible
  // décalage horizontal qui garde le bloc dans le cadre (marge 8 px)
  function decale(b, v, u) {
    if (!b) return 0;
    const g = v.x + 8 * u - b.x, d = b.x + b.width - (v.x + v.w - 8 * u);
    return g > 0 ? g : d > 0 ? -d : 0;
  }
  function filet(b0, cible, u, h, dx = 0) {
    if (!b0) return '';
    const b = { ...b0, x: b0.x + dx };
    if (h) {
      // départ du milieu du flanc tourné vers la cible, puis horizontal et vertical
      const my = b.y + b.height / 2, droite = cible[0] > b.x + b.width;
      const x0 = droite ? b.x + b.width + 5 * u : b.x - 5 * u;
      if (Math.abs(cible[1] - my) < 3 * u) return `${x0},${cible[1]} ${cible[0]},${cible[1]}`;
      return `${x0},${my} ${cible[0]},${my} ${cible[0]},${cible[1]}`;
    }
    const mx = b.x + b.width / 2, dessous = cible[1] > b.y + b.height;
    const y0 = dessous ? b.y + b.height + 4 * u : b.y - 4 * u;
    if (Math.abs(cible[0] - mx) < 3 * u) return `${mx},${y0} ${cible[0]},${cible[1]}`;
    return `${mx},${y0} ${mx},${cible[1]} ${cible[0]},${cible[1]}`;
  }
</script>

<main class="bloc">
  <header class="tete">
    <h1>{T.titre}</h1>
    <p class="chapo">{T.chapo}</p>
  </header>

  <ul class="cle" aria-label="Clé de lecture">
    <li><svg width="18" height="14" viewBox="0 0 18 14" aria-hidden="true"><rect x="1.5" y="1.5" width="15" height="11" rx="2" fill="rgba(221,32,60,.42)" stroke="#dd203c" stroke-width="1.3"/></svg>{T.cle[0]}</li>
    <li><svg width="18" height="14" viewBox="0 0 18 14" aria-hidden="true"><rect x="1.5" y="1.5" width="15" height="11" rx="2" fill="rgba(221,32,60,.15)" stroke="#dd203c" stroke-width="1.3"/></svg>{T.cle[1]}</li>
    <li><svg width="18" height="14" viewBox="0 0 18 14" aria-hidden="true"><defs><pattern id="cleh" width="4" height="4" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><line x1="0" y1="0" x2="0" y2="4" stroke="#dd203c" stroke-width="1.4"/></pattern></defs><rect x="1.5" y="1.5" width="15" height="11" rx="2" fill="url(#cleh)" stroke="#dd203c" stroke-width="1.3"/></svg>{T.cle[2]}</li>
  </ul>

  <div class="scene" bind:clientWidth={cw} style="aspect-ratio:{etroit ? '7 / 10' : '7 / 5'}" role="img" aria-label={T.carte}>
    {#if cw > 0}
    <!-- fond : terres blanches, rivage estompé, frontières -->
    <svg class="couche" viewBox={vbTxt} preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        <filter id="rivage" x="-5%" y="-5%" width="110%" height="110%"><feGaussianBlur stdDeviation={(11 * upp).toFixed(3)} /></filter>
        <pattern id="hach" width="4" height="4" patternUnits="userSpaceOnUse" patternTransform="scale({upp.toFixed(4)}) rotate(45)"><line x1="0" y1="0" x2="0" y2="4" stroke="#dd203c" stroke-width="1.6" /></pattern>
      </defs>
      <path d={D.land + Object.values(D.partners).join('')} fill="#b9d6d3" filter="url(#rivage)" />
      <path d={D.land} fill="#fff" />
      {#each ORDRE as c}
        <path d={D.partners[c]} fill="#fff" />
        <path d={D.partners[c]} class="partenaire {TYPE[c]}" />
        <path d={D.partners[c]} class="lisere halo1" /><path d={D.partners[c]} class="lisere halo2" /><path d={D.partners[c]} class="lisere" />
      {/each}
      <path d={D.borders} class="frontiere halo" /><path d={D.borders} class="frontiere" />
      {#each Object.entries(ILOTS) as [c, ll]}
        {@const q = P(...ll)}
        <circle cx={q[0]} cy={q[1]} r={(9 * upp).toFixed(3)} class="ilot {TYPE[c]}" />
      {/each}
    </svg>
    <div class="voile"></div>

    <!-- étiquettes et encadrés : taille constante à l'écran -->
    <svg class="couche textes" viewBox={vbTxt} preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      {#each PAYS_NOMS as e}
        {#if (!e.large || !etroit) && (!e.etroite || etroit)}
          <text class="pays" x={(etroit ? e.xyE : e.xy)[0]} y={(etroit ? e.xyE : e.xy)[1]} font-size={(10.5 * upp).toFixed(3)} letter-spacing={(2.4 * upp).toFixed(3)} text-anchor="middle">{e.t.toUpperCase()}</text>
        {/if}
      {/each}
      {#each MERS as e}
        {#if !e.large || !etroit}
          <text class="mer" font-size={(12.5 * upp).toFixed(3)} text-anchor="middle">
            {#each e.t as ligne, j}<tspan x={(etroit ? e.xyE : e.xy)[0]} y={(etroit ? e.xyE : e.xy)[1] + j * 15 * upp}>{ligne}</tspan>{/each}
          </text>
        {/if}
      {/each}
      {#if etroit}<g transform="translate({CANBERRA[0].toFixed(2)} {CANBERRA[1].toFixed(2)})">
        <path d={etoile(5.2 * upp)} class="point" />
        <text class="ville" font-size={(13 * upp).toFixed(3)} stroke-width={(3.2 * upp).toFixed(3)} text-anchor="end" x={-8 * upp} y={4.4 * upp}>{T.canberra}</text>
      </g>{/if}

      {#each NOTES as n}
        {@const xy0 = etroit ? n.xyE : n.xy}
        {@const xy = [xy0[0], Math.max(xy0[1], vb.y + 26 * upp)]}
        {@const a = etroit ? n.aE : n.a}
        {@const L = T.notes[n.c]}
        {@const dx = decale(boites[n.c + etroit], vb, upp)}
        {@const pts = filet(boites[n.c + etroit], n.cxy, upp, n.h && !etroit, dx)}
        {@const lignes = etroit ? L[0].split('|') : [L[0].replace('|', '')]}
        {@const dl = (lignes.length - 1) * 16}
        <polyline class="filet fond" points={pts} /><polyline class="filet" points={pts} />
        <circle class="bout" cx={n.cxy[0]} cy={n.cxy[1]} r={2.3 * upp} />
        <g transform="translate({dx.toFixed(2)} 0)" use:mesure={{ cb: (b) => (boites = { ...boites, [n.c + etroit]: b }), cle: upp + '' + etroit }}>
          <text class="note-titre" class:neuf={n.c === 'SLB'} text-anchor={a} font-size={(14 * upp).toFixed(3)} stroke-width={(3.4 * upp).toFixed(3)}>{#each lignes as l, j}<tspan x={xy[0]} y={xy[1] + j * 16 * upp}>{l}</tspan>{/each}</text>
          {#if !etroit}<text class="note-texte" text-anchor={a} x={xy[0]} y={xy[1] + 16 * upp} font-size={(12 * upp).toFixed(3)} stroke-width={(3.2 * upp).toFixed(3)}>{L[1]}</text>{/if}
          <text class="note-date" class:neuf={n.c === 'SLB'} text-anchor={a} x={xy[0]} y={xy[1] + (etroit ? 16 + dl : 31) * upp} font-size={(12 * upp).toFixed(3)} stroke-width={(3.2 * upp).toFixed(3)}>{L[2]}</text>
        </g>
      {/each}
    </svg>

    <!-- globe de situation -->
    <div class="globe" aria-hidden="true"><svg viewBox="-102 -102 204 204">
      <circle r="100" class="g-mer" />
      <path d={G.land} class="g-terre" />
      <path d={G.grille} class="g-grille" />
      <path d={G.cadre} class="g-cadre" />
    </svg></div>

    <!-- échelle -->
    <div class="echelle" aria-hidden="true"><span>500 {T.km}</span><i style="width:{(500 * KM / upp).toFixed(1)}px"></i></div>
    {/if}
  </div>

  <p class="source">{T.source}</p>
</main>

<style>
  .bloc{max-width:1040px;margin:0 auto;padding:6px var(--marge) 10px;display:flex;flex-direction:column;gap:14px}
  .tete{display:flex;flex-direction:column;gap:6px}
  h1{font-family:var(--titre);font-weight:700;font-size:clamp(21px,3.3vw,28px);line-height:1.16;text-wrap:balance}
  .chapo{font-size:15px;line-height:1.4;color:var(--gris);max-width:70ch}

  .cle{list-style:none;display:flex;flex-wrap:wrap;gap:6px 18px;font-size:12.5px;line-height:1.3;color:#3b3b40}
  .cle li{display:flex;align-items:flex-start;gap:6px}
  .cle svg{margin-top:1px}
  .cle svg{flex:none;display:block}

  .scene{position:relative;line-height:0;overflow:hidden;background:#e7f1f0}
  .voile{position:absolute;inset:0;pointer-events:none;box-shadow:inset 0 0 18px 10px #fff}
  .couche{position:absolute;inset:0;display:block;width:100%;height:100%}

  .partenaire{stroke:none}
  .partenaire.alliance{fill:#dd203c;fill-opacity:.42}
  .partenaire.accord{fill:#dd203c;fill-opacity:.15}
  .partenaire.consult{fill:url(#hach);fill-opacity:1}
  .lisere{fill:none;stroke:#dd203c;stroke-opacity:.85;stroke-width:1;vector-effect:non-scaling-stroke;stroke-linejoin:round}
  .lisere.halo1{stroke-opacity:.06;stroke-width:9}
  .lisere.halo2{stroke-opacity:.12;stroke-width:5}
  .frontiere{fill:none;stroke:#7b7b80;stroke-width:.8;vector-effect:non-scaling-stroke;stroke-linecap:round;stroke-linejoin:round}
  .frontiere.halo{stroke:#8c8c90;stroke-opacity:.12;stroke-width:4}
  .ilot{stroke:#dd203c;stroke-width:1.2;vector-effect:non-scaling-stroke}
  .ilot.accord{fill:#dd203c;fill-opacity:.15}

  .textes text{font-family:var(--texte);fill:var(--encre)}
  text.pays{font-weight:500;fill:#2a2a2d}
  text.mer{font-style:italic;fill:#86aeab}
  text.ville{font-weight:400;paint-order:stroke;stroke:#fff;stroke-opacity:.85;stroke-linejoin:round}
  .point{fill:#141414}
  .filet{fill:none;stroke:#141414;stroke-width:.8;vector-effect:non-scaling-stroke;stroke-linejoin:round}
  .filet.fond{stroke:#fff;stroke-opacity:.85;stroke-width:3}
  .bout{fill:#141414;stroke:#fff;stroke-width:1.2;vector-effect:non-scaling-stroke}
  .textes text.note-titre{font-family:var(--titre);font-weight:700;paint-order:stroke;stroke:#fff;stroke-opacity:.9;stroke-linejoin:round}
  .textes text.note-titre.neuf{fill:var(--rouge)}
  text.note-texte{font-weight:400;paint-order:stroke;stroke:#fff;stroke-opacity:.9;stroke-linejoin:round}
  text.note-date{font-weight:400;fill:#6e6e73;paint-order:stroke;stroke:#fff;stroke-opacity:.9;stroke-linejoin:round}
  .textes text.note-date.neuf{fill:var(--rouge);font-weight:600}

  .globe{position:absolute;top:12px;right:12px;width:86px;height:86px;border-radius:50%;background:#fff;box-shadow:0 1px 6px rgba(0,0,0,.22)}
  .globe svg{display:block;width:100%;height:100%}
  .g-mer{fill:#fff}
  .g-terre{fill:#d9d9d9}
  .g-grille{fill:none;stroke:#fff;stroke-width:1.1;stroke-opacity:.9}
  .g-cadre{fill:none;stroke:#dd203c;stroke-width:4.5;stroke-linejoin:miter}
  .echelle{position:absolute;left:12px;bottom:12px;display:flex;flex-direction:column;gap:3px;font-size:11.5px;line-height:1;color:#5a5a5e}
  .echelle i{display:block;height:1px;background:#5a5a5e}

  .source{font-size:12px;line-height:1.45;color:var(--gris);border-top:1px solid var(--filet);padding-top:10px}

  @media (max-width:600px){
    .bloc{gap:12px}
    .chapo{font-size:14px}
    .cle{gap:5px 14px;font-size:12px}
    .globe{width:70px;height:70px;top:10px;right:10px}
  }
</style>
