/* =============================================================================
   Portfolio — Romain Lance
   Comportements de la page. Aucune dépendance : uniquement des API natives.

   Le contenu vit dans index.html : ce fichier ne fait qu'ajouter des
   comportements par-dessus. Si le JS ne se charge pas, la page reste
   entièrement lisible et navigable.

   Sommaire
   01. Thème clair / sombre
   02. Menu mobile
   03. Ombre de la barre de navigation
   04. Barre de progression de lecture
   05. Apparitions au scroll
   06. Section active dans la navigation
   07. Copie de l'adresse e-mail
   08. Formulaire de contact (mailto)
   09. Année du pied de page
   ========================================================================== */

(function () {
  'use strict';

  var root = document.documentElement;
  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* 01. THÈME CLAIR / SOMBRE
     ------------------------------------------------------------------------
     Le thème initial est déjà posé par le script inline du <head> (anti-flash).
     Ici on ne gère que la bascule et sa persistance. */
  var themeToggle = document.getElementById('themeToggle');

  function applyTheme(theme) {
    root.dataset.theme = theme;
    if (themeToggle) {
      themeToggle.setAttribute(
        'aria-label',
        theme === 'dark' ? 'Activer le thème clair' : 'Activer le thème sombre'
      );
    }
    try { localStorage.setItem('theme', theme); } catch (e) { /* stockage indisponible */ }
  }

  if (themeToggle) {
    applyTheme(root.dataset.theme || 'light');
    themeToggle.addEventListener('click', function () {
      applyTheme(root.dataset.theme === 'dark' ? 'light' : 'dark');
    });
  }

  // Suit les changements de thème du système, tant que rien n'a été choisi ici
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function (e) {
    var chosen = null;
    try { chosen = localStorage.getItem('theme'); } catch (err) { /* ignoré */ }
    if (!chosen) { root.dataset.theme = e.matches ? 'dark' : 'light'; }
  });


  /* 02. MENU MOBILE
     ---------------------------------------------------------------------- */
  var navToggle = document.getElementById('navToggle');
  var navLinks = document.getElementById('navLinks');

  function closeMenu() {
    if (!navLinks) { return; }
    navLinks.classList.remove('is-open');
    if (navToggle) { navToggle.setAttribute('aria-expanded', 'false'); }
  }

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', function () {
      var open = navLinks.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', String(open));
      navToggle.setAttribute('aria-label', open ? 'Fermer le menu' : 'Ouvrir le menu');
    });

    // Refermer après un clic sur un lien, ou avec la touche Échap
    navLinks.addEventListener('click', function (e) {
      if (e.target.closest('a')) { closeMenu(); }
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') { closeMenu(); }
    });
  }


  /* 03. OMBRE DE LA BARRE DE NAVIGATION
     04. BARRE DE PROGRESSION DE LECTURE
     ------------------------------------------------------------------------
     Les deux dépendent du défilement : on les traite dans le même callback,
     lissé par requestAnimationFrame pour ne pas saturer le thread principal. */
  var nav = document.getElementById('nav');
  var progressBar = document.getElementById('progressBar');
  var ticking = false;

  function onScroll() {
    var y = window.scrollY;

    if (nav) { nav.classList.toggle('is-stuck', y > 8); }

    if (progressBar) {
      var scrollable = document.documentElement.scrollHeight - window.innerHeight;
      var ratio = scrollable > 0 ? Math.min(y / scrollable, 1) : 0;
      progressBar.style.width = (ratio * 100).toFixed(2) + '%';
    }

    updateActiveSection();

    ticking = false;
  }

  window.addEventListener('scroll', function () {
    if (!ticking) {
      window.requestAnimationFrame(onScroll);
      ticking = true;
    }
  }, { passive: true });


  /* 05. APPARITIONS AU SCROLL
     ------------------------------------------------------------------------
     La classe .reveal-ready n'est ajoutée que si IntersectionObserver existe.
     Sans elle, le CSS laisse tout le contenu visible : pas de page blanche
     en cas d'échec du script. */
  var revealables = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window && !prefersReducedMotion && revealables.length) {
    document.body.classList.add('reveal-ready');

    // Décalage progressif entre éléments frères, pour une entrée en cascade
    var groups = {};
    revealables.forEach(function (el) {
      var key = el.parentElement ? (el.parentElement.className || 'root') : 'root';
      groups[key] = (groups[key] || 0);
      el.style.setProperty('--i', Math.min(groups[key], 4));
      groups[key] += 1;
    });

    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target); // une seule animation par élément
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });

    revealables.forEach(function (el) { revealObserver.observe(el); });
  }


  /* 06. SECTION ACTIVE DANS LA NAVIGATION
     ------------------------------------------------------------------------
     Calcul déterministe à chaque frame de défilement : on compare la position
     de chaque section à une ligne fixe placée sous la barre de navigation.
     Plus prévisible qu'un IntersectionObserver, dont le résultat dépend de
     l'ordre d'arrivée des entrées. */
  var navAnchors = Array.prototype.slice.call(
    document.querySelectorAll('.nav__links a[href^="#"]')
  );
  var sections = navAnchors
    .map(function (a) { return document.querySelector(a.getAttribute('href')); })
    .filter(Boolean);

  // Ligne de déclenchement virtuelle, placée sous la barre de navigation
  var ACTIVE_LINE = 140;

  function updateActiveSection() {
    if (!sections || !sections.length) { return; }

    // On retient la DERNIÈRE section dont le haut a franchi la ligne :
    // se contenter de la première section visible garderait la section
    // sortante active tant qu'il en reste quelques pixels à l'écran.
    var currentId = null;
    for (var i = 0; i < sections.length; i++) {
      if (sections[i].getBoundingClientRect().top <= ACTIVE_LINE) {
        currentId = sections[i].id;
      }
    }

    // En bas de page, la dernière section ne peut plus atteindre la ligne :
    // on la force pour que « Contact » s'allume bien en fin de parcours.
    var atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;
    if (atBottom) { currentId = sections[sections.length - 1].id; }

    navAnchors.forEach(function (a) {
      a.classList.toggle('is-active', a.getAttribute('href') === '#' + currentId);
    });
  }

  // Le redimensionnement déplace les sections sans provoquer de scroll
  window.addEventListener('resize', updateActiveSection, { passive: true });

  // Premier passage : barre de navigation, progression et section active
  onScroll();


  /* 07. COPIE DE L'ADRESSE E-MAIL
     ---------------------------------------------------------------------- */
  var copyBtn = document.getElementById('copyMail');

  if (copyBtn) {
    copyBtn.addEventListener('click', function () {
      var value = copyBtn.dataset.copy || '';

      function confirmCopy() {
        var original = copyBtn.textContent;
        copyBtn.textContent = 'Copié';
        copyBtn.classList.add('is-done');
        window.setTimeout(function () {
          copyBtn.textContent = original;
          copyBtn.classList.remove('is-done');
        }, 1800);
      }

      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(value).then(confirmCopy).catch(fallbackCopy);
      } else {
        fallbackCopy();
      }

      // Repli pour les navigateurs sans Clipboard API (ou en http://)
      function fallbackCopy() {
        var tmp = document.createElement('textarea');
        tmp.value = value;
        tmp.setAttribute('readonly', '');
        tmp.style.position = 'absolute';
        tmp.style.left = '-9999px';
        document.body.appendChild(tmp);
        tmp.select();
        try { document.execCommand('copy'); confirmCopy(); } catch (e) { /* abandon silencieux */ }
        document.body.removeChild(tmp);
      }
    });
  }


  /* 08. FORMULAIRE DE CONTACT (MAILTO)
     ------------------------------------------------------------------------
     Pas de backend : on assemble un lien mailto: et on laisse le client de
     messagerie du visiteur prendre le relais. */
  var form = document.getElementById('contactForm');
  var note = document.getElementById('formNote');
  var RECIPIENT = 'romain.lance@outlook.com';

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var name = form.elements.name.value.trim();
      var subject = form.elements.subject.value.trim();
      var message = form.elements.message.value.trim();

      // Validation minimale, signalée visuellement champ par champ
      var missing = [];
      [['name', name], ['subject', subject], ['message', message]].forEach(function (pair) {
        var field = form.elements[pair[0]];
        var empty = pair[1] === '';
        field.classList.toggle('is-invalid', empty);
        if (empty) { missing.push(field); }
      });

      if (missing.length) {
        if (note) { note.textContent = 'Merci de compléter les trois champs avant d\'envoyer.'; }
        missing[0].focus();
        return;
      }

      var body = message + '\n\n— ' + name;
      var href = 'mailto:' + RECIPIENT +
        '?subject=' + encodeURIComponent(subject) +
        '&body=' + encodeURIComponent(body);

      window.location.href = href;

      if (note) {
        note.textContent = 'Votre messagerie devrait s\'ouvrir. Si rien ne se passe, écrivez directement à ' + RECIPIENT + '.';
      }
    });

    // Efface l'état d'erreur dès que le visiteur corrige
    form.addEventListener('input', function (e) {
      if (e.target.classList) { e.target.classList.remove('is-invalid'); }
    });
  }


  /* 09. ANNÉE DU PIED DE PAGE
     ---------------------------------------------------------------------- */
  var year = document.getElementById('year');
  if (year) { year.textContent = String(new Date().getFullYear()); }

})();
