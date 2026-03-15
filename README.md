# Audio Denoiser

A Node.js tool for denoising MP3 audio files with parallel processing and progress tracking.

## Requirements

- Node.js 18+
- FFmpeg

## Installation

```bash
npm install
```

## Usage

```bash
# Place your files in uz/clips/, then run:
node denoise.js

# Force reprocess already cleaned files:
node denoise.js --force

# Verify results:
node verify.js
```

Cleaned files are saved to `uz/clips_clean/`.

## Filters

| Filter | Purpose |
|--------|---------|
| Highpass 200Hz | Removes low-frequency rumble |
| Lowpass 7000Hz | Removes high-frequency hiss |
| FFT Denoise 85% | Spectral noise reduction |
| Adaptive NLM | Complex background noise |
| Noise Gate | Silence background hiss |
| Loudness Norm | Normalizes audio loudness |

## Project Structure

```
denoise-voices/
├── denoise.js        # Main script
├── verify.js         # Result verification
├── uz/
│   ├── clips/        # Input files (.mp3)        ← gitignore
│   └── clips_clean/  # Cleaned output files      ← gitignore
└── package.json
```

## License

MIT
