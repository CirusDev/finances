import { toast } from "sonner";
import { InferRequestType, InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { client } from "@/lib/hono"

type ResponseType = InferResponseType<typeof client.api.accounts.$post>;
type RequestType = InferRequestType<typeof client.api.accounts.$post>["json"]

export const useCreateAccount = () => {
  const queryClient = useQueryClient()

  const mutation = useMutation<ResponseType, RequestType, Error>({
    mutationFn: async(json) => {
      const resp = await client.api.accounts.$post({ json })
      return resp.json()
    },
    onSuccess: () => {
      toast.success('Account created')
      queryClient.invalidateQueries({ queryKey: ['accounts'] }) //refresh useGetAccounts by the key "accounts"
    },
    onError: () => {
      toast.error("Fail to create account at useCreateAccount")
    }
  })

  return mutation
}