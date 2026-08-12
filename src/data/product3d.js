// Product-level 3D metadata. The catalogue remains generated from the source
// sheet; this separate map keeps the optional local 3D experience independent.
const PRODUCT_3D_ROOT = "/models/lounge";

const loungeModels = [
  {
    id: "barcelona-able",
    name: "BARCELONA (Able)",
    src: `${PRODUCT_3D_ROOT}/barcelona-able/barcelona-able.glb`,
    poster: `${PRODUCT_3D_ROOT}/barcelona-able/poster.webp`,
    cameraOrbit: "42deg 68deg 4.8m",
    cameraTarget: "0m 0.535m 0m",
  },
  {
    id: "bonaire-able",
    name: "BONAIRE (Able)",
    src: `${PRODUCT_3D_ROOT}/bonaire-able/bonaire-able.glb`,
    poster: `${PRODUCT_3D_ROOT}/bonaire-able/poster.webp`,
    cameraOrbit: "35deg 72deg 4.6m",
    cameraTarget: "0m 0.995m 0m",
  },
  {
    id: "hawaii-able",
    name: "HAWAII (Able)",
    src: `${PRODUCT_3D_ROOT}/hawaii-able/hawaii-able.glb`,
    poster: `${PRODUCT_3D_ROOT}/hawaii-able/poster.webp`,
    cameraOrbit: "42deg 66deg 4.1m",
    cameraTarget: "0m 0.499m 0m",
  },
  {
    id: "ibiza-able",
    name: "IBIZA (Able)",
    src: `${PRODUCT_3D_ROOT}/ibiza-able/ibiza-able.glb`,
    poster: `${PRODUCT_3D_ROOT}/ibiza-able/poster.webp`,
    cameraOrbit: "35deg 70deg 3.4m",
    cameraTarget: "0m 0.802m 0m",
  },
  {
    id: "la-spezia-able",
    name: "LA SPEZIA (Able)",
    src: `${PRODUCT_3D_ROOT}/la-spezia-able/la-spezia-able.glb`,
    poster: `${PRODUCT_3D_ROOT}/la-spezia-able/poster.webp`,
    cameraOrbit: "35deg 70deg 3.8m",
    cameraTarget: "0m 0.73m 0m",
  },
  {
    id: "monaco-able",
    name: "MONACO (Able)",
    src: `${PRODUCT_3D_ROOT}/monaco-able/monaco-able.glb`,
    poster: `${PRODUCT_3D_ROOT}/monaco-able/poster.webp`,
    cameraOrbit: "35deg 69deg 4.9m",
    cameraTarget: "-0.245m 0.892m 0.004m",
  },
  {
    id: "riviera-able",
    name: "RIVIERA (Able)",
    src: `${PRODUCT_3D_ROOT}/riviera-able/riviera-able.glb`,
    poster: `${PRODUCT_3D_ROOT}/riviera-able/poster.webp`,
    cameraOrbit: "38deg 68deg 3m",
    cameraTarget: "0m 0.47m 0.011m",
  },
  {
    id: "sophia-able",
    name: "SOPHIA (Able)",
    src: `${PRODUCT_3D_ROOT}/sophia-able/sophia-able.glb`,
    poster: `${PRODUCT_3D_ROOT}/sophia-able/poster.webp`,
    cameraOrbit: "35deg 69deg 4.2m",
    cameraTarget: "0m 0.995m -0.075m",
  },
];

export const product3dById = Object.fromEntries(loungeModels.map((model) => [model.id, model]));

export const getProduct3d = (productId) => product3dById[productId] || null;

export const product3dIds = loungeModels.map((model) => model.id);
