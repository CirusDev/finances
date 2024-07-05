import { z } from "zod"
import { Loader } from "lucide-react"

import { useConfirm } from "@/hooks/use-confirm"
import { useGetAccounts } from "@/features/accounts/api/use-get-accounts"
import { TransactionForm } from "./transaction-form"
import { useCreateAccount } from "@/features/accounts/api/use-create-account"
import { useGetCategories } from "@/features/categories/api/use-get-categories"
import { useCreateCategory } from "@/features/categories/api/use-create-category"
import { useOpenTransaction } from "../hooks/use-open-transaction"
import { useEditTransaction } from "../api/use-edit-transaction"
import { useGetTransactionId } from "../api/use-get-transaction-id"
import { insertTransactionSchema } from "@/db/schema"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { useDeleteTransaction } from "../api/use-delete-transaction"

const formSchema = insertTransactionSchema.omit({
  id: true
})

type FormValues = z.input<typeof formSchema>

export const EditTransactionSheet = () => {
  const { isOpen, onClose, id } = useOpenTransaction()

  const [ConfirmationDialog, confirm] = useConfirm({
    title: "Are you sure?",
    message: "You are about to permanently delete this record",
  })
  
  const transactionQuery = useGetTransactionId(id)

  const editMutation = useEditTransaction(id)
  const deleteTransaction = useDeleteTransaction(id)

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
    editMutation.isPending || 
    deleteTransaction.isPending || 
    transactionQuery.isLoading ||
    categoryMutation.isPending ||
    accountMutation.isPending

  const isLoading = 
    transactionQuery.isLoading ||
    categoryQuery.isLoading ||
    accountQuery.isLoading

  const onSubmit = (values: FormValues) => {
    editMutation.mutate(values,
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
      deleteTransaction.mutate( undefined, {
        onSuccess: () => {
          onClose()
        }
      })
    }
  }

  const defaultValues = transactionQuery.data ? {
    accountId:  transactionQuery.data.accountId,
    categoryId: transactionQuery.data.categoryId,
    amount:     transactionQuery.data.amount.toString(),
    date:       transactionQuery.data.date
      ? new Date(transactionQuery.data.date)
      : new Date(),
    payee:      transactionQuery.data.payee,
    notes:      transactionQuery.data.notes,
  } : {
    accountId:  "",
    categoryId: "",
    amount:     "",
    date:       new Date(),
    payee:      "",
    notes:      "",
  }
    
  return (
    <>
      <ConfirmationDialog />

      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent className="space-y-4">
          <SheetHeader>
            <SheetTitle>
              Edit Transaction
            </SheetTitle>

            <SheetDescription>
              Update the current transaction.
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
                id={id}
                defaultValues={defaultValues}
                onSubmit={onSubmit} 
                onDelete={handleDelete}
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
    </>
  )
}
