import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'

import { roledefinationSchemas } from './schemas/roledefinationSchemas'
import { PostAPI } from '../../../../../../../../services/apiCall'
import { useRoleDefination } from '../../store/useRoleDefination'

import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

function RoleDefinationForm({
  onClose,
  mode,
}: {
  onClose: () => void
  mode: 'Create' | 'Edit' | 'View'
}) {
  const isViewMode = mode === 'View'
  const rolesID = useRoleDefination((state) => state.currentRoleDefinationId)
 // const closeModal = useRoleDefination((state) => state.close)
  const [loading, setLoading] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const form = useForm<FormValues>({
    resolver: zodResolver(roledefinationSchemas),
    mode: 'onChange',
    defaultValues: {
      rolesID: '',
      roleName: '',
      defineProfile: '',
      details: '',
      remarks: '',
      enteredBy: 0,
      usedFor: 'I',
      objRoleWiseMenu: [],
    },
  })

  const [permissions, setPermissions] = useState<Record<string, boolean>>({
    Add: false,
    Edit: false,
    Delete: false,
    Authorize: false,
    UnAuthorize: false,
  })

 const onSubmit = async (values: FormValues) => {
  setLoading(true)
  const checkedActions = Object.entries(permissions).map(([action, isChecked], index) => ({
    rolesID: rolesID || 0,
    menuID: 0,
    actionID: index + 1,
    checked: isChecked ? 'true' : 'false', // ✅ now includes false values
  }))

  const formData = {
    rolesID: values.rolesID,
    roleName: values.roleName,
    defineProfile: values.defineProfile,
    isActive: 'Y',
    remarks: values.remarks,
    enteredBy: 0,
    usedFor: 'I',
    objRoleWiseMenu: [
      {
        rolesID: rolesID || 0,
        menuID: 0,
        objMenuWiseAction: checkedActions,
      },
    ],
  }

  try {
    const response = await PostAPI('/api/Role/PostRole', '', formData, rolesID, '')

    if (response?.data?.[0]?.returnCode === 'Y') {
      console.log('Saved:', response.data)
      form.reset()
       onClose()
     // closeModal()
    } else {
      console.error('Error:', response?.data?.[0]?.returnMsg || 'Unknown error')
    }
  } catch (error) {
    console.error('Failed to save:', error)
  }
  setLoading(false)
}


  const handleAllStateClear = () => {
    form.reset()
    onClose()
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 overflow-y-auto max-h-full">
        <div className="flex flex-col gap-4">
          {/* Role Name */}
          <FormField
            control={form.control}
            name="roleName"
            render={({ field }) => (
              <FormItem className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <FormLabel className="w-full sm:w-40">
                  Role Name <span className="text-primary">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Role Name"
                    className="w-full"
                    required
                    {...field}
                    disabled={isViewMode}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          {/* Define Profile */}
          <FormField
            control={form.control}
            name="defineProfile"
            render={({ field }) => (
              <FormItem className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <FormLabel className="w-full sm:w-40">
                  Define Profile <span className="text-primary">*</span>
                </FormLabel>
                <Select onValueChange={field.onChange} value={field.value} disabled={isViewMode}>
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Choose a profile..." />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="profile1">Profile 1</SelectItem>
                    <SelectItem value="profile2">Profile 2</SelectItem>
                    <SelectItem value="profile3">Profile 3</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Remarks */}
          <FormField
            control={form.control}
            name="remarks"
            render={({ field }) => (
              <FormItem className="flex flex-col sm:flex-row items-start gap-4">
                <FormLabel className="w-full sm:w-40">Details</FormLabel>
                <FormControl>
                  <textarea
                    {...field}
                    placeholder="Type here..."
                    className="mt-1 p-2 border rounded-md w-full"
                    disabled={isViewMode}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        <div className="flex flex-col lg:flex-row gap-6 m-3">
          {/* Menu Box */}
          <div className="p-6 mx-auto rounded-lg shadow-md w-full lg:w-1/2">
            <h1 className="text-xl lg:text-2xl font-semibold mb-4">Select Menu Option</h1>
            <p>Admin</p>
            <p>Setup</p>
            <p>Security</p>
          </div>

          {/* Permissions Box */}
          <div className="p-6 mx-auto rounded-lg shadow-md w-full lg:w-1/2">
            <h1 className="text-xl lg:text-2xl font-semibold mb-4">Select Permissions</h1>
            <div className="p-4 rounded-lg">
              <h2 className="text-lg font-medium mb-3">Menu Option: Profile</h2>
              <table className="w-full border rounded-md">
                <tbody>
                  {Object.entries(permissions).map(([key, value]) => (
                    <tr key={key} className="border-b last:border-b-0">
                      <td className="py-2 px-4 flex items-center justify-between">
                        <span>{key}</span>
                        <input
                          type="checkbox"
                          className="w-5 h-5 accent-blue-500"
                          checked={value}
                          onChange={(e) =>
                            setPermissions((prev) => ({
                              ...prev,
                              [key]: e.target.checked,
                            }))
                          }
                          disabled={isViewMode}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="mt-6 flex flex-col sm:flex-row justify-end gap-2">
          {!isViewMode && (
            <Button type="submit" onClick={() => setIsModalOpen(false)} className="w-full sm:w-auto" disabled={loading}>
               {loading ? 'Saving...' : 'Save'}
            </Button>
          )}
          <Button
            type="button"
            variant="secondary"
            className="w-full sm:w-auto"
            onClick={handleAllStateClear}
          >
            {isViewMode ? 'Close' : 'Cancel'}
          </Button>
        </div>
      </form>
    </Form>
  )
}

export default RoleDefinationForm
