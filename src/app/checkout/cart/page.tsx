"use client";

import CartSingleItem from "@/app/components/CartSingleItem";

import { CheakoutAddress } from "@/app/components/CheakoutAddress";
import NoData from "@/app/components/NoData";
import PriceDetails from "@/app/components/PriceDetails";
import { useAddToWishlistMutation, useCreateOrUpdateOrderMutation, useCreatePaymentWithRazorpayMutation, useGetCartQuery, useGetOrderByIdQuery, useRemoveFromCartMutation, useRemoveFromWishlistMutation } from "@/app/store/api";
import { clearCart, setCart } from "@/app/store/slice/cartSlice";
import { resetCheckout, setCheckoutStep, setOrderId } from "@/app/store/slice/checkoutSlice";
import { toggleLoginDialog } from "@/app/store/slice/userSlice";
import { addToWishlist, removeFromWishlist } from "@/app/store/slice/wishlistSlice";
import { RootState } from "@/app/store/store";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import BookLoader from "@/lib/BookLoader";
import { Address } from "@/lib/types/type";
import { ChevronRight, CreditCard, MapPin, ShoppingCart } from "lucide-react";
import { useRouter } from "next/navigation";
import Script from "next/script";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
interface RazorpayResponse {
    razorpay_payment_id: string;
    razorpay_order_id: string;
    razorpay_signature: string;
}

declare global {
    interface Window {
        Razorpay: new (options: object) => {
            open: () => void;
        };
    }
}


const Page = () => {
    const router = useRouter();
    const dispatch = useDispatch();
    const user = useSelector((state: RootState) => state.user.user);
    const { orderId, step } = useSelector((state: RootState) => state.checkout);
    const [showAddressDialog, setShowAddressDialog] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const { data: cartData, isLoading: isCartLoading } = useGetCartQuery(user?._id);
    const [removeCartMutation] = useRemoveFromCartMutation();
    const [addWishlistMutation] = useAddToWishlistMutation();
    const [removeWishlistMutation] = useRemoveFromWishlistMutation();
    const wishlist: string[] = useSelector((state: RootState) => state.wishlist.items)
    const cart = useSelector((state: RootState) => state.cart);
    const [createOrUpdateOrder] = useCreateOrUpdateOrderMutation();
    const { data: orderData } = useGetOrderByIdQuery(orderId || '');
    const [createRazorpayOrder] = useCreatePaymentWithRazorpayMutation();
    const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);



    useEffect(() => {
        if (orderData && orderData?.shippingAddress) {
            setSelectedAddress(orderData.shippingAddress);
        }
    }, [orderData])

    useEffect(() => {
        if (step === 'addresses' && !selectedAddress) {
            setShowAddressDialog(true);
        }
    }, [selectedAddress, orderId])

    useEffect(() => {
        console.log("selectedAddress changed:", selectedAddress);
    }, [selectedAddress]);

    useEffect(() => {
        if (cartData?.success && cartData?.data) {
            dispatch(setCart(cartData));
        }
    }, [cartData])


    const handleRemoveItem = async (productId: string) => {

        try {
            const result = await removeCartMutation(productId).unwrap();
            if (result.success) {
                dispatch(setCart(result.data));
                dispatch(resetCheckout());

                toast.success('Removed from cart successfully');
                setIsProcessing(false);
            }
        } catch (error) {
            const errMsg =
                (error as { data?: { message?: string } })?.data?.message ||
                'Failed to remove from cart';
            toast.error(errMsg);
        }
    }
    const handleAddToWishlist = async (productId: string) => {

        try {
            if (wishlist.some(id => id.toLowerCase() === productId.toLowerCase())) {
                const result = await removeWishlistMutation(productId).unwrap();
                if (result.success && result.data) {
                    dispatch(removeFromWishlist(productId))
                    toast.success(result.message || 'Removed from wishlist successfully')
                }
            } else {
                const result = await addWishlistMutation(productId).unwrap();
                if (result.success && result.data) {
                    dispatch(addToWishlist(productId))
                    toast.success(result.message || 'Added to wishlist successfully')
                }
            }
        } catch (error) {
            const errMsg =
                (error as { data?: { message?: string } })?.data?.message ||
                'Failed to add to wishlist';
            toast.error(errMsg);
        }
    };

    const handleOpenLogin = () => {
        dispatch(toggleLoginDialog());
    };
    if (!user) {
        return (
            <NoData
                message="Please log in to access your cart."
                discription="You need to be logged in to view your cart and checkout."
                buttonText="Login"
                imageUrl="/images/login.jpg"
                onClick={handleOpenLogin}
            />
        );
    }

    if (cart.items.length === 0) {
        return (
            <NoData
                message="Your cart is empty."
                discription="Looks like you haven't added any items yet. 
            Explore our collection and find something you love!"
                buttonText="Browse Books"
                imageUrl="/images/cart.webp"
                onClick={() => router.push('/books')}
            />
        );
    }

    const totalAmount = cart.items.reduce((total, item) => {
        const finalPrice = item.product?.finalPrice || 0;

        const quantity = item.quantity || 0;
        return total + finalPrice * quantity;
    }, 0);


    const totalOrgAmount = cart.items.reduce((total, item) => total + item.product?.price * item.quantity, 0);
    const totalDiscount = totalOrgAmount - totalAmount;
    const totalShippingCharge = cart.items.map(item => item.product?.shippingCharge === 'free' ? 0 : parseFloat(item.product?.shippingCharge) || 0);
    const maximamShippingCharge = Math.max(...totalShippingCharge, 0)
    const finalAmount = totalAmount + maximamShippingCharge;

    const handleProceedToCheckout = async () => {
        if (step === 'cart') {
            try {
                const result = await createOrUpdateOrder({
                    updates: {
                        totalAmount: finalAmount,
                        items: cart.items
                    }
                }).unwrap();

                if (result.success && result.data) {
                    toast.success('Order created successfully');

                    await dispatch(setOrderId(result.data.order._id));


                    dispatch(setCheckoutStep('addresses'));
                }
            } catch (error) {
                const errMsg =
                    (error as { data?: { message?: string } })?.data?.message ||
                    'Your fallback error message';
                toast.error(errMsg);
            }
        } else if (step === 'addresses') {
            if (selectedAddress) {
                dispatch(setCheckoutStep("payment"))
            } else {
                setShowAddressDialog(true);
            }
        } else if (step === 'payment') {

            handlePayment();
        }
    };


    const handleSelectAddress = async (address: Address) => {

        setSelectedAddress(address);
        setShowAddressDialog(false);
        if (orderId) {
            try {
                await createOrUpdateOrder({
                    updates: {
                        shippingAddress: address,
                        orderId: orderId

                    }
                }).unwrap();
                toast.success('Address updated successfully.');

            } catch (error) {
                const errMsg =
                    (error as { data?: { message?: string } })?.data?.message ||
                    'Failed to update order';
                toast.error(errMsg);
            }
        }
    }

    const handlePayment = async () => {
        if (!orderId) {
            toast.error('Please create an order first.');
            return;

        }
        setIsProcessing(true);
        try {

            const result = await createRazorpayOrder({ orderId: orderId }).unwrap();

            if (result.success) {
                toast.success('Payment successful.');
                setIsProcessing(false);
                const razorpayorder = result.data.order;

                const option = {
                    key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
                    amount: razorpayorder.amount,
                    currency: 'INR',
                    name: 'Bookstore',
                    description: 'Test Transaction',
                    order_id: razorpayorder.id,
                    handler: async (response: RazorpayResponse) => {
                        try {
                            //     console.log("response --", response);
                            const result = await createOrUpdateOrder({
                                updates: {
                                    orderId: orderId,
                                    paymentDetails: {
                                        razorpay_payment_id: response.razorpay_payment_id,
                                        razorpay_order_id: response.razorpay_order_id,
                                        razorpay_signature: response.razorpay_signature,
                                    }



                                }
                            }).unwrap();
                            //   console.log("response 3 --", result);
                            if (result.success) {
                                //   console.log("response 4 --", result);
                                toast.success('Payment successful.');
                                setIsProcessing(false);
                                dispatch(clearCart());
                                dispatch(resetCheckout());
                                //  console.log("response 5 --", result);
                                router.push(`/checkout/payment-success?orderid=${orderId}`);
                            } else {
                                toast.error('Payment failed.');
                                setIsProcessing(false);
                            }


                        } catch (error) {
                            console.error("Error in payment handler:", error);
                        }

                    },
                    prefill: {
                        name: orderData?.user?.name,
                        email: orderData?.user?.email,
                        contact: orderData?.user?.phone,
                    },
                    notes: {
                        address: 'Razorpay Corporate Office',
                    },
                    theme: {
                        color: '#3399cc',
                    },

                }
                const razorpay = new window.Razorpay(option);
                razorpay.open();




            } else {
                toast.error('Payment failed.');
                setIsProcessing(false);
            }


        } catch (error) {
            console.error("Error in handlePayment:", error);
            toast.error('Payment failed.');
            setIsProcessing(false);

        }
    }


    if (isCartLoading) {
        return <BookLoader />
    }


    return (<>
        <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />

        <div className="h-auto min-h-screen bg-white">
            <div className="bg-gray-100 py-4 px-6 mb-8 flex items-center" >
                <ShoppingCart className="w-6 h-6 mr-2 text-gray-600 " />
                <span className="text-lg font-semibold text-gray-800">
                    {cart.items.length} {cart.items.length === 1 ? "item" : "items"} {" "} in your cart
                </span>
            </div>

            <div className="container mx-auto px-4 mx-w-6xl">
                <div className="mb-8">
                    <div className="flex justify-center items-center gap-4">
                        <div className="flex items-center gap-2">
                            <div className={`rounded-full p-3 ${step === 'cart' ? 'bg-blue-600 text-gray-200' : 'bg-gray-200 text-gray-600'}  px-2 py-2`}>
                                <ShoppingCart className="w-6 h-6  " />

                            </div>
                            <span className="font-medium hidden md:inline"> Cart</span>
                        </div>
                        <ChevronRight className="h-5 w-5  text-gray-400" />

                        <div className="flex items-center gap-2">
                            <div className={`rounded-full p-3 ${step === 'addresses' ? 'bg-blue-600 text-gray-200' : 'bg-gray-200 text-gray-600'}  px-2 py-2`}>
                                <MapPin className="w-6 h-6  " />

                            </div>
                            <span className="font-medium hidden md:inline"> Address</span>
                        </div>
                        <ChevronRight className="h-5 w-5  text-gray-400" />
                        <div className="flex items-center gap-2">
                            <div className={`rounded-full p-3 ${step === 'payment' ? 'bg-blue-600 text-gray-200' : 'bg-gray-200 text-gray-600'}  px-2 py-2`}>
                                <CreditCard className="w-6 h-6  " />

                            </div>
                            <span className="font-medium hidden md:inline"> Pay</span>
                        </div>
                    </div>
                </div>

                <div className="grid gap-8 lg:grid-cols-3 ">
                    <div className="lg:col-span-2">
                        <Card className='shadow-lg'>
                            <CardHeader>
                                <CardTitle className="text-2xl font-semibold">Order Summary</CardTitle>
                                <CardDescription>Review your items</CardDescription>
                            </CardHeader>
                            <CardContent className="">
                                {cart.items?.length > 0 &&
                                    cart.items.map((cartItem) => (
                                        <CartSingleItem
                                            key={cartItem._id}
                                            item={cartItem}
                                            onRemoveItem={handleRemoveItem}
                                            onToggleWishlist={handleAddToWishlist}
                                            wishlist={wishlist}
                                        />
                                    ))}
                            </CardContent>
                        </Card>
                    </div>
                    <div>


                        <PriceDetails
                            totalAmount={totalAmount}
                            totalOrgAmount={totalOrgAmount}
                            totalDiscount={totalDiscount}
                            itemCount={cart.items.length}
                            isProcessing={isProcessing}
                            totalShippingCharge={maximamShippingCharge}
                            step={step}
                            onProceed={handleProceedToCheckout}
                            onBack={() => dispatch(setCheckoutStep(step === 'addresses' ? 'cart' : 'addresses'))}
                        />
                        {selectedAddress?.addressLine1 && (
                            <Card className='mt-6 mb-6 shadow-lg'>
                                <CardHeader>
                                    <CardTitle className="text-2xl font-semibold">Shipping Address</CardTitle>
                                </CardHeader>
                                <CardContent className="">
                                    <div className='flex flex-col gap-2'>
                                        <div className='flex justify-between'>
                                            <span>State</span>
                                            <span>{selectedAddress.state}</span>

                                        </div>
                                        <div className='flex justify-between'>
                                            <span>Phone</span>
                                            <span>{selectedAddress.phoneNumber}</span>
                                        </div>
                                        <div className='flex justify-between'>
                                            <span>Address</span>
                                            <span>{selectedAddress.addressLine1}</span>
                                            <span>{selectedAddress.addressLine2}</span>

                                        </div>
                                        <div className='flex justify-between'>
                                            <span>City</span>
                                            <span>{selectedAddress.city}</span>
                                        </div>
                                        <Button onClick={() => setShowAddressDialog(true)}>Change Address</Button>

                                    </div>
                                </CardContent>
                            </Card>
                        )}


                        <Dialog open={showAddressDialog} onOpenChange={setShowAddressDialog} >
                            <DialogContent className='w-[600px]'>

                                <DialogHeader>
                                    <DialogTitle>Select Shipping Address</DialogTitle>
                                </DialogHeader>
                                <CheakoutAddress
                                    onAddressSelect={handleSelectAddress}
                                    selectedAddress={selectedAddress?._id}

                                />

                                <DialogFooter>

                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>
            </div>
        </div>
    </>)
}


export default Page;