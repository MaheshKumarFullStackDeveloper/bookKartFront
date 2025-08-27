import { Clock, Facebook, HeadphonesIcon, Instagram, Shield, Twitter, Youtube } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

function Footer() {
  return (
    <footer className="bg-gray-900  px-12 text-gray-300">
      <div className="container mx-auto px-2 py-2 ">
        <div className="grid grid-cols-4 mx-auto gap-12 md:grid-col-4  align-middle ">
          <div>
            <h3 className="mb-4 text-lg font-semibold text-white"> About Us</h3>
            <ul className="space-y-2 ">
              <li>
                <Link
                  href="/about-us"
                  className="hover:text-white cursor-pointer "
                >
                  About us
                </Link>
              </li>
              <li>
                <Link
                  href="/contect-us"
                  className="hover:text-white cursor-pointer "
                >
                  Contect us
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="mb-4 text-lg font-semibold text-white">
              {" "}
              Usefull Links
            </h3>
            <ul className="space-y-2 ">
              <li>
                <Link
                  href="/how-its-works"
                  className="hover:text-white cursor-pointer "
                >
                  How its works
                </Link>
              </li>
              <li>
                <Link
                  href="/blogs"
                  className="hover:text-white cursor-pointer "
                >
                  Blogs{" "}
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="mb-4 text-lg font-semibold text-white"> Policies</h3>
            <ul className="space-y-2 ">
              <li>
                <Link
                  href="/turms-of-user"
                  className="hover:text-white cursor-pointer "
                >
                  Turms of User
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy-policy"
                  className="hover:text-white cursor-pointer "
                >
                  Privacy Policy{" "}
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="mb-4 text-lg font-semibold text-white">
              {" "}
              Sty Connted
            </h3>
            <div className="mb-4 flex space-x-4  ">
              <Link href="#" className="hover:text-white">
                <Facebook className="w-5 h-5"></Facebook>
              </Link>
              <Link href="#" className="hover:text-white">
                <Instagram className="w-5 h-5"></Instagram>
              </Link>
              <Link href="#" className="hover:text-white">
                <Youtube className="w-5 h-5"></Youtube>
              </Link>
              <Link href="#" className="hover:text-white">
                <Twitter className="w-5 h-5"></Twitter>
              </Link>
            </div>
            <p className="text-sm">
              BookKart is a free platform where you can buy second hand books
              at very cheap prices. Buy used books online like college books,
              school books, much more near you
            </p>
          </div>
        </div>
        <section className="py-6 ">
          <div className="container mx-auto px-4">
            <div className="grid gap-8 md:grid-cols-3">
              <div className="flex items-center gap-4 rounded-xl p-6 shadow-sm ">
                <div className="rounded-full  p-3">
                  <Shield className="h-6 w-6"></Shield>
                </div>
                <div ><h3 className="font-semibold ">Secure payment </h3>
                <p className="text-sm text-gray-300">100% secure online payment</p></div>
              </div>
              <div className="flex items-center gap-4 rounded-xl p-6 shadow-sm ">
                <div className="rounded-full  p-3">
                  <Clock className="h-6 w-6"></Clock>
                </div>
                <div ><h3 className="font-semibold ">Book Card trust </h3>
                <p className="text-sm text-gray-300">Mony Trasfor saf</p></div>
              </div>
              <div className="flex items-center gap-4 rounded-xl p-6 shadow-sm ">
                <div className="rounded-full  p-3">
                  <HeadphonesIcon className="h-6 w-6"></HeadphonesIcon>
                </div>
                <div ><h3 className="font-semibold ">Custmer support </h3>
                <p className="text-sm text-gray-300">24 hours support</p></div>
              </div>
            </div>
          </div>
        </section>
        <div className="mt-12 border-t border-gray-700 pt-8 flex flex-col md:flex-row gap-4 md:gap-0 justify-between items-center">
          <p className="tect-sm text-gray-400">&copy; {new Date().getFullYear()} BookCart. All right recived</p>
          <div className="flex items-center space-x-4">
            <Image src='/icons/visa.svg' alt="visa" height={30} width={50} className="filter brightness-20 invert" />
            <Image src='/icons/rupay.svg' alt="visa" height={30} width={50} className="filter brightness-20 invert" />
            <Image src='/icons/upi.svg' alt="visa" height={30} width={50} className="filter brightness-20 invert" />
            <Image src='/icons/paytm.svg' alt="visa" height={30} width={50} className="filter brightness-20 invert" />
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
