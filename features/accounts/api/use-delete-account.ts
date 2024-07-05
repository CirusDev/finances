import { toast } from "sonner";
import { InferRequestType, InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { client } from "@/lib/hono"

type ResponseType = InferResponseType<typeof client.api.accounts[":id"]["$delete"]>

export const useDeleteAccount = (id?: string) => {
  const queryClient = useQueryClient()

  const mutation = useMutation<ResponseType, Error>({
    mutationFn: async() => {
      const resp = await client.api.accounts[":id"]["$delete"]({ 
        param: { id }
      })
      return resp.json()
    },
    onSuccess: () => {
      toast.success('Account deleted')
      queryClient.invalidateQueries({ queryKey: ['account', { id }] }) //refresh useGetAccounts by the key "account"
      queryClient.invalidateQueries({ queryKey: ['accounts'] }) //refresh useGetAccounts by the key "accounts"
      queryClient.invalidateQueries({ queryKey: ['transactions'] }) //refresh useGetAccounts by the key "accounts"
      queryClient.invalidateQueries({ queryKey: ['summary'] }) //refresh useGetAccounts by the key "summary"
    },
    onError: () => {
      toast.error("Fail to delete account at useDeleteAccount")
    }
  })

  return mutation
}