import { useRef, useState } from "react"

import { Button } from "@/components/ui/button"
import { useGetAccounts } from "../api/use-get-accounts"
import { useCreateAccount } from "../api/use-create-account"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select } from "@/components/select"

export const useSelectAccount = (): [() => JSX.Element, () => Promise<unknown>] => {
  const accountQuery = useGetAccounts()
  const accountMutation = useCreateAccount()
  const onCreateAccount = (name: string) => accountMutation.mutate({ 
    name,
    message: "Error creating account from use-select-account"
  })
  const accountOptions = (accountQuery.data ?? []).map((account) => ({
    label: account.name,
    value: account.id
  }))

  const [promise, setPromise] = useState<{ 
    resolve: (value: string | undefined) => void
  } | null>(null)

  const selectValue = useRef<string>()

  const confirm = () => new Promise((resolve, reject) => {
    setPromise({ resolve })
  })

  const handleClose = () => {
    setPromise(null)
  }

  const handleConfirm = () => {
    if (promise) {
      promise.resolve(selectValue.current)
    }
    handleClose()
  }

  const handleCancel = () => {
    if (promise) {
      promise.resolve(undefined)
    }
    handleClose()
  }

  const ConfirmationDialog = () => (
    <Dialog open={promise !== null}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Select Account</DialogTitle>

          <DialogDescription>Select an account to continue</DialogDescription>
        </DialogHeader>

        <Select
          placeholder="Select an account" 
          options={accountOptions}
          onCreate={onCreateAccount}
          onChange={(value) => selectValue.current = value}
          disabled={accountQuery.isLoading || accountMutation.isPending}
        />

        <DialogFooter className="pt-2">
          <Button 
            variant={"outline"}
            onClick={handleCancel}
          >
            Cancel
          </Button>

          <Button onClick={handleConfirm}>
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )

  return [ConfirmationDialog, confirm]
}