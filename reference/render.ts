/**
 * Alpha Card front: reference implementation of the text rules in SPEC.md.
 *
 * No dependencies. Returns an SVG string in the page's point coordinate
 * space (252 x 162.3685 pt, bleed included). Rasterise it with any SVG
 * engine that can load assets/fonts/*.ttf (resvg, librsvg, a browser, Skia).
 *
 * The card code and the QR are INPUTS. This file prints the code and places
 * the QR; it does not create either.
 */
import advancesJson from "./montserrat-bold-advances.json";

export const PAGE = { w: 252, h: 162.3685 } as const; // pt, 88.90 x 57.28 mm
export const PX_300 = { w: 1050, h: 677 } as const;

export type QrMatrix = boolean[][]; // square, INCLUDING the quiet zone

export type FrontInput = {
  name: string;
  campus: string;
  code: string; // 20 characters, already issued
  qr: QrMatrix | { svg: string }; // module matrix, or a pre-drawn <g> fragment
  /** Paths to the artwork as the SVG should reference them. */
  assets?: { background: string; bird: string };
};

const G = {
  bird: { x: 20.5512, y: 19.9963, w: 19.4196, h: 13.05 },
  wordmark: { x: 45.55, baseline: 31.61, size: 9, trackingEm: 0.12 },
  tile: { x: 153.21, y: 56.78, size: 78.24, radius: 2.5 },
  qr: { x: 155.48, y: 59.05, size: 73.7 },
  name: { x: 20.55, baseline: 128.49, size: 12.1, lineGap: 14.03, maxWidth: 123 },
  rule: { x: 20.55, w: 47.18, h: 0.94, aboveBaseline: 15.88 },
  campus: { x: 20.55, baseline: 140.4, size: 5.1, trackingEm: 0.19 },
  code: { right: 231.45, baseline: 144.37, nominalSize: 5.9, fitWidth: 84.8 },
} as const;

const ADV: Record<string, number> = (advancesJson as { advances: Record<string, number> }).advances;

/** Width of `s` in Montserrat Bold at `size` pt, with optional tracking in em. */
export function textWidth(s: string, size: number, trackingEm = 0): number {
  let w = 0;
  for (const ch of s) w += ADV[ch] ?? 0.62; // 0.62 em is a safe stand-in for unmapped glyphs
  return w * size + trackingEm * size * Math.max(0, [...s].length - 1);
}

/** Greedy wrap into at most two lines of 123 pt, never scaling. */
export function wrapName(name: string): string[] {
  const n = G.name;
  const words = name.trim().split(/\s+/);
  if (textWidth(name.trim(), n.size) <= n.maxWidth || words.length === 1) return [name.trim()];
  let first: string[] = [];
  for (const w of words) {
    const trial = [...first, w].join(" ");
    if (first.length && textWidth(trial, n.size) > n.maxWidth) break;
    first.push(w);
  }
  if (first.length === words.length) first = words.slice(0, -1);
  return [first.join(" "), words.slice(first.length).join(" ")];
}

/** "A1B2C3D4E5F607182930" -> "A1B2 C3D4 E5F6 0718 2930" */
export function groupCode(code: string): string {
  return (code.match(/.{1,4}/g) ?? []).join(" ");
}

/** Font size that sets the grouped code exactly 84.8 pt wide. */
export function codeFontSize(grouped: string): number {
  const c = G.code;
  return (c.nominalSize * c.fitWidth) / textWidth(grouped, c.nominalSize);
}

/** Black rectangles for a module matrix, merged along rows, filling the 26 mm square. */
export function qrRects(matrix: QrMatrix): string {
  const n = matrix.length;
  const mod = G.qr.size / n;
  let out = "";
  for (let y = 0; y < n; y++) {
    let x = 0;
    while (x < n) {
      if (matrix[y][x]) {
        let run = 1;
        while (x + run < n && matrix[y][x + run]) run++;
        // +0.004 pt overlap hides hairline seams between adjacent rectangles
        out += `<rect x="${(G.qr.x + x * mod).toFixed(4)}" y="${(G.qr.y + y * mod).toFixed(4)}" width="${(run * mod + 0.004).toFixed(4)}" height="${(mod + 0.004).toFixed(4)}"/>`;
        x += run;
      } else x++;
    }
  }
  return out;
}

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

export function renderFrontSvg(input: FrontInput): string {
  const assets = input.assets ?? { background: "../assets/artwork/card-background.png", bird: "../assets/artwork/bird-white.png" };
  const lines = wrapName(input.name);
  const n = G.name;
  const baselines = lines.map((_, i) => n.baseline - (lines.length - 1 - i) * n.lineGap);
  const ruleY = baselines[0] - G.rule.aboveBaseline;
  const grouped = groupCode(input.code);
  const codeSize = codeFontSize(grouped);
  const qr = "svg" in input.qr ? input.qr.svg : qrRects(input.qr);
  const campus = input.campus.trim().toUpperCase();

  return `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${PX_300.w}" height="${PX_300.h}" viewBox="0 0 ${PAGE.w} ${PAGE.h}">
<image x="0" y="0" width="${PAGE.w}" height="${PAGE.h}" preserveAspectRatio="none" xlink:href="${assets.background}"/>
<image x="${G.bird.x}" y="${G.bird.y}" width="${G.bird.w}" height="${G.bird.h}" xlink:href="${assets.bird}"/>
<text x="${G.wordmark.x}" y="${G.wordmark.baseline}" font-family="Michroma" font-size="${G.wordmark.size}" letter-spacing="${(G.wordmark.trackingEm * G.wordmark.size).toFixed(3)}" fill="#fff">ALPHA</text>
<rect x="${G.tile.x}" y="${G.tile.y}" width="${G.tile.size}" height="${G.tile.size}" rx="${G.tile.radius}" fill="#fff"/>
<g fill="#000">${qr}</g>
<rect x="${G.rule.x}" y="${ruleY.toFixed(3)}" width="${G.rule.w}" height="${G.rule.h}" fill="#fff"/>
${lines.map((l, i) => `<text x="${n.x}" y="${baselines[i].toFixed(3)}" font-family="Montserrat" font-weight="700" font-size="${n.size}" fill="#fff">${esc(l)}</text>`).join("\n")}
<text x="${G.campus.x}" y="${G.campus.baseline}" font-family="Montserrat" font-weight="700" font-size="${G.campus.size}" letter-spacing="${(G.campus.trackingEm * G.campus.size).toFixed(3)}" fill="#fff">${esc(campus)}</text>
<text x="${G.code.right}" y="${G.code.baseline}" text-anchor="end" font-family="Montserrat" font-weight="700" font-size="${codeSize.toFixed(3)}" fill="#fff">${esc(grouped)}</text>
</svg>`;
}
