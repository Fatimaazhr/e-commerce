// Toggle sidebar on mobile
const toggleBtn = document.getElementById('toggleSidebar');
if (toggleBtn) {
    toggleBtn.addEventListener('click', function () {
        document.getElementById('sidebar').classList.toggle('active');
    });
}

// Initialize charts
document.addEventListener('DOMContentLoaded', function () {
    // Revenue Chart
    const revenueCtx = document.getElementById('revenueChart').getContext('2d');
    const revenueChart = new Chart(revenueCtx, {
        type: 'line',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'],
            datasets: [{
                label: 'Pendapatan (Juta Rp)',
                data: [8.2, 9.5, 10.2, 12.8, 11.5, 14.2, 15.8, 16.5, 14.9, 17.2, 18.5, 20.1],
                borderColor: '#4361ee',
                backgroundColor: 'rgba(67, 97, 238, 0.1)',
                borderWidth: 3,
                tension: 0.3,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        drawBorder: false
                    }
                },
                x: {
                    grid: {
                        display: false
                    }
                }
            }
        }
    });

    // Tambahkan event listener logout
            const logoutBtn = document.getElementById('logoutBtn');
            if (logoutBtn) {
                logoutBtn.addEventListener('click', () => {
                    const confirmLogout = confirm("Yakin ingin logout?");
                    if (confirmLogout) {
                        // Tambahkan class untuk efek visual (warna merah & teks putih)
                        logoutBtn.classList.add('logout-active');

                        // Hapus token dari localStorage
                        localStorage.removeItem('token');
                        localStorage.removeItem('isAdminLoggedIn');

                        // Redirect setelah sedikit jeda agar efek terlihat
                        setTimeout(() => {
                            window.location.href = 'log-admin.html';
                        }, 500); // 0.5 detik
                    }
                });
            }

    // Status Pesanan (Doughnut Chart)
    const orderStatusCtx = document.getElementById('orderStatusChart').getContext('2d');
    new Chart(orderStatusCtx, {
        type: 'doughnut',
        data: {
            labels: ['Diproses', 'Selesai', 'Batal'],
            datasets: [{
                data: [45, 120, 10],
                backgroundColor: ['#4361ee', '#4cc9f0', '#f72585'],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '70%',
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });

    // Add animation to stats cards
    const statCards = document.querySelectorAll('.stat-card');
    statCards.forEach(card => {
        card.addEventListener('mouseenter', function () {
            this.style.transform = 'translateY(-5px)';
        });

        card.addEventListener('mouseleave', function () {
            this.style.transform = 'translateY(0)';
        });
    });
});
