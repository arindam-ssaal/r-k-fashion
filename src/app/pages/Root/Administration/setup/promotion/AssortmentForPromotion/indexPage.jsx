import React, { useMemo } from 'react'
import { useState, useEffect, useRef } from 'react'
import { AgGridReact } from 'ag-grid-react'
import { ModuleRegistry, AllCommunityModule } from 'ag-grid-community'
import { themeQuartz } from 'ag-grid-community'
import { GetAPI, PostAPI } from '@/services/apiCall'
import * as XLSX from 'xlsx'
import { useCookies } from 'react-cookie'
import { Plus, Edit, Eye, ListChecks, CheckCircle2, XCircle } from 'lucide-react'
import { DataTable } from '@/components/DataTable'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import Select from 'react-select'
import './PromotionForAssortment.css'

ModuleRegistry.registerModules([AllCommunityModule])

const PromotionForAssortment = () => {
    const [cookies] = useCookies()
    const fileInputRef = useRef(null)

    const getCookieValue = (name) => {
        const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'))
        return match ? match[2] : null
    }

    // Modal State
    const [isFormModalOpen, setIsFormModalOpen] = useState(false)
    const [isViewMode, setIsViewMode] = useState(false)

    // Listing State
    const [assortments, setAssortments] = useState([])
    const [loading, setLoading] = useState(false)

    const [assormentModel, setAssortmentModel] = useState('')
    const [selectedAssortmentType, setSelectedAssortmentType] = useState('')
    const [assortmentTypeList, setAssortmentTypeList] = useState([])
    const [assormentCode, setAssortmentCode] = useState('')
    const [assormentName, setAssortmentName] = useState('')
    const [assortmentProperty, setAssortmentProperty] = useState('')
    const [assortmentPropertyList, setAssortmentPropertyList] = useState([])
    const [assortmentBrand, setAssortmentBrand] = useState('')
    const [selectedAssortmentBrands, setSelectedAssortmentBrands] = useState([])
    const [assortmentBrandList, setAssortmentBrandList] = useState([])
    const [assortmentItemPromotion, setAssortmentItemPromotion] = useState('')
    const [assortmentItemPromotionList, setAssortmentItemPromotionList] = useState([])
    const [fromMrp, setFromMrp] = useState('')
    const [toMrp, setToMrp] = useState('')
    const [inActive, setInActive] = useState(false)
    const [selectedGroup, setSelectedGroup] = useState('')
    const [selectedGroups, setSelectedGroups] = useState([])
    const [groupList, setGroupList] = useState([])
    const [propertiesData, setPropertiesData] = useState([])
    const [selectedProperties, setSelectedProperties] = useState([])
    const [assortmentDetailsData, setAssortmentDetailsData] = useState([])
    const [editMode, setEditMode] = useState(false)
    const [editAssortmentID, setEditAssortmentID] = useState(null)

    const [activeFilter, setActiveFilter] = useState('all')

    // AG Grid
    const [rowData, setRowData] = useState([])

    const isIncludedCellRenderer = (params) => {
        const handleChange = (e) => {
            const newValue = e.target.value === 1
            params.node.setDataValue('IsIncluded', newValue)
        }
        return (
            <select
                value={params.value ? 1 : 2}
                onChange={handleChange}
                className={`pfa-include-select ${params.value ? 'pfa-include-select--included' : 'pfa-include-select--excluded'}`}
            >
                <option value={1}>Include</option>
                <option value={2}>Exclude</option>
            </select>
        )
    }

    const colomnDefs = [
        { headerName: 'Sl No', field: 'sl', width: 80 },
        { headerName: 'Item Code', field: 'ItemCode', width: 150 },
        { headerName: 'Item Name', field: 'ItemName', flex: 1 },
        { headerName: 'Exclude/Include', field: 'IsIncluded', width: 150, cellRenderer: isIncludedCellRenderer },
    ]

    const handleClear = () => {
        setSelectedAssortmentType('')
        setAssortmentCode('')
        setAssortmentName('')
        setAssortmentProperty('')
        setAssortmentBrand('')
        setAssortmentItemPromotion('')
        setFromMrp('')
        setToMrp('')
        setInActive(false)
        setSelectedGroup('')
        setEditMode(false)
        setEditAssortmentID(null)
        setAssortmentModel('')
        setPropertiesData([])
        setSelectedProperties([])
        setSelectedAssortmentBrands([])
        setSelectedGroups([])
        setRowData([])
        setAssortmentDetailsData([])
    }

    const handleEdit = async (assortmentData) => {
        try {
            setEditMode(true)
            setEditAssortmentID(assortmentData.assortmentID)
            setAssortmentModel(assortmentData.assortmentModel || '')
            setSelectedAssortmentType(assortmentData.typeOfAssortment || '')
            setAssortmentCode(assortmentData.assortmentID?.toString() || '')
            setAssortmentName(assortmentData.assortmentName || '')
            setAssortmentItemPromotion(assortmentData.promotion || '')
            setFromMrp(assortmentData.fromMRP?.toString() || '')
            setToMrp(assortmentData.toMRP?.toString() || '')
            setInActive(assortmentData.isActive === 'Y')

            if (assortmentData.brandCode) {
                const brandCodes = assortmentData.brandCode.split(',')
                const brandNames = (assortmentData.brandName || '').split(',')
                const brands = brandCodes.map((code, index) => ({
                    value: code,
                    label: brandNames[index] || code,
                }))
                setSelectedAssortmentBrands(brands)
            }

            if (assortmentData.itemGroup) {
                const groupIds = assortmentData.itemGroup.split(',').map((id) => parseInt(id))
                const selectedGroupsData = groupList.filter((g) => groupIds.includes(g.itemGrpID))
                const groups = selectedGroupsData.map((g) => ({
                    value: g.itemGrpID,
                    label: g.itemGrpName,
                }))
                setSelectedGroups(groups)
            }

            if (assortmentData.assortmentDetail && assortmentData.assortmentDetail.length > 0) {
                const mappedData = assortmentData.assortmentDetail.map((item, index) => ({
                    sl: (index + 1).toString(),
                    ItemCode: item.itemCode || '',
                    ItemName: item.itemName || '',
                    IsIncluded: true,
                    barCode: item.barcode || '',
                    itemGroup: item.group || '',
                }))
                setRowData(mappedData)
                setAssortmentDetailsData(assortmentData.assortmentDetail)
            }

            if (assortmentData.assortmentProperty && assortmentData.assortmentProperty.length > 0) {
                setSelectedProperties(assortmentData.assortmentProperty)
            }
        } catch (error) {
            console.error('Error loading assortment for edit:', error)
            alert('Failed to load assortment details')
        }
    }

    const fetchAssortmentProperties = async () => {
        const dummyData = [
            { code: 'C', name: 'Color' },
            { code: 'S', name: 'Size' },
            { code: 'M', name: 'Material' },
        ]
        setAssortmentPropertyList(dummyData)
    }

    const fetchAssortmentBrands = async () => {
        let PJsonData = {}
        const response = await GetAPI('/api/Item/GetBrand', '', PJsonData, cookies)
        setAssortmentBrandList(response.data)
    }

    const fetchAssortmentItemPromotion = async () => {
        let PJsonData = {}
        const response = await GetAPI('/api/Item/GetAllItemPromotion', '', PJsonData, cookies)
        setAssortmentItemPromotionList(response.data)
    }

    const fetchGroupList = async () => {
        let PJsonData = {}
        const response = await GetAPI('/api/ItemGroup/GetAllItemGroup?ItemGrpID=0', '', PJsonData, cookies)
        console.log('Group List API Response:', response.data)
        setGroupList(response.data)
    }

    const fetchAssortmentTypeList = async () => {
        const dummyData = [
            { code: 'B', name: 'Benefit For Assortment' },
            { code: 'P', name: 'Paid For Assortment' },
            { code: 'C', name: 'Both' },
        ]
        setAssortmentTypeList(dummyData)
    }

    const fetchAssortments = async () => {
        try {
            setLoading(true)
            const PJsonData = {}
            const response = await GetAPI(
                '/api/assortment/GetAllAssortment?AssortmentID=0&AssortmentType=P',
                '',
                PJsonData,
                cookies
            )
            if (response && response.data) {
                setAssortments(response.data)
            }
        } catch (error) {
            console.error('Error fetching assortments:', error)
        } finally {
            setLoading(false)
        }
    }

    const fetchGroupWiseProperties = async (groupIds) => {
        try {
            const requestBody = groupIds.map((id) => ({ column1: String(id) }))
            const response = await PostAPI('/api/ItemGroup/GetMultiItemGroupWiseProperty', '', requestBody, cookies)
            console.log('Group Wise Properties API Response:', response.data)
            setPropertiesData(response.data || [])
        } catch (error) {
            console.error('Error fetching group wise properties:', error)
            setPropertiesData([])
        }
    }

    useEffect(() => {
        fetchAssortments()
        fetchAssortmentProperties()
        fetchAssortmentBrands()
        fetchAssortmentItemPromotion()
        fetchGroupList()
        fetchAssortmentTypeList()
    }, [])

    useEffect(() => {
        if (selectedGroups && selectedGroups.length > 0) {
            const groupIds = selectedGroups.map((group) => group.value)
            fetchGroupWiseProperties(groupIds)
            setSelectedProperties((prev) => prev.filter((prop) => groupIds.includes(prop.itemGroup)))
        } else {
            setPropertiesData([])
            setSelectedProperties([])
        }
    }, [selectedGroups])

    const handleGenerate = async () => {
        try {
            const itemGroupString = selectedGroups.map((group) => group.value).join(',')
            const brandCodeString = selectedAssortmentBrands.map((brand) => brand.value).join(',')

            const propertyMap = {}
            selectedProperties.forEach((prop) => {
                const key = `${prop.propertyID}-${prop.propertyName}`
                if (!propertyMap[key]) {
                    propertyMap[key] = {
                        propertyID: prop.propertyID,
                        propertyName: prop.propertyName,
                        propertyValues: [],
                    }
                }
                if (!propertyMap[key].propertyValues.some((v) => v.value === prop.value)) {
                    propertyMap[key].propertyValues.push({ value: prop.value })
                }
            })

            const itemProperty = Object.values(propertyMap)

            const requestBody = {
                itemGrp: itemGroupString,
                brandCode: brandCodeString,
                promotion: assortmentItemPromotion || '',
                fromMRP: parseFloat(fromMrp) || 0,
                toMRP: parseFloat(toMrp) || 0,
                itemProperty: itemProperty,
            }

            console.log('Generate Request Body:', requestBody)
            const response = await PostAPI('/api/Item/GetItemFilterWise', '', requestBody, cookies)

            if (response && response.data) {
                console.log('Generate API Response:', response.data)
                setAssortmentDetailsData(response.data)
                const mappedData = response.data.map((item, index) => ({
                    sl: (index + 1).toString(),
                    ItemCode: item.itemCode || item.ItemCode,
                    ItemName: item.itemName || item.ItemName,
                    IsIncluded: true,
                    barCode: item.barCode || item.barcode || '',
                    itemGroup: item.itemGroup || item.group || '',
                }))
                setRowData(mappedData)
            }
        } catch (error) {
            console.error('Error generating items:', error)
            alert('Failed to generate items. Please try again.')
        }
    }

    const handleSave = async () => {
        if (!assormentName || !selectedAssortmentType || !assormentModel) {
            alert('Please fill in all required fields')
            return
        }

        const itemGroupString = selectedGroups.map((group) => group.value).join(',')
        const brandCodeString = selectedAssortmentBrands.map((brand) => brand.value).join(',')
        const brandNameString = selectedAssortmentBrands.map((brand) => brand.label).join(',')

        const includedItems = rowData.filter((item) => item.IsIncluded === true)

        const assortmentDetail = includedItems.map((item, index) => ({
            assortmentID: 0,
            itemCode: item.ItemCode || '',
            itemName: item.ItemName || '',
            tableID: 1,
            lineNum: index + 1,
            barcode: item.barCode || '',
            group: String(item.itemGroup || ''),
        }))

        const assortmentProperty = selectedProperties

        const formData = {
            assortmentID: editMode ? editAssortmentID : 0,
            assortmentName: assormentName,
            description: '',
            typeOfAssortment: selectedAssortmentType,
            assortmentType: 'P',
            enteredBy: getCookieValue('UserId') || 0,
            usedFor: editMode ? 'U' : 'I',
            store: getCookieValue('DefaultStoreId') || 0,
            isActive: inActive === true ? 'Y' : 'N',
            assortmentModel: assormentModel,
            itemGroup: itemGroupString,
            brandCode: brandCodeString,
            brandName: brandNameString,
            promotion: assortmentItemPromotion || '',
            fromMRP: fromMrp || 0,
            toMRP: toMrp || 0,
            assortmentDetail: assortmentDetail,
            assortmentProperty: assortmentProperty,
        }

        try {
            await PostAPI('/api/AssortmentRep/PostAssortment', '', formData, cookies)
            alert(editMode ? 'Assortment updated successfully!' : 'Assortment created successfully!')
            handleClear()
            setIsFormModalOpen(false)
            fetchAssortments()
        } catch (error) {
            console.error('Error saving assortment:', error)
            alert('Failed to save assortment. Please try again.')
        }
    }

    const handleView = async (row) => {
        try {
            const PJsonData = {}
            const response = await GetAPI(
                `/api/assortment/Getassortment?AssortmentID=${row.assortmentID}`,
                '',
                PJsonData,
                cookies
            )
            if (response && response.data) {
                handleEdit(response.data)
                setIsViewMode(true)
                setIsFormModalOpen(true)
            }
        } catch (error) {
            console.error('Error fetching assortment details:', error)
            alert('Failed to load assortment details')
        }
    }

    const handleEditAction = async (row) => {
        try {
            const PJsonData = {}
            const response = await GetAPI(
                `/api/assortment/Getassortment?AssortmentID=${row.assortmentID}`,
                '',
                PJsonData,
                cookies
            )
            if (response && response.data) {
                handleEdit(response.data)
                setIsViewMode(false)
                setIsFormModalOpen(true)
            }
        } catch (error) {
            console.error('Error fetching assortment details:', error)
            alert('Failed to load assortment details')
        }
    }

    const handleAddNew = () => {
        handleClear()
        setIsViewMode(false)
        setIsFormModalOpen(true)
    }

    const handleDownloadTemplate = () => {
        const templateData = [
            { 'Sl No': '1', 'Item Code': '', 'Item Name': '', 'Exclude/Include': 'Include' },
            { 'Sl No': '2', 'Item Code': '', 'Item Name': '', 'Exclude/Include': 'Include' },
        ]
        const ws = XLSX.utils.json_to_sheet(templateData)
        const wb = XLSX.utils.book_new()
        XLSX.utils.book_append_sheet(wb, ws, 'Template')
        XLSX.writeFile(wb, 'Assortment_Items_Template.xlsx')
    }

    const handleUploadExcel = (e) => {
        const file = e.target.files[0]
        if (!file) return

        const reader = new FileReader()
        reader.onload = (evt) => {
            try {
                const bstr = evt.target.result
                const wb = XLSX.read(bstr, { type: 'binary' })
                const wsname = wb.SheetNames[0]
                const ws = wb.Sheets[wsname]
                const data = XLSX.utils.sheet_to_json(ws)
                const mappedData = data.map((row, index) => ({
                    sl: (index + 1).toString(),
                    ItemCode: row['Item Code'] || '',
                    ItemName: row['Item Name'] || '',
                    IsIncluded:
                        row['Exclude/Include']?.toLowerCase() === 'include' || row['Exclude/Include'] === 'Include',
                    barCode: row['Bar Code'] || '',
                    itemGroup: row['Item Group'] || '',
                }))
                setRowData(mappedData)
                alert(`${mappedData.length} items uploaded successfully!`)
            } catch (error) {
                console.error('Error reading file:', error)
                alert('Error reading Excel file. Please check the format.')
            }
        }
        reader.readAsBinaryString(file)
        e.target.value = ''
    }

    const stats = useMemo(() => ({
        total: assortments.length,
        active: assortments.filter(a => a.isActive === 'Y').length,
        inactive: assortments.filter(a => a.isActive !== 'Y').length,
    }), [assortments])

    const filteredAssortments = useMemo(() => {
        if (activeFilter === 'active') return assortments.filter(a => a.isActive === 'Y')
        if (activeFilter === 'inactive') return assortments.filter(a => a.isActive !== 'Y')
        return assortments
    }, [assortments, activeFilter])

    return (
        <div className="pfa-page">
            {/* Page Header */}
            <div className="pfa-page-header">
                <h1 className="pfa-page-title">Assortment For Promotion</h1>
                <button className="pfa-btn pfa-btn-add" onClick={handleAddNew}>
                    <Plus size={18} />
                    Add New Assortment
                </button>
            </div>

            {/* Stats Bar */}
            <div className="pfa-stats-bar">
                <div className={`pfa-stat-card${activeFilter === 'all' ? ' pfa-stat-card--selected' : ''}`} onClick={() => setActiveFilter('all')}>
                    <div className="pfa-stat-icon pfa-stat-icon--blue"><ListChecks size={20} /></div>
                    <div>
                        <div className="pfa-stat-value">{stats.total}</div>
                        <div className="pfa-stat-label">TOTAL ASSORTMENTS</div>
                    </div>
                </div>
                <div className={`pfa-stat-card${activeFilter === 'active' ? ' pfa-stat-card--selected' : ''}`} onClick={() => setActiveFilter('active')}>
                    <div className="pfa-stat-icon pfa-stat-icon--green"><CheckCircle2 size={20} /></div>
                    <div>
                        <div className="pfa-stat-value">{stats.active}</div>
                        <div className="pfa-stat-label">ACTIVE</div>
                    </div>
                </div>
                <div className={`pfa-stat-card${activeFilter === 'inactive' ? ' pfa-stat-card--selected' : ''}`} onClick={() => setActiveFilter('inactive')}>
                    <div className="pfa-stat-icon pfa-stat-icon--amber"><XCircle size={20} /></div>
                    <div>
                        <div className="pfa-stat-value">{stats.inactive}</div>
                        <div className="pfa-stat-label">INACTIVE</div>
                    </div>
                </div>
            </div>

            {/* Listing */}
            <div className="pfa-listing-card">
                {/* Filter Chips */}
                <div className="pfa-filter-bar">
                    <button className={`pfa-filter-chip${activeFilter === 'all' ? ' pfa-filter-chip--active' : ''}`} onClick={() => setActiveFilter('all')}>All Assortments</button>
                    <button className={`pfa-filter-chip${activeFilter === 'active' ? ' pfa-filter-chip--active' : ''}`} onClick={() => setActiveFilter('active')}>Active ({stats.active})</button>
                    <button className={`pfa-filter-chip${activeFilter === 'inactive' ? ' pfa-filter-chip--active' : ''}`} onClick={() => setActiveFilter('inactive')}>Inactive ({stats.inactive})</button>
                    <span className="pfa-filter-count">{filteredAssortments.length} records found</span>
                </div>
                <DataTable
                    columns={[
                        { field: 'assortmentID', headerName: 'ID', width: 80 },
                        { field: 'assortmentName', headerName: 'Assortment Name', width: 250 },
                        {
                            field: 'typeOfAssortment',
                            headerName: 'Type',
                            width: 100,
                            cellRenderer: (value) => <span className="pfa-badge">{value}</span>,
                        },
                        {
                            field: 'isActive',
                            headerName: 'Status',
                            width: 100,
                            cellRenderer: (value) => (
                                <span className={`pfa-status-badge ${value === 'Y' ? 'pfa-status-badge--active' : 'pfa-status-badge--inactive'}`}>
                                    <span className={`pfa-status-dot ${value === 'Y' ? 'pfa-status-dot--active' : 'pfa-status-dot--inactive'}`} />
                                    {value === 'Y' ? 'Active' : 'Inactive'}
                                </span>
                            ),
                        },
                    ]}
                    rowData={filteredAssortments}
                    rowIdField="assortmentID"
                    actions={[
                        { icon: <Eye size={16} />, label: 'View', onClick: handleView, variant: 'primary' },
                        { icon: <Edit size={16} />, label: 'Edit', onClick: handleEditAction, variant: 'warning' },
                    ]}
                    defaultPageSize={5}
                    searchPlaceholder="Search assortments..."
                />
            </div>

            {/* Add / Edit / View Modal */}
            <Dialog open={isFormModalOpen} onOpenChange={setIsFormModalOpen}>
                <DialogContent className="pfa-dialog-content">
                    <DialogHeader className="pb-4 mb-2" style={{ borderBottom: '1px solid #cbd5e1' }}>
                        <DialogTitle className="pfa-dialog-title">
                            {isViewMode ? 'View Assortment' : editMode ? 'Edit Assortment' : 'Create New Assortment'}
                        </DialogTitle>
                    </DialogHeader>

                    <div className="pfa-modal-body">
                        {/* Left Panel — Form */}
                        <div className="pfa-panel">
                            <div className="pfa-form-stack">
                                {/* Assortment Model */}
                                <div className="pfa-field-row">
                                    <label className="pfa-label">Assortment Model</label>
                                    <div className="pfa-radio-group">
                                        <label className="pfa-radio-label">
                                            <input
                                                type="radio"
                                                name="assortmentModel"
                                                value="D"
                                                checked={assormentModel === 'D'}
                                                onChange={(e) => setAssortmentModel(e.target.value)}
                                                disabled={isViewMode}
                                            />
                                            <span className="pfa-radio-text">Dynamic</span>
                                        </label>
                                        <label className="pfa-radio-label">
                                            <input
                                                type="radio"
                                                name="assortmentModel"
                                                value="P"
                                                checked={assormentModel === 'P'}
                                                onChange={(e) => setAssortmentModel(e.target.value)}
                                                disabled={isViewMode}
                                            />
                                            <span className="pfa-radio-text">Preset</span>
                                        </label>
                                    </div>
                                </div>

                                {/* Assortment Type */}
                                <div className="pfa-field-row">
                                    <label className="pfa-label">Assortment Type</label>
                                    <div className="pfa-select-wrapper">
                                        <select
                                            className="pfa-select"
                                            value={selectedAssortmentType}
                                            onChange={(e) => setSelectedAssortmentType(e.target.value)}
                                            disabled={isViewMode}
                                        >
                                            <option value="" disabled>Select type</option>
                                            {assortmentTypeList.map((type) => (
                                                <option key={type.code} value={type.code}>{type.name}</option>
                                            ))}
                                        </select>
                                        <span className="pfa-select-arrow">
                                            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </span>
                                    </div>
                                </div>

                                {/* Assortment Code */}
                                <div className="pfa-field-row">
                                    <label className="pfa-label">Assortment Code</label>
                                    <input
                                        type="text"
                                        className="pfa-input"
                                        value={assormentCode}
                                        onChange={(e) => setAssortmentCode(e.target.value)}
                                        placeholder="Enter assortment code"
                                        disabled
                                    />
                                </div>

                                {/* Assortment Name */}
                                <div className="pfa-field-row">
                                    <label className="pfa-label">Assortment Name</label>
                                    <input
                                        type="text"
                                        className="pfa-input"
                                        value={assormentName}
                                        onChange={(e) => setAssortmentName(e.target.value)}
                                        placeholder="Enter assortment name"
                                        disabled={isViewMode}
                                    />
                                </div>

                                {/* Assortment Variant Section */}
                                <h3 className="pfa-section-title">Assortment Variant</h3>

                                {/* Select Brand */}
                                <div className="pfa-field-row">
                                    <label className="pfa-label">Select Brand</label>
                                    <Select
                                        options={assortmentBrandList.map((brand) => ({
                                            value: brand.BrandCode,
                                            label: brand.BrandName,
                                        }))}
                                        value={selectedAssortmentBrands}
                                        onChange={(selectedOptions) => setSelectedAssortmentBrands(selectedOptions || [])}
                                        isMulti
                                        className="pfa-react-select"
                                        classNamePrefix="select"
                                        isDisabled={isViewMode}
                                    />
                                </div>

                                {/* Select Item Promotion + IsActive */}
                                <div className="pfa-field-row">
                                    <label className="pfa-label">Select Item Promotion</label>
                                    <div className="pfa-inline-group">
                                        <div className="pfa-select-wrapper" style={{ flex: 1 }}>
                                            <select
                                                className="pfa-select"
                                                value={assortmentItemPromotion}
                                                onChange={(e) => setAssortmentItemPromotion(e.target.value)}
                                                disabled={isViewMode}
                                            >
                                                <option value="" disabled>Select Item Promotion</option>
                                                {assortmentItemPromotionList.map((promotion) => (
                                                    <option key={promotion.Code} value={promotion.Code}>{promotion.Name}</option>
                                                ))}
                                            </select>
                                            <span className="pfa-select-arrow">
                                                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                </svg>
                                            </span>
                                        </div>
                                        <label className="pfa-checkbox-label">
                                            <span className="pfa-checkbox-text">IsActive</span>
                                            <input
                                                type="checkbox"
                                                className="pfa-checkbox"
                                                checked={inActive}
                                                onChange={(e) => setInActive(e.target.checked)}
                                                disabled={isViewMode}
                                            />
                                        </label>
                                    </div>
                                </div>

                                {/* MRP Range */}
                                <div className="pfa-field-row">
                                    <label className="pfa-label">MRP Range</label>
                                    <div className="pfa-inline-group">
                                        <div className="pfa-mrp-pair">
                                            <span className="pfa-mrp-label">From :</span>
                                            <input
                                                type="number"
                                                className="pfa-mrp-input"
                                                value={fromMrp}
                                                onChange={(e) => setFromMrp(e.target.value)}
                                                placeholder="0.00"
                                                disabled={isViewMode}
                                            />
                                        </div>
                                        <div className="pfa-mrp-pair">
                                            <span className="pfa-mrp-label">To :</span>
                                            <input
                                                type="number"
                                                className="pfa-mrp-input"
                                                value={toMrp}
                                                onChange={(e) => setToMrp(e.target.value)}
                                                placeholder="0.00"
                                                disabled={isViewMode}
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Grid Toolbar */}
                                <div className="pfa-grid-toolbar">
                                    <button className="pfa-btn pfa-btn-primary" onClick={handleDownloadTemplate} disabled={isViewMode}>
                                        Download Template
                                    </button>
                                    <button className="pfa-btn pfa-btn-uploads" onClick={() => fileInputRef.current?.click()} disabled={isViewMode}>
                                        Upload Excel
                                    </button>
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        onChange={handleUploadExcel}
                                        accept=".xlsx, .xls"
                                        style={{ display: 'none' }}
                                    />
                                    <button className="pfa-btn pfa-btn-generate" onClick={handleGenerate} disabled={isViewMode}>
                                        Generate
                                    </button>
                                    <button className="pfa-btn pfa-btn-cancel" onClick={handleClear} disabled={isViewMode}>
                                        Clear
                                    </button>
                                </div>

                                {/* AG Grid */}
                                <div className="pfa-ag-container">
                                    <div className={`ag-theme-quartz pfa-ag-grid`}>
                                        <AgGridReact
                                            rowData={rowData}
                                            columnDefs={colomnDefs}
                                            pagination={true}
                                            paginationPageSize={10}
                                        />
                                    </div>
                                </div>

                            </div>
                        </div>

                        {/* Right Panel — Properties */}
                        <div className="pfa-panel">
                            <h2 className="pfa-panel-title">Select Properties</h2>

                            {/* Select Group */}
                            <div className="pfa-field-row" style={{ marginBottom: '16px' }}>
                                <label className="pfa-label">Select Group</label>
                                <Select
                                    options={groupList.map((group) => ({
                                        value: group.itemGrpID,
                                        label: group.itemGrpName,
                                    }))}
                                    value={selectedGroups}
                                    onChange={(selectedOptions) => setSelectedGroups(selectedOptions || [])}
                                    isMulti
                                    className="pfa-react-select"
                                    classNamePrefix="select"
                                    isDisabled={isViewMode}
                                />
                            </div>

                            {/* Properties Table */}
                            <div className="pfa-properties-table">
                                <div
                                    className="pfa-properties-header"
                                    style={{ gridTemplateColumns: `repeat(${propertiesData.length || 1}, 1fr)` }}
                                >
                                    {propertiesData.length > 0 ? (
                                        propertiesData.map((property) => (
                                            <div key={property.propertyID}>{property.propertyName}</div>
                                        ))
                                    ) : (
                                        <div className="pfa-properties-empty">Select a group to view properties</div>
                                    )}
                                </div>

                                <div className="pfa-properties-body">
                                    {propertiesData.length > 0 && (
                                        <div
                                            className="pfa-properties-values"
                                            style={{ gridTemplateColumns: `repeat(${propertiesData.length}, 1fr)` }}
                                        >
                                            {propertiesData.map((property) => (
                                                <div key={property.propertyID} className="pfa-property-col">
                                                    {property.propertyValues.map((propValue, index) => (
                                                        <div key={`${property.propertyID}-${index}`} className="pfa-property-value-row">
                                                            <input
                                                                type="checkbox"
                                                                id={`${property.propertyID}-${propValue.value}`}
                                                                className="pfa-property-checkbox"
                                                                disabled={isViewMode}
                                                                checked={selectedProperties.some(
                                                                    (p) => p.propertyID === property.propertyID && p.value === propValue.value
                                                                )}
                                                                onChange={(e) => {
                                                                    const isChecked = e.target.checked
                                                                    setSelectedProperties((prev) => {
                                                                        if (isChecked) {
                                                                            const newEntries = selectedGroups.map((group) => ({
                                                                                itemGroup: group.value,
                                                                                propertyID: property.propertyID,
                                                                                propertyName: property.propertyName,
                                                                                value: propValue.value,
                                                                            }))
                                                                            return [...prev, ...newEntries]
                                                                        } else {
                                                                            return prev.filter(
                                                                                (p) => !(p.propertyID === property.propertyID && p.value === propValue.value)
                                                                            )
                                                                        }
                                                                    })
                                                                }}
                                                            />
                                                            <label
                                                                htmlFor={`${property.propertyID}-${propValue.value}`}
                                                                className="pfa-property-value-label"
                                                            >
                                                                {propValue.value}
                                                            </label>
                                                        </div>
                                                    ))}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Panel Actions */}
                            {!isViewMode && (
                                <div className="pfa-panel-actions">
                                    <button
                                        className="pfa-btn pfa-btn-primary"
                                        onClick={() => {
                                            setSelectedProperties([])
                                            setSelectedGroups([])
                                            setPropertiesData([])
                                        }}
                                    >
                                        Cancel
                                    </button>
                                    <button className="pfa-btn pfa-btn-primary">Select</button>
                                </div>
                            )}
                        </div>
                    </div>

                {/* Fixed Bottom Actions */}
                <div className="pfa-form-actions">
                        {!isViewMode && (
                            <button className="pfa-btn pfa-btn-primary" onClick={handleSave}>
                                {editMode ? 'Update' : 'Save'}
                            </button>
                        )}
                        <button
                            className="pfa-btn pfa-btn-cancel"
                            onClick={() => {
                                handleClear()
                                setIsFormModalOpen(false)
                            }}
                        >
                            {isViewMode ? 'Close' : 'Cancel'}
                        </button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default PromotionForAssortment