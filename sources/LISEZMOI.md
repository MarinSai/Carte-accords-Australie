# Carte statique : traités de sécurité de l'Australie dans le Pacifique (depuis 2023)

Un fichier HTML par langue, prévu pour une intégration en iframe (hauteur automatique via iframe-resizer v5) : `index.html` (FR), `es.html`, `it.html`.

- Textes (titre, chapô, clé, encadrés, toponymes) : `src/textes.js`.
- Cadres, positions des étiquettes et des encadrés, catégories : en tête de `src/App.svelte`.
- Fond de carte (Natural Earth 10 m via world-atlas) et globe : `node donnees/prep.mjs`.
- Compiler : `npm install` puis `VITE_LANGUE=fr|es|it npx vite build` (sortie `dist-<langue>/index.html`).
- Contrôle des superpositions (15 largeurs, avec et sans iframe) : `node verif.mjs dist-fr/index.html dist-es/index.html dist-it/index.html`.

Catégories : typologie du Lowy Institute (A. Ride et T. Miletic, The Interpreter, 17 juillet 2026) ; Îles Salomon classées d'après l'article 5 du traité (consultation préalable).
