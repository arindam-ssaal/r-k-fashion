import { FormEvent } from 'react'

import useSalesScannerState from './store/useSalesScannerState'

import { Input } from '@/components/ui/input'
import useFocusOnKeyPress from '@/hooks/useFocusOnKeyPress'

// { className}: { className?: string }

function SalesScanner() {
  const setScanID = useSalesScannerState((state) => state.setScanID)

  // Use the hook to focus on the input when F1 is pressed
  const inputRef = useFocusOnKeyPress<HTMLInputElement>(
    'F1',
    (input) => input?.focus(), // Focus action
    false // Focus initially
  )

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setScanID(inputRef.current?.value as string)
    if (inputRef.current) {
      inputRef.current.value = ''
    }
  }

  return (
    // <Card className='mt-auto'>
    //   <CardContent>

    //   </CardContent>
    // </Card>
    <div className="pt-4  border-b border-gray-100 ">
      <h2 className="heading-secondary mb-2">Scan Here</h2>
      <form onSubmit={handleSubmit}>
        <div className="grid w-full items-center gap-4">
          <div className="flex flex-col space-y-1.5">
            <Input ref={inputRef} id="name" placeholder="scan" className="uppercase" />
          </div>
        </div>
      </form>
    </div>
  )
}

export default SalesScanner
