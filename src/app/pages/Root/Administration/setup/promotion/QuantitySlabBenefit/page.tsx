import { Eye, Plus, Trash } from 'lucide-react'
import React, { useMemo, useState, useEffect } from 'react'
import { toast } from 'sonner'

import ListingPage, { ColumnDef } from '@/components/ListingTable/ListingPage'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
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
}

type BenefitSelection = {
  assortmentID: number | null
  assortmentName: string
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

const QuantitySlabBenefit = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [promotions, setPromotions] = useState<FetchedPromotionType[]>([])
  const [promotionsLoading, setPromotionsLoading] = useState(false)
  const [editPromotion, setEditPromotion] = useState<FetchedPromotionType | null>(null)
  const [isViewMode, setIsViewMode] = useState(false)
  const [isFetchingPromotion, setIsFetchingPromotion] = useState(false)

  const fetchPromotions = () => {
    setPromotionsLoading(true)
    GetAPI(
      '/api/Promotion/GetAllPromotion?promotionType=Q',
      '',
      { PromotionID: 0 },
      {}
    )
      .then((res: { data?: FetchedPromotionType[] }) => setPromotions(res.data || []))
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

  // Buy Assortment state
  const [buyAssortments, setBuyAssortments] = useState<BuyAssortmentRow[]>([])

  // Assortment selection modal state
  const [assortmentModalOpen, setAssortmentModalOpen] = useState(false)
  const [assortmentModalData, setAssortmentModalData] = useState<AssortmentItem[]>([])
  const [assortmentModalLoading, setAssortmentModalLoading] = useState(false)
  const [assortmentModalPage, setAssortmentModalPage] = useState(1)
  const [activeRowIndex, setActiveRowIndex] = useState<number | null>(null)
  const [assortmentModalTarget, setAssortmentModalTarget] = useState<'buy' | 'benefit'>('buy')

  const handleOpenAssortmentModal = async (target: 'buy' | 'benefit', rowIndex?: number) => {
    setAssortmentModalTarget(target)
    setActiveRowIndex(target === 'buy' ? (rowIndex ?? null) : null)
    setAssortmentModalPage(1)
    setAssortmentModalOpen(true)
    setAssortmentModalLoading(true)
    try {
      const res = await GetAPI(
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
            ? { assortmentID: assortment.assortmentID, assortmentName: assortment.assortmentName }
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

  const handleDeleteAssortmentRow = (index: number) => {
    setBuyAssortments(prev => prev.filter((_, i) => i !== index))
  }

  const handleAddAssortmentRow = () => {
    setBuyAssortments(prev => [
      ...prev,
      { assortmentID: null, assortmentName: 'Select Assortment' },
    ])
  }

  const assortmentTotalPages = Math.max(1, Math.ceil(assortmentModalData.length / ITEMS_PER_PAGE))
  const paginatedAssortments = assortmentModalData.slice(
    (assortmentModalPage - 1) * ITEMS_PER_PAGE,
    assortmentModalPage * ITEMS_PER_PAGE
  )

  // Define Slab state
  const [slabRows, setSlabRows] = useState<{ fromQty: string; toQty: string }[]>([])

  const handleSlabChange = (index: number, field: 'fromQty' | 'toQty', value: string) => {
    setSlabRows(prev => prev.map((row, i) => (i === index ? { ...row, [field]: value } : row)))
  }

  const handleAddSlabRow = () => {
    setSlabRows(prev => [...prev, { fromQty: '', toQty: '' }])
    resetDiscountSection()
  }

  const handleDeleteSlabRow = (index: number) => {
    setSlabRows(prev => prev.filter((_, i) => i !== index))
  }

  // Discount Type state
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

  type SubmittedSlabRow = {
    lineNum: number
    fromQty: string
    toQty: string
    benefit: {
      benifitID: string
      value: string
      assortmentID: number | null
      assortmentName: string
    }
    discount: {
      discountID: string
      to1: string
      discountOn: string
      condition: string
      comparison: string
      from: string
      to: string
    }
  }

  const discountOnLabels = [
    '% of Discount on',
    'Rs of Discount on',
    'Rs Fixed Amount on',
  ]

  const createDefaultDiscountTypes = (): DiscountTypeRow[] => ([
    { id: 0, to1: '', discountOn: '', condition: '', comparison: '', from: '', to: '', isSelected: true },
    { id: 1, to1: '', discountOn: '', condition: '', comparison: '', from: '', to: '', isSelected: false },
    { id: 2, to1: '', discountOn: '', condition: '', comparison: '', from: '', to: '', isSelected: false },
  ])

  const [discountTypes, setDiscountTypes] = useState<DiscountTypeRow[]>(createDefaultDiscountTypes)
  const [submittedSlabs, setSubmittedSlabs] = useState<SubmittedSlabRow[]>([])
  const [editingSlabLineNum, setEditingSlabLineNum] = useState<number | null>(null)
  const [selectedDiscount, setSelectedDiscount] = useState('0')
  const [expandedDiscountRows, setExpandedDiscountRows] = useState<Record<number, boolean>>({})

  const resetDiscountSection = () => {
    setDiscountTypes(createDefaultDiscountTypes())
    setSelectedDiscount('0')
    setExpandedDiscountRows({})
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

  const [formData, setFormData] = useState({
    promotionName: '',
    details: '',
    appliedOn: '',
    promotionType: 'Q',
    inactive: false,
  })

  const [benefitType, setBenefitType] = useState('F')
  const [benefitQuantity, setBenefitQuantity] = useState('')
  const [benefitAssortment, setBenefitAssortment] = useState<BenefitSelection>({
    assortmentID: null,
    assortmentName: 'Select Assortment',
  })

  const [isSubmitting, setIsSubmitting] = useState(false)

  const getBenefitTypeLabel = (type: string) => {
    if (type === 'S') return 'Specific Unit from Paid From Assortment'
    if (type === 'B') return 'Specific Unit from Benefit Assortment'
    return 'Flat Discount'
  }

  const handleBenefitTypeChange = (value: string) => {
    setBenefitType(value)
    if (value === 'F') {
      setBenefitQuantity('')
      setBenefitAssortment({ assortmentID: null, assortmentName: 'Select Assortment' })
    }
  }

  const handleSubmitSlabRow = () => {
    const validSlabRows = slabRows.filter(row => row.fromQty.trim() !== '' && row.toQty.trim() !== '')

    if (validSlabRows.length === 0) {
      toast.error('Please add From Qty and To Qty before submitting slab.', {
        style: { backgroundColor: '#f7edeb', color: '#ff6242' },
      })
      return
    }

    const selectedDiscountRow = discountTypes.find(r => r.isSelected)
    if (!selectedDiscountRow || selectedDiscountRow.to1.trim() === '') {
      toast.error('Please enter a discount value before submitting slab.', {
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

    const slabBenefit = {
      benifitID: benefitType,
      value: benefitType === 'F' ? '0' : benefitQuantity,
      assortmentID: benefitType === 'F' ? 0 : benefitAssortment.assortmentID,
      assortmentName: benefitType === 'F' ? '' : benefitAssortment.assortmentName,
    }

    if (editingSlabLineNum !== null) {
      const row = validSlabRows[0]
      if (!row) return
      setSubmittedSlabs(prev =>
        prev.map(item =>
          item.lineNum === editingSlabLineNum
            ? {
                ...item,
                fromQty: row.fromQty,
                toQty: row.toQty,
                benefit: slabBenefit,
                discount: {
                  discountID: selectedDiscount,
                  to1: selectedDiscountRow.to1,
                  discountOn: selectedDiscountRow.discountOn,
                  condition: selectedDiscountRow.condition,
                  comparison: selectedDiscountRow.comparison,
                  from: selectedDiscountRow.from,
                  to: selectedDiscountRow.to,
                },
              }
            : item
        )
      )
      setEditingSlabLineNum(null)
    } else {
      const lastLineNum = submittedSlabs.reduce((max, row) => Math.max(max, row.lineNum), 0)
      const slabDiscountEntries: SubmittedSlabRow[] = validSlabRows.map((row, index) => ({
        lineNum: lastLineNum + index + 1,
        fromQty: row.fromQty,
        toQty: row.toQty,
        benefit: slabBenefit,
        discount: {
          discountID: selectedDiscount,
          to1: selectedDiscountRow.to1,
          discountOn: selectedDiscountRow.discountOn,
          condition: selectedDiscountRow.condition,
          comparison: selectedDiscountRow.comparison,
          from: selectedDiscountRow.from,
          to: selectedDiscountRow.to,
        },
      }))

      setSubmittedSlabs(prev => [...prev, ...slabDiscountEntries])
    }

    setSlabRows([])
    resetDiscountSection()

    toast.success('Slab row submitted successfully.', {
      style: { backgroundColor: '#e3ffea', color: '#3ed665' },
    })
  }

  const applyDiscountConfigToPanel = (discount: SubmittedSlabRow['discount']) => {
    const discountIdx = Number(discount.discountID)
    const selectedIdx = Number.isNaN(discountIdx) ? 0 : discountIdx
    setSelectedDiscount(String(selectedIdx))
    setDiscountTypes(prev =>
      prev.map((row, i) => ({
        ...row,
        isSelected: i === selectedIdx,
        ...(i === selectedIdx
          ? {
              to1: discount.to1,
              discountOn: discount.discountOn,
              condition: discount.condition,
              comparison: discount.comparison,
              from: discount.from,
              to: discount.to,
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
    setExpandedDiscountRows({ [selectedIdx]: true })
  }

  const handleEditSubmittedSlab = (lineNum: number) => {
    const slab = submittedSlabs.find(row => row.lineNum === lineNum)
    if (!slab) return

    setEditingSlabLineNum(lineNum)
    setSlabRows([{ fromQty: slab.fromQty, toQty: slab.toQty }])
    handleBenefitTypeChange(slab.benefit.benifitID)
    setBenefitQuantity(slab.benefit.benifitID === 'F' ? '' : slab.benefit.value)
    setBenefitAssortment({
      assortmentID: slab.benefit.benifitID === 'F' ? null : slab.benefit.assortmentID,
      assortmentName: slab.benefit.benifitID === 'F' ? 'Select Assortment' : slab.benefit.assortmentName,
    })
    applyDiscountConfigToPanel(slab.discount)
  }

  const handleDeleteSubmittedSlab = (lineNum: number) => {
    setSubmittedSlabs(prev => prev.filter(row => row.lineNum !== lineNum))

    if (editingSlabLineNum === lineNum) {
      setEditingSlabLineNum(null)
      setSlabRows([])
      handleBenefitTypeChange('F')
      resetDiscountSection()
    }
  }

  const resetForm = () => {
    setFormData({
      promotionName: '',
      details: '',
      appliedOn: '',
      promotionType: 'Q',
      inactive: false,
    })
    setBuyAssortments([])
    setBenefitType('F')
    setBenefitQuantity('')
    setBenefitAssortment({ assortmentID: null, assortmentName: 'Select Assortment' })
    setSlabRows([])
    setSubmittedSlabs([])
    setEditingSlabLineNum(null)
    resetDiscountSection()
  }

  const loadPromotionData = async (promotionID: number) => {
    setIsFetchingPromotion(true)
    try {
      const res = await GetAPI('/api/Promotion/GetPromotion', '', { PromotionID: promotionID }, {})
      const data: FetchedPromotionType = res.data
      setFormData({
        promotionName: data.promotionName,
        details: data.details,
        appliedOn: data.appliedOn,
        promotionType: data.promotionType,
        inactive: data.isActive === 'Y',
      })
      setBuyAssortments(
        data.objAssortment.map(a => ({
          assortmentID: a.assortmentID,
          assortmentName: a.assortmentName,
        }))
      )
      setSlabRows([])

      const values = data.objValue as { lineNum?: number; fromValue: number; toValue: number }[]
      const discounts = data.objDiscount as {
        slabLineNum?: number
        discountID?: string
        toValue?: number
        dropDown1?: string
        dropDown2?: string
        dropDown3?: string
        fromValue?: number
        value?: number
      }[]
      const benefits = data.objBenifit as {
        slabLineNum?: number
        benifitID?: string
        value?: number
        assortmentID?: number
        assortmentName?: string
      }[]
      const discountMap = new Map<number, (typeof discounts)[number]>()
      const benefitMap = new Map<number, (typeof benefits)[number]>()
      const fallbackBenefit = benefits[0]
      discounts.forEach((d, idx) => {
        const slabLine = d.slabLineNum && d.slabLineNum > 0 ? d.slabLineNum : idx + 1
        discountMap.set(slabLine, d)
      })
      benefits.forEach((b) => {
        if (b.slabLineNum && b.slabLineNum > 0) {
          benefitMap.set(b.slabLineNum, b)
        }
      })

      const submitted = values.map((v, i) => {
        const lineNum = v.lineNum && v.lineNum > 0 ? v.lineNum : i + 1
        const discount = discountMap.get(lineNum)
        const benefit = benefitMap.get(lineNum) || fallbackBenefit
        return {
          lineNum,
          fromQty: String(v.fromValue),
          toQty: String(v.toValue),
          benefit: {
            benifitID: benefit?.benifitID ?? 'F',
            value: benefit && benefit.value !== undefined ? String(benefit.value) : '0',
            assortmentID: benefit?.assortmentID ?? 0,
            assortmentName: benefit?.assortmentName ?? '',
          },
          discount: {
            discountID: discount?.discountID ?? '0',
            to1: discount ? String(discount.toValue) : '',
            discountOn: discount?.dropDown1?.trim() ?? '',
            condition: discount?.dropDown2?.trim() ?? '',
            comparison: discount?.dropDown3?.trim() ?? '',
            from: discount ? String(discount.fromValue) : '',
            to: discount ? String(discount.value) : '',
          },
        }
      })
      setSubmittedSlabs(submitted)

      if (submitted.length > 0) {
        const firstBenefit = submitted[0].benefit
        handleBenefitTypeChange(firstBenefit.benifitID)
        setBenefitQuantity(firstBenefit.benifitID === 'F' ? '' : firstBenefit.value)
        setBenefitAssortment({
          assortmentID: firstBenefit.benifitID === 'F' ? null : firstBenefit.assortmentID,
          assortmentName: firstBenefit.benifitID === 'F'
            ? 'Select Assortment'
            : (firstBenefit.assortmentName || 'Select Assortment'),
        })
      } else {
        handleBenefitTypeChange('F')
      }

      setEditingSlabLineNum(null)
      resetDiscountSection()
    } catch {
      toast.error('Failed to load promotion details.', {
        style: { backgroundColor: '#f7edeb', color: '#ff6242' },
      })
      setIsModalOpen(false)
    } finally {
      setIsFetchingPromotion(false)
    }
  }

  const getCookieValue = (name: string): string | null => {
    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'))
    return match ? match[2] : null
  }

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      const selectedDiscountRow = discountTypes.find(r => r.isSelected)
      const fallbackSlabs = slabRows.filter(row => row.fromQty.trim() !== '' && row.toQty.trim() !== '')
      const fallbackBenefit = {
        benifitID: benefitType,
        value: benefitType === 'F' ? '0' : benefitQuantity,
        assortmentID: benefitType === 'F' ? 0 : benefitAssortment.assortmentID,
        assortmentName: benefitType === 'F' ? '' : benefitAssortment.assortmentName,
      }
      const slabPayloadRows: SubmittedSlabRow[] = submittedSlabs.length > 0
        ? submittedSlabs
        : selectedDiscountRow
          ? fallbackSlabs.map((row, index) => ({
              lineNum: index + 1,
              fromQty: row.fromQty,
              toQty: row.toQty,
              benefit: fallbackBenefit,
              discount: {
                discountID: selectedDiscount,
                to1: selectedDiscountRow.to1,
                discountOn: selectedDiscountRow.discountOn,
                condition: selectedDiscountRow.condition,
                comparison: selectedDiscountRow.comparison,
                from: selectedDiscountRow.from,
                to: selectedDiscountRow.to,
              },
            }))
          : []

      const payload = {
        promotionID: editPromotion ? editPromotion.promotionID : 0,
        promotionName: formData.promotionName,
        details: formData.details,
        appliedOn: formData.appliedOn,
        promotionType: formData.promotionType,
        isActive: formData.inactive ? 'Y' : 'N', //! Change on 12-05-2026
        storeID: getCookieValue('DefaultStoreId') || 0,
        enteredBy: getCookieValue('UserId') || 0,
        usedFor: editPromotion ? 'U' : 'I',
        // objCondition => Paid for Condition — passed as empty (blank)
        objCondition: [],
        // objAssortment => Buy Assortment
        objAssortment: buyAssortments
          .filter(r => r.assortmentID !== null)
          .map(r => ({
            promotionID: 0,
            assortmentID: r.assortmentID,
            assortmentName: r.assortmentName,
            value: 0,
          })),
        // objBenifit => Benefit Type
        objBenifit: slabPayloadRows.map((row) => ({
          promotionID: 0,
          benifitID: row.benefit.benifitID,
          value: row.benefit.value !== '' ? Number(row.benefit.value) : 0,
          assortmentID: row.benefit.assortmentID ?? 0,
          assortmentName: row.benefit.assortmentName ?? '',
          slabLineNum: row.lineNum || 0,
        })),
        // objValue => Define Slab
        objValue: slabPayloadRows.map((row, i) => ({
          promotionID: 0,
          lineNum: row.lineNum || i + 1,
          fromValue: row.fromQty !== '' ? Number(row.fromQty) : 0,
          toValue: row.toQty !== '' ? Number(row.toQty) : 0,
        })),
        // objDiscount => Discount Type
        objDiscount: slabPayloadRows.map((row) => ({
          promotionID: 0,
          discountID: row.discount.discountID,
          value: row.discount.to !== '' ? Number(row.discount.to) : 0,
          dropDown1: row.discount.discountOn ?? '',
          dropDown2: row.discount.condition ?? '',
          dropDown3: row.discount.comparison ?? '',
          fromValue: row.discount.from !== '' ? Number(row.discount.from) : 0,
          toValue: row.discount.to1 !== '' ? Number(row.discount.to1) : 0,
          slabLineNum: row.lineNum || 0,
        })),
      }

      const response = await PostAPI('/api/PromotionRep/PostPromotion', '', payload, '')

      if (response.data[0].returnCode === 'Y') {
        toast.success(response.data[0].returnMsg || 'Promotion saved successfully!', {
          style: { backgroundColor: '#e3ffea', color: '#3ed665' },
        })
        setIsModalOpen(false)
        fetchPromotions()

      } else if (
        response.data[0].returnCode === 'F' ||
        response.data[0].returnCode === 'N'
      ) {
        toast.error(response.data[0].returnMsg, {
          style: { backgroundColor: '#f7edeb', color: '#ff6242' },
        })
      } else {
        toast.error('Failed to save promotion. Please try again.', {
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

  const promotionStats = useMemo(() => ([
    { label: 'Total', value: promotions.length, icon: '🧾', iconClass: 'blue' as const, filterKey: 'all' },
    {
      label: 'Active',
      value: promotions.filter((item) => item.isActive?.trim() === 'Y').length,
      icon: '✅',
      iconClass: 'green' as const,
      filterKey: 'active',
    },
    {
      label: 'Inactive',
      value: promotions.filter((item) => item.isActive?.trim() === 'N').length,
      icon: '⏸️',
      iconClass: 'amber' as const,
      filterKey: 'inactive',
    },
  ]), [promotions])

  const promotionFilterChips = useMemo(() => ([
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
  ]), [])

  return (
    <div className="p-6">
      {/* Promotion Listing */}
      <div style={{ height: 'calc(100vh - 180px)', display: 'flex', flexDirection: 'column' }}>
        <ListingPage<FetchedPromotionType>
          title="Quantity Slab Benefit"
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
          defaultSortDir="desc"
          pageSize={8}
          onView={handleViewPromotion}
          onEdit={handleEditPromotion}
          primaryAction={{ label: '+ Add Promotion', onClick: handleCreatePromotion }}
          emptyText="No promotions found"
        />
      </div>

      {/* Promotion Setup Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-none w-screen h-screen max-h-screen overflow-hidden p-0 m-0 rounded-none gap-0 border-0 shadow-none" style={{background: '#d6eaf8'}}>
          <div className="flex flex-col h-screen" style={{background: '#d6eaf8'}}>
            {/* Header */}
            <DialogHeader className="px-6 py-4 border-b flex-shrink-0 shadow-sm">
              <DialogTitle className="text-xl font-semibold" style={{color: 'black'}}>
                {editPromotion
                  ? isViewMode
                    ? 'View Promotion Setup - Quantity Slab Based'
                    : 'Edit Promotion Setup - Quantity Slab Based'
                  : 'Create Promotion Setup - Quantity Slab Based'}
              </DialogTitle>
            </DialogHeader>

            {/* Content */}
            <div className="flex-1 overflow-y-auto">
                <form id="promotion-form" onSubmit={handleSubmit} className="p-6 space-y-6 max-w-7xl mx-auto">
                {isFetchingPromotion ? (
                  <div className="flex items-center justify-center h-64">
                    <p className="text-gray-500 text-sm">Loading promotion details...</p>
                  </div>
                ) : (
                <div className={isViewMode ? 'pointer-events-none select-none space-y-6' : 'space-y-6'}>
                {/* Promotion Information Section */}
                <div className=" border border-gray-200 rounded-lg p-6 shadow-sm">
                  <div className="mb-6">
                    <h2 className="text-lg font-semibold pb-2 border-b border-gray-100" style={{color: 'black'}}>Promotion Information</h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Promotion ID */}
                    <div className="space-y-2">
                      <Label className="text-sm font-medium " style={{color: 'black'}}>
                        Promotion ID
                        <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        value="Auto-generated promotion ID"
                        disabled
                        className="bg-gray-100 text-gray-500"
                      />
                    </div>

                    {/* Promotion Name */}
                    <div className="space-y-2">
                      <Label className="text-sm font-medium " style={{color: 'black'}}>
                        Promotion Name
                        <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        placeholder="Enter promotion name"
                        value={formData.promotionName}
                        onChange={(e) => handleInputChange('promotionName', e.target.value)}
                        className={formData.promotionName ? 'border-gray-300' : 'border-red-300 focus-visible:ring-red-500'}
                        required
                      />
                    </div>
                  </div>

                  {/* Details */}
                  <div className="space-y-2 mt-6">
                    <Label className="text-sm font-medium " style={{color: 'black'}}>
                      Details
                      <span className="text-red-500">*</span>
                    </Label>
                    <Textarea
                      placeholder="Enter promotion details and description"
                      value={formData.details}
                      onChange={(e) => handleInputChange('details', e.target.value)}
                      className="min-h-[80px] resize-none"
                      required
                    />
                  </div>

                  {/* Applied On */}
                  <div className="space-y-2 mt-6" style={{color: 'black'}}>
                    <Label className="text-sm font-medium " style={{color: 'black'}}>
                      Applied On
                      <span className="text-red-500">*</span>
                    </Label>
                    <Select value={formData.appliedOn} onValueChange={(value) => handleInputChange('appliedOn', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select application type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="E">Applied On Each Item</SelectItem>
                        <SelectItem value="B">Applied On Bill Item</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Promotion Type */}
                  <div className="space-y-4 mt-6">
                    <Label className="text-sm font-medium " style={{color: 'black'}}>
                      Promotion Type
                      <span className="text-red-500">*</span>
                    </Label>
                    <RadioGroup
                      value={formData.promotionType}
                      onValueChange={(value) => handleInputChange('promotionType', value)}
                      className="space-y-3"
                    >
                      {/* <div className="flex items-center space-x-3">
                        <RadioGroupItem value="free-quantity-benefit" id="free-quantity" />
                        <Label htmlFor="free-quantity" className="text-sm font-normal cursor-pointer">
                          Free Quantity Benefit
                        </Label>
                      </div> */}
                      <div className="flex items-center space-x-3">
                        <RadioGroupItem value="Q" id="quantity-slab" />
                        <Label htmlFor="quantity-slab" className="text-sm font-normal cursor-pointer" style={{color: 'black'}}>
                          Quantity Slab Benefit
                        </Label>
                      </div>
                      {/* <div className="flex items-center space-x-3">
                        <RadioGroupItem value="bill-value-slab-benefit" id="bill-value-slab" />
                        <Label htmlFor="bill-value-slab" className="text-sm font-normal cursor-pointer">
                          Bill Value Slab Benefit
                        </Label>
                      </div> */}
                    </RadioGroup>
                  </div>

                  {/* Inactive Checkbox */}
                  <div className="flex items-center space-x-3 mt-6">
                    <Checkbox
                      id="inactive"
                      checked={formData.inactive}
                      onCheckedChange={(checked) => handleInputChange('inactive', checked as boolean)}
                    />
                    <Label htmlFor="inactive" className="text-sm font-normal cursor-pointer" style={{color: 'black'}}>
                      IsActive
                    </Label>
                  </div>
                </div>

                {/* Buy Assortment Section */}
                <div className=" border border-gray-200 rounded-lg p-6 shadow-sm">
                  <h3 className="text-lg font-semibold mb-4 pb-2 border-b border-gray-100" style={{color: 'black'}}>Buy Assortment</h3>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[50px]" style={{color: 'black'}}>No.</TableHead>
                          <TableHead style={{color: 'black'}}>Assortment Name</TableHead>
                          <TableHead className="w-[60px] text-center" style={{color: 'black'}}>Show</TableHead>
                          <TableHead className="w-[60px] text-center" style={{color: 'black'}}>Delete</TableHead>
                          <TableHead className="w-[60px] text-center" style={{color: 'black'}}>Add</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {buyAssortments.map((row, index) => (
                          <TableRow key={index}>
                            <TableCell style={{color: 'black'}}>{index + 1}</TableCell>
                            <TableCell style={{color: 'black'}}>{row.assortmentName}</TableCell>
                            <TableCell className="text-center" style={{color: 'black'}}>
                              <Eye className="h-4 w-4 text-gray-500 cursor-pointer mx-auto" />
                            </TableCell>
                            <TableCell className="text-center" style={{color: 'black'}}>
                              <Trash
                                className="h-4 w-4 text-red-500 cursor-pointer mx-auto"
                                onClick={() => handleDeleteAssortmentRow(index)}
                              />
                            </TableCell>
                            <TableCell className="text-center" style={{color: 'black'}}>
                              <Plus
                                className="h-4 w-4 text-blue-600 cursor-pointer mx-auto"
                                onClick={() => handleOpenAssortmentModal('buy', index)}
                              />
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                  <div className="mt-4">
                    <Button
                      type="button"
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                      onClick={handleAddAssortmentRow}
                    >
                      Add Assortment
                    </Button>
                  </div>
                </div>

                {/* Assortment Selection Modal */}
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
                                <TableCell style={{color: 'black'}}>{(assortmentModalPage - 1) * ITEMS_PER_PAGE + ind + 1}</TableCell>
                                <TableCell style={{color: 'black'}}>{assortment.assortmentName}</TableCell>
                                <TableCell>
                                  <Button
                                    type="button"
                                    className="bg-blue-600 hover:bg-blue-700 text-white"
                                    onClick={() => handleSelectAssortment(assortment)}
                                  >
                                    Select
                                  </Button>
                                </TableCell>
                              </TableRow>
                            ))}
                            {paginatedAssortments.length === 0 && (
                              <TableRow>
                                <TableCell colSpan={3} className="text-center" style={{color: 'black'}}>No assortments found</TableCell>
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

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
                  {/* Left Column - Define Slab */}
                  <div className=" border border-gray-200 rounded-lg p-6 shadow-sm">
                    <h3 className="text-lg font-semibold mb-4 pb-2 border-b border-gray-100" style={{color: 'black'}}>Define Slab</h3>
                    <div className="overflow-x-auto">
                      <Table className="[&_tr:hover]:bg-transparent">
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-[50px]" style={{color: 'black'}}>No.</TableHead>
                            <TableHead style={{color: 'black'}}>From Qty</TableHead>
                            <TableHead style={{color: 'black'}}>To Qty</TableHead>
                            <TableHead className="w-[60px] text-center" style={{color: 'black'}}>Delete</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {slabRows.map((row, index) => (
                            <TableRow key={index}>
                              <TableCell style={{color: 'black'}}>{index + 1}</TableCell>
                              <TableCell>
                                <Input
                                  type="text"
                                  inputMode="numeric"
                                  placeholder="From Qty"
                                  value={row.fromQty}
                                  onChange={e => handleSlabChange(index, 'fromQty', e.target.value)}
                                  className="w-full"
                                />
                              </TableCell>
                              <TableCell>
                                <Input
                                  type="text"
                                  inputMode="numeric"
                                  placeholder="To Qty"
                                  value={row.toQty}
                                  onChange={e => handleSlabChange(index, 'toQty', e.target.value)}
                                  className="w-full"
                                />
                              </TableCell>
                              <TableCell className="text-center">
                                <Trash
                                  className="h-4 w-4 text-red-500 cursor-pointer mx-auto"
                                  onClick={() => handleDeleteSlabRow(index)}
                                />
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                    <div className="flex gap-3 mt-4">
                      <Button
                        type="button"
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                        onClick={handleAddSlabRow}
                      >
                        Add Row
                      </Button>
                      <Button type="button" className="bg-blue-600 hover:bg-blue-700 text-white" onClick={handleSubmitSlabRow}>
                        {editingSlabLineNum !== null ? 'Update Slab' : 'Submit'}
                      </Button>
                      {editingSlabLineNum !== null && (
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => {
                            setEditingSlabLineNum(null)
                            setSlabRows([])
                            handleBenefitTypeChange('F')
                            resetDiscountSection()
                          }}
                        >
                          Cancel Edit
                        </Button>
                      )}
                    </div>

                    {submittedSlabs.length > 0 && (
                      <div className="mt-5 overflow-x-auto">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead className="w-[50px]" style={{color: 'black'}}>No.</TableHead>
                              <TableHead style={{color: 'black'}}>From Qty</TableHead>
                              <TableHead style={{color: 'black'}}>To Qty</TableHead>
                              <TableHead style={{color: 'black'}}>Benefit Type</TableHead>
                              <TableHead style={{color: 'black'}}>Discount</TableHead>
                              <TableHead className="w-[160px] text-center" style={{color: 'black'}}>Action</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {submittedSlabs.map((row, index) => (
                              <TableRow key={`${row.fromQty}-${row.toQty}-${index}`}>
                                <TableCell style={{color: 'black'}}>{index + 1}</TableCell>
                                <TableCell style={{color: 'black'}}>{row.fromQty}</TableCell>
                                <TableCell style={{color: 'black'}}>{row.toQty}</TableCell>
                                <TableCell style={{color: 'black'}}>
                                  {row.benefit.benifitID === 'F'
                                    ? 'Flat Discount'
                                    : `${getBenefitTypeLabel(row.benefit.benifitID)} (${row.benefit.value}${row.benefit.assortmentName ? `, ${row.benefit.assortmentName}` : ''})`}
                                </TableCell>
                                <TableCell style={{color: 'black'}}>
                                  {row.discount.to1}{row.discount.discountID === '0' ? '%' : ' Rs'}
                                </TableCell>
                                <TableCell className="text-center">
                                  {!isViewMode && (
                                    <div className="flex items-center justify-center gap-2">
                                      <Button
                                        type="button"
                                        size="sm"
                                        variant="outline"
                                        onClick={() => handleEditSubmittedSlab(row.lineNum)}
                                        style={{color: 'white', backgroundColor: '#2563eb', borderColor: '#2563eb'}}
                                      >
                                        Edit
                                      </Button>
                                      <Button
                                        type="button"
                                        size="sm"
                                        variant="outline"
                                        style={{color: 'white', backgroundColor: '#dc2626', borderColor: '#dc2626'}}
                                        onClick={() => handleDeleteSubmittedSlab(row.lineNum)}
                                      >
                                        Delete
                                      </Button>
                                    </div>
                                  )}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    )}
                  </div>

                  {/* Right Column - Benefit Type & Discount Type */}
                  <div className="space-y-6">
                    {/* Benefit Type */}
                    <div className=" border border-gray-200 rounded-lg p-6 shadow-sm">
                      <h3 className="text-lg font-semibold mb-4 pb-2 border-b border-gray-100" style={{color: 'black'}}>Benefit Type</h3>
                      <RadioGroup value={benefitType} onValueChange={handleBenefitTypeChange} className="space-y-3">
                        <div className="flex items-center space-x-3">
                          <RadioGroupItem value="F" id="flat-discount" />
                          <Label htmlFor="flat-discount" className="text-sm font-normal cursor-pointer" style={{color: 'black'}}>
                            Flat Discount
                          </Label>
                        </div>
                        <div className="flex items-center space-x-3">
                          <RadioGroupItem value="S" id="specific-unit-paid" />
                          <Label htmlFor="specific-unit-paid" className="text-sm font-normal cursor-pointer" style={{color: 'black'}}>
                            Specific Unit from Paid From Assortment
                          </Label>
                        </div>
                        <div className="flex items-center space-x-3">
                          <RadioGroupItem value="B" id="specific-unit-benefit" />
                          <Label htmlFor="specific-unit-benefit" className="text-sm font-normal cursor-pointer" style={{color: 'black'}}>
                            Specific Unit from Benefit Assortment
                          </Label>
                        </div>
                      </RadioGroup>

                      {benefitType !== 'F' && (
                        <div className="mt-5 space-y-3">
                          <div className="space-y-2">
                            <Label className="text-sm font-medium" style={{color: 'black'}}>Specific Unit</Label>
                            <Input
                              type="number"
                              min={1}
                              placeholder="Enter Quantity"
                              value={benefitQuantity}
                              onChange={(e) => setBenefitQuantity(e.target.value)}
                            />
                          </div>

                          <div className="space-y-2">
                            <Label className="text-sm font-medium" style={{color: 'black'}}>Assortment</Label>
                            <div className="flex gap-2">
                              <Input value={benefitAssortment.assortmentName} readOnly />
                              <Button
                                type="button"
                                className="bg-blue-600 hover:bg-blue-700 text-white"
                                onClick={() => handleOpenAssortmentModal('benefit')}
                              >
                                Select Assortment
                              </Button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Discount Type */}
                    <div className=" border border-gray-200 rounded-lg p-6 shadow-sm">
                      <h3 className="text-lg font-semibold mb-4 pb-2 border-b border-gray-100" style={{color: 'black'}}>Discount Type</h3>
                      <Table className="[&_tr:hover]:bg-transparent">
                        <TableBody>
                          {discountTypes.map((type, index) => {
                            const isSelected = type.isSelected
                            const isExpanded = expandedDiscountRows[index] || false
                            return (
                              <React.Fragment key={type.id}>
                                {/* Main row */}
                                <TableRow>
                                  {/* Radio select */}
                                  <TableCell className="w-8 pr-0" style={{color: 'black'}}> 
                                    <RadioGroup
                                      value={selectedDiscount}
                                      onValueChange={handleSelectDiscount}
                                    >
                                      <RadioGroupItem value={String(index)} />
                                    </RadioGroup>
                                  </TableCell>

                                  {/* To input */}
                                  <TableCell className="w-20" style={{color: 'black'}}>
                                    <Input
                                      type="number"
                                      className="w-[80px]"
                                      min={1}
                                      placeholder="To"
                                      disabled={!isSelected}
                                      value={type.to1}
                                      onChange={e => handleDiscountFieldChange(index, 'to1', e.target.value)}
                                    />
                                  </TableCell>

                                  {/* Label */}
                                  <TableCell style={{color: 'black'}}>
                                    <span className="text-sm whitespace-nowrap">{discountOnLabels[index]}</span>
                                  </TableCell>

                                  {/* Discount On dropdown */}
                                  <TableCell style={{color: 'black'}}>
                                    <Select
                                      disabled={!isSelected}
                                      value={type.discountOn}
                                      onValueChange={val => handleDiscountFieldChange(index, 'discountOn', val)}
                                    >
                                      <SelectTrigger className="w-full min-w-[140px]">
                                        <SelectValue placeholder="Select Discount On" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="A" >Lowest MRP</SelectItem>
                                        <SelectItem value="B" >Highest MRP</SelectItem>
                                        <SelectItem value="C" >Lowest RSP</SelectItem>
                                        <SelectItem value="D" >Highest RSP</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </TableCell>

                                  {/* Expand toggle */}
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

                                {/* Accordion "Where" row — expands below, no horizontal scroll */}
                                {isExpanded && (
                                  <TableRow className="bg-blue-50/50 hover:bg-blue-50/50">
                                    <TableCell colSpan={5} className="py-3 px-4">
                                      <div className="flex flex-wrap gap-x-4 gap-y-3 items-center">
                                        <span className="text-sm font-semibold" style={{color: 'black'}}>Where</span>

                                        {/* Condition */}
                                        <div className="flex flex-col gap-1" style={{color: 'black'}}>
                                          <Label className="text-xs" style={{color: 'black'}}>Condition</Label>
                                          <Select
                                            disabled={!isSelected}
                                            value={type.condition}
                                            onValueChange={val => handleDiscountFieldChange(index, 'condition', val)}
                                          >
                                            <SelectTrigger className="w-28 h-8 text-sm">
                                              <SelectValue placeholder="Select" />
                                            </SelectTrigger>
                                            <SelectContent>
                                              <SelectItem value="A">MRP</SelectItem>
                                              <SelectItem value="B">RSP</SelectItem>
                                              <SelectItem value="C">WSP</SelectItem>
                                            </SelectContent>
                                          </Select>
                                        </div>

                                        {/* Comparison */}
                                        <div className="flex flex-col gap-1" style={{color: 'black'}}>
                                          <Label className="text-xs" style={{color: 'black'}}>Comparison</Label>
                                          <Select
                                            disabled={!isSelected}
                                            value={type.comparison}
                                            onValueChange={val => handleDiscountFieldChange(index, 'comparison', val)}
                                          >
                                            <SelectTrigger className="w-32 h-8 text-sm">
                                              <SelectValue placeholder="Select" />
                                            </SelectTrigger>
                                            <SelectContent>
                                              <SelectItem value="A">Less than</SelectItem>
                                              <SelectItem value="B">Greater than</SelectItem>
                                              <SelectItem value="C">In Between</SelectItem>
                                            </SelectContent>
                                          </Select>
                                        </div>

                                        {/* Value inputs */}
                                        {type.comparison === 'C' ? (
                                          <>
                                            <div className="flex flex-col gap-1">
                                              <Label className="text-xs text-gray-500">From</Label>
                                              <Input
                                                className="w-[70px] h-8 text-sm"
                                                type="number"
                                                disabled={!isSelected}
                                                placeholder="From"
                                                value={type.from}
                                                onChange={e => handleDiscountFieldChange(index, 'from', e.target.value)}
                                              />
                                            </div>
                                            <div className="flex flex-col gap-1">
                                              <Label className="text-xs text-gray-500">To</Label>
                                              <Input
                                                className="w-[70px] h-8 text-sm"
                                                type="number"
                                                disabled={!isSelected}
                                                placeholder="To"
                                                value={type.to}
                                                onChange={e => handleDiscountFieldChange(index, 'to', e.target.value)}
                                              />
                                            </div>
                                          </>
                                        ) : type.comparison ? (
                                          <div className="flex flex-col gap-1">
                                            <Label className="text-xs text-gray-500">Value</Label>
                                            <Input
                                              className="w-[70px] h-8 text-sm"
                                              type="number"
                                              disabled={!isSelected}
                                              placeholder="Value"
                                              value={type.from}
                                              onChange={e => handleDiscountFieldChange(index, 'from', e.target.value)}
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
                )}

              </form>
            </div>
            {/* Form Actions - Full width sticky footer */}
            <div className="w-full flex justify-end gap-3 px-6 py-4 border-t shadow-lg flex-shrink-0" style={{background: '#fff'}}>
              <Button
                type="button"
                variant="outline"
                className="px-6 border-gray-300 text-gray-700 hover:bg-gray-50"
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </Button>
              {!isViewMode && (
              <Button
                type="submit"
                form="promotion-form"
                disabled={isSubmitting}
                className="px-6 bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-60"
              >
                {isSubmitting ? 'Saving...' : 'Save'}
              </Button>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default QuantitySlabBenefit

// after implement of quantity shubodeep da