function dashboard() {
    return {
        products: [],
        showAddModal: false,
        showEditModal: false,
        showDeleteModal: false,
        showAlert: false,
        alertMessage: '',
        alertType: '',
        alertIcon: '',
        newItem: {
            nama: '',
            harga: 0,
            stock: 0,
            deskripsi: '',
            gambar: null,
            preview: null,
        },
        editedItem: {
            id: null,
            nama: '',
            harga: 0,
            stock: 0,
            deskripsi: '',
            gambar: null,
            gambarPreview: null,
        },
        deleteIndex: null,

        async fetchProducts() {
            try {
                const response = await fetch('http://localhost:3000/api/product');
                if (!response.ok) throw new Error('Gagal memuat data produk');
                this.products = await response.json();

                if (!window.$store) window.$store = {};
                window.$store.products = { items: this.products };

            } catch (error) {
                this.showAlertMessage(error.message, 'error');
            }
        },

        formatCurrency(value) {
            return new Intl.NumberFormat('id-ID', {
                style: 'currency',
                currency: 'IDR'
            }).format(value);
        },

        openAddModal() {
            this.showAddModal = true;
            this.resetNewItem();
        },

        closeAddModal() {
            this.showAddModal = false;
            this.resetNewItem();
        },

        resetNewItem() {
            this.newItem = {
                nama: '',
                harga: 0,
                stock: 0,
                deskripsi: '',
                gambar: null,
                preview: null,
            };
        },

        handleImageUpload(event, target) {
            const file = event.target.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = (e) => {
                if (target === 'newItem') {
                    this.newItem.gambar = file;
                    this.newItem.preview = e.target.result;
                } else if (target === 'editedItem') {
                    this.editedItem.gambar = file;
                    this.editedItem.gambarPreview = e.target.result;
                }
            };
            reader.readAsDataURL(file);
        },

        async addItem() {
            try {
                const formData = new FormData();
                formData.append('nama', this.newItem.nama);
                formData.append('harga', this.newItem.harga);
                formData.append('stock', this.newItem.stock);
                formData.append('deskripsi', this.newItem.deskripsi);
                if (this.newItem.gambar) formData.append('gambar', this.newItem.gambar);

                const response = await fetch('http://localhost:3000/api/product', {
                    method: 'POST',
                    body: formData,
                });

                if (!response.ok) throw new Error('Gagal menambah produk');

                const created = await response.json();
                this.products.push(created);
                window.$store.products.items = this.products;
                this.showAlertMessage('Produk berhasil ditambahkan', 'success');
                this.closeAddModal();

            } catch (error) {
                this.showAlertMessage(error.message, 'error');
            }
        },

        openEditModal(index) {
            const item = this.products[index];
            this.editedItem = {
                id: item.id,
                nama: item.nama,
                harga: item.harga,
                stock: item.stock,
                deskripsi: item.deskripsi,
                gambar: null,
                gambarPreview: item.gambar.startsWith('/image/')
                    ? 'http://localhost:3000' + item.gambar
                    : 'http://localhost:3000/image/' + item.gambar,
            };
            this.showEditModal = true;
        },

        closeEditModal() {
            this.showEditModal = false;
            this.editedItem = {
                id: null,
                nama: '',
                harga: 0,
                stock: 0,
                deskripsi: '',
                gambar: null,
                gambarPreview: null,
            };
        },

        async updateItem() {
            try {
                const formData = new FormData();
                formData.append('nama', this.editedItem.nama);
                formData.append('harga', this.editedItem.harga);
                formData.append('stock', this.editedItem.stock);
                formData.append('deskripsi', this.editedItem.deskripsi);
                if (this.editedItem.gambar) formData.append('gambar', this.editedItem.gambar);

                const response = await fetch(`http://localhost:3000/api/product/${this.editedItem.id}`, {
                    method: 'PUT',
                    body: formData,
                });

                if (!response.ok) throw new Error('Gagal memperbarui produk');

                const updated = await response.json();

                const index = this.products.findIndex(p => p.id === updated.id);
                if (index !== -1) {
                    this.products[index] = updated;
                    window.$store.products.items = this.products;
                }

                this.showAlertMessage('Produk berhasil diperbarui', 'success');
                this.closeEditModal();

            } catch (error) {
                this.showAlertMessage(error.message, 'error');
            }
        },

        confirmDelete(index) {
            this.deleteIndex = index;
            this.showDeleteModal = true;
        },

        closeDeleteModal() {
            this.showDeleteModal = false;
            this.deleteIndex = null;
        },

        async deleteItem() {
            try {
                const product = this.products[this.deleteIndex];
                const response = await fetch(`http://localhost:3000/api/product/${product.id}`, {
                    method: 'DELETE',
                });
                if (!response.ok) throw new Error('Gagal menghapus produk');

                this.products.splice(this.deleteIndex, 1);
                window.$store.products.items = this.products;
                this.showAlertMessage('Produk berhasil dihapus', 'success');
                this.closeDeleteModal();

            } catch (error) {
                this.showAlertMessage(error.message, 'error');
            }
        },

        showAlertMessage(message, type) {
            this.alertMessage = message;
            this.alertType = type === 'success' ? 'alert-success' : 'alert-error';
            this.alertIcon = type === 'success' ? 'fas fa-check-circle' : 'fas fa-exclamation-circle';
            this.showAlert = true;

            setTimeout(() => {
                this.showAlert = false;
            }, 3000);
        }
    }
}
