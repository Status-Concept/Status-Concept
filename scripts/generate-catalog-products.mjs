import fs from "node:fs";
import path from "node:path";

const repoRoot = path.resolve(import.meta.dirname, "..");
const sourceRoot = path.resolve(repoRoot, "..", "Produtos-Status-Concept");
const statusRoot = path.join(sourceRoot, "Status Concept");
const kitchenRoot = path.join(sourceRoot, "modular kitchen");
const publicImageDir = path.join(repoRoot, "public", "product-images", "catalog");
const outputFile = path.join(repoRoot, "src", "data", "catalogProducts.js");

const imageExtensions = new Set([".jpg", ".jpeg", ".png", ".webp"]);
const excludedProductNames = new Set(["ARTIFICIAL PLANTS"]);
const categoryLabels = {
  lounge: "Lounge",
  dining: "Dining",
  sunlounger: "Sun Loungers",
  daybed: "Day Beds",
  coffee: "Coffee Tables",
  side: "Side Tables",
  bar: "Bar & Patio",
  puffs: "Puffs",
  shade: "Shade",
  kitchen: "Modular Kitchen",
  decor: "Decor",
};

const slug = (value) => String(value || "")
  .normalize("NFD")
  .replace(/[\u0300-\u036f]/g, "")
  .toLowerCase()
  .replace(/&/g, " and ")
  .replace(/[^a-z0-9]+/g, "-")
  .replace(/(^-|-$)/g, "");

const cleanValue = (value) => {
  const text = String(value || "").trim();
  if (!text || text === "-" || /^n\/d$/i.test(text)) return "";
  return text;
};

const stripHtml = (html = "") => cleanValue(html
  .replace(/<br\s*\/?>/gi, "\n")
  .replace(/<[^>]*>/g, " ")
  .replace(/&nbsp;/g, " ")
  .replace(/&amp;/g, "&")
  .replace(/&quot;/g, "\"")
  .replace(/&#39;/g, "'")
  .replace(/\s+/g, " "));

const readText = (file) => {
  const buffer = fs.readFileSync(file);
  const utf8 = buffer.toString("utf8");
  return /Ã.|Â./.test(utf8) ? buffer.toString("latin1") : utf8;
};

const truncate = (text, max = 190) => {
  const value = cleanValue(text);
  if (value.length <= max) return value;
  return `${value.slice(0, max).trim().replace(/[,.]+$/, "")}.`;
};

const walk = (dir, predicate, results = []) => {
  if (!fs.existsSync(dir)) return results;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(fullPath, predicate, results);
    } else if (predicate(fullPath)) {
      results.push(fullPath);
    }
  }
  return results;
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

const categoryFromSource = (sourceCategory, name = "", parentCategory = "") => {
  const value = `${sourceCategory} ${parentCategory} ${name}`.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  if (/kitchen|cozinha|bbq|barbecue|grill/.test(value)) return "kitchen";
  if (/decor|decoracao|acessor|plant|vase|light|lighting|tapete|carpet/.test(value)) return "decor";
  if (/pergola|parasol|shade|sombra|glatz/.test(value)) return "shade";
  if (/daybed/.test(value)) return "daybed";
  if (/espreguic|sun\s*lounger|lounger/.test(value)) return "sunlounger";
  if (/puff|pouf|ottoman/.test(value)) return "puffs";
  if (/bar|patio/.test(value)) return "bar";
  if (/side|lateral/.test(value)) return "side";
  if (/coffee|centro/.test(value)) return "coffee";
  if (/mesa|dining|jantar|cadeira|chair|poltrona/.test(value)) return "dining";
  if (/sofa|lounge|set/.test(value)) return "lounge";
  return "lounge";
};

const collectionFromName = (name, fallback = "Status Concept") => {
  const cleaned = String(name || fallback).replace(/\s*\([^)]*\)\s*/g, " ").replace(/\s+/g, " ").trim();
  return cleaned.split(/\s+-\s+/)[0] || fallback;
};

const firstMarkdownImage = (markdown) => {
  const matches = [...markdown.matchAll(/!\[[^\]]*]\(([^)]+)\)/g)].map((match) => decodeURIComponent(match[1]));
  return matches.find((item) => /960x960/i.test(item)) || matches[0] || "";
};

const listImages = (dir) => walk(dir, (file) => imageExtensions.has(path.extname(file).toLowerCase()))
  .filter((file) => !/thumbs\.db$/i.test(file))
  .sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" }));

const pickImage = (productDir, markdown = "") => {
  const markdownImage = firstMarkdownImage(markdown);
  if (markdownImage) {
    const resolved = path.resolve(productDir, markdownImage.replace(/\//g, path.sep));
    if (fs.existsSync(resolved)) return resolved;
  }
  const images = listImages(productDir);
  return images.find((file) => /960x960/i.test(file)) || images[0] || "";
};

const copyImage = (imagePath, id) => {
  if (!imagePath || !fs.existsSync(imagePath)) return "/placeholder.svg";
  fs.mkdirSync(publicImageDir, { recursive: true });
  const ext = path.extname(imagePath).toLowerCase() || ".jpg";
  const fileName = `${id}${ext}`;
  fs.copyFileSync(imagePath, path.join(publicImageDir, fileName));
  return `/product-images/catalog/${fileName}`;
};

const uniqueId = (base, used) => {
  let id = base || "product";
  let index = 2;
  while (used.has(id)) {
    id = `${base}-${index}`;
    index += 1;
  }
  used.add(id);
  return id;
};

const parseStatusProducts = (usedIds) => {
  const files = walk(statusRoot, (file) => path.basename(file).toLowerCase() === "info.md" && !file.includes(`${path.sep}_raw${path.sep}`));

  return files.map((file) => {
    const productDir = path.dirname(file);
    const markdown = readText(file);
    const table = readInfoTable(markdown);
    const folderName = path.basename(productDir);
    const parentCategory = path.basename(path.dirname(productDir));
    const title = cleanValue(table.Nome) || cleanValue(markdown.match(/^#\s+(.+)$/m)?.[1]) || folderName;
    if (excludedProductNames.has(title.toUpperCase())) return null;

    const supplier = cleanValue(table["Marca / Fornecedor"]);
    const sourceCategory = cleanValue(table["Categoria (tipo)"]) || parentCategory;
    const originalModel = cleanValue(table["Modelo original do fornecedor"]);
    const id = uniqueId(slug(`${title}-${supplier || parentCategory}`), usedIds);
    const collectionName = collectionFromName(title);
    const category = categoryFromSource(sourceCategory, title, parentCategory);
    const img = copyImage(pickImage(productDir, markdown), id);
    const fallbackDesc = `${categoryLabels[category] || "Outdoor living"} piece from the ${collectionName} collection.`;

    return {
      id,
      name: title,
      collection: slug(collectionName) || "status-concept",
      collectionName,
      category,
      categoryLabel: categoryLabels[category] || "Outdoor living",
      img,
      tag: "",
      desc: originalModel ? `Supplier model: ${originalModel}.` : fallbackDesc,
      tagline: originalModel ? `${title} from Status Concept, based on supplier model ${originalModel}.` : fallbackDesc,
      supplier,
      sku: cleanValue(table.SKU),
      sourceCategory,
      sourcePath: path.relative(sourceRoot, productDir).replaceAll(path.sep, "/"),
    };
  }).filter(Boolean);
};

const collectionMetaFromKitchenPath = (file) => {
  const relative = path.relative(kitchenRoot, path.dirname(file)).split(path.sep);
  const collectionName = relative[0] || "Modular Kitchen";
  const key = slug(collectionName);
  return { key, label: collectionName };
};

const parseKitchenProducts = (usedIds) => {
  const files = walk(kitchenRoot, (file) => path.basename(file).toLowerCase() === "product.json");

  return files.map((file) => {
    const product = JSON.parse(fs.readFileSync(file, "utf8"));
    const { key, label } = collectionMetaFromKitchenPath(file);
    const title = cleanValue(product.title) || path.basename(path.dirname(file));
    const variant = product.variants?.[0] || {};
    const sourceImage = listImages(path.dirname(file))[0];
    const id = uniqueId(slug(product.handle || `${title}-${label}`), usedIds);
    const img = copyImage(sourceImage, id);

    return {
      id,
      name: title,
      collection: key,
      collectionName: label,
      category: "kitchen",
      categoryLabel: categoryLabels.kitchen,
      img,
      tag: "",
      desc: truncate(stripHtml(product.body_html), 170) || `${label} modular outdoor kitchen component.`,
      tagline: truncate(stripHtml(product.body_html), 240) || `${title} from the ${label} modular outdoor kitchen collection.`,
      supplier: cleanValue(product.vendor),
      sku: cleanValue(variant.sku),
      price: cleanValue(variant.price),
      sourceCategory: cleanValue(product.product_type),
      sourcePath: path.relative(sourceRoot, path.dirname(file)).replaceAll(path.sep, "/"),
    };
  });
};

const usedIds = new Set();
const products = [...parseStatusProducts(usedIds), ...parseKitchenProducts(usedIds)]
  .sort((a, b) => a.category.localeCompare(b.category) || a.name.localeCompare(b.name));

const counts = products.reduce((acc, product) => {
  acc[product.category] = (acc[product.category] || 0) + 1;
  acc.all = (acc.all || 0) + 1;
  return acc;
}, {});

fs.mkdirSync(path.dirname(outputFile), { recursive: true });
fs.writeFileSync(outputFile, `// Generated by scripts/generate-catalog-products.mjs from Produtos-Status-Concept.\n// Re-run the script after changing the source product folder.\n\nexport const catalogProducts = ${JSON.stringify(products, null, 2)};\n\nexport const catalogCategoryCounts = ${JSON.stringify(counts, null, 2)};\n`, "utf8");

console.log(`Generated ${products.length} products.`);
console.log(counts);
