import { ClerkLoaded, ClerkLoading, UserButton } from '@clerk/nextjs'

import { HeaderLogo } from './header-logo'
import { Navigation } from './navigation'
import { Loader } from 'lucide-react'
import { WelcomeMsg } from './welcome-msg'
import { Filters } from './filters'

export const Header = () => {
  return (
    <header className='bg-gradient-to-b from-blue-700 to-blue-400 px-4 py-8 lg:px-14 pb-36'>
      <div className='max-w-screen-xl mx-auto'>
        <div className='w-full flex items-center justify-between mb-14'>
          <div className='flex items-center lg:gap-x-16'>
            <HeaderLogo />

            <Navigation />
          </div>

          <div className='flex bg-white h-10 w-10 rounded-full items-center justify-center'>
            <ClerkLoaded>
              <UserButton afterSignOutUrl='/' />
            </ClerkLoaded>

            <ClerkLoading>
              <Loader className='animate-spin size-6 text-muted-foreground'/>
            </ClerkLoading>
          </div>
        </div>

        <WelcomeMsg />

        <Filters />
      </div>
    </header>
  )
}