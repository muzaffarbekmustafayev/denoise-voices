import { readdir } from 'fs/promises';
import chalk from 'chalk';


const inputDir = 'uz/clips';
const outputDir = 'uz/clips_clean';

async function verify() {
    try {
        const inputFiles = await readdir(inputDir);
        const outputFiles = await readdir(outputDir);

        const inputMp3s = inputFiles.filter(f => f.toLowerCase().endsWith('.mp3'));
        const outputMp3s = outputFiles.filter(f => f.toLowerCase().endsWith('.mp3'));

        console.log(chalk.cyan('\n🔍 Audit Result'));
        console.log(chalk.gray('----------------'));
        console.log(`Input files:  ${chalk.white(inputMp3s.length)}`);
        console.log(`Output files: ${chalk.white(outputMp3s.length)}`);

        const missing = inputMp3s.filter(f => !outputMp3s.includes(f));

        if (missing.length === 0) {
            console.log(chalk.green('\n✅ All files have been successfully processed!'));
        } else {
            console.log(chalk.yellow(`\n⚠️ Missing ${missing.length} files:`));
            // Show only first 10 missing files
            missing.slice(0, 10).forEach(f => console.log(chalk.gray(` - ${f}`)));
            if (missing.length > 10) console.log(chalk.gray(` ... and ${missing.length - 10} more`));
            
            console.log(chalk.blue(`\nRun 'node denoise.js' to process them.`));
        }
        console.log('');
    } catch (err) {
        console.error(chalk.red('Error during verification:'), err.message);
    }
}

verify();
