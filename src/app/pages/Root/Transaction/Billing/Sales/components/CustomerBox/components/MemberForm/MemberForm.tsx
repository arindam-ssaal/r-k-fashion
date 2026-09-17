import { useState, useEffect, ChangeEvent, FormEvent, useCallback, memo } from 'react'

import CreateCustomerBtn from './components/CreateCutomerBtn'
import CustomerHistory from './components/CustomerHistory'
import useMemberStore from './store/useMemberFormStore' // Zustand store

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import useFocusOnKeyPress from '@/hooks/useFocusOnKeyPress'
import { fetchCustomerByPhone } from '@/services/customerClient'

function MemberForm() {
  const [phoneNo, setPhoneNo] = useState('') // Only state for phone number
  const [errorMessage, setErrorMessage] = useState('')
  const [isNewCustomer, setIsNewCustomer] = useState(false)
  const [isCreateCustomerOpen, setIsCreateCustomerOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const saveMemberInfo = useMemberStore((state) => state.saveMemberInfo)
  const memberId = useMemberStore((state) => state.memberId)
  const memberName = useMemberStore((state) => state.memberName)

  // Focus on the phoneNo input initially and on F4 key press
  const phoneNoRef = useFocusOnKeyPress<HTMLInputElement>('F4', (input) => input?.focus(), true)

  // Handle phone number input changes
  const handleChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target
    setPhoneNo(value)
    setErrorMessage('')
  }, [])

  // Fetch customer data when phone number changes
  useEffect(() => {
    if (phoneNo.length === 10) {
      setIsLoading(true)
      fetchCustomerByPhone(phoneNo)
        .then((customer) => {
          if (customer) {
            setIsNewCustomer(false)
            saveMemberInfo(phoneNo, customer.memberId, customer.memberName)
            setErrorMessage('')
          } else {
            setIsNewCustomer(true)
            setErrorMessage('Customer not found. Do you want to create a new one?')
            saveMemberInfo(null, null, null)
          }
        })
        .catch(() => {
          setErrorMessage('Error fetching customer data. Please try again.')
          saveMemberInfo(null, null, null)
        })
        .finally(() => {
          setIsLoading(false)
        })
    } else if (phoneNo.length > 0 && phoneNo.length < 10) {
      setErrorMessage('Invalid phone number format. It must be 10 digits.')
      saveMemberInfo(null, null, null)
    } else {
      setErrorMessage('')
      saveMemberInfo(null, null, null)
    }
  }, [phoneNo, saveMemberInfo])

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    setIsCreateCustomerOpen(true)
  }

  // Close the create customer modal
  const handleCloseModal = () => {
    setIsCreateCustomerOpen(false)
  }

  return (
    <form className="flex flex-wrap gap-3 mt-2" onSubmit={handleSubmit}>
      {/* Member Phone Number Field */}
      <Label className="flex flex-col gap-2">
        Phone Number
        <Input
          ref={phoneNoRef}
          placeholder="Enter Phone Number"
          onChange={handleChange}
          value={phoneNo}
          name="phoneNo"
        />
        {errorMessage && <p className="text-red-500">{errorMessage}</p>}
      </Label>

      {/* Show Loading Spinner */}
      {isLoading && (
        <div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-loader-circle animate-spin"
          >
            <path d="M21 12a9 9 0 1 1-6.219-8.56" />
          </svg>
        </div>
      )}

      {/* Render Customer Info from Zustand Store */}
      {phoneNo.length === 10 && memberName && !isNewCustomer && !isLoading && (
        <>
          <Label className="flex flex-col gap-2">
            Member Name
            <Input placeholder="Enter Member name" value={memberName ?? ''} disabled />
          </Label>
          <Label className="flex flex-col gap-2">
            Member Id
            <Input placeholder="Enter Member Id" value={memberId ?? ''} disabled />
          </Label>
          <Label className="flex flex-col gap-2">
            Created At
            <Input placeholder="Created At" value={'22/33/2023'} disabled />
          </Label>
          <div className="ml-auto flex flex-col">
            <CustomerHistory />
          </div>
        </>
      )}

      {/* Render Create Customer Button if new customer */}
      {phoneNo.length === 10 && isNewCustomer && !isLoading && (
        <div className="ml-auto flex flex-col">
          <MemoizedCreateCustomerBtn isOpen={isCreateCustomerOpen} onClose={handleCloseModal} />
        </div>
      )}
    </form>
  )
}

const MemoizedCreateCustomerBtn = memo(CreateCustomerBtn)

export default memo(MemberForm)
