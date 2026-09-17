import { useFormContext } from 'react-hook-form'

import PaidForCondition from '../PaidForCondition'
import PromotionBenefit from '../PrmotionBenefit/PromotionBenefit'
import PromotionFormAssortmentTable from '../PromotionFormAssortmentTable'
import PromotionFormDiscountTable from '../PromotionFormDiscountTable'
import PromotionSlabTable from '../PromotionSlabTable'

function PromotionForm2() {
  const formMethods = useFormContext()
  const promotionType = formMethods.watch('promotionType')

  //console.log(promotionType)

  return (
    <div className="grid grid-cols-2 gap-4 h-full">
      <div className="border rounded p-4">
        {promotionType === 'F' && (
          <div className="mb-10">
            {' '}
            <PaidForCondition />{' '}
          </div>
        )}

        <div>
          <PromotionFormAssortmentTable />
        </div>

        {promotionType !== 'F' && (
          <div className="mt-10">
            <PromotionSlabTable />
          </div>
        )}
      
      </div>

      <div className="border rounded p-4">
        <div className="mb-10">
          <h3 className="font-semibold  mb-3">Benefit Type</h3>
          <PromotionBenefit />
        </div>

        <div>
          <h3 className="font-semibold text-md mb-3">Discount Type</h3>
          <PromotionFormDiscountTable />
        </div>
      </div>
    </div>
  )
}

export default PromotionForm2
