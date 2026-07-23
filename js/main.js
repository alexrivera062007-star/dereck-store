/* ===== DERECK MAIN.JS ===== */

const WHATSAPP_NUMBER = "51970530749";

// --- State ---
let cart = JSON.parse(localStorage.getItem('dereckCart') || '[]');
let wishlist = JSON.parse(localStorage.getItem('dereckWishlist') || '[]');
let currentProduct = null;
let modalQty = 1;

// --- Init ---
document.addEventListener('DOMContentLoaded', () => {
  updateCartBadge();
  updateWishlistBadge();
  restoreWishlistHearts();
  initFilters();
  initSort();
  initHamburger();
  initSearch();

  // Make entire product card clickable to open modal
  document.querySelectorAll('.product-card').forEach(card => {
    card.style.cursor = 'pointer';
    card.addEventListener('click', (e) => {
      // Don't trigger if clicking wishlist heart or quick-add button directly
      if (e.target.closest('.heart-btn')) return;
      openProductModal(card.querySelector('.quick-add') || card);
    });
  });

  document.getElementById('cartToggle')?.addEventListener('click', openCart);
  document.querySelector('.wishlist-btn')?.addEventListener('click', openWishlist);
});

// --- Hamburger ---
function initHamburger() {
  const btn = document.getElementById('hamburgerBtn');
  const nav = document.getElementById('navMobile');
  if (!btn || !nav) return;
  btn.addEventListener('click', () => nav.classList.toggle('open'));
}

// --- Search ---
function initSearch() {
  const searchBtn = document.getElementById('searchBtn');
  const searchBar = document.getElementById('searchBar');
  const searchInput = document.getElementById('searchInput');
  if (!searchBtn) return;
  searchBtn.addEventListener('click', () => {
    searchBar.classList.toggle('active');
    if (searchBar.classList.contains('active')) searchInput.focus();
  });
  searchInput?.addEventListener('input', () => {
    const q = searchInput.value.toLowerCase();
    document.querySelectorAll('.product-card').forEach(card => {
      const name = card.querySelector('.product-name')?.textContent.toLowerCase() || '';
      card.classList.toggle('hidden', q.length > 0 && !name.includes(q));
    });
  });
}

// --- Filters ---
function initFilters() {
  document.querySelectorAll('.pill').forEach(pill => {
    pill.addEventListener('click', () => {
      document.querySelectorAll('.pill').forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      applyFilter(pill.dataset.filter);
    });
  });
}

function applyFilter(filter) {
  document.querySelectorAll('.product-card').forEach(card => {
    const cats = card.dataset.category || '';
    card.classList.toggle('hidden', filter !== 'all' && !cats.includes(filter));
  });
}

function filterCategory(cat) {
  document.querySelectorAll('.pill').forEach(p => {
    p.classList.toggle('active', p.dataset.filter === cat);
  });
  applyFilter(cat);
  setTimeout(() => document.getElementById('nuevos')?.scrollIntoView({ behavior: 'smooth' }), 100);
}

function verOfertas(e) {
  e.preventDefault();
  // Activate the "oferta" filter pill
  document.querySelectorAll('.pill').forEach(p => {
    p.classList.toggle('active', p.dataset.filter === 'oferta');
  });
  applyFilter('oferta');
  // Scroll smoothly to the products section
  setTimeout(() => {
    document.getElementById('nuevos')?.scrollIntoView({ behavior: 'smooth' });
  }, 80);
}

// --- Sort ---
function initSort() {
  const sel = document.getElementById('sortSelect');
  if (!sel) return;
  sel.addEventListener('change', () => {
    const grid = document.getElementById('productsGrid');
    if (!grid) return;
    const cards = Array.from(grid.querySelectorAll('.product-card'));
    cards.sort((a, b) => {
      const va = parseFloat(a.dataset.price), vb = parseFloat(b.dataset.price);
      const na = a.querySelector('.product-name')?.textContent || '';
      const nb = b.querySelector('.product-name')?.textContent || '';
      if (sel.value === 'price-asc') return va - vb;
      if (sel.value === 'price-desc') return vb - va;
      if (sel.value === 'name') return na.localeCompare(nb);
      return 0;
    });
    cards.forEach(c => grid.appendChild(c));
  });
}

// ============================================================
// WISHLIST — guarda nombre + imagen + precio de cada producto
// ============================================================
function toggleWishlist(btn) {
  const card = btn.closest('.product-card');
  if (!card) return;

  const name = card.dataset.name;
  const price = card.dataset.price;
  const img = card.dataset.img || null;

  const icon = btn.querySelector('i');
  const idx = wishlist.findIndex(w => w.name === name);

  if (idx === -1) {
    // Agregar
    wishlist.push({ name, price: parseFloat(price), img });
    btn.classList.add('active');
    icon.classList.replace('far', 'fas');
    showToast(`"${name}" guardado en favoritos ♥`);
  } else {
    // Quitar
    wishlist.splice(idx, 1);
    btn.classList.remove('active');
    icon.classList.replace('fas', 'far');
    showToast(`"${name}" eliminado de favoritos`);
  }

  localStorage.setItem('dereckWishlist', JSON.stringify(wishlist));
  updateWishlistBadge();
}

function updateWishlistBadge() {
  const badge = document.getElementById('wishlistCount');
  if (badge) badge.textContent = wishlist.length;
}

// Restaurar corazones al cargar la página
function restoreWishlistHearts() {
  document.querySelectorAll('.product-card').forEach(card => {
    const name = card.dataset.name;
    const inWishlist = wishlist.some(w => w.name === name);
    if (inWishlist) {
      const btn = card.querySelector('.wishlist-heart');
      if (btn) {
        btn.classList.add('active');
        const icon = btn.querySelector('i');
        icon?.classList.replace('far', 'fas');
      }
    }
  });
}

// Abrir sidebar de wishlist
function openWishlist() {
  renderWishlistItems();
  document.getElementById('wishlistSidebar')?.classList.add('open');
  document.getElementById('wishlistOverlay')?.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeWishlist() {
  document.getElementById('wishlistSidebar')?.classList.remove('open');
  document.getElementById('wishlistOverlay')?.classList.remove('open');
  document.body.style.overflow = '';
}

function renderWishlistItems() {
  const container = document.getElementById('wishlistItems');
  if (!container) return;

  if (wishlist.length === 0) {
    container.innerHTML = `
      <div class="cart-empty">
        <i class="fas fa-heart"></i>
        <p>No tienes favoritos aún</p>
        <a href="#nuevos" class="btn btn-primary" onclick="closeWishlist()">Ver Productos</a>
      </div>`;
    return;
  }

  container.innerHTML = wishlist.map((item, i) => `
    <div class="cart-item">
      <div class="cart-item-img">
        ${item.img
          ? `<img src="${item.img}" alt="${item.name}" style="width:100%;height:100%;object-fit:cover;border-radius:4px"/>`
          : `<i class="fas fa-tshirt" style="font-size:1.4rem"></i>`}
      </div>
      <div class="cart-item-info">
        <p class="cart-item-name">${item.name}</p>
        <p class="cart-item-price">S/ ${item.price.toFixed(2)}</p>
      </div>
      <div style="display:flex;flex-direction:column;gap:6px;align-items:center">
        <button class="cart-item-remove" onclick="removeFromWishlist(${i})" aria-label="Eliminar favorito" title="Quitar">
          <i class="fas fa-heart-broken"></i>
        </button>
        <button class="cart-item-remove" onclick="addToCartFromWishlist(${i})" aria-label="Agregar al carrito" title="Al carrito" style="color:var(--bronze)">
          <i class="fas fa-shopping-bag"></i>
        </button>
      </div>
    </div>
  `).join('');
}

function removeFromWishlist(index) {
  const name = wishlist[index].name;
  wishlist.splice(index, 1);
  localStorage.setItem('dereckWishlist', JSON.stringify(wishlist));
  updateWishlistBadge();
  renderWishlistItems();
  // Actualizar corazón en la tarjeta
  document.querySelectorAll('.product-card').forEach(card => {
    if (card.dataset.name === name) {
      const btn = card.querySelector('.wishlist-heart');
      btn?.classList.remove('active');
      btn?.querySelector('i')?.classList.replace('fas', 'far');
    }
  });
}

function addToCartFromWishlist(index) {
  const item = wishlist[index];
  showToast(`Selecciona talla y color para "${item.name}"`);
  closeWishlist();
  // Buscar la tarjeta en el grid y abrir su modal
  setTimeout(() => {
    const card = Array.from(document.querySelectorAll('.product-card'))
      .find(c => c.dataset.name === item.name);
    if (card) {
      const btn = card.querySelector('.quick-add');
      if (btn) openProductModal(btn);
    }
  }, 350);
}

// ============================================================
// PRODUCT MODAL
// ============================================================
// Map of common color names (ES/EN) to hex values for swatches
const COLOR_MAP = {
  'negro': '#111111', 'black': '#111111',
  'blanco': '#ffffff', 'white': '#f5f5f5',
  'rojo': '#e53935', 'red': '#e53935',
  'azul': '#1565c0', 'blue': '#1565c0',
  'azul marino': '#0d1b4b', 'marino': '#0d1b4b', 'navy': '#0d1b4b',
  'verde': '#2e7d32', 'green': '#2e7d32',
  'verde olivo': '#6d7c2f', 'olivo': '#6d7c2f', 'olive': '#6d7c2f',
  'amarillo': '#f9a825', 'yellow': '#f9a825',
  'naranja': '#e65100', 'orange': '#e65100',
  'rosado': '#e91e8c', 'rosa': '#e91e8c', 'pink': '#e91e8c',
  'morado': '#6a1b9a', 'purple': '#6a1b9a', 'lila': '#ab47bc',
  'gris': '#757575', 'gray': '#757575', 'grey': '#757575',
  'gris claro': '#bdbdbd', 'plomo': '#9e9e9e',
  'beige': '#d4b896', 'crema': '#f5e6d3',
  'café': '#5d4037', 'camel': '#c19a6b', 'marrón': '#795548', 'marron': '#795548',
  'khaki': '#bfaf72', 'caqui': '#bfaf72',
  'celeste': '#29b6f6', 'turquesa': '#00897b',
  'coral': '#ff7043', 'salmon': '#ff8a65',
  'único': null, 'unico': null, 'única': null, 'unica': null,
};

function getColorHex(name) {
  return COLOR_MAP[name.toLowerCase().trim()] || null;
}

function updateModalSummary() {
  if (!currentProduct) return;
  document.getElementById('modalQty').textContent = modalQty;
  document.getElementById('sumName').textContent = currentProduct.name;
  const sz = currentProduct.selectedSize || '—';
  const cl = currentProduct.selectedColor || '—';
  document.getElementById('sumOptions').textContent = `${sz} · ${cl}`;
  document.getElementById('sumQty').textContent = modalQty;
  document.getElementById('sumTotal').textContent = `S/ ${(currentProduct.price * modalQty).toFixed(2)}`;
  document.getElementById('modalSelectedSize').textContent = currentProduct.selectedSize || '— elige una';
  document.getElementById('modalSelectedColor').textContent = currentProduct.selectedColor || '— elige uno';
}

function openProductModal(btn) {
  const card = btn.closest('.product-card');
  if (!card) return;

  currentProduct = {
    name: card.dataset.name,
    price: parseFloat(card.dataset.price),
    original: card.dataset.original ? parseFloat(card.dataset.original) : null,
    colors: (card.dataset.colors || 'Único').split(',').map(c => c.trim()),
    sizes: (card.dataset.sizes || 'Única').split(',').map(s => s.trim()),
    selectedColor: null,
    selectedSize: null,
    imgSrc: card.dataset.img || card.querySelector('img.product-img')?.getAttribute('src') || null
  };
  modalQty = 1;

  document.getElementById('modalProductName').textContent = currentProduct.name;
  document.getElementById('modalProductPrice').textContent = `S/ ${currentProduct.price.toFixed(2)}`;

  const origEl = document.getElementById('modalOriginalPrice');
  origEl.innerHTML = currentProduct.original
    ? `<s style="color:var(--gray-400);font-weight:400;font-size:0.88rem">S/ ${currentProduct.original}</s>`
    : '';

  const modalImgWrap = document.getElementById('modalImgWrap');
  if (currentProduct.imgSrc) {
    modalImgWrap.classList.remove('placeholder-img');
    modalImgWrap.innerHTML = `<img src="${currentProduct.imgSrc}" alt="${currentProduct.name}" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:center top;display:block;"/>`;
  } else {
    modalImgWrap.classList.add('placeholder-img');
    modalImgWrap.innerHTML = `<i class="fas fa-image"></i><span>Sin imagen</span>`;
  }

  // Sizes
  const sizesWrap = document.getElementById('modalSizes');
  sizesWrap.innerHTML = currentProduct.sizes.map(s =>
    `<button class="option-btn" onclick="selectOption('size','${s}',this)">${s}</button>`
  ).join('');

  // Colors — swatches when hex known, pill text otherwise
  const colorsWrap = document.getElementById('modalColors');
  colorsWrap.innerHTML = currentProduct.colors.map(c => {
    const hex = getColorHex(c);
    if (hex) {
      const border = c.toLowerCase().includes('blanco') || c.toLowerCase().includes('white')
        ? 'border:1.5px solid #ddd;'
        : '';
      return `<button class="color-swatch-btn" style="background:${hex};${border}" title="${c}" onclick="selectOption('color','${c}',this)"></button>`;
    }
    return `<button class="color-text-btn" onclick="selectOption('color','${c}',this)">${c}</button>`;
  }).join('');

  // Auto-select if only one option
  if (currentProduct.sizes.length === 1) {
    currentProduct.selectedSize = currentProduct.sizes[0];
    sizesWrap.querySelector('button')?.classList.add('selected');
  }
  if (currentProduct.colors.length === 1) {
    currentProduct.selectedColor = currentProduct.colors[0];
    colorsWrap.querySelector('button')?.classList.add('selected');
  }

  updateModalSummary();

  document.getElementById('productModal').classList.add('open');
  document.getElementById('productModalOverlay').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeProductModal() {
  document.getElementById('productModal').classList.remove('open');
  document.getElementById('productModalOverlay').classList.remove('open');
  document.body.style.overflow = '';
  currentProduct = null;
}

function selectOption(type, value, btn) {
  const wrapId = type === 'size' ? 'modalSizes' : 'modalColors';
  document.getElementById(wrapId).querySelectorAll('button').forEach(b => b.classList.remove('selected'));
  btn.classList.add('selected');
  if (type === 'size') currentProduct.selectedSize = value;
  if (type === 'color') currentProduct.selectedColor = value;
  updateModalSummary();
}

function changeQty(delta) {
  modalQty = Math.max(1, modalQty + delta);
  updateModalSummary();
}

function validateSelection() {
  if (!currentProduct.selectedSize) { showToast('Por favor selecciona una talla'); return false; }
  if (!currentProduct.selectedColor) { showToast('Por favor selecciona un color'); return false; }
  return true;
}

// ============================================================
// CART
// ============================================================
function sendToCart() {
  if (!validateSelection()) return;

  const existing = cart.find(i =>
    i.name === currentProduct.name &&
    i.size === currentProduct.selectedSize &&
    i.color === currentProduct.selectedColor
  );

  if (existing) {
    existing.qty += modalQty;
  } else {
    cart.push({
      name: currentProduct.name,
      price: currentProduct.price,
      size: currentProduct.selectedSize,
      color: currentProduct.selectedColor,
      qty: modalQty,
      img: currentProduct.imgSrc
    });
  }

  saveCart();
  updateCartBadge();
  closeProductModal();
  showToast(`"${currentProduct.name}" agregado al carrito ✓`);
}

function buyNowWhatsApp() {
  if (!validateSelection()) return;
  const total = currentProduct.price * modalQty;
  const msg = `Hola DERECK 👋%0A%0AQuiero comprar:%0A` +
    `🛍️ *${currentProduct.name}*%0A` +
    `▫️ Talla: ${currentProduct.selectedSize}%0A` +
    `▫️ Color: ${currentProduct.selectedColor}%0A` +
    `▫️ Cantidad: ${modalQty}%0A` +
    `▫️ Precio: S/ ${total.toFixed(2)}%0A%0A¿Está disponible?`;
  window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`, '_blank');
  closeProductModal();
}

function removeFromCart(index) {
  cart.splice(index, 1);
  saveCart();
  updateCartBadge();
  renderCartItems();
}

function saveCart() {
  localStorage.setItem('dereckCart', JSON.stringify(cart));
}

function updateCartBadge() {
  const total = cart.reduce((s, i) => s + i.qty, 0);
  const badge = document.getElementById('cartCount');
  if (badge) badge.textContent = total;
}

function renderCartItems() {
  const container = document.getElementById('cartItems');
  const footer = document.getElementById('cartFooter');
  if (!container) return;

  if (cart.length === 0) {
    container.innerHTML = `
      <div class="cart-empty">
        <i class="fas fa-shopping-bag"></i>
        <p>Tu carrito está vacío</p>
        <a href="#nuevos" class="btn btn-primary" onclick="closeCart()">Ver Productos</a>
      </div>`;
    if (footer) footer.style.display = 'none';
    return;
  }

  container.innerHTML = cart.map((item, i) => `
    <div class="cart-item">
      <div class="cart-item-img">
        ${item.img
          ? `<img src="${item.img}" alt="${item.name}" style="width:100%;height:100%;object-fit:cover;border-radius:4px"/>`
          : `<i class="fas fa-tshirt" style="font-size:1.4rem"></i>`}
      </div>
      <div class="cart-item-info">
        <p class="cart-item-name">${item.name}</p>
        <p class="cart-item-meta">Talla: ${item.size} · Color: ${item.color}</p>
        <p class="cart-item-price">S/ ${item.price} × ${item.qty}</p>
      </div>
      <button class="cart-item-remove" onclick="removeFromCart(${i})" aria-label="Eliminar">
        <i class="fas fa-trash"></i>
      </button>
    </div>
  `).join('');

  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const totalEl = document.getElementById('cartTotal');
  if (totalEl) totalEl.textContent = `S/ ${total.toFixed(2)}`;
  if (footer) footer.style.display = 'block';
}

function openCart() {
  renderCartItems();
  document.getElementById('cartSidebar')?.classList.add('open');
  document.getElementById('cartOverlay')?.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeCart() {
  document.getElementById('cartSidebar')?.classList.remove('open');
  document.getElementById('cartOverlay')?.classList.remove('open');
  document.body.style.overflow = '';
}

function checkoutWhatsApp() {
  if (cart.length === 0) return;
  let msg = `Hola DERECK 👋%0A%0AQuiero hacer el siguiente pedido:%0A%0A`;
  cart.forEach(item => {
    msg += `🛍️ *${item.name}*%0A▫️ Talla: ${item.size} | Color: ${item.color} | Cant: ${item.qty}%0A▫️ Subtotal: S/ ${(item.price * item.qty).toFixed(2)}%0A%0A`;
  });
  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
  msg += `💰 *Total: S/ ${total.toFixed(2)}*%0A%0APor favor confírmenme disponibilidad y forma de envío. ¡Gracias!`;
  window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`, '_blank');
}

// --- Toast ---
function showToast(msg) {
  const t = document.getElementById('toast');
  if (!t) return;
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2600);
}
