import React from 'react'
import Image from 'next/image'
import { imageLoader } from '~/helpers'

export default function SplashScreen() {
  return (
    <div
      className={
        'absolute inset-y-0  right-[5px]  z-50 grid h-full w-full place-content-center'
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
