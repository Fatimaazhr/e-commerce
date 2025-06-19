// === MODAL FUNCTIONALITY ===
const statusButtons = document.querySelectorAll('.status-button'); // tombol pembuka modal
const modal = document.getElementById('historyModal'); // modal utama
const orderHistory = document.getElementById('orderHistory');
const closeButton = document.querySelector('.close'); // tombol tutup

if (modal && closeButton) {
    statusButtons.forEach(button => {
        button.addEventListener('click', () => {
            modal.style.display = 'flex';

            // Ambil data dari atribut
            const name = button.getAttribute('data-name');
            const email = button.getAttribute('data-email');
            const phone = button.getAttribute('data-phone');
            const joinDate = button.getAttribute('data-join');
            const ordersJSON = button.getAttribute('data-orders');

            // Tampilkan info pelanggan
            document.getElementById('customerNameTitle').textContent = `Riwayat Pesanan - ${name}`;
            document.getElementById('customerInfo').innerHTML = `
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Telepon:</strong> ${phone}</p>
                <p><strong>Tanggal Bergabung:</strong> ${joinDate}</p>
            `;

            // Tampilkan riwayat pesanan
            const orderHistory = document.getElementById('orderHistory');
            try {
                const orders = JSON.parse(ordersJSON);
                if (Array.isArray(orders) && orders.length > 0) {
                    orderHistory.innerHTML = '<ul>' + orders.map(order => `
                        <li>Produk: ${order.produk} — Tanggal: ${order.tanggal}</li>
                    `).join('') + '</ul>';
                } else {
                    orderHistory.innerHTML = '<p>Tidak ada riwayat pesanan.</p>';
                }
            } catch (err) {
                orderHistory.innerHTML = '<p>Gagal memuat riwayat pesanan.</p>';
            }
        });
    });

    // Tutup modal saat klik tombol "x"
    closeButton.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    // Tutup modal saat klik di luar konten
    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
}

// === FILTER FUNCTIONALITY (jika kamu pakai fitur filter) ===
const filterButton = document.querySelector('.filter-button');
const resetButton = document.querySelector('.reset-button');
const statusFilter = document.getElementById('status-filter');
const dateFilter = document.getElementById('date-filter');

if (filterButton && resetButton && statusFilter && dateFilter) {
    filterButton.addEventListener('click', () => {
        const status = statusFilter.value;
        const date = dateFilter.value;
        console.log(`Filtering by status: ${status}, date: ${date}`);
    });

    resetButton.addEventListener('click', () => {
        statusFilter.value = 'all';
        dateFilter.value = '';
    });
}

// === DETAIL BUTTON FUNCTIONALITY (opsional) ===
const detailButtons = document.querySelectorAll('.detail-button');
detailButtons.forEach(button => {
    button.addEventListener('click', () => {
        const row = button.closest('tr');
        const orderId = row.cells[0].textContent;
        alert(`Menampilkan detail untuk pesanan: ${orderId}`);
    });
});
