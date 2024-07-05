import { toast } from "sonner";
import { InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { client } from "@/lib/hono"

type ResponseType = InferResponseType<typeof client.api.transactions[":id"]["$delete"]>

export const useDeleteTransaction = (id?: string) => {
  const queryClient = useQueryClient()

  const mutation = useMutation<ResponseType, Error>({
    mutationFn: async() => {
      const resp = await client.api.transactions[":id"]["$delete"]({ 
        param: { id }
      })
      return await resp.json()
    },
    onSuccess: () => {
      toast.success('Transaction deleted')
      queryClient.invalidateQueries({ queryKey: ['transaction', { id }] }) //refresh useGetTransactions by the key "transaction"
      queryClient.invalidateQueries({ queryKey: ['transactions'] }) //refresh useGetTransactions by the key "transactions"
      queryClient.invalidateQueries({ queryKey: ['summary'] }) //refresh useGetTransactions by the key "summary"
    },
    onError: () => {
      toast.error("Fail to delete transaction at useDeleteTransaction")
    }
  })

  return mutation
}