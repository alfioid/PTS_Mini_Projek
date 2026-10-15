import { fetchProducts } from './api.js';
import { calculateStatistics } from './stats.js';
import {
  renderProducts,
  initViewMode,
  setViewMode,
  updateFavBadge
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

    // Fetch API dari DummyJSON
    allProducts = await fetchProducts();

    // Hitung statistik
    calculateStatistics(allProducts);

    // Render produk & update badge favorite
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

  // Search Real-time
  document.getElementById('searchInput')?.addEventListener('input', (e) => {
    const keyword = e.target.value.toLowerCase().trim();
    const filtered = allProducts.filter(p =>
      p.title.toLowerCase().includes(keyword) ||
      p.category.toLowerCase().includes(keyword)
    );
    renderProducts(filtered);
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

  // Validasi 1: Nama minimal 5 karakter (Sesuai Digit Z=5)
  if (namaValue.length < 5) {
    namaError.textContent = 'Nama pengirim wajib diisi minimal 5 karakter.';
    isValid = false;
  }

  // Validasi 2: Pesan saran tidak boleh kosong
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