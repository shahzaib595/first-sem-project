/* =====================================================
   Bronx Luggage — shared script (all pages)
   Each page only runs the parts it has markup for.
   ===================================================== */

// Lets CSS know JavaScript is running (used by the reveal animation)
document.documentElement.classList.add('js');

/* ---------------------------------------------------
   DATA
--------------------------------------------------- */
const productsData = [
  { id:1, title:'Apex Horizon Spinner 28"', brand:"Samsonite", category:"Luggage", gender:"Unisex", price:289, rating:4.8, specs:"Scratch-resistant polycarbonate, dual spinner wheels, TSA lock", image:"https://images.unsplash.com/photo-1565026057447-b8899f291105?auto=format&fit=crop&w=600&q=80", badge:"Best Seller" },
  { id:2, title:"Navigator Leather Executive Briefcase", brand:"Tumi", category:"Briefcases", gender:"Men", price:340, rating:4.9, specs:'Full-grain Italian leather, 15" laptop sleeve, RFID protection', image:"https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=600&q=80", badge:"Premium" },
  { id:3, title:"Nomad Venture Hiking Backpack", brand:"Travelpro", category:"Backpacks", gender:"Unisex", price:160, rating:4.7, specs:"40L capacity, anti-gravity mesh suspension, waterproof cover", image:"https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=600&q=80", badge:"New" },
  { id:4, title:"Riviera Weekender Duffle Bag", brand:"Away", category:"Bags", gender:"Women", price:215, rating:4.6, specs:"Water-resistant canvas, shoe compartment, trolley sleeve", image:"https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=600&q=80", badge:"Popular" },
  { id:5, title:"TSA Lock & Packing Cubes Kit", brand:"American Tourister", category:"Accessories", gender:"Unisex", price:45, rating:4.9, specs:"3-piece packing cubes plus steel cable TSA combination lock", image:"https://images.unsplash.com/photo-1527631746610-bca00a040d60?auto=format&fit=crop&w=600&q=80", badge:"Essential" },
  { id:6, title:"Metro Slim Carry-On Luggage", brand:"Delsey", category:"Luggage", gender:"Men", price:310, rating:4.8, specs:"Aircraft-grade aluminum handle, built-in USB charging port", image:"https://images.unsplash.com/photo-1565026057447-b8899f291105?auto=format&fit=crop&w=600&q=80", badge:"Tech Ready" },
  { id:7, title:"Heritage Women's City Tote", brand:"Away", category:"Bags", gender:"Women", price:89, rating:4.5, specs:"Reinforced straps, magnetic snap closure, organizer pockets", image:"https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=600&q=80", badge:"Casual" },
  { id:8, title:'ProFlight Trunk Spinner 30"', brand:"Samsonite", category:"Luggage", gender:"Unisex", price:240, rating:4.6, specs:"Expandable zipper compartment, high-impact ABS shell", image:"https://images.unsplash.com/photo-1565026057447-b8899f291105?auto=format&fit=crop&w=600&q=80", badge:"Heavy Duty" }
];

const brandsData = [
  { name:"Samsonite", icon:"fa-suitcase", desc:"Durable hardshell spinners." },
  { name:"Tumi", icon:"fa-briefcase", desc:"Executive luxury bags." },
  { name:"Away", icon:"fa-plane", desc:"Sleek travel carry-ons." },
  { name:"Travelpro", icon:"fa-compass", desc:"Flight-crew reliability." },
  { name:"Delsey", icon:"fa-shield-halved", desc:"French, elegant design." },
  { name:"American Tourister", icon:"fa-bag-shopping", desc:"Vibrant and affordable." }
];

const galleryData = [
  { img:"https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1000&q=80", caption:"Store front at Festival Marketplace" },
  { img:"https://images.unsplash.com/photo-1565026057447-b8899f291105?auto=format&fit=crop&w=1000&q=80", caption:"Hardshell luggage collection" },
  { img:"https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=1000&q=80", caption:"Leather briefcase counter" },
  { img:"https://images.unsplash.com/photo-1527631746610-bca00a040d60?auto=format&fit=crop&w=1000&q=80", caption:"TSA accessories & packing gear" },
  { img:"https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1000&q=80", caption:"Customer advisory lounge" },
  { img:"https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=1000&q=80", caption:"Backpack & duffle section" }
];

/* ---------------------------------------------------
   HELPERS
--------------------------------------------------- */
const $  = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

function escapeHTML(value){
  return String(value).replace(/[&<>"']/g, ch => (
    { '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[ch]
  ));
}

// localStorage wrapper that never throws (private mode, blocked storage, bad JSON)
const store = {
  get(key, fallback){
    try {
      const raw = localStorage.getItem(key);
      return raw === null ? fallback : JSON.parse(raw);
    } catch (e) { return fallback; }
  },
  set(key, value){
    try { localStorage.setItem(key, JSON.stringify(value)); return true; }
    catch (e) { return false; }
  }
};

// If any <img> fails to load, swap in a placeholder once (no inline onerror needed)
document.addEventListener('error', (e) => {
  const img = e.target;
  if (!(img instanceof HTMLImageElement) || img.dataset.failed) return;
  img.dataset.failed = '1';
  const label = img.dataset.fallback || img.alt || 'Bronx Luggage';
  const size  = img.dataset.fallbackSize || '800x600';
  img.src = `https://placehold.co/${size}/211815/F1EAD9?text=${encodeURIComponent(label)}`;
}, true);

// Toast
let toastTimer = null;
function showToast(text){
  const toast = $('#toast');
  if (!toast) return;
  $('#toast-message').textContent = text;
  toast.classList.remove('hidden');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.add('hidden'), 3000);
}

// Stars: supports halves, e.g. 4.6 -> 4.5
function renderStarRatingHTML(rating){
  const r = Math.round(Number(rating) * 2) / 2;
  let html = '';
  for (let i = 1; i <= 5; i++){
    if (r >= i)            html += '<i class="fa-solid fa-star"></i>';
    else if (r >= i - .5)  html += '<i class="fa-solid fa-star-half-stroke"></i>';
    else                   html += '<i class="fa-regular fa-star is-empty"></i>';
  }
  return html;
}

const pluralStars = n => `${n} ${n === 1 ? 'Star' : 'Stars'}`;

/* ---------------------------------------------------
   SHARED: header, visitor counter, ticker, reveal
--------------------------------------------------- */
function initMobileMenu(){
  const btn  = $('#mobile-toggle-btn');
  const menu = $('#mobile-menu');
  const icon = $('#menu-icon');
  if (!btn || !menu) return;

  const setOpen = (open) => {
    menu.classList.toggle('open', open);
    btn.setAttribute('aria-expanded', String(open));
    if (icon) icon.className = open ? 'fa-solid fa-xmark' : 'fa-solid fa-bars';
  };

  btn.addEventListener('click', () => setOpen(!menu.classList.contains('open')));
  $$('a', menu).forEach(a => a.addEventListener('click', () => setOpen(false)));
  window.addEventListener('resize', () => { if (window.innerWidth >= 900) setOpen(false); });
}

// Simulated visitor counter — counts once per browser session, not on every page change
function initVisitorCounter(){
  const targets = $$('[data-visitor-count]');
  if (!targets.length) return;

  let count = Number(store.get('bronx_visits', 0)) || 0;
  let alreadyCounted = false;
  try { alreadyCounted = sessionStorage.getItem('bronx_counted') === '1'; } catch (e) {}

  if (!count) count = 1420;
  else if (!alreadyCounted) count += 1;

  store.set('bronx_visits', count);
  try { sessionStorage.setItem('bronx_counted', '1'); } catch (e) {}

  targets.forEach(el => { el.textContent = count.toLocaleString(); });
}

// Departure-board ticker: live clock + location (asked once per session)
function startTicker(){
  const clock = $('#ticker-clock');
  const geo   = $('#ticker-geo');
  if (!clock || !geo) return;

  const tick = () => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour:'2-digit', minute:'2-digit', second:'2-digit' });
    const dateStr = now.toLocaleDateString([], { month:'short', day:'numeric' });
    clock.textContent = `${dateStr}, ${timeStr}`;
  };
  tick();
  setInterval(tick, 1000);

  const showStore = () => { geo.innerHTML = '<i class="fa-solid fa-store"></i> Festival Marketplace Mall'; };
  const showNear  = (lat, lng) => { geo.innerHTML = `<i class="fa-solid fa-location-dot"></i> Near you (${lat}°, ${lng}°)`; };

  let cached = null;
  try { cached = sessionStorage.getItem('bronx_geo'); } catch (e) {}
  if (cached){
    if (cached === 'store') showStore();
    else { const [lat, lng] = cached.split(','); showNear(lat, lng); }
    return;
  }

  if (!('geolocation' in navigator)){ showStore(); return; }

  navigator.geolocation.getCurrentPosition(
    (pos) => {
      const lat = pos.coords.latitude.toFixed(2);
      const lng = pos.coords.longitude.toFixed(2);
      try { sessionStorage.setItem('bronx_geo', `${lat},${lng}`); } catch (e) {}
      showNear(lat, lng);
    },
    () => {
      try { sessionStorage.setItem('bronx_geo', 'store'); } catch (e) {}
      showStore();
    },
    { timeout: 8000 }
  );
}

function initReveal(){
  const els = $$('[data-reveal]');
  if (!els.length) return;
  if (!('IntersectionObserver' in window)){
    els.forEach(el => el.classList.add('is-visible'));
    return;
  }
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting){
        entry.target.classList.add('is-visible');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  els.forEach(el => io.observe(el));
}

/* ---------------------------------------------------
   PRODUCTS (used on Home + Shop)
--------------------------------------------------- */
const getSavedRatings = () => store.get('bronx_ratings', {});

function productCardHTML(item, mode){
  const rating = getSavedRatings()[item.id] || item.rating;
  const title  = escapeHTML(item.title);
  const action = mode === 'link'
    ? `<a class="qv-btn" href="shop.html?product=${item.id}">View details</a>`
    : `<button type="button" class="qv-btn" data-quickview="${item.id}">Quick view</button>`;

  return `
  <article class="card">
    <div class="card-media">
      <span class="stamp-badge">${escapeHTML(item.badge)}</span>
      <img src="${item.image}" alt="${title}" loading="lazy" data-fallback="${title}" data-fallback-size="600x400">
    </div>
    <div class="card-body">
      <div class="card-top"><span class="card-brand">${escapeHTML(item.brand)}</span><span class="card-cat">${escapeHTML(item.category)}</span></div>
      <h3>${title}</h3>
      <p class="specs">${escapeHTML(item.specs)}</p>
      <div class="rating-row stars" aria-label="Rated ${rating} out of 5">${renderStarRatingHTML(rating)}<span>(${rating})</span></div>
    </div>
    <div class="card-foot">
      <span class="price">$${item.price}</span>
      ${action}
    </div>
  </article>`;
}

/* ---------------------------------------------------
   HOME PAGE
--------------------------------------------------- */
function initHome(){
  const featured = $('#featured-grid');
  if (featured){
    const top = [...productsData].sort((a, b) => b.rating - a.rating || a.id - b.id).slice(0, 4);
    featured.innerHTML = top.map(p => productCardHTML(p, 'link')).join('');
  }

  const brands = $('#brands-grid');
  if (brands){
    brands.innerHTML = brandsData.map(b => `
      <a class="brand-plaque" href="shop.html?brand=${encodeURIComponent(b.name)}">
        <i class="fa-solid ${b.icon}"></i>
        <h4>${escapeHTML(b.name)}</h4>
        <p>${escapeHTML(b.desc)}</p>
      </a>`).join('');
  }
}

/* ---------------------------------------------------
   SHOP PAGE
--------------------------------------------------- */
let activeGender = 'all';
let selectedModalProductId = null;
let lastFocusedBeforeModal = null;

function setGender(target){
  activeGender = target;
  $$('.gender-tab').forEach(btn => {
    const on = btn.dataset.gender === target;
    btn.classList.toggle('is-active', on);
    btn.setAttribute('aria-pressed', String(on));
  });
}

function setSelectIfValid(select, value){
  if (!select || !value) return false;
  const ok = Array.from(select.options).some(o => o.value === value);
  if (ok) select.value = value;
  return ok;
}

function applyProductFilters(){
  const grid = $('#product-grid-container');
  if (!grid) return;

  const query    = $('#search-input').value.trim().toLowerCase();
  const category = $('#category-filter').value;
  const brand    = $('#brand-filter').value;
  const maxPrice = parseFloat($('#price-range').value);

  const filtered = productsData.filter(item => {
    const haystack = `${item.title} ${item.specs} ${item.brand} ${item.category}`.toLowerCase();
    const matchesSearch   = !query || haystack.includes(query);
    const matchesCategory = category === 'all' || item.category === category;
    const matchesBrand    = brand === 'all' || item.brand === brand;
    const matchesPrice    = item.price <= maxPrice;
    const matchesTarget   = activeGender === 'all' || item.gender === activeGender || item.gender === 'Unisex';
    return matchesSearch && matchesCategory && matchesBrand && matchesPrice && matchesTarget;
  });

  const noResults = $('#no-results-box');
  const count     = $('#result-count');

  if (!filtered.length){
    grid.innerHTML = '';
    noResults.classList.remove('hidden');
  } else {
    noResults.classList.add('hidden');
    grid.innerHTML = filtered.map(p => productCardHTML(p, 'modal')).join('');
  }
  if (count) count.textContent = `Showing ${filtered.length} of ${productsData.length} products`;
}

function resetAllFilters(){
  $('#search-input').value = '';
  $('#category-filter').value = 'all';
  $('#brand-filter').value = 'all';
  $('#price-range').value = 500;
  $('#price-value-display').textContent = '$500';
  setGender('all');
  applyProductFilters();
}

function renderModalStars(rating){
  const box = $('#modal-star-rating');
  const filledUpTo = Math.round(rating);
  let html = '';
  for (let i = 1; i <= 5; i++){
    html += `<button type="button" class="star-btn ${i <= filledUpTo ? '' : 'is-empty'}" data-rating="${i}" aria-label="Rate ${pluralStars(i)}"><i class="fa-solid fa-star"></i></button>`;
  }
  box.innerHTML = html + `<span class="rating-text">${rating} / 5</span>`;
}

function openProductModal(id){
  const product = productsData.find(p => p.id === id);
  const modal = $('#product-modal');
  if (!product || !modal) return;

  selectedModalProductId = id;
  lastFocusedBeforeModal = document.activeElement;
  const rating = getSavedRatings()[id] || product.rating;

  const img = $('#modal-image');
  delete img.dataset.failed;
  img.dataset.fallback = product.title;
  img.dataset.fallbackSize = '600x400';
  img.src = product.image;
  img.alt = product.title;

  $('#modal-brand').textContent = product.brand;
  $('#modal-title').textContent = product.title;
  $('#modal-price').textContent = `$${product.price}`;
  $('#modal-specs').textContent = `${product.specs} (${product.category} • ${product.gender})`;
  renderModalStars(rating);

  modal.classList.remove('hidden');
  document.body.classList.add('no-scroll');
  $('#modal-close-btn').focus();
}

function closeProductModal(){
  const modal = $('#product-modal');
  if (!modal || modal.classList.contains('hidden')) return;
  modal.classList.add('hidden');
  document.body.classList.remove('no-scroll');
  if (lastFocusedBeforeModal && lastFocusedBeforeModal.focus) lastFocusedBeforeModal.focus();
}

function saveProductRating(newRating){
  if (!selectedModalProductId) return;
  const saved = getSavedRatings();
  saved[selectedModalProductId] = newRating;
  store.set('bronx_ratings', saved);

  renderModalStars(newRating);
  applyProductFilters();
  showToast(`Rating saved (${pluralStars(newRating).toLowerCase()})`);
}

function initShop(){
  const grid = $('#product-grid-container');
  if (!grid) return;

  // Filter controls
  $('#search-input').addEventListener('input', applyProductFilters);
  $('#category-filter').addEventListener('change', applyProductFilters);
  $('#brand-filter').addEventListener('change', applyProductFilters);
  $('#price-range').addEventListener('input', (e) => {
    $('#price-value-display').textContent = `$${e.target.value}`;
    applyProductFilters();
  });
  $$('.gender-tab').forEach(btn => btn.addEventListener('click', () => {
    setGender(btn.dataset.gender);
    applyProductFilters();
  }));
  $$('[data-reset-filters]').forEach(btn => btn.addEventListener('click', resetAllFilters));

  // Quick view (event delegation, works after every re-render)
  grid.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-quickview]');
    if (btn) openProductModal(Number(btn.dataset.quickview));
  });

  // Modal controls
  const modal = $('#product-modal');
  $('#modal-close-btn').addEventListener('click', closeProductModal);
  modal.addEventListener('click', (e) => { if (e.target === modal) closeProductModal(); });
  $('#modal-star-rating').addEventListener('click', (e) => {
    const star = e.target.closest('[data-rating]');
    if (star) saveProductRating(Number(star.dataset.rating));
  });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeProductModal(); });

  // Pre-filter from links on other pages: shop.html?category=Luggage&gender=Men&brand=Tumi&q=leather&product=2
  const params = new URLSearchParams(window.location.search);
  setSelectIfValid($('#category-filter'), params.get('category'));
  setSelectIfValid($('#brand-filter'), params.get('brand'));
  const gender = params.get('gender');
  if (['Men', 'Women', 'Unisex'].includes(gender)) setGender(gender);
  if (params.get('q')) $('#search-input').value = params.get('q');

  applyProductFilters();

  const productId = Number(params.get('product'));
  if (productId) openProductModal(productId);
}

/* ---------------------------------------------------
   GALLERY PAGE
--------------------------------------------------- */
let galleryIndex = 0;

function showGalleryImage(index){
  galleryIndex = (index + galleryData.length) % galleryData.length;
  const item = galleryData[galleryIndex];
  const img = $('#lightbox-img');
  delete img.dataset.failed;
  img.dataset.fallback = item.caption;
  img.src = item.img;
  img.alt = item.caption;
  $('#lightbox-caption').textContent = item.caption;
}

function openGalleryModal(index){
  const modal = $('#gallery-modal');
  lastFocusedBeforeModal = document.activeElement;
  showGalleryImage(index);
  modal.classList.remove('hidden');
  document.body.classList.add('no-scroll');
  $('#lightbox-close-btn').focus();
}

function closeGalleryModal(){
  const modal = $('#gallery-modal');
  if (!modal || modal.classList.contains('hidden')) return;
  modal.classList.add('hidden');
  document.body.classList.remove('no-scroll');
  if (lastFocusedBeforeModal && lastFocusedBeforeModal.focus) lastFocusedBeforeModal.focus();
}

function initGallery(){
  const container = $('#gallery-container');
  if (!container) return;

  container.innerHTML = galleryData.map((g, i) => {
    const cap = escapeHTML(g.caption);
    return `
    <button type="button" class="gallery-item" data-index="${i}" aria-label="Open photo: ${cap}">
      <img src="${g.img}" alt="${cap}" loading="lazy" data-fallback="Store Gallery" data-fallback-size="600x400">
      <span class="gallery-caption"><span><i class="fa-solid fa-magnifying-glass"></i> ${cap}</span></span>
    </button>`;
  }).join('');

  container.addEventListener('click', (e) => {
    const item = e.target.closest('.gallery-item');
    if (item) openGalleryModal(Number(item.dataset.index));
  });

  const modal = $('#gallery-modal');
  $('#lightbox-close-btn').addEventListener('click', closeGalleryModal);
  $('#lightbox-prev').addEventListener('click', () => showGalleryImage(galleryIndex - 1));
  $('#lightbox-next').addEventListener('click', () => showGalleryImage(galleryIndex + 1));
  modal.addEventListener('click', (e) => { if (e.target === modal) closeGalleryModal(); });

  document.addEventListener('keydown', (e) => {
    if (modal.classList.contains('hidden')) return;
    if (e.key === 'Escape')     closeGalleryModal();
    if (e.key === 'ArrowLeft')  showGalleryImage(galleryIndex - 1);
    if (e.key === 'ArrowRight') showGalleryImage(galleryIndex + 1);
  });
}

/* ---------------------------------------------------
   CONTACT PAGE: contact form + feedback + reviews
--------------------------------------------------- */
let feedbackStars = 5;

function setFeedbackStars(n){
  feedbackStars = n;
  $$('#feedback-star-selector .star-btn').forEach((btn, i) => btn.classList.toggle('is-empty', i >= n));
  $('#feedback-star-label').textContent = pluralStars(n);
}

function renderReviewsList(){
  const container = $('#reviews-list');
  if (!container) return;
  const reviews = store.get('bronx_reviews', []);

  if (!Array.isArray(reviews) || !reviews.length){
    container.innerHTML = '<p class="review-empty">No reviews submitted yet. Be the first!</p>';
    return;
  }

  container.innerHTML = reviews.slice(0, 3).map(r => `
    <div class="review-card">
      <div class="review-top"><strong>${escapeHTML(r.name)}</strong><span>${escapeHTML(r.date)}</span></div>
      <div class="review-stars" aria-label="${escapeHTML(r.rating)} out of 5 stars">${renderStarRatingHTML(r.rating)}</div>
      <p class="review-msg">${escapeHTML(r.message)}</p>
    </div>`).join('');
}

function initContact(){
  const contactForm = $('#contact-form');
  if (contactForm){
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      showToast('Message sent to Festival Marketplace store!');
      contactForm.reset();
    });
  }

  const feedbackForm = $('#feedback-form');
  if (feedbackForm){
    $$('#feedback-star-selector .star-btn').forEach(btn => {
      btn.addEventListener('click', () => setFeedbackStars(Number(btn.dataset.value)));
    });

    feedbackForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name    = $('#feedback-name').value.trim();
      const message = $('#feedback-msg').value.trim();

      const reviews = store.get('bronx_reviews', []);
      reviews.unshift({ id: Date.now(), name, rating: feedbackStars, message, date: new Date().toLocaleDateString() });
      store.set('bronx_reviews', reviews);

      renderReviewsList();
      showToast('Thank you — feedback submitted.');
      feedbackForm.reset();
      setFeedbackStars(5);
    });

    renderReviewsList();
  }
}

/* ---------------------------------------------------
   START
--------------------------------------------------- */
document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();
  initVisitorCounter();
  startTicker();
  initReveal();
  initHome();
  initShop();
  initGallery();
  initContact();

  // Demo social links shouldn't jump the page to the top
  $$('a[href="#"]').forEach(a => a.addEventListener('click', e => e.preventDefault()));
});