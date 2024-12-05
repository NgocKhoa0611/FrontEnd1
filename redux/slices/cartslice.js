import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    items: {
        cart: {
            cartDetail: [],
        },
    },
};

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addCartDetail: (state, action) => {
            const newItem = action.payload;

            const existingItem = state.items.cart.cartDetail.find(
                (item) => item.product_detail_id === newItem.product_detail_id
            );

            if (existingItem) {
                existingItem.quantity += newItem.quantity;
            } else {
                state.items.cart.cartDetail.push(newItem);
            }
        },
        updateItemQuantity: (state, action) => {
            const { product_detail_id, quantity } = action.payload;
            const existingItem = state.items.find(
                (item) => item.product_detail_id === product_detail_id
            );

            if (existingItem) {
                existingItem.quantity = quantity;
            }
        },
        removeItemFromCart: (state, action) => {
            const productId = action.payload;
            state.items = state.items.filter((item) => item.product_detail_id !== productId);
            // Cập nhật lại cartCount sau khi xóa sản phẩm
            state.cartCount = state.items.reduce((total, item) => total + item.quantity, 0);
        },
        clearCart: (state) => {
            state.items = [];
            state.cartCount = 0;  // Reset cartCount khi giỏ hàng bị xóa
        },
        setCartItems: (state, action) => {
            state.items = action.payload;
        },
    },
});

export const { setCartItems, addCartDetail, updateItemQuantity, removeItemFromCart, clearCart } = cartSlice.actions;

export default cartSlice;
