'use client'

import { useGetOrderByIdQuery } from '@/app/store/api';
import { useSearchParams } from 'next/navigation';
import React, { useEffect } from 'react'
import confetti from 'canvas-confetti';
import BookLoader from '@/lib/BookLoader';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';
const Page = () => {

    const searchParams = useSearchParams();
    const orderid = searchParams.get('orderid');
    const { data: orderData, isLoading } = useGetOrderByIdQuery(orderid || '');

    useEffect(() => {
        console.log("orderId on paypage", orderid);
        confetti({
            particleCount: 200,
            spread: 140,
            origin: { y: 0.6 },
        })

    }, [orderid]);


    if (isLoading) {
        return <BookLoader />;
    }

    if (!orderid || !orderData) {
        return null;
    } else {
        console.log("orderData", orderData);
    }
    const { totalAmount, items, status, createdAt } = orderData.data.order;
    return (
        <div className='min-h-screen bg-gradient-to-br from-purple-500 to-pink-500 to-red-500 text-white flex flex-col items-center justify-center p-4'>
            <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.5 }} className='w-full max-w-4xl'>
                <Card className='bg-white'>
                    <CardHeader className='text-center border-b border-gray-200 pb-4'>
                        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: 'spring', stiffness: 500 }} className='w-full max-w-4xl'>
                            <CheckCircle className='text-green-500 w-12 h-12' />
                        </motion.div>
                        <CardTitle className='text-3xl font-bold text-green-700'>Payment Successful</CardTitle>
                        <CardDescription className='text-lg text-gray-700'>Thank you for your order!</CardDescription>
                    </CardHeader>
                    <CardContent className='p-6 '>
                        <div className='grid md:grid-cols-2 gap-4'>
                            <div className='space-y-2'>
                                <h3 className='font-semibold text-lg text-gray-700'>Order Details</h3>
                                <p className='text-sm text-gray-600'>Order ID: {orderid}</p>
                                <p className='text-sm text-gray-600'>Total Amount: {totalAmount}</p>
                                <p className='text-sm text-gray-600'>Status: {status}</p>
                                <p className='text-sm text-gray-600'>Created At: {createdAt}</p>

                            </div>
                        </div>
                        <h2>Items:</h2>
                        <ul>
                            {items && items.length > 0 ? (
                                items.map((item: { product: { id: number; title: string; price: number; }; quantity: number; }) => (
                                    <li key={item.product.id}>{item.product.title} - {item.product.price} x {item.quantity}</li>
                                ))
                            ) : (
                                <li>No items found</li>
                            )}
                        </ul>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    )
}

export default Page;