# معرفی و تحلیل محله دوچنار بجنورد

[![License](https://img.shields.io/badge/license-Educational-blue.svg)](./LICENSE)  
[![React](https://img.shields.io/badge/React-18.x-blue?logo=react)](https://reactjs.org/) [![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.x-38bdf8?logo=tailwindcss)](https://tailwindcss.com/) [![Leaflet](https://img.shields.io/badge/Leaflet-1.x-199900?logo=leaflet)](https://leafletjs.com/) [![Recharts](https://img.shields.io/badge/Recharts-2.x-ff7300?logo=recharts)](https://recharts.org/)

---

این پروژه یک وب‌اپلیکیشن تحلیلی و معرفی برای محله دوچنار بجنورد است که با استفاده از React، TailwindCSS، Leaflet و Recharts توسعه یافته است. هدف این پروژه ارائه اطلاعات جامع، نمودارهای تعاملی و نقشه‌های تحلیلی درباره وضعیت کالبدی، عملکردی، کیفیت زندگی و فرصت‌های سرمایه‌گذاری در این محله می‌باشد.

## ✨ ویژگی‌ها

- 🏘️ **معرفی محله**: نمایش اطلاعات پایه (نام، کد، جمعیت، مساحت و امتیاز) به صورت کارت‌های زیبا.
- 📊 **تحلیل کالبدی و عملکردی**: ارائه تحلیل‌های متنی و نمودارهای آماری از داده‌های اکسل و GeoJSON.
- 🗺️ **نقشه تعاملی**: نمایش نقشه Leaflet با لایه‌های مختلف (قدمت، طبقات، نما) و امکان انتخاب نوع نقشه و BaseMap.
- 📈 **نمودارهای تعاملی**: نمایش نمودارهای میله‌ای، دایره‌ای و خطی با قابلیت انتخاب نوع نمودار و داده (طبقات، قدمت، نما، کیفیت زندگی و ...).
- 💡 **فرصت‌های سرمایه‌گذاری**: نمایش اولویت‌های سرمایه‌گذاری با طراحی مدرن و رنگ‌بندی جذاب.
- 🇮🇷 **سازگاری کامل با زبان فارسی و راست‌چین**
- 📱 **ریسپانسیو و مناسب موبایل و دسکتاپ**

## 📁 ساختار پوشه‌ها

```tree
├── public/
│   ├── data/           # فایل‌های داده اکسل و GeoJSON
│   └── images/         # تصاویر و لوگو
├── src/
│   ├── components/
│   │   ├── charts/     # کامپوننت‌های نموداری (Recharts)
│   │   ├── UI/         # اجزای رابط کاربری (دکمه و ...)
│   │   └── ...         # سایر کامپوننت‌ها (تحلیل، معرفی و ...)
│   ├── config/         # فایل‌های پیکربندی (details.json)
│   ├── assets/         # فونت‌ها و سایر منابع
│   └── styles/         # فایل‌های CSS و فونت
├── index.html
└── ...
```

## 🚀 راه‌اندازی پروژه

```bash
# 1. کلون کردن مخزن
git clone https://github.com/MRGando/mahallat.git
cd mahallat

# 2. نصب وابستگی‌ها
npm install

# 3. اجرای پروژه
npm run dev
```

پروژه در آدرس [http://localhost:5173](http://localhost:5173) اجرا خواهد شد.

## 🗂️ داده‌ها

- داده‌های اکسل و GeoJSON در پوشه `public/data/` قرار دارند و به صورت داینامیک توسط کامپوننت‌ها بارگذاری می‌شوند.
- اطلاعات پایه محله در `src/config/details.json` ذخیره شده است.

## 🛠️ تکنولوژی‌های استفاده شده

- ![React](https://img.shields.io/badge/-React-61DAFB?logo=react&logoColor=white) **React**: ساخت رابط کاربری و مدیریت وضعیت
- ![TailwindCSS](https://img.shields.io/badge/-TailwindCSS-38BDF8?logo=tailwindcss&logoColor=white) **TailwindCSS**: استایل‌دهی سریع و ریسپانسیو
- ![Recharts](https://img.shields.io/badge/-Recharts-FF7300?logo=recharts&logoColor=white) **Recharts**: رسم نمودارهای آماری
- ![Leaflet](https://img.shields.io/badge/-Leaflet-199900?logo=leaflet&logoColor=white) **Leaflet**: نمایش نقشه و لایه‌های تحلیلی
- ![XLSX.js](https://img.shields.io/badge/-XLSX.js-217346?logo=microsoft-excel&logoColor=white) **XLSX.js**: خواندن داده‌های اکسل در مرورگر

## 🤝 توسعه و مشارکت

- برای افزودن داده یا نمودار جدید، کافی است فایل داده را در `public/data/` قرار دهید و یک کامپوننت جدید در `src/components/charts/` بسازید.
- برای تغییر اطلاعات پایه، فایل `src/config/details.json` را ویرایش کنید.
- برای افزودن فونت یا تصویر جدید، آن را در `src/assets/` یا `public/images/` قرار دهید.

## ⚠️ نکات مهم

- برای نمایش صحیح فونت سفارشی، فونت‌های Modam باید در مسیر `src/assets/font/modam/` قرار داشته باشند و در `src/styles/fonts.css` تعریف شوند.
- برای نمایش صحیح نقشه و داده‌ها، فایل‌های اکسل و GeoJSON باید ساختار مناسب داشته باشند.

## 📄 لایسنس

این پروژه صرفاً جهت اهداف آموزشی و پژوهشی توسعه یافته است و استفاده تجاری از آن بدون هماهنگی مجاز نیست.

---

**توسعه‌دهنده:** [Hominex](https://github.com/MRGando)

برای هرگونه سوال یا همکاری، لطفاً از طریق گیت‌هاب یا ایمیل تماس بگیرید.

---

> **نکته:**
>
> - برای ساخت نهایی پروژه:
>   ```bash
>   npm run build
>   ```
> - مطمئن شوید فایل‌های js و css در پوشه Dist با `./assets` شروع شوند.

---

## 📝 TODO

- 🎨 تغییر تم و تصاویر
- 📱 رفع مشکل ریسپانسیو کامپوننت اولویت‌ها
- ➕ افزودن (KARBARI.xlsx & Keyfiat_mabar.xlsx)
- 🖼️ حالت کاروسل برای تصاویر ماهواره‌ای
- ...
