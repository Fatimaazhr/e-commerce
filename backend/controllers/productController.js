const Produk = require('../models/productModel');
const fs = require('fs');
const path = require('path');

exports.getAllProduk = async (req, res) => {
  try {
    const data = await Produk.getAll();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getProdukById = async (req, res) => {
  try {
    const data = await Produk.getById(req.params.id);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createProduk = async (req, res) => {
  try {
    const newProduk = req.body;

    // Jika ada file gambar yang diupload, simpan nama filenya
    if (req.file) {
      newProduk.gambar = req.file.filename;
    }

    const result = await Produk.create(newProduk);
    res.status(201).json({ message: 'Produk ditambahkan', id: result.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateProduk = async (req, res) => {
  try {
    const id = req.params.id;
    const updatedProduk = req.body;

    if (req.file) {
      // Ambil data produk lama supaya dapat nama file gambar lama
      const oldProduk = await Produk.getById(id);

      if (oldProduk.gambar) {
        // Hapus file gambar lama dari folder public/image
        const oldImagePath = path.join(__dirname, '../../public/image', oldProduk.gambar);
        fs.unlink(oldImagePath, (err) => {
          if (err) {
            console.error('Gagal hapus gambar lama:', err);
          }
        });
      }

      // Update nama file gambar baru
      updatedProduk.gambar = req.file.filename;
    }

    const result = await Produk.update(id, updatedProduk);
    res.json({ message: 'Produk diperbarui', result });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.deleteProduk = async (req, res) => {
  try {
    const id = req.params.id;
    // Ambil data produk dulu supaya tahu nama gambar
    const produk = await Produk.getById(id);

    if (produk && produk.gambar) {
      const imagePath = path.join(__dirname, '../../public/image', path.basename(produk.gambar));
      fs.unlink(imagePath, (err) => {
        if (err) console.error('Gagal hapus gambar produk:', err);
      });
    }

    const result = await Produk.delete(id);
    res.json({ message: 'Produk dihapus', result });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
