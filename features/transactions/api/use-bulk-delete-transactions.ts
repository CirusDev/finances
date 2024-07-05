import { toast } from "sonner";
import { client } from "@/lib/hono"
import { InferRequestType, InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";


type ResponseType = InferResponseType<typeof client.api.transactions["bulk-delete"]["$post"]>;
type RequestType = InferRequestType<typeof client.api.transactions["bulk-delete"]["$post"]>["json"]

export const useBulkDeleteTransactions = () => {
  const queryClient = useQueryClient()

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async(json) => {
      const resp = await client.api.transactions["bulk-delete"].$post({ json })
      return resp.json()
    },
    onSuccess: () => {
      toast.success('Transaction deleted')
      queryClient.invalidateQueries({ queryKey: ['transactions'] }) //refresh useGetTransactions by the key "transactions"
      queryClient.invalidateQueries({ queryKey: ['summary'] }) //refresh useGetTransactions by the key "summary"      
    },
    onError: () => {
      toast.error("Fail to delete transactions at useBulkDelete")
    }
  })

  return mutation
}