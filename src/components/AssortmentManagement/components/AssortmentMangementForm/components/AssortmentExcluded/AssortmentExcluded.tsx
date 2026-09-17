import { useAssortmentDiff } from '@/components/AssortmentManagement/hooks/useAssortmentDiff'
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableHead,
  TableRow,
} from '@/components/ui/table'

const AssortmentExcluded = () => {
  const { items: excludedItems } = useAssortmentDiff('excluded')
  return (
    <div className="mt-5">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>No.</TableHead>
            <TableHead>Barcode</TableHead>
            <TableHead>Item Name</TableHead>
            <TableHead>Item Code</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {excludedItems?.map((item, ind) => (
            <TableRow key={item.itemCode}>
              <TableCell>{ind + 1}</TableCell>
              <TableCell>{item.barCode ?? item.barcode}</TableCell>
              <TableCell>{item.itemName ?? '-'}</TableCell>
              <TableCell>{item.itemCode}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

export default AssortmentExcluded
