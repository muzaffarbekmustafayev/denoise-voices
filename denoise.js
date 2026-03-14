import ffmpeg from 'fluent-ffmpeg';
import { readdir, mkdir } from 'fs/promises';
import { join, dirname } from 'path';
import { existsSync } from 'fs';
import { fileURLToPath } from 'url';
import os from 'os';
import pLimit from 'p-limit';
import cliProgress from 'cli-progress';
import chalk from 'chalk';

const __dirname = dirname(fileURLToPath(import.meta.url));

// FFmpeg setup
if (existsSync(join(__dirname, 'ffmpeg.exe'))) {
    ffmpeg.setFfmpegPath(join(__dirname, 'ffmpeg.exe'));
} else if (existsSync(join(__dirname, 'ffmpeg'))) {
    ffmpeg.setFfmpegPath(join(__dirname, 'ffmpeg'));
}

const inputDir = 'uz/clips';
const outputDir = 'uz/clips_clean';

// Configuration
const FORCE_REPROCESS = process.argv.includes('--force');
const CONCURRENCY = Math.max(1, os.cpus().length - 1);
const limit = pLimit(CONCURRENCY);

async function denoiseFile(file, bar) {
    const inputPath = join(inputDir, file);
    const outputPath = join(outputDir, file);

    if (existsSync(outputPath) && !FORCE_REPROCESS) {
        bar.increment(1, { status: chalk.yellow('Skipped') });
        return { file, status: 'skipped' };
    }


    return new Promise((resolve) => {
        ffmpeg(inputPath)
            .audioFilters([
                'highpass=f=200', // Past chastotali shovqinlarni (gumbirash) kesish
                'lowpass=f=7000',  // Yuqori chastotali shivirlashlarni kesish
                'afftdn=nf=-30:nr=85:nt=w', // FFT Denoise (Kuchaytirilgan: 85%)
                'anlmdn=s=15:p=0.01:r=0.1',   // Adaptiv Non-Local Means filtri
                'agate=threshold=-35dB:ratio=2:attack=5:release=50', // Noise gate (Jimlikdagi shovqinni kesish)
                'loudnorm=I=-16:TP=-1.5:LRA=11' // Ovoz darajasini standartlashtirish
            ])
            .audioCodec('libmp3lame')

            .audioBitrate('192k')
            .on('end', () => {
                bar.increment(1, { status: chalk.green('Success') });
                resolve({ file, status: 'success' });
            })
            .on('error', (err) => {
                bar.increment(1, { status: chalk.red('Error') });
                resolve({ file, status: 'error', error: err.message });
            })
            .save(outputPath);
    });
}

async function main() {
    console.log(chalk.cyan('\n🎙️  Audio Denoiser v2.0'));
    console.log(chalk.gray('-----------------------'));

    if (!existsSync(inputDir)) {
        console.error(chalk.red(`Error: Input directory "${inputDir}" not found.`));
        return;
    }

    if (!existsSync(outputDir)) {
        await mkdir(outputDir, { recursive: true });
    }

    const files = await readdir(inputDir);
    const mp3Files = files.filter(f => f.toLowerCase().endsWith('.mp3'));
    
    if (mp3Files.length === 0) {
        console.log(chalk.yellow('No MP3 files found to process.'));
        return;
    }

    console.log(chalk.blue(`Found ${mp3Files.length} files. Processing with ${CONCURRENCY} workers...\n`));

    const multibar = new cliProgress.MultiBar({
        clearOnComplete: false,
        hideCursor: true,
        format: ' {bar} | {percentage}% | {value}/{total} | {file} | {status}',
    }, cliProgress.Presets.shades_grey);

    const b1 = multibar.create(mp3Files.length, 0);

    const tasks = mp3Files.map(file => {
        return limit(() => denoiseFile(file, b1).then(res => {
            b1.update(null, { file: file.substring(0, 20).padEnd(20), status: '' });
            return res;
        }));
    });

    const results = await Promise.all(tasks);
    multibar.stop();

    const success = results.filter(r => r.status === 'success').length;
    const skipped = results.filter(r => r.status === 'skipped').length;
    const errors = results.filter(r => r.status === 'error');

    console.log(chalk.cyan('\nProcessing Complete!'));
    console.log(chalk.green(`✅ Successfully processed: ${success}`));
    console.log(chalk.yellow(`⏭️  Skipped (already exists): ${skipped}`));
    
    if (errors.length > 0) {
        console.log(chalk.red(`❌ Failed: ${errors.length}`));
        // Optionally log errors to a file
    }
    console.log('');
}

main().catch(err => {
    console.error(chalk.red('\nFatal Error:'), err);
    process.exit(1);
});

