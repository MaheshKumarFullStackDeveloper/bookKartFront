import type { CartItems } from "@/lib/types/type";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import Link from "next/link";
import React from "react";
import Image from "next/image";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";


interface CardItemsProps {
    item: CartItems;
    onRemoveItem: (productId: string) => void;
    onToggleWishlist: (productId: string) => void;
    wishlist: string[];
}

const CartSingleItem: React.FC<CardItemsProps> = ({ item, onRemoveItem, onToggleWishlist, wishlist }) => {


    const books = Array.isArray(item.product) ? item.product : [item.product];

    console.log("items--books-", books);
    return (
        <ScrollArea className="h-[400px] pr-4">

            {books.map((book) => (


                <div key={book?._id} className="flex flex-col items-center justify-between md:flex-row gap-4 py-4 border-b last:border-0 ">
                    <Link href={`/product/${book?._id}`}>
                        <Image src={book?.images[0]} alt={book?.title} width={80} height={100} className="object-contain w-60 md:48 rounded-xl" />
                    </Link>
                    <div className="flex-1">
                        <h3 className="text-lg font-bold">{book?.title}</h3>
                        <div className="mt-1 text-sm text-gray-500">
                            Quantity: {item?.quantity}
                        </div>
                        <div className="mt-1">
                            {book?.price !== 0 ? <span className=" text-sm text-gray-500 line-through mr-2">Rs:{book?.price}</span> : ""}
                            <span className="text-sm font-bold">Rs:{book?.finalPrice}</span>
                            <div className="mt-1 text-sm text-green-500 font-bold">
                                {book?.shippingCharge !== "free" ? `Shipping Charge: ${book?.shippingCharge}` : "Free Shipping"}
                            </div>
                            <div className="mt-2 flex gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => onToggleWishlist(book?._id)}
                                >
                                    <Heart className={`h-4 w-4 ${wishlist.findIndex((wishlistitem: string) => wishlistitem === book?._id) ? "fill-red-500" : ""}  mr-1 `} />
                                    <span className="hidden md:inline ">
                                        {wishlist.findIndex((wishlistitem: string) => wishlistitem === book?._id) ? "Remove from wishlist" : "Add to wishlist"}
                                    </span>
                                </Button>
                                <Button onClick={() => onRemoveItem(book?._id)}>Remove</Button>
                            </div>
                        </div>
                    </div>
                </div>
            ))
            }

        </ScrollArea>)

}

export default CartSingleItem;
