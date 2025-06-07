document.addEventListener('DOMContentLoaded', () => {
  // === Toggle class active untuk hamburger menu ===
  const navbarNav = document.querySelector('.navbar-nav');
  const hamburgerMenu = document.querySelector('#hamburger-menu');
  if (hamburgerMenu && navbarNav) {
    hamburgerMenu.onclick = () => {
      navbarNav.classList.toggle('active');
    };
  }

  // === Toggle class active untuk search form ===
  const searchForm = document.querySelector('.search-form');
  const searchBox = document.querySelector('#search-box');
  const searchButton = document.querySelector('#search-button');
  if (searchForm && searchBox && searchButton) {
    searchButton.onclick = (e) => {
      searchForm.classList.toggle('active');
      searchBox.focus();
      e.preventDefault();
    };
  }

  // === Toggle class active untuk shopping cart ===
  const shoppingCart = document.querySelector('.shopping-cart');
  const shoppingCartButton = document.querySelector('#shopping-cart-button');
  if (shoppingCart && shoppingCartButton) {
    shoppingCartButton.onclick = (e) => {
      shoppingCart.classList.toggle('active');
      e.preventDefault();
    };
  }

  // === Klik di luar elemen untuk tutup ===
  document.addEventListener('click', function (e) {
    if (hamburgerMenu && navbarNav && !hamburgerMenu.contains(e.target) && !navbarNav.contains(e.target)) {
      navbarNav.classList.remove('active');
    }

    if (searchButton && searchForm && !searchButton.contains(e.target) && !searchForm.contains(e.target)) {
      searchForm.classList.remove('active');
    }

    if (shoppingCartButton && shoppingCart && !shoppingCartButton.contains(e.target) && !shoppingCart.contains(e.target)) {
      shoppingCart.classList.remove('active');
    }
  });

  // === Modal Box ===
  const itemDetailModal = document.querySelector('#item-detail-modal');
  const itemDetailButtons = document.querySelectorAll('.item-detail-button');
  if (itemDetailModal && itemDetailButtons.length > 0) {
    itemDetailButtons.forEach((btn) => {
      btn.onclick = (e) => {
        itemDetailModal.style.display = 'flex';
        e.preventDefault();
      };
    });

    const closeModal = document.querySelector('.modal .close-icon');
    if (closeModal) {
      closeModal.onclick = (e) => {
        itemDetailModal.style.display = 'none';
        e.preventDefault();
      };
    }

    window.onclick = (e) => {
      if (e.target === itemDetailModal) {
        itemDetailModal.style.display = 'none';
      }
    };
  }

 // === Login/Register Toggle ===
const container = document.getElementById('container');
const registerBtn = document.getElementById('register');
const loginBtn = document.getElementById('login');

if (container && registerBtn && loginBtn) {
  registerBtn.addEventListener('click', () => {
    container.classList.add('active');
  });

  loginBtn.addEventListener('click', () => {
    container.classList.remove('active');
  });
}

// === Register Handler ===
const registerForm = document.getElementById('register-form');
registerForm?.addEventListener('submit', async function (e) {
  e.preventDefault();

  const name = document.getElementById('register-name').value;
  const email = document.getElementById('register-email').value;
  const password = document.getElementById('register-password').value;

  if (!name || !email || !password) {
    alert('Semua field harus diisi!');
    return;
  }

  try {
    const res = await fetch('http://localhost:3000/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password })
    });

    const data = await res.json();
    if (res.ok) {
      alert('Pendaftaran berhasil! Silakan login.');
      container.classList.remove('active');
    } else {
      alert(data.message || 'Pendaftaran gagal');
    }
  } catch (err) {
    console.error(err);
    alert('Terjadi kesalahan saat mendaftar.');
  }
});

// === Login Handler ===
const loginForm = document.getElementById('login-form');
loginForm?.addEventListener('submit', async function (e) {
  e.preventDefault();

  const email = document.getElementById('login-email').value;
  const password = document.getElementById('login-password').value;

  if (!email || !password) {
    alert('Email dan Password harus diisi!');
    return;
  }

  try {
    const res = await fetch('http://localhost:3000/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();
    if (res.ok) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('userData', JSON.stringify(data.user));
      alert('Login berhasil!');
      window.location.href = 'profile.html';
    } else {
      alert(data.message || 'Login gagal');
    }
  } catch (err) {
    console.error(err);
    alert('Terjadi kesalahan saat login.');
  }
});




  // === SwiperJS ===
  if (typeof Swiper !== 'undefined') {
    new Swiper('.swiper', {
      loop: false,
      spaceBetween: 15,
      watchOverflow: true,
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
        dynamicBullets: true,
      },
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
      breakpoints: {
        1200: { slidesPerView: 4, spaceBetween: 15 },
        992: { slidesPerView: 3, spaceBetween: 10 },
        768: { slidesPerView: 2, spaceBetween: 5 },
        480: { slidesPerView: 1 },
      },
    });
  }
});
