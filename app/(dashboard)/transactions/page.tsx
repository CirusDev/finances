"use client"

import { toast } from 'sonner'
import { useState } from 'react'
import { Loader } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { columns } from './columns'
import { Skeleton } from '@/components/ui/skeleton'
import { DataTable } from '@/components/data-table'
import { ImportCard } from './import-card'
import { transactions as transactionSchema } from '@/db/schema'
import { UploadButton } from './upload-button'
import { useSelectAccount } from '@/features/accounts/hooks/use-select-account'
import { useNewTransaction } from '@/features/transactions/hooks/use-new-transaction' 
import { useGetTransactions } from '@/features/transactions/api/use-get-transactions' 
import { useBulkDeleteTransactions } from '@/features/transactions/api/use-bulk-delete-transactions'
import { useBulkCreateTransactions } from '@/features/transactions/api/use-bulk-create-transactions'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

enum VARIANTS {
  LIST = 'LIST',
  IMPORT = 'IMPORT'	
}

const  INITIAL_IMPORT_RESULTS = {
  data: [],
  errors: [],
  meta: []
}

const TransactionsPage = () => {
  const [ AccountDialog, confirm ] = useSelectAccount()
  const [variant, setVariant] = useState<VARIANTS>(VARIANTS.LIST)
  const [importResults, setImportResults] = useState(INITIAL_IMPORT_RESULTS)

  const { onOpen } = useNewTransaction()
  const createTransactions = useBulkCreateTransactions()
  const transactionsQuery = useGetTransactions()
  const deleteTransactions = useBulkDeleteTransactions()
  const transactions = transactionsQuery.data || []

  const isDisabled = transactionsQuery.isLoading || deleteTransactions.isPending

  const onSubmitImport = async (
    values: typeof transactionSchema.$inferInsert[]
  ) => {
    const accountId = await confirm()
    if (!accountId) {
      return toast.error("Select an account to continue")
    }

    const data = values.map((value) => ({
      ...value,
      accountId: accountId as string
    }))

    createTransactions.mutate(data, {
      onSuccess: () => {
        onCancelImport()
      }
    })
  }

  const onUpload = (results: typeof INITIAL_IMPORT_RESULTS) => {
    setImportResults(results)
    setVariant(VARIANTS.IMPORT)
  }

  const onCancelImport = () => {
    setVariant(VARIANTS.LIST)
    setImportResults(INITIAL_IMPORT_RESULTS)
  }

  if (transactionsQuery.isLoading) {
    return (
      <div className='max-w-screen-2xl mx-auto w-full pb-10 -mt-24'>
        <Card className='border-none drop-shadow-sm'>
          <CardHeader className='gap-y-2 lg:flex-row lg:items-center lg: justify-between'>
            <Skeleton className='h-8 w-48' />
          </CardHeader>  

          <CardContent>
            <div className='flex min-h-96 w-full items-center justify-center'>
              <Loader className='size-6 text-slate-300 animate-spin' />
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (variant === VARIANTS.IMPORT) {
    return (
      <>
        <AccountDialog />

        <ImportCard 
          data={importResults.data}
          onCancel={onCancelImport}
          onSubmit={onSubmitImport}
        />
      </>
    )
  }

  return (
    <div className='max-w-screen-2xl mx-auto w-full pb-10 -mt-24'>
      <Card className='border-none drop-shadow-sm'>
        <CardHeader className='gap-y-2 lg:flex-row lg:items-center lg: justify-between'>
          <CardTitle className='text-xl line-clamp-1'>
            Transactions History
          </CardTitle>

          <CardDescription></CardDescription>

          <div className='flex flex-col lg:flex-row items-center gap-x-2 gap-y-2'>
            <Button 
              className="w-full lg:w-auto"
              size={"sm"}
              onClick={onOpen}
            >
              Add new
            </Button>

            <UploadButton 
              onUpload={onUpload}
            />
          </div>

        </CardHeader>

        <CardContent>
          <DataTable 
            filterKey='payee'
            columns={columns} 
            data={transactions} 
            disabled={isDisabled}
            onDelete={(rows) => {
              const ids = rows.map((r) => r.original.id)
              deleteTransactions.mutate({ ids })
              
            }}
          />
        </CardContent>
      </Card>
    </div>
  )
}

export default TransactionsPage