import { fetchProducts } from './api.js';
import { calculateStatistics } from './stats.js';
import {
  renderProducts,
  renderCartRows,
  addCartRow,
  initViewMode,
  setViewMode,
  updateFavBadge,
  getFavorites,
  getCartList,
  resetCartList
} from './ui.js';

// State aplikasi lokal
let allProducts = [];

// Inisialisasi saat DOM selesai dimuat
document.addEventListener('DOMContentLoaded', () => {
  initApp();
});

async function initApp() {
  const loadingEl = document.getElementById('loadingState');
  const errorEl = document.getElementById('errorState');
  const productContainer = document.getElementById('productContainer');

  // Set tampilan awal dari localStorage (Grid/List)
  initViewMode();

  try {
    loadingEl.style.display = 'block';
    errorEl.style.display = 'none';
    productContainer.style.display = 'none';

    // 1. Ambil data produk dari REST API DummyJSON
    allProducts = await fetchProducts();

    // 2. Tampilkan kalkulasi statistik
    calculateStatistics(allProducts);

    // 3. Render kartu produk dan opsi keranjang
    renderProducts(allProducts);
    updateFavBadge();
    renderCartRows(allProducts);

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

  // Bind Event Listeners
  setupEventListeners();
}

function setupEventListeners() {
  // Toggle Grid / List View
  document.getElementById('btnGrid')?.addEventListener('click', () => setViewMode('grid'));
  document.getElementById('btnList')?.addEventListener('click', () => setViewMode('list'));

  // Pencarian Real-time
  document.getElementById('searchInput')?.addEventListener('input', (e) => {
    const keyword = e.target.value.toLowerCase().trim();
    const filtered = allProducts.filter(p =>
      p.title.toLowerCase().includes(keyword) ||
      p.category.toLowerCase().includes(keyword)
    );
    renderProducts(filtered);
  });

  // Tombol Tambah Item Belanja Dinamis
  const addItemWrapper = document.querySelector('.add-item-wrapper');
  if (addItemWrapper && !document.getElementById('btnAddCartItem')) {
    const btnAdd = document.createElement('button');
    btnAdd.type = 'button';
    btnAdd.id = 'btnAddCartItem';
    btnAdd.className = 'btn-add-item';
    btnAdd.textContent = '+ Tambah Produk Lain';
    btnAdd.addEventListener('click', () => addCartRow(allProducts));
    addItemWrapper.appendChild(btnAdd);
  }

  // Validasi & Submit Form Pemesanan
  document.getElementById('orderForm')?.addEventListener('submit', handleFormSubmit);
}

function handleFormSubmit(e) {
  e.preventDefault();

  const namaInput = document.getElementById('namaInput');
  const namaError = document.getElementById('namaError');
  const formAlert = document.getElementById('formAlert');

  namaError.textContent = '';
  formAlert.style.display = 'none';

  const namaValue = namaInput.value.trim();

  // Validasi Nama minimal 5 karakter (Digit Z=5)
  if (namaValue.length < 5) {
    namaError.textContent = 'Nama pembeli wajib diisi minimal 5 karakter.';
    return;
  }

  const grandTotal = document.getElementById('grandTotalPrice').textContent;
  const totalQty = document.getElementById('totalQtyCount').textContent;

  formAlert.className = 'alert success';
  formAlert.innerHTML = `Pemesanan atas nama <strong>${namaValue}</strong> berhasil dikirim!<br>Total: <strong>${totalQty} barang</strong> dengan nominal <strong>Rp ${grandTotal}</strong>.`;
  formAlert.style.display = 'block';

  // Reset form setelah berhasil
  namaInput.value = '';
  resetCartList(allProducts);
}