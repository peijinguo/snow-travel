import { configureStore } from "@reduxjs/toolkit";
import cartReducer from './slice/cartSlice';
import wishListReducer from './slice/wishListSlice';

export const store = configureStore({
    reducer:{
        cart: cartReducer,
        wishList: wishListReducer,
    }
})

export default store;