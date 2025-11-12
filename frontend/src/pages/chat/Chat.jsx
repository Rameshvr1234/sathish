import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Card, List, Input, Button, Avatar } from 'antd'
import { UserOutlined, SendOutlined } from '@ant-design/icons'
import { fetchConversations, fetchMessages, sendMessage } from '../../redux/slices/chatSlice'

const Chat = () => {
  const dispatch = useDispatch()
  const { conversations, messages, currentChat } = useSelector((state) => state.chat)
  const { user } = useSelector((state) => state.auth)
  const [messageText, setMessageText] = useState('')

  useEffect(() => {
    dispatch(fetchConversations())
  }, [dispatch])

  const handleChatSelect = (chat) => {
    dispatch(fetchMessages(chat.id))
  }

  const handleSendMessage = () => {
    if (messageText.trim() && currentChat) {
      dispatch(sendMessage({
        chatId: currentChat.id,
        message: messageText
      }))
      setMessageText('')
    }
  }

  return (
    <div className="container" style={{ padding: '40px 20px' }}>
      <div className="chat-container">
        <div className="chat-sidebar">
          <Card title="Conversations">
            <List
              dataSource={conversations}
              renderItem={(chat) => (
                <List.Item onClick={() => handleChatSelect(chat)} style={{ cursor: 'pointer' }}>
                  <List.Item.Meta
                    avatar={<Avatar icon={<UserOutlined />} />}
                    title={chat.property?.title}
                    description={chat.last_message}
                  />
                </List.Item>
              )}
            />
          </Card>
        </div>

        <div className="chat-main">
          <div className="chat-messages">
            {messages.map((msg) => (
              <div
                key={msg.id}
                style={{
                  marginBottom: '16px',
                  textAlign: msg.sender_id === user?.id ? 'right' : 'left'
                }}
              >
                <div
                  style={{
                    display: 'inline-block',
                    background: msg.sender_id === user?.id ? '#1890ff' : '#f0f0f0',
                    color: msg.sender_id === user?.id ? 'white' : 'black',
                    padding: '10px 16px',
                    borderRadius: '8px',
                    maxWidth: '70%'
                  }}
                >
                  {msg.message}
                </div>
              </div>
            ))}
          </div>

          <div className="chat-input">
            <Input.Group compact style={{ display: 'flex' }}>
              <Input
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                onPressEnter={handleSendMessage}
                placeholder="Type a message..."
                style={{ flex: 1 }}
              />
              <Button type="primary" icon={<SendOutlined />} onClick={handleSendMessage}>
                Send
              </Button>
            </Input.Group>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Chat
