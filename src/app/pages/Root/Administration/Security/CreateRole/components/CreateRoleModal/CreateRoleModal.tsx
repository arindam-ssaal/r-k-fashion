// import { zodResolver } from '@hookform/resolvers/zod'
// import { useForm } from 'react-hook-form'
// import { z } from 'zod'

// import { GetAPI,PostAPI } from '../../../../../../../../services/apiCall'; // 🔁 Make sure this path is correct
import RoleDefinationForm from '../../../RoleDefination/components/RoleDefinationForm'
import { useCreateRoleStore } from '../../store/useCreateRoleStore'

//import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  //DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
//import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form'
//import { Input } from '@/components/ui/input'

// ✅ Schema validation
// const formSchema = z.object({
//   roleID: z.string().min(2, { message: 'Role ID must be at least 2 characters.' }),
//   roleName: z.string().min(2, { message: 'Role Name must be at least 2 characters.' }),
// })

// type FormValues = z.infer<typeof formSchema>

function DesignationModal() {
  const isOpen = useCreateRoleStore((state) => state.isOpen)
  const closeModal = useCreateRoleStore((state) => state.close)
  const mode = useCreateRoleStore((state) => state.mode)

  // const form = useForm<FormValues>({
  //   resolver: zodResolver(formSchema),
  //   defaultValues: {
  //     roleID: '',
  //     roleName: '',
  //   },
  // })

  // ✅ Submit handler with PostAPI
  // const onSubmit = async (values: FormValues) => {
  //   console.log('Form values:', values)
  //   const formData = {
  //     // "roleID": 0,
  //     // "roleName": "string",
  //     // "isActive": "Y",
  //     // "remarks": "string",
  //     // "enteredBy": 0,
  //     // "usedFor": "U",
  //     // "objRoleWiseMenu": [
  //     //   {
  //     //     "roleID": 0,
  //     //     "menuID": 0,
  //     //     "objMenuWiseAction": [
  //     //       {
  //     //         "roleID": 0,
  //     //         "menuID": 0,
  //     //         "actionID": 0,
  //     //         "checked": "string"
  //     //       }
  //     //     ]
  //     //   }
  //     // ]
  //   };

  //   try {
  //     let cookies = '';
  //     const response = await PostAPI('/api/Role/PostRole', '', formData, cookies);

  //     // ☑️ Check for success if API returns status
  //     if (response?.data?.[0]?.returnCode === 'Y') {
  //       console.log('Saved:', response.data)
  //       closeModal()
  //     } else {
  //       console.error('Error:', response?.data?.[0]?.returnMsg || 'Unknown error')
  //     }
  //   } catch (error) {
  //     console.error('Failed to save:', error)
  //   }
  // }

  return (
<Dialog open={isOpen} onOpenChange={(open) => {
  if (!open) closeModal()
}}>      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>{mode} Role Master</DialogTitle>
        </DialogHeader>
        <RoleDefinationForm onClose={closeModal} mode={mode} />


        {/* <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="roleID"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role ID</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter role ID" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="roleName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter role name" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <DialogFooter className="pt-4">
              <Button type="submit">Submit</Button>
              <Button type="button" variant="outline" onClick={closeModal}>
                Cancel
              </Button>
            </DialogFooter>
          </form>
        </Form> */}
      </DialogContent>
    </Dialog>
  )
}

export default DesignationModal
