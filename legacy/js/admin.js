/**
 * BURGERS THAT LOVE THE EARTH — ADMIN DASHBOARD JAVASCRIPT
 * Real-time order dispatching, menu item management & analytics
 */

document.addEventListener('DOMContentLoaded', () => {
  let allOrders = [];
  let allMenuItems = [];
  let currentFilter = 'All';
  let currentSearchQuery = '';
  let currentMenuCategory = 'All';

  // DOM Elements
  const ordersFeed = document.getElementById('ordersFeed');
  const adminMenuGrid = document.getElementById('adminMenuGrid');
  const orderSearchInput = document.getElementById('orderSearchInput');
  const filterBtns = document.querySelectorAll('.filter-btn');
  const menuCatBtns = document.querySelectorAll('.menu-cat-btn');
  const navTabs = document.querySelectorAll('.nav-tab');
  const tabContents = document.querySelectorAll('.admin-tab-content');
  const btnRefresh = document.getElementById('btnRefresh');

  // KPI Elements
  const kpiTotalRevenue = document.getElementById('kpiTotalRevenue');
  const kpiTodayRevenue = document.getElementById('kpiTodayRevenue');
  const kpiTotalOrders = document.getElementById('kpiTotalOrders');
  const kpiTodayOrders = document.getElementById('kpiTodayOrders');
  const kpiPendingOrders = document.getElementById('kpiPendingOrders');
  const kpiDeliveredOrders = document.getElementById('kpiDeliveredOrders');
  const pendingOrdersBadge = document.getElementById('pendingOrdersBadge');

  // Counts
  const countAll = document.getElementById('countAll');
  const countConfirmed = document.getElementById('countConfirmed');
  const countPreparing = document.getElementById('countPreparing');
  const countDelivery = document.getElementById('countDelivery');
  const countDelivered = document.getElementById('countDelivered');

  // Menu Modal
  const itemModal = document.getElementById('itemModal');
  const btnOpenAddModal = document.getElementById('btnOpenAddModal');
  const btnCloseItemModal = document.getElementById('btnCloseItemModal');
  const btnCancelItem = document.getElementById('btnCancelItem');
  const itemForm = document.getElementById('itemForm');
  const itemModalTitle = document.getElementById('itemModalTitle');
  const editItemId = document.getElementById('editItemId');
  const itemName = document.getElementById('itemName');
  const itemCategory = document.getElementById('itemCategory');
  const itemPrice = document.getElementById('itemPrice');
  const itemImage = document.getElementById('itemImage');
  const itemPrepTime = document.getElementById('itemPrepTime');
  const itemDesc = document.getElementById('itemDesc');
  const itemInStock = document.getElementById('itemInStock');

  // Toast
  const adminToast = document.getElementById('adminToast');
  function showToast(msg) {
    if (!adminToast) return;
    adminToast.textContent = msg;
    adminToast.classList.add('show');
    setTimeout(() => adminToast.classList.remove('show'), 2800);
  }

  // ==========================================
  // TAB NAVIGATION
  // ==========================================
  navTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      navTabs.forEach((t) => t.classList.remove('active'));
      tabContents.forEach((c) => c.classList.remove('active'));

      tab.classList.add('active');
      const target = tab.getAttribute('data-tab');
      const targetContent = document.getElementById(target);
      if (targetContent) targetContent.classList.add('active');

      if (target === 'menuTab') fetchMenu();
      if (target === 'analyticsTab') fetchAnalytics();
    });
  });

  // ==========================================
  // FETCH & RENDER ORDERS
  // ==========================================
  async function fetchOrders() {
    try {
      const res = await fetch('/api/orders');
      const data = await res.json();
      if (data.success) {
        allOrders = data.orders || [];
        updateCountsAndKPIs();
        renderOrders();
      }
    } catch (err) {
      console.error('Fetch orders error:', err);
      ordersFeed.innerHTML =
        '<div class="empty-state">Failed to load orders. Please refresh.</div>';
    }
  }

  function updateCountsAndKPIs() {
    const confirmedCount = allOrders.filter((o) => o.status === 'Confirmed').length;
    const preparingCount = allOrders.filter((o) => o.status === 'Preparing').length;
    const deliveryCount = allOrders.filter((o) => o.status === 'Out for Delivery').length;
    const deliveredCount = allOrders.filter((o) => o.status === 'Delivered').length;
    const pendingTotal = confirmedCount + preparingCount + deliveryCount;

    if (countAll) countAll.textContent = allOrders.length;
    if (countConfirmed) countConfirmed.textContent = confirmedCount;
    if (countPreparing) countPreparing.textContent = preparingCount;
    if (countDelivery) countDelivery.textContent = deliveryCount;
    if (countDelivered) countDelivered.textContent = deliveredCount;
    if (pendingOrdersBadge) pendingOrdersBadge.textContent = pendingTotal;

    const totalRev = allOrders.reduce((sum, o) => sum + (o.pricing?.grandTotal || 0), 0);
    if (kpiTotalRevenue) kpiTotalRevenue.textContent = `₹${totalRev.toFixed(2)}`;
    if (kpiTotalOrders) kpiTotalOrders.textContent = allOrders.length;
    if (kpiPendingOrders) kpiPendingOrders.textContent = pendingTotal;
    if (kpiDeliveredOrders) kpiDeliveredOrders.textContent = deliveredCount;

    // Today's metrics
    const todayStr = new Date().toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata' });
    const todayOrders = allOrders.filter((o) => {
      try {
        return (
          new Date(o.createdAt).toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata' }) ===
          todayStr
        );
      } catch {
        return false;
      }
    });
    const todayRev = todayOrders.reduce((sum, o) => sum + (o.pricing?.grandTotal || 0), 0);
    if (kpiTodayRevenue) kpiTodayRevenue.textContent = `₹${todayRev.toFixed(2)} today`;
    if (kpiTodayOrders) kpiTodayOrders.textContent = `${todayOrders.length} placed today`;
  }

  function renderOrders() {
    if (!ordersFeed) return;

    let filtered = allOrders;

    // Apply status filter
    if (currentFilter !== 'All') {
      filtered = filtered.filter(
        (o) => (o.status || '').toLowerCase() === currentFilter.toLowerCase()
      );
    }

    // Apply search filter
    if (currentSearchQuery) {
      const q = currentSearchQuery.toLowerCase();
      filtered = filtered.filter(
        (o) =>
          o.orderId.toLowerCase().includes(q) ||
          (o.customer?.name || '').toLowerCase().includes(q) ||
          (o.customer?.phone || '').includes(q) ||
          (o.customer?.address || '').toLowerCase().includes(q)
      );
    }

    if (filtered.length === 0) {
      ordersFeed.innerHTML = `
        <div class="empty-state">
          <span style="font-size: 3rem; display: block; margin-bottom: 12px;">🍔</span>
          <h3>No orders found</h3>
          <p>There are no orders matching "${currentFilter}" filter.</p>
        </div>
      `;
      return;
    }

    ordersFeed.innerHTML = filtered
      .map((order) => {
        const statusClass = (order.status || 'confirmed').toLowerCase().replace(/\s+/g, '-');
        const pricing = order.pricing || {};
        const customer = order.customer || {};

        return `
        <div class="order-admin-card" id="card-${order.orderId}">
          <div class="order-card-header">
            <div class="order-id-block">
              <span class="order-id-title">#${order.orderId}</span>
              <span class="status-badge ${statusClass}">
                ● ${order.status || 'Confirmed'}
              </span>
            </div>
            <div class="order-time-stamp">
              📅 ${order.formattedDate || ''} at ${order.formattedTime || ''}
            </div>
          </div>

          <div class="order-card-body">
            <!-- Customer Column -->
            <div class="customer-info-box">
              <h4>Customer & Destination</h4>
              <div class="customer-name">${customer.name || 'Anonymous Guest'}</div>
              <a href="tel:${customer.phone}" class="customer-phone-link">
                📞 ${customer.phone || 'N/A'}
              </a>
              ${customer.alternatePhone ? `<div style="font-size: 0.8rem; color: #888;">Alt: ${customer.alternatePhone}</div>` : ''}
              <div style="font-size: 0.82rem; font-weight: 700; color: #FF8516; margin: 6px 0 2px;">
                Mode: ${customer.deliveryType || 'Home Delivery'}
              </div>
              <div class="customer-address-text">
                📍 ${customer.address || 'Takeaway Counter'}
              </div>
            </div>

            <!-- Items Column -->
            <div class="order-items-box">
              <h4>Ordered Items (${(order.items || []).reduce((s, it) => s + it.quantity, 0)})</h4>
              <div class="order-items-list">
                ${(order.items || [])
                  .map(
                    (it) => `
                  <div class="order-item-chip">
                    <span><strong>${it.quantity}x</strong> ${it.name}</span>
                    <span>₹${it.lineTotal.toFixed(2)}</span>
                  </div>
                `
                  )
                  .join('')}
              </div>
            </div>

            <!-- Financial Column -->
            <div class="financial-info-box">
              <h4>Bill Summary</h4>
              <div class="financial-row">
                <span>Items Subtotal:</span>
                <span>₹${(pricing.itemsSubtotal || 0).toFixed(2)}</span>
              </div>
              ${
                pricing.discount > 0
                  ? `
                <div class="financial-row" style="color: #10B981;">
                  <span>Discount:</span>
                  <span>-₹${pricing.discount.toFixed(2)}</span>
                </div>
              `
                  : ''
              }
              <div class="financial-row">
                <span>GST (5%):</span>
                <span>₹${(pricing.gst || 0).toFixed(2)}</span>
              </div>
              <div class="financial-row">
                <span>Delivery:</span>
                <span>${pricing.deliveryFee === 0 ? 'FREE' : '₹' + (pricing.deliveryFee || 0).toFixed(2)}</span>
              </div>
              <div class="financial-grand-total">
                <span>TOTAL:</span>
                <span>₹${(pricing.grandTotal || 0).toFixed(2)}</span>
              </div>
              <div style="font-size: 0.78rem; color: #999; margin-top: 6px;">
                💳 ${customer.paymentMethod || 'Cash on Delivery'}
              </div>
            </div>
          </div>

          <div class="order-card-footer">
            <div class="status-actions-row">
              <span style="font-size: 0.8rem; color: var(--text-muted); font-weight: 700; margin-right: 4px;">Advance Status:</span>
              ${
                order.status === 'Confirmed'
                  ? `
                <button class="btn-status-action btn-prep" data-id="${order.orderId}" data-status="Preparing">
                  🔥 Move to Kitchen
                </button>
              `
                  : ''
              }
              ${
                order.status === 'Preparing'
                  ? `
                <button class="btn-status-action btn-dispatch" data-id="${order.orderId}" data-status="Out for Delivery">
                  🛵 Out for Delivery
                </button>
              `
                  : ''
              }
              ${
                order.status === 'Out for Delivery'
                  ? `
                <button class="btn-status-action btn-deliver" data-id="${order.orderId}" data-status="Delivered">
                  ✅ Mark Delivered
                </button>
              `
                  : ''
              }
              ${
                order.status !== 'Delivered' && order.status !== 'Cancelled'
                  ? `
                <button class="btn-status-action btn-cancel-order" data-id="${order.orderId}" data-status="Cancelled">
                  ✕ Cancel
                </button>
              `
                  : ''
              }
            </div>

            <button class="btn-print-order" onclick="printSingleOrder('${order.orderId}')">
              🖨️ Print Ticket
            </button>
          </div>
        </div>
      `;
      })
      .join('');

    // Attach Status Click Handlers
    ordersFeed.querySelectorAll('.btn-status-action').forEach((btn) => {
      btn.addEventListener('click', async () => {
        const orderId = btn.getAttribute('data-id');
        const newStatus = btn.getAttribute('data-status');
        await updateOrderStatus(orderId, newStatus);
      });
    });
  }

  async function updateOrderStatus(orderId, status) {
    try {
      const res = await fetch(`/api/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      const data = await res.json();
      if (data.success) {
        showToast(`Order #${orderId} updated to ${status}!`);
        await fetchOrders();
      } else {
        showToast(data.message || 'Error updating status');
      }
    } catch (err) {
      console.error(err);
      showToast('Network error updating status');
    }
  }

  // Print helper for Admin
  window.printSingleOrder = (orderId) => {
    const order = allOrders.find((o) => o.orderId === orderId);
    if (!order) return;
    const printWindow = window.open('', '_blank', 'width=450,height=650');
    printWindow.document.write(`
      <html>
      <head>
        <title>Ticket #${order.orderId}</title>
        <style>
          body { font-family: monospace; padding: 20px; color: #000; font-size: 13px; line-height: 1.4; }
          .center { text-align: center; }
          .line { border-bottom: 1px dashed #000; margin: 10px 0; }
          .row { display: flex; justify-content: space-between; margin: 4px 0; }
          h2 { margin: 0; }
        </style>
      </head>
      <body>
        <div class="center">
          <h2>BURGER</h2>
          <p>KITCHEN DISPATCH TICKET</p>
          <div class="line"></div>
          <p><strong>ORDER #${order.orderId}</strong></p>
          <p>${order.formattedDate} - ${order.formattedTime}</p>
        </div>
        <div class="line"></div>
        <p><strong>CUSTOMER:</strong> ${order.customer?.name}</p>
        <p><strong>PHONE:</strong> ${order.customer?.phone}</p>
        <p><strong>DESTINATION:</strong> ${order.customer?.address}</p>
        <p><strong>TYPE:</strong> ${order.customer?.deliveryType}</p>
        <div class="line"></div>
        <p><strong>ITEMS:</strong></p>
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
        <div class="line"></div>
        <div class="row">
          <span><strong>GRAND TOTAL:</strong></span>
          <span><strong>₹${(order.pricing?.grandTotal || 0).toFixed(2)}</strong></span>
        </div>
        <p>Payment: ${order.customer?.paymentMethod}</p>
      </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 250);
  };

  // Filter Buttons Click
  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      currentFilter = btn.getAttribute('data-status');
      renderOrders();
    });
  });

  // Order Search
  if (orderSearchInput) {
    orderSearchInput.addEventListener('input', (e) => {
      currentSearchQuery = e.target.value.trim();
      renderOrders();
    });
  }

  // Refresh
  if (btnRefresh) {
    btnRefresh.addEventListener('click', () => {
      fetchOrders();
      showToast('Refreshing live data...');
    });
  }

  // ==========================================
  // MENU MANAGEMENT LOGIC
  // ==========================================
  async function fetchMenu() {
    try {
      const res = await fetch('/api/menu');
      const data = await res.json();
      if (data.success) {
        allMenuItems = data.items || [];
        renderMenuItems();
      }
    } catch (err) {
      console.error(err);
      if (adminMenuGrid) adminMenuGrid.innerHTML = '<p>Error loading menu items.</p>';
    }
  }

  function renderMenuItems() {
    if (!adminMenuGrid) return;
    let items = allMenuItems;
    if (currentMenuCategory !== 'All') {
      items = items.filter(
        (it) => (it.category || '').toLowerCase() === currentMenuCategory.toLowerCase()
      );
    }

    adminMenuGrid.innerHTML = items
      .map(
        (item) => `
      <div class="admin-menu-card" id="menu-card-${item.id}">
        <img src="${item.image}" alt="${item.name}" class="admin-item-img">
        <div class="admin-item-info">
          <span class="admin-item-cat">${item.category || 'Burgers'}</span>
          <h4>${item.name}</h4>
          <p class="admin-item-desc">${item.description || 'Delicious gourmet recipe with fresh organic vegetables.'}</p>
        </div>
        <div class="admin-item-row">
          <span class="admin-item-price">₹${item.price.toFixed(2)}</span>
          <label class="stock-toggle-label">
            <input type="checkbox" ${item.inStock !== false ? 'checked' : ''} onchange="toggleItemStock('${item.id}', this.checked)">
            <span>${item.inStock !== false ? 'In Stock' : 'Out of Stock'}</span>
          </label>
        </div>
        <div class="admin-card-actions">
          <button class="btn-card-action btn-edit-item" onclick="openEditModal('${item.id}')">Edit</button>
          <button class="btn-card-action btn-delete-item" onclick="deleteMenuItem('${item.id}')">Delete</button>
        </div>
      </div>
    `
      )
      .join('');
  }

  window.toggleItemStock = async (id, inStock) => {
    try {
      const res = await fetch(`/api/menu/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ inStock })
      });
      const data = await res.json();
      if (data.success) {
        showToast(`Item availability updated: ${inStock ? 'In Stock' : 'Out of Stock'}`);
      }
    } catch (err) {
      console.error(err);
    }
  };

  window.openEditModal = (id) => {
    const item = allMenuItems.find((it) => it.id === id);
    if (!item) return;
    itemModalTitle.textContent = 'Edit Menu Item';
    editItemId.value = item.id;
    itemName.value = item.name;
    itemCategory.value = item.category || 'Burgers';
    itemPrice.value = item.price;
    itemImage.value = item.image;
    itemPrepTime.value = item.prepTime || '15 mins';
    itemDesc.value = item.description || '';
    itemInStock.checked = item.inStock !== false;
    itemModal.classList.add('open');
  };

  window.deleteMenuItem = async (id) => {
    if (!confirm('Are you sure you want to remove this item from the menu?')) return;
    try {
      const res = await fetch(`/api/menu/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        showToast('Menu item removed.');
        fetchMenu();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Menu Category Filter Buttons
  menuCatBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      menuCatBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      currentMenuCategory = btn.getAttribute('data-cat');
      renderMenuItems();
    });
  });

  // Add Item Modal
  if (btnOpenAddModal) {
    btnOpenAddModal.addEventListener('click', () => {
      itemModalTitle.textContent = 'Add New Menu Item';
      itemForm.reset();
      editItemId.value = '';
      itemImage.value = 'images/burger-1.png';
      itemInStock.checked = true;
      itemModal.classList.add('open');
    });
  }

  function closeItemModal() {
    if (itemModal) itemModal.classList.remove('open');
  }

  if (btnCloseItemModal) btnCloseItemModal.addEventListener('click', closeItemModal);
  if (btnCancelItem) btnCancelItem.addEventListener('click', closeItemModal);

  if (itemForm) {
    itemForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const id = editItemId.value;
      const payload = {
        name: itemName.value.trim(),
        category: itemCategory.value,
        price: parseFloat(itemPrice.value) || 0,
        image: itemImage.value.trim(),
        prepTime: itemPrepTime.value.trim(),
        description: itemDesc.value.trim(),
        inStock: itemInStock.checked
      };

      try {
        let res;
        if (id) {
          res = await fetch(`/api/menu/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          });
        } else {
          res = await fetch('/api/menu', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          });
        }

        const data = await res.json();
        if (data.success) {
          showToast(id ? 'Menu item updated!' : 'New menu item added!');
          closeItemModal();
          fetchMenu();
        } else {
          showToast(data.message || 'Error saving item');
        }
      } catch (err) {
        console.error(err);
        showToast('Error saving item');
      }
    });
  }

  // ==========================================
  // ANALYTICS & STATS LOGIC
  // ==========================================
  async function fetchAnalytics() {
    try {
      const res = await fetch('/api/admin/stats');
      const data = await res.json();
      if (data.success) {
        const stats = data.stats;
        const aovEl = document.getElementById('analyticsAov');
        const menuCountEl = document.getElementById('analyticsMenuCount');
        const breakdownList = document.getElementById('analyticsBreakdownList');

        if (aovEl) {
          const aov = stats.totalOrders > 0 ? stats.totalRevenue / stats.totalOrders : 0;
          aovEl.textContent = `₹${aov.toFixed(2)}`;
        }
        if (menuCountEl) menuCountEl.textContent = `${stats.menuItemsCount} active items`;

        if (breakdownList) {
          const counts = stats.statusCounts || {};
          const total = Math.max(1, stats.totalOrders);
          breakdownList.innerHTML = `
            <div class="breakdown-row">
              <span>Confirmed Orders:</span>
              <div class="breakdown-bar-wrap">
                <div class="breakdown-bar-fill" style="width: ${(counts.confirmed / total) * 100}%; background: #3B82F6;"></div>
              </div>
              <strong>${counts.confirmed || 0}</strong>
            </div>
            <div class="breakdown-row">
              <span>In Kitchen Preparation:</span>
              <div class="breakdown-bar-wrap">
                <div class="breakdown-bar-fill" style="width: ${(counts.preparing / total) * 100}%; background: #F59E0B;"></div>
              </div>
              <strong>${counts.preparing || 0}</strong>
            </div>
            <div class="breakdown-row">
              <span>Out for Delivery:</span>
              <div class="breakdown-bar-wrap">
                <div class="breakdown-bar-fill" style="width: ${(counts.outForDelivery / total) * 100}%; background: #8B5CF6;"></div>
              </div>
              <strong>${counts.outForDelivery || 0}</strong>
            </div>
            <div class="breakdown-row">
              <span>Delivered:</span>
              <div class="breakdown-bar-wrap">
                <div class="breakdown-bar-fill" style="width: ${(counts.delivered / total) * 100}%; background: #10B981;"></div>
              </div>
              <strong>${counts.delivered || 0}</strong>
            </div>
            <div class="breakdown-row">
              <span>Cancelled:</span>
              <div class="breakdown-bar-wrap">
                <div class="breakdown-bar-fill" style="width: ${(counts.cancelled / total) * 100}%; background: #EF4444;"></div>
              </div>
              <strong>${counts.cancelled || 0}</strong>
            </div>
          `;
        }
      }
    } catch (err) {
      console.error(err);
    }
  }

  // Initial Load
  fetchOrders();

  // Auto-refresh orders every 10 seconds for real-time kitchen experience
  setInterval(() => {
    fetchOrders();
  }, 10000);
});
