import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"
   
  const invoices = [
    {
      invoice: "Property1",
      paymentStatus: "Brand",
      paymentMethod: "Luis Philip",
    },
    {
      invoice: "Property2",
      paymentStatus: "colour",
      paymentMethod: "White",
    },
    {
      invoice: "Property3",
      paymentStatus: "size",
      paymentMethod: "2001 - 3000",
    },
    {
      invoice: "Property4",
      paymentStatus: "MRP Range",
      paymentMethod: "Linen",
    },
    {
      invoice: "Property5",
      paymentStatus: "Fabric Type",
      paymentMethod: "Autumn - Summer",
    },
    {
      invoice: "Property6",
      paymentStatus: "Season",
      paymentMethod: "Linen",
    },
  ]

function PropertyDetailsTab() {
    return (
       <Table>
      <TableCaption></TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="">Property Sequence</TableHead>
          <TableHead>Property Name</TableHead>
          <TableHead>Property Value</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {invoices.map((invoice) => (
          <TableRow key={invoice.invoice}>
            <TableCell className="font-medium">{invoice.invoice}</TableCell>
            <TableCell>{invoice.paymentStatus}</TableCell>
            <TableCell>{invoice.paymentMethod}</TableCell>
            {/* <TableCell className="text-right">{invoice.totalAmount}</TableCell> */}
          </TableRow>
        ))}
      </TableBody>
      <TableFooter>
        {/* <TableRow>
          <TableCell colSpan={3}>Total</TableCell>
          <TableCell className="text-right">$2,500.00</TableCell>
        </TableRow> */}
      </TableFooter>
    </Table>
    )
}
export default PropertyDetailsTab