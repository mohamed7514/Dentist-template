import sharp from 'sharp';
import { access, copyFile, mkdir, writeFile } from 'node:fs/promises';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { once } from 'node:events';

const source = new URL('../assets/source/invisalign-hero/', import.meta.url);
const output = new URL('../public/assets/invisalign-hero/', import.meta.url);
await mkdir(source, { recursive: true });
await mkdir(output, { recursive: true });
const imported = 'C:/Users/MSI/.codex/generated_images/01a175b3-c41e-7d73-be1f-5329c5e1f30e/';
const originals = {
  aligned: 'exec-ca734d5f-1f19-4dcf-af5f-d8627d17aee4.png',
  before: 'exec-ac7fad27-2e31-4665-8677-ab669726877d.png',
  tray: 'exec-be8472a9-2f40-4b67-b694-2eb33dc7dd6a.png',
};
const local = name => fileURLToPath(new URL(encodeURIComponent(name), source));
const background = { create: { width: 1080, height: 1080, channels: 4, background: '#262725' } };
for (const [name, filename] of Object.entries(originals)) {
  const target = new URL(`${name}-original.png`, source);
  try { await access(target); } catch { await copyFile(imported + filename, target); }
}
for (const name of ['before', 'aligned']) {
  const model = await sharp(local(`${name}-original.png`)).resize({ width: 1080 }).png().toBuffer();
  await sharp(background).composite([{ input: model, left: 0, top: 300 }]).png().toFile(local(`${name}.png`));
}
// Match the tray's gingival edge to the tooth/gum boundary of the same model.
const { data: trayPixels, info: trayInfo } = await sharp(local('tray-original.png')).resize(1080, 553, { fit: 'fill' }).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
// Let the membrane transmit the model while keeping its specular rim visible.
for (let index = 0; index < trayPixels.length; index += 4) {
  const luminance = (trayPixels[index] * .2126 + trayPixels[index + 1] * .7152 + trayPixels[index + 2] * .0722) / 255;
  const filmAlpha = .025 + .9 * Math.pow(luminance, 5);
  trayPixels[index + 3] = Math.round(trayPixels[index + 3] * filmAlpha);
}
await sharp(trayPixels, { raw: trayInfo }).png().toFile(local('tray.png'));
await sharp(local('aligned.png')).composite([{ input: local('tray.png'), left: 0, top: 307 }]).webp({ quality: 94 }).toFile(fileURLToPath(new URL('poster.webp', output)));
await sharp(local('aligned.png')).composite([{ input: local('tray.png'), left: 0, top: 307 }]).png().toFile(local('seated-preview.png'));
for (const [index, name] of ['before', 'before', 'aligned', 'aligned'].entries()) await copyFile(local(`${name}.png`), local(`key-${index}.png`));
console.log('Prepared registered dental models, transparent tray and poster.');
if (process.argv.includes('--prepare-only')) process.exit(0);

async function encode(args) {
  const child = spawn(process.env.FFMPEG_PATH || 'ffmpeg', ['-hide_banner', '-loglevel', 'warning', '-y', ...args], { stdio: 'inherit', windowsHide: true });
  const [code] = await once(child, 'exit');
  if (code !== 0) throw new Error(`FFmpeg exited with ${code}`);
}
if (!process.argv.includes('--reuse-motion')) {
 console.log('Interpolating the gradual alignment at 60 fps.');
 await encode([
  '-filter_threads', '1', '-framerate', '1/4', '-i', local('key-%d.png'),
  '-vf', 'format=yuv420p,minterpolate=fps=60:mi_mode=mci:mc_mode=aobmc:me_mode=bilat:vsbmc=1:scd=none,trim=start=4:end=8,setpts=PTS-STARTPTS',
  '-an', '-c:v', 'libx264', '-preset', 'medium', '-crf', '18', '-pix_fmt', 'yuv420p', '-threads', '4', '-movflags', '+faststart', local('alignment-motion.mp4'),
 ]);
}
console.log('Encoding the continuous tray placement and alignment.');
const down = '77+230*(0.5-0.5*cos(PI*(t-1.2)/2.4))';
const up = '307-230*(0.5-0.5*cos(PI*(t-9.3)/1.9))';
const y = `if(lte(t,1.2),77,if(lt(t,3.6),${down},if(lt(t,9.3),307,if(lt(t,11.2),${up},77))))`;
const graph = [
  '[0:v]format=yuv420p,split[beforeHold][beforeReset]',
  '[beforeHold]trim=duration=4.2,setpts=PTS-STARTPTS[b]',
  '[1:v]format=yuv420p,trim=duration=4.6,setpts=PTS-STARTPTS[a]',
  '[2:v]fps=60,trim=duration=4,setpts=PTS-STARTPTS[m]',
  '[b][m][a]concat=n=3:v=1:a=0,fps=60,settb=AVTB[body]',
  '[beforeReset]trim=duration=0.6,setpts=PTS-STARTPTS,settb=AVTB[reset]',
  '[body][reset]xfade=transition=fade:duration=0.6:offset=12.2[loop]',
  '[3:v]format=rgba,fade=t=in:st=0.45:d=0.45:alpha=1,fade=t=out:st=10.8:d=0.6:alpha=1[tray]',
  `[loop][tray]overlay=x=0:y='${y}':eval=frame:shortest=1[video]`,
].join(';');
await encode([
  '-filter_complex_threads', '1',
  '-loop', '1', '-framerate', '60', '-i', local('before.png'),
  '-loop', '1', '-framerate', '60', '-i', local('aligned.png'),
  '-i', local('alignment-motion.mp4'),
  '-loop', '1', '-framerate', '60', '-i', local('tray.png'),
  '-filter_complex', graph, '-map', '[video]', '-t', '12.8', '-an', '-c:v', 'libx264', '-preset', 'slow', '-crf', '20', '-pix_fmt', 'yuv420p', '-r', '60', '-threads', '4', '-movflags', '+faststart', fileURLToPath(new URL('alignment.mp4', output)),
]);
await writeFile(new URL('render.json', source), JSON.stringify({ width: 1080, height: 1080, fps: 60, duration: 12.8, sourceType: 'generated 3D image layers', movement: 'motion-compensated interpolation and continuous tray translation' }, null, 2));
console.log('Rendered Invisalign hero: 1080 square, 12.8 seconds, 60 fps.');
