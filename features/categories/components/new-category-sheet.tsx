import { z } from "zod"

import { CategoryForm } from "./category-form"
import { useNewCategory } from "../hooks/use-new-category"
import { useCreateCategory } from "../api/use-create-category"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { insertCategorySchema } from "@/db/schema"

const formSchema = insertCategorySchema.pick({
  name: true
})

type FormValues = z.input<typeof formSchema>

export const NewCategorySheet = () => {
  const { isOpen, onClose } = useNewCategory()
  const mutation = useCreateCategory()

  const onSubmit = (values: FormValues) => {
    mutation.mutate(
      {
        ...values,
        message: "Category created successfully"
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
            New Category
          </SheetTitle>

          <SheetDescription>
            Create a new category to track your finances.
          </SheetDescription>
        </SheetHeader>

        <CategoryForm 
          onSubmit={onSubmit} 
          defaulValues={{ name: "" }}
          disabled={mutation.isPending}
        />
      </SheetContent>
    </Sheet>
  )
}
