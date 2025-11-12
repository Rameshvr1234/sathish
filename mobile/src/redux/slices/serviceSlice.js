import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import api from '../../utils/api';

export const bookSurveyService = createAsyncThunk(
  'service/bookSurvey',
  async serviceData => {
    const response = await api.post('/services/survey', serviceData);
    return response.data.service;
  },
);

export const bookLegalService = createAsyncThunk(
  'service/bookLegal',
  async serviceData => {
    const response = await api.post('/services/legal', serviceData);
    return response.data.service;
  },
);

export const bookConstructionService = createAsyncThunk(
  'service/bookConstruction',
  async serviceData => {
    const response = await api.post('/services/construction', serviceData);
    return response.data.service;
  },
);

export const bookFinanceService = createAsyncThunk(
  'service/bookFinance',
  async serviceData => {
    const response = await api.post('/services/finance', serviceData);
    return response.data.service;
  },
);

export const fetchMyServices = createAsyncThunk(
  'service/fetchMyServices',
  async () => {
    const response = await api.get('/services/my');
    return response.data.services;
  },
);

const serviceSlice = createSlice({
  name: 'service',
  initialState: {
    myServices: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearError: state => {
      state.error = null;
    },
  },
  extraReducers: builder => {
    builder
      // Book Survey
      .addCase(bookSurveyService.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(bookSurveyService.fulfilled, (state, action) => {
        state.loading = false;
        state.myServices.unshift(action.payload);
      })
      .addCase(bookSurveyService.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Book Legal
      .addCase(bookLegalService.fulfilled, (state, action) => {
        state.myServices.unshift(action.payload);
      })
      // Book Construction
      .addCase(bookConstructionService.fulfilled, (state, action) => {
        state.myServices.unshift(action.payload);
      })
      // Book Finance
      .addCase(bookFinanceService.fulfilled, (state, action) => {
        state.myServices.unshift(action.payload);
      })
      // Fetch My Services
      .addCase(fetchMyServices.fulfilled, (state, action) => {
        state.myServices = action.payload;
      });
  },
});

export const {clearError} = serviceSlice.actions;
export default serviceSlice.reducer;
