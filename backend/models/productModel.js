const db = require('../config/db'); // pastikan ini koneksi MySQL kamu

const Produk = {
  getAll: () => {
    return new Promise((resolve, reject) => {
      db.query('SELECT * FROM products', (err, results) => {
        if (err) return reject(err);
        resolve(results);
      });
    });
  },

  getById: (id) => {
    return new Promise((resolve, reject) => {
      db.query('SELECT * FROM products WHERE id = ?', [id], (err, results) => {
        if (err) return reject(err);
        resolve(results[0]);
      });
    });
  },

  create: (data) => {
    return new Promise((resolve, reject) => {
      db.query('INSERT INTO products SET ?', data, (err, result) => {
        if (err) return reject(err);
        resolve(result);
      });
    });
  },

  update: (id, data) => {
    return new Promise((resolve, reject) => {
      db.query('UPDATE products SET ? WHERE id = ?', [data, id], (err, result) => {
        if (err) return reject(err);
        resolve(result);
      });
    });
  },

  delete: (id) => {
    return new Promise((resolve, reject) => {
      db.query('DELETE FROM products WHERE id = ?', [id], (err, result) => {
        if (err) return reject(err);
        resolve(result);
      });
    });
  },
};

module.exports = Produk;