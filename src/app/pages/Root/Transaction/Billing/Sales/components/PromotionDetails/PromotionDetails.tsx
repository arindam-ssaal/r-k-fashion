import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'

function PromotionDetails() {
  return (
    <div className="flex flex-col gap-6 p-6 max-w-lg mx-auto">
      <Card className="border shadow-md ">
        <CardHeader>
          <h2 className="text-lg font-semibold">Promotions</h2>
        </CardHeader>
        <CardContent>
          <div className="w-full border border-gray-300 rounded-lg overflow-hidden">
            <div className="grid grid-cols-3 bg-gray-100 font-semibold text-gray-700 border-b border-gray-300">
              <div className="p-2">Promotion Name</div>
              <div className="p-2 text-center"></div>
              <div className="p-2">Promotion Details</div>
            </div>

            {/* {[
              { name: 'Buy 1 Get 1' },
              { name: 'Buy 2 @ 50%' },
              { name: 'Buy for 4999 get 10%' },
            ].map((promotion, index) => ( */}
              <div  className="grid grid-cols-3 border-b border-gray-300 items-center">
                <div className="p-2">Buy 1 Get 1</div>
                <div className="p-2 text-center">
                  <input type="checkbox" className="w-4 h-4" />
                </div>
                <div className="p-2">
                  <input type="text" className="border p-2 w-full rounded-md" />
                </div>
              </div>
              <div  className="grid grid-cols-3 border-b border-gray-300 items-center">
                <div className="p-2">Buy 2 @ 50%</div>
                <div className="p-2 text-center">
                  <input type="checkbox" className="w-4 h-4" />
                </div>
                <div className="p-2">
                  <input type="text" className="border p-2 w-full rounded-md" />
                </div>
              </div>
              <div  className="grid grid-cols-3 border-b border-gray-300 items-center">
                <div className="p-2">Buy for 4999 get 10%</div>
                <div className="p-2 text-center">
                  <input type="checkbox" className="w-4 h-4" />
                </div>
                <div className="p-2">
                  <input type="text" className="border p-2 w-full rounded-md" />
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
export default PromotionDetails
