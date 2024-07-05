"use client"

import { Loader } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { columns } from './columns'
import { Skeleton } from '@/components/ui/skeleton'
import { DataTable } from '@/components/data-table'
import { useNewAccount } from '@/features/accounts/hooks/use-new-account'
import { useBulkDeleteAccounts } from '@/features/accounts/api/use-bulk-delete-accounts'
import { useGetAccounts } from '@/features/accounts/api/use-get-accounts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

const AccountsPage = () => {
  const { onOpen } = useNewAccount()
  const accountsQuery = useGetAccounts()
  const deleteAccounts = useBulkDeleteAccounts()
  const accounts = accountsQuery.data || []

  const isDisabled = accountsQuery.isLoading || deleteAccounts.isPending

  if (accountsQuery.isLoading) {
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

  return (
    <div className='max-w-screen-2xl mx-auto w-full pb-10 -mt-24'>
      <Card className='border-none drop-shadow-sm'>
        <CardHeader className='gap-y-2 lg:flex-row lg:items-center lg: justify-between'>
          <CardTitle className='text-xl line-clamp-1'>
            Accounts Page
          </CardTitle>

          <CardDescription></CardDescription>

          <Button 
            size={"sm"}
            onClick={onOpen}
          >
            Add account
          </Button>
        </CardHeader>

        <CardContent>
          <DataTable 
            filterKey='name'
            columns={columns} 
            data={accounts} 
            disabled={isDisabled}
            onDelete={(rows) => {
              const ids = rows.map((r) => r.original.id)
              deleteAccounts.mutate({ ids })
              
            }}
          />
        </CardContent>
      </Card>
    </div>
  )
}

export default AccountsPage