import { fetchProducts } from './api.js';
import { calculateStatistics } from './stats.js';
import {
  renderProducts,
  initViewMode,
  setViewMode,
  updateFavBadge,
  toggleFavFilter
} from './ui.js';

let allProducts = [];

document.addEventListener('DOMContentLoaded', () => {
  initApp();
});

async function initApp() {
  const loadingEl = document.getElementById('loadingState');
  const errorEl = document.getElementById('errorState');
  const productContainer = document.getElementById('productContainer');

  initViewMode();

  try {
    loadingEl.style.display = 'block';
    errorEl.style.display = 'none';
    productContainer.style.display = 'none';

    // 1. Ambil data produk dari REST API
    allProducts = await fetchProducts();

    // 2. Hitung statistik produk
    calculateStatistics(allProducts);

    // 3. Render kartu produk dan badge angka favorit
    renderProducts(allProducts);
    updateFavBadge();

    loadingEl.style.display = 'none';
    productContainer.style.display = '';
  } catch (error) {
    loadingEl.style.display = 'none';
    errorEl.style.display = 'block';
    errorEl.innerHTML = `
      <p>Gagal memuat data produk: ${error.message}</p>
      <button id="btnRetry" class="btn-retry">Coba Lagi 🔄</button>
    `;
    document.getElementById('btnRetry')?.addEventListener('click', initApp);
  }

  setupEventListeners();
}

function setupEventListeners() {
  // Toggle Grid / List View
  document.getElementById('btnGrid')?.addEventListener('click', () => setViewMode('grid'));
  document.getElementById('btnList')?.addEventListener('click', () => setViewMode('list'));

  // Toggle Filter Favorit (Saat tombol angka favorit diklik)
  const favBadgeBtn = document.getElementById('favCountBadge')?.parentElement;
  favBadgeBtn?.addEventListener('click', (e) => {
    e.preventDefault();
    toggleFavFilter(allProducts);
  });

  // Validasi & Submit Form Saran
  document.getElementById('feedbackForm')?.addEventListener('submit', handleFormSubmit);
}

function handleFormSubmit(e) {
  e.preventDefault();

  const namaInput = document.getElementById('namaInput');
  const pesanInput = document.getElementById('pesanInput');
  const namaError = document.getElementById('namaError');
  const pesanError = document.getElementById('pesanError');
  const formAlert = document.getElementById('formAlert');

  // Reset pesan error
  namaError.textContent = '';
  pesanError.textContent = '';
  formAlert.style.display = 'none';

  const namaValue = namaInput.value.trim();
  const pesanValue = pesanInput.value.trim();
  let isValid = true;

  // Validasi Nama minimal 5 karakter (Sesuai Digit Z=5)
  if (namaValue.length < 5) {
    namaError.textContent = 'Nama pengirim wajib diisi minimal 5 karakter.';
    isValid = false;
  }

  // Validasi Pesan Saran tidak boleh kosong
  if (pesanValue === '') {
    pesanError.textContent = 'Pesan saran atau masukan tidak boleh kosong.';
    isValid = false;
  }

  // Jika Validasi Sukses
  if (isValid) {
    formAlert.className = 'alert success';
    formAlert.innerHTML = `Terima kasih <strong>${namaValue}</strong>! Saran dan masukan Anda telah berhasil dikirim.`;
    formAlert.style.display = 'block';

    // Reset isi form
    namaInput.value = '';
    pesanInput.value = '';
  }
}