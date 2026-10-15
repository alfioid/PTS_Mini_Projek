// STATE LOKAL UNTUK FAVORIT, CART, DAN VIEW MODE
let favorites = JSON.parse(localStorage.getItem('bepro_favorites')) || [];
let viewMode = localStorage.getItem('bepro_view_mode') || 'grid';
let cartList = [];

// ==========================================
// 1. KATALOG PRODUK & FAVORITE
// ==========================================
export function renderProducts(products) {
  const container = document.getElementById('productContainer');
  const totalCountEl = document.getElementById('totalProdukCount');

  if (!container) return;
  container.innerHTML = '';

  if (totalCountEl) {
    totalCountEl.textContent = products.length;
  }

  if (products.length === 0) {
    container.innerHTML = '<p class="state-message">Tidak ada produk yang sesuai.</p>';
    return;
  }

  products.forEach(item => {
    const isFav = favorites.includes(item.id);
    const card = document.createElement('div');
    card.className = 'product-card';

    card.innerHTML = `
      <img src="${item.image}" alt="${item.title}" class="product-img">
      <div class="card-body">
        <div class="card-top">
          <span class="category-tag">${item.category}</span>
          <button class="btn-fav ${isFav ? 'active' : ''}" data-id="${item.id}">
            ${isFav ? '♥' : '♡'}
          </button>
        </div>
        <h3 class="product-title">${item.title}</h3>
        <div class="product-price">Rp ${item.price.toLocaleString('id-ID')}</div>
        <p class="product-desc">${item.description}</p>
      </div>
    `;

    // Event favorite per kartu
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

export function getFavorites() {
  return favorites;
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

// ==========================================
// 3. FORM BELANJA INTERAKTIF (KERANJANG DINAMIS)
// ==========================================
export function getCartList() {
  return cartList;
}

export function resetCartList(products) {
  if (!products || products.length === 0) return;
  cartList = [{ productId: products[0].id, qty: 1 }];
  renderCartRows(products);
}

export function addCartRow(products) {
  if (!products || products.length === 0) return;
  const usedIds = cartList.map(c => c.productId);
  const unusedProd = products.find(p => !usedIds.includes(p.id)) || products[0];

  cartList.push({ productId: unusedProd.id, qty: 1 });
  renderCartRows(products);
}

export function renderCartRows(products) {
  const container = document.getElementById('cartItemsContainer');
  if (!container || !products || products.length === 0) return;

  if (cartList.length === 0) {
    cartList = [{ productId: products[0].id, qty: 1 }];
  }

  container.innerHTML = '';

  let grandTotalQty = 0;
  let grandTotalPrice = 0;

  cartList.forEach((cartItem, index) => {
    const selectedProd = products.find(p => p.id === cartItem.productId) || products[0];
    const itemSubtotal = selectedProd ? selectedProd.price * cartItem.qty : 0;

    grandTotalQty += cartItem.qty;
    grandTotalPrice += itemSubtotal;

    const row = document.createElement('div');
    row.className = 'cart-row';

    let optionsHtml = '';
    products.forEach(p => {
      const isSelected = p.id === cartItem.productId ? 'selected' : '';
      optionsHtml += `<option value="${p.id}" ${isSelected}>${p.title} (Rp ${p.price.toLocaleString('id-ID')})</option>`;
    });

    row.innerHTML = `
      <select class="cart-select">
        ${optionsHtml}
      </select>
      <div class="qty-control">
        <button type="button" class="btn-qty btn-minus">-</button>
        <span class="qty-val">${cartItem.qty < 10 ? '0' + cartItem.qty : cartItem.qty}</span>
        <button type="button" class="btn-qty btn-plus">+</button>
      </div>
      <div class="item-subtotal">Rp ${itemSubtotal.toLocaleString('id-ID')}</div>
      ${cartList.length > 1 ? `<button type="button" class="btn-remove-row" title="Hapus">×</button>` : ''}
    `;

    // Event Handlers Baris Cart
    const selectEl = row.querySelector('.cart-select');
    selectEl.addEventListener('change', (e) => {
      cartList[index].productId = parseInt(e.target.value);
      renderCartRows(products);
    });

    row.querySelector('.btn-minus').addEventListener('click', () => {
      if (cartList[index].qty > 1) {
        cartList[index].qty--;
        renderCartRows(products);
      }
    });

    row.querySelector('.btn-plus').addEventListener('click', () => {
      cartList[index].qty++;
      renderCartRows(products);
    });

    const removeBtn = row.querySelector('.btn-remove-row');
    if (removeBtn) {
      removeBtn.addEventListener('click', () => {
        cartList.splice(index, 1);
        renderCartRows(products);
      });
    }

    container.appendChild(row);
  });

  // Update elemen ringkasan total
  const elQty = document.getElementById('totalQtyCount');
  const elPrice = document.getElementById('grandTotalPrice');
  if (elQty) elQty.textContent = grandTotalQty;
  if (elPrice) elPrice.textContent = grandTotalPrice.toLocaleString('id-ID');
}