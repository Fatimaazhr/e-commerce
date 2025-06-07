document.addEventListener('alpine:init', () => {
  // Store untuk produk
  Alpine.store('products', {
    items: [],
    async fetch() {
      try {
        const res = await fetch('http://localhost:3000/api/product');
        const data = await res.json();
        this.items = data.map(item => ({
          id: item.id,
          nama: item.nama,
          harga: item.harga,
          deskripsi: item.deskripsi,
          stock: item.stock,
          gambar: item.gambar,  // pastikan backend kirim 'gambar' juga
          created_at: item.created_at,
          price: parseInt(item.harga)
        }));
      } catch (error) {
        console.error('Gagal fetch produk:', error);
      }
    }
  });

  // Ambil data produk saat Alpine diinisialisasi
  Alpine.store('products').fetch();

  // Store untuk keranjang belanja
  Alpine.store('cart', {
  items: [],
  total: 0,
  quantity: 0,

  add(newProduct) {
    const found = this.items.find(p => p.id === newProduct.id);
    if (!found) {
      this.items.push({ ...newProduct, quantity: 1, total: newProduct.price });
    } else {
      found.quantity++;
      found.total = found.price * found.quantity;
    }
    this.recalculate();
    this.save();
  },

  remove(id) {
    const found = this.items.find(p => p.id === id);
    if (!found) return;

    if (found.quantity > 1) {
      found.quantity--;
      found.total = found.price * found.quantity;
    } else {
      this.items = this.items.filter(p => p.id !== id);
    }

    this.recalculate();
    this.save();
  },

  removeAll(id) {
    this.items = this.items.filter(p => p.id !== id);
    this.recalculate();
    this.save();
  },

  recalculate() {
    this.total = this.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    this.quantity = this.items.reduce((sum, item) => sum + item.quantity, 0);
  },

  save() {
    localStorage.setItem('cart', JSON.stringify({
      items: this.items,
      total: this.total,
      quantity: this.quantity
    }));
  },

  init() {
    const saved = JSON.parse(localStorage.getItem('cart'));
    if (saved) {
      this.items = saved.items || [];
      this.total = saved.total || 0;
      this.quantity = saved.quantity || 0;
    }
    this.recalculate(); // Tambahkan ini agar konsisten saat load dari localStorage
  }
});

  // Inisialisasi cart dari localStorage
  Alpine.store('cart').init();

  // Komponen untuk halaman detail produk
  Alpine.data('detailProduk', () => ({
    items: {},

    init() {
      const id = parseInt(new URLSearchParams(window.location.search).get('id'));

      const getItem = () => {
        const found = Alpine.store('products').items.find(p => p.id === id);
        if (found) {
          this.items = found;
        } else {
          // Tunggu jika data belum tersedia
          setTimeout(getItem, 200);
        }
      };

      getItem();
    },

    belanjaSekarang() {
      Alpine.store('cart').add(this.items);
      window.location.href = 'cart.html';
    }
  }));
});

// Fungsi format rupiah supaya bisa dipakai di HTML
const rupiah = number => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(number);
};

window.formatCurrency = rupiah;
