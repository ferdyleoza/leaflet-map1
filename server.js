const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public')); // Untuk serve file HTML statis

// Koneksi MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('✅ Berhasil terhubung ke MongoDB Atlas');
})
.catch((error) => {
  console.error('❌ Error koneksi MongoDB:', error);
});

// Schema untuk menyimpan data marker/lokasi
const LocationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  latitude: {
    type: Number,
    required: true
  },
  longitude: {
    type: Number,
    required: true
  },
  type: {
    type: String,
    enum: ['marker', 'polygon', 'polyline'],
    default: 'marker'
  },
  properties: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

const Location = mongoose.model('Location', LocationSchema);

// Routes

// GET - Ambil semua lokasi
app.get('/api/locations', async (req, res) => {
  try {
    const locations = await Location.find().sort({ createdAt: -1 });
    res.json({
      success: true,
      data: locations
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error mengambil data lokasi',
      error: error.message
    });
  }
});

// GET - Ambil lokasi berdasarkan ID
app.get('/api/locations/:id', async (req, res) => {
  try {
    const location = await Location.findById(req.params.id);
    if (!location) {
      return res.status(404).json({
        success: false,
        message: 'Lokasi tidak ditemukan'
      });
    }
    res.json({
      success: true,
      data: location
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error mengambil data lokasi',
      error: error.message
    });
  }
});

// POST - Tambah lokasi baru
app.post('/api/locations', async (req, res) => {
  try {
    const { name, description, latitude, longitude, type, properties } = req.body;
    
    const newLocation = new Location({
      name,
      description,
      latitude,
      longitude,
      type,
      properties
    });

    const savedLocation = await newLocation.save();
    res.status(201).json({
      success: true,
      message: 'Lokasi berhasil ditambahkan',
      data: savedLocation
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error menambah lokasi',
      error: error.message
    });
  }
});

// PUT - Update lokasi
app.put('/api/locations/:id', async (req, res) => {
  try {
    const { name, description, latitude, longitude, type, properties } = req.body;
    
    const updatedLocation = await Location.findByIdAndUpdate(
      req.params.id,
      {
        name,
        description,
        latitude,
        longitude,
        type,
        properties,
        updatedAt: Date.now()
      },
      { new: true, runValidators: true }
    );

    if (!updatedLocation) {
      return res.status(404).json({
        success: false,
        message: 'Lokasi tidak ditemukan'
      });
    }

    res.json({
      success: true,
      message: 'Lokasi berhasil diupdate',
      data: updatedLocation
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error mengupdate lokasi',
      error: error.message
    });
  }
});

// DELETE - Hapus lokasi
app.delete('/api/locations/:id', async (req, res) => {
  try {
    const deletedLocation = await Location.findByIdAndDelete(req.params.id);
    
    if (!deletedLocation) {
      return res.status(404).json({
        success: false,
        message: 'Lokasi tidak ditemukan'
      });
    }

    res.json({
      success: true,
      message: 'Lokasi berhasil dihapus',
      data: deletedLocation
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error menghapus lokasi',
      error: error.message
    });
  }
});

// Route untuk testing koneksi database
app.get('/api/test', async (req, res) => {
  try {
    const count = await Location.countDocuments();
    res.json({
      success: true,
      message: 'Koneksi database berhasil!',
      totalLocations: count,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error koneksi database',
      error: error.message
    });
  }
});

// Route untuk menambah sample data
app.post('/api/sample', async (req, res) => {
  try {
    const sampleLocations = [
      {
        name: 'Monas',
        description: 'Monumen Nasional Jakarta',
        latitude: -6.1754,
        longitude: 106.8272,
        type: 'marker'
      },
      {
        name: 'Istana Negara',
        description: 'Istana Kepresidenan RI',
        latitude: -6.1701,
        longitude: 106.8229,
        type: 'marker'
      },
      {
        name: 'Masjid Istiqlal',
        description: 'Masjid terbesar di Asia Tenggara',
        latitude: -6.1702,
        longitude: 106.8292,
        type: 'marker'
      }
    ];

    const insertedLocations = await Location.insertMany(sampleLocations);
    
    res.json({
      success: true,
      message: 'Sample data berhasil ditambahkan',
      data: insertedLocations
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error menambah sample data',
      error: error.message
    });
  }
});

// Serve file HTML utama
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Terjadi kesalahan server',
    error: err.message
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint tidak ditemukan'
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server berjalan di http://localhost:${PORT}`);
  console.log(`📍 Database: MongoDB Atlas`);
});
