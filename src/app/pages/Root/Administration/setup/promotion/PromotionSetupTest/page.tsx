import { Eye, Plus, Trash } from 'lucide-react'
import React, { useEffect, useMemo, useState } from 'react'
import { toast } from 'sonner'

import ListingPage, { ColumnDef } from '@/components/ListingTable/ListingPage'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Textarea } from '@/components/ui/textarea'
import { GetAPI, PostAPI } from '@/services/apiCall'
import type { FetchedPromotionType } from '@/types/Promotion'

type AssortmentItem = {
  assortmentID: number
  assortmentName: string
}

type BuyAssortmentRow = {
  assortmentID: number | null
  assortmentName: string
  value: string
}

type BenefitSelection = {
  assortmentID: number | null
  assortmentName: string
}

type DiscountTypeRow = {
  id: number
  to1: string
  discountOn: string
  condition: string
  comparison: string
  from: string
  to: string
  isSelected: boolean
}

const ITEMS_PER_PAGE = 5

const PROMOTION_COLUMNS: ColumnDef<FetchedPromotionType>[] = [
  { field: 'promotionID', header: 'ID', width: '80px' },
  { field: 'promotionName', header: 'Promotion Name', type: 'link' },
  { field: 'details', header: 'Remarks' },
  {
    field: 'isActive',
    header: 'Status',
    type: 'badge',
    width: '100px',
    badgeMap: {
      Y: { variant: 'success', label: 'Active', dot: true },
      N: { variant: 'warning', label: 'Inactive', dot: true },
    },
  },
]

const discountOnLabels = ['% of Discount on', 'Rs of Discount on', 'Rs Fixed Amount on']
const sectionTitleClassName = 'text-xl font-semibold mb-4'
const fieldLabelClassName = 'text-base font-medium'
const controlClassName = 'h-11 text-base'
const radioLabelClassName = 'text-base font-normal cursor-pointer'
const tableTextClassName = 'text-base'

const createDefaultDiscountTypes = (): DiscountTypeRow[] => [
  {
    id: 0,
    to1: '',
    discountOn: '',
    condition: '',
    comparison: '',
    from: '',
    to: '',
    isSelected: true,
  },
  {
    id: 1,
    to1: '',
    discountOn: '',
    condition: '',
    comparison: '',
    from: '',
    to: '',
    isSelected: false,
  },
  {
    id: 2,
    to1: '',
    discountOn: '',
    condition: '',
    comparison: '',
    from: '',
    to: '',
    isSelected: false,
  },
]

const normalizeAppliedOn = (value?: string): 'E' | 'B' => (value === 'B' ? 'B' : 'E')

const PromotionSetupTest = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [promotions, setPromotions] = useState<FetchedPromotionType[]>([])
  const [promotionsLoading, setPromotionsLoading] = useState(false)
  const [editPromotion, setEditPromotion] = useState<FetchedPromotionType | null>(null)
  const [isViewMode, setIsViewMode] = useState(false)
  const [isFetchingPromotion, setIsFetchingPromotion] = useState(false)

  const [formData, setFormData] = useState({
    promotionName: '',
    details: '',
    appliedOn: 'E',
    promotionType: 'F',
    promoType: 'P',
    inactive: false,
  })

  const [paidCondition, setPaidCondition] = useState<{ conditionID: 'A' | 'R' | 'Q'; value: string }>({
    conditionID: 'A',
    value: '',
  })

  const [buyAssortments, setBuyAssortments] = useState<BuyAssortmentRow[]>([])
  const [benefitType, setBenefitType] = useState<'F' | 'P' | 'B'>('F')
  const [benefitQuantity, setBenefitQuantity] = useState('')
  const [benefitAssortment, setBenefitAssortment] = useState<BenefitSelection>({
    assortmentID: null,
    assortmentName: 'Select Assortment',
  })

  const [discountTypes, setDiscountTypes] = useState<DiscountTypeRow[]>(createDefaultDiscountTypes)
  const [selectedDiscount, setSelectedDiscount] = useState('0')
  const [expandedDiscountRows, setExpandedDiscountRows] = useState<Record<number, boolean>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [assortmentModalOpen, setAssortmentModalOpen] = useState(false)
  const [assortmentModalData, setAssortmentModalData] = useState<AssortmentItem[]>([])
  const [assortmentModalLoading, setAssortmentModalLoading] = useState(false)
  const [assortmentModalPage, setAssortmentModalPage] = useState(1)
  const [activeRowIndex, setActiveRowIndex] = useState<number | null>(null)
  const [assortmentModalTarget, setAssortmentModalTarget] = useState<'buy' | 'benefit'>('buy')

  const fetchPromotions = () => {
    setPromotionsLoading(true)
    GetAPI<FetchedPromotionType[]>('/api/Promotion/GetAllPromotion?promotionType=F', '', { PromotionID: 0 }, {})
      .then(res => setPromotions(res.data || []))
      .catch(() => {
        toast.error('Failed to fetch promotions.', {
          style: { backgroundColor: '#f7edeb', color: '#ff6242' },
        })
        setPromotions([])
      })
      .finally(() => setPromotionsLoading(false))
  }

  useEffect(() => {
    fetchPromotions()
  }, [])

  const resetDiscountSection = () => {
    setDiscountTypes(createDefaultDiscountTypes())
    setSelectedDiscount('0')
    setExpandedDiscountRows({})
  }

  const resetForm = () => {
    setFormData({
      promotionName: '',
      details: '',
      appliedOn: 'E',
      promotionType: 'F',
      promoType: 'P',
      inactive: false,
    })
    setPaidCondition({ conditionID: 'A', value: '' })
    setBuyAssortments([])
    setBenefitType('F')
    setBenefitQuantity('')
    setBenefitAssortment({ assortmentID: null, assortmentName: 'Select Assortment' })
    resetDiscountSection()
  }

  const getCookieValue = (name: string): string | null => {
    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'))
    return match ? match[2] : null
  }

  const handleInputChange = (field: keyof typeof formData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleOpenAssortmentModal = async (target: 'buy' | 'benefit', rowIndex?: number) => {
    setAssortmentModalTarget(target)
    setActiveRowIndex(target === 'buy' ? (rowIndex ?? null) : null)
    setAssortmentModalPage(1)
    setAssortmentModalOpen(true)
    setAssortmentModalLoading(true)
    try {
      const res = await GetAPI<AssortmentItem[]>(
        '/api/assortment/GetAllAssortment',
        '',
        { AssortmentType: 'P', AssortmentID: 0 },
        {}
      )
      setAssortmentModalData(res.data || [])
    } catch {
      toast.error('Failed to fetch assortments.', {
        style: { backgroundColor: '#f7edeb', color: '#ff6242' },
      })
      setAssortmentModalData([])
    } finally {
      setAssortmentModalLoading(false)
    }
  }

  const handleSelectAssortment = (assortment: AssortmentItem) => {
    if (assortmentModalTarget === 'buy' && activeRowIndex !== null) {
      setBuyAssortments(prev =>
        prev.map((row, i) =>
          i === activeRowIndex
            ? { ...row, assortmentID: assortment.assortmentID, assortmentName: assortment.assortmentName }
            : row
        )
      )
    } else {
      setBenefitAssortment({
        assortmentID: assortment.assortmentID,
        assortmentName: assortment.assortmentName,
      })
    }
    setAssortmentModalOpen(false)
    setActiveRowIndex(null)
  }

  const handleAddAssortmentRow = () => {
    setBuyAssortments(prev => [...prev, { assortmentID: null, assortmentName: 'Select Assortment', value: '' }])
  }

  const handleDeleteAssortmentRow = (index: number) => {
    setBuyAssortments(prev => prev.filter((_, i) => i !== index))
  }

  const handleAssortmentValueChange = (index: number, value: string) => {
    setBuyAssortments(prev => prev.map((row, i) => (i === index ? { ...row, value } : row)))
  }

  const handleBenefitTypeChange = (value: 'F' | 'P' | 'B') => {
    setBenefitType(value)
    if (value === 'F') {
      setBenefitQuantity('')
      setBenefitAssortment({ assortmentID: null, assortmentName: 'Select Assortment' })
    }
  }

  const handleSelectDiscount = (val: string) => {
    const idx = Number(val)
    setSelectedDiscount(val)
    setDiscountTypes(prev =>
      prev.map((row, i) => ({
        ...row,
        isSelected: i === idx,
        ...(i !== idx ? { to1: '', discountOn: '', condition: '', comparison: '', from: '', to: '' } : {}),
      }))
    )
    setExpandedDiscountRows({})
  }

  const handleDiscountFieldChange = (index: number, field: keyof DiscountTypeRow, value: string) => {
    setDiscountTypes(prev =>
      prev.map((row, i) => {
        if (i !== index) return row
        const updated = { ...row, [field]: value }
        if (field === 'comparison' && value !== 'C') {
          updated.from = ''
          updated.to = ''
        }
        return updated
      })
    )
  }

  const toggleDiscountRowExpand = (index: number) => {
    setExpandedDiscountRows(prev => ({ ...prev, [index]: !prev[index] }))
  }

  const loadPromotionData = async (promotionID: number) => {
    setIsFetchingPromotion(true)
    try {
      const res = await GetAPI<FetchedPromotionType>(
        '/api/Promotion/GetPromotion',
        '',
        { PromotionID: promotionID },
        {}
      )
      const data: FetchedPromotionType = res.data

      setFormData({
        promotionName: data.promotionName || '',
        details: data.details || '',
        appliedOn: normalizeAppliedOn(data.appliedOn),
        promotionType: data.promotionType || 'F',
        promoType: data.promoType || 'P',
        inactive: data.isActive === 'Y',
      })

      const firstCondition = data.objCondition?.[0]
      setPaidCondition({
        conditionID:
          firstCondition?.conditionID === 'R' || firstCondition?.conditionID === 'Q'
            ? firstCondition.conditionID
            : 'A',
        value: firstCondition?.value !== undefined ? String(firstCondition.value) : '',
      })

      setBuyAssortments(
        (data.objAssortment || []).map(item => ({
          assortmentID: item.assortmentID,
          assortmentName: item.assortmentName,
          value: item.value !== undefined && item.value !== null ? String(item.value) : '',
        }))
      )

      const firstBenefit = data.objBenifit?.[0]
      const resolvedBenefitType =
        firstBenefit?.benifitID === 'P' || firstBenefit?.benifitID === 'B' ? firstBenefit.benifitID : 'F'
      setBenefitType(resolvedBenefitType)
      setBenefitQuantity(
        resolvedBenefitType === 'F' || firstBenefit?.value === undefined ? '' : String(firstBenefit.value)
      )
      setBenefitAssortment({
        assortmentID: resolvedBenefitType === 'F' ? null : (firstBenefit?.assortmentID ?? null),
        assortmentName:
          resolvedBenefitType === 'F'
            ? 'Select Assortment'
            : (firstBenefit?.assortmentName || 'Select Assortment'),
      })

      resetDiscountSection()
      const firstDiscount = data.objDiscount?.[0]
      if (firstDiscount) {
        const selectedIdx = Number.isNaN(Number(firstDiscount.discountID))
          ? 0
          : Number(firstDiscount.discountID)
        const safeIndex = selectedIdx < 0 || selectedIdx > 2 ? 0 : selectedIdx
        setSelectedDiscount(String(safeIndex))
        setDiscountTypes(prev =>
          prev.map((row, i) => ({
            ...row,
            isSelected: i === safeIndex,
            ...(i === safeIndex
              ? {
                  to1: firstDiscount.toValue !== undefined ? String(firstDiscount.toValue) : '',
                  discountOn: firstDiscount.dropDown1 || '',
                  condition: firstDiscount.dropDown2 || '',
                  comparison: firstDiscount.dropDown3 || '',
                  from: firstDiscount.fromValue !== undefined ? String(firstDiscount.fromValue) : '',
                  to: firstDiscount.value !== undefined ? String(firstDiscount.value) : '',
                }
              : {
                  to1: '',
                  discountOn: '',
                  condition: '',
                  comparison: '',
                  from: '',
                  to: '',
                }),
          }))
        )
      }
    } catch {
      toast.error('Failed to load promotion details.', {
        style: { backgroundColor: '#f7edeb', color: '#ff6242' },
      })
      setIsModalOpen(false)
    } finally {
      setIsFetchingPromotion(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const appliedOn = normalizeAppliedOn(formData.appliedOn)

    if (!formData.promotionName.trim()) {
      toast.error('Please enter promotion name.', {
        style: { backgroundColor: '#f7edeb', color: '#ff6242' },
      })
      return
    }

    if (!formData.details.trim()) {
      toast.error('Please enter promotion details.', {
        style: { backgroundColor: '#f7edeb', color: '#ff6242' },
      })
      return
    }

    if (!appliedOn) {
      toast.error('Please select where the promotion is applied.', {
        style: { backgroundColor: '#f7edeb', color: '#ff6242' },
      })
      return
    }

    const validAssortments = buyAssortments.filter(row => row.assortmentID !== null)
    if (validAssortments.length === 0) {
      toast.error('Please add at least one Buy Assortment.', {
        style: { backgroundColor: '#f7edeb', color: '#ff6242' },
      })
      return
    }

    if (paidCondition.conditionID === 'A' && paidCondition.value.trim() === '') {
      toast.error('Please enter quantity for Buy Any condition.', {
        style: { backgroundColor: '#f7edeb', color: '#ff6242' },
      })
      return
    }

    if (paidCondition.conditionID === 'R' && validAssortments.some(row => row.value.trim() === '')) {
      toast.error('Please enter Unit for each Buy Assortment.', {
        style: { backgroundColor: '#f7edeb', color: '#ff6242' },
      })
      return
    }

    if (benefitType !== 'F') {
      if (benefitQuantity.trim() === '') {
        toast.error('Please enter quantity for selected benefit type.', {
          style: { backgroundColor: '#f7edeb', color: '#ff6242' },
        })
        return
      }
      if (benefitAssortment.assortmentID === null) {
        toast.error('Please select assortment for selected benefit type.', {
          style: { backgroundColor: '#f7edeb', color: '#ff6242' },
        })
        return
      }
    }

    const selectedDiscountRow = discountTypes.find(row => row.isSelected)
    if (!selectedDiscountRow || selectedDiscountRow.to1.trim() === '') {
      toast.error('Please enter discount value in Discount Type.', {
        style: { backgroundColor: '#f7edeb', color: '#ff6242' },
      })
      return
    }

    setIsSubmitting(true)
    try {
      const payload = {
        promotionID: editPromotion?.promotionID ?? 0,
        promotionName: formData.promotionName.trim(),
        details: formData.details.trim(),
        appliedOn,
        promotionType: 'F',
        promoType: formData.promoType.trim(),
        isActive: formData.inactive ? 'Y' : 'N',
        storeID: Number(getCookieValue('DefaultStoreId') || 0),
        enteredBy: Number(getCookieValue('UserId') || 0),
        usedFor: editPromotion ? 'U' : 'I',
        objCondition: [
          {
            promotionID: editPromotion?.promotionID ?? 0,
            conditionID: paidCondition.conditionID,
            value: paidCondition.conditionID === 'A' ? Number(paidCondition.value || 0) : 0,
          },
        ],
        objAssortment: validAssortments.map(item => ({
          promotionID: editPromotion?.promotionID ?? 0,
          value: paidCondition.conditionID === 'R' ? Number(item.value || 0) : 0,
          assortmentID: item.assortmentID,
          assortmentName: item.assortmentName,
        })),
        objBenifit: [
          {
            promotionID: editPromotion?.promotionID ?? 0,
            benifitID: benefitType,
            value: benefitType === 'F' ? 0 : Number(benefitQuantity || 0),
            assortmentID: benefitType === 'F' ? 0 : Number(benefitAssortment.assortmentID || 0),
            assortmentName: benefitType === 'F' ? '' : benefitAssortment.assortmentName,
          },
        ],
        objValue: [],
        objDiscount: [
          {
            promotionID: editPromotion?.promotionID ?? 0,
            discountID: selectedDiscount,
            value: selectedDiscountRow.to !== '' ? Number(selectedDiscountRow.to) : 0,
            dropDown1: selectedDiscountRow.discountOn || '',
            dropDown2: selectedDiscountRow.condition || '',
            dropDown3: selectedDiscountRow.comparison || '',
            fromValue: selectedDiscountRow.from !== '' ? Number(selectedDiscountRow.from) : 0,
            toValue: selectedDiscountRow.to1 !== '' ? Number(selectedDiscountRow.to1) : 0,
          },
        ],
      }

      const response = await PostAPI('/api/PromotionRep/PostPromotion', '', payload, '')
      const responseData = response?.data
      const responseRow = Array.isArray(responseData) ? responseData[0] : responseData
      if (responseRow?.returnCode === 'Y') {
        toast.success(responseRow.returnMsg || 'Promotion saved successfully!', {
          style: { backgroundColor: '#e3ffea', color: '#3ed665' },
        })
        setIsModalOpen(false)
        fetchPromotions()
      } else {
        toast.error(responseRow?.returnMsg || 'Failed to save promotion. Please try again.', {
          style: { backgroundColor: '#f7edeb', color: '#ff6242' },
        })
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to save promotion.', {
        style: { backgroundColor: '#f7edeb', color: '#ff6242' },
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleViewPromotion = (row: FetchedPromotionType) => {
    resetForm()
    setEditPromotion(row)
    setIsViewMode(true)
    setIsModalOpen(true)
    loadPromotionData(row.promotionID)
  }

  const handleEditPromotion = (row: FetchedPromotionType) => {
    resetForm()
    setEditPromotion(row)
    setIsViewMode(false)
    setIsModalOpen(true)
    loadPromotionData(row.promotionID)
  }

  const handleCreatePromotion = () => {
    resetForm()
    setEditPromotion(null)
    setIsViewMode(false)
    setIsModalOpen(true)
  }

  const assortmentTotalPages = Math.max(1, Math.ceil(assortmentModalData.length / ITEMS_PER_PAGE))
  const paginatedAssortments = assortmentModalData.slice(
    (assortmentModalPage - 1) * ITEMS_PER_PAGE,
    assortmentModalPage * ITEMS_PER_PAGE
  )

  const promotionStats = useMemo(
    () => [
      {
        label: 'Total',
        value: promotions.length,
        icon: '🧾',
        iconClass: 'blue' as const,
        filterKey: 'all',
      },
      {
        label: 'Active',
        value: promotions.filter(item => item.isActive?.trim() === 'Y').length,
        icon: '✅',
        iconClass: 'green' as const,
        filterKey: 'active',
      },
      {
        label: 'Inactive',
        value: promotions.filter(item => item.isActive?.trim() === 'N').length,
        icon: '⏸️',
        iconClass: 'amber' as const,
        filterKey: 'inactive',
      },
    ],
    [promotions]
  )

  const promotionFilterChips = useMemo(
    () => [
      { key: 'all', label: 'All', chipClass: 'lp-chip-blue' },
      {
        key: 'active',
        label: 'Active',
        chipClass: 'lp-chip-green',
        filterFn: (row: Record<string, unknown>) => (row as FetchedPromotionType).isActive?.trim() === 'Y',
      },
      {
        key: 'inactive',
        label: 'Inactive',
        chipClass: 'lp-chip-amber',
        filterFn: (row: Record<string, unknown>) => (row as FetchedPromotionType).isActive?.trim() === 'N',
      },
    ],
    []
  )

  return (
    <div className="p-6">
      <div style={{ height: 'calc(100vh - 180px)', display: 'flex', flexDirection: 'column' }}>
        <ListingPage<FetchedPromotionType>
          title="Free Quantity Promotion Setup"
          subtitle="Manage promotions · SAP Business One integrated"
          titleIcon="🧾"
          rowData={promotions}
          columns={PROMOTION_COLUMNS}
          rowKey="promotionID"
          loading={promotionsLoading}
          stats={promotionStats}
          filterChips={promotionFilterChips}
          defaultFilter="all"
          searchPlaceholder="Search by promotion name, remarks..."
          searchFields={['promotionName', 'details']}
          defaultSortCol="promotionID"
          defaultSortDir="asc"
          pageSize={8}
          onView={handleViewPromotion}
          onEdit={handleEditPromotion}
          primaryAction={{ label: '+ Add Promotion', onClick: handleCreatePromotion }}
          emptyText="No promotions found"
        />
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent
          className="max-w-none w-screen h-screen max-h-screen overflow-hidden p-0 m-0 rounded-none gap-0 border-0 shadow-none"
          style={{ background: '#d6eaf8' }}
        >
          <div className="flex flex-col h-screen" style={{ background: '#d6eaf8' }}>
            <DialogHeader className="px-6 py-4 border-b flex-shrink-0 shadow-sm">
              <DialogTitle className="text-xl font-semibold" style={{ color: 'black' }}>
                {editPromotion
                  ? isViewMode
                    ? 'View Promotion Setup - Free Quantity Slab Based'
                    : 'Edit Promotion Setup - Free Quantity Slab Based'
                  : 'Create Promotion Setup - Free Quantity Slab Based'}
              </DialogTitle>
            </DialogHeader>

            <div className="flex-1 overflow-y-auto p-6">
              <form id="promotion-form" onSubmit={handleSubmit}>
                {isFetchingPromotion ? (
                  <div className="flex items-center justify-center h-64">
                    <p className="text-gray-500 text-sm">Loading promotion details...</p>
                  </div>
                ) : (
                  <div className={isViewMode ? 'pointer-events-none select-none text-base' : 'text-base'}>
                    <div className="border border-slate-500 rounded-md p-6 mb-4">
                      <h2 className="text-2xl font-semibold pb-2 border-b border-slate-500" style={{ color: '#1a1a1a' }}>
                        Promotion Information
                      </h2>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                        <div className="space-y-2">
                          <Label className={fieldLabelClassName} style={{ color: '#1a1a1a' }}>
                            Promotion ID
                            <span className="text-red-500">*</span>
                          </Label>
                          <Input
                            value={editPromotion ? String(editPromotion.promotionID) : 'Auto-generated promotion ID'}
                            disabled
                            className={`${controlClassName} bg-white/40`}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label className={fieldLabelClassName} style={{ color: '#1a1a1a' }}>
                            Promotion Name
                            <span className="text-red-500">*</span>
                          </Label>
                          <Input
                            className={controlClassName}
                            value={formData.promotionName}
                            onChange={e =>
                              setFormData(prev => ({
                                ...prev,
                                promotionName: e.target.value,
                              }))
                            }
                            placeholder="Enter promotion name"
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-2 mt-6">
                        <Label className={fieldLabelClassName} style={{ color: '#1a1a1a' }}>
                          Details
                          <span className="text-red-500">*</span>
                        </Label>
                        <Textarea
                          value={formData.details}
                          onChange={e =>
                            setFormData(prev => ({
                              ...prev,
                              details: e.target.value,
                            }))
                          }
                          className="min-h-[90px] text-base"
                          placeholder="Enter promotion details and description"
                          required
                        />
                      </div>

                      {/* Applied On */}
                      <div className="space-y-2 mt-6" style={{color: 'black'}}>
                        <Label className={fieldLabelClassName} style={{color: 'black'}}>
                          Applied On
                          <span className="text-red-500">*</span>
                        </Label>
                        <Select value={formData.appliedOn} onValueChange={(value) => handleInputChange('appliedOn', value)}>
                          <SelectTrigger className={controlClassName}>
                            <SelectValue placeholder="Select application type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="E">Applied On Each Item</SelectItem>
                            <SelectItem value="B">Applied On Bill Item</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Applied On */}
                      <div className="space-y-2 mt-6" style={{color: 'black'}}>
                        <Label className={fieldLabelClassName} style={{color: 'black'}}>
                          Promo Type
                          <span className="text-red-500">*</span>
                        </Label>
                        <Select value={formData.promoType} onValueChange={(value) => handleInputChange('promoType', value)}>
                          <SelectTrigger className={controlClassName}>
                            <SelectValue placeholder="Select application type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="P">Promotion</SelectItem>
                            <SelectItem value="D">Discount</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-4 mt-6">
                        <Label className={fieldLabelClassName} style={{ color: '#1a1a1a' }}>
                          Promotion Type
                          <span className="text-red-500">*</span>
                        </Label>
                        <RadioGroup value={formData.promotionType} onValueChange={() => undefined} className="space-y-3">
                          <div className="flex items-center space-x-3">
                            <RadioGroupItem value="F" id="promotion-type-f" />
                            <Label htmlFor="promotion-type-f" className={radioLabelClassName} style={{ color: '#1a1a1a' }}>
                              Free Quantity Promotion Setup
                            </Label>
                          </div>
                        </RadioGroup>
                      </div>

                      <div className="flex items-center space-x-3 mt-6">
                        <Checkbox
                          id="promotion-is-active"
                          checked={formData.inactive}
                          onCheckedChange={checked => setFormData(prev => ({ ...prev, inactive: Boolean(checked) }))}
                        />
                        <Label htmlFor="promotion-is-active" className={radioLabelClassName} style={{ color: '#1a1a1a' }}>
                          IsActive
                        </Label>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      <div className="border border-slate-500 rounded-md p-4">
                        <h3 className={sectionTitleClassName} style={{ color: '#1a1a1a' }}>
                          Paid for Condition
                        </h3>
                        <RadioGroup
                          value={paidCondition.conditionID}
                          onValueChange={value =>
                            setPaidCondition(prev => ({
                              ...prev,
                              conditionID: value as 'A' | 'R' | 'Q',
                              value: value === 'A' ? prev.value : '',
                            }))
                          }
                          className="space-y-3"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="A" id="condition-A" />
                            <Label htmlFor="condition-A" className={radioLabelClassName} style={{ color: '#1a1a1a' }}>
                              Buy Any
                            </Label>
                            <Input
                              className="w-20 h-10 text-base"
                              type="number"
                              min={0}
                              disabled={paidCondition.conditionID !== 'A'}
                              value={paidCondition.value}
                              onChange={e =>
                                setPaidCondition(prev => ({ ...prev, value: e.target.value }))
                              }
                            />
                            <span className="text-base" style={{ color: '#1a1a1a' }}>Quantity from Assortment</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="R" id="condition-R" />
                            <Label htmlFor="condition-R" className={radioLabelClassName} style={{ color: '#1a1a1a' }}>
                              Buy Specific Quantity in Ratio from Assortment
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="Q" id="condition-Q" />
                            <Label htmlFor="condition-Q" className={radioLabelClassName} style={{ color: '#1a1a1a' }}>
                              Buy Any Quantity from Assortment
                            </Label>
                          </div>
                        </RadioGroup>

                        <div className="mt-8">
                          <h3 className={sectionTitleClassName} style={{ color: '#1a1a1a' }}>
                            Buy Assortment
                          </h3>
                          <div className="overflow-x-auto">
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead className={`w-[50px] ${tableTextClassName}`} style={{ color: '#1a1a1a' }}>
                                    No.
                                  </TableHead>
                                  <TableHead className={tableTextClassName} style={{ color: '#1a1a1a' }}>Assortment Name</TableHead>
                                  {paidCondition.conditionID === 'R' && (
                                    <TableHead className={`w-[90px] ${tableTextClassName}`} style={{ color: '#1a1a1a' }}>
                                      Unit
                                    </TableHead>
                                  )}
                                  <TableHead className={`w-[60px] text-center ${tableTextClassName}`} style={{ color: '#1a1a1a' }}>
                                    Show
                                  </TableHead>
                                  <TableHead className={`w-[60px] text-center ${tableTextClassName}`} style={{ color: '#1a1a1a' }}>
                                    Delete
                                  </TableHead>
                                  <TableHead className={`w-[60px] text-center ${tableTextClassName}`} style={{ color: '#1a1a1a' }}>
                                    Add
                                  </TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {buyAssortments.map((row, index) => (
                                  <TableRow key={index}>
                                    <TableCell className={tableTextClassName} style={{ color: '#1a1a1a' }}>{index + 1}</TableCell>
                                    <TableCell className={tableTextClassName} style={{ color: '#1a1a1a' }}>{row.assortmentName}</TableCell>
                                    {paidCondition.conditionID === 'R' && (
                                      <TableCell>
                                        <Input
                                          type="number"
                                          min={1}
                                          className="w-20 h-10 text-base"
                                          placeholder="Unit"
                                          value={row.value}
                                          onChange={e => handleAssortmentValueChange(index, e.target.value)}
                                        />
                                      </TableCell>
                                    )}
                                    <TableCell className="text-center">
                                      <Eye className="h-4 w-4 text-sky-500 cursor-pointer mx-auto" />
                                    </TableCell>
                                    <TableCell className="text-center">
                                      <Trash
                                        className="h-4 w-4 text-red-500 cursor-pointer mx-auto"
                                        onClick={() => handleDeleteAssortmentRow(index)}
                                      />
                                    </TableCell>
                                    <TableCell className="text-center">
                                      <Plus
                                        className="h-4 w-4 text-red-500 cursor-pointer mx-auto"
                                        onClick={() => handleOpenAssortmentModal('buy', index)}
                                      />
                                    </TableCell>
                                  </TableRow>
                                ))}
                                {buyAssortments.length === 0 && (
                                  <TableRow>
                                    <TableCell colSpan={paidCondition.conditionID === 'R' ? 6 : 5} className="text-center text-base text-slate-500">
                                      No assortment selected
                                    </TableCell>
                                  </TableRow>
                                )}
                              </TableBody>
                            </Table>
                          </div>
                          <div className="mt-4">
                            <Button
                              type="button"
                              className="bg-blue-600 hover:bg-blue-700 text-base text-white"
                              onClick={handleAddAssortmentRow}
                            >
                              Add Assortment
                            </Button>
                          </div>
                        </div>
                      </div>

                      <div className="border border-slate-500 rounded-md p-4">
                        <h3 className={sectionTitleClassName} style={{ color: '#1a1a1a' }}>
                          Benefit Type
                        </h3>
                        <RadioGroup
                          value={benefitType}
                          onValueChange={value => handleBenefitTypeChange(value as 'F' | 'P' | 'B')}
                          className="space-y-3"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="F" id="benefit-flat" />
                            <Label htmlFor="benefit-flat" className={radioLabelClassName} style={{ color: '#1a1a1a' }}>
                              Flat Discount
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="P" id="benefit-paid" />
                            <Label htmlFor="benefit-paid" className={radioLabelClassName} style={{ color: '#1a1a1a' }}>
                              Specific Unit from Paid From Assortment
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="B" id="benefit-benefit" />
                            <Label htmlFor="benefit-benefit" className={radioLabelClassName} style={{ color: '#1a1a1a' }}>
                              Specific Unit from Benefit Assortment
                            </Label>
                          </div>
                        </RadioGroup>

                        {benefitType !== 'F' && (
                          <div className="mt-4 space-y-3">
                            <div className="space-y-2">
                              <Label className={fieldLabelClassName} style={{ color: '#1a1a1a' }}>Specific Unit</Label>
                              <Input
                                className={controlClassName}
                                type="number"
                                min={1}
                                placeholder="Enter Quantity"
                                value={benefitQuantity}
                                onChange={e => setBenefitQuantity(e.target.value)}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label className={fieldLabelClassName} style={{ color: '#1a1a1a' }}>Assortment</Label>
                              <div className="flex gap-2">
                                <Input className={controlClassName} value={benefitAssortment.assortmentName} readOnly />
                                <Button
                                  type="button"
                                  className="bg-blue-600 hover:bg-blue-700 text-base text-white"
                                  onClick={() => handleOpenAssortmentModal('benefit')}
                                >
                                  Select
                                </Button>
                              </div>
                            </div>
                          </div>
                        )}

                        <div className="mt-8">
                          <h3 className={sectionTitleClassName} style={{ color: '#1a1a1a' }}>
                            Discount Type
                          </h3>
                          <div className="max-h-[280px] overflow-auto border rounded-md bg-white/30">
                            <Table className="[&_tr:hover]:bg-transparent">
                              <TableBody>
                                {discountTypes.map((type, index) => {
                                  const isSelected = type.isSelected
                                  const isExpanded = expandedDiscountRows[index] || false
                                  return (
                                    <React.Fragment key={type.id}>
                                      <TableRow>
                                        <TableCell className={`w-8 pr-0 ${tableTextClassName}`} style={{ color: '#1a1a1a' }}>
                                          <RadioGroup value={selectedDiscount} onValueChange={handleSelectDiscount}>
                                            <RadioGroupItem value={String(index)} />
                                          </RadioGroup>
                                        </TableCell>
                                        <TableCell className={`w-20 ${tableTextClassName}`} style={{ color: '#1a1a1a' }}>
                                          <Input
                                            type="number"
                                            className="w-[90px] h-10 text-base"
                                            min={1}
                                            placeholder="To"
                                            disabled={!isSelected}
                                            value={type.to1}
                                            onChange={e =>
                                              handleDiscountFieldChange(index, 'to1', e.target.value)
                                            }
                                          />
                                        </TableCell>
                                        <TableCell className={tableTextClassName} style={{ color: '#1a1a1a' }}>
                                          <span className="text-base whitespace-nowrap">
                                            {discountOnLabels[index]}
                                          </span>
                                        </TableCell>
                                        <TableCell className={tableTextClassName} style={{ color: '#1a1a1a' }}>
                                          <Select
                                            disabled={!isSelected}
                                            value={type.discountOn}
                                            onValueChange={val =>
                                              handleDiscountFieldChange(index, 'discountOn', val)
                                            }
                                          >
                                            <SelectTrigger className="w-full min-w-[140px] h-10 text-base">
                                              <SelectValue placeholder="Select Discount On" />
                                            </SelectTrigger>
                                            <SelectContent>
                                              <SelectItem value="A">Lowest MRP</SelectItem>
                                              <SelectItem value="B">Highest MRP</SelectItem>
                                              <SelectItem value="C">Lowest RSP</SelectItem>
                                              <SelectItem value="D">Highest RSP</SelectItem>
                                            </SelectContent>
                                          </Select>
                                        </TableCell>
                                        <TableCell className="w-10">
                                          <Button
                                            type="button"
                                            size="sm"
                                            className="bg-blue-600 hover:bg-blue-700 text-white px-3"
                                            onClick={() => toggleDiscountRowExpand(index)}
                                          >
                                            {isExpanded ? '-' : '+'}
                                          </Button>
                                        </TableCell>
                                      </TableRow>

                                      {isExpanded && (
                                        <TableRow className="bg-blue-50/50 hover:bg-blue-50/50">
                                          <TableCell colSpan={5} className="py-3 px-4">
                                            <div className="flex flex-wrap gap-x-4 gap-y-3 items-center">
                                              <span className="text-base font-semibold" style={{ color: '#1a1a1a' }}>
                                                Where
                                              </span>
                                              <div className="flex flex-col gap-1">
                                                <Label className="text-sm" style={{ color: '#1a1a1a' }}>
                                                  Condition
                                                </Label>
                                                <Select
                                                  disabled={!isSelected}
                                                  value={type.condition}
                                                  onValueChange={val =>
                                                    handleDiscountFieldChange(index, 'condition', val)
                                                  }
                                                >
                                                  <SelectTrigger className="w-32 h-10 text-base">
                                                    <SelectValue placeholder="Select" />
                                                  </SelectTrigger>
                                                  <SelectContent>
                                                    <SelectItem value="A">MRP</SelectItem>
                                                    <SelectItem value="B">RSP</SelectItem>
                                                    <SelectItem value="C">WSP</SelectItem>
                                                  </SelectContent>
                                                </Select>
                                              </div>
                                              <div className="flex flex-col gap-1">
                                                <Label className="text-sm" style={{ color: '#1a1a1a' }}>
                                                  Comparison
                                                </Label>
                                                <Select
                                                  disabled={!isSelected}
                                                  value={type.comparison}
                                                  onValueChange={val =>
                                                    handleDiscountFieldChange(index, 'comparison', val)
                                                  }
                                                >
                                                  <SelectTrigger className="w-36 h-10 text-base">
                                                    <SelectValue placeholder="Select" />
                                                  </SelectTrigger>
                                                  <SelectContent>
                                                    <SelectItem value="A">Less than</SelectItem>
                                                    <SelectItem value="B">Greater than</SelectItem>
                                                    <SelectItem value="C">In Between</SelectItem>
                                                  </SelectContent>
                                                </Select>
                                              </div>
                                              {type.comparison === 'C' ? (
                                                <>
                                                  <div className="flex flex-col gap-1">
                                                    <Label className="text-sm text-gray-500">From</Label>
                                                    <Input
                                                      className="w-[90px] h-10 text-base"
                                                      type="number"
                                                      disabled={!isSelected}
                                                      placeholder="From"
                                                      value={type.from}
                                                      onChange={e =>
                                                        handleDiscountFieldChange(index, 'from', e.target.value)
                                                      }
                                                    />
                                                  </div>
                                                  <div className="flex flex-col gap-1">
                                                    <Label className="text-sm text-gray-500">To</Label>
                                                    <Input
                                                      className="w-[90px] h-10 text-base"
                                                      type="number"
                                                      disabled={!isSelected}
                                                      placeholder="To"
                                                      value={type.to}
                                                      onChange={e =>
                                                        handleDiscountFieldChange(index, 'to', e.target.value)
                                                      }
                                                    />
                                                  </div>
                                                </>
                                              ) : type.comparison ? (
                                                <div className="flex flex-col gap-1">
                                                  <Label className="text-sm text-gray-500">Value</Label>
                                                  <Input
                                                    className="w-[90px] h-10 text-base"
                                                    type="number"
                                                    disabled={!isSelected}
                                                    placeholder="Value"
                                                    value={type.from}
                                                    onChange={e =>
                                                      handleDiscountFieldChange(index, 'from', e.target.value)
                                                    }
                                                  />
                                                </div>
                                              ) : null}
                                            </div>
                                          </TableCell>
                                        </TableRow>
                                      )}
                                    </React.Fragment>
                                  )
                                })}
                              </TableBody>
                            </Table>
                          </div>
                        </div>
                      </div>
                    </div>

                  </div>
                )}
              </form>
            </div>

            <div className="w-full flex justify-end gap-3 px-6 py-4 border-t border-slate-300 shadow-[0_-4px_10px_rgba(15,23,42,0.08)] flex-shrink-0" style={{ background: '#fff' }}>
              <Button
                type="button"
                className="bg-slate-900 hover:bg-slate-800 text-base text-white"
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </Button>
              {!isViewMode && (
                <Button
                  type="submit"
                  form="promotion-form"
                  disabled={isSubmitting}
                  className="bg-blue-600 hover:bg-blue-700 text-base text-white disabled:opacity-60"
                >
                  {isSubmitting ? 'Saving...' : 'Save'}
                </Button>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={assortmentModalOpen} onOpenChange={setAssortmentModalOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">Select an Assortment</DialogTitle>
          </DialogHeader>
          {assortmentModalLoading ? (
            <p className="text-sm text-gray-500 py-4 text-center">Loading Assortments...</p>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>No.</TableHead>
                    <TableHead>Assortment Name</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedAssortments.map((assortment, ind) => (
                    <TableRow key={assortment.assortmentID}>
                      <TableCell>{(assortmentModalPage - 1) * ITEMS_PER_PAGE + ind + 1}</TableCell>
                      <TableCell>{assortment.assortmentName}</TableCell>
                      <TableCell>
                        <Button
                          type="button"
                          className="bg-blue-600 hover:bg-blue-700 text-base text-white"
                          onClick={() => handleSelectAssortment(assortment)}
                        >
                          Select
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {paginatedAssortments.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center">
                        No assortments found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
              <div className="flex justify-between items-center mt-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={assortmentModalPage === 1}
                  onClick={() => setAssortmentModalPage(p => p - 1)}
                >
                  Prev
                </Button>
                <span className="text-sm text-gray-600">
                  Page {assortmentModalPage} of {assortmentTotalPages}
                </span>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={assortmentModalPage === assortmentTotalPages}
                  onClick={() => setAssortmentModalPage(p => p + 1)}
                >
                  Next
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default PromotionSetupTest