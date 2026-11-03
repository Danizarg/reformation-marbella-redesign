import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const base = join(root, 'public/images/projects/villa-piscina-luxe.jpg');

const W = 1200;
const H = 630;

const overlay = Buffer.from(`
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
  <defs>
    <linearGradient id="g" x1="0" y1="1" x2="0.35" y2="0">
      <stop offset="0%" stop-color="#14161a" stop-opacity="0.94"/>
      <stop offset="60%" stop-color="#14161a" stop-opacity="0.62"/>
      <stop offset="100%" stop-color="#14161a" stop-opacity="0.38"/>
    </linearGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#g)"/>
  <text x="72" y="300" font-family="Georgia, 'Times New Roman', serif" font-size="74" fill="#f8f5ef">Transformamos espacios.</text>
  <text x="72" y="382" font-family="Georgia, 'Times New Roman', serif" font-size="74" fill="#d8c9b0">Creamos nuevas historias.</text>
  <rect x="72" y="438" width="64" height="2" fill="#d8c9b0"/>
  <text x="72" y="492" font-family="Helvetica, Arial, sans-serif" font-size="23" letter-spacing="5" fill="#f8f5ef" opacity="0.88">REFORMATION MARBELLA</text>
  <text x="72" y="532" font-family="Helvetica, Arial, sans-serif" font-size="19" letter-spacing="2" fill="#d8c9b0" opacity="0.8">Construccion y reforma &#183; Costa del Sol</text>
</svg>`);

await sharp(base)
  .resize(W, H, { fit: 'cover', position: 'centre' })
  .composite([{ input: overlay, top: 0, left: 0 }])
  .jpeg({ quality: 86, mozjpeg: true })
  .toFile(join(root, 'public/opengraph-image.jpg'));

console.log('opengraph-image.jpg written');
