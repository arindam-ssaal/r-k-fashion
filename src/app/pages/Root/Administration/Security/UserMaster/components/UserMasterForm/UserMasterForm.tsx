import { zodResolver } from '@hookform/resolvers/zod'
import { useState, useEffect } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { z } from 'zod'

import AllocateStore from './AllocateStore'
import { userMasterSchema } from './schema/userMasterSchema'
import { UserMasterFormatter } from '../../helper/UserMasterFormatter'
import { useCreateUsermasterGeneral } from '../../hooks_api/useCreateUsermasterGeneral'
import { useUserMasterData } from '../../hooks_api/useUserMasterData'
import { useUserMasterDataStore } from '../../store/useUserMasterDataStore'
import { useUserMasterStore } from '../../store/useUserMasterStore'

import GlobalViewerLoader from '@/components/GlobalViewerLoader'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

function UserMasterForm() {
  const mode = useUserMasterStore((state) => state.mode)
  const userMasterId = useUserMasterDataStore((state) => state.currentUserMasterId)
  const {
    userMasterData: fetchedUserData,
    isLoading: usermasterLoading,
    error: usermasterError,
  } = useUserMasterData(Number(userMasterId))
  const { createUsermasterGeneral } = useCreateUsermasterGeneral()
  const { userMasterData, isLoading } = useUserMasterData()
  const closeModal = useUserMasterStore((state) => state.close)
  const clearId = useUserMasterDataStore((state) => state.clearCurrentUserMasterId)
  const [objStore, setObjStore] = useState<Record<string, unknown>[]>([])

  const formMethods = useForm<z.infer<typeof userMasterSchema>>({
    resolver: zodResolver(userMasterSchema),
    mode: 'onChange',
    defaultValues: {
      userName: '',
      loginId: '',
      password: '',
      confirmPassword: '',
      defineProfile: '',
      defineRole: '',
      employeeId: '',
      mobileNo: '',
      whatsappNo: '',
      email: '',
      remarks: '',
      isActive: false,
    },
  })

  useEffect(() => {
    if (
      (mode === 'View' || mode === 'Edit') &&
      fetchedUserData &&
      Array.isArray(fetchedUserData) &&
      fetchedUserData[0]
    ) {
      formMethods.reset({
        userName: fetchedUserData[0].userName || '',
        loginId: fetchedUserData[0].loginID || '',
        password: '',
        confirmPassword: '',
        defineProfile: fetchedUserData[0].profileID || '',
        defineRole: fetchedUserData[0].defineRole || '',
        employeeId: fetchedUserData[0].employeeID || '',
        mobileNo: fetchedUserData[0].mobileNo || '',
        whatsappNo: fetchedUserData[0].whatsappNo || '',
        email: fetchedUserData[0].email || '',
        remarks: fetchedUserData[0].remarks || '',
        isActive: fetchedUserData[0].isActive || false,
      })
    }
  }, [fetchedUserData, mode, formMethods])

  async function onSubmit(data: z.infer<typeof userMasterSchema>) {
    try {
      const formattedData = UserMasterFormatter(
        {
          ...data,
          loginID: data.loginId,
          profileID: Number(data.defineProfile),
          roleID: Number(data.defineRole),
          defaultStoreID: 1,
          enteredBy: 0,
          objStore,
          mobile: data.mobileNo,
          whatsApp: data.whatsappNo,
          employeeID: data.employeeId,
        },
        String(userMasterData?.[0]?.loginID)
      )
      await createUsermasterGeneral(formattedData)
      console.log(formattedData)
      closeModal()
      clearId()
    } catch (err) {
      if (err instanceof Error) {
        throw new Error(err.message)
      }
    }
  }

  if (usermasterLoading) {
    return <GlobalViewerLoader />
  }
  if (usermasterError && mode === 'View') {
    return <h3>Sorry there is some problem</h3>
  }

  if (isLoading) {
    return <GlobalViewerLoader />
  }

  return (
    <FormProvider {...formMethods}>
      <form
        id="user-master-form"
        onSubmit={formMethods.handleSubmit(onSubmit)}
        className="space-y-4 h-full overflow-y-auto"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <FormField
            control={formMethods.control}
            name="userName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Name <span className="text-primary">*</span>
                </FormLabel>
                <FormControl>
                  <Input placeholder="Name here" {...field} required />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={formMethods.control}
            name="loginId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Login Id <span className="text-primary">*</span>
                </FormLabel>
                <FormControl>
                  <Input placeholder="Login Id" {...field} disabled={mode === 'View'} required />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={formMethods.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Password <span className="text-primary">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Password"
                    {...field}
                    disabled={mode === 'View'}
                    required
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={formMethods.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Confirm Password <span className="text-primary">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Confirm Password"
                    {...field}
                    disabled={mode === 'View'}
                    required
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={formMethods.control}
            name="defineProfile"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Define Profile <span className="text-primary">*</span>
                </FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
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
          <FormField
            control={formMethods.control}
            name="defineRole"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Define Role <span className="text-primary">*</span>
                </FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a Role..." />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="adminHead">Admin Head</SelectItem>
                    <SelectItem value="storeManager">Store Manager</SelectItem>
                    <SelectItem value="productionHead">Production Head</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={formMethods.control}
            name="employeeId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Employee Id</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose emp id..." />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="profile1">Emp 1</SelectItem>
                    <SelectItem value="profile2">Emp 2</SelectItem>
                    <SelectItem value="profile3">Emp 3</SelectItem>
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />
          <FormField
            control={formMethods.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Email <span className="text-primary">*</span>
                </FormLabel>
                <FormControl>
                  <Input placeholder="Email" {...field} disabled={mode === 'View'} required />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={formMethods.control}
            name="mobileNo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mobile No</FormLabel>
                <FormControl>
                  <Input placeholder="Mobile No" {...field} disabled={mode === 'View'} required />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={formMethods.control}
            name="whatsappNo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>WhatsApp No</FormLabel>
                <FormControl>
                  <Input placeholder="WhatsApp No" {...field} disabled={mode === 'View'} required />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={formMethods.control}
            name="remarks"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Remarks</FormLabel>
                <FormControl>
                  <textarea
                    {...field}
                    placeholder="Type here..."
                    className="mt-1 p-2 border rounded-md w-full"
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={formMethods.control}
            name="isActive"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Inactive</FormLabel>
                <FormControl>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        {...field}
                        value="true"
                        checked={field.value === true}
                      />
                    </label>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex flex-col gap-4 mt-4">
          <AllocateStore value={objStore} onChange={setObjStore} />
        </div>

      </form>
    </FormProvider>
  )
}
export default UserMasterForm