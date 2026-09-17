import { Copy, Trash } from 'lucide-react'
import { useEffect , useState} from 'react'
import { useFieldArray, useFormContext } from 'react-hook-form'

import {GetAPI} from '../../../../../../../../../../../src/services/apiCall';
import { useStoreMasterById } from '../../../../hooks_api/useFetchStoreMasterById'
import { useStoreMasterDataStore } from '../../../../store/useStoreMasterDataStore'
import useStoreMasterStore from '../../../../store/useStoreMasterStore'

import { Button } from '@/components/ui/button'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

function LogisticDetailForm() {
  const [wareData, setWareData] = useState([]);
  const { control,getValues,setValue } = useFormContext()
  const mode = useStoreMasterStore((state) => state.mode)
  const storeId = useStoreMasterDataStore((state) => state.currentStoreMasterId)
  const { storeMaster } = useStoreMasterById(Number(storeId))

  const { fields, append, remove, replace } = useFieldArray({
    control,
    name: 'sourcingWarehouse', // This should match your schema path
  })

  useEffect(() => {
    if (mode === 'Edit' && storeMaster?.objWareHouse) {
      replace(
        storeMaster.objWareHouse.map((wh) => ({
          warehouseCode: wh.sourcingWarehouseCode || '',
          transitDays: wh.sourcingWarehouseName, // Default value
        }))
      )
    }
  }, [storeMaster, mode, replace])

  const copyBillingToShipping = () => {
    const billAddress = getValues("billToAddress");
    if (billAddress) {
      setValue("shipToAddress", billAddress, { shouldValidate: true });
    }
  };

  // Example Options for Dropdowns
  const cityOptions = [
    { value: 'kolkata', label: 'Kolkata' },
    { value: 'mumbai', label: 'Mumbai' },
    { value: 'delhi', label: 'Delhi' },
  ]

  const stateOptions = [
    { value: 'WB', label: 'West Bengal' },
    { value: 'MH', label: 'Maharashtra' },
    { value: 'DL', label: 'Delhi' },
  ]
  const warehouseOptions = [
    { code: 'WH001', name: 'Warehouse 1' },
    { code: 'WH002', name: 'Warehouse 2' },
    { code: 'WH003', name: 'Warehouse 3' },
  ]

  const fetchLedData = async () => {
    try {
      const PJsonData = {};
      const PType = '';
      //const responseJson = await GetAPI('http://dts.connectcloud365.com:53952/api/Whs/GetWarehouseDetails', PType, PJsonData);
      const responseJson = await GetAPI(`${import.meta.env.VITE_SERVER_DEV}`+'/api/Whs/GetWarehouseDetails', PType, PJsonData);
      const freshData = responseJson.data || [];

      setWareData(freshData);
      console.log(freshData);
      
    } catch (error) {
      console.error('Error fetching ledger data:', error);
      setWareData([]);
    }
  };

  useEffect(() => {
    
  
    fetchLedData();
  }, []);

  return (
    <div className="grid grid-cols-2 gap-3 border p-4 border-black border-solid h-[580px] overflow-y-auto">
      <div className="space-y-3">
        {/* Bill To Address */}
        <FormField
          control={control}
          name="billToAddress"
          render={({ field }) => (
            <FormItem>
              <div className=' flex justify-between'>
              <FormLabel>
                Bill To Address <span className="text-red-500">*</span>
              </FormLabel>
              <Copy color='red' size={15} onClick={copyBillingToShipping} />
              </div>
              
              <FormControl>
                <Input placeholder="Enter Billing Address" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Bill To City */}
        <FormField
          control={control}
          name="billToCity"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Bill To City <span className="text-red-500">*</span>
              </FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select City" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {cityOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="billToState"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Bill To State <span className="text-red-500">*</span>
              </FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select State" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {stateOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* City Field */}
        {/* Bill To Postal Code */}
        <FormField
          control={control}
          name="billToPostalCode"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Bill To Postal Code <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input type="text" placeholder="Enter Postal Code" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Contact Person */}
        <FormField
          control={control}
          name="contactPerson"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Contact Person <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input placeholder="Enter Contact Person Name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Contact Number */}
        <FormField
          control={control}
          name="contactNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Contact Number <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input type="tel" placeholder="Enter Contact Number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Email ID */}
        <FormField
          control={control}
          name="emailId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Email ID <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input type="email" placeholder="Enter Email Address" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <div className="space-y-3">
        {/* Ship To Address */}
        <FormField
          control={control}
          name="shipToAddress"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Ship To Address <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input placeholder="Enter Shipping Address" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Ship To Postal Code */}
        <FormField
          control={control}
          name="shipToPostalCode"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Ship To Postal Code <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input type="text" placeholder="Enter Postal Code" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Ship To City, Postal Code, and State */}
        {/* Ship To City */}
        <FormField
          control={control}
          name="shipToCity"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Ship To City <span className="text-red-500">*</span>
              </FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select City" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {cityOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Ship To State */}
        <FormField
          control={control}
          name="shipToState"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Ship To State <span className="text-red-500">*</span>
              </FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select State" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {stateOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="form-head mb-4">
          <FormLabel>Sourcing W/H</FormLabel>
          <div className="flex items-center mb-3 m-3">
            <div className="text-center flex-1">
              <h3 className="heading-secondary">Warehouse</h3>
            </div>
            <div className="flex-1 text-center">
              <h3 className="heading-secondary">Transit Days</h3>
            </div>
          </div>

          {fields.map((item, index) => (
            <div key={item.id} className="grid grid-cols-[1fr,1fr,50px] gap-3 items-center mb-3">
              {/* Warehouse Field */}
              <FormField
                control={control}
                name={`sourcingWarehouse.${index}.warehouseCode`}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Warehouse" />
                        </SelectTrigger>
                        <SelectContent>
                          {wareData.map((option) => (
                            <SelectItem key={option.whsCode} value={option.whsName}>
                              {option.whsName}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Transit Days Field */}
              <FormField
                control={control}
                name={`sourcingWarehouse.${index}.transitDays`}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        type="number"
                        min={1}
                        max={30}
                        placeholder="Transit Days"
                        {...field}
                        onChange={(e) =>
                          field.onChange(e.target.value ? Number(e.target.value) : '')
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Remove Row Button */}
              <div>
                <Button type="button" size={'icon'} onClick={() => remove(index)} className="">
                  <Trash size={'14'} />
                </Button>
              </div>
            </div>
          ))}

          {/* Add New Row Button */}
          <Button
            type="button"
            onClick={() => append({ warehouseCode: '', transitDays: 1 })} // Add a new row with default values
            className="mt-4"
          >
            Add Row
          </Button>
        </div>
      </div>
    </div>
  )
}

export default LogisticDetailForm
