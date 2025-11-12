const { Chat, Message, User, Property } = require('../models');
const { Op } = require('sequelize');

// @desc    Start a new chat
// @route   POST /api/chat/start
// @access  Private
exports.startChat = async (req, res) => {
  try {
    const { user2_id, property_id } = req.body;
    const user1_id = req.user.id;

    // Check if chat already exists
    let chat = await Chat.findOne({
      where: {
        [Op.or]: [
          { user1_id, user2_id },
          { user1_id: user2_id, user2_id: user1_id }
        ],
        property_id
      }
    });

    if (!chat) {
      // Create new chat
      chat = await Chat.create({
        user1_id,
        user2_id,
        property_id
      });
    }

    // Get full chat details
    const fullChat = await Chat.findByPk(chat.id, {
      include: [
        {
          model: User,
          as: 'user1',
          attributes: ['id', 'name', 'profile_image']
        },
        {
          model: User,
          as: 'user2',
          attributes: ['id', 'name', 'profile_image']
        },
        {
          model: Property,
          as: 'property',
          attributes: ['id', 'title', 'location']
        }
      ]
    });

    res.json({
      success: true,
      chat: fullChat
    });
  } catch (error) {
    console.error('Start chat error:', error);
    res.status(500).json({
      success: false,
      message: 'Error starting chat'
    });
  }
};

// @desc    Get user conversations
// @route   GET /api/chat/conversations
// @access  Private
exports.getConversations = async (req, res) => {
  try {
    const userId = req.user.id;

    const chats = await Chat.findAll({
      where: {
        [Op.or]: [
          { user1_id: userId },
          { user2_id: userId }
        ]
      },
      include: [
        {
          model: User,
          as: 'user1',
          attributes: ['id', 'name', 'profile_image']
        },
        {
          model: User,
          as: 'user2',
          attributes: ['id', 'name', 'profile_image']
        },
        {
          model: Property,
          as: 'property',
          attributes: ['id', 'title', 'location']
        }
      ],
      order: [['last_message_at', 'DESC']]
    });

    res.json({
      success: true,
      chats
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching conversations'
    });
  }
};

// @desc    Get messages in a chat
// @route   GET /api/chat/:chatId/messages
// @access  Private
exports.getMessages = async (req, res) => {
  try {
    const { chatId } = req.params;
    const userId = req.user.id;

    // Verify user is part of chat
    const chat = await Chat.findByPk(chatId);

    if (!chat) {
      return res.status(404).json({
        success: false,
        message: 'Chat not found'
      });
    }

    if (chat.user1_id !== userId && chat.user2_id !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this chat'
      });
    }

    const messages = await Message.findAll({
      where: { chat_id: chatId },
      include: [
        {
          model: User,
          as: 'sender',
          attributes: ['id', 'name', 'profile_image']
        }
      ],
      order: [['created_at', 'ASC']]
    });

    // Mark messages as read
    await Message.update(
      { is_read: true },
      {
        where: {
          chat_id: chatId,
          sender_id: { [Op.ne]: userId },
          is_read: false
        }
      }
    );

    res.json({
      success: true,
      messages
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching messages'
    });
  }
};

// @desc    Send a message
// @route   POST /api/chat/:chatId/message
// @access  Private
exports.sendMessage = async (req, res) => {
  try {
    const { chatId } = req.params;
    const { message } = req.body;
    const userId = req.user.id;

    // Verify chat exists and user is part of it
    const chat = await Chat.findByPk(chatId);

    if (!chat) {
      return res.status(404).json({
        success: false,
        message: 'Chat not found'
      });
    }

    if (chat.user1_id !== userId && chat.user2_id !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized'
      });
    }

    // Create message
    const newMessage = await Message.create({
      chat_id: chatId,
      sender_id: userId,
      message
    });

    // Update chat last message
    await chat.update({
      last_message: message,
      last_message_at: new Date()
    });

    // Get full message with sender info
    const fullMessage = await Message.findByPk(newMessage.id, {
      include: [
        {
          model: User,
          as: 'sender',
          attributes: ['id', 'name', 'profile_image']
        }
      ]
    });

    // Emit socket event (handled in server.js)
    const io = req.app.get('io');
    io.to(`chat_${chatId}`).emit('new-message', fullMessage);

    res.status(201).json({
      success: true,
      message: fullMessage
    });
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({
      success: false,
      message: 'Error sending message'
    });
  }
};

// @desc    Get unread message count
// @route   GET /api/chat/unread-count
// @access  Private
exports.getUnreadCount = async (req, res) => {
  try {
    const userId = req.user.id;

    // Get all chats where user is involved
    const chats = await Chat.findAll({
      where: {
        [Op.or]: [
          { user1_id: userId },
          { user2_id: userId }
        ]
      },
      attributes: ['id']
    });

    const chatIds = chats.map(chat => chat.id);

    const unreadCount = await Message.count({
      where: {
        chat_id: { [Op.in]: chatIds },
        sender_id: { [Op.ne]: userId },
        is_read: false
      }
    });

    res.json({
      success: true,
      unread_count: unreadCount
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching unread count'
    });
  }
};
