import { useEffect } from 'react'
import { useFieldArray, useFormContext } from 'react-hook-form'
import { z } from 'zod'

//import useDiscountMasterStore from '../../../../store/useDiscountMasterStore'
import type { DiscountMasterSchema } from '../../schema'
import { useDiscountListStore } from '../DiscountMasterAssortmentListTable/store/useDiscountListStore'

import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

type DiscountMasterFormType = z.infer<typeof DiscountMasterSchema>

function DiscountMasterAssortmentListTable() {
  const { control } = useFormContext<DiscountMasterFormType>(); // React Hook Form Context
  const { fields, append, remove, replace } = useFieldArray({
    control,
    name: "assortments", // Key in form schema
  });

  const selectedAssortments = useDiscountListStore((state) => state.selectedAssortments);
  const deleteSelectedAssortment = useDiscountListStore((state) => state.deleteSelectedAssortment);
  const openModal = useDiscountListStore((state) => state.openModal);

  // 🔄 **Sync Zustand Store with React Hook Form when Zustand updates**
  useEffect(() => {
    replace(selectedAssortments);
  }, [selectedAssortments, replace]);

  // ✅ **Handle New Row Addition**
  const handleAddRow = () => {
    const newRow = { assortmentID: "", assortmentName: "" }; // Empty row
    append(newRow); // Add in form
  };

  // ✅ **Handle Row Deletion**
  const handleDeleteRow = (index: number) => {
    if (selectedAssortments[index]) {
      deleteSelectedAssortment(selectedAssortments[index].assortmentID); // Remove from Zustand
    }
    remove(index); // Remove from form
  };

  // ✅ **Handle Assortment Selection (Opens Modal)**
  const handleSelectItem = (index: number) => {
    openModal(index);
  };

  return (
    <div className='opacity-0'>
      <h4 className="mb-4 font-semibold text-lg">Assortment Selection</h4>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>No.</TableHead>
            <TableHead>Assortment Name</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {fields.map((field, index) => (
            <TableRow key={index}>
              <TableCell>{index + 1}</TableCell>
              <TableCell>
                {field?.assortmentName ? (
                  field.assortmentName
                ) : (
                  <Button type="button" variant="outline" onClick={() => handleSelectItem(index)}>
                    Select
                  </Button>
                )}
              </TableCell>
              <TableCell>
                <Button type="button" variant="destructive" onClick={() => handleDeleteRow(index)}>
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="mt-4 text-right">
        <Button type="button" variant="outline" onClick={handleAddRow}>
          Add Row
        </Button>
      </div>
    </div>
  );
}

export default DiscountMasterAssortmentListTable
