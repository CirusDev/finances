"use client"

import { useMedia } from "react-use"
import { usePathname, useRouter } from 'next/navigation'

import { NavButton } from './nav-button'
import { useState } from "react"
import { Sheet, SheetContent, SheetDescription, SheetTitle, SheetTrigger } from "./ui/sheet"
import { Button } from "./ui/button"
import { Menu } from "lucide-react"

const routes = [
  { 
    href:   "/",
    label:  "Overview"
  },
  { 
    href:   "/transactions",
    label:  "Transactions"
  },
  { 
    href:   "/accounts",
    label:  "Accounts"
  },
  { 
    href:   "/categories",
    label:  "Categories"
  },
  { 
    href:   "/settings",
    label:  "Settings"
  },
]

export const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false)

  const router = useRouter()
  const pathname = usePathname()
  const isMobile = useMedia('(max-width: 1023px)', false)

  const onClick = (href: string) => {
    router.push(href)
   
    setIsOpen(false)   
  }

  if (isMobile) {
    return (
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger>
          <div
            className="Original: font-normal p-2 bg-white/10 hover:bg-white/20 hover:text-white border-none focus-visible:ring-offset-0 focus-visible:ring-transparent outline-none text-white focus:bg-white/30 transition rounded-sm"
          >
            <Menu className="size-4" />
          </div>
        </SheetTrigger>

        <SheetContent side={"left"} className="px-2 rounded-r-lg">
          <SheetTitle></SheetTitle>

          <SheetDescription></SheetDescription>

          <nav className="flex flex-col gap-y-2 pt-6">
            {routes.map(({href, label}) => (
              <Button
                key={label}
                variant={href === pathname ? "secondary" : "ghost"}
                className="w-full justify-start"
                onClick={() => onClick(href)}
              >
                {label}
              </Button>
            ))}
          </nav>
        </SheetContent>
      </Sheet>
    )
  }

  return (
    <nav className='hidden lg:flex items-center gap-x-2 overflow-x-auto'>
      {/* {routes.map((route) => ( */}
      {routes.map(({href, label}, idx) => (
        <NavButton
          key={href}
          href={href}
          label={label}
          isActive={pathname === href}
        />
      ))}      
    </nav>
  )
}
