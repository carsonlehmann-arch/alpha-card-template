# Alpha Card specification

Every number below was measured from the September 2026 print files
(`ALPHA-CARDS-FRONTS-596.pdf`, `ALPHA-CARD-BACK.pdf`). Units are PDF points
(1 pt = 1/72 in = 0.3528 mm) in a coordinate space whose origin is the top-left
corner of the **full page including bleed**, y increasing downward. To convert
to pixels at 300 DPI multiply by 4.1667; at 600 DPI by 8.3333.

## Page and stock

| | mm | in | pt | px @300 |
|---|---|---|---|---|
| Trim (CR80) | 85.60 x 53.98 | 3.375 x 2.125 | 242.65 x 153.01 | 1011 x 638 |
| Page (trim + bleed) | 88.90 x 57.28 | 3.500 x 2.255 | 252.00 x 162.37 | 1050 x 677 |
| Bleed per edge | 1.65 | 0.065 | 4.68 | 19 |
| Safe zone inside trim | 3.00 | 0.118 | 8.50 | 35 |
| Corner radius | 3.18 | 0.125 | 9.0 | 37 |

All live copy sits at least 4.7 mm inside the trim. Stock is 30 mil (0.76 mm)
PVC or composite PVC/PET, matte or silk laminate, never gloss. **No spot UV,
foil or raised coating over the QR tile or the code text**: it costs read rate.

## Artwork

- `assets/artwork/card-background.png`: 2100 x 1353 px, 600 DPI, fills the whole
  page including bleed. Same image on front and back.
- `assets/artwork/bird-white.png`: 500 x 336 px white dove with alpha channel.
  Place with `preserveAspectRatio` default (it is already the right ratio).

## Type

| Role | Face | Size | Weight | Tracking | Colour |
|---|---|---|---|---|---|
| ALPHA wordmark | Michroma Regular | 9.0 pt (front), 5.6 pt (back) | 400 | 0.12 em | #FFFFFF |
| Student name | Montserrat | 12.1 pt | Bold 700 | 0 | #FFFFFF |
| Campus | Montserrat | 5.1 pt, capitals | Bold 700 | 0.19 em | #FFFFFF |
| Card code | Montserrat | fit to width (see below) | Bold 700 | 0 | #FFFFFF |
| STUDENT SIGNATURE | Montserrat | 4.6 pt, capitals | Bold 700 | 0.16 em | #666666 |
| IF FOUND | Montserrat | 4.6 pt, capitals | Bold 700 | 0.16 em | #E3C778 |
| If-found body | Montserrat | 5.6 pt | Bold 700 | 0 | #FFFFFF |

Tracking is letter-spacing applied between every pair of characters, expressed
as a fraction of the font size. Only Montserrat Bold and Michroma Regular are
used; both are bundled in `assets/fonts/` under the SIL Open Font License.

The wordmark was specified in Neuropolitical; Michroma is the stand-in that
the print run shipped with. If the Neuropolitical file is supplied, swap the
face and nothing else moves.

## Front, element by element

Positions are the **left edge** (x) and the **baseline** (y) for text, and the
top-left corner for images and rectangles.

| Element | x | y | Size / notes |
|---|---|---|---|
| Bird | 20.5512 | 19.9963 (top) | 19.4196 x 13.05 |
| ALPHA wordmark | 45.55 | 31.61 (baseline) | Michroma 9 pt, tracking 1.08 pt |
| White QR tile | 153.21 | 56.78 (top) | 78.24 x 78.24 (27.6 mm), corner radius 2.5 |
| QR symbol | 155.48 | 59.05 (top) | 73.70 x 73.70 (26.0 mm), see "QR placement" |
| Rule | 20.55 | top line baseline minus 15.88 | 47.18 x 0.94 |
| Name, last line | 20.55 | 128.49 (baseline) | Montserrat Bold 12.1 pt |
| Name, line above | 20.55 | 114.46 (baseline) | i.e. 14.03 pt line pitch |
| Campus | 20.55 | 140.4 (baseline) | Montserrat Bold 5.1 pt, caps, tracking 0.969 pt |
| Card code | 231.45 (right edge) | 144.37 (baseline) | right-aligned, fit to 84.8 pt wide |

### Name

- Exactly as it should print: preferred first name and full surname. The
  print run shows the full surname, not an initial.
- One constant size, 12.1 pt. **Never shrink to fit.** Names wider than
  **123 pt** wrap to a second line instead.
- Wrap greedily on spaces: fill line one with as many words as fit in 123 pt,
  the rest go on line two. A single word never breaks. Two lines maximum.
  This rule reproduces all 25 two-line names in the print run.
- The last line always sits on the 128.49 baseline. Extra lines stack
  **upward** at 14.03 pt pitch, and the rule moves up with them (15.88 pt
  above the top line's baseline). Nothing else moves.
- Measure width with the Montserrat Bold advance widths in
  `reference/montserrat-bold-advances.json` (sum of advances x size).
- Max width of 123 pt keeps the name 25 pt clear of the QR tile.

### Campus

Printed in capitals under the name. Current names: "Alpha Atlanta", "Alpha
SF", "Texas Sports Academy" and so on. (The print run still shows "Alpha
School …" on older cards; new cards use the short form.)

### Card code

- 20 characters, grouped in fives with single spaces for hand typing:
  `A1B2 C3D4 E5F6 0718 2930`. Typed without spaces.
- Right-aligned so the last glyph ends at x = 231.45, the right edge of the
  QR tile, baseline 144.37.
- The font size is chosen so the grouped string is **84.8 pt wide**, which puts
  it at about 5.9 pt and varies a little with the digits (observed 5.3 to
  6.3 pt). Size = 5.9 x 84.8 / width_at_5.9pt, with width measured from the
  advance table. This is the one place type is scaled.

### QR placement

The QR is **imported**, never generated here. Whatever supplies it must give a
square symbol with its quiet zone (4 modules on every side) and that whole
square, quiet zone included, must fill exactly the 73.70 pt (26.0 mm) square at
(155.48, 59.05) on the white tile.

The print run used 33 x 33 module symbols (25 data modules + 4 quiet each
side), so one module is 0.788 mm = 2.2337 pt = 9.3 px at 300 DPI. A symbol of
another size still fills the same 26.0 mm square; the module size is whatever
26.0 mm divided by its module count gives. Draw modules as crisp black
rectangles on the white tile, no anti-aliasing tricks, no rounding.

## Back, element by element

| Element | x | y | Size / notes |
|---|---|---|---|
| Signature band | 0 | 27.35 (top) | full page width x 32.14, fill #EEF2FA |
| STUDENT SIGNATURE | 20.55 | 45.99 (baseline) | Montserrat Bold 4.6 pt, caps, tracking 0.736 pt, #666666 |
| IF FOUND | 20.55 | 113.47 (baseline) | Montserrat Bold 4.6 pt, caps, tracking 0.736 pt, #E3C778 |
| Body line 1 | 20.55 | 128.21 (baseline) | "Return to the front desk at your nearest Alpha", Bold 5.6 pt |
| Body line 2 | 20.55 | 138.42 (baseline) | "campus.", 10.21 pt line pitch |
| Bird | 185.12 | 130.06 (top) | 12.08 x 8.12 |
| ALPHA wordmark | 200.67 | 137.28 (baseline) | Michroma 5.6 pt, tracking 0.672 pt, right edge at 231.45 |

The back is identical on every card. `back/ALPHA-CARD-BACK.pdf` is the
print-ready vector original; `templates/back.svg` reproduces it.

## Output

For print, one page per card at the full page size (252 x 162.37 pt) with the
artwork running into the bleed, fronts in one PDF and the back as its own
single-page PDF, mirroring the September handoff. For screens, 1050 x 677 px
(300 DPI) is the reference raster; 600 DPI is 2100 x 1354.
