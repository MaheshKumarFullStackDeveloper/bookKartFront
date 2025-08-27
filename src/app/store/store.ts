import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query/react";
import storage from 'redux-persist/lib/storage';
import { persistReducer, persistStore, FLUSH, REGISTER, PAUSE, PERSIST, REHYDRATE } from 'redux-persist';
import { api } from "./api";
import userReducer from './slice/userSlice';
import cartReducer from './slice/cartSlice';
import wishlistReducer from './slice/wishlistSlice';
import checkoutReducer from './slice/checkoutSlice';

const userPersistConfig = { key: 'user', storage, whiteList: ['user', 'isLoginDialogOpen', 'isLoggedIn'] }
const cartPersistConfig = { key: 'cart', storage, whiteList: ['items'] }
const wishlistPersistConfig = { key: 'wishlist', storage }
const checkoutPersistConfig = { key: 'checkout', storage, whiteList: ['orderId', 'step', 'shippingAddress', 'paymentMethod', 'paymentDetails'] }

const persistUserReducer = persistReducer(userPersistConfig, userReducer);
const persistCartReducer = persistReducer(cartPersistConfig, cartReducer);
const persistWishlistReducer = persistReducer(wishlistPersistConfig, wishlistReducer);
const persistCheckoutReducer = persistReducer(checkoutPersistConfig, checkoutReducer);

export const store = configureStore({
    reducer: {
        [api.reducerPath]: api.reducer,
        user: persistUserReducer,
        cart: persistCartReducer,
        wishlist: persistWishlistReducer,
        checkout: persistCheckoutReducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: {
            ignoredActions: [FLUSH, REGISTER, PAUSE, PERSIST, REHYDRATE]
        }
    }).concat(api.middleware)
})

setupListeners(store.dispatch);

export const persistor = persistStore(store);

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch