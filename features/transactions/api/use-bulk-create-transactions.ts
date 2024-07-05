import { toast } from "sonner";
import { client } from "@/lib/hono"
import { InferRequestType, InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";
 
type ResponseType = InferResponseType<typeof client.api.transactions["bulk-create"]["$post"]>;
type RequestType = InferRequestType<typeof client.api.transactions["bulk-create"]["$post"]>["json"]

export const useBulkCreateTransactions = () => {
  const queryClient = useQueryClient()

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async(json) => {
      const resp = await client.api.transactions["bulk-create"].$post({ json })
      return resp.json()
    },
    onSuccess: () => {
      toast.success('Transaction created')
      queryClient.invalidateQueries({ queryKey: ['transactions'] }) //refresh useGetTransactions by the key "transactions"
      queryClient.invalidateQueries({ queryKey: ['summary'] }) //refresh useGetTransactions by the key "summary"
    },
    onError: () => {
      toast.error("Fail to create transactions at useBulkCreateTransactions")
    }
  })

  return mutation
}