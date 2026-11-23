import { copyFileSync, existsSync, mkdirSync, readFileSync, statSync } from "node:fs";

const botDir = process.env.MAKEFUN_BOT_DIR ?? "/bot";
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
const source = `${botDir}/entry.png`;
const target = `${outDir}/entry.png`;

if (!existsSync(source)) {
  throw new Error(`missing entry image: ${source}`);
}

mkdirSync(outDir, { recursive: true });
copyFileSync(source, target);

const size = statSync(target).size;
if (size === 0 || size > 1048576) {
  throw new Error(`entry image is out of bounds: ${size} bytes`);
}

const head = readFileSync(target).subarray(0, 8);
const pngSignature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
if (!head.equals(pngSignature)) {
  throw new Error("entry image is not a PNG");
}

console.log(`wrote ${target}: ${size} bytes`);
