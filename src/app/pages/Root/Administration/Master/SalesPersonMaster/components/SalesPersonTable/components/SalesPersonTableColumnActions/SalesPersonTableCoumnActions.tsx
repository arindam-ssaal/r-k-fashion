import { DotsHorizontalIcon } from '@radix-ui/react-icons'

import { useCreateSalesPerson } from '../../../../hooks_api/useCreateSalesPerson'
import { useFetchSalesPersonById } from '../../../../hooks_api/useSalesPersonDataByID'
import useSalesPerson from '../../../../store/useSalesPerson'
import { useSalesPersonDataStore } from '../../../../store/useSalesPersonDataStore'
import { ExtendedSalesPersonType } from '../../data/tableData'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { formatDate } from '@/lib/utils'

export function TableRowDropDowns({ salesPerson }: { salesPerson: ExtendedSalesPersonType }) {
  const modalToggler = useSalesPerson((state) => state.toggleOpen)
  const setModalMode = useSalesPerson((state) => state.setMode)
  const setCurrentSalesPersonId = useSalesPersonDataStore((state) => state.setCurrentSalesPersonId)
  const { createSalesPerson } = useCreateSalesPerson()
  const { fetchSalesPersonById } = useFetchSalesPersonById()

  function EditModalHandler() {
    modalToggler()
    setCurrentSalesPersonId(Number(salesPerson.salesPersonID))
    setModalMode('Edit')
  }

  async function ViewModalHandler() {
    modalToggler()
    setCurrentSalesPersonId(Number(salesPerson.salesPersonID))
    setModalMode('View')
  }

  async function DeleteHandler() {
    try {
      // 🔥 ID pass karke data fetch karo
      const data = await fetchSalesPersonById(Number(salesPerson.salesPersonID))

      // ✅ Data ko Delete operation ke liye format karo
      const deletePayload = {
        ...data,
        salesPersonID: Number(data.salesPersonID), // 🔄 String ko Number mein convert karo
        firstName: data.firstName ?? '', // ✅ Null ko empty string se replace karo
        lastName: data.lastName ?? '',
        mobileNo: data.mobileNo ?? '',
        whatsAppNo: data.whatsAppNo ?? '',
        email: data.email ?? '',
        employeeID: data.employeeID ?? '',
        allocatedRole: Number(data.allocatedRole) || 0,
        allocatedUser: Number(data.allocatedUser) || 0,
        isActive: data.isActive ?? 'N', // ✅ Null ko default 'N' se replace karo
        enteredBy: data.enteredBy ?? '0',
        usedFor: 'D', // 🗑️ Delete flag set karo
        objDetails:
          data.objDetails.map((item) => ({
            ...item,
            startDate: item.startDate ? formatDate(item.startDate) : '',
            endDate: item.endDate ? formatDate(item.endDate) : '',
            isTransfered: item.isTransfered ?? 'N', // ✅ Default 'N' if null
          })) ?? [], // ✅ Null ko empty array se replace karo
      }

      console.log('🗑️ Deleting Data:', deletePayload)

      // 🚀 Delete ke liye mutation call karo
      await createSalesPerson(deletePayload)

      // ✅ Modal close ya confirmation show karo
      setModalMode('Delete')
      console.log('✅ Successfully deleted the SalesPerson')
    } catch (error) {
      console.error('❌ Error fetching or deleting data:', error)
    }
  }

  // console.log(sp);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <DotsHorizontalIcon className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuItem onClick={() => navigator.clipboard.writeText(salesPerson.salesPersonID)}>
          Copy SalesPerson ID
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={EditModalHandler}>Edit Customer</DropdownMenuItem>
        <DropdownMenuItem onClick={ViewModalHandler}>View Customer</DropdownMenuItem>
        <DropdownMenuItem onClick={DeleteHandler}>Delete Customer</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

// http://dts.connectcloud365.com:53952/api/SalePerson/GetSalesPerson?SalesPersonID=3
// http://dts.connectcloud365.com:53952/api/SalePerson/GetSalesPerson?SalesPersonID=0
