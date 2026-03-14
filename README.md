# Audio Denoiser

MP3 audio fayllarni shovqindan tozalash uchun Node.js dasturi. Parallel qayta ishlash va progress tracking qo'llab-quvvatlanadi.

## Talablar

- Node.js 18+
- FFmpeg

## O'rnatish

```bash
npm install
```

## Ishlatish

```bash
# Fayllarni uz/clips/ ga joylashtiring, so'ng:
node denoise.js

# Oldin qayta ishlangan fayllarni ham qayta tozalash:
node denoise.js --force

# Natijalarni tekshirish:
node verify.js
```

Tozalangan fayllar `uz/clips_clean/` papkasida saqlanadi.

## Filtrlar

| Filtr | Vazifasi |
|-------|----------|
| Highpass 200Hz | Past chastotali gumburlash |
| Lowpass 7000Hz | Yuqori chastotali shivirlash |
| FFT Denoise 85% | Spektral shovqin |
| Adaptive NLM | Murakkab fon shovqini |
| Noise Gate | Jimlikdagi fon shivirlashi |
| Loudness Norm | Ovoz balandligini standartlashtirish |

## Struktura

```
denoise-voices/
├── denoise.js        # Asosiy dastur
├── verify.js         # Natijalarni tekshirish
├── uz/
│   ├── clips/        # Kiruvchi fayllar (.mp3)   ← gitignore
│   └── clips_clean/  # Tozalangan fayllar        ← gitignore
└── package.json
```

## Litsenziya

MIT
