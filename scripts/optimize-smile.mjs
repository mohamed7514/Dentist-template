import sharp from 'sharp';
import {stat} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
for(const name of ['smile-before','smile-final']){
 const source=new URL('../public/assets/'+name+'.png',import.meta.url);
 const target=new URL('../public/assets/'+name+'.webp',import.meta.url);
 await sharp(fileURLToPath(source)).webp({quality:90,effort:6}).toFile(fileURLToPath(target));
 console.log(name+': '+Math.round((await stat(source)).size/1024)+' KB → '+Math.round((await stat(target)).size/1024)+' KB');
}
