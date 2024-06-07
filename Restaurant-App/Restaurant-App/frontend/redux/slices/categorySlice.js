import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
  data: [],
};

const categorySlice = createSlice({
  name: "categories",
  initialState,
  extraReducers: (builder) => {
    builder.addCase(fetchCategories.fulfilled, (state, action) => {
      state.data = action.payload;
    });
  },
});

export default categorySlice.reducer;

export const fetchCategories = createAsyncThunk("Category/fetch", async () => {
  const res = await fetch(`http://localhost:5000/api/categories`);
  const res2 = await res.json();
  return res2.categories;
});
