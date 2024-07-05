import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

export const HeaderLogo = () => {
  return (
    <Link href={"/"}>
      <div className='hidden items-center lg:flex'>
        <Image src="/logoipsum-296.svg" alt="logo" width={40} height={40} />

        <p className='font-semibold text-white text-2xl ml-2.5'>
          Finances
        </p>        
      </div>
    </Link>
  )
}
