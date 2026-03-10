# Audio Denoiser

Audio fayllarni shovqindan tozalash uchun Node.js dasturi. FFmpeg asosida ishlab, ovozli yozuvlardan turli xil shovqinlarni olib tashlaydi.

## Xususiyatlar

- Avtomatik batch processing - bir nechta faylni bir vaqtda qayta ishlash
- Kuchli shovqin filtrlari kombinatsiyasi
- Ovoz sifatini yaxshilash
- Progress tracking - jarayon haqida ma'lumot

## Talablar

- Node.js 18 yoki undan yuqori
- FFmpeg (loyihada mavjud)

## O'rnatish

```bash
npm install
```

## Ishlatish

1. Audio fayllarni `uz/clips` papkasiga joylashtiring
2. Dasturni ishga tushiring:

```bash
node denoise.js
```

3. Tozalangan fayllar `uz/clips_clean` papkasida paydo bo'ladi

## Qo'llaniladigan filtrlar

- **Highpass filter (200Hz)** - past chastotali shovqin va gumbirash
- **Lowpass filter (3000Hz)** - yuqori chastotali shovqin va shivirlash
- **FFT Denoise** - spektral shovqin kamaytirish
- **Adaptive NLM Denoise** - adaptiv shovqin filtri
- **Volume normalization** - ovoz balandligini optimallashtirish

## Loyiha strukturasi

```
denoise/
├── denoise.js          # Asosiy dastur
├── ffmpeg.exe          # FFmpeg binary
├── uz/
│   ├── clips/          # Kiruvchi audio fayllar
│   └── clips_clean/    # Tozalangan audio fayllar
└── package.json
```

## Litsenziya

MIT
