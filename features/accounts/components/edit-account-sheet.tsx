import { z } from "zod"
import { Loader } from "lucide-react"

import { useConfirm } from "@/hooks/use-confirm"
import { AccountForm } from "./account-form"
import { useOpenAccount } from "../hooks/use-open-account"
import { useEditAccount } from "../api/use-edit-account"
import { useGetAccountId } from "../api/use-get-account-id"
import { insertAccountSchema } from "@/db/schema"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { useDeleteAccount } from "../api/use-delete-account"

const formSchema = insertAccountSchema.pick({
  name: true
})

type FormValues = z.input<typeof formSchema>

export const EditAccountSheet = () => {
  const { isOpen, onClose, id } = useOpenAccount()

  const [ConfirmationDialog, confirm] = useConfirm({
    title: "Are you sure?",
    message: "You are about to permanently delete this record",
  })
  
  const accountQuery = useGetAccountId(id)
  const isLoading = accountQuery.isLoading

  const editMutation = useEditAccount(id)
  const deleteAccount = useDeleteAccount(id)
  const isPending = editMutation.isPending || deleteAccount.isPending

  const onSubmit = (values: FormValues) => {
    editMutation.mutate(
      {
        ...values,
        message: "Account updated successfully"
      },
      {
        onSuccess: () => {
          onClose()
        }
      }
    )
  }

  const handleDelete = async() => {
    const ok = await confirm()
    if (ok) {
      deleteAccount.mutate( undefined, {
        onSuccess: () => {
          onClose()
        }
      })
    }
  }

  const defaultValues = accountQuery.data ? {
    name: accountQuery.data.name
  } : {
    name: ""
  }
    
  return (
    <>
      <ConfirmationDialog />

      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent className="space-y-4">
          <SheetHeader>
            <SheetTitle>
              Edit Account
            </SheetTitle>

            <SheetDescription>
              Update the current account.
            </SheetDescription>
          </SheetHeader>

          {isLoading
            ? (
              <div className="absolute inset-0 flex items-center justify-center">
                <Loader className="size-4 text-muted-foreground animate-spin" />
              </div>
            )
            : (
              <AccountForm 
                id={id}
                onSubmit={onSubmit} 
                onDelete={handleDelete}
                defaulValues={defaultValues}
                disabled={isPending}
              />
            )
          }
        </SheetContent>
      </Sheet>
    </>
  )
}
