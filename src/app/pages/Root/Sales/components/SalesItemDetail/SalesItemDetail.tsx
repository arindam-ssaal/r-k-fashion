import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

function SalesItemDetail() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Item Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="sales-detail">Items descriptions</div>
      </CardContent>
    </Card>
  )
}

export default SalesItemDetail
