import { Button } from '@/components/ui/button';
import Image from 'next/image';
import React from 'react'

interface NoDataProps {
  message: string;
  imageUrl: string;
  discription: string;
  onClick: () => void;
  buttonText: string;
}

const NoData: React.FC<NoDataProps> = ({ message, imageUrl, discription, onClick, buttonText = "Try Again" }) => {
  return (
    <div className='flex flex-col items-center justify-center p-6 bg-white overflow-hidden space-y-6 mx-auto'>
      <div className='relative w-60 md:w-80'>
        <Image src={imageUrl} alt="no data" width={320} height={320} className='shadow-md hover:shadow-lg transition duration-300' />
      </div>
      <div className='text-center mx-w-md space-y-2'>
        <p className='text-2xl font-bold text-gray-900 tracking-wide'>{message}</p>
        <p className='text-base font-bold text-gray-600 reading-relaxed'>{discription}</p>
      </div>
      {onClick && (<Button onClick={onClick} className='px-6 w-60 py-3 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-300 text-white font-medium rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transform trasition duration-300 ease-in-out  '>{buttonText}</Button>)}

    </div>
  )
}

export default NoData