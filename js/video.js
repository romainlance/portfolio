/* =============================================================================
   Portfolio — Romain Lance
   Vidéos YouTube.

   Rien n'est chargé depuis YouTube tant que le visiteur n'a pas cliqué : la
   page n'affiche qu'une façade — une image locale et un bouton de lecture.
   Au clic seulement, un <iframe> est créé.

   Trois raisons à ce choix :
     · un lecteur YouTube pèse plusieurs centaines de kilooctets, et une page
       qui en contient deux met plus de temps à s'afficher que tout le reste
       du site réuni ;
     · aucun cookie ni aucune requête ne part vers Google avant un geste
       explicite (le domaine sans cookie est utilisé ensuite) ;
     · sans JavaScript, il reste un lien vers la vidéo, qui fonctionne.

   Utilisation :

       <div class="embed" data-video="IDENTIFIANT"
            data-poster="assets/…/1-sm.webp"      <!-- facultatif -->
            data-portrait>                         <!-- format vertical -->
         <a class="embed__play" href="https://youtu.be/IDENTIFIANT">Lire la vidéo</a>
       </div>

   Le contenu de .embed écrit dans le HTML est ce que voit un visiteur sans
   JavaScript ; ce fichier le remplace par la façade cliquable.
   ========================================================================== */

(function () {
  'use strict';

  var blocks = document.querySelectorAll('.embed[data-video]');
  if (!blocks.length) { return; }

  // Les libellés sont produits ici, après le relevé de js/i18n.js : ils ne
  // peuvent pas passer par le dictionnaire et sont donc écrits dans les deux
  // langues, comme ceux de la visionneuse.
  function t(fr, en) { return document.documentElement.lang === 'en' ? en : fr; }

  var PLAY_ICON =
    '<svg class="ico" aria-hidden="true" viewBox="0 0 24 24">' +
    '<path d="M8.4 5.6 18.6 12 8.4 18.4Z"/></svg>';

  blocks.forEach(function (block) {
    var id = block.dataset.video;
    var label = block.dataset.label || '';

    function buildFacade() {
      var button = document.createElement('button');
      button.type = 'button';
      button.className = 'embed__play';
      /* Libellé non composé, volontairement : tel quel, il figure dans le
         dictionnaire de js/i18n.js, qui relève la page après ce script et
         le traduit comme n'importe quel autre attribut. Le nom du projet est
         porté par la légende voisine et par le titre de l'<iframe>. */
      button.setAttribute('aria-label', t('Lire la vidéo', 'Play the video'));

      if (block.dataset.poster) {
        var poster = document.createElement('img');
        poster.className = 'embed__poster';
        poster.src = block.dataset.poster;
        poster.alt = '';
        poster.loading = 'lazy';
        poster.decoding = 'async';
        button.appendChild(poster);
      }

      var badge = document.createElement('span');
      badge.className = 'embed__badge';
      badge.innerHTML = PLAY_ICON;
      button.appendChild(badge);

      var text = document.createElement('span');
      text.className = 'embed__label';
      text.textContent = t('Lire la vidéo', 'Play the video');
      button.appendChild(text);

      button.addEventListener('click', play);
      return button;
    }

    function play() {
      var frame = document.createElement('iframe');
      // Domaine sans cookie, et lecture lancée puisque le geste vient d'avoir lieu
      frame.src = 'https://www.youtube-nocookie.com/embed/' + id +
                  '?autoplay=1&rel=0&modestbranding=1';
      frame.title = label || t('Vidéo du projet', 'Project video');
      frame.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; ' +
                    'gyroscope; picture-in-picture; web-share';
      frame.allowFullscreen = true;
      frame.loading = 'lazy';
      frame.referrerPolicy = 'strict-origin-when-cross-origin';

      block.innerHTML = '';
      block.appendChild(frame);
      block.classList.add('is-playing');
    }

    block.innerHTML = '';
    block.appendChild(buildFacade());
  });

})();
