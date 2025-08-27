import { CartItems } from "@/lib/types/type";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface CartState {
    _id: string;
    user: string;
    items: CartItems[];
    createdAt: string;
    updatedAt: string;

}

const initialState: CartState = {
    _id: "",
    user: "",
    items: [],
    createdAt: "",
    updatedAt: "",
}

const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        setCart: (state, action: PayloadAction<CartState>) => {
            return { ...state, ...action.payload }
        },
        addToCart: (state, action: PayloadAction<CartItems>) => {
            state.items.push(action.payload);
        },
        clearCart: (state) => {
            state.items = [];
            state._id = "";
            state.user = "";
            state.createdAt = "";
            state.updatedAt = "";
        },
    }
})

export const { setCart, addToCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;