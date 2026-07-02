// Classify each catalog product's lead image as studio (white/uniform background)
// or scene, and stamp a `fit` field onto src/data/catalogProducts.js:
//   fit: "contain"  -> studio shot: render contained with padding on a neutral tile
//   fit: "wide"     -> wide scene (AR >= 1.3): render in a 4/3 landscape card
//   (no fit)        -> squarish/portrait scene: default cover is fine
//
// Idempotent: re-running recomputes and rewrites the fit fields.
// Usage: node scripts/classify-catalog-images.mjs

import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const repoRoot = path.resolve(import.meta.dirname, "..");
const dataFile = path.join(repoRoot, "src", "data", "catalogProducts.js");

const { catalogProducts } = await import("file://" + dataFile.replace(/\\/g, "/"));

const isNearWhite = ({ r, g, b }) => r > 232 && g > 232 && b > 232;
const isUniform = (a, b) => Math.abs(a.r - b.r) + Math.abs(a.g - b.g) + Math.abs(a.b - b.b) < 24;

async function classify(absImage) {
  const img = sharp(absImage);
  const { width, height } = await img.metadata();
  const ar = width / height;
  const { data, info } = await img.raw().toBuffer({ resolveWithObject: true });
  const px = (x, y) => {
    const i = (y * info.width + x) * info.channels;
    return { r: data[i], g: data[i + 1], b: data[i + 2] };
  };
  const m = 4;
  const corners = [
    px(m, m), px(info.width - 1 - m, m),
    px(m, info.height - 1 - m), px(info.width - 1 - m, info.height - 1 - m),
    px(Math.floor(info.width / 2), m), // top centre: studio shots have clean top edges
  ];
  const whiteCorners = corners.filter(isNearWhite).length;
  const uniformCorners = corners.filter((c) => isUniform(c, corners[0])).length;
  const light = (c) => (c.r + c.g + c.b) / 3 >= 200;
  const studio = whiteCorners >= 4
    || (whiteCorners >= 3 && uniformCorners >= 4)
    || (uniformCorners >= 5 && corners.every(light));
  if (studio) return "contain";
  if (ar >= 1.3) return "wide";
  return null;
}

let contain = 0, wide = 0, cover = 0, missing = 0;
const fits = {};
for (const product of catalogProducts) {
  const abs = path.join(repoRoot, "public", product.img.replace(/^\//, ""));
  if (!fs.existsSync(abs)) { missing++; continue; }
  const fit = await classify(abs);
  if (fit === "contain") contain++;
  else if (fit === "wide") wide++;
  else cover++;
  if (fit) fits[product.id] = fit;
}

// Rewrite the data file: strip any existing fit fields, then inject the new ones
// right after each entry's "id" line.
let text = fs.readFileSync(dataFile, "utf8");
text = text.replace(/^\s*"fit": "[a-z]+",\r?\n/gm, "");
text = text.replace(/^(\s*)"id": "([^"]+)",\r?\n/gm, (whole, indent, id) =>
  fits[id] ? `${whole}${indent}"fit": "${fits[id]}",\n` : whole);
fs.writeFileSync(dataFile, text);

console.log(JSON.stringify({ classified: catalogProducts.length, contain, wide, coverDefault: cover, missing }, null, 2));
