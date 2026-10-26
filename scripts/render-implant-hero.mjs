import sharp from 'sharp';
import { access, copyFile, mkdir, writeFile } from 'node:fs/promises';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { once } from 'node:events';

const source = new URL('../assets/source/implant-hero/', import.meta.url);
const output = new URL('../public/assets/implant-hero/', import.meta.url);
await mkdir(source, { recursive: true });
await mkdir(output, { recursive: true });
const generated = 'C:/Users/MSI/.codex/generated_images/01a175b3-c41e-7d73-be1f-5329c5e1f30e/';
const parts = [
  { name: 'jaw', original: 'exec-af8ce3b8-59d4-41cf-a5b8-1bfd7f7df865.png', crop: { left: 126, top: 93, width: 1189, height: 908 }, width: 950, x: 65, y: 235 },
  { name: 'implant', original: 'exec-ad022e54-e96d-477c-950b-6c69b4e81329.png', crop: { left: 317, top: 146, width: 395, height: 1275 }, width: 110, x: 493, y: 464, fromY: 34, start: .65, end: 3.8, appear: .35 },
  { name: 'abutment', original: 'exec-da8b9921-12df-498d-8e50-462d9ac68b00.png', crop: { left: 447, top: 103, width: 546, height: 873 }, width: 88, x: 504, y: 377, fromY: 175, start: 4.2, end: 6.1, appear: 4 },
  { name: 'crown', original: 'exec-e79c4534-acb7-4e60-8c97-e0356b37bb6a.png', crop: { left: 254, top: 130, width: 950, height: 825 }, width: 270, x: 413, y: 250, fromY: 40, start: 6.6, end: 8.8, appear: 6.4 },
];
for (const part of parts) {
  const retained = new URL(`${part.name}-original.png`, source);
  try { await access(retained); } catch { await copyFile(generated + part.original, retained); }
  const info = await sharp(fileURLToPath(retained)).extract(part.crop).resize({ width: part.width }).png().toFile(fileURLToPath(new URL(`${part.name}.png`, source)));
  part.height = info.height;
}
const fixture = parts[1];
// Keep the front lip and wall in front of the connector as it enters the socket.
// The curved opening leaves the rear rim behind the moving abutment.
const frontMask = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${fixture.width}" height="${fixture.height}"><path d="M0 8Q55 38 110 8V${fixture.height}H0Z" fill="white"/></svg>`);
const frontFile = fileURLToPath(new URL('implant-front.png', source));
await sharp(fileURLToPath(new URL('implant.png', source))).composite([{ input: frontMask, blend: 'dest-in' }]).png().toFile(frontFile);
const composites = parts.slice(0, 3).map(part => ({ input: fileURLToPath(new URL(`${part.name}.png`, source)), left: part.x, top: part.y }));
composites.push({ input: frontFile, left: fixture.x, top: fixture.y });
composites.push({ input: fileURLToPath(new URL('crown.png', source)), left: parts[3].x, top: parts[3].y });
await sharp({ create: { width: 1080, height: 1080, channels: 4, background: '#262725' } }).composite(composites).webp({ quality: 94 }).toFile(fileURLToPath(new URL('poster-v2.webp', output)));
await sharp({ create: { width: 1080, height: 1080, channels: 4, background: '#262725' } }).composite(composites).png().toFile(fileURLToPath(new URL('assembled-preview.png', source)));
await writeFile(new URL('layout.json', source), JSON.stringify({ canvas: 1080, fps: 60, duration: 12.8, parts }, null, 2));
console.log('Prepared animation layers and the assembled poster.');
if (process.argv.includes('--prepare-only')) process.exit(0);

const executable = process.env.FFMPEG_PATH || 'ffmpeg';
const args = ['-hide_banner', '-loglevel', 'warning', '-y', '-filter_complex_threads', '1', '-f', 'lavfi', '-i', 'color=c=0x262725:s=1080x1080:r=60:d=12.8'];
for (const part of parts) args.push('-loop', '1', '-framerate', '60', '-i', fileURLToPath(new URL(`${part.name}.png`, source)));
args.push('-loop', '1', '-framerate', '60', '-i', frontFile);
const filters = ['[0:v][1:v]overlay=x=65:y=235:shortest=1[base]'];
let previous = 'base';
for (let index = 1; index < parts.length; index++) {
  const part = parts[index];
  const input = index + 1;
  const duration = part.end - part.start;
  const easedY = `if(lte(t,${part.start}),${part.fromY},if(gte(t,${part.end}),${part.y},${part.fromY}+${part.y - part.fromY}*(0.5-0.5*cos(PI*(t-${part.start})/${duration}))))`;
  filters.push(`[${input}:v]format=rgba,fade=t=in:st=${part.appear}:d=0.3:alpha=1,fade=t=out:st=11.7:d=0.8:alpha=1[${part.name}]`);
  const next = `scene${index}`;
  filters.push(`[${previous}][${part.name}]overlay=x=${part.x}:y='${easedY}':eval=frame:shortest=1[${next}]`);
  previous = next;
  if (part.name === 'abutment') {
    filters.push('[5:v]format=rgba,fade=t=out:st=11.7:d=0.8:alpha=1[implantFront]');
    filters.push(`[${previous}][implantFront]overlay=x=${fixture.x}:y=${fixture.y}:enable='gte(t,${part.appear})':shortest=1[seated]`);
    previous = 'seated';
  }
}
args.push('-filter_complex', filters.join(';'), '-map', `[${previous}]`, '-t', '12.8', '-an', '-c:v', 'libx264', '-preset', 'slow', '-crf', '20', '-pix_fmt', 'yuv420p', '-r', '60', '-threads', '4', '-movflags', '+faststart', fileURLToPath(new URL('assembly-v2.mp4', output)));
const encoder = spawn(executable, args, { stdio: 'inherit', windowsHide: true });
encoder.on('error', error => { console.error(error.message); process.exitCode = 1; });
const [code] = await once(encoder, 'exit');
if (code !== 0) process.exit(code || 1);
console.log('Rendered 12.8 seconds of continuous assembly at 60 fps.');
