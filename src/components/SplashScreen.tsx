import React from 'react'
import Image from 'next/image'
import { imageLoader } from '~/helpers'

export default function SplashScreen() {
  return (
    <div
      className={
        'absolute top-0  bottom-0  w-full h-full grid place-content-center z-50 right-[5px]'
      }
    >
      <Image
        loader={imageLoader}
        width={600}
        height={600}
        src={'/assets/img/AZCPOS-Logo-1920x500-Web.png'}
        alt="logo"
      />
    </div>
  )
}
