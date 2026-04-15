# multik-kod-bot

Bot — grammy (typeScript) va drizzle, hono texnologiyalari asosida yaratilgan telegram bot.
Botning asosiy vazifasi foydalanuvchilarga maxsus kodlar orqali (kino yoki) multfilmlarni topish va jo'natishdir.

Shuningdek, bot foydalanuvchilar statistikasini yuritadi va yangi qo'shilganlar haqida adminga xabar beradi.

> Botdan o'z botingiz sifatida foydalanish uchun, o'z ma'lumotlar omboringiz (database), o'z botingiz va o'z kino yoki multfilm yig'ilgan kanalingiz kerak!

---

## 🚀 Imkoniyatlari

-   **Kod orqali qidiruv**  
    Foydalanuvchi `M...` formatidagi kodni yuboradi (masalan, `M123`) va bot bazadan mos keluvchi multfilmni topib beradi.

-   **Deep Linking**  
    `t.me/uz_multfilm_bot?start=mcode...` havolasi orqali kirilganda to‘g‘ridan-to‘g‘ri multfilm taqdim etiladi.

-   **Foydalanuvchilar bazasi**  
    Har bir foydalanuvchi ma’lumotlari (ID, username, ism) postgreSQL bazasida saqlanadi.

-   **Admin xabarnomasi**  
    Yangi foydalanuvchi kirganda, adminga ma’lumot yuboriladi.

-   **UTM Tracking**  
    Foydalanuvchi qaysi manbadan kelganligini kuzatish imkoniyati.

---

## 🛠 Texnologiyalar

-   **Runtime:** Bun (yoki Node)
-   **Framework:** grammY (Telegram Bot API)
-   **Database:** Drizzle (PostgreSQL)
-   **Language:** TypeScript

---

## ⚙️ O‘rnatish va Ishlatish (Local Development)

### 1. Loyihani yuklab olish

```bash
git clone https://github.com/jarkurghan/multik-kod-bot.git
cd multik-kod-bot
```

### 2. Kutubxonalarni o‘rnatish

```bash
bun install
```

### 3. Environment Variables sozlang

Loyiha papkasida `.env` fayl yarating va kerakli variable'larni kiriting
(`src/constants.ts` bilan mos bo‘lishi kerak):

### 4. Botni ishga tushirish

```bash
bun dev
```

---

## 🤝 Hissa Qo‘shish

1. Reponi **Fork** qiling
2. Yangi branch yarating
    ```bash
    git checkout -b feature/yangi-branch-nomi
    ```
3. O‘zgarishlarni commit qiling
    ```bash
    git commit -m "Yangi imkoniyat haqida batafsil"
    ```
4. Branchni push qiling va Pull Request yuboring

---

## Litsenziya

MIT License — istalgan o'zgartirish va foydalanish uchun ochiq.

**Muallif:** [@jarkurghan](https://t.me/najmiddin_nazirov)
