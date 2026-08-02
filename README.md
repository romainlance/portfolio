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
├── index.html                  # Page d'accueil : les 8 sections ancrées
├── assets/
│   ├── cv-romain-lance.pdf     # CV publié (sans le numéro de téléphone)
│   ├── cv-romain-lance-en.pdf  # Version anglaise — à déposer (voir plus bas)
│   ├── cv-preview.webp         # Vignette du CV, rendue depuis ce PDF
│   ├── albums/                 # Photos des projets personnels et des TP
│   ├── projets/                # Photos des projets (cartes et pages)
│   └── parcours/               # Photos illustrant le parcours
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
│   ├── qr.js                   # Encodeur de QR code (aucune dépendance)
│   ├── main.js                 # Thème, menu, navigation, formulaire
│   ├── effects.js              # Effets visuels uniquement
│   ├── album.js                # Fenêtre des albums photo
│   ├── video.js                # Façades vidéo (YouTube au clic seulement)
│   └── i18n.js                 # Bascule français / anglais
├── tools/
│   └── photos.py               # Conversion des photos en WebP
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
thème, la bascule de langue et le formulaire continuent de marcher.

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
- Un album : voir « Les albums photo » plus bas.

En ajoutant une section, penser à trois choses : son numéro (`.section__num`),
son lien dans `.nav__links`, et son entrée dans le dictionnaire de traduction.

### Ajouter un projet

1. Dupliquer une page de `projets/` et l'adapter.
2. Dans `index.html`, dupliquer un bloc `<a class="pcard reveal tilt" …>` et
   pointer son `href` vers la nouvelle page.
3. Mettre à jour le lien « projet suivant » en bas des pages projet pour
   inclure la nouvelle dans la boucle.

La vignette d'une carte est une photo, cadrée en 5:3 pour que les cartes
d'une rangée restent alignées quelles que soient les proportions du cliché :

```html
<div class="pcard__media pcard__media--photo">
  <img class="pcard__photo" src="assets/projets/mon-projet/1-sm.webp"
       width="800" height="600" loading="lazy" decoding="async" alt="…">
  <span class="pcard__index" aria-hidden="true">05</span>
</div>
```

Pour une photo dont tu n'es pas l'auteur, ajouter le crédit dans la vignette —
c'est une mention obligatoire, pas une décoration :

```html
<span class="pcard__credit">Photo : Nom de l'auteur</span>
```

Une expérience du parcours qui a donné lieu à une page projet peut y renvoyer
directement, avec un `<a class="tl__link">` placé après ses étiquettes.

### Remplacer le CV

Le hero affiche `assets/cv-preview.webp`, une image de la première page de
`assets/cv-romain-lance.pdf`. Pour publier une nouvelle version : remplacer le
PDF, puis régénérer la vignette (n'importe quel export d'image de la page 1
convient, autour de 900 px de large). Les deux fichiers doivent rester
cohérents — c'est le PDF qui s'ouvre au clic.

Le PDF publié ne contient volontairement pas de numéro de téléphone.

### Le QR code

`js/qr.js` encode le QR au moment où la fenêtre s'ouvre, à partir de
`location.href`. Il n'y a donc aucune image à régénérer après un changement
d'hébergement ou de domaine : le code suit toujours l'adresse réelle.

L'implémentation couvre le mode octet, le niveau de correction M et les
versions 1 à 10 (jusqu'à 213 caractères) — largement au-delà d'une URL de
portfolio. Sa sortie a été vérifiée en décodant les symboles produits.

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

### Les albums photo

Les sections **Projets personnels** et **TP académiques** présentent chacune
des cartes qui ouvrent une fenêtre contenant les photos du projet et son texte.

Le contenu de ces fiches n'est pas fabriqué au clic : il vit dans le HTML, à
l'intérieur du bloc `#albumModal`, en bas de `index.html`. Deux raisons — il
reste lisible par les moteurs de recherche, et il est relevé par `js/i18n.js`,
qui ne voit que les nœuds de texte présents au chargement.

Pour ajouter un album :

1. **Convertir les photos** (voir la section suivante) dans
   `assets/albums/mon-projet/`.
2. **Ajouter la carte** dans la grille `.albums` de la section voulue :
   dupliquer un `<button class="album reveal tilt" data-album="alb-mon-projet">`
   et pointer sa couverture sur `1-sm.webp`.
3. **Ajouter la fiche** dans `#albumModal` : dupliquer un
   `<article class="album__detail" id="alb-mon-projet">`, avec une
   `<figure class="album__slide">` par photo. La première porte `is-current`.
4. Le titre de la fiche doit avoir un `id` finissant par `-title` : c'est lui
   qui nomme la fenêtre pour les lecteurs d'écran.

Les flèches, les pastilles et le compteur sont uniques (`#albumControls`) et
déplacés par `js/album.js` dans la fiche ouverte — rien à dupliquer. Ils
disparaissent d'eux-mêmes pour un album d'une seule photo.

La visionneuse se pilote au clic, aux flèches ← →, par balayage sur écran
tactile, et se ferme avec Échap ou un clic à l'extérieur.

Une photo isolée peut ouvrir la même visionneuse sans passer par une carte :
c'est le cas de la vignette du stage Industeam dans le parcours. Il suffit de
poser `data-album="…"` sur n'importe quel bouton.

### Ajouter des photos

`tools/photos.py` convertit un dossier de photos en WebP, en deux tailles :
une vue pleine de 1 600 px pour la visionneuse et une vignette de 800 px pour
les cartes.

```bash
pip install pillow pillow-heif
python3 tools/photos.py ~/photos-du-projet assets/albums/mon-projet
```

Les fichiers sont numérotés dans l'ordre alphabétique des sources — renommer
celles-ci (`01-vue-generale.heic`, `02-detail.heic`…) suffit à fixer l'ordre de
l'album. L'orientation EXIF est appliquée avant redimensionnement, ce qui évite
les photos couchées.

Les attributs `width` et `height` des `<img>` doivent correspondre aux
dimensions réelles du fichier : ils réservent la place et évitent que la page
sursaute pendant le chargement.

### Les vidéos

Les vidéos sont hébergées sur YouTube et non dans le dépôt. Un fichier de
plusieurs dizaines de mégaoctets dépasse la limite de 100 Mo par fichier de
GitHub, alourdit chaque `git clone`, et GitHub Pages ne sait pas le servir en
streaming : le visiteur téléchargerait tout avant de voir la première image.

**Rien n'est chargé depuis YouTube avant un clic.** La page n'affiche qu'une
façade — une image du projet, hébergée ici, et un bouton de lecture. Au clic
seulement, `js/video.js` crée l'`<iframe>`, sur le domaine sans cookie
`youtube-nocookie.com`. Un lecteur YouTube pèse plusieurs centaines de
kilooctets : deux d'entre eux mettraient plus de temps à s'afficher que tout
le reste du site réuni.

Pour ajouter une vidéo :

```html
<div class="embed" data-video="IDENTIFIANT" data-label="Nom du projet"
     data-poster="assets/albums/mon-projet/1-sm.webp">
  <!-- Repli sans JavaScript : le lien reste utilisable -->
  <a href="https://youtu.be/IDENTIFIANT" target="_blank" rel="noopener noreferrer">
    Voir la vidéo sur YouTube
  </a>
</div>
```

- `data-video` — l'identifiant, c'est-à-dire ce qui suit `youtu.be/`.
- `data-poster` — facultatif. Sans affiche, la surface reprend la grille
  technique du fond de page plutôt que de rester vide.
- `data-portrait` — pour un Short, qui passe alors en 9:16 et se limite en
  largeur.

Le bloc s'insère aussi bien dans une fiche d'album, à la place d'une
`<figure class="album__slide">`, que dans une page projet, entouré d'une
`<figure class="filmstrip">` qui porte la légende.

Si tu préfères un jour tout héberger toi-même, `ffmpeg` produit un fichier
web raisonnable à partir d'une vidéo de téléphone :

```bash
# 1080p → 720p, ~1,5 Mbit/s : divise le poids par 5 à 10
ffmpeg -i source.mov -vf "scale=-2:720" -c:v libx264 -crf 28 \
       -preset slow -movflags +faststart -c:a aac -b:a 96k sortie.mp4
```

`-movflags +faststart` déplace l'index en tête de fichier, pour que la lecture
démarre sans attendre le téléchargement complet.

### La bascule français / anglais

Le bouton `EN` / `FR` de la barre d'en-tête traduit le site entier. Le
mécanisme tient dans `js/i18n.js` :

- **Le français vit dans le HTML.** C'est la version servie sans JavaScript et
  celle que lisent les moteurs de recherche ; l'anglais est appliqué par-dessus.
- **Le dictionnaire est indexé par la phrase française elle-même**, pas par des
  clés abstraites. Le HTML reste donc lisible, et une chaîne oubliée se repère
  immédiatement : elle s'affiche en français au milieu de l'anglais.
- La comparaison se fait après normalisation des blancs. Une phrase coupée sur
  plusieurs lignes dans le HTML, ou contenant des espaces insécables, est
  retrouvée sans avoir à recopier sa mise en forme dans le dictionnaire.
- Sont traduits : le texte visible, les attributs `title`, `aria-label`,
  `placeholder` et `alt`, le `<title>` de la page et l'attribut `lang` de
  `<html>`. Le choix est mémorisé dans `localStorage`.

Pour ajouter une phrase, compléter l'objet correspondant en haut du fichier
(`UI`, `HOME`, `PROJECTS`, `ATTRS` ou `TITLES`) :

```js
'Ma nouvelle phrase.': 'My new sentence.',
```

Les noms propres, les technologies (ROS 2, SolidWorks, Python…) et les nombres
n'ont volontairement pas d'entrée : ils sont identiques dans les deux langues.

### Le CV en anglais

Le lien de l'aperçu du CV suit la langue affichée :

| Langue | Fichier ouvert |
| --- | --- |
| Français | `assets/cv-romain-lance.pdf` + `assets/cv-preview.webp` |
| Anglais | `assets/cv-romain-lance-en.pdf` + `assets/cv-preview-en.webp` |

Le lien du PDF **et** la vignette affichée suivent tous deux la langue.

Chaque fichier anglais est testé une seule fois, à la première bascule, et
indépendamment de l'autre. **Tant qu'il n'est pas déposé dans `assets/`, c'est
la version française qui reste en place** plutôt qu'un lien mort ou une image
cassée — il suffit donc d'ajouter les fichiers, sans toucher au code. Le test
laisse une erreur 404 dans la console du navigateur ; elle disparaît dès que le
fichier existe.

Ces deux noms de fichiers sont définis en haut de `js/i18n.js`, dans l'objet
`CV`.

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
- **Relief 3D** — la classe `.tilt` suffit à faire pencher un bloc vers le
  curseur. L'amplitude est proportionnée à sa taille : cinq degrés sur une
  petite carte, moins de trois sur un panneau large, qui paraîtrait sinon se
  tordre. Le décollement au survol passe par la variable `--lift`, pour se
  composer avec la rotation au lieu de l'écraser.
- **Expériences cliquables** — un clic sur une entrée du parcours la recentre
  à l'écran. C'est un confort de lecture : rien n'est masqué au départ et le
  geste est accessible au clavier.
- **Aperçu du CV** — bloc de verre avec relief au pointeur ; le clic ouvre le
  PDF dans un nouvel onglet.
- **QR code** — calculé à l'ouverture depuis l'URL courante, présenté dans une
  fenêtre modale avec fond clair imposé (un code sombre sur fond sombre n'est
  pas lisible par un appareil photo), fermeture par Échap ou clic extérieur, et
  focus maintenu dans la fenêtre.
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
- **Bascule de langue** — traduction appliquée sur les nœuds de texte déjà
  présents, sans rechargement ni duplication des pages. Voir
  « La bascule français / anglais » plus haut.
- **Albums photo** — fenêtre modale avec visionneuse : flèches, pastilles,
  compteur, navigation au clavier et balayage tactile. Le fond de page est gelé
  pendant l'ouverture ; la gouttière de défilement étant réservée en permanence
  (`scrollbar-gutter: stable`), la page ne saute pas.
- **Images** — toutes en WebP, chargées à la demande (`loading="lazy"`) et
  dimensionnées dans le HTML pour réserver leur place avant chargement.
- **Rythme vertical** — dans une section de page projet, tout bloc qui suit le
  texte courant (caractéristiques, photos, vidéo, étiquettes, outils) prend la
  même respiration, définie une seule fois dans `css/project.css`.
- **Vidéos** — façade locale, lecteur YouTube créé au clic seulement, sur le
  domaine sans cookie. Rien ne part vers Google avant un geste explicite.
- **SEO** — métadonnées Open Graph et données structurées `schema.org/Person`.
- **Impression** — une feuille de styles dédiée nettoie la page (navigation,
  formulaire et animations retirés) pour un export PDF propre.
