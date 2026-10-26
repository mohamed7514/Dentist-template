import sharp from 'sharp';
import { access, copyFile, mkdir, writeFile } from 'node:fs/promises';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { once } from 'node:events';

const source = new URL('../assets/source/bridge-hero/', import.meta.url);
const output = new URL('../public/assets/bridge-hero/', import.meta.url);
await mkdir(source, { recursive: true });
await mkdir(output, { recursive: true });
const generated = 'C:/Users/MSI/.codex/generated_images/01a175b3-c41e-7d73-be1f-5329c5e1f30e/';
const originals = { jaw: 'exec-029da28d-8b22-4f11-bcfa-ec2e33d8c7ad.png', 'bridge-v3': 'exec-2a5df860-8cc6-44d0-8e5f-6e439035f118.png' };
const local = name => fileURLToPath(new URL(name, source));
for (const [name, filename] of Object.entries(originals)) {
  const retained = new URL(`${name}-original.png`, source);
  try { await access(retained); } catch { await copyFile(generated + filename, retained); }
}
// Both models share the camera. The connected retainers are registered to the
// two natural abutment axes, then translated as one rigid restoration.
const scale = 960 / 1774;
const bridgeScale = .613;
const jaw = { left: 60, top: 350, width: 960 };
const bridge = { left: Math.round(60 + 340 * scale), top: Math.round(350 + 67 * scale), width: Math.round(1774 * scale * bridgeScale) };
await sharp(local('jaw-original.png')).resize({ width: jaw.width }).png().toFile(local('jaw.png'));
await sharp(local('bridge-v3-original.png')).resize({ width: bridge.width }).png().toFile(local('bridge-v3.png'));
const composites = [{ input: local('jaw.png'), left: jaw.left, top: jaw.top }, { input: local('bridge-v3.png'), left: bridge.left, top: bridge.top }];
const background = { create: { width: 1080, height: 1080, channels: 4, background: '#262725' } };
await sharp(background).composite(composites).webp({ quality: 94 }).toFile(fileURLToPath(new URL('poster-v3.webp', output)));
await sharp(background).composite(composites).png().toFile(local('seated-preview-v3.png'));
await writeFile(new URL('layout-v3.json', source), JSON.stringify({ width: 1080, height: 1080, fps: 60, duration: 12, jaw, bridge, hoverOffset: -210, placement: { start: 1.4, end: 5.6 } }, null, 2));
console.log('Prepared the natural abutments and registered three-unit bridge.');
if (process.argv.includes('--prepare-only')) process.exit(0);

const startY = bridge.top - 210;
const y = `if(lte(t,1.4),${startY},if(gte(t,5.6),${bridge.top},${startY}+210*(0.5-0.5*cos(PI*(t-1.4)/4.2))))`;
const graph = [
  `[0:v][1:v]overlay=x=${jaw.left}:y=${jaw.top}:shortest=1[base]`,
  '[2:v]format=rgba,fade=t=in:st=0.2:d=0.4:alpha=1,fade=t=out:st=11:d=0.8:alpha=1[bridge]',
  `[base][bridge]overlay=x=${bridge.left}:y='${y}':eval=frame:shortest=1[video]`,
].join(';');
const args = ['-hide_banner', '-loglevel', 'warning', '-y', '-filter_complex_threads', '1', '-f', 'lavfi', '-i', 'color=c=0x262725:s=1080x1080:r=60:d=12', '-loop', '1', '-framerate', '60', '-i', local('jaw.png'), '-loop', '1', '-framerate', '60', '-i', local('bridge-v3.png'), '-filter_complex', graph, '-map', '[video]', '-t', '12', '-an', '-c:v', 'libx264', '-preset', 'slow', '-crf', '20', '-pix_fmt', 'yuv420p', '-r', '60', '-threads', '4', '-movflags', '+faststart', fileURLToPath(new URL('placement-v3.mp4', output))];
const encoder = spawn(process.env.FFMPEG_PATH || 'ffmpeg', args, { stdio: 'inherit', windowsHide: true });
const [code] = await once(encoder, 'exit');
if (code !== 0) throw new Error(`FFmpeg exited with ${code}`);
console.log('Rendered a 12-second tooth-supported bridge placement at 60 fps.');
