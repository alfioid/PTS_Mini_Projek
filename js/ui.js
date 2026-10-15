let favorites = JSON.parse(localStorage.getItem('bepro_favorites')) || [];
let viewMode = localStorage.getItem('bepro_view_mode') || 'grid';

// State penanda apakah filter favorit sedang aktif
let isFavOnly = false;

// ==========================================
// 1. RENDER KATALOG PRODUK & FAVORITE
// ==========================================
export function renderProducts(products) {
  const container = document.getElementById('productContainer');
  const totalCountEl = document.getElementById('totalProdukCount');

  if (!container) return;
  container.innerHTML = '';

  // Filter produk jika mode 'Hanya Favorit' aktif
  let displayedProducts = products;
  if (isFavOnly) {
    displayedProducts = products.filter(p => favorites.includes(p.id));
  }

  if (totalCountEl) {
    totalCountEl.textContent = displayedProducts.length;
  }

  if (displayedProducts.length === 0) {
    container.innerHTML = isFavOnly 
      ? '<p class="state-message">Belum ada produk favorit yang disimpan.</p>'
      : '<p class="state-message">Tidak ada produk yang tersedia.</p>';
    return;
  }

  displayedProducts.forEach(item => {
    const isFav = favorites.includes(item.id);
    const card = document.createElement('div');
    card.className = 'product-card';

    card.innerHTML = `
      <img src="${item.image}" alt="${item.title}" class="product-img">
      <div class="card-body">
        <div class="card-top">
          <span class="category-tag">${item.category}</span>
          <button class="btn-fav ${isFav ? 'active' : ''}" data-id="${item.id}" title="Favorit">
            ${isFav ? '♥' : '♡'}
          </button>
        </div>
        <h3 class="product-title">${item.title}</h3>
        <div class="product-price">Rp ${item.price.toLocaleString('id-ID')}</div>
        <p class="product-desc">${item.description}</p>
      </div>
    `;

    // Event handler tombol hati di setiap kartu produk
    const favBtn = card.querySelector('.btn-fav');
    favBtn.addEventListener('click', () => toggleFavorite(item.id, products));

    container.appendChild(card);
  });
}

function toggleFavorite(id, currentProducts) {
  if (favorites.includes(id)) {
    favorites = favorites.filter(favId => favId !== id);
  } else {
    favorites.push(id);
  }
  localStorage.setItem('bepro_favorites', JSON.stringify(favorites));
  updateFavBadge();
  renderProducts(currentProducts);
}

export function updateFavBadge() {
  const badge = document.getElementById('favCountBadge');
  if (badge) badge.textContent = favorites.length;
}

// TOGGLE FILTER: TAMPILKAN HANYA FAVORIT ATAU SEMUA PRODUK
export function toggleFavFilter(allProducts) {
  isFavOnly = !isFavOnly;
  
  const badgeBtn = document.getElementById('favCountBadge')?.parentElement;
  if (badgeBtn) {
    if (isFavOnly) {
      badgeBtn.classList.add('active-filter');
    } else {
      badgeBtn.classList.remove('active-filter');
    }
  }

  renderProducts(allProducts);
}

// ==========================================
// 2. TOGGLE GRID / LIST (CHALLENGE LOCALSTORAGE)
// ==========================================
export function initViewMode() {
  setViewMode(viewMode);
}

export function setViewMode(mode) {
  viewMode = mode;
  localStorage.setItem('bepro_view_mode', mode);

  const container = document.getElementById('productContainer');
  const btnGrid = document.getElementById('btnGrid');
  const btnList = document.getElementById('btnList');

  if (container) {
    container.className = `product-container ${mode}-view`;
  }

  if (btnGrid && btnList) {
    if (mode === 'grid') {
      btnGrid.classList.add('active');
      btnList.classList.remove('active');
    } else {
      btnList.classList.add('active');
      btnGrid.classList.remove('active');
    }
  }
}