import Image from "next/image"
import { Loader } from "lucide-react"

import { SignUp, ClerkLoaded, ClerkLoading } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
      <div className="h-full lg:flex flex-col items-center justify-center px-4">
        <div className="text-center space-y-4 pt-16">
          <h1 className="font-bold text-3xl text-foreground">
            Welcome!
          </h1>

          <p className="text-base text-gray-500">Log in or Create an account to go in to your dashboard! </p>
        </div>

        <div className="flex items-center justify-center mt-8">
          <ClerkLoaded>
            <SignUp />
          </ClerkLoaded>

          <ClerkLoading>
            <Loader className="animate-spin text-muted-foreground" size={42} />
          </ClerkLoading>
        </div>
      </div>

      <div className="h-full bg-blue-600 hidden lg:flex items-center justify-center">
        <Image 
          src={"/logoipsum-296.svg"}
          height={100}
          width={100}
          alt="Logo"
        />
      </div>
    </div>
  )
}