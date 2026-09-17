import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { useChangePasswordStore } from '../../store/useChangePasswordStore'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import '../../../../../../../../style.css';

const formSchema = z.object({
  userName: z.string().min(2, {
    message: 'User Name must be at least 2 characters.',
  }),
  oldPassword: z.string().min(2, {
    message: 'Old Password must be at least 2 characters.',
  }),
  newPassword: z.string().min(2, {
    message: 'New Password must be at least 2 characters.',
  }),
  confirmPassword: z.string().min(2, {
    message: 'Confirm Password must be at least 2 characters.',
  }),
})

function ChangePasswordModal() {
  const closeModal = useChangePasswordStore((store) => store.close)
  // const [oldPassword,setoldPassword] = useState('');
  //const [newPassword,setnewPassword] = useState('');
  //const [confirmPassword,setconfirmPassword] = useState('');
  //const [visible, setVisible] = useState(false);
  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      userName: '',
      oldPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  })
  const oldPass =  form.watch("oldPassword") 
  console.log(oldPass)

  const mode = useChangePasswordStore((state) => state.mode)
  const isOpen = useChangePasswordStore((state) => state.isOpen)
  const modalMode = useChangePasswordStore((state) => state.mode)

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values)
  }

  return (
    <Dialog open={isOpen} onOpenChange={closeModal}>
      <DialogContent className="w-[95%] max-w-sm sm:max-w-md lg:max-w-lg p-4 sm:p-6">
        <DialogHeader>
          <DialogTitle className="text-base sm:text-lg lg:text-xl text-center sm:text-left">
            {mode} Change Password
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="userName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>User Name</FormLabel>
                  <FormControl>
                    <Input placeholder="User Name" {...field} disabled={modalMode === 'Create'} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="oldPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Old Password</FormLabel>
                  <FormControl>
                    <Input placeholder="Old Password" {...field} />
                    {/* <span onClick={() => setVisible(!visible)}>
                      {visible ? <Eye/> : <EyeOff />}

                    </span> */}
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Password</FormLabel>
                  <FormControl>
                    <Input placeholder="New Password" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <Input placeholder="Confirm Password" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
          </form>
        </Form>
        <DialogFooter className="flex flex-col sm:flex-row justify-end gap-3">
          <Button type="submit" className="w-full sm:w-auto">
            Create
          </Button>
          <Button type="button" variant="outline" className="w-full sm:w-auto text-c-white back-red-500 hover-back-red-100:hover" onClick={closeModal}>
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default ChangePasswordModal