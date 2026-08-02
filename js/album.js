/* =============================================================================
   Portfolio — Romain Lance
   Albums photo (projets personnels et TP académiques).

   Une carte d'album ouvre une fenêtre modale contenant les photos du projet
   et son texte. Les fiches détaillées vivent déjà dans le HTML, à l'intérieur
   de la fenêtre : rien n'est fabriqué à la volée, ce qui garde le contenu
   lisible par les moteurs de recherche et — c'est important ici — traduisible
   par js/i18n.js, qui relève les nœuds de texte une fois pour toutes.

   Seuls les repères de navigation (flèches et pastilles) sont produits par ce
   fichier : ce sont des commandes, pas du contenu.

   Sommaire
   01. Repères
   02. Navigation dans une fiche
   03. Ouverture et fermeture
   04. Clavier, gestes et branchements
   ========================================================================== */

(function () {
  'use strict';

  var modal = document.getElementById('albumModal');
  var cards = document.querySelectorAll('[data-album]');
  if (!modal || !cards.length) { return; }

  var panel    = modal.querySelector('.modal__panel');
  var controls = document.getElementById('albumControls');
  var prevBtn  = document.getElementById('albumPrev');
  var nextBtn  = document.getElementById('albumNext');
  var dotsBox  = document.getElementById('albumDots');
  var counter  = document.getElementById('albumCounter');

  var current = null;   // fiche affichée
  var slides  = [];     // ses figures
  var index   = 0;
  var lastFocused = null;


  /* 01. REPÈRES
     ------------------------------------------------------------------------
     Les libellés suivent la langue affichée au moment de l'ouverture. Comme
     ces boutons n'existent pas au moment où i18n.js relève la page, ils ne
     peuvent pas passer par le dictionnaire — ils sont donc écrits ici, dans
     les deux langues. */
  function t(fr, en) { return document.documentElement.lang === 'en' ? en : fr; }

  function buildDots() {
    dotsBox.innerHTML = '';
    if (slides.length < 2) { return; }

    slides.forEach(function (slide, i) {
      var li = document.createElement('li');
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'album__dot';
      b.setAttribute('aria-label', t('Photo ', 'Photo ') + (i + 1));
      b.addEventListener('click', function () { show(i); });
      li.appendChild(b);
      dotsBox.appendChild(li);
    });
  }

  function refreshControls() {
    var many = slides.length > 1;
    controls.hidden = !many;

    if (many) {
      counter.textContent = (index + 1) + ' / ' + slides.length;
      Array.prototype.forEach.call(dotsBox.children, function (li, i) {
        li.firstChild.classList.toggle('is-current', i === index);
        li.firstChild.setAttribute('aria-current', i === index ? 'true' : 'false');
      });
    }

    prevBtn.setAttribute('aria-label', t('Photo précédente', 'Previous photo'));
    nextBtn.setAttribute('aria-label', t('Photo suivante', 'Next photo'));
  }


  /* 02. NAVIGATION DANS UNE FICHE
     ------------------------------------------------------------------------
     Les photos sont toutes dans le DOM ; une seule porte .is-current. La
     boucle est circulaire : après la dernière on revient à la première. */
  function show(i) {
    if (!slides.length) { return; }
    index = (i + slides.length) % slides.length;

    slides.forEach(function (slide, n) {
      slide.classList.toggle('is-current', n === index);
      // Les photos masquées sortent de l'ordre de tabulation
      slide.setAttribute('aria-hidden', n === index ? 'false' : 'true');
    });

    refreshControls();
  }


  /* 03. OUVERTURE ET FERMETURE
     ---------------------------------------------------------------------- */
  function open(id, trigger) {
    var detail = document.getElementById(id);
    if (!detail) { return; }

    if (current) { current.hidden = true; }
    current = detail;
    current.hidden = false;

    slides = Array.prototype.slice.call(current.querySelectorAll('.album__slide'));

    // Un seul jeu de commandes pour toutes les fiches : il suit celle qu'on
    // ouvre, plutôt que d'être recopié cinq fois dans le HTML.
    var viewer = current.querySelector('.album__viewer');
    if (viewer) {
      viewer.appendChild(controls);
      controls.hidden = slides.length < 2;
    }

    // La fenêtre emprunte le titre de la fiche affichée
    var title = current.querySelector('[id$="-title"]');
    if (title) { modal.setAttribute('aria-labelledby', title.id); }

    buildDots();
    show(0);

    lastFocused = trigger || document.activeElement;
    modal.hidden = false;
    document.body.classList.add('is-locked');
    requestAnimationFrame(function () { modal.classList.add('is-open'); });

    var close = modal.querySelector('.modal__close');
    if (close) { close.focus(); }
  }

  function close() {
    modal.classList.remove('is-open');
    document.body.classList.remove('is-locked');
    window.setTimeout(function () {
      modal.hidden = true;
      if (current) { current.hidden = true; current = null; }
      slides = [];
    }, 300);

    if (lastFocused && lastFocused.focus) { lastFocused.focus(); }
  }


  /* 04. CLAVIER, GESTES ET BRANCHEMENTS
     ---------------------------------------------------------------------- */
  cards.forEach(function (card) {
    card.addEventListener('click', function (e) {
      // Une vignette peut être imbriquée dans un bloc lui-même cliquable
      // (une expérience du parcours, qui se recentre au clic) : l'ouverture
      // de l'album prime, et le geste ne doit pas déclencher les deux.
      e.stopPropagation();
      open(card.dataset.album, card);
    });
  });

  prevBtn.addEventListener('click', function () { show(index - 1); });
  nextBtn.addEventListener('click', function () { show(index + 1); });

  modal.addEventListener('click', function (e) {
    if (e.target.closest('[data-modal-close]')) { close(); }
  });

  document.addEventListener('keydown', function (e) {
    if (modal.hidden) { return; }

    if (e.key === 'Escape')     { close(); return; }
    if (e.key === 'ArrowLeft')  { show(index - 1); return; }
    if (e.key === 'ArrowRight') { show(index + 1); return; }

    // Le focus reste enfermé dans la fenêtre tant qu'elle est ouverte
    if (e.key === 'Tab') {
      var focusables = Array.prototype.filter.call(
        modal.querySelectorAll('button:not([hidden]), [href], [tabindex]:not([tabindex="-1"])'),
        function (el) { return el.offsetParent !== null; }
      );
      if (!focusables.length) { return; }

      var first = focusables[0];
      var last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });

  /* Balayage horizontal sur écran tactile. Le seuil évite de déclencher un
     changement de photo sur un simple défilement vertical de la page. */
  (function initSwipe() {
    var THRESHOLD = 45;
    var startX = null, startY = null;

    panel.addEventListener('touchstart', function (e) {
      startX = e.changedTouches[0].clientX;
      startY = e.changedTouches[0].clientY;
    }, { passive: true });

    panel.addEventListener('touchend', function (e) {
      if (startX === null) { return; }
      var dx = e.changedTouches[0].clientX - startX;
      var dy = e.changedTouches[0].clientY - startY;
      startX = startY = null;

      if (Math.abs(dx) < THRESHOLD || Math.abs(dx) < Math.abs(dy)) { return; }
      show(dx < 0 ? index + 1 : index - 1);
    }, { passive: true });
  })();

})();
