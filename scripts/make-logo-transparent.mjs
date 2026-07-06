import fs from "fs";
import path from "path";
import jpeg from "jpeg-js";
import { PNG } from "pngjs";

const sources = [
  path.resolve("satx-ai-logo.png"),
  path.resolve("public/satx-ai-logo.png"),
];

function convertToTransparentPng(filePath) {
  if (!fs.existsSync(filePath)) {
    console.log("skip missing:", filePath);
    return;
  }

  const input = fs.readFileSync(filePath);
  const isJpeg = input[0] === 0xff && input[1] === 0xd8;

  let width;
  let height;
  let rgba;

  if (isJpeg) {
    const decoded = jpeg.decode(input, { useTArray: true });
    width = decoded.width;
    height = decoded.height;
    rgba = decoded.data;
  } else {
    const png = PNG.sync.read(input);
    width = png.width;
    height = png.height;
    rgba = png.data;
  }

  const out = new PNG({ width, height });

  for (let i = 0; i < rgba.length; i += 4) {
    const r = rgba[i];
    const g = rgba[i + 1];
    const b = rgba[i + 2];
    const a = rgba[i + 3] ?? 255;

    out.data[i] = r;
    out.data[i + 1] = g;
    out.data[i + 2] = b;

    if (a < 10 || (r < 50 && g < 50 && b < 50)) {
      out.data[i + 3] = 0;
    } else {
      out.data[i + 3] = 255;
    }
  }

  let minX = width;
  let minY = height;
  let maxX = 0;
  let maxY = 0;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (width * y + x) << 2;
      if (out.data[idx + 3] > 0) {
        minX = Math.min(minX, x);
        minY = Math.min(minY, y);
        maxX = Math.max(maxX, x);
        maxY = Math.max(maxY, y);
      }
    }
  }

  const pad = 8;
  minX = Math.max(0, minX - pad);
  minY = Math.max(0, minY - pad);
  maxX = Math.min(width - 1, maxX + pad);
  maxY = Math.min(height - 1, maxY + pad);

  const cropW = maxX - minX + 1;
  const cropH = maxY - minY + 1;
  const cropped = new PNG({ width: cropW, height: cropH });

  for (let y = 0; y < cropH; y++) {
    for (let x = 0; x < cropW; x++) {
      const src = ((y + minY) * width + (x + minX)) << 2;
      const dst = (y * cropW + x) << 2;
      cropped.data[dst] = out.data[src];
      cropped.data[dst + 1] = out.data[src + 1];
      cropped.data[dst + 2] = out.data[src + 2];
      cropped.data[dst + 3] = out.data[src + 3];
    }
  }

  const buffer = PNG.sync.write(cropped);
  fs.writeFileSync(filePath, buffer);
  console.log("converted:", filePath, `${cropW}x${cropH}`);
}

for (const file of sources) {
  convertToTransparentPng(file);
}
