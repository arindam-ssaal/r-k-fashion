import CouponDetails from '../CouponDetails'
import LoyaltyPoint from '../LoyaltyPoint'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

function MemberDetails() {
  return (
    <div>
      <Card className="p-3">
        <form className="  grid-cols-2 gap-2">
          <h1>MemberDetails</h1>
          <div className="grid w-full items-start gap-4">
            <div className="flex flex-col space-y-1.5 mt-3 float-start">
              <Label htmlFor="framework">MemberShip Type</Label>
              <Select>
                <SelectTrigger id="framework">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent position="popper">
                  <SelectItem value="next">Next.js</SelectItem>
                  <SelectItem value="sveltekit">SvelteKit</SelectItem>
                  <SelectItem value="astro">Astro</SelectItem>
                  <SelectItem value="nuxt">Nuxt.js</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="framework">MemberShip ID</Label>
              <Select>
                <SelectTrigger id="framework">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent position="popper">
                  <SelectItem value="next">Next.js</SelectItem>
                  <SelectItem value="sveltekit">SvelteKit</SelectItem>
                  <SelectItem value="astro">Astro</SelectItem>
                  <SelectItem value="nuxt">Nuxt.js</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="validFrom" typeof="date">
                Valid From
              </Label>
              <Input id="validFrom" placeholder="validFrom" type="date" />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="validTo" className="space-y-1.5">
                Valid To
              </Label>
              <Input id="validTO" placeholder="validTo" type="date" />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="name">Inactive</Label>
              <Input id="name" placeholder="inactive" />
            </div>
          </div>
        </form>
        <br />
        <LoyaltyPoint />
        <br />
        {/* <h1 className="font-bold">Coupon Details</h1> */}
        <CouponDetails />
        <div className="col-span-full text-end m-3 space-x-3">
          {/* <Button type="submit">Cancel</Button> */}
          <Button type="submit">Submit</Button>
        </div>
      </Card>
    </div>
  )
}

export default MemberDetails
