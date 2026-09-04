/**
 * BURGER RESTAURANT WEB APP LOGIC
 * High-performance, responsive, interactive features
 */

document.addEventListener('DOMContentLoaded', () => {
  // Menu item database for cart & search
  const menuItems = [
    {
      id: 'veg-crispy',
      name: 'Veg Crispy Burger',
      price: 250,
      image: 'images/burger-1.png',
      description: 'Crisp golden veggie patty layered with fresh lettuce, garden tomatoes, and melted American cheese.'
    },
    {
      id: 'hot-crispy',
      name: 'Hot Crispy Burger',
      price: 250,
      image: 'images/burger-2.png',
      description: 'Spicy seasoned smash patty infused with jalapeños, chili flakes, and zesty cheddar melt.'
    },
    {
      id: 'veg-vegy',
      name: 'Veg Vegy Burger',
      price: 250,
      image: 'images/burger-3.png',
      description: 'Double stacked garden delight featuring fresh crisp cucumbers, pickles, cheddar, and chef secret sauce.'
    },
    {
      id: 'veg-crispy-classic',
      name: 'Veg Crispy Burger Classic',
      price: 250,
      image: 'images/burger-4.png',
      description: 'The beloved classic with double toasted sesame bun, sliced gherkins, and golden cheese.'
    },
    {
      id: 'earth-double',
      name: 'Earth Lover Double Platter',
      price: 499,
      image: 'images/hero-burgers.png',
      description: 'Signature eco-friendly double burgers served on artisanal wooden board.'
    },
    {
      id: 'promo-combo',
      name: 'Two Order Meal Combo',
      price: 399,
      image: 'images/promo-combo.png',
      description: '2 gourmet burgers, crispy golden french fries bowl, and cold soda beverage.'
    }
  ];

  // Testimonials database
  const testimonials = [
    {
      quote: "Lorem Ipsum Dolor Sit Amet, Consectetur Adipiscing Elit, Sed Do Eiusmod Tempor Incididunt Ut Labore Et Dolore Magna Aliqua",
      author: "Merian Maheta",
      role: "Owner Of Xyz Company",
      stars: 5
    },
    {
      quote: "The crispiest, freshest burgers I have ever tasted! The locally sourced ingredients really make a huge difference.",
      author: "Aarav Sharma",
      role: "Food Critic & Blogger",
      stars: 5
    },
    {
      quote: "Fast eco-friendly delivery and impeccable flavor. My kids love the Veg Crispy burgers every weekend!",
      author: "Priya Desai",
      role: "Verified Customer",
      stars: 5
    }
  ];

  // State
  let cart = [];
  let hotItemsIndex = 0;
  let testimonialIndex = 0;

  // DOM Elements
  const cartDrawerOverlay = document.getElementById('cartDrawerOverlay');
  const cartDrawer = document.getElementById('cartDrawer');
  const btnCloseCart = document.getElementById('btnCloseCart');
  const cartBtn = document.getElementById('navCartBtn');
  const cartCountBadges = document.querySelectorAll('.cart-badge');
  const cartItemsList = document.getElementById('cartItemsList');
  const cartSubtotalEl = document.getElementById('cartSubtotal');
  const toastEl = document.getElementById('toastNotification');
  const toastMsg = document.getElementById('toastMessage');

  const demoModal = document.getElementById('demoModal');
  const btnPlayDemo = document.getElementById('btnPlayDemo');
  const btnCloseModal = document.getElementById('btnCloseModal');

  const searchModal = document.getElementById('searchModal');
  const navSearchBtn = document.getElementById('navSearchBtn');
  const btnCloseSearch = document.getElementById('btnCloseSearch');
  const searchInput = document.getElementById('searchInput');
  const searchResults = document.getElementById('searchResults');

  // ==========================================
  // TOAST SYSTEM
  // ==========================================
  let toastTimer = null;
  function showToast(message) {
    if (!toastEl || !toastMsg) return;
    toastMsg.textContent = message;
    toastEl.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toastEl.classList.remove('show');
    }, 3000);
  }

  // ==========================================
  // SHOPPING CART DRAWER
  // ==========================================
  function openCart() {
    cartDrawerOverlay.classList.add('open');
    cartDrawer.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeCart() {
    cartDrawerOverlay.classList.remove('open');
    cartDrawer.classList.remove('open');
    document.body.style.overflow = '';
  }

  if (cartBtn) cartBtn.addEventListener('click', openCart);
  if (btnCloseCart) btnCloseCart.addEventListener('click', closeCart);
  if (cartDrawerOverlay) {
    cartDrawerOverlay.addEventListener('click', (e) => {
      if (e.target === cartDrawerOverlay) closeCart();
    });
  }

  function addToCart(item) {
    const existing = cart.find(i => i.id === item.id);
    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push({ ...item, quantity: 1 });
    }
    updateCartUI();
    showToast(`Added "${item.name}" to bag!`);
  }

  function updateCartUI() {
    const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCountBadges.forEach(badge => {
      badge.textContent = totalCount;
      badge.style.transform = 'scale(1.3)';
      setTimeout(() => { badge.style.transform = 'scale(1)'; }, 200);
    });

    if (!cartItemsList) return;
    cartItemsList.innerHTML = '';

    if (cart.length === 0) {
      cartItemsList.innerHTML = `
        <div style="text-align: center; padding: 40px 10px; color: var(--text-muted);">
          <svg style="width: 50px; height: 50px; stroke: #ccc; fill: none; stroke-width: 1.5; margin-bottom: 12px;" viewBox="0 0 24 24">
            <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <path d="M16 10a4 4 0 0 1-8 0"></path>
          </svg>
          <p style="font-weight: 600; font-size: 1.1rem; color: var(--text-dark); margin-bottom: 4px;">Your bag is empty</p>
          <p style="font-size: 0.9rem;">Delicious burgers are waiting for you!</p>
        </div>
      `;
      if (cartSubtotalEl) cartSubtotalEl.textContent = '₹0.00';
      return;
    }

    let subtotal = 0;
    cart.forEach(item => {
      const itemTotal = item.price * item.quantity;
      subtotal += itemTotal;

      const itemRow = document.createElement('div');
      itemRow.className = 'cart-item';
      itemRow.innerHTML = `
        <img src="${item.image}" alt="${item.name}" class="cart-item-img">
        <div class="cart-item-info">
          <div class="cart-item-title">${item.name}</div>
          <div class="cart-item-price">₹${item.price.toFixed(2)}</div>
          <div class="cart-qty-ctrls">
            <button class="btn-qty btn-minus" data-id="${item.id}">-</button>
            <span style="font-weight: 700; font-size: 0.9rem;">${item.quantity}</span>
            <button class="btn-qty btn-plus" data-id="${item.id}">+</button>
          </div>
        </div>
        <div style="font-weight: 800; font-size: 0.95rem; color: var(--text-dark);">
          ₹${itemTotal.toFixed(2)}
        </div>
      `;
      cartItemsList.appendChild(itemRow);
    });

    if (cartSubtotalEl) cartSubtotalEl.textContent = `₹${subtotal.toFixed(2)}`;

    // Quantity click handlers
    cartItemsList.querySelectorAll('.btn-plus').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        const item = cart.find(i => i.id === id);
        if (item) {
          item.quantity += 1;
          updateCartUI();
        }
      });
    });

    cartItemsList.querySelectorAll('.btn-minus').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        const index = cart.findIndex(i => i.id === id);
        if (index > -1) {
          if (cart[index].quantity > 1) {
            cart[index].quantity -= 1;
          } else {
            cart.splice(index, 1);
          }
          updateCartUI();
        }
      });
    });
  }

  // Checkout button
  const btnCheckout = document.getElementById('btnCheckout');
  if (btnCheckout) {
    btnCheckout.addEventListener('click', () => {
      if (cart.length === 0) {
        showToast('Your bag is empty!');
        return;
      }
      showToast('🎉 Order placed successfully! Thank you!');
      cart = [];
      updateCartUI();
      setTimeout(closeCart, 1500);
    });
  }

  // Bind Add to Cart on items
  document.querySelectorAll('[data-action="add-to-cart"]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const itemId = btn.getAttribute('data-item-id');
      const item = menuItems.find(i => i.id === itemId);
      if (item) {
        addToCart(item);
      }
    });
  });

  // Favorite toggle
  document.querySelectorAll('.btn-favorite').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      btn.classList.toggle('active');
      if (btn.classList.contains('active')) {
        showToast('Saved to your favorites!');
      } else {
        showToast('Removed from favorites.');
      }
    });
  });

  // ==========================================
  // HOT ITEMS CAROUSEL
  // ==========================================
  const track = document.getElementById('hotItemsTrack');
  const prevBtn = document.getElementById('prevHotBtn');
  const nextBtn = document.getElementById('nextHotBtn');
  const dots = document.querySelectorAll('.hot-dot');
  const cards = document.querySelectorAll('.hot-item-card');

  function updateHotItemsCarousel() {
    if (!track || cards.length === 0) return;
    const cardWidth = cards[0].offsetWidth + 26; // width + gap
    const maxIndex = Math.max(0, cards.length - Math.floor(track.parentElement.offsetWidth / cardWidth));
    
    // Clamp
    if (hotItemsIndex < 0) hotItemsIndex = 0;
    if (hotItemsIndex > maxIndex) hotItemsIndex = maxIndex;

    track.style.transform = `translateX(-${hotItemsIndex * cardWidth}px)`;

    dots.forEach((dot, idx) => {
      dot.classList.toggle('active', idx === hotItemsIndex);
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      hotItemsIndex--;
      if (hotItemsIndex < 0) hotItemsIndex = 0;
      updateHotItemsCarousel();
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      const cardWidth = cards[0].offsetWidth + 26;
      const maxIndex = Math.max(0, cards.length - Math.floor(track.parentElement.offsetWidth / cardWidth));
      hotItemsIndex++;
      if (hotItemsIndex > maxIndex) hotItemsIndex = 0;
      updateHotItemsCarousel();
    });
  }

  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      const idx = parseInt(dot.getAttribute('data-index') || '0', 10);
      hotItemsIndex = idx;
      updateHotItemsCarousel();
    });
  });

  window.addEventListener('resize', updateHotItemsCarousel);

  // ==========================================
  // TESTIMONIALS SLIDER
  // ==========================================
  const testQuote = document.getElementById('testimonialQuote');
  const testAuthor = document.getElementById('testimonialAuthor');
  const testRole = document.getElementById('testimonialRole');
  const prevTestBtn = document.getElementById('prevTestBtn');
  const nextTestBtn = document.getElementById('nextTestBtn');

  function renderTestimonial(idx) {
    if (!testQuote || !testAuthor || !testRole) return;
    const item = testimonials[idx];
    testQuote.style.opacity = '0';
    testAuthor.style.opacity = '0';
    testRole.style.opacity = '0';

    setTimeout(() => {
      testQuote.textContent = item.quote;
      testAuthor.textContent = item.author;
      testRole.textContent = item.role;
      testQuote.style.opacity = '1';
      testAuthor.style.opacity = '1';
      testRole.style.opacity = '1';
    }, 200);
  }

  if (prevTestBtn) {
    prevTestBtn.addEventListener('click', () => {
      testimonialIndex = (testimonialIndex - 1 + testimonials.length) % testimonials.length;
      renderTestimonial(testimonialIndex);
    });
  }

  if (nextTestBtn) {
    nextTestBtn.addEventListener('click', () => {
      testimonialIndex = (testimonialIndex + 1) % testimonials.length;
      renderTestimonial(testimonialIndex);
    });
  }

  // ==========================================
  // PLAY DEMO VIDEO MODAL
  // ==========================================
  if (btnPlayDemo && demoModal) {
    btnPlayDemo.addEventListener('click', () => {
      demoModal.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  }

  if (btnCloseModal && demoModal) {
    btnCloseModal.addEventListener('click', () => {
      demoModal.classList.remove('open');
      document.body.style.overflow = '';
      const iframe = demoModal.querySelector('iframe');
      if (iframe) {
        const src = iframe.src;
        iframe.src = src; // reset playback
      }
    });
  }

  if (demoModal) {
    demoModal.addEventListener('click', (e) => {
      if (e.target === demoModal) {
        demoModal.classList.remove('open');
        document.body.style.overflow = '';
      }
    });
  }

  // ==========================================
  // SEARCH MODAL OVERLAY
  // ==========================================
  if (navSearchBtn && searchModal) {
    navSearchBtn.addEventListener('click', () => {
      searchModal.classList.add('open');
      searchInput.focus();
      document.body.style.overflow = 'hidden';
      renderSearchResults('');
    });
  }

  if (btnCloseSearch && searchModal) {
    btnCloseSearch.addEventListener('click', () => {
      searchModal.classList.remove('open');
      document.body.style.overflow = '';
    });
  }

  if (searchModal) {
    searchModal.addEventListener('click', (e) => {
      if (e.target === searchModal) {
        searchModal.classList.remove('open');
        document.body.style.overflow = '';
      }
    });
  }

  function renderSearchResults(query) {
    if (!searchResults) return;
    const filter = query.toLowerCase().trim();
    const matches = menuItems.filter(item => 
      item.name.toLowerCase().includes(filter) || item.description.toLowerCase().includes(filter)
    );

    if (matches.length === 0) {
      searchResults.innerHTML = '<p style="color: #888; text-align: center; padding: 20px;">No burgers found.</p>';
      return;
    }

    searchResults.innerHTML = matches.map(item => `
      <div class="search-result-row" style="display: flex; align-items: center; justify-content: space-between; padding: 10px 14px; background: #FFF8F3; border-radius: 12px; cursor: pointer;" data-id="${item.id}">
        <div style="display: flex; align-items: center; gap: 14px;">
          <img src="${item.image}" style="width: 44px; height: 44px; object-fit: contain; background: #FF8516; border-radius: 8px;">
          <div>
            <div style="font-weight: 700; font-size: 0.95rem;">${item.name}</div>
            <div style="color: var(--primary-orange); font-weight: 700; font-size: 0.9rem;">₹${item.price.toFixed(2)}</div>
          </div>
        </div>
        <button style="background: var(--primary-orange); color: #fff; padding: 6px 14px; border-radius: 20px; font-weight: 700; font-size: 0.85rem;">+ Add</button>
      </div>
    `).join('');

    searchResults.querySelectorAll('.search-result-row').forEach(row => {
      row.addEventListener('click', () => {
        const id = row.getAttribute('data-id');
        const item = menuItems.find(i => i.id === id);
        if (item) {
          addToCart(item);
          searchModal.classList.remove('open');
          document.body.style.overflow = '';
        }
      });
    });
  }

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      renderSearchResults(e.target.value);
    });
  }

  // ==========================================
  // SHARE BUTTON
  // ==========================================
  const shareBtn = document.getElementById('whoShareBtn');
  if (shareBtn) {
    shareBtn.addEventListener('click', async () => {
      if (navigator.share) {
        try {
          await navigator.share({
            title: 'Burgers That Love the Earth!',
            text: 'Discover crunchy, crispy, organic veggie deliciousness at Burger!',
            url: window.location.href
          });
        } catch (err) {
          console.log('Share canceled or error:', err);
        }
      } else {
        navigator.clipboard.writeText(window.location.href);
        showToast('Link copied to clipboard!');
      }
    });
  }

  // ==========================================
  // NEWSLETTER FORM
  // ==========================================
  const subscribeForm = document.getElementById('subscribeForm');
  if (subscribeForm) {
    subscribeForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const emailInput = subscribeForm.querySelector('input[type="email"]');
      if (emailInput && emailInput.value.trim()) {
        showToast(`Subscribed ${emailInput.value.trim()} for updates!`);
        emailInput.value = '';
      }
    });
  }

  // Order Now in Promo Banner -> adds promo combo
  const promoOrderBtn = document.getElementById('promoOrderBtn');
  if (promoOrderBtn) {
    promoOrderBtn.addEventListener('click', () => {
      const comboItem = menuItems.find(i => i.id === 'promo-combo');
      if (comboItem) {
        addToCart(comboItem);
        openCart();
      }
    });
  }

  // Explore button in Hero -> scrolls smoothly to hot items
  const btnExplore = document.getElementById('btnExplore');
  if (btnExplore) {
    btnExplore.addEventListener('click', () => {
      const hotSection = document.getElementById('hotItemsSection');
      if (hotSection) {
        hotSection.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }
});
