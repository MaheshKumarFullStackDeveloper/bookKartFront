import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ChevronLeft, ChevronRight, CreditCard, Shield } from 'lucide-react';
import React from 'react'


interface PriceDetailsProps {
    totalAmount: number;
    totalOrgAmount: number;
    totalDiscount: number;
    itemCount: number;
    totalShippingCharge: number;
    isProcessing: boolean;
    step: string;
    onProceed: () => void;
    onBack: () => void;
}

const PriceDetails: React.FC<PriceDetailsProps> = ({
    totalAmount,
    totalOrgAmount,
    totalDiscount,
    itemCount,
    totalShippingCharge,
    isProcessing,
    step,
    onProceed,
    onBack,
}) => {
    return (
        <>
            <Card className='shadow-lg'>
                <CardHeader>
                    <CardTitle className='text-xl'>Price Details</CardTitle>
                </CardHeader>
                <CardContent className='space-y-4'>
                    <div className='flex justify-between'>
                        <span>Price ({itemCount} Items)</span>
                        <span>Rs:{totalOrgAmount}</span>
                    </div>
                    <div className='flex justify-between'>
                        <span>Discount</span>
                        <span>Rs:{totalDiscount}</span>
                    </div>
                    <div className='flex justify-between'>
                        <span>Shipping Charge</span>
                        <span>{totalShippingCharge === 0 ? 'Free' : `Rs: ${totalShippingCharge}`}</span>
                    </div>
                    <div className='flex justify-between'>
                        <span>Total</span>
                        <span>Rs:{totalAmount}</span>
                    </div>
                </CardContent>
                <CardFooter className='flex flex-col gap-4'>
                    <Button onClick={onProceed} size='lg' disabled={isProcessing} className='w-full bg-blue-500 hover:bg-blue-700 text-white'>
                        {isProcessing ? 'Processing...' : step === 'payment' ? (<><CreditCard className='h-4 w-5 mr-2' /> Continue with Payment</>) : (<><ChevronRight className='h-4 w-4 mr-2' /> {step === 'cart' ? 'Proceed to checkout' : 'Proceed to payment'}</>)}
                    </Button>

                    {step !== 'cart' && (
                        <Button variant='outline' onClick={onBack} size='lg' className='w-full bg-gray-300 hover:bg-gray-400 text-gray-800'>
                            <ChevronLeft className='h-4 w-4 mr-2' /> Back to Cart
                        </Button>
                    )}
                    <div className='flex items-center gap-2 text-sm text-gray-600'>
                        <Shield className='h-4 w-4' />  <span>Safe and Secure Payments</span>

                    </div>

                </CardFooter>
            </Card>
        </>
    )
}

export default PriceDetails