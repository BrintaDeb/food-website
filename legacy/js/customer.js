/**
 * BURGERS THAT LOVE THE EARTH — CUSTOMER PORTAL JS
 * Browsing, full address checkout, phone lookup, order tracking & re-ordering
 */

document.addEventListener('DOMContentLoaded', () => {
  let menuList = [];
  let cart = [];
  let currentCategory = 'All';
  let currentSearch = '';
  let appliedPromoCode = '';

  // Load cart from storage
  try {
    const saved = localStorage.getItem('burger_cart');
    if (saved) cart = JSON.parse(saved);
  } catch {
    cart = [];
  }

  // DOM Elements
  const custMenuGrid = document.getElementById('custMenuGrid');
  const custCartBadge = document.getElementById('custCartBadge');
  const openCartBtn = document.getElementById('openCartBtn');
  const cartOverlay = document.getElementById('cartOverlay');
  const cartDrawer = document.getElementById('cartDrawer');
  const btnCloseCartDrawer = document.getElementById('btnCloseCartDrawer');
  const drawerCartItems = document.getElementById('drawerCartItems');
  const drawerSubtotal = document.getElementById('drawerSubtotal');
  const drawerDelivery = document.getElementById('drawerDelivery');
  const drawerGrandTotal = document.getElementById('drawerGrandTotal');
  const btnProceedCheckout = document.getElementById('btnProceedCheckout');

  // Tabs
  const custTabs = document.querySelectorAll('.cust-tab');
  const tabContents = document.querySelectorAll('.cust-tab-content');
  const myOrdersBadge = document.getElementById('myOrdersBadge');

  // Filter & Search
  const catPills = document.querySelectorAll('.cat-pill');
  const custMenuSearch = document.getElementById('custMenuSearch');

  // Checkout Modal
  const checkoutModal = document.getElementById('checkoutModal');
  const btnCloseCheckout = document.getElementById('btnCloseCheckout');
  const customerCheckoutForm = document.getElementById('customerCheckoutForm');
  const savedAddressDropdown = document.getElementById('savedAddressDropdown');
  const savedAddressSelectorRow = document.getElementById('savedAddressSelectorRow');
  const custFlat = document.getElementById('custFlat');
  const custStreet = document.getElementById('custStreet');
  const custLandmark = document.getElementById('custLandmark');
  const custCity = document.getElementById('custCity');
  const custPincode = document.getElementById('custPincode');
  const custDeliveryType = document.getElementById('custDeliveryType');
  const portalPromoInput = document.getElementById('portalPromoInput');
  const btnApplyPortalPromo = document.getElementById('btnApplyPortalPromo');
  const portalPromoStatus = document.getElementById('portalPromoStatus');
  const revItemsCount = document.getElementById('revItemsCount');
  const revSubtotal = document.getElementById('revSubtotal');
  const revDiscountRow = document.getElementById('revDiscountRow');
  const revDiscountLabel = document.getElementById('revDiscountLabel');
  const revDiscountValue = document.getElementById('revDiscountValue');
  const revGst = document.getElementById('revGst');
  const revDelivery = document.getElementById('revDelivery');
  const revGrandTotal = document.getElementById('revGrandTotal');
  const btnSubmitPortalOrder = document.getElementById('btnSubmitPortalOrder');
  const portalSubmitText = document.getElementById('portalSubmitText');
  const portalSubmitSpinner = document.getElementById('portalSubmitSpinner');

  // Receipt Modal
  const portalReceiptModal = document.getElementById('portalReceiptModal');
  const btnClosePortalReceipt = document.getElementById('btnClosePortalReceipt');
  const btnPrintCustomerReceipt = document.getElementById('btnPrintCustomerReceipt');
  const btnOrderAgain = document.getElementById('btnOrderAgain');

  // Order Lookup
  const orderLookupForm = document.getElementById('orderLookupForm');
  const lookupPhoneInput = document.getElementById('lookupPhoneInput');
  const customerOrdersFeed = document.getElementById('customerOrdersFeed');

  // Saved Addresses
  const savedAddressesGrid = document.getElementById('savedAddressesGrid');
  const newAddressModal = document.getElementById('newAddressModal');
  const btnOpenAddressModal = document.getElementById('btnOpenAddressModal');
  const btnCloseAddressModal = document.getElementById('btnCloseAddressModal');
  const saveAddressForm = document.getElementById('saveAddressForm');

  // Toast
  const portalToast = document.getElementById('portalToast');
  function showToast(msg) {
    if (!portalToast) return;
    portalToast.textContent = msg;
    portalToast.classList.add('show');
    setTimeout(() => portalToast.classList.remove('show'), 2800);
  }

  // ==========================================
  // TAB NAVIGATION
  // ==========================================
  custTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      custTabs.forEach((t) => t.classList.remove('active'));
      tabContents.forEach((c) => c.classList.remove('active'));

      tab.classList.add('active');
      const target = tab.getAttribute('data-tab');
      const targetContent = document.getElementById(target);
      if (targetContent) targetContent.classList.add('active');

      if (target === 'addressesTab') renderSavedAddresses();
      if (target === 'myOrdersTab') {
        const savedPhone = localStorage.getItem('burger_user_phone');
        if (savedPhone && lookupPhoneInput) {
          lookupPhoneInput.value = savedPhone;
          fetchCustomerOrders(savedPhone);
        }
      }
    });
  });

  // ==========================================
  // FETCH & RENDER MENU
  // ==========================================
  async function fetchMenu() {
    try {
      const res = await fetch('/api/menu');
      const data = await res.json();
      if (data.success) {
        menuList = data.items || [];
        renderMenu();
      }
    } catch (err) {
      console.error(err);
      if (custMenuGrid) custMenuGrid.innerHTML = '<p>Error loading menu.</p>';
    }
  }

  function renderMenu() {
    if (!custMenuGrid) return;
    let filtered = menuList.filter((it) => it.inStock !== false);

    if (currentCategory !== 'All') {
      filtered = filtered.filter(
        (it) => (it.category || '').toLowerCase() === currentCategory.toLowerCase()
      );
    }

    if (currentSearch) {
      const q = currentSearch.toLowerCase();
      filtered = filtered.filter(
        (it) =>
          it.name.toLowerCase().includes(q) || (it.description || '').toLowerCase().includes(q)
      );
    }

    if (filtered.length === 0) {
      custMenuGrid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 40px; color: #888;">
          <h3>No royal dishes found in this category</h3>
          <p>Please try a different category or search term.</p>
        </div>
      `;
      return;
    }

    custMenuGrid.innerHTML = filtered
      .map(
        (item) => `
      <div class="cust-item-card">
        <div class="cust-card-img-wrap">
          <img src="${item.image}" alt="${item.name}" loading="lazy">
        </div>
        <span class="cust-card-category">${item.category || 'Indian'} • ${item.prepTime || '20 mins'}</span>
        <h3 class="cust-card-title">${item.name}</h3>
        <p class="cust-card-desc">${item.description || 'Authentic slow dum-cooked Indian royal delicacy.'}</p>
        <div class="cust-card-footer">
          <span class="cust-card-price">₹${item.price.toFixed(2)}</span>
          <button class="btn-add-to-bag" onclick="addToCart('${item.id}')">
            <span>+ Add to Bag</span>
          </button>
        </div>
      </div>
    `
      )
      .join('');
  }

  // Category filter clicks
  catPills.forEach((pill) => {
    pill.addEventListener('click', () => {
      catPills.forEach((p) => p.classList.remove('active'));
      pill.classList.add('active');
      currentCategory = pill.getAttribute('data-category');
      renderMenu();
    });
  });

  if (custMenuSearch) {
    custMenuSearch.addEventListener('input', (e) => {
      currentSearch = e.target.value.trim();
      renderMenu();
    });
  }

  // ==========================================
  // CART DRAWER LOGIC
  // ==========================================
  function openCart() {
    if (!cartDrawer || !cartOverlay) return;
    cartOverlay.classList.add('open');
    cartDrawer.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeCart() {
    if (!cartDrawer || !cartOverlay) return;
    cartOverlay.classList.remove('open');
    cartDrawer.classList.remove('open');
    document.body.style.overflow = '';
  }

  if (openCartBtn) openCartBtn.addEventListener('click', openCart);
  if (btnCloseCartDrawer) btnCloseCartDrawer.addEventListener('click', closeCart);
  if (cartOverlay) cartOverlay.addEventListener('click', closeCart);

  function saveCart() {
    try {
      localStorage.setItem('burger_cart', JSON.stringify(cart));
    } catch {}
    updateCartUI();
  }

  window.addToCart = (id) => {
    const item = menuList.find((it) => it.id === id);
    if (!item) return;
    const existing = cart.find((it) => it.id === id);
    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push({ ...item, quantity: 1 });
    }
    saveCart();
    showToast(`Added "${item.name}" to your bag! 🍔`);
  };

  function updateCartUI() {
    const totalCount = cart.reduce((s, it) => s + it.quantity, 0);
    if (custCartBadge) custCartBadge.textContent = totalCount;
    const drawerCountEl = document.querySelector('.cust-cart-count');
    if (drawerCountEl) drawerCountEl.textContent = totalCount;

    if (!drawerCartItems) return;
    drawerCartItems.innerHTML = '';

    if (cart.length === 0) {
      drawerCartItems.innerHTML = `
        <div style="text-align: center; padding: 40px 10px; color: #888;">
          <span style="font-size: 3rem; display: block; margin-bottom: 8px;">🍛</span>
          <p style="font-weight: 800; font-size: 1.1rem; color: var(--text-dark);">Your bag is empty</p>
          <p style="font-size: 0.88rem;">Add some fragrant dum biryanis and royal curries to get started!</p>
        </div>
      `;
      if (drawerSubtotal) drawerSubtotal.textContent = '₹0.00';
      if (drawerGrandTotal) drawerGrandTotal.textContent = '₹0.00';
      return;
    }

    let subtotal = 0;
    cart.forEach((it) => {
      const lineTotal = it.price * it.quantity;
      subtotal += lineTotal;

      const itemRow = document.createElement('div');
      itemRow.className = 'drawer-item';
      itemRow.innerHTML = `
        <img src="${it.image}" alt="${it.name}" class="drawer-item-img">
        <div class="drawer-item-info">
          <div class="drawer-item-title">${it.name}</div>
          <div class="drawer-item-price">₹${it.price.toFixed(2)}</div>
          <div class="drawer-qty-row">
            <button class="btn-drawer-qty" onclick="changeQty('${it.id}', -1)">-</button>
            <span style="font-weight: 800; font-size: 0.9rem;">${it.quantity}</span>
            <button class="btn-drawer-qty" onclick="changeQty('${it.id}', 1)">+</button>
          </div>
        </div>
        <div style="font-weight: 900; font-size: 0.95rem;">
          ₹${lineTotal.toFixed(2)}
        </div>
      `;
      drawerCartItems.appendChild(itemRow);
    });

    const deliveryFee = subtotal >= 500 ? 0 : 30;
    if (drawerSubtotal) drawerSubtotal.textContent = `₹${subtotal.toFixed(2)}`;
    if (drawerDelivery)
      drawerDelivery.textContent = deliveryFee === 0 ? 'FREE' : `₹${deliveryFee.toFixed(2)}`;
    if (drawerGrandTotal)
      drawerGrandTotal.textContent = `₹${(subtotal + subtotal * 0.05 + deliveryFee).toFixed(2)}`;
  }

  window.changeQty = (id, delta) => {
    const idx = cart.findIndex((it) => it.id === id);
    if (idx === -1) return;
    cart[idx].quantity += delta;
    if (cart[idx].quantity <= 0) {
      cart.splice(idx, 1);
    }
    saveCart();
  };

  // ==========================================
  // CHECKOUT MODAL LOGIC
  // ==========================================
  function openCheckout() {
    if (cart.length === 0) {
      showToast('Your bag is empty! Please add items first.');
      return;
    }
    closeCart();
    updateCheckoutReview();
    loadCustomerSavedAddresses();
    if (checkoutModal) checkoutModal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeCheckout() {
    if (checkoutModal) checkoutModal.classList.remove('open');
    document.body.style.overflow = '';
  }

  if (btnProceedCheckout) btnProceedCheckout.addEventListener('click', openCheckout);
  if (btnCloseCheckout) btnCloseCheckout.addEventListener('click', closeCheckout);

  function updateCheckoutReview() {
    const totalCount = cart.reduce((s, it) => s + it.quantity, 0);
    const subtotal = cart.reduce((s, it) => s + it.price * it.quantity, 0);

    let discount = 0;
    let discountLabel = '';
    if (appliedPromoCode === 'EARTH50') {
      discount = subtotal * 0.5;
      discountLabel = '50% Promo Special (EARTH50)';
    } else if (cart.some((it) => it.id === 'promo-combo')) {
      discount = 50;
      discountLabel = 'Combo Meal Discount';
    }

    const delType = custDeliveryType ? custDeliveryType.value : 'Home Delivery';
    let deliveryFee = 30.0;
    if (delType === 'Takeaway' || delType === 'Dine-in' || subtotal >= 500) {
      deliveryFee = 0.0;
    }

    const taxable = Math.max(0, subtotal - discount);
    const gst = taxable * 0.05;
    const grandTotal = taxable + gst + deliveryFee;

    if (revItemsCount) revItemsCount.textContent = totalCount;
    if (revSubtotal) revSubtotal.textContent = `₹${subtotal.toFixed(2)}`;

    if (revDiscountRow) {
      if (discount > 0) {
        revDiscountRow.style.display = 'flex';
        revDiscountLabel.textContent = discountLabel;
        revDiscountValue.textContent = `-₹${discount.toFixed(2)}`;
      } else {
        revDiscountRow.style.display = 'none';
      }
    }

    if (revGst) revGst.textContent = `₹${gst.toFixed(2)}`;
    if (revDelivery)
      revDelivery.textContent = deliveryFee === 0 ? 'FREE' : `₹${deliveryFee.toFixed(2)}`;
    if (revGrandTotal) revGrandTotal.textContent = `₹${grandTotal.toFixed(2)}`;
  }

  if (custDeliveryType) {
    custDeliveryType.addEventListener('change', updateCheckoutReview);
  }

  // Promo code in checkout
  if (btnApplyPortalPromo) {
    btnApplyPortalPromo.addEventListener('click', () => {
      const code = (portalPromoInput.value || '').trim().toUpperCase();
      if (code === 'EARTH50') {
        appliedPromoCode = 'EARTH50';
        portalPromoStatus.textContent = '🎉 EARTH50 applied! 50% discount active.';
        portalPromoStatus.style.color = '#10B981';
      } else {
        appliedPromoCode = '';
        portalPromoStatus.textContent = 'Invalid promo code. Try "EARTH50".';
        portalPromoStatus.style.color = '#EF4444';
      }
      updateCheckoutReview();
    });
  }

  // Saved addresses in checkout dropdown
  async function loadCustomerSavedAddresses() {
    const phone = localStorage.getItem('burger_user_phone');
    if (!phone || !savedAddressDropdown || !savedAddressSelectorRow) return;

    try {
      const res = await fetch(`/api/customer/profile?phone=${phone}`);
      const data = await res.json();
      if (
        data.success &&
        data.profile &&
        Array.isArray(data.profile.addresses) &&
        data.profile.addresses.length > 0
      ) {
        savedAddressSelectorRow.style.display = 'block';
        savedAddressDropdown.innerHTML =
          '<option value="">-- Choose from saved addresses --</option>' +
          data.profile.addresses
            .map((addr, idx) => `<option value="${idx}">${addr}</option>`)
            .join('');

        savedAddressDropdown.onchange = () => {
          const selIdx = savedAddressDropdown.value;
          if (selIdx !== '' && data.profile.addresses[selIdx]) {
            const chosen = data.profile.addresses[selIdx];
            if (custStreet) custStreet.value = chosen;
          }
        };
      }
    } catch (err) {}
  }

  // Handle Order Placement
  if (customerCheckoutForm) {
    customerCheckoutForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      if (cart.length === 0) {
        showToast('Your bag is empty!');
        return;
      }

      const formData = new FormData(customerCheckoutForm);
      const customer = {
        name: formData.get('name'),
        phone: formData.get('phone'),
        alternatePhone: formData.get('alternatePhone') || '',
        email: formData.get('email') || '',
        flat: formData.get('flat') || '',
        street: formData.get('street') || '',
        landmark: formData.get('landmark') || '',
        city: formData.get('city') || '',
        pincode: formData.get('pincode') || '',
        deliveryType: formData.get('deliveryType') || 'Home Delivery',
        paymentMethod: formData.get('paymentMethod') || 'Cash on Delivery',
        notes: formData.get('notes') || ''
      };

      const payload = {
        customer,
        items: cart,
        promoCode: appliedPromoCode
      };

      if (portalSubmitText) portalSubmitText.textContent = 'Submitting order...';
      if (portalSubmitSpinner) portalSubmitSpinner.style.display = 'inline-block';
      if (btnSubmitPortalOrder) btnSubmitPortalOrder.disabled = true;

      try {
        const res = await fetch('/api/orders', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        const data = await res.json();

        if (res.ok && data.success && data.order) {
          // Save phone for customer convenience
          localStorage.setItem('burger_user_phone', customer.phone);
          if (lookupPhoneInput) lookupPhoneInput.value = customer.phone;

          // Clear cart
          cart = [];
          saveCart();
          closeCheckout();

          // Render Receipt Modal
          renderPortalReceipt(data.order);
          if (portalReceiptModal) portalReceiptModal.classList.add('open');
          document.body.style.overflow = 'hidden';

          showToast('🎉 Order placed successfully! Receipt generated.');

          // Refresh My Orders in background
          fetchCustomerOrders(customer.phone);
        } else {
          showToast(data.message || 'Error placing order');
        }
      } catch (err) {
        console.error(err);
        showToast('Network error submitting order.');
      } finally {
        if (portalSubmitText) portalSubmitText.textContent = 'Confirm Order & Generate Receipt';
        if (portalSubmitSpinner) portalSubmitSpinner.style.display = 'none';
        if (btnSubmitPortalOrder) btnSubmitPortalOrder.disabled = false;
      }
    });
  }

  // ==========================================
  // RECEIPT RENDERING & PRINTING
  // ==========================================
  function renderPortalReceipt(order) {
    if (!portalReceiptModal) return;

    const pricing = order.pricing || {};
    const customer = order.customer || {};

    const codeEl = document.getElementById('receiptCode');
    const timeEl = document.getElementById('receiptTime');
    const custNameEl = document.getElementById('receiptCustName');
    const custPhoneEl = document.getElementById('receiptCustPhone');
    const custAddrEl = document.getElementById('receiptCustAddress');
    const custPayEl = document.getElementById('receiptCustPay');
    const itemsTable = document.getElementById('receiptItemsTable');
    const rSubtotal = document.getElementById('rSubtotal');
    const rDiscountRow = document.getElementById('rDiscountRow');
    const rDiscountLabel = document.getElementById('rDiscountLabel');
    const rDiscountValue = document.getElementById('rDiscountValue');
    const rGst = document.getElementById('rGst');
    const rDelivery = document.getElementById('rDelivery');
    const rGrandTotal = document.getElementById('rGrandTotal');
    const rBarcode = document.getElementById('rBarcode');
    const statusText = document.getElementById('portalReceiptStatusText');

    if (codeEl) codeEl.textContent = `#${order.orderId}`;
    if (timeEl) timeEl.textContent = `${order.formattedDate} at ${order.formattedTime}`;
    if (custNameEl) custNameEl.textContent = customer.name;
    if (custPhoneEl) custPhoneEl.textContent = customer.phone;
    if (custAddrEl) custAddrEl.textContent = `${customer.deliveryType}: ${customer.address}`;
    if (custPayEl) custPayEl.textContent = customer.paymentMethod;

    if (itemsTable) {
      itemsTable.innerHTML = (order.items || [])
        .map(
          (it) => `
        <div class="row">
          <span>${it.quantity}x ${it.name}</span>
          <span>₹${it.lineTotal.toFixed(2)}</span>
        </div>
      `
        )
        .join('');
    }

    if (rSubtotal) rSubtotal.textContent = `₹${(pricing.itemsSubtotal || 0).toFixed(2)}`;

    if (rDiscountRow) {
      if (pricing.discount > 0) {
        rDiscountRow.style.display = 'flex';
        if (rDiscountLabel) rDiscountLabel.textContent = pricing.discountLabel || 'Discount';
        if (rDiscountValue) rDiscountValue.textContent = `-₹${pricing.discount.toFixed(2)}`;
      } else {
        rDiscountRow.style.display = 'none';
      }
    }

    if (rGst) rGst.textContent = `₹${(pricing.gst || 0).toFixed(2)}`;
    if (rDelivery)
      rDelivery.textContent =
        pricing.deliveryFee === 0 ? 'FREE' : `₹${(pricing.deliveryFee || 0).toFixed(2)}`;
    if (rGrandTotal) rGrandTotal.textContent = `₹${(pricing.grandTotal || 0).toFixed(2)}`;
    if (rBarcode) rBarcode.textContent = `${order.orderId}-VERIFIED`;

    // Live Step Tracker simulation
    const kitchenNode = document.getElementById('portalTrackerKitchen');
    const deliveryNode = document.getElementById('portalTrackerDelivery');
    const deliveryLine = document.getElementById('portalTrackerDeliveryLine');

    setTimeout(() => {
      if (kitchenNode) kitchenNode.classList.add('active');
      if (statusText) statusText.textContent = 'In The Kitchen 🔥';
    }, 6000);

    setTimeout(() => {
      if (deliveryLine) deliveryLine.classList.add('active');
      if (deliveryNode) deliveryNode.classList.add('active');
      if (statusText) statusText.textContent = 'Out for Delivery 🛵';
    }, 14000);
  }

  function closePortalReceipt() {
    if (portalReceiptModal) portalReceiptModal.classList.remove('open');
    document.body.style.overflow = '';
  }

  if (btnClosePortalReceipt) btnClosePortalReceipt.addEventListener('click', closePortalReceipt);
  if (btnOrderAgain) {
    btnOrderAgain.addEventListener('click', () => {
      closePortalReceipt();
      // Switch to order tab
      const orderTabBtn = document.querySelector('[data-tab="orderTab"]');
      if (orderTabBtn) orderTabBtn.click();
    });
  }

  if (btnPrintCustomerReceipt) {
    btnPrintCustomerReceipt.addEventListener('click', () => {
      window.print();
    });
  }

  // ==========================================
  // MY ORDERS & LIVE TRACKING TAB
  // ==========================================
  if (orderLookupForm) {
    orderLookupForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const phone = lookupPhoneInput.value.trim();
      if (phone.length < 10) {
        showToast('Please enter a valid 10-digit phone number.');
        return;
      }
      localStorage.setItem('burger_user_phone', phone);
      fetchCustomerOrders(phone);
    });
  }

  async function fetchCustomerOrders(phone) {
    if (!customerOrdersFeed) return;
    customerOrdersFeed.innerHTML =
      '<div class="cust-empty-orders">Looking up orders for +91 ' + phone + '...</div>';

    try {
      const res = await fetch(`/api/customer/orders?phone=${phone}`);
      const data = await res.json();

      if (data.success && Array.isArray(data.orders)) {
        if (myOrdersBadge) {
          myOrdersBadge.textContent = data.orders.length;
          myOrdersBadge.style.display = data.orders.length > 0 ? 'inline-block' : 'none';
        }
        renderCustomerOrders(data.orders);
      } else {
        customerOrdersFeed.innerHTML =
          '<div class="cust-empty-orders">No orders found for this number.</div>';
      }
    } catch (err) {
      console.error(err);
      customerOrdersFeed.innerHTML =
        '<div class="cust-empty-orders">Error fetching orders. Please try again.</div>';
    }
  }

  function renderCustomerOrders(orders) {
    if (!customerOrdersFeed) return;
    if (orders.length === 0) {
      customerOrdersFeed.innerHTML = `
        <div class="cust-empty-orders">
          <span style="font-size: 3rem; display: block; margin-bottom: 10px;">🍔</span>
          <h3>No previous orders found</h3>
          <p>Orders placed with this phone number will appear here with live tracking.</p>
        </div>
      `;
      return;
    }

    customerOrdersFeed.innerHTML = orders
      .map((order) => {
        const pricing = order.pricing || {};
        const customer = order.customer || {};
        const statusClass = (order.status || 'confirmed').toLowerCase().replace(/\s+/g, '-');
        const step = order.statusStep || 1;

        return `
        <div class="cust-order-card">
          <div class="cust-order-top">
            <div>
              <span class="order-code">#${order.orderId}</span>
              <span style="font-size: 0.8rem; color: #888; margin-left: 8px;">${order.formattedDate}, ${order.formattedTime}</span>
            </div>
            <span class="order-status-chip ${statusClass}">${order.status || 'Confirmed'}</span>
          </div>

          <!-- Tracker -->
          <div class="cust-order-tracker-flow">
            <div class="tracker-node ${step >= 1 ? 'active' : ''}">
              <span>✓</span>
              <label>Confirmed</label>
            </div>
            <div class="tracker-connector ${step >= 2 ? 'active' : ''}"></div>
            <div class="tracker-node ${step >= 2 ? 'active' : ''}">
              <span>🔥</span>
              <label>Kitchen</label>
            </div>
            <div class="tracker-connector ${step >= 3 ? 'active' : ''}"></div>
            <div class="tracker-node ${step >= 3 ? 'active' : ''}">
              <span>🛵</span>
              <label>Delivery</label>
            </div>
            <div class="tracker-connector ${step >= 4 ? 'active' : ''}"></div>
            <div class="tracker-node ${step >= 4 ? 'active' : ''}">
              <span>✅</span>
              <label>Delivered</label>
            </div>
          </div>

          <div class="cust-order-details-grid">
            <div class="cust-items-table">
              <div style="font-weight: 800; font-size: 0.78rem; text-transform: uppercase; color: #888; margin-bottom: 6px;">ITEMS ORDERED</div>
              ${(order.items || [])
                .map(
                  (it) => `
                <div class="row">
                  <span>${it.quantity}x ${it.name}</span>
                  <span>₹${it.lineTotal.toFixed(2)}</span>
                </div>
              `
                )
                .join('')}
            </div>

            <div style="background: #FFF9F5; padding: 12px; border-radius: 12px;">
              <div style="font-size: 0.78rem; color: #888; font-weight: 800;">DESTINATION & PAYMENT</div>
              <div style="font-size: 0.88rem; font-weight: 700; margin: 4px 0;">${customer.address}</div>
              <div style="font-size: 0.82rem; color: #666;">Pay: ${customer.paymentMethod}</div>
              <div style="font-size: 1.1rem; font-weight: 900; color: var(--primary-orange); margin-top: 8px;">
                Total: ₹${(pricing.grandTotal || 0).toFixed(2)}
              </div>
            </div>
          </div>

          <div class="cust-order-actions">
            <button class="btn-cust-receipt" onclick="viewOrderReceipt('${order.orderId}')">
              🧾 View Receipt
            </button>
            <button class="btn-cust-reorder" onclick="reorderOrder('${order.orderId}')">
              🔄 1-Click Re-order
            </button>
          </div>
        </div>
      `;
      })
      .join('');
  }

  window.viewOrderReceipt = async (orderId) => {
    try {
      const res = await fetch(`/api/orders/${orderId}`);
      const data = await res.json();
      if (data.success && data.order) {
        renderPortalReceipt(data.order);
        if (portalReceiptModal) portalReceiptModal.classList.add('open');
      }
    } catch (err) {
      console.error(err);
    }
  };

  window.reorderOrder = async (orderId) => {
    try {
      const res = await fetch(`/api/orders/${orderId}`);
      const data = await res.json();
      if (data.success && data.order && Array.isArray(data.order.items)) {
        data.order.items.forEach((it) => {
          const existing = cart.find((c) => c.id === it.id);
          if (existing) {
            existing.quantity += it.quantity;
          } else {
            cart.push({ ...it });
          }
        });
        saveCart();
        openCart();
        showToast('Items added to your bag from past order!');
      }
    } catch (err) {
      console.error(err);
    }
  };

  // ==========================================
  // SAVED ADDRESSES TAB
  // ==========================================
  async function renderSavedAddresses() {
    if (!savedAddressesGrid) return;
    const phone = localStorage.getItem('burger_user_phone');

    if (!phone) {
      savedAddressesGrid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 40px; background: #FFF; border-radius: 18px;">
          <h3>No phone number saved</h3>
          <p>Place an order or add an address below to link your saved addresses.</p>
        </div>
      `;
      return;
    }

    try {
      const res = await fetch(`/api/customer/profile?phone=${phone}`);
      const data = await res.json();
      if (
        data.success &&
        data.profile &&
        Array.isArray(data.profile.addresses) &&
        data.profile.addresses.length > 0
      ) {
        savedAddressesGrid.innerHTML = data.profile.addresses
          .map(
            (addr, idx) => `
          <div class="address-card">
            <div class="address-card-title">📍 Address #${idx + 1}</div>
            <div class="address-card-text">${addr}</div>
          </div>
        `
          )
          .join('');
      } else {
        savedAddressesGrid.innerHTML = `
          <div style="grid-column: 1 / -1; text-align: center; padding: 40px; background: #FFF; border-radius: 18px;">
            <h3>No saved addresses yet</h3>
            <p>Click "+ Add New Address" to save your home, office, or other locations.</p>
          </div>
        `;
      }
    } catch (err) {
      console.error(err);
    }
  }

  if (btnOpenAddressModal) {
    btnOpenAddressModal.addEventListener('click', () => {
      const phone = localStorage.getItem('burger_user_phone');
      const addrPhone = document.getElementById('addrPhone');
      if (phone && addrPhone) addrPhone.value = phone;
      if (newAddressModal) newAddressModal.classList.add('open');
    });
  }

  if (btnCloseAddressModal) {
    btnCloseAddressModal.addEventListener('click', () => {
      if (newAddressModal) newAddressModal.classList.remove('open');
    });
  }

  if (saveAddressForm) {
    saveAddressForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const phone = document.getElementById('addrPhone').value.trim();
      const title = document.getElementById('addrTitle').value.trim();
      const details = document.getElementById('addrDetails').value.trim();
      const full = `${title}: ${details}`;

      try {
        const getRes = await fetch(`/api/customer/profile?phone=${phone}`);
        const getData = await getRes.json();
        const currentAddresses = getData.profile?.addresses || [];
        if (!currentAddresses.includes(full)) {
          currentAddresses.push(full);
        }

        const saveRes = await fetch('/api/customer/profile', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            phone,
            addresses: currentAddresses
          })
        });

        const saveData = await saveRes.json();
        if (saveData.success) {
          localStorage.setItem('burger_user_phone', phone);
          showToast('Address saved successfully!');
          if (newAddressModal) newAddressModal.classList.remove('open');
          saveAddressForm.reset();
          renderSavedAddresses();
        }
      } catch (err) {
        console.error(err);
        showToast('Error saving address');
      }
    });
  }

  // Initial Boot
  fetchMenu();
  updateCartUI();

  // Auto-fill phone if saved
  const savedPhone = localStorage.getItem('burger_user_phone');
  if (savedPhone) {
    if (lookupPhoneInput) lookupPhoneInput.value = savedPhone;
    const custPhone = document.getElementById('custPhone');
    if (custPhone) custPhone.value = savedPhone;
  }
});
