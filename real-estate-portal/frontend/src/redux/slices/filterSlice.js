import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  filters: {},
};

const filterSlice = createSlice({
  name: 'filter',
  initialState,
  reducers: {
    // Add reducers as needed
  },
});

export default filterSlice.reducer;
