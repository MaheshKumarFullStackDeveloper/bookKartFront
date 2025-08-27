
import { createSlice, PayloadAction } from "@reduxjs/toolkit";


export interface WishlistState {
    items: string[];
}

const initialState: WishlistState = {
    items: [],
}

const wishlistSlice = createSlice({
    name: "wishlist",
    initialState,
    reducers: {
        setWishlist: (state, action: PayloadAction<string[]>) => {
            state.items = action.payload
        },
        clearWishlist: (state) => {
            state.items = []
        },
        addToWishlist: (state, action: PayloadAction<string>) => {
            const existingItemIndex = state.items.findIndex(item => item === action.payload)
            console.log("wishlist befor added in slice", state.items)
            if (existingItemIndex) {
                console.log("wishlist added in slice", state.items)
                state.items.push(action.payload);
            }
        },
        removeFromWishlist: (state, action: PayloadAction<string>) => {
            state.items = state.items.filter(item => item !== action.payload)

        },
    }
})

export const { setWishlist, addToWishlist, removeFromWishlist, clearWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;