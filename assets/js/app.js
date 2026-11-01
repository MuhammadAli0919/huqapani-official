
const productCatalog = [
  { id: 'aero-mini', name: 'Aero Pod Pro', brand: 'Aura Atelier', category: 'Pods', price: 0, oldPrice: 0, image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=900&q=80', badge: 'New', description: 'A refined pod system crafted for smooth draw performance and premium everyday use.', specs: ['Leak-resistant build', 'Smooth draw', 'Luxury finish'], stock: 'Available' },
  { id: 'ember-zen', name: 'Ember Vape Kit', brand: 'Noir House', category: 'Vape Kits', price: 0, oldPrice: 0, image: 'https://images.unsplash.com/photo-1528747045269-390fe33c19f2?auto=format&fit=crop&w=900&q=80', badge: 'Featured', description: 'A curated device designed for elevated flavor, modern finish, and signature style.', specs: ['Smart airflow', 'Signature finish', 'Travel ready'], stock: 'In stock' },
  { id: 'midnight-luxe', name: 'Midnight Pod Set', brand: 'Solstice Studio', category: 'Pods', price: 0, oldPrice: 0, image: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?auto=format&fit=crop&w=900&q=80', badge: 'Bestseller', description: 'A statement pod lineup with premium detailing, balanced performance, and a sleek silhouette.', specs: ['Premium finish', 'Balanced draw', 'Luxury packaging'], stock: 'Available' },
  { id: 'noir-case', name: 'Noir Carry Case', brand: 'Maison Gold', category: 'Accessories', price: 0, oldPrice: 0, image: 'https://images.unsplash.com/photo-1511497584788-876760111969?auto=format&fit=crop&w=900&q=80', badge: 'Limited', description: 'Luxury storage for pods and essentials, built to protect your setup with a refined finish.', specs: ['Premium storage', 'Travel-ready', 'Soft-touch lining'], stock: 'Limited' },
  { id: 'aurora-pen', name: 'Aurora Device', brand: 'Velvet & Co.', category: 'Premium', price: 0, oldPrice: 0, image: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&w=900&q=80', badge: 'Popular', description: 'A premium device concept blending polished form, texture, and elevated presentation.', specs: ['Elegant profile', 'Signature look', 'Refined details'], stock: 'Available' },
  { id: 'golden-bowl', name: 'Gilded Pod Case', brand: 'Northern Form', category: 'Accessories', price: 0, oldPrice: 0, image: 'https://images.unsplash.com/photo-1525160354320-d8e92641c563?auto=format&fit=crop&w=900&q=80', badge: 'New', description: 'A sleek accessory built around premium materials and refined, minimal luxury styling.', specs: ['Warm metallic finish', 'Minimal look', 'Compact design'], stock: 'In stock' },
  { id: 'cipher-press', name: 'Cipher Vape Core', brand: 'The House of Gold', category: 'Vape Kits', price: 0, oldPrice: 0, image: 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=900&q=80', badge: 'Top Rated', description: 'A modern vape core designed for a refined profile, soft feel, and everyday performance.', specs: ['Crafted finish', 'Modern silhouette', 'Premium presentation'], stock: 'Available' },
  { id: 'glass-arc', name: 'Glass Form Kit', brand: 'Sable & Gold', category: 'Curated', price: 0, oldPrice: 0, image: 'https://images.unsplash.com/photo-1535632787350-4e68ef0ac584?auto=format&fit=crop&w=900&q=80', badge: 'Limited', description: 'A premium curated collection inspired by smoke culture, polished details, and minimalist luxury.', specs: ['Luxury finish', 'Limited edition', 'Modern aesthetic'], stock: 'Available' }
];

const navLinks = [
  { label: 'Home', href: 'index.html' },
  { label: 'Shop', href: 'shop.html' },
  { label: 'Categories', href: 'shop.html#categories' },
  { label: 'Brands', href: 'index.html#brands' },
  { label: 'About Us', href: 'about.html' },
  { label: 'Contact', href: 'contact.html' }
];

const stateKeys = {
  cart: 'huqapani_cart',
  wishlist: 'huqapani_wishlist',
  users: 'huqapani_users',
  activeUser: 'huqapani_active_user',
  orders: 'huqapani_orders',
  newsletter: 'huqapani_newsletter',
  contactForms: 'huqapani_contacts',
  ageGate: 'huqapani_age_gate'
};

const defaultUser = { email: 'admin@huqapani.com', password: 'admin123', role: 'admin', name: 'Huqapani Admin' };

const getValue = (key, fallback) => { try { const raw = localStorage.getItem(key); return raw ? JSON.parse(raw) : fallback; } catch { return fallback; } };
const setValue = (key, value) => localStorage.setItem(key, JSON.stringify(value));

function getCart() { return getValue(stateKeys.cart, []); }
function saveCart(cart) { setValue(stateKeys.cart, cart); }
function getWishlist() { return getValue(stateKeys.wishlist, []); }
function saveWishlist(items) { setValue(stateKeys.wishlist, items); }
function getUsers() { const users = getValue(stateKeys.users, []); return users.length ? users : [defaultUser]; }
function saveUsers(users) { setValue(stateKeys.users, users); }
function getCurrentUser() { return getValue(stateKeys.activeUser, null); }
function saveCurrentUser(user) { setValue(stateKeys.activeUser, user); }
function getOrders() { return getValue(stateKeys.orders, []); }
function saveOrders(orders) { setValue(stateKeys.orders, orders); }
function getNewsletter() { return getValue(stateKeys.newsletter, []); }
function saveNewsletter(items) { setValue(stateKeys.newsletter, items); }
function getContacts() { return getValue(stateKeys.contactForms, []); }
function saveContacts(items) { setValue(stateKeys.contactForms, items); }

function formatMoney(amount) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
}

function displayPrice(item) {
  if (!item || item.price === undefined || item.price === null || Number(item.price) <= 0) {
    return 'Price on request';
  }
  return formatMoney(item.price);
}

function displayTotal(label, value) {
  return value && Number(value) > 0 ? `${label}: ${formatMoney(value)}` : `${label}: Quote required`;
}

function showToast(message) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2800);
}

function bindHeader() {
  const nav = document.querySelector('.nav-links');
  if (!nav) return;
  nav.innerHTML = navLinks.map(item => `<li><a href="${item.href}">${item.label}</a></li>`).join('');
  const toggle = document.querySelector('.mobile-menu-toggle');
  if (toggle) {
    toggle.addEventListener('click', () => nav.classList.toggle('open'));
  }
  const cartCount = document.querySelector('[data-cart-count]');
  if (cartCount) cartCount.textContent = getCart().reduce((sum, item) => sum + item.qty, 0);

  const header = document.querySelector('.site-header');
  if (header) {
    const setHeaderState = () => {
      header.classList.toggle('scrolled', window.scrollY > 16);
    };
    window.addEventListener('scroll', setHeaderState, { passive: true });
    setHeaderState();
  }

  const searchInput = document.getElementById('globalSearch');
  const searchPanel = document.getElementById('searchPanel');
  if (searchInput && searchPanel) {
    searchInput.addEventListener('input', (e) => {
      const query = e.target.value.trim().toLowerCase();
      const results = productCatalog.filter(product => `${product.name} ${product.brand} ${product.category}`.toLowerCase().includes(query)).slice(0, 5);
      if (!query) {
        searchPanel.classList.remove('open');
        searchPanel.innerHTML = '';
        return;
      }
      searchPanel.innerHTML = results.length ? results.map(product => `
        <a href="product.html?id=${product.id}" class="search-result-item">
          <img src="${product.image}" alt="${product.name}">
          <div>
            <strong>${product.name}</strong><br>
            <small>${product.brand}</small>
          </div>
        </a>
      `).join('') : '<div class="search-result-item"><strong>No matches</strong></div>';
      searchPanel.classList.add('open');
    });
    document.addEventListener('click', (evt) => {
      if (!searchPanel.contains(evt.target) && !searchInput.contains(evt.target)) searchPanel.classList.remove('open');
    });
  }
}

function setupAgeGate() {
  const gate = document.getElementById('ageGate');
  if (!gate) return;
  const verified = localStorage.getItem(stateKeys.ageGate) === 'verified';
  if (!verified) gate.classList.add('show');
  document.getElementById('verifyAge')?.addEventListener('click', () => {
    localStorage.setItem(stateKeys.ageGate, 'verified');
    gate.classList.remove('show');
    showToast('Age verification accepted.');
  });
  document.getElementById('exitSite')?.addEventListener('click', () => {
    window.location.href = 'https://www.google.com';
  });
}

function bindNewsletter() {
  const forms = document.querySelectorAll('[data-newsletter-form]');
  forms.forEach(form => {
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const email = form.querySelector('input[type="email"]').value.trim();
      const consent = form.querySelector('input[type="checkbox"]');
      if (!email || !/\S+@\S+\.\S+/.test(email)) {
        showToast('Please enter a valid email address.');
        return;
      }
      if (!consent || !consent.checked) {
        showToast('Please confirm your consent before subscribing.');
        return;
      }
      const subscribers = getNewsletter();
      if (!subscribers.includes(email)) subscribers.push(email);
      saveNewsletter(subscribers);
      form.reset();
      showToast('Subscribed successfully.');
    });
  });
}

function renderHomeProducts() {
  const grid = document.querySelector('[data-featured-grid]');
  if (!grid) return;
  const featured = productCatalog.slice(0, 4);
  grid.innerHTML = featured.map(item => `
    <article class="product-card">
      <div class="product-image">
        <span class="tag">${item.badge}</span>
        <img src="${item.image}" alt="${item.name}" loading="lazy">
      </div>
      <div class="card-body">
        <div class="product-meta">
          <span class="muted">${item.brand}</span>
          <span class="muted">${item.stock}</span>
        </div>
        <h3>${item.name}</h3>
        <div class="price-row">
          <div>
            <span class="product-price">${displayPrice(item)}</span>
          </div>
        </div>
        <div class="product-actions">
          <button class="btn btn-primary" data-add-to-cart="${item.id}">Add to cart</button>
          <button class="icon-link" data-wishlist="${item.id}" aria-label="Add to wishlist">♡</button>
        </div>
      </div>
    </article>
  `).join('');
  bindProductActions();
}

function renderCategoryCards() {
  const grid = document.querySelector('[data-category-grid]');
  if (!grid) return;
  const categories = [
    { name: 'Pod Systems', description: 'Compact premium pods for daily use, refined flow, and discreet luxury.', image: makeProductArt('PODS', '#0e0e0e', '#d4af37') },
    { name: 'Vape Kits', description: 'Statement-ready vape kits built around comfort, performance, and sleek finishes.', image: makeProductArt('VAPE', '#111111', '#b8860b') },
    { name: 'Accessories', description: 'Carriers, cases, and premium add-ons made for a clean, elevated setup.', image: makeProductArt('CASE', '#0a0a0a', '#d9b64a') },
    { name: 'Luxury Essentials', description: 'Minimal lifestyle pieces selected for sophistication, texture, and daily elegance.', image: makeProductArt('LUXE', '#161616', '#c39b2d') }
  ];
  grid.innerHTML = categories.map(item => `
    <article class="card">
      <img src="${item.image}" alt="${item.name}" loading="lazy">
      <div class="card-body">
        <h3>${item.name}</h3>
        <p>${item.description}</p>
        <a href="shop.html" class="btn btn-secondary">Explore</a>
      </div>
    </article>
  `).join('');
}

function buildSlider() {
  const slider = document.querySelector('[data-slider]');
  if (!slider) return;
  const slides = [
    { title: 'Premium pods and vape kits for elevated rituals', text: 'Discover refined hardware and accessories crafted for smoother performance and contemporary luxury.', image: makeProductArt('PODS', '#0e0e0e', '#d4af37') },
    { title: 'Luxury smoke culture, redefined', text: 'Curated essentials blending performance, craftsmanship, and a modern premium finish.', image: makeProductArt('VAPE', '#121212', '#b8860b') },
    { title: 'Meet the new essentials', text: 'From sleek pod systems to statement accessories, built for daily confidence.', image: makeProductArt('SIGNATURE', '#0a0a0a', '#c9a13d') }
  ];
  let index = 0;
  slider.innerHTML = `
    <div class="slider-track">
      ${slides.map((slide) => `
        <div class="slide">
          <div class="slide-content">
            <span class="kicker">Limited edition</span>
            <h3>${slide.title}</h3>
            <p>${slide.text}</p>
            <a href="shop.html" class="btn btn-primary">Shop now</a>
          </div>
          <div class="slide-image"><img src="${slide.image}" alt="${slide.title}"></div>
        </div>
      `).join('')}
    </div>
    <div class="slider-controls">
      <button type="button" class="btn btn-secondary" data-slider-prev>Prev</button>
      <div class="slider-dots">${slides.map((slide, i) => `<span class="${i === 0 ? 'active' : ''}" data-slide-dot="${i}"></span>`).join('')}</div>
      <button type="button" class="btn btn-secondary" data-slider-next>Next</button>
    </div>
  `;
  const track = slider.querySelector('.slider-track');
  const dots = slider.querySelectorAll('[data-slide-dot]');
  const renderSlide = () => {
    track.style.transform = `translateX(-${index * 100}%)`;
    dots.forEach((dot, i) => dot.classList.toggle('active', i === index));
  };
  slider.querySelector('[data-slider-next]')?.addEventListener('click', () => { index = (index + 1) % slides.length; renderSlide(); });
  slider.querySelector('[data-slider-prev]')?.addEventListener('click', () => { index = (index - 1 + slides.length) % slides.length; renderSlide(); });
  dots.forEach((dot) => dot.addEventListener('click', () => { index = Number(dot.dataset.slideDot); renderSlide(); }));
  setInterval(() => { index = (index + 1) % slides.length; renderSlide(); }, 4200);
}

function renderBrandRow() {
  const row = document.querySelector('[data-brand-row]');
  if (!row) return;
  const brands = ['VAPOR', 'LUXE', 'HAZE', 'AERO', 'EMBER'];
  row.innerHTML = brands.map((brand) => `
    <div class="brand-card">
      <div class="logo-box">${brand}</div>
      <strong>${brand}</strong>
    </div>
  `).join('');
}

function getProductById(id) {
  return productCatalog.find(product => product.id === id) || productCatalog[0];
}

function bindProductActions() {
  document.querySelectorAll('[data-add-to-cart]').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.addToCart;
      const cart = getCart();
      const existing = cart.find(item => item.id === id);
      if (existing) existing.qty += 1; else cart.push({ id, qty: 1 });
      saveCart(cart);
      const countNode = document.querySelector('[data-cart-count]');
      if (countNode) countNode.textContent = cart.reduce((sum, item) => sum + item.qty, 0);
      showToast('Added to cart.');
    });
  });

  document.querySelectorAll('[data-wishlist]').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.wishlist;
      const items = getWishlist();
      if (!items.includes(id)) items.push(id);
      saveWishlist(items);
      showToast('Saved to wishlist.');
    });
  });
}

function renderShopPage() {
  const productGrid = document.querySelector('[data-shop-grid]');
  if (!productGrid) return;
  const categorySelect = document.querySelector('#categoryFilter');
  const brandSelect = document.querySelector('#brandFilter');
  const sortSelect = document.querySelector('#sortFilter');
  const searchInput = document.querySelector('#shopSearch');

  const renderProducts = () => {
    const category = categorySelect?.value || 'all';
    const brand = brandSelect?.value || 'all';
    const query = (searchInput?.value || '').trim().toLowerCase();
    const sort = sortSelect?.value || 'featured';
    let filtered = productCatalog.filter(product => {
      const categoryMatch = category === 'all' || product.category === category;
      const brandMatch = brand === 'all' || product.brand === brand;
      const searchMatch = !query || `${product.name} ${product.brand} ${product.category}`.toLowerCase().includes(query);
      return categoryMatch && brandMatch && searchMatch;
    });
    if (sort === 'price-low') filtered = filtered.sort((a, b) => a.price - b.price);
    if (sort === 'price-high') filtered = filtered.sort((a, b) => b.price - a.price);
    if (sort === 'name') filtered = filtered.sort((a, b) => a.name.localeCompare(b.name));
    productGrid.innerHTML = filtered.length ? filtered.map(item => `
      <article class="product-card">
        <div class="product-image">
          <span class="tag">${item.badge}</span>
          <img src="${item.image}" alt="${item.name}" loading="lazy">
        </div>
        <div class="card-body">
          <div class="product-meta">
            <span>${item.brand}</span>
            <span>${item.stock}</span>
          </div>
          <h3><a href="product.html?id=${item.id}">${item.name}</a></h3>
          <div class="price-row">
            <div>
              <span class="product-price">${displayPrice(item)}</span>
            </div>
          </div>
          <div class="product-actions">
            <button class="btn btn-primary" data-add-to-cart="${item.id}">Add</button>
            <button class="icon-link" data-wishlist="${item.id}">♡</button>
          </div>
        </div>
      </article>
    `).join('') : '<div class="card-body"><p>No products match your filters.</p></div>';
    bindProductActions();
  };

  const categoryOptions = ['all', ...new Set(productCatalog.map(item => item.category))];
  if (categorySelect) categorySelect.innerHTML = categoryOptions.map(option => `<option value="${option}">${option === 'all' ? 'All categories' : option}</option>`).join('');

  const brandOptions = ['all', ...new Set(productCatalog.map(item => item.brand))];
  if (brandSelect) brandSelect.innerHTML = brandOptions.map(option => `<option value="${option}">${option === 'all' ? 'All brands' : option}</option>`).join('');

  [categorySelect, brandSelect, sortSelect, searchInput].forEach(el => el && el.addEventListener('input', renderProducts));
  [categorySelect, brandSelect, sortSelect].forEach(el => el && el.addEventListener('change', renderProducts));
  renderProducts();
}

function renderProductDetailPage() {
  const detailHost = document.querySelector('[data-product-detail]');
  if (!detailHost) return;
  const params = new URLSearchParams(window.location.search);
  const product = getProductById(params.get('id') || productCatalog[0].id);
  const gallery = [product.image, product.image, product.image, product.image];
  detailHost.innerHTML = `
    <div class="product-detail">
      <div>
        <div class="gallery-main"><img src="${product.image}" alt="${product.name}"></div>
        <div class="gallery-thumbs">${gallery.map((src, idx) => `<img src="${src}" alt="${product.name} ${idx + 1}" loading="lazy">`).join('')}</div>
      </div>
      <div class="product-info detail-card">
        <span class="kicker">${product.brand}</span>
        <h1>${product.name}</h1>
        <p>${product.description}</p>
        <div class="price">${displayPrice(product)}</div>
        <p><strong>Availability:</strong> ${product.stock}</p>
        <div class="product-actions">
          <button class="btn btn-primary" data-add-to-cart="${product.id}">Add to cart</button>
          <button class="btn btn-secondary" data-wishlist="${product.id}">Add to wishlist</button>
        </div>
        <ul class="feature-list">
          ${product.specs.map(item => `<li>${item}</li>`).join('')}
        </ul>
      </div>
    </div>
  `;
  bindProductActions();
}

function renderCartPage() {
  const host = document.querySelector('[data-cart-page]');
  if (!host) return;
  const cart = getCart();
  const items = cart.map(entry => ({ ...getProductById(entry.id), qty: entry.qty }));
  if (!items.length) {
    host.innerHTML = '<div class="checkout-card"><h2>Your cart is empty</h2><p>Explore the collection and add your favorites.</p><a href="shop.html" class="btn btn-primary">Continue shopping</a></div>';
    return;
  }
  const subtotal = items.reduce((sum, item) => sum + item.price * item.qty, 0);
  const shipping = subtotal > 120 ? 0 : 12;
  const total = subtotal + shipping;
  host.innerHTML = `
    <div class="cart-layout">
      <div class="cart-list">
        ${items.map(item => `
          <div class="cart-item">
            <img src="${item.image}" alt="${item.name}">
            <div>
              <h3>${item.name}</h3>
              <p>${item.brand}</p>
              <strong>${displayPrice(item)}</strong>
            </div>
            <div>
              <div class="qty-controls">
                <button class="qty-btn" data-cart-minus="${item.id}">-</button>
                <span>${item.qty}</span>
                <button class="qty-btn" data-cart-plus="${item.id}">+</button>
              </div>
              <button class="btn btn-ghost" data-cart-remove="${item.id}">Remove</button>
            </div>
          </div>
        `).join('')}
      </div>
      <aside class="summary-card">
        <h3>Order summary</h3>
        <div class="summary-row"><span>Subtotal</span><strong>${displayPrice({ price: subtotal })}</strong></div>
        <div class="summary-row"><span>Shipping</span><strong>${shipping === 0 ? 'Free quote' : 'Quote required'}</strong></div>
        <div class="summary-row total-row"><span>Total</span><strong>Quote required</strong></div>
        <a href="checkout.html" class="btn btn-primary" style="width:100%; margin-top: 18px;">Proceed to checkout</a>
      </aside>
    </div>
  `;
  document.querySelectorAll('[data-cart-minus]').forEach(btn => btn.addEventListener('click', () => changeCartQuantity(btn.dataset.cartMinus, -1)));
  document.querySelectorAll('[data-cart-plus]').forEach(btn => btn.addEventListener('click', () => changeCartQuantity(btn.dataset.cartPlus, 1)));
  document.querySelectorAll('[data-cart-remove]').forEach(btn => btn.addEventListener('click', () => removeCartItem(btn.dataset.cartRemove)));
}

function changeCartQuantity(id, delta) {
  const cart = getCart();
  const entry = cart.find(item => item.id === id);
  if (!entry) return;
  entry.qty += delta;
  if (entry.qty <= 0) {
    saveCart(cart.filter(item => item.id !== id));
  } else {
    saveCart(cart);
  }
  renderCartPage();
  const countNode = document.querySelector('[data-cart-count]');
  if (countNode) countNode.textContent = getCart().reduce((sum, item) => sum + item.qty, 0);
}

function removeCartItem(id) {
  saveCart(getCart().filter(item => item.id !== id));
  renderCartPage();
  const countNode = document.querySelector('[data-cart-count]');
  if (countNode) countNode.textContent = getCart().reduce((sum, item) => sum + item.qty, 0);
}

function bindCheckoutForm() {
  const form = document.getElementById('checkoutForm');
  if (!form) return;
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const cart = getCart();
    if (!cart.length) {
      showToast('Your cart is empty.');
      return;
    }
    const formData = new FormData(form);
    const order = {
      id: 'ORD-' + new Date().getTime(),
      customer: Object.fromEntries(formData.entries()),
      items: cart,
      subtotal: cart.reduce((sum, item) => sum + getProductById(item.id).price * item.qty, 0),
      placedAt: new Date().toISOString()
    };
    const orders = getOrders();
    orders.unshift(order);
    saveOrders(orders);
    saveCart([]);
    const countNode = document.querySelector('[data-cart-count]');
    if (countNode) countNode.textContent = '0';
    form.reset();
    const summary = document.querySelector('[data-order-summary]');
    if (summary) {
      summary.innerHTML = `<div class="checkout-card"><h3>Order confirmed</h3><p>Thanks, your order ${order.id} has been placed successfully.</p><a href="dashboard.html" class="btn btn-primary">View dashboard</a></div>`;
    }
    showToast('Checkout complete.');
  });
}

function renderCheckoutSummary() {
  const host = document.querySelector('[data-order-summary]');
  if (!host) return;
  const cart = getCart();
  if (!cart.length) {
    host.innerHTML = '<div class="checkout-card"><h3>Your cart is empty</h3></div>';
    return;
  }
  const subtotal = cart.reduce((sum, item) => sum + getProductById(item.id).price * item.qty, 0);
  const shipping = subtotal > 120 ? 0 : 12;
  const total = subtotal + shipping;
  host.innerHTML = `
    <div class="checkout-card">
      <h3>Order summary</h3>
      <div class="summary-row"><span>Items</span><strong>${cart.reduce((sum, item) => sum + item.qty, 0)}</strong></div>
      <div class="summary-row"><span>Subtotal</span><strong>${displayPrice({ price: subtotal })}</strong></div>
      <div class="summary-row"><span>Shipping</span><strong>${shipping === 0 ? 'Free quote' : 'Quote required'}</strong></div>
      <div class="summary-row total-row"><span>Total</span><strong>Quote required</strong></div>
    </div>
  `;
}

function bindAuthForms() {
  const registerForm = document.getElementById('registerForm');
  if (registerForm) {
    registerForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const formData = new FormData(registerForm);
      const name = formData.get('name')?.trim();
      const email = formData.get('email')?.trim();
      const password = formData.get('password')?.trim();
      if (!name || !email || !password) { showToast('Please complete all fields.'); return; }
      const users = getUsers();
      if (users.some(user => user.email.toLowerCase() === email.toLowerCase())) { showToast('Account already exists.'); return; }
      const user = { name, email, password, role: 'customer' };
      users.push(user);
      saveUsers(users);
      saveCurrentUser(user);
      registerForm.reset();
      window.location.href = 'dashboard.html';
    });
  }

  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const formData = new FormData(loginForm);
      const email = formData.get('email')?.trim();
      const password = formData.get('password')?.trim();
      const users = getUsers();
      const match = users.find(user => user.email.toLowerCase() === email.toLowerCase() && user.password === password);
      if (!match) { showToast('Invalid email or password.'); return; }
      saveCurrentUser(match);
      loginForm.reset();
      if (match.role === 'admin') window.location.href = 'admin.html'; else window.location.href = 'dashboard.html';
    });
  }

  const adminLoginForm = document.getElementById('adminLoginForm');
  if (adminLoginForm) {
    adminLoginForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const formData = new FormData(adminLoginForm);
      const email = formData.get('email')?.trim();
      const password = formData.get('password')?.trim();
      const user = getUsers().find(item => item.email === email && item.password === password && item.role === 'admin');
      if (!user) { showToast('Admin credentials invalid.'); return; }
      saveCurrentUser(user);
      window.location.href = 'admin.html';
    });
  }
}

function renderDashboard() {
  const host = document.querySelector('[data-dashboard]');
  if (!host) return;
  const user = getCurrentUser();
  const orders = getOrders();
  const totalSpend = orders.reduce((sum, order) => sum + (order.subtotal || 0), 0);
  host.innerHTML = `
    <div class="dashboard-grid">
      <div class="metric-card"><span class="kicker">Welcome</span><strong>${user?.name || 'Guest'}</strong><p>${user?.email || 'Sign in to manage your account.'}</p></div>
      <div class="metric-card"><span class="kicker">Orders</span><strong>${orders.length}</strong><p>Placed successfully</p></div>
      <div class="metric-card"><span class="kicker">Wishlist</span><strong>${getWishlist().length}</strong><p>Saved favorites</p></div>
      <div class="metric-card"><span class="kicker">Spend</span><strong>${displayPrice({ price: totalSpend })}</strong><p>Lifetime value</p></div>
    </div>
    <div class="section">
      <h3>Recent orders</h3>
      <div class="table-wrap">
        <table>
          <thead><tr><th>Order</th><th>Date</th><th>Items</th><th>Total</th></tr></thead>
          <tbody>
            ${orders.length ? orders.map(order => `<tr><td>${order.id}</td><td>${new Date(order.placedAt).toLocaleDateString()}</td><td>${order.items.reduce((sum, item) => sum + item.qty, 0)}</td><td>${displayPrice({ price: order.subtotal || 0 })}</td></tr>`).join('') : '<tr><td colspan="4">No orders yet.</td></tr>'}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

function renderAdminPanel() {
  const host = document.querySelector('[data-admin-panel]');
  if (!host) return;
  const products = productCatalog;
  const orders = getOrders();
  const subscribers = getNewsletter();
  const totalRevenue = orders.reduce((sum, order) => sum + (order.subtotal || 0), 0);
  host.innerHTML = `
    <div class="dashboard-grid">
      <div class="metric-card"><span class="kicker">Revenue</span><strong>${displayPrice({ price: totalRevenue })}</strong><p>Eligible orders</p></div>
      <div class="metric-card"><span class="kicker">Orders</span><strong>${orders.length}</strong><p>Processed orders</p></div>
      <div class="metric-card"><span class="kicker">Products</span><strong>${products.length}</strong><p>Active catalog</p></div>
      <div class="metric-card"><span class="kicker">Subscribers</span><strong>${subscribers.length}</strong><p>Newsletter audience</p></div>
    </div>
    <div class="section">
      <h3>Recent orders</h3>
      <div class="table-wrap">
        <table>
          <thead><tr><th>Order</th><th>Customer</th><th>Status</th><th>Total</th></tr></thead>
          <tbody>
            ${orders.length ? orders.map(order => `<tr><td>${order.id}</td><td>${order.customer?.firstName || 'Customer'}</td><td>Confirmed</td><td>${displayPrice({ price: order.subtotal || 0 })}</td></tr>`).join('') : '<tr><td colspan="4">No orders yet.</td></tr>'}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

function bindContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = new FormData(form);
    const inquiry = Object.fromEntries(formData.entries());
    const list = getContacts();
    list.push({ ...inquiry, createdAt: new Date().toISOString() });
    saveContacts(list);
    form.reset();
    showToast('Your message has been sent.');
  });
}

function setupSmokeBackgrounds() {
  const canvases = document.querySelectorAll('.smoke-canvas');
  canvases.forEach((canvas, index) => {
    const ctx = canvas.getContext('2d');
    let particles = [];
    const resize = () => {
      const ratio = window.devicePixelRatio || 1;
      canvas.width = canvas.clientWidth * ratio;
      canvas.height = canvas.clientHeight * ratio;
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
      particles = Array.from({ length: index === 0 ? 36 : 20 }, () => ({
        x: Math.random() * canvas.clientWidth,
        y: Math.random() * canvas.clientHeight,
        r: 30 + Math.random() * 120,
        a: 0.04 + Math.random() * 0.12,
        dx: (Math.random() - 0.5) * 0.3,
        dy: -0.3 - Math.random() * 0.5,
        drift: Math.random() * Math.PI * 2
      }));
    };
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const p of particles) {
        p.x += p.dx + Math.sin(p.drift) * 0.2;
        p.y += p.dy;
        p.drift += 0.02;
        if (p.x < -p.r) p.x = canvas.clientWidth + p.r;
        if (p.y < -p.r) p.y = canvas.clientHeight + p.r;
        if (p.x > canvas.clientWidth + p.r) p.x = -p.r;
        if (p.y > canvas.clientHeight + p.r) p.y = -p.r;
        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r);
        grad.addColorStop(0, `rgba(255,255,255,${p.a})`);
        grad.addColorStop(0.45, `rgba(210,210,210,${p.a * 0.6})`);
        grad.addColorStop(1, 'rgba(255,255,255,0)');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
      requestAnimationFrame(draw);
    };
    resize();
    window.addEventListener('resize', resize, { passive: true });
    requestAnimationFrame(draw);
  });
}

function renderWishlist() {
  const grid = document.getElementById('wishlistGrid');
  if (!grid) return;
  const ids = getWishlist();
  const items = ids.map(id => getProductById(id)).filter(Boolean);
  grid.innerHTML = items.length ? items.map(item => `
    <article class="product-card">
      <div class="product-image"><img src="${item.image}" alt="${item.name}" loading="lazy"></div>
      <div class="card-body">
        <h3>${item.name}</h3>
        <p>${item.brand}</p>
        <div class="price-row"><span class="product-price">${displayPrice(item)}</span><button class="btn btn-primary" data-add-to-cart="${item.id}">Add</button></div>
      </div>
    </article>
  `).join('') : '<div class="card-body"><p>Your wishlist is empty.</p></div>';
  bindProductActions();
}

function init() {
  bindHeader();
  setupAgeGate();
  bindNewsletter();
  renderHomeProducts();
  renderCategoryCards();
  buildSlider();
  renderBrandRow();
  renderShopPage();
  renderProductDetailPage();
  renderCartPage();
  renderCheckoutSummary();
  bindCheckoutForm();
  bindAuthForms();
  renderDashboard();
  renderAdminPanel();
  bindContactForm();
  setupSmokeBackgrounds();
  renderWishlist();
}

document.addEventListener('DOMContentLoaded', init);