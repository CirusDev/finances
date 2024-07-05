"use client"

import { Loader } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { columns } from './columns'
import { Skeleton } from '@/components/ui/skeleton'
import { DataTable } from '@/components/data-table'
import { useNewCategory } from '@/features/categories/hooks/use-new-category'
import { useBulkDelete } from '@/features/categories/api/use-bulk-delete'
import { useGetCategories } from '@/features/categories/api/use-get-categories'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

const CategoriesPage = () => {
  const { onOpen } = useNewCategory()
  const categoriesQuery = useGetCategories()
  const deleteCategories = useBulkDelete()
  const categories = categoriesQuery.data || []

  const isDisabled = categoriesQuery.isLoading || deleteCategories.isPending

  if (categoriesQuery.isLoading) {
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
            Categories Page
          </CardTitle>

          <CardDescription></CardDescription>

          <Button 
            size={"sm"}
            onClick={onOpen}
          >
            Add category
          </Button>
        </CardHeader>

        <CardContent>
          <DataTable 
            filterKey='name'
            columns={columns} 
            data={categories} 
            disabled={isDisabled}
            onDelete={(rows) => {
              const ids = rows.map((r) => r.original.id)
              deleteCategories.mutate({ ids })
              
            }}
          />
        </CardContent>
      </Card>
    </div>
  )
}

export default CategoriesPage