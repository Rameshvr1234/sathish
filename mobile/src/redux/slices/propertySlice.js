import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import api from '../../utils/api';

export const fetchProperties = createAsyncThunk(
  'property/fetchProperties',
  async filters => {
    const params = new URLSearchParams();
    Object.keys(filters).forEach(key => {
      if (filters[key]) params.append(key, filters[key]);
    });
    const response = await api.get(`/properties?${params.toString()}`);
    return response.data;
  },
);

export const fetchPropertyById = createAsyncThunk(
  'property/fetchPropertyById',
  async id => {
    const response = await api.get(`/properties/${id}`);
    return response.data.property;
  },
);

export const fetchMyProperties = createAsyncThunk(
  'property/fetchMyProperties',
  async () => {
    const response = await api.get('/properties/my');
    return response.data.properties;
  },
);

export const createProperty = createAsyncThunk(
  'property/createProperty',
  async propertyData => {
    const response = await api.post('/properties', propertyData);
    return response.data.property;
  },
);

export const updateProperty = createAsyncThunk(
  'property/updateProperty',
  async ({id, data}) => {
    const response = await api.put(`/properties/${id}`, data);
    return response.data.property;
  },
);

export const deleteProperty = createAsyncThunk(
  'property/deleteProperty',
  async id => {
    await api.delete(`/properties/${id}`);
    return id;
  },
);

export const fetchRegions = createAsyncThunk('property/fetchRegions', async () => {
  const response = await api.get('/properties/regions');
  return response.data.regions;
});

export const fetchLocationsByRegion = createAsyncThunk(
  'property/fetchLocationsByRegion',
  async region => {
    const response = await api.get(`/properties/locations?region=${region}`);
    return response.data.locations;
  },
);

const propertySlice = createSlice({
  name: 'property',
  initialState: {
    properties: [],
    myProperties: [],
    currentProperty: null,
    regions: [],
    locations: [],
    filters: {
      region: '',
      location: '',
      property_type: '',
      purpose: '',
      budgetMin: '',
      budgetMax: '',
      sv_verified: false,
      owner_only: false,
    },
    loading: false,
    error: null,
    pagination: {
      page: 1,
      limit: 10,
      total: 0,
    },
  },
  reducers: {
    setFilters: (state, action) => {
      state.filters = {...state.filters, ...action.payload};
    },
    resetFilters: state => {
      state.filters = {
        region: '',
        location: '',
        property_type: '',
        purpose: '',
        budgetMin: '',
        budgetMax: '',
        sv_verified: false,
        owner_only: false,
      };
    },
    clearCurrentProperty: state => {
      state.currentProperty = null;
    },
  },
  extraReducers: builder => {
    builder
      // Fetch Properties
      .addCase(fetchProperties.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProperties.fulfilled, (state, action) => {
        state.loading = false;
        state.properties = action.payload.properties;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchProperties.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Fetch Property By ID
      .addCase(fetchPropertyById.fulfilled, (state, action) => {
        state.currentProperty = action.payload;
      })
      // Fetch My Properties
      .addCase(fetchMyProperties.fulfilled, (state, action) => {
        state.myProperties = action.payload;
      })
      // Create Property
      .addCase(createProperty.fulfilled, (state, action) => {
        state.myProperties.unshift(action.payload);
      })
      // Update Property
      .addCase(updateProperty.fulfilled, (state, action) => {
        const index = state.myProperties.findIndex(
          p => p.id === action.payload.id,
        );
        if (index !== -1) {
          state.myProperties[index] = action.payload;
        }
      })
      // Delete Property
      .addCase(deleteProperty.fulfilled, (state, action) => {
        state.myProperties = state.myProperties.filter(
          p => p.id !== action.payload,
        );
      })
      // Fetch Regions
      .addCase(fetchRegions.fulfilled, (state, action) => {
        state.regions = action.payload;
      })
      // Fetch Locations
      .addCase(fetchLocationsByRegion.fulfilled, (state, action) => {
        state.locations = action.payload;
      });
  },
});

export const {setFilters, resetFilters, clearCurrentProperty} =
  propertySlice.actions;
export default propertySlice.reducer;
