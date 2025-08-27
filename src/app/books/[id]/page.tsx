"use client";
import NoData from "@/app/components/NoData";
import { useAddToCartMutation, useAddToWishlistMutation, useGetProductByIdQuery, useRemoveFromWishlistMutation } from "@/app/store/api";
import { addToCart } from "@/app/store/slice/cartSlice";
import { addToWishlist, removeFromWishlist } from "@/app/store/slice/wishlistSlice";
import { RootState } from "@/app/store/store";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import BookLoader from "@/lib/BookLoader";
import { BookDetails } from "@/lib/types/type";

import { formatDistanceToNow } from "date-fns";
import { CheckCircle2, Heart, Loader2, MapPin, MessageCircle, ShoppingCart, User2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";

function Page() {
  const params = useParams();
  const id = params.id;
  const [selectedImage, setSelectedImage] = useState(0);
  const [isAddTOCart, setIsAddTOCart] = useState(false);
  const router = useRouter();

  const [addToCartMututaion] = useAddToCartMutation();
  const [addToWishlistMutation] = useAddToWishlistMutation();
  const [removeWishlistMutation] = useRemoveFromWishlistMutation();

  const wishlist: string[] = useSelector((state: RootState) => state.wishlist.items)

  const { data: apiResponse = {}, isLoading, isError } = useGetProductByIdQuery(id)

  const [book, setbook] = useState<BookDetails | null>(null)
  useEffect(() => {
    if (apiResponse.success) {
      setbook(apiResponse.data)
    }
  })


  if (isLoading) {
    <BookLoader />
  }
  const dispatch = useDispatch();
  if (!book || isError) {

    return (
      <div className="my-10 max-w-3xl justify-center mx-auto">
        <NoData
          imageUrl="/images/no-book.jpg"
          message="You haven't sold any books yet."
          discription="Start selling your books to reach potential buyers. List your first book now and make it available to others."
          onClick={() => router.push("/book-sell")}
          buttonText="Sell Your First Book"
        />
      </div>
    );
  }

  const handleAddToCart = async () => {
    if (book) {
      setIsAddTOCart(true)
      try {
        const result = await addToCartMututaion({ productId: book?._id, quantity: 1 }).unwrap();
        if (result.success && result.data) {
          dispatch(addToCart(result.data))
          toast.success(result.message || 'Added to cart successfully')
        }
      } catch (error) {
        setIsAddTOCart(false)
        const errMsg =
          (error as { data?: { message?: string } })?.data?.message ||
          'Failed to add to cart';
        toast.error(errMsg);

      } finally {
        setIsAddTOCart(false)
      }
    }
  };
  const handleAddToWishlist = async (productId: string) => {

    try {
      const isWishlist = wishlist.findIndex(item => item === productId)
      if (!isWishlist) {
        const result = await removeWishlistMutation(productId).unwrap();
        if (result.success && result.data) {
          dispatch(removeFromWishlist(productId))
          toast.success(result.message || 'Removed from wishlist successfully')
        }
      } else {
        const result = await addToWishlistMutation(productId).unwrap();
        if (result.success && result.data) {
          dispatch(addToWishlist(productId))
          console.log("wishlist added", result.data.product)
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

  const bookImage = book?.images || [];

  const calculateDiscount = (price: number, finalPrice: number): number => {
    if (price > finalPrice && price > 0) {
      return Math.round(((price - finalPrice) / price) * 100);
    } else {
      return 0;
    }
  };

  const formatDate = (dateString: Date) => {
    const date = new Date(dateString);
    return formatDistanceToNow(date, { addSuffix: true });
  };


  //console.log("wishlist", wishlist)

  if (wishlist.findIndex(item => item === book._id) == -1) {
    console.log("find in wishlist", wishlist)
  } else {
    console.log("not find in wishlist", wishlist)
  }
  return (
    <div className="min-h-screen  bg-gray-100">
      <div className="container mx-auto px-4 py-8 ">
        <nav className="mb-8 flex items-center gap-2 text-sm text-muted-foreground ">
          <Link href="/" className="text-primary hover:underline">
            {""}Home{""}
          </Link>
          <span>/</span>
          <Link href="/books" className="text-primary hover:underline">
            {""}Books{""}
          </Link>
          <span>/</span>
          <span>{book.category}</span>
          <span>/</span>
          <span>{book.title}</span>
        </nav>
        <div className="grid gap-8 md:grid-cols-2 ">
          <div className="space-y-4 ">
            <div className="relative h-[400px] overflow-hidden rounded-lg bg-white shadow-lg border">
              <Image
                src={book.images[selectedImage]}
                alt="main img"
                fill
                className="object-contain"
              />
              {calculateDiscount(book.price, book.finalPrice) > 0 && (
                <Badge className="absolute top-2 left-1  rounded-r-lg bg-red-500 px-2 py-1 text-xs font-medium text-white flex flex-col ">
                  {calculateDiscount(book.price, book.finalPrice)}% off
                </Badge>
              )}
            </div>
            <div className=" flex gap-2 px-1 overflow-hidden ">
              {bookImage.map((images, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`relative flex-shrink-0 h-16 w-16 overflow-auto rounded-lg border transition-all duration-300 ${selectedImage === index
                    ? "ring-2 ring-primary scale-105"
                    : "hover:scale-105"
                    }`}
                >
                  <Image
                    src={images}
                    alt="main img"
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-6 ">
            <div className="flex items-center justify-between ">
              <div className="space-y-2">
                <h1 className="text-2xl font-bold">{book.title}</h1>
                <p className="text-sm text-muted-foreground ">
                  Posted:{formatDate(book.createdAt)}
                </p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline">share</Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleAddToWishlist(book._id)}
                >
                  <Heart className={`h-4 w-4 ${wishlist.findIndex(item => item === book._id) ? "fill-red-500" : ""}  mr-1 `} />
                  <span className="hidden md:inline ">
                    {wishlist.findIndex(item => item === book._id) ? "remove" : "add"}
                  </span>
                </Button>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-baseline gap-2">
                <span className="test-3xl font-bold">${book.finalPrice}</span>{" "}
                {book.price && (
                  <span className="text-lg text-muted-foreground line-through">
                    ${book.price}
                  </span>
                )}
                <Badge className="text-green-600 " variant="secondary">
                  Shipping Availble
                </Badge>
              </div>
              <Button className="w-60 py-6 bg-blue-600 " onClick={handleAddToCart}>
                {isAddTOCart ? (
                  <>
                    <Loader2 className="animate-spin mr-2" size={20} />
                    Adding to cart{" "}
                  </>
                ) : (
                  <>
                    <ShoppingCart className="mr-2 h-5 w-5 " />
                    Buy Now
                  </>
                )}
              </Button>

              <Card className="border-gray-200 shadow-sm">
                <CardHeader>
                  <CardTitle>Book Datilas</CardTitle>
                  <CardContent className="grid mt-4 gap-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="font-medium text-muted-foreground">
                        Subject/Title{" "}
                      </div>
                      <div>{book.subject}</div>

                      <div className="font-medium text-muted-foreground">
                        Course{" "}
                      </div>
                      <div>{book.classType}</div>

                      <div className="font-medium text-muted-foreground">
                        Catagort{" "}
                      </div>
                      <div>{book.category}</div>

                      <div className="font-medium text-muted-foreground">
                        Auther{" "}
                      </div>
                      <div>{book.author}</div>

                      <div className="font-medium text-muted-foreground">
                        Edition{" "}
                      </div>
                      <div>{book.edition}</div>

                      <div className="font-medium text-muted-foreground">
                        Conditon{" "}
                      </div>
                      <div>{book.condition}</div>
                    </div>
                  </CardContent>
                </CardHeader>
              </Card>
            </div>
          </div>
        </div>
        <div className="mt-8 grid gap-8 md:grid-cols-2">
          <Card className=" border-none shadow-md">
            <CardHeader>
              <CardTitle className="text-lg ">Discription</CardTitle>
              <CardContent className="space-y-4">
                <p>{book.description}</p>
                <div className="border-t pt-4">
                  <h3 className="font-medium mb-2">Our Commnuity </h3>
                  <p>
                    Loram imossam dummy text Loram imossam dummy text Loram
                    imossam dummy text Loram imossam dummy text Loram imossam
                    dummy text Loram imossam dummy text{" "}
                  </p>
                </div>
                <div className="flex items-center text-sm text-muted-foreground  gap-4">
                  <div className="">Ad Id: {book._id}</div>
                  <div className="">Posted {formatDate(book.createdAt)}</div>
                </div>
              </CardContent>
            </CardHeader>
          </Card>
          <Card className=" border-none shadow-md">
            <CardHeader>
              <CardTitle className="text-lg ">Sold By</CardTitle>
              <CardContent className="space-y-4">

                <div className="flex items-center justify-between ">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-full bg-blue-200 flex items-center justify-center">
                      <User2 className="h-6 w-6 text-blue-500" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium ">{book.seller.name}</span>
                        <Badge variant='secondary' className="text-green-600">
                          <CheckCircle2 className="h-3 w-3 mr-1" />Verified
                        </Badge>
                      </div>
                      <div className="flex items-center  gap-2 text-sm text-muted-foreground">
                        <MapPin className="w-4 h-4" />
                        {book.seller?.addresses?.[0]?.city ? `${book.seller?.addresses?.[0]?.city}, ${book.seller?.addresses?.[0]?.state} ` : "Not get location"}
                      </div>
                    </div>
                  </div>
                </div>
                {book.seller.phoneNumber && (
                  <div className=" flex items-center text-sm  gap-2">
                    <MessageCircle className="w-6 h-6 text-blue-600" /><span>Contect : {book.seller.phoneNumber}</span>
                  </div>
                )}
              </CardContent>
            </CardHeader>
          </Card>
        </div>

        <section className="mt-16 ">
          <h2 className="mb-8 text-2xl font-bold">How its dose Work?</h2>
          <div className="grid gap-8 md:grid-cols-3">
            {[{
              step: "Step 1",
              title: "Seller posts an Ad",
              description:
                "Seller posts an ad on book kart to sell their used books.",
              image: { src: "/icons/ads.png", alt: "Post Ad" },
            },
            {
              step: "Step 2",
              title: "Buyer Pays Online",
              description:
                "Buyer makes an online payment to book kart to buy those books.",
              image: { src: "/icons/pay_online.png", alt: "Payment" },
            },
            {
              step: "Step 3",
              title: "Seller ships the books",
              description: "Seller then ships the books to the buyer",
              image: { src: "/icons/fast-delivery.png", alt: "Shipping" },
            },].map((item, index) => (
              <Card key={index} className="bg-gradient-to-br from-amber-50 to-amber-100 border-none">
                <CardHeader>
                  <Badge className="w-fit mb-2">{item.step}</Badge>
                  <CardTitle className="text-lg">{item.title}</CardTitle>
                  <CardDescription className="">{item.description}</CardDescription>
                  <CardContent className="grid mt-4 gap-4">
                    <Image src={item.image.src} alt={item.image.alt} width={120} height={120} className="mx-auto" />
                  </CardContent>
                </CardHeader>
              </Card>

            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

export default Page;