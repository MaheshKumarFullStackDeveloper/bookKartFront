'use client'
import React from 'react'
import { Provider } from 'react-redux'
import { store,persistor } from './store/store'
import { PersistGate } from 'redux-persist/integration/react'
import AuthCheck from './store/Provider/AuthProvider'
import Bookloader from '@/lib/BookLoader'
import {Toaster} from 'react-hot-toast'
function LayoutWrapper({children}:{children:React.ReactNode}) {
  return (
   <Provider store={store} >
    <PersistGate loading={<Bookloader/>} persistor={persistor}>
    <Toaster/>
    <AuthCheck>
        {children}
        </AuthCheck>
    </PersistGate>
   </Provider>
  )
}

export default LayoutWrapper