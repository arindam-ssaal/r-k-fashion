import { useFormContext } from "react-hook-form";

import { Checkbox } from "@/components/ui/checkbox";
import { FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";

function PaymodeConditions() {
  const { control } = useFormContext();

  const conditions = [
    { conditionId: 1, label: "Accept Denomination-Based Payments" },
    { conditionId: 2, label: "Allow Reference Details Capturing" },
    { conditionId: 3, label: "Accept Only Negative Payment Values" },
    { conditionId: 4, label: "Restrict Payments in This Mode" },
    { conditionId: 5, label: "Count-Based Payment Transfers" },
    { conditionId: 6, label: "Restrict Customer Loyalty Points" },
  ];

  return (
    <div className="item">
      <h3>Payment Mode-Specific Conditions</h3>
      <div className="space-y-3 mt-5">
        {conditions.map((condition, index) => (
          <FormField
            key={condition.conditionId}
            control={control}
            name={`objCondition.${index}.isEnabled`} // Bind to isEnabled
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3">
                <FormControl>
                  <Checkbox
                    checked={field.value === "Y"} // Check if value is "Y"
                    onCheckedChange={(checked) =>
                      field.onChange(checked ? "Y" : "N") // Update to "Y" or "N"
                    }
                  />
                </FormControl>
                <FormLabel>{condition.label}</FormLabel>
              </FormItem>
            )}
          />
        ))}
      </div>
    </div>
  );
}

export default PaymodeConditions;


  {/* 
<div className="item ml-6 mb-6  text-black">

  <div className="space-y-3">
      <div className="flex items-center space-x-2">
        <input
          className=""
          type="checkbox"
          name="paymentRestriction"
          onClick={handleCheckboxClick}
          // checked={showExtraOptions}
        />
        <Label>Restrict Payments in This Mode When:</Label>
      </div>

      <div className="ml-5">
        {showExtraOptions && (
          <RadioGroup defaultValue="comfortable" className="roles-radio">
            <div className="flex items-center space-x-2">
              <RadioGroupItem
                className=""
                value="itemPromotions"
                id="itemPromotions"
              />
              <Label htmlFor="itemPromotions" className="">
                Item-Level Promotions Are Applied
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem
                className=""
                value="billPromotions"
                id="billPromotions"
              />
              <Label htmlFor="billPromotions" className="">
                Bill-Level Promotions Are Applied
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem
                className=""
                value="anyPromotions"
                id="anyPromotions"
              />
              <Label htmlFor="anyPromotions" className="">
                Any Promotions Are Applied
              </Label>
            </div>
          </RadioGroup>
        )}
      </div>
    </div> 
    
</div>*/}