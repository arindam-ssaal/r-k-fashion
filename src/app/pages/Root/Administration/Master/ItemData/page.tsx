import { Minus, Plus, Trash2, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

interface ItemRow {
  id: number
  barcode: string
  itemName: string
  qty: number
  mrp: number
  discount: number
  promotion: number
  netPayable: number
}

// Mock database of items
const MOCK_ITEMS_DB = [
  { barcode: '1234567887654', itemName: 'Item A1001', mrp: 1299 },
  { barcode: 'DB100002', itemName: 'LE_KURTI-CK-083-XXL-COL-4', mrp: 398 },
  { barcode: 'DB100003', itemName: 'LE_KURTI-CK-083-L-COL-4', mrp: 398 },
  { barcode: 'DB100004', itemName: 'LE_SHORT_KURTI-EK-189-L-COL-4', mrp: 298 },
  { barcode: '76552234567', itemName: 'Item A1003', mrp: 799 },
  { barcode: 'DB100005', itemName: 'LE_PALAZZO-PL-056-M-COL-2', mrp: 450 },
  { barcode: 'DB100006', itemName: 'LE_DUPATTA-DP-023-FREE-COL-5', mrp: 250 },
]

function BillingItemData() {
  const [items, setItems] = useState<ItemRow[]>([])
  const [scanInput, setScanInput] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [notFoundBarcode, setNotFoundBarcode] = useState('')
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const beepIntervalRef = useRef<NodeJS.Timeout | null>(null)

  // Create beep sound on mount
  useEffect(() => {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
    const oscillator = audioContext.createOscillator()
    const gainNode = audioContext.createGain()
    
    oscillator.connect(gainNode)
    gainNode.connect(audioContext.destination)
    
    oscillator.frequency.value = 800
    oscillator.type = 'sine'
    
    gainNode.gain.setValueAtTime(0, audioContext.currentTime)
    
    audioRef.current = {
      play: () => {
        const beepContext = new (window.AudioContext || (window as any).webkitAudioContext)()
        const beepOscillator = beepContext.createOscillator()
        const beepGain = beepContext.createGain()
        
        beepOscillator.connect(beepGain)
        beepGain.connect(beepContext.destination)
        
        beepOscillator.frequency.value = 800
        beepOscillator.type = 'sine'
        
        beepGain.gain.setValueAtTime(0.3, beepContext.currentTime)
        beepGain.gain.exponentialRampToValueAtTime(0.01, beepContext.currentTime + 0.5)
        
        beepOscillator.start(beepContext.currentTime)
        beepOscillator.stop(beepContext.currentTime + 0.5)
      }
    } as any
  }, [])

  // Handle modal beeping
  useEffect(() => {
    if (showModal) {
      // Play immediately
      audioRef.current?.play()
      
      // Then play every 3 seconds
      beepIntervalRef.current = setInterval(() => {
        audioRef.current?.play()
      }, 3000)
    } else {
      if (beepIntervalRef.current) {
        clearInterval(beepIntervalRef.current)
        beepIntervalRef.current = null
      }
    }

    return () => {
      if (beepIntervalRef.current) {
        clearInterval(beepIntervalRef.current)
      }
    }
  }, [showModal])

  const handleScan = () => {
    if (!scanInput.trim()) return

    // Check if item exists in database
    const foundItem = MOCK_ITEMS_DB.find(item => item.barcode === scanInput.trim())

    if (foundItem) {
      // Check if item already exists in table
      const existingItemIndex = items.findIndex(item => item.barcode === foundItem.barcode)
      
      if (existingItemIndex !== -1) {
        // Increase quantity
        const updatedItems = [...items]
        updatedItems[existingItemIndex].qty += 1
        updatedItems[existingItemIndex].netPayable = 
          updatedItems[existingItemIndex].qty * 
          (updatedItems[existingItemIndex].mrp - 
           updatedItems[existingItemIndex].discount - 
           updatedItems[existingItemIndex].promotion)
        setItems(updatedItems)
      } else {
        // Add new item
        const newItem: ItemRow = {
          id: Date.now(),
          barcode: foundItem.barcode,
          itemName: foundItem.itemName,
          qty: 1,
          mrp: foundItem.mrp,
          discount: 0,
          promotion: 0,
          netPayable: foundItem.mrp
        }
        setItems([...items, newItem])
      }
      setScanInput('')
    } else {
      // Item not found - show modal
      setNotFoundBarcode(scanInput.trim())
      setShowModal(true)
    }
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setNotFoundBarcode('')
    setScanInput('')
  }

  const handleQtyChange = (id: number, change: number) => {
    setItems(items.map(item => {
      if (item.id === id) {
        const newQty = Math.max(1, item.qty + change)
        return {
          ...item,
          qty: newQty,
          netPayable: newQty * (item.mrp - item.discount - item.promotion)
        }
      }
      return item
    }))
  }

  const handleDeleteItem = (id: number) => {
    setItems(items.filter(item => item.id !== id))
  }

  return (
    <div className="relative min-h-screen bg-gray-50 p-4">
      <div className="mx-auto max-w-[1800px]">
        {/* Header */}
        <div className="mb-4">
          <h1 className="text-xl font-semibold text-gray-800">
            Billing Item Data
          </h1>
        </div>

        {/* Scan Input Section */}
        <div className="bg-white rounded shadow border border-gray-200 p-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <input
                type="text"
                value={scanInput}
                onChange={(e) => setScanInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleScan()}
                placeholder="Scan barcode here..."
                className="w-full px-4 py-2.5 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base"
                autoFocus
              />
            </div>
            <button
              onClick={handleScan}
              className="px-6 py-2.5 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm font-medium"
            >
              Scan
            </button>
          </div>
        </div>

        {/* Table Section */}
        <div className="bg-white rounded shadow border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-slate-700 text-white">
                  <th className="px-4 py-3 text-left text-sm font-semibold border-r border-slate-600">
                    SI No.
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold border-r border-slate-600">
                    Barcode
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold border-r border-slate-600">
                    Item Name
                  </th>
                  <th className="px-4 py-3 text-center text-sm font-semibold border-r border-slate-600">
                    Qty.
                  </th>
                  <th className="px-4 py-3 text-right text-sm font-semibold border-r border-slate-600">
                    MRP
                  </th>
                  <th className="px-4 py-3 text-center text-sm font-semibold border-r border-slate-600">
                    Discount
                  </th>
                  <th className="px-4 py-3 text-center text-sm font-semibold border-r border-slate-600">
                    Promotion
                  </th>
                  <th className="px-4 py-3 text-right text-sm font-semibold border-r border-slate-600">
                    Net Payable
                  </th>
                  <th className="px-4 py-3 text-center text-sm font-semibold">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {items.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="px-4 py-8 text-center text-gray-500">
                      No items scanned yet. Start scanning barcodes to add items.
                    </td>
                  </tr>
                ) : (
                  items.map((item, index) => (
                    <tr 
                      key={item.id}
                      className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-4 py-3 text-sm">
                        {index + 1}
                      </td>
                      <td className="px-4 py-3 text-sm font-medium">
                        {item.barcode}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        {item.itemName}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleQtyChange(item.id, -1)}
                            className="w-7 h-7 flex items-center justify-center rounded bg-gray-200 hover:bg-gray-300 transition-colors"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="w-12 text-center font-medium">{item.qty}</span>
                          <button
                            onClick={() => handleQtyChange(item.id, 1)}
                            className="w-7 h-7 flex items-center justify-center rounded bg-gray-200 hover:bg-gray-300 transition-colors"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-right">
                        {item.mrp}
                      </td>
                      <td className="px-4 py-3 text-sm text-center">
                        {item.discount > 0 ? item.discount : '-'}
                      </td>
                      <td className="px-4 py-3 text-sm text-center">
                        {item.promotion > 0 ? item.promotion : '-'}
                      </td>
                      <td className="px-4 py-3 text-sm text-right font-semibold">
                        {item.netPayable}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <button
                          onClick={() => handleDeleteItem(item.id)}
                          className="inline-flex items-center justify-center w-8 h-8 rounded bg-red-100 hover:bg-red-200 text-red-600 transition-colors"
                          title="Delete item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Total Section */}
        {items.length > 0 && (
          <div className="mt-4 bg-white rounded shadow border border-gray-200 p-4">
            <div className="flex justify-end">
              <div className="text-right">
                <div className="text-sm text-gray-600">Total Items: {items.length}</div>
                <div className="text-sm text-gray-600">Total Quantity: {items.reduce((sum, item) => sum + item.qty, 0)}</div>
                <div className="text-xl font-bold text-gray-800 mt-2">
                  Total: ₹{items.reduce((sum, item) => sum + item.netPayable, 0)}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal for Item Not Found */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-2xl p-6 max-w-md w-full mx-4 relative">
            <button
              onClick={handleCloseModal}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
            
            <div className="text-center">
              <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <X className="w-8 h-8 text-red-600" />
              </div>
              
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Item Not Found
              </h2>
              
              <p className="text-gray-600 mb-4">
                The barcode <span className="font-mono font-semibold text-gray-800">{notFoundBarcode}</span> is not available in the database.
              </p>
              
              <button
                onClick={handleCloseModal}
                className="w-full px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default BillingItemData
