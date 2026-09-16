/**
 * CURRYCRAFT ROYAL INDIAN CUISINE WEB APP LOGIC
 * High-performance, mobile-optimized, touch-enabled ordering system
 * Integrated with REST API backend & digital receipt generation
 */

document.addEventListener('DOMContentLoaded', () => {
  // Menu item database
  const menuItems = [
    {
      id: 'kolkata-chicken-biryani',
      name: 'Kolkata Chicken Biryani',
      category: 'Biryani',
      price: 380,
      image: 'images/kolkata-biryani.jpg',
      description:
        'Fragrant aged long-grain basmati rice layered with succulent chicken, golden melt-in-the-mouth potato (aloo), and farm boiled egg, slow-cooked in dum with saffron and aromatic meetha ittar.'
    },
    {
      id: 'classic-dal-sambar',
      name: 'Classic Dal Sambar',
      category: 'Curries',
      price: 190,
      image: 'images/classic-dal-sambar.jpg',
      description:
        'Homestyle comfort toor dal stewed with fresh drumsticks, shallots, and vegetables, tempered with black mustard seeds, curry leaves, and tangy tamarind extract.'
    },
    {
      id: 'paneer-butter-masala',
      name: 'Paneer Butter Masala',
      category: 'Curries',
      price: 320,
      image: 'images/paneer-butter-masala.jpg',
      description:
        'Soft malai paneer cubes simmered in a velvety, rich tomato-cashew satin gravy finished with artisanal butter and dried fenugreek leaves (kasuri methi).'
    },
    {
      id: 'butter-garlic-naan',
      name: 'Butter Garlic Naan (2 pcs)',
      category: 'Breads',
      price: 120,
      image: 'images/butter-garlic-naan.jpg',
      description:
        'Traditional clay-tandoor blistered leavened bread generously brushed with roasted minced garlic, fresh coriander, and melted golden butter.'
    },
    {
      id: 'awadhi-mutton-biryani',
      name: 'Awadhi Dum Mutton Biryani',
      category: 'Biryani',
      price: 490,
      image: 'images/awadhi-mutton-biryani.jpg',
      description:
        'Royal Lucknawi style dum biryani with tender mutton shanks, fragrant kewra essence, caramelized fried onions (birista), and whole Indian spices.'
    },
    {
      id: 'gulab-jamun-rabdi',
      name: 'Gulab Jamun with Kesari Rabdi',
      category: 'Desserts & Beverages',
      price: 160,
      image: 'images/gulab-jamun-rabdi.jpg',
      description:
        'Warm, melt-in-mouth reduced milk dumplings soaked in green cardamom sugar syrup, crowned with chilled slow-simmered saffron rabdi and pistachios.'
    },
    {
      id: 'kolkata-masala-chai',
      name: 'Kolkata Kulhad Masala Chai',
      category: 'Desserts & Beverages',
      price: 80,
      image: 'images/kolkata-masala-chai.jpg',
      description:
        'Authentic clay cup (kulhad) brewed Assam CTC tea infused with crushed green cardamom, fresh crushed ginger, cloves, and whole creamy milk.'
    }
  ];

  // Testimonials database
  const testimonials = [
    {
      quote:
        'The Kolkata Chicken Biryani with the saffron-infused aloo is heavenly! Authentic flavors that transport you straight to Park Street.',
      author: 'Aarav Mukherjee',
      role: 'Culinary Critic & Food Blogger',
      stars: 5
    },
    {
      quote:
        'The Dal Sambar and Butter Garlic Naan are purest comfort food. Delivered piping hot in sealed clay handis with real-time live map tracking!',
      author: 'Priyanka Sharma',
      role: 'Verified Gastronome',
      stars: 5
    },
    {
      quote:
        'Best Awadhi Dum Biryani in town. Slow-simmered dum cooking with tender mutton that falls off the bone. 10/10 recommendation!',
      author: 'Vikram Sen',
      role: 'Royal Foodie & Heritage Lover',
      stars: 5
    },
    {
      quote:
        'Gulab Jamun with Kesari Rabdi was rich, fragrant, and decadent. Exceptional packaging and lightning-fast courier service.',
      author: 'Sneha Roy',
      role: 'Verified Customer',
      stars: 5
    }
  ];

  // State Management
  let cart = [];
  let hotItemsIndex = 0;
  let testimonialIndex = 0;
  let appliedDiscount = 0;
  let appliedPromoCode = '';

  // Load saved cart from localStorage if available
  try {
    const savedCart = localStorage.getItem('burger_cart');
    if (savedCart) {
      cart = JSON.parse(savedCart);
    }
  } catch {
    cart = [];
  }

  // ==========================================
  // DOM ELEMENT SELECTIONS
  // ==========================================
  const siteHeader = document.getElementById('siteHeader');

  // Navigation & Drawers
  const menuToggle = document.getElementById('menuToggle');
  const mobileNavDrawer = document.getElementById('mobileNavDrawer');
  const mobileNavOverlay = document.getElementById('mobileNavOverlay');
  const btnCloseMobileNav = document.getElementById('btnCloseMobileNav');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
  const btnMobileOrderNow = document.getElementById('btnMobileOrderNow');

  // Cart Drawer
  const cartDrawerOverlay = document.getElementById('cartDrawerOverlay');
  const cartDrawer = document.getElementById('cartDrawer');
  const btnCloseCart = document.getElementById('btnCloseCart');
  const navCartBtn = document.getElementById('navCartBtn');
  const cartBadges = document.querySelectorAll('.cart-badge');
  const cartItemsList = document.getElementById('cartItemsList');
  const cartSubtotalEl = document.getElementById('cartSubtotal');
  const btnCheckout = document.getElementById('btnCheckout');

  // Checkout Modal
  const checkoutModal = document.getElementById('checkoutModal');
  const btnCloseCheckout = document.getElementById('btnCloseCheckout');
  const checkoutForm = document.getElementById('checkoutForm');
  const checkoutItemsCount = document.getElementById('checkoutItemsCount');
  const checkoutSubtotal = document.getElementById('checkoutSubtotal');
  const checkoutDiscountRow = document.getElementById('checkoutDiscountRow');
  const checkoutDiscountLabel = document.getElementById('checkoutDiscountLabel');
  const checkoutDiscountValue = document.getElementById('checkoutDiscountValue');
  const checkoutGst = document.getElementById('checkoutGst');
  const checkoutDeliveryFee = document.getElementById('checkoutDeliveryFee');
  const checkoutGrandTotal = document.getElementById('checkoutGrandTotal');
  const promoCodeInput = document.getElementById('promoCodeInput');
  const btnApplyPromo = document.getElementById('btnApplyPromo');
  const promoStatusMessage = document.getElementById('promoStatusMessage');
  const btnSubmitOrder = document.getElementById('btnSubmitOrder');
  const btnSubmitText = document.getElementById('btnSubmitText');
  const btnSubmitSpinner = document.getElementById('btnSubmitSpinner');

  // Order Receipt Modal
  const receiptModal = document.getElementById('receiptModal');
  const btnCloseReceipt = document.getElementById('btnCloseReceipt');
  const btnPrintReceipt = document.getElementById('btnPrintReceipt');
  const btnNewOrder = document.getElementById('btnNewOrder');
  const receiptOrderId = document.getElementById('receiptOrderId');
  const receiptDateTime = document.getElementById('receiptDateTime');
  const receiptCustomerName = document.getElementById('receiptCustomerName');
  const receiptCustomerPhone = document.getElementById('receiptCustomerPhone');
  const receiptDeliveryAddress = document.getElementById('receiptDeliveryAddress');
  const receiptPaymentMethod = document.getElementById('receiptPaymentMethod');
  const receiptEstTime = document.getElementById('receiptEstTime');
  const receiptItemsBody = document.getElementById('receiptItemsBody');
  const receiptSubtotal = document.getElementById('receiptSubtotal');
  const receiptDiscountRow = document.getElementById('receiptDiscountRow');
  const receiptDiscountLabel = document.getElementById('receiptDiscountLabel');
  const receiptDiscount = document.getElementById('receiptDiscount');
  const receiptGst = document.getElementById('receiptGst');
  const receiptDelivery = document.getElementById('receiptDelivery');
  const receiptGrandTotal = document.getElementById('receiptGrandTotal');
  const receiptBarcodeNumber = document.getElementById('receiptBarcodeNumber');

  // Media & Modals
  const demoModal = document.getElementById('demoModal');
  const btnPlayDemo = document.getElementById('btnPlayDemo');
  const btnCloseModal = document.getElementById('btnCloseModal');

  // Search
  const searchModal = document.getElementById('searchModal');
  const navSearchBtn = document.getElementById('navSearchBtn');
  const btnCloseSearch = document.getElementById('btnCloseSearch');
  const searchInput = document.getElementById('searchInput');
  const searchResults = document.getElementById('searchResults');

  // Toast
  const toastEl = document.getElementById('toastNotification');
  const toastMsg = document.getElementById('toastMessage');

  // ==========================================
  // TOAST NOTIFICATIONS
  // ==========================================
  let toastTimer = null;
  function showToast(message) {
    if (!toastEl || !toastMsg) return;
    toastMsg.textContent = message;
    toastEl.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toastEl.classList.remove('show');
    }, 3200);
  }

  // ==========================================
  // STICKY HEADER ON SCROLL
  // ==========================================
  window.addEventListener(
    'scroll',
    () => {
      if (!siteHeader) return;
      if (window.scrollY > 60) {
        siteHeader.classList.add('scrolled');
      } else {
        siteHeader.classList.remove('scrolled');
      }
    },
    { passive: true }
  );

  // ==========================================
  // MOBILE NAVIGATION DRAWER
  // ==========================================
  function openMobileNav() {
    if (!mobileNavDrawer || !mobileNavOverlay) return;
    mobileNavDrawer.style.display = 'flex';
    mobileNavOverlay.style.display = 'block';
    requestAnimationFrame(() => {
      mobileNavDrawer.classList.add('open');
      mobileNavOverlay.classList.add('open');
      mobileNavDrawer.setAttribute('aria-hidden', 'false');
      if (menuToggle) {
        menuToggle.classList.add('is-active');
        menuToggle.setAttribute('aria-expanded', 'true');
      }
    });
    document.body.style.overflow = 'hidden';
  }

  function closeMobileNav() {
    if (!mobileNavDrawer || !mobileNavOverlay) return;
    mobileNavDrawer.classList.remove('open');
    mobileNavOverlay.classList.remove('open');
    mobileNavDrawer.setAttribute('aria-hidden', 'true');
    if (menuToggle) {
      menuToggle.classList.remove('is-active');
      menuToggle.setAttribute('aria-expanded', 'false');
    }
    document.body.style.overflow = '';
    setTimeout(() => {
      if (mobileNavDrawer && !mobileNavDrawer.classList.contains('open')) {
        mobileNavDrawer.style.display = 'none';
      }
      if (mobileNavOverlay && !mobileNavOverlay.classList.contains('open')) {
        mobileNavOverlay.style.display = 'none';
      }
    }, 360);
  }

  if (menuToggle) {
    menuToggle.addEventListener('click', () => {
      if (mobileNavDrawer.classList.contains('open')) {
        closeMobileNav();
      } else {
        openMobileNav();
      }
    });
  }

  if (btnCloseMobileNav) btnCloseMobileNav.addEventListener('click', closeMobileNav);
  if (mobileNavOverlay) mobileNavOverlay.addEventListener('click', closeMobileNav);

  mobileNavLinks.forEach((link) => {
    link.addEventListener('click', () => {
      closeMobileNav();
      mobileNavLinks.forEach((l) => l.classList.remove('active'));
      link.classList.add('active');
    });
  });

  if (btnMobileOrderNow) {
    btnMobileOrderNow.addEventListener('click', () => {
      closeMobileNav();
      openCart();
    });
  }

  window.addEventListener('resize', () => {
    if (window.innerWidth > 992) {
      if (mobileNavDrawer && mobileNavDrawer.classList.contains('open')) {
        closeMobileNav();
      }
      if (mobileNavDrawer) mobileNavDrawer.style.display = 'none';
      if (mobileNavOverlay) mobileNavOverlay.style.display = 'none';
    }
  });

  // ==========================================
  // SHOPPING CART DRAWER
  // ==========================================
  function openCart() {
    if (!cartDrawer || !cartDrawerOverlay) return;
    cartDrawerOverlay.classList.add('open');
    cartDrawer.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeCart() {
    if (!cartDrawer || !cartDrawerOverlay) return;
    cartDrawerOverlay.classList.remove('open');
    cartDrawer.classList.remove('open');
    document.body.style.overflow = '';
  }

  if (navCartBtn) navCartBtn.addEventListener('click', openCart);
  if (btnCloseCart) btnCloseCart.addEventListener('click', closeCart);
  if (cartDrawerOverlay) {
    cartDrawerOverlay.addEventListener('click', (e) => {
      if (e.target === cartDrawerOverlay) closeCart();
    });
  }

  function saveCartToStorage() {
    try {
      localStorage.setItem('burger_cart', JSON.stringify(cart));
    } catch {}
  }

  function addToCart(item) {
    const existing = cart.find((i) => i.id === item.id);
    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push({ ...item, quantity: 1 });
    }
    saveCartToStorage();
    updateCartUI();
    showToast(`Added "${item.name}" to your bag! 🍔`);
  }

  function updateCartUI() {
    const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartBadges.forEach((badge) => {
      badge.textContent = totalCount;
      badge.style.transform = 'scale(1.25)';
      setTimeout(() => {
        badge.style.transform = 'scale(1)';
      }, 200);
    });

    if (!cartItemsList) return;
    cartItemsList.innerHTML = '';

    if (cart.length === 0) {
      cartItemsList.innerHTML = `
        <div style="text-align: center; padding: 40px 10px; color: var(--text-muted);">
          <span style="font-size: 3.5rem; display: block; margin-bottom: 12px;">🍔</span>
          <p style="font-weight: 800; font-size: 1.15rem; color: var(--text-dark); margin-bottom: 6px;">Your bag is empty</p>
          <p style="font-size: 0.9rem;">Delicious, organic burgers are waiting for you!</p>
        </div>
      `;
      if (cartSubtotalEl) cartSubtotalEl.textContent = '₹0.00';
      return;
    }

    let subtotal = 0;
    cart.forEach((item) => {
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
            <button class="btn-qty btn-minus" data-id="${item.id}" aria-label="Decrease quantity">-</button>
            <span style="font-weight: 700; font-size: 0.92rem; min-width: 18px; text-align: center;">${item.quantity}</span>
            <button class="btn-qty btn-plus" data-id="${item.id}" aria-label="Increase quantity">+</button>
          </div>
        </div>
        <div style="font-weight: 800; font-size: 0.98rem; color: var(--text-dark);">
          ₹${itemTotal.toFixed(2)}
        </div>
      `;
      cartItemsList.appendChild(itemRow);
    });

    if (cartSubtotalEl) cartSubtotalEl.textContent = `₹${subtotal.toFixed(2)}`;

    // Attach quantity increment/decrement listeners
    cartItemsList.querySelectorAll('.btn-plus').forEach((btn) => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        const item = cart.find((i) => i.id === id);
        if (item) {
          item.quantity += 1;
          saveCartToStorage();
          updateCartUI();
        }
      });
    });

    cartItemsList.querySelectorAll('.btn-minus').forEach((btn) => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        const index = cart.findIndex((i) => i.id === id);
        if (index > -1) {
          if (cart[index].quantity > 1) {
            cart[index].quantity -= 1;
          } else {
            cart.splice(index, 1);
          }
          saveCartToStorage();
          updateCartUI();
        }
      });
    });
  }

  // Bind Add to Cart on item cards & badges
  document.querySelectorAll('[data-action="add-to-cart"]').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const itemId = btn.getAttribute('data-item-id');
      const item = menuItems.find((i) => i.id === itemId);
      if (item) {
        addToCart(item);
      }
    });
  });

  // Favorite toggle
  document.querySelectorAll('.btn-favorite').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      btn.classList.toggle('active');
      if (btn.classList.contains('active')) {
        showToast('Saved to your favorites! ❤️');
      } else {
        showToast('Removed from favorites.');
      }
    });
  });

  // Initialize cart display
  updateCartUI();

  // ==========================================
  // CHECKOUT MODAL & ORDERING SYSTEM
  // ==========================================
  function openCheckout() {
    if (cart.length === 0) {
      showToast('Your bag is empty! Please add some burgers first. 🍔');
      return;
    }
    closeCart();
    updateCheckoutCalculations();
    checkoutModal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeCheckout() {
    if (!checkoutModal) return;
    checkoutModal.classList.remove('open');
    document.body.style.overflow = '';
  }

  if (btnCheckout) btnCheckout.addEventListener('click', openCheckout);
  if (btnCloseCheckout) btnCloseCheckout.addEventListener('click', closeCheckout);
  if (checkoutModal) {
    checkoutModal.addEventListener('click', (e) => {
      if (e.target === checkoutModal) closeCheckout();
    });
  }

  // Calculate live checkout numbers
  function updateCheckoutCalculations() {
    const totalQty = cart.reduce((sum, it) => sum + it.quantity, 0);
    const subtotal = cart.reduce((sum, it) => sum + it.price * it.quantity, 0);

    let discount = 0;
    let discountLabel = '';
    if (appliedPromoCode === 'EARTH50') {
      discount = subtotal * 0.5;
      discountLabel = '50% Off Voucher (EARTH50)';
    } else if (cart.some((it) => it.id === 'promo-combo')) {
      discount = 50;
      discountLabel = 'Combo Meal Discount';
    }

    const deliveryRadio = document.querySelector('input[name="deliveryType"]:checked');
    const deliveryType = deliveryRadio ? deliveryRadio.value : 'Home Delivery';

    let deliveryFee = 30.0;
    if (deliveryType === 'Takeaway' || deliveryType === 'Dine-in' || subtotal >= 500) {
      deliveryFee = 0.0;
    }

    const taxable = Math.max(0, subtotal - discount);
    const gst = taxable * 0.05;
    const grandTotal = taxable + gst + deliveryFee;

    if (checkoutItemsCount) checkoutItemsCount.textContent = totalQty;
    if (checkoutSubtotal) checkoutSubtotal.textContent = `₹${subtotal.toFixed(2)}`;

    if (checkoutDiscountRow) {
      if (discount > 0) {
        checkoutDiscountRow.style.display = 'flex';
        checkoutDiscountLabel.textContent = discountLabel;
        checkoutDiscountValue.textContent = `-₹${discount.toFixed(2)}`;
      } else {
        checkoutDiscountRow.style.display = 'none';
      }
    }

    if (checkoutGst) checkoutGst.textContent = `₹${gst.toFixed(2)}`;
    if (checkoutDeliveryFee) {
      checkoutDeliveryFee.textContent = deliveryFee === 0 ? 'FREE' : `₹${deliveryFee.toFixed(2)}`;
    }
    if (checkoutGrandTotal) checkoutGrandTotal.textContent = `₹${grandTotal.toFixed(2)}`;
  }

  // Delivery option radio changes
  const deliveryAddressBlock = document.getElementById('deliveryAddressBlock');
  const tableOrNoteGroup = document.getElementById('tableOrNoteGroup');
  const tableOrNoteLabel = document.getElementById('tableOrNoteLabel');
  const tableOrNoteInput = document.getElementById('tableOrNoteInput');
  const custFlat = document.getElementById('custFlat');
  const custStreet = document.getElementById('custStreet');
  const custCity = document.getElementById('custCity');
  const custPincode = document.getElementById('custPincode');

  document.querySelectorAll('input[name="deliveryType"]').forEach((radio) => {
    radio.addEventListener('change', () => {
      const isHome = radio.value === 'Home Delivery';
      if (deliveryAddressBlock) deliveryAddressBlock.style.display = isHome ? 'block' : 'none';
      if (tableOrNoteGroup) tableOrNoteGroup.style.display = isHome ? 'none' : 'block';

      if (custFlat) custFlat.required = isHome;
      if (custStreet) custStreet.required = isHome;
      if (custCity) custCity.required = isHome;
      if (custPincode) custPincode.required = isHome;

      if (radio.value === 'Dine-in') {
        if (tableOrNoteLabel) tableOrNoteLabel.textContent = 'Table Number *';
        if (tableOrNoteInput) {
          tableOrNoteInput.placeholder = 'e.g. Table 4 (Indoors)';
          tableOrNoteInput.required = true;
        }
      } else if (radio.value === 'Takeaway') {
        if (tableOrNoteLabel) tableOrNoteLabel.textContent = 'Pickup Note (Optional)';
        if (tableOrNoteInput) {
          tableOrNoteInput.placeholder = 'e.g. Pickup at 7:30 PM';
          tableOrNoteInput.required = false;
        }
      }
      updateCheckoutCalculations();
    });
  });

  // Promo code apply
  if (btnApplyPromo) {
    btnApplyPromo.addEventListener('click', () => {
      const code = (promoCodeInput.value || '').trim().toUpperCase();
      if (!code) {
        appliedPromoCode = '';
        promoStatusMessage.textContent = 'Please enter a voucher code.';
        promoStatusMessage.className = 'promo-status error';
        updateCheckoutCalculations();
        return;
      }

      if (code === 'EARTH50') {
        appliedPromoCode = 'EARTH50';
        promoStatusMessage.textContent = '🎉 EARTH50 applied! 50% discount unlocked!';
        promoStatusMessage.className = 'promo-status success';
      } else {
        appliedPromoCode = '';
        promoStatusMessage.textContent = 'Invalid promo code. Try "EARTH50"!';
        promoStatusMessage.className = 'promo-status error';
      }
      updateCheckoutCalculations();
    });
  }

  // Handle Checkout Form Submission to Backend API
  if (checkoutForm) {
    checkoutForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      if (cart.length === 0) {
        showToast('Your bag is empty!');
        return;
      }

      // Read form data
      const formData = new FormData(checkoutForm);
      const deliveryType = formData.get('deliveryType') || 'Home Delivery';
      const flat = (formData.get('flat') || '').trim();
      const street = (formData.get('street') || '').trim();
      const landmark = (formData.get('landmark') || '').trim();
      const city = (formData.get('city') || '').trim();
      const pincode = (formData.get('pincode') || '').trim();
      const tableOrNote = (formData.get('tableOrNote') || '').trim();

      let fullAddress = '';
      if (deliveryType === 'Home Delivery') {
        fullAddress = `${flat}, ${street}${landmark ? ', ' + landmark : ''}, ${city} - ${pincode}`;
      } else if (deliveryType === 'Dine-in') {
        fullAddress = tableOrNote || 'Table Service';
      } else {
        fullAddress = tableOrNote ? `Takeaway: ${tableOrNote}` : 'Store Pickup Counter';
      }

      const customer = {
        name: formData.get('name'),
        phone: formData.get('phone'),
        alternatePhone: formData.get('alternatePhone') || '',
        email: formData.get('email') || '',
        deliveryType: deliveryType,
        address: fullAddress,
        addressDetails: {
          flat,
          street,
          landmark,
          city,
          pincode
        },
        paymentMethod: formData.get('paymentMethod'),
        notes: ''
      };

      const payload = {
        customer,
        items: cart,
        promoCode: appliedPromoCode
      };

      // Show loading state
      if (btnSubmitText) btnSubmitText.textContent = 'Submitting Order...';
      if (btnSubmitSpinner) btnSubmitSpinner.style.display = 'inline-block';
      if (btnSubmitOrder) btnSubmitOrder.disabled = true;

      try {
        const response = await fetch('/api/orders', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        });

        const data = await response.json();

        if (response.ok && data.success && data.order) {
          // Success! Clear cart & close checkout
          cart = [];
          saveCartToStorage();
          updateCartUI();
          closeCheckout();

          // Render digital receipt
          renderReceipt(data.order);
          receiptModal.classList.add('open');
          document.body.style.overflow = 'hidden';

          showToast('🎉 Order confirmed! Receipt generated.');
        } else {
          showToast(data.message || 'Failed to place order. Please try again.');
        }
      } catch (err) {
        console.error('Order submission error:', err);
        showToast('Network error while placing order. Please try again.');
      } finally {
        if (btnSubmitText) btnSubmitText.textContent = 'Place Order & View Receipt';
        if (btnSubmitSpinner) btnSubmitSpinner.style.display = 'none';
        if (btnSubmitOrder) btnSubmitOrder.disabled = false;
      }
    });
  }

  // ==========================================
  // DIGITAL ORDER RECEIPT RENDERING
  // ==========================================
  function renderReceipt(order) {
    if (!receiptModal) return;

    if (receiptOrderId) receiptOrderId.textContent = `#${order.orderId}`;
    if (receiptDateTime)
      receiptDateTime.textContent = `${order.formattedDate}, ${order.formattedTime}`;
    if (receiptCustomerName) receiptCustomerName.textContent = order.customer.name;
    if (receiptCustomerPhone) receiptCustomerPhone.textContent = order.customer.phone;
    if (receiptDeliveryAddress)
      receiptDeliveryAddress.textContent = `${order.customer.deliveryType}: ${order.customer.address}`;
    if (receiptPaymentMethod) receiptPaymentMethod.textContent = order.customer.paymentMethod;
    if (receiptEstTime) receiptEstTime.textContent = order.estimatedTime || '25 - 35 mins';

    // Populate itemized rows
    if (receiptItemsBody) {
      receiptItemsBody.innerHTML = (order.items || [])
        .map(
          (it) => `
        <div class="receipt-item-row">
          <span>${it.name}</span>
          <span style="text-align: center;">${it.quantity}</span>
          <span style="text-align: right;">₹${it.price.toFixed(2)}</span>
          <span style="text-align: right; font-weight: 700;">₹${it.lineTotal.toFixed(2)}</span>
        </div>
      `
        )
        .join('');
    }

    const pricing = order.pricing || {};
    if (receiptSubtotal)
      receiptSubtotal.textContent = `₹${(pricing.itemsSubtotal || 0).toFixed(2)}`;

    if (receiptDiscountRow) {
      if (pricing.discount > 0) {
        receiptDiscountRow.style.display = 'flex';
        if (receiptDiscountLabel)
          receiptDiscountLabel.textContent = pricing.discountLabel || 'Discount';
        if (receiptDiscount) receiptDiscount.textContent = `-₹${pricing.discount.toFixed(2)}`;
      } else {
        receiptDiscountRow.style.display = 'none';
      }
    }

    if (receiptGst) receiptGst.textContent = `₹${(pricing.gst || 0).toFixed(2)}`;
    if (receiptDelivery) {
      receiptDelivery.textContent =
        pricing.deliveryFee === 0 ? 'FREE' : `₹${(pricing.deliveryFee || 0).toFixed(2)}`;
    }
    if (receiptGrandTotal)
      receiptGrandTotal.textContent = `₹${(pricing.grandTotal || 0).toFixed(2)}`;
    if (receiptBarcodeNumber) receiptBarcodeNumber.textContent = `${order.orderId}-VERIFIED`;

    // Live tracker simulation (Kitchen Prep highlight after 6s)
    const kitchenStep = document.getElementById('trackStepKitchen');
    const deliveryLine = document.getElementById('trackLineDelivery');
    const deliveryStep = document.getElementById('trackStepDelivery');
    const statusText = document.getElementById('receiptStatusText');

    setTimeout(() => {
      if (kitchenStep) kitchenStep.classList.add('active');
      if (statusText) statusText.textContent = 'In The Kitchen 🔥';
    }, 6000);

    setTimeout(() => {
      if (deliveryLine) deliveryLine.classList.add('active');
      if (deliveryStep) deliveryStep.classList.add('active');
      if (statusText) statusText.textContent = 'Out For Delivery 🛵';
    }, 14000);
  }

  function closeReceipt() {
    if (!receiptModal) return;
    receiptModal.classList.remove('open');
    document.body.style.overflow = '';
  }

  if (btnCloseReceipt) btnCloseReceipt.addEventListener('click', closeReceipt);
  if (receiptModal) {
    receiptModal.addEventListener('click', (e) => {
      if (e.target === receiptModal) closeReceipt();
    });
  }

  if (btnPrintReceipt) {
    btnPrintReceipt.addEventListener('click', () => {
      window.print();
    });
  }

  if (btnNewOrder) {
    btnNewOrder.addEventListener('click', () => {
      closeReceipt();
      const hotSection = document.getElementById('hotItemsSection');
      if (hotSection) {
        hotSection.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }

  // ==========================================
  // HOT ITEMS CAROUSEL & TOUCH SWIPE
  // ==========================================
  const trackWrapper = document.getElementById('hotItemsTrackWrapper');
  const track = document.getElementById('hotItemsTrack');
  const prevBtn = document.getElementById('prevHotBtn');
  const nextBtn = document.getElementById('nextHotBtn');
  const dots = document.querySelectorAll('.hot-dot');
  const cards = document.querySelectorAll('.hot-item-card');

  function updateHotItemsCarousel() {
    if (!track || cards.length === 0 || !trackWrapper) return;
    const cardWidth = cards[0].offsetWidth + 26;
    const visibleCards = Math.max(1, Math.floor(trackWrapper.offsetWidth / cardWidth));
    const maxIndex = Math.max(0, cards.length - visibleCards);

    if (hotItemsIndex < 0) hotItemsIndex = 0;
    if (hotItemsIndex > maxIndex) hotItemsIndex = maxIndex;

    track.style.transform = `translateX(-${hotItemsIndex * cardWidth}px)`;

    dots.forEach((dot, idx) => {
      dot.classList.toggle('active', idx === hotItemsIndex);
    });
  }

  function nextBurger() {
    if (cards.length === 0 || !trackWrapper) return;
    const cardWidth = cards[0].offsetWidth + 26;
    const visibleCards = Math.max(1, Math.floor(trackWrapper.offsetWidth / cardWidth));
    const maxIndex = Math.max(0, cards.length - visibleCards);

    hotItemsIndex++;
    if (hotItemsIndex > maxIndex) hotItemsIndex = 0;
    updateHotItemsCarousel();
  }

  function prevBurger() {
    if (cards.length === 0 || !trackWrapper) return;
    hotItemsIndex--;
    if (hotItemsIndex < 0) {
      const cardWidth = cards[0].offsetWidth + 26;
      const visibleCards = Math.max(1, Math.floor(trackWrapper.offsetWidth / cardWidth));
      hotItemsIndex = Math.max(0, cards.length - visibleCards);
    }
    updateHotItemsCarousel();
  }

  if (prevBtn) prevBtn.addEventListener('click', prevBurger);
  if (nextBtn) nextBtn.addEventListener('click', nextBurger);

  dots.forEach((dot) => {
    dot.addEventListener('click', () => {
      hotItemsIndex = parseInt(dot.getAttribute('data-index') || '0', 10);
      updateHotItemsCarousel();
    });
  });

  // Touch Swipe on Hot Items Carousel
  let touchStartX = 0;
  let touchStartY = 0;
  let touchEndX = 0;
  let isSwiping = false;

  if (trackWrapper) {
    trackWrapper.addEventListener(
      'touchstart',
      (e) => {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
        isSwiping = true;
      },
      { passive: true }
    );

    trackWrapper.addEventListener(
      'touchmove',
      (e) => {
        if (!isSwiping) return;
        touchEndX = e.touches[0].clientX;
      },
      { passive: true }
    );

    trackWrapper.addEventListener(
      'touchend',
      (e) => {
        if (!isSwiping) return;
        isSwiping = false;
        const deltaX = touchEndX - touchStartX;
        const deltaY = e.changedTouches[0].clientY - touchStartY;

        // Only handle horizontal swipe if horizontal movement is greater than vertical
        if (Math.abs(deltaX) > 40 && Math.abs(deltaX) > Math.abs(deltaY)) {
          if (deltaX < 0) {
            nextBurger();
          } else {
            prevBurger();
          }
        }
      },
      { passive: true }
    );
  }

  window.addEventListener('resize', updateHotItemsCarousel);

  // ==========================================
  // TESTIMONIALS SLIDER & TOUCH SWIPE
  // ==========================================
  const testQuote = document.getElementById('testimonialQuote');
  const testAuthor = document.getElementById('testimonialAuthor');
  const testRole = document.getElementById('testimonialRole');
  const prevTestBtn = document.getElementById('prevTestBtn');
  const nextTestBtn = document.getElementById('nextTestBtn');
  const testimonialsViewport = document.getElementById('testimonialsViewport');

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

  function nextTestimonial() {
    testimonialIndex = (testimonialIndex + 1) % testimonials.length;
    renderTestimonial(testimonialIndex);
  }

  function prevTestimonial() {
    testimonialIndex = (testimonialIndex - 1 + testimonials.length) % testimonials.length;
    renderTestimonial(testimonialIndex);
  }

  if (prevTestBtn) prevTestBtn.addEventListener('click', prevTestimonial);
  if (nextTestBtn) nextTestBtn.addEventListener('click', nextTestimonial);

  // Touch Swipe on Testimonials
  let testTouchStartX = 0;
  let testTouchEndX = 0;
  if (testimonialsViewport) {
    testimonialsViewport.addEventListener(
      'touchstart',
      (e) => {
        testTouchStartX = e.touches[0].clientX;
      },
      { passive: true }
    );

    testimonialsViewport.addEventListener(
      'touchend',
      (e) => {
        testTouchEndX = e.changedTouches[0].clientX;
        const deltaX = testTouchEndX - testTouchStartX;
        if (Math.abs(deltaX) > 40) {
          if (deltaX < 0) {
            nextTestimonial();
          } else {
            prevTestimonial();
          }
        }
      },
      { passive: true }
    );
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
        iframe.src = src;
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
      if (searchInput) searchInput.focus();
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
    const matches = menuItems.filter(
      (item) =>
        item.name.toLowerCase().includes(filter) || item.description.toLowerCase().includes(filter)
    );

    if (matches.length === 0) {
      searchResults.innerHTML =
        '<p style="color: #888; text-align: center; padding: 20px;">No burgers found. Try "Crispy", "Vegy", or "Combo"!</p>';
      return;
    }

    searchResults.innerHTML = matches
      .map(
        (item) => `
      <div class="search-result-row" style="display: flex; align-items: center; justify-content: space-between; padding: 10px 14px; background: #FFF8F3; border-radius: 12px; cursor: pointer; transition: background 0.2s;" data-id="${item.id}">
        <div style="display: flex; align-items: center; gap: 14px;">
          <img src="${item.image}" style="width: 44px; height: 44px; object-fit: contain; background: #FF8516; border-radius: 8px; padding: 2px;">
          <div>
            <div style="font-weight: 700; font-size: 0.95rem; color: var(--text-dark);">${item.name}</div>
            <div style="color: var(--primary-orange); font-weight: 800; font-size: 0.9rem;">₹${item.price.toFixed(2)}</div>
          </div>
        </div>
        <button style="background: var(--primary-orange); color: #fff; padding: 6px 14px; border-radius: 20px; font-weight: 700; font-size: 0.85rem;">+ Add</button>
      </div>
    `
      )
      .join('');

    searchResults.querySelectorAll('.search-result-row').forEach((row) => {
      row.addEventListener('click', () => {
        const id = row.getAttribute('data-id');
        const item = menuItems.find((i) => i.id === id);
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
        showToast('Link copied to clipboard! 📋');
      }
    });
  }

  // ==========================================
  // NEWSLETTER SUBSCRIPTION FORM
  // ==========================================
  const subscribeForm = document.getElementById('subscribeForm');
  if (subscribeForm) {
    subscribeForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const emailInput = subscribeForm.querySelector('input[type="email"]');
      if (emailInput && emailInput.value.trim()) {
        showToast(`🎉 Subscribed ${emailInput.value.trim()} for fresh burger offers!`);
        emailInput.value = '';
      }
    });
  }

  // Promo Banner "Order Combo Deal"
  const promoOrderBtn = document.getElementById('promoOrderBtn');
  if (promoOrderBtn) {
    promoOrderBtn.addEventListener('click', () => {
      const comboItem = menuItems.find((i) => i.id === 'promo-combo');
      if (comboItem) {
        addToCart(comboItem);
        openCart();
      }
    });
  }

  // Hero "Explore Menu" button
  const btnExplore = document.getElementById('btnExplore');
  if (btnExplore) {
    btnExplore.addEventListener('click', () => {
      const hotSection = document.getElementById('hotItemsSection');
      if (hotSection) {
        hotSection.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }

  // Escape key closes any open modal or drawer
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeCart();
      closeMobileNav();
      closeCheckout();
      closeReceipt();
      if (demoModal) demoModal.classList.remove('open');
      if (searchModal) searchModal.classList.remove('open');
      document.body.style.overflow = '';
    }
  });
});
