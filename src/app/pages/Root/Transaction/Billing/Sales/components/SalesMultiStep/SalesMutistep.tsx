import { useEffect, useRef } from 'react'

import BillHistory from '../BillHistory'
import CustomerCreate from '../CustomerCreate'
import MemberDetails from '../MemberDetails'
import useSalesMultiStep from './store/useSalesMultistep'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'

function SalesMutistep() {
  const { step, nextStep, prevStep, setStep } = useSalesMultiStep()
  const hasUnmounted = useRef(false) // To track if the component has unmounted

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowRight' || event.key === 'Enter') {
        // Navigate to the next step (if not on the last step)
        if (step < 3) {
          nextStep()
        }
      } else if (event.key === 'ArrowLeft' || event.key === 'Backspace') {
        // Navigate to the previous step (if not on the first step)
        if (step > 1) {
          prevStep()
        }
      } else if (event.key === 'F4') {
        // Navigate directly to step 1 (Customer Creation) when F4 is pressed
        setStep(1)
      }
    }

    // Attach the event listener for keydown
    document.addEventListener('keydown', handleKeyDown)

    // Cleanup function
    return () => {
      document.removeEventListener('keydown', handleKeyDown)

      // Check if component is unmounting
      if (!hasUnmounted.current) {
        hasUnmounted.current = true
        // Reset the step to 1 only when the component is unmounted
        setStep(1)
      }
    }
  }, [step, nextStep, prevStep, setStep])

  // Helper function to render the content based on the current step
  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <Card>
            <CardHeader>
              <h3 className="heading-secondary">Customer Detail</h3>
            </CardHeader>
            <CardContent>
              <CustomerCreate />
            </CardContent>
          </Card>
        )
      case 2:
        return <BillHistory />
      case 3:
        return <MemberDetails />
      default:
        return <div className="box-1">Customer Creation</div>
    }
  }
  return (
    <Card className="b-none shadow-none ">
      <CardContent className="p-0">
        <div className="content" key={step}>
          {renderStepContent()}
        </div>
        <div className="btns mt-4">
          <ul className="flex space-x-4">
            {/* Disable Prev button if on the first step */}
            <li>
              <Button disabled={step === 1} onClick={prevStep}>
                Prev
              </Button>
            </li>
            {/* Disable Next button if on the last step (assuming 3 steps for now) */}
            <li>
              <Button disabled={step === 3} onClick={nextStep}>
                Next
              </Button>
            </li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}

export default SalesMutistep
