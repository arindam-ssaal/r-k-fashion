import { Trash } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useFieldArray, useFormContext } from 'react-hook-form'

import { GetAPI } from '../../../../../../../../../../../src/services/apiCall'
import { useStoreMasterById } from '../../../../hooks_api/useFetchStoreMasterById'
import { useStoreMasterDataStore } from '../../../../store/useStoreMasterDataStore'
import useStoreMasterStore from '../../../../store/useStoreMasterStore'

import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const LedgersDetailsForm = () => {
  const [ledData, setLedData] = useState([])
  const [subledData, setSubLedData] = useState([])
  const { control, setValue, watch } = useFormContext()
  const mode = useStoreMasterStore((state) => state.mode)
  const storeId = useStoreMasterDataStore((state) => state.currentStoreMasterId)
  const { storeMaster } = useStoreMasterById(Number(storeId))

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'objLedger',
  })

  const ledgerOptions = [
    { code: 'LEDGER001', name: 'Salary Expenses' },
    { code: 'LEDGER002', name: 'Travelling Expenses' },
    { code: 'LEDGER003', name: 'Internet Charges' },
    { code: 'LEDGER004', name: 'Rent' },
    { code: 'LEDGER005', name: 'Maintenance Charges' },
    { code: 'LEDGER006', name: 'Annual Maintenance Charges' },
  ]

  const subLedgerOptions = [
    { code: 'SUBLEDGER001', name: 'SubLedger 1', parentLedgerCode: 'LEDGER001' },
    { code: 'SUBLEDGER002', name: 'SubLedger 2', parentLedgerCode: 'LEDGER002' },
  ]

  const costCenterOptions = [
    { code: 'COST001', name: 'Cost Center 1' },
    { code: 'COST002', name: 'Cost Center 2' },
  ]

  // Populate existing data in edit mode
  useEffect(() => {
    if (mode === 'Edit' && storeMaster?.objLedger) {
      setValue('objLedger', storeMaster.objLedger)
    }
  }, [mode, storeMaster, setValue])

  const fetchSubLedData = async () => {
    try {
      const PJsonData = {}
      const PType = ''
      const responseJson = await GetAPI(
        '/api/Ledger/GetAllSubLedger?LedgerCode=10020201',
        PType,
        PJsonData
      )
      const freshData = responseJson.data || []

      setSubLedData(freshData)
      console.log(freshData)
    } catch (error) {
      console.error('Error fetching ledger data:', error)
      setSubLedData([])
    }
  }

  useEffect(() => {
    fetchSubLedData()
  }, [])

  const fetchLedData = async () => {
    try {
      const PJsonData = {}
      const PType = ''
      const responseJson = await GetAPI('/api/Ledger/GetAllLedger', PType, PJsonData)
      const freshData = responseJson.data || []

      setLedData(freshData)
      console.log(freshData)
    } catch (error) {
      console.error('Error fetching ledger data:', error)
      setLedData([])
    }
  }

  useEffect(() => {
    fetchLedData()
  }, [])

  return (
    <div className="border p-4 border-black border-solid h-[580px] overflow-y-auto">
      <div className="form-head mb-4">
        <ul className="grid grid-cols-4 gap-3 ">
          <li className="text-sm font-semibold">Ledger Name *</li>
          <li className="text-sm font-semibold">Sub Ledger Name</li>
          <li className="text-sm font-semibold">Cost Centre</li>
          <li className="text-sm font-semibold">Discontinued</li>
        </ul>
      </div>

      {fields.map((item, index) => (
        <div key={item.id} className="grid grid-cols-4 gap-5 mb-3">
          {/* Ledger */}
          <FormField
            control={control}
            name={`objLedger.${index}.ledgerName`}
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Select
                    onValueChange={(value) => {
                      const selectedLedger = ledData.find((ledger) => ledger.ledgerName === value)
                      field.onChange(selectedLedger?.ledgerName || '')
                      setValue(`objLedger.${index}.ledgerCode`, selectedLedger?.ledgerCode || '')
                      setValue(`objLedger.${index}.subLedgerName`, '')
                      setValue(`objLedger.${index}.subLedgerCode`, '')
                    }}
                    value={field.value || ''}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Ledger" />
                    </SelectTrigger>
                    <SelectContent>
                      {ledData.map((ledger) => (
                        <SelectItem key={ledger.ledgerCode} value={ledger.ledgerName}>
                          {ledger.ledgerName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* SubLedger */}
          <FormField
            control={control}
            name={`objLedger.${index}.subLedgerName`}
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Select
                    onValueChange={(value) => {
                      const selectedSubLedger = subledData.find(
                        (subLedger) => subLedger.subLedgerName === value
                      )
                      field.onChange(selectedSubLedger?.subLedgerName || '')
                      setValue(`objLedger.${index}.subLedgerCode`, selectedSubLedger?.subLedgerCode || '')
                    
                      // setValue(`objLedger.${index}.subLedgerName`, '')
                      // setValue(`objLedger.${index}.subLedgerCode`, '')
                    }}
                    value={field.value || ''}
                    // disabled={!watch(`objLedger.${index}.subLedgerCode`)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select SubLedger" />
                    </SelectTrigger>
                    <SelectContent>
                      {subledData.map((subLedger) => (
                        <SelectItem key={subLedger.subLedgerCode} value={subLedger.subLedgerName}>
                          {subLedger.subLedgerName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name={`objLedger.${index}.costCenterName`}
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Select
                    onValueChange={(value) => {
                      const selectedCostCenter = costCenterOptions.find(
                        (costCenter) => costCenter.name === value
                      )
                      field.onChange(selectedCostCenter?.name || '')
                      setValue(`objLedger.${index}.costCenterCode`, selectedCostCenter?.code || '')
                    }}
                    value={field.value || ''}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Cost Center" />
                    </SelectTrigger>
                    <SelectContent>
                      {costCenterOptions.map((costCenter) => (
                        <SelectItem key={costCenter.code} value={costCenter.name}>
                          {costCenter.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex gap-5">
            <FormField
              control={control}
              name={`objLedger.${index}.discontinue`}
              render={({ field }) => (
                <FormItem className="flex items-center justify-center">
                  <FormControl>
                    <Checkbox
                      checked={field.value === 'Y'}
                      onCheckedChange={(checked) => field.onChange(checked ? 'Y' : 'N')}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button size="icon" type="button" onClick={() => remove(index)}>
              <Trash size="15" />
            </Button>
          </div>
        </div>
      ))}

      <ul className="flex items-center gap-3 justify-end mt-5">
        <li>
          <Button type="button">Copy from Site</Button>
        </li>
        <li>
          <Button
            type="button"
            onClick={() =>
              append({
                ledgerName: '',
                ledgerCode: '',
                subLedgerName: '',
                subLedgerCode: '',
                costCenterName: '',
                costCenterCode: '',
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

export default LedgersDetailsForm
