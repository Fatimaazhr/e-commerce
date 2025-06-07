document.addEventListener('DOMContentLoaded', () => {
  // Ambil data user dari localStorage
  const userData = JSON.parse(localStorage.getItem('userData'));

  if (!userData || !userData.name || !userData.email) {
    alert('Anda belum login atau data tidak lengkap.');
    window.location.href = 'user.html';
    return;
  }

  // Tampilkan data user di profil (sesuai id html)
  const profileName = document.getElementById('profile-name');
  const profileNameDetail = document.getElementById('profile-name-detail');
  const profileEmail = document.getElementById('profile-email');
  const profileAddress = document.getElementById('profile-address');
  const profilePhone = document.getElementById('profile-phone');
  const profileBirthdate = document.getElementById('profile-birthdate');
  const profileGender = document.getElementById('profile-gender');

  if (profileName) profileName.textContent = userData.name || '-';
  if (profileNameDetail) profileNameDetail.textContent = userData.name || '-';
  if (profileEmail) profileEmail.textContent = userData.email || '-';
  if (profileAddress) profileAddress.textContent = userData.address || '-';
  if (profilePhone) profilePhone.textContent = userData.phone || '-';
  if (profileBirthdate) profileBirthdate.textContent = userData.birthdate || '-';
  if (profileGender) profileGender.textContent = userData.gender || '-';

  // Form dan input edit profil
  const profileView = document.getElementById('profile-view');
  const editProfileForm = document.getElementById('edit-profile-form');

  const editNameInput = document.getElementById('edit-name');
  const editEmailInput = document.getElementById('edit-email');
  const editAddressInput = document.getElementById('edit-address');
  const editPhoneInput = document.getElementById('edit-phone');
  const editBirthdateInput = document.getElementById('edit-birthdate');
  const editGenderInput = document.getElementById('edit-gender');

  if (editNameInput) editNameInput.value = userData.name || '';
  if (editEmailInput) editEmailInput.value = userData.email || '';
  if (editAddressInput) editAddressInput.value = userData.address || '';
  if (editPhoneInput) editPhoneInput.value = userData.phone || '';
  if (editBirthdateInput) editBirthdateInput.value = userData.birthdate || '';
  if (editGenderInput) editGenderInput.value = userData.gender || '';

  // Tombol edit profile: buka form edit
  const editBtn = document.querySelector('.edit-profile');
  if (editBtn && profileView && editProfileForm) {
    editBtn.addEventListener('click', () => {
      profileView.style.display = 'none';
      editProfileForm.style.display = 'block';
    });
  }

  // Tombol batal edit: kembali ke view profil
  const cancelBtn = document.getElementById('cancel-edit');
  if (cancelBtn && profileView && editProfileForm) {
    cancelBtn.addEventListener('click', () => {
      editProfileForm.style.display = 'none';
      profileView.style.display = 'block';
      // Reset input form ke data lama
      editNameInput.value = userData.name || '';
      editEmailInput.value = userData.email || '';
      editAddressInput.value = userData.address || '';
      editPhoneInput.value = userData.phone || '';
      editBirthdateInput.value = userData.birthdate || '';
      editGenderInput.value = userData.gender || '';
    });
  }

  // Submit form edit profil
  if (editProfileForm) {
    editProfileForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const submitBtn = editProfileForm.querySelector('button[type="submit"]');
      submitBtn.disabled = true;

      const name = editNameInput.value.trim();
      const email = editEmailInput.value.trim();
      const address = editAddressInput.value.trim();
      const phone = editPhoneInput.value.trim();
      const birthdate = editBirthdateInput.value.trim();
      const gender = editGenderInput.value.trim();

      if (!name || !email) {
        alert('Nama dan email tidak boleh kosong.');
        submitBtn.disabled = false;
        return;
      }

      const userDataStored = JSON.parse(localStorage.getItem('userData'));
      if (!userDataStored || !userDataStored.id) {
        alert('Data user tidak lengkap, silakan login ulang.');
        window.location.href = 'user.html';
        return;
      }

      try {
        const res = await fetch(`http://localhost:3000/api/users/${userDataStored.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem('token')
          },
          body: JSON.stringify({ name, email, address, phone, birthdate, gender })
        });

        const data = await res.json();

        if (!res.ok) {
          alert(data.message || 'Gagal update profil');
          submitBtn.disabled = false;
          return;
        }

        alert(data.message || 'Profil berhasil diperbarui');

        // Update localStorage dan UI
        const updatedUserData = { ...userDataStored, name, email, address, phone, birthdate, gender };
        localStorage.setItem('userData', JSON.stringify(updatedUserData));

        if (profileName) profileName.textContent = name;
        if (profileNameDetail) profileNameDetail.textContent = name;
        if (profileEmail) profileEmail.textContent = email;
        if (profileAddress) profileAddress.textContent = address || '-';
        if (profilePhone) profilePhone.textContent = phone || '-';
        if (profileBirthdate) profileBirthdate.textContent = birthdate || '-';
        if (profileGender) profileGender.textContent = gender || '-';

        editProfileForm.style.display = 'none';
        profileView.style.display = 'block';

      } catch (error) {
        console.error(error);
        alert('Gagal update profil');
      } finally {
        submitBtn.disabled = false;
      }
    });
  }

  // Tombol logout
  const logoutBtn = document.querySelector('.logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      if (confirm('Yakin ingin logout?')) {
        localStorage.removeItem('token');
        localStorage.removeItem('userData');
        window.location.href = 'user.html';
      }
    });
  }
});
