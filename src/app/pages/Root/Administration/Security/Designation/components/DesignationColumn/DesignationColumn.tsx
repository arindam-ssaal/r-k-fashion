import { ColumnDef } from '@tanstack/react-table'

import DesignationTableActions from '../DesignationTableActions'

import { Checkbox } from '@/components/ui/checkbox'
import { FetchedDesignationType } from '@/types/designation'

export const columns: ColumnDef<FetchedDesignationType>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'no',
    header: 'No.',
    cell: ({ row }) => <div className="">{row.index + 1}</div>, // Row index for numbering
  },
  {
    accessorKey: 'designationName',
    header: 'Designation',
    cell: ({ row }) => <div className="capitalize">{row.getValue('designationName')}</div>,
  },
  {
    accessorKey: 'isActive',
    header: 'Status',
    cell: ({ row }) => <div className="capitalize">{row.getValue('isActive')}</div>,
  },
  {
    id: 'actions',
    header: 'Actions',

    enableHiding: false,
    cell: ({ row }) => {
      const designation = row.original


    

      return <DesignationTableActions designation={designation}/>
    },
  },
]
