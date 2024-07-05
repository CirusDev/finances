import { toast } from "sonner";
import { InferRequestType, InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { client } from "@/lib/hono"

type ResponseType = InferResponseType<typeof client.api.categories[":id"]["$delete"]>

export const useDeleteCategory = (id?: string) => {
  const queryClient = useQueryClient()

  const mutation = useMutation<ResponseType, Error>({
    mutationFn: async() => {
      const resp = await client.api.categories[":id"]["$delete"]({ 
        param: { id }
      })
      return resp.json()
    },
    onSuccess: () => {
      toast.success('Category deleted')
      queryClient.invalidateQueries({ queryKey: ['category', { id }] }) //refresh useGetCategories by the key "category"
      queryClient.invalidateQueries({ queryKey: ['categories'] }) //refresh useGetCategories by the key "categories"
      queryClient.invalidateQueries({ queryKey: ['transactions'] }) //refresh useGetCategories by the key "categories"
      queryClient.invalidateQueries({ queryKey: ['summary'] }) //refresh useGetCategories by the key "summary"
    },
    onError: () => {
      toast.error("Fail to delete category at useDeleteCategory")
    }
  })

  return mutation
}