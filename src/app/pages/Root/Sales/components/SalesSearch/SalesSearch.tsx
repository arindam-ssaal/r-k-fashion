import useSalesSearchStore from './store/useSalesSearch'

import { Input } from '@/components/ui/input'
import useFocusOnKeyPress from '@/hooks/useFocusOnKeyPress'

function SalesSearch() {
  const { setSearchKey } = useSalesSearchStore()

  const inputRef = useFocusOnKeyPress<HTMLInputElement>(
    'F2',
    (input) => input?.focus(), // Action to focus the input
    true // Do not focus initially
  )

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    setSearchKey(e.target.value)
  }

  return (
    <form className="">
      <div className="grid w-full items-center gap-4">
        <div className="flex flex-col space-y-1.5">
          <Input
            id="name"
            placeholder="search"
            className=""
            ref={inputRef}
            onChange={handleInputChange}
          />
        </div>
      </div>
    </form>
  )
}

export default SalesSearch
