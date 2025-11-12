const express = require('express');
const router = express.Router();
const {
  startChat,
  getConversations,
  getMessages,
  sendMessage,
  getUnreadCount
} = require('../controllers/chatController');
const { protect } = require('../middleware/auth');

router.post('/start', protect, startChat);
router.get('/conversations', protect, getConversations);
router.get('/unread-count', protect, getUnreadCount);
router.get('/:chatId/messages', protect, getMessages);
router.post('/:chatId/message', protect, sendMessage);

module.exports = router;
