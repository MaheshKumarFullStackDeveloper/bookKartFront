"use client";
import Link from "next/link";
import React, { useState } from "react";
import { useAddProductMutation } from "../store/api";

import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store/store";
import { Controller, useForm } from "react-hook-form";
import { BookDetails } from "@/lib/types/type";
import toast from "react-hot-toast";
import { toggleLoginDialog } from "../store/slice/userSlice";
import NoData from "../components/NoData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Book, Camera, DollarSign, HelpCircle, Loader2, X } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { filters } from "@/lib/Constant";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";

function Page() {
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [addProducts] = useAddProductMutation();

  const dispatch = useDispatch();

  const user = useSelector((state: RootState) => state?.user?.user);
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    watch,
    control,
    setValue,
    reset,
    formState: { errors },
  } = useForm<BookDetails>({
    defaultValues: {
      images: [],
    },
  });

  const onSubmit = async (data: BookDetails) => {
    setIsLoading(true);
    console.log("starting form submiting setp 1");
    try {
      const formData = new FormData();
      console.log("starting form submiting setp 2", formData);
      Object.entries(data).forEach(([key, value]) => {
        if (key !== "images") {
          formData.append(key, value as string);
        }
      });

      if (data.paymentMode === "UPI") {
        formData.set(
          "paymentDetails",
          JSON.stringify({ upiId: data.paymentDetails.upi })
        );
      } else if (data.paymentMode === "Bank Account") {
        formData.set(
          "paymentDetails",
          JSON.stringify({ bankDetails: data.paymentDetails.bankDetails })
        );
      }

      if (Array.isArray(data.images) && data.images.length > 0) {
        data.images.forEach((image) => formData.append("images", image));
      }
      const result = await addProducts(formData).unwrap();

      if (result.success) {
        toast.success("Product Added successfully ");
        reset();
        setIsLoading(true);
      }
    } catch (error) {
      console.log("Faild to upload Product", error);
      toast.error("Faild to upload Product");
    } finally {
      console.log("starting form submiting setp 3");
      setIsLoading(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const newFiles = Array.from(files);
      const currentFiles = watch("images") || [];

      setUploadedImages((prevImage) =>
        [
          ...prevImage,
          ...newFiles.map((file) => URL.createObjectURL(file)),
        ].slice(0, 4)
      );
      setValue(
        "images",
        [...currentFiles, ...newFiles].slice(0, 4) as string[]
      );
    }
  };

  const removeImage = (index: number) => {
    setUploadedImages((prev) => prev.filter((_, i) => i !== index));
    const currentFiles = watch("images") || [];
    const uploadFiles = currentFiles.filter((_, i) => i !== index);
    setValue("images", uploadFiles);
  };

  const paymentMode = watch("paymentMode");
  const handleOpenLogin = () => {
    dispatch(toggleLoginDialog());
  };

  if (!user) {
    return (
      <NoData
        message="Please log in to access your cart."
        discription=" Please log in to sell your books."

        buttonText="Login"
        imageUrl="/images/login.jpg"
        onClick={handleOpenLogin}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12 ">
      <div className="container mx-auto px-4 py-1  ">
        <nav className="mb-8 flex items-center gap-2 text-sm text-muted-foreground ">
          <Link href="/" className="text-primary hover:underline">
            {""}Home{""}
          </Link>
          <span>/ Book Sell</span>
        </nav>
      </div>
      <div className="container mx-auto px-4 py-8  ">
        <div className="mb-10 text-center  ">
          <h1 className="text-4xl font-bold text-blue-500">Sell used books</h1>
          <p className="text-xl text-gray-600 mb-4">
            Sell your used booksfor cash
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          <Card className="shadow-lg border-t-4 py-0 border-t-blue-500">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
              <CardTitle className="text-2xl py-6 text-blue-700 flex items-center">
                <Book className="mr-2 h-6 w-6"></Book>Book Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 py-6 ">
              <div className="flex flex-col md:flex-row md:items-center text-center space-y-2 md:space-y-0 md:space-x-4">
                <Label className="md:w-1/4 font-medium text-gray-700">
                  {" "}
                  Ad Title
                </Label>
                <div className="md:w-3/4">
                  <Input
                    {...register("title", {
                      required: "Title is required",
                    })}
                    placeholder="Title"
                    type="text"
                    className="pl-10"
                  />

                  {errors.title && (
                    <p className="text-red-700 text-sm">
                      {errors.title.message}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
                <Label className="md:w-1/4 font-medium text-gray-700">
                  Ad Subject
                </Label>
                <div className="md:w-3/4">
                  <Input
                    {...register("subject", {
                      required: "Subject is required",
                    })}
                    placeholder="Subject"
                    type="text"
                    className="pl-10"
                  />

                  {errors.subject && (
                    <p className="text-red-700 text-sm">
                      {errors.subject.message}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
                <Label className="md:w-1/4 font-medium text-gray-700">
                  {" "}
                  Ad Book types
                </Label>
                <div className="md:w-3/4">
                  <Controller
                    name="category"
                    control={control}
                    rules={{ required: "Book types is Required " }}
                    render={({ field }) => (
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Please select book type" />
                        </SelectTrigger>
                        <SelectContent>
                          {filters.category.map((category) => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  ></Controller>

                  {errors.category && (
                    <p className="text-red-700 text-sm">
                      {errors.category.message}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
                <Label className="md:w-1/4 font-medium text-gray-700">
                  {" "}
                  BOok Condition
                </Label>
                <div className="md:w-3/4">
                  <Controller
                    name="condition"
                    control={control}
                    rules={{ required: "Book types is Required " }}
                    render={({ field }) => (
                      <RadioGroup
                        onValueChange={field.onChange}
                        value={field.value}
                        className="flex space-x-4"
                      >
                        {filters.condition.map((con) => (
                          <div
                            key={con}
                            className="flex items-center space-x-2"
                          >
                            <RadioGroupItem
                              value={con.toLowerCase()}
                              id={con.toLowerCase()}
                            />{" "}
                            <Label
                              className="md:w-1/4 font-medium text-gray-700"
                              htmlFor={con.toLowerCase()}
                            >
                              {con}
                            </Label>
                          </div>
                        ))}
                      </RadioGroup>
                    )}
                  ></Controller>

                  {errors.condition && (
                    <p className="text-red-700 text-sm">
                      {errors.condition.message}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
                <Label className="md:w-1/4 font-medium text-gray-700">
                  {" "}
                  For Class
                </Label>
                <div className="md:w-3/4">
                  <Controller
                    name="classType"
                    control={control}
                    rules={{ required: "class types is Required " }}
                    render={({ field }) => (
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Please select class type" />
                        </SelectTrigger>
                        <SelectContent>
                          {filters.classType.map((classt) => (
                            <SelectItem key={classt} value={classt}>
                              {classt}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  ></Controller>

                  {errors.classType && (
                    <p className="text-red-700 text-sm">
                      {errors.classType.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label className="block mb-2 font-medium text-gray-700">
                  Upload Photo
                </Label>
                <div className="border-2 border-dashed border-blue-300 rounded-lg p-4 bg-blue-50">
                  <div className="flex flex-col items-center gap-2">
                    <Camera className="h-8 w-8 text-blue-500" />
                    <Label
                      htmlFor="Images"
                      className="cursor-pointer hover:underline block mb-2 font-medium text-gray-700"
                    >
                      click here to upload max 4 photo
                    </Label>
                    <Input
                      id="Images"
                      type="file"
                      className="hidden"
                      onChange={handleImageUpload}
                      accept="images/"
                      multiple
                    />
                  </div>
                  {uploadedImages && uploadedImages.length > 0 && (
                    <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                      {uploadedImages.map((image, index) => (
                        <div key={index} className="relative">
                          <Image
                            src={image}
                            alt={`BOok image ${index + 1}`}
                            width={200}
                            height={200}
                            className="rounded-lg object-cover w-full h-32 border border-gray-200"
                          />
                          <Button
                            onClick={() => removeImage(index)}
                            size="icon"
                            className="absolute -right-2 -top-2 "
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-t-4 py-0 border-t-green-500">
            <CardHeader className="bg-gradient-to-r from-green-50 to-green-50">
              <CardTitle className="text-2xl py-6 text-green-700 flex items-center">
                <HelpCircle className="mr-2 h-6 w-6"></HelpCircle>Optional
                Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 py-6 ">
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger>Book Information</AccordionTrigger>
                  <AccordionContent>
                    <div className="flex flex-col md:flex-row md:items-center  my-2 text-center space-y-2 md:space-y-0 md:space-x-4">
                      <Label
                        htmlFor="price"
                        className="md:w-1/4 font-medium text-gray-700"
                      >
                        MRP
                      </Label>
                      <div className="md:w-3/4">
                        <Input
                          {...register("price", {
                            required: "Price is required",
                          })}
                          placeholder="Price"
                          type="text"
                          className="pl-10"
                        />

                        {errors.price && (
                          <p className="text-red-700 text-sm">
                            {errors.price.message}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col md:flex-row md:items-center  my-2 text-center space-y-2 md:space-y-0 md:space-x-4">
                      <Label
                        htmlFor="author"
                        className="md:w-1/4 font-medium text-gray-700"
                      >
                        Author
                      </Label>
                      <div className="md:w-3/4">
                        <Input
                          {...register("author", {
                            required: "Author is required",
                          })}
                          placeholder="Author"
                          type="text"
                          className="pl-10"
                        />

                        {errors.author && (
                          <p className="text-red-700 text-sm">
                            {errors.author.message}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col md:flex-row md:items-center text-center my-2 space-y-2 md:space-y-0 md:space-x-4">
                      <Label
                        htmlFor="edition"
                        className="md:w-1/4 font-medium text-gray-700"
                      >
                        Edition
                      </Label>
                      <div className="md:w-3/4">
                        <Input
                          {...register("edition", {
                            required: "Edition is required",
                          })}
                          placeholder="Edition"
                          type="text"
                          className="pl-10"
                        />

                        {errors.edition && (
                          <p className="text-red-700 text-sm">
                            {errors.edition.message}
                          </p>
                        )}
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger>Ad Description</AccordionTrigger>
                  <AccordionContent>
                    <div className="flex flex-col md:flex-row md:items-center  my-2 text-center space-y-2 md:space-y-0 md:space-x-4">
                      <Label
                        htmlFor="description"
                        className="md:w-1/4 font-medium text-gray-700"
                      >
                        Description
                      </Label>
                      <div className="md:w-3/4">
                        <Textarea
                          {...register("description", {
                            required: "Description is required",
                          })}
                          placeholder="Description"
                          className="pl-10"
                        />

                        {errors.description && (
                          <p className="text-red-700 text-sm">
                            {errors.description.message}
                          </p>
                        )}
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-t-4 py-0 border-t-yellow-500">
            <CardHeader className="bg-gradient-to-r from-yellow-50 to-yellow-50">
              <CardTitle className="text-2xl py-6 text-yellow-700 flex items-center">
                <DollarSign className="mr-2 h-6 w-6"></DollarSign>Price Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 py-6 ">
              <div className="flex flex-col md:flex-row md:items-center  my-2 text-center space-y-2 md:space-y-0 md:space-x-4">
                <Label
                  htmlFor="finalPrice"
                  className="md:w-1/4 font-medium text-gray-700"
                >
                  Your Price
                </Label>
                <div className="md:w-3/4">
                  <Input
                    {...register("finalPrice", {
                      required: "Final Price is required",
                    })}
                    placeholder="Final Price"
                    className="pl-10"
                  />

                  {errors.finalPrice && (
                    <p className="text-red-700 text-sm">
                      {errors.finalPrice.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex flex-col md:flex-row md:items-center  my-2 text-center space-y-2 md:space-y-0 md:space-x-4">
                <Label
                  htmlFor="finalPrice"
                  className="md:w-1/4 font-medium text-gray-700"
                >
                  Shipping Charges
                </Label>
                <div className="md:w-3/4">
                  <div className="flex items-center gap-4">
                    <Input
                      {...register("shippingCharge", {
                        required: "Shipping Charge Price is required",
                      })}
                      placeholder="Shipping Charge Price"
                      className="pl-10"
                      disabled={watch('shippingCharge') === 'free'}
                    />
                    <span> Or</span>
                    <Controller
                      name="shippingCharge"
                      control={control}
                      rules={{ required: "book types is Required " }}
                      render={({ field }) => (
                        <Checkbox
                          id="freeShipping"
                          checked={field.value == "free"}
                          onCheckedChange={(checked) => { field.onChange(checked ? 'free' : '') }}
                        />
                      )}
                    ></Controller>
                    <Label
                      htmlFor="freeShipping" className="font-medium text-black-700"
                    > Free Shipping </Label>
                  </div>
                  {errors.shippingCharge && (
                    <p className="text-red-700 text-sm">
                      {errors.shippingCharge.message}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-t-4 py-0 border-t-yellow-600">
            <CardHeader className="bg-gradient-to-r from-yellow-50 to-yellow-50">
              <CardTitle className="text-2xl py-6 text-yellow-700 flex items-center">
                <Book className="mr-2 h-6 w-6"></Book>Bank Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 py-6 ">


              <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
                <Label className="md:w-1/4 font-medium text-gray-700">
                  {" "}
                  Payment Mode
                </Label>
                <div className=" space-y-2 md:w-3/4">
                  <p>After your book sell. receive payment</p>
                  <Controller
                    name="paymentMode"
                    control={control}
                    rules={{ required: "Payment Mode is Required " }}
                    render={({ field }) => (
                      <RadioGroup onValueChange={field.onChange} value={field.value} className="flex space-x-4">
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="UPI" id="UPI" {...register('paymentMode')} />
                          <Label htmlFor="UPI" >UPI ID/Number</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="Bank Account" id="bank account" {...register('paymentMode')} />
                          <Label htmlFor="bank account" >Bank Account Number</Label>
                        </div>
                      </RadioGroup>
                    )}
                  ></Controller>

                  {errors.paymentMode && (
                    <p className="text-red-700 text-sm">
                      {errors.paymentMode.message}
                    </p>
                  )}
                </div>
              </div>

              {paymentMode === "UPI" && (
                <div className="flex flex-col md:flex-row md:items-center text-center space-y-2 md:space-y-0 md:space-x-4">
                  <Label className="md:w-1/4 font-medium text-gray-700">
                    {" "}
                    UPI ID
                  </Label>
                  <div className="md:w-3/4">
                    <Input
                      {...register("paymentDetails.upi", {
                        required: "UPI ID is required",
                      })}
                      placeholder="UPI ID"
                      type="text"
                      className="pl-10"
                    />

                    {errors.paymentDetails?.upi && (
                      <p className="text-red-700 text-sm">
                        {errors.paymentDetails.upi.message}
                      </p>
                    )}
                  </div>
                </div>
              )}
              {paymentMode === "Bank Account" && (
                <>
                  <div className="flex flex-col md:flex-row md:items-center text-center space-y-2 md:space-y-0 md:space-x-4">
                    <Label className="md:w-1/4 font-medium text-gray-700">
                      {" "}
                      Bank Account Number
                    </Label>
                    <div className="md:w-3/4">
                      <Input
                        {...register("paymentDetails.bankDetails.accountNumber", {
                          required: "Account Number is required",
                        })}
                        placeholder="Account Number"
                        type="text"
                        className="pl-10"
                      />

                      {errors.paymentDetails?.bankDetails?.accountNumber && (
                        <p className="text-red-700 text-sm">
                          {errors.paymentDetails.bankDetails.accountNumber.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col md:flex-row md:items-center text-center space-y-2 md:space-y-0 md:space-x-4">
                    <Label className="md:w-1/4 font-medium text-gray-700">
                      {" "}
                      ifscCode
                    </Label>
                    <div className="md:w-3/4">
                      <Input
                        {...register("paymentDetails.bankDetails.ifscCode", {
                          required: "Ifsc Code Number is required",
                        })}
                        placeholder="Ifsc Code Number"
                        type="text"
                        className="pl-10"
                      />

                      {errors.paymentDetails?.bankDetails?.ifscCode && (
                        <p className="text-red-700 text-sm">
                          {errors.paymentDetails.bankDetails.ifscCode.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col md:flex-row md:items-center text-center space-y-2 md:space-y-0 md:space-x-4">
                    <Label className="md:w-1/4 font-medium text-gray-700">
                      {" "}
                      Bank Name
                    </Label>
                    <div className="md:w-3/4">
                      <Input
                        {...register("paymentDetails.bankDetails.bankName", {
                          required: "Bank Name is required",
                        })}
                        placeholder="Bank Name"
                        type="text"
                        className="pl-10"
                      />

                      {errors.paymentDetails?.bankDetails?.bankName && (
                        <p className="text-red-700 text-sm">
                          {errors.paymentDetails.bankDetails.bankName.message}
                        </p>
                      )}
                    </div>
                  </div>

                </>

              )}



            </CardContent>
          </Card>

          <Button type="submit" disabled={isLoading} className="">
            {isLoading ? (
              <>
                <Loader2 className="animation-spin mr-2" size={20} />
                Saving.....
              </>
            ) : (
              'Post your Book'
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}

export default Page;
