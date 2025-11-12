import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import api from '../../utils/api';
import {storage} from '../../utils/storage';

export const login = createAsyncThunk('auth/login', async credentials => {
  const response = await api.post('/auth/login', credentials);
  await storage.setToken(response.data.token);
  await storage.setUser(response.data.user);
  return response.data;
});

export const register = createAsyncThunk('auth/register', async userData => {
  const response = await api.post('/auth/register', userData);
  await storage.setToken(response.data.token);
  await storage.setUser(response.data.user);
  return response.data;
});

export const logout = createAsyncThunk('auth/logout', async () => {
  await storage.clearAll();
});

export const loadUser = createAsyncThunk('auth/loadUser', async () => {
  const response = await api.get('/auth/me');
  await storage.setUser(response.data.user);
  return response.data.user;
});

export const updateProfile = createAsyncThunk(
  'auth/updateProfile',
  async userData => {
    const response = await api.put('/auth/profile', userData);
    await storage.setUser(response.data.user);
    return response.data.user;
  },
);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    token: null,
    isAuthenticated: false,
    loading: false,
    error: null,
  },
  reducers: {
    restoreAuth: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
    },
    clearError: state => {
      state.error = null;
    },
  },
  extraReducers: builder => {
    builder
      // Login
      .addCase(login.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.token = action.payload.token;
        state.user = action.payload.user;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Register
      .addCase(register.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.token = action.payload.token;
        state.user = action.payload.user;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Logout
      .addCase(logout.fulfilled, state => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
      })
      // Load User
      .addCase(loadUser.fulfilled, (state, action) => {
        state.user = action.payload;
      })
      // Update Profile
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.user = action.payload;
      });
  },
});

export const {restoreAuth, clearError} = authSlice.actions;
export default authSlice.reducer;
