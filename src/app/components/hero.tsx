import Image from 'next/image'
import React from 'react'
import bkimg from 'public/bkimg.jpg'
function Hero() {
  return (
    <div className='relative h-screen '>
        <div className='absolute inset-0 -z-10 '>
        <Image src={bkimg} fill alt='test img' style={{objectFit:'cover'}}/>
        </div>
        <div className='flex items-center justify-center pt-24 '> <h1 className='font-bold text-4xl text-white '>Profanal gym trainer</h1></div>
        </div>
  )
}

export default Hero