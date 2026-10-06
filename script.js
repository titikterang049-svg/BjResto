/* ==========================================================================
   BJ RESTO - SELF ORDERING SYSTEM SCRIPT WITH ADMIN STOCK MANAGEMENT
   Versi: stok bersama via Supabase (realtime)
   ========================================================================== */

/**
 * 1. KONFIGURASI
 */
const ADMIN_WHATSAPP = "6285188428223";

// Isi dari Supabase: Project Settings > API
const SUPABASE_URL = "https://zrhqhvfogcpqcvraftzn.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpyaHFodmZvZ2NwcWN2cmFmdHpuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTEyOTM5MzAsImV4cCI6MjEwNjg2OTkzMH0.od3IPgXXimlLM79UzcfEh8105PVq4VBo5apCaKYhpdw"; // pakai anon key, BUKAN service_role
const db = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
let adminPinValue = ""; // PIN hanya disimpan di memori setelah login berhasil

/**
 * 2. DATA PRODUK (DESAIN SESUAI DAFTAR MENU BJ RESTO)
 */
const INITIAL_PRODUCTS = [
  // --- AYAM ---
  {
    id: 1,
    name: "Ayam Bakar",
    description: "Ayam bakar bumbu khas BJ Resto yang manis gurih meresap.",
    category: "ayam",
    image: "assets/images/ayam-bakar.jpeg",
    variants: [
      { name: "M", price: 65, stock: 20 },
      { name: "L", price: 75, stock: 15 },
      { name: "XL", price: 90, stock: 15 }
    ]
  },
  {
    id: 2,
    name: "Ayam Bakar Kacang",
    description: "Ayam bakar disiram saus kacang gurih manis nikmat.",
    category: "ayam",
    image: "assets/images/ayam-bakar-kacang.jpeg",
    variants: [
      { name: "M", price: 65, stock: 20 },
      { name: "L", price: 75, stock: 15 },
      { name: "XL", price: 90, stock: 15 }
    ]
  },
  {
    id: 3,
    name: "Ayam Bumbu Hitam",
    description: "Ayam goreng disajikan dengan bumbu hitam rempah pedas gurih.",
    category: "ayam",
    image: "assets/images/ayam-bumbu-hitam.jpeg",
    variants: [
      { name: "M", price: 65, stock: 20 },
      { name: "L", price: 75, stock: 15 },
      { name: "XL", price: 90, stock: 15 }
    ]
  },
  {
    id: 4,
    name: "Ayam Penyet",
    description: "Ayam goreng dipenyet dengan sambal terasi pedas mantap.",
    category: "ayam",
    image: "assets/images/ayam-penyet.jpg",
    variants: [
      { name: "M", price: 65, stock: 20 },
      { name: "L", price: 75, stock: 15 },
      { name: "XL", price: 90, stock: 15 }
    ]
  },
  {
    id: 5,
    name: "Ayam Goreng Bawang Putih",
    description: "Ayam goreng rempah renyah gurih khas nusantara.",
    category: "ayam",
    image: "assets/images/ayam-goreng.jpeg",
    variants: [
      { name: "M", price: 65, stock: 25 },
      { name: "L", price: 75, stock: 20 },
      { name: "XL", price: 90, stock: 15 }
    ]
  },
  {
    id: 6,
    name: "Sate Ayam Madura",
    description: "Sate ayam empuk dipadu bumbu kacang gurih manis Madura.",
    category: "ayam",
    image: "assets/images/sate.jpeg",
    price: 75,
    stock: 25
  },

  // --- BEBEK ---
  {
    id: 7,
    name: "Nasi Bebek Bakar",
    description: "Nasi bebek bakar gurih manis dengan lalapan segar.",
    category: "bebek",
    image: "assets/images/bebek-bakar.jpg",
    variants: [
      { name: "M", price: 75, stock: 15 },
      { name: "L", price: 100, stock: 15 },
      { name: "XL", price: 135, stock: 10 }
    ]
  },
  {
    id: 8,
    name: "Nasi Bebek Goreng",
    description: "Nasi bebek goreng renyah di luar, lembut di dalam.",
    category: "bebek",
    image: "assets/images/bebek-goreng.jpg",
    variants: [
      { name: "M", price: 75, stock: 15 },
      { name: "L", price: 100, stock: 15 },
      { name: "XL", price: 135, stock: 10 }
    ]
  },
  {
    id: 9,
    name: "Nasi Bebek Penyet",
    description: "Nasi bebek dipenyet sambal terasi lezat pedas menggugah selera.",
    category: "bebek",
    image: "assets/images/bebek-penyet.jpg",
    variants: [
      { name: "M", price: 75, stock: 15 },
      { name: "L", price: 100, stock: 15 },
      { name: "XL", price: 135, stock: 10 }
    ]
  },
  {
    id: 10,
    name: "Nasi Bebek Bumbu Hitam",
    description: "Nasi bebek dengan siraman bumbu hitam rempah melimpah.",
    category: "bebek",
    image: "assets/images/bebek-bumbu-hitam.jpg",
    variants: [
      { name: "M", price: 75, stock: 15 },
      { name: "L", price: 100, stock: 15 },
      { name: "XL", price: 135, stock: 10 }
    ]
  },

  // --- SEAFOOD ---
  {
    id: 11,
    name: "Ikan Goreng",
    description: "Ikan segar goreng bumbu bumbu kuning renyah gurih.",
    category: "seafood",
    image: "assets/images/ikan-goreng.jpg",
    price: 75,
    variants: [
      { name: "L", price: 80, stock: 20 },
      { name: "XL", price: 90, stock: 15 }
    ]
  },
  {
    id: 12,
    name: "Ikan Bakar",
    description: "Ikan segar bakar bumbu kecap manis pedas spesial.",
    category: "seafood",
    image: "assets/images/ikan-bakar.jpeg",
    price: 80,
    variants: [
      { name: "L", price: 80, stock: 20 },
      { name: "XL", price: 90, stock: 15 }
    ]
  },
  {
    id: 13,
    name: "Ikan Penyet",
    description: "Ikan goreng renyah dipenyet dengan sambal terasi pedas.",
    category: "seafood",
    image: "assets/images/ikan-penyet.png",
    price: 80,
   variants: [
      { name: "L", price: 80, stock: 20 },
      { name: "XL", price: 90, stock: 15 }
    ]
  },
  {
    id: 14,
    name: "Cumi Asam Manis",
    description: "Cumi empuk dimasak dengan saus asam manis lezat.",
    category: "seafood",
    image: "assets/images/cumi.jpeg",
    price: 95,
    stock: 15
  },

  // --- MENU EXTRA ---
  {
    id: 15,
    name: "Batagor",
    description: "Batagor renyah disajikan dengan saus kacang gurih.",
    category: "extra",
    image: "assets/images/batagor.jpg",
    price: 60,
    stock: 30
  },
  {
    id: 16,
    name: "Sambal Terong",
    description: "Terong goreng balado bumbu sambal gurih pedas.",
    category: "extra",
    image: "assets/images/sambal-terong.jpg",
    price: 15,
    stock: 40
  },
  {
    id: 17,
    name: "Sambal Belacan",
    description: "Sambal terasi belacan asli cita rasa khas.",
    category: "extra",
    image: "assets/images/sambal.jpg",
    price: 10,
    stock: 50
  },
  {
    id: 18,
    name: "Sambal Kacang",
    description: "Tambahan sambal kacang kental dan legit.",
    category: "extra",
    image: "assets/images/kacang.jpg",
    price: 15,
    stock: 40
  },
  {
    id: 19,
    name: "Nasi",
    description: "Porsi nasi putih hangat (Gratis untuk dine in).",
    category: "extra",
    image: "assets/images/nasi.jpg",
    price: 15,
    stock: 100
  },
  {
    id: 29,
    name: "Kerupuk Udang",
    description: "Kerupuk udang renyah dan gurih khas nikmat.",
    category: "extra",
    image: "assets/images/kerupuk-udang.jpg",
    price: 20,
    stock: 50
  },
  {
    id: 30,
    name: "Kerupuk Warna Warni",
    description: "Kerupuk warna-warni renyah pelengkap makan Anda.",
    category: "extra",
    image: "assets/images/kerupuk-warna-warni.jpg",
    price: 25,
    stock: 50
  },

  // --- MINUMAN ---
  {
    id: 20,
    name: "Teh",
    description: "Teh manis aroma harum khas disajikan hangat atau dingin.",
    category: "minuman",
    image: "assets/images/teh.jpg",
    variants: [
      { name: "Hot", price: 10, stock: 50 },
      { name: "Cold", price: 15, stock: 50 }
    ]
  },
  {
    id: 21,
    name: "Milk Tea",
    description: "Kombinasi teh aromatik dan susu manis segar.",
    category: "minuman",
    image: "assets/images/milk-tea.jpg",
    variants: [
      { name: "Hot", price: 20, stock: 30 },
      { name: "Cold", price: 25, stock: 30 }
    ]
  },
  {
    id: 22,
    name: "Lemon",
    description: "Sari jeruk lemon segar penambah stamina.",
    category: "minuman",
    image: "assets/images/lemon.jpg",
    variants: [
      { name: "Hot", price: 15, stock: 30 },
      { name: "Cold", price: 20, stock: 30 }
    ]
  },
  {
    id: 23,
    name: "Lemon Tea",
    description: "Segarnya es lemon tea kombinasi teh dan perasan lemon.",
    category: "minuman",
    image: "assets/images/lemon-tea.jpg",
    variants: [
      { name: "Hot", price: 20, stock: 30 },
      { name: "Cold", price: 25, stock: 30 }
    ]
  },
  {
    id: 24,
    name: "Kopi",
    description: "Kopi hitam matang dengan aroma nikmat khas.",
    category: "minuman",
    image: "assets/images/kopi.jpg",
    variants: [
      { name: "Hot", price: 20, stock: 40 },
      { name: "Cold", price: 25, stock: 40 }
    ]
  },
  {
    id: 25,
    name: "Pandan",
    description: "Minuman rasa harum pandan segar dan nikmat.",
    category: "minuman",
    image: "assets/images/pandan.jpg",
    variants: [
      { name: "Hot", price: 25, stock: 25 },
      { name: "Cold", price: 30, stock: 25 }
    ]
  },
  {
    id: 26,
    name: "Matcha",
    description: "Matcha latte kaya antioksidan dan lezat.",
    category: "minuman",
    image: "assets/images/matcha.jpg",
    variants: [
      { name: "Hot", price: 25, stock: 25 },
      { name: "Cold", price: 30, stock: 25 }
    ]
  },
  {
    id: 27,
    name: "Bandung",
    description: "Es Bandung sirup merah dipadu dengan susu manis.",
    category: "minuman",
    image: "assets/images/bandung.jpg",
    variants: [
      { name: "Hot", price: 20, stock: 30 },
      { name: "Cold", price: 25, stock: 30 }
    ]
  },
  {
    id: 28,
    name: "Susu",
    description: "Susu sapi murni segar dan menyehatkan.",
    category: "minuman",
    image: "assets/images/susu.jpg",
    variants: [
      { name: "Hot", price: 15, stock: 30 },
      { name: "Cold", price: 20, stock: 30 }
    ]
  }
];

// Deep copy untuk mutable PRODUCTS
let PRODUCTS = JSON.parse(JSON.stringify(INITIAL_PRODUCTS));

// Application State
let cart = [];
let currentCategory = "semua";
let searchQuery = "";
let selectedVariantState = {};
let isAdminLoggedIn = false;
let adminSearchQuery = "";
let currentOrderType = "dine_in"; // 'dine_in', 'take_away', 'delivery'
let currentDeliveryArea = "darrasah"; // 'darrasah', 'gamaliah', 'buuts'

// DOM Elements
const productGrid = document.getElementById("product-grid");
const emptyState = document.getElementById("empty-state");
const categoryButtons = document.querySelectorAll(".category-btn");
const currentCategoryTitle = document.getElementById("current-category-title");
const menuCountLabel = document.getElementById("menu-count");
const searchInput = document.getElementById("search-input");

// Floating Cart Elements
const floatingCartBar = document.getElementById("floating-cart-bar");
const cartBarTrigger = document.getElementById("cart-bar-trigger");
const cartBadge = document.getElementById("cart-badge");
const cartItemCount = document.getElementById("cart-item-count");
const cartTotalPrice = document.getElementById("cart-total-price");

// Modal Cart Elements
const cartModal = document.getElementById("cart-modal");
const closeCartBtn = document.getElementById("close-cart-btn");
const cartItemsContainer = document.getElementById("cart-items-container");
const modalEmptyCart = document.getElementById("modal-empty-cart");
const cartFooter = document.getElementById("cart-footer");
const modalSubtotalPrice = document.getElementById("modal-subtotal-price");
const modalTotalPrice = document.getElementById("modal-total-price");
const checkoutBtn = document.getElementById("checkout-btn");

// Modal Checkout Elements
const checkoutModal = document.getElementById("checkout-modal");
const closeCheckoutBtn = document.getElementById("close-checkout-btn");
const checkoutItemsList = document.getElementById("checkout-items-list");
const checkoutSubtotalAmount = document.getElementById("checkout-subtotal-amount");
const checkoutDeliveryFeeRow = document.getElementById("checkout-delivery-fee-row");
const checkoutDeliveryFee = document.getElementById("checkout-delivery-fee");
const checkoutTotalAmount = document.getElementById("checkout-total-amount");
const customerNameInput = document.getElementById("customer-name");
const sendWhatsappBtn = document.getElementById("send-whatsapp-btn");

// Order Type & Delivery Elements
const orderTypeCards = document.querySelectorAll(".order-type-card");
const deliveryFieldsContainer = document.getElementById("delivery-fields-container");
const areaPills = document.querySelectorAll(".area-pill");
const deliveryAddressInput = document.getElementById("delivery-address");
const deliverySharelocInput = document.getElementById("delivery-shareloc");
const deliveryLandmarkInput = document.getElementById("delivery-landmark");

// Admin Elements
const adminPanelBtn = document.getElementById("admin-panel-btn");
const adminLoginModal = document.getElementById("admin-login-modal");
const closeAdminLoginBtn = document.getElementById("close-admin-login-btn");
const adminPinInput = document.getElementById("admin-pin-input");
const adminLoginSubmit = document.getElementById("admin-login-submit");
const adminLoginError = document.getElementById("admin-login-error");

const adminStockModal = document.getElementById("admin-stock-modal");
const closeAdminStockBtn = document.getElementById("close-admin-stock-btn");
const closeStockModalFooter = document.getElementById("close-stock-modal-footer");
const adminStockSearch = document.getElementById("admin-stock-search");
const resetStockBtn = document.getElementById("reset-stock-btn");
const adminStockList = document.getElementById("admin-stock-list");

// Toast Element
const toastEl = document.getElementById("toast");

/* --------------------------------------------------------------------------
   STOCK MANAGEMENT (SUPABASE - DIBAGI KE SEMUA HP)
   -------------------------------------------------------------------------- */

/**
 * Terapkan satu baris data stok dari database ke PRODUCTS
 */
function applyStockRow(row) {
  if (!row || row.product_id === undefined) return;
  const p = PRODUCTS.find(x => x.id === row.product_id);
  if (!p) return;

  if (p.variants && p.variants.length > 0) {
    const v = p.variants.find(item => item.name === row.variant);
    if (v) v.stock = row.stock;
  } else {
    p.stock = row.stock;
  }
}

/**
 * Ambil semua stok dari Supabase (dipakai saat halaman dibuka)
 */
async function loadStockFromDB() {
  try {
    const { data, error } = await db.from("menu_stock").select("*");
    if (error) {
      console.error("Gagal memuat stok:", error.message);
      return;
    }
    data.forEach(applyStockRow);
  } catch (e) {
    console.error("Gagal terhubung ke database:", e);
  }
}

/**
 * Dengarkan perubahan stok secara realtime dari HP lain
 */
function listenStockRealtime() {
  db.channel("stock-live")
    .on("postgres_changes", { event: "*", schema: "public", table: "menu_stock" }, payload => {
      applyStockRow(payload.new);
      renderProducts();
      if (isAdminLoggedIn && !adminStockModal.classList.contains("hidden")) {
        renderAdminStockModal();
      }
    })
    .subscribe();
}

/**
 * Kirim stok terbaru satu produk/varian ke database (hanya admin dengan PIN benar)
 */
async function pushStock(productId, variantName) {
  const stock = getAvailableStock(productId, variantName);
  const { error } = await db.rpc("admin_set_stock", {
    p_pin: adminPinValue,
    p_product_id: productId,
    p_variant: variantName || "",
    p_stock: stock
  });
  if (error) {
    showToast("⚠️ Gagal menyimpan stok: " + error.message);
  }
}

/* --------------------------------------------------------------------------
   CART STORAGE (LOCALSTORAGE - KERANJANG MILIK MASING-MASING PELANGGAN)
   -------------------------------------------------------------------------- */

function loadCartFromStorage() {
  const storedCart = localStorage.getItem("bj_resto_cart_data");
  if (storedCart) {
    try {
      cart = JSON.parse(storedCart);
    } catch (e) {
      cart = [];
    }
  }
}

function saveCartToStorage() {
  localStorage.setItem("bj_resto_cart_data", JSON.stringify(cart));
}

/* --------------------------------------------------------------------------
   HELPER FUNCTIONS
   -------------------------------------------------------------------------- */

/**
 * Format angka menjadi format EGP (contoh: EGP 85)
 */
function formatEGP(number) {
  return "EGP " + (number || 0).toLocaleString("en-US");
}

/**
 * Tampilkan pesan Toast singkat
 */
function showToast(message) {
  toastEl.textContent = message;
  toastEl.classList.add("show");
  setTimeout(() => {
    toastEl.classList.remove("show");
  }, 2500);
}

/**
 * Dapatkan stok saat ini untuk produk & varian spesifik
 */
function getAvailableStock(productId, variantName) {
  const product = PRODUCTS.find(p => p.id === productId);
  if (!product) return 0;

  if (product.variants && product.variants.length > 0) {
    const v = product.variants.find(vItem => vItem.name === (variantName || product.variants[0].name));
    return v ? (v.stock || 0) : 0;
  }
  return product.stock || 0;
}

/**
 * Switch pilihan varian/ukuran produk
 */
function selectProductVariant(productId, variantName) {
  selectedVariantState[productId] = variantName;
  renderProducts();
}

/* --------------------------------------------------------------------------
   RENDER PRODUCTS
   -------------------------------------------------------------------------- */

function renderProducts() {
  productGrid.innerHTML = "";

  // Filter produk berdasarkan Kategori dan Kata Kunci Pencarian
  const filteredProducts = PRODUCTS.filter(product => {
    const matchesCategory = (currentCategory === "semua") || (product.category === currentCategory);
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Update Judul Kategori & Jumlah Menu
  const categoryNames = {
    semua: "Semua Menu",
    ayam: "Menu Ayam",
    bebek: "Menu Bebek",
    seafood: "Menu Seafood",
    extra: "Menu Extra",
    minuman: "Menu Minuman"
  };
  currentCategoryTitle.textContent = categoryNames[currentCategory] || "Menu";
  menuCountLabel.textContent = `${filteredProducts.length} Produk`;

  // Tampilkan State Kosong jika tidak ada hasil
  if (filteredProducts.length === 0) {
    emptyState.classList.remove("hidden");
  } else {
    emptyState.classList.add("hidden");
  }

  // Generate HTML Card untuk setiap produk
  filteredProducts.forEach(product => {
    // Tentukan varian aktif (default ke varian pertama jika belum dipilih)
    let activeVariantName = "";
    let activePrice = product.price || 0;

    if (product.variants && product.variants.length > 0) {
      if (!selectedVariantState[product.id]) {
        selectedVariantState[product.id] = product.variants[0].name;
      }
      activeVariantName = selectedVariantState[product.id];
      const foundVariant = product.variants.find(v => v.name === activeVariantName);
      if (foundVariant) {
        activePrice = foundVariant.price;
      }
    }

    // Dapatkan stok varian/produk aktif
    const currentStock = getAvailableStock(product.id, activeVariantName);

    // Cari item di keranjang dengan id dan varian yang cocok (normalisasi string)
    const cartItem = cart.find(item => item.id === product.id && (item.variant || "") === (activeVariantName || ""));
    const itemQty = cartItem ? cartItem.qty : 0;

    const card = document.createElement("div");
    card.className = `product-card ${currentStock <= 0 ? 'out-of-stock' : ''}`;

    // Generate pilihan varian jika ada
    let variantsHTML = "";
    if (product.variants && product.variants.length > 0) {
      const isTempVariant = product.variants[0].name === "Hot" || product.variants[0].name === "Cold";
      const variantLabelText = isTempVariant ? "Pilihan Suhu:" : "Pilih Ukuran:";

      variantsHTML = `
        <div class="variant-container">
          <div class="variant-label">${variantLabelText}</div>
          <div class="variant-pill-group">
            ${product.variants.map(v => {
        const vStock = v.stock || 0;
        const isOut = vStock <= 0;
        return `
                <button 
                  class="variant-pill ${v.name === activeVariantName ? 'active' : ''} ${isOut ? 'out-stock-pill' : ''}"
                  onclick="selectProductVariant(${product.id}, '${v.name}')"
                >
                  ${v.name} (${formatEGP(v.price)})${isOut ? ' [Habis]' : ''}
                </button>
              `;
      }).join('')}
          </div>
        </div>
      `;
    }

    // Badge Stok dengan SVG real
    let stockBadgeHTML = "";
    if (currentStock <= 0) {
      stockBadgeHTML = `<span class="stock-badge out-stock"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg> Stok Habis</span>`;
    } else if (currentStock <= 5) {
      stockBadgeHTML = `<span class="stock-badge low-stock"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg> Sisa ${currentStock}</span>`;
    } else {
      stockBadgeHTML = `<span class="stock-badge in-stock"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg> Stok: ${currentStock}</span>`;
    }

    card.innerHTML = `
      <div class="product-image-container">
        <img 
          src="${product.image}" 
          alt="${product.name}" 
          class="product-image"
          loading="lazy"
          onerror="this.src='https://placehold.co/400x300/f3f4f6/94a3b8?text=${encodeURIComponent(product.name)}'"
        >
        <span class="product-category-tag">${product.category}</span>
      </div>
      <div class="product-info">
        <div style="display:flex; justify-content:space-between; align-items:flex-start; gap:0.5rem; margin-bottom:0.35rem;">
          <h3 class="product-title" style="margin-bottom:0;">${product.name}</h3>
          ${stockBadgeHTML}
        </div>
        <p class="product-description">${product.description}</p>
        
        ${variantsHTML}

        <div class="product-footer">
          <span class="product-price">${formatEGP(activePrice)}</span>
          ${currentStock <= 0
        ? `
                <button class="btn-add disabled" disabled>
                  Stok Habis
                </button>
              `
        : itemQty > 0
          ? `
                <div class="qty-controller">
                  <button class="qty-btn minus" onclick="updateCartQty(${product.id}, '${activeVariantName}', -1)">-</button>
                  <span class="qty-number">${itemQty}</span>
                  <button class="qty-btn plus" onclick="updateCartQty(${product.id}, '${activeVariantName}', 1)">+</button>
                </div>
              `
          : `
                <button class="btn-add" onclick="addToCart(${product.id})">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                  Tambah
                </button>
              `
      }
        </div>
      </div>
    `;

    productGrid.appendChild(card);
  });
}

/* --------------------------------------------------------------------------
   CART MANAGEMENT LOGIC
   -------------------------------------------------------------------------- */

/**
 * Tambah produk ke keranjang
 */
function addToCart(productId) {
  const product = PRODUCTS.find(p => p.id === productId);
  if (!product) return;

  let activeVariant = "";
  let activePrice = product.price || 0;

  if (product.variants && product.variants.length > 0) {
    activeVariant = selectedVariantState[productId] || product.variants[0].name;
    const vObj = product.variants.find(v => v.name === activeVariant);
    if (vObj) activePrice = vObj.price;
  }

  const availableStock = getAvailableStock(productId, activeVariant);
  const existingItem = cart.find(item => item.id === productId && (item.variant || "") === (activeVariant || ""));
  const currentCartQty = existingItem ? existingItem.qty : 0;

  if (currentCartQty + 1 > availableStock) {
    showToast(`⚠️ Stok ${product.name} ${activeVariant ? '(' + activeVariant + ')' : ''} tidak mencukupi!`);
    return;
  }

  if (existingItem) {
    existingItem.qty += 1;
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      variant: activeVariant,
      price: activePrice,
      image: product.image,
      qty: 1
    });
  }

  saveCartToStorage();
  const displayName = product.name + (activeVariant ? ` (${activeVariant})` : "");
  showToast(`✅ ${displayName} ditambahkan ke keranjang`);
  updateCartUI();
  renderProducts();
}

/**
 * Ubah jumlah pesanan produk di keranjang (+1 atau -1)
 */
function updateCartQty(productId, variantName, change) {
  const normVariant = variantName || "";
  const itemIndex = cart.findIndex(item => item.id === productId && (item.variant || "") === normVariant);

  if (itemIndex > -1) {
    if (change > 0) {
      const availableStock = getAvailableStock(productId, normVariant);
      if (cart[itemIndex].qty + 1 > availableStock) {
        showToast(`⚠️ Stok maksimum sudah tercapai!`);
        return;
      }
    }

    cart[itemIndex].qty += change;
    if (cart[itemIndex].qty <= 0) {
      cart.splice(itemIndex, 1);
    }
  }

  saveCartToStorage();
  updateCartUI();
  renderProducts();
  if (!cartModal.classList.contains("hidden")) {
    renderCartModal();
  }
}

/**
 * Hapus produk dari keranjang
 */
function removeFromCart(productId, variantName) {
  const normVariant = variantName || "";
  const item = cart.find(i => i.id === productId && (i.variant || "") === normVariant);
  cart = cart.filter(i => !(i.id === productId && (i.variant || "") === normVariant));

  if (item) {
    const displayName = item.name + (item.variant ? ` (${item.variant})` : "");
    showToast(`🗑️ ${displayName} dihapus`);
  }

  saveCartToStorage();
  updateCartUI();
  renderProducts();
  renderCartModal();
}

/**
 * Hitung Total Item dan Total Harga Keranjang
 */
function getCartTotals() {
  const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
  const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
  return { totalItems, totalPrice };
}

/**
 * Update tampilan Floating Cart Bar
 */
function updateCartUI() {
  const { totalItems, totalPrice } = getCartTotals();

  if (totalItems > 0) {
    floatingCartBar.classList.remove("hidden");
    cartBadge.textContent = totalItems;
    cartItemCount.textContent = `${totalItems} item pesanan`;
    cartTotalPrice.textContent = formatEGP(totalPrice);
  } else {
    floatingCartBar.classList.add("hidden");
    closeCartModal();
  }
}

/* --------------------------------------------------------------------------
   CART MODAL RENDER & EVENTS
   -------------------------------------------------------------------------- */

function renderCartModal() {
  cartItemsContainer.innerHTML = "";
  const { totalItems, totalPrice } = getCartTotals();

  if (cart.length === 0) {
    modalEmptyCart.classList.remove("hidden");
    cartFooter.classList.add("hidden");
  } else {
    modalEmptyCart.classList.add("hidden");
    cartFooter.classList.remove("hidden");

    cart.forEach(item => {
      const itemEl = document.createElement("div");
      itemEl.className = "cart-item";

      const subtotal = item.price * item.qty;
      const displayName = item.name + (item.variant ? ` (${item.variant})` : "");
      const safeVariant = item.variant || "";

      itemEl.innerHTML = `
        <img src="${item.image}" alt="${item.name}" class="cart-item-img" onerror="this.src='https://placehold.co/100x100/f3f4f6/94a3b8?text=Food'">
        <div class="cart-item-details">
          <h4 class="cart-item-title">${displayName}</h4>
          <div class="cart-item-price">${formatEGP(item.price)} × ${item.qty}</div>
          <div class="cart-item-subtotal">${formatEGP(subtotal)}</div>
        </div>
        <div class="cart-item-actions">
          <button class="cart-qty-btn" onclick="updateCartQty(${item.id}, '${safeVariant}', -1)">-</button>
          <span class="cart-item-qty">${item.qty}</span>
          <button class="cart-qty-btn" onclick="updateCartQty(${item.id}, '${safeVariant}', 1)">+</button>
          <button class="btn-remove-item" onclick="removeFromCart(${item.id}, '${safeVariant}')" aria-label="Hapus produk">&times;</button>
        </div>
      `;

      cartItemsContainer.appendChild(itemEl);
    });

    modalSubtotalPrice.textContent = formatEGP(totalPrice);
    modalTotalPrice.textContent = formatEGP(totalPrice);
  }
}

function openCartModal() {
  if (cart.length === 0) return;
  renderCartModal();
  cartModal.classList.remove("hidden");
  document.body.style.overflow = "hidden"; // Disable scroll behind modal
}

function closeCartModal() {
  cartModal.classList.add("hidden");
  document.body.style.overflow = "";
}

/* --------------------------------------------------------------------------
   CHECKOUT MODAL & WHATSAPP GENERATION LOGIC
   -------------------------------------------------------------------------- */

function getDeliveryFee() {
  if (currentOrderType !== "delivery") return 0;
  if (currentDeliveryArea === "darrasah") return 5;
  if (currentDeliveryArea === "gamaliah" || currentDeliveryArea === "buuts") return 10;
  return 10;
}

function updateCheckoutSummary() {
  const { totalPrice: foodSubtotal } = getCartTotals();
  const deliveryFee = getDeliveryFee();
  const grandTotal = foodSubtotal + deliveryFee;

  if (checkoutSubtotalAmount) checkoutSubtotalAmount.textContent = formatEGP(foodSubtotal);

  if (checkoutDeliveryFee) {
    if (currentOrderType === "delivery") {
      const areaLabel = currentDeliveryArea === "darrasah" ? "Darrasah" : (currentDeliveryArea === "gamaliah" ? "Gamaliah" : "Buuts");
      checkoutDeliveryFee.textContent = `${formatEGP(deliveryFee)} (${areaLabel})`;
    } else {
      checkoutDeliveryFee.textContent = "Gratis (EGP 0)";
    }
  }

  if (checkoutTotalAmount) checkoutTotalAmount.textContent = formatEGP(grandTotal);
}

function openCheckoutModal() {
  if (cart.length === 0) return;

  // Render Ringkasan Pesanan di Modal Checkout
  checkoutItemsList.innerHTML = "";

  cart.forEach(item => {
    const row = document.createElement("div");
    row.className = "checkout-item-row";
    const displayName = item.name + (item.variant ? ` (${item.variant})` : "");
    row.innerHTML = `
      <span class="checkout-item-name">${displayName} (${item.qty}x)</span>
      <span class="checkout-item-subtotal">${formatEGP(item.price * item.qty)}</span>
    `;
    checkoutItemsList.appendChild(row);
  });

  updateCheckoutSummary();

  closeCartModal();
  checkoutModal.classList.remove("hidden");
  document.body.style.overflow = "hidden";

  // Auto focus input nama
  setTimeout(() => {
    customerNameInput.focus();
  }, 100);
}

function closeCheckoutModal() {
  checkoutModal.classList.add("hidden");
  document.body.style.overflow = "";
}

/**
 * Format & Kirim Pesanan ke WhatsApp Admin
 */
function sendOrderToWhatsApp() {
  const customerName = customerNameInput.value.trim();

  if (!customerName) {
    alert("Silakan masukkan Nama Pemesan terlebih dahulu.");
    customerNameInput.focus();
    return;
  }

  let deliveryAddress = "";
  let deliveryShareloc = "";
  let deliveryLandmark = "";

  if (currentOrderType === "delivery") {
    deliveryAddress = deliveryAddressInput ? deliveryAddressInput.value.trim() : "";
    deliveryShareloc = deliverySharelocInput ? deliverySharelocInput.value.trim() : "";
    deliveryLandmark = deliveryLandmarkInput ? deliveryLandmarkInput.value.trim() : "";

    if (!deliveryAddress) {
      alert("Silakan masukkan Alamat Lengkap Delivery Anda.");
      if (deliveryAddressInput) deliveryAddressInput.focus();
      return;
    }
  }

  const { totalPrice: foodSubtotal } = getCartTotals();
  const deliveryFee = getDeliveryFee();
  const grandTotal = foodSubtotal + deliveryFee;

  // Label Tipe Pesanan
  let orderTypeLabel = "Dine In (Makan di Tempat - Free Nasi)";
  if (currentOrderType === "take_away") orderTypeLabel = "Take Away (Bawa Pulang)";
  if (currentOrderType === "delivery") orderTypeLabel = "Delivery (Pesan Antar)";

  // Format Rincian Pesanan Makanan
  let orderDetailsText = "";
  cart.forEach((item, index) => {
    const itemSubtotal = item.price * item.qty;
    const displayName = item.name + (item.variant ? ` (${item.variant})` : "");
    orderDetailsText += `${index + 1}. ${displayName}\n   ${item.qty} × ${formatEGP(item.price)} = ${formatEGP(itemSubtotal)}\n\n`;
  });

  // Teks Informasi Tambahan Khusus Delivery
  let deliveryInfoText = "";
  if (currentOrderType === "delivery") {
    const areaName = currentDeliveryArea === "darrasah" ? "Darrasah" : (currentDeliveryArea === "gamaliah" ? "Gamaliah" : "Buuts");
    deliveryInfoText = 
`📍 *Area Delivery:* ${areaName} (Biaya: ${formatEGP(deliveryFee)})
🏠 *Alamat Lengkap:* ${deliveryAddress}
🧭 *Link Share Location:* ${deliveryShareloc ? deliveryShareloc : 'Tidak dilampirkan'}
📝 *Patokan Alamat:* ${deliveryLandmark ? deliveryLandmark : '-'}

`;
  }

  // Format Pesanan Lengkap ke WhatsApp
  const whatsappMessage = 
`🍽️ *PESANAN BJ RESTO*

👤 *Nama Pemesan:* ${customerName}
📌 *Tipe Pesanan:* ${orderTypeLabel}
${deliveryInfoText}*Detail Pesanan Makanan/Minuman:*

${orderDetailsText.trim()}

━━━━━━━━━━━━
🍱 *Subtotal Makanan:* ${formatEGP(foodSubtotal)}
${currentOrderType === "delivery" ? `🛵 *Biaya Delivery:* ${formatEGP(deliveryFee)}\n` : ""}💰 *TOTAL PEMBAYARAN: ${formatEGP(grandTotal)}*
━━━━━━━━━━━━

Terima kasih.`;

  // Encode message agar aman dimasukkan ke URL
  const encodedText = encodeURIComponent(whatsappMessage);

  // URL WhatsApp Click to Chat
  const waUrl = `https://wa.me/${ADMIN_WHATSAPP}?text=${encodedText}`;

  // Buka WhatsApp di Tab Baru / Aplikasi WhatsApp
  window.open(waUrl, "_blank");

  showToast(" Mengalihkan ke WhatsApp...");
}

/* --------------------------------------------------------------------------
   ADMIN STOCK MANAGEMENT SYSTEM
   -------------------------------------------------------------------------- */

function openAdminPanel() {
  if (isAdminLoggedIn) {
    openAdminStockModal();
  } else {
    adminPinInput.value = "";
    adminLoginError.classList.add("hidden");
    adminLoginModal.classList.remove("hidden");
    document.body.style.overflow = "hidden";
    setTimeout(() => adminPinInput.focus(), 100);
  }
}

function closeAdminLoginModal() {
  adminLoginModal.classList.add("hidden");
  document.body.style.overflow = "";
}

/**
 * Login admin: PIN dicek oleh Supabase (tidak ada PIN di kode)
 */
async function authenticateAdmin() {
  const enteredPin = adminPinInput.value.trim();
  if (!enteredPin) return;

  const { data, error } = await db.rpc("admin_check_pin", { p_pin: enteredPin });

  if (!error && data === true) {
    adminPinValue = enteredPin;
    isAdminLoggedIn = true;
    adminPanelBtn.classList.add("admin-active");
    adminPanelBtn.textContent = "⚙️ Admin Mode";
    closeAdminLoginModal();
    showToast("🔑 Login Admin berhasil!");
    openAdminStockModal();
  } else {
    adminLoginError.classList.remove("hidden");
    adminPinInput.focus();
  }
}

function openAdminStockModal() {
  renderAdminStockModal();
  adminStockModal.classList.remove("hidden");
  document.body.style.overflow = "hidden";
}

function closeAdminStockModal() {
  adminStockModal.classList.add("hidden");
  document.body.style.overflow = "";
}

function updateVariantStock(productId, variantName, delta) {
  const product = PRODUCTS.find(p => p.id === productId);
  if (!product) return;

  if (product.variants && product.variants.length > 0) {
    const v = product.variants.find(vItem => vItem.name === variantName);
    if (v) {
      v.stock = Math.max(0, (v.stock || 0) + delta);
    }
  } else {
    product.stock = Math.max(0, (product.stock || 0) + delta);
  }

  pushStock(productId, variantName);
  renderAdminStockModal();
  renderProducts();
}

function setVariantStock(productId, variantName, newStockVal) {
  const product = PRODUCTS.find(p => p.id === productId);
  if (!product) return;

  const val = Math.max(0, parseInt(newStockVal) || 0);

  if (product.variants && product.variants.length > 0) {
    const v = product.variants.find(vItem => vItem.name === variantName);
    if (v) v.stock = val;
  } else {
    product.stock = val;
  }

  pushStock(productId, variantName);
  renderProducts();
}

function toggleVariantAvailability(productId, variantName) {
  const product = PRODUCTS.find(p => p.id === productId);
  if (!product) return;

  if (product.variants && product.variants.length > 0) {
    const v = product.variants.find(vItem => vItem.name === variantName);
    if (v) {
      v.stock = v.stock > 0 ? 0 : 20;
    }
  } else {
    product.stock = product.stock > 0 ? 0 : 20;
  }

  pushStock(productId, variantName);
  renderAdminStockModal();
  renderProducts();
}

async function resetAllStockToDefault() {
  if (!confirm("Apakah Anda yakin ingin mengembalikan semua stok ke jumlah awal (default)?")) return;

  PRODUCTS = JSON.parse(JSON.stringify(INITIAL_PRODUCTS));

  for (const p of PRODUCTS) {
    if (p.variants && p.variants.length > 0) {
      for (const v of p.variants) {
        await pushStock(p.id, v.name);
      }
    } else {
      await pushStock(p.id, "");
    }
  }

  renderAdminStockModal();
  renderProducts();
  showToast("🔄 Stok berhasil direset ke default!");
}

function renderAdminStockModal() {
  adminStockList.innerHTML = "";

  const filtered = PRODUCTS.filter(p =>
    p.name.toLowerCase().includes(adminSearchQuery.toLowerCase()) ||
    p.category.toLowerCase().includes(adminSearchQuery.toLowerCase())
  );

  if (filtered.length === 0) {
    adminStockList.innerHTML = `<p style="text-align:center; color:var(--text-muted); padding:2rem;">Menu tidak ditemukan.</p>`;
    return;
  }

  filtered.forEach(product => {
    const itemEl = document.createElement("div");
    itemEl.className = "admin-stock-item";

    let variantsControlsHTML = "";

    if (product.variants && product.variants.length > 0) {
      variantsControlsHTML = `
        <div class="admin-stock-variants">
          ${product.variants.map(v => {
        const vStock = v.stock || 0;
        const isAvailable = vStock > 0;
        return `
              <div class="admin-variant-row">
                <span class="variant-stock-label">${v.name} (${formatEGP(v.price)})</span>
                <div class="stock-control-group">
                  <button class="btn-stock-adj" onclick="updateVariantStock(${product.id}, '${v.name}', -1)">-</button>
                  <input 
                    type="number" 
                    class="stock-input-field" 
                    value="${vStock}" 
                    min="0"
                    onchange="setVariantStock(${product.id}, '${v.name}', this.value)"
                  >
                  <button class="btn-stock-adj" onclick="updateVariantStock(${product.id}, '${v.name}', 1)">+</button>
                  <button 
                    class="btn-toggle-out ${isAvailable ? 'available' : 'soldout'}" 
                    onclick="toggleVariantAvailability(${product.id}, '${v.name}')"
                  >
                    ${isAvailable ? 'Tersedia' : 'Habis'}
                  </button>
                </div>
              </div>
            `;
      }).join('')}
        </div>
      `;
    } else {
      const pStock = product.stock || 0;
      const isAvailable = pStock > 0;
      variantsControlsHTML = `
        <div class="admin-stock-variants">
          <div class="admin-variant-row">
            <span class="variant-stock-label">Standar (${formatEGP(product.price)})</span>
            <div class="stock-control-group">
              <button class="btn-stock-adj" onclick="updateVariantStock(${product.id}, '', -1)">-</button>
              <input 
                type="number" 
                class="stock-input-field" 
                value="${pStock}" 
                min="0"
                onchange="setVariantStock(${product.id}, '', this.value)"
              >
              <button class="btn-stock-adj" onclick="updateVariantStock(${product.id}, '', 1)">+</button>
              <button 
                class="btn-toggle-out ${isAvailable ? 'available' : 'soldout'}" 
                onclick="toggleVariantAvailability(${product.id}, '')"
              >
                ${isAvailable ? 'Tersedia' : 'Habis'}
              </button>
            </div>
          </div>
        </div>
      `;
    }

    itemEl.innerHTML = `
      <div class="admin-stock-info">
        <img src="${product.image}" alt="${product.name}" class="admin-stock-thumb" onerror="this.src='https://placehold.co/80x80/f3f4f6/94a3b8?text=Food'">
        <div>
          <div class="admin-stock-name">${product.name}</div>
          <div class="admin-stock-category">${product.category}</div>
        </div>
      </div>
      ${variantsControlsHTML}
    `;

    adminStockList.appendChild(itemEl);
  });
}

/* --------------------------------------------------------------------------
   EVENT LISTENERS & INITIALIZATION
   -------------------------------------------------------------------------- */

document.addEventListener("DOMContentLoaded", async () => {
  // Tampilkan menu dulu (stok default), lalu perbarui dengan data dari database
  loadCartFromStorage();
  renderProducts();
  updateCartUI();

  await loadStockFromDB();
  renderProducts();
  listenStockRealtime();

  // Event listener Kategori Menu
  categoryButtons.forEach(button => {
    button.addEventListener("click", () => {
      categoryButtons.forEach(btn => btn.classList.remove("active"));
      button.classList.add("active");
      currentCategory = button.getAttribute("data-category");
      renderProducts();
    });
  });

  // Event listener Pencarian Menu Utama
  searchInput.addEventListener("input", (e) => {
    searchQuery = e.target.value;
    renderProducts();
  });

  // Event listener Floating Cart Bar
  cartBarTrigger.addEventListener("click", openCartModal);
  closeCartBtn.addEventListener("click", closeCartModal);

  // Event listener Checkout
  checkoutBtn.addEventListener("click", openCheckoutModal);
  closeCheckoutBtn.addEventListener("click", closeCheckoutModal);
  sendWhatsappBtn.addEventListener("click", sendOrderToWhatsApp);

  // Event listener Order Type cards (Dine In, Take Away, Delivery)
  orderTypeCards.forEach(card => {
    card.addEventListener("click", () => {
      orderTypeCards.forEach(c => c.classList.remove("active"));
      card.classList.add("active");
      currentOrderType = card.getAttribute("data-type");

      if (currentOrderType === "delivery") {
        if (deliveryFieldsContainer) deliveryFieldsContainer.classList.remove("hidden");
      } else {
        if (deliveryFieldsContainer) deliveryFieldsContainer.classList.add("hidden");
      }
      updateCheckoutSummary();
    });
  });

  // Event listener Delivery Area pills
  areaPills.forEach(pill => {
    pill.addEventListener("click", () => {
      areaPills.forEach(p => p.classList.remove("active"));
      pill.classList.add("active");
      currentDeliveryArea = pill.getAttribute("data-area");
      updateCheckoutSummary();
    });
  });

  // Admin Events
  adminPanelBtn.addEventListener("click", openAdminPanel);
  closeAdminLoginBtn.addEventListener("click", closeAdminLoginModal);
  adminLoginSubmit.addEventListener("click", authenticateAdmin);
  adminPinInput.addEventListener("keyup", (e) => {
    if (e.key === "Enter") authenticateAdmin();
  });

  closeAdminStockBtn.addEventListener("click", closeAdminStockModal);
  closeStockModalFooter.addEventListener("click", closeAdminStockModal);

  adminStockSearch.addEventListener("input", (e) => {
    adminSearchQuery = e.target.value;
    renderAdminStockModal();
  });

  resetStockBtn.addEventListener("click", resetAllStockToDefault);

  // Close modals when clicking overlay background
  cartModal.addEventListener("click", (e) => {
    if (e.target === cartModal) closeCartModal();
  });

  checkoutModal.addEventListener("click", (e) => {
    if (e.target === checkoutModal) closeCheckoutModal();
  });

  adminLoginModal.addEventListener("click", (e) => {
    if (e.target === adminLoginModal) closeAdminLoginModal();
  });

  adminStockModal.addEventListener("click", (e) => {
    if (e.target === adminStockModal) closeAdminStockModal();
  });
});
