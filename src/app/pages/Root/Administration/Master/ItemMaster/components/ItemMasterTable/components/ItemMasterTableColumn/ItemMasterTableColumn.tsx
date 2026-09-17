import { CaretSortIcon, DotsHorizontalIcon } from '@radix-ui/react-icons';
import { ColumnDef } from '@tanstack/react-table';

import { useItemMaster } from '../../../../store/useItemMaster';
import { useItemMasterDataStore } from '../../../../store/useItemMasterDataStore';
import {  ItemTableRow } from '../../data/data';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export const columns: ColumnDef<ItemTableRow>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <input
        type="checkbox"
        checked={table.getIsAllRowsSelected()}
        onChange={table.getToggleAllRowsSelectedHandler()}
      />
    ),
    cell: ({ row }) => (
      <input
        type="checkbox"
        checked={row.getIsSelected()}
        onChange={row.getToggleSelectedHandler()}
      />
    ),
  },
  {
    accessorKey: 'itemCode',
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
        Item Code
        <CaretSortIcon className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => <div>{row.getValue('itemCode')}</div>,
  },
  {
    accessorKey: 'barCode',
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
        Bar Code
        <CaretSortIcon className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => <div>{row.getValue('barCode')}</div>,
  },
  {
    accessorKey: 'itemName',
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
        Item Name
        <CaretSortIcon className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => <div>{row.getValue('itemName')}</div>,
  },
  {
    accessorKey: 'itemGroup',
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
        Item Group
        <CaretSortIcon className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => <div>{row.getValue('itemGroup')}</div>,
  },
  {
    accessorKey: 'isActive',
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
        Active
        <CaretSortIcon className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => <div className="lowercase">{row.getValue('isActive')}</div>,
  },
  {
    accessorKey: 'view',
    header: 'View',
    cell: ({ row }) => (
      <input
        type="checkbox"
        checked={row.getIsSelected()}
        onChange={row.getToggleSelectedHandler()}
      />
    ),
  },
  {
    id: 'actions',
    enableHiding: false,
    cell: ({ row }) => {
      const item = row.original;
      return <TableRowDropDowns item={item} />;
    },
  },
];

function TableRowDropDowns({ item }: { item: ItemTableRow }) {
  const modalToggler = useItemMaster((state) => state.toggleOpen);
  const setModalMode = useItemMaster((state) => state.setMode);
  const setCurrentItemMasterId = useItemMasterDataStore((state) => state.setCurrentItemMasterId);

  // function EditModalHandler() {
  //   modalToggler();
  //   setCurrentItemMasterId(Number(item.itemCode));
  //   setModalMode('Edit');
  // }

  function ViewHandler() {
    modalToggler();
    
    setCurrentItemMasterId(item.itemCode);
    setModalMode('View');
  }

  // async function deleteHandler() {
  //   try {
  //     setModalMode('Delete');
  //     console.log(`Deleting item with ID: ${item.customerId}`);
  //   } catch (err) {
  //     console.error('Error deleting item:', err);
  //   }
  // }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <DotsHorizontalIcon className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Item Actions</DropdownMenuLabel>
        <DropdownMenuItem onClick={() => navigator.clipboard.writeText(String(item.itemCode))}>
          Copy Item ID
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        {/* <DropdownMenuItem onClick={EditModalHandler}>Edit Item</DropdownMenuItem> */}
        <DropdownMenuItem onClick={ViewHandler}>View Item</DropdownMenuItem>
        {/* <DropdownMenuItem onClick={deleteHandler}>Delete Item</DropdownMenuItem> */}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
