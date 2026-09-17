import { Trash } from 'lucide-react'
import { useEffect } from 'react'
import { useFormContext, useFieldArray } from 'react-hook-form'

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

const DocumentSeriesDetailForm = () => {
  const { control, setValue } = useFormContext()
  const mode = useStoreMasterStore((state) => state.mode)
  const storeId = useStoreMasterDataStore((state) => state.currentStoreMasterId)
  const { storeMaster } = useStoreMasterById(Number(storeId))

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'objSeries',
  })

  // Populate existing data in edit mode
  useEffect(() => {
    if (mode === 'Edit' && storeMaster?.objSeries) {
      setValue('objSeries', storeMaster.objSeries)
    }
  }, [mode, storeMaster, setValue])

  return (
    <div className="border p-4 border-black border-solid h-[580px] overflow-y-auto">
      <div className="form-head mb-4">
        <ul className="grid grid-cols-6 gap-3">
          <li className="text-sm font-semibold">Transaction Type *</li>
          <li className="text-sm font-semibold">Series Name *</li>
          <li className="text-sm font-semibold">Prefix</li>
          <li className="text-sm font-semibold">No. of Digits *</li>
          <li className="text-sm font-semibold">Suffix</li>
          <li className="text-sm font-semibold">Discontinued</li>
        </ul>
      </div>

      {fields.map((item, index) => (
        <div key={item.id} className="grid grid-cols-6 gap-3 mb-3">
          <FormField
            control={control}
            name={`objSeries.${index}.transactionType`}
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Transaction Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Sale</SelectItem>
                      <SelectItem value="2">Purchase</SelectItem>
                      <SelectItem value="3">Return</SelectItem>
                      <SelectItem value="4">Transfer</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name={`objSeries.${index}.seriesName`}
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input placeholder="Series Name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name={`objSeries.${index}.prefix`}
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input placeholder="Prefix" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name={`objSeries.${index}.noOfDigit`}
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="No of Digits"
                    value={field.value || ''}
                    onChange={(e) => {
                      const value = e.target.value
                      field.onChange(value !== '' ? Number(value) : undefined)
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name={`objSeries.${index}.suffix`}
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input placeholder="Suffix" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-4 gap-3 mb-3">
            <FormField
              control={control}
              name={`objSeries.${index}.discontinued`}
              render={({ field }) => (
                <FormItem className="ms-auto me-auto">
                  <FormControl>
                    <div className="flex items-center mt-2">
                      <Checkbox
                        id={`discontinue-${index}`}
                        checked={field.value === 'Y'}
                        onCheckedChange={(checked) => field.onChange(checked ? 'Y' : 'N')}
                      />
                    </div>
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

      <ul className="flex item-center gap-3 justify-end mt-5">
        <li>
          <Button type="button">Copy from Site</Button>
        </li>
        <li>
          <Button
            type="button"
            onClick={() =>
              append({
                transactionType: '',
                seriesName: '',
                prefix: '',
                noOfDigit: '',
                suffix: '',
                discontinued: 'N',
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

export default DocumentSeriesDetailForm
