import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../utils/api'

const initialState = {
  conversations: [],
  currentChat: null,
  messages: [],
  loading: false,
  error: null,
}

// Async thunks
export const fetchConversations = createAsyncThunk(
  'chat/fetchConversations',
  async () => {
    const response = await api.get('/chat/conversations')
    return response.data
  }
)

export const fetchMessages = createAsyncThunk(
  'chat/fetchMessages',
  async (chatId) => {
    const response = await api.get(`/chat/${chatId}/messages`)
    return response.data
  }
)

export const sendMessage = createAsyncThunk(
  'chat/sendMessage',
  async ({ chatId, message }) => {
    const response = await api.post(`/chat/${chatId}/message`, { message })
    return response.data
  }
)

export const startChat = createAsyncThunk(
  'chat/startChat',
  async ({ user2_id, property_id }) => {
    const response = await api.post('/chat/start', { user2_id, property_id })
    return response.data
  }
)

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    addMessage: (state, action) => {
      state.messages.push(action.payload)
    },
    setCurrentChat: (state, action) => {
      state.currentChat = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Conversations
      .addCase(fetchConversations.fulfilled, (state, action) => {
        state.conversations = action.payload.chats
      })
      // Fetch Messages
      .addCase(fetchMessages.pending, (state) => {
        state.loading = true
      })
      .addCase(fetchMessages.fulfilled, (state, action) => {
        state.loading = false
        state.messages = action.payload.messages
      })
      // Send Message
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.messages.push(action.payload.message)
      })
      // Start Chat
      .addCase(startChat.fulfilled, (state, action) => {
        state.currentChat = action.payload.chat
      })
  },
})

export const { addMessage, setCurrentChat } = chatSlice.actions
export default chatSlice.reducer
