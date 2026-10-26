import sharp from 'sharp';
import { copyFile, mkdir, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const original = process.argv[2];
if (!original) throw new Error('Pass the absolute generated contact-sheet path.');
const sourceDirectory = new URL('../assets/source/', import.meta.url);
const destination = new URL('../public/assets/implants/', import.meta.url);
await mkdir(sourceDirectory, { recursive: true });
await mkdir(destination, { recursive: true });
const retainedSource = new URL('implant-sequence-3d.png', sourceDirectory);
await copyFile(original, retainedSource);
const { width, height } = await sharp(fileURLToPath(retainedSource)).metadata();
const frames = [];
for (let index = 0; index < 16; index++) {
  const column = index % 4, row = Math.floor(index / 4);
  const left = Math.round(column * width / 4), top = Math.round(row * height / 4);
  const frameWidth = Math.round((column + 1) * width / 4) - left;
  const frameHeight = Math.round((row + 1) * height / 4) - top;
  const name = `frame-${String(index + 1).padStart(2, '0')}.webp`;
  const info = await sharp(fileURLToPath(retainedSource)).extract({ left, top, width: frameWidth, height: frameHeight }).resize(628, 628).webp({ quality: 94, effort: 6 }).toFile(fileURLToPath(new URL(name, destination)));
  frames.push({ name, width: info.width, height: info.height, bytes: info.size });
}
await writeFile(new URL('frames.json', destination), JSON.stringify(frames, null, 2));
console.log(`Prepared ${frames.length} frames, ${Math.round(frames.reduce((sum, frame) => sum + frame.bytes, 0) / 1024)} KB total.`);
