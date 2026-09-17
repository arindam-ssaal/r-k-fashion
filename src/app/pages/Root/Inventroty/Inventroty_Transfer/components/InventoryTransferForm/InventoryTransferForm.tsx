import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import useInventoryTransferStore from '../../store/useInventoryTransferStore'

import MultiSelectionPopUp from '@/components/MultiSelectionPopUp'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'

// Define schema for the form
const formSchema = z.object({
  username: z.string().min(2, {
    message: 'Username must be at least 2 characters.',
  }),
})

function InventoryTransferForm() {
 const closeModal = useInventoryTransferStore((state) => state.close)
  // Initialize form with react-hook-form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: '',
    },
  })

  // const data=[
  //   {
  //     id:1,
  //     value:"val1",
  //     data:"dat1"
  //   },
  //   {
  //     id:2,
  //     value:"val2",
  //     data:"dat2"
  //   },
  //   {
  //     id:3,
  //     value:"val3",
  //     data:"dat3"
  //   },
  //   {
  //     id:4,
  //     value:"val4",
  //     data:"dat4"
  //   },
  // ]

  

  // Handle form submission
  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values)
  }



  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2 ">
                Username
                <MultiSelectionPopUp   />
              
              </FormLabel>
              <FormControl>
                <Input placeholder="Select an item" {...field} readOnly />
              </FormControl>
              <FormDescription>This is your public display name.</FormDescription>
              <FormMessage />
             
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
        <Button className="m-3"  onClick={closeModal}>Cancel</Button>
      </form>
    </Form>
  )
}

export default InventoryTransferForm
