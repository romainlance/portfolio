/* =============================================================================
   Portfolio — Romain Lance
   Comportements de la page. Aucune dépendance : uniquement des API natives.

   Partagé par la page d'accueil et les pages projet. Chaque bloc vérifie la
   présence de ses éléments : ce qui n'existe pas sur une page donnée est
   simplement ignoré.

   Le contenu vit dans le HTML : ce fichier ne fait qu'ajouter des
   comportements par-dessus. Si le JS ne se charge pas, la page reste
   entièrement lisible et navigable.

   Sommaire
   01. Thème clair / sombre
   02. Menu mobile
   03. Barre de navigation et progression de lecture
   04. Apparitions au scroll
   05. Section active dans la navigation
   06. Recentrage d'une expérience
   07. Fenêtre du QR code
   08. Copie de l'adresse e-mail
   09. Formulaire de contact (mailto)
   10. Année du pied de page
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


  /* 03. BARRE DE NAVIGATION ET PROGRESSION DE LECTURE
     ------------------------------------------------------------------------
     Les deux dépendent du défilement : même callback, lissé par
     requestAnimationFrame pour ne pas saturer le thread principal. */
  var nav = document.getElementById('nav');
  var progressBar = document.getElementById('progressBar');
  var ticking = false;

  // Les effets visuels s'abonnent ici plutôt que d'ajouter leur propre
  // écouteur de scroll (voir js/effects.js).
  var scrollHandlers = [];
  window.portfolioOnScroll = function (fn) {
    if (typeof fn === 'function') { scrollHandlers.push(fn); fn(); }
  };

  function onScroll() {
    var y = window.scrollY;

    if (nav) { nav.classList.toggle('is-stuck', y > 8); }

    if (progressBar) {
      var scrollable = document.documentElement.scrollHeight - window.innerHeight;
      var ratio = scrollable > 0 ? Math.min(y / scrollable, 1) : 0;
      progressBar.style.width = (ratio * 100).toFixed(2) + '%';
    }

    updateActiveSection();

    for (var i = 0; i < scrollHandlers.length; i++) { scrollHandlers[i](); }

    ticking = false;
  }

  window.addEventListener('scroll', function () {
    if (!ticking) {
      window.requestAnimationFrame(onScroll);
      ticking = true;
    }
  }, { passive: true });


  /* 04. APPARITIONS AU SCROLL
     ------------------------------------------------------------------------
     La classe .reveal-ready n'est ajoutée que si IntersectionObserver existe.
     Sans elle, le CSS laisse tout le contenu visible : pas de page blanche
     en cas d'échec du script.

     La variante d'animation (translation, échelle) se choisit dans le HTML
     via data-reveal ; le décalage en cascade est calculé ici. */
  var revealables = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window && !prefersReducedMotion && revealables.length) {
    document.body.classList.add('reveal-ready');

    // Décalage progressif entre éléments frères
    var counters = new Map();
    revealables.forEach(function (el) {
      var parent = el.parentElement || document.body;
      var n = counters.get(parent) || 0;
      el.style.setProperty('--i', Math.min(n, 5));
      counters.set(parent, n + 1);
    });

    // Éléments encore à révéler, pour le rattrapage décrit plus bas
    var pending = new Set(revealables);

    function show(el) {
      el.classList.add('is-visible');
      pending.delete(el);
      revealObserver.unobserve(el); // une seule animation par élément
    }

    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { show(entry.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });

    revealables.forEach(function (el) { revealObserver.observe(el); });

    /* Rattrapage des éléments franchis sans être vus.
       Un IntersectionObserver ne notifie qu'un changement d'état : si la page
       saute directement au-delà d'un élément — clic sur une ancre, ouverture
       sur un #fragment, rechargement qui restaure la position — celui-ci passe
       de « pas encore visible » à « déjà dépassé » sans jamais croiser le
       viewport, et resterait invisible si l'on remontait.
       On révèle donc au passage tout ce qui se retrouve au-dessus de l'écran. */
    window.portfolioOnScroll(function () {
      if (!pending.size) { return; }
      pending.forEach(function (el) {
        if (el.getBoundingClientRect().bottom < 0) { show(el); }
      });
    });
  }


  /* 05. SECTION ACTIVE DANS LA NAVIGATION
     ------------------------------------------------------------------------
     Calcul déterministe à chaque frame de défilement : on compare la position
     de chaque section à une ligne fixe placée sous la barre de navigation.
     Plus prévisible qu'un IntersectionObserver, dont le résultat dépend de
     l'ordre d'arrivée des entrées.

     Sans liens d'ancre dans la barre (pages projet), la fonction ne fait rien. */
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


  /* 06. RECENTRAGE D'UNE EXPÉRIENCE
     ------------------------------------------------------------------------
     Cliquer une expérience du parcours la ramène au centre de l'écran, pour
     l'isoler du reste de la timeline pendant la lecture.

     C'est un confort de lecture, pas une navigation : aucun contenu n'est
     masqué au départ et rien n'est perdu si le clic n'est pas déclenché.
     Le tabindex posé dans le HTML rend le geste accessible au clavier. */
  var experiences = document.querySelectorAll('.tl');

  experiences.forEach(function (item) {
    function center() {
      item.scrollIntoView({
        block: 'center',
        behavior: prefersReducedMotion ? 'auto' : 'smooth'
      });
    }

    item.addEventListener('click', center);

    item.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'Spacebar') {
        e.preventDefault();          // empêche la barre d'espace de faire défiler
        center();
      }
    });
  });


  /* 07. FENÊTRE DU QR CODE
     ------------------------------------------------------------------------
     Le code est calculé à l'ouverture depuis `location.href`, il pointe donc
     toujours vers l'adresse réelle du site quel que soit l'hébergement.
     Sans js/qr.js chargé, le bouton se retire de lui-même. */
  var qrToggle = document.getElementById('qrToggle');
  var qrModal = document.getElementById('qrModal');

  if (qrToggle && qrModal) {
    var qrTarget = document.getElementById('qrTarget');
    var qrUrlLabel = document.getElementById('qrUrl');
    var lastFocused = null;
    var qrDrawn = false;

    if (typeof window.QRCode === 'undefined') {
      qrToggle.remove();          // l'encodeur n'est pas là : pas de bouton mort
    } else {

      function drawQR() {
        if (qrDrawn) { return; }

        // On retire le fragment : il n'apporte rien une fois sur mobile et
        // rallongerait l'URL, donc la densité du code.
        var url = window.location.href.split('#')[0];
        var code = window.QRCode.build(url);
        var quiet = 2;                       // marge silencieuse, en modules
        var span = code.size + quiet * 2;

        var parts = [
          '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' + span + ' ' + span +
          '" role="img" aria-label="QR code vers ' + url + '">',
          '<rect width="' + span + '" height="' + span + '" fill="#ffffff"/>'
        ];
        for (var y = 0; y < code.size; y++) {
          for (var x = 0; x < code.size; x++) {
            if (code.get(x, y)) {
              parts.push('<rect x="' + (x + quiet) + '" y="' + (y + quiet) +
                         '" width="1" height="1" fill="#14161a"/>');
            }
          }
        }
        parts.push('</svg>');

        qrTarget.innerHTML = parts.join('');
        if (qrUrlLabel) { qrUrlLabel.textContent = url; }
        qrDrawn = true;
      }

      function openQR() {
        drawQR();
        lastFocused = document.activeElement;
        qrModal.hidden = false;
        // Un frame d'écart pour que la transition d'ouverture soit jouée
        requestAnimationFrame(function () { qrModal.classList.add('is-open'); });
        qrToggle.setAttribute('aria-expanded', 'true');
        var close = qrModal.querySelector('.modal__close');
        if (close) { close.focus(); }
      }

      function closeQR() {
        qrModal.classList.remove('is-open');
        qrToggle.setAttribute('aria-expanded', 'false');
        window.setTimeout(function () { qrModal.hidden = true; }, 300);
        if (lastFocused && lastFocused.focus) { lastFocused.focus(); }
      }

      qrToggle.setAttribute('aria-expanded', 'false');
      qrToggle.addEventListener('click', openQR);

      qrModal.addEventListener('click', function (e) {
        if (e.target.closest('[data-modal-close]')) { closeQR(); }
      });

      document.addEventListener('keydown', function (e) {
        if (qrModal.hidden) { return; }

        if (e.key === 'Escape') { closeQR(); return; }

        // Le focus reste enfermé dans la fenêtre tant qu'elle est ouverte
        if (e.key === 'Tab') {
          var focusables = qrModal.querySelectorAll('button, [href], input, [tabindex]:not([tabindex="-1"])');
          if (!focusables.length) { return; }
          var first = focusables[0];
          var last = focusables[focusables.length - 1];
          if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
          else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
        }
      });
    }
  }


  /* 08. COPIE DE L'ADRESSE E-MAIL
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

      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(value).then(confirmCopy).catch(fallbackCopy);
      } else {
        fallbackCopy();
      }
    });
  }


  /* 09. FORMULAIRE DE CONTACT (MAILTO)
     ------------------------------------------------------------------------
     Pas de backend : on assemble un lien mailto: et on l'ouvre dans une
     NOUVELLE fenêtre, pour que le portfolio reste affiché dans l'onglet
     d'origine quoi qu'il arrive. */
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

      window.open(href, '_blank', 'noopener');

      if (note) {
        note.textContent = 'Votre messagerie s\'ouvre dans une nouvelle fenêtre. ' +
          'Si rien ne se passe, écrivez directement à ' + RECIPIENT + '.';
      }
    });

    // Efface l'état d'erreur dès que le visiteur corrige
    form.addEventListener('input', function (e) {
      if (e.target.classList) { e.target.classList.remove('is-invalid'); }
    });
  }


  /* 10. ANNÉE DU PIED DE PAGE
     ---------------------------------------------------------------------- */
  var year = document.getElementById('year');
  if (year) { year.textContent = String(new Date().getFullYear()); }


  // Premier passage : barre de navigation, progression et section active
  onScroll();

})();
