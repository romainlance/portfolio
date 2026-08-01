/* =============================================================================
   Portfolio — Romain Lance
   Bibliothèque d'icônes.

   Toutes les icônes du site vivent ici, dans un unique sprite SVG injecté en
   tête de <body>. Chaque page les utilise ensuite via :

       <svg class="ico" aria-hidden="true"><use href="#i-team"></use></svg>

   Pourquoi un fichier JS plutôt qu'un sprite .svg externe : les références
   <use href="fichier.svg#id"> ne sont pas fiables d'un navigateur à l'autre,
   et le site n'a pas d'étape de build permettant d'inclure un partiel HTML.
   Cette solution garde une source unique pour les quatre pages.

   Les icônes sont purement décoratives (toutes en aria-hidden) : sans
   JavaScript, seuls les libellés textuels subsistent, et rien n'est perdu.
   ========================================================================== */

(function () {
  'use strict';

  // Tracés à 24×24, contour seul : la mise en forme (taille, couleur,
  // épaisseur) est pilotée par la classe .ico dans la feuille de styles.
  var PATHS = {
    'i-team':      '<circle cx="9" cy="8.5" r="3.2"/><path d="M2.8 19.2a6.2 6.2 0 0 1 12.4 0"/><path d="M16.5 6.4a3.2 3.2 0 0 1 0 6.2"/><path d="M17.6 14.2a6.2 6.2 0 0 1 3.6 5"/>',
    'i-calendar':  '<rect x="3.2" y="5" width="17.6" height="15.5" rx="2.2"/><path d="M3.2 9.6h17.6M8 3.2v3.4M16 3.2v3.4"/>',
    'i-clock':     '<circle cx="12" cy="12" r="8.8"/><path d="M12 7.2V12l3.2 2"/>',
    'i-pin':       '<path d="M12 21.2s7-5.9 7-11.2a7 7 0 1 0-14 0c0 5.3 7 11.2 7 11.2Z"/><circle cx="12" cy="9.8" r="2.6"/>',
    'i-cap':       '<path d="M12 3.4 22 8.4l-10 5-10-5 10-5Z"/><path d="M6.4 10.8v5.2c0 1.6 2.5 3 5.6 3s5.6-1.4 5.6-3v-5.2"/><path d="M22 8.4v5.6"/>',
    'i-mail':      '<rect x="2.6" y="4.6" width="18.8" height="14.8" rx="2.2"/><path d="m3.2 6.2 8.8 6.4 8.8-6.4"/>',
    'i-linkedin':  '<rect x="3" y="3" width="18" height="18" rx="2.4"/><path d="M7.6 10.6V17M7.6 7.3v.1M11.4 17v-3.7a2.2 2.2 0 0 1 4.4 0V17"/>',
    'i-arrow':     '<path d="M4.4 12h15.2M13.4 5.8 19.6 12l-6.2 6.2"/>',
    'i-external':  '<path d="M7.4 16.6 16.6 7.4M9.2 7.4h7.4v7.4"/>',
    'i-back':      '<path d="M19.6 12H4.4M10.6 5.8 4.4 12l6.2 6.2"/>',
    'i-robot':     '<rect x="4.2" y="7.8" width="15.6" height="12" rx="3"/><path d="M12 3.4v4.4M8.6 20v1.4M15.4 20v1.4M1.8 12.6v3.6M22.2 12.6v3.6"/><circle cx="9.2" cy="13.2" r="1.1"/><circle cx="14.8" cy="13.2" r="1.1"/>',
    'i-cog':       '<circle cx="12" cy="12" r="3.2"/><path d="M12 2.6v2.8M12 18.6v2.8M2.6 12h2.8M18.6 12h2.8M5.4 5.4l2 2M16.6 16.6l2 2M18.6 5.4l-2 2M7.4 16.6l-2 2"/>',
    'i-chip':      '<rect x="7" y="7" width="10" height="10" rx="1.8"/><path d="M9.6 3.4v3.6M14.4 3.4v3.6M9.6 17v3.6M14.4 17v3.6M3.4 9.6h3.6M3.4 14.4h3.6M17 9.6h3.6M17 14.4h3.6"/>',
    'i-code':      '<path d="m8.6 8.4-4.2 3.6 4.2 3.6M15.4 8.4l4.2 3.6-4.2 3.6M13.6 4.6l-3.2 14.8"/>',
    'i-globe':     '<circle cx="12" cy="12" r="8.8"/><path d="M3.4 12h17.2M12 3.2a13.4 13.4 0 0 1 0 17.6 13.4 13.4 0 0 1 0-17.6Z"/>',
    'i-spark':     '<path d="m12 2.8 2.4 6.2 6.2 2.4-6.2 2.4L12 20l-2.4-6.2L3.4 11.4l6.2-2.4L12 2.8Z"/>',
    'i-target':    '<circle cx="12" cy="12" r="8.6"/><circle cx="12" cy="12" r="4.6"/><circle cx="12" cy="12" r="0.9"/>',
    'i-building':  '<path d="M4.4 20.6V5.2a1.8 1.8 0 0 1 1.8-1.8h7.6a1.8 1.8 0 0 1 1.8 1.8v15.4"/><path d="M15.6 10.4h2.2a1.8 1.8 0 0 1 1.8 1.8v8.4M2.8 20.6h18.4"/><path d="M8 7.6h3.6M8 11.6h3.6M8 15.6h3.6"/>',
    'i-flask':     '<path d="M9.6 3.4v5.4L4.3 17.9a2 2 0 0 0 1.7 3h12a2 2 0 0 0 1.7-3l-5.3-9.1V3.4"/><path d="M8.2 3.4h7.6M7.2 14.6h9.6"/>',
    'i-doc':       '<path d="M13.4 3.2H7a2 2 0 0 0-2 2v13.6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8.8Z"/><path d="M13.4 3.2v5.6H19M8.6 13h6.8M8.6 16.6h4.6"/>',
    'i-wrench':    '<path d="M14.8 6.6a4.4 4.4 0 0 0 5.7 5.7l-8.4 8.4a2.6 2.6 0 0 1-3.7-3.7Z"/><path d="m14.8 6.6 2.4-2.4a4.4 4.4 0 0 1 3.3 8.1"/>',
    'i-route':     '<circle cx="6" cy="6" r="2.6"/><circle cx="18" cy="18" r="2.6"/><path d="M8.6 6h4.8a3.4 3.4 0 0 1 0 6.8H10a3.4 3.4 0 0 0 0 6.8h5.4"/>',
    'i-sun':       '<circle cx="12" cy="12" r="4.2"/><path d="M12 2v2.6M12 19.4V22M2 12h2.6M19.4 12H22M4.9 4.9l1.9 1.9M17.2 17.2l1.9 1.9M19.1 4.9l-1.9 1.9M6.8 17.2l-1.9 1.9"/>',
    'i-moon':      '<path d="M20.5 14.6A8.6 8.6 0 0 1 9.4 3.5a8.6 8.6 0 1 0 11.1 11.1Z"/>',
    'i-menu':      '<path d="M4 7h16M4 12h16M4 17h16"/>'
  };

  function buildSprite() {
    var symbols = '';
    for (var id in PATHS) {
      if (Object.prototype.hasOwnProperty.call(PATHS, id)) {
        symbols += '<symbol id="' + id + '" viewBox="0 0 24 24">' + PATHS[id] + '</symbol>';
      }
    }

    var holder = document.createElement('div');
    holder.setAttribute('aria-hidden', 'true');
    // Retiré du flux sans display:none, qui empêcherait <use> de résoudre
    // les symboles dans certains navigateurs.
    holder.style.cssText = 'position:absolute;width:0;height:0;overflow:hidden';
    holder.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg">' + symbols + '</svg>';
    document.body.insertBefore(holder, document.body.firstChild);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', buildSprite);
  } else {
    buildSprite();
  }
})();
