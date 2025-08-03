
# Bookly

<!-- Language Tabs -->
<div align="center">
  
**Select Language / اختر اللغة**

[![English](https://img.shields.io/badge/English-6366f1?style=for-the-badge)](#english-tab) [![Arabic](https://img.shields.io/badge/Arabic-a855f7?style=for-the-badge)](#arabic-tab)

</div>

---

## English Tab

<details open>
<summary><strong>📖 English Documentation</strong></summary>

![Bookly Logo](./client/src/assets/logofull-dark.svg)

---

> [!WARNING]
> **Work in Progress**: This project is currently under development. Not all features may be fully implemented or working as expected.

Bookly is a modern full-stack web application for managing and browsing your book collection. Built with React, TypeScript, Express.js, and Vite, it features a clean UI with shadcn/ui components, sorting, searching, and comprehensive book management capabilities.

![Bookly Screenshot](./client/public/screenshot-english.png)

## Features

### 📚 Book Management

- Browse your book collection in a beautiful card layout
- Search for books by title or author
- Sort books in ascending or descending order
- Add and delete books with intuitive dialogs
- Multi-page navigation (Authors, Data, Settings)

### 🎨 Modern UI/UX

- Desktop-focused design with clean interface
- Dark/Light theme support with theme switcher
- Modern UI components powered by shadcn/ui and Radix UI
- Clean navigation with dropdown menus
- Language support with language selection button

### 🛠 Technical Features

- Full-stack architecture with Express.js backend
- React 19 with TypeScript for type safety
- TailwindCSS for utility-first styling
- Vite for fast development and optimized builds
- Component-based architecture with reusable UI elements

## Tech Stack

### Frontend

- **React 19** - Modern React with latest features
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and dev server
- **TailwindCSS** - Utility-first CSS framework
- **shadcn/ui** - Beautiful and accessible UI components
- **Radix UI** - Primitive UI components
- **React Router DOM** - Client-side routing
- **Lucide React** - Beautiful icons

### Backend

- **Express.js** - Fast and minimal web framework
- **Vite Express** - Integration between Vite and Express
- **Node.js** - JavaScript runtime

## Getting Started

### Prerequisites

- Node.js (v18 or newer recommended)
- pnpm (recommended package manager)

### Installation

1. Clone the repository:

   ```sh
   git clone https://github.com/Salafi-Coders/bookly.git
   cd bookly
   ```

2. Install dependencies for all workspaces:

   ```sh
   pnpm install:all
   ```

3. Start the development server:

   ```sh
   pnpm dev
   ```

4. Open [http://localhost:5173](http://localhost:5173) in your browser.

### Available Scripts

From the root directory:

- `pnpm dev` - Start development server (both client and server)
- `pnpm build` - Build the client for production
- `pnpm start` - Start production server
- `pnpm install:all` - Install dependencies for both client and server
- `pnpm build:production` - Build and start production server

## Project Structure

```text
bookly/
├── client/                 # React frontend application
│   ├── src/
│   │   ├── components/     # Reusable React components
│   │   │   ├── ui/         # shadcn/ui components
│   │   │   ├── books/      # Book-related components
│   │   │   └── navbar/     # Navigation components
│   │   ├── pages/          # Page components (Authors, Data, Settings)
│   │   ├── data/           # Static data files
│   │   ├── lib/            # Utility functions and helpers
│   │   └── assets/         # Static assets (images, logos)
│   ├── public/             # Public static files
│   └── package.json        # Client dependencies and scripts
├── server/                 # Express.js backend
│   ├── server.js           # Main server file
│   └── package.json        # Server dependencies and scripts
└── package.json           # Workspace configuration
```

## Development

### Adding New Components

This project uses shadcn/ui for UI components. To add new components:

```sh
cd client
npx shadcn@latest add [component-name]
```

### Customization

- **Book Data**: Edit `client/src/data/books.json` to modify the book collection
- **UI Styling**: Customize components in `client/src/components/ui/`
- **Theme**: Configure themes in `client/src/components/themeprovider.tsx`
- **API Routes**: Add backend routes in `server/server.js`

### Pages

The application includes multiple pages:

- **Main**: Book collection browser and management
- **Authors**: Author-specific views and management
- **Data**: Data visualization and analytics
- **Settings**: Application configuration and preferences

## License

MIT

</details>

---

## Arabic Tab

<details>
<summary><strong>📝 الوثائق العربية</strong></summary>

<div dir="rtl">

![شعار بوكلي](./client/src/assets/logofull-dark.svg)

---

> [!WARNING]  
> **عمل قيد التطوير**: هذا المشروع قيد التطوير حالياً. قد لا تكون جميع الميزات مُنفذة بالكامل أو تعمل كما هو متوقع.

بوكلي هو تطبيق ويب حديث متكامل لإدارة وتصفح مجموعة كتبك. مبني باستخدام React و TypeScript و Express.js و Vite، ويتميز بواجهة مستخدم نظيفة مع مكونات shadcn/ui، والفرز والبحث وإمكانيات إدارة الكتب الشاملة.

![لقطة شاشة من بوكلي](./client/public/screenshot-arabic.png)

## الميزات

### 📚 إدارة الكتب

- تصفح مجموعة كتبك في تخطيط بطاقات جميل
- البحث عن الكتب بالعنوان أو المؤلف
- ترتيب الكتب تصاعدياً أو تنازلياً
- إضافة وحذف الكتب مع نوافذ حوار بديهية
- التنقل متعدد الصفحات (المؤلفون، البيانات، الإعدادات)

### 🎨 واجهة المستخدم الحديثة

- تصميم مركز على سطح المكتب مع واجهة نظيفة
- دعم المظهر الداكن/الفاتح مع مبدل المظهر
- مكونات واجهة مستخدم حديثة مدعومة بـ shadcn/ui و Radix UI
- تنقل نظيف مع قوائم منسدلة
- دعم اللغة مع زر اختيار اللغة

### 🛠 الميزات التقنية

- بنية متكاملة مع خادم Express.js
- React 19 مع TypeScript لضمان الأمان في الأنواع
- TailwindCSS للتصميم المبني على الأدوات المساعدة
- Vite للتطوير السريع والبناء المُحسَّن
- بنية قائمة على المكونات مع عناصر واجهة مستخدم قابلة لإعادة الاستخدام

## المكدس التقني

### الواجهة الأمامية

- **React 19** - React حديث مع أحدث الميزات
- **TypeScript** - تطوير آمن في الأنواع
- **Vite** - أداة بناء سريعة وخادم تطوير
- **TailwindCSS** - إطار عمل CSS مبني على الأدوات المساعدة
- **shadcn/ui** - مكونات واجهة مستخدم جميلة ومتاحة
- **Radix UI** - مكونات واجهة مستخدم أساسية
- **React Router DOM** - توجيه من جانب العميل
- **Lucide React** - أيقونات جميلة

### الخادم

- **Express.js** - إطار عمل ويب سريع ومبسط
- **Vite Express** - التكامل بين Vite و Express
- **Node.js** - بيئة تشغيل JavaScript

## البدء

### المتطلبات المسبقة

- Node.js (يُفضل الإصدار 18 أو أحدث)
- pnpm (مدير الحزم المُوصى به)

### التثبيت

1. استنساخ المستودع:

   ```sh
   git clone https://github.com/Salafi-Coders/bookly.git
   cd bookly
   ```

2. تثبيت التبعيات لجميع مساحات العمل:

   ```sh
   pnpm install:all
   ```

3. بدء خادم التطوير:

   ```sh
   pnpm dev
   ```

4. افتح [http://localhost:5173](http://localhost:5173) في المتصفح.

### الأوامر المتاحة

من الدليل الجذر:

- `pnpm dev` - بدء خادم التطوير (العميل والخادم)
- `pnpm build` - بناء العميل للإنتاج
- `pnpm start` - بدء خادم الإنتاج
- `pnpm install:all` - تثبيت التبعيات للعميل والخادم
- `pnpm build:production` - بناء وبدء خادم الإنتاج

## هيكل المشروع

```text
bookly/
├── client/                 # تطبيق React للواجهة الأمامية
│   ├── src/
│   │   ├── components/     # مكونات React قابلة لإعادة الاستخدام
│   │   │   ├── ui/         # مكونات shadcn/ui
│   │   │   ├── books/      # مكونات متعلقة بالكتب
│   │   │   └── navbar/     # مكونات التنقل
│   │   ├── pages/          # مكونات الصفحات (المؤلفون، البيانات، الإعدادات)
│   │   ├── data/           # ملفات البيانات الثابتة
│   │   ├── lib/            # دوال المساعدة والمكتبات
│   │   └── assets/         # الأصول الثابتة (الصور، الشعارات)
│   ├── public/             # الملفات العامة الثابتة
│   └── package.json        # تبعيات وأوامر العميل
├── server/                 # خادم Express.js
│   ├── server.js           # ملف الخادم الرئيسي
│   └── package.json        # تبعيات وأوامر الخادم
└── package.json           # تكوين مساحة العمل
```

## التطوير

### إضافة مكونات جديدة

يستخدم هذا المشروع shadcn/ui لمكونات واجهة المستخدم. لإضافة مكونات جديدة:

```sh
cd client
npx shadcn@latest add [component-name]
```

### التخصيص

- **بيانات الكتب**: عدِّل `client/src/data/books.json` لتعديل مجموعة الكتب
- **تصميم واجهة المستخدم**: خصِّص المكونات في `client/src/components/ui/`
- **المظهر**: اضبط المظاهر في `client/src/components/themeprovider.tsx`
- **مسارات API**: أضف مسارات الخادم في `server/server.js`

### الصفحات

يتضمن التطبيق صفحات متعددة:

- **الرئيسية**: متصفح ومدير مجموعة الكتب
- **المؤلفون**: عروض وإدارة خاصة بالمؤلفين
- **البيانات**: تصور البيانات والتحليلات
- **الإعدادات**: تكوين التطبيق والتفضيلات

## الرخصة

MIT

</div>

</details>
