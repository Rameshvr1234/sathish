import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  dashboard: {},
  loading: false,
  error: null,
};

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    // Add reducers as needed
  },
});

export default adminSlice.reducer;
