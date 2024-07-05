import { toast } from "sonner";
import { InferRequestType, InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { client } from "@/lib/hono"

type ResponseType = InferResponseType<typeof client.api.categories[":id"]["$patch"]>;
type RequestType = InferRequestType<typeof client.api.categories[":id"]["$patch"]>["json"]

export const useEditCategory = (id?: string) => {
  const queryClient = useQueryClient()

  const mutation = useMutation<ResponseType, RequestType, Error>({
    mutationFn: async(json) => {
      const resp = await client.api.categories[":id"]["$patch"]({ 
        json, 
        param: { id }
      })
      return resp.json()
    },
    onSuccess: () => {
      toast.success('Category updated')
      queryClient.invalidateQueries({ queryKey: ['category', { id }] }) //refresh useGetCategories by the key "category"
      queryClient.invalidateQueries({ queryKey: ['categories'] }) //refresh useGetCategories by the key "categories"
      queryClient.invalidateQueries({ queryKey: ['transactions'] }) //refresh useGetCategories by the key "categories"
      queryClient.invalidateQueries({ queryKey: ['summary'] }) //refresh useGetCategories by the key "summary"
    },
    onError: () => {
      toast.error("Fail to update category at useEditCategory")
    }
  })

  return mutation
}