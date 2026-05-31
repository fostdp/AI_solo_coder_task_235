const express = require('express');
const cors = require('cors');
const path = require('path');
const {
  users,
  getUserById,
  updateUser,
  adjustCreditScore,
  freezeDeposit,
  refundDeposit,
  deductDeposit,
  getItems,
  getItemById,
  addItem,
  updateItem,
  deleteItem,
  getBookings,
  getBookingById,
  getBookingsByItem,
  getBookingsByUser,
  addBooking,
  updateBooking,
  getReviewsByItem,
  getReviewsByUser,
  addReview,
  isTimeSlotAvailable,
  getAvailableSlotsForItem,
  fuzzySearch,
  joinWaitlist,
  getWaitlist,
  leaveWaitlist,
  processWaitlist,
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  getPopularItems,
  getCreditLevel
} = require('./data');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'client')));

app.get('/api/users', (req, res) => {
  const usersWithCreditLevel = users.map(user => ({
    ...user,
    creditLevel: getCreditLevel(user.creditScore)
  }));
  res.json(usersWithCreditLevel);
});

app.get('/api/users/:id', (req, res) => {
  const user = getUserById(req.params.id);
  if (user) {
    res.json({
      ...user,
      creditLevel: getCreditLevel(user.creditScore)
    });
  } else {
    res.status(404).json({ error: 'User not found' });
  }
});

app.put('/api/users/:id/credit', (req, res) => {
  const { amount, reason } = req.body;
  const result = adjustCreditScore(req.params.id, amount, reason);
  if (result) {
    res.json(result);
  } else {
    res.status(404).json({ error: 'User not found' });
  }
});

app.get('/api/users/:id/balance', (req, res) => {
  const user = getUserById(req.params.id);
  if (user) {
    res.json({
      balance: user.balance,
      frozenDeposit: user.frozenDeposit,
      creditScore: user.creditScore,
      creditLevel: getCreditLevel(user.creditScore)
    });
  } else {
    res.status(404).json({ error: 'User not found' });
  }
});

app.get('/api/items', (req, res) => {
  const { category, search, status, popular } = req.query;
  let items;

  if (popular === 'true') {
    items = getPopularItems();
  } else {
    items = getItems();
  }
  
  if (category) {
    items = items.filter(item => item.category === category);
  }
  
  if (search) {
    const searchTerms = search.split(/\s+/).filter(Boolean);
    items = items.filter(item => {
      return searchTerms.some(term => 
        fuzzySearch(item.title, term) ||
        fuzzySearch(item.description, term) ||
        fuzzySearch(item.category, term)
      );
    });
    
    items.sort((a, b) => {
      let scoreA = 0, scoreB = 0;
      searchTerms.forEach(term => {
        if (a.title.toLowerCase().includes(term.toLowerCase())) scoreA += 10;
        if (b.title.toLowerCase().includes(term.toLowerCase())) scoreB += 10;
        if (a.description.toLowerCase().includes(term.toLowerCase())) scoreA += 5;
        if (b.description.toLowerCase().includes(term.toLowerCase())) scoreB += 5;
        if (a.category.toLowerCase().includes(term.toLowerCase())) scoreA += 3;
        if (b.category.toLowerCase().includes(term.toLowerCase())) scoreB += 3;
      });
      return scoreB - scoreA;
    });
  }
  
  if (status) {
    items = items.filter(item => item.status === status);
  }
  
  const itemsWithOwner = items.map(item => ({
    ...item,
    owner: getUserById(item.ownerId)
  }));
  
  res.json(itemsWithOwner);
});

app.get('/api/items/:id', (req, res) => {
  const item = getItemById(req.params.id);
  if (item) {
    const availableSlots = getAvailableSlotsForItem(item.id);
    const waitlist = getWaitlist(item.id);
    res.json({
      ...item,
      availableSlots,
      waitlist: waitlist.map(entry => ({
        ...entry,
        user: getUserById(entry.userId)
      })),
      owner: getUserById(item.ownerId)
    });
  } else {
    res.status(404).json({ error: 'Item not found' });
  }
});

app.post('/api/items', (req, res) => {
  const itemData = req.body;
  
  if (!itemData.title || !itemData.description || !itemData.ownerId) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  
  const newItem = addItem(itemData);
  res.status(201).json(newItem);
});

app.put('/api/items/:id', (req, res) => {
  const updatedItem = updateItem(req.params.id, req.body);
  if (updatedItem) {
    res.json(updatedItem);
  } else {
    res.status(404).json({ error: 'Item not found' });
  }
});

app.delete('/api/items/:id', (req, res) => {
  const deleted = deleteItem(req.params.id);
  if (deleted) {
    res.json({ message: 'Item deleted' });
  } else {
    res.status(404).json({ error: 'Item not found' });
  }
});

app.get('/api/bookings', (req, res) => {
  const { userId } = req.query;
  let bookings;
  
  if (userId) {
    bookings = getBookingsByUser(userId);
  } else {
    bookings = getBookings();
  }
  
  const bookingsWithDetails = bookings.map(booking => ({
    ...booking,
    item: getItemById(booking.itemId),
    borrower: getUserById(booking.borrowerId),
    owner: getUserById(booking.ownerId)
  }));
  
  res.json(bookingsWithDetails);
});

app.get('/api/bookings/:id', (req, res) => {
  const booking = getBookingById(req.params.id);
  if (booking) {
    res.json({
      ...booking,
      item: getItemById(booking.itemId),
      borrower: getUserById(booking.borrowerId),
      owner: getUserById(booking.ownerId)
    });
  } else {
    res.status(404).json({ error: 'Booking not found' });
  }
});

app.post('/api/bookings', (req, res) => {
  const bookingData = req.body;
  const item = getItemById(bookingData.itemId);
  
  if (!item) {
    return res.status(404).json({ error: 'Item not found' });
  }
  
  if (item.ownerId === bookingData.borrowerId) {
    return res.status(400).json({ error: '不能预约自己的物品' });
  }
  
  if (!isTimeSlotAvailable(bookingData.itemId, bookingData.date, bookingData.time)) {
    return res.status(400).json({ error: '该时段已被预约，请选择其他时段' });
  }
  
  const freezeResult = freezeDeposit(bookingData.borrowerId, item.deposit);
  if (!freezeResult.success) {
    return res.status(400).json({ error: freezeResult.message });
  }
  
  const newBooking = addBooking({
    ...bookingData,
    ownerId: item.ownerId,
    itemTitle: item.title,
    itemImage: item.image,
    depositTransactionId: freezeResult.transaction.id,
    depositAmount: item.deposit
  });
  
  res.status(201).json({
    ...newBooking,
    depositTransaction: freezeResult.transaction
  });
});

app.put('/api/bookings/:id', (req, res) => {
  const booking = getBookingById(req.params.id);
  if (!booking) {
    return res.status(404).json({ error: 'Booking not found' });
  }
  
  const updates = req.body;
  const oldStatus = booking.status;
  
  if (updates.status === 'confirmed' && oldStatus === 'pending') {
    updateItem(booking.itemId, { status: 'borrowed' });
    adjustCreditScore(booking.borrowerId, 1, '确认借用成功');
  } else if (updates.status === 'returned' && oldStatus === 'confirmed') {
    updateItem(booking.itemId, { status: 'available' });
    
    if (booking.depositTransactionId) {
      refundDeposit(booking.depositTransactionId);
    }
    
    adjustCreditScore(booking.borrowerId, 2, '按时归还');
    adjustCreditScore(booking.ownerId, 1, '成功出借');
    
    processWaitlist(booking.itemId, booking.date, booking.time);
  } else if (updates.status === 'cancelled') {
    updateItem(booking.itemId, { status: 'available' });
    
    if (booking.depositTransactionId) {
      if (oldStatus === 'confirmed') {
        deductDeposit(booking.depositTransactionId, '违约取消');
        adjustCreditScore(booking.borrowerId, -5, '预约违约取消');
      } else {
        refundDeposit(booking.depositTransactionId);
      }
    }
  }
  
  const updatedBooking = updateBooking(req.params.id, updates);
  res.json(updatedBooking);
});

app.post('/api/waitlist/:itemId', (req, res) => {
  const { userId, preferredDate } = req.body;
  const result = joinWaitlist(req.params.itemId, userId, preferredDate);
  if (result.success) {
    res.status(201).json(result);
  } else {
    res.status(400).json({ error: result.message });
  }
});

app.get('/api/waitlist/:itemId', (req, res) => {
  const waitlist = getWaitlist(req.params.itemId);
  const waitlistWithUsers = waitlist.map(entry => ({
    ...entry,
    user: getUserById(entry.userId)
  }));
  res.json(waitlistWithUsers);
});

app.delete('/api/waitlist/:itemId/:userId', (req, res) => {
  const result = leaveWaitlist(req.params.itemId, req.params.userId);
  if (result.success) {
    res.json(result);
  } else {
    res.status(400).json({ error: result.message });
  }
});

app.get('/api/notifications/:userId', (req, res) => {
  const { unread } = req.query;
  const notifications = getNotifications(req.params.userId, unread === 'true');
  res.json(notifications);
});

app.put('/api/notifications/:id/read', (req, res) => {
  const notification = markNotificationRead(req.params.id);
  if (notification) {
    res.json(notification);
  } else {
    res.status(404).json({ error: 'Notification not found' });
  }
});

app.put('/api/notifications/:userId/read-all', (req, res) => {
  const result = markAllNotificationsRead(req.params.userId);
  res.json(result);
});

app.get('/api/reviews', (req, res) => {
  const { itemId, userId } = req.query;
  let reviews;
  
  if (itemId) {
    reviews = getReviewsByItem(itemId);
  } else if (userId) {
    reviews = getReviewsByUser(userId);
  } else {
    reviews = [];
  }
  
  const reviewsWithDetails = reviews.map(review => ({
    ...review,
    reviewer: getUserById(review.reviewerId),
    target: getUserById(review.targetId)
  }));
  
  res.json(reviewsWithDetails);
});

app.post('/api/reviews', (req, res) => {
  const reviewData = req.body;
  
  if (!reviewData.reviewerId || !reviewData.targetId || !reviewData.rating) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  
  const newReview = addReview(reviewData);
  res.status(201).json(newReview);
});

app.get('/api/credit/level/:score', (req, res) => {
  const score = parseInt(req.params.score);
  res.json(getCreditLevel(score));
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'client', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`========================================`);
  console.log(`邻里物品借用公告板 - 全栈应用 (v2.0)`);
  console.log(`========================================`);
  console.log(`地址: http://localhost:${PORT}`);
  console.log(`新功能:`);
  console.log(`  - 物品押金模拟系统`);
  console.log(`  - 信用分系统`);
  console.log(`  - 排队自动提醒`);
  console.log(`  - 使用教程图文`);
  console.log(`========================================`);
});
