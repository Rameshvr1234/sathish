import React, {useEffect, useState, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import {
  fetchConversations,
  fetchMessages,
  sendMessage,
  setCurrentChat,
  addMessage,
} from '../../redux/slices/chatSlice';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Card from '../../components/common/Card';
import Loading from '../../components/common/Loading';
import io from 'socket.io-client';
import {API_CONFIG} from '../../config/api.config';

const ChatScreen = ({route}) => {
  const {chatId} = route?.params || {};
  const dispatch = useDispatch();
  const {conversations, messages, currentChat, loading} = useSelector(
    state => state.chat,
  );
  const {user} = useSelector(state => state.auth);

  const [messageText, setMessageText] = useState('');
  const [socket, setSocket] = useState(null);
  const flatListRef = useRef(null);

  // Initialize socket connection
  useEffect(() => {
    const newSocket = io(API_CONFIG.baseURL.replace('/api', ''));
    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  // Load conversations
  useEffect(() => {
    dispatch(fetchConversations());
  }, [dispatch]);

  // Load messages when chat is selected
  useEffect(() => {
    if (chatId) {
      dispatch(fetchMessages(chatId));
      const chat = conversations.find(c => c.id === chatId);
      if (chat) {
        dispatch(setCurrentChat(chat));
      }
    }
  }, [chatId, dispatch, conversations]);

  // Socket.io listeners
  useEffect(() => {
    if (socket && currentChat) {
      // Join chat room
      socket.emit('join-chat', currentChat.id);

      // Listen for new messages
      socket.on('new-message', message => {
        dispatch(addMessage(message));
      });

      return () => {
        socket.off('new-message');
        socket.emit('leave-chat', currentChat.id);
      };
    }
  }, [socket, currentChat, dispatch]);

  const handleSendMessage = () => {
    if (!messageText.trim() || !currentChat) return;

    dispatch(
      sendMessage({
        chatId: currentChat.id,
        message: messageText.trim(),
      }),
    );

    // Emit to socket
    if (socket) {
      socket.emit('send-message', {
        chat_id: currentChat.id,
        message: messageText.trim(),
      });
    }

    setMessageText('');
  };

  const renderConversation = ({item}) => {
    const otherUser = item.participants?.find(p => p.id !== user?.id);
    const lastMessage = item.last_message;

    return (
      <TouchableOpacity
        style={styles.conversationCard}
        onPress={() => {
          dispatch(setCurrentChat(item));
          dispatch(fetchMessages(item.id));
        }}>
        <View style={styles.avatar}>
          <Icon name="account" size={32} color="#1890ff" />
        </View>
        <View style={styles.conversationContent}>
          <View style={styles.conversationHeader}>
            <Text style={styles.conversationName}>
              {otherUser?.name || 'Unknown User'}
            </Text>
            <Text style={styles.conversationTime}>
              {lastMessage
                ? new Date(lastMessage.created_at).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })
                : ''}
            </Text>
          </View>
          <Text style={styles.lastMessage} numberOfLines={1}>
            {lastMessage?.message || 'No messages yet'}
          </Text>
          {item.property && (
            <Text style={styles.propertyTag} numberOfLines={1}>
              <Icon name="home" size={12} /> {item.property.title}
            </Text>
          )}
        </View>
        {item.unread_count > 0 && (
          <View style={styles.unreadBadge}>
            <Text style={styles.unreadText}>{item.unread_count}</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  const renderMessage = ({item}) => {
    const isMyMessage = item.sender_id === user?.id;

    return (
      <View
        style={[
          styles.messageContainer,
          isMyMessage ? styles.myMessageContainer : styles.theirMessageContainer,
        ]}>
        <View
          style={[
            styles.messageBubble,
            isMyMessage ? styles.myMessage : styles.theirMessage,
          ]}>
          <Text
            style={[
              styles.messageText,
              isMyMessage ? styles.myMessageText : styles.theirMessageText,
            ]}>
            {item.message}
          </Text>
          <Text
            style={[
              styles.messageTime,
              isMyMessage ? styles.myMessageTime : styles.theirMessageTime,
            ]}>
            {new Date(item.created_at).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </Text>
        </View>
      </View>
    );
  };

  // Conversations list view
  if (!currentChat) {
    if (loading) {
      return <Loading message="Loading conversations..." />;
    }

    return (
      <View style={styles.container}>
        <FlatList
          data={conversations}
          renderItem={renderConversation}
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={styles.conversationsList}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Icon name="chat-outline" size={64} color="#d9d9d9" />
              <Text style={styles.emptyText}>No conversations yet</Text>
              <Text style={styles.emptySubtext}>
                Start a conversation by contacting a property owner
              </Text>
            </View>
          }
        />
      </View>
    );
  }

  // Chat messages view
  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={90}>
      {/* Chat Header */}
      <View style={styles.chatHeader}>
        <TouchableOpacity
          onPress={() => dispatch(setCurrentChat(null))}
          style={styles.backButton}>
          <Icon name="arrow-left" size={24} color="#1890ff" />
        </TouchableOpacity>
        <View style={styles.avatar}>
          <Icon name="account" size={32} color="#1890ff" />
        </View>
        <View style={styles.chatHeaderContent}>
          <Text style={styles.chatHeaderName}>
            {currentChat.participants?.find(p => p.id !== user?.id)?.name ||
              'Unknown User'}
          </Text>
          {currentChat.property && (
            <Text style={styles.chatHeaderProperty} numberOfLines={1}>
              {currentChat.property.title}
            </Text>
          )}
        </View>
      </View>

      {/* Messages List */}
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item, index) => item.id?.toString() || index.toString()}
        contentContainerStyle={styles.messagesList}
        inverted={false}
        onContentSizeChange={() =>
          flatListRef.current?.scrollToEnd({animated: true})
        }
        ListEmptyComponent={
          <View style={styles.emptyMessagesContainer}>
            <Icon name="chat" size={48} color="#d9d9d9" />
            <Text style={styles.emptyMessagesText}>
              Start the conversation
            </Text>
          </View>
        }
      />

      {/* Message Input */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={messageText}
          onChangeText={setMessageText}
          placeholder="Type a message..."
          placeholderTextColor="#bfbfbf"
          multiline
          maxLength={500}
        />
        <TouchableOpacity
          style={[
            styles.sendButton,
            !messageText.trim() && styles.sendButtonDisabled,
          ]}
          onPress={handleSendMessage}
          disabled={!messageText.trim()}>
          <Icon
            name="send"
            size={24}
            color={messageText.trim() ? '#1890ff' : '#d9d9d9'}
          />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  conversationsList: {
    padding: 8,
  },
  conversationCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 12,
    marginBottom: 8,
    borderRadius: 12,
    alignItems: 'center',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#e6f7ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  conversationContent: {
    flex: 1,
  },
  conversationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  conversationName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#262626',
  },
  conversationTime: {
    fontSize: 12,
    color: '#8c8c8c',
  },
  lastMessage: {
    fontSize: 14,
    color: '#595959',
    marginBottom: 4,
  },
  propertyTag: {
    fontSize: 12,
    color: '#1890ff',
  },
  unreadBadge: {
    backgroundColor: '#ff4d4f',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
  },
  unreadText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  chatHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  backButton: {
    marginRight: 8,
  },
  chatHeaderContent: {
    flex: 1,
  },
  chatHeaderName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#262626',
  },
  chatHeaderProperty: {
    fontSize: 12,
    color: '#8c8c8c',
  },
  messagesList: {
    padding: 16,
  },
  messageContainer: {
    marginBottom: 12,
  },
  myMessageContainer: {
    alignItems: 'flex-end',
  },
  theirMessageContainer: {
    alignItems: 'flex-start',
  },
  messageBubble: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 16,
  },
  myMessage: {
    backgroundColor: '#1890ff',
    borderBottomRightRadius: 4,
  },
  theirMessage: {
    backgroundColor: '#fff',
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 15,
    marginBottom: 4,
  },
  myMessageText: {
    color: '#fff',
  },
  theirMessageText: {
    color: '#262626',
  },
  messageTime: {
    fontSize: 11,
  },
  myMessageTime: {
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'right',
  },
  theirMessageTime: {
    color: '#8c8c8c',
  },
  inputContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    alignItems: 'flex-end',
  },
  input: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 15,
    maxHeight: 100,
    marginRight: 8,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#595959',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#8c8c8c',
    marginTop: 8,
    textAlign: 'center',
    paddingHorizontal: 40,
  },
  emptyMessagesContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyMessagesText: {
    fontSize: 14,
    color: '#8c8c8c',
    marginTop: 12,
  },
});

export default ChatScreen;
