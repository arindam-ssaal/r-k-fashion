import React, { useMemo, useState } from 'react'

import ListingPage from '@/components/ListingTable/ListingPage'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import '../../../../../../style.css';

const MEMBERSHIP_COLUMNS = [
  { field: 'membershipTypeId', header: 'ID', type: 'code', width: '90px' },
  { field: 'membershipTypeName', header: 'Membership Type', type: 'link' },
  { field: 'remarks', header: 'Remarks' },
  {
    field: 'isActive',
    header: 'Status',
    type: 'badge',
    width: '110px',
    badgeMap: {
      true: { variant: 'success', label: 'Active', dot: true },
      false: { variant: 'warning', label: 'Inactive', dot: true },
    },
  },
]

const DUMMY_MEMBERSHIP_TYPES = [
  {
    membershipTypeId: 1001,
    membershipTypeName: 'Silver',
    remarks: 'Base loyalty tier for standard shoppers',
    isActive: true,
  },
  {
    membershipTypeId: 1002,
    membershipTypeName: 'Gold',
    remarks: 'Priority offers and birthday voucher eligibility',
    isActive: true,
  },
  {
    membershipTypeId: 1003,
    membershipTypeName: 'Platinum',
    remarks: 'High-value members with premium support',
    isActive: true,
  },
  {
    membershipTypeId: 1004,
    membershipTypeName: 'Legacy',
    remarks: 'Old program retained for historical transactions',
    isActive: false,
  },
]

const EMPTY_FORM = {
  membershipTypeId: 0,
  membershipTypeName: '',
  remarks: '',
  isActive: true,
}

function getModalTitle(mode) {
  if (mode === 'edit') return 'Edit - Membership Type'
  if (mode === 'view') return 'View - Membership Type'
  return 'Add - Membership Type'
}

function getNextMembershipTypeId(rows) {
  const maxId = rows.reduce((max, row) => {
    const current = Number(row.membershipTypeId) || 0
    return current > max ? current : max
  }, 1000)
  return maxId + 1
}

const MemberShipType = () => {
  const [membershipTypes, setMembershipTypes] = useState(DUMMY_MEMBERSHIP_TYPES)
  const [modalOpen, setModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState('add')
  const [formData, setFormData] = useState(EMPTY_FORM)

  const isViewMode = modalMode === 'view'

  const membershipStats = useMemo(() => {
    const activeCount = membershipTypes.filter((row) => row.isActive).length
    const inactiveCount = membershipTypes.length - activeCount
    return [
      { label: 'Total', value: membershipTypes.length, icon: '📘', iconClass: 'blue', filterKey: 'all' },
      { label: 'Active', value: activeCount, icon: '✅', iconClass: 'green', filterKey: 'active' },
      { label: 'Inactive', value: inactiveCount, icon: '⏸️', iconClass: 'amber', filterKey: 'inactive' },
    ]
  }, [membershipTypes])

  const membershipFilterChips = useMemo(
    () => [
      { key: 'all', label: 'All', chipClass: 'lp-chip-blue' },
      {
        key: 'active',
        label: 'Active',
        chipClass: 'lp-chip-green',
        filterFn: (record) => Boolean(record.isActive),
      },
      {
        key: 'inactive',
        label: 'Inactive',
        chipClass: 'lp-chip-amber',
        filterFn: (record) => !Boolean(record.isActive),
      },
    ],
    []
  )

  const openAddModal = () => {
    setModalMode('add')
    setFormData({
      ...EMPTY_FORM,
      membershipTypeId: getNextMembershipTypeId(membershipTypes),
    })
    setModalOpen(true)
  }

  const openEditModal = (row) => {
    setModalMode('edit')
    setFormData({
      membershipTypeId: row.membershipTypeId,
      membershipTypeName: row.membershipTypeName || '',
      remarks: row.remarks || '',
      isActive: Boolean(row.isActive),
    })
    setModalOpen(true)
  }

  const openViewModal = (row) => {
    setModalMode('view')
    setFormData({
      membershipTypeId: row.membershipTypeId,
      membershipTypeName: row.membershipTypeName || '',
      remarks: row.remarks || '',
      isActive: Boolean(row.isActive),
    })
    setModalOpen(true)
  }

  const handleFieldChange = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }))
  }

  const handleSave = () => {
    if (isViewMode) return

    if (modalMode === 'add') {
      setMembershipTypes((prev) => [...prev, { ...formData }])
      setModalOpen(false)
      return
    }

    setMembershipTypes((prev) =>
      prev.map((row) =>
        row.membershipTypeId === formData.membershipTypeId ? { ...row, ...formData } : row
      )
    )
    setModalOpen(false)
  }

  return (
    <>
      <ListingPage
        title="Membership Type"
        subtitle="Manage membership types · SAP Business One integrated"
        titleIcon="🧾"
        rowData={membershipTypes}
        columns={MEMBERSHIP_COLUMNS}
        rowKey="membershipTypeId"
        loading={false}
        stats={membershipStats}
        filterChips={membershipFilterChips}
        defaultFilter="all"
        searchPlaceholder="Search by membership type, remarks..."
        searchFields={['membershipTypeName', 'remarks']}
        defaultSortCol="membershipTypeId"
        defaultSortDir="desc"
        pageSize={8}
        onView={openViewModal}
        onEdit={openEditModal}
        primaryAction={{ label: '+ Add Membership Type', onClick: openAddModal }}
        emptyText="No membership types found"
      />

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent
          className="max-w-none w-screen h-screen max-h-screen overflow-hidden p-0 m-0 rounded-none gap-0 border-0 shadow-none back-sky-400"
        //   style={{ background: '#fff' }}
        >
          <div className="flex flex-col h-screen " style={{ background: '#fff' }}>
            <DialogHeader className="px-6 py-4 border-b border-slate-200 back-sky-400 backdrop-blur-sm flex-shrink-0">
              <DialogTitle className="text-xl font-semibold text-slate-900">
                {getModalTitle(modalMode)}
              </DialogTitle>
            </DialogHeader>

            <div className="flex-1 overflow-y-auto px-6 py-6">
              <div className="max-w-3xl mx-auto rounded-lg border  border-slate-200  p-6 shadow-sm">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="membershipTypeId" className='text-c-black'>Membership Type ID</Label>
                    <Input
                      id="membershipTypeId"
                      value={formData.membershipTypeId}
                    //   value='auto-generated'
                      disabled
                      readOnly
                      placeholder="Auto-generated from backend"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="membershipTypeName" className='text-c-black'>
                      Member Type Name <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="membershipTypeName"
                      value={formData.membershipTypeName}
                      onChange={(event) => handleFieldChange('membershipTypeName', event.target.value)}
                      disabled={isViewMode}
                      placeholder="Enter member type name"
                    />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="remarks" className='text-c-black'>Remarks</Label>
                    <Textarea
                      id="remarks"
                      rows={5}
                      cols={60}
                      className="resize"
                      value={formData.remarks}
                      onChange={(event) => handleFieldChange('remarks', event.target.value)}
                      disabled={isViewMode}
                      placeholder="Add notes for this membership type"
                    />
                  </div>

                  <div className="space-y-2 flex gap-2 items-center">
                    <Label htmlFor="isActive" className="block text-c-black">
                      Is Active
                    </Label>
                    <div className="items-center gap-3">
                      <Switch
                        id="isActive"
                        checked={Boolean(formData.isActive)}
                        onCheckedChange={(checked) => handleFieldChange('isActive', checked)}
                        disabled={isViewMode}
                        className="data-[state=checked]:bg-green-700 data-[state=unchecked]:bg-red-400 text-c-white"
                      />
                      {/* <span className="text-sm text-c-black">Enable this membership type</span> */}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="sticky bottom-0 border-t border-slate-200 back-white px-6 py-4 flex items-center justify-end gap-3 flex-shrink-0">
              <Button variant="secondary" onClick={() => setModalOpen(false)} className='back-red-400 text-c-white hover:back-red-500'> 
                Cancel
              </Button>
              <Button variant="primary" onClick={handleSave} disabled={isViewMode || !formData.membershipTypeName.trim()} className='back-green-400 text-c-white hover:back-green-500'>
                Save
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default MemberShipType