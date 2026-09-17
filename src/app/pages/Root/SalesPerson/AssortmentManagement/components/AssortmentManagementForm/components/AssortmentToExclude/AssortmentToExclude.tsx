import { useAssortmentExcludedData } from "./hook/useAssortmentExcludedData"

import SkeletonLoaderTable from "@/components/SkeletonLoaderTable"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
    Table,
    TableBody,
    //TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"
  


export const AssortmentToExclude = () => {
  const {assortmentExcludedData,isLoading}=useAssortmentExcludedData();

  if (isLoading) {
    // Render skeleton loader during loading state
    return<div className='mt-5'> <SkeletonLoaderTable rows={5} columns={5} /></div>;
  }
  if(!isLoading && !assortmentExcludedData){
    return <h3>No data</h3>
  }
  return (
    <div className="mt-5">
    <div className="flex gap-6 w-full m-3">
      <div className="w-[300px]">
      <Select>
    <SelectTrigger className="">
      <SelectValue placeholder="Select a Name" />
    </SelectTrigger>
    <SelectContent>
      <SelectGroup>
        <SelectLabel>Names</SelectLabel>
        <SelectItem value="apple">Apple</SelectItem>
        <SelectItem value="banana">Banana</SelectItem>
        <SelectItem value="blueberry">Blueberry</SelectItem>
        <SelectItem value="grapes">Grapes</SelectItem>
        <SelectItem value="pineapple">Pineapple</SelectItem>
      </SelectGroup>
    </SelectContent>
  </Select>
      </div>
      <div className="ml-auto flex space-x-2 float-end mr-3 gap-4">
      <Button>Show Items</Button>
      <Button>Copy Assortment</Button>
      </div>
    </div>
    <Table>
    {/* <TableCaption>A list of your recent invoices.</TableCaption> */}
    <TableHeader>
      <TableRow>
        <TableHead className="w-[100px]">Search</TableHead>
        <TableHead>Barcode</TableHead>
        <TableHead>Item Name</TableHead>
        <TableHead className="text-right">Group</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      {assortmentExcludedData?.map((item) => (
        <TableRow key={item.barcode}>
          <TableCell className="font-medium"><Checkbox id="terms" /></TableCell>
          <TableCell>{item.barcode}</TableCell>
          <TableCell>{item.itemName}</TableCell>
          <TableCell className="text-right">{item.group}</TableCell>
        </TableRow>
      ))}
    </TableBody>
    <TableFooter>
      <TableRow>
        {/* <TableCell colSpan={3}>Total</TableCell>
        <TableCell className="text-right">$2,500.00</TableCell> */}
      </TableRow>
    </TableFooter>
  </Table>
  </div>
    
  )
}
