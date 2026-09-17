import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { useForm, FormProvider } from 'react-hook-form'

import { promotionDataFormatter } from '../../helpers/promotionDataFormatter'
import { useCreatePromotion } from '../../hooks_api/useCreatePromotion'
import { usePromotionData } from '../../hooks_api/usePromotionData'
import { promotionSetupSchema } from '../../schema'
import { usePromotionSetupStore } from '../../store/usePromotionSetupStore'
import { usePromotionSetupDataStore } from '../../store/usePromotionSetupStoreData'
import PromotionForm1 from '../PromotionForm1'
import PromotionForm2 from '../PromotionForm2'

import { Button } from '@/components/ui/button'

function PromotionSetupForm() {
  const next = usePromotionSetupStore((state) => state.next)
  const prev = usePromotionSetupStore((state) => state.prev)
  const closeModal = usePromotionSetupStore((state) => state.close)
  const step = usePromotionSetupStore((state) => state.step)
  const { createPromotionAsync, isPending } = useCreatePromotion()
  const selectedPromotionID = usePromotionSetupDataStore((state) => state.currentPromotionSetupId)
  const { promotionData, isLoading } = usePromotionData(Number(selectedPromotionID))
  const mode = usePromotionSetupStore((state) => state.mode)
  const formMethods = useForm({
    resolver: zodResolver(promotionSetupSchema),
    defaultValues: {
      promotionId: '',
      promotionName: '',
      details: '',
      appliedOn: '',
      promotionType: '',
      inactive: false,
      promotionParameters: {
        paidForCondition: {
          condition: 'buyAny', // Default condition
          quantity: undefined, // Default field for "buyAny"
        },
        buyAssortments: [],
        benefitType: {
          type: 'flatDiscount', // Default to "flatDiscount"
        },
        objValue: [],
        discountTypes: {
          selectedDiscount: '',
          types: [
            {
              isSelected: false,
              type: '',
              discountOn: '',
              comparison: '',
              from: '',
              to1: '', //Note: Debmalya, change  to: => to1
            },
            {
              isSelected: false,
              type: '',
              discountOn: '',
              comparison: '',
              from: '',
              to1: '', //Note: Debmalya, change  to: => to1
            },
            {
              isSelected: false,
              type: '',
              discountOn: '',
              comparison: '',
              from: '',
              to1: '', //Note: Debmalya, change to: => to1
            },
          ],
        },
      },
    },
  })
  useEffect(() => {
    if (mode === 'Edit' && selectedPromotionID && promotionData && !isLoading) {
      formMethods.reset({
        promotionId: String(promotionData.promotionID) || '',
        promotionName: promotionData.promotionName || '',
        details: promotionData.details || '',
        appliedOn: promotionData.appliedOn || '',
        promotionType: promotionData.promotionType || '',
        inactive: promotionData.isActive === 'N' ? false : true,
        promotionParameters: {
          paidForCondition: promotionData.objCondition
            ? {
                condition: promotionData.objCondition[0]?.conditionID || 'A',
                quantity: promotionData.objCondition[0]?.value || undefined,
              }
            : { condition: 'A', quantity: undefined },
          buyAssortments:
            promotionData.objAssortment?.map((assortment) => ({
              assortmentID: assortment.assortmentID,
              assortmentName: assortment.assortmentName,
              unit: assortment.value,
            })) || [],
          benefitType: promotionData.objBenifit
            ? {
                type: promotionData.objBenifit[0]?.benifitID || 'F',
                value: promotionData.objBenifit[0]?.value || 0,
                assortmentID: promotionData.objBenifit[0]?.assortmentID || 0,
                assortmentName: promotionData.objBenifit[0]?.assortmentName || '',
              }
            : { type: 'F' },
          objValue: promotionData.objValue || [],
          discountTypes: {
            selectedDiscount: '',
            types: promotionData.objDiscount?.map((discount) => ({
              isSelected: true,
              type: discount.discountID || '',
              discountOn: discount.dropDown1 || '',
              condition: discount.dropDown2 || '', //Note: Debmalya, Added new line
              comparison: discount.dropDown3 || '', //Note: Debmalya, .dropDown2 => .dropDown3
              from: discount.fromValue || 0,
              to1: discount.toValue || 0,
              value: discount.value || 0
            })) || [
              {
                isSelected: false,
                type: '',
                discountOn: '',
                comparison: '',
                from: '',
                to1: '', //Note: Debmalya, change to: => to1
              },
              {
                isSelected: false,
                type: '',
                discountOn: '',
                comparison: '',
                from: '',
                to1: '', //Note: Debmalya, change  to: => to1
              },
              {
                isSelected: false,
                type: '',
                discountOn: '',
                comparison: '',
                from: '',
                to1: '', //Note: Debmalya, change  to: => to1
              },
            ],
          },
        },
      })
    }
  }, [selectedPromotionID, promotionData, isLoading, formMethods.reset, mode])
  // Handle form submission
  const onSubmit = formMethods.handleSubmit(    
    async (data) => {
      //console.log("data",data)
      try {
        const formattedData = promotionDataFormatter(data)
        await createPromotionAsync(formattedData)
        closeModal()
        //console.log('Form Data Submitted: ', formattedData) // Logs if submission is successful
      } catch (err) {
        console.log(err)
      }
    },
    (errors) => {
      console.log('Validation Errors: ', errors) // Logs validation errors, if any
    }
  )
  //console.log(promotionData)

  return (
    <FormProvider {...formMethods}>
      <form
        className=""
        onSubmit={(e) => {
          e.preventDefault() // Ensure default form submission behavior is prevented
          onSubmit() // Trigger submission
        }}
      >
        {step === 1 && <PromotionForm1 />}
        {step === 2 && <PromotionForm2 />}

        <div className=" h-[100px] mt-5 self-end  flex flex-col  items-end space-y-3 ">
          {step === 1 && (
            <Button type="button" className=" btn btn-primary" onClick={() => next()}>
              Promotion Parameters
            </Button>
          )}
          <div className="flex gap-3">
            {step === 2 && (
              <Button type="button" className="btn btn-primary" onClick={() => prev()}>
                Back
              </Button>
            )}
            <Button
              disabled={isPending}
              type={step === 1 ? 'submit' : 'button'}
              className=" btn btn-primary"
              onClick={() => (step === 2 ? prev() : null)}
            >
              {isPending ? 'Saving' : 'Save'}
            </Button>
            {/* <Button
              type="reset"
              className="btn btn-primary"
              onClick={() => {
                if (step === 2) {
                  prev() // Step 2 theke step 1 e ashar jonno
                } else {
                  closeModal() // Step 1 e thakle modal close korbe
                }
              }}
            >
              Cancel
            </Button> */}
             {step === 1 && (
            <Button
              type="reset"
              className="btn btn-primary"
              onClick={() => {
                prev()
                closeModal()
              }}
            >
              Cancel
            </Button>
             )}
          </div>
        </div>
      </form>
    </FormProvider>
  )
}

export default PromotionSetupForm
