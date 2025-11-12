import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../utils/api'

const initialState = {
  properties: [],
  property: null,
  myProperties: [],
  locations: [],
  loading: false,
  error: null,
  pagination: {
    currentPage: 1,
    totalPages: 1,
    count: 0,
  },
  filters: {
    region: '',
    location: '',
    property_type: '',
    budgetMin: '',
    budgetMax: '',
    sv_verified: false,
    owner_only: false,
  },
}

// Async thunks
export const fetchProperties = createAsyncThunk(
  'property/fetchProperties',
  async (params) => {
    const response = await api.get('/properties', { params })
    return response.data
  }
)

export const fetchProperty = createAsyncThunk(
  'property/fetchProperty',
  async (id) => {
    const response = await api.get(`/properties/${id}`)
    return response.data
  }
)

export const createProperty = createAsyncThunk(
  'property/createProperty',
  async (propertyData) => {
    const response = await api.post('/properties', propertyData)
    return response.data
  }
)

export const fetchMyProperties = createAsyncThunk(
  'property/fetchMyProperties',
  async () => {
    const response = await api.get('/properties/user/my-properties')
    return response.data
  }
)

export const fetchLocationsByRegion = createAsyncThunk(
  'property/fetchLocationsByRegion',
  async (region) => {
    const response = await api.get(`/properties/search/locations/${region}`)
    return response.data
  }
)

export const incrementView = createAsyncThunk(
  'property/incrementView',
  async (id) => {
    const response = await api.post(`/properties/${id}/increment-view`)
    return response.data
  }
)

const propertySlice = createSlice({
  name: 'property',
  initialState,
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload }
    },
    resetFilters: (state) => {
      state.filters = initialState.filters
    },
    clearProperty: (state) => {
      state.property = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Properties
      .addCase(fetchProperties.pending, (state) => {
        state.loading = true
      })
      .addCase(fetchProperties.fulfilled, (state, action) => {
        state.loading = false
        state.properties = action.payload.properties
        state.pagination = {
          currentPage: action.payload.current_page,
          totalPages: action.payload.total_pages,
          count: action.payload.count,
        }
      })
      .addCase(fetchProperties.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message
      })
      // Fetch Single Property
      .addCase(fetchProperty.pending, (state) => {
        state.loading = true
      })
      .addCase(fetchProperty.fulfilled, (state, action) => {
        state.loading = false
        state.property = action.payload.property
      })
      .addCase(fetchProperty.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message
      })
      // Create Property
      .addCase(createProperty.fulfilled, (state) => {
        state.loading = false
      })
      // Fetch My Properties
      .addCase(fetchMyProperties.fulfilled, (state, action) => {
        state.myProperties = action.payload.properties
      })
      // Fetch Locations
      .addCase(fetchLocationsByRegion.fulfilled, (state, action) => {
        state.locations = action.payload.locations
      })
  },
})

export const { setFilters, resetFilters, clearProperty } = propertySlice.actions
export default propertySlice.reducer
