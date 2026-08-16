/* =============================================================================
   Portfolio — Romain Lance
   Visionneuse du CV.

   Le PDF s'ouvre dans une fenêtre plein écran, rendu par la visionneuse
   intégrée du navigateur — celle qui apporte déjà le zoom, la recherche,
   l'impression et son propre bouton de téléchargement. Aucune bibliothèque
   n'est chargée pour cela : un lecteur PDF en JavaScript pèserait à lui seul
   plusieurs fois le poids du site.

   Deux précautions :

     · L'<iframe> n'est créée qu'au premier clic. Sans cela, le PDF serait
       téléchargé à l'ouverture de la page par tout le monde, y compris par
       ceux qui ne le liront pas.

     · Tous les navigateurs ne savent pas afficher un PDF en ligne — c'est le
       cas de la plupart des navigateurs mobiles, qui proposent un
       téléchargement à la place. Là, une fenêtre resterait désespérément
       vide : `navigator.pdfViewerEnabled` permet de le savoir avant
       d'ouvrir, et le clic part alors dans un nouvel onglet, où le système
       fait ce qu'il sait faire.

   Sans ce fichier, la carte du CV reste un bouton inerte ; le lien de
   téléchargement placé juste en dessous, lui, fonctionne toujours.
   ========================================================================== */

(function () {
  'use strict';

  var card = document.getElementById('cvCard');
  var modal = document.getElementById('cvModal');
  var frame = document.getElementById('cvFrame');
  var link = document.getElementById('cvDownload');
  if (!card || !modal || !frame || !link) { return; }

  var pdf = link.getAttribute('href');
  var lastFocused = null;
  var built = false;

  /* `pdfViewerEnabled` dit si le navigateur rend les PDF lui-même. La
     propriété est récente ; à défaut, on se fie au pointeur : un pointeur fin
     désigne une machine de bureau, où l'affichage en ligne est la règle. */
  function canDisplayInline() {
    if ('pdfViewerEnabled' in navigator) { return navigator.pdfViewerEnabled; }
    return window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  }

  function build() {
    if (built) { return; }
    built = true;

    var title = document.documentElement.lang === 'en'
      ? 'Romain Lance — curriculum vitae'
      : 'Curriculum vitae de Romain Lance';

    /* `zoom=page-fit` demande à la visionneuse d'afficher la page entière :
       sans ça, un A4 s'ouvre à 100 % et déborde de la fenêtre dès que
       l'écran est un peu juste. C'est le seul paramètre d'URL que la
       visionneuse de Chromium honore — `view=FitH`, `navpanes` et `pagemode`
       sont ignorés, et en accoler un second avec `&` casse jusqu'à la lecture
       du zoom.

       L'<iframe> est écrite en balisage plutôt que construite avec
       `createElement` : le fragment n'est lu qu'au moment où l'analyseur HTML
       rencontre l'attribut `src`. Posé ensuite depuis JavaScript, il est
       ignoré et le document s'ouvre à 100 %. Les deux chaînes insérées ici
       sont des littéraux du fichier, rien ne vient de l'extérieur. */
    frame.innerHTML = '<iframe src="' + pdf + '#zoom=page-fit" title="' + title + '"></iframe>';
  }

  function open() {
    // Pas de rendu en ligne possible : l'onglet est plus utile qu'une fenêtre
    // vide, et le navigateur y proposera son propre téléchargement.
    if (!canDisplayInline()) {
      window.open(pdf, '_blank', 'noopener');
      return;
    }

    lastFocused = document.activeElement;
    modal.hidden = false;
    document.body.classList.add('is-locked');

    requestAnimationFrame(function () {
      modal.classList.add('is-open');   // un frame d'écart : la transition est jouée
      /* L'<iframe> n'est posée qu'ensuite. La visionneuse calcule l'ajustement
         de la page à la taille qu'elle occupe au chargement : insérée avant
         que le panneau soit mis en page, elle mesure une surface qui n'existe
         pas encore et retombe sur un zoom de 100 %. */
      requestAnimationFrame(build);
    });

    var close = modal.querySelector('.modal__close');
    if (close) { close.focus(); }
  }

  function close() {
    modal.classList.remove('is-open');
    document.body.classList.remove('is-locked');
    window.setTimeout(function () { modal.hidden = true; }, 300);
    if (lastFocused && lastFocused.focus) { lastFocused.focus(); }
  }

  card.addEventListener('click', open);

  modal.addEventListener('click', function (e) {
    if (e.target.closest('[data-modal-close]')) { close(); }
  });

  document.addEventListener('keydown', function (e) {
    if (modal.hidden) { return; }

    if (e.key === 'Escape') { close(); return; }

    /* Le focus reste enfermé dans la fenêtre tant qu'elle est ouverte.
       L'<iframe> en fait partie : une fois dedans, c'est la visionneuse du
       navigateur qui gère la tabulation, et Échap continue de fermer. */
    if (e.key === 'Tab') {
      var focusables = modal.querySelectorAll('button, [href], iframe');
      if (!focusables.length) { return; }
      var first = focusables[0];
      var last = focusables[focusables.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  });

})();
