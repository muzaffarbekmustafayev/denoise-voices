import ffmpeg from 'fluent-ffmpeg';
import { readdir, mkdir } from 'fs/promises';
import { join, dirname } from 'path';
import { existsSync } from 'fs';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
if (existsSync(join(__dirname, 'ffmpeg.exe'))) {
    ffmpeg.setFfmpegPath(join(__dirname, 'ffmpeg.exe'));
}

const inputDir = 'uz/clips';
const outputDir = 'uz/clips_clean';

if (!existsSync(outputDir)) {
    await mkdir(outputDir, { recursive: true });
}

const files = await readdir(inputDir);
const mp3Files = files.filter(f => f.endsWith('.mp3'));

let processed = 0;
const total = mp3Files.length;

for (const file of mp3Files) {
    const inputPath = join(inputDir, file);
    const outputPath = join(outputDir, file);
    
    if (existsSync(outputPath)) {
        console.log(`Skipped: ${file}`);
        continue;
    }
    
    await new Promise((resolve, reject) => {
        ffmpeg(inputPath)
            .audioFilters([
                'afftdn=nf=-25',
                'afwtdn',
                'loudnorm=I=-16:TP=-1.5:LRA=11'
            ])
            .audioCodec('libmp3lame')
            .audioBitrate('192k')
            .on('end', () => {
                processed++;
                console.log(`[${processed}/${total}] Processed: ${file}`);
                resolve();
            })
            .on('error', reject)
            .save(outputPath);
    });
}

console.log(`\nDone! Processed ${processed} files.`);
