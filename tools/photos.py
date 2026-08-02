#!/usr/bin/env python3
"""Conversion des photos du portfolio en WebP.

Les photos arrivent d'un téléphone : HEIC ou JPEG, 4 000 px de large, 2 à
5 Mo pièce. Telles quelles, elles pèseraient plus lourd que le reste du site
réuni. Ce script produit pour chaque source deux fichiers WebP :

    nom.webp      vue pleine, 1 600 px max — affichée dans la visionneuse
    nom-sm.webp   vignette, 800 px max     — affichée dans les cartes

L'orientation EXIF est appliquée avant redimensionnement : sans cela, les
photos prises en portrait ressortent couchées.

Utilisation
-----------
    pip install pillow pillow-heif
    python3 tools/photos.py mes-photos/ assets/albums/mon-projet

Les fichiers sont numérotés 1, 2, 3… dans l'ordre alphabétique des sources ;
c'est cet ordre qui devient celui de l'album. Renommer les sources
(``01-vue-generale.heic``, ``02-detail.heic``…) suffit à le contrôler.
"""

import sys
from pathlib import Path

from PIL import Image, ImageOps

try:                                    # HEIC : format par défaut des iPhone
    import pillow_heif
    pillow_heif.register_heif_opener()
except ImportError:                     # sans le greffon, seuls JPEG et PNG
    pass                                # sont lisibles — le reste fonctionne

FULL, THUMB = 1600, 800
QUALITY_FULL, QUALITY_THUMB = 72, 70
SOURCES = {'.heic', '.heif', '.jpg', '.jpeg', '.png', '.webp', '.tif', '.tiff'}


def convert(src: Path, dest_dir: Path, base: str) -> None:
    image = ImageOps.exif_transpose(Image.open(src)).convert('RGB')

    for suffix, size, quality in (('', FULL, QUALITY_FULL),
                                  ('-sm', THUMB, QUALITY_THUMB)):
        out = image.copy()
        out.thumbnail((size, size), Image.LANCZOS)
        target = dest_dir / f'{base}{suffix}.webp'
        # method=6 : compression la plus lente et la plus efficace. On ne
        # convertit qu'une fois, autant y passer la seconde supplémentaire.
        out.save(target, 'WEBP', quality=quality, method=6)
        print(f'{target}  {out.width}×{out.height}  '
              f'{target.stat().st_size / 1024:.0f} Ko')


def main() -> int:
    if len(sys.argv) != 3:
        print(__doc__)
        return 2

    src_dir, dest_dir = Path(sys.argv[1]), Path(sys.argv[2])
    if not src_dir.is_dir():
        print(f'Dossier source introuvable : {src_dir}')
        return 1

    sources = sorted(p for p in src_dir.iterdir()
                     if p.suffix.lower() in SOURCES)
    if not sources:
        print(f'Aucune image exploitable dans {src_dir}')
        return 1

    dest_dir.mkdir(parents=True, exist_ok=True)
    for index, src in enumerate(sources, start=1):
        convert(src, dest_dir, str(index))

    print(f'\n{len(sources)} photo(s) converties dans {dest_dir}')
    return 0


if __name__ == '__main__':
    raise SystemExit(main())
