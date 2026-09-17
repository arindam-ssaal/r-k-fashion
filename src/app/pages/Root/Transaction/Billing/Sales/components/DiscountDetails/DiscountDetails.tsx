import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'

function DiscountDetails() {
  return (
    <div className="flex flex-col gap-6 p-6 max-w-lg mx-auto">
      <Card className="border shadow-md ">
        <CardHeader>
          <h2 className="text-lg font-semibold">Discount</h2>
        </CardHeader>
        <CardContent>
          <div className="w-full border border-gray-300 rounded-lg overflow-hidden">
            <div className="grid grid-cols-3 bg-gray-100 font-semibold text-gray-700 border-b border-gray-300">
              <div className="p-2">Discount Name</div>
              <div className="p-2 text-center"></div>
              <div className="p-2">Discount Details</div>
            </div>

            {/* {[
              { name: 'Buy 1 Get 1' },
              { name: 'Buy 2 @ 50%' },
              { name: 'Buy for 4999 get 10%' },
            ].map((promotion, index) => ( */}
              <div  className="grid grid-cols-3 border-b border-gray-300 items-center">
                <div className="p-2">General Discount</div>
                <div className="p-2 text-center">
                  <input type="checkbox" className="w-4 h-4" />
                </div>
                <div className="p-2 mr-3">
                 <label>10%</label>
                </div>
              </div>
              <div  className="grid grid-cols-3 border-b border-gray-300 items-center">
                <div className="p-2">Special Discount</div>
                <div className="p-2 text-center">
                  <input type="checkbox" className="w-4 h-4" />
                </div>
                <div className="p-2">
                <label>Rs. 101</label>
                </div>
              </div>
              <div  className="grid grid-cols-3 border-b border-gray-300 items-center">
                <div className="p-2">Employee Discount</div>
                <div className="p-2 text-center">
                  <input type="checkbox" className="w-4 h-4" />
                </div>
                <div className="p-2">
                <label>25%</label>
                </div>
              </div>
              <div  className="grid grid-cols-3 border-b border-gray-300 items-center">
                <div className="p-2">Family Discount</div>
                <div className="p-2 text-center">
                  <input type="checkbox" className="w-4 h-4" />
                </div>
                <div className="p-2">
                 <label>38%</label>
                </div>
              </div>
            {/* ))} */}
          </div>
          <div className="flex justify-between mt-4">
            <Button variant="outline">Cancel</Button>
            <Button>Apply</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
export default DiscountDetails
