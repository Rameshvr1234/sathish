import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import api from '../../utils/api';

export const fetchConversations = createAsyncThunk(
  'chat/fetchConversations',
  async () => {
    const response = await api.get('/chat/conversations');
    return response.data.conversations;
  },
);

export const fetchMessages = createAsyncThunk(
  'chat/fetchMessages',
  async chatId => {
    const response = await api.get(`/chat/${chatId}/messages`);
    return response.data.messages;
  },
);

export const sendMessage = createAsyncThunk(
  'chat/sendMessage',
  async ({chatId, message}) => {
    const response = await api.post('/chat/message', {
      chat_id: chatId,
      message,
    });
    return response.data.message;
  },
);

const chatSlice = createSlice({
  name: 'chat',
  initialState: {
    conversations: [],
    currentChat: null,
    messages: [],
    loading: false,
    error: null,
  },
  reducers: {
    setCurrentChat: (state, action) => {
      state.currentChat = action.payload;
    },
    addMessage: (state, action) => {
      state.messages.push(action.payload);
    },
    clearMessages: state => {
      state.messages = [];
    },
  },
  extraReducers: builder => {
    builder
      // Fetch Conversations
      .addCase(fetchConversations.fulfilled, (state, action) => {
        state.conversations = action.payload;
      })
      // Fetch Messages
      .addCase(fetchMessages.pending, state => {
        state.loading = true;
      })
      .addCase(fetchMessages.fulfilled, (state, action) => {
        state.loading = false;
        state.messages = action.payload;
      })
      // Send Message
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.messages.push(action.payload);
      });
  },
});

export const {setCurrentChat, addMessage, clearMessages} = chatSlice.actions;
export default chatSlice.reducer;
