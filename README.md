# Portfolio — Romain Lance

Site vitrine personnel d'un profil **ingénieur mécatronique & robotique** :
une page d'accueil découpée en sections ancrées, et une page dédiée par projet.

HTML / CSS / JavaScript natifs, sans framework ni étape de build. Le seul
appel externe est la feuille de styles Google Fonts.

---

## Lancer le site en local

Le site est constitué de fichiers statiques, mais il contient plusieurs pages
liées entre elles : mieux vaut passer par un petit serveur local plutôt que
d'ouvrir `index.html` directement.

```bash
# Python (déjà installé sur macOS et la plupart des Linux)
python3 -m http.server 8000

# ou avec Node.js
npx serve .
```

Puis ouvrir <http://localhost:8000>.

---

## Structure du projet

```
.
├── index.html                  # Page d'accueil : les 6 sections ancrées
├── projets/                    # Une page par projet
│   ├── dino-plateforme-ros2.html
│   ├── fauteuil-roulant-intelligent.html
│   ├── robot-agricole-rover.html
│   └── frigo-du-desert.html
├── css/
│   ├── style.css               # Thèmes, composants, animations, responsive
│   └── project.css             # Styles propres aux pages projet
├── js/
│   ├── icons.js                # Sprite SVG partagé par toutes les pages
│   ├── main.js                 # Thème, menu, navigation, formulaire
│   └── effects.js              # Effets visuels uniquement
└── README.md
```

Le contenu est écrit directement dans le HTML, ce qui garde le site lisible
sans JavaScript et correctement indexé par les moteurs de recherche. Les
fichiers JS n'ajoutent que des comportements par-dessus.

### Séparation main.js / effects.js

`effects.js` ne contient que de l'habillage : animation d'entrée, halos au
curseur, relief des cartes, compteurs, remplissage du rail de la timeline,
transition entre les pages. On peut le supprimer entièrement de toutes les
pages sans casser une seule fonctionnalité — le contenu, la navigation, le
thème et le formulaire continuent de marcher.

---

## Déploiement

### GitHub Pages

1. Pousser le projet sur la branche voulue du dépôt.
2. Dans le dépôt : **Settings → Pages**.
3. *Source* : « Deploy from a branch », choisir la branche et le dossier `/ (root)`.
4. Le site est publié sous `https://<utilisateur>.github.io/<dépôt>/` après une
   ou deux minutes.

Aucune configuration supplémentaire : pas de build, pas de fichier de config,
et aucun dossier commençant par `_` (donc pas besoin de `.nojekyll`).

### Netlify

- Par glisser-déposer : déposer le dossier du projet sur
  <https://app.netlify.com/drop>.
- Ou en connectant le dépôt Git — laisser la commande de build **vide** et
  indiquer `.` comme répertoire de publication.

### Vercel

```bash
npm i -g vercel
vercel
```

Répondre « no » à la détection de framework et garder le répertoire racine
comme dossier de sortie.

---

## Personnaliser

### Mettre à jour le contenu

Tout se modifie dans le HTML. Les sections sont délimitées par des
commentaires numérotés (`01 — À PROPOS`, `02 — PARCOURS PROFESSIONNEL`, etc.)
et chaque bloc reprend la même structure : dupliquer un élément existant
suffit à en ajouter un.

- Une expérience : copier un `<li class="tl reveal">` dans `<ol class="timeline">`.
- Une compétence : ajouter un `<li>` dans la liste `.tags` correspondante.

### Ajouter un projet

1. Dupliquer une page de `projets/` et l'adapter.
2. Dans `index.html`, dupliquer un bloc `<a class="pcard reveal tilt" …>` et
   pointer son `href` vers la nouvelle page.
3. Mettre à jour le lien « projet suivant » en bas des pages projet pour
   inclure la nouvelle dans la boucle.

### Les icônes

Toutes les icônes vivent dans `js/icons.js`, sous forme d'un sprite SVG injecté
au chargement. Pour en ajouter une, compléter l'objet `PATHS` avec un tracé
dessiné sur une grille 24 × 24, puis l'appeler dans le HTML :

```html
<svg class="ico" aria-hidden="true"><use href="#i-mon-icone"></use></svg>
```

Un fichier JS plutôt qu'un `.svg` externe : les références
`<use href="fichier.svg#id">` ne sont pas fiables d'un navigateur à l'autre, et
sans étape de build il n'y a pas moyen d'inclure un partiel HTML dans les
quatre pages. Les icônes étant purement décoratives, leur absence ne retire
aucune information.

### Les diagrammes des projets

Les vignettes sont des SVG dessinés à la main dans le HTML (aucune image), sur
une grille `0 0 200 120`. Le tracé principal porte la classe `diagram__draw`
et s'anime tout seul. Pour remplacer une vignette par une photo, substituer le
`<svg>` par une `<img>` dans `.pcard__media`.

### Remplacer le monogramme par une photo

Le hero affiche un placeholder « RL ». Pour utiliser une vraie photo, déposer
le fichier dans un dossier `assets/` puis remplacer, dans `index.html` :

```html
<span class="plate__mono">RL</span>
```

par :

```html
<img src="assets/photo.jpg" alt="Portrait de Romain Lance">
```

et ajouter dans `css/style.css` :

```css
.plate img { width: 100%; height: 100%; object-fit: cover; }
```

### Ajouter un lien GitHub

Le CV n'en mentionnait aucun, il n'y a donc pas de lien GitHub sur le site.
Pour en ajouter un, dupliquer un `<li>` de `.hero__social` ainsi qu'une ligne
de `.contact__list`.

### Changer les couleurs

La palette est centralisée en haut de `css/style.css`, dans les blocs
`[data-theme='light']` et `[data-theme='dark']`. Modifier `--accent` suffit à
changer l'identité du site ; `--signal` est la couleur secondaire (pastille de
disponibilité, savoir-être, centres d'intérêt).

---

## Détails techniques

- **Verre liquide** — les panneaux (cartes, compétences, formulaire, plaque,
  fiches projet) partagent un même traitement de surface : fond translucide,
  flou d'arrière-plan, liseré clair sur l'arête haute et ombre sur l'arête
  basse. La recette est centralisée dans la section « Verre liquide » de
  `css/style.css` ; les quatre variables `--glass-*` de chaque thème suffisent
  à la régler. Les arrondis suivent une échelle unique
  (`--radius-sm` / `--radius` / `--radius-lg` / `--radius-xl`).
- **Thème clair / sombre** — suit la préférence système au premier chargement,
  puis mémorise le choix dans `localStorage`. Un court script inline dans le
  `<head>` applique le thème avant le premier rendu pour éviter le flash blanc,
  et masque les éléments animés à l'entrée. Ce même script contient un filet de
  sécurité : si `effects.js` ne s'exécute pas, le contenu réapparaît au bout de
  2,5 s.
- **Animations** — entrée du hero en cascade, apparitions au défilement via
  `IntersectionObserver`, tracé progressif des diagrammes, compteurs chiffrés,
  rail de timeline qui se remplit à la lecture. Tout est neutralisé si le
  système demande `prefers-reduced-motion: reduce`.
- **Effets au curseur** — halos, relief 3D et boutons aimantés ne s'activent
  que sur un pointeur fin (`hover: hover and pointer: fine`), donc jamais sur
  écran tactile. Le halo rattrape le curseur par interpolation plutôt que de
  s'y coller, ce qui adoucit le mouvement.
- **Expériences cliquables** — un clic sur une entrée du parcours la recentre
  à l'écran. C'est un confort de lecture : rien n'est masqué au départ et le
  geste est accessible au clavier.
- **Curseur** — la page force `cursor: default` ; seuls les éléments
  actionnables passent en `pointer` et les champs en `text`. Le pointeur ne
  change donc plus de forme au survol du texte courant.
- **Formulaire de contact** — sans backend : le JavaScript compose un lien
  `mailto:` et l'ouvre dans une **nouvelle fenêtre**, pour que le portfolio
  reste affiché dans l'onglet d'origine. L'adresse est affichée en clair à
  côté, donc le contact reste possible sans JavaScript.
- **Accessibilité** — HTML sémantique, lien d'évitement, focus visible,
  navigation clavier, contrastes vérifiés sur les deux thèmes, icônes
  décoratives en `aria-hidden`.
- **SEO** — métadonnées Open Graph et données structurées `schema.org/Person`.
- **Impression** — une feuille de styles dédiée nettoie la page (navigation,
  formulaire et animations retirés) pour un export PDF propre.
