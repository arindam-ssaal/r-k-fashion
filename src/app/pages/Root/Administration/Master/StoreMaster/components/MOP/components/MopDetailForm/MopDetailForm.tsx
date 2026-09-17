import { Trash } from 'lucide-react'
import { useEffect, useMemo } from 'react'
import { useFormContext, useFieldArray } from 'react-hook-form'

import { usePaymodeMasterData } from '../../../../../PayModeMaster/hooks_api/usePaymodeMasterData'
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

function MopDetailForm() {
  // Central form control access

  const { paymodeMasterData, isLoading } = usePaymodeMasterData()
  const mode = useStoreMasterStore((state) => state.mode)
  const { control, setValue } = useFormContext()
  const storeId = useStoreMasterDataStore((state) => state.currentStoreMasterId)
  const { storeMaster, isLoading: storeLoading } = useStoreMasterById(Number(storeId))
  // Field array to manage dynamic rows in mopValues
  const { fields, append, remove, replace } = useFieldArray({
    control,
    name: 'objPayMode', // Ensure this matches combined schema path exactly
  })

  const payModeOptions = useMemo(() => {
    if (!paymodeMasterData || paymodeMasterData.length === 0) return []

    return paymodeMasterData.map((paymode) => ({
      value: paymode.paymentModeName || '', // Ensure a fallback value
      label: paymode.paymentModeName || 'Unknown', // Prevent UI crash if value is undefined
      id: paymode.paymentModeID || 0, // Ensure an ID is always available
    }))
  }, [paymodeMasterData])

  useEffect(() => {
    if (mode === 'Edit' && storeMaster?.objPayMode) {
      replace(
        storeMaster.objPayMode.map((pm) => ({
          payMode: pm.paymentModeName || '',
          paymentCode: String(pm.paymentModeID) || '',
          crossStore: pm.isCrossStoreUsage || 'N',
          ledgersName: pm.ledgerName || '',
          ledgersCode: pm.ledgerCode || '',
          subLedgerName: pm.subLedgerName || '',
          subLedgerCode: pm.subLedgerCode || '',
          discontinue: pm.discontinued || 'N',
        }))
      )
    }
  }, [storeMaster, mode, replace, setValue]) // <- Added setValue

  const ledgerOptions = [
    { value: 'Ledger 1', code: 'LEDGER001', name: 'Ledger 1' },
    { value: 'Ledger 2', code: 'LEDGER002', name: 'Ledger 2' },
    { value: 'Ledger 3', code: 'LEDGER003', name: 'Ledger 3' },
  ]

  const subLedgerOptions = [
    { value: 'SubLedger 1', code: 'SUBLEDGER001', name: 'SubLedger 1' },
    { value: 'SubLedger 2', code: 'SUBLEDGER002', name: 'SubLedger 2' },
  ]

  console.log(payModeOptions)

  return (
    <div className="border p-4 border-black border-solid h-[580px] overflow-y-auto">
      {/* Table Headers */}
      <div className="form-head mb-4">
        <ul className="grid grid-cols-6 gap-3">
          <li className="text-sm font-semibold">
            Paymode Name <span className="text-primary">*</span>
          </li>
          <li className="text-sm font-semibold">Paymode Code</li>
          <li className="text-sm font-semibold">Cross Store Usage</li>
          <li className="text-sm font-semibold">
            Ledger <span className="text-primary">*</span>
          </li>
          <li className="text-sm font-semibold">Control Account</li>
          <li className="text-sm font-semibold">Discontinued</li>
        </ul>
      </div>

      {fields.map((item, index) => (
        <div key={item.id} className="grid grid-cols-6 gap-3 mb-3 ">
          {/* Paymode Name */}
          <FormField
            control={control}
            name={`objPayMode.${index}.payMode`}
            render={({ field }) => (
              <Select
                value={field.value || ''} // Ensure value binding
                onValueChange={(value) => {
                  field.onChange(value)
                  const selectedPayMode = payModeOptions.find((pm) => pm.value === value)

                  // Ensure updating correctly
                  setValue(
                    `objPayMode.${index}.paymentCode`,
                    selectedPayMode?.id ? String(selectedPayMode.id) : ''
                  )
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder={isLoading ? 'Loading...' : 'Select Paymode Name'} />
                </SelectTrigger>
                <SelectContent>
                  {isLoading ? (
                    <p className="p-2 text-gray-500">Loading...</p>
                  ) : (
                    payModeOptions.map((pm) => (
                      <SelectItem key={pm.id} value={pm.value} >
                        {pm.label}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            )}
          />

          {/* Paymode Code (Auto-Populated) */}
          <FormField
            control={control}
            name={`objPayMode.${index}.paymentCode`}
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input placeholder="Auto-Populated Code" readOnly {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Cross Store Usage */}
          <FormField
            control={control}
            name={`objPayMode.${index}.crossStore`}
            render={({ field }) => (
              <Checkbox
                className="mt-2"
                checked={field.value === 'Y'} // Check if value is 'Y' (true)
                onCheckedChange={(checked) => field.onChange(checked ? 'Y' : 'N')} // Map true/false to 'Y'/'N'
              />
            )}
          />

          {/* Ledger */}
          <FormField
            control={control}
            name={`objPayMode.${index}.ledgersName`}
            render={({ field }) => (
              <Select
                value={field.value} // Yeh bind karega existing data
                defaultValue={field.value} // Yeh ensure karega ki dropdown me sahi value dikhaye
                onValueChange={(value) => {
                  field.onChange(value)
                  const selectedLedger = ledgerOptions.find((l) => l.name === value)
                  setValue(`objPayMode.${index}.ledgersCode`, selectedLedger?.code || '')
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Ledger" />
                </SelectTrigger>
                <SelectContent>
                  {ledgerOptions.map((ledger) => (
                    <SelectItem key={ledger.code} value={ledger.name}>
                      {ledger.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />

          {/* Sub Ledger */}
          <FormField
            control={control}
            name={`objPayMode.${index}.subLedgerName`}
            render={({ field }) => (
              <Select
                value={field.value} // Yeh bind karega existing data
                defaultValue={field.value} // Yeh ensure karega ki dropdown me sahi value dikhaye
                onValueChange={(value) => {
                  field.onChange(value)
                  const selectedSubLedger = subLedgerOptions.find((sl) => sl.name === value)
                  setValue(`objPayMode.${index}.subLedgerCode`, selectedSubLedger?.code || '')
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Sub Ledger" />
                </SelectTrigger>
                <SelectContent>
                  {subLedgerOptions.map((subLedger) => (
                    <SelectItem key={subLedger.code} value={subLedger.name}>
                      {subLedger.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          <div className="flex gap-6 ">
            <FormField
              control={control}
              name={`objPayMode.${index}.discontinue`}
              render={({ field }) => (
                <Checkbox
                  className="mt-2 ms-4"
                  checked={field.value === 'Y'} // Check if value is 'Y' (true)
                  onCheckedChange={(checked) => field.onChange(checked ? 'Y' : 'N')} // Map true/false to 'Y'/'N'
                />
              )}
            />
            {/* Remove Row Button */}
            <div className="grid grid-cols-1 gap-3 mb-3">
              <Button size="icon" type="button" onClick={() => remove(index)}>
                <Trash size="15" />
              </Button>
            </div>
          </div>
        </div>
      ))}

      <ul className="flex items-center gap-3 justify-end mt-4">
        <li>
          <Button type="button">Copy from Site</Button>
        </li>
        <li>
          <Button
            type="button"
            onClick={() =>
              append({
                payMode: '',
                ledgersName: '',
                ledgersCode: '',
                paymentCode: '',
                subLedgerCode: '',
                subLedgerName: '',
                crossStore: 'N',
                discontinue: 'N',
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

export default MopDetailForm
