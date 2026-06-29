# Vue Fullstack JMC Admin - Sistem Informasi Manajemen Pegawai & Tunjangan

🌐 **Live Demo**: [https://jmc-test.riqo-porto.my.id/](https://jmc-test.riqo-porto.my.id/)

Aplikasi web fullstack berbasis **Nuxt 4 (Vue 3)** untuk pengelolaan administrasi data pegawai, tunjangan, peran pengguna (role), dan audit log aktivitas. Aplikasi ini menggunakan **Nitro Server Engine** sebagai backend API terintegrasi dan **Tabler UI** untuk antarmuka dashboard admin yang modern dan responsif.

---

## 🛠️ Teknologi yang Digunakan (Tech Stack)

### Frontend
- **Framework**: [Nuxt 4](https://nuxt.com/) (Vue 3 with Composition API)
- **UI Framework & Icon**: [Tabler UI v1.0.0-beta24](https://tabler.io/) & `@tabler/icons-vue`
- **Grafik & Visualisasi**: [ApexCharts](https://apexcharts.com/) (`vue3-apexcharts`)
- **Slider/Carousel**: [Swiper](https://swiperjs.com/)

### Backend & API
- **Server Engine**: Nitro Engine (Bawaan Nuxt 4)
- **Database Driver**: MySQL2 (`mysql2`)
- **Dokumentasi API**: [Scalar OpenAPI](https://scalar.com/) (`@scalar/nuxt`)

### Keamanan & Ekspor Data
- **Autentikasi**: JSON Web Token (`jsonwebtoken`) & `bcrypt` password hashing
- **Proteksi Bot**: Math Captcha (built-in) / Google reCAPTCHA v2 (opsional)
- **Ekspor Dokumen**: `xlsx` (Excel) & `pdfmake` (PDF)

---

## ✨ Fitur-Fitur Utama

1. **Autentikasi & Keamanan**:
   - Login terproteksi captcha (math captcha bawaan atau Google reCAPTCHA) dan autentikasi sesi berbasis JWT.
   - Manajemen sesi aman dan middleware verifikasi token.
2. **Dashboard Interaktif**:
   - Statistik ringkasan data pegawai dan statistik tunjangan dengan Grafik ApexCharts.
   - Mode Gelap / Terang (Dark / Light Mode) otomatis tersimpan.
3. **Manajemen Pegawai**:
   - Pengelolaan data master pegawai, unit kerja, dan jabatan.
   - Fitur upload foto pegawai.
   - Pencarian, filtering, dan paginasi data.
4. **Manajemen Tunjangan**:
   - Pengaturan variabel dan pengalokasian tunjangan pegawai.
5. **Manajemen User & Hak Akses (Role)**:
   - Pengaturan akun pengguna dan kontrol akses berbasis peran (*Role-Based Access Control*).
6. **Activity Log**:
   - Pencatatan otomatis setiap aktivitas/transaksi sistem untuk kebutuhan audit log.
7. **Laporan & Ekspor Data**:
   - Fitur ekspor laporan data pegawai dan tunjangan ke format Excel (`.xlsx`) dan PDF.

---

## 📁 Struktur Folder Project

```text
Vue_Fullstack_JMC_Admin/
├── app/                  # Frontend Layer (Vue 3 / Nuxt 4)
│   ├── assets/           # Stylesheet CSS & Gambar
│   ├── components/       # Komponen UI Reusabel (Sidebar, Header, Breadcrumb)
│   ├── composables/      # Logika Bisnis & State Management Frontend
│   ├── data/             # Konfigurasi Menu & Static Data
│   ├── layouts/          # Layout Template (Default Dashboard, Auth)
│   ├── middleware/       # Navigation Guard Frontend
│   └── pages/            # Routing Halaman (Dashboard, Pegawai, User, Tunjangan, Log)
├── server/               # Backend Layer (Nitro Server)
│   ├── api/              # REST API Endpoints (Auth, Pegawai, Tunjangan, User, Activity)
│   │   ├── auth/         # Login, Logout, Verify
│   │   ├── pegawai/      # CRUD Pegawai + Upload Foto
│   │   └── ...
│   ├── middleware/       # Backend Middleware (JWT Authentication)
│   └── utils/            # Helper Koneksi Database MySQL & Utility Server
├── database/             # SQL Dump & Migrations
└── nuxt.config.js        # Konfigurasi Utama Nuxt & Plugin
```

---

## 🚀 Panduan Memulai (Getting Started)

### 1. Instalasi Dependensi
Pastikan Node.js (v18+) sudah terinstall di komputer Anda, lalu jalankan:

```bash
npm install
```

### 2. Setup Database
Import file `kepegawaian_db.sql` ke MariaDB/MySQL:

```bash
mysql -u root -p < "kepegawaian_db.sql"
```

Atau buat database baru dan import manual melalui phpMyAdmin:
1. Buat database `kepegawaian_db`
2. Import file SQL

> Migrasi tabel tambahan (kolom `jenis_kontrak`, `jenis_kelamin`, `last_session`, dan tabel tunjangan) akan dilakukan **otomatis** saat pertama kali aplikasi dijalankan.

### 3. Setup Captcha

Aplikasi mendukung **2 opsi captcha** untuk proteksi halaman login. Pilih salah satu:

#### Opsi A: Math Captcha (Default — Direkomendasikan)
Captcha matematika sederhana (contoh: `"23 + 15 = ?"`). **Tidak perlu setup API key** — built-in, 100% work, tanpa ketergantungan layanan eksternal.

- Server generate soal matematika + sign jawaban dalam JWT (expired 5 menit).
- User menjawab, server verifikasi jawaban.
- **Tidak ada konfigurasi tambahan** — langsung berfungsi.

#### Opsi B: Google reCAPTCHA v2 (Alternatif)
Jika ingin menggunakan Google reCAPTCHA v2 checkbox ("Saya bukan robot"):

1. Buka [https://www.google.com/recaptcha/admin](https://www.google.com/recaptcha/admin)
2. Login dengan akun Google Anda
3. Daftarkan aplikasi baru dengan tipe **reCAPTCHA v2 -> "Saya bukan robot" (Checkbox)**
4. Tambahkan domain Anda (contoh: `localhost`, `jmc-test.riqo-porto.my.id`)
5. Dapatkan **Site Key** dan **Secret Key**
6. Lakukan perubahan kode:
   - **Frontend** (`app/features/auth/Login/components/LoginForm.vue`): Ganti mekanisme math captcha dengan Google reCAPTCHA widget (`grecaptcha.render`)
   - **Backend** (`server/api/auth/login.post.ts`): Ganti validasi math captcha dengan `POST` ke `https://www.google.com/recaptcha/api/siteverify`
   - **Config** (`nuxt.config.js`): Tambah `recaptchaSiteKey` ke `runtimeConfig.public`
   - **`ecosystem.config.cjs`**: Tambah `NUXT_PUBLIC_RECAPTCHA_SITE_KEY` dan `RECAPTCHA_SECRET_KEY`
7. Masukkan Site Key ke `.env`:

   ```env
   NUXT_PUBLIC_RECAPTCHA_SITE_KEY=6LcVWDktAAAAAEV_cOXwLx2lHxnmBDGJkCM5nh2Q
   RECAPTCHA_SECRET_KEY=6LcVWDktAAAAAIbPqmxxNNRWBMrRNI0nqD4ZGIhT
   ```

### 4. Konfigurasi Environment (`.env`)
Salin atau buat file `.env` di direktori utama dan atur konfigurasi berikut:

```env
APP_NAME=Kepegawaian
APP_CLIENT=FWD-JMC

# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASS=
DB_NAME=kepegawaian_db

# Auth & Security
JWT_SECRET=rahasia_superadmin_fwdjmc
JWT_EXPIRES_IN=8h
```

### 5. Install Dependencies

```bash
npm install
```

### 6. Jalankan Server Development

```bash
npm run dev
```

Buka browser dan akses [http://localhost:3000](http://localhost:3000).

### 7. Akun Default

| Role | Username | Password |
|---|---|---|
| Superadmin | superadmin | superadmin |
| Manager HRD | manager_hrd | manager_hrd |
| Admin HRD | admin_hrd | admin_hrd |

> Password menggunakan bcrypt hash dari database. Gunakan akun sesuai role yang ingin diuji.

### 8. Dokumentasi API (Scalar OpenAPI)
Dokumentasi API interaktif dapat diakses saat server berjalan melalui URL:

- **Scalar UI**: [http://localhost:3000/_scalar](http://localhost:3000/_scalar)
- **Swagger UI**: [http://localhost:3000/_swagger](http://localhost:3000/_swagger)
- **OpenAPI JSON**: [http://localhost:3000/_openapi.json](http://localhost:3000/_openapi.json)

Dokumentasi mencakup semua endpoint REST API termasuk modul perhitungan tunjangan.

### 9. Build untuk Production

```bash
npm run build
npm run preview
```

---

## 🌐 Panduan Deploy di VPS (Production)

Panduan langkah demi langkah untuk mendeploy aplikasi di VPS (contoh: Ubuntu 22.04/24.04).

### 1. Prasyarat
Akses VPS via SSH dengan user `root` atau user `sudo`.

```bash
ssh user@ip-vps-anda
```

### 2. Install Paket yang Dibutuhkan

```bash
# Update package list
sudo apt update && sudo apt upgrade -y

# Install Node.js 22.x
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt install -y nodejs

# Install MySQL Server
sudo apt install -y mysql-server

# Install Nginx
sudo apt install -y nginx

# Install Git
sudo apt install -y git

# Install PM2 global
sudo npm install -g pm2

# Install Certbot untuk SSL
sudo apt install -y certbot python3-certbot-nginx

# Cek versi
node -v
npm -v
mysql --version
nginx -v
```

### 3. Setup MySQL

```bash
# Login ke MySQL
sudo mysql

# Buat database
CREATE DATABASE kepegawaian_db;
EXIT;
```

Import database dari file SQL:

```bash
# Copy file SQL ke server, lalu import
mysql -u root kepegawaian_db < /path/to/kepegawaian_db.sql
```

### 4. Clone Project & Install Dependencies

```bash
# Pindah ke direktori home atau /var/www
cd /home/ubuntu  # atau /var/www
git clone <url-repo-anda> intern_jmc
cd intern_jmc

# Install dependencies
npm install
```

### 5. Konfigurasi Environment

Buat file `.env`:

```bash
nano .env
```

Isi dengan:

```env
APP_NAME=Kepegawaian
APP_CLIENT=FWD-JMC
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASS=
DB_NAME=kepegawaian_db
JWT_SECRET=rahasia_superadmin_fwdjmc
JWT_EXPIRES_IN=8h
```

> Ganti `JWT_SECRET` dengan string acak yang kuat untuk production.

### 6. Build Aplikasi

```bash
npm run build
```

### 7. Setup PM2 Ecosystem

Buat file `ecosystem.config.cjs` di root project:

```bash
nano ecosystem.config.cjs
```

```javascript
module.exports = {
  apps: [
    {
      name: "jmc-app",
      script: "./.output/server/index.mjs",
      exec_mode: "fork",
      env: {
        NODE_ENV: "production",
        PORT: "3000",
        HOST: "0.0.0.0",
        APP_NAME: "Kepegawaian",
        APP_CLIENT: "FWD-JMC",
        DB_HOST: "localhost",
        DB_PORT: "3306",
        DB_USER: "root",
        DB_PASS: "",
        DB_NAME: "kepegawaian_db",
        JWT_SECRET: "rahasia_superadmin_fwdjmc",
        JWT_EXPIRES_IN: "8h",
      },
    },
  ],
};
```

Jalankan aplikasi dengan PM2:

```bash
pm2 start ecosystem.config.cjs
pm2 save
pm2 startup
```

> `pm2 startup` mengkonfigurasi PM2 untuk otomatis restart saat server reboot.

### 8. Konfigurasi Nginx sebagai Reverse Proxy

```bash
sudo nano /etc/nginx/sites-available/jmc-test
```

Isi dengan:

```nginx
server {
    server_name jmc-test.riqo-porto.my.id;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Batasi ukuran upload (untuk foto pegawai)
    client_max_body_size 10M;
}
```

Aktifkan site:

```bash
sudo ln -s /etc/nginx/sites-available/jmc-test /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### 9. Setup SSL dengan Certbot (Let's Encrypt)

```bash
sudo certbot --nginx -d jmc-test.riqo-porto.my.id
```

Ikuti wizard untuk konfigurasi SSL. Certbot akan otomatis:
- Mendapatkan sertifikat SSL
- Memodifikasi konfigurasi Nginx
- Mengatur auto-renewal

Verifikasi:

```bash
sudo certbot renew --dry-run
```

### 10. Verifikasi Deploy

```bash
# Cek status PM2
pm2 status

# Cek apakah aplikasi berjalan
curl http://localhost:3000

# Cek dari browser
# Buka https://jmc-test.riqo-porto.my.id/
```

### 11. Perintah PM2 untuk Maintenance

```bash
# Restart aplikasi
pm2 restart jmc-app

# Restart dengan update environment variables
pm2 restart jmc-app --update-env

# Lihat log real-time
pm2 logs jmc-app

# Lihat log error
pm2 logs jmc-app --err

# Flush log (hapus log lama)
pm2 flush jmc-app

# Stop aplikasi
pm2 stop jmc-app

# Hapus dari daftar PM2
pm2 delete jmc-app

# Monitoring resource
pm2 monit

# Simpan daftar proses (wajib setelah perubahan)
pm2 save
```

### 12. Update Aplikasi

```bash
cd /home/ubuntu/intern_jmc
git pull origin main
npm install
npm run build
pm2 restart jmc-app --update-env
```

---

## 📄 Lisensi

Hak cipta dilindungi. Aplikasi ini bersifat internal dan tidak untuk didistribusikan secara publik.
