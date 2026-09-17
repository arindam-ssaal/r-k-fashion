import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

function LoyaltyPointsTab() {
  const loyaltyData = [
    {
      billNo: 'POSB/1001',
      billDate: '12-04-2024',
      billAmount: 2700,
      pointsEarned: 27,
      pointsRedeemed: 0,
      balance: 27,
    },
    {
      billNo: 'POSB/2039',
      billDate: '27-04-2024',
      billAmount: 3560,
      pointsEarned: 36,
      pointsRedeemed: 0,
      balance: 63,
    },
    {
      billNo: 'POB/3576',
      billDate: '17-05-2024',
      billAmount: 6754,
      pointsEarned: 68,
      pointsRedeemed: 0,
      balance: 131,
    },
    {
      billNo: 'POSB/5412',
      billDate: '03-06-2024',
      billAmount: 3430,
      pointsEarned: 0,
      pointsRedeemed: 100,
      balance: 31,
    },
  ]

  // Calculate the summary
  const pointsEarned = loyaltyData.reduce((sum, item) => sum + item.pointsEarned, 0)
  const pointsRedeemed = loyaltyData.reduce((sum, item) => sum + item.pointsRedeemed, 0)
  const balancePoint = loyaltyData[loyaltyData.length - 1].balance

  return (
    <div className="space-y-6 mt-5">
    <div>
      <h2 className="heading-secondary mb-3">Loyalty Points Details</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Bill No.</TableHead>
            <TableHead>Bill Date</TableHead>
            <TableHead>Bill Amount</TableHead>
            <TableHead>Points Earned</TableHead>
            <TableHead>Points Redeemed</TableHead>
            <TableHead>Balance</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loyaltyData.map((item, index) => (
            <TableRow key={index}>
              <TableCell>{item.billNo}</TableCell>
              <TableCell>{item.billDate}</TableCell>
              <TableCell>{item.billAmount}</TableCell>
              <TableCell>{item.pointsEarned}</TableCell>
              <TableCell>{item.pointsRedeemed}</TableCell>
              <TableCell>{item.balance}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>

    <div>
      <h3 className="heading-secondary mb-3">Summary</h3>
      <Table>
        <TableBody>
          <TableRow>
            <TableCell>Points Earned</TableCell>
            <TableCell>{pointsEarned}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Points Redeemed</TableCell>
            <TableCell>{pointsRedeemed}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Balance Point</TableCell>
            <TableCell>{balancePoint}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  </div>
  )
}

export default LoyaltyPointsTab
