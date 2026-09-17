import { Card, CardContent, CardHeader } from '@/components/ui/card'

function PromotionBox() {
  return (
    <Card className="mt-auto mb-2">
      <CardHeader>
        <h2 className="heading-secondary"> Promitions </h2>
      </CardHeader>
      <CardContent className="space-y-1">
        <h3 className="text-sm">Details: </h3>
        <h3 className="text-sm">Name: </h3>
        <h3 className="text-sm">Conditions: </h3>
        <h3 className="text-sm">
          Promotion status: <strong>Applied</strong>/ <strong>Not Applied</strong>
        </h3>
      </CardContent>
    </Card>
  )
}

export default PromotionBox
