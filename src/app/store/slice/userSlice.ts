import { UserData } from '@/lib/types/type';
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface UserState {
    user: UserData | null;
    isEmailVerified: boolean;
    isLoginDialogOpen: boolean;
    isLoggedIn: boolean;
}

const initialState: UserState = {
    user: null,
    isEmailVerified: false,
    isLoginDialogOpen: false,
    isLoggedIn: false,

}

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser: (state, action: PayloadAction<UserData | null>) => {
            state.user = action.payload;
        },
        setEmailVerified: (state, action: PayloadAction<boolean>) => {
            state.isEmailVerified = action.payload;
        },
        logout: (state) => {
            state.user = null;
            state.isEmailVerified = false;
            state.isLoggedIn = false;
        },
        toggleLoginDialog: (state) => {
            state.isLoginDialogOpen = !state.isLoginDialogOpen;
            console.log("check isLoginDialogOpen", state.isLoginDialogOpen)
        },
        authStatus: (state) => {
            state.isLoggedIn = !state.isLoggedIn;
        }
    }
})

export const { setUser, setEmailVerified, logout, toggleLoginDialog, authStatus } = userSlice.actions;
export default userSlice.reducer;