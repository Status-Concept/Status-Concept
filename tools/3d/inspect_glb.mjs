import fs from "node:fs/promises";
import path from "node:path";

const root = path.resolve("public/models/lounge");
const productIds = [
  "barcelona-able",
  "bonaire-able",
  "hawaii-able",
  "ibiza-able",
  "la-spezia-able",
  "monaco-able",
  "riviera-able",
  "sophia-able",
];

const identity = () => [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];

const multiply = (a, b) => {
  const result = new Array(16).fill(0);
  for (let column = 0; column < 4; column += 1) {
    for (let row = 0; row < 4; row += 1) {
      result[column * 4 + row] =
        a[row] * b[column * 4] +
        a[4 + row] * b[column * 4 + 1] +
        a[8 + row] * b[column * 4 + 2] +
        a[12 + row] * b[column * 4 + 3];
    }
  }
  return result;
};

const fromTrs = (translation = [0, 0, 0], rotation = [0, 0, 0, 1], scale = [1, 1, 1]) => {
  const [x, y, z, w] = rotation;
  const [sx, sy, sz] = scale;
  return [
    (1 - 2 * (y * y + z * z)) * sx,
    (2 * (x * y + z * w)) * sx,
    (2 * (x * z - y * w)) * sx,
    0,
    (2 * (x * y - z * w)) * sy,
    (1 - 2 * (x * x + z * z)) * sy,
    (2 * (y * z + x * w)) * sy,
    0,
    (2 * (x * z + y * w)) * sz,
    (2 * (y * z - x * w)) * sz,
    (1 - 2 * (x * x + y * y)) * sz,
    0,
    translation[0],
    translation[1],
    translation[2],
    1,
  ];
};

const transformPoint = (matrix, point) => ({
  x: matrix[0] * point[0] + matrix[4] * point[1] + matrix[8] * point[2] + matrix[12],
  y: matrix[1] * point[0] + matrix[5] * point[1] + matrix[9] * point[2] + matrix[13],
  z: matrix[2] * point[0] + matrix[6] * point[1] + matrix[10] * point[2] + matrix[14],
});

const readGlb = async (filePath) => {
  const buffer = await fs.readFile(filePath);
  let offset = 12;
  let json = null;
  while (offset < buffer.length) {
    const chunkLength = buffer.readUInt32LE(offset);
    const chunkType = buffer.readUInt32LE(offset + 4);
    if (chunkType === 0x4e4f534a) {
      json = JSON.parse(buffer.subarray(offset + 8, offset + 8 + chunkLength).toString("utf8"));
      break;
    }
    offset += 8 + chunkLength;
  }
  if (!json) throw new Error(`No JSON chunk in ${filePath}`);

  const bounds = [];
  const addMeshBounds = (meshIndex, worldMatrix) => {
    const mesh = json.meshes?.[meshIndex];
    for (const primitive of mesh?.primitives || []) {
      const accessor = json.accessors?.[primitive.attributes?.POSITION];
      if (!accessor?.min || !accessor?.max) continue;
      const [minX, minY, minZ] = accessor.min;
      const [maxX, maxY, maxZ] = accessor.max;
      for (const point of ([
        [minX, minY, minZ], [minX, minY, maxZ], [minX, maxY, minZ], [minX, maxY, maxZ],
        [maxX, minY, minZ], [maxX, minY, maxZ], [maxX, maxY, minZ], [maxX, maxY, maxZ],
      ])) bounds.push(transformPoint(worldMatrix, point));
    }
  };

  const visit = (nodeIndex, parentMatrix) => {
    const node = json.nodes?.[nodeIndex];
    if (!node) return;
    const localMatrix = node.matrix || fromTrs(node.translation, node.rotation, node.scale);
    const worldMatrix = multiply(parentMatrix, localMatrix);
    if (node.mesh != null) addMeshBounds(node.mesh, worldMatrix);
    for (const child of node.children || []) visit(child, worldMatrix);
  };

  const scene = json.scenes?.[json.scene ?? 0];
  for (const nodeIndex of scene?.nodes || []) visit(nodeIndex, identity());
  const min = bounds.reduce((current, point) => ({
    x: Math.min(current.x, point.x), y: Math.min(current.y, point.y), z: Math.min(current.z, point.z),
  }), {x: Infinity, y: Infinity, z: Infinity});
  const max = bounds.reduce((current, point) => ({
    x: Math.max(current.x, point.x), y: Math.max(current.y, point.y), z: Math.max(current.z, point.z),
  }), {x: -Infinity, y: -Infinity, z: -Infinity});
  return {
    min,
    max,
    center: {x: (min.x + max.x) / 2, y: (min.y + max.y) / 2, z: (min.z + max.z) / 2},
    size: {x: max.x - min.x, y: max.y - min.y, z: max.z - min.z},
  };
};

for (const id of productIds) {
  const result = await readGlb(path.join(root, id, `${id}.glb`));
  console.log(id, JSON.stringify(result));
}
