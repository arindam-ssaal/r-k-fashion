import { Trash } from 'lucide-react'
import { useEffect, useMemo } from 'react'
import { useFormContext, useFieldArray } from 'react-hook-form'


import { usePettyCashData } from '../../../../../PettyCashHead/hooks_api/usePettyCashData'
import { useStoreMasterById } from '../../../../hooks_api/useFetchStoreMasterById'
import { useStoreMasterDataStore } from '../../../../store/useStoreMasterDataStore'
import useStoreMasterStore from '../../../../store/useStoreMasterStore'

import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const PettyCashDetailsForm = () => {
  // Access central form control through useFormContext

  const { pettyCashData, isLoading } = usePettyCashData()
  const { control, setValue, watch } = useFormContext()

  const mode = useStoreMasterStore((state) => state.mode);
const storeId = useStoreMasterDataStore((state) => state.currentStoreMasterId);
const { storeMaster,  } = useStoreMasterById(Number(storeId));

  // Manage dynamic field rows for petty cash values
  const { fields, append, remove,replace } = useFieldArray({
    control,
    name: 'objPettyCash', // Adjusted path to match combined schema
  })


  useEffect(() => {
    if (mode === "Edit" && storeMaster?.objPettyCash) {
      replace(
        storeMaster.objPettyCash.map((pc) => ({
          pettyCashName: pc.pettyCashName || "",
          pettyCashCode: String(pc.pettyCashID) || "",
          limit: pc.limit || 0,
          modeOfOperation: pc.modeOfOperation || "",
          ledgerCode: pc.ledgerCode || "",
          ledgerName: pc.ledgerName || "",
          subLedgerCode: pc.subLedgerCode || "",
          subLedgerName: pc.subLedgerName || "",
          discontinued: pc.discontinued || "N",
        }))
      );
    }
  }, [storeMaster, mode, replace]);


  // Ledger and Sub-Ledger options
  const ledgerOptions = [
    { value: 'LEDGER001', label: 'Local Conveyance' },
    { value: 'LEDGER002', label: 'Clearing Charges' },
    { value: 'LEDGER003', label: 'Courier Charges' },
    { value: 'LEDGER004', label: 'Tiffin Expenses' },
    { value: 'LEDGER005', label: 'Scrap Sale' },
  ]

  const subLedgerOptions = [
    { value: 'SUBLEDGER001', label: 'Sub Ledger 1', parentLedger: 'LEDGER001' },
    { value: 'SUBLEDGER002', label: 'Sub Ledger 2', parentLedger: 'LEDGER002' },
  ]

  const pettyCashOptions = useMemo(() => {
    if (!pettyCashData || pettyCashData.length === 0) return []

    return pettyCashData.map((cash) => ({
      value: cash.pettyCashName || '',
      label: cash.pettyCashName || 'Unknown',
      id: cash.pettyCashID || 0,
      pettyCashCode: cash.pettyCashCode || '',
      limit: cash.limit || 0,
      modeOfOperation: cash.modeOfOperation || '',
    }))
  }, [pettyCashData])

  const getSubLedgers = (parentLedger: string) => {
    return subLedgerOptions.filter((subLedger) => subLedger.parentLedger === parentLedger)
  }

  return (
    <div className="border p-4 border-black border-solid h-[580px] overflow-y-auto">
      <div className="form-head mb-4">
        <ul className="grid grid-cols-6 gap-3">
          <li className="text-sm font-semibold">
            Petty Cash Head <span className="text-primary">*</span>
          </li>
          <li className="text-sm font-semibold">Limit</li>
          <li className="text-sm font-semibold">
            TypeOf Transaction <span className="text-primary">*</span>
          </li>
          <li className="text-sm font-semibold">
            Ledger <span className="text-primary">*</span>
          </li>
          <li className="text-sm font-semibold">Sub Ledger</li>
          <li className="text-sm font-semibold">Discontinued</li>
        </ul>
      </div>

      {fields.map((item, index) => (
        <div key={item.id} className="grid grid-cols-6 gap-3 mb-3">
          <FormField
            control={control}
            name={`objPettyCash.${index}.pettyCashName`}
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Select
                    defaultValue={field.value}
                    value={field.value}
                    onValueChange={(value) => {
                      field.onChange(value)

                      // 🎯 Find selected Petty Cash details
                      const selectedPettyCash = pettyCashOptions.find((pc) => pc.value === value)

                      if (selectedPettyCash) {
                        setValue(`objPettyCash.${index}.pettyCashCode`, String(selectedPettyCash.id))
                        setValue(`objPettyCash.${index}.limit`, selectedPettyCash.limit)
                        setValue(
                          `objPettyCash.${index}.modeOfOperation`,
                          selectedPettyCash.modeOfOperation
                        )
                      }
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue
                        placeholder={isLoading ? 'Loading...' : 'Select Pettycash Name'}
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {isLoading ? (
                        <p className="p-2 text-gray-500">Loading...</p>
                      ) : (
                        pettyCashOptions?.map((pm) => (
                          <SelectItem key={pm.id} value={pm.value}>
                            {pm.label}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name={`objPettyCash.${index}.limit`}
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Limit"
                    value={field.value || ''}
                    onChange={(e) => {
                      const value = e.target.value
                      field.onChange(value !== '' ? parseFloat(value) : undefined) // Convert to number
                    }}
                    readOnly
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name={`objPettyCash.${index}.modeOfOperation`}
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Select onValueChange={field.onChange} value={field.value} disabled>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Type of Transaction" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="p">Payment</SelectItem>
                      <SelectItem value="r">Reciept</SelectItem>
                      <SelectItem value="b">both</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name={`objPettyCash.${index}.ledgerName`}
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value)
                      const selectedLedger = ledgerOptions.find((ledger) => ledger.value === value)
                      setValue(`objPettyCash.${index}.ledgerCode`, selectedLedger?.value || '')
                      setValue(`objPettyCash.${index}.subLedgerName`, '')
                    }}
                    defaultValue={field.value}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Ledger Name" />
                    </SelectTrigger>
                    <SelectContent>
                      {ledgerOptions.map((ledger) => (
                        <SelectItem key={ledger.value} value={ledger.value}>
                          {ledger.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Sub Ledger Name Field */}
          <FormField
            control={control}
            name={`objPettyCash.${index}.subLedgerName`}
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value)
                      const selectedSubLedger = subLedgerOptions.find(
                        (subLedger) => subLedger.value === value
                      )
                      setValue(
                        `objPettyCash.${index}.subLedgerCode`,
                        selectedSubLedger?.value || ''
                      )
                    }}
                    defaultValue={field.value}
                    value={field.value}
                    disabled={!watch(`objPettyCash.${index}.ledgerName`)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Sub Ledger Name" />
                    </SelectTrigger>
                    <SelectContent>
                      {getSubLedgers(watch(`objPettyCash.${index}.ledgerName`)).map((subLedger) => (
                        <SelectItem key={subLedger.value} value={subLedger.value}>
                          {subLedger.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-4 gap-3 mb-3">
            <FormField
              control={control}
              name={`objPettyCash.${index}.discontinue`}
              render={({ field }) => (
                <FormItem className="ms-auto me-auto">
                  <FormControl>
                    <div className="flex items-center mt-2">
                      <Checkbox
                        id={`discontinue-${index}`}
                        checked={field.value === 'Y'} // Treat 'Y' as checked
                        onCheckedChange={(checked) => field.onChange(checked ? 'Y' : 'N')} // Map true/false to 'Y'/'N'
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-4 gap-3 mb-3">
              <Button size="icon" type="button" onClick={() => remove(index)}>
                <Trash size="15" />
              </Button>
            </div>
          </div>
        </div>
      ))}

      <ul className="flex item-center gap-3 justify-end mt-4">
        <li>
          <Button type="button">Copy from Site</Button>
        </li>
        <li>
          <Button
            type="button"
            onClick={() =>
              append({
                pettyCashName: '',
                pettyCashCode: '',
                limit: 0,
                modeOfOperation: '', // Initially empty, dropdown selection required
                ledgerCode: '',
                ledgerName: '',
                subLedgerCode: '',
                subLedgerName: '',
                discontinued: 'N', // Default to "N" (not discontinued)
              })
            }
          >
            Add Row
          </Button>
        </li>
      </ul>
    </div>
  )
}

export default PettyCashDetailsForm
