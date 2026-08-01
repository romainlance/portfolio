# Portfolio — Romain Lance

Site vitrine personnel d'un profil **ingénieur mécatronique & robotique** : une
page unique découpée en sections ancrées (à propos, parcours, projets,
compétences, formation, contact).

HTML / CSS / JavaScript natifs, sans framework ni étape de build. Le seul
appel externe est la feuille de styles Google Fonts.

---

## Lancer le site en local

Le site est constitué de fichiers statiques : ouvrir `index.html` dans un
navigateur suffit pour un aperçu rapide.

Pour se placer dans des conditions réelles (chemins relatifs, `localStorage`,
API presse-papiers), mieux vaut passer par un petit serveur local :

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
├── index.html        # Contenu et structure de toutes les sections
├── css/
│   └── style.css     # Thèmes, mise en page, composants, responsive, impression
├── js/
│   └── main.js       # Thème clair/sombre, menu mobile, animations, formulaire
└── README.md
```

Le contenu est écrit directement dans `index.html`, ce qui garde le site
lisible sans JavaScript et correctement indexé par les moteurs de recherche.
`main.js` n'ajoute que des comportements par-dessus.

---

## Déploiement

### GitHub Pages

1. Pousser le projet sur la branche voulue du dépôt.
2. Dans le dépôt : **Settings → Pages**.
3. *Source* : « Deploy from a branch », choisir la branche et le dossier `/ (root)`.
4. Le site est publié sous `https://<utilisateur>.github.io/<dépôt>/` après une
   ou deux minutes.

Aucune configuration supplémentaire n'est nécessaire : pas de build, pas de
fichier de config, et aucun dossier commençant par `_` (donc pas besoin de
`.nojekyll`).

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

Tout se modifie dans `index.html`. Les sections sont délimitées par des
commentaires numérotés (`01 — À PROPOS`, `02 — PARCOURS PROFESSIONNEL`, etc.),
et chaque bloc reprend la même structure : il suffit de dupliquer un élément
existant pour en ajouter un.

- Une expérience : copier un `<li class="tl reveal">` dans `<ol class="timeline">`.
- Un projet : copier un `<article class="card reveal">`.
- Une compétence : ajouter un `<li>` dans la liste `.tags` correspondante.

### Remplacer le monogramme par une photo

Le hero affiche un placeholder « RL » (aucune photo ne figurait dans le CV).
Pour utiliser une vraie photo, déposer le fichier dans un dossier `assets/`
puis remplacer, dans `index.html` :

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

- **Thème clair / sombre** — suit la préférence système au premier chargement,
  puis mémorise le choix dans `localStorage`. Un court script inline dans le
  `<head>` applique le thème avant le premier rendu pour éviter le flash blanc.
- **Animations** — apparitions en fondu via `IntersectionObserver`, désactivées
  automatiquement si le système demande `prefers-reduced-motion: reduce`.
- **Formulaire de contact** — sans backend : le JavaScript compose un lien
  `mailto:` et ouvre la messagerie du visiteur. L'adresse reste affichée en
  clair à côté, donc le contact reste possible même sans JavaScript.
- **Accessibilité** — HTML sémantique, lien d'évitement, focus visible,
  navigation clavier, contrastes vérifiés sur les deux thèmes.
- **SEO** — métadonnées Open Graph et données structurées `schema.org/Person`.
- **Impression** — une feuille de styles dédiée nettoie la page (navigation,
  formulaire et animations retirés) pour un export PDF propre.
