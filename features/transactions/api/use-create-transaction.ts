import { toast } from "sonner";
import { InferRequestType, InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { client } from "@/lib/hono"

type ResponseType = InferResponseType<typeof client.api.transactions.$post>;
type RequestType = InferRequestType<typeof client.api.transactions.$post>["json"]

export const useCreateTransaction = () => {
  const queryClient = useQueryClient()

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async(json) => {
      const resp = await client.api.transactions.$post({ json })
      return resp.json()
    },
    onSuccess: () => {
      toast.success('Transaction created')
      queryClient.invalidateQueries({ queryKey: ['transactions'] }) //refresh useGetTransactions by the key "transactions"
      queryClient.invalidateQueries({ queryKey: ['summary'] }) //refresh useGetTransactions by the key "summary"
    },
    onError: () => {
      toast.error("Fail to create transaction at useCreateTransaction")
    }
  })

  return mutation
}