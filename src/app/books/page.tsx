"use client";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { filters } from "@/lib/Constant";
import { Accordion } from "@radix-ui/react-accordion";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { formatDistanceToNow } from "date-fns";
import BookLoader from "@/lib/BookLoader";


import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart } from "lucide-react";
import Pagination from "../components/Pagination";

import { useRouter } from "next/navigation";
import NoData from "../components/NoData";
import { useGetProductsQuery } from "../store/api";
import { BookDetails } from "@/lib/types/type";

function Page() {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCondition, setSelectedCondition] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string[]>([]);
  const [selectedType, setSelectedType] = useState<string[]>([]);
  const [sortOption, setSortOption] = useState("newest");

  const { data: apiResponse = {}, isLoading } = useGetProductsQuery({})
  const searchTerm = new URLSearchParams(window.location.search).get("search") || "";
  console.log("searchTerm", searchTerm)
  const [books, setbooks] = useState<BookDetails[]>([])
  useEffect(() => {
    if (apiResponse.success) {
      setbooks(apiResponse.data)
    }
  })

  console.log("test book API", books);
  const bookPerPage = 6;

  const router = useRouter();
  const toggleFilter = (section: string, item: string) => {
    const updateFilter = (prev: string[]): string[] =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item];


    switch (section) {
      case "condition":
        setSelectedCondition(updateFilter);
        break;
      case "classType":
        setSelectedType(updateFilter);
      case "category":
        setSelectedCategory(updateFilter);
        break;
    }
    setCurrentPage(1);
  };


  const filterBooks = books.filter((book) => {
    const conditionMatch =
      selectedCondition.length === 0 ||
      selectedCondition
        .map((cond) => cond.toLowerCase())
        .includes(book.condition?.toLowerCase());
    const typeMatch =
      selectedType.length === 0 ||
      selectedType
        .map((cond) => cond.toLowerCase())
        .includes(book.classType?.toLowerCase());
    const categoryMatch =
      selectedCategory.length === 0 ||
      selectedCategory
        .map((cond) => cond.toLowerCase())
        .includes(book.category?.toLowerCase());

    const searchMatch =
      searchTerm ?
        book.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.author?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.description?.toLowerCase().includes(searchTerm.toLowerCase()) : true;
    return conditionMatch && typeMatch && categoryMatch && searchMatch;
  });

  const sortedBooks = [...filterBooks].sort((a, b) => {
    switch (sortOption) {
      case "newest":
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      case "oldest":
        return (
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
      case "price-low":
        return a.finalPrice - b.finalPrice;
      case "price-high":
        return b.finalPrice - a.finalPrice;
      default:
        return 0;
    }
  });

  const totalPage = Math.ceil(sortedBooks.length / bookPerPage);
  const paginatedBooks = sortedBooks.slice(
    (currentPage - 1) * bookPerPage,
    currentPage * bookPerPage
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
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

  return (
    <div className="min-h-screen bg-gray-100 ">
      <div className="container mx-auto px-4 py-8  ">
        <nav className="mb-8 flex items-center gap-2 text-sm text-muted-foreground ">
          <Link href="/" className="text-primary hover:underline">
            {""}Home{""}
          </Link>
          <span>/</span>
          <span>Books </span>
        </nav>
        <h1 className="mb-8 text-3xl font-bold mx-auto text-center  ">
          {" "}
          Find form Over 1000 used books Online{" "}
        </h1>
        <div className="grid gap-8 md:grid-cols-[280px_1fr] ">
          <div className="space-y-6">
            <Accordion
              type="multiple"
              className="bg-white p-6 border rounded-lg"
            >
              {Object.entries(filters).map(([Key, values]) => (
                <AccordionItem key={Key} value={Key}>
                  <AccordionTrigger className="text-lg font-semibold text-blue-500 ">
                    {Key.charAt(0).toUpperCase() + Key.slice(1)}
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="mt-2 space-y-2">
                      {values.map((value) => (
                        <div
                          key={value}
                          className="flex items-center space-x-2 "
                        >
                          <Checkbox
                            id={value}
                            checked={
                              Key === "condition"
                                ? selectedCondition.includes(value)
                                : Key === "classType"
                                  ? selectedType.includes(value)
                                  : selectedCategory.includes(value)
                            }
                            onCheckedChange={() => toggleFilter(Key, value)}
                          />
                          <label
                            htmlFor={value}
                            className="text-sm font-medium leading-none"
                          >
                            {" "}
                            {value}
                          </label>
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
          <div className="space-y-6 ">
            {isLoading ? (
              <BookLoader />
            ) : paginatedBooks.length ? (
              <>
                <div className=" flex justify-between ">
                  <div className="mb-8  text-xl font-semibold">
                    Buy Second hand books, used books Online in india
                  </div>
                  <Select value={sortOption} onValueChange={setSortOption}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue
                        defaultValue={sortOption}
                        placeholder="Sort by"
                      >{sortOption}</SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="newst"> Newest First</SelectItem>
                      <SelectItem value="oldest"> Oldest First</SelectItem>
                      <SelectItem value="price-low">
                        {" "}
                        Price Low to High
                      </SelectItem>
                      <SelectItem value="price-high">
                        {" "}
                        Price High to Low
                      </SelectItem>
                    </SelectContent>
                  </Select>{" "}
                </div>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {paginatedBooks.map((book) => (
                    <motion.div key={book._id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }}>

                      <Card key={book._id} className="group relative overflow-hidden rounded-lg transition-shadow duration-300 hover:shadow-2xl bg-white border-0">
                        <CardContent className="p-0">
                          <Link href={`/books/${book._id}`}>
                            <div className="relative ">
                              <Image src={book.images[0]} alt={book.title} width={400} height={300} className="mb-4 h-[250px] w-full object-cover transition-transform duration-300 group-hover:scale-105 rounded-md" />
                              {calculateDiscount(book.price, book.finalPrice) > 0 && (
                                <Badge className="absolute top-1 left-1  rounded-r-lg bg-red-500 px-2 py-1 text-xs font-medium text-white flex flex-col ">{calculateDiscount(book.price, book.finalPrice)}% off</Badge>
                              )}
                            </div>
                            <Button size='icon' variant='ghost'
                              className="absolute right-2 top-3 h-8 w-8 rounded-full bg-white/80 backdrop-blur-sm transition-opacity duration-300 hover:bg-white group-hover:opacity-100 ">
                              <Heart className="h-4 w-4 "></Heart>
                            </Button>
                            <h3 className=" px-4 mb-2 line-clamp-2 text-lg text-orange-500">{book.title}</h3>
                            <p className=" px-4 mb-2 text-sm text-zinc-400">{book.author}</p>
                            <div className="flex px-4  items-center justify-between">
                              <div className="flex items-baseline gap-2">
                                <span className="test-2xl font-bold">${book.finalPrice}</span>
                                {book.price && (
                                  <span className="text-sm text-muted-foreground line-through">${book.price}</span>
                                )}
                              </div>

                            </div>
                            <div className="flex px-4 mt-4 items-center justify-between">

                              <div className="flex justify-between items-center text-xs text-zinc-400 ">
                                <span >{formatDate(book.createdAt)}</span>
                              </div>

                              <div className="flex justify-between items-center text-xs text-zinc-400 ">
                                <span >{book.condition}</span>
                              </div>
                            </div>

                          </Link>
                        </CardContent>
                        <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-orange-500/10 blur-2xl "></div>
                        <div className="absolute -bottom-8 -left-8 h-24 w-24 rounded-full bg-orange-500/10 blur-2xl "></div>
                      </Card>
                    </motion.div>
                  ))}
                </div>
                <Pagination currentPage={currentPage} totalPage={totalPage} onPageChange={handlePageChange} />
              </>
            ) : (
              <div className="my-10 max-w-3xl justify-center mx-auto">
                <NoData
                  imageUrl="/images/no-book.jpg"
                  message="You haven't sold any books yet."
                  discription="Start selling your books to reach potential buyers. List your first book now and make it available to others."
                  onClick={() => router.push("/book-sell")}
                  buttonText="Sell Your First Book"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Page;