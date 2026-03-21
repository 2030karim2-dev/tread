import sharp from 'sharp';
import fs from 'fs';

async function optimize() {
  await sharp('src/assets/logo.png')
    .resize({ width: 256, withoutEnlargement: true })
    .png({ compressionLevel: 9, quality: 70 })
    .toFile('src/assets/logo_opt.png');
  
  fs.unlinkSync('src/assets/logo.png');
  fs.renameSync('src/assets/logo_opt.png', 'src/assets/logo.png');
  console.log('Logo optimized.');
}

optimize().catch(console.error);
