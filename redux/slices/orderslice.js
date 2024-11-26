import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    selectedItems: [],
    totalAmount: 0,
};

const orderSlice = createSlice({
    name: 'order',
    initialState,
    reducers: {
        setSelectedItems: (state, action) => {
            const { selectedItems, totalAmount } = action.payload;

            state.selectedItems = Array.isArray(selectedItems) ? selectedItems : [];
            state.totalAmount = totalAmount || 0;
        },
        clearSelectedItems: (state) => {
            state.selectedItems = state.selectedItems.filter(
                (item) => !state.selectedItems.includes(item.product_detail_id)
            );
            state.selectedItems = [];
            state.totalAmount = 0;
        },
    },
});

export const { setSelectedItems, clearSelectedItems } = orderSlice.actions;

export default orderSlice;
