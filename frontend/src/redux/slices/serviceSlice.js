import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../utils/api'

const initialState = {
  bookings: [],
  loading: false,
  error: null,
}

// Async thunks
export const bookSurvey = createAsyncThunk(
  'service/bookSurvey',
  async (bookingData) => {
    const response = await api.post('/services/survey/book', bookingData)
    return response.data
  }
)

export const bookLegal = createAsyncThunk(
  'service/bookLegal',
  async (bookingData) => {
    const response = await api.post('/services/legal/book', bookingData)
    return response.data
  }
)

export const bookConstruction = createAsyncThunk(
  'service/bookConstruction',
  async (bookingData) => {
    const response = await api.post('/services/construction/book', bookingData)
    return response.data
  }
)

export const submitFinanceEnquiry = createAsyncThunk(
  'service/submitFinanceEnquiry',
  async (enquiryData) => {
    const response = await api.post('/services/finance/enquiry', enquiryData)
    return response.data
  }
)

export const calculateEMI = createAsyncThunk(
  'service/calculateEMI',
  async (data) => {
    const response = await api.post('/services/finance/calculate-emi', data)
    return response.data
  }
)

export const fetchMyBookings = createAsyncThunk(
  'service/fetchMyBookings',
  async () => {
    const response = await api.get('/services/my-bookings')
    return response.data
  }
)

const serviceSlice = createSlice({
  name: 'service',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch My Bookings
      .addCase(fetchMyBookings.pending, (state) => {
        state.loading = true
      })
      .addCase(fetchMyBookings.fulfilled, (state, action) => {
        state.loading = false
        state.bookings = action.payload.bookings
      })
      .addCase(fetchMyBookings.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message
      })
  },
})

export default serviceSlice.reducer
