import React, { useCallback, useEffect, useState } from 'react'
import { CircleX } from 'lucide-react'
import { useCookies } from 'react-cookie'
import { toast } from 'sonner'
import { GetAPI, PostAPI } from '../../../../../../services/apiCall'
import ListingPage from '@/components/ListingTable/ListingPage'

/* ------------------------------------------------------------------
 * API endpoints  --  CHANGE HERE IF YOUR BACKEND ROUTE IS DIFFERENT
 * ------------------------------------------------------------------ */
const API_GET_ALL_ROLE = '/api/Role/GetAllRole'
const API_POST_ROLE = '/api/Role/PostRole'

const ROWS_PER_PAGE = 5

const EMPTY_FORM = {
  roleID: 0,
  roleName: '',
  remarks: '',
  isActive: true,
}

const toastOk = { style: { backgroundColor: '#e3ffea', color: '#3ed665' } }
const toastErr = { style: { backgroundColor: '#f7edeb', color: '#ff6242' } }

const getCookieValue = (name) => {
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'))
  return match ? match[2] : null
}

const CreateRole = () => {
  const [cookies] = useCookies(['AccessKey', 'UserId', 'AuthToken', 'SAPApplicable'])

  const [roleData, setRoleData] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  const [modalOpen, setModalOpen] = useState(false)
  const [mode, setMode] = useState('Add') // 'Add' | 'Edit' | 'View'
  const [form, setForm] = useState(EMPTY_FORM)
  const [errors, setErrors] = useState({})
  const [isSaving, setIsSaving] = useState(false)

  const isView = mode === 'View'
  const isEdit = mode === 'Edit'

  /* ------------------------------------------------------------------
   * Load role list
   * ------------------------------------------------------------------ */
  const fetchRoles = useCallback(async () => {
    setIsLoading(true)
    try {
      const responseJson = await GetAPI(API_GET_ALL_ROLE, '', {}, cookies)
      setRoleData(Array.isArray(responseJson?.data) ? responseJson.data : [])
    } catch (error) {
      setRoleData([])
      toast.error('Could not load roles. Refresh and try again.', toastErr)
    } finally {
      setIsLoading(false)
    }
  }, [cookies])

  useEffect(() => {
    if (cookies.AuthToken) fetchRoles()
  }, [cookies.AuthToken, fetchRoles])

  /* ------------------------------------------------------------------
   * Modal open / close
   * ------------------------------------------------------------------ */
  const openModal = (nextMode, row = null) => {
    setMode(nextMode)
    setErrors({})

    if (nextMode === 'Add' || !row) {
      setForm(EMPTY_FORM)
    } else {
      setForm({
        roleID: row.roleID ?? 0,
        roleName: row.roleName ?? '',
        remarks: row.remarks ?? '',
        isActive: row.isActive === 'Y',
      })
    }
    setModalOpen(true)
  }

  const closeModal = () => {
    setModalOpen(false)
    setMode('Add')
    setForm(EMPTY_FORM)
    setErrors({})
  }

  /* ------------------------------------------------------------------
   * Form handling
   * ------------------------------------------------------------------ */
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }))
  }

  const validate = () => {
    const next = {}
    const name = form.roleName.trim()

    if (!name) {
      next.roleName = 'Role name is required.'
    } else if (name.length > 100) {
      next.roleName = 'Role name must be 100 characters or fewer.'
    } else {
      const duplicate = roleData.some(
        (r) => (r.roleName || '').trim().toLowerCase() === name.toLowerCase() && r.roleID !== form.roleID
      )
      if (duplicate) next.roleName = 'A role with this name already exists.'
    }

    setErrors(next)
    return Object.keys(next).length === 0
  }

  const handleSubmit = async () => {
    if (isView || isSaving) return
    if (!validate()) return

    const payload = {
      roleID: isEdit ? form.roleID : 0,
      roleName: form.roleName.trim(),
      remarks: form.remarks.trim(),
      isActive: form.isActive ? 'Y' : 'N',
      enteredBy: Number(getCookieValue('UserId')) || 0,
      usedFor: isEdit ? 'U' : 'I',
      objRoleWiseMenu: []
    }

    setIsSaving(true)
    try {
      const response = await PostAPI(API_POST_ROLE, '', payload, cookies)
      const result = Array.isArray(response?.data) ? response.data[0] : response?.data

      if (result?.returnCode === 'Y') {
        toast.success(isEdit ? 'Role updated.' : 'Role saved.', toastOk)
        closeModal()
        await fetchRoles()
      } else {
        toast.error(result?.returnMsg || 'Could not save the role. Try again.', toastErr)
      }
    } catch (error) {
      toast.error(error?.message || 'Could not reach the server.', toastErr)
    } finally {
      setIsSaving(false)
    }
  }

  /* ------------------------------------------------------------------
   * Listing actions
   * ------------------------------------------------------------------ */
  const handleViewRole = (row) => openModal('View', row)
  const handleEditRole = (row) => openModal('Edit', row)

  const handleDeleteRole = async (row) => {
    if (!row?.roleID) return
    const ok = window.confirm(`Delete the role "${row.roleName}"?`)
    if (!ok) return

    try {
      const response = await PostAPI(
        API_POST_ROLE,
        '',
        {
          roleID: row.roleID,
          roleName: row.roleName,
          remarks: row.remarks || '',
          isActive: row.isActive,
          enteredBy: Number(getCookieValue('UserId')) || 0,
          usedFor: 'D',
        },
        cookies
      )
      const result = Array.isArray(response?.data) ? response.data[0] : response?.data

      if (result?.returnCode === 'Y') {
        toast.success('Role deleted.', toastOk)
        await fetchRoles()
      } else {
        toast.error(result?.returnMsg || 'Could not delete the role.', toastErr)
      }
    } catch (error) {
      toast.error(error?.message || 'Could not reach the server.', toastErr)
    }
  }

  /* ------------------------------------------------------------------
   * Listing config
   * ------------------------------------------------------------------ */
  const listingColumns = [
    { field: 'roleID', header: 'No.', width: '100px', type: 'number' },
    { field: 'roleName', header: 'Roles', type: 'link' },
  ]

  const stats = [
    { label: 'Total Roles', value: roleData.length, icon: '🧾', iconClass: 'blue', filterKey: 'all' },
    {
      label: 'Active',
      value: roleData.filter((item) => item.isActive === 'Y').length,
      icon: '✅',
      iconClass: 'green',
      filterKey: 'active',
    },
    {
      label: 'Inactive',
      value: roleData.filter((item) => item.isActive === 'N').length,
      icon: '⏸️',
      iconClass: 'amber',
      filterKey: 'inactive',
    },
  ]

  /* ------------------------------------------------------------------
   * Modal chrome per mode
   * ------------------------------------------------------------------ */
  const modalTitle = mode === 'Add' ? 'Add Role' : isEdit ? 'Edit Role' : 'View Role'
  const modalSubtitle =
    mode === 'Add'
      ? 'Create a new role'
      : isEdit
        ? 'Update role details'
        : 'Role details (read-only)'

  const fieldClass = (hasError) =>
    [
      'px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition',
      hasError ? 'border-red-400' : 'border-gray-300',
      isView ? 'bg-gray-50 text-gray-600 cursor-not-allowed' : 'bg-white',
    ].join(' ')

  return (
    <React.Fragment>
      <div className="w-full">
        <ListingPage
          title="Create Role"
          subtitle="Manage roles and permission mappings"
          titleIcon="🛡️"
          rowData={roleData}
          columns={listingColumns}
          rowKey="roleID"
          stats={stats}
          isLoading={isLoading}
          defaultFilter="all"
          filterChips={[
            { key: 'all', label: 'All', chipClass: 'lp-chip-blue' },
            {
              key: 'active',
              label: 'Active',
              chipClass: 'lp-chip-green',
              filterFn: (r) => r.isActive === 'Y',
            },
            {
              key: 'inactive',
              label: 'Inactive',
              chipClass: 'lp-chip-amber',
              filterFn: (r) => r.isActive === 'N',
            },
          ]}
          searchPlaceholder="Search by role name..."
          searchFields={['roleName']}
          defaultSortCol="roleID"
          pageSize={ROWS_PER_PAGE}
          onView={handleViewRole}
          onEdit={handleEditRole}
          // onDelete={handleDeleteRole}
          primaryAction={{ label: '+ Add Role', onClick: () => openModal('Add') }}
        />
      </div>

      {modalOpen ? (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-0">
          <div className="w-screen h-screen max-w-none max-h-none rounded-none flex flex-col overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="bg-white bg-opacity-20 p-2 rounded-lg">
                  <svg
                    className="w-5 h-5 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                    />
                  </svg>
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-white">{modalTitle}</h2>
                  <p className="text-blue-100 text-xs">{modalSubtitle}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={closeModal}
                className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-1.5 transition-colors"
                aria-label="Close"
              >
                <CircleX className="w-5 h-5" />
              </button>
            </div>

            {/* Body — single centred card */}
            <section
              className="p-6 overflow-y-auto flex-1 min-h-0"
              style={{ backgroundColor: '#d6eaf8' }}
            >
              <div className="max-w-2xl mx-auto">
                <div
                  className="p-6 rounded-xl shadow-md border border-gray-200 space-y-6"
                  style={{ backgroundColor: '#fff', color: '#000' }}
                >
                  <div className="flex items-center gap-2 pb-3 border-b border-gray-200">
                    <div className="bg-blue-100 p-1.5 rounded-lg">
                      <svg
                        className="w-4 h-4 text-blue-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                      </svg>
                    </div>
                    <h3 className="text-sm font-semibold">Role Information</h3>
                  </div>

                  <div className="flex flex-col space-y-1">
                    <label htmlFor="roleName" className="text-sm font-medium">
                      Role Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="roleName"
                      name="roleName"
                      type="text"
                      value={form.roleName}
                      onChange={handleChange}
                      disabled={isView}
                      maxLength={100}
                      autoFocus={!isView}
                      placeholder="Enter role name"
                      className={fieldClass(!!errors.roleName)}
                    />
                    {errors.roleName ? (
                      <span className="text-xs text-red-500">{errors.roleName}</span>
                    ) : null}
                  </div>

                  <div className="flex flex-col space-y-1">
                    <label htmlFor="remarks" className="text-sm font-medium">
                      Details
                    </label>
                    <textarea
                      id="remarks"
                      name="remarks"
                      rows="4"
                      value={form.remarks}
                      onChange={handleChange}
                      disabled={isView}
                      placeholder="Type here..."
                      // className={`${fieldClass(false)} resize-none`}
                      className="px-4 py-2 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      style={{
                            backgroundColor: isView ? '#f9fafb !important' : '#ffffff !important',
                            color: '#111827 !important',
                            colorScheme: 'light !important',
                        }}
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      id="isActive"
                      name="isActive"
                      type="checkbox"
                      checked={form.isActive}
                      onChange={handleChange}
                      disabled={isView}
                      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 disabled:cursor-not-allowed"
                    />
                    <label htmlFor="isActive" className="text-sm font-medium">
                      Active
                    </label>
                  </div>
                </div>
              </div>
            </section>

            {/* Footer */}
            <div className="shrink-0 border-t border-gray-200 bg-white/95 backdrop-blur px-6 py-4">
              <div className="max-w-2xl mx-auto flex justify-end gap-3">
                {isView ? (
                  <button
                    type="button"
                    className="bg-blue-600 text-white font-medium px-6 py-2 rounded-lg hover:bg-blue-700 transition shadow-sm"
                    onClick={closeModal}
                  >
                    Close
                  </button>
                ) : (
                  <>
                    <button
                      type="button"
                      className="bg-white border border-gray-300 text-gray-700 font-medium px-6 py-2 rounded-lg hover:bg-gray-50 transition shadow-sm"
                      onClick={closeModal}
                      disabled={isSaving}
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      className="bg-blue-600 text-white font-medium px-6 py-2 rounded-lg hover:bg-blue-700 transition shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
                      onClick={handleSubmit}
                      disabled={isSaving}
                    >
                      {isSaving ? (isEdit ? 'Updating...' : 'Saving...') : isEdit ? 'Update' : 'Save'}
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </React.Fragment>
  )
}

export default CreateRole