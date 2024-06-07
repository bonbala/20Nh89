import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slices/userSlice";
import foodReducer from "./slices/foodSlice";
import restaurantReducer from "./slices/restaurantSlice";
import categoryReducer from "./slices/categorySlice";
export const store = configureStore({
  reducer: {
    user: userReducer,
    food: foodReducer,

    restaurant: restaurantReducer,
    category: categoryReducer,
  },
});
