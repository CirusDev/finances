import { z } from "zod"
import { Loader } from "lucide-react"

import { useConfirm } from "@/hooks/use-confirm"
import { CategoryForm } from "./category-form"
import { useOpenCategory } from "../hooks/use-open-category"
import { useEditCategory } from "../api/use-edit-category"
import { useGetCategoryId } from "../api/use-get-category-id"
import { insertCategorySchema } from "@/db/schema"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { useDeleteCategory } from "../api/use-delete-category"

const formSchema = insertCategorySchema.pick({
  name: true
})

type FormValues = z.input<typeof formSchema>

export const EditCategorySheet = () => {
  const { isOpen, onClose, id } = useOpenCategory()

  const [ConfirmationDialog, confirm] = useConfirm({
    title: "Are you sure?",
    message: "You are about to permanently delete this record",
  })
  
  const categoryQuery = useGetCategoryId(id)
  const isLoading = categoryQuery.isLoading

  const editMutation = useEditCategory(id)
  const deleteCategory = useDeleteCategory(id)
  const isPending = editMutation.isPending || deleteCategory.isPending

  const onSubmit = (values: FormValues) => {
    editMutation.mutate(
      {
        ...values,
        message: "Category updated successfully"
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
      deleteCategory.mutate( undefined, {
        onSuccess: () => {
          onClose()
        }
      })
    }
  }

  const defaultValues = categoryQuery.data ? {
    name: categoryQuery.data.name
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
              Edit Category
            </SheetTitle>

            <SheetDescription>
              Update the current category.
            </SheetDescription>
          </SheetHeader>

          {isLoading
            ? (
              <div className="absolute inset-0 flex items-center justify-center">
                <Loader className="size-4 text-muted-foreground animate-spin" />
              </div>
            )
            : (
              <CategoryForm 
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
