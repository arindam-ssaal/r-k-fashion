import React, { useMemo, useState } from 'react'

import '../../../../../../style.css'

import ListingPage from '@/components/ListingTable/ListingPage'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'

const MODES = {
  ADD: 'add',
  EDIT: 'edit',
  VIEW: 'view',
}

const MEMBER_TYPE_OPTIONS = [
  { value: 'silver', label: 'Silver Member' },
  { value: 'gold', label: 'Gold Member' },
  { value: 'platinum', label: 'Platinum Member' },
  { value: 'corporate', label: 'Corporate Member' },
]

const MEMBERSHIP_COLUMNS = [
  { field: 'membershipDetailID', header: 'Detail ID', type: 'code', width: '110px' },
  { field: 'memberTypeLabel', header: 'Member Type', type: 'link', minWidth: '180px' },
  { field: 'purchaseOnEveryRs', header: 'Purchase On Every Rs', type: 'number', minWidth: '170px' },
  { field: 'pointAccumulate', header: 'Point Accumulate', type: 'number', minWidth: '150px' },
  { field: 'maximumAccumulator', header: 'Maximum Accumulator', type: 'number', minWidth: '170px' },
  { field: 'maximumRedemption', header: 'Maximum Redemption', type: 'number', minWidth: '170px' },
  { field: 'minimumPointRequired', header: 'Minimum Point Require', type: 'number', minWidth: '170px' },
  {
    field: 'sameDayRedemption',
    header: 'Same Day Redeem',
    type: 'boolean',
    trueLabel: 'Enabled',
    falseLabel: 'Disabled',
    minWidth: '145px',
  },
]

const DUMMY_MEMBERSHIP_DETAILS = [
  {
    membershipDetailID: 101,
    memberType: 'silver',
    purchaseOnEveryRs: 100,
    pointAccumulate: 2,
    maximumAccumulator: 500,
    maximumRedemption: 200,
    minimumPointRequired: 100,
    sameDayRedemption: false,
  },
  {
    membershipDetailID: 102,
    memberType: 'gold',
    purchaseOnEveryRs: 75,
    pointAccumulate: 3,
    maximumAccumulator: 850,
    maximumRedemption: 350,
    minimumPointRequired: 180,
    sameDayRedemption: true,
  },
  {
    membershipDetailID: 103,
    memberType: 'platinum',
    purchaseOnEveryRs: 50,
    pointAccumulate: 5,
    maximumAccumulator: 1500,
    maximumRedemption: 700,
    minimumPointRequired: 300,
    sameDayRedemption: true,
  },
  {
    membershipDetailID: 104,
    memberType: 'corporate',
    purchaseOnEveryRs: 125,
    pointAccumulate: 4,
    maximumAccumulator: 1200,
    maximumRedemption: 500,
    minimumPointRequired: 250,
    sameDayRedemption: false,
  },
  {
    membershipDetailID: 105,
    memberType: 'silver',
    purchaseOnEveryRs: 90,
    pointAccumulate: 2,
    maximumAccumulator: 640,
    maximumRedemption: 280,
    minimumPointRequired: 140,
    sameDayRedemption: false,
  },
  {
    membershipDetailID: 106,
    memberType: 'gold',
    purchaseOnEveryRs: 60,
    pointAccumulate: 4,
    maximumAccumulator: 980,
    maximumRedemption: 420,
    minimumPointRequired: 210,
    sameDayRedemption: true,
  },
  {
    membershipDetailID: 107,
    memberType: 'platinum',
    purchaseOnEveryRs: 40,
    pointAccumulate: 6,
    maximumAccumulator: 1800,
    maximumRedemption: 900,
    minimumPointRequired: 400,
    sameDayRedemption: true,
  },
  {
    membershipDetailID: 108,
    memberType: 'corporate',
    purchaseOnEveryRs: 150,
    pointAccumulate: 3,
    maximumAccumulator: 760,
    maximumRedemption: 300,
    minimumPointRequired: 160,
    sameDayRedemption: false,
  },
]

function getMemberTypeLabel(memberType) {
  return MEMBER_TYPE_OPTIONS.find((option) => option.value === memberType)?.label ?? memberType
}

function buildListingRecord(record) {
  const memberTypeLabel = getMemberTypeLabel(record.memberType)

  return {
    ...record,
    memberTypeLabel,
    details: [
      memberTypeLabel,
      `Accumulate ${record.pointAccumulate} points every Rs ${record.purchaseOnEveryRs}`,
      `Min ${record.minimumPointRequired} points | Max redeem ${record.maximumRedemption}`,
      record.sameDayRedemption ? 'Same day redemption enabled' : 'Same day redemption disabled',
    ].join(' | '),
  }
}

function createEmptyFormState() {
  return {
    memberType: '',
    purchaseOnEveryRs: '',
    pointAccumulate: '',
    maximumAccumulator: '',
    maximumRedemption: '',
    minimumPointRequired: '',
    sameDayRedemption: false,
  }
}

function createFormState(record) {
  if (!record) {
    return createEmptyFormState()
  }

  return {
    memberType: record.memberType,
    purchaseOnEveryRs: String(record.purchaseOnEveryRs),
    pointAccumulate: String(record.pointAccumulate),
    maximumAccumulator: String(record.maximumAccumulator),
    maximumRedemption: String(record.maximumRedemption),
    minimumPointRequired: String(record.minimumPointRequired),
    sameDayRedemption: Boolean(record.sameDayRedemption),
  }
}

function mapFormToPayload(formState, existingRecord) {
  return {
    membershipDetailID: existingRecord?.membershipDetailID ?? Date.now(),
    memberType: formState.memberType,
    purchaseOnEveryRs: Number(formState.purchaseOnEveryRs),
    pointAccumulate: Number(formState.pointAccumulate),
    maximumAccumulator: Number(formState.maximumAccumulator),
    maximumRedemption: Number(formState.maximumRedemption),
    minimumPointRequired: Number(formState.minimumPointRequired),
    sameDayRedemption: Boolean(formState.sameDayRedemption),
  }
}

function validateForm(formState) {
  const errors = {}
  const numericFields = [
    ['purchaseOnEveryRs', 'Purchase on every Rs'],
    ['pointAccumulate', 'Point accumulate'],
    ['maximumAccumulator', 'Maximum accumulator'],
    ['maximumRedemption', 'Maximum redemption'],
    ['minimumPointRequired', 'Minimum point require'],
  ]

  if (!formState.memberType) {
    errors.memberType = 'Member type is required.'
  }

  numericFields.forEach(([field, label]) => {
    const value = formState[field]

    if (value === '') {
      errors[field] = `${label} is required.`
      return
    }

    if (Number(value) < 0) {
      errors[field] = `${label} must be zero or greater.`
    }
  })

  return errors
}

/* ── Shared field primitives ── */
function FieldLabel({ children, required = false }) {
  return (
    <label className="mb-1.5 block text-sm font-medium" style={{ color: '#374151' }}>
      {children}
      {required && <span className="ml-0.5" style={{ color: '#ef4444' }}>*</span>}
    </label>
  )
}

function FieldError({ message }) {
  if (!message) return null
  return <p className="mt-1.5 text-xs font-medium" style={{ color: '#ef4444' }}>{message}</p>
}

/* ── Thin section divider inside the form card ── */
function SectionDivider({ label }) {
  return (
    <div className="flex items-center gap-3 py-1">
      <span
        className="inline-block h-3 w-1 rounded-full back-sky-400"
      />
      <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: 'var(--sky-500)' }}>
        {label}
      </span>
      <div className="flex-1" style={{ height: '1px', background: 'var(--sky-100)' }} />
    </div>
  )
}

function MembershipDetails() {
  const [membershipDetails, setMembershipDetails] = useState(DUMMY_MEMBERSHIP_DETAILS)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [modalMode, setModalMode] = useState(MODES.ADD)
  const [selectedRecord, setSelectedRecord] = useState(null)
  const [formState, setFormState] = useState(createEmptyFormState)
  const [errors, setErrors] = useState({})

  const listingData = useMemo(
    () => membershipDetails.map((record) => buildListingRecord(record)),
    [membershipDetails]
  )

  const membershipStats = useMemo(
    () => [
      {
        label: 'Total Rules',
        value: listingData.length,
        icon: '📋',
        iconClass: 'blue',
        filterKey: 'all',
      },
      {
        label: 'Same Day Enabled',
        value: listingData.filter((record) => record.sameDayRedemption).length,
        icon: '⚡',
        iconClass: 'green',
        filterKey: 'sameDayEnabled',
      },
      {
        label: 'High Threshold',
        value: listingData.filter((record) => record.minimumPointRequired >= 250).length,
        icon: '🎯',
        iconClass: 'amber',
        filterKey: 'highThreshold',
      },
    ],
    [listingData]
  )

  const membershipFilterChips = useMemo(
    () => [
      { key: 'all', label: 'All Rules', chipClass: 'lp-chip-blue' },
      {
        key: 'sameDayEnabled',
        label: 'Same Day Enabled',
        chipClass: 'lp-chip-green',
        filterFn: (record) => record.sameDayRedemption === true,
      },
      {
        key: 'sameDayDisabled',
        label: 'Same Day Disabled',
        chipClass: 'lp-chip-amber',
        filterFn: (record) => record.sameDayRedemption === false,
      },
      {
        key: 'highThreshold',
        label: 'High Threshold',
        chipClass: 'lp-chip-purple',
        filterFn: (record) => Number(record.minimumPointRequired) >= 250,
      },
    ],
    []
  )

  const isViewMode = modalMode === MODES.VIEW

  function resetDialogState(open) {
    setDialogOpen(open)
    if (!open) {
      setSelectedRecord(null)
      setModalMode(MODES.ADD)
      setFormState(createEmptyFormState())
      setErrors({})
    }
  }

  function openModal(mode, record = null) {
    setModalMode(mode)
    setSelectedRecord(record)
    setFormState(createFormState(record))
    setErrors({})
    setDialogOpen(true)
  }

  function updateField(field, value) {
    setFormState((current) => ({ ...current, [field]: value }))
    setErrors((current) => {
      if (!current[field]) return current
      const next = { ...current }
      delete next[field]
      return next
    })
  }

  function handleCreateMembership() { openModal(MODES.ADD) }
  function handleViewMembership(record) { openModal(MODES.VIEW, record) }
  function handleEditMembership(record) { openModal(MODES.EDIT, record) }

  function handleSaveMembership() {
    const validationErrors = validateForm(formState)
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }
    const payload = mapFormToPayload(formState, selectedRecord)
    setMembershipDetails((current) => {
      if (modalMode === MODES.EDIT && selectedRecord) {
        return current.map((r) =>
          r.membershipDetailID === selectedRecord.membershipDetailID ? payload : r
        )
      }
      return [payload, ...current]
    })
    resetDialogState(false)
  }

  function getDialogTitle() {
    if (modalMode === MODES.EDIT) return 'Edit - Membership Type'
    if (modalMode === MODES.VIEW) return 'View - Membership Type'
    return 'Add - Membership Type'
  }

  return (
    <>
      <div className="h-full min-h-[calc(100vh-11rem)]">
        <ListingPage
          title="Membership Details"
          subtitle="Manage membership accumulation rules · API-ready dummy dataset"
          titleIcon="🪪"
          rowData={listingData}
          columns={MEMBERSHIP_COLUMNS}
          rowKey="membershipDetailID"
          loading={false}
          stats={membershipStats}
          filterChips={membershipFilterChips}
          defaultFilter="all"
          searchPlaceholder="Search by member type, redemption rule, or thresholds..."
          searchFields={['memberTypeLabel', 'details']}
          defaultSortCol="membershipDetailID"
          defaultSortDir="desc"
          pageSize={8}
          selectable={false}
          onView={handleViewMembership}
          onEdit={handleEditMembership}
          primaryAction={{ label: '+ Add Membership Details', onClick: handleCreateMembership }}
          emptyText="No membership details found"
        />
      </div>

      <Dialog open={dialogOpen} onOpenChange={resetDialogState}>
        <DialogContent
          showCloseIcon={false}
          className="left-1/2 top-1/2 h-screen w-screen max-w-none translate-x-[-50%] translate-y-[-50%] gap-0 rounded-none border-0 p-0 shadow-none"
          style={{ backgroundColor: '#ffffff' }}
        >
          <div className="flex h-full flex-col overflow-hidden">

            {/* ── Header: sky-400 bar, title left, X right ── */}
            <DialogHeader
              className="back-sky-400 flex-shrink-0 px-6"
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                minHeight: '52px',
                padding: '0 24px',
              }}
            >
              <DialogTitle
                className="text-base font-semibold text-c-white"
                style={{ margin: 0 }}
              >
                {getDialogTitle()}
              </DialogTitle>
              <button
                onClick={() => resetDialogState(false)}
                className="back-white flex h-7 w-7 items-center justify-center rounded text-c-sky-600 transition-opacity hover:opacity-80"
                style={{ fontSize: '16px', lineHeight: 1, flexShrink: 0, border: 'none', cursor: 'pointer' }}
                aria-label="Close"
              >
                ✕
              </button>
              {/* Hidden for a11y — DialogDescription is required by Dialog */}
              <DialogDescription className="sr-only">
                Configure member type accumulation and redemption conditions.
              </DialogDescription>
            </DialogHeader>

            {/* ── Scrollable body: white, single centred card ── */}
            <div
              className="flex-1 overflow-y-auto"
              style={{ backgroundColor: '#f9fafb', padding: '32px 24px' }}
            >
              <div
                className="back-white mx-auto w-full rounded-xl"
                style={{
                  maxWidth: '760px',
                  border: '1px solid #e5e7eb',
                  padding: '28px 28px 24px',
                  boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
                }}
              >

                {/* ── Type ── */}
                <SectionDivider label="Type" />
                <div className="mt-4 grid gap-x-5 gap-y-4 md:grid-cols-2">
                  <div>
                    <FieldLabel required>Member Type</FieldLabel>
                    <Select
                      value={formState.memberType}
                      onValueChange={(value) => updateField('memberType', value)}
                      disabled={isViewMode}
                    >
                      <SelectTrigger
                        className="h-9 back-white text-sm"
                        style={{ border: '1px solid #d1d5db', borderRadius: '6px' }}
                      >
                        <SelectValue placeholder="Select member type" />
                      </SelectTrigger>
                      <SelectContent>
                        {MEMBER_TYPE_OPTIONS.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FieldError message={errors.memberType} />
                  </div>
                </div>

                {/* ── Accumulator ── */}
                <div className="mt-6">
                  <SectionDivider label="Accumulator" />
                  <div className="mt-4 grid gap-x-5 gap-y-4 md:grid-cols-2">
                    <div>
                      <FieldLabel required>Purchase on every Rs</FieldLabel>
                      <Input
                        type="number"
                        min="0"
                        placeholder="e.g. 100"
                        value={formState.purchaseOnEveryRs}
                        onChange={(e) => updateField('purchaseOnEveryRs', e.target.value)}
                        readOnly={isViewMode}
                        className="h-9 back-white text-sm"
                        style={{ border: '1px solid #d1d5db', borderRadius: '6px' }}
                      />
                      <FieldError message={errors.purchaseOnEveryRs} />
                    </div>
                    <div>
                      <FieldLabel required>Point accumulate</FieldLabel>
                      <Input
                        type="number"
                        min="0"
                        placeholder="e.g. 5"
                        value={formState.pointAccumulate}
                        onChange={(e) => updateField('pointAccumulate', e.target.value)}
                        readOnly={isViewMode}
                        className="h-9 back-white text-sm"
                        style={{ border: '1px solid #d1d5db', borderRadius: '6px' }}
                      />
                      <FieldError message={errors.pointAccumulate} />
                    </div>
                  </div>
                </div>

                {/* ── Condition ── */}
                <div className="mt-6">
                  <SectionDivider label="Condition" />
                  <div className="mt-4 grid gap-x-5 gap-y-4 md:grid-cols-2">
                    <div>
                      <FieldLabel required>Maximum accumulator</FieldLabel>
                      <Input
                        type="number"
                        min="0"
                        placeholder="e.g. 1000"
                        value={formState.maximumAccumulator}
                        onChange={(e) => updateField('maximumAccumulator', e.target.value)}
                        readOnly={isViewMode}
                        className="h-9 back-white text-sm"
                        style={{ border: '1px solid #d1d5db', borderRadius: '6px' }}
                      />
                      <FieldError message={errors.maximumAccumulator} />
                    </div>
                    <div>
                      <FieldLabel required>Maximum redemption</FieldLabel>
                      <Input
                        type="number"
                        min="0"
                        placeholder="e.g. 500"
                        value={formState.maximumRedemption}
                        onChange={(e) => updateField('maximumRedemption', e.target.value)}
                        readOnly={isViewMode}
                        className="h-9 back-white text-sm"
                        style={{ border: '1px solid #d1d5db', borderRadius: '6px' }}
                      />
                      <FieldError message={errors.maximumRedemption} />
                    </div>
                    <div>
                      <FieldLabel required>Minimum point require</FieldLabel>
                      <Input
                        type="number"
                        min="0"
                        placeholder="e.g. 100"
                        value={formState.minimumPointRequired}
                        onChange={(e) => updateField('minimumPointRequired', e.target.value)}
                        readOnly={isViewMode}
                        className="h-9 back-white text-sm"
                        style={{ border: '1px solid #d1d5db', borderRadius: '6px' }}
                      />
                      <FieldError message={errors.minimumPointRequired} />
                    </div>

                    {/* Same-day toggle — styled like image's "Is Active" row */}
                    <div className="flex items-center gap-3 pt-5">
                      <span className="text-sm font-medium" style={{ color: '#374151' }}>
                        Same Day Redemption
                      </span>
                      <Switch
                        checked={formState.sameDayRedemption}
                        onCheckedChange={(checked) => updateField('sameDayRedemption', checked)}
                        disabled={isViewMode}
                      />
                    </div>
                  </div>
                </div>

              </div>
            </div>

            {/* ── Footer: white bar, Cancel red, Save green ── */}
            <div
              className="back-white flex-shrink-0 flex items-center justify-end gap-3 px-6 py-3"
              style={{ borderTop: '1px solid #e5e7eb' }}
            >
              <Button
                variant="outline"
                onClick={() => resetDialogState(false)}
                style={{
                  backgroundColor: '#ef4444',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '0 20px',
                  height: '36px',
                  fontSize: '13px',
                  fontWeight: 500,
                  cursor: 'pointer',
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSaveMembership}
                disabled={isViewMode}
                style={{
                  backgroundColor: isViewMode ? '#86efac' : '#22c55e',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '0 20px',
                  height: '36px',
                  fontSize: '13px',
                  fontWeight: 500,
                  cursor: isViewMode ? 'not-allowed' : 'pointer',
                  opacity: isViewMode ? 0.6 : 1,
                }}
              >
                Save
              </Button>
            </div>

          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default MembershipDetails