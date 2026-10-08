# Alpha Card template

The design of the Alpha student card, as data: artwork, fonts, measured
geometry, and the text rules, so the card can be rendered from any platform.

```
assets/artwork/    card-background.png (600 DPI, shared by both sides), bird-white.png
assets/fonts/      Montserrat-Bold.ttf, Michroma-Regular.ttf (+ OFL licences)
templates/         front.svg (with {{TOKENS}}), back.svg (complete)
back/              ALPHA-CARD-BACK.pdf (print-ready vector), back-300dpi.png
reference/         render.ts, a dependency-free reference implementation of the
                   text rules, plus the Montserrat Bold advance-width table
examples/          rendered samples with made-up names and a placeholder QR
SPEC.md            every measurement and rule
```

## What this does not do

**It does not generate card codes or QR codes.** Both come from the Alpha
Credit Cards system and are imported. The template takes:

- the 20-character code string, already issued, which it prints under the QR
- the QR symbol, already encoded, as a module matrix (or an SVG) which it
  places on the white tile

Nothing in this repository encodes, checks, or invents either one. See
"QR placement" in SPEC.md for the square the imported symbol has to fill.

## Rendering the front

Inputs: `name`, `campus`, `code` (20 chars), `qr` (square boolean matrix
including the quiet zone, or a pre-drawn SVG group).

1. Wrap the name: Montserrat Bold 12.1 pt, max 123 pt per line, greedy on
   spaces, at most two lines, never scaled.
2. Baselines: last line 128.49; the line above 114.46; the rule 15.88 above
   the top line.
3. Campus in capitals at 5.1 pt, tracked 0.19 em.
4. Group the code in fives, measure it, and pick the size that makes it
   84.8 pt wide; right-align to x = 231.45.
5. Draw the QR modules as black rectangles filling the 73.70 pt square at
   (155.48, 59.05).

`reference/render.ts` does all five and returns the finished SVG string. It
has no dependencies; rasterise the SVG with whatever your platform uses (the
Alpha Cards site uses resvg, with the two bundled font files loaded and system
fonts turned off, at 1050 px wide for 300 DPI).

The back needs no inputs: use `templates/back.svg`, `back/back-300dpi.png` or
the vector `back/ALPHA-CARD-BACK.pdf` as is.

## Checking a render

Overlay your output on `examples/front-one-line.png` and `front-two-line.png`
(both 1050 x 677, 300 DPI). Name, campus, code and wordmark should land within
about 3 px. The sample QR in those images is a placeholder pattern, not a real
code.

## Provenance

Built from the September 2026 print run (596 cards). The artwork and the
measurements are the run's own. Fonts are Google Fonts builds under the SIL
Open Font License. The ALPHA wordmark is set in Michroma as a stand-in for
Neuropolitical, exactly as the print run was.
