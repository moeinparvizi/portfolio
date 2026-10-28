# راهنمای توسعه و انتشار پورتفولیو

## ساختار و آدرس‌ها

- فرانت‌اند: `apps/frontend`، Angular، پورت 4200.
- بک‌اند: `apps/backend`، NestJS، پورت 3000.
- مدل دیتابیس: `apps/backend/prisma/schema.prisma`.
- سایت: https://moeinparvizi.vercel.app/fa
- مدیریت: https://moeinparvizi.vercel.app/admin/login
- تنظیم انتشار هر دو سرویس: `vercel.json` در ریشهٔ مخزن.

محتوای رزومه، مهارت‌ها و پروژه‌ها از دیتابیس خوانده می‌شود. تغییر این محتوا از پنل مدیریت نیاز به کامیت یا انتشار مجدد ندارد. تغییر کد، طراحی و منطق برنامه نیاز به انتشار دارد.

## اجرای محلی از صفر

Node.js نسخهٔ 24 و pnpm نسخهٔ 11.10.0 لازم است. اگر nvm داری:

```bash
nvm install
nvm use
npm install -g pnpm@11.10.0
pnpm install --frozen-lockfile
cp apps/backend/.env.example apps/backend/.env
```

دستورهای این راهنما از ریشهٔ مخزن اجرا می‌شوند. فایل `apps/backend/.env` را با مقدارهای محیط توسعه پر کن. بک‌اند و Prisma این فایل را از پوشهٔ بک‌اند می‌خوانند؛ فرانت‌اند فایل env جداگانه‌ای لازم ندارد و درخواست‌های `/api` را با `apps/frontend/proxy.conf.json` به پورت 3000 می‌فرستد.

برای دیتابیس محلی، اگر Docker Desktop نصب و اجراست:

```bash
docker compose up -d db
```

این سرویس به طور پیش‌فرض دیتابیس `portfolio` با کاربر و رمز `portfolio` روی پورت 5432 می‌سازد. این مشخصات صرفاً برای توسعهٔ محلی است. اگر پورت اشغال است، از PostgreSQL محلی خودت استفاده کن و `DATABASE_URL` را متناسب با آن بنویس.

دو مقدار مستقل برای JWT بساز و در فایل env قرار بده:

```bash
node -e "console.log(require('node:crypto').randomBytes(48).toString('base64url'))"
```

سپس:

```bash
pnpm --filter backend exec prisma generate
pnpm db:deploy
node --env-file=apps/backend/.env scripts/seed-production.mjs
```

دستور آخر فقط برای مقداردهی اولیهٔ دیتابیس تازه است: مدیر، پروفایل، مهارت‌ها و پروژه‌های اولیه را ایجاد می‌کند. `ADMIN_USERNAME` و `ADMIN_PASSWORD` باید در env تعریف شده باشند؛ رمز حداقل 20 کاراکتر باشد. داده‌های موجود را به‌روزرسانی نمی‌کند و ابزار تغییر رمز مدیر نیست. مقداردهی اولیه را در هر build اجرا نکن.

سرورهای توسعه را در دو ترمینال جدا اجرا کن:

```bash
# ترمینال اول
pnpm --filter backend run start:dev
```

```bash
# ترمینال دوم
pnpm --filter frontend start
```

- سایت محلی: http://localhost:4200/fa
- مدیریت محلی: http://localhost:4200/admin/login
- مستندات API: http://localhost:3000/api/docs
- بررسی سلامت بک‌اند: http://localhost:3000/health

## متغیرهای محیطی

| متغیر | محل و کاربرد |
| --- | --- |
| `DATABASE_URL` | محرمانه؛ آدرس PostgreSQL برای Prisma. برای توسعه از دیتابیس جدا استفاده کن. |
| `JWT_SECRET` | محرمانه؛ امضای توکن ورود. |
| `JWT_REFRESH_SECRET` | محرمانه؛ امضای refresh token؛ با کلید قبلی متفاوت باشد. |
| `JWT_EXPIRATION` | زمان اعتبار ورود؛ پیش‌فرض `15m`. |
| `REFRESH_EXPIRATION` | زمان اعتبار refresh token؛ پیش‌فرض `7d`. |
| `PORT` | فقط اجرای محلی؛ `3000`. Vercel درخواست‌ها را به handler می‌فرستد. |
| `CORS_ORIGINS` | محلی `http://localhost:4200`؛ Production آدرس سایت. چند آدرس را بدون فاصله با کاما جدا کن. |
| `SUPABASE_URL` | آدرس پروژهٔ Supabase برای ذخیرهٔ تصویر. |
| `SUPABASE_SERVICE_ROLE_KEY` | کاملاً محرمانه؛ فقط بک‌اند، هرگز در Angular یا مخزن قرار نگیرد. |
| `SUPABASE_STORAGE_BUCKET` | نام bucket؛ روی هاست `portfolio-images` است. |
| `UPLOAD_DIR` | روی Vercel برابر `/tmp/portfolio-uploads`؛ ذخیرهٔ دائمی عکس‌ها در Supabase است. |
| `ADMIN_USERNAME` / `ADMIN_PASSWORD` | فقط اسکریپت مقداردهی اولیه؛ مدیر فعلی در دیتابیس ذخیره شده و به این envها در Vercel نیاز ندارد. |
| `PUPPETEER_SKIP_DOWNLOAD` | در build هاست `true`؛ Chromium مخصوص سرور همراه وابستگی‌هاست. محلی برای دانلود PDF می‌توان Chrome مخصوص Puppeteer را نصب کرد. |
| `VERCEL_SUPPORT_LARGE_FUNCTIONS` | در پروژهٔ فعلی `1`؛ برای بستهٔ بک‌اند شامل Chromium تنظیم شده است. |

Supabase integration ممکن است متغیرهای دیگری مانند `POSTGRES_PRISMA_URL` و `POSTGRES_URL_NON_POOLING` بسازد. اپلیکیشن برای دیتابیس مستقیماً `DATABASE_URL` را می‌خواند. برای migration روی Supabase، از اتصال مستقیم یا Session pooler ارائه‌شده در داشبورد استفاده کن؛ اتصال transaction pooler را بدون بررسی برای migration استفاده نکن.

برای آپلود دائمی در توسعه، یک پروژه/bucket جداگانهٔ Supabase بساز، bucket تصاویر را برای خواندن عمومی تنظیم کن و سه مقدار `SUPABASE_URL`، `SUPABASE_SERVICE_ROLE_KEY` و `SUPABASE_STORAGE_BUCKET` را در env توسعه قرار بده. نوشتن از سمت سرور و با service role انجام می‌شود. بدون این تنظیمات، آپلود روی دیسک محلی انجام می‌شود؛ مسیر `/uploads` در نسخهٔ فعلی بک‌اند سرویس‌دهی عمومی ندارد، بنابراین برای بررسی کامل تصاویر از Supabase توسعه استفاده کن.

برای دانلود PDF در اجرای محلی، اگر Chrome مخصوص Puppeteer موجود نیست:

```bash
pnpm --filter backend exec puppeteer browsers install chrome
```

`VERCEL` را در env محلی تعریف نکن؛ این مقدار در هاست خودکار است و مسیر اجرای Chromium سرور را فعال می‌کند.

### فایل‌های محرمانهٔ همین سیستم

- `.env.deployment.local`: مقادیر واقعی اتصال هاست؛ برای توسعهٔ روزمره استفاده نکن، چون به دیتابیس زنده وصل است.
- `.env.admin.local`: اطلاعات ورود مدیر فعلی.
- `apps/backend/.env`: تنظیمات توسعهٔ خودت.

این فایل‌ها و پوشهٔ `.vercel` از Git مستثنا هستند. فقط فایل‌های `.env.example` بدون کلید واقعی باید کامیت شوند. رمزهای حساس Vercel ممکن است با `vercel env pull` قابل بازیابی نباشند؛ در این صورت از منبع اصلی تنظیمات استفاده کن. برای تست preview هم دیتابیس/فضای ذخیره‌سازی جدا توصیه می‌شود؛ preview فعلی ممکن است به همان Supabase زنده وصل باشد.

## بررسی قبل از پوش

```bash
pnpm --filter backend run test --runInBand
pnpm --filter backend run build
pnpm --filter frontend run build --output-mode=static
git diff --check
git status --short
```

وابستگی تازه را با pnpm اضافه کن و `pnpm-lock.yaml` را هم کامیت کن. تنظیم virtual store و allowBuilds در `pnpm-workspace.yaml` برای بسته‌بندی فعلی هاست لازم است.

## انتشار هر تغییر روی Vercel

پروژهٔ Vercel باید به مخزن `moeinparvizi/portfolio` متصل باشد و Production Branch آن `main` باشد. در تنظیمات Vercel، بخش Git/Environments این اتصال را بررسی کن. `vercel.json` هر دو سرویس را تعریف می‌کند؛ ریشهٔ پروژه ریشهٔ همین مخزن است، نه فقط `apps/frontend`.

بعد از ویرایش و اجرای بررسی‌ها:

```bash
git add <files-you-changed>
git commit -m "Describe your change"
git push origin main
```

با اتصال Git فعال، Vercel برای push روی `main` انتشار Production می‌سازد و پس از آماده‌شدن، آدرس اصلی به نسخهٔ تازه اشاره می‌کند. پیشرفت را در پروژهٔ `moeinparvizi`، تب Deployments ببین. اگر Failed شد، Build Logs و سپس Runtime Logs را بررسی کن. Push روی شاخه‌های دیگر معمولاً Preview می‌سازد؛ برای انتشار عمومی تغییرات را به `main` برسان.

روش دستی جایگزین، از همین پوشه و پس از ورود به حساب Vercel:

```bash
pnpm dlx vercel@65.2.0 login
pnpm dlx vercel@65.2.0 link
pnpm dlx vercel@65.2.0 deploy --prod
```

هنگام link، پروژهٔ موجود `moeinparvizi` در تیم `moeinparvizis-projects` را انتخاب کن. لازم نیست پروژهٔ جدید بسازی. انتشار CLI کد محلی را می‌فرستد؛ برای اینکه GitHub هم منبع کامل تغییرات بماند، تغییرات را کامیت و پوش کن.

### تغییر env روی هاست

Vercel → پروژهٔ `moeinparvizi` → Settings → Environment Variables. مقدار را برای محیط درست، Production یا Preview، تنظیم کن. سپس Redeploy بزن یا کامیت تازه پوش کن؛ مقدار جدید روی انتشارهای قبلی اعمال نمی‌شود. کلید محرمانه را داخل `vercel.json` یا کد فرانت‌اند قرار نده.

### تغییر ساختار دیتابیس

در محیط توسعهٔ جدا:

```bash
# بعد از ویرایش schema.prisma
pnpm --filter backend exec prisma migrate dev --name describe_change
pnpm --filter backend exec prisma generate
```

پوشهٔ migration جدید را همراه تغییر کد کامیت کن. پروژهٔ فعلی در build فقط Prisma Client را تولید می‌کند و migration را خودکار روی Production اجرا نمی‌کند. قبل از انتشار کدی که به ستون/جدول جدید وابسته است، با اتصال Production مناسب، یک بار `prisma migrate deploy` را اجرا کن. مقدار اتصال را فقط در فایل env محرمانه نگه دار؛ مثلاً یک فایل نادیده‌گرفته‌شدهٔ `.env.migration.local` در ریشه شامل `DATABASE_URL` مناسب بساز و سپس:

```bash
node --env-file=.env.migration.local --run db:deploy
```

`migrate dev`، `db push`، `migrate reset` و seed نمونه را روی دیتابیس زنده اجرا نکن. برای تغییرات ناسازگار با نسخهٔ قبلی، ابتدا migration سازگار اضافه کن و حذف ستون‌ها را به انتشار بعدی موکول کن.

## منابع رسمی

- https://vercel.com/docs/git
- https://vercel.com/docs/environment-variables
- https://vercel.com/docs/services/config-reference
- https://www.prisma.io/docs/orm/prisma-migrate/workflows/development-and-production
