/**
 * Prepares site imagery from the originals archived off the legacy Webnode site.
 *
 * 1. Re-encodes every usable photograph into an optimised JPEG under
 *    public/images/projects.
 * 2. Builds the "before" halves used by the before/after slider. There are no
 *    genuine paired before/after photographs in the client archive, so these are
 *    generated from the finished photograph itself and the UI labels them, in
 *    both languages, as a representative demonstration rather than a real
 *    documented renovation.
 */
import { mkdir, readdir, writeFile } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const SRC = process.env.IMAGE_SOURCE_DIR ?? resolve(root, '../_source-images');
const OUT_PROJECTS = join(root, 'public/images/projects');
const OUT_DEMO = join(root, 'public/images/demo');

/** Photographs good enough (>= 900px wide) to carry the redesign. */
const KEEP = new Set([
  'villa-piscina-luxe', 'villa-luxe', 'casa-5', 'construction-luxe', 'interior-exterior',
  'luxe-casa-interio', 'interior-salon', 'luxury-salon', 'salon', 'interior-c',
  'interior-8', 'salon-interior', 'proyecto-1', 'interior-dormitorio-2',
  'cocina-luxe', 'bano-luxuri', 'sauna', 'sauna-1', 'sauna3', 'sauna-y-spa',
  'sala-audiovisual', 'piscina4', 'piscina-6', 'piscina-3', 'jardin-con-piscina',
  'casa-piscina', 'villa-piscina', 'piscinas-1-1', 'dormitorio02', 'dormitorio03',
  'proyecto-2', 'proyecto-3', 'interior4', 'vivienda-piscina2', 'villa-portada',
]);

/** Finished photographs that also get a simulated "before" counterpart. */
const DEMO_PAIRS = ['luxe-casa-interio', 'cocina-luxe', 'villa-piscina-luxe'];

const wash = await sharp({
  create: { width: 8, height: 8, channels: 4, background: { r: 138, g: 132, b: 120, alpha: 0.2 } },
}).png().toBuffer();

async function main() {
  await mkdir(OUT_PROJECTS, { recursive: true });
  await mkdir(OUT_DEMO, { recursive: true });

  const files = (await readdir(SRC)).filter((f) => /\.jpe?g$/i.test(f));
  const manifest = [];

  for (const file of files) {
    const slug = file.replace(/\.jpe?g$/i, '');
    if (!KEEP.has(slug)) continue;

    const input = join(SRC, file);
    const meta = await sharp(input).metadata();

    await sharp(input)
      .rotate()
      .jpeg({ quality: 84, mozjpeg: true, chromaSubsampling: '4:4:4' })
      .toFile(join(OUT_PROJECTS, `${slug}.jpg`));

    manifest.push({ slug, width: meta.width, height: meta.height });

    if (DEMO_PAIRS.includes(slug)) {
      // Flatten, desaturate and soften the finished photograph so the slider has
      // a legible "before" state with pixel-identical geometry.
      await sharp(input)
        .rotate()
        .modulate({ saturation: 0.24, brightness: 0.88 })
        .linear(0.84, 16)
        .blur(0.8)
        .composite([{ input: wash, tile: true, blend: 'over' }])
        .jpeg({ quality: 82, mozjpeg: true })
        .toFile(join(OUT_DEMO, `${slug}-before.jpg`));

      await sharp(input)
        .rotate()
        .jpeg({ quality: 86, mozjpeg: true, chromaSubsampling: '4:4:4' })
        .toFile(join(OUT_DEMO, `${slug}-after.jpg`));
    }
  }

  manifest.sort((a, b) => a.slug.localeCompare(b.slug));
  await writeFile(
    join(root, 'src/content/image-manifest.json'),
    `${JSON.stringify(manifest, null, 2)}\n`,
    'utf8',
  );
  console.log(`Processed ${manifest.length} photographs, ${DEMO_PAIRS.length} demo pairs.`);
}

await main();
