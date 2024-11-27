import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    items: [],
    cartCount: 0,
};

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addItemToCart: (state, action) => {
            const newItem = action.payload;
            const existingItem = state.items.find(
                (item) => item.product_detail_id === newItem.product_detail_id
            );

            if (existingItem) {
                existingItem.quantity += newItem.quantity;
            } else {
                state.items.push({
                    product_detail_id: newItem.product_detail_id,
                    product_name: newItem.product_name,
                    img_url: newItem.img_url || "",
                    size: newItem.size,
                    color: newItem.color,
                    price: newItem.price,
                    quantity: newItem.quantity,
                });
            }
            state.cartCount = state.items.reduce((total, item) => total + item.quantity, 0);
        },
        updateItemQuantity: (state, action) => {
            const { product_detail_id, quantity } = action.payload;
            const existingItem = state.items.find(
                (item) => item.product_detail_id === product_detail_id
            );

            if (existingItem) {
                existingItem.quantity = quantity;
            }
            state.cartCount = state.items.reduce((total, item) => total + item.quantity, 0);
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
        CartCount: (state, action) => {
            state.cartCount = action.payload;
        },
        SetCartItems: (state, action) => {
            state.items = action.payload;
            state.cartCount = state.items.reduce((total, item) => total + item.quantity, 0); // Recalculate cartCount
        },
    },
});

export const { SetCartItems, addItemToCart, updateItemQuantity, removeItemFromCart, clearCart, CartCount } = cartSlice.actions;

export default cartSlice;
