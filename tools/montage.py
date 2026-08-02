#!/usr/bin/env python3
"""Composition d'une planche de vignettes pour une couverture d'album.

Les cartes d'album affichent leur couverture en 4/3, recadrée au centre
(``object-fit: cover``). Une image nettement plus haute que large y perd
l'essentiel de son sujet : c'est le cas des rendus CAO, presque tous en
portrait. Plutôt que d'en sacrifier un, ce script les rassemble sur une même
planche au bon format.

Les rendus partagent un fond gris uni. La planche reprend exactement ce gris,
si bien que les pièces paraissent posées sur un fond continu plutôt que
juxtaposées en mosaïque.

Utilisation
-----------
    pip install pillow
    python3 tools/montage.py assets/albums/cao-impression-3d/couverture \\
                             assets/albums/cao-impression-3d/1.webp \\
                             assets/albums/cao-impression-3d/2.webp ...

Produit ``couverture.webp`` (1 200 × 900) et ``couverture-sm.webp``
(800 × 600), comme les autres images du site.
"""

import sys
from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter

FULL = (1200, 900)          # 4/3, comme le cadre des couvertures d'album
THUMB = (800, 600)
QUALITY_FULL, QUALITY_THUMB = 78, 74

# Part de la case occupée par la pièce : en dessous de 1, les pièces
# respirent et ne se touchent pas d'une case à l'autre.
FILL = .84

# Largeur du fondu au bord de chaque rendu, en part de la case. Les rendus
# partagent le même gris mais pas exactement le même dégradé : sans fondu, on
# devine leurs quatre rectangles sur la planche.
FEATHER = .09


def background(sources: list[Image.Image]) -> tuple[int, int, int]:
    """Gris de fond des rendus, relevé au coin supérieur gauche.

    C'est la zone la plus sûre : le sujet est centré, et l'ombre portée tombe
    plus bas. On prend la médiane des sources pour qu'un rendu au fond
    légèrement différent ne décide pas de la couleur de toute la planche.
    """
    corners = sorted(image.convert('RGB').getpixel((1, 1)) for image in sources)
    return corners[len(corners) // 2]


def feather(size: tuple[int, int], radius: int) -> Image.Image:
    """Masque opaque au centre, fondu à zéro sur `radius` pixels de bord."""
    mask = Image.new('L', size, 0)
    ImageDraw.Draw(mask).rectangle(
        (radius, radius, size[0] - radius - 1, size[1] - radius - 1), fill=255)
    # Le flou transforme la marche du rectangle en dégradé continu.
    return mask.filter(ImageFilter.GaussianBlur(radius / 2))


def montage(sources: list[Image.Image], size: tuple[int, int],
            columns: int, rows: int) -> Image.Image:
    sheet = Image.new('RGB', size, background(sources))
    cell = (size[0] // columns, size[1] // rows)
    radius = max(1, int(min(cell) * FEATHER))

    for index, source in enumerate(sources):
        piece = source.convert('RGB').copy()
        piece.thumbnail((int(cell[0] * FILL), int(cell[1] * FILL)), Image.LANCZOS)

        # Centre de la case, arrondi au pixel
        column, row = index % columns, index // columns
        x = column * cell[0] + (cell[0] - piece.width) // 2
        y = row * cell[1] + (cell[1] - piece.height) // 2
        sheet.paste(piece, (x, y), feather(piece.size, radius))

    return sheet


def main() -> int:
    if len(sys.argv) < 4:
        print(__doc__)
        return 2

    base = Path(sys.argv[1])
    paths = [Path(p) for p in sys.argv[2:]]
    missing = [p for p in paths if not p.is_file()]
    if missing:
        print('Image introuvable : ' + ', '.join(str(p) for p in missing))
        return 1

    sources = [Image.open(p) for p in paths]

    # Grille la plus carrée possible : 4 pièces → 2 × 2, 6 → 3 × 2.
    columns = 2 if len(sources) <= 4 else 3
    rows = -(-len(sources) // columns)   # division entière arrondie au-dessus

    base.parent.mkdir(parents=True, exist_ok=True)
    for suffix, size, quality in (('', FULL, QUALITY_FULL),
                                  ('-sm', THUMB, QUALITY_THUMB)):
        target = base.with_name(base.name + suffix).with_suffix('.webp')
        montage(sources, size, columns, rows).save(
            target, 'WEBP', quality=quality, method=6)
        print(f'{target}  {size[0]}×{size[1]}  '
              f'{target.stat().st_size / 1024:.0f} Ko')

    return 0


if __name__ == '__main__':
    raise SystemExit(main())
