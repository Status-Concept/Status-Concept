// Generates src/data/catalogProducts.js from scripts/missing-products-manifest.json,
// pulling product data + images from ../Produtos-Status-Concept (two source trees:
// the site-statusconcept.com WooCommerce scrape and the "Status Concept" PT catalog).
// Images are converted to WebP (max 1600px, q80) into public/product-images/catalog/<id>/.
//
// The manifest is the curated list of products missing from the live site (deduped
// against glatzProducts.js / kitchenProducts.js / the Sicily set). Regenerate it from
// a fresh source-vs-site diff before re-running this script.
//
// Usage: node scripts/generate-catalog-products.mjs

import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const repoRoot = path.resolve(import.meta.dirname, "..");
const sourceRoot = path.resolve(repoRoot, "..", "Produtos-Status-Concept");
const publicImageDir = path.join(repoRoot, "public", "product-images", "catalog");
const outputFile = path.join(repoRoot, "src", "data", "catalogProducts.js");
const manifestFile = path.join(repoRoot, "scripts", "missing-products-manifest.json");

const MAX_IMAGES = 8;
const imageExtensions = new Set([".jpg", ".jpeg", ".png", ".webp"]);

const categoryLabels = {
  lounge: "Lounge",
  dining: "Dining",
  sunlounger: "Sun Loungers & Day Beds",
  shade: "Shade Solutions",
  kitchen: "Outdoor Kitchens",
  decor: "Decor",
};

const slug = (value) => String(value || "")
  .normalize("NFD")
  .replace(/[̀-ͯ]/g, "")
  .toLowerCase()
  .replace(/&/g, " and ")
  .replace(/[^a-z0-9]+/g, "-")
  .replace(/(^-|-$)/g, "");

const decodeEntities = (text = "") => text
  .replace(/&#0?38;|&amp;/g, "&")
  .replace(/&#0?39;|&apos;/g, "'")
  .replace(/&quot;/g, '"')
  .replace(/&nbsp;/g, " ")
  .replace(/&#8211;|&ndash;/g, "-")
  .replace(/&#8212;|&mdash;/g, "-")
  .replace(/&#174;|&reg;/g, "®")
  .replace(/&#8220;|&#8221;/g, '"')
  .replace(/&#8217;|&#8216;/g, "'");

const cleanValue = (value) => {
  const text = String(value || "").trim();
  if (!text || text === "-" || /^n\/d$/i.test(text)) return "";
  return text;
};

const cleanProductName = (value) => cleanValue(value)
  .replace(/\bDinning\b/g, "Dining");

const stripHtml = (html = "") => cleanValue(decodeEntities(html)
  .replace(/<style[\s\S]*?<\/style>/gi, " ")
  .replace(/<script[\s\S]*?<\/script>/gi, " ")
  .replace(/<br\s*\/?>/gi, "\n")
  .replace(/<[^>]*>/g, " ")
  .replace(/—/g, "-")
  .replace(/\bevery day lifestyle\b/gi, "everyday lifestyle")
  .replace(/\bandare\b/gi, "and are")
  .replace(/\s+/g, " "));

const truncate = (text, max = 190) => {
  const value = cleanValue(text);
  if (value.length <= max) return value;
  const cut = value.slice(0, max);
  const lastStop = Math.max(cut.lastIndexOf(". "), cut.lastIndexOf("! "));
  if (lastStop > max * 0.4) return cut.slice(0, lastStop + 1);
  const lastWord = cut.lastIndexOf(" ");
  const safeCut = lastWord > max * 0.6 ? cut.slice(0, lastWord) : cut;
  return `${safeCut.trim().replace(/[,.;:]+$/, "")}.`;
};

const readText = (file) => {
  const buffer = fs.readFileSync(file);
  const utf8 = buffer.toString("utf8");
  return /Ã.|Â./.test(utf8) ? buffer.toString("latin1") : utf8;
};

const readInfoTable = (markdown) => {
  const table = {};
  for (const line of markdown.split(/\r?\n/)) {
    const match = line.match(/^\|\s*([^|]+?)\s*\|\s*([^|]+?)\s*\|$/);
    if (!match || /^-+$/.test(match[1].trim())) continue;
    table[match[1].trim()] = cleanValue(match[2]);
  }
  return table;
};

const listImages = (dir, recursive = false) => {
  if (!fs.existsSync(dir)) return [];
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) { if (recursive) out.push(...listImages(p, true)); }
    else if (imageExtensions.has(path.extname(entry.name).toLowerCase()) && !/thumbs\.db$/i.test(entry.name)) out.push(p);
  }
  return out.sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" }));
};

const collectionFromName = (name) => {
  const cleaned = String(name || "").replace(/\s*\([^)]*\)\s*/g, " ").replace(/\s+/g, " ").trim();
  const first = cleaned.split(/\s+[-–]\s+/)[0] || cleaned;
  return first.split(/\s+/).slice(0, 2).join(" ");
};

async function copyImages(imagePaths, id) {
  const destDir = path.join(publicImageDir, id);
  fs.mkdirSync(destDir, { recursive: true });
  const urls = [];
  let n = 0;
  for (const src of imagePaths.slice(0, MAX_IMAGES)) {
    n += 1;
    const fileName = `${String(n).padStart(2, "0")}.webp`;
    await sharp(src).rotate().resize({ width: 1600, withoutEnlargement: true }).webp({ quality: 80 }).toFile(path.join(destDir, fileName));
    urls.push(`/product-images/catalog/${id}/${fileName}`);
  }
  return urls;
}

function resolveSourceDir(item) {
  const treeDir = item.sourceTree === "site-statusconcept.com"
    ? path.join(sourceRoot, "site-statusconcept.com")
    : path.join(sourceRoot, "Status Concept");
  let rel = item.sourceFolder.replace(/\\/g, "/");
  const treeName = path.basename(treeDir);
  if (rel.startsWith(`${treeName}/`)) rel = rel.slice(treeName.length + 1);
  if (rel.startsWith("Produtos-Status-Concept/")) rel = rel.split("/").slice(2).join("/");
  return path.join(treeDir, ...rel.split("/"));
}

function parseScrapeProduct(dir, item) {
  const jsonFile = path.join(dir, "product.json");
  const record = fs.existsSync(jsonFile) ? JSON.parse(readText(jsonFile)) : {};
  const name = cleanProductName(decodeEntities(record.name)) || cleanProductName(item.name);
  const short = stripHtml(record.short_description || "");
  const long = stripHtml(record.description || "");
  const brand = cleanValue(record.brands?.[0]?.name);
  return {
    name,
    desc: truncate(short || long, 190) || `${categoryLabels[item.category]} piece from the Status Concept collection.`,
    tagline: truncate(short || long, 280) || `${name} from the Status Concept ${categoryLabels[item.category].toLowerCase()} collection.`,
    supplier: brand || "",
    sku: cleanValue(record.sku),
    images: listImages(dir),
  };
}

function parsePtProduct(dir, item) {
  const infoFile = path.join(dir, "info.md");
  const table = fs.existsSync(infoFile) ? readInfoTable(readText(infoFile)) : {};
  const name = cleanProductName(table.Nome) || cleanProductName(item.name);
  const supplier = cleanValue(table["Marca / Fornecedor"]);
  const originalModel = cleanValue(table["Modelo original do fornecedor"]);
  const label = categoryLabels[item.category] || "Outdoor living";
  const desc = originalModel
    ? `${label} piece, based on the ${supplier || "supplier"} ${originalModel} model.`
    : `${label} piece from the Status Concept collection.`;
  // Originals live in images/; some products only carry resized copies in images/960x960.
  const rootImages = listImages(path.join(dir, "images"));
  const images = rootImages.length ? rootImages : listImages(path.join(dir, "images"), true);
  return {
    name,
    desc,
    tagline: desc,
    supplier,
    sku: cleanValue(table.SKU),
    images,
  };
}

const manifest = JSON.parse(fs.readFileSync(manifestFile, "utf8"));

// Fresh output tree: the previous flat catalog images belonged to the dead file.
fs.rmSync(publicImageDir, { recursive: true, force: true });
fs.mkdirSync(publicImageDir, { recursive: true });

const usedIds = new Set();
const products = [];
const problems = [];

for (const item of manifest) {
  const dir = resolveSourceDir(item);
  if (!fs.existsSync(dir)) { problems.push(`MISSING DIR: ${item.name} -> ${dir}`); continue; }
  const isScrape = item.sourceTree === "site-statusconcept.com";
  const parsed = isScrape ? parseScrapeProduct(dir, item) : parsePtProduct(dir, item);
  if (!parsed.images.length) { problems.push(`NO IMAGES: ${item.name} -> ${dir}`); continue; }

  let id = isScrape ? slug(path.basename(dir)) : slug(parsed.name);
  if (usedIds.has(id)) { let i = 2; while (usedIds.has(`${id}-${i}`)) i += 1; id = `${id}-${i}`; }
  usedIds.add(id);

  const isBullKitchen = item.category === "kitchen";
  const collectionName = isBullKitchen ? "Bull" : collectionFromName(parsed.name);
  const imageUrls = await copyImages(parsed.images, id);
  const sourcePath = path.relative(sourceRoot, dir).replaceAll(path.sep, "/");

  products.push({
    id,
    name: parsed.name,
    collection: isBullKitchen ? "bull" : (slug(collectionName) || "status-concept"),
    collectionName,
    category: item.category,
    categoryLabel: categoryLabels[item.category] || "Outdoor living",
    img: imageUrls[0],
    images: imageUrls,
    tag: "",
    desc: parsed.desc,
    tagline: parsed.tagline,
    supplier: parsed.supplier,
    sku: parsed.sku,
    sourcePath,
    // Canonical fields are emitted even while the approval workbook is being
    // populated. Empty fields stay empty until an official source is checked.
    subcategory: "",
    productType: [],
    materialFamilies: [],
    specs: [],
    dimensions: [],
    materials: [],
    sourceUrl: item.sourceTree === "site-statusconcept.com" ? `https://${sourcePath}` : "",
    reviewedAt: "",
    approvalStatus: "review",
  });
}

products.sort((a, b) => a.category.localeCompare(b.category) || a.name.localeCompare(b.name));

const counts = products.reduce((acc, product) => {
  acc[product.category] = (acc[product.category] || 0) + 1;
  acc.all = (acc.all || 0) + 1;
  return acc;
}, {});

fs.writeFileSync(outputFile, `// Generated by scripts/generate-catalog-products.mjs from Produtos-Status-Concept\n// via scripts/missing-products-manifest.json. Re-run the script after changing either.\n\nexport const catalogProducts = ${JSON.stringify(products, null, 2)};\n\nexport const catalogCategoryCounts = ${JSON.stringify(counts, null, 2)};\n`, "utf8");

console.log(JSON.stringify({ generated: products.length, counts, problems }, null, 2));
