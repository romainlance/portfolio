/* =============================================================================
   Portfolio — Romain Lance
   Effets visuels.

   Séparé de main.js volontairement : ce fichier ne contient que de
   l'habillage. On peut le retirer entièrement du site sans casser une seule
   fonctionnalité — le contenu, la navigation, le thème et le formulaire
   continuent de fonctionner.

   Deux garde-fous s'appliquent partout :
     · prefers-reduced-motion: reduce  → aucun mouvement n'est déclenché ;
     · pointeur grossier (tactile)     → les effets au curseur sont ignorés.

   Sommaire
   01. Entrée du hero
   02. Halo suivant le curseur
   03. Halo local sur les panneaux
   04. Relief au pointeur
   05. Boutons aimantés
   06. Compteurs chiffrés
   07. Remplissage du rail de la timeline
   ========================================================================== */

(function () {
  'use strict';

  var root = document.documentElement;
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  // Désarme le filet de sécurité posé dans le <head> : le script est bien là.
  root.setAttribute('data-intro-ready', '');

  // S'abonne au défilement mutualisé exposé par main.js, sinon retombe sur un
  // écouteur local (par exemple si main.js n'a pas pu se charger).
  function onScroll(fn) {
    if (typeof window.portfolioOnScroll === 'function') {
      window.portfolioOnScroll(fn);
    } else {
      window.addEventListener('scroll', fn, { passive: true });
      fn();
    }
  }


  /* 01. ENTRÉE DU HERO
     ------------------------------------------------------------------------
     Les éléments marqués .intro sont masqués par le CSS tant que <html> porte
     .js-intro, puis dévoilés en cascade selon leur attribut data-intro. */
  (function initIntro() {
    var items = document.querySelectorAll('.intro');

    if (!items.length || reduceMotion) {
      root.classList.remove('js-intro');
      // Les diagrammes doivent quand même apparaître
      items.forEach(function (el) { el.classList.add('is-visible'); });
      return;
    }

    items.forEach(function (el) {
      el.style.setProperty('--intro', el.dataset.intro || '0');
    });

    // Double rAF : garantit que l'état initial a été peint avant la transition
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        items.forEach(function (el) {
          el.classList.add('is-in');
          el.classList.add('is-visible'); // déclenche le tracé des diagrammes
        });
      });
    });
  })();


  /* 02. HALO SUIVANT LE CURSEUR
     ------------------------------------------------------------------------
     Le hero (et l'en-tête des pages projet) porte un dégradé radial dont le
     centre suit la souris.

     Le halo ne colle pas au curseur : il le rattrape par interpolation à
     chaque frame. Ce léger retard suffit à transformer un suivi mécanique en
     mouvement fluide, et évite les à-coups sur les déplacements rapides. */
  (function initAura() {
    if (!finePointer || reduceMotion) { return; }

    var EASING = 0.1; // fraction de l'écart rattrapée par frame

    document.querySelectorAll('.hero').forEach(function (zone) {
      var targetX = 72, targetY = 34;   // position visée, en % de la zone
      var currentX = targetX, currentY = targetY;
      var frame = null;

      function render() {
        currentX += (targetX - currentX) * EASING;
        currentY += (targetY - currentY) * EASING;

        zone.style.setProperty('--mx', currentX.toFixed(2) + '%');
        zone.style.setProperty('--my', currentY.toFixed(2) + '%');

        // On s'arrête net une fois le curseur rattrapé, pour ne pas laisser
        // tourner une boucle d'animation inutile.
        if (Math.abs(targetX - currentX) > 0.05 || Math.abs(targetY - currentY) > 0.05) {
          frame = requestAnimationFrame(render);
        } else {
          frame = null;
        }
      }

      function track(e, snap) {
        var r = zone.getBoundingClientRect();
        targetX = (e.clientX - r.left) / r.width * 100;
        targetY = (e.clientY - r.top) / r.height * 100;

        // À l'entrée dans la zone, le halo apparaît directement sous le
        // curseur plutôt que de traverser l'écran pour le rejoindre.
        if (snap) { currentX = targetX; currentY = targetY; }
        if (!frame) { frame = requestAnimationFrame(render); }
      }

      zone.addEventListener('pointerenter', function (e) { track(e, true); }, { passive: true });
      zone.addEventListener('pointermove', function (e) { track(e, false); }, { passive: true });
    });
  })();


  /* 03. HALO LOCAL SUR LES PANNEAUX
     ------------------------------------------------------------------------
     Même principe, à l'échelle d'une carte : le halo se cale sur la position
     exacte du curseur dans l'élément. */
  (function initSpotlight() {
    if (!finePointer || reduceMotion) { return; }

    var panels = document.querySelectorAll('.spotlight');

    panels.forEach(function (panel) {
      panel.addEventListener('pointermove', function (e) {
        var r = panel.getBoundingClientRect();
        panel.style.setProperty('--mx', (e.clientX - r.left).toFixed(0) + 'px');
        panel.style.setProperty('--my', (e.clientY - r.top).toFixed(0) + 'px');
      }, { passive: true });
    });
  })();


  /* 04. RELIEF AU POINTEUR
     ------------------------------------------------------------------------
     Légère rotation 3D des panneaux, calculée à partir de l'écart entre le
     curseur et le centre de l'élément. L'amplitude reste volontairement
     faible : on cherche la profondeur, pas l'effet de manège.

     Elle est aussi proportionnée à la taille du bloc. Cinq degrés sur une
     carte de 300 px donnent un relief juste ; les mêmes cinq degrés sur une
     ligne de 1 100 px de large donnent une bascule de plusieurs dizaines de
     pixels aux extrémités — le bloc paraît alors se tordre. Les grandes
     surfaces s'inclinent donc moins que les petites. */
  (function initTilt() {
    if (!finePointer || reduceMotion) { return; }

    var MAX_DEG = 5;        // amplitude maximale, en degrés
    var REFERENCE = 560;    // largeur en deçà de laquelle on l'applique en entier

    document.querySelectorAll('.tilt').forEach(function (el) {
      el.addEventListener('pointermove', function (e) {
        var r = el.getBoundingClientRect();
        var px = (e.clientX - r.left) / r.width - 0.5;   // -0.5 … +0.5
        var py = (e.clientY - r.top) / r.height - 0.5;

        var amp = MAX_DEG * Math.min(1, REFERENCE / Math.max(r.width, r.height));

        el.style.setProperty('--ry', (px * amp * 2).toFixed(2) + 'deg');
        el.style.setProperty('--rx', (-py * amp * 2).toFixed(2) + 'deg');
      }, { passive: true });

      el.addEventListener('pointerleave', function () {
        el.style.setProperty('--rx', '0deg');
        el.style.setProperty('--ry', '0deg');
      });
    });
  })();


  /* 05. BOUTONS AIMANTÉS
     ------------------------------------------------------------------------
     Le bouton se décale de quelques pixels vers le curseur qui l'approche,
     puis revient à sa place. */
  (function initMagnetic() {
    if (!finePointer || reduceMotion) { return; }

    var PULL = 7; // décalage maximal, en pixels
    var targets = document.querySelectorAll('.magnetic');

    targets.forEach(function (el) {
      el.addEventListener('pointermove', function (e) {
        var r = el.getBoundingClientRect();
        var dx = (e.clientX - (r.left + r.width / 2)) / (r.width / 2);
        var dy = (e.clientY - (r.top + r.height / 2)) / (r.height / 2);
        el.style.transform = 'translate(' + (dx * PULL).toFixed(1) + 'px,' +
                                            (dy * PULL).toFixed(1) + 'px)';
      }, { passive: true });

      el.addEventListener('pointerleave', function () {
        el.style.transform = '';
      });
    });
  })();


  /* 06. COMPTEURS CHIFFRÉS
     ------------------------------------------------------------------------
     Les chiffres clés de la section « À propos » défilent de 0 à leur valeur
     lorsqu'ils entrent dans le champ de vision. */
  (function initCounters() {
    var nums = document.querySelectorAll('[data-count]');
    if (!nums.length || reduceMotion || !('IntersectionObserver' in window)) { return; }

    function run(el) {
      var target = parseInt(el.dataset.count, 10);
      if (isNaN(target)) { return; }

      var DURATION = 1100;
      var start = null;

      function step(now) {
        if (start === null) { start = now; }
        var t = Math.min((now - start) / DURATION, 1);
        var eased = 1 - Math.pow(1 - t, 3);          // sortie cubique
        el.textContent = String(Math.round(target * eased));
        if (t < 1) { requestAnimationFrame(step); }
      }

      el.textContent = '0';
      requestAnimationFrame(step);
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          run(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.6 });

    nums.forEach(function (el) { observer.observe(el); });
  })();


  /* 07. REMPLISSAGE DU RAIL DE LA TIMELINE
     ------------------------------------------------------------------------
     Le rail vertical du parcours se colore au fur et à mesure de la lecture,
     comme une jauge d'avancement dans la chronologie. */
  (function initTimelineFill() {
    var timeline = document.getElementById('timeline');
    var fill = document.getElementById('timelineFill');
    var rail = timeline && timeline.querySelector('.timeline__rail');
    if (!timeline || !fill || !rail) { return; }

    if (reduceMotion) { fill.style.height = '100%'; return; }

    var bodies = Array.prototype.map.call(
      timeline.querySelectorAll('.tl'),
      function (item) { return item.querySelector('.tl__body'); }
    ).filter(Boolean);
    if (!bodies.length) { return; }

    // Distance entre le haut du corps d'une expérience et le centre de son
    // nœud, lue depuis le CSS pour rester juste si les valeurs y changent.
    var nodeOffset = 0;
    function measureNode() {
      var node = window.getComputedStyle(bodies[0], '::before');
      nodeOffset = parseFloat(node.top || 0) + parseFloat(node.height || 0) / 2;
    }
    measureNode();
    window.addEventListener('resize', measureNode, { passive: true });

    onScroll(function () {
      var railRect = rail.getBoundingClientRect();
      var marker = window.innerHeight * 0.5;   // ligne de référence à l'écran

      /* La barre s'arrête au dernier nœud franchi, et non à une proportion
         continue du parcours. Recentrer une expérience place son nœud
         au-dessus de la ligne de référence et le suivant en dessous : la
         barre vient donc mourir exactement sur le point de cette
         expérience. */
      var reached = 0;
      for (var i = 0; i < bodies.length; i++) {
        var nodeCenter = bodies[i].getBoundingClientRect().top + nodeOffset;
        if (nodeCenter <= marker) {
          reached = Math.max(reached, nodeCenter - railRect.top);
        }
      }

      fill.style.height = Math.max(0, Math.min(reached, railRect.height)).toFixed(1) + 'px';
    });
  })();
})();
