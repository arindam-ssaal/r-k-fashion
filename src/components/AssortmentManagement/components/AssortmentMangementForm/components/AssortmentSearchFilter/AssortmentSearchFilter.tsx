import React, { useCallback, useEffect, useMemo, useState } from 'react'

import AssortmentSelectionTable from '../AssortmentSelectionTable'
import { createAssortmentPayload } from '@/components/AssortmentManagement/helper/assortmentFilterFormatter'
import { useAssortmentDataById } from '@/components/AssortmentManagement/hooks_api/useAssortmentDataById'
import { useAssortmentManagementDataStore } from '@/components/AssortmentManagement/store/useAssortmentManagementDataStore'
import { useAssortmentManagementStore } from '@/components/AssortmentManagement/store/useAssortmentManagementStore'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectGroup,
  SelectItem,
  SelectValue,
} from '@/components/ui/select'
import { useGetItemFilterWise } from '@/hooks_api/useGetItemFilterWise'
import { useGetAllItemsGroups } from '@/hooks_api/useGetItemsGroups'
import { useGetPropertiesByGroupID } from '@/hooks_api/useGetpropertiesByGroupId'
import { useQueryClient } from '@tanstack/react-query';
import * as XLSX from "xlsx";



type propertyValue = {
  value: string
}
export type PropertiesType = {
  propertyID: string
  propertyName: string
  propertyValues: propertyValue[]
}

function AssortmentSearchFilter({
  setShow,
}: {
  setShow: React.Dispatch<React.SetStateAction<boolean>>
}) {
  const type = useAssortmentManagementStore((state) => state.type)
  const mode = useAssortmentManagementStore((state) => state.mode)
  const selectedId = useAssortmentManagementDataStore((state) => state.currentAssortmentId)
  const { itemsGroups, isLoading, error } = useGetAllItemsGroups()
  const { generateItemsAsync, isPending } = useGetItemFilterWise()
  const [selectedGroupId, setSelectedGroupId] = useState<number | null>(null)
  const [selectedProp, setSelectedProp] = useState<PropertiesType[]>([])
  const { assortmentData } = useAssortmentDataById(selectedId, type)
  const groupID = assortmentData?.assortmentDetail[0]?.group
  //const { setGeneratedItems } = useAssortmentManagementDataStore((state) => state);
  const queryClient = useQueryClient();
  const [selectedFileName, setSelectedFileName] = useState("");


  const {
    itemsGroupsProperties,
    isLoading: propertiesLoading,
    error: propertiesError,
  } = useGetPropertiesByGroupID(Number(selectedGroupId))

  useEffect(() => {
    if (mode === 'Edit') {
      setSelectedGroupId(Number(groupID))
    }
  }, [groupID])

  const selectOptions = useMemo(() => {
    if (isLoading) {
      return (
        <SelectItem disabled value="loading">
          Loading...
        </SelectItem>
      )
    }
    if (error) {
      return (
        <SelectItem disabled value="error">
          Error loading items
        </SelectItem>
      )
    }
    return (
      itemsGroups?.map((group) => (
        <SelectItem key={group?.itemGrpID} value={group?.itemGrpID?.toString()}>
          {group?.itemGrpName}
        </SelectItem>
      )) || []
    )
  }, [isLoading, error, itemsGroups])

  const handleGroupChange = useCallback((value: number) => {
    setSelectedGroupId(value)
  }, [])

  async function handleListGeneration() {
    const data = createAssortmentPayload(Number(selectedGroupId), selectedProp)
    //console.log(data)
    setShow(false)
    await generateItemsAsync(data)
  }

  function handleCheckboxChange(id: string, name: string, option: string, checked: boolean) {
    setSelectedProp((prevSelectedProps) => {
      const existingProp = prevSelectedProps.find((prop) => prop.propertyID === id)
      if (checked) {
        if (existingProp) {
          const alreadySelected = existingProp.propertyValues.some((val) => val.value === option)
          if (!alreadySelected) {
            return prevSelectedProps.map((prop) =>
              prop.propertyID === id
                ? {
                    ...prop,
                    propertyValues: [...prop.propertyValues, { value: option }],
                  }
                : prop
            )
          } else {
            return prevSelectedProps
          }
        } else {
          return [
            ...prevSelectedProps,
            { propertyID: id, propertyName: name, propertyValues: [{ value: option }] },
          ]
        }
      } else {
        if (existingProp) {
          const updatedValues = existingProp.propertyValues.filter((val) => val.value !== option)
          if (updatedValues.length > 0) {
            return prevSelectedProps.map((prop) =>
              prop.propertyID === id ? { ...prop, propertyValues: updatedValues } : prop
            )
          } else {
            // Agar koi value nai bachi, to poora property object remove kar do
            return prevSelectedProps.filter((prop) => prop.propertyID !== id)
          }
        } else {
          return prevSelectedProps
        }
      }
    })
  }

  const handleExcelUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setSelectedFileName(file.name);
    //console.log("File selected:", file.name);

    const reader = new FileReader();
    reader.onload = (e) => {
      //console.log("Reader loaded");

      const data = e.target?.result;
      if (!data) return;

      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];

      const jsonData: any[] = XLSX.utils.sheet_to_json(worksheet);
      console.log("Parsed Excel:", jsonData);

      const parsedItems = jsonData.map((row) => ({
        itemCode: row["Item Code"] || row["itemCode"],
        itemName: row["Item Name"] || row["itemName"],
        barCode: row["Bar Code"] || row["barCode"],
        itemGroup: row["Item Group"] || row["itemGroup"],
        hsnSacCode: row["HSN/SAC Code"] || row["hsnsacCode"],
        selection: row["Selection"] || "Included",
      }));

      queryClient.setQueryData(['generatedAssortmentItems'], parsedItems);
      //setGeneratedItems(parsedItems);

      // allow same file re-upload
      event.target.value = "";
    };
    reader.readAsArrayBuffer(file);
  };


  return (
    <div className="p-6 bg-white shadow-md rounded-lg w-full">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Filter Assortment</h2>

      <div className="flex flex-col gap-2 mb-4">
        <Label className="text-sm">Group</Label>
        <Select
          onValueChange={(val) => handleGroupChange(Number(val))}
          value={selectedGroupId ? String(selectedGroupId) : ''} // Fix applied
        >
          <SelectTrigger className="border p-2 w-full text-start">
            <SelectValue placeholder="Select a Group" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>{selectOptions}</SelectGroup>
          </SelectContent>
        </Select>
      </div>

      {selectedGroupId && (
        <div className="mt-4">
          <h3 className="text-md font-semibold mb-2">Group Properties</h3>
          {propertiesLoading && <p>Loading properties...</p>}
          {propertiesError && <p className="text-red-500">Error: {propertiesError}</p>}
          {itemsGroupsProperties && itemsGroupsProperties.length > 0 ? (
            <div className="overflow-x-scroll max-w-[600px] mx-auto w-full border">
              <table className="w-[600px] border-collapse mx-auto">
                <thead>
                  <tr>
                    {itemsGroupsProperties.map((prop) => (
                      <th key={prop.propertyID} className="px-4 py-2 border text-center">
                        {prop.propertyName}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {(() => {
                    const maxRows = Math.max(
                      ...itemsGroupsProperties.map((prop) => prop.propertyValues?.length)
                    )
                    const rows = []
                    for (let i = 0; i < maxRows; i++) {
                      rows.push(
                        <tr key={i}>
                          {itemsGroupsProperties.map((prop) => {
                            const option = prop.propertyValues[i]
                            return (
                              <td key={prop.propertyID} className="px-4 py-2 border text-center">
                                {option ? (
                                  <label className="flex items-center gap-2">
                                    <input
                                      type="checkbox"
                                      onChange={(e) => {
                                        handleCheckboxChange(
                                          prop.propertyID,
                                          prop.propertyName,
                                          option.value,
                                          e.target.checked
                                        )
                                      }}
                                    />
                                    <span>{option.value}</span>
                                  </label>
                                ) : null}
                              </td>
                            )
                          })}
                        </tr>
                      )
                    }
                    return rows
                  })()}
                </tbody>
              </table>
            </div>
          ) : (
            <p>No properties found for this group.</p>
          )}
        </div>
      )}

      <div className="flex gap-4 mt-4">
        <Button
          type="button"
          disabled={isPending}
          onClick={() => handleListGeneration()}
          className="ms-auto"
        >
          {isPending ? 'Generating' : 'Generate'}
        </Button>

        <input
          type="file"
          accept=".xlsx, .xls"
          onChange={handleExcelUpload}
          className="ml-4"
        />
        {selectedFileName && <span className="ml-2 text-sm">{selectedFileName}</span>}
        {/* {selectedFileName && <span style={{ marginLeft: "8px" }}>{selectedFileName}</span>} */}
       
      </div>
      <AssortmentSelectionTable />
    </div>
  )
}

export default AssortmentSearchFilter
