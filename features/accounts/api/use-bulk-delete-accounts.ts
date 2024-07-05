import { toast } from "sonner";
import { client } from "@/lib/hono"
import { InferRequestType, InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";


type ResponseType = InferResponseType<typeof client.api.accounts["bulk-delete"]["$post"]>;
type RequestType = InferRequestType<typeof client.api.accounts["bulk-delete"]["$post"]>["json"]

export const useBulkDeleteAccounts = () => {
  const queryClient = useQueryClient()

  const mutation = useMutation<ResponseType, RequestType, Error>({
    mutationFn: async(json) => {
      const resp = await client.api.accounts["bulk-delete"].$post({ json })
      return resp.json()
    },
    onSuccess: () => {
      toast.success('Account deleted')
      queryClient.invalidateQueries({ queryKey: ['accounts'] }) //refresh useGetAccounts by the key "accounts"
      //TODOs: Invalidate sunmary
    },
    onError: () => {
      toast.error("Fail to delete accounts at useBulkDelete")
    }
  })

  return mutation
}