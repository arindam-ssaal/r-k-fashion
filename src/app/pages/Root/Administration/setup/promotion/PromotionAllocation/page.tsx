import { useEffect } from 'react'
import { useCookies } from 'react-cookie'
import { useForm, FormProvider } from 'react-hook-form'
import { toast } from 'sonner'

import {
  Promotion,
  usePromotionSelectionListStore,
} from './components/PromotionSelectionList/store/usePromotionSelctionListStore'
import PromotionSelectionModal from './components/PromotionSelectionModal'
import PromotionSelectionTable from './components/PromotionSelectionTable'
import { usePromotionStoreSelectionListStore } from './components/PromotionStoreSelectionList/store/usePromotionStoreSelectionListStore'
import PromotionStoreSelectionModal from './components/PromotionStoreSelectionModal'
import PromotionStoreSelectionTable from './components/PromotionStoreSelectionTable'
import { GetAPI, PostAPI } from '../../../../../../../services/apiCall'

import { Button } from '@/components/ui/button'

type PromotionAllocationMode = 'create' | 'edit' | 'view'

type StoreWisePromotionDetail = {
  promotionID: number
  promotionName: string
  storeID: number
  storeName: string
  allocationType: 'N' | 'H'
  startDate: string
  endDate: string
  objHappy: unknown[]
}

type StoreWisePromotionResponse = {
  promotionID: number
  promotionName: string
  storeName: string
  enteredBy: number
  usedFor: string | null
  objDetails: StoreWisePromotionDetail[]
}

type PromotionAllocationPageProps = {
  promotionID?: number | null
  mode?: PromotionAllocationMode
}

const toInputDate = (value?: string) => {
  if (!value) return ''
  const parts = value.split('-')
  if (parts.length === 3) {
    const [dd, mm, yyyy] = parts
    return `${yyyy}-${mm}-${dd}`
  }
  return value
}

// const promotionSchema = z.object({
//   selectedPromotions: z
//     .array(
//       z.object({
//         id: z.string(),
//         name: z.string(),
//       })
//     )
//     .nonempty('You must select at least one promotion!'),
//   selectedPromotionStores: z
//     .array(
//       z.object({
//         id: z.string(),
//         name: z.string().nonempty('Store name is required'),
//         fromDate: z.string().nonempty('From Date is required'),
//         toDate: z.string().nonempty('To Date is required'),
//         allocationType: z.enum(['N', 'H']), //z.enum(['normal', 'happy-hour']),
//         deallocate: z.boolean(),
//       })
//     )
//     .nonempty('At least one store must be selected!'),
// });

function PromotionAllocationPage({ promotionID = null, mode = 'create' }: PromotionAllocationPageProps) {
  //const [isModalOpen, setIsModalOpen] = useState(false)
  const methods = useForm<{
    selectedPromotions: Promotion[]
    selectedPromotionStores: {
      storeID: number
      storeName: string
      startDate: string
      closeDate: string
      allocationType: 'N' | 'H' //"normal" | "happy-hour";
      deallocate: boolean
    }[]
  }>({
    defaultValues: {
      selectedPromotions: [],
      selectedPromotionStores: [],
    },
    //resolver: zodResolver(),
  })
  const { handleSubmit, setValue, getValues } = methods
  const selectedPromotions = usePromotionSelectionListStore((state) => state.selectedPromotions)
  const selectedPromotionStores = usePromotionStoreSelectionListStore(
    (state) => state.selectedPromotions
  )
  const setPromotionStoreSelections = usePromotionStoreSelectionListStore((state) => state.setPromotions)
  const [cookies] = useCookies(['UserId', 'DefaultStoreId'])
  const isViewMode = mode === 'view'
  const isEditMode = mode === 'edit'

  const getCookieValue = (name: string) => {
    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'))
    return match ? match[2] : null
  }

  useEffect(() => {
    setValue('selectedPromotions', selectedPromotions)
    setValue('selectedPromotionStores', selectedPromotionStores)
  }, [selectedPromotions, setValue, selectedPromotionStores])

  useEffect(() => {
    if (mode === 'create' && !promotionID) {
      usePromotionSelectionListStore.setState({ selectedPromotions: [] })
      usePromotionStoreSelectionListStore.setState({ selectedPromotions: [] })
      setPromotionStoreSelections([])
      setValue('selectedPromotions', [])
      setValue('selectedPromotionStores', [])
    }
  }, [mode, promotionID, setPromotionStoreSelections, setValue])

  useEffect(() => {
    const loadStoreWisePromotion = async () => {
      if (!promotionID) {
        return
      }

      try {
        usePromotionSelectionListStore.setState({ selectedPromotions: [] })
        usePromotionStoreSelectionListStore.setState({ selectedPromotions: [] })
        setPromotionStoreSelections([])
        setValue('selectedPromotions', [])
        setValue('selectedPromotionStores', [])

        const response = await GetAPI(
          '/api/Promotion/GetStoreWisePromotion',
          '',
          { PromotionID: promotionID, StoreID: 0 },
          cookies
        )

        const responseData = (response.data || {}) as StoreWisePromotionResponse

        const promotionSelection: Promotion[] = responseData.promotionID
          ? [
              {
                promotionID: responseData.promotionID,
                promotionName: responseData.promotionName,
              },
            ]
          : []

        const storeSelections: {
          storeID: number
          storeName: string
          startDate: string
          closeDate: string
          allocationType: 'N' | 'H'
          deallocate: boolean
        }[] = (responseData.objDetails || []).map((item) => ({
          storeID: item.storeID,
          storeName: item.storeName,
          startDate: toInputDate(item.startDate),
          closeDate: toInputDate(item.endDate),
          allocationType: item.allocationType === 'H' ? 'H' : 'N',
          deallocate: false,
        }))

        usePromotionSelectionListStore.setState({ selectedPromotions: promotionSelection })
        usePromotionStoreSelectionListStore.setState({ selectedPromotions: storeSelections })
        setPromotionStoreSelections(storeSelections)
        setValue('selectedPromotions', promotionSelection)
        setValue('selectedPromotionStores', storeSelections)
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to load promotion allocation data.'
        toast.error(errorMessage, {
          style: { backgroundColor: '#f7edeb', color: '#ff6242' },
        })
      }
    }

    loadStoreWisePromotion()
  }, [cookies, promotionID, setPromotionStoreSelections, setValue])

  const handleSave = async () => {
    const formData = getValues()

    const selectedPromotions = formData.selectedPromotions
    const selectedPromotionStores = formData.selectedPromotionStores
    const transformedData =
      selectedPromotions.length > 0
        ? {
            promotionID: selectedPromotions[0].promotionID,
            promotionName: selectedPromotions[0].promotionName,
            storeName: '', // Assuming storeName is empty
            enteredBy: getCookieValue('UserId'),
            usedFor: isEditMode ? 'U' : 'I',
            objDetails: selectedPromotionStores.map((store) => ({
              promotionID: selectedPromotions[0].promotionID,
              promotionName: selectedPromotions[0].promotionName,
              storeID: store.storeID,
              storeName: store.storeName,
              allocationType: store.allocationType,
              startDate: new Date(store.startDate)
                .toISOString()
                .split('T')[0]
                .split('-')
                .reverse()
                .join('-'), //store.startDate,
              endDate: new Date(store.closeDate)
                .toISOString()
                .split('T')[0]
                .split('-')
                .reverse()
                .join('-'), //store.closeDate,
              objHappy: [
                // {
                //   promotionID: selectedPromotions[0].promotionID,
                //   storeID: store.storeID,
                //   weekDay: 0,
                //   isChecked: store.deallocate,
                //   fromTime: new Date(store.startDate).toLocaleTimeString('en-US', { hour12: false }),
                //   toTime: new Date(store.closeDate).toLocaleTimeString('en-US', { hour12: false }),
                // },
              ],
            })),
          }
        : {}
    try {
      //let cookies = '';
      const response = await PostAPI(
        '/api/PromotionRep/PostStoreWisePromotion',
        '',
        transformedData,
        cookies
      )
      if (response.data[0].returnCode === 'Y') {
        toast.success(`Promotion allocation saved successfully!`, {
          style: { backgroundColor: '#e3ffea', color: '#3ed665' },
        }) //response.data[0].returnMsg
        window.location.reload();
      } else if (response.data[0].returnCode === 'F') {
        toast.error(response.data[0].returnMsg, {
          style: { backgroundColor: '#f7edeb', color: '#ff6242' },
        })
      } else if (response.data[0].returnCode === 'N') {
        toast.error(response.data[0].returnMsg, {
          style: { backgroundColor: '#f7edeb', color: '#ff6242' },
        })
      } else {
        toast.error('Failed to Save Promotion allocation. Please try again.', {
          style: { backgroundColor: '#f7edeb', color: '#ff6242' },
        })
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to save promotion allocation.'
      toast.error(errorMessage, { style: { backgroundColor: '#f7edeb', color: '#ff6242' } })
    }
  }

  const onSubmit = () => {}

  return (
    <div className="relative z-30" style={{backgroundColor:'#fff'}}>
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 gap-3">
            <div className="p-3 border">
              <PromotionSelectionTable readOnly={isViewMode} />
            </div>
            <div className="p-3 border">
              <PromotionStoreSelectionTable readOnly={isViewMode} />
            </div>
          </div>

          <PromotionSelectionModal />
          <PromotionStoreSelectionModal />
          <div className="mt-4 flex justify-between items-center">
            <div className="flex gap-3">
              <Button onClick={handleSave} type="button" disabled={isViewMode}>
                Save
              </Button>
              <Button variant="outline" type="reset" className='back-red-600 text-c-white' disabled={isViewMode}>
                Reset
              </Button>
            </div>
            <div>
              {/* <Button
                onClick={() => {
                  setIsModalOpen(false)
                }}
                type="button"
                variant="outline"
              >
                Cancel
              </Button> */}
            </div>
          </div>
        </form>
      </FormProvider>
    </div>
  )
}

export default PromotionAllocationPage
