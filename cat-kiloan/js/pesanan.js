// Modal functionality
const statusButtons = document.querySelectorAll('.status-button');
const modal = document.getElementById('status-modal');
const closeButton = document.querySelector('.close-button');

statusButtons.forEach(button => {
    button.addEventListener('click', () => {
        modal.style.display = 'flex';
    });
});

closeButton.addEventListener('click', () => {
    modal.style.display = 'none';
});

window.addEventListener('click', (event) => {
    if (event.target === modal) {
        modal.style.display = 'none';
    }
});

// Filter functionality (basic example)
const filterButton = document.querySelector('.filter-button');
const resetButton = document.querySelector('.reset-button');
const statusFilter = document.getElementById('status-filter');
const dateFilter = document.getElementById('date-filter');

filterButton.addEventListener('click', () => {
    const status = statusFilter.value;
    const date = dateFilter.value;
    
    // In a real application, you would filter the table data here
    console.log(`Filtering by status: ${status}, date: ${date}`);
});

resetButton.addEventListener('click', () => {
    statusFilter.value = 'all';
    dateFilter.value = '';
});

// Detail button functionality (basic example)
const detailButtons = document.querySelectorAll('.detail-button');
detailButtons.forEach(button => {
    button.addEventListener('click', () => {
        const row = button.closest('tr');
        const orderId = row.cells[0].textContent;
        alert(`Menampilkan detail untuk pesanan: ${orderId}`);
    });
});