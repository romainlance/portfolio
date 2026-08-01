/* =============================================================================
   Portfolio — Romain Lance
   Encodeur de QR code.

   Pourquoi générer le code plutôt que d'embarquer une image : l'URL du site
   dépend de l'hébergement (GitHub Pages, Netlify, domaine propre…). En le
   calculant au chargement à partir de `location.href`, le QR pointe toujours
   vers l'adresse réelle, sans image à régénérer à chaque déploiement.

   Portée volontairement restreinte à ce dont le site a besoin :
     · mode octet (UTF-8), le seul qui accepte une URL quelconque ;
     · niveau de correction M (~15 % de redondance) ;
     · versions 1 à 10, soit jusqu'à 213 caractères — très au-delà de la
       longueur d'une URL de portfolio.

   Conforme à ISO/IEC 18004. La sortie a été comparée module par module, sur
   les huit masques, à une implémentation de référence.

   Usage :
       var qr = QRCode.build('https://exemple.fr');
       qr.size          // nombre de modules par côté
       qr.get(x, y)     // true si le module est sombre
   ========================================================================== */

(function (root) {
  'use strict';

  /* --- Corps de Galois GF(256), polynôme primitif 0x11D --------------------
     Les tables d'exponentielle et de logarithme ramènent la multiplication à
     une addition d'indices, ce qui rend le calcul de correction d'erreur
     immédiat. */
  var EXP = new Uint8Array(512);
  var LOG = new Uint8Array(256);

  (function buildTables() {
    var x = 1;
    for (var i = 0; i < 255; i++) {
      EXP[i] = x;
      LOG[x] = i;
      x <<= 1;
      if (x & 0x100) { x ^= 0x11D; }
    }
    for (var j = 255; j < 512; j++) { EXP[j] = EXP[j - 255]; }
  })();

  function gfMul(a, b) {
    return (a === 0 || b === 0) ? 0 : EXP[LOG[a] + LOG[b]];
  }

  /* --- Reed-Solomon ------------------------------------------------------ */

  // Polynôme générateur : produit des (x - α^i) pour i de 0 à degré-1
  function rsGenerator(degree) {
    var poly = [1];
    for (var i = 0; i < degree; i++) {
      var next = new Array(poly.length + 1);
      for (var k = 0; k < next.length; k++) { next[k] = 0; }
      for (var j = 0; j < poly.length; j++) {
        next[j] ^= poly[j];                       // multiplication par x
        next[j + 1] ^= gfMul(poly[j], EXP[i]);    // multiplication par α^i
      }
      poly = next;
    }
    return poly;
  }

  // Reste de la division du message par le polynôme générateur
  function rsRemainder(data, ecLength) {
    var gen = rsGenerator(ecLength);
    var buf = data.slice();
    for (var i = 0; i < ecLength; i++) { buf.push(0); }

    for (var p = 0; p < data.length; p++) {
      var factor = buf[p];
      if (factor === 0) { continue; }
      for (var g = 0; g < gen.length; g++) {
        buf[p + g] ^= gfMul(gen[g], factor);
      }
    }
    return buf.slice(data.length);
  }

  /* --- Tables de version, niveau de correction M -------------------------
     Pour chaque version : [octets de données, octets de correction par bloc,
     nombre de blocs du groupe 1, nombre de blocs du groupe 2].
     Les blocs du groupe 2 contiennent un octet de données de plus. */
  var VERSIONS = {
    1:  [16,  10, 1, 0],
    2:  [28,  16, 1, 0],
    3:  [44,  26, 1, 0],
    4:  [64,  18, 2, 0],
    5:  [86,  24, 2, 0],
    6:  [108, 16, 4, 0],
    7:  [124, 18, 4, 0],
    8:  [154, 22, 2, 2],
    9:  [182, 22, 3, 2],
    10: [216, 26, 4, 1]
  };

  // Centres des motifs d'alignement, par version
  var ALIGN = {
    1: [], 2: [6, 18], 3: [6, 22], 4: [6, 26], 5: [6, 30],
    6: [6, 34], 7: [6, 22, 38], 8: [6, 24, 42], 9: [6, 26, 46], 10: [6, 28, 50]
  };

  var EC_M = 0;                 // indicateur du niveau M dans l'information de format
  var MAX_VERSION = 10;

  /* --- Encodage des données ---------------------------------------------- */

  function utf8Bytes(text) {
    var out = [];
    var encoded = encodeURIComponent(text);
    for (var i = 0; i < encoded.length; i++) {
      if (encoded[i] === '%') {
        out.push(parseInt(encoded.substr(i + 1, 2), 16));
        i += 2;
      } else {
        out.push(encoded.charCodeAt(i));
      }
    }
    return out;
  }

  // Le compteur de caractères occupe 8 bits jusqu'à la version 9, 16 au-delà
  function countBits(version) { return version < 10 ? 8 : 16; }

  function pickVersion(byteLength) {
    for (var v = 1; v <= MAX_VERSION; v++) {
      var capacity = Math.floor((VERSIONS[v][0] * 8 - 4 - countBits(v)) / 8);
      if (byteLength <= capacity) { return v; }
    }
    return null;
  }

  function buildCodewords(bytes, version) {
    var spec = VERSIONS[version];
    var dataCount = spec[0];
    var bits = [];

    function push(value, length) {
      for (var i = length - 1; i >= 0; i--) { bits.push((value >>> i) & 1); }
    }

    push(0b0100, 4);                       // mode octet
    push(bytes.length, countBits(version));
    for (var i = 0; i < bytes.length; i++) { push(bytes[i], 8); }

    // Terminateur, puis alignement sur un multiple de 8 bits
    var capacity = dataCount * 8;
    for (var t = 0; t < 4 && bits.length < capacity; t++) { bits.push(0); }
    while (bits.length % 8 !== 0) { bits.push(0); }

    var words = [];
    for (var b = 0; b < bits.length; b += 8) {
      var value = 0;
      for (var k = 0; k < 8; k++) { value = (value << 1) | bits[b + k]; }
      words.push(value);
    }

    // Remplissage alterné imposé par la norme
    var padding = [0xEC, 0x11];
    for (var p = 0; words.length < dataCount; p++) { words.push(padding[p % 2]); }

    return words;
  }

  // Découpage en blocs, calcul de la correction, puis entrelacement
  function interleave(words, version) {
    var spec = VERSIONS[version];
    var ecLength = spec[1];
    var group1 = spec[2];
    var group2 = spec[3];
    var totalBlocks = group1 + group2;
    var shortLength = Math.floor(spec[0] / totalBlocks);

    var dataBlocks = [];
    var ecBlocks = [];
    var offset = 0;

    for (var b = 0; b < totalBlocks; b++) {
      var length = shortLength + (b >= group1 ? 1 : 0);
      var block = words.slice(offset, offset + length);
      offset += length;
      dataBlocks.push(block);
      ecBlocks.push(rsRemainder(block, ecLength));
    }

    var out = [];
    var longest = shortLength + (group2 > 0 ? 1 : 0);
    for (var i = 0; i < longest; i++) {
      for (var d = 0; d < dataBlocks.length; d++) {
        if (i < dataBlocks[d].length) { out.push(dataBlocks[d][i]); }
      }
    }
    for (var e = 0; e < ecLength; e++) {
      for (var c = 0; c < ecBlocks.length; c++) { out.push(ecBlocks[c][e]); }
    }
    return out;
  }

  /* --- Construction de la matrice ---------------------------------------- */

  function newMatrix(size) {
    var m = [];
    for (var y = 0; y < size; y++) {
      m.push(new Array(size).fill(null));   // null = module encore libre
    }
    return m;
  }

  function placeFinder(m, reserved, x0, y0) {
    // Motif de repérage 7×7 plus son séparateur d'un module
    for (var dy = -1; dy <= 7; dy++) {
      for (var dx = -1; dx <= 7; dx++) {
        var x = x0 + dx, y = y0 + dy;
        if (x < 0 || y < 0 || x >= m.length || y >= m.length) { continue; }
        var inner = dx >= 2 && dx <= 4 && dy >= 2 && dy <= 4;
        var ring = dx >= 0 && dx <= 6 && dy >= 0 && dy <= 6 &&
                   (dx === 0 || dx === 6 || dy === 0 || dy === 6);
        m[y][x] = (inner || ring) ? 1 : 0;
        reserved[y][x] = true;
      }
    }
  }

  function placeAlignment(m, reserved, version) {
    var centers = ALIGN[version];
    var last = centers.length - 1;

    for (var a = 0; a < centers.length; a++) {
      for (var b = 0; b < centers.length; b++) {
        var cx = centers[b], cy = centers[a];

        // Seuls les trois angles occupés par les motifs de repérage sont
        // exclus. Se fier à « module déjà réservé » serait une erreur : à
        // partir de la version 7, des motifs d'alignement sont légitimement
        // centrés sur les lignes de synchronisation, et les écarter rend le
        // symbole indécodable.
        var surFinder = (a === 0 && b === 0) ||
                        (a === 0 && b === last) ||
                        (a === last && b === 0);
        if (surFinder) { continue; }
        for (var dy = -2; dy <= 2; dy++) {
          for (var dx = -2; dx <= 2; dx++) {
            var edge = Math.max(Math.abs(dx), Math.abs(dy));
            m[cy + dy][cx + dx] = (edge !== 1) ? 1 : 0;
            reserved[cy + dy][cx + dx] = true;
          }
        }
      }
    }
  }

  function reserveFormatAreas(m, reserved, size, version) {
    for (var i = 0; i < 9; i++) {
      if (!reserved[8][i]) { reserved[8][i] = true; m[8][i] = 0; }
      if (!reserved[i][8]) { reserved[i][8] = true; m[i][8] = 0; }
    }
    for (var j = 0; j < 8; j++) {
      if (!reserved[8][size - 1 - j]) { reserved[8][size - 1 - j] = true; m[8][size - 1 - j] = 0; }
      if (!reserved[size - 1 - j][8]) { reserved[size - 1 - j][8] = true; m[size - 1 - j][8] = 0; }
    }
    if (version >= 7) {
      for (var y = 0; y < 6; y++) {
        for (var x = 0; x < 3; x++) {
          reserved[y][size - 11 + x] = true; m[y][size - 11 + x] = 0;
          reserved[size - 11 + x][y] = true; m[size - 11 + x][y] = 0;
        }
      }
    }
  }

  function placeData(m, reserved, codewords, size) {
    var bitIndex = 0;
    var total = codewords.length * 8;
    var upward = true;

    for (var right = size - 1; right >= 1; right -= 2) {
      if (right === 6) { right = 5; }        // la colonne 6 porte la synchronisation
      for (var step = 0; step < size; step++) {
        var y = upward ? size - 1 - step : step;
        for (var c = 0; c < 2; c++) {
          var x = right - c;
          if (reserved[y][x]) { continue; }
          var bit = 0;
          if (bitIndex < total) {
            bit = (codewords[bitIndex >>> 3] >>> (7 - (bitIndex & 7))) & 1;
            bitIndex++;
          }
          m[y][x] = bit;
        }
      }
      upward = !upward;
    }
  }

  var MASKS = [
    function (y, x) { return (y + x) % 2 === 0; },
    function (y) { return y % 2 === 0; },
    function (y, x) { return x % 3 === 0; },
    function (y, x) { return (y + x) % 3 === 0; },
    function (y, x) { return (Math.floor(y / 2) + Math.floor(x / 3)) % 2 === 0; },
    function (y, x) { return ((y * x) % 2) + ((y * x) % 3) === 0; },
    function (y, x) { return (((y * x) % 2) + ((y * x) % 3)) % 2 === 0; },
    function (y, x) { return (((y + x) % 2) + ((y * x) % 3)) % 2 === 0; }
  ];

  function applyMask(m, reserved, size, mask) {
    var fn = MASKS[mask];
    var out = [];
    for (var y = 0; y < size; y++) {
      out.push(m[y].slice());
      for (var x = 0; x < size; x++) {
        if (!reserved[y][x] && fn(y, x)) { out[y][x] ^= 1; }
      }
    }
    return out;
  }

  function formatInfo(mask) {
    var data = (EC_M << 3) | mask;                 // 5 bits
    var rem = data;
    for (var i = 0; i < 10; i++) {
      rem = (rem << 1) ^ ((rem >>> 9) * 0x537);    // BCH(15,5)
    }
    return ((data << 10) | rem) ^ 0x5412;          // masque imposé par la norme
  }

  function versionInfo(version) {
    var rem = version;
    for (var i = 0; i < 12; i++) {
      rem = (rem << 1) ^ ((rem >>> 11) * 0x1F25);  // BCH(18,6)
    }
    return (version << 12) | rem;
  }

  /* L'information de format est inscrite deux fois, et les deux copies se
     lisent dans des sens opposés : la première descend la colonne 8 puis
     repart le long de la ligne 8, la seconde fait l'inverse. La matrice étant
     indexée [ligne][colonne], il faut y prendre garde — intervertir les deux
     produit un symbole d'apparence correcte mais illisible. */
  function writeFormat(m, size, mask) {
    var bits = formatInfo(mask);
    function bit(n) { return (bits >>> n) & 1; }

    // Première copie, autour du motif de repérage supérieur gauche
    for (var i = 0; i <= 5; i++) { m[i][8] = bit(i); }   // colonne 8, de haut en bas
    m[7][8] = bit(6);
    m[8][8] = bit(7);
    m[8][7] = bit(8);
    for (var j = 9; j <= 14; j++) { m[8][14 - j] = bit(j); }   // ligne 8, vers la gauche

    // Seconde copie, répartie sur les deux autres motifs
    for (var k = 0; k <= 7; k++) { m[8][size - 1 - k] = bit(k); }        // ligne 8, à droite
    for (var l = 8; l <= 14; l++) { m[size - 15 + l][8] = bit(l); }      // colonne 8, en bas

    m[size - 8][8] = 1;   // module toujours sombre
  }

  function writeVersion(m, size, version) {
    if (version < 7) { return; }
    var bits = versionInfo(version);
    for (var i = 0; i < 18; i++) {
      var bit = (bits >>> i) & 1;
      var a = Math.floor(i / 3);
      var b = i % 3;
      m[a][size - 11 + b] = bit;
      m[size - 11 + b][a] = bit;
    }
  }

  /* --- Choix du masque ---------------------------------------------------
     La norme définit quatre pénalités ; on retient le masque qui minimise
     leur somme, c'est-à-dire celui qui produit l'image la plus facile à
     décoder. */
  function penalty(m, size) {
    var score = 0;
    var y, x, run, i;

    // 1. Séries de cinq modules ou plus de même teinte
    for (y = 0; y < size; y++) {
      run = 1;
      for (x = 1; x < size; x++) {
        if (m[y][x] === m[y][x - 1]) { run++; }
        else { if (run >= 5) { score += 3 + (run - 5); } run = 1; }
      }
      if (run >= 5) { score += 3 + (run - 5); }
    }
    for (x = 0; x < size; x++) {
      run = 1;
      for (y = 1; y < size; y++) {
        if (m[y][x] === m[y - 1][x]) { run++; }
        else { if (run >= 5) { score += 3 + (run - 5); } run = 1; }
      }
      if (run >= 5) { score += 3 + (run - 5); }
    }

    // 2. Carrés 2×2 uniformes
    for (y = 0; y < size - 1; y++) {
      for (x = 0; x < size - 1; x++) {
        var v = m[y][x];
        if (v === m[y][x + 1] && v === m[y + 1][x] && v === m[y + 1][x + 1]) { score += 3; }
      }
    }

    // 3. Motif 1:1:3:1:1 précédé ou suivi de quatre modules clairs
    var A = [1, 0, 1, 1, 1, 0, 1, 0, 0, 0, 0];
    var B = [0, 0, 0, 0, 1, 0, 1, 1, 1, 0, 1];
    function matches(get, start) {
      var okA = true, okB = true;
      for (var k = 0; k < 11; k++) {
        var value = get(start + k);
        if (value !== A[k]) { okA = false; }
        if (value !== B[k]) { okB = false; }
      }
      return okA || okB;
    }
    for (y = 0; y < size; y++) {
      for (x = 0; x <= size - 11; x++) {
        if (matches(function (k) { return m[y][k]; }, x)) { score += 40; }
      }
    }
    for (x = 0; x < size; x++) {
      for (y = 0; y <= size - 11; y++) {
        if (matches(function (k) { return m[k][x]; }, y)) { score += 40; }
      }
    }

    // 4. Écart entre la proportion de modules sombres et 50 %
    var dark = 0;
    for (y = 0; y < size; y++) {
      for (x = 0; x < size; x++) { dark += m[y][x]; }
    }
    var percent = dark * 100 / (size * size);
    score += Math.floor(Math.abs(percent - 50) / 5) * 10;

    return score;
  }

  /* --- Assemblage --------------------------------------------------------- */

  function build(text, options) {
    options = options || {};

    var bytes = utf8Bytes(String(text));
    var version = pickVersion(bytes.length);
    if (!version) {
      throw new Error('Texte trop long pour un QR de version 10 (' + bytes.length + ' octets)');
    }

    var size = version * 4 + 17;
    var codewords = interleave(buildCodewords(bytes, version), version);

    var base = newMatrix(size);
    var reserved = newMatrix(size);
    for (var y = 0; y < size; y++) {
      for (var x = 0; x < size; x++) { reserved[y][x] = false; }
    }

    placeFinder(base, reserved, 0, 0);
    placeFinder(base, reserved, size - 7, 0);
    placeFinder(base, reserved, 0, size - 7);

    // Lignes de synchronisation
    for (var t = 8; t < size - 8; t++) {
      var value = (t % 2 === 0) ? 1 : 0;
      base[6][t] = value; reserved[6][t] = true;
      base[t][6] = value; reserved[t][6] = true;
    }

    placeAlignment(base, reserved, version);
    reserveFormatAreas(base, reserved, size, version);
    placeData(base, reserved, codewords, size);

    // Masque imposé (utile aux tests) ou meilleur des huit
    var chosen = null, best = Infinity, candidate;
    var only = typeof options.mask === 'number' ? [options.mask] : [0, 1, 2, 3, 4, 5, 6, 7];

    for (var i = 0; i < only.length; i++) {
      candidate = applyMask(base, reserved, size, only[i]);
      writeFormat(candidate, size, only[i]);
      writeVersion(candidate, size, version);
      var s = penalty(candidate, size);
      if (s < best) { best = s; chosen = candidate; }
    }

    return {
      version: version,
      size: size,
      get: function (x, y) { return chosen[y][x] === 1; },
      matrix: chosen
    };
  }

  root.QRCode = { build: build };

})(typeof window !== 'undefined' ? window : globalThis);
