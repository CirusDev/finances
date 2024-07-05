import { z } from "zod"

import { TransactionForm } from "./transaction-form"
import { useNewTransaction } from "../hooks/use-new-transaction"
import { useCreateTransaction } from "../api/use-create-transaction"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { insertTransactionSchema } from "@/db/schema"
import { useCreateCategory } from "@/features/categories/api/use-create-category"
import { useGetCategories } from "@/features/categories/api/use-get-categories"
import { useCreateAccount } from "@/features/accounts/api/use-create-account"
import { useGetAccounts } from "@/features/accounts/api/use-get-accounts"
import { Loader } from "lucide-react"

const formSchema = insertTransactionSchema.omit({
  id: true
})

type FormValues = z.input<typeof formSchema>

export const NewTransactionSheet = () => {
  const { isOpen, onClose } = useNewTransaction()
  const createMutation = useCreateTransaction()

  const categoryQuery = useGetCategories()
  const categoryMutation = useCreateCategory()
  const onCreateCategory = (name: string) => {
    categoryMutation.mutate({
      name,
      message: "Category created successfully"
    })
  }
  const categoryOptions = (categoryQuery.data ?? []).map((category) => ({
    value: category.id,
    label: category.name
  }))

  const accountQuery = useGetAccounts()
  const accountMutation = useCreateAccount()
  const onCreateAccount = (name: string) => {
    accountMutation.mutate({
      name,
      message: "Category created successfully"
    })
  }
  const accountOptions = (accountQuery.data ?? []).map((account) => ({
    value: account.id,
    label: account.name
  }))

  const isPending =
    createMutation.isPending ||
    categoryMutation.isPending ||
    accountMutation.isPending

  const isLoading =
    categoryQuery.isLoading ||
    accountQuery.isLoading

  const onSubmit = (values: FormValues) => {
    createMutation.mutate(values,
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
            New Transaction
          </SheetTitle>

          <SheetDescription>
            Create a new transaction to track your finances.
          </SheetDescription>
        </SheetHeader>

        {isLoading
          ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader className="size-4 text-muted-foreground animate-spin" />
            </div>
          )
          : (
            <TransactionForm 
              onSubmit={onSubmit} 
              disabled={isPending}
              categoryOptions={categoryOptions}
              onCreateCategory={onCreateCategory}
              accountOptions={accountOptions}
              onCreateAccount={onCreateAccount}
            />
          )
        }
      </SheetContent>
    </Sheet>
  )
}
