import { toast } from "sonner";
import { client } from "@/lib/hono"
import { InferRequestType, InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";


type ResponseType = InferResponseType<typeof client.api.categories["bulk-delete"]["$post"]>;
type RequestType = InferRequestType<typeof client.api.categories["bulk-delete"]["$post"]>["json"]

export const useBulkDelete = () => {
  const queryClient = useQueryClient()

  const mutation = useMutation<ResponseType, RequestType, Error>({
    mutationFn: async(json) => {
      const resp = await client.api.categories["bulk-delete"].$post({ json })
      return resp.json()
    },
    onSuccess: () => {
      toast.success('Category deleted')
      queryClient.invalidateQueries({ queryKey: ['categories'] }) //refresh useGetCategories by the key "categories"
      //TODOs: Invalidate sunmary
    },
    onError: () => {
      toast.error("Fail to delete categories at useBulkDelete")
    }
  })

  return mutation
}