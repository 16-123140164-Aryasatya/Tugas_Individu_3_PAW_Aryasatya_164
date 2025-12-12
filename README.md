# Product Review Analyzer

Sistem analisis review produk berbasis AI yang melakukan analisis sentimen dan ekstraksi poin-poin penting menggunakan Hugging Face dan Google Gemini AI.

##  Fitur Utama

- **Analisis Sentimen**: Otomatis mendeteksi sentimen positif, negatif, atau netral menggunakan Hugging Face transformers
- **Ekstraksi Poin Penting**: Mengekstrak poin-poin utama dari review menggunakan Google Gemini AI
- **Pelacakan Produk**: Menghubungkan review dengan produk tertentu
- **Analisis Real-time**: Feedback instan untuk setiap review yang disubmit
- **Penyimpanan Permanen**: Semua review tersimpan di database PostgreSQL
- **UI Modern**: Interface React yang clean dan responsif dengan tipografi Helvetica
- **Dukungan Multi-bahasa**: Bekerja dengan review dalam bahasa Indonesia dan Inggris

##  Persyaratan Sistem

Sebelum memulai, pastikan Anda sudah menginstall:

- **Python 3.11 atau 3.12** (Python 3.13 tidak direkomendasikan karena masalah kompatibilitas)
- **Node.js 16+** dan npm
- **PostgreSQL 12+**
- **Gemini API Key** - Dapatkan dari [Google AI Studio](https://makersuite.google.com/app/apikey)

##  Instalasi

### 1. Setup Backend

```bash
cd backend

# Buat virtual environment
python -m venv venv

# Aktifkan virtual environment
# Windows:
venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

# Upgrade pip
pip install --upgrade pip

# Install dependencies satu per satu
pip install flask flask-cors sqlalchemy python-dotenv google-generativeai transformers
pip install "psycopg[binary]"
pip install torch --index-url https://download.pytorch.org/whl/cpu
```

### 2. Konfigurasi Environment Variables

Buat file `.env` di folder `backend` dengan isi:

```env
DATABASE_URL=postgresql://postgres:password_anda@localhost:5432/product_review_db
GEMINI_API_KEY=api_key_gemini_anda
```

**Penting:** 
- Ganti `password_anda` dengan password PostgreSQL Anda
- Ganti `api_key_gemini_anda` dengan API key Gemini yang sudah didapatkan

**Cara mendapatkan Gemini API Key:**
1. Kunjungi https://makersuite.google.com/app/apikey
2. Login dengan akun Google
3. Klik "Get API Key" atau "Create API Key"
4. Copy API key yang muncul

### 3. Setup Frontend

```bash
cd ../frontend

# Install dependencies
npm install

# Install axios untuk HTTP requests
npm install axios
```

##  Menjalankan Aplikasi

### Jalankan Backend (Terminal 1)

```bash
cd backend

# Aktifkan virtual environment
venv\Scripts\activate  # Windows
# source venv/bin/activate  # Mac/Linux

# Jalankan server
python app.py
```

Backend akan berjalan di **http://localhost:5000**

**Catatan:** Saat pertama kali dijalankan, akan mendownload model Hugging Face (~250MB). Proses ini hanya terjadi sekali saja.

Output yang akan muncul:
```
Starting Flask server...
Server running on http://localhost:5000
```

### Jalankan Frontend (Terminal 2)

Buka terminal baru:

```bash
cd frontend

# Jalankan React app
npm start
```

Frontend akan berjalan di **http://localhost:3000**

Browser akan otomatis membuka aplikasi.

##  API Endpoints

### POST /api/analyze-review

Menganalisis review produk baru.

**Request Body:**
```json
{
  "product_name": "iPhone 15 Pro Max",
  "review_text": "Produk sangat bagus! Kamera jernih, performa cepat."
}
```

**Response:**
```json
{
  "id": 1,
  "product_name": "iPhone 15 Pro Max",
  "review_text": "Produk sangat bagus! Kamera jernih, performa cepat.",
  "sentiment": "positive",
  "sentiment_score": 0.9856,
  "key_points": "- Kualitas kamera sangat baik\n- Performa cepat dan responsif\n- Kepuasan pelanggan tinggi",
  "created_at": "2024-12-11T10:30:00"
}
```

### GET /api/reviews

Mengambil semua review yang tersimpan.

**Response:**
```json
[
  {
    "id": 1,
    "product_name": "iPhone 15 Pro Max",
    "review_text": "...",
    "sentiment": "positive",
    "sentiment_score": 0.9856,
    "key_points": "...",
    "created_at": "2024-12-11T10:30:00"
  }
]
```

### GET /api/health

Health check endpoint untuk memastikan server berjalan.

**Response:**
```json
{
  "status": "healthy"
}
```

##  Struktur Database

### Tabel: reviews

| Kolom | Tipe Data | Deskripsi |
|-------|-----------|-----------|
| id | Integer | Primary key (auto increment) |
| product_name | String(255) | Nama produk (opsional) |
| review_text | Text | Teks review asli |
| sentiment | String(20) | Hasil sentimen: positive/negative/neutral |
| sentiment_score | Float | Confidence score (0-1) |
| key_points | Text | Poin-poin penting hasil ekstraksi |
| created_at | DateTime | Timestamp saat review dibuat |

##  Struktur Project

```
product_review_analyzer_Aryasatya/
├── backend/
│   ├── venv/                    # Virtual environment
│   ├── app.py                   # Flask API endpoints
│   ├── models.py                # Database models (SQLAlchemy)
│   ├── analyzer.py              # Logic analisis AI
│   ├── test_gemini.py           # Script test Gemini API
│   ├── list_models.py           # Script list model Gemini
│   ├── view_database.py         # Script lihat isi database
│   ├── requirements.txt         # Python dependencies
│   └── .env                     # Environment variables (jangan di-commit!)
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ReviewForm.js   # Form input review
│   │   │   └── ReviewList.js   # List semua review
│   │   ├── App.js               # Main component
│   │   ├── App.css              # Styling (Helvetica font)
│   │   └── index.js             # Entry point
│   ├── public/
│   ├── package.json             # npm dependencies
│   └── node_modules/
└── README.md                    # File ini
```

##  Model AI yang Digunakan

### 1. Hugging Face - Sentiment Analysis
- **Model:** DistilBERT (distilbert-base-uncased-finetuned-sst-2-english)
- **Fungsi:** Menganalisis sentimen (positive/negative)
- **Size:** ~250MB
- **Lokasi:** Tersimpan lokal di cache setelah download pertama
- **Tidak perlu API key**

### 2. Google Gemini - Key Points Extraction
- **Model:** Gemini 2.5 Flash
- **Fungsi:** Mengekstrak poin-poin penting dari review
- **Bahasa:** Mendukung 100+ bahasa termasuk Indonesia
- **Perlu API key**
- **Rate limit:** Gratis tier (60 requests/menit)

##  Cara Kerja Aplikasi

1. **User mengisi form** → Nama produk (opsional) + Review text
2. **Frontend kirim ke Backend** → POST request ke `/api/analyze-review`
3. **Backend proses:**
   - Hugging Face menganalisis sentimen
   - Gemini mengekstrak key points
4. **Simpan ke Database** → PostgreSQL menyimpan semua data
5. **Return hasil** → Frontend menampilkan hasil analisis
6. **Update list** → Menampilkan semua review yang pernah di-submit

##  Fitur UI

- **Responsive Design**: Berfungsi baik di desktop dan mobile
- **Loading States**: Indikator loading saat proses analisis
- **Error Handling**: Pesan error yang jelas dan user-friendly
- **Color-coded Sentiment**: 
  - 🟢 Hijau untuk Positive
  - 🔴 Merah untuk Negative
  - ⚪ Abu-abu untuk Neutral
- **Typography**: Menggunakan Helvetica untuk tampilan yang clean dan professional

##  Developer

- **Nama:** Aryasatya Widyatna Akbar
- **NIM:** 123140164
- **Kelas:** RB
- **Mata Kuliah:** Pemrograman Aplikasi Web

**Catatan Penting:**
- Jangan commit file `.env` ke Git (sudah ada di `.gitignore`)
- Backup database secara berkala
- Monitor penggunaan API Gemini untuk menghindari over-quota
- Test aplikasi dengan berbagai jenis review sebelum deployment

---