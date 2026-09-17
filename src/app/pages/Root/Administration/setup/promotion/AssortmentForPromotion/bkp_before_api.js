import React from 'react'
import { useState, useEffect } from 'react'
import { AgGridReact } from 'ag-grid-react'
import { ModuleRegistry, AllCommunityModule } from 'ag-grid-community'
import { themeQuartz } from 'ag-grid-community'
import { Button } from '@/components/ui/button'

ModuleRegistry.registerModules([AllCommunityModule])

const PromotionForAssortment = () => {
    
    const [assormentModel, setAssortmentModel] = useState('');
    const [selectedAssortmentType, setSelectedAssortmentType] = useState('');
    const [assortmentTypeList, setAssortmentTypeList] = useState([]);
    const [assormentCode, setAssortmentCode] = useState('');
    const [assormentName, setAssortmentName] = useState('');
    const [assortmentProperty, setAssortmentProperty] = useState('');
    const [assortmentPropertyList, setAssortmentPropertyList] = useState([]);
    const [assortmentBrand, setAssortmentBrand] = useState('');
    const [assortmentBrandList, setAssortmentBrandList] = useState([]);
    const [assortmentItemPromotion, setAssortmentItemPromotion] = useState('');
    const [assortmentItemPromotionList, setAssortmentItemPromotionList] = useState([]);
    const [fromMrp, setFromMrp] = useState('');
    const [toMrp, setToMrp] = useState('');
    const [inActive, setInActive] = useState(false);
    const [selectedGroup, setSelectedGroup] = useState('');
    const [groupList, setGroupList] = useState([]);

    //!AG Grid
    const [rowData, setRowData] = useState([]);

    useEffect(() => {
        const dummyRowData = [
            {sl: '1', ItemCode: 'Item001', ItemName: 'Product 1', IsIncluded: true},
            {sl: '2', ItemCode: 'Item002', ItemName: 'Product 2', IsIncluded: false},
            {sl: '3', ItemCode: 'Item003', ItemName: 'Product 3', IsIncluded: true},
            {sl: '4', ItemCode: 'Item004', ItemName: 'Product 4', IsIncluded: false},
        ]
        const response = dummyRowData;
        setRowData(response);
    }, [])

    

    const isIncludedCellRenderer = (params) => {
        const handleChange = (e) => {
            const newValue = e.target.value === 'I';
            params.node.setDataValue('IsIncluded', newValue);
        };
        
        return (
            <>
                <select 
                    value={params.value ? 'I' : 'E'} 
                    onChange={handleChange}
                    className={`px-2 py-1 text-sm font-semibold rounded ${params.value ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
                >
                    <option value="I">Include</option>
                    <option value="E">Exclude</option>
                </select>
            </>
        )
    }

    const colomnDefs = [
        { headerName: 'Sl No', field: 'sl', width: 80 },
        { headerName: 'Item Code', field: 'ItemCode', width: 150 },
        { headerName: 'Item Name', field: 'ItemName', width: 300 },
        { headerName: 'Exclude/Include', field: 'IsIncluded', width: 150, cellRenderer: isIncludedCellRenderer},
    ]

    //! Ag Grid End

    
    const handleClear = () => {
        setSelectedAssortmentType('');
        setAssortmentCode('');
        setAssortmentName('');
        setAssortmentProperty('');
        setAssortmentBrand('');
        setAssortmentItemPromotion('');
        setFromMrp('');
        setToMrp('');
        setInActive(false);
        setSelectedGroup('');
    }




    //!Dummy Api Call
    const fetchAssortmentProperties = async () => {
            const dummyData = [
                { code: 'C', name: 'Color' },
                { code: 'S', name: 'Size' },
                { code: 'M', name: 'Material' },
            ];
            const response = await dummyData;
            setAssortmentPropertyList(response);
    };

    const fetchAssortmentBrands = async () => {
        const dummyData = [
            { code: 'N', name: 'Nike' },
            { code: 'A', name: 'Adidas' },
            { code: 'P', name: 'Puma' },
        ];
        const response = await dummyData;
        setAssortmentBrandList(response);
    }

    const fetchAssortmentItemPromotion = async () => {
        const dummyData = [
            { code: 'IP1', name: 'Promotion 1' },
            { code: 'IP2', name: 'Promotion 2' },
            { code: 'IP3', name: 'Promotion 3' },
        ];
        const response = await dummyData;
        setAssortmentItemPromotionList(response);
    }

    const fetchGroupList = async () => {
        const dummyData = [
            { code: 'G1', name: 'Group 1' },
            { code: 'G2', name: 'Group 2' },
            { code: 'G3', name: 'Group 3' },
        ];
        const response = await dummyData;
        setGroupList(response);
    }

    const fetchAssortmentTypeList = async () => {
        const dummyData = [
            { code: 'B', name: 'Benefit For Assortment' },
            { code: 'P', name: 'Paid For Assortment' },
            { code: 'C', name: 'Both' },
        ];
        const response = await dummyData;
        setAssortmentTypeList(response);
    }

    useEffect(() => {
        fetchAssortmentProperties();
        fetchAssortmentBrands();
        fetchAssortmentItemPromotion();
        fetchGroupList();
        fetchAssortmentTypeList();
    }, [])

  return (
    <div className='p-6 bg-white'>
        <div className='flex gap-6'>
            {/* Left Side - Assortment Creation */}
            <div className='flex-1'>
                {/* Title */}
                <h2 className='text-xl font-bold text-sky-600 mb-8'>Assortment Creation</h2>

                <div className='max-w-6xl space-y-4'>
            {/* Assortment Model */}
            <div className='grid grid-cols-[200px,1fr] gap-4 items-center'>
                <label className="text-sm font-medium text-gray-900">Assortment Model</label>
                <div className='flex items-center gap-4'>
                    <label className='flex items-center gap-2 px-4 py-2 border border-gray-900 bg-white cursor-pointer'>
                        <input 
                            type='radio' 
                            name='assortmentModel' 
                            value='D' 
                            checked={assormentModel === 'D'}
                            onChange={(e) => setAssortmentModel(e.target.value)} 
                            className='w-4 h-4 text-sky-600'
                        />
                        <span className='text-sm font-semibold text-sky-600'>Dynamic</span>
                    </label>
                    <label className='flex items-center gap-2 px-4 py-2 border border-gray-900 bg-white cursor-pointer'>
                        <input 
                            type='radio' 
                            name='assortmentModel' 
                            value='P'
                            checked={assormentModel === 'P'}
                            onChange={(e) => setAssortmentModel(e.target.value)} 
                            className='w-4 h-4 text-sky-600'
                        />
                        <span className='text-sm font-semibold text-sky-600'>Preset</span>
                    </label>
                </div>
            </div>
           
            <div>
                <div className='grid grid-cols-[200px,1fr] gap-4 items-center'>
                    <label className="text-sm font-medium text-gray-900">Assortment Type</label>
                    <div className='relative'>
                        <select 
                            className='w-full h-10 px-3 pr-10 bg-gray-50 border border-gray-200 rounded text-sm text-gray-700 focus:outline-none focus:border-gray-300 focus:bg-white appearance-none cursor-pointer transition-colors' 
                            value={selectedAssortmentType} 
                            onChange={(e) => setSelectedAssortmentType(e.target.value)}
                        >
                            <option value="" disabled>Select type</option>
                            {assortmentTypeList.map((type) => (
                                <option key={type.code} value={type.code}>
                                    {type.name}
                                </option>
                            ))}
                        </select>
                        <div className='absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none'>
                            <svg className='w-4 h-4 text-gray-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 9l-7 7-7-7' />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>

            {/* Assortment Code */}
            <div className='grid grid-cols-[200px,1fr] gap-4 items-center'>
                <label className="text-sm font-medium text-gray-900">Assortment Code</label>
                <input
                    type='text' 
                    name='assortmentCode' 
                    value={assormentCode} 
                    onChange={(e) => setAssortmentCode(e.target.value)}
                    placeholder='Enter assortment code'
                    className='w-full h-10 px-3 bg-gray-50 border border-gray-200 rounded text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:border-gray-300 focus:bg-white transition-colors'
                />
            </div>

            {/* Assortment Name */}
            <div className='grid grid-cols-[200px,1fr] gap-4 items-center'>
                <label className="text-sm font-medium text-gray-900">Assortment Name</label>
                <input
                    type='text' 
                    name='assortmentName' 
                    value={assormentName} 
                    onChange={(e) => setAssortmentName(e.target.value)}
                    placeholder='Enter assortment name'
                    className='w-full h-10 px-3 bg-gray-50 border border-gray-200 rounded text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:border-gray-300 focus:bg-white transition-colors'
                />
            </div>

            {/* Assortment Variant Section */}
            <div className='mt-8'>
                <h3 className='text-base font-bold text-sky-600 mb-4'>Assortment Variant</h3>

                <div className='space-y-4'>
                    {/* Select Property */}
                    <div className='grid grid-cols-[200px,1fr] gap-4 items-center'>
                        <label className="text-sm font-medium text-gray-900">Select Property</label>
                        <div className='relative'>
                            <select 
                                className='w-full h-10 px-3 pr-10 bg-gray-50 border border-gray-200 rounded text-sm text-gray-700 focus:outline-none focus:border-gray-300 focus:bg-white appearance-none cursor-pointer transition-colors' 
                                value={assortmentProperty} 
                                onChange={(e) => setAssortmentProperty(e.target.value)}
                            >
                                <option value="" disabled>Select Property</option>
                                {assortmentPropertyList.map((property) => (
                                    <option key={property.code} value={property.code}>
                                        {property.name}
                                    </option>
                                ))}
                            </select>
                            <div className='absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none'>
                                <svg className='w-4 h-4 text-gray-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 9l-7 7-7-7' />
                                </svg>
                            </div>
                        </div>
                    </div>

                    {/* Select Brand */}
                    <div className='grid grid-cols-[200px,1fr] gap-4 items-center'>
                        <label className="text-sm font-medium text-gray-900">Select Brand</label>
                        <div className='relative'>
                            <select 
                                className='w-full h-10 px-3 pr-10 bg-gray-50 border border-gray-200 rounded text-sm text-gray-700 focus:outline-none focus:border-gray-300 focus:bg-white appearance-none cursor-pointer transition-colors' 
                                value={assortmentBrand} 
                                onChange={(e) => setAssortmentBrand(e.target.value)}
                            >
                                <option value="" disabled>Select Brand</option>
                                {assortmentBrandList.map((brand) => (
                                    <option key={brand.code} value={brand.code}>
                                        {brand.name}
                                    </option>
                                ))}
                            </select>
                            <div className='absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none'>
                                <svg className='w-4 h-4 text-gray-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 9l-7 7-7-7' />
                                </svg>
                            </div>
                        </div>
                    </div>

                    {/* Select Item Promotion with Inactive Checkbox */}
                    <div className='grid grid-cols-[200px,1fr] gap-4 items-center'>
                        <label className="text-sm font-medium text-gray-900">Select Item Promotion</label>
                        <div className='flex items-center gap-4'>
                            <div className='relative flex-1'>
                                <select 
                                    className='w-full h-10 px-3 pr-10 bg-gray-50 border border-gray-200 rounded text-sm text-gray-700 focus:outline-none focus:border-gray-300 focus:bg-white appearance-none cursor-pointer transition-colors' 
                                    value={assortmentItemPromotion} 
                                    onChange={(e) => setAssortmentItemPromotion(e.target.value)}
                                >
                                    <option value="" disabled>Select Item Promotion</option>
                                    {assortmentItemPromotionList.map((promotion) => (
                                        <option key={promotion.code} value={promotion.code}>
                                            {promotion.name}
                                        </option>
                                    ))}
                                </select>
                                <div className='absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none'>
                                    <svg className='w-4 h-4 text-gray-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 9l-7 7-7-7' />
                                    </svg>
                                </div>
                            </div>
                            <label className='flex items-center gap-2 whitespace-nowrap'>
                                <span className='text-sm font-semibold text-sky-600'>Inactive</span>
                                <input 
                                    type='checkbox' 
                                    name='inActive' 
                                    checked={inActive} 
                                    onChange={(e) => setInActive(e.target.checked)}
                                    className='w-4 h-4 border-gray-900'
                                />
                            </label>
                        </div>
                    </div>

                    {/* MRP Range */}
                    <div className='grid grid-cols-[200px,1fr] gap-4 items-center'>
                        <label className="text-sm font-medium text-gray-900">MRP Range</label>
                        <div className='flex items-center gap-4'>
                            <div className='flex items-center gap-2'>
                                <span className='text-sm font-semibold text-sky-600'>From :</span>
                                <input 
                                    type='number' 
                                    name='fromMrp'
                                    value={fromMrp} 
                                    onChange={(e) => setFromMrp(e.target.value)}
                                    className='w-32 h-10 px-3 bg-gray-50 border border-gray-200 rounded text-sm text-gray-700 text-center placeholder:text-gray-400 focus:outline-none focus:border-gray-300 focus:bg-white transition-colors'
                                    placeholder='0.00'
                                />
                            </div>
                            <div className='flex items-center gap-2'>
                                <span className='text-sm font-semibold text-sky-600'>To :</span>
                                <input 
                                    type='number' 
                                    name='toMrp'
                                    value={toMrp} 
                                    onChange={(e) => setToMrp(e.target.value)}
                                    className='w-32 h-10 px-3 bg-gray-50 border border-gray-200 rounded text-sm text-gray-700 text-center placeholder:text-gray-400 focus:outline-none focus:border-gray-300 focus:bg-white transition-colors'
                                    placeholder='0.00'
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Assortment Item Grid */}
            <div className='mt-8'>
                    <div className='ml-24 mb-3 mt-3 flex items-center gap-6'>
                        {/* <h3 className='text-base font-bold text-sky-600 mr-24'>Assortment Items</h3> */}
                        <Button className='w-32 bg-green-600 hover:bg-green-700 text-white'>Download Template</Button>
                        <Button className='w-32 bg-gray-600 hover:bg-gray-700 text-white'>Upload Excel</Button>
                        <Button className='w-32 bg-amber-600 hover:bg-amber-700 text-white'>Generate</Button>
                        <Button onClick={handleClear} className='w-32 bg-red-600 hover:bg-red-700 text-white'>Clear</Button>
                    </div>
                <div className={`ag-theme-quartz ${themeQuartz} h-[300px] w-[700px]`}>
                    <AgGridReact
                        rowData={rowData}
                        columnDefs={colomnDefs}
                        pagination={true}
                        paginationPageSize={10}
                    />
                </div>
            </div>

            {/* Save/Cancel Buttons  */}
            <div className='m-3 flex items-center gap-6'>
                <Button className='w-32 bg-sky-600 hover:bg-sky-700 text-white'>Save</Button>
                <Button className='w-32 bg-red-600 hover:bg-red-700 text-white'>Cancel</Button>
            </div>
        </div>
            </div>

            {/* Right Side - Select Properties */}
            <div className='flex-1 border border-gray-300 bg-white p-6 rounded-lg'>
                <h2 className='text-xl font-bold text-red-600 mb-6'>Select Properties</h2>
                
                {/* Group Dropdown */}
                <div className='grid grid-cols-[200px,1fr] gap-4 items-center mb-4'>
                    <label className="text-sm font-medium text-gray-900">Select Group</label>
                    <div className='relative'>
                        <select 
                            className='w-full h-10 px-3 pr-10 bg-gray-50 border border-gray-200 rounded text-sm text-gray-700 focus:outline-none focus:border-gray-300 focus:bg-white appearance-none cursor-pointer transition-colors' 
                            value={selectedGroup} 
                            onChange={(e) => setSelectedGroup(e.target.value)}
                        >
                            <option value="" disabled>Select Group</option>
                            {groupList.map((grp) => (
                                <option key={grp.code} value={grp.code}>
                                    {grp.name}
                                </option>
                            ))}
                        </select>
                        <div className='absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none'>
                            <svg className='w-4 h-4 text-gray-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 9l-7 7-7-7' />
                            </svg>
                        </div>
                    </div>
                </div>

                {/* Properties Table */}
                <div className='border border-gray-300 bg-gray-50 rounded mb-4'>
                    <div className='grid grid-cols-3 gap-1 bg-gray-200 p-2 font-semibold text-sm text-gray-900'>
                        <div>Division</div>
                        <div>Section</div>
                        <div>Department</div>
                    </div>
                    <div className='p-3 space-y-2'>
                        <div className='grid grid-cols-3 gap-1 items-start text-sm'>
                            <div className='flex items-center gap-2'>
                                <input type='checkbox' id='mens' className='w-4 h-4' />
                                <label htmlFor='mens' className='cursor-pointer'>Mens</label>
                            </div>
                            <div className='space-y-2'>
                                <div className='flex items-center gap-2'>
                                    <input type='checkbox' id='mens-upper' className='w-4 h-4' />
                                    <label htmlFor='mens-upper' className='cursor-pointer'>Mens Upper</label>
                                </div>
                                <div className='flex items-center gap-2'>
                                    <input type='checkbox' id='mens-lower' className='w-4 h-4' />
                                    <label htmlFor='mens-lower' className='cursor-pointer'>Mens Lower</label>
                                </div>
                                <div className='flex items-center gap-2'>
                                    <input type='checkbox' id='mens-ethnic' className='w-4 h-4' />
                                    <label htmlFor='mens-ethnic' className='cursor-pointer'>Mens Ethnic</label>
                                </div>
                            </div>
                            <div className='space-y-2'>
                                <div className='flex items-center gap-2'>
                                    <input type='checkbox' id='mens-tshirt' className='w-4 h-4' />
                                    <label htmlFor='mens-tshirt' className='cursor-pointer'>Mens T Shirt</label>
                                </div>
                                <div className='flex items-center gap-2'>
                                    <input type='checkbox' id='mns-casual-shirt' className='w-4 h-4' />
                                    <label htmlFor='mns-casual-shirt' className='cursor-pointer'>Mns Casual Shirt</label>
                                </div>
                                <div className='flex items-center gap-2'>
                                    <input type='checkbox' id='mens-formal-shirt' className='w-4 h-4' />
                                    <label htmlFor='mens-formal-shirt' className='cursor-pointer'>Mens Formal Shirt</label>
                                </div>
                                <div className='flex items-center gap-2'>
                                    <input type='checkbox' id='mns-round-neck-tshirt' className='w-4 h-4' />
                                    <label htmlFor='mns-round-neck-tshirt' className='cursor-pointer'>Mns Round Necj T-Shirt</label>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Buttons */}
                <div className='flex gap-4 mb-4'>
                    <Button className='w-32 bg-red-600 hover:bg-red-700 text-white'>Cancel</Button>
                    <Button className='w-32 bg-sky-600 hover:bg-sky-700 text-white'>Select</Button>
                </div>

                
            </div>
        </div>
    </div>
  )
}

export default PromotionForAssortment