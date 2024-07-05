import { toast } from "sonner";
import { InferRequestType, InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { client } from "@/lib/hono"

type ResponseType = InferResponseType<typeof client.api.transactions[":id"]["$patch"]>;
type RequestType = InferRequestType<typeof client.api.transactions[":id"]["$patch"]>["json"]

export const useEditTransaction = (id?: string) => {
  const queryClient = useQueryClient()

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async(json) => {
      const resp = await client.api.transactions[":id"]["$patch"]({ 
        json, 
        param: { id }
      })
      return resp.json()
    },
    onSuccess: () => {
      toast.success('Transaction updated')
      queryClient.invalidateQueries({ queryKey: ['transaction', { id }] }) //refresh useGetAccounts by the key "account"
      queryClient.invalidateQueries({ queryKey: ['transactions'] }) //refresh useGetAccounts by the key "transactions"
      queryClient.invalidateQueries({ queryKey: ['summary'] }) //refresh useGetAccounts by the key "summary"
    },
    onError: () => {
      toast.error("Fail to update transaction at useEditTransaction")
    }
  })

  return mutation
}