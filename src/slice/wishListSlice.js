import { createSlice } from "@reduxjs/toolkit";

// 從 localStorage 讀取初始值
const initialWishList = localStorage.getItem("wishList")
  ? JSON.parse(localStorage.getItem("wishList"))
  : [];

export const wishListSlice = createSlice({
    name: 'wishList',
    initialState: {
        wishList: Array.isArray(initialWishList) ? initialWishList : [],
    },
    reducers: {
        toggleWishList: (state, action) => {
            // 這邊假設你點愛心時，傳進來的 action.payload 是整個商品物件 (product)
            const product = action.payload; 
            
            if (!product || !product.id) return; // 安全檢查：如果沒傳東西或沒 id 就直接結束

            // 使用安全導航運算子 ?. 
            // 並且相容 item 本身就是 product，或者 item.product 才是 product 的情況
            const index = state.wishList.findIndex(item => {
                const itemId = item?.product?.id || item?.id;
                return itemId === product.id;
            });

            if (index >= 0) {
                // 如果已經有了，代表使用者想取消愛心 -> 從陣列中移除
                state.wishList.splice(index, 1);
            } else {
                // 如果沒有，代表點擊加入 -> 依照你畫面的結構，組合成物件推入陣列
                state.wishList.push({
                    product: product,
                    qty: 1 // 預設數量
                });
            }

            // 同步到 localStorage
            localStorage.setItem('wishList', JSON.stringify(state.wishList));
        },
    },

});

export const {toggleWishList} = wishListSlice.actions;
export default wishListSlice.reducer;