import { z } from "zod"

import { AccountForm } from "./account-form"
import { useNewAccount } from "../hooks/use-new-account"
import { useCreateAccount } from "../api/use-create-account"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { insertAccountSchema } from "@/db/schema"

const formSchema = insertAccountSchema.pick({
  name: true
})

type FormValues = z.input<typeof formSchema>

export const NewAccountSheet = () => {
  const { isOpen, onClose } = useNewAccount()
  const mutation = useCreateAccount()

  const onSubmit = (values: FormValues) => {
    mutation.mutate(
      {
        ...values,
        message: "Account created successfully"
      },
      {
        onSuccess: () => {
          onClose()
        }
      }
    )
  }
    
  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="space-y-4">
        <SheetHeader>
          <SheetTitle>
            New Account
          </SheetTitle>

          <SheetDescription>
            Create a new account to track your finances.
          </SheetDescription>
        </SheetHeader>

        <AccountForm 
          onSubmit={onSubmit} 
          defaulValues={{ name: "" }}
          disabled={mutation.isPending}
        />
      </SheetContent>
    </Sheet>
  )
}
