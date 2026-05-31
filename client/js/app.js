const API_URL = 'http://localhost:3001/api';

const CURRENT_USER = {
  id: 'user-2',
  name: '李华'
};

let currentCategory = '';
let currentSearch = '';
let selectedDate = null;
let selectedBookingSlot = null;
let currentCalendarDate = new Date(2026, 4, 1);

document.addEventListener('DOMContentLoaded', () => {
  initTabs();
  initFilters();
  initModals();
  loadUserInfo();
  loadItems();
  initCalendar();
  checkNotifications();
  
  setInterval(checkNotifications, 30000);
});

function initTabs() {
  const tabBtns = document.querySelectorAll('.tab-btn');
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
      btn.classList.add('active');
      document.getElementById(btn.dataset.tab + '-tab').classList.add('active');
      
      if (btn.dataset.tab === 'calendar') {
        renderCalendar();
      } else if (btn.dataset.tab === 'popular') {
        loadPopularItems();
      }
    });
  });
}

function initFilters() {
  const categoryBtns = document.querySelectorAll('.category-btn');
  categoryBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      categoryBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentCategory = btn.dataset.category;
      loadItems();
    });
  });

  document.getElementById('searchBtn').addEventListener('click', () => {
    currentSearch = document.getElementById('searchInput').value;
    loadItems();
  });

  document.getElementById('searchInput').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      currentSearch = document.getElementById('searchInput').value;
      loadItems();
    }
  });
}

function initModals() {
  const itemModal = document.getElementById('itemModal');
  const addItemModal = document.getElementById('addItemModal');
  const bookingsModal = document.getElementById('bookingsModal');
  const reviewModal = document.getElementById('reviewModal');
  const notificationsModal = document.getElementById('notificationsModal');

  document.querySelector('#itemModal .close').addEventListener('click', () => {
    itemModal.classList.remove('show');
  });

  document.getElementById('addItemClose').addEventListener('click', () => {
    addItemModal.classList.remove('show');
  });

  document.getElementById('bookingsClose').addEventListener('click', () => {
    bookingsModal.classList.remove('show');
  });

  document.getElementById('reviewClose').addEventListener('click', () => {
    reviewModal.classList.remove('show');
  });

  document.getElementById('notificationsClose').addEventListener('click', () => {
    notificationsModal.classList.remove('show');
  });

  [itemModal, addItemModal, bookingsModal, reviewModal, notificationsModal].forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('show');
      }
    });
  });

  document.getElementById('addItemBtn').addEventListener('click', () => {
    addItemModal.classList.add('show');
  });

  document.getElementById('myBookingsBtn').addEventListener('click', () => {
    loadBookings();
    bookingsModal.classList.add('show');
  });

  document.getElementById('notificationsBtn').addEventListener('click', () => {
    loadNotifications();
    notificationsModal.classList.add('show');
  });

  document.getElementById('markAllReadBtn').addEventListener('click', async () => {
    await fetch(`${API_URL}/notifications/${CURRENT_USER.id}/read-all`, { method: 'PUT' });
    loadNotifications();
    updateNotificationBadge();
  });

  document.getElementById('addItemForm').addEventListener('submit', handleAddItem);
  document.getElementById('reviewForm').addEventListener('submit', handleReviewSubmit);
}

async function loadUserInfo() {
  try {
    const response = await fetch(`${API_URL}/users/${CURRENT_USER.id}/balance`);
    const data = await response.json();
    
    const creditBadge = document.getElementById('creditBadge');
    const balanceBadge = document.getElementById('balanceBadge');
    
    creditBadge.textContent = `${data.creditLevel.icon} 信用分: ${data.creditScore}`;
    balanceBadge.textContent = `💰 余额: ¥${data.balance}`;
    
    if (data.creditScore >= 90) creditBadge.classList.add('credit-excellent');
    else if (data.creditScore >= 75) creditBadge.classList.add('credit-good');
    else if (data.creditScore >= 60) creditBadge.classList.add('credit-fair');
    else creditBadge.classList.add('credit-poor');
    
  } catch (error) {
    console.log('用户信息加载失败');
  }
}

async function checkNotifications() {
  try {
    const response = await fetch(`${API_URL}/notifications/${CURRENT_USER.id}?unread=true`);
    const notifications = await response.json();
    updateNotificationBadge(notifications.length);
  } catch (error) {
  }
}

function updateNotificationBadge(count = null) {
  const badge = document.getElementById('notificationCount');
  if (count === null) {
    fetch(`${API_URL}/notifications/${CURRENT_USER.id}?unread=true`)
      .then(r => r.json())
      .then(n => {
        if (n.length > 0) {
          badge.textContent = n.length;
          badge.style.display = 'inline-block';
        } else {
          badge.style.display = 'none';
        }
      });
  } else {
    if (count > 0) {
      badge.textContent = count;
      badge.style.display = 'inline-block';
    } else {
      badge.style.display = 'none';
    }
  }
}

async function loadItems() {
  const grid = document.getElementById('itemsGrid');
  grid.innerHTML = '<div class="loading">加载中...</div>';

  try {
    let url = `${API_URL}/items`;
    const params = [];
    if (currentCategory) params.push(`category=${encodeURIComponent(currentCategory)}`);
    if (currentSearch) params.push(`search=${encodeURIComponent(currentSearch)}`);
    if (params.length) url += '?' + params.join('&');

    const response = await fetch(url);
    const items = await response.json();

    if (items.length === 0) {
      grid.innerHTML = '<div style="text-align:center;padding:50px;color:#999;">暂无可用物品</div>';
      return;
    }

    grid.innerHTML = items.map(item => createItemCard(item)).join('');

    grid.querySelectorAll('.item-card').forEach(card => {
      card.addEventListener('click', () => showItemDetail(card.dataset.id));
    });
  } catch (error) {
    grid.innerHTML = '<div style="text-align:center;padding:50px;color:#f44336;">加载失败，请确保后端服务器已启动</div>';
  }
}

async function loadPopularItems() {
  const grid = document.getElementById('popularItemsGrid');
  grid.innerHTML = '<div class="loading">加载中...</div>';

  try {
    const response = await fetch(`${API_URL}/items?popular=true`);
    const items = await response.json();

    if (items.length === 0) {
      grid.innerHTML = '<div class="empty-state"><div class="empty-state-icon">🔥</div><h3>暂无热门物品</h3><p>物品使用次数超过10次后会出现在这里</p></div>';
      return;
    }

    grid.innerHTML = items.map(item => createItemCard(item)).join('');

    grid.querySelectorAll('.item-card').forEach(card => {
      card.addEventListener('click', () => showItemDetail(card.dataset.id));
    });
  } catch (error) {
    grid.innerHTML = '<div style="text-align:center;padding:50px;color:#f44336;">加载失败</div>';
  }
}

function createItemCard(item) {
  const statusClass = item.status === 'available' ? 'status-available' : 'status-borrowed';
  const statusText = item.status === 'available' ? '可借用' : '已借出';
  const popularBadge = item.isPopular ? '<span class="popular-badge">🔥 热门</span>' : '';

  return `
    <div class="item-card" data-id="${item.id}">
      <img class="item-image" src="${item.image}" alt="${item.title}">
      <div class="item-content">
        <div style="display:flex;align-items:center;margin-bottom:10px;">
          <span class="item-status ${statusClass}">${statusText}</span>
          ${popularBadge}
        </div>
        <h3 class="item-title">${item.title}</h3>
        <p class="item-description">${item.description}</p>
        <div class="item-meta">
          <span class="item-category">${item.category}</span>
          <span class="item-deposit">押金: ¥${item.deposit}</span>
        </div>
        <div class="item-stats">
          <span class="stat-item">使用 <strong>${item.usageCount}</strong> 次</span>
        </div>
        ${item.owner ? `
        <div class="item-owner">
          <img class="owner-avatar" src="${item.owner.avatar}" alt="${item.owner.name}">
          <span class="owner-name">${item.owner.name}</span>
          <span class="owner-rating">★ ${item.owner.rating || '4.5'}</span>
          ${item.owner.creditLevel ? `<span style="margin-left:auto;">${item.owner.creditLevel.icon} ${item.owner.creditLevel.level}</span>` : ''}
        </div>
        ` : ''}
      </div>
    </div>
  `;
}

async function showItemDetail(itemId) {
  const modal = document.getElementById('itemModal');
  const content = document.getElementById('itemDetailContent');
  content.innerHTML = '<div class="loading">加载中...</div>';
  modal.classList.add('show');

  try {
    const response = await fetch(`${API_URL}/items/${itemId}`);
    const item = await response.json();

    content.innerHTML = createItemDetail(item);

    document.querySelectorAll('.booking-time').forEach(time => {
      time.addEventListener('click', (e) => {
        document.querySelectorAll('.booking-time').forEach(t => t.classList.remove('selected'));
        e.target.classList.add('selected');
        selectedBookingSlot = {
          itemId: item.id,
          date: e.target.dataset.date,
          time: e.target.dataset.time
        };
      });
    });

    const bookBtn = document.getElementById('bookBtn');
    if (bookBtn) {
      bookBtn.addEventListener('click', () => handleBooking(item));
    }

    const waitlistBtn = document.getElementById('waitlistBtn');
    if (waitlistBtn) {
      waitlistBtn.addEventListener('click', () => handleJoinWaitlist(item));
    }

    const leaveWaitlistBtn = document.getElementById('leaveWaitlistBtn');
    if (leaveWaitlistBtn) {
      leaveWaitlistBtn.addEventListener('click', () => handleLeaveWaitlist(item));
    }

  } catch (error) {
    content.innerHTML = '<div style="text-align:center;color:#f44336;">加载失败</div>';
  }
}

function createItemDetail(item) {
  const statusClass = item.status === 'available' ? 'status-available' : 'status-borrowed';
  const statusText = item.status === 'available' ? '可借用' : '已借出';
  const popularBadge = item.isPopular ? '<span class="popular-badge">🔥 热门物品</span>' : '';
  
  const isInWaitlist = item.waitlist?.some(w => w.userId === CURRENT_USER.id);
  const waitlistPosition = item.waitlist?.find(w => w.userId === CURRENT_USER.id)?.position;

  let waitlistSection = '';
  if (item.status !== 'available' || (item.availableSlots?.length === 0)) {
    waitlistSection = `
      <div class="waitlist-section">
        <h4>🕒 物品暂时不可用</h4>
        ${item.waitlist && item.waitlist.length > 0 ? `
          <div class="waitlist-info">
            当前排队人数: ${item.waitlist.length} 人
            ${isInWaitlist ? `<span style="color:#667eea;font-weight:bold;">（您排在第${waitlistPosition}位）</span>` : ''}
          </div>
        ` : '<div class="waitlist-info">加入排队，物品可用时自动提醒您！</div>'}
        <div class="waitlist-actions">
          ${isInWaitlist ? 
            `<button class="btn btn-danger" id="leaveWaitlistBtn">取消排队</button>` :
            `<button class="btn btn-primary" id="waitlistBtn">加入排队</button>`
          }
        </div>
      </div>
    `;
  }

  let tutorialSection = '';
  if (item.tutorial && item.tutorial.steps && item.tutorial.steps.length > 0) {
    tutorialSection = `
      <div class="tutorial-section">
        <h3>📖 ${item.tutorial.title}</h3>
        <div class="tutorial-steps">
          ${item.tutorial.steps.map((step, index) => `
            <div class="tutorial-step">
              <div class="step-number">${index + 1}</div>
              ${step.image ? `<img class="step-image" src="${step.image}" alt="${step.title}">` : ''}
              <div class="step-content">
                <h4>${step.title}</h4>
                <p>${step.content}</p>
              </div>
            </div>
          `).join('')}
        </div>
        ${item.tutorial.warnings && item.tutorial.warnings.length > 0 ? `
          <div class="warnings-section">
            <h4>⚠️ 安全警告</h4>
            <ul>
              ${item.tutorial.warnings.map(w => `<li>${w}</li>`).join('')}
            </ul>
          </div>
        ` : ''}
      </div>
    `;
  }

  let bookingSection = '';
  if (item.status === 'available' && item.availableSlots && item.availableSlots.length > 0) {
    bookingSection = `
      <div class="booking-section">
        <h3>可用时段</h3>
        <div class="deposit-info">
          预约需冻结押金 <strong>¥${item.deposit}</strong>，归还后自动退还。
          （信用分低于60分无法借用）
        </div>
        <div class="booking-slots">
          ${item.availableSlots.map(slot => `
            <div>
              <div class="booking-date">${slot.date}</div>
              <div class="booking-times">
                ${slot.times.map(time => `
                  <button class="booking-time" data-date="${slot.date}" data-time="${time}">${time}</button>
                `).join('')}
              </div>
            </div>
          `).join('')}
        </div>
        <div class="booking-actions">
          <button class="btn btn-primary" id="bookBtn">确认预约</button>
        </div>
      </div>
    `;
  }

  return `
    <div class="item-detail">
      <div class="item-detail-header">
        <img class="item-detail-image" src="${item.image}" alt="${item.title}">
        <div class="item-detail-info">
          <div style="display:flex;align-items:center;margin-bottom:10px;">
            <h2 class="item-detail-title" style="margin:0;">${item.title}</h2>
            ${popularBadge}
          </div>
          <span class="item-status ${statusClass}" style="margin-bottom:10px;display:inline-block;">${statusText}</span>
          <p class="item-detail-desc">${item.description}</p>
          <div class="item-detail-meta">
            <span class="item-category">${item.category}</span>
            <span class="item-deposit">押金: ¥${item.deposit}</span>
          </div>
          <div class="item-stats" style="margin-top:15px;">
            <span class="stat-item">使用 <strong>${item.usageCount}</strong> 次</span>
          </div>
          ${item.owner ? `
          <div class="item-owner">
            <img class="owner-avatar" src="${item.owner.avatar}" alt="${item.owner.name}">
            <span class="owner-name">${item.owner.name}</span>
            <span class="owner-rating">★ ${item.owner.rating || '4.5'}</span>
            ${item.owner.creditLevel ? `<span style="margin-left:auto;font-weight:500;">${item.owner.creditLevel.icon} ${item.owner.creditLevel.level} (${item.owner.creditScore}分)</span>` : ''}
          </div>
          ` : ''}
        </div>
      </div>

      ${bookingSection}
      ${waitlistSection}
      ${tutorialSection}
    </div>
  `;
}

async function handleBooking(item) {
  if (!selectedBookingSlot) {
    showToast('请先选择预约时段');
    return;
  }

  if (item.ownerId === CURRENT_USER.id) {
    showToast('不能预约自己的物品');
    return;
  }

  try {
    const response = await fetch(`${API_URL}/bookings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        itemId: selectedBookingSlot.itemId,
        borrowerId: CURRENT_USER.id,
        date: selectedBookingSlot.date,
        time: selectedBookingSlot.time
      })
    });

    if (response.ok) {
      const result = await response.json();
      showToast(`预约成功！押金¥${item.deposit}已冻结`);
      document.getElementById('itemModal').classList.remove('show');
      loadItems();
      loadUserInfo();
    } else {
      const errorData = await response.json().catch(() => ({}));
      showToast(errorData.error || '预约失败，请选择其他时段');
      showItemDetail(item.id);
    }
  } catch (error) {
    showToast('预约失败，请稍后重试');
  }
}

async function handleJoinWaitlist(item) {
  try {
    const response = await fetch(`${API_URL}/waitlist/${item.id}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: CURRENT_USER.id
      })
    });

    if (response.ok) {
      const result = await response.json();
      showToast(`成功加入排队！当前排位：${result.position}`);
      showItemDetail(item.id);
      checkNotifications();
    } else {
      const errorData = await response.json().catch(() => ({}));
      showToast(errorData.error || '加入排队失败');
    }
  } catch (error) {
    showToast('操作失败，请稍后重试');
  }
}

async function handleLeaveWaitlist(item) {
  try {
    const response = await fetch(`${API_URL}/waitlist/${item.id}/${CURRENT_USER.id}`, {
      method: 'DELETE'
    });

    if (response.ok) {
      showToast('已取消排队');
      showItemDetail(item.id);
    } else {
      const errorData = await response.json().catch(() => ({}));
      showToast(errorData.error || '操作失败');
    }
  } catch (error) {
    showToast('操作失败，请稍后重试');
  }
}

async function loadBookings() {
  const list = document.getElementById('bookingsList');
  list.innerHTML = '<div class="loading">加载中...</div>';

  try {
    const response = await fetch(`${API_URL}/bookings?userId=${CURRENT_USER.id}`);
    const bookings = await response.json();

    if (bookings.length === 0) {
      list.innerHTML = '<div class="empty-state"><div class="empty-state-icon">📋</div><h3>暂无预约记录</h3><p>去浏览物品，开始您的第一次借用吧！</p></div>';
      return;
    }

    list.innerHTML = bookings.map(booking => createBookingCard(booking)).join('');

    list.querySelectorAll('[data-action]').forEach(btn => {
      btn.addEventListener('click', () => handleBookingAction(btn.dataset.bookingId, btn.dataset.action, btn.dataset.targetId));
    });
  } catch (error) {
    list.innerHTML = '<div style="text-align:center;color:#f44336;">加载失败</div>';
  }
}

function createBookingCard(booking) {
  const statusMap = {
    pending: { text: '待确认', class: 'status-pending' },
    confirmed: { text: '使用中', class: 'status-confirmed' },
    returned: { text: '已归还', class: 'status-returned' },
    cancelled: { text: '已取消', class: 'status-cancelled' }
  };

  const status = statusMap[booking.status] || statusMap.pending;
  const isOwner = booking.ownerId === CURRENT_USER.id;
  const isBorrower = booking.borrowerId === CURRENT_USER.id;

  let actions = '';

  if (booking.status === 'pending') {
    if (isOwner) {
      actions = `
        <button class="btn btn-success" data-action="confirm" data-booking-id="${booking.id}">确认借出</button>
        <button class="btn btn-danger" data-action="cancel" data-booking-id="${booking.id}">拒绝</button>
      `;
    } else if (isBorrower) {
      actions = `
        <button class="btn btn-secondary" data-action="cancel" data-booking-id="${booking.id}">取消预约</button>
      `;
    }
  } else if (booking.status === 'confirmed') {
    if (isOwner) {
      actions = `
        <button class="btn btn-success" data-action="return" data-booking-id="${booking.id}">确认归还</button>
      `;
    } else if (isBorrower) {
      actions = `
        <button class="btn btn-success" data-action="return" data-booking-id="${booking.id}">申请归还</button>
      `;
    }
  } else if (booking.status === 'returned' && !booking.reviewed) {
    const targetId = isOwner ? booking.borrowerId : booking.ownerId;
    actions = `
      <button class="btn btn-primary" data-action="review" data-booking-id="${booking.id}" data-target-id="${targetId}">评价</button>
    `;
  }

  const otherPerson = isOwner ? booking.borrower : booking.owner;

  let depositInfo = '';
  if (booking.depositAmount) {
    depositInfo = `<p class="booking-card-meta">押金: ¥${booking.depositAmount}</p>`;
  }

  return `
    <div class="booking-card">
      <img class="booking-card-image" src="${booking.itemImage}" alt="${booking.itemTitle}">
      <div class="booking-card-info">
        <h4 class="booking-card-title">${booking.itemTitle}</h4>
        <p class="booking-card-meta">预约时间: ${booking.date} ${booking.time}</p>
        <p class="booking-card-meta">${isOwner ? '借用人' : '出借人'}: ${otherPerson.name}</p>
        ${depositInfo}
        <span class="booking-card-status ${status.class}">${status.text}</span>
        <div class="booking-card-actions">${actions}</div>
      </div>
    </div>
  `;
}

async function handleBookingAction(bookingId, action, targetId) {
  let statusUpdate = {};

  switch (action) {
    case 'confirm':
      statusUpdate = { status: 'confirmed' };
      break;
    case 'cancel':
      statusUpdate = { status: 'cancelled' };
      break;
    case 'return':
      statusUpdate = { status: 'returned' };
      break;
    case 'review':
      openReviewModal(bookingId, targetId);
      return;
  }

  try {
    await fetch(`${API_URL}/bookings/${bookingId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(statusUpdate)
    });

    showToast('操作成功！');
    loadBookings();
    loadItems();
    loadUserInfo();
    checkNotifications();
  } catch (error) {
    showToast('操作失败');
  }
}

function openReviewModal(bookingId, targetId) {
  document.getElementById('reviewBookingId').value = bookingId;
  document.getElementById('reviewTargetId').value = targetId;
  document.getElementById('reviewRating').value = '5';
  document.getElementById('reviewContent').value = '';
  
  const stars = document.querySelectorAll('#starRating span');
  stars.forEach(star => star.classList.remove('active'));
  stars[4].classList.add('active');
  
  stars.forEach(star => {
    star.addEventListener('click', (e) => {
      const rating = e.target.dataset.rating;
      document.getElementById('reviewRating').value = rating;
      stars.forEach((s, i) => {
        s.classList.toggle('active', i < rating);
      });
    });
  });

  document.getElementById('reviewModal').classList.add('show');
}

async function handleReviewSubmit(e) {
  e.preventDefault();

  const bookingId = document.getElementById('reviewBookingId').value;
  const targetId = document.getElementById('reviewTargetId').value;
  const rating = parseInt(document.getElementById('reviewRating').value);
  const content = document.getElementById('reviewContent').value;

  try {
    await fetch(`${API_URL}/reviews`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        reviewerId: CURRENT_USER.id,
        targetId: targetId,
        rating: rating,
        content: content
      })
    });

    await fetch(`${API_URL}/bookings/${bookingId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reviewed: true })
    });

    showToast('评价成功！');
    document.getElementById('reviewModal').classList.remove('show');
    loadBookings();
  } catch (error) {
    showToast('评价失败');
  }
}

async function loadNotifications() {
  const list = document.getElementById('notificationsList');
  list.innerHTML = '<div class="loading">加载中...</div>';

  try {
    const response = await fetch(`${API_URL}/notifications/${CURRENT_USER.id}`);
    const notifications = await response.json();

    if (notifications.length === 0) {
      list.innerHTML = '<div class="empty-state"><div class="empty-state-icon">🔔</div><h3>暂无通知</h3><p>有新消息时会显示在这里</p></div>';
      return;
    }

    list.innerHTML = notifications.map(notif => `
      <div class="notification-item ${notif.read ? '' : 'unread'}" data-id="${notif.id}">
        <div class="notification-icon">${getNotificationIcon(notif.type)}</div>
        <div class="notification-content">
          <h4>${notif.title}</h4>
          <p>${notif.message}</p>
          <div class="notification-time">${formatTime(notif.createdAt)}</div>
        </div>
      </div>
    `).join('');

    list.querySelectorAll('.notification-item').forEach(item => {
      item.addEventListener('click', async () => {
        const id = item.dataset.id;
        await fetch(`${API_URL}/notifications/${id}/read`, { method: 'PUT' });
        item.classList.remove('unread');
        updateNotificationBadge();
      });
    });
  } catch (error) {
    list.innerHTML = '<div style="text-align:center;color:#f44336;">加载失败</div>';
  }
}

function getNotificationIcon(type) {
  const icons = {
    waitlist_joined: '📋',
    waitlist_updated: '🔄',
    item_available: '🎉',
    booking_created: '✏️',
    booking_confirmed: '✅',
    booking_cancelled: '❌',
    booking_returned: '🔄',
    review_received: '⭐'
  };
  return icons[type] || '📢';
}

function formatTime(isoString) {
  const date = new Date(isoString);
  const now = new Date();
  const diff = now - date;
  
  if (diff < 60000) return '刚刚';
  if (diff < 3600000) return `${Math.floor(diff / 60000)}分钟前`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}小时前`;
  return date.toLocaleDateString('zh-CN');
}

async function handleAddItem(e) {
  e.preventDefault();

  const dates = document.getElementById('itemAvailableDates').value.split(',').map(d => d.trim()).filter(Boolean);
  const times = document.getElementById('itemAvailableTimes').value.split(',').map(t => t.trim()).filter(Boolean);

  const itemData = {
    title: document.getElementById('itemTitle').value,
    description: document.getElementById('itemDescription').value,
    category: document.getElementById('itemCategory').value,
    deposit: parseInt(document.getElementById('itemDeposit').value) || 0,
    ownerId: CURRENT_USER.id,
    image: `https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=${encodeURIComponent(document.getElementById('itemTitle').value)}&image_size=square`,
    availableSlots: dates.length > 0 ? dates.map(date => ({ date, times: times.length > 0 ? times : ['09:00-18:00'] })) : []
  };

  try {
    const response = await fetch(`${API_URL}/items`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(itemData)
    });

    if (response.ok) {
      showToast('发布成功！');
      document.getElementById('addItemModal').classList.remove('show');
      document.getElementById('addItemForm').reset();
      loadItems();
    } else {
      showToast('发布失败');
    }
  } catch (error) {
    showToast('发布失败，请稍后重试');
  }
}

function initCalendar() {
  document.getElementById('prevMonth').addEventListener('click', () => {
    currentCalendarDate.setMonth(currentCalendarDate.getMonth() - 1);
    renderCalendar();
  });

  document.getElementById('nextMonth').addEventListener('click', () => {
    currentCalendarDate.setMonth(currentCalendarDate.getMonth() + 1);
    renderCalendar();
  });
}

async function renderCalendar() {
  const year = currentCalendarDate.getFullYear();
  const month = currentCalendarDate.getMonth();
  const monthNames = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];

  document.getElementById('currentMonth').textContent = `${year}年${monthNames[month]}`;

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  let items = [];
  try {
    const response = await fetch(`${API_URL}/items`);
    items = await response.json();
  } catch (error) {
  }

  const availableDates = {};
  items.forEach(item => {
    if (item.availableSlots) {
      item.availableSlots.forEach(slot => {
        if (!availableDates[slot.date]) {
          availableDates[slot.date] = [];
        }
        availableDates[slot.date].push(item);
      });
    }
  });

  let html = '';

  for (let i = 0; i < firstDay; i++) {
    html += '<div class="cal-day empty"></div>';
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const hasItems = availableDates[dateStr] && availableDates[dateStr].length > 0;
    const isSelected = selectedDate === dateStr;

    let classes = 'cal-day';
    if (hasItems) classes += ' available';
    if (isSelected) classes += ' selected';

    html += `
      <div class="${classes}" data-date="${dateStr}">
        <div class="cal-day-number">${day}</div>
        ${hasItems ? `<div class="cal-day-items">${availableDates[dateStr].length}件</div>` : ''}
      </div>
    `;
  }

  document.getElementById('calendarDays').innerHTML = html;

  document.querySelectorAll('.cal-day:not(.empty)').forEach(day => {
    day.addEventListener('click', () => {
      selectedDate = day.dataset.date;
      renderCalendar();
      showDateDetails(day.dataset.date, availableDates);
    });
  });
}

function showDateDetails(date, availableDates) {
  const title = document.getElementById('selectedDateTitle');
  const itemsContainer = document.getElementById('dateItems');

  title.textContent = `${date} 可用物品`;

  const items = availableDates[date] || [];

  if (items.length === 0) {
    itemsContainer.innerHTML = '<div class="empty-state"><div class="empty-state-icon">📅</div><h3>当日无可借物品</h3><p>试试其他日期吧！</p></div>';
    return;
  }

  itemsContainer.innerHTML = items.map(item => {
    const slot = item.availableSlots.find(s => s.date === date);
    return `
      <div class="date-item" onclick="showItemDetail('${item.id}')">
        <img class="date-item-image" src="${item.image}" alt="${item.title}">
        <div class="date-item-info">
          <h4>${item.title}</h4>
          <p>${item.description}</p>
          <p>押金: ¥${item.deposit}</p>
          <div class="times-list">
            ${slot && slot.times ? slot.times.map(t => `<span class="time-slot">${t}</span>`).join('') : ''}
          </div>
        </div>
      </div>
    `;
  }).join('');
}

function showToast(message) {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3000);
}

window.showItemDetail = showItemDetail;
