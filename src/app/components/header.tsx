"use client";
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { DropdownMenuContent } from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { DropdownMenu, DropdownMenuTrigger } from '@radix-ui/react-dropdown-menu'
import { BookLock, ChevronRight, FileTerminal, HeartIcon, HelpCircle, Lock, Menu, Package, PiggyBank, SearchIcon, ShoppingCart, User, User2 } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { logout, toggleLoginDialog } from '../store/slice/userSlice';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import AuthPage from './AuthPage';
import { useGetCartQuery, useLogOutMutation } from '../store/api';
import toast from 'react-hot-toast';
import { setCart } from '../store/slice/cartSlice';




export default function Header() {

  const router = useRouter();
  const dispatch = useDispatch();
  const isLoginOpen = useSelector((state: RootState) => state.user.isLoginDialogOpen);

  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [searchTerms, setSearchTerms] = useState("")
  const handlesearchTerms = () => {
    router.push(`/books?search=${encodeURIComponent(searchTerms)}`)
  }


  const [logOutMutation] = useLogOutMutation();
  const user = useSelector((state: RootState) => state?.user?.user);
  const cartCount = useSelector((state: RootState) => state?.cart.items.length);

  const { data: cartData } = useGetCartQuery(user?._id, { skip: !user });

  useEffect(() => {
    if (cartData?.success && cartData?.data) {
      console.log("cart data", cartData)
      dispatch(setCart(cartData.data));
    }
  }, [cartData, dispatch]);
  const userPlaceholder = user?.name?.split(" ").map((name: string) => name[0]).join("");
  console.log("check user 1", user);
  const handleLoginClick = () => {
    dispatch(toggleLoginDialog())
    console.log("chech login click");
    setIsDropdownOpen(false)
  }
  const handleLogout = async () => {
    try {
      await logOutMutation({}).unwrap();
      dispatch(logout());
      toast.success('user logout Successfully');
      setIsDropdownOpen(false);
    } catch (error) {
      toast.error("Failed to logout");
      console.error("Logout error:", error);
    }
  }

  const handleProtectionNavigation = (href: string) => {
    if (user) {
      router.push(href)
      setIsDropdownOpen(false)
    } else {
      dispatch(toggleLoginDialog())
      setIsDropdownOpen(false)
    }
  }
  const menuItems = [
    ...(user && user ? [
      {
        href: "/account/profile",
        content: (
          <div className='flex space-x-4 items-center p-2 border-b'>
            <Avatar className='w-12 h-12 -ml-2 rounded-full'>
              {user?.profilePicture ? (
                <AvatarImage alt='user-img'></AvatarImage>
              ) : (
                <AvatarFallback>{userPlaceholder}</AvatarFallback>
              )}
            </Avatar>
            <div className='flex flex-col  '>
              <span className='font-semibold text-md'>{user.name}</span>
              <span className='font-semibold text-xs text-gray-500'>{user.email}</span>
            </div>
          </div>
        )
      }
    ] : [
      {
        icon: <Lock className='h-5 w-5' />,
        lable: "Login/Signup",
        onclick: handleLoginClick

      }
    ]),

    {
      icon: <User className='h-5 w-5' />,
      lable: "My Profile",
      onclick: () => handleProtectionNavigation('/account/profile'),

    },
    {
      icon: <Package className='h-5 w-5' />,
      lable: "My Order",
      onclick: () => handleProtectionNavigation('/account/orders'),

    },
    {
      icon: <PiggyBank className='h-5 w-5' />,
      lable: "My Selling Orders",
      onclick: () => handleProtectionNavigation('/account/selling-products'),
    },
    {
      icon: <ShoppingCart className='h-5 w-5' />,
      lable: "Cart",
      onclick: () => handleProtectionNavigation('/checkout/cart'),
    },
    {
      icon: <HeartIcon className='h-5 w-5' />,
      lable: "My Wishlist",
      onclick: () => handleProtectionNavigation('/account/wishlists'),
    },
    {
      icon: <User2 className='h-5 w-5' />,
      lable: "About Us",
      herf: '/about-us'
    },
    {
      icon: <FileTerminal className='h-5 w-5' />,
      lable: "Terms & Use",
      herf: '/terms-of-use'
    },
    {
      icon: <BookLock className='h-5 w-5' />,
      lable: "Privacy Policy",
      herf: '/privacy-policy'
    },
    {
      icon: <User2 className='h-5 w-5' />,
      lable: "Help",
      herf: '/how-it-work'

    },
    ...(user && user ? [{
      icon: <HelpCircle className='h-5 w-5' />,
      lable: "Logout",
      onclick: handleLogout


    }] : [])

  ]

  const MenuItems = ({ className = "" }) => (
    <div className={className}>
      {menuItems?.map((item, index) =>

        item?.href ? (
          <Link href={item.href} key={index} className='flex items-center gap-3 px-4 py-4 text-sm  rounded-lg hover:bg-gray-300 ' onClick={() => setIsDropdownOpen(false)}>
            {item.icon}
            <span>{item?.lable}</span>
            {item?.content && <div className='mt-1'>{item.content}</div>}
            <ChevronRight className='w-4 h-4 ml-auto' />
          </Link>
        ) : (
          <button key={index} className='flex w-full items-center gap-3 px-4 py-4 text-sm  rounded-lg hover:bg-gray-300 ' onClick={item.onclick}>
            {item.icon}
            <span>{item?.lable}</span>

            <ChevronRight className='w-4 h-4 ml-auto' />
          </button>
        )
      )

      }
    </div>
  );

  return (
    <header className='border-b bg-white sticky top-0 z-50 '>
      <div className='container w-[80%] mx-auto hidden lg:flex items-center justify-between p-4 '>
        <Link href='/' className='flex items-center'><Image src="/images/web-logo.png" width={250} height={60} alt='web'></Image></Link>
        <div className='flex flex-1 items-center justify-center  max-w-xl px-4'>
          <div className='relative w-full '>
            <Input type='text' className='w-full pr-10' placeholder='Search books' value={searchTerms} onChange={(e) => setSearchTerms(e.target.value)} />
            <Button size='icon' variant='ghost' onClick={handlesearchTerms} className='absolute right-0 top-1/2 -translate-y-1/2 ' >
              <SearchIcon className='h-5 w-5' />
            </Button>
          </div>
        </div>
        <div className='flex items-center gap-4'>

          <Button onClick={() => handleProtectionNavigation('/book-sell')} variant='secondary' className='bg-yellow-400 text-gray-900 hover:bg-yellow-300'>Sell Used Book</Button>

          <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
            <DropdownMenuTrigger asChild>
              <Button variant='ghost' >
                <Avatar className='w-8 h-8 rounded-full'>
                  {user?.profilePicture ? (
                    <AvatarImage alt='user-img'></AvatarImage>
                  ) : userPlaceholder ? (
                    <AvatarFallback>{userPlaceholder}</AvatarFallback>
                  ) : (
                    <User className='ml-2 mt-2' />
                  )}
                </Avatar>
                My Accunt</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className='w-80 p-2'>
              <MenuItems />
            </DropdownMenuContent>
          </DropdownMenu>

          <div className='relative cursor-pointer' onClick={() => handleProtectionNavigation('/checkout/cart')}>
            <Button variant='ghost' className='relative '>
              <ShoppingCart className='h-5  w-5 mr-2  md:h-10 md:w-auto '></ShoppingCart>Cart</Button>{user && cartCount > 0 && (
                <span className='absolute top-2 left-5 transform translate-x-1/2 translate-y--1/2 bg-red-500 text-white rounded-full px-1 text-xs  '>{cartCount}</span>
              )}</div>

        </div>
      </div>


      {/* Mobile header */}

      <div className='container mx-auto flex lg:hidden items-center justify-between p-4'>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant='ghost' size='icon'>
              <Menu className='h-6 w-6' />
            </Button>
          </SheetTrigger>
          <SheetContent side='left' className='w-80 p-0'>
            <SheetHeader>
              <SheetTitle className='sr-only'></SheetTitle>
            </SheetHeader>
            <div className='border-b p-4 '><Link href='/' className='flex items-center'><Image src="/images/web-logo.png" width={150} height={40} alt='mobilelogo'></Image></Link>
              <div className='relative w-full '>
                <Input type='text' className='w-full pr-10' placeholder='Search books' value={searchTerms} onChange={(e) => setSearchTerms(e.target.value)} />
                <Button size='icon' variant='ghost' onClick={handlesearchTerms} className='absolute right-0 top-1/2 -translate-y-1/2 ' >
                  <SearchIcon className='h-5 w-5' />
                </Button>
              </div>
            </div>
            <MenuItems className='py-2' />

          </SheetContent>
        </Sheet>
        <Link href='checkout/cart' >
          <div className='relative '>
            <Button variant='ghost' className='relative '>
              <ShoppingCart className='h-5  w-5 mr-2  md:h-10 md:w-auto '></ShoppingCart></Button>{user && cartCount > 0 && (
                <span className='absolute top-2 left-5 transform translate-x-1/2 translate-y--1/2 bg-red-500 text-white rounded-full px-1 text-xs  '>{cartCount}</span>
              )}</div></Link>
      </div>
      <AuthPage isLoginOpen={isLoginOpen} setIsloginOpen={handleLoginClick} />
    </header>
  )
}
