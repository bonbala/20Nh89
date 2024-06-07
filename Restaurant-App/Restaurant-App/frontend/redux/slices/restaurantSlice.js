import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
  data: [],

};

const restaurantSlice = createSlice({
  name: "restaurants",
  initialState,
  extraReducers: (builder) => {
    builder.addCase(fetchRestaurants.fulfilled, (state, action) => {
      state.data = action.payload;
    
    });
  },
});

export default restaurantSlice.reducer;

export const fetchRestaurants = createAsyncThunk("Restaurant/fetch", async () => {
  const res = await fetch(`http://localhost:5000/api/restaurants`);
  const res2 = await res.json();
  return res2.restaurants;
});
