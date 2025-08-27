export interface BookDetails {

    _id: string;
    title: string;
    images: string[];
    subject: string;
    category: string;
    condition: string;
    classType: string;
    price: number;
    quantity: number;
    author: string;
    edition?: string;
    description?: string;
    finalPrice: number;
    shippingCharge: string;
    seller: UserData;
    paymentMode: 'UPI' | 'Bank Account';
    createdAt: Date;
    paymentDetails: {
        upi?: string;
        bankDetails?: {
            accountNumber: string;
            ifscCode: string;
            bankName: string;

        }

    }
}

export interface BookDetail {

    _id: string;
    title: string;
    images: string[];
    subject: string;
    category: string;
    condition: string;
    classType: string;
    price: number;
    quantity: number;
    author: string;
    edition?: string;
    description?: string;
    finalPrice: number;
    shippingCharge: string;
    seller: UserData;
    paymentMode: 'UPI' | 'Bank Account';
    createdAt: Date;
    paymentDetails: {
        upi?: string;
        bankDetails?: {
            accountNumber: string;
            ifscCode: string;
            bankName: string;

        }

    }
}


export interface UserData {
    name: string;
    email: string;
    _id?: string;
    profilePicture?: string;
    phoneNumber?: string;
    addresses: Address[]
}



export interface Address {
    _id?: string;
    addressLine1?: string;
    addressLine2?: string;
    phoneNumber?: string;
    city?: string;
    state?: string;
    pincode?: string;
    country?: string;
    isDefault?: boolean;
}

export interface Product {
    _id: string;
    title: string;
    images: string[];
    price: number;
    finalPrice: number;
    shippingCharge: string;
}

export interface CartItems {
    _id: string;
    product: BookDetail;
    quantity: number;
    price: number;
}
export interface CartItemss {
    _id: string;
    product: BookDetail;
    quantity: number;
    price: number;
}

export type UpdateAddressPayload = {
    addressId?: string | undefined | null;
    phoneNumber?: string | undefined;
    pincode?: string;
    state?: string;
    city?: string;
    addressLine1?: string;
    addressLine2?: string;
    _id?: string | undefined | null;
};
export interface paymentDetails {
    razorpay_payment_id: string;
    razorpay_order_id: string;
    razorpay_signature: string;

}


