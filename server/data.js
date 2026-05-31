const { v4: uuidv4 } = require('uuid');

const users = [
  {
    id: 'user-1',
    name: '张小明',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=zhang',
    rating: 4.8,
    reviewCount: 12,
    phone: '138****1234',
    creditScore: 95,
    balance: 500,
    frozenDeposit: 0,
    borrowingHistory: 15,
    lendHistory: 20
  },
  {
    id: 'user-2',
    name: '李华',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=li',
    rating: 4.5,
    reviewCount: 8,
    phone: '139****5678',
    creditScore: 88,
    balance: 350,
    frozenDeposit: 0,
    borrowingHistory: 10,
    lendHistory: 5
  },
  {
    id: 'user-3',
    name: '王芳',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=wang',
    rating: 4.9,
    reviewCount: 15,
    phone: '137****9012',
    creditScore: 98,
    balance: 800,
    frozenDeposit: 0,
    borrowingHistory: 8,
    lendHistory: 25
  }
];

let items = [
  {
    id: 'item-1',
    ownerId: 'user-1',
    title: '家用梯子',
    description: '3米铝合金折叠梯，适合换灯泡、挂窗帘',
    category: '工具',
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=aluminum%20folding%20ladder%203%20meters%20indoor%20home&image_size=square',
    availableSlots: [
      { date: '2026-05-12', times: ['09:00-12:00', '14:00-18:00'] },
      { date: '2026-05-13', times: ['10:00-16:00'] },
      { date: '2026-05-14', times: ['09:00-18:00'] }
    ],
    deposit: 50,
    status: 'available',
    createdAt: '2026-05-10',
    usageCount: 25,
    isPopular: true,
    tutorial: {
      title: '安全使用指南',
      steps: [
        {
          title: '第一步：检查安全锁',
          content: '使用前请确认梯子两侧的安全锁已完全锁止，确保梯子稳定不会折叠。',
          image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=ladder%20safety%20lock%20checking%20diagram&image_size=square'
        },
        {
          title: '第二步：放置位置',
          content: '将梯子放置在平坦、坚实的地面上，避开湿滑区域。梯子与地面夹角约75度最佳。',
          image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=ladder%20proper%20placement%20angle%2075%20degrees&image_size=square'
        },
        {
          title: '第三步：攀爬注意事项',
          content: '攀爬时保持身体重心在梯子中央，不要过度倾斜。最高站在倒数第三级台阶。',
          image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=person%20climbing%20ladder%20safely%20center%20gravity&image_size=square'
        },
        {
          title: '第四步：使用后收纳',
          content: '使用完毕后请清洁梯子表面，确认折叠锁扣完好，放置在干燥通风处。',
          image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=folding%20ladder%20storage%20clean%20dry%20area&image_size=square'
        }
      ],
      warnings: [
        '禁止在梯子上使用工具时过度用力',
        '禁止儿童单独使用',
        '禁止在风力大于5级时户外使用',
        '发现损坏请立即停止使用并通知物主'
      ]
    }
  },
  {
    id: 'item-2',
    ownerId: 'user-2',
    title: '充电式电钻',
    description: '博世18V充电电钻，附带多种钻头',
    category: '工具',
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=bosch%2018V%20cordless%20drill%20with%20bits&image_size=square',
    availableSlots: [
      { date: '2026-05-12', times: ['14:00-18:00'] },
      { date: '2026-05-13', times: ['09:00-18:00'] },
      { date: '2026-05-15', times: ['09:00-12:00'] }
    ],
    deposit: 100,
    status: 'available',
    createdAt: '2026-05-09',
    usageCount: 18,
    isPopular: true,
    tutorial: {
      title: '电钻使用入门',
      steps: [
        {
          title: '第一步：安装钻头',
          content: '按下卡盘锁定按钮，松开卡盘，插入钻头后拧紧。确认钻头安装牢固。',
          image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=drill%20bit%20installation%20chuck%20tightening&image_size=square'
        },
        {
          title: '第二步：选择档位',
          content: '根据材质选择档位：木材用高速档，金属用低速档。拧螺丝请使用扭力调节档。',
          image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=drill%20speed%20torque%20settings%20dial&image_size=square'
        },
        {
          title: '第三步：钻孔技巧',
          content: '开始时轻按开关低速钻孔，定位后再全速推进。注意保持垂直，避免钻头偏移。',
          image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=drilling%20wall%20vertical%20position%20technique&image_size=square'
        },
        {
          title: '第四步：安全保护',
          content: '必须佩戴护目镜，长发请扎起。钻孔时可能产生高温，请勿触碰钻头。',
          image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=safety%20goggles%20workshop%20protection&image_size=square'
        }
      ],
      warnings: [
        '请勿在潮湿环境中使用',
        '更换钻头前必须拆下电池',
        '连续使用不超过30分钟，让电机冷却',
        '电池电量不足时请及时充电'
      ]
    }
  },
  {
    id: 'item-3',
    ownerId: 'user-3',
    title: '儿童帐篷游戏屋',
    description: '室内外儿童游戏帐篷，适合3-8岁孩子',
    category: '玩具',
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=colorful%20kids%20play%20tent%20indoor%20playhouse&image_size=square',
    availableSlots: [
      { date: '2026-05-11', times: ['14:00-20:00'] },
      { date: '2026-05-12', times: ['10:00-20:00'] },
      { date: '2026-05-17', times: ['09:00-20:00'] }
    ],
    deposit: 30,
    status: 'available',
    createdAt: '2026-05-08',
    usageCount: 12,
    isPopular: false,
    tutorial: {
      title: '帐篷搭建与使用',
      steps: [
        {
          title: '第一步：选择场地',
          content: '选择平整、干净的室内或户外场地，远离尖锐物体和火源。',
          image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=kids%20tent%20setup%20area%20clean%20flat&image_size=square'
        },
        {
          title: '第二步：快速搭建',
          content: '取出帐篷，轻轻抛出即可自动弹开。将四角固定在地面。',
          image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=popup%20kids%20tent%20automatic%20opening&image_size=square'
        },
        {
          title: '第三步：使用注意',
          content: '家长全程陪同。不要在帐篷内饮食，避免弄脏布料。',
          image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=children%20playing%20inside%20colorful%20tent%20happy&image_size=square'
        },
        {
          title: '第四步：收纳方法',
          content: '先清洁表面，按折痕折叠，将支架压平，装入收纳袋。',
          image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=folding%20kids%20tent%20storage%20bag&image_size=square'
        }
      ],
      warnings: [
        '不适合3岁以下儿童使用',
        '禁止在帐篷内跳跃',
        '户外使用注意防晒防雨',
        '请在成人监护下使用'
      ]
    }
  },
  {
    id: 'item-4',
    ownerId: 'user-1',
    title: '烧烤架套装',
    description: '便携式不锈钢烧烤架，适合3-5人户外烧烤',
    category: '户外',
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=portable%20stainless%20steel%20bbq%20grill%20set&image_size=square',
    availableSlots: [
      { date: '2026-05-16', times: ['10:00-20:00'] },
      { date: '2026-05-17', times: ['10:00-20:00'] },
      { date: '2026-05-18', times: ['12:00-18:00'] }
    ],
    deposit: 80,
    status: 'available',
    createdAt: '2026-05-07',
    usageCount: 8,
    isPopular: true,
    tutorial: {
      title: '烧烤架使用手册',
      steps: [
        {
          title: '第一步：组装准备',
          content: '检查所有配件是否齐全：炉体、烤网、碳盆、防风板。选择通风良好的户外位置。',
          image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=bbq%20grill%20parts%20assembly%20checklist&image_size=square'
        },
        {
          title: '第二步：生火技巧',
          content: '使用固体酒精块或引燃蜡。等待木炭完全变白（约15-20分钟）再开始烧烤。',
          image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=charcoal%20grill%20lighting%20proper%20method&image_size=square'
        },
        {
          title: '第三步：烧烤操作',
          content: '肉类先高温锁汁，再低温慢烤。勤翻面，避免烤焦。蔬菜快火快烤保持鲜嫩。',
          image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=grilling%20meat%20vegetables%20outdoor%20bbq&image_size=square'
        },
        {
          title: '第四步：清洁收纳',
          content: '待完全冷却后拆卸。用温水+洗洁精清洗烤网。擦干所有部件，存放于干燥处。',
          image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=cleaning%20bbq%20grill%20after%20use&image_size=square'
        }
      ],
      warnings: [
        '必须在通风良好的户外使用',
        '远离易燃物，保持5米安全距离',
        '全程有人看管，儿童请远离',
        '使用后确认火源已完全熄灭'
      ]
    }
  }
];

let bookings = [];
let reviews = [];
let waitlists = {};
let notifications = [];
let depositTransactions = [];

function getUserById(id) {
  return users.find(u => u.id === id);
}

function updateUser(id, updates) {
  const index = users.findIndex(u => u.id === id);
  if (index !== -1) {
    users[index] = { ...users[index], ...updates };
    return users[index];
  }
  return null;
}

function adjustCreditScore(userId, amount, reason) {
  const user = getUserById(userId);
  if (user) {
    const oldScore = user.creditScore;
    user.creditScore = Math.max(0, Math.min(100, user.creditScore + amount));
    return {
      userId,
      oldScore,
      newScore: user.creditScore,
      change: amount,
      reason,
      timestamp: new Date().toISOString()
    };
  }
  return null;
}

function freezeDeposit(userId, amount, bookingId) {
  const user = getUserById(userId);
  if (!user) return { success: false, message: '用户不存在' };
  if (user.balance < amount) return { success: false, message: '余额不足，请先充值' };
  if (user.creditScore < 60) return { success: false, message: '信用分过低，暂时无法借用' };
  
  user.balance -= amount;
  user.frozenDeposit += amount;
  
  const transaction = {
    id: 'txn-' + uuidv4(),
    type: 'freeze',
    userId,
    amount,
    bookingId,
    status: 'frozen',
    createdAt: new Date().toISOString()
  };
  depositTransactions.push(transaction);
  
  return { success: true, transaction };
}

function refundDeposit(transactionId) {
  const transaction = depositTransactions.find(t => t.id === transactionId);
  if (!transaction || transaction.status !== 'frozen') {
    return { success: false, message: '押金记录不存在或已处理' };
  }
  
  const user = getUserById(transaction.userId);
  if (user) {
    user.frozenDeposit -= transaction.amount;
    user.balance += transaction.amount;
    transaction.status = 'refunded';
    transaction.refundedAt = new Date().toISOString();
  }
  
  return { success: true, transaction };
}

function deductDeposit(transactionId, reason) {
  const transaction = depositTransactions.find(t => t.id === transactionId);
  if (!transaction || transaction.status !== 'frozen') {
    return { success: false, message: '押金记录不存在或已处理' };
  }
  
  const user = getUserById(transaction.userId);
  if (user) {
    user.frozenDeposit -= transaction.amount;
    transaction.status = 'deducted';
    transaction.deductionReason = reason;
    transaction.deductedAt = new Date().toISOString();
  }
  
  return { success: true, transaction };
}

function getItems() {
  return items;
}

function getItemById(id) {
  return items.find(i => i.id === id);
}

function addItem(itemData) {
  const newItem = {
    id: 'item-' + uuidv4(),
    ...itemData,
    status: 'available',
    createdAt: new Date().toISOString().split('T')[0],
    usageCount: 0,
    isPopular: false,
    tutorial: itemData.tutorial || {
      title: '基本使用说明',
      steps: [],
      warnings: ['请在使用前咨询物主']
    }
  };
  items.push(newItem);
  return newItem;
}

function updateItem(id, updates) {
  const index = items.findIndex(i => i.id === id);
  if (index !== -1) {
    items[index] = { ...items[index], ...updates };
    return items[index];
  }
  return null;
}

function deleteItem(id) {
  const index = items.findIndex(i => i.id === id);
  if (index !== -1) {
    items.splice(index, 1);
    return true;
  }
  return false;
}

function getBookings() {
  return bookings;
}

function getBookingById(id) {
  return bookings.find(b => b.id === id);
}

function getBookingsByItem(itemId) {
  return bookings.filter(b => b.itemId === itemId);
}

function getBookingsByUser(userId) {
  return bookings.filter(b => b.borrowerId === userId || b.ownerId === userId);
}

function addBooking(bookingData) {
  const newBooking = {
    id: 'booking-' + uuidv4(),
    ...bookingData,
    status: 'pending',
    createdAt: new Date().toISOString()
  };
  bookings.push(newBooking);
  
  const item = getItemById(bookingData.itemId);
  if (item) {
    item.usageCount++;
    if (item.usageCount > 10) {
      item.isPopular = true;
    }
  }
  
  return newBooking;
}

function updateBooking(id, updates) {
  const index = bookings.findIndex(b => b.id === id);
  if (index !== -1) {
    bookings[index] = { ...bookings[index], ...updates };
    return bookings[index];
  }
  return null;
}

function getReviews() {
  return reviews;
}

function getReviewsByItem(itemId) {
  return reviews.filter(r => r.itemId === itemId);
}

function getReviewsByUser(userId) {
  return reviews.filter(r => r.reviewerId === userId || r.targetId === userId);
}

function addReview(reviewData) {
  const newReview = {
    id: 'review-' + uuidv4(),
    ...reviewData,
    createdAt: new Date().toISOString()
  };
  reviews.push(newReview);
  
  const targetUser = users.find(u => u.id === reviewData.targetId);
  if (targetUser) {
    const userReviews = reviews.filter(r => r.targetId === reviewData.targetId);
    const avgRating = userReviews.reduce((sum, r) => sum + r.rating, 0) / userReviews.length;
    targetUser.rating = Math.round(avgRating * 10) / 10;
    targetUser.reviewCount = userReviews.length;
  }
  
  return newReview;
}

function isTimeSlotAvailable(itemId, date, time) {
  const activeBookings = bookings.filter(b => 
    b.itemId === itemId && 
    b.date === date && 
    b.time === time && 
    (b.status === 'pending' || b.status === 'confirmed')
  );
  return activeBookings.length === 0;
}

function getAvailableSlotsForItem(itemId) {
  const item = getItemById(itemId);
  if (!item || !item.availableSlots) return [];
  
  const activeBookings = bookings.filter(b => 
    b.itemId === itemId && 
    (b.status === 'pending' || b.status === 'confirmed')
  );
  
  return item.availableSlots.map(slot => {
    const availableTimes = slot.times.filter(time => {
      const isBooked = activeBookings.some(b => 
        b.date === slot.date && b.time === time
      );
      return !isBooked;
    });
    
    return {
      ...slot,
      times: availableTimes
    };
  }).filter(slot => slot.times.length > 0);
}

function fuzzySearch(text, keyword) {
  if (!keyword) return true;
  if (!text) return false;
  
  const textLower = text.toLowerCase();
  const keywordLower = keyword.toLowerCase();
  
  if (textLower.includes(keywordLower)) return true;
  
  const keywordChars = keywordLower.replace(/\s+/g, '').split('');
  let lastIndex = 0;
  
  for (const char of keywordChars) {
    const index = textLower.indexOf(char, lastIndex);
    if (index === -1) return false;
    lastIndex = index + 1;
  }
  
  return true;
}

function joinWaitlist(itemId, userId, preferredDate) {
  if (!waitlists[itemId]) {
    waitlists[itemId] = [];
  }
  
  const existingEntry = waitlists[itemId].find(e => e.userId === userId);
  if (existingEntry) {
    return { success: false, message: '您已在排队列表中' };
  }
  
  const waitlistEntry = {
    id: 'wait-' + uuidv4(),
    userId,
    itemId,
    preferredDate,
    position: waitlists[itemId].length + 1,
    joinedAt: new Date().toISOString()
  };
  
  waitlists[itemId].push(waitlistEntry);
  
  const item = getItemById(itemId);
  const user = getUserById(userId);
  
  addNotification(userId, {
    type: 'waitlist_joined',
    title: '成功加入排队',
    message: `您已加入"${item.title}"的等待队列，当前排位：${waitlistEntry.position}`,
    itemId,
    itemTitle: item.title,
    position: waitlistEntry.position
  });
  
  return { success: true, entry: waitlistEntry, position: waitlistEntry.position };
}

function getWaitlist(itemId) {
  return waitlists[itemId] || [];
}

function leaveWaitlist(itemId, userId) {
  if (!waitlists[itemId]) return { success: false, message: '排队列表不存在' };
  
  const index = waitlists[itemId].findIndex(e => e.userId === userId);
  if (index === -1) return { success: false, message: '您不在排队列表中' };
  
  const removed = waitlists[itemId].splice(index, 1)[0];
  
  waitlists[itemId].forEach((entry, i) => {
    entry.position = i + 1;
    addNotification(entry.userId, {
      type: 'waitlist_updated',
      title: '排队位置更新',
      message: `您在"${getItemById(itemId)?.title}"队列中的位置更新为：${entry.position}`,
      itemId,
      position: entry.position
    });
  });
  
  return { success: true, removed };
}

function processWaitlist(itemId, date, time) {
  const item = getItemById(itemId);
  if (!item || !waitlists[itemId] || waitlists[itemId].length === 0) {
    return [];
  }
  
  const firstInLine = waitlists[itemId][0];
  const user = getUserById(firstInLine.userId);
  
  const notification = addNotification(firstInLine.userId, {
    type: 'item_available',
    title: '🎉 物品可用提醒',
    message: `您排队的"${item.title}"现在有可用时段了！${date} ${time}`,
    itemId,
    itemTitle: item.title,
    date,
    time,
    isAutoReminder: true
  });
  
  waitlists[itemId].forEach(entry => {
    if (entry.id !== firstInLine.id) {
      addNotification(entry.userId, {
        type: 'waitlist_updated',
        title: '排队位置更新',
        message: `"${item.title}"有新动向，您的当前位置：${entry.position}`,
        itemId,
        position: entry.position
      });
    }
  });
  
  return [notification];
}

function addNotification(userId, notificationData) {
  const notification = {
    id: 'notif-' + uuidv4(),
    userId,
    ...notificationData,
    read: false,
    createdAt: new Date().toISOString()
  };
  notifications.push(notification);
  return notification;
}

function getNotifications(userId, unreadOnly = false) {
  let userNotifications = notifications.filter(n => n.userId === userId);
  if (unreadOnly) {
    userNotifications = userNotifications.filter(n => !n.read);
  }
  return userNotifications.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

function markNotificationRead(notificationId) {
  const notification = notifications.find(n => n.id === notificationId);
  if (notification) {
    notification.read = true;
    return notification;
  }
  return null;
}

function markAllNotificationsRead(userId) {
  notifications.forEach(n => {
    if (n.userId === userId) n.read = true;
  });
  return { success: true };
}

function getPopularItems() {
  return items
    .filter(i => i.isPopular)
    .sort((a, b) => b.usageCount - a.usageCount);
}

function getCreditLevel(score) {
  if (score >= 90) return { level: '优秀', color: '#51cf66', icon: '🌟' };
  if (score >= 75) return { level: '良好', color: '#4dabf7', icon: '✨' };
  if (score >= 60) return { level: '一般', color: '#ffd43b', icon: '⚠️' };
  return { level: '较低', color: '#ff6b6b', icon: '❌' };
}

module.exports = {
  users,
  getUserById,
  updateUser,
  adjustCreditScore,
  freezeDeposit,
  refundDeposit,
  deductDeposit,
  depositTransactions,
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
  getReviews,
  getReviewsByItem,
  getReviewsByUser,
  addReview,
  isTimeSlotAvailable,
  getAvailableSlotsForItem,
  fuzzySearch,
  waitlists,
  joinWaitlist,
  getWaitlist,
  leaveWaitlist,
  processWaitlist,
  notifications,
  addNotification,
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  getPopularItems,
  getCreditLevel
};
