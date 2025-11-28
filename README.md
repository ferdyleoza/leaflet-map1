# 🗺️ Aplikasi Peta Leaflet dengan MongoDB

Aplikasi peta interaktif menggunakan Leaflet.js dengan backend Node.js dan MongoDB Atlas.

## 📋 Fitur

- 🗺️ Peta interaktif Jakarta
- 📍 Tambah marker dengan klik pada peta
- 💾 Simpan lokasi ke MongoDB Atlas
- ✏️ Edit dan hapus lokasi
- 🔄 Real-time sinkronisasi data

## 🚀 Cara Menjalankan

### 1. Install Dependencies
```bash
npm install
```

### 2. Konfigurasi Environment
File `.env` sudah dikonfigurasi dengan:
- MongoDB URI: Cluster MongoDB Atlas Anda
- Port: 3000

### 3. Jalankan Server
```bash
# Mode development dengan nodemon
npm run dev

# Atau mode production
npm start
```

### 4. Akses Aplikasi
Buka browser dan kunjungi: `http://localhost:3000`

## 📁 Struktur Project

```
leaflet-map1/
├── server.js          # Server Express.js
├── index.html         # Frontend peta
├── package.json       # Dependencies
├── .env              # Konfigurasi database
└── README.md         # Dokumentasi
```

## 🛠️ API Endpoints

| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| GET | `/api/locations` | Ambil semua lokasi |
| GET | `/api/locations/:id` | Ambil lokasi berdasarkan ID |
| POST | `/api/locations` | Tambah lokasi baru |
| PUT | `/api/locations/:id` | Update lokasi |
| DELETE | `/api/locations/:id` | Hapus lokasi |

## 📊 Schema MongoDB

```javascript
{
  name: String,           // Nama lokasi
  description: String,    // Deskripsi lokasi
  latitude: Number,       // Koordinat latitude
  longitude: Number,      // Koordinat longitude  
  type: String,          // Tipe: marker, polygon, polyline
  properties: Object,     // Data tambahan
  createdAt: Date,       // Tanggal dibuat
  updatedAt: Date        // Tanggal diupdate
}
```

## 🎮 Cara Menggunakan

1. **Tambah Lokasi**: Klik di mana saja pada peta
2. **Isi Form**: Masukkan nama dan deskripsi lokasi
3. **Simpan**: Data akan tersimpan di MongoDB
4. **Hapus**: Klik tombol "Hapus" pada popup marker

## 🔧 Teknologi

- **Frontend**: Leaflet.js, HTML5, CSS3, JavaScript
- **Backend**: Node.js, Express.js
- **Database**: MongoDB Atlas
- **Maps**: OpenStreetMap

## 👨‍💻 Developer

Ferdy - Sistem Informasi Geografis ULBI

---

Selamat coding! 🚀