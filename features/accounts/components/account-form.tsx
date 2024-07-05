import { z } from "zod"
import { Trash } from "lucide-react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { insertAccountSchema } from "@/db/schema"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"

const formSchema = insertAccountSchema.pick({
  name: true
})

type FormValues = z.input<typeof formSchema>

type Props = {
  id?:            string 
  defaulValues?:  FormValues
  onSubmit:       (values: FormValues) => void
  onDelete?:      () => void
  disabled?:      boolean
}

export const AccountForm = ({ id, defaulValues, onSubmit, onDelete, disabled }: Props) => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: defaulValues
  })

  const handleSubmit = (values: FormValues) => {
    onSubmit(values)    
    form.reset()
  }

  const handleDelete = () => {
    if (onDelete) {
      onDelete()
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="space-y-4 pt-4"
      >
        <FormField
          name="name"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input 
                  placeholder="e.g. Cash, Card, Bank"
                  disabled={disabled} 
                  {...field} 
                />
              </FormControl>
              
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          className="w-full"
          disabled={disabled}
        >
          {id ? "Save changes" : "Create account"}
        </Button>

        {!!id && (
          <Button
            className="w-full space-x-2"
            type="button"
            disabled={disabled}
            onClick={handleDelete}
            variant={"destructive"}
          >
            <Trash className="mr-2 h-4 w-4" />
            Delete account
          </Button>
        )}
      </form>
    </Form>
  )
}