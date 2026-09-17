import { useFormContext } from 'react-hook-form'

import { Checkbox } from '@/components/ui/checkbox'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Textarea } from '@/components/ui/textarea'


function CommunicationTab() { 

  const { control } = useFormContext()
  return (
    <div className='space-y-3'>
    {/* Address */}
    <FormField
      control={control}
      name="communication.address"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Address</FormLabel>
          <FormControl>
            <Textarea placeholder="Enter address" {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />

    <div className="grid grid-cols-3 gap-4 items-center">
      {/* Area */}
      <FormField
        control={control}
        name="communication.area"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Area</FormLabel>
            <FormControl>
              <Input placeholder="Enter area" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* City */}
      <FormField
        control={control}
        name="communication.city"
        render={({ field }) => (
          <FormItem>
            <FormLabel>City</FormLabel>
            <FormControl>
              <Input placeholder="Enter city" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* PIN */}
      <FormField
        control={control}
        name="communication.pin"
        render={({ field }) => (
          <FormItem>
            <FormLabel>PIN</FormLabel>
            <FormControl>
              <Input type='number' placeholder="Enter PIN" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* State */}
      <FormField
        control={control}
        name="communication.state"
        render={({ field }) => (
          <FormItem>
            <FormLabel>State</FormLabel>
            <FormControl>
              <Input placeholder="Enter state" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Email */}
      <FormField
        control={control}
        name="communication.email"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Email</FormLabel>
            <FormControl>
              <Input type="email" placeholder="Enter email" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

    
      {/* Preferred Communication Mode */}
      <FormField
        control={control}
        name="communication.preferredCommunication"
        render={({ field }) => (
          <FormItem className="flex flex-col gap-3 ">
            <FormLabel>Preferred Communication Mode</FormLabel>
            <RadioGroup
              onValueChange={field.onChange}
              defaultValue={field.value}
              value={field.value}
              className="flex space-x-4 roles-radio"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="sms" id="sms" />
                <FormLabel htmlFor="sms">SMS</FormLabel>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="email" id="email" />
                <FormLabel htmlFor="email">Email</FormLabel>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="whatsapp" id="whatsapp" />
                <FormLabel htmlFor="whatsapp">WhatsApp</FormLabel>
              </div>
            </RadioGroup>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
    <FormField
      control={control}
      name="communication.receivePushMessage"
      render={({ field }) => (
        <FormItem className="flex items-center space-x-4 ">
          <FormControl>
            <Checkbox checked={field.value} onCheckedChange={field.onChange} />
          </FormControl>
          <FormLabel>Agree to Receive Push Message</FormLabel>
          <FormMessage />
        </FormItem>
      )}
    />
    {/* Agree to Receive Push Message */}
 </div>
  )
}

export default CommunicationTab
