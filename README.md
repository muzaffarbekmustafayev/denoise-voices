# Audio Denoiser v2.0

Audio fayllarni shovqindan tozalash uchun kuchaytirilgan Node.js dasturi. Parallel qayta ishlash va progress tracking imkoniyatlariga ega.

## Yangiliklar (v2.0)

- **Parallel Processing** - Bir vaqtning o'zida bir nechta faylni qayta ishlash (CPU yadrolari soniga qarab).
- **Progress Tracking** - Chiroyli progress bar va real-vaqtda holat.
- **Smart Skip** - Oldin qayta ishlangan fayllarni avtomatik o'tkazib yuborish.
- **Improved Logging** - Chalk kutubxonasi yordamida rangli va aniq xabarlar.

## Talablar

- Node.js 18 yoki undan yuqori
- FFmpeg (tizimda o'rnatilgan bo'lishi tavsiya etiladi)

## O'rnatish

```bash
npm install
```

## Ishlatish

1. Audio fayllarni `uz/clips` papkasiga joylashtiring.
2. Dasturni ishga tushiring:

```bash
node denoise.js
```

**Barcha fayllarni qaytadan tozalash (overwrite):**
```bash
node denoise.js --force
```

3. Tozalangan fayllar `uz/clips_clean` papkasida paydo bo'ladi.

## Qo'llaniladigan filtrlar (Kuchaytirilgan)

- **Highpass (200Hz)** - Past chastotali gumburlashlarni kesish.
- **Lowpass (7000Hz)** - Yuqori chastotali shivirlashlarni kesish.
- **FFT Denoise (85%)** - Spektral shovqinni agressiv kamaytirish.
- **Adaptive NLM** - Murakkab fon shovqinlarini tozalash.
- **Noise Gate** - Ovoz yo'q vaqtlardagi jimlikni (background hiss) butunlay tozalash.
- **Loudness Normalization** - Ovoz balandligini standartlashtirish.


## Loyiha strukturasi

```
denoise-voices/
├── denoise.js          # Asosiy dastur (Parallel processing)
├── uz/
│   ├── clips/          # Kiruvchi audio fayllar (.mp3)
│   └── clips_clean/    # Tozalangan audio fayllar
├── node_modules/
├── package.json
└── README.md
```

## Litsenziya

MIT

