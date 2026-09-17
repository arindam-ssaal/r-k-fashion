import {
  Blinds,
  ChartSpline,
  DiamondPercent,
  OctagonX,
  Route,
  ShoppingBag,
  Stamp,
  TextSearch,
  TicketX,
} from 'lucide-react'

import { useSalesOptionStore } from './store/useSalesOptionsStore'

import TootlTipWrapper from '@/components/TootlTipWrapper'

function SalesOptions() {
  const setOption = useSalesOptionStore((state) => state.setSelectedOption)
  const option = useSalesOptionStore((state) => state.selectedOption)

  function handleClick(option: string) {
    setOption(option)
  }

  return (
    <ul className="space-y-5 pt-6  shadow h-full  rounded-l-lg flex flex-col items-center">
      <li>
        <TootlTipWrapper title="Item search">
          <button
            onClick={() => handleClick('itemsearch')}
            className={`h-10 w-10 ${option === 'itemsearch' ? 'bg-primary/10' : 'bg-primary/5'}   text-primary  rounded-lg flex items-center justify-center`}
          >
            <TextSearch size={18} />
          </button>
        </TootlTipWrapper>
      </li>
      <li>
        <TootlTipWrapper title="Checkout">
          <button
            onClick={() => handleClick('checkout')}
            className={`h-10 w-10 ${option === 'checkout' ? 'bg-primary/10' : 'bg-primary/5'}   text-primary  rounded-lg flex items-center justify-center`}
          >
            <ShoppingBag size={18} />
          </button>
        </TootlTipWrapper>
      </li>
      <li>
        <TootlTipWrapper title="Hold bill">
          <button
            onClick={() => handleClick('holdbill')}
            className={`h-10 w-10 ${option === 'holdbill' ? 'bg-primary/10' : 'bg-primary/5'}   text-primary  rounded-lg flex items-center justify-center`}
          >
            <Blinds size={18} />
          </button>
        </TootlTipWrapper>
      </li>
      <li>
        <TootlTipWrapper title="Void bill">
          <button
            onClick={() => handleClick('voidbill')}
            className={`h-10 w-10 ${option === 'voidbill' ? 'bg-primary/10' : 'bg-primary/5'}   text-primary  rounded-lg flex items-center justify-center`}
          >
            <TicketX size={18} />
          </button>
        </TootlTipWrapper>
      </li>
      <li>
        <TootlTipWrapper title="Reprint Bill">
          <button
            onClick={() => handleClick('reprintbill')}
            className={`h-10 w-10 ${option === 'reprintbill' ? 'bg-primary/10' : 'bg-primary/5'}   text-primary  rounded-lg flex items-center justify-center`}
          >
            <Stamp size={18} />
          </button>
        </TootlTipWrapper>
      </li>
      <li>
        <TootlTipWrapper title="Apply Discount">
          <button
            onClick={() => handleClick('applydiscount')}
            className={`h-10 w-10 ${option === 'applydiscount' ? 'bg-primary/10' : 'bg-primary/5'}   text-primary  rounded-lg flex items-center justify-center`}
          >
            <DiamondPercent size={18} />
          </button>
        </TootlTipWrapper>
      </li>
      <li>
        <TootlTipWrapper title="Apply Promotions">
          <button
            onClick={() => handleClick('applypromotions')}
            className={`h-10 w-10 ${option === 'applypromotions' ? 'bg-primary/10' : 'bg-primary/5'}   text-primary  rounded-lg flex items-center justify-center`}
          >
            <ChartSpline size={18} />
          </button>
        </TootlTipWrapper>
      </li>
      <li>
        <TootlTipWrapper title="Cash Drawer In">
          <button
            onClick={() => handleClick('cashin')}
            className={`h-10 w-10 ${option === 'cashin' ? 'bg-primary/10' : 'bg-primary/5'}   text-primary  rounded-lg flex items-center justify-center`}
          >
            <Route size={18} />
          </button>
        </TootlTipWrapper>
      </li>
      <li>
        <TootlTipWrapper title="Cash Drawer Out">
          <button
            onClick={() => handleClick('cashout')}
            className={`h-10 w-10 ${option === 'cashout' ? 'bg-primary/10' : 'bg-primary/5'}   text-primary  rounded-lg flex items-center justify-center`}
          >
            <OctagonX size={18} />
          </button>
        </TootlTipWrapper>
      </li>
    </ul>
  )
}

export default SalesOptions
