"use client";
import { useVerifyEmailMutation } from '@/app/store/api';
import { authStatus, setEmailVerified } from '@/app/store/slice/userSlice';
import { RootState } from '@/app/store/store';

import { useParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from "framer-motion";
import { CheckCircle, Loader2 } from 'lucide-react';

const Page: React.FC = () => {
    const { token } = useParams<{ token: string }>();
    const dispatch = useDispatch();
    const [verifyEmail] = useVerifyEmailMutation();
    const isverifyEmail = useSelector((state: RootState) => state.user.isEmailVerified)
    const [verificationStatus, setVerificationStatus] = useState<"loading" | "success" | "alreadyVerified" | "failed">("loading")

    useEffect(() => {
        const verify = async () => {
            if (isverifyEmail) {
                setVerificationStatus("alreadyVerified")
                return;
            }

            try {
                const result = await verifyEmail(token).unwrap();
                if (result.success) {
                    dispatch(setEmailVerified(true))
                    setVerificationStatus('success')
                    dispatch(authStatus())
                    toast.success('Emial verified successfully')
                    setTimeout(() => { window.location.href = "/" }, 3000)
                } else {
                    throw new Error(result.message || "verification failed")
                }
            } catch (error) {
                console.error(error)
            }
        }

        if (token) {
            verify();
        }
    }, [token, verifyEmail, dispatch, isverifyEmail])

    return (
        <div className='p-20 flex items-center justify-center bg-gradient-to-r from-blue-100 to-purple-100 min-h-screen '>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className='bg-white p-8 rounded-lg shadow-lg text-center max-w-full'>
                {verificationStatus === 'loading' && (<div className='flex flex-col items-center'>
                    <Loader2 className=' h-6 w-16 text-blue-500 animate-spin mb-4' />
                    <h2 className='text-2xl font-semibold text-gray-800 mb-2'>Verifying your email</h2>
                </div>)}
                {verificationStatus === 'success' && (
                    <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200, damping: 10 }} >
                        <CheckCircle className=' h-6 w-16 text-green-500 mx-auto mb-4' />
                        <h2 className='text-2xl font-semibold text-gray-800 mb-2'> Email Verifed</h2>
                    </motion.div>
                )}
                {verificationStatus === 'alreadyVerified' && (<motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200, damping: 10 }}>
                    <CheckCircle className=' h-6 w-16 text-green-500 mx-auto mb-4' />
                    <h2 className='text-2xl font-semibold text-gray-800 mb-2'> Email Already Verifed</h2>
                </motion.div>)}

            </motion.div>
        </div>
    )
}


export default Page
